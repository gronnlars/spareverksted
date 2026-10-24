const assert=require('node:assert/strict');
const V=require('../dist/veileder-engine.js'),Cards=require('../dist/veileder-cards.js'),C=require('../dist/veileder-context.js');
const entries=require('../dist/veileder-knowledge.js');
for(const e of entries)V.register(e);
assert.equal(V.topics.length,13);assert.equal(V.topics.filter(t=>!t.category).length,7,'new entries must not turn into more main choices');
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

// Forklaringer: ASK og fondskonto. Tilpasset fra utkast-PR #53 til dagens søk (nøkler og eierskap av navn).
{
 const ask=entries.find(x=>x.id==='q-aksjesparekonto'),fond=entries.find(x=>x.id==='q-fondskonto'),cmp=entries.find(x=>x.id==='q-ask-zero');
 assert.equal(ask.kind,'explainer');assert.equal(fond.kind,'explainer');
 assert.equal(V.topics.filter(t=>!t.category).length,7,'forklaringer skal ikke bli hovedtemaer');
 // Eierskap: hvert navn har én eier. Sammenligningen har ingen enkeltnavn.
 assert.deepEqual([...ask.keys].sort(),['aksjesparekonto','ask']);
 assert.deepEqual([...fond.keys].sort(),['fondskonto','ikz','investeringskonto','kapitalforsikring','zero']);
 assert.ok(!cmp.keys||cmp.keys.length===0,'sammenligningen skal ikke eie enkeltnavn');
 const all=V.topics.flatMap(t=>(t.keys||[]).map(k=>[k,t.id]));
 for(const k of [...ask.keys,...fond.keys])assert.equal(all.filter(([x])=>x===k).length,1,'«'+k+'» skal ha én eier');
 // Direkte navn og ferdige spørsmål.
 for(const q of ['ASK','ask','Ask','aksjesparekonto','Hva er ASK?','Hva er en aksjesparekonto?','Hva betyr ASK?'])assert.equal(V.findTopics(q)[0],'q-aksjesparekonto',q);
 for(const q of ['fondskonto','Hva er en fondskonto?','kapitalforsikring','investeringskonto','Investeringskonto Zero','Zero','zero','IKZ','ikz','Unit Link','Hva er Investeringskonto Zero?','Hva er IKZ?'])assert.equal(V.findTopics(q)[0],'q-fondskonto',q);
 // Særskriving.
 for(const q of ['aksje spare konto','aksje sparekonto','aksjespare konto'])assert.equal(V.findTopics(q)[0],'q-aksjesparekonto',q);
 for(const q of ['fonds konto','fond konto','kapital forsikring','investerings konto'])assert.equal(V.findTopics(q)[0],'q-fondskonto',q);
 // Skrivefeil gir merkede forslag (Mente du), aldri et svar.
 for(const [q,id] of [['aksjesparekonot','q-aksjesparekonto'],['aksjesparekotno','q-aksjesparekonto'],['aksjespaerkonto','q-aksjesparekonto'],['fondskotno','q-fondskonto'],['fondkonto','q-fondskonto'],['fondskonot','q-fondskonto'],['kapitalforsikirng','q-fondskonto'],['investeringskotno','q-fondskonto']]){
  const r=V.search(q);
  assert.equal(r.mode,'suggest',q);assert.deepEqual(r.hits,[],q);
  assert.deepEqual(r.suggestions.map(s=>s.id),[id],q);
  assert.ok(r.suggestions.every(s=>s.kind==='typo'),q);
 }
 // Spørsmål som sammenligner kontotypene går til sammenligningen, ikke til en av forklaringene.
 for(const q of ['ASK eller fondskonto?','ASK eller Zero?','forskjellen på ASK og fondskonto','Hva er forskjellen på aksjesparekonto og fondskonto?','Hva er forskjellen på ASK og Investeringskonto Zero?','ASK eller investeringskonto','ask og kapitalforsikring','aksjesparekonto eller fondskonto','forskjellen mellom ASK og IKZ']){
  const r=V.search(q);
  assert.equal(r.mode,'answer',q);assert.equal(r.hits[0].id,'q-ask-zero',q);
  assert.ok(!r.hits.some(h=>h.id==='q-aksjesparekonto'||h.id==='q-fondskonto'),q+': enkeltforklaringene skal ikke blandes inn');
 }
 // IPS og «Sparekonto eller fond» er uberørt.
 for(const q of ['IPS eller ASK?','Hva er IPS?','Hva er forskjellen på IPS og ASK?'])assert.equal(V.findTopics(q)[0],'q-ips-ask',q);
 assert.ok(V.findTopics('IPS').includes('q-ips-ask')&&V.findTopics('IPS').includes('pension'));
 for(const q of ['fond','sparekonto','aksjefond','indeksfond','Hva er et aksjefond?','sparekonto eller fond'])assert.equal(V.findTopics(q)[0],'funds',q);
 assert.ok(!V.findTopics('fondskonto').includes('funds'));
 // Innhold.
 const a=Cards.build('q-aksjesparekonto',{}),f=Cards.build('q-fondskonto',{});
 for(const x of [a,f]){
  assert.equal(x.kind,'explainer');assert.deepEqual(x.options,[]);assert.match(x.example.text,/ikke en beregning av din skatt/);
  assert.ok(x.sources.length&&x.sources.every(s=>s.url.startsWith('https://')));assert.equal(x.checked,'2026-10-24');
  assert.ok(!/[–—]|\.\.\./.test(JSON.stringify(x)));
  assert.match(x.caveat,/Kontrollert mot side(?:n|ne) 24\. oktober 2026/,'kontrolldato og at kildene mangler oppdateringsdato skal stå i forbeholdet');
  assert.match(x.caveat,/ingen oppdateringsdato/);
  // Ingen satser, og ingen påstander vi ikke har kontrollert mot kildene.
  assert.doesNotMatch(JSON.stringify(x),/37,84|\b22 ?%|\b101 ?%|rentefond|utenfor Europa|amerikanske/);
 }
 assert.match(a.intro,/aksjesparekonto \(ASK\)/);
 // Regneeksemplene stemmer.
 assert.match(a.example.text,/150 000/);assert.match(a.example.text,/50 000/);assert.equal(150000-100000,50000);
 const out=30000,paidIn=100000,value=150000,innskuddsandel=out*paidIn/value,gevinstandel=out-innskuddsandel;
 assert.equal(innskuddsandel,20000);assert.equal(gevinstandel,10000);assert.match(f.example.text,/20 000 kroner er innskudd og 10 000 kroner er gevinst/);assert.ok(out<=paidIn,'på ASK dekkes uttaket av innskuddet');
 // Produktnavn forklares med tilbyder og uten anbefaling.
 const names=f.terms.map(x=>x.term);for(const need of ['fondskonto','kapitalforsikring','investeringskonto','fond'])assert.ok(names.includes(need),need);
 const prod=f.terms.find(x=>/produktnavn/.test(x.term));assert.ok(prod);
 assert.match(prod.text,/Nordnet Livsforsikring AS/);assert.match(prod.text,/ikke som anbefaling/);
 assert.match(f.caveat,/ikke kontrollert her/);assert.match(f.caveat,/oktober 2025/);
}
