// Spareform, «Dette betyr tallene dine» og kroner mot kjøpekraft i grafen (fase 2, PR 3). Krever playwright.
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
  const text=(p,sel)=>p.locator(sel).innerText();
  const pages=[];

  let p=await open();pages.push(p);
  await p.locator('#chooseGrowth').click();await p.locator('#exampleJourney').click();
  // 1. Ingen spareform er valgt på brukerens vegne. Seksjonen finnes ved resultatet, uten live-region.
  assert.equal(await p.locator('#savingsTypes [aria-pressed=true]').count(),0);assert(await p.locator('#clearSavingsType').isHidden());
  assert(await p.locator('#meaning').isVisible());assert.equal(await text(p,'#meaningTitle'),'Dette betyr tallene dine');
  assert.equal(await p.evaluate(()=>document.querySelector('#meaning [aria-live],#meaning[aria-live]')),null,'ingen automatisk opplesning');
  assert.match(await text(p,'#meaningMain'),/^Avkastningen er større enn prisveksten/);
  assert.equal(await p.evaluate(()=>{const a=document.querySelector('.hero-result'),b=document.getElementById('meaning');return a.nextElementSibling===b;}),true,'seksjonen står rett etter resultatet');
  const total=await text(p,'#total'),inputs=await p.evaluate(()=>['start','monthly','years','rate','inflation','fee'].map(k=>document.getElementById(k).value));

  // 2. Velg brukskonto: synlige forutsetninger for brukskonto (0 % rente, 0 % kostnad), med melding og angreknapp.
  await p.locator('#savingsTypes [data-type=checking]').click();
  assert.equal(await p.locator('#savingsTypes [data-type=checking]').getAttribute('aria-pressed'),'true');assert(await p.locator('#clearSavingsType').isVisible());
  assert.deepEqual(await p.evaluate(()=>[s.rate,s.fee,document.getElementById('rate').value,document.getElementById('fee').value]),[0,0,'0','0'],'forutsetningene står synlig i feltene');
  assert.match(await text(p,'#total'),/^240\s000 kr$/);assert.equal(await text(p,'#savingsNoteText'),'Rente satt til 0 % og kostnad til 0 %.');assert(await p.locator('#savingsNote').isVisible());assert(await p.locator('#undoBar').isHidden(),'ingen linje over panelet som flytter knappene');
  assert.match(await text(p,'#startNote'),/Renten 0 % er et regneeksempel for brukskonto/);
  assert.match(await text(p,'#meaningMain'),/^Saldoen øker bare fordi du setter inn nye penger\. Pengene kjøper mindre/);
  // Angre gir planen tilbake.
  await p.locator('#savingsUndo').click();assert(await p.locator('#savingsNote').isHidden());assert.equal(await text(p,'#total'),total);assert.equal(await p.evaluate(()=>s.savingsType),'');
  assert.deepEqual(await p.evaluate(()=>['start','monthly','years','rate','inflation','fee'].map(k=>document.getElementById(k).value)),inputs);
  // Sparekonto: gjennomsnittsrenten fra SSB, med kilde og dato i teksten.
  await p.locator('#savingsTypes [data-type=savings]').click();
  assert.deepEqual(await p.evaluate(()=>[s.rate,s.fee]),[2.87,0]);assert.match(await text(p,'#startNote'),/2,87 % er gjennomsnittet for husholdningers innskudd uten binding \(SSB, august 2026\)/);
  assert.match(await text(p,'#meaningMain'),/Renter beskattes hvert år/);
  // Indeksfond: Finans Norge-forutsetning og utfallsrom som avhenger av sparetiden.
  await p.locator('#savingsTypes [data-type=index]').click();assert.equal(await p.locator('#savingsTypes [data-type=savings]').getAttribute('aria-pressed'),'false');
  assert.equal(await p.evaluate(()=>s.rate),7.11,'4,5 % realavkastning pluss 2,5 % prisvekst');assert.equal(await p.evaluate(()=>s.fee),0.2,'et indeksfond arver ikke 0 % kostnad fra en konto; kostnaden er en forhåndsutfylt startverdi');assert.equal(await p.evaluate(()=>view.showRange),true);
  assert.match(await text(p,'#startNote'),/Veksten 7,11 % er 4,5 % forventet realavkastning for aksjer \(Finans Norges prognosestandard, februar 2026\)/);
  assert.match(await text(p,'#meaningMain'),/Et indeksfond kan falle mye i verdi underveis/);assert.doesNotMatch(await text(p,'#meaningMain'),/Med 10 år sparetid/);await p.locator('#meaningMore>summary').click();assert.match(await text(p,'#meaningDetails'),/Med 10 år sparetid/);
  assert.match(await p.locator('#chartNote').innerText(),/95 % utfallsrom etter Finans Norges prognosemodell/);assert.match(await p.locator('#chartLegend').innerText(),/95 % utfallsrom \(modell\)/);assert.equal(await p.locator('#showRange').getAttribute('aria-label'),'Vis utfallsrom (95 %)');
  assert(await p.locator('#fanTuning').isHidden(),'avviket i prosentpoeng brukes ikke for indeksfond');
  // Kortere sparetid gir et bredere utfallsrom (målt som årlig snittavkastning) og kan gi tap.
  const lowShare=()=>p.evaluate(()=>E.band(s,s.years,-1.96,Assumptions.index.sigma)/E.raw({...s,rate:0,fee:0},s.years,0,0));
  await p.locator('#years').fill('3');await p.locator('#years').blur();
  assert.match(await text(p,'#meaningDetails'),/Med 3 år sparetid kan verdien også ende under det du har satt inn/);const short=await lowShare();
  await p.locator('#years').fill('25');await p.locator('#years').blur();const long=await lowShare();
  assert.ok(long>short,`nedre del i forhold til innskuddene er bedre over 25 år (${long.toFixed(2)}) enn over 3 år (${short.toFixed(2)})`);
  // Engangsbeløp over 25 år: nedre del over innskuddet i kroner, men under det målt i dagens kroner.
  await p.locator('#monthly').fill('0');await p.locator('#start').fill('100000');await p.locator('#start').blur();
  assert.match(await text(p,'#meaningDetails'),/Med 25 år sparetid ligger den nedre delen av utfallsrommet over innskuddene i kroner/);
  assert.match(await text(p,'#meaningDetails'),/under det du samlet setter inn, målt i dagens kroner/);
  // Ved båndet: én linje i samme kroneverdi som grafen, bare når båndet vises.
  const note=()=>p.evaluate(()=>{const n=document.getElementById('fanDepositNote');return n.hidden?'':n.textContent;});
  await p.evaluate(()=>{const b=document.getElementById('showRange');if(!b.checked)b.click();});
  assert.match(await note(),/^I kroner ligger den nedre delen av utfallsrommet over innskuddene\. Målt i dagens kroner ligger den under/);
  await p.evaluate(()=>{const b=document.getElementById('showRange');b.click();});assert.equal(await note(),'','Ingen linje uten bånd');
  await p.evaluate(()=>{const b=document.getElementById('showRange');b.click();});
  await p.locator('#start').fill('0');await p.locator('#monthly').fill('2000');await p.locator('#monthly').blur();
  await p.locator('#years').fill('10');await p.locator('#years').blur();
  // Handlingen skjuler og viser båndet uten å endre tallene, og uten å flytte fokus eller scrolle.
  const t2=await text(p,'#total');const action=p.locator('#showRange');await action.scrollIntoViewIfNeeded();const scroll=await p.evaluate(()=>scrollY);await action.click();
  assert.equal(await p.evaluate(()=>view.showRange),false);assert.equal(await text(p,'#total'),t2);assert.equal(await p.evaluate(()=>scrollY),scroll,'ingen automatisk scrolling');
  await p.locator('#showRange').click();assert.equal(await p.evaluate(()=>view.showRange),true);
  // Trykk på valgt knapp igjen fjerner valget uten å endre tallene. «Fjern valget» gjør det samme.
  await p.locator('#savingsTypes [data-type=index]').click();assert.equal(await p.locator('#savingsTypes [aria-pressed=true]').count(),0);assert.equal(await p.evaluate(()=>s.savingsType),'');assert.equal(await p.evaluate(()=>s.rate),7.11,'å fjerne valget endrer ingen tall');
  await p.locator('#savingsTypes [data-type=savings]').click();await p.locator('#clearSavingsType').click();
  assert.equal(await p.evaluate(()=>s.savingsType),'');assert.equal(await p.evaluate(()=>document.activeElement.dataset.type),'checking','fokus går til første valg, ikke til body');
  // Tastatur: knappene kan velges med mellomrom.
  await p.locator('#savingsTypes [data-type=savings]').focus();await p.keyboard.press('Space');assert.equal(await p.evaluate(()=>s.savingsType),'savings');

  // 3. Sparekonto med 8 % og egne tall: saklig forklaring, og lavere rente vises uten å endre tallene.
  await p.locator('#rate').fill('8');await p.locator('#rate').blur();
  await p.evaluate(()=>{document.getElementById('essentials').open=true});await p.locator('#fee').fill('0');await p.locator('#fee').blur();
  assert.match(await text(p,'#meaningMain'),/Beregningen forutsetter 8 % rente på sparekontoen gjennom hele perioden\. Kontroller at renten stemmer med kontovilkårene\./);
  const before8=await text(p,'#total');
  await p.locator('#meaningActions button').click();assert.match(await text(p,'#meaningActionText'),/Med 6 % rente i stedet for 8 %/);
  assert.equal(await p.locator('#meaningActions button').getAttribute('aria-expanded'),'true');assert.equal(await p.evaluate(()=>s.rate),8);assert.equal(await text(p,'#total'),before8);

  // 4. Forklaringen oppdateres når feltet forlates, ikke ved hvert tastetrykk.
  const oldMain=await text(p,'#meaningMain');
  await p.locator('#rate').fill('1');
  assert.equal(await text(p,'#meaningMain'),oldMain,'ingen endring mens brukeren skriver');assert(await p.evaluate(()=>document.getElementById('meaning').classList.contains('meaning-waiting')));
  assert.equal(await p.evaluate(()=>document.activeElement.id),'rate','fokus blir i feltet');
  await p.locator('#rate').blur();assert.match(await text(p,'#meaningMain'),/1 % rente/);assert(!await p.evaluate(()=>document.getElementById('meaning').classList.contains('meaning-waiting')));
  // Skyveknappen: oppdateres når den slippes (change).
  await p.evaluate(()=>{const r=document.getElementById('rateSlider');r.value='3';r.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.match(await text(p,'#meaningMain'),/1 % rente/,'ikke under dra-bevegelsen');
  await p.evaluate(()=>{document.getElementById('rateSlider').dispatchEvent(new Event('change',{bubbles:true}));});assert.match(await text(p,'#meaningMain'),/3 % rente/);

  // 5. Kroner, kjøpekraft og begge i grafen.
  await p.locator('#rate').fill('5');await p.locator('#rate').blur();await p.locator('#fee').fill('0,2');await p.locator('#fee').blur();
  const legend=()=>p.locator('#chartLegend').innerText();
  assert.equal(await p.locator('#valueModes [data-value-mode=nominal]').getAttribute('aria-pressed'),'true');
  assert.match(await legend(),/Beløp i kroner/);assert.match(await legend(),/Du setter inn/);
  await p.locator('#valueModes [data-value-mode=real]').click();
  assert.equal(await p.evaluate(()=>s.real),true);assert.match(await legend(),/Kjøpekraft i dagens kroner/);assert.match(await legend(),/Innskudd i dagens kroner/);
  assert.match(await text(p,'#total'),/^238\s605 kr$/);
  await p.locator('#valueModes [data-value-mode=both]').click();
  assert.equal(await p.evaluate(()=>[s.real,view.both].join()),'false,true');assert.match(await text(p,'#total'),/^305\s434 kr$/,'hovedtallet er i kroner');
  const l=await legend();assert.match(l,/Beløp i kroner/);assert.match(l,/Kjøpekraft i dagens kroner/);assert.doesNotMatch(l,/setter inn|Innskudd|Bank/,'begge-visningen blander ikke inn linjer med annet grunnlag');
  assert.equal(await p.evaluate(()=>document.querySelectorAll('#chart svg path[stroke-dasharray="10 6"]').length),1,'kjøpekraften har egen linjestil, ikke bare egen farge');
  const desc=await p.evaluate(()=>document.querySelector('#chart svg desc').textContent);
  assert.match(desc,/Etter 10 år: Beløp i kroner: 305\s434 kr, Kjøpekraft i dagens kroner: 238\s605 kr\. Før skatt\./,'tekstalternativet har sluttverdiene');
  await p.locator('#tableTab').click();const head=await p.evaluate(()=>document.querySelector('#tableWrap thead').textContent);assert.match(head,/Beløp i kroner/);assert.match(head,/Kjøpekraft i dagens kr/);
  await p.locator('#graphTab').click();
  // Tastatur i grafen fungerer også i begge-visningen.
  await p.locator('#chart').focus();await p.keyboard.press('End');assert.match(await text(p,'#chartTip'),/Beløp i kroner: 305\s434 kr · Kjøpekraft i dagens kroner: 238\s605 kr/);
  // Delt lenke tar med spareform og visning.
  assert.equal(await p.evaluate(()=>{document.getElementById('share').click();return new URL(document.getElementById('shareUrl')?.value||location.href).hash.includes('savingsType=savings')&&new URL(document.getElementById('shareUrl')?.value||location.href).hash.includes('both=1');}),true);
  await p.evaluate(()=>document.getElementById('closeDialog').click());
  for(const w of [320,375]){await p.setViewportSize({width:w,height:740});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'ingen horisontal scrolling ved '+w);}

  // 6. Åpne en delt lenke med spareform og begge-visning.
  p=await open('#activePage=calculator&start=100000&monthly=0&rate=0&fee=0&years=10&savingsType=checking&both=1',1280);pages.push(p);
  assert.equal(await p.locator('#savingsTypes [data-type=checking]').getAttribute('aria-pressed'),'true');assert.equal(await p.locator('#valueModes [data-value-mode=both]').getAttribute('aria-pressed'),'true');
  assert.equal(await text(p,'#meaningMain'),'Beløpet på kontoen er uendret, men pengene kjøper mindre etter hvert som prisene stiger. Beregningen bruker 0 % rente på brukskontoen gjennom hele perioden. Kontroller kontovilkårene.');
  // Ugyldig spareform i lenke blir ikke valgt.
  p=await open('#activePage=calculator&savingsType=aksjer',1280);pages.push(p);assert.equal(await p.evaluate(()=>s.savingsType),'');

  for(const pg of pages)assert.deepEqual(pg.errors,[]);
  console.log('Passed: savings type, meaning section and kroner versus purchasing power.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
