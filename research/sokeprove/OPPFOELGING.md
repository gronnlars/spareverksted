# Oppfølging av søkeforsøket, 2026-10-24

Gjelder: forsøksdokumentasjon i #55 (ikke for sammenslåing). Anbefalingen under gjelder **commit 253c629** (#52) pluss **e534810** (#56, stablet oppå #52). Mot main 31218ca.

## 1. Tallavviket (32 mot 29, deretter 33 mot 30)

Samme kjøring, to tellinger. Jeg oppga først den strenge og så den utvidede uten å si fra.

| Holdout, 45 tilfeller | #54 | Kandidat |
|---|---:|---:|
| Streng: bare riktig førstevalg (RF) | 32 | 29 |
| Utvidet: RF + akseptabelt førstevalg (RFok) | 33 | 30 |

Utviklingssettet (81): streng 55 og 59, utvidet 59 og 60. Rapporten bruker utvidet teller. Kandidaten og testsettene er ikke endret etter holdout. Rådata: `resultater/utvikling.json` og `resultater/holdout.json`. `node oppsummer.cjs --sjekk` feiler hvis tabellene i RAPPORT.md avviker fra rådataene (kjørt, ingen avvik).

## 2. #54, #52 og #45

Lest fra PR-differanser og kode (REST, ikke GraphQL). `node sammenlign-prer.cjs main=<sti> p54=<sti> p52=<sti>` kjører de tre mot de samme tilfellene.

| | Hva det er | Søkemotor? | Filer som kolliderer |
|---|---|---|---|
| #54 (5388b06) | `fix/sok-skrivefeil`, base main. Tåler skrivefeil og særskriving i `veileder-engine.js`, ny visning i `-ui.js` | Ja, enkel | `tests/veileder-sok.test.cjs` (samme navn som i #36), `veileder-engine.js`, `static.yml` |
| #52 (253c629) | `fix/sok-tolerant-og-treffvisning`, base main. Egen `veileder-sok.js`, `keys` per tema, `BROAD` og `GENERIC`, modusene answer, choose, suggest, none | Ja, mest komplett | Inneholder #36 (via merge 814f6dd). Inneholder **ikke** #35 (320ffb2 er ikke med) |
| #45 | Integrasjon av åpne PR-er, språkregler, forklaringer. Rører `veileder-engine.js` og `tests/veileder-sok.test.cjs`, men har ingen søkemotor (0 treff på `interpret` og `veileder-sok`) | Nei | `veileder-engine.js`, `veileder-sok.test.cjs` |

Overlapp: #54 og #52 løser samme problem på hver sin måte og kan ikke begge slås sammen. #47 (ordgrenser) er dekket av begge. #45 er ikke en søkelinje.

Måling på 96 tilfeller der alle forventede dokumenter finnes i alle grener (30 tilfeller utelatt fordi de krever innhold fra #53):

| Utfall | main | #54 | #52 |
|---|---:|---:|---:|
| Riktig førstevalg (RF) | 42 | 62 | 58 |
| Akseptabelt (RFok) | 5 | 5 | 1 |
| Riktig dokument bare som forslag (RS) | 0 | 0 | 11 |
| Ingen treff (MISS) | 20 | 0 | 0 |
| Feil direkte svar (WD) | 4 | 4 | **0** |
| Riktig avvisning (CR) | 17 | 17 | 18 |
| Skjønn: forslag dekker | 1 | 1 | 6 |

#54 har flest riktige førstevalg fordi den svarer direkte oftere. #52 har ingen feil direkte svar og gir i stedet forslag der den er usikker. Det er akkurat produktbeslutningen i punkt 4. Testsettet er skrevet av Claude, ikke av brukere, og 96 er et lite utvalg. Tallene viser retning, ikke en garanti.

**Anbefaling:** fortsett på #52, ikke #54. Vilkår:
1. #52 må rebaseres på main 31218ca. Den bygger på #36 og mangler #35.
2. #36 og #54 lager begge `tests/veileder-sok.test.cjs`. Når #52 går inn, må #54 lukkes, ellers blir det konflikt.
3. Forklaringene fra #53 trenger `keys` for at aksjesparekonto og fondskonto skal få samme dekning som de eldre temaene.
4. #56 ovenpå.

## 3. Rettingen (#56, e534810, stablet på #52)

- Ordlisten bygges én gang per innholdsversjon. Test: tre søk gir én bygging, nytt `register()` gir én ny.
- `aksjesparekonot`, `fondskotno` og `fondkonto` gir nå «Mente du», ikke fond-svaret. `barnesparinng`, `studentlån`, `fondssparing`, `aksjefond` og `boliglån` gir fortsatt direkte svar.
- To regresjoner fant jeg og rettet underveis (sparekontoen som feilaktig ble mistenkt via digraf-omskriving, og barnesparinng som gikk fra svar til forslag). Begge har rad i testen.

## 4. Produktbeslutningene

| Beslutning | Slik er den gjort | Hvor |
|---|---|---|
| To redigeringer gir «Mente du», ikke automatisk svar | #52 gir bare «Mente du» for skrivefeil, aldri automatisk åpning. #56 utvider til skrivefeil med kjent stamme | `veileder-sok.js` |
| Registrerte entydige navn gir direkte treff | Via `keys` i hvert dokument. Alle 39 registrerte navn med dokument i #52 gir riktig svar i dag | `register-vurdering.cjs` |
| «Jeg vil ikke ha fond» | Ny modus `negated`. Ingenting åpnes, nektingen nevnes, nærmeste temaer vises merket som nærmeste og ikke som svar. «ASK, men ikke fondskonto» gir valg med nektingen nevnt | #56 |

Begrensning i negasjonen: «ikke» og «uten» holder bare det første ordet med innhold etter seg unna. «Jeg vil ha fond, men ikke aksjer» behandles slik det står, men setninger med flere ledd er ikke testet utover radene i `tests/veileder-sok-rettinger.test.cjs`. Veit itte hvordan ekte brukere formulerer nekting.

Kjent feil som ikke er rettet: `fonds konto` (med mellomrom) gir fond, fordi «fonds» er et kjent ord og sammenslåing da blokkeres.

## 5. Registeret

`node register-vurdering.cjs <sti til #52>` (kjørt mot 253c629):
- I dag: 46 søkeord, 61 regulære uttrykk og 45 spørsmålstekster, skrevet for hånd per dokument.
- Alle 39 registrerte navn (av 48, 9 hører til #53) gir allerede riktig direkte svar i #52. **Registeret gir altså ingen nye treff i #52 i dag.**
- Det registeret gir som #52 mangler er kontroll. Eksempel i #52: nøkkelordet `boligsparing` står i to temaer (`bsu` og `q-bsu-basics`) uten at noe varsler. Om det er med vilje veit jeg ikke. Validatoren stopper slike tilfeller: samme navn på to begreper (testet med «pensjonssparing» på både IPS og BSU, og «ask» mot «ASK»), dokument som ikke finnes, relasjon til ukjent begrep, ukjent relasjonstype.

Vurdering: ta bare inn `navn`, `produktnavn` og `beslektet` som data med validatoren, og la `keys` genereres fra det. Ikke ta med samlebegrep, sammenligninger og indeksbygger nå. Ikke bytt motor. Gevinsten er færre stille kollisjoner og ett sted å føre navn, ikke bedre treff. Det er først verdt det når innholdet vokser (IPS, BSU, #53 og videre). Det er ikke nødvendig for å godkjenne M7.

## 6. Hva som faktisk er testet

| | Gjort | Ikke gjort |
|---|---|---|
| Node | 14 testfiler på #56 (inkl. ny `veileder-sok-rettinger.test.cjs`), grønne lokalt. `checks` og `browser` grønne i CI på e534810 | |
| Chromium | Lokalt 320, 390 og 1280 px: forslag, nekting, trykkflater ≥ 44 px, ingen vannrett scrolling, ingen sidefeil, ingen eksterne forespørsler. Også `veileder-sok-browser`, `veileder-browser`, `a11y-browser` | |
| Firefox og WebKit | Den nye nettlesertesten kjører i Firefox og WebKit i CI. `browser`-jobben på e534810 er grønn (lest av GitHub, ikke kjørt lokalt av meg) | WebKit er ikke iPhone Safari. Jeg har ikke sett skjermbilder fra Firefox eller WebKit |
| iPhone Safari | | Ikke testet |
| Skjermleser, zoom 200/400 % | | Ikke testet |
| Brukertest | | Ikke gjort. Testsettene er skrevet av Claude |

## 7. Anbefalt PR-rekkefølge

1. #35 (avdragstekst) og #36 (søketestsett). #52 inneholder #36 men ikke #35.
2. #52 rebaset på main, med CI grønn.
3. #56 oppå #52.
4. #53 (ASK og fondskonto) med `keys`.
5. Registeret som ren datafil med validator (valgfritt, etter 4).
6. Brukertest og iPhone-sjekk før noe publiseres.

Lukkes eller beholdes som dokumentasjon: #54 (erstattet av #52), #47 (dekket av #52), #45 (ikke en søkelinje, gjennomgås for språkregler og forklaringer separat), #55 (forsøksdokumentasjon, ikke slås sammen).

## 8. Før M7 kan godkjennes

- #52 og #56 gjennomgått av Lars. CI er grønn på begge (inkludert Firefox og WebKit for #56).
- Sjekket på iPhone Safari av Lars (min WebKit-test erstatter ikke det).
- Beslutning om negasjonsformuleringen i #56 («Du skriver (ordene) med nekting. Vi har ikke et eget svar på det ennå»).
- Avklart om `boligsparing` skal være nøkkelord på begge BSU-temaene.
- #53 rebaset og med `keys`.
- IPS og BSU står fortsatt som uferdige og er ikke med i det som godkjennes.
