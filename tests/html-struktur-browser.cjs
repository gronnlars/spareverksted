// HTML-struktur etter at skriptene har bygget siden (Chromium).
// Vokter funnene fra Nu HTML-validatoren 28.10.2026, som bare så på den ferdige siden:
// - En <label> skal ha høyst ett skjemafelt eller én knapp, og ikke blokkelementer som <div> eller <p>.
// - Overskrifter skal ikke være tomme, heller ikke før skriptet har fylt dem.
// - <section> skal ha en overskrift eller aria-label. En navnløs <section> er ikke et landemerke, så da brukes <div>.
// - aria-label skal ikke stå på <div> eller <span> uten rolle.
// Dette erstatter ikke en kjøring i Nu HTML-validatoren. Det fanger de feilene vi har rettet.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 let browser;const problems=[];const errors=[];
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  const check=p=>p.evaluate(()=>{
   const out=[],labelable='button,input:not([type=hidden]),meter,output,progress,select,textarea';
   const sel=e=>e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(e.htmlFor?'[for='+e.htmlFor+']':'');
   for(const l of document.querySelectorAll('label')){
    const ctrls=l.querySelectorAll(labelable);
    if(ctrls.length>1)out.push(sel(l)+' har '+ctrls.length+' skjemafelt eller knapper');
    if(l.htmlFor)for(const c of ctrls)if(c.id!==l.htmlFor)out.push(sel(l)+' inneholder '+sel(c)+' som den ikke peker på');
    if(l.querySelector('div,p,details,section,ul,ol,table,h1,h2,h3,h4,h5,h6'))out.push(sel(l)+' inneholder blokkelement');
   }
   for(const h of document.querySelectorAll('h1,h2,h3,h4,h5,h6'))if(!h.textContent.trim()&&!h.querySelector('img[alt]:not([alt=""])'))out.push('tom overskrift '+sel(h));
   for(const s of document.querySelectorAll('section:not([aria-label])')){const h=[...s.querySelectorAll('h1,h2,h3,h4,h5,h6')].some(x=>x.closest('section,article,aside,nav')===s);if(!h)out.push('section uten overskrift '+sel(s));}
   for(const e of document.querySelectorAll('div[aria-label],span[aria-label],div[aria-labelledby],span[aria-labelledby],p[aria-label]'))if(!e.getAttribute('role'))out.push('aria-label uten rolle '+sel(e));
   return out;});
  const ctx=await browser.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
  const look=async name=>{for(const x of await check(p))problems.push(name+': '+x);};
  await p.goto(origin+'/index.html');await p.evaluate(()=>{localStorage.clear();sessionStorage.clear();});await p.reload();await look('start');
  await p.goto(origin+'/index.html#start=12000&monthly=4000&years=22&level=advanced');await p.reload();
  for(const page of ['calculatorPage','dreamPage','withdrawalPage']){await p.locator('#'+page).click();await p.evaluate(()=>{for(const d of document.querySelectorAll('main details'))d.open=true;});await look(page);}
  await p.locator('#calculatorPage').click();
  await p.locator('#start').fill('abc');await p.locator('#start').blur();await look('ugyldig felt');
  for(const f of ['spor','om','personvern','tilgjengelighet']){await p.goto(origin+'/'+f+'.html');await p.evaluate(()=>{for(const d of document.querySelectorAll('main details'))d.open=true;});await look(f);}
  await p.goto(origin+'/spor.html');await p.evaluate(()=>{for(const d of document.querySelectorAll('main details'))d.open=true;});await p.locator('[data-topic]:visible').first().click();await look('spor med svar');
  assert.deepEqual(errors,[],'JavaScript errors');
  assert.deepEqual(problems,[],'HTML structure');
  console.log('Browser (Chromium): labels hold one control each, no empty headings, no unnamed sections, no aria-label on generic elements.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
