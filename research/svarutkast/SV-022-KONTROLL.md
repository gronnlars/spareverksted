# SV-022: kontrollstatus etter Claudes KI-gjennomgang

Oppdatert 25.10.2026. Lokal gren `draft/gaps-2026-10-25`. Ingen push, integrasjon eller publisering. Ingen filer i dist er endret.

## Hvem har kontrollert hva?

- Claude har kontrollregnet og meldt kildefunn i tekst videresendt av Lars. Dette er en KI-kontroll, ikke en dokumentert menneskelig kontroll.
- ChatGPT/Codex har åpnet kilder og kjørt egne regnestykker og tester. Dette er forfatterens KI-kontroll.
- Lars er ikke ført som fagkontrollør. Tidligere attribusjon til Lars var feil og er rettet i utkast, kø og arbeidslogg.
- Ingen menneskelig fag- eller kildekontroll er dokumentert. Ingen av KI-kontrollene omtales som det.

## Lest arbeidsgrunnlag og kilderegler

Main er kontrollert som f9c553aa668fd0bf96ce14d6930f5ec02897abd6. KILDEREGLER.md finnes ikke der. Gjeldende tilgjengelig kildefil er lest fra docs/kilderegler via GitHub, blob 604b7d2c0ab5cfc7620a3da5159b29aaead3c68c, PR #71. Filen er merket forslag/ikke merget. Lars sin beskjed om oppdaterte kilderegler følges i oppdraget; det påstås ikke at filen er lagt på main. Ingen annen nyere regeltekst er funnet i den kontrollerte repo-statusen.

## Kilder åpnet på nytt 25.10.2026

| Kilde | Faktisk sett av ChatGPT/Codex | Begrensning og videre kontroll |
| --- | --- | --- |
| [Skatte-ABC R-10-1.1 Hovedregel](https://www.skatteetaten.no/rettskilder/type/handboker/skatte-abc/gjeldende/r-10-renteinntekter/R-10.001/R-10.002/) | Avsnittet etter innholdsfortegnelsen er lest. Det sier at renteinntekt er skattepliktig inntekt og viser til skatteloven § 5-1 og § 5-20 første ledd bokstav b. Sideoverskriften sier Skatte-ABC 2025/2026. | Uttrekket er svært langt; avsnittet ligger etter innholdsfortegnelsen. Menneskelig kontroll av dette avsnittet gjenstår. Ingen individuell skatteberegning eller sats. |
| [SSB: Hva er inflasjon?](https://www.ssb.no/priser-og-prisindekser/konsumpriser/artikler/hva-er-inflasjon) | Publisert 15.09.2022, og avsnittene om prisvekst og kjøpekraft er lest i forrige revisjon samme dato. Claude melder også bekreftelse. | Ingen aktuell inflasjonssats. Dette er KI-kontroll, ikke menneskelig godkjenning. |
| [Finanstilsynet: Verdipapirforetak, verdipapirfond og alternative investeringsfond](https://www.finanstilsynet.no/forbrukerinformasjon/verdipapirforetak-verdipapirfond-og-alternative-investeringsfond/) | Den offisielle sidens søkeuttrekk gjengir «Sist publisert: 23. oktober 2026». Avsnittene om at risiko og forventet avkastning varierer med plasseringene og at kostnader trekkes fra andelsverdien, er lest. | Vanlig tekstuttrekk viste ikke datoen. Direkte henting av rå HTML ga 403. Claude oppgir råmetadata publisert 27.05.2016 og endret 23.10.2026; disse metadatafeltene og faktisk synlighet i vanlig nettleser er ikke bekreftet av ChatGPT/Codex. Menneskelig kontroll står åpen. |

«Udatert» er fjernet fra SV-022. Datoen 23.10.2026 omtales med sin faktisk observerte etikett og opphav, ikke som en kontrollert dato fra råmetadata. Opprinnelig publiseringsdato 27.05.2016 står bare som en opplysning fra Claude med uavklart status. Ingen dato er lånt fra markedsføring.

Finanstilsynet brukes ikke som kilde for renters rente. Fondsavsnittet er strammet inn til det kilden direkte sier om risiko og avkastning, fulgt av et uttrykkelig valgt matematisk tapsforløp. Den generelle formuleringen om at fond kan falle står ikke lenger som en påstand som denne kilden hevdes å belegge ordrett.

Skattepåstanden står nå også i svarteksten: «Skatteetatens hovedregel er at renteinntekt er skattepliktig.» Dermed er det samsvar mellom svar og kildetabell. Raden om skatteplikt beholdes, uten skattesats.

DNB og skattekortsiden er tatt ut. Renters rente, formlene og regnestykkene merkes «Regnesammenheng, egen illustrasjon». De påstås ikke å ha en ekstern kildedato.

## Lenker og forutsetninger

Begge lenkene ligger i JSON-fasiten. Markdown genereres automatisk. Ingen nye satser eller standardforutsetninger er satt inn i produktkoden.

| Eksempel | Start / tid | Rente / prisvekst | Nominelt sluttbeløp | Kjøpekraft med prisene ved starten |
| --- | --- | --- | --- | --- |
| Hovedeksempel | 10 000 kr / 2 år | 5 % / 0 % | 11 025 kr | 11 025 kr |
| Kontroll av Claudes forslag med samme rente | 10 000 kr / 2 år | 5 % / 2,5 % | 11 025 kr | 10 493,75 kr |
| Kontrasteksempel, andre eksplisitte forutsetninger | 10 000 kr / 2 år | 2 % / 2,5 % | 10 404 kr | 9 902,68 kr |

Med 5 % rente og 2,5 % prisvekst stiger også kjøpekraften før skatt og kostnader. Det kan ikke brukes til å illustrere det motsatte. Kontrastlenken bruker derfor 2 % rente og 2,5 % prisvekst, begge valgte eksempeltall. Teksten forklarer at dette er andre forutsetninger enn i hovedeksempelet.

Kontrastlenken setter `both=1` og `real=0`, slik eksisterende kode velger «Begge» og tegner kroner og kjøpekraft i samme graf. Alle øvrige relevante felt er angitt: ingen månedsinnskudd, ingen nye innskudd, kostnader, børsfall eller årlig endring i sparingen. Skatt er ikke beregnet.

Dagens forklaringsrenderer støtter én `next`-lenke. Den første lenken bruker dette feltet. Den andre finnes som eksplisitt ekstra utkastlenke i JSON/Markdown og kan åpnes direkte. Begge er ikke integrert som lenker i nettstedets svarvisning. Plasseringen av lenke nummer to må avklares ved et senere integrasjonsoppdrag. Ingen endring av UI eller utvidelse av skjema er gjort her.

## Faktisk kjørt i denne revisjonen

| Kontroll | Resultat |
| --- | --- |
| Alle `tests/*.test.cjs` | 15 eksisterende Node-testfiler kjørt på nytt, 0 feil |
| Generatorens `--check` | Fem Markdown-utkast samsvarer med JSON |
| `node research/svarutkast/prov-gaps.cjs` | 35 søketilfeller og fem svarkort består |
| Historisk sammenligning | Samme fire endringer av 156 som tidligere. De øvrige 152 har identisk modus, treff og forslag. Aksjeutbytte har q-utbytte først, deretter funds, i den isolerte prøven. |
| Egen kontrollregning | 11 025 kr etter to år med 5 %. Avrundet 16 289 kr etter 10 år, 26 533 kr etter 20 år. 10 % opp og 10 % ned gir 9 900 kr. |
| Begge lenkers parametre gjennom E.sanitize | Godtatt uten forkasting eller nullstilling. Hovedlenkens felt og kontrastlenkens felt samsvarer med de oppgitte forutsetningene. |
| Kontrastlenke mot egen formel | E.explain gir 10 404 kr og 9 902,676977989295 kr i kjøpekraft. Samsvarer med 10 000 × 1,02² / 1,025². Nominelt beløp over 10 000, kjøpekraft under 10 000. |
| `node research/svarutkast/prov-renters-browser.cjs` | Forsøkt på nytt, stoppet ved launch fordi Chromium mangler. Ingen visuelle kontroller kjørt. |

Nettlesertesten er oppdatert for kildedatoen og begge lenkene. Den skal kontrollere eksempel før uttaksavsnitt, dato i kildelisten, overflow ved 320/390/1280 px, hovedlenkens 11 025 kr og kontrastlenkens «Begge»/tabelltall. Den er fortsatt ikke bestått. Ingen nytt installasjonsforsøk er gjort etter at forrige nedlasting feilet. iPhone Safari og VoiceOver står åpne hos Lars.

## Fortsatt ikke klart for integrasjon

Attribusjon og samsvar mellom skattepåstand og kilde er rettet. Menneskelig kontroll av Skatteetatens avsnitt og Finanstilsynets dato/synlighet er ikke gjennomført av oss. Nettlesertesten er blokkert. Ingen integrasjon, push, merge eller publisering er gjort eller underforstått godkjent.


## Firefox og WebKit forsøkt etter Lars sitt neste oppdrag

25.10.2026. Nettleserprøven støtter nå `SPARE_ENGINE=chromium|firefox|webkit`. Den velger motor eksplisitt og har tidsgrenser. Produksjonskode er ikke endret.

| Forsøk | Faktisk resultat |
| --- | --- |
| Playwright install firefox | Firefox 153.0, build 1538, og FFmpeg ble installert. Første nedlastingsadresse ga ugyldig ZIP; Playwrights alternative adresse lyktes. |
| SPARE_ENGINE=firefox node research/svarutkast/prov-renters-browser.cjs | Startet uten testresultat og ble avbrutt. Ny kjøring med nettleserlogg viste startet Firefox, deretter gjentatte innholdsprosesskrasj. Loggen sier `Sandbox: writing /proc/self/uid_map: EPERM`, prosesser avsluttet med signal 11, og manglende nettlesersesjon. Diagnosekjøringen ble avbrutt etter at feilen var identifisert. Ingen sidetester bestått. |
| Playwright install webkit | WebKit 26.5, build 2336, ble lastet ned. Alternativ nedlastingsadresse lyktes. Installasjonen varslet om manglende systembiblioteker. |
| SPARE_ENGINE=webkit node research/svarutkast/prov-renters-browser.cjs | Stoppet ved launch: blant annet GStreamer, GTK4, Graphene, libavif og andre avhengigheter mangler. Ingen sidetester kjørt. |
| Playwright install-deps webkit | Feilet med exit 100. Pakkehåndtereren fikk ikke utføre setgroups/setegid/seteuid i miljøet. Ingen vellykket installasjon av de nødvendige avhengighetene. |

Det er dermed ikke lenger riktig å si at bare Chromium er forsøkt. Firefox og WebKit er installert, men kan ikke fullføre prøven i dette miljøet med de gjennomførte forsøkene. Miljøets restriksjoner er ikke endret. Ingen CI-kjøring er startet, og ingen push er gjort. Faktisk visning av SV-022 og begge kalkulatorlenkene er fortsatt en åpen nettleserkontroll. Denne statusen erstatter den tidligere konklusjonen om bare manglende Chromium; den endrer ikke fagkontrollstatus.

## Ny fullmakt og integrasjon 25.10.2026

Lars opplyser at han selv har sjekket kildene, men ikke gjort utregninger. Han godkjenner push og viser til at siden brukes av testbrukere. Dette erstatter den tidligere manglende godkjenningen og påstanden om at ingen menneskelig kildekontroll er dokumentert: vi har nå Lars sin uttrykkelige bekreftelse. Det dokumenterer ikke menneskelig kontrollregning. Utregningene er kontrollert av Claude og egne programtester fra ChatGPT/Codex.

Bare SV-022 integreres i produktet. De fire andre GAPS-svarene forblir utkast. Renters-rente-raden fjernes fra GAPS fordi forklaringen nå finnes. Andre rader beholdes, særlig BSU ved utenlandsflytting. Ingen skatte-/inflasjonsforutsetning eller beregningskode i kalkulatoren endres.

Begge lenkene inngår nå i SV-022. Eksisterende `next` får valgfri `more`-liste; rendereren bruker de samme tekstelementene og lenkene som før. Innhold settes med textContent. Cacheversjoner for de tre endrede JS-filene økes i spor.html. Den faktiske produktteksten og Markdown genereres fra JSON-fasiten; produktkontroll kjøres med `generer-gaps.py --check --product`.

Utkastprøven kan nå kjøres oppå faktisk SV-022 uten dobbelregistrering. Nettleserprøven bruker nå den faktiske produktkoden uten injeksjon. Den er lagt til CI for Chromium, Firefox og WebKit. Lokal nettleserkontroll er fortsatt blokkert som dokumentert over. CI-resultat og publisering bekreftes separat etter push.

156 historiske søk er sammenlignet mellom main f9c553a og den integrerte versjonen med begge versjoners faktiske kode. Bare t21, «hvordan fungerer renters rente», endres fra uncovered til q-renters-rente. De andre 155 beholder modus, treff og forslag. Historiske forventninger er ikke omskrevet for å skjule endringen. De aktive regresjonstestene som tidligere krevde et manglende renters-rente-svar, er oppdatert til det nye innholdet. Antall registrerte temaer er økt fra 15 til 16, fortsatt sju hovedvalg.
