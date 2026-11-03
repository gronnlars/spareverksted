// «Last ned» ved resultatet i alle tre kalkulatorene, ordlyd uten «frarådes», og datostatus fra registeret (Lars 3.11.2026).
// Krever playwright. SPARE_BROWSER kan peke på en Chromium. SPARE_ENGINE=firefox|webkit for andre motorer.
const pw=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const engine=process.env.SPARE_ENGINE||'chromium';
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}try{const d=fs.readFileSync(f);res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(d);}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;
 try{
  browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})}:{})});
  for(const width of [390,1280]){
   const c=await browser.newContext({viewport:{width,height:800}});
   const q=await c.newPage();const errors=[];q.on('pageerror',e=>errors.push(e.message));q.setDefaultTimeout(10000);
   // Datostatus kommer fra registeret, ikke en dato skrevet inn.
   await q.goto(origin+'#activePage=calculator');await q.waitForTimeout(400);
   const periode=await q.evaluate(()=>SpareFacts.expand('{{savingsRate.periode}}'));
   // «Hva er vanlig å ha spart?» har egne, daterte tall og beholder sin dato. Forklaringen og metoden skal ikke ha den gamle.
   const status=await q.evaluate(()=>document.getElementById('helpDialog').textContent+document.querySelector('details.method').textContent);
   assert.doesNotMatch(status,/20\. oktober 2026|oppdateres ikke automatisk/,'gammel datostatus');
   assert.match(await q.locator('#helpDialog [data-datastatus]').textContent(),new RegExp('Nyeste tall: '+periode));
   assert.match(await q.locator('[data-datastatus="metode"]').textContent(),new RegExp(periode));
   // Sparemål og uttak: «Last ned» står synlig ved resultatet og åpner samme valg som panelet.
   for(const [hash,id,save,name] of [['#activePage=dreams&dreamType=other&dreamYears=3','dreamDownload','saveDream','Sparemål'],['#activePage=withdrawals&start=500000&years=10','withdrawDownload','saveWithdraw','Uttaksplan']]){
    await q.goto('about:blank');await q.goto(origin+hash);await q.waitForTimeout(400);
    const btn=q.locator('#'+id);assert(await btn.isVisible(),id+' synlig');
    const box=await btn.boundingBox();assert(box.height>=24&&box.width>=24,id+' trykkflate');
    assert.equal(await btn.evaluate(b=>!!b.closest('details')),false,id+' ligger ikke i et lukket panel');
    await btn.click();assert(await q.locator('#exportDialog').evaluate(d=>d.open),id+' åpner eksportvalget');
    await q.click('#closeExport');
    await q.click('#'+save);assert.equal(await q.locator('#scenarioName').inputValue(),name);await q.click('#cancelSave');
   }
   // Kort tid i sparemål: Forbrukerrådets anbefaling gjengis som deres, og ingenting «frarådes».
   await q.goto('about:blank');await q.goto(origin+'#activePage=dreams&dreamType=car&dreamYears=3&dreamFlexible=0');await q.waitForTimeout(400);
   const min=await q.evaluate(()=>SpareFacts.value('fundMinYears'));
   const cards=await q.locator('#dreamCards').textContent();
   assert.match(cards,new RegExp('Forbrukerrådet anbefaler minst '+min+' års sparehorisont'));
   const report=await q.evaluate(()=>buildReport());
   assert.doesNotMatch(cards+report,/frarå/i);
   assert.match(report,/kan gi underskudd her/);assert.match(report,new RegExp('Nyeste tall: '+periode));
   // Lang tid, fast dato: beskrivelse uten kilde-påstand.
   await q.goto('about:blank');await q.goto(origin+'#activePage=dreams&dreamType=car&dreamYears=8&dreamFlexible=0');await q.waitForTimeout(400);
   const long=await q.locator('#dreamCards').textContent();
   assert.match(long,/Med fast kjøpsdato kan et fall rett før kjøpet gi et underskudd/);
   assert.doesNotMatch(long,/Forbrukerrådet anbefaler/);
   assert.deepEqual(errors,[]);
   await c.close();
  }
  console.log('last ned i resultatet, ordlyd og datostatus: OK');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
