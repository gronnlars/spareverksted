// PDF-rapporten skal være merket (tagged) når den lages i Chrome eller Edge (Lars 3.11.2026, PDF-sjekk).
// Rapporten lages med nettleserens «Lagre som PDF». Chromium merker PDF-en ut fra tilgjengelighetstreet.
// Feilen som ble funnet: det modale rapportvinduet gjorde resten av siden inert, og aria-hidden lå på utskriftskopien.
// Da fikk PDF-en ingen /StructTreeRoot, ingen bokmerker og ingen tittel som beskrev rapporten.
// Testen trykker på «Skriv ut / lagre som PDF», lager PDF-en mens utskriften pågår og kontrollerer merkene.
// Dette er Chromium. Safari og Firefox lager PDF på sin egen måte, og det kan ikke denne testen si noe om.
// XMP, PDF/UA-merke og «fast web view» settes ikke av nettleserens utskrift og testes ikke her.
// Bokmerker (/Outlines) kommer bare fordi testen ber om dem (outline:true). Vanlig Chrome på PC lager dem ikke (Lars, Windows, 3.11.2026).
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  const p=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  // window.print fanges, så PDF-en lages i samme tilstand som når nettleserens utskrift starter.
  // beforeprint markerer at utskrift er startet. Testen kan dermed kontrollere PDF-en før afterprint,
  // uten å bruke hover som en antakelse om hvordan nettleserens utskriftsvindu virker.
  await p.addInitScript(()=>{window.print=()=>{window.dispatchEvent(new Event('beforeprint'));window.__printState={dialogOpen:document.getElementById('reportDialog').open,title:document.title,hidden:document.getElementById('printReportContent').getAttribute('aria-hidden'),h1:document.querySelectorAll('#printReportContent h1').length};window.__printed=true;};});
  await p.goto(origin+'/index.html#start=12000&monthly=4000&years=22&savingsType=index&rate=7.11');await p.reload();
  await p.evaluate(()=>reportAction());
  await p.waitForSelector('#reportDialog[open]');
  await p.click('#printReport');
  const st=await p.evaluate(()=>window.__printState);
  assert.equal(st.dialogOpen,false,'rapportvinduet må være lukket mens PDF-en lages, ellers blir kopien inert og umerket');
  assert.equal(st.hidden,null,'utskriftskopien skal ikke ha aria-hidden');
  assert.equal(st.h1,1,'utskriftskopien skal ha nøyaktig én h1');
  assert.match(st.title,/^Spareplan, Spareverksted, \d/,'sidetittelen skal beskrive rapporten mens PDF-en lages');
  await p.emulateMedia({media:'print'});
  const pdf=(await p.pdf({format:'A4',tagged:true,outline:true})).toString('latin1');
  for(const k of ['/StructTreeRoot','/ParentTree','/MarkInfo','/Outlines','/Lang'])assert.ok(pdf.includes(k),'PDF-en mangler '+k);
  assert.ok(/\/S\s*\/H1\b/.test(pdf),'PDF-en mangler H1-merke');
  assert.ok(/\/S\s*\/Figure\b/.test(pdf),'grafen skal være merket som figur');
  // Etter utskrift: vinduet og tittelen kommer tilbake.
  await p.evaluate(()=>window.dispatchEvent(new Event('afterprint')));await p.waitForTimeout(50);
  assert.equal(await p.evaluate(()=>document.getElementById('reportDialog').open),true,'rapportvinduet skal åpnes igjen etter utskrift');
  assert.match(await p.title(),/^Spareverksted · /,'sidetittelen skal settes tilbake');
  assert.ok(pdf.includes('/Title'),'PDF-en mangler /Title');
  // Et ignorert utskriftskall uten hendelser skal gjenopprette vindu og tittel.
  const d=await browser.newPage();d.on('pageerror',e=>errors.push(e.message));
  await d.addInitScript(()=>{window.print=()=>{};});
  await d.goto(origin+'/index.html#start=12000&monthly=4000&years=22');await d.reload();
  await d.evaluate(()=>reportAction());await d.waitForSelector('#reportDialog[open]');await d.click('#printReport');await d.waitForTimeout(50);
  assert.equal(await d.evaluate(()=>document.getElementById('reportDialog').open),true,'PC: rapportvinduet skal åpnes igjen');
  assert.match(await d.title(),/^Spareverksted · /,'PC: sidetittelen skal settes tilbake');
  // Lånekalkulatoren deler utskriftsflyten og skal gi samme tilgjengelige PDF-struktur.
  const loan=await browser.newPage();loan.on('pageerror',e=>errors.push(e.message));
  await loan.addInitScript(()=>{window.print=()=>{window.dispatchEvent(new Event('beforeprint'));window.__loanPrint={dialog:document.getElementById('reportDialog').open,title:document.title};};});
  await loan.goto(origin+'/laan.html');await loan.fill('#rate','5');await loan.locator('#rate').blur();
  await loan.click('#heroDownload');await loan.click('#exportPdf');await loan.click('#printReport');
  const ls=await loan.evaluate(()=>window.__loanPrint);assert.equal(ls.dialog,false);assert.match(ls.title,/^Låneberegning, Spareverksted/);
  await loan.emulateMedia({media:'print'});const loanPdf=(await loan.pdf({format:'A4',tagged:true,outline:true})).toString('latin1');
  for(const key of ['/StructTreeRoot','/ParentTree','/MarkInfo','/Lang'])assert.ok(loanPdf.includes(key),'låne-PDF mangler '+key);
  assert.ok(/\/S\s*\/H1\b/.test(loanPdf));assert.ok(/\/S\s*\/Figure\b/.test(loanPdf));assert.ok(/\/S\s*\/Table\b/.test(loanPdf));
  await loan.evaluate(()=>dispatchEvent(new Event('afterprint')));await loan.waitForTimeout(50);
  assert.equal(await loan.evaluate(()=>document.getElementById('reportDialog').open),true);
  assert.equal(await loan.title(),'Lån · Spareverksted');
  await loan.emulateMedia({media:'screen'});await loan.click('#closeReport');
  for(const rate of ['4','6']){
   await loan.fill('#rate',rate);await loan.click('#saveLoan');await loan.click('#confirmLoan');
  }
  await loan.click('#downloadLoans');await loan.click('#compareLoans');await loan.click('#printReport');
  assert.match(await loan.title(),/^Lagrede låneplaner, Spareverksted/);
  // Ingen tom figur rundt grafen (samme feil som i «Valgte planer», #203), og hver plan har bare én h2.
  assert.equal(await loan.locator('#printReportContent figure:not([role=group])').count(),0,'figure i samlet lånerapport har role=group');
  const h2=await loan.locator('#printReportContent h2').allInnerTexts();
  assert.equal(new Set(h2).size,h2.length,'like h2-overskrifter i samlet lånerapport: '+h2.join(' | '));
  await loan.emulateMedia({media:'print'});
  const combined=(await loan.pdf({format:'A4',tagged:true})).toString('latin1');
  for(const tag of ['H1','H2','Figure','Table'])assert.ok(new RegExp('/S\\s*/'+tag+'\\b').test(combined),'samlet PDF mangler '+tag);
  for(const key of ['/StructTreeRoot','/ParentTree','/Lang','/Title'])assert.ok(combined.includes(key),'samlet PDF mangler '+key);
  assert.deepEqual(errors,[]);
  console.log('PDF-merking: ok (Chromium). Merket struktur, språk, tittel og figur finnes (bokmerker bare fordi testen ber om dem).');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
