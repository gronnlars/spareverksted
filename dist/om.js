// Donation links and Vipps numbers also work without JavaScript.
(function(){
 'use strict';
 if(!navigator.clipboard?.writeText)return;
 const status=document.getElementById('copyStatus');
 document.querySelectorAll('[data-copy-vipps]').forEach(button=>{
  button.hidden=false;
  button.addEventListener('click',async()=>{
   const number=button.dataset.copyVipps;
   try{
    await navigator.clipboard.writeText(number);
    status.textContent='Vipps-nummer '+number+' er kopiert. Åpne Vipps og lim det inn i søket.';
   }catch{
    status.textContent='Kunne ikke kopiere. Søk på '+number+' i Vipps.';
   }
  });
 });
})();
