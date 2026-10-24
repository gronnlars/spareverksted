'use strict';
/* Vurdering av registeret mot #52 (søkelinjen som anbefales). Kjør:
   node register-vurdering.cjs <sti til #52-utsjekk>
   Viser (1) hvor mange steder et navn må skrives i dag, (2) hvilke registrerte navn #52 allerede treffer riktig,
   (3) hva som mangler, (4) at validatoren stopper dobbelt hjem og kryssende navn før de blir feiltreff. */
const path=require('node:path'),fs=require('node:fs');
const root=path.resolve(process.argv[2]||'.');
const V=require(path.join(root,'dist/veileder-engine.js'));
for(const e of require(path.join(root,'dist/veileder-knowledge.js')))V.register(e);
const reg=JSON.parse(fs.readFileSync(path.join(__dirname,'register/begreper.json'),'utf8'));
const {valider}=require('./valider-register.cjs');
const fold=s=>String(s).toLocaleLowerCase('nb-NO').replace(/å/g,'a').replace(/ø/g,'o').replace(/æ/g,'ae');
const ids=new Set(V.topics.map(t=>t.id));
const docs=V.topics.map(t=>({id:t.id,title:t.title}));
console.log('Dokumenter i #52-utsjekken:',V.topics.length,'| begreper i registeret:',reg.begreper.length);

// 1. Hvor mange steder står et navn i dag?
let totalKeys=0,totalRegex=0,totalQ=0;
for(const t of V.topics){totalKeys+=(t.keys||[]).length;totalRegex+=t.words.length;totalQ+=t.questions.length;}
console.log(`\n1. Dobbeltarbeid i dag: ${totalKeys} søkeord (keys), ${totalRegex} regulære uttrykk (words) og ${totalQ} spørsmålstekster, alle skrevet for hånd per dokument.`);
console.log('   Et nytt navn (f.eks. «kapitalforsikring») må i dag føres inn i regex OG keys, og fanges ikke opp av noen kontroll hvis det havner i feil dokument.');

// 2-3. Treffer #52 hvert registrert navn riktig i dag?
let ok=0,bad=[],skip=0;
for(const b of reg.begreper.filter(b=>b.type==='definisjon')){
 if(!ids.has(b.dokument)){skip+=b.navn.length+b.produktnavn.length;continue;}
 for(const n of [...b.navn,...b.produktnavn]){
  const r=V.search(n);const first=r.hits[0]&&r.hits[0].id;
  if(r.mode==='answer'&&first===b.dokument)ok++;else bad.push(`${n} → ${r.mode}:${first||'-'} (forventet ${b.dokument})`);
 }
}
console.log(`\n2. Registrerte navn som #52 allerede gir riktig direkte svar på: ${ok}. Hoppet over (dokumentet finnes ikke i denne utsjekken, krever #53): ${skip}.`);
console.log('3. Registrerte navn der #52 ikke gir rett svar i dag:',bad.length);
for(const x of bad)console.log('   -',x);

// 4. Validatoren mot feil som ellers ville blitt feiltreff.
const kopi=()=>JSON.parse(JSON.stringify(reg));
const base=valider(reg,docs);
console.log(`\n4. Validator på registeret slik det står: ${base.feil.length} feil, ${base.advarsler.length} advarsler.`);
console.log('   (De '+base.feil.length+' feilene over gjelder dokument som først kommer med #53. De trekkes fra, så bare nye feil telles under.)');
const test=(navn,endre)=>{const r=kopi();endre(r);const v=valider(r,docs);const nye=v.feil.filter(f=>!base.feil.includes(f));console.log(`   ${navn}: ${nye.length?'STOPPET ('+nye[0]+')':'IKKE stoppet'}`);};
test('«pensjonssparing» som navn på både IPS og BSU',r=>{r.begreper.find(b=>b.id==='ips').navn.push('pensjonssparing');r.begreper.find(b=>b.id==='bsu').navn.push('pensjonssparing');});
test('begrep som peker på dokument som ikke finnes',r=>{r.begreper.find(b=>b.id==='bsu').dokument='q-finnes-ikke';});
test('relasjon til ukjent begrep',r=>{r.begreper.find(b=>b.id==='bsu').beslektet.push({til:'finnes-ikke',relasjon:'relatert'});});
test('ukjent relasjonstype',r=>{r.begreper.find(b=>b.id==='bsu').beslektet.push({til:'ips',relasjon:'synonym'});});
test('«ASK» med ulik skrivemåte på to begreper («ask» og «ASK»)',r=>{r.begreper.find(b=>b.id==='ips').navn.push('ask');});
