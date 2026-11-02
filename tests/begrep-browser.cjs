// Forklaring der ordet står (prøveversjon 2.11.2026).
// Kontrollerer: ordet blir en knapp, boksen åpner og lukker med fokus tilbake, Esc lukker,
// ingenting under ordet flytter seg, boksen holder seg innenfor skjermen på mobil og PC,
// og «Les mer» vises bare når svaret er publisert og åpner riktig svar.
const engine=process.env.SPARE_ENGINE||'chromium',pw=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}try{const d=fs.readFileSync(f);res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(d);}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port+'/';
 let browser;
 try{
  browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']}:{}),...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  for(const [width,height] of [[320,640],[390,844],[1280,800]]){
   const page=await browser.newPage({viewport:{width,height},isMobile:engine==='chromium'&&width<1000,hasTouch:width<1000});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'index.html');
   // Statisk markering i metodepanelet er oppgradert, selv om panelet er lukket.
   assert.equal(await page.locator('button.begrep[data-begrep="dagens-kroner"]').count(),1);
   assert.equal(await page.locator('span[data-begrep]').count(),0);
   // Generert tekst oppgraderes også. Legg inn et testavsnitt øverst i hovedinnholdet.
   await page.evaluate(()=>{const p=document.createElement('p');p.id='testAvsnitt';p.innerHTML='Saldo og <span data-begrep="kjopekraft">kjøpekraft</span> er ulike ting.';const n=document.createElement('p');n.id='etter';n.textContent='Neste avsnitt';document.querySelector('main').prepend(p,n);});
   const ord=page.locator('#testAvsnitt button.begrep');await ord.waitFor();
   assert.equal(await ord.innerText(),'kjøpekraft');assert.equal(await ord.getAttribute('aria-expanded'),'false');
   const før=await page.locator('#etter').boundingBox();
   await ord.click();
   const boks=page.locator('#begrepBoks');
   assert.equal(await boks.evaluate(b=>b.matches(':popover-open')),true);
   assert.equal(await ord.getAttribute('aria-expanded'),'true');
   assert.equal(await page.evaluate(()=>document.getElementById('begrepBoks').contains(document.activeElement)),true,'fokus i boksen');
   assert.equal(await boks.getAttribute('role'),'dialog');
   assert.match(await boks.locator('.begrep-tekst').innerText(),/hvor mye du kan kjøpe/);
   assert.equal(await boks.locator('a[href^="spor.html"]').count(),0,'ingen «Les mer» til upublisert svar');
   assert.ok(await boks.locator('.begrep-kilde a[href*="ssb.no"]').count());
   const etter=await page.locator('#etter').boundingBox();assert.deepEqual(etter,før,'ingen layoutskift');
   const r=await boks.boundingBox();assert.ok(r.x>=0&&r.y>=0&&r.x+r.width<=width+0.5&&r.y+r.height<=height+0.5,'innenfor skjermen '+width);
   if(width<=640)assert.ok(height-(r.y+r.height)<=14,'nederst på mobil');
   const lukk=await boks.locator('.begrep-lukk').boundingBox();assert.ok(lukk.height>=44,'Lukk minst 44 px');
   await page.keyboard.press('Escape');
   assert.equal(await boks.evaluate(b=>b.matches(':popover-open')),false);
   assert.equal(await ord.getAttribute('aria-expanded'),'false');
   assert.equal(await page.evaluate(()=>document.activeElement?.dataset?.begrep),'kjopekraft','fokus tilbake til ordet');
   // Tastatur: Enter åpner, Lukk-knappen lukker.
   await ord.focus();await page.keyboard.press('Enter');assert.equal(await boks.evaluate(b=>b.matches(':popover-open')),true);
   await boks.locator('.begrep-lukk').click();assert.equal(await boks.evaluate(b=>b.matches(':popover-open')),false);
   assert.deepEqual(errors,[]);
   await page.close();
  }
  {// Inne i svaret om kjøpekraft blir «kjøpekraft» vanlig tekst, mens andre ord fortsatt forklares.
   const page=await browser.newPage();await page.goto(base+'index.html');
   await page.evaluate(()=>{const a=document.createElement('article');a.dataset.svar='q-kjopekraft';a.innerHTML='<p><span data-begrep="kjopekraft">Kjøpekraft</span> og <span data-begrep="renters-rente">renters rente</span>.</p>';document.querySelector('main').prepend(a);});
   await page.locator('[data-svar] button.begrep').first().waitFor();
   assert.equal(await page.locator('[data-svar] button.begrep').count(),1);
   assert.equal(await page.locator('[data-svar] button.begrep').getAttribute('data-begrep'),'renters-rente');
   assert.match(await page.locator('[data-svar]').innerText(),/^Kjøpekraft og/);
   await page.close();}
  // «Les mer» når svaret er publisert: simuler at kjøpekraft-svaret er med på listen.
  const ctx=await browser.newContext({viewport:{width:390,height:844}});
  await ctx.route('**/publiserte-svar.js*',r=>r.fulfill({contentType:'text/javascript',body:"window.SparePubliserteSvar=['q-bsu-basics','q-aksjesparekonto','q-fondskonto','q-kjopekraft'];"}));
  const page=await ctx.newPage();await page.goto(base+'index.html');
  await page.evaluate(()=>{const p=document.createElement('p');p.innerHTML='<span data-begrep="kjopekraft">kjøpekraft</span>';document.querySelector('main').prepend(p);});
  await page.locator('button.begrep[data-begrep="kjopekraft"]').first().evaluate(b=>b.click());
  // Begrep uten lenket svar får aldri «Les mer».
  const les=page.locator('#begrepBoks a[href="spor.html#svar=q-kjopekraft"]');assert.equal(await les.count(),1);
  assert.match(await les.innerText(),/Les mer om kjøpekraft/);
  await page.goto(base+'spor.html#svar=q-kjopekraft');
  await page.locator('#answerTitle').waitFor();assert.match(await page.locator('#answerTitle').innerText(),/kjøpekraft/i);
  // Upublisert svar via lenke åpnes ikke.
  await page.goto('about:blank');await page.goto(base+'spor.html#svar=q-renters-rente');await page.waitForTimeout(200);
  assert.equal(await page.locator('#answerPanel').isHidden(),true);
  await ctx.close();
  console.log(engine+': begrepsforklaring 320/390/1280 px, fokus, Esc, ingen layoutskift, «Les mer» bare for publiserte svar.');
 }finally{await browser?.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
