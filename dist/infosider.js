// Kun informasjonssidene: direkte kapittellenker, åpne alle og fullstendig utskrift.
// Åpne/lukke virker med nettleserens egne details/summary, også uten dette skriptet.
(()=>{
 'use strict';
 const chapters=[...document.querySelectorAll('details.info-chapter')];
 if(!chapters.length)return;
 const button=document.getElementById('infoToggleAll');
 const update=()=>{button.textContent=chapters.every(d=>d.open)?'Lukk alle kapitler':'Åpne alle kapitler';};
 if(button){
  button.parentElement.hidden=false;
  button.addEventListener('click',()=>{
   const open=!chapters.every(d=>d.open);
   chapters.forEach(d=>{d.open=open;});
   update();
  });
  chapters.forEach(d=>d.addEventListener('toggle',update));
 }
 function revealHash(){
  let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
  if(!id)return;
  const target=document.getElementById(id);
  if(!target)return;
  // Existing links can point to a section, its heading or a descendant.
  const own=target.matches('details')?target:target.querySelector(':scope > details.info-chapter');
  if(own)own.open=true;
  for(let parent=target.parentElement;parent;parent=parent.parentElement){
   if(parent.matches('details'))parent.open=true;
  }
  requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
 }
 revealHash();
 window.addEventListener('hashchange',revealHash);
 // Keep the reader's open/closed choices after printing or cancelling print.
 let closedForPrint=null;
 window.addEventListener('beforeprint',()=>{
  if(closedForPrint)return;
  closedForPrint=[...document.querySelectorAll('main details:not([open])')];
  closedForPrint.forEach(d=>{d.open=true;});
 });
 window.addEventListener('afterprint',()=>{
  if(!closedForPrint)return;
  closedForPrint.forEach(d=>{d.open=false;});
  closedForPrint=null;
  if(button)update();
 });
})();
