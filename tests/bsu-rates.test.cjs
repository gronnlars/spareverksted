const assert=require('node:assert/strict'),fs=require('node:fs');
const data=require('../dist/bsu-rates.js');
const monthly=fs.readFileSync('research/bsu-rentehistorikk.csv','utf8').trim().split(/\r?\n/).slice(1).map(x=>x.split(','));
const lastYear=Number(monthly[monthly.length-1][0].slice(0,4));assert.equal(data.rows.length,lastYear-2017);assert.deepEqual(data.columns,['År','BSU','Bundne innskudd']);
for(const [index,row] of data.rows.entries()){
 const year=String(2018+index),months=monthly.filter(x=>x[0].startsWith(year));
 assert.equal(months.length,index===data.rows.length-1?monthly.filter(x=>x[0].startsWith(String(lastYear))).length:12);
 for(const col of [1,2]){
  const integerSum=months.reduce((n,m)=>n+Math.round(Number(m[col])*100),0);
  assert.equal(row[col],Math.round(integerSum/months.length)/100,year+' column '+col);
 }
 assert.ok(row[1]>row[2]);
}
const entries=require('../dist/veileder-knowledge.js'),bsu=entries.find(e=>e.id==='q-bsu-basics');
assert.deepEqual(bsu.parts.find(p=>p.table).table,data);
assert.match(bsu.tradeoffs.pros[0].text,/alene eller sammen med andre/);
assert.ok(bsu.sources.some(s=>s.url.includes('fradrag-for-boligsparing')));
console.log('BSU: ni årsrader, månedstall, delår, faktisk visningsdata og kilde kontrollert.');
// Boligeierskap: presiseringen Lars ba om før publisering 28.10.2026 skal ikke falle ut igjen.
{const b=require('../dist/veileder-knowledge.js').find(e=>e.id==='q-bsu-basics'),t=JSON.stringify(b);
 assert.match(t,/alene eller sammen med andre/);assert.match(t,/Både boligen du bor i og annen bolig teller/);assert.match(t,/borettslag/);assert.match(t,/Fritidsbolig alene hindrer ikke fradrag/);
 assert.ok(b.sources.some(s=>s.url.includes('forskuddsutskrivingen-2026')),'Forskuddsutskrivingen 2026 er kilde for fritidsbolig');}
