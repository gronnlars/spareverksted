// Theme controls: layout, contrast, storage, keyboard, charts, privacy and print.
const pickTheme=async(pg,t)=>{const b=pg.locator('[data-color-theme='+t+']');if(!await b.isVisible())await pg.locator('.theme-toggle').click();await b.click();};
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const contrast=(a,b)=>{const lum=c=>{const v=c.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;});return .2126*v[0]+.7152*v[1]+.0722*v[2];};const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),errors=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith(origin))external.push(r.url());});
  await page.goto(origin+'/index.html');
  assert.equal(await page.locator('[data-color-theme][aria-pressed=true]').getAttribute('data-color-theme'),'neutral');
  const themes=['neutral','light','night'];
  const overflow=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal scrolling');
  const checkContrast=async(selector,minimum=4.5)=>{const colors=await page.locator(selector).first().evaluate(el=>{const s=getComputedStyle(el);let node=el,bg='rgba(0, 0, 0, 0)';while(node){bg=getComputedStyle(node).backgroundColor;if(bg!=='rgba(0, 0, 0, 0)')break;node=node.parentElement;}return [s.color,bg];});assert(contrast(...colors)>=minimum,selector+' contrast: '+colors.join(' / '));};
  for(const width of [320,375,390,768,1280]){
   await page.setViewportSize({width,height:900});
   for(const theme of themes){
    if(!await page.locator('#themeOptions').isVisible())await page.locator('.theme-toggle').click();await page.getByRole('button',{name:theme==='neutral'?'Nøytral':theme==='light'?'Lys':'Natt',exact:true}).click();
    assert.equal(await page.locator('html').getAttribute('data-theme'),theme);await overflow();
    await page.locator('.theme-toggle').click();
    await checkContrast('.brand');await checkContrast('.theme-picker [aria-pressed=true]',3);await checkContrast('.theme-picker [aria-pressed=false]',3);
    const boxes=await page.locator('.theme-picker button:visible').evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return {w:r.width,h:r.height};}));assert(boxes.every(b=>b.w>=24&&b.h>=44));
    await page.keyboard.press('Escape');assert.equal(await page.locator('#themeOptions').isHidden(),true,'Esc lukker temavalget');assert.equal(await page.evaluate(()=>document.activeElement.className),'theme-toggle','Fokus tilbake på temaknappen');
    await page.locator('.theme-toggle').click();for(let i=0;i<4;i++)await page.keyboard.press('Tab');assert.equal(await page.locator('#themeOptions').isHidden(),true,'Tab ut av pillen lukker den');
    const a=await page.locator('.brand-tools').boundingBox(),b=await page.locator('.site-header>.site-nav').boundingBox();if(b&&b.y<a.y+a.height-1)assert(a.x+a.width<=b.x+1,'Header controls do not overlap');
   }
  }
  // iPhone (WebKit) gir ikke knapper fokus ved trykk, og fokus forsvinner etter pointerup, rett før click. Pillen må holde seg åpen til trykket når fram (Lars 2.11.2026, to runder).
  await page.locator('.theme-toggle').click();
  assert.equal(await page.evaluate(()=>{const b=document.querySelector('[data-color-theme=night]');b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'touch'}));b.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerType:'touch'}));return new Promise(done=>setTimeout(()=>{document.activeElement.blur();const open=!document.getElementById('themeOptions').hidden;b.click();done(open&&document.documentElement.dataset.theme==='night');},30));}),true,'Trykk uten fokus velger tema');
  // iPhone gir fokus til nærmeste forelder med tabindex når en knapp trykkes. Toppfeltet fikk tabindex i #169, og da lukket pillen seg før trykket nådde fram (Lars 3.11.2026).
  assert.equal(await page.locator('.site-header').getAttribute('tabindex'),null,'Toppfeltet skal ikke kunne få fokus ved trykk');
  await pickTheme(page,'neutral');
  assert.equal(await page.evaluate(()=>{const h=document.querySelector('.site-header');h.tabIndex=-1;document.querySelector('.theme-toggle').click();return new Promise(done=>setTimeout(()=>{h.focus();const open=!document.getElementById('themeOptions').hidden;document.querySelector('[data-color-theme=light]').click();h.removeAttribute('tabindex');done(open&&document.documentElement.dataset.theme==='light');},30));}),true,'Fokus til en forelder lukker ikke pillen');
  await pickTheme(page,'neutral');
  await page.locator('.theme-toggle').focus();await page.keyboard.press('Enter');await page.locator('[data-color-theme=light]').focus();await page.keyboard.press('Space');assert.equal(await page.locator('#themeOptions').isHidden(),true,'Valget lukker');assert.match(await page.locator('.theme-toggle').getAttribute('aria-label'),/Lys/);assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
  await pickTheme(page,'night');await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'night');
  await page.locator('#chooseGrowth').click();await page.locator('#beginJourney').click();
  const before=await page.locator('#total').textContent();
  for(const theme of themes){await pickTheme(page,theme);await page.waitForTimeout(180);assert.equal(await page.locator('#total').textContent(),before,'Theme never changes calculation');await checkContrast('#total');await checkContrast('#secondary');await checkContrast('#monthly');await checkContrast('.panel h2');await checkContrast('.chart-readout');await checkContrast('.chartpanel svg text',3);}
  const line=page.locator('#chart svg path[stroke="#24684f"]');assert.equal(await line.first().evaluate(e=>getComputedStyle(e).stroke),'rgb(155, 220, 181)');
  await page.setViewportSize({width:390,height:844});await page.locator('#monthly').focus();await page.locator('#mobileResultButton').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'savingsResult');
  await page.goto(origin+'/spor.html');assert.equal(await page.locator('html').getAttribute('data-theme'),'night');await checkContrast('.question-panel h2');await checkContrast('#question');await overflow();
  await page.locator('#topicPicker>summary').click();await page.locator('[data-topic=q-bsu-basics]').click();await checkContrast('.answer-lead');await checkContrast('.option-card');
  const other=await context.newPage();await other.goto(origin+'/index.html');await pickTheme(other,'light');assert.equal(await page.locator('html').getAttribute('data-theme'),'night','valget gjelder bare i egen fane');assert.equal(await other.evaluate(()=>localStorage.getItem('sv-color-theme')),null,'tema skal ikke i permanent lagring');await other.close();
  await pickTheme(page,'night');await page.emulateMedia({media:'print'});assert.equal(await page.locator('.theme-picker').isVisible(),false);assert.equal(await page.evaluate(()=>getComputedStyle(document.body).backgroundColor),'rgb(255, 255, 255)');await page.emulateMedia({media:'screen'});
  await page.evaluate(()=>sessionStorage.setItem('sv-color-theme','invalid'));await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'neutral');
  const blocked=await browser.newContext();await blocked.addInitScript(()=>{Storage.prototype.getItem=Storage.prototype.setItem=function(){throw Error('Storage blocked');};});const q=await blocked.newPage();await q.goto(origin+'/index.html');await pickTheme(q,'night');assert.equal(await q.locator('html').getAttribute('data-theme'),'night');await blocked.close();
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log('Passed: three themes, 320–1280 px, contrast, keyboard, chart, result, persistence, cross-tab, blocked storage, print, no external requests.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
