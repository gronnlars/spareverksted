'use strict';
// Prøver upubliserte data i den faktiske søkemotoren. Ingen filer i dist endres.
const assert=require('node:assert/strict');
const V=require('../../dist/veileder-engine.js'),Cards=require('../../dist/veileder-cards.js');
for(const e of require('../../dist/veileder-knowledge.js'))V.register(e);
const cases=['../../research/sok-sluttkontroll/testsett/utvikling.json','../../research/sok-sluttkontroll/testsett/holdout.json','../../research/sok-sluttkontroll/tillegg.json'].flatMap(p=>require(p).cases);
const query=c=>c.repeat?c.q.repeat(c.repeat):c.q;
const signature=r=>JSON.stringify({mode:r.mode,hits:r.hits.map(x=>x.id),suggestions:r.suggestions.map(x=>x.id)});
const rentersIntegrated=V.topics.some(x=>x.id==='q-renters-rente');
const before=cases.map(c=>signature(V.search(query(c))));
const drafts=require('./gaps-2026-10-25.json');
for(const d of drafts)if(!V.topics.some(x=>x.id===d.id))V.register({...d,words:d.words.map(s=>new RegExp(s))});
let count=0;
for(const d of drafts){
 for(const q of d.questions){const r=V.search(q);assert.equal(r.mode,'answer',q);assert.equal(r.hits[0].id,d.id,q);count++;}
 const card=Cards.build(d.id,{});assert.equal(card.kind,'explainer');assert.equal(card.intro,d.intro);assert.ok(card.sources.length);assert.ok(card.parts.length);assert.equal(card.checked,'2026-10-25');
 assert.doesNotMatch(JSON.stringify(card),/[–—]|\.\.\./);
}
for(const [q,id]of [['renters rente','q-renters-rente'],['rentersrente','q-renters-rente'],['rentes rente','q-renters-rente'],['rente på rente','q-renters-rente']]){
 const r=V.search(q);assert.equal(r.mode,'answer',q);assert.equal(r.hits[0].id,id,q);count++;
}
for(const [q,id] of [['rente fond','q-rentefond'],['skatt på barne sparing','q-barnesparing-skatt']]){const r=V.search(q);assert.ok(['answer','choose','suggest'].includes(r.mode),q);assert.ok([...r.hits,...r.suggestions].slice(0,3).some(x=>x.id===id),q);count++;}
for(const [q,id]of [['rentersrnete','q-renters-rente'],['rentefnod','q-rentefond'],['utbytet','q-utbytte']]){
 const r=V.search(q);assert.equal(r.mode,'suggest',q);assert.ok(r.suggestions.some(x=>x.id===id),q);count++;
}
for(const q of ['jeg flytter','hva koster flytting','flytte strømavtale','flytte til utlandet']){
 const r=V.search(q);assert.ok(!r.hits.some(x=>x.id==='q-bsu-flytting'),q);assert.notEqual(r.uncovered?.id,'bsu-flytting',q);count++;
}
for(const [q,id]of [['Hva er ASK?','q-aksjesparekonto'],['ASK eller IPS?','q-ips-ask'],['Hva er et indeksfond?','q-indeksfond'],['Hvor stor buffer trenger jeg?','buffer']]){
 assert.equal(V.search(q).hits[0].id,id,q);count++;
}
assert.equal(V.search('Jeg vil ikke ha fond').mode,'negated');count++;
assert.match(Cards.build('q-bsu-flytting',{}).intro,/utenlandsflytting.*vet ikke/);
// Eksemplene er egne kontrollregnestykker uten bruk av kalkulatorens motor.
let saldo=10000;for(let year=0;year<2;year++)saldo+=saldo*.05;
assert.equal(saldo,11025);assert.equal(10000*1.1*.9,9900);
console.log(`Utkastprøve: ${count} søketilfeller bestått; fem svarkort bygget. Bare SV-022 er integrert; øvrige svar er isolerte utkast.`);

const changed=[];
for(let i=0;i<cases.length;i++){const c=cases[i],r=V.search(query(c));if(signature(r)!==before[i])changed.push({id:c.id,q:c.q,mode:r.mode,hits:r.hits.map(x=>x.id),suggestions:r.suggestions.map(x=>x.id)});}
console.log('Historisk sammenligning: '+cases.length+' tilfeller; '+changed.length+' endret: '+JSON.stringify(changed));
assert.deepEqual(changed.map(x=>x.id),(rentersIntegrated?['t20','t24','t25']:['t20','t21','t24','t25']),'bare de forventede hullene skal endres i det historiske settet');
for(const [id,expected]of [['t20','q-bsu-flytting'],['t21','q-renters-rente'],['t24','q-utbytte'],['t25','q-rentefond']])if(changed.some(x=>x.id===id))assert.equal(changed.find(x=>x.id===id).hits[0],expected);
const renters=drafts.find(x=>x.id==='q-renters-rente');
assert.equal(Math.round(10000*1.05**10),16289);assert.equal(Math.round(10000*1.05**20),26533);
const E=require('../../dist/engine.js');
const link=new URL(renters.next.href,'https://spareverksted.no/'),input=Object.fromEntries(new URLSearchParams(link.hash.slice(1)));
const checked=E.sanitize(input,{text:true});assert.deepEqual(checked.rejected,[]);assert.equal(checked.allReset,false);
for(const [key,value]of Object.entries({start:10000,monthly:0,years:2,rate:5,fee:0,inflation:0,growth:0,extra:0,crash:0,real:false}))assert.equal(checked.state[key],value,key);
assert.ok(Math.abs(E.value(checked.state,2)-11025)<1e-6,'delingslenken gjenskaper det uavhengig kontrollregnede eksempelet');
console.log('Renters rente: 10/20-årstall og kalkulatorlenkens verdier og sluttbeløp består.');
// Egen formel er referanse for tap i kjøpekraft, ikke kalkulatormotoren.
const contrast=renters.additionalExamples[0],contrastUrl=new URL(contrast.href,'https://spareverksted.no/');
const contrastInput=Object.fromEntries(new URLSearchParams(contrastUrl.hash.slice(1)));
const contrastCheck=E.sanitize(contrastInput,{text:true});assert.deepEqual(contrastCheck.rejected,[]);assert.equal(contrastCheck.allReset,false);
for(const [key,val]of Object.entries({start:10000,monthly:0,years:2,rate:2,fee:0,inflation:2.5,growth:0,extra:0,crash:0,real:false}))assert.equal(contrastCheck.state[key],val,key);
assert.equal(new URLSearchParams(contrastUrl.hash.slice(1)).get('both'),'1');
const expectedNominal=10000*1.02*1.02,expectedReal=expectedNominal/(1.025*1.025);
const actual=E.explain(contrastCheck.state);
assert.ok(Math.abs(actual.final-expectedNominal)<1e-6);assert.ok(Math.abs(actual.real-expectedReal)<1e-6);
assert.ok(actual.final>10000);assert.ok(actual.real<10000);assert.equal(Math.round(actual.real),9903);
// 5 % rente og 2,5 % prisvekst gir IKKE tapt kjøpekraft før skatt og kostnader.
assert.ok(10000*(1.05/1.025)**2>10000);
console.log('Kontrastlenke: 10 404 kr og 9 902,68 kr i kjøpekraft; begge vises i grafen etter parametrene. Nettleservisning er egen kontroll.');
