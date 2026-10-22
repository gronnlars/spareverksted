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
  assert.match(await p.locator('#years').getAttribute('aria-describedby'),/\berror\b/,'the field must point to the error message');
  assert.match(await p.locator('#error').innerText(),/«Du vil spare i»/,'the message must use the label shown on screen');
  for(const id of ['share','save']){await p.locator('#rate').focus();await click(p,id);assert.match(await p.locator('#toast').innerText(),/100 år/,id+' must be blocked');assert(!await p.evaluate(()=>document.getElementById('shareDialog').open||document.getElementById('saveDialog').open),id+' dialog must stay closed');assert.equal(await p.evaluate(()=>document.activeElement.id),'years',id+' must move focus to the invalid field');}
  await click(p,'reportButton');assert(!await p.evaluate(()=>document.getElementById('exportDialog').open),'export dialog must not open with invalid input');
  await p.evaluate(()=>document.getElementById('exportDialog').showModal());
  for(const id of ['exportXlsx','exportCsv','exportJson']){let dl=null;p.once('download',d=>dl=d);await click(p,id);await p.waitForTimeout(300);assert.equal(dl,null,id+' must not download invalid data');assert(await p.locator('#exportError').isVisible());}
  await p.evaluate(()=>document.querySelectorAll('dialog').forEach(d=>d.close()));
  await p.locator('#years').fill('100');await p.locator('#rate').fill('100');
  assert.match(await p.locator('#total').innerText(),/(billioner|billiarder|trillioner) kr|over/);assert.match(await p.locator('#secondary').innerText(),/mister praktisk mening/);
  assert(!/e\+\d/.test(await p.locator('main').innerText()),'no scientific notation');
  await p.locator('#years').fill(years0);await p.locator('#rate').fill('5');
  assert.equal(await p.locator('#total').innerText(),total,'fixing the input must restore the result');assert(await p.locator('#error').isHidden());assert(!await p.evaluate(()=>document.getElementById('main').classList.contains('stale')));
  assert.deepEqual(p.errors,[]);
  // Delte lenker: bare ugyldige felt tilbakestilles, og brukeren får vite hvilke.
  p=await open('#start=100000&monthly=5000&years=500&rate=5&activePage=calculator');await p.waitForTimeout(300);
  assert.equal(await p.locator('#years').inputValue(),'10','invalid field must fall back to default');
  assert.equal(await p.locator('#monthly').inputValue(),'5000','valid fields must be kept');assert.equal(await p.locator('#start').inputValue(),'100000');
  assert.match(await p.locator('#toast').innerText(),/«Du vil spare i».*Resten av planen er beholdt/);assert.deepEqual(p.errors,[]);
  p=await open('#start=1000&monthly=500&years=15&rate=4&activePage=calculator');await p.waitForTimeout(300);
  assert.equal(await p.locator('#years').inputValue(),'15','valid shared link must be kept');assert.equal(await p.locator('#toast').innerText(),'','valid link gives no warning');
  p=await open('#activePage=dreams&dreamYears=500&dreamMonthly=4000&dreamCost=250000');await p.waitForTimeout(300);
  assert.equal(await p.locator('#dreamYears').inputValue(),'5');assert.equal(await p.locator('#dreamMonthly').inputValue(),'4000');assert(await p.locator('#dreamError').isHidden());
  assert.match(await p.locator('#toast').innerText(),/«Tid til kjøpet»/);
  p=await open('#activePage=withdrawals&withdrawMode=tull&real=2&monthly=&rate=6');await p.waitForTimeout(300);
  assert.equal(await p.locator('#withdrawMode').inputValue(),'amount');assert.equal(await p.locator('#rate').inputValue(),'6');
  const linkToast=await p.locator('#toast').innerText();for(const name of ['Hva vil du finne ut?','Du sparer hver måned'])assert(linkToast.includes('«'+name+'»'),'toast must name '+name+': '+linkToast);
  p=await open('#activePage=tull');await p.waitForTimeout(300);assert.equal(await p.evaluate(()=>document.body.dataset.page),'calculator');assert.deepEqual(p.errors,[]);

  // Sparemål: egne feltnavn, riktig felt markert, og ugyldige mål kan ikke deles, lagres eller eksporteres.
  p=await open('#activePage=dreams');await p.waitForTimeout(300);
  await p.locator('#dreamMonthly').fill('20000000');
  assert.match(await p.locator('#dreamError').innerText(),/«Jeg kan spare per måned»/);
  assert.equal(await p.locator('#dreamMonthly').getAttribute('aria-invalid'),'true');assert.match(await p.locator('#dreamMonthly').getAttribute('aria-describedby'),/dreamError/);
  assert.notEqual(await p.locator('#monthly').getAttribute('aria-invalid'),'true','the savings field must not be marked for a goal error');
  for(const id of ['share','save','reportButton']){await click(p,id);await p.waitForTimeout(100);assert(!await p.evaluate(()=>[...document.querySelectorAll('dialog')].some(d=>d.open)),id+' must be blocked for an invalid goal');assert.match(await p.locator('#toast').innerText(),/Jeg kan spare per måned/);}
  await p.evaluate(()=>setPage('calculator'));assert.equal(await p.evaluate(()=>document.body.dataset.page),'calculator');
  await click(p,'share');assert(!await p.evaluate(()=>document.getElementById('shareDialog').open),'an invalid goal must also block sharing from another page');
  assert.equal(await p.evaluate(()=>document.body.dataset.page),'dreams','user is taken to the goal field');assert.equal(await p.evaluate(()=>document.activeElement.id),'dreamMonthly');
  await p.locator('#dreamYears').fill('0');await p.locator('#dreamMonthly').fill('3000');
  assert.match(await p.locator('#dreamError').innerText(),/«Tid til kjøpet».*én måned/);assert.equal(await p.locator('#dreamYears').getAttribute('aria-invalid'),'true');assert.notEqual(await p.locator('#dreamMonthly').getAttribute('aria-invalid'),'true');
  await p.locator('#dreamYears').fill('5');assert(await p.locator('#dreamError').isHidden());assert.notEqual(await p.locator('#dreamYears').getAttribute('aria-invalid'),'true');
  await click(p,'share');assert(await p.evaluate(()=>document.getElementById('shareDialog').open),'a valid goal can be shared');assert.match(await p.locator('#shareUrl').inputValue(),/dreamMonthly=3000/);
  assert.deepEqual(p.errors,[]);

  // Uttak: beregningsfeil i aktiv modul markerer feltet og stopper deling.
  p=await open('#activePage=withdrawals&retireYears=0');await p.waitForTimeout(300);
  assert.match(await p.locator('#retirementResult').innerText(),/«År med uttak»/);assert.equal(await p.locator('#retireYears').getAttribute('aria-invalid'),'true');
  await click(p,'share');assert(!await p.evaluate(()=>document.getElementById('shareDialog').open),'withdrawal error must block sharing');assert.equal(await p.evaluate(()=>document.activeElement.id),'retireYears');
  await p.locator('#retireYears').fill('20');assert.notEqual(await p.locator('#retireYears').getAttribute('aria-invalid'),'true');
  await click(p,'share');assert(await p.evaluate(()=>document.getElementById('shareDialog').open));assert.deepEqual(p.errors,[]);

  // Lagrede planer fra før grensene ble innført: ugyldige felt tilbakestilles og nevnes, resten beholdes.
  {const c=await browser.newContext({viewport:{width:1280,height:900}});await c.addInitScript(()=>{if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','1');localStorage.setItem('sv-scenarios',JSON.stringify([{name:'Gammel plan',state:{years:500,monthly:4321,rate:6,withdrawMode:'tull'},mode:'explore',view:{}}]));}});
   const q=await c.newPage();q.errors=[];q.on('pageerror',e=>q.errors.push(e.message));await q.goto(origin+'#start=0&activePage=calculator');await q.waitForTimeout(300);
   await q.evaluate(()=>{document.getElementById('savedDetails').open=true;});await q.locator('button[aria-label="Åpne Gammel plan"]').click();
   assert.equal(await q.locator('#monthly').inputValue(),'4321');assert.equal(await q.locator('#years').inputValue(),'10');
   assert.match(await q.locator('#undoText').innerText(),/«Du vil spare i»/);assert(await q.locator('#error').isHidden());assert.deepEqual(q.errors,[]);await c.close();}
  console.log('Passed: invalid input flow, blocked share/save/export with focus, stale marking, large numbers, field-by-field shared links, goal and withdrawal validation, and old saved plans.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
