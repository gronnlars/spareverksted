// Tidsaksen i grafen: hele år eller hele måneder med like steg, sluttidspunktet vises, ingen etiketter overlapper.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  const expected={
   '375:10':['0 år','5 år','10 år'],
   '375:7':['0 år','2 år','4 år','7 år'],
   '375:23':['0 år','10 år','23 år'],
   '375:1':['0 mnd','6 mnd','12 mnd'],
   '375:3.8':['0 år','2 år','3,8 år'],
   '1280:10':['0 år','2 år','4 år','6 år','8 år','10 år'],
   '1280:33':['0 år','5 år','10 år','15 år','20 år','25 år','33 år']};
  for(const width of [320,375,1280])for(const years of [0.5,1,1.5,2,3.8,7,10,13,23,33,40,100]){
   const page=await browser.newPage({viewport:{width,height:800}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin+`/index.html#start=1000&monthly=2000&years=${years}&rate=5`);await page.reload();
   await page.waitForFunction(()=>document.querySelector('#chart svg'));
   const {labels,overlap}=await page.evaluate(()=>{const tx=[...document.querySelectorAll('#chart svg text')].filter(e=>/ (år|mnd)$/.test(e.textContent));const r=tx.map(e=>e.getBoundingClientRect());let overlap='';for(let i=1;i<r.length;i++)if(r[i].left<r[i-1].right+2)overlap=tx[i-1].textContent+' / '+tx[i].textContent;return {labels:tx.map(e=>e.textContent),overlap};});
   const key=width+':'+years;
   assert.deepEqual(errors,[],key);
   assert.equal(overlap,'',`${key}: etiketter overlapper`);
   assert(labels.length>=2,`${key}: minst start og slutt`);
   assert(labels.slice(0,-1).every(l=>/^\d+ (år|mnd)$/.test(l)),`${key}: hele tall før sluttpunktet: ${labels}`);
   assert(labels.length<=(width<350?3:width<450?4:7),`${key}: for mange etiketter: ${labels}`);
   if(expected[key])assert.deepEqual(labels,expected[key],key);
   await page.close();
  }
  console.log('Graph time axis: whole steps, end point shown, no overlap at 320, 375 and 1280 px.');
 }finally{await browser?.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
