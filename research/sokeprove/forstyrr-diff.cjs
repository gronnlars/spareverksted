'use strict';
// Legger fire urelaterte dokumenter til i alle motorer og viser hvilke førstevalg i et testsett som endres.
// Bruk: node research/sokeprove/forstyrr-diff.cjs [utvikling|holdout]
const fs=require('fs'),path=require('path');
const lag=require('./motorer/alle.cjs');
const sett=process.argv[2]||'utvikling';
const cases=JSON.parse(fs.readFileSync(path.join(__dirname,'testsett',sett+'.json'),'utf8')).cases;
const sp=c=>c.repeat?c.q.repeat(c.repeat):c.q;
const A=lag({}).motorer,B=lag({forstyrr:true}).motorer;
console.log('Forstyrrere: '+lag.FORSTYRRERE.map(f=>f.id).join(', ')+'\n');
console.log('| Motor | Endrede førstevalg av '+cases.length+' |\n|---|---:|');
const rader=[];
A.forEach((m,i)=>{let n=0;for(const c of cases){const a=m.search(sp(c)),b=B[i].search(sp(c));if((a.first||'-')!==(b.first||'-')){n++;rader.push(`| ${m.navn} | ${JSON.stringify(c.q.slice(0,30))} | ${a.first||'-'} (${a.kind}) | ${b.first||'-'} (${b.kind}) |`);}}console.log(`| ${m.navn} | ${n} |`);});
console.log('\n| Motor | Søk | Før | Etter |\n|---|---|---|---|');rader.forEach(r=>console.log(r));
