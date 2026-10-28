/* Reviewed question database. New entries stay under the existing seven categories. */
(function(root){
'use strict';
const F=typeof module!=='undefined'&&module.exports?require('./veileder-facts.js'):root.SpareFacts;
const date=F.checked;
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
 "intro": "Renters rente betyr at du får renter også på renter du har fått tidligere. Når rentene blir stående på kontoen, blir beløpet som kan gi nye renter større. Hvor mye pengene vokser, avhenger av renten og hvor lenge de står.",
 "terms": [
  {
   "term": "renters rente",
   "text": "Renter beregnet også av tidligere opptjente renter som blir stående på kontoen."
  },
  {
   "term": "avkastning",
   "text": "Det du tjener eller taper på en investering."
  }
 ],
 "example": {
  "title": "Eksempel: 10 000 kr i to år",
  "text": "Du setter inn 10 000 kr og får 5 % rente hvert år. Etter ett år har du 10 500 kr. Det andre året får du 525 kr i renter, og har 11 025 kr. Av rentene det andre året kommer 25 kr fra rentene du fikk det første året. I dette regneeksempelet legges rentene til én gang i året. Kontovilkårene avgjør når renter legges til på din konto. Vi forutsetter ingen nye innskudd eller uttak og uendret rente. Tallene er før skatt, kostnader og prisvekst. 5 % er et valgt eksempeltall, ikke et rentetilbud eller en prognose. Regnesammenheng, egen illustrasjon."
 },
 "parts": [
  {
   "title": "Flere kroner er ikke alltid mer kjøpekraft",
   "text": "Skatteetatens hovedregel er at renteinntekt er skattepliktig. Eventuell skatt og kostnader reduserer det du sitter igjen med. Stiger prisene mer enn pengene dine vokser etter skatt og kostnader, kan du kjøpe mindre selv om kronebeløpet øker. Eksempelet med 5 % rente viser vekst i kroner, ikke hva pengene kan kjøpe."
  },
  {
   "title": "Kronene kan vokse mens kjøpekraften faller",
   "text": "Et annet regneeksempel: 10 000 kr med 2 % årlig rente blir 10 404 kr etter to år. Med 2,5 % årlig prisvekst tilsvarer det omtrent 9 903 kr målt med prisene ved starten. Du har flere kroner, men mindre kjøpekraft. Begge prosentene er valgte eksempeltall, og regnestykket er før skatt og kostnader. Dette er andre forutsetninger enn i eksempelet med 5 % rente. Med 5 % rente og 2,5 % prisvekst ville også kjøpekraften økt før skatt og kostnader. Regnesammenheng, egen illustrasjon."
  },
  {
   "title": "Hva gjør tiden?",
   "text": "Med de samme forutsetningene gir 10 000 kr med 5 % årlig rente omtrent 16 289 kr etter 10 år og 26 533 kr etter 20 år. Renter som blir stående, får flere år til å gi nye renter. Både renten og tiden påvirker resultatet; eksempelet viser ikke at den ene alltid er viktigere enn den andre. Tallene er før skatt, kostnader og prisvekst. Regnesammenheng, egen illustrasjon."
  },
  {
   "title": "Hvis du tar ut rentene",
   "text": "Tar du ut rentene etter hvert år, gir de ikke nye renter på denne kontoen. Med forutsetningene i eksempelet får du da 500 kr hvert år. Etter to år har du 10 000 kr på kontoen og har fått utbetalt 1 000 kr, før eventuell skatt og kostnader. Regnesammenheng, egen illustrasjon."
  },
  {
   "title": "I fond er veksten ujevn",
   "text": "For fond må du skille mellom et regneeksempel med fast avkastning og faktisk utvikling. Finanstilsynet opplyser at risiko og forventet avkastning varierer med plasseringene. En verdi på 10 000 kr som først stiger 10 % og deretter faller 10 %, ender på 9 900 kr. Dette er et valgt regneforløp, ikke en prognose. Det ser bort fra innskudd, uttak, kostnader og skatt. Regnesammenheng, egen illustrasjon."
  },
  {
   "title": "Slik kan du regne selv",
   "text": "Med fast årlig rente, årlig rentetillegg og uten innskudd eller uttak: sluttbeløp = startbeløp × (1 + rente / 100) opphøyd i antall år. Oppgi renten som prosenttall, for eksempel 5. I eksempelet: 10 000 × 1,05 × 1,05 = 11 025 kr. Regnesammenheng, egen illustrasjon."
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
   "title": "Finanstilsynet: Verdipapirfond, risiko og kostnader (sist publisert 23.10.2026, dato fra søkeuttrekk)",
   "url": "https://www.finanstilsynet.no/forbrukerinformasjon/verdipapirforetak-verdipapirfond-og-alternative-investeringsfond/"
  }
 ],
 "caveat": "Regnesammenheng, egen illustrasjon. Eksemplene er før eventuell skatt og kostnader. Kildene er kontrollert 25. oktober 2026. Skatte-ABC er 2025/2026, SSB-artikkelen er publisert 15. september 2022. Finanstilsynets side er sist publisert 23. oktober 2026 ifølge kildeuttrekket. Neste kildekontroll senest 25. januar 2027.",
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
 "words": ["rente(?:rs?|s) ?rente", "rente på rente", "renter på rentene"].map(s=>new RegExp(s))
},
// END GENERATED SV-022
{"kind": "explainer", "id": "q-indeksfond", "category": "funds", "title": "Hva er et indeksfond?", "checked": "2026-10-25", "keys": ["indeksfond", "passivforvaltning"], "questions": ["Hva er et indeksfond?", "Hva er indeksfond?", "Hva betyr indeksfond?", "Hvordan fungerer indeksfond?", "Hva betyr passiv forvaltning?", "Hva betyr passivt forvaltet fond?"], "intro": "Et indeksfond forsøker å følge utviklingen i en bestemt indeks. En aksjeindeks måler utviklingen i et utvalg aksjer. Du kjøper fondsandeler og lar fondet investere for deg. Et indeksfond som investerer i aksjer, kan falle mye i verdi selv om det har lave kostnader.", "terms": [{"term": "indeks", "text": "Et mål på utviklingen i et utvalg verdipapirer. Her bruker vi en aksjeindeks som eksempel."}, {"term": "passiv forvaltning", "text": "Forvalteren forsøker å følge indeksen framfor å velge aksjer som skal gjøre det bedre enn den. Dette kalles passiv forvaltning. Ordet beskriver forvaltningsmåten, ikke hvor trygge pengene er."}], "example": {"title": "Eksempel: ulik vekt i indeksen", "text": "Tenk deg en forenklet indeks med 50 % i selskap A, 30 % i B og 20 % i C. Et fond som kopierer denne fordelingen, vil plassere omtrent 500 kr, 300 kr og 200 kr av en investering på 1 000 kr. Dette er en illustrasjon av vekting, ikke et virkelig fond, en tilstrekkelig spredning eller en forventning om avkastning. Faktiske fond kan avvike fra indeksen; undersøk fondets dokumentasjon."}, "parts": [{"title": "Forvaltning og risiko", "text": "Forvalteren forsøker å følge indeksen framfor å velge aksjer som skal gjøre det bedre enn den. Dette kalles passiv forvaltning. Ordet beskriver forvaltningsmåten, ikke hvor trygge pengene er."}, {"title": "Hvilken indeks følger fondet?", "text": "Se etter hvilken indeks fondet følger. Et fond rettet mot ett land eller én bransje gir en annen fordeling enn et bredt globalt fond. At fondet følger en indeks, betyr hverken at alle selskaper veier like mye eller at alle indeksfond har samme risiko."}, {"title": "Sjekk samlet pris", "text": "Indeksfond har vanligvis lavere forvaltningskostnader enn aktivt forvaltede fond. Sjekk likevel den samlede prisen hos tilbyderen, inkludert eventuelt plattformgebyr. Samme fond kan koste ulikt hos forskjellige tilbydere."}, {"title": "Les nøkkelinformasjonen", "text": "Les fondets nøkkelinformasjon før du velger. Der finner du blant annet risiko og kostnader. Lang sparetid fjerner ikke muligheten for tap. Penger til en nødvendig regning eller et nært kjøp må vurderes ut fra når de skal brukes og hvor mye tap du tåler."}, {"title": "Avgrensning", "text": "Denne forklaringen bruker aksjebaserte indeksfond som eksempel. Den gjør ikke «indeksfond» til et generelt løfte om lave kostnader, bred spredning eller en bestemt investering. Skatt, kontovalg og anbefaling av enkeltfond er egne spørsmål."}], "sources": [{"id": "q-indeksfond-0", "title": "Forbrukerrådet: Sparing i fond og spareprofiler", "url": "https://www.forbrukerradet.no/sparing-i-fond-og-spareprofiler/"}, {"id": "q-indeksfond-1", "title": "DNB: Indeksfond", "url": "https://www.dnb.no/sparing/fond/indeksfond"}, {"id": "q-indeksfond-2", "title": "Finanstilsynet: Verdipapirforetak, verdipapirfond og alternative investeringsfond", "url": "https://www.finanstilsynet.no/forbrukerinformasjon/verdipapirforetak-verdipapirfond-og-alternative-investeringsfond/"}, {"id": "q-indeksfond-3", "title": "Forbrukerrådet: Nå kan du sjekke om du betaler for mye for fondet ditt", "url": "https://www.forbrukerradet.no/siste-nytt/na-kan-du-sjekke-om-du-betaler-for-mye-for-fondet-ditt/"}], "caveat": "Fagbeskrivelse kontrollert mot kildene 25. oktober 2026. Ingen bestemt avkastning eller produktpris er forutsatt. Neste kildekontroll senest 25. januar 2027.",
 words:[/\bindeksfond\b/,/passiv(?:t)? (?:forvaltning|forvaltet fond)/]},
{"kind": "explainer", "id": "q-sparing-investering", "category": "funds", "title": "Hva er forskjellen på sparing og investering?", "checked": "2026-10-25", "keys": [], "questions": ["Hva er forskjellen på sparing og investering?", "Er fond sparing?", "Er investering det samme som sparing?", "Må jeg investere for å spare?"], "intro": "Å spare betyr å sette av penger til senere. Å investere betyr å plassere penger med mål om avkastning, for eksempel i fond eller aksjer, med risiko for tap. Du kan derfor spare både på bankkonto og gjennom investeringer.", "terms": [{"term": "sparing", "text": "Å sette av penger til senere, på konto eller gjennom investeringer."}, {"term": "investering", "text": "Å plassere penger med mål om avkastning og med risiko for tap."}], "example": {"title": "Eksempel: ulike behov", "text": "En uventet reparasjon kan kreve penger nå. Et mål uten fast dato langt fram i tid kan gi større rom for svingninger. Det betyr ikke at all langsiktig sparing bør investeres, eller at tid garanterer gevinst."}, "parts": [{"title": "Start med formålet", "text": "Hva pengene skal brukes til, er et bedre utgangspunkt enn hva spareformen heter. En reserve til en uventet regning og penger til et mål langt fram i tid kan trenge ulik plassering."}, {"title": "Penger på konto", "text": "På en sparekonto får du rente etter bankens vilkår. Undersøk uttaksregler og hvilken innskuddsgaranti som gjelder. Garantien beskytter ikke mot at prisvekst svekker kjøpekraften."}, {"title": "Penger i aksjefond", "text": "Når du kjøper aksjefond, kjøper du fondsandeler som kan stige og falle i verdi. Et verdifall kan bety at du får mindre tilbake enn du satte inn, særlig hvis du må selge når verdien er lav. Fondsandelene er ikke omfattet av bankenes innskuddsgaranti."}, {"title": "Del pengene etter behov", "text": "Du trenger ikke velge én plassering for alle pengene. Et mulig opplegg er en tilgjengelig reserve på konto og separat, langsiktig sparing i investeringer som tåler verdifall. Dette er en måte å dele behov på, ikke en anbefalt fordeling for alle. Hvor mye du trenger tilgjengelig, avhenger av din økonomi."}, {"title": "Avgrensning", "text": "«Sparing» brukes her som formål og «investering» som plassering. Dette er en pedagogisk avgrensning for privatøkonomi, ikke en lovdefinisjon eller nasjonalregnskapets definisjon av sparing. Skatt og bestemte kontotyper behandles i egne svar. Teksten gir hverken en fast spareprosent eller en universell tidshorisont."}], "sources": [{"id": "q-sparing-investering-0", "title": "Finanstilsynet: Verdipapirforetak, verdipapirfond og alternative investeringsfond", "url": "https://www.finanstilsynet.no/forbrukerinformasjon/verdipapirforetak-verdipapirfond-og-alternative-investeringsfond/"}, {"id": "q-sparing-investering-1", "title": "Bankenes sikringsfond: Hvem gjelder garantien for?", "url": "https://www.bankenessikringsfond.no/om-garantien/hvem-gjelder-garantien-for/"}, {"id": "q-sparing-investering-2", "title": "Finanstilsynet: Sikringsordningar og garantiordningar", "url": "https://www.finanstilsynet.no/forbrukerinformasjon/sikringsordninger-og-garantier/"}, {"id": "q-sparing-investering-3", "title": "SSB: Hva er inflasjon?", "url": "https://www.ssb.no/priser-og-prisindekser/konsumpriser/artikler/hva-er-inflasjon"}], "caveat": "Fagbeskrivelse kontrollert mot kildene 25. oktober 2026. Ingen bestemt avkastning eller produktpris er forutsatt. Neste kildekontroll senest 25. januar 2027.",
 words:[/(?:forskjell|samme).*(?:sparing.*investering|investering.*sparing)/,/\ber fond sparing\b/,/\bmå jeg investere for å spare\b/]},
 // Forklaringer av hver kontotype («hva er dette?»), tilpasset fra utkast-PR #53. Sammenligningen (q-ask-zero) står lenger ned.
 {kind:'explainer',id:'q-aksjesparekonto',title:'Hva er en aksjesparekonto (ASK)?',checked:'2026-10-24',keys:['ask','aksjesparekonto'],
 questions:['Hva er ASK?','Hva er en aksjesparekonto?','Hva er aksjesparekonto?','Hva betyr ASK?','Hva er en aksjesparekonto (ASK)?'],
 words:[alone('\\bask\\b',FONDNAVN),alone('aksjesparekonto',FONDNAVN)],
 intro:'En aksjesparekonto (ASK) er en egen konto for aksjer og aksjefond. Du betaler ikke skatt på gevinst mens verdiene står på kontoen. Skatten kommer når du tar ut mer enn det du har satt inn.',
 terms:[
  {term:'aksjesparekonto',alsoCalled:'ASK',text:'En personlig konto der du kan kjøpe og selge aksjer og aksjefond uten å betale skatt underveis. Du kan ha flere, men ikke eie en sammen med andre.'},
  {term:'innskutt kapital',text:'Pengene du selv har satt inn på kontoen. De regnes som det første du tar ut, og kan tas ut uten skatt.'},
  {term:'uttak',text:'At du tar penger ut av kontoen. Skatten regnes ut ved uttak, ikke ved kjøp og salg inne på kontoen.'},
  {term:'aksjefond',text:'Et fond som hovedsakelig investerer i aksjer. På en ASK stilles det krav til hvilke fond som kan ligge der, se fordypningen.'}],
 example:i('Eksempel: innskudd og gevinst','Du har satt inn 100 000 kroner, og kontoen er nå verdt 150 000 kroner. De første 100 000 kronene du tar ut, regnes som innskuddet ditt, og du betaler ingen skatt av dem. De siste 50 000 kronene er gevinst og skattlegges når du tar dem ut, etter et eventuelt skjermingsfradrag. Dette er et eksempel, ikke en beregning av din skatt.'),
 caveat:'Skatteetatens side oppgir ingen oppdateringsdato. Kontrollert mot siden 24. oktober 2026. Satsene og den risikofrie renten endres fra år til år.',
 sources:[askNo],
 parts:[
  i('Hva kan ligge på kontoen?','Børsnoterte aksjer i selskaper som er hjemmehørende i EØS, og andeler i aksjefond som er hjemmehørende i EØS. Fondet må ha over 80 prosent aksjeandel ved inntektsårets begynnelse. Kravene vurderes når du kjøper. Verdipapirer som oppfylte kravene da, kan beholdes selv om de senere ikke lenger oppfyller dem. Rene rentefond kan ikke ligge på kontoen. Penger kan stå på kontoen, men uten rente. Kontoen sier ikke noe om risikoen. Det gjør det du investerer i.'),
  i('Slik regnes skatten ved uttak','Uttak regnes først som innskutt kapital. Det du tar ut utover innskuddet, skattlegges som gevinst, etter fradrag for skjerming. Skjermingsfradraget bygger på den laveste innskuddsbeholdningen din i løpet av året og en risikofri rente. Utbytte settes inn på kontoen og skattlegges først ved uttak. Satser og skjermingsrente endres fra år til år, så sjekk gjeldende tall hos Skatteetaten.'),
  i('Tap','Et tap kan bare trekkes fra når kontoen avsluttes.'),
  i('Forskjellen mot en fondskonto','På en ASK kan du ta ut innskuddet først. På en fondskonto regnes hvert uttak som delvis gjenkjøp av en forsikring, og du tar ut en forholdsmessig andel av både innskudd og gevinst. Les «Hva er en fondskonto?» eller sammenligningen «ASK eller fondskonto?».')]},
 {kind:'explainer',id:'q-fondskonto',title:'Hva er en fondskonto?',checked:'2026-10-24',keys:['fondskonto','investeringskonto','kapitalforsikring'],
 questions:['Hva er en fondskonto?','Hva er fondskonto?','Hva er kapitalforsikring?','Hva er en investeringskonto?'],
 words:[alone('fondskonto',ASKNAVN),alone('kapitalforsikring',ASKNAVN),alone('investeringskonto',ASKNAVN),alone('unit ?link',ASKNAVN)],
 intro:'En fondskonto er et kombinert investerings- og forsikringsprodukt. Pengene plasseres i verdipapirer som fond, men kontoen er en kapitalforsikring. Den kalles også investeringskonto, og produktnavnene varierer fra tilbyder til tilbyder.',
 terms:[
  {term:'fondskonto',text:'Kontotypen slik Skatteetaten bruker ordet. Tidligere markedsført blant annet som Unit Link og investeringskonto.'},
  {term:'kapitalforsikring',text:'Forsikringen kontoen er bygd på. Forsikringsselskapet eier verdipapirene formelt. Du har et krav mot selskapet som tilsvarer verdien på kontoen, og du bærer risikoen for avkastningen.'},
  {term:'investeringskonto',text:'Et navn som er brukt om fondskontoer. Les vilkårene for å se hva produktet faktisk er.'},
  {term:'produktnavn',text:'Tilbydere kan gi fondskontoen sitt eget navn. Navnet sier ikke alltid at det er en fondskonto, så les vilkårene for å se hva produktet er.'},
  {term:'fond',text:'Det du kjøper for pengene i kontoen. Kontoen avgjør skatt og uttak. Fondene avgjør risiko og avkastning.'}],
 example:i('Eksempel: ta ut en del av pengene','Du har satt inn 100 000 kroner, og kontoen er nå verdt 150 000 kroner. Du tar ut 30 000 kroner. På en fondskonto regnes uttaket som en forholdsmessig andel av både innskudd og gevinst: 20 000 kroner er innskudd og 10 000 kroner er gevinst, og gevinsten skattlegges. Eksemplet ser bort fra skjermingsfradraget, som kan redusere den skattepliktige gevinsten. På en aksjesparekonto (ASK) ville de samme 30 000 kronene regnes som innskudd først, og du ville ikke betalt skatt av dette uttaket. Dette er et eksempel, ikke en beregning av din skatt.'),
 caveat:'Produktvilkår, forsikringskostnader og flyttevilkår hos den enkelte tilbyder er ikke kontrollert her. Skatteetatens rettledning er revidert oktober 2025 og gjelder inntektsåret 2025 og senere. Siden om skatteregler oppgir ingen oppdateringsdato. Kontrollert mot sidene 24. oktober 2026.',
 sources:[fondNo,fondRettledning],
 parts:[
  i('Skatt ved uttak','Alle uttak regnes som delvis gjenkjøp av forsikringen og utløser skatt på gevinsten. Gevinsten deles i en aksjedel og en rentedel, som skattlegges med ulike satser. Det er skjermingsfradrag på aksjedelen. Du kan ikke ta ut bare innskuddet først. Satser og regler endres, så sjekk gjeldende regler hos Skatteetaten.'),
  i('Hvem eier pengene?','Forsikringsselskapet eier verdipapirene formelt. Du har en fordring på selskapet og bærer selv risikoen for avkastningen.'),
  i('Forsikringselementet','Kontoen er en forsikring, men forsikringsdelen må være liten for at skattereglene for fondskonto skal gjelde. Vilkår og eventuell forsikringskostnad varierer mellom tilbydere. Les vilkårene før du velger.'),
  i('Kostnader og flytting','Sjekk samlede kostnader og hva som skjer hvis du vil flytte kontoen. Det varierer mellom tilbydere.')]},
 {notice:p=>p.age!==null&&p.age>F.value('bsuMaxAge')?'Nye BSU-innskudd kan gjøres til og med året du fyller {{bsuMaxAge}}. En eksisterende konto kan fortsatt brukes etter reglene.':p.owner==='yes'?'Boligeierskap ved årets slutt betyr at du ikke får BSU-fradrag for året.':'',id:'q-bsu-basics',category:'bsu',title:'Hva er BSU?',checked:date,keys:['bsu','boligsparing'],words:[/\bbsu\b/,/boligsparing for ungdom/],questions:['Hva er BSU?','Hva betyr BSU?','Hvordan fungerer boligsparing for ungdom?'],
 intro:'BSU er boligsparing for ungdom på en egen bankkonto. Du kan få skattefradrag, men pengene er bundet til godkjente boligformål. Det er en spareordning, ikke et fond.',sources:[bsu],
 parts:[i('Grenser for {{year}}','Du kan spare til og med året du fyller {{bsuMaxAge}}. Årsgrensen er {{bsuAnnual}} kr og samlet innbetalt beløp er begrenset til {{bsuTotal}} kr. Fradraget er {{bsuPercent}} prosent, maksimalt {{bsuMaxDeduction}} kr, hvis du har nok skatt og oppfyller vilkårene.')],
 options:[{title:'Bruke BSU',subtitle:'Når boligformål og skattevilkår passer.',poorFit:'du trenger pengene som buffer eller til andre enn godkjente boligformål.',pros:[i('Mulig skattefradrag','I {{year}} kan innskudd gi {{bsuPercent}} prosent fradrag. Du får ikke mer fradrag enn skatten du kan trekke det fra.'),i('Bankkonto uten aksjesvingninger','Sammenlign bankenes BSU-renter. Dette er bankplassering, selv om renten kan endres.')],cons:[i('Binding til boligformål','Les reglene før du bruker pengene. Brudd kan føre til tilbakeføring av tidligere fradrag.'),i('Ikke fradrag for alle','Eier du bolig ved årets slutt, får du ikke fradrag det året. Aldersgrensen og skatten din har også betydning.')]},
 {title:'Spare utenfor BSU',subtitle:'Når du trenger friere bruk av pengene.',poorFit:'du ønsker BSU-fordelene, oppfyller vilkårene og kan binde pengene.',pros:[i('Mer fleksibilitet','En vanlig sparekonto kan brukes til både buffer og andre mål. Kontroller eventuelle uttaksbegrensninger.'),i('Du kan skille mellom flere behov','En reserve og et langsiktig mål trenger ikke ha samme plassering.')],cons:[i('Ingen BSU-fradrag','Hvis du oppfyller vilkårene, går du glipp av et mulig skattefradrag.'),i('Andre bankvilkår','Rente og uttaksregler kan være dårligere enn på en aktuell BSU-konto. Sammenlign vilkårene.')]}]},
 {notice:p=>p.age!==null&&p.years!==null&&p.age+p.years<F.value('ipsStartAge')?'Sparetiden slutter før du er {{ipsStartAge}}. Ordinære IPS-uttak kan ikke starte så tidlig. Vurder disse pengene separat fra bundet pensjonssparing.':'',id:'q-ips-ask',category:'pension',title:'IPS eller ASK?',checked:date,keys:['ips'],words:[/\bips\b/,/individuell pensjonssparing/,/individuell sparing til pensjon/,/(?:aksjesparekonto|\bask\b).*\bips\b|\bips\b.*(?:aksjesparekonto|\bask\b)/],questions:['Bør jeg velge IPS eller ASK?','IPS eller ASK?','Hva er forskjellen på IPS og ASK?','Hva er IPS?'],
 intro:'IPS er bundet pensjonssparing med egne skatteregler. ASK gir mer tilgang til pengene. Valget av konto sier ikke hvor mye risiko investeringene har.',sources:[ips,ask],
 parts:[i('Hvilken IPS mener vi?','Dette gjelder den nye ordningen fra {{ipsIntroduced}}. Eldre IPS-avtaler kan ha andre skatteregler.'),i('Binding og skatt','I {{year}} er maksimal årlig innbetaling {{ipsAnnual}} kr, inkludert aktuelle kostnader og forsikring i avtalen. IPS gir fradrag ved innbetaling, mens hele utbetalingen skattlegges som alminnelig inntekt. Ordinært uttak kan tidligst starte ved {{ipsStartAge}} år og må vare minst til {{ipsEndAge}} år og minst {{ipsMinYears}} år. Det finnes særregler, blant annet ved uførhet.')],
 options:[{title:'IPS',subtitle:'For penger du kan binde til pensjon.',poorFit:'pengene kan bli nødvendige før ordinært pensjonsuttak.',pros:[i('Fradrag og fritak for formuesskatt','Innbetalingen kan gi fradrag. Kapitalen i den nye ordningen er unntatt formuesskatt og løpende skatt på avkastning.'),i('Binding kan hjelpe sparevanene','Pengene holdes av til pensjon. Det kan være nyttig hvis du ellers bruker opp langsiktig sparing.')],cons:[i('Pengene er lite fleksible','Ordinært uttak er tidligst fra {{ipsStartAge}} år og fordeles over mange år. Ikke bruk IPS som buffer.'),i('Fradraget er ikke en skattefri gave','Hele utbetalingen skattlegges som alminnelig inntekt. Se skattefordelen sammen med binding, kostnader og framtidige skatteregler.')]},
 {title:'ASK',subtitle:'For fleksibel sparing i kvalifiserte aksjer og aksjefond.',poorFit:'du trenger en forutsigbar reserve eller binding for å holde av pensjonspengene.',pros:[i('Innskudd kan tas ut først','Innskutt beløp kan normalt tas ut uten skatt. Skatt på gevinster utsettes til skattepliktig uttak.'),i('Fleksibel tilgang','Ordningen har ikke IPS-binding. Det gir frihet til å endre bruken av pengene.')],cons:[i('Ingen IPS-fradrag eller IPS-binding','ASK gir ikke fradrag for innskudd og er ikke generelt fritatt for formuesskatt. Tilgjengeligheten krever at du selv holder av pensjonspengene.'),i('Kontoen begrenser investeringene','ASK gjelder kvalifiserte aksjer og aksjefond innenfor EØS-reglene. Rene rentefond passer ikke på ASK.')]}]},
 {id:'q-ask-zero',category:'funds',title:'ASK eller fondskonto?',checked:date,words:[both],questions:['Hva er forskjellen på aksjesparekonto og fondskonto?','ASK eller fondskonto?','ASK eller investeringskonto?'],
 intro:'ASK og forsikringsbasert fondskonto har ulike regler for skatt og uttak. Fondskonto kalles også investeringskonto, og tilbydere kan bruke egne produktnavn. Her sammenlignes kontotypene, ikke bestemte tilbydere.',sources:[ask,zeroTax],
 parts:[i('Ulik skatt ved uttak','På ASK tas innskudd normalt ut før skattepliktig gevinst. Fra fondskonto består et uttak forholdsmessig av innskudd og gevinst eller tap. Kontoene er derfor ikke skattemessig like ved deluttak.')],
 options:[{title:'ASK',subtitle:'For kvalifiserte aksjer og aksjefond.',poorFit:'du trenger investeringer som faller utenfor ASK-reglene.',pros:[i('Innskudd ut før gevinst','Kan være nyttig hvis du vil hente ut en del av sparingen uten å utløse gevinstskatt ennå.'),i('Utsatt skatt innenfor ordningen','Kjøp og salg på kontoen utløser normalt ikke løpende gevinstskatt.')],cons:[i('Ikke alle investeringer er tillatt','Ved kjøp på ASK må selskapet eller aksjefondet være hjemmehørende i EØS. Aksjefondet må ha over 80 prosent aksjeandel ved inntektsårets begynnelse. Rene rentefond faller utenfor. Verdipapirer som oppfylte kravene ved kjøp, kan beholdes selv om de senere ikke lenger oppfyller dem.'),i('Tap kommer ikke straks til fradrag','På ASK får du normalt først fradrag for samlet tap når kontoen avsluttes.')]},
 {title:'Forsikringsbasert fondskonto',subtitle:'En kontotype med kapitalforsikring.',poorFit:'du vil ta ut bare innskudd først eller ikke ønsker en forsikringsavtale.',pros:[i('Kan romme flere investeringer','Utvalget avhenger av avtalen og kan være bredere enn på ASK. Kontroller hva tilbyderen tillater.'),i('Utsatt skatt på avkastning','Avkastning skattlegges normalt ved uttak, ikke ved hvert kjøp og salg inne på kontoen.')],cons:[i('Deluttak kan utløse skatt','Du tar ut en forholdsmessig del av gevinst eller tap sammen med innskuddet. Du kan ikke ta ut bare innskuddet først som på ASK.'),i('Andre vilkår og kostnader','Kontroller forsikringsvilkår, eierskap, samlede kostnader og hva som skjer ved flytting.')]}]},

 // Forklaring («hva er dette?»): kort svar, begreper, eksempel, fordypning. Ingen alternativkort.
 {kind:'explainer',id:'q-kjopekraft',title:'Hva er kjøpekraft?',checked:'2026-10-24',keys:['kjøpekraft','inflasjon','prisvekst'],
 questions:['Hva er kjøpekraft?','Hva er prisvekst?','Hva er inflasjon?','Hva betyr dagens kroner?','Hvorfor blir pengene mindre verdt på konto?'],
 words:[/kj[øo]pekraft/,/prisvekst/,/inflasjon/,/dagens kroner/,/mindre verdt/,/mister verdi/],
 intro:'Kjøpekraft er hvor mye du kan kjøpe for pengene. Når prisene stiger, rekker det samme kronebeløpet til mindre. Prisveksten kalles også inflasjon.',
 terms:[
  {term:'kjøpekraft',text:'Hvor mye du kan kjøpe for et beløp.'},
  {term:'prisvekst',alsoCalled:'inflasjon',text:'At prisene på varer og tjenester stiger over tid. Oppgis ofte i prosent per år.'},
  {term:'dagens kroner',text:'Et beløp i framtiden regnet om til hva det tilsvarer med dagens priser. Da kan du sammenligne beløp fra ulike år.'}],
 example:i('Eksempel: ti år med 2,5 % prisvekst','Anta at prisene stiger 2,5 % hvert år. Det du i dag kan kjøpe for 100 000 kroner, koster da omtrent 128 000 kroner om ti år. Pengene må altså vokse til 128 000 kroner bare for å kjøpe det samme. Sett fra den andre siden: 100 000 kroner som ligger uten rente i ti år, kjøper det som 78 000 kroner kjøper i dag. Dette er et regneeksempel, ikke en prognose for prisveksten.'),
 next:{text:'Prøv med dine egne tall i kalkulatoren',href:'index.html'},
 sources:[ssb],
 parts:[
  i('Færre kroner er noe annet enn mindre kjøpekraft','Får du tilbake færre kroner enn du satte inn, er det et tap i kroner. Får du flere kroner, men prisene har steget mer enn pengene, har du likevel mistet kjøpekraft. Det er to ulike ting, og de må ikke forveksles.'),
  i('Renten må følge med prisene','Med positiv rente som er lavere enn prisveksten, kan saldoen øke samtidig som pengene kjøper mindre. Saldoen sier derfor ikke alene om du har det bedre.'),
  i('Prisveksten er et gjennomsnitt','SSB måler prisveksten med konsumprisindeksen, som er et gjennomsnitt av prisendringene på mange varer og tjenester. Det du selv kjøper, kan stige mer eller mindre enn gjennomsnittet. Prisveksten varierer også fra år til år.')]}
];
if(typeof module!=='undefined'&&module.exports)module.exports=entries;
else {for(const entry of entries)root.SpareVeileder.register(entry);}
})(typeof window!=='undefined'?window:globalThis);
