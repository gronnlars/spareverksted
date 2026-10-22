/* Same-tab context only. Never infer age from defaults or years from a child's parent's plan. */
(function(root){
'use strict';
const KEY='sv-guidance-tab-v2';
function empty(){return {profile:{},origins:{},horizons:{}};}
function clean(raw){
 const out=empty();if(!raw||typeof raw!=='object')return out;
 const p=raw.profile||{},nums={age:[0,110],years:[0,80]};
 for(const [k,[min,max]]of Object.entries(nums)){const n=p[k];if(typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max&&(k!=='age'||Number.isInteger(n))){out.profile[k]=n;out.origins[k]=raw.origins?.[k]==='calculator'?'calculator':'guide';}}
 const choices={buffer:['yes','no'],debt:['yes','no'],income:['stable','uncertain'],risk:['low','medium','high'],discipline:['automatic','flexible'],fixed:['yes','no'],owner:['yes','no'],tax:['yes','no']};
 for(const [k,values]of Object.entries(choices))if(values.includes(p[k])){out.profile[k]=p[k];out.origins[k]=raw.origins?.[k]==='calculator'?'calculator':'guide';}
 for(const id of ['mortgage','student','children','buffer','funds','pension','bsu']){const n=raw.horizons?.[id];if(n===null||typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=80)out.horizons[id]=n;}
 return out;
}
function read(storage){try{return clean(JSON.parse(storage.getItem(KEY)));}catch{return empty();}}
function write(storage,data){try{storage.setItem(KEY,JSON.stringify(clean(data)));return true;}catch{return false;}}
function clear(storage){try{storage.removeItem(KEY);}catch{}}
function fromCalculator(state,started,previous){
 const out=clean(previous);if(!started)return out;
 for(const k of ['age','years','risk']){delete out.profile[k];delete out.origins[k];}
 if(state.ageKnown===true){out.profile.age=state.userAge;out.origins.age='calculator';}
 out.profile.years=state.activePage==='dreams'?state.dreamYears:state.years;out.origins.years='calculator';
 if(state.riskChosen===true){out.profile.risk=state.stress;out.origins.risk='calculator';}
 // A new calculator visit starts a new horizon comparison, not a stale earlier override.
 out.horizons={};return clean(out);
}
function forTopic(context,id){const c=clean(context),p={...c.profile};if(Object.hasOwn(c.horizons,id))p.years=c.horizons[id];else if(id==='children')delete p.years;return p;}
function calculatorPatch(context,hasExplicitPlan){
 const p=clean(context).profile,patch={};if(hasExplicitPlan)return patch;
 if(p.age!==undefined){patch.userAge=p.age;patch.ageKnown=true;}
 if(p.years!==undefined)patch.years=p.years;
 if(p.risk){patch.stress=p.risk;patch.riskChosen=true;}
 return patch;
}
const api={KEY,empty,clean,read,write,clear,fromCalculator,forTopic,calculatorPatch};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SpareContext=api;
})(typeof window!=='undefined'?window:globalThis);
