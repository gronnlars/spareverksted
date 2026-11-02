'use strict';
// Hovedmenyen er en vanlig, alltid synlig nav. Ingen nedtrekk som kan bli stående åpen.
document.addEventListener('click',event=>{
 if(event.target.closest('#chooseGrowth,#chooseGoal'))document.getElementById('welcomeWizard').classList.add('journey-open');
});
const liveSummary=document.getElementById('mobileSummary');
if(liveSummary){
 document.addEventListener('focusin',event=>{
  const editing=Boolean(event.target.closest('#basic,#mobileSummary'));
  liveSummary.classList.toggle('is-editing',editing);
  if(event.target.closest('#basic')&&matchMedia('(max-width:760px)').matches){
   const bounds=event.target.getBoundingClientRect(),summary=liveSummary.getBoundingClientRect();
   if(bounds.bottom>summary.top&&bounds.top<summary.bottom)event.target.scrollIntoView({block:'center',behavior:'instant'});
  }
 });
 document.addEventListener('focusout',event=>{if(!event.relatedTarget?.closest('#basic,#mobileSummary'))liveSummary.classList.remove('is-editing');});
 document.addEventListener('pointerdown',event=>{liveSummary.classList.toggle('is-editing',Boolean(event.target.closest('#basic,#mobileSummary')));});
}
// Fokus etter lukket dialog (WCAG 2.4.3). Knapper inne i et sammenleggbart panel kan være skjult når dialogen lukkes, så knappen som åpnet
// dialogen er skjult når dialogen lukkes, og nettleseren kan ikke gi den fokus. Da blir fokus stående i den lukkede
// dialogen. Vi sender fokus til knappen hvis den er synlig, ellers til overskriften på panelet den ligger i.
(function(){
 let opener=null;
 document.addEventListener('focusin',event=>{if(!event.target.closest('dialog'))opener=event.target;});
 for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('close',()=>setTimeout(()=>{
  const active=document.activeElement;
  if(active&&active!==document.body&&!dialog.contains(active))return;
  let target=opener&&document.contains(opener)?opener:null;
  const shown=e=>e&&(e.checkVisibility?e.checkVisibility():e.getClientRects().length>0);
  if(target&&!shown(target)){const menu=target.closest('details');target=menu?menu.querySelector('summary'):null;}
  if(shown(target))target.focus();
 }));
})();
// Lav synlig flate med tastatur (liggende mobil): når et tallfelt får fokus, vis ledeteksten og feltet øverst
// i det synlige området, så feltet ikke havner rett over tastaturet. Gjør ingenting når alt allerede synes.
(function(){
 const vv=window.visualViewport;if(!vv)return;
 let timer=0;
 function reveal(field){
  if(document.activeElement!==field)return;
  const label=field.closest('label')||field,top=vv.offsetTop,bottom=vv.offsetTop+vv.height;
  const a=label.getBoundingClientRect(),b=field.getBoundingClientRect();
  if(a.top>=top+4&&b.bottom<=bottom-8)return;
  window.scrollBy({top:a.top-top-8,behavior:'instant'});
 }
 document.addEventListener('focusin',event=>{
  const field=event.target;
  if(!field.matches('input[inputmode=decimal],input[type=text],input[type=number]'))return;
  if(innerHeight>500&&vv.height>500)return;
  clearTimeout(timer);timer=setTimeout(()=>reveal(field),350);
 });
 vv.addEventListener('resize',()=>{const field=document.activeElement;if(field&&field.matches&&field.matches('input')&&vv.height<=500){clearTimeout(timer);timer=setTimeout(()=>reveal(field),120);}});
})();
// Ingen autoutfylling på Spareverksted: nettleseren skal ikke foreslå kontakter, adresser eller tidligere svar.
(function(){const sel='input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden]),textarea,select';const off=root=>{if(root.matches&&root.matches(sel))root.setAttribute('autocomplete','off');root.querySelectorAll&&root.querySelectorAll(sel).forEach(el=>el.setAttribute('autocomplete','off'));};const start=()=>{off(document);new MutationObserver(list=>{for(const m of list)m.addedNodes.forEach(n=>{if(n.nodeType===1)off(n);});}).observe(document.body,{childList:true,subtree:true});};document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start):start();})();
