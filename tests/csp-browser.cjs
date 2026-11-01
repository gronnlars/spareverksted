// Kjører hele appen med samme hoder som produksjon. Alle brudd mot CSP, JavaScript-feil og eksterne forespørsler feiler testen.
// Krever playwright, som de andre nettlesertestene.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const {headers}=require('../deploy/headers.cjs');
(async()=>{
 const root=path.resolve(__dirname,'../dist'),types={'.js':'text/javascript','.css':'text/css','.html':'text/html; charset=utf-8','.zip':'application/zip'};
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://x').pathname));if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}try{const d=fs.readFileSync(f);res.writeHead(200,{...headers,'Content-Type':types[path.extname(f)]||'text/plain'});res.end(d);}catch{res.writeHead(404,headers);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  const ctx=await browser.newContext({viewport:{width:1280,height:900},acceptDownloads:true});await ctx.grantPermissions(['clipboard-read','clipboard-write'],{origin});
  const p=await ctx.newPage(),problems=[];p.setDefaultTimeout(10000);
  await p.addInitScript(()=>{document.addEventListener('securitypolicyviolation',e=>console.error('CSP '+e.violatedDirective+' '+e.blockedURI+' '+e.sourceFile));});
  p.on('pageerror',e=>problems.push('js: '+e.message));p.on('console',m=>{if(m.type()==='error')problems.push('console: '+m.text());});
  p.on('request',r=>{if(!r.url().startsWith(origin)&&!r.url().startsWith('blob:'))problems.push('external: '+r.url());});
  const click=id=>p.evaluate(i=>document.getElementById(i).click(),id);
  await p.goto(origin+'/index.html');
  await p.locator('#chooseGrowth').click();await p.locator('#beginJourney').click();
  await p.locator('#showRange').check();await p.locator('#showBank').check().catch(()=>{});
  assert(await p.locator('#chartLegend [data-series]').count()>0,'legend rendered');
  assert((await p.locator('#chartLegend span').first().evaluate(e=>e.style.getPropertyValue('--series')))!=='','legend colour must be set through CSSOM');
  await p.locator('summary:has-text("Hva er vanlig")').click();
  const bars=p.locator('.dist-track i[data-width]');await bars.first().waitFor();
  assert(await bars.first().evaluate(e=>e.style.width)!=='','distribution bars must get a width');
  await click('dreamPage');await click('withdrawalPage');await click('calculatorPage');
  await click('share');await p.locator('#copyLink').click();await click('closeDialog');
  await click('reportButton');let dl=null;p.once('download',d=>dl=d);await click('exportCsv');await p.waitForTimeout(400);assert(dl,'CSV download must work under CSP');
  await click('exportXlsx');await p.waitForTimeout(300);
  await p.goto(origin+'/spor.html');await p.locator('#question').fill('Bør jeg spare i barnets navn?');await p.locator('#questionForm button').click();await p.waitForTimeout(400);
  assert.deepEqual(problems,[]);
  console.log('Passed: app runs under the production CSP and security headers with no violations, JS errors or external requests.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
