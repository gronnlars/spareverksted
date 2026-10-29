# Spareverksted

En sparekalkulator med enkel inngang og mer detaljer etter behov.
Ren HTML, CSS og JavaScript. Ingen installasjon, database eller brukerinnlogging.

## Gjeldende rammer

**Prosjektet er på vent** til Finanstilsynet har svart og alt er klarert. Les [AGENTS.md](AGENTS.md) og [docs/regulatorisk.md](docs/regulatorisk.md) før du gjør noe. Ikke start arbeid uten uttrykkelig beskjed fra Lars. Pausen gjelder ikke kildekrav, universell utforming, personvern, nøytrale spørsmål og svar om økonomiske begreper og retting av opplagte lovbrudd. Grensene står i regulatorisk.md under «Områder pausen ikke gjelder».

**Sparekalkulatoren er fryst** (24.10.2026). Endringer krever en dokumentert regnefeil, en alvorlig brukshindring, en nødvendig kildeoppdatering eller en tilgjengelighetsfeil. Se [research/plan.md](research/plan.md), punkt 0.

Denne README-en beskriver hvordan siden er bygget. Den gir ingen åpning for nytt arbeid. README-en skal gjennomgås samlet når prosjektet tas fullt opp igjen.

## Universell utforming

Målet er WCAG 2.2 nivå AA på hele nettstedet, også for nye deler fra første utkast. Om forskriften om universell utforming av IKT gjelder for Spareverksted, er ikke avklart. Spørsmålet ble sendt til Uu-tilsynet 25.10.2026 og er ikke besvart.

Slik kontrolleres tilgjengeligheten:

- **Automatisk, ved hver endring:** `tests/a11y-browser.cjs` sjekker i Chromium kontrast, trykkflater, navn på kontroller, reflow ved 320 og 640 px, synlig fokus og flyt med bare tastatur, i alle tre fargetemaer. Noen brukerflyter kjøres også i Firefox og WebKit. WebKit er ikke det samme som Safari på iPhone.
- **Kodevalidering:** W3C Nu HTML Checker mot de publiserte sidene. Validering direkte fra nettadressen kontrollerer HTML-en som serveres. Dynamisk innhold kontrolleres ved å validere ferdig rendret HTML.
- **Manuelt:** gjennomgang i Chromium 23.10.2026, Lars' første test med VoiceOver og zoom på iPhone 27.10.2026 (personvernsiden) og en uformell test med skjermleser av en ekstern tester 28.10.2026.

Gjenstår å kontrollere manuelt:

- Hele kalkulatoren og veilederen med VoiceOver, og NVDA på PC.
- Alle sider i Safari på iPhone og i Firefox.
- Grafbeskrivelsene som kom etter skjermlesertesten, med skjermleser.
- Meldinger som forsvinner av seg selv, for brukere som trenger mer tid.
- Tester med flere brukere som er avhengige av hjelpemidler, og de delene av WCAG som ikke kan testes automatisk.

Beståtte automatiske tester betyr «ingen avvik funnet i de gjennomførte kontrollene». De dokumenterer ikke full tilgjengelighet, samsvar med WCAG eller at folk forstår innholdet.

Les mer: [tilgjengelighetssiden](dist/tilgjengelighet.html) (publisert som spareverksted.no/tilgjengelighet.html), [research/universell-utforming.md](research/universell-utforming.md) med krav, valg og kontrolltabell, og [research/uu-egenkontroll-uutilsynet.md](research/uu-egenkontroll-uutilsynet.md).

## Personvern

- **Lokal beregning.** Beregningene gjøres i nettleseren. Ingen innlogging, reklame eller statistikkverktøy. Nettstedets egen kode har ingen kall som sender det brukeren skriver inn, ingen eksterne skript, stiler eller skrifter og ingen informasjonskapsler. Dette er kontrollert i kildekoden og med `tests/personvern-browser.cjs` mot en lokal kopi, ikke med en nettverkslogg fra den publiserte siden.
- **Lagring bare ved bestemte handlinger.** Å åpne en side eller en delt lenke lagrer ingenting. «Lagre plan» lagrer planen i nettleseren til brukeren sletter den. Arbeidsplanen, opplysningene til veilederen, visningsnivå, fargetema og startmerket huskes bare i nettleserfanen, og bare når brukeren gjør noe som krever det. Lagringen er ikke kryptert.
- **Sletting.** Én plan kan slettes under «Mine planer». Knappen på personvernsiden sletter lagrede planer i hele nettleseren og det som er lagret i den samme fanen, men ikke kopier i andre åpne faner. «Glem opplysningene mine» i veilederen sletter veilederens opplysninger. Nettleserens egne innstillinger kan også slette alt.
- **Delte lenker.** Tallene står etter `#` og sendes ikke i selve HTTP-forespørselen, men tjenesten lenken deles gjennom, kan se hele lenken.
- **GitHub Pages.** GitHub logger besøkendes IP-adresser av sikkerhetshensyn. Spareverksted har ikke tilgang til loggene og vet ikke hvor lenge de lagres.
- **E-post** er en egen behandling, atskilt fra kalkulatoren. Domene.no lagrer e-postkassene, Lars leser i Gmail-appen, og svar går ut via MailChannels. Det finnes ennå ingen fast regel for hvor lenge e-post beholdes, og ansvarsfordelingen med leverandørene er ikke avklart.
- **Ubesvarte spørsmål.** Om fanelagring av visningsnivå og fargetema er nok etter ekomloven § 3-15, er spurt Nkom om. Svaret er ikke kommet.

Les mer: [personvernsiden](dist/personvern.html) (publisert som spareverksted.no/personvern.html) og den tekniske kartleggingen med fil og linje i [docs/personvern-lagring.md](docs/personvern-lagring.md). Merk at [docs/kontakt-epost.md](docs/kontakt-epost.md) er en historisk logg med utdatert innledning; det nye oppsettet er dokumentert lenger nede. Fra 27.10.2026 er adressene egne e-postkasser hos Domene.no, slik personvernsiden beskriver.

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
- `tests/personvern-browser.cjs`: i Chromium, Firefox og WebKit: ingen lagring ved lasting eller delt lenke, nivå bare ved eget valg, sletting, ingen gjenoppstått plan fra en annen fane, ingen cookies og ingen forespørsler til andre domener.
- `tests/kontakt-browser.cjs`: i Chromium, Firefox og WebKit: kontaktknappene viser adressen først ved trykk, kopiering bare ved eget trykk, tastatur, fallback ved blokkert utklippstavle, ingen komplett adresse i HTML.
- `scripts/produksjonskontroll.cjs`: observerer forespørsler, cookies og lagring i en ren nettleser (`--local` mot `dist/`, eller en https-adresse). Brukes på en maskin med tilgang til den publiserte siden. Se docs/personvern-lagring.md.
- `tests/personvern-lagring.test.cjs`: hva som lagres og når, at veilederbroen bare skriver ved tur til veilederen, og at slettingen bare rører Spareverksteds egne nøkler.
- `tests/validation.test.cjs`: feltgrenser og feltnavn, sparemål, uttaksfelt, delte lenker felt for felt, gamle lagrede planer og realistiske planer mot lukket formel.
- `tests/results.test.cjs`: kontrolltilfellene A til D mot en uavhengig månedsløkke, årsak til tap (kostnader, børsfall), kjøpekraft, lange perioder og forskjellen mellom innskudd ved månedsslutt og månedsstart.
- `tests/band.test.cjs`: utfallsrommet for indeksfond mot Finans Norges formel, med lukket formel og egen løkke.
- `tests/a11y-browser.cjs`: tilgjengelighet i Chromium i alle tre temaer: kontrast (også grafens tekst og linjer), trykkflater (WCAG 2.5.8), navn på kontroller, reflow ved 320 og 640 px, synlig fokus, korte skjermer og hele flyten med bare tastatur. Erstatter ikke kontroll i Safari, Firefox eller med skjermleser.
- `tests/roundtrip-browser.cjs`: hele planen beholdes til og fra «Spør om sparing», med lenke og tilbakeknapp; endringer i veilederen går til riktig felt; delte lenker vinner.
- `tests/meaning.test.cjs`: forklaringene følger tallene (0 % rente, 0 % prisvekst, negativ avkastning, fallende prisnivå, løpende innbetalinger), spareformen gjettes aldri og endrer ingen tall.
- `tests/startflyt-browser.cjs` og `tests/spareform-browser.cjs`: startflyt, tomme felt, spareform, forklaringen ved resultatet og kroner mot kjøpekraft i grafen.
- `tests/input-browser.cjs`: nettleserflyt med ugyldige tall (krever playwright): blokkert deling, lagring og eksport med fokus på feltet, dempede resultater, delte lenker, sparemål, uttak og gamle lagrede planer.

## Tester

Fasiten for hvilke tester som kjøres, er arbeidsflyten [.github/workflows/static.yml](.github/workflows/static.yml). Den kjører på hver pull request og før publisering fra main. Filene som nevnes i denne README-en, er et utvalg, ikke en fullstendig liste.

Forutsetninger:

- Node-testene (`tests/*.test.cjs`) krever bare Node.js. Arbeidsflyten bruker Node 22.
- Nettlesertestene (`tests/*-browser.cjs`) krever Playwright med nettlesere installert. Arbeidsflyten bruker Playwright 1.56.0. Testene starter og stopper sin egen lokale server. De kjører i Chromium som standard. Noen kan kjøres i Firefox eller WebKit med `SPARE_ENGINE=firefox` eller `SPARE_ENGINE=webkit`, og mange kan bruke en eksisterende Chromium-binær via `SPARE_BROWSER`. Se arbeidsflyten for hvilke som kjøres i hvilken motor.

Eksempel:

```sh
node tests/engine.test.cjs
node tests/validation.test.cjs
node tests/results.test.cjs
SPARE_ENGINE=firefox node tests/deling-browser.cjs
```

Beregningstestene dekker blant annet 200 deterministisk genererte spareplaner, nødvendig månedssparing, null rente, svært lange perioder, 32 kombinasjoner av uttaksvalg og mål-alternativer. Grønne tester beviser ikke full tilgjengelighet eller brukerforståelse.

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

Seksjonen «Dette betyr tallene dine» står rett etter resultatet. Den viser én kort forklaring og samler utdypingen i tre grupper: innbetalinger og avkastning, kroner og kjøpekraft, og forutsetninger. Kjøpekraft måles mot innskuddene i dagens kroner, regnet om med prisnivået da hvert innskudd ble satt inn. Teksten oppdateres etter 0,5 sekunders skrivepause og når et felt forlates eller en skyveknapp slippes, ikke ved hvert tastetrykk (se BESLUTNINGER.md, 29.10.2026). Mens den venter, står forrige tekst igjen dempet. Teksten har ingen automatisk opplesning. Ingen regel kaller en rente «uvanlig», fordi det krever en dokumentert og vedlikeholdt referanse.

Grafen kan vise beløpet i kroner, kjøpekraften i dagens kroner, eller begge. I «Begge» vises bare beløpet i to målestokker; innskudd, bank og bånd vises i de andre visningene, slik at linjer med ulikt grunnlag ikke sammenlignes. Linjene skilles med linjestil, og tekstalternativet oppgir sluttverdiene.

## Lagring og deling

Spareverksted lagrer ingenting før brukeren gjør noe. Det finnes tre ulike ting, og de må ikke blandes:

- **Lagrede planer** (`localStorage`, `sv-scenarios`): bare når brukeren trykker «Lagre plan». Inneholder navn og alle tall. Blir liggende til planen slettes. `localStorage` har ingen innebygd utløpstid, men nettleseren kan fjerne data.
- **Arbeidsplanen** (`sessionStorage`, `sv-working-plan-v1`): hele planen med beløp. Opprettes bare når brukeren går fra kalkulatoren til «Spør om sparing», og oppdateres deretter når kalkulatorsiden forlates. Kommer brukeren tilbake i samme fane, hentes planen tilbake og kontrolleres som en lagret plan. Bare alder, sparetid og risikovalg som er endret i veilederen, legges oppå; sparetiden går til sparemålets periode når sparemål var åpent. En delt lenke vinner alltid over planen i fanen. Planen fjernes når brukeren går tilbake til startskjermen.
- **Veilederkonteksten** (`sessionStorage`, `sv-guidance-tab-v2`): alder, sparetid, risikovalg og valgene i veilederen. Ingen beløp, navn eller fritekst. Se avsnittet om veilederen under.

`sessionStorage` forsvinner vanligvis når fanen lukkes, men nettlesere som gjenoppretter faner, kan gjenopprette den. Lovet sletting ved lukking står derfor ikke i produktteksten.

Andre valg: fargetema (`sessionStorage`, `sv-color-theme`) og visningsnivå (`sessionStorage`, `sv-level`) huskes bare i fanen, og bare når brukeren selv trykker på tema eller velger Utforsk eller Avansert. De følger ikke med til neste besøk eller en ny fane, men nettleseren kan gjenopprette fanen. Gamle permanente verdier fjernes. «Enkel» er standard og lagres ikke, og automatiske tilbakestillinger lagrer ingenting. At brukeren har trykket seg videre fra startguiden, huskes bare i fanen (`sessionStorage`, `sv-started`). Å åpne siden eller en delt lenke skriver ingenting. Den gamle permanente nøkkelen `sv-started` i `localStorage` fjernes ved neste besøk.

Siden `personvern.html` viser dette for brukeren og har en knapp som sletter alle nøklene over, og bare dem. Den når `localStorage` for hele nettstedet, men bare `sessionStorage` i sin egen fane. Andre åpne faner leser planene på nytt når de endres (`storage`-hendelsen), så slettede planer skrives ikke tilbake. E-postkontakt er en egen behandling: se [docs/kontakt-epost.md](docs/kontakt-epost.md). Delen av en delt lenke etter `#` sendes ikke i selve HTTP-forespørselen, men sidens skript leser den, og tjenester du deler lenken gjennom kan se den. Full kartlegging med fil og linje står i [docs/personvern-lagring.md](docs/personvern-lagring.md).

En delt lenke inneholder skjemaverdiene og visningsnivået etter `#`, men ikke alder, risikovalg eller andre lagrede planer. Delen etter `#` sendes ikke til nettstedet i HTTP-forespørselen. Når en lenke åpnes, kontrolleres hvert felt for seg. Ugyldige felt får standardverdi, gyldige beholdes, og brukeren får beskjed om hvilke felt som er endret. Lagrede planer kontrolleres på samme måte når de åpnes.

Grensene for alle tallfelt står i én oversikt i `dist/engine.js`. Deling, lagring og eksport kontrollerer alle felt som følger med planen og beregningen i aktiv modul (sparing, sparemål eller uttak). Ved feil flyttes fokus til feltet, og feltet kobles til feilmeldingen med `aria-describedby`. Nettstedets egen kode har ingen nettverkskall (ingen `fetch`, XHR, `sendBeacon`, WebSocket eller skjema som sendes), ingen eksterne skript, stiler eller skrifter og ingen informasjonskapsler. Dette er kontrollert i kildekoden, ikke i en nettverkslogg fra den publiserte siden. Nettleverandøren (GitHub Pages) logger IP-adresser av sikkerhetshensyn.

## Bidra

Les «Gjeldende rammer» øverst først. Når arbeid er åpnet: gjennomgå helst beregninger, numeriske grensetilfeller, tilgjengelighet og mobilflyt før nye funksjoner legges til. Nye finansielle modeller må dokumentere forutsetningene og ha uavhengige kontrollberegninger. Ikke endre en brukers innstillinger stille ved nivåbytte.

## Lisens, opphav og viderebruk

Alle kan bruke den publiserte kalkulatoren gratis til egen økonomi og teste den for å gi tilbakemelding, også ansatte i kommersielle virksomheter. Egen sparing og avkastning er tillatt.

Fra 24. oktober 2026 tilbys nye originale bidrag etter commit `8392d9adb934533ceca9627a93b768c223a1b704` under PolyForm Noncommercial 1.0.0, med tilleggstillatelsen i [LICENSE](LICENSE). Kommersiell viderebruk av disse bidragene krever egen avtale med de aktuelle rettighetshaverne. Dette gjelder blant annet salg av tjenester, kommersiell integrasjon og markedsføring. En donasjon gir ingen kommersiell lisens. Kildekoden er tilgjengelig, men de nye vilkårene er ikke en åpen kildekode-lisens.

**Den tidligere kalkulatoren er fortsatt MIT-lisensiert.** Materialet til og med commiten ovenfor kan fortsatt brukes kommersielt under MIT, også når det inngår i en nyere utgave. Endringen trekker ikke tilbake tidligere tillatelser. Git-historikken skiller grunnlaget fra senere bidrag. Andres materiale følger sine egne vilkår; vi kan bare lisensiere rettigheter vi faktisk har.

Prosjektet er utviklet av Lars med hjelp fra ChatGPT og Claude, med innspill fra Gemini. KI er brukt i stor grad til kode, tekster, feilsøking og forslag. Svarene i veilederen skrives og kildekontrolleres før publisering. Kildekontrollen kan være utført med KI; menneskelig eller uavhengig fagkontroll oppgis bare når den er dokumentert. Ingen KI-modell lager svar under brukerens besøk. Se [PROVENANCE.md](PROVENANCE.md) for avgrensninger og kilder og [CONTRIBUTING.md](CONTRIBUTING.md) for nye bidrag. Gaver er frivillige og er aldri et vilkår for personlig bruk.

## GitHub Pages

Under Settings → Pages velger prosjekteieren **GitHub Actions** som Source.
Åpne deretter Actions → Test and publish Spareverksted → Run workflow → main.
Arbeidsflyten tester beregningene, lager kodepakken og publiserer `dist/`.
Senere endringer på `main` publiseres automatisk når testene består.
Pull requests testes uten å publiseres. Nettsidens adresse vises i Pages-innstillingene
og i den vellykkede publiseringsjobben. Eget domene kan settes i Pages-innstillingene.

## Startguide og eksport

Nye besøkende velger spareutvikling eller sparemål. Alder er valgfri. Risikovalget er ikke med i startguiden, fordi det ikke endrer beregningen. Det kan oppgis under «Tilpass veiledningen» og i Spør om sparing, og brukes i sparemål. I den publiserte veilederen styrer det ikke spørsmålsforslagene (se «Spør om sparing»). Det endrer aldri antatt vekst. 67 år er et redigerbart forslag, ikke en påstand om individuell pensjonsalder. En delt plan åpnes direkte. Startguiden kan åpnes igjen med Startvalg.

Glidere er snarveier; egne tall kan være høyere enn gliderens utgangspunkt. Eksportene er øyeblikksbilder. XLSX inneholder numeriske celler og flere ark, ikke levende formler. CSV følger aktivt verktøy. PDF opprettes gjennom nettleserens utskrift. JSON inneholder gjeldende plan, ikke alle andre lokalt lagrede planer.

## Spør om sparing

### Publisert nå

`dist/spor.html` viser tre svar: BSU, aksjesparekonto (ASK) og fondskonto. Utvalget ble vedtatt 29.10.2026 og styres av `dist/veileder-published.js`. Øvrige svar er tatt ut av visningen fordi de ikke er gjennomgått etter dagens regler. De er bevart som utkast i `research/svarutkast/`.

- Søk og spørsmålsforslag viser bare de tre publiserte svarene. Spørsmål som hørte til tilbaketrukne svar, gir ingen treff.
- Spørsmålsforslagene bygger ikke på opplysninger brukeren har oppgitt. De viser de andre publiserte svarene.
- Hvert svar viser dato for sist gjennomgått under overskriften, med varsel når det har gått mer enn 12 måneder.
- Form, presentasjon og kontroll før publisering følger [SVARMAL.md](SVARMAL.md), [SPRAKREGLER.md](SPRAKREGLER.md) og [KILDEREGLER.md](KILDEREGLER.md).

Siden sender ingenting til en KI-tjeneste. Ingen bestemte aksjeandeler eller navngitte fondsanbefalinger. Svarene er generelle, med kildelenker og datoforbehold.

### Kode som finnes, men ikke vises

Koden fra før utvalget ligger fortsatt i `dist/`, blant annet sammenligninger med to alternativer, relevansregler og spørsmålsforslag tilpasset alder, sparetid og risikovalg. Den er ikke tatt i bruk i den publiserte visningen. Å vise den igjen krever klarering etter [docs/regulatorisk.md](docs/regulatorisk.md) og Lars' godkjenning.

- `veileder-facts.js`: felles faktatall med regelår, kontrolldato og primærkilde.
- `veileder-engine.js`: temaruting, relevansregler, spørsmålsforslag og utfyllende forklaringer.
- `veileder-knowledge.js`: svarbasen, også svarene som er tatt ut av visningen.
- `veileder-sok.js`: søk og tolkning av spørsmål.
- `veileder-cards.js`: korte sammenligninger og situasjonsbestemte forbehold.
- `veileder-published.js`: publiseringsutvalget som avgrenser alt over til de tre svarene.
- `veileder-context.js`: validering av samme-fane-kontekst, uten nettverkskall.
- `veileder-bridge.js`: overfører oppgitt alder, aktuell sparetid og eksplisitt risikovalg fra kalkulatoren ved navigering.
- `veileder-ui.js`: visning, temavalg og panelet for valgfrie opplysninger.

Veilederen bruker fanens `sessionStorage` under `sv-guidance-tab-v2`, uten navn, kontoinformasjon, sparebeløp eller fritekst. Ved vanlig retur til kalkulatoren gjenbrukes kjent alder, sparetid og risikovalg. En eksplisitt plan i lenken overstyres aldri av denne konteksten. Veilederen virker også når øktlagring er blokkert, men da kan opplysninger ikke følge mellom sidene. Delingslenker fra kalkulatoren utelater alder, risikovalg og andre personlige profilvalg.

Merk: `research/veileder-kilder.md` og `research/ux-2026-10-22.md` beskriver veilederen slik den var før utvalget 29.10.2026.

### Avgrensning av tilgjengelighetskontrollen

Resultatet omtales som «ingen avvik funnet i de gjennomførte kontrollene». Den egenutviklede Chromium-kontrollen dokumenterer ikke full WCAG-samsvar. Faktisk tekstforstørring, iPhone Safari og skjermlesere må kontrolleres manuelt før fase 2 avsluttes.

Utfallsbåndet har stiplede kantlinjer fra før. Fyllflaten er ikke eneste markør for intervallet. Kantlinjene kontrolleres mot både panelbakgrunnen, båndets fyll og det overlappende arealfyllet, med minst 3:1 kontrast. Natt-temaet har mørkere båndfyll. «Før skatt på uttak» er minst 14 px ved vanlig tekststørrelse; etiketter og forbehold under utfallene er minst 13 px.

## Arbeidsgrunnlag og innhold

Start med [arbeidsreglene](AGENTS.md), [faseplanen](research/plan.md) og [spørsmålkøen](SPORSMALSKO.md). [Daglig oppgave](research/DAGLIG-OPPGAVE.md) gir avgrenset upublisert research. Kontrollert innholdspåfyll følger faseplanens punkt 6. Valgomaten venter.
