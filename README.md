# Spareverksted

En sparekalkulator med enkel inngang og mer detaljer etter behov.
Ren HTML, CSS og JavaScript. Ingen installasjon, database eller brukerinnlogging.

## Kjør lokalt

Fra prosjektmappen:

```sh
python3 -m http.server 8000 --directory dist
```

Åpne http://localhost:8000. Filene kan også åpnes direkte, men lokal lagring og kopiering av lenker virker best fra en nettadresse.

## Flytt til et annet nettsted

Publiser innholdet i `dist/` på en tjeneste for statiske nettsteder. Behold filene i samme mappe. Domenet håndteres hos valgt driftsleverandør. Kalkulatoren har ingen binding til Sites for selve beregningene.

Kodepakken som lenkes fra bunnteksten, kan oppdateres med `python3 scripts/package-source.py`. Kjør dette før publisering etter kodeendringer.

## Filer

- `dist/engine.js`: beregning av sparing, mål og uttak. Kan også importeres fra Node.
- `dist/app.js`: skjemaverdier, graf, scenarioer og hendelser.
- `dist/guidance.js`: kilder, datagrunnlag, hjelpetekster og mål-alternativer.
- `dist/journey.js`: startguide, alder, glidere, skattevisning og eksportknapper.
- `dist/tax.js`: ren beregning av skatteanslag på uttak.
- `dist/export-kit.js`: CSV og ekte XLSX (OOXML i ZIP), uten eksterne biblioteker.
- `dist/experience.js`: nivåtilpasset hjelp, maler og utskriftsrapport.
- `dist/style.css`: responsiv utforming og utskriftsstil.
- `dist/index.html`: sidens struktur.
- `tests/engine.test.cjs`: uavhengig kontroll mot månedlige og årlige løkker.

## Kontroller beregningene

Med Node.js installert:

```sh
node tests/engine.test.cjs
node tests/tax-export.test.cjs
```

Testene dekker 200 deterministisk genererte spareplaner, nødvendig månedssparing, null rente, svært lange perioder, 32 kombinasjoner av uttaksvalg og mål-alternativer.

## Viktige modellvalg

Effektiv nominell avkastning før kostnader. Netto årlig vekstfaktor er `(1 + avkastning) * (1 - kostnad)`. Innskudd ved månedsslutt. Spareøkning fordeles jevnt over månedene. Uttak skjer én gang ved slutten av hvert år. Inflasjonsøkning på ordinært årsuttak starter i år 2. Ekstrauttak kommer etter vanlig uttak i valgt år.

Spareutviklingen er før skatt. Et separat skatteanslag for uttak bruker enten forenklet ASK med oppgitt gjenstående innskudd og kjent skjerming, eller en brukerdefinert fast skattepliktig andel. Ingen ny skjerming, løpende bankbeskatning, IPS, BSU eller formuesskatt er modellert. Scenarioavvik er en følsomhetsanalyse, ikke et sannsynlighetsintervall. Modellen bruker ikke Monte Carlo. Kildestatistikk er datert 20. oktober 2026 og oppdateres ikke automatisk.

## Lagring og deling

Planer lagres lokalt i nettleseren under `sv-scenarios`. En delt lenke inneholder skjemaverdiene og visningsnivået, men ikke andre lagrede planer. Ingen av beregningene sendes til en kalkulatortjener. Nettstedets driftsleverandør kan behandle vanlig trafikkmetadata.

## Bidra

Gjennomgå helst beregninger, numeriske grensetilfeller, tilgjengelighet og mobilflyt før nye funksjoner legges til. Nye finansielle modeller må dokumentere forutsetningene og ha uavhengige kontrollberegninger. Ikke endre en brukers innstillinger stille ved nivåbytte.

Koden er åpen kildekode under [MIT-lisensen](LICENSE). Se [bidragsveiledningen](CONTRIBUTING.md).

## GitHub Pages

Under Settings → Pages velger prosjekteieren **GitHub Actions** som Source.
Åpne deretter Actions → Test and publish Spareverksted → Run workflow → main.
Arbeidsflyten tester beregningene, lager kodepakken og publiserer `dist/`.
Senere endringer på `main` publiseres automatisk når testene består.
Pull requests testes uten å publiseres. Nettsidens adresse vises i Pages-innstillingene
og i den vellykkede publiseringsjobben. Eget domene kan settes i Pages-innstillingene.

## Startguide og eksport

Nye besøkende velger spareutvikling eller sparemål. Alder og risikovalget er valgfrie. 67 år er et redigerbart forslag, ikke en påstand om individuell pensjonsalder. En delt plan åpnes direkte. Startguiden kan åpnes igjen med Startvalg.

Glidere er snarveier; egne tall kan være høyere enn gliderens utgangspunkt. Eksportene er øyeblikksbilder. XLSX inneholder numeriske celler og flere ark, ikke levende formler. CSV følger aktivt verktøy. PDF opprettes gjennom nettleserens utskrift. JSON inneholder gjeldende plan, ikke alle andre lokalt lagrede planer.

## Spør om sparing

`dist/spor.html` er en gratis, lokal veileder med syv temaer og 28 eksempelspørsmål. `veileder-engine.js` ruter spørsmål og setter sammen forhåndsskrevne forklaringer fra eksplisitte skjemavalg. `veileder-ui.js` viser temaer, forutsetninger og kilder. Ukjente spørsmål gir temavalg, ikke et oppdiktet svar. Endrede opplysninger fjerner den gamle vurderingen til brukeren ber om et nytt svar.

Veilederen henter ikke opplysninger fra kalkulatoren, lagrer ikke spørsmål eller profil og bruker ingen eksterne API-er. Frie spørsmål brukes bare til å finne tema. Eksempelspørsmål innen samme tema har samme grunnsvar. Ingen bestemt fondsandel, navngitte fond eller personlige kjøpsanbefalinger foreslås. Satser og detaljregler for IPS omfattes ikke. Se `research/veileder-kilder.md` for kilder, avgrensninger og vedlikehold.

Kontroll av svarlogikken:

```sh
node tests/veileder.test.cjs
```

Valgfri nettleserkontroll med Playwright installert, mens lokal server kjører på port 8000:

```sh
node tests/veileder-browser.cjs
```
