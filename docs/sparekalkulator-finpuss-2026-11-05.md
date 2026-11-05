# Sparekalkulatoren: samlet finpuss og overlevering

Status: arbeidsgren `fix/begge-scenariovalg`, PR #222. Ikke slått sammen eller publisert. Lars ba 5. november om å samle de resterende punktene, gjøre én retting om gangen og levere testliste. Ingen opprydding i GitHub Actions inngår. Det er ikke ventet på eller fulgt en full CI-kjøring for denne leveransen.

Arbeidsgrunnlaget er main `fe9f6f061ae00adcb97443bc6d3869874e3c9bd9` etter #223, pluss det upubliserte scenariovalget i #222. Tidligere publiserte utskrifts-, tabell- og HTML-rettinger beholdes. `dist/engine.js` og `dist/report-print.js` er uendret mot main. Ingen nye eksterne ressurser, nye lagringsnøkler eller serverbehandling av brukerens tall.

## Hva som er gjort

| Lars sitt punkt | Løsning og avgrensning |
| --- | --- |
| Utskrift og nedlasting på mobil | Tidligere retting beholdes. Samme forhåndsvisning tilbyr HTML og PDF. Ingen ny PDF-motor eller utredning av poengsummer |
| Endre tall på bred PC | Skjules i sparekalkulatoren når den har to kolonner. Beholdes når den har én. Følger oppsettbredden, ikke et antatt zoomnivå eller enhet |
| Sammenligningsrapport i samme formatvalg | Eksisterende dialog beholdes. Beskrivelse og formatkort sier at de gjelder sammenligningen. Excel, CSV og HTML/PDF beholdes. JSON skjules i denne veien, siden det valget eksporterer en åpen plans innstillinger. Vanlig plan får JSON tilbake ved neste åpning |
| Tabeller uten siderulling | De publiserte spare- og sammenligningstabellene beholdes. Forhåndsvisningens rapporttabeller bruker nå samme innholdsmålte radvisning og semantiske overskrifter. Dette endrer ikke PDF-kopien. Nedlastet HTML har sitt eksisterende mønster |
| Store beløp | Resultatkortet tilpasser delbeløp til faktisk kolonnebredde. Ved liten plass blir de én kolonne. Vanlige mellomrom lar beløp bryte mellom siffergrupper. Hele ord som milliarder beholdes. Nivåknappene kan bryte på de smaleste breddene. Akser i rapport for valgte planer bruker samme forkortingshjelper som resten |
| Se resultat på PC | Eksisterende kommando og målet i siden beholdes. Ingen ny fast linje. Resultatets hoppmargin er eksplisitt også på PC |
| Lagring for skjult | Lagre plan er lagt ved resultatet. Den bruker `openSave`, med eksisterende navn, duplikatnummer og oppdateringsvalg. Den lange plandelen er beholdt |
| Navneforslag | Bevares. Lokalt kontrollert både eksisterende navneflyt og snarveien med Spareplan og Spareplan (2) |
| Last ned plan / planen | Hovedknappen beholder vedtatt navn. Valg under listen viser antall også ved én avkrysset plan. Dialogens beskrivelse av alle eller valgte planer beholdes |
| Hoppmål ved åpne forklaringer og mange planer | Hopp til plandelen samles om den levende overskriften og åpner details først. Se graf, Se resultat og Endre tall bruker eksisterende mål og fokus. Testen åpner forklaringer, lagrer planer og kontrollerer at navigering bevarer tilstanden |
| Desimalår | `periodText` viser år og måneder fra samme `Math.round(t*12)` som motoren. Feltets eksisterende forklaring viser månedsavrundingen ved desimalår. Rapportsammendrag og spareperiodens forutsetning bruker samme tekst. Rå inndata og tallkolonner i eksport er bevart |
| Kalenderår ved periodens slutt | Beregnes nå fra dagens måned og antall beregnede måneder. Tidligere avrunding av bare antall hele år kunne gi feil kalenderår |
| Begge og scenariovalg | #222 sin native deaktivering beholdes. Ingen ekstra synlig tekstlinje. Spørsmålstegnet og skjermleserbeskrivelsen forklarer valget. Tidligere avkrysning huskes |

## Kontroll av de tre nivåene

Det er en funksjonell forskjell, ikke bare ulike navn. Enkel viser grunnfeltene og nødvendige forutsetninger. Utforsk gir tilgang til justering av spareplanen og flere visningsvalg. Avansert gir tilgang til ekstra innskudd, børsfall og øvrig fordypning.

Den nye testen kontrollerer at `advancedDetails` er tilgjengelig på Utforsk og Avansert, mens `eventsDetails` bare er tilgjengelig på Avansert. Den setter spareøkning, ekstra innskudd og børsfall og bekrefter at nivåbytte ikke endrer beregningen. Eksisterende varsel om skjulte aktive forutsetninger beholdes. Feltetikettene er ikke skrevet om i denne runden. Om ordene på hvert nivå er tilstrekkelig forståelige, må fortsatt vurderes av Lars under faktisk bruk.

## Språk og vedlikehold av tall

Denne gjennomgangen endrer presentasjon og presiserer brukerens periode. Den godkjenner ikke kildenes innhold på nytt. Ingen ny økonomisk anbefaling eller markedsopplysning er lagt til.

| Område | Kontrollert i koden | Konklusjon / videre arbeid |
| --- | --- | --- |
| Sparekonto | `dist/assumptions.js`: rate, periode og forklaring bruker `SpareFacts` og SSB-registreringen | Samme opplysning kan oppdateres fra registeret. Bevar kontroll før publisering. Dette betyr ikke at nettleseren selv henter en ny rente |
| Datostatus og kilder | `DATA_STATUS` og `reportSources` i `dist/experience.js`, genererte fakta | Opplysninger om SSB-perioden følger registeret. `fakta.py --check` består. Testen beviser ikke at alle faglige satser i prosjektet er registrert |
| Indeksfond | `Assumptions.index.realRate`, `sigma`, kildeadresse, `checked` og `nextReview` er fortsatt i `dist/assumptions.js` | Samlet i én fil, men ikke fullt koblet til faktaregisteret eller automatisk faglig godkjenning. Ikke omtales som selvoppdaterende |
| Skatt | `Assumptions.tax` har fortsatt eksplisitte verdier og inntektsår. Uttaksdialogen inneholder tekst om 2026 | Ligger utenfor denne avgrensede rettingen av Sparing. Må inngå i neste vedlikeholdsoppdrag før et årsskifte. Ikke bytt tall uten kildekontroll |
| Eksempeltall | Forhåndsutfylte verdier, slidegrenser og eksempler er ikke nødvendigvis markedsdata | Ikke erstatt dem mekanisk med en løpende kildeverdi. Behold merking som eksempel/forutsetning |
| Samme ord for samme handling | Lagre plan bruker samme funksjon og dialog. Sammenligningens eksport beskriver faktisk innhold. Antall vises for én eller flere avkrysninger | Kontrollert i lokale nettlesertester. Lars bør fortsatt prøve hele reisen på iPhone |
| Periode og kalender | Én teksthjelper for avrundede år/måneder, kalenderår fra måned | 25,9 er desimalår og blir 311 måneder. Inndata tolkes ikke som år,måneder |

### Avgrenset oppdrag til neste KI ved senere vedlikeholdsarbeid

Dette er en overlevering, ikke fullmakt til å gjennomføre ny strukturering nå:

1. Hent fersk main og les AGENTS.md, KALKULATORDESIGN.md, SPRAKREGLER.md, KLARSPRAK.md, KILDEREGLER.md og docs/regulatorisk.md. Kontroller åpne PR-er før endring.
2. Undersøk om indeksforutsetninger og skattesatser fortsatt ligger utenfor `kilder/fakta/`. Kartlegg alle lesesteder i Sparing, rapportene og Uttak. Ikke baser migreringen bare på dette dokumentets dato.
3. Bruk eksisterende faktaregister, kildevakt og tidsmaskin. Ingen ny innhenter. Bevar forskjellen mellom teknisk henting og faglig godkjenning.
4. Flytting av en dokumentert sats skal gi identiske beregninger og forklaringer før/etter. Endring av selve satsen er et separat, kildekontrollert vedtak med gjelder-fra-dato. Ikke la en framtidig regel tre i kraft tidlig.
5. Konkret kontroll: endre en SSB-periode i en isolert test. Rente, valgt sats, forklaring, rapport og datostatus skal bruke samme periode. En endring av kilde må ikke overskrive brukerens manuelt valgte rente uten en bevisst handling.
6. Kontroller at eldre lagrede planer beholder egne forutsetninger. En automatisk oppdatering av et startforslag skal ikke endre brukerens historiske øyeblikksbilde.
7. Lever avgrenset PR med dokumenterte tester. Ingen sammenslåing eller publisering uten Lars sin godkjenning.

## Utførte kontroller i denne runden

- `tests/finpuss-browser.cjs`: store tall og alle nivåer ved 256, 320, 390, 640, 768, 1280 og 1920 px. Månedsperioder, kalenderår, lagresnarvei, navneforslag, hoppmål med åpne forklaringer, sammenligningens formatvalg, antall valgte, radvis forhåndsvisning og bevart PDF-kopi. Bestått i Chromium og WebKit.
- `tests/navigation-browser.cjs`: eksisterende navigering, tema, fokus, redigering av startvalg, angre og moduler. Bestått i Chromium etter navigeringsendringen.
- `tests/plannavn-browser.cjs`: eksisterende navneforslag og sammenligningsrapport. Bestått i Chromium.
- `tests/eksport-innhold-browser.cjs`: riktig kalkulator, lesbare navn, tall og kilder. Bestått i Chromium.
- `tests/input-browser.cjs`: ugyldige felt, sperring av lagring/deling/eksport, store tall og eldre planer. Bestått i Chromium.
- `tests/rapport-html-browser.cjs`: fem rapportveier, offline uten JavaScript, riktige planer og tall, tema og uendret PDF-kopi. Bestått i Chromium og WebKit. WebKit-kjøringen brukte også Nu HTML/CSS-validator på de fem nedlastede filene, uten feil.
- `tests/pdf-merking-browser.cjs`: eksisterende strukturkrav består i Chromium. Bokmerker kontrolleres bare fordi testen ber nettleseren lage dem.
- Motorens eksisterende tester: månedsløkker, mål, uttak og grenser. Resultat-, forklarings- og grafsammendragstester består.
- Sikkerhet, fakta, filversjoner, syntaks, diff og kontroll mot gammel kode kontrolleres før opplasting.

Den nye finpusstesten er levert som en målrettet lokal test. Ingen flere trinn er lagt til den allerede omfattende GitHub-arbeidsflyten i denne runden. En senere opprydding kan plassere testen i riktig utvalg.

Fysisk iPhone, faktisk nettleserzoom, VoiceOver og forståelse hos testbrukere er ikke kontrollert her. Firefox er ikke kjørt lokalt i denne runden. Skjermbilder fra lokal Chromium er gjennomgått for resultat og smal rapport. Full CI på den samlede leveransen er ikke fulgt eller erklært grønn. «Gullstandard A++» er fortsatt et mål, ikke en dokumentert sertifisering.

## Neste handling

Lars bruker [testlisten](sparekalkulator-testplan-2026-11-05.md). Sammenligning og rapport prøves som egne brukerreiser, ikke bare som én knapp. PR #222 skal forbli usammenslått fram til Lars gir beskjed. Ingen automatisk sammenslåing er aktivert av dette arbeidet.

Oppdrag, rettinger og egenkontroll: ChatGPT/Codex. Dato: 5. november 2026.
