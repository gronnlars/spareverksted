// Samlet, målrettet kontroll av finpussen. Ingen publisering eller eksterne tjenester.
const pw=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const engine=process.env.SPARE_ENGINE||'chromium';
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage']}: {})});
  const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:'+server.address().port+'/index.html#activePage=calculator');
  const frames=()=>p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(r)))));
  for(const width of [1920,1280,768,640,390,320,256]){
   await p.setViewportSize({width,height:900});
   for(const l of ['simple','explore','advanced']){
    await p.evaluate(l=>{Object.assign(s,{start:9999999999,monthly:9999999,years:100,rate:15,inflation:0});setLevel(l,{remember:false});fill();render();},l);
    await frames();
    const size=await p.locator('#savingsResult').evaluate(e=>({outer:e.clientWidth,inner:e.scrollWidth,page:document.documentElement.scrollWidth,viewport:innerWidth}));
    assert(size.inner<=size.outer+1&&size.page<=size.viewport,JSON.stringify({width,l,size}));
    assert.equal(await p.locator('.result-navigation [data-edit-fields]').isVisible(),width<=760,'Endre tall følger én kolonne');
   }
  }
  await p.setViewportSize({width:390,height:844});
  for(const [years,months,label]of [[25.5,306,'25 år og 6 måneder'],[25.9,311,'25 år og 11 måneder'],[0.5,6,'6 måneder'],[1/12,1,'1 måned'],[25.99,312,'26 år'],[26,312,'26 år']]){
   await p.evaluate(years=>{Object.assign(s,{start:0,monthly:1000,years,rate:0,fee:0,inflation:0,ageKnown:false});fill();render();},years);
   assert.equal(await p.evaluate(()=>Math.round(E.value(s,endYear(s)))),months*1000,'samme månedsmodell');
   assert.match((await p.locator('#resultLabel').innerText()).toLowerCase(),new RegExp(label));
   assert.match(await p.evaluate(()=>buildReport()),new RegExp('Etter '+label+' med sparing'));
   if(!Number.isInteger(years))assert.match(await p.locator('#yearsDescription').innerText(),new RegExp(label));
  }
  assert.deepEqual(await p.evaluate(()=>{
   const RealDate=Date,out=[];
   try{
    for(const [date,years]of [['2026-01-15T12:00:00Z',25.5],['2026-11-15T12:00:00Z',25.9]]){
     window.Date=class extends RealDate{constructor(...args){super(...(args.length?args:[date]));}};
     out.push(calendarYearAfter(years));
    }
   }finally{window.Date=RealDate;}return out;
  }),[2051,2052],'kalenderår følger måneden, ikke avrunding til hele år');
  // Snarveien bruker den eksisterende navne- og lagringsflyten.
  await p.locator('#saveResult').click();assert.equal(await p.locator('#scenarioName').inputValue(),'Spareplan');
  await p.locator('#saveNew').click();
  await p.locator('#saveResult').click();assert.equal(await p.locator('#scenarioName').inputValue(),'Spareplan (2)');
  await p.locator('#saveNew').click();
  // Mange åpne forklaringer og lagrede planer skal ikke endre hoppmålet.
  await p.evaluate(()=>{document.querySelectorAll('#planInputs details').forEach(d=>d.open=true);document.getElementById('meaningMore').open=true;});
  const before=await p.evaluate(()=>JSON.stringify({s,view,mode}));
  await p.locator('#seeGraph').click();assert.equal(await p.evaluate(()=>document.activeElement.id),'chartPanel');
  assert((await p.locator('#chartHeading').boundingBox()).y>=0,'grafoverskrift synlig');
  await p.locator('#chartPanel [data-edit-fields]').click();assert.equal(await p.evaluate(()=>document.activeElement.id),'planInputs');
  await p.locator('.input-result[data-show-result]').click();assert.equal(await p.evaluate(()=>document.activeElement.id),'savingsResult');
  assert.equal(await p.evaluate(()=>JSON.stringify({s,view,mode})),before,'hopp bevarer planen');
  await p.locator('#compareJump').click();assert.equal(await p.evaluate(()=>document.activeElement.id),'savedHeading');
  await p.locator('#saved input[data-pick-index="0"]').check();assert.match(await p.locator('#downloadSelected').innerText(),/\(1\)/);
  await p.locator('#saved input[data-pick-index="1"]').check();
  await p.locator('#compareSelected').click();await p.locator('#cmpDownload').click();
  assert.match(await p.locator('#exportTitle').innerText(),/sammenligningen/);assert(await p.locator('#exportJson').isHidden());
  const [xlsx,csv]=await p.evaluate(()=>[exportSheets(),activeMatrix()]);
  assert(xlsx.length>0&&xlsx.every(x=>/sammenlign/i.test(x.name)));assert(csv[0].length>=3);
  await p.locator('#exportPdf').click();assert.match(await p.locator('#reportPreview').innerText(),/Planer sammenlignet/);
  const printCopy=await p.locator('#printReportContent').innerHTML();
  for(const width of [1280,640,390,320,256]){
   await p.setViewportSize({width,height:900});await frames();
   const sizes=await p.locator('#reportPreview').evaluate(e=>[e,...e.querySelectorAll('.table-scroll,.report-table')].map(e=>({outer:e.clientWidth,inner:e.scrollWidth})));
   assert(sizes.every(x=>x.inner<=x.outer+1),JSON.stringify({width,sizes}));
  }
  assert.equal(await p.locator('#printReportContent').innerHTML(),printCopy,'radvis forhåndsvisning endrer ikke PDF');
  await p.locator('#closeReport').click();await p.locator('#heroDownload').click();
  assert(await p.locator('#exportJson').isVisible(),'Data tilbys igjen for åpen plan');assert.match(await p.locator('#exportTitle').innerText(),/beregningen/);
  await p.locator('#closeExport').click();
  // Også rapporten for en lagret plan med svært store tall må få plass.
  await p.evaluate(()=>{saved.push({name:'Stor plan',state:{...s,start:9999999999,monthly:9999999,years:100,rate:15,fee:0,inflation:0},mode:'explore',view:{}});pickedPlans=new Set([saved.length-1]);savedRender();});
  await p.locator('#downloadSelected').click();await p.locator('#selectedExportPdf').click();
  for(const width of [1280,390,256]){
   await p.setViewportSize({width,height:900});await frames();
   const sizes=await p.locator('#reportPreview').evaluate(e=>[e,...e.querySelectorAll('.table-scroll,.report-table,.report-assumptions')].map(e=>({outer:e.clientWidth,inner:e.scrollWidth})));
   assert(sizes.every(x=>x.inner<=x.outer+1),'store tall i rapport: '+JSON.stringify({width,sizes}));
  }
  await p.locator('#closeReport').click();
  // Nivåene viser ulike felt og bevarer skjulte verdier i beregningen.
  await p.evaluate(()=>{Object.assign(s,{growth:2,extra:5000,extraYear:2,crash:20,crashYear:3});fill();render();});
  const amount=await p.evaluate(()=>E.value(s,endYear(s)));
  for(const l of ['simple','explore','advanced']){
   await p.evaluate(l=>setLevel(l,{remember:false}),l);
   assert.equal(await p.locator('#advancedDetails').isVisible(),l!=='simple');
   assert.equal(await p.locator('#eventsDetails').isVisible(),l==='advanced');
   assert.equal(await p.evaluate(()=>E.value(s,endYear(s))),amount,'nivåbytte endrer ikke tallene');
  }
  assert.deepEqual(errors,[]);console.log('Finpuss: store tall, 256–1920 px, perioder, lagring, hoppmål, sammenligning, rapport og nivåer: OK i '+engine);
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
