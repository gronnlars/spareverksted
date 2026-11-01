// Sletter bare Spareverksteds egne nøkler. Andre nettsteders data og andre nøkler på samme domene røres ikke.
(function(root){
 'use strict';
 const LOCAL=['sv-scenarios','sv-level','sv-color-theme','sv-started'];// sv-level og sv-color-theme ligger nå i sessionStorage; de gamle localStorage-nøklene ryddes også
 const SESSION=['sv-working-plan-v1','sv-guidance-tab-v2','sv-started','sv-level','sv-color-theme'];
 function planCount(local){try{const d=JSON.parse(local.getItem('sv-scenarios')||'[]');return Array.isArray(d)?d.length:0;}catch{return 0;}}
 function stored(local,session){const found=[];for(const k of LOCAL)try{if(local&&local.getItem(k)!==null)found.push(k);}catch{}for(const k of SESSION)try{if(session&&session.getItem(k)!==null&&!found.includes(k))found.push(k);}catch{}return found;}
 function clearAll(local,session){let ok=true;for(const k of LOCAL)try{local&&local.removeItem(k);}catch{ok=false;}for(const k of SESSION)try{session&&session.removeItem(k);}catch{ok=false;}return ok;}
 const api={LOCAL,SESSION,planCount,stored,clearAll};
 if(typeof module!=='undefined'&&module.exports){module.exports=api;return;}
 root.SparePrivacy=api;
 document.addEventListener('DOMContentLoaded',()=>{
  let local,session;try{local=localStorage;}catch{}try{session=sessionStorage;}catch{}
  const blocked=!local&&!session;
  const button=document.getElementById('deleteAll'),summary=document.getElementById('deleteSummary'),status=document.getElementById('deleteStatus');
  if(!button)return;
  function describe(){const n=planCount(local),any=stored(local,session).length>0;
   if(blocked){summary.textContent='Nettleseren gir ikke Spareverksted tilgang til lagring. Da lagres ingenting her, og det er ikke noe å slette.';button.hidden=true;return;}
   summary.textContent=!any?'Ingen lagrede planer i denne nettleseren og ingen lagrede valg i denne fanen.':n?`Du har ${n} lagret${n===1?' plan':'e planer'} her. Slettingen kan ikke angres.`:'Det er lagret valg, men ingen planer. Slettingen kan ikke angres.';
   button.hidden=!any;}
  button.addEventListener('click',()=>{const n=planCount(local);
   if(n&&!confirm(`Slette Spareverksteds data i denne nettleseren, også ${n} lagret${n===1?' plan':'e planer'}? Dette kan ikke angres.`))return;
   const ok=clearAll(local,session),left=stored(local,session);
   document.documentElement.dataset.theme='neutral';document.querySelectorAll('[data-color-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.colorTheme==='neutral')));
   status.textContent=ok&&!left.length?'Slettet: lagrede planer i denne nettleseren og det som var lagret i denne fanen. Andre åpne faner kan fortsatt ha arbeidsplan, valg og opplysninger til veilederen. Lukk dem for å fjerne det.':'Noe kunne ikke slettes. Slett nettstedsdata for spareverksted.no i nettleserens innstillinger.';
   describe();status.tabIndex=-1;status.focus();});
  describe();
 });
})(typeof window!=='undefined'?window:globalThis);
