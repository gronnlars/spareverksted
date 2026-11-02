// Apply before styles load, so a saved night theme does not flash white.
(function(){
 'use strict';
 const key='sv-color-theme',themes=['neutral','light','night'];
 let current='neutral';
 // Valget gjelder bare i denne fanen (sessionStorage). Den gamle permanente nøkkelen fjernes uten å leses.
 try{localStorage.removeItem(key);}catch{}
 try{const saved=sessionStorage.getItem(key);if(themes.includes(saved))current=saved;}catch{}
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
  // Én knapp viser valgt tema. Trykk åpner de tre valgene, valget lukker og knappen får nytt ikon.
  const picker=document.createElement('div');picker.className='theme-picker';
  const icons={neutral:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16Z" fill="currentColor" stroke="none"/>',light:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',night:'<path d="M20 13a8 8 0 0 1-9-9 8 8 0 1 0 9 9Z"/>'};
  const names={neutral:'Nøytral',light:'Lys',night:'Natt'};
  const svg=theme=>'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+icons[theme]+'</svg>';
  const toggle=document.createElement('button');toggle.type='button';toggle.className='theme-toggle';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','themeOptions');
  const group=document.createElement('div');group.id='themeOptions';group.className='theme-options';group.setAttribute('role','group');group.setAttribute('aria-label','Velg fargetema');group.hidden=true;
  const showCurrent=()=>{toggle.innerHTML=svg(current);toggle.setAttribute('aria-label','Fargetema: '+names[current]);toggle.title='Fargetema: '+names[current];};
  // Åpen: knappen blir selve pillen. Valgt tema står først, der knappen var, og de to andre folder seg ut ved siden av.
  const setOpen=(open,focusToggle)=>{
   if(open){const chosen=group.querySelector('[data-color-theme="'+current+'"]');if(chosen)group.prepend(chosen);}
   group.hidden=!open;picker.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));
   if(open)(group.querySelector('[aria-pressed=true]')||group.firstElementChild).focus();else if(focusToggle)toggle.focus();};
  toggle.addEventListener('click',()=>setOpen(group.hidden,false));
  for(const theme of themes){
   const button=document.createElement('button');button.type='button';button.dataset.colorTheme=theme;
   button.setAttribute('aria-label',names[theme]);button.title=names[theme];button.innerHTML=svg(theme);
   button.addEventListener('click',()=>{apply(theme);try{sessionStorage.setItem(key,theme);}catch{}showCurrent();setOpen(false,true);});
   group.append(button);
  }
  picker.addEventListener('keydown',event=>{if(event.key==='Escape'&&!group.hidden){event.preventDefault();setOpen(false,true);}});
  // Safari på iPhone gir ikke knapper fokus ved trykk, så fokus forsvinner (relatedTarget er null) før click.
  // Et trykk inne i pillen skal derfor ikke lukke den. Tab ut og trykk utenfor lukker som før.
  let pressInside=false;
  picker.addEventListener('pointerdown',()=>{pressInside=true;});
  document.addEventListener('pointerup',()=>setTimeout(()=>{pressInside=false;},0));
  picker.addEventListener('focusout',event=>{if(group.hidden||pressInside||picker.contains(event.relatedTarget))return;setOpen(false,false);});
  document.addEventListener('click',event=>{if(!group.hidden&&!picker.contains(event.target))setOpen(false,false);});
  picker.append(toggle,group);showCurrent();
  const groupForWrapper=picker;
  wrapper.append(groupForWrapper);apply(current);
 });
})();
