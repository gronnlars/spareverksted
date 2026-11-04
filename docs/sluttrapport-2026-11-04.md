# Sluttrapport for arbeidsøkten 3. november og natt til 4. november 2026

Gjennomgått første foreldresti på main fra 3. november til og med 688a1a3. Kontrollgrunnlag: AGENTS.md, CONTRIBUTING.md, BESLUTNINGER.md, KILDEREGLER.md, SPRAKREGLER.md, docs/regulatorisk.md og docs/personvern-lagring.md. Omfanget er endringer i main og den berørte brukerreisen.

| Område | Hva kom inn | Hva kan etterprøves |
|---|---|---|
| Data og svar | Kildevakt og Tidsmaskin fikk egne innhentingsløp (#171, #172, #178, #179). Svargrunnmuren fikk skjema og kildekoblinger (#197). | Vellykket innhenting og generering sier noe om teknisk drift. Faglig godkjenning må spores for hvert svar. |
| Sparing og rapporter | Navngitte planer, separate kalkulatortyper, sammenligningsrapport og eksport av valgte planer (#173, #182, #183, #188 til #190, #192). | Rapporten kan inneholde alle valgte planer, med inntil tre i sammenligningen. Dette er mønsteret for lån. |
| Tilgjengelighet | Informasjonssider, navigasjon og rapportstruktur ble bearbeidet (#184, #191, #195, #198, #199, #202, #203). #206 rettet resultatlinjen og delte nettlesertestene i egne trinn. | Chromium-testen kontrollerer struktur i PDF. Faktisk opplesning og fysisk zoom trenger egne prøver. |
| Lån | Motor (#204), side (#205), rapport og eksport (#207), lånetilpassede felt, scenarioer og dagens kroner (#208). | [Publisering av #208](https://github.com/gronnlars/spareverksted/actions/runs/41760420270) besto. Lånemotoren ble kontrollert mot 105 Python-planer, prisjusteringen mot 24 Decimal-planer. |
| Drift | En tematest med fast ventetid stoppet produksjonsløpet. 0703afa venter på fullført temabytte. | [Grafikkpubliseringen](https://github.com/gronnlars/spareverksted/actions/runs/41758935012) besto før låneversjonen ble publisert. |

## Hva iPhone-prøven avdekket

Bildet viser overskriften «Nominell og effektiv rente» med fokusramme. Koden brukte et fragment til overskriften og tegnet på nytt ved hver vindusendring. Hvor mye hvert forhold bidro til den opplevde tvangsrullingen på fysisk Safari er uavklart. Ny flyt har én bevisst fokusflytting hver vei. Den tidligere gule pilen på PC kan ikke identifiseres fra bildet. Kildelenkene i avsnittet går til andre nettsteder.

Egenkapital hadde bare skrivefelt. Ny skyveknapp oppdaterer samme felt. For lån manglet det også en arbeidsflyt mellom enkeltberegning og samlet rapport. Forslaget gjenbruker betalingsmotoren, rapportgeneratoren, den felles utskriftskontrolleren og Excel-verktøyet. Den nye lagringsnøkkelen er med i personvernoversikten, tellingen og slettingen.

## Plan for torsdag 5. november

1. Prøv rentelenken på fysisk iPhone Safari. Åpne forklaringen, rull forbi, skjul og vis adresselinjen, og gå tilbake via returlenken. Forvent fri rulling og fokus ved rentefeltet. Gjenta med VoiceOver og sjekk hvilken kontroll som leses opp.
2. På PC: prøv samme flyt med tastatur og faktisk 400 % zoom. Identifiser den gule pilen ut fra plassering og lenkemål. Kontroller at interne lenker og eksterne kilder kan skilles.
3. Lag to navngitte billån med ulik egenkapital. Kontroller at skyveknapp og skrivefelt gir samme beløp, og at planene finnes etter omlasting. Les sammenligningen, åpne PDF og Excel, og sammenhold sum, gebyrer, nedbetalingstid og kronevisning med enkeltplanene.
4. Slett én plan, deretter alle via personvernsiden. Prøv blokkert lagring og to faner. Loggfør enhet, nettleser, kildeversjon og observerte avvik før neste utvidelse.
5. Hold effektiv rente og Finansportal-integrasjon som egne oppgaver med henholdsvis metodekontroll og avklart avtale.

## Tre kontrollpunkter før endelig godkjenning

- En grønn motortest kan skjule et navigasjonsproblem. Bruk iPhone-prøven over.
- Ulik prisvekst kan gi en misvisende sammenligning. Sammenlign i løpende kroner og merk enkeltplanens kronevisning.
- En generert PDF kan være merket og likevel være vanskelig å lese. Sjekk rekkefølge, overskrifter, tabeller og figurtekst i den samlede rapporten.

Dato og ukedag er kontrollert. Publisert status i tabellen gjelder main til og med #208. Oppfølgingen etter iPhone-prøven må vurderes ut fra sin egen PR og publiseringskjøring.
