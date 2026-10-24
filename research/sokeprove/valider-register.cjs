'use strict';
// Validerer registeret mot dokumentene. Kjøres: node research/sokeprove/valider-register.cjs
// Retur: { feil:[], advarsler:[] }. Feil stopper indeksbyggingen.
const fs=require('fs'),path=require('path');
const fold=s=>String(s).toLocaleLowerCase('nb-NO').replace(/å/g,'a').replace(/ø/g,'o').replace(/æ/g,'ae').replace(/\s+/g,' ').trim();
function valider(reg,docs){
 const feil=[],adv=[];
 const docIds=new Set(docs.map(d=>d.id)),ids=new Set(),names=new Map();
 if(reg.versjon!==1)feil.push('versjon må være 1');
 if(!Array.isArray(reg.begreper))return {feil:['begreper mangler'],advarsler:adv};
 for(const b of reg.begreper){
  const w=`begrep ${b&&b.id}`;
  if(!b||typeof b.id!=='string'||!/^[a-z0-9-]+$/.test(b.id)){feil.push(w+': id mangler eller har ugyldige tegn');continue;}
  if(ids.has(b.id))feil.push(w+': id brukes to ganger');ids.add(b.id);
  if(!['definisjon','samlebegrep'].includes(b.type))feil.push(w+': ukjent type');
  if(!Array.isArray(b.navn)||!b.navn.length||b.navn.some(n=>typeof n!=='string'||!n.trim()))feil.push(w+': navn må være en ikke-tom liste med tekst');
  if(b.type==='definisjon'){
   if(!docIds.has(b.dokument))feil.push(w+': dokument «'+b.dokument+'» finnes ikke');
   if(!Array.isArray(b.produktnavn))feil.push(w+': produktnavn må være en liste');
   if(!Array.isArray(b.beslektet))feil.push(w+': beslektet må være en liste');
  }else{
   if(!Array.isArray(b.forslag)||!b.forslag.length)feil.push(w+': samlebegrep trenger forslag');
   else for(const f of b.forslag)if(!docIds.has(f))feil.push(w+': forslag «'+f+'» finnes ikke');
  }
  for(const n of [...(b.navn||[]),...(b.produktnavn||[])]){
   const k=fold(n);if(!names.has(k))names.set(k,new Set());names.get(k).add(b.id);
  }
 }
 for(const [k,set] of names)if(set.size>1)feil.push(`navnet «${k}» peker til flere begreper: ${[...set].join(', ')}`);
 const byId=new Map(reg.begreper.map(b=>[b.id,b]));
 for(const b of reg.begreper)for(const r of b.beslektet||[]){
  if(!byId.has(r.til))feil.push(`begrep ${b.id}: beslektet «${r.til}» finnes ikke`);
  else if(!['sammenlignes-med','relatert'].includes(r.relasjon))feil.push(`begrep ${b.id}: ukjent relasjon «${r.relasjon}»`);
 }
 for(const s of reg.sammenligninger||[]){
  if(!docIds.has(s.dokument))feil.push('sammenligning: dokument «'+s.dokument+'» finnes ikke');
  if(!Array.isArray(s.begreper)||s.begreper.length<2||s.begreper.some(x=>!byId.has(x)))feil.push('sammenligning '+s.dokument+': trenger minst to kjente begreper');
 }
 const homes=new Set(reg.begreper.filter(b=>b.type==='definisjon').map(b=>b.dokument));
 for(const d of docs)if(!homes.has(d.id)&&!(reg.sammenligninger||[]).some(s=>s.dokument===d.id))adv.push(`dokument ${d.id} har ikke noe begrep i registeret og kan bare finnes via tittel og spørsmål`);
 // Symmetri: en sammenligning bør følges av «sammenlignes-med» på begge sider.
 for(const s of reg.sammenligninger||[])for(const a of s.begreper)for(const b of s.begreper)if(a<b){
  const A=byId.get(a),B=byId.get(b);
  if(A&&B&&!(A.beslektet||[]).some(r=>r.til===b&&r.relasjon==='sammenlignes-med'))adv.push(`${a} mangler relasjonen «sammenlignes-med» ${b}`);
  if(A&&B&&!(B.beslektet||[]).some(r=>r.til===a&&r.relasjon==='sammenlignes-med'))adv.push(`${b} mangler relasjonen «sammenlignes-med» ${a}`);
 }
 return {feil,advarsler:adv};
}
module.exports={valider,fold};
if(require.main===module){
 const {docs}=require('./bygg-indeks.cjs').lesDokumenter();
 const reg=JSON.parse(fs.readFileSync(path.join(__dirname,'register/begreper.json'),'utf8'));
 const r=valider(reg,docs);console.log(JSON.stringify(r,null,1));process.exit(r.feil.length?1:0);
}
