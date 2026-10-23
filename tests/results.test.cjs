// Kontrollpunkter for resultatkortet: uavhengig månedsløkke mot motoren, og forklaringen av tap og kjøpekraft.
// Tidligere viste verdier er kontrollpunkter. Fasiten er den uavhengige løkken nedenfor.
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const base={...E.defaults,growth:0,extra:0,crash:0};
// Uavhengig referanse: én løkke per måned. Kostnaden er en årlig andel av verdien, fordelt likt (geometrisk) på månedene.
// Innskudd ved månedsslutt (due=false) eller månedsstart (due=true). Ingen avrunding underveis.
function ref({start,monthly,years,rate,fee},due=false){const n=Math.round(years*12),r=(1+rate/100)**(1/12),k=(1-fee/100)**(1/12);let v=start;for(let m=0;m<n;m++){if(due)v+=monthly;v=v*r*k;if(!due)v+=monthly;}return v;}
const real=(v,years,infl)=>v/(1+infl/100)**years;
const near=(a,b,label,tol=1e-6)=>assert.ok(Math.abs(a-b)<=Math.max(1,Math.abs(b))*tol,`${label}: ${a} vs ${b}`);
const kr=v=>Math.round(v);

// Test A til D fra oppdraget.
const A={...base,start:10000,monthly:2000,years:40,rate:0,fee:0,inflation:0};
const B={...A,fee:0.2};
const C={...base,start:10000,monthly:2000,years:30,rate:0,fee:0.2,inflation:2.5};
const D={...C,rate:5};
for(const [name,s,shown,shownReal] of [['A',A,970000,970000],['B',B,931875,931875],['C',C,708280,337667],['D',D,1612393,768697]]){
 const v=E.value(s,s.years);near(v,ref(s),name+' mot uavhengig løkke');
 assert.equal(kr(v),shown,name+' nominelt');assert.equal(kr(real(v,s.years,s.inflation)),shownReal,name+' dagens kroner');
 const x=E.explain(s);assert.equal(kr(x.real),shownReal,name+' explain().real');assert.equal(kr(x.final),shown);
}
assert.equal(E.value(A,40),970000,'A: 0 % vekst, kostnad og prisvekst gir nøyaktig innskuddene');
// B og C: 0 % vekst, bare kostnader. Hele reduksjonen skyldes kostnadene, og den er lik kostnadseffekten.
for(const [name,s,loss] of [['B',B,38125],['C',C,21720]]){const x=E.explain(s);assert.equal(kr(x.loss),loss,name+' tap');assert.equal(x.cause,'fees',name);assert.equal(x.growthOnly,true);near(x.costEffect,x.loss,name+' kostnad = tap');}
// C: tapet i kroner er ikke det samme som tapet i kjøpekraft. Kjøpekraften omtales ikke separat når det er tap i kroner.
assert.equal(E.explain(C).powerGap,0);
// D: positiv vekst etter kostnader. Ingen tap, men kostnadene har en isolert effekt mot et scenario uten kostnader.
{const x=E.explain(D);assert.equal(x.loss,0);assert.equal(x.cause,null);near(x.costEffect,ref({...D,fee:0})-ref(D),'D kostnadseffekt');assert.equal(kr(x.costEffect),61578);}

// Scenariotabellen i oppdraget.
const s1={...base,start:10000,monthly:2000,years:10,rate:0,fee:0,inflation:0};
assert.equal(E.value(s1,10),250000,'0/0/0: sluttverdi lik innskuddene');
{const x=E.explain(s1);assert.equal(x.loss,0);assert.equal(x.powerGap,0);assert.equal(x.noInflation,true);}
{const s={...s1,fee:0.5};assert.ok(E.value(s,10)<250000,'0 % vekst med kostnad gir nominell reduksjon');assert.equal(E.explain(s).cause,'fees');}
{const s={...s1,rate:5};near(E.value(s,10),ref(s),'5 %: renters rente');assert.ok(E.value(s,10)>250000*1.05**0);}
{const s={...s1,rate:5,fee:0.2};near(E.value(s,10),ref(s),'5 % og 0,2 %: nettoavkastning');
 // Netto årlig vekst er (1,05 × 0,998) − 1, ikke 5 − 0,2. Startbeløpet alene vokser med denne faktoren.
 near(E.value({...s,monthly:0},10),10000*(1.05*0.998)**10,'netto årsfaktor');}
{const s={...s1,rate:5,inflation:2.5};const x=E.explain(s);near(x.real,ref(s)/1.025**10,'kjøpekraft');assert.equal(x.powerGap,0,'5 % vekst holder følge med 2,5 % prisvekst');}
// Negativ utvikling: forventet vekst er minst 0 %, så tap uten kostnader kommer fra børsfall.
{const s={...s1,rate:5,crash:40,crashYear:10};const x=E.explain(s);assert.ok(x.loss>0);assert.equal(x.cause,'fall');
 const sf={...s,fee:0.5};assert.equal(E.explain(sf).cause,'fall+fees','fall og kostnader nevnes begge');
 // Kostnadene får ikke hele skylden: uten kostnader er det fortsatt tap.
 assert.ok(E.value({...sf,fee:0},10)<E.explain(sf).paid);}
// Negativ avkastning (bare mulig via motoren; skjemaet krever minst 0 %): −5 % med 0,2 % kostnad skal ikke tilskrives bare kostnadene.
{const s={...base,start:10000,monthly:2000,years:30,rate:-5,fee:0.2,inflation:2.5};const x=E.explain(s);
 assert.equal(x.cause,'value+fees');assert.ok(E.value({...s,fee:0},30)<x.paid,'tap også uten kostnader');assert.ok(x.costEffect<x.loss,'kostnadene er bare en liten del');
 assert.equal(kr(x.loss),367881);assert.equal(kr(x.costEffect),8282);near(x.final,ref(s),'−5 % mot uavhengig løkke');
 assert.equal(E.explain({...s,fee:0}).cause,'value');assert.throws(()=>E.validate(s),/fra 0 % til 100 %/,'skjemaet stopper negativ forventet vekst');
 // Grensetilfelle: −0,1 % vekst og 0,2 % kostnad. Liten negativ vekst gir tap også uten kostnader.
 assert.equal(E.explain({...s,rate:-0.1}).cause,'value+fees');assert.equal(E.explain({...s,rate:0.1}).cause,'fees');}
// Kostnader større enn vekst: tapet er mindre enn kostnadseffekten, og årsaken er kostnadene.
{const s={...s1,rate:0.1,fee:1};const x=E.explain(s);assert.equal(x.cause,'fees');assert.equal(x.growthOnly,false);assert.ok(x.costEffect>x.loss);}
// Lavere kjøpekraft uten tap i kroner (skjermbilde: 0 % vekst, 3 % prisvekst, 40 år).
{const s={...A,inflation:3};const x=E.explain(s);assert.equal(x.loss,0);assert.equal(kr(x.real),297360);assert.ok(x.powerGap>0);}
// Lang tid og grenseverdier: endelige tall, ingen negativ fondsverdi.
for(const years of [30,40,100])for(const rate of [0,5,15])for(const fee of [0,0.2,3]){const s={...base,start:10000,monthly:2000,years,rate,fee,inflation:2.5};const v=E.value(s,years);assert.ok(Number.isFinite(v)&&v>=0);near(v,ref(s),`${years} år ${rate} % ${fee} %`,1e-9);}
// Startbeløp og månedlig sparing: summen av hver del alene.
{const s={...base,start:50000,monthly:1500,years:25,rate:6,fee:0.3,inflation:2};near(E.value(s,25),E.value({...s,monthly:0},25)+E.value({...s,start:0},25),'start + månedlig');}
// Avrunding skjer bare ved visning: motoren gir desimaler.
assert.notEqual(E.value(B,40),Math.round(E.value(B,40)));
// Månedsslutt mot månedsstart (ODIN-sammenligningen): forskjellen er nøyaktig én måneds vekst på den månedlige sparingen.
{const s={...base,start:0,monthly:2000,years:10,rate:5,fee:0,inflation:2.5},rm=1.05**(1/12);
 near(ref(s,true),E.value(s,10)*rm,'månedsstart = månedsslutt × (1 + månedlig vekst)');
 assert.equal(kr(real(E.value(s,10),10,2.5)),241177,'Spareverksted, dagens kroner');assert.equal(kr(real(ref(s,true),10,2.5)),242159,'samme tall som ODIN viste');}
console.log('Passed: test A–D against an independent monthly loop, loss causes, purchasing power, long horizons, and month-start vs month-end.');
