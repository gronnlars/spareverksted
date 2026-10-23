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
 for(const [id,n]of Object.entries(raw.horizons||{})){if(!/^[a-z][a-z0-9-]{0,60}$/.test(id)||['constructor','prototype'].includes(id))continue;if(n===null||typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=80)out.horizons[id]=n;}
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
// onlyGuide: bare opplysninger brukeren har endret i veilederen. Brukes når hele planen hentes tilbake.
// Sparetiden går tilbake til feltet den kom fra: sparemålets periode når sparemål var åpent.
function calculatorPatch(context,hasExplicitPlan,{onlyGuide=false,page='calculator'}={}){
 const c=clean(context),p=c.profile,patch={};if(hasExplicitPlan)return patch;
 const use=k=>p[k]!==undefined&&(!onlyGuide||c.origins[k]==='guide');
 if(use('age')){patch.userAge=p.age;patch.ageKnown=true;}
 if(use('years'))patch[page==='dreams'?'dreamYears':'years']=p.years;
 if(use('risk')){patch.stress=p.risk;patch.riskChosen=true;}
 return patch;
}
// Hele arbeidsplanen i samme fane, slik at en tur til «Spør om sparing» ikke endrer tallene.
// Bare sessionStorage: forsvinner når fanen lukkes, og følger aldri med delte lenker.
const PLAN_KEY='sv-working-plan-v1';
function writePlan(storage,state,mode,view){try{storage.setItem(PLAN_KEY,JSON.stringify({state,mode,view}));return true;}catch{return false;}}
function clearPlan(storage){try{storage.removeItem(PLAN_KEY);}catch{}}
function readPlan(storage){try{const d=JSON.parse(storage.getItem(PLAN_KEY));if(!d||typeof d!=='object'||!d.state||typeof d.state!=='object'||Array.isArray(d.state))return null;
 const v=d.view&&typeof d.view==='object'?d.view:{};
 return {state:d.state,mode:d.mode==='goal'?'goal':'explore',view:{showBank:v.showBank===true,showRange:v.showRange===true,showGoal:v.showGoal===true,both:v.both===true}};}catch{return null;}}
const api={KEY,PLAN_KEY,writePlan,readPlan,clearPlan,empty,clean,read,write,clear,fromCalculator,forTopic,calculatorPatch};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SpareContext=api;
})(typeof window!=='undefined'?window:globalThis);
