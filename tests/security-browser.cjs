// Verify browser enforcement, rather than just the presence of a meta element.
const {chromium,firefox,webkit}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'../dist'),engine=process.env.SPARE_ENGINE||'chromium';
 const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
  try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const origin='http://127.0.0.1:'+server.address().port;
 try{
  browser=await {chromium,firefox,webkit}[engine].launch({headless:true});
  const context=await browser.newContext();
  await context.addInitScript(()=>{window.__violations=[];document.addEventListener('securitypolicyviolation',e=>window.__violations.push(e.effectiveDirective));});
  const p=await context.newPage(),requests=[];
  p.on('request',r=>requests.push(r.url()));
  for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.html'))){
   await p.goto(origin+'/'+file);await p.waitForLoadState('networkidle');
   assert.deepEqual(await p.evaluate(()=>window.__violations),[],file+' normal load');
   await p.evaluate(()=>{
    const s=document.createElement('script');s.textContent='window.__inlineExecuted=true';document.body.append(s);
    const b=document.createElement('button');b.setAttribute('onclick','window.__handlerExecuted=true');document.body.append(b);b.click();
    const f=document.createElement('form');f.action='/security-must-not-submit';document.body.append(f);f.submit();
   });
   await p.waitForFunction(()=>window.__violations.length>=3);
   assert.deepEqual(await p.evaluate(()=>[!!window.__inlineExecuted,!!window.__handlerExecuted]),[false,false]);
   assert(!requests.some(u=>u.includes('security-must-not-submit')),'form request blocked');
  }
  console.log(engine+': CSP blocks inline script, event handlers and native form submission on every page.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
