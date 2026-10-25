const assert=require('node:assert/strict'),V=require('../dist/veileder-engine.js'),Cards=require('../dist/veileder-cards.js');
for(const e of require('../dist/veileder-knowledge.js'))V.register(e);
const age=/til og med året du fyller/g;
const count=c=>(JSON.stringify(c).match(age)||[]).length;
// Over aldersgrensen: personlig merknad og generell grensetabell, men ikke også en tredje identisk del.
const old=Cards.build('q-bsu-basics',{age:40,owner:'no',tax:'yes'});
assert.match(old.note,/Nye BSU-innskudd kan gjøres/);
assert.ok(!old.parts.some(p=>p.title==='Aldersgrensen'),'Aldersgrensen skal ikke gjentas når merknaden dekker den');
assert.equal(count(old),2);
// Når en annen merknad går foran (gjeld), er aldersdelen eneste personlige omtale og skal bli stående.
const debt=Cards.build('q-bsu-basics',{age:40,debt:'yes'});
assert.ok(debt.parts.some(p=>p.title==='Aldersgrensen'));
// Under grensen: ingen aldersdel.
assert.ok(!Cards.build('q-bsu-basics',{age:25}).parts.some(p=>p.title==='Aldersgrensen'));
// Temaet «bsu» har ingen merknad og beholder aldersdelen.
assert.ok(Cards.build('bsu',{age:40}).parts.some(p=>p.title==='Aldersgrensen'));
// Eierskapsdelen har egen tilleggstekst og beholdes.
assert.ok(Cards.build('q-bsu-basics',{age:30,owner:'yes'}).parts.some(p=>p.title==='Du eier bolig'));
console.log('BSU: aldersgrensen vises ikke tre ganger.');
