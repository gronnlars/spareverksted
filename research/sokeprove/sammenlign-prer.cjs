'use strict';
// Kjører testsettene mot hver PR slik den står (egen kode og eget innhold), på tilfeller der alle forventede dokumenter finnes i alle grenene.
// Bruk: node sammenlign-prer.cjs main=<sti> p54=<sti> p52=<sti> [--sett utvikling|holdout|begge] [--detaljer]
const fs=require('fs'),path=require('path');
const {klass}=require('./klassifiser.cjs');
const arg=process.argv.slice(2);
const stier=Object.fromEntries(arg.filter(a=>a.includes('=')).map(a=>a.split('=')));
const sett=(arg.includes('--sett')?arg[arg.indexOf('--sett')+1]:'begge');
const motor={};
for(const [navn,rot] of Object.entries(stier)){
 const R=path.resolve(rot)+'/dist/';
 const V=require(R+'veileder-engine.js');for(const e of require(R+'veileder-knowledge.js'))V.register(e);
 const ids=new Set(V.topics.map(t=>t.id));
 let f;
 if(navn==='p52')f=q=>{const r=V.search(q);const hits=r.hits.map(h=>h.id),sug=r.suggestions.map(s=>s.id);
  if(r.mode==='answer')return {kind:'direct',first:hits[0],others:[...hits.slice(1),...sug]};
  if(r.mode==='choose')return {kind:'choices',first:null,others:[...hits,...sug]};
  if(r.mode==='suggest')return {kind:'dym',first:null,others:sug};
  return {kind:'none',first:null,others:[]};};
 else if(navn==='p54')f=q=>{const r=V.interpret(q);return r.ids.length?{kind:r.applied.length?'corrected':'direct',first:r.ids[0],others:r.ids.slice(1)}:{kind:r.suggestions.length?'dym':'none',first:null,others:[]};};
 else f=q=>{const ids2=V.findTopics(q);return ids2.length?{kind:'direct',first:ids2[0],others:ids2.slice(1)}:{kind:'none',first:null,others:[]};};
 motor[navn]={f,ids,topics:V.topics.length};
}
const filer=sett==='begge'?['utvikling','holdout']:[sett];
const alle=filer.flatMap(x=>JSON.parse(fs.readFileSync(path.join(__dirname,'testsett',x+'.json'),'utf8')).cases);
const brukt=alle.filter(c=>[...(c.f||[]),...(c.ok||[]),...(c.also||[])].every(id=>Object.values(motor).every(m=>m.ids.has(id))));
const sp=c=>c.repeat?c.q.repeat(c.repeat):c.q;
const navn=Object.keys(motor);
const rader=brukt.map(c=>({c,res:Object.fromEntries(navn.map(n=>{const r=motor[n].f(sp(c));return [n,{...r,k:klass(c,r)}];}))}));
console.log(`Tilfeller der alle forventede dokumenter finnes i alle grenene: ${brukt.length} av ${alle.length} (${filer.join('+')}). Utelatt: ${alle.length-brukt.length} tilfeller som krever innhold fra #53 (aksjesparekonto, fondskonto).\n`);
const K=['RF','RFok','RS','MISS','WD','CR','FS','soft-dekket','soft-mangler'];
console.log('| Utfall | '+navn.join(' | ')+' |\n|---|'+navn.map(()=>'---:').join('|')+'|');
for(const k of K)console.log(`| ${k} | `+navn.map(n=>rader.filter(r=>r.res[n].k===k).length).join(' | ')+' |');
if(arg.includes('--detaljer')){
 console.log('\n| id | søk | forventet | '+navn.join(' | ')+' |\n|---|---|---|'+navn.map(()=>'---').join('|')+'|');
 for(const r of rader){const c=r.c;if(navn.every(n=>['RF','RFok','CR','soft-dekket'].includes(r.res[n].k)))continue;
  console.log(`| ${c.id} | ${JSON.stringify(c.q.slice(0,40))} | ${c.none?'ingen':c.soft?'skjønn '+(c.also||[]):(c.f||[]).join('/')} | `+navn.map(n=>`${r.res[n].k}: ${r.res[n].first||'-'}/${r.res[n].kind}${r.res[n].others.length?' +'+r.res[n].others.slice(0,2):''}`).join(' | ')+' |');}
}
