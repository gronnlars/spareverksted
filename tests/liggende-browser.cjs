// Liggende mobil (Lars 2.11.2026): etter valg på forsiden skal skjemaet vises fra toppen, ikke fra bunnen.
// Valgkortene krymper når skjemaet åpnes, så rulling må skje etter at oppsettet er endret.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}try{const d=fs.readFileSync(f);res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(d);}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  for(const [width,height] of [[750,340],[844,390],[390,844],[1280,800]])for(const choice of ['chooseGrowth','chooseGoal']){
   const page=await browser.newPage({viewport:{width,height},isMobile:width<1000,hasTouch:width<1000,reducedMotion:'reduce'});
   await page.goto(origin);await page.locator('#'+choice).click();await page.waitForTimeout(150);
   const box=await page.locator('#onboardAge').boundingBox();
   assert(box&&box.y>=0&&box.y+box.height<=height,width+'x'+height+' '+choice+': første felt synes, var y='+(box&&Math.round(box.y)));
   await page.close();
  }
  console.log('Liggende og stående: første felt synes etter valg på forsiden.');
 }finally{await browser?.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
