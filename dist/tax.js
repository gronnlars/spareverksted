(function(root){
'use strict';
function validate(s){
 if(!['ask','share'].includes(s.taxModel))throw Error('Velg ASK eller egen skattepliktig andel.');
 for(const key of ['taxRate','taxFreeCapital','taxShield','taxableShare'])if(!Number.isFinite(s[key]))throw Error('Fyll inn gyldige tall for skatteanslaget.');
 if(!Number.isFinite(s.taxFreeCapital+s.taxShield))throw Error('Skattefrie beløp overstiger tallområdet.');
 if(s.taxRate<0||s.taxRate>100||s.taxableShare<0||s.taxableShare>100||s.taxFreeCapital<0||s.taxShield<0)throw Error('Beløp må være minst 0, og prosenter mellom 0 og 100.');
}
function at(s,withdrawal,year){
 validate(s);const p=withdrawal.row(year),before=year>0?withdrawal.row(year-1).total:0,rate=s.taxRate/100;
 const regular=Math.max(0,p.actual),extra=Math.max(0,p.extra||0),gross=regular+extra;
 let taxable,totalTax,regularTax;
 if(s.taxModel==='ask'){
 const exempt=s.taxFreeCapital+s.taxShield,left=Math.max(0,exempt-before);
 taxable=Math.max(0,gross-left);regularTax=Math.max(0,regular-left)*rate;
 totalTax=Math.max(0,p.total-exempt)*rate;
 }else{taxable=gross*s.taxableShare/100;regularTax=regular*s.taxableShare/100*rate;totalTax=p.total*s.taxableShare/100*rate;}
 const tax=taxable*rate;
 return {...p,gross,tax,regularTax,extraTax:Math.max(0,tax-regularTax),net:Math.max(0,gross-tax),regularNet:Math.max(0,regular-regularTax),totalTax,totalNet:Math.max(0,p.total-totalTax)};
}
const api={validate,at};if(typeof module!=='undefined')module.exports=api;else root.TaxEstimate=api;
})(typeof window!=='undefined'?window:globalThis);
