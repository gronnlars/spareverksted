# Oppsett av spareverksted.no på bunny.net

Mål:
- All trafikk går gjennom Europa.
- Loggen skjuler brukerens IP-adresse.
- Mozilla Observatory gir 100.
- `http://`, `www.` og full adresse ender alle på `https://spareverksted.no/`.
- Brukerne har full kontroll: ingen cookies, ingen tredjeparter, strenge nettleserregler.

**Status:** Dette er skrevet ut fra bunny.nets dokumentasjon, ikke fra kontoen din. Knappenavn og variabler (merket ⚠) kan avvike litt i dashbordet, så sjekk dem mot det du ser. Kontrollskriptet nederst viser om resultatet faktisk ble riktig.

## Alt som kode: rask vei

Hodene styres fra `deploy/headers.cjs`. Rediger bare den, og kjør `node scripts/sync-security.cjs`. Den oppdaterer `deploy/terraform/headers.auto.tfvars.json`, som Edge Rules bruker. `tests/security-sync.test.cjs` kjører i CI og feiler hvis noe er ute av synk.

HTML-sidene har i tillegg `<meta>`-CSP (kontrolleres av `scripts/security-check.py`). Nettleseren bruker meta og header sammen, så den strengeste gjelder. Headeren er strengere enn meta: ingen inline stil, og `frame-ancestors`, som ikke kan settes i meta.

Opplasting av `dist/` til lagringssonen skjer allerede i `.github/workflows/static.yml` (S3, hemmeligheten `BUNNY_STORAGE_PASSWORD`, se `docs/drift.md`). Den er ikke en del av dette oppsettet.

1. `export BUNNYNET_API_KEY=...` (kontonøkkel fra bunny.net, aldri i en fil).
2. `cd deploy/terraform && terraform init && terraform validate && terraform plan`. Filen er skrevet uten å kunne valideres mot leverandøren, så rett eventuelle attributtnavn som `validate` klager på.
3. `terraform apply`. Dette lager lagringssone, pull zone med europeisk ruting og anonymisert logg, og Edge Rules.
4. Pek DNS på bunny (punkt 3 under). Sett så `-var enable_tls=true` og kjør `terraform apply` igjen. Da får begge adresser sertifikat og tvungen HTTPS.
5. Cache: arbeidsflyten tømmer ikke Pull Zone-cachen. Cache-reglene (HTML `no-cache`, JS og CSS én time) gjør at nye filer får fram på høyst en time.
6. Kjør `node scripts/check-live.cjs spareverksted.no`.

Det som ikke kan ligge i koden: DNS hos registraren (DS-oppføring for DNSSEC), selve bunny-kontoen og nøklene, og at du slår av GitHub Pages.

Om `spareverksted.no` skrives uten `https://`: nyere nettlesere prøver HTTPS først. Andre ender på `http://`, får en omdirigering til HTTPS første gang, og HSTS sørger for HTTPS direkte etter det. Bare HSTS-preload gjør første besøk fullstendig sikkert (se punkt 5).

Filene som styrer dette i repoet:
- `deploy/headers.cjs`: fasit for alle responshoder og HSTS-trinn.
- `deploy/terraform/`: bunny-oppsettet som kode.
- `scripts/sync-security.cjs`: holder Terraform-variablene i synk med fasiten.
- `tests/csp-browser.cjs`: kjører appen med nøyaktig disse hodene og feiler ved brudd.
- `scripts/check-live.cjs`: kontrollerer den ekte siden.

## 1. Lagring i Europa

1. **Storage → Add Storage Zone.** Navn for eksempel `spareverksted`. Hovedregion: Falkenstein (Tyskland).
2. **Replikering:** bare europeiske regioner, eller ingen. Ikke velg New York, LA, Singapore, Sydney, São Paulo eller Johannesburg.
3. Last opp innholdet i `dist/` (ikke selve mappen). `index.html` skal ligge i roten.
4. Bruk ikke GitHub Pages som origin. Da får en tredjepart i USA en egen rolle i trafikken. Slå også av Pages i repoet etter at du har byttet over. Ellers ligger en andre kopi av siden på `gronnlars.github.io` uten hodene under.

## 2. Pull Zone (selve CDN-et)

1. **CDN → Add Pull Zone.** Origin type: Storage Zone, og velg sonen fra punkt 1.
2. **Pricing & Routing → Routing filter:** slå på **EEA** (Europa pluss Island og Norge). Velg **EU** hvis du vil ha strengere avgrensning. Norske brukere får da lengre vei, siden Oslo ikke er med. Filtrene krysses, så EEA og EU samtidig gir bare EU.
3. **Origin Shield:** av, eller sett til Frankfurt/Paris.
4. **Perma-Cache:** av, eller bare europeisk lagringssone.
5. **Logging:**
   - IP-anonymisering skal stå på. Det er standard hos bunny, og siste del av adressen byttes ut med 0. Ikke signer databehandleravtalen for full IP-logging.
   - Velg den sterkeste anonymiseringen dashbordet tilbyr (⚠ finnes eventuelt «fjern to oktetter»).
   - Hold «Permanent Log Storage» av.
   - Vil du ikke ha logg i det hele tatt, slå av «Enable logging».
6. **Headers → CORS:** skal være av. Observatory trekker poeng for `Access-Control-Allow-Origin: *`, og siden trenger det ikke.

## 3. Domene og sertifikat

1. **Hostnames:** legg til `spareverksted.no` og `www.spareverksted.no`.
2. **Free SSL certificate:** aktiver for begge.
3. **Force SSL:** slå på for begge. Det gir `http://X` → `https://X` på samme vertsnavn, som Observatory krever som første hopp.
4. **DNS:**
   - Enklest er å flytte DNS til bunny DNS. Da får apex-domenet sin Pull Zone-oppføring uten ALIAS/ANAME-problemer.
   - Legg `www` som CNAME til pull zone-adressen.
   - Slå på **DNSSEC** i bunny DNS (gratis) og legg inn DS-oppføringen hos registraren.
   - Ikke legg inn CAA-poster uten å vite hvem bunny bruker som sertifikatutsteder. En feil CAA stopper fornyelsen.

## 4. Edge Rules

I rekkefølge. Handlinger og vilkår heter noe lignende i dashbordet (⚠).

**Regel 1: www til apex**
- Vilkår: Request URL (eller Hostname) er `www.spareverksted.no`.
- Handling: Redirect, 301, til `https://spareverksted.no{{path}}` (⚠ sjekk hvilken variabel som tar med sti og query).
- Resultat: `http://www` → `https://www` (Force SSL) → `https://spareverksted.no`.

**Regel 2: sikkerhetshoder (alle forespørsler, også omdirigeringer)**
- Vilkår: alle URL-er (`*`).
- Handling: *Set Response Header* én gang per linje. Nøyaktige verdier står i `deploy/headers.cjs`. Kopier derfra. Overskriftene er:
  - `Content-Security-Policy`
  - `Strict-Transport-Security`
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - `Cross-Origin-Opener-Policy`
  - `Cross-Origin-Embedder-Policy`
  - `Cross-Origin-Resource-Policy`

**Regel 3: cache**
- `.html` og `/`: `Cache-Control: no-cache`.
- Alt annet (`.js`, `.css`): `Cache-Control: public, max-age=3600`.
- Hvorfor ikke lengre: `?v=` i lenkene økes for hånd, og en glemt økning skal ikke gi brukerne gammel kode i uker.

**Regel 4 (valgfri): bare lesing**
- Vilkår: Request Method er ikke GET, HEAD eller OPTIONS.
- Handling: Block Request.

## 5. Hvorfor 100, og hva jeg ikke kan love

- **Content-Security-Policy:** `default-src 'none'` og bare `'self'` for skript, stil og fonter. Bilder tillater også `data:` og `blob:` (lokal eksport), og `connect-src` er `'none'`. Ingen `unsafe-inline`. HTML-meta tillater fortsatt inline stil, men siden har ingen igjen: to maler satte `style=""`, og det er rettet til CSSOM via `layout.js`.
- **HSTS** innføres i fire trinn (5 minutter, 1 døgn, 6 måneder, 2 år) via `HSTS_STAGE` i `deploy/headers.cjs`. Hev trinnet først når det forrige har fungert i et par dager. Full Observatory-score krever minst 6 måneder, altså trinn 3. `includeSubDomains` er av som standard, fordi det rammer alle underdomener. Slå det på i `headers.cjs` bare hvis alle skal ha HTTPS, og få bonuspoeng.
- **Resten:** `nosniff`, `X-Frame-Options`, `Referrer-Policy` og kryss-opprinnelse-hodene gir full uttelling og ingen bivirkning, siden siden ikke bruker innhold fra andre domener.
- **Ingen cookies**, så cookie-testene er tomme.
- **Det jeg ikke kan garantere:** Jeg har ikke kjørt Observatory mot siden din. Verdien 100 er bare riktig når `scripts/check-live.cjs` viser «Alt stemmer», og Observatory selv bekrefter. Hvis bunny ikke legger hodene på selve omdirigeringssvaret (www → apex), vil kontrollskriptet si fra under «HSTS også på www».
- **HSTS preload** (`; preload`) gir bonuspoeng, men er vanskelig å angre. Legg det bare til hvis du er sikker på at alle underdomener alltid skal ha HTTPS, og meld inn på hstspreload.org selv.

## 6. Billige ekstratiltak (full kontroll for brukerne)

Allerede på plass i koden: ingen cookies, ingen tredjepartsforespørsler, systemfonter, all beregning i nettleseren, og `Permissions-Policy` som slår av kamera, mikrofon, posisjon og betaling.

I bunny og DNS:
- DNSSEC (gratis, se punkt 3).
- Nettleserregler som forbyr innbygging (`frame-ancestors 'none'`) og kryssopprinnelse. Dette er regel 2.
- Blokker alt annet enn lesing (regel 4).
- `security.txt` på `/.well-known/security.txt` er billig, men krever en kontaktadresse. Bestem hvilken, så legger jeg den inn i `dist/.well-known/`.

Ikke aktiver uten å vite at det koster eller sender data:
- Tilleggstjenester som Optimizer, bildebehandling og Shield/WAF (⚠ sjekk pris).
- Videresending av klientens IP til opprinnelsen. Med Storage Zone er det ingen tredjepart som mottar den.

## 7. Kontroller

```sh
node scripts/check-live.cjs spareverksted.no
```

Skriptet sjekker fire inngangsadresser (`http://` og `https://`, med og uten `www`), alle hodene, cache, cookies, CORS og at POST avvises. Kjør deretter https://developer.mozilla.org/en-US/observatory.

Lokal test mot samme hoder:

```sh
NODE_PATH=$(npm root -g) node tests/csp-browser.cjs
```

## 8. Personvernteksten

Når alt er på plass, bør teksten «Om veilederen og personvern» oppdateres. I dag står det bare at «driftsleverandøren kan behandle vanlige trafikkdata». Si fra når oppsettet er bekreftet, så skriver jeg en tekst som sier hvem som driver tjenesten, at trafikken går via europeiske servere, og at IP-adresser anonymiseres i loggen.
