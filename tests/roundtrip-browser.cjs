// En tur til «Spør om sparing» og tilbake skal ikke endre planen.
// Delte lenker vinner alltid, og bare det brukeren endrer i veilederen legges oppå.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  const context=await browser.newContext({viewport:{width:375,height:812},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const plan=()=>page.evaluate(()=>JSON.stringify({s,mode,view}));
  const result=()=>page.locator('#savingsResult').innerText();
  const toGuide=async()=>{await page.evaluate(()=>document.querySelector('a[href="spor.html"]').click());await page.waitForURL(/spor\.html/);await page.locator('#topicPicker').waitFor();};
  const pick=async id=>{if(!await page.locator('#topicPicker').getAttribute('open'))await page.locator('#topicPicker>summary').click();await page.locator('[data-topic="'+id+'"]').click();};

  // 1. Hele planen beholdes, med lenken tilbake og med tilbakeknappen.
  await page.goto(origin+'/index.html');await page.locator('#chooseGrowth').click();
  await page.locator('#onboardAge').fill('43');await page.locator('#onboardStart').fill('12000');await page.locator('#onboardMonthly').fill('4000');await page.locator('#onboardYears').fill('22');await page.locator('#beginJourney').click();
  await page.locator('#savingsTypes [data-type=index]').click();
  await page.evaluate(()=>{const f=document.getElementById('fee');f.value='0,5';f.dispatchEvent(new Event('input',{bubbles:true}));f.dispatchEvent(new Event('change',{bubbles:true}));});
  await page.evaluate(()=>{const b=document.getElementById('showRange');if(!b.checked)b.click();});
  const before=await plan(),beforeResult=await result();
  assert.match(before,/"start":12000/);assert.match(before,/"savingsType":"index"/);assert.match(before,/"showRange":true/);
  await toGuide();await page.goBack();await page.waitForURL(/index\.html/);await page.locator('#savingsResult').waitFor();
  assert.equal(await plan(),before,'Tilbakeknappen beholder hele planen');assert.equal(await result(),beforeResult);
  await toGuide();await page.locator('a[href="index.html"]').first().click();await page.waitForURL(/index\.html/);
  assert.equal(await plan(),before,'Lenken tilbake beholder hele planen');assert.equal(await result(),beforeResult);
  assert.equal(await page.locator('#savingsTypes [data-type=index]').getAttribute('aria-pressed'),'true','Spareformen vises som valgt');
  assert(await page.locator('#toast').isHidden(),'Ingen melding når ingenting er endret');

  // 2. Risiko endret i veilederen legges oppå. Sparetid for barn er egen horisont og påvirker ikke planen.
  await toGuide();await pick('children');await page.locator('#profileDetails>summary').click();
  await page.locator('#years').fill('3');await page.locator('#risk').selectOption('low');await page.locator('#answerButton').click();
  await page.locator('a[href="index.html"]').first().click();await page.waitForURL(/index\.html/);
  const after=JSON.parse(await plan());
  assert.equal(after.s.stress,'low');assert.equal(after.s.riskChosen,true);
  assert.equal(after.s.years,22,'Horisonten for barnesparing endrer ikke sparetiden i planen');
  assert.equal(after.s.monthly,4000);assert.equal(after.s.rate,JSON.parse(before).s.rate);assert.equal(after.s.fee,0.5);

  // Planter lagret tilstand i en ny fane via spor.html, der kalkulatoren ikke kjører og ikke skriver over.
  const seeded=async(change)=>{const raw=await page.evaluate(()=>[sessionStorage.getItem('sv-guidance-tab-v2'),sessionStorage.getItem('sv-working-plan-v1')]);
   const tab=await context.newPage();tab.on('pageerror',e=>errors.push(e.message));await tab.goto(origin+'/spor.html');
   await tab.evaluate(([a,b,f])=>{sessionStorage.setItem('sv-guidance-tab-v2',a);sessionStorage.setItem('sv-working-plan-v1',b);const C=SpareContext,ctx=C.read(sessionStorage),pl=C.readPlan(sessionStorage);new Function('ctx','p',f)(ctx,pl);C.write(sessionStorage,ctx);sessionStorage.setItem('sv-working-plan-v1',JSON.stringify(pl));},[...raw,change]);
   await tab.goto(origin+'/index.html');await tab.locator('#savingsResult').waitFor({state:'attached'});return tab;};

  // 3. Sparemål: sparetid fra veilederen går til sparemålets periode, ikke til sparetiden i hovedkalkulatoren.
  const dreamTab=await seeded("ctx.profile.years=7;ctx.origins.years='guide';p.state.activePage='dreams';p.state.dreamYears=5;");
  const dream=JSON.parse(await dreamTab.evaluate(()=>JSON.stringify(s)));
  assert.equal(dream.activePage,'dreams');assert.equal(dream.dreamYears,7);assert.equal(dream.years,22,'Sparemålets periode lekker ikke inn i sparetiden');

  // 4. Ugyldig felt i lagret arbeidsplan: standardverdi, melding, resten beholdes.
  const third=await seeded("p.state.monthly=-5;");
  const fixed=JSON.parse(await third.evaluate(()=>JSON.stringify(s)));
  assert.equal(fixed.monthly,2000);assert.equal(fixed.start,12000);assert.equal(fixed.fee,0.5);
  const toast=await third.locator('#toast').innerText();assert.match(toast,/hver måned|per måned/i);assert.match(toast,/Resten av planen er beholdt/);

  // 5. En delt lenke vinner over arbeidsplanen i fanen.
  await third.goto(origin+'/index.html#start=500&monthly=100&years=3');await third.reload();
  const sharedState=JSON.parse(await third.evaluate(()=>JSON.stringify(s)));
  assert.equal(sharedState.start,500);assert.equal(sharedState.monthly,100);assert.equal(sharedState.savingsType,'');

  // 6. Tilbake til startskjermen fjerner arbeidsplanen.
  const startPage=await context.newPage();await startPage.goto(origin+'/index.html');
  await startPage.evaluate(()=>{document.getElementById('workbench').hidden=true;window.dispatchEvent(new Event('pagehide'));});
  assert.equal(await startPage.evaluate(()=>sessionStorage.getItem('sv-working-plan-v1')),null);

  assert.deepEqual(errors,[]);
  console.log('Browser: full plan kept to and from the guide (link and back button), guide edits applied to the right field, invalid stored fields reset with notice, shared links win, start screen clears the plan.');
 }catch(e){console.error(e);process.exitCode=1;}finally{if(browser)await browser.close();server.close();}
})();
