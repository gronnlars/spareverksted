// First-result flow and export/graph agreement, including nominal versus today's kroner.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'../dist'),shots='/tmp/spareverksted-ui-review';
 const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 let browser;const errors=[];
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  const p=await browser.newPage({viewport:{width:375,height:812},reducedMotion:'reduce'});p.on('pageerror',e=>errors.push(e.message));
  fs.mkdirSync(shots,{recursive:true});
  await p.goto(origin+'/index.html');await p.locator('#chooseGrowth').click();
  await p.locator('#onboardStart').fill('10000');await p.locator('#onboardMonthly').fill('1000');await p.locator('#onboardYears').fill('10');
  await p.locator('#beginJourney').click();
  assert.equal(await p.evaluate(()=>document.activeElement.id),'savingsResult');
  assert((await p.locator('#total').boundingBox()).y>=0,'The answer is visible immediately');
  assert((await p.locator('#seeGraph').boundingBox()).y<600,'Graph shortcut precedes the explanation');
  assert.equal(await p.locator('.before-tax-badge').innerText(),'Før skatt');
  assert.match(await p.locator('#resultAssumptions').innerText(),/5 % årlig vekst, 0,2 % kostnad og 2,5 % prisvekst/);
  assert(await p.locator('#resultAssumptions').isVisible(),'Assumptions accompany the first answer');
  await p.screenshot({path:path.join(shots,'01-mobile-result.png')});
  await p.locator('.result-navigation [data-edit-fields]').click();
  assert.equal(await p.evaluate(()=>document.activeElement.id),'planInputs');
  await p.locator('#monthly').fill('1500');await p.locator('.input-result').click();
  assert.equal(await p.evaluate(()=>document.activeElement.id),'savingsResult');
  assert.equal(await p.evaluate(()=>s.monthly),1500);
  await p.locator('.result-navigation [data-edit-fields]').click();await p.locator('#monthly').fill('');
  await p.locator('.input-result').click();
  assert.equal(await p.evaluate(()=>document.activeElement.id),'monthly','Invalid input stays at the field');
  await p.locator('#monthly').fill('1500');await p.locator('#savingsTypes [data-type=savings]').click();
  assert(await p.locator('#toast').isHidden(),'A corrected input dismisses its validation notice');
  await p.waitForTimeout(150);
  await p.locator('.input-result').click();await p.screenshot({path:path.join(shots,'02-mobile-bank.png')});
  await p.locator('#seeGraph').click();await p.screenshot({path:path.join(shots,'03-mobile-graph.png')});
  // Actual downloaded CSV values must match the graph and the XLSX/JSON source matrix.
  // Check at 3 and 25 years, both units, and with/without index-fund scenarios.
  for(const savingsType of ['index','savings'])for(const years of [3,25])for(const real of [false,true]){
   await p.goto(origin+`/index.html#start=100000&monthly=2000&years=${years}&rate=7.11&fee=0.2&savingsType=${savingsType}&showRange=1&real=${real?1:0}`);
   await p.reload(); // Changing only the fragment does not reload the current document.
   const expected=await p.evaluate(()=>({low:rows.at(-1).low,high:rows.at(-1).high,factor:s.real?inflation(s.years):1,matrix:savingsMatrix()}));
   const csvReady=p.waitForEvent('download');await p.evaluate(()=>document.getElementById('exportCsv').click());
   const download=await csvReady,csv=fs.readFileSync(await download.path(),'utf8').replace(/^\uFEFF/,'');
   const records=csv.trim().split(/\r?\n/).map(l=>l.split(';')),last=records.at(-1);
   assert.match(records[0].at(-2),/Lavere scenario før skatt/);
   const low=Number(last.at(-2).replace(',','.')),high=Number(last.at(-1).replace(',','.'));
   const near=(a,b)=>assert(Math.abs(a-b)<=Math.max(1,Math.abs(b))*1e-10,`${savingsType} ${years} ${real}: ${a} versus ${b}`);
   near(low/expected.factor,expected.low);near(high/expected.factor,expected.high);
   near(low,expected.matrix.at(-1).at(-2));near(high,expected.matrix.at(-1).at(-1));
  }
  await p.goto(origin+'/index.html#start=10000&monthly=1000&years=20&savingsType=index&rate=7.11&showRange=1');
  await p.reload();
  await p.locator('#seeGraph').click();await p.screenshot({path:path.join(shots,'04-mobile-index.png')});
  await p.setViewportSize({width:1280,height:900});await p.evaluate(()=>scrollTo(0,0));
  await p.screenshot({path:path.join(shots,'05-desktop.png')});
  // Goal and example entries receive an answer too; invalid starts remain in the guide.
  const context=await browser.newContext({viewport:{width:375,height:812},reducedMotion:'reduce'}),fresh=await context.newPage();
  await fresh.goto(origin+'/index.html');await fresh.locator('#chooseGoal').click();
  await fresh.locator('#onboardYears').fill('0');await fresh.locator('#beginJourney').click();
  assert(await fresh.locator('#journeyError').isVisible());assert(await fresh.locator('#welcomeWizard').isVisible());
  await fresh.locator('#onboardYears').fill('5');await fresh.locator('#beginJourney').click();
  assert.equal(await fresh.evaluate(()=>document.activeElement.id),'dreamSummary');
  await fresh.evaluate(()=>localStorage.removeItem('sv-started'));await fresh.goto(origin+'/index.html');
  await fresh.locator('#chooseGrowth').click();await fresh.locator('#exampleJourney').click();
  assert.equal(await fresh.evaluate(()=>document.activeElement.id),'savingsResult');
  assert.deepEqual(errors,[]);
  console.log('Passed: immediate mobile result, editing and validation, goals and example, CSV/XLSX matrix versus graph for eight scenario/unit combinations.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
