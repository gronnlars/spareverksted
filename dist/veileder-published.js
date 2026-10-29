/* Publiseringsutvalg vedtatt av Lars 29.10.2026. Andre svar er utkast. */
(function(root){
'use strict';
const V=root.SpareVeileder;
const ids=new Set(['q-bsu-basics','q-aksjesparekonto','q-fondskonto']);
const withheld=V.topics.filter(t=>!ids.has(t.id));
const clean=s=>String(s).toLocaleLowerCase('nb').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const oldQuestions=new Set(withheld.flatMap(t=>[t.title,...t.questions]).map(clean));
V.topics.splice(0,V.topics.length,...V.topics.filter(t=>ids.has(t.id)));
const search=V.search,answer=V.answer;
V.search=function(text){
 if(oldQuestions.has(clean(text)))return {mode:'none',hits:[],suggestions:[]};
 const r=search(text);
 r.hits=r.hits.filter(h=>ids.has(h.id));r.suggestions=r.suggestions.filter(h=>ids.has(h.id));
 if(!r.hits.length&&!r.suggestions.length)return {mode:'none',hits:[],suggestions:[]};
 return r;
};
V.findTopics=text=>V.search(text).hits.filter(h=>!['nearest','negated'].includes(h.kind)).map(h=>h.id);
V.answer=function(id,profile){if(!ids.has(id))throw Error('Dette svaret er tatt ut for gjennomgang.');return answer(id,profile);};
V.suggestions=(_profile,current)=>V.topics.filter(t=>t.id!==current).map(t=>({id:t.id,title:t.title}));
V.publishedOnly=true;V.publicationReady=true;
})(window);
