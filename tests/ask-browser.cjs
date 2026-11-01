// ASK: actual rendering, keyboard, profiles and screenshots in all CI browsers.
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
   await page.locator('#question').fill('Hva er ASK?');await page.locator('#questionForm button').click();
   await page.locator('.explain-overview').waitFor();
   assert.equal(await page.evaluate(()=>document.activeElement.id),'answerTitle');
   assert.equal(await page.locator('#contextPanel').isHidden(),true);
   assert.equal(await page.locator('#answer .explain-terms').isVisible(),false);
   const before=await page.locator('#answer').textContent();
   for(const kind of ['pro','con']){
    const group=page.locator('.explain-overview .'+kind);
    await group.locator('summary').focus();await page.keyboard.press('Enter');assert.notEqual(await group.getAttribute('open'),null);
    assert.ok(await group.locator('li').count()>=2);
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.locator('#answerPanel').screenshot({path:dir+'/ask-'+engine+'-'+width+'.png'});
   await page.locator('#answer .full-answer summary').focus();await page.keyboard.press('Enter');
   assert.match(await page.locator('#answer .full-answer').innerText(),/ubenyttet skjerming fra tidligere år/);
   await page.locator('#answer .answer-sources>summary').focus();await page.keyboard.press('Enter');
   assert.equal(await page.locator('#answer .answer-sources a').count(),4);
   await page.locator('#answer .review-details>summary').click();assert.match(await page.locator('#answer .answer-sources').innerText(),/egenkontroll/);
   // Profile mutation must not add advice to the neutral ASK explanation.
   const other=await page.evaluate(()=>{
    const a=window.SpareCards.build('q-aksjesparekonto',{age:70,years:1,debt:'yes',buffer:'no'});
    return {intro:a.intro,note:a.note,options:a.options,steps:a.steps};
   });
   assert.equal(other.note,'');assert.deepEqual(other.options,[]);assert.deepEqual(other.steps,[]);assert.ok(before.includes(other.intro));
   assert.equal(await page.locator('#answer .answer-caveat').count(),0);
   assert.match(await page.locator('#answer').innerText(),/17 028 kr/);
   assert.match(await page.locator('#answer .full-answer').innerText(),/Gave og arv/);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.locator('#answerPanel').screenshot({path:dir+'/ask-expanded-'+engine+'-'+width+'.png'});
   fs.writeFileSync(dir+'/ask-rendered-'+engine+'-'+width+'.html',await page.content());
   assert.deepEqual(errors,[]);await context.close();
  }
  console.log('ASK '+engine+': 320/390/1280 px, keyboard, focus, sources, profile independence and screenshots passed.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
