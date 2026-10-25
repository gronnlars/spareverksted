/* Editorial, deterministic guidance. No model, network calls or product recommendations. */
(function(root){
'use strict';
const F=typeof module!=='undefined'&&module.exports?require('./veileder-facts.js'):root.SpareFacts;
const S=typeof module!=='undefined'&&module.exports?require('./veileder-sok.js'):root.SpareSearch;
const checked=F.checked;
const sources={
 funds:['Forbrukerrådet: fond og spareprofiler','https://www.forbrukerradet.no/sparing-i-fond-og-spareprofiler/'],
 pension:['Forbrukerrådet: pensjon fra egen sparing','https://www.forbrukerradet.no/finansportalen/pensjon/pensjon-fra-egen-sparing/'],
 mortgage:['Forbrukerrådet: lån og sparing','https://www.forbrukerradet.no/finansportalen/'],
 fixed:['Husbanken: ekstra innbetaling og fastrente','https://husbanken.no/kunde-i-husbanken/ekstraordinaer-betaling-paa-laan/'],
 student:['Lånekassen: renter og gebyrer','https://lanekassen.no/nb-NO/gjeld-og-betaling/renter-og-gebyrer/'],
 grant:['Lånekassen: omgjøring til stipend','https://lanekassen.no/nb-NO/stipend-og-lan/omgjoring-av-basislan/'],
 child:['Statsforvalteren: vergemål for mindreårige','https://www.statsforvalteren.no/contentassets/7168664f484549a0a1796764559441e0/vergemal-for-mindrearige---17.02.2023.pdf'],
 adult:['Statsforvalteren: barns råderett over egen økonomi',F.data.adultAge.source],
 nav:['Nav: økonomi- og gjeldsrådgivning','https://www.nav.no/okonomi-gjeld'],
 bsu:['Skatteetaten: BSU','https://www.skatteetaten.no/nn/person/skatt/hjelp-til-rett-skatt/bank-og-lan/bsu--bustadsparing-for-ungdom/'],
 risk:['Finanstilsynet: informasjon om verdipapirfond','https://www.finanstilsynet.no/forbrukerinformasjon/verdipapirforetak-verdipapirfond-og-alternative-investeringsfond/']
};
const topics=[
 {id:'mortgage',title:'Boliglån eller sparing',keys:['boliglån','huslån','fastrente','avdrag','nedbetaling','renteutgifter'],words:[/boligl[aå]n/,/husl[aå]n/,/fastrente/,/avdrag/,/nedbetal\w*\s+(?:av\s+)?(?:bolig|hus)?l[aå]n/,/betale ned (?:bolig|hus)?l[aå]n/],not:[/^(?!.*(?:ekstra|avdrag|nedbetal|betale ned)).*(?:fast(?:rente)? eller flytende|flytende eller fast)/],questions:['Bør jeg betale ned boliglånet eller spare i fond?','Hva hvis jeg har fastrente?','Er lavere gjeld viktigere enn høyere avkastning?','Kan jeg spare og betale ekstra avdrag samtidig?']},
 {id:'student',title:'Studielån',keys:['studielån','lånekassen','stipend','student'],words:[/studiel[aå]n/,/l[aå]nekassen/,/stipend/,/student/],questions:['Bør jeg ta opp studielån selv om jeg har sparepenger?','Bør jeg investere studielånet?','Bør jeg betale ned studielånet raskere?','Kan sparing påvirke stipendet mitt?']},
 {id:'children',title:'Sparing til barn',keys:['barnesparing','barnekonto','gavebrev','barnebarn','statsforvalter'],words:[/barn/,/\bunge(?:r|ne)\b|tenåring/,/gavebrev/,/statsforvalter/],questions:['Bør jeg spare i mitt eller barnets navn?',F.expand('Hva skjer når barnet fyller {{adultAge}} år?'),'Kan sparepengene påvirke barnets stipend?','Bør barnas sparepenger stå i fond?']},
 {id:'buffer',title:'Buffer og dyr gjeld',keys:['buffer','kredittkort','forbrukslån','inkasso','regninger','nødfond','krisepenger','reservekonto'],words:[/buffer/,/n[øo]dfond|krisepenger|n[øo]dpenger/,/betale ned (?:dyr )?(?:gjeld|kreditt)|nedbetal\w* (?:av )?(?:dyr )?gjeld/,/kredittkort/,/forbruksl[aå]n/,/inkasso/,/regning/,/dyr gjeld/,/uvente[td]|uforutsett|i tilfelle noe/],questions:['Hvor stor buffer trenger jeg?','Bør jeg spare når jeg har kredittkortgjeld?','Hva gjør jeg hvis jeg ikke får betalt regningene?','Hvor bør bufferen stå?']},
 {id:'funds',title:'Sparekonto eller fond',keys:['fond','sparekonto','aksjefond','børs','risiko'],words:[/(?<!n[øo]d|indeks)fond(?!skonto)/,/\betf(?:er)?\b/,/\baksje(?!sparekonto|selskap|kapital|eier|bok|opsjon)/,/\bindeks(?:en\b|er\b|\b)/,/(?<!aksje)sparekonto/,/risiko/,/\bb[oø]rs(?!t)/,/\bi banken\b|bankkonto|bankinnskudd/,/trenger pengene|hvor bør (?:pengene|de) stå/],not:[/skattlagt|skattlegg|skattes\b|beskatt|skatt(?:en)? (?:på|av|ved|hvis|når)|unng[aå]r? (?:jeg )?skatt|formuesskatt|hvor mye skatt|skatt (?:betaler|må) jeg/],questions:['Bør jeg velge sparekonto eller fond?','Hvor mye risiko bør jeg ta?','Hva hvis jeg trenger pengene om tre år?','Hvordan unngår jeg å selge i panikk?']},
 {id:'pension',title:'Sparing til pensjon',keys:['pensjon','pensjonist','pensjonssparing','alderspensjon'],words:[/pensjon/,/alderdom|(?:blir|er) gammel/,/uttak/,/\bips\b/,/pensjonist|g[aå]r? av med pensjon/],not:[/skattlagt|skattlegg|skattes\b|beskatt|skatt(?:en)? (?:på|av|ved|hvis|når)|unng[aå]r? (?:jeg )?skatt|formuesskatt|hvor mye skatt|skatt (?:betaler|må) jeg/],questions:['Bør jeg redusere risiko før pensjon?','Må alle sparepengene ut av fond når jeg pensjoneres?','Hvordan planlegger jeg uttak over mange år?','Hva bør jeg sjekke før jeg velger pensjonssparing?']},
 {id:'bsu',title:'BSU og boligkjøp',keys:['boligkjøp','egenkapital','boligsparing'],words:[/bsu/,/kj[øo]pe (?:en |ei |seg )?(?:leilighet|bolig|hus)|leilighet/,/boligkj[oø]p/,/egenkapital/,/f[oø]rste bolig/],questions:['Bør jeg prioritere BSU?','Kan jeg få BSU-fradrag hvis jeg eier bolig?','Hva hvis jeg betaler lite skatt?','Bør egenkapital til bolig stå i fond?']}
];
// Brede ord gir bare forslag. Svært generelle ord gir en oppfordring til å velge tema eller skrive mer.
const BROAD={'lån':['mortgage','student','buffer'],'gjeld':['buffer','mortgage','student'],'rente':['mortgage','funds'],'renter':['mortgage','funds'],'renten':['mortgage','funds'],'skatt':['q-ask-zero','q-ips-ask','q-bsu-basics'],'bolig':['bsu','mortgage'],'hus':['mortgage','bsu'],'bank':['funds'],'banken':['funds']};
// «Boligsparing» er bredere enn BSU: det kan også sparing uten BSU. Ordet gir derfor forslag, ikke ett svar.
BROAD.boligsparing=['q-bsu-basics','bsu','mortgage'];
// Kjente hull i innholdet. Søket viser ikke et eksisterende svar som dekkende for disse spørsmålene.
// Fjern raden når svaret dekker spørsmålet. `covers` brukes av testen til å oppdage at hullet er lukket.
const GAPS=[
 {id:'barnesparing-skatt',when:[/barn/,/skatt/],topics:['children'],near:['children'],label:'skatt på barnesparing',covers:/skatt/i},
 {id:'bsu-flytting',when:[/flytt/,/\bbsu\b|boligsparing for ungdom/],topics:['bsu','q-bsu-basics'],near:['q-bsu-basics'],label:'BSU når du flytter',covers:/flytt/i},
 {id:'renters-rente',when:[/rente(?:rs?|s) ?rente/],topics:['funds','mortgage','pension'],near:['funds'],label:'renters rente',covers:/rente(?:rs?|s) ?rente/i},
 {id:'utbytte',when:[/utbytte/],topics:['funds'],near:['funds'],label:'utbytte fra aksjer og fond',covers:/utbytte/i},
 {id:'rentefond',when:[/rentefond/],topics:['funds'],near:['funds'],label:'rentefond',covers:/rentefond/i}
];
const GENERIC=['spare','sparer','sparing','sparingen','penger','pengene','økonomi','økonomien','råd','tips','hjelp'];
// Hver registrering gir ny innholdsversjon, slik at søket bygger ordlisten om bare da.
let contentVersion=0;
function search(text){return S.search(text,topics,{broad:BROAD,gaps:GAPS,generic:GENERIC,version:contentVersion});}
// Sikre treff, i rangert rekkefølge. Forslag (tastefeil, brede ord) ligger i search().suggestions.
// Bare treff som er svar. «Nærmeste» (kjent hull) og nektede temaer er aldri svar.
function findTopics(text){return search(text).hits.filter(h=>h.kind!=='nearest'&&h.kind!=='negated').map(h=>h.id);}
function number(v,min,max,name){if(v===''||v===undefined||v===null)return null; const n=Number(String(v).replace(',','.'));if(!Number.isFinite(n)||n<min||n>max)throw Error(name+' må være et tall mellom '+min+' og '+max+'.');return n;}
function validate(p={}){
 const out={age:number(p.age,0,110,'Alder'),years:number(p.years,0,80,'Tidshorisont')};
 if(out.age!==null&&!Number.isInteger(out.age))throw Error('Oppgi alder i hele år.');
 const allowed={buffer:['','yes','no'],debt:['','yes','no'],income:['','stable','uncertain'],risk:['','low','medium','high'],discipline:['','automatic','flexible'],fixed:['','yes','no'],owner:['','yes','no'],tax:['','yes','no']};
 for(const [k,values]of Object.entries(allowed)){const v=p[k]||'';if(!values.includes(v))throw Error('Ugyldig valg for '+k+'.');out[k]=v;}
 return out;
}
function category(id){return topics.find(t=>t.id===id)?.category||id;}
function isExplainer(id){return topics.find(t=>t.id===id)?.entry?.kind==='explainer';}
function horizonRelevant(id){return ['funds','children','pension'].includes(category(id));}
function fundRelevant(id,p={}){return ['mortgage','funds','pension','children','bsu'].includes(category(id))&&!(p.debt==='yes'&&p.buffer==='no');}
function suggestions(profile={},current){
 const p=validate(profile),list=[];
 const add=(id,title)=>{if(id!==current&&!list.some(x=>x.id===id))list.push({id,title});};
 if(p.debt==='yes')add('buffer',p.buffer==='no'?'Hvordan bygge en reserve og betale ned dyr gjeld?':'Bør jeg prioritere dyr gjeld før mer sparing?');
 else if(p.buffer==='no')add('buffer','Hvordan bygger jeg en buffer som passer økonomien min?');
 else if(p.income==='uncertain')add('buffer','Hvordan spare når inntekten varierer?');
 const urgent=p.debt==='yes'||p.buffer==='no';
 if(!urgent&&p.age!==null&&p.age<=F.value('bsuMaxAge')&&p.owner==='no')add('q-bsu-basics',p.tax==='no'?'Hva gir BSU når jeg betaler lite skatt?':'Kan BSU passe til boligplanene mine?');
 if(!urgent&&(p.fixed==='yes'||p.owner==='yes'))add('mortgage',p.fixed==='yes'?'Hva bør jeg sjekke før ekstra avdrag med fastrente?':'Hvordan sammenligne boliglån og sparing?');
 if(!urgent&&(p.years!==null||p.risk==='low'))add('funds',p.years!==null&&p.years<F.value('fundMinYears')?'Hvor bør penger til et nært mål stå?':p.risk==='low'?'Hvordan spare uten store verdisvingninger?':'Hva bør jeg vurdere før sparing i fond?');
 if(!urgent)add('pension','Hva bør jeg sjekke før jeg binder penger til pensjon?');
 if(!urgent)add('funds','Når passer sparekonto, og når kan fond passe?');
 if(!urgent)add('children','Bør jeg spare i mitt eller barnets navn?');
 // Important topics stay accessible in the topic picker, even when not suggested.
 return list.slice(0,3);
}
function answer(id,profile){
 const t=topics.find(t=>t.id===id);if(!t)throw Error('Velg et av temaene vi dekker.');
 if(t.entry&&t.entry.kind==='explainer'){
  const e=t.entry;
  return F.resolve({title:t.title,kind:'explainer',terms:e.terms,example:e.example,next:e.next||null,caveat:e.caveat||'',parts:e.parts,sources:e.sources,checked:e.checked,missing:[],profile:validate(profile)});
 }
 if(t.entry){
  const base=answer(t.category,profile),entry=t.entry;
  const priority=base.parts.filter(p=>p.priority),rest=base.parts.filter(p=>!p.priority);
  return F.resolve({...base,title:t.title,parts:[...priority,...(entry.parts||[]),...rest],sources:[...entry.sources,...base.sources].filter((s,i,list)=>list.findIndex(other=>other.url===s.url)===i),checked:entry.checked,baseChecked:base.checked});
 }
 const p=validate(profile);const parts=[];let refs=[];
 const add=(title,text,priority=false)=>parts.push({title,text,priority});
 if(p.debt==='yes')add('Dyr gjeld først','Dyr gjeld betyr her gjeld med effektiv rente klart over sparerenten. Sammenlign renter og gebyrer, og ta hensyn til skatt. Nedbetaling kutter kostnader, men behold en liten reserve til nødvendige overraskelser.',true);
 if(p.buffer==='no')add('Sett av penger du kan bruke','Uten buffer kan en uventet regning føre til nye lån. Bygg en tilgjengelig reserve på konto. Størrelsen avhenger av utgifter og hvor mye som kan gå galt samtidig.',true);
 if(p.income==='uncertain')add('Ta høyde for inntektsfall','Med usikker inntekt er tilgjengelige penger ekstra viktige. Velg et sparebeløp som også tåler svakere måneder uten ny dyr gjeld.',true);
 const base={
 mortgage:['Det kommer an på hva du trenger mest','Ekstra nedbetaling reduserer gjeld og framtidige renteutgifter. Fond kan gi høyere avkastning, men også tap. Penger du har betalt inn på boliglånet, er normalt ikke fritt tilgjengelige uten en ny avtale med banken.','mortgage','pension','fixed'],
 student:['Skill mellom trygghet og investering','Studielån kan gi rom i studentøkonomien, men er fortsatt gjeld. Å beholde en reserve på konto og å investere lånte penger i aksjefond er to forskjellige valg. Fondsverdien kan falle mens lånet består.','student','grant'],
 children:['Hvem skal eie pengene?','I barnets navn tilhører pengene barnet. I ditt navn beholder du råderetten, men pengene inngår i din økonomi. Arv, kreditorer og et eventuelt samlivsbrudd kan få betydning. Bruk tid på eierskapet før du velger spareprodukt.','child','adult','grant'],
 buffer:['Begynn med utgiftene dine','En buffer skal dekke uforutsette, nødvendige utgifter. Ta utgangspunkt i bolig, transport, forsørgeransvar og inntekt. Det finnes ikke ett riktig antall månedslønner for alle. En tilgjengelig sparekonto passer bedre til dette formålet enn aksjefond.','mortgage','nav'],
 funds:['Når trenger du pengene?','Sparekonto og aksjefond løser ulike behov. Konto gir mer forutsigbarhet. Et bredt aksjefond sprer risikoen mellom selskaper, men kan likevel falle mye. Se på samlede kostnader, også eventuelle plattformgebyrer.','funds','risk'],
 pension:['Planlegg for uttakene, ikke bare pensjonsdagen','Mange reduserer risiko når uttakene nærmer seg. Det kan begrense faren for å måtte selge mye etter et børsfall. Samtidig kan deler av pengene ha lang tid igjen i markedet når pensjonen begynner.','pension','mortgage','funds'],
 bsu:['Sjekk vilkårene før du binder pengene','BSU kan være gunstig for boligsparing når du oppfyller vilkårene og betaler nok skatt til å bruke fradraget. Pengene er bundet til godkjente boligformål. Les reglene før du setter inn eller tar ut penger.','bsu']
 }[id];
 add(base[0],base[1]);refs=base.slice(2);
 if(['mortgage','children','bsu'].includes(id))refs.push('funds');
 if(horizonRelevant(id)&&fundRelevant(id,p)){
 if(p.years===null)add('Dette mangler jeg','Oppgi når akkurat disse pengene skal brukes. Alder alene forteller ikke om aksjefond passer. Tidshorisonten gjelder pengene i dette spørsmålet, ikke nødvendigvis all sparingen din.');
 else if(p.years<F.value('fundMinYears'))add('Pengene skal brukes snart','Forbrukerrådet anbefaler minst {{fundMinYears}} års sparehorisont for aksjefond. Med kortere tid er det begrenset rom for å hente inn et fall. For et fast og viktig kjøp taler det for forutsigbarhet. Dette er en anbefaling, ikke en regel eller garanti.');
 else add('Lang tid hjelper, men er ikke nok alene','Forbrukerrådets anbefaling om minst {{fundMinYears}} år er ingen garanti for gevinst. Avklar hvor fast bruksdatoen er, hvor mye tap økonomien tåler, og om pengene kan stå gjennom en nedtur.');
 }
 if(p.risk==='low'&&fundRelevant(id,p))add('Uro teller også','Store verdifall kan gjøre en fondsplan vanskelig å følge. Vurder en mer forutsigbar plassering for penger som ikke tåler slike svingninger.');
 // Teksten om å spare i stedet for å betale ekstra gjelder bare temaer med et lån å betale ned.
 const effort={mortgage:'Hvis du velger sparing framfor ekstra avdrag, må pengene faktisk bli spart. Et automatisk trekk kan hjelpe. Hvis sparebeløpet ofte brukes opp, kan ekstra nedbetaling gi mer forutsigbar framdrift. Behold en buffer først.',
  student:'Hvis du velger sparing framfor ekstra innbetaling på studielånet, må pengene faktisk bli spart. Et automatisk trekk kan hjelpe. Hvis sparebeløpet ofte brukes opp, kan ekstra innbetaling gi mer forutsigbar framdrift. Behold en buffer først.',
  funds:'En spareplan virker bare hvis den blir fulgt. Et automatisk trekk kan gjøre det lettere å spare jevnlig. Velg et beløp du klarer også i trangere måneder, og behold en buffer først.',
  pension:'Pensjonssparing varer ofte i mange år. Et automatisk trekk kan gjøre det lettere å holde planen. Velg et beløp du klarer over tid, og behold en buffer først.'};
 if(Object.hasOwn(effort,id))add('Hva krever det av deg?',p.discipline==='automatic'?'Et fast trekk kan gjøre det lettere å gjennomføre sparingen. Det fjerner hverken tapsrisiko eller behovet for å tilpasse beløpet når økonomien endrer seg.':effort[id]);
 if(id==='mortgage'){
 add('Sammenlign på samme grunnlag','Sammenlign spart rente etter virkningen av rentefradrag med fondsavkastning etter kostnader og skatt. En forventet fondsavkastning er usikker. En kombinasjon av sparing og ekstra avdrag kan også være aktuell.');
 add(p.fixed==='yes'?'Du har fastrente':'Har du fastrente?', 'Ved fastrente kan ekstra innbetaling utløse overkurs eller underkurs. Be banken regne ut kostnaden og forklare avtalen før du bestemmer deg. Ved flytende rente vil rentebesparelsen endre seg når renten endres.');
 }
 if(id==='student'){
 add('Renter og stipend','Lånet er normalt rentefritt mens du får støtte til fulltidsutdanning. Andre studiesituasjoner kan ha andre regler. Inntekt, nettoformue og studieprogresjon påvirker om lån blir stipend. Sjekk vilkårene hos Lånekassen.');
 add('Før du låner mer eller betaler ekstra','Penger på konto og avkastning kan påvirke skatteoppgjøret som Lånekassen bruker. Lån reduserer normalt nettoformuen, så et lånebeløp på konto betyr ikke automatisk mindre stipend. Se også på betalingslettelser og eventuelle ordninger for gjeldssletting før ekstra nedbetaling.');
 }
 if(id==='children'){
 add('Råderett og forvaltning','Barnet får som hovedregel råderett ved {{adultAge}} år. Større finansielle eiendeler kan omfattes av Statsforvalterens forvaltning. Gavebrev og testament kan ha betydning. Avklar dagens regler og eventuelle unntak før store overføringer.');
 add('Når barnet blir student','Formue i barnets navn kan senere påvirke retten til stipend. Vurder eierskap, tid til bruk og barnets situasjon sammen. Et separat fond i ditt navn gjør ikke barnet til juridisk eier.');
 }
 if(id==='pension')add('Få oversikt før du binder mer','Undersøk forventet pensjonsinntekt og behovet for egne uttak. Se på kostnader, skatteregler og binding før du velger pensjonsprodukter. Denne veilederen beregner ikke pensjonsrettigheter eller IPS-regler.');
 if(id==='bsu'){
 if(p.age!==null&&p.age>F.value('bsuMaxAge'))add('Aldersgrensen','Nye BSU-innskudd kan gjøres til og med året du fyller {{bsuMaxAge}}. Etter dette kan du ikke gjøre nye innskudd. En eksisterende konto har egne regler for videre bruk.');
 if(p.owner==='yes')add('Du eier bolig','Eier du bolig ved utgangen av året, får du ikke BSU-fradrag for det året. Vurder rente, binding og andre sparealternativer separat.');
 if(p.tax==='no')add('Du betaler lite eller ingen skatt','Fradraget kan ikke bli større enn skatten det kan trekkes fra. Ikke regn med fullt BSU-fradrag uten å sjekke skatten din.');
 }
 if(p.debt==='yes'||id==='buffer'){refs.push('nav');add('Hvis regningene ikke går opp','Ved betalingsproblemer er neste steg å få oversikt over nødvendige utgifter og kontakte kreditorer tidlig. Nav tilbyr gratis økonomi- og gjeldsrådgivning. Det er mer relevant enn å lete etter høyere fondsavkastning.');}
 if(p.buffer==='no'||p.debt==='yes')refs.push('nav');
 if(id==='pension')add('Penger til de første uttaksårene','Skill mellom penger som skal brukes først og penger som kan stå lenger. Pensjonsstart betyr ikke at hele sparebeløpet skal tas ut samtidig.');
 return F.resolve({title:t.title,parts,sources:[...new Set(refs)].map(k=>({id:k,title:sources[k][0],url:sources[k][1]})),checked,missing:['buffer','debt','income','risk'].filter(k=>!p[k]),profile:p});
}
function register(entry){
 if(!entry||!/^q-[a-z0-9-]+$/.test(entry.id)||topics.some(t=>t.id===entry.id))throw Error('Ugyldig eller duplisert spørsmål.');
 if(entry.kind==='explainer'){
  // Forklaring: «hva er dette?». Ingen alternativkort. Kort svar (intro), begreper, eksempel, fordypning og kilder.
  if(!entry.title||!entry.intro||!entry.checked||!entry.questions?.length||!entry.words?.length||!entry.sources?.length||entry.options)throw Error('Ufullstendig forklaring.');
  if(!entry.terms?.length||entry.terms.some(x=>!x.term||!x.text))throw Error('En forklaring trenger begreper med forklaring.');
  if(!entry.example?.title||!entry.example?.text)throw Error('En forklaring trenger et eksempel.');
  if(!entry.parts?.length||entry.parts.some(x=>!x.title||!x.text))throw Error('En forklaring trenger fordypning.');
  if(entry.next&&(!entry.next.text||!entry.next.href))throw Error('Ufullstendig lenke videre.');
  for(const source of entry.sources)if(!source.title||!source.url?.startsWith('https://'))throw Error('Manglende kilde.');
  if((entry.keys||[]).some(x=>!/^[a-zæøå0-9]+$/.test(x)))throw Error('Ugyldig søkeord.');
  topics.push({id:entry.id,title:entry.title,category:'explain',questions:entry.questions,words:entry.words,keys:entry.keys||[],entry});contentVersion++;
  return;
 }
 if(!topics.some(t=>t.id===entry.category&&!t.entry)||!entry.title||!entry.intro||!entry.checked||!entry.questions?.length||!entry.words?.length||entry.options?.length!==2||!entry.sources?.length)throw Error('Ufullstendig spørsmål.');
 for(const o of entry.options)if(!o.title||!o.poorFit||!(o.pros?.length>=2)||!(o.cons?.length>=2)||[...o.pros,...o.cons].some(i=>!i.title||!i.text))throw Error('Hvert alternativ trenger minst to fordeler, to ulemper og når det passer dårlig.');
 for(const source of entry.sources)if(!source.title||!source.url?.startsWith('https://'))throw Error('Manglende kilde.');
 if((entry.keys||[]).some(x=>!/^[a-zæøå0-9]+$/.test(x)))throw Error('Ugyldig søkeord.');
 topics.push({id:entry.id,title:entry.title,category:entry.category,questions:entry.questions,words:entry.words,keys:entry.keys||[],entry});contentVersion++;
}
const api={topics,findTopics,search,gaps:GAPS,reason:S.reason,answer,validate,checked,sources,register,category,isExplainer,horizonRelevant,fundRelevant,suggestions};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SpareVeileder=api;
})(typeof window!=='undefined'?window:globalThis);
