// Visningsregning for lån. Motorens nominelle betalingsplan endres aldri.
(function(root){
'use strict';
const L=typeof module!=='undefined'?require('./laan-motor.js'):root.LaanMotor;
const T=typeof module!=='undefined'?require('./laan-tekst.js'):root.LaanTekst;
// Samme modellforutsetning og grenser som Engine.defaults.inflation / Engine.FIELDS.inflation.
const defaults={inflation:2.5,real:false,scenarioShift:1};
const factor=(inflation,term)=>Math.exp(Math.log1p(inflation/100)*term/12);
function present(p){
 if(!p.input.real)return p;
 const inflation=p.input.inflation??defaults.inflation;
 const rows=p.rows.map(r=>{const f=factor(inflation,r.term),out={...r};for(const k of ['interest','principal','fee','extra','payment','total','balance'])out[k]/=f;return out;});
 const totals={amount:p.input.amount,principal:0,interest:0,fees:p.input.establishmentFee,establishmentFee:p.input.establishmentFee,termFees:0,extra:0,paid:p.input.establishmentFee};
 for(const r of rows){totals.principal+=r.principal+r.extra;totals.interest+=r.interest;totals.termFees+=r.fee;totals.fees+=r.fee;totals.extra+=r.extra;totals.paid+=r.total;}
 return {...p,rows,totals,firstPayment:rows[0].payment,lastPayment:rows.at(-1).payment};
}
function result(p,base){
 const r=T.result(p,base);if(!p.input.real)return r;
 const d=present(p);
 return {...r,eyebrow:'Første måned · dagens kroner',amount:T.money(d.firstPayment),
 text:`Første termin er ${T.money(d.rows[0].payment+d.rows[0].fee)} inkludert termingebyr, målt i dagens kroner. Senere betalinger omregnes ved hver månedsslutt. Nedbetalt etter ${T.period(p.payoffTerm)}.`,
 meaning:`Samlet betaling tilsvarer ${T.money(d.totals.paid)} i dagens kroner, med ${T.pct(p.input.inflation??defaults.inflation)} årlig prisvekst. Av dette er ${T.money(d.totals.principal)} avdrag, ${T.money(d.totals.interest)} renter og ${T.money(d.totals.fees)} gebyrer.`,
 extra:r.extra?r.extra+' Denne forskjellen er regnet i løpende kroner.':null};
}
function chartSummary(p){
 if(!p.input.real)return T.chart([{t:0,v:p.input.amount},...p.rows.map(r=>({t:r.term/12,v:r.balance}))],p)+' Beløpene er i løpende kroner.';
 const d=present(p),mid=d.rows[Math.max(0,Math.floor(d.rows.length/2)-1)];
 return `Restgjelden målt i dagens kroner går fra ${T.money(p.input.amount)} ved utbetaling til 0 kr etter ${T.period(p.payoffTerm)}. Omtrent halvveis er realverdien ${T.money(mid.balance)}. Prisveksten er satt til ${T.pct(p.input.inflation??defaults.inflation)} per år. Lavere realverdi betyr ikke at inntekten øker.`;
}
function scenarios(p){
 const s=p.input,shift=s.scenarioShift??defaults.scenarioShift,common={...s,rateChanges:[],extraPayments:[]};
 return [{name:'Lavere rente',rate:Math.max(0,s.rate-shift)},{name:'Grunnscenario',rate:s.rate},{name:'Høyere rente',rate:Math.min(100,s.rate+shift)}].map(v=>{
 const plan=L.plan({...common,rate:v.rate}),d=present(plan);
 return {...v,delta:v.rate-s.rate,plan,first:d.rows[0].payment+d.rows[0].fee,last:d.rows.at(-1).payment+d.rows.at(-1).fee,cost:d.totals.interest+d.totals.fees,paid:d.totals.paid};
 });
}
function costChart(p,prefix='loanCost'){
 const d=present(p),t=d.totals,parts=[['Avdrag',t.principal,'principal'],['Renter',t.interest,'interest'],['Gebyrer',t.fees,'fees']],total=t.paid;
 let offset=0;
 const circles=parts.filter(x=>x[1]>0).map(([label,value,cls])=>{const share=value/total*100,start=offset;offset+=share;return `<circle class="cost-${cls}" cx="60" cy="60" r="44" pathLength="100" fill="none" stroke-width="22" stroke-dasharray="${share} ${100-share}" stroke-dashoffset="${-start}" transform="rotate(-90 60 60)"/>`;}).join('');
 const unit=p.input.real?'dagens kroner':'løpende kroner';
 return `<div class="loan-cost"><svg viewBox="0 0 120 120" role="img" aria-labelledby="${prefix}Title ${prefix}Desc"><title id="${prefix}Title">Samlet tilbakebetaling fordelt på avdrag, renter og gebyrer</title><desc id="${prefix}Desc">${parts.map(([k,v])=>k+': '+T.money(v)).join('. ')}. Målt i ${unit}.</desc>${circles}</svg><dl>${parts.map(([label,value,cls])=>`<div><dt><i class="cost-key cost-${cls}"></i>${label}</dt><dd>${T.money(value)} <span>(${new Intl.NumberFormat('nb-NO',{maximumFractionDigits:1}).format(value/total*100)} %)</span></dd></div>`).join('')}</dl></div>`;
}
const api={chartSummary,defaults,factor,present,result,scenarios,costChart};
if(typeof module!=='undefined')module.exports=api;else root.LaanVisning=api;
})(typeof window!=='undefined'?window:globalThis);
