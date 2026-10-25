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
