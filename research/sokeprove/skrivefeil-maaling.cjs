'use strict';
// Systematisk måling av skrivefeiltoleranse. Variantene lages av navnene i registeret (ikke fra motorenes svar):
// alle enkeltfeil av fire typer for hvert navn med minst fem bokstaver. Dessuten falske treff på ord som ikke finnes i innholdet.
// Bruk: node research/sokeprove/skrivefeil-maaling.cjs [--json fil]
const fs=require('fs'),path=require('path');
const lag=require('./motorer/alle.cjs');
const {motorer,indeks}=lag({});
const reg=JSON.parse(fs.readFileSync(path.join(__dirname,'register/begreper.json'),'utf8'));
const mål=[];
for(const b of reg.begreper.filter(b=>b.type==='definisjon'))for(const n of [...b.navn,...b.produktnavn])if(/^\p{L}+$/u.test(n)&&n.length>=5)mål.push({navn:n.toLocaleLowerCase('nb-NO'),dok:b.dokument,begrep:b.id});
const TILLATT={'q-fondskonto':['q-fondskonto'],'funds':['funds'],'q-aksjesparekonto':['q-aksjesparekonto']};
function varianter(w){
 const v=[];
 for(let i=0;i<w.length;i++){v.push({t:'sletting',w:w.slice(0,i)+w.slice(i+1)});}
 for(let i=0;i+1<w.length;i++)if(w[i]!==w[i+1])v.push({t:'ombytting',w:w.slice(0,i)+w[i+1]+w[i]+w.slice(i+2)});
 for(let i=0;i<w.length;i++)v.push({t:'bytte',w:w.slice(0,i)+(w[i]==='e'?'a':'e')+w.slice(i+1)});
 for(let i=1;i<w.length;i++)v.push({t:'innsetting',w:w.slice(0,i)+'e'+w.slice(i)});
 return v.filter(x=>x.w!==w&&x.w.length>=3);
}
const ukjente='bilreparasjon pannekaker kjøleskap fotballkamp vinduspusser bensinpris tannlege ferietur hundemat sykkelhjelm gardiner sommerferie teater parkering treningssenter mobilabonnement skoleruta bursdagsgave hagearbeid snømåking kaffemaskin vaskemaskin tomatsuppe bokhylle regnjakke veggmaling nettavis kortspill sjokolade fjellvandring skiløype filmkveld strikkegarn blomsterbed lekeplass sandkasse sommerfugl matpakke bokhandel'.split(' ');
const tot={};
for(const m of motorer){
 const per={};let alle=0,ok=0,forslag=0;
 for(const x of mål)for(const v of varianter(x.navn)){
  const bucket=(v.w.length>=8?'8+':v.w.length>=5?'5-7':'3-4')+' bokstaver';
  const key=v.t+' / '+bucket;
  const r=m.search(v.w);
  const riktig=r.first&&(r.first===x.dok||(x.dok==='q-fondskonto'&&false));
  // «Riktig» = svaret er navnets hjemmedokument. Svar på et annet dokument regnes som feil, også når navnet er flertydig.
  const sug=!riktig&&[r.first,...r.others].includes(x.dok);
  per[key]=per[key]||{n:0,riktig:0,forslag:0,feil:0};per[key].n++;
  if(riktig)per[key].riktig++;else if(sug)per[key].forslag++;else if(r.first)per[key].feil++;
  alle++;if(riktig)ok++;else if(sug)forslag++;
 }
 let fp=0;for(const w of ukjente)if(m.search(w).first)fp++;
 tot[m.navn]={alle,riktig:ok,forslag,fp,ukjente:ukjente.length,per};
}
console.log(`Mål: ${mål.length} navn (≥5 bokstaver), ${Object.values(tot)[0].alle} varianter per motor. Ukjente ord: ${ukjente.length}.\n`);
console.log('| Motor | Varianter | Riktig førstevalg | Bare som forslag | Falske direkte svar på ukjente ord |\n|---|---:|---:|---:|---:|');
for(const [n,t] of Object.entries(tot))console.log(`| ${n} | ${t.alle} | ${t.riktig} (${(100*t.riktig/t.alle).toFixed(0)} %) | ${t.forslag} | ${t.fp} av ${t.ukjente} |`);
const keys=[...new Set(Object.values(tot).flatMap(t=>Object.keys(t.per)))].sort();
console.log('\nRiktig førstevalg per feiltype og ordlengde (varianten har denne lengden etter feilen):\n');
console.log('| Feiltype / lengde | n | '+Object.keys(tot).join(' | ')+' |\n|---|---:|'+Object.keys(tot).map(()=>'---:').join('|')+'|');
for(const k of keys){const n=Object.values(tot).map(t=>t.per[k]&&t.per[k].n).find(Boolean);console.log(`| ${k} | ${n} | `+Object.values(tot).map(t=>{const p=t.per[k];return p?`${p.riktig} (${(100*p.riktig/p.n).toFixed(0)} %)`:'-';}).join(' | ')+' |');}
const j=process.argv.indexOf('--json');if(j>0)fs.writeFileSync(process.argv[j+1],JSON.stringify(tot,null,1));
