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
 assert.match(m.main,/Beregningen forutsetter 8 % rente på sparekontoen gjennom hele perioden\. Kontroller at renten stemmer med kontovilkårene\. Endres renten, blir resultatet annerledes\./);
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
 assert.match(all(m),/globalt aksjeindeksfond/);assert.ok(m.actions.some(a=>a.id==='range'));
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
console.log('Passed: meaning section follows the numbers, the chosen savings type and the horizon.');
