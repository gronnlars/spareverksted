'use strict';
// «Last ned valgte» (Lars 3.11.2026): de planene som er krysset av i lista, samlet i én PDF eller én Excel-fil.
// Først én sammenligning per kalkulator (Sparing, Sparemål, Uttak) med de tre øverste valgte i lista, så én del per plan.
// Bygger på tabellene i journey.js og rapporten i experience.js. Ingen nye beregninger: alt hentes fra engine.js.
(function(){
 const KINDS=['calculator','dreams','withdrawals'];
 const NAMES={calculator:'Sparing',dreams:'Sparemål',withdrawals:'Uttak'};
 const today=()=>new Date().toLocaleDateString('nb-NO',{year:'numeric',month:'long',day:'numeric'});
 const esc=x=>escapeHTML(x);
 // Planene i lista-rekkefølge. Ugyldige planer tas med som navn, men uten tall.
 function chosen(){return [...pickedPlans].sort((a,b)=>a-b).map(i=>{const item=saved[i],n={...E.defaults,...item.state};let ok=true;try{E.validate(n);if(n.activePage==='dreams')E.dreamPlans(n);}catch{ok=false;}return {name:item.name,n,kind:kindOfState(n),ok};});}
 function figures(p){const n=p.n;
  if(p.kind==='dreams'){const plans=E.dreamPlans(n);return {plans};}
  const T=endYear(n),final=E.value(n,T),out={T,final,real:final/inflation(T,n),paid:nominalPaid(T,n)};
  if(p.kind==='withdrawals'){const r=E.withdrawal(n,final);Object.assign(out,{r,left:r.last.balance,leftReal:r.last.balance/inflation(T+r.n,n)});}
  return out;}
 // Sammenligning: de tre øverste valgte per kalkulator.
 function compareRows(kind,list){
  if(kind==='dreams')return [['Plan','Mål ved kjøp, kr','År','Lavere risiko, kr per måned','Moderat risiko, kr per måned','Høyere risiko, kr per måned','Du sparer nå, kr per måned'],...list.map(p=>{const f=figures(p).plans;return [p.name,kr(f[0].goal),p.n.dreamYears,...f.map(x=>Math.ceil(x.required)),p.n.dreamMonthly];})];
  if(kind==='withdrawals')return [['Plan','Ved uttaksstart, kr','År med uttak','Første uttak, kr','Samlet tatt ut, kr','Igjen til slutt, kr','Igjen i dagens kroner, kr','Tomt i år'],...list.map(p=>{const f=figures(p);return [p.name,kr(f.final),f.r.n,kr(f.r.first.actual),kr(f.r.last.total),kr(f.left),kr(f.leftReal),f.r.exhausted||'Nei'];})];
  return [['Plan','År','Månedssparing, kr','Årlig vekst, prosent','Sluttbeløp, kr','I dagens kroner, kr','Egne innskudd, kr'],...list.map(p=>{const f=figures(p);return [p.name,p.n.years,p.n.monthly,p.n.rate,kr(f.final),kr(f.real),kr(f.paid)];})];
 }
 function groups(list){return KINDS.map(k=>({kind:k,all:list.filter(p=>p.ok&&p.kind===k)})).filter(g=>g.all.length);}
 const cell=x=>typeof x==='number'?esc(dec.format(x)):esc(x);
 function rowsHTML(rows){return `<thead><tr>${rows[0].map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map(r=>`<tr>${r.map(x=>`<td>${cell(x)}</td>`).join('')}</tr>`).join('')}</tbody>`;}
 // I rapporten står planene som kolonner (maks tre), så tabellen får plass på mobil.
 const transpose=rows=>rows[0].map((_,i)=>rows.map(r=>r[i]));
 const tbl=(rows,label)=>`<div class="report-table" role="region" aria-label="${esc(label)}" tabindex="0"><table>${rowsHTML(rows)}</table></div>`;
 function summary(p){const f=figures(p);
  if(p.kind==='dreams')return `<p>Mål ved kjøp: <b>${money(f.plans[0].goal)}</b> om ${dec.format(p.n.dreamYears)} år.${p.n.dreamReal?' Budsjettet er i dagens priser.':''}</p>`;
  let h=`<p>Etter ${dec.format(f.T)} år med sparing: <b>${money(f.final)}</b>, omtrent ${money(f.real)} i dagens kjøpekraft. Egne innskudd: ${money(f.paid)}.</p>`;
  if(p.kind==='withdrawals')h+=`<p>Første uttak: <b>${money(f.r.first.actual)}</b>. Samlet tatt ut: ${money(f.r.last.total)}. Igjen etter ${f.r.n} år: <b>${money(f.left)}</b>, omtrent ${money(f.leftReal)} i dagens kjøpekraft.${f.r.exhausted?' Pengene er brukt opp i år '+f.r.exhausted+'.':''}</p>`;
  return h;}
 function buildSelectedReport(){const list=chosen();if(!list.length)throw Error('Velg minst én plan.');
  let html=`<div class="report-heading"><p class="eyebrow">SPAREVERKSTED</p><h2>Valgte planer</h2><p>${list.map(p=>esc(p.name)).join(', ')}</p><p>Beregnet ${today()} · Regneeksempel før skatt</p></div>`;
  for(const g of groups(list))if(g.all.length>1){const top=g.all.slice(0,3);
   html+=`<section class="report-block report-page"><h3>${NAMES[g.kind]}: ${top.length===g.all.length?'planene':'de tre øverste'} sammenlignet</h3><p>${top.map(p=>esc(p.name)).join(', ')}${g.all.length>3?'. Rekkefølgen i lista avgjør hvilke tre som er med.':''}</p>${tbl(transpose(compareRows(g.kind,top)),NAMES[g.kind]+' sammenlignet')}<p class="report-footnote">Jevn avkastning er en forenkling. Ingen markedsavkastning er garantert. Alle beløp er før skatt.</p></section>`;}
  for(const p of list){html+=`<section class="report-block report-page"><p class="eyebrow">${NAMES[p.kind]}</p><h3>${esc(p.name)}</h3>`;
   if(!p.ok){html+='<p>Planen har tall som ikke kan beregnes. Åpne den og rett feltene.</p></section>';continue;}
   html+=summary(p)+tbl(settingsMatrix(p.n).filter(r=>!['Beregnet','Tall fra SSB','Merknad'].includes(r[0])),'Forutsetninger for '+p.name);
   if(p.kind==='dreams')html+=tbl(goalMatrix(p.n),'Alternativer for '+p.name);
   html+='</section>';}
  return html+`<div class="report-block report-page"><h3>Metode og begrensninger</h3><p>Effektiv årlig vekst etter kostnader = (1 + avkastning) × (1 − kostnad). Månedlige innskudd ved månedsslutt. Dagens kroner = beløpet / (1 + prisvekst)^år. Uttak skjer én gang ved slutten av hvert år, etter avkastning.</p><p>Jevn avkastning er en forenkling. Ingen markedsavkastning er garantert. Alle beløp er før skatt. Fremtidig skjerming, IPS, BSU og formuesskatt er ikke beregnet.</p><p class="report-footnote">${reportSources({savingsType:list.some(p=>p.n.savingsType==='index')?'index':''})}${esc(DATA_STATUS)}</p></div>`;}
 // Excel: oversikt, én sammenligning per kalkulator og én fane per plan.
 function sheetName(name,used){let base=String(name).replace(/[\[\]:*?\/\\]/g,' ').replace(/\s+/g,' ').trim().slice(0,28)||'Plan',n=base,k=2;while(used.has(n.toLowerCase()))n=base.slice(0,25)+' ('+(k++)+')';used.add(n.toLowerCase());return n;}
 function selectedSheets(){const list=chosen();if(!list.length)throw Error('Velg minst én plan.');const used=new Set(['oversikt']);
  const over=[['Plan','Kalkulator','Hovedresultat','Beløp, kr','I dagens kroner, kr'],...list.map(p=>{if(!p.ok)return [p.name,NAMES[p.kind],'Kan ikke beregnes','',''];const f=figures(p);
   return p.kind==='dreams'?[p.name,NAMES[p.kind],'Nødvendig sparing per måned, lavere risiko',Math.ceil(f.plans[0].required),'']:p.kind==='withdrawals'?[p.name,NAMES[p.kind],'Igjen etter '+f.r.n+' års uttak',kr(f.left),kr(f.leftReal)]:[p.name,NAMES[p.kind],'Etter '+dec.format(f.T)+' år',kr(f.final),kr(f.real)];})];
  const sheets=[{name:'Oversikt',rows:over}];
  for(const g of groups(list))if(g.all.length>1)sheets.push({name:sheetName(NAMES[g.kind]+' sammenlignet',used),rows:compareRows(g.kind,g.all.slice(0,3))});
  for(const p of list){if(!p.ok)continue;const rows=[...settingsMatrix(p.n)];for(const sh of planSheets(p.n))rows.push([],[sh.name],...sh.rows);sheets.push({name:sheetName(p.name,used),rows});}
  for(const sheet of sheets)if(sheet.rows.some(r=>r.some(x=>typeof x==='number'&&!Number.isFinite(x))))throw Error('En eksportert verdi overstiger tallområdet. Reduser perioden eller veksten i planen.');
  return sheets;}
 const show=(id,on)=>{const e=document.getElementById(id);if(e)e.hidden=!on;};
 const btn=document.getElementById('downloadSelected'),dlg=document.getElementById('selectedExportDialog');
 if(!btn||!dlg)return;
 btn.onclick=()=>{show('selectedExportError',false);document.getElementById('selectedExportCount').textContent=pickedPlans.size===1?'1 plan er valgt.':pickedPlans.size+' planer er valgt.';dlg.showModal();};
 document.getElementById('closeSelectedExport').onclick=()=>dlg.close();
 const guard=fn=>{try{show('selectedExportError',false);fn();}catch(e){const el=document.getElementById('selectedExportError');el.textContent=e.message;el.hidden=false;}};
 document.getElementById('selectedExportXlsx').onclick=()=>guard(()=>downloadData(ExportKit.workbook(selectedSheets()),'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','spareverksted-planer.xlsx'));
 document.getElementById('selectedExportPdf').onclick=()=>guard(()=>{const html=buildSelectedReport();dlg.close();$('reportPreview').innerHTML=html;$('printReportContent').innerHTML=html;$('reportDialog').showModal();});
 window.buildSelectedReport=buildSelectedReport;window.selectedSheets=selectedSheets;
})();
