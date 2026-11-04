// Felles utskriftsflyt for kalkulatorrapportene. Et åpent modalt vindu gjør resten av siden inert.
// Lukk derfor vinduet mens PDF-en lages, og gjenopprett tittel, vindu og fokus etterpå.
(function(root){
'use strict';
function attach(){
 const dialog=document.getElementById('reportDialog'),content=document.getElementById('printReportContent'),button=document.getElementById('printReport');
 const status=document.createElement('p');status.id='report-print-status';status.hidden=true;status.setAttribute('role','status');button.after(status);
 let restore=null;
 function message(text){status.textContent=text;status.hidden=!text;}
 function prepare(){
  const title=content.querySelector('h1')?.textContent.trim()||'Rapport';
  const attempt={title:document.title,started:false};restore=attempt;message('');
  document.title=title+', Spareverksted, '+new Date().toLocaleDateString('nb-NO',{year:'numeric',month:'long',day:'numeric'});
  dialog.close();return attempt;
 }
 function finish(attempt,text=''){if(restore!==attempt)return;document.title=attempt.title;restore=null;if(!dialog.open)dialog.showModal();message(text);button.focus({preventScroll:true});}
 function completed(){if(!restore)return;const attempt=restore;setTimeout(()=>finish(attempt),0);}
 button.onclick=()=>{
  if(restore)return;
  const attempt=prepare();
  try{window.print();}catch{finish(attempt,'Nettleseren kunne ikke åpne utskrift. Bruk nettleserens meny for å skrive ut eller lagre PDF.');return;}
  // Et ignorert kall sender ingen utskriftshendelser. Da skal også berøringsbrukere få rapporten tilbake.
  // Når utskrift faktisk har startet, venter vi på avslutningen, så PDF-kopien ikke blir inert for tidlig.
  setTimeout(()=>{if(!attempt.started)finish(attempt,'Hvis utskriftsvinduet ikke åpnet seg, bruk nettleserens meny for å skrive ut eller lagre PDF.');},0);
 };
 document.getElementById('closeReport').onclick=()=>dialog.close();
 window.addEventListener('beforeprint',()=>{
  // Nettleserens meny er en reservevei når utskriftsknappen er sperret. Behold rapporten som allerede vises,
  // også ved valgte planer, og fjern modaliteten før nettleseren lager PDF-ens tilgjengelighetstre.
  if(!restore&&dialog.open)prepare();
  if(restore)restore.started=true;
 });
 window.addEventListener('afterprint',completed);
 const printMedia=window.matchMedia('print');
 printMedia.addEventListener('change',event=>{if(!restore)return;if(event.matches)restore.started=true;else if(restore.started)completed();});
 return {active:()=>restore!==null};
}
root.ReportPrint={attach};
})(window);
