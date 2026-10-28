// Delingslenker: hver del deler bare sine egne felt, private felt er aldri med,
// en delt plan gir samme resultat når den åpnes, og gamle, fulle lenker virker som før.
const {chromium,firefox,webkit}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const engines={chromium,firefox,webkit};
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(file,(e,d)=>{if(e){res.writeHead(404);return res.end();}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(d);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const engine=engines[process.env.SPARE_ENGINE||'chromium'];let browser;
 try{
  browser=await engine.launch({headless:true});
  // En gammel lenke med verdier i alle deler, også private felt som skal avvises av delingen.
  const OLD='start=123000&monthly=4100&years=17&rate=6.3&inflation=2.1&fee=0.4&extra=9000&extraYear=4'
   +'&withdraw=31000&retireYears=21&annualWithdraw=30000&withdrawMode=amount&taxEnabled=1&taxRate=30'
   +'&dreamCost=410000&dreamStart=12000&dreamYears=6&dreamMonthly=3500&dreamSafe=3.1&userAge=44&riskChosen=1';
  const PRIVATE=['userAge','ageKnown','until67','riskChosen','stress','ageGroup','purpose'];
  const pages={
   calculator:{button:'calculatorPage',result:p=>p.locator('#total').innerText(),
    ok:k=>!k.startsWith('dream')&&!/^(withdraw|extraWithdraw|annualWithdraw|retireYears|tax)/.test(k)},
   dreams:{button:'dreamPage',result:p=>p.locator('#dreamPanel').innerText(),
    ok:k=>k.startsWith('dream')},
   withdrawals:{button:'withdrawalPage',result:p=>p.locator('#withdrawalPanel').innerText(),
    ok:k=>!k.startsWith('dream')}
  };
  const VIEW=new Set(['activePage','level','mode','showBank','showRange','showGoal','both']);
  for(const [name,cfg] of Object.entries(pages)){
   const ctx=await browser.newContext({viewport:{width:390,height:844}});
   const a=await ctx.newPage();await a.goto(origin+'/index.html#'+OLD+'&activePage='+name);await a.waitForTimeout(400);
   await a.evaluate(id=>document.getElementById(id).click(),cfg.button);await a.waitForTimeout(300);
   const before=(await cfg.result(a)).replace(/\s+/g,' ');
   await a.evaluate(()=>document.getElementById('share').click());await a.waitForTimeout(150);
   const url=await a.inputValue('#shareUrl');const prm=new URLSearchParams(url.split('#')[1]);
   assert.equal(prm.get('activePage'),name,name+': activePage mangler');
   for(const k of PRIVATE)assert.equal(prm.has(k),false,name+': privat felt i lenken: '+k);
   for(const k of prm.keys())if(!VIEW.has(k))assert(cfg.ok(k),name+': felt fra en annen del i lenken: '+k);
   // Ny fane med den nye, kortere lenken gir samme resultat som den gamle, fulle lenken.
   const b=await ctx.newPage();await b.goto(url);await b.waitForTimeout(400);
   await b.evaluate(id=>document.getElementById(id).click(),cfg.button);await b.waitForTimeout(300);
   const after=(await cfg.result(b)).replace(/\s+/g,' ');
   assert.equal(after,before,name+': resultatet endret seg via delt lenke');
   // Å åpne lenken lagrer ingenting.
   assert.deepEqual(await b.evaluate(()=>[Object.keys(localStorage),Object.keys(sessionStorage)]),[[],[]],name+': åpning lagret noe');
   await ctx.close();
  }
  // En vanlig lenke til nettstedet har ingen tall.
  const ctx=await browser.newContext();const p=await ctx.newPage();await p.goto(origin+'/index.html');
  assert.equal(await p.evaluate(()=>location.hash),'','vanlig lenke har tall');await ctx.close();
  console.log('Deling ('+(process.env.SPARE_ENGINE||'chromium')+'): bare egne felt per del, ingen private felt, samme resultat, gamle lenker virker, ingen lagring ved åpning.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
