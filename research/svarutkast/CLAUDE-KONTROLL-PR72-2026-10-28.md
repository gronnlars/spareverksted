# Claudes kontroll av PR #72, 28. oktober 2026

KI-kontroll utført av Claude (Anthropic) på oppdrag fra Lars. Ikke menneskelig, juridisk eller faglig uavhengig kontroll i vanlig forstand. Claude har ikke skrevet revisjonen som kontrolleres. Tidligere Claude-bidrag i PR-ens historikk (originalrapporten 25.10.2026) er ikke kontrollert på nytt her.

## Grunnlag

- Main: `11df29417b0e094958cf2958b1b14044258b7c5d`. PR-head: `d6f05c8`.
- Lest på main: AGENTS.md, docs/regulatorisk.md, KILDEREGLER.md, SPRAKREGLER.md og relevante deler av BESLUTNINGER.md (Aktive avvik, kildereglene, premiss og oppfattet anbefaling).
- Blob-SHA-ene i rapportene stemmer med main: KILDEREGLER.md `7d1bae6`, AGENTS.md `b3c4849`, veileder-knowledge.js `baa4205`, veileder-facts.js `e4121dc`, veileder-engine.js `f4fbc87`, veileder-cards.js `1ddfb08`.
- Produktteksten i `dist/veileder-knowledge.js` er lest for q-aksjesparekonto (linje 117 til 133), q-fondskonto (134 til 151), q-bsu-basics (152 til 156) og q-ips-ask (157 til 161). Linjehenvisningene i delnotatene stemmer.
- Ingen endring i `dist/`, tester, kode eller GPTs filer. Ingen sammenslåing.

## 1. Kildene: lest av Claude 28.10.2026

Kontrolldato for alle: 28.10.2026. Lest med nettleserverktøy som henter og oppsummerer siden. Sitater er kontrollert der det står «ordrett».

| ID | Status | Kildedato | Nivå | Hva Claude fant |
| --- | --- | --- | --- | --- |
| A ASK | Lest | Ingen dato oppgitt på siden. Nevner satser for 2025 og 2026. | 1 | Skjermingsgrunnlaget er laveste innskuddssaldo i året **tillagt ubenyttet skjerming fra tidligere år**. Uttak utover kostpris skattlegges etter fradrag for eventuelt skjermingsfradrag. Tap først ved opphør. Verdipapirkrav og 80 %. Kan ikke eies i sameie. Støtter funn 3 og 4 i ASK-notatet. |
| B Fondskonto, personside | **Ikke lest** | | | Adressen var ikke tilgjengelig for Claudes verktøy og ble ikke funnet i søk. Påstanden om avsnittet «Bruk av ubenyttet skjermingsfradrag ved uttak» er derfor ikke kontrollert av Claude. |
| C Rettledning fondskonto (/nn/) | Lest | Ingen revisjonsdato. Gjelder inntektsåret 2026 og senere. | 1 | Lite forsikringselement (under 50 % / under 100 %) og **bare uten garantert avkastning**. «Særlig om uttak»: ubenyttet skjerming brukes på hele gevinsten, **først mot aksjedelen, deretter mot rentedelen**. Fagteksten er bokmål, adressen er nynorsk. Støtter funn 1, 2 og skjermingsfunnet, med presisering under (A1). |
| D BSU, personside | **Ikke lest** | | | Ikke tilgjengelig. Påstandene om oppussing, møbler og hvitevarer, renter utenfor grensen og aldersgrensen 33 år er ikke kontrollert av Claude. |
| E BSU-satser 2026 | Lest | Ingen dato oppgitt. Årsvalget vises ikke i uttrekket. | 1 | 10 %, 27 500 kr, 300 000 kr. Ikke fradrag ved hel eller delvis eie av primær- eller sekundærbolig per 31.12, både direkte og indirekte. **Aldersgrense og fritidseiendom nevnes ikke.** |
| F Forskuddsutskrivingen 2026 | Lest (via /en/-adresse med norsk fagtekst) | Avgitt 15.12.2025 | 1 | Bekrefter 10 %, 27 500 og 300 000 kr for 2026, og at eier av fritidseiendom fortsatt kan kreve fradrag. **Aldersgrense nevnes ikke.** |
| G IPS | Lest, men annen adresse | Ingen dato oppgitt | 1 | Lest på `/nn/person/skatt/hjelp-til-rett-skatt/arbeid-trygd-og-pensjon/pensjon-og-uforetrygd/ordning-om-skattefavorisert-individuell-sparing-til-pensjon/` (kanonisk adresse). PR-ens adresse (`.../ny-ordning-for-...`) er ikke åpnet. Siden sier **15 000 kr for 2025 og 25 000 kr for 2026**, inkludert kostnader og forsikring. Ny ordning fra 1.11.2017, gammel stengt samme dato. 62 år, til minst 80, minst 10 år, unntak ved uføretrygd. Fritatt formuesskatt og løpende avkastningsskatt. Siden sier ikke uttrykkelig at fradraget gis i alminnelig inntekt. |
| H Skattesatser 2027 | **Ikke lest** | | | Regjeringen.no returnerte feil to ganger. 2026/2027-radene er ikke kontrollert av Claude. |
| I Forbrukerrådet | Lest | Ingen dato synlig på siden. Metadata: sist endret 16.10.2026. | 2 | «Minimum anbefalt sparehorisont 5 år» står under aksjefond og indeksfond, på rådets egen side. Siden sier ikke ordrett «Forbrukerrådet anbefaler». IPS nevnes ikke. Bruken i PR-en er riktig avgrenset. |
| J Skatte-ABC P-4-5.1 | **Ikke lest** | | | Utgaven 2025/2026 bekreftet via kapittelforsiden, men selve P-4-5.1 ble ikke nådd. |
| K OpenStax / Rice | Lest (siden «6 Key Equations», ikke 6.1) | Boken 21.12.2021 | Ved siden av nivåene | A(t) = P(1 + r/n)^(nt). OpenStax er en del av Rice University (© Rice University). Domenet er openstax.org, ikke rice.edu. |

## 2. Regneeksemplene, regnet uavhengig i Python

| Eksempel | Resultat | Status |
| --- | --- | --- |
| 150 000 − 100 000 | 50 000 kr | Stemmer |
| 30 000 × 100 000 / 150 000 | 20 000 kr innskudd, 10 000 kr gevinst | Stemmer, med forutsetningene i notatet |
| 27 500 × 10 % | 2 750 kr | Stemmer |
| 10 000 × 1,05² | 11 025 kr | Stemmer |
| 1,025¹⁰ | 1,28008454 | Stemmer |
| 100 000 / 1,025¹⁰ | 78 119,84 kr | Stemmer |

Et riktig regnestykke godkjenner ikke regelen eller et kontovalg.

## 3. Avvik med fil, linje og forslag

Alvor: **V** = viktig (må rettes før Lars godkjenner), **M** = mindre (bør rettes), **S** = spørsmål til Lars.

### A1 (V) Skjermingsforslaget for fondskonto mangler rekkefølgen

`research/svarutkast/KONTROLL-ASK-FONDSKONTO-2026-10-28.md`, linje 11. Forslaget «Ubenyttet skjermingsfradrag reduserer gevinsten ved uttak og kan også redusere rentedelen» er riktig, men utelater at kilden C sier at aksjedelen reduseres først, og rentedelen bare med det som overstiger.

Forslag: «Ubenyttet skjermingsfradrag trekkes fra gevinsten ved uttak. Det reduserer først aksjedelen. Er det skjerming igjen, reduseres rentedelen.» Kilde: C, «Særlig om uttak fra fondskonto». Samme presisering i hovedrapporten, linje 43.

### A2 (V) Skatte-ABC beskrives som versjonsuklar, men kilde G viser at beløpene gjelder ulike år

`KONTROLL-BSU-IPS-2026-10-28.md`, linje 11, og `kildegjennomgang-2026-10-25.md`, linje 28. Notatet kaller 15 000 kr i løpende tekst og 25 000 kr i 2026-merknaden en «versjonsuklarhet i kilden». Kilde G sier at grensen var 15 000 kr for 2025 og er 25 000 kr for 2026. Skatte-ABC-utgaven gjelder 2025/2026. Begge beløp kan derfor være riktige for hvert sitt år. Claude har ikke lest J og kan ikke bekrefte ordlyden.

Forslag: «Skatte-ABC 2025/2026 oppgir 15 000 kr i løpende tekst og 25 000 kr i en egen 2026-merknad. Skatteetatens IPS-side (G) oppgir 15 000 kr for 2025 og 25 000 kr for 2026, så beløpene ser ut til å gjelde hvert sitt år. Ikke kontrollert mot J av en annen enn skribenten.»

### A3 (V) Aldersgrensen 33 år hviler bare på en kilde Claude ikke har lest

`KONTROLL-BSU-IPS-2026-10-28.md`, linje 49, og hovedrapporten, linje 22 til 24. «33 år ... samsvarer med kildene for 2026». Hverken E eller F nevner aldersgrense. Den hviler derfor bare på D, som er udatert og ikke lest av Claude. Det samme gjelder at renter ikke teller med i grensene (linje 49) og oppussingsteksten (linje 51).

Forslag: Skriv hvilken kilde som støtter aldersgrensen og renteregelen (D, eller skatteloven § 16-10 og BSU-forskriften lest på Lovdata). Merk dem «kontrollert av skribenten, ikke av Claude» til en annen har lest D.

### A4 (V) Kildetabellen sier at alle kilder er lest, men H og deler av J er uklare

Hovedrapporten, linje 15: «Alle kilder i tabellen er faktisk åpnet og relevante fagavsnitt lest». BSU-notatet, linje 43, sier samtidig at Skatte-ABC-underkapitlene ikke er kontrollert, mens linje 11 sier at P-4-5.1 er lest. De to setningene motsier hverandre, fordi linje 43 står under overskriften «Kilder faktisk lest 28.10.2026» selv om den stammer fra første delkontroll.

Forslag: Flytt linje 43 under «Grunnlag og avgrensning i første delkontroll», eller skriv «I første delkontroll ble bare landingssiden åpnet. I revisjonen er P-4-5.1 lest.»

### A5 (V) Kildetabellen mangler nivå og kontrolldato per kilde

Hovedrapporten, linje 17 til 29. K1 og K3 krever kildedato og kontrolldato per kilde, og sjekklisten i KILDEREGLER punkt 2 krever nivå. Tabellen har bare «Kildedato / regelår». Kontrolldatoen står bare samlet i linje 15, og nivå står bare for I og K.

Forslag: Legg til kolonnene «Nivå» (A til H og J: 1, I: 2, K: ved siden av nivåene) og «Kontrolldato» (28.10.2026, med «ikke lest av Claude» for B, D, H og J).

### A6 (V) Rettelsesforslag 2 for fondskonto kan treffe Nordnet-setningen

`KONTROLL-ASK-FONDSKONTO-2026-10-28.md`, linje 55. Forbeholdet i `dist/veileder-knowledge.js`, linje 145 (caveat), inneholder både rettledningsversjonen og setningen om at Nordnet-siden ikke oppgir dato. En omskriving av hele forbeholdet kan endre Nordnet-omtalen, som skal stå urørt (docs/regulatorisk.md, «Konkret eksempel som skal stå urørt»).

Forslag: Tilføy i funn 2: «Bare setningen om rettledningen erstattes. Setningen om Nordnet-siden og resten av forbeholdet står ordrett.»

### A7 (M) Køen viser eldre main enn rapporten

`SPORSMALSKO.md`, linje 27 (SV-031): «Delkontroll 28.10.2026 mot main 00d8f15». Hovedrapporten, delnotatene og linje 239 i samme fil sier 11df294.

Forslag: «Delkontroll 28.10.2026, revidert mot main 11df294.»

### A8 (M) Ulike statusord for samme situasjon

`SPORSMALSKO.md`, linje 27 og 58: SV-031 og SV-122 har «Avventer». SV-133, SV-087 og SV-090 har «Delkontroll, åpne funn». Alle fem har åpne produktfunn i hovedrapporten.

Forslag: «Delkontroll, åpne funn» også for SV-031 og SV-122.

### A9 (M) «Publisert svarfil kontrollert» kan leses som godkjent innhold

`SPORSMALSKO.md`, linje 58 (SV-122), kolonnen «Foreløpig dekning». Kontrollen gjaldt at filen på nettstedet er byteidentisk med main, ikke at innholdet er godkjent.

Forslag: «Eget svar q-fondskonto. Publisert fil er lik main (bytekontroll), innholdet har åpne funn.»

### A10 (M) Dokumenterte hull er ikke koblet til sine kø-ID-er

`SPORSMALSKO.md`, linje 48, 49 og 51 (SV-004, SV-005, SV-134). BSU-notatet dokumenterer oppussingshullet (SV-005), aldersgrensen (SV-004) og boligeierskap (SV-134), men radene står fortsatt som «Ikke kontrollert» eller «Ikke opprettet».

Forslag: Legg lenke til BSU-notatet i kolonnen «Utkast og kontroll» for de tre radene, uten å endre arbeidsstatus.

### A11 (M) Henvisning til en fil som bare finnes hos ChatGPT

`KONTROLL-ASK-FONDSKONTO-2026-10-28.md`, linje 99, og `research/ARBEIDSLOGG.md`, linje 82: «Library, fil libfile_5a427db...» og «privat samling av ni begrepsutkast». AGENTS.md sier at ingen skal anta at en samtale eller usammenslått gren er kjent for neste bidragsyter. Ingen andre kan åpne filen.

Forslag: Enten legg utkastene i repoet som egen PR, eller skriv «Ni begrepsutkast finnes utenfor repoet hos ChatGPT og er ikke tilgjengelige for andre bidragsytere.»

### A12 (M) Formelkilden dekker vekst, ikke omregning til dagens kroner

Hovedrapporten, linje 56. K støtter A = P(1 + r/n)^(nt). Omregningen 100 000 / 1,025¹⁰ er den samme formelen løst for P, men K omtaler ikke prisvekst eller kjøpekraft.

Forslag: «Omregningen til startens prisnivå er formelen i K løst for P. K omtaler ikke prisvekst.» Ved senere bruk i et kjøpekraftsvar trengs SSBs definisjon av konsumprisindeksen som nivå 1-kilde.

### A13 (M) Forbrukerrådets side har metadata-dato

Hovedrapporten, linje 27, og BSU-notatet, linje 41: «Ingen dato oppgitt på siden». Riktig for synlig tekst. Metadata oppgir sist endret 16.10.2026.

Forslag: «Ingen dato oppgitt på siden. Metadata: sist endret 16.10.2026.» Samme form som i docs/regulatorisk.md for Finanstilsynets artikkel.

### A14 (S) Nordnet-kilden bryter K3, men står urørt etter vedtak

Hovedrapporten, linje 33, sier riktig at Nordnet er nivå 4, og at nivå 4 krever kildedato (K3). Produktet oppgir at Nordnet-siden ikke har dato. Omtalen står urørt etter Lars' beslutning i docs/regulatorisk.md. KILDEREGLER, «Når en regel må brytes», krever at et regelbrudd føres som avvik i BESLUTNINGER.md med utløpsdato.

Spørsmål til Lars: Skal dette føres som en rad i «Aktive avvik» med utløp «når Finanstilsynet har svart»? Claude endrer ikke noe her.

### A15 (S) Kildeadressen for IPS

Hovedrapporten, linje 25, og BSU-notatet, linje 39, bruker `.../hjelp-til-riktig-skatt/.../ny-ordning-for-skattefavorisert-individuell-sparing-til-pensjon/`. Claude fant og leste `.../nn/person/skatt/hjelp-til-rett-skatt/.../ordning-om-skattefavorisert-individuell-sparing-til-pensjon/`, som siden selv oppgir som kanonisk. Vet ikke om PR-ens adresse virker eller viderekobles. Bør kontrolleres før adressen brukes i produktet.

## 4. Produktanbefaling og tilpasning

Gjennomgått alle rettelsesforslag i begge delnotater og hovedrapporten:

- Ingen forslag nevner produkter eller tilbydere, anbefaler handling eller tilpasser svar etter brukeropplysninger.
- Forslagene om å ta ut «binding kan hjelpe sparevanene» (BSU-notatet linje 54) og å avgrense skattereglene til kapitalforsikring uten garantert avkastning gjør svarene mer nøytrale.
- Notatene registrerer eksisterende tilpasning (profilmerknader, «Vurder disse pengene separat», handlingskort ved dyr gjeld) uten å foreslå å utvide den. Riktig etter sperren i docs/regulatorisk.md.
- Nordnet og Investeringskonto Zero er ikke omskrevet. Eneste risiko er A6.

## 5. Statuser i kø og logg mot rapportene

Bortsett fra A7 til A11 stemmer statusene. Produktfunnene står som åpne overalt. Ingenting er merket rettet, godkjent eller publisert. ARBEIDSLOGG skiller riktig mellom egenkontroll og uavhengig kontroll, og mellom historiske og nye kjøringer.

## 6. Konklusjon

PR-en er ikke klar for godkjenning før A1 til A6 er rettet. Ingen funn tyder på regnefeil eller produktanbefalinger. Kildene B, D, H og J er ikke lest av Claude, så K7-kravet om kontroll av en annen enn skribenten er ikke oppfylt for påstandene som bare hviler på dem: aldersgrensen 33 år, renter utenfor BSU-grensen, oppussing, 2027-forslaget og fradragstypen for IPS.

Ikke utført: nettleser-, mobil-, skjermleser- og brukertest, søkeprøver, kjøring av kortbyggeren og live-kontroll. Lovtekst er ikke lest.
