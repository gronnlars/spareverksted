// Felles utskriftsflyt for kalkulatorrapportene. Et åpent modalt vindu gjør resten av siden inert.
// Lukk derfor vinduet mens PDF-en lages, og gjenopprett tittel, vindu og fokus etterpå.
(function(root){
'use strict';
function attach(){
 const dialog=document.getElementById('reportDialog'),content=document.getElementById('printReportContent'),button=document.getElementById('printReport');
 let restore=null;
 function finish(){if(!restore)return;document.title=restore.title;restore=null;if(!dialog.open)dialog.showModal();button.focus();}
 button.onclick=()=>{
  const title=content.querySelector('h1')?.textContent.trim()||'Rapport';
  restore={title:document.title};
  document.title=title+', Spareverksted, '+new Date().toLocaleDateString('nb-NO',{year:'numeric',month:'long',day:'numeric'});
  dialog.close();window.print();if(!matchMedia('(hover: none)').matches)setTimeout(finish,0);
 };
 document.getElementById('closeReport').onclick=()=>dialog.close();
 window.addEventListener('afterprint',()=>setTimeout(finish,0));
 return {active:()=>restore!==null};
}
root.ReportPrint={attach};
})(window);
