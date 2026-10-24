// Nettlesertest av to nye søkesituasjoner i «Spør om sparing»: skrivefeil med kjente stammer og negasjon.
// Kjøres i Chromium, Firefox og WebKit (SPARE_ENGINE). WebKit er ikke det samme som Safari på iPhone.
// Sjekker visning, trykkflater, vannrett scrolling og at ingenting sendes ut av siden. Rangeringen dekkes av Node-testene.
const {chromium,firefox,webkit}=require('playwright'),assert=require('node:assert/strict');
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
  for(const [label,viewport,touch] of [['320 px',{width:320,height:640},true],['390 px',{width:390,height:844},true],['1280 px',{width:1280,height:800},false]]){
   const context=await browser.newContext({viewport,hasTouch:touch,...(touch&&engine!=='firefox'?{isMobile:true}:{})});
   const page=await context.newPage(),errors=[],external=[];
   page.setDefaultTimeout(10000);
   page.on('pageerror',e=>errors.push(e.message));
   page.on('request',r=>{if(!r.url().startsWith(origin))external.push(r.url());});
   await page.goto(origin+'/spor.html');
   const ask=async value=>{if(!await page.evaluate(()=>document.getElementById('searchBox').open))await page.locator('#searchBox>summary').click();await page.locator('#question').fill(value);await page.locator('#questionForm button').click();};
   const status=()=>page.locator('#matchStatus').innerText();
   const answerOpen=()=>page.evaluate(()=>{const p=document.getElementById('answerPanel');return !!p&&!p.hidden&&p.offsetParent!==null;});
   const noOverflow=async what=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),engine+' '+label+': vannrett scrolling etter '+what);
   const tapTargets=async what=>{for(const b of await page.locator('#matches button').all())if(await b.isVisible())assert.ok((await b.boundingBox()).height>=44,engine+' '+label+': trykkflate under 44 px ('+what+')');};

   // 1. Skrivefeil som inneholder kjente stammer: «Mente du», ikke et svar og ikke fond.
   for(const [typo,expect] of [['fondskotno',/ASK/],['aksjesparekonot',/ASK/],['fondkonto',/ASK/]]){
    await ask(typo);
    assert.ok(!await answerOpen(),engine+' '+label+': «'+typo+'» skal ikke åpne et svar');
    assert.match(await status(),/Mente du «(aksje|fonds?)(spare)?konto»\? Velg et svar nedenfor\./);
    assert.equal(await page.locator('#matches .match-why').count(),0,'felles rettelse gjentas ikke');
    assert.match(await page.locator('#matches .match-list button').first().innerText(),expect);
    await tapTargets(typo);await noOverflow(typo);
   }

   // Samme rettelse for to BSU-temaer vises én gang, også med flere ord i søket.
   for(const query of ['Boligparing','Boligparing ungdom']){
    await ask(query);
    assert.equal(await status(),'Mente du «boligsparing»? Velg et svar nedenfor.');
    assert.equal(await page.locator('#matches .match-list button').count(),2);
    assert.equal(await page.locator('#matches .match-why').count(),0);
    assert.ok(!await answerOpen());
    await tapTargets(query);await noOverflow(query);
   }

   // 2. Negasjon: ingenting åpnes, brukeren får vite at nektingen er lagt merke til, og nærmeste temaer er merket som det.
   await ask('Jeg vil ikke ha fond');
   assert.ok(!await answerOpen(),engine+' '+label+': negasjon åpner ikke fondssvaret');
   const text=await status();
   assert.match(text,/nekting/i);assert.match(text,/ikke svar på spørsmålet/i);
   assert.ok(await page.locator('#matches .match-list button').count()>=1,engine+' '+label+': nærmeste temaer vises');
   assert.ok(await page.locator('#matches .match-list button.match-suggest').count()>=1,'nærmeste temaer har forslagsstil');
   await tapTargets('negasjon');await noOverflow('negasjon');

   // 3. Et vanlig søk virker fortsatt etterpå.
   await ask('boliglån');
   assert.ok(await answerOpen(),engine+' '+label+': vanlig søk åpner svar etter negasjon');

   assert.deepEqual(errors,[],'ingen sidefeil');
   assert.deepEqual(external,[],'ingen eksterne forespørsler');
   await context.close();
  }
  console.log(engine+': veileder-sok-rettinger-browser ok');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
