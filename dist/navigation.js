// In-page navigation preserves the plan and never opens the screen keyboard.
(function(){
 'use strict';
 const get=id=>document.getElementById(id),hero=get('savingsResult'),jump=get('mobileResultButton');
 function go(target){
  if(!target)return;
  target.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  target.focus({preventScroll:true});
 }
 function fields(){return get(s.activePage==='dreams'?'dreamInputs':s.activePage==='withdrawals'?'withdrawInputs':'planInputs');}
 function syncJump(){
  const above=hero.getBoundingClientRect().bottom<=0;
  const text=above?'Endre tall ↑':'Se resultat ↓';
  if(jump.textContent!==text)jump.textContent=text;
  jump.setAttribute('aria-controls',above?'planInputs':'savingsResult');
 }
 jump.onclick=()=>{if(hero.getBoundingClientRect().bottom<=0)go(fields());else if(!blockIfInvalid('Rett feltet før du ser resultatet.'))go(hero);};
 // Keep an incomplete field focused until click validation. Otherwise its blur error can move
 // the button between pointerdown and pointerup in Firefox. The action still waits for click,
 // so dragging away cancels it and keyboard activation keeps its normal behavior.
 document.addEventListener('pointerdown',event=>{
  if(event.target.closest('[data-show-result],#mobileResultButton')&&pendingKey())event.preventDefault();
 });
 get('seeGraph').onclick=()=>{get('graphTab').click();go(get('chartPanel'));};
 // A completed mobile start guide leads to the result, rather than asking users to pass their inputs again.
 function showCompletedPlan(){
  if(wizardActive||!matchMedia('(max-width:760px)').matches)return;
  const target=s.activePage==='dreams'?get('dreamSummary'):hero;
  if(target&&!target.hasAttribute('tabindex'))target.tabIndex=-1;
  go(target);
 }
 get('journeyForm').addEventListener('submit',showCompletedPlan);
 get('exampleJourney').addEventListener('click',showCompletedPlan);
 document.addEventListener('click',event=>{
  if(event.target.closest('[data-edit-fields]'))go(fields());
  if(event.target.closest('[data-show-result]')&&!blockIfInvalid('Rett feltet før du ser resultatet.'))go(hero);
  const link=event.target.closest('.site-header a[href="index.html"]');
  if(link&&link.id!=='brandHome'&&!wizardActive){event.preventDefault();setPage('calculator');go(fields());}
 });
 get('plansMenu').onclick=()=>{get('savedDetails').open=true;go(get('savedHeading'));};
 let scheduled=false;
 function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;syncJump();});}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
 new ResizeObserver(schedule).observe(document.querySelector('.results'));
 // A heading receives focus, leaving the current input value and keyboard alone.
 for(const id of ['dreamInputs','withdrawInputs']){
  const panel=get(id),button=document.createElement('button');button.type='button';button.className='text-link return-fields';button.dataset.editFields='';button.textContent='Endre tall ↑';
  const result=panel.parentElement.lastElementChild;result.append(button);
 }
 syncJump();
})();
