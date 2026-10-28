# Plan for Spareverksted

Én levende plan. Oppdateres her i stedet for nye planfiler. Samlet 24. oktober 2026 med main `968fa37` som kodegrunnlag. Eldre målinger nedenfor er historikk, ikke nye testresultater.

Redaksjonell arbeidskø ligger i [SPORSMALSKO.md](../SPORSMALSKO.md). Arbeidsinstruksen er [DAGLIG-OPPGAVE.md](DAGLIG-OPPGAVE.md). Denne filen sier hva som skal gjøres og i hvilken rekkefølge.

## 0. Sparekalkulatoren er fryst (24.10.2026)

Kalkulatoren er ferdig og er grunnmuren i Spareverksted.

- Ingen nye funksjoner, ingen ombygging, ingen kosmetisk finpuss.
- Endringer krever en av disse begrunnelsene: dokumentert regnefeil, alvorlig brukshindring, nødvendig kildeoppdatering (satser, renter, forutsetninger i `dist/assumptions.js`) eller tilgjengelighetsfeil.
- Gjenstående kontroller er kvalitetssikring. Funn som ikke faller inn under begrunnelsene over, parkeres.
- Nye ideer går til parkeringslisten (punkt 9). De får ikke automatisk plass i planen.
- Andre deler kan lenke til kalkulatoren med delingslenker som finnes i dag, uten å endre den.

Offentlig beskriver vi bare det vi kan dokumentere: hvilke beregninger som er uavhengig kontrollert, hvilke tester som kjøres, og hva som ikke er testet. Ingen påstander om å være best.

Universell utforming følger hele nettstedet. Krav, begrunnelser og gjennomførte kontroller står i `research/universell-utforming.md` og gjelder hver ny del fra første utkast.

Videre arbeid gjelder helheten rundt kalkulatoren: lære, finne svar, utforske og teste forståelsen.

## 1. Gjeldende rekkefølge og status

1. Samle arbeidsregler, beslutninger, faseplan og spørsmålkø på main. Denne dokumentasjonsleveransen gjør dette.
2. Deretter åpnes kontrollert innholdspåfyll etter punkt 6. Nattoppgaven fortsetter som upublisert research.
3. Valgomaten venter. Ingen implementering eller ny brukerflyt inngår i innholdspåfyllet.

Kodegrunnlag ved sammenstillingen: main `968fa37`, med ASK- og fondskontoforklaringer fra #61. Søket har også fått egne moduler og tester. Historiske kartlegginger i punkt 4 og den opprinnelige leveranseskissen i punkt 5 beskriver en eldre versjon og skal ikke brukes som dagens feilliste eller åpne oppgaver uten ny kontroll.

Lars melder at iPhone-visningen fungerer godt og at andre testere liker siden. Dette er nyttige brukerinnspill, men dokumenterer ikke VoiceOver, NVDA eller alle manuelle kontrollpunkter. Skjermlesertesting står åpen. Denne dokumentasjonsrunden kjører ingen nye nettleser- eller tilgjengelighetstester og erklærer ikke fase 2 fullført.

## 2. Fase 1: ferdig

Kriteriene er oppfylt: uavhengige kontrollberegninger, grensetilfeller, validering, lenker og lagrede planer er testet, og testene er grønne.

## 3. Fase 2: avsluttes som kvalitetssikring

Funn i denne runden rettes bare hvis de faller inn under begrunnelsene i punkt 0.

Kontrollert automatisk (Chromium, og hovedflyten også i Firefox og WebKit):
- Svaret vises straks etter startguiden, med «Før skatt» og forutsetningene. «Se graf» kommer før forklaringen.
- Navigasjon resultat, graf og felt. Feil i felt holder fokus i feltet.
- Kontrast, trykkflater, navn, reflow ved 320 og 640 px, synlig fokus, tastatur, tre temaer.
- Eksport har samme tall som grafen.

Ingen avvik funnet i de gjennomførte kontrollene. Det er ikke en full WCAG-godkjenning.

Gjenstår, bare det som ikke kan gjøres herfra (Lars, iPhone Safari, rundt 10 minutter):
1. Skjermtastaturet dekker ikke feltet du skriver i.
2. Minus i «Antatt årlig vekst».
3. Tilbake fra «Spør om sparing» med Safaris tilbakeknapp beholder planen.
4. «Før skatt» og forbeholdene er lesbare uten zoom.
5. VoiceOver leser sluttbeløp og «Før skatt».

Fase 2 avsluttes først når status for kontrollpunktene er dokumentert. Utestet skjermleserbruk står som åpen kontroll og skal ikke omtales som godkjent. Kontrollert innholdspåfyll kan foregå mens dette følges opp, forutsatt at kjente alvorlige brukshindringer rettes først. Det skal stå ærlig hvor forståelsen ikke er systematisk testet med brukere.

Hvis det senere blir brukertesting, gjenbrukes denne planen. Brukerpanel er fortsatt ikke et krav (punkt 8). La testbrukeren forklare med egne ord, uten at ønsket svar er forklart først:

- Hva betyr resultatet eller hovedpoenget?
- Hvilke forutsetninger og usikkerheter er viktige?
- Sier siden noe om hva du bør gjøre? Hvis ja, hva?

Registrer konkrete misforståelser og hvor de oppstår. Hold faktisk brukertesting atskilt fra redaksjonell egenkontroll og tekniske tester. Egenkontroll er ikke en brukertest.

## 4. Historisk dekningsoversikt, må kontrolleres før bruk

Hva som finnes nå: sju temaer i veilederen (boliglån eller sparing, studielån, sparing til barn, buffer og dyr gjeld, sparekonto eller fond, pensjon, BSU) og tre egne svar (Hva er BSU?, IPS eller ASK?, ASK eller fondskonto?). Kalkulatoren dekker sparing, sparemål og uttak.

Veilederen får fra kalkulatoren: alder (hvis oppgitt), sparetid og risikovalg. Den får ikke spareform, startbeløp eller månedsbeløp.

Søketest 24.10 (`findTopics`, 20 vanlige spørsmål): 8 riktige treff, 1 misvisende, 11 uten treff. Se tabellen.

### Etter livssituasjon

Type: **T** = trenger tekst, **B** = trenger beregning, **G** = kan gjenbruke det som finnes.

| Situasjon | Typiske spørsmål | Dekning nå | Mangler | Type | Fase |
| --- | --- | --- | --- | --- | --- |
| Flytte hjemmefra | Hva må jeg ha i buffer? Hva koster det å bo? | Buffer (tema) | Månedsbudsjett, depositum, faste utgifter. Søket finner ikke «flytte hjemmefra» | T, G | 3 søk, 4 tekst |
| Første lønn | Hva gjør jeg først: buffer, BSU, fond? | Spredt i buffer, BSU og fond | Én samlet rekkefølge. Ingen treff i søket | T, G | 4 |
| Studier | Ta opp studielån? Betale ned? | Studielån (tema), stipend nevnt | God nok for første versjon | G | |
| Boligkjøp | Egenkapital, kjøpskostnader, annuitet eller serie | BSU, boliglån eller sparing. Egenkapital nevnt i sparemål | Egenkapitalkrav, dokumentavgift, annuitet mot serie. Søket finner ikke «betale ned lån eller spare» selv om temaet finnes | T, B | 3 søk, 4 tekst, 5 beregning |
| Samlivsbrudd | Hva skjer med sparingen? | Nevnt i to setninger (barn) | Hele temaet. Søket gir i dag fondsvaret, som ikke svarer på spørsmålet | T | 3 (ærlig søk), 4 (tekst, med juridiske forbehold) |
| Trang eller varierende økonomi | Får ikke betalt regningene | Buffer og dyr gjeld, henvisning til Nav | God nok for første versjon | G | |
| Familie og barn | Spare i mitt eller barnets navn? | Sparing til barn (tema) | God nok for første versjon | G | |
| Arv og større engangsbeløp | Hva gjør jeg med 500 000 kr? | Kalkulatoren tar startbeløp | Tekst om rekkefølge (gjeld, buffer, tidshorisont). Ingen treff i søket | T, G | 4 |
| Pensjon | Når kan jeg ta ut? IPS eller ASK? | Pensjon (tema), IPS eller ASK, uttak i kalkulatoren | Folketrygd og tjenestepensjon (henvise til Nav og norskpensjon.no) | T | 4 |

### Grunnbegreper (kjernen i «fra tall til forståelse»)

| Spørsmål | Dekning nå | Mangler | Type |
| --- | --- | --- | --- |
| Hva er renters rente? | Vises i kalkulatoren | Ingen treff i søket, ingen kort forklaring | T, G |
| Hvorfor taper penger på konto verdi? | «Dette betyr tallene dine» og kjøpekraftvisningen | Ingen treff i søket | G |
| Hvorfor betyr lite gebyr mye? | Kostnadseffekten i kalkulatoren | Ingen kort forklaring med lenke til egne tall | T, G |
| Skatt på konto og fond | Forbehold i resultatet, skattenotat | Kort forklaring | T |
| Formuesskatt | Ingenting | Kort forklaring med innslagspunkt og kilde | T |

## 5. Opprinnelig leveranseskisse for fase 3 (historikk)

**Ærlig søk og grunnbegreper som svar.** Den minste sammenhengende forbedringen: brukeren får enten et riktig svar, eller beskjed om at spørsmålet ikke er dekket ennå.

1. **Søketestsett.** 30 realistiske spørsmål, hvert med forventet tema eller «ikke dekket». Låses i en test. Dagens resultat er utgangspunktet.
2. **Søkeord for temaene som finnes.** For eksempel «betale ned lån» til boliglån eller sparing, «flytte hjemmefra» til buffer.
3. **Ærlig bom.** Når et spørsmål nevner noe som ikke er dekket (samlivsbrudd, arv, formuesskatt), sier siden det tydelig, i stedet for å vise et svar som bare treffer et ord.
4. **Ny svarform «Forklaring».** Kort svar, konkret eksempel, lenke til et ferdig eksempel i kalkulatoren (dagens delingslenker, ingen endring i kalkulatoren). Krever ikke to alternativer med fordeler og ulemper. Første tre: renters rente, kjøpekraft, kostnader. Gjenbruker tekst som finnes.

Ikke med i første leveranse: spareform fra kalkulatoren til veilederen, nye temaer, lagring av spørsmål, analyseverktøy.

Ferdig når: søketestsettet består, ingen spørsmål i settet gir et misvisende svar, de tre forklaringene har kilde og kontrolldato, og kravene i `research/universell-utforming.md` er kontrollert for det som er nytt.

## 6. Kontrollert innholdspåfyll

Åpnes når denne samlingen er på main. Normalt ett til to spørsmål per PR, valgt fra køen etter kontroll av dagens dekning. Allerede eksisterende ASK- og fondskontosvar skal vurderes før det skrives nye svar med samme tema. Ingen masseimport.

Hvert nytt eller endret svar krever:

- Avgrenset spørsmål og riktig svarform: forklaring eller sammenligning.
- Primærkilder med faktisk lesedato, regelår, ikrafttredelse når relevant, vesentlige unntak og dato for neste kontroll.
- Kort svar med nødvendige forbehold, eksempel med oppgitte forutsetninger, angrepsflater og korrektur etter språkreglene.
- Kobling til faste kø-ID-er og eksisterende grunnbegreper. Overlapp bevares som søkeinnganger.
- Søketester for brukerens spørsmål, alternative formuleringer, særskriving, skrivefeil og nærliggende spørsmål som svaret ikke dekker. Test eksisterende treff når søkeord endres.
- Relevante eksisterende Node- og nettlesertester, mobilvisning, tastatur og tilgjengelighetskontroll for det som endres. Ikke testet merkes konkret.
- Oppdatert kø og arbeidslogg med PR, kildekontroll og faktisk publiseringsstatus.

Researchoppgaven lager fortsatt bare utkast i dokumentasjons-PR. Integrasjon i svarbasen er et eget avgrenset oppdrag. En kontrollert status gir ikke automatisk sammenslåing eller publisering; fullmakten oppgis i det enkelte oppdraget. Main-push utløser dagens test- og publiseringsflyt, også ved dokumentasjonsendringer.

Kontroller både at kildelenken virker og at svaret fortsatt følger kilden. Lovendringer, budsjettvedtak og ikrafttredelser prioriteres foran ordinært påfyll. Forslag og kommende regler skilles fra gjeldende regler. Brutte kilder eller usikre påstander får en konkret oppfølgingsoppgave; ikke erstatt bare URL uten å lese svaret på nytt.

## 7. Fase 5: lånekalkulator, eget arbeid

Versjon 1: annuitet, serielån, restgjeld, renteendring og ekstra innbetaling. Refinansiering og «lån eller fond?» venter.

## 8. Beslutninger tatt 24.10

- Brukerpanel er ikke et krav. Fase 2 kan avsluttes etter tekniske og manuelle kontroller, med ærlig forbehold om forståelse.
- Ingen egen bank-fond-prototype nå.
- «10 til 12 svar» var en første leveranse, ikke et tak. Målet er bred dekning.
- Sparekalkulatoren er fryst (punkt 0).

## 9. Parkert

Ideer uten plass i planen. Et punkt flyttes inn bare ved en egen beslutning.

| Idé | Kilde |
| --- | --- |
| Historiske eksempler med SSB-data (rente og prisvekst) | Historikknotat 23.10 |
| Visning etter skatt i kalkulatoren (Utforsk og Avansert) | Skattenotat 23.10 |
| Kompakt resultat nær feltene på mobil, egen handlingsmeny på pc | Del B 23.10 |
| Spareform fra kalkulatoren til veilederen | Dekningsoversikten 24.10 |
| Standard prisvekst 2,0 % i stedet for 2,5 % | Spareformbeslutning 23.10. Kan bli en kildeoppdatering hvis Lars vil |
| Gjøre `polish-browser.cjs` robust mot tidsfeil | Status 24.10. Testendring, ikke kalkulatorendring |
| Sammenhenger og forklaringer (A1 til A3, B1 til B5, C1 til C4, D1 til D2) | Utkast i punkt 10, 26.10.2026. Ikke vedtatt |

Valgomaten er parkert etter Lars sin beslutning 24. oktober 2026. Den vurderes separat etter at arbeidsgrunnlaget er samlet og kontrollert innholdspåfyll har en fungerende arbeidsflyt. Målet om et nedlastbart hverdagsbudsjett beholdes som framtidig krav, ikke som vedtatt implementeringsplan.

## 10. Utkast: sammenhenger og forklaringer (26.10.2026, ikke vedtatt)

Forslag fra Lars/GPT, undersøkt mot main `b2eada7` og åpne PR-er 26.10.2026. **Opphever ingen frys eller publiseringsbegrensning.** Kalkulatoren er fryst (punkt 0). Prosjektet er på vent til Finanstilsynet har svart (PR #77): ingen endringer i `dist/`, ingen nytt innhold, ingen sammenslåing. Alt under er planlegging. Ingenting er implementert eller testet utover det som står under «Bekreftet».

Målet er at sammenhengene mellom eksisterende deler blir lettere å forstå. Forbindelser og forklaringer går foran nye kalkulatorfunksjoner. Dette er ingen ny kø: `SPORSMALSKO.md` er fortsatt køen, og ideene er også ført i punkt 9.

### Bekreftet (kode lest på main, to enkle målinger i Chromium)

| Spørsmål | Funn | Hvor |
| --- | --- | --- |
| Har svar egne stabile adresser? | **Nei.** `spor.html#q-kjopekraft` viser ingen svar (hash ignoreres). Valg av tema endrer ikke adressen (`spor.html` før og etter). Ingen `pushState`, `hashchange` eller `popstate` i veilederfilene, så tilbakeknappen forlater siden | `dist/veileder-ui.js`, `veileder-engine.js`, `veileder-cards.js`, `veileder-context.js` |
| Kan kalkulatoren åpne et merket eksempel? | **Delvis.** Kalkulatoren åpnes med verdier via delingslenke (`index.html#start=...`), uten kodeendring. Men en delt lenke regnes som brukerens egne tall, og ingen merking som eksempel finnes. «Nullstill» og «Bare vis meg et eksempel» gir standardverdier uten merking | `dist/journey.js` rad 105 til 109, `dist/app.js` (`share`, `exampleJourney`) |
| Overskriver en delt lenke brukerens tall? | **Ja i fanen.** Arbeidsplanen i fanen (`sv-working-plan-v1`) var start 1 000 kr før en delt lenke med start 5 000 kr ble åpnet i samme fane, og 5 000 kr etter at veilederen ble åpnet. Ingen bekreftelse. Lagrede planer (`sv-scenarios`) berøres ikke av lenken | Probe mot main, `dist/veileder-bridge.js`. Ikke gjort som test i repoet |
| Finnes deler av «Hvor kom pengene fra?» | **Ja, delvis.** Resultatet viser innskudd, beregnet vekst og effekt av kostnader, og kroner kan vises sammen med kjøpekraft i dagens kroner (`view.both`). Tap i kroner skilles fra lavere kjøpekraft. Mangler: én samlet oppstilling av hvor sluttverdien kom fra | `dist/app.js` rad 125 til 150, 173, `dist/meaning.js` |
| Kan en sparepause beskrives med eksisterende funksjoner? | **Nei, trolig ikke.** Motoren har fast månedsbeløp, en årlig prosentendring i månedsbeløpet (kontinuerlig) og ett engangsinnskudd. Ingen felt for pause med start og slutt. Ikke testet | `dist/engine.js` (`raw`, `FIELDS`) |
| Finnes forklaringskort? | **Svarformen finnes** (`kind:'explainer'`: kort svar, begreper, eksempel, fordypning, kilder). Kjøpekraft finnes på main (`q-kjopekraft`). Renters rente ligger i #65 (ikke slått sammen). **Kostnader: ikke funnet på main.** Ingen figurkomponent i veilederen (0 svg-treff i `veileder-ui.js` og `veileder-cards.js`) | `dist/veileder-engine.js` rad 80 og 141, `dist/veileder-knowledge.js` |
| Hva omfattes av frysen og pausen? | Frysen: alt som endrer kalkulatoren (C1 til C4, merking av eksempel i A1). Pausen: all `dist/`-endring og alt nytt innhold, også A2, A3 og B1 til B2. Frysen kan ha unntak for tilgjengelighetsfeil, regnefeil og kildeoppdateringer (punkt 0) | `research/plan.md` punkt 0, `docs/regulatorisk.md` i #77 |

**Regnekontroll (ikke kildegrunnlag).** Regneeksemplet i B2 er kontrollert separat med uavhengig regning (Python, ikke visningskoden): 100 000 kr, +20 % og deretter −20 % gir 96 000 kr, og motsatt rekkefølge 96 000 kr. Med 10 000 kr satt inn mellom periodene: 104 000 mot 108 000 kr. Med 10 000 kr tatt ut: 88 000 mot 84 000 kr. Alle seks tall stemmer med forslaget. Dette bekrefter bare tallene. Det er ikke en kilde for forklaringen.

### Avhengigheter og samspill med åpne PR-er

- **#78** (personvern, kontakt, fanelagring): endrer `veileder-bridge.js` og lagring. A1 og A2 må bygges oppå den, og A3 kan ikke aktiveres før den er publisert og e-postkontakten er avklart (se `docs/personvern-lagring.md`).
- **#68** (alder og situasjon styrer forslagene): endrer `veileder-ui.js`, `veileder-engine.js` og `spor.html`. A2 berører samme filer, så rekkefølgen må avklares. #68 hører også inn under sperren for kontekstuell veiledning (#77).
- **#65** (renters rente og kjøpekraft på bankkonto): gir kortet for renters rente. B1 bør ikke dupliseres.
- **#54 og #47** (søk): nye svar må tåle søk. Ikke endre søkelogikk i samme PR.
- **#75** (tilgjengelighetsside): lenker og UU-kravene gjelder alle nye deler.

### Prioritering

**Anbefalt første arbeidsoppgave når pausen er opphevet: A2, egen adresse per svar.** Grunnen: minst risiko, ingen nytt innhold, ingen kalkulatorendring, lett å føre tilbake, og A1 og A3 trenger den. Mens pausen varer: bare skrive og kontrollere spesifikasjonen (under).

| Rangering | Idé | Rører | Status |
| --- | --- | --- | --- |
| 1 | A2 adresse per svar | `veileder-ui.js`, `spor.html`, tester | Spesifikasjon under. Venter på pause |
| 2 | A1 «Åpne regneeksempelet» | Veileder, og kalkulatoren hvis eksemplet skal merkes | Spesifikasjon under. Merking krever endret kalkulator, så implementering venter på opphevet frys |
| 3 | B1 grunnkort | Nytt innhold, svarbase, søketester | Venter på pause. Renters rente via #65 |
| 4 | B2 samme prosentendringer | Nytt innhold | Eksempelet kontrollregnet. Faglig kilde ikke funnet ennå |
| 5 | A3 «Savner du et svar?» | Kontaktløsning, personvernside | Bare planlagt. Aktivering venter på avklart kontakt |
| 6 | C1 til C4 | Kalkulatoren | Venter på opphevet frys. C4 krever trolig endret motor, egen senere oppgave |
| Kø | B3, B4, B5, D1, D2 | | Uendret, utvider ikke første leveranse |

### A2: spesifikasjon (forslag)

- **Stabile svar-ID-er:** adressen er `spor.html#svar=<id>`. ID-en er en fast, kort, liten bokstav-tekst som ikke avledes av overskriften (eksisterende id-er som `funds`, `mortgage`, `q-kjopekraft` brukes). Endres en overskrift, endres ikke adressen. Id-ene er en offentlig kontrakt: en test låser listen, og en omdøpt id beholder den gamle som alias.
- **Direkte åpning:** åpnes adressen uten forhåndsvalg, vises det svaret. Ingen tom side, ingen avhengighet av at brukeren har fylt inn noe.
- **Oppdatering av siden:** samme svar vises igjen. Ingen lagring trengs, siden adressen bærer valget.
- **Tilbake og frem:** hvert valg av svar legger til en historikkoppføring. Tilbake går til forrige visning (for eksempel listen eller det forrige svaret), frem til svaret igjen. Endring av adressen for hånd åpner riktig svar (`hashchange`/`popstate`).
- **Ugyldig id:** startvisning med en kort melding om at svaret ikke finnes, og lenke til temaene. Meldingen er tilgjengelig for skjermleser. Ingen feil i konsollen.
- **Tilgjengelig fokusplassering:** ved direkte åpning, oppdatering og navigasjon plasseres fokus ved svaret (overskriften eller svarområdet), ikke et tilfeldig sted og ikke så det hopper uventet i dokumentet. Ved tilbake og frem følger fokus og leseposisjon det forventede. Svaret kunngjøres på en måte som er kontrollert med skjermleser. Skal avgjøres ved test, ikke antas.
- Kommer brukeren utenfra, har de ikke fylt inn noe. Svaret må ikke se ut som tilpasset deres tall. Eksisterende tekst om «Tilpass svaret» kontrolleres.
- Ingen lagring, ingen nettverkskall. Adressen inneholder ingen personopplysninger.
- **Overlapp med #68 må avklares før kodearbeidet starter.** #68 (hode `0223e12`, ingen konflikt mot main per 26.10.2026) endrer `veileder-ui.js` (1 linje), `spor.html` (1 linje) og `veileder-engine.js` (47 tillegg, 4 slettinger). Overlappet med A2 er trolig lite, men er ikke testet med et faktisk prøveforsøk på sammenslåing. #68 hører under sperren for kontekstuell veiledning (#77), så rekkefølgen avgjøres av Lars etter Finanstilsynets svar.
- Aksept: delbar og bokmerkbar adresse for alle svar, direkte åpning, oppdatering, tilbake og frem, ugyldig id, fokus og skjermleser, id-liste låst, eksisterende søk og temavalg uendret. Testes i Chromium, Firefox og WebKit, og på iPhone for hånd.

### A1: spesifikasjon (forslag)

- Første svar: «Sparekonto eller fond» (`funds`). Knappen «Åpne regneeksempelet» må ikke overskrive brukerens arbeidsplan. **Ny fane (`target="_blank"` med `rel="noopener"`) er foreløpig bare en mulig løsning.** Overskrivingsproblemet regnes ikke som løst før det er testet. Mulig utfall som må kontrolleres: om en ny fane faktisk starter uten arbeidsplan fra den første, hva som lagres når eksemplet åpnes, og om `pagehide` i eksempelfanen kan skrive over noe.
- Eksemplets verdier må bestemmes og begrunnes mot `dist/assumptions.js`. Verdiene er ikke valgt her.
- Merking: en delt lenke regnes i dag som brukerens egne tall. Teksten «Dette er et eksempel, ikke dine tall» krever derfor en endring i kalkulatoren (for eksempel en parameter og en startnote). Det er dermed en endring av den fryste kalkulatoren, og implementeringen venter. Uten merking skal knappen ikke lanseres, siden teksten da ikke ville stemt.
- Knappen og teksten må si hva som skjer («åpnes i en ny fane med eksempeltall»).
- Aksept: eksisterende tall overskrives ikke, eksemplet er tydelig merket i kalkulatoren, tall og forbehold finnes som tekst, tastatur og skjermleser, og test mot at lagrede planer og arbeidsplan er uendret.
- **Retur må testes:** bruker går fra veilederen via eksemplet og senere tilbake til kalkulatoren, i samme fane og fra den andre fanen. Forventet: egne tall er bevart og ikke erstattet av eksemplet, og eksemplet vises ikke som brukerens egne tall. Også med blokkert lagring og med eksisterende lagrede planer.

### B1, B2: kort om forklaringskort

Bruk `kind:'explainer'`. Ikke et parallelt system. Ingen automatisk åpning: når pausen oppheves, er A2 første kandidat, og resten av planen åpnes ikke av det. Figur krever en ny, liten komponent (finnes ikke i dag), og alle tall og sammenhenger skal også stå som tekst. B2 forklarer at rekkefølgen bare er kjent i ettertid og gir ikke tidspunktråd. Eksemplet ser bort fra skatt, kostnader og inflasjon, og innskudd eller uttak skjer ett sted mellom to perioder. **Kildegrunnlag er noe annet enn regnekontroll og er ikke funnet ennå.** En faglig kilde skal støtte selve forklaringen: at samme prosentendringer gir ulikt resultat avhengig av rekkefølge når det kommer innskudd eller uttak mellom periodene, og at rekkefølgen bare er kjent i ettertid. Kilden må finnes, leses og dateres før bruk. Ikke bruk en generell risikokilde (for eksempel «fond kan gå opp og ned») som ikke faktisk støtter dette poenget. Hvis ingen norsk primærkilde støtter forklaringen direkte, skal det stå, og kortet kan i stedet baseres på det matematiske eksemplet alene med forbehold. B2 må vurderes mot Finanstilsynets svar før publisering.

### A3: bare plan

Aktiveres ikke før kontaktløsningen er avklart (#78 ikke publisert, rolle og avtale hos Domene.no uavklart). Ved manglende treff kan brukeren åpne et e-postutkast der de selv redigerer teksten. Ingenting sendes automatisk, ingen kalkulatortall legges ved, og siden forklarer hva som går til e-postprogrammet. Innsendte spørsmål er innspill fra dem som velger å sende, ikke et representativt bilde. Ikke oppfordre til å sende personlige økonomiske forhold. Funksjonen er et særskilt, frivillig valg og må stå i personverninformasjonen.

### C1 til C4: notater

- **C1:** utgangspunktet finnes (innskudd, vekst, kostnader, kroner og dagens kroner). Kjøpekraft skal ikke legges til som tredje del av summen, og null vekst og negativ avkastning må håndteres.
- **C2:** bygg på «Dette betyr tallene dine» (`dist/meaning.js`), få forutsetninger, én endring om gangen.
- **C3:** avklar definisjonen først: samlede kostnader delt på månedlig sparebeløp er noe annet enn forsinkelsen mot et sparemål. Ikke bruk «fire års ekstra sparing» før dette er entydig.
- **C4:** trolig ikke mulig uten endret motor. Egen senere oppgave, nøytrale formuleringer.

### Ikke kontrollert

- iPhone, Safari, Firefox, VoiceOver og NVDA for noen av ideene (ikke bygget).
- Om #68 og #65 endrer det som er målt over (målt mot main).
- Faglige kilder til B1 (kostnader) og B2. For B2: ingen kilde til forklaringen om rekkefølge og pengestrømmer er funnet. Bare regnekontrollen er gjort.
- Om A2 til A3 faller inn under Finanstilsynets spørsmål. Det avgjør Lars etter svaret.
