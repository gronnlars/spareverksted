/* Forklaring der ordet står. Prøveversjon.
   Markering i HTML eller generert tekst: <span data-begrep="kjopekraft">kjøpekraft</span>
   - Uten JavaScript eller uten støtte for popover forblir ordet vanlig tekst. Ingenting går tapt.
   - Med støtte blir ordet en knapp som åpner én felles boks (native popover: Esc og klikk utenfor lukker).
   - Boksen legger seg over innholdet og flytter ingenting (ingen layoutskift).
   - Fokus flyttes til boksen ved åpning og tilbake til ordet ved lukking.
   - «Les mer» vises bare når svaret i «Spør om sparing» er publisert. */
(function(){
'use strict';
const B=window.SpareBegreper;
if(!B||!HTMLElement.prototype.hasOwnProperty('popover'))return;
const publisert=new Set(window.SparePubliserteSvar||[]);
let boks,aktiv=null;
function lag(){
 boks=document.createElement('div');boks.id='begrepBoks';boks.className='begrep-boks';boks.setAttribute('popover','auto');
 boks.setAttribute('role','dialog');boks.setAttribute('aria-labelledby','begrepTittel');boks.tabIndex=-1;
 boks.innerHTML='<h2 id="begrepTittel" class="begrep-tittel"></h2><p class="begrep-tekst"></p><p class="begrep-videre"></p><button type="button" class="begrep-lukk">Lukk</button>';
 boks.querySelector('.begrep-lukk').addEventListener('click',()=>boks.hidePopover());
 boks.addEventListener('beforetoggle',e=>{
  if(e.newState==='closed'&&aktiv){aktiv.setAttribute('aria-expanded','false');const a=aktiv;aktiv=null;if(!document.activeElement||document.activeElement===document.body||boks.contains(document.activeElement))a.focus({preventScroll:true});}
 });
 document.body.append(boks);
}
function plasser(knapp){
 // Smal skjerm: fast nederst (styres i CSS). Bred skjerm: under ordet, innenfor vinduet.
 if(matchMedia('(max-width:640px)').matches){boks.style.removeProperty('top');boks.style.removeProperty('left');return;}
 const r=knapp.getBoundingClientRect(),w=boks.offsetWidth,h=boks.offsetHeight;
 const left=Math.min(Math.max(12,r.left),innerWidth-w-12);
 const top=r.bottom+8+h<=innerHeight-12?r.bottom+8:Math.max(12,r.top-8-h);
 boks.style.left=left+'px';boks.style.top=top+'px';
}
function vis(knapp){
 const b=B.hent(knapp.dataset.begrep);if(!b)return;
 if(!boks)lag();
 if(aktiv===knapp&&boks.matches(':popover-open')){boks.hidePopover();return;}
 if(boks.matches(':popover-open'))boks.hidePopover();
 boks.querySelector('.begrep-tittel').textContent=b.ord;
 boks.querySelector('.begrep-tekst').textContent=b.utdyping?b.definisjon+' '+b.utdyping:b.definisjon;
 const videre=boks.querySelector('.begrep-videre');videre.replaceChildren();
 if(b.svar&&publisert.has(b.svar)){const a=document.createElement('a');a.href='spor.html#svar='+encodeURIComponent(b.svar);a.textContent='Les mer om '+b.ord.toLocaleLowerCase('nb');videre.append(a);}
 const kilde=document.createElement('span');kilde.className='begrep-kilde';kilde.textContent='Kilde: ';
 b.kilder.forEach((k,i)=>{const a=document.createElement('a');a.href=k.url;a.textContent=k.title;a.target='_blank';a.rel='noopener noreferrer';if(i)kilde.append(', ');kilde.append(a);});
 videre.append(kilde);
 aktiv=knapp;knapp.setAttribute('aria-expanded','true');
 boks.showPopover();plasser(knapp);boks.focus({preventScroll:true});
}
function oppgrader(rot){
 for(const s of rot.querySelectorAll('span[data-begrep]')){
  if(!B.hent(s.dataset.begrep))continue;
  const k=document.createElement('button');k.type='button';k.className='begrep';k.dataset.begrep=s.dataset.begrep;
  k.setAttribute('aria-haspopup','dialog');k.setAttribute('aria-expanded','false');k.setAttribute('aria-controls','begrepBoks');
  k.textContent=s.textContent;k.addEventListener('click',()=>vis(k));s.replaceWith(k);
 }
}
oppgrader(document);
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1){if(n.matches('span[data-begrep]'))oppgrader(n.parentNode);else oppgrader(n);}}).observe(document.body,{childList:true,subtree:true});
addEventListener('resize',()=>{if(aktiv&&boks.matches(':popover-open'))plasser(aktiv);});
})();
