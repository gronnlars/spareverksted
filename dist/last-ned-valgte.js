'use strict';
// «Last ned planene» (Lars 3.11.2026, nytt navn 4.11.2026): de planene som er krysset av i lista, samlet i én PDF eller én Excel-fil.
// Først én sammenligning per kalkulator (Sparing, Sparemål, Uttak) med de tre øverste valgte i lista, så én del per plan.
// Bygger på tabellene i journey.js og rapporten i experience.js. Ingen nye beregninger: alt hentes fra engine.js.
(function(){
 const KINDS=['calculator','dreams','withdrawals'];
 const NAMES={calculator:'Sparing',dreams:'Sparemål',withdrawals:'Uttak'};
 const today=()=>new Date().toLocaleDateString('nb-NO',{year:'numeric',month:'long',day:'numeric'});
 const esc=x=>escapeHTML(x);
 // Planene i lista-rekkefølge. Ugyldige planer tas med som navn, men uten tall.
 function picks(){return pickedPlans.size?[...pickedPlans]:saved.map((_,i)=>i);}
 function chosen(){return picks().sort((a,b)=>a-b).map(i=>{const item=saved[i],n={...E.defaults,...item.state};let ok=true;try{E.validate(n);if(n.activePage==='dreams')E.dreamPlans(n);}catch{ok=false;}return {name:item.name,n,kind:kindOfState(n),ok};});}
 function figures(p){const n=p.n;
  if(p.kind==='dreams'){const plans=E.dreamPlans(n);return {plans};}
  const T=endYear(n),final=E.value(n,T),out={T,final,real:final/inflation(T,n),paid:nominalPaid(T,n)};
  if(p.kind==='withdrawals'){const r=E.withdrawal(n,final);Object.assign(out,{r,left:r.last.balance,leftReal:r.last.balance/inflation(T+r.n,n)});}
  return out;}
 // Sammenligning: de tre øverste valgte per kalkulator.
 function compareRows(kind,list){
  if(kind==='dreams')return [['Plan','Mål ved kjøp, kr','År','Lavere risiko, kr per måned','Moderat risiko, kr per måned','Høyere risiko, kr per måned','Du sparer nå, kr per måned'],...list.map(p=>{const f=figures(p).plans;return [p.name,kr(f[0].goal),p.n.dreamYears,...f.map(x=>Math.ceil(x.required)),p.n.dreamMonthly];})];
  if(kind==='withdrawals')return [['Plan','Ved uttaksstart, kr','År med uttak','Første uttak, kr','Samlet tatt ut, kr','Igjen til slutt, kr','Igjen i dagens kroner, kr','Tomt i år'],...list.map(p=>{const f=figures(p);return [p.name,kr(f.final),f.r.n,kr(f.r.first.actual),kr(f.r.last.total),kr(f.left),kr(f.leftReal),emptyYear(p,f.r)||'Nei'];})];
  return [['Plan','År','Månedssparing, kr','Årlig vekst, prosent','Sluttbeløp, kr','I dagens kroner, kr','Egne innskudd, kr'],...list.map(p=>{const f=figures(p);return [p.name,p.n.years,p.n.monthly,p.n.rate,kr(f.final),kr(f.real),kr(f.paid)];})];
 }
 function groups(list){return KINDS.map(k=>({kind:k,all:list.filter(p=>p.ok&&p.kind===k)})).filter(g=>g.all.length);}
 const cell=x=>typeof x==='number'?esc(dec.format(x)):esc(x);
 function rowsHTML(rows){return `<thead><tr>${rows[0].map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map(r=>`<tr>${r.map(x=>`<td>${cell(x)}</td>`).join('')}</tr>`).join('')}</tbody>`;}
 // I rapporten står planene som kolonner (maks tre), så tabellen får plass på mobil.
 const transpose=rows=>rows[0].map((_,i)=>rows.map(r=>r[i]));
 const tbl=(rows,label)=>`<div class="report-table" role="region" aria-label="${esc(label)}" tabindex="0"><table>${rowsHTML(rows)}</table></div>`;
 // Grafer i sammenligningen (Lars 3.11.2026). Planene skilles med både farge og strektype, ikke bare farge.
 // Tabellen under hver graf er tekstalternativet med de samme tallene.
 const DASH=['','8 5','2 4'];
 const axis=axisCompact;
 function ticks(max){const step=[1,2,2.5,5,10].map(m=>m*Math.pow(10,Math.floor(Math.log10(Math.max(max,1)/4)))).find(s=>max/s<=5)||max/4;const out=[0];while(out.at(-1)<max-1e-9)out.push(out.at(-1)+step);return out;}
 function lineChart(series,xLabel,label){const W=420,H=260,L=62,R=12,T=12,B=42,xs=series.flatMap(s=>s.pts.map(p=>p[0])),ys=series.flatMap(s=>s.pts.map(p=>p[1]));
  const xMax=Math.max(1,...xs),yt=ticks(Math.max(1,...ys)),yMax=yt.at(-1)||1,X=x=>L+(W-L-R)*x/xMax,Y=y=>T+(H-T-B)*(1-y/yMax);
  const xt=ticks(xMax).filter(v=>Number.isInteger(v)||xMax<4);
  let g=yt.map(v=>`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" class="rc-grid"/><text x="${L-8}" y="${Y(v)+4}" text-anchor="end">${esc(axis(v))}</text>`).join('')+xt.map(v=>`<text x="${X(v)}" y="${H-B+18}" text-anchor="middle">${esc(dec.format(v))}</text>`).join('');
  g+=series.map((s,k)=>`<polyline class="cmpl-${k+1}" fill="none" stroke-width="2.5"${DASH[k]?` stroke-dasharray="${DASH[k]}"`:''} points="${s.pts.map(p=>X(p[0]).toFixed(1)+','+Y(p[1]).toFixed(1)).join(' ')}"/>`).join('');
  return `<figure class="report-cmp-chart" role="group"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">${g}<text x="${(L+W-R)/2}" y="${H-6}" text-anchor="middle">${esc(xLabel)}</text></svg>${legend(series.map(s=>s.name))}</figure>`;}
 function legend(names){return `<ul class="report-cmp-legend">${names.map((n,k)=>`<li><svg viewBox="0 0 34 10" aria-hidden="true"><line x1="0" x2="34" y1="5" y2="5" class="cmpl-${k+1}" stroke-width="3"${DASH[k]?` stroke-dasharray="${DASH[k]}"`:''}/></svg>${esc(n)}</li>`).join('')}</ul>`;}
 function barChart(list,label){const W=420,H=260,L=62,R=12,T=12,B=52,vals=list.map(p=>figures(p).plans.map(x=>Math.ceil(x.required))),yt=ticks(Math.max(1,...vals.flat())),yMax=yt.at(-1)||1,Y=y=>T+(H-T-B)*(1-y/yMax),gw=(W-L-R)/list.length,bw=Math.min(28,gw/4);
  let g=yt.map(v=>`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" class="rc-grid"/><text x="${L-8}" y="${Y(v)+4}" text-anchor="end">${esc(axis(v))}</text>`).join('');
  list.forEach((p,i)=>{const x0=L+gw*i+(gw-bw*3-8)/2;vals[i].forEach((v,j)=>{g+=`<rect class="cmp-${j+1}" x="${x0+j*(bw+4)}" y="${Y(v)}" width="${bw}" height="${Y(0)-Y(v)}"/>`;});g+=`<text x="${L+gw*i+gw/2}" y="${H-B+20}" text-anchor="middle">${esc(p.name.length>22?p.name.slice(0,21)+'…':p.name)}</text>`;});
  return `<figure class="report-cmp-chart" role="group"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">${g}<text x="${(L+W-R)/2}" y="${H-6}" text-anchor="middle">Nødvendig sparing per måned, kr</text></svg><ul class="report-cmp-legend">${['Lavere risiko','Moderat risiko','Høyere risiko'].map((n,j)=>`<li><svg class="sq" viewBox="0 0 12 12" aria-hidden="true"><rect width="12" height="12" class="cmp-${j+1}"/></svg>${n}</li>`).join('')}</ul></figure>`;}
 // Søyler som i sammenligningen på skjermen: én gruppe per tidspunkt, én søyle per plan (Lars 3.11.2026).
 // En plan får søyle bare for år innenfor sin egen periode. Linjegrafen under viser hele forløpet.
 function groupBars(at,ends,list,valueAt,xTitle,label){const maxT=Math.max(...ends),step=cmpStep(maxT,6),xs=[];for(let t=step;t<maxT-1e-9;t+=step)xs.push(t);xs.push(maxT);
  const vals=list.map((p,k)=>xs.map(t=>t<=ends[k]+1e-9?valueAt(p,t):null)),yt=ticks(Math.max(1,...vals.flat().filter(v=>v!==null))),yMax=yt.at(-1)||1;
  const W=420,H=260,L=62,R=12,T=12,B=42,Y=y=>T+(H-T-B)*(1-y/yMax),gw=(W-L-R)/xs.length,bw=Math.min(22,(gw-6)/list.length);
  let g=yt.map(v=>`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" class="rc-grid"/><text x="${L-8}" y="${Y(v)+4}" text-anchor="end">${esc(axis(v))}</text>`).join('');
  xs.forEach((t,i)=>{const x0=L+gw*i+(gw-bw*list.length)/2;vals.forEach((row,k)=>{const v=row[i];if(v!==null)g+=`<rect class="cmp-${k+1}" x="${(x0+k*bw).toFixed(1)}" y="${Y(v).toFixed(1)}" width="${(bw-2).toFixed(1)}" height="${(Y(0)-Y(v)).toFixed(1)}"/>`;});g+=`<text x="${L+gw*i+gw/2}" y="${H-B+18}" text-anchor="middle">${esc(dec.format(Math.round(t*10)/10))}</text>`;});
  return `<figure class="report-cmp-chart" role="group"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">${g}<text x="${(L+W-R)/2}" y="${H-6}" text-anchor="middle">${esc(xTitle)}</text></svg><ul class="report-cmp-legend">${list.map((p,k)=>`<li><svg class="sq" viewBox="0 0 12 12" aria-hidden="true"><rect width="12" height="12" class="cmp-${k+1}"/></svg>${esc(p.name)}</li>`).join('')}</ul></figure>`;}
 function compareChart(kind,list){
  if(kind==='dreams')return barChart(list,'Nødvendig sparing per måned for '+list.map(p=>p.name).join(', '));
  const names=list.map(p=>p.name).join(', ');
  if(kind==='withdrawals')return groupBars(0,list.map(p=>figures(p).r.n),list,(p,t)=>{const r=figures(p).r;return r.points.find(x=>x.year===Math.round(t))?.balance??r.last.balance;},'År med uttak','Søyler: saldo under uttaket for '+names+'.')+lineChart(list.map(p=>{const r=figures(p).r;return {name:p.name,pts:[[0,figures(p).final],...r.points.filter(x=>x.year>0).map(x=>[x.year,x.balance])]};}),'År med uttak','Saldo under uttaket for '+list.map(p=>p.name).join(', ')+'. Tallene står i tabellen under.');
  return groupBars(0,list.map(p=>endYear(p.n)),list,(p,t)=>E.value(p.n,t),'År med sparing','Søyler: saldo før skatt for '+names+'. Tallene står i tabellen under.')+lineChart(list.map(p=>({name:p.name,pts:[0,...Array.from({length:Math.floor(endYear(p.n))},(_,i)=>i+1),endYear(p.n)].filter((v,i,a)=>a.indexOf(v)===i).map(t=>[t,E.value(p.n,t)])})),'År med sparing','Saldo før skatt over tid for '+list.map(p=>p.name).join(', ')+'. Tallene står i tabellen under.');}
 // Samme regel som på skjermen: et år utenfor uttaksperioden vises bare når man spør hvor lenge pengene varer.
 const emptyYear=(p,r)=>Number.isFinite(r.exhausted)&&(r.exhausted<=r.n||p.n.withdrawMode==='duration')?r.exhausted:0;
 function summary(p){const f=figures(p);
  if(p.kind==='dreams')return `<p>Mål ved kjøp: <b>${money(f.plans[0].goal)}</b> om ${dec.format(p.n.dreamYears)} år.${p.n.dreamReal?' Budsjettet er i dagens priser.':''}</p>`;
  let h=`<p>Etter ${periodText(f.T)} med sparing: <b>${money(f.final)}</b>, omtrent ${money(f.real)} i dagens kjøpekraft. Egne innskudd: ${money(f.paid)}.</p>`;
  if(p.kind==='withdrawals')h+=`<p>Første uttak: <b>${money(f.r.first.actual)}</b>. Samlet tatt ut: ${money(f.r.last.total)}. Igjen etter ${f.r.n} år: <b>${money(f.left)}</b>, omtrent ${money(f.leftReal)} i dagens kjøpekraft.${emptyYear(p,f.r)?' Pengene er brukt opp ved uttaket i år '+emptyYear(p,f.r)+'.':''}</p>`;
  return h;}
 function buildSelectedReport(){const list=chosen();if(!list.length)throw Error('Velg minst én plan.');
  let html=`<div class="report-heading"><p class="eyebrow">SPAREVERKSTED</p><h2>Lagrede planer</h2><p>${list.map(p=>esc(p.name)).join(', ')}</p><p>Beregnet ${today()} · Regneeksempel før skatt</p></div>`;
  // Første del står på samme side som overskriften. Resten starter på ny side ved utskrift.
  let first=0;
  for(const g of groups(list))if(g.all.length>1){const top=g.all.slice(0,3);
   html+=`<section class="report-block${first++?' report-page':''}"><h3>${NAMES[g.kind]}: ${top.length===g.all.length?'planene':'de tre øverste'} sammenlignet</h3><p>${top.map(p=>esc(p.name)).join(', ')}${g.all.length>3?'. Med flere enn tre valgte er de tre øverste i lista med. Alle valgte planer står hver for seg lenger ned.':''}</p>${compareChart(g.kind,top)}${tbl(transpose(compareRows(g.kind,top)),NAMES[g.kind]+' sammenlignet')}<p class="report-footnote">Jevn avkastning er en forenkling. Ingen markedsavkastning er garantert. Alle beløp er før skatt.</p></section>`;}
  for(const p of list){html+=`<section class="report-block${first++?' report-page':''}"><p class="eyebrow">${NAMES[p.kind]}</p><h3>${esc(p.name)}</h3>`;
   if(!p.ok){html+='<p>Planen har tall som ikke kan beregnes. Åpne den og rett feltene.</p></section>';continue;}
   html+=summary(p)+tbl(settingsMatrix(p.n).filter(r=>!['Beregnet','Tall fra SSB','Merknad'].includes(r[0])),'Forutsetninger for '+p.name);
   if(p.kind==='dreams')html+=tbl(goalMatrix(p.n),'Alternativer for '+p.name);
   html+='</section>';}
  return html+`<div class="report-block report-page"><h3>Metode og begrensninger</h3><p>Effektiv årlig vekst etter kostnader = (1 + avkastning) × (1 − kostnad). Månedlige innskudd ved månedsslutt. Dagens kroner = beløpet / (1 + prisvekst)^år. Uttak skjer én gang ved slutten av hvert år, etter avkastning.</p><p>Jevn avkastning er en forenkling. Ingen markedsavkastning er garantert. Alle beløp er før skatt. Fremtidig skjerming, IPS, BSU og formuesskatt er ikke beregnet.</p><p class="report-footnote">${reportSources({savingsType:list.some(p=>p.n.savingsType==='index')?'index':''})}${esc(DATA_STATUS)}</p></div>`;}
 // Excel: oversikt, én sammenligning per kalkulator og én fane per plan.
 function sheetName(name,used){let base=String(name).replace(/[\[\]:*?\/\\]/g,' ').replace(/\s+/g,' ').trim().slice(0,28)||'Plan',n=base,k=2;while(used.has(n.toLowerCase()))n=base.slice(0,25)+' ('+(k++)+')';used.add(n.toLowerCase());return n;}
 function selectedSheets(){const list=chosen();if(!list.length)throw Error('Velg minst én plan.');const used=new Set(['oversikt']);
  const over=[['Plan','Kalkulator','Hovedresultat','Beløp, kr','I dagens kroner, kr'],...list.map(p=>{if(!p.ok)return [p.name,NAMES[p.kind],'Kan ikke beregnes','',''];const f=figures(p);
   return p.kind==='dreams'?[p.name,NAMES[p.kind],'Nødvendig sparing per måned, lavere risiko',Math.ceil(f.plans[0].required),'']:p.kind==='withdrawals'?[p.name,NAMES[p.kind],'Igjen etter '+f.r.n+' års uttak',kr(f.left),kr(f.leftReal)]:[p.name,NAMES[p.kind],'Etter '+periodText(f.T),kr(f.final),kr(f.real)];})];
  const sheets=[{name:'Oversikt',rows:over}];
  for(const g of groups(list))if(g.all.length>1)sheets.push({name:sheetName(NAMES[g.kind]+' sammenlignet',used),rows:compareRows(g.kind,g.all.slice(0,3))});
  for(const p of list){if(!p.ok)continue;const rows=[...settingsMatrix(p.n)];for(const sh of planSheets(p.n))rows.push([],[sh.name],...sh.rows);sheets.push({name:sheetName(p.name,used),rows});}
  for(const sheet of sheets)if(sheet.rows.some(r=>r.some(x=>typeof x==='number'&&!Number.isFinite(x))))throw Error('En eksportert verdi overstiger tallområdet. Reduser perioden eller veksten i planen.');
  return sheets;}
 const show=(id,on)=>{const e=document.getElementById(id);if(e)e.hidden=!on;};
 const btn=document.getElementById('downloadSelected'),dlg=document.getElementById('selectedExportDialog');
 if(!btn||!dlg)return;
 // Knappen står under lista. Uten avkrysning gjelder den alle planene (Lars 3.11.2026).
// «Last ned planene» med antall når noen er valgt, «Last ned planen» når bare én er med (Lars 4.11.2026, korte ord).
 const syncButton=()=>{const n=pickedPlans.size,count=n||saved.length;btn.textContent=(count===1?'Last ned planen':'Last ned planene')+(n?' ('+n+')':'');document.getElementById('selectedDownloadRow').hidden=!saved.length;};
 const sync=window.syncPickTools;window.syncPickTools=syncPickTools=function(){sync.apply(this,arguments);syncButton();};syncButton();
 btn.onclick=()=>{show('selectedExportError',false);const n=picks().length;document.getElementById('selectedExportCount').textContent=(pickedPlans.size?(n===1?'1 plan er valgt.':n+' planer er valgt.'):'Alle de '+n+' lagrede planene er med.');dlg.showModal();};
 document.getElementById('closeSelectedExport').onclick=()=>dlg.close();
 const guard=fn=>{try{show('selectedExportError',false);fn();}catch(e){const el=document.getElementById('selectedExportError');el.textContent=e.message;el.hidden=false;}};
 document.getElementById('selectedExportXlsx').onclick=()=>guard(()=>downloadData(ExportKit.workbook(selectedSheets()),'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','spareverksted-planer.xlsx'));
 document.getElementById('selectedExportPdf').onclick=()=>guard(()=>{const html=buildSelectedReport();dlg.close();$('reportPreview').innerHTML=html;$('printReportContent').innerHTML=window.forPrint?window.forPrint(html):html;$('reportDialog').showModal();});
 window.buildSelectedReport=buildSelectedReport;window.selectedSheets=selectedSheets;
})();
