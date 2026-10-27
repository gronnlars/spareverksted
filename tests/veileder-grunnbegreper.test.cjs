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
// SV-022: eget svar etter faktisk innholdsintegrasjon. Øvrige GAPS beholdes.
for(const q of ['renters rente','rentersrente','rentes rente','rente på rente','Får jeg renter på rentene?','Hvordan fungerer renters rente?']){
 const r=V.search(q);assert.equal(r.mode,'answer',q);assert.equal(r.hits[0].id,'q-renters-rente',q);
}
assert.equal(V.search('rentersrnete').mode,'suggest');assert.equal(V.search('rentersrnete').suggestions[0].id,'q-renters-rente');
for(const q of ['Hva er rentefond?','skatt på barnesparing','Hva skjer med BSU hvis jeg flytter til utlandet?','Hva er utbytte fra fond?'])assert.equal(V.search(q).mode,'uncovered',q);
const rr=Cards.build('q-renters-rente',{});assert.equal(rr.kind,'explainer');assert.equal(rr.next.more.length,1);assert.match(rr.parts[0].text,/renteinntekt er skattepliktig/);
assert.ok(rr.sources.every(x=>!x.url.includes('dnb.no')));assert.equal(rr.checked,'2026-10-25');
const E=require('../dist/engine.js');
for(const [link,nominal,real]of [[rr.next,11025,11025],[rr.next.more[0],10404,10000*1.02**2/1.025**2]]){
 const params=new URLSearchParams(link.href.split('#')[1]),s=E.sanitize(Object.fromEntries(params),{text:true});assert.deepEqual(s.rejected,[]);
 const x=E.explain(s.state);assert.ok(Math.abs(x.final-nominal)<1e-6);assert.ok(Math.abs(x.real-real)<1e-6);
}
console.log('SV-022: søk, gjenværende hull og begge kalkulatorlenker består.');
