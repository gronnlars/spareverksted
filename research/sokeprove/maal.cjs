'use strict';
// Måler størrelse, oppstart og søketid i Node. Bruk: node research/sokeprove/maal.cjs [--json fil]
// Alle tall gjelder dette miljøet og er ikke garantier for brukernes enheter. Syntetisk skalering er merket som syntetisk.
const fs=require('fs'),path=require('path'),zlib=require('zlib'),os=require('os'),cp=require('child_process');
const root=path.join(__dirname,'..','..');
const gz=b=>zlib.gzipSync(b,{level:9}).length;
const fil=f=>{const b=fs.readFileSync(f);return {byte:b.length,gzip:gz(b)};};
const med=a=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor(s.length/2)];};
const p95=a=>{const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.floor(s.length*0.95))];};
const ut={miljo:{node:process.version,cpu:os.cpus()[0].model,kjerner:os.cpus().length,os:os.type()+' '+os.release()}};
// 1. Størrelse
const git=(a)=>cp.execSync('git '+a,{cwd:root,encoding:'utf8'});
const gammel=Buffer.from(git('show main:dist/veileder-engine.js'),'utf8');
const ny=fs.readFileSync(path.join(root,'dist/veileder-engine.js'));
const lib=fil(path.join(__dirname,'lib/minisearch-7.2.0.min.cjs'));
const lag=fil(path.join(__dirname,'motorer/minisearch.cjs'));
const lagMin=(()=>{const r=cp.spawnSync('/opt/npm-tools/node_modules/.bin/esbuild',[path.join(__dirname,'motorer/minisearch.cjs'),'--minify','--bundle=false','--log-level=error'],{encoding:'buffer'});return {byte:r.stdout.length,gzip:gz(r.stdout)};})();
const reg=fil(path.join(__dirname,'register/begreper.json'));
const {lesDokumenter,bygg}=require('./bygg-indeks.cjs');
const {docs}=lesDokumenter();
const idxJson=Buffer.from(JSON.stringify(bygg(JSON.parse(fs.readFileSync(path.join(__dirname,'register/begreper.json'),'utf8')),docs)));
const innhold=fil(path.join(root,'dist/veileder-knowledge.js'));
ut.storrelse={'veileder-engine.js på main':{byte:gammel.length,gzip:gz(gammel)},'veileder-engine.js i #54':{byte:ny.length,gzip:gz(ny)},
 'MiniSearch 7.2.0 (minifisert)':lib,'kandidatlag (uminifisert)':lag,'kandidatlag (minifisert)':lagMin,'register (begreper.json)':reg,'avledet indeks (JSON)':{byte:idxJson.length,gzip:gz(idxJson)},
 'veileder-knowledge.js (innhold)':innhold,
 'tillegg kandidat totalt (bibliotek + lag + indeks, minifisert, gzip)':lib.gzip+lagMin.gzip+gz(idxJson)};
ut.datamengde={dokumenter:docs.length,sporsmal:docs.reduce((n,d)=>n+d.sporsmal.length,0),tekstbyte:Buffer.byteLength(docs.map(d=>d.tittel+' '+d.sporsmal.join(' ')).join(' '))};
// 2. Søketid og oppstart (varm, i samme prosess)
const lagAlle=require('./motorer/alle.cjs');
const spørsmål=JSON.parse(fs.readFileSync(path.join(__dirname,'testsett/utvikling.json'),'utf8')).cases.map(c=>c.repeat?c.q.repeat(c.repeat):c.q);
function tid(f,n){const t=[];for(let i=0;i<n;i++){const a=process.hrtime.bigint();f();t.push(Number(process.hrtime.bigint()-a)/1e6);}return t;}
ut.soketid={};
const navn=['idag','pr54','ms-naiv','ms-kandidat'];
for(const n of navn){
 const {motorer}=lagAlle({motorer:[n]});const m=motorer[0];
 for(let i=0;i<3;i++)for(const q of spørsmål)m.search(q); // oppvarming
 const t=[];for(let r=0;r<20;r++)for(const q of spørsmål)t.push(...tid(()=>m.search(q),1));
 ut.soketid[n]={antallSok:t.length,median_ms:+med(t).toFixed(4),p95_ms:+p95(t).toFixed(4),maks_ms:+Math.max(...t).toFixed(3)};
}
// 3. Oppstart: bygging av indeks, varm (median av 200) og kald (ny Node-prosess: require + bygging, median av 15)
ut.oppstart={};
{const {indeks}=lagAlle({motorer:['idag']});const ms=require('./motorer/minisearch.cjs');
 const t=tid(()=>ms.lagMotor(indeks),200);ut.oppstart['kandidat: bygg indeks (varm), ms']={median:+med(t).toFixed(3),p95:+p95(t).toFixed(3)};
 const t2=tid(()=>ms.naiv(indeks),200);ut.oppstart['naiv: bygg indeks (varm), ms']={median:+med(t2).toFixed(3),p95:+p95(t2).toFixed(3)};
 const {V}=lesDokumenter();const t3=tid(()=>V.interpret('boligflån'),200);ut.oppstart['pr54: første interpret med vokabular (hver gang), ms']={median:+med(t3).toFixed(3)};
}
const kald=[];
for(let i=0;i<15;i++){const r=cp.spawnSync(process.execPath,['-e',`const a=process.hrtime.bigint();const L=require(${JSON.stringify(path.join(__dirname,'motorer/alle.cjs'))});const x=L({motorer:['ms-kandidat']});x.motorer[0].search('boligflån');console.log(Number(process.hrtime.bigint()-a)/1e6)`],{encoding:'utf8'});kald.push(+r.stdout);}
const kaldPr=[];
for(let i=0;i<15;i++){const r=cp.spawnSync(process.execPath,['-e',`const a=process.hrtime.bigint();const L=require(${JSON.stringify(path.join(__dirname,'motorer/alle.cjs'))});const x=L({motorer:['pr54']});x.motorer[0].search('boligflån');console.log(Number(process.hrtime.bigint()-a)/1e6)`],{encoding:'utf8'});kaldPr.push(+r.stdout);}
ut.oppstart['kald prosess: last innhold + bygg + første søk, kandidat (median av 15), ms']=+med(kald).toFixed(1);
ut.oppstart['kald prosess: last innhold + første søk, pr54 (median av 15), ms']=+med(kaldPr).toFixed(1);
// 4. Syntetisk skalering. Dokumentene er syntetiske: ord trukket fra innholdets eget vokabular. Ikke ekte innhold.
function lcg(s){return ()=>(s=(s*1664525+1013904223)%4294967296)/4294967296;}
const rnd=lcg(42);
const ordliste=[...new Set(docs.flatMap(d=>[d.tittel,...d.sporsmal]).join(' ').toLocaleLowerCase('nb-NO').split(/[^\p{L}]+/u).filter(w=>w.length>=3))];
const syn=(n)=>Array.from({length:n},(_,i)=>{const pick=k=>Array.from({length:k},()=>ordliste[Math.floor(rnd()*ordliste.length)]).join(' ');return {id:'syn-'+i,tittel:pick(4),sporsmal:[pick(6)+'?',pick(7)+'?',pick(6)+'?',pick(5)+'?'],form:'tema',navn:[pick(1),pick(1)],produktnavn:[],begreper:[]};});
const ms=require('./motorer/minisearch.cjs');
const {indeks}=lagAlle({motorer:['idag']});
ut.skalering={};
for(const n of [13,130,1300,13000]){
 const extra=syn(Math.max(0,n-13));
 const ix={...indeks,dokumenter:[...indeks.dokumenter,...extra]};
 const b=tid(()=>0,1);const a0=process.hrtime.bigint();const m=ms.lagMotor(ix);const bygg_ms=Number(process.hrtime.bigint()-a0)/1e6;
 for(const q of spørsmål)m.search(q);
 const t=[];for(let r=0;r<3;r++)for(const q of spørsmål)t.push(...tid(()=>m.search(q),1));
 const json=Buffer.byteLength(JSON.stringify(ix));
 // pr54 med like mange emner. Over 1300 emner tok ett enkelt søk så lang tid at vi bare måler en prøve på 5 søk.
 const {V}=lesDokumenter();for(const d of extra)V.topics.push({id:d.id,title:d.tittel,questions:d.sporsmal,words:[new RegExp(d.navn[0].replace(/[^a-zæøå]/g,'')||'zzz')]});
 const prove=n>1300?spørsmål.slice(0,5):spørsmål;
 const t2=[];for(const q of prove)t2.push(...tid(()=>V.interpret(q),1));
 ut.skalering[n+' dokumenter (syntetisk)']={kandidat_bygg_ms:+bygg_ms.toFixed(1),kandidat_median_ms:+med(t).toFixed(3),kandidat_p95_ms:+p95(t).toFixed(3),pr54_median_ms:+med(t2).toFixed(3),pr54_p95_ms:+p95(t2).toFixed(3),indeksdata_json_kb:+(json/1024).toFixed(1)};
}
console.log(JSON.stringify(ut,null,1));
const j=process.argv.indexOf('--json');if(j>0)fs.writeFileSync(process.argv[j+1],JSON.stringify(ut,null,1));
