// Brukerflyt med ugyldige tall. Krever playwright, som veileder-browser.cjs. SPARE_BROWSER kan peke på en Chromium.
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
  const open=async(hash='')=>{const c=await browser.newContext({viewport:{width:1280,height:900},acceptDownloads:true});const p=await c.newPage();p.errors=[];p.on('pageerror',e=>p.errors.push(e.message));p.setDefaultTimeout(10000);await p.goto(origin+hash);return p;};
  const click=(p,id)=>p.evaluate(i=>document.getElementById(i).click(),id);
  let p=await open();
  await p.locator('#chooseGrowth').click();
  await p.locator('#onboardAge').fill('130');await p.locator('#beginJourney').click();
  assert.match(await p.locator('#journeyError').innerText(),/120/);assert.equal(await p.locator('#onboardAge').getAttribute('aria-invalid'),'true');
  await p.locator('#onboardAge').fill('70');await p.locator('#beginJourney').click();assert.match(await p.locator('#journeyError').innerText(),/67 år eller eldre.*ingen sparetid/,'age 70 with until-67 gives a clear message, not 0 years');
  await p.locator('#onboardAge').fill('35');await p.locator('#onboardStart').fill('250000');await p.locator('#onboardStart').blur();
  assert.equal(await p.locator('#onboardStart').inputValue(),'250 000','start guide amounts are grouped when leaving the field');
  await p.locator('#onboardAge').fill('');await p.locator('#onboardAge').blur();assert.equal(await p.locator('#onboardAge').inputValue(),'','an empty optional age stays empty');
  await p.locator('#onboardAge').fill('35');await p.locator('#beginJourney').click();assert.equal(await p.evaluate(()=>s.start),250000);
  const total=await p.locator('#total').innerText(),years0=await p.locator('#years').inputValue();
  await p.locator('#years').fill('500');
  assert(await p.locator('#error').isVisible());assert.equal(await p.locator('#years').getAttribute('aria-invalid'),'true');
  assert(await p.evaluate(()=>document.getElementById('main').classList.contains('stale')),'results must be marked stale');
  assert.match(await p.locator('#error').innerText(),/ikke oppdatert/);
  assert.match(await p.locator('#years').getAttribute('aria-describedby'),/\berror\b/,'the field must point to the error message');
  assert.match(await p.locator('#error').innerText(),/«Du vil spare i»/,'the message must use the label shown on screen');
  for(const id of ['share','save']){await p.locator('#rate').focus();await click(p,id);assert.match(await p.locator('#toast').innerText(),/100 år/,id+' must be blocked');assert(!await p.evaluate(()=>document.getElementById('shareDialog').open||document.getElementById('saveDialog').open),id+' dialog must stay closed');assert.equal(await p.evaluate(()=>document.activeElement.id),'years',id+' must move focus to the invalid field');}
  await click(p,'reportButton');assert(!await p.evaluate(()=>document.getElementById('exportDialog').open),'export dialog must not open with invalid input');
  await p.evaluate(()=>document.getElementById('exportDialog').showModal());
  for(const id of ['exportXlsx','exportCsv','exportJson']){let dl=null;p.once('download',d=>dl=d);await click(p,id);await p.waitForTimeout(300);assert.equal(dl,null,id+' must not download invalid data');assert(await p.locator('#exportError').isVisible());}
  await p.evaluate(()=>document.querySelectorAll('dialog').forEach(d=>d.close()));
  await p.locator('#years').fill('100');await p.locator('#rate').fill('100');
  assert.match(await p.locator('#total').innerText(),/(billioner|billiarder|trillioner) kr|over/);assert.match(await p.locator('#secondary').innerText(),/mister praktisk mening/);
  assert(!/e\+\d/.test(await p.locator('main').innerText()),'no scientific notation');
  // Én forkortingsregel i resultatkortet: fra 1 milliard forkortes alle beløp. Ingen 10-sifrede tall skrevet ut.
  assert.deepEqual(await p.evaluate(()=>[money(999999999),money(1e9),money(433725710796),money(5.12e12),money(-2.5e9),money(1e12)]),
   ['999 999 999 kr','1 milliard kr','433,73 milliarder kr','5,12 billioner kr','−2,5 milliarder kr','1 billion kr'].map(x=>x.replace(/ (?=\d)/g,'\u00a0')));
  await p.locator('#years').fill('100');await p.locator('#rate').fill('15');await p.locator('#rate').blur();
  const card=await p.locator('#savingsResult').innerText();
  assert(!/\d{1,3}(?:[ \u00a0\u202f]\d{3}){3,}/.test(card),'Ingen beløp på milliarder skrevet ut i resultatkortet: '+card);
  assert.match(card,/milliarder kr|billioner kr/);
  // Eksakte beløp finnes i tabellvisningen.
  await p.evaluate(()=>{const b=document.getElementById('showTable')||document.querySelector('[data-view=table]');if(b)b.click();table();});
  const tableText=await p.evaluate(()=>document.getElementById('tableWrap').textContent);
  assert.match(tableText,/eksakte beløp/);assert(/\d{1,3}(?:[ \u00a0\u202f]\d{3}){3,} kr/.test(tableText),'Tabellen viser eksakte store beløp');
  await p.locator('#rate').fill('100');
  // Fortegn beholdes i både kort (akser) og lang form, også over 1 000 trillioner.
  assert.deepEqual(await p.evaluate(()=>[big(2e21,true),big(-2e21,true),big(-2e21),big(-5e18,true),axisCompact(-3e21),money(-2e21)]),
   ['over 1 000 trill.','under −1 000 trill.','under −1 000 trillioner kr','−5 trill.','under −1 000 trill.','under −1 000 trillioner kr']);
  await p.locator('#years').fill(years0);await p.locator('#rate').fill('5');
  assert.equal(await p.locator('#total').innerText(),total,'fixing the input must restore the result');assert(await p.locator('#error').isHidden());assert(!await p.evaluate(()=>document.getElementById('main').classList.contains('stale')));
  assert.deepEqual(p.errors,[]);
  // Delte lenker: bare ugyldige felt tilbakestilles, og brukeren får vite hvilke.
  p=await open('#start=100000&monthly=5000&years=500&rate=5&activePage=calculator');await p.waitForTimeout(300);
  assert.equal(await p.locator('#years').inputValue(),'10','invalid field must fall back to default');
  assert.equal(await p.locator('#monthly').inputValue(),'5 000','valid fields must be kept');assert.equal(await p.locator('#start').inputValue(),'100 000');
  assert.match(await p.locator('#toast').innerText(),/«Du vil spare i».*Resten av planen er beholdt/);assert.deepEqual(p.errors,[]);
  p=await open('#start=1000&monthly=500&years=15&rate=4&activePage=calculator');await p.waitForTimeout(300);
  assert.equal(await p.locator('#years').inputValue(),'15','valid shared link must be kept');assert.equal(await p.locator('#toast').innerText(),'','valid link gives no warning');
  p=await open('#activePage=dreams&dreamYears=500&dreamMonthly=4000&dreamCost=250000');await p.waitForTimeout(300);
  assert.equal(await p.locator('#dreamYears').inputValue(),'5');assert.equal(await p.locator('#dreamMonthly').inputValue(),'4 000');assert(await p.locator('#dreamError').isHidden());
  assert.match(await p.locator('#toast').innerText(),/«Tid til kjøpet»/);
  p=await open('#activePage=withdrawals&withdrawMode=tull&real=2&monthly=&rate=6');await p.waitForTimeout(300);
  assert.equal(await p.locator('#withdrawMode').inputValue(),'amount');assert.equal(await p.locator('#rate').inputValue(),'6');
  const linkToast=await p.locator('#toast').innerText();for(const name of ['Hva vil du finne ut?','Du sparer hver måned'])assert(linkToast.includes('«'+name+'»'),'toast must name '+name+': '+linkToast);
  p=await open('#activePage=tull');await p.waitForTimeout(300);assert.equal(await p.evaluate(()=>document.body.dataset.page),'calculator');assert.deepEqual(p.errors,[]);

  // Alle skyveknapper har faste grenser, også etter store gyldige og ugyldige tall.
  const slider=(q,id)=>q.evaluate(i=>{const r=document.getElementById(i+'Slider'),n=document.getElementById(i+'SliderNote');return {field:document.getElementById(i).value,min:r.min,max:r.max,value:r.value,disabled:r.disabled,note:n.hidden?'':n.innerText,describedBy:document.getElementById(i).getAttribute('aria-describedby')||''};},id);
  p=await open('#activePage=calculator&monthly=50000');await p.waitForTimeout(300);
  let sl=await slider(p,'monthly');
  assert.equal(sl.max,'20000');assert.equal(sl.field,'50 000');assert(sl.disabled);
  assert.match(sl.note,/20\s000 kr/);assert.match(sl.describedBy,/monthlySliderNote/);
  await p.locator('#monthlySlider').click({force:true});
  assert.equal(await p.locator('#monthly').inputValue(),'50 000');
  await p.locator('#monthly').fill('20000000');sl=await slider(p,'monthly');
  assert.equal(sl.max,'20000');assert(sl.disabled);assert.match(sl.note,/ugyldig/);
  await p.locator('#monthly').fill('50000');await p.locator('#monthlySliderUnlock').click();
  assert.equal(await p.evaluate(()=>document.activeElement.id),'monthlySlider');
  await p.keyboard.press('ArrowLeft');sl=await slider(p,'monthly');
  assert.equal(sl.field,'19 900');assert.equal(sl.note,'');assert.doesNotMatch(sl.describedBy,/SliderNote/);
  await p.locator('#monthlySlider').fill('500');assert.equal(await p.locator('#monthly').inputValue(),'500');
  await p.locator('#monthly').fill('60000');assert((await slider(p,'monthly')).disabled);
  await p.locator('#start').fill('2000000');sl=await slider(p,'start');
  assert.equal(sl.max,'1000000');assert(sl.disabled);assert.equal(sl.field,'2000000','no grouping while the user is typing');await p.locator('#start').blur();assert.equal(await p.locator('#start').inputValue(),'2 000 000','grouped when leaving the field');
  await p.locator('#start').fill('20000000000');sl=await slider(p,'start');
  assert.equal(sl.max,'1000000');assert(sl.disabled);
  await p.locator('#start').fill('0');await p.locator('#rate').fill('-5');sl=await slider(p,'rate');
  assert.equal(sl.min,'0');assert(sl.disabled);assert.match(sl.note,/fra 0 til 15/,'negative return is valid: the slider explains its range');assert.equal(await p.locator('#rate').inputValue(),'-5','the slider never rewrites a typed negative value');await p.locator('#rate').fill('5');
  await p.locator('#years').fill('70');assert.equal((await slider(p,'years')).max,'50');
  assert.deepEqual(p.errors,[]);
  p=await open('#activePage=dreams&dreamMonthly=25000&dreamCost=2500000');await p.waitForTimeout(300);
  sl=await slider(p,'dreamMonthly');assert.equal(sl.max,'20000');assert.equal(sl.field,'25 000');assert(sl.disabled);
  assert.equal((await slider(p,'dreamCost')).max,'1000000');
  await p.locator('#dreamMonthlySliderUnlock').click();await p.locator('#dreamMonthlySlider').fill('500');
  assert.equal(await p.locator('#dreamMonthly').inputValue(),'500');assert.deepEqual(p.errors,[]);
  {const c=await browser.newContext({viewport:{width:320,height:700},isMobile:true,hasTouch:true});const q=await c.newPage();await q.goto(origin+'#activePage=calculator&monthly=50000');await q.waitForTimeout(300);
   assert.equal(await q.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0,'no horizontal scroll at 320 px');
   const box=await q.locator('#monthlySliderUnlock').boundingBox();assert(box.height>=24&&box.width>=24,'unlock button target at least 24 px');
   await q.locator('#monthlySlider').tap({force:true});assert.equal(await q.locator('#monthly').inputValue(),'50 000','a tap on a locked slider does nothing');await c.close();}
  // Universell utforming: etter retting skal feltet ikke lenger være ugyldig eller koblet til en feilmelding.
  // Andre beskrivelser beholdes, og fokus blir værende i feltet brukeren skriver i.
  const a11y=(q,id)=>q.evaluate(i=>{const e=document.getElementById(i);return {invalid:e.getAttribute('aria-invalid'),ids:(e.getAttribute('aria-describedby')||'').split(' ').filter(Boolean),focus:document.activeElement.id};},id);
  const typeIn=async(q,id,v)=>{await q.locator('#'+id).focus();await q.keyboard.press('ControlOrMeta+A');await q.keyboard.type(v);};
  const fixed=(state,id,messageId,keep=[])=>{assert.notEqual(state.invalid,'true',id+' must not stay invalid');assert(!state.ids.includes(messageId),id+' must not point to '+messageId+': '+state.ids);for(const k of keep)assert(state.ids.includes(k),id+' must keep '+k);assert.equal(state.focus,id,'focus stays in '+id);};
  // Sparing, ett felt.
  p=await open('#activePage=calculator');await p.waitForTimeout(300);
  await typeIn(p,'years','500');let st=await a11y(p,'years');assert.equal(st.invalid,'true');assert(st.ids.includes('error')&&st.ids.includes('yearsDescription'));
  await typeIn(p,'years','10');fixed(await a11y(p,'years'),'years','error',['yearsDescription']);assert(await p.locator('#error').isHidden());assert.equal(await p.locator('#error').textContent(),'','old message text is removed');
  // Sparing, to felt: bare feltet meldingen gjelder er koblet til den.
  await typeIn(p,'years','500');await typeIn(p,'rate','500');await typeIn(p,'years','10');
  fixed(await a11y(p,'years'),'years','error',['yearsDescription']);st=await a11y(p,'rate');assert.equal(st.invalid,'true');assert(st.ids.includes('error'));assert.match(await p.locator('#error').innerText(),/Antatt årlig vekst/);
  await typeIn(p,'rate','5');fixed(await a11y(p,'rate'),'rate','error',['rateDescription']);
  // Tom tekst som ikke kan tolkes, beholder aria-invalid, men ikke koblingen til en melding om et annet felt.
  await typeIn(p,'years','500');await typeIn(p,'monthly','abc');st=await a11y(p,'monthly');assert.equal(st.invalid,'true');
  await typeIn(p,'years','10');assert.equal((await a11y(p,'years')).invalid,'false');
  await typeIn(p,'monthly','2000');fixed(await a11y(p,'monthly'),'monthly','error',['monthlyDescription']);assert(await p.locator('#error').isHidden());
  // Forklaringen til skyveknappen er en annen, gyldig beskrivelse som skal beholdes.
  await typeIn(p,'monthly','20000000');st=await a11y(p,'monthly');assert(st.ids.includes('error')&&st.ids.includes('monthlySliderNote'));
  await typeIn(p,'monthly','50000');fixed(await a11y(p,'monthly'),'monthly','error',['monthlyDescription','monthlySliderNote']);
  assert.deepEqual(p.errors,[]);
  // Uttak: felt som kontrolleres av kalkulatoren, og felt som kontrolleres av uttaksberegningen.
  p=await open('#activePage=withdrawals');await p.waitForTimeout(300);
  await typeIn(p,'annualWithdraw','2000000000');st=await a11y(p,'annualWithdraw');assert.equal(st.invalid,'true');assert(st.ids.includes('error'));
  await typeIn(p,'annualWithdraw','24000');fixed(await a11y(p,'annualWithdraw'),'annualWithdraw','error');
  await typeIn(p,'retireYears','0');st=await a11y(p,'retireYears');assert.equal(st.invalid,'true');assert(st.ids.includes('retirementResult'));
  await typeIn(p,'retireYears','20');fixed(await a11y(p,'retireYears'),'retireYears','retirementResult');
  await p.evaluate(()=>{document.getElementById('extraWithdraw').closest('details').open=true;});await typeIn(p,'extraWithdraw','1000');await typeIn(p,'extraWithdrawYear','2,5');st=await a11y(p,'extraWithdrawYear');assert.equal(st.invalid,'true');
  await typeIn(p,'extraWithdrawYear','3');fixed(await a11y(p,'extraWithdrawYear'),'extraWithdrawYear','retirementResult');
  assert.deepEqual(p.errors,[]);
  // Sparemål.
  p=await open('#activePage=dreams');await p.waitForTimeout(300);
  await typeIn(p,'dreamYears','500');st=await a11y(p,'dreamYears');assert.equal(st.invalid,'true');assert(st.ids.includes('dreamError'));
  await typeIn(p,'dreamMonthly','-5');await typeIn(p,'dreamYears','5');
  fixed(await a11y(p,'dreamYears'),'dreamYears','dreamError');st=await a11y(p,'dreamMonthly');assert.equal(st.invalid,'true');assert(st.ids.includes('dreamError'));
  await typeIn(p,'dreamMonthly','3000');fixed(await a11y(p,'dreamMonthly'),'dreamMonthly','dreamError');assert(await p.locator('#dreamError').isHidden());assert.equal(await p.locator('#dreamError').textContent(),'');
  assert.deepEqual(p.errors,[]);

  // Minustegn: siden viser negative tall med typografisk minus (−, U+2212). Både − og - skal leses riktig,
  // uten å ødelegge desimaltall, tusenskille eller ugyldige skrivemåter.
  p=await open('#activePage=calculator');await p.waitForTimeout(300);
  assert.deepEqual(await p.evaluate(()=>['−5','-5','−2,5','-2,5','2,5','−1 234,5','1 234','0','−0'].map(parsedNumber)),[-5,-5,-2.5,-2.5,2.5,-1234.5,1234,0,-0]);
  assert.deepEqual(await p.evaluate(()=>['5−','−−5','--5','−','– 5','1−2'].map(v=>Number.isNaN(parsedNumber(v)))),[true,true,true,true,true,true],'malformed minus stays invalid');
  // Negativ årlig avkastning kan skrives inn (beslutning 23.10.2026). Prisvekst og bankrente har fortsatt 0 % som nedre grense.
  p=await open('#activePage=calculator&rate=-2&inflation=-1&growth=-10&monthly=3000');await p.waitForTimeout(300);
  assert.deepEqual(await p.evaluate(()=>[s.rate,s.inflation,s.growth,s.monthly]),[-2,0,-10,3000],'negative return and growth are kept, negative inflation is set to 0');
  assert.equal(await p.locator('#rate').inputValue(),'\u22122');assert.equal(await p.locator('#growth').inputValue(),'\u221210','the page shows typographic minus');
  const adjustToast=await p.locator('#toast').innerText();
  assert.doesNotMatch(adjustToast,/Antatt årlig vekst/);assert.match(adjustToast,/«Prisvekst per år» fra −1/);assert.match(adjustToast,/Resten av planen er beholdt/);
  await p.locator('#monthly').fill('3500');assert(await p.locator('#error').isHidden(),'a negative growth value survives other edits');assert.equal(await p.evaluate(()=>s.growth),-10);
  // Skyveknappen for avkastning starter på 0 %, og felt som kan være negative har ikke desimaltastatur (iPhone mangler minus der).
  assert.equal(await p.locator('#rateSlider').getAttribute('min'),'0');
  assert.equal(await p.locator('#rate').getAttribute('inputmode'),null);assert.equal(await p.locator('#growth').getAttribute('inputmode'),null);assert.equal(await p.locator('#monthly').getAttribute('inputmode'),'decimal');
  // Skrevet negativ avkastning er gyldig, kan deles, og forklares som negativ avkastning, ikke som børsfall.
  await p.locator('#rate').fill('-3');assert(await p.locator('#error').isHidden());assert.notEqual(await p.locator('#rate').getAttribute('aria-invalid'),'true');
  {const t=await p.locator('#secondary').innerText();assert.match(t,/Negativ avkastning (og kostnadene )?gjør at/);assert.doesNotMatch(t,/Børsfallet/);}
  await click(p,'share');assert(await p.evaluate(()=>document.getElementById('shareDialog').open),'negative return can be shared');await click(p,'closeDialog');
  // −100 % og lavere er ugyldig: da finnes ingen månedlig vekst i modellen.
  await p.locator('#rate').fill('-100');await p.locator('#rate').blur();assert.match(await p.locator('#error').innerText(),/«Antatt årlig vekst» må være over −100\s%/);assert.equal(await p.locator('#rate').getAttribute('aria-invalid'),'true');
  await click(p,'share');assert(!await p.evaluate(()=>document.getElementById('shareDialog').open),'an invalid return cannot be shared');
  await p.locator('#rate').fill('0');assert(await p.locator('#error').isHidden());
  // Minustegn i feltet som fortsatt kan være negativt: begge tegn, med og uten desimaler, gir samme resultat.
  await p.evaluate(()=>{setLevel('advanced');for(let d=document.getElementById('growth').closest('details');d;d=d.parentElement?.closest('details'))d.open=true;});
  for(const [typed,expected] of [['-3',-3],['\u22123',-3],['\u22122,5',-2.5],['-0,5',-0.5]]){await p.locator('#growth').fill(typed);await p.locator('#growth').blur();await p.locator('#years').fill('11');assert(await p.locator('#error').isHidden(),typed);assert.equal(await p.evaluate(()=>s.growth),expected,typed);}
  await p.locator('#growth').fill('-3');const withHyphen=await p.locator('#total').innerText();await p.locator('#growth').fill('\u22123');assert.equal(await p.locator('#total').innerText(),withHyphen);
  await p.locator('#growth').fill('3\u2212');assert(await p.locator('#error').isVisible());assert.equal(await p.locator('#growth').getAttribute('aria-invalid'),'true');await p.locator('#growth').fill('0');
  assert.match(await p.locator('#growth').evaluate(e=>e.closest('.field').querySelector('.field-label').textContent),/endring/i,'growth is labelled as a change, not only an increase');
  // Tap mot innskuddene vises tydelig, også med positiv eller null vekst.
  await p.evaluate(()=>setLevel('simple'));
  await p.locator('#start').fill('0');await p.locator('#monthly').fill('8200');await p.locator('#years').fill('38,5');await p.locator('#rate').fill('0');
  assert.match(await p.locator('#gainLabel').innerText(),/Tap mot innskuddene/);assert.match(await p.locator('#gain').innerText(),/^−/);
  assert.match(await p.locator('#secondary').innerText(),/Kostnadene har redusert sparingen med [\d\s]+ kr\./,'0 % vekst: kostnadene er årsaken');assert.match(await p.locator('#mobileResultLabel').innerText(),/[\d\s]+ kr under innskuddene/);
  await p.locator('#rate').fill('5');assert.match(await p.locator('#gainLabel').innerText(),/Vekst etter kostnader/);assert.doesNotMatch(await p.locator('#mobileResultLabel').innerText(),/under innskuddene|tapt/);
  // Dagens kroner: tap i kroner omtales som omregnet, og lavere kjøpekraft kalles ikke tap.
  await p.locator('#rate').fill('0');await p.evaluate(()=>{const r=document.getElementById('real');r.checked=true;r.dispatchEvent(new Event('change',{bubbles:true}));r.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.equal(await p.evaluate(()=>s.real),true);
  assert.doesNotMatch(await p.locator('#secondary').innerText(),/prisvekst/,'0 % prisvekst: dagens kroner er lik kroner, og prisveksten nevnes ikke som årsak');
  await p.evaluate(()=>{document.getElementById('essentials').open=true});await p.locator('#inflation').fill('2,5');
  assert.match(await p.locator('#gainLabel').innerText(),/^Samlet tap i dagens kroner$/,'a loss in kroner plus price growth is not called only lost purchasing power');assert.match(await p.locator('#secondary').innerText(),/Det samlede tapet består av både tapet i kroner og prisveksten\./);assert.match(await p.locator('#secondary').innerText(),/Beløpet er i kroner, ikke justert for prisvekst/);
  await p.locator('#inflation').fill('0');
  // Uavhengig kontroll: 2 000 kr i 10 år, 2 % vekst, 0,2 % kostnad, 2,5 % prisvekst gir 262 492 kr, mer enn 240 000 kr innbetalt,
  // men 271 948 kr er innskuddene justert for prisvekst. Gapet er 7 387 kr i dagens kroner.
  await p.evaluate(()=>{for(let d=document.getElementById('inflation').closest('details');d;d=d.parentElement?.closest('details'))d.open=true;});await p.locator('#inflation').fill('2,5');await p.locator('#fee').fill('0,2');
  await p.locator('#monthly').fill('2000');await p.locator('#years').fill('10');await p.locator('#rate').fill('2');
  assert.match(await p.locator('#gainLabel').innerText(),/^Tapt kjøpekraft$/,'a purchasing-power gap is lost purchasing power');assert.doesNotMatch(await p.locator('#gainLabel').innerText(),/Tap mot innskuddene/,'a purchasing-power gap is not a loss in kroner');
  // Kjøpekraften forklares i «Dette betyr tallene dine», ikke i resultatkortet.
  assert.doesNotMatch(await p.locator('#secondary').innerText(),/holdt følge/);assert.match((await p.evaluate(()=>{renderMeaning();return document.getElementById('meaningMain').textContent})),/^Saldoen øker av innskuddene og avkastningen, men prisene stiger raskere enn pengene vokser\./);assert.match((await p.evaluate(()=>{renderMeaning();return document.getElementById('meaningDetails').textContent})),/Innskuddene tilsvarer 212\s446 kr i dagens kroner.*Det er 7\s387 kr mindre kjøpekraft enn innskuddene\./);
  assert.match(await p.locator('#mobileResultLabel').innerText(),/Lavere kjøpekraft enn innskuddene/);
  await p.evaluate(()=>{const r=document.getElementById('real');r.checked=false;r.dispatchEvent(new Event('change',{bubbles:true}));r.dispatchEvent(new Event('input',{bubbles:true}));});
  // I kroner: kort setning om kjøpekraft, uten beløp i dagens kroner, og ikke kalt tap.
  assert.match((await p.evaluate(()=>{renderMeaning();return document.getElementById('meaningMain').textContent})),/prisene stiger raskere enn pengene vokser/,'samme forklaring i begge visninger');
  assert.doesNotMatch(await p.locator('#secondary').innerText(),/tapt|lavere enn innskuddene justert|holdt følge/);assert.match(await p.locator('#mobileResultLabel').innerText(),/Lavere kjøpekraft enn innskuddene/);
  // Indeksfond med stort børsfall: verdien blir aldri negativ, heller ikke ved 100 % fall.
  await p.evaluate(()=>{setLevel('advanced');for(let d=document.getElementById('crash').closest('details');d;d=d.parentElement?.closest('details'))d.open=true;});
  for(const fall of ['50','90','100']){await p.locator('#start').fill('200000');await p.locator('#monthly').fill('3000');await p.locator('#years').fill('20');await p.locator('#rate').fill('7');await p.locator('#crash').fill(fall);await p.locator('#crashYear').fill('5');
   assert(await p.locator('#error').isHidden(),fall);const minRow=await p.evaluate(()=>Math.min(...rows.map(r=>r.v)));assert(minRow>=0,'fund value never negative at '+fall+' %: '+minRow);
   assert.doesNotMatch(await p.locator('#total').innerText(),/^−/);}
  await p.locator('#crashYear').fill('20');await p.locator('#start').fill('500000');await p.locator('#monthly').fill('0');await p.locator('#crash').fill('100');
  assert.equal(await p.locator('#total').innerText(),'0 kr','a 100 % fall at the end leaves 0 kr, never less');assert.match(await p.locator('#gainLabel').innerText(),/Tap mot innskuddene/);
  // Tre formuleringer, vurdert på den faktiske verdien i kroner, også i visningen med dagens kroner.
  const realView=on=>p.evaluate(v=>{const r=document.getElementById('real');r.checked=v;r.dispatchEvent(new Event('change',{bubbles:true}));r.dispatchEvent(new Event('input',{bubbles:true}));},on);
  const sec=()=>p.locator('#secondary').innerText();
  for(const real of [false,true]){await realView(real);
   // 100 % fall helt på slutten: den faktiske verdien er 0 kr.
   assert.equal(await p.evaluate(()=>E.value(s,s.years)),0);assert.match(await sec(),/Du har tapt alle pengene du har investert\./,'all lost, real='+real);
   assert.match(await p.locator('#mobileResultLabel').innerText(),/Alle innskuddene er tapt/);
   // Nesten 100 % fall: noen øre igjen. Skjermen kan vise 0 kr, men det står ikke at alt er tapt.
   await p.locator('#crash').fill('99,99999');const left=await p.evaluate(()=>E.value(s,s.years));assert(left>0&&left<1,'tiny remainder: '+left);
   assert.doesNotMatch(await sec(),/tapt alle pengene/,'rounding to 0 kr on screen is not the same as losing everything, real='+real);assert.match(await sec(),/nesten alle pengene du har investert\. Under 1 kr er igjen/);
   await p.locator('#crash').fill('100');}
  await realView(false);
  // Delvis tap: 100 000 kr i 10 år med 0 % vekst og 0,2 % kostnad gir 98 018 kr. Uavhengig kontroll: tap 1 982 kr.
  await p.locator('#crash').fill('0');await p.locator('#start').fill('100000');await p.locator('#rate').fill('0');await p.locator('#years').fill('10');
  assert.match(await p.locator('#total').innerText(),/^98\s018 kr$/);assert.match(await sec(),/Kostnadene har redusert sparingen med 1\s982 kr\./);assert.doesNotMatch(await sec(),/alle pengene/);
  await realView(true);assert.match(await sec(),/Kostnadene har redusert sparingen med 1\s982 kr\. Beløpet er i kroner, ikke justert for prisvekst\./,'the loss in kroner is the same in today-kroner view');await realView(false);
  // Børsfall: årsaken nevnes, og kostnadene får ikke hele skylden når fallet også bidrar.
  await p.locator('#crash').fill('30');await p.locator('#crashYear').fill('5');
  assert.match(await sec(),/^Det tilsvarer [\d\s]+ kr med dagens priser\. Børsfallet og kostnadene gjør at du har [\d\s]+ kr mindre enn du har satt inn\.$/);
  await p.locator('#fee').fill('0');assert.match(await sec(),/Børsfallet gjør at du har 30\s000 kr mindre enn du har satt inn\./);await p.locator('#fee').fill('0,2');await p.locator('#crash').fill('0');
  // Uten innskudd er ingenting tapt.
  await p.locator('#start').fill('0');await p.locator('#crash').fill('100');await p.locator('#crashYear').fill('10');
  assert.equal(await p.locator('#total').innerText(),'0 kr');assert.doesNotMatch(await sec(),/tapt/,'no deposits, nothing lost');
  await realView(true);assert.doesNotMatch(await sec(),/tapt|ikke holdt følge/);await realView(false);
  await p.locator('#crash').fill('0');
  // Innskudd i dagens kroner (PR #12). Uavhengig kontroll: 100 000 kr, 0 % vekst, 0 % kostnad, 2,5 % prisvekst, 10 år.
  // Kontoen viser 100 000 kr. Startbeløpet er allerede i dagens kroner og skal ikke vises som 78 120 kr.
  // Sluttverdien er 100 000 / 1,025^10 = 78 120 kr i dagens kroner, altså 21 880 kr tapt kjøpekraft.
  const metric=async id=>Number((await p.locator(id).innerText()).replace(/[^\d\u2212-]/g,'').replace('\u2212','-'));
  await p.locator('#start').fill('100000');await p.locator('#monthly').fill('0');await p.locator('#rate').fill('0');await p.locator('#fee').fill('0');await p.locator('#inflation').fill('2,5');await p.locator('#years').fill('10');
  await realView(true);
  assert.equal(await metric('#total'),78120);assert.equal(await metric('#paid'),100000,'start capital keeps its value in today-kroner view');
  assert.equal(await metric('#gain'),-21880);assert.match(await p.locator('#gainLabel').innerText(),/^Tapt kjøpekraft$/);
  assert.match(await p.locator('#paidLabel').innerText(),/Innskudd i dagens kroner/);assert(await p.locator('#paidNote').isHidden(),'no note when the amounts are equal');
  assert.equal((await p.evaluate(()=>{renderMeaning();return document.getElementById('meaningMain').textContent})),'Beløpet på kontoen er uendret, men pengene kjøper mindre etter hvert som prisene stiger.');assert.match((await p.evaluate(()=>{renderMeaning();return document.getElementById('meaningDetails').textContent})),/Det er 21\s880 kr mindre kjøpekraft enn innskuddene\./);
  assert.doesNotMatch(await sec(),/økt i verdi|tapt [\d\s]+ kr av pengene|samlede tapet/,'standing still in kroner is not growth and not a loss in kroner');
  assert.equal(await p.evaluate(()=>rows[0].paid),100000);assert.equal(Math.round(await p.evaluate(()=>rows.at(-1).paid)),100000,'chart deposit line stays at 100 000 in today kroner');
  // Bankkonto, 0,2 % rente: 102 018 kr på kontoen, 79 696 kr i dagens kroner.
  await p.locator('#rate').fill('0,2');assert.equal(await metric('#total'),79696);assert.equal(await metric('#paid'),100000);assert.equal(await metric('#gain'),-20304);
  assert.match(await sec(),/Kontoen viser da 102\s018 kr/);assert.equal((await p.evaluate(()=>{renderMeaning();return document.getElementById('meaningMain').textContent})),'Du får flere kroner på kontoen, men prisene stiger raskere enn pengene vokser.');
  // Månedssparing: innskudd + vekst = sluttbeløp i begge visninger, og det faktiske kronebeløpet står under.
  await p.locator('#start').fill('0');await p.locator('#monthly').fill('2000');await p.locator('#rate').fill('2');await p.locator('#fee').fill('0,2');
  assert.equal(await metric('#paid'),212446);assert.match(await p.locator('#paidNote').innerText(),/^Du setter inn 240\s000 kr$/);
  for(const real of [true,false]){await realView(real);assert(Math.abs(await metric('#paid')+await metric('#gain')-await metric('#total'))<=1,'deposits + growth = total, real='+real);}
  assert.equal(await metric('#paid'),240000);assert.match(await p.locator('#paidLabel').innerText(),/^Du setter inn$/);assert(await p.locator('#paidNote').isHidden());
  await realView(true);assert.match(await p.locator('#tableWrap').evaluate(e=>e.textContent),/Innskudd i dagens kr/);
  assert.match(await p.locator('#chartLegend').evaluate(e=>e.textContent),/Innskudd i dagens kroner/);
  await realView(false);await p.locator('#monthly').fill('2000');
  await p.evaluate(()=>setLevel('simple'));
  await p.evaluate(()=>setLevel('simple'));
  // Test A til D fra oppdraget, i enkel visning. Tallene er kontrollert mot en uavhengig månedsløkke i results.test.cjs.
  const fillPlan=async(v)=>{for(const [id,x] of Object.entries(v)){await p.locator('#'+id).fill(x);}await p.locator('#years').blur();};
  await fillPlan({start:'10000',monthly:'2000',years:'40',rate:'0',inflation:'0',fee:'0'});
  assert.match(await p.locator('#total').innerText(),/^970\s000 kr$/);assert.equal(await sec(),'','A: ingen setning om dagens priser når prisveksten er 0 %');assert(await p.locator('#secondary').isHidden());
  assert.match(await p.locator('#gainLabel').innerText(),/^Beregnet vekst$/);
  await fillPlan({fee:'0,2'});
  assert.match(await p.locator('#total').innerText(),/^931\s875 kr$/);assert.match(await sec(),/^Kostnadene har redusert sparingen med 38\s125 kr\.$/,'B');
  await fillPlan({years:'30',inflation:'2,5'});
  assert.match(await p.locator('#total').innerText(),/^708\s280 kr$/);assert.match(await sec(),/^Det tilsvarer 337\s667 kr med dagens priser\. Kostnadene har redusert sparingen med 21\s720 kr\.$/,'C');
  await fillPlan({rate:'5'});
  assert.match(await p.locator('#total').innerText(),/^1\s612\s393 kr$/);assert.match(await sec(),/^Det tilsvarer 768\s697 kr med dagens priser\.$/,'D');
  assert.match(await p.locator('#gainLabel').innerText(),/^Vekst etter kostnader$/);assert.match(await p.locator('#gain').innerText(),/^882\s393 kr$/);assert.match(await p.locator('#mobileResultLabel').innerText(),/^Regneeksempel · før skatt$/);
  // Glidebryter og tallfelt gir samme beregning.
  const typed=await p.locator('#total').innerText();await p.locator('#rate').fill('0');
  await p.evaluate(()=>{const r=document.getElementById('rateSlider');r.value='5';r.dispatchEvent(new Event('input',{bubbles:true}));r.dispatchEvent(new Event('change',{bubbles:true}));});
  assert.equal(await p.evaluate(()=>s.rate),5);assert.equal(await p.locator('#total').innerText(),typed,'slider and field give the same result');
  // Skjermbilde: 0 % vekst og 3 % prisvekst. Ingen tap i kroner, men lavere kjøpekraft.
  await fillPlan({years:'40',rate:'0',inflation:'3',fee:'0'});
  assert.match(await sec(),/^Det tilsvarer 297\s360 kr med dagens priser\.$/);assert.match((await p.evaluate(()=>{renderMeaning();return document.getElementById('meaningMain').textContent})),/^Saldoen øker bare fordi du setter inn nye penger\./);assert.doesNotMatch(await sec(),/tapt|mindre enn du har satt inn/);
  for(const w of [375,390,430]){await p.setViewportSize({width:w,height:800});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'no horizontal scroll at '+w);
   assert.equal(await p.evaluate(()=>{const c=document.querySelector('.hero-result');return [...c.querySelectorAll('#total,#secondary,.metrics strong')].every(e=>e.getBoundingClientRect().right<=c.getBoundingClientRect().right+0.5);}),true,'result card text stays inside the card at '+w);}
  await p.setViewportSize({width:1280,height:900});await fillPlan({start:'0',monthly:'2000',years:'10',rate:'5',inflation:'2,5',fee:'0,2'});
  assert.deepEqual(p.errors,[]);

  // Tusenskille: feltene viser grupperte tall, beregningen bruker samme tallverdi, og markøren hopper ikke mens brukeren skriver.
  p=await open('#activePage=calculator&start=141762452&monthly=5000&years=10&rate=5');await p.waitForTimeout(300);
  assert.equal(await p.locator('#start').inputValue(),'141 762 452');assert.equal(await p.evaluate(()=>s.start),141762452);
  const groupedTotal=await p.locator('#total').innerText();
  await p.locator('#start').fill('141762452');await p.locator('#start').blur();assert.equal(await p.locator('#total').innerText(),groupedTotal,'grouped and plain input give the same result');
  for(const [typed,shown,value] of [['100000','100 000',100000],['1000000','1 000 000',1000000],['10000000','10 000 000',10000000],['0','0',0]]){
   await p.locator('#start').fill(typed);assert.equal(await p.locator('#start').inputValue(),typed,'no change while typing');await p.locator('#start').blur();
   assert.equal(await p.locator('#start').inputValue(),shown);assert.equal(await p.evaluate(()=>s.start),value);}
  // Redigering av et gruppert tall: slett siste siffer.
  await p.locator('#start').fill('1 000 000');await p.locator('#start').blur();await p.locator('#start').focus();await p.keyboard.press('End');await p.keyboard.press('Backspace');
  assert.equal(await p.evaluate(()=>s.start),100000);assert(await p.locator('#error').isHidden());await p.locator('#start').blur();assert.equal(await p.locator('#start').inputValue(),'100 000');
  // Desimaler og negative tall.
  await p.locator('#rate').fill('2,5');await p.locator('#rate').blur();assert.equal(await p.locator('#rate').inputValue(),'2,5');
  await p.evaluate(()=>{for(let d=document.getElementById('inflation').closest('details');d;d=d.parentElement?.closest('details'))d.open=true;});
  await p.locator('#inflation').fill('1,25');await p.locator('#inflation').blur();assert.equal(await p.locator('#inflation').inputValue(),'1,25');
  await p.locator('#years').fill('12');assert(await p.locator('#error').isHidden(),'grouped decimal survives other edits');assert.deepEqual(await p.evaluate(()=>[s.rate,s.inflation,s.years]),[2.5,1.25,12]);
  // Skyveknappen skriver grupperte tall direkte.
  await p.locator('#startSlider').fill('250000');assert.equal(await p.locator('#start').inputValue(),'250 000');assert.equal(await p.evaluate(()=>s.start),250000);
  await p.locator('#monthlySlider').fill('15000');assert.equal(await p.locator('#monthly').inputValue(),'15 000');
  // Delt lenke inneholder rene tall uten mellomrom.
  await click(p,'share');const groupedLink=await p.locator('#shareUrl').inputValue();assert.match(groupedLink,/start=250000&/);assert.match(groupedLink,/monthly=15000&/);assert.doesNotMatch(groupedLink,/%20|\+|%C2%A0/);
  await p.evaluate(()=>document.getElementById('shareDialog').close());assert.deepEqual(p.errors,[]);
  // Mobil 375 px: store grupperte beløp gir ingen horisontal scrolling.
  {const c=await browser.newContext({viewport:{width:375,height:740},isMobile:true,hasTouch:true});const q=await c.newPage();q.errors=[];q.on('pageerror',e=>q.errors.push(e.message));
   await q.goto(origin+'#activePage=calculator&start=9999999999&monthly=50000&rate=3&growth=-3&years=40');await q.waitForTimeout(300);
   assert.equal(await q.locator('#start').inputValue(),'9 999 999 999');assert.equal(await q.locator('#growth').inputValue(),'\u22123');
   assert.equal(await q.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0,'no horizontal scroll at 375 px');assert(await q.locator('#error').isHidden());
   assert((await q.locator('#startSlider').isDisabled())&&(await q.locator('#monthlySlider').isDisabled()),'large valid amounts lock their sliders');assert.deepEqual(q.errors,[]);await c.close();}

  // Sparetid 0 år gir ingen innskudd og et meningsløst resultat. Minst én måned, også i lenker og på skyveknappen.
  p=await open('#activePage=calculator&monthly=3000&rate=10');await p.waitForTimeout(300);
  await p.locator('#years').fill('0');assert(await p.locator('#error').isVisible());assert.match(await p.locator('#error').innerText(),/«Du vil spare i» må være fra én måned/);
  await click(p,'share');assert(!await p.evaluate(()=>document.getElementById('shareDialog').open),'0 years cannot be shared');
  assert.equal(await p.locator('#yearsSlider').getAttribute('min'),'0.5');assert(await p.locator('#yearsSlider').isDisabled(),'0 years locks the slider until the user chooses it');await p.locator('#yearsSliderUnlock').click();await p.locator('#yearsSlider').fill('0.5');assert(await p.locator('#error').isHidden(),'the slider minimum is valid');
  assert.notEqual(await p.locator('#total').innerText(),'0 kr','3 000 kr a month for half a year is more than 0 kr');
  // Én måned kan skrives inn slik folk skriver den, og perioder under ett år vises i måneder.
  for(const typed of ['0,0833','0,08','0,1']){await p.locator('#years').fill(typed);assert(await p.locator('#error').isHidden(),typed+' is one month');
   assert.equal(await p.locator('#resultLabel').innerText(),'ETTER 1 MÅNED KAN DU HA');assert.match(await p.locator('#total').innerText(),/^3\s000 kr$/);}
  await p.locator('#years').fill('0,04');assert(await p.locator('#error').isVisible(),'less than half a month is not a month');
  await p.locator('#years').fill('0,5');assert.equal(await p.locator('#resultLabel').innerText(),'ETTER 6 MÅNEDER KAN DU HA');
  await p.locator('#years').fill('1');assert.equal(await p.locator('#resultLabel').innerText(),'ETTER 1 ÅR KAN DU HA');
  p=await open('#activePage=calculator&monthly=3000&years=0');await p.waitForTimeout(300);assert.equal(await p.evaluate(()=>s.years),10);assert.match(await p.locator('#toast').innerText(),/«Du vil spare i»/);
  p=await open('#activePage=dreams');await p.waitForTimeout(300);assert.equal(await p.locator('#dreamYearsSlider').getAttribute('min'),'0.5');await p.locator('#dreamYearsSlider').fill('0.5');assert(await p.locator('#dreamError').isHidden());await p.locator('#dreamYears').fill('0,0833');assert(await p.locator('#dreamError').isHidden(),'one month typed in the goal module');
  // Aksetallene er runde og forskjellige, og en tom plan viser en forklaring i stedet for en graf.
  p=await open('#activePage=calculator');await p.waitForTimeout(300);
  for(const [start,monthly,years] of [['0','2000','10'],['0','3000','1'],['250000','0','5'],['0','100','0,5'],['1000000','20000','40']]){
   await p.locator('#start').fill(start);await p.locator('#monthly').fill(monthly);await p.locator('#years').fill(years);
   const labels=await p.evaluate(()=>[...document.querySelectorAll('#chart svg text[text-anchor="end"]')].map(t=>t.textContent).filter(x=>!/ (år|mnd)$/.test(x)));
   assert.equal(labels.length,5,'five axis labels');assert.equal(new Set(labels).size,5,'axis labels must differ: '+labels.join(' | '));assert.equal(labels[0],'0');}
  await p.locator('#start').fill('0');await p.locator('#monthly').fill('0');
  assert(await p.locator('#chart .chart-empty').isVisible(),'empty plan shows an explanation');assert.equal(await p.locator('#chart svg').count(),0);
  await p.locator('#monthly').fill('2000');assert.equal(await p.locator('#chart svg').count(),1);assert.deepEqual(p.errors,[]);

  // Sparemål: egne feltnavn, riktig felt markert, og ugyldige mål kan ikke deles, lagres eller eksporteres.
  p=await open('#activePage=dreams');await p.waitForTimeout(300);
  await p.locator('#dreamMonthly').fill('20000000');
  assert.match(await p.locator('#dreamError').innerText(),/«Jeg kan spare per måned»/);
  assert.equal(await p.locator('#dreamMonthly').getAttribute('aria-invalid'),'true');assert.match(await p.locator('#dreamMonthly').getAttribute('aria-describedby'),/dreamError/);
  assert.notEqual(await p.locator('#monthly').getAttribute('aria-invalid'),'true','the savings field must not be marked for a goal error');
  for(const id of ['share','save','reportButton']){await click(p,id);await p.waitForTimeout(100);assert(!await p.evaluate(()=>[...document.querySelectorAll('dialog')].some(d=>d.open)),id+' must be blocked for an invalid goal');assert.match(await p.locator('#toast').innerText(),/Jeg kan spare per måned/);}
  await p.evaluate(()=>setPage('calculator'));assert.equal(await p.evaluate(()=>document.body.dataset.page),'calculator');
  await click(p,'share');assert(!await p.evaluate(()=>document.getElementById('shareDialog').open),'an invalid goal must also block sharing from another page');
  assert.equal(await p.evaluate(()=>document.body.dataset.page),'dreams','user is taken to the goal field');assert.equal(await p.evaluate(()=>document.activeElement.id),'dreamMonthly');
  await p.locator('#dreamYears').fill('0');await p.locator('#dreamMonthly').fill('3000');
  assert.match(await p.locator('#dreamError').innerText(),/«Tid til kjøpet».*én måned/);assert.equal(await p.locator('#dreamYears').getAttribute('aria-invalid'),'true');assert.notEqual(await p.locator('#dreamMonthly').getAttribute('aria-invalid'),'true');
  await p.locator('#dreamYears').fill('5');assert(await p.locator('#dreamError').isHidden());assert.notEqual(await p.locator('#dreamYears').getAttribute('aria-invalid'),'true');
  await click(p,'share');assert(await p.evaluate(()=>document.getElementById('shareDialog').open),'a valid goal can be shared');assert.match(await p.locator('#shareUrl').inputValue(),/dreamMonthly=3000/);
  assert.deepEqual(p.errors,[]);

  // Uttak: beregningsfeil i aktiv modul markerer feltet og stopper deling.
  p=await open('#activePage=withdrawals&retireYears=0');await p.waitForTimeout(300);
  assert.match(await p.locator('#retirementResult').innerText(),/«År med uttak»/);assert.equal(await p.locator('#retireYears').getAttribute('aria-invalid'),'true');
  await click(p,'share');assert(!await p.evaluate(()=>document.getElementById('shareDialog').open),'withdrawal error must block sharing');assert.equal(await p.evaluate(()=>document.activeElement.id),'retireYears');
  await p.locator('#retireYears').fill('20');assert.notEqual(await p.locator('#retireYears').getAttribute('aria-invalid'),'true');
  await click(p,'share');assert(await p.evaluate(()=>document.getElementById('shareDialog').open));assert.deepEqual(p.errors,[]);

  // Lagrede planer fra før grensene ble innført: ugyldige felt tilbakestilles og nevnes, resten beholdes.
  {const c=await browser.newContext({viewport:{width:1280,height:900}});await c.addInitScript(()=>{if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','1');localStorage.setItem('sv-scenarios',JSON.stringify([{name:'Gammel plan',state:{years:500,monthly:4321,rate:6,inflation:-1,withdrawMode:'tull'},mode:'explore',view:{}}]));}});
   const q=await c.newPage();q.errors=[];q.on('pageerror',e=>q.errors.push(e.message));await q.goto(origin+'#start=0&activePage=calculator');await q.waitForTimeout(300);
   await q.evaluate(()=>{document.getElementById('savedDetails').open=true;});await q.locator('button[aria-label="Åpne Gammel plan"]').click();
   assert.equal(await q.locator('#monthly').inputValue(),'4 321');assert.equal(await q.locator('#years').inputValue(),'10');
   assert.match(await q.locator('#undoText').innerText(),/«Du vil spare i»/);assert.match(await q.locator('#undoText').innerText(),/«Prisvekst per år» fra −1\s%\s*til 0 %/);assert.equal(await q.evaluate(()=>s.inflation),0);assert(await q.locator('#error').isHidden());assert.deepEqual(q.errors,[]);await c.close();}
  console.log('Passed: invalid input flow, blocked share/save/export with focus, stale marking, large numbers, field-by-field shared links, goal and withdrawal validation, and old saved plans.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
