# Hvorfor Spareverksted er laget slik

Beslutningsnotat, 24. oktober 2026.

Les dette før du foreslår større endringer. Notatet samler prinsipper og valg fra prosjektarbeidet. Det er ikke dokumentasjon på at alle deler er ferdige eller fullstendig brukertestet.

## Aktive avvik fra reglene

Et avvik utløper på datoen og må fornyes eller fjernes. Se [KILDEREGLER.md](KILDEREGLER.md), «Når en regel må brytes». Kontrollrunden går gjennom tabellen, og den som gjør runden varsler Lars minst to uker før utløp.

| Hva | Regel | Godkjent av | Utløper | Fornyes av | Status |
| --- | --- | --- | --- | --- | --- |
| Varsel om sparehorisont for Indeksfond under 5 år på kalkulatorsiden (PR #67) | Kalkulatorfrysen (plan, punkt 0) | Lars ved sammenslåing | 31.01.2027 | Lars | Foreslått. Aktivt først når #67 er slått sammen |
| Nøytrale begrepsforklaringer publiseres under pausen | Prosjektpausen og kalkulatorfrysen (`docs/regulatorisk.md`) | Lars 28.10.2026 kl. 10.09 | Når pausen oppheves | Lars | Vedtatt. Aktivt når PR-en med unntaket er slått sammen |
| Forbedringer i kildekrav, UU, personvern og retting av opplagte lovbrudd under pausen | Prosjektpausen (`docs/regulatorisk.md`) | Lars 28.10.2026 | Når pausen oppheves | Lars | Vedtatt. Aktivt når PR-en er slått sammen |

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

**Status:** Vedtatt av Lars 28.10.2026 (PR #88). Endrer bare `KILDEREGLER.md` og denne loggen, ikke nettsiden, kalkulatoren, søket, svarbasen eller testene.

**Sammenslåing under pausen:** Lars godkjente 28.10.2026 at PR #88 og deretter PR #89 (rettet innledning og brutte henvisninger i KILDEREGLER.md) slås sammen til main. Det er hans eget unntak etter `docs/regulatorisk.md`. Ingen filer i `dist/` er endret. Sammenslåingen starter publiseringsflyten, men endrer ikke det brukeren ser. Pausen gjelder ellers uendret.

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

## Unntak fra pausen for nøytrale begrepsforklaringer (28. oktober 2026)

**Status:** Vedtatt av Lars 28.10.2026 kl. 10.09. Kravene står i `docs/regulatorisk.md`, «Unntak fra pausen: nøytrale begrepsforklaringer». Aktivt når PR-en med unntaket er slått sammen.

**Beslutning:** Forklaringer av nøytrale begreper kan publiseres under pausen og uten hensyn til kalkulatorfrysen, når de bare forklarer betydning, ikke nevner produkter eller tilbydere, ikke tilpasses brukeren og følger kilde- og språkreglene. Første runde gjelder begreper som ikke hviler på regler eller satser.

**Erstattet samme dag:** Begrensningen til «bare betydning» og til begreper uten regler eller satser gjelder ikke lenger. Gjeldende regel står i oppføringen «Nøytrale spørsmål og svar om økonomiske begreper» og i `docs/regulatorisk.md`, krav 1 og 4.

**Bakgrunn:** Veikartet (28.10.2026, trinn 3.0) krever at alle fagord på siden skal kunne slås opp. I dag er 18 begreper forklart, spredt inne i enkeltsvar. Finanstilsynets artikkel lest 27.10.2026 gjelder personlige råd om hva man bør kjøpe, selge eller beholde. At en forklaring av hva et begrep betyr faller utenfor, er Claudes og Lars' vurdering, ikke en juridisk avklaring. Forslaget er bearbeidet mellom Lars, Claude og GPT.

**Alternativer:**
A. Unntak for nøytrale begreper med kontrollerbare krav. **Valgt.**
B. Vente på Finanstilsynet med alt. Ikke valgt: lav risiko, stor nytte og ukjent ventetid.
C. Unntak for alt innhold i veilederen. Ikke valgt: svar om valg mellom alternativer er nettopp det Finanstilsynet er spurt om.
D. Unntaket omfatter også ny funksjonalitet (forklaring der ordet står, ordlisteside). Ikke valgt nå: ny kode krever egen test og prøving med hjelpemidler. Standarden fastsettes nå (oppføringen under), bygging venter til oppstart. **Endret samme dag, to ganger:** Lars vedtok først at forklaring der ordet står og ordlisten er UU og kan bygges nå. Senere samme dag sluttet han seg til GPTs innspill om at bare retting av dokumenterte UU-feil åpnes. Forklaring der ordet står og ordlisten er nye funksjoner og venter til oppstart, som opprinnelig.
E. Kontroll bare med en liste over forbudte ord. Ikke valgt: en tekst kan styre valg uten de ordene (påpekt av GPT 28.10.2026). Listen er et varsel, hele teksten vurderes.

**Akseptert ulempe:** «Nøytral» er en vurdering. Kontrollen er egenkontroll pluss kontroll av en annen enn skribenten, ingen juridisk kontroll.

**Vurder på nytt når:** Finanstilsynet svarer, eller en forklaring viser seg å bli lest som en anbefaling.

## Standard for fagord forklart der de står (28. oktober 2026)

**Bygging:** venter til oppstart. Se oppføringen om unntaket over.

**Status:** Lars ba 28.10.2026 om at det beste mønsteret for universell utforming undersøkes og legges inn som standarden. Valgt etter undersøkelse samme dag. Ikke bygget. Mønsteret regnes som endelig først etter prøvingen i `research/universell-utforming.md`, punkt 6, der også mønsteret og kildene står.

**Beslutning:** Fagordet er en knapp i teksten med prikket understrek. Trykk åpner forklaringen i teksten rett etter ordet, slik at resten av teksten skyves ned. Ingenting dekkes, ingenting vises ved hover, og fokus flyttes ikke. Gjelder alle nivåer, med sterkere markering i Enkel.

**Alternativer:**
A. Knapp som åpner forklaringen i teksten rett etter ordet. **Valgt.** Virker likt med mus, tastatur, berøring og skjermleser, og dekker ikke innhold ved zoom.
B. Verktøytips ved musepeker eller fokus. Ikke valgt: virker ikke med berøring, må oppfylle tre krav i WCAG 1.4.13, og W3C viser til at det vanligvis finnes mer forutsigbare løsninger.
C. Flytende boks som åpnes ved trykk (som NRK). Ikke valgt: dekker teksten under, og kan havne delvis utenfor skjermen ved 400 % zoom (WCAG 1.4.10). Var utgangspunktet Lars viste fram.
D. `<details>` og `<summary>`. Ikke valgt: kan ikke stå inne i en setning.
E. `title`-attributtet. Ikke valgt: virker ikke med berøring, og vises ikke ved tastaturfokus i vanlige nettlesere.
F. Lenke til ordlisten. Ikke valgt som hovedløsning: brukeren må forlate teksten. Brukes som reserve når JavaScript ikke virker.
G. Opplesning med `role="status"` når forklaringen åpnes, slik Pearson anbefaler for toggletips. Ikke valgt nå: strider mot regelen om sparsom opplesning, og forklaringen står rett etter knappen. Tas opp igjen hvis VoiceOver-testen viser at forklaringen ikke blir funnet.

**Akseptert ulempe:** Mønsteret er satt sammen ut fra kilder og egne regler, ikke testet med skjermleserbrukere ennå. 44 px trykkflate, som Claude nevnte tidligere 28.10, er ikke realistisk inne i et avsnitt. Kravet er minst 24 px linjehøyde.

**Tilgjengelighetssiden:** Teksten om valget legges inn først når funksjonen publiseres. Utkastet står i `research/universell-utforming.md`, punkt 6.

**Vurder på nytt når:** prøvingen viser problemer, eller Uu-tilsynet eller eksterne testere gir råd om noe annet.

## Områder pausen ikke gjelder (28. oktober 2026)

**Gjeldende regel:** står i `docs/regulatorisk.md`, «Områder pausen ikke gjelder», og i oppføringen «Nøytrale spørsmål og svar om økonomiske begreper» lenger ned. Resten av denne oppføringen er historikk.

**Status:** Vedtatt av Lars 28.10.2026, samme dag som unntaket for begrepsforklaringer. Senere samme dag endret, se under.

**Opprinnelig beslutning (erstattet):** Pausen gjelder ikke forbedringer i kilderegler og kildekontroll, universell utforming, generelle spørsmål, personvern og retting av opplagte brudd på lover og regler. Sperrene for kontekstuell veiledning og produktanbefalinger står, og ny funksjonalitet utenfor områdene venter til oppstart.

**Bakgrunn:** Første eksterne skjermlesertest 28.10.2026 viste at grafen ikke beskrives i ord. Det er en UU-feil (WCAG 1.1.1). Kalkulatorfrysen tillot allerede å rette UU-feil, men pausen stoppet det. Lars vurderer at forbedringer som gjør siden riktigere, tryggere og mer tilgjengelig ikke bør vente på Finanstilsynet.

**Endret samme dag, etter presiseringen til Finanstilsynet:** Lars sendte 28.10.2026 en presisering som nevner personvern, universell utforming, kildekrav og nøytrale begrepsforklaringer, ikke generelle spørsmål. For at regelverket skal stemme med det Finanstilsynet har fått vite, er «generelle spørsmål» tatt ut av områdene i `docs/regulatorisk.md`. Spørsmål og svar som bare forklarer begreper og forskjeller, er med under begrepsforklaringene. Retting av opplagte lovbrudd er beholdt som ren retting. Lars bekreftet retningen samme dag og erstattet «generelle spørsmål» med nøytrale spørsmål og svar om begreper, se egen oppføring.

**Historikk, tolkning av den opprinnelige formuleringen (erstattet):** «Generelle spørsmål» er forstått som forhåndsskrevne svar som er like for alle brukere, uten tilpasning etter brukerens opplysninger og uten produktanbefalinger. Det er det Finanstilsynets artikkel ikke omtaler som personlig rådgivning.

**Alternativer, slik de sto ved det opprinnelige vedtaket:**
A. Åpne for disse områdene, med sperrene intakte. **Valgt.**
B. Ett og ett unntak etter behov, som for begrepsforklaringene. Ikke valgt: gir mange små vedtak for samme type arbeid.
C. Oppheve pausen helt. Ikke valgt: spørsmålet om tilpasning etter alder og sparehorisont er fortsatt ubesvart.

**Akseptert ulempe:** Grensen for «generelle spørsmål» og «opplagt lovbrudd» krever skjønn. Ved tvil avgjør Lars.

**Vurder på nytt når:** Finanstilsynet svarer, eller et generelt svar viser seg å bli lest som en personlig anbefaling.

## Bygg slik at det som venter, lett kan kobles på (28. oktober 2026)

**Status:** Vedtatt av Lars 28.10.2026 som prinsipp for alt arbeid under pausen. Lars' formulering: alt må lages så funksjonene vi venter på, lett kan integreres når avklaringen er på plass.

**Beslutning:** Det som bygges nå, lages slik at funksjonene som venter (kontekstuell veiledning, forklaring der ordet står, ordlisteside, opplesning, lånekalkulator), kan kobles på senere uten å skrive om det som finnes. Prinsippet gjelder bare arbeid som er tillatt nå. Det gir ikke tillatelse til å bygge utsatte funksjoner, heller ikke bak en av/på-bryter. Utsatte funksjoner bygges først etter oppstart. Konkret:

1. **Ingen utsatte funksjoner bak bryter.** Opprinnelig sto det at en funksjon som venter, kunne bygges ferdig og stå avslått. Det er erstattet 28.10.2026 etter kontroll av GPT, fordi det kolliderer med at nye funksjoner venter.
2. **Én kilde for innhold.** Begrepsregisteret og svarbasen har plass til det senere funksjoner trenger, for eksempel kort og lang forklaring. Felt for tilpasning legges ikke inn før sperren er opphevet.
3. **Gjenbrukbare deler.** Teksten som beskriver resultatet (veikartet 0.5) lages som én modul som grafbeskrivelsen, en senere «Les opp»-knapp, eksport og veilederen kan bruke. Forklaringer vises med én felles komponent.
4. **Tester for det som bygges.** Tester dekker det tillatte arbeidet. Tester for utsatte funksjoner skrives når funksjonene bygges.
5. **Offentlige sider omtaler bare det som er på.**

**Grense:** «Bra nok er mer enn nok» gjelder. Det forberedes bare for funksjoner som allerede står i veikartet, og ingen kode skrives på forhånd uten at neste bruk er kjent.

**Alternativer:**
A. Prinsippet over. **Valgt.**
B. Bygge bare det som publiseres nå, og bygge om senere. Ikke valgt: dobbelt arbeid og risiko for at det som er kontrollert, må kontrolleres på nytt.
C. Bygge alt ferdig nå bak brytere, også kontekstuell veiledning. Ikke valgt: sperren gjelder, og svaret fra Finanstilsynet kan endre hva som skal bygges.

**Akseptert ulempe:** Brytere og felles moduler gir litt mer kode og flere tester.

**Vurder på nytt når:** en bryter står av lenge uten at funksjonen nærmer seg avklaring. Da fjernes koden heller enn å ligge der.

## Skrivemåte: «renters rente» (28. oktober 2026)

**Status:** Vedtatt av Lars 28.10.2026.

**Beslutning:** I tekst skrives alltid «renters rente». «Rentes rente», «renter på renter» og andre skrivemåter skal gi søketreff, men brukes ikke i teksten.

**Bakgrunn:** Begrepsregisteret (PR #91) fant begge skrivemåtene på siden. SPRAKREGLER krever ett navn per ting. «Renters rente» er tittelen på svaret som allerede finnes.

**Alternativer:** A. «Renters rente». **Valgt.** B. «Rentes rente». Ikke valgt: ville kreve endring av eksisterende svar uten gevinst.

**Sparetid, vedtatt av Lars 28.10.2026:** I tekst skrives «sparetid», forklart som «hvor lenge du planlegger å spare». «Sparehorisont» blir søkeord og brukes ikke i teksten. Anbefalt av GPT. Lars' begrunnelse: kort og presist, og korte ord er lettere for dem som lytter med skjermleser og for dem med dysleksi.

## Nøytrale spørsmål og svar om økonomiske begreper (28. oktober 2026)

**Status:** Vedtatt av Lars 28.10.2026, med formulering fra GPT som Lars sluttet seg til. Ført i `docs/regulatorisk.md`, kravene 1, 4 og 5 og områdene.

**Beslutning:** Svarbasen kan fylles med nøytrale spørsmål og svar som forklarer økonomiske begreper, også forskjeller, fordeler og ulemper. Avgrensningen gjelder innholdet: svarene skal ikke føre brukeren mot produkter, anbefale handlinger eller tilpasses som personlige råd. Relevante begrensninger og variasjoner forklares, uten konklusjon om hva brukeren bør velge. Eksempler: renters rente, effektiv rente, kredittscore, annuitetslån og serielån. GPT skriver svarene og har ansvaret for kildekontrollen. Lars godkjenner.

**Hva som ikke åpnes:** Ingen nye funksjoner som lånekalkulator, budsjettveiviser eller styring etter alder, sparehorisont eller sparemål. Innholdsarbeidet åpner ikke av seg selv for publisering.

**Endringer i kravene:**
- Krav 1 tillater nå fordeler og ulemper. Claude anbefalte å skrive forskjeller som fakta og følger, ikke som «for» og «mot». Lars valgte å tillate fordeler og ulemper, med vilkåret at de skrives som etterprøvbare følger og ikke ender i en konklusjon.
- Krav 4 tillater begreper som hviler på regler eller satser, når regelen er lest i primærkilden og forklaringen får kontrolldato og vedlikehold. Effektiv rente og kredittscore er slike begreper.
- «Generelle spørsmål» er tatt ut som egen kategori. Den var for grov til å både åpne og sperre.

**Forholdet til presiseringen til Finanstilsynet 28.10.2026:** Presiseringen sier at forklaringene anbefaler ingen handling, nevner ingen produkter og tilpasses ikke den enkelte. Det gjelder fortsatt. At svarene kan vise fordeler og ulemper, står ikke uttrykkelig i presiseringen. Claude vurderer at det ligger innenfor, så lenge svarene ikke ender i en anbefaling, men det er ikke en juridisk vurdering.

**Alternativer:**
A. Nøytrale begrepsspørsmål i spørsmål-og-svar-form, med fordeler og ulemper uten konklusjon. **Valgt.**
B. Bare definisjoner, uten forskjeller og fordeler og ulemper. Ikke valgt: gir lite hjelp ved spørsmål som annuitetslån eller serielån.
C. Åpne for «generelle spørsmål» bredt. Ikke valgt: kategorien er for grov og nevnes ikke i presiseringen.

**Akseptert ulempe:** Grensen mellom fordeler og ulemper og en anbefaling krever skjønn i hvert svar. Kontrollen av premiss og mulig oppfattet anbefaling (PR #87) brukes på hvert svar.

**Vurder på nytt når:** Finanstilsynet svarer, eller et svar viser seg å bli lest som en anbefaling.


## Grafene beskrives i ord (28. oktober 2026)

**Status:** Lars ba 28.10.2026 om UU-rettingen som gjør grafer og beregninger nyttige også for dem som ikke ser dem. Retting av dokumentert UU-feil etter `docs/regulatorisk.md`, krav 6. Ikke en ny funksjon.

**Beslutning:** Under sparegrafen står «Slik leser du grafen», og under uttaksgrafen en tilsvarende tekst. Teksten lages av regler og tallene i grafen (`dist/chart-summary.js`), ikke av KI. Den sier hva grafen viser, start og slutt, formen på linjen, et tydelig fall, avstanden til innskuddene, bånd, bank og lagrede planer, og at linjene er regneeksempler og ikke garantier. Den viser til tabellen for tall år for år.

**Alternativer:**
A. Synlig tekst for alle, koblet til grafen. **Valgt.** Hjelper også seende som ikke er vant til grafer.
B. Tekst bare for skjermleser. Ikke valgt: VoiceOver leser ikke alltid SVG-beskrivelser, og seende får ikke hjelpen.
C. Opplesning med `aria-live` når tallene endres. Ikke valgt: strider mot regelen om sparsom opplesning.
D. «Les opp»-knapp. Ikke valgt nå: ny funksjon som venter til oppstart. Modulen kan gjenbrukes da.

**Synlig og full tekst (endret samme dag):** Lars ba om at løsningen skal være god både for de fleste og for dem som bruker hjelpemidler. Seende får bare det grafen viser av nytt: start og slutt, formen på linjen, avstanden til innskuddene, bånd, bank og lagrede planer. Setninger som gjentar overskriften, merknaden under grafen eller henvisningen til tabellen, står bare i den fulle teksten. Den fulle teksten leses av skjermleser via `aria-describedby` og står i SVG-beskrivelsen. Alternativ: samme tekst for alle. Ikke valgt: seende ville lest forbeholdet og forklaringen av båndet to ganger.

**Kilder, kontrollert etter at løsningen ble laget (28.10.2026):** Lars spurte om løsningen fulgte en standard. Svaret er delvis: WCAG 1.1.1 krever tekstalternativ, men oppbygningen av teksten ble først valgt av Claude ut fra generell kunnskap. Kontrollen mot kildene viste at valgene stemmer med rådene:
- [Finanstilsynets designmanual, Universell utforming](https://finanstilsynet.no/designmanual/universell-utforming) (publisert 01.01.2023, endret 07.05.2025, nivå 1): diagrammer og infografikk må ha en synlig tekstbeskrivelse på samme side eller lenket fra den, som tabell, liste eller vanlig tekst. Det viktigste skal skrives først.
- [W3C WAI: Complex Images](https://w3c.github.io/wai-tutorial-images/tutorials/images/complex/) (utkastversjon i W3Cs arbeidsrepo, ikke den publiserte siden, som ikke kunne åpnes): kort tekstalternativ som sier hva bildet er, og en lang beskrivelse med verdier, skala og trender, gjerne som en del av hovedinnholdet. `aria-describedby` passer bare for ren tekst uten overskrifter og tabeller, slik teksten her er.
- [Finanstilsynets designmanual, Informasjonsgrafikk: diagrammer](https://finanstilsynet.no/designmanual/identitet/informasjonsgrafikk/informasjonsgrafikk-diagrammer) (publisert 05.01.2023, endret 08.05.2025): kontrast 3:1 for grafiske elementer, mørkere kant på lyse flater, og forklaringen av linjene i samme rekkefølge som i grafen.

- [Uu-tilsynet: Bilder og grafikk](https://www.uutilsynet.no/veiledning/bilder-og-grafikk/205) (opprettet 17.04.2015, endret 15.12.2023, nivå 1, lest fra PDF Lars la ved 28.10.2026): diagrammer skal ha en kort alternativ tekst som beskriver formål og hovedinformasjon, og den detaljerte informasjonen skal stå som tekst. Anbefaling utover kravet: begynn med det viktigste, og si om det er foto, illustrasjon eller grafikk konsekvent til slutt. HTML5 `<figure>` med `<figcaption>` er tilsynets anbefalte kode for synlig bildetekst. SVG anbefales for tekst i diagrammer.

**Endret etter Uu-tilsynets råd:** Grafenes korte tekstalternativ har fått hovedinformasjonen og typen sist, for eksempel «Beløp i kroner over 25 år, fra 10 000 kr til 600 742 kr. Linjediagram.» Før sto det bare «Beløp i kroner over tid».

**Avvik og forslag fra kontrollen, ikke gjort i denne PR-en:**
- W3C og Uu-tilsynet anbefaler å samle graf og beskrivelse i `<figure>` med `<figcaption>`. Egen liten retting.
- Grafens ytre `div` har `aria-label` uten rolle. Navn på et element uten rolle leses ikke av alle skjermlesere. Gjelder koden fra før.
- Om tabellvisningen har riktige overskriftsceller, og om rekkefølgen i forklaringen av linjene følger grafen, er ikke kontrollert.
- Chartability (Elavsky m.fl., EuroVis 2022), en fagfellevurdert sjekkliste for tilgjengelige grafer: testlisten er gått gjennom samme dag fra en PDF Lars la ved. Resultat og forslag står i `research/chartability-sparegraf.md`. Selve artikkelen er ikke lest.

**Ikke kontrollert:** Hvordan VoiceOver og andre skjermlesere faktisk leser teksten. Bør prøves av testeren som fant feilen.

## Gyldig HTML etter W3C-validatoren (28. oktober 2026)

**Status:** Lars kjørte W3C Nu HTML Checker 28.10.2026. Bare forsiden fikk merknader. Retting av UU-feil og kodefeil etter `docs/regulatorisk.md`, krav 6. Endrer ikke beregningene.

**Funn og retting:**
1. `div` inne i `label` (12 feil). Feltboksen er nå `span` med `display:block`, i HTML og i feltene som lages med JavaScript. Utseendet skal være uendret.
2. `label` med både avkrysningsboks og hjelpeknapp (2 feil). Hjelpeknappen står nå ved siden av `label`, i en felles rad. En `label` skal bare peke på ett skjemaelement.
3. `aria-label` på grafens `div` uten rolle (1 feil). Grafen har nå `role="group"`. Det samme punktet ble funnet i Chartability-gjennomgangen.
4. `aria-label` på temaknappenes `div` uten rolle på «Spør om sparing» (1 feil, funnet av Lars samme dag). Har nå `role="group"`.

**Ikke rettet:** Advarslene om `section` uten overskrift og tomme overskrifter. Overskriftene fylles av JavaScript, og seksjonene har navn via `aria-labelledby` eller er skjult. Validatoren ser bare HTML-en før JavaScript kjører.

**Funnet i koden, ikke av validatoren:** Glidebryteren og hjelpeknappene som lages med JavaScript, legges inne i samme `label` som tallfeltet. Da har én `label` flere skjemaelementer, og glidebryteren kan få samme navn som tallfeltet. Det krever en større omlegging av feltene og testene og er ikke gjort her. Bør tas som egen oppgave.

**Alternativer for punkt 2:** A. Knappen utenfor `label`, i en felles rad. **Valgt.** B. Beholde knappen i `label` og skjule den for skjermleser. Ikke valgt: knappen må kunne brukes med skjermleser.

**Ikke kontrollert:** Utseendet er ikke sett på skjerm. Testene i GitHub tar skjermbilder.

## Fondskonto og investeringskonto i stedet for Investeringskonto Zero (28. oktober 2026)

**Status:** Vedtatt av Lars 28.10.2026, etter at han hadde gått gjennom kildene i PR #72.

**Beslutning:** Svarene om fondskonto og sammenligningen med ASK bruker «fondskonto» og «investeringskonto», ikke produktnavnet Investeringskonto Zero eller tilbyderen Nordnet. En setning sier at tilbydere kan gi fondskontoen egne navn. «Zero» og «IKZ» fjernes som søkeord nå og legges inn igjen når pausen oppheves.

**Begrunnelse (Lars):** Det ene er en tilbyders navn, det andre er navnene som faktisk brukes. Navnet på én tilbyder var en feil som skulle ryddes uansett.

**Endringer i svarene:**
- Ordforklaringen «produktnavn, for eksempel Investeringskonto Zero» er erstattet med en generell forklaring av produktnavn.
- To setninger som bygde på Nordnets side, er fjernet: at Nordnet formelt eier aksjene og at du ikke har stemmerett, og at kontoverdien utbetales til begunstigede ved død. De gjaldt ett produkt og var ikke kontrollert mot en generell kilde (PR #72 merket dem som åpne produktpåstander).
- Nordnets side er fjernet fra kildelisten. Svaret bygger nå på Skatteetatens kilder.
- Søkeordene «zero» og «ikz» er fjernet. «Investeringskonto» gir fortsatt treff.

**Ikke endret:** Den interne id-en `q-ask-zero` beholdes, fordi lenker og tester bruker den. Brukerne ser den ikke. Forbeholdet om at Skatteetatens rettledning er «revidert oktober 2025», som PR #72 fant feil, er ikke rettet her. Det tas i egen PR.

**Alternativer:**
A. Fjerne produkt- og tilbydernavn, bruke de generelle navnene. **Valgt.**
B. La teksten stå urørt til Finanstilsynet svarer, som `docs/regulatorisk.md` sa. Ikke valgt: Lars vurderte omtalen som en feil. Den gamle teksten ligger i historikken (`df5bbb3`).
C. Beholde Nordnet bare i kildelisten. Ikke valgt: setningene som bygde på kilden, gjaldt ett bestemt produkt.

**Vurder på nytt når:** pausen oppheves, og søkeordene «Zero» og «IKZ» skal legges inn igjen.


## ASK i samlet svarmal og felles føringer (28. oktober 2026)

**Status:** Lars bestilte innholdsgjennomgang av ASK og tilpasning til svarmalen med fordeler og ulemper. Han ba også om føringer som virker på tvers av verktøy. Implementasjonen i denne PR-en er til kontroll, ikke godkjent for publisering.

**Valg:** ASK beholder den nøytrale innholdstypen, søkeinngangene og uavhengigheten fra brukerprofiler. Presentasjonen får en samlet oversikt med fordeler og ulemper, kortere eksempel og begreper i fordypningen. Felles føringer står i SVARMAL.md og lenkes fra arbeidsreglene og bidragsinstruksen.

**Alternativer:** A. Samlet forklaring med kildebelagte fordeler og ulemper. Valgt. B. Beholde stor eksempelboks og synlig begrepsliste før fordypningen. Ikke valgt: Lars opplever siden som lite pen og mindre helhetlig. C. Gjøre ASK til en sammenligning for å få kortene. Ikke valgt: ville konstruert et valg og risikert å hente inn profiltilpasning og råd. D. Endre alle svar samtidig. Ikke valgt: ASK prøves og kontrolleres først.

**Akseptert ulempe:** Enkelte detaljer krever fortsatt åpning av fordypningen. Nødvendige forbehold skal stå i kortsvaret eller ved fordelen de begrenser. Ingen påstand om at utformingen er brukertestet.

**Vurder på nytt når:** Lars har sett prøvevisningen, kontrolløren finner misforståelser eller faktisk bruk viser at oversikten skjuler viktige begrensninger.

## Samlet språk og svarmal for kildekontrollens svar (28. oktober 2026)

**Status:** Lars har bestilt at alle svarene i den pågående kildekontrollen, inkludert ASK, får tilpasset språk og felles svarmal uten å endre faglig mening. Implementasjonen leveres til kontroll, ikke publisering.

**Valg:** Ni egne svar og fire upubliserte utkast får oversiktsmalen. Fordeler og ulemper brukes når det er faglig grunnlag. Faktiske sammenligninger beholder to kort. Grunnbegreper får ikke oppdiktede fordeler eller alternativer. Viktige forbehold står ved kortsvaret; arbeidsnotater ligger ved kildene. Faglige vilkår, datoer og usikkerheter beholdes. Detaljert omfang og kontrollstatus: research/sprak-og-svarmal-2026-10-28.md.

**Alternativer:** A. Samlet mal med innholdstilpasset struktur. Valgt. B. Beholde ulike, sprikende maler. Ikke valgt: Lars opplever dem som lite helhetlige. C. Tvinge alle begreper inn i to alternativer. Ikke valgt: konstruerer valg og kan endre budskapet. D. Publisere de fire utkastene sammen med språkvasken. Ikke valgt: kildekontroll og godkjenning er ikke ferdig.

**Avgrensning:** Kildekontrollerte BSU- og kontosvar skal ikke hente inn personlige råd eller erstatningskort fra gamle hovedtemaer. De sju hovedtemaenes logikk endres ikke. Dette åpner ingen ny sammenligningsvelger eller videre personalisering. Arbeidet med UU i #99 holdes separat.

**Akseptert ulempe:** Mer detaljert innhold krever åpning av fordypningen. Selvkontroll beviser ikke brukerforståelse eller full tilgjengelighet.

**Vurder på nytt når:** kontrollør, Lars eller faktisk bruk finner at en forenkling endrer meningen eller skjuler et viktig forbehold.

## Gjentakelser og lengde i svarene, oppfølging 28.10.2026

**Grunnlag:** Lars videresendte en gjennomgang av PR #100 som fant gjentakelser og økt samlet tekstmengde. Dette erstatter den tidligere språkrundens antakelse om at en strammere innledning alene gjorde svarene kortere.

**Valg i arbeidsutkastet:** Ett hovedsted per faglig poeng. Frivillige felt, ingen tomme begrepslister eller fordypninger. Identiske setninger stoppes av test. Målet er 300 ord, inkludert fordypning; totalen med kildetitler og kontrollgrunnlag vises separat og utløser varsel over målet. Nødvendige vilkår kuttes ikke automatisk. Renters rente beholder regneforutsetninger og kontrollbare eksempler selv om totalen med dokumentasjon overstiger målet. Språkformen er «egenkontroll».

**Alternativer:** A. Struktur og måling med redaksjonell kontroll. Valgt som implementeringsforslag. B. Hardt kutt ved 300 ord. Ikke valgt: kan fjerne vilkår som endrer meningen. C. Bare en test for ordrette dubletter. Ikke valgt alene: finner ikke omskrevne gjentakelser.

**K1-presisering:** Regelen har et uttrykkelig unntak for et direkte spørsmål eller nødvendig opplysning om usikkerhet, med henvisning til riktig instans. Den endres ikke her. De fire utkastene forblir upubliserte. Åpne spesialtilfeller i SV-135 og SV-050 registreres som publiseringssperrer i arbeidsnotatene, og svartekstene avgrenser dekningen.

**Status:** Revisjon til kontroll i PR #100. Ikke en godkjenning av publisering eller av hele kildekontrollen.

### BSU-utkast fra kildekontroll i samtale, 28.10.2026

Lars godkjente teksten i samtalen og bestilte integrasjon i GitHub med kilder. Valgt: q-bsu-basics i nøytral oversiktsmal med PDF-grunnlag og datert SSB-historikk. Alternativene var å beholde #100s tidligere ordlyd eller lage en konkurrerende main-PR. Endringen bygger i stedet på #100 og har den grenen som base. Ingen sammenslåing eller publisering inngår. Eksempel er valgfritt i oversiktsmalen, fordi et tvunget eksempel her gjentar fradragsbeløpet. Åpent før publisering: presisering av indirekte boligeierskap, uttrykkelig regelår og uavhengig fagkontroll. Se research/svarutkast/BSU-KILDEKONTROLL-2026-10-28.md.

### BSU-årstabell og boligvilkår, 28.10.2026

Lars bestilte tre konkrete endringer i PR #101: boligvilkåret «alene eller sammen med andre» med Skatteetatens satsside, ny rentefordel og en ekte HTML-tabell i fordypningen. Årssnitt fra Claudes vedlagte CSV kontrollregnes mot den eksisterende månedsfilen. Valgt to rentekolonner, BSU og bundne innskudd, for en ryddig mobilvisning. Alternativ med ikke-bundne innskudd vises ikke, men tallene bevares i årsfilen. Tallene genereres fra datafil, ikke fra håndskrevet tekst. 2026 er et delår og må oppdateres før 01.01.2027. Ingen sammenslåing eller publisering bestilt.


### ASK: kildekontrollert tekst og integrasjon, 28.10.2026

Lars bestilte innlegging i GitHub og notat i PR. Valgt: egen ASK-gren oppå docs/svarstruktur-ask med BSU/#101-strukturen. Kun data i q-aksjesparekonto, samme søkeinnganger, ingen kalkulatorendringer. Risiko står i kortsvaret; avgrensning i review, så caveat og gammel separat skjermingskilde utgår. Gave, arv og flytting forklares med videreføring av skatteposisjoner. Alternativ: kutte til 300 ord eller bygge på main uten strukturen. Ikke valgt: Lars bestilte at teksten beholdes og at lengdeavvik varsles. 482 ord i svaret etter repoets teller, 566 med dokumentasjon. Lengdeavviket er ikke godkjent. Ingen sammenslåing eller publisering. Kontroller og begrensninger: research/svarutkast/ASK-KILDEKONTROLL-2026-10-28.md. Vurder på nytt ved Lars' gjennomgang, faglige funn eller regelendring.

## Én etikett per felt, og ingen tomme overskrifter (28. oktober 2026)

**Status:** Forslag. Retting av UU-feil og kodefeil etter `docs/regulatorisk.md`, krav 6. Endrer ikke beregningene. Venter på Lars.

**Bakgrunn:** Lars ba om opprydding til ren W3C-test, med innebygde HTML-løsninger der det passer. En liste fra Grok hadde fire punkter. Punkt 3 (`aria-label` på `div` uten rolle) og deler av punkt 1 var allerede rettet i «Gyldig HTML etter W3C-validatoren» over. Resten er kontrollert på nytt her.

**Hvordan det er kontrollert:** Nu HTML Checker (versjon 20.6.30, kjørt lokalt) på HTML-filene og på den ferdige siden etter at JavaScript har kjørt, i 17 tilstander: startside, kalkulator på alle nivåer, sparemål, uttak, hver dialog åpen, ugyldig felt, «Spør om sparing» med og uten svar, Om, Personvern og Tilgjengelighet. Den nettbaserte validatoren kunne ikke nås fra arbeidsmiljøet.

**Funn i den ferdige siden (før retting):**
1. Tallfeltene som lages med JavaScript lå i én `label` sammen med hjelpeknappen, glidebryteren og en `div`. 539 feil på kalkulatorsiden. Dette er feilen som sto som «egen oppgave» i forrige oppføring.
2. Tomme overskrifter før skriptet fyller dem: forklaringsdialogen, eksempeldialogen, sparemålkortet og svaret i «Spør om sparing».
3. `section` uten overskrift: resultatkortet, sparemål, uttak, «Mine planer» og utskriftsrapporten.
4. To `path` i den lille mobilgrafen manglet `d` før skriptet tegnet dem.

**Retting:**
1. Hvert felt er nå `<div class="field">` med en ekte `<label for>` som bare holder ledeteksten. Hjelpeknapp, tallfelt, glidebryter og beskrivelse står ved siden av, inne i samme `div`. Tallfeltet får navnet sitt fra `<label for>`, så den gamle `aria-label`-lappen på tallfeltene er fjernet.
2. Overskriftene har en kort standardtekst («Forklaring», «Eksempel», «Sparemålet», «Svar», «Resultat») som skriptet bytter ut.
3. Resultatkortets tittel er nå en `h2` med samme utseende som før. Det gir skjermleserbrukere en overskrift å hoppe til. De fire andre seksjonene hadde ikke navn og var derfor ikke landemerker. De er nå `div`.
4. `d="M0 0"` som startverdi. Tegner ingenting synlig.

**Utseendet:** Skjermbilder før og etter er sammenlignet piksel for piksel: kalkulator, sparemål og uttak, nivåene Enkel, Utforsk og Avansert, 390 og 1280 px bredde, med fokus i et felt. Alle 18 er like.

**Alternativer for punkt 1:**
A. `div` rundt, `label for` bare rundt ledeteksten. **Valgt.** Ren HTML, ingen ARIA, og klikk på ledeteksten flytter fortsatt fokus til feltet.
B. `fieldset` med `legend` for hvert felt. Ikke valgt: `fieldset` er for grupper av felt. Mange skjermlesere leser da gruppenavnet i tillegg til feltnavnet, så samme tekst kan bli lest to ganger.
C. Beholde `label` rundt alt og koble med `aria-labelledby`. Ikke valgt: bryter fortsatt HTML-reglene og bruker ARIA der HTML har en løsning.

**Alternativer for punkt 3:**
A. Gjøre ledeteksten i resultatkortet til `h2`, de navnløse seksjonene til `div`. **Valgt.**
B. Legge til skjulte overskrifter for skjermleser. Ikke valgt: tekst som bare finnes for hjelpemidler, bør unngås når en synlig tekst kan gjøre jobben.

**Ny test:** `tests/html-struktur-browser.cjs` sjekker den ferdige siden: én etikett per felt, ingen blokkelementer i `label`, ingen tomme overskrifter, ingen navnløs `section`, ingen `aria-label` på `div` eller `span` uten rolle. Den feiler på main og består på denne grenen.

**Ikke rettet:** Nu 20.6.30 melder `font-weight: 650` i den innebygde stilen på personvernsiden som feil. CSS Fonts nivå 4 tillater tall fra 1 til 1000, så dette er trolig en gammel regel i den lokale validatoren. Hvis den nettbaserte validatoren også melder det, er 600 en trygg erstatning.

**Ikke kontrollert:** Den nettbaserte W3C-validatoren, Firefox og Safari lokalt (testene i GitHub kjører Firefox og WebKit), og hvordan VoiceOver og NVDA leser feltene.

**Vurder på nytt når:** nye felt lages på en annen måte enn de to feltbyggerne i `app.js` og `guidance.js`.

**CodeQL-varsler på PR-en (rettet samme dag):** GitHubs sikkerhetsskanner meldte fire varsler om at tekst fra siden kunne bli tolket som HTML i `markInvalid` og `focusField`. CodeQL 2.23.3 kjørt lokalt viste samme dataflyt på main, så varslet var ikke nytt, bare synlig fordi PR-en endret `app.js`. Skanneren leste hjelpefunksjonen `$(key)` som jQuery, der en tekst kan bli til HTML. I Spareverksted er `$` bare `document.getElementById`. De to funksjonene bruker nå `document.getElementById(key)` direkte. Virkningen er den samme, og CodeQLs sikkerhetsregler gir 0 funn lokalt etterpå.

Alternativer: A. Skrive `document.getElementById` i de to funksjonene. **Valgt.** B. Avvise varslene som falsk alarm i GitHub. Ikke valgt: skanneren ville fortsatt reagert ved neste endring. C. Gi `$` nytt navn i hele filen. Ikke valgt: stor endring for liten nytte.

## Grafen uten sidens stilark (28. oktober 2026)

**Status:** Forslag. Retting av UU-feil etter `docs/regulatorisk.md`, krav 6. Endrer ikke beregningene. Venter på Lars.

**Funn (Lars, iPhone, 28.10.2026):** I lesemodus i Chrome var tallene på grafens akse kuttet («00 tusen»), og forklaringen av linjene sto som «Beløp i kronerDu setter inn». Lesemodus i nettlesere, egne stilark og enkelte hjelpemidler viser siden uten vår CSS. Mange bruker det for å lese lettere, blant annet ved dysleksi og nedsatt syn.

**Årsak:** Skriftstørrelsen på teksten i grafen kom bare fra stilarket. Uten det arvet teksten en større skrift, og tallene ble for brede for plassen til venstre. Forklaringen var `span`-elementer uten mellomrom mellom seg. Mellomrommet kom bare fra CSS.

**Retting:**
1. Grafene har `font-size` og `font-family` som attributter på `svg`. Stilarket overstyrer dem som før. Uten stilark brukes de.
2. Forklaringen er en ekte liste, `ul` med `li`, også i rapporten. Uten stilark vises den som punktliste. Skjermlesere sier hvor mange linjer det er.

**Utseendet med stilark:** 18 av 18 skjermbilder er pikselidentiske før og etter (kalkulator, sparemål og uttak; tre nivåer; 390 og 1280 px).

**Alternativer for punkt 2:**
A. `ul` med `li`. **Valgt.** Innebygd HTML, gir mening både med og uten stil.
B. Mellomrom eller skilletegn mellom `span`. Ikke valgt: virker, men sier ikke at det er en liste.

**Ny test:** `tests/uten-stil-browser.cjs` fjerner stilarkene og sjekker at grafteksten holder seg innenfor og at forklaringen er en liste. Feiler på main, består her.

**Ikke rettet:** Uten farger viser ikke forklaringen hvilken linje som er hvilken. Teksten «Slik leser du grafen» dekker det. Oppfordringen «Pek eller trykk på grafen» vises også i leservisning, der grafen ikke kan brukes. Den er nyttig i vanlig visning og koster lite.

**Ikke kontrollert:** Lesemodus i Chrome og leservisning i Safari selv. Chromium uten stilark er bare en tilnærming. Lars bør se samme side i lesemodus etter publisering.

## Dagens arbeid samlet og publisert (28. oktober 2026, kveld)

**Status:** Utført etter Lars' fullmakt 28.10.2026: ferdigstille #99 til #103 og dokumentasjons-PR-ene #91, #93 og #97, løse de konkrete restpunktene, og deretter slå sammen og publisere.

**Restpunkter løst før sammenslåing:**
1. **BSU, boligeierskap (#101).** Presiseringen fra #100 hadde falt ut. Ny del «Hvilken bolig teller?»: bolig du bor i og annen bolig, borettslagsandel, og at fritidsbolig alene ikke hindrer fradrag. Kilder: Skatteetatens satsside og Forskuddsutskrivingen 2026 (15.12.2025), kontrollert av Claude. Lars' bestilte setning står uendret. Detaljer i `research/svarutkast/BSU-KILDEKONTROLL-2026-10-28.md`.
2. **Åpne kildepunkter i #100.** Påstandene i indeksfondsvaret er lest i Finanstilsynet (nivå 1) og Forbrukerrådet (nivå 2). DNB-siden (nivå 4, udatert) er fjernet som kilde. De fire upubliserte utkastene er kontrollert ute av produksjonen. Detaljer i `research/sprak-og-svarmal-2026-10-28.md`.
3. **ASK (#102).** Teksten er beholdt. Lengdeavviket (482 ord i svaret) er dokumentert i PR-en og venter på Lars' vurdering.
4. **Rekkefølge.** #100, #101, strukturnotatet (`docs/svarstruktur-ask`, kom inn med #102), #102, #99, #103, #97, #91, #93. Hver gren ble rebaset på den forrige. Ved hver sammenslåing ble det kontrollert at innholdet på main var identisk med versjonen som besto alle tester i Chromium, Firefox og WebKit.

**Kontroll:** Alle 59 testkommandoer i CI-listen besto lokalt i Chromium på den samlede versjonen. CI besto i alle tre nettlesere på samme innhold, og CodeQL ga ingen nye varsler. W3C Nu-validatoren ga 0 feil i 27 tilstander av den ferdige siden, også med BSU-, ASK- og indeksfondsvarene åpne. Mobil- og PC-bilder er sett gjennom. Publisert commit er `ddecaba` (GitHub Pages, status success).

**Rød test i #97:** Ikke dokumentasjonen. `tests/input-browser.cjs` linje 115 feiler av og til, også på main: «500» skrevet i vekstfeltet blir av og til «00». Gjenskapt lokalt i 2 av 15 og 3 av 40 kjøringer. Det er inntastingsfeilen PR #38 retter.

**Står igjen, med grunn:**

| Hva | Grunn |
| --- | --- |
| PR #38, inntastingsfeil i kalkulatoren | Ekte feil, men en kalkulatorretting. Hører ikke til områdene pausen åpner for, og var ikke i oppdraget. Grenen har konflikt med main. Lars avgjør. |
| «Rentes rente» fire steder og «sparehorisont» ett sted i teksten | Skrivemåten er vedtatt, men teksten er ikke rettet. Egen liten oppgave. |
| Borettslagseksemplet i BSU | Bygger på GPTs lesing av den norske satssiden. Claude fikk bare åpnet den engelske. Lars kan bekrefte ved å se etter «borettslagsandel» på satssiden. |
| ASK-lengden | Over målet på 300 ord. Lars har ikke godkjent avviket. |
| Uavhengig fagkontroll, iPhone, VoiceOver | Ikke utført. Kontrollen er egenkontroll av GPT og kontroll av Claude. |
| Den publiserte siden | Claude kunne ikke åpne spareverksted.no fra arbeidsmiljøet. Publiseringen er bekreftet i GitHub, ikke ved å se på siden. |
| UU-forslag 1, 2, 3 og 5 i `research/uu-egenkontroll-uutilsynet.md` | Ikke påbegynt. 3 og 5 endrer det brukeren ser. |

**Ikke gjort:** Ingen nye funksjoner. Pausen er ikke opphevet utover det Lars har vedtatt.

## Avklaringer etter publiseringen (29. oktober 2026)

**Status:** Vedtatt av Lars 29.10.2026, svar på det som sto igjen i «Dagens arbeid samlet og publisert».

1. **Lengde på svar.** Det viktigste er kort kortsvar og korte fordeler og ulemper. Fordypningen kan gå over målet på 300 ord når det trengs for et fullstendig og opplyst svar. Lang fordypning er aldri et mål i seg selv. ASK-svaret (482 ord i svaret) er dermed i tråd med regelen: kortsvaret og fordeler og ulemper er korte, og det er fordypningen som er lang. SVARMAL.md er oppdatert.
   Alternativer: A. Kort start og korte fordeler og ulemper, fordypning kan gå over ved behov. **Valgt.** B. Fast tak på 300 ord for hele svaret. Ikke valgt: ville kreve at vilkår om flytting, arv og gave ble kuttet. C. Ingen lengdemål. Ikke valgt: korte svar er viktig for alle, særlig for dem som lytter med skjermleser.
2. **BSU, borettslagseksemplet.** Lars bekrefter at Skatteetatens norske og engelske satsside er samme side, bare oversatt. Eksemplet står på den norske kilden.
3. **Grafen i lesemodus (#103).** Lars bekrefter at den fungerer i Chrome på iPhone.
4. **PR #38 (inntastingsfeilen).** Lars' vurdering: rettingen endrer ikke kalkulatorens funksjoner for brukerne, gir ingen nye variabler og ingen nye måter å se tallene på. Den retter et stille, feil tall og faller derfor innenfor kalkulatorfrysens unntak for dokumenterte feil. Rebaset på main 29.10.2026. Gjenskapingen av feilen ga 3 av 40 før og 0 av 40 etter, og inntastingstesten 2 av 15 før og 0 av 15 etter.

## Forklaringen oppdateres etter skrivepause, og resultatradene som beskrivelsesliste (29.10.2026)

**Funn (Lars, iPhone, Safari Reader, 29.10.2026):** Hovedtallet var 12 456 484 kr, men «Mer om tallene» sa 240 000 kr innskudd, som er eksempelplanens tall. Gjenskapt i Chromium. «Dette betyr tallene dine» ble bare beregnet på nytt når feltet ble forlatt. Til da var teksten bare dempet med CSS. Den grå «Oppsummering»-boksen i skjermbildet er Safaris egen KI-oppsummering, ikke nettsidens.

**Valg:**
1. Forklaringen beregnes etter 0,5 sekunders skrivepause, i tillegg til når feltet forlates. Alternativ: beregne ved hvert tastetrykk. Ikke valgt: teksten ville hoppe mens brukeren skriver, og skjermlesere kan lese opp halvferdige tall. Alternativ: tømme teksten mens den venter. Ikke valgt: «Mer om tallene» ville blinke tomt.
2. Resultatradene er `dl` med `dt` og `dd`. Alternativ: skjult kolon mellom `span`. Ikke valgt, av samme grunn som for grafforklaringen 28.10.2026.
3. Resultatkort og forklaring ligger i én `article`. Ingen synlig endring.
4. Forslag om å skjule sekundært innhold med `hidden` eller skrive ekstra tekst for lesemodus er ikke fulgt. Gamle tall skal ikke finnes i siden, og «Mer om tallene» skal være tilgjengelig for alle.

**Oppfølging samme dag:** Lars testet på iPhone. Chrome viser riktige tall i lesemodus etter endringen. Safari Reader viser eksempelplanen uansett, også hovedtallet, og planen kan bli nullstilt når lesemodus lukkes. Det er en annen sak enn denne: Safari ser ut til å laste siden på nytt. Ført opp i research/plan.md, «Kjente feil som venter». Lars: ingen tiltak før Nkom har svart om fanelagring.

**Revurderes hvis:** brukere opplever at forklaringen endrer seg for tidlig eller for sent, eller lesemodus fortsatt viser tall som ikke stemmer med hovedtallet.


## Fondskonto revidert og godkjent 29. oktober 2026

Lars bekrefter kontroll av ham og Claude og bestiller innlegging og publisering av siste tekst fra samtalen. q-fondskonto bruker samme oversiktsstruktur og renderer som BSU og ASK. Bredere utvalg og utsatt skatt beholdes som dokumenterte fordeler, og forholdsmessig uttak som ulempe. Udokumenterte kostnads- og flyttepåstander fjernes. Alternativet å utelate EØS-fordelen forkastes fordi Prop. 1 LS (2025/2026), punkt 8.10.2, dokumenterer forskjellen. Skjermingens rekkefølge gjøres ikke obligatorisk. Ingen nye funksjoner eller endret søk. Se research/svarutkast/FONDSKONTO-KILDEKONTROLL-2026-10-29.md for kilder, lengde og kontrollstatus.

## Bare BSU, ASK og fondskonto vises, 29. oktober 2026

Lars bestiller at øvrige svar tas ut av visningen til de er kontrollert etter samme standard. Hans «Gjør det nå» viser til forslaget om å beholde q-bsu-basics, q-aksjesparekonto og q-fondskonto. IPS er ikke med: eksisterende IPS-svar er sammenligningen IPS eller ASK. Alle sju eldre hovedtemaer og seks andre svar sperres i søk, temavalg, forslag og svar-API i produksjonsvisningen. Ingen eldre veiledning skal vises som reserve ved manglende svar. Profiltilpassede forslag erstattes av de tre publiserte forklaringene. Kalkulatoren endres ikke.

Alternativ A: permanent sletting av innhold og kilder. Forkastet fordi arbeid kan gjenbrukes etter kontroll. Alternativ B: bare skjule temaknappene. Forkastet fordi søk og forslag fortsatt kunne åpne svarene. Valgt: eksplisitt publiseringsutvalg, med arkiv i research/svarutkast/TILBAKETRUKNE-SVAR-2026-10-29.json og historikken bevart. Arkivet er utkast, ingen ny faglig godkjenning. Ny publisering av et svar krever eget godkjent oppdrag.

Historiske nettlesertester av beholdt utkastkode bruker en eksplisitt testfixture uten publiseringsutvalg. Nye produksjonstester bruker uendret spor.html og bekrefter at bare tre svar finnes og at tidligere spørsmål ikke gir eldre råd. Ingen produksjonsinnstilling lar brukeren slå av utvalget. Dette er en avgrenset tilbaketrekking, ikke en åpning for nye funksjoner under pausen.


## Nettside som kilde, 29. oktober 2026

Lars presiserer at PDF-utskriftene av nettsider bare er en intern lesemåte. De skal ikke omtales som egne kilder i publiseringsteksten. Kildelisten lenker til nettsiden, og kontrollgrunnlaget oppgir relevant regelår, faktisk lesedato og kjent kildedato. Tekniske opplysninger om utskrifter beholdes internt. Dette er rettet i kontrollteksten for BSU, ASK og fondskonto uten endring av kilder, faginnhold eller kontrolldato. SVARMAL.md er presisert. Alternativet å beholde lesemåten i brukerens kontrolltekst forkastes fordi det forveksler arbeidsmaterialet med kilden. Selvstendige PDF-originaler omfattes ikke av denne avgrensningen.

## «Sist gjennomgått» under overskriften og varsel etter 12 måneder (29.10.2026)

**Bestilt av Lars 29.10.2026.** Leseren skal raskt se om informasjonen er fersk, slik nettaviser merker gamle saker. Gjelder BSU, ASK og fondskonto og alle nye svar.

**Valg:**
1. «Sist gjennomgått» rett under overskriften, før kortsvaret. Alternativ A: datoen nederst ved kildene, som før. Ikke valgt: den som søker, ser den ikke før svaret er lest. Alternativ B: «Publisert» til første gjennomgang og deretter «Sist gjennomgått». Ikke valgt: én fast etikett er enklere å vedlikeholde og å forstå.
2. «Først publisert», «Sist endret» og «Sist gjennomgått» står samlet øverst i «Kilder og kontrollgrunnlag». Alternativ A: alle tre datoene under overskriften. Ikke valgt: støy før svaret. Alternativ B: et eget åpne/lukke-felt med datoene under overskriften. Prøvd først, men forkastet av Lars samme dag: han vil bare ha kontrolldato og eventuelt varsel øverst. Etiketten «Sist sjekket» er forkastet fordi den kan leses som at ingen har søkt opp svaret siden.
3. Skillet mellom «gjennomgått» og «endret». En gjennomgang uten funn flytter bare `checked`. Alternativ: bare én dato. Ikke valgt: leseren ser da ikke om gjennomgått betyr «alt stemte» eller «noe ble rettet».
4. Varsel etter 12 måneder uten gjennomgang. Alternativ: fem år, som i mange nettaviser. Ikke valgt: satser og grenser endres hvert år. Teksten «ikke gjennomgått» er valgt framfor «kan være utdatert» fordi den sier hva som ikke er gjort, ikke bare at verden kan ha endret seg.
5. Varselet er vanlig tekst med eksisterende varselfarger, ikon skjult for skjermleser og uten `role="alert"`. Alternativ: `role="alert"`. Ikke valgt: det avbryter skjermleseren ved sidelasting for et statisk varsel.

**Datoer for de tre svarene**, fra git-historikken på main: BSU først på main 22.10.2026 (#4), ASK og fondskonto 24.10.2026 (#61). Sist endret: BSU 28.10 (#101), ASK 28.10 (#102), fondskonto 29.10 (#107). «Sist gjennomgått» er uendret fra feltet som tidligere het «Sist sjekket».

**Ansvarslinjen** i «Om veilederen og personvern» er endret etter Lars' tekst samme dag: livssituasjon i stedet for økonomi, typer sparing uten bestemt produkt, selskap eller tilbyder, og at satser, grenser og regler kan ha endret seg siden siste gjennomgang.

Regler for hvem som flytter datoene og når: [SVARMAL.md](SVARMAL.md), «Datoer og gjennomgang». Innenfor pausens unntak for kildekrav og universell utforming. Ingen ny kalkulatorfunksjon.

**Revurderes hvis:** brukere misforstår «gjennomgått», varselet vises for ofte til å bli tatt på alvor, eller kontrollrutinen ikke klarer å holde svarene innenfor 12 måneder.


## Kildeavvik funnet under metodeprøven, 29. oktober 2026

Lars gir i samtalen uttrykkelig klarsignal til å oppdatere dokumenterte funn når kilderegler og visningskrav følges. Dette oppdraget avgrenses til ASK-bosted og BSU-uttak i egen PR, uten sammenslåing eller publisering. Ingen sammenligningsfunksjon innføres.

Valg: Presiser at personlige skattytere må være bosatt i EØS for å opprette ASK. Presiser at årets BSU-innskudd kan tas ut før årsslutt uten vilkårsbrudd, og avgrens tilbakebetalingssetningen til tidligere års innskudd. Kilder: Skatte-ABC 2025/2026 A-10-1 og B-19-7.1, lest 29.10.2026 av ChatGPT/Codex, egenkontroll. Full kontrolloversikt i research/svarutkast/KONTROLL-EGENSKAPSFUNN-2026-10-29.md.

Alternativer: Bare loggføre feilene ville bevart for vide påstander. En bred omskriving eller generell sammenligningsdatabase går ut over den avgrensede rettingen. Usikre påstander føres som åpne i dokumentprøven, og brukes ikke til nye fakta i svarene. Ny uavhengig kontroll og visningskontroll i aktuelle størrelser kreves før sammenslåing.


## README for nedlasting og utprøving (29. oktober 2026)

Lars bestiller brukerrettet README nå, med «Denne versjonen av Spareverksted er i en tidlig fase», anbefaling om å vente med ordinær bruk og publisering av egne kopier til relevante regulatoriske spørsmål er avklart, og lenken «Se testversjonen på nett». Strenge kildekrav setter grenser for både Lars og KI-en han bruker. Dette er en anbefaling, ikke et nytt lisensvilkår eller en myndighetsgodkjenning.

Valgt: kort README med oppstart, bruk, begrensninger, personvern, tilgjengelighet, lisens og hjelp. Arbeidsdokumentasjon lenkes med full GitHub-adresse. Modellvalg og drift bevares i docs/beregningsmodell.md og docs/drift.md. Begge ZIP-mappenavn forklares. Alternativet å beholde kontrollhistorikk og detaljer i README forkastes fordi det skjuler oppstartsinstruksjonene. En utvidet ZIP med all dokumentasjon er ikke valgt; nødvendige instrukser og lisens følger pakken allerede. Pakkeskriptet endres ikke.

Kontroll: pakken er laget og pakket ut i tom mappe av ChatGPT/Codex. README-kommandoen starter lokal server, og alle fem HTML-sidene svarer. Offline beregning og nettlesertester er tidligere rapportert kontrollert av Claude mot cf77f71, ikke kjørt på nytt av Codex. Ingen beregningskode er endret. Revurder README ved full oppstart, endret publisert funksjonalitet eller endret pakkestruktur.


## Automatisk W3C-resultat på tilgjengelighetssiden (30. oktober 2026)

Lars fant ikke W3C-kontrollen på tilgjengelighetssiden, fordi den lå i en lukket utvidbar del. Han ba om en synlig oppdatering av feil og advarsler som lages automatisk ved hver publisering, for alle sidene. Gjelder universell utforming og er innenfor unntaket fra pausen.

Valgt: GitHub Actions kjører Nu Html Checker (vnu-jar fra npm, samme validator som validator.w3.org) på alle HTML-filene i dist. Ved feil stopper testene, så siden publiseres ikke med kjente kodefeil. Advarsler stopper ikke. Ved publisering skriver scripts/w3c-status.py dato, versjon og antall feil og advarsler per side inn mellom markørene w3c-status i den publiserte kopien av tilgjengelighet.html. Ingenting committes tilbake. Besøkende kontakter aldri W3C.

Alternativer: Hente resultatet fra validator.w3.org i nettleseren ble forkastet: eksterne kall fra besøkende bryter personvernsiden og gjør siden avhengig av W3Cs tjeneste. Å committe resultatet tilbake til main ble forkastet fordi det gir en ekstra commit per publisering. Å la feil gå gjennom og bare vise dem ble forkastet; da kan kjente kodefeil publiseres.

Begrensning: Validatoren sjekker HTML-en slik den lastes, ikke tilstanden etter at JavaScript har kjørt, og den sier ikke at siden er tilgjengelig. Versjonen er ikke låst, så nye regler i validatoren kan gi nye feil uten at koden er endret. Revurder hvis det skjer ofte. Kontroll: skriptet er testet med oppdiktede resultater (tests/w3c-status.test.cjs). Den ekte validatoren kunne ikke lastes ned i arbeidsmiljøet og kjøres første gang i GitHub Actions på PR-en.


## Ressursbruk og miljø, egen redegjørelse (30. oktober 2026)

Lars bestilte en egen side etter gjennomgang av tekst og metode i samtalen. Fullmakten gjelder denne informasjonssiden, lenke fra Om-siden og en lett automatisk filkontroll. Ingen endring i kalkulatorens funksjoner eller generell gjenåpning av prosjektet.

Siden beskriver prosjektets grep, omfattende KI-bruk og ukjent miljøavtrykk. «Jeg er amatør» beholdes slik Lars uttrykkelig ønsket. Ingen påstand om utslippsreduksjon, bærekraftmåloppnåelse eller sertifisering. Versjonshistorikk føres på siden.

Filkontrollen bruker bare Python-standardbiblioteket og eksisterende CI. Den viser ukomprimerte filstørrelser og eksterne ressursreferanser i HTML, ikke trafikk eller energi. Nettverksmålinger og CO₂.js venter på eget testoppsett og kildekontroll. Ingen ekstra analyseverktøy lastes hos brukerne.

Revurder ved nye måledata eller dokumenterte metodebegrensninger. Se docs/ressursbruk.md for oppfølging. ChatGPT/Codex har skrevet kode og side i denne endringen.


### Avgrenset nettlesermåling, 30. oktober 2026

Lars fulgte opp med «Vi følger din plan»: første/gjentatt besøk og syntetiske brukerhandlinger, lokale tester før produksjonskontroll, ingen CO₂.js ennå. Måleskript og separat, tidsavgrenset workflow er skrevet. Målingen venter på første fullstendige nettleserkjøring; dette merkes på siden. Ingen utslipps- eller miljøgevinst hevdes. Verifikasjon og mangler står i docs/ressursbruk.md.
## Feltfeil ryddes og vises ved inntasting (30. oktober 2026)

Lars bestiller retting etter egen prøving på iPhone og PC. Feiltekst og rødt aldersfelt blir stående etter retting, store beløp slipper gjennom startguiden, og kalkulatorens feiltekst ligger utenfor området brukeren ser. Valgt: samme motorgrenser i startguide og kalkulator, kontroll ved forlatt startfelt og oppdatering av allerede viste feil under retting, vedvarende tekst ved hvert ugyldige felt og rydding når verdien er gyldig. Ingen automatisk fokusflytting mens man skriver. Ved innsending med feil går fokus til første ugyldige startfelt. Beregninger og grenser endres ikke.

Forkastet: bare forlenge #toast, fordi startguidens #journeyError og kalkulatorens #error er separate vedvarende elementer. Bare endre tester forkastes fordi brukeren har dokumentert feil. Den eksisterende åttesekunders statusmeldingen beholdes, men må vurderes sammen med de varige feltbeskjedene. Skjulte SliderUnlock-knapper får navn fra opprettelse. Dette er UU-retting innenfor oppdraget, ingen ny økonomisk funksjon eller regulatorisk avklaring. Revurder hvis feiltekst leses dobbelt eller blir forstyrrende med hjelpemidler. Detaljer i research/uu-egenkontroll-uutilsynet.md og #124.

## Menyer skal ha innhold og fungere ved zoom (30. oktober 2026)

Etter Lars' egenprøve: bare skjul doble navigasjonslenker i en bred PC-meny når menyen fortsatt inneholder kalkulatorhandlinger. Menyen på infosider, start og Spør om sparing må være tilgjengelig. Toppfeltet får vokse i høyden ved smal visning. Forkastet: skjule alle menylenker fordi det gir tom ramme på infosider. Å gjøre Shift+Tab til en ny beregning forkastes fordi navigasjon ikke skal endre planen. Ny beregning finnes allerede i menyen. Grafens linjeforklaring skjules ikke for hjelpemidler uten at faktisk brukerproblem er gjenskapt. Rapport og avgrensninger i research/uu-egenprove-2026-10-30.md. Revurder ved faktisk zoom- eller skjermleserprøve som viser tap av funksjoner eller uklar leserekkefølge.


## W3C: overskriften tilhører resultatartikkelen (30. oktober 2026)

Lars ber om retting av «Article lacks heading» og om at bærekraftsiden inngår i W3C-kontrollen. Alle dist/*.html, også ressursbruk.html, kontrolleres allerede automatisk. Rapporten får lesernavnet «Ressursbruk og miljø». Resultatets indre hero-beholder blir div i stedet for section, slik at eksisterende h2 tilhører resultatartikkelen. Artikkelen beholder navn, resultat og forklaring, og ingen ekstra eller skjult overskrift legges til. Forkastet: en ny overskrift bare for validatoren, eller å fjerne artikkelens samling av resultat og forklaring. Ingen beregnings- eller funksjonsendring. Ekte Nu-kontroll må bekrefte at varselet er borte før det omtales som løst.
