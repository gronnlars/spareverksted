// BSU: actual rendering, keyboard, profiles and screenshots in all CI browsers.
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const engine=process.env.SPARE_ENGINE||'chromium',browserType=require('playwright')[engine];
(async()=>{
 const root=path.resolve(__dirname,'../dist'),server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await browserType.launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox']}:{}),...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  const dir='/tmp/spareverksted-ui-review';fs.mkdirSync(dir,{recursive:true});
  for(const width of [320,390,1280]){
   const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:'+server.address().port+'/spor.html');
   await page.locator('#question').fill('Hva er BSU?');await page.locator('#questionForm button').click();
   await page.locator('.explain-overview').waitFor();
   assert.equal(await page.evaluate(()=>document.activeElement.id),'answerTitle');
   assert.equal(await page.locator('#contextPanel').isHidden(),true);
   assert.equal(await page.locator('#answer .explain-terms').count(),0);
   assert.equal(await page.locator('#answer .explain-example').count(),0);
   const before=await page.locator('#answer').textContent();
   for(const kind of ['pro','con']){
    const group=page.locator('.explain-overview .'+kind);
    await group.locator('summary').focus();await page.keyboard.press('Enter');assert.notEqual(await group.getAttribute('open'),null);
    assert.equal(await group.locator('li').count(),kind==='pro'?2:1);
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.locator('#answerPanel').screenshot({path:dir+'/bsu-'+engine+'-'+width+'.png'});
   await page.locator('#answer .full-answer summary').focus();await page.keyboard.press('Enter');
   assert.match(await page.locator('#answer .full-answer').innerText(),/direkte overføring mellom bankene/);
   const table=page.locator('#answer table');assert.equal(await table.count(),1);
   assert.equal(await table.locator('caption').count(),1);
   assert.equal(await table.locator('thead th[scope="col"]').count(),3);
   assert.equal(await table.locator('tbody th[scope="row"]').count(),9);
   assert.equal(await table.locator('tbody tr').last().innerText(),'2026 (jan. til aug.)\t5,49\t4,48');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.ok(await table.evaluate(t=>t.scrollWidth<=t.clientWidth+1));
   await page.locator('#answerPanel').screenshot({path:dir+'/bsu-table-'+engine+'-'+width+'.png'});
   await page.locator('#answer .answer-sources>summary').focus();await page.keyboard.press('Enter');
   assert.equal(await page.locator('#answer .answer-sources a').count(),4);
   await page.locator('#answer .review-details>summary').click();assert.match(await page.locator('#answer .answer-sources').innerText(),/egenkontroll/i);
   // Profile mutation must not add advice to the neutral BSU explanation.
   const other=await page.evaluate(()=>{
    const a=window.SpareCards.build('q-bsu-basics',{age:70,years:1,debt:'yes',buffer:'no'});
    return {intro:a.intro,note:a.note,options:a.options,steps:a.steps};
   });
   assert.equal(other.note,'');assert.deepEqual(other.options,[]);assert.deepEqual(other.steps,[]);assert.ok(before.includes(other.intro));
   assert.deepEqual(errors,[]);await context.close();
  }
  console.log('BSU '+engine+': 320/390/1280 px, keyboard, focus, sources, profile independence and screenshots passed.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
