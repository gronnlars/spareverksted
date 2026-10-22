(function(){
'use strict';
const V=window.SpareVeileder,C=window.SpareContext,Cards=window.SpareCards;
const $=id=>document.getElementById(id);
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
let storage;try{storage=window.sessionStorage;}catch{}
let context=C.read(storage),selected=null;
const names={buffer:{yes:'buffer',no:'ingen buffer'},debt:{yes:'dyr gjeld',no:'ingen dyr gjeld'},income:{stable:'stabil inntekt',uncertain:'usikker inntekt'},risk:{low:'ønske om lite uro',medium:'rom for noe uro',high:'rom for store svingninger'},discipline:{automatic:'fast sparetrekk',flexible:'varierende sparebeløp'}};
function save(){if(!C.write(storage,context))$('memoryNote').textContent='Nettleseren tillater ikke øktlagring. Opplysningene brukes bare mens siden er åpen og kan ikke hentes automatisk fra kalkulatoren. Spørsmålet sendes ikke til en KI-tjeneste.';}
function button(text,fn){const b=el('button',text);b.type='button';b.addEventListener('click',fn);return b;}
function profile(){return C.forTopic(context,selected);}
function describe(){
 const p=profile(),bits=[];
 if(p.age!==undefined)bits.push('er '+p.age+' år');
 if(p.years!==undefined&&p.years!==null)bits.push('har oppgitt '+p.years+' år til bruk');
 if(names.risk[p.risk])bits.push('har oppgitt '+names.risk[p.risk]);
 $('contextSummary').textContent=bits.length?'Basert på at du '+bits.join(', ').replace(/, ([^,]*)$/,' og $1')+'.':'Du kan få et generelt svar uten å fylle inn noe.';
 const imported=[];
 if(p.age!==undefined&&context.origins.age==='calculator')imported.push('alder');
 if(p.years!==undefined&&p.years!==null&&context.origins.years==='calculator'&&!Object.hasOwn(context.horizons,selected))imported.push('sparetid');
 if(p.risk&&context.origins.risk==='calculator')imported.push('risikovalg');
 if(imported.length)$('contextSummary').append(el('span','Hentet fra kalkulatoren: '+imported.join(' og ')+'.','context-source'));
 if(selected==='children'&&(p.years===undefined||p.years===null))$('contextSummary').append(el('span',' Sparetiden i kalkulatoren brukes ikke automatisk som barnets sparetid.','context-source'));
}
function fill(){
 const p=profile();for(const input of $('profileForm').elements){if(input.name)input.value=p[input.name]??'';}
 const category=V.topics.find(t=>t.id===selected)?.category||selected;
 $('fixedField').hidden=category!=='mortgage';$('ownerField').hidden=category!=='bsu';$('taxField').hidden=category!=='bsu';
 $('formError').hidden=true;describe();
}
function group(label,items,kind){
 const d=el('details','','tradeoff '+kind);d.append(el('summary',label+' ('+items.length+')'));const list=el('ul');
 for(const i of items){const li=el('li'),more=el('details','','tradeoff-item');more.append(el('summary',i.title),el('p',i.text));li.append(more);list.append(li);}
 d.append(list);return d;
}
function render(focus=false){
 if(!selected)return;const a=Cards.build(selected,profile());$('answerPanel').hidden=false;$('answerTitle').textContent=a.title;
 const out=$('answer');out.replaceChildren(el('p',a.intro,'answer-lead'));if(a.note)out.append(el('p',a.note,'answer-caution'));
 const grid=el('div','','option-grid');for(const o of a.options){const card=el('article','','option-card');card.append(el('h3',o.title),el('p',o.subtitle,'option-subtitle'),group('Fordeler',o.pros,'pro'),group('Ulemper',o.cons,'con'));grid.append(card);}out.append(grid);
 const full=el('details','','full-answer');full.append(el('summary','Les en utfyllende vurdering'));for(const part of a.parts){const section=el('section','','answer-part');section.append(el('h3',part.title),el('p',part.text));full.append(section);}out.append(full);
 const sources=el('details','','answer-sources');sources.append(el('summary','Kilder og forbehold'));const checked=new Intl.DateTimeFormat('nb-NO',{dateStyle:'long'}).format(new Date(a.checked+'T12:00:00Z'));sources.append(el('p','Kontrollert '+checked+'. Regelgrenser er merket med år og kan endres. Inndelingen i under 5, 5–10 og minst 10 år er en grov redaksjonell vurdering, ikke en garanti. Kildene har ikke godkjent veilederen.','hint'));
 if(a.baseChecked&&a.baseChecked!==a.checked)sources.append(el('p','Grunnveiledningen ble kontrollert '+a.baseChecked+'.','hint'));
 const ul=el('ul','','source-list');for(const s of a.sources){const li=el('li'),link=el('a',s.title);link.href=s.url;link.target='_blank';link.rel='noopener noreferrer';li.append(link);ul.append(li);}sources.append(ul);
 if(selected==='children')sources.append(el('p','Statsforvalterens bakgrunnsside er arkivert. Kontroller gjeldende regler, renter og eventuelle unntak før større overføringer. Den oppgitte stipendgrensen gjelder 2026 og er ikke en prognose for når barnet studerer.','hint'));
 out.append(sources);describe();if(focus)$('answerTitle').focus();
}
function choose(id,focus=true){
 selected=id;const picker=$('topicPicker');if(picker){picker.open=false;picker.querySelector('summary').textContent='Tema: '+V.topics.find(t=>t.id===id).title;}const category=V.topics.find(t=>t.id===id)?.category||id;
 $('followups').replaceChildren();for(const question of V.topics.filter(t=>t.category===category&&t.id!==id)){const b=button(question.title,()=>choose(question.id));b.dataset.topic=question.id;b.setAttribute('aria-pressed','false');$('followups').append(b);}
 for(const b of document.querySelectorAll('[data-topic]'))b.setAttribute('aria-pressed',String(b.dataset.topic===id));fill();render(focus);
}
function search(){
 $('matches').replaceChildren();const ids=V.findTopics($('question').value);
 if(!ids.length){$('followups').replaceChildren();selected=null;$('answerPanel').hidden=true;$('matchStatus').textContent='Jeg fant ikke et passende svar. Velg et tema, eller prøv andre ord.';for(const b of document.querySelectorAll('[data-topic]'))b.setAttribute('aria-pressed','false');fill();return;}
 choose(ids[0]);$('matchStatus').textContent=ids.length>1?'Viser '+V.topics.find(t=>t.id===ids[0]).title.toLowerCase()+'. Du kan også se:':'';
 for(const id of ids.slice(1)){const t=V.topics.find(t=>t.id===id);$('matches').append(button(t.title,()=>{$('matchStatus').textContent='';$('matches').replaceChildren();choose(id);}));}
}
for(const t of V.topics.filter(t=>!t.category)){const b=button(t.title,()=>{$('matchStatus').textContent='';$('matches').replaceChildren();choose(t.id);});b.dataset.topic=t.id;b.setAttribute('aria-pressed','false');$('topics').append(b);}
$('questionForm').addEventListener('submit',e=>{e.preventDefault();search();});
$('question').addEventListener('input',()=>{if(selected){$('answerPanel').hidden=true;selected=null;} $('matchStatus').textContent='Trykk «Vis svar» for å søke.';$('matches').replaceChildren();for(const b of document.querySelectorAll('[data-topic]'))b.setAttribute('aria-pressed','false');});
$('profileForm').addEventListener('submit',e=>{
 e.preventDefault();let p;try{p=V.validate(Object.fromEntries(new FormData($('profileForm'))));}catch(err){$('formError').textContent=err.message;$('formError').hidden=false;return;}
 const before=profile();for(const [key,value]of Object.entries(p)){
 if(key==='years'){if(selected)context.horizons[selected]=value;else {context.profile.years=value;context.origins.years='guide';}continue;}
 if(value===''||value===null){delete context.profile[key];delete context.origins[key];}else{context.profile[key]=value;if(before[key]!==value)context.origins[key]='guide';}
 }
 context=C.clean(context);save();$('profileDetails').open=false;fill();render(true);
});
// Do not leave an old answer displayed while the profile has unapplied edits.
$('profileForm').addEventListener('input',()=>{if(selected){$('answerPanel').hidden=true;$('formError').hidden=true;}});
$('profileForm').addEventListener('change',()=>{if(selected)$('answerPanel').hidden=true;});
$('resetGuidance').addEventListener('click',()=>{context=C.empty();C.clear(storage);$('question').value='';$('matches').replaceChildren();$('matchStatus').textContent='Opplysningene er glemt i veilederen. Kalkulatorens egne felter er ikke endret.';fill();$('profileDetails').open=false;render(false);});
fill();
})();

