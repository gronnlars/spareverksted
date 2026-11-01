'use strict';
// Native details keep menus usable with keyboard, touch and without JavaScript.
const layoutMenus=[...document.querySelectorAll('.site-menu,.display-options')];
document.addEventListener('click',event=>{
 for(const menu of layoutMenus){
  if(!menu.contains(event.target))menu.open=false;
  else if(event.target.closest('button,a'))menu.open=false;
 }
 if(event.target.closest('#chooseGrowth,#chooseGoal'))document.getElementById('welcomeWizard').classList.add('journey-open');
});
document.addEventListener('keydown',event=>{
 if(event.key!=='Escape')return;
 for(const menu of layoutMenus)if(menu.open){menu.open=false;menu.querySelector('summary').focus();event.preventDefault();}
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

// CSP uten unsafe-inline: stiler som beregnes i JS settes via CSSOM fra data-attributter, aldri som innebygd style-attributt.
(function(){const apply=root=>{if(root.nodeType!==1)return;for(const el of [root,...root.querySelectorAll('[data-series],[data-width]')]){if(el.dataset&&el.dataset.series)el.style.setProperty('--series',el.dataset.series);if(el.dataset&&el.dataset.width)el.style.width=Math.min(100,Math.max(0,Number(el.dataset.width)||0))+'%';}};
const start=()=>{apply(document.body);new MutationObserver(list=>{for(const m of list)for(const n of m.addedNodes)apply(n);}).observe(document.body,{childList:true,subtree:true});};
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start):start();})();
