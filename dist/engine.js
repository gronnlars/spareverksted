(function(root){
const defaults={userAge:0,ageKnown:false,until67:false,riskChosen:false,taxEnabled:false,taxModel:"ask",taxFreeCapital:0,taxShield:0,taxRate:37.84,taxableShare:50,start:0,monthly:2000,years:10,rate:5,inflation:2.5,fee:0.2,growth:0,goal:500000,goalReal:false,real:false,bank:3.5,spread:2,extra:0,extraYear:10,crash:0,crashYear:15,stress:'medium',purpose:'freedom',log:false,withdraw:25000,retireYears:25,annualWithdraw:24000,withdrawMode:"amount",withdrawPercent:4,withdrawBase:"remaining",withdrawInflation:true,extraWithdraw:0,extraWithdrawYear:5,extraWithdrawInflation:false,activePage:"calculator",ageGroup:"all",dreamType:"car",dreamCost:300000,dreamStart:0,dreamYears:5,dreamMonthly:3000,dreamInflation:2.5,dreamReal:true,dreamFlexible:false,dreamSafe:3.5,dreamModerate:4.5,dreamRisk:6.5};
function sumExp(a,n){return Math.abs(a)<1e-12?n:Math.expm1(n*a)/Math.expm1(a)}
function raw(s,t,rate=s.rate,fee=s.fee,p=s.monthly){const n=Math.round(t*12),a=(Math.log1p(rate/100)+Math.log1p(-fee/100))/12,b=Math.log1p(s.growth/100)/12;let v=s.start*Math.exp(a*n);if(p!==0&&n>0){const hi=Math.max(a,b),lo=Math.min(a,b);v+=p*Math.exp(hi*(n-1))*sumExp(lo-hi,n);}const e=Math.round(s.extraYear*12);if(s.extra!==0&&e<=n)v+=s.extra*Math.exp(a*(n-e));return v}
function value(s,t,rate=s.rate,fee=s.fee,p=s.monthly){let v=raw(s,t,rate,fee,p);const ct=Math.round(s.crashYear*12)/12;if(s.crash>0&&ct<=t){const lost=raw(s,ct,rate,fee,p)*s.crash/100;v-=lost*Math.exp((Math.log1p(rate/100)+Math.log1p(-fee/100))*(Math.round(t*12)/12-ct));}return v}
function target(s){return s.goal*(s.goalReal?Math.exp(Math.log1p(s.inflation/100)*Math.round(s.years*12)/12):1)}
function needed(s){const base=value(s,s.years,s.rate,s.fee,0),unit=value({...s,start:0,extra:0},s.years,s.rate,s.fee,1);return unit>0?Math.max(0,(target(s)-base)/unit):base>=target(s)?0:Infinity}
const amountLimits={start:[1e10,'Du har allerede'],monthly:[1e7,'Sparing per måned'],goal:[1e11,'Sparemålet'],extra:[1e10,'Ekstrainnskudd'],withdraw:[1e9,'Uttak'],annualWithdraw:[1e9,'Årlig uttak'],extraWithdraw:[1e9,'Ekstra engangsuttak']};
const timeLabels={years:'Sparetid',extraYear:'Innskudd etter',crashYear:'Fall etter',retireYears:'År med uttak',extraWithdrawYear:'Etter uttaksår'};
const rateLabels={rate:'Antatt årlig vekst',bank:'Bankrente',inflation:'Prisvekst',growth:'Økning i sparingen'};
const percentRanges={fee:[0,99.99,'Kostnad'],crash:[0,100,'Børsfall'],spread:[0,100,'Avvik fra valgt avkastning'],withdrawPercent:[0,100,'Uttaksprosent']};
function fail(key,text){const e=new Error(text);e.field=key;throw e}
// Alle tallfelt valideres her. Motoren regner også utenfor disse grensene, men brukeren stoppes.
function validate(s){
 const num=new Intl.NumberFormat('nb-NO'),check=(key,label,min,max,unit,open)=>{const v=s[key];if(!Number.isFinite(v))fail(key,`Fyll inn et gyldig tall i «${label}».`);if(v<min||v>max||(open&&v<=min))fail(key,`«${label}» må være ${open?`over ${num.format(min)}${unit} og opptil`:`fra ${num.format(min)}${unit} til`} ${num.format(max)}${unit}.`)};
 for(const k in amountLimits)check(k,amountLimits[k][1],0,amountLimits[k][0],' kr');
 for(const k in timeLabels)check(k,timeLabels[k],0,100,' år');
 for(const k in rateLabels)check(k,rateLabels[k],-100,100,' %',true);
 for(const k in percentRanges)check(k,percentRanges[k][2],percentRanges[k][0],percentRanges[k][1],' %');
 if(!Number.isSafeInteger(Math.round(s.years*12)))fail('years','Perioden er større enn tallpresisjonen i nettleseren tillater.');
}
function withdrawalCore(s,capital){
 const n=Math.floor(s.retireYears),a=Math.log1p(s.rate/100)+Math.log1p(-s.fee/100),g=s.withdrawInflation?Math.log1p(s.inflation/100):0,percent=s.withdrawMode==='percent',remaining=percent&&s.withdrawBase==='remaining',p=s.withdrawPercent/100;
 if(s.retireYears<1||!Number.isSafeInteger(n))throw Error('Velg minst ett helt år for uttaksperioden.');
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
 if(!Number.isFinite(amount)||amount<0||(amount>0&&(!Number.isSafeInteger(e)||e<1)))throw Error('Ekstrauttaket må være minst 0 kr, og uttaksåret et helt tall fra 1.');
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
function dreamPlans(s){
 const keys=['dreamCost','dreamStart','dreamYears','dreamMonthly','dreamInflation','dreamSafe','dreamModerate','dreamRisk'];
 if(keys.some(k=>!Number.isFinite(s[k])))throw Error('Fyll inn gyldige tall for sparemålet.');
 if(['dreamCost','dreamStart','dreamYears','dreamMonthly'].some(k=>s[k]<0)||s.dreamYears<1/12)throw Error('Beløp må være minst 0 kr, og perioden minst én måned.');
 if(s.dreamInflation<=-100||[s.dreamSafe,s.dreamModerate,s.dreamRisk].some(r=>r<=-100))throw Error('Prisvekst og avkastning må være større enn −100 %.');
 const years=Math.round(s.dreamYears*12)/12;
 const plans=[['safe',s.dreamSafe,0],['moderate',s.dreamModerate,15],['risk',s.dreamRisk,35]].map(([id,rate,fall])=>{
 const n={...defaults,start:s.dreamStart,monthly:s.dreamMonthly,years,rate,fee:0,growth:0,goal:s.dreamCost,goalReal:s.dreamReal,inflation:s.dreamInflation,extra:0,crash:0,spread:0};validate(n);
 const goal=target(n),required=needed(n),end=value(n,years),stressed=fall?end*(1-fall/100):value({...n,rate:0},years),robust=fall?needed({...n,crash:fall,crashYear:years}):needed({...n,rate:0});
 if([goal,required,end,stressed,robust].some(v=>!Number.isFinite(v)))throw Error('Målet overstiger tallområdet. Reduser beløp, periode eller vekst.');
 return {id,rate,fall,goal,required,end,stressed,robust,plan:n};});return plans;
}
const api={dreamPlans,withdrawal,defaults,raw,value,target,needed,validate,sumExp};if(typeof module!=='undefined')module.exports=api;else root.Engine=api;
})(typeof window!=='undefined'?window:globalThis);
