/* Loaded after the calculator journey. Restore known context only for an ordinary return. */
(function(){
'use strict';
try{
 const patch=SpareContext.calculatorPatch(SpareContext.read(window.sessionStorage),location.hash.length>1);
 if(Object.keys(patch).length){Object.assign(s,patch);if(s.ageKnown)s.ageGroup=ageGroupFor(s.userAge);fill();render();currentHorizon();}
}catch{}
function carry(){try{const storage=window.sessionStorage;SpareContext.write(storage,SpareContext.fromCalculator(s,!document.getElementById('workbench').hidden,SpareContext.read(storage)));}catch{}}
for(const link of document.querySelectorAll('a[href="spor.html"]'))link.addEventListener('click',carry);
window.addEventListener('pagehide',carry);
})();
