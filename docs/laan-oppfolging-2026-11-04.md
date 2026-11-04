# Lånekalkulator: kildekontroll og videre avgrensning

Lars 4.11.2026: Lånekalkulatoren er et supplement. Startkort og bunntekstlenker fjernes. Fanen og egen URL beholdes, uten pil for ekstern lenke. Rapportens årsplan skal kunne leses ved 320 px uten vannrett rulling. Regnemotorene endres ikke.

## Kilder lest 4.11.2026

- SSB, Renter i banker og kredittforetak, oppdatert 29.10.2026: https://www.ssb.no/bank-og-finansmarked/finansinstitusjoner-og-andre-finansielle-foretak/statistikk/renter-i-banker-og-kredittforetak . Tabell 10748, nye nedbetalingslån med pant i bolig til husholdninger, flytende rente: september 2026 5,29 %. Ikke bland dette med alle nye boliglån (5,30 %) eller utestående lån. Etablerings- og termingebyrer er ikke med. Eksakt API-utvalg og grunnlaget for bruk i nominelt rentefelt må bekreftes før integrasjon. Ingen ny referanserente publiseres i denne PR-en.
- Finanstilsynet, Bank og finans: https://www.finanstilsynet.no/forbrukerinformasjon/bank-og-finans . Avsnittene om effektiv rente og kredittkostnader støtter forklaringen. Andre tall på denne siden er ikke brukt.
- Husbanken, Beregning av renter: https://www.husbanken.no/bransje/veileder-laan/rente-og-avdragsvilkar/beregning-av-renter/ . Omregningen mellom nominell og effektiv rente før gebyr viser at forskjellen ikke bare skyldes gebyrer. Sidens henvisning til eldre forskrift brukes ikke som grunnlag for en ny effektiv-rente-motor.
- Utlånsforskriften FOR-2020-12-09-2648: Lars sin vedlagte Lovdata-PDF lest i sin helhet. PDF-en oppgir sist endret FOR-2024-12-04-2925 fra 31.12.2024. Direkte Lovdata-henting ga 405. PDF-en er ikke alene en bekreftelse på at ingen senere endringer finnes.
- Finansdepartementets gjeldende oversikt: https://www.regjeringen.no/no/tema/okonomi-og-budsjett/finansmarkedene/utlansforskriften2/id3077676/ . Bekrefter hovedreglene om betjeningsevne, gjeldsgrad, belåningsgrad, avdrag og fleksibilitet. Finanstilsynets boliglånsundersøkelse 2026 bekrefter de samme hovedgrensene. Departementets oversikt er mer direkte egnet til regelvedlikehold enn en årlig stortingsmelding.
- Calculator.net: https://www.calculator.net/loan-calculator.html . Bare funksjonsinspirasjon: samlet betalt, samlet rente, nedbetalingsplan og oppdeling i år/måneder. Ingen tekst, design eller amerikanske rettsregler kopieres.

## Neste avgrensede utvidelser

1. Boliglån: referansetall med tydelig måned og lånegruppe, hentet gjennom eksisterende Kildevakt og faktaregister. Ingen tredje innhenter. Billån og forbrukslån får ikke et antatt snitt uten en egnet serie. Norges Banks styringsrentebane må ikke settes inn som boliglånsrente.
2. Sammenligning av to eller tre brukerdefinerte lån med beløp, rente, løpetid og gebyrer. Vis at forskjellig løpetid påvirker både månedsbeløp og samlet kostnad. Ingen rangering eller personlig anbefaling. Vurder gjenbruk av eksisterende plan- og eksportkomponenter og personvern før eventuell ny lagring.
3. Kjøpesum og egenkapital kan beregne lånebehov, med omkostninger som eget felt. Belåningsgrad er ikke det samme som egenkapitalandel når andre lån, fellesgjeld eller tilleggssikkerhet inngår.
4. Utlånsforskriften bør forklares ved de relevante feltene. En illustrasjon av rentebelastning på ett lån er ikke bankens stresstest av samlet gjeld og livsopphold. Unngå «du kan låne» og automatisk godkjent/avvist. Forbrukslånets avdragskrav, fleksibilitetskvoter og refinansieringsunntak gjør en generell hard løpetidssperre misvisende.
5. Effektiv rente beregnes først etter kontroll av gjeldende finansavtaleforskrift og tidskonvensjoner. Forklaringen på siden er ikke en slik beregning.

Dette dokumentet er arbeidsgrunnlag, ikke godkjenning eller bestilling av alle foreslåtte funksjoner samtidig. De konkrete visnings- og navigasjonsrettingene samt renteforklaringen er implementert i denne PR-en. Skjermleser og faktisk 400 % nettleserzoom er ikke manuelt prøvd. CI kontrollerer 320 px rapportflate i tre nettlesermotorer.
