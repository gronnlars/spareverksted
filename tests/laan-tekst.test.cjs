// Tekstene til lånekalkulatoren (dist/laan-tekst.js): tall i ord, perioder, sammenligning og grafbeskrivelse.
const assert=require('node:assert/strict');
const L=require('../dist/laan-motor.js'),T=require('../dist/laan-tekst.js');
const sp=t=>t.replace(/[  ]/g,' ');
const base={kind:'bolig',type:'annuitet',amount:3000000,rate:5,years:25,establishmentFee:0,termFee:0,rateChanges:[],extraPayments:[]};
const plan=patch=>L.plan({...base,...patch});

assert.equal(T.period(300),'25 år');assert.equal(T.period(1),'1 måned');assert.equal(T.period(233),'19 år og 5 måneder');assert.equal(T.period(14),'1 år og 2 måneder');
assert.equal(sp(T.money(17537.7)),'17 538 kr');assert.equal(sp(T.money(-5)),'−5 kr');

// Annuitet uten hendelser.
let r=T.result(plan({}),null);
assert.equal(sp(r.amount),'17 538 kr');assert.equal(r.eyebrow,'Hver måned');assert.equal(r.text,'Nedbetalt etter 25 år.');
assert.equal(sp(r.meaning),'For hver 100 kr du låner, betaler du 75,4 kr i renter. Til sammen betaler du tilbake 5 261 310 kr.');
// Serie: første måned og siste måned.
r=T.result(plan({type:'serie'}),null);
assert.equal(r.eyebrow,'Første måned');assert.match(sp(r.text),/til 10 042 kr i siste måned/);
// Gebyrer nevnes i forklaringen og i hva lånet koster per 100 kr.
r=T.result(plan({kind:'forbruk',amount:100000,rate:12,years:3,establishmentFee:950,termFee:45}),null);
assert.match(sp(r.text),/45 kr i termingebyr hver måned/);assert.match(r.meaning,/renter og gebyrer/);
// Ekstra innbetaling sammenlignes med samme lån uten.
const extra=plan({extraPayments:[{term:60,amount:500000}]}),without=plan({});
r=T.result(extra,without);
assert.match(sp(r.extra),/5 år og 7 måneder tidligere og gir 678 142 kr mindre i renter/);
assert.match(r.text,/Lånet er nedbetalt etter 19 år og 5 måneder/);
// Renteendring: annuitet får nytt beløp, serie beholder avdraget.
r=T.result(plan({rateChanges:[{term:61,rate:7}]}),null);
assert.match(sp(r.text),/Med 7 % rente etter 5 år blir beløpet 20 603 kr, 3 065 kr mer enn før\./);
r=T.result(plan({rateChanges:[{term:61,rate:3}]}),null);assert.match(r.text,/mindre enn før/);
r=T.result(plan({type:'serie',rateChanges:[{term:61,rate:7}]}),null);assert.match(r.text,/avdraget er det samme/);
r=T.result(plan({rateChanges:[{term:1,rate:6}]}),null);assert.match(r.text,/fra første måned/);
// Merknader.
r=T.result(plan({extraPayments:[{term:12,amount:1e9}]}),without);assert.match(r.notes[0],/større enn gjelden/);
r=T.result(plan({extraPayments:[{term:12,amount:1e9},{term:24,amount:5}],rateChanges:[{term:36,rate:9}]}),without);
assert.equal(r.notes.length,3);

// Sammenligning: følgen forklares, ingen anbefaling.
const c=T.compare(plan({}),plan({type:'serie'}));
assert.equal(sp(c.serie.first),'22 500 kr');assert.match(sp(c.text),/380 060 kr mindre i renter fordi gjelden betales raskere ned/);assert.match(sp(c.text),/4 962 kr høyere/);
assert.doesNotMatch(c.text,/billig|bør|anbefal|best/i);
assert.match(T.compare(plan({rate:0}),plan({rate:0,type:'serie'})).text,/ingen forskjell i samlet kostnad/);

// Grafbeskrivelse.
const pts=p=>[{t:0,v:p.input.amount},...p.rows.map(x=>({t:x.term/12,v:x.balance}))];
let p=plan({});assert.match(sp(T.chart(pts(p),p)),/^Gjelden går fra 3 000 000 kr til 0 kr over 25 år\. Halvveis er det 1 953 180 kr igjen\. Linjen synker sakte i starten/);
p=plan({type:'serie'});assert.match(T.chart(pts(p),p),/Linjen er rett/);
p=extra;assert.match(T.chart(pts(p),p),/faller linjen brått/);
assert.equal(T.chart([],p),'');

console.log('Lånetekstene: perioder, resultat, gebyrer, ekstra innbetaling, renteendring, merknader, sammenligning og grafbeskrivelse bestått.');
