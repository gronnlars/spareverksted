# Lokal drift og publisering

Teknisk dokumentasjon flyttet fra README 29. oktober 2026.

## Flytt til et annet nettsted

Publiser innholdet i `dist/` på en tjeneste for statiske nettsteder. Behold filene i samme mappe. Domenet håndteres hos valgt driftsleverandør. Kalkulatoren har ingen binding til Sites for selve beregningene.

Kodepakken som lenkes fra bunnteksten, kan oppdateres med `python3 scripts/package-source.py`. Kjør dette før publisering etter kodeendringer.

## GitHub Pages

Under Settings → Pages velger prosjekteieren **GitHub Actions** som Source.
Åpne deretter Actions → Test and publish Spareverksted → Run workflow → main.
Arbeidsflyten tester beregningene, lager kodepakken og publiserer `dist/`.
Senere endringer på `main` publiseres automatisk når testene består.
Pull requests testes uten å publiseres. Nettsidens adresse vises i Pages-innstillingene
og i den vellykkede publiseringsjobben. Eget domene kan settes i Pages-innstillingene.
