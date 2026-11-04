const assert=require('node:assert/strict'),L=require('../dist/laan-motor.js'),V=require('../dist/laan-visning.js'),E=require('../dist/laan-eksport.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<Math.max(1e-7,Math.abs(b)*1e-10),`${a} != ${b}`);
assert.equal(V.defaults.inflation,require('../dist/engine.js').defaults.inflation);
for(const type of L.TYPES)for(const inflation of [0,2.5,10,100]){
 const p=L.plan({type,amount:200000,rate:6,years:10,establishmentFee:1000,termFee:45,real:true,inflation,scenarioShift:2,propertyValue:400000,rateChanges:[{term:25,rate:8}],extraPayments:[{term:60,amount:50000}]});
 const copy=JSON.stringify(p),d=V.present(p);
 const sum=p.rows.reduce((x,r)=>x+r.total/(1+inflation/100)**(r.term/12),1000);
 near(d.totals.paid,sum);near(d.totals.principal+d.totals.interest+d.totals.fees,sum);assert.equal(d.totals.establishmentFee,1000);
 for(const r of d.rows)near(r.total,r.principal+r.extra+r.interest+r.fee);
 assert.equal(JSON.stringify(p),copy,'nominell motorplan er urørt');
 const monthly=E.monthly(p),yearly=E.yearly(p);near(monthly.slice(1).reduce((x,r)=>x+r[6],0),sum);near(yearly.slice(1).reduce((x,r)=>x+r[4],0),sum);
 const c=V.scenarios(p);assert.deepEqual(c.map(x=>x.rate),[4,6,8]);
 for(const v of c){assert.deepEqual(v.plan.input.rateChanges,[]);assert.deepEqual(v.plan.input.extraPayments,[]);assert.equal(v.plan.rows.length,120);assert.equal(v.plan.input.amount,200000);assert.equal(v.plan.input.termFee,45);}
 assert.ok(c[0].cost<c[1].cost&&c[1].cost<c[2].cost);
 const csv=E.csvRows(p);assert.equal(new Set(csv.map(r=>r.length)).size,1);assert.ok(csv[0].includes('Prisvekst per år (%)'));assert.ok(csv[1].includes('Dagens kroner ved utbetaling'));
 const html=E.report(p);assert.match(html,/Dagens kroner/);assert.match(html,/tidspunkt null/);assert.match(html,/Ny nominell rente fra termin 25/);
 const chart=V.costChart(p);assert.equal((chart.match(/<circle/g)||[]).length,3);assert.match(chart,/role="img"/);
}
// Lukket geometrisk sum: lik betaling ved nullrente, ingen hendelser. Gebyr ved t=0 diskonteres aldri.
const p=L.plan({amount:24000,rate:0,years:2,termFee:10,establishmentFee:500,inflation:12,real:true});
const q=(1.12)**(-1/12);near(V.present(p).totals.paid,500+1010*q*(1-q**24)/(1-q));
for(const [rate,shift,rates] of [[0,2,[0,0,2]],[99,4,[95,99,100]],[5,0,[5,5,5]]])assert.deepEqual(V.scenarios(L.plan({rate,scenarioShift:shift})).map(x=>x.rate),rates);
console.log('Lånevisning: nåverdi per termin, tidsnull, uendret motorplan, nullrente, scenarioer og alle eksportforutsetninger består.');
