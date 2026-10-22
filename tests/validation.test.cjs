// Regresjonstester for valideringen: sparemål, feltnavn, uttak, delte lenker og lagrede planer.
// Kjøres med: node tests/validation.test.cjs
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const errorOf=fn=>{try{fn();}catch(e){return e;}assert.fail('expected an error');};

// K2: Sparemålets feil skal peke på sparemålets egne felt og bruke sparemålets feltnavn.
const dreamCases=[
 ['dreamMonthly',2e7,/«Jeg kan spare per måned»/],['dreamMonthly',-1,/«Jeg kan spare per måned»/],
 ['dreamYears',150,/«Tid til kjøpet»/],['dreamYears',0,/«Tid til kjøpet».*én måned/],['dreamYears',1/30,/én måned/],
 ['dreamCost',2e11,/«Budsjett for kjøpet»/],['dreamStart',2e10,/«Allerede satt av»/],
 ['dreamInflation',200,/«Årlig prisvekst for kjøpet»/],['dreamInflation',-100,/«Årlig prisvekst for kjøpet»/],
 ['dreamSafe',150,/«Bank \/ lavere risiko»/],['dreamModerate',-100,/«Moderat risiko»/],['dreamRisk',NaN,/gyldig tall i «Høyere risiko»/],
];
for(const [key,value,message] of dreamCases){
 const e=errorOf(()=>E.dreamPlans({...E.defaults,[key]:value}));
 assert.equal(e.field,key,`${key}=${value} must mark ${key}, not ${e.field}`);
 assert.match(e.message,message);
 assert.doesNotMatch(e.message,/Sparing per måned|Sparetid|Antatt årlig vekst|Sparemålet/,'no labels from the savings calculator');
}
// Grensene i sparemålet tåler yttergrensene uten feil.
for(const patch of [{dreamYears:1/12},{dreamYears:0.0833},{dreamYears:0.08},{dreamYears:1/24},{dreamYears:100},{dreamMonthly:1e7},{dreamCost:1e11},{dreamRisk:100},{dreamSafe:0},{dreamInflation:0},{dreamMonthly:0}])
 assert.doesNotThrow(()=>E.dreamPlans({...E.defaults,...patch}),JSON.stringify(patch));
// Sparemålets felt gjenbruker kalkulatorens grenser, slik at den interne kontrollen aldri feiler med feil feltnavn.
const pairs=[['dreamCost','goal'],['dreamStart','start'],['dreamMonthly','monthly'],['dreamInflation','inflation'],['dreamSafe','rate']];
for(const [d,m] of pairs)for(const k of ['max','open'])assert.equal(E.DREAM_FIELDS[d][k],E.FIELDS[m][k],`${d}.${k} must match ${m}.${k}`);

// V4: Etiketten som vises på skjermen brukes når nettsiden oppgir den.
assert.match(errorOf(()=>E.validate({...E.defaults,rate:150},()=> 'Årlig avkastning')).message,/«Årlig avkastning»/);
assert.match(errorOf(()=>E.validate({...E.defaults,monthly:2e7})).message,/«Du sparer hver måned»/);
assert.match(errorOf(()=>E.validate({...E.defaults,years:500})).message,/«Du vil spare i»/);

// Uttak: feil i beregningen peker på feltet som må rettes.
const capital=1e6;
assert.equal(errorOf(()=>E.withdrawal({...E.defaults,retireYears:0},capital)).field,'retireYears');
assert.equal(errorOf(()=>E.withdrawal({...E.defaults,extraWithdraw:1000,extraWithdrawYear:2.5},capital)).field,'extraWithdrawYear');
assert.equal(errorOf(()=>E.withdrawal({...E.defaults,extraWithdraw:-1},capital)).field,'extraWithdraw');
assert.doesNotThrow(()=>E.withdrawal({...E.defaults,extraWithdraw:0,extraWithdrawYear:2.5},capital),'year is irrelevant without an extra withdrawal');

// V1–V3: Delte lenker kontrolleres felt for felt.
const link=q=>E.sanitize(Object.fromEntries(new URLSearchParams(q)),{text:true});
let r=link('start=100000&monthly=5000&years=500&rate=6');
assert.deepEqual(r.rejected,['years']);assert.equal(r.allReset,false);
assert.equal(r.state.years,E.defaults.years);assert.equal(r.state.monthly,5000);assert.equal(r.state.start,100000);assert.equal(r.state.rate,6);
r=link('dreamYears=500&dreamMonthly=4000');assert.deepEqual(r.rejected,['dreamYears']);assert.equal(r.state.dreamMonthly,4000);
r=link('withdrawMode=tull&activePage=dreams&taxModel=x&dreamType=yacht&withdrawBase=initial');
assert.deepEqual(r.rejected.sort(),['dreamType','taxModel','withdrawMode']);assert.equal(r.state.activePage,'dreams');assert.equal(r.state.withdrawBase,'initial');
r=link('monthly=&real=2&goalReal=1&rate=abc&inflation=Infinity&fee=0x10');
assert.deepEqual(r.rejected.sort(),['fee','inflation','monthly','rate','real']);assert.equal(r.state.goalReal,true);assert.equal(r.state.monthly,E.defaults.monthly);
r=link('taxRate=150&taxableShare=40&userAge=130&taxShield=-1');assert.deepEqual(r.rejected.sort(),['taxRate','taxShield','userAge']);assert.equal(r.state.taxableShare,40);
r=link('foo=1&level=advanced');assert.deepEqual(r.rejected,[]);assert.deepEqual(r.state,E.defaults,'unknown keys are ignored');
// Alle standardverdier og en gyldig delt plan går gjennom uendret.
const roundTrip=state=>link(new URLSearchParams(Object.entries(state).map(([k,v])=>[k,typeof v==='boolean'?(v?'1':'0'):String(v)])).toString());
r=roundTrip(E.defaults);assert.deepEqual(r.rejected,[]);assert.deepEqual(r.state,E.defaults);

// Eldre lenker med negativ forventet vekst, prisvekst eller bankrente settes til 0 % og rapporteres.
r=link('rate=-2&inflation=-1&bank=-0.5&growth=-10&dreamRisk=-5&monthly=3000');
assert.deepEqual(r.adjusted.map(a=>a.key).sort(),['bank','dreamRisk','inflation','rate']);assert.deepEqual(r.adjusted.find(a=>a.key==='rate'),{key:'rate',from:-2});
assert.deepEqual(r.rejected,[]);assert.deepEqual([r.state.rate,r.state.inflation,r.state.bank,r.state.dreamRisk,r.state.growth,r.state.monthly],[0,0,0,0,-10,3000],'growth may still be negative');
r=link('rate=-150');assert.equal(r.state.rate,0);assert.deepEqual(r.adjusted,[{key:'rate',from:-150}]);
r=link('rate=abc');assert.deepEqual(r.rejected,['rate']);assert.equal(r.state.rate,E.defaults.rate,'unreadable text is still rejected, not set to 0');
r=E.sanitize({rate:-3,monthly:2500});assert.equal(r.state.rate,0);assert.deepEqual(r.adjusted,[{key:'rate',from:-3}]);assert.equal(r.state.monthly,2500);
// Lagrede planer (typede verdier) kontrolleres på samme måte.
r=E.sanitize({years:500,monthly:4321,rate:'6',withdrawMode:'tull',real:'yes'});
assert.deepEqual(r.rejected.sort(),['rate','real','withdrawMode','years']);assert.equal(r.state.monthly,4321);
r=E.sanitize({monthly:3000});assert.deepEqual(r.rejected,[]);assert.equal(r.state.years,E.defaults.years,'missing fields from older plans get defaults');

// D: Realistiske planer skal gi samme resultat som før og bestå delte lenker uendret.
// Uavhengig kontroll: sluttverdi med månedlige innskudd ved månedsslutt og effektiv årlig rente.
function closedForm(p){const g=(1+p.rate/100)*(1-p.fee/100),m=Math.pow(g,1/12)-1,n=Math.round(p.years*12);return p.start*Math.pow(g,p.years)+(m===0?p.monthly*n:p.monthly*(Math.pow(1+m,n)-1)/m);}
const realistic=[
 {start:0,monthly:1000,years:18,rate:5,fee:0.2},       // barnesparing
 {start:50000,monthly:3000,years:30,rate:6,fee:0.3},   // langsiktig fond
 {start:200000,monthly:5000,years:10,rate:4,fee:0.5},  // middels horisont
 {start:20000,monthly:2000,years:3,rate:3.5,fee:0},     // sparekonto
 {start:1000000,monthly:0,years:20,rate:0,fee:0.5},    // 0 % vekst, kostnaden gir tap
 {start:0,monthly:10000,years:40,rate:7,fee:0.1},
];
for(const p of realistic){
 const s={...E.defaults,...p,growth:0,extra:0,crash:0};
 assert.doesNotThrow(()=>E.validate(s),JSON.stringify(p));
 const v=E.value(s,s.years),c=closedForm(s);
 assert(Math.abs(v-c)<=Math.max(1e-6,Math.abs(c)*1e-10),`${JSON.stringify(p)}: ${v} vs ${c}`);
 r=roundTrip(s);assert.deepEqual(r.rejected,[]);assert.equal(E.value(r.state,r.state.years),v,'shared link must reproduce the result exactly');
}
// Børsfall i et fond: verdien blir aldri negativ, heller ikke ved 100 % fall.
for(const crash of [50,90,100])for(const crashYear of [0,5,20]){const s={...E.defaults,start:200000,monthly:3000,years:20,rate:7,fee:0.2,crash,crashYear};
 for(let m=0;m<=240;m++){const v=E.value(s,m/12);assert(v>=0,`crash ${crash} % at year ${crashYear}, month ${m}: ${v}`);}}
assert.equal(E.value({...E.defaults,start:500000,monthly:0,years:10,crash:100,crashYear:10},10),0);
// Standardplanen er låst mot en kjent verdi (305 434 kr på siden i dag).
assert.equal(Math.round(E.value(E.defaults,E.defaults.years)),305434);
// Sparemål for standardplanen er uendret: nødvendig sparing gir målet.
for(const p of E.dreamPlans(E.defaults))assert(Math.abs(E.value(p.plan,p.plan.years,p.plan.rate,0,p.required)-p.goal)<1e-6*p.goal);

console.log('Validation: goal fields and labels, screen labels, withdrawal fields, field-by-field links, saved plans and 6 realistic plans against closed form passed.');
