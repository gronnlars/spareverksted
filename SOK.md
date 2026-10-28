# Søket i «Spør om sparing»: status og regler

Sist kontrollert 24. oktober 2026 mot main 4022c94 (inneholder #52, #56, #58, #59 og #61). Sluttkontrollen med anbefaling står i [research/sok-sluttkontroll/RAPPORT.md](research/sok-sluttkontroll/RAPPORT.md). Denne filen beskriver det som gjelder. Forsøksdokumentasjonen om MiniSearch og gamle søkelinjer ligger i #55 og skal ikke slås sammen.

## Hva søket gjør

Søket kjører i nettleseren og leter bare blant svar som er skrevet på forhånd. Ingen KI-modell tolker spørsmålet. Søket behandler søketeksten lokalt i nettleseren, og nettstedets egen kode sender den ikke til en server. Koden ligger i `dist/veileder-sok.js`. `dist/veileder-engine.js` setter opp temaene og de brede ordene (`BROAD`, `GENERIC`).

Seks utfall, og ingen av dem skal late som noe annet enn det er:

| Utfall | Når | Hva brukeren ser |
|---|---|---|
| Direkte svar (`answer`) | Entydig treff på et registrert navn, et ferdig spørsmål eller et ord med én eier | Svaret åpnes, med begrunnelse i statusfeltet |
| Valg (`choose`) | Like gode treff i ulike svarfamilier | Ingenting åpnes. Brukeren velger |
| Forslag (`suggest`) | Skrivefeil, bredt ord («lån», «skatt») eller usikkert treff | «Mente du» eller merkede forslag. Ingenting åpnes |
| Nekting (`negated`) | Brukeren avviser et tema («Jeg vil ikke ha fond») | Ingenting åpnes. Nektingen nevnes. Nærmeste temaer vises som nærmeste, ikke som svar |
| Kjent hull (`uncovered`) | Temaet finnes, men svaret dekker ikke det brukeren spør om (se «Kjente hull») | Ingenting åpnes. Brukeren får vite at vi ikke har eget svar på akkurat det. Nærmeste tema vises som nærmeste, ikke som svar |
| Ingen treff (`none`) | Innholdet dekker det ikke | Ærlig beskjed og temavelger |

## Varige regler

1. Skrivefeil gir aldri et automatisk svar. Maks to rettinger, og bare mot registrerte ord (`keys`).
2. Et registrert, entydig navn kan gi direkte treff. Navn registreres i `keys` på temaet som eier det.
3. Et sammensatt navn kan skrives i flere deler («fonds konto», «aksje spare konto»). Delene slås sammen når resultatet er et registrert navn. Andre sammenslåinger krever at første del ikke er et kjent ord.
4. Et ord uten én eier («lån», «bank», «skatt») gir forslag, aldri ett tilfeldig svar. Slike ord settes i `BROAD`.
5. Nekting rammer første ord med innhold etter «ikke», «uten» eller «bortsett». Stoppord og verb som «spare» og «investere» hoppes over. «Ikke råd» rammer bare «råd».
6. Et tema som ikke dekkes skal gi «ingen treff» med nærmeste temaer, ikke et svakt treff.
7. Ordlisten bygges én gang per innholdsversjon (økes i `register()`).
8. Ingen eksterne forespørsler, ingen logging av søk.
9. Et eksisterende svar presenteres ikke som dekkende hvis det ikke dekker spørsmålet. Kjente hull står i `GAPS` i `veileder-engine.js` og gir modus `uncovered`.
10. «Boligsparing» er bredere enn BSU, siden man kan spare til bolig uten BSU. Ordet gir forslag (`BROAD.boligsparing`), ikke ett svar. Ordet står fortsatt som nøkkel på BSU-temaene, bare slik at skrivefeil gir «Mente du».
11. Når `veileder-sok.js`, `veileder-engine.js` eller `veileder-ui.js` endres, økes `?v=` for den filen i `spor.html`, ellers kan nettleseren vise gammel kode. Dette ble glemt for `veileder-sok.js` ved #52 og #56 (sto på `v=1`).

## Slik legges nytt innhold inn

En ny post trenger `words` (regulære uttrykk), `questions` og `keys` (små bokstaver og tall, bare `[a-zæøå0-9]`). Normalt skal det ikke kreves endring i `veileder-sok.js`. Regler:
- Hvert navn skal ha én eier. Står samme nøkkel i to temaer, får brukeren valg eller forslag. Unntaket er `boligsparing`, som er et bredt ord (regel 10).
- Nye brede ord legges i `BROAD` med temaene de peker til.
- Nye fellesord som ikke skal gi treff alene legges i `GENERIC`.
- Legg til rader i `tests/veileder-sok-utvidet.test.cjs` for hvert nytt navn og én skrivefeil.

## Testet 24. oktober 2026

| Hva | Resultat |
|---|---|
| Node: 14 testfiler | Grønne lokalt, med nye rader for kjente hull, boligsparing og nekting |
| 156 tilfeller (126 fra #55 og 30 tillegg), `node research/sok-sluttkontroll/kjor.cjs . --detaljer` | Feil direkte svar: 0. Relevant svar eller valg blant de tre første: 115 av 115 prioriterte søk. Se rapporten for forbehold |
| Chromium lokalt, 320, 390 og 1280 px | Forslag, nekting, trykkflater ≥ 44 px, ingen vannrett scrolling, ingen sidefeil, ingen eksterne forespørsler |
| Firefox og WebKit | Bare i CI. WebKit er ikke iPhone Safari |

Ikke testet: iPhone Safari, VoiceOver, skjermleser, zoom 200 og 400 %, brukertest. Testsettene er skrevet av Claude, ikke hentet fra ekte brukere.

## Sluttkontroll: funn og rettinger

Rettet i denne omgangen:
- «fonds konto», «fond konto» og «aksje spare konto» ga fond-svaret, mens «fondskonto» og «aksjesparekonto» ga ASK. Nå gir alle samme svar. «individuell pensjons sparing» gir nå IPS først.
- «Jeg vil ikke spare i aksjer» og «hva er best bortsett fra fond» ble svart på som vanlige ønsker om fond. De gir nå nekting.
- `tests/veileder-browser.cjs` feilet i 4 av 7 kjøringer før rettingen, også uten mine søkeendringer, fordi `pick()` leste siden før den var lastet. Nå venter den på elementet. Seks av seks kjøringer ok etter rettingen. Det er et lite utvalg, og flakiness kan komme tilbake.

Kjente begrensninger i søket:
- Nekting er bare testet på korte setninger. «Jeg vil ha fond, men ikke aksjer» behandles som fond med en notert nekting av «aksjer».
- Nekting av et ord uten eget tema (f.eks. «ikke betalt») gjør ingenting, og det er med vilje.
- Tekstene «Du skriver (ordet) med nekting» er ikke godkjent av Lars.
- «hvordan fungerer renters rente» gir forslag på boliglån og fond. Ingen post forklarer renters rente.

## Kjente hull

Rett tema, men svaret besvarer ikke spørsmålet. Før sluttkontrollen åpnet søket likevel svaret. Nå gir det modus `uncovered`: «Vi har ikke et eget svar på (emnet) ennå», med nærmeste tema merket som nærmeste.

| Hull (`GAPS`) | Søkene som rammes | Hvorfor |
|---|---|---|
| `barnesparing-skatt` | «kan jeg spare til barnet uten å bli skattlagt», «skatt på barnesparing» | Barnesvaret nevner ikke skatt |
| `bsu-flytting` | «hva skjer med BSU hvis jeg flytter». Krever at spørsmålet nevner BSU (eller «boligsparing for ungdom»), så «jeg flytter og skal kjøpe bolig» ikke rammes | BSU-svarene sier ingenting om flytting |
| `renters-rente` | «hvordan fungerer renters rente» | Ingen post forklarer renters rente |
| `utbytte` | «aksjeutbytte», «hva er utbytte fra fond» | Sparekonto eller fond nevner ikke utbytte. Funnet i sluttkontrollen |
| `rentefond` | «hva er et rentefond» | Sparekonto eller fond nevner ikke rentefond. Funnet i sluttkontrollen |

Slik lukkes et hull: skriv svaret, og fjern raden fra `GAPS`. Testen `veileder-sok-rettinger.test.cjs` feiler hvis svaret allerede nevner begrepet mens raden står igjen (`covers`), så hullet ikke blir hengende. Et hull rammer ikke ferdig formulerte spørsmål (kind `question`) og bare når alle treffene er blant temaene i raden. Å skrive svarene er innholdsarbeid og ligger hos spørsmålskøen.

## ASK og fondskonto (fra #53)

Status: på main via #61. #53 er ikke merget og skal ikke merges.

Eierskap til navn (avgjort av Lars):

| Forklaring | Nøkler (`keys`) |
|---|---|
| `q-aksjesparekonto` | `ask`, `aksjesparekonto` |
| `q-fondskonto` | `fondskonto`, `investeringskonto`, `kapitalforsikring`, `zero`, `ikz` |
| `q-ask-zero` (sammenligningen) | ingen |

Regler:
1. Et enkelt kontonavn åpner sin egen forklaring. `words` bruker `alone(navn, andre)`: treffet teller bare når spørsmålet ikke nevner den andre kontotypen.
2. Sammenligningen nås med regexen `both` (ASK-navn og fondskonto-navn i samme spørsmål, i begge rekkefølger). Den har ingen `keys`, så et enkelt navn aldri åpner den.
3. Produktnavn (for eksempel Investeringskonto Zero) forklares med tilbyder, uten anbefaling.
4. `fond(?!skonto)` i `funds` og `/\bask\b/` fjernet fra `q-ips-ask` er data i samme stil som `aksj(?!esparekonto)`. Søkemotoren `veileder-sok.js` er uendret.
5. Ny forklaring med eget navn: legg navnet i `keys`, bruk `alone()` mot de andre kontonavnene, og legg inn en rad i søketestene.

Innhold: kontrollert mot Skatteetatens norske sider og Nordnets FAQ 24. oktober 2026. Sidene oppgir ingen oppdateringsdato, bortsett fra rettledningen (revidert oktober 2025). Påstander som ikke lot seg bekrefte ble tatt ut. Forbeholdet vises under «Kilder og forbehold». Intro-endringene #53 gjorde i `q-ips-ask` og `q-ask-zero` er ikke tatt med.

Kontroll mot norske primærkilder (24. oktober 2026): rene rentefond kan ikke ligge på ASK, og aksjer og aksjefond må være hjemmehørende i EØS. Siden sier ikke hvor et aksjefond må investere, så påstanden om at et EØS-fond kan investere utenfor Europa er tatt ut av `q-ask-zero`. Kjent rest: spørsmålet «konto» alene gir ingen treff.

## SV-022, kontrollgren 25.10.2026

Renters rente får egen forklaring q-renters-rente etter Lars sin kildekontroll og pushgodkjenning. Bare denne GAPS-raden fjernes. Andre hull består. Aktive tester forventer nå svaret; historisk sett er ikke endret. Sammenligning av 156 historiske søk mot main f9c553a gir én endring, t21, fra uncovered til q-renters-rente. Øvrige 155 er uendret. Begge kalkulatorlenkene er kontrollregnet uten endring i kalkulatorens kode. Nettleserprøven for faktisk innhold kjøres i CI; lokal Firefox/WebKit er blokkert av miljøfeil dokumentert i research/svarutkast/SV-022-KONTROLL.md.
