// Apply before styles load, so a saved night theme does not flash white.
(function(){
 'use strict';
 const key='sv-color-theme',themes=['neutral','light','night'];
 let current='neutral';
 try{const saved=localStorage.getItem(key);if(themes.includes(saved))current=saved;}catch{}
 const root=document.documentElement;
 function apply(theme){
  current=theme;root.dataset.theme=theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='night'?'#13221d':theme==='light'?'#ffffff':'#f5f6f0');
  document.querySelectorAll('[data-color-theme]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.colorTheme===theme)));
 }
 apply(current);
 document.addEventListener('DOMContentLoaded',()=>{
  const brand=document.querySelector('.site-header .brand');if(!brand)return;
  const wrapper=document.createElement('div');wrapper.className='brand-tools';brand.before(wrapper);wrapper.append(brand);
  const group=document.createElement('div');group.className='theme-picker';group.setAttribute('role','group');group.setAttribute('aria-label','Fargetema');
  const icons={neutral:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16Z" fill="currentColor" stroke="none"/>',light:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',night:'<path d="M20 13a8 8 0 0 1-9-9 8 8 0 1 0 9 9Z"/>'};
  const names={neutral:'Nøytral',light:'Lys',night:'Natt'};
  for(const theme of themes){
   const button=document.createElement('button');button.type='button';button.dataset.colorTheme=theme;
   button.setAttribute('aria-label',names[theme]);button.title=names[theme];
   button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+icons[theme]+'</svg>';
   button.addEventListener('click',()=>{apply(theme);try{localStorage.setItem(key,theme);}catch{}});
   group.append(button);
  }
  wrapper.append(group);apply(current);
 });
 // Keep already open tabs consistent. A blocked store never disables the controls.
 addEventListener('storage',event=>{if(event.key===key||event.key===null)apply(themes.includes(event.newValue)?event.newValue:'neutral');});
})();
