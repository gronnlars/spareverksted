'use strict';
// Main destinations stay visible when the desktop has room for them.
const siteMenu=document.querySelector('.site-menu'),siteNav=siteMenu?.querySelector('.site-nav');
if(siteNav){const desktopNav=siteNav.cloneNode(true);desktopNav.classList.add('desktop-nav');siteMenu.before(desktopNav);}
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
