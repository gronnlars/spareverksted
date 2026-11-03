// Informasjonssidene: kapitler, gamle lenker, utskrift og reflow. Ingen kalkulatorendring.
const {chromium,firefox,webkit}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const engine=process.env.SPARE_ENGINE||'chromium';
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
  try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':'text/html');res.end(fs.readFileSync(file));}
  catch{res.writeHead(404);res.end();}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port;
 let browser;
 const errors=[],external=[];
 try{
  browser=await {chromium,firefox,webkit}[engine].launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})}:{})});
  const files=['om.html','personvern.html','tilgjengelighet.html','ressursbruk.html'];
  const sizes=[[320,568],[390,844],[844,390],[768,1024],[1024,768],[1280,800],[640,400]];
  // All chapters expanded: long text, table, contact and cards must fit every layout and theme.
  for(const theme of ['neutral','light','night']){
   const context=await browser.newContext({reducedMotion:'reduce'});
   await context.addInitScript(t=>sessionStorage.setItem('sv-color-theme',t),theme);
   await context.route('**/*',route=>{if(!route.request().url().startsWith(origin)){external.push(route.request().url());return route.abort();}return route.continue();});
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   for(const file of files){
    await page.goto(origin+'/'+file);
    await page.getByRole('button',{name:'Åpne alle kapitler',exact:true}).click();
    for(const [width,height] of sizes){
     await page.setViewportSize({width,height});
     const findings=await page.evaluate(()=>{
      const out=[],ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
      if(new Set(ids).size!==ids.length)out.push('duplicate IDs');
      if(document.documentElement.scrollWidth>innerWidth+1)out.push('page overflow');
      const visible=e=>e.checkVisibility?e.checkVisibility():e.getBoundingClientRect().height>0;
      for(const el of document.querySelectorAll('main summary,main button,main a')){
       if(!visible(el))continue;
       const r=el.getBoundingClientRect();
       if(r.left<0||r.right>innerWidth+1)out.push('target outside screen: '+el.textContent.trim());
       if(el.matches('.info-chapter>summary')&&r.height<44)out.push('small chapter target');
      }
      return out;
     });
     assert.deepEqual(findings,[],`${file} ${theme} ${width}×${height}`);
     if(engine==='chromium'&&theme==='neutral'&&[390,844,768,1280].includes(width)){
      const dir=process.env.SPARE_INFO_SCREENSHOTS;
      if(dir){fs.mkdirSync(dir,{recursive:true});await page.screenshot({path:path.join(dir,`${file}-${width}x${height}.png`),fullPage:true});}
     }
    }
   }
   await context.close();
  }
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  for(const file of files){
   await page.goto(origin+'/'+file);
   const chapters=page.locator('.info-chapter'),first=chapters.first(),summary=first.locator(':scope > summary');
   assert.equal(await first.getAttribute('open'),null);
   await summary.focus();await page.keyboard.press('Enter');
   assert.notEqual(await first.getAttribute('open'),null,'Enter opens');
   assert(await summary.evaluate(e=>e===document.activeElement),'focus stays on chapter');
   assert(await summary.evaluate(e=>{const s=getComputedStyle(e);return s.outlineStyle!=='none'&&parseFloat(s.outlineWidth)>=2;}),'visible focus');
   await page.keyboard.press('Space');assert.equal(await first.getAttribute('open'),null,'Space closes');
   await page.getByRole('button',{name:'Åpne alle kapitler',exact:true}).click();
   assert.equal(await page.locator('.info-chapter:not([open])').count(),0);
   await page.getByRole('button',{name:'Lukk alle kapitler',exact:true}).click();
   assert.equal(await page.locator('.info-chapter[open]').count(),0);
   // Old heading IDs are deep links too, not just the new section IDs.
   const id=await summary.locator('h2').getAttribute('id');
   await page.goto(origin+'/'+file+'#'+id);
   assert.notEqual(await first.getAttribute('open'),null,'direct heading link opens chapter');
   const printState=await page.locator('main details').evaluateAll(ds=>ds.map(d=>d.open));
   await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
   assert.equal(await page.locator('main details:not([open])').count(),0,'print includes nested logs');
   await page.emulateMedia({media:'print'});
   assert(await page.locator('main').isVisible(),'shared report CSS must not hide info pages on print');
   assert(await first.locator('.info-content').isVisible());
   await page.emulateMedia({media:'screen'});
   await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
   assert.deepEqual(await page.locator('main details').evaluateAll(ds=>ds.map(d=>d.open)),printState,'print restores choices');
   assert.deepEqual(await page.evaluate(()=>[Object.keys(localStorage),Object.keys(sessionStorage)]),[[],[]],'no storage');
   assert.deepEqual(await context.cookies(),[]);
  }
  await page.goto(origin+'/om.html#gi-videre');
  assert.notEqual(await page.locator('#gi-videre > details').getAttribute('open'),null,'old section link');
  await page.locator('#gi-videre a[href="#tid"]').click();
  assert(await page.locator('#tid').isVisible(),'in-page anchor stays visible');
  await page.goto(origin+'/om.html#kontakt');
  assert(await page.getByRole('button',{name:'Vis e-postadresse for generell kontakt',exact:true}).isVisible(),'contact is never folded away');
  await context.close();
  // Native chapter controls work when scripts are disabled.
  const plain=await browser.newContext({javaScriptEnabled:false});const np=await plain.newPage();
  for(const file of files){
   await np.goto(origin+'/'+file);
   assert(await np.locator('#infoToggleAll').isHidden());
   const first=np.locator('.info-chapter').first();
   await first.locator(':scope > summary').click();
   assert(await first.locator('.info-content').isVisible(),'no-JS chapter content');
  }
  await plain.close();
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log(`${engine}: info pages passed: 84 page/theme/viewport combinations, keyboard, anchors, print/restore, no-JS, no storage or external requests.`);
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
