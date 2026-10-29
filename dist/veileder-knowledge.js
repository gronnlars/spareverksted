/* Reviewed question database. New entries stay under the existing seven categories. */
(function(root){
'use strict';
const F=typeof module!=='undefined'&&module.exports?require('./veileder-facts.js'):root.SpareFacts;
const date=F.checked;
const bsuRates=typeof module!=='undefined'&&module.exports?require('./bsu-rates.js'):root.SpareBsuRates;
const bsu={id:'tax-bsu',title:'Skatteetaten: BSU og vilkår',url:'https://www.skatteetaten.no/nn/person/skatt/hjelp-til-rett-skatt/bank-og-lan/bsu--bustadsparing-for-ungdom/'};
const ask={id:'tax-ask',title:'Skatteetaten: aksjesparekonto',url:'https://www.skatteetaten.no/nn/person/skatt/hjelp-til-rett-skatt/aksjar-og-verdipapir/om/aksjesparekonto-ask/'};
const ips={id:'tax-ips',title:'Skatteetaten: individuell sparing til pensjon, ny ordning',url:'https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/arbeid-trygd-og-pensjon/pensjon-og-uforetrygd/ny-ordning-for-skattefavorisert-individuell-sparing-til-pensjon/'};
const zeroTax={id:'tax-fondskonto',title:'Skatteetaten: skatt på fondskonto',url:'https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/aksjer-og-verdipapirer/om/skatteregler-investere-i-aksjer-og-andre-verdipapirer-gjennom-kapitalforsikring-fondskonto/'};
const ssb={id:'ssb-inflasjon',title:'SSB: Hva er inflasjon?',url:'https://www.ssb.no/priser-og-prisindekser/konsumpriser/artikler/hva-er-inflasjon'};
const askNo={id:'tax-ask-no',title:'Skatteetaten: aksjesparekonto (ASK)',url:'https://www.skatteetaten.no/person/skatt/hjelp-til-rett-skatt/aksjar-og-verdipapir/om/aksjesparekonto-ask/'};
const fondNo={id:'tax-fondskonto-no',title:'Skatteetaten: skatteregler for fondskonto (kapitalforsikring)',url:'https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/aksjer-og-verdipapirer/om/skatteregler-investere-i-aksjer-og-andre-verdipapirer-gjennom-kapitalforsikring-fondskonto'};
const fondRettledning={id:'tax-fondskonto-rettledning',title:'Skatteetaten: rettledning om fondskonto (for oppgavegivere), engelsk side',url:'https://www.skatteetaten.no/en/business-and-organisation/reporting-and-industries/third-part-data/bank-finans-og-forsikring/fondskonto/rettledning/'};
// Navn på de to kontotypene. Et enkeltnavn åpner sin egen forklaring bare når spørsmålet ikke nevner den andre kontotypen.
// Spørsmål som nevner begge går til sammenligningen (q-ask-zero).
const ASKNAVN='\\bask\\b|aksjesparekonto',FONDNAVN='fondskonto|kapitalforsikring|investeringskonto|unit ?link';
const alone=(name,other)=>new RegExp('(?<!(?:'+other+').*)(?:'+name+')(?!.*(?:'+other+'))');
const both=new RegExp('(?:'+ASKNAVN+').*(?:'+FONDNAVN+')|(?:'+FONDNAVN+').*(?:'+ASKNAVN+')');
const i=(title,text)=>({title,text});
const entries=[
// BEGIN GENERATED SV-022
{
 "kind": "explainer",
 "id": "q-renters-rente",
 "category": "funds",
 "title": "Hva er renters rente?",
 "checked": "2026-10-25",
 "keys": [
  "rentersrente",
  "rentesrente"
 ],
 "questions": [
  "Hva er renters rente?",
  "Hvordan fungerer renters rente?",
  "Hva er rentes rente?",
  "Hva betyr rente på rente?",
  "Får jeg renter på rentene?"
 ],
 "intro": "Renters rente betyr at du får renter også på renter du har fått tidligere. Når rentene blir stående, kan også de gi nye renter.",
 "terms": [],
 "example": {
  "title": "Eksempel: 10 000 kr i to år",
  "text": "10 000 kr til 5 % årlig rente blir 10 500 kr etter ett år og 11 025 kr etter to. Det andre året er rentene 525 kr, hvorav 25 kr kommer fra tidligere renter. Alle regneeksemplene bruker valgte tall, uten nye innskudd eller uttak med mindre annet er beskrevet, før skatt og kostnader. Prisvekst er bare med der den er oppgitt. Renten er uendret, med årlig rentetillegg, med mindre annet er beskrevet. Tallene er ingen prognose."
 },
 "parts": [
  {
   "title": "Tid og uttak",
   "text": "Ved 5 % rente blir startbeløpet omtrent 16 289 kr etter 10 år og 26 533 kr etter 20. Renten og tiden påvirker begge resultatet. Tas rentene ut årlig, blir de i stedet 500 kr per år: etter to år står 10 000 kr igjen, og 1 000 kr er utbetalt. Kontovilkårene avgjør når renter legges til."
  },
  {
   "title": "Skatt og kjøpekraft",
   "text": "Hovedregelen er at renteinntekt er skattepliktig. Skatt og kostnader reduserer beløpet. Med 2 % rente blir 10 000 kr til 10 404 kr etter to år. Ved 2,5 % prisvekst tilsvarer det omtrent 9 903 kr ved startens priser. Med 5 % rente ville også kjøpekraften økt."
  },
  {
   "title": "Fond svinger",
   "text": "Risiko og forventet avkastning varierer med plasseringen. 10 000 kr som stiger 10 % og så faller 10 %, blir 9 900 kr. Avkastning betyr det investeringen tjener eller taper."
  },
  {
   "title": "Regnemåte",
   "text": "Med fast rente og uten uttak: sluttbeløp = startbeløp × (1 + rente / 100) opphøyd i antall år. Renten skrives som prosenttall, for eksempel 5."
  }
 ],
 "sources": [
  {
   "id": "rente-skatt",
   "title": "Skatteetaten: Skatte-ABC R-10-1.1 Hovedregel (2025/2026)",
   "url": "https://www.skatteetaten.no/rettskilder/type/handboker/skatte-abc/gjeldende/r-10-renteinntekter/R-10.001/R-10.002/"
  },
  {
   "id": "ssb-inflasjon",
   "title": "SSB: Hva er inflasjon? (15.09.2022)",
   "url": "https://www.ssb.no/priser-og-prisindekser/konsumpriser/artikler/hva-er-inflasjon"
  },
  {
   "id": "finanstilsynet-fond",
   "title": "Finanstilsynet: verdipapirfond, risiko og kostnader",
   "url": "https://www.finanstilsynet.no/forbrukerinformasjon/verdipapirforetak-verdipapirfond-og-alternative-investeringsfond/"
  },
  {
   "id": "openstax-renters",
   "title": "OpenStax / Rice University: renters rente (på engelsk)",
   "url": "https://openstax.org/books/algebra-and-trigonometry-2e/pages/6-1-exponential-functions"
  }
 ],
 "caveat": "",
 "next": {
  "text": "Se regneeksempelet i kalkulatoren",
  "href": "index.html#start=10000&monthly=0&years=2&rate=5&fee=0&inflation=0&growth=0&extra=0&crash=0&real=0&showBank=0&showRange=0&level=explore&mode=explore",
  "more": [
   {
    "text": "Se flere kroner og lavere kjøpekraft i kalkulatoren",
    "href": "index.html#start=10000&monthly=0&years=2&rate=2&fee=0&inflation=2.5&growth=0&extra=0&crash=0&real=0&both=1&showBank=0&showRange=0&level=explore&mode=explore"
   }
  ]
 },
 "layout": "overview",
 "review": {
  "text": "Skatte-ABC: 2025/2026. SSB: 15.09.2022. Kildekontroll 25.10.2026. OpenStax-formelen lest 28.10.2026. Språkrevisjon samme dato, egenkontroll. Ingen ny uavhengig fagkontroll."
 },
 "words": ["rente(?:rs?|s) ?rente", "rente på rente", "renter på rentene"].map(s=>new RegExp(s))
},
// END GENERATED SV-022
{"kind":"explainer",
"id":"q-indeksfond",
"category":"funds",
"title":"Hva er et indeksfond?",
"checked":"2026-10-28",
"keys":["indeksfond",
"passivforvaltning"],
"questions":["Hva er et indeksfond?",
"Hva er indeksfond?",
"Hva betyr indeksfond?",
"Hvordan fungerer indeksfond?",
"Hva betyr passiv forvaltning?",
"Hva betyr passivt forvaltet fond?"],
"intro":"Et indeksfond forsøker å følge en bestemt indeks. En aksjeindeks måler utviklingen i et utvalg aksjer. Her brukes aksjebaserte indeksfond som eksempel.",
"terms":[],
"example":{"title":"Eksempel: ulik vekt i indeksen",
"text":"En forenklet indeks har 50 % i selskap A, 30 % i B og 20 % i C. Et fond som kopierer vektene, fordeler 1 000 kr som 500 kr, 300 kr og 200 kr. Dette viser vekting, ikke et virkelig fond eller tilstrekkelig spredning. Fond kan avvike fra indeksen."},
"parts":[{"title":"Samlet pris og dokumentasjon",
"text":"Prisen kan omfatte både forvaltningskostnader og plattformgebyr. Samme fond kan koste ulikt hos forskjellige tilbydere. Fondets nøkkelinformasjon beskriver risiko og kostnader. Skatt og kontovalg behandles i egne svar."}],
"sources":[{"id":"q-indeksfond-0",
"title":"Forbrukerrådet: Sparing i fond og spareprofiler",
"url":"https://www.forbrukerradet.no/sparing-i-fond-og-spareprofiler/"},
{"id":"q-indeksfond-2",
"title":"Finanstilsynet: Verdipapirforetak, verdipapirfond og alternative investeringsfond",
"url":"https://www.finanstilsynet.no/forbrukerinformasjon/verdipapirforetak-verdipapirfond-og-alternative-investeringsfond/"},
{"id":"q-indeksfond-3",
"title":"Forbrukerrådet: Nå kan du sjekke om du betaler for mye for fondet ditt",
"url":"https://www.forbrukerradet.no/siste-nytt/na-kan-du-sjekke-om-du-betaler-for-mye-for-fondet-ditt/"}],
"caveat":"",
"words":[/\bindeksfond\b/,
/passiv(?:t)? (?:forvaltning|forvaltet fond)/],
"review":{"text":"Kildene lest på nytt 28. oktober 2026. Finanstilsynets side er sist oppdatert 23. oktober 2026, Forbrukerrådets fondsside 16. oktober 2026 og Forbrukerrådets prissak publisert 20. oktober 2026, ifølge sidene. Ingen bestemt avkastning eller produktpris er forutsatt. Egenkontroll. Neste kildekontroll senest 25. januar 2027."},
"layout":"overview",
"tradeoffs":{"pros":[{"title":"Du slipper å velge enkeltaksjene",
"text":"Forvalteren følger indeksen framfor å forsøke å slå den. Det kalles passiv forvaltning."},
{"title":"Vanligvis lavere forvaltningskostnader",
"text":"Forvaltningskostnadene er vanligvis lavere enn i aktivt forvaltede fond."}],
"cons":[{"title":"Kan falle mye i verdi",
"text":"Aksjebaserte indeksfond kan falle mye selv med lave kostnader. Lang sparetid garanterer ikke gevinst."},
{"title":"Spredningen varierer",
"text":"Et land- eller bransjefond har en annen fordeling enn et bredt globalt fond. Indeksfond har derfor ulik risiko."}]}},
{"kind":"explainer",
"id":"q-sparing-investering",
"category":"funds",
"title":"Hva er forskjellen på sparing og investering?",
"checked":"2026-10-25",
"keys":[],
"questions":["Hva er forskjellen på sparing og investering?",
"Er fond sparing?",
"Er investering det samme som sparing?",
"Må jeg investere for å spare?"],
"intro":"Å spare betyr å sette av penger til senere. Å investere betyr å plassere penger med mål om avkastning og med risiko for tap, for eksempel i fond eller aksjer. Du kan spare både på bankkonto og gjennom investeringer.",
"terms":[],
"example":{"title":"Eksempel: ulike behov",
"text":"En uventet reparasjon krever penger straks. Et mål uten fast dato langt fram i tid kan gi mer rom for svingninger. Det betyr ikke at all langsiktig sparing bør investeres."},
"parts":[{"title":"Penger på konto",
"text":"På sparekonto følger rente og uttaksregler bankens vilkår. Innskuddsgarantien har egne vilkår og beskytter ikke mot at prisvekst svekker kjøpekraften."},
{"title":"Penger i aksjefond",
"text":"Aksjefond består av andeler som kan stige og falle i verdi. Et nødvendig salg etter et fall kan gi mindre tilbake enn innskuddet. Fondsandeler omfattes ikke av bankenes innskuddsgaranti."},
{"title":"Flere formål",
"text":"En tilgjengelig reserve og langsiktig sparing kan holdes atskilt. Det finnes hverken en fast spareprosent eller en fordeling som passer alle."}],
"sources":[{"id":"q-sparing-investering-0",
"title":"Finanstilsynet: Verdipapirforetak, verdipapirfond og alternative investeringsfond",
"url":"https://www.finanstilsynet.no/forbrukerinformasjon/verdipapirforetak-verdipapirfond-og-alternative-investeringsfond/"},
{"id":"q-sparing-investering-1",
"title":"Bankenes sikringsfond: Hvem gjelder garantien for?",
"url":"https://www.bankenessikringsfond.no/om-garantien/hvem-gjelder-garantien-for/"},
{"id":"q-sparing-investering-2",
"title":"Finanstilsynet: Sikringsordningar og garantiordningar",
"url":"https://www.finanstilsynet.no/forbrukerinformasjon/sikringsordninger-og-garantier/"},
{"id":"q-sparing-investering-3",
"title":"SSB: Hva er inflasjon?",
"url":"https://www.ssb.no/priser-og-prisindekser/konsumpriser/artikler/hva-er-inflasjon"}],
"caveat":"Her beskriver sparing formålet og investering plasseringen. Det er en pedagogisk forklaring, ikke en lovdefinisjon. Skatt og bestemte kontotyper behandles i egne svar.",
"words":[/(?:forskjell|samme).*(?:sparing.*investering|investering.*sparing)/,
/\ber fond sparing\b/,
/\bmå jeg investere for å spare\b/],
"review":{"text":"Fagbeskrivelse kontrollert mot kildene 25. oktober 2026. Ingen bestemt avkastning eller produktpris er forutsatt. Neste kildekontroll senest 25. januar 2027."},
"layout":"overview"},
{
  "kind": "explainer",
  "layout": "overview",
  "id": "q-aksjesparekonto",
  "title": "Hva er en aksjesparekonto (ASK)?",
  "published": "2026-10-24",
  "changed": "2026-10-28",
  "checked": "2026-10-28",
  "terms": [],
  "intro": "En aksjesparekonto (ASK) er en konto for bestemte aksjer og aksjefond i EØS. Du betaler skatt av gevinst og utbytte først ved uttak utover gjenværende innskudd, etter eventuelt skjermingsfradrag. Det er et fradrag som reduserer beløpet du betaler skatt av. Risikoen avhenger av hva du investerer i.",
  "tradeoffs": {
    "pros": [
      {
        "title": "Skatten utsettes",
        "text": "Gevinst og utbytte kan investeres videre uten at du betaler skatt underveis."
      },
      {
        "title": "Innskuddet kommer ut først",
        "text": "Innskuddet du har igjen, kan tas ut uten skatt."
      }
    ],
    "cons": [
      {
        "title": "Ikke alle aksjer er tillatt",
        "text": "Selskapet må være hjemmehørende i EØS, altså høre til der skattemessig. Enkeltaksjer i for eksempel amerikanske selskaper kan derfor ikke kjøpes på ASK. Dette kan også gjelde selskaper på Oslo Børs."
      },
      {
        "title": "Tapsfradrag først til slutt",
        "text": "Taper du penger, får du fradrag først når kontoen avsluttes. Salg med tap inne på kontoen gir ikke fradrag."
      },
      {
        "title": "Kontanter gir ikke rente",
        "text": "Penger som står uinvestert på kontoen, gir ingen rente."
      }
    ]
  },
  "example": {
    "title": "Eksempel: skatt når kontoen avsluttes",
    "text": "Du har satt inn 100 000 kr og ikke tatt ut noe. Kontoen er verdt 150 000 kr. Du tar ut alt og avslutter kontoen. 100 000 kr er innskudd og skattefritt. 50 000 kr er gevinst. Med 5 000 kr i skjermingsfradrag er 45 000 kr skattepliktig. Med satsen for 2026 blir skatten 17 028 kr. Tallene er valgt for eksemplet og er ikke en beregning av din skatt."
  },
  "parts": [
    {
      "title": "Skatt ved uttak",
      "text": "Tar du ut mer enn innskuddet du har igjen, betaler du skatt av det som overstiger innskuddet. Først trekkes eventuelt skjermingsfradrag fra. I 2026 er skatten 37,84 prosent av det skattepliktige beløpet. Tidligere uttak av innskudd reduserer beløpet du kan ta ut skattefritt."
    },
    {
      "title": "Skjermingsfradrag",
      "text": "Grunnlaget er årets laveste innskuddssaldo pluss ubenyttet skjerming fra tidligere år. Grunnlaget ganges med årets skjermingsrente."
    },
    {
      "title": "Krav til konto og investeringer",
      "text": "Bare personlige skattytere kan opprette ASK. Aksjene må være børsnoterte. Fond må være hjemmehørende i EØS og ha mer enn 80 prosent aksjer ved inntektsårets begynnelse. Kravene gjelder når du kjøper. Et verdipapir kan bli stående selv om det senere ikke oppfyller dem, for eksempel fordi selskapet flytter til USA."
    },
    {
      "title": "Flytting",
      "text": "Du kan flytte ASK til en annen tilbyder eller mellom egne ASK-er uten skatt. Innskudd og ubenyttet skjerming følger med i samme forhold som verdiene. Overføring av aksjer og fond fra en vanlig verdipapirkonto til ASK behandles skattemessig som salg, med beregning av gevinst eller tap."
    },
    {
      "title": "Gave og arv",
      "text": "ASK kan arves uten at overføringen skattlegges. Den kan også gis i gave, men da må hele kontoen overføres. Mottakeren fører videre innskuddet og skjermingen som hører til kontoen. Skattereglene kaller dette skattemessig kontinuitet. Når et dødsbo fordeles, kan også utvalgte aksjer og fond overføres til arvingens ASK. Innskudd og ubenyttet skjerming følger da med i samme forhold som verdiene. En ASK kan ikke eies av flere sammen. Vil du gi til flere, kan du fordele verdiene på flere egne ASK-er og gi bort hver konto."
    }
  ],
  "sources": [
    {
      "id": "tax-ask-no",
      "title": "Skatteetaten: Aksjesparekonto (ASK)",
      "url": "https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/aksjer-og-verdipapirer/om/aksjesparekonto-ask/"
    },
    {
      "id": "tax-aksjefaktor-2026",
      "title": "Skatteetaten: Faktor for oppjustering av gevinst, tap eller utbytte på aksjer, 2026",
      "url": "https://www.skatteetaten.no/satser/faktor-for-oppjustering-av-gevinsttap-eller-utbytte-pa-aksjer/"
    },
    {
      "id": "tax-ask-arv-gave",
      "title": "Skatteetaten: Skatte-ABC 2025/2026, A-10-9 Videreføring av aksjesparekonto ved arv eller gave",
      "url": "https://www.skatteetaten.no/nn/rettskjelder/type/handboker/skatte-abc/gjeldende/a-10-aksjesparekonto/A-10.030/"
    }
  ],
  "review": {
    "text": "Skatteetatens sider er udaterte. Satsen gjelder inntektsåret 2026. Skatte-ABC gjelder utgaven 2025/2026. Lest 28.10.2026 av ChatGPT/Codex, egenkontroll. Jeg har ikke tatt med skatt ved flytting til utlandet, formuesskatt eller utenlandsk kildeskatt."
  }
,
"keys":["ask",
"aksjesparekonto"],
"questions":["Hva er ASK?",
"Hva er en aksjesparekonto?",
"Hva er aksjesparekonto?",
"Hva betyr ASK?",
"Hva er en aksjesparekonto (ASK)?"],
"words":[/(?<!(?:fondskonto|kapitalforsikring|investeringskonto|unit ?link).*)(?:\bask\b)(?!.*(?:fondskonto|kapitalforsikring|investeringskonto|unit ?link))/,
/(?<!(?:fondskonto|kapitalforsikring|investeringskonto|unit ?link).*)(?:aksjesparekonto)(?!.*(?:fondskonto|kapitalforsikring|investeringskonto|unit ?link))/]
},
{
  "kind": "explainer",
  "layout": "overview",
  "id": "q-fondskonto",
  "title": "Hva er en fondskonto?",
  "published": "2026-10-24",
  "changed": "2026-10-29",
  "checked": "2026-10-29",
  "intro": "En fondskonto, også kalt investeringskonto, kombinerer investering og forsikring. Pengene kan plasseres i aksjer, fond og andre verdipapirer. Du bærer risikoen, og verdien kan falle.",
  "caveat": "Skatteforklaringen gjelder privatpersoner med konto uten garantert avkastning og med et lite forsikringstillegg ved død eller uførhet.",
  "terms": [],
  "tradeoffs": {
    "pros": [
      {
        "title": "Bredere utvalg enn ASK",
        "text": "Avhengig av tilbyderen kan kontoen gi tilgang til blant annet aksjer i selskaper utenfor EØS og rentefond. Disse kan ikke kjøpes på ASK."
      },
      {
        "title": "Utsatt skatt ved handel",
        "text": "Kjøp og salg inne på kontoen utløser normalt ikke skatt på gevinsten for deg. Kontoen inngår likevel i formuen din."
      }
    ],
    "cons": [
      {
        "title": "Gevinst følger med ved uttak",
        "text": "Har kontoen steget i verdi, inneholder hvert uttak både innskudd og gevinst. Du kan ikke ta ut innskuddet først, slik du kan på ASK."
      }
    ]
  },
  "example": {
    "title": "Eksempel på uttak",
    "text": "Du har satt inn 100 000 kr, og kontoen er verdt 150 000 kr. Uten tidligere uttak består et uttak på 30 000 kr av 20 000 kr innskudd og 10 000 kr gevinst før skjermingsfradrag. Tallene er et eksempel, ikke en beregning av skatten din."
  },
  "parts": [
    {
      "title": "Eierskap og forsikring",
      "text": "Forsikringsselskapet eier investeringene. Du har et krav mot selskapet som tilsvarer kontoverdien. Forsikringstillegget regnes som lite når det er under 50 prosent av kontoverdien. Er tillegget et fast beløp, må det være lavere enn gjenværende innbetalt sparebeløp, uten avkastning."
    },
    {
      "title": "Skatt og fradrag",
      "text": "Aksjeandel betyr hvor stor del som regnes som aksjer. Ved skatteberegningen regnes over 80 prosent som 100 prosent og under 20 prosent som null. Gjennomsnittet av de årlige andelene bestemmer fordelingen av gevinst mellom aksjedelen og rentedelen. Satsene i 2026 er henholdsvis 37,84 og 22 prosent. Aksjedelen gir grunnlag for skjermingsfradrag, som reduserer skattepliktig gevinst. Ved uttak må ubenyttet skjerming brukes mot gevinsten, også rentedelen. Ved verdifall gir uttak fradrag for en forholdsmessig del av tapet."
    }
  ],
  "sources": [
    {
      "id": "tax-fondskonto-no",
      "title": "Skatteetaten: Fondskonto",
      "url": "https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/aksjer-og-verdipapirer/om/skatteregler-investere-i-aksjer-og-andre-verdipapirer-gjennom-kapitalforsikring-fondskonto/"
    },
    {
      "id": "tax-fondskonto-abc",
      "title": "Skatteetaten: Skatte-ABC 2025/2026, spesielt om fondskonto",
      "url": "https://www.skatteetaten.no/rettskilder/type/handboker/skatte-abc/gjeldende/v-6-verdipapirfond/V-6.001/V-6.003/"
    },
    {
      "id": "tax-fondskonto-rettledning",
      "title": "Skatteetaten: Rettledning om fondskonto, 2026 og senere",
      "url": "https://www.skatteetaten.no/nn/bedrift-og-organisasjon/rapportering-og-bransjar/tredjepartsopplysninger/bank-finans-og-forsikring/fondskonto/rettledning/"
    },
    {
      "id": "tax-aksjefaktor-2026",
      "title": "Skatteetaten: Gevinst, tap eller utbytte på aksjer, 2026",
      "url": "https://www.skatteetaten.no/satser/faktor-for-oppjustering-av-gevinsttap-eller-utbytte-pa-aksjer/?year=2026"
    },
    {
      "id": "tax-ask-no",
      "title": "Skatteetaten: Aksjesparekonto (ASK)",
      "url": "https://www.skatteetaten.no/person/skatt/hjelp-til-rett-skatt/aksjar-og-verdipapir/om/aksjesparekonto-ask/"
    },
    {
      "id": "fin-fondskonto-utvalg",
      "title": "Finansdepartementet: Prop. 1 LS (2025/2026), punkt 8.10.2, fondskonto og gjeldende rett",
      "url": "https://www.regjeringen.no/no/dokumenter/prop.-1-ls-20252026/id3124192/?ch=2"
    }
  ],
  "review": {
    "text": "Regelår 2026. Skatte-ABC 2025/2026 og rettledningen for 2026 og senere er lest sammen med personsidene og Prop. 1 LS (2025/2026), punkt 8.10.2 om gjeldende rett. Ingen oppdateringsdato oppgitt på Skatteetatens sider. Lest 29.10.2026 av ChatGPT/Codex, egenkontroll. Kontrollert av Lars og Claude, bekreftet av Lars 29.10.2026. Jeg har ikke tatt med selskaper, utflytting eller bestemte tilbyderes vilkår."
  },
"keys":["fondskonto",
"investeringskonto",
"kapitalforsikring"],
"questions":["Hva er en fondskonto?",
"Hva er fondskonto?",
"Hva er kapitalforsikring?",
"Hva er en investeringskonto?"],
"words":[/(?<!(?:\bask\b|aksjesparekonto).*)(?:fondskonto)(?!.*(?:\bask\b|aksjesparekonto))/,
/(?<!(?:\bask\b|aksjesparekonto).*)(?:kapitalforsikring)(?!.*(?:\bask\b|aksjesparekonto))/,
/(?<!(?:\bask\b|aksjesparekonto).*)(?:investeringskonto)(?!.*(?:\bask\b|aksjesparekonto))/,
/(?<!(?:\bask\b|aksjesparekonto).*)(?:unit ?link)(?!.*(?:\bask\b|aksjesparekonto))/],

},
 {
 "kind": "explainer",
 "layout": "overview",
 "id": "q-bsu-basics",
 "searchFamily":"bsu",
 "terms":[],
 "category": "bsu",
 "title": "Hva er BSU?",
 "published": "2026-10-22",
 "changed": "2026-10-28",
 "checked": "2026-10-28",
 "keys": [
  "bsu",
  "boligsparing"
 ],
 "questions": [
  "Hva er BSU?",
  "Hva betyr BSU?",
  "Hvordan fungerer boligsparing for ungdom?"
 ],
 "intro": "BSU betyr boligsparing for ungdom. Du kan spare til og med året du fyller 33 og sette inn opptil 27 500 kroner i året og 300 000 kroner totalt. Rentene kommer i tillegg og teller ikke med i innskuddsgrensene.",
 "tradeoffs": {
  "pros": [
   {
    "title": "Lavere skatt",
    "text": "Du kan få 10 prosent av årets innskudd i skattefradrag, maksimalt 2 750 kroner. Du må betale nok skatt for å få fullt fradrag. Eier du bolig 31. desember, alene eller sammen med andre, får du ikke fradrag det året. Pengene må være satt inn før årets slutt, og banken må rapportere innskuddet til Skatteetaten."
   },
   {
    "title": "Høyere rente",
    "text": "Ifølge SSB har BSU i snitt hatt høyere rente enn andre bundne bankinnskudd hvert år siden 2018. Bankene bestemmer renten, så din kan være høyere eller lavere."
   }
  ],
  "cons": [
   {
    "title": "Tilbakebetaling ved annen bruk",
    "text": "Du kan ta ut pengene til andre formål, men da bryter du vilkårene og må betale tilbake skattefradrag du tidligere har fått, gjennom økt skatt. Har deler av pengene gått til kjøp av egen fast bolig i tråd med vilkårene, gjelder tilbakebetalingen bare den delen som ikke er brukt slik."
   }
  ]
 },
 "parts": [
  {
   "title": "Hvilken bolig teller?",
   "text": "Både boligen du bor i og annen bolig teller, også en andel i et borettslag. Fritidsbolig alene hindrer ikke fradrag."
  },
  {
   "title": "Hva kan pengene brukes til?",
   "text": "Blant annet kjøp av egen fast bolig, kjøpskostnader, renter og avdrag på boliglånet og oppussing og oppgradering av boligen. Det trenger ikke være ditt første boligkjøp. Når du har begynt å bruke BSU-pengene eller har brutt vilkårene, kan du ikke sette inn mer."
  },
  {
   "title": "Mer om renter og konto",
   table:bsuRates,
   "text": "Rentene kan ikke tas ut før sparepengene brukes til bolig. Renter som påløper fra og med året du fyller 34, kan likevel tas ut. Du kan bare opprette BSU-konto én gang, men kan flytte den ved direkte overføring mellom bankene."
  }
 ],
 "sources": [{"id":"bsu-satser-2026","title":"Skatteetaten: Fradrag for boligsparing for ungdom (BSU), 2026","url":"https://www.skatteetaten.no/satser/fradrag-for-boligsparing-for-ungdom-bsu/?year=2026"},
  {"id":"bsu-forskudd-2026","title":"Skatteetaten: Forskuddsutskrivingen 2026","url":"https://www.skatteetaten.no/rettskilder/type/uttalelser/uttalelser/forskuddsutskrivingen-2026/"},
  {
   "id": "tax-bsu",
   "title": "Skatteetaten: Bustadsparing for ungdom (BSU)",
   "url": "https://www.skatteetaten.no/nn/person/skatt/hjelp-til-rett-skatt/bank-og-lan/bsu--bustadsparing-for-ungdom/"
  },
  {
   "id": "ssb-bsu-historikk",
   "title": "SSB: Renter på innskudd, tabell 11018. Husholdninger, januar 2018 til august 2026. Uttrekk 28. oktober 2026.",
   "url": "https://www.ssb.no/statbank/table/11018?sq=30128709"
  }
 ],
 "review": {"text": "Kildegrunnlag: Skatteetatens nettsider om BSU og satser for 2026, og SSBs rentestatistikk med uttrekk 28. oktober 2026. Ingen oppdateringsdato oppgitt på Skatteetatens sider. Boligeierskap kontrollert av Claude 28. oktober 2026. Egenkontroll av ChatGPT/Codex."}
,
 words:[/\bbsu\b/,/boligsparing for ungdom/]},
{"id":"q-ips-ask",
"category":"pension",
"title":"IPS eller ASK?",
"checked":"2026-10-28",
"keys":["ips"],
"words":[/\bips\b/,
/individuell pensjonssparing/,
/individuell sparing til pensjon/,
/(?:aksjesparekonto|\bask\b).*\bips\b|\bips\b.*(?:aksjesparekonto|\bask\b)/],
"questions":["Bør jeg velge IPS eller ASK?",
"IPS eller ASK?",
"Hva er forskjellen på IPS og ASK?",
"Hva er IPS?"],
"intro":"IPS og ASK har ulike regler for binding, skatt og investeringer. Risikoen avhenger av det pengene plasseres i.",
"sources":[{"id":"tax-ips",
"title":"Skatteetaten: individuell sparing til pensjon, ny ordning",
"url":"https://www.skatteetaten.no/nn/person/skatt/hjelp-til-rett-skatt/arbeid-trygd-og-pensjon/pensjon-og-uforetrygd/ordning-om-skattefavorisert-individuell-sparing-til-pensjon/"},
{"id":"tax-ask",
"title":"Skatteetaten: aksjesparekonto",
"url":"https://www.skatteetaten.no/nn/person/skatt/hjelp-til-rett-skatt/aksjar-og-verdipapir/om/aksjesparekonto-ask/"},
{"id":"ips-fradrag",
"title":"Skatteetaten: Skatte-ABC, fradrag for IPS",
"url":"https://www.skatteetaten.no/rettskilder/type/handboker/skatte-abc/gjeldende/p-4-pensjon--individuell-sparing-til-pensjon/P-4.005/P-4.006/"}],
"parts":[{"title":"Innbetalingsgrense for IPS",
"text":"I {{year}} er grensen {{ipsAnnual}} kr, inkludert aktuelle kostnader og forsikring i avtalen."}],
"options":[{"title":"IPS",
"subtitle":"Sparing bundet til pensjon.",
"pros":[{"title":"Fradrag og fritak for formuesskatt",
"text":"Innbetalingen kan gi fradrag i alminnelig inntekt, altså inntekten skatten beregnes av. Kapitalen er unntatt formuesskatt og løpende skatt på avkastningen."}],
"cons":[{"title":"Pengene er lite fleksible",
"text":"Ordinært uttak kan tidligst starte ved {{ipsStartAge}} år og må vare minst til {{ipsEndAge}} år og minst {{ipsMinYears}} år. Det finnes unntak ved uførhet."},
{"title":"Fradraget er ikke en skattefri gave",
"text":"Hele utbetalingen skattlegges som alminnelig inntekt."}]},
{"title":"ASK",
"subtitle":"Konto for kvalifiserte aksjer og aksjefond.",
"pros":[{"title":"Innskudd kan tas ut først",
"text":"Gjenværende innskudd kan tas ut uten skatt. Gevinst skattlegges ved uttak utover dette, etter eventuell skjerming."},
{"title":"Fleksibel tilgang",
"text":"ASK har ikke IPS-ordningens binding til pensjon."}],
"cons":[{"title":"Ingen IPS-fradrag eller IPS-binding",
"text":"ASK gir ikke fradrag for innskudd og er ikke generelt fritatt for formuesskatt."},
{"title":"Kontoen begrenser investeringene",
"text":"ASK gjelder kvalifiserte aksjer og aksjefond innenfor EØS-reglene. Rene rentefond passer ikke på ASK."}]}],
"review":{"text":"Skatteetatens hovedsider er udaterte. Regelår 2026; Skatte-ABC 2025/2026. Lest 28.10.2026, egenkontroll. Neste kontroll før 01.01.2027."},
"neutral":true,
"layout":"overview",
"caveat":"Dette gjelder IPS-ordningen innført i 2017. Eldre avtaler kan ha andre skatteregler."},
{"id":"q-ask-zero",
"category":"funds",
"title":"ASK eller fondskonto?",
"checked":"2026-10-28",
"words":[/(?:\bask\b|aksjesparekonto).*(?:fondskonto|kapitalforsikring|investeringskonto|unit ?link)|(?:fondskonto|kapitalforsikring|investeringskonto|unit ?link).*(?:\bask\b|aksjesparekonto)/],
"questions":["Hva er forskjellen på aksjesparekonto og fondskonto?",
"ASK eller fondskonto?",
"ASK eller investeringskonto?"],
"intro":"ASK og fondskonto har ulike regler for uttak, skatt og investeringsutvalg. Fondskonto kalles også investeringskonto.",
"sources":[{"id":"tax-ask",
"title":"Skatteetaten: aksjesparekonto",
"url":"https://www.skatteetaten.no/nn/person/skatt/hjelp-til-rett-skatt/aksjar-og-verdipapir/om/aksjesparekonto-ask/"},
{"id":"tax-fondskonto",
"title":"Skatteetaten: skatt på fondskonto",
"url":"https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/aksjer-og-verdipapirer/om/skatteregler-investere-i-aksjer-og-andre-verdipapirer-gjennom-kapitalforsikring-fondskonto/"}],
"parts":[],
"options":[{"title":"ASK",
"subtitle":"For kvalifiserte aksjer og aksjefond.",
"pros":[{"title":"Innskudd ut før gevinst",
"text":"Gjenværende innskudd tas ut skattefritt. Uttak av gevinst skattlegges etter eventuell skjerming."},
{"title":"Utsatt skatt innenfor ordningen",
"text":"Kjøp og salg på kontoen utløser normalt ikke løpende gevinstskatt."}],
"cons":[{"title":"Ikke alle investeringer er tillatt",
"text":"Ved kjøp må aksjene eller aksjefondet være hjemmehørende i EØS. Fondet må ha over 80 prosent aksjeandel ved inntektsårets begynnelse. Rene rentefond faller utenfor. Verdipapirer som oppfylte kravene ved kjøp, kan beholdes hvis kravene senere ikke er oppfylt."},
{"title":"Tap kommer ikke straks til fradrag",
"text":"På ASK får du normalt først fradrag for samlet tap når kontoen avsluttes."}]},
{"title":"Forsikringsbasert fondskonto",
"subtitle":"En kontotype med kapitalforsikring.",
"pros":[{"title":"Kan romme flere investeringer",
"text":"Utvalget avhenger av avtalen og kan være bredere enn på ASK."},
{"title":"Utsatt skatt på avkastning",
"text":"Avkastning skattlegges normalt ved uttak, ikke ved hvert kjøp og salg inne på kontoen."}],
"cons":[{"title":"Deluttak kan utløse skatt",
"text":"Uttaket inneholder en forholdsmessig del av innskudd og gevinst eller tap. Skjerming kan redusere skattepliktig gevinst."},
{"title":"Andre vilkår og kostnader",
"text":"Forsikringsvilkår, kostnader og regler for flytting varierer mellom avtaler."}]}],
"review":{"text":"Skatteetatens veiledning er udatert og omtaler 2026. Lest 28.10.2026, egenkontroll. Neste kontroll før 01.01.2027."},
"neutral":true,
"layout":"overview",
"caveat":"Risikoen avhenger av investeringene. Fondskontodelen gjelder kapitalforsikring med lite forsikringselement og uten garantert avkastning. Vilkårene hos bestemte tilbydere er ikke kontrollert."},
{"kind":"explainer",
"id":"q-kjopekraft",
"title":"Hva er kjøpekraft?",
"checked":"2026-10-24",
"keys":["kjøpekraft",
"inflasjon",
"prisvekst"],
"questions":["Hva er kjøpekraft?",
"Hva er prisvekst?",
"Hva er inflasjon?",
"Hva betyr dagens kroner?",
"Hvorfor blir pengene mindre verdt på konto?"],
"words":[/kj[øo]pekraft/,
/prisvekst/,
/inflasjon/,
/dagens kroner/,
/mindre verdt/,
/mister verdi/],
"intro":"Kjøpekraft er hvor mye du kan kjøpe for pengene. Når prisene stiger, rekker det samme kronebeløpet til mindre. Prisveksten kalles også inflasjon.",
"terms":[],
"example":{"title":"Eksempel: ti år med 2,5 % prisvekst",
"text":"Med 2,5 % årlig prisvekst koster varer til 100 000 kr omtrent 128 000 kr om ti år. Omvendt kjøper 100 000 kr uten rente da det som 78 000 kr kjøper ved starten. Valgte tall, ingen prognose."},
"next":{"text":"Prøv med dine egne tall i kalkulatoren",
"href":"index.html"},
"sources":[{"id":"ssb-inflasjon",
"title":"SSB: Hva er inflasjon?",
"url":"https://www.ssb.no/priser-og-prisindekser/konsumpriser/artikler/hva-er-inflasjon"}],
"parts":[{"title":"Kroner og kjøpekraft",
"text":"Færre kroner tilbake enn innskuddet er et tap i kroner. Hvis saldoen øker mindre enn prisene, faller kjøpekraften selv om kronebeløpet øker. Det kan skje når renten er positiv, men lavere enn prisveksten."},
{"title":"Et gjennomsnitt av priser",
"text":"SSB måler prisvekst med konsumprisindeksen. Den sammenfatter prisendringer på mange varer og tjenester. Ditt forbruk kan bli dyrere raskere eller langsommere enn gjennomsnittet. Prisveksten varierer også mellom år."},
{"title":"Dagens kroner",
"text":"Framtidige beløp kan regnes om til dagens prisnivå. Da kan beløp fra ulike år sammenlignes."}],
"review":{"text":"SSB-artikkel publisert 15.09.2022. Tidligere kildekontroll: 24.10.2026. Språkrevisjon: 28.10.2026, egenkontroll. Ingen ny faglig godkjenning."},
"layout":"overview",
"caveat":""}
];
if(typeof module!=='undefined'&&module.exports)module.exports=entries;
else {for(const entry of entries)root.SpareVeileder.register(entry);}
})(typeof window!=='undefined'?window:globalThis);
