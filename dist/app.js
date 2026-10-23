'use strict';
const $=id=>document.getElementById(id), E=Engine;
let s={...E.defaults},mode='explore',rows=[],saved=[],level='simple',selectedPlans=new Set(),undoState=null,view={showBank:false,showRange:false,showGoal:false};
const nf=new Intl.NumberFormat('nb-NO',{maximumFractionDigits:0}),dec=new Intl.NumberFormat('nb-NO',{maximumFractionDigits:2});
const BIG=[[1e18,'trillioner','trill.'],[1e15,'billiarder','bd.'],[1e12,'billioner','bill.']];
const big=(x,short)=>{const a=Math.abs(x),sign=x<0?'−':'';if(a>=1e21){const bound=x<0?'under −':'over ';return bound+(short?'1 000 trill.':'1 000 trillioner kr');}for(const [limit,word,abbr] of BIG)if(a>=limit)return sign+dec.format(a/limit)+(short?' '+abbr:' '+word+' kr');return null;};
const money=x=>!Number.isFinite(x)?'Kan ikke beregnes':big(x)||nf.format(x)+' kr';
const axisFormat=new Intl.NumberFormat('nb-NO',{maximumFractionDigits:0});
const axisCompact=x=>big(x,true)||(Math.abs(x)>=1e9?dec.format(x/1e9)+' mrd.':Math.abs(x)>=1e6?dec.format(x/1e6)+' mill.':Math.abs(x)>=1000?dec.format(x/1000)+' tusen':dec.format(x));
const compact=x=>big(x,true)||(Math.abs(x)>=1e9?dec.format(x/1e9)+' mrd.':Math.abs(x)>=1e6?dec.format(x/1e6)+' mill.':Math.abs(x)>=1000?dec.format(x/1000)+' tusen':nf.format(x));
const escapeHTML=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const groupedNumber=value=>new Intl.NumberFormat('nb-NO',{maximumFractionDigits:15}).format(value).replace(/[\u00a0\u202f]/g,' ');
// Godtar tallene slik siden selv viser dem: mellomrom som tusenskille, komma som desimaltegn og
// typografisk minus (−, U+2212) fra norsk tallformatering. Vanlig bindestrek virker som før.
const parsedNumber=value=>value.trim()===''?0:Number(value.replace(/[\s\u00a0\u202f]/g,'').replace(/^\u2212/,'-').replace(',','.'));
const hash=new URLSearchParams(location.hash.slice(1));
try{const data=JSON.parse(localStorage.getItem('sv-scenarios')||'[]');saved=Array.isArray(data)?data.filter(x=>x&&typeof x.name==='string'&&x.state&&typeof x.state==='object'):[];level=localStorage.getItem('sv-level')||'simple';}catch{}
// Delte lenker kontrolleres felt for felt. Gyldige verdier beholdes, ugyldige felt får standardverdi.
const linkInput={};for(const k in s)if(hash.has(k))linkInput[k]=hash.get(k);
const linkCheck=E.sanitize(linkInput,{text:true});s=linkCheck.state;
if(hash.has('level'))level=hash.get('level');if(!['simple','explore','advanced'].includes(level))level='simple';
if(hash.has('mode'))mode=hash.get('mode')==='goal'?'goal':'explore';for(const k in view)if(hash.has(k))view[k]=hash.get(k)==='1';
const specs={basic:[['start','Du har allerede','kr'],['monthly','Du sparer hver måned','kr'],['years','Du vil spare i','år'],['rate','Antatt årlig vekst','%']],essentialsFields:[['inflation','Prisvekst per år','%'],['fee','Kostnad per år','%']],goalField:[['goal','Beløpet du vil nå','kr']],advanced:[['growth','Økning i sparingen per år','%'],['bank','Bankrente å sammenligne med','%'],['spread','Avvik fra valgt avkastning','%-p']],events:[['extra','Ekstrainnskudd','kr'],['extraYear','Innskudd etter','år'],['crash','Børsfall','%'],['crashYear','Fall etter','år']],retirement:[['annualWithdraw','Årsbeløp før skatt','kr'],['retireYears','År med uttak','år'],['withdrawPercent','Uttak hvert år','%']],extraWithdrawalFields:[['extraWithdraw','Ekstra engangsuttak','kr'],['extraWithdrawYear','Etter uttaksår','år']]};
for(const [group,fields]of Object.entries(specs))$(group).innerHTML=fields.map(([id,label,unit])=>`<label for="${id}"><span class="field-label">${label}</span><div class="fieldbox"><input id="${id}" type="text" inputmode="decimal" autocomplete="off"><span class="unit">${unit}</span></div></label>`).join('');
function fill(){for(const b of $('modes').children)b.classList.toggle('active',b.dataset.mode===mode);for(const k in s){const el=$(k);if(!el)continue;if(el.type==='checkbox')el.checked=s[k];else el.value=typeof s[k]==='number'?groupedNumber(s[k]):s[k];}for(const k in view)if($(k))$(k).checked=view[k];}
function read(){for(const k in s){if(k.startsWith('tax')||k==='taxableShare')continue;const el=$(k);if(!el)continue;if(el.type==='checkbox')s[k]=el.checked;else if(typeof E.defaults[k]==='number'){s[k]=parsedNumber(el.value);el.setAttribute('aria-invalid',!Number.isFinite(s[k]));}else s[k]=el.value;}}
function notice(t,ms=4500){$('toast').textContent=t;$('toast').style.display='block';clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('toast').style.display='none',ms);}
// Etiketten som faktisk vises ved feltet, ellers standardnavnet fra motoren.
function fieldLabel(key){const t=$(key)?.closest('label')?.querySelector('.field-label')?.textContent?.trim();return t||E.label(key);}
const quoted=keys=>keys.map(k=>'«'+fieldLabel(k)+'»').join(', ');
// Forklaring når en eldre plan eller lenke hadde negativ forventet vekst, prisvekst eller bankrente.
const adjustedText=list=>list.length?(list.length===1?'':'Disse verdiene er endret: ')+list.map(a=>'«'+fieldLabel(a.key)+'» fra '+dec.format(a.from)+' % til 0 %').join(', ')+'. Den vanlige kalkulatoren bruker minst 0 %. Mulige tap kan du teste med «Børsfall» eller lavere vekst.':'';
// Feilmarkering knyttes til meldingen med aria-describedby, slik at skjermlesere leser den ved feltet.
function markInvalid(key,messageId){const el=key&&$(key);if(!el)return;el.setAttribute('aria-invalid','true');const ids=(el.getAttribute('aria-describedby')||'').split(' ').filter(Boolean);if(!ids.includes(messageId))el.setAttribute('aria-describedby',[...ids,messageId].join(' '));}
function clearInvalid(el,messageId){el.removeAttribute('aria-invalid');const ids=(el.getAttribute('aria-describedby')||'').split(' ').filter(x=>x&&x!==messageId);ids.length?el.setAttribute('aria-describedby',ids.join(' ')):el.removeAttribute('aria-describedby');}
// Rydder koblingen til én feilmelding for en gruppe felt. Feltet med feil (field) markeres; de andre
// mister koblingen til meldingen. aria-invalid fjernes bare når feltet faktisk har et gyldig tall.
function syncFieldErrors(keys,messageId,field){for(const k of keys){const el=$(k);if(!el)continue;if(k===field){markInvalid(k,messageId);continue;}
 const linked=(el.getAttribute('aria-describedby')||'').split(' ').includes(messageId);if(!linked&&el.getAttribute('aria-invalid')!=='true')continue;
 if(Number.isFinite(parsedNumber(el.value)))clearInvalid(el,messageId);else{clearInvalid(el,messageId);el.setAttribute('aria-invalid','true');}}}
const MAIN_KEYS=Object.keys(E.FIELDS),RETIREMENT_ERROR_KEYS=['retireYears','extraWithdraw','extraWithdrawYear'];
const WITHDRAW_KEYS=['annualWithdraw','retireYears','withdrawPercent','extraWithdraw','extraWithdrawYear','withdraw'];
const pageOf=key=>key in E.DREAM_FIELDS?'dreams':WITHDRAW_KEYS.includes(key)?'withdrawals':'calculator';
let lastRenderError=null,lastLoss=0,lastRealGain=0;
// Felles kontroll før deling, lagring og eksport: alle felt som følger med planen, og beregningen i aktiv modul.
function planProblem(){
 try{E.validate(s,fieldLabel);E.validateDream(s,fieldLabel);
  if(s.activePage==='dreams')E.dreamPlans(s,fieldLabel);
  else if(s.activePage==='withdrawals'){const final=E.value(s,endYear(s));if(final>0)E.withdrawal(s,final);}
 }catch(e){return e;}
 return lastRenderError;
}
// Viser feltet med feil og flytter fokus dit. Bytter side bare når feltet ligger på en annen side.
function focusField(key){const el=key&&$(key);if(!el)return;if(pageOf(key)!==s.activePage&&typeof setPage==='function')setPage(pageOf(key));for(let d=el.closest('details');d;d=d.parentElement?.closest('details'))d.open=true;markInvalid(key,pageOf(key)==='dreams'?'dreamError':pageOf(key)==='withdrawals'?'retirementResult':'error');el.focus({preventScroll:false});}
function blockIfInvalid(action){const e=planProblem();if(!e)return false;notice(e.message+' '+action,8000);focusField(e.field);return true;}
const endYear=n=>Math.round(n.years*12)/12;
// Perioder under ett år vises i måneder, ikke som «0,08 år».
const periodText=t=>{const m=Math.round(t*12);return m<12?m+(m===1?' måned':' måneder'):dec.format(t)+' år';};
const inflation=(t,n=s)=>Math.exp(Math.log1p(n.inflation/100)*t);
const display=(v,t,n=s)=>s.real?v/inflation(t,n):v;
function nominalPaid(t,n=s){return E.raw({...n,rate:0,fee:0},t,0,0);}
// Innskudd i dagens kroner: hvert innskudd regnes om med prisnivået da det ble satt inn, ikke ved sluttdatoen.
// Startbeløpet er allerede i dagens kroner. Summen er det samme som innskuddene vokst med prisveksten, delt på prisnivået ved t.
const depositsToday=(t,n=s)=>E.depositsToday(n,t);
// Innskuddene vises i samme kroneverdi som sluttbeløpet, slik at innskudd + vekst = sluttbeløp i begge visninger.
const paidShown=(t,n=s)=>s.real?depositsToday(t,n):nominalPaid(t,n);
function planRows(n){const months=Math.round(n.years*12),count=Math.min(months,600);return Array.from({length:count+1},(_,i)=>{const t=count?Math.round(i*months/count)/12:0;return {t,v:display(E.value(n,t),t,n),paid:paidShown(t,n),paidNominal:nominalPaid(t,n)};});}
function makeRows(){
 if(view.showRange&&s.rate-s.spread<=-100)throw Error('Lavt scenario må ha avkastning over −100 %. Reduser scenarioavviket eller slå av avkastningsbåndet.');
 return planRows(s).map(r=>({...r,
 low:view.showRange?display(E.value(s,r.t,s.rate-s.spread),r.t):r.v,
 high:view.showRange?display(E.value(s,r.t,s.rate+s.spread),r.t):r.v,
 bank:view.showBank?display(E.value({...s,crash:0},r.t,s.bank,0),r.t):r.v,
 goal:(view.showGoal||mode==='goal')?(s.goalReal?display(s.goal*inflation(r.t),r.t):display(s.goal,r.t)):0}));
}
function changePlan(patch,message){undoState={state:{...s},mode,view:{...view}};Object.assign(s,patch);$('undoText').textContent=message;$('undoBar').hidden=false;fill();render();}
function render(){
 try{
 E.validate(s,fieldLabel);rows=makeRows();const end=endYear(s),final=E.value(s,end),target=E.target(s),need=E.needed(s);
 if(rows.some(r=>Object.values(r).some(x=>!Number.isFinite(x)))||((view.showGoal||mode==='goal')&&!Number.isFinite(target)))throw Error('Tallene er større enn nettleseren kan beregne presist. Prøv kortere tid eller lavere vekst.');
 lastRenderError=null;$('error').hidden=true;$('error').textContent='';$('main').classList.remove('stale');syncFieldErrors(MAIN_KEYS,'error',null);const shown=display(final,end),paid=paidShown(end),nominalPaidEnd=nominalPaid(end);
 $('resultLabel').textContent=mode==='goal'?'FOR Å NÅ MÅLET TRENGER DU':`ETTER ${periodText(end).toUpperCase()} KAN DU HA`;
 $('total').textContent=mode==='goal'?(Number.isFinite(need)?money(Math.ceil(need))+' / mnd.':'Målet kan ikke nås med denne perioden'):money(shown);
 // Kroner og kjøpekraft holdes adskilt. Uten prisvekst er dagens kroner lik kroner, og setningen om dagens priser utelates.
 // «Før skatt» står i merket på resultatkortet og gjentas ikke her.
 const X=mode==='goal'?null:E.explain(s,end),notes=[];
 if(mode==='goal')notes.push('Første månedsbeløp. Grafen viser fortsatt sparingen du har lagt inn.');
 else if(!X.noInflation)notes.push(s.real?`Målt i dagens kroner. Kontoen viser da ${money(final)}.`:`Det tilsvarer ${money(X.real)} med dagens priser.`);
 if(mode!=='goal'&&Math.abs(shown)>=1e15)notes.push('Beløpet er så stort at det mister praktisk mening. Sjekk sparetid og vekst.');
 $('mobileTotal').textContent=$('total').textContent;$('paid').textContent=money(paid);$('gain').textContent=money(shown-paid);lastRealGain=s.real?shown-paid:0;
 $('paidLabel').textContent=s.real?'Innskudd i dagens kroner':'Du setter inn';$('paidNote').hidden=!s.real||Math.abs(paid-nominalPaidEnd)<0.5;$('paidNote').textContent=`Du setter inn ${money(nominalPaidEnd)}`;$('cost').textContent=money(display(E.value(s,end,s.rate,0)-final,end));
 // Et sluttbeløp under innskuddene skal aldri se ut som en gevinst. Tapet vises i resultatet og i sammendraget.
 // Tap i kroner: sluttverdien er lavere enn summen av innskuddene, målt i vanlige kroner i begge visninger.
 // Lavere kjøpekraft: sluttverdien i dagens kroner er lavere enn innskuddene i dagens kroner (paid i den visningen).
 // Det er ikke et tap i kroner, og vises separat i visningen med dagens kroner.
 lastLoss=mode==='goal'||nominalPaidEnd-final<0.5?0:nominalPaidEnd-final;
 const powerGap=mode!=='goal'&&s.real&&!lastLoss?Math.max(0,paid-shown):0;
 // Tre tilfeller, vurdert på den faktiske verdien i kroner (ikke avrundet visning, og uavhengig av dagens kroner):
 // alt tapt, delvis tapt, og ingen tap i kroner men lavere kjøpekraft. Uten innskudd er ingenting tapt.
 const nominalLoss=lastLoss?X.loss:0,allLost=lastLoss&&X.allLost,almostAll=lastLoss&&X.almostAll;
 // Årsaken nevnes. Kostnadene får bare skylden når et ellers likt scenario uten kostnader ikke gir tap.
 const less=`du har ${money(nominalLoss)} mindre enn du har satt inn.`;
 if(allLost)notes.push('Du har tapt alle pengene du har investert.');
 else if(almostAll)notes.push('Du har tapt nesten alle pengene du har investert. Under 1 kr er igjen.');
 else if(lastLoss)notes.push((X.cause==='fees'?(X.growthOnly?`Kostnadene har redusert sparingen med ${money(nominalLoss)}.`:`Kostnadene på ${money(X.costEffect)} er større enn veksten, så ${less}`):X.cause==='fall'?`Børsfallet gjør at ${less}`:X.cause==='fall+fees'?`Børsfallet og kostnadene gjør at ${less}`:X.cause==='value+fees'?`Negativ avkastning og kostnadene gjør at ${less}`:`Negativ avkastning gjør at ${less}`)+(s.real&&!X.noInflation?` Beløpet er i kroner, ikke justert for prisvekst. Målt i dagens kroner er verdien ${money(paid-shown)} lavere enn innskuddene i dagens kroner. Det samlede tapet består av både tapet i kroner og prisveksten.`:''));
 else if(powerGap>=0.5)notes.push((final-nominalPaidEnd>=0.5?'Pengene har økt i kroner, men ikke holdt følge med prisveksten.':'Pengene har ikke økt i kroner, og har derfor ikke holdt følge med prisveksten.')+` Målt i dagens kroner er verdien ${money(powerGap)} lavere enn innskuddene i dagens kroner.`);
 else if(X&&X.powerGap)notes.push('Sparingen har ikke holdt følge med prisveksten, så pengene kan kjøpe mindre enn innskuddene kunne da du satte dem inn.');
 $('secondary').textContent=notes.join(' ');$('secondary').hidden=!notes.length;
 $('mobileResultLabel').textContent=mode==='goal'?'Nødvendig per måned · før skatt':allLost?'Alle innskuddene er tapt · før skatt':lastLoss?`${money(nominalLoss)} under innskuddene · før skatt`:(powerGap>=0.5||X&&X.powerGap)?'Lavere kjøpekraft enn innskuddene · før skatt':s.real?'Dagens kroner · før skatt':'Regneeksempel · før skatt';
 $('mobileCurve').hidden=mode==='goal';
 const miniMax=Math.max(1,...rows.map(r=>Math.max(r.v,r.paid)));
 const miniPath=key=>rows.map((r,i)=>(i?'L':'M')+(3+(end?r.t/end:0)*74).toFixed(2)+','+(35-r[key]/miniMax*32).toFixed(2)).join(' ');
 $('mobileValueCurve').setAttribute('d',miniPath('v'));$('mobilePaidCurve').setAttribute('d',miniPath('paid'));
 $('chartSubtitle').textContent=s.real?'Beløpene er justert for prisvekst.':'Beløpene viser kroner på det fremtidige tidspunktet.';
 $('essentialsValue').textContent=`${dec.format(s.inflation)} % prisvekst · ${dec.format(s.fee)} % kostnad`;
 const ratio=target===0?1:final/target,hit=rows.find(r=>r.v>=r.goal);
 $('goalCard').hidden=!(view.showGoal||mode==='goal');
 $('goalTitle').textContent=ratio>=1?'Planen når beløpet du ønsker':`${money(display(Math.max(0,target-final),end))} igjen til målet`;
 $('goalText').textContent=`${dec.format(ratio*100)} % av målet ved slutten av perioden.`+(hit?` Første passering rundt år ${dec.format(hit.t)} i modellen.`:'');
 $('progress').style.width=Math.max(0,Math.min(100,ratio*100))+'%';$('goalAction').replaceChildren();
 if(Number.isFinite(need)){const b=document.createElement('button');b.textContent=`Prøv ${money(Math.ceil(need))} per måned`;b.onclick=()=>changePlan({monthly:Math.ceil(need)},'Månedssparingen er tilpasset målet.');$('goalAction').append(b);}
 chart();table();experiments();plainExplanation(final,end);tips(need);retirement(final,end);$('withdrawCapital').textContent=money(final);drawWithdrawal(final);savedRender();syncLevel();
 }catch(err){lastRenderError=err;$('main').classList.add('stale');syncFieldErrors(MAIN_KEYS,'error',err.field);$('error').hidden=false;$('error').textContent=err.message+' Resultatene nedenfor er ikke oppdatert.';$('mobileTotal').textContent='Sjekk tallene';$('mobileCurve').hidden=true;}
 if(window.renderDream)window.renderDream();
}
function selectedComparisons(){return saved.map((item,index)=>({item,index})).filter(x=>selectedPlans.has(x.index)&&x.item.state.activePage!=='dreams').map(({item,index})=>{try{const n={...E.defaults,...item.state};E.validate(n);const points=planRows(n);if(points.some(p=>!Number.isFinite(p.v)))return null;return {name:item.name,index,n,points};}catch{return null;}}).filter(Boolean);}
function chart(){
 const el=$('chart'),W=Math.max(220,Math.round(el.getBoundingClientRect().width)||680),H=W<450?260:320,L=W<450?68:82,R=14,T=25,B=38,w=W-L-R,h=H-T-B;
 const comparisons=selectedComparisons(),colors=['#9b6837','#6879a5','#9b6480'];
 const series=[{name:'Din plan',color:'#24684f',points:rows.map(r=>({t:r.t,v:r.v})),bold:true},{name:s.real?'Innskudd i dagens kroner':'Du setter inn',color:'#93a18c',dash:true,points:rows.map(r=>({t:r.t,v:r.paid}))}];
 if(view.showBank)series.push({name:'Bank',color:'#a57f32',points:rows.map(r=>({t:r.t,v:r.bank}))});
 if(view.showGoal||mode==='goal')series.push({name:'Sparemål',color:'#8c6d88',dash:true,points:rows.map(r=>({t:r.t,v:r.goal}))});
 comparisons.forEach((c,i)=>series.push({name:c.name,color:colors[i%colors.length],points:c.points}));
 const maxTime=Math.max(endYear(s),...comparisons.map(c=>endYear(c.n))),max=Math.max(1,...series.flatMap(a=>a.points.map(p=>p.v)),...(view.showRange?rows.map(r=>r.high):[]));
 // Uten beløp å vise gir en graf med aksetall bare forvirring.
 if(Math.max(0,...series.flatMap(a=>a.points.map(p=>p.v)))<=0){el.onpointermove=null;el.onkeydown=null;el.innerHTML='<p class="hint chart-empty">Ingen beløp å vise ennå. Legg inn et startbeløp eller et beløp du sparer hver måned.</p>';$('chartLegend').innerHTML='';$('chartNote').textContent='';return;}
 // Lineær akse: runde trinn (1, 2, 2,5 eller 5 ganger en tierpotens), slik at aksetallene blir lesbare og ulike.
 const niceStep=x=>{const p=10**Math.floor(Math.log10(x)),f=x/p;return (f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*p;};
 const transform=v=>s.log?Math.log10(1+Math.max(0,v)):v,top=s.log?(Number.isFinite(transform(max)*1.08)?transform(max)*1.08:transform(max)):(Number.isFinite(max*1.04/4)?niceStep(max*1.04/4)*4:max);
 const x=t=>L+(maxTime?t/maxTime:0)*w,y=v=>T+h-transform(v)/top*h;
 const path=points=>points.map((p,i)=>(i?'L':'M')+x(p.t).toFixed(2)+','+y(p.v).toFixed(2)).join(' ');
 let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Spareutvikling i ${s.real?'dagens':'fremtidige'} kroner"><title>Utvikling i sparingen</title><desc>${escapeHTML(series.map(a=>a.name).join(', '))}. År langs vannrett akse, kroner langs loddrett akse.</desc><defs><linearGradient id="spareArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#98b77a" stop-opacity=".32"/><stop offset="1" stop-color="#98b77a" stop-opacity=".03"/></linearGradient><clipPath id="plotClip"><rect x="${L}" y="${T}" width="${w}" height="${h}"/></clipPath></defs>`;
 for(let i=0;i<5;i++){const yy=T+h-i*h/4,v=s.log?10**(top*i/4)-1:top*i/4;svg+=`<line x1="${L}" y1="${yy}" x2="${W-R}" y2="${yy}" stroke="#e6ebe1"/><text x="${L-9}" y="${yy+4}" text-anchor="end">${axisCompact(v)}</text>`;}
 const ticks=maxTime===0?1:W<450?4:6;for(let i=0;i<ticks;i++){const pos=ticks===1?0:i/(ticks-1);svg+=`<text x="${L+w*pos}" y="${H-10}" text-anchor="${i===ticks-1?'end':i===0?'start':'middle'}">${maxTime>=1e6?(maxTime*pos).toExponential(1):maxTime>=10?nf.format(maxTime*pos):dec.format(maxTime*pos)} år</text>`;}
 svg+='<g clip-path="url(#plotClip)">';
 if(view.showRange)svg+=`<path d="${path(rows.map(r=>({t:r.t,v:r.high})))} ${rows.slice().reverse().map(r=>'L'+x(r.t)+','+y(r.low)).join(' ')} Z" fill="#c5d9b5" opacity=".5"/>`;
 svg+=`<path d="${path(series[0].points)} L${x(rows.at(-1).t)},${T+h} L${L},${T+h} Z" fill="url(#spareArea)"/>`;
 if(view.showRange){for(const [key,color,dash]of [['low','#a77547','6 4'],['high','#637ca2','2 4']])svg+=`<path d="${path(rows.map(r=>({t:r.t,v:r[key]})))}" fill="none" stroke="${color}" stroke-width="1.7" stroke-dasharray="${dash}"/>`;}
 for(const a of series)svg+=`<path d="${path(a.points)}" fill="none" stroke="${a.color}" stroke-width="${a.bold?3:2}" ${a.dash?'stroke-dasharray="5 5"':''}/>`;
 svg+=`<line id="chartGuide" x1="${L}" x2="${L}" y1="${T}" y2="${T+h}" stroke="#9ba98f" stroke-dasharray="3 3" opacity="0"/></g></svg><div class="chart-readout" id="chartTip">Pek eller trykk på grafen for å lese tall. Piltastene virker også.</div>`;
 el.innerHTML=svg;
 $('chartLegend').innerHTML=series.map(a=>`<span class="${a.dash?'dash-key':''}" style="--series:${a.color}"><i></i>${escapeHTML(a.name)}</span>`).join('')+(view.showRange?'<span class="range-key" style="--series:#91ae79"><i></i>Lavere og høyere vekst</span>':'');
 $('chartNote').textContent=view.showRange?'Båndet viser valgt avkastning ± '+dec.format(s.spread)+' prosentpoeng. Dette er regneeksempler, ikke sannsynligheter. Alt er før skatt.':'Jevn avkastning er et regneeksempel. I virkeligheten vil verdien svinge. Alt er før skatt.';
 let time=0;const show=t=>{time=Math.max(0,Math.min(maxTime,t));const hoverSeries=[...series,...(view.showRange?[{name:'Lavere vekst',points:rows.map(r=>({t:r.t,v:r.low}))},{name:'Høyere vekst',points:rows.map(r=>({t:r.t,v:r.high}))}]:[])];const text=hoverSeries.filter(a=>time<=a.points.at(-1).t+1e-8).map(a=>{const p=a.points;let hi=p.findIndex(r=>r.t>=time);if(hi<0)hi=p.length-1;const lo=Math.max(0,hi-1),d=p[hi].t-p[lo].t,v=d?p[lo].v+(p[hi].v-p[lo].v)*(time-p[lo].t)/d:p[hi].v;return a.name+': '+money(v);});$('chartTip').textContent=`År ${dec.format(time)} · `+text.join(' · ');const line=$('chartGuide');line.setAttribute('x1',x(time));line.setAttribute('x2',x(time));line.setAttribute('opacity','1');};
 el.onpointermove=e=>{const box=el.querySelector('svg').getBoundingClientRect();if(e.clientY>box.bottom)return;show(((e.clientX-box.left)/box.width*W-L)/w*maxTime);};
 el.onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();show(e.key==='Home'?0:e.key==='End'?maxTime:time+(e.key==='ArrowRight'?1:-1)/12);}};
}
function table(){const selected=rows.filter((r,i)=>i===0||i===rows.length-1||Math.floor(r.t)!==Math.floor(rows[i-1].t));const keys=['v','paid',...(view.showBank?['bank']:[]),...(view.showRange?['low','high']:[])],names={v:'Din plan',paid:s.real?'Innskudd i dagens kr':'Du setter inn',bank:'Bank',low:'Lavere avkastning',high:'Høyere avkastning'};$('tableWrap').innerHTML='<table><caption class="hint">'+(s.real?'Dagens kroner':'Fremtidige kroner')+', før skatt</caption><thead><tr><th>År</th>'+keys.map(k=>'<th>'+names[k]+'</th>').join('')+'</tr></thead><tbody>'+selected.map(r=>`<tr><td>${dec.format(r.t)}</td>${keys.map(k=>`<td>${money(r[k])}</td>`).join('')}</tr>`).join('')+'</tbody></table>';}
function experiments(){const es=[['500 kr mer per måned','monthly',s.monthly+500],['To år mer å spare','years',s.years+2],s.fee>0?['0,2 prosentpoeng lavere kostnad','fee',Math.max(0,s.fee-.2)]:['Ett prosentpoeng lavere vekst','rate',s.rate-1]];const current=display(E.value(s,endYear(s)),endYear(s));$('experiments').replaceChildren();for(const [title,key,value]of es){const n={...s,[key]:value};let result;try{E.validate(n);result=display(E.value(n,endYear(n)),endYear(n),n);}catch{continue;}if(!Number.isFinite(result))continue;const d=document.createElement('div');d.className='experiment';d.innerHTML=`<span>${title}</span><strong>${money(result)}</strong><small>${result>=current?'+':'−'} ${money(Math.abs(result-current))}${s.real?' i dagens kroner':''}</small>`;const b=document.createElement('button');b.textContent='Prøv';b.setAttribute('aria-label','Prøv '+title.toLowerCase());b.onclick=()=>changePlan({[key]:value},title+'.');d.append(b);$('experiments').append(d);}}
function plainExplanation(final,end){const paid=nominalPaid(end),growth=final-paid;let html=`<p>Du setter inn <b>${money(paid)}</b> i løpet av ${dec.format(end)} år. Med tallene du har valgt, ${growth>=0?'vokser pengene med':'reduseres beløpet med'} <b>${money(Math.abs(growth))}</b> etter kostnader.</p><p><b>Saldo og kjøpekraft er ulike ting.</b> Sluttbeløpet er ${money(final)}, men med ${dec.format(s.inflation)} % årlig prisvekst kan det kjøpe omtrent det samme som ${money(final/inflation(end))} kan kjøpe i dag.</p>`;if(s.growth)html+=`<p>Månedsbeløpet øker underveis. Siste måned setter du inn omtrent <b>${money(s.monthly*Math.pow(1+s.growth/100,Math.max(0,Math.round(end*12)-1)/12))}</b>.</p>`;html+='<p>Det du kan teste selv: beløpet du setter av, tiden du gir planen og kostnadene. Du kan velge en avkastning i modellen, men du kan ikke bestemme hva markedet faktisk gir.</p>';$('plainExplanation').innerHTML=html;}
function tips(need){const content=[];if(s.years<5||s.purpose==='buffer')content.push(['Når pengene skal brukes snart','En kort eller fast frist gir lite rom for å vente etter et børsfall. Undersøk bankvilkår og innskuddsgaranti for penger du må ha tilgjengelige.']);else content.push(['En plan du kan holde fast ved','Test lavere avkastning før du bestemmer sparebeløpet. Store svingninger kan gjøre en plan vanskelig å følge, selv med lang tid igjen.']);if(view.showGoal||mode==='goal')content.push(['Veien til målet',Number.isFinite(need)?`Modellen trenger ${money(Math.ceil(need))} første måned for å nå målet. Mer tid eller et lavere mål kan være alternativer hvis beløpet er for høyt.`:'Med disse forutsetningene kan målet ikke nås i valgt periode.']);if(s.rate>10)content.push(['En krevende vekstforutsetning','Du har valgt over 10 % årlig avkastning. Prøv vesentlig lavere vekst før du baserer et viktig mål på resultatet.']);content.push(['Se kostnadene samlet','Ta med både fondskostnad og eventuelt plattformgebyr. Lavere kostnad gir mer igjen når alt annet er likt.']);$('tips').innerHTML=content.map(([h,p])=>`<div class="tip"><h3>${h}</h3><p>${p}</p></div>`).join('');}
function retirement(final,t){
 const percent=s.withdrawMode==='percent',remaining=percent&&s.withdrawBase==='remaining';
 $('annualWithdraw').closest('label').hidden=percent||s.withdrawMode==='budget';$('withdrawPercent').closest('label').hidden=!percent;$('withdrawBaseLabel').hidden=!percent;
 $('withdrawInflation').disabled=remaining;
 $('withdrawExplanation').textContent=remaining?'En fast prosent av saldoen gir varierende kronebeløp. Inflasjonsjustering gjelder faste årsbeløp; kjøpekraften vises uansett i tabellen.':'Med inflasjonsjustering øker årsbeløpet med valgt inflasjon fra år 2. Uten justering er kronebeløpet likt hvert år.';
 if(final===0){syncFieldErrors(RETIREMENT_ERROR_KEYS,'retirementResult',null);$('retirementResult').innerHTML='<div class="withdraw-result"><h2>Ingen penger ved uttaksstart</h2><p>Legg inn et startbeløp eller månedlig sparing i spareplanen for å beregne uttak.</p></div>';$('withdrawTable').innerHTML='';return;}
 try{const r=E.withdrawal(s,final);syncFieldErrors(RETIREMENT_ERROR_KEYS,'retirementResult',null);let heading,body;
 if(s.withdrawMode==='budget'){heading=money(r.w)+' første år';body=`Tilsvarer ${money(r.w/12)} per måned. Beregnet for å bruke opp kapitalen over ${r.n} år.`;}
 else if(s.withdrawMode==='duration'){heading=Number.isFinite(r.exhausted)?`Pengene varer til uttaket i år ${r.exhausted}`:'Pengene tømmes ikke i denne modellen';body=Number.isFinite(r.exhausted)?`Siste tilgjengelige beløp tas ut i år ${r.exhausted}. Tabellen viser valgt periode på ${r.n} år.`:'Den jevne avkastningen dekker uttakene under disse forutsetningene. Det er ikke en garanti.';}
 else if(percent){heading=money(r.first.actual)+' i første uttak';body=r.remaining?'Prosenten tas av saldoen etter årets avkastning. Uten ekstrauttak tømmes ikke en positiv saldo helt matematisk ved en sats under 100 %, men uttakene kan bli svært små.':'Prosenten brukes på startkapitalen for å finne første årsbeløp. Videre uttak følger inflasjonsvalget ditt.';}
 else {heading=money(r.last.balance)+' igjen etter '+r.n+' år';body=Number.isFinite(r.exhausted)&&r.exhausted<=r.n?`Kapitalen tømmes ved uttaket i år ${r.exhausted}.`:`Første årsuttak er ${money(r.first.actual)}, tilsvarende ${money(r.first.actual/12)} per måned.`;}
 body+=r.extraRequested>0?(r.extraYear>r.n?` Ekstrauttaket i år ${r.extraYear} ligger utenfor tabellperioden.`:` Ekstrauttak i år ${r.extraYear}: ${money(r.extraActual)}.`)+(r.extraActual<r.extraRequested&&r.extraYear<=r.n?` Ønsket ${money(r.extraRequested)}, men saldoen dekker ikke hele beløpet.`:''):'';
 $('retirementResult').innerHTML=`<div class="withdraw-result"><div class="eyebrow">STARTKAPITAL ${money(final)}</div><span class="tax-label">Før skatt på uttak</span><h2>${heading}</h2><p>${body}</p><div class="two"><div><span>Totalt tatt ut før skatt på ${r.n} år</span><strong>${money(r.last.total)}</strong></div><div><span>Saldo før skatt etter ${r.n} år</span><strong>${money(r.last.balance)}</strong></div></div></div>`;
 $('withdrawTable').innerHTML='<table><thead><tr><th>Uttaksår</th><th>Årsuttak før skatt</th><th>Ekstrauttak før skatt</th><th>Per måned før skatt¹</th><th>Kjøpekraft før skatt</th><th>Saldo etter uttak</th></tr></thead><tbody>'+r.points.map(p=>`<tr><td>${p.year}</td><td>${money(p.actual)}</td><td>${money(p.extra||0)}</td><td>${money(p.actual/12)}</td><td>${money(p.real)}</td><td>${money(p.balance)}</td></tr>`).join('')+'</tbody></table><p class="hint">¹ Årsbeløp delt på 12 til sammenligning; selve modellen tar ut én gang i året. Ved lange perioder vises et utvalg år.</p>';
 }catch(err){$('retirementResult').textContent=err.message;$('withdrawTable').innerHTML='';syncFieldErrors(RETIREMENT_ERROR_KEYS,'retirementResult',err.field);}
}
function drawWithdrawal(capital){if(capital===0){$('withdrawChart').replaceChildren();return;}try{const r=E.withdrawal(s,capital),W=650,H=200,L=65,R=15,T=25,B=30,w=W-L-R,h=H-T-B,max=Math.max(1,...r.points.map(p=>p.balance));let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Saldo gjennom uttaksperioden"><title>Pengene som er igjen etter uttak</title>`;for(let i=0;i<3;i++){const y=T+h-i*h/2;svg+=`<line x1="${L}" y1="${y}" x2="${W-R}" y2="${y}" stroke="#e1e7da"/><text x="${L-8}" y="${y+4}" text-anchor="end">${axisCompact(max*i/2)}</text>`;}svg+=`<path d="${r.points.map((p,i)=>(i?'L':'M')+(L+p.year/r.n*w)+','+(T+h-p.balance/max*h)).join(' ')}" fill="none" stroke="#28664d" stroke-width="3"/><text x="${L}" y="${H-4}">Uttaksår 0</text><text x="${W-R}" y="${H-4}" text-anchor="end">${r.n} år</text></svg>`;$('withdrawChart').innerHTML=svg;}catch{$('withdrawChart').replaceChildren();}}
function savedRender(){
 const focused=document.activeElement?.dataset.compareIndex;
 $('savedCount').textContent=saved.length;$('saved').replaceChildren();
 if(!saved.length){$('saved').innerHTML='<p class="hint">Ingen lagrede planer ennå. Prøv å lagre en plan før du endrer månedssparingen eller kostnadene.</p>';$('comparison').innerHTML='';$('comparisonNote').textContent='';return;}
 saved.forEach((item,i)=>{const n={...E.defaults,...item.state},row=document.createElement('div');row.className='saved-row';const label=document.createElement('label');label.className='check';const cb=document.createElement('input');cb.type='checkbox';cb.dataset.compareIndex=String(i);cb.checked=selectedPlans.has(i);cb.disabled=n.activePage==='dreams';cb.setAttribute('aria-label','Sammenlign '+item.name);cb.onchange=()=>{if(cb.checked&&selectedPlans.size>=3){cb.checked=false;notice('Du kan sammenligne tre lagrede planer om gangen.');return;}cb.checked?selectedPlans.add(i):selectedPlans.delete(i);setPage('calculator');chart();savedRender();};const name=document.createElement('span');name.textContent=item.name;const sub=document.createElement('small');sub.textContent=n.activePage==='dreams'?`Sparemål: ${money(n.dreamCost)} om ${dec.format(n.dreamYears)} år. Åpne og velg et sparealternativ før graf-sammenligning.`:`${dec.format(n.years)} år · ${money(n.monthly)}/mnd. · ${dec.format(n.rate)} % avkastning`;name.append(sub);label.append(cb,name);row.append(label);
 for(const [txt,fn]of [['Åpne',()=>{openSavedPlan(item);}],['Slett',()=>{undoState={state:{...s},mode,view:{...view},saved:saved.map(x=>({...x})),selected:[...selectedPlans]};saved.splice(i,1);selectedPlans=new Set([...selectedPlans].filter(x=>x!==i).map(x=>x>i?x-1:x));persist();$('undoBar').hidden=false;$('undoText').textContent='Planen er slettet fra denne nettleseren.';render();}]]){const b=document.createElement('button');b.textContent=txt;b.setAttribute('aria-label',txt+' '+item.name);b.onclick=fn;row.append(b);}$('saved').append(row);
 });
 if(focused!==undefined)$('saved').querySelector('[data-compare-index="'+focused+'"]')?.focus({preventScroll:true});
 const compare=selectedComparisons();if(!compare.length){$('comparison').innerHTML='';$('comparisonNote').textContent='Kryss av en plan for å vise den sammen med dagens beregning i grafen.';return;}
 const items=[{name:'Din plan nå',n:s},...compare];$('comparison').innerHTML='<table><thead><tr><th>Plan</th><th>Spareår</th><th>Innskudd</th><th>Sluttbeløp</th><th>Dagens kroner</th><th>Kostnadseffekt</th></tr></thead><tbody>'+items.map(c=>{const t=endYear(c.n),v=E.value(c.n,t);return '<tr><td>'+escapeHTML(c.name)+'</td><td>'+dec.format(t)+'</td><td>'+money(nominalPaid(t,c.n))+'</td><td>'+money(v)+'</td><td>'+money(v/inflation(t,c.n))+'</td><td>'+money(E.value(c.n,t,c.n.rate,0)-v)+'</td></tr>';}).join('')+'</tbody></table>';
 $('comparisonNote').textContent='Hver kurve slutter ved sin valgte spareperiode. Kostnadseffekten inkluderer tapt vekst på pengene.'+(compare.some(c=>c.n.inflation!==s.inflation)?' Planene har ulik inflasjon. Kjøpekraften beregnes med hver plans egen sats.':'');
}
function openSavedPlan(item){
 undoState={state:{...s},mode,view:{...view}};
 const checked=E.sanitize(item.state);s=checked.state;mode=item.mode==='goal'?'goal':'explore';
 view={showBank:!!item.view?.showBank,showRange:!!item.view?.showRange,showGoal:!!item.view?.showGoal};
 $('undoText').textContent='Åpnet «'+item.name+'».'+(checked.allReset?' Planen hadde ugyldige tall og er satt til standardverdier.':(checked.adjusted.length?' '+adjustedText(checked.adjusted):'')+(checked.rejected.length?' Ugyldige verdier i '+quoted(checked.rejected)+' er satt til standardverdi.':''));$('undoBar').hidden=false;fill();render();setPage(s.activePage);
}
function persist(){try{localStorage.setItem('sv-scenarios',JSON.stringify(saved));return true;}catch{notice('Nettleseren tillater ikke lagring. Bruk Del plan for å beholde tallene.');return false;}}
function syncLevel(){document.body.dataset.level=level;for(const b of $('levels').children)b.setAttribute('aria-pressed',b.dataset.level===level);$('levelDescription').textContent={simple:'Det viktigste, forklart enkelt.',explore:'Flere valg og forklaringer underveis.',advanced:'Alle forutsetninger og metodedetaljer.'}[level];
 const labels={rate:['Antatt årlig vekst','Årlig avkastning','Årlig avkastning før kostnader'],inflation:['Prisvekst per år','Årlig inflasjon','Årlig inflasjon (KPI-forutsetning)'],fee:['Kostnad per år','Årlig kostnad','Årlig samlet forvaltningskostnad'],growth:['Årlig endring i månedssparingen','Årlig endring i sparingen','Årlig endring i innskudd'],spread:['Lavere og høyere vekst','Avvik i avkastning','Scenarioavvik i prosentpoeng']},i=['simple','explore','advanced'].indexOf(level);
 for(const [key,values]of Object.entries(labels))$(key).closest('label').querySelector('.field-label').textContent=values[i];for(const el of document.querySelectorAll('.fieldbox input')){const label=el.closest('label').querySelector('.field-label');if(label)el.setAttribute('aria-label',label.textContent);}$('realLabel').textContent=level==='simple'?'Vis hva pengene kan kjøpe':level==='explore'?'Vis dagens kjøpekraft':'Realverdi (dagens kroner)';$('gainLabel').textContent=s.real?(lastLoss>0?'Samlet tap i dagens kroner':lastRealGain<=-0.5?'Tapt kjøpekraft':level==='simple'?'Vekst i kjøpekraft':'Vekst etter kostnader og prisvekst'):lastLoss>0?'Tap mot innskuddene':level==='simple'?(s.fee>0?'Vekst etter kostnader':'Beregnet vekst'):'Avkastning etter kostnader';
 const active=[];if(level==='simple'&&s.growth)active.push(`${dec.format(s.growth)} % årlig endring i månedssparingen`);if(level!=='advanced'&&s.extra)active.push(`${money(s.extra)} ekstra etter ${dec.format(s.extraYear)} år`);if(level!=='advanced'&&s.crash)active.push(`${dec.format(s.crash)} % fall etter ${dec.format(s.crashYear)} år`);if(level!=='advanced'&&s.log)active.push('like prosentsteg i grafen');if(level==='simple'&&view.showBank)active.push(`bank: ${dec.format(s.bank)} %`);if(level==='simple'&&(view.showGoal||mode==='goal'))active.push(`mål: ${money(s.goal)}${s.goalReal?' i dagens kroner':''}`);
 $('hiddenAssumptions').hidden=!active.length;$('hiddenAssumptions').innerHTML=active.length?'Også med i beregningen: '+escapeHTML(active.join(' · '))+'. <button id="revealSettings">Se innstillingene</button>':'';if($('revealSettings'))$('revealSettings').onclick=()=>{setLevel('advanced');$('advancedDetails').open=true;$('eventsDetails').open=true;};}
function setLevel(value){level=value;try{localStorage.setItem('sv-level',level);}catch{}syncLevel();if(window.renderDream)window.renderDream();}
// State changes are read once per user input. Empty numeric fields calculate as zero.
document.addEventListener('input',event=>{if(!event.target.closest('#taxDialog')&&event.target.id in E.defaults){read();render();}});
// Tusenskille settes når brukeren forlater feltet, ikke mens det skrives, slik at markøren ikke hopper.
// Startguidens felt grupperes også, men et tomt felt der (for eksempel alder) forblir tomt.
document.addEventListener('focusout',event=>{const el=event.target;if(el.id?.startsWith('onboard')&&el.inputMode==='decimal'&&el.value.trim()!==''){const v=parsedNumber(el.value);if(Number.isFinite(v))el.value=groupedNumber(v);return;}if(typeof E.defaults[el.id]!=='number')return;if(el.value.trim()===''){el.value='0';read();render();}const value=parsedNumber(el.value);if(Number.isFinite(value))el.value=groupedNumber(value);});
$('levels').onclick=e=>{const b=e.target.closest('[data-level]');if(b)setLevel(b.dataset.level);};
$('undo').onclick=()=>{if(!undoState)return;s={...undoState.state};mode=undoState.mode;view={...undoState.view};if(undoState.saved){saved=undoState.saved;selectedPlans=new Set(undoState.selected);persist();}undoState=null;$('undoBar').hidden=true;fill();render();};
$('modes').onclick=e=>{const b=e.target.closest('[data-mode]');if(!b)return;mode=b.dataset.mode;for(const b of $('modes').children)b.classList.toggle('active',b.dataset.mode===mode);if(mode==='goal')view.showGoal=true;fill();render();};
for(const key in view)$(key).onchange=()=>{view[key]=$(key).checked;render();};
$('reset').onclick=()=>{changePlan({...E.defaults},'Spareplanen er nullstilt til et enkelt eksempel.');mode='explore';view={showBank:false,showRange:false,showGoal:false};selectedPlans.clear();fill();render();history.replaceState(null,'',location.pathname);};
$('graphTab').onclick=()=>{$('chart').hidden=false;$('tableWrap').hidden=true;$('graphTab').setAttribute('aria-pressed','true');$('tableTab').setAttribute('aria-pressed','false');chart();};
$('tableTab').onclick=()=>{$('chart').hidden=true;$('tableWrap').hidden=false;$('graphTab').setAttribute('aria-pressed','false');$('tableTab').setAttribute('aria-pressed','true');};
function openSave(){if(blockIfInvalid('Rett feltet før du lagrer planen.'))return;$('scenarioName').value=`Plan ${saved.length+1}`;$('saveDescription').textContent=s.activePage==='dreams'?'Lagrer sparemålet og spareplanen. Graf-sammenligning bruker spareplanen. Overfør et mål-alternativ til sparekalkulatoren først hvis du vil sammenligne det.':'Lagrer alle forutsetningene på denne enheten.';$('saveDialog').showModal();$('scenarioName').select();}
$('save').onclick=openSave;$('saveHere').onclick=openSave;$('cancelSave').onclick=()=>$('saveDialog').close();$('saveForm').onsubmit=e=>{e.preventDefault();const name=$('scenarioName').value.trim();if(!name)return;saved.push({name,state:{...s},mode,view:{...view}});if(persist())notice('Planen er lagret på denne enheten.');$('saveDialog').close();savedRender();};
$('compareJump').onclick=()=>{$('savedDetails').open=true;$('savedDetails').scrollIntoView({behavior:'smooth',block:'start'});};
$('share').onclick=()=>{if(blockIfInvalid('Rett feltet før du deler planen.'))return;const params=new URLSearchParams(),privateFields=new Set(['userAge','ageKnown','until67','riskChosen','stress','ageGroup','purpose']);for(const k in s)if(!privateFields.has(k))params.set(k,typeof s[k]==='boolean'?s[k]?'1':'0':s[k]);params.set('level',level);params.set('mode',mode);for(const k in view)params.set(k,view[k]?'1':'0');$('shareUrl').value=location.origin+location.pathname+'#'+params;$('shareDialog').showModal();$('shareUrl').select();};
$('closeDialog').onclick=()=>$('shareDialog').close();
$('csv').onclick=()=>{
 if(blockIfInvalid('Rett feltet før du eksporterer.'))return;
 const columns=[['t','År'],['v',s.real?'Din plan (dagens kr)':'Din plan (fremtidige kr)'],...(s.real?[['paid','Innskudd (dagens kr)'],['paidNominal','Innskudd (kroner)']]:[['paid','Innskudd']]),...(view.showBank?[['bank','Bank']]:[]),...(view.showRange?[['low','Lavt scenario'],['high','Høyt scenario']]:[]),...((view.showGoal||mode==='goal')?[['goal','Mål']]:[])];
 const csv='\ufeff'+[columns.map(c=>c[1]),...rows.map(r=>columns.map(([key])=>String(r[key]).replace('.',',')))].map(r=>r.join(';')).join('\r\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='spareverksted.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
};
fill();render();
// Varselet vises når alle felt finnes, slik at feltnavnene er de som står på skjermen.
document.addEventListener('DOMContentLoaded',()=>{if(linkCheck.allReset){notice('Lenken hadde ugyldige tall. Du ser standardverdiene i stedet.',15000);return;}const parts=[];if(linkCheck.adjusted.length)parts.push('Lenken hadde negative verdier som kalkulatoren ikke bruker lenger. '+adjustedText(linkCheck.adjusted));if(linkCheck.rejected.length)parts.push('Lenken hadde ugyldige verdier i '+quoted(linkCheck.rejected)+'. Disse er satt til standardverdi.');if(parts.length)notice(parts.join(' ')+' Resten av planen er beholdt.',20000);});
let lastChartWidth=0;new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(width>0&&Math.abs(width-lastChartWidth)>2){lastChartWidth=width;if(rows.length)chart();}}).observe($('chart'));

