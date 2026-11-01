# Arbeidslogg for spørsmålkøen

Felles overlevering for ChatGPT/Codex og Claude. Tid oppgis i Europe/Oslo.

## Aktive reservasjoner

| ID-er | Aktør | Start | Utløp | Gren/PR |
| --- | --- | --- | --- | --- |

Ingen aktive reservasjoner fra denne økten. SV-035 og SV-017 avsluttet ved leveranse i PR #64.

Les gren/PR før en utløpt reservasjon overtas. ASK er allerede forklart på main gjennom #61; #53 er lukket og erstattet. Ingen konkurrerende researchreservasjon funnet i main eller siste logg på docs/sporsmalsko-og-nattarbeid.

## Leveranser

| Dato | Aktør | Lest main | ID-er | Leveranse og kontroll | Hindring / neste steg |
| --- | --- | --- | --- | --- | --- |
| 2026-10-24 | ChatGPT/Codex | 1de2847ab5eac3435b404ccdbb3574ad844b7534 | Alle, bare organisering | Opprettet samlet kø, felles instruks og logg. Lest eksisterende spørsmålsliste, svarenes registrering, beslutningsnotat, bidragsregler og språkregler på docs/sprakregler. Ingen ny finansfaglig faktasjekk. | Første nattøkt: SV-031 og SV-035, kontroller dekning og lag grunnforklaringer. Publiseringspause gjelder. |
| 2026-10-24 | ChatGPT/Codex | 968fa37 | Alle, bare organisering | Samlet dokumenter fra #32, #39, #40 og #48; beholdt gjeldende overleveringsregler. Oppdatert plan, lagt til AGENTS.md og koblet køen til kontrollert innholdspåfyll. | Ingen ny faktakontroll eller produktendring. Valgomaten venter; skjermlesertesting står åpen. |
| 2026-10-25, startet 02:02 +02:00 | ChatGPT/Codex | 4022c94e29a361c3ac079a7bcbe095238fe5f88c | SV-035, SV-017; dekning SV-031, SV-022, SV-006, SV-135 | To upubliserte utkast med kildetabell, angrepsflater, korrektur og selvstendig overlevering, [PR #64](https://github.com/gronnlars/spareverksted/pull/64). Kildene faktisk lest 25.10.2026. Selvkontroll, ikke uavhengig kontroll. Køens 149 ID-er, relative lenker, diff og dokumentasjonsomfang kontrollert. Ingen programtester kjørt. | ASK finnes på main etter #61; ikke duplisert. Neste grunnbegrep: SV-022. Uavhengig fagkontroll og eventuell integrasjon er egne oppgaver. |

### Overlevering fra 25. oktober

- Fullmakt: bare kø, upubliserte utkast og arbeidslogg i egen dokumentasjons-PR. Ingen sammenslåing, publisering, endring av nettsiden eller kalkulatoren.
- Arbeidsgrunnlag: main-SHA i tabellen, AGENTS.md, CONTRIBUTING.md, BESLUTNINGER.md, SPRAKREGLER.md, SOK.md, faseplan og tilgjengelighetskrav er lest. PR #48 er fortsatt åpen, men dens felles dokumenter er på main gjennom #62. Siste fjernlogg på docs/sporsmalsko-og-nattarbeid inneholdt ingen ny reservasjon eller leveranse. PR #53 er lukket og erstattet av #61. PR #63 er et åpent forslag og er ikke integrert eller testet i denne økten.
- Reservasjon: lagt på fjernversjonen av docs/research-2026-10-25 før kildearbeid, commit 38bd0ce819fbe8bc937c8c959e771150f99c5da3. Fjernlogg kontrollert etter lagring. Reservasjonen er avsluttet. Git-push fra terminal manglet brukernavn/legitimasjon; dokumentasjonen ble lagret gjennom den tilkoblede GitHub-tjenesten uten endring av tilgang.
- Kildegrunnlag: Forbrukerrådet om fondstyper og prissammenligning (sistnevnte publisert 20.10.2026), Finanstilsynet om fond og garantiordninger, Bankenes sikringsfond om garantiens virkeområde, SSB om inflasjon, og DNB om indeksforvaltning (kommersiell primærkilde). De konkrete URL-ene, støttede påstander og unntak står i utkastene. Ingen nye skattesatser, produktpriser, avkastningsprognoser eller vedtatte regelendringer påstås.
- Åpne hull: skatt på barnesparing føres under SV-006/SV-007, BSU ved flytting under SV-135 og renters rente under SV-022. Faktisk kode er lest, men søkene er ikke kjørt. Fullstendige BSU-kontrolltilfeller og forventninger står i køens daterte dekningskontroll og må følge videre oppdrag. Ingen GAPS-rad er fjernet.
- Utført kontroll gjelder dokumentasjon og egen kildekontroll. Ingen Node-, nettleser-, iPhone-, skjermleser-, forståelses- eller publiseringskontroll er utført. Grønn CI eller faktisk publisert versjon er ikke bekreftet i denne økten.
- Neste arbeid: hent fersk main, åpne dokumentasjons-PR-er og logg. Gjenbruk utkastene i PR #64 hvis de ennå ikke er integrert i dokumentasjonen. Behandle SV-022 før nye boligtemaer etter køens prioritet. Svaret må forklare avkastning på tidligere avkastning med klart merkede forutsetninger; positive prosenter skal ikke framstilles som en markedsprognose. Fortsett i researchfasen; det foreligger ingen fullmakt til innholdspublisering.

### Integrasjon etter nytt oppdrag 25. oktober

Lars bestilte publisering. Dette erstatter researchoppgavens avgrensning for denne leveransen. ChatGPT/Codex har kontrollert kildene på nytt og integrert SV-035/SV-017 i eksisterende forklaringsvisning. 15 Node-testfiler og 156 søketilfeller består lokalt. Nye nettleserkontroller ved 320/390 px i eksisterende test, kjøres i CI. Lokal nettleser mangler. Ingen kalkulatorendring. PR #63 er nå på main og er bevart. Neste research: SV-022.


### GAPS-oppdrag 25. oktober 2026, lokal leveranse

ChatGPT/Codex. Lest main `f9c553aa668fd0bf96ce14d6930f5ec02897abd6`. Lokal gren `draft/gaps-2026-10-25`. Brukerens uttrykkelige forbud mot push går foran nattinstruksens reservasjons-push. Ingen fjernreservasjon eller PR opprettet. Ingen aktive reservasjoner på main. Oppdaget eksisterende SV-022 i PR #65 og gjenbrukte dette framfor en konkurrerende implementering. De andre GAPS-utkastene er nye. Ingen filer i dist endres.

SV-022, SV-006/SV-007, SV-135, SV-050/SV-051 og SV-061: kilder åpnet og lest 25.10.2026, kildeunntak og avgrensninger i utkastene. BSU ved utenlandsflytting er ikke avklart. DNBs fagavsnitt har ikke dokumentert egen kildedato. Kilderegler fra åpen PR #71 er lest som forslag, ikke som sammenslått regelverk. Evalueringsfilen finnes hverken på main eller i treet på origin/review-spareverksted-15379697258072798651, d7e02fd; kunne ikke leses. Ingen tidligere evaluering er lagt til grunn som autoritet.

Kontroll: alle 15 eksisterende Node-testfiler består. Historisk søkesett: 156 tilfeller, 0 WD, 115/115 prioriterte søk har relevant treff blant de tre første på uendret produktkode. Isolert registrering av de fem utkastene: 35 nye søketilfeller og fem svarkort består. Sammenlignet med samme basis endres fire av 156 søk, alle gjelder de bestilte hullene. Se rapporten for begrensningene. Ingen nettleser- eller skjermlesertest utført. Tekstforslag for søkemeldinger avventer Lars og er ikke lagt inn.

Neste steg: avklar kildeforbehold, få uavhengig fagkontroll og Lars sin tekstgodkjenning. Eventuell senere integrasjon må samordnes med #65 og bevare uavklarte hull. Denne leveransen gir ingen fullmakt til push, merge eller publisering. Ingen reservasjon står aktiv fra denne økten.


### Revisjon av SV-022 etter Claudes KI-kontroll, videresendt av Lars, 25.10.2026

DNB og skattekortsiden er tatt ut av SV-022. Skatte-ABC R-10-1.1, SSB og Finanstilsynet er faktisk åpnet på nytt og relevante avsnitt lest. Kildedato/regelår eller «udatert» står i data som blir synlige i kildetittelen og forbeholdet. Matematikk merkes som egen illustrasjon. Kortsvaret er avgrenset til renters rente, gjentakelse fjernet, forbehold samlet ved eksempelet, kjøpekraft løftet og kalkulatorlenke med eksempelverdier lagt til i utkastet. Ingen påstand om at tid alltid er viktigere enn rente.

JSON er én fasit; fem Markdown-utkast genereres og samsvarskontrolleres. De fire andre svartekstene er ikke omskrevet. Isolert søkeprøve består med 35 tilfeller og samme fire historiske endringer. Kontrollregning og lenkens felt/11 025 kr består i Node. Faktisk visningstest er forberedt og forsøkt, men stoppet fordi Chromium mangler; installasjonen feilet. Ingen visuell test bestått. Claudes KI-kontrollregning dokumenteres separat fra ChatGPT/Codex sine egne testkjøringer. Ingen menneskelig kontroll er dokumentert. Uavhengig kontroll av originalkildene gjenstår. Se research/svarutkast/SV-022-KONTROLL.md. Ingen push, merge, integrasjon eller publisering.

### Rettet attribusjon og fulgt opp Claude, 25.10.2026

Det var Claude, ikke Lars, som utførte kontrollregningen og kildevurderingen videresendt i samtalen. Feil attribusjon er rettet i egne dokumenter, JSON og generert SV-022. Begge verktøyenes kontroller er KI-kontroller. Ingen menneskelig kontroll er dokumentert.

Skattepåstanden er lagt inn i svarteksten med kildehenvisning til Skatteetatens hovedregel. Finanstilsynets kilde er ikke lenger kalt udatert: offisielt søkeuttrekk sier «Sist publisert: 23. oktober 2026». Claude-opplysningen om opprinnelig publisering 27.05.2016 og råmetadata er ikke bekreftet av ChatGPT/Codex; rå HTML ga 403, datoens synlighet må kontrolleres av et menneske. Skatteetatens faktiske avsnitt er lest etter innholdsfortegnelsen i KI-uttrekket. Menneskelig kontroll gjenstår etter Lars sitt oppdrag.

Kilderegler er hentet på nytt fra docs/kilderegler, blob 604b7d2c0ab5cfc7620a3da5159b29aaead3c68c. Ingen KILDEREGLER.md på main f9c553a. Det påstås ikke at regel-PR #71 er merget.

Andre utkastlenke gir kroner og kjøpekraft sammen i grafen: 10 000 kr, to år, 2 % rente og 2,5 % prisvekst, alle som illustrasjon. Gir 10 404 kr og 9 902,68 kr målt med prisene ved starten. 5 % rente med 2,5 % prisvekst ville gitt økt kjøpekraft før skatt/kostnader, så det er ikke brukt til et motsatt budskap. Begge lenker kontrollert mot sanitize og egen formel, uten produktendring. Den andre lenken finnes foreløpig i utkastet, ikke i nettstedets visning. Isolert søkeprøve består, samme fire historiske endringer. Nettlesertesten forsøkt på nytt og blokkert av manglende Chromium. Ingen push eller integrasjon.


### Firefox og WebKit forsøkt 25.10.2026

Etter Lars sitt oppdrag er SV-022-prøven gjort valgfri mellom chromium, firefox og webkit, med tidsgrenser. Firefox 153.0/build 1538 og WebKit 26.5/build 2336 er faktisk lastet ned via Playwrights alternative adresse. Firefox startet, men innholdsprosessene krasjet ved `/proc/self/uid_map: EPERM` og signal 11. Kjøring og diagnosekjøring ble avbrutt; ingen sidetester bestått. WebKit-prøven stoppet før sidetesting fordi systembiblioteker mangler. Ordinær `playwright install-deps webkit` feilet med exit 100 og setgroups/setegid/seteuid-tillatelsesfeil. Ingen miljørestriksjoner er endret. Ingen push, CI-kjøring eller publisering. Full feilstatus i SV-022-KONTROLL.md. Nettleserkontrollen er fortsatt åpen.

### Kilder bekreftet av Lars og push godkjent 25.10.2026

Lars opplyser at han har sjekket kildene og at siden kan pushes. Han har ikke regnet; Claude og egne programtester står for kontrollregningen. Godkjenningen gjelder SV-022 slik gjennomgått. Bare renters rente integreres. Andre GAPS-svar og søkemeldingene er ikke lagt inn. Renters-rente-raden tas ut av GAPS, og begge eksempellenkene støttes av eksisterende next med valgfri more-liste. Kalkulatoren er urørt. Produkt og Markdown genereres fra JSON. Fersk main/AGENTS er hentet via GitHub; main er f9c553a, PR #65 er fortsatt åpen på 2385ddb. Den nye leveransen erstatter SV-022-delen der; øvrige endringer fra #65 tas ikke med automatisk.

Før push: 156 historiske søk sammenlignet mot main; bare t21 endrer seg til det nye svaret. De øvrige 155 er uendret. Node-tester kjøres på integrert versjon. Den faktiske nettleserprøven, uten utkastinjeksjon, kjøres i CI for Chromium, Firefox og WebKit. Kontrollgren pushes først; faktisk CI og publisering må bekreftes separat.


### Delkontroll av eksisterende ASK og fondskonto, 28. oktober 2026

ChatGPT/Codex, startet kl. 12.38 CET. Lest main-commit `00d8f1536802b69eebf05a1034f388bd87550d9f`. SV-031/q-aksjesparekonto og SV-122/q-fondskonto. Reservasjon pushet før kildearbeid i commit `a5aba3bc6f2283fa43e8b629325cfa054c831738`, og fjernloggen lest tilbake. Reservasjonsraden hadde feil starttid 12.45, faktisk startet denne kjøringen 12.38. Reservasjonen er nå avsluttet. Ingen andre aktive reservasjoner funnet i lest main eller kontrollgren.

Viderefører PR #72 og bevarer tidligere rapport. [Ny delkontroll](svarutkast/KONTROLL-ASK-FONDSKONTO-2026-10-28.md) inneholder konkret kildebelegg, datoer, funn og rettelsesforslag. Publiserte knowledge-, facts- og ui-filer er hentet og byteidentiske med lest main. Motor/kortbygger undersøkt i repo. Dette er ingen nettlesertest. Norske primærkilder hos Skatteetaten faktisk lest 28.10.2026. Egenkontroll: tall stemmer, åtte søk kjørt, to profiler sammenlignet for begge svar. Garantert kapitalforsikring gir for bredt treff. Tidligere antakelse om engelsk kildetekst er korrigert etter faktisk lesing. Fondskontoens kildebeskrivelse er foreldet mot åpnet 2026-rettledning. Ingen produktpåstander nykontrollert.

Køen oppdatert for disse to ID-ene. Ingen ny permanent kø, nye temaer eller produktendringer. Eksisterende ni begrepsutkast utenfor repoet hos ChatGPT, ikke tilgjengelige for andre bidragsytere funnet og lest som arbeidsgrunnlag, ikke nygodkjent eller overskrevet. Samlet fagkontroll av den gjenstår. Aktive avvik gjennomgått. Full K7-runde etter statsbudsjettet er ikke dokumentert i de leste loggene. Ingen utløp innen to uker funnet blant datofestede aktive avvik.

Neste del: q-bsu-basics og q-ips-ask med 2026-regler og eksisterende tilpasning. Hele gjennomgangen er ikke ferdig. Kontroll av en annen enn skribenten, faktisk visning, tilgjengelighet og brukerforståelse gjenstår. Ingen program- eller nettlesertestfiler endret. Kun dokumentasjon på kontrollgrenen, ingen sammenslåing til main eller publisering.


### BSU og IPS, kildekontroll 28. oktober 2026

ChatGPT/Codex. Start kl. 13.13 Europe/Oslo. Lest main `00d8f1536802b69eebf05a1034f388bd87550d9f`. Lars ba uttrykkelig om videreføring. Reservasjon ble lagret og kontrollert på fjernversjonen før research, og er avsluttet ved denne leveransen. PR #72 videreføres.

SV-133 og SV-087/SV-090: [kontrollnotat](svarutkast/KONTROLL-BSU-IPS-2026-10-28.md). Skatteetatens relevante norske avsnitt faktisk lest 28.10.2026. Kontrollerte 2026-grenser samsvarer. 2027-forslaget er holdt atskilt. Dokumentert manglende svar om oppussing ved direkte BSU-treff, manglende støtte for sparevaneeffekt og eksisterende profiltilpasning som også bytter alternativkort. Åtte søk og 14 systematiske korttilfeller kjørt i Node, i tillegg utforskende profiler. Regnekontroll 2 750 kr. Egenkontroll, ikke uavhengig fagkontroll eller juridisk vurdering.

Bare dokumentasjon i egen gren. Ingen produktkode, tester, sammenslåing eller publisering. Ingen faktisk live-, nettleser-, mobil- eller skjermleserkontroll i denne deløkten. Neste: fullfør kontroll av arvede råd og resten av eksisterende svar. K7-runden og uavhengig kontroll gjenstår. Ingen ny reservasjon aktiv.


### Revidert PR #72 før Claude-kontroll, 28.10.2026 kl. 14.23 Europe/Oslo

ChatGPT/Codex, etter Lars sitt uttrykkelige oppdrag. Fersk main `11df29417b0e094958cf2958b1b14044258b7c5d`, bekreftet identisk med main ved sammenligning. Relevante norske primærkilder faktisk nyåpnet og fagavsnitt lest i denne arbeidsøkten. Kilderegler blob `7d1bae6049c569844527ad94092fa2d7017b7343`. Regler og kildeversjoner er registrert i hovedrapporten.

Gjennomgått PR-ens fem dokumenter. Ryddet hovedrapportens motstridende statuser og flyttet tilbakekalte funn til lenket git-historikk. Oppdatert begge delnotater med ny kildekontroll. Nytt funn om bruk av ubenyttet fondskontoskjerming mot rentedelen; korte og lange kildeavsnitt er synliggjort. Dokumentert Skatte-ABCs eldre løpende beløp ved siden av 2026-merknaden. Lest universitetskilde til regnemetoden. Ny Node-kontroll av regneeksemplene. Ingen ny søke-, profil-, nettleser- eller live-test. Ingen selvkontroll omtales som uavhengig kontroll.

SV-031, SV-122, SV-133, SV-087/SV-090: kildeoppdatert dokumentasjon til Claude, fortsatt åpne produktfunn. Hovedrapporten inneholder selvstendig oppdrag med kilder og konkrete kontrollkrav. Claude har ikke kontrollert denne revisjonen ennå. Lars sjekker etterpå. Ingen oppdrag sendt automatisk. Ingen produktkode, tester, sammenslåing, auto-merge eller publisering. Ingen aktiv reservasjon etter leveransen. Hele nettstedets K7-runde og full kontroll av arvede råd gjenstår.


### Oppfølging av Claudes kontrollrapport, 28.10.2026

ChatGPT/Codex har lest rapporten fra Claude, commit dfc0258f122103a1d4c7075bd64f372d63609b84. Rapporten står uendret. A1 til A13 er behandlet i egne dokumenter: konkret skjermingseksempel med kildeforbehold, årsskille 2025/2026, kilde D som eneste støtte i utvalget for alder/renter/oppussing, historisk lesestatus avklart, nivå og kontrolldato per kilde, eksplisitt sperre mot å endre Nordnet-setningen, samordnet køstatus, lenket BSU-delkontroll, utilgjengelig samling merket og matematisk omregning avgrenset. Forbrukerrådets metadata 16.10.2026 er bekreftet med direkte HTML-lesing.

A15: begge IPS-adresser ga lesbar norsk tekst i kildeverktøyet. Direkte HTTP-forsøk ga 403 for begge. Ingen redirect eller canonical-tag er bekreftet av GPT. Dokumentasjonen lenker til nn-adressen Claude leste; produktet er urørt. A14 er fortsatt et spørsmål til Lars, ikke et vedtatt avvik. Ingen endring i BESLUTNINGER.md eller omtalen av Nordnet.

Ny kildekontroll og dokumentretting er egenkontroll. Claudes uavhengige kontrollregning er registrert som separat KI-kontroll. B, D, H og J er fortsatt ikke lest av Claude. Endringene etter hans kontroll må kontrolleres før godkjenning. Ingen ny produkt-, nettleser- eller søketest. Ingen sammenslåing eller publisering.


### Lars sin kildekontroll mottatt 28.10.2026

Lars har sendt konkrete kildeutdrag og myndighetsutskrifter for H og G. GPT har lest begge PDF-er, kontrollert relevante sidetall og beregnet SHA-256, registrert i hovedrapportens avsnitt «Lars sin ordlydskontroll». Alder, oppussing, ASK-grunnlag, IPS-fradragets type og rettledningens uttaksavsnitt er dokumentert i hans utdrag. Utdraget av BSU-renter inneholder bare overskrift, og garantiavgrensningen mangler. Disse er uttrykkelig fortsatt åpne for menneskelig ordlydskontroll. Ingen helhetlig faglig godkjenning eller fullført K7 erklæres. Ingen endring i Claudes rapport, produktet eller tester. Ingen sammenslåing eller publisering.


### Supplerende ordlydsdokumentasjon fra Lars, 28.10.2026

To skjermbilder fra Skatteetaten er lest av ChatGPT/Codex. Lars har nå dokumentert garantiavgrensningen i fondskontosiden B og hele renteavsnittet i BSU-siden D, inkludert unntaket for renter påløpt fra og med året man fyller 34. Registrert med presis avgrensning i hovedrapporten. Disse to manglende utdragene er ikke lenger åpne. Ingen generell godkjenning, produktretting eller publisering. Øvrige kontrollpunkter står som før.

### ASK og felles svarmal, 28.10.2026

ChatGPT/Codex etter Lars sitt konkrete oppdrag. Main `0c1fb7398825cb3bd2909a6d890fe67e79140497`. SV-031 i egen gren `fix/ask-svarmal`, ingen aktiv reservasjon ved leveranse. [Innhold, kildekontroll, angrepsflater og teststatus](svarutkast/SV-031-SVARMAL-2026-10-28.md). Kildene faktisk lest i denne økten. Felles føringer i SVARMAL.md lenket fra AGENTS, CONTRIBUTING og daglig instruks. ASK beholder nøytralitet og søkeinnganger. Bare ASK prøves i oversiktsmalen. Alle 17 Node-testfiler og generatorens produktkontroll består. Lokal nettleser mangler, CI må bekreftes og bildene vurderes. Annen kontrollør og Lars sin godkjenning gjenstår. Ingen sammenslåing eller publisering. #97 beholdes separat. Ingen fullført K7-runde for resten av nettstedet erklæres.

CI-oppfølging for #98: ASK-testen består i alle tre nettlesere ved 320/390/1280 px, og tre av ni bilder er visuelt vurdert av GPT. Se SV-031-notatet. Samlet nettleserjobb feiler på input-browser.cjs:115, utenfor de endrede ASK-filene. Årsaken er ikke avklart. Ingen grønn totalstatus eller publiseringsklar leveranse erklæres.

### Samlet språk og svarmal, 28.10.2026

ChatGPT/Codex etter Lars sitt oppdrag, main `1082c4f`. Ni egne svar og fire upubliserte utkast. [Omfang, bevarte vilkår, kildeavgrensning og kontroller](sprak-og-svarmal-2026-10-28.md). Gren `fix/sprak-og-svarmal`. Ingen aktiv reservasjon ved leveranse. #99 gjelder samtidig UU-arbeid og er ikke endret eller slått sammen. JSON-fasit og genererte utkast holdes synkronisert. Ingen nye søkeinnganger eller produksjonssvar. Språkdato skilles fra kildekontroll. Ingen uavhengig godkjenning, sammenslåing eller publisering.

CI for #100: kjøring 40730938010 besto hele nettleserpakken, inkludert alle 13 svar i tre nettlesere og tre bredder. 13 mobilbilder og to representative ekstra visninger er visuelt vurdert. Oppfølging av overskrifter og eksempelstil samt rettet git-avhengighet i en test er dokumentert i kontrollnotatet. Siste head må ha egen bekreftet CI-status. Ingen publisering.

### Oppfølging av tekstkontrollen av PR #100

Lars sin videresendte gjennomgang viste gjentakelser og økt lengde. Revidert alle 13 svar, frivillige malfelt, felles eksempelvilkår og konsekvent «egenkontroll». Ordrette setningsdubletter testes, omskrevne gjentakelser er lest gjennom manuelt. Før-tall er fast referanse fra a9d0f6d, med åpen tellemetode. K1s unntak er bevart, og SV-135/SV-050 har egne publiseringssperrer i arbeidsnotatene. Borettslagsandel er bekreftet på Skatteetatens BSU-satsside før språkendringen. Ingen integrasjon av fire utkast, ingen sammenslåing eller publisering.

## 28.10.2026: BSU, uttrykkelig integrasjonsoppdrag fra Lars

ChatGPT/Codex har lagt samtalens godkjente BSU-utkast i q-bsu-basics med Skatteetaten og SSB-kilder. Bygger på PR #100, egen oppfølgings-PR mot den grenen, ingen konkurrerende main-endring. Se svarutkast/BSU-KILDEKONTROLL-2026-10-28.md. Alle lokale Node-testfiler består. Lokal nettleser mangler, og nedlasting feilet; visningskontroll avventer CI. Egen nettleserprøve for BSU ved 320/390/1280 px i tre motorer er lagt i CI. Ingen sammenslåing eller publisering. Faglig presisering av boligeierskap og regelår står åpent før publisering.

### Status etter #96, 28.10.2026

SV-031, SV-122 og SV-034: dokumentasjonskontroll mot main-commit `0c1fb7398825cb3bd2909a6d890fe67e79140497`. Produktnavn og tilbyderkilde er fjernet gjennom #96; eldre status «produktomtalen urørt» er historisk. Intern ID q-ask-zero er bevart. [Konkrete funn og neste kontroll](svarutkast/STATUS-ETTER-PR96-2026-10-28.md). Egenkontroll av dokumentasjon, ingen ny kilde- eller live-kontroll. Øvrige fagfunn står åpne. Ingen reservasjon aktiv, ingen produktendring eller publisering i denne leveransen.

### Samlet og publisert, 28.10.2026 kveld

Claude etter Lars' fullmakt. #100, #101, #102, #99, #103, #97, #91 og #93 er slått sammen. Publisert commit `ddecaba`. Restpunkter, kontroller og det som står igjen: BESLUTNINGER.md, «Dagens arbeid samlet og publisert».

## 29.10.2026: Utdaterte tall i «Mer om tallene», uttrykkelig oppdrag fra Lars

Claude etter Lars sitt oppdrag i samtalen, grunnlag main `e223b74` (inkludert #38). Gren `fix/forklaring-oppdateres`. Faller inn under unntaket for universell utforming og retting av feil i publisert innhold (regulatorisk.md), ingen ny funksjon.

Funn: Skjermbilder fra Safari Reader på iPhone viste 12 456 484 kr som hovedtall, men 240 000 kr innskudd i «Mer om tallene». 240 000, 65 434 og 3 292 kr er eksempelplanens tall. Gjenskapt i Chromium: «Dette betyr tallene dine» ble bare beregnet på nytt ved `change`, ikke mens brukeren skrev. Teksten ble dempet visuelt, men sto igjen i siden til feltet ble forlatt. Lesemodus, skjermlesere og kopiering fikk de gamle tallene som om de var riktige. Den grå «Oppsummering»-boksen i Safari er Safaris egen KI-oppsummering og kommer ikke fra nettsiden. Den oppsummerte den utdaterte teksten.

Endret:
1. Forklaringen beregnes også etter 0,5 sekunders skrivepause, ikke bare ved `change`. Ved ugyldige tall beregnes den ikke, og den forblir markert som utdatert.
2. Resultatradene («Du setter inn», «Vekst etter kostnader», «Effekt av kostnader») er gjort om til en beskrivelsesliste (`dl` med `dt` og `dd`). Uten stilark ble ren tekst «Du setter inn4 580 000 kr». Samme prinsipp som grafforklaringen 28.10.2026: innebygd HTML som gir mening med og uten stil. Først prøvd med skjult kolon, byttet etter å ha lest den beslutningen.
3. Resultatkortet, navigasjonsknappene og «Dette betyr tallene dine» er samlet i én `<article>` med navn fra resultatoverskriften. Grafen ligger utenfor. Ingen CSS eller skript avhenger av den gamle strukturen.

Vurdert og ikke gjort: forslag om å skjule sekundært innhold med `hidden` eller skrive ekstra brødtekst for lesemodus. Utdaterte tall skal ikke finnes i siden i det hele tatt, og «Mer om tallene» skal fortsatt være tilgjengelig.

Kontroller: 18 av 18 bilder av resultatkortet og 18 av 18 helsidebilder er pikselidentiske med main (320, 390 og 1280 px; tre nivåer; lyst og mørkt tema). Ny test `tests/forklaring-oppdateres-browser.cjs` feiler på gammel kode og består på ny. Alle 20 Node-tester og alle 24 nettlesertester i CI-listen består lokalt i Chromium, inkludert a11y og html-struktur. Den nye testen besto 10 av 10 ganger. Firefox og WebKit kunne ikke lastes ned lokalt; den nye testen er lagt i CI for alle tre motorer. Ikke testet på fysisk iPhone eller i Safari Reader etter endringen. Ingen sammenslåing eller publisering.

## SV-122, innlegging 29. oktober 2026

ChatGPT/Codex integrerer godkjent q-fondskonto etter Lars' uttrykkelige publiseringsoppdrag. Base 57a1472. Ingen andre spørsmål eller søkeinnganger endres. Kontrollnotat: research/svarutkast/FONDSKONTO-KILDEKONTROLL-2026-10-29.md. Lokal fag- og Node-kontroll gjennomført; nettleser- og publiseringsstatus følges i PR/Actions.

## Tilbaketrekking av øvrige svar, 29. oktober 2026

Lars bestiller gjennomføring. Base f896cb7. Bare BSU, ASK og fondskonto forblir tilgjengelige. Seks øvrige egne svar og sju hovedtemaer tas ut av produksjonsvisningen. Arkiv med spørsmål, kilder og gjengitt tekst ligger i TILBAKETRUKNE-SVAR-2026-10-29.json under svarutkast. Eldre tester beholdes som eksplisitte utkasttester. Nye tester kontrollerer faktisk produksjonsutvalg, manglende svar og fravær av profiltilpasset reserveveiledning. Ingen endring av kalkulatorberegninger eller de tre godkjente tekstene. Faktisk CI- og publiseringsstatus registreres i PR.

## Sist gjennomgått og 12-månedersvarsel, 29. oktober 2026

Claude, på Lars' bestilling. Base 9a382ad. q-bsu-basics, q-aksjesparekonto og q-fondskonto får `published` og `changed` fra git-historikken på main. `checked` er uendret. Ingen faktapåstander eller kilder er endret, og ingen ny kildekontroll er gjort. Bare «Sist gjennomgått» og eventuelt varsel under overskriften. Alle tre datoene under «Kilder og kontrollgrunnlag», etter Lars' tilbakemelding samme dag. Ny ansvarslinje. Regler for kontrollrunden i SVARMAL.md. Kontroll: Node-tester og Chromium-tester lokalt. Firefox og WebKit kjøres i CI. Visningen ved 320, 390 og 1280 px er kontrollert i Chromium.


## ASK-bosted og årets BSU-innskudd, 29. oktober 2026

ChatGPT/Codex. Base 29344dc343448e2d9ec5d7beadc12b0cbe21bf7a. Lars godkjenner oppfølging av dokumenterte kildefunn under metodeprøven. To avgrensede rettinger i q-aksjesparekonto og q-bsu-basics. Kildene nyåpnet, alle 208 historiske renteverdier kontrollert mot ferskt SSB-uttrekk, årssnitt kontrollregnet med eksisterende generator. ASK-eksemplet kontrollregnet til 17 028 kr. published bevares. changed og checked settes til 29.10.2026 etter gjennomgang. Kontrollform: egenkontroll, ingen ny uavhengig fagkontroll. Detaljer og gjenstående kontroller i research/svarutkast/KONTROLL-EGENSKAPSFUNN-2026-10-29.md. Ingen sammenslåing eller publisering.

## Språkjustering og bekreftet ASK-bosted, 29. oktober 2026

Claude, på Lars' bestilling, i PR #113. Lars har lest innledningen i Skatte-ABC A-10-1 og bekreftet at sktl. § 10-21 gir personlig skattyter bosatt i EØS-området rett til å opprette ASK, og at konto kan videreføres ved senere utflytting ut av EØS. Svarteksten om opprettelse står dermed som foreslått. Tre språkjusteringer i q-bsu-basics, uten ny faktapåstand: klarere setning om delvis boligbruk, «bundne BSU-midler» forklart som tidligere års innskudd og renter (samme innhold som B-19-7.1 og Skatteetatens rettledning for banker), og «årets slutt» brukt konsekvent. Datoer og cacheversjon uendret, siden endringen skjer samme dag og før publisering. Kontroll: Node-tester og Chromium-tester lokalt, CI for Firefox og WebKit.


## Presisering av bundne renter før publisering, 29.10.2026

Lars bestiller retting og publisering. Forklaringen av bundne BSU-midler avgrenses til tidligere års innskudd og renter opptjent til og med året man fyller 33. Renter som påløper fra og med året man fyller 34 kan disponeres fritt. Kilde: Skatte-ABC 2025/2026, B-19-7.1.2, lest av ChatGPT/Codex i samme arbeidsøkt. Eksisterende test oppdateres til den presise avgrensningen. Datoer og cacheversjon beholdes siden dette er samme dags upubliserte revisjon. Lars har godkjent den foreslåtte rettingen og gitt publiseringsfullmakt. Kildekontrollen av denne presiseringen er egenkontroll av ChatGPT/Codex.
