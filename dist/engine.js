(function(root){
const defaults={userAge:0,ageKnown:false,until67:false,riskChosen:false,taxEnabled:false,taxModel:"ask",taxFreeCapital:0,taxShield:0,taxRate:37.84,taxableShare:50,start:0,monthly:2000,years:10,rate:5,inflation:2.5,fee:0.2,growth:0,goal:500000,goalReal:false,real:false,bank:3.5,spread:2,extra:0,extraYear:10,crash:0,crashYear:15,stress:'medium',purpose:'freedom',log:false,withdraw:25000,retireYears:25,annualWithdraw:24000,withdrawMode:"amount",withdrawPercent:4,withdrawBase:"remaining",withdrawInflation:true,extraWithdraw:0,extraWithdrawYear:5,extraWithdrawInflation:false,activePage:"calculator",ageGroup:"all",dreamType:"car",dreamCost:300000,dreamStart:0,dreamYears:5,dreamMonthly:3000,dreamInflation:2.5,dreamReal:true,dreamFlexible:false,dreamSafe:3.5,dreamModerate:4.5,dreamRisk:6.5};
function sumExp(a,n){return Math.abs(a)<1e-12?n:Math.expm1(n*a)/Math.expm1(a)}
function raw(s,t,rate=s.rate,fee=s.fee,p=s.monthly){const n=Math.round(t*12),a=(Math.log1p(rate/100)+Math.log1p(-fee/100))/12,b=Math.log1p(s.growth/100)/12;let v=s.start*Math.exp(a*n);if(p!==0&&n>0){const hi=Math.max(a,b),lo=Math.min(a,b);v+=p*Math.exp(hi*(n-1))*sumExp(lo-hi,n);}const e=Math.round(s.extraYear*12);if(s.extra!==0&&e<=n)v+=s.extra*Math.exp(a*(n-e));return v}
function value(s,t,rate=s.rate,fee=s.fee,p=s.monthly){let v=raw(s,t,rate,fee,p);const ct=Math.round(s.crashYear*12)/12;if(s.crash>0&&ct<=t){const lost=raw(s,ct,rate,fee,p)*s.crash/100;v-=lost*Math.exp((Math.log1p(rate/100)+Math.log1p(-fee/100))*(Math.round(t*12)/12-ct));}return v}
function target(s){return s.goal*(s.goalReal?Math.exp(Math.log1p(s.inflation/100)*Math.round(s.years*12)/12):1)}
function needed(s){const base=value(s,s.years,s.rate,s.fee,0),unit=value({...s,start:0,extra:0},s.years,s.rate,s.fee,1);return unit>0?Math.max(0,(target(s)-base)/unit):base>=target(s)?0:Infinity}
// Én felles oversikt over grenser for alle tallfelt. Etikettene er standardteksten på skjermen;
// nettsiden sender inn etiketten som faktisk vises (den kan endres med visningsnivå).
// [min, maks, enhet, etikett, valg]. open: min er utelukket. minText: egen tekst for minstegrensen.
const R=(min,max,unit,label,opt={})=>({min,max,unit,label,...opt});
const FIELDS={
 start:R(0,1e10,' kr','Du har allerede'),monthly:R(0,1e7,' kr','Du sparer hver måned'),years:R(1/12,100,' år','Du vil spare i',{minText:'én måned'}),rate:R(0,100,' %','Antatt årlig vekst'),
 inflation:R(0,100,' %','Prisvekst per år'),fee:R(0,99.99,' %','Kostnad per år'),goal:R(0,1e11,' kr','Beløpet du vil nå'),growth:R(-100,100,' %','Årlig endring i månedssparingen',{open:true}),
 bank:R(0,100,' %','Bankrente å sammenligne med'),spread:R(0,100,' prosentpoeng','Avvik fra valgt avkastning'),extra:R(0,1e10,' kr','Ekstrainnskudd'),extraYear:R(0,100,' år','Innskudd etter'),
 crash:R(0,100,' %','Børsfall'),crashYear:R(0,100,' år','Fall etter'),annualWithdraw:R(0,1e9,' kr','Årsbeløp før skatt'),retireYears:R(0,100,' år','År med uttak'),
 withdrawPercent:R(0,100,' %','Uttak hvert år'),extraWithdraw:R(0,1e9,' kr','Ekstra engangsuttak'),extraWithdrawYear:R(0,100,' år','Etter uttaksår'),withdraw:R(0,1e9,' kr','Uttak')
};
const DREAM_FIELDS={
 dreamCost:R(0,1e11,' kr','Budsjett for kjøpet'),dreamStart:R(0,1e10,' kr','Allerede satt av'),dreamYears:R(1/12,100,' år','Tid til kjøpet',{minText:'én måned'}),
 dreamMonthly:R(0,1e7,' kr','Jeg kan spare per måned'),dreamInflation:R(0,100,' %','Årlig prisvekst for kjøpet'),
 dreamSafe:R(0,100,' %','Bank / lavere risiko'),dreamModerate:R(0,100,' %','Moderat risiko'),dreamRisk:R(0,100,' %','Høyere risiko')
};
// Felt som ikke er en del av kalkulatorens validering, men som må kontrolleres i delte lenker og lagrede planer.
const OTHER_FIELDS={userAge:R(0,120,' år','Alder'),taxFreeCapital:R(0,Infinity,' kr','Gjenstående innskudd'),taxShield:R(0,Infinity,' kr','Kjent skjerming'),taxRate:R(0,100,' %','Skattesats'),taxableShare:R(0,100,' %','Skattepliktig andel')};
const CHOICES={activePage:[['calculator','dreams','withdrawals'],'Side'],withdrawMode:[['amount','duration','budget','percent'],'Hva vil du finne ut?'],withdrawBase:[['remaining','initial'],'Prosent av'],
 taxModel:[['ask','share'],'Skattemodell'],dreamType:[['car','home','holiday','renovation','freedom','buffer','other'],'Jeg sparer til'],stress:[['low','medium','high'],'Risikovilje'],
 purpose:[['freedom','home','buffer','dream'],'Formål'],ageGroup:[['all','18-24','25-29','30-34','35-39','40-44','45-49','50-54','55-66','67+'],'Aldersgruppe']};
const RULES={...FIELDS,...DREAM_FIELDS,...OTHER_FIELDS};
// Vanlige regneeksempler bruker minst 0 % forventet vekst, prisvekst og bankrente. Mulige tap vises som
// risikoscenarioer (børsfall, lavere vekst, stresstester), ikke som forventningen. Eldre lenker og planer
// med negative verdier i disse feltene settes til 0 %, og brukeren får beskjed om det.
const ZERO_FLOOR=new Set(['rate','inflation','bank','dreamInflation','dreamSafe','dreamModerate','dreamRisk']);
function label(key){return RULES[key]?.label||CHOICES[key]?.[1]||key}
function fail(key,text){const e=new Error(text);e.field=key;throw e}
const num=new Intl.NumberFormat('nb-NO');
// Returnerer feilen for ett felt, eller null. labelOf(key) kan gi etiketten som vises på skjermen.
function fieldError(key,v,labelOf){
 const r=RULES[key];if(!r)return null;const name=(labelOf&&labelOf(key))||r.label;
 if(typeof v!=='number'||!Number.isFinite(v))return `Fyll inn et gyldig tall i «${name}».`;
 if(v<r.min||v>r.max||(r.open&&v<=r.min)){const lower=r.minText||`${num.format(r.min)}${r.unit}`;return r.max===Infinity?`«${name}» må være minst ${lower}.`:`«${name}» må være ${r.open?`over ${lower} og opptil`:`fra ${lower} til`} ${num.format(r.max)}${r.unit}.`;}
 return null;
}
function checkGroup(s,group,labelOf){for(const k in group){const text=fieldError(k,s[k],labelOf);if(text)fail(k,text);}}
// Kalkulatorens felt (sparing og uttak). Motoren regner også utenfor grensene, men brukeren stoppes.
function validate(s,labelOf){
 checkGroup(s,FIELDS,labelOf);
 if(!Number.isSafeInteger(Math.round(s.years*12)))fail('years','Perioden er større enn tallpresisjonen i nettleseren tillater.');
}
function validateDream(s,labelOf){checkGroup(s,DREAM_FIELDS,labelOf)}
// Kontrollerer verdier fra en delt lenke (tekst) eller en lagret plan. Gyldige verdier beholdes,
// ugyldige felt får standardverdi. Hvis helheten likevel er ugyldig, tilbakestilles alle oppgitte felt.
function sanitize(input,{text=false}={}){
 const state={...defaults},rejected=[],adjusted=[];
 for(const k in defaults){
  if(!input||!Object.prototype.hasOwnProperty.call(input,k))continue;
  const raw=input[k],def=defaults[k];let v,ok=true;
  if(typeof def==='boolean'){if(text){ok=raw==='1'||raw==='0';v=raw==='1';}else{ok=typeof raw==='boolean';v=raw;}}
  else if(typeof def==='number'){if(text){ok=typeof raw==='string'&&/^-?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(raw);v=ok?Number(raw):NaN;}else v=raw;ok=ok&&typeof v==='number'&&Number.isFinite(v)&&fieldError(k,v)===null;}
  else {v=raw;ok=typeof raw==='string'&&(!CHOICES[k]||CHOICES[k][0].includes(raw));}
  if(!ok&&ZERO_FLOOR.has(k)&&typeof v==='number'&&Number.isFinite(v)&&v<0){state[k]=0;adjusted.push({key:k,from:v});continue;}
  if(ok)state[k]=v;else rejected.push(k);
 }
 try{validate(state);validateDream(state);}catch{return {state:{...defaults},rejected:Object.keys(input||{}).filter(k=>k in defaults),adjusted:[],allReset:true};}
 return {state,rejected,adjusted,allReset:false};
}
function withdrawalCore(s,capital){
 const n=Math.floor(s.retireYears),a=Math.log1p(s.rate/100)+Math.log1p(-s.fee/100),g=s.withdrawInflation?Math.log1p(s.inflation/100):0,percent=s.withdrawMode==='percent',remaining=percent&&s.withdrawBase==='remaining',p=s.withdrawPercent/100;
 if(s.retireYears<1||!Number.isSafeInteger(n))fail('retireYears','Velg minst ett helt år i «År med uttak».');
 if(s.annualWithdraw<0||s.withdrawPercent<0||s.withdrawPercent>100)throw Error('Årlig uttak må være positivt eller null, og uttaksprosent fra 0 til 100.');
 // Present value of withdrawals at year end, with the first withdrawal unindexed.
 const pv=k=>Math.exp(-a)*sumExp(g-a,k);
 let w=percent?capital*p:s.annualWithdraw;
 if(s.withdrawMode==='budget')w=capital/pv(n);
 let life=Infinity;
 if(!remaining&&w>0){const d=g-a,z=capital*Math.exp(a)/w;if(Math.abs(d)<1e-12)life=z;else if(d>0||z*(-Math.expm1(d))<1)life=Math.log1p(z*Math.expm1(d))/d;}
 if(remaining)life=p===1?1:capital===0?0:Infinity;
 const exhausted=Number.isFinite(life)?Math.max(1,Math.ceil(life-1e-9)):Infinity;
 function row(k){let balance,actual=0,total;
 if(remaining){const b=a+Math.log1p(-p);balance=p===1?(k===0?capital:0):capital*Math.exp(b*k);actual=k===0?0:p===1?(k===1?capital*Math.exp(a):0):capital*Math.exp(a+b*(k-1))*p;total=k===0?0:p===1?capital*Math.exp(a):capital*Math.exp(a)*p*sumExp(b,k);}
 else {const before=j=>Math.max(0,Math.exp(a*j)*(capital-w*pv(j)));balance=k===0?capital:k>=exhausted?0:before(k);actual=k===0||k>exhausted?0:Math.min(before(k-1)*Math.exp(a),w*Math.exp(g*(k-1)));const full=Math.min(k,exhausted-1);total=w===0?0:w*sumExp(g,full);if(k>=exhausted)total+=Math.min(before(exhausted-1)*Math.exp(a),w*Math.exp(g*(exhausted-1)));}
 return {year:k,balance,actual,real:actual/Math.exp(Math.log1p(s.inflation/100)*k),total};
 }
 const count=Math.min(n,300),points=Array.from({length:count+1},(_,i)=>row(Math.round(i*n/count)));const first=row(1),last=row(n);
 if([w,...points.flatMap(r=>Object.values(r))].some(v=>!Number.isFinite(v)))throw Error('Uttaksberegningen overstiger nettleserens tallområde. Prøv kortere periode eller lavere vekst.');
 return {first,last,points,exhausted,w,remaining,n,row};
}
function withdrawal(s,capital){
 const e=s.extraWithdrawYear,amount=s.extraWithdraw;
 if(!Number.isFinite(amount)||amount<0)fail('extraWithdraw','Ekstrauttaket må være minst 0 kr.');if(amount>0&&(!Number.isSafeInteger(e)||e<1))fail('extraWithdrawYear','«Etter uttaksår» må være et helt tall fra 1 når du har et ekstrauttak.');
 if(!amount){const r=withdrawalCore(s,capital);return {...r,extraActual:0,extraRequested:0,extraYear:e};}
 const n=Math.floor(s.retireYears),a=Math.log1p(s.rate/100)+Math.log1p(-s.fee/100),infl=Math.log1p(s.inflation/100),requested=amount*Math.exp(s.extraWithdrawInflation?infl*e:0);
 if(!Number.isFinite(requested))throw Error('Ekstrauttaket overstiger tallområdet.');
 let plan={...s};
 if(s.withdrawMode==='budget'&&e<=n){const pv=requested*Math.exp(-a*e);if(pv>capital)throw Error('Kapitalen dekker ikke ekstrauttaket, selv uten vanlige årsuttak. Reduser ekstrauttaket eller øk sparingen.');const full=withdrawalCore(s,capital);plan={...s,withdrawMode:'amount',annualWithdraw:capital?full.w*(1-pv/capital):0};}
 const before=withdrawalCore(plan,capital);
 if(s.withdrawMode==='budget'&&e>n)return {...before,extraActual:0,extraRequested:requested,extraYear:e};
 const at=before.row(e),paid=Math.min(requested,at.balance),left=Math.max(0,at.balance-paid);
 const tailPlan=before.remaining?{...plan,retireYears:Math.max(1,n-e)}:{...plan,withdrawMode:'amount',annualWithdraw:before.w*Math.exp(plan.withdrawInflation?infl*e:0),retireYears:Math.max(1,n-e)};
 const after=withdrawalCore(tailPlan,left);
 function row(k){if(k<e)return {...before.row(k),extra:0};if(k===e)return {...at,balance:left,total:at.total+paid,extra:paid};const r=after.row(k-e);return {...r,year:k,real:r.real/Math.exp(infl*e),total:at.total+paid+r.total,extra:0};}
 const exhausted=before.exhausted<=e?before.exhausted:left===0?e:e+after.exhausted;
 const count=Math.min(n,300),years=new Set(Array.from({length:count+1},(_,i)=>Math.round(i*n/count)));if(e<=n){years.add(e);years.add(e-1);if(e<n)years.add(e+1)}
 const points=[...years].sort((a,b)=>a-b).map(row);if(points.some(r=>Object.values(r).some(v=>!Number.isFinite(v))))throw Error('Uttaksberegningen overstiger tallområdet.');
 return {...before,row,points,first:row(1),last:row(n),exhausted,extraActual:paid,extraRequested:requested,extraYear:e};
}
function dreamPlans(s,labelOf){
 // Sparemålets egne felt valideres med egne navn, slik at riktig felt kan markeres.
 validateDream(s,labelOf);
 const years=Math.round(s.dreamYears*12)/12;
 const plans=[['safe',s.dreamSafe,0],['moderate',s.dreamModerate,15],['risk',s.dreamRisk,35]].map(([id,rate,fall])=>{
 const n={...defaults,start:s.dreamStart,monthly:s.dreamMonthly,years,rate,fee:0,growth:0,goal:s.dreamCost,goalReal:s.dreamReal,inflation:s.dreamInflation,extra:0,crash:0,spread:0};validate(n);
 const goal=target(n),required=needed(n),end=value(n,years),stressed=fall?end*(1-fall/100):value({...n,rate:0},years),robust=fall?needed({...n,crash:fall,crashYear:years}):needed({...n,rate:0});
 if([goal,required,end,stressed,robust].some(v=>!Number.isFinite(v)))throw Error('Målet overstiger tallområdet. Reduser beløp, periode eller vekst.');
 return {id,rate,fall,goal,required,end,stressed,robust,plan:n};});return plans;
}
const api={dreamPlans,withdrawal,defaults,raw,value,target,needed,validate,validateDream,fieldError,sanitize,label,sumExp,FIELDS,DREAM_FIELDS};if(typeof module!=='undefined')module.exports=api;else root.Engine=api;
})(typeof window!=='undefined'?window:globalThis);
