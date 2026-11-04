// Lånekalkulatorens side (dist/laan.html) i nettleser. Kjøres i Chromium, Firefox og WebKit i CI (SPARE_ENGINE).
// Kontrollerer: tom rente gir oppfordring og ingen feil, resultatet stemmer med motoren, feilmeldinger ved feltet
// med feltnavn og aria-koblinger, eksempeltall per lånetype, at renten aldri fylles inn av siden, at gebyrer satt på
// et høyere nivå regnes med og listes på Enkel, sammenligning og ekstra innbetaling i Utforsk, tabell i Avansert,
// grafen med tastatur, ingen vannrett rulling på smale skjermer, ingen lagring utover nivåvalget, og veien inn fra
// sparekalkulatoren. Dette erstatter ikke kontroll med skjermleser eller på iPhone.
const {chromium,firefox,webkit}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'../dist'),engine=process.env.SPARE_ENGINE||'chromium';
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 let browser;const errors=[];
 const sp=t=>t.replace(/[  ]/g,' ');
 try{
  browser=await {chromium,firefox,webkit}[engine].launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']}:{}),...(engine==='chromium'&&process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  const ctx=await browser.newContext({viewport:{width:1280,height:900}});const p=await ctx.newPage();
  p.on('pageerror',e=>errors.push(e.message));
  const text=id=>p.locator('#'+id).textContent().then(sp);
  const type=async(id,value)=>{await p.fill('#'+id,value);await p.locator('#'+id).blur();await p.waitForTimeout(50);};
  await p.goto(origin+'/laan.html');

  // 1. Tom rente: oppfordring, ingen feilmelding, ingen tall som kan leses som et resultat.
  assert.equal(await p.inputValue('#rate'),'','renten står tom');
  assert.equal(await text('payment'),'Fyll inn renten');
  assert.equal(await p.locator('#error').isHidden(),true,'ingen feil før brukeren har gjort noe');
  assert.equal(await p.locator('.loan-metrics').isVisible(),false,'ingen tomme nøkkeltall');
  assert.equal(await p.getAttribute('#rate','aria-invalid'),null);
  assert.deepEqual(await p.evaluate(()=>[localStorage.length,sessionStorage.length]),[0,0],'åpning lagrer ingenting');

  // 2. Resultat som i motoren og docs/laanemodell.md.
  await type('rate','5');
  assert.equal(await text('payment'),'17 538 kr');
  assert.equal(await text('mInterest'),'2 261 310 kr');assert.equal(await text('mPaid'),'5 261 310 kr');
  assert.match(await text('meaningMain'),/For hver 100 kr du låner, betaler du 75,4 kr i renter/);
  assert.equal(await p.locator('#mFeesBox').isVisible(),false,'gebyrer skjult når de er 0 for boliglån');
  await p.click('[data-type=serie]');
  assert.equal(await text('payment'),'22 500 kr');assert.match(await text('resultText'),/10 042 kr i siste måned/);
  assert.equal(await text('mInterest'),'1 881 250 kr');
  await p.click('[data-type=annuitet]');
  await type('rate','4,5');assert.equal(await p.inputValue('#rate'),'4,5','komma som desimaltegn');
  await type('amount','2500000');assert.equal(sp(await p.inputValue('#amount')),'2 500 000','tusenskille etter at feltet forlates');

  // 3. Feil ved feltet, med feltnavn, aria-invalid og kobling til meldingen. Resultatet dempes.
  await type('years','0,04');
  assert.equal(await p.getAttribute('#years','aria-invalid'),'true');
  const described=await p.getAttribute('#years','aria-describedby');assert.ok(described.includes('yearsFieldError'),'feilen er koblet til feltet');
  assert.match(await text('yearsFieldError'),/«Nedbetalingstid» må være fra én måned til 50 år/);
  assert.match(await text('error'),/Nedbetalingstid/);assert.equal(await p.getAttribute('#error','role'),'alert');
  assert.equal(await p.evaluate(()=>document.body.classList.contains('stale')),true,'gammelt resultat dempes');
  await type('years','25');
  assert.equal(await p.getAttribute('#years','aria-invalid'),null);assert.equal(await p.locator('#error').isHidden(),true);
  assert.equal(await p.evaluate(()=>document.body.classList.contains('stale')),false);
  await type('rate','abc');assert.match(await text('rateFieldError'),/Fyll inn et gyldig tall i «Nominell årsrente»/);
  await type('rate','101');assert.match(await text('rateFieldError'),/fra 0 % til 100 %/);
  await type('rate','5');

  // 4. Lånetype: eksempeltall byttes bare når brukeren ikke har endret dem. Renten røres aldri.
  await p.click('#reset');await type('rate','5');
  await p.click('[data-kind=bil]');
  assert.equal(sp(await p.inputValue('#amount')),'300 000');assert.equal(await p.inputValue('#years'),'5');assert.equal(await p.inputValue('#rate'),'5');
  await type('amount','250000');await p.click('[data-kind=bolig]');
  assert.equal(sp(await p.inputValue('#amount')),'250 000','eget lånebeløp beholdes');assert.equal(await p.inputValue('#years'),'25','eksempeltiden byttes');
  assert.match(await text('exampleNote'),/Nedbetalingstiden er et eksempeltall/);

  // 5. Forbrukslån viser gebyrene på Enkel. Gebyrer satt der regnes med og listes når de skjules.
  await p.click('#reset');await type('rate','12');await p.click('[data-kind=forbruk]');
  assert.equal(await p.locator('#feesDetails').isVisible(),true,'gebyrene vises for forbrukslån på Enkel');
  await type('establishmentFee','950');await type('termFee','45');
  assert.equal(await text('mFees'),'2 570 kr');assert.match(await text('resultText'),/45 kr i termingebyr/);
  await p.click('[data-kind=bolig]');
  assert.equal(await p.locator('#feesDetails').isVisible(),false,'gebyrene skjules for boliglån på Enkel');
  assert.match(await text('hiddenChoices'),/Regnes med, men vises ikke på dette nivået: etableringsgebyr 950 kr, termingebyr 45 kr per måned/);
  assert.ok((await text('mFees')).length>0&&await p.locator('#mFeesBox').isVisible(),'gebyrene er med i resultatet');
  await p.click('#editHidden');
  assert.equal(await p.getAttribute('#levels [data-level=explore]','aria-pressed'),'true');
  assert.equal(await p.evaluate(()=>document.getElementById('feesDetails').open),true);
  assert.equal(await p.evaluate(()=>document.activeElement.id),'establishmentFee','fokus går til feltet');
  assert.equal(await p.locator('#hiddenChoices').isHidden(),true);
  assert.equal(await p.evaluate(()=>sessionStorage.getItem('sv-level')),'explore','bare nivåvalget lagres, som i sparekalkulatoren');
  assert.equal(await p.evaluate(()=>localStorage.length),0);

  // 6. Utforsk: sammenligning, ekstra innbetaling og renteendring.
  await p.click('#reset');await type('rate','5');
  assert.equal(await p.locator('#comparePanel').isVisible(),true);
  assert.equal(await text('cSFirst'),'22 500 kr');assert.match(await text('compareText'),/380 060 kr mindre i renter fordi gjelden betales raskere ned/);
  assert.doesNotMatch(await text('compareText'),/billig/i);
  assert.equal(await p.locator('#chartLegend li').count(),2,'den andre lånetypen i grafen');
  await p.click('#extraDetails summary');await type('extraAmount','500000');await type('extraYear','5');
  assert.match(await text('extraEffect'),/5 år og 7 måneder tidligere og gir 678 142 kr mindre i renter/);
  assert.match(await text('chartLegend'),/Uten ekstra innbetaling/);
  await type('extraAmount','9000000');assert.match(await text('loanNotes'),/større enn gjelden/);
  await type('extraAmount','');
  await p.click('#changeDetails summary');await type('changeRate','7');await type('changeYear','5');
  assert.match(await text('resultText'),/Med 7 % rente etter 5 år blir beløpet 20 603 kr, 3 065 kr mer enn før/);
  await type('changeYear','30');assert.match(await text('changeYearFieldError'),/mindre enn nedbetalingstiden/);
  await type('changeRate','');assert.equal(await p.locator('#error').isHidden(),true,'tomt felt betyr ingen endring');

  // 7. Avansert: tabell per år som summerer seg til resultatet.
  await p.click('#levels [data-level=advanced]');await p.click('#tableTab');
  assert.equal(await p.locator('#tableWrap tbody tr').count(),25);
  assert.equal(sp(await p.locator('#tableWrap tbody tr').last().locator('td').last().textContent()),'0 kr');
  await p.click('#levels [data-level=simple]');assert.equal(await p.locator('#tableWrap').isVisible(),true,'tabellvalget beholdes på Enkel');
  await p.selectOption('#tablePeriod','month');
  assert.equal(await p.locator('#tableWrap tbody tr').count(),301,'termin 0 og alle 300 betalinger');
  await p.selectOption('#tablePeriod','year');await p.click('#graphTab');

  // 8. Grafen med tastatur.
  await p.focus('#chart');await p.keyboard.press('End');assert.match(sp(await text('chartTip')),/^År 25 · Restgjeld: 0 kr/);
  await p.keyboard.press('Home');assert.match(sp(await text('chartTip')),/^År 0 · Restgjeld: 3 000 000 kr/);
  assert.match(await text('chartSummaryText'),/Gjelden går fra 3 000 000 kr til 0 kr over 25 år/);

  // 9. Smale skjermer: ingen vannrett rulling, heller ikke med tabell og sammenligning.
  for(const w of [320,390,457,640]){await p.setViewportSize({width:w,height:800});await p.click('#levels [data-level=advanced]');await p.waitForTimeout(100);
   await p.evaluate(()=>{document.getElementById('feesDetails').open=true;});
   const pair=await p.locator('#feesDetails .fieldbox').all();
   const a=await pair[0].boundingBox(),b=await pair[1].boundingBox();
   assert.ok(a.width>100&&b.width>100,'gebyrfeltene får plass');
   assert.ok(Math.abs(a.y-b.y)<1||b.y>=a.y+a.height,'feltene er på linje eller under hverandre');
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'ingen vannrett rulling ved '+w+' px');}
  await p.setViewportSize({width:1280,height:900});

  // Hjelp og nedlasting bruker samme mønster som sparekalkulatoren. Fokus tilbake, ingen gammel beregning eksporteres.
  await p.click('button[aria-label="Forklaring på nominell årsrente"]');
  assert.equal(await p.locator('#loanHelpDialog').isVisible(),true);
  await p.keyboard.press('Escape');
  assert.equal(await p.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Forklaring på nominell årsrente');
  await p.click('#heroDownload');assert.equal(await p.locator('#exportDialog').isVisible(),true);
  for(const [id,name] of [['exportXlsx','spareverksted-laan.xlsx'],['exportCsv','spareverksted-laan.csv'],['exportJson','spareverksted-laan.json']]){
   const [download]=await Promise.all([p.waitForEvent('download'),p.click('#'+id)]);
   assert.equal(download.suggestedFilename(),name);
   const data=fs.readFileSync(await download.path());assert.ok(data.length>100);
   if(id==='exportXlsx')assert.equal(data.subarray(0,2).toString(),'PK');
   if(id==='exportJson'){const j=JSON.parse(data);assert.equal(j.rows.length,300);assert.equal(j.totals.amount,3000000);assert.equal(j.yearly.length,25);}
   if(id==='exportCsv')assert.equal(data.toString().split('\r\n').length,302);
  }
  await p.click('#exportPdf');assert.equal(await p.locator('#reportDialog').isVisible(),true);
  assert.equal(await p.locator('#reportPreview h1').count(),1);assert.equal(await p.locator('#reportPreview svg').count(),1);
  assert.equal(await p.locator('#reportPreview table tbody tr').count(),25);
  for(const width of [320,390]){
   await p.setViewportSize({width,height:800});
   assert.equal(await p.locator('#reportDialog').evaluate(e=>e.scrollWidth<=e.clientWidth),true,'rapportvindu uten sidelengs rulling');
   assert.equal(await p.locator('#reportPreview .report-table').evaluate(e=>e.scrollWidth<=e.clientWidth),true,'årsoversikt uten sidelengs rulling ved '+width);
  }
  await p.setViewportSize({width:1280,height:900});
  await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>document.activeElement.id),'heroDownload');
  await type('years','0');await p.click('#heroDownload');
  assert.equal(await p.locator('#exportDialog').isVisible(),false);assert.equal(await p.evaluate(()=>document.activeElement.id),'years');
  await type('years','25');

  // 10. Veien inn og tilbake. Lån ligger blant kalkulatorfanene og på startsiden.
  await p.goto(origin+'/index.html');
  assert.equal(await p.locator('.welcome-question[href="laan.html"]').count(),0,'ikke noe lånekort på startsiden');
  assert.equal(await p.locator('.page-nav a[href="laan.html"]').count(),1,'fane i kalkulatoren');
  assert.equal(await p.locator('footer a[href="laan.html"]').count(),0,'ingen lånelenke i bunnteksten');
  await p.goto(origin+'/laan.html');await p.click('.page-nav a[href="index.html#activePage=dreams"]');await p.waitForTimeout(200);
  assert.equal(await p.getAttribute('#dreamPage','aria-pressed'),'true','Sparemål åpnes fra lånesiden');
  assert.deepEqual(errors,[]);
  console.log(engine+': lånekalkulatoren: tom rente, resultat, feil ved feltet, lånetyper, gebyrer på tvers av nivåer, sammenligning, ekstra innbetaling, renteendring, tabell, tastatur, 320 px og veien inn bestått.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
