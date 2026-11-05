// Avgrenset kontroll av Lars sine testfunn etter #222. Kjøres lokalt ved denne endringen.
const pw=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),os=require('node:os');
const engine=process.env.SPARE_ENGINE||'chromium';
(async()=>{
 const root=path.resolve(process.env.SPARE_ROOT||path.join(__dirname,'../dist'));
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'spare-testfunn-'));
 try{
  browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage']}: {})});
  const p=await browser.newPage({viewport:{width:1280,height:800},reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(10000);
  await p.goto('http://127.0.0.1:'+server.address().port+'/index.html#activePage=calculator');
  const frames=()=>p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(r)))));
  await p.evaluate(()=>{Object.assign(s,{start:50000,monthly:2000,years:10,rate:5,fee:.2,inflation:2.5,growth:0,extra:0,crash:0,real:false});fill();render();setLevel('advanced',{remember:false});document.querySelectorAll('#planInputs details').forEach(d=>d.open=true);});
  assert(await p.locator('.input-bottom-result').isVisible(),'Se resultat ved bunnen av PC-skjemaet');
  await p.locator('.input-bottom-result').click();assert.equal(await p.evaluate(()=>document.activeElement.id),'savingsResult');
  assert.equal(await p.locator('#total').innerText(),'385 265 kr');
  await p.locator('#showRange').check();await p.locator('#tableTab').click();await p.setViewportSize({width:390,height:844});await frames();
  assert(await p.locator('#tableLast').isVisible(),'snarvei ved lang tabell');
  assert.match(await p.locator('#tableWrap thead').innerText(),/Innskudd totalt/);
  const values=await p.locator('#tableWrap .savings-cell-value').allTextContents();
  assert.equal(await p.locator('#tableWrap tbody th').first().evaluate(e=>getComputedStyle(e).position),'static','årstallet følger raden');
  await p.locator('#tableLast').click();assert(await p.locator('#tableWrap tbody tr').last().evaluate(e=>e===document.activeElement));
  assert((await p.locator('#tableWrap tbody tr').last().boundingBox()).y>=0,'siste års start er synlig');
  await p.locator('#tableFirst').click();assert(await p.locator('#tableWrap tbody tr').first().evaluate(e=>e===document.activeElement));
  await p.locator('#tableWrap tbody tr').nth(4).scrollIntoViewIfNeeded();await frames();
  assert.equal(await p.locator('#mobileResultButton').innerText(),'Til siste år ↓');
  for(const width of [640,390,320,256]){
   await p.setViewportSize({width,height:844});await p.locator('#tableWrap tbody tr').nth(4).scrollIntoViewIfNeeded();await frames();
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'ingen siderulling med tabellhopp ved '+width);
  }
  await p.setViewportSize({width:390,height:844});await p.locator('#tableWrap tbody tr').nth(4).scrollIntoViewIfNeeded();await frames();
  assert.equal(await p.locator('#mobileResultButton').innerText(),'Til siste år ↓');
  await p.locator('#mobileResultButton').click();assert(await p.locator('#tableWrap tbody tr').last().evaluate(e=>e===document.activeElement));
  assert.deepEqual(await p.locator('#tableWrap .savings-cell-value').allTextContents(),values,'navigering endrer ingen verdier');
  // Lukk resultatlinjen: begge retninger virker uten å åpne den igjen, også på PC.
  for(const width of [1280,853,390,256]){
   await p.setViewportSize({width,height:width===256?200:600});await p.locator('#tableWrap tbody tr').nth(4).scrollIntoViewIfNeeded();await frames();
   if(await p.locator('#mobileSummaryToggle').isVisible()&&!await p.locator('#mobileSummary').evaluate(e=>e.classList.contains('is-collapsed')))await p.locator('#mobileSummaryToggle').click();await frames();
   assert(await p.locator('.table-shortcuts').isVisible(),'pilene er synlige ved '+width);
   assert(await p.locator('#mobileSummaryToggle').isHidden(),'bare pilene vises i tabellområdet på PC');
   assert((await p.locator('.table-shortcuts').boundingBox()).height<=48,'snarveiene holder én lav rad');
   const overlap=await p.evaluate(()=>{const a=document.querySelector('.table-shortcuts').getBoundingClientRect(),e=document.getElementById('mobileSummaryToggle'),b=e.getBoundingClientRect();return getComputedStyle(e).visibility!=='hidden'&&b.width>0&&a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;});assert.equal(overlap,false,'pilene dekker ikke åpneknappen');
   await p.locator('.table-shortcuts button').last().click();assert(await p.locator('#tableWrap tbody tr').last().evaluate(e=>e===document.activeElement));
   await p.locator('.table-shortcuts button').first().click();assert.equal(await p.evaluate(()=>document.activeElement.id),'savingsResult');
  }
  await p.evaluate(()=>{s.start=9999999999;render();});
  assert.match(await p.locator('#mobileTotal [aria-hidden]').textContent(),/mrd\./);assert.match(await p.locator('#mobileTotal .sr-only').textContent(),/milliarder/);
  await p.evaluate(()=>{s.start=50000;render();});await p.setViewportSize({width:390,height:844});await frames();
  await p.locator('#heroDownload').click();await p.locator('#exportPdf').click();await frames();
  assert(await p.locator('#reportPreview .report-table').isVisible(),'sparetabell i rapporten');
  assert.equal(await p.locator('#printReportContent tbody tr').count(),11,'år 0–10 i PDF-kopien');
  if(process.env.SPARE_TESTFUNN_SCREENSHOTS){fs.mkdirSync(process.env.SPARE_TESTFUNN_SCREENSHOTS,{recursive:true});await p.screenshot({path:path.join(process.env.SPARE_TESTFUNN_SCREENSHOTS,'rapport.png')});}
  const reportValues=await p.locator('#printReportContent tbody td').allTextContents();assert.deepEqual(reportValues,values);
  const [download]=await Promise.all([p.waitForEvent('download'),p.locator('#downloadReportHtml').click()]);
  const file=path.join(temp,'spareplan.html');await download.saveAs(file);
  const offline=await browser.newContext({javaScriptEnabled:false});const h=await offline.newPage();await h.goto('file://'+file);
  assert.equal(await h.locator('tbody tr').count(),11);assert.match(await h.locator('thead').innerText(),/Innskudd totalt/);await offline.close();
  await p.locator('#closeReport').click();
  // Fire planer i både sammenligningsrapport og vanlig planrapport, som i Lars sine bilder.
  await p.evaluate(()=>{Object.assign(s,{start:533000,monthly:10100,years:36,rate:11.2,fee:.2,inflation:2.5,real:true});saved=[0,1,2].map(i=>({name:'Spareplan'+(i?' ('+(i+1)+')':''),state:{...s}}));selectedPlans=new Set([0,1,2]);cmpCurrent=true;document.getElementById('savedDetails').open=true;fill();render();savedRender();});
  for(const route of ['comparison','plan']){
   await p.locator(route==='comparison'?'#cmpDownload':'#heroDownload').click();await p.locator('#exportPdf').click();await frames();
   assert.doesNotMatch(await p.locator('#reportPreview').innerText(),/Trykk på en søyle/,'statisk rapport har ingen klikk-instruks');
   assert.equal(await p.locator('#reportPreview .cmp-key').count(),0,'planforklaringen er statisk tekst');
   for(const width of [1280,640,390,320,256]){
    await p.setViewportSize({width,height:844});await frames();
    const lines=await p.locator('#reportPreview .savings-cell-value').evaluateAll(es=>es.flatMap(e=>{const out=[],texts=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);while(texts.nextNode()){const n=texts.currentNode;if(!/\d[ \u00a0]\d{3}/.test(n.textContent))continue;const r=document.createRange();r.selectNodeContents(n);out.push({text:n.textContent,lines:r.getClientRects().length});}return out;}));
    assert(lines.length>0&&lines.every(x=>x.lines===1),route+', '+width+': '+JSON.stringify(lines));
    const sizes=await p.locator('#reportPreview').evaluate(e=>[e,...e.querySelectorAll('.table-scroll,.report-table')].map(e=>[e.clientWidth,e.scrollWidth]));
    assert(sizes.every(([outer,inner])=>inner<=outer+1),route+', '+width+': '+JSON.stringify(sizes));
   }
   if(process.env.SPARE_TESTFUNN_SCREENSHOTS)await p.screenshot({path:path.join(process.env.SPARE_TESTFUNN_SCREENSHOTS,route+'-fire-planer.png')});
   await p.locator('#closeReport').click();
  }
  await p.evaluate(()=>{selectedPlans=new Set();saved=[];savedRender();});
  // Aksen får plass også med lange etiketter, lineært og logaritmisk.
  await p.evaluate(()=>{Object.assign(s,{start:9999999999,monthly:9999999,years:100,rate:15,fee:0,inflation:0});fill();render();document.getElementById('graphTab').click();});
  for(const width of [1280,640,390,256])for(const log of [false,true]){
   await p.setViewportSize({width,height:844});await p.evaluate(log=>{s.log=log;render();},log);await frames();
   const labels=await p.locator('#chart svg text[text-anchor=end]').evaluateAll(es=>es.map(e=>({text:e.textContent,x:e.getBBox().x})));
   assert(labels.every(e=>e.x>=-1),JSON.stringify({width,log,labels}));
  }
  await p.evaluate(()=>{s.bank=100;view.showBank=false;view.showRange=false;render();});
  assert.equal(await p.evaluate(()=>savingsOverLimit()),false,'skjult bankeksempel blokkerer ikke rapporten');
  // Tydelig begrensning i stedet for identiske aksetall og nedlastinger som ser presise ut.
  await p.evaluate(()=>{s.rate=100;fill();render();});await p.locator('#heroDownload').click();await p.locator('#exportPdf').click();await frames();
  assert(await p.locator('#reportContact').isVisible());assert.equal(await p.locator('#reportContact').getAttribute('href'),'om.html#kontakt');
  assert(await p.locator('#downloadReportHtml').isHidden());assert(await p.locator('#printReport').isHidden());
  if(process.env.SPARE_TESTFUNN_SCREENSHOTS)await p.screenshot({path:path.join(process.env.SPARE_TESTFUNN_SCREENSHOTS,'ekstrem.png')});
  assert.match(await p.locator('#reportPreview').innerText(),/Takk for at du tester hva kalkulatoren tåler/);assert.equal(await p.locator('#chart svg').count(),0);
  await p.locator('#closeReport').click();
  // Valgte planer vurderes etter sitt eget innhold, ikke den åpne planen.
  await p.evaluate(()=>{saved=[{name:'Vanlig plan',state:{...E.defaults,start:50000,monthly:2000,years:10}},{name:'Ekstrem plan',state:{...s}}];pickedPlans=new Set([0]);document.getElementById('savedDetails').open=true;savedRender();});
  await p.locator('#downloadSelected').click();await p.locator('#selectedExportPdf').click();await frames();assert(await p.locator('#downloadReportHtml').isVisible());await p.locator('#closeReport').click();
  await p.evaluate(()=>{pickedPlans=new Set([1]);savedRender();});await p.locator('#downloadSelected').click();await p.locator('#selectedExportPdf').click();await frames();assert(await p.locator('#reportContact').isVisible());await p.locator('#closeReport').click();
  await p.evaluate(()=>{Object.assign(s,{start:50000,monthly:2000,years:10,rate:5,log:false});fill();render();});
  await p.locator('#heroDownload').click();await p.locator('#exportPdf').click();await frames();
  assert(await p.locator('#downloadReportHtml').isVisible());assert(await p.locator('#printReport').isVisible());assert(await p.locator('#reportContact').isHidden());
  assert.deepEqual(errors,[]);console.log('Testfunn: PC-hopp, samlet innskudd, tabellhopp, rapport/HTML/PDF-tabell, akseplass og ekstrem/normal/valgte rapporter: OK i '+engine);
 }finally{if(browser)await browser.close();server.close();fs.rmSync(temp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exit(1);});
