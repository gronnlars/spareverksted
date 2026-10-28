const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const engine=process.env.SPARE_ENGINE||'chromium',browserType=require('playwright')[engine];
const entries=require('../dist/veileder-knowledge.js'),drafts=require('../research/svarutkast/gaps-2026-10-25.json').filter(e=>e.id!=='q-renters-rente');
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
   page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(10000);
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:'+server.address().port+'/spor.html');
   // Drafts are registered only in this isolated test page. They remain absent from the production bundle.
   await page.evaluate(drafts=>{for(const e of drafts)window.SpareVeileder.register({...e,words:e.words.map(x=>new RegExp(x))});},drafts);
   for(const entry of [...entries,...drafts]){
    if(!await page.locator('#searchBox').evaluate(x=>x.open))await page.locator('#searchBox>summary').click();
    await page.locator('#question').fill(entry.questions[0]);await page.locator('#questionForm button').click();
    assert.equal(await page.locator('#answerTitle').innerText(),entry.title);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'answerTitle');
    assert.equal(await page.locator('#contextPanel').isHidden(),true);
    assert.equal(await page.locator('#answer .answer-caveat').count(),entry.caveat?1:0);
    if(entry.kind==='explainer'){assert.equal(await page.locator('#answer .explain-terms').isVisible(),false);assert.equal(await page.locator('#answer .explain-example').evaluate(x=>getComputedStyle(x).borderTopWidth),'0px');}
    for(const summary of await page.locator('#answer .tradeoff>summary').all()){
     await summary.focus();await page.keyboard.press('Enter');assert.equal(await summary.evaluate(x=>x.parentElement.open),true);
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),entry.id+' '+width);
    await page.locator('#answerPanel').screenshot({timeout:10000,path:dir+'/svar-'+entry.id+'-'+engine+'-'+width+'.png'});
    if(entry.parts.length||entry.terms?.length){await page.locator('#answer .full-answer>summary').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#answer .full-answer').evaluate(x=>x.open),true);}else assert.equal(await page.locator('#answer .full-answer').count(),0);
    await page.locator('#answer .answer-sources>summary').focus();await page.keyboard.press('Enter');
    assert.ok(await page.locator('#answer .source-list a').count()>0);
    const review=page.locator('#answer .review-details');assert.equal(await review.evaluate(x=>x.open),false);
    await review.locator('summary').focus();await page.keyboard.press('Enter');assert.equal(await review.evaluate(x=>x.open),true);
    console.log(engine+' '+width+' '+entry.id+' rendered');
    assert.doesNotMatch(await page.locator('#answer').innerText(),/Beregningen er forklart under|undefined|\{\{/);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),entry.id+' expanded '+width);
   }
   assert.deepEqual(errors,[]);await context.close();
  }
  console.log('Svarmal '+engine+': 13 svar ved 320/390/1280 px, forbehold, tastatur, fokus, kilder og skjermbilder består.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
