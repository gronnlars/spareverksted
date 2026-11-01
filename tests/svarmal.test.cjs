// Check the actual publication policy before the retained draft regressions.
if(require('node:child_process').spawnSync(process.execPath,['tests/published-answers.test.cjs'],{stdio:'inherit',env:process.env}).status!==0)process.exit(1);
const assert=require('node:assert/strict'),fs=require('node:fs');
const V=require('../dist/veileder-engine.js'),Cards=require('../dist/veileder-cards.js');
const entries=require('../dist/veileder-knowledge.js');for(const e of entries)V.register(e);
const drafts=JSON.parse(fs.readFileSync('research/svarutkast/gaps-2026-10-25.json','utf8')).filter(x=>x.id!=='q-renters-rente');
for(const e of drafts)V.register({...e,words:e.words.map(x=>new RegExp(x))});
const profile={age:70,years:1,debt:'yes',buffer:'no',owner:'yes',income:'uncertain',risk:'low'};
for(const e of [...entries,...drafts]){
 const a=Cards.build(e.id,{}),b=Cards.build(e.id,profile);
 assert.equal(a.layout,'overview',e.id);
 for(const k of ['intro','options','parts','tradeoffs','example','terms','caveat','review','sources','note','steps'])assert.deepEqual(a[k],b[k],e.id+' '+k+' must not inherit personal advice');
 assert.equal(a.note,'');assert.deepEqual(a.steps,[]);assert.equal(V.isNeutral(e.id),true);
 assert.doesNotMatch(JSON.stringify(a),/Beregningen er forklart under|Binding kan hjelpe sparevanene|best egnet for deg|undefined|\{\{/);
 assert.ok(a.review?.text,e.id+' has review metadata; a separate caveat is optional');
 if(a.tradeoffs)for(const group of ['pros','cons'])assert.ok(a.tradeoffs[group].every(x=>x.title&&x.text));
}
const text=id=>JSON.stringify(Cards.build(id,{}));
assert.match(text('q-aksjesparekonto'),/gjenværende innskudd/i);assert.match(text('q-aksjesparekonto'),/ubenyttet skjerming fra tidligere år/);
assert.match(text('q-fondskonto'),/uten garantert avkastning/);assert.match(text('q-fondskonto'),/også rentedelen/);assert.match(text('q-fondskonto'),/må ubenyttet skjerming brukes mot gevinsten/);
assert.match(text('q-bsu-basics'),/27 500/);assert.match(text('q-bsu-basics'),/300 000/);assert.match(text('q-bsu-basics'),/2 750/);assert.match(text('q-bsu-basics'),/Renter som påløper fra og med året du fyller 34/);assert.match(text('q-bsu-basics'),/skattefradrag du tidligere har fått/);assert.match(text('q-bsu-basics'),/januar 2018 til august 2026/);
assert.match(text('q-ips-ask'),/25 000/);assert.match(text('q-ips-ask'),/minst til 80 år og minst 10 år/);assert.match(text('q-ips-ask'),/uførhet/);assert.match(text('q-ips-ask'),/fradrag i alminnelig inntekt/);
assert.match(text('q-barnesparing-skatt'),/til og med året barnet fyller 16/);assert.match(text('q-barnesparing-skatt'),/året barnet fyller 17/);
assert.match(text('q-bsu-flytting'),/Utenlandsflytting omfattes ikke/);assert.ok(drafts.find(e=>e.id==='q-bsu-flytting').publicationBlockers.length);assert.match(text('q-utbytte'),/personlig.*bosatt i Norge/);assert.match(text('q-rentefond'),/innskuddsgaranti/);
// Same names, questions and regexes as main. No new comparison picker or automatic publication of drafts.
const old=require('./fixtures/svarmal-search-baseline.json');
const fresh=entries.map(x=>({id:x.id,keys:x.keys,questions:x.questions,words:x.words.map(String)}));
assert.deepEqual(JSON.parse(JSON.stringify(fresh)),old);
console.log('Svarmal: 13 svar, profil-uavhengighet, faglige forbehold, uavklarte spørsmål og uendrede søkeinnganger består.');
