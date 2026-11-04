// Samme filformater og eksportverktøy som sparekalkulatoren. Alle tall kommer fra lånemotorens betalingsplan.
(function(root){
'use strict';
const L=typeof module!=='undefined'?require('./laan-motor.js'):root.LaanMotor;
const T=typeof module!=='undefined'?require('./laan-tekst.js'):root.LaanTekst;
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const readable=(k,v)=>typeof v!=='number'?String(v):k.includes('(kr')?T.money(v):k.includes('(%)')?T.pct(v):new Intl.NumberFormat('nb-NO').format(v);
const kinds={bolig:'Boliglån',bil:'Billån',forbruk:'Forbrukslån'};
function assumptions(p){
 const s=p.input;
 return [['Lånetype',kinds[s.kind]],['Nedbetaling',s.type==='serie'?'Serielån':'Annuitetslån'],['Lånebeløp (kr)',s.amount],['Nominell årsrente (%)',s.rate],['Opprinnelig antall måneder',p.plannedTerms],['Beregnet antall måneder',p.payoffTerm],['Etableringsgebyr (kr)',s.establishmentFee],['Termingebyr (kr per måned)',s.termFee],
 ...s.rateChanges.map(e=>['Ny nominell rente fra termin '+e.term+' (%)',e.rate]),...s.extraPayments.map(e=>['Ønsket ekstra innbetaling etter termin '+e.term+' (kr)',e.amount]),
 ['Betalingstidspunkt','Månedsslutt. Første termin én måned etter utbetaling.'],['Månedsrente','Nominell årsrente delt på 12.'],['Etableringsgebyr','Betales ved utbetaling. Regnes ikke inn i gjelden.'],['Renteendring','Ny rente gjelder hele terminen. Annuitetsbeløpet beregnes på nytt over gjenværende løpetid.'],['Ekstra innbetaling','Betales etter vanlig termin. Gjeldende terminbeløp eller avdrag beholdes og løpetiden forkortes.'],['Skatt og effektiv rente','Før rentefradrag. Effektiv rente er ikke beregnet.'],['Avrunding','Ingen avrunding i motoren. Hele kroner i tabell og rapport.'],['Modell','https://github.com/gronnlars/spareverksted/blob/main/docs/laanemodell.md']];
}
function yearly(p){return [['År','Renter (kr)','Avdrag inkl. ekstra (kr)','Gebyrer (kr)','Betalt (kr)','Restgjeld (kr)'],...L.byYear(p).map(y=>[y.year,y.interest,y.principal,y.fees,y.paid,y.balance])];}
function monthly(p){return [['Termin','Nominell årsrente (%)','Renter (kr)','Vanlig avdrag (kr)','Ekstra innbetaling (kr)','Gebyr (kr)','Betalt (kr)','Restgjeld (kr)'],[0,p.input.rate,0,0,0,p.input.establishmentFee,p.input.establishmentFee,p.input.amount],...p.rows.map(r=>[r.term,r.rate,r.interest,r.principal,r.extra,r.fee,r.total,r.balance])];}
function sheets(p){
 const s=p.input,t=p.totals;
 const common={...s,extraPayments:[],rateChanges:[]},a=L.plan({...common,type:'annuitet'}),b=L.plan({...common,type:'serie'});
 return [{name:'Oversikt',rows:[['Låneberegning','Verdi'],['Du låner (kr)',t.amount],['Renter (kr)',t.interest],['Gebyrer (kr)',t.fees],['Du betaler tilbake (kr)',t.paid],['Første termin uten gebyr (kr)',p.firstPayment],['Siste termin uten gebyr (kr)',p.lastPayment],['Nedbetalt etter (måneder)',p.payoffTerm]]},
 {name:'Forutsetninger',rows:[['Forutsetning','Verdi'],...assumptions(p)]},{name:'Per år',rows:yearly(p)},{name:'Per måned',rows:monthly(p)},
 {name:'Annuitet og serie',rows:[['Samme lån uten renteendring eller ekstra innbetaling','Annuitet','Serie'],['Første termin uten gebyr (kr)',a.firstPayment,b.firstPayment],['Samlet rente (kr)',a.totals.interest,b.totals.interest],['Gebyrer (kr)',a.totals.fees,b.totals.fees],['Tilbakebetalt (kr)',a.totals.paid,b.totals.paid]]}];
}
function table(rows,caption){return '<table><caption>'+esc(caption)+'</caption><thead><tr>'+rows[0].map(x=>'<th scope="col">'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+rows.slice(1).map(row=>'<tr>'+row.map((x,i)=>(i?'<td data-label="'+esc(rows[0][i])+'">':'<th scope="row">')+esc(typeof x==='number'?(i?T.money(x):x):x)+(i?'</td>':'</th>')).join('')+'</tr>').join('')+'</tbody></table>';}
function chart(p,prefix){
 const x=t=>52+ t/p.payoffTerm*552,y=b=>22+(1-b/p.input.amount)*174;
 const d=[{term:0,balance:p.input.amount},...p.rows].map((r,i)=>(i?'L':'M')+x(r.term).toFixed(2)+','+y(r.balance).toFixed(2)).join(' ');
 const summary=T.chart([{t:0,v:p.input.amount},...p.rows.map(r=>({t:r.term/12,v:r.balance}))],p);
 return '<svg viewBox="0 0 640 238" role="img" aria-labelledby="'+prefix+'Title '+prefix+'Desc"><title id="'+prefix+'Title">Restgjeld over tid</title><desc id="'+prefix+'Desc">'+esc(summary)+'</desc><path d="M52 22V196H604" fill="none" stroke="#526657"/><path d="'+d+'" fill="none" stroke="#28664d" stroke-width="3"/><g fill="#173f36" font-size="12"><text x="52" y="15">'+esc(T.money(p.input.amount))+'</text><text x="52" y="218">Start</text><text x="604" y="218" text-anchor="end">'+esc(T.period(p.payoffTerm))+'</text><text x="604" y="188" text-anchor="end">0 kr</text></g></svg><p>'+esc(summary)+'</p>';
}
function report(p,prefix='loanReport'){
 const base=p.input.extraPayments.length?L.plan({...p.input,extraPayments:[]}):null,r=T.result(p,base),t=p.totals;
 return '<div class="report-heading"><h1>Låneberegning</h1><p>Spareverksted · '+esc(kinds[p.input.kind])+' · Før rentefradrag</p></div><section class="report-result" aria-label="Resultat"><h2>'+esc(r.eyebrow)+'</h2><strong>'+esc(r.amount)+'</strong><p>'+esc(r.text)+'</p><p>'+esc(r.meaning)+'</p>'+(r.extra?'<p>'+esc(r.extra)+'</p>':'')+'</section>'+
 '<section class="report-block"><h2>Hva lånet koster</h2><dl class="report-assumptions">'+[['Du låner',t.amount],['Renter',t.interest],['Gebyrer',t.fees],['Du betaler tilbake',t.paid]].map(([k,v])=>'<div><dt>'+esc(k)+'</dt><dd>'+esc(T.money(v))+'</dd></div>').join('')+'</dl></section>'+
 '<section class="report-block report-chart"><h2>Slik går gjelden ned</h2>'+chart(p,prefix)+'</section><section class="report-block"><h2>Nedbetaling per år</h2><div class="report-table">'+table(yearly(p),'Hele kroner. Ekstra innbetaling er med i avdragene. Etableringsgebyret står i år 1.')+'</div></section>'+
 '<section class="report-block"><h2>Forutsetninger og metode</h2><dl class="report-assumptions">'+assumptions(p).map(([k,v])=>'<div><dt>'+esc(k)+'</dt><dd>'+esc(readable(k,v))+'</dd></div>').join('')+'</dl>'+(r.notes.length?'<ul>'+r.notes.map(n=>'<li>'+esc(n)+'</li>').join('')+'</ul>':'')+'<p>Regneeksempel med oppgitte forutsetninger. Banken kan regne annerledes, blant annet med avrunding og dager i måneden. Beregningen vurderer ikke hvor mye du kan låne.</p></section>';
}
const api={assumptions,yearly,monthly,sheets,table,report};
if(typeof module!=='undefined')module.exports=api;else root.LaanEksport=api;
})(typeof window!=='undefined'?window:globalThis);
