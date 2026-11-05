# Omfang for språk- og kildekontroll i CI

5. november 2026. ChatGPT/Codex, egenkontroll. Arbeidsgrunnlag: main 0deee9c etter #233.

Klarspråkkontrollen startet tidligere på alle PR-er og main-push. Den måler lokalt. Den besøker ikke kildelenkene og gjennomfører ingen automatisk språkvask. Kildevakt og Tidsmaskin har egne tidsplaner og avgrenser allerede PR-kjøringene til relevante filer. Nettinnhentingen deres endres ikke i dette steget.

## Avgrensning av klarspråk

Push og PR utløser målingen ved HTML/JavaScript i dist, kilder, svarutkast, scripts, tester, målegrunnlaget under docs/klarsprak, navngitte språk-/kilderegler eller selve arbeidsflyten. Alle scripts og tester er tatt med konservativt for å dekke indirekte avhengigheter og nye målemetoder.

Rene CSS-, bilde- og alminnelige dokumentasjonsendringer utløser ikke denne arbeidsflyten. Blandede endringer med en relevant fil gjør det. CSS-endringer som også oppdaterer versjonslenker i HTML vil fortsatt utløse målingen. Det er bevisst: HTML kan inneholde endret tekst. Dette steget forsøker ikke å avgjøre om en HTML- eller JavaScript-diff bare endrer farge eller versjonsnummer.

En full måling kjører hver mandag 06.17 UTC og kan startes manuelt. Tidsplanen bruker main og GitHub kan forsinke oppstart. Målemetode, sammenligning, feilstatus, rettigheter og rapportartefakter beholdes. Språkfunn er fortsatt rådgivende, mens tekniske feil vises som feil. Ingen kilde- eller språkresultater regnes som nye når målingen ikke har kjørt. At en workflow ikke utløses, er ikke en ny bestått kontroll.

## Kontroll

YAML er lest maskinelt. Jobber, rettigheter, samtidighetsregel og alle kommandosteg sammenlignes med main og skal være identiske. Filtre prøves med representative stier for CSS, bilde, dokumentasjon, HTML, JavaScript, kilder, verktøy og blandede endringer. Den eksisterende klarspråktesten kjøres én gang lokalt. Ingen nye biblioteker eller kjøretidsavhengigheter er innført.

Endringen berører selve språk-workflowen og skal derfor starte en klarspråkkjøring på PR. Senere CSS-/dokumentasjonsendring må bekrefte uteblitt kjøring, mens neste relevante tekstendring eller manuelle kjøring må bekrefte rapporten. Ukentlig kjøring kan først bekreftes etter faktisk planlagt start. Hovedarbeidsflytens beregnings-, sikkerhets-, personvern- og publiseringssperrer er urørt. Full seleksjon av nettlesertester ved kodeendring gjenstår.
