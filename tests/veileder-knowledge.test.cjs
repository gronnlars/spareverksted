const assert=require('node:assert/strict');
const V=require('../dist/veileder-engine.js'),Cards=require('../dist/veileder-cards.js'),C=require('../dist/veileder-context.js');
const entries=require('../dist/veileder-knowledge.js');
for(const e of entries)V.register(e);
assert.equal(V.topics.length,11);assert.equal(V.topics.filter(t=>!t.category).length,7,'new entries must not turn into more main choices');
for(const e of entries){
 for(const q of e.questions)assert.equal(V.findTopics(q)[0],e.id,q);
 if(e.kind==='explainer'){assert.throws(()=>V.register(e),/duplisert/);continue;}
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


// Forklaring: «Hva er kjøpekraft?» trenger ikke to alternativer.
{
 const e=entries.find(x=>x.id==='q-kjopekraft');
 assert.equal(e.kind,'explainer');assert.equal(V.isExplainer('q-kjopekraft'),true);assert.equal(V.isExplainer('funds'),false);
 assert.equal(V.topics.filter(t=>!t.category).length,7,'forklaringer skal ikke bli hovedtemaer');
 // Både prisvekst og inflasjon gir treff, sammen med kjøpekraft og dagens kroner.
 for(const q of ['kjøpekraft','Kjopekraft','prisvekst','inflasjon','Hva er inflasjon?','dagens kroner','Hva betyr dagens kroner?','Hvorfor blir pengene mindre verdt på konto?','penger som mister verdi'])assert.equal(V.findTopics(q)[0],'q-kjopekraft',q);
 // Sammenligningsspørsmål er uberørt.
 for(const q of ['Bør jeg velge sparekonto eller fond?','Hva er et aksjefond?','IPS eller ASK?'])assert.ok(!V.findTopics(q).includes('q-kjopekraft'),q);
 const a=Cards.build('q-kjopekraft',{debt:'yes',buffer:'no'});
 assert.equal(a.kind,'explainer');assert.deepEqual(a.options,[]);assert.equal(a.note,'','profil skal ikke endre en ren forklaring');
 assert.match(a.intro,/kjøpekraft/i);assert.match(a.intro,/inflasjon/);
 assert.ok(a.terms.some(x=>x.term==='prisvekst'&&x.alsoCalled==='inflasjon'));
 assert.match(a.example.text,/ikke en prognose/);
 assert.ok(a.sources.length&&a.sources.every(s=>s.url.startsWith('https://')));assert.equal(a.checked,'2026-10-24');
 // Regneeksemplet i teksten stemmer.
 const later=100000*1.025**10,today=100000/1.025**10;
 assert.ok(Math.abs(later-128000)<500,String(later));assert.ok(Math.abs(today-78000)<500,String(today));
 assert.match(a.example.text,/128 000/);assert.match(a.example.text,/78 000/);
 // Ingen tankestrek i teksten.
 assert.ok(!/[\u2013\u2014]/.test(JSON.stringify(a)));
 // Registreringskrav for forklaringer.
 const ok={kind:'explainer',id:'q-test-x',title:'t',intro:'i',checked:'2026-10-24',questions:['q'],words:[/x/],terms:[{term:'a',text:'b'}],example:{title:'e',text:'t'},parts:[{title:'p',text:'t'}],sources:[{title:'s',url:'https://example.org'}]};
 for(const bad of [{terms:[]},{example:null},{parts:[]},{sources:[]},{sources:[{title:'s',url:'http://x'}]},{options:[]},{intro:''}])assert.throws(()=>V.register({...ok,...bad}),/forklaring|kilde|Ufullstendig/,JSON.stringify(Object.keys(bad)));
}

// Søk på ord, ikke på ordslutt: «aksjesparekonto» skal gi ASK-svar, «tips» skal ikke treffe IPS.
{
 const ask=['q-ips-ask','q-ask-zero'];
 for(const q of ['aksjesparekonto','Hva er aksjesparekonto?','Hva er en aksjesparekonto?','Skatt på aksjesparekonto']){
  const r=V.findTopics(q);
  assert.ok(r.length&&r.every(id=>ask.includes(id)),q+' skal bare gi ASK-svar, fikk '+r);
  assert.ok(Cards.build(r[0],{}).title.includes('ASK'),q+' skal vise et svar om ASK');
 }
 for(const q of ['tips','Har du tips til sparing?','Noen tips?']){
  const r=V.findTopics(q);
  assert.ok(!r.includes('pension')&&!r.includes('q-ips-ask'),q+' skal ikke treffe IPS, fikk '+r);
 }
 for(const q of ['IPS','ips','Hva er IPS?','Bør jeg spare i IPS','IPS eller ASK?'])assert.ok(V.findTopics(q).some(id=>id==='q-ips-ask'||id==='pension'),q+' skal fortsatt treffe IPS');
 assert.equal(V.findTopics('IPS')[0],'pension');
 assert.equal(V.findTopics('Hva er IPS?')[0],'q-ips-ask');
 for(const q of ['sparekonto','Skatt på sparekonto','aksjefond','Hva er et aksjefond?','indeksfond'])assert.equal(V.findTopics(q)[0],'funds',q+' skal fortsatt gi «Sparekonto eller fond»');
 assert.equal(V.findTopics('ASK')[0],'q-ips-ask');
}
