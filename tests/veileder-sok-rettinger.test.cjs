'use strict';
/* Test av tre rettinger i det lokale søket:
   1. Ordlisten bygges én gang per innholdsversjon.
   2. Skrivefeil som inneholder kjente stammer gir «Mente du», ikke et automatisk svar.
   3. Negasjon («ikke», «uten») respekteres.
   Radene er laget av oss, ikke hentet fra ekte brukere. */
const assert=require('node:assert/strict');
const V=require('../dist/veileder-engine.js');
for(const e of require('../dist/veileder-knowledge.js'))V.register(e);
const S=require('../dist/veileder-sok.js');
const ids=r=>r.hits.map(h=>h.id);
const sug=r=>r.suggestions.map(s=>s.id);

// 1. Ordlisten bygges bare én gang så lenge innholdet er det samme.
{
  const before=S.stats.vocabularyBuilds;
  V.search('boliglån');V.search('studielån');V.search('fondssparing');
  assert.ok(S.stats.vocabularyBuilds-before<=1,'ordlisten skal bygges høyst én gang for tre søk');
  const mid=S.stats.vocabularyBuilds;
  V.search('barnesparing');V.search('sparekonto');
  assert.equal(S.stats.vocabularyBuilds,mid,'ingen ny bygging uten nytt innhold');
  V.register({...require('../dist/veileder-knowledge.js')[0],id:'q-test-ny',title:'Testtema',keys:['testtemaord'],words:[/testtemaord/i]});
  V.search('testtemaord');
  assert.equal(S.stats.vocabularyBuilds,mid+1,'nytt innhold gir én ny bygging');
}

// 2. Skrivefeil med kjente stammer: forslag, ikke automatisk svar, og ikke noe fondssvar.
for(const [q,expect] of [['aksjesparekonot','q-ask-zero'],['fondskotno','q-ask-zero'],['fondkonto','q-ask-zero']]){
  const r=V.search(q);
  assert.equal(r.mode,'suggest',q+': skal gi «Mente du»');
  assert.ok(sug(r).includes(expect),q+': skal foreslå aksjesparekonto');
  assert.ok(!ids(r).includes('funds'),q+': skal ikke åpne fond-svaret');
}
// Eksisterende treff skal ikke svekkes.
for(const [q,first] of [['barnesparinng','children'],['studentlån','student'],['fondssparing','funds'],['aksjefond','funds'],['boliglån','mortgage']]){
  const r=V.search(q);
  assert.equal(r.mode,'answer',q+': skal fortsatt gi svar');
  assert.equal(ids(r)[0],first,q);
}

// 3. Negasjon.
{
  const r=V.search('Jeg vil ikke ha fond');
  assert.equal(r.mode,'negated');
  assert.ok(r.negated.includes('fond'));
  assert.ok(r.hits.every(h=>h.kind==='negated'),'temaene vises som nærmeste, ikke som svar');
}
{
  const r=V.search('uten fond');
  assert.equal(r.mode,'negated');
}
{
  const r=V.search('ikke boliglån');
  assert.equal(r.mode,'negated');
}
{
  const r=V.search('aksjesparekonto, men ikke fondskonto');
  assert.ok(r.negated.length>0,'negasjonen skal merkes');
  assert.ok(!ids(r).slice(0,1).includes('funds')||r.mode!=='answer','fond skal ikke bli ett automatisk svar');
}
// «ikke» i et vanlig spørsmål skal ikke fjerne temaet.
{
  const r=V.search('hva gjør jeg hvis jeg ikke får betalt regningene');
  assert.equal(r.mode,'answer');
  assert.ok(r.negated.length===0);
}

// 4. Særskrevne navn som er registrert (sluttkontroll 2026-10-24): samme svar som det sammensatte ordet.
for(const [q,first] of [['fonds konto','q-ask-zero'],['fond konto','q-ask-zero'],['aksje spare konto','q-ask-zero'],['individuell pensjons sparing','q-ips-ask']]){
  const r=V.search(q);
  assert.equal(r.mode,'answer',q);
  assert.equal(ids(r)[0],first,q+': skal gi samme svar som det sammensatte ordet');
}
// Sammenslåing skal ikke ta fra eksisterende treff.
for(const [q,first] of [['bolig lån','mortgage'],['studie lån','student'],['spare konto','funds'],['barne sparing','children'],['kjøpe kraft','q-kjopekraft'],['aksje fond','funds'],['fond bank konto','funds']]){
  const r=V.search(q);
  assert.equal(r.mode,'answer',q);
  assert.equal(ids(r)[0],first,q);
}
// 5. Negasjon over verb og småord, men ikke over «ikke råd».
for(const q of ['jeg vil ikke spare i aksjer','hva er best bortsett fra fond']){
  const r=V.search(q);
  assert.equal(r.mode,'negated',q);
  assert.ok(r.hits.every(h=>h.kind==='negated'),q);
}
for(const q of ['jeg har ikke råd til å spare til pensjon','hva gjør jeg hvis jeg ikke klarer å betale boliglånet','jeg vil ikke betale mer skatt på barnesparing']){
  const r=V.search(q);
  assert.equal(r.mode,'answer',q+': nektingen skal ikke ta bort temaet');
}
console.log('veileder-sok-rettinger: ok');
