// Søk: skrivefeil og særskriving. Regresjon for «boligflån» og «bolig lån», og kontroll mot irrelevante treff.
// Testene sammenligner med det rettskrevne søket, slik at de består også når innholdet utvides.
const assert=require('node:assert/strict');
const V=require('../dist/veileder-engine.js');
const entries=require('../dist/veileder-knowledge.js');
for(const e of entries)V.register(e);
const ids=q=>V.findTopics(q);

// 1. Utgangspunktet finnes: «boliglån» treffer boliglån-temaet.
assert.equal(ids('boliglån')[0],'mortgage');

// 2. De to observerte feilene, og nære varianter, finner samme tema som «boliglån».
for(const q of ['boligflån','Boligflån','BOLIGFLÅN','bolig lån','Bolig lån','BOLIG   LÅN','bolig-lån','bolig lan','boliglaan','boligflån rente','Hvordan betaler jeg ned boligflånet?'])
 assert.equal(ids(q)[0],'mortgage',q+' skal finne boliglån');
assert.deepEqual(ids('boligflån'),ids('boliglån'));assert.deepEqual(ids('bolig lån'),ids('boliglån'));
assert.deepEqual(V.interpret('boligflån').applied,[{from:'boligflån',to:'boliglån',kind:'typo'}]);
assert.deepEqual(V.interpret('bolig lån').applied,[{from:'bolig lån',to:'boliglån',kind:'join'}]);

// 3. Løsningen er generell, ikke to aliaser: ingen ordliste treffer de to formuleringene direkte,
//    og andre temaer og ord får samme behandling.
for(const q of ['boligflån','bolig lån'])for(const t of V.topics)for(const re of t.words)assert.ok(!re.test(q),'alias funnet for «'+q+'» i '+t.id);
const same=[['studie lån','studielån'],['stuidelån','studielån'],['bufer','buffer'],['buffr','buffer'],['pensjn','pensjon'],['pensjson','pensjon'],['kredit kort','kredittkort'],['kredittkot','kredittkort'],['hus lån','huslån'],['bolig kjøp','boligkjøp'],['kjøpe kraft','kjøpekraft'],['kjøpekrft','kjøpekraft'],['invsteringskonto','investeringskonto'],['investerings konto','investeringskonto']];
for(const [typo,right] of same){assert.ok(ids(right).length,right+' skal ha treff');assert.deepEqual(ids(typo),ids(right),typo+' skal gi samme treff som '+right);}
assert.ok(ids('boligflån og pensjon').includes('mortgage')&&ids('boligflån og pensjon').includes('pension'),'rettelsen skal ikke fjerne andre ord');

// 4. ASK, Zero og sammenligningene: skrivefeil og særskriving gir samme treff som riktig skrivemåte.
for(const [typo,right] of [['Zeroo','Zero'],['Zerro','Zero'],['zero-konto','zero konto']])assert.deepEqual(ids(typo),ids(right),typo);
assert.ok(ids('Zero').includes('q-ask-zero')&&ids('ASK').includes('q-ask-zero'));
// Riktig skrevne ord og alle spørsmålene i databasen blir aldri omskrevet, og forklaringer og sammenligninger holdes fra hverandre.
for(const t of V.topics)for(const q of t.questions){const r=V.interpret(q);assert.deepEqual(r.applied,[],q);assert.ok(r.ids.includes(t.id),q);}
for(const e of entries)for(const q of e.questions)assert.equal(V.interpret(q).ids[0],e.id,'spørsmål skal gå til eget svar: '+q);
for(const q of ['ASK','ask','Zero','IPS','BSU','pensjon','buffer','boliglån','studielån','kredittkort','aksjer','fond','indeksfond','kjøpekraft'])assert.deepEqual(V.interpret(q).applied,[],q+' skal ikke omskrives');
for(const q of ['ASK eller Zero?','ASK eller fondskonto?','IPS eller ASK?'])assert.equal(V.interpret(q).ids[0],entries.find(e=>e.questions.includes(q)).id,q);

// 5. Irrelevante ord gir fortsatt ingen treff og ingen omskriving.
for(const q of ['husleie','boligpriser','bokhylle','fotball','Hva er klokka?','bilforsikring','tilbud','regnskap','hjemmeside','lån','bolig','strøm','ferie','bryllup'])
 {const r=V.interpret(q);assert.deepEqual(r.ids,[],q+' skal ikke gi treff');assert.deepEqual(r.applied,[],q);}
// Korte ord rettes ikke, og to endringer unna foreslås bare.
for(const q of ['aks','asj','ASKK','ipz','bsuu','b s u'])assert.deepEqual(V.interpret(q).applied,[],q);
for(const [q,to] of [['boligen','boliglån'],['studer','student']]){const r=V.interpret(q);assert.deepEqual(r.ids,[],q+' skal ikke gi svar');assert.deepEqual(r.applied,[]);assert.equal(r.suggestions[0]?.to,to,q);}
// Tall og tomt søk.
assert.deepEqual(V.interpret('').ids,[]);assert.deepEqual(V.interpret('   ').ids,[]);assert.deepEqual(V.interpret('12345').applied,[]);

// 6. Tid: et langt søk skal ikke merkes.
{const long='boligflån '.repeat(60),t=Date.now();for(let i=0;i<30;i++)V.interpret(long);assert.ok(Date.now()-t<3000,'søket er for tregt: '+(Date.now()-t)+' ms');}
console.log('Søk: skrivefeil og særskriving, generell håndtering, ASK og Zero uendret og irrelevante treff avvist passerte.');
