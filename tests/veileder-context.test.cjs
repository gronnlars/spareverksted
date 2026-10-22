const assert=require('node:assert/strict');
const C=require('../dist/veileder-context.js'),Cards=require('../dist/veileder-cards.js'),V=require('../dist/veileder-engine.js');
const data=new Map();const storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
const state={ageKnown:true,userAge:57,years:10,dreamYears:3,activePage:'calculator',riskChosen:true,stress:'high'};
assert.deepEqual(C.fromCalculator(state,false,C.empty()),C.empty(),'unsubmitted defaults must not become user input');
const ctx=C.fromCalculator(state,true,C.empty());assert.equal(ctx.profile.age,57);assert.equal(ctx.profile.years,10);assert.equal(ctx.profile.risk,'high');assert.equal(ctx.origins.age,'calculator');
assert.equal(C.forTopic(ctx,'funds').years,10);assert.equal(C.forTopic(ctx,'children').years,undefined,'parent horizon must not become child horizon');
ctx.horizons.children=4;assert.equal(C.forTopic(ctx,'children').years,4);assert.equal(C.forTopic(ctx,'pension').years,10);
ctx.horizons.funds=null;assert.equal(C.forTopic(ctx,'funds').years,null,'explicitly unknown must override inherited horizon');
C.write(storage,ctx);assert.deepEqual(C.read(storage),ctx);C.clear(storage);assert.deepEqual(C.read(storage),C.empty());
assert.equal(C.fromCalculator({...state,ageKnown:false,riskChosen:false},true,ctx).profile.age,undefined);assert.equal(C.fromCalculator({...state,ageKnown:false,riskChosen:false},true,ctx).profile.risk,undefined);
assert.equal(C.fromCalculator({...state,activePage:'dreams'},true,ctx).profile.years,3);
assert.deepEqual(C.fromCalculator({...state,ageKnown:false},true,ctx).horizons,{});
for(const corrupt of ['null','{bad','[]','42']){storage.setItem(C.KEY,corrupt);assert.deepEqual(C.read(storage),C.empty());}
assert.deepEqual(C.clean({profile:{age:999,years:-2,risk:'<script>',buffer:'unknown'},horizons:{funds:Infinity}}),C.empty());
assert.equal(C.write(undefined,ctx),false);assert.deepEqual(C.read(undefined),C.empty());
let count=0;
for(const t of V.topics)for(const age of [20,57,80,null])for(const years of [0,3,5,10,25,null])for(const buffer of ['yes','no','']){
 const a=Cards.build(t.id,{age,years,buffer});assert.equal(a.options.length,2);for(const o of a.options){assert.ok(o.pros.length&&o.cons.length);for(const i of [...o.pros,...o.cons])assert.ok(i.title&&i.text);}
 if(buffer==='no')assert.match(a.note,/mangler buffer/);count++;
}
const child=Cards.build('children',{});const all=JSON.stringify(child.options);
assert.match(all,/534 225/);assert.match(all,/I 2026/);assert.match(all,/Lånekassen/);assert.match(all,/nettoformuen/);assert.match(all,/gradvis/);assert.match(all,/ikke nødvendigvis lav/);assert.match(all,/allerede er gitt/);
assert.doesNotMatch(all,/Skatteetaten.*stipend/);
assert.match(Cards.build('funds',{years:3,age:20}).note,/under fem år/);
assert.match(Cards.build('pension',{age:57}).note,/57 år/);
assert.match(Cards.build('funds',{years:20,debt:'yes'}).note,/dyr gjeld/);
console.log(`Context and compact cards: defaults, same-tab storage, child horizon, stale overrides, malformed data and ${count} profile combinations passed.`);

const returned=C.calculatorPatch(ctx,false);
assert.equal(returned.userAge,57);assert.equal(returned.ageKnown,true);assert.equal(returned.years,10);
assert.equal(C.fromCalculator({...state,ageKnown:false,...returned},true,ctx).profile.age,57);
assert.deepEqual(C.calculatorPatch(ctx,true),{},'a shared plan must never inherit this tab’s personal context');
assert.deepEqual(C.calculatorPatch(C.empty(),false),{});
assert.equal(returned.years,10,'a child’s three- or four-year horizon must not overwrite the calculator horizon');
