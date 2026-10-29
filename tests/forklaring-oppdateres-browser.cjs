// «Dette betyr tallene dine» skal ikke bli stående med gamle tall når brukeren skriver uten å forlate feltet.
// Funnet i Safari Reader 29.10.2026: lesemodus viste eksempeltallene (240 000 kr innskudd) under et nytt hovedtall.
// Kontrollerer også at resultatradene er en beskrivelsesliste, og at resultat og
// forklaring ligger samlet i én <article>. SPARE_ENGINE velger chromium, firefox eller webkit.
const {chromium,firefox,webkit}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const engine=process.env.SPARE_ENGINE||'chromium',browserType={chromium,firefox,webkit}[engine];
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}try{const d=fs.readFileSync(f);res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(d);}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;
 try{
  browser=await browserType.launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})}:{})});
  const p=await (await browser.newContext({viewport:{width:390,height:844}})).newPage();p.setDefaultTimeout(10000);
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(origin);
  // Gjennom startguiden uten å endre noe, slik en mobilbruker kommer til feltene.
  await p.locator('#chooseGrowth').click();await p.locator('#beginJourney').click();
  const details=()=>p.locator('#meaningDetails').textContent();
  assert.match(await details(),/Du\ssetter\sinn\s240\s000\skr/,'starting point is the example plan');
  await p.locator('#monthly').fill('10000');
  assert.match(await p.locator('#total').innerText(),/1\s527\s171/,'main figure follows typing at once');
  assert(await p.evaluate(()=>document.getElementById('meaning').classList.contains('meaning-waiting')),'explanation is marked as waiting while typing');
  // Ingen blur: forklaringen skal likevel oppdateres etter en kort pause.
  await p.waitForFunction(()=>!document.getElementById('meaning').classList.contains('meaning-waiting'),null,{timeout:3000});
  assert.equal(await p.evaluate(()=>document.activeElement.id),'monthly','focus is still in the field');
  assert.match(await details(),/Du\ssetter\sinn\s1\s200\s000\skr/,'explanation matches the new plan without leaving the field');
  assert.doesNotMatch(await details(),/240\s000/,'no stale example figures remain');
  // Ugyldig verdi: forklaringen skal ikke beregnes på nytt, men forbli markert som utdatert.
  await p.locator('#years').fill('500');await p.waitForTimeout(900);
  assert(await p.evaluate(()=>document.getElementById('main').classList.contains('stale')),'invalid input marks results as stale');
  await p.locator('#years').fill('10');await p.waitForTimeout(900);
  assert.match(await details(),/Du\ssetter\sinn\s1\s200\s000\skr/);
  // Etikett og beløp er en beskrivelsesliste (dt/dd), slik at de holdes adskilt også uten stilark
  // (lesemodus, egne stilark, skjermleser). Samme prinsipp som grafforklaringen 28.10.2026.
  const pairs=await p.evaluate(()=>[...document.querySelectorAll('#savingsResult dl.metrics>div')].map(d=>[d.querySelector('dt')?.textContent.trim(),d.querySelector('dd strong')?.textContent.trim()]));
  assert(pairs.length>=2,'result rows are dt/dd pairs');
  assert.deepEqual(pairs[0][0],'Du setter inn');assert.match(pairs[0][1],/^1\s200\s000\skr$/);
  assert(pairs.every(([k,v])=>k&&v),'every label has a value');
  // Resultat og forklaring i samme <article>, grafen utenfor.
  assert.equal(await p.evaluate(()=>{const a=document.querySelector('article.result-article');return !!a&&a.contains(document.getElementById('savingsResult'))&&a.contains(document.getElementById('meaning'))&&!a.contains(document.getElementById('chartPanel'));}),true);
  assert.deepEqual(errors,[]);
  console.log('forklaring-oppdateres-browser ('+engine+'): ok');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
