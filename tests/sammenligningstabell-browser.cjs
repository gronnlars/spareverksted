// Sammenligning beholder plannavn, tabelloverskrifter og verdier uten intern sideveis rulling.
const pw=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const engine=process.env.SPARE_ENGINE||'chromium';
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage']}: {})});
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/index.html#activePage=calculator');
  for(const kind of ['calculator','dreams']){
   await page.evaluate(kind=>{
    s.activePage=kind;
    saved=[0,1,2].map((i)=>({name:['En spareplan med et langt og tydelig navn','Spareplan (2)','Pensjon'][i],state:{...E.defaults,activePage:kind,start:9999999999,monthly:9999999,years:10+i*10,rate:15,dreamCost:200000+i*100000,dreamYears:3+i}}));
    selectedPlans=new Set([0,1,2]);cmpCurrent=kind==='calculator';document.getElementById('savedDetails').open=true;savedRender();
   },kind);
   const values=await page.locator('#comparison .savings-cell-value').allTextContents();assert(values.length>0);
   for(const width of [1920,1280,640,390,320,256,1280,1920]){
    await page.setViewportSize({width,height:900});await page.waitForTimeout(100);
    const size=await page.locator('#comparison .table-scroll').evaluate(e=>({outer:e.clientWidth,inner:e.scrollWidth,stacked:e.classList.contains('savings-stacked')}));
    assert(size.inner<=size.outer+1,kind+', '+width+': '+JSON.stringify(size));
    assert.deepEqual(await page.locator('#comparison .savings-cell-value').allTextContents(),values);
    assert.equal(await page.locator('#comparison [role=columnheader]').count(),kind==='calculator'?5:4);
    if(size.stacked)assert(await page.locator('#comparison .savings-cell-label').first().isVisible());
   }
  }
  assert.deepEqual(errors,[]);console.log('Sammenligning: spareplaner og sparemål, 256–1920 px, etiketter og uendrede verdier består i '+engine+'.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
