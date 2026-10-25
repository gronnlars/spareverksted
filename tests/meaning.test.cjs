// «Dette betyr tallene dine»: forklaringene skal følge tallene, valgt spareform og tidshorisont.
const assert=require('node:assert/strict');
const E=require('../dist/engine.js'),M=require('../dist/meaning.js');
const nf=new Intl.NumberFormat('nb-NO',{maximumFractionDigits:0}),dec=new Intl.NumberFormat('nb-NO',{maximumFractionDigits:2});
const f={money:x=>nf.format(x)+' kr',pct:v=>(v<0?'−':'')+dec.format(Math.abs(v))+' %'};
const base={...E.defaults,crash:0,extra:0,growth:0};
const build=over=>{const s={...base,...over};return M.build(E,s,s.years,f);};
const all=m=>m.main+' '+m.details.map(d=>d.title+': '+d.text).join(' ')+' '+m.actions.map(a=>a.label+' '+(a.text||'')).join(' ');

// 1. Engangsbeløp, 0 % rente og 2,5 % prisvekst: uendret kontobeløp, lavere kjøpekraft.
{const m=build({start:100000,monthly:0,rate:0,fee:0,years:10});
 assert.equal(m.main,'Beløpet på kontoen er uendret, men pengene kjøper mindre etter hvert som prisene stiger.');
 assert.match(all(m),/tilsvarer sluttbeløpet 78\s120 kr i dagens kroner/);assert.match(all(m),/21\s880 kr mindre kjøpekraft/);}
// 2. Engangsbeløp med lav rente: flere kroner, men prisene stiger raskere.
{const m=build({start:100000,monthly:0,rate:0.2,fee:0,years:10});assert.equal(m.main,'Du får flere kroner på kontoen, men prisene stiger raskere enn pengene vokser.');}
// 3. Løpende innbetalinger uten avkastning: saldoen øker bare av innskuddene. Innbetalinger skilles fra avkastning.
{const m=build({start:0,monthly:2000,rate:0,fee:0,years:10});
 assert.match(m.main,/^Saldoen øker bare fordi du setter inn nye penger\./);
 assert.match(all(m),/Du setter inn 240\s000 kr\. Avkastning etter kostnader: 0 kr\./);
 assert.match(all(m),/En høyere saldo viser ikke alene at kjøpekraften er bevart/);}
// 4. Løpende innbetalinger med avkastning under prisveksten (kontrolltilfellet fra PR #12).
{const m=build({start:0,monthly:2000,rate:2,fee:0.2,years:10});
 assert.match(m.main,/^Saldoen øker av innskuddene og avkastningen, men prisene stiger raskere enn pengene vokser\./);
 assert.match(all(m),/212\s446 kr i dagens kroner/);assert.match(all(m),/7\s387 kr mindre kjøpekraft/);}
// 5. Avkastning over prisveksten: økt kjøpekraft vises også.
{const m=build({start:0,monthly:2000,rate:5,fee:0.2,years:10});assert.match(m.main,/^Avkastningen er større enn prisveksten/);assert.match(all(m),/26\s159 kr mer kjøpekraft/);}
// 6. 0 % prisvekst: kroner og kjøpekraft er det samme, og ingen kjøpekraftsgruppe.
{const m=build({start:10000,monthly:2000,rate:3,inflation:0,years:10});assert.match(m.main,/^Med 0 % prisvekst er kroner og kjøpekraft det samme/);assert.ok(!m.details.some(d=>d.title==='Kroner og kjøpekraft'));}
// 7. Negativ avkastning: tap i kroner, og nedgangen beskrives som årlig, ikke som ett fall.
{const m=build({start:10000,monthly:2000,rate:-3,fee:0.2,years:10});
 assert.equal(m.main,'Både kronebeløpet og kjøpekraften blir lavere enn det du har satt inn.');
 assert.match(all(m),/−3 % er en nedgang hvert år gjennom hele perioden, ikke ett enkelt fall/);
 const c=build({start:10000,monthly:2000,rate:5,fee:0.2,years:10,crash:40,crashYear:9});assert.match(all(c),/Børsfallet på 40 % er et enkelt fall, ikke en årlig nedgang/);}
// 8. Fallende prisnivå (bare mulig i motoren; skjemaet har 0 % som nedre grense): kjøpekraften blir høyere enn kronebeløpet.
{const m=build({start:100000,monthly:0,rate:0,fee:0,inflation:-1,years:10});
 assert.match(m.main,/kan kjøpe mer enn startbeløpet/);assert.ok(m.numbers.real>m.numbers.final);assert.match(all(m),/mer kjøpekraft/);}

// 9. Spareformen gjettes aldri. 8 % uten valg nevner ingen konto.
{const m=build({start:0,monthly:2000,rate:8,fee:0,years:10});assert.doesNotMatch(all(m),/sparekonto|brukskonto|indeksfond/i);}
// 10. Sparekonto med 8 %: saklig forutsetning, ingen påstand om inflasjon. Lavere rente vises uten å endre tallene.
{const s={...base,start:0,monthly:2000,rate:8,fee:0,years:10,savingsType:'savings'},m=M.build(E,s,10,f);
 assert.match(all(m),/Beregningen forutsetter 8 % rente på sparekontoen gjennom hele perioden\. Kontroller at renten stemmer med kontovilkårene\. Endres renten, blir resultatet annerledes\./);
 assert.doesNotMatch(m.main,/Kontroller at renten/,'kontovilkårene ligger i fordypningen');
 assert.match(m.main,/Renter beskattes hvert år/,'skatteforbeholdet er fortsatt synlig');
 assert.doesNotMatch(all(m),/inflasjon|uvanlig|høy rente/i);
 const a=m.actions.find(x=>x.id==='lowerRate');assert.match(a.label,/lavere rente/);assert.match(a.text,/Med 6 % rente i stedet for 8 %/);assert.match(a.text,/Tallene dine er ikke endret/);
 assert.equal(s.rate,8,'brukerens tall er uendret');}
// 11. Brukskonto mens vekst og kostnad står på startverdiene: sies tydelig, ikke framstilt som representativt.
{const m=build({savingsType:'checking'});
 assert.match(m.main,/Du har valgt brukskonto, men beregningen bruker fortsatt startverdiene 5 % vekst og 0,2 % kostnad\. De er ikke vilkår for en brukskonto\. Legg inn kontoens rente og eventuelle kostnader\./);
 assert.ok(!m.actions.some(a=>a.id==='lowerRate'),'ingen sammenligning før egne tall er lagt inn');
 assert.doesNotMatch(all(m),/tap/,'brukskonto framstilles ikke som et automatisk tap');}
// 12. Indeksfond: kan falle i verdi, jevn vekst er ikke svingningene, og 5 % er en startverdi. Globalt aksjeindeksfond presiseres.
{const m=build({savingsType:'index'});
 assert.match(m.main,/Et indeksfond kan falle mye i verdi underveis, men beregningen viser en jevn utvikling på 5 % hvert år\./);assert.match(all(m),/5 % vekst, 0,2 % kostnad og 2,5 % prisvekst er startverdier, ikke anbefalinger\./);assert.match(all(m),/og 2,5 % prisvekst\. Alt er før skatt\./);
 assert.match(all(m),/globalt aksjeindeksfond/);assert.ok(!m.actions.some(a=>a.id==='range'),'utfallsrom styres ved grafen');
 assert.doesNotMatch(all(m),/sikker|garantert/i,'indeksfond framstilles ikke som sikker gevinst');}
// 13. Risikovalget brukes bare når det gir mening, og omtales som brukerens egen vurdering.
{assert.match(build({savingsType:'index',riskChosen:true,stress:'low'}).main,/ Du har selv oppgitt at du helst vil unngå store fall\. Et indeksfond/);
 for(const stress of ['medium','high'])assert.doesNotMatch(all(build({savingsType:'index',riskChosen:true,stress})),/oppgitt|tåler/);
 assert.doesNotMatch(all(build({savingsType:'savings',riskChosen:true,stress:'low',rate:3,fee:0})),/oppgitt/);}
// 14. Spareformen endrer ingen tall.
{const plain=build({start:5000,monthly:1500,rate:4,fee:0.3,years:15});
 for(const savingsType of ['checking','savings','index'])assert.deepEqual(build({start:5000,monthly:1500,rate:4,fee:0.3,years:15,savingsType}).numbers,plain.numbers);}
// 15. Ingen tankestreker i teksten.
for(const over of [{},{savingsType:'checking'},{savingsType:'savings',rate:3,fee:0},{savingsType:'index',rate:-2},{inflation:0},{start:100000,monthly:0,rate:0,fee:0}])assert.doesNotMatch(all(build(over)),/[–—]/);
// Sparekonto: før skatt over prisveksten, etter skatt under. Forbeholdet skal stå, og «Renten» brukes for konto.
{const A=require('../dist/assumptions.js'),s={...base,start:0,monthly:2000,rate:2.87,fee:0,years:10,savingsType:'savings'};
 const m=M.build(E,s,s.years,f,A);
 assert.match(m.main,/^Renten er større enn prisveksten/);
 assert.match(m.main,/Det gjelder før skatt\. Etter 22 % skatt på rentene blir renten omtrent 2,24 %, lavere enn prisveksten på 2,5 %/);
 // Uten forutsetningene (A) vises ikke forbeholdet, og ingen tall gjettes.
 assert.doesNotMatch(M.build(E,s,s.years,f).main,/Det gjelder før skatt/);
 // Høy rente: etter skatt fortsatt over prisveksten, ingen forbehold.
 assert.doesNotMatch(M.build(E,{...s,rate:4},10,f,A).main,/Det gjelder før skatt/);
 // Indeksfond får ikke kontoforbeholdet.
 assert.doesNotMatch(M.build(E,{...s,savingsType:'index',rate:7.11,fee:0.2},10,{...f,years:t=>t+' år'},A).main,/Det gjelder før skatt/);}

// Sparehorisont: varsel ved indeksfond under Forbrukerrådets anbefalte minste horisont for aksjefond.
{const A=require('../dist/assumptions.js'),F=require('../dist/veileder-facts.js'),ff={...f,years:t=>t+' år'};
 assert.equal(A.horizon.fundMinYears,F.value('fundMinYears'),'samme tall som veilederens fakta');
 assert.equal(A.horizon.source.url,F.data.fundMinYears.source,'samme kilde som veilederens fakta');
 const short={...base,start:0,monthly:2000,rate:7.11,fee:0.2,savingsType:'index'};
 for(const years of [0.5,1,3,4.9]){const m=M.build(E,{...short,years},years,ff,A);
  assert.match(m.main,/Forbrukerrådet anbefaler minst 5 års sparehorisont for aksjefond, og planen din er kortere\. Dette er en anbefaling, ikke en regel eller garanti\./,'under 5 år: '+years);}
 // 5 år og lengre: ingen varsel. Uten forutsetningene (A): ingen varsel og ingen gjettede tall.
 for(const years of [5,10,30])assert.doesNotMatch(M.build(E,{...short,years},years,ff,A).main,/sparehorisont/);
 assert.doesNotMatch(M.build(E,{...short,years:3},3,ff).main,/sparehorisont/);
 // Månedsplaner (kortsiktig mål som ferie): 6 måneder gir varsel for indeksfond, men ingen varsel uten spareform.
 assert.match(M.build(E,{...short,years:0.5},0.5,ff,A).main,/sparehorisont/);
 assert.doesNotMatch(all(M.build(E,{...short,years:0.5,savingsType:''},0.5,ff,A)),/sparehorisont|Konto eller fond/);
 // Konto med minst 5 år: nøytral opplysning, uten råd om gjeld eller buffer. Ikke for korte planer eller tomme planer.
 const acct={...base,start:0,monthly:2000,rate:2.87,fee:0,savingsType:'savings'};
 for(const years of [5,15]){const m=build2(years);const g=m.details.find(d=>d.title==='Konto eller fond?');assert.ok(g,'konto '+years);
  assert.match(g.text,/^Forbrukerrådet anbefaler minst 5 års sparehorisont for aksjefond, og planen din er minst så lang\./);
  assert.doesNotMatch(g.text,/gjeld|buffer|bør|burde|anbefaler deg/i);}
 assert.ok(!build2(4).details.some(d=>d.title==='Konto eller fond?'));
 assert.ok(!M.build(E,{...acct,start:0,monthly:0,years:10},10,ff,A).details.some(d=>d.title==='Konto eller fond?'),'ingen innskudd');
 assert.ok(!M.build(E,{...acct,savingsType:'index',years:10},10,ff,A).details.some(d=>d.title==='Konto eller fond?'),'indeksfond har ikke gruppen');
 function build2(years){return M.build(E,{...acct,years},years,ff,A);}
 // Språkregler: ingen tankestrek i de nye tekstene.
 for(const m of [M.build(E,{...short,years:3},3,ff,A),build2(10)])assert.doesNotMatch(all(m),/\u2014| \u2013 /);}

console.log('Passed: meaning section follows the numbers, the chosen savings type and the horizon.');
