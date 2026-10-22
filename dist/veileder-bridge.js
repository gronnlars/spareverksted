/* Loaded after the calculator's journey script; s is the current calculator state. */
(function(){
'use strict';
function carry(){try{const storage=window.sessionStorage;SpareContext.write(storage,SpareContext.fromCalculator(s,!document.getElementById('workbench').hidden,SpareContext.read(storage)));}catch{}}
for(const link of document.querySelectorAll('a[href="spor.html"]'))link.addEventListener('click',carry);
window.addEventListener('pagehide',carry);
})();
