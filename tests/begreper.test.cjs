// Ordbok-setningen (Lars 2.11.2026): én definisjon per begrep. Svaret begrepet lenker til, henter den med {{begrep:ID}} (Lars 3.11.2026).
const assert=require('node:assert/strict');
global.window=globalThis;
const B=require('../dist/begreper.js'),K=require('../dist/veileder-knowledge.js'),F=require('../dist/veileder-facts.js');
const tekst=e=>JSON.stringify(e).replace(/\\"/g,'"');
for(const b of B.liste){
 assert.doesNotThrow(()=>B.kontroller(b),b.id);
 if(b.svar){const e=K.find(x=>x.id===b.svar);assert.ok(e,'svaret finnes: '+b.svar);assert.ok(tekst(e).includes('{{begrep:'+b.id+'}}'),'svaret henter definisjonen med {{begrep:'+b.id+'}}: '+b.svar);assert.ok(tekst(F.resolve(e)).includes(b.definisjon),'definisjonen vises i '+b.svar);assert.ok(!tekst(e).includes(b.definisjon),'ingen kopi av definisjonen i '+b.svar);}
}
const ok={id:'x',ord:'Avkastning',definisjon:'Avkastning er det pengene tjener eller taper over en periode.',kilder:[{title:'t',url:'u'}],kontrollert:'2026-11-02'};
assert.doesNotThrow(()=>B.kontroller(ok));
for(const [feil,navn] of [
 [{definisjon:'Pengene tjener avkastning over tid.'},'starter ikke med ordet'],
 [{definisjon:'Avkastning, det pengene tjener.'},'mangler er/betyr'],
 [{definisjon:'Avkastning er det pengene tjener. Den kan bli negativ.'},'to setninger'],
 [{definisjon:'Avkastning er '+'mye '.repeat(25)+'penger.'},'over 25 ord'],
 [{definisjon:'Avkastning er 7 % i året.'},'tall'],
 [{definisjon:'Avkastning er noe du bør ha mest mulig av.'},'råd'],
 [{definisjon:'Avkastning er det pengene tjener – eller taper.'},'tankestrek'],
 [{definisjon:''},'tom']
])assert.throws(()=>B.kontroller({...ok,...feil}),Error,navn);
console.log('Begreper: '+B.liste.length+' ordbok-setninger følger reglene, og lenkede svar henter dem fra registeret.');
