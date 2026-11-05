/* Read the existing public selection and resolve the same fact placeholders as the UI.
   Only editorial text fields, never search keys, regexes or unpublished answers. */
'use strict';
const path=require('node:path');
const root=path.resolve(process.argv[2]);
const F=require(path.join(root,'dist/veileder-facts.js'));
const K=require(path.join(root,'dist/veileder-knowledge.js'));
const ids=require(path.join(root,'dist/publiserte-svar.js'));
const rows=[];
const fields=new Set(['intro','caveat','text','neutral']);
const containers=new Set(['parts','example','tradeoffs','pros','cons','options','terms']);
for(const id of ids){
 const raw=K.find(e=>e.id===id);
 if(!raw)throw Error('Publisert svar mangler: '+id);
 function visit(value,pointer){
  if(Array.isArray(value)){value.forEach((v,i)=>visit(v,pointer+'/'+i));return;}
  if(!value||typeof value!=='object')return;
  for(const [key,v] of Object.entries(value)){
   if(fields.has(key)&&typeof v==='string'&&v.trim())rows.push({id,title:raw.title,pointer:pointer+'/'+key,raw:v,text:F.expand(v)});
   if(containers.has(key))visit(v,pointer+'/'+key);
  }
 }
 visit(raw,'');
}
process.stdout.write(JSON.stringify(rows));
