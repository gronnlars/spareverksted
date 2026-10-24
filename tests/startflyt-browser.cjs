// Startflyt og inndata (fase 2, PR 2): risikovalget, forklaring av startverdier, tomme felt under redigering
// og negativ avkastning. Krever playwright. SPARE_BROWSER kan peke på en Chromium.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}try{const d=fs.readFileSync(f);res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(d);}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  const open=async(hash='',width=375)=>{const c=await browser.newContext({viewport:{width,height:740},isMobile:width<500,hasTouch:width<500});const p=await c.newPage();p.errors=[];p.on('pageerror',e=>p.errors.push(e.message));p.setDefaultTimeout(10000);await p.goto(origin+hash);return p;};
  const click=(p,id)=>p.evaluate(i=>document.getElementById(i).click(),id);
  const text=(p,sel)=>p.locator(sel).innerText();

  // 1. Startflyten spør ikke om risiko, og linjen under overskriften gjentar ikke et risikovalg.
  let p=await open();
  await p.locator('#chooseGrowth').click();
  assert.equal(await p.locator('#onboardRisk').count(),0,'risikospørsmålet er flyttet ut av startflyten');
  await p.locator('#onboardAge').fill('40');await p.locator('#beginJourney').click();
  assert.match(await text(p,'#planContext'),/^Du er 40 år\./);assert.doesNotMatch(await text(p,'#planContext'),/uro|svingninger/);
  // Startguiden gir brukerens egne beløp, men vekst, prisvekst og kostnad er fortsatt forhåndsutfylt.
  let note=await text(p,'#startNote');
  assert.doesNotMatch(note,/eksempeltall/,'tall fra startguiden er brukerens egne');
  assert.equal(note,'Vekst, prisvekst og kostnad er forhåndsutfylt, ikke anbefalt eller beregnet fra svarene dine. På sparekonto: velg renten du vil regne med gjennom hele perioden, og 0 % kostnad.');

  // 2. Risikovalget endrer aldri beregningen, og gjentas ikke under overskriften.
  const total=await text(p,'#total');
  await p.evaluate(()=>setLevel('explore'));
  for(const v of ['low','medium','high']){await p.evaluate(v=>{const el=document.getElementById('stress');for(let d=el.closest('details');d;d=d.parentElement?.closest('details'))d.open=true;},v);await p.locator('#stress').selectOption(v);
   assert.equal(await text(p,'#total'),total,'risikovalg '+v+' endrer ikke resultatet');assert.equal(await p.evaluate(()=>s.rate),5);assert.doesNotMatch(await text(p,'#planContext'),/uro|svingninger/);}
  assert.equal(await p.evaluate(()=>[s.riskChosen,s.stress].join()),'true,high','valget lagres fortsatt for sparemål og veileder');
  // «Lite uro» har fortsatt sin funksjon: et tips i kalkulatoren.
  await p.locator('#stress').selectOption('low');assert.match(await p.evaluate(()=>document.getElementById('tips').textContent),/Du ønsker lite uro/);

  // 3. Eksempel: forklaringen sier at beløp og tid er eksempeltall, til brukeren endrer ett av dem.
  p=await open();await p.locator('#chooseGrowth').click();await p.locator('#exampleJourney').click();
  note=await text(p,'#startNote');assert.match(note,/^Beløp og tid er eksempeltall\. Vekst, prisvekst og kostnad er forhåndsutfylt/);
  assert(await p.locator('#startNote').isVisible(),'forklaringen vises også i enkel visning');
  await p.locator('#monthly').fill('1500');note=await text(p,'#startNote');assert.doesNotMatch(note,/eksempeltall/);assert.match(note,/^Vekst, prisvekst/);
  // Når en forutsetning endres, nevnes bare de som fortsatt står på startverdien.
  await p.locator('#rate').fill('6');note=await text(p,'#startNote');assert.match(note,/^Prisvekst og kostnad er forhåndsutfylt/);assert.match(note,/0 % kostnad/,'kostnaden er fortsatt forhåndsutfylt');
  await p.evaluate(()=>{document.getElementById('essentials').open=true});await p.locator('#inflation').fill('3');await p.locator('#fee').fill('0,5');
  assert(await p.locator('#startNote').isHidden(),'ingen forklaring når alle tall er brukerens egne');
  await click(p,'reset');assert.match(await text(p,'#startNote'),/^Beløp og tid er eksempeltall/,'Nullstill gir eksempel igjen');
  // Delt lenke: brukerens egne tall, ingen eksempeltekst.
  p=await open('#activePage=calculator&start=0&monthly=2000&years=10&rate=7');
  assert.match(await text(p,'#startNote'),/^Prisvekst og kostnad er forhåndsutfylt/);

  // 4. Tomt felt under redigering: ingen 0 kr, ingen feilmelding, siste resultat står dempet med en rolig merknad.
  p=await open();await p.locator('#chooseGrowth').click();await p.locator('#exampleJourney').click();
  const before=await text(p,'#total');
  await p.locator('#monthly').fill('');
  assert.equal(await text(p,'#total'),before,'siste gyldige resultat står igjen');assert.notEqual(await text(p,'#total'),'0 kr');
  assert(await p.locator('#error').isHidden(),'ingen feilmelding mens feltet redigeres');assert.notEqual(await p.locator('#monthly').getAttribute('aria-invalid'),'true');
  assert(await p.evaluate(()=>document.getElementById('main').classList.contains('stale')),'resultatet er dempet');
  assert.equal(await text(p,'#pendingNote'),'Resultatet er ikke oppdatert. Fyll inn et tall.');
  assert.match(await p.locator('#monthly').getAttribute('aria-describedby'),/pendingNote/);
  assert(await p.evaluate(()=>document.querySelector('.mobile-summary').classList.contains('stale')),'mobillinjen er også dempet');
  assert.equal(await p.locator('#monthlySliderNote').isVisible(),false,'skyveknappen viser ikke «ugyldig» mens feltet redigeres');
  assert.equal(await p.evaluate(()=>document.activeElement.id),'monthly','fokus blir i feltet');
  // Lagring og deling er sperret mens feltet er tomt.
  await click(p,'share');assert(!await p.evaluate(()=>document.getElementById('shareDialog').open),'tomt felt kan ikke deles');
  // Fyll inn igjen: oppdateres som vanlig.
  await p.locator('#monthly').fill('3000');assert.notEqual(await text(p,'#total'),before);assert(await p.locator('#pendingNote').isHidden());
  assert(!await p.evaluate(()=>document.getElementById('main').classList.contains('stale')));
  // Forlater feltet tomt: konkret feilmelding, feltet markeres, ingen 0 skrives inn.
  await p.locator('#monthly').fill('');await p.locator('#years').focus();await p.waitForTimeout(50);
  assert.equal(await p.locator('#monthly').inputValue(),'','feltet fylles ikke med 0');
  assert(await p.locator('#error').isVisible());assert.match(await text(p,'#error'),/Fyll inn et gyldig tall i «Du sparer hver måned»\./);
  assert.equal(await p.locator('#monthly').getAttribute('aria-invalid'),'true');assert(await p.locator('#pendingNote').isHidden());
  assert.notEqual(await text(p,'#total'),'0 kr');
  await p.locator('#monthly').fill('2 000');assert(await p.locator('#error').isHidden());assert.match(await text(p,'#total'),/kr$/);
  // Et minustegn alene er også uferdig inntasting.
  const atRate=await text(p,'#total');await p.locator('#rate').fill('-');
  assert(await p.locator('#error').isHidden());assert.equal(await text(p,'#total'),atRate);assert(await p.locator('#pendingNote').isVisible());assert.match(await p.locator('#rate').getAttribute('aria-describedby'),/pendingNote/);
  await p.locator('#rate').fill('-2');assert(await p.locator('#error').isHidden());assert.notEqual(await text(p,'#total'),atRate);
  assert.equal(await p.evaluate(()=>s.rate),-2);assert.equal(await p.locator('#rate').inputValue(),'-2','feltet skrives ikke om mens brukeren skriver');

  // 5. Tall bevares ved bytte av visning, også negativ avkastning.
  for(const level of ['explore','advanced','simple']){await p.evaluate(l=>setLevel(l),level);assert.equal(await p.evaluate(()=>s.rate),-2,level);assert.equal(await p.evaluate(()=>s.monthly),2000,level);}

  // 6. Sparemål: tomt felt tømmer ikke alternativene mens brukeren skriver.
  await click(p,'dreamPage');await p.waitForTimeout(100);
  const cards=await p.locator('#dreamCards .route-card').count();assert.ok(cards>0);
  await p.locator('#dreamMonthly').fill('');
  assert.equal(await p.locator('#dreamCards .route-card').count(),cards,'kortene står igjen');assert(await p.locator('#dreamError').isHidden());
  assert(await p.evaluate(()=>document.getElementById('dreamPanel').classList.contains('stale')));
  await p.locator('#dreamMonthly').fill('2500');assert(!await p.evaluate(()=>document.getElementById('dreamPanel').classList.contains('stale')));

  // 7. «Start på nytt»: startguiden begynner fra standardverdiene. «Tilbake til planen» endrer ingenting.
  //    Går brukeren videre, nullstilles hele planen, også skjulte valg, og det kan angres.
  p=await open('#activePage=calculator&start=800&monthly=2000&years=57&rate=7&crash=30&crashYear=5&extra=50000&extraYear=3&savingsType=index&showRange=1',1280);
  const kept=await p.evaluate(()=>JSON.stringify(s));
  await p.evaluate(()=>document.getElementById('startAgain').click());await p.locator('#chooseGrowth').click();
  assert.equal(await p.locator('#onboardStart').inputValue(),'0');assert.equal(await p.locator('#onboardYears').inputValue(),'10');assert.equal(await p.locator('#onboardAge').inputValue(),'');
  await p.locator('#closeJourney').click();assert.equal(await p.evaluate(()=>JSON.stringify(s)),kept,'«Tilbake til planen» endrer ingenting');
  await p.evaluate(()=>document.getElementById('startAgain').click());await p.locator('#chooseGrowth').click();await p.locator('#exampleJourney').click();
  assert.deepEqual(await p.evaluate(()=>[s.start,s.monthly,s.years,s.rate,s.crash,s.extra,s.savingsType,view.showRange]),[0,2000,10,5,0,0,'',false],'hele planen er nullstilt');
  assert.equal(await p.locator('#undoText').innerText(),'Planen er nullstilt.');assert.equal(await p.evaluate(()=>location.hash),'');
  await p.locator('#undo').click();assert.equal(await p.evaluate(()=>JSON.stringify(s)),kept,'kan angres');
  // Fra startguiden med egne tall: det gamle børsfallet og spareformen følger ikke med.
  await p.evaluate(()=>document.getElementById('startAgain').click());await p.locator('#chooseGrowth').click();await p.locator('#onboardMonthly').fill('3000');await p.locator('#beginJourney').click();
  assert.deepEqual(await p.evaluate(()=>[s.monthly,s.crash,s.extra,s.savingsType,s.rate]),[3000,0,0,'',5]);
  assert.deepEqual(p.errors,[]);
  for(const pg of [p])assert.deepEqual(pg.errors,[]);
  console.log('Passed: start flow, start values note, empty fields while typing, negative return.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
