// Tester for lånekalkulatorens regnemotor (dist/laan-motor.js). Lukkede formler, egenskaper og grenser.
// Den uavhengige kontrollen i en annen implementasjon ligger i tests/laan-kontroll.test.py.
const assert=require('node:assert/strict');
const L=require('../dist/laan-motor.js');
const near=(a,b,label,tol=1e-6)=>assert.ok(Number.isFinite(a)&&Math.abs(a-b)<=Math.max(1,Math.abs(b))*tol,`${label}: ${a} mot ${b}`);
const base={kind:'bolig',type:'annuitet',amount:3000000,rate:5,years:25,establishmentFee:0,termFee:0,rateChanges:[],extraPayments:[]};
const plan=patch=>L.plan({...base,...patch});

// Felles egenskaper for alle planer: gjelden går til 0, aldri under 0, avdrag summerer seg til lånebeløpet,
// og samlet tilbakebetalt er lånebeløp + rente + gebyrer.
function invariants(p,label){
 const t=p.totals;let prev=p.input.amount;
 for(const r of p.rows){
  assert.ok(r.balance>=0,`${label}: negativ restgjeld i termin ${r.term}`);
  assert.ok(r.balance<=prev+1e-6,`${label}: restgjelden øker i termin ${r.term}`);
  near(prev-r.principal-r.extra,r.balance,`${label}: balanse termin ${r.term}`,1e-9);
  near(r.payment,r.interest+r.principal,`${label}: terminbeløp ${r.term}`,1e-12);
  near(r.total,r.payment+r.fee+r.extra,`${label}: totalt ${r.term}`,1e-12);
  prev=r.balance;
 }
 assert.equal(p.rows.at(-1).balance,0,`${label}: restgjeld til slutt`);
 near(t.principal,p.input.amount,`${label}: sum avdrag`,1e-9);
 near(t.paid,p.input.amount+t.interest+t.fees,`${label}: samlet tilbakebetalt`,1e-9);
 near(t.fees,t.establishmentFee+t.termFees,`${label}: gebyrer`,1e-12);
 near(t.termFees,p.input.termFee*p.rows.length,`${label}: ingen gebyr etter innfrielse`,1e-12);
 assert.equal(p.rows.length,p.payoffTerm);
 // Årssummene stemmer med terminene.
 const y=L.byYear(p);assert.equal(y.length,Math.ceil(p.payoffTerm/12),`${label}: antall år`);
 near(y.reduce((a,b)=>a+b.interest,0),t.interest,`${label}: årssum rente`,1e-9);
 near(y.reduce((a,b)=>a+b.paid,0),t.paid,`${label}: årssum betalt`,1e-9);
 assert.equal(y.at(-1).balance,0);
 // Betalingsstrømmen: utbetalt etter etableringsgebyr, deretter alt som betales.
 near(p.flows[0].amount,p.input.amount-p.input.establishmentFee,`${label}: utbetalt`,1e-12);
 near(-p.flows.slice(1).reduce((a,f)=>a+f.amount,0),t.paid-t.establishmentFee,`${label}: strøm`,1e-9);
}

// 1. Annuitet mot lukket formel: terminbeløp, restgjeld etter k terminer og samlet rente.
{
 const p=plan({}),i=0.05/12,n=300,A=3e6*i/(1-(1+i)**-n);
 near(p.firstPayment,A,'annuitet terminbeløp',1e-12);near(p.firstPayment,17537.70,'eksempel 17 538 kr',1e-6);
 for(const k of [1,12,60,150,299]){const B=3e6*(1+i)**k-A*((1+i)**k-1)/i;near(p.rows[k-1].balance,B,'annuitet restgjeld '+k,1e-8);}
 near(p.totals.interest,A*n-3e6,'annuitet samlet rente',1e-9);near(p.totals.interest,2261310.37,'eksempel 2,26 mill.',1e-8);
 for(const r of p.rows)near(r.payment,A,'likt terminbeløp '+r.term,1e-9);
 assert.equal(p.payoffTerm,300);invariants(p,'annuitet');
}
// 2. Serie mot lukket formel: likt avdrag, rente av restgjelden.
{
 const p=plan({type:'serie'}),i=0.05/12,n=300,d=3e6/n;
 near(p.firstPayment,d+3e6*i,'serie første termin');near(p.firstPayment,22500,'eksempel 22 500 kr');
 near(p.lastPayment,d*(1+i),'serie siste termin');
 near(p.totals.interest,i*3e6*(n+1)/2,'serie samlet rente');near(p.totals.interest,1881250,'eksempel 1,88 mill.');
 for(const r of p.rows)near(r.principal,d,'likt avdrag '+r.term,1e-9);
 invariants(p,'serie');
 // Serielån gir lavere samlet rente fordi gjelden nedbetales raskere, og de første terminene er høyere.
 const a=plan({});assert.ok(p.totals.interest<a.totals.interest);assert.ok(p.firstPayment>a.firstPayment);
}
// 3. Nullrente og én termin.
for(const type of L.TYPES){
 const z=plan({type,rate:0,amount:120000,years:10});
 for(const r of z.rows){near(r.payment,1000,`${type} 0 % terminbeløp`,1e-12);assert.equal(r.interest,0);}
 assert.equal(z.totals.interest,0);invariants(z,type+' 0 %');
 const one=plan({type,years:1/12,amount:100000,rate:12});
 assert.equal(one.payoffTerm,1);near(one.firstPayment,101000,`${type} én termin`,1e-12);invariants(one,type+' én termin');
}

// 3b. Svært lav rente (GPT 3.11.2026). Betalingene skal ligge tett på nullrentetilfellet, termin for termin.
// Den naive annuitetsformelen ga hele lånet i første termin ved 1e-15 % og skjeve terminer ved 1e-10 %.
for(const rate of [1e-15,1e-12,1e-10,1e-8,1e-6,1e-4]){
 const i=rate/1200,n=300,flat=3e6/n,approx=flat*(1+i*(n+1)/2);
 for(const type of L.TYPES){
  const p=plan({type,rate});assert.equal(p.payoffTerm,300,`${type} ${rate} %: antall terminer`);
  for(const r of p.rows){
   const expected=type==='annuitet'?approx:flat+(3e6-flat*(r.term-1))*i;
   near(r.payment,expected,`${type} ${rate} %: termin ${r.term}`,1e-9);
  }
  // Tilnærmingen er av første orden, så samlet rente sjekkes med en grense på 1 øre. Den eksakte kontrollen er i Python.
  assert.ok(Math.abs(p.totals.interest-(type==='annuitet'?approx*n-3e6:i*3e6*(n+1)/2))<0.01,`${type} ${rate} %: samlet rente ${p.totals.interest}`);
  assert.ok(p.totals.interest>=0&&p.totals.interest<=3e6*i*n,`${type} ${rate} %: rente innenfor grensene`);
  invariants(p,`${type} ${rate} %`);
 }
 // Ekstra innbetaling og renteendring ved svært lav rente: samme forkorting som ved 0 %.
 const e=plan({rate,extraPayments:[{term:60,amount:500000}]}),z=plan({rate:0,extraPayments:[{term:60,amount:500000}]});
 assert.equal(e.payoffTerm,z.payoffTerm,`${rate} %: forkortet løpetid som ved 0 %`);
 for(const r of e.rows.slice(0,-1))near(r.payment,z.rows[r.term-1].payment,`${rate} %: ekstra, termin ${r.term}`,Math.max(1e-9,2*i*n));
 // Siste termin er resten. Ved positiv rente er terminbeløpet litt høyere enn ved 0 %, så resten blir litt lavere.
 near(e.lastPayment,e.rows.at(-2).balance*(1+i),`${rate} %: siste termin er restgjeld pluss rente`,1e-12);
 if(rate<=1e-6)assert.ok(Math.abs(e.lastPayment-z.lastPayment)<1,`${rate} %: siste termin ${e.lastPayment} mot ${z.lastPayment}`);
 invariants(e,`${rate} % ekstra`);
 const c=plan({rate:5,rateChanges:[{term:100,rate}]});
 for(const r of c.rows.slice(99,-1))near(r.payment,c.rows[99].payment,`renteendring til ${rate} %, termin ${r.term}`,1e-9);
 invariants(c,`renteendring til ${rate} %`);
}
near(L.annuityPayment(3e6,1e-17,300),1e4*(1+1e-17*301/2),'rente nær tallpresisjonen',1e-14);

// 4. Renteendring. Annuitet: nytt terminbeløp over gjenværende løpetid, samme sluttermin. Serie: avdraget beholdes.
{
 const k=61,p=plan({rateChanges:[{term:k,rate:7}]}),before=plan({}).rows[k-2].balance;
 const A2=L.annuityPayment(before,0.07/12,300-k+1);
 for(let t=1;t<k;t++)near(p.rows[t-1].payment,17537.701245239405,'før endring '+t,1e-9);
 near(p.rows[k-1].interest,before*0.07/12,'ny rente gjelder hele terminen',1e-12);
 for(let t=k;t<=300;t++)near(p.rows[t-1].payment,A2,'etter endring '+t,1e-8);
 assert.equal(p.payoffTerm,300);assert.equal(p.rows[k-1].rate,7);invariants(p,'annuitet renteendring');
 const s=plan({type:'serie',rateChanges:[{term:k,rate:7}]});
 for(const r of s.rows)near(r.principal,10000,'serie avdrag uendret '+r.term,1e-9);
 assert.equal(s.payoffTerm,300);near(s.rows[k-1].interest,s.rows[k-2].balance*0.07/12,'serie ny rente');invariants(s,'serie renteendring');
 // Renten kan også gå ned, og til 0 %.
 invariants(plan({rateChanges:[{term:2,rate:0}]}),'rente til 0 %');
 // Flere endringer.
 invariants(plan({rateChanges:[{term:13,rate:6},{term:25,rate:4},{term:200,rate:8}]}),'flere renteendringer');
}

// 5. Ekstra innbetaling. Annuitet: samme terminbeløp, kortere løpetid. Serie: samme avdrag, kortere løpetid.
{
 const p=plan({extraPayments:[{term:60,amount:500000}]}),A=17537.701245239405,orig=plan({});
 for(const r of p.rows.slice(0,-1))near(r.payment,A,'samme terminbeløp '+r.term,1e-9);
 assert.ok(p.lastPayment<=A+1e-6,'siste termin er resten');
 assert.ok(p.payoffTerm<300);assert.ok(p.totals.interest<orig.totals.interest);
 near(p.rows[59].extra,500000,'ekstra brukt');invariants(p,'annuitet ekstra');
 // Løpetiden er det minste antall terminer som betaler ned resten med samme terminbeløp.
 const B=p.rows[59].balance,i=0.05/12,need=-Math.log(1-B*i/A)/Math.log1p(i);assert.equal(p.payoffTerm,60+Math.ceil(need));
 const s=plan({type:'serie',extraPayments:[{term:60,amount:500000}]});
 for(const r of s.rows.slice(0,-1))near(r.principal,10000,'serie samme avdrag '+r.term,1e-9);
 assert.equal(s.payoffTerm,250,'serie: 500 000 kr tilsvarer 50 avdrag');invariants(s,'serie ekstra');
 // Ekstra innbetaling i første og siste termin.
 invariants(plan({extraPayments:[{term:1,amount:1}]}),'ekstra første termin');
 const last=plan({extraPayments:[{term:300,amount:1000}]});assert.equal(last.rows[299].extra,0,'ingen gjeld å betale ekstra på i siste termin');invariants(last,'ekstra siste termin');
}

// 6. Ekstra innbetaling større enn restgjelden: begrenses til restgjelden, lånet innfris, ingen gebyrer etterpå.
for(const type of L.TYPES){
 const p=plan({type,termFee:50,establishmentFee:2500,extraPayments:[{term:24,amount:1e9}]});
 assert.equal(p.payoffTerm,24,type+': innfridd i termin 24');assert.equal(p.rows.length,24);
 near(p.rows[23].extra,p.rows[22].balance-p.rows[23].principal,type+': ekstra lik restgjelden',1e-9);
 assert.equal(p.notes[0].kind,'extraCapped');assert.equal(p.notes[0].term,24);
 near(p.totals.termFees,24*50,type+': gebyr bare til innfrielse',1e-12);invariants(p,type+' innfrielse');
}

// 7. Renteendring og ekstra innbetaling i samme termin: ny rente for hele terminen, så terminen, så ekstra.
{
 const k=60,p=plan({rateChanges:[{term:k,rate:7}],extraPayments:[{term:k,amount:500000}]}),B0=plan({}).rows[k-2].balance;
 const A2=L.annuityPayment(B0,0.07/12,300-k+1);
 near(p.rows[k-1].interest,B0*0.07/12,'ny rente først',1e-12);near(p.rows[k-1].payment,A2,'så termin med nytt beløp',1e-9);
 near(p.rows[k-1].balance,B0-(A2-B0*0.07/12)-500000,'så ekstra',1e-9);
 for(const r of p.rows.slice(k,-1))near(r.payment,A2,'nytt beløp holdes, tiden kortes '+r.term,1e-9);
 invariants(p,'samme termin');
 // Rekkefølgen motsatt i tid: ekstra først, renteendring senere. Nytt beløp regnes over den forkortede løpetiden.
 const q=plan({extraPayments:[{term:60,amount:500000}],rateChanges:[{term:100,rate:7}]}),end=plan({extraPayments:[{term:60,amount:500000}]}).payoffTerm;
 assert.equal(q.payoffTerm,end,'renteendring beholder den forkortede sluttermin');
 near(q.rows[99].payment,L.annuityPayment(q.rows[98].balance,0.07/12,end-100+1),'nytt beløp over gjenværende terminer',1e-9);
 invariants(q,'ekstra så renteendring');
}

// 8. Hendelser etter innfrielse regnes ikke, men noteres.
{
 const p=plan({extraPayments:[{term:12,amount:1e9},{term:24,amount:1000}],rateChanges:[{term:36,rate:9}]});
 assert.equal(p.payoffTerm,12);
 assert.deepEqual(p.notes.map(x=>x.kind).sort(),['extraAfterPayoff','extraCapped','rateChangeAfterPayoff']);
}

// 9. Gebyrer. Forbrukslån med etablerings- og termingebyr.
{
 const p=plan({kind:'forbruk',amount:100000,rate:12,years:5,establishmentFee:950,termFee:45});
 near(p.totals.fees,950+60*45,'gebyrer');near(p.totals.paid,100000+p.totals.interest+950+2700,'samlet tilbakebetalt');
 for(const r of p.rows){assert.equal(r.fee,45);near(r.total,r.payment+45,'termin med gebyr',1e-12);}
 near(p.firstPayment,L.annuityPayment(100000,0.01,60),'gebyr påvirker ikke renten',1e-12);
 invariants(p,'forbrukslån');
 const y=L.byYear(p);near(y[0].fees,950+12*45,'etableringsgebyr i år 1',1e-12);
}

// 10. Tilfeldige planer: egenskapene holder for alle kombinasjoner.
let seed=2026;const rnd=()=>((seed=(seed*16807)%2147483647)-1)/2147483646;
let count=0;
for(let c=0;c<400;c++){
 const years=Math.max(1,Math.round(rnd()*600))/12,n=Math.round(years*12),pick=()=>1+Math.floor(rnd()*n);
 const s={kind:L.KINDS[c%3],type:L.TYPES[c%2],amount:1000+rnd()*5e6,rate:rnd()<.1?0:rnd()*20,years,establishmentFee:rnd()<.5?0:rnd()*900,termFee:rnd()<.5?0:rnd()*80,
  rateChanges:rnd()<.5?[]:[{term:pick(),rate:rnd()*15}],extraPayments:rnd()<.5?[]:[{term:pick(),amount:rnd()*2e6+1}]};
 invariants(L.plan(s),'tilfeldig '+c);count++;
}

// 11. Grenser og feilmeldinger med feltnavn.
for(const [patch,field] of [[{amount:0},'amount'],[{amount:-1},'amount'],[{amount:2e9},'amount'],[{amount:NaN},'amount'],[{rate:-0.1},'rate'],[{rate:100.1},'rate'],[{rate:NaN},'rate'],
 [{years:0},'years'],[{years:51},'years'],[{years:1/30},'years'],[{years:1/24},'years'],[{years:0.0833},'years'],[{establishmentFee:-1},'establishmentFee'],[{termFee:-1},'termFee'],[{termFee:1e6},'termFee'],
 [{amount:1000,establishmentFee:1000},'establishmentFee'],[{kind:'kreditt'},'kind'],[{type:'rammelån'},'type'],
 [{rateChanges:[{term:0,rate:5}]},'changeRateTerm'],[{rateChanges:[{term:301,rate:5}]},'changeRateTerm'],[{rateChanges:[{term:1.5,rate:5}]},'changeRateTerm'],[{rateChanges:[{term:10,rate:-1}]},'changeRate'],
 [{extraPayments:[{term:10,amount:0}]},'extraAmount'],[{extraPayments:[{term:10,amount:NaN}]},'extraAmount'],[{extraPayments:[{term:400,amount:5}]},'extraAmountTerm']]){
 try{L.validate({...base,...patch});assert.fail('godtatt: '+JSON.stringify(patch));}catch(e){assert.equal(e.field,field,JSON.stringify(patch)+': '+e.message);}
}
for(const patch of [{rate:0},{rate:100},{years:1/12},{years:50},{years:1.04},{amount:1},{amount:1e9},{establishmentFee:0},{termFee:0},{rateChanges:[{term:300,rate:0}]},{extraPayments:[{term:1,amount:1e10}]}])
 assert.doesNotThrow(()=>L.validate({...base,...patch}),JSON.stringify(patch));
assert.equal(L.fieldError('rate',101),'«Nominell årsrente» må være fra 0 % til 100 %.');
assert.equal(L.fieldError('amount',0).replace(/\s/g,' '),'«Lånebeløp» må være over 0 kr og opptil 1 000 000 000 kr.');
assert.equal(L.fieldError('years',NaN),'Fyll inn et gyldig tall i «Nedbetalingstid».');
assert.equal(L.fieldError('years',0),'«Nedbetalingstid» må være fra én måned til 50 år.');
assert.throws(()=>L.plan({...base,rate:NaN}),/Nominell årsrente/,'plan() regner ikke med ugyldige verdier');

// 12. Detaljnivå: valg gjort på et høyere nivå regnes med og listes når de er skjult.
{
 const s={...base,establishmentFee:2500,termFee:50,extraPayments:[{term:60,amount:100000}]};
 assert.deepEqual(L.hiddenActive(s,'simple').map(x=>x.key),['establishmentFee','termFee','extraPayments']);
 assert.deepEqual(L.hiddenActive(s,'explore'),[]);assert.deepEqual(L.hiddenActive(s,'advanced'),[]);
 assert.deepEqual(L.hiddenActive({...s,kind:'forbruk'},'simple').map(x=>x.key),['extraPayments'],'forbrukslån viser gebyrene i Enkel');
 assert.deepEqual(L.hiddenActive(base,'simple'),[]);
 // Skjult betyr ikke borte: resultatet er det samme uansett nivå, fordi motoren ikke kjenner nivået.
 const p=L.plan(s);assert.ok(p.totals.fees>0&&p.totals.extra>0);
 assert.ok(L.visibleFields('simple','forbruk').includes('termFee'));assert.ok(!L.visibleFields('simple','bolig').includes('termFee'));
}

console.log(`Lånemotoren: lukkede formler, renteendring, ekstra innbetaling, innfrielse, gebyrer, ${count} tilfeldige planer, grenser og detaljnivå bestått.`);
