# Læring og fordypning: kartlegging

24. oktober 2026. Kontrollert mot `main` `a5777f6`. Ingen kode, tekst eller design er endret. Notatet er et beslutningsgrunnlag, ikke en plan. Den levende planen er `research/plan.md`.

`research/plan.md` og `research/universell-utforming.md` ligger i PR #32 (åpen, ikke slått sammen) og er lest derfra.

## 1. Kort vurdering

Spareverksted har to deler som hver for seg er gode, men som nesten ikke snakker sammen.

- **Kalkulatoren** dekker alle fem behovene for sine egne temaer (kjøpekraft, vekst, kostnader, risiko, uttak). Hjelpetekstene har konkrete eksempler («5 % betyr at 100 kr blir 105 kr»), «Dette betyr tallene dine» forklarer det brukeren faktisk ser, og metode, kilder og kontrolldato finnes. Svakheten er at fordypningen slutter i metodeteksten. Det finnes ingen vei videre til veilederen fra det brukeren nettopp har lært.
- **Veilederen** gir korte svar med avveininger, forbehold og kilder. Men den mangler konkrete eksempler og muligheten til å prøve selv. Ingen svar lenker til kalkulatoren. Søket finner bare det brukeren formulerer med temaets egne ord.
- **Begrepene** som bærer «fra tall til forståelse» (renters rente, kjøpekraft, dagens kroner, kostnader) forklares bare inne i kalkulatoren, der brukeren møter dem. Den som spør om dem i veilederen, får «Fant ikke et passende svar».

Det største hullet er altså ikke manglende innhold, men manglende veier mellom innhold som finnes.

## 2. Hva som er gjennomgått, og hvordan

| Type | Hva | Resultat |
| --- | --- | --- |
| **Kode- og tekstgjennomgang** | All brukerrettet tekst i `dist/index.html`, `spor.html`, `om.html`, `meaning.js`, `veileder-engine.js`, `veileder-cards.js`, `veileder-knowledge.js`, `veileder-facts.js`, `veileder-ui.js`, `veileder-context.js`, `veileder-bridge.js`, `assumptions.js`, og hjelpetekstene i `experience.js`, `journey.js` og `guidance.js`. `research/sporsmal-og-prioritering.md`, `veileder-kilder.md`, `fase2-navigasjon-2026-10-23.md` | Grunnlaget for tabellen i punkt 3 |
| **Funksjonskontroll (kjørt)** | Eget søketestsett med 25 vanlige spørsmål mot `findTopics` i Node. Sjekk av at ulike eksempelspørsmål gir samme svar. Sjekk av teksten «Hva krever det av deg?» per tema. Søk etter lenker mellom veileder og kalkulator. Alle 11 Node-testfiler | Se punkt 5. Node-testene: 11 av 11 grønne |
| **Fakta mot primærkilde** | Lånekassens stipendgrense 534 225 kr (ugifte, 2026) | Stemmer med [Lånekassen](https://lanekassen.no/nb-NO/stipend-og-lan/omgjoring-av-basislan/), hentet 24.10.2026 |
| **Ikke kontrollert** | BSU- og IPS-tallene, Forbrukerrådets «minst 5 år», skattesatsene. Skatteetaten og Forbrukerrådet kunne ikke hentes fra arbeidsmiljøet. Kontrollert sist 22. og 23. oktober ifølge koden og skattenotatet | Står som «ikke kontrollert på nytt» |
| **Ikke kjørt** | Nettlesertestene (ingen kode er endret). Publisert side. iPhone, skjermleser | |
| **Krever brukertesting** | Om folk forstår forklaringene, om de finner fram uten fagord, om eksempelspørsmålene oppleves som svar på det de spurte om, om gamifisering hjelper | Ingenting av dette er testet med brukere |

## 3. Temaer og læringsveier

Kolonnene er de fem behovene. **Ja** = finnes og virker etter gjennomgangen. **Delvis** = finnes, men med en svakhet. **Nei** = finnes ikke.

### Kalkulatoren

| Tema | Få svar | Forstå | Utforske | Fordype | Etterprøve | Viktigste mangel | Filer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Kjøpekraft og prisvekst | Ja. Resultatkortet og «Dette betyr tallene dine» | Ja. «100 kr i dag koster 102 kr om ett år» | Ja. Kroner, Kjøpekraft, Begge | Ja. Under «Mer om tallene» | Ja. Metodeteksten | Ikke søkbar fra veilederen | `meaning.js`, `experience.js`, `index.html` (metode) |
| Renters rente og vekst over tid | Delvis. Effekten ses i grafen | Nei. Ordet «renters rente» står ingen steder. «Rentes rente» brukes tre ganger uten forklaring | Ja. Sparetid og vekst | Delvis. Ved lavere og høyere vekst | Ja | Kjernebegrepet er aldri forklart | `journey.js`, `guidance.js`, `index.html` |
| Kostnader | Ja. «Effekt av kostnader» | Ja. «0,2 % av 100 000 kr er 200 kr» | Ja | Ja. Med og uten kostnader | Ja | Ikke søkbar fra veilederen | `experience.js`, `meaning.js` |
| Risiko og usikkerhet (indeksfond) | Ja. Advarsel om verdifall | Ja. Nedre del mot innskuddene | Ja. Utfallsrom, børsfall | Ja | Ja. Finans Norge, kontrolldato | «Realavkastning» og «årlig svingning» uforklart | `meaning.js`, `journey.js`, `assumptions.js` |
| Skatt | Delvis. «Før skatt» overalt, én setning for konto | Delvis. Bare for sparekonto | Delvis. Bare i uttaksdialogen | Delvis | Ja. Skatteetaten, kontrolldato | Ingen forklaring av skatt på fond. «Skjerming» uforklart | `meaning.js`, `index.html` (skattedialog) |
| Sparemål | Ja | Ja. Tre alternativer | Ja | Ja. Stresstester | Ja | | `guidance.js`, `index.html` |
| Uttak | Ja | Delvis. Få eksempler | Ja | Ja. Forutsetninger | Ja | | `index.html`, `journey.js` |

### Veilederen («Spør om sparing»)

| Tema | Få svar | Forstå | Utforske | Fordype | Etterprøve | Viktigste mangel | Filer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Sparekonto eller fond | Ja | Nei. Ingen tall | Nei. Ingen lenke til kalkulatoren | Ja | Delvis. Én dato for hele svaret | Nevner at prisvekst spiser kjøpekraft, men viser det ikke. Kalkulatoren kan | `veileder-engine.js`, `veileder-cards.js` |
| Boliglån eller sparing | Ja | Nei | Nei | Ja. Fastrente, rentefradrag | Delvis. Kildeetiketten «Forbrukerrådet: lån og sparing» peker til Finansportalens forside | «Rentefradrag», «overkurs» og «underkurs» uforklart | samme |
| Buffer og dyr gjeld | Ja | Delvis. Trinn, ingen tall | Nei | Ja | Ja. Nav | Søket finner ikke «hvor mye bør jeg ha på konto i tilfelle noe skjer» | samme |
| Studielån | Ja | Nei | Nei | Ja | Ja. Lånekassen | | samme |
| Sparing til barn | Ja | Nei | Nei | Ja. Råderett, stipend, samlivsbrudd | Delvis. Se punkt 4 om Statsforvalteren-kilden | | samme, `veileder-facts.js` |
| Sparing til pensjon | Ja | Nei | Nei. Uttak i kalkulatoren finnes, men lenkes ikke | Ja | Ja | Ingen vei til uttaksberegningen | samme |
| BSU og boligkjøp, Hva er BSU? | Ja | Delvis. Grensene i tall | Nei | Ja | Ja. Skatteetaten, dato | | `veileder-knowledge.js`, `veileder-facts.js` |
| IPS eller ASK?, ASK eller fondskonto? | Ja | Nei | Nei | Ja | Ja | Søket på «aksjesparekonto» treffer ikke svaret om ASK | `veileder-knowledge.js` |
| Ikke dekket: arv, formuesskatt, samlivsbrudd, flytte hjemmefra, første lønn, skatt på fond | Nei | | | | | Søket svarer «Fant ikke», men sier ikke at temaet mangler | |

## 4. Språklige og faglige hindringer

### Dokumenterte feil (kontrollert)

1. **Feil tekst på tre temaer.** «Hva krever det av deg?» viser teksten om ekstra avdrag på boliglån også på Sparekonto eller fond, Sparing til pensjon og Studielån, når brukeren ikke har valgt fast trekk. Kontrollert ved å kjøre `answer()` for hvert tema. Kilde: `veileder-engine.js`, linjen med `['mortgage','funds','student','pension']`.
   *Korrigert 24.10:* Bare delvis riktig. For fond og pensjon er teksten feilplassert. Studielånssvaret har alternativet «Låne mindre eller betale ekstra», så poenget hører hjemme der. Det som var feil der, er boliglånsordet «avdrag». Rettet i PR #35.
2. **Eksempelspørsmål lover mer enn svaret leverer.** De fire spørsmålene under hvert tema gir nøyaktig samme svar (kontrollert). «Hva hvis jeg trenger pengene om tre år?» gir et svar som ber brukeren oppgi når pengene skal brukes, fordi tall i spørsmålet ikke tolkes. `research/veileder-kilder.md` sier at dette opplyses i grensesnittet. Det gjør det ikke i dag.
3. **Kildeetikett som lover for mye.** «Forbrukerrådet: lån og sparing» lenker til `forbrukerradet.no/finansportalen/`, ikke en side om lån og sparing.

### Må undersøkes videre

4. **Statsforvalteren-kilden.** `veileder-kilder.md` beskriver en arkivert side på `utdatert.statsforvalteren.no`. Koden bruker en PDF fra 17.02.2023 på `statsforvalteren.no`. Enten er dokumentasjonen utdatert, eller kilden er byttet uten notat. Ikke kontrollert hvilken som gjelder nå.
5. **Forbrukerrådets «minst 5 år».** Brukt som anbefaling i veilederen. Kunne ikke hentes i dag. Bør kontrolleres sammen med BSU- og IPS-tallene ved neste faktasjekk.
6. **Kontrolldatoer spredt.** Kalkulatoren viser 20., 21. og 23. oktober på ulike steder. Veilederen viser én dato for hele svaret, ikke per kilde. Ikke feil, men vanskelig å etterprøve.

### Begreper som brukes uten forklaring

`research/universell-utforming.md` krever at fagord forklares der de brukes. Disse gjør ikke det:

| Begrep | Hvor | Merknad |
| --- | --- | --- |
| Rentes rente | Hjelp for kostnad, lavere og høyere vekst, metode | Kjernen i prosjektet. Aldri forklart, aldri kalt «renters rente» |
| Realavkastning | Forutsetninger for indeksfond | |
| Årlig svingning, standardavvik | Utfallsrommet | |
| Skjerming, skjermingsfradrag | Skattedialogen | |
| Rentefradrag, overkurs, underkurs | Boliglån eller sparing | |

Kalkulatoren er fryst. Om uforklarte fagord regnes som tilgjengelighetsfeil etter punkt 0 i planen, er Lars sin beslutning.

### Gjentakelser og motsigelser

Ingen faglige motsigelser funnet mellom kalkulator og veileder. Kjøpekraft, «før skatt» og «ikke en garanti» brukes likt. Advarselen om at lang tid ikke garanterer gevinst står flere steder i veilederen. Det er bevisst og bør beholdes.

## 5. Hvordan folk finner fram

### Søketest (kjørt i Node, `findTopics`)

25 spørsmål skrevet med vanlige ord. Settet er mitt eget og ikke representativt. Det er ikke sammenlignbart med søketesten i planen (20 spørsmål).

| Utfall | Antall | Eksempler |
| --- | --- | --- |
| Riktig tema | 6 | «Kan jeg tape penger på fond?», «Skal jeg spare til barnebarnet?» |
| Tema finnes, men søket bommer | 5 | «Bør jeg betale ned lån eller spare?» (ordet «nedbetal» kreves), «Lønner det seg å spare i banken?», «Er det dumt å ha alt på brukskonto?», «Hvor mye bør jeg ha på konto i tilfelle noe skjer?», «Jeg skal kjøpe leilighet om to år» |
| Forklaring finnes i kalkulatoren, søket bommer | 6 | «Hva er renters rente?», «Hva er inflasjon?», «Hva betyr dagens kroner?», «Hvorfor blir pengene mindre verdt på konto?», «Hvorfor betyr gebyret så mye?», «Hvordan vokser pengene over tid?» |
| Misvisende treff | 2 | «Hvordan blir fond skattlagt?» gir det generelle fondssvaret uten skatt. «Hva er aksjesparekonto?» gir det generelle fondssvaret, ikke ASK-svaret |
| Ikke dekket, ærlig bom | 5 | arv, formuesskatt, skilsmisse, flytte hjemmefra, første lønn |
| Delvis treff | 1 | «Hva er ASK?» gir «IPS eller ASK?» først |

### Svar på spørsmålene i oppdraget

| Spørsmål | Svar | Grunnlag |
| --- | --- | --- |
| Finne et spørsmål uten fagordet? | Delvis. «Spørsmål du kan starte med» og «Vis alle temaer» virker uten søk. Søket krever temaets egne ord | Kode og søketest |
| Gå direkte dit? | Nei. Ingen svar har egen adresse. Et svar kan ikke lenkes, bokmerkes eller deles | Kode (`veileder-ui.js` bruker ikke adressen) |
| Kommer svaret raskt? | Ja. Kort svar og to alternativer først | Kode. Ikke brukertestet |
| Er neste steg relevant? | Delvis. «Neste spørsmål» styres av profilen, ikke av svaret brukeren nettopp leste | Kode (`suggestions()`) |
| Hvor slutter fordypningen? | Kalkulatorens metodetekst. Veilederens kildeliste. Om-siden. Ingen av dem peker videre | Kode |
| Lover noe mer enn det leverer? | Ja: eksempelspørsmålene (punkt 4.2), kildeetiketten (4.3), bom-teksten «Prøv andre ord», som antyder at svaret kan finnes | Kode og kjøring |

Veilederen oppleves ikke som en samtalerobot i dag: temaene er synlige, svarene er faste og alle kan åpnes uten søk. Det bør bevares.

## 6. Prioriterte hull

| # | Hull | Hvorfor det betyr mye | Minste nyttige tiltak | Rører kalkulatoren? |
| --- | --- | --- | --- | --- |
| 1 | **Ingen vei fra veileder til kalkulator.** Svarene sier hva som skjer, men brukeren kan ikke se det med egne tall | Prosjektets kjerneprinsipp er å oppdage sammenhenger selv. Kalkulatoren kan allerede vise det veilederen bare påstår | Én lenke i 2 til 3 svar til et ferdig eksempel via dagens delingslenker. Først i «Sparekonto eller fond» (kjøpekraft) | Nei |
| 2 | **Søket finner ikke det som finnes.** 11 av 25 vanlige spørsmål bommer på innhold som finnes | Den som ikke kan fagordet, får beskjed om at svaret ikke finnes | Søketestsett låst i test, og søkeord for temaene som finnes. Er planens fase 3, punkt 1 og 2 | Nei |
| 3 | **Grunnbegrepene har ingen kort forklaring.** Renters rente, kjøpekraft, kostnader | De er kjernen i «fra tall til forståelse» og står bare inne i kalkulatoren | Planens svarform «Forklaring» (fase 3, punkt 4) for disse tre | Nei |
| 4 | **Eksempelspørsmål gir samme grunnsvar.** | Brukeren tror hen har fått svar på sitt spørsmål | Enten én setning som sier at spørsmålene leder til samme tema, eller færre og mer generelle eksempler | Nei |
| 5 | **Feil tekst om ekstra avdrag** på to temaer, feil ord på ett (rettet i PR #35) | Liten, men faktisk feil i et svar | Vis avdragsteksten bare for boliglån | Nei |
| 6 | **Uforklarte fagord** | Brudd på eget språkkrav i universell utforming | Én bisetning der ordet brukes. I kalkulatoren bare etter beslutning om punkt 0 | Ja, for fire av ordene |
| 7 | **Svar uten egen adresse** | Kan ikke deles, bokmerkes eller lenkes fra kalkulatoren | Vent. Vurderes etter 1 til 3 | Nei |
| 8 | **Kildekontroll** (punkt 4.3 til 4.6) | Etterprøvbarhet | Én faktasjekkrunde mot primærkilder med dato per kilde | Nei |

Rekkefølgen bygger på min vurdering av nytte for en bruker uten forkunnskaper. Den er ikke testet.

## 7. Gamifisering: en mulighet for senere

Ikke implementert, og ikke anbefalt nå.

**Hvor det kan støtte forståelse:**
- *Gjett før du ser.* «Hva tror du 2 000 kr i måneden blir etter 30 år?» før resultatet vises. Avstanden mellom gjetning og svar kan gjøre renters rente og kostnader synlige.
- *Forklar sammenhengen.* «Saldoen økte. Kan pengene likevel kjøpe mindre?» med svar som begrunnes, ikke bare rett eller galt.
- Passer best for tidløse sammenhenger (kjøpekraft, renters rente, kostnader, risiko), ikke for satser og regler som endres hvert år.

**Aktivitet eller forståelse:**

| Belønner aktivitet | Tegn på forståelse |
| --- | --- |
| Antall åpnede svar, dager på rad, klikk | Riktig forutsigelse før resultatet vises |
| Fullførte quizer | Kan forklare hvorfor, ikke bare velge riktig |
| Trofé for å ha prøvd alle visninger | Velger riktig svar i en ny situasjon med andre tall |

Aktivitetsbelønning kan måle bruk uten å si noe om læring. Bare høyre kolonne bør kalles læring.

**Må være på plass først:**
1. Forklaringene i punkt 6.3, med kilder. En quiz kan ikke være bedre enn teksten den bygger på.
2. Søk og veier (6.1 og 6.2). Ellers finner ingen fram til det quizen viser til.
3. Universell utforming: ingen tidsfrister, alt med tastatur og skjermleser, ingen informasjon bare i farge eller animasjon, respekt for redusert bevegelse.
4. Personvern: eventuell framgang lagres bare lokalt, uten konto, og kan slettes.
5. **Tilgang til kunnskap avhenger aldri av poeng, troféer eller fullførte oppgaver.** Alt kan leses uten å spille.

## 8. Anbefalt neste oppgave

**Søketestsett og søkeord for veilederen** (planens fase 3, punkt 1 og 2).

- 30 realistiske spørsmål med forventet tema eller «ikke dekket», låst i en test. Dagens resultat dokumenteres som utgangspunkt. Testsettet i punkt 5 kan være en start.
- Nye søkeord bare for temaer og svar som finnes. Ingen nye svar, sider eller avhengigheter.
- Endrer bare `veileder-engine.js` og `veileder-knowledge.js` (søkeord) og en ny testfil. Kalkulatoren, designet og navigasjonen er urørt.
- Ferdig når testsettet består, ingen spørsmål gir misvisende treff, og kravene i `research/universell-utforming.md` er kontrollert for det som er endret.

Hvorfor denne først: den er minst, målbar og gjør eksisterende innhold synlig. Den gir også testgrunnlaget som trengs før lenker til kalkulatoren (hull 1) og forklaringer (hull 3) legges til.

Feilen om ekstra avdrag (hull 5) kan rettes i samme runde hvis Lars vil, men er ikke en del av anbefalingen.

## 9. Usikkert

- Søketestsettet er mitt eget og ikke basert på hva folk faktisk skriver.
- Prioriteringen i punkt 6 er en faglig vurdering, ikke et brukertestresultat.
- Publisert side, iPhone og skjermleser er ikke kontrollert i denne runden.
- Tidsavhengige fakta utenom stipendgrensen er ikke kontrollert på nytt (se punkt 2).
