/* Loaded after the calculator journey. Restore known context only for an ordinary return. */
(function(){
'use strict';
const C=SpareContext;
try{
 const storage=window.sessionStorage,shared=location.hash.length>1,context=C.read(storage),plan=shared?null:C.readPlan(storage);
 if(plan){
  // Tilbake fra «Spør om sparing» i samme fane: hele planen hentes tilbake og kontrolleres som en lagret plan.
  // Bare det brukeren selv har endret i veilederen, legges oppå.
  const patch=C.calculatorPatch(context,false,{onlyGuide:true,page:plan.state.activePage});
  const checked=E.sanitize({...plan.state,...patch});
  s=checked.state;mode=plan.mode;view={...view,...plan.view};
  if(s.ageKnown)s.ageGroup=ageGroupFor(s.userAge);
  basicsTouched=true;fill();render();setPage(s.activePage);currentHorizon();updateStartNote();
  if(checked.allReset)notice('Planen kunne ikke hentes tilbake fordi den hadde ugyldige tall. Du ser standardverdiene i stedet.',15000);
  else if(checked.rejected.length)notice('Disse feltene var ikke gyldige og er satt til standardverdi: '+quoted(checked.rejected)+'. Resten av planen er beholdt.',15000);
 }else{
  const patch=C.calculatorPatch(context,shared,{page:s.activePage});
  if(Object.keys(patch).length){Object.assign(s,patch);if(s.ageKnown)s.ageGroup=ageGroupFor(s.userAge);fill();render();currentHorizon();}
 }
}catch{}
function carry(){try{const storage=window.sessionStorage,started=!document.getElementById('workbench').hidden;C.write(storage,C.fromCalculator(s,started,C.read(storage)));if(started)C.writePlan(storage,s,mode,view);else C.clearPlan(storage);}catch{}}
for(const link of document.querySelectorAll('a[href="spor.html"]'))link.addEventListener('click',carry);
window.addEventListener('pagehide',carry);
})();
