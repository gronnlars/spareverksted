# Testliste for Sparing etter finpussen

Arbeidsgren: `fix/begge-scenariovalg`, PR #222. Denne listen gjelder den samlede, upubliserte rettingen. Åpne riktig forhåndsvisning eller publisert versjon etter særskilt godkjenning. Den eksisterende nettsiden viser ikke endringene før de er publisert. Test med oppdiktede planer. Ikke slett ekte lagrede planer for å begynne testen.

Marker hvert punkt med bestått, feil eller ikke prøvd. Ved feil: noter enhet, nettleser, zoom, nivå, åpne forklaringer, de innskrevne tallene og handlingen som utløste feilen. Et skjermbilde er nyttig.

## 1. Utstyr og visninger

| Miljø | Prøv |
| --- | --- |
| PC, vanlig nettleser | 100, 175, 200, 400 og 500 % nettleserzoom |
| iPhone, Safari | Stående og liggende, med tastaturet åpent og lukket |
| Fargetema | Nøytralt, lyst og mørkt. Minst én smal visning i hvert tema |
| Nivå | Enkel, Utforsk og Avansert |
| Tastatur på PC | Tab, Shift+Tab, Enter, mellomrom og Escape |
| Hjelpemidler hvis tilgjengelig | VoiceOver på iPhone. Dette er en egen kontroll, ikke erstattet av de automatiske testene |

Zoom endres i nettleseren, ikke bare ved å gjøre vinduet smalere. De lokale testene bruker bredder 256–1920 px og erstatter ikke denne kontrollen. På 500 % må vinduets utgangsbredde også noteres.

## 2. En fast beregning å sammenligne med

Bruk Sparing og la spareform være uvalgt. Skriv inn tallene nedenfor. Hvis en spareform allerede er valgt, fjern valget før tallene fylles inn.

| Felt | Verdi |
| --- | --- |
| Du har allerede | 50 000 kr |
| Du sparer hver måned | 2 000 kr |
| Du vil spare i | 10 år |
| Årlig vekst | 5 % |
| Årlig kostnad | 0,2 % |
| Prisvekst | 2,5 % |
| Årlig spareøkning, ekstra innskudd og børsfall | 0 |

Forventet med disse forutsetningene, avrundet til hele kroner:

- Kroner: **385 265 kr** ved slutten av perioden.
- Egne innskudd: **290 000 kr**.
- Kjøpekraft ved slutten: **300 968 kr**.

Referansen er kontrollert både med motoren og en separat løkke med 120 månedlige innskudd ved månedsslutt. Tallene skal beholdes ved nivåbytte, temabytte, zoom og navigering. Sammenlign kroner med kroner og kjøpekraft med kjøpekraft.

## 3. Resultat og store beløp

- [ ] Den faste beregningen over stemmer i Kroner og Kjøpekraft.
- [ ] På bred PC står beløpene ryddig under overskriftene.
- [ ] På smal flate og ved sterk zoom legges resultatets delbeløp under hverandre når det trengs.
- [ ] Et beløp brytes ved mellomrom. Ingen siffergruppe klippes eller deles midt i sifrene.
- [ ] Hele siden kan brukes uten sideveis rulling, også med nivåknappene synlige.
- [ ] Prøv startbeløp 9 999 999 999 kr, månedssparing 9 999 999 kr, 100 år, 15 % vekst og 0 % prisvekst. Ingen tekst eller beløp overlapper. Store resultater er merket med den eksisterende forklaringen om at de mister praktisk mening.
- [ ] Gå tilbake til vanlige tall. Kortet går tilbake til et ryddig oppsett uten at gamle tall blir stående.

Hele ord som «milliarder» beholdes i resultatet. Tabellene beholder alle sifrene. Akser kan bruke de eksisterende forkortingene. Det er ikke lagt inn en ny forkortingsregel som endrer selve tallverdiene ved zoom.

## 4. Graf, tabell og «Begge»

- [ ] Slå på lavere/høyere scenario i Kroner. Bytt til Begge: feltet er dempet og kan ikke endres.
- [ ] Byttet legger ikke inn en ny forklaringstekst som flytter grafen ned.
- [ ] Spørsmålstegnet er fortsatt tilgjengelig og forklarer at Kroner eller Kjøpekraft må velges for å vise scenarioene.
- [ ] Bytt tilbake. Tidligere avkrysning kommer tilbake. Gjenta med feltet slått av før Begge velges.
- [ ] Gjenta i tabellvisning. Samme regel gjelder.
- [ ] I sparetabellen: vanlige og svært store tall ved alle zoomnivåene. På smal flate har hver verdi en tydelig etikett, og tidspunktet kan forstås.
- [ ] Utvid bredden igjen. Tabellen går tilbake til vanlig tabell når det er plass. Ingen tall forandres.

## 5. Hopp mellom felt, resultat, graf og planer

Prøv først med alle forklaringer lukket, deretter med Priser og kostnader, Juster spareplanen, ekstra innskudd/børsfall og Mer om tallene åpne. Prøv også etter valg av Indeksfond og åpnet renteforklaring. Lukk selve hjelpedialogen før hoppene prøves.

- [ ] Se resultat lander på resultatkortet. Merket Før skatt og resultatoverskriften er synlige.
- [ ] Se graf lander slik at grafoverskriften er synlig.
- [ ] Se resultat under grafen går tilbake til riktig resultatkort.
- [ ] Endre tall vises i én kolonne, og lander på feltpanelet uten å åpne skjermtastaturet.
- [ ] Endre tall er skjult når felt og resultat står ved siden av hverandre på PC.
- [ ] Sammenlign med en lagret plan åpner plandelen og flytter fokus til overskriften.
- [ ] Gjenta etter å ha lagret flere planer og åpnet sammenligning. Ingen hopp bruker en gammel posisjon.
- [ ] Til toppen i bunnteksten lander på toppen uten at fokus forsvinner.
- [ ] Ingen hopp endrer tall, avkrysning, nivå eller spareform.
- [ ] På mobil ligger ikke et felt med fokus bak resultatlinjen. Den kan fortsatt lukkes og åpnes som før.

Det er ikke laget en ny fast resultatlinje på PC. Kommandoen Se resultat og målet i koden er bevart hvis oppsettet endres senere.

## 6. Lagring tidlig i brukerreisen

- [ ] Lagre plan finnes ved resultatet, uten at du må ned til den lange planlisten.
- [ ] Den åpner samme lagredialog som Lagre plan i plandelen.
- [ ] Uten valgt formål foreslås Spareplan. Etter lagring foreslås første ledige nummer, for eksempel Spareplan (2).
- [ ] Avbryt endrer ingenting, og fokus kommer tilbake til knappen som åpnet dialogen.
- [ ] Lagre som ny plan oppretter en ny plan. Oppdater eksisterende plan endrer den valgte planen uten å lage en kopi.
- [ ] Åpne en lagret plan, endre ett tall og prøv begge lagringsvalgene. Kontroller at riktig plan er oppdatert.

Navneforslag og lagringsnøkler er bevart. Brukerens ekte planer skal ikke måtte flyttes eller importeres på nytt.

## 7. Last ned åpen plan, sammenligning og valgte planer

| Startsted | Forventet innhold |
| --- | --- |
| Last ned ved resultatet eller Last ned plan | Den åpne beregningen. Excel, CSV, Rapport (HTML / PDF) og Data (.json) |
| Last ned fra sammenligningen | Sammenligningen som vises. Excel, CSV og Rapport (HTML / PDF). Data (.json) skjules her fordi det valget gjelder en åpen plan |
| Knappen under planlisten | De avkryssede planene. Hvis ingen er krysset av, forklarer dialogen at alle lagrede planer følger med. Excel og Rapport (HTML / PDF) |

- [ ] Opprett tre navngitte planer, for eksempel Kort, Lang og Utelatt. Velg bare Kort og Lang til sammenligning.
- [ ] Sammenligningens formatdialog sier at den gjelder sammenligningen. Utelatt kommer ikke med.
- [ ] Excel og CSV fra sammenligningen har riktige navn og tall. Filnavnet inneholder sammenligning.
- [ ] Lukk sammenligningsrapporten og åpne Last ned ved hovedresultatet. Vanlig formatvalg kommer tilbake, inkludert Data (.json).
- [ ] Kryss av én plan i listen. Knappen under listen viser (1). Kryss av to: den viser (2).
- [ ] Åpne nedlasting for valgte planer. Dialogens antall stemmer. Bare de valgte planene følger med.
- [ ] Fjern alle avkrysninger og åpne igjen. Dialogen forklarer at alle lagrede planer følger med.
- [ ] Åpne og avbryt dialogene flere ganger. Ingen tidligere sammenligning følger ved et uhell med i en annen nedlastingsvei.

## 8. Rapport, HTML og PDF

Prøv én åpen plan, sammenligning av to planer og samlet rapport for valgte planer.

- [ ] Forhåndsvisningen har riktig overskrift, planutvalg og forutsetninger.
- [ ] På sterk zoom vises for brede tabeller radvis, med forståelige etiketter ved verdiene. Ingen intern eller ytre siderulling.
- [ ] Last ned HTML. Åpne filen fra Filer på iPhone og fra nedlastingsmappen på PC. Innhold og tema stemmer med forhåndsvisningen.
- [ ] Åpne HTML uten internett. Tall, tekst og grafer er fortsatt der.
- [ ] Skriv ut / lagre som PDF åpner nettleserens vanlige utskriftsvalg. Lagre, avbryt, gå tilbake og prøv igjen.
- [ ] PDF inneholder riktig planutvalg. Knappene blir ikke med i utskriften.
- [ ] Endring av zoom i forhåndsvisningen endrer ikke hvilke planer som kommer med i PDF.
- [ ] Hvis du prøver W3C: last opp selve HTML-filen som ble lastet ned. Noter om resultatet gjelder HTML, CSS eller PDF. Poengsummene fra ulike verktøy er ikke samme måling.

Kjente begrensninger i nettleserlaget PDF og den tidligere PC-valideringen er parkert etter Lars sin vurdering. Denne runden påstår ingen ny PDF-score eller full WCAG-/PDF/UA-godkjenning.

## 9. Desimalår skal være tydelige

Sett startbeløp til 0, månedssparing til 1 000 kr, vekst, kostnad og prisvekst til 0. Ingen ekstra innskudd eller fall.

| Skriv i årsfeltet | Beregnet periode | Forventet resultat |
| --- | --- | --- |
| 0,5 | 6 måneder | 6 000 kr |
| 25,5 | 25 år og 6 måneder | 306 000 kr |
| 25,9 | 25 år og 11 måneder | 311 000 kr |
| 25,99 | 26 år, etter månedsavrunding | 312 000 kr |
| 26 | 26 år | 312 000 kr |

- [ ] Feltforklaringen og resultatoverskriften gjør månedsavrundingen forståelig.
- [ ] Rapporten viser samme periode. Tallfeltet beholder tallet du skrev inn.
- [ ] Lagre, åpne og del en plan med 25,9 år. Samme 311 måneder brukes etterpå.
- [ ] Årstallet ved slutten av perioden er rimelig ut fra dagens måned. Det skal følge antall måneder, ikke bare avrunding til hele år.
- [ ] Slett årsfeltet midlertidig og skriv inn igjen. Ingen NaN, nullresultat eller gammel månedsforklaring ser ut som et nytt gyldig resultat.

25,9 betyr desimalår. Det betyr ikke 25 år og 9 måneder. Inndataformatet er bevart, mens den beregnede perioden nå vises med år og måneder.

## 10. Nivå, språk og skjulte forutsetninger

- [ ] Enkel viser grunnfeltene. Utforsk gir tilgang til Juster spareplanen. Avansert gir tilgang til ekstra innskudd og børsfall.
- [ ] Sett 2 % årlig spareøkning, et ekstra innskudd og et børsfall på Avansert. Bytt til Enkel: resultatet skal ikke endres, og skjulte aktive valg skal fortsatt forklares.
- [ ] Bytt tilbake. Verdiene er bevart.
- [ ] Sats, kostnad og prisvekst i resultatets forklaring stemmer med tallene som faktisk er lagt inn.
- [ ] Ingen tekst lover et resultat eller kaller en spareform best for deg.
- [ ] Kilden og perioden ved sparekontorenten stemmer med det som vises i forklaringen. Å velge spareform og deretter angre gjenoppretter tallene.

## 11. Tastatur og skjermleser

- [ ] Tastatur kan åpne og lukke lagring, formatvalg og rapport. Fokus er synlig og kommer tilbake etter lukking.
- [ ] Dialogens overskrift og lukkeknapp er forståelige ved opplesning.
- [ ] I smal tabell leses verdien sammen med riktig rad og kolonne. De dekorative etikettene leses ikke dobbelt.
- [ ] Det deaktiverte scenariovalget har en forklaring via spørsmålstegnet. Hjelpeknappen er tilgjengelig selv om avkryssingen ikke er det.
- [ ] Tastaturfokus dekkes ikke av resultatlinje eller nettleserens verktøylinje.

## 12. Noter utfallet

| Kontroll | Resultat | Enhet/nettleser/zoom | Feil eller merknad |
| --- | --- | --- | --- |
| Vanlig beregning | | | |
| Store tall og sidebredde | | | |
| Graf/tabell/Begge | | | |
| Navigering | | | |
| Lagring/navn | | | |
| Tre nedlastingsveier | | | |
| HTML | | | |
| PDF | | | |
| Desimalår | | | |
| Nivåer | | | |
| Tastatur/VoiceOver | | | |

En feil betyr at det aktuelle punktet skal rettes før denne versjonen regnes som godkjent mal. Ikke bruk «ikke prøvd» som bestått.
