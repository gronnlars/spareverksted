// Lånekalkulatorens regnemotor. Ren regning uten nettleser, slik at den kan testes i Node.
// Egen fil: sparekalkulatoren (engine.js) røres ikke. Lån regnes aldri som negative sparebeløp.
//
// Låste forutsetninger (BESLUTNINGER.md, «Lånekalkulator v1», 3.11.2026, og docs/laanemodell.md):
//  1. Månedlige terminer i etterskudd. Første termin én måned etter utbetaling.
//  2. Månedsrente = nominell årsrente / 12.
//  3. Annuitet: terminbeløp = L · i / (1 − (1 + i)^−n). Ved 0 % rente: L / n.
//  4. Serie: fast avdrag = L / n. Renten regnes av restgjelden.
//  5. Ingen avrunding i beregningen. Skjermen avrunder.
//  6. Siste termin er resten: hele restgjelden pluss påløpt rente og termingebyr. Den kan være mindre enn de andre.
//  7. Ekstra innbetaling: det gjeldende terminbeløpet (annuitet) eller avdraget (serie) beholdes, så løpetiden blir
//     kortere. Innbetalingen begrenses til restgjelden. Etter innfrielse løper ingen rente eller gebyrer.
//  8. Renteendring: annuitet får nytt terminbeløp beregnet over gjenværende løpetid, det vil si antall terminer
//     igjen i planen slik den er når renten endres (en tidligere ekstra innbetaling er regnet med). Serie: avdraget
//     beholdes, bare renten endres.
//  9. Samme termin: ny rente gjelder hele terminen, deretter betales terminen, deretter den ekstra innbetalingen.
// 10. Etableringsgebyret betales ved utbetaling. Termingebyret betales hver termin og påvirker ikke restgjelden.
//     Rente regnes bare av lånet.
// 11. Samlet tilbakebetalt = lånebeløp + rente + gebyrer.
// Hendelser angis i terminer (1 = første termin). Siden gjør «fra år X» om til termin; motoren gjetter ikke.
(function(root){
'use strict';

const KINDS=['bolig','bil','forbruk'];
const TYPES=['annuitet','serie'];
const defaults={kind:'bolig',type:'annuitet',amount:3000000,rate:5,years:25,establishmentFee:0,termFee:0,rateChanges:[],extraPayments:[]};

// Feltgrenser i samme form og med samme ordlyd i feilmeldingene som sparekalkulatoren (engine.js).
// [min, maks, enhet, etikett, valg]. open: min er utelukket. minText: egen tekst for minstegrensen.
const R=(min,max,unit,label,opt={})=>({min,max,unit,label,...opt});
const FIELDS={
 amount:R(0,1e9,' kr','Lånebeløp',{open:true}),
 rate:R(0,100,' %','Nominell årsrente'),
 years:R(1/12,50,' år','Nedbetalingstid',{minText:'én måned'}),
 establishmentFee:R(0,1e7,' kr','Etableringsgebyr'),
 termFee:R(0,1e5,' kr','Termingebyr')
};
const EVENT_FIELDS={changeRate:R(0,100,' %','Ny rente'),extraAmount:R(0,1e10,' kr','Ekstra innbetaling',{open:true})};
const RULES={...FIELDS,...EVENT_FIELDS};
const num=new Intl.NumberFormat('nb-NO');
function label(key){return RULES[key]?.label||key}
function fail(key,text){const e=new Error(text);e.field=key;throw e}
// Returnerer feilen for ett felt, eller null. labelOf(key) kan gi etiketten som vises på skjermen.
function fieldError(key,v,labelOf){
 const r=RULES[key];if(!r)return null;const name=(labelOf&&labelOf(key))||r.label;
 if(typeof v!=='number'||!Number.isFinite(v))return `Fyll inn et gyldig tall i «${name}».`;
 if(v<r.min||v>r.max||(r.open&&v<=r.min)){const lower=r.minText||`${num.format(r.min)}${r.unit}`;return `«${name}» må være ${r.open?`over ${lower} og opptil`:`fra ${lower} til`} ${num.format(r.max)}${r.unit}.`;}
 return null;
}
const terms=s=>Math.round(s.years*12);
// Stopper ugyldige verdier med feltnavn i meldingen. Kaster Error med .field.
function validate(s,labelOf){
 if(!KINDS.includes(s.kind))fail('kind','Velg lånetype.');
 if(!TYPES.includes(s.type))fail('type','Velg annuitetslån eller serielån.');
 for(const k in FIELDS){const t=fieldError(k,s[k],labelOf);if(t)fail(k,t);}
 if(s.establishmentFee>=s.amount)fail('establishmentFee',`«${(labelOf&&labelOf('establishmentFee'))||'Etableringsgebyr'}» må være lavere enn lånebeløpet.`);
 const n=terms(s),termText=t=>`termin ${num.format(t)}`;
 const event=(e,key,valueKey)=>{
  if(!e||!Number.isInteger(e.term)||e.term<1||e.term>n)fail(key+'Term',`Tidspunktet for «${label(key)}» må ligge mellom ${termText(1)} og ${termText(n)}.`);
  const t=fieldError(key,e[valueKey],labelOf);if(t)fail(key,t);
 };
 for(const e of s.rateChanges||[])event(e,'changeRate','rate');
 for(const e of s.extraPayments||[])event(e,'extraAmount','amount');
}

// Numerisk stabil form: 1 − (1 + i)^−n regnes som −expm1(−n · log1p(i)). Den naive formelen mister presisjon ved
// svært lav rente (1 + i rundes av), og ga feil terminbeløp ved for eksempel 0,0000000001 % (funnet av GPT 3.11.2026).
function annuityPayment(balance,i,n){if(i===0)return balance/n;const d=-Math.expm1(-n*Math.log1p(i));return d>0?balance*i/d:balance/n}
// Antall terminer som trengs for å betale ned restgjelden med et fast beløp (siste termin kan være delvis).
function termsLeft(balance,i,payment){
 if(i===0)return balance/payment;
 const x=balance*i/payment;return x>=1?Infinity:-Math.log1p(-x)/Math.log1p(i);
}
const ceilTerms=x=>Math.max(1,Math.ceil(x-1e-9));

// Hele nedbetalingsplanen, termin for termin.
// Gir {rows, totals, firstPayment, lastPayment, payoffTerm, plannedTerms, flows, notes}.
// rows: {term, rate, interest, principal, fee, extra, payment (rente + avdrag), total (payment + fee + extra), balance}.
function plan(input){
 const s={...defaults,...input};validate(s);
 const n=terms(s),eps=s.amount*1e-12;
 const changes=new Map((s.rateChanges||[]).map(e=>[e.term,e.rate])),extras=new Map();
 for(const e of s.extraPayments||[])extras.set(e.term,(extras.get(e.term)||0)+e.amount);
 let balance=s.amount,rate=s.rate,i=rate/1200,end=n;
 let payment=s.type==='annuitet'?annuityPayment(balance,i,n):0;
 const principalFixed=s.amount/n,rows=[],notes=[];
 const totals={amount:s.amount,interest:0,principal:0,termFees:0,establishmentFee:s.establishmentFee,fees:s.establishmentFee,extra:0,paid:s.establishmentFee};
 for(let k=1;balance>eps&&k<=end;k++){
  if(changes.has(k)){rate=changes.get(k);i=rate/1200;if(s.type==='annuitet')payment=annuityPayment(balance,i,end-k+1);}
  const interest=balance*i;
  let principal=s.type==='annuitet'?payment-interest:principalFixed;
  if(k===end||principal>=balance-eps)principal=balance;
  balance-=principal;
  let extra=0;const wanted=extras.get(k)||0;
  if(wanted>0){extra=Math.min(wanted,balance);if(wanted>extra+eps)notes.push({kind:'extraCapped',term:k,wanted,used:extra});balance-=extra;}
  if(balance<=eps)balance=0;
  // Ekstra innbetaling: samme terminbeløp eller avdrag, kortere løpetid.
  else if(extra>0)end=k+ceilTerms(s.type==='annuitet'?termsLeft(balance,i,payment):balance/principalFixed);
  const fee=s.termFee,row={term:k,rate,interest,principal,fee,extra,payment:interest+principal,total:interest+principal+fee+extra,balance};
  rows.push(row);
  totals.interest+=interest;totals.principal+=principal+extra;totals.termFees+=fee;totals.fees+=fee;totals.extra+=extra;totals.paid+=row.total;
 }
 const payoffTerm=rows.length;
 for(const [term] of changes)if(term>payoffTerm)notes.push({kind:'rateChangeAfterPayoff',term});
 for(const [term] of extras)if(term>payoffTerm)notes.push({kind:'extraAfterPayoff',term});
 // Betalingsstrømmen sett fra låntaker: utbetalt beløp etter etableringsgebyr ved termin 0, deretter alt som betales.
 // Grunnlag for effektiv rente, som beregnes i egen PR etter kildekontroll av regelverket.
 const flows=[{term:0,amount:s.amount-s.establishmentFee},...rows.map(r=>({term:r.term,amount:-r.total}))];
 return {input:s,rows,totals,firstPayment:rows[0].payment,lastPayment:rows.at(-1).payment,payoffTerm,plannedTerms:n,flows,notes};
}

// Summer per år for graf og tabell. År 1 er termin 1 til 12.
function byYear(p){
 const out=[];
 for(const r of p.rows){const y=Math.ceil(r.term/12);let a=out[y-1];if(!a)a=out[y-1]={year:y,interest:0,principal:0,fees:0,extra:0,paid:0,balance:0};
  a.interest+=r.interest;a.principal+=r.principal+r.extra;a.fees+=r.fee;a.extra+=r.extra;a.paid+=r.total;a.balance=r.balance;}
 if(out.length)out[0].fees+=p.totals.establishmentFee,out[0].paid+=p.totals.establishmentFee;
 return out;
}

// Hvilke felt hvert detaljnivå viser. Valg som er gjort på et høyere nivå, regnes fortsatt med når brukeren går
// tilbake til et enklere nivå. hiddenActive() lister dem, så siden kan vise en kort oppsummering med «Endre».
// Forbrukslån viser gebyrene på alle nivåer, fordi de er en stor del av kostnaden.
const LEVEL_FIELDS={
 simple:['kind','type','amount','rate','years'],
 explore:['kind','type','amount','rate','years','establishmentFee','termFee','rateChanges','extraPayments'],
 advanced:['kind','type','amount','rate','years','establishmentFee','termFee','rateChanges','extraPayments']
};
function visibleFields(level,kind){const f=[...(LEVEL_FIELDS[level]||LEVEL_FIELDS.simple)];if(kind==='forbruk')for(const k of ['establishmentFee','termFee'])if(!f.includes(k))f.push(k);return f;}
function hiddenActive(input,level){
 const s={...defaults,...input},shown=visibleFields(level,s.kind),out=[];
 for(const k of ['establishmentFee','termFee'])if(!shown.includes(k)&&s[k]>0)out.push({key:k,label:label(k),value:s[k]});
 if(!shown.includes('rateChanges')&&s.rateChanges?.length)out.push({key:'rateChanges',label:'Renteendring',value:s.rateChanges});
 if(!shown.includes('extraPayments')&&s.extraPayments?.length)out.push({key:'extraPayments',label:'Ekstra innbetaling',value:s.extraPayments});
 return out;
}

const api={defaults,KINDS,TYPES,FIELDS,EVENT_FIELDS,LEVEL_FIELDS,label,fieldError,validate,annuityPayment,plan,byYear,visibleFields,hiddenActive};
if(typeof module!=='undefined')module.exports=api;else root.LaanMotor=api;
})(typeof window!=='undefined'?window:globalThis);
