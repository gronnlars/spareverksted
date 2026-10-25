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
for(const [q,expect] of [['aksjesparekonot','q-aksjesparekonto'],['fondskotno','q-fondskonto'],['fondkonto','q-fondskonto']]){
  const r=V.search(q);
  assert.equal(r.mode,'suggest',q+': skal gi «Mente du»');
  assert.ok(sug(r).includes(expect),q+': skal foreslå riktig forklaring');
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
for(const [q,first] of [['fonds konto','q-fondskonto'],['fond konto','q-fondskonto'],['aksje spare konto','q-aksjesparekonto'],['individuell pensjons sparing','q-ips-ask']]){
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
for(const q of ['jeg har ikke råd til å spare til pensjon','hva gjør jeg hvis jeg ikke klarer å betale boliglånet','jeg vil ikke bruke barnesparing til noe annet enn barnet']){
  const r=V.search(q);
  assert.equal(r.mode,'answer',q+': nektingen skal ikke ta bort temaet');
}

// 6. Kjente hull (sluttkontroll 2026-10-24): rett tema, men svaret dekker ikke spørsmålet. Da vises ikke svaret som om det gjorde det.
const text=id=>{const t=V.topics.find(x=>x.id===id);return JSON.stringify(t.entry||V.answer(id,{}));};
for(const [q,gap] of [['aksjeutbytte','utbytte'],['hva er utbytte fra fond','utbytte'],['rentefond','rentefond'],['hva er et rentefond','rentefond'],['kan jeg spare til barnet uten å bli skattlagt','barnesparing-skatt'],['skatt på barnesparing','barnesparing-skatt'],['hva skjer med BSU hvis jeg flytter','bsu-flytting'],['hva skjer med BSU-kontoen hvis jeg flytter til utlandet','bsu-flytting'],['hva skjer med boligsparing for ungdom hvis jeg flytter','bsu-flytting']]){
  const r=V.search(q);
  assert.equal(r.mode,'uncovered',q);
  assert.equal(r.uncovered.id,gap,q);
  assert.ok(r.hits.length>=1&&r.hits.every(h=>h.kind==='nearest'),q+': nærmeste temaer, ikke svar');
  assert.deepEqual(V.findTopics(q),[],q+': ingenting regnes som svar');
}
// «Flytt» uten BSU i spørsmålet skal ikke utløse BSU-hullet, selv om BSU-temaet treffer på egenkapital eller boligkjøp.
for(const q of ['Vi skal flytte sammen og kjøpe leilighet, hvordan sparer vi egenkapitalen?','Hvor mye egenkapital trenger jeg når jeg flytter til ny bolig?','Jeg flytter hjemmefra og skal kjøpe min første bolig','Bør jeg flytte pengene til fond før boligkjøpet?']){
  const r=V.search(q);
  assert.notEqual(r.mode,'uncovered',q+': skal ikke utløse BSU-hullet');
  assert.ok(!r.uncovered,q);
  assert.ok(r.hits.length>0&&r.hits.every(h=>h.kind!=='nearest'),q+': skal gi vanlige treff');
}
// «Flytte» alene (uten BSU og uten boligkontekst) skal verken utløse BSU-hullet eller peke på BSU. Før rettingen ga alle fire «BSU når du flytter».
for(const q of ['jeg flytter','hva koster flytting','flytte strømavtale','flytte til utlandet']){
  const r=V.search(q);
  assert.notEqual(r.mode,'uncovered',q+': skal ikke utløse BSU-hullet');
  assert.ok(!r.uncovered,q);
  const all=[...r.hits,...r.suggestions].map(h=>h.id);
  assert.ok(!all.includes('bsu')&&!all.includes('q-bsu-basics'),q+': BSU skal ikke vises som relevant på grunnlag av flytteordet alene');
}
// Nytt faglig svar lukker det tidligere innholdshullet.
assert.equal(V.search('hva er renters rente').hits[0].id,'q-renters-rente');
// Spørsmål om det samme temaet uten selve hullet skal fortsatt få svar.
for(const [q,first] of [['hva er barnesparing','children'],['hvem eier pengene på barnesparing','children'],['Hva er BSU?','q-bsu-basics'],['BSU','q-bsu-basics'],['bør jeg flytte penger til fond','funds']]){
  const r=V.search(q);
  assert.equal(r.mode,'answer',q);
  assert.equal(ids(r)[0],first,q);
}
// Hvert hull skal fortsatt være et hull. Hvis svaret nå dekker det, skal raden fjernes fra GAPS.
for(const g of V.gaps){
  const topicIds=g.topics.length?g.topics:V.topics.map(t=>t.id);
  for(const id of topicIds)assert.ok(!g.covers.test(text(id)),'Hullet «'+g.id+'» ser ut til å være dekket av '+id+'. Fjern raden fra GAPS.');
}
// 7. «Boligsparing» er bredere enn BSU: forslag, ikke ett svar. Skrivefeil gir «Mente du».
for(const q of ['boligsparing','hva er boligsparing','bolig sparing','boligsparing uten BSU']){
  const r=V.search(q);
  assert.equal(r.mode,'suggest',q);
  assert.deepEqual(r.hits,[],q);
  assert.ok(sug(r).includes('q-bsu-basics')&&sug(r).includes('bsu'),q);
}
assert.equal(V.search('boligsparing for ungdom').mode,'answer');
assert.equal(V.search('boligsparnig').mode,'suggest');
console.log('veileder-sok-rettinger: ok');

// 7. Ord som bare inneholder «aksj», «børs» eller «indeks» midt i ordet, eller er selskapsrett, skal ikke åpne fondssvaret (sluttkontroll 2026-10-24).
for(const q of ['aksjeselskap','hva er et aksjeselskap','aksjonær','aksjekapital','aksjeeier','aksjeopsjon','reaksjon','transaksjon','aksjon','tannbørste','indeksregulering']){
  const r=V.search(q);
  assert.equal(r.mode,'none',q+': skal ikke åpne fondssvaret');
  assert.deepEqual(V.findTopics(q),[],q);
}
for(const q of ['aksje','aksjer','aksjefond','aksjefondet','aksjekjøp','aksjemarked','børs','børsfall','børsnotert','indeks']){
  const r=V.search(q);
  assert.equal(r.mode,'answer',q);assert.equal(r.hits[0].id,'funds',q);
}
