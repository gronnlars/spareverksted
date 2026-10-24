const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const V=require('../dist/veileder-engine.js'),Cards=require('../dist/veileder-cards.js'),F=require('../dist/veileder-facts.js');
for(const entry of require('../dist/veileder-knowledge.js'))V.register(entry);
const urgent={debt:'yes',buffer:'no',income:'uncertain',risk:'low',years:15};
const a=Cards.build('buffer',urgent),text=JSON.stringify(a);
assert.doesNotMatch(text,/aksjeandel|Uro teller også|Du har oppgitt|mangler buffer/);
assert.deepEqual(a.parts.slice(0,3).map(x=>x.title),['Dyr gjeld først','Sett av penger du kan bruke','Ta høyde for inntektsfall']);
assert.match(text,/effektiv rente klart over sparerenten/);assert.match(text,/kontakte kreditorer tidlig/);assert.match(text,/gratis økonomi- og gjeldsrådgivning/);
assert.equal(a.steps.length,3);assert.match(a.steps[0],/startbuffer/);assert.match(a.steps[1],/dyr gjeld/);assert.match(a.steps[2],/større buffer/);
assert.equal(V.horizonRelevant('buffer'),false);assert.equal(V.horizonRelevant('mortgage'),false);assert.equal(V.horizonRelevant('q-bsu-basics'),false);assert.equal(V.horizonRelevant('funds'),true);assert.equal(V.horizonRelevant('q-ips-ask'),true);
assert.equal(V.fundRelevant('buffer',{risk:'low'}),false);assert.equal(V.fundRelevant('funds',urgent),false);
assert.equal(V.suggestions(urgent)[0].id,'buffer');assert.ok(V.suggestions(urgent).every(x=>x.id!=='funds'));
assert.notDeepEqual(V.suggestions({}),V.suggestions(urgent));
assert.equal(V.suggestions({buffer:'no'})[0].id,'buffer');assert.equal(V.suggestions({income:'uncertain'})[0].id,'buffer');
assert.ok(!V.suggestions({}).some(x=>/dyr gjeld|uten buffer/.test(x.title)),'unknown must not become no');
assert.equal(V.suggestions({age:25,owner:'no'})[0].id,'q-bsu-basics');
assert.ok(V.suggestions({fixed:'yes'}).some(x=>x.id==='mortgage'));
let count=0;
for(const t of V.topics)for(const debt of ['yes','no',''])for(const buffer of ['yes','no',''])for(const income of ['stable','uncertain',''])for(const risk of ['low','high','']){
 const answer=Cards.build(t.id,{debt,buffer,income,risk,years:3});
 if(V.isExplainer(t.id)){assert.deepEqual(answer.options,[],t.id);assert.doesNotMatch(JSON.stringify(answer),/[\u2013\u2014]|\{\{/);count++;continue;}
 for(const option of answer.options){assert.ok(option.pros.length>=2,t.id);assert.ok(option.cons.length>=2,t.id);assert.ok(option.poorFit?.length>10,t.id);}
 assert.doesNotMatch(JSON.stringify(answer),/[\u2013\u2014]|\{\{|Du har oppgitt/);
 if(debt==='yes'&&buffer==='no'){assert.ok(!answer.parts.some(x=>x.title==='Uro teller også'));assert.equal(answer.options[0].title,'Bygge en tilgjengelig buffer');}
 count++;
}
for(const [id,fact]of Object.entries(F.data)){assert.equal(fact.year,2026,id);assert.equal(fact.checked,'2026-10-22',id);assert.ok(fact.source.startsWith('https://'),id);assert.ok(Number.isFinite(fact.value),id);}
assert.equal(F.text('year'),'2026');assert.equal(F.text('bsuAnnual'),'27 500');assert.equal(F.text('ipsIntroduced'),'2017');assert.throws(()=>F.text('unknown'));
for(const name of fs.readdirSync(path.join(__dirname,'../dist')).filter(x=>/\.(html|js|css)$/.test(x)))assert.doesNotMatch(fs.readFileSync(path.join(__dirname,'../dist',name),'utf8'),/[\u2013\u2014]/,name);
console.log('Relevance: '+count+' profiles, card balance, priorities, adaptive questions and dated facts passed.');
