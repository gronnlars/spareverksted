# Kildegjennomgang: status før Claude-kontroll

Oppdatert 28.10.2026 av ChatGPT/Codex etter Lars sitt oppdrag. PR #72 er dokumentasjon til kontroll, ikke godkjent for sammenslåing eller publisering. Claude skal gå gjennom før Lars sjekker. Gjennomgangen er ennå ikke utført av Claude.

## Arbeidsgrunnlag og hva denne PR-en gjør

Fersk main: `11df29417b0e094958cf2958b1b14044258b7c5d`, bekreftet med sammenligning mot main. PR-head før denne revisjonen: `2eb10d812f549b21adb66af6d3b0f6ebd2f7f263`. Alle fem endrede dokumenter er gjennomgått. Ingen filer i dist/, tester, beregninger eller arbeidsflyter endres.

KILDEREGLER.md på lest main har blob `7d1bae6049c569844527ad94092fa2d7017b7343`. AGENTS.md: `b3c4849bf4c671453bd599bf77cdd07f76471c67`. Reglene K1 til K7 gjelder. Regelendringer i åpne PR-er er ikke behandlet som vedtatte. Aktive avvik i BESLUTNINGER.md er lest. #67 står fortsatt som forslag med utløp 31.01.2027, ingen tidsbestemt aktiv dispensasjon funnet med utløp innen to uker.

Hovedrapporten er ryddet slik at eldre, tilbakekalte funn ikke lenger står som aktive avvik. Originalrapporten av Claude og tidligere kontroller er bevart i [git-historikken før denne revisjonen](https://github.com/gronnlars/spareverksted/blob/2eb10d812f549b21adb66af6d3b0f6ebd2f7f263/research/kildegjennomgang-2026-10-25.md). Historikk er ikke en ny faktakontroll.

## Gjeldende kildegrunnlag

Alle kilder i tabellen er faktisk åpnet og relevante fagavsnitt lest i denne arbeidsøkten 28.10.2026. Ingen lavere kilde erstatter en tilgjengelig myndighetskilde om norsk skatt. Myndighetsveiledning skilles fra selv lest lovtekst. Lov og forskrift er ikke gjennomgått i denne revisjonen.

| ID og kilde | Kildedato / regelår | Konkret påstandsdekning og grense |
| --- | --- | --- |
| A: [Skatteetaten, ASK](https://www.skatteetaten.no/person/skatt/hjelp-til-rett-skatt/aksjar-og-verdipapir/om/aksjesparekonto-ask/) | Ingen dato oppgitt på siden. Omtaler 2026. | Gjenværende innskudd, uttak etter skjerming, ubenyttet skjerming i grunnlaget, tillatte verdipapirer og tap ved opphør. Ingen ny sats legges til. |
| B: [Skatteetaten, Fondskonto](https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/aksjer-og-verdipapirer/om/skatteregler-investere-i-aksjer-og-andre-verdipapirer-gjennom-kapitalforsikring-fondskonto) | Ingen dato oppgitt på siden. Satsavsnittet viser 2023 til 2025. | Forsikringselement, garantiavgrensning, eierskap og uttak. Eldre satser brukes ikke som 2026-satser. Konkret avsnitt om ubenyttet skjerming må leses sammen med det kortere skatteavsnittet. |
| C: [Skatteetaten, rettledning Fondskonto](https://www.skatteetaten.no/nn/bedrift-og-organisasjon/rapportering-og-bransjar/tredjepartsopplysninger/bank-finans-og-forsikring/fondskonto/rettledning/) | Ingen revisjonsdato oppgitt på siden. Oppgir inntektsåret 2026 og senere, til ny rettledning foreligger. | Avgrensning til lite forsikringselement og uten garantert avkastning, forholdsmessige uttak og bruk av ubenyttet skjerming mot gevinsten. Gjelder rapportering; ikke dokumentasjon på en bestemt tilbyders vilkår. |
| D: [Skatteetaten, BSU](https://www.skatteetaten.no/nn/person/skatt/hjelp-til-rett-skatt/bank-og-lan/bsu--bustadsparing-for-ungdom/) | Ingen dato oppgitt på siden. Regelår sikres med E og F. | Alder, boligformål, renter utenfor innskuddsgrensene, fradrag og vilkårsbrudd. Oppussing må skilles fra løse gjenstander. |
| E: [Skatteetaten, BSU-satser](https://www.skatteetaten.no/satser/fradrag-for-boligsparing-for-ungdom-bsu/?year=2026) | Ingen dato oppgitt på siden. Årsvelgerens verdi vises ikke i tekstuttrekket. | Beløp og eierskap per 31. desember. 2026 i URL er ikke alene bevis på regelåret; F bekrefter dette. |
| F: [Skatteetaten, Forskuddsutskrivingen 2026](https://www.skatteetaten.no/rettskilder/type/uttalelser/uttalelser/forskuddsutskrivingen-2026/) | Avgitt 15.12.2025, inntektsår 2026. | Relevante BSU-avsnitt lest: satser og boligavgrensning. Ingen full gjennomgang av meldingen. |
| G: [Skatteetaten, individuell sparing til pensjon](https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/arbeid-trygd-og-pensjon/pensjon-og-uforetrygd/ny-ordning-for-skattefavorisert-individuell-sparing-til-pensjon/) | Ingen dato oppgitt på siden. Skiller uttrykkelig 2025 og 2026. | Ny ordning, innbetaling, kostnader, binding, ordinært uttak og uføreunntak. Gammel ordning holdes atskilt. |
| H: [Finansdepartementet, Skattesatser 2027](https://www.regjeringen.no/no/tema/okonomi-og-budsjett/skatter-og-avgifter/skatte-og-avgiftssatser/skattesatser-2027/id3173438/) | 07.10.2026. Vedtatt 2026 mot foreslått 2027. | BSU- og IPS-radene er lest. Like beløp i kolonnene gjør ikke 2027-forslaget vedtatt. Ikke full kontroll av budsjettendringene. |
| I: [Forbrukerrådet, Sparing i fond og spareprofiler](https://www.forbrukerradet.no/sparing-i-fond-og-spareprofiler/) | Ingen dato oppgitt på siden. Nivå 2. | Rådets anbefalte minstehorisont på fem år for aksjefond. Ingen lovregel, garanti eller dokumentasjon av IPS-egnethet. |
| J: [Skatte-ABC, P-4-5.1](https://www.skatteetaten.no/rettskilder/type/handboker/skatte-abc/gjeldende/p-4-pensjon--individuell-sparing-til-pensjon/P-4.005/P-4.006/) | Utgaven viser 2025/2026 og en egen 2026-merknad. | Støtter at innbetalingen gir fradrag i alminnelig inntekt. Ny merknad og eldre løpende tekst har ulike beløp, dokumentert i BSU/IPS-notatet. Ikke brukt alene for 2026-grensen. |
| K: [OpenStax/Rice University, Algebra and Trigonometry 2e, 6.1](https://openstax.org/books/algebra-and-trigonometry-2e/pages/6-1-exponential-functions) | Bokens publiseringsdato 21.12.2021. Kapittelrevisjonsdato ikke oppgitt. På engelsk. | Universitetets egen åpne lærebok, særkategorien for regnemetoder i K2. Renters rente-formel, ikke norsk skatt, regler eller forventet avkastning. |

Den eksisterende /en/-adressen til C er nyåpnet og viser norsk fagtekst med beskjed om at engelsk ikke er tilgjengelig. Påstanden om språkbrudd bare ut fra URL-en er tilbakekalt. Norsk navigasjonsadresse er dokumentert i C.

Nivå 3, 4 og 5 krever kildedato. En udatert kommersiell produktside blir ikke godkjent ved å skrive «udatert». Nordnet er nivå 4, ikke 3. Produktomtalen står urørt etter egen sperre og er ikke godkjent ved denne revisjonen. DNB- og øvrige produktpåstander fra eldre rapport er fortsatt åpne kontrolloppgaver, ikke aktive godkjenninger.

## Aktive funn og konkret status

| Funn | Kilde / sted | Status og reparasjon |
| --- | --- | --- |
| Manglende garantiavgrensning i fondskontosvaret | B/C, q-fondskonto | Åpent produktfunn. Avgrens skatteforklaringen før den omtales som dekkende for alle kapitalforsikringer. |
| Foreldet omtale av rettledningsversjon | C, q-fondskonto caveat | Åpent produktfunn. Bruk faktisk regelår og lesedato, ikke udokumentert revisjon i oktober 2025. |
| ASK-kortsvaret utelater skjerming | A, q-aksjesparekonto intro | Konkret forslag i delnotatet. Samme nødvendige forbehold må finnes i kort og langt svar. |
| Ubenyttet skjerming mangler i ASK-grunnlaget | A, skjermingsavsnitt | Konkret presisering i delnotatet. |
| Bruk av skjerming er for snevert forklart for fondskonto | B/C, avsnitt om uttak | Nytt funn: utførlige avsnitt om ubenyttet skjerming omtaler også rentedelen. Korte avsnitt omtaler bare aksjedelen. Begge er synliggjort, og Claude skal kontrollere presiseringen. |
| BSU-oppussing gir direkte treff uten konkret forklaring | D, q-bsu-basics | Dokumentert i tidligere lokal søkeprøve. Forslag til avgrenset faktatillegg står i delnotatet. Søket er ikke endret. |
| IPS-effekt på sparevaner mangler støtte | G, q-ips-ask | Ikke godkjent av skatteveiledningen. Ta ut effekten i et senere nøytralt svar eller dokumenter påstanden etter kildereglene. |
| Metadata og individuelle vedlikeholdsfrister | Fire kontrollerte svar | Åpent i produktet. Lesedato i rapporten endrer ikke lagret kontrolldato eller publiseringsdato. |
| Arvede råd og profiltilpasning | engine/cards, BSU/IPS | Tidligere lokal atferdskontroll er dokumentert. Ingen juridisk konklusjon eller godkjenning av handlingsråd. |
| Formelkilde mangler i q-renters-rente | K | Egnet universitetskilde er lest og regnemetoden egenkontrollert. Kilden er ikke lagt til i produktet. Full kontroll av resten av svaret gjenstår. |

Detaljnotater: [ASK/fondskonto](svarutkast/KONTROLL-ASK-FONDSKONTO-2026-10-28.md) og [BSU/IPS](svarutkast/KONTROLL-BSU-IPS-2026-10-28.md). Nye innledninger skiller denne revisjonen fra historiske live- og kodeprøver.

## Regnegrunnlag og utførte kontroller

Ny egenkontroll i Node: 150 000 minus 100 000 = 50 000 kr; et uttak på 30 000 kr gir 20 000 kr innskudd og 10 000 kr gevinst før skjerming i eksemplet; 27 500 × 10 / 100 = 2 750 kr. Ingen faktisk skatt er beregnet. Uendrede eksempelvilkår og begrensninger står i delnotatene.

K viser A=P(1+r/n)^(nt). Ved årlig rentetillegg, konstant rente og ingen innskudd/uttak er n=1. Da gir 10 000 × 1,05^2 = 11 025 kr. Egen prisfaktor ved ti årlige økninger på 2,5 prosent: 1,025^10 = 1,28008454. Omregning tilbake til startens prisnivå gir 100 000 / 1,025^10 = 78 119,84 kr. Prisfaktoren brukes matematisk, uten prognose eller løfte. Skatt og kostnader er utelatt. Dette er ikke en ny full kildekontroll av SSB, skatt eller hele kjøpekraftsvaret.

Historisk: åtte ASK/fondskonto-søk, åtte BSU/IPS-søk og 14 systematiske profilkort. Disse er ikke kjørt på nytt i denne dokumentrevisjonen. Ingen nettleser-, mobil-, skjermleser- eller brukertest. Ingen full regresjonskontroll eller ny live-attest.

## Selvstendig oppdrag til Claude

Arbeid i gronnlars/spareverksted, PR #72, grenen docs/kildegjennomgang. Hent fersk main, PR-head og gjeldende AGENTS.md, KILDEREGLER.md, SPRAKREGLER.md og regulatorisk pause før kontroll. Lars har bestilt kildeoppdatering og at du kontrollerer før hans sjekk. Du har fullmakt til å kontrollere og rette dokumentasjonen i denne PR-en. Ingen fullmakt til sammenslåing, auto-merge, publisering, produktendringer eller oppheving av sperrer. Nordnet-omtalen står urørt.

1. Åpne kildene A til K selv, og les de konkrete fagavsnittene. Oppgi faktisk lesedato, kildeversjon og hva hver kontroll dekker. Skill kontroll av ChatGPTs tekst fra egne tidligere Claude-bidrag. Ikke kall kontrollen menneskelig eller juridisk.
2. Kontroller ASK-kortforslaget og skjermingsgrunnlaget. Forventning: gjenværende innskudd og eventuell skjerming skilles, og ubenyttet skjerming inngår i grunnlaget.
3. Kontroller fondskontoens garantiavgrensning og bruk av ubenyttet skjerming. Les både de korte skatteavsnittene og de utførlige uttaksavsnittene. Ved fortsatt uklarhet: merk konklusjonen åpen, ikke velg stille. Ikke bruk satsavsnitt merket 2025 som dokumentasjon for 2026.
4. Kontroller BSU 2026 mot D/E/F og IPS mot G/H/J. Forventning: 2027 er forslag, BSU-fradrag i skatt skilles fra IPS-fradrag i alminnelig inntekt, og gammel IPS holdes atskilt. Kildens gamle og nye beløp i J skal registreres åpent.
5. Kontroller eksemplene uavhengig: 2 750 kr, 20 000/10 000 kr og 11 025 kr med de oppgitte forutsetningene. Et korrekt regnestykke godkjenner ikke alle regler eller et kontovalg.
6. Kontroller at rapportens statuser stemmer med kø og logg. Produktfeil skal være åpne inntil faktisk retting, test og godkjenning finnes. «Dokumentert» betyr ikke «rettet på nettsiden».
7. Lever funn med alvor, fil/avsnitt, konkret reparasjon og hvilke kildepunkter du selv har kontrollert. Oppdater PR-en slik at Lars kan sjekke et konkret resultat. Ingen melding eller oppdrag er sendt til Claude automatisk.

Kjente søketilfeller ved en senere produktkontroll: «hva er en garantert kapitalforsikring» må ikke presentere uavgrensede skatteregler; «kan jeg bruke BSU på oppussing» trenger et konkret svar; «hva skjer med BSU hvis jeg flytter» er fortsatt kjent hull; «flytte strømavtale» skal ikke gi BSU. Dette er kontrollkrav, ikke nye kjøringsresultater.

## Klarhetsstatus etter K1 til K7

K1/K3: de nye konklusjonene over har konkrete kilder og datoer; eldre uverifiserte påstander er ikke godkjent. K2: norske myndighetskilder brukes til norske regler, nivå 2 bare til rådets egen anbefaling, universitet bare til matematikk. K4: 2027-forslag er skilt fra 2026-regler. K5: ingen egne personlige råd godkjennes. K6: absolutte datoer og regelår brukes. K7: kontroll av en annen enn skribenten gjenstår, og hele nettstedets kontrollrunde er ikke fullført.

PR-en er klar for Claudes gjennomgang, ikke for sammenslåing eller publisering. Neste kildekontroll før eventuell produktretting og senest før 01.01.2027, inkludert budsjettvedtak. K7-runden omfatter også øvrige svar og tidsavhengige kilder utenfor disse fire svarene og er fortsatt åpen.
