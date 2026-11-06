# Nettleserkontroller: måling og neste avgrensning

Kartlagt 5. november 2026 av ChatGPT/Codex. Main dcfac381be414c50b98b737db280186bf2773a95, etter #234. Dette er egenkontroll og et målepunkt, ingen endring av testutvalg.

## Bekreftet drift

#233 og #234 er slått sammen. Kjøring [42119296830](https://github.com/gronnlars/spareverksted/actions/runs/42119296830) fullførte testing og publisering med success. Språkkontrollen på samme main fullførte også med success. At dokumentasjons-PR-er faktisk hopper over browser, må kontrolleres på en etterfølgende ren dokumentasjons-PR. Ukentlig språkmåling er ikke bekreftet før første planlagte kjøring.

## Hvor tiden brukes

Browser-jobben tok 745 sekunder og hadde 107 steg. 91 steg med nettlesertester summerte til 697 sekunder. Initialisering av container tok 30 sekunder. Stegenes tidsstempler har sekundoppløsning, og differansen til jobbtid inkluderer øvrig oppsett, artefakter og avvik mellom stegtid og veggklokke. Dette er én kjøring, ikke et gjennomsnitt. Gruppen med navigering inneholder tre testkommandoer i ett steg.

| Testgruppe | Steg | Samlet tid i sekunder |
| --- | ---: | ---: |
| tests/svarmal-browser.cjs | 3 | 53 |
| tests/rapport-html-browser.cjs | 3 | 43 |
| tests/planer-browser.cjs | 3 | 43 |
| tests/resultatlinje-browser.cjs | 2 | 42 |
| tests/felt-browser.cjs | 3 | 36 |
| tests/a11y-browser.cjs | 1 | 28 |
| tests/laan-browser.cjs | 3 | 28 |
| tests/personvern-browser.cjs | 3 | 27 |
| tests/deling-browser.cjs | 3 | 26 |
| tests/rapport-utskrift-browser.cjs | 3 | 26 |
| tests/theme-browser.cjs | 1 | 23 |
| tests/infosider-browser.cjs | 3 | 21 |
| tests/published-answers-browser.cjs | 3 | 20 |
| Sparing: navigation, testfunn og rapportvalg | 1 | 20 |
| tests/input-browser.cjs | 1 | 19 |
| tests/polish-browser.cjs | 3 | 17 |
| tests/sparetabell-browser.cjs | 2 | 16 |
| tests/security-browser.cjs | 3 | 15 |
| research/svarutkast/prov-renters-browser.cjs | 3 | 15 |
| tests/forklaring-oppdateres-browser.cjs | 3 | 15 |
| tests/last-ned-browser.cjs | 2 | 15 |
| tests/veileder-sok-rettinger-browser.cjs | 3 | 13 |
| tests/bunntekst-browser.cjs | 1 | 13 |
| tests/kontakt-browser.cjs | 3 | 12 |
| tests/akse-browser.cjs | 1 | 11 |
| tests/begrep-browser.cjs | 3 | 11 |
| tests/last-ned-valgte-browser.cjs | 2 | 10 |
| tests/bsu-browser.cjs | 3 | 9 |
| tests/ask-browser.cjs | 3 | 9 |
| tests/ki-info-browser.cjs | 3 | 8 |
| tests/veileder-browser.cjs | 1 | 7 |
| tests/plannavn-browser.cjs | 1 | 6 |
| tests/plan-kalkulator-browser.cjs | 2 | 6 |
| tests/eksport-innhold-browser.cjs | 2 | 6 |
| tests/sammenligningstabell-browser.cjs | 2 | 6 |
| tests/startflyt-browser.cjs | 1 | 3 |
| tests/liggende-browser.cjs | 1 | 3 |
| tests/spareform-browser.cjs | 1 | 3 |
| tests/roundtrip-browser.cjs | 1 | 3 |
| tests/veileder-sok-browser.cjs | 1 | 2 |
| tests/html-struktur-browser.cjs | 1 | 2 |
| tests/uten-stil-browser.cjs | 1 | 2 |
| tests/angre-sletting-browser.cjs | 1 | 2 |
| tests/pdf-merking-browser.cjs | 1 | 2 |

## Konkrete funn før neste kodeendring

1. `tests/svarmal-browser.cjs` starter `tests/published-answers-browser.cjs` som egen prosess før utkasttestene. Den samme publiseringskontrollen har egne steg i workflowen for Chromium, Firefox og WebKit. Dette er en dokumentert gjentakelse, men tidsandelen inne i svarmal-steget er ikke målt separat. Eventuell gjenbruk må være knyttet til vellykket kontroll for samme motor og commit. En isolert lokal svarmal-test må fortsatt kontrollere publiseringsfilteret.
2. `tests/a11y-browser.cjs` omfatter både kalkulator, låneside, veileder og infosider. `tests/theme-browser.cjs` omfatter også lagring, tastatur, kontrast og rapport. Filnavnene alene gir derfor ikke et sikkert avhengighetskart.
3. Lånesiden beholdes som kildekode og testes lokalt, men fjernes fra publiseringsartefakten. Den rene lånesidetesten brukte 28 sekunder totalt. Å fjerne alle låneregler eller lånetester er ikke et forsvarlig tiltak for å forkorte CI. Felles tilgjengelighetstester besøker også siden.
4. Flere servere bruker `listen(0)`, og rapporttester bruker unike midlertidige mapper. Det hjelper ved framtidig parallellisering. Faste skjermbildefiler og delte mapper under /tmp finnes fortsatt. Personvern skriver motorvise JSON-filer som samles før publisering. Ingen parallellisering er godkjent eller prøvd i denne kartleggingen.
5. Et CSS-/grafgrep kan påvirke tema, kontrast, reflow og rapporter. Før selektiv kjøring ved kodeendring må denne sammenhengen spores, også når scripts/versjoner.py oppdaterer HTML. Dokumentasjonsregelen fra #233 og språkfilteret fra #234 er ikke et generelt bevis for at kodeendringer kan avgrenses tilsvarende.

## Neste lille kodeforslag

Undersøk om den gjentatte publiseringskontrollen kan gjenbrukes innen samme CI-kjøring, samtidig som hver test beholder kontrollen ved isolert lokal bruk. Kartlegg først nøyaktig motor, rekkefølge, feilstatus og commit. Sammenlign kommandoutvalg og publiseringssperrer før og etter. Ikke fjern selve publiseringskontrollen.

Mer omfattende filbasert testutvalg og parallellisering venter til avhengigheter og filbaner er kartlagt. Ingen målt tidsgevinst loves på forhånd. Dette notatet utvider ikke fullmakten til å endre kalkulator, testkrav eller publiseringsvilkår.

## Første kodeforslag etter kartleggingen

#235 prøvde dokumentasjonsregelen i praksis: checks bestod, mens browser og deploy ble skipped i PR-kjøring 42121746602. Ingen ny språkmåling startet for dokumentet. Dette var forventet, ikke et nytt resultat fra nettleser- eller språktestene.

Neste forslag bygger på main 1dcf7c8. De tre separate published-answers-browser-stegene beholdes. Etter vellykket steg gir workflowen svarmal-testen en markør med kjørings-ID, forsøksnummer, commit og nettlesermotor. Hjelperen sammenligner disse med GitHub-miljøet og faktisk git HEAD. Bare da gjenbrukes kontrollen. Markøren settes ikke ved feilet steg. Ved manglende eller avvikende grunnlag kjører svarmal-testen kontrollen selv, og feil stopper testen som før. Lokal isolert bruk beholder dermed publiseringskontrollen. Ingen resultatfil gjenbrukes mellom jobber eller kjøringer.

Kontrollert lokalt: 14 tilfeller med simulerte prosessutfall, inkludert tre motorer, ny kjøring, nytt forsøk, annen commit, feil i git, lokal kjøring og feil/avbrudd i publiseringskontrollen. Eksisterende lokal publiseringsfiltertest og JavaScript-syntaks består. YAML er sammenlignet med main: alle gamle kommandoer, kjørevilkår, rettigheter og hele deploy er bevart. Bare tre steg-ID-er, tre avgrensede miljømarkører og den nye raske kontrolltesten er lagt til. Ingen dist-endringer. Egenkontroll, ikke uavhengig gjennomgang.

Nettleserorkestreringen må prøves i GitHub: publiseringsstegene skal bestå for hver motor, og svarmal-stegene skal logge at kontrollen gjenbrukes. Full lokal nettleserrunde er ikke kjørt. Ingen konkret tidsgevinst er målt etter endringen, og ingen testkrav er fjernet. Ved uventet markør eller HEAD kjører kontrollen ekstra framfor å hoppe over den.


## Neste steg: automatisk finpusskontroll, 6. november 2026

Arbeidsgrunnlag main e0f499a etter #236. Den eksisterende `tests/finpuss-browser.cjs` er ikke kalt fra noen workflow. #228 koblet inn testfunn og rapportvalg, men ikke finpuss. Dette steget legger bare til ett eget Chromium-steg, med samme kjørevilkår som de øvrige nettlesertestene. Alle eksisterende kommandoer og testforventninger bevares. Ingen produksjonsfiler endres.

Testen dekker 256 til 1920 CSS-piksler, store tall på tre nivåer, seks månedsavrundinger, to faste kalenderdatoer, navneforslag ved lagring, hopp med bevart tilstand, sammenligning/eksport, uendret PDF-kopi ved endret forhåndsvisningsbredde og skjulte verdier ved nivåbytte. Dette utfyller de smalere testene, men er ikke en full tilgjengelighetskontroll eller faktisk nettleserzoom. Den låneavhengige linjeforing-testen kobles ikke inn i denne runden.

Lokal gjennomgang: lest hele testen og sammenholdt navnereglene med den vedtatte testplanen. YAML er sammenlignet med main: eneste funksjonelle endring er det nye nettlesersteget. Testfilen er uendret. Syntaks, sikkerhet, versjoner, gammel-kode-vern og diff kontrolleres. Lokal nettleserkjøring er forsøkt, men stoppet før testen startet fordi nettleser manglet. Nedlasting av nettleseren ga en ugyldig ZIP-fil. Ingen bestått lokal nettlesertest påstås. GitHub Actions med prosjektets Playwright 1.56.0-bilde må bekrefte at testen består før sammenslåing.

Dette øker dekningen og kan øke kjøretiden. Ingen tidsbesparelse loves. Ved feil undersøkes om årsaken er testoppsett, foreldet forventning eller produktfeil. Testforventninger skal ikke svekkes for å få grønt, og eventuell produktretting er et eget avgrenset arbeid. Main beholder full nettleserkjøring før deploy. Rene dokumentasjons-PR-er beholder dagens avgrensning. ChatGPT/Codex, egenkontroll.


## Første avgrensede parallellprøve: HTML-rapport, 6. november 2026

Arbeidsgrunnlag main 7800067 etter #237. Finpusstesten bestod i PR-kjøring 42200961064 på fire sekunder. Main-kjøring 42204088590 fullførte også med success. Det er et bekreftet dekningssteg, ikke en tidsoptimalisering.

Neste prøve gjelder bare Chromium og Firefox i `rapport-html-browser.cjs`. Samme test og samme Nu-validator kjøres i begge motorene. WebKit kjører fortsatt etter dem. Alle andre kontroller og publiseringskrav beholdes. Dette begrenser prøven til maksimalt to samtidige nettleserprosesser, hver med egen Java-validering på høyst 512 MiB. Faktisk samlet minne- og CPU-belastning må vurderes i GitHub før videre utvidelse.

Gjennomgåtte avhengigheter i hele testfilen:

| Ressurs | Isolasjon |
| --- | --- |
| Kildekode i dist | Bare lesing, ingen generering eller skriving |
| Lokal HTTP-server | `listen(0)` velger egen ledig port per prosess |
| Nedlastinger | Egen mappe fra `mkdtemp` per prosess, fjernes først av prosessen selv |
| Nettleser og lagring | Egne prosesser og nettleserkontekster |
| HTML-bevis | Filnavn har motorprefiks, som chromium-plan.html og firefox-plan.html |
| Mobilbilde med fast filnavn | Skrives bare av Chromium |
| Personvernrapport og publiseringsmarkør | Ingen av disse brukes av HTML-testen |
| Nu-validator | Samme JAR leses, hver prosess mottar sin egen rapportfil |

Begge kommandoer startes før noen av dem ventes på. Hver prosess skriver til egen logg i en unik midlertidig mappe. Begge ventes ferdig også ved testfeil. Loggene vises i navngitte grupper med eksplisitt sluttkode per motor. Samlet trinn feiler hvis én eller begge kontroller feiler. De eksisterende `!cancelled()`-vilkårene lar senere uavhengige tester fortsette ved vanlig testfeil, mens browser-jobben og deploy-sperren forblir røde. Ingen `continue-on-error`, automatisk omkjøring eller bortfiltrering av tester.

Lokalt: fire simuleringer med den faktiske YAML-kommandoen og en midlertidig node-erstatning prøvde begge bestått, Chromium-feil, Firefox-feil og feil i begge. En barriere beviste at begge prosesser faktisk startet før den første fullførte. Alle tilfeller kontrollerte fullføring, begge logger og riktig samlet feilstatus. Disse simuleringene prøver orkestrering, ikke nettleserne. YAML-paritet bekrefter at bare de to gamle stegene er erstattet; WebKit, miljøvariabler, øvrige jobber, testkrav, rettigheter og deploy er identiske. Sikkerhet, versjoner, gammel-kode-vern og diff består. Ingen dist- eller testfiler endres.

Full lokal nettleserrunde er ikke kjørt fordi forrige nedlastingsforsøk ga ugyldig ZIP. GitHub må bekrefte at begge motorer består samtidig, at begge logger og de ti HTML-filene finnes, og at WebKit deretter består med sine fem HTML-filer. Sammenlign det nye trinnets tid med tidligere sum for de samme to motorene. Ikke bruk færre synlige trinn som bevis på færre tester eller bedre ytelse. Ingen bestemt tidsgevinst loves. Reell samtidighetsfeil eller ressursmangel skal undersøkes før merge. Om nødvendig tilbakeføres bare grupperingen til de to opprinnelige stegene, uten å endre testene. Lars merger etter grønne kontroller. Ingen løpende full CI-overvåking. ChatGPT/Codex, egenkontroll.
