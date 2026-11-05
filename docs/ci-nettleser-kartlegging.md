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
