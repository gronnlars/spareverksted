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
  for(const vp of [{width:1280,height:800},{width:390,height:780}]){
   const c=await browser.newContext({viewport:vp});
   await c.addInitScript(p=>{if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','1');localStorage.setItem('sv-scenarios',JSON.stringify(p));}},plans);
   const q=await c.newPage();q.errors=[];q.on('pageerror',e=>q.errors.push(e.message));q.setDefaultTimeout(10000);
   await q.goto(origin+'#start=0&activePage=calculator');await q.waitForTimeout(300);
   await q.evaluate(()=>{document.getElementById('savedDetails').open=true;});
   assert(await q.locator('#planBar').isHidden(),'ingen planlinje før en plan er åpnet');

   // Avkrysning flytter deg ikke, og handlingene vises først når noe er valgt.
   await q.locator('#withdrawalPage').click();await q.evaluate(()=>{document.getElementById('savedDetails').open=true;});
   assert(await q.locator('#pickActions').isHidden());
   await q.locator('input[aria-label="Velg Lars"]').check();
   assert.equal(await q.evaluate(()=>s.activePage),'withdrawals','avkrysning bytter ikke side');
   assert(await q.locator('#pickActions').isVisible());assert.equal(await q.locator('#pickAllText').innerText(),'1 valgt');
   assert.equal(await q.locator('#pickAll').evaluate(e=>e.indeterminate),true);

   // Hovedboksen: delvis valgt -> fjern valg. Ingen valgt -> velg alle.
   await q.locator('#pickAll').click();assert.equal(await q.evaluate(()=>pickedPlans.size),0);
   await q.locator('#pickAll').click();assert.equal(await q.evaluate(()=>pickedPlans.size),5);
   assert(await q.locator('#compareSelected').isDisabled(),'fire sammenlignbare planer: for mange å sammenligne');
   assert.match(await q.locator('#pickHint').innerText(),/tre planer om gangen/);
   await q.locator('input[aria-label="Velg Pensjon"]').uncheck();
   assert(await q.locator('#compareSelected').isEnabled(),'tre valgt, ett sparemål hoppes over');
   assert.match(await q.locator('#pickHint').innerText(),/hoppes over/);
   await q.locator('#compareSelected').click();
   assert.equal(await q.evaluate(()=>s.activePage),'calculator','Sammenlign viser grafen');
   assert.deepEqual(await q.evaluate(()=>[...selectedPlans].sort()),[0,1,4]);
   assert.match(await q.locator('#comparison').innerText(),/Nå i kalkulatoren/);
   assert.equal(await q.locator('#saved .compared').count(),3);
   await q.locator('#stopCompare').click();assert.equal(await q.evaluate(()=>selectedPlans.size),0);

   // Åpne: planlinje, fokus øverst, «Vis ↑» på raden.
   await q.locator('button[aria-label="Åpne Lars"]').click();
   assert(await q.locator('#planBar').isVisible());assert.equal(await q.locator('#planName').innerText(),'Lars');
   assert.equal(await q.evaluate(()=>document.activeElement.id),'planBar');
   await q.waitForTimeout(900);const top=await q.locator('#planBar').evaluate(e=>e.getBoundingClientRect().top);assert(top>=0&&top<vp.height/2,'planlinjen er synlig etter åpning');
   assert.equal(await q.locator('#saved .saved-row.active button').first().innerText(),'Vis ↑');
   assert(await q.locator('#planDirty').isHidden());

   // Endring gir «Ikke lagret» og Lagre oppdaterer samme plan.
   await q.locator('#monthly').fill('2500');await q.locator('#monthly').blur();await q.waitForTimeout(200);
   assert(await q.locator('#planDirty').isVisible());assert(await q.locator('#planSave').isVisible());
   const stored=()=>q.evaluate(()=>JSON.parse(localStorage.getItem('sv-scenarios')));
   assert.equal((await stored()).find(x=>x.name==='Lars').state.monthly,2000,'ingen autolagring');
   await q.locator('#planSave').click();
   assert.equal((await stored()).find(x=>x.name==='Lars').state.monthly,2500);assert.equal((await stored()).length,5);
   assert(await q.locator('#planDirty').isHidden());
   await q.locator('#undo').click();
   assert.equal((await stored()).find(x=>x.name==='Lars').state.monthly,2000,'angre gjenoppretter planen');

   // Lagre-dialogen: Oppdater kontra Lagre ny, og unike navn.
   await q.locator('#monthly').fill('2600');await q.locator('#monthly').blur();await q.waitForTimeout(200);
   await q.evaluate(()=>document.getElementById('save').click());
   assert(await q.locator('#saveUpdate').isVisible());assert.equal(await q.locator('#scenarioName').inputValue(),'Lars (2)');
   await q.locator('#saveNew').click();
   let names=(await stored()).map(x=>x.name);assert.deepEqual(names,['Lars','Plan 1','Bil','Pensjon','Hus','Lars (2)']);
   assert.equal(await q.locator('#planName').innerText(),'Lars (2)');
   await q.evaluate(()=>document.getElementById('save').click());await q.locator('#scenarioName').fill('Lars');await q.locator('#saveNew').click();
   names=(await stored()).map(x=>x.name);assert.equal(names.at(-1),'Lars (3)','samme navn blir ikke lagret to ganger');

   // Slett valgte og angre.
   await q.locator('input[aria-label="Velg Lars (2)"]').check();await q.locator('input[aria-label="Velg Lars (3)"]').check();
   await q.locator('#deleteSelected').click();assert.equal((await stored()).length,5);
   assert(await q.locator('#planBar').isHidden(),'slettet plan er ikke lenger åpen');
   await q.locator('#undo').click();assert.equal((await stored()).length,7);

   // Uten åpen plan foreslås første ledige Plan-navn.
   await q.evaluate(()=>{activePlan=null;savedRender();document.getElementById('save').click();});
   assert.equal(await q.locator('#scenarioName').inputValue(),'Plan 2');assert(await q.locator('#saveUpdate').isHidden());
   await q.locator('#cancelSave').click();
   assert.deepEqual(q.errors,[]);
   assert.equal(await q.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'ingen sideveis rulling');
   await c.close();
  }
  console.log(`Planer (${engine}): velg alle, sammenlign uten sidebytte, åpne med planlinje, ikke lagret, oppdater og angre, unike navn, slett valgte, PC og mobil.`);
 }finally{await browser?.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
