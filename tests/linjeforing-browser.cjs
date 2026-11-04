// Linjeføring mellom sparekalkulatoren og lånekalkulatoren (Lars 4.11.2026: «Viktig å få ting på linje»).
// Fanene (Sparing, Sparemål, Uttak, Lån) skal stå likt på pikselen på begge sider, også når «Lån» er en lenke og resten knapper.
// «Ny beregning» og ingressen skal ha samme plass og stil. «Ny beregning» på lånesiden går ned til tallene med fokus på lånebeløpet.
// Dette er Chromium. Det erstatter ikke kontroll på iPhone.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 let browser;const errors=[];
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  const measure=(id)=>{const nav=document.querySelector('.page-nav'),nr=nav.getBoundingClientRect(),h1=document.getElementById('pageTitle').getBoundingClientRect();
   const tabs=[...nav.children].map(e=>{const r=e.getBoundingClientRect(),cs=getComputedStyle(e),t=document.createRange();t.selectNodeContents(e);const tr=t.getBoundingClientRect();return [Math.round(r.left),Math.round(r.width),Math.round(r.top-nr.top),Math.round(r.height),cs.fontSize,cs.fontWeight,Math.round(tr.left),Math.round(tr.top-nr.top)].join('/');});
   const b=document.getElementById(id),br=b.getBoundingClientRect(),bs=getComputedStyle(b),intro=getComputedStyle(document.getElementById('introText'));
   return {tabs,nav:Math.round(nr.top-h1.top),newCalc:[Math.round(br.left),Math.round(br.top-h1.top),Math.round(br.width),Math.round(br.height),bs.fontSize,bs.color].join('/'),intro:[intro.fontSize,intro.lineHeight,intro.color].join('/')};};
  for(const [w,h] of [[320,700],[390,844],[430,932],[600,800],[761,800],[1024,768],[1280,900],[1600,900],[844,390]]){
   const got={};
   for(const [name,url,id] of [['sparing','/index.html#start=1000&monthly=1000&years=10','startAgain'],['lån','/laan.html','newLoan']]){
    const p=await browser.newPage({viewport:{width:w,height:h}});p.on('pageerror',e=>errors.push(e.message));
    await p.goto(origin+url);if(url.includes('#'))await p.reload();await p.waitForTimeout(150);
    got[name]=await p.evaluate(measure,id);
    assert.equal(new Set(got[name].tabs.map(t=>t.split('/').slice(2).filter((_,i)=>i!==4).join('/'))).size,1,`${w}x${h} ${name}: fanene står ikke på linje: ${got[name].tabs.join(' ')}`);
    await p.close();}
   assert.deepEqual(got['lån'],got.sparing,`${w}x${h}: sparesiden og lånesiden skal ha like faner, ingress og «Ny beregning»`);
  }
  const p=await browser.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errors.push(e.message));
  await p.goto(origin+'/laan.html');await p.click('#newLoan');await p.waitForTimeout(400);
  assert.equal(await p.evaluate(()=>document.activeElement.id),'amount','«Ny beregning» gir fokus på lånebeløpet');
  assert.ok(await p.evaluate(()=>{const r=document.getElementById('loanInputs').getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;}),'tallene er synlige etter «Ny beregning»');
  assert.deepEqual(errors,[]);
  console.log('linjeføring sparing og lån (faner, ingress, Ny beregning): OK');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
