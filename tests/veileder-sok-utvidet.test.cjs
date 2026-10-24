'use strict';
/* Utvidet test av det lokale søket i «Spør om sparing».
   Hver rad sier hva vi forventer: modus, første treff (eller forslag) og hvorfor.
   Radene er laget av oss, ikke hentet fra ekte brukere. De dekker delord, sammensatte ord,
   synonymer, tastefeil, naturlige spørsmål, like søk med ulike svar, korte og tvetydige søk
   og spørsmål uten kvalitetssikret svar. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const V=require('../dist/veileder-engine.js');
for(const e of require('../dist/veileder-knowledge.js'))V.register(e);
const S=require('../dist/veileder-sok.js');

const rows=[];
// [gruppe, søk, modus, første treff, årsaksdel eller null, kinds som må ligge i treff/forslag]
const row=(group,query,mode,first,why)=>rows.push({group,query,mode,first,why});

// Delord og brede ord: «lån» skal ikke gi ett tilfeldig svar, men merkede forslag.
row('delord','lån','suggest','mortgage','«lån»');
row('delord','hus','suggest','mortgage','«hus»');
row('delord','bank','suggest','funds','«bank»');
row('delord','skatt','suggest',null,'«skatt»');
// Sammensatte ord, med og uten mellomrom og bindestrek.
for(const q of ['boliglån','bolig lån','bolig-lån','Bolig  Lån','BOLIGLÅN'])row('sammensatt',q,'answer','mortgage','boliglån');
for(const q of ['studielån','studie lån','studie-lån'])row('sammensatt',q,'answer','student','studielån');
for(const q of ['sparekonto','spare konto','spare-konto'])row('sammensatt',q,'answer','funds','sparekonto');
row('sammensatt','aksjesparekonto','answer','q-ask-zero',null);
row('sammensatt','aksje sparekonto','answer','q-ask-zero',null);
// Synonymer og hverdagsord.
row('synonym','huslån','answer','mortgage',null);
row('synonym','krisepenger','answer','buffer',null);
row('synonym','nødfond','answer','buffer',null);
row('synonym','kjøpe leilighet','answer','bsu',null);
row('synonym','lånekassen','answer','student',null);
row('synonym','inflasjon','answer','q-kjopekraft',null);
row('synonym','kjøpekraft','answer','q-kjopekraft',null);
// æ, ø og å skrevet uten, og aa/oe/ae.
row('tegn','boliglaan','answer','mortgage',null);
row('tegn','studielaan','answer','student',null);
row('tegn','boligkjop','answer','bsu',null);
row('tegn','pensjonssparing','answer','pension',null);
// Tastefeil: bare merkede forslag, aldri et svar som ser sikkert ut.
row('tastefeil','bloiglån','suggest','mortgage','Mente du «boliglån»?');
row('tastefeil','bolgilån','suggest','mortgage','Mente du «boliglån»?');
row('tastefeil','studielån','answer','student',null);
row('tastefeil','fonnd','suggest','funds','Mente du «fond»?');
row('tastefeil','pensjom','suggest','pension','Mente du «pensjon»?');
// «barn» står riktig i ordet selv med en tastefeil til slutt, så dette er et ekte treff og ikke et gjetningsforslag.
row('tastefeil','barnesparinng','answer','children','«barn»');
// Naturlige spørsmål.
row('naturlig','Hvor stor buffer trenger jeg?','answer','buffer',null);
row('naturlig','Bør jeg betale ned lånet eller spare?','answer','mortgage',null);
row('naturlig','Hva er BSU?','answer','q-bsu-basics',null);
row('naturlig','Hva er prisvekst?','answer','q-kjopekraft',null);
row('naturlig','Hvordan sparer jeg til barnet mitt?','answer','children',null);
row('naturlig','Er det lurt å spare i fond?','answer','funds',null);
// Like søk med ulike svar: skal ikke slås sammen.
row('likt','ips','answer','q-ips-ask',null);
row('likt','ask','choose','q-ips-ask',null);
row('likt','pensjon','answer','pension',null);
row('likt','mindre verdt på sparekontoen','choose','q-kjopekraft',null);
// Korte og tvetydige søk.
for(const q of ['x','ab','sparing','penger','hjelp','tips','hvordan sparer jeg'])row('kort',q,'broad',null,null);
// Mangler kvalitetssikret svar: ærlig «ingen treff», ikke et svakt treff.
for(const q of ['bitcoin','kryptovaluta','formuesskatt','arv','AFP','brukskonto','skilsmisse'])row('mangler',q,'none',null,null);
// Skatt på fond finnes ikke som eget svar. Den skal heller ikke gi funds eller pension som svar.
row('mangler','skatt på fond','suggest',null,'«skatt»');
row('mangler','hva betaler jeg i skatt på fond','suggest',null,'«skatt»');

let bad=0;const lines=[];
for(const r of rows){
 const res=V.search(r.query);
 const top=res.hits[0]||res.suggestions[0]||null;
 const problems=[];
 if(res.mode!==r.mode)problems.push('modus '+res.mode+' (forventet '+r.mode+')');
 if(r.first&&(!top||top.id!==r.first))problems.push('første '+(top&&top.id)+' (forventet '+r.first+')');
 if(r.why&&!(top&&S.reason(top).includes(r.why)))problems.push('årsak «'+(top?S.reason(top):'ingen')+'» (forventet «'+r.why+'»)');
 if(r.mode==='suggest'&&res.hits.length)problems.push('forslag skal ikke ha sikre treff');
 if(r.mode==='none'&&(res.hits.length||res.suggestions.length))problems.push('skal ikke ha noe treff');
 if(problems.length){bad++;lines.push('['+r.group+'] «'+r.query+'»: '+problems.join('; '));}
}
assert.equal(bad,0,'Søkeforventninger brutt:\n'+lines.join('\n'));

// Rangering: eksakt treff over tilnærmet. Tastefeil gir aldri hits.
for(const q of ['bloiglån','fonnd','pensjom'])assert.equal(V.search(q).hits.length,0,q+' skal ikke gi sikre treff');
// Et ord med eksakt treff skal ikke i tillegg få tastefeilforslag som konkurrerer.
assert.equal(V.search('boliglån').suggestions.filter(s=>s.kind==='typo').length,0);

// Ingen falske forslag for vanlige norske ord.
const ordinary='bil bok hund katt sykkel kaffe fotball ferie reise vær mat kake jobb skole musikk film bruk bord stol stue kjøkken mobil'.split(' ');
const falsePositives=ordinary.filter(w=>{const r=V.search(w);return r.hits.length||r.suggestions.length;});
assert.deepEqual(falsePositives,[],'Vanlige ord ga treff eller forslag: '+falsePositives.join(', '));

// Enhetstester av hjelpefunksjonene.
assert.equal(S.distance('boliglån','bloiglån'),1,'bytte av nabobokstaver teller som én feil');
assert.equal(S.distance('fond','fonnd'),1);
assert.equal(S.distance('abc','abc'),0);
assert.equal(S.distance('kort','mye lengre ord'),9,'for ulik lengde stopper tidlig');
assert.equal(S.normalize('  Bolig\u2013Lån?! '),'bolig lån','tankestrek og tegnsetting fjernes');
assert.equal(S.normalize(null),'');
assert.ok(S.normalize('a'.repeat(5000)).length<=600,'lengden begrenses');
assert.equal(S.fold('blåbærgrøt'),'blabaergrot'.replace('ae','e'));
assert.equal(S.reason({kind:'typo',via:'fond'}),'Mente du «fond»?');
assert.equal(S.reason({kind:'related',via:'lån'}),'Ordet «lån» kan høre til her');
assert.equal(S.reason({kind:'match',via:'pensjon'}),'Treff på «pensjon»');
assert.equal(S.reason({kind:'question'}),'Samme spørsmål som i svaret');

// Tom og ugyldig inndata.
for(const bad of ['','   ',null,undefined,'???','...'])assert.equal(V.search(bad).mode,'none',JSON.stringify(bad)+' gir ingen treff');
assert.doesNotThrow(()=>V.search('<img src=x onerror=alert(1)>'));
assert.doesNotThrow(()=>V.search('(('.repeat(400)));
assert.doesNotThrow(()=>V.search('ø'.repeat(600)));

// Personvern: søkekoden skal ikke kunne sende noe ut av nettleseren.
const src=fs.readFileSync(path.join(__dirname,'../dist/veileder-sok.js'),'utf8');
for(const forbidden of ['fetch(','XMLHttpRequest','sendBeacon','WebSocket','localStorage','sessionStorage','document.cookie','import('])
 assert.ok(!src.includes(forbidden),'veileder-sok.js skal ikke bruke '+forbidden);
// Tankestrek (U+2013, U+2014) skal ikke stå i filen.
assert.ok(!/[\u2013\u2014]/.test(src));

const groups={};for(const r of rows)groups[r.group]=(groups[r.group]||0)+1;
console.log('Utvidet søk: '+rows.length+' søk i '+Object.keys(groups).length+' grupper ('+Object.entries(groups).map(([k,v])=>k+' '+v).join(', ')+') gir forventet modus, første treff og begrunnelse. Ingen falske forslag på '+ordinary.length+' vanlige ord.');
