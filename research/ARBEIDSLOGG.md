# Arbeidslogg for spørsmålkøen

Felles overlevering for ChatGPT/Codex og Claude. Tid oppgis i Europe/Oslo.

## Aktive reservasjoner

| ID-er | Aktør | Start | Utløp | Gren/PR |
| --- | --- | --- | --- | --- |

| SV-133, SV-087, SV-090 (eksisterende BSU/IPS-svar) | ChatGPT/Codex | 28.10.2026 kl. 13.20 | 28.10.2026 kl. 17.20 | docs/kildegjennomgang / #72 |

Tidspunktet er en planlagt reservasjonsramme; faktisk start registreres i leveransen.

Ingen andre aktive reservasjoner fra denne økten. SV-035 og SV-017 avsluttet ved leveranse i PR #64.

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

Køen oppdatert for disse to ID-ene. Ingen ny permanent kø, nye temaer eller produktendringer. Eksisterende privat samling av ni begrepsutkast funnet og lest som arbeidsgrunnlag, ikke nygodkjent eller overskrevet. Samlet fagkontroll av den gjenstår. Aktive avvik gjennomgått. Full K7-runde etter statsbudsjettet er ikke dokumentert i de leste loggene. Ingen utløp innen to uker funnet blant datofestede aktive avvik.

Neste del: q-bsu-basics og q-ips-ask med 2026-regler og eksisterende tilpasning. Hele gjennomgangen er ikke ferdig. Kontroll av en annen enn skribenten, faktisk visning, tilgjengelighet og brukerforståelse gjenstår. Ingen program- eller nettlesertestfiler endret. Kun dokumentasjon på kontrollgrenen, ingen sammenslåing til main eller publisering.
