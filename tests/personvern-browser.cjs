// Personvern i ekte nettleser: hva som lagres og når, sletting, og at slettede planer ikke kommer tilbake fra en annen fane.
// Bruker bare oppdiktede tall. Ingen forespørsler til andre domener er tillatt.
const {chromium,firefox,webkit}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const engine=process.env.SPARE_ENGINE||'chromium',browserType={chromium,firefox,webkit}[engine];
 assert(browserType,'Unknown test browser');
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 let browser;const errors=[],external=[];
 try{
  browser=await browserType.launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})}:{})});
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const open=async(url)=>{const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(!r.url().startsWith(origin))external.push(r.url());});p.on('dialog',d=>d.accept());await p.goto(origin+url);return p;};
  const keys=p=>p.evaluate(()=>{const own=s=>Object.keys(s).filter(k=>k.startsWith('sv-')).sort();return {local:own(localStorage),session:own(sessionStorage)};});

  // 1. Første besøk og delt lenke: ingenting lagres ved lasting.
  const first=await open('/index.html');
  assert.deepEqual(await keys(first),{local:[],session:[]},'første besøk lagrer ingenting');
  await first.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
  assert.deepEqual(await keys(first),{local:[],session:[]},'pagehide uten tur til veilederen lagrer ingenting');
  await first.goto(origin+'/index.html#start=500&monthly=100&years=3');await first.reload();
  assert(await first.locator('#workbench').isVisible(),'delt lenke åpner planen');
  assert.deepEqual(await keys(first),{local:[],session:[]},'delt lenke lagrer ingenting');
  // «Start på nytt» kan avbrytes tilbake til den delte planen, uten tap av tall og uten ny lagring.
  const planBefore=await first.evaluate(()=>JSON.stringify(s));
  await first.evaluate(()=>document.getElementById('startAgain').click());
  await first.locator('#closeJourney').click();
  assert.equal(await first.evaluate(()=>JSON.stringify(s)),planBefore,'tallene er uendret etter avbrutt «Start på nytt»');
  assert(await first.locator('#workbench').isVisible());
  assert.deepEqual(await keys(first),{local:[],session:[]},'avbrutt «Start på nytt» lagrer ingenting');
  await first.close();

  // 2. Start: bare fanen husker det. Standardnivået lagres ikke.
  const page=await open('/index.html');
  await page.locator('#chooseGrowth').click();await page.locator('#onboardStart').fill('1000');await page.locator('#beginJourney').click();
  assert.deepEqual(await keys(page),{local:[],session:['sv-started']});
  // 3. Eget nivåvalg lagres. Automatisk tilbakestilling gjennom startguiden fjerner det.
  await page.evaluate(()=>document.querySelector('#levels [data-level=advanced]').click());
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('sv-level')),'advanced');assert.equal(await page.evaluate(()=>localStorage.getItem('sv-level')),null,'nivå skal ikke i permanent lagring');
  await page.evaluate(()=>document.getElementById('startAgain').click());await page.locator('#chooseGrowth').click();await page.locator('#exampleJourney').click();
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('sv-level')),null,'automatisk «Enkel» skal ikke lagres og fjerner gammelt valg');
  assert.equal(await page.evaluate(()=>level),'simple');

  // 4. Lagre en plan, åpne en fane til, slett fra personvernsiden.
  const savePlan=async(p,name)=>{await p.evaluate(()=>document.getElementById('save').click());await p.locator('#scenarioName').fill(name);await p.locator('#saveForm button[type=submit]').click();};
  await savePlan(page,'Test A');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('sv-scenarios')).length),1);
  const other=await open('/index.html');
  assert.equal(await other.evaluate(()=>saved.length),1,'andre fane ser planen');
  const privacy=await open('/personvern.html');
  assert(await privacy.locator('#deleteAll').isVisible());
  await privacy.locator('#deleteAll').click();
  await privacy.locator('#deleteStatus').filter({hasText:'Slettet'}).waitFor();
  assert.deepEqual((await keys(privacy)).local,[],'egne permanente nøkler er slettet');
  // Andre fane får beskjed og skriver ikke de slettede planene tilbake.
  await other.waitForFunction(()=>saved.length===0);
  await savePlan(other,'Test B');
  const after=await other.evaluate(()=>JSON.parse(localStorage.getItem('sv-scenarios')).map(x=>x.name));
  assert.deepEqual(after,['Test B'],'slettet plan kom ikke tilbake fra en annen fane');

  // 5. Tur til veilederen: arbeidsplan og kontekst opprettes, uten beløp i konteksten.
  await other.evaluate(()=>document.querySelector('a[href="spor.html"]').click());await other.waitForURL(/spor\.html/);
  const s=await keys(other);assert(s.session.includes('sv-working-plan-v1')&&s.session.includes('sv-guidance-tab-v2'));
  assert(!/"(start|monthly)"/.test(await other.evaluate(()=>sessionStorage.getItem('sv-guidance-tab-v2'))),'veilederkonteksten har ikke beløp');

  // 5b. Blokkert lagring: personvernsiden sier det rett ut og viser ingen sletteknapp.
  const blockedCtx=await browser.newContext();
  await blockedCtx.addInitScript(()=>{for(const name of ['localStorage','sessionStorage'])Object.defineProperty(window,name,{get(){throw new DOMException('blocked','SecurityError');}});});
  const blockedPage=await blockedCtx.newPage();blockedPage.on('pageerror',e=>errors.push(e.message));await blockedPage.goto(origin+'/personvern.html');
  assert(await blockedPage.locator('#deleteAll').isHidden());
  assert.match(await blockedPage.locator('#deleteSummary').innerText(),/ikke Spareverksted tilgang til lagring/);
  await blockedCtx.close();

  // 6. Ingen informasjonskapsler og ingen forespørsler til andre domener.
  assert.deepEqual(await context.cookies(),[],'ingen informasjonskapsler');
  assert.deepEqual(external,[],'ingen forespørsler til andre domener');
  assert.deepEqual(errors,[]);
  console.log(engine+': personvern passed: nothing stored on load or shared link, level stored only by own choice, delete clears own keys, other tab does not restore deleted plans, no cookies, no external requests.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
