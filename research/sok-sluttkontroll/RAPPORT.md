# Sluttkontroll av søket, 24. oktober 2026

**Anbefaling: godkjenn og avslutt utviklingsrunden for søket, med forbehold.** Ingen blokkerende feil er funnet i det vi har kunnet teste. Tre kontroller er ikke gjort og kan ikke gjøres av Claude: ekte iPhone Safari, skjermleser og brukertest. Anbefalingen er et forslag. Lars avgjør.

## 1. Hva som er vurdert

| | |
|---|---|
| Vurdert commit | `4022c94` (main). Inneholder #61 (ASK og fondskonto) og #62 (samlet arbeidsgrunnlag) |
| Publisert | Ja. Push til main startet CI og deploy. CI på `4022c94`: `checks`, `browser` og `deploy` grønne (kontrollert via GitHub) |
| På main, kodegrunnlag | #52, #56, #58, #59, #61 |
| Fortsatt bare foreslått | #54 (gammel søkelinje), #55 (MiniSearch-forsøk), #47 (ordgrenser), #45 (integrasjon). Alle utkast, alle erstattet av løsningen på main. Ikke vurdert som del av dette |
| Denne leveransen | Rettingen under og dokumentasjon, i egen utkast-PR. Ikke merget |

Lest: `AGENTS.md`, `CONTRIBUTING.md`, `BESLUTNINGER.md` (søkeposter), `SOK.md`, `SPRAKREGLER.md`, `research/plan.md`, `research/universell-utforming.md`, søketestene.

## 2. Produktvalgene søket bygger på (ikke endret)

Kilde: `SOK.md` og `BESLUTNINGER.md` («Forhåndsskrevne svar framfor KI-svar»). Ingen KI, ingen innsending av det brukeren skriver.

| Situasjon | Valg | Hvorfor |
|---|---|---|
| Direkte svar | Bare ved entydig treff: registrert navn, ferdig spørsmål eller ord med én eier | Et feil direkte svar er verre enn ett ekstra klikk |
| Flere alternativer | Like gode treff i ulike svarfamilier gir «Flere svar kan passe». Ingenting åpnes | Brukeren velger selv |
| Skrivefeil | Gir «Mente du». Aldri automatisk svar. Maks to rettinger, bare mot registrerte ord | Feilretting kan gi feil svar |
| Brede ord («lån», «skatt», «boligsparing») | Gir forslag | Ordet har flere eiere |
| Særskriving | Delene slås sammen når resultatet er et registrert navn («fonds konto», «aksje spare konto») | Norsk skriftpraksis |
| Nekting | Ingenting åpnes, nektingen nevnes | «Jeg vil ikke ha fond» skal ikke gi fondssvar |
| Kjent hull | Modus `uncovered`: «Vi har ikke et eget svar på (emnet) ennå» | Rett tema, men svaret dekker ikke spørsmålet |
| Ingen treff | Ærlig beskjed og temavelger | Manglende dekning skal ikke skjules |

Jeg har ikke endret noen av disse valgene.

## 3. Testgrunnlag

Verktøy: `research/sok-sluttkontroll/kjor.cjs` (kjør `node research/sok-sluttkontroll/kjor.cjs . --detaljer` fra repo-roten). Testsettene er kopiert fra #55 fordi #55 ikke er på main.

| Del | Antall | Merknad |
|---|---:|---|
| Utviklingssett (#55) | 81 | |
| Holdout (#55) | 45 | Brukt før (i #55). Ikke lenger uberørt, siden søket er rettet etter at det ble sett |
| Tillegg i denne kontrollen | 25 | Navngitte problemtilfeller fra oppdraget, skrevet før kjøring |
| Sum | 151 | |

**Endringer i settet før kjøring**
- «96 tilfeller» i oppdraget var de tilfellene som var gyldige mot main før #61. Med ASK- og fondskontoforklaringene på main er alle 126 fra #55 gyldige (81 pluss 45). Derfor 126, ikke 96.
- `d101` («Jeg vil ikke ha fond») forventet fondssvar. Følger nå nektingsvedtaket: forventet modus `negated`. Dokumentert i `kjor.cjs` (`ENDRET`).
- Verktøyet fra #55 slo `negated` og `uncovered` sammen med «ingen treff». `kjor.cjs` skiller dem (klasse `RM` = riktig modus).
- Tillegget `t23` («bolig spare konto») hadde først feil forventning (ikke fond). Rettet etter at jeg leste innholdet: «sparekonto» er registrert navn på temaet Sparekonto eller fond, så fondssvaret er riktig. Rettet før noe ble endret i koden.

Testsettene er skrevet av Claude, ikke hentet fra ekte brukere.

## 4. Resultat

Mot main `4022c94`, uten kodeendring (bare tillegget `t24` og `t25` mangler i denne kjøringen):

| Mål | Før retting | Etter retting |
|---|---:|---:|
| Misvisende direkte svar (WD) | 2 | 0 |
| Prioriterte søk med relevant svar eller valg blant de tre første | 115 av 115 (100 %) | 115 av 115 (100 %) |
| Direkte riktig førstesvar blant prioriterte søk | 95 av 115 (82,6 %) | 95 av 115 (82,6 %) |

Etter retting, hele settet (151):

| Utfall | Antall | Betydning |
|---|---:|---|
| RF | 92 | Direkte svar, riktig tema |
| RFok | 3 | Direkte svar, akseptabelt tema |
| RS | 20 | Riktig tema vist som forslag («Mente du» eller valg) |
| RM | 6 | Riktig avtalt modus (nekting eller kjent hull) |
| CR | 19 | Riktig «ingen treff» |
| soft-dekket | 7 | Skjønnstilfeller, forventede forslag finnes |
| soft-mangler | 4 | Se «Akseptable begrensninger» |
| MISS, WD, FS | 0 | |

«Prioriterte søk» betyr tilfeller med forventet tema (115 av 151). Tilfeller som skal gi «ingen treff» (19) eller avtalt modus (6), og skjønnstilfeller (11) er ikke med i prosenten. At den er 100 prosent betyr at settet ikke finner flere feil. Det betyr ikke at 100 prosent av ekte brukerspørsmål treffer. De 20 skrivefeilene og særskrivingene som gir forslag teller som relevante, siden forslaget er det avtalte svaret.

## 5. Rettingen (egen kode i denne PR-en)

Funn utenfor settet, ved prøving med 70 ekstra formuleringer: «aksjeutbytte» og «hva er et rentefond» åpnet direkte svaret Sparekonto eller fond, som ikke nevner utbytte eller rentefond. Det er et misvisende direkte svar fordi ordet `aksj` og `fond` har én eier, mens svaret ikke dekker spørsmålet.

Rettet slik innholdsreglene sier: to rader i `GAPS` (`utbytte` og `rentefond`) i `veileder-engine.js`. Søkemotoren `veileder-sok.js` er uendret. `veileder-engine.js` økt til `v=10` i `spor.html`. Fire nye rader i `veileder-sok-rettinger.test.cjs`. Disse to står nå som innholdshull i kø, ikke som skjulte feil.

Bivirkning: «skatt på utbytte» ga tidligere forslag (ASK, IPS, BSU). Det gir nå «Vi har ikke et eget svar på utbytte fra aksjer og fond ennå» med fond som nærmeste tema. Ærligere, men brukeren mister de tre forslagene. Akseptert siden svaret om skatt på utbytte ikke finnes.

## 6. Godkjenningskravene

| Krav | Status | Grunnlag |
|---|---|---|
| Ingen kjente misvisende direkte svar i testsettet | Oppfylt | WD 0 av 151. 2 funnet utenfor settet og rettet |
| Minst 95 % relevant svar eller valg blant de tre første | Oppfylt, 115 av 115 (100 %) | Egenskrevet sett, delvis brukt til tuning. Se forbeholdet |
| Avtalte språkvariasjoner | Oppfylt | «fonds konto», «fond konto», «aksje spare konto», «aksje sparekonto», «bolig sparing», skrivefeil gir forslag. Alle tilfellene i `tillegg.json` |
| Direkte svar, alternativer og «Mente du» tydelig skilt | Oppfylt i Chromium | Egne tekster og utseende, sett på skjermbilder ved 390 px. Testet i `veileder-sok-browser.cjs` |
| Ingen treff gir en nyttig vei videre | Oppfylt | Temavelger og tekst. Se «konto» under begrensninger |
| Ingen kjente feil hindrer bruk på mobil eller tastatur | Ingen kjent. Ikke fullt testet | Chromium 320, 390 og 1280 px: ingen vannrett scrolling, trykkflater minst 44 px, Enter åpner forslag. Firefox og WebKit bare i CI. Ikke testet: iPhone Safari, skjermleser |
| Nytt innhold uten særtilpasning av søkemotoren | Oppfylt | Prøvd med et nytt tema (`keys`, `words`): svar, skrivefeil gir forslag, andre søk uendret. Eksisterende test `veileder-sok-rettinger.test.cjs` dekker bygging av ordlisten |

## 7. Hva som faktisk er testet

| Kontroll | Utført av | Resultat |
|---|---|---|
| Node: 14 testfiler | Claude, lokalt | Alle grønne |
| Nettleser: 13 filer, Chromium | Claude, lokalt | Alle grønne |
| CI på main `4022c94` | GitHub | `checks`, `browser`, `deploy` grønne |
| Sammenligningssett, 151 tilfeller | Claude | Se kapittel 4 |
| 70 ekstra formuleringer, manuell gjennomgang | Claude | To misvisende, rettet |
| Skjermbilder ved 390 px (direkte, valg, «Mente du», ingen treff, kjent hull) | Claude | Gjennomgått. Ikke systematisk visuell test |
| iPhone Safari, VoiceOver, andre skjermlesere, zoom 200 og 400 % | Ingen | **Ikke testet** |
| Brukertest | Ingen | **Ikke gjort** |

Automatiserte tilgjengelighetstester (`a11y-browser.cjs`) er ikke regnet som skjermlesertesting.

## 8. Blokkerende feil, akseptable begrensninger, senere forbedringer

**Blokkerende feil:** Ingen funnet.

**Akseptable begrensninger**
- «konto» alene gir «Vi har ikke et ferdig svar» selv om vi har kontoforklaringer. Rett løsning er ett `BROAD`-ord. Ikke gjort fordi det ikke blokkerer og ligger i køen.
- «sparing» alene gir bred oppfordring uten forslag (SOK.md regel 4 og `GENERIC`).
- Alle ord som starter på «aksj» går til Sparekonto eller fond (for eksempel «aksjeutbytte» er nå hull, men andre sammensetninger kan treffe fondssvaret uten å dekke spørsmålet).
- «gjeldsrådgivning» gir ingen treff. Innholdshull.
- «ikke boliglån» gir nekting og viser boliglån som nærmeste. Med vilje.
- Nekting er bare testet på korte setninger.
- Tekstene for nekting og «ingen eget svar» er ikke godkjent av Lars.
- Testsettene er egenskrevne, holdout er brukt.

**Innholdshull (kø, ikke søkefeil):** utbytte, rentefond, renters rente, barnesparing og skatt, BSU ved flytting, gjeldsrådgivning, formuesskatt, flytte hjemmefra og de øvrige i `research/plan.md`.

**Senere forbedringer:** `BROAD.konto`, brukertest av «Mente du» og nektingstekster, register som datafil.

## 9. Videre arbeid med søket etter godkjenning

Begrenset til: feil svar, hindringer i betjeningen og gjentakende problemer fra faktisk bruk. Andre ønsker legges i `SPORSMALSKO.md`. Nytt innhold legges inn etter reglene i `SOK.md` («Slik legges nytt innhold inn»), uten endring i `veileder-sok.js`.
