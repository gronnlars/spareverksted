# CI-feil på main etter PR #34

24. oktober 2026. Bare dokumentasjon. Kalkulatoren er ikke endret.

## Kort

Den første CI-kjøringen på main etter PR #34 (`ac0c446`, kjøring 40055363955, forsøk 1) feilet i jobben `browser`. Jeg kalte det tidligere tilfeldig. **Det var feil.** Feilen skyldes trolig en tidsfeil i koden jeg la til i PR #34, og den er gjenskapt lokalt.

## 1. Loggen

Loggen kunne ikke leses. GitHub lagrer den på `productionresultssa14.blob.core.windows.net`, og arbeidsmiljøet nekter tilkobling dit (`connect_rejected`). Annoteringene i GitHubs API sier bare «Process completed with exit code 1». **Feilmeldingen fra CI er derfor ikke sett.** Det som står under, bygger på tidspunkter fra API-et og på gjenskaping lokalt.

Lars kan bekrefte dette ved å åpne loggen i nettleseren: Actions → kjøring 40055363955 → forsøk 1 → `browser` → «Browser flows (Chromium)». Forventet feil: `AssertionError … 'false' !== 'true'` i `tests/input-browser.cjs:115`.

## 2. Hvor langt kjøringen kom (kontrollert, GitHub API)

| Kjøring | Steget «Browser flows» | Varighet | Resultat |
| --- | --- | --- | --- |
| PR #34, samme kode (40053649630) | 02:19:27 til 02:21:00 | 93 s | Grønn |
| main `ac0c446`, forsøk 1 | 02:44:14 til 02:44:21 | **7 s** | Feil |
| main `ac0c446`, forsøk 2 | 02:45:34 til 02:47:06 | 92 s | Grønn |

- Steget kjører testene etter hverandre og stopper ved første feil. Første test er `input-browser.cjs`.
- Lokalt tar `input-browser.cjs` rundt 20 sekunder, og alle Chromium-testene til sammen 91 sekunder. Det er omtrent like lenge som CI bruker. Etter 7 sekunder var CI derfor trolig fortsatt i den første testen.
- `polish-browser.cjs` er den eneste testen som lagrer skjermbilder. Kjøringen har bare ett skjermbildeartefakt, og det er laget 02:47:07, altså av forsøk 2. Det tyder på at forsøk 1 ikke kom så langt som til `polish-browser`. Jeg har ikke kontrollert hvordan GitHub viser artefakter fra flere forsøk av samme kjøring, så dette er et tilleggsbelegg, ikke et bevis. Sammen med de 7 sekundene utelukker det i praksis den kjente tidsfeilen i `polish-browser` (planen, punkt 1) og den nye `felt-browser.cjs`, som kjører enda senere.

**Slutning, ikke bevis:** feilen var i `input-browser.cjs`.

## 3. Gjenskapt lokalt (kontrollert)

`input-browser.cjs` kjørt 24 ganger, fire samtidig for å gi belastning, i Chromium:

| Kode | Feil |
| --- | --- |
| main `ac0c446` (med PR #34) | **4 av 24**, alle på linje 115: `'false' !== 'true'` |
| `a5777f6` (før PR #34) | **0 av 24** |

Linje 115 kontrollerer at «Antatt årlig vekst» er ugyldig etter at det er skrevet `500`. I de fire feilene var feltet gyldig.

## 4. Årsaken (kontrollert)

PR #34 markerer hele tallet når et tallfelt får fokus. Markeringen skjer to ganger: én gang med en gang og én gang via `setTimeout(…, 0)`. Den andre er ment for iPhone. Den skal bare skje hvis ingenting er skrevet ennå, og koden kontrollerer det med `el.value===before`.

Kontrollen har et hull. Er det første tegnet som skrives identisk med hele den gamle verdien, ser feltet uendret ut. Vekstfeltet har «5» fra før, og testen skriver «500». Når tidsuret kommer først etter det første tegnet:

1. Feltet får fokus med verdien «5». Hele tallet markeres.
2. «5» skrives og erstatter markeringen. Verdien er fortsatt «5».
3. Tidsuret kommer. Verdien er lik «før», så hele «5» markeres igjen.
4. «00» skrives og erstatter markeringen. Verdien blir **«00», altså 0**, og feltet er gyldig.

Bekreftet med et skript som forsinker nettleserens 0-millisekunders tidsur til 100 millisekunder, slik det kan bli på en treg eller belastet maskin:

| Maskin | Felt | Før | Skrevet | Resultat |
| --- | --- | --- | --- | --- |
| Normal | Antatt årlig vekst | 5 | 500 | 500 |
| Treg | Antatt årlig vekst | 5 | 500 | **00** |
| Treg | Du sparer hver måned | 2 000 | 2500 | 2500 |
| Treg | Sparetid | 10 | 10 | 10 |

## 5. Betydning for brukere (vurdering, ikke testet)

- Feilen krever at det første sifferet er likt hele det gamle tallet, og at tidsuret kommer først etter tastetrykket. Det skjer nesten bare når den gamle verdien er ett tegn, for eksempel standardveksten 5 %, og nettleseren er treg.
- Et tidsur på 0 millisekunder kjører normalt lenge før et menneske rekker å skrive. Risikoen for vanlige brukere er trolig lav, men den finnes, og resultatet blir et stille feil tall. Det er den samme typen feil som PR #34 skulle rette.
- **CI-konsekvens:** testen kan feile tilfeldig. Da stopper publiseringen helt til jobben kjøres på nytt.

## 6. Forslag til retting (ikke gjort, krever beslutning)

Rettingen er i kalkulatoren, som er fryst. Den kan begrunnes etter planens punkt 0, siden feilen er en regresjon jeg har innført, og den kan gi stille feil tall. Forslag:

- Den sene markeringen avbrytes av ethvert tastetrykk eller all inntasting etter fokus (`keydown` og `beforeinput`), i stedet for å sammenligne verdien.
- Regresjonstest: forsink 0-millisekunders tidsur i testen (som i punkt 4), skriv «500» i vekstfeltet og forvent «500».
- Kontroll: `input-browser.cjs` 24 ganger med fire samtidig, null feil.

Alternativ: fjerne den sene markeringen helt. Den ble lagt inn for iPhone uten at det er testet på en iPhone at den trengs.

## Ikke kontrollert

- Selve CI-loggen (se punkt 1).
- Om feilen kan skje på en ekte iPhone eller en treg Android-telefon.
