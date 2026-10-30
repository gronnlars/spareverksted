# Egenprøve med tastatur, zoom og WAVE 30. oktober 2026

Rapportert av Lars i samtale. Nettleser: Chrome på laptop. Eksakt Chrome-versjon, operativsystem, skjermoppløsning og startbredde er ikke registrert. Ikke uavhengig fagkontroll. Skriftlig oppsummering ved ChatGPT/Codex. Kodegrunnlag d5c1a31abb553eaf962592680fde78703b4ef351. Relatert #121 og #124. Nye funn skal ikke leses som om alle punktene i en full WCAG-test er bestått.

## Observert av Lars

- Tab og Shift+Tab ga synlig fokus og gjennomgående naturlig, rask navigasjon. Sammenlignet grafer, prøvde sparemål og navigerte på store deler av siden, men ikke en registrert full gjennomgang av alle kontroller.
- Enter aktiverte knapper, mellomrom avkryssinger og piltastene grafavlesning. Skyveknapper fungerte også med mus.
- Menyen på Spør om sparing forsvant. På andre sider åpnet Enter en tom ramme.
- Rask zoomprøve av kalkulator og Om-side opp til 500 % ga tilpasning uten observert sideveis rulling. Solknappen gikk litt utenfor linjen. Menyen forsvant rundt 400 %. Alle sider og menyalternativer er ikke prøvd ved zoom.
- Grafavlesningen ga år, saldo, innskudd og lavere/høyere vekst med tall. Etterpå ble serienavnene lest uten egne verdier. Hvilket leseverktøy eller hvilken lesemodus som ble brukt, er ikke oppgitt. Dette kan ikke registreres som en VoiceOver- eller NVDA-test.
- Lars antar at overskriftsstruktur og kontrast er ivaretatt av tidligere arbeid. Dette er ikke en ny måling eller DOM-kontroll i egenprøven.

## Ny WAVE-observasjon

Skjermbildene viser https://spareverksted.no med 0 Errors, 0 Contrast Errors, 10 Alerts og AIM 9,8/10. Varslene fordeles på 1 redundant lenke, 2 PDF-lenker, 1 noscript-element og 6 svært små tekster. Tidligere skjermbilder viste www-adressen, 11 Empty button-feil og 11 varsler, hvorav 7 små tekster. Tilstand og eksakt WAVE-motorversjon er ikke registrert. Ingen WAVE-feil er registrert i den nye observasjonen, men dette beviser ikke full tilgjengelighet, alle temaer eller alle kalkulatorvisninger. AIM-poengsummen er ingen godkjenning.

## Bekreftet i kode og avgrenset retting

navigation.css skjuler navigasjonen inne i alle menyer fra 1000 CSS-piksler. Kalkulatoren har andre handlinger i menyen, men rene infosider har bare navigasjonslenker, og menyen blir tom. Samme fil skjuler hele menyen på Spør om sparing ved bred skjerm og på startvisningen. tests/navigation-browser.cjs forventet uttrykkelig at menyen var skjult på Spør om sparing ved PC-bredde.

Retting: bare kalkulatorens arbeidsvisning skjuler de doble navigasjonslenkene ved bred skjerm, fordi handlingene fortsatt er tilgjengelige der. Menyen forblir synlig på Spør om sparing og startvisningen. Ved smale bredder får toppfeltet vokse i høyden slik at temavalget ikke klippes. Ingen ny kalkulatorfunksjon. Nye kontroller betjener menyen med Enter, Tab og Escape på fem sidetyper ved 1280, 320 og 256 CSS-piksler, undersøker at lenkene faktisk vises og at temaknappene er innenfor toppfeltet. Smal viewport er ikke en faktisk 400/500 %-zoomtest.

## Graf og ny beregning: fortsatt oppfølging

chartLegend er en liste med linjenavn og visuelle strekmønstre. Den er en forklaring til grafen, ikke en tabell som mangler verdier. chartTip inneholder tallene for punktet, og talltabell og grafbeskrivelse finnes i tillegg. Det må fortsatt prøves om listene og beskrivelsene fremstår tydelig i den konkrete lesemåten Lars brukte. Ikke skjul forklaringen for skjermlesere bare for å fjerne opplevd gjentakelse.

«Endre tall» og «Ny beregning» har ulike eksisterende formål. Ny beregning ligger i kalkulatorens meny og varsler om ny plan. Menyrettingen skal sikre tilgangen også ved zoom. En ny plassering utenfor menyen er ikke implementert i denne rettingen. Ikke endre Shift+Tab til å nullstille eller starte en ny plan. Navigasjon skal bevare tallene.

## Utførte kontroller

Kodesøk, sammenhold av skjermbilder og rapport. Nye nettlesertilfeller er lagt til eksisterende test. Lokal nettleser er ikke tilgjengelig i arbeidsmiljøet, så CI må bekrefte rettingen. Ingen faktisk skjermleserprøve og ingen ny WAVE-kjøring utført av Codex. Nytt testresultat føres i PR-en.
