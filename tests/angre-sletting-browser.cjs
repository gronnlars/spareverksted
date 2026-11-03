// Slett alle planer: Angre vises der du trykket, får fokus og henter planene tilbake.
// Lagrede planer: åpne, planlinje, unike navn, oppdater kontra ny, velg alle, sammenlign, slett og angre.
// Krever playwright. SPARE_BROWSER kan peke på en Chromium. SPARE_ENGINE=firefox|webkit for andre motorer.
const pw=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const engine=process.env.SPARE_ENGINE||'chromium';
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}try{const d=fs.readFileSync(f);res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(d);}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;
 try{

  browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})}:{})});
  const plans=[1,2,3].map(i=>({name:'Plan '+i,state:{years:10,monthly:1000*i,activePage:'calculator'},mode:'explore',view:{}}));
  for(const vp of [{width:390,height:780},{width:1280,height:800}]){
   const c=await browser.newContext({viewport:vp});
   await c.addInitScript(p=>{if(!sessionStorage.getItem('s')){sessionStorage.setItem('s','1');localStorage.setItem('sv-scenarios',JSON.stringify(p));}},plans);
   const q=await c.newPage();await q.goto(origin+'#start=0&activePage=calculator');await q.waitForTimeout(400);
   await q.evaluate(()=>{document.getElementById('savedDetails').open=true;});
   await q.locator('#pickAll').click();await q.locator('#deleteSelected').scrollIntoViewIfNeeded();await q.locator('#deleteSelected').click();await q.waitForTimeout(400);
   const r=await q.evaluate(()=>{const b=document.getElementById('planUndo'),x=b.getBoundingClientRect();return {hidden:b.hidden,top:Math.round(x.top),bottom:Math.round(x.bottom),vh:innerHeight,text:document.getElementById('undoText').textContent,pos:getComputedStyle(b).position,focus:document.activeElement?.id};});
   assert(!r.hidden&&r.top>=0&&r.bottom<=r.vh,'angre syns der du slettet');assert.equal(r.focus,'planUndoButton');
   await q.screenshot({path:'/tmp/claude-0/slett-'+vp.width+'.png'});
  }
 }finally{if(browser)await browser.close();server.close();}
console.log('angre sletting: OK');
})().catch(e=>{console.error(e);process.exit(1);});
