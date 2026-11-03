// En åpen plan hører til kalkulatoren den er lagret i (Lars 3.11.2026). Før fulgte en åpen spareplan med til Uttak og
// Sparemål øverst, og «Oppdater» eller «Lagre» kunne overskrive den med uttak eller sparemål.
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
  const c=await browser.newContext({viewport:{width:390,height:800}});
  await c.addInitScript(()=>{if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','1');localStorage.setItem('sv-scenarios',JSON.stringify([{name:'Spareplan',state:{years:10,monthly:2000,rate:5,activePage:'calculator'},mode:'explore',view:{}}]));}});
  const q=await c.newPage();const errors=[];q.on('pageerror',e=>errors.push(e.message));q.setDefaultTimeout(10000);
  await q.goto(origin+'#activePage=calculator');await q.waitForTimeout(400);
  const st=()=>q.evaluate(()=>({bar:!document.getElementById('planBar').hidden,dirty:planDirty(),saved:saved.map(x=>x.name+':'+x.state.activePage+':'+x.state.years)}));
  await q.evaluate(()=>openSavedPlan(saved[0]));
  assert.equal((await st()).bar,true,'planlinja vises i Sparing');
  // Uttak: planlinja følger ikke med, og «Oppdater» tilbys ikke.
  await q.evaluate(()=>setPage('withdrawals'));await q.waitForTimeout(200);
  assert.equal((await st()).bar,false,'spareplanen står ikke øverst i Uttak');
  await q.evaluate(()=>openSave());
  assert(await q.locator('#saveUpdate').isHidden(),'kan ikke overskrive spareplanen fra Uttak');
  assert.equal(await q.locator('#scenarioName').inputValue(),'Uttaksplan');
  await q.click('#saveNew');await q.waitForTimeout(200);
  assert.deepEqual((await st()).saved,['Spareplan:calculator:10','Uttaksplan:withdrawals:10'],'spareplanen er uendret, uttaket er en ny plan');
  // Sparemål: endringer gjør ikke spareplanen «ikke lagret».
  await q.evaluate(()=>openSavedPlan(saved[0]));await q.evaluate(()=>setPage('dreams'));await q.waitForTimeout(200);
  assert.equal((await st()).bar,false);
  await q.selectOption('#dreamType','home');await q.waitForTimeout(200);
  assert.equal((await st()).dirty,false);
  await q.evaluate(()=>setPage('calculator'));await q.waitForTimeout(200);
  let now=await st();assert.equal(now.bar,true,'tilbake i Sparing vises spareplanen igjen');assert.equal(now.dirty,false,'endret sparemål gjør ikke spareplanen endret');
  // Uttaksfelt teller ikke for en spareplan, men sparefelt teller for en uttaksplan.
  await q.evaluate(()=>changePlan({retireYears:30}));await q.waitForTimeout(100);assert.equal((await st()).dirty,false);
  await q.evaluate(()=>openSavedPlan(saved[1]));await q.evaluate(()=>setPage('withdrawals'));await q.evaluate(()=>changePlan({years:12}));await q.waitForTimeout(100);
  now=await st();assert.equal(now.bar,true);assert.equal(now.dirty,true,'sparetiden påvirker uttaksplanen');
  // Lista: uttaksplanen beskrives med sparetid og uttakstid.
  await q.evaluate(()=>{document.getElementById('savedDetails').open=true;savedRender();});
  assert.match(await q.locator('#savedDetails').innerText(),/Uttaksplan: sparer 10 år, tar ut i 25 år/);
  assert.deepEqual(errors,[]);await c.close();
  console.log('plan per kalkulator: OK');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
