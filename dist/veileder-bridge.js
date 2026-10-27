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
// Arbeidsplanen og veilederkonteksten opprettes bare når brukeren klikker seg til «Spør om sparing».
// pagehide oppdaterer dem bare hvis de allerede finnes i fanen, slik at en senere retur ikke henter en utdatert plan.
// Brukere som aldri åpner veilederen, får ingenting lagret her. Se docs/personvern-lagring.md.
function carry({create=false}={}){try{const storage=window.sessionStorage;if(!create&&storage.getItem(C.KEY)===null&&storage.getItem(C.PLAN_KEY)===null)return;const started=!document.getElementById('workbench').hidden;if(!started&&storage.getItem(C.KEY)===null){C.clearPlan(storage);return;}C.write(storage,C.fromCalculator(s,started,C.read(storage)));if(started)C.writePlan(storage,s,mode,view);else C.clearPlan(storage);}catch{}}
// Delegert lytter: gjelder også lenker som legges til senere, som skrivebordsmenyen fra layout.js.
document.addEventListener('click',event=>{if(event.target.closest?.('a[href="spor.html"]'))carry({create:true});});
window.addEventListener('pagehide',()=>carry());
})();
