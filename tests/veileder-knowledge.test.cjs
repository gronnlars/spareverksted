const assert=require('node:assert/strict');
const V=require('../dist/veileder-engine.js'),Cards=require('../dist/veileder-cards.js'),C=require('../dist/veileder-context.js');
const entries=require('../dist/veileder-knowledge.js');
for(const e of entries)V.register(e);
assert.equal(V.topics.length,10);assert.equal(V.topics.filter(t=>!t.category).length,7,'new entries must not turn into more main choices');
for(const e of entries){
 for(const q of e.questions)assert.equal(V.findTopics(q)[0],e.id,q);
 for(const age of [20,33,34,57,null])for(const years of [0,3,10,25,null])for(const buffer of ['yes','no','']){
  const r=Cards.build(e.id,{age,years,buffer});assert.equal(r.title,e.title);assert.equal(r.options.length,2);assert.ok(r.sources.length);assert.equal(r.checked,'2026-10-22');
  if(buffer==='no')assert.match(r.note,/Uten buffer/);
 }
 assert.throws(()=>V.register(e),/duplisert/);
}
assert.equal(V.findTopics('Hva er BSU?')[0],'q-bsu-basics');
assert.equal(V.findTopics('IPS eller ASK?')[0],'q-ips-ask');
assert.equal(V.findTopics('ASK eller Zero?')[0],'q-ask-zero');
assert.equal(V.findTopics('Hva skjer med studielånet?')[0],'student');
assert.deepEqual(V.findTopics('Hvilken farge har himmelen?'),[]);
const ips=JSON.stringify(Cards.build('q-ips-ask',{}));assert.match(ips,/25 000/);assert.match(ips,/2026/);assert.match(ips,/62 år/);assert.match(ips,/hele utbetalingen/i);assert.match(ips,/minst til 80/);
const zero=JSON.stringify(Cards.build('q-ask-zero',{}));assert.match(zero,/forholdsmessig/);assert.match(zero,/forsikringsbasert/);assert.doesNotMatch(zero,/nordnet.no/);
const bsu=JSON.stringify(Cards.build('q-bsu-basics',{}));assert.match(bsu,/27 500/);assert.match(bsu,/årets slutt/);
assert.match(JSON.stringify(Cards.build('q-bsu-basics',{age:34})),/til og med året du fyller 33/);
assert.equal(C.clean({horizons:{'q-ips-ask':3}}).horizons['q-ips-ask'],3);
assert.equal(C.clean({horizons:{constructor:7}}).horizons.constructor,Object.prototype.constructor);
assert.equal(C.forTopic({profile:{years:10},horizons:{'q-ips-ask':3}},'q-ips-ask').years,3);
console.log('First batch: three distinct answers, 225 profiles, routing, BSU eligibility, IPS binding, Zero withdrawal and extensible context passed.');

assert.match(Cards.build('q-ips-ask',{age:57,years:3}).note,/før du er 62/);
assert.match(Cards.build('q-bsu-basics',{age:34}).note,/Nye BSU-innskudd.*33/);

assert.equal(V.findTopics('hva er bsu')[0],'q-bsu-basics');
assert.equal(V.findTopics('  IPS  eller ASK  ')[0],'q-ips-ask');

