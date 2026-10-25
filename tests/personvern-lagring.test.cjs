// Personvern: hva som lagres, når, og at sletting bare rører Spareverksteds egne nøkler.
// Kjøres uten nettleser. Nettleserflyten dekkes i tests/roundtrip-browser.cjs og tests/polish-browser.cjs.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=f=>fs.readFileSync(path.join(__dirname,'..','dist',f),'utf8');

class Store{constructor(o={}){this.m=new Map(Object.entries(o));this.writes=[];}getItem(k){return this.m.has(k)?this.m.get(k):null;}setItem(k,v){this.writes.push(k);this.m.set(k,String(v));}removeItem(k){this.m.delete(k);}keys(){return [...this.m.keys()].sort();}}

// 1. Ingen kode skriver sv-started permanent, og nøkkelen leses bare fra fanen.
const journey=dist('journey.js'),app=dist('app.js');
assert(!/localStorage\.setItem\(\s*'sv-started'/.test(journey+app),'sv-started skal ikke lagres permanent');
assert(/sessionStorage\.setItem\('sv-started','1'\)/.test(journey));
assert(/localStorage\.removeItem\('sv-started'\)/.test(journey),'gammel permanent nøkkel ryddes');

// 2. Visningsnivå: bare nivåknappene lagrer. Automatiske tilbakestillinger og «Se innstillingene» lagrer ikke.
const calls=(journey+app).match(/setLevel\([^)]*\)/g);
for(const c of calls){
 if(c==="setLevel(b.dataset.level)"||c.startsWith("setLevel(value"))continue;
 assert(/remember:false/.test(c),'Automatisk nivåskifte skal ikke lagres: '+c);
}
{
 const local=new Store();const ctx={localStorage:local,level:'simple',syncLevel(){},window:{}};vm.createContext(ctx);
 const src=app.match(/function setLevel\([\s\S]*?\n/)[0];vm.runInContext(src+';this.setLevel=setLevel;',ctx);
 ctx.setLevel('simple',{remember:false});assert.equal(local.getItem('sv-level'),null);
 ctx.setLevel('advanced');assert.equal(local.getItem('sv-level'),'advanced');
 ctx.setLevel('advanced',{remember:false});assert.equal(local.getItem('sv-level'),null,'automatisk skifte fjerner lagret valg');
 ctx.setLevel('explore');ctx.setLevel('simple');assert.equal(local.getItem('sv-level'),null,'«Enkel» er standard og lagres ikke');
}

// 3. Broen til veilederen: ingenting skrives før brukeren går til «Spør om sparing».
function bridge(session,{started=true}={}){
 const listeners={},doc={getElementById:()=>({hidden:!started}),addEventListener:(t,f)=>(listeners['doc:'+t]=f),querySelectorAll:()=>[]};
 const win={sessionStorage:session,addEventListener:(t,f)=>(listeners['win:'+t]=f)};
 const ctx={window:win,document:doc,location:{hash:''},s:{start:1000,monthly:500,years:10,activePage:'calculator',ageKnown:false,riskChosen:false,dreamYears:5},mode:'explore',view:{showBank:false},E:{sanitize:x=>({state:x,rejected:[],allReset:false})},
  fill(){},render(){},setPage(){},currentHorizon(){},updateStartNote(){},notice(){},quoted:x=>x,ageGroupFor:()=>'all',console};
 vm.createContext(ctx);ctx.globalThis=ctx;
 vm.runInContext(dist('veileder-context.js'),ctx);ctx.SpareContext=ctx.SpareContext||ctx.window.SpareContext;
 vm.runInContext(dist('veileder-bridge.js'),ctx);
 return {pagehide:()=>listeners['win:pagehide'](),clickGuide:()=>listeners['doc:click']({target:{closest:sel=>sel==='a[href="spor.html"]'?{}:null}}),clickOther:()=>listeners['doc:click']({target:{closest:()=>null}})};
}
{
 const session=new Store(),b=bridge(session);
 b.pagehide();b.clickOther();assert.deepEqual(session.keys(),[],'pagehide uten tur til veilederen lagrer ingenting');
 b.clickGuide();assert.deepEqual(session.keys(),['sv-guidance-tab-v2','sv-working-plan-v1']);
 const plan=JSON.parse(session.getItem('sv-working-plan-v1'));assert.equal(plan.state.monthly,500,'arbeidsplanen inneholder beløp');
 const guide=JSON.parse(session.getItem('sv-guidance-tab-v2'));assert(!JSON.stringify(guide).includes('500'),'veilederkonteksten har ikke beløp');
 const before=session.writes.length;b.pagehide();assert(session.writes.length>before,'pagehide oppdaterer en plan som allerede finnes');
}
{
 const session=new Store(),b=bridge(session,{started:false});
 b.clickGuide();assert.deepEqual(session.keys(),[],'fra startguiden uten plan lagres ingenting');
}

// 4. Sletting: bare egne nøkler, også i fanen.
{
 const P=require('../dist/personvern.js');
 const local=new Store({'sv-scenarios':JSON.stringify([{name:'A',state:{}},{name:'B',state:{}}]),'sv-level':'advanced','sv-color-theme':'night','sv-started':'1','annen-tjeneste':'x'});
 const session=new Store({'sv-working-plan-v1':'{}','sv-guidance-tab-v2':'{}','sv-started':'1','annen':'y'});
 assert.equal(P.planCount(local),2);assert.equal(P.stored(local,session).length,6);
 assert.equal(P.clearAll(local,session),true);
 assert.deepEqual(local.keys(),['annen-tjeneste']);assert.deepEqual(session.keys(),['annen']);
 assert.equal(P.stored(local,session).length,0);
 const blocked={getItem(){throw Error('blokkert');},removeItem(){throw Error('blokkert');}};
 assert.equal(P.planCount(blocked),0);assert.deepEqual(P.stored(blocked,blocked),[]);assert.equal(P.clearAll(blocked,blocked),false);
}

// 5. Alle nøkler som koden bruker, er med i slettelisten.
{
 const P=require('../dist/personvern.js'),all=new Set([...P.LOCAL,...P.SESSION]);
 const code=fs.readdirSync(path.join(__dirname,'..','dist')).filter(f=>f.endsWith('.js')).map(dist).join('\n');
 for(const k of new Set(code.match(/'sv-[a-z0-9-]+'/g).map(x=>x.slice(1,-1))))assert(all.has(k),'Mangler i slettelisten: '+k);
}

// 6. Sidene lenker til personvernsiden.
for(const f of ['index.html','spor.html','om.html'])assert(dist(f).includes('href="personvern.html"'),f+' mangler lenke');
console.log('Personvern: ingen permanent startnøkkel, nivå lagres bare ved eget valg, veilederbroen skriver bare ved tur til veilederen, sletting rører bare egne nøkler.');
