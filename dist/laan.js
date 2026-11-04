// Lånekalkulatorens side. Leser feltene, kaller LaanMotor og viser resultat, sammenligning, graf og tabell.
// Følger sparekalkulatorens mønster: detaljnivå, feltfeil ved feltet med feltnavn, dempet resultat mens et felt
// er uferdig, og graf med beskrivelse i ord. Lagrer ingenting, bortsett fra detaljnivået i fanen (sv-level),
// som sparekalkulatoren allerede bruker.
(function(){
'use strict';
const $=id=>document.getElementById(id),L=LaanMotor,T=LaanTekst,E=LaanEksport;
const nf=new Intl.NumberFormat('nb-NO',{maximumFractionDigits:0}),dec=new Intl.NumberFormat('nb-NO',{maximumFractionDigits:2});
const grouped=v=>new Intl.NumberFormat('nb-NO',{maximumFractionDigits:15}).format(v).replace(/[  ]/g,' ');
// Samme tolkning som sparekalkulatoren: mellomrom som tusenskille, komma som desimaltegn. Tomt felt er ikke 0.
const parse=v=>v.trim()===''?NaN:Number(v.replace(/[\s  ]/g,'').replace(/^−/,'-').replace(',','.'));
const escapeHTML=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const axis=x=>Math.abs(x)>=1e6?dec.format(x/1e6)+' mill.':Math.abs(x)>=1000?dec.format(x/1000)+' tusen':dec.format(x);

// Eksempeltall per lånetype. Renten er ikke et eksempeltall: feltet står tomt til brukeren fyller inn sin egen.
const EXAMPLES={bolig:{amount:3000000,years:25},bil:{amount:300000,years:5},forbruk:{amount:100000,years:3}};
const FIELDS=['amount','rate','years','establishmentFee','termFee','changeRate','changeYear','extraAmount','extraYear'];
const LABELS={changeYear:'Etter',extraYear:'Betales etter'};
const DEFAULT_TEXT={amount:'3 000 000',rate:'',years:'25',establishmentFee:'0',termFee:'0',changeRate:'',changeYear:'5',extraAmount:'',extraYear:'5'};
let kind='bolig',type='annuitet',touched=new Set(),level='simple',view='graph',lastPlan=null;

function fieldLabel(key){return $(key)?.closest('.field')?.querySelector('.field-label')?.textContent.trim()||L.label(key);}
// Feilmelding ved feltet, koblet med aria-describedby, som i sparekalkulatoren.
function fieldError(key,text){
 const el=$(key),id=key+'FieldError';let note=$(id);
 if(text&&!note){note=document.createElement('span');note.id=id;note.className='local-field-error';el.closest('.fieldbox').after(note);}
 if(note){note.textContent=text||'';note.hidden=!text;}
 const ids=(el.getAttribute('aria-describedby')||'').split(' ').filter(x=>x&&x!==id);
 if(text){el.setAttribute('aria-invalid','true');ids.push(id);}else el.removeAttribute('aria-invalid');
 ids.length?el.setAttribute('aria-describedby',ids.join(' ')):el.removeAttribute('aria-describedby');
}
// Uferdig inntasting: feltet har fokus og er tomt. Da vises ingen feil, men resultatet dempes.
const pending=key=>document.activeElement===$(key)&&$(key).value.trim()==='';

function readInputs(){
 const v={};for(const k of FIELDS)v[k]=parse($(k).value);
 const errors=[];const add=(key,text)=>{if(!errors.some(e=>e.key===key))errors.push({key,text});};
 for(const k of ['amount','years','establishmentFee','termFee']){const t=L.fieldError(k,v[k],fieldLabel);if(t)add(k,t);}
 if($('rate').value.trim()===''){if(!pending('rate'))errors.push({key:'rate',text:null,empty:true});}else{const t=L.fieldError('rate',v.rate,fieldLabel);if(t)add('rate',t);}
 const input={kind,type,amount:v.amount,rate:v.rate,years:v.years,establishmentFee:v.establishmentFee,termFee:v.termFee,rateChanges:[],extraPayments:[]};
 const n=Math.round(v.years*12),okYears=Number.isFinite(n)&&!errors.some(e=>e.key==='years');
 const yearsError=(key,val,min)=>{if(!Number.isFinite(val))return `Fyll inn et gyldig tall i «${fieldLabel(key)}».`;if(val<min||(okYears&&Math.round(val*12)>=n))return `«${fieldLabel(key)}» må være fra ${min?'én måned':'0 år'} og mindre enn nedbetalingstiden.`;return null;};
 if($('changeRate').value.trim()!==''){
  const t=L.fieldError('changeRate',v.changeRate,fieldLabel)||yearsError('changeYear',v.changeYear,0);
  if(t)add(L.fieldError('changeRate',v.changeRate,fieldLabel)?'changeRate':'changeYear',t);else input.rateChanges.push({term:Math.round(v.changeYear*12)+1,rate:v.changeRate});
 }
 if($('extraAmount').value.trim()!==''){
  const t=L.fieldError('extraAmount',v.extraAmount,fieldLabel);const ty=yearsError('extraYear',v.extraYear,1/12);
  if(t)add('extraAmount',t);else if(ty)add('extraYear',ty);else input.extraPayments.push({term:Math.round(v.extraYear*12),amount:v.extraAmount});
 }
 if(!errors.length&&v.establishmentFee>=v.amount)add('establishmentFee',`«${fieldLabel('establishmentFee')}» må være lavere enn lånebeløpet.`);
 return {input,errors};
}

function render(){
 const {input,errors}=readInputs(),waiting=FIELDS.some(pending);
 for(const k of FIELDS){const e=errors.find(x=>x.key===k);fieldError(k,e&&e.text&&!pending(k)?e.text:null);}
 const real=errors.filter(e=>e.text);
 $('error').hidden=!real.length;$('error').textContent=real.length?real[0].text+(real.length>1?` Og ${real.length-1} felt til må rettes.`:''):'';
 syncLevelFields(input);syncSliders();
 const missingRate=errors.some(e=>e.empty)||($('rate').value.trim()===''&&pending('rate'));
 document.body.classList.toggle('loan-empty',missingRate&&!lastPlan);
 if(missingRate){showEmpty();return;}
 if(real.length||waiting){document.body.classList.toggle('stale',!!lastPlan);$('mobileTotal').textContent='Rett feltene';return;}
 document.body.classList.remove('stale');
 let p;try{p=L.plan(input);}catch(err){$('error').hidden=false;$('error').textContent=err.message;return;}
 lastPlan=p;show(p,input);
}

function showEmpty(){
 lastPlan=null;document.body.classList.remove('stale');document.body.classList.add('loan-empty');
 $('resultLabel').textContent='Hver måned';$('payment').textContent='Fyll inn renten';
 $('resultText').textContent='Skriv inn den nominelle årsrenten fra tilbudet eller avtalen din, så ser du hva lånet koster.';
 $('mobileTotal').textContent='Fyll inn renten';$('mobileValueCurve').setAttribute('d','M0 0');
 for(const id of ['mAmount','mInterest','mFees','mPaid'])$(id).textContent='';
 $('meaningMain').textContent='';$('extraEffect').hidden=true;$('loanNotes').hidden=true;
 $('chart').replaceChildren();$('chartLegend').replaceChildren();$('chartSummary').hidden=true;$('tableWrap').replaceChildren();
 for(const id of ['cAFirst','cALast','cAInterest','cSFirst','cSLast','cSInterest','compareText'])$(id).textContent='';
}

function show(p,input){
 const base=input.extraPayments.length?L.plan({...input,extraPayments:[]}):null,r=T.result(p,base),t=p.totals;
 $('resultLabel').textContent=r.eyebrow;$('payment').textContent=r.amount;$('resultText').textContent=r.text;
 $('mAmount').textContent=T.money(t.amount);$('mInterest').textContent=T.money(t.interest);$('mFees').textContent=T.money(t.fees);$('mPaid').textContent=T.money(t.paid);
 $('mFeesBox').hidden=!(t.fees>0||kind==='forbruk');
 $('meaningMain').textContent=r.meaning;
 $('extraEffect').hidden=!r.extra;$('extraEffect').textContent=r.extra||'';
 $('loanNotes').hidden=!r.notes.length;$('loanNotes').innerHTML=r.notes.map(n=>`<li>${escapeHTML(n)}</li>`).join('');
 // Sammenligning med de samme grunntallene, uten hendelser.
 const plain={...input,rateChanges:[],extraPayments:[]},a=L.plan({...plain,type:'annuitet'}),s=L.plan({...plain,type:'serie'}),c=T.compare(a,s);
 $('cAFirst').textContent=c.annuitet.first;$('cALast').textContent=c.annuitet.last;$('cAInterest').textContent=c.annuitet.interest;
 $('cSFirst').textContent=c.serie.first;$('cSLast').textContent=c.serie.last;$('cSInterest').textContent=c.serie.interest;$('compareText').textContent=c.text;
 drawChart(p,base,input);drawTable(p);
 $('mobileTotal').textContent=r.amount;
 $('mobileResultLabel').textContent=r.eyebrow+' · før rentefradrag'+(input.termFee?' · + gebyr':'');
 $('mobileValueCurve').setAttribute('d',[{term:0,balance:input.amount},...p.rows].map((r,i)=>(i?'L':'M')+(r.term/p.payoffTerm*80).toFixed(2)+','+(3+(1-r.balance/input.amount)*32).toFixed(2)).join(' '));
}

// Restgjeld per måned som punkter i år.
const points=p=>[{t:0,v:p.input.amount},...p.rows.map(r=>({t:r.term/12,v:r.balance}))];
let chartTime=0;
function drawChart(p,base,input){
 const el=$('chart'),W=Math.max(260,Math.round(el.getBoundingClientRect().width)||640),mobile=W<520,H=mobile?230:280,Lm=mobile?52:66,R=14,Tm=14,B=30,w=W-Lm-R,h=H-Tm-B;
 const series=[{name:'Restgjeld',points:points(p),color:'#28664d',bold:true}];
 if(base)series.push({name:'Uten ekstra innbetaling',points:points(base),color:'#a77547',dash:true});
 else if(level!=='simple'){const other=L.plan({...input,type:input.type==='annuitet'?'serie':'annuitet'});series.push({name:input.type==='annuitet'?'Som serielån':'Som annuitetslån',points:points(other),color:'#637ca2',dash:true});}
 const maxT=Math.max(...series.map(s=>s.points.at(-1).t)),maxV=p.input.amount;
 const step=(()=>{const raw=maxV*1.04/4,pw=10**Math.floor(Math.log10(raw)),f=raw/pw;return (f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*pw;})(),top=step*4;
 const x=t=>Lm+(maxT?t/maxT:0)*w,y=v=>Tm+h-v/top*h,path=pts=>pts.map((q,i)=>(i?'L':'M')+x(q.t).toFixed(2)+','+y(q.v).toFixed(2)).join(' ');
 const summary=T.chart(series[0].points,p);
 let svg=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-size="${mobile?11:12}" font-family="system-ui, sans-serif" role="img" aria-label="${escapeHTML(`Restgjeld over ${T.period(p.payoffTerm)}, fra ${T.money(maxV)} til 0 kr. Linjediagram.`)}"><title>Restgjeld over tid</title><desc>${escapeHTML(summary+' År langs vannrett akse, kroner langs loddrett akse.')}</desc><defs><linearGradient id="loanArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#98b77a" stop-opacity=".32"/><stop offset="1" stop-color="#98b77a" stop-opacity=".03"/></linearGradient></defs>`;
 for(let i=0;i<5;i++){const yy=Tm+h-i*h/4;svg+=`<line x1="${Lm}" y1="${yy}" x2="${W-R}" y2="${yy}" stroke="#e6ebe1"/><text x="${Lm-8}" y="${yy+4}" text-anchor="end">${axis(top*i/4)}</text>`;}
 const ticks=mobile?4:6,yStep=Math.max(1,Math.ceil(maxT/ticks));
 for(let yr=0;yr<=maxT+1e-9;yr+=yStep){const pos=maxT?yr/maxT:0;svg+=`<text x="${x(yr)}" y="${H-8}" text-anchor="${pos>.97?'end':pos<.03?'start':'middle'}">${yr===0?'Start':'År '+yr}</text>`;}
 svg+=`<path d="${path(series[0].points)} L${x(series[0].points.at(-1).t)},${Tm+h} L${Lm},${Tm+h} Z" fill="url(#loanArea)"/>`;
 for(const s of series.slice().reverse())svg+=`<path d="${path(s.points)}" fill="none" stroke="${s.color}" stroke-width="${s.bold?3:2}"${s.dash?' stroke-dasharray="5 5"':''}/>`;
 svg+=`<line id="chartGuide" x1="${Lm}" x2="${Lm}" y1="${Tm}" y2="${Tm+h}" stroke="#9ba98f" stroke-dasharray="3 3" opacity="0"/></svg><div class="chart-readout" id="chartTip">Pek eller trykk på grafen for å lese tall. Piltastene virker også.</div>`;
 el.innerHTML=svg;
 $('chartLegend').innerHTML=series.map(s=>`<li class="${s.dash?'dash-key':''}" style="--series:${s.color}"><i></i>${escapeHTML(s.name)}</li>`).join('');
 $('chartSummary').hidden=!summary;$('chartSummaryText').textContent=summary;
 const read=t=>{chartTime=Math.max(0,Math.min(maxT,t));const text=series.map(s=>{const q=s.points.reduce((b,c)=>c.t<=chartTime+1e-9?c:b,s.points[0]);return s.name+': '+T.money(chartTime>s.points.at(-1).t?0:q.v);});$('chartTip').textContent=`År ${dec.format(Math.round(chartTime*12)/12)} · `+text.join(' · ');const g=$('chartGuide');g.setAttribute('x1',x(chartTime));g.setAttribute('x2',x(chartTime));g.setAttribute('opacity','1');};
 el.onpointermove=e=>{const box=el.querySelector('svg').getBoundingClientRect();if(e.clientY>box.bottom)return;read(((e.clientX-box.left)/box.width*W-Lm)/w*maxT);};
 el.onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();read(e.key==='Home'?0:e.key==='End'?maxT:chartTime+(e.key==='ArrowRight'?1:-1));}};
}

function drawTable(p){
 const month=$('tablePeriod').value==='month';
 if(month){const rows=E.monthly(p);$('tableWrap').innerHTML='<table><caption>Per måned, før rentefradrag. Termin 0 er utbetaling og etableringsgebyr. Hele kroner.</caption><thead><tr>'+rows[0].map(h=>'<th scope="col">'+escapeHTML(h)+'</th>').join('')+'</tr></thead><tbody>'+rows.slice(1).map(row=>'<tr>'+row.map((v,i)=>(i?'<td>':'<th scope="row">')+escapeHTML(i===0?v:i===1?T.pct(v):T.money(v))+(i?'</td>':'</th>')).join('')+'</tr>').join('')+'</tbody></table>';}
 else $('tableWrap').innerHTML=E.table(E.yearly(p),'Per år, før rentefradrag. Avdrag inkluderer ekstra innbetaling. Hele kroner.');
}

// Detaljnivå. Gebyrer for forbrukslån vises på alle nivåer. Valg som er skjult, regnes fortsatt med og listes.
function syncLevelFields(input){
 const shown=L.visibleFields(level,kind);
 $('feesDetails').hidden=!shown.includes('termFee');
 if(kind==='forbruk'&&level==='simple')$('feesDetails').open=true;
 const fees=[input.establishmentFee>0?'etablering '+T.money(input.establishmentFee):'',input.termFee>0?T.money(input.termFee)+' per måned':''].filter(Boolean).join(', ');
 $('feesValue').textContent=fees;
 const hidden=Number.isFinite(input.amount)?L.hiddenActive({...input,kind},level):[];
 const box=$('hiddenChoices');box.hidden=!hidden.length;
 if(hidden.length){
  const text=hidden.map(h=>h.key==='establishmentFee'?`etableringsgebyr ${T.money(h.value)}`:h.key==='termFee'?`termingebyr ${T.money(h.value)} per måned`:h.key==='rateChanges'?`ny rente ${T.pct(h.value[0].rate)}`:`ekstra innbetaling ${T.money(h.value[0].amount)}`);
  box.innerHTML=`<p>Regnes med, men vises ikke på dette nivået: ${escapeHTML(text.join(', '))}.</p><button type="button" id="editHidden">Endre</button>`;
  $('editHidden').onclick=()=>{setLevel('explore');const first=hidden[0].key,target=first==='rateChanges'?'changeDetails':first==='extraPayments'?'extraDetails':'feesDetails';$(target).open=true;$(first==='rateChanges'?'changeRate':first==='extraPayments'?'extraAmount':first).focus();};
 }
}
function setLevel(value){
 level=['simple','explore','advanced'].includes(value)?value:'simple';
 try{if(level!=='simple')sessionStorage.setItem('sv-level',level);else sessionStorage.removeItem('sv-level');}catch{}
 document.body.dataset.level=level;for(const b of $('levels').children)b.setAttribute('aria-pressed',b.dataset.level===level);
 $('levelDescription').textContent={simple:'Det viktigste, forklart enkelt.',explore:'Flere valg og forklaringer underveis.',advanced:'Alle forutsetninger og metodedetaljer.'}[level];
 render();
}
function setView(v){view=v;$('graphTab').setAttribute('aria-pressed',v==='graph');$('tableTab').setAttribute('aria-pressed',v==='table');$('chart').hidden=v!=='graph';$('chartLegend').hidden=v!=='graph';$('tableWrap').hidden=v!=='table';$('tablePeriodField').hidden=v!=='table';}

// Skyveknapper er snarveier. Skrivefeltet er alltid den gjeldende verdien.
const SLIDERS={amount:{bolig:[100000,10000000,50000],bil:[10000,1000000,5000],forbruk:[5000,600000,5000]},rate:[0,15,0.05],years:[1,30,1]};
function sliderRange(id){const r=SLIDERS[id];return Array.isArray(r)?r:r[kind];}
for(const id of Object.keys(SLIDERS)){
 const field=$(id),wrap=document.createElement('div'),range=document.createElement('input'),note=document.createElement('p');
 wrap.className='range-control';range.type='range';range.id=id+'Slider';range.dataset.field=id;range.setAttribute('aria-label','Juster '+fieldLabel(id).toLowerCase());
 note.className='range-note';note.id=id+'SliderNote';note.hidden=true;note.textContent='Verdien er utenfor skyveknappens område. Skriv inn tallet i feltet.';
 wrap.append(range,note);field.closest('.fieldbox').after(wrap);
 range.addEventListener('input',()=>{field.value=grouped(Number(range.value));touched.add(id);render();});
}
function syncSliders(){for(const range of document.querySelectorAll('#basic input[type=range]')){
 const id=range.dataset.field,[min,max,step]=sliderRange(id),v=parse($(id).value);range.min=min;range.max=max;range.step=step;
 const outside=Number.isFinite(v)&&(v<min||v>max);if(Number.isFinite(v))range.value=Math.min(max,Math.max(min,v));else if(id==='rate')range.value=min;
 range.disabled=outside;const note=$(id+'SliderNote');note.hidden=!outside;
 range.setAttribute('aria-valuetext',Number.isFinite(v)?id==='amount'?T.money(v):id==='rate'?T.pct(v):dec.format(v)+' år':'Velg en rente');
 const ids=(range.getAttribute('aria-describedby')||'').split(' ').filter(x=>x&&x!==note.id);if(outside)ids.push(note.id);ids.length?range.setAttribute('aria-describedby',ids.join(' ')):range.removeAttribute('aria-describedby');
}}

function setKind(k){
 kind=k;for(const b of $('kinds').children)b.setAttribute('aria-pressed',b.dataset.kind===k);
 // Eksempeltallene byttes bare hvis brukeren ikke har skrevet inn egne. Renten røres aldri.
 for(const key of ['amount','years'])if(!touched.has(key))$(key).value=grouped(EXAMPLES[k][key]);
 syncExampleNote();render();
}
function setType(t){type=t;for(const b of $('types').children)b.setAttribute('aria-pressed',b.dataset.type===t);render();}
function syncExampleNote(){const left=['amount','years'].filter(k=>!touched.has(k));$('exampleNote').hidden=!left.length;$('exampleNote').textContent=left.length===2?'Lånebeløp og nedbetalingstid er eksempeltall. Endre dem til ditt lån.':left[0]==='amount'?'Lånebeløpet er et eksempeltall. Endre det til ditt lån.':'Nedbetalingstiden er et eksempeltall. Endre den til ditt lån.';}
function reset(){touched.clear();for(const k of FIELDS)$(k).value=DEFAULT_TEXT[k];for(const k of FIELDS)fieldError(k,null);lastPlan=null;setType('annuitet');setKind('bolig');}

// Hendelser.
$('kinds').addEventListener('click',e=>{const b=e.target.closest('[data-kind]');if(b)setKind(b.dataset.kind);});
$('types').addEventListener('click',e=>{const b=e.target.closest('[data-type]');if(b)setType(b.dataset.type);});
$('levels').addEventListener('click',e=>{const b=e.target.closest('[data-level]');if(b)setLevel(b.dataset.level);});
$('graphTab').onclick=()=>setView('graph');$('tableTab').onclick=()=>setView('table');
$('tablePeriod').onchange=()=>{if(lastPlan)drawTable(lastPlan);};
$('reset').onclick=()=>{reset();$('amount').focus();};
$('showResult').onclick=()=>{const t=$('loanResult');t.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});t.focus({preventScroll:true});};
$('mobileResultButton').onclick=$('showResult').onclick;
$('editFields').onclick=()=>{$('loanInputs').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});$('amount').focus({preventScroll:true});};
$('loanForm').addEventListener('submit',e=>{e.preventDefault();render();if(exportPlan())$('showResult').click();});

// Samme hjelpeknapp ved feltet som sparekalkulatoren. Ingen nye beregningsregler.
const HELP={amount:['Lånebeløp','Beløpet du låner, før renter og gebyrer. Skyveknappen er en snarvei. Du kan skrive et annet beløp i feltet.'],rate:['Nominell årsrente','Bruk nominell årsrente fra tilbudet eller avtalen. Den deles på 12 i beregningen. Gebyrer legges til separat. Renten er uendret gjennom perioden med mindre du legger inn en renteendring under Utforsk.'],years:['Nedbetalingstid','Tiden lånet opprinnelig skal betales ned over. År regnes om til nærmeste hele måned. Du kan skrive inn inntil 50 år. Ekstra innbetaling kan forkorte tiden.']};
for(const [id,[title,text]] of Object.entries(HELP)){
 const b=document.createElement('button');b.type='button';b.className='help-button';b.textContent='?';b.setAttribute('aria-label','Forklaring på '+title.toLowerCase());
 b.onclick=()=>{$('loanHelpTitle').textContent=title;$('loanHelpText').textContent=text;$('loanHelpDialog').showModal();};
 $(id).closest('.field').querySelector('.field-label').after(b);
}
$('closeLoanHelp').onclick=()=>$('loanHelpDialog').close();

// Eksport sperres ved ugyldige eller uferdige felt, også når et tidligere resultat er synlig.
function exportPlan(){
 const {input,errors}=readInputs();
 if(errors.length){$('exportDialog').close();render();const e=errors[0],text=e.text||'Fyll inn nominell årsrente før du laster ned beregningen.';fieldError(e.key,text);$('error').textContent=text;$('error').hidden=false;
  const target=$(e.key);for(let el=target.parentElement;el;el=el.parentElement)if(el.tagName==='DETAILS')el.open=true;
  target.focus();return null;}
 return L.plan(input);
}
const download=(data,mime,name)=>{const url=URL.createObjectURL(new Blob([data],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
const guarded=fn=>{try{const p=exportPlan();if(p)fn(p);}catch(e){$('exportError').textContent='Kunne ikke lage filen. '+e.message;$('exportError').hidden=false;}};
const openExport=()=>{if(!exportPlan())return;$('exportError').hidden=true;$('exportDialog').showModal();};
$('heroDownload').onclick=openExport;$('reportButton').onclick=openExport;
$('closeExport').onclick=()=>$('exportDialog').close();
$('exportXlsx').onclick=()=>guarded(p=>download(ExportKit.workbook(E.sheets(p)),'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','spareverksted-laan.xlsx'));
$('exportCsv').onclick=()=>guarded(p=>download(ExportKit.csv(E.monthly(p)),'text/csv;charset=utf-8','spareverksted-laan.csv'));
$('exportJson').onclick=()=>guarded(p=>download(JSON.stringify({schemaVersion:1,calculator:'loan',...p,yearly:L.byYear(p)},null,2),'application/json','spareverksted-laan.json'));
$('exportPdf').onclick=()=>guarded(p=>{$('exportDialog').close();$('reportPreview').innerHTML=E.report(p,'loanPreview');$('printReportContent').innerHTML=E.report(p,'loanPrint');$('reportDialog').showModal();});
const printController=ReportPrint.attach();
addEventListener('beforeprint',()=>{if($('reportDialog').open||printController.active())return;const {input,errors}=readInputs();$('printReportContent').innerHTML=errors.length?'<h1>Låneberegning</h1><p>Rett feltene før du skriver ut beregningen.</p>':E.report(L.plan(input),'loanPrint');});
for(const k of FIELDS){const el=$(k);
 el.addEventListener('input',()=>{touched.add(k);syncExampleNote();render();});
 el.addEventListener('blur',()=>{const v=parse(el.value);if(Number.isFinite(v)&&el.value.trim()!=='')el.value=grouped(v);render();});
}
addEventListener('resize',()=>{if(lastPlan)render();});

// Start.
for(const k of FIELDS)$(k).value=DEFAULT_TEXT[k];
try{level=sessionStorage.getItem('sv-level')||'simple';}catch{}
setView('graph');setKind('bolig');setLevel(level);
})();
