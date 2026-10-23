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
- `tests/validation.test.cjs`: feltgrenser og feltnavn, sparemål, uttaksfelt, delte lenker felt for felt, gamle lagrede planer og realistiske planer mot lukket formel.
- `tests/input-browser.cjs`: nettleserflyt med ugyldige tall (krever playwright): blokkert deling, lagring og eksport med fokus på feltet, dempede resultater, delte lenker, sparemål, uttak og gamle lagrede planer.

## Kontroller beregningene

Med Node.js installert:

```sh
node tests/engine.test.cjs
node tests/tax-export.test.cjs
node tests/validation.test.cjs
```

Testene dekker 200 deterministisk genererte spareplaner, nødvendig månedssparing, null rente, svært lange perioder, 32 kombinasjoner av uttaksvalg og mål-alternativer.

## Viktige modellvalg

Effektiv nominell avkastning før kostnader. Netto årlig vekstfaktor er `(1 + avkastning) * (1 - kostnad)`. Innskudd ved månedsslutt. Årlig endring i månedssparingen (positiv eller negativ) fordeles jevnt over månedene. Uttak skjer én gang ved slutten av hvert år. Inflasjonsøkning på ordinært årsuttak starter i år 2. Ekstrauttak kommer etter vanlig uttak i valgt år.

Spareutviklingen er før skatt. Et separat skatteanslag for uttak bruker enten forenklet ASK med oppgitt gjenstående innskudd og kjent skjerming, eller en brukerdefinert fast skattepliktig andel. Ingen ny skjerming, løpende bankbeskatning, IPS, BSU eller formuesskatt er modellert. Scenarioavvik er en følsomhetsanalyse, ikke et sannsynlighetsintervall. Modellen bruker ikke Monte Carlo. Kildestatistikk er datert 20. oktober 2026 og oppdateres ikke automatisk.

## Regneeksempel og risikoscenario

Forventet årlig vekst, prisvekst og bankrente er minst 0 % i de vanlige beregningene. Det betyr ikke at investeringer ikke kan tape verdi: enkelte år kan gi store tap. Mulige tap vises som risikoscenarioer, ikke som forventningen: «Børsfall», lavere vekst i båndet og stresstestene i Sparemål kan gi negative utfall. Når sluttbeløpet er lavere enn summen av innskuddene, for eksempel på grunn av kostnader eller børsfall, viser siden tapet tydelig («Tap mot innskuddene»). Tapet i kroner er alltid oppgitt i vanlige kroner, også i visningen med dagens kroner, og det står. I visningen med dagens kroner vises innskuddene også i dagens kroner: hvert innskudd regnes om med prisnivået da det ble satt inn, slik at startbeløpet beholder sin verdi. Innskudd og vekst summerer seg da til sluttbeløpet, og det faktiske kronebeløpet du setter inn står under. Er sluttbeløpet i dagens kroner lavere enn innskuddene i dagens kroner, kalles det «Tapt kjøpekraft». Har du også tapt penger i kroner, heter forskjellen «Samlet tap i dagens kroner», og teksten sier at den skyldes både tapet i kroner og prisveksten. Har sluttbeløpet ikke holdt følge med prisveksten på innskuddene, vises det som lavere kjøpekraft, ikke som tap i kroner. Verdien av et fond blir aldri negativ i modellen; et fall på 100 % gir 0 kr. Eldre lenker og lagrede planer med negative verdier i disse feltene settes til 0 %, og brukeren får beskjed om hva som er endret.

## Lagring og deling

Planer lagres lokalt i nettleseren under `sv-scenarios`. En delt lenke inneholder skjemaverdiene og visningsnivået, men ikke andre lagrede planer. Når en lenke åpnes, kontrolleres hvert felt for seg. Ugyldige felt får standardverdi, gyldige beholdes, og brukeren får beskjed om hvilke felt som er endret. Lagrede planer kontrolleres på samme måte når de åpnes.

Grensene for alle tallfelt står i én oversikt i `dist/engine.js`. Deling, lagring og eksport kontrollerer alle felt som følger med planen og beregningen i aktiv modul (sparing, sparemål eller uttak). Ved feil flyttes fokus til feltet, og feltet kobles til feilmeldingen med `aria-describedby`. Ingen av beregningene sendes til en kalkulatortjener. Nettstedets driftsleverandør kan behandle vanlig trafikkmetadata.

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

`dist/spor.html` gir et kort svar med to alternativer. Hvert alternativ har grønne fordeler og røde ulemper som er lukket fra start. Ett trykk åpner hele listen med forklaringer. Hvert kort har minst to fordeler, to ulemper og en linje om når valget passer dårlig. Utfyllende vurdering viser først maksimalt tre seksjoner, med resten bak «Vis flere». Kontrolldatoen vises uten å åpne kildene. Ett klikk på et tema viser svaret; søk viser det høyest rangerte temaet med eventuelle alternativer. Tall i friteksten blir ikke tolket.

- `veileder-facts.js`: felles faktatall med regelår, kontrolldato og primærkilde.
- `veileder-engine.js`: temaruting, relevansregler, spørsmålsforslag og utfyllende forklaringer.
- `veileder-cards.js`: korte sammenligninger og situasjonsbestemte forbehold.
- `veileder-context.js`: validering av samme-fane-kontekst, uten nettverkskall.
- `veileder-bridge.js`: overfører oppgitt alder, aktuell sparetid og eksplisitt risikovalg fra kalkulatoren ved navigering.
- `veileder-ui.js`: direkte temavalg, lukkede fordeler/ulemper og valgfrie opplysninger.

Veilederen bruker fanens `sessionStorage` under `sv-guidance-tab-v2`, uten navn, kontoinformasjon, sparebeløp eller fritekst. Opplysninger som mangler i kalkulatoren, fylles ikke fra standardverdier. Kalkulatorens sparetid brukes ikke automatisk til barnesparing. Manuell sparetid lagres per tema. Ved vanlig retur til kalkulatoren gjenbrukes kjent alder, sparetid og risikovalg. En eksplisitt plan i lenken overstyres aldri av denne konteksten. Opplysningene kan glemmes fra veilederen. Dette endrer ikke kalkulatorens egne felt. Veilederen virker også når øktlagring er blokkert, men da kan opplysninger ikke følge mellom sidene.

Ingen eksterne KI-kall, bestemte aksjeandeler eller navngitte fondsanbefalinger. Svarene er generelle, med kildelenker og datoforbehold. Se `research/veileder-kilder.md` for bakgrunn og `research/ux-2026-10-22.md` for endringer, faktaliste og manuell testliste. Delingslenker fra kalkulatoren utelater alder, risikovalg og andre personlige profilvalg.

Kontroller logikk og overføring:

```sh
node tests/veileder.test.cjs
node tests/veileder-context.test.cjs
```

Valgfri nettleserkontroll med Playwright og Chromium installert. Testen starter og stopper sin egen lokale server. En eksisterende Chromium-binær kan angis med `SPARE_BROWSER`:

```sh
node tests/veileder-browser.cjs
```

