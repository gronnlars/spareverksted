// Optional: npm install playwright, then npx playwright install chromium.
// SPARE_BROWSER can point to an existing Chromium binary. No separate server is needed.
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
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage(),errors=[],external=[];
  page.setDefaultTimeout(10000);
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(!r.url().startsWith(origin))external.push(r.url());});
  const pick=async id=>{if(!await page.locator('#topicPicker').getAttribute('open'))await page.locator('#topicPicker>summary').click();await page.locator('[data-topic="'+id+'"]').click();};
  const search=async value=>{if(!await page.locator('#searchBox').getAttribute('open'))await page.locator('#searchBox>summary').click();await page.locator('#question').fill(value);await page.locator('#questionForm button').click();};
  const noOverflow=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal scrolling');
  await page.goto(origin+'/index.html');
  assert(await page.locator('.welcome-question').isVisible());
  await page.locator('#chooseGrowth').click();await page.locator('#onboardAge').fill('57');await page.locator('#onboardYears').fill('10');
  await page.locator('#beginJourney').click();
  for(const id of ['start','monthly','years','rate'])assert(await page.locator('#'+id+'Slider').isVisible());
  const slider=page.locator('#monthlySlider');await slider.scrollIntoViewIfNeeded();
  const box=await slider.boundingBox(),before=await page.locator('#total').textContent();
  await page.touchscreen.tap(box.x+box.width*.65,box.y+box.height/2);
  assert.notEqual(await page.locator('#total').textContent(),before,'Touch must update the result');
  await slider.focus();assert(await page.locator('#mobileSummary').isVisible());
  assert.equal(await page.locator('#mobileTotal').textContent(),await page.locator('#total').textContent());
  assert(await page.locator('#mobileValueCurve').getAttribute('d'));
  await page.locator('#mobileResultButton').click();await page.waitForTimeout(500);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'savingsResult');
  const resultBounds=await page.locator('#savingsResult').boundingBox();
  assert(resultBounds.y>=-9&&resultBounds.y<120,'Result card must be at the top of the viewport');
  assert((await page.locator('.before-tax-badge').boundingBox()).y>=0,'Result badge stays in view');
  assert.match(await page.locator('#mobileResultButton').innerText(),/Se resultat/);
  await page.locator('.site-menu>summary').click();await page.locator('.site-menu a[href="spor.html"]').click();
  await pick('funds');assert.match(await page.locator('#contextSummary').innerText(),/10 år til bruk/);
  assert(await page.locator('.answer-checked').isVisible());assert.equal(await page.locator('.answer-sources').getAttribute('open'),null);
  await pick('children');assert.doesNotMatch(await page.locator('#contextSummary').innerText(),/10 år/);
  await page.locator('#profileDetails>summary').click();await page.locator('#years').fill('3');
  await page.locator('#buffer').selectOption('no');await page.locator('#debt').selectOption('yes');await page.locator('#income').selectOption('uncertain');await page.locator('#risk').selectOption('low');
  assert(await page.locator('#answerPanel').isHidden());await page.locator('#answerButton').click();
  await pick('buffer');
  const answer=await page.locator('#answerPanel').innerText();
  assert.doesNotMatch(answer,/aksjeandel|Uro teller også|Du har oppgitt|mangler buffer/);
  assert.doesNotMatch(await page.locator('#contextSummary').innerText(),/år til bruk/);
  assert.equal(await page.locator('#suggestedQuestions button').count(),0,'No unrelated follow-up after an urgent buffer answer');
  assert.equal(await page.locator('.next-steps li').count(),3);assert(await page.locator('.answer-caution').isVisible());
  await page.locator('.full-answer>summary').click();
  assert.equal(await page.locator('.full-answer>.answer-part').count(),3);
  assert.equal(await page.locator('.more-sections').getAttribute('open'),null);
  await page.locator('.more-sections>summary').click();assert.match(await page.locator('.more-sections').innerText(),/kontakte kreditorer tidlig/);
  for(const card of await page.locator('.option-card').all()){
   assert(await card.locator('.pro li').count()>=2);assert(await card.locator('.con li').count()>=2);
   await card.locator('.pro>summary').click();assert(await card.locator('.pro li p').first().isVisible());
   assert.equal(await card.locator('.tradeoff details').count(),0);
   assert.match(await card.locator('.poor-fit').innerText(),/^Passer dårlig hvis /);
  }
  await page.locator('#profileDetails>summary').click();assert(await page.locator('#years').isDisabled());assert(await page.locator('#risk').isDisabled());
  await page.locator('#income').selectOption('stable');await page.locator('#answerButton').click();
  const stored=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('sv-guidance-tab-v2')));
  assert.equal(stored.profile.risk,'low');assert.equal(stored.profile.years,10);assert.equal(stored.profile.age,57);assert.equal(stored.horizons.children,3);
  assert(await page.locator('#answerPanel').isVisible());
  await page.locator('#profileDetails>summary').click();await page.locator('#resetGuidance').click();
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('sv-guidance-tab-v2')),null);
  await search('Hva er BSU?');assert.equal(await page.locator('#answerTitle').innerText(),'Hva er BSU?');
  await page.locator('.full-answer>summary').click();assert.match(await page.locator('.full-answer').innerText(),/27 500/);
  await search('<img src=x onerror="window.injected=true">');assert(await page.locator('#answerPanel').isHidden());assert.equal(await page.evaluate(()=>window.injected),undefined);
  for(const id of ['mortgage','student','children','buffer','funds','pension','bsu']){await pick(id);assert(await page.locator('#answerPanel').isVisible());assert.equal(await page.locator('.option-card').count(),2);}
  for(const width of [320,360,390,768,1280]){await page.setViewportSize({width,height:844});await noOverflow();}
  await page.reload();assert.equal(await page.locator('#question').inputValue(),'','Question must not be stored');
  assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
  await context.close();
  const desktop=await browser.newPage({viewport:{width:1280,height:900}});
  desktop.on('pageerror',e=>errors.push(e.message));await desktop.goto(origin+'/index.html');await desktop.locator('#chooseGrowth').click();await desktop.locator('#beginJourney').click();
  const range=desktop.locator('#monthlySlider');await range.scrollIntoViewIfNeeded();const b=await range.boundingBox();
  const graph=await desktop.locator('#chart svg').innerHTML(),total=await desktop.locator('#total').textContent();
  await desktop.mouse.move(b.x+b.width*.1,b.y+b.height/2);await desktop.mouse.down();await desktop.mouse.move(b.x+b.width*.7,b.y+b.height/2,{steps:5});
  assert.notEqual(await desktop.locator('#total').textContent(),total);assert.notEqual(await desktop.locator('#chart svg').innerHTML(),graph);await desktop.mouse.up();
  const value=await desktop.locator('#monthly').inputValue();await range.press('ArrowRight');assert.notEqual(await desktop.locator('#monthly').inputValue(),value);
  await desktop.locator('#monthly').fill('50000');await desktop.locator('#monthly').press('Tab');assert.equal(await desktop.locator('#monthly').inputValue(),'50 000');assert.equal(await range.getAttribute('max'),'20000','monthly slider keeps its fixed range');assert(await range.isDisabled(),'slider waits for a deliberate choice when the typed amount is outside its range');assert.match(await desktop.locator('#monthlySliderNote').innerText(),/går til 20\s000 kr/);
  await desktop.locator('.site-menu>summary').click();await desktop.locator('#share').click();
  const shared=new URLSearchParams(new URL(await desktop.locator('#shareUrl').inputValue()).hash.slice(1));
  assert.equal(shared.get('monthly'),'50000');
  for(const key of ['userAge','ageKnown','riskChosen','stress','ageGroup','purpose','buffer','debt','income','discipline'])assert.equal(shared.has(key),false,'Private field in shared URL: '+key);
  // Forklaring: søk på «inflasjon» gir en forklaring uten alternativkort, med tastatur, uten sideveis scrolling.
  for(const width of [320,390]){
   const ectx=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true}),page=await ectx.newPage(),eerrors=[];
   page.setDefaultTimeout(10000);page.on('pageerror',e=>eerrors.push(e.message));
   const search=async value=>{if(!await page.evaluate(()=>document.getElementById('searchBox').open))await page.locator('#searchBox>summary').click();await page.locator('#question').fill(value);await page.locator('#questionForm button').click();};
   const noOverflow=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal scrolling');
   await page.goto(origin+'/spor.html');
   await search('inflasjon');
   await page.locator('#answerTitle').waitFor();
   assert.equal(await page.locator('#answerTitle').textContent(),'Hva er kjøpekraft?');
   assert.equal(await page.locator('#answer .option-card').count(),0,'forklaring skal ikke ha alternativkort');
   assert.equal(await page.locator('#contextPanel').isHidden(),true,'profilfeltene skal ikke vises for en ren forklaring');
   assert.match(await page.locator('#answer .answer-lead').textContent(),/inflasjon/);
   assert.match(await page.locator('#answer .explain-example').textContent(),/ikke en prognose/);
   assert.equal(await page.locator('#answer .explain-terms dt').count(),3);
   assert.equal(await page.evaluate(()=>document.activeElement.id),'answerTitle','fokus skal flyttes til svaret');
   const deep=page.locator('#answer details.full-answer');
   assert.equal(await deep.getAttribute('open'),null,'fordypning er lukket til brukeren åpner den');
   await deep.locator('summary').focus();await page.keyboard.press('Enter');
   assert.notEqual(await deep.getAttribute('open'),null,'Enter åpner fordypning');
   assert.equal(await page.evaluate(()=>document.activeElement.tagName),'SUMMARY','fokus blir på knappen');
   await page.keyboard.press('Enter');assert.equal(await deep.getAttribute('open'),null,'Enter lukker igjen');
   await noOverflow();
   // ASK og fondskonto: forklaringer foran sammenligningene, og uavklart står som uavklart.
   await search('ASK');await page.locator('#answerTitle').waitFor();
   assert.equal(await page.locator('#answerTitle').textContent(),'Hva er en aksjesparekonto (ASK)?');
   assert.equal(await page.locator('#answer .option-card').count(),0);
   await search('Hva er Investeringskonto Zero?');
   assert.equal(await page.locator('#answerTitle').textContent(),'Hva er en fondskonto?');
   assert.equal(await page.locator('#answer .explain-terms dt').count(),5);
   assert.equal(await page.locator('#answer .option-card').count(),0);
   await page.locator('#answer details.answer-sources summary').focus();await page.keyboard.press('Enter');
   assert.match(await page.locator('#answer details.answer-sources').textContent(),/ikke kontrollert her/);
   assert.equal(await page.locator('#answer details.answer-sources a').count(),3);
   await noOverflow();
   await search('ASK eller fondskonto?');
   assert.equal(await page.locator('#answerTitle').textContent(),'ASK eller fondskonto?');
   assert.equal(await page.locator('#answer .option-card').count(),2);
   // Tilbake til et sammenligningssvar: profilfeltene kommer tilbake.
   await search('sparekonto');
   assert.equal(await page.locator('#contextPanel').isHidden(),false);
   assert.ok(await page.locator('#answer .option-card').count()>0);
   assert.deepEqual(eerrors,[]);await ectx.close();
  }
  // Søk med skrivefeil og særskriving, og ærlig bom med veier videre.
  for(const width of [320,390]){
   const sctx=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true}),page=await sctx.newPage(),serrors=[];
   page.setDefaultTimeout(10000);page.on('pageerror',e=>serrors.push(e.message));
   const search=async value=>{if(!await page.evaluate(()=>document.getElementById('searchBox').open))await page.locator('#searchBox>summary').click();await page.locator('#question').fill(value);await page.locator('#questionForm button').click();};
   const noOverflow=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal scrolling');
   await page.goto(origin+'/spor.html');
   for(const [typed,read] of [['boligflån','«boligflån» som «boliglån»'],['bolig lån','«bolig lån» som «boliglån»']]){
    await search(typed);await page.locator('#answerTitle').waitFor();
    assert.equal(await page.locator('#answerTitle').textContent(),'Boliglån eller sparing',typed);
    assert.match(await page.locator('#matchStatus').textContent(),new RegExp('Leste '+read),'siden skal si hva den leste');
   }
   await search('boliglån');assert.equal(await page.locator('#answerTitle').textContent(),'Boliglån eller sparing');
   assert.equal(await page.locator('#matchStatus').textContent(),'','riktig skrevet ord skal ikke få merknad');
   // Bom: ingen svar presenteres, og knappene sies å være veier videre.
   await search('husleie');
   assert.equal(await page.locator('#answerPanel').isHidden(),true,'ingen svar ved bom');
   assert.match(await page.locator('#matchStatus').textContent(),/Vi har ikke et svar på dette ennå/);
   assert.match(await page.locator('#matchStatus').textContent(),/ikke svar på spørsmålet ditt/);
   assert.equal(await page.locator('#matches button').count(),7,'de sju temaene');
   assert.equal(await page.locator('#matchStatus').getAttribute('role'),'status');
   await noOverflow();
   // Forslag to endringer unna: tilbys, ikke brukt som svar. Tastatur: Enter på knappen.
   await search('boligen');
   assert.equal(await page.locator('#answerPanel').isHidden(),true);
   const mente=page.locator('#matches button',{hasText:'Mente du «boliglån»?'});
   assert.equal(await mente.count(),1);await mente.focus();await page.keyboard.press('Enter');
   await page.locator('#answerTitle').waitFor();assert.equal(await page.locator('#answerTitle').textContent(),'Boliglån eller sparing');
   // Et tema fra bom-listen åpner det temaet.
   await search('husleie');await page.locator('#matches button',{hasText:'Studielån'}).click();
   assert.equal(await page.locator('#answerTitle').textContent(),'Studielån');
   assert.deepEqual(serrors,[]);await sctx.close();
  }
  assert.deepEqual(errors,[]);
  console.log('Browser: mobile touch, live result and curve, keyboard, profile relevance, independent horizons, preserved hidden fields, disclosure, privacy and responsive layouts passed.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

