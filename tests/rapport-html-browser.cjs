// Last ned faktisk rapport, åpne den lokalt uten nett og uten JavaScript.
const pw=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),os=require('node:os');
const {pathToFileURL}=require('node:url'),{spawnSync}=require('node:child_process'),engine=process.env.SPARE_ENGINE||'chromium';
(async()=>{
 const root=path.resolve(__dirname,'../dist'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'spare-html-'));
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage']}: {})});
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const name='Åse <img src=x onerror="alert(1)">';
  await context.addInitScript(name=>{if(location.protocol!=='http:')return;localStorage.setItem('sv-scenarios',JSON.stringify([
   {name,state:{activePage:'calculator',start:10000,monthly:1000,years:10},view:{},mode:'explore'},
   {name:'Andre plan',state:{activePage:'calculator',monthly:2000,years:15},view:{},mode:'explore'},
   {name:'Utelatt plan',state:{activePage:'calculator',monthly:9000,years:40},view:{},mode:'explore'}
  ]));},name);
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(10000);
  const offline=await browser.newContext({javaScriptEnabled:false});
  const requests=[];await offline.route(/^https?:/,route=>{requests.push(route.request().url());return route.abort();});
  for(const route of ['plan','dreams','withdrawals','sammenligning','valgte']){
   await page.goto('about:blank');await page.goto('http://127.0.0.1:'+server.address().port+'/index.html#activePage='+(['dreams','withdrawals'].includes(route)?route:'calculator'));
   if(['sammenligning','valgte'].includes(route)){
    await page.locator('#savedDetails').evaluate(d=>d.open=true);
    await page.locator('#saved input[data-pick-index="0"]').check();await page.locator('#saved input[data-pick-index="1"]').check();
    if(route==='sammenligning'){await page.click('#compareSelected');await page.click('#cmpDownload');await page.click('#exportPdf');}
    else{await page.click('#downloadSelected');await page.click('#selectedExportPdf');}
   }else{await page.click(route==='dreams'?'#dreamDownload':route==='withdrawals'?'#withdrawDownload':'#heroDownload');await page.click('#exportPdf');}
   const theme=route==='dreams'?'night':route==='withdrawals'?'light':'neutral';
   await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
   const color=await page.locator('body').evaluate(e=>getComputedStyle(e).color);
   const reportColors=await page.locator('#reportPreview').evaluate(e=>{const result=e.querySelector('.report-result'),line=e.querySelector('svg [stroke]');return {result:result?getComputedStyle(result).backgroundColor:null,line:line?getComputedStyle(line).stroke:null};});
   const before=await page.locator('#printReportContent').innerHTML();
   const expected=await page.locator('#printReportContent').evaluate(e=>({title:e.querySelector('h1').textContent,svgs:e.querySelectorAll('svg').length,cells:[...e.querySelectorAll('tbody tr')].flatMap(r=>[...r.cells].map(c=>{const copy=c.cloneNode(true);copy.querySelectorAll('.savings-cell-label,.savings-year-label').forEach(n=>n.remove());return copy.textContent;}))}));
   const ready=page.waitForEvent('download');await page.click('#downloadReportHtml');const download=await ready;
   assert.match(download.suggestedFilename(),/^spareverksted-[a-z0-9-]+\.html$/);
   const file=path.join(temp,route+'.html');await download.saveAs(file);
   if(process.env.SPARE_HTML_OUTPUT_DIR){fs.mkdirSync(process.env.SPARE_HTML_OUTPUT_DIR,{recursive:true});fs.copyFileSync(file,path.join(process.env.SPARE_HTML_OUTPUT_DIR,engine+'-'+route+'.html'));}
   const text=fs.readFileSync(file,'utf8');assert.match(text,/^<!doctype html>/);assert.match(text,/script-src 'none'/);
   if(process.env.SPARE_HTML_VALIDATOR){
    const check=spawnSync('java',['-Xmx512m','-jar',process.env.SPARE_HTML_VALIDATOR,'--format','json','--stdout',file],{encoding:'utf8',timeout:30000});
    assert.ifError(check.error);
    const messages=JSON.parse(check.stdout).messages;assert.deepEqual(messages.filter(m=>m.type==='error'),[],route+': Nu HTML/CSS-validator');
    assert.equal(check.status,0,check.stderr);
   }
   assert.equal(await page.locator('#printReportContent').innerHTML(),before,'HTML endrer ikke PDF-kopien');
   assert(await page.locator('#reportDialog').evaluate(d=>d.open),'forhåndsvisning beholdes');
   const saved=await offline.newPage();await saved.goto(pathToFileURL(file).href);
   assert.equal(await saved.locator('html').getAttribute('lang'),'nb');
   assert.equal(await saved.locator('html').getAttribute('data-theme'),theme);
   assert.equal(await saved.locator('body').evaluate(e=>getComputedStyle(e).color),color,'gjeldende tema og stiler beholdes');
   assert.equal(await saved.locator('h1').count(),1);assert.equal(await saved.locator('h1').textContent(),expected.title);
   assert.equal(await saved.locator('script,link,iframe,object,embed,button,input,img').count(),0);
   assert.equal(await saved.locator('svg').count(),expected.svgs,'grafer bevart');
   assert.deepEqual(await saved.locator('main').evaluate(e=>{const result=e.querySelector('.report-result'),line=e.querySelector('svg [stroke]');return {result:result?getComputedStyle(result).backgroundColor:null,line:line?getComputedStyle(line).stroke:null};}),reportColors,'rapportens tema og graffarger beholdes');
   assert.doesNotMatch(await saved.locator('style').textContent(),/(?:[;{]\s*)[-\w]+\s*:\s*;/,'ingen tomme CSS-verdier');
   const cells=await saved.locator('tbody tr').evaluateAll(rows=>rows.flatMap(r=>[...r.cells].map(c=>{const copy=c.cloneNode(true);copy.querySelectorAll('.html-cell-label').forEach(n=>n.remove());return copy.textContent;})));
   assert.deepEqual(cells,expected.cells,'samme tabelltall og merknader som forhåndsvisningen');
   if(['sammenligning','valgte'].includes(route)){assert((await saved.locator('main').textContent()).includes(name));assert(!(await saved.locator('main').textContent()).includes('Utelatt plan'));}
   for(const width of [1280,640,390,320,256]){
    await saved.setViewportSize({width,height:900});
    assert.equal(await saved.getByRole('table').count(),await saved.locator('table').count());
    assert.equal(await saved.getByRole('columnheader').count(),await saved.locator('th[scope=col]').count());
    assert.equal(await saved.getByRole('rowheader').count(),await saved.locator('th[scope=row]').count());
    const overflow=await saved.evaluate(()=>({ok:document.documentElement.scrollWidth<=innerWidth+1,items:[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).slice(0,8).map(e=>({tag:e.tagName,cls:e.className?.baseVal??e.className,right:e.getBoundingClientRect().right,html:e.outerHTML.slice(0,180),parent:e.parentElement.outerHTML.slice(0,150)}))}));assert(overflow.ok,route+' '+width+': '+JSON.stringify(overflow.items));
   }
   assert.deepEqual(await saved.locator('[aria-labelledby],[aria-describedby]').evaluateAll(nodes=>nodes.flatMap(e=>['aria-labelledby','aria-describedby'].flatMap(a=>(e.getAttribute(a)||'').split(/\s+/).filter(id=>id&&!document.getElementById(id))))),[],'ingen brutte tekstalternativer');
   if(engine==='chromium'&&route==='plan'){await saved.setViewportSize({width:390,height:844});await saved.screenshot({path:'/tmp/spare-rapport-html-mobil.png',fullPage:true});}
   if(route==='valgte')assert(await saved.locator('.html-cell-label').first().isVisible());
   await saved.emulateMedia({media:'print'});assert(await saved.locator('h1').isVisible(),'kan også skrives ut fra HTML');
   await saved.close();
  }
  assert.deepEqual(requests,[],'ingen eksterne nettressurser');assert.deepEqual(errors,[]);
  await offline.close();await context.close();
  console.log('HTML-rapport: fem rapportveier, riktige planer/tall, lokal fil uten nett/JS, 256–1280 px og bevart PDF-kopi: OK i '+engine);
 }finally{if(browser)await browser.close();server.close();fs.rmSync(temp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exit(1);});
