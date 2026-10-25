// Kontroll av nettverkstrafikk, informasjonskapsler og lagring i en ren nettleserprofil.
// Bruk:  node scripts/produksjonskontroll.cjs https://spareverksted.no       (publisert side)
//        node scripts/produksjonskontroll.cjs --local                        (dist/ fra dette repoet, egen lokal server)
// Krever playwright (npm i playwright). Bruker bare oppdiktede tall. Sender ingenting til andre enn adressen som oppgis.
// Rapporten viser det nettleseren selv ser. Den viser ikke hva leverandøren lagrer på serveren (serverlogger).
const {chromium}=require('playwright'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const arg=process.argv[2]||'https://spareverksted.no';let origin=arg,server;
 if(arg==='--local'){
  const root=path.resolve(__dirname,'../dist');
  server=http.createServer((req,res)=>{let pn=new URL(req.url,'http://x').pathname;if(pn.endsWith('/'))pn+='index.html';const f=path.resolve(root,'.'+pn);if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.png')?'image/png':'text/html');res.end(fs.readFileSync(f));}catch{res.writeHead(404);res.end();}});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));origin='http://127.0.0.1:'+server.address().port;
 }
 origin=origin.replace(/\/$/,'');const host=new URL(origin).host;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const log=[];let step='start';
 const page=await context.newPage();
 page.on('request',r=>log.push({step,kind:'request',method:r.request?.method?.()||r.method(),url:r.url(),type:r.resourceType(),postData:r.postData()?'JA':'nei',referer:r.headers()['referer']||'',redirectedFrom:r.redirectedFrom()?r.redirectedFrom().url():''}));
 page.on('response',async r=>{const h=await r.allHeaders().catch(()=>({}));log.push({step,kind:'response',status:r.status(),url:r.url(),setCookie:h['set-cookie']||'',server:h['server']||'',via:h['via']||'',cacheControl:h['cache-control']||'',hsts:h['strict-transport-security']||'',location:h['location']||'',xServedBy:h['x-served-by']||'',xGithubRequestId:h['x-github-request-id']?'ja':''});});
 page.on('websocket',w=>log.push({step,kind:'websocket',url:w.url()}));
 const storage=async label=>{const s=await page.evaluate(()=>({local:Object.keys(localStorage),session:Object.keys(sessionStorage)})).catch(()=>({local:['?'],session:['?']}));log.push({step:label,kind:'storage',...s,cookies:(await context.cookies()).map(c=>c.name+' ('+c.domain+')')});};
 const flows=[
  ['1 første besøk',async()=>{await page.goto(origin+'/');await page.waitForLoadState('networkidle');}],
  ['2 start med oppdiktede tall',async()=>{await page.locator('#chooseGrowth').click();await page.locator('#onboardStart').fill('1000');await page.locator('#onboardMonthly').fill('500');await page.locator('#beginJourney').click();}],
  ['3 endre beløp, nivå og tema',async()=>{await page.locator('#monthly').fill('750');await page.evaluate(()=>document.querySelector('#levels [data-level=explore]').click());await page.locator('[data-color-theme=night]').click();}],
  ['4 lagre plan',async()=>{await page.evaluate(()=>document.getElementById('save').click());await page.locator('#scenarioName').fill('Test');await page.locator('#saveForm button[type=submit]').click();}],
  ['5 gjenåpne',async()=>{await page.goto(origin+'/');await page.waitForLoadState('networkidle');}],
  ['6 til «Spør om sparing» og søk',async()=>{await page.evaluate(()=>document.querySelector('a[href="spor.html"]').click());await page.waitForURL(/spor\.html/);await page.locator('#question').fill('fond');await page.locator('#questionForm button[type=submit]').click();}],
  ['7 personvernside og sletting',async()=>{await page.goto(origin+'/personvern.html');page.on('dialog',d=>d.accept());const b=page.locator('#deleteAll');if(await b.isVisible())await b.click();}],
  ['8 feilside',async()=>{await page.goto(origin+'/finnes-ikke.html').catch(()=>{});}],
 ];
 for(const [label,fn] of flows){step=label;try{await fn();}catch(e){log.push({step:label,kind:'feil',message:String(e.message).split('\n')[0]});}await storage(label);}
 const external=[...new Set(log.filter(l=>l.kind==='request'&&new URL(l.url).host!==host).map(l=>new URL(l.url).host))];
 const cookies=log.filter(l=>l.kind==='response'&&l.setCookie).map(l=>l.step+': '+l.url+' → '+l.setCookie);
 const posts=log.filter(l=>l.kind==='request'&&(l.method!=='GET'||l.postData==='JA'));
 const redirects=log.filter(l=>l.kind==='request'&&l.redirectedFrom).map(l=>l.redirectedFrom+' → '+l.url);
 const firstDoc=log.find(l=>l.kind==='response'&&l.step.startsWith('1'));
 console.error(log.filter(l=>l.kind==='feil').map(l=>l.step+': '+l.message).join('\n'));console.log(JSON.stringify({dato:new Date().toISOString(),adresse:origin,sammendrag:{
  forespørslerTilAndreVerter:external,Set_Cookie:cookies,ikkeGET_ellerMedBody:posts.map(p=>p.method+' '+p.url),omdirigeringer:redirects,
  websocket:log.filter(l=>l.kind==='websocket').map(l=>l.url),
  førsteDokument:firstDoc&&{status:firstDoc.status,server:firstDoc.server,via:firstDoc.via,hsts:firstDoc.hsts,cacheControl:firstDoc.cacheControl,xServedBy:firstDoc.xServedBy,githubRequestId:firstDoc.xGithubRequestId},
  lagringEtterHvertTrinn:log.filter(l=>l.kind==='storage').map(l=>({trinn:l.step,local:l.local,session:l.session,cookies:l.cookies}))},
  alleForespørsler:log.filter(l=>l.kind==='request').map(l=>[l.step,l.method,l.url,l.type,l.referer].join(' | '))},null,1));
 await browser.close();if(server)server.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
