// Navigation must keep the plan intact, preserve focus and make the next action clear.
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
  await page.goto(origin+'/index.html');await page.locator('#chooseGrowth').click();
  await page.locator('#onboardAge').fill('43');await page.locator('#onboardStart').fill('12000');await page.locator('#onboardMonthly').fill('4000');await page.locator('#onboardYears').fill('22');await page.locator('#beginJourney').click();
  await page.locator('#savingsTypes [data-type=index]').click();
  const state=()=>page.evaluate(()=>JSON.stringify({s,view,mode}));
  const unchanged=await state();
  for(const theme of ['neutral','light','night']){
   await page.locator('[data-color-theme='+theme+']').click();
   for(const width of [320,375,390,768,1280]){
    await page.setViewportSize({width,height:812});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal scrolling at '+width+' in '+theme);
   }
   await page.setViewportSize({width:375,height:812});await page.locator('#monthly').scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>document.getElementById('mobileResultButton').textContent==='Se resultat ↓');
   await page.locator('#mobileResultButton').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'savingsResult');
   assert(await page.locator('#meaningMain').isVisible());assert.match(await page.locator('#meaningMain').innerText(),/Et indeksfond kan falle mye/);
   assert.doesNotMatch(await page.locator('#meaningMain').innerText(),/nedre delen av utfallsrommet/);
   assert.equal(await page.locator('#meaningActions button[aria-pressed]').count(),0,'No hidden graph toggle before graph');
   await page.locator('#seeGraph').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'chartPanel');
   const graphTop=await page.locator('#chartPanel').boundingBox();assert(graphTop.y>=0&&graphTop.y<80);
   assert.equal(await state(),unchanged,'Graph jump keeps values and range state');
   await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));
   await page.waitForFunction(()=>document.getElementById('mobileResultButton').textContent==='Endre tall ↑');
   await page.locator('#mobileResultButton').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'planInputs');
   assert.equal(await state(),unchanged,'Return goes to fields without resetting');
  }
  // Keyboard activates the same action and lands on a named region, not an input.
  await page.locator('#seeGraph').focus();await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'chartPanel');
  await page.locator('#chartPanel [data-edit-fields]').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'planInputs');
  // Menus contain the useful actions. Level choice is visible without opening its menu.
  await page.locator('.display-options>summary').click();await page.locator('#levels [data-level=advanced]').click();assert.equal(await page.locator('#displaySummary').innerText(),'Visning: Avansert');
  await page.locator('.site-menu>summary').click();await page.locator('#plansMenu').click();assert.equal(await page.locator('#savedDetails').getAttribute('open'),'');assert.equal(await page.evaluate(()=>document.activeElement.id),'savedHeading');
  // Hidden assumptions and display settings survive editing the start choices.
  await page.evaluate(()=>{s.crash=30;s.crashYear=5;s.extra=50000;s.extraYear=3;view.showBank=true;mode='goal';fill();render();});
  const beforeEdit=await state();
  await page.locator('#editHorizon').click();assert.equal(await page.locator('#onboardStart').inputValue(),'12 000');assert.equal(await page.locator('#onboardYears').inputValue(),'22');assert(await page.locator('#journeyFreshNote').isHidden());
  await page.locator('#closeJourney').click();assert.equal(await state(),beforeEdit,'Cancel changes nothing');
  await page.locator('#editHorizon').click();await page.locator('#onboardMonthly').fill('4500');await page.locator('#beginJourney').click();
  const afterEdit=JSON.parse(await state()),expected=JSON.parse(beforeEdit);expected.s.monthly=4500;
  assert.deepEqual(afterEdit,expected,'Only the edited input changes; crashes, extras, risk, mode and view remain');assert.equal(await page.locator('#displaySummary').innerText(),'Visning: Avansert');
  // Graph navigation also works while the meaning panel is hidden in goal mode.
  assert(await page.locator('#meaning').isHidden());await page.locator('#seeGraph').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'chartPanel');
  await page.locator('#undo').click();assert.equal(await state(),beforeEdit,'Edit can be undone');
  // A new calculation is a separate action and explains what will happen.
  await page.locator('.site-menu>summary').click();assert.equal(await page.locator('#startAgain').innerText(),'Ny beregning');await page.locator('#startAgain').click();
  assert(await page.locator('#journeyFreshNote').isVisible());assert.equal(await page.locator('#onboardStart').inputValue(),'0');await page.locator('#closeJourney').click();assert.equal(await state(),beforeEdit);
  // Desktop uses visible primary navigation, and calculator links keep the current plan.
  await page.setViewportSize({width:1280,height:900});assert(await page.locator('.desktop-nav').isVisible());assert.equal(await page.locator('.site-menu a[href*="github.com"]').count(),0);
  await page.locator('#withdrawalPage').click();await page.locator('.desktop-nav a[href="index.html"]').click();assert.equal(await page.evaluate(()=>s.monthly),4000);assert.equal(await page.evaluate(()=>document.activeElement.id),'planInputs');
  await page.locator('#dreamPage').click();await page.locator('#dreamPanel .return-fields').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'dreamInputs');
  await page.locator('#withdrawalPage').click();await page.locator('#withdrawalPanel .return-fields').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'withdrawInputs');
  await page.goto(origin+'/spor.html');assert(await page.locator('.desktop-nav').isVisible());assert(await page.locator('.site-menu').isHidden());await page.setViewportSize({width:320,height:812});assert(await page.locator('.site-menu').isVisible());
  assert.deepEqual(errors,[]);
  console.log('Passed: result → graph → fields, direction labels, three themes, 320–1280 px, keyboard focus, menus, levels, edit versus new plan, undo and all modules.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
