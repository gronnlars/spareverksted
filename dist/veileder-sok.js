/* Lokalt søk for «Spør om sparing». Ingen nettverkskall, ingen bibliotek og ingen KI.
   Kontrollerte regler:
   - Delte ord settes sammen bare når resultatet står i ordlisten (keys), ikke etter gjetning.
   - Treff uten æ, ø og å, og med aa, oe og ae, regnes som eksakte.
   - Tastefeil gir bare merkede forslag («Mente du ...?»), aldri et svar som om søket var sikkert.
   - Brede ord («lån», «skatt») gir forslag, ikke ett utvalgt svar.
   - Uavgjort mellom ulike temaer gir et valg, ikke et tilfeldig svar. */
(function(root){
'use strict';
const SUFFIXES=['ene','et','en','er','a','e','s'];
const STOP=new Set('hva hvordan hvor hvorfor hvilken hvilket hvilke når bør skal kan må vil jeg vi du meg mitt mine min vår våre er var det den de en ei et til på av for om med og eller som har ha ikke mye mange noe noen blir bli gjør gjøre får få bare også så ved fra etter før under over mellom uten hos inn ut opp ned sammen lurt best bedre mer mindre mest minst vet'.split(' '));
const fold=s=>s.replace(/å/g,'a').replace(/ø/g,'o').replace(/æ/g,'e');
const digraphs=s=>s.replace(/aa/g,'å').replace(/oe/g,'ø').replace(/ae/g,'æ');
function normalize(text){
 return String(text??'').toLocaleLowerCase('nb-NO').slice(0,600).replace(/[‐-―−-]+/g,' ').replace(/[?!.,;:()«»"']+/g,' ').replace(/\s+/g,' ').trim();
}
// Damerau-Levenshtein (optimal string alignment): bytte om to nabobokstaver teller som én feil.
function distance(a,b){
 const n=a.length,m=b.length;if(Math.abs(n-m)>2)return 9;
 const d=Array.from({length:n+1},(_,i)=>{const row=new Array(m+1).fill(0);row[0]=i;return row;});
 for(let j=1;j<=m;j++)d[0][j]=j;
 for(let i=1;i<=n;i++)for(let j=1;j<=m;j++){
  d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1);
 }
 return d[n][m];
}
function stems(token){const out=[token];for(const s of SUFFIXES)if(token.length>s.length+3&&token.endsWith(s))out.push(token.slice(0,-s.length));return out;}
// Ordlisten: sammenslått og uten æøå, med hvilke temaer som eier ordet.
function vocabulary(topics){
 const vocab=new Map();
 for(const t of topics)for(const term of t.keys||[]){
  const key=fold(term);if(!vocab.has(key))vocab.set(key,{term,ids:new Set()});vocab.get(key).ids.add(t.id);
 }
 return vocab;
}
const known=(word,vocab)=>stems(fold(word)).some(s=>vocab.has(s));
function join(tokens,vocab){
 const out=[];
 for(let i=0;i<tokens.length;i++){
  const a=tokens[i],b=tokens[i+1];let joined=null;
  if(b&&a.length>=3&&b.length>=2)for(const link of ['','s']){const candidate=a+link+b;if(known(candidate,vocab)&&!known(a,vocab)){joined=candidate;break;}}
  if(joined){out.push(joined);i++;}else out.push(a);
 }
 return out;
}
const clip=s=>s.length>40?s.slice(0,40):s;
function search(text,topics,config={}){
 const broad=config.broad||{},generic=new Set(config.generic||[]);
 const q=normalize(text);
 const result={query:String(text??''),normalized:q,hits:[],suggestions:[],mode:'none'};
 if(!q)return result;
 const familyOf=id=>{const t=topics.find(x=>x.id===id);return t.category||t.id;};
 const exact=topics.filter(t=>t.questions.some(x=>normalize(x)===q));
 const rawTokens=q.split(' ');
 const allGeneric=rawTokens.every(tok=>STOP.has(tok)||generic.has(tok)||tok.length<3);
 let hits=[];
 if(exact.length)hits=exact.map(t=>({id:t.id,score:100,kind:'question',via:''}));
 else{
  const vocab=vocabulary(topics);
  const tokens=rawTokens;
  const joined=join(tokens,vocab).join(' ');
  // Ord som er satt sammen erstatter de delte ordene, så de ikke teller to ganger.
  const variants=[...new Set([joined,digraphs(joined)])];
  const map=new Map();
  const bump=(id,via)=>{const h=map.get(id)||{id,score:0,kind:'match',via:''};h.score++;if(via&&(!h.via||via.length<h.via.length))h.via=clip(via);map.set(id,h);};
  const hidden=t=>(t.not||[]).some(re=>variants.some(v=>re.test(v)));
  for(const t of topics){
   if(hidden(t))continue;
   for(const re of t.words)for(const v of variants){const m=re.exec(v);if(m){bump(t.id,m[0].trim());break;}}
  }
  // Ord uten regeltreff: ordliste uten æøå, brede ord og tastefeil.
  const suggestions=new Map();
  const suggest=(id,kind,via)=>{if(map.has(id)||suggestions.has(id))return;const t=topics.find(x=>x.id===id);if(!t||hidden(t))return;suggestions.set(id,{id,kind,via:clip(via)});};
  const words=join(tokens.map(tok=>digraphs(tok)),vocab).slice(0,12);
  for(const tok of words){
   if(tok.length<3||STOP.has(tok)||generic.has(tok))continue;
   if(topics.some(t=>t.words.some(re=>re.test(tok))))continue;
   const base=stems(tok);
   const key=base.find(s=>Object.hasOwn(broad,s));
   if(key){for(const id of broad[key])suggest(id,'related',key);continue;}
   const folded=base.map(fold);
   const exactTerm=folded.find(s=>vocab.has(s));
   if(exactTerm){const v=vocab.get(exactTerm);for(const id of v.ids){const t=topics.find(x=>x.id===id);if(t&&!hidden(t))bump(id,v.term);}continue;}
   if(tok.length<5)continue;
   let best=9;const found=[];
   for(const [key2,v] of vocab){
    if(key2.length<4)continue;
    const allowed=key2.length>=9?2:1;
    for(const s of folded){
     if(s[0]!==key2[0])continue;
     // Korte ord gir lettere falske treff: krev lik lengde (pluss minus én) og samme to første bokstaver.
     if(key2.length<6&&(Math.abs(s.length-key2.length)>1||s.slice(0,2)!==key2.slice(0,2)))continue;
     const d=distance(s,key2);
     if(d<=allowed){if(d<best){best=d;found.length=0;}if(d===best)found.push(v);break;}
    }
   }
   for(const v of found)for(const id of v.ids)suggest(id,'typo',v.term);
  }
  hits=[...map.values()];
  result.suggestions=[...suggestions.values()].filter(s=>!map.has(s.id));
 }
 const specific=id=>topics.find(t=>t.id===id).entry?0:1;
 const order=new Map(topics.map((t,i)=>[t.id,i]));
 hits.sort((a,b)=>b.score-a.score||specific(a.id)-specific(b.id)||order.get(a.id)-order.get(b.id));
 result.hits=hits;
 if(hits.length){
  const top=hits[0];
  const rival=hits.find(h=>h.score===top.score&&familyOf(h.id)!==familyOf(top.id));
  result.mode=rival?'choose':'answer';
 }else if(result.suggestions.length)result.mode='suggest';
 else result.mode=allGeneric?'broad':'none';
 return result;
}
// Kort begrunnelse som vises til brukeren under hvert treff.
function reason(item){
 if(item.kind==='question')return 'Samme spørsmål som i svaret';
 if(item.kind==='related')return 'Ordet «'+item.via+'» kan høre til her';
 if(item.kind==='typo')return 'Mente du «'+item.via+'»?';
 return item.via?'Treff på «'+item.via+'»':'Treff på søket ditt';
}
const api={search,reason,normalize,distance,fold};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SpareSearch=api;
})(typeof window!=='undefined'?window:globalThis);
