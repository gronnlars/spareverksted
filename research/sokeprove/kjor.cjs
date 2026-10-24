'use strict';
// Kjører testsett mot motorene og skriver en lesbar oversikt.
// Bruk: node research/sokeprove/kjor.cjs [--sett utvikling|holdout] [--forstyrr] [--json fil] [--detaljer] [--motorer a,b]
const fs=require('fs'),path=require('path');
const arg=n=>{const i=process.argv.indexOf('--'+n);return i<0?null:(process.argv[i+1]&&!process.argv[i+1].startsWith('--')?process.argv[i+1]:true);};
const sett=arg('sett')||'utvikling';
const lag=require('./motorer/alle.cjs');
const {motorer}=lag({forstyrr:!!arg('forstyrr'),motorer:arg('motorer')?String(arg('motorer')).split(','):undefined});
const filer=sett==='begge'?['utvikling','holdout']:[sett];
const cases=filer.flatMap(f=>JSON.parse(fs.readFileSync(path.join(__dirname,'testsett',f+'.json'),'utf8')).cases);
const sp=c=>c.repeat?c.q.repeat(c.repeat):c.q;
const {klass}=require('./klassifiser.cjs');
const ut=cases.map(c=>({c,res:Object.fromEntries(motorer.map(m=>{const r=m.search(sp(c));return [m.navn,{...r,k:klass(c,r)}];}))}));
const nav=motorer.map(m=>m.navn);
const tell={};for(const n of nav){tell[n]={};for(const u of ut){const k=u.res[n].k;tell[n][k]=(tell[n][k]||0)+1;}}
const K=['RF','RFok','RS','MISS','WD','CR','FS','soft-dekket','soft-mangler'];
const nameK={RF:'riktig førstevalg',RFok:'akseptabelt førstevalg',RS:'bare som forslag',MISS:'ingen treff, men forventet',WD:'feil direkte svar',CR:'riktig avvisning',FS:'feil forslag ved manglende innhold','soft-dekket':'uklare: forslag dekker det forventede','soft-mangler':'uklare: forslag mangler noe'};
console.log(`\n# Sett: ${filer.join('+')} (${cases.length} tilfeller)${arg('forstyrr')?' med forstyrrende dokumenter':''}\n`);
console.log('| Utfall | '+nav.join(' | ')+' |\n|---|'+nav.map(()=>'---:').join('|')+'|');
for(const k of K)console.log(`| ${nameK[k]} | `+nav.map(n=>tell[n][k]||0).join(' | ')+' |');
const grupper=[...new Set(cases.map(c=>c.group))];
console.log('\n## Per gruppe: antall som er riktig (RF + akseptabelt + CR + dekket uklare) av totalt\n');
console.log('| Gruppe | n | '+nav.join(' | ')+' |\n|---|---:|'+nav.map(()=>'---:').join('|')+'|');
const bra=k=>['RF','RFok','CR','soft-dekket'].includes(k);
for(const g of grupper){const us=ut.filter(u=>u.c.group===g);console.log(`| ${g} | ${us.length} | `+nav.map(n=>us.filter(u=>bra(u.res[n].k)).length).join(' | ')+' |');}
if(arg('detaljer')||arg('json')){
 const sym={RF:'✓',RFok:'✓~',RS:'forslag',MISS:'ingen',WD:'FEIL',CR:'✓avvist',FS:'feil-forslag','soft-dekket':'✓','soft-mangler':'mangler'};
 console.log('\n## Tilfeller\n\n| id | søk | forventet | '+nav.join(' | ')+' |\n|---|---|---|'+nav.map(()=>'---').join('|')+'|');
 for(const u of ut){const c=u.c;const forv=c.none?'ingen svar':c.soft?'skjønn: '+(c.also||[]).join(', '):(c.f||[]).join('/')+(c.ok?' (ok: '+c.ok.join('/')+')':'');
  console.log(`| ${c.id} | ${JSON.stringify(c.repeat?c.q.slice(0,20)+' x'+c.repeat:c.q)} | ${forv} | `+nav.map(n=>{const r=u.res[n];return `${sym[r.k]}: ${r.first||'-'}/${r.kind}${r.others.length?' +'+r.others.slice(0,3).join(','):''}`;}).join(' | ')+' |');}
}
if(typeof arg('json')==='string')fs.writeFileSync(arg('json'),JSON.stringify(ut.map(u=>({id:u.c.id,q:u.c.q.slice(0,40),group:u.c.group,res:u.res})),null,1));
