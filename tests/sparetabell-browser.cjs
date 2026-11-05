// Hele tall og tydelige overskrifter uten intern sideveis rulling i sparetabellen.
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
  // ResizeObserver køer tilpasningen til neste skjermoppdatering. Vent på faktiske
  // rammer før måling, ikke 80 ms som kan gå før WebKit har behandlet endringen.
  const layoutReady=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))));
  for(const huge of [false,true])for(const mode of ['nominal','real','both']){
   await page.evaluate(({huge,mode})=>{Object.assign(s,{start:huge?9999999999:50000,monthly:huge?9999999:2000,years:huge?100:10,rate:huge?15:5,fee:0.2,inflation:2.5,real:mode==='real'});Object.assign(view,{both:mode==='both',showRange:true,showBank:true});fill();render();document.getElementById('tableTab').click();},{huge,mode});
   const values=await page.locator('.savings-cell-value').allTextContents();
   assert(values.length>0);assert.doesNotMatch(values.join(' '),/NaN|undefined|Infinity/);
   for(const width of [1920,1280,640,390,320,256,1296,1288,1280,1272,1264,1280,1920]){
    await page.setViewportSize({width,height:900});
    await layoutReady();
    const size=await page.locator('#tableWrap').evaluate(e=>({outer:e.clientWidth,inner:e.scrollWidth,stacked:e.classList.contains('savings-stacked'),table:e.querySelector('table').getBoundingClientRect().width}));
    assert(size.inner<=size.outer+1,`${mode}, ${huge}, ${width}: intern sideveis rulling ${JSON.stringify(size)}`);
    assert.deepEqual(await page.locator('.savings-cell-value').allTextContents(),values,'endret tall ved endret bredde');
    assert.equal(await page.getByRole('table').filter({has:page.locator('.savings-cell-value')}).count(),1,'én tabell for hjelpemidler');
    assert.equal(await page.locator('.savings-table thead th[scope=col]').count(),await page.locator('.savings-table tbody tr').first().locator('td').count()+1);
    if(size.stacked){assert(await page.locator('.savings-cell-label').first().isVisible(),'synlig etikett ved verdien');assert(await page.locator('.savings-year-label').first().isVisible(),'tidspunktet har etikett');}
   }
  }
  // Kort tabell vender tilbake til vanlig oppsett når den får nok plass.
  await page.evaluate(()=>{Object.assign(s,{start:0,monthly:1000,years:1,rate:0,fee:0,inflation:0,real:false});Object.assign(view,{both:false,showRange:false,showBank:false});fill();render();});
  await page.setViewportSize({width:1920,height:900});await layoutReady();
  assert.equal(await page.locator('#tableWrap').evaluate(e=>e.classList.contains('savings-stacked')),false);
  assert.match((await page.locator('.savings-table tbody tr').last().innerText()).replace(/\s/g,''),/12000kr/);
  assert.deepEqual(errors,[]);console.log('Sparetabell: tre kronevisninger, vanlige/store beløp, 256–1920 px, etiketter og uendrede verdier består i '+engine+'.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
