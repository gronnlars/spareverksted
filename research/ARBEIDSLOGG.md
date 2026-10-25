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

## Aktiv dagsreservasjon

SV-001: ChatGPT/Codex, 25.10.2026, gren feat/buffer-2026-10-25. Start 08:45 Europe/Oslo, utløp 12:45. Gjenbruk og konkretisering av eksisterende buffersvar.
