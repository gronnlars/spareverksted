/* Hvilke svar i «Spør om sparing» som er publisert. Vedtatt av Lars 29.10.2026.
   Én liste, brukt av veilederen og av «Les mer» i begrepsforklaringene. */
(function(root){
'use strict';
const ids=Object.freeze(['q-bsu-basics','q-aksjesparekonto','q-fondskonto']);
if(typeof module==='object'&&module.exports)module.exports=ids;else root.SparePubliserteSvar=ids;
})(typeof window!=='undefined'?window:globalThis);
