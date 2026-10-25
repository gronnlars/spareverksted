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
// Alder styrer forslagene: samme liste for 14 og 70 år var feil. Ukjent alder gir de generelle forslagene som før.
{const ids=age=>V.suggestions(age===null?{}:{age}).map(x=>x.id+':'+x.title),titles=age=>V.suggestions(age===null?{}:{age}).map(x=>x.title);
 const adult=F.value('adultAge'),first=F.value('ipsStartAge');
 assert.notDeepEqual(ids(14),ids(70));assert.notDeepEqual(ids(14),ids(35));assert.notDeepEqual(ids(35),ids(70));
 for(const age of [0,14,adult-1]){const all=titles(age).join(' ');assert.doesNotMatch(all,/pensjon|barnets navn|uttak/,'under '+adult+' år, alder '+age);assert.ok(titles(age).length>=1);}
 for(const age of [adult,35,first-1])assert.match(titles(age).join(' '),/binder penger til pensjon/,'alder '+age);
 for(const age of [first,70,95]){const all=titles(age).join(' ');assert.match(all,/uttak over mange år/);assert.doesNotMatch(all,/binder penger til pensjon|barnets navn/,'alder '+age);}
 assert.deepEqual(titles(null),['Hva bør jeg sjekke før jeg binder penger til pensjon?','Når passer sparekonto, og når kan fond passe?','Bør jeg spare i mitt eller barnets navn?'],'ukjent alder gjetter ikke');
 // Alle forslag peker til et eksisterende tema og har ingen tankestrek.
 for(const age of [null,0,14,18,35,62,70])for(const owner of ['','yes','no'])for(const s of V.suggestions({age,owner})){assert.ok(V.topics.some(x=>x.id===s.id),s.id);assert.doesNotMatch(s.title,/[\u2013\u2014]/);assert.ok(s.title.endsWith('?'));}
 // Hastesaker (dyr gjeld) går foran uansett alder.
 for(const age of [14,70])assert.equal(V.suggestions({age,debt:'yes'})[0].id,'buffer');}
// Mekanismen for tilpasning når databasen vokser: et nytt svar kan melde seg som forslag for en målgruppe.
{const entry=(id,suggest)=>({kind:'explainer',id,title:'Hva er '+id+'?',intro:'Kort svar.',checked:'2026-10-25',questions:['Hva er '+id+'?'],words:[new RegExp(id)],keys:[],sources:[{title:'Kilde',url:'https://example.org/'}],terms:[{term:'Begrep',text:'Forklaring.'}],example:{title:'Eksempel',text:'Tekst.'},parts:[{title:'Del',text:'Tekst.'}],suggest});
 V.register(entry('q-testsenior',{title:'Hva bør jeg vite om gaver til barnebarn?',audience:{fromAge:'ipsStartAge'}}));
 V.register(entry('q-testung',{title:'Hva bør jeg vite om første lønn?',audience:{fromAge:14,belowAge:'adultAge'}}));
 V.register(entry('q-testutenmaalgruppe',undefined));
 const has=(p,id)=>V.suggestions(p).some(x=>x.id===id);
 assert.ok(has({age:70},'q-testsenior'));assert.ok(!has({age:35},'q-testsenior'));assert.ok(!has({},'q-testsenior'),'ukjent alder viser ikke spesifikke forslag');
 assert.ok(has({age:15},'q-testung'));assert.ok(!has({age:70},'q-testung'));assert.ok(!has({age:13},'q-testung'));
 assert.equal(V.suggestions({age:70})[0].id,'q-testsenior','spesifikke forslag kommer før de generelle');
 assert.ok(V.suggestions({age:70}).length<=3);
 assert.ok(!V.suggestions({age:70,debt:'yes'}).some(x=>x.id==='q-testsenior'),'hastesaker går foran');
 assert.ok(!V.suggestions({age:70},'q-testsenior').some(x=>x.id==='q-testsenior'),'aktuelt tema foreslås ikke igjen');
 assert.ok(V.topics.some(t=>t.id==='q-testutenmaalgruppe'),'uten forslag finnes svaret fortsatt i tema og søk');
 for(const bad of [{title:'Hva er dette',audience:{fromAge:1}},{title:'Hva er dette?',audience:{}},{title:'Hva er dette?',audience:{fromAge:-1}},{title:'Hva er dette?',audience:{alder:5}},{title:'Hva er dette?',audience:{owner:'maybe'}},{title:'Hva er dette?',audience:{fromAge:'ukjent'}},{title:'Hva er dette? \u2013 ja',audience:{fromAge:1}},{title:'Hva er dette?'}])
  assert.throws(()=>V.register(entry('q-testfeil',bad)),'ugyldig forslag: '+JSON.stringify(bad));
 assert.ok(!V.topics.some(t=>t.id==='q-testfeil'));
 // Registreringen er bare for testen: fjern prøveoppføringene igjen.
 for(const id of ['q-testsenior','q-testung','q-testutenmaalgruppe']){const i=V.topics.findIndex(t=>t.id===id);assert.ok(i>=0);V.topics.splice(i,1);}}
console.log('Relevance: '+count+' profiles, card balance, priorities, adaptive questions and dated facts passed.');
