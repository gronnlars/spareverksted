/* Begrepsregister: én kilde for korte forklaringer av fagord.
   Prøveversjon på grenen claude/begrepsforklaring-prove. Tekstene er hentet fra eksisterende
   svar (q-kjopekraft, q-renters-rente) eller bygd på dem, og må godkjennes før publisering.

   Felt per begrep:
   - id:        fast nøkkel, brukes i markeringen <span data-begrep="id">
   - ord:       oppslagsordet slik det vises i overskriften
   - kort:      ett kort avsnitt, helst under 40 ord. Ingen råd, ingen produkter, ingen tilpasning.
   - svar:      (valgfritt) id til et svar i «Spør om sparing». «Les mer» vises bare når svaret er publisert.
   - kilder:    primærkilder for forklaringen
   - kontrollert: dato teksten sist ble kontrollert mot kildene
   Plass til senere: «lang» (fordypning) og «sok» (søkeord). Ikke lagt inn før de trengs. */
(function(root){
'use strict';
const ssb={title:'SSB: Hva er inflasjon?',url:'https://www.ssb.no/priser-og-prisindekser/konsumpriser/artikler/hva-er-inflasjon'};
const liste=[
 {id:'kjopekraft',ord:'Kjøpekraft',kort:'Kjøpekraft er hvor mye du kan kjøpe for pengene. Når prisene stiger, rekker det samme kronebeløpet til mindre.',svar:'q-kjopekraft',kilder:[ssb],kontrollert:'2026-10-24'},
 {id:'prisvekst',ord:'Prisvekst (inflasjon)',kort:'Prisvekst betyr at varer og tjenester blir dyrere over tid. Det kalles også inflasjon. Da kan de samme pengene kjøpe mindre enn før.',svar:'q-kjopekraft',kilder:[ssb],kontrollert:'2026-10-24'},
 {id:'dagens-kroner',ord:'Dagens kroner',kort:'Et beløp i dagens kroner viser hva et framtidig beløp kan kjøpe med prisene i dag. Det gjør det lettere å sammenligne beløp fra ulike år.',svar:'q-kjopekraft',kilder:[ssb],kontrollert:'2026-10-24'},
 {id:'renters-rente',ord:'Renters rente',kort:'Renters rente betyr at du får renter også på renter du har fått tidligere. Når rentene blir stående, kan også de gi nye renter.',svar:'q-renters-rente',kilder:[{title:'Skatteetaten: Skatte-ABC, renteinntekter',url:'https://www.skatteetaten.no/rettskilder/type/handboker/skatte-abc/gjeldende/r-10-renteinntekter/R-10.001/R-10.002/'},{title:'OpenStax: Exponential functions',url:'https://openstax.org/books/algebra-and-trigonometry-2e/pages/6-1-exponential-functions'}],kontrollert:'2026-10-25'}
];
const byId=new Map(liste.map(b=>[b.id,b]));
function kontroller(b){
 if(!b.id||!b.ord||!b.kort||!b.kontrollert||!b.kilder?.length)throw Error('Ufullstendig begrep: '+b.id);
 if(/[\u2013\u2014]|\.\.\./.test(b.kort))throw Error('Tankestrek eller tre prikker i '+b.id);
 if(b.kort.split(/\s+/).length>40)throw Error('For lang kortforklaring: '+b.id);
}
liste.forEach(kontroller);
const api={liste,hent:id=>byId.get(id)||null,kontroller};
if(typeof module==='object'&&module.exports)module.exports=api;else root.SpareBegreper=api;
})(typeof window!=='undefined'?window:globalThis);
