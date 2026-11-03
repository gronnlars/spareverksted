// Innholdet i Excel, CSV, JSON og PDF (Lars 3.11.2026): bare kalkulatoren man står i, lesbare navn, ingen rå nøkler,
// tall avrundet som på skjermen og like skjermen, spareform, kjøpekraft og kilder fra registeret.
// Krever playwright. SPARE_BROWSER kan peke på en Chromium. SPARE_ENGINE=firefox|webkit for andre motorer.
const pw=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const engine=process.env.SPARE_ENGINE||'chromium';
const RAW=/^(freedom|home|buffer|dream|ask|share|simple|explore|advanced|remaining|initial|amount|duration|budget|percent|calculator|dreams|withdrawals|low|medium|high|car|holiday|renovation|other|checking|savings|index)$/;
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}try{const d=fs.readFileSync(f);res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(d);}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;
 try{
  browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})}:{})});
  const c=await browser.newContext({viewport:{width:390,height:800}});const q=await c.newPage();const errors=[];q.on('pageerror',e=>errors.push(e.message));q.setDefaultTimeout(10000);
  const go=async h=>{await q.goto('about:blank');await q.goto(origin+h);await q.waitForTimeout(400);};
  const sheets=()=>q.evaluate(()=>exportSheets());
  const digits=t=>Number(String(t).replace(/[^\d]/g,''));
  const clean=all=>{for(const sh of all){if(sh.name!=='Forutsetninger')continue;for(const [k,v] of sh.rows.slice(1)){assert.doesNotMatch(String(k),/^[a-z]+[A-Z]|^[a-z]+$/,'rå nøkkel: '+k);assert.doesNotMatch(String(v),RAW,`rå verdi: ${k}=${v}`);}}};
  const whole=(sh,cols)=>{for(const row of sh.rows.slice(1))for(const i of cols)if(typeof row[i]==='number')assert(Number.isInteger(row[i]),`${sh.name}: ${row[i]} er ikke avrundet`);};

  // Sparing, med valgt spareform og formål.
  await go('#activePage=calculator&start=10000&monthly=1500&years=15&savingsType=index&purposeChosen=1&purpose=home');
  let all=await sheets();assert.deepEqual(all.map(x=>x.name),['Forutsetninger','Sparing']);clean(all);whole(all[1],[1,2,3]);
  const set=Object.fromEntries(all[0].rows);assert.equal(set.Kalkulator,'Sparing');assert.equal(set['Formål'],'Bolig');assert.match(String(set.Spareform),/Indeksfond|Ikke valgt/);
  assert.equal(all[1].rows.at(-1)[1],digits(await q.locator('#total').textContent()),'sluttbeløp som på skjermen');
  assert.match(set['Tall fra SSB'],new RegExp(await q.evaluate(()=>SpareFacts.expand('{{savingsRate.periode}}'))));
  let report=await q.evaluate(()=>buildReport());assert.match(report,/Spareform:/);assert.match(report,/Kilder: .*ssb\.no\/statbank\/table\/11018/);assert.doesNotMatch(report,/20\. oktober 2026/);
  assert.deepEqual(await q.evaluate(()=>activeMatrix()[0][0]),'År med sparing','CSV er tabellen i kalkulatoren');

  // Sparemål: bare målets ark, ikke skjulte sparetall.
  await go('#activePage=dreams&dreamType=other&dreamCost=300000&dreamYears=5&dreamMonthly=3000');
  all=await sheets();assert.deepEqual(all.map(x=>x.name),['Forutsetninger','Sparemål']);clean(all);whole(all[1],[2,3,4,5]);
  assert.equal(Object.fromEntries(all[0].rows)['Mål'],'Noe annet');
  const shown=digits((await q.locator('#dreamCards .route-money').first().textContent()).split('kr')[0]);
  assert.equal(all[1].rows[1][3],shown,'nødvendig sparing som på skjermen');
  report=await q.evaluate(()=>buildReport());assert.match(report,/i dagens priser/);

  // Uttak: sparing før uttak og uttaket, med dagens kroner.
  await go('#activePage=withdrawals&start=500000&monthly=0&years=10');
  all=await sheets();assert.deepEqual(all.map(x=>x.name),['Forutsetninger','Sparing før uttak','Uttak']);clean(all);whole(all[2],[1,2,3,4,5]);
  assert.equal(all[2].rows[0][4],'Saldo etter uttak i dagens kroner, kr');
  const left=await q.locator('#retirementResult').textContent();
  assert(left.includes(new Intl.NumberFormat('nb-NO').format(all[2].rows.at(-1)[3]).replace(/\s/g,' '))||left.replace(/\s/g,'').includes(String(all[2].rows.at(-1)[3])),'saldo etter uttak som på skjermen');
  report=await q.evaluate(()=>buildReport());assert.match(report,/i dagens kjøpekraft\.<\/p>/);

  // Uvanlige verdier: 100 år og høy vekst gir endelige, avrundede tall.
  await go('#activePage=calculator&start=0&monthly=20000&years=100&rate=15');
  all=await sheets();whole(all[1],[1,2,3]);
  assert.deepEqual(errors,[]);
  console.log('eksportinnhold: bare valgt kalkulator, lesbare navn, avrundet og likt skjermen, spareform, kjøpekraft og kilder: OK');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
