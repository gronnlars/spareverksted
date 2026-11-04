// Retur når utskrift ignoreres eller feiler, og nettlesermeny som reservevei.
// Hendelser simuleres for å kontrollere feilforløp. Dette erstatter ikke fysisk iPhone/Safari.
const pw=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const engine=process.env.SPARE_ENGINE||'chromium';
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})}:{})});
  for(const touch of [true,false]){
   const context=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:900},hasTouch:touch});
   await context.addInitScript(()=>{
    window.__printCalls=0;
    window.print=()=>{window.__printCalls++;};
    if(location.protocol==='http:')localStorage.setItem('sv-scenarios',JSON.stringify([
     {name:'Første plan',state:{activePage:'calculator',monthly:1000,years:10},view:{},mode:'explore'},
     {name:'Andre plan',state:{activePage:'calculator',monthly:2000,years:15},view:{},mode:'explore'}
    ]));
   });
   const page=await context.newPage(),errors=[];page.setDefaultTimeout(8000);page.on('pageerror',e=>errors.push(e.message));
   const press=()=>touch?page.locator('#printReport').tap():page.click('#printReport');
   for(const route of ['plan','sammenligning','valgte']){
    await page.goto('about:blank');
    await page.goto(origin+'/index.html#activePage=calculator&monthly=3000&years=20');
    if(route==='plan'){await page.click('#heroDownload');await page.click('#exportPdf');}
    else{
     await page.locator('#savedDetails').evaluate(d=>d.open=true);
     await page.locator('#pickAll').check();
     if(route==='sammenligning'){await page.click('#compareSelected');await page.click('#cmpDownload');await page.click('#exportPdf');}
     else{await page.click('#downloadSelected');await page.click('#selectedExportPdf');}
    }
    const preview=await page.locator('#reportPreview').innerHTML(),copy=await page.locator('#printReportContent').innerHTML(),title=await page.title();
    if(route!=='plan')for(const name of ['Første plan','Andre plan'])assert(copy.includes(name),route+': riktig planutvalg');
    // Nettleseren kan ignorere kallet uten hendelser. Rapport og tittel må fortsatt komme tilbake.
    for(let attempt=0;attempt<2;attempt++){
     await press();
     await page.waitForFunction(()=>document.getElementById('reportDialog').open);
     assert.equal(await page.title(),title,route+': tittel etter ignorert utskrift');
     assert.equal(await page.evaluate(()=>document.activeElement.id),'printReport',route+': fokus etter retur');
     assert.equal(await page.locator('#reportPreview').innerHTML(),preview,route+': forhåndsvisningen bevares');
     assert.equal(await page.locator('#printReportContent').innerHTML(),copy,route+': utskriftskopien bevares');
    }
    assert.equal(await page.evaluate(()=>window.__printCalls),2,route+': begge trykk når utskriftskallet');
    // Feil i selve utskriftskallet skal heller ikke miste rapporten eller lekke et sideunntak.
    await page.evaluate(()=>{window.print=()=>{throw new Error('Utskrift sperret i test');};});
    await press();await page.waitForFunction(()=>document.getElementById('reportDialog').open);
    assert.equal(await page.title(),title);
    assert(await page.locator('#report-print-status').isVisible());
    // Nettleserens egen utskrift må lukke modaliteten og bevare akkurat denne rapporten.
    await page.locator('#reportDialog').evaluate(d=>{d.scrollTop=d.scrollHeight;});
    await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
    assert.equal(await page.locator('#reportDialog').evaluate(d=>d.open),false,route+': modal lukket ved menyutskrift');
    assert.notEqual(await page.title(),title,route+': rapporttittel under menyutskrift');
    assert.equal(await page.locator('#printReportContent').innerHTML(),copy,route+': menyutskrift beholder utvalget');
    assert.equal(await page.locator('#printReportContent').getAttribute('aria-hidden'),null);
    await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
    await page.waitForFunction(()=>document.getElementById('reportDialog').open);
    assert.equal(await page.title(),title);
    assert(await page.locator('#printReport').evaluate(b=>{const r=b.getBoundingClientRect(),d=b.closest('dialog').getBoundingClientRect();return r.top>=d.top&&r.bottom<=d.bottom;}),route+': fokus på utskriftsknappen er synlig etter retur fra bunnen av rapporten');
    // PDF lages via en ekte nettleserhendelse med rapporten åpen, uten klikk på utskriftsknappen.
    // De øvrige motorene har ikke Playwrights PDF-API. Dette er fortsatt ikke iPhones utskriftsvindu.
    if(engine==='chromium'&&!touch){
     const pdf=(await page.pdf({format:'A4',tagged:true})).toString('latin1');
     for(const key of ['/StructTreeRoot','/ParentTree','/Lang','/Title'])assert(pdf.includes(key),route+': PDF mangler '+key);
     assert(/\/S\s*\/H1\b/.test(pdf),route+': PDF mangler H1');
     if(route!=='plan')assert(/\/S\s*\/Table\b/.test(pdf),route+': PDF mangler tabellstruktur');
     await page.waitForFunction(()=>document.getElementById('reportDialog').open);
     assert.equal(await page.title(),title);
     assert.equal(await page.locator('#printReportContent').innerHTML(),copy);
    }
    // Asynkron utskrift skal holde kopien utenfor modalitet helt til utskriften avsluttes.
    await page.evaluate(()=>{window.print=()=>window.dispatchEvent(new Event('beforeprint'));});
    await press();await page.waitForTimeout(50);
    assert.equal(await page.locator('#reportDialog').evaluate(d=>d.open),false,route+': ingen tidlig gjenåpning');
    await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
    await page.waitForFunction(()=>document.getElementById('reportDialog').open);
    assert.equal(await page.locator('#printReportContent').innerHTML(),copy);
    assert.equal(await page.title(),title);
    // Retur fra utskriftsmediet er også nok hvis afterprint mangler.
    await press();await page.emulateMedia({media:'print'});await page.waitForTimeout(50);
    assert.equal(await page.locator('#reportDialog').evaluate(d=>d.open),false);
    await page.emulateMedia({media:null});
    await page.waitForFunction(()=>document.getElementById('reportDialog').open);
    assert.equal(await page.title(),title);
    await page.click('#closeReport');assert.equal(await page.locator('#reportDialog').evaluate(d=>d.open),false);
   }
   assert.deepEqual(errors,[]);await context.close();
  }
  console.log('Rapportutskrift: ignorert kall, feil, menyutskrift, gjentakelse og asynkron retur består i '+engine+'. Mus og berøring, tre rapportutvalg.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
