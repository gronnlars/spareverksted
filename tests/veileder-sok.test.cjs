// Søketestsett for «Spør om sparing». 30 spørsmål skrevet slik folk kan skrive dem, uten krav om fagord.
// expect: temaet som skal komme først, eller null når veilederen ikke har et svar.
// also:   andre temaer som også svarer på spørsmålet og kan godtas først.
// proof:  tekst som må stå i svaret brukeren får. Slik kontrolleres forventet tema mot selve svarteksten.
// Forklaringer som bare finnes i kalkulatoren, teller ikke som dekket her.
const assert=require('node:assert/strict');
const V=require('../dist/veileder-engine.js'),Cards=require('../dist/veileder-cards.js');
for(const e of require('../dist/veileder-knowledge.js'))V.register(e);

// Hele svaret uten profil: kortsvar, alternativer med fordeler og ulemper, og utfyllende vurdering.
const answerText=id=>{const a=Cards.build(id,{});return [a.title,a.intro,a.note,...a.steps,...a.options.flatMap(o=>[o.title,o.subtitle,...o.pros.map(i=>i.title+': '+i.text),...o.cons.map(i=>i.title+': '+i.text),'Passer dårlig hvis '+o.poorFit]),...a.parts.map(p=>p.title+': '+p.text)].filter(Boolean).join('\n');};

const SET=[
 // Dekket av et svar i veilederen
 {q:'Bør jeg betale ned lån eller spare?',expect:'mortgage',proof:/Ekstra nedbetaling reduserer gjeld/},
 {q:'Lønner det seg å betale ekstra på huslånet?',expect:'mortgage',proof:/Du sparer renteutgifter/},
 {q:'Bør jeg nedbetale boliglånet fortere eller kjøpe fond?',expect:'mortgage',proof:/Fond kan gi høyere avkastning enn rentebesparelsen/},
 {q:'Hvor mye bør jeg ha i buffer?',expect:'buffer',proof:/ikke ett riktig antall månedslønner/},
 {q:'Hvor mye penger bør jeg ha på konto i tilfelle noe uventet skjer?',expect:'buffer',proof:/uforutsette, nødvendige utgifter/},
 {q:'Jeg har kredittkortgjeld, bør jeg begynne å spare?',expect:'buffer',proof:/Betale ned dyr gjeld/},
 {q:'Jeg klarer ikke å betale regningene mine',expect:'buffer',proof:/gratis økonomi- og gjeldsrådgivning/},
 {q:'Lønner det seg å spare i banken?',expect:'funds',proof:/Konto gir mer forutsigbarhet/},
 {q:'Bør jeg ha pengene i fond eller på sparekonto?',expect:'funds',proof:/Sparekonto og aksjefond løser ulike behov/},
 {q:'Kan jeg tape penger på fond?',expect:'funds',proof:/Verdien kan falle mye/},
 {q:'Jeg trenger pengene om tre år, hvor bør de stå?',expect:'funds',proof:/Velg ut fra når pengene trengs/},
 // Forklaringen «Hva er kjøpekraft?» svarer best. Sparekonto-svaret har bare én setning om temaet og godtas som alternativ.
 {q:'Hvorfor blir pengene mindre verdt på sparekontoen?',expect:'q-kjopekraft',also:['funds'],proof:/Kjøpekraft er hvor mye du kan kjøpe for pengene|Renten etter skatt kan være lavere enn prisveksten/},
 {q:'Hva er BSU?',expect:'q-bsu-basics',proof:/boligsparing for ungdom/},
 {q:'Får jeg BSU-fradrag hvis jeg allerede eier leilighet?',expect:'q-bsu-basics',also:['bsu'],proof:/Eier du bolig ved årets slutt|ikke eier bolig ved årets slutt/},
 {q:'Vi skal kjøpe leilighet om to år, hvordan bør vi spare egenkapitalen?',expect:'bsu',also:['funds'],proof:/uegnet nær boligkjøp|tilgjengelige til en fast, nær dato/},
 {q:'Bør jeg spare i mitt eller barnets navn?',expect:'children',proof:/I barnets navn gir du pengene fra deg/},
 {q:'Vil spare til barnebarnet mitt, hva bør jeg tenke på?',expect:'children',proof:/Eierskapet betyr minst like mye/},
 {q:'Kan sparepenger i barnets navn gi mindre stipend?',expect:'children',also:['student'],proof:/mindre stipend|blir stipend/},
 {q:'Bør jeg ta opp studielån når jeg har sparepenger?',expect:'student',proof:/Studielån kan gi trygghet/},
 {q:'Lønner det seg å betale ned studielånet fortere?',expect:'student',proof:/Låne mindre eller betale ekstra/},
 {q:'Bør jeg redusere risikoen før jeg blir pensjonist?',expect:'pension',proof:/Mange reduserer risiko når uttakene nærmer seg/},
 {q:'Hva er forskjellen på IPS og ASK?',expect:'q-ips-ask',proof:/IPS er bundet pensjonssparing/},
 {q:'Hva er en aksjesparekonto?',expect:'q-ask-zero',also:['q-ips-ask'],proof:/På ASK tas innskudd normalt ut før skattepliktig gevinst|ASK gir mer tilgang til pengene/},
 // Ikke dekket. Et treff her er misvisende: brukeren får et svar på noe annet enn det hen spurte om.
 {q:'Hvordan blir fond skattlagt?',expect:null,why:'Fondssvaret har ingen skatteregler for fond. ASK-svaret forklarer bare forskjellen mellom to kontotyper.'},
 {q:'Er det dumt å ha alle sparepengene på brukskonto?',expect:null,why:'Ingen svar sammenligner brukskonto med sparekonto.'},
 {q:'Bør jeg velge fastrente eller flytende rente?',expect:null,why:'Boliglånssvaret omtaler fastrente bare ved ekstra innbetaling, ikke valget av rente.'},
 {q:'Hva er renters rente?',expect:null,why:'Forklares ikke i veilederen. Effekten vises bare i kalkulatoren.'},
 {q:'Hva er formuesskatt?',expect:null,why:'Bare nevnt som fritak i IPS-svaret, ikke forklart.'},
 {q:'Vi skal skilles, hva skjer med sparepengene?',expect:null,why:'Samlivsbrudd er nevnt i én setning i barnesvaret, ikke besvart.'},
 {q:'Jeg har arvet 500 000 kroner, hva bør jeg gjøre?',expect:null,why:'Ikke dekket.'}
];

// Kjente misvisende treff som søkeordene ikke har rettet. Tom etter denne endringen. Lista skal bare krympe.
// Grunnlinje før endringen (main ac0c446): «Hvordan blir fond skattlagt?» ga fondssvaret, og
// «Bør jeg velge fastrente eller flytende rente?» ga boliglånssvaret.
const KNOWN_MISLEADING=new Map();

// Regresjonskontroller utenfor de 30. Fanget mens søkeordene ble lagt til: et ord kan treffe for bredt.
const EXTRA=[
 ['Har du tips til uventede utgifter?','buffer'],          // «ips» i «tips» ga pensjon
 ['Bør jeg nedbetale studielånet?','student'],              // «nedbetal…lån» ga boliglån
 ['Nedbetaling av lån eller sparing?','mortgage'],
 ['Hvordan blir pensjonen skattlagt?',null],                // pensjonssvaret har ingen skatteregler
 ['Hva skjer med skatten hvis jeg selger fond?',null],
 ['Skatt på sparekonto',null],
 ['Fast eller flytende rente på boliglånet?',null],
 ['Hva skjer hvis banken går konkurs?',null],
 ['Skatt på ASK','q-ips-ask'],                              // ASK-svarene har skatt og skal fortsatt treffe
 ['Skal jeg ha aksjesparekonto eller IPS?','q-ips-ask']
];

assert.equal(SET.length,30,'Testsettet skal ha 30 spørsmål');
for(const id of new Set(SET.flatMap(c=>[c.expect,...(c.also||[])]).filter(Boolean)))assert.ok(V.topics.some(t=>t.id===id),'Ukjent tema '+id);

// 1. Testsettet selv: beviset for forventet tema står i svarteksten, også for godkjente alternativer.
for(const c of SET.filter(c=>c.expect))for(const id of [c.expect,...(c.also||[])])
 assert.match(answerText(id),c.proof,`Svaret «${id}» inneholder ikke beviset for «${c.q}»`);

// 2. Søket.
const report={right:[],wrong:[],missing:[],misleading:[],honest:[]};
for(const c of SET){
 const hits=V.findTopics(c.q),top=hits[0]||null;
 if(c.expect){
  if(top===null)report.missing.push(c.q);
  else if([c.expect,...(c.also||[])].includes(top))report.right.push(c.q);
  else report.wrong.push(`${c.q} → ${top}`);
 }else{
  if(top===null)report.honest.push(c.q);
  else report.misleading.push(c.q);
 }
}
assert.deepEqual(report.wrong,[],'Feil tema først');
assert.deepEqual(report.missing,[],'Dekket spørsmål uten treff');
for(const q of report.misleading)assert.equal(V.findTopics(q)[0],KNOWN_MISLEADING.get(q),'Nytt misvisende treff: '+q);
for(const [q] of KNOWN_MISLEADING)assert.ok(report.misleading.includes(q),'Rettet? Fjern fra KNOWN_MISLEADING: '+q);

for(const [q,want] of EXTRA)assert.equal(V.findTopics(q)[0]??null,want,'Utenfor settet: '+q);

// Kontroll av filtrene (not) utenfor settet. Et filter skal bare skjule et svar når spørsmålet gjelder noe svaret
// ikke dekker. Det skal ikke skjule et relevant svar bare fordi spørsmålet nevner skatt eller rentetype.
// want: godkjente første treff (null = ingen treff). removed: svaret filteret fjerner (null = filteret gjør ingenting).
const withoutFilter=q=>{const saved=V.topics.map(t=>[t,t.not]);for(const t of V.topics)delete t.not;try{return V.findTopics(q);}finally{for(const [t,n] of saved)if(n)t.not=n;}};
const FILTER_CONTROL=[
 // Skatt er selve spørsmålet. Fond og pensjon har ingen skatteregler, så de skjules.
 ['Hvordan blir fond skattlagt?',[null],'funds'],
 ['Hvor mye skatt betaler jeg på fond?',[null],'funds'],
 ['Hva skjer med skatten hvis jeg selger fond?',[null],'funds'],
 ['Hvordan unngår jeg skatt på fondsgevinst?',[null],'funds'],
 ['Skal jeg ha pengene i fond eller i banken når jeg betaler formuesskatt?',[null],'funds'],
 ['Skatt på sparekonto',[null],'funds'],
 ['Hvordan blir pensjonen skattlagt?',[null],'pension'],
 // Skatt er en del av et spørsmål svaret dekker. Svaret skal vises.
 ['Hvordan påvirker skatt valget mellom sparekonto og fond?',['funds'],null],
 ['Bør jeg velge fond eller sparekonto med tanke på skatt?',['funds'],null],
 ['Er indeksfond lurt når man tenker på skatt?',['funds'],null],
 ['Gir renter på sparekonto skatt?',['funds'],null],       // tynt: én setning om rente etter skatt
 ['Hvordan bør jeg ta ut pensjonssparingen med tanke på skatt?',['pension'],null],
 ['Når jeg blir pensjonist, hvordan tar jeg ut pengene uten å betale for mye skatt?',['pension'],null],
 ['Bør jeg spare i BSU eller fond med tanke på skatt?',['bsu','funds','q-bsu-basics'],null], // likt antall treff
 // Temaer med skatt i svaret har ikke filter og skal fortsatt treffe.
 ['Hvordan blir fond skattlagt på aksjesparekonto?',['q-ask-zero'],'funds'],
 ['Hvordan skattlegges IPS?',['q-ips-ask'],'pension'],
 ['Får jeg skattefradrag for BSU?',['bsu','q-bsu-basics'],null],
 ['Bør jeg betale ned boliglånet når jeg får rentefradrag på skatten?',['mortgage'],null],
 ['Må barnet betale skatt av sparepengene sine?',['children'],null],
 ['Påvirker studielånet skatten min?',['student'],null],
 // Rentetype: skjules bare når valget av fast eller flytende rente er selve spørsmålet.
 ['Bør jeg velge fast eller flytende rente på huslånet?',[null],'mortgage'],
 ['Fastrente eller flytende, hva er best når jeg skal betale ekstra på boliglånet?',['mortgage'],null],
 ['Har du fastrente, kan du betale ekstra avdrag?',['mortgage'],null]
];
for(const [q,want,removed] of FILTER_CONTROL){
 const top=V.findTopics(q)[0]??null,before=withoutFilter(q);
 assert.ok(want.includes(top),`Filterkontroll: «${q}» ga ${top}, forventet ${want.join(' eller ')}`);
 const gone=before.filter(id=>!V.findTopics(q).includes(id));
 assert.deepEqual(gone,removed?[removed]:[],`Filterkontroll: «${q}» skal fjerne ${removed??'ingenting'}, fjernet ${gone.join(',')||'ingenting'}`);
}

// Kjente hull i filteret: misvisende treff som mønstrene ikke fanger. Dette er ikke godkjente svar. Testen sier fra
// når et hull er tettet, så lista kan krympe. «Hvor mye skatt betaler jeg på fond?» er tettet med et snevert mønster.
// Andre formuleringer av skatt på fond kan fortsatt slippe gjennom. Se tests/veileder-sok-utvidet.test.cjs.
const KNOWN_FILTER_GAPS=[];
for(const [q,now] of KNOWN_FILTER_GAPS)assert.equal(V.findTopics(q)[0]??null,now,'Kjent hull er endret, oppdater KNOWN_FILTER_GAPS: '+q);

// 3. Skatt på fond skal aldri regnes som besvart av det generelle fondssvaret.
assert.equal(V.findTopics('Hvordan blir fond skattlagt?')[0]??null,null,'Det generelle fondssvaret godkjennes ikke som svar på skatt på fond');
assert.doesNotMatch(answerText('funds'),/37,84|skjerming|gevinstskatt|skattes ved salg/i,'Fondssvaret har fått skatteregler. Vurder testsettet på nytt.');

// 4. Eksempelspørsmålene i hvert tema treffer fortsatt sitt eget tema.
for(const t of V.topics)for(const q of t.questions)assert.ok(V.findTopics(q).includes(t.id),'Eksempelspørsmål treffer ikke eget tema: '+q);

console.log(`Søk: ${report.right.length} av ${SET.filter(c=>c.expect).length} dekkede spørsmål får riktig tema først. `+
 `${report.honest.length} av ${SET.filter(c=>!c.expect).length} udekkede gir ingen treff. Kjente misvisende treff: ${report.misleading.length}.`);
