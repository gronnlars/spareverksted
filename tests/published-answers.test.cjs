const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const V=require('../dist/veileder-engine.js');for(const e of require('../dist/veileder-knowledge.js'))V.register(e);
const withheld=V.topics.filter(t=>!['q-bsu-basics','q-aksjesparekonto','q-fondskonto'].includes(t.id));
vm.runInNewContext(fs.readFileSync('dist/veileder-published.js','utf8'),{window:{SpareVeileder:V}});
const allowed=['q-aksjesparekonto','q-bsu-basics','q-fondskonto'];
assert.deepEqual(V.topics.map(t=>t.id).sort(),allowed);
for(const t of withheld){assert.throws(()=>V.answer(t.id,{}));for(const q of [t.title,...t.questions]){const r=V.search(q);assert.equal(r.mode,'none',q);assert.equal(r.hits.length,0,q);}}
for(const q of ['IPS','renters rente','fond','barn','boliglån','utbytte','rentefond','ASK eller fondskonto?']){const r=V.search(q);assert.ok([...r.hits,...r.suggestions].every(h=>allowed.includes(h.id)),q);}
for(const [q,id]of [['Hva er ASK?','q-aksjesparekonto'],['Hva er BSU?','q-bsu-basics'],['Hva er en fondskonto?','q-fondskonto']])assert.equal(V.search(q).hits[0].id,id,q);
for(const p of [{},{debt:'yes',buffer:'no'},{age:20,owner:'no',tax:'yes'},{risk:'low',years:1}])assert.ok(V.suggestions(p).every(s=>allowed.includes(s.id)));
console.log('Publiseringsutvalg: tre svar, alle tilbaketrukne spørsmål sperret, ingen eldre profilråd.');
