// Generert av scripts/svar.py. Rediger kilder/svar/, aldri denne filen.
(function(root){
'use strict';
const entries=[];
const table=typeof module!=='undefined'&&module.exports?require('./bsu-rates.js'):root.SpareBsuRates;
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
for(const e of entries){
 e.words=e.words.map(s=>new RegExp('(?<![a-zæøå0-9])'+escape(s)+'(?![a-zæøå0-9])','i'));
 for(const p of e.parts)if(p.table)p.table=table;
}
if(typeof module!=='undefined'&&module.exports)module.exports=entries;
else root.SpareSvarGenerert=entries;
})(typeof window!=='undefined'?window:globalThis);
