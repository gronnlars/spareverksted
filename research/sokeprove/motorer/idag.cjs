'use strict';
// «Dagens» søk: findTopics fra main (commit før #54), kopiert uendret i logikk: eksakt spørsmål, ellers regex-score over hele teksten.
// Innholdet (topics) er det samme som for de andre motorene.
module.exports=function(V){
 const normalize=value=>String(value||'').toLocaleLowerCase('nb-NO').slice(0,600).trim().replace(/[?!.]+$/,'').replace(/\s+/g,' ');
 function findTopics(text){
  const q=normalize(text);if(!q.trim())return [];
  const exact=V.topics.filter(t=>t.questions.some(x=>normalize(x)===q)).map(t=>t.id);
  if(exact.length)return exact;
  return V.topics.map(t=>({id:t.id,score:t.words.reduce((n,re)=>n+(re.test(q)?1:0),0)})).filter(t=>t.score>0).sort((a,b)=>b.score-a.score).map(t=>t.id);
 }
 return {navn:'idag',search(q){const ids=findTopics(q);return ids.length?{kind:'direct',first:ids[0],others:ids.slice(1)}:{kind:'none',first:null,others:[]};}};
};
