const assert=require('node:assert/strict'),fs=require('node:fs');
const data=require('../dist/bsu-rates.js');
const monthly=fs.readFileSync('research/bsu-rentehistorikk-2026-10-28.csv','utf8').trim().split(/\r?\n/).slice(1).map(x=>x.split(','));
assert.equal(data.rows.length,9);assert.deepEqual(data.columns,['År','BSU','Bundne innskudd']);
for(const [index,row] of data.rows.entries()){
 const year=String(2018+index),months=monthly.filter(x=>x[0].startsWith(year));
 assert.equal(months.length,index===8?8:12);
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
