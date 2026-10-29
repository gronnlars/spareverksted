(function(){
'use strict';
const V=window.SpareVeileder,C=window.SpareContext,Cards=window.SpareCards,F=window.SpareFacts;
const $=id=>document.getElementById(id);
if(!V.publicationReady){$('contextPanel').hidden=true;$('suggestedPanel').hidden=true;$('matchStatus').textContent='Svarene kunne ikke lastes. Last siden på nytt.';return;}
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
let storage;try{storage=window.sessionStorage;}catch{}
let context=C.read(storage),selected=null;
const names={buffer:{yes:'tilgjengelig buffer',no:'uten buffer'},debt:{yes:'dyr gjeld',no:'uten dyr gjeld'},income:{stable:'stabil inntekt',uncertain:'usikker inntekt'},risk:{low:'ønske om lite uro',medium:'rom for noe uro',high:'rom for store svingninger'}};
function save(){if(!C.write(storage,context))$('memoryNote').textContent='Nettleseren tillater ikke øktlagring. Opplysningene brukes bare mens siden er åpen. Spørsmål lagres ikke, og opplysningene sendes ikke til andre tjenester.';}
function button(text,fn){const b=el('button',text);b.type='button';b.addEventListener('click',fn);return b;}
function profile(){return C.forTopic(context,selected);}
function describe(){
 if(selected&&V.isNeutral(selected)){$('contextSummary').textContent='';return;}
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
 $('contextPanel').hidden=!!(V.publishedOnly||selected&&V.isNeutral(selected));
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
 $('suggestedHelp').textContent=!V.publishedOnly&&Object.keys(context.profile).length?'Prioritert etter opplysningene dine. Alle temaer er fortsatt tilgjengelige.':'Velg et spørsmål, eller søk med egne ord.';
 $('suggestedQuestions').replaceChildren();
 for(const item of items)$('suggestedQuestions').append(button(item.title,()=>choose(item.id)));
 $('suggestedPanel').hidden=items.length===0;
}
const longDate=iso=>new Intl.DateTimeFormat('nb-NO',{dateStyle:'long',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'));
// Rett under overskriften: «Sist gjennomgått» alltid synlig. Øvrige datoer i et åpne/lukke-felt. Varsel når gjennomgangen er over 12 måneder gammel.
function dates(a){
 const out=[],rows=[['Først publisert',a.published],['Sist endret',a.changed]].filter(([,d])=>d);
 const summary=el('summary','Sist gjennomgått: '+longDate(a.checked));
 if(rows.length){
  const box=el('details','','answer-dates'),dl=el('dl');box.append(summary);
  for(const [label,d] of rows)dl.append(el('dt',label),el('dd',longDate(d)));
  box.append(dl,el('p','Gjennomgått betyr at kildene og tallene er sjekket på nytt. Svaret endres bare når noe må rettes.','hint'));out.push(box);
 }else{const p=el('p','','answer-dates');p.append(summary.textContent);out.push(p);}
 if(V.reviewOverdue(a.checked)){
  const warn=el('p','','answer-caution answer-overdue'),icon=el('span','⚠ ');icon.setAttribute('aria-hidden','true');
  warn.append(icon,'Dette svaret er ikke gjennomgått på over 12 måneder. Satser, grenser og regler kan ha endret seg.');out.push(warn);
 }
 return out;
}
function render(focus=false){
 suggestions();if(!selected){if(focus){$('suggestedTitle').tabIndex=-1;$('suggestedTitle').focus();}return;}
 const partSection=part=>{const section=el('section','','answer-part');section.append(el('h3',part.title),el('p',part.text));
  if(part.table){
   const data=part.table,table=el('table','','answer-table');table.append(el('caption',data.caption));
   const head=el('thead'),header=el('tr');
   for(const title of data.columns){const th=el('th',title);th.scope='col';header.append(th);}head.append(header);table.append(head);
   const body=el('tbody'),format=new Intl.NumberFormat('nb-NO',{minimumFractionDigits:2,maximumFractionDigits:2});
   for(const row of data.rows){const tr=el('tr');row.forEach((value,index)=>{const cell=el(index===0?'th':'td',index===0?value:format.format(value));if(index===0)cell.scope='row';tr.append(cell);});body.append(tr);}table.append(body);section.append(table,el('p',data.note,'answer-table-note'));
  }
  return section;};
 const a=Cards.build(selected,profile());$('answerPanel').hidden=false;$('answerTitle').textContent=a.title;
 const out=$('answer');out.dataset.layout=a.layout||'';out.replaceChildren(...dates(a),el('p',a.intro,'answer-lead'));
 if(a.caveat)out.append(el('p',a.caveat,'answer-caveat'));
 if(a.kind==='explainer'){
  // Innholdstypen styrer nøytralitet; layout styrer bare presentasjonen.
  const overview=a.layout==='overview';
  if(a.tradeoffs){
   const card=el('section','','option-card explain-overview');card.append(el('h3','Fordeler og ulemper'));
   card.append(group('Fordeler',a.tradeoffs.pros,'pro'),group('Ulemper',a.tradeoffs.cons,'con'));out.append(card);
  }
  if(a.example){const ex=el('section','','answer-part explain-example');ex.append(el('h3',a.example.title),el('p',a.example.text));out.append(ex);}
  const terms=el('section','','explain-terms');terms.append(el('h3','Begreper i svaret'));const dl=el('dl');
  for(const x of a.terms||[]){dl.append(el('dt',x.term+(x.alsoCalled?' (også kalt '+x.alsoCalled+')':'')),el('dd',x.text));}
  terms.append(dl);if(!overview)out.append(terms);
  if(a.next)for(const next of [a.next,...(a.next.more||[])]){const p=el('p','','explain-next'),link=el('a',next.text);link.href=next.href;p.append(link);out.append(p);}
  const deep=el('details','','full-answer');deep.append(el('summary','Fordypning'));
  for(const part of a.parts)deep.append(partSection(part));
  if(overview&&a.terms?.length)deep.append(terms);out.append(deep);
  const src=el('details','','answer-sources');src.append(el('summary','Kilder og kontrollgrunnlag'));
  const sl=el('ul','','source-list');
  for(const s of a.sources){const li=el('li'),link=el('a',s.title);link.href=s.url;link.target='_blank';link.rel='noopener noreferrer';li.append(link);sl.append(li);}
  src.append(sl);if(a.review){const review=el('details','','review-details');review.append(el('summary','Om kildekontrollen'),el('p',a.review.text));src.append(review);}out.append(src);
  describe();if(focus)$('answerTitle').focus();return;
 }
 if(a.note)out.append(el('p',a.note,'answer-caution'));
 if(a.steps.length){const steps=el('section','','next-steps');steps.append(el('h3','Et mulig neste steg'));const list=el('ol');for(const text of a.steps)list.append(el('li',text));steps.append(list);out.append(steps);}
 const grid=el('div','','option-grid');
 for(const o of a.options){const card=el('article','','option-card');card.append(el('h3',o.title),el('p',o.subtitle,'option-subtitle'),group('Fordeler',o.pros,'pro'),group('Ulemper',o.cons,'con'),...(o.poorFit?[el('p','Passer dårlig hvis '+o.poorFit,'poor-fit')]:[]));grid.append(card);}out.append(grid);
 const full=el('details','','full-answer');full.append(el('summary',a.neutral?'Fordypning':'Les en utfyllende vurdering'));
 for(const part of a.parts.slice(0,3))full.append(partSection(part));
 if(a.parts.length>3){const more=el('details','','more-sections');more.append(el('summary','Vis flere ('+(a.parts.length-3)+')'));for(const part of a.parts.slice(3))more.append(partSection(part));full.append(more);}if(a.parts.length)out.append(full);
 const sources=el('details','','answer-sources');sources.append(el('summary',a.neutral?'Kilder og kontrollgrunnlag':'Kilder og forbehold'));if(!a.neutral)sources.append(el('p','Regler og grenser kan endres. Lang tid garanterer ikke gevinst.','hint'));
 const ul=el('ul','','source-list');
 for(const s of a.sources){const li=el('li'),link=el('a',s.title);link.href=s.url;link.target='_blank';link.rel='noopener noreferrer';li.append(link);ul.append(li);}sources.append(ul);if(a.review){const review=el('details','','review-details');review.append(el('summary','Om kildekontrollen'),el('p',a.review.text));sources.append(review);}
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
const titleOf=id=>V.topics.find(t=>t.id===id).title;
// Få, tydelige treff først. Hvert treff sier hvorfor det vises. Forslag (tastefeil, brede ord) er merket som forslag.
function showMatches(items,visible=3,sharedTypo=false){
 const box=$('matches');box.replaceChildren();if(!items.length)return;
 const list=el('ul','','match-list');
 items.forEach((m,i)=>{
  const li=el('li');if(i>=visible)li.hidden=true;
  const b=button('',()=>{$('matches').replaceChildren();choose(m.id);});
  b.append(el('span',titleOf(m.id),'match-title'));
  if(!sharedTypo)b.append(el('span',V.reason(m),'match-why'));
  if(m.kind==='typo'||m.kind==='related'||m.kind==='negated'||m.kind==='nearest')b.classList.add('match-suggest');
  li.append(b);list.append(li);
 });
 box.append(list);
 if(items.length>visible){
  const more=button('Vis flere ('+(items.length-visible)+')',()=>{
   const hidden=[...list.querySelectorAll('li[hidden]')];for(const li of hidden)li.hidden=false;more.remove();hidden[0].querySelector('button').focus();
  });
  box.append(more);
 }
}
// Negerte ord brukes ikke til å velge treff. Brukeren får beskjed.
const negNote=r=>r.negated&&r.negated.length?'«'+r.negated.join(' ')+'» er ikke brukt til å velge treff, fordi du skrev det med nekting. ':'';
function search(){
 $('matches').replaceChildren();
 const r=V.search($('question').value),status=$('matchStatus');
 if(r.mode==='answer'){
  const [lead,...rest]=r.hits,others=[...rest,...r.suggestions];
  choose(lead.id);
  status.textContent=negNote(r)+(lead.kind==='question'?'Svar på spørsmålet ditt.':V.reason(lead)+'.')+(others.length?' Andre svar som kan passe:':'');
  showMatches(others);return;
 }
 clearChoice();$('searchBox').open=true;
 if(r.mode==='choose'){status.textContent=negNote(r)+'Flere svar kan passe. Velg det du mener:';showMatches([...r.hits,...r.suggestions]);return;}
 if(r.mode==='suggest'){
  const sharedTypo=r.suggestions.length>0&&r.suggestions.every(s=>s.kind==='typo'&&s.via===r.suggestions[0].via);
  status.textContent=negNote(r)+(sharedTypo?'Mente du «'+r.suggestions[0].via+'»? Velg et svar nedenfor.':'Dette er forslag til temaer. Velg det du mener:');
  showMatches(r.suggestions,3,sharedTypo);return;
 }
 if(r.mode==='uncovered'){$('topicPicker').open=true;status.textContent='Vi har ikke et eget svar på «'+r.uncovered.label+'» ennå. Eventuelle forslag under svarer ikke på spørsmålet ditt:';showMatches(r.hits);return;}
 if(r.mode==='negated'){$('topicPicker').open=true;status.textContent='Du skriver «'+r.negated.join(' ')+'» med nekting. Vi har ikke et eget svar på det ennå. Temaene under ligger nærmest, men er ikke svar på spørsmålet ditt:';showMatches(r.hits);return;}
 $('topicPicker').open=true;
 status.textContent=r.mode==='broad'?'Spørsmålet er bredt. Velg et tema, eller skriv litt mer, for eksempel «sparing til barn».':'Vi har ikke et ferdig svar på dette ennå. Velg et tema, eller prøv andre ord.';
}
for(const t of V.topics.filter(t=>V.publishedOnly||!t.category)){const b=button(t.title,()=>{$('matches').replaceChildren();choose(t.id);});b.dataset.topic=t.id;b.setAttribute('aria-pressed','false');$('topics').append(b);}
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

