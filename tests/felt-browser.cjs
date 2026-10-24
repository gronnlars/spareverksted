// Trykk og klikk i et tallfelt skal markere hele tallet, slik at det som skrives erstatter det gamle.
// Før endringen havnet markøren bak tallet, og «2 000» pluss 8 ble stille til 20 008.
// Kjøres i Chromium, Firefox og WebKit (SPARE_ENGINE). WebKit er ikke det samme som Safari på iPhone.
const {chromium,firefox,webkit,devices}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const engine=process.env.SPARE_ENGINE||'chromium',browserType={chromium,firefox,webkit}[engine];
 assert(browserType,'Unknown test browser');
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await browserType.launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']}:{})});
  const touch=engine==='firefox'?{viewport:{width:390,height:844},hasTouch:true}:{...devices['iPhone 13'],defaultBrowserType:undefined};
  delete touch.defaultBrowserType;
  for(const [name,options] of [['pc, mus',{viewport:{width:1280,height:900}}],['mobil, trykk',touch]]){
   const page=await (await browser.newContext(options)).newPage();
   const hit=async loc=>{await loc.scrollIntoViewIfNeeded();if(options.hasTouch)await loc.tap();else await loc.click();};
   const selected=loc=>loc.evaluate(e=>e.selectionStart===0&&e.selectionEnd===e.value.length&&e.value.length>0);
   await page.goto(origin+'/index.html');await page.locator('#chooseGrowth').click();
   // Startguiden: eksempeltallet erstattes.
   const onboard=page.locator('#onboardMonthly');assert.equal(await onboard.inputValue(),'2 000');
   await hit(onboard);await page.waitForTimeout(50);
   assert(await selected(onboard),name+': startguidens felt er ikke markert');
   await page.keyboard.type('3000');assert.equal(await onboard.inputValue(),'3000',name+': startguiden');
   await page.locator('#beginJourney').click();
   // Kalkulatoren: samme oppførsel, og resultatet bygger på det nye tallet.
   const monthly=page.locator('#monthly');await hit(monthly);await page.waitForTimeout(50);
   assert(await selected(monthly),name+': kalkulatorens felt er ikke markert');
   await page.keyboard.type('4000');assert.equal(await monthly.inputValue(),'4000',name+': kalkulatoren');
   // Felt som kan være negative (uten inputmode) skal oppføre seg likt.
   const rate=page.locator('#rate');await hit(rate);await page.waitForTimeout(50);
   assert(await selected(rate),name+': vekstfeltet er ikke markert');
   // Nytt klikk i et felt som allerede har fokus, plasserer markøren, så ett siffer kan rettes.
   // Bare med mus: ved berøring styrer nettleseren selv hva et nytt trykk i markert tekst gjør. Må sjekkes på iPhone.
   if(!options.hasTouch){await hit(monthly);await page.waitForTimeout(800);await hit(monthly);await page.waitForTimeout(100);
    assert(!(await selected(monthly)),name+': andre klikk skal ikke markere alt');}
   await page.close();
  }
  console.log('felt-browser ('+engine+'): trykk og klikk markerer tallet, andre klikk plasserer markøren');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
