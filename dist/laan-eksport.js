// Samme filformater og eksportverktøy som sparekalkulatoren. Alle tall kommer fra lånemotorens betalingsplan.
(function(root){
'use strict';
const L=typeof module!=='undefined'?require('./laan-motor.js'):root.LaanMotor;
const T=typeof module!=='undefined'?require('./laan-tekst.js'):root.LaanTekst;
const V=typeof module!=='undefined'?require('./laan-visning.js'):root.LaanVisning;
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const readable=(k,v)=>typeof v!=='number'?String(v):k.includes('(kr')?T.money(v):k.includes('(%)')?T.pct(v):new Intl.NumberFormat('nb-NO').format(v);
const kinds={bolig:'Boliglån',bil:'Billån',forbruk:'Forbrukslån'};
function assumptions(p){
 const s=p.input;
 return [['Lånetype',kinds[s.kind]],['Nedbetaling',s.type==='serie'?'Serielån':'Annuitetslån'],['Lånebeløp (kr)',s.amount],['Nominell årsrente (%)',s.rate],['Opprinnelig antall måneder',p.plannedTerms],['Beregnet antall måneder',p.payoffTerm],['Etableringsgebyr (kr)',s.establishmentFee],['Termingebyr (kr per måned)',s.termFee],
 ['Kronevisning',s.real?'Dagens kroner ved utbetaling':'Løpende kroner'],['Prisvekst per år (%)',s.inflation??V.defaults.inflation],['Endring i scenarioene (prosentpoeng)',s.scenarioShift??V.defaults.scenarioShift],
 ...(s.propertyValue?[['Boligverdi (kr)',s.propertyValue],['Dette lånet som andel av boligverdi (%)',s.amount/s.propertyValue*100]]:[]),
 ...(s.kind==='bil'?[['Kjøpesum for bilen (kr)',s.vehiclePrice],['Egenkapital til bilkjøpet (kr)',s.equity]]:[]),
 ['Rentescenarioer','Samme beløp, type, tid og gebyrer, uten renteendring eller ekstra innbetaling. Rentene begrenses til 0 til 100 %. Regneeksempler, ingen prognoser.'],
 ['Dagens kroner','Hvert beløp ved termin m deles på (1 + prisvekst/100)^(m/12). Etableringsgebyret ligger på tidspunkt null. Ingen forutsetning om inntektsvekst.'],
 ...s.rateChanges.map(e=>['Ny nominell rente fra termin '+e.term+' (%)',e.rate]),...s.extraPayments.map(e=>['Ønsket ekstra innbetaling etter termin '+e.term+' (kr)',e.amount]),
 ['Betalingstidspunkt','Månedsslutt. Første termin én måned etter utbetaling.'],['Månedsrente','Nominell årsrente delt på 12.'],['Etableringsgebyr','Betales ved utbetaling. Regnes ikke inn i gjelden.'],['Renteendring','Ny rente gjelder hele terminen. Annuitetsbeløpet beregnes på nytt over gjenværende løpetid.'],['Ekstra innbetaling','Betales etter vanlig termin. Gjeldende terminbeløp eller avdrag beholdes og løpetiden forkortes.'],['Skatt og effektiv rente','Før rentefradrag. Effektiv rente er ikke beregnet.'],['Avrunding','Ingen avrunding i motoren. Hele kroner i tabell og rapport.'],['Modell','https://github.com/gronnlars/spareverksted/blob/main/docs/laanemodell.md']];
}
function yearly(p){return [['År','Renter (kr)','Avdrag inkl. ekstra (kr)','Gebyrer (kr)','Betalt (kr)','Restgjeld (kr)'],...L.byYear(V.present(p)).map(y=>[y.year,y.interest,y.principal,y.fees,y.paid,y.balance])];}
function monthly(p){const d=V.present(p);return [['Termin','Nominell årsrente (%)','Renter (kr)','Vanlig avdrag (kr)','Ekstra innbetaling (kr)','Gebyr (kr)','Betalt (kr)','Restgjeld (kr)'],[0,p.input.rate,0,0,0,p.input.establishmentFee,p.input.establishmentFee,p.input.amount],...d.rows.map(r=>[r.term,r.rate,r.interest,r.principal,r.extra,r.fee,r.total,r.balance])];}
function sheets(p){
 const s=p.input,d=V.present(p),t=d.totals;
 const common={...s,extraPayments:[],rateChanges:[]},a=V.present(L.plan({...common,type:'annuitet'})),b=V.present(L.plan({...common,type:'serie'}));
 return [{name:'Oversikt',rows:[['Låneberegning','Verdi'],[s.real?'Avdrag i dagens kroner (kr)':'Du låner (kr)',s.real?t.principal:t.amount],['Kronevisning',s.real?'Dagens kroner':'Løpende kroner'],['Renter (kr)',t.interest],['Gebyrer (kr)',t.fees],['Du betaler tilbake (kr)',t.paid],['Første termin uten gebyr (kr)',d.firstPayment],['Siste termin uten gebyr (kr)',d.lastPayment],['Nedbetalt etter (måneder)',p.payoffTerm]]},
 {name:'Forutsetninger',rows:[['Forutsetning','Verdi'],...assumptions(p)]},{name:'Per år',rows:yearly(p)},{name:'Per måned',rows:monthly(p)},
 {name:'Rentescenarioer',rows:[['Scenario','Nominell rente (%)','Endring (prosentpoeng)','Første måned inkl. termingebyr (kr)','Siste måned inkl. termingebyr (kr)','Renter og gebyrer (kr)','Samlet tilbakebetaling (kr)'],...V.scenarios(p).map(v=>[v.name,v.rate,v.delta,v.first,v.last,v.cost,v.paid])]},
 {name:'Annuitet og serie',rows:[['Samme lån uten renteendring eller ekstra innbetaling','Annuitet','Serie'],['Første termin uten gebyr (kr)',a.firstPayment,b.firstPayment],['Samlet rente (kr)',a.totals.interest,b.totals.interest],['Gebyrer (kr)',a.totals.fees,b.totals.fees],['Tilbakebetalt (kr)',a.totals.paid,b.totals.paid]]}];
}
function table(rows,caption){return '<table role="table"><caption>'+esc(caption)+'</caption><thead><tr>'+rows[0].map(x=>'<th scope="col">'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+rows.slice(1).map(row=>'<tr>'+row.map((x,i)=>(i?'<td data-label="'+esc(rows[0][i])+'">':'<th scope="row" data-label="'+esc(rows[0][0])+'">')+esc(typeof x==='number'?(i?rows[0][i].includes('(%)')?T.pct(x):T.money(x):x):x)+(i?'</td>':'</th>')).join('')+'</tr>').join('')+'</tbody></table>';}
function chart(p,prefix){
 const summary=V.chartSummary(p);p=V.present(p);
 const x=t=>52+ t/p.payoffTerm*552,y=b=>22+(1-b/p.input.amount)*174;
 const d=[{term:0,balance:p.input.amount},...p.rows].map((r,i)=>(i?'L':'M')+x(r.term).toFixed(2)+','+y(r.balance).toFixed(2)).join(' ');

 return '<svg viewBox="0 0 640 238" role="img" aria-labelledby="'+prefix+'Title '+prefix+'Desc"><title id="'+prefix+'Title">Restgjeld over tid</title><desc id="'+prefix+'Desc">'+esc(summary)+'</desc><path d="M52 22V196H604" fill="none" stroke="#526657"/><path d="'+d+'" fill="none" stroke="#28664d" stroke-width="3"/><g fill="#173f36" font-size="12"><text x="52" y="15">'+esc(T.money(p.input.amount))+'</text><text x="52" y="218">Start</text><text x="604" y="218" text-anchor="end">'+esc(T.period(p.payoffTerm))+'</text><text x="604" y="188" text-anchor="end">0 kr</text></g></svg><p>'+esc(summary)+'</p>';
}
function report(p,prefix='loanReport'){
 const base=p.input.extraPayments.length?L.plan({...p.input,extraPayments:[]}):null,r=V.result(p,base),t=V.present(p).totals,unit=p.input.real?'dagens kroner':'løpende kroner';
 return '<div class="report-heading"><h1>Låneberegning</h1><p>Spareverksted · '+esc(kinds[p.input.kind])+' · Før rentefradrag · '+unit+'</p></div><section class="report-result" aria-label="Resultat"><h2>'+esc(r.eyebrow)+'</h2><strong>'+esc(r.amount)+'</strong><p>'+esc(r.text)+'</p><p>'+esc(r.meaning)+'</p>'+(r.extra?'<p>'+esc(r.extra)+'</p>':'')+'</section>'+
 '<section class="report-block"><h2>Hva lånet koster</h2><dl class="report-assumptions">'+[[p.input.real?'Avdrag i dagens kroner':'Du låner',p.input.real?t.principal:t.amount],['Renter',t.interest],['Gebyrer',t.fees],['Du betaler tilbake',t.paid]].map(([k,v])=>'<div><dt>'+esc(k)+'</dt><dd>'+esc(T.money(v))+'</dd></div>').join('')+'</dl>'+V.costChart(p,prefix+'Cost')+'</section>'+
 '<section class="report-block report-chart"><h2>Slik går gjelden ned</h2>'+chart(p,prefix)+'</section><section class="report-block"><h2>Nedbetaling per år</h2><div class="report-table">'+table(yearly(p),'Målt i '+unit+'. Hele kroner. Ekstra innbetaling er med i avdragene. Etableringsgebyret står i år 1.')+'</div></section>'+
 scenarioReport(p)+
 '<section class="report-block"><h2>Forutsetninger og metode</h2><dl class="report-assumptions">'+assumptions(p).map(([k,v])=>'<div><dt>'+esc(k)+'</dt><dd>'+esc(readable(k,v))+'</dd></div>').join('')+'</dl>'+(r.notes.length?'<ul>'+r.notes.map(n=>'<li>'+esc(n)+'</li>').join('')+'</ul>':'')+'<p>Regneeksempel med oppgitte forutsetninger. Banken kan regne annerledes, blant annet med avrunding og dager i måneden. Beregningen vurderer ikke hvor mye du kan låne.</p></section>';
}
function scenarioReport(p){return '<section class="report-block"><h2>Hva betyr en annen rente?</h2><p>Regneeksempler med samme beløp, type, løpetid og gebyrer. Uten planlagt renteendring eller ekstra innbetaling. Ingen prognoser. Beløp i '+(p.input.real?'dagens kroner':'løpende kroner')+'.</p>'+V.scenarios(p).map(v=>'<h3>'+v.name+' · '+T.pct(v.rate)+'</h3><dl class="report-assumptions">'+[['Endring fra grunnscenario (prosentpoeng)',v.delta],['Første måned inkl. termingebyr (kr)',v.first],['Siste måned inkl. termingebyr (kr)',v.last],['Renter og gebyrer (kr)',v.cost],['Samlet tilbakebetaling (kr)',v.paid]].map(([k,x])=>'<div><dt>'+esc(k)+'</dt><dd>'+esc(readable(k,x))+'</dd></div>').join('')+'</dl>').join('')+'</section>';}
// CSV er én rektangulær tabell. Alle forutsetninger gjentas som egne kolonner ved hver betaling.
function csvRows(p){const rows=monthly(p),meta=assumptions(p);return [[...rows[0],...meta.map(x=>x[0])],...rows.slice(1).map(r=>[...r,...meta.map(x=>x[1])])];}
const api={csvRows,assumptions,yearly,monthly,sheets,table,report};
if(typeof module!=='undefined')module.exports=api;else root.LaanEksport=api;
})(typeof window!=='undefined'?window:globalThis);
