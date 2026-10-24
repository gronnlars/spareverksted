'use strict';
// Søket i PR #54 (interpret), slik UI-et bruker det: ids[0] vises, resten som «Andre temaer», ellers «Mente du» eller ærlig ingen treff.
module.exports=function(V){
 return {navn:'pr54',search(q){
  const r=V.interpret(q);
  if(r.ids.length)return {kind:r.applied.length?'corrected':'direct',first:r.ids[0],others:r.ids.slice(1),note:r.applied.map(a=>a.from+'→'+a.to).join(', ')};
  return {kind:r.suggestions.length?'dym':'none',first:null,others:[],note:r.suggestions.map(a=>a.from+'→'+a.to).join(', ')};
 }};
};
