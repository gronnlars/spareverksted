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

## Svar skrevet på forhånd, ikke laget av KI mens brukeren venter

**Valg:** «Spør om sparing» viser tekster som er skrevet og kildekontrollert før publisering, med kilder og kontrolldato. Kildekontrollen kan være utført med KI; menneskelig eller uavhengig fagkontroll oppgis bare når den er dokumentert. Det er reglene på siden som velger hvilken tekst brukeren ser. KI brukes i stor grad når tekstene skrives, men ingen KI-modell lager svar mens brukeren er på siden.

**Alternativ:** La en språkmodell skrive personlige svar i det brukeren spør.

**Begrunnelse:** Svarene skal være etterprøvbare, forutsigbare og mulige å vedlikeholde. Tjenesten skal ikke kreve innlogging, reklame eller eksterne KI-kall.

**Akseptert ulempe:** Søket forstår ikke alle formuleringer, og veilederen kan ikke svare fritt på alt. Manglende dekning skal ikke skjules med et irrelevant svar.

**Vurder på nytt når:** Faktiske spørsmål viser hull i ruting eller innhold. Utvid kvalitetssikret dekning i riktig fase.

**Presisert 25. oktober 2026:** Overskriften het tidligere «Forhåndsskrevne svar framfor KI-svar». Den kunne leses som at tekstene er skrevet uten KI. Det stemmer ikke. Valget gjelder hvordan svaret vises for brukeren, ikke hvordan teksten er laget. Kravet i språkreglene om naturlig norsk gjelder skrivestilen, ikke hvordan teksten er produsert.

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

## Lokal lagring og personvernside (25. oktober 2026)

**Valg:** Lagre minst mulig og bare etter en handling fra brukeren. `sv-started` flyttes fra `localStorage` til fanens `sessionStorage`, og lagrede planer regnes også som start. Visningsnivå lagres bare når brukeren selv trykker på et nivå, aldri «Enkel» og aldri ved automatisk tilbakestilling. Arbeidsplanen og veilederkonteksten opprettes bare når brukeren går til «Spør om sparing», ikke ved hver `pagehide`. Ny side `personvern.html` med sletteknapp for Spareverksteds egne nøkler. Ingen samtykkeboks.

**Alternativer:** A: Beholde dagens lagring og skrive en forklaring. Valgt bort fordi `sv-started` ble lagret permanent uten noe uttrykkelig ønske, også når en delt lenke ble åpnet, og `sv-level` ble skrevet med standardverdien ved oppstart. B: Fjerne all lagring av tema og nivå. Valgt bort foreløpig fordi brukeren selv trykker på valget, og fordi Nkom ikke er spurt ennå. C: Flytte tema og nivå til `sessionStorage`. Mulig etter svar fra Nkom; en enkel endring. D: Samtykkeboks. Valgt bort fordi ingen kjent lagring er sporing eller statistikk, og en boks for uavklarte funksjoner ville være å skyve problemet over på brukeren. E: Slette arbeidsplanen når den er hentet tilbake. Valgt bort fordi omlasting av kalkulatoren da mister planen, og en utdatert plan hindres uansett ved at `pagehide` oppdaterer en plan som finnes.

**Begrunnelse:** Ekomloven § 3-15 gjelder all lagring i nettleseren, også uten personopplysninger. Unntaket gjelder det som er strengt nødvendig for en tjeneste brukeren uttrykkelig har bedt om. Lagring etter et konkret trykk står sterkere enn lagring ved oppstart.

**Akseptert ulempe:** En bruker uten lagrede planer ser startguiden igjen ved nytt besøk. Går brukeren til «Spør om sparing» via adressefeltet eller Om-siden i stedet for lenken i kalkulatoren, følger ikke planen med. Personvernsiden har punkter merket «Avklares» og er merket `noindex`.

**Vurder på nytt når:** Nkom eller Datatilsynet svarer, ansvarlig og kontakt er avklart, eller hostingen endres.

**Status:** Foreslått i PR, ikke vedtatt. Lars avgjør. Gjort på eget oppdrag fra Lars under pausen (docs/regulatorisk.md).

## Tema og nivå huskes bare i fanen (26. oktober 2026)

**Beslutning:** Lars vedtok alternativ B i `docs/personvern-lagring.md`: fargetema (`sv-color-theme`) og visningsnivå (`sv-level`) lagres i `sessionStorage` og ikke i `localStorage`. (Bokstavene følger dokumentet; i oppføringen over fra 25. oktober har B og C andre betydninger.)

**Begrunnelse:** Mindre permanent lagring uten å fjerne funksjonen. Valget gjelder så lenge fanen brukes, og huskes ikke til neste besøk.

**Akseptert ulempe:** Brukeren må velge på nytt neste dag og i hver ny fane. Gamle permanente verdier fjernes og leses ikke.

**Ikke avgjort:** Fanelagring er ikke garantert slettet ved lukking, siden nettlesere kan gjenopprette faner. Det avgjør ikke alene om ekomloven § 3-15 gjelder. Spørsmålet ligger hos Nkom.

## Hvorfor KI-informasjonen ble publisert mens prosjektet er på pause (26. oktober 2026)

**Beslutning:** Lars godkjente 26.10.2026 at PR #80 («Synlig KI-informasjon på forside og søkeside») ble slått sammen og publisert (main `b2eada7c7805b428835025d6d729218b5367a888`). Publiseringskjøringen gikk grønt. Lars bekreftet med skjermbilde (Safari på iPhone, 26.10.2026) at KI-linjen vises på forsiden; Om-siden og søkesiden er ikke sett på iPhone, og nettverkstrafikk, HTTP-hoder og servercookies er ikke kontrollert. Etter dette gjøres ingen nye publiseringer før svar fra Domene.no og Nkom foreligger.

**Begrunnelse (Lars):** Endringen handlet ikke om generelle finansielle spørsmål. Den handlet om åpenhet om hvordan innholdet lages, og om personvern og etterrettelighet, som har vært grunnmuren i prosjektet fra start. GPT vurderte at den ikke berører det som er spurt Finanstilsynet om. Den vurderingen er en KI-vurdering av endringens omfang, ikke en juridisk godkjenning. Finanstilsynet er ikke spurt om akkurat denne endringen, og vurderingen er ikke en uttalelse fra dem.

**Hva som ble publisert:** Én linje på forsiden, en tilsvarende tekst ved «Spør om sparing» og en seksjon på Om-siden. Ingen endring i beregninger, spørsmål, kunnskapsbase eller eksempler. Ingen lagring er endret i denne publiseringen.

**Ikke publisert:** PR #78 (personvernside, kontaktknapper, fanelagring av tema og nivå). Den venter på svar og på at kontaktadressene er mottakstestet.


## Grunnlag og sletting for e-post på personvernsiden (27. oktober 2026)

**Beslutning:** Lars godkjente 27.10.2026 at personvernsiden oppgir berettiget interesse (GDPR art. 6 nr. 1 bokstav f) som grunnlag for å lese og svare på e-post, med interesseavveiningen i `docs/kontakt-epost.md`, og sletteteksten: sletting fra innboksen på forespørsel, med mindre vi må beholde meldingen, og uten løfte om sletting av kopier hos Domene.no eller i Googles sikkerhetskopier.

**Alternativer vurdert:**
- A. Berettiget interesse med dokumentert avveining. **Valgt.**
- B. Samtykke. Ikke valgt: avsenderen tar selv kontakt og venter svar, og samtykke må kunne trekkes tilbake, noe som passer dårlig for å dokumentere svar på rettighetsforespørsler.
- C. Ikke oppgi grunnlag før juridisk avklaring. Ikke valgt: siden skal beskrive status nå og endres ved behov.
- Sletting: «Ber du oss slette, sletter vi» (Claudes første utkast) ble forkastet som for kategorisk. GPTs forslag («når vi ikke lenger har lovlig grunnlag») ble omskrevet til konkret språk med samme innhold.

**Akseptert ulempe:** Ingen fast slettefrist ennå. Vurderingen er skrevet av KI og ikke kontrollert av jurist.

**Vurder på nytt når:** Datatilsynet eller Domene.no svarer, e-postløsningen endres, eller Lars velger slettefrist.

**Sperre for publisering av PR #78:** Lars opplyser 27.10.2026 at e-postaliasene for personvern og generell kontakt ikke virker ennå. Siden kan ikke publiseres med en kontaktadresse som ikke når fram. Main har per 27.10.2026 ingen e-postadresser; kontakt skjer via GitHub. Lars vurderer at cPanel, som Domene.no ser ut til å bruke, er programvare hos leverandøren og ikke en egen part siden må nevne.

**Endring samme dag:** Lars byttet 27.10.2026 fra videresending til egne e-postkasser hos Domene.no, lest med Gmail-appen via IMAP. Personvernsiden er skrevet om tilsvarende: meldinger lagres i e-postkassen hos Domene.no, Google «kan» behandle dem via Gmail-appen (ikke bekreftet), og sletteteksten gjelder e-postkassen. Sending virker; mottak er ikke bekreftet. Detaljer i `docs/kontakt-epost.md`.

**Sperren for aliasene er løst 27.10.2026:** MX-oppføring manglet og er lagt inn (`10 loke.domene.no`). Lars bekrefter mottak utenfra. PR #78 kan publiseres når Lars bestemmer det. SPF og DKIM gjenstår.

## Personvernsiden publiseres (27. oktober 2026)

**Beslutning:** Lars godkjente 27.10.2026 publisering av PR #78 (personvernside, kontaktknapper, fanelagring av tema og nivå). `noindex` og utkastmerkingen er fjernet. Dette erstatter forbeholdet i oppføringen fra 26.10.2026 om at ingen nye publiseringer skulle skje før svar fra Domene.no og Nkom.

**Begrunnelse:** Siden beskriver status per 27.10.2026 og sier rett ut hva som ikke er avklart. E-post virker begge veier, med SPF, DKIM og DMARC `PASS`. Lars og GPT har lest gjennom teksten, og påpekte feil er rettet.

**Akseptert ulempe:** Leverandørforhold (ansvar, lagringssted, slettetider hos GitHub, Domene.no, MailChannels og Google) er fortsatt uavklarte. Svar fra Nkom kan kreve endring av fanelagringen.

**Ikke berørt:** Prosjektpausen etter henvendelsen til Finanstilsynet gjelder fortsatt for alt annet innhold. Denne publiseringen gjelder personvern og lagring.

**Vurder på nytt når:** Nkom, Datatilsynet eller leverandørene svarer, eller Lars' iPhone-sjekk etter publisering viser feil.

## «Jeg» i stedet for «vi» på Om-, personvern- og tilgjengelighetssiden (28. oktober 2026)

**Beslutning:** Lars vedtok 28.10.2026 at sidene skal bruke «jeg», fordi det er én person som står ansvarlig. KI-verktøyene er nevnt med navn på Om-siden. «Sammen har vi» om Lars og ChatGPT står, fordi det gjelder samarbeidet.

**Alternativer:** A. «Jeg» på de tre sidene nå, resten senere. **Valgt.** B. «Jeg» på hele nettstedet nå. Ikke valgt: kalkulator og veileder er fryst eller på pause. C. Beholde «vi». Ikke valgt: virker misvisende når bare én person står bak.

**Samtidig:** ny seksjon «Hva du kan bruke Spareverksted til» på Om-siden med lenke til kildereglene og til Forbrukerrådet: oversiktssiden «Økonomi og betaling» (sist endret 29.04.2024) og sjekklisten før sparing og investering (sist endret 10.05.2024), begge på nynorsk ifølge teksten. Lars ba om en mer generell lenke og lot Claude velge; begge ble tatt med fordi setningen gjelder økonomiske valg generelt, mens sjekklisten er det mest konkrete rådet. Kontaktteksten ber nå folk ikke dele sensitive opplysninger og sier at det ikke gis personlig økonomisk rådgivning. Den gamle setningen «Regler og satser kan endre seg …» er fjernet fordi den nye seksjonen dekker den. «Prognoser» og «uavhengige fagkilder» fra Lars' utkast er erstattet, fordi kalkulatoren viser regneeksempler og kildereglene også bruker merkede kommersielle kilder.

**Vurder på nytt når:** flere personer blir med og står ansvarlig.

## Kildereglene vedtatt, og kildegjennomgang før hvert nytt spørsmål (28. oktober 2026)

**Beslutning:** Lars godkjente `KILDEREGLER.md` (PR #71) 28.10.2026, etter at tre ting ble lagt inn: universiteter som eget grunnlag for regnemetoder (vedtatt 25.10, men ikke ført inn før nå), krav om at kilden faktisk svarer på påstanden, og at det som ikke er avklart, ikke publiseres. Nivå 1 gjelder alle offentlige etater og rettskilder, og medier på nivå 4 kan hjelpe med forståelse og ideer, men er aldri eneste kilde.

**Arbeidsregel:** Lars har bedt GPT gå gjennom kildereglene og relevante kilder før hvert nye spørsmål lages. Alt innhold skal gås gjennom på nytt før publisering den dagen pausen eventuelt oppheves.

**Konsekvens:** Svarutkast som sier at noe er uavklart (for eksempel BSU ved utenlandsflytting), må tilpasses før de publiseres.

## Kortere delingslenker: bare feltene for delen som deles (28. oktober 2026)

**Beslutning:** Lars godkjente 28.10.2026 at «Del plan» bare tar med feltene for delen brukeren ser på. Sparing: sparetallene, uten sparemål, uttak og skatt. Sparemål: bare sparemålsfeltene. Uttak: sparing, uttak og skatt, uten sparemål. Alder, risikovalg og de andre private feltene var allerede holdt utenfor og er det fortsatt.

**Bakgrunn:** Kontroll 28.10.2026 viste at lenken hadde 52 verdier fra alle deler, også deler brukeren ikke hadde åpnet. Påstanden om at alder og risikovalg ikke er med, stemte (testet, og allerede sikret i `veileder-browser.cjs`). En første antakelse om at `start=38` var alder, var feil: `start` er startbeløpet.

**Alternativer:** A. Felt for delen som deles. **Valgt.** B. Utelate felt som er lik standardverdien. Ikke valgt: gamle lenker kunne gi et annet resultat hvis en standardverdi endres. C. Beholde alt. Ikke valgt: dataminimering.

**Kalkulatorfrysen:** Lars vurderer at endringen ikke endrer beregningene. Testen `tests/deling-browser.cjs` kontrollerer at resultatet er likt med ny og gammel lenke i alle tre deler.

**Akseptert ulempe:** Har du fylt inn uttak og deler fra sparing, ser ikke mottakeren uttaket ditt.

**Bakoverkompatibilitet:** Koden som leser lenker, er ikke endret. Gamle, fulle lenker virker som før.

## Kontroll av premiss og mulig oppfattet anbefaling (28. oktober 2026)

**Status:** Vedtatt av Lars 28.10.2026 (PR #87). Dette er bare dokumentasjon og endrer ikke nettsiden, kalkulatoren, søket, svarbasen, testene eller automatiseringen.

**Sammenslåing under pausen:** Lars godkjente 28.10.2026 at PR #77 (pausenotatet), #79 (KI-presisering) og #87 slås sammen til main, i den rekkefølgen. Det er hans eget unntak etter `docs/regulatorisk.md`. Ingen filer i `dist/` er endret. Sammenslåingen starter publiseringsflyten, men endrer ikke det brukeren ser. Pausen gjelder ellers uendret.

**Innhold:** Tre korte tillegg i eksisterende dokumenter. SPRAKREGLER.md, punkt 7: kontroller hva leseren kan oppfatte at teksten anbefaler. `research/DAGLIG-OPPGAVE.md`: undersøk premisset i spørsmålet, og noter begge kontrollene i svarmalen. `research/plan.md`, punkt 3: tre forståelsesspørsmål til eventuell senere brukertesting.

**Alternativer:** A. Tillegg i dokumentene som allerede styrer arbeidet. **Valgt.** B. Egen sjekkliste for anbefalingskontroll. Ikke valgt: blir et konkurrerende dokument. C. Ny regel i KILDEREGLER.md. Ikke valgt: kildereglene handler om kilder og ble nettopp vedtatt. K5 dekker egne råd, mens dette gjelder hvordan en tekst kan oppfattes.

**Bakgrunn:** FinAuts podcastepisode «Når KI gir økonomiske råd: Hva skjer med rådgiverrollen og tilliten?» er pedagogisk inspirasjon. Den er ingen rettskilde og ingen dokumentasjon på at Spareverksted er godkjent. Læringspunktene: mer informasjon gir ikke nødvendigvis forståelse, brukeren kan søke bekreftelse på et feil premiss, og forklaringer kan oppfattes som anbefalinger.

**Kilde, gjengitt fra PR #81 og ikke nylest:** ESMA, *Q&A on MAR* (ESMA70-145-111), Q&A 8.2. En tekst uten navngitt instrument eller utsteder er som hovedregel ikke en anbefaling, men kan være det hvis en rimelig investor kan utlede at den underforstått anbefaler bestemte instrumenter eller utstedere. Dette gjelder investeringsanbefalinger etter markedsmisbruksforordningen (MAR). Det sier ingenting om personlig investeringsrådgivning etter verdipapirhandelloven. Hvor grensen går for Spareverksted, er spørsmålet som er sendt Finanstilsynet.

**Akseptert ulempe:** Kontrollene er egenkontroll. «Ingen identifisert ved egenkontroll» er ingen garanti, og ingen uavhengig eller juridisk kontroll.

**Ikke gjort her:** Samordning med prosjektpausen. Pausen og sperren for kontekstuell spørsmålsveiledning står i `docs/regulatorisk.md`. Notatet viser til `docs/vurdering-folkeopplysning.md`, som bare finnes i PR #81; henvisningen virker først når #81 er avgjort. Forslag til egen PR, ikke vedtatt: automatiseringens snevrere mandat beskrives i `docs/regulatorisk.md` som det som gjelder under pausen, ikke som fast regel. `research/DAGLIG-OPPGAVE.md`, steg 5, får en henvisning om at betingede personaliseringsregler bare er utkast og omfattes av sperren.

**Vurder på nytt når:** Finanstilsynet svarer, eller brukertesting viser misforståelser som kontrollene ikke fanger.

## Forskningsinstitutter som eget kildenivå, og rolle avgjør nivået (28. oktober 2026)

**Status:** Foreslått, ikke vedtatt. Endrer bare `KILDEREGLER.md` og denne loggen, ikke nettsiden, kalkulatoren, søket, svarbasen eller testene. PR-en er laget fordi Lars ba om det i samtale 28.10.2026, som unntak fra pausen i `docs/regulatorisk.md`. Ingen sammenslåing før Lars godkjenner.

**Bakgrunn:** Lars spurte om SIFOs referansebudsjett kan brukes som kilde. SIFO var ikke uttrykkelig omfattet av kildereglene vedtatt i PR #71. SIFO er ikke en etat (nivå 1), og kategorien for universiteter ved siden av nivåene gjelder bare formler og definisjoner, ikke norske tall. Forslaget er bearbeidet i flere runder mellom Lars, Claude og GPT.

**Endringer i KILDEREGLER.md:**
1. Nytt nivå 3: norske, offentlig finansierte forskningsinstitutter og universiteter innenfor eget fagfelt, med SIFO som eksempel. Bankene blir nivå 4, mediene nivå 5 og «alt annet» nivå 6. Oppføringen over fra 28.10 (PR #71) sier «medier på nivå 4». Det var riktig da og er ikke endret.
2. Nivå 1 beskrives med et kriterium og eksempler, også Norges Bank som offentlig og ikke-kommersiell. Eksemplene står fordi grensen mot Forbrukerrådet ellers blir uklar: Forbrukerrådet er selv et statlig forvaltningsorgan (Store norske leksikon, https://snl.no/Forbrukerrådet, lest 28.10.2026).
3. Ny regel: rolle og innhold avgjør nivået, ikke institusjonsnavnet. Regelverk, vedtak, myndighetsveiledning om gjeldende regler og offisiell statistikk er nivå 1. Analyser, prognoser og modeller fra offentlige myndigheter er nivå 3 etter innholdet, også når organet ikke er et forskningsinstitutt. Dette står både i nivå 3 og i rolleregelen, slik at en analyse fra et direktorat eller tilsyn ikke faller mellom ordlydene (påpekt av GPT 28.10.2026).
Forbrukerrådet og Finansportalen er unntatt fra rolleregelen: alt de publiserer på egne sider, også analyser og rapporter, er nivå 2. Uten denne setningen ville Forbrukerrådets analyser havnet på nivå 3, under deres egne korte råd, og det var uklart om Forbrukerrådet er en «offentlig myndighet». Godkjent av Lars 28.10.2026. Primærkilderegelen gjelder fortsatt, så en pressemelding fra Forbrukerrådet er omtale.
4. Ny regel om primærkilde: omtaler og pressemeldinger brukes bare til å finne primærkilden. En offisiell kunngjøring fra organet som selv har fattet vedtaket, er primærkilde for at vedtaket er fattet og når det gjelder fra. En pressemelding som bare omtaler et vedtak, er det ikke. Konsekvens: er selve vedtaket eller kunngjøringen ikke tilgjengelig, publiseres ikke påstanden. Strengheten er bevisst og bekreftet av Lars 28.10.2026: Spareverksted skal ikke komme med egne eller andres påstander uten primærkilde. Videre: en kilde som gjengir andres tall er ikke egen kilde for tallet, og manglende tilgang dokumenteres i stedet for å erstattes med en omtale.
5. Ny regel om modeller og referansebudsjetter.
6. Følgeendringer: K3 (kildedato på nivå 3, 4 og 5), K7 (årlig kontroll av SIFOs referansebudsjett) og sjekklistens punkt 2.

**Roller notert, ikke skrevet inn i reglene:** Statens pensjonskasse og Husbanken er nivå 1 for egne ordninger og regelverk. KLP er nivå 4 som finansinstitusjon. Det gjelder ikke nødvendigvis alt KLP skriver om offentlig tjenestepensjon. Det avgjøres av rolleregelen og kontroll mot primærkilden. Ingen av disse kategoriseringene er kontrollert mot institusjonenes egne dokumenter ennå.

**SIFO:** Referansebudsjettet er verken et minstebudsjett eller et gjennomsnitt, dekker ikke blant annet bolig, strøm og feriereiser, og oppdateres årlig (https://www.oslomet.no/no/om/sifo/referansebudsjettet, lest 28.10.2026).

**Alternativer:**
A. Nytt nivå 3 med rolleregel og primærkilderegel. **Valgt.**
B. GPTs første utkast: forskningsmiljøer som «prioriterte fagkilder» uten nivå, og bredt «relevante forskningsmiljøer ved norske universiteter». Ikke valgt: ingen plass i rekkefølgen, og åpner for enkeltstudier og kronikker.
C. SSB på nivå 3. Ikke valgt: da går Forbrukerrådet foran offisiell statistikk som KPI.
D. Nivå 1 uten eksempler. Ikke valgt: grensen mot Forbrukerrådet og Norges Bank blir uklar.
E. Utvide universitetskategorien ved siden av nivåene. Ikke valgt: den gjelder formler, ikke norske tall.
F. «Nivåene angir hovedprioritet, ikke absolutt rangering», med skjønnsmessig vekt på relevans. Ikke valgt: gir rom for å begrunne en lavere kilde med «relevans». Problemet løses av regelen om at en kilde som gjengir andres tall, ikke er egen kilde.
G. Nytt datokrav for alle nivåer i K3. Ikke valgt: K1 og K3 krever allerede kildedato og kontrolldato for hver påstand.
H. «Primærkilden når den finnes og er tilgjengelig.» Ikke valgt: kan leses som at manglende tilgang åpner for en sekundærkilde. I stedet: manglende tilgang dokumenteres, og påstanden venter.

**Lovdata og innlimt tekst:** KI-verktøyene når ikke alltid Lovdata. Da kan Lovdata bare brukes når teksten faktisk er lest i økten. Limer Lars inn lovtekst, er det en kopi, og den må ha URL og dato for siste endring (K1, K3). Ingen ny regel trengs.

**Akseptert ulempe:** Seks nivåer og to nye avsnitt gjør reglene lengre. Rolleregelen krever at bidragsyteren vurderer innholdstype, ikke bare avsender.

**Avhengighet til åpne PR-er:** PR #69 (`docs/maaneder-og-kildenivaa`) har oppføringen «Kildenivå for påstander og råd» med den gamle listen på fem nivåer. Slås #69 sammen etter denne, er den oppføringen historikk og må ikke leses som gjeldende nivåer. PR #67 viser til «nivå 1 eller 2», som fortsatt er riktig.

**Ikke gjort her:** Den brutte henvisningen øverst i KILDEREGLER.md til oppføringene «Kildenivå for påstander og råd» og «Sparehorisont og Forbrukerrådets anbefaling». De finnes bare på de usammenslåtte grenene `docs/maaneder-og-kildenivaa` og `feature/sparehorisont-varsel`. Håndteres i egen PR.

**Vurder på nytt når:** en kilde faller mellom to nivåer, eller samme avvik oppstår to ganger.
