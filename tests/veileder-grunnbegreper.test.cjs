const assert=require('node:assert/strict'),V=require('../dist/veileder-engine.js'),Cards=require('../dist/veileder-cards.js');
for(const e of require('../dist/veileder-knowledge.js'))V.register(e);
for(const q of ['indeksfond','indeks fond','Hva er et indeksfond?','Hva betyr passiv forvaltning?','Hvordan fungerer indeksfond?']){
 const r=V.search(q);assert.equal(r.mode,'answer',q);assert.equal(r.hits[0].id,'q-indeksfond',q);
}
for(const q of ['Er fond sparing?','Må jeg investere for å spare?','Hva er forskjellen på sparing og investering?'])assert.equal(V.search(q).hits[0].id,'q-sparing-investering',q);
assert.equal(V.search('indeksfomd').mode,'suggest');assert.equal(V.search('indeksfomd').suggestions[0].id,'q-indeksfond');
for(const [q,id] of [['ASK eller IPS?','q-ips-ask'],['Hvor stor buffer trenger jeg?','buffer'],['Hva er ASK?','q-aksjesparekonto']])assert.equal(V.search(q).hits[0].id,id,q);
assert.equal(V.search('Hva er et rentefond?').mode,'uncovered');
for(const id of ['q-indeksfond','q-sparing-investering']){
 const c=Cards.build(id,{});assert.equal(c.kind,'explainer');assert.equal(c.checked,'2026-10-25');assert.ok(c.sources.length);assert.equal(c.options.length,0);assert.doesNotMatch(JSON.stringify(c),/[–—]|\.\.\./);
}
assert.match(JSON.stringify(Cards.build('q-indeksfond',{})),/500 kr, 300 kr og 200 kr/);
assert.match(Cards.build('q-sparing-investering',{}).intro,/risiko for tap/);
console.log('Grunnbegreper: egne svar, særskriving, skrivefeil og avgrensninger består.');

// SV-022 og SV-023: faktiske svar, alternative formuleringer og avgrensninger.
for(const q of ['renters rente','rentersrente','rentes rente','rente på rente','Får jeg renter på rentene?','Hvordan fungerer renters rente?']){
 const r=V.search(q);assert.equal(r.mode,'answer',q);assert.equal(r.hits[0].id,'q-renters-rente',q);
}
for(const q of ['Hvordan påvirker inflasjon sparepengene mine i banken?','Hvorfor får jeg mindre for sparepengene?','kjøpe kraft'])assert.equal(V.search(q).hits[0].id,'q-kjopekraft',q);
for(const [q,id] of [['rentersrnete','q-renters-rente'],['innflasjon','q-kjopekraft']]){
 const r=V.search(q);assert.equal(r.mode,'suggest',q);assert.equal(r.suggestions[0].id,id,q);
}
for(const q of ['rentefradrag','Hva er et rentefond?','fast eller flytende rente'])assert.notEqual(V.search(q).mode,'answer',q);
const rr=Cards.build('q-renters-rente',{}),kp=Cards.build('q-kjopekraft',{});
assert.match(rr.example.text,/11 025 kr/);assert.match(rr.example.text,/før skatt, kostnader og prisvekst/);
assert.match(kp.intro,/etter skatt og kostnader/);
for(const c of [rr,kp]){assert.equal(c.kind,'explainer');assert.equal(c.checked,'2026-10-25');assert.ok(c.sources.length>=2);assert.doesNotMatch(JSON.stringify(c),/[–—]|\.\.\./);}
// Uavhengig kontroll av eksempeltall med årlig løkke og prisomregning.
let amount=10000;for(let year=0;year<2;year++)amount+=amount*0.05;
assert.equal(amount,11025);assert.equal(10000*1.1*0.9,9900);assert.equal(Math.round(10300/1.04),9904);
