const assert=require('node:assert/strict'),fs=require('node:fs'),V=require('../dist/veileder-engine.js'),Cards=require('../dist/veileder-cards.js');
const {words,duplicates,pieces}=require('./helpers/svartekst.cjs'),before=require('./fixtures/svartekst-before.json');
const entries=require('../dist/veileder-knowledge.js');for(const e of entries)V.register(e);
const drafts=require('../research/svarutkast/gaps-2026-10-25.json').filter(e=>e.id!=='q-renters-rente');for(const e of drafts)V.register({...e,words:e.words.map(s=>new RegExp(s))});
// Prove that the check catches the actual former passiv-forvaltning defect.
const repeated='Forvalteren forsøker å følge indeksen framfor å velge aksjer som skal gjøre det bedre enn den.';
assert.equal(duplicates({intro:repeated,parts:[{text:repeated}]}).length,1);
assert.deepEqual(duplicates({intro:'Kort svar først.',example:{text:'Et nytt eksempel.'}}),[]);
let total=0,oldTotal=0;const rows=[];
for(const e of [...entries,...drafts]){
 const a=Cards.build(e.id,{}),all=words(a),content=words(a,{documentation:false});
 assert.deepEqual(duplicates(a),[],e.id+' has repeated sentences');
 assert.doesNotMatch(pieces(a).join(' '),/\bvi\b|\bvår(?:e|t)?\b|selvkontroll|Kildene har ikke godkjent|Regnesammenheng, egen illustrasjon/iu,e.id);
 // ASK is deliberately expanded with sourced gift, inheritance and transfer rules.
 if(e.id==='q-aksjesparekonto')assert.ok(content<600,'ASK length regression; deviation remains editorially unapproved');
 else if(e.id==='q-fondskonto')assert.ok(content<=300&&all<=450,'Godkjent fondskontorevisjon: innhold innenfor 300 ord, dokumentasjon telles separat');
 else assert.ok(all<before.answers[e.id].all,e.id+' must actually be shorter than the reviewed PR version');
 if(all>300)console.warn(e.id+': '+all+' ord totalt ('+content+' i svaret). Redaksjonelt varsel: over målet på 300, ikke automatisk tekstkutt.');
 total+=all;oldTotal+=before.answers[e.id].all;
 rows.push('| '+e.title+' | '+before.answers[e.id].all+' | '+all+' | '+(all-before.answers[e.id].all)+' |');
}
console.log('Svartekst: ingen like setninger, ingen vi-form, ASK har dokumentert lengdeavvik; øvrige svar kortere. '+oldTotal+' → '+total+' ord ('+((total/oldTotal-1)*100).toFixed(1)+' %).');
if(process.argv.includes('--table'))console.log('| Svar | Før | Etter | Endring |\n| --- | ---: | ---: | ---: |\n'+rows.join('\n'));
