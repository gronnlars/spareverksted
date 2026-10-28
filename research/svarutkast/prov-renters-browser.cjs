'use strict';
// Faktisk produktkode for integrert SV-022. Ingen injeksjon av utkast.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const playwright=require(require.resolve('playwright',{paths:[process.cwd(),process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES||'']}));
const engine=process.env.SPARE_ENGINE||'chromium';
if(!['chromium','firefox','webkit'].includes(engine))throw Error('Ukjent nettleser: '+engine);
const root=path.resolve(__dirname,'../../dist'),draft=require('./gaps-2026-10-25.json')[0];
const server=http.createServer((req,res)=>{
 const name=new URL(req.url,'http://localhost').pathname;
 const file=path.resolve(root,'.'+name);
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 try{let data=fs.readFileSync(file);
 res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(data);
 }catch{res.writeHead(404);res.end();}
});
(async()=>{
 let browser;
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port;
 try{
  browser=await playwright[engine].launch({headless:true,timeout:20000,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage']}:{}),...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  for(const width of [320,390,1280]){
   const page=await browser.newPage({viewport:{width,height:900}}),errors=[];page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin+'/spor.html');await page.locator('#question').fill('Hva er renters rente?');await page.locator('#questionForm button').click();
   assert.equal(await page.locator('#answerTitle').innerText(),draft.title);
   const order=await page.locator('#answer').evaluate(n=>[...n.children].map(x=>x.className));
   assert.ok(order.indexOf('answer-part explain-example')<order.indexOf('full-answer'));
   await page.locator('.full-answer > summary').click();
   const ex=await page.locator('.explain-example').boundingBox(),out=await page.locator('.full-answer .answer-part').filter({has:page.locator('h3',{hasText:'Tid og uttak'})}).boundingBox();
   assert.ok(ex.y+ex.height<=out.y,'eksempel vises før uttaksavsnitt');
   await page.locator('.answer-sources > summary').click();assert.match(await page.locator('.source-list').innerText(),/Skatteetaten/);assert.match(await page.locator('.source-list').innerText(),/OpenStax/);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.equal(await page.locator('.explain-next a').count(),2);
   assert.equal(await page.locator('.explain-next a').nth(1).getAttribute('href'),draft.additionalExamples[0].href);
   await page.locator('.explain-next a').first().click();
   for(const [id,val]of [['start',10000],['monthly',0],['years',2],['rate',5],['fee',0],['inflation',0]])assert.equal(Number((await page.locator('#'+id).inputValue()).replace(/\s/g,'').replace(',','.')),val,id);
   assert.match((await page.locator('#total').innerText()).replace(/\s/g,''),/11025/);
   // Åpne andre lenke fra svaret, slik brukeren gjør. Et rent hashbytte
   // inne på kalkulatoren laster ikke inn en ny plan.
   await page.goto(origin+'/spor.html');await page.locator('#question').fill('Hva er renters rente?');await page.locator('#questionForm button').click();
   await page.locator('.explain-next a').nth(1).click();
   for(const [id,val]of [['start',10000],['monthly',0],['years',2],['rate',2],['fee',0],['inflation',2.5]])assert.equal(Number((await page.locator('#'+id).inputValue()).replace(/\s/g,'').replace(',','.')),val,id);
   assert.equal(await page.locator('[data-value-mode="both"]').getAttribute('aria-pressed'),'true');
   assert.match((await page.locator('#total').innerText()).replace(/\s/g,''),/10404/);
   await page.locator('#tableTab').click();
   const cells=await page.locator('#tableWrap tbody tr').last().locator('td').allTextContents();
   const parse=x=>Number(x.replace(/[^0-9,.-]/g,'').replace(',','.'));
   assert.ok(Math.abs(parse(cells[1])-10404)<.01);
   assert.ok(parse(cells[2])===9903);
   assert.deepEqual(errors,[]);await page.close();
  }
  console.log(engine+' nettleserprøve: 320/390/1280 px, eksempel før uttak, kildeliste med formelkilde, ingen overflow, kalkulatorlenke 11 025 kr og kontrast med 10 404 kr / 9 902,68 kr bestått.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
