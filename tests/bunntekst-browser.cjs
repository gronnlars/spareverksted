// Bunnteksten er et eget landemerke etter <main> (3.11.2026, funn i Frontkit-sjekk).
// Før lå <footer> inni <main>. Da ble den ikke et «contentinfo»-landemerke, og hovedinnholdet inkluderte bunnteksten.
// Testen kontrollerer at hver side har én bunntekst rett etter main, at den har rollen contentinfo,
// at kantene står likt med innholdet i main ved mange skjermstørrelser, og at siden ikke får vannrett rulling.
// Kontrollerer også at valgknappene på startsiden har korte navn med beskrivelse for seg (ikke tittel og forklaring i ett).
// Dette er Chromium. Det erstatter ikke kontroll med VoiceOver eller NVDA.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const pages=fs.readdirSync(root).filter(f=>f.endsWith('.html')&&f!=='404.html');
 for(const f of pages){const s=fs.readFileSync(path.join(root,f),'utf8');
  assert.equal((s.match(/<footer\b/g)||[]).length,1,f+': én bunntekst');
  assert.ok(/<\/main>\s*<footer\b/.test(s),f+': <footer> skal stå rett etter </main>');}
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 let browser;const errors=[];
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  const urls=['/index.html','/index.html#start=1000&monthly=1000&years=10',...pages.filter(f=>f!=='index.html').map(f=>'/'+f)];
  for(const [w,h] of [[320,640],[390,844],[700,800],[1024,768],[1440,900],[900,280]])for(const u of urls){
   const p=await browser.newPage({viewport:{width:w,height:h}});p.on('pageerror',e=>errors.push(e.message));
   await p.goto(origin+u);if(u.includes('#'))await p.reload();await p.waitForTimeout(150);
   const r=await p.evaluate(()=>{const m=document.querySelector('main'),f=document.querySelector('body>footer'),cs=getComputedStyle(m),mr=m.getBoundingClientRect(),fr=f.getBoundingClientRect();
    return {ml:Math.round(mr.left+parseFloat(cs.paddingLeft)),mr:Math.round(mr.right-parseFloat(cs.paddingRight)),fl:Math.round(fr.left),fr:Math.round(fr.right),scroll:document.documentElement.scrollWidth>innerWidth};});
   assert.equal(r.fl,r.ml,`${w}x${h} ${u}: venstre kant`);assert.equal(r.fr,r.mr,`${w}x${h} ${u}: høyre kant`);assert.equal(r.scroll,false,`${w}x${h} ${u}: vannrett rulling`);
   if(w===390){const snap=await p.locator('body').ariaSnapshot();assert.match(snap,/^- contentinfo:/m,u+': contentinfo-landemerke');}
   await p.close();}
  const p=await browser.newPage();await p.goto(origin+'/index.html');await p.evaluate(()=>{localStorage.clear();sessionStorage.clear();});await p.reload();
  for(const [id,name] of [['chooseGrowth','Hvor mye kan pengene vokse?'],['chooseGoal','Jeg har et sparemål'],['chooseWithdraw','Hvor lenge varer pengene?']]){
   await assert.doesNotReject(p.getByRole('button',{name,exact:true}).waitFor(),id+': kort navn');
   assert.ok((await p.locator('#'+id).getAttribute('aria-describedby')).length>0,id+': beskrivelse');}
  assert.deepEqual(errors,[]);
  console.log('bunntekst som eget landemerke og korte navn på startvalgene: OK');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
