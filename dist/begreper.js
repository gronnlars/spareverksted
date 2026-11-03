// Generert av scripts/fakta.py fra kilder/begreper/*.json. Rediger registeret, ikke denne filen.
/* Begrepsregister: én kilde for korte forklaringer av fagord.
   Felt per begrep:
   - id:        fast nøkkel. Brukes i markeringen <span data-begrep="id"> og i tekst som {{begrep:id}}
   - ord:       oppslagsordet slik det vises i overskriften
   - definisjon: ordbok-setningen. Én setning som starter med ordet og sier hva det er eller betyr.
                Reglene står i SPRAKREGLER.md, «Ordbok-setningen».
   - utdyping:  (valgfritt) én kort setning om hvorfor ordet betyr noe. I tekst: {{begrep:id.utdyping}}
   - svar:      (valgfritt) id til et svar i «Spør om sparing». Svaret henter definisjonen med {{begrep:id}}
                (testes). «Les mer» vises bare når svaret er publisert.
   - kilder:    primærkilder for forklaringen
   - kontrollert: dato teksten sist ble kontrollert mot kildene */
(function(root){
'use strict';
const liste=[{"id":"kjopekraft","ord":"Kjøpekraft","definisjon":"Kjøpekraft er hvor mye du kan kjøpe for pengene.","utdyping":"Når prisene stiger, rekker det samme kronebeløpet til mindre.","svar":"q-kjopekraft","kilder":[{"title":"SSB: Hva er inflasjon?","url":"https://www.ssb.no/priser-og-prisindekser/konsumpriser/artikler/hva-er-inflasjon"}],"kontrollert":"2026-10-24"},{"id":"prisvekst","ord":"Prisvekst (inflasjon)","definisjon":"Prisvekst er at prisene på varer og tjenester stiger over tid.","utdyping":"Det kalles også inflasjon. Da kan de samme pengene kjøpe mindre enn før.","kilder":[{"title":"SSB: Hva er inflasjon?","url":"https://www.ssb.no/priser-og-prisindekser/konsumpriser/artikler/hva-er-inflasjon"}],"kontrollert":"2026-11-02"},{"id":"dagens-kroner","ord":"Dagens kroner","definisjon":"Dagens kroner er et framtidig beløp regnet om til hva det kan kjøpe med prisene i dag.","utdyping":"Det gjør det lettere å sammenligne beløp fra ulike år.","kilder":[{"title":"SSB: Hva er inflasjon?","url":"https://www.ssb.no/priser-og-prisindekser/konsumpriser/artikler/hva-er-inflasjon"}],"kontrollert":"2026-11-02"},{"id":"renters-rente","ord":"Renters rente","definisjon":"Renters rente betyr at du får renter også på renter du har fått tidligere.","utdyping":"Når rentene blir stående, kan også de gi nye renter.","svar":"q-renters-rente","kilder":[{"title":"Skatteetaten: Skatte-ABC, renteinntekter","url":"https://www.skatteetaten.no/rettskilder/type/handboker/skatte-abc/gjeldende/r-10-renteinntekter/R-10.001/R-10.002/"},{"title":"OpenStax: Exponential functions","url":"https://openstax.org/books/algebra-and-trigonometry-2e/pages/6-1-exponential-functions"}],"kontrollert":"2026-10-25"}];
const byId=new Map(liste.map(b=>[b.id,b]));
function ord(t){return t.trim().split(/\s+/).length;}
// Ordbokreglene står i SPRAKREGLER.md, «Ordbok-setningen». Det som kan sjekkes maskinelt, sjekkes her.
function kontroller(b){
 if(!b.id||!b.ord||!b.definisjon||!b.kontrollert||!b.kilder?.length)throw Error('Ufullstendig begrep: '+b.id);
 const d=b.definisjon,hode=b.ord.replace(/\s*\(.*\)$/,'');
 if(!d.toLocaleLowerCase('nb').startsWith(hode.toLocaleLowerCase('nb')+' '))throw Error('Definisjonen må starte med ordet: '+b.id);
 if(!/^\S+(?:\s\S+)*?\s(?:er|betyr)\s/.test(d))throw Error('Definisjonen må si hva ordet er eller betyr: '+b.id);
 if((d.match(/[.!?]/g)||[]).length!==1||!d.endsWith('.'))throw Error('Definisjonen skal være én setning: '+b.id);
 if(ord(d)>25)throw Error('Definisjonen er over 25 ord: '+b.id);
 if(b.utdyping&&ord(b.utdyping)>25)throw Error('Utdypingen er over 25 ord: '+b.id);
 const alt=d+' '+(b.utdyping||'');
 if(/[\u2013\u2014]|\.\.\./.test(alt))throw Error('Tankestrek eller tre prikker i '+b.id);
 if(/\b(?:du bør|bør du|anbefal|lønner seg)/i.test(alt))throw Error('Råd hører ikke hjemme i en definisjon: '+b.id);
 if(/\d/.test(d))throw Error('Ingen tall i definisjonen: '+b.id);
}
liste.forEach(kontroller);
const api={liste,hent:id=>byId.get(id)||null,kontroller};
if(typeof module==='object'&&module.exports)module.exports=api;else root.SpareBegreper=api;
})(typeof window!=='undefined'?window:globalThis);
