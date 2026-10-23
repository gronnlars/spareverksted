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
- `dist/assumptions.js`: forutsetninger per spareform, med kilder og kontrolldato.
- `dist/meaning.js`: regelbaserte forklaringer i «Dette betyr tallene dine», bygget på resultatet, valgt spareform og tidshorisont. Ren funksjon, testet i Node.
- `dist/export-kit.js`: CSV og ekte XLSX (OOXML i ZIP), uten eksterne biblioteker.
- `dist/experience.js`: nivåtilpasset hjelp, maler og utskriftsrapport.
- `dist/style.css`: responsiv utforming og utskriftsstil.
- `dist/index.html`: sidens struktur.
- `tests/engine.test.cjs`: uavhengig kontroll mot månedlige og årlige løkker.
- `tests/validation.test.cjs`: feltgrenser og feltnavn, sparemål, uttaksfelt, delte lenker felt for felt, gamle lagrede planer og realistiske planer mot lukket formel.
- `tests/results.test.cjs`: kontrolltilfellene A til D mot en uavhengig månedsløkke, årsak til tap (kostnader, børsfall), kjøpekraft, lange perioder og forskjellen mellom innskudd ved månedsslutt og månedsstart.
- `tests/band.test.cjs`: utfallsrommet for indeksfond mot Finans Norges formel, med lukket formel og egen løkke.
- `tests/a11y-browser.cjs`: tilgjengelighet i Chromium i alle tre temaer: kontrast (også grafens tekst og linjer), trykkflater (WCAG 2.5.8), navn på kontroller, reflow ved 320 og 640 px, synlig fokus, korte skjermer og hele flyten med bare tastatur. Erstatter ikke kontroll i Safari, Firefox eller med skjermleser.
- `tests/roundtrip-browser.cjs`: hele planen beholdes til og fra «Spør om sparing», med lenke og tilbakeknapp; endringer i veilederen går til riktig felt; delte lenker vinner.
- `tests/meaning.test.cjs`: forklaringene følger tallene (0 % rente, 0 % prisvekst, negativ avkastning, fallende prisnivå, løpende innbetalinger), spareformen gjettes aldri og endrer ingen tall.
- `tests/startflyt-browser.cjs` og `tests/spareform-browser.cjs`: startflyt, tomme felt, spareform, forklaringen ved resultatet og kroner mot kjøpekraft i grafen.
- `tests/input-browser.cjs`: nettleserflyt med ugyldige tall (krever playwright): blokkert deling, lagring og eksport med fokus på feltet, dempede resultater, delte lenker, sparemål, uttak og gamle lagrede planer.

## Kontroller beregningene

Med Node.js installert:

```sh
node tests/engine.test.cjs
node tests/tax-export.test.cjs
node tests/validation.test.cjs
node tests/results.test.cjs
```

Testene dekker 200 deterministisk genererte spareplaner, nødvendig månedssparing, null rente, svært lange perioder, 32 kombinasjoner av uttaksvalg og mål-alternativer.

## Viktige modellvalg

Effektiv nominell avkastning før kostnader. Netto årlig vekstfaktor er `(1 + avkastning) * (1 - kostnad)`. Innskudd ved månedsslutt. Årlig endring i månedssparingen (positiv eller negativ) fordeles jevnt over månedene. Uttak skjer én gang ved slutten av hvert år. Inflasjonsøkning på ordinært årsuttak starter i år 2. Ekstrauttak kommer etter vanlig uttak i valgt år.

Beløp i tekst og resultatkort følger én regel: fra 1 milliard forkortes de («433,73 milliarder kr»), under det vises hele kroner. Tabellvisningen viser eksakte beløp.

Spareutviklingen er før skatt. Et separat skatteanslag for uttak bruker enten forenklet ASK med oppgitt gjenstående innskudd og kjent skjerming, eller en brukerdefinert fast skattepliktig andel. Ingen ny skjerming, løpende bankbeskatning, IPS, BSU eller formuesskatt er modellert. Båndet i grafen har to betydninger. Uten indeksfond viser det lavere og høyere vekst (valgt avkastning ± et antall prosentpoeng): en følsomhetsanalyse, ikke et sannsynlighetsintervall. Med indeksfond valgt viser det lavere og høyere scenario beregnet med Finans Norges formelverk (se under), der årsavkastningen antas normalfordelt. Det er en forenklet modell, ikke en simulering. Modellen bruker ikke Monte Carlo. Kildestatistikk er datert 20. oktober 2026 og oppdateres ikke automatisk.

## Regneeksempel og risikoscenario

Prisvekst og bankrente er minst 0 %. Antatt årlig vekst kan skrives inn som negativ, ned til (men ikke med) −100 %: modellen gjør årsveksten om til månedsvekst med `(1 + r)^(1/12)`, som er definert for alle r over −100 %. Glidebryteren starter på 0 %. Negativ vekst gjennom hele perioden og et enkelt «Børsfall» er forskjellige forutsetninger og nevnes hver for seg i forklaringen. Lavere vekst i båndet og stresstestene i Sparemål er risikoscenarioer, ikke forventninger. Når sluttbeløpet er lavere enn summen av innskuddene, for eksempel på grunn av kostnader eller børsfall, viser siden tapet tydelig («Tap mot innskuddene»). Tapet i kroner er alltid oppgitt i vanlige kroner, også i visningen med dagens kroner, og det står. I visningen med dagens kroner vises innskuddene også i dagens kroner: hvert innskudd regnes om med prisnivået da det ble satt inn, slik at startbeløpet beholder sin verdi. Innskudd og vekst summerer seg da til sluttbeløpet, og det faktiske kronebeløpet du setter inn står under. Er sluttbeløpet i dagens kroner lavere enn innskuddene i dagens kroner, kalles det «Tapt kjøpekraft». Har du også tapt penger i kroner, heter forskjellen «Samlet tap i dagens kroner», og teksten sier at den skyldes både tapet i kroner og prisveksten. Har sluttbeløpet ikke holdt følge med prisveksten på innskuddene, vises det som lavere kjøpekraft, ikke som tap i kroner. Verdien av et fond blir aldri negativ i modellen; et fall på 100 % gir 0 kr. Eldre lenker og lagrede planer med negativ prisvekst eller bankrente settes til 0 %, og brukeren får beskjed om hva som er endret. Negativ vekst beholdes.

Vekst, prisvekst og kostnad er forhåndsutfylte startverdier (5 %, 2,5 % og 0,2 %), ikke anbefalinger, og de passer ikke for alle spareformer. En kort tekst over feltene sier hvilke som fortsatt står på startverdien, og om beløp og tid er eksempeltall. Et tomt felt er ikke 0: mens feltet redigeres står siste resultat igjen, dempet, med «Resultatet er ikke oppdatert». Forlates feltet tomt, vises en feilmelding.

## Spareform og «Dette betyr tallene dine»

Brukeren kan velge brukskonto, sparekonto eller indeksfond under «Hva vil du regne på?». Valget er frivillig. Et valg setter synlige forutsetninger i feltene, med en melding og «Angre» (beslutning 23.10.2026). Kilder og kontrolldato ligger samlet i `dist/assumptions.js`:

- Brukskonto: 0 % rente og 0 % kostnad. Et regneeksempel; SSB har ingen egen serie for brukskontorente.
- Sparekonto: 2,87 % rente og 0 % kostnad: gjennomsnittet for husholdningers innskudd uten binding (SSB tabell 11018, august 2026). Ikke beste tilgjengelige rente.
- Indeksfond: 4,5 % forventet realavkastning for aksjer pluss planens prisvekst (Finans Norge, Avtale om avkastningsprognoser, revidert 04.02.2026). Kostnaden er uendret. Grafen viser lavere og høyere scenario beregnet med Finans Norges formelverk: hvert innskudd får årlig avkastning r ± 1,96 · 16 % / √(år til slutt). Kort sparetid gir derfor større usikkerhet i snittavkastningen. Den nedre delen av utfallsrommet sammenlignes med innskuddene i samme kroneverdi: kroner mot kroner, og dagens kroner mot innskuddene i dagens kroner. Ligger den over i kroner, men under i dagens kroner, sies begge deler. Ved grafen vises én linje i kroneverdien grafen viser, bare når nedre del ligger under innskuddene.

Å fjerne valget endrer ingen tall. Brukeren kan alltid skrive egne tall etterpå. Tallene i `dist/assumptions.js` kontrolleres etter Finans Norges årlige revisjon og når SSB publiserer nye renter.

«Start på nytt» åpner startguiden med standardverdiene. Går brukeren videre, nullstilles hele planen (også børsfall, ekstrainnskudd og spareform), og det kan angres. «Tilbake til planen» endrer ingenting.

Seksjonen «Dette betyr tallene dine» står rett etter resultatet. Den viser én kort forklaring og samler utdypingen i tre grupper: innbetalinger og avkastning, kroner og kjøpekraft, og forutsetninger. Kjøpekraft måles mot innskuddene i dagens kroner, regnet om med prisnivået da hvert innskudd ble satt inn. Teksten oppdateres når et felt forlates eller en skyveknapp slippes, ikke ved hvert tastetrykk, og har ingen automatisk opplesning. Ingen regel kaller en rente «uvanlig», fordi det krever en dokumentert og vedlikeholdt referanse.

Grafen kan vise beløpet i kroner, kjøpekraften i dagens kroner, eller begge. I «Begge» vises bare beløpet i to målestokker; innskudd, bank og bånd vises i de andre visningene, slik at linjer med ulikt grunnlag ikke sammenlignes. Linjene skilles med linjestil, og tekstalternativet oppgir sluttverdiene.

## Lagring og deling

Planer lagres lokalt i nettleseren under `sv-scenarios`. En delt lenke inneholder skjemaverdiene og visningsnivået, men ikke andre lagrede planer. Når en lenke åpnes, kontrolleres hvert felt for seg. Ugyldige felt får standardverdi, gyldige beholdes, og brukeren får beskjed om hvilke felt som er endret. Lagrede planer kontrolleres på samme måte når de åpnes.

Når brukeren går fra kalkulatoren til «Spør om sparing», lagres hele planen i fanens `sessionStorage` (`sv-working-plan-v1`). Kommer brukeren tilbake i samme fane, hentes planen tilbake og kontrolleres som en lagret plan. Bare alder, sparetid og risikovalg som er endret i veilederen, legges oppå; sparetiden går til sparemålets periode når sparemål var åpent. En delt lenke vinner alltid over planen i fanen. Planen forsvinner når fanen lukkes, og fjernes når brukeren går tilbake til startskjermen.

Grensene for alle tallfelt står i én oversikt i `dist/engine.js`. Deling, lagring og eksport kontrollerer alle felt som følger med planen og beregningen i aktiv modul (sparing, sparemål eller uttak). Ved feil flyttes fokus til feltet, og feltet kobles til feilmeldingen med `aria-describedby`. Ingen av beregningene sendes til en kalkulatortjener. Nettstedets driftsleverandør kan behandle vanlig trafikkmetadata.

## Bidra

Gjennomgå helst beregninger, numeriske grensetilfeller, tilgjengelighet og mobilflyt før nye funksjoner legges til. Nye finansielle modeller må dokumentere forutsetningene og ha uavhengige kontrollberegninger. Ikke endre en brukers innstillinger stille ved nivåbytte.

## Lisens og en vennlig oppfordring

Koden er åpen kildekode under [MIT-lisensen](LICENSE). Du kan bruke, endre og dele den fritt, også kommersielt. Se [bidragsveiledningen](CONTRIBUTING.md).

**Bruker du Spareverksted kommersielt**, ber vi deg gi et fast beløp hvert år til en organisasjon som hjelper mennesker, dyr eller natur. Du velger selv organisasjon og beløp. Lisensen krever det ikke, men vi regner med at du gjør det.

Bruker du det privat, er du like velkommen uten å gi noe.

## GitHub Pages

Under Settings → Pages velger prosjekteieren **GitHub Actions** som Source.
Åpne deretter Actions → Test and publish Spareverksted → Run workflow → main.
Arbeidsflyten tester beregningene, lager kodepakken og publiserer `dist/`.
Senere endringer på `main` publiseres automatisk når testene består.
Pull requests testes uten å publiseres. Nettsidens adresse vises i Pages-innstillingene
og i den vellykkede publiseringsjobben. Eget domene kan settes i Pages-innstillingene.

## Startguide og eksport

Nye besøkende velger spareutvikling eller sparemål. Alder er valgfri. Risikovalget er ikke med i startguiden, fordi det ikke endrer beregningen. Det kan oppgis under «Tilpass veiledningen» og i Spør om sparing, og brukes i sparemål og veileder. Det endrer aldri antatt vekst. 67 år er et redigerbart forslag, ikke en påstand om individuell pensjonsalder. En delt plan åpnes direkte. Startguiden kan åpnes igjen med Startvalg.

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


### Avgrensning av tilgjengelighetskontrollen

Resultatet omtales som «ingen avvik funnet i de gjennomførte kontrollene». Den egenutviklede Chromium-kontrollen dokumenterer ikke full WCAG-samsvar. Faktisk tekstforstørring, iPhone Safari og skjermlesere må kontrolleres manuelt før fase 2 avsluttes.

Utfallsbåndet har stiplede kantlinjer fra før. Fyllflaten er ikke eneste markør for intervallet. Kantlinjene kontrolleres mot både panelbakgrunnen, båndets fyll og det overlappende arealfyllet, med minst 3:1 kontrast. Natt-temaet har mørkere båndfyll. «Før skatt på uttak» er minst 14 px ved vanlig tekststørrelse; etiketter og forbehold under utfallene er minst 13 px.
