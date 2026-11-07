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


## Neste avgrensning: lagrede planer, 6. november 2026

Arbeidsgrunnlag main 58e8884 etter #238. Kjøring 42215282715 fullførte checks, browser og deploy med success. De to samtidige HTML-motorene tok 24 sekunder på main, mot 18 sekunder på PR 42209181079. Begge hadde bestått resultat. Tidligere sekvensiell Chromium/Firefox tok til sammen 30 sekunder i main-kjøring 42204088590. Forskjellen mellom enkeltkjøringer viser at eksakt gevinst varierer, og hele browser-jobbens endring kan ikke tilskrives denne avgrensningen alene.

Hele tests/planer-browser.cjs er gjennomgått før neste endring. Chromium og Firefox har hver sin HTTP-server med tilfeldig port, egen nettleserprosess og egen profil per PC-/mobilprøve. localStorage og sessionStorage er inne i disse isolerte profilene. Bare dist-filer leses. Testen skriver ingen delte skjermbilder, rapportfiler eller tilstand i repoet. Planverdier og navn i hver testprosess er oppdiktede. Den krever ikke resultat fra andre steg.

Bare de to eksisterende plankontrollene grupperes med samme samtidighetsmønster som HTML-kontrollene. Grupperingene kjører etter hverandre, så dette øker ikke grensen utover to samtidige testprosesser. WebKit og andre tester beholder rekkefølgen. Begge prosessene ventes på også ved feil, med separat logg og eksplisitte sluttkoder. Enhver feil stopper publisering gjennom uendret browser/deploy-avhengighet. HTML-grupperingen fra #238 endres ikke.

Lokalt bestått: fire simuleringer med faktisk YAML-kommando og barriere for samtidig start: begge bestått, feil bare i Chromium, feil bare i Firefox og feil i begge. Alle kontrollerer at begge starter, fullfører og logges, og at samlet feilstatus er riktig. YAML er identisk med main etter at bare de to erstattede planstegene normaliseres. Sikkerhet, innholdsversjoner, gammel-kode-vern og diff består. Ingen dist- eller testfil er endret. Dette er orkestreringskontroll, ikke en lokal nettleserkjøring.

GitHub må vise begge planmotorers fullstendige sluttrapport og sluttkode 0, etterfulgt av bestått WebKit. Testene beholder åpning, unike navn, oppdatering/ny plan, sammenligning uten sidebytte, sletting/angre og PC/mobil. Ingen forventning endres. Lokal full nettleserkjøring er ikke gjentatt etter tidligere mislykket nedlasting. Høyere ressursbruk kan spise opp tidsgevinsten. Ingen eksakt gevinst loves. Tilbakefør bare denne grupperingen ved dokumentert samtidighetsfeil. Lars merger etter grønne kontroller. Ingen løpende overvåking av hele CI. ChatGPT/Codex, egenkontroll.


## Felles hjelper for de to testparene, 6. november 2026

Arbeidsgrunnlag main 7e0ca6b etter #239. Main-kjøring 42224668853 bestod. Forslaget samler de to like Bash-blokkene i scripts/nettleserpar.py, med bare standardbiblioteket i Python. Hjelperen tillater kun de to gjennomgåtte testfilene. Chromium og Firefox starter før venting, begge ventes ferdig også ved testfeil, og hver motor beholder full logg og eksplisitt sluttkode. Manglende node gir feil for begge. Midlertidige logger fjernes etter utskrift. Maksimalt to testprosesser kjører samtidig.

Lokalt består ti tilfeller i tre unittest-metoder: begge testfiler med fire kombinasjoner av bestått/feil, manglende node og avvist ukjent testfil. Virkelige prosesser med en node-erstatning og en startbarriere kontrollerer samtidig oppstart, fullføring, videreførte miljøvariabler, stdout/stderr og samlet feilstatus. Dette prøver orkestreringen, ikke ekte nettlesere. Testen kobles til checks.

YAML-paritet viser at bare de to run-blokkene og den nye hjelpertesten endres funksjonelt. WebKit, testrekkefølge, miljøvariabler, kjørevilkår, rettigheter og deploy bevares. Sikkerhet, versjoner, gammel-kode-vern og diff består. Ingen produksjonsfiler eller nettleserforventninger endres. GitHub må bekrefte begge par med sluttkode 0 og etterfølgende WebKit før Lars merger. Ingen ytterligere parallellisering eller tidsgevinst loves. Nye testpar krever egen ressursgjennomgang før tillatelseslisten utvides. ChatGPT/Codex, egenkontroll.


## Neste testpar: tallfelt, 6. november 2026

Arbeidsgrunnlag main bfeea5b etter #240. Kjøring 42242757238 bestod checks, browser og deploy. Browser tok 676 sekunder. HTML-paret tok 19 sekunder og planparet 15. Feltkontrollene tok henholdsvis 10, 12 og 12 sekunder i Chromium, Firefox og WebKit. Dette er ett målepunkt, ingen garanti for gevinst eller full stabilitet.

Hele tests/felt-browser.cjs er gjennomgått. Hver prosess leser dist, starter egen server på listen(0) og bruker egne nettleserkontekster for mus, berøring og simulert treg nettleser. Ingen rapport-, skjermbilde- eller resultatfiler skrives. Testen er uavhengig av mellomliggende steg. Chromium og Firefox grupperes derfor på det tidligere Chromium-stegets plass. Firefox flyttes fra sin gamle plass nær slutten. WebKit beholder egen plass. Ingen andre steg flyttes. Hjelperens tillatelsesliste utvides med bare denne testen. Ingen mer enn to samtidige testprosesser.

Testen beholder kravene til markering av hele tallet, erstatning av eksempeltall i startguide og kalkulator, redigering med andre museklikk og raske tastetrykk når tidsur forsinkes. Den bruker faste ventetider som kan bli følsomme for høyere CPU-belastning. Faktisk GitHub-kjøring må derfor bekrefte begge motorer og etterfølgende WebKit før merge. Ved ustabilitet undersøkes ressursbruk og eksisterende tidsforutsetninger. Ikke øk ventetider, legg til omkjøring eller svekk forventningene for å skjule feil. WebKit er ikke fysisk iPhone/Safari.

Lokalt består 14 orkestreringstilfeller i tre unittest-metoder: tre tillatte testfiler ganger fire utfall, manglende node og ukjent testfil. Dette er prosessprøver med node-erstatning, ikke ekte nettlesere. YAML-paritet gjenoppretter det opprinnelige Chromium-steget og setter Firefox tilbake på opprinnelig plass før hele workflowen sammenlignes. Vilkår, miljø, øvrige tester, rettigheter og deploy er identiske. Syntaks, sikkerhet, versjoner, gammel-kode-vern og diff består. Ingen produksjonsfil eller nettleserforventning endres. Lars merger etter grønne kontroller. ChatGPT/Codex, egenkontroll.


## Neste testpar: rapportutskrift, 6. november 2026

Arbeidsgrunnlag main 8c7473a etter #241. Kjøring 42255716544 bestod checks, browser og deploy. Browser tok 659 sekunder. Feltparet tok 13 sekunder, mot tidligere 10 + 12 sekunder i main-kjøring 42242757238. Dette er enkeltmålinger. Endringen i hele jobbtiden kan ikke tilskrives feltparet alene. Utskriftskontrollene tok 6, 8 og 9 sekunder i Chromium, Firefox og WebKit.

Hele tests/rapport-utskrift-browser.cjs er gjennomgått. Hver motor leser dist, starter egen server med listen(0) og bruker egne kontekster for mus og berøring. Testplaner legges i isolert localStorage. Utskriftshendelser og feil simuleres i hver kontekst. Bare Chromium lager PDF via Playwright, som en buffer i minnet. Ingen felles filer eller rapportbaner skrives, og ingen resultat fra andre steg trengs.

Chromium og Firefox erstattes med ett par på samme plass, med eksisterende hjelper. WebKit kjører fortsatt etter paret. Alle testkrav bevares: tre rapportutvalg, gjentatt og ignorert utskrift, feil i print-kallet, tittel, synlig fokus, uendret forhåndsvisning og utskriftskopi, menyutskrift, asynkron retur, retur uten afterprint og PDF-struktur i Chromium. Simulerte hendelser er ikke fysisk iPhone/Safari eller en full PDF-tilgjengelighetsrevisjon. Maksimalt to testprosesser kjører samtidig.

Lokalt består 18 orkestreringstilfeller i tre unittest-metoder: fire tillatte testfiler ganger fire utfall, manglende node og avvist ukjent test. Prosessprøvene bruker node-erstatning, ikke ekte nettlesere. YAML-paritet bekrefter uendret workflow når bare paret normaliseres til de to opprinnelige stegene. Syntaks, sikkerhet, versjoner, gammel-kode-vern og diff består. Ingen produksjonsfil eller nettleserforventning endres. GitHub må bekrefte begge motorers logg og sluttkode 0 samt etterfølgende WebKit før Lars merger. Undersøk eventuell ressurs- eller tidsfølsomhet uten omkjøring eller svakere forventninger. Ingen bestemt tidsgevinst loves. ChatGPT/Codex, egenkontroll.


## Kontrollpunkt etter fire testpar, 6. november 2026

Arbeidsgrunnlag main 61a9988 etter #242. Kjøring [42272498115](https://github.com/gronnlars/spareverksted/actions/runs/42272498115) fullførte checks, browser og deploy med success. Dette kontrollpunktet endrer bare dokumentasjon. Ingen flere tester grupperes før neste undersøkelse.

### Faktisk tidsbruk

Tidene er differansen mellom GitHubs start- og sluttstempler i sekunder. Hver rad gjelder én main-kjøring, med sekundoppløsning. Jobbtid er ikke hele workflowens veggklokketid.

| Main etter | Kjøring | checks | browser | deploy |
| --- | --- | ---: | ---: | ---: |
| #240 | [42242757238](https://github.com/gronnlars/spareverksted/actions/runs/42242757238) | 18 | 676 | 117 |
| #241 | [42255716544](https://github.com/gronnlars/spareverksted/actions/runs/42255716544) | 28 | 659 | 54 |
| #242 | [42272498115](https://github.com/gronnlars/spareverksted/actions/runs/42272498115) | 24 | 733 | 56 |

Feltparet tok 13 sekunder i begge de to siste kjøringene. Utskriftsparet tok 11 sekunder etter #242, mot tidligere 6 + 8 sekunder for de to sekvensielle motorene. Samtidig økte browser-jobben med 74 sekunder. Enkelte par viser dermed kortere stegtid, men disse kjøringene dokumenterer ikke at hele CI er blitt raskere. Ingen prosentvis totalgevinst beregnes fra ulike commits og enkeltkjøringer.

Sammenligning av steg med identisk navn i de to siste kjøringene viser økning flere steder som ikke ble endret i #242:

| Uendret steg | Etter #241 | Etter #242 | Endring |
| --- | ---: | ---: | ---: |
| HTML report: chromium and firefox | 19 | 24 | +5 |
| svarmal, Firefox | 19 | 23 | +4 |
| HTML-rapport, WebKit | 14 | 17 | +3 |
| svarmal, WebKit | 17 | 20 | +3 |
| resultatlinje, WebKit | 22 | 25 | +3 |
| personvern, WebKit | 9 | 12 | +3 |

Dette viser at forskjellen er fordelt over flere steg. Dataene avgjør ikke om årsaken er runner-belastning, oppstart, testenes venting eller noe annet. Ingen CPU-/minneprofil er samlet inn. Testparene kjører etter hverandre, ikke samtidig med senere steg. Vi skal hverken kalle forskjellen en dokumentert regresjon fra utskriftsparet eller forklare den bort som tilfeldig uten videre undersøkelse.

### Hva undersøkes nå, og hva venter

| Rekkefølge | Undersøkelse | Ferdigkriterium før kodeendring |
| --- | --- | --- |
| 1 | Les de tregeste gjenværende testene og skill fast venting fra beregning, sideoppstart og gjentatte brukerreiser. Start med resultatlinje/WebKit og de brede tilgjengelighets- og tematestene. | Navngitte kontrollkrav, avhengigheter og mulig dobbeltarbeid dokumenteres. Ingen forventning fjernes bare fordi to tester bruker samme side. |
| 2 | Vurder om måling inne i én konkret test vil avklare flaskehalsen bedre enn flere nye par. | Små målepunkter med klart spørsmål, uten nye biblioteker, nettinnhenting eller endret brukeradferd. |
| 3 | Bruk kommende ordinære kjøringer til å sammenligne samme testgrupper. Hvis en årsak må isoleres, vurder en kontrollert sammenligning med samme commit og miljø. | Skill stegtid, jobbtid og total ventetid. Ingen ekstra fullkjøringer eller automatisk overvåking startes bare for å fylle en tabell. |
| 4 | Vurder neste optimalisering først når undersøkelsen gir et konkret funn. | Bevar nettlesermotorer, logger, kontrollkrav, personvernbevis og publiseringssperrer. Dokumenter både gevinst og kostnad. |

Vedlikehold av kilder og språk beholder eksisterende filtre og tidsplaner. Rene dokumentasjons-PR-er bruker omfangsregelen fra #233. Main beholder full nettleserrunde før deploy. De 33 åpne PR-ene er inventert som liste i denne økten, men innholdet er ikke gjennomgått eller godkjent. Gamle PR-er skal vurderes mot fersk main enkeltvis. Antallet alene dokumenterer ingen årsak til utilgjengelig arbeidsmiljø. Ingen av dem lukkes eller merges i dette kontrollpunktet.

Kontroll: målegrunnlag hentet fra GitHubs jobs/steps for kjøringene over. Diff begrenses til dette dokumentet og BESLUTNINGER.md. Ingen ny lokal nettlesertest er relevant for ren loggføring. Egenkontroll av tall, lenker og diff. Lars godkjenner sammenslåing. ChatGPT/Codex, egenkontroll.


## Gjennomgang og målepunkter i resultatlinjetesten, 6. november 2026

Arbeidsgrunnlag main f79352c etter #243. Hele resultatlinje-browser, a11y-browser og theme-browser er lest. Neste kodeendring gjelder bare loggføring av tid i resultatlinje-browser. Ingen ny parallellisering eller endring i venting, motorer, skjermstørrelser, forventninger eller workflow.

### Funn fra koden, ikke en kjøretidsprofil

| Test | Konkret omfang og planlagt venting | Vurdering |
| --- | --- | --- |
| resultatlinje | 16 sidebesøk. Faste pauser summerer til 12 580 ms per fullført motor. | Måles først fordi deler av tidsbruken er eksplisitt venting, og WebKit var blant de tregere stegene. |
| a11y | 3 temaer × 3 bredder × 7 sider = 63 grunnmålinger. 42 av disse gjør inntil 40 Tab-trykk hver. I tillegg kommer 640 px, korte skjermer og egen tastaturreise. Grunnmålingene alene ber om 9450 ms faste pauser. | Bredde og fokusdekning er reelle kontrollkrav. Samme sidesti er ikke bevis på dobbeltarbeid. |
| theme | 5 bredder × 3 temaer med temavelger, kontrast, fokus og lukking. 5790 ms faste pauser i breddeløkken og de tre resultatkontrollene. Dessuten lagring, separate faner, blokkert lagring, utskrift og toppfelt på seks sider. | Tester selve temabytteflyten og tilstander som a11y-grunnmålingen ikke erstatter. |

Resultatlinjens planlagte pauser er fordelt slik: mobil/zoom 2580 ms, simulert sikkerhetsfelt 1040 ms, lavt vindu 1040 ms, gjentatt opp/ned over grønt felt på to kalkulatorer 6720 ms, velkomst 800 ms og rapporttabell 400 ms. Summen er 12 580 ms. Disse tallene kommer fra løkkene og waitForTimeout, ikke fra observerte millisekunder. Nettleserhandlinger, lasting, betinget venting og opprydding kommer i tillegg.

### Hva målingen skal svare på

console.time/timeEnd i Node logger nettleseroppstart, mobil/zoom, sikkerhetsfelt, lavt vindu, grønt felt, velkomst, rapporttabell og opprydding, med motor i hvert navn. En totalmåling inkluderer serveroppsett og fram til oppryddingskallet er utført. Den er ikke identisk med GitHub-stegets levetid, og server.close venter fortsatt ikke eksplisitt på alle forbindelser. Ingen brukerdata eller nye filer logges. Ingen nye avhengigheter.

Ved feil beholdes opprinnelig feilutgang. Fullført del har tidslinje, mens den avbrutte delens timeEnd ikke nås. Total og opprydding logges også ved feil inne i try-blokken, men er da ikke en vellykket fullmåling. Feil før try-blokken kan avslutte uten totalmåling. Ingen tidsgrense eller hastighetskrav legges til.

Før neste endring: les målepunktene fra ordinær PR-/main-kjøring for begge eksisterende motorer. Sammenhold dem med planlagt venting per del. Undersøk grønt-felt-delen først hvis den faktisk dominerer. Eventuell erstatning av fast pause må vente på en relevant tilstand uten å gjøre en fraværs- eller fokusprøve til en tilfeldig øyeblikksmåling. Ikke fjern lån, zoom, berøring, velkomst eller rapportprøver for å spare tid. Tema og a11y endres først ved et eget konkret funn.

Lokalt: JavaScript-syntaks og sikkerhets-/versjons-/gammel-kode-/diff-kontroller består. Maskinell paritet fjerner bare målekoden og gjenoppretter den opprinnelige testfilen byte for byte. En kontrollert feil ved nettleseroppstart prøver at opprydding/total logges og at prosessen fortsatt avslutter med feil. Ingen ekte lokal nettleserkjøring. GitHub må bekrefte uendrede krav og faktisk måleutskrift før Lars merger. Ingen kortere kjøretid påstås fra dette målegrepet. ChatGPT/Codex, egenkontroll.


## Målt resultatlinje og avgrenset motorpar, 7. november 2026

Arbeidsgrunnlag main 5edeebd etter #244. Kjøring [42310693153](https://github.com/gronnlars/spareverksted/actions/runs/42310693153) bestod checks, browser og deploy. Browser tok 660 sekunder. Tidslinjene er lest fra browser-jobb 128211238997, ikke beregnet fra stegnavn.

| Del | Chromium, sekunder | WebKit, sekunder |
| --- | ---: | ---: |
| Oppstart | 0,058 | 0,072 |
| Mobil og zoom | 3,218 | 4,576 |
| Sikkerhetsfelt | 1,504 | 2,465 |
| Lavt vindu | 1,484 | 2,444 |
| Grønt felt | 7,841 | 10,517 |
| Velkomst | 1,060 | 1,568 |
| Rapporttabell | 0,588 | 1,065 |
| Opprydding | 0,017 | 0,064 |
| Total | 15,774 | 22,776 |

Grønt-felt-delen er størst i begge motorer. 6,72 sekunder av denne delen er planlagte pauser. Det sier ikke at pausene kan fjernes uten å endre prøven. Testen undersøker både synlighet og fravær etter gjentatt rulling, med fokus og forsinkede nettleserhendelser. En umiddelbar fraværsprøve kan gi falskt grønt. Derfor beholdes alle pauser og forventninger i dette steget.

Etter gjennomgang av hele testfilen og layout.js prøves i stedet Chromium og WebKit som ett par. Hver prosess har egen server fra listen(0), egen nettleser og egne kontekster. Kildekode og CSS leses, inkludert motorens lokale simulering av sikkerhetsfelt. Ingen felles filer skrives. Kontekster/sider lukkes gjennom hele prøven. De eksisterende testparene kjører etter hverandre, så dette gir maksimalt to samtidige testprosesser. Ingen ny motor eller større matrise.

Hjelperen har ett eksplisitt unntak fra Chromium/Firefox: bare resultatlinje-browser bruker Chromium/WebKit. De fire tidligere parene beholder sine motorer. Tillatelseslisten utvides med bare denne testen. Begge prosesser ventes ferdig, hver motor beholder full logg og egen sluttkode, og enhver feil gir rødt steg. Tidsmålingene fra #244 beholdes uendret. Samme kommandolinje er grunnlag for begge motorer, og ingen ekstra miljøvariabler trengs.

Lokalt består 23 orkestreringstilfeller i tre unittest-metoder: fem testfiler ganger fire utfall, manglende node for begge motorkombinasjoner og avvist ukjent testfil. Barriere i node-erstatningen krever begge avtalte motorer før fullføring og avviser annen motor. YAML-paritet bekrefter at bare de to resultatlinjestegene er erstattet. Sikkerhet, versjoner, gammel-kode-vern og diff består. Produksjon og resultatlinjetesten er uendret. Dette er prosessprøver, ikke ekte nettlesere.

GitHub må bekrefte begge motorers komplette faseutskrift, sluttrapport og sluttkode 0 før Lars merger. Sammenlign parets veggklokketid med tidligere 38,550 sekunder samlet målt testtid, med forbehold om ulike kjøringer og ressursbruk. Tidsmålingene inne i prosessene kan øke under samtidighet. Ingen bestemt gevinst eller full regresjonsfrihet påstås fra enkeltkjøringen. Ved ressursfeil eller ustabilitet revurderes bare grupperingen, uten å svekke prøven. ChatGPT/Codex, egenkontroll.


## Feil i PR #245: direkte kapittellenke i WebKit, 7. november 2026

PR-kjøring 42312709348 feilet i tests/infosider-browser.cjs (webkit), med «direct heading link opens chapter» på linje 93. Checks bestod. Resultatlinjeparet bestod med chromium=0 og webkit=0. Motorenes målte totaler var 17,359 og 25,479 sekunder. Dette godkjenner ikke hele PR-en: browser var rød og deploy ble skipped. Ingen sammenslåing.

Testen bruker page.goto til ny hash i samme dokument og leser umiddelbart open-attributtet. Produksjonens infosider.js åpner kapitlet gjennom hashchange. Navigeringskallet kan fullføre før denne hendelsen behandles. Det er en konkret synkroniseringsrisiko i testen. Feilloggen alene fastslår ikke motorens nøyaktige hendelsesrekkefølge eller at den nye grupperingen forårsaket feilen. Infosidetesten kjører senere, etter at begge resultatlinjeprosesser er avsluttet.

Rett samme PR med eksplisitt venting på at første kapittel faktisk er åpent, høyst 3000 ms, før den opprinnelige open-kontrollen. Feilmeldingen får fil og anker. Ingen fast pause, omkjøring eller continue-on-error. En manglende eller feil kapittelåpning gir fortsatt feil. Ingen produksjonsfil endres. Andre kontroller av utskrift, fokus og lagring bevares.

Lokalt: syntaks, sikkerhet, versjoner, gammel-kode-vern og diff består. Faktisk infosider.js er prøvd med en simulert utsatt hashchange: lukket før hendelsen, åpent etter hendelsen og fortsatt lukket ved ukjent anker. Dette underbygger tidsrisikoen, men er ikke en ekte WebKit-kjøring. GitHub må bekrefte alle tre infosidemotorer og resten av PR-en etter rettingen før Lars merger. Ingen automatisk omkjøring av gammel commit. ChatGPT/Codex, egenkontroll.
