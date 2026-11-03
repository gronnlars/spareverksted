// «Last ned valgte» og «Sammenlign» med mange valgte planer (Lars 3.11.2026).
// Krever playwright. SPARE_BROWSER kan peke på en Chromium. SPARE_ENGINE=firefox|webkit for andre motorer.
const pw=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const engine=process.env.SPARE_ENGINE||'chromium';
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}try{const d=fs.readFileSync(f);res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(d);}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;
 try{
  browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})}:{})});
  const plans=[
   {name:'Lars',state:{years:20,monthly:2000,rate:6,activePage:'calculator'},mode:'explore',view:{}},
   {name:'Plan 1',state:{years:10,monthly:1000,rate:4,activePage:'calculator'},mode:'explore',view:{}},
   {name:'Bil',state:{dreamCost:200000,dreamYears:3,activePage:'dreams'},mode:'explore',view:{}},
   {name:'Pensjon',state:{years:30,monthly:3000,rate:5,activePage:'withdrawals'},mode:'explore',view:{}},
   {name:'Hus',state:{years:5,monthly:5000,rate:3,activePage:'calculator'},mode:'explore',view:{}},
   {name:'Hytte: [plan]/2',state:{years:8,monthly:4000,rate:4,activePage:'calculator'},mode:'explore',view:{}},
  ];
  for(const width of [390,1280]){
   const c=await browser.newContext({viewport:{width,height:800},acceptDownloads:true});
   await c.addInitScript(p=>{if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','1');localStorage.setItem('sv-scenarios',JSON.stringify(p));}},plans);
   const q=await c.newPage();const errors=[];q.on('pageerror',e=>errors.push(e.message));q.setDefaultTimeout(10000);
   await q.goto(origin+'#activePage=calculator');await q.waitForTimeout(500);
   await q.evaluate(()=>{document.getElementById('savedDetails').open=true;});
   // Velg alle spareplaner (fem, med uttak): Sammenlign er åpen og tar de tre øverste.
   await q.locator('#pickAll').check();
   assert.equal(await q.locator('#compareSelected').isDisabled(),false,'sammenligning sperres ikke');
   assert.match(await q.locator('#pickHint').innerText(),/de tre øverste spareplanene/);
   assert(await q.locator('#downloadSelected').isVisible());
   await q.click('#compareSelected');await q.waitForTimeout(300);
   assert.deepEqual(await q.evaluate(()=>[...selectedPlans].sort((a,b)=>a-b).map(i=>saved[i].name)),['Lars','Plan 1','Pensjon']);
   // Velg alle seks, også sparemålet i den andre gruppen, og last ned.
   await q.evaluate(()=>{pickedPlans=new Set(saved.map((_,i)=>i));savedRender();});
   assert.match(await q.locator('#pickHint').innerText(),/Nedlastingen under lista tar med alle/);
   assert.equal(await q.locator('#downloadSelected').innerText(),'Last ned valgte (6)');
   assert.equal(await q.evaluate(()=>{const b=document.getElementById('downloadSelected'),l=document.getElementById('saved');return !!(l.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING);}),true,'knappen står under lista');
   await q.click('#downloadSelected');assert(await q.locator('#selectedExportDialog').evaluate(d=>d.open));
   assert.match(await q.locator('#selectedExportCount').innerText(),/6 planer/);
   const sheets=await q.evaluate(()=>selectedSheets());
   assert.deepEqual(sheets.map(x=>x.name),['Oversikt','Sparing sammenlignet','Lars','Plan 1','Bil','Pensjon','Hus','Hytte plan 2']);
   assert.deepEqual(sheets[1].rows.slice(1).map(r=>r[0]),['Lars','Plan 1','Hus'],'tre øverste spareplaner');
   assert.deepEqual(sheets[0].rows.slice(1).map(r=>r[1]),['Sparing','Sparing','Sparemål','Uttak','Sparing','Sparing'],'kalkulatoren står på hver plan');
   const pension=sheets.find(x=>x.name==='Pensjon').rows.map(r=>r[0]);
   assert(pension.includes('Uttak')&&pension.includes('Sparing før uttak'),'uttaksplanen har begge tabeller');
   for(const sh of sheets)for(const r of sh.rows)assert.doesNotMatch(String(r[0]??''),/^[a-z]+[A-Z]/,'rå nøkkel i '+sh.name);
   const [dl]=await Promise.all([q.waitForEvent('download'),q.click('#selectedExportXlsx')]);
   assert.equal(dl.suggestedFilename(),'spareverksted-planer.xlsx');
   await q.click('#selectedExportPdf');
   assert(await q.locator('#reportDialog').evaluate(d=>d.open),'rapporten åpnes');
   const report=await q.locator('#reportPreview').innerText();
   assert.match(report,/Valgte planer/);assert.match(report,/Sparing: de tre øverste sammenlignet/);
   for(const n of ['Lars','Plan 1','Bil','Pensjon','Hus','Hytte: [plan]/2'])assert(report.includes(n),n+' i rapporten');
   assert.match(report,/Igjen etter \d+ år: .* i dagens kjøpekraft/);
   assert.equal(await q.locator('#reportPreview .report-cmp-chart svg[role=img]').count(),2,'søyler og linjer for sammenligningen av spareplaner');
   assert(await q.locator('#reportPreview .report-cmp-chart').first().locator('rect').count()>=2,'søylegraf først, som på skjermen');
   assert.equal(await q.locator('#reportPreview section').first().evaluate(e=>e.classList.contains('report-page')),false,'første sammenligning på samme side som overskriften');assert.doesNotMatch(report,/frarå|undefined|NaN/);
   // Tabellene får plass på mobil, eller ruller i sitt eget område.
   assert.equal(await q.locator('#reportDialog').evaluate(d=>d.scrollWidth-d.clientWidth),0);
   await q.locator('#reportDialog').evaluate(d=>d.close());
   // Uten avkrysning gjelder knappen alle planene.
   await q.evaluate(()=>{pickedPlans=new Set();savedRender();});
   assert.equal(await q.locator('#downloadSelected').innerText(),'Last ned alle planene');
   await q.click('#downloadSelected');assert.match(await q.locator('#selectedExportCount').innerText(),/Alle de 6/);
   assert.equal((await q.evaluate(()=>selectedSheets())).length,8);await q.click('#closeSelectedExport');
   // Tre valgte spareplaner sammenlignes uansett plass i lista, med graf. Sparemål og uttak får hver sin.
   await q.evaluate(()=>{pickedPlans=new Set([2,3,4,5,0,1]);savedRender();});
   const r2=await q.evaluate(()=>buildSelectedReport());
   assert.match(r2,/Sparing: de tre øverste sammenlignet/);assert.doesNotMatch(r2,/Infinity|NaN|undefined/);
   const top=await q.evaluate(()=>{const d=document.createElement('div');d.innerHTML=buildSelectedReport();const svg=d.querySelector('.report-cmp-chart svg');return [...svg.querySelectorAll('polyline')].every(l=>l.getAttribute('points').split(' ').every(p=>+p.split(',')[1]>=0));});assert(top,'linjene holder seg inne i grafen');assert.doesNotMatch(r2,/Sparemål: .*sammenlignet|Uttak: .*sammenlignet/,'én plan av en type gir ingen sammenligning');
   await q.evaluate(()=>{pickedPlans=new Set([4,5,1]);savedRender();});
   assert.match(await q.evaluate(()=>buildSelectedReport()),/Sparing: planene sammenlignet<\/h3><p>Plan 1, Hus, Hytte/);
   assert.deepEqual(errors,[]);await c.close();
  }
  console.log('last ned valgte (PDF og Excel) og sammenligning av de tre øverste: OK');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
