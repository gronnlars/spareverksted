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
// Datoer: alle publiserte svar har først publisert, sist endret og sist gjennomgått, i riktig rekkefølge.
const iso=/^\d{4}-\d{2}-\d{2}$/;
for(const id of allowed){const a=V.answer(id,{});for(const k of ['published','changed','checked'])assert.match(String(a[k]),iso,id+' '+k);assert.ok(a.published<=a.changed&&a.changed<=a.checked,id+': publisert <= endret <= gjennomgått');}
// Varsel etter mer enn 12 måneder uten gjennomgang.
const at=s=>new Date(s);
assert.equal(V.reviewOverdue('2026-10-28',at('2026-10-29T12:00:00Z')),false);
assert.equal(V.reviewOverdue('2026-10-28',at('2027-10-28T20:00:00Z')),false,'samme dato året etter er fortsatt innenfor');
assert.equal(V.reviewOverdue('2026-10-28',at('2027-10-29T00:00:01Z')),true);
assert.equal(V.reviewOverdue('2024-02-29',at('2025-03-01T12:00:00Z')),false);
assert.equal(V.reviewOverdue('2024-02-29',at('2025-03-02T12:00:00Z')),true);
assert.equal(V.reviewOverdue('',at('2026-10-29T12:00:00Z')),true,'manglende dato regnes som ikke gjennomgått');
console.log('Publiseringsutvalg: tre svar, alle tilbaketrukne spørsmål sperret, ingen eldre profilråd, datoer og 12-månedersvarsel.');
