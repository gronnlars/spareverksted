'use strict';
// Kandidaten: MiniSearch v7.2.0 (BM25, prefiks, uskarpt søk) pluss et tynt eget lag for det biblioteket ikke gjør:
// stoppord, sammensetning av naboord, ordstammer fra registeret, ombytting av to bokstaver, begrepsregisteret (hjemmedokument,
// sammenligninger), hensikt (sammenligning/definisjon), negasjon og klassifisering (direkte/«Mente du»/valg/ingen).
// Rå BM25-poeng brukes aldri som sikkerhet. Bare rekkefølge og forholdet mellom nr. 1 og nr. 2 brukes.
const MiniSearch=require('../lib/minisearch-7.2.0.min.cjs').default;
const fold=s=>String(s).toLocaleLowerCase('nb-NO').replace(/å/g,'a').replace(/ø/g,'o').replace(/æ/g,'ae');
const STOPP=new Set('hva er en et og eller jeg vil ikke ha på til om av for som med det de du meg mitt mine min kan bor hvordan hvor hvorfor betyr men bare skal blir bli har fra vs'.split(' ').map(fold));
// «ikke» og «eller» fjernes som søkeord, men leses som signaler nedenfor.
const delOrd=q=>fold(q).split(/[^a-z0-9]+/).filter(Boolean);
function lev(a,b){const d=Array.from({length:a.length+1},(_,i)=>[i,...Array(b.length).fill(0)]);for(let j=1;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length];}
const maxFuzzy=len=>len>=8?2:len>=5?1:0;

function lagMotor(indeks,opt={}){
 const o={stemmer:true,byttet:true,sammensatt:true,register:true,hensikt:true,negasjon:true,uskarp:true,...opt};
 const docs=indeks.dokumenter;
 const ms=new MiniSearch({
  fields:['tittel','sporsmal','navn','produkt'],idField:'id',
  tokenize:s=>s.split(/[^\p{L}\p{N}]+/u).filter(Boolean),
  processTerm:t=>{const f=fold(t);return STOPP.has(f)?null:f;},
  searchOptions:{boost:{navn:3,produkt:3,tittel:2,sporsmal:1},combineWith:'OR'}
 });
 ms.addAll(docs.map(d=>({id:d.id,tittel:d.tittel,sporsmal:d.sporsmal.join(' '),navn:d.navn.join(' '),produkt:d.produktnavn.join(' ')})));
 const termer=new Set();
 for(const d of docs)for(const t of delOrd([d.tittel,...d.sporsmal,...d.navn,...d.produktnavn].join(' ')))if(!STOPP.has(t))termer.add(t);
 const navnTermer=new Set();for(const d of docs)for(const t of delOrd([d.tittel,...d.navn,...d.produktnavn].join(' ')))if(!STOPP.has(t))navnTermer.add(t);
 const stammer=[...navnTermer].filter(t=>t.length>=4);
 const begreper=indeks.begreper.map(b=>({...b,deler:b.navn.map(n=>delOrd(n).filter(x=>!STOPP.has(x)))}));
 const form=new Map(docs.map(d=>[d.id,d.form]));
 const sammenl=indeks.sammenligninger;
 const sok=(term,fuz,prefiks)=>ms.search(term,{fuzzy:fuz?(t=>maxFuzzy(t.length)||false):false,prefix:prefiks?(t=>t.length>=4):false});

 function search(raw){
  const q=fold(String(raw||'').slice(0,600));
  const ord=[...new Set(delOrd(q))].slice(0,12);
  const innhold=ord.filter(w=>!STOPP.has(w));
  if(!innhold.length)return {kind:'none',first:null,others:[]};
  // Signaler
  const sammenligning=o.hensikt&&/\b(eller|vs|versus|forskjell\w*|sammenlign\w*)\b/.test(q);
  const definisjon=o.hensikt&&/\bhva (er|betyr|vil si)\b|\bforklar/.test(q);
  const negert=new Set();
  if(o.negasjon){const m=[...q.matchAll(/\b(ikke|uten|aldri|ingen)\b\s+([a-z0-9]+)(?:\s+([a-z0-9]+))?/g)];for(const x of m)for(const w of [x[2],x[3]])if(w)negert.add(w);}
  // Alternativer per ord: [{term, vekt, art}]; art: 'eksakt' | 'avledet' | 'uskarp'
  const alt=new Map();
  innhold.forEach((w,i)=>{
   const a=[{term:w,vekt:1,art:'eksakt'}];
   const kjent=termer.has(w);
   if(o.sammensatt){
    const n=innhold[i+1],n2=innhold[i+2];
    if(n&&w.length>=3&&n.length>=3&&termer.has(w+n))a.push({term:w+n,vekt:0.8,art:'avledet',deler:[w,n]});
    else if(n&&n2&&w.length>=3&&n.length>=3&&n2.length>=3&&termer.has(w+n+n2))a.push({term:w+n+n2,vekt:0.8,art:'avledet',deler:[w,n,n2]});
   }
   if(!kjent&&o.stemmer){
    const hode=stammer.filter(s=>w.startsWith(s)&&w!==s&&(w.length-s.length<=3||(s.length>=6&&w.length-s.length<=9))).sort((x,y)=>y.length-x.length)[0];
    const hale=stammer.filter(s=>w.endsWith(s)&&w!==s&&w.length-s.length<=8).sort((x,y)=>y.length-x.length)[0];
    if(hode)a.push({term:hode,vekt:0.7,art:'avledet'});
    if(hale&&hale!==hode)a.push({term:hale,vekt:0.6,art:'avledet'});
   }
   if(!kjent&&o.byttet&&w.length>=5){
    for(let k=0;k+1<w.length;k++){const v=w.slice(0,k)+w[k+1]+w[k]+w.slice(k+2);if(v!==w&&termer.has(v)){a.push({term:v,vekt:0.9,art:'uskarp',avstand:1});break;}}
   }
   alt.set(w,a);
  });
  const sammensattOrd=new Set();for(const a of alt.values())for(const x of a)if(x.deler)x.deler.forEach(d=>sammensattOrd.add(d));
  // Treff per dokument
  const doc=new Map(); // id -> {score, eksakt, avledet, uskarp, avstand, tokens:Set}
  const slaa=(id)=>{if(!doc.has(id))doc.set(id,{score:0,eksakt:0,avledet:0,uskarp:0,avstand:99,sterk:false,ord:new Set()});return doc.get(id);};
  let antallUskarpe=0;
  for(const [w,as] of alt){
   const perDoc=new Map();
   for(const x of as){
    const res=sok(x.term,x.art==='eksakt'&&o.uskarp&&!termer.has(x.term),true);
    for(const r of res){
     const treff=Object.keys(r.match);
     const ex=treff.includes(x.term);
     let art=x.art==='eksakt'?(ex?'eksakt':'uskarp'):x.art;
     let avstand=0;
     if(art==='uskarp'&&x.avstand)avstand=x.avstand;
     else if(art==='uskarp'){avstand=Math.min(...treff.map(t=>t.startsWith(x.term)?0:lev(x.term,t)));if(avstand===0)art='prefiks';else if(avstand>maxFuzzy(x.term.length)){continue;}}
     const v=r.score*x.vekt*(art==='uskarp'?0.8:art==='prefiks'?0.6:1);
     const sterk=Object.values(r.match).some(f=>f.some(x=>x!=='sporsmal'));
     const prev=perDoc.get(r.id);
     if(!prev||v>prev.v)perDoc.set(r.id,{v,art,avstand,sterk});
    }
   }
   for(const [id,p] of perDoc){
    const d=slaa(id);d.score+=p.v;d.ord.add(w);if(p.sterk)d.sterk=true;
    if(p.art==='eksakt'||p.art==='prefiks')d.eksakt++;else if(p.art==='avledet')d.avledet++;else{d.uskarp++;d.avstand=Math.min(d.avstand,p.avstand);}
   }
  }
  // Begrepsregister
  const ordSett=new Set([...innhold,...[...alt.values()].flat().filter(x=>x.deler).map(x=>x.term)]);
  const paa=[],neg=[],hub=[];
  if(o.register)for(const b of begreper){
   const treff=b.deler.some(del=>del.length&&del.every(x=>ordSett.has(x)));
   if(!treff)continue;
   const kun=b.deler.filter(del=>del.every(x=>ordSett.has(x)));
   const erNegert=kun.every(del=>del.every(x=>negert.has(x)));
   if(b.type==='samlebegrep'){hub.push(b);continue;}
   (erNegert?neg:paa).push(b);
  }
  if(!doc.size&&!hub.length)return {kind:'none',first:null,others:[]};
  const justert=new Map();
  for(const [id,d] of doc){
   let s=d.score;const f=form.get(id);
   if(o.register){
    if(paa.length===1&&!sammenligning&&paa[0].dokument===id)s*=2.2;
    if(paa.length>=2){
     for(const c of sammenl)if(c.dokument===id&&c.begreper.every(x=>paa.some(p=>p.id===x)))s*=2.5;
    }
    if(neg.some(n=>n.dokument===id)&&paa.length)s*=0.3;
   }
   if(o.hensikt){
    if(sammenligning&&f==='sammenligning')s*=1.5;
    if(sammenligning&&f==='forklaring')s*=0.6;
    if(definisjon&&!sammenligning&&f==='forklaring')s*=1.2;
   }
   justert.set(id,s);
  }
  let rang=[...justert].sort((a,b)=>b[1]-a[1]);
  // Samlebegrep: forslag, aldri direkte svar
  if(hub.length&&!paa.length){
   const ids=[...new Set([...hub.flatMap(h=>h.forslag),...rang.map(r=>r[0])])].slice(0,5);
   return {kind:'choices',first:null,others:ids,note:'samlebegrep'};
  }
  // To eller flere begreper uten felles sammenligning: vis hvert begreps hjemmedokument som valg
  if(paa.length>=2){
   const dekket=sammenl.some(c=>c.begreper.every(x=>paa.some(p=>p.id===x)));
   if(!dekket){
    const ids=[...new Set([...paa.map(p=>p.dokument),...rang.map(r=>r[0])])].slice(0,5);
    return {kind:'choices',first:null,others:ids,note:'flere begreper, ingen sammenligning'};
   }
  }
  // Bare negerte begreper: aldri direkte svar
  if(!paa.length&&neg.length)return {kind:'choices',first:null,others:rang.map(r=>r[0]).slice(0,4),note:'negert'};
  const [topId,topS]=rang[0];const andre=rang.slice(1).filter(r=>r[1]>=0.25*topS).map(r=>r[0]).slice(0,4);
  const top=doc.get(topId);
  const dekning=top.ord.size/innhold.length;
  if(!top.sterk&&dekning<0.6)return {kind:'none',first:null,others:[],note:'svakt treff bare i spørsmålstekst'};
  const tette=rang.filter(r=>r[1]>=0.7*topS).length;
  const harEvidens=top.eksakt+top.avledet>0;
  if(!harEvidens){
   const unik=!rang[1]||rang[1][1]<0.6*topS;
   if(unik&&top.avstand<=1)return {kind:'corrected',first:topId,others:andre};
   return {kind:'dym',first:null,others:rang.map(r=>r[0]).slice(0,3)};
  }
  if(tette>1)return {kind:'choices',first:null,others:rang.slice(0,4).map(r=>r[0]),note:'likt rangert'};
  return {kind:'direct',first:topId,others:andre};
 }
 return {navn:opt.navn||'ms-kandidat',search,antallTermer:termer.size};
}

// Naiv bruk: biblioteket nesten som levert. Ingen eget lag. Nr. 1 er svaret.
function naiv(indeks){
 const ms=new MiniSearch({fields:['tittel','sporsmal','navn','produkt'],idField:'id',processTerm:t=>fold(t),tokenize:s=>s.split(/[^\p{L}\p{N}]+/u).filter(Boolean),searchOptions:{boost:{navn:3,produkt:3,tittel:2},fuzzy:0.2,prefix:true,combineWith:'OR'}});
 ms.addAll(indeks.dokumenter.map(d=>({id:d.id,tittel:d.tittel,sporsmal:d.sporsmal.join(' '),navn:d.navn.join(' '),produkt:d.produktnavn.join(' ')})));
 return {navn:'ms-naiv',search(q){const r=ms.search(String(q||'').slice(0,600));return r.length?{kind:'direct',first:r[0].id,others:r.slice(1,5).map(x=>x.id)}:{kind:'none',first:null,others:[]};}};
}
module.exports={lagMotor,naiv,fold,MiniSearch};
