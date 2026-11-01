// Kontaktknapper: adressen står ikke ferdig i siden, vises først ved trykk, kan kopieres ved eget trykk,
// fungerer med tastatur uten at fokus flyttes, lagrer ingenting og sender ingenting.
// Dette er ikke noe bevis for at adressene er beskyttet mot avanserte boter.
const {chromium,firefox,webkit}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const K=require('../dist/kontakt.js');
const AT=String.fromCharCode(64);
(async()=>{
 const engine=process.env.SPARE_ENGINE||'chromium',browserType={chromium,firefox,webkit}[engine];
 assert(browserType,'Unknown test browser');
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 let browser;const errors=[];
 const cases=[['/personvern.html','personvern','Vis e-postadresse for personvern','Kopier e-postadresse for personvern'],['/om.html','generell','Vis e-postadresse for generell kontakt','Kopier e-postadresse for generell kontakt']];
 try{
  browser=await browserType.launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})}:{})});
  for(const [url,kind,showName,copyName] of cases){
   const address=K.address(kind);assert(address.includes(AT)&&address.endsWith('spareverksted.no'));
   const context=await browser.newContext({viewport:{width:320,height:700}});
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   const requests=[];page.on('request',r=>requests.push(r.url()));
   await page.addInitScript(()=>{window.__copied=[];const stub={writeText:v=>{window.__copied.push(v);return Promise.resolve();}};try{Object.defineProperty(navigator,'clipboard',{value:stub,configurable:true});}catch{}});
   await page.goto(origin+url);
   // 1. Før trykk: ingen komplett adresse i DOM, attributter eller kilde.
   const before=await page.evaluate(()=>document.documentElement.outerHTML);
   assert(!before.includes(AT+'spareverksted'),'ingen adresse i DOM før trykk');
   assert(!/mailto:/i.test(before.replace(/'mailto:'/g,'')),'ingen mailto før trykk');
   assert(!before.includes(address),'ingen komplett adresse før trykk');
   const show=page.getByRole('button',{name:showName,exact:true});
   assert(await show.isVisible());assert.equal(await show.getAttribute('aria-expanded'),'false');
   const box=await show.boundingBox();assert(box.height>=44,'trykkflate minst 44 px');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'ingen horisontal rulling ved 320 px');
   // 2. Tastatur: Enter viser adressen, fokus blir på knappen.
   await show.focus();await page.keyboard.press('Enter');
   assert.equal(await show.getAttribute('aria-expanded'),'true');
   const link=page.locator('[data-kontakt="'+kind+'"] .kontakt-lenke');
   assert.equal((await link.innerText()).trim(),address);assert.equal(await link.getAttribute('href'),'mailto:'+address);
   assert.equal(await page.evaluate(()=>document.activeElement.className),'kontakt-vis','fokus flyttes ikke');
   assert.equal(await page.evaluate(()=>window.__copied.length),0,'ingenting kopieres ved visning');
   // 3. Kopiering bare ved eget trykk.
   await page.getByRole('button',{name:copyName,exact:true}).click();
   assert.deepEqual(await page.evaluate(()=>window.__copied),[address]);
   assert.match(await page.locator('[data-kontakt="'+kind+'"] .kontakt-status').innerText(),/kopiert/);
   // 4. Blokkert utklippstavle: forståelig tilbakemelding, adressen markeres, fokus står der det stod.
   await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('blocked'))},configurable:true});});
   await page.getByRole('button',{name:copyName,exact:true}).click();
   await page.locator('[data-kontakt="'+kind+'"] .kontakt-status').filter({hasText:'Kunne ikke kopiere'}).waitFor();
   assert.equal(await page.evaluate(()=>getSelection().toString()),address,'adressen er markert');
   assert.equal(await page.evaluate(()=>document.activeElement.className),'kontakt-kopier');
   // 5. Skjul igjen fjerner adressen fra siden.
   await show.click();assert.equal(await show.getAttribute('aria-expanded'),'false');
   assert(!(await page.evaluate(()=>document.documentElement.outerHTML)).includes(address));
   // 6. Ingenting lagret og ingen forespørsler etter trykk.
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage).concat(Object.keys(sessionStorage)).filter(k=>k.startsWith('sv-'))),[]);
   assert(requests.every(u=>u.startsWith(origin)),'ingen forespørsler til andre domener');
   assert.deepEqual(await context.cookies(),[]);
   await context.close();
   // 7. Uten JavaScript: knappen er skjult og en forklaring står der. Ingen komplett adresse.
   const plain=await browser.newContext({javaScriptEnabled:false});const np=await plain.newPage();await np.goto(origin+url);
   assert(await np.locator('[data-kontakt="'+kind+'"] .kontakt-vis').isHidden());
   const text=await np.locator('[data-kontakt="'+kind+'"] noscript').first().evaluate(el=>el.textContent);
   assert.match(text,/sette adressen sammen selv/);assert(!text.includes(address)&&!text.includes(AT+'spareverksted'));
   assert(!(await np.content()).includes(address));
   await plain.close();
  }
  assert.deepEqual(errors,[]);
  console.log(engine+': kontaktknapper passed: no full address before click, keyboard reveal keeps focus, copy only on own click, blocked clipboard fallback, hide, no storage, no external requests, no-JS explanation.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
