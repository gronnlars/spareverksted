# Sparekalkulatoren: retting i små steg

Lars godkjente rettingsplanen 4. november 2026. Arbeidsgrunnlag: main `b0ab8cbbf77a4cb6e63a06caf65cdf8cbc1d301a`. Oppdraget gjelder fanen Sparing, «Hva kan sparingen bli?», som mal for videre kalkulatorarbeid. Regnemotoren, fungerende navneforslag og rapportenes eksisterende UU-arbeid skal bevares. Lån forblir avpublisert. Hver PR godkjennes av Lars før sammenslåing, som starter publisering.

## Vedtatt rekkefølge

| Steg | Leveranse | Status i denne PR-en |
| --- | --- | --- |
| 1 | Rapportens utskriftsflyt på mobil, feil og retur, med bevart PDF-struktur | Lars har bekreftet funksjon på PC og iPhone etter publisering. PDF-scorearbeid er parkert |
| 2 | Tabeller og store beløp uten sideveis rulling, også inne i rapporten | Første del: sparetabellen har loddrett visning ved plassmangel. Sammenligning, rapporttabeller og store hovedtall gjenstår |
| 3 | Navigering, synlig lagring og sikre hoppmål | Ikke startet |
| 4 | Samordnet formatdialog og tydelig utvalg ved nedlasting | Ikke startet |
| 5 | Lesbar månedsperiode, språk, nivåer og kildevedlikehold | Ikke startet |
| 6 | Samordne mal og endelig overlevering med det som faktisk er kontrollert | Utskriftsregelen er oppdatert. Resten venter |

Presiseringer fra Lars:

- Steg 2 skal ha tydelige overskrifter og etiketter også når tabellradene vises loddrett. Se det eksisterende mønsteret på UU-siden før ny kode skrives. Dette er standard, ikke en valgfri forbedring.
- Navigeringen skal tåle at det grønne resultatfeltet flyttes senere. På PC ligger Se resultat nedenfor i dagens oppsett. Bevar en eksplisitt kommando og et mål i den levende siden, uten å lage en ny fast linje som del av denne rettingen.
- PDF-resultatet 82/100 er fra ThefrontKit. Claudes grundige dokumentasjon i BESLUTNINGER.md, «PDF-rapporten», legges til grunn. Ikke start en ny utredning av allerede kjente PDF-begrensninger eller bytt PDF-motor i dette steget.
- Ingen ny betalt tjeneste, serverbehandling av brukerens tall eller direkte PDF-generator er innført.

## Steg 1: den konkrete feilen

`report-print.js` brukte tidligere `(hover: none)` til å avgjøre om rapporten skulle gjenåpnes når `window.print()` kom tilbake. Et ignorert kall uten `beforeprint` eller `afterprint` lot dermed rapporten være lukket på berøringsskjerm. Sidetittelen ble heller ikke satt tilbake. Et unntak fra utskriftskallet hadde samme problem.

Dette er gjenskapt ved å simulere et ignorert kall i en berøringskontekst. Den nye regresjonstesten stopper med gammel kode. Det er ikke en påstand om at hele Lars sin iPhone-feil er gjenskapt på fysisk telefon.

Rettingen bruker utskriftshendelser og utskriftsmediet:

- Ingen utskrift startet: gjenåpne rapporten, sett tilbake sidetittel og fokus, og vis hjelp om nettleserens meny.
- Utskrift startet: hold rapportvinduet lukket til avslutningen, slik at utskriftskopien fortsatt er tilgjengelig for PDF-merking.
- Nettleserens meny mens rapporten er åpen: fjern modaliteten og behold nøyaktig samme utskriftskopi. Dette omfatter åpen plan, sammenligning og valgte planer.
- Retur fra utskriftsmediet kan gjenopprette rapporten hvis `afterprint` mangler. Forsinkede returkall fra et tidligere forsøk skal ikke overskrive et nytt forsøk.

Det er ikke laget nye rapportmaler eller endret hvilke planer eksportbyggerne tar med. `laan.html` får bare ny innholdsversjon for det felles skriptet. Lånesiden publiseres fortsatt ikke.

## Kontroller

Den nye testen `tests/rapport-utskrift-browser.cjs` dekker mus og berøring for tre rapportveier. Den prøver ignorert kall, unntak, gjentatte forsøk, nettleserens meny, asynkron avslutning, retur fra utskriftsmediet, bevart rapportinnhold og fokus. Chromium lager også PDF-er via nettleserhendelser uten å trykke på sidens utskriftsknapp.

Den eksisterende `tests/pdf-merking-browser.cjs` beholder sine strukturkrav. Den simulerer nå `beforeprint` i stedet for å bruke hover som en omvei for å holde utskriften åpen. At testen ber om bokmerker med Playwright, dokumenterer fortsatt ikke bokmerker fra vanlig Chrome.

Lokalt med Playwright 1.56.0 / Chromium 141 består den nye utskriftstesten og de eksisterende `pdf-merking-browser.cjs`, `last-ned-valgte-browser.cjs`, `eksport-innhold-browser.cjs`, `last-ned-browser.cjs` og `a11y-browser.cjs`. UU-kontrollen omfatter kontrast, trykkflater, navn, reflow ved 320 og 640 px, fokus, korte vinduer og tastatur i tre temaer. `engine.test.cjs`, `tax-export.test.cjs`, sikkerhetskontroll, versjonskontroll, JS-syntaks og diff-kontroll består også. Regresjonstesten stoppet med gammel kode både ved ignorert utskrift i berøringskontekst og ved unntak fra utskriftskallet.

Firefox starter lokalt, men oppretting av testsiden ble hengende og kontrollen ble avbrutt etter 60 sekunder. WebKit kunne ikke starte på grunn av manglende systembiblioteker. Ingen av disse lokale forsøkene regnes som bestått. Den nye testen kjøres i alle tre motorer i GitHub Actions, som har eget nettlesermiljø. CI-resultatet må kontrolleres på PR-ens siste commit.

Fysisk iPhone/Safari, VoiceOver og en ny ThefrontKit-prøve er ikke utført. Ingen ny poengsum eller full WCAG-/PDF/UA-godkjenning påstås.

Før steg 1 lukkes: prøv å åpne rapporten, skrive ut, avbryte, returnere og prøve igjen på iPhone. Kontroller både én plan og valgte planer. Hvis nettleseren sperrer knappen, prøv nettleserens eget utskriftsvalg med rapporten åpen. Originalrapport og riktig planutvalg skal bevares.

## Kilder brukt for denne rettingen

Lest 4. november 2026:

- [Uu-tilsynet: PDF](https://www.uutilsynet.no/veiledning/pdf/218), sist endret 8. januar 2025. Understreker et godt grunndokument og riktig konvertering. Eksemplene gjelder særlig Word og InDesign. Sidens eldre lenke til WCAG 2.1 erstatter ikke prosjektets standard 2.2.
- [W3C: PDF-teknikker for WCAG 2.2](https://www.w3.org/WAI/WCAG22/Techniques/#pdf). Teknikker er eksempler på å oppfylle kriteriene, ikke en egen sertifisering eller et krav om ett bestemt program.
- [PDF1: tekstalternativer](https://www.w3.org/WAI/WCAG22/Techniques/pdf/PDF1), [PDF3: leserekkefølge](https://www.w3.org/WAI/WCAG22/Techniques/pdf/PDF3), [PDF6: tabellstruktur](https://www.w3.org/WAI/WCAG22/Techniques/pdf/PDF6), [PDF9: overskrifter](https://www.w3.org/WAI/WCAG22/Techniques/pdf/PDF9), [PDF16: språk](https://www.w3.org/WAI/WCAG22/Techniques/pdf/PDF16) og [PDF18: tittel](https://www.w3.org/WAI/WCAG22/Techniques/pdf/PDF18). Brukes til å bevare eksisterende egenskaper. Automatisk tilstedeværelseskontroll dokumenterer ikke full leserekkefølge, grafenes faglige tekstalternativ eller alle visningsvalg for tittel.

Oppdrag, kode, tester og dokumentasjon: ChatGPT/Codex. Egenkontroll. Ingen fysisk brukertest i denne økten.

## Steg 2, første del: selve sparetabellen

Implementert på fersk main etter #217: én tabell med ekte kolonneoverskrifter og radoverskrifter. Når tabellen er for bred for sitt område, blir én rad vist loddrett med tydelig etikett ved hvert beløp. Den går tilbake til vanlig tabell når det er plass. Store beløp kan bryte ved tusenskiller uten å redusere skriften eller fjerne sifre. Ingen beregningsverdi eller eksport er endret.

Lokalt består `sparetabell-browser.cjs` i Chromium med tre kronevisninger, vanlige/store beløp og bredder 256, 320, 390, 640, 1280 og 1920 px, også tilbake til bred visning. Testen sammenligner alle verdier før og etter endret bredde. Eksisterende inndatatest, PDF-merking, UU-nettlesertest, beregningskontroll, sikkerhet, versjoner og syntaks består. Sparetabellen er ikke lenger unntatt fra UU-testens kontroll av intern sideveis rulling. Tekstforventningen «eksakte beløp» er presisert til «avrundet til hele kroner», i samsvar med den uendrede avrundingen.

Dette er første avgrensede del, ikke hele steg 2. Sammenligningstabeller, rapporttabeller og kompakt visning i hovedresultatet gjenstår. Faktisk PC-zoom og fysisk iPhone/VoiceOver er ikke kontrollert i denne delen. Den nye testen er lagt i CI for Chromium og WebKit. Alle undersider får ny stilarkversjon fra det eksisterende versjonsskriptet, uten nye innholdsendringer.

## Steg 2, andre del: sammenligningstabeller

Sammenligning av spareplaner og den delte tabellvisningen for sparemål bruker samme innholdstilpasning som sparetabellen. Hver verdi har et synlig plannavn ved smal visning. Ekte rad- og kolonneoverskrifter beholdes for hjelpemidler, mens de gjentatte visuelle etikettene er dekorative. Merknader som «forlenget» flyttes med verdien. Hele plannavn beholdes, også når de er lange. Ingen beregning, eksportmatrise eller rapportbygger er endret.

Lokalt består den nye `sammenligningstabell-browser.cjs` i Chromium ved 256, 320, 390, 640, 1280 og 1920 px, også tilbake til bred visning. Den kontrollerer begge sammenligningstyper, tydelige etiketter, tabelloverskrifter, ingen intern sideveis rulling og uendrede celleverdier etter breddeendring. De eksisterende testene for lagrede planer, eksportinnhold og PDF-merking består. CI kjører den nye testen i Chromium og WebKit. Fysisk iPhone, VoiceOver og faktisk PC-zoom er fortsatt ikke kontrollert. Rapporttabeller og store hovedtall gjenstår i steg 2.

PR #218 krevde også tilpasning av kolonnevalget i `prov-renters-browser.cjs`: årstallet er nå en radoverskrift, og testen leser derfor beløpsfeltene direkte. De samme tallkravene, 10 404 og 9 903 kroner, beholdes. Testen består lokalt i Chromium etter tilpasningen.

## Oppfølging etter sammenslåing av #219: breddekontroll

PR-kontrollene på #219 besto, men kjøringen på main (`c5e1715`, Actions 41903220499) stoppet i `sparetabell-browser.cjs` i WebKit. Feilmeldingen viser store beløp i kjøpekraftvisning, bredde 1280 px, tilgjengelig 836 px og faktisk innholdsbredde 842 px, uten radvis visning. Sammenligningstestene i Chromium og WebKit besto i samme kjøring.

Breddeavgjørelsen brukte bare tabellens `scrollWidth`. Den kontrollerer nå også områdets `scrollWidth` og tabellens ytre rektangel. Dermed brukes samme mål på faktisk overløp som i testen, også hvis tabellens eget mål avviker. Loggen inneholder ikke tabellens separate måleverdier, så den dokumenterer ikke alene hvilken WebKit-måling eller oppdatering som ga avviket. CI på rettingen må bekrefte utfallet. Ingen feil ignoreres, toleransen er uendret, og ventetiden i testen er ikke økt.

Testmatrisen utvides med flere bredder rundt 1280 px etter at tabellen har vært smal. Lokal sparetabell- og sammenligningstest består i Chromium. Fysisk Safari/iPhone er ikke prøvd. Regnemotor, PDF og HTML-rapporten endres ikke.

## Scenariovalg når «Begge» er valgt

Lars påpekte at «Vis lavere og høyere scenario/vekst» kan krysses av selv om «Begge» ikke viser scenarioene. Avkryssingen er nå native `disabled` i denne visningen, med lesbar dempet etikett og forklaring via spørsmålstegnet om å velge «Kroner» eller «Kjøpekraft». Forklaringen er også koblet med `aria-describedby` mens valget er deaktivert. Hjelpeknappen er fortsatt tilgjengelig. Justering av forskjellen mellom utfallene skjules også når scenarioene ikke vises.

Tidligere avkrysset eller ikke avkrysset tilstand beholdes ved bytte tilbake. Ingen beregning, planlagring eller eksport endres. Regelen gjelder i både graf- og tabellvisning. Eksisterende `forklaring-oppdateres-browser.cjs` er utvidet med begge avkrysningstilstander og begge visninger. Den består lokalt i Chromium og kjøres allerede i Chromium, Firefox og WebKit i CI. CI på siste commit må kontrolleres. Fysisk iPhone/VoiceOver er ikke prøvd.

### Samordning av #222 etter HTML-rettingene

Grenen er oppdatert mot main etter #223. HTML-konflikten gjaldt skriptlisten: scenariovalgets nye `journey.js` og `report-html.js` fra main er begge beholdt, og innholdsversjoner er generert på nytt.

Den tidligere CI-feilen i navigasjonstesten var en timeout ved klikk på «Se resultat» under grafen. Loggen viste venting på synlig/aktiv/stabil knapp, men dokumenterte ikke årsaken. Stoppet er ikke gjenskapt lokalt: tre kjøringer består, inkludert én med fire ganger CPU-nedbremsing i Chromium. Navigasjonskoden og testkravene endres derfor ikke på grunnlag av denne ene loggen. Ved ny testfeil lagres skjermbilde og Playwright-sporing i eksisterende UI-testartefakt, slik at posisjon, fokus og hendelser kan undersøkes. Ingen tvungne klikk, økt ventetid eller svekkede krav er lagt inn.

Scenariovalgets av/på-tilstand, bytte mellom graf/tabell og tilbake til Kroner/Kjøpekraft består lokalt. HTML-rapporten består etter samordningen, inkludert Nu-validering av alle fem rapportveier. Full CI på siste commit må kontrolleres før sammenslåing. Tidligere navigasjonsstopp regnes ikke som en dokumentert, rettet produktfeil.

### Ingen ekstra tekstlinje ved deaktivering

Lars presiserte under gjennomgangen at synlig hjelpetekst kan forstyrre oppsettet. Forklaringen ved scenariovalget beholdes derfor skjult i selve kalkulatoren, og tas fram via den eksisterende hjelpeknappen. Skjermlesere har fortsatt `aria-describedby` når feltet er deaktivert. Deaktiveringen legger ikke til en tekstlinje over grafen.

En regresjonstest sammenligner avstanden fra scenarioraden til grafen før/etter «Begge». Den stoppet med den synlige forklaringen og består med denne rettingen. Testen kontrollerer også at hjelpeknappen gir instruksen og at tidligere avkrysning bevares. Lokalt bestått i Chromium. Tidligere grønn CI gjelder forrige commit; ny CI må bestå etter endringen.
