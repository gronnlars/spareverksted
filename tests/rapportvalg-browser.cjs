// Siste avgrensede runde: PC-linje og bunnvalg i rapport. Ingen nye beregninger.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),os=require('node:os');
(async()=>{
 const root=path.resolve(__dirname,'../dist'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'spare-rapportvalg-'));
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const context=await browser.newContext({viewport:{width:1280,height:800},reducedMotion:'reduce'});
  await context.addInitScript(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});
  const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(10000);
  const frames=()=>p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(r)))));
  await p.goto('http://127.0.0.1:'+server.address().port+'/index.html#activePage=calculator');
  for(let i=0;i<2;i++){
   await p.locator('#savingsResult').evaluate(e=>e.scrollIntoView({block:'start'}));await frames();assert(await p.locator('#mobileSummary').isHidden(),'linjen skjult på grønt felt');
   await p.evaluate(()=>window.scrollBy(0,document.getElementById('savingsResult').getBoundingClientRect().bottom+20));await frames();assert(await p.locator('#mobileSummary').isVisible(),'linjen synlig på PC etter grønt felt');
  }
  await p.locator('#mobileSummaryToggle').click();assert(await p.locator('#mobileSummary').evaluate(e=>e.classList.contains('is-collapsed')));
  const closed=await p.locator('#mobileSummary').boundingBox();assert(closed.x<=16&&closed.width<200,'lukket PC-linje er liten og til venstre');
  await p.locator('#mobileSummaryToggle').click();assert(!await p.locator('#mobileSummary').evaluate(e=>e.classList.contains('is-collapsed')));
  for(const [width,height] of [[1280,800],[640,450],[320,180],[256,180]]){
   await p.setViewportSize({width,height});await p.evaluate(()=>window.scrollBy(0,document.getElementById('savingsResult').getBoundingClientRect().bottom+20));await frames();
   if(!await p.locator('#mobileSummary').evaluate(e=>e.classList.contains('is-collapsed')))await p.locator('#mobileSummaryToggle').click();
   const box=await p.locator('#mobileSummary').boundingBox();assert(box.x<=16&&box.width<200&&box.height<=height/3,'PC-knappen er liten og til venstre også ved zoom: '+JSON.stringify(box));
  }
  await p.setViewportSize({width:1280,height:800});await p.locator('#mobileSummaryToggle').click();
  await p.evaluate(()=>{saved=[{name:'Plan A',state:{...s}},{name:'Plan B',state:{...s,monthly:3000}}];selectedPlans=new Set([0,1]);pickedPlans=new Set([0,1]);document.getElementById('savedDetails').open=true;savedRender();});
  for(const route of ['plan','sammenligning','valgte']){
   if(route==='valgte'){await p.locator('#downloadSelected').click();await p.locator('#selectedExportPdf').click();}
   else{await p.locator(route==='plan'?'#heroDownload':'#cmpDownload').click();await p.locator('#exportPdf').click();}
   await frames();assert(await p.locator('.report-tools').isHidden(),'ingen ekstra linje ved toppknappene');
   for(const width of [1280,640,390,320,256]){
    await p.setViewportSize({width,height:600});
    await p.locator('.report-scroll').evaluate(e=>e.scrollTop=e.scrollHeight);await frames();
    assert(await p.locator('.report-tools').isVisible(),route+' viser bunnvalg ved '+width);
    const size=await p.locator('.report-tools').evaluate(e=>{const r=e.getBoundingClientRect(),d=e.closest('dialog');return {h:r.height,left:r.left,right:r.right,scroll:d.scrollWidth-d.clientWidth};});
    assert(size.h<=64&&size.left>=0&&size.right<=width+1&&size.scroll<=1,JSON.stringify({route,width,size}));
    const gap=await p.evaluate(()=>{const d=document.getElementById('reportDialog').getBoundingClientRect(),b=document.querySelector('.report-tools').getBoundingClientRect(),s=document.querySelector('.report-scroll').getBoundingClientRect();return {bottom:d.bottom-b.bottom,overlap:s.bottom-b.top};});assert(gap.bottom<=2&&gap.overlap<=1,'bunnlinjen ligger ved kanten, i egen plass: '+JSON.stringify(gap));
    if(process.env.SPARE_RAPPORTVALG_BILDER&&route==='plan'&&[1280,390,256].includes(width)){fs.mkdirSync(process.env.SPARE_RAPPORTVALG_BILDER,{recursive:true});await p.screenshot({path:path.join(process.env.SPARE_RAPPORTVALG_BILDER,'rapport-'+width+'.png')});}
    if(width<=560){assert.equal(await p.locator('.report-formats summary').evaluate(e=>getComputedStyle(e,'::after').display),'none','ingen ekstra plussmarkør på nedlastingssymbolet');await p.locator('.report-formats summary').click();assert(await p.locator('.report-format-menu').isVisible());await p.keyboard.press('Escape');assert(await p.locator('.report-format-menu').isHidden());assert(await p.locator('#reportDialog').isVisible(),'Escape lukker formatvalget først');}
   }
   // Lite høyde ved kombinasjonen systemskalering og zoom: hele flaten brukes til lesing.
   for(const [width,height] of [[1280,160],[320,180],[256,200],[220,120],[390,300]]){
    await p.setViewportSize({width,height});await p.locator('.report-scroll').evaluate(e=>e.scrollTop=e.scrollHeight);await frames();
    assert(await p.locator('.report-tools').isHidden(),'bunnvalg skjult når leseflaten er kort');
    const a=await p.evaluate(()=>{const d=document.getElementById('reportDialog'),s=document.querySelector('.report-scroll');return {scroll:s.clientHeight,dialog:d.clientHeight,atEnd:s.scrollHeight-s.clientHeight-s.scrollTop,over:s.scrollWidth-s.clientWidth,wide:[...s.querySelectorAll('*')].filter(e=>e.getBoundingClientRect().right>s.getBoundingClientRect().right+1).slice(0,8).map(e=>e.tagName+':'+e.className+':'+e.textContent.slice(0,35))};});
    assert(a.scroll>=a.dialog-1&&a.atEnd<3&&a.over<=1,'rapporten kan leses helt ned: '+JSON.stringify(a));
    assert(await p.locator('#reportDialog').isVisible(),'rapporten er fortsatt åpen');
    if(process.env.SPARE_RAPPORTVALG_BILDER&&route==='plan'){fs.mkdirSync(process.env.SPARE_RAPPORTVALG_BILDER,{recursive:true});await p.screenshot({path:path.join(process.env.SPARE_RAPPORTVALG_BILDER,'kort-'+width+'-'+height+'.png')});}
   }
   await p.setViewportSize({width:256,height:600});await frames();
   await p.locator('[data-report-scroll=top]').click();await frames();assert.equal(await p.locator('.report-scroll').evaluate(e=>e.scrollTop),0);assert.equal(await p.evaluate(()=>document.activeElement.id),'reportTitle');
   assert(await p.locator('.report-tools').isHidden(),'bunnvalg skjult igjen øverst');
   await p.locator('.report-scroll').evaluate(e=>e.scrollTop=600);await frames();await p.locator('[data-report-scroll=bottom]').click();await frames();
   assert(await p.locator('.report-scroll').evaluate(e=>e.scrollHeight-e.clientHeight-e.scrollTop<3),'pil ned når rapportens slutt');
   const printCopy=await p.locator('#printReportContent').innerHTML();assert(!printCopy.includes('report-tools'),'PDF-kopien har ingen bunnvalg');
   await p.locator('.report-formats summary').click();
   if(route==='plan'){
    const [download]=await Promise.all([p.waitForEvent('download'),p.locator('.report-format-menu [data-report-action=downloadReportHtml]').click()]);const file=path.join(temp,'rapport.html');await download.saveAs(file);const html=fs.readFileSync(file,'utf8');assert(!html.includes('class="report-tools"'),'HTML-filen har ingen bunnvalg');
   }else{
    const before=await p.evaluate(()=>window.__printCalls);await p.locator('.report-format-menu [data-report-action=printReport]').click();await p.waitForFunction(n=>window.__printCalls===n+1,before);await p.waitForFunction(()=>document.getElementById('reportDialog').open);assert.equal(await p.locator('#printReportContent').innerHTML(),printCopy,'PDF-handlingen beholder innholdet');
   }
   await p.locator('.report-scroll').evaluate(e=>e.scrollTop=e.scrollHeight);await frames();await p.locator('.report-tools [data-report-action=closeReport]').click();assert(await p.locator('#reportDialog').isHidden());
   await p.setViewportSize({width:1280,height:800});
  }
  await p.setViewportSize({width:256,height:600});await p.evaluate(()=>{s.rate=100;s.years=100;fill();render();});await p.locator('#heroDownload').click();await p.locator('#exportPdf').click();await p.locator('.report-scroll').evaluate(e=>e.scrollTop=e.scrollHeight);await frames();
  assert(await p.evaluate(()=>{const area=document.querySelector('.report-scroll').getBoundingClientRect();return [...document.querySelectorAll('#reportContact,.report-tools .report-contact')].some(e=>{const r=e.getBoundingClientRect();return r.height>0&&r.bottom>area.top&&r.top<document.getElementById('reportDialog').getBoundingClientRect().bottom;});}),'ekstremrapport har synlig kontakt, øverst eller i bunnvalg ved behov');
  assert.equal(await p.locator('.report-tools button:visible,.report-tools summary:visible').count(),0,'ekstremrapport har bare Kontakt Lars i bunnlinjen');
  assert.equal(await p.locator('.report-tools .report-contact').getAttribute('href'),'om.html#kontakt');
  assert.deepEqual(errors,[]);console.log('Rapportvalg: PC-linje, skjul/vis, tre rapportveier, 256–1280 px, fokus, HTML/PDF-handlinger, lukk og ekstremkontakt: OK');
 }finally{if(browser)await browser.close();server.close();fs.rmSync(temp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exit(1);});
