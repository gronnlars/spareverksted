'use strict';
/* Teller utfallene fra de lagrede resultatfilene og sammenligner med tabellene i RAPPORT.md.
   Kjør: node oppsummer.cjs            (skriver tabellene)
         node oppsummer.cjs --sjekk    (feiler hvis RAPPORT.md avviker fra resultatfilene)
   Slik telles: «streng» = bare RF (riktig førstevalg). «inkl. akseptabelt» = RF + RFok.
   Rapporten bruker «inkl. akseptabelt». Tallet 32 mot 29 (streng) og 33 mot 30 (inkl.) gjelder samme kjøring. */
const fs=require('node:fs'),path=require('node:path');
const sett={utvikling:'Utviklingssett',holdout:'Holdout'};
const motorer=[['idag','Dagens'],['pr54','#54'],['ms-naiv','MiniSearch rå'],['ms-kandidat','Kandidat']];
const telling={};
for(const s of Object.keys(sett)){
 const rader=JSON.parse(fs.readFileSync(path.join(__dirname,'resultater',s+'.json'),'utf8'));
 telling[s]={n:rader.length};
 for(const [m] of motorer){
  const c={};for(const r of rader)c[r.res[m].k]=(c[r.res[m].k]||0)+1;
  telling[s][m]={streng:c.RF||0,inkl:(c.RF||0)+(c.RFok||0),RS:c.RS||0,MISS:c.MISS||0,WD:c.WD||0,CR:c.CR||0};
 }
}
const linje=(s,f)=>'| '+motorer.map(([m])=>telling[s][m][f]).join(' | ')+' |';
let ut='';
for(const s of Object.keys(sett)){
 ut+=`\n${sett[s]} (${telling[s].n} tilfeller)\n| Utfall | ${motorer.map(m=>m[1]).join(' | ')} |\n|---|${motorer.map(()=>'---:').join('|')}|\n`;
 for(const [f,t] of [['streng','Riktig førstevalg, streng (RF)'],['inkl','Riktig førstevalg inkl. akseptabelt (RF + RFok)'],['RS','Riktig dokument bare som forslag (RS)'],['MISS','Ingen treff selv om innholdet finnes (MISS)'],['WD','Feil direkte svar (WD)'],['CR','Riktig avvisning (CR)']])ut+=`| ${t} ${linje(s,f)}\n`;
}
console.log(ut);
if(process.argv.includes('--sjekk')){
 const rapport=fs.readFileSync(path.join(__dirname,'RAPPORT.md'),'utf8');
 let feil=0;
 const forvent=[['Utviklingssett','Riktig førstevalg (inkl. akseptabelt)','utvikling'],['holdout','Riktig førstevalg (inkl. akseptabelt)','holdout']];
 const tabeller=rapport.split(/\n(?=\*\*)/).filter(x=>/Riktig førstevalg \(inkl\. akseptabelt\)/.test(x));
 const hent=t=>t.split('\n').find(l=>l.startsWith('| Riktig førstevalg (inkl. akseptabelt)')).split('|').slice(2,6).map(x=>Number(x.trim()));
 const sjekkes=[['utvikling',tabeller[0]],['holdout',tabeller[1]]];
 for(const [s,t] of sjekkes){
  if(!t){console.error('Fant ikke tabell for',s);feil++;continue;}
  const sa=hent(t),fa=motorer.map(([m])=>telling[s][m].inkl);
  if(sa.join()!==fa.join()){console.error(`AVVIK ${s}: rapport ${sa} mot resultatfil ${fa}`);feil++;}
  else console.log(`ok ${s}: ${fa}`);
 }
 process.exit(feil?1:0);
}
