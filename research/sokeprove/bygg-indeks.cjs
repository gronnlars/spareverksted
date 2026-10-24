'use strict';
// Bygger det avledte søkeunderlaget fra én autoritativ tekstkilde (dist/veileder-engine.js + veileder-knowledge.js) og registeret.
// Kjøres: node research/sokeprove/bygg-indeks.cjs [utfil]. Stopper hvis registeret har feil.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const ROOT=process.env.SPARE_ROOT||path.join(__dirname,'..','..');
function lesDokumenter(root=ROOT){
 for(const k of Object.keys(require.cache))if(k.includes('veileder-'))delete require.cache[k];
 const V=require(path.join(root,'dist/veileder-engine.js'));
 for(const e of require(path.join(root,'dist/veileder-knowledge.js')))V.register(e);
 const docs=V.topics.map(t=>({id:t.id,tittel:t.title,sporsmal:t.questions.slice(),form:t.entry&&t.entry.kind==='explainer'?'forklaring':/^q-.*(ask-zero|ips-ask)$/.test(t.id)?'sammenligning':t.category?'oppføring':'tema'}));
 return {docs,V};
}
function bygg(reg,docs){
 const {valider}=require('./valider-register.cjs');
 const v=valider(reg,docs);if(v.feil.length)throw Error('Registeret har feil:\n- '+v.feil.join('\n- '));
 const byDoc=new Map(docs.map(d=>[d.id,{...d,navn:[],produktnavn:[],begreper:[]}]));
 for(const b of reg.begreper.filter(b=>b.type==='definisjon')){const d=byDoc.get(b.dokument);d.navn.push(...b.navn);d.produktnavn.push(...b.produktnavn);d.begreper.push(b.id);}
 const begreper=reg.begreper.map(b=>({id:b.id,type:b.type,dokument:b.dokument||null,forslag:b.forslag||null,navn:[...b.navn,...(b.produktnavn||[])]}));
 const ut={versjon:1,dokumenter:[...byDoc.values()],begreper,sammenligninger:reg.sammenligninger||[]};
 ut.sjekksum=crypto.createHash('sha256').update(JSON.stringify([docs,reg])).digest('hex').slice(0,16);
 return ut;
}
module.exports={lesDokumenter,bygg};
if(require.main===module){
 const {docs}=lesDokumenter();
 const reg=JSON.parse(fs.readFileSync(path.join(__dirname,'register/begreper.json'),'utf8'));
 const ut=bygg(reg,docs),f=process.argv[2]||path.join(__dirname,'register/indeks.json');
 fs.writeFileSync(f,JSON.stringify(ut));console.log('skrev',f,fs.statSync(f).size,'byte, sjekksum',ut.sjekksum);
}
