// Tilgjengelighet i Chromium, målt mot konkrete WCAG 2.2-krav:
// 1.4.3 kontrast (tekst), 1.4.11 kontrast (grafens tekst og linjer), 2.5.8 trykkflater, 4.1.2 navn,
// 1.4.10 reflow (320 px = 400 % zoom, 640 px = 200 % zoom på 1280 px), 2.4.7 synlig fokus, 2.1.1 tastatur,
// og at faste elementer ikke dekker feltet med fokus på korte skjermer (2.4.11).
// Ingen avvik funnet betyr bare ingen avvik funnet i de gjennomførte kontrollene.
// Dette er Chromium. Det erstatter ikke kontroll i Safari, Firefox, VoiceOver eller NVDA.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'../dist');
 const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 let browser;const problems=[];const errors=[];
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.SPARE_BROWSER?{executablePath:process.env.SPARE_BROWSER}:{})});
  const PLAN='start=12000&monthly=4000&years=22&savingsType=index&rate=7.11&showRange=1&showBank=1';
  const screens={
   start:async p=>{await p.goto(origin+'/index.html');await p.evaluate(()=>{localStorage.removeItem('sv-started');sessionStorage.clear();});await p.reload();},
   kalkulator:async p=>{await p.goto(origin+'/index.html#'+PLAN);await p.reload();await p.evaluate(()=>{for(const d of document.querySelectorAll('#workbench details'))d.open=true;});},
   veileder:async p=>{await p.goto(origin+'/spor.html');await p.evaluate(()=>{for(const d of document.querySelectorAll('details'))d.open=true;});await p.locator('[data-topic]').first().click();},
   om:async p=>{await p.goto(origin+'/om.html');},
   personvern:async p=>{await p.goto(origin+'/personvern.html');},
   tilgjengelighet:async p=>{await p.goto(origin+'/tilgjengelighet.html');}};
  const page=async(theme,width,height=800)=>{const ctx=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(t=>{try{sessionStorage.setItem('sv-color-theme',t);}catch{}},theme);return p;};

  // Målingene kjører i siden. De er de samme som i revisjonen 23.10.2026 (se docs i prosjektet).
  const measure=p=>p.evaluate(()=>{
   const vis=e=>{const st=getComputedStyle(e),rc=e.getBoundingClientRect();return st.visibility!=='hidden'&&st.display!=='none'&&rc.width>0&&rc.height>0&&!e.closest('[hidden],dialog:not([open])')&&st.opacity!=='0';};
   const sel=e=>{let s=e.tagName.toLowerCase();if(e.id)return s+'#'+e.id;const c=[...e.classList].slice(0,2).join('.');if(c)s+='.'+c;return (e.parentElement&&e.parentElement.id?'#'+e.parentElement.id+'>':'')+s;};
   const rgb=c=>{const m=c&&c.match(/rgba?\(([^)]+)\)/);if(!m)return null;const v=m[1].split(/[ ,\/]+/).filter(Boolean).map(Number);return {r:v[0],g:v[1],b:v[2],a:v.length>3?v[3]:1};};
   const lum=({r,g,b})=>{const f=x=>{x/=255;return x<=0.03928?x/12.92:((x+0.055)/1.055)**2.4};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b);};
   const blend=(f,bg)=>({r:f.r*f.a+bg.r*(1-f.a),g:f.g*f.a+bg.g*(1-f.a),b:f.b*f.a+bg.b*(1-f.a),a:1});
   const bgOf=e=>{const layers=[];for(let n=e;n;n=n.parentElement){const c=rgb(getComputedStyle(n).backgroundColor);if(c&&c.a>0){layers.push(c);if(c.a>=1)break;}}let bg={r:255,g:255,b:255,a:1};for(const l of layers.reverse())bg=blend(l,bg);return bg;};
   const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);};
   const out=[];
   for(const e of document.querySelectorAll('body *')){
    if(!vis(e)||e.closest('svg'))continue;
    if(![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&!['INPUT','SELECT','TEXTAREA'].includes(e.tagName))continue;
    if(e.disabled||e.closest(':disabled,[aria-disabled=true]'))continue;
    const st=getComputedStyle(e),fg=rgb(st.color);if(!fg)continue;const bg=bgOf(e),size=parseFloat(st.fontSize),large=size>=24||(parseInt(st.fontWeight)>=700&&size>=18.66);
    const rt=ratio(blend(fg,bg),bg);if(rt<(large?3:4.5))out.push(`kontrast ${rt.toFixed(2)}:1 ${sel(e)} «${(e.value||e.textContent).trim().slice(0,30)}»`);
   }
   const chart=document.getElementById('chart');
   if(chart&&vis(chart)){const bg=bgOf(chart);
    for(const e of chart.querySelectorAll('text')){const c=rgb(getComputedStyle(e).fill);if(c){const rt=ratio(blend(c,bg),bg);if(rt<4.5)out.push(`graftekst ${rt.toFixed(2)}:1 «${e.textContent}»`);}}
    for(const e of chart.querySelectorAll('path')){const st=getComputedStyle(e),c=rgb(st.stroke);if(!c||parseFloat(st.strokeWidth)<1.5)continue;const rt=ratio(blend({...c,a:c.a*parseFloat(st.opacity)*parseFloat(st.strokeOpacity||1)},bg),bg);if(rt<3)out.push(`graflinje ${rt.toFixed(2)}:1`);}}
   // Kantlinjer må finnes og ha minst 3:1 mot både panelet og flatene de grenser til.
   if(chart&&vis(chart)&&document.getElementById('showRange')?.checked){
    const band=chart.querySelector('path[fill="#c5d9b5"]'),bg=bgOf(chart);
    if(!band)out.push('utfallsrom mangler fyllflate');
    else{
     const st=getComputedStyle(band),fill=rgb(st.fill),bandBg=blend({...fill,a:fill.a*parseFloat(st.opacity)},bg);
     const stop=chart.querySelector('#spareArea stop'),areaColor=rgb(getComputedStyle(stop).stopColor),areaBg=blend({...areaColor,a:parseFloat(getComputedStyle(stop).stopOpacity)},bandBg);
     for(const color of ['#a77547','#637ca2']){
      const edge=chart.querySelector('path[stroke="'+color+'"]');
      if(!edge){out.push('utfallsrom mangler kantlinje '+color);continue;}
      const es=getComputedStyle(edge),c=rgb(es.stroke);
      if(parseFloat(es.strokeWidth)<1.7)out.push('for tynn kantlinje '+color);
      for(const surface of [bg,bandBg,areaBg]){const rt=ratio(c,surface);if(rt<3)out.push('utfallsrom kantlinje '+color+' '+rt.toFixed(2)+':1 mot tilstøtende flate');}
     }
    }
    const badge=document.querySelector('.before-tax-badge');
    if(parseFloat(getComputedStyle(badge).fontSize)<14)out.push('skatteforbehold under 14 px');
   }
   const targets=[...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[tabindex="0"]')].filter(vis);
   const rects=targets.map(e=>e.getBoundingClientRect());
   targets.forEach((e,i)=>{const rc=rects[i];if(rc.width>=24&&rc.height>=24)return;
    // Unntak i 2.5.8: lenker i løpende tekst, og mål med nok avstand (24 px sirkel) til andre mål.
    if(e.tagName==='A'&&e.closest('p,li,td,small,.hint')&&[...e.parentElement.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return;
    if(e.tagName==='INPUT'&&['checkbox','radio'].includes(e.type)&&e.closest('label')){const l=e.closest('label').getBoundingClientRect();if(l.height>=24&&l.width>=24)return;}
    const cx=rc.x+rc.width/2,cy=rc.y+rc.height/2;
    const crowded=rects.some((o,j)=>j!==i&&!targets[j].contains(e)&&!e.contains(targets[j])&&Math.hypot(Math.max(o.x-cx,0,cx-(o.x+o.width)),Math.max(o.y-cy,0,cy-(o.y+o.height)))<12);
    if(crowded)out.push(`trykkflate ${Math.round(rc.width)}×${Math.round(rc.height)} ${sel(e)} «${(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,30)}»`);});
   const nameOf=e=>{if(e.getAttribute('aria-label'))return e.getAttribute('aria-label');const lb=e.getAttribute('aria-labelledby');if(lb)return lb.split(' ').map(id=>document.getElementById(id)?.textContent||'').join(' ');if(e.id){const l=document.querySelector('label[for="'+e.id+'"]');if(l)return l.textContent;}const w=e.closest('label');if(w)return w.textContent;if(['BUTTON','A','SUMMARY'].includes(e.tagName))return e.textContent||e.querySelector('img')?.alt||'';return e.title||'';};
   for(const e of targets)if(!nameOf(e).trim())out.push('uten navn '+sel(e));
   if(document.documentElement.scrollWidth>innerWidth+1)out.push('horisontal scrolling');
   // Bokser inni siden som må rulles sidelengs. Talltabeller er unntatt (WCAG 1.4.10 tillater todimensjonal rulling for datatabeller).
   for(const e of document.querySelectorAll('body *')){if(!vis(e)||e.closest('#tableWrap,.withdraw-table,#comparison,.report-comparison'))continue;const ox=getComputedStyle(e).overflowX;if((ox==='auto'||ox==='scroll')&&e.scrollWidth>e.clientWidth+1)out.push('sidelengs rulling inni '+sel(e));}
   return out;});
  const focusCheck=async p=>{const out=[];await p.evaluate(()=>document.activeElement&&document.activeElement.blur());
   for(let i=0;i<40;i++){await p.keyboard.press('Tab');const f=await p.evaluate(()=>{const e=document.activeElement;if(!e||e===document.body)return null;const st=getComputedStyle(e);return {el:e.id||e.tagName.toLowerCase(),ok:(st.outlineStyle!=='none'&&parseFloat(st.outlineWidth)>0)||st.boxShadow!=='none'};});if(f&&!f.ok)out.push('fokus ikke synlig '+f.el);}
   return [...new Set(out)];};

  // 1. Kontrast, trykkflater, navn, reflow og synlig fokus i alle tre temaer.
  for(const theme of ['neutral','light','night'])for(const width of [320,375,1280])for(const [name,go] of Object.entries(screens)){
   const p=await page(theme,width);await go(p);await p.waitForTimeout(150);
   assert.equal(await p.evaluate(()=>document.documentElement.dataset.theme),theme,'Temaet er brukt');
   for(const x of [...await measure(p),...(width===375?[]:await focusCheck(p))])problems.push(`${theme} ${width} ${name}: ${x}`);
   await p.context().close();
  }
  // 2. 200 % zoom på 1280 px (640 px bredde): ingen horisontal scrolling på noen av sidene.
  for(const [name,go] of Object.entries(screens)){const p=await page('neutral',640,400);await go(p);
   if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))problems.push('200 % zoom '+name+': horisontal scrolling');await p.context().close();}
  // 3. Korte skjermer: faste elementer dekker ikke hovedfeltene når de har fokus.
  for(const [w,h] of [[320,568],[740,360],[375,400]]){const p=await page('neutral',w,h);await screens.kalkulator(p);
   for(const id of ['start','monthly','years','rate']){
    const covered=await p.evaluate(id=>{const el=document.getElementById(id);el.focus();el.scrollIntoView({block:'nearest'});const f=el.getBoundingClientRect();
     return [...document.querySelectorAll('body *')].filter(e=>{const st=getComputedStyle(e);if(!['fixed','sticky'].includes(st.position)||st.display==='none'||st.visibility==='hidden'||e.closest('[hidden]')||e.contains(el))return false;const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.top<f.bottom&&r.bottom>f.top&&r.left<f.right&&r.right>f.left;}).map(e=>e.id||e.className);},id);
    if(covered.length)problems.push(`${w}×${h}: #${id} dekkes av ${covered.join(', ')}`);}
   await p.context().close();}

  // 4. Hele flyten med bare tastatur, på pc: startvalg, felt, resultat, deling, veileder og tilbake.
  {const p=await page('neutral',1280);await screens.start(p);
   const tabTo=async(match,label,max=80)=>{for(let i=0;i<max;i++){await p.keyboard.press('Tab');if(await p.evaluate(match))return;}throw new Error('Tastatur: nådde ikke '+label);};
   const isId=id=>new Function(`return document.activeElement&&document.activeElement.id==='${id}'`);
   await tabTo(isId('chooseGrowth'),'Hvor mye kan pengene vokse');await p.keyboard.press('Enter');
   for(const [id,v] of [['onboardAge','43'],['onboardStart','12000'],['onboardMonthly','4000'],['onboardYears','22']]){await tabTo(isId(id),id);await p.keyboard.press('Control+A');await p.keyboard.type(v);}
   await tabTo(isId('beginJourney'),'Vis spareplanen');await p.keyboard.press('Enter');
   await p.locator('#workbench').waitFor();assert.equal(await p.evaluate(()=>s.monthly),4000);
   await tabTo(isId('monthly'),'Du sparer hver måned');await p.keyboard.press('Control+A');await p.keyboard.type('3000');await p.keyboard.press('Tab');
   assert.equal(await p.evaluate(()=>s.monthly),3000,'Endring med tastatur gir nytt resultat');
   // Del plan ligger i menyen. Tastaturbrukeren åpner menyen og går videre til knappen.
   await p.evaluate(()=>window.scrollTo(0,0));await p.evaluate(()=>document.activeElement.blur());
   await tabTo(()=>document.activeElement.matches('.site-menu>summary'),'Meny',40);await p.keyboard.press('Enter');
   await tabTo(isId('share'),'Del plan',20);await p.keyboard.press('Enter');
   assert(await p.evaluate(()=>document.getElementById('shareDialog').open),'Delingsvinduet åpnes med Enter');
   assert(await p.evaluate(()=>document.getElementById('shareDialog').contains(document.activeElement)),'Fokus står i delingsvinduet');
   await p.keyboard.press('Escape');assert(!await p.evaluate(()=>document.getElementById('shareDialog').open),'Escape lukker');
   // Del plan ligger i menyen, som lukkes når knappen trykkes. Fokus går da til menyknappen, ikke inn i den lukkede dialogen.
   await p.waitForTimeout(50);
   assert(await p.evaluate(()=>{const a=document.activeElement;return a.id==='share'&&a.checkVisibility()||a.matches('.site-menu>summary');}),'Fokus tilbake til Del plan eller Meny, var '+await p.evaluate(()=>document.activeElement.id||document.activeElement.tagName));
   // Det samme gjelder de andre handlingene i menyen som åpner en dialog.
   for(const id of ['save','reportButton','plansMenu']){
    await p.evaluate(()=>document.querySelector('.site-menu').open=true);await p.locator('#'+id).focus();await p.keyboard.press('Enter');await p.waitForTimeout(100);
    const open=await p.evaluate(()=>[...document.querySelectorAll('dialog')].some(d=>d.open));if(!open)continue;
    await p.keyboard.press('Escape');await p.waitForTimeout(50);
    assert(await p.evaluate(()=>{const a=document.activeElement;return a!==document.body&&!a.closest('dialog')&&a.checkVisibility();}),id+': fokus står ikke igjen i en lukket dialog');
   }
   await tabTo(()=>document.activeElement.matches('a[href="spor.html"]'),'Spør om sparing',150);await p.keyboard.press('Enter');await p.waitForURL(/spor\.html/);
   await tabTo(()=>document.activeElement.matches('a[href="index.html"]')&&/Kalkulator/.test(document.activeElement.textContent),'Kalkulator');await p.keyboard.press('Enter');await p.waitForURL(/index\.html/);
   assert.equal(await p.evaluate(()=>s.monthly),3000,'Planen er beholdt etter tur til veilederen med tastatur');
   await p.context().close();}

  assert.deepEqual(problems,[],'Tilgjengelighetsfunn:\n'+problems.join('\n'));
  assert.deepEqual(errors,[]);
  console.log('Browser (Chromium): contrast incl. graph, target size, names, reflow at 320 and 640 px, visible focus in three themes; short screens; full keyboard journey passed.');
 }catch(e){console.error(e.message||e);process.exitCode=1;}finally{if(browser)await browser.close();server.close();}
})();
