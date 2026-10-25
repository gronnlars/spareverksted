// E-postadressene settes sammen først når brukeren trykker «Vis e-postadresse». De står ikke ferdig i HTML,
// attributter eller metadata. Dette gjør automatisk innhøsting litt mer arbeidskrevende, men er ikke sikker
// beskyttelse: bitene ligger i denne filen og kan settes sammen av alle som leser den.
// Ingen lagring, ingen nettverkskall, ingen eksterne tjenester. Kopiering skjer bare ved eget trykk.
(function(root){
 'use strict';
 const DOMAIN=['spareverksted','no'];
 const BOX={personvern:'personvern',generell:'post'};
 function address(kind){const box=BOX[kind];return box?box+String.fromCharCode(64)+DOMAIN.join('.'):'';}
 const api={address,kinds:Object.keys(BOX)};
 if(typeof module!=='undefined'&&module.exports){module.exports=api;return;}
 root.SpareKontakt=api;
 function setup(box){
  const kind=box.dataset.kontakt,show=box.querySelector('.kontakt-vis'),result=box.querySelector('.kontakt-resultat'),link=box.querySelector('.kontakt-lenke'),copy=box.querySelector('.kontakt-kopier'),status=box.querySelector('.kontakt-status');
  if(!show||!result||!link||!copy||!status||!address(kind))return;
  show.hidden=false;
  function reveal(on){
   if(on){const a=address(kind);link.textContent=a;link.setAttribute('href','mailto:'+a);result.hidden=false;}
   else{link.textContent='';link.removeAttribute('href');result.hidden=true;status.textContent='';}
   show.setAttribute('aria-expanded',String(on));
  }
  show.addEventListener('click',()=>reveal(result.hidden));
  copy.addEventListener('click',async()=>{
   const a=address(kind);
   try{
    if(!navigator.clipboard||!navigator.clipboard.writeText)throw Error('no clipboard');
    await navigator.clipboard.writeText(a);
    status.textContent='E-postadressen er kopiert.';
   }catch{
    // Utklippstavlen er blokkert eller mangler: marker adressen så brukeren kan kopiere selv. Fokus flyttes ikke.
    try{const range=document.createRange();range.selectNodeContents(link);const sel=getSelection();sel.removeAllRanges();sel.addRange(range);}catch{}
    status.textContent='Kunne ikke kopiere automatisk. Adressen er markert, så du kan kopiere den selv.';
   }
  });
 }
 document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-kontakt]').forEach(setup));
})(typeof window!=='undefined'?window:globalThis);
