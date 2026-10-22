// Optional: local server at port 8000, Playwright and Chromium installed.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage(),errors=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8000'))external.push(r.url());});
  await page.goto('http://127.0.0.1:8000/index.html');
  await page.locator('#chooseGrowth').click();
  await page.locator('#onboardAge').fill('57');
  await page.locator('#onboardYears').fill('10');
  await page.locator('.journey-risk > summary').click();
  await page.locator('#onboardRisk').selectOption('high');
  await page.locator('#beginJourney').click();
  await page.getByRole('link',{name:'Spør om sparing',exact:true}).click();
  assert.match(await page.locator('#contextSummary').innerText(),/57 år/);
  assert.match(await page.locator('#contextSummary').innerText(),/10 år/);
  assert.match(await page.locator('#contextSummary').innerText(),/kalkulatoren/);
  assert.equal(await page.locator('#profileDetails').getAttribute('open'),null);
  await page.locator('#topics button').filter({hasText:'Sparing til barn'}).click();
  assert.equal(await page.locator('#answerPanel').isVisible(),true);
  assert.doesNotMatch(await page.locator('#contextSummary').innerText(),/10 år/);
  assert.equal(await page.locator('.tradeoff[open]').count(),0);
  const child=page.locator('.option-card').nth(1);
  await child.locator('.con > summary').click();
  await child.getByText('Formuen kan gi mindre stipend senere',{exact:true}).click();
  assert.match(await child.innerText(),/534 225 kr/);
  assert.match(await child.innerText(),/2026/);
  await page.locator('#profileDetails > summary').click();
  await page.locator('#years').fill('3');
  assert.equal(await page.locator('#answerPanel').isVisible(),false);
  await page.locator('#answerButton').click();
  assert.match(await page.locator('.answer-caution').innerText(),/under fem år/);
  await page.locator('#topics button').filter({hasText:'Sparekonto eller fond'}).click();
  assert.match(await page.locator('#contextSummary').innerText(),/10 år/);
  await page.locator('#question').fill('Boliglån eller fond?');
  await page.getByRole('button',{name:'Vis svar',exact:true}).click();
  assert.equal(await page.locator('#answerTitle').innerText(),'Boliglån eller sparing');
  assert.equal(await page.locator('#matches button').count(),1);
  await page.locator('#question').fill('<img src=x onerror="window.injected=true">');
  await page.getByRole('button',{name:'Vis svar',exact:true}).click();
  assert.equal(await page.locator('#answerPanel').isVisible(),false);
  assert.equal(await page.evaluate(()=>window.injected),undefined);
  for(const t of ['Boliglån eller sparing','Studielån','Sparing til barn','Buffer og dyr gjeld','Sparekonto eller fond','Sparing til pensjon','BSU og boligkjøp']){
   await page.locator('#topics button').getByText(t,{exact:true}).click();
   assert.equal(await page.locator('#answerPanel').isVisible(),true);
   assert.equal(await page.locator('.option-card').count(),2);
   assert.ok(await page.locator('#answer a').count());
  }
  for(const width of [360,390,768,1280]){
   await page.setViewportSize({width,height:850});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`);
  }
  await page.locator('#profileDetails > summary').click();
  await page.locator('#resetGuidance').click();
  assert.doesNotMatch(await page.locator('#contextSummary').innerText(),/57 år/);
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('sv-guidance-tab-v2')),null);
  assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
  console.log('Browser: inherited context, one-click answers, expandable tradeoffs, separate child horizon, updates, reset and mobile overflow passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
