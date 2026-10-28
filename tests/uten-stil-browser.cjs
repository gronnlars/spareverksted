// Grafen uten sidens stilark (Chromium). Lesemodus i Chrome og Safari, egne stilark og enkelte hjelpemidler
// viser siden uten vår CSS. Da skal tallene på aksen ikke kuttes, og forklaringen av linjene
// skal vises som en liste, ikke som ord klistret sammen («Beløp i kronerDu setter inn», funnet av Lars 28.10.2026).
// Dette er en tilnærming. Det er ikke nettleserens egen lesemodus.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  for(const width of [390,1280]){
   const p=await browser.newPage({viewport:{width,height:844}});
   await p.goto(origin+'/index.html#start=0&monthly=2000&years=10&savingsType=index&rate=7&showBank=1');await p.reload();await p.waitForTimeout(500);
   await p.evaluate(()=>{for(const l of document.querySelectorAll('link[rel=stylesheet],style'))l.remove();document.body.style.cssText='font:19px/1.5 system-ui;margin:16px';});
   await p.waitForTimeout(200);
   const outside=await p.evaluate(()=>[...document.querySelectorAll('#chart svg text')].filter(t=>{const r=t.getBoundingClientRect(),s=t.ownerSVGElement.getBoundingClientRect();return r.width&&(r.left<s.left-1||r.right>s.right+1);}).map(t=>t.textContent));
   assert.deepEqual(outside,[],width+' px: tekst i grafen går utenfor kanten uten stilark');
   const items=await p.locator('#chartLegend > li').allInnerTexts();
   assert.ok(items.length>=2,'forklaringen har minst to punkter');
   assert.ok(items.every(t=>t.trim()),'hvert punkt i forklaringen har tekst');
   await p.close();
  }
  console.log('Browser (Chromium): without stylesheets the chart labels fit and the legend is a list.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
