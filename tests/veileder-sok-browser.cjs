// Nettlesertest av treffvisningen i «Spør om sparing» (Chromium).
// Valgfritt: npm install playwright. SPARE_BROWSER kan peke på en eksisterende Chromium.
// Testen sjekker visningen av søkemodusene, ikke selve rangeringen (den dekkes av Node-testene).
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{
  const filename=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!filename.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  try{const data=fs.readFileSync(filename);res.setHeader('Content-Type',filename.endsWith('.js')?'text/javascript':filename.endsWith('.css')?'text/css':'text/html');res.end(data);}catch{res.writeHead(404);res.end();}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  for(const [label,viewport,mobile] of [['320 px',{width:320,height:640},true],['390 px',{width:390,height:844},true],['1280 px',{width:1280,height:800},false]]){
   const context=await browser.newContext({viewport,isMobile:mobile,hasTouch:mobile});
   const page=await context.newPage(),errors=[],external=[];
   page.setDefaultTimeout(10000);
   page.on('pageerror',e=>errors.push(e.message));
   page.on('request',r=>{if(!r.url().startsWith(origin))external.push(r.url());});
   await page.goto(origin+'/spor.html');
   const ask=async value=>{if(!await page.evaluate(()=>document.getElementById('searchBox').open))await page.locator('#searchBox>summary').click();await page.locator('#question').fill(value);await page.locator('#questionForm button').click();};
   const status=()=>page.locator('#matchStatus').innerText();
   const answerOpen=()=>page.evaluate(()=>{const p=document.getElementById('answerPanel');return !!p&&!p.hidden&&p.offsetParent!==null;});
   const noOverflow=async what=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),label+': ingen vannrett scrolling etter '+what);

   // Fra spor.html: ingen støtte for tomme felt uten melding.
   assert.equal(await page.locator('#question').getAttribute('placeholder'),'F.eks. boliglån eller fond');

   // 1. Entydig treff: svaret åpnes, begrunnelsen står i statusfeltet, spørsmålet blir stående.
   await ask('bolig lån');
   assert.ok(await answerOpen(),label+': svar åpnes for «bolig lån»');
   assert.match(await status(),/Treff på «bolig ?lån»|boliglån/i);
   assert.equal(await page.locator('#question').inputValue(),'bolig lån','spørsmålet beholdes');
   await noOverflow('entydig treff');

   // 2. Tastefeil: bare forslag. Svaret åpnes ikke, og forslaget er merket.
   await ask('bloiglån');
   assert.ok(!await answerOpen(),label+': tastefeil åpner ikke et svar');
   assert.match(await status(),/Mente du «boliglån»\? Velg et svar nedenfor\./);
   const suggestion=page.locator('#matches .match-list button').first();
   assert.equal(await suggestion.locator('.match-why').count(),0,'rettelsen står bare i statusfeltet');
   assert.ok((await suggestion.boundingBox()).height>=44,label+': forslaget har stor nok trykkflate');
   assert.ok(await suggestion.evaluate(b=>b.classList.contains('match-suggest')),'forslaget har egen stil');
   await noOverflow('tastefeil');
   // Forslaget kan velges med tastatur (Enter), og først da åpnes svaret.
   await suggestion.focus();await page.keyboard.press('Enter');
   assert.ok(await answerOpen(),label+': valgt forslag åpner svaret');
   assert.equal(await page.locator('#matches .match-list').count(),0,'listen fjernes når et valg er gjort');

   // 3. Bredt ord: flere forslag, ingen svar åpnet, maks tre synlige og «Vis flere» når det er flere.
   await ask('lån');
   assert.ok(!await answerOpen(),label+': bredt ord åpner ikke et tilfeldig svar');
   const visible=await page.locator('#matches .match-list li:not([hidden])').count();
   assert.ok(visible>=1&&visible<=3,label+': maks tre synlige forslag');
   await noOverflow('bredt ord');
   const moreButton=page.locator('#matches > button');
   if(await moreButton.count()){
    await moreButton.focus();await page.keyboard.press('Enter');
    assert.ok(await page.locator('#matches .match-list li:not([hidden])').count()>visible,'«Vis flere» viser resten');
    assert.ok(await page.evaluate(()=>!!document.activeElement.closest('.match-list')),'fokus flyttes til første nye treff, ikke bort fra listen');
   }

   // 3b. Mange forslag: bare tre vises først, «Vis flere» viser resten uten å flytte fokus ut av listen.
   await ask('bank hus skatt lån');
   assert.ok(!await answerOpen(),label+': mange forslag åpner ikke et svar');
   assert.equal(await page.locator('#matches .match-list li:not([hidden])').count(),3,'tre synlige først');
   const total=await page.locator('#matches .match-list li').count();
   assert.ok(total>3,'flere enn tre forslag finnes');
   const more2=page.locator('#matches > button');
   assert.equal(await more2.count(),1,'«Vis flere» finnes');
   assert.match(await more2.innerText(),new RegExp('Vis flere \\('+(total-3)+'\\)'));
   assert.ok((await more2.boundingBox()).height>=44,label+': «Vis flere» har stor nok trykkflate');
   await more2.focus();await page.keyboard.press('Enter');
   assert.equal(await page.locator('#matches .match-list li:not([hidden])').count(),total,'«Vis flere» viser alle');
   assert.equal(await page.locator('#matches > button').count(),0,'«Vis flere» fjernes etterpå');
   assert.ok(await page.evaluate(()=>!!document.activeElement.closest('.match-list')),'fokus flyttes til første nye treff');
   await noOverflow('Vis flere');

   // 4. Valg mellom likeverdige svar: ingenting åpnes automatisk.
   await ask('ask');
   assert.ok(!await answerOpen(),label+': uavgjort åpner ikke et svar');
   assert.match(await status(),/Flere svar/);
   assert.ok(await page.locator('#matches .match-list button').count()>=2);

   // 5. Ærlig «finnes ikke»: tydelig melding, temavelger åpen, ingen svakt treff.
   await ask('bitcoin');
   assert.ok(!await answerOpen(),label+': ukjent tema åpner ikke et svar');
   assert.match(await status(),/ikke et ferdig svar/);
   assert.equal(await page.locator('#matches .match-list').count(),0);
   assert.ok(await page.evaluate(()=>document.getElementById('topicPicker').open),'temavelgeren åpnes');
   assert.ok(await page.locator('[data-topic="mortgage"]').isVisible(),'temaknappene er synlige');
   await noOverflow('ukjent tema');

   // 6. For bredt spørsmål: egen melding som ber om litt mer.
   await ask('sparing');
   assert.match(await status(),/bredt/);

   // 7. Fokus: søket flytter ikke fokus til listen. Etter innsending av et forslagssøk står fokus på knappen eller i skjemaet.
   if(!await page.evaluate(()=>document.getElementById('searchBox').open))await page.locator('#searchBox>summary').click();
   await page.locator('#question').fill('bloiglån');
   await page.locator('#question').press('Enter');
   assert.ok(await page.evaluate(()=>!document.activeElement.closest('#matches')),label+': fokus hoppes ikke inn i forslagslisten');

   // 8. Skriving etter et søk skal ikke gi flimmer eller støy: ingen aria-live på selve listen.
   assert.equal(await page.locator('#matches').getAttribute('aria-live'),null);
   assert.equal(await page.locator('#matches [aria-live]').count(),0);
   // Statusfeltet er den eneste annonsøren.
   assert.equal(await page.locator('#matchStatus').getAttribute('role'),'status');

   // 9. Skadelig tekst vises som tekst, aldri som HTML.
   await ask('<img src=x onerror=window.__hacked=1>');
   assert.equal(await page.evaluate(()=>window.__hacked),undefined);
   assert.equal(await page.locator('#matches img').count(),0);

   // 10. Alle treffknapper har tilgjengelig navn.
   await ask('lån');
   for(const b of await page.locator('#matches button').all())assert.ok((await b.innerText()).trim().length>0,'treffknapp uten navn');

   assert.deepEqual(external,[],'ingen forespørsler ut av siden');
   assert.deepEqual(errors,[]);
   await context.close();
  }
  console.log('Browser: søkevisning i Chromium ved 320, 390 og 1280 px: entydig treff, tastefeilforslag, bredt ord med «Vis flere», valg ved uavgjort, ærlig «ikke dekket», fokus, ingen vannrett scrolling, ingen eksterne forespørsler.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
