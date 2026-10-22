// Brukerflyt med ugyldige tall. Krever playwright, som veileder-browser.cjs. SPARE_BROWSER kan peke på en Chromium.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}try{const d=fs.readFileSync(f);res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(d);}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  const open=async(hash='')=>{const c=await browser.newContext({viewport:{width:1280,height:900},acceptDownloads:true});const p=await c.newPage();p.errors=[];p.on('pageerror',e=>p.errors.push(e.message));p.setDefaultTimeout(10000);await p.goto(origin+hash);return p;};
  const click=(p,id)=>p.evaluate(i=>document.getElementById(i).click(),id);
  let p=await open();
  await p.locator('#chooseGrowth').click();
  await p.locator('#onboardAge').fill('130');await p.locator('#beginJourney').click();
  assert.match(await p.locator('#journeyError').innerText(),/120/);assert.equal(await p.locator('#onboardAge').getAttribute('aria-invalid'),'true');
  await p.locator('#onboardAge').fill('35');await p.locator('#beginJourney').click();
  const total=await p.locator('#total').innerText(),years0=await p.locator('#years').inputValue();
  await p.locator('#years').fill('500');
  assert(await p.locator('#error').isVisible());assert.equal(await p.locator('#years').getAttribute('aria-invalid'),'true');
  assert(await p.evaluate(()=>document.getElementById('main').classList.contains('stale')),'results must be marked stale');
  assert.match(await p.locator('#error').innerText(),/ikke oppdatert/);
  for(const id of ['share','save']){await click(p,id);assert.match(await p.locator('#toast').innerText(),/100 år|Rett ugyldige/,id+' must be blocked');assert(!await p.evaluate(()=>document.getElementById('shareDialog').open),'share dialog must stay closed');}
  await click(p,'reportButton');
  for(const id of ['exportXlsx','exportCsv','exportJson']){let dl=null;p.once('download',d=>dl=d);await click(p,id);await p.waitForTimeout(300);assert.equal(dl,null,id+' must not download invalid data');assert(await p.locator('#exportError').isVisible());}
  await p.evaluate(()=>document.querySelectorAll('dialog').forEach(d=>d.close()));
  await p.locator('#years').fill('100');await p.locator('#rate').fill('100');
  assert.match(await p.locator('#total').innerText(),/(billioner|billiarder|trillioner) kr|over/);assert.match(await p.locator('#secondary').innerText(),/mister praktisk mening/);
  assert(!/e\+\d/.test(await p.locator('main').innerText()),'no scientific notation');
  await p.locator('#years').fill(years0);await p.locator('#rate').fill('5');
  assert.equal(await p.locator('#total').innerText(),total,'fixing the input must restore the result');assert(await p.locator('#error').isHidden());assert(!await p.evaluate(()=>document.getElementById('main').classList.contains('stale')));
  assert.deepEqual(p.errors,[]);
  p=await open('#start=0&monthly=2000&years=500&rate=5&activePage=calculator');await p.waitForTimeout(300);
  assert.equal(await p.locator('#years').inputValue(),'10','invalid shared link must fall back to defaults');assert.match(await p.locator('#toast').innerText(),/standardverdiene/);assert.deepEqual(p.errors,[]);
  p=await open('#start=1000&monthly=500&years=15&rate=4&activePage=calculator');await p.waitForTimeout(300);
  assert.equal(await p.locator('#years').inputValue(),'15','valid shared link must be kept');
  console.log('Passed: invalid input flow, blocked share/save/export, stale marking, large numbers and shared-link fallback.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
