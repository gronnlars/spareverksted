/* Lokalt søk for «Spør om sparing». Ingen nettverkskall, ingen bibliotek og ingen KI.
   Kontrollerte regler:
   - Delte ord settes sammen bare når resultatet står i ordlisten (keys), ikke etter gjetning.
   - Treff uten æ, ø og å, og med aa, oe og ae, regnes som eksakte.
   - Tastefeil gir bare merkede forslag («Mente du ...?»), aldri et svar som om søket var sikkert.
   - Brede ord («lån», «skatt») gir forslag, ikke ett utvalgt svar.
   - Uavgjort mellom ulike temaer gir et valg, ikke et tilfeldig svar.
   - Et ukjent ord som ligger én endring fra et registrert ord, leses som tastefeil (forslag), selv om en regel
     treffer midt i ordet («fondkonto», «aksjesparekonot»). Ord som er registrert, eller bare er bøyd, påvirkes ikke.
   - Ord etter «ikke», «uten» og lignende brukes ikke til å velge treff. Står det bare negerte ord igjen, vises
     temaene som valg, ikke som svar på det brukeren ikke vil ha.
   - Ordlisten bygges én gang per innholdsversjon (config.version), ikke ved hvert søk. */
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
// Ordlisten bygges om bare når innholdet har endret versjon. Uten versjon bygges den hver gang (trygt for tester som endrer temaene direkte).
const cache={key:null,vocab:null};
const stats={vocabularyBuilds:0};
function vocabularyFor(topics,version){
 if(version===undefined){stats.vocabularyBuilds++;return vocabulary(topics);}
 const key=version+':'+topics.length;
 if(cache.key!==key){cache.vocab=vocabulary(topics);cache.key=key;stats.vocabularyBuilds++;}
 return cache.vocab;
}
const known=(word,vocab)=>stems(fold(word)).some(s=>vocab.has(s));
// Tastefeil: nærmeste registrerte ord(er). Samme regler for lengde og første bokstaver som ellers i søket.
function nearKeys(folded,vocab,maxDistance){
 let best=9;const found=[];
 for(const [key2,v] of vocab){
  if(key2.length<4)continue;
  const allowed=Math.min(maxDistance,key2.length>=9?2:1);
  for(const s of folded){
   if(s[0]!==key2[0])continue;
   if(key2.length<6&&(Math.abs(s.length-key2.length)>1||s.slice(0,2)!==key2.slice(0,2)))continue;
   const d=distance(s,key2);
   if(d<=allowed){if(d<best){best=d;found.length=0;}if(d===best)found.push(v);break;}
  }
 }
 return found;
}
const NEGATION=new Set(['ikke','uten','aldri','ingen','slipper']);
const BREAK=new Set(['men','og','eller','samt','bare']);
// Indekser (i rawTokens) for ordet som står under en negasjon: det første ordet med innhold etter «ikke» eller «uten».
// Bare ett ord, så «hvis jeg ikke får betalt regningene» fortsatt finner regningene.
function negatedIndexes(tokens){
 const out=new Set();
 tokens.forEach((tok,i)=>{
  if(!NEGATION.has(tok))return;
  let taken=0;
  for(let j=i+1;j<tokens.length&&taken<1;j++){
   if(BREAK.has(tokens[j])||NEGATION.has(tokens[j]))break;
   if(STOP.has(tokens[j]))continue;
   out.add(j);taken++;
  }
 });
 return out;
}
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
 const result={query:String(text??''),normalized:q,hits:[],suggestions:[],negated:[],mode:'none'};
 if(!q)return result;
 const familyOf=id=>{const t=topics.find(x=>x.id===id);return t.category||t.id;};
 const exact=topics.filter(t=>t.questions.some(x=>normalize(x)===q));
 const rawTokens=q.split(' ');
 const allGeneric=rawTokens.every(tok=>STOP.has(tok)||generic.has(tok)||tok.length<3);
 let hits=[];
 if(exact.length)hits=exact.map(t=>({id:t.id,score:100,kind:'question',via:''}));
 else{
  const vocab=vocabularyFor(topics,config.version);
  // Negerte ord og mistenkte tastefeil brukes ikke til å velge treff med regler.
  const negIdx=negatedIndexes(rawTokens);
  const negWords=[...negIdx].map(i=>rawTokens[i]);
  const suspect=new Set();
  rawTokens.forEach((tok,i)=>{
   if(negIdx.has(i)||tok.length<6||STOP.has(tok)||generic.has(tok)||/\d/.test(tok))return;
   // «kontoen» inneholder «oe»; sjekk både ordet slik det står og med aa/oe/ae lest som å/ø/æ.
   const forms=[tok,digraphs(tok)].map(f=>stems(fold(f)).map(fold));
   if(forms.some(f=>f.some(s=>vocab.has(s))))return;
   const near=forms.flatMap(f=>nearKeys(f,vocab,1));
   if(!near.length)return;
   // Regelen treffer midt i ordet. Hvis den peker til samme tema som tastefeilforslaget, er svaret det samme og treffet beholdes.
   // Peker den til et annet tema («fondkonto» til fond, men forslaget er fondskonto), leses ordet som tastefeil.
   const nearIds=new Set(near.flatMap(v=>[...v.ids]));
   const ruleIds=topics.filter(t=>t.words.some(re=>re.test(tok)||re.test(digraphs(tok)))).map(t=>t.id);
   if(ruleIds.some(id=>!nearIds.has(id)))suspect.add(i);
  });
  const tokens=rawTokens.filter((_,i)=>!negIdx.has(i)&&!suspect.has(i));
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
  const suspectWords=new Set([...suspect].map(i=>digraphs(rawTokens[i])));
  const words=join(rawTokens.filter((_,i)=>!negIdx.has(i)).map(tok=>digraphs(tok)),vocab).slice(0,12);
  for(const tok of words){
   if(tok.length<3||STOP.has(tok)||generic.has(tok))continue;
   if(!suspectWords.has(tok)&&topics.some(t=>t.words.some(re=>re.test(tok))))continue;
   const base=stems(tok);
   const key=base.find(s=>Object.hasOwn(broad,s));
   if(key){for(const id of broad[key])suggest(id,'related',key);continue;}
   const folded=base.map(fold);
   const exactTerm=folded.find(s=>vocab.has(s));
   if(exactTerm){const v=vocab.get(exactTerm);for(const id of v.ids){const t=topics.find(x=>x.id===id);if(t&&!hidden(t))bump(id,v.term);}continue;}
   if(tok.length<5)continue;
   const found=nearKeys(folded,vocab,2);
   for(const v of found)for(const id of v.ids)suggest(id,'typo',v.term);
  }
  hits=[...map.values()];
  result.suggestions=[...suggestions.values()].filter(s=>!map.has(s.id));
  // Temaer som bare treffes av negerte ord. De vises aldri som svar, bare som valg når det ikke finnes annet.
  const negHits=[];
  for(const w of negWords){
   const forms=[w,digraphs(w)],ex=stems(fold(digraphs(w))).map(fold).find(s=>vocab.has(s));
   for(const t of topics){
    if(negHits.some(h=>h.id===t.id))continue;
    let via=null;
    for(const re of t.words)for(const v of forms){const m=re.exec(v);if(m){via=m[0];break;}if(via)break;}
    if(!via&&ex&&vocab.get(ex).ids.has(t.id))via=vocab.get(ex).term;
    if(via)negHits.push({id:t.id,score:1,kind:'negated',via:clip(via),word:w});
   }
  }
  // Brukeren får bare beskjed om negasjonen når den faktisk er brukt til å holde et tema unna.
  result.negated=negWords.filter(w=>negHits.some(h=>h.word===w));
  if(!hits.length&&!result.suggestions.length&&negHits.length){
   const specific0=id=>topics.find(t=>t.id===id).entry?0:1;
   negHits.sort((a,b2)=>specific0(a.id)-specific0(b2.id));
   result.hits=negHits;result.mode='negated';return result;
  }
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
 if(item.kind==='negated')return 'Nevner «'+item.via+'», men er ikke svar på det du ikke vil ha';
 return item.via?'Treff på «'+item.via+'»':'Treff på søket ditt';
}
const api={search,reason,normalize,distance,fold,stats};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SpareSearch=api;
})(typeof window!=='undefined'?window:globalThis);
