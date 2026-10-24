'use strict';
// Måler kandidaten i Chromium (headless, via Playwright): bygging av indeks og søketid. Pakken lages først:
//   node research/sokeprove/bygg-indeks.cjs && esbuild research/sokeprove/nettleser-inngang.cjs --bundle --format=iife --minify --outfile=<ut>.js
// Bruk: node maal-nettleser.cjs <bundle.js>
const fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const bundle=process.argv[2];
const sp=JSON.parse(fs.readFileSync(path.join(__dirname,'testsett/utvikling.json'),'utf8')).cases.map(c=>c.repeat?c.q.repeat(c.repeat):c.q);
(async()=>{
 const b=await chromium.launch();const p=await b.newPage();
 await p.setContent('<!doctype html><title>t</title>');
 await p.addScriptTag({content:fs.readFileSync(bundle,'utf8')});
 const r=await p.evaluate((sp)=>{
  const med=a=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor(s.length/2)];};
  const p95=a=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor(s.length*0.95)];};
  const t0=performance.now();let m=window.__sok.bygg();const forste=performance.now()-t0;
  const b=[];for(let i=0;i<100;i++){const a=performance.now();m=window.__sok.bygg();b.push(performance.now()-a);}
  for(let i=0;i<3;i++)for(const q of sp)m.search(q);
  const t=[];for(let r=0;r<20;r++)for(const q of sp){const a=performance.now();m.search(q);t.push(performance.now()-a);}
  return {ua:navigator.userAgent,forste_bygg_ms:+forste.toFixed(2),bygg_median_ms:+med(b).toFixed(3),bygg_p95_ms:+p95(b).toFixed(3),sok_n:t.length,sok_median_ms:+med(t).toFixed(3),sok_p95_ms:+p95(t).toFixed(3),sok_maks_ms:+Math.max(...t).toFixed(2)};
 },sp);
 console.log(JSON.stringify(r,null,1));await b.close();
})();
