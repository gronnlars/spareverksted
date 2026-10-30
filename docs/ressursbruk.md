# Ressursbruk og miljø

Opprettet 30. oktober 2026. Kodegrunnlag: main 521de3f. Lars har bestilt informasjonssiden og godkjent den personlige teksten om KI-bruk. Dette er ikke nye overordnede prosjektregler. Ingen endring i finansielle beregninger.

## På plass i denne endringen

- `dist/ressursbruk.html`, med lenke fra `dist/om.html`, samme utforming og lokale fellesressurser.
- Personlig redegjørelse, tiltak, kunnskapshull, planlagt metode og versjonshistorikk.
- `python3 scripts/ressurskontroll.py` i eksisterende CI: leser lokale filer, rapporterer rå byte per HTML/CSS/JS-fil og eksterne ressurser oppgitt i HTML.
- Ingen ekstra pakker, analyseverktøy hos besøkende eller nettverkskall fra kontrollskriptet. Eksisterende GitHub Actions kjører fortsatt hos GitHub, med ressursbruk og leverandørbehandling som før.

Filkontrollen er en inventarliste, uten vedtatte størrelsesgrenser. Den henter ikke ressurser, måler ikke overførte byte, oppdager ikke runtime-forespørsler eller CSS-importer og gir ikke personverngodkjenning. CI-resultatet er tilgjengelig i loggen for aktuell kodeversjon. Ingen utslippsberegning er gjort.

## Neste avgrensede steg

1. Etabler nettverksmåling på lokale representative sider og handlinger med eksisterende Playwright-verktøy. Kontroller faktisk komprimering og cache ved separat produksjonsmåling; lokale råfiler kan ikke representere GitHub Pages-overføring.
2. Første/gjentatt besøk: registrer cacheoppsett, overførte byte, forespørsler, eksterne verter, nettleserversjon, dato og commit. Bruk syntetiske data. Ikke innfør besøksanalyse.
3. Avgrens antall sider, kjøretid og triggere til relevante endringer. Ikke opprett hyppig periodisk kjøring uten behov. Mislykket eller ufullstendig test skal merkes.
4. Kontroller valgt versjon av CO2.js, modellens underliggende primærkilder, årganger og lisenser mot KILDEREGLER før integrasjon. WSG og andre eksterne kilder må vurderes før offentlige faktapåstander; ingen stilltiende unntak fra kildehierarkiet.
5. Gjennomsnittlig og marginal strømintensitet skal ikke blandes. Avklar opplysningen om Ember og UNFCCC mot valgt versjon. Bibliotek- og modellversjon og antakelser må følge hvert anslag.
6. Bevar råmålinger uavhengig av modellanslag. Ikke omregn abonnementskvote, pris eller modellandel til energi/CO2. Skjermbilder fra private brukskontoer publiseres ikke i denne endringen.
7. Sett eventuelle varslingsterskler etter grunnmåling og behovsvurdering. Ingen vilkårlige tak nå. En test bestått betyr ikke full tilgjengelighet eller personvern.

## Kriterier og statuser til senere vurdering

Ressursbruk, tilgjengelighet, brukerens interesser, forståelighet, åpenhet og gjenbruk. Bruk statusene dokumentert gjennomført, delvis gjennomført, planlagt, ikke prioritert (med begrunnelse) og ukjent. Referer til eksisterende personvern- og UU-dokumentasjon fremfor å kopiere statuser som kan bli utdaterte. FN-koblinger er ikke vedtatt.

## Historikk og datoer

Versjon 1.0 er første sideutgave. Datoen dokumenterer gjennomgang av denne redegjørelsen, ikke kildekontroll av fremtidige klimamodeller. Ved publisering beholdes ærlig gjennomgangsdato; oppdater historikken ved vesentlige innholds- eller metodeendringer. Ikke hevde at en PR allerede er publisert.


## Nettleserskript, skrevet 30. oktober 2026

Kjør i miljø med prosjektets Playwright/Chromium:

```sh
node scripts/ressursmaaling.cjs --output=/tmp/ressursmaaling/local.json
node scripts/ressursmaaling.cjs --url=https://spareverksted.no/ --output=/tmp/ressursmaaling/published.json
```

Den publiserte målingen bruker ikke den nye siden før den er publisert. Den sender syntetiske tall og et fast BSU-spørsmål gjennom vanlig grensesnitt. Ingen skjemaer for kontakt eller lagring av planer brukes. Eksterne forbindelser registreres og gir status needs-review; de blokkeres ikke av scriptet. En ny nettverksavhengighet kan derfor kontakte en ekstern tjeneste under testen. Kjør bare på kontrollert kode, ikke ukjent tredjepartskode. URL er begrenset til produksjonsdomenet eller den innebygde lokale serveren.

Skriptet bruker en ny kontekst per side og normal HTTP-cache ved andre besøk, CDP encodedDataLength og cacheflagg. Forespørsler, cache-treff, ukjente størrelser og feil vises separat. Null ved cache er ikke et nullutslipp. Lokalt brukes syntetisk gzip og ti minutters cache, ikke GitHub Pages-forutsetninger. Rapporten har filhasher og markerer lokale endringer; produksjonens kodeversjon er ukjent og får ikke checkoutens SHA.

90 sekunders målegrense, korte tidsgrenser per navigasjon/handling og opprydding også ved feil. Ufullstendige kjøringer gir feilstatus og rapport, aldri en grønn tom måling. Ingen energimodell eller størrelsesgrense.

Egen liten GitHub-workflow bruker prosjektets eksisterende Playwright-testbilde og pakkeversjon. Den kjøres ved relevante endringer i PR/main eller manuelt, ikke etter en fast klokke. Maks fire minutter per jobb, to minutter for selve måletrinnet; eldre kjøringer på samme gren avbrytes. Rapporter lagres som CI-artifakt i sju dager, og besøkende laster ingen nye ressurser. Den eksisterende deploy-jobben endres ikke til å kreve at denne foreløpige målingen består.

### Faktisk verifikasjon

- Syntakskontroll av skriptet og offline filkontroll består.
- Manglende Chromium er prøvd: skriptet avslutter med status incomplete, feilårsak og rapport uten måletall.
- Nedlasting av Chromium mislyktes i arbeidsmiljøet. Fullstendig lokal og publisert måling er derfor ikke utført. Ingen tall er lagt på siden.
- Testreisene (startbeløp 1000, månedlig 500 endret til 750, og «Hva er BSU?») er prøvd i forhåndsvisningens nettleser. Kalkulatoren viste resultat og BSU-svaret ble åpnet. Dette verifiserer brukerhandlingene, ikke CDP-målingen.
- Før godkjenning: kjør begge kommandoene i nettlesermiljøet, kontroller cache/komprimering og rapportenes complete-status, og gjennomgå ressurssiden på mobil og med tastatur. Oppdater sidens status først etter faktisk bestått kjøring.

### Første beståtte CI-måling, 30. oktober 2026

Run 41061742248, kildegren a1fbc82e571f14b5c8467fa2d46b5b27f978e1e9, syntetisk merge 82d68bc8bd83ca90ae16a3a680b7ffbac8552e15: complete, åtte delsteg og ingen feil. Første/gjentatt besøk på index, spor og ressursbruk, kalkulatorhandling og BSU-søk. Gjenbesøk fikk cache-treff for alle forespørslene. Null overførte responsbyte ved cache er ikke null energibruk. Dette er lokalt testmiljø med syntetisk gzip/cache, ikke produksjonsmåling. Ingen utslippstall publiseres. Tidligere feil skyldtes Git-eierskapskontroll i containeren før målingen; workflow tillater nå bare den konkrete checkout-mappen. W3C-testens sidetall følger antallet HTML-filer.
