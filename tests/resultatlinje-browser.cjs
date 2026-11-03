// Resultatlinjen nederst på mobil: kan skjules og hentes fram med tastatur, dekker ikke det som har fokus (WCAG 2.4.11),
// og starter skjult ved sterk zoom. Rapporttabellen for sparemål får plass på 390 px uten sidelengs rulling (3.11.2026).
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
 const state=q=>q.evaluate(()=>{const a=document.activeElement,s=document.getElementById('mobileSummary'),ar=a.getBoundingClientRect(),sr=s.getBoundingClientRect(),shown=getComputedStyle(s).display!=='none';
  return {id:a.id,own:s.contains(a),shown,collapsed:s.classList.contains('is-collapsed'),covered:shown&&!s.contains(a)&&ar.bottom>sr.top+1&&ar.top<sr.bottom&&ar.right>sr.left&&ar.left<sr.right};});
 const pastResult=async q=>{await q.evaluate(()=>{const r=document.querySelector('.hero-result');window.scrollBy(0,r.getBoundingClientRect().bottom+20);});await q.waitForTimeout(120);};
 try{
  browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})}:{})});
  // Vanlig mobil (390 px) og omtrent 200 % og 500 % zoom på en PC med 1280 x 900.
  for(const [w,h,autoCollapsed] of [[390,664,false],[640,450,false],[256,180,true]]){
   const c=await browser.newContext({viewport:{width:w,height:h}});const q=await c.newPage();const errors=[];q.on('pageerror',e=>errors.push(e.message));q.setDefaultTimeout(10000);
   await q.goto(origin+'#activePage=calculator');await q.waitForTimeout(400);
   await q.evaluate(()=>document.querySelector('#basic input').focus());await q.waitForTimeout(100);
   assert(!(await state(q)).shown,'ingen linje ved feltene over resultatet');
   await pastResult(q);
   let st=await state(q);assert(st.shown,w+': linjen vises nedenfor resultatet');assert.equal(st.collapsed,autoCollapsed,w+': skjult ved start bare ved sterk zoom');
   if(autoCollapsed){
    // 500 %: sammenlagt linje er en smal stripe nederst (minst 24 px, WCAG 2.5.8), og spareformknappene overlapper ikke.
    const z=await q.evaluate(()=>({h:document.getElementById('mobileSummaryToggle').getBoundingClientRect().height,over:[...document.querySelectorAll('#savingsTypes button')].map(b=>b.scrollWidth-b.clientWidth)}));
    assert(z.h>=24&&z.h<=32,'smal stripe ved 500 %: '+z.h);assert.deepEqual(z.over,[0,0,0],'spareformknappene går ikke oppå hverandre');
   }
   await q.locator('#mobileSummaryToggle').focus();
   const label=()=>q.locator('#mobileSummaryToggle').getAttribute('aria-label');
   await q.keyboard.press('Enter');await q.waitForTimeout(80);
   st=await state(q);assert.equal(st.collapsed,!autoCollapsed);assert.equal(st.id,'mobileSummaryToggle','fokus blir på knappen');
   assert.equal(await label(),autoCollapsed?'Skjul resultatlinjen':'Vis resultatlinjen');
   await q.keyboard.press('Enter');await q.waitForTimeout(80);
   st=await state(q);assert.equal(st.collapsed,autoCollapsed,'kan hentes fram igjen');
   // Brukerens valg gjelder videre i besøket.
   if(!autoCollapsed){await q.keyboard.press('Enter');await q.evaluate(()=>document.querySelector('#basic input').focus());await q.waitForTimeout(80);assert(!(await state(q)).shown,'skjult igjen over resultatet');await pastResult(q);assert((await state(q)).collapsed,'valget huskes');}
   assert.deepEqual(errors,[]);await c.close();
  }
  // Safari-sikkerhetsfeltet hører til selve knappen, så innhold ikke synes under den.
  // Playwright har ikke Safaris bevegelige verktøylinje. Prøv derfor CSS-en med både 0 og 34 px simulert inset.
  for(const inset of [0,34]){
   const c=await browser.newContext({viewport:{width:390,height:664},hasTouch:true});const q=await c.newPage();
   await q.route('**/layout.css*',route=>route.fulfill({contentType:'text/css',body:fs.readFileSync(path.join(root,'layout.css'),'utf8').replaceAll('env(safe-area-inset-bottom)',inset+'px')}));
   await q.goto(origin+'#activePage=calculator');await q.waitForTimeout(400);
   await q.evaluate(()=>document.querySelector('#basic input').focus());
   await pastResult(q);
   if(!(await state(q)).collapsed)await q.locator('#mobileSummaryToggle').tap();
   assert((await state(q)).collapsed,'sikkerhetsfeltet prøves med lukket linje');
   for(const height of [664,760,664]){
    await q.setViewportSize({width:390,height});
    const b=await q.evaluate(()=>{const s=document.getElementById('mobileSummary'),t=document.getElementById('mobileSummaryToggle'),a=s.getBoundingClientRect(),b=t.getBoundingClientRect();return {bottom:a.bottom,buttonBottom:b.bottom,height:a.height,buttonHeight:b.height,padding:getComputedStyle(s).paddingBottom,background:getComputedStyle(t).backgroundColor,hit:document.elementFromPoint(innerWidth/2,innerHeight-2)?.id,overflow:document.documentElement.scrollWidth-innerWidth};});
    assert.equal(b.bottom,height,'linjen følger vindusbunnen');
    assert.equal(b.buttonBottom,height,'knappen fyller også sikkerhetsfeltet');
    assert.equal(b.height,b.buttonHeight,'ingen tom stripe under knappen');
    assert(b.buttonHeight>=44+inset,'mobiltrykkflaten beholdes');
    assert.notEqual(b.background,'rgba(0, 0, 0, 0)','ugjennomsiktig knapp');
    assert.equal(b.hit,'mobileSummaryToggle','nederste del av flaten tilhører knappen');
    assert.equal(b.overflow,0,'ingen sidelengs rulling');
   }
   await c.close();
  }
  // Lavt PC-vindu tilsvarer lite plass ved zoom. Mus får lavere knapp, berøring beholder 44 px.
  for(const hasTouch of [false,true]){
   const c=await browser.newContext({viewport:{width:320,height:320},hasTouch});const q=await c.newPage();
   await q.goto(origin+'#activePage=calculator');await q.waitForTimeout(400);
   await q.evaluate(()=>document.querySelector('#basic input').focus());
   await pastResult(q);
   if(!(await state(q)).collapsed)await q.locator('#mobileSummaryToggle').click();
   const h=await q.locator('#mobileSummaryToggle').evaluate(e=>e.getBoundingClientRect().height);
   assert(hasTouch?h>=44:h>=24&&h<=30,'høyde ved zoom, touch='+hasTouch+': '+h);
   await q.locator('#mobileSummaryToggle').focus();await q.keyboard.press('Space');
   assert(!(await state(q)).collapsed,'åpner med mellomrom');
   await q.keyboard.press('Enter');assert((await state(q)).collapsed,'lukker med Enter');
   await c.close();
  }
  // Begge kalkulatorer: aldri før/på grønt felt, bare etterpå. Gjenta opp/ned etter at linjen har vært vist.
  for(const file of ['index.html#activePage=calculator','laan.html'])for(const [w,h] of [[390,664],[640,450],[256,180]]){
   const q=await browser.newPage({viewport:{width:w,height:h}});await q.goto(origin.replace('index.html',file));await q.waitForTimeout(400);
   if(file==='laan.html'){await q.locator('#rate').fill('5');await q.locator('#rate').press('Tab');}
   const visible=()=>q.locator('#mobileSummary').evaluate(e=>getComputedStyle(e).display!=='none');
   for(let i=0;i<2;i++){
    await q.evaluate(()=>window.scrollTo(0,0));await q.waitForTimeout(120);assert(!await visible(),'skjult øverst: '+file);
    await q.evaluate(()=>document.querySelector('.hero-result').scrollIntoView({block:'start'}));await q.waitForTimeout(120);assert(!await visible(),'skjult på grønt felt: '+file);
    await pastResult(q);assert(await visible(),'synlig etter grønt felt: '+file);
   }
   await q.close();
  }
  // Velkomstsiden: resultatlinjen vises aldri, heller ikke sammenlagt eller ved sterk zoom.
  for(const [w,h] of [[390,664],[256,180]]){const c=await browser.newContext({viewport:{width:w,height:h}});const q=await c.newPage();
   await q.goto(origin);await q.waitForTimeout(400);
   assert.equal(await q.evaluate(()=>document.body.dataset.stage),'welcome');
   await q.evaluate(()=>{const s=document.getElementById('mobileSummary');s.classList.add('is-visible','is-editing');});
   for(const cls of [false,true]){await q.evaluate(c=>document.getElementById('mobileSummary').classList.toggle('is-collapsed',c),cls);
    assert.equal(await q.evaluate(()=>getComputedStyle(document.getElementById('mobileSummary')).display),'none',w+': ikke på velkomstsiden');}
   await c.close();}
  // Rapporttabellen for sparemål på 390 px.
  const c=await browser.newContext({viewport:{width:390,height:800}});const q=await c.newPage();
  await q.goto(origin+'#activePage=dreams&dreamType=car&dreamYears=3');await q.waitForTimeout(400);
  await q.evaluate(()=>{document.getElementById('reportPreview').innerHTML=buildReport();document.getElementById('reportDialog').showModal();});
  const fit=await q.evaluate(()=>{const t=document.querySelector('#reportPreview .report-table');return {sw:t.scrollWidth,cw:t.clientWidth,dialog:document.getElementById('reportDialog').scrollWidth-document.getElementById('reportDialog').clientWidth};});
  assert(fit.sw<=fit.cw,'tabellen får plass på 390 px: '+JSON.stringify(fit));assert.equal(fit.dialog,0);
  assert.equal(await q.locator('#reportPreview td').nth(2).evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=13),true,'samme skriftstørrelse');
  await c.close();
  console.log('resultatlinje (skjul, fokus, zoom) og rapporttabell: OK');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
