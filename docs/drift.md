# Lokal drift og publisering

Teknisk dokumentasjon flyttet fra README 29. oktober 2026.

## Flytt til et annet nettsted

Publiser innholdet i `dist/` på en tjeneste for statiske nettsteder. Behold filene i samme mappe. Domenet håndteres hos valgt driftsleverandør. Kalkulatoren har ingen binding til Sites for selve beregningene.

Kodepakken som lenkes fra bunnteksten, kan oppdateres med `python3 scripts/package-source.py`. Kjør dette før publisering etter kodeendringer.

## Bunny Storage

Arbeidsflyten tester endringer på pull requests og `main`. Etter at kontrollene og
nettlesertestene består på `main`, speiles bare `dist/` til Bunny Storage-sonen
`spareverksted` i Frankfurt. GitHub beholder kildekode og kjører CI; Storage-nøkkelen
brukes med S3-kompatibel tilgang: sone-navnet er Access Key ID, og GitHub Actions-secret
`BUNNY_STORAGE_PASSWORD` er Secret Access Key. Endpoint er
`https://de-s3.storage.bunnycdn.com`, region `de`.

Opplasting til Storage Zone alene flytter ikke besøkenes trafikk. Før domenet bruker
Bunny, må Pull Zone, HTTPS-sertifikat, DNS og sikkerhetshoder konfigureres og
kontrolleres i Bunny og hos DNS-leverandøren. Inntil dette er bekreftet, skal ikke
publisert trafikk omtales som rutet via Bunny.

Arbeidsflyten tømmer foreløpig ikke Pull Zone-cache. Før DNS flyttes, må automatisk
cache-purge kobles til med Pull Zone-ID og Bunny API-secret, eller cache-reglene må
settes slik at nye filer ikke blir liggende utdatert. Kontroller en publisering
over HTTPS før domenet flyttes.
