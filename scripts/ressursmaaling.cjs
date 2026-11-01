'use strict';
// Synthetic, bounded Chromium test. Nothing is installed in the visitor's browser.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),cp=require('node:child_process');
const {chromium}=require('playwright');
async function main(){
 const args=process.argv.slice(2),target=args.find(x=>x.startsWith('--url=')),output=args.find(x=>x.startsWith('--output='));
 if(!output)throw Error('Specify --output=report.json (not inside dist).');
 const file=path.resolve(output.slice(9)),root=path.resolve(__dirname,'../dist');
 if(file===root||file.startsWith(root+path.sep))throw Error('Keep test reports outside dist; publish only a reviewed summary.');
 let server,browser,watchdog;
 const report={schemaVersion:1,date:new Date().toISOString(),status:'incomplete',scope:target?'published':'local',sourceCommit:target?null:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),checkoutDirty:!!cp.execFileSync('git',['status','--porcelain','--','dist','scripts/ressursmaaling.cjs'],{cwd:root,encoding:'utf8'}).trim(),fileHashes:Object.fromEntries(fs.readdirSync(root).filter(f=>/\.(html|css|js)$/.test(f)).sort().map(f=>[f,require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex')])),settings:{viewport:{width:390,height:844},cache:'Fresh context per page; second navigation in same context; HTTP cache enabled; no route interception',browser:'Chromium',quiet:'networkidle (500 ms), max 10 s per step',deadlineSeconds:90},limitations:['CDP encodedDataLength: HTTP response bytes as reported by Chromium, not TCP/TLS overhead or energy.','Request count includes cache-served requests. Cache is not disabled by test interception.','Local server has synthetic gzip and cache headers; it does not reproduce GitHub Pages.','Published target commit is unknown; local checkout SHA is not its source version.','No visitors, stored private plans or real financial data are used.'],steps:[],errors:[]};
 try{
  let origin;
  if(target){const u=new URL(target.slice(6));if(u.protocol!=='https:'||u.origin!=='https://spareverksted.no'||u.pathname!=='/')throw Error('Published measurement is limited to https://spareverksted.no/');origin=u.origin;}
  else{
   const zlib=require('node:zlib');
   server=http.createServer((req,res)=>{try{const u=new URL(req.url,'http://local'),f=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':decodeURIComponent(u.pathname)));if(!f.startsWith(root+path.sep))throw Error('outside root');const body=fs.readFileSync(f);res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png'})[path.extname(f)]||'application/octet-stream');res.setHeader('Cache-Control','public, max-age=600');if(/gzip/.test(req.headers['accept-encoding']||'')&&/\.(html|css|js)$/.test(f)){res.setHeader('Content-Encoding','gzip');res.setHeader('Vary','Accept-Encoding');res.end(zlib.gzipSync(body));}else res.end(body);}catch{res.writeHead(404);res.end('Not found');}});
   await new Promise(r=>server.listen(0,'127.0.0.1',r));origin='http://127.0.0.1:'+server.address().port;
  }
  report.target=origin;
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});report.browserVersion=browser.version();report.playwrightVersion=require('playwright/package.json').version;
  watchdog=setTimeout(()=>{report.errors.push('90 second deadline exceeded');browser.close().catch(()=>{});},90000);
  for(const pagePath of ['index.html','spor.html',...(target?[]:['ressursbruk.html'])]){
   const context=await browser.newContext({viewport:report.settings.viewport,reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(15000);
   const session=await context.newCDPSession(page);await session.send('Network.enable');await session.send('Network.setCacheDisabled',{cacheDisabled:false});
   let current,active=new Map();
   session.on('Network.requestWillBeSent',e=>{if(!current)return;let u;try{u=new URL(e.request.url);}catch{return;}if(!/^https?:$/.test(u.protocol))return;const item={url:u.origin+u.pathname,method:e.request.method,status:null,encodedBytes:null,cache:false,failed:false};current.requests.push(item);active.set(e.requestId,item);if(u.origin!==origin)current.externalOrigins.push(u.origin);});
   session.on('Network.requestServedFromCache',e=>{const r=active.get(e.requestId);if(r)r.cache=true;});
   session.on('Network.responseReceived',e=>{const r=active.get(e.requestId);if(r){r.status=e.response.status;r.cache ||= !!(e.response.fromDiskCache||e.response.fromPrefetchCache);r.serviceWorker=!!e.response.fromServiceWorker;}});
   session.on('Network.loadingFinished',e=>{const r=active.get(e.requestId);if(r){r.encodedBytes=e.encodedDataLength;active.delete(e.requestId);}});
   session.on('Network.loadingFailed',e=>{const r=active.get(e.requestId);if(r){r.failed=true;active.delete(e.requestId);}});
   page.on('pageerror',e=>report.errors.push(pagePath+': '+e.message));
   async function step(name,action){current={page:pagePath,name,status:'incomplete',requests:[],externalOrigins:[]};report.steps.push(current);active=new Map();try{await action();await page.waitForTimeout(800);await page.waitForLoadState('networkidle',{timeout:10000});await session.send('Runtime.evaluate',{expression:'0'});current.status='complete';}catch(e){current.error=e.message;report.errors.push(pagePath+'/'+name+': '+e.message);}current.externalOrigins=[...new Set(current.externalOrigins)];current.requestCount=current.requests.length;current.cacheResponses=current.requests.filter(r=>r.cache).length;current.encodedResponseBytes=current.requests.reduce((n,r)=>n+(r.encodedBytes??0),0);current.unknownSizes=current.requests.filter(r=>r.encodedBytes===null&&!r.failed).length;current.failedRequests=current.requests.filter(r=>r.failed||r.status>=400).length;if(current.unknownSizes||current.failedRequests||current.externalOrigins.length||current.requests.some(r=>r.method!=='GET')){current.status='needs-review';report.errors.push(pagePath+'/'+name+': incomplete size, failed request, external origin or non-GET');}}
   await step('first-visit',()=>page.goto(origin+'/'+pagePath));
   // Navigate away so Chromium performs a real second navigation, not a reload (which can revalidate cache).
   await page.goto('about:blank');
   await step('repeat-visit',()=>page.goto(origin+'/'+pagePath));
   if(pagePath==='index.html')await step('calculator-synthetic',async()=>{await page.locator('#chooseGrowth').click();await page.locator('#onboardStart').fill('1000');await page.locator('#onboardMonthly').fill('500');await page.locator('#beginJourney').click();await page.locator('#savingsResult').waitFor({state:'visible'});await page.locator('#monthly').fill('750');await page.locator('#monthly').press('Tab');await page.waitForTimeout(800);});
   if(pagePath==='spor.html')await step('search-synthetic',async()=>{await page.locator('#question').fill('Hva er BSU?');await page.locator('#questionForm button[type=submit]').click();await page.locator('#answerPanel').waitFor({state:'visible'});await page.getByRole('heading',{name:'Hva er BSU?',exact:true}).waitFor({state:'visible'});});
   await context.close();
  }
  report.status=report.errors.length?'needs-review':'complete';
 }catch(e){report.errors.push(e.message);report.status='incomplete';}
 finally{clearTimeout(watchdog);if(browser)await browser.close().catch(()=>{});if(server)await new Promise(r=>server.close(r));fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');}
 console.log(JSON.stringify({status:report.status,file,steps:report.steps.map(({page,name,encodedResponseBytes,requestCount,cacheResponses,status})=>({page,name,encodedResponseBytes,requestCount,cacheResponses,status})),errors:report.errors},null,2));
 if(report.status!=='complete')process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1;});
