# Vurderingsnotat: folkeopplysning, tematisk relevans og dokumentasjon

**Status:** Internt vurderingsnotat, skrevet 26. oktober 2026. Ikke en juridisk avklaring, godkjenning, beslutning eller bestilling av funksjoner. Notatet endrer hverken sperrene i [docs/regulatorisk.md](regulatorisk.md), porten for fase 3 eller noe i [BESLUTNINGER.md](../BESLUTNINGER.md). Prosjektpausen gjelder uendret.

**Hvem:** Skrevet av Claude etter oppdrag fra Lars. Inneholder Lars og GPTs vurderinger og ønskede prinsipper. Kildekontrollen i notatet er gjort med KI (Claude). Den er ikke uavhengig menneskelig fagkontroll og skal ikke omtales slik.

**Bruk:** Grunnlag for senere vurderinger og eventuelle oppfølgingsspørsmål til Finanstilsynet. Notatet skiller mellom tre ting, og de skal ikke blandes når det brukes videre:

1. **Kildefunn** (punkt 2): det kildene faktisk sier, med side, artikkel eller ledd.
2. **Vurderinger og ønskede prinsipper** (punkt 3): det Lars og GPT mener bør gjelde. Ikke vedtatt.
3. **Uavklarte hypoteser og juridiske spørsmål** (punkt 4): det vi ikke vet.

## 1. Arbeidsgrunnlag og bakgrunn

**Kontrollert kode og grener, 26. oktober 2026:**

| Hva | Commit | Merknad |
| --- | --- | --- |
| `main` | `b2eada7` | Autoritativt arbeidsgrunnlag |
| PR #77, `docs/regulatorisk-pause` | `ee243ff` | Ikke sammenslått. Dette notatet bygger på grenen |
| PR #71, `docs/kilderegler` | `2304cc6` | Forslag til KILDEREGLER.md. Ikke sammenslått |
| PR #68, `feature/veileder-alder-tilpasning` | `0223e12` | Forslag om aldersstyrte forslag. Ikke sammenslått, ikke vedtatt |
| PR #79, `docs/ki-presisering` | `452ccea` | Presisering av KI-bruk. Ikke sammenslått |

Lest i repoet: AGENTS.md, CONTRIBUTING.md, SPRAKREGLER.md, BESLUTNINGER.md, research/plan.md, research/veileder-kilder.md, docs/regulatorisk.md (PR #77), KILDEREGLER.md (PR #71), relevante differ i PR #68 og #79, og `suggestions()` og `answer()` i `dist/veileder-engine.js` på main.

**Henvendelsen til Finanstilsynet** (opplysninger fra Lars, ikke kontrollert av Claude mot originalen):

- Sendt 25. oktober 2026. Automatisk mottaksbekreftelse samme dag.
- GPT kontrollerte den sendte versjonen 26. oktober 2026.
- Punkt 2 i henvendelsen spør om automatisk utvalg av forhåndsskrevne spørsmål og svar ut fra alder, sparehorisont og sparemål kan regnes som personlig anbefaling.
- Lars ringte 26. oktober 2026 kl. 14.05 og fikk ikke tydelige svar. Registrert i PR #77.
- Ingen av disse forholdene er en faglig avklaring eller godkjenning. Original korrespondanse oppbevares privat hos Lars og skal ikke inn i repoet (se docs/regulatorisk.md, «Personvern»).

## 2. Dokumenterte kildefunn

Lest av Claude 26. oktober 2026 fra PDF-er Lars lastet opp. Sitater er gjengitt kort; les kilden ved bruk.

| Kilde | Hva den sier | Hva den ikke sier |
| --- | --- | --- |
| ESMA, Q&A on MAR (ESMA70-145-111), Q&A 8.1, s. 31 til 32 (oppdatert 26.10.2016) | Om noe er en investeringsanbefaling, vurderes ut fra innholdet, «irrespective of its name or label and the format, form, or the medium». En standardisert kommunikasjon som er «structured and pre-planned for distribution channels» og uttrykkelig eller underforstått foreslår en investeringsstrategi for et instrument eller en utsteder, skal regnes som anbefaling. | At forhåndsskrevne svar er anbefalinger. Forhåndsplanlegging er ett kjennetegn, men teksten må også foreslå en strategi og oppfylle de øvrige vilkårene. |
| Samme, Q&A 8.2, s. 32 til 33 (oppdatert 26.10.2016) | Kommunikasjon uten henvisning til instrument eller utsteder skal «generally not» regnes som anbefaling, men vurderes konkret. Den kan likevel være det når en «reasonable investor» kan utlede at den underforstått anbefaler bestemte instrumenter eller utstedere. ESMAs eksempel: en vurdering av en sektor med svært få utstedere. | Noe om indeksfond eller kostnadsrangeringer. Anvendelsen på slike eksempler er vår vurdering (punkt 4, H3). |
| Samme, Q&A 8.4, s. 33 (oppdatert 26.10.2016) | Utsagn om at et instrument er «undervalued», «fairly valued» eller «overvalued», og kursmål eller andre meninger om verdien, regnes som underforstått anbefaling for instrumenter som handles på regulert marked, MTF eller OTF. | Hvordan dette gjelder fond som ikke handles på slike markedsplasser. |
| Samme, Q&A 8.5, s. 33 (oppdatert 20.12.2016) | Kommunikasjon med «purely factual information» om instrumenter eller utstedere er ikke en anbefaling, så lenge den ikke uttrykkelig eller underforstått anbefaler eller foreslår en investeringsstrategi. | Hvor grensen går mellom fakta og underforstått forslag i en sammenligning. |
| Samme, forside og punkt 1 | Sist oppdatert 15. november 2022. Dokumentet oppdateres ikke etter 31. desember 2023. Nyere Q&A fra 1. januar 2024 finnes i ESMAs Q&A-verktøy. Formålet er felles tilsynspraksis («convergence tool»). | Om nyere Q&A i verktøyet endrer punktene over. Ikke kontrollert. |
| Forordning (EU) 2016/958, art. 1 a (EØS-tillegget nr. 82, 8.12.2020) | «Ekspert» er en person som **gjentatte ganger foreslår investeringsbeslutninger** om finansielle instrumenter, og som enten selv oppgir finansiell ekspertise eller erfaring, eller legger fram anbefalingen slik at andre har grunn til å tro det. | At hvordan man framstår, er nok alene. Begge vilkår må være oppfylt. |
| Samme, art. 2 | Den som utarbeider anbefalinger, skal oppgi sin identitet (navn og stilling for involverte fysiske personer). | |
| Samme, art. 3 (grunnkrav for alle som utarbeider anbefalinger) | Skille fakta fra tolkninger og vurderinger (a). Angi vesentlige kilder (b). Pålitelige kilder, eller si fra om tvil (c). Merke prognoser, forventninger og kursmål og angi vesentlige antakelser (d). Dato og tidspunkt for ferdigstilling (e). | At disse kravene gjelder tekst som ikke er en anbefaling. |
| Samme, art. 4 (tilleggskrav for profesjonelle etter MAR art. 3 nr. 1 punkt 34 i og for eksperter) | Blant annet sammendrag av verdivurderingsmetode og forutsetninger (b), forklaring av anbefalingen og tidsramme med egnet risikoadvarsel og sensitivitetsanalyse (e), planlagt oppdatering (f) og liste over tidligere anbefalinger (i). | At risikoadvarsel og metode er plikter for alle. |
| Samme, art. 5 | Den som utarbeider anbefalinger, skal opplyse om forbindelser og interesser som med rimelighet kan svekke objektiviteten. | |
| Verdipapirforskriften § 3-1 ellevte ledd (Lovdata-utskrift 26.10.2026, sist endret ved FOR-2026-06-08-1028) | Forordning (EU) 2016/958, «rettet ved EUT L 110 av 27.4.2017, s. 9», gjelder som forskrift med EØS-tilpasningene. | Noe om investeringsrådgivning eller om hvilke instrumenter MAR omfatter. |

**Overlevert, ikke kontrollert av Claude:** Norsk MAR-tekst fra EFTA, konsolidert per 22.04.2021. Dokumentet var ikke tilgjengelig i arbeidsmiljøet. Definisjonene i MAR art. 3 nr. 1 punkt 34 og 35 er bare lest slik ESMA siterer dem i Q&A 8.2.

**Ikke lest:** MAR art. 2 (virkeområde), verdipapirhandelloven om investeringsrådgivning, Finanstilsynets egne veiledninger og ESMAs Q&A-verktøy etter 2024. Ingen av kildene over er derfor «dagens fullstendige regelverk».

### Eksisterende tilpasning: kode, brukerflyt og publisering

Tre forskjellige ting, med forskjellig styrke som bevis. Dette er beskrivelse av funksjoner, ikke en vurdering av om de er lovlige.

**a) Koden på main (`b2eada7`).** Lest i `dist/veileder-engine.js` og `dist/veileder-ui.js`:

- `suggestions()` velger og formulerer spørsmålsforslag ut fra alder (BSU-forslag til og med `bsuMaxAge` når brukeren ikke eier bolig), sparehorisont (kortere enn `fundMinYears` gir «Hvor bør penger til et nært mål stå?»), risikovalg, gjeld og buffer.
- `answer()` legger til eller endrer deler av svaret ut fra de samme opplysningene, for eksempel aldersgrensen for BSU, sparehorisont under Forbrukerrådets anbefalte minimum og «Dyr gjeld først».
- Grensesnittet skriver «Prioritert etter opplysningene dine. Alle temaer er fortsatt tilgjengelige.»

**b) Brukerflyten, kjørt lokalt.** Claude kjørte `dist/spor.html` fra `b2eada7` i Chromium (Playwright, 390 px bred) 26. oktober 2026, fylte ut «Tilpass spørsmål og svar», trykket «Oppdater vurderingen» og åpnet første forslag:

| Opplysninger | Forslag som vises | Første svar, tilpassede deler |
| --- | --- | --- |
| Ingen | Pensjon, sparekonto eller fond, barnets navn. Hjelpetekst: «Velg et spørsmål, eller søk med egne ord.» | Ingen kontekstlinje |
| Alder 25, eier ikke bolig | «Kan BSU passe til boligplanene mine?» først | «Basert på: alder 25 år.» |
| Alder 70, eier ikke bolig | Samme tre som uten opplysninger. BSU foreslås ikke | «Basert på: alder 70 år.» |
| 2 år til bruk | «Hvor bør penger til et nært mål stå?» først | Delen «Pengene skal brukes snart» |
| Dyr gjeld, ingen buffer, alder 25 | Bare «Hvordan bygge en reserve og betale ned dyr gjeld?» | Delen «Dyr gjeld først» |
| Alder 70, søker «hva er BSU» | (søk) | Svaret vises, med ekstra del «Aldersgrensen» |

Med opplysninger står hjelpeteksten «Prioritert etter opplysningene dine. Alle temaer er fortsatt tilgjengelige.» Ikke kjørt: flyten der alder og sparetid hentes automatisk fra kalkulatoren, Safari, Firefox og mobil.

**c) Det publiserte nettstedet.** GitHub-utrullingen til `github-pages` for `b2eada7` ble fullført 25. oktober 2026 kl. 23.33 UTC (Actions-kjøringen «Test and publish Spareverksted», status success), og arbeidsflyten publiserer `dist/`. Det tyder sterkt på at koden over er den som er publisert. Claude fikk ikke hentet filene fra nettstedet fra arbeidsmiljøet.

Lars kontrollerte nettstedet selv 26. oktober 2026 med skjermbilder (ikke lagt i repoet). Det skiller to forhold:

- **Bekreftet på nettstedet:** Når brukeren fyller inn feltene under «Tilpass spørsmål og svar» på spørresiden, endres forslagene under «Spørsmål du kan starte med». BSU kan da komme først *blant de tilpassede forslagene*. «Vis alle temaer» er den generelle temalisten, og den står separat. Det er altså ikke riktig å si at BSU kommer først på hele siden.
- **Observert feil i brukerflyten:** Opplysninger fra forsiden fulgte ikke med da Lars trykket «Spør om sparing». Skjermbildene viser ikke årsaken. Koden på main (`dist/veileder-bridge.js`) prøver å overføre via `sessionStorage` i samme fane. Mulige forklaringer, ingen av dem kontrollert: at alder ikke var oppgitt i kalkulatoren, at overføringen bare skjer i visse tilstander, eller en feil. Inntil dette er undersøkt, skal vi ikke påstå at opplysningene følger automatisk med fra kalkulatoren. Undersøkelse og eventuell retting er en egen oppgave og omfattes av pausen.
- **Bekreftet på nettstedet med skjermbilder fra Lars 26. oktober 2026:** BSU-svaret ved oppgitt alder 70 år har avsnittet «Aldersgrensen» under «Les en utfyllende vurdering». I den viste utdypingen ved alder 14 år mangler avsnittet. Dette bekrefter denne forskjellen i svarteksten, ikke alle svarvarianter.
- **Bare kontrollert lokalt:** De ekstra delene «Pengene skal brukes snart» og «Dyr gjeld først» er vist i kjøringen (b), men ikke bekreftet på publisert side i denne gjennomgangen.

**d) Utvidelsen i PR #68** (ikke sammenslått, ikke vedtatt) legger til nye aldersgrenser på 18 og 62 år for pensjon og barnesparing. Den er noe annet enn tilpasningen som finnes i dag, og må holdes atskilt når dette beskrives.

Henvendelsens punkt 2 dekker problemstillingen, men ifølge GPTs kontroll av den sendte e-posten beskrives tilpasningen der som noe som «videre vurderes», og eksemplet som en funksjon som ikke er ferdig. Claude har ikke lest e-posten. Se H5 og angrepsflate A3.

## 3. Lars og GPTs vurderinger og ønskede prinsipper

Ingen av punktene er vedtatt. De er skrevet som mulige framtidige prinsipper og knyttet til eksisterende regler i stedet for et nytt regelsett.

### 3.1 Tematisk relevans

**Ønsket prinsipp:** Alder kan brukes som en hypotese om hvilke emner en person kan være interessert i. En 70-åring kan for eksempel være interessert i pensjon, gaver og forskudd på arv. Foreslåtte emner kan prioriteres, men alle emner skal fortsatt være tilgjengelige i temavalget og søket.

**Grense:** Alder fastslår hverken økonomi, behov, familieforhold eller hvem personen spør på vegne av. Alder skal ikke brukes til å skjule innhold eller til å si at noe passer for brukeren.

**Eksisterende regler:** SPRAKREGLER.md punkt 1 («Tilpass bare til opplysninger som faktisk er gitt og brukes»). research/veileder-kilder.md, «Forenklet versjon» (ukjent alder gjettes ikke). docs/regulatorisk.md, «Sperrer som gjelder også etter oppstart», nr. 1.

**Status:** Juridisk uavklart (punkt 4, H1). Skal ikke implementeres på grunnlag av dette notatet.

### 3.2 Objektive forklaringer

**Ønsket prinsipp:** ETF-er, passive og aktive fond, aksjer, kostnader og risiko kan forklares med etterprøvbare kilder. Et produktnavn gjør ikke alene en tekst til en anbefaling (Q&A 8.5). Fravær av produktnavn er heller ingen garanti når teksten likevel peker mot bestemte instrumenter eller utstedere (Q&A 8.2).

**Vurdering:** Hele framstillingen må vurderes samlet: spørsmålet, overskriften, utvalget, sammenligningen, rekkefølgen, visuell framheving og konklusjonen. En setning om at informasjonen er generell avgjør ikke klassifiseringen alene (jf. Q&A 8.1 om innhold framfor merkelapp).

**Eksisterende regler:** README.md og research/veileder-kilder.md (ingen navngitte fondsanbefalinger, ingen bestemt aksjeandel). docs/regulatorisk.md, sperre nr. 2. Omtalen av Nordnet og Investeringskonto Zero skal stå urørt til svaret er vurdert (docs/regulatorisk.md, eget avsnitt).

### 3.3 Fordeler og ulemper

**Ønsket prinsipp:** Hver påstand har kildegrunnlag og relevante vilkår. Det står hva alternativet sammenlignes med. Dokumenterte fakta skilles fra egne begrunnede vurderinger. «Lavere kostnader» og «mer fleksibelt» forklares konkret: lavere enn hva, for hvem og på hvilke vilkår.

**Ikke:** Krav om et bestemt antall fordeler og ulemper, utfylling for symmetriens skyld, eller grunnbegreper presset inn i en sammenligning.

**Eksisterende regler:** SPRAKREGLER.md punkt 3 («Ikke lag ekstra fordeler eller ulemper for å fylle en mal») og punkt 2 («Ikke press alle spørsmål inn i en sammenligning»). research/plan.md punkt 5 (svarformen «Forklaring» krever ikke to alternativer). Forordning 2016/958 art. 3 nr. 1 a er et pliktkrav bare innenfor anbefalingsregelverket, men samme skille er et godt frivillig kvalitetsmål også utenfor.

### 3.4 Gjeld, buffer og investering

**Ønsket prinsipp:** Forklar begrunnelsene og sammenhengene uten å foreskrive én universell rekkefølge og uten formuleringer som «for deg vil det lønne seg å kjøpe fond». Skill gjeldstype, rente, likviditet og andre vilkår.

**Dokumentasjon:** Påstander som «mange velger» trenger kilde til hvor utbredt valget er, ikke bare en kilde som anbefaler handlingen.

**Eksisterende regler:** SPRAKREGLER.md punkt 1 (ikke utrop ett valg til best uten grunnlag). KILDEREGLER.md K5 i PR #71 (en kildes anbefaling gjengis som deres anbefaling). Se også punkt 6, M2, om KLP som kilde.

### 3.5 Historiske tall og regneeksempler

**Ønsket prinsipp:** Historikk framstilles ikke som løfte om framtidig avkastning. Periode, marked, valuta, kostnader, skatt og om tallene er nominelle eller inflasjonsjusterte, skal stå. Historisk observasjon, valgt regneforutsetning og prognose skilles.

**Vurdering:** Starttidspunkt, fall underveis og valg av periode kan endre inntrykket mye. Dette er et presentasjonsprinsipp, ikke et oppdrag om nye beregninger eller visualiseringer.

**Eksisterende regler:** SPRAKREGLER.md punkt 4 og 5 («forventet», «sannsynlig» brukes ikke løst; skill brukerens tall, eksempeltall, historikk og antakelser). BESLUTNINGER.md, «Synlig usikkerhet uten å late som vi kjenner framtiden» og «Historiske eksempler» (perioden er hele den felles dekningen, ikke valgt ut fra resultatet). Kalkulatoren skriver i dag at veksten bygger på «forventet realavkastning for aksjer (Finans Norges prognosestandard, februar 2026)» og at det ikke er en garanti (`dist/journey.js`). Formuleringen berører det art. 3 nr. 1 d sier om å merke forventninger og angi kilden. Den viser ikke at alle relevante krav i bokstav d er oppfylt, for eksempel at alle vesentlige antakelser er angitt, og art. 3 gjelder uansett bare hvis teksten er en anbefaling.

### 3.6 Kildebruk

**Ønsket prinsipp:** Prosjektets eksisterende strenge krav brukes. Offentlige primærkilder for lover, regler og offentlig veiledning. Produktvilkår for produktfakta. Relevante data eller forskning for empiriske sammenligninger. Kommersielle kilder merkes.

**Presisering:** En autoritativ kilde må faktisk støtte den konkrete påstanden. En lenke som virker, er ikke faglig kontroll. KI-kontroll skal ikke omtales som uavhengig menneskelig fagkontroll.

**Eksisterende regler:** research/plan.md punkt 6 (primærkilder, faktisk lesedato, regelår, ikrafttredelse, vesentlige unntak, neste kontroll; «Kontroller både at kildelenken virker og at svaret fortsatt følger kilden»). KILDEREGLER.md K1 til K7 i PR #71. PR #79 for omtale av KI-kontroll. Dette notatet lager ikke egne kilderegler.

## 4. Uavklarte hypoteser og juridiske spørsmål

| Nr. | Hypotese eller spørsmål | Hvorfor uavklart | Hvem kan avklare |
| --- | --- | --- | --- |
| H1 | Kan automatisk utvalg av forhåndsskrevne spørsmål og svar ut fra alder, sparehorisont og sparemål regnes som personlig anbefaling (investeringsrådgivning)? | Det er spørsmålet i henvendelsens punkt 2. Tilpasning alene er trolig ikke nok; det må vurderes sammen med om svaret gir en anbefaling om transaksjoner i bestemte finansielle instrumenter. Lovteksten om investeringsrådgivning er ikke lest i dette notatet. | Finanstilsynet (allerede spurt) |
| H2 | Omfatter MARs anbefalingsregler vanlige verdipapirfond som ikke handles på markedsplass, slik de omfatter børsnoterte fond (ETF)? | Q&A 8.4 nevner regulert marked, MTF og OTF. MAR art. 2 er ikke lest. Børsnotering alene er ikke en fullstendig kontroll av virkeområdet. | Ikke avklart. Krever lesing av MAR art. 2 og eventuelt Finanstilsynet |
| H3 | Kan en formulering som «billigste globale indeksfond» være et indirekte produktutvalg selv uten produktnavn? | Vår anvendelse av ESMAs sektoreksempel i Q&A 8.2, ikke ESMAs eget eksempel. Avhenger av hvor få produkter beskrivelsen i praksis peker på. | Vurdering. Kan tas med som eksempel hvis Finanstilsynet ber om det |
| H4 | Kan Spareverksted framstå som «ekspert» etter 2016/958 art. 1 a? | Forutsetter først at siden gjentatte ganger foreslår investeringsbeslutninger om finansielle instrumenter. Er det ikke tilfellet, er spørsmålet om framtoning uten betydning for definisjonen. Dette er en vurdering etter MAR og 2016/958. Den avhenger ikke av om tilpasningen er investeringsrådgivning etter verdipapirhandelloven (H1); de to vurderingene er forskjellige. | Avhenger av innholdet i svarene |
| H5 | Presisering av eksisterende funksjoner overfor Finanstilsynet | **Oppfølging sendt:** Lars bekrefter 26.10.2026 utsending av presiserende e-post om eksisterende tilpasning og planlagte utvidelser. Dette avslutter spørsmålet om presiseringen skal sendes, men er ingen juridisk avklaring. Sendt-versjonen er ikke lest i Gmail i denne oppdateringen. | Avvent Finanstilsynets veiledning. Se docs/regulatorisk.md, «Presisering sendt 26. oktober 2026» |

## 5. Konkrete vurderingstilfeller

| Tilfelle | Vurdering | Status |
| --- | --- | --- |
| «Du er 70, derfor passer dette fondet for deg» | Avvises som prosjektprinsipp. Kobler alder til et bestemt produkt og sier at det passer for brukeren. | Lars og GPTs vurdering. Følger også av sperre nr. 2 i docs/regulatorisk.md |
| «Pensjon, gaver og arv» foreslås, med tilgang til alle emner | Mulig tematisk navigasjon (punkt 3.1). Gaver og forskudd på arv har ikke eget svar ennå (BESLUTNINGER.md i PR #68, «Akseptert ulempe»). | Juridisk uavklart (H1) |
| En 70-åring søker etter BSU for et barnebarn | Relevant innhold skal ikke skjules på grunn av alder. Alder sier ikke hvem man spør for. Kjørt lokalt på `b2eada7`: med alder 70 gir søket «hva er BSU» svaret, med en ekstra del om aldersgrensen. BSU foreslås ikke uoppfordret. | Prinsipp. Lokal brukerflyt i Chromium. Lars har i tillegg dokumentert aldersgrenseavsnittet ved alder 70 på nettstedet med skjermbilder 26.10.2026; situasjonen med et barnebarn er et vurderingseksempel |
| «Dette alternativet har lavere kostnader» | Utilstrekkelig uten sammenligningsgrunnlag, vilkår og kilde (punkt 3.3). | Prinsipp |
| «10 000 kroner vokser slik med en valgt årlig vekst på 5 prosent» | Beskrives som betinget regneeksempel, ikke forventet resultat. Veksten er en valgt forutsetning (2016/958 art. 3 nr. 1 d som kvalitetsmål). | Prinsipp |
| «Billigste globale indeksfond» | Mulig indirekte produktutvalg, ikke automatisk ufarlig fordi produktnavn mangler (H3). | Hypotese |

## 6. Mangler og motstrid i eksisterende regler

Forslag til senere avklaring. Ingen av dem er rettet i dette notatet.

- **M1. Kildereglene står flere steder.** Kildekrav finnes i research/plan.md punkt 6 (på main), research/veileder-kilder.md (på main) og KILDEREGLER.md (PR #71, ikke sammenslått). Når #71 behandles, bør det avklares hvilken fil som gjelder ved motstrid.
- **M2. Kommersiell kilde til generelle råd.** research/veileder-kilder.md bruker KLP («Betale lån eller spare?») for buffer, dyr gjeld og tidshorisont, merket som kommersiell. KILDEREGLER.md K2 nivå 3 (PR #71) sier at bank og finansinstitusjoner ikke skal være eneste kilde til generelle råd. Om KLP er eneste kilde for noen påstand, er ikke kontrollert her.
- **M3. Mulig spenning mellom «beskriv når et valg kan passe» og «ingen egne råd».** SPRAKREGLER.md punkt 1 ber oss beskrive når et valg kan passe og passe dårlig. K5 i PR #71 sier at vi ikke gir egne råd uten kilde. De kan forenes ved at «kan passe» alltid knyttes til en kilde eller et vilkår, men det står ikke noe sted.
- **M4. Sperren for fase 3 og publisert tilpasning.** docs/regulatorisk.md sperrer kontekstuell spørsmålsveiledning «også etter oppstart», men sier samtidig at publisert innhold ikke endres av notisen. Main tilpasser allerede forslag og svar. Hvor grensen går mellom det publiserte og det sperrede, er ikke skrevet ned.
- **M5. Utbredelse.** Ingen eksisterende regel sier at «mange velger» og lignende krever kilde til utbredelsen. Kan legges til K1 når #71 behandles.

## 7. Angrepsflater og reparasjoner

| Nr. | Angrepsflate | Reparasjon i dette notatet |
| --- | --- | --- |
| A1 | Notatet kan leses som at alderstilpasning er vedtatt eller juridisk avklart. | Statuslinje øverst. Prinsippene i punkt 3 står som ønsker, H1 står som uavklart, og det vises til sperre nr. 1. PR #68 er nevnt som ikke vedtatt. |
| A2 | Kildene kan være utdaterte eller ufullstendige. ESMA-PDF-en oppdateres ikke etter 2023, MAR-PDF-en fra EFTA er ikke lest, og hverken MAR art. 2 eller reglene om investeringsrådgivning er lest. | Hver kilde har dato. Det som ikke er lest, står under «Overlevert» og «Ikke lest». Ingen påstand om at dette er dagens fullstendige regelverk. |
| A3 | Notatet drøfter tilpasning som et framtidig prinsipp, mens main allerede tilpasser forslag og svar. Det kan gi et feil bilde av hva som er publisert, både her og i henvendelsen. | Punkt 2 skiller kode, lokal brukerflyt og publisert nettsted, og skiller dagens tilpasning fra utvidelsen i PR #68. Ingen endring i nettstedet foreslås her; om publisert tekst skal justeres, avgjør Lars etter svaret (docs/regulatorisk.md). Presiseringen er sendt, se H5. M4 peker på grensen mot sperren. |
| A4 | KI-kontroll kan bli lest som uavhengig fagkontroll. | Står uttrykkelig under «Hvem». Samsvarer med presiseringen i PR #79. |
| A5 | Q&A fra ESMA kan bli lest som bindende lov. | Punkt 2 gjengir ESMAs egen formålsbeskrivelse: et verktøy for felles tilsynspraksis. Om svarene er rettslig bindende i Norge, er ikke vurdert. |

## 8. Korrektur

Kontrollert mot kildene 26. oktober 2026:

- **Navn:** ESMA70-145-111, «Questions and Answers On the Market Abuse Regulation (MAR)», versjon 17. Delegert kommisjonsforordning (EU) 2016/958. Forskrift til verdipapirhandelloven (verdipapirforskriften) § 3-1. Finanstilsynet.
- **Datoer:** ESMA-PDF sist oppdatert 15.11.2022, ikke oppdatert etter 31.12.2023. Q&A 8.1 til 8.4 oppdatert 26.10.2016, Q&A 8.5 20.12.2016. 2016/958 i EØS-tillegget nr. 82, 8.12.2020. Rettelse EUT L 110 av 27.4.2017, s. 9. Verdipapirforskriften sist endret ved FOR-2026-06-08-1028. Henvendelse 25.10.2026, telefon 26.10.2026 kl. 14.05. Datoene for henvendelse og telefon er opplysninger fra Lars.
- **Tall og henvisninger:** Q&A-sidetall 31 til 33 i PDF-en. Art. 1 a, 2, 3 nr. 1 a til e, 4 nr. 1 b, e, f og i, 5. Ellevte ledd i § 3-1. Main `b2eada7`.
- **Begreper:** «Investeringsanbefaling» (MAR og 2016/958) og «investeringsrådgivning» (verdipapirhandelloven) er forskjellige begreper. Dette notatet behandler det første ut fra kildene og det andre bare som spørsmål (H1). «Ekspert» brukes i betydningen i 2016/958 art. 1 a.

## Hva kan få oss til å revurdere notatet

- Finanstilsynet svarer.
- Nyere ESMA-svar i Q&A-verktøyet endrer punktene i avsnitt 2.
- MAR art. 2 eller reglene om investeringsrådgivning blir lest og gir et annet bilde av H1 eller H2.
- Lars vedtar noe av punkt 3. Da føres det i BESLUTNINGER.md, ikke her.

## Oppfølgingsstatus 26. oktober 2026

Lars bekrefter at presiserende e-post ble sendt 26.10.2026 som oppfølging av henvendelsen av 25.10.2026, særlig punkt 2. Den registrerte beskrivelsen er at presiseringen skiller eksisterende tilpasning fra planlagte utvidelser. Utsendingen er bekreftet av Lars; sendt-versjonen er ikke kontrollert i Gmail i denne oppdateringen. Beskrivelsen er derfor ikke en verifisert gjengivelse av e-postens ordlyd.

Kontrollstatus for funksjonene, ikke en gjengivelse av e-posten: Lars har vist tilpassede spørsmålsforslag på publisert side og skjermbilder av BSU-utdypingen ved alder 70 og 14 år, se punkt 2 c. Kort sparehorisont og dyr gjeld er bare kontrollert lokalt i denne gjennomgangen. Utvidelsen med flere aldersgrenser i PR #68 er ikke publisert.

Mottaksbekreftelsen fra Finanstilsynet 26.10.2026 kl. 15.37 norsk tid er dokumentert med et skjermbilde fra Lars og registrert i [regulatorisk.md](regulatorisk.md), «Presisering sendt 26. oktober 2026». Dette er en mottaksbekreftelse, ikke et faglig svar eller en godkjenning. Faglig avklaring avventes fortsatt. Original korrespondanse oppbevares privat. Prosjektpausen er uendret.

Skjermbildene dokumenterer ikke alle svarvarianter eller årsaken til den rapporterte overføringsfeilen fra forsiden.
