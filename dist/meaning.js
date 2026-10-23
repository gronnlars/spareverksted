// «Dette betyr tallene dine»: regelbaserte forklaringer som bygger på beregningsresultatet, valgt spareform og
// tidshorisont. Ingen KI og ingen gjetning: spareformen leses bare fra brukerens eget valg (savingsType), aldri fra
// avkastning eller prisvekst. Valget endrer ingen tall. Funksjonen er ren, slik at den kan testes uten nettleser.
(function(root){
'use strict';
const TYPES={checking:{name:'brukskonto',rate:'rente'},savings:{name:'sparekonto',rate:'rente'},index:{name:'indeksfond',rate:'vekst'}};
function join(list){return list.length>1?list.slice(0,-1).join(', ')+' og '+list.at(-1):list[0]||'';}
// E: beregningsmotoren. s: planen. end: år. f: {money, pct} formatterer (nettsiden sender inn sine egne).
function build(E,s,end,f,A){
 const months=Math.round(end*12),P=Math.exp(Math.log1p(s.inflation/100)*months/12);
 const final=E.value(s,end),paid=E.raw({...s,rate:0,fee:0},end,0,0),paidToday=E.depositsToday(s,end),real=final/P;
 const growth=final-paid,powerChange=real-paidToday,X=E.explain(s,end),costEffect=Math.max(0,E.value(s,end,s.rate,0)-final);
 const deposits=paid-s.start>0.5,type=TYPES[s.savingsType]||null,d=E.defaults,same=(a,b)=>Math.abs(a-b)<0.5;
 const main=[],details=[],actions=[];
 // 1. Kroner og kjøpekraft. Setningene vises bare når de stemmer med tallene.
 if(paid<=0.5)main.push('Planen har ingen innskudd ennå.');
 else if(s.inflation===0)main.push('Med 0 % prisvekst er kroner og kjøpekraft det samme i denne beregningen.');
 else if(X.loss>0)main.push(X.allLost?'Pengene du har satt inn, er tapt i denne beregningen.':'Både kronebeløpet og kjøpekraften blir lavere enn det du har satt inn.');
 else if(powerChange<-0.5){
  if(same(growth,0))main.push(deposits?'Saldoen øker bare fordi du setter inn nye penger. Pengene kjøper mindre enn innskuddene kunne da du satte dem inn, fordi prisene stiger.':'Beløpet på kontoen er uendret, men pengene kjøper mindre etter hvert som prisene stiger.');
  else main.push(deposits?'Saldoen øker av innskuddene og avkastningen, men prisene stiger raskere enn pengene vokser. Pengene kjøper mindre enn innskuddene kunne da du satte dem inn.':'Du får flere kroner på kontoen, men prisene stiger raskere enn pengene vokser.');
 }
 else if(powerChange>0.5)main.push(deposits?'Avkastningen er større enn prisveksten, så sluttbeløpet kan kjøpe mer enn innskuddene kunne da du satte dem inn.':'Pengene vokser mer enn prisene, så sluttbeløpet kan kjøpe mer enn startbeløpet kunne da du satte det inn.');
 else main.push('Pengene vokser omtrent like mye som prisene, så kjøpekraften er omtrent den samme som for innskuddene.');
 // 2. Spareformen. Startverdiene sies tydelig, slik at et valg aldri ser ut til å gjøre tallene representative.
 const startValues=[...(s.rate===d.rate?[`${f.pct(d.rate)} vekst`]:[]),...(s.fee===d.fee?[`${f.pct(d.fee)} kostnad`]:[])];
 if(type&&s.savingsType!=='index'&&startValues.length)
  main.push(`Du har valgt ${type.name}, men beregningen bruker fortsatt startverdiene ${join(startValues)}. De er ikke vilkår for en ${type.name}. Legg inn kontoens rente${s.fee===d.fee?' og eventuelle kostnader':''}.`);
 else if(s.savingsType==='savings')main.push(`Beregningen forutsetter ${f.pct(s.rate)} rente på sparekontoen gjennom hele perioden. Kontroller at renten stemmer med kontovilkårene. Endres renten, blir resultatet annerledes. Renter beskattes hvert år, så resultatet etter skatt blir lavere.`);
 else if(s.savingsType==='checking')main.push(`Beregningen bruker ${f.pct(s.rate)} rente på brukskontoen gjennom hele perioden. Kontroller kontovilkårene.`+(s.rate>0?' Renter beskattes hvert år, så resultatet etter skatt blir lavere.':''));
 else if(s.savingsType==='index'){
  const own=s.riskChosen&&s.stress==='low'?'Du har selv oppgitt at du helst vil unngå store fall. ':'';
  main.push(own+`Et indeksfond kan falle mye i verdi underveis, men beregningen viser en jevn utvikling på ${f.pct(s.rate)} hvert år.`);
  if(A&&A.index&&paid>0.5){const low=E.band(s,end,-1.96,A.index.sigma),years=Math.round(end*12)/12;
   main.push(low<paid-0.5?`Med ${f.years(years)} sparetid kan verdien også ende under det du har satt inn: i den nedre delen av utfallsrommet blir den ${f.money(low)}.`:`Med ${f.years(years)} sparetid ligger også den nedre delen av utfallsrommet over innskuddene (${f.money(low)}), men det er en modell, ikke en garanti.`);}
  actions.push({id:'range',label:'Vis utfallsrommet i grafen',hide:'Skjul utfallsrommet i grafen'});
 }
 if(type&&s.savingsType!=='index'&&s.rate>0&&!(startValues.length)){const lower=Math.max(0,s.rate-2),v=E.value(s,end,lower);
  actions.push({id:'lowerRate',label:'Se hvordan en lavere rente påvirker resultatet',text:`Med ${f.pct(lower)} rente i stedet for ${f.pct(s.rate)} blir sluttbeløpet ${f.money(v)}${s.inflation>0?`, eller ${f.money(v/P)} i dagens kroner`:''}. Tallene dine er ikke endret.`});}
 // 3. Utdyping, samlet i tre grupper.
 details.push({title:'Innbetalinger og avkastning',text:`Du setter inn ${f.money(paid)}. ${growth>=-0.5?'Avkastning':'Nedgang'} etter kostnader: ${f.money(Math.abs(growth))}.`+(costEffect>=0.5?` Uten kostnader ville sluttbeløpet vært ${f.money(costEffect)} høyere.`:'')+(deposits?' En høyere saldo viser ikke alene at kjøpekraften er bevart, fordi mye av økningen er nye innbetalinger.':'')});
 if(s.inflation!==0)details.push({title:'Kroner og kjøpekraft',text:`Med ${f.pct(s.inflation)} årlig prisvekst tilsvarer sluttbeløpet ${f.money(real)} i dagens kroner. Innskuddene tilsvarer ${f.money(paidToday)} i dagens kroner, regnet om med prisnivået da hvert innskudd ble satt inn. ${Math.abs(powerChange)<0.5?'Kjøpekraften er omtrent uendret.':`Det er ${f.money(Math.abs(powerChange))} ${powerChange>0?'mer':'mindre'} kjøpekraft enn innskuddene.`}`});
 let a=`Beregningen bygger på ${f.pct(s.rate)} ${type?type.rate:'vekst'} og ${f.pct(s.fee)} kostnad hvert år gjennom hele perioden, og ${f.pct(s.inflation)} prisvekst. Alt er før skatt.`;
 if(startValues.length||s.inflation===d.inflation)a+=` ${join([...startValues,...(s.inflation===d.inflation?[`${f.pct(d.inflation)} prisvekst`]:[])])} er startverdier, ikke anbefalinger.`;
 if(s.crash>0)a+=` Børsfallet på ${f.pct(s.crash)} er et enkelt fall, ikke en årlig nedgang.`;
 if(s.rate<0)a+=` ${f.pct(s.rate)} er en nedgang hvert år gjennom hele perioden, ikke ett enkelt fall.`;
 if(s.savingsType==='index')a+=' Forklaringene gjelder aksjeindeksfond, for eksempel et globalt aksjeindeksfond. Andre fond kan svinge mer eller mindre.'+(A&&A.index?` Utfallsrommet bygger på Finans Norges standard for avkastningsprognoser (${f.pct(A.index.realRate)} forventet realavkastning og ${f.pct(A.index.sigma)} årlig svingning for aksjer). Det er et 95 % intervall i modellen: kortere sparetid gir større usikkerhet i snittavkastningen. Modellen er ikke en garanti, og virkeligheten kan havne utenfor.`:'');
 if(!type||s.savingsType==='index')a+=' Du kan velge en avkastning i modellen, men ikke bestemme hva markedet faktisk gir.';
 details.push({title:'Forutsetninger',text:a});
 return {main:main.join(' '),details,actions,numbers:{final,paid,paidToday,real,growth,powerChange}};
}
const api={build,TYPES};
if(typeof module!=='undefined')module.exports=api;else root.Meaning=api;
})(this);
