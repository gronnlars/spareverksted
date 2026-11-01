// «Slik leser du grafen»: teksten skal beskrive det grafen faktisk viser (UU, WCAG 1.1.1).
const assert=require('node:assert/strict');
const S=require('../dist/chart-summary.js');
const nf=new Intl.NumberFormat('nb-NO',{maximumFractionDigits:0});
const f={money:x=>nf.format(x)+' kr',period:t=>t+' år'};
const line=(fn,n=40)=>Array.from({length:n+1},(_,i)=>({t:i*20/n,v:fn(i*20/n)}));
const paid=line(t=>12000*t);
const main=(fn,name='Beløp i kroner')=>({name,points:line(fn)});

// 1. Renters rente: linjen blir brattere, og avkastningen passerer innskuddene et sted underveis.
{const g=t=>12000*((1.08**t-1)/0.08);const txt=S.savings({main:main(g),paid:{points:paid},maxTime:20,nominal:true},f);
 assert.match(txt,/^Grafen viser beløp i kroner over 20 år, sammen med en linje for det du selv setter inn\./);
 assert.match(txt,/går fra 0 kr til /);assert.match(txt,/blir brattere mot slutten/);
 assert.match(txt,/Fra rundt år \d+ er den større enn det du selv har satt inn/);
 assert.match(txt,/ikke garantier/);assert.match(txt,/knappen «Tabell»/);
 // Kontroll: krysningsåret skal være første år der avkastningen er minst like stor som innskuddene.
 const y=Number(txt.match(/Fra rundt år (\d+)/)[1]);const t=line(g).find(p=>p.t>0&&p.v-12000*p.t>=12000*p.t).t;assert.equal(y,Math.ceil(t));}
// 2. Uten avkastning: linjen stiger jevnt og ingen påstand om at avkastningen passerer innskuddene.
{const txt=S.savings({main:main(t=>12000*t),paid:{points:paid},maxTime:20,nominal:true},f);
 assert.match(txt,/stiger omtrent jevnt/);assert.doesNotMatch(txt,/Fra rundt år/);assert.match(txt,/Til slutt er den 0 kr/);}
// 3. Tap: beløpet ender under innskuddene.
{const txt=S.savings({main:main(t=>12000*t*0.8),paid:{points:paid},maxTime:20,nominal:true},f);assert.match(txt,/ligger beløpet 48\s000 kr under linjen for det du har satt inn/);}
// 4. Børsfall: et tydelig fall nevnes med omtrentlig år.
{const txt=S.savings({main:main(t=>t<10?100000+10000*t:(100000+10000*t)*0.6),paid:null,maxTime:20,nominal:true},f);assert.match(txt,/tydelig fall rundt år 10/);}
// 5. Kroner og kjøpekraft: avstanden forklares, og innskuddslinjen nevnes ikke.
{const nom=main(t=>100000),real={points:line(t=>100000/1.025**t)};const txt=S.savings({main:nom,real,maxTime:20,nominal:true},f);
 assert.match(txt,/to linjer/);assert.match(txt,/hvor mye prisveksten tar/);assert.match(txt,/kjøpekraften er 61\s027 kr/);assert.doesNotMatch(txt,/setter inn/);}
// 6. I dagens kroner kalles avstanden ikke avkastning.
{const txt=S.savings({main:main(t=>12000*t*1.1,'Kjøpekraft i dagens kroner'),paid:{points:paid},maxTime:20,nominal:false},f);assert.doesNotMatch(txt,/beregnet avkastning/);}
// 7. Bånd, bank og lagrede planer tas med.
{const txt=S.savings({main:main(t=>12000*t),paid:{points:paid},low:200000,high:300000,bank:250000,comparisons:[{name:'Plan B',end:180000}],maxTime:20,nominal:true},f);
 assert.match(txt,/fra 200\s000 kr til 300\s000 kr/);assert.match(txt,/bank ender på 250\s000 kr/);assert.match(txt,/Plan B, som ender på 180\s000 kr/);}
// 8. Uttak: pengene tar slutt, eller varer.
{const E=require('../dist/engine.js');const s={...E.defaults,retireYears:10,withdrawMode:'amount',annualWithdraw:200000,rate:0,fee:0,inflation:0,withdrawInflation:false,extraWithdraw:0};
 const r=E.withdrawal(s,1000000);const txt=S.withdrawal(r,1000000,f);assert.match(txt,/når null etter 5 år/);
 const r2=E.withdrawal({...s,annualWithdraw:50000},1000000);assert.match(S.withdrawal(r2,1000000,f),/varer hele perioden/);}
// 9. Tom graf gir ingen tekst.
assert.equal(S.savings({main:{name:'x',points:[]},maxTime:0},f),'');
// 10. Synlig tekst gjentar ikke overskrift, merknad eller henvisning til tabell, men har tallene. Full tekst har alt.
{const g=t=>12000*((1.08**t-1)/0.08);const r=S.savingsParts({main:main(g),paid:{points:paid},low:1,high:2,maxTime:20,nominal:true},f);
 assert.doesNotMatch(r.visible,/^Grafen viser|ikke garantier|«Tabell»/);assert.match(r.visible,/går fra/);assert.match(r.visible,/beregnet avkastning/);assert.match(r.visible,/skraverte båndet/);
 assert.ok(r.full.startsWith('Grafen viser'));assert.ok(r.full.includes(r.visible.split('. ')[0]));
 const b=S.savingsParts({main:main(t=>100000),real:{points:line(t=>100000/1.025**t)},maxTime:20,nominal:true},f);
 assert.doesNotMatch(b.visible,/prisveksten tar/);assert.match(b.full,/prisveksten tar/);assert.match(b.visible,/kjøpekraften er 61\s027 kr/);}
console.log('chart-summary: alle tester bestått');
