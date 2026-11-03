// Plannavn ut fra formål, og at PDF fra «Last ned sammenligningen» viser sammenligningen.
// Lagrede planer: åpne, planlinje, unike navn, oppdater kontra ny, velg alle, sammenlign, slett og angre.
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
  ];
  const c=await browser.newContext({viewport:{width:390,height:780}});
  await c.addInitScript(p=>{if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','1');localStorage.setItem('sv-scenarios',JSON.stringify(p));}},plans);
  const q=await c.newPage();q.errors=[];q.on('pageerror',e=>q.errors.push(e.message));q.setDefaultTimeout(10000);
  // Sparemål «Bil» finnes fra før: forslaget blir «Bil (2)». Ferie blir «Ferie».
  await q.goto(origin+'#start=0&activePage=dreams&dreamType=car');await q.waitForTimeout(400);
  const name=async()=>{await q.evaluate(()=>openSave());const v=await q.locator('#scenarioName').inputValue();await q.evaluate(()=>document.getElementById('saveDialog').close());return v;};
  assert.equal(await name(),'Bil (2)');
  await q.selectOption('#dreamType','holiday');await q.waitForTimeout(200);
  assert.equal(await name(),'Ferie');
  await q.selectOption('#dreamType','other');await q.waitForTimeout(200);
  assert.match(await name(),/^Plan \d+$/);
  // Lars 3.11.2026: lagre «Bil», bytt til Bolig. Forslaget skal følge det som er valgt nå, ikke bli «Bil (2)».
  await q.selectOption('#dreamType','car');await q.waitForTimeout(200);
  await q.evaluate(()=>openSave());assert.equal(await q.locator('#scenarioName').inputValue(),'Bil (2)');await q.click('#saveNew');await q.waitForTimeout(300);
  await q.selectOption('#dreamType','home');await q.waitForTimeout(200);
  assert.equal(await name(),'Bolig','nytt formål gir nytt navn');
  await q.selectOption('#dreamType','renovation');await q.waitForTimeout(200);
  assert.equal(await name(),'Oppussing');
  await q.selectOption('#dreamType','car');await q.waitForTimeout(200);
  assert.equal(await name(),'Bil (3)','samme formål som den åpne planen beholder navnet');
  // Sparekalkulatoren: formålet brukes bare når brukeren har valgt det.
  await q.goto(origin+'#activePage=calculator&level=explore');await q.reload();await q.waitForTimeout(400);
  assert.equal(await q.evaluate(()=>s.activePage),'calculator');
  assert.match(await name(),/^Plan \d+$/,'standardformålet alene gir ikke «Pensjon»');
  const purpose=async v=>{await q.evaluate(v=>{const e=document.getElementById('purpose');e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));},v);await q.waitForTimeout(200);};
  await purpose('freedom');
  assert.equal(await name(),'Pensjon (2)','«Pensjon» finnes fra før');
  await purpose('buffer');
  assert.equal(await name(),'Buffer');
  // Sammenligning: velg Lars og Hus, last ned som PDF.
  await q.locator('#withdrawalPage').click();await q.evaluate(()=>{document.getElementById('savedDetails').open=true;});
  for(const n of ['Lars','Hus'])await q.locator(`input[aria-label="Velg ${n}"]`).check();
  await q.locator('#compareSelected').click();
  await q.waitForSelector('#cmpDownload');await q.click('#cmpDownload');await q.click('#exportPdf');
  const report=await q.locator('#reportPreview').innerText();
  assert.match(report,/Planer sammenlignet/,'rapporten viser sammenligningen');
  assert.match(report,/Lars/);assert.match(report,/Hus/);
  // Utskrift (PDF) skal gi samme innhold som forhåndsvisningen, også etter at eksportdialogen er lukket.
  await q.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
  assert.match(await q.locator('#printReportContent').innerText(),/Planer sammenlignet/,'PDF-utskriften viser sammenligningen');
  await q.locator('#reportDialog').evaluate(d=>d.close());
  // Vanlig eksport etterpå skal igjen gi planrapporten.
  await q.evaluate(()=>document.getElementById('reportButton').click());await q.click('#exportPdf');
  assert.doesNotMatch(await q.locator('#reportPreview').innerText(),/Planer sammenlignet/);
  assert.deepEqual(q.errors,[]);
  console.log('plannavn og sammenligningsrapport: OK');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
