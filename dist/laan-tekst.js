// Tekster til lånekalkulatoren: resultat i ord og beskrivelse av grafen. Regelbasert og uten KI.
// Rene funksjoner som tar ferdige tall fra laan-motor.js, slik at de kan testes uten nettleser.
// Ordvalg: aldri «billigere» eller råd om hva brukeren bør velge (BESLUTNINGER.md, «Lånekalkulator v1»).
(function(root){
'use strict';
const nf=new Intl.NumberFormat('nb-NO',{maximumFractionDigits:0}),dec=new Intl.NumberFormat('nb-NO',{maximumFractionDigits:2});
const money=x=>nf.format(Math.round(x)).replace(/^-/,'−')+' kr';
const pct=x=>dec.format(x)+' %';
function period(terms){
 const y=Math.floor(terms/12),m=terms%12,yt=y?`${nf.format(y)} år`:'',mt=m?`${m} ${m===1?'måned':'måneder'}`:'';
 return yt&&mt?`${yt} og ${mt}`:yt||mt;
}
const yearAfter=term=>{const t=(term-1)/12;return t===0?'fra første måned':`etter ${period(term-1)}`;};

// Hovedresultatet. p: plan fra LaanMotor.plan(). base: samme lån uten ekstra innbetaling (eller null).
function result(p,base){
 const s=p.input,t=p.totals,serie=s.type==='serie',change=(s.rateChanges||[])[0],out={};
 out.amount=money(p.firstPayment);
 out.eyebrow=serie?'Første måned':'Hver måned';
 const parts=[];
 if(serie)parts.push(`Beløpet synker hver måned, til ${money(p.lastPayment)} i siste måned.`);
 if(p.payoffTerm<p.plannedTerms)parts.push(`Lånet er nedbetalt etter ${period(p.payoffTerm)}.`);
 else parts.push(`Nedbetalt etter ${period(p.payoffTerm)}.`);
 if(s.termFee>0)parts.push(`I tillegg kommer ${money(s.termFee)} i termingebyr hver måned.`);
 if(change&&change.term<=p.payoffTerm){
  const row=p.rows[change.term-1],before=change.term>1?p.rows[change.term-2].payment:null;
  if(serie)parts.push(`Med ${pct(change.rate)} rente ${yearAfter(change.term)} blir renten en annen, men avdraget er det samme.`);
  else parts.push(`Med ${pct(change.rate)} rente ${yearAfter(change.term)} blir beløpet ${money(row.payment)}`+(before!==null&&Math.abs(row.payment-before)>=0.5?`, ${money(Math.abs(row.payment-before))} ${row.payment>before?'mer':'mindre'} enn før.`:'.'));
 }
 out.text=parts.join(' ');
 // Hva lånet koster, i kroner per 100 kr lånt.
 const per100=(t.interest+t.fees)/s.amount*100;
 out.meaning=`For hver 100 kr du låner, betaler du ${dec.format(Math.round(per100*10)/10)} kr i ${t.fees>0?'renter og gebyrer':'renter'}. Til sammen betaler du tilbake ${money(t.paid)}.`;
 if(base){
  const months=base.payoffTerm-p.payoffTerm,saved=base.totals.interest-t.interest;
  if(t.extra>0)out.extra=months>0?`Den ekstra innbetalingen gjør lånet ferdig ${period(months)} tidligere og gir ${money(saved)} mindre i renter.`:`Den ekstra innbetalingen gir ${money(saved)} mindre i renter.`;
 }
 out.notes=p.notes.map(n=>n.kind==='extraCapped'?`Den ekstra innbetalingen er større enn gjelden. Det trengs bare ${money(n.used)}, og da er lånet innfridd.`
  :n.kind==='extraAfterPayoff'?'Den ekstra innbetalingen kommer etter at lånet er nedbetalt, og er ikke regnet med.'
  :'Renteendringen kommer etter at lånet er nedbetalt, og er ikke regnet med.');
 return out;
}

// Sammenligning av annuitet og serie med de samme tallene. Forklarer følgen, ikke hva som er best.
function compare(a,s){
 const lower=s.totals.interest<a.totals.interest-0.5;
 return {
  annuitet:{first:money(a.firstPayment),last:money(a.lastPayment),interest:money(a.totals.interest)},
  serie:{first:money(s.firstPayment),last:money(s.lastPayment),interest:money(s.totals.interest)},
  text:lower?`Serielånet gir ${money(a.totals.interest-s.totals.interest)} mindre i renter fordi gjelden betales raskere ned. Til gjengjeld er de første månedene ${money(s.firstPayment-a.firstPayment)} høyere.`
   :'Uten rente er det ingen forskjell i samlet kostnad. Bare fordelingen over tid er ulik.'
 };
}

// «Slik leser du grafen». points: [{t (år), v (restgjeld)}], fra start til nedbetalt.
function chart(points,p){
 if(!points||points.length<2)return '';
 const L=points[0].v,end=points.at(-1).t,mid=points.reduce((b,x)=>Math.abs(x.t-end/2)<Math.abs(b.t-end/2)?x:b,points[0]);
 const parts=[`Gjelden går fra ${money(L)} til 0 kr over ${period(Math.round(end*12))}.`];
 parts.push(`Halvveis er det ${money(mid.v)} igjen.`);
 if(p.input.type==='annuitet'&&p.totals.interest>0&&mid.v>L*0.55)parts.push('Linjen synker sakte i starten og brattere mot slutten, fordi mye av beløpet går til renter de første årene.');
 else if(p.input.type==='serie')parts.push('Linjen er rett, fordi avdraget er det samme hver måned.');
 if(p.totals.extra>0)parts.push('Der den ekstra innbetalingen kommer, faller linjen brått.');
 return parts.join(' ');
}

const api={money,pct,period,result,compare,chart};
if(typeof module!=='undefined')module.exports=api;else root.LaanTekst=api;
})(typeof window!=='undefined'?window:globalThis);
