'use strict';
// Sluttkontroll av søket. Bruk: node kjor.cjs <rot-til-repo> [--detaljer] [--json]
// Kjører testsett/utvikling.json, testsett/holdout.json (kopiert fra #55) og tillegg.json mot dist/ i gitt rot.
const fs=require('fs'),path=require('path');
const {klass}=require('./klassifiser.cjs');
const rot=path.resolve(process.argv[2]||'../..')+'/dist/';
const V=require(rot+'veileder-engine.js');for(const e of require(rot+'veileder-knowledge.js'))V.register(e);
const les=f=>JSON.parse(fs.readFileSync(path.join(__dirname,f),'utf8')).cases;
// Dokumenterte endringer i forventningene (se rapporten): d101 følger nektingsvedtaket (#56/#59).
const ENDRET={d101:{modus:'negated'}};
const alle=[...les('testsett/utvikling.json'),...les('testsett/holdout.json'),...les('tillegg.json')].map(c=>ENDRET[c.id]?{...c,...ENDRET[c.id]}:c);
const kind=r=>r.mode==='answer'?'direct':r.mode==='choose'?'choices':r.mode==='suggest'?'dym':'none';
const rader=alle.map(c=>{
 const r=V.search(c.repeat?c.q.repeat(c.repeat):c.q);
 const hits=r.hits.map(h=>h.id),sug=r.suggestions.map(s=>s.id),k=kind(r);
 const adapt=k==='direct'?{kind:k,first:hits[0],others:[...hits.slice(1),...sug]}:k==='choices'?{kind:k,first:null,others:[...hits,...sug]}:k==='dym'?{kind:k,first:null,others:sug}:{kind:'none',first:null,others:[]};
 let kl=c.modus?(r.mode===c.modus?'RM':'WD'):klass(c,adapt);
 const topp3=[adapt.first,...adapt.others].filter(Boolean).slice(0,3);
 return {c,mode:r.mode,hits,sug,adapt,kl,topp3};
});
const K=['RF','RFok','RS','RM','MISS','WD','CR','FS','soft-dekket','soft-mangler'];
const ut=[];const p=s=>ut.push(s);
p(`Vurdert: ${alle.length} tilfeller (utvikling ${les('testsett/utvikling.json').length}, holdout ${les('testsett/holdout.json').length}, tillegg ${les('tillegg.json').length}).`);
p('| Utfall | Antall |\n|---|---:|');for(const k of K)p(`| ${k} | ${rader.filter(r=>r.kl===k).length} |`);
// Prioriterte søk: tilfeller med forventet tema (f), uten soft/none/modus.
const pri=rader.filter(r=>(r.c.f||[]).length&&!r.c.soft&&!r.c.none&&!r.c.modus);
const rel=r=>r.topp3.some(x=>(r.c.f||[]).includes(x)||(r.c.ok||[]).includes(x));
const nr=pri.filter(rel).length,forst=pri.filter(r=>['RF','RFok'].includes(r.kl)).length;
p(`\nPrioriterte søk: ${pri.length}. Relevant svar eller valg blant de tre første: ${nr} (${(100*nr/pri.length).toFixed(1)} %). Direkte riktig førstesvar: ${forst} (${(100*forst/pri.length).toFixed(1)} %).`);
const wd=rader.filter(r=>r.kl==='WD');p(`Misvisende direkte svar (WD): ${wd.length}.`);
if(process.argv.includes('--detaljer')){
 p('\n| id | søk | forventet | modus | utfall | treff |\n|---|---|---|---|---|---|');
 for(const r of rader){if(['RF','RFok','CR','soft-dekket'].includes(r.kl))continue;
  p(`| ${r.c.id} | ${JSON.stringify(r.c.q.slice(0,40))} | ${r.c.modus||(r.c.none?'ingen':r.c.soft?'skjønn '+(r.c.also||[]):(r.c.f||[]).join('/'))} | ${r.mode} | ${r.kl} | ${[...r.hits,...r.sug.map(x=>'?'+x)].slice(0,4).join(', ')||'-'} |`);}
}
// Etterjusterte forventninger vises med opprinnelig forventning og resultat.
for(const r of rader)if(r.c.opprinnelig){const o={...r.c,...r.c.opprinnelig};delete o.f;delete o.ok;p(`\nOpprinnelig forventning for ${r.c.id} (${JSON.stringify(r.c.q)}): ${r.c.opprinnelig.begrunnelse} Resultat med opprinnelig forventning: ${klass(o,r.adapt)}. Resultat med justert forventning: ${r.kl}.`);}
console.log(ut.join('\n'));
if(process.argv.includes('--json'))fs.writeFileSync(path.join(__dirname,'resultat.json'),JSON.stringify(rader.map(r=>({id:r.c.id,q:r.c.q,mode:r.mode,kl:r.kl,topp3:r.topp3})),null,1));
