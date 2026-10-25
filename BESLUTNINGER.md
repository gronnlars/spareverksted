# Hvorfor Spareverksted er laget slik

Beslutningsnotat, 24. oktober 2026.

Les dette før du foreslår større endringer. Notatet samler prinsipper og valg fra prosjektarbeidet. Det er ikke dokumentasjon på at alle deler er ferdige eller fullstendig brukertestet.

## Aktive avvik fra reglene

Et avvik utløper på datoen og må fornyes eller fjernes. Se [KILDEREGLER.md](KILDEREGLER.md), «Når en regel må brytes». Kontrollrunden går gjennom tabellen, og den som gjør runden varsler Lars minst to uker før utløp.

| Hva | Regel | Godkjent av | Utløper | Fornyes av | Status |
| --- | --- | --- | --- | --- | --- |
| Varsel om sparehorisont for Indeksfond under 5 år på kalkulatorsiden (PR #67) | Kalkulatorfrysen (plan, punkt 0) | Lars ved sammenslåing | 31.01.2027 | Lars | Foreslått. Aktivt først når #67 er slått sammen |

## En ulempe betyr ikke at valget var feil

Som når man velger skuffer framfor skap på et kjøkken: Begge løsninger har ulemper. Et godt valg kan innebære at man aksepterer noe irriterende for å slippe noe som ville vært verre.

Spareverksted har begrensninger vi har valgt med åpne øyne. Nye innspill skal vurderes seriøst, men ikke automatisk føre til flere funksjoner, flere forbehold eller en ny utforming. Vi skal huske hvorfor alternativet ble valgt bort.

Før en endring:
1. Hva skulle dagens løsning løse?
2. Hvilket alternativ valgte vi bort, og hvorfor?
3. Hva er den kjente ulempen vi aksepterer?
4. Gir innspillet ny kunnskap som endrer avveiningen?
5. Hva mister brukeren hvis vi følger forslaget?

En begrunnelse er ikke et vern mot kritikk. Faktiske regnefeil, utilgjengelige kontroller og dokumenterte misforståelser skal undersøkes og rettes.

## Raske svar og mulighet for fordypning

**Valg:** Enkel inngang, resultat først og mer kunnskap når brukeren ønsker det. Tenk på et godt museum: Både den som vil prøve noe raskt og den som vil undersøke detaljene, skal få utbytte.

**Alternativ:** Alle innstillinger, forklaringer og forbehold synlig fra starten, eller en så enkel side at fordypningen forsvinner.

**Begrunnelse:** Mennesker har ulike forkunnskaper og behov. Vi skal gi tilgang til dybden uten å kreve at alle går gjennom den.

**Akseptert ulempe:** Noe viktig informasjon krever et ekstra trykk. Opplysninger som endrer forståelsen av resultatet, må likevel være tydelige der resultatet vises.

**Vurder på nytt når:** Brukertester viser at folk ikke finner nødvendig informasjon eller misforstår resultatet.

## En avgrenset sparekalkulator

**Valg:** Kalkulatoren utforsker spareutvikling, kjøpekraft, kostnader, mål og uttak under oppgitte forutsetninger.

**Alternativ:** Bygge en samlet modell for bolig, utdanning, skatt, støtteordninger, gjeld og livslønn med en gang.

**Begrunnelse:** En større modell krever flere opplysninger og antakelser. Det øker vedlikeholdsbehovet og faren for å gi inntrykk av mer personlig og presis veiledning enn vi kan stå inne for. Utviklingen følger fasene i prosjektet.

**Akseptert ulempe:** Kalkulatoren kan ikke avgjøre hva som er best for hele privatøkonomien. Høyest sluttsaldo er ikke nødvendigvis det beste livsvalget.

**Vurder på nytt når:** Vi kommer til den aktuelle utviklingsfasen og kan dokumentere nytte og faglig kvalitet.

## Gjør kroner og kjøpekraft forståelige

**Valg:** Vis at saldoen kan øke samtidig som kjøpekraften faller. Forklaringene skal bygge på tallene brukeren faktisk har valgt.

**Alternativ:** Bare vise et stort sluttbeløp og en stigende kurve.

**Begrunnelse:** Et riktig kronebeløp kan likevel gi et misvisende bilde av hva pengene vil rekke til.

**Akseptert ulempe:** Flere måleenheter krever mer forklaring. Sammenligninger må bruke samme grunnlag.

**Vurder på nytt når:** Brukere blander tap i kroner med redusert kjøpekraft, eller ikke forstår hvilken visning de ser.

## Synlig usikkerhet uten å late som vi kjenner framtiden

**Valg:** Dokumenterte regneforutsetninger, scenarioer og stresstester med tydelige begrensninger. Dagens modell bruker ikke Monte Carlo.

**Alternativ:** Én tilsynelatende sikker vekstkurve, eller mer omfattende simuleringer.

**Begrunnelse:** Brukeren skal kunne undersøke konsekvenser uten at modellens detaljer gir falsk trygghet. Flere simuleringer er ikke automatisk bedre beslutningsstøtte.

**Akseptert ulempe:** Modellen dekker ikke alle mulige markedsforløp eller sannsynligheten for å nå ethvert mål. Forenklinger må forklares.

**Vurder på nytt når:** Brukerbehov krever analyse av ulike avkastningsforløp, og en ny modell kan etterprøves. Test særlig om brukeren forstår at målet kan glippe på datoen pengene trengs.

## Forhåndsskrevne svar framfor KI-svar

**Valg:** «Spør om sparing» bruker kvalitetssikrede tekster og regler, med kilder og kontrolldato.

**Alternativ:** La en språkmodell generere personlige svar.

**Begrunnelse:** Svarene skal være etterprøvbare, forutsigbare og mulige å vedlikeholde. Tjenesten skal ikke kreve innlogging, reklame eller eksterne KI-kall.

**Akseptert ulempe:** Søket forstår ikke alle formuleringer, og veilederen kan ikke svare fritt på alt. Manglende dekning skal ikke skjules med et irrelevant svar.

**Vurder på nytt når:** Faktiske spørsmål viser hull i ruting eller innhold. Utvid kvalitetssikret dekning i riktig fase.

## Kvalitet før flere funksjoner

**Valg:** Avgrensede endringer, uavhengige kontrollberegninger og kontroller av flyt og tilgjengelighet. Kalkulatorens ferdige deler skal få ro før vi bygger videre.

**Alternativ:** Gjøre forbedringer hver gang et nytt forslag virker nyttig.

**Begrunnelse:** Stadige lokale forbedringer kan gjøre helheten tyngre og åpne gamle feil.

**Akseptert ulempe:** Gode forslag må noen ganger vente. Automatiske tester kan heller ikke alene vise at mennesker forstår siden.

**Vurder på nytt når:** Det finnes en konkret feil eller dokumentert brukshindring. Skill dette fra ønsker om utvidelser. Tilgjengelighetsstatus omtales som «ingen avvik funnet i de gjennomførte kontrollene», ikke som fullstendig WCAG-samsvar.

## Gratis bruk og frivillige gaver

**Valg:** Tjenesten skal være gratis og uten reklame. Prosjektet kan forklare formålet og gjøre det enkelt å støtte gode formål frivillig.

**Alternativ:** Reklame, betaling for personlig bruk eller ingen synlig mulighet for gaver.

**Begrunnelse:** Spareverksted skal hjelpe mennesker og kunne bidra til noe utover størst mulig personlig formue.

**Akseptert ulempe:** Donasjonsbudskap kan oppleves som et avbrudd eller en oppfordring brukeren ikke ba om. Gaver skal være frivillige. Plasseringen må vurderes mot beregningsflyten; dette notatet fastsetter ikke en ny plassering.

**Vurder på nytt når:** Brukertester viser press, forvirring eller forstyrrelser. Ikke anta at et lite gavebeløp har ubetydelig økonomisk effekt for alle.

## Beslutningslogg: valg tatt i oktober 2026

Oppføringene over har ett alternativ hver. Oppføringene under har alle alternativene vi vurderte (A, B, C ...), slik at det går an å se hvorfor vi valgte A og ikke B eller C. Valgt alternativ er merket **(valgt)**.

**Status** er én av disse:
- **Vedtatt:** Lars har bestemt det, og det er (eller skal være) bygget slik.
- **Foreslått:** Beskrevet og begrunnet, men ikke bestemt.
- **Erstattet:** Overstyrt av en nyere beslutning. Oppføringen står igjen, med lenke til den nye.

Kildenotatene ligger i prosjektmappen «claude/» (ikke i repoet). PR-nummer står der de finnes.

### Innskudd ved månedsslutt

**Valg:** Månedlige innskudd regnes ved slutten av hver måned. Siste innskudd får ingen vekst.

**Alternativer:**
- A (valgt): Innskudd ved månedsslutt.
- B: Innskudd ved månedsstart. Gir litt høyere sluttbeløp (én måneds vekst på hvert innskudd, faktor 1,00407 ved 5 %).

**Begrunnelse:** Regelen er konsekvent med og uten kostnader, og er den forsiktigste av de to. Uavhengig kontroll med egen månedsløkke gir samme tall.

**Akseptert ulempe:** Andre kalkulatorer (for eksempel ODIN) bruker månedsstart og gir et litt høyere tall. Eksempel: 2 000 kr i måneden, 10 år, 5 % og 2,5 % prisvekst gir 241 177 kr hos oss og 242 159 kr hos ODIN. Forskjellen er forklart i metodeteksten.

**Vurder på nytt når:** Brukere reagerer på forskjellen mot andre kalkulatorer, eller lønn og trekk viser seg å skje tidlig i måneden for de fleste.

**Status:** Vedtatt. Kontrollert 23.10.2026 (resultatkortrapporten, PR #13).

### Innskudd i dagens kroner

**Valg:** Linjen «Du setter inn» i visningen med dagens kroner regner hvert innskudd om til prisnivået da det ble satt inn.

**Alternativer:**
- A (valgt): Hvert innskudd justert til sitt eget tidspunkt, månedsslutt. Eksempel (2 000 kr i måneden, 10 år, 2,5 % prisvekst): 212 446 kr.
- B: Hele summen av innskudd delt på sluttens prisnivå (det som var løsningen før). 187 488 kr i samme eksempel.
- C: Hvert innskudd justert ved månedsstart. 212 883 kr.

**Begrunnelse:** A svarer på «hvor mye kjøpekraft har jeg gitt fra meg?». B svarer på «hva er disse framtidige kronene verdt i dag?», og er en omregning, ikke et mål på hva brukeren har gitt fra seg. Med B fikk grafen innskuddene til å se for lave ut, og banken så ut til å slå innskuddene med 36 000 kr i kjøpekraft når riktig tall var rundt 11 000 kr før skatt.

**Akseptert ulempe:** Kroner og dagens kroner kan ikke sammenlignes direkte. Etiketten «Innskudd i dagens kroner» må forklares («det innskuddene kunne kjøpe da du satte dem inn»). Uttak i dagens kroner er ikke avklart.

**Vurder på nytt når:** Brukertester viser at navnet misforstås, eller når uttak i dagens kroner skal avklares.

**Status:** Vedtatt. PR #12, metodeteksten rettet i PR #22.

### Negativ forventet avkastning

**Valg:** Negativ forventet årlig vekst kan skrives inn, men glidebryteren i Enkel stopper på 0 %.

**Alternativer:**
- A (22.10, erstattet): Minst 0 % forventet vekst. Tap vises bare som børsfall og lavere vekst i scenariobåndet.
- B (valgt 23.10): Negativ vekst tillatt ved direkte inntasting, ned til over minus 100 %. Prisvekst og bankrente beholder 0 % som nedre grense.
- C: Teknisk grense på minus 50 %. Forkastet fordi tallet var vilkårlig.
- D: Åpne for negative verdier overalt, også prisvekst og bankrente. Ikke valgt: deflasjon og negativ sparerente er ikke vanlige regneeksempler.

**Begrunnelse:** Modellen bruker (1 + r) i potens 1/12 og (1 - k), som er definert for alle r over minus 100 % og aldri gir negativ verdi. Grensen er dermed ikke en ny antakelse. Vedvarende negativ avkastning er fortsatt ikke et vanlig regneeksempel, og teksten skiller den fra børsfall («Negativ avkastning gjør at ...» mot «Børsfallet gjør at ...»). Lån regnes i en egen lånekalkulator, ikke med negative sparebeløp.

**Akseptert ulempe:** Brukeren kan skrive inn urealistiske verdier som minus 40 % i 30 år. De gir et korrekt, men lite sannsynlig resultat. Prosjektbeskrivelsen (punkt 1.3) sier fortsatt 0 % som nedre grense og er ikke oppdatert.

**Vurder på nytt når:** Brukere tolker et negativt tall som en prognose, eller iPhone-testen viser at minustegn ikke kan skrives i feltet (alle felt hadde `inputmode="decimal"`, som mangler minus på iOS).

**Status:** Vedtatt 23.10.2026, erstatter beslutningen fra 22.10 (PR #10). Gjennomført i PR #14. **Ikke testet på iPhone.**

### Spareform setter forutsetningene

**Valg:** Brukskonto, Sparekonto og Indeksfond fyller forutsetningsfeltene synlig, med melding om hva som ble endret, kilde og dato, og «Angre».

**Alternativer:**
- A (22.10, erstattet): Valget endrer ingen tall, bare forklaringen. Lars testet på iPhone og fikk samme resultat (6 869 425 kr) for alle tre valg.
- B (valgt): Valget setter forutsetningene, og brukeren kan alltid skrive egne tall. Å fjerne valget endrer ingen tall.
- C: Konstruere historiske serier for hver spareform. Forkastet: ingen serie med avklarte rettigheter for fond (se historikk).

**Forutsetninger:**

| Valg | Forutsetning | Kilde |
| --- | --- | --- |
| Brukskonto | 0 % rente, 0 % kostnad | Regneeksempel. SSB har ingen serie for brukskontorente |
| Sparekonto | 2,87 % rente, 0 % kostnad | SSB tabell 11018, ikke-bundne innskudd, husholdninger, august 2026 |
| Indeksfond | 4,5 % forventet realavkastning pluss planens prisvekst (7,11 % ved 2,5 %) | Finans Norge, avtale om avkastningsprognoser, revidert 04.02.2026 |

**Begrunnelse:** Et valg som ikke endrer noe, er misvisende for brukeren. Tallene velges ikke for å gi et bestemt resultat.

**Akseptert ulempe:** SSB-tallet er et gjennomsnitt for beholdningen, ikke beste rente og ikke bare sparekonto. Finans Norges tall er en bransjestandard for prognoser, ikke en garanti. Med 2,87 % rente og 2,5 % prisvekst øker kjøpekraften litt før skatt. Etter skatt gjør den ikke det, og en etter-skatt-visning er ikke laget.

**Vurder på nytt når:** Finans Norge reviderer (årlig i februar, neste kontroll februar 2027), SSB publiserer nye renter, eller brukertester viser at folk leser forutsetningene som råd.

**Status:** Vedtatt 23.10.2026. PR #15, commit 073d7dc. Vedlikehold i `dist/assumptions.js`.

### Utfallsrom for indeksfond etter sparetid

**Valg:** Når Indeksfond er valgt, vises et «95 % utfallsrom (modell)» bygget på formelverket i Finans Norges avtale (vedlegg 2). Hvert innskudd får årlig avkastning r pluss Z · σ / √(år til slutt), med σ = 16 % og Z = ±1,96.

**Alternativer:**
- A: Det eldre båndet (± prosentpoeng, tre regneeksempler). Beholdes når Indeksfond ikke er valgt.
- B (valgt for indeksfond): Finans Norges formelverk, der usikkerheten i snittavkastningen faller med sparetiden.
- C: Monte Carlo-simulering. Ikke valgt, se «Synlig usikkerhet» over.

**Begrunnelse:** B har en kilde som kan etterprøves, og viser at kort sparetid gir større usikkerhet. For et engangsbeløp med 7,11 % er nedre del 0,71 av innskuddet etter 3 år og 1,23 etter 25 år.

**Akseptert ulempe:** Formelverket regner i hele år, så innskudd under ett år får samme usikkerhet som ett år. Grensene for hvert innskudd summeres, og det er ikke det samme som 2,5 %-persentilen for hele porteføljen i en simulering. Det er merket «modell» og er ikke en garanti, og metodeteksten skal si det.

**Vurder på nytt når:** Finans Norge endrer formelverket, eller en bedre modell kan etterprøves.

**Status:** Vedtatt 23.10.2026. PR #15, nedre del mot innskuddene i PR #23.

### Risikospørsmålet ut av startflyten

**Valg:** Spørsmålet «Hvor store svingninger tåler du?» er tatt ut av startflyten, og ekkoet «Du tåler store svingninger» under overskriften er fjernet.

**Alternativer:**
- A: Beholde spørsmålet og ekkoet som før.
- B: Fjerne bare ekkoet.
- C (valgt): Flytte spørsmålet ut av startflyten. Det finnes fortsatt i «Tilpass veiledningen» og i Spør om sparing.

**Begrunnelse:** Valget endrer ikke veksten, grafen eller båndet, men siden så ut som den brukte det (Lars: «det var uklart hva svaret ble brukt til»). «Noe uro» og «Store svingninger» har ingen nyttig funksjon i kalkulatoren. «Lite uro» har en liten funksjon i tips, sparemål og veileder, og den virker som før.

**Akseptert ulempe:** Veilederen og sparemålet får mindre personlig tilpasning ved første besøk.

**Vurder på nytt når:** Brukertesten viser at en forklaring av risikovalget («Dette betyr tallene dine») er nyttig. Spørsmålet kan da komme tilbake, men bare med en forklaring av hva det betyr for resultatet.

**Status:** Vedtatt 23.10.2026. PR #14. Risikovalget endrer aldri vekst, bånd eller graf, og en test låser det.

### Skatt vises etter modus

**Valg:** Enkel viser bare «Før skatt» og én setning om skatt. Utforsk får en valgfri visning etter skatt med faste forutsetninger. Avansert viser alle forutsetninger og kilder.

**Alternativer:**
- A: Alt før skatt, uten merknad (dagens, med merket «Før skatt på uttak»).
- B: Alt etter skatt overalt.
- C (valgt som prinsipp): Etter modus.

**Begrunnelse:** Skatt er sjelden det en nybegynner trenger først, men en ekspert vil se detaljene. Bank og fond må alltid vises på samme grunnlag. Før skatt overdrives fondets forsprang (22 % til 86 % i eksemplet i notatet), fordi gevinst på fond skattes med 37,84 % og renter med 22 %.

**Akseptert ulempe:** Etter-skatt-visningen blir forenklet. Formuesskatt, IPS, BSU, utbytte, utenlandske fond og rentefond er ikke med. Skjerming er en tilnærming.

**Vurder på nytt når:** Skattereglene endres (statsbudsjettet i oktober, skjermingsrenten i januar), eller noen med skattefaglig bakgrunn har lest notatet. Neste kontroll: januar 2027.

**Status:** Prinsippet er vedtatt 23.10.2026. Detaljene er **foreslått**, ikke bygget. Se `beslutning-skatt-2026-10-23.md`. Der står også at skjerming som standard i Utforsk ikke er avgjort.

### Standard prisvekst

**Valg:** Standard prisvekst i kalkulatoren er 2,5 %.

**Alternativer:**
- A (valgt): 2,5 %. Uendret.
- B: 2,0 %, som er Norges Banks mål og Finans Norges forutsetning.

**Begrunnelse:** Endringen ville flytte alle kontrolltall i testene og endre hvert eksempel i forklaringene, uten at det er en regnefeil.

**Akseptert ulempe:** Kalkulatoren bruker et høyere tall enn de som oppgis som mål og som langsiktig forutsetning.

**Vurder på nytt når:** Vi uansett går gjennom forutsetningene (Finans Norge-revisjonen i februar 2027), eller det kommer ny kunnskap om realistisk prisvekst.

**Status:** Vedtatt 23.10.2026. Spørsmålet om 2,0 % tas videre.

### Delte lenker: ett felt om gangen

**Valg:** Ved en delt lenke eller lagret plan med ugyldige felt tilbakestilles bare de ugyldige feltene, og brukeren får vite hvilke.

**Alternativer:**
- A: Nullstille hele planen ved første ugyldige felt (som før).
- B (valgt): Validere felt for felt, la gyldige felt stå, og kontrollere hele planen på nytt. Er kombinasjonen fortsatt ugyldig, nullstilles alt.

**Begrunnelse:** A kaster bort gyldige opplysninger og forklarer ikke hva som var feil. Den ekstra kontrollen av helheten hindrer inkonsistente beregninger.

**Akseptert ulempe:** Brukeren kan få en plan som ikke er den som ble delt. Varselet må si hva som ble endret.

**Vurder på nytt når:** En test viser en kombinasjon som gir et misvisende, men gyldig resultat.

**Status:** Vedtatt. PR #5 (fase 1).

### Historiske eksempler

**Valg:** Foreslått første versjon bruker SSB-data for prisvekst (KPI, tabell 14709) og sparekonto (tabell 11018, ikke-bundne innskudd for husholdninger), og utelater indeksfond.

**Alternativer:**
- A: Konstruere en fondsserie. Forkastet: ikke kontrollerbart.
- B: Bruke en MSCI-indeks. Forkastet: videre publisering krever skriftlig samtykke fra MSCI.
- C (foreslått): Utelate indeksfond til én navngitt serie med avklarte rettigheter finnes.
- D: Bruke Norges Banks tall for Statens pensjonsfond utland. Forkastet: det er ikke et fond for privatpersoner.

**Begrunnelse:** Ingen tall skrives av fra nettsider, og ingen serie konstrueres. Brukskonto vises som beregnet illustrasjon (0 % rente med faktisk prisvekst), ikke som dokumentert historikk. Perioden (desember 2013 til august 2026) er hele den felles dekningen, ikke valgt ut fra resultatet.

**Akseptert ulempe:** Første versjon viser ikke aksjer, som er det mange vil sammenligne med.

**Vurder på nytt når:** En forvalter gir tillatelse til å bruke historiske andelsverdier, eller en indeks med lisens finnes.

**Status:** Foreslått. Ingen kode. Venter på datatilgang (`data.ssb.no` eller CSV). Se `historikk-data-og-metode-2026-10-23.md`.

### Spill og poeng

**Valg:** Ikke implementert nå. Hvis det kommer, skal det belønne forståelse, ikke aktivitet.

**Alternativer:**
- A: Poeng, troféer og dager på rad. Ikke anbefalt: måler bruk, ikke læring.
- B (anbefalt): «Gjett før du ser» og «Forklar sammenhengen», for tidløse sammenhenger (kjøpekraft, renters rente, kostnader, risiko).
- C: Ingenting.

**Regel uansett valg:** Tilgang til kunnskap avhenger aldri av poeng, troféer eller fullførte oppgaver. Ingen tidsfrister. Framgang lagres bare lokalt og kan slettes.

**Vurder på nytt når:** Forklaringene, søket og veiene mellom veileder og kalkulator er på plass, og universell utforming er kontrollert.

**Status:** Anbefalt, ikke vedtatt. Se `laering-og-fordypning-2026-10-24.md`.

## Bruk notatet videre

Ved viktige nye valg: Legg til problemet, valgt løsning, **alle alternativene vi vurderte** (A, B, C ...), begrunnelsen, ulempen vi aksepterer, hva som kan få oss til å endre mening og **status**. Legg det inn samme dag som valget tas, mens begrunnelsen er ny.

Når et valg endres: Ikke slett den gamle oppføringen. Sett den til «Erstattet», skriv hva som endret avveiningen, og lag en ny oppføring.

Skill mellom:
- En påvist feil.
- Ny kunnskap som endrer en tidligere avveining.
- En kjent ulempe vi fortsatt aksepterer.
- Et forslag som hører til en senere fase.

Det som står under «Foreslått», er ikke et løfte om at det blir bygget.

Målet er å bevare tankearbeidet, ikke å fryse prosjektet.

## Samlet arbeidsgrunnlag før videre innhold (24. oktober 2026)

**Valg:** Arbeidsregler, språkregler, faseplan, beslutningslogg og den ene spørsmålkøen samles på main. Deretter åpnes kontrollert innholdspåfyll i små PR-er etter planens punkt 6. Daglig research forblir upublisert. Valgomaten venter.

**Alternativer:** A: Fortsette med regler i flere grener og samtaler. B: Fylle hele kunnskapsbasen med en gang. C: Begynne på valgomaten nå. Disse velges bort fordi felles arbeidsgrunnlag, sporbarhet og kontroll må være på plass først.

**Begrunnelse:** Neste bidragsyter skal finne både hva vi gjør og hvorfor i repoet. Eksisterende svar kontrolleres før nye duplikater skrives.

**Akseptert ulempe:** Nye funksjoner og stort innholdspåfyll tar lengre tid. Skjermleserkontroll står fortsatt åpen og omtales ærlig.

**Vurder på nytt når:** Arbeidsflyten er prøvd på små innholdsleveranser og kvaliteten er dokumentert. Valgomatens mål om nedlastbart hverdagsbudsjett tas med i separat planlegging.

**Status:** Vedtatt av Lars i oppdraget 24. oktober 2026. Dette er ingen generell fullmakt for nattoppgaven til å slå sammen eller publisere.

## Sluttkontroll av søket (24. oktober 2026)

**Valg:** Claude anbefaler å avslutte utviklingsrunden for søket på main `4022c94`, med to nye kjente hull (utbytte, rentefond). Videre arbeid med søket begrenses til feil svar, hindringer i betjeningen og gjentakende problemer fra faktisk bruk. Andre ønsker går i `SPORSMALSKO.md`.

**Alternativer:** A: Fortsette å justere søket mot egne testsett. B: Bytte til MiniSearch (#55). C: Avslutte nå og gå til kontrollert innholdspåfyll. Anbefaler C. A gir overtilpasning til sett vi selv har skrevet. B ga ikke nok bedre resultat til å forsvare ny avhengighet og endret oppførsel.

**Begrunnelse:** 0 misvisende direkte svar i 156 tilfeller (1 hvis forventningen for «bolig spare konto» ikke justeres, se rapporten). 115 av 115 prioriterte søk har relevant svar eller valg blant de tre første. Se `research/sok-sluttkontroll/RAPPORT.md`.

**Akseptert ulempe:** Testsettene er skrevet av Claude og holdout er brukt. Ikke testet: iPhone Safari, skjermleser, brukere. «konto» alene og enkelte «aksj»-sammensetninger gir svak veiledning.

**Vurder på nytt når:** Faktisk bruk viser feil svar eller gjentakende problemer, innhold endrer hvilke ord som har én eier, eller iPhone- og skjermlesertesting avdekker hindringer.

**Status:** Anbefalt, ikke vedtatt. Lars avgjør.
