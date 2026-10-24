'use strict';
// Lager markdown-tabell for utvalgte tilfeller fra to resultatfiler. Bruk: node lag-tabell.cjs dev.json holdout.json id,id,...
const fs=require('fs'),path=require('path');
const [dev,hold,ids]=process.argv.slice(2);
const res=[...JSON.parse(fs.readFileSync(dev,'utf8')),...JSON.parse(fs.readFileSync(hold,'utf8'))];
const cases=Object.fromEntries(['utvikling','holdout'].flatMap(f=>JSON.parse(fs.readFileSync(path.join(__dirname,'testsett',f+'.json'),'utf8')).cases).map(c=>[c.id,c]));
const sym={RF:'riktig',RFok:'riktig (akseptabelt)',RS:'bare forslag',MISS:'ingen treff','WD':'FEIL svar',CR:'riktig avvist',FS:'feil forslag','soft-dekket':'forslag dekker','soft-mangler':'forslag mangler'};
const kort=n=>({q:'q-'}[n]||'');
const navn=['idag','pr54','ms-naiv','ms-kandidat'];
console.log('| id | Søk | Forventet | Dagens | #54 | MiniSearch rå | Kandidat |\n|---|---|---|---|---|---|---|');
for(const id of ids.split(',')){
 const r=res.find(x=>x.id===id),c=cases[id];if(!r||!c)continue;
 const forv=c.none?'ingen svar':c.soft?'skjønn: '+(c.also||[]).join(', '):(c.f||[]).join(' / ');
 console.log(`| ${id} | ${JSON.stringify(c.repeat?c.q.trim()+' (gjentatt '+c.repeat+' ganger)':c.q.length>48?c.q.slice(0,45)+'...':c.q)} | ${forv} | `+navn.map(n=>{const x=r.res[n];return `${sym[x.k]}${x.first?': '+x.first:''}`;}).join(' | ')+' |');
}
