# Søket i «Spør om sparing»: status og regler

Sist kontrollert 24. oktober 2026 mot main addf40b (inneholder #52, #56 og #58). Denne filen beskriver det som gjelder. Forsøksdokumentasjonen om MiniSearch og gamle søkelinjer ligger i #55 og skal ikke slås sammen.

## Hva søket gjør

Søket er lokalt og forhåndsskrevet. Ingen KI, ingen innsending av det brukeren skriver. Koden ligger i `dist/veileder-sok.js`. `dist/veileder-engine.js` setter opp temaene og de brede ordene (`BROAD`, `GENERIC`).

Fem utfall, og ingen av dem skal late som noe annet enn det er:

| Utfall | Når | Hva brukeren ser |
|---|---|---|
| Direkte svar (`answer`) | Entydig treff på et registrert navn, et ferdig spørsmål eller et ord med én eier | Svaret åpnes, med begrunnelse i statusfeltet |
| Valg (`choose`) | Like gode treff i ulike svarfamilier | Ingenting åpnes. Brukeren velger |
| Forslag (`suggest`) | Skrivefeil, bredt ord («lån», «skatt») eller usikkert treff | «Mente du …?» eller merkede forslag. Ingenting åpnes |
| Nekting (`negated`) | Brukeren avviser et tema («Jeg vil ikke ha fond») | Ingenting åpnes. Nektingen nevnes. Nærmeste temaer vises som nærmeste, ikke som svar |
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

## Slik legges nytt innhold inn

En ny post trenger `words` (regulære uttrykk), `questions` og `keys` (små bokstaver og tall, bare `[a-zæøå0-9]`). Normalt skal det ikke kreves endring i `veileder-sok.js`. Regler:
- Hvert navn skal ha én eier. Står samme nøkkel i to temaer, får brukeren valg eller forslag. Eksisterende tilfelle: `boligsparing` står både på `bsu` og `q-bsu-basics`. Veit itte om det er bevisst.
- Nye brede ord legges i `BROAD` med temaene de peker til.
- Nye fellesord som ikke skal gi treff alene legges i `GENERIC`.
- Legg til rader i `tests/veileder-sok-utvidet.test.cjs` for hvert nytt navn og én skrivefeil.

## Testet 24. oktober 2026

| Hva | Resultat |
|---|---|
| Node: 14 testfiler | Grønne lokalt |
| 96 tilfeller mot main (fra #55, `research/sokeprove`) | Samme resultat før og etter sluttkontrollen. Feil direkte svar: 0 |
| Chromium lokalt, 320, 390 og 1280 px | Forslag, nekting, trykkflater ≥ 44 px, ingen vannrett scrolling, ingen sidefeil, ingen eksterne forespørsler |
| Firefox og WebKit | Bare i CI. WebKit er ikke iPhone Safari |

Ikke testet: iPhone Safari, VoiceOver, skjermleser, zoom 200 og 400 %, brukertest. Testsettene er skrevet av Claude, ikke hentet fra ekte brukere.

## Sluttkontroll: funn og rettinger

Rettet i denne omgangen:
- «fonds konto», «fond konto» og «aksje spare konto» ga fond-svaret, mens «fondskonto» og «aksjesparekonto» ga ASK. Nå gir alle samme svar. «individuell pensjons sparing» gir nå IPS først.
- «Jeg vil ikke spare i aksjer» og «hva er best bortsett fra fond» ble svart på som vanlige ønsker om fond. De gir nå nekting.
- `tests/veileder-browser.cjs` feilet i omtrent hver tredje kjøring, også på main, fordi `pick()` leste siden før den var lastet. Nå venter den på elementet. Seks av seks kjøringer ok etter rettingen. Før rettingen feilet ett av fire forsøk.

Kjente begrensninger i søket:
- Nekting er bare testet på korte setninger. «Jeg vil ha fond, men ikke aksjer» behandles som fond med en notert nekting av «aksjer».
- Nekting av et ord uten eget tema (f.eks. «ikke betalt») gjør ingenting, og det er med vilje.
- Tekstene «Du skriver (ordet) med nekting …» er ikke godkjent av Lars.
- «hvordan fungerer renters rente» gir forslag på boliglån og fond. Ingen post forklarer renters rente.

Innholdshull som søket ikke kan rette (rett tema, men svaret besvarer ikke spørsmålet). Gis videre til spørsmålskøen:
- «kan jeg spare til barnet uten å bli skattlagt»: treffer barnesparing, men svaret nevner ikke skatt.
- «hva skjer med BSU hvis jeg flytter»: treffer BSU, men svaret sier ingenting om flytting.
- «hvordan fungerer renters rente»: ingen egen forklaring.

## #53 (ASK og fondskonto) mot dagens søk

Tilstand: utkast, konflikter mot main, base er eldre enn main. Ikke gjort her, bare beskrevet.

Dette er det som skiller #53 fra main og skal tas med: de to nye forklaringene `q-aksjesparekonto` og `q-fondskonto` med tester og visning.

Dette skal ikke føres tilbake: endringene i `words` for `funds` og `pension` i `veileder-engine.js` (negative framoversyn som `fond(?!skonto)`). Dagens søk skiller ASK og fondskonto via `keys` og sammenslåing, ikke via regex.

Slik tilpasses de:
1. Ta en ny gren fra main og legg bare inn de to forklaringene. Ikke merge #53 slik den står.
2. Gi hver forklaring `keys`. I dag står `aksjesparekonto`, `fondskonto`, `investeringskonto` og `kapitalforsikring` som nøkler på `q-ask-zero`. Når de nye forklaringene kommer må eierskapet deles: `q-aksjesparekonto` får `aksjesparekonto` og `ask`, `q-fondskonto` får `fondskonto` og `kapitalforsikring`, `q-ask-zero` beholder `investeringskonto`. Ellers får brukeren valg på hvert søk.
3. Legg inn søkerader: hvert navn, én skrivefeil, én særskriving og spørsmålet «forskjellen på ASK og fondskonto».
4. Kjør de 126 tilfellene i `research/sokeprove` på nytt. 30 av dem ble utelatt mot main fordi de krever disse forklaringene.
5. Ingen endring i `veileder-sok.js`.
