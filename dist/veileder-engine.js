/* Editorial, deterministic guidance. No model, network calls or product recommendations. */
(function(root){
'use strict';
const checked='2026-10-22';
const sources={
 funds:['Forbrukerrådet: fond og spareprofiler','https://www.forbrukerradet.no/sparing-i-fond-og-spareprofiler/'],
 pension:['Forbrukerrådet: pensjon fra egen sparing','https://www.forbrukerradet.no/finansportalen/pensjon/pensjon-fra-egen-sparing/'],
 mortgage:['KLP: betale lån eller spare? (kommersiell tilbyder)','https://www.klp.no/artikler/nedbetale-lan-eller-spare'],
 fixed:['Husbanken: ekstra innbetaling og fastrente','https://husbanken.no/kunde-i-husbanken/ekstraordinaer-betaling-paa-laan/'],
 student:['Lånekassen: renter og gebyrer','https://lanekassen.no/nb-NO/gjeld-og-betaling/renter-og-gebyrer/'],
 grant:['Lånekassen: omgjøring til stipend','https://lanekassen.no/nb-NO/stipend-og-lan/omgjoring-av-basislan/'],
 child:['Statsforvalteren: bank og forvaltning for barn (arkivside)','https://utdatert.statsforvalteren.no/ostfold-buskerud-oslo-og-akershus/vergemal/vergemal-for-barn/jeg-er-verge/bank-og-forvaltning/'],
 nav:['Nav: økonomi- og gjeldsrådgivning','https://www.nav.no/okonomi-gjeld'],
 bsu:['Skatteetaten: BSU','https://www.skatteetaten.no/nn/person/skatt/hjelp-til-rett-skatt/bank-og-lan/bsu--bustadsparing-for-ungdom/'],
 risk:['Finanstilsynet: informasjon om verdipapirfond','https://www.finanstilsynet.no/forbrukerinformasjon/verdipapirforetak-verdipapirfond-og-alternative-investeringsfond/']
};
const topics=[
 {id:'mortgage',title:'Boliglån eller sparing',words:[/boligl[aå]n/,/husl[aå]n/,/fastrente/,/avdrag/,/nedbetal.*l[aå]n/],questions:['Bør jeg betale ned boliglånet eller spare i fond?','Hva hvis jeg har fastrente?','Er lavere gjeld viktigere enn høyere avkastning?','Kan jeg spare og betale ekstra avdrag samtidig?']},
 {id:'student',title:'Studielån',words:[/studiel[aå]n/,/l[aå]nekassen/,/stipend/,/student/],questions:['Bør jeg ta opp studielån selv om jeg har sparepenger?','Bør jeg investere studielånet?','Bør jeg betale ned studielånet raskere?','Kan sparing påvirke stipendet mitt?']},
 {id:'children',title:'Sparing til barn',words:[/barn/,/gavebrev/,/statsforvalter/],questions:['Bør jeg spare i mitt eller barnets navn?','Hva skjer når barnet fyller 18 år?','Kan sparepengene påvirke barnets stipend?','Bør barnas sparepenger stå i fond?']},
 {id:'buffer',title:'Buffer og dyr gjeld',words:[/buffer/,/kredittkort/,/forbruksl[aå]n/,/inkasso/,/regning/,/dyr gjeld/],questions:['Hvor stor buffer trenger jeg?','Bør jeg spare når jeg har kredittkortgjeld?','Hva gjør jeg hvis jeg ikke får betalt regningene?','Hvor bør bufferen stå?']},
 {id:'funds',title:'Sparekonto eller fond',words:[/fond/,/aksj/,/indeks/,/sparekonto/,/risiko/,/b[oø]rs/],questions:['Bør jeg velge sparekonto eller fond?','Hvor mye risiko bør jeg ta?','Hva hvis jeg trenger pengene om tre år?','Hvordan unngår jeg å selge i panikk?']},
 {id:'pension',title:'Sparing til pensjon',words:[/pensjon/,/uttak/,/ips\b/],questions:['Bør jeg redusere risiko før pensjon?','Må alle sparepengene ut av fond når jeg pensjoneres?','Hvordan planlegger jeg uttak over mange år?','Hva bør jeg sjekke før jeg velger pensjonssparing?']},
 {id:'bsu',title:'BSU og boligkjøp',words:[/bsu/,/boligkj[oø]p/,/egenkapital/,/f[oø]rste bolig/],questions:['Bør jeg prioritere BSU?','Kan jeg få BSU-fradrag hvis jeg eier bolig?','Hva hvis jeg betaler lite skatt?','Bør egenkapital til bolig stå i fond?']}
];
function findTopics(text){
 const normalize=value=>String(value||'').toLocaleLowerCase('nb-NO').slice(0,600).trim().replace(/[?!.]+$/,'').replace(/\s+/g,' ');
 const q=normalize(text);
 if(!q.trim())return [];
 const exact=topics.filter(t=>t.questions.some(x=>normalize(x)===q)).map(t=>t.id);
 if(exact.length)return exact;
 return topics.map(t=>({id:t.id,score:t.words.reduce((n,re)=>n+(re.test(q)?1:0),0)})).filter(t=>t.score>0).sort((a,b)=>b.score-a.score).map(t=>t.id);
}
function number(v,min,max,name){if(v===''||v===undefined||v===null)return null; const n=Number(String(v).replace(',','.'));if(!Number.isFinite(n)||n<min||n>max)throw Error(name+' må være et tall mellom '+min+' og '+max+'.');return n;}
function validate(p={}){
 const out={age:number(p.age,0,110,'Alder'),years:number(p.years,0,80,'Tidshorisont')};
 if(out.age!==null&&!Number.isInteger(out.age))throw Error('Oppgi alder i hele år.');
 const allowed={buffer:['','yes','no'],debt:['','yes','no'],income:['','stable','uncertain'],risk:['','low','medium','high'],discipline:['','automatic','flexible'],fixed:['','yes','no'],owner:['','yes','no'],tax:['','yes','no']};
 for(const [k,values]of Object.entries(allowed)){const v=p[k]||'';if(!values.includes(v))throw Error('Ugyldig valg for '+k+'.');out[k]=v;}
 return out;
}
function answer(id,profile){
 const t=topics.find(t=>t.id===id);if(!t)throw Error('Velg et av temaene vi dekker.');
 if(t.entry){
  const base=answer(t.category,profile),entry=t.entry;
  return {...base,title:t.title,parts:[{title:t.title,text:entry.intro},...(entry.parts||[]),...base.parts],sources:[...entry.sources,...base.sources].filter((s,i,list)=>list.findIndex(other=>other.url===s.url)===i),checked:entry.checked,baseChecked:base.checked};
 }
 const p=validate(profile);const parts=[];let refs=[];
 const add=(title,text)=>parts.push({title,text});
 if(p.debt==='yes')add('Dyr gjeld først','Når du har dyr gjeld, er nedbetaling vanligvis et bedre utgangspunkt enn å ta mer investeringsrisiko. Behold samtidig nok til nødvendige utgifter, så neste uforutsette regning ikke gir ny kredittkortgjeld.');
 if(p.buffer==='no')add('Sett av penger du kan bruke','Du har oppgitt at du mangler buffer. Før du binder mer i bolig eller utsetter penger for børsfall, bør du vurdere en tilgjengelig reserve på konto. Størrelsen avhenger av utgifter og hvor mye som kan gå galt samtidig.');
 if(p.income==='uncertain')add('Ta høyde for inntektsfall','Med usikker inntekt er tilgjengelige penger ekstra viktige. En spareplan bør tåle svakere måneder uten at du må selge fond eller ta opp dyr gjeld.');
 const base={
 mortgage:['Det kommer an på hva du trenger mest','Ekstra nedbetaling reduserer gjeld og framtidige renteutgifter. Fond kan gi høyere avkastning, men også tap. Penger du har betalt inn på boliglånet, er normalt ikke fritt tilgjengelige uten en ny avtale med banken.','mortgage','pension','fixed'],
 student:['Skill mellom trygghet og investering','Studielån kan gi rom i studentøkonomien, men er fortsatt gjeld. Å beholde en reserve på konto og å investere lånte penger i aksjefond er to forskjellige valg. Fondsverdien kan falle mens lånet består.','student','grant'],
 children:['Hvem skal eie pengene?','I barnets navn tilhører pengene barnet. I ditt navn beholder du råderetten, men pengene inngår i din økonomi. Arv, kreditorer og et eventuelt samlivsbrudd kan få betydning. Bruk tid på eierskapet før du velger spareprodukt.','child','grant'],
 buffer:['Begynn med utgiftene dine','En buffer skal dekke uforutsette, nødvendige utgifter. Ta utgangspunkt i bolig, transport, forsørgeransvar og inntekt. Det finnes ikke ett riktig antall månedslønner for alle. En tilgjengelig sparekonto passer bedre til dette formålet enn aksjefond.','mortgage','nav'],
 funds:['Når trenger du pengene?','Sparekonto og aksjefond løser ulike behov. Konto gir mer forutsigbarhet. Et bredt aksjefond sprer risikoen mellom selskaper, men kan likevel falle mye. Se på samlede kostnader, også eventuelle plattformgebyrer.','funds','risk'],
 pension:['Planlegg for uttakene, ikke bare pensjonsdagen','Mange reduserer risiko når uttakene nærmer seg. Det kan begrense faren for å måtte selge mye etter et børsfall. Samtidig kan deler av pengene ha lang tid igjen i markedet når pensjonen begynner.','pension','mortgage','funds'],
 bsu:['Sjekk vilkårene før du binder pengene','BSU kan være gunstig for boligsparing når du oppfyller vilkårene og betaler nok skatt til å bruke fradraget. Pengene er bundet til godkjente boligformål. Les reglene før du setter inn eller tar ut penger.','bsu']
 }[id];
 add(base[0],base[1]);refs=base.slice(2);
 if(['mortgage','children','bsu'].includes(id))refs.push('funds');
 if(['mortgage','funds','pension','children','bsu'].includes(id)){
 if(p.years===null)add('Dette mangler jeg','Oppgi når akkurat disse pengene skal brukes. Alder alene forteller ikke om aksjefond passer. Tidshorisonten gjelder pengene i dette spørsmålet, ikke nødvendigvis all sparingen din.');
 else if(p.years<5)add('Pengene skal brukes snart','Med under fem år til bruk er det begrenset tid til å hente inn et børsfall. For et fast og viktig kjøp taler det for å prioritere forutsigbarhet. Høy alder eller ung alder endrer ikke dette behovet.');
 else if(p.years<10)add('Noen år er ikke en garanti','Med fem til ti år til bruk kan fond være aktuelt for en del av sparingen, men et fall kan vare lenge. Hvor fast uttaksdatoen er, og hvor mye tap du tåler, har stor betydning.');
 else if(p.buffer==='yes'&&p.debt==='no'&&p.risk==='high'&&p.income==='stable')add('Lang tid gir mer handlingsrom','Lang tid, buffer, stabil inntekt og rom for store svingninger kan gjøre en høyere aksjeandel aktuell for disse pengene. Det gir ingen garanti for gevinst. Vi fastsetter ikke en bestemt prosentandel.');
 else add('Lang tid hjelper, men er ikke nok alene','Ti år eller mer kan gi bedre rom for aksjerisiko. En høy aksjeandel forutsetter også at du tåler tap, har penger tilgjengelig til andre behov og kan la sparingen stå gjennom en nedtur.');
 }
 if(p.age!==null&&['pension','funds','mortgage'].includes(id)){
 if(p.age>=55)add('Alder og pensjon','Når du er '+p.age+' år, kan pensjon og lavere arbeidsinntekt være nærmere. Avklar hvilke penger du trenger først. Langsiktige midler kan vurderes annerledes enn penger til de første uttaksårene.');
 else if(p.age<30)add('Du har mange år foran deg','Som '+p.age+'-åring kan du ha lang tid til pensjon. Det kan gi rom for høyere aksjeandel i pensjonssparingen, men penger til bolig eller andre nære mål trenger en egen vurdering.');
 }
 if(p.risk==='low')add('Uro teller også','Du vil helst unngå store fall. En høy aksjeandel kan da bli vanskelig å holde fast ved, selv med lang tidshorisont. En plan du klarer å følge, er mer nyttig enn en teoretisk høy forventet avkastning.');
 if(['mortgage','funds','student','pension'].includes(id))add('Hva krever det av deg?',p.discipline==='automatic'?'Et fast trekk kan gjøre det lettere å gjennomføre sparingen. Det fjerner hverken tapsrisiko eller behovet for å tilpasse beløpet når økonomien endrer seg.':'Hvis du velger sparing framfor ekstra avdrag, må pengene faktisk bli spart. Et automatisk trekk kan hjelpe. Hvis sparebeløpet ofte brukes opp, kan ekstra nedbetaling gi mer forutsigbar framdrift. Behold en buffer først.');
 if(id==='mortgage'){
 add('Sammenlign på samme grunnlag','Sammenlign spart rente etter virkningen av rentefradrag med fondsavkastning etter kostnader og skatt. En forventet fondsavkastning er usikker. En kombinasjon av sparing og ekstra avdrag kan også være aktuell.');
 add(p.fixed==='yes'?'Du har fastrente':'Har du fastrente?', 'Ved fastrente kan ekstra innbetaling utløse overkurs eller underkurs. Be banken regne ut kostnaden og forklare avtalen før du bestemmer deg. Ved flytende rente vil rentebesparelsen endre seg når renten endres.');
 }
 if(id==='student'){
 add('Renter og stipend','Lånet er normalt rentefritt mens du får støtte til fulltidsutdanning. Andre studiesituasjoner kan ha andre regler. Inntekt, nettoformue og studieprogresjon påvirker om lån blir stipend. Sjekk vilkårene hos Lånekassen.');
 add('Før du låner mer eller betaler ekstra','Penger på konto og avkastning kan påvirke skatteoppgjøret som Lånekassen bruker. Lån reduserer normalt nettoformuen, så et lånebeløp på konto betyr ikke automatisk mindre stipend. Se også på betalingslettelser og eventuelle ordninger for gjeldssletting før ekstra nedbetaling.');
 }
 if(id==='children'){
 add('Råderett og forvaltning','Barnet får som hovedregel råderett ved 18 år. Større finansielle eiendeler kan omfattes av Statsforvalterens forvaltning. Gavebrev og testament kan ha betydning. Avklar dagens regler og eventuelle unntak før store overføringer.');
 add('Når barnet blir student','Formue i barnets navn kan senere påvirke retten til stipend. Vurder eierskap, tid til bruk og barnets situasjon sammen. Et separat fond i ditt navn gjør ikke barnet til juridisk eier.');
 }
 if(id==='pension')add('Få oversikt før du binder mer','Undersøk forventet pensjonsinntekt og behovet for egne uttak. Se på kostnader, skatteregler og binding før du velger pensjonsprodukter. Denne veilederen beregner ikke pensjonsrettigheter eller IPS-regler.');
 if(id==='bsu'){
 if(p.age!==null&&p.age>=34)add('Aldersgrensen','Du har oppgitt at du er minst 34 år. Nye BSU-innskudd med skattefradrag gjelder til og med året du fyller 33. En eksisterende konto har egne regler for videre bruk.');
 if(p.owner==='yes')add('Du eier bolig','Eier du bolig ved utgangen av året, får du ikke BSU-fradrag for det året. Vurder rente, binding og andre sparealternativer separat.');
 if(p.tax==='no')add('Du betaler lite eller ingen skatt','Fradraget kan ikke bli større enn skatten det kan trekkes fra. Ikke regn med fullt BSU-fradrag uten å sjekke skatten din.');
 }
 if(p.debt==='yes'||id==='buffer'){refs.push('nav');add('Hvis regningene ikke går opp','Ved betalingsproblemer er neste steg å få oversikt over nødvendige utgifter og kontakte kreditorer tidlig. Nav tilbyr gratis økonomi- og gjeldsrådgivning. Det er mer relevant enn å lete etter høyere fondsavkastning.');}
 if(p.buffer==='no'||p.debt==='yes')refs.push('mortgage');
 return {title:t.title,parts,sources:[...new Set(refs)].map(k=>({id:k,title:sources[k][0],url:sources[k][1]})),checked,missing:['buffer','debt','income','risk'].filter(k=>!p[k]),profile:p};
}
function register(entry){
 if(!entry||!/^q-[a-z0-9-]+$/.test(entry.id)||topics.some(t=>t.id===entry.id))throw Error('Ugyldig eller duplisert spørsmål.');
 if(!topics.some(t=>t.id===entry.category&&!t.entry)||!entry.title||!entry.intro||!entry.checked||!entry.questions?.length||!entry.words?.length||entry.options?.length!==2||!entry.sources?.length)throw Error('Ufullstendig spørsmål.');
 for(const o of entry.options)if(!o.title||!o.pros?.length||!o.cons?.length||[...o.pros,...o.cons].some(i=>!i.title||!i.text))throw Error('Ufullstendige fordeler og ulemper.');
 for(const source of entry.sources)if(!source.title||!source.url?.startsWith('https://'))throw Error('Manglende kilde.');
 topics.push({id:entry.id,title:entry.title,category:entry.category,questions:entry.questions,words:entry.words,entry});
}
const api={topics,findTopics,answer,validate,checked,sources,register};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SpareVeileder=api;
})(typeof window!=='undefined'?window:globalThis);
