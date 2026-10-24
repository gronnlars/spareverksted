(function(){
'use strict';
const V=window.SpareVeileder,C=window.SpareContext,Cards=window.SpareCards,F=window.SpareFacts;
const $=id=>document.getElementById(id);
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
let storage;try{storage=window.sessionStorage;}catch{}
let context=C.read(storage),selected=null;
const names={buffer:{yes:'tilgjengelig buffer',no:'uten buffer'},debt:{yes:'dyr gjeld',no:'uten dyr gjeld'},income:{stable:'stabil inntekt',uncertain:'usikker inntekt'},risk:{low:'ønske om lite uro',medium:'rom for noe uro',high:'rom for store svingninger'}};
function save(){if(!C.write(storage,context))$('memoryNote').textContent='Nettleseren tillater ikke øktlagring. Opplysningene brukes bare mens siden er åpen. Spørsmål lagres ikke, og opplysningene sendes ikke til andre tjenester.';}
function button(text,fn){const b=el('button',text);b.type='button';b.addEventListener('click',fn);return b;}
function profile(){return C.forTopic(context,selected);}
function describe(){
 if(selected&&V.isExplainer(selected)){$('contextSummary').textContent='';return;}
 const p=profile(),bits=[];
 for(const k of ['debt','buffer','income'])if(names[k][p[k]])bits.push(names[k][p[k]]);
 if(selected&&['pension','bsu'].includes(V.category(selected))&&p.age!==undefined)bits.push('alder '+p.age+' år');
 if(selected&&V.horizonRelevant(selected)&&V.fundRelevant(selected,p)&&p.years!==undefined&&p.years!==null)bits.push(p.years+' år til bruk');
 if(selected&&V.fundRelevant(selected,p)&&names.risk[p.risk])bits.push(names.risk[p.risk]);
 $('contextSummary').textContent=bits.length?'Basert på: '+bits.join(', ')+'.':'';
 const imported=['age','years','risk'].filter(k=>context.origins[k]==='calculator'&&p[k]!==undefined&&p[k]!==null);
 if(imported.length)$('contextSummary').append(el('span','Opplysninger fra kalkulatoren kan endres nedenfor.','context-source'));
}
function fill(){
 const p=profile();for(const input of $('profileForm').elements)if(input.name)input.value=p[input.name]??'';
 $('profileDetails').querySelector('summary').textContent=selected?'Tilpass svaret':'Tilpass spørsmål og svar';
 const category=V.category(selected),funds=!selected||V.fundRelevant(selected,p);
 const show={age:!selected||['pension','bsu'].includes(category),years:!selected||V.horizonRelevant(selected)&&funds,risk:funds,discipline:!selected||['mortgage','funds','student','pension'].includes(category),fixed:category==='mortgage',owner:!selected||category==='bsu',tax:category==='bsu'};
 for(const [name,visible]of Object.entries(show)){const input=$(name);input.closest('label').hidden=!visible;input.disabled=!visible;}
 $('contextPanel').hidden=!!(selected&&V.isExplainer(selected));
 $('formError').hidden=true;describe();
}
function group(label,items,kind){
 const d=el('details','','tradeoff '+kind);d.append(el('summary',label+' ('+items.length+')'));const list=el('ul');
 for(const i of items){const li=el('li');li.append(el('strong',i.title),el('p',i.text));list.append(li);}
 d.append(list);return d;
}
function suggestions(){
 const p=profile(),items=V.suggestions(p,selected);
 $('suggestedTitle').textContent=selected?'Neste spørsmål':'Spørsmål du kan starte med';
 $('suggestedHelp').textContent=Object.keys(context.profile).length?'Prioritert etter opplysningene dine. Alle temaer er fortsatt tilgjengelige.':'Velg et spørsmål, eller søk med egne ord.';
 $('suggestedQuestions').replaceChildren();
 for(const item of items)$('suggestedQuestions').append(button(item.title,()=>choose(item.id)));
 $('suggestedPanel').hidden=items.length===0;
}
function render(focus=false){
 suggestions();if(!selected){if(focus){$('suggestedTitle').tabIndex=-1;$('suggestedTitle').focus();}return;}
 const partSection=part=>{const section=el('section','','answer-part');section.append(el('h3',part.title),el('p',part.text));return section;};
 const a=Cards.build(selected,profile());$('answerPanel').hidden=false;$('answerTitle').textContent=a.title;
 const out=$('answer');out.replaceChildren(el('p',a.intro,'answer-lead'));
 const checked=new Intl.DateTimeFormat('nb-NO',{dateStyle:'long'}).format(new Date(a.checked+'T12:00:00Z'));
 out.append(el('p','Sist sjekket: '+checked,'answer-checked'));
 if(a.kind==='explainer'){
  // Forklaring: kort svar, eksempel, begreper, lenke videre, fordypning, kilder. Ingen alternativkort.
  const ex=el('section','','answer-part explain-example');ex.append(el('h3',a.example.title),el('p',a.example.text));out.append(ex);
  const terms=el('section','','explain-terms');terms.append(el('h3','Begreper i svaret'));const dl=el('dl');
  for(const x of a.terms){dl.append(el('dt',x.term+(x.alsoCalled?' (også kalt '+x.alsoCalled+')':'')),el('dd',x.text));}
  terms.append(dl);out.append(terms);
  if(a.next){const p=el('p','','explain-next'),link=el('a',a.next.text);link.href=a.next.href;p.append(link);out.append(p);}
  const deep=el('details','','full-answer');deep.append(el('summary','Fordypning'));
  for(const part of a.parts)deep.append(partSection(part));out.append(deep);
  const src=el('details','','answer-sources');src.append(el('summary','Kilder og forbehold'),el('p','Tall i eksempler er regneeksempler, ikke prognoser. Tall og regler kan endres.'+(a.caveat?' '+a.caveat:''),'hint'));
  const sl=el('ul','','source-list');
  for(const s of a.sources){const li=el('li'),link=el('a',s.title);link.href=s.url;link.target='_blank';link.rel='noopener noreferrer';li.append(link);sl.append(li);}
  src.append(sl);out.append(src);
  describe();if(focus)$('answerTitle').focus();return;
 }
 if(a.note)out.append(el('p',a.note,'answer-caution'));
 if(a.steps.length){const steps=el('section','','next-steps');steps.append(el('h3','Et mulig neste steg'));const list=el('ol');for(const text of a.steps)list.append(el('li',text));steps.append(list);out.append(steps);}
 const grid=el('div','','option-grid');
 for(const o of a.options){const card=el('article','','option-card');card.append(el('h3',o.title),el('p',o.subtitle,'option-subtitle'),group('Fordeler',o.pros,'pro'),group('Ulemper',o.cons,'con'),el('p','Passer dårlig hvis '+o.poorFit,'poor-fit'));grid.append(card);}out.append(grid);
 const full=el('details','','full-answer');full.append(el('summary','Les en utfyllende vurdering'));
 for(const part of a.parts.slice(0,3))full.append(partSection(part));
 if(a.parts.length>3){const more=el('details','','more-sections');more.append(el('summary','Vis flere ('+(a.parts.length-3)+')'));for(const part of a.parts.slice(3))more.append(partSection(part));full.append(more);}out.append(full);
 const sources=el('details','','answer-sources');sources.append(el('summary','Kilder og forbehold'),el('p','Regler og grenser kan endres. Tidshorisont er bare en del av vurderingen, og lang tid garanterer ikke gevinst. Kildene har ikke godkjent veilederen.','hint'));
 const ul=el('ul','','source-list');
 for(const s of a.sources){const li=el('li'),link=el('a',s.title);link.href=s.url;link.target='_blank';link.rel='noopener noreferrer';li.append(link);ul.append(li);}sources.append(ul);
 out.append(sources);describe();if(focus)$('answerTitle').focus();
}
function choose(id,focus=true){
 selected=id;document.body.classList.add('has-answer');$('searchBox').open=false;
 const picker=$('topicPicker');picker.open=false;picker.querySelector('summary').textContent='Tema: '+V.topics.find(t=>t.id===id).title;
 for(const b of document.querySelectorAll('[data-topic]'))b.setAttribute('aria-pressed',String(b.dataset.topic===id));
 $('matchStatus').textContent='';fill();render(focus);
}
function clearChoice(){
 selected=null;$('answerPanel').hidden=true;document.body.classList.remove('has-answer');
 $('topicPicker').querySelector('summary').textContent='Vis alle temaer';
 for(const b of document.querySelectorAll('[data-topic]'))b.setAttribute('aria-pressed','false');
 fill();suggestions();
}
function listWords(items){return items.length>1?items.slice(0,-1).join(', ')+' og '+items.at(-1):items[0]||'';}
function search(){
 $('matches').replaceChildren();const r=V.interpret($('question').value),ids=r.ids;
 const read=r.applied.length?'Leste '+listWords(r.applied.map(a=>'«'+a.from+'» som «'+a.to+'»'))+'. ':'';
 if(!ids.length){
  // Ærlig bom: si det tydelig. Forslagene under er ikke svar på spørsmålet, bare veier videre.
  clearChoice();$('searchBox').open=true;
  $('matchStatus').textContent='Vi har ikke et svar på dette ennå. Knappene under er ikke svar på spørsmålet ditt. De viser '+(r.suggestions.length?'andre ord du kan søke på, og ':'')+'temaene vi har i dag.';
  for(const s of r.suggestions)$('matches').append(button('Mente du «'+s.to+'»?',()=>{const box=$('question');box.value=box.value.replace(new RegExp(s.from,'i'),s.to);search();}));
  for(const t of V.topics.filter(t=>!t.category))$('matches').append(button(t.title,()=>{$('matches').replaceChildren();choose(t.id);}));
  return;
 }
 choose(ids[0]);$('matchStatus').textContent=read+(ids.length>1?'Andre temaer som kan passe:':'');
 for(const id of ids.slice(1)){const t=V.topics.find(t=>t.id===id);$('matches').append(button(t.title,()=>{$('matches').replaceChildren();choose(id);}));}
}
for(const t of V.topics.filter(t=>!t.category)){const b=button(t.title,()=>{$('matches').replaceChildren();choose(t.id);});b.dataset.topic=t.id;b.setAttribute('aria-pressed','false');$('topics').append(b);}
$('questionForm').addEventListener('submit',e=>{e.preventDefault();search();});
$('question').addEventListener('input',()=>{if(selected)clearChoice();$('matchStatus').textContent='Trykk «Vis svar» for å søke.';$('matches').replaceChildren();});
$('profileForm').addEventListener('submit',e=>{
 e.preventDefault();let p;try{p=V.validate(Object.fromEntries(new FormData($('profileForm'))));}catch(err){$('formError').textContent=err.message;$('formError').hidden=false;return;}
 const before=profile();
 for(const input of $('profileForm').elements){
  const key=input.name;if(!key||input.disabled)continue;const value=p[key];
  if(key==='years'){if(selected)context.horizons[selected]=value;else if(value===null){delete context.profile.years;delete context.origins.years;}else{context.profile.years=value;context.origins.years='guide';}continue;}
  if(value===''||value===null){delete context.profile[key];delete context.origins[key];}else{context.profile[key]=value;if(before[key]!==value)context.origins[key]='guide';}
 }
 context=C.clean(context);save();$('profileDetails').open=false;fill();render(true);
 if(!selected)$('matchStatus').textContent='Spørsmålsforslagene er oppdatert.';
});
$('profileForm').addEventListener('input',()=>{if(selected){$('answerPanel').hidden=true;$('formError').hidden=true;}});
$('profileForm').addEventListener('change',()=>{if(selected)$('answerPanel').hidden=true;});
$('resetGuidance').addEventListener('click',()=>{context=C.empty();C.clear(storage);$('question').value='';$('matches').replaceChildren();$('matchStatus').textContent='Opplysningene er glemt. Kalkulatorens egne felter er ikke endret.';fill();$('profileDetails').open=false;render(true);});
fill();suggestions();
})();

