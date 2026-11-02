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

## Status i produksjon (2. november 2026)

Domenet bruker Bunny fra 1. november 2026. Opplysningene under er gitt av Lars med skjermbilder fra Bunny-panelet, ikke kontrollert fra arbeidsmiljøet (egress-proxyen avviser spareverksted.no).

- Navnetjenere: `coco.bunny.net` og `kiki.bunny.net` (bekreftet med dnscheck.norid.no). Registrar er fortsatt Domene.no.
- DNS: `spareverksted.no` og `www` er CNAME til `spareverksted.b-cdn.net`. `mail` er A-oppføring til cPanel-serveren hos Domene.no, uten CDN. MX peker til `mail.spareverksted.no`. SPF, DKIM og DMARC er lagt inn.
- Pull Zone: Origin er Storage Zone `spareverksted`. Hostnavn `spareverksted.no` og `www.spareverksted.no` med SSL og Force SSL.
- Storage Zone: Frankfurt, med replikaer i Stockholm og London. Replikaer kan ikke fjernes uten ny sone.
- Logging: tilgangslogg av for Pull Zone og DNS, IP-anonymisering «Drop». Shield logger ikke headere eller innhold. WAF i blokkeringsmodus. Robotgjenkjenning av.
- Headere settes i Edge rule `Spareverksted_Personvern`: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy (no-referrer), Permissions-Policy, Cross-Origin-Opener-Policy og Content-Security-Policy. CSP-headeren er lik meta-taggen i HTML, pluss `frame-ancestors 'none'`. **Endres CSP i koden, må headeren i Bunny endres samtidig**, ellers gjelder den strengeste.
- Databehandleravtale med BunnyWay d.o.o. signert 31. oktober 2026. PDF-en inneholder privat adresse og ligger ikke i repoet.

Gjenstår: DNSSEC (DS-oppføring hos registrar), automatisk cache-tømming etter publisering, og avklaring av hvor lenge Shield beholder brannmurloggen.

## Tidligere notat før flytting

Opplasting til Storage Zone alene flytter ikke besøkenes trafikk. Før domenet bruker
Bunny, må Pull Zone, HTTPS-sertifikat, DNS og sikkerhetshoder konfigureres og
kontrolleres i Bunny og hos DNS-leverandøren. Inntil dette er bekreftet, skal ikke
publisert trafikk omtales som rutet via Bunny.

Arbeidsflyten tømmer foreløpig ikke Pull Zone-cache. Før DNS flyttes, må automatisk
cache-purge kobles til med Pull Zone-ID og Bunny API-secret, eller cache-reglene må
settes slik at nye filer ikke blir liggende utdatert. Kontroller en publisering
over HTTPS før domenet flyttes.
