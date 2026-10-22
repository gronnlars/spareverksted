const assert=require('node:assert/strict');
const V=require('../dist/veileder-engine.js');
const text=(id,p)=>V.answer(id,p).parts.map(p=>p.title+' '+p.text).join('\n');
const secure={buffer:'yes',debt:'no',income:'stable',risk:'high',years:20};
assert.match(text('funds',{...secure,age:20}),/høyere aksjeandel/);
assert.match(text('funds',{...secure,age:20,years:3}),/under fem år/);
assert.doesNotMatch(text('funds',{...secure,age:20,years:3}),/høyere aksjeandel aktuell/);
assert.match(text('pension',{...secure,age:57}),/første uttaksårene/);
assert.match(text('pension',{...secure,age:57}),/Lang tid/);
assert.doesNotMatch(text('funds',{...secure,buffer:'no'}),/høyere aksjeandel aktuell/);
assert.doesNotMatch(text('funds',{...secure,debt:'yes'}),/høyere aksjeandel aktuell/);
assert.match(text('funds',{...secure,risk:'low'}),/Uro teller/);
assert.match(text('mortgage',{fixed:'yes'}),/overkurs eller underkurs/);
assert.match(text('student',{}),/normalt rentefritt mens du får støtte til fulltidsutdanning/);
assert.match(text('student',{}),/ikke automatisk mindre stipend/);
assert.match(text('children',{}),/barnets situasjon/);
assert.match(text('bsu',{age:34,owner:'yes',tax:'no'}),/minst 34/);
assert.match(text('bsu',{age:33}),/BSU kan være gunstig/);
assert.doesNotMatch(text('bsu',{age:33}),/minst 34/);
assert.match(text('funds',{}),/Alder alene/);
for(const [k,v]of Object.entries({age:-1,years:81,risk:'bogus'}))assert.throws(()=>V.validate({[k]:v}));
for(const v of ['NaN','Infinity','1e100'])assert.throws(()=>V.validate({age:v}));
assert.equal(V.validate({age:''}).age,null);
assert.equal(V.validate({years:'0'}).years,0);
assert.equal(V.validate({years:'2,5'}).years,2.5);
assert.throws(()=>V.answer('unknown',{}));
assert.deepEqual(V.findTopics('Hvordan blir været?'),[]);
assert.ok(V.findTopics('Boliglån eller fond?').includes('mortgage'));
assert.ok(V.findTopics('Boliglån eller fond?').includes('funds'));
assert.deepEqual(V.findTopics('<script>alert(1)</script>'),[]);
for(const t of V.topics){
 for(const q of t.questions)assert.ok(V.findTopics(q).includes(t.id),`Missing topic ${t.id}: ${q}`);
 for(const years of [0,3,5,9,10,25,null])for(const age of [20,57,80,null])for(const buffer of ['yes','no','']){
  const a=V.answer(t.id,{age,years,buffer});assert.ok(a.parts.length);assert.ok(a.sources.length);assert.equal(new Set(a.sources.map(s=>s.id)).size,a.sources.length);for(const s of a.sources)assert.ok(s.url.startsWith('https://'));
 }
}
console.log('Veileder: routing, safety boundaries, validation and 588 profile combinations passed.');
