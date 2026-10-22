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
  // Fortegn beholdes i både kort (akser) og lang form, også over 1 000 trillioner.
  assert.deepEqual(await p.evaluate(()=>[big(2e21,true),big(-2e21,true),big(-2e21),big(-5e18,true),axisCompact(-3e21),money(-2e21)]),
   ['over 1 000 trill.','under −1 000 trill.','under −1 000 trillioner kr','−5 trill.','under −1 000 trill.','under −1 000 trillioner kr']);
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

  // Skyveknapper: fast område for månedsbeløp, utvidelse bare for gyldige verdier, og ingen
  // store utilsiktede endringer når skrivefeltet har en verdi utenfor skyveknappens område.
  const slider=(q,id)=>q.evaluate(i=>{const r=document.getElementById(i+'Slider'),n=document.getElementById(i+'SliderNote');return {field:document.getElementById(i).value,min:r.min,max:r.max,value:r.value,disabled:r.disabled,note:n.hidden?'':n.innerText,describedBy:document.getElementById(i).getAttribute('aria-describedby')||''};},id);
  p=await open('#activePage=calculator&monthly=50000');await p.waitForTimeout(300);
  let sl=await slider(p,'monthly');
  assert.equal(sl.max,'10000','monthly slider keeps a fixed range');assert.equal(sl.field,'50000','the typed amount must be preserved');
  assert(sl.disabled,'slider is locked until the user chooses it');assert.match(sl.note,/går til 10\s000 kr\. Beløpet ditt beholdes/);assert.match(sl.describedBy,/monthlySliderNote/,'the field points to the explanation');
  // Mus/berøring på en låst skyveknapp endrer ingenting.
  await p.locator('#monthlySlider').click({force:true});await p.locator('#monthlySlider').dispatchEvent('pointerdown');
  assert.equal(await p.locator('#monthly').inputValue(),'50000','a tap on a locked slider must not change the amount');
  // Ugyldig tall utvider aldri området, og forklaringen sier hva som er galt.
  await p.locator('#monthly').fill('20000000');sl=await slider(p,'monthly');
  assert.equal(sl.max,'10000','invalid text must not extend the slider');assert(sl.disabled);assert.match(sl.note,/ugyldig/);
  // Bevisst valg: knappen låser opp, fokus går til skyveknappen, og første tastetrykk gir et vanlig beløp.
  await p.locator('#monthly').fill('50000');await p.locator('#monthlySliderUnlock').click();sl=await slider(p,'monthly');
  assert(!sl.disabled);assert.equal(sl.field,'50000','unlocking alone does not change the amount');assert.match(sl.note,/erstattes 50\s000 kr/);
  assert.equal(await p.evaluate(()=>document.activeElement.id),'monthlySlider');
  await p.keyboard.press('ArrowLeft');sl=await slider(p,'monthly');assert.equal(sl.field,'9900');assert.equal(sl.note,'','no note inside the range');assert.doesNotMatch(sl.describedBy,/SliderNote/);
  await p.locator('#monthlySlider').fill('500');assert.equal(await p.locator('#monthly').inputValue(),'500','slider can select a normal amount');assert(await p.locator('#error').isHidden());
  // Et nytt stort beløp låser igjen.
  await p.locator('#monthly').fill('60000');assert((await slider(p,'monthly')).disabled,'a new large amount locks the slider again');
  // Andre skyveknapper utvides til gyldige verdier, men ikke forbi feltets grense.
  await p.locator('#start').fill('2000000');sl=await slider(p,'start');
  assert.equal(sl.max,'2000000');assert.equal(sl.value,'2000000');assert(!sl.disabled);assert.equal(sl.note,'');
  await p.evaluate(()=>{const r=document.getElementById('startSlider');r.stepDown();r.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.equal(await p.locator('#start').inputValue(),'1999000','one step changes 2 million by one step, not to the old maximum');
  await p.locator('#start').fill('20000000000');sl=await slider(p,'start');
  assert.equal(sl.max,'2000000','invalid start capital must not extend the slider');assert(sl.disabled);
  await p.locator('#start').fill('0');await p.locator('#rate').fill('-95');sl=await slider(p,'rate');
  assert.equal(sl.min,'-99.9','negative valid return extends, but never to the invalid −100 %');assert(!sl.disabled);
  await p.locator('#years').fill('70');assert.equal((await slider(p,'years')).max,'70');
  assert.deepEqual(p.errors,[]);
  p=await open('#activePage=dreams&dreamMonthly=20000&dreamCost=2500000');await p.waitForTimeout(300);
  sl=await slider(p,'dreamMonthly');assert.equal(sl.max,'10000');assert.equal(sl.field,'20000');assert(sl.disabled);
  assert.equal((await slider(p,'dreamCost')).max,'3000000','goal budget slider extends to a valid amount');
  await p.locator('#dreamMonthlySliderUnlock').click();await p.locator('#dreamMonthlySlider').fill('500');
  assert.equal(await p.locator('#dreamMonthly').inputValue(),'500');assert.deepEqual(p.errors,[]);
  // Mobil: forklaringen gir ikke horisontal scrolling, og knappen har tilstrekkelig trykkflate.
  {const c=await browser.newContext({viewport:{width:320,height:700},isMobile:true,hasTouch:true});const q=await c.newPage();await q.goto(origin+'#activePage=calculator&monthly=50000');await q.waitForTimeout(300);
   assert.equal(await q.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0,'no horizontal scroll at 320 px');
   const box=await q.locator('#monthlySliderUnlock').boundingBox();assert(box.height>=24&&box.width>=24,'unlock button target at least 24 px');
   await q.locator('#monthlySlider').tap({force:true});assert.equal(await q.locator('#monthly').inputValue(),'50000','a tap on a locked slider does nothing');await c.close();}

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
