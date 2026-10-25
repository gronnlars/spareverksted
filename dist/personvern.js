// Sletter bare Spareverksteds egne nøkler. Andre nettsteders data og andre nøkler på samme domene røres ikke.
(function(root){
 'use strict';
 const LOCAL=['sv-scenarios','sv-level','sv-color-theme','sv-started'];
 const SESSION=['sv-working-plan-v1','sv-guidance-tab-v2','sv-started'];
 function planCount(local){try{const d=JSON.parse(local.getItem('sv-scenarios')||'[]');return Array.isArray(d)?d.length:0;}catch{return 0;}}
 function stored(local,session){const found=[];for(const k of LOCAL)try{if(local&&local.getItem(k)!==null)found.push(k);}catch{}for(const k of SESSION)try{if(session&&session.getItem(k)!==null&&!found.includes(k))found.push(k);}catch{}return found;}
 function clearAll(local,session){let ok=true;for(const k of LOCAL)try{local&&local.removeItem(k);}catch{ok=false;}for(const k of SESSION)try{session&&session.removeItem(k);}catch{ok=false;}return ok;}
 const api={LOCAL,SESSION,planCount,stored,clearAll};
 if(typeof module!=='undefined'&&module.exports){module.exports=api;return;}
 root.SparePrivacy=api;
 document.addEventListener('DOMContentLoaded',()=>{
  let local,session;try{local=localStorage;}catch{}try{session=sessionStorage;}catch{}
  const button=document.getElementById('deleteAll'),summary=document.getElementById('deleteSummary'),status=document.getElementById('deleteStatus');
  if(!button)return;
  function describe(){const n=planCount(local),any=stored(local,session).length>0;
   summary.textContent=!any?'Spareverksted har ikke lagret noe i denne nettleseren nå.':n?`Du har ${n} lagret${n===1?' plan':'e planer'} her. Slettingen kan ikke angres.`:'Det er lagret valg, men ingen planer. Slettingen kan ikke angres.';
   button.hidden=!any;}
  button.addEventListener('click',()=>{const n=planCount(local);
   if(n&&!confirm(`Slette alt, også ${n} lagret${n===1?' plan':'e planer'}? Dette kan ikke angres.`))return;
   const ok=clearAll(local,session);
   document.documentElement.dataset.theme='neutral';document.querySelectorAll('[data-color-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.colorTheme==='neutral')));
   status.textContent=ok?'Alt Spareverksted hadde lagret i denne nettleseren, er slettet.':'Noe kunne ikke slettes. Slett nettstedsdata for spareverksted.no i nettleserens innstillinger.';
   describe();status.tabIndex=-1;status.focus();});
  describe();
 });
})(typeof window!=='undefined'?window:globalThis);
