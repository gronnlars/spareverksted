# Personvern og lokal lagring: kartlegging 25. oktober 2026

Utført av Claude på oppdrag fra Lars (via GPT), under prosjektpausen. Arbeidsnotat, ikke juridisk vurdering. Ingenting her betyr at siden er «godkjent» etter GDPR eller ekomloven.

## Grunnlag

- Repo: `gronnlars/spareverksted`
- Main: `04eed8e278d672bd4aae31213b346b8befc5e6a5` (25.10.2026 14:06, «Publiser kildekontrollert renters rente (#76)»)
- Gren for rettingene: `fix/personvern-lokal-lagring`
- Publisering: `.github/workflows/static.yml` bygger `dist/` og publiserer med `actions/deploy-pages` ved push til main. `dist/` har ingen `CNAME`-fil; egendomenet må da være satt i Pages-innstillingene.
- Testmiljø: Linux-arbeidsområde med Node 22. **Ingen nettleser var tilgjengelig**, og nettverket slapp ikke gjennom til `spareverksted.no`, `gronnlars.github.io` eller DNS-oppslag. Den publiserte siden, HTTP-hodene og DNS er derfor **ikke kontrollert**. Avvik mellom kildekode og publisert versjon er **ikke undersøkt**.

## Hva som er kontrollert, og hvordan

| Område | Status | Metode |
|---|---|---|
| Lagringsnøkler i egen kode | Kontrollert | Søk etter `localStorage`, `sessionStorage`, `indexedDB`, `document.cookie`, `caches`, `serviceWorker` i alle filer i `dist/` |
| Nettverkskall i egen kode | Kontrollert i kildekode | Søk etter `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, skjema med `action`, eksterne `src`/`href` i `<script>`, `<link>`, `<img>`, `<iframe>`, CSS `url()` og `@import` |
| Publisert nettverkstrafikk | **Ikke kontrollert** | Ingen nettleser og ingen tilgang til domenet |
| Cookies fra server eller CDN | **Ikke kontrollert** | Krever HTTP-hoder fra publisert side |
| Hosting og leverandører | Delvis | Deployoppsett lest. Pages-innstillinger, DNS og eventuell proxy ikke tilgjengelig |
| Serverlogger | Ikke tilgjengelig | Se «Nettleverandøren» |

## Funn i kildekoden

- Ingen `fetch`, XHR, `sendBeacon`, WebSocket, `indexedDB`, Cache Storage, service worker eller `document.cookie`.
- Ingen eksterne skript, stilark, skrifter eller bilder. Alle `https://`-adresser er vanlige lenker brukeren selv må klikke, eller `canonical`/`og:`-metadata som ikke lastes av nettleseren.
- Skjemaene (`journeyForm`, `saveForm`, `questionForm`, `profileForm`) har ingen `action` og stoppes med `preventDefault`. De behandles lokalt.
- «Del plan» legger tallene etter `#`. Fragmentet sendes ikke i HTTP-forespørselen eller i `Referer`. Alder, risikovalg, aldersgruppe og formål holdes utenfor (`app.js:283`).
- Nedlasting lages med `Blob` og `URL.createObjectURL` (`journey.js`), PDF via `window.print()`. Ingenting sendes.
- Søketeksten i «Spør om sparing» legges ikke i URL og lagres ikke.

Fravær av dette i kildekoden beviser ikke at den publiserte siden ikke kommuniserer med andre, eller at leverandøren ikke setter cookies.

## Lagringstabell etter rettingene

Kodefunn. Linjenumre gjelder grenen `fix/personvern-lokal-lagring`.

| Nøkkel / mekanisme | Fil og linje | Felt | Skrives | Leses | Brukerhandling | Formål | Varighet | Sletting | Mottaker | Foreslått begrunnelse |
|---|---|---|---|---|---|---|---|---|---|---|
| `sv-scenarios` (localStorage) | `app.js:21` les, `app.js:243` skriv | Navn på plan, hele `state` (beløp, sparetid, avkastning, alder hvis oppgitt, m.m.), `mode`, `view` | Ved «Lagre plan», sletting av plan, angre | Ved lasting av kalkulatoren | «Lagre plan» | Å finne planen igjen senere | Ingen utløpstid | «Slett» per plan, sletteknapp på personvernsiden, nettleserens innstillinger | Ingen. Blir i nettleseren | Sterkest: uttrykkelig valg om å lagre på enheten |
| `sv-level` (localStorage) | `app.js:21` les, `app.js:251` skriv | `explore` eller `advanced` | Bare ved trykk på nivåknapp. «Enkel» fjerner nøkkelen | Ved lasting | Trykk på Utforsk eller Avansert | Huske visningsvalg | Ingen utløpstid | Velg «Enkel», sletteknapp, nettleser | Ingen | **Uavklart.** Brukeren trykker selv, men «husk på tvers av besøk» er ikke uttrykkelig bedt om |
| `sv-color-theme` (localStorage) | `theme.js:6` les, `theme.js:24` skriv | `neutral`, `light` eller `night` | Bare ved trykk på tema | Før stiler lastes | Trykk på tema | Huske tema | Ingen utløpstid | Sletteknapp, nettleser | Ingen | **Uavklart**, samme som nivå |
| `sv-started` (sessionStorage) | `journey.js:7–8` | `'1'` | Når brukeren trykker seg videre fra startguiden. Ikke ved lasting eller delt lenke | Ved lasting | Gå videre fra startguiden | Unngå at startguiden vises igjen ved tur til veilederen og tilbake | Fanen. Kan gjenopprettes med faneøkten | Lukke fanen, sletteknapp | Ingen | Teknisk nødvendig for flyten i fanen |
| `sv-started` (localStorage, gammel) | `journey.js:6` fjernes | `'1'` | Skrives ikke lenger | – | – | – | Fjernes ved neste besøk | Automatisk | Ingen | – |
| `sv-working-plan-v1` (sessionStorage) | `veileder-context.js:40–45`, `veileder-bridge.js:6, 25–28` | Hele `state` med beløp, `mode`, `view` | Ved klikk på lenke til `spor.html`. Deretter ved `pagehide` bare hvis nøkkelen finnes | Ved lasting av kalkulatoren uten `#` | Klikk til «Spør om sparing» | At planen er uendret når brukeren kommer tilbake | Fanen. Kan gjenopprettes | Tilbake til startskjermen, lukke fanen, sletteknapp | Ingen | Sterk: brukeren navigerer selv, og formålet er å bevare det brukeren holder på med |
| `sv-guidance-tab-v2` (sessionStorage) | `veileder-context.js:4, 15–17`, `veileder-ui.js:9, 151`, `veileder-bridge.js:25` | Alder, sparetid, risiko, buffer, dyr gjeld, inntekt, sparemåte, fastrente, boligeier, skatt (BSU), sparetid per tema, opphav. Ingen beløp, navn eller fritekst | Klikk til veilederen fra en startet plan; «Oppdater vurderingen» | I veilederen og ved retur til kalkulatoren | Klikk til veilederen eller «Oppdater vurderingen» | Tilpasse forklaringene uten å spørre igjen | Fanen. Kan gjenopprettes | «Glem opplysningene mine», sletteknapp | Ingen | Sterk for «Oppdater vurderingen». Merk: opplysningene om gjeld, buffer og inntekt sier noe om brukerens økonomi |
| Utklippstavle | `experience.js:72`, `om.js:11` | Delingslenke, Vipps-nummer | Ved «Kopier» | – | Trykk | Kopiere | Styres av operativsystemet | – | Ingen | Skjer bare ved trykk. Ikke vurdert om dette regnes som lagring etter § 3-15 |
| Nettleserens vanlige cache | Ikke egen kode | Sider, skript, bilder | Nettleseren | Nettleseren | Besøk | Raskere lasting | Styres av nettleser og serverens hoder | Nettleser | – | Ikke egendefinert datalagring. Serverens `Cache-Control` er ikke kontrollert |

## Hva som skjer før første brukerhandling

**Før rettingene (main `04eed8e`):**

1. Ved åpning av en delt lenke ble `sv-started` skrevet permanent til `localStorage` uten noe trykk (`journey.js:120` → `stage(false)` → `rememberStart()`).
2. Ved å forlate kalkulatorsiden (`pagehide`, også lukking av fanen eller lenke til Om) ble veilederkonteksten skrevet til `sessionStorage`, og arbeidsplanen med alle beløp hvis planen var startet. Dette skjedde selv om brukeren aldri gikk til veilederen.
3. «Vis spareplanen min» og «Se et eksempel» skrev `sv-level=simple` permanent.

**Etter rettingene:** Ingen skriving ved lasting, heller ikke når en delt lenke åpnes. Kontrollert i `tests/personvern-browser.cjs` (Chromium, Firefox og WebKit i GitHub Actions) og `tests/personvern-lagring.test.cjs`.

Merk: at lagring skjer etter et trykk, er ikke i seg selv et lovkrav eller et samtykke. Det er en minimering. Om hver lagring faller inn under unntaket i ekomloven § 3-15, er fortsatt en egen vurdering (se åpne spørsmål).

## Sletting og andre faner

Sletteknappen fjerner Spareverksteds nøkler i `localStorage` for hele nettstedet, men `sessionStorage` bare i fanen der knappen trykkes. Andre åpne faner beholder sin arbeidsplan og veilederkontekst i fanen og i minnet til de lukkes. Lagrede planer kommer ikke tilbake: kalkulatoren lytter på `storage`-hendelsen og leser planene på nytt når de endres i en annen fane (`app.js:245`). Kontrollert i `tests/personvern-browser.cjs`.

`localStorage` har ingen innebygd utløpstid, men nettleseren kan fjerne data, for eksempel ved lite lagringsplass eller når brukeren sletter nettstedsdata.

## Feil funnet i kontroll av PR #78

GPT fant 25.10.2026 at `journey.js` pakker inn `setLevel` og bare sendte videre nivået. Innstillingen `{remember:false}` gikk tapt, slik at automatiske nivåskifter likevel kunne lagres. Rettet ved å sende videre alle argumenter. Testen kobler nå funksjonene sammen slik siden gjør, og feiler mot den gamle innpakningen. Den første testen kontrollerte `setLevel` isolert og fanget ikke feilen.

## Nettleverandøren

- Publisering skjer med GitHub Pages (workflow-fil). At egendomenet går direkte til GitHub uten annen proxy eller CDN, er **ikke bekreftet**: DNS var ikke tilgjengelig.
- GitHub skriver at besøkendes IP-adresse logges og lagres av sikkerhetshensyn, også for besøkende som ikke er logget inn ([What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), lest 25.10.2026).
- GitHubs generelle personvernerklæring (ikrafttredelse 27. april 2026) nevner ikke Pages særskilt, oppgir ingen lagringstid for slike logger, oppgir GitHub, Inc. og GitHub B.V. som behandlingsansvarlige, og viser til standard personvernbestemmelser og EU-US Data Privacy Framework for overføring ([GitHub General Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement), lest 25.10.2026). Ingen avtale mellom Lars og GitHub om databehandling er kjent.
- Serverlogger: **ikke tilgjengelig**. GitHub gir ikke Pages-eiere tilgang til besøkslogger, så vidt dokumentasjonen viser. Lagringstid er ikke gjettet.

### Spørsmål til GitHub Support

1. Hvilke opplysninger logges for besøk på en Pages-side med eget domene (IP, tidspunkt, URL, user agent, referer)?
2. Hvor lenge lagres disse loggene, og hvor (region)?
3. Behandler GitHub disse loggene som egen behandlingsansvarlig eller på vegne av siden? Finnes det en databehandleravtale som gjelder Pages for en gratis personlig konto?
4. Settes det informasjonskapsler eller brukes annen lagring i nettleseren for besøkende på Pages-sider?
5. Går trafikk til Pages via en tredjeparts CDN, og i så fall hvilken?

## Handlinger for kontoeier (Lars)

1. Bekreft i GitHub → Settings → Pages: kilde («GitHub Actions»), eget domene, «Enforce HTTPS».
2. Bekreft hos domeneregistrar hvem som leverer DNS for spareverksted.no, og at det ikke ligger en proxy (for eksempel Cloudflare) foran.
3. Avklar hvem som er ansvarlig og hvilken kontaktadresse personvernsiden skal ha. Ikke publiser siden før det er gjort.
4. Åpne spareverksted.no i en privat nettleserfane med utviklerverktøy (Nettverk + Lagring/Application) og bekreft: ingen forespørsler til andre domener enn spareverksted.no, ingen `Set-Cookie`, ingen lagring før første trykk. Gjør dette etter publisering av rettingene, også på iPhone.
5. Send spørsmålene over til GitHub Support hvis svarene trengs før publisering.

## Åpne spørsmål for myndighetsveiledning

- Nkom: Er lagring av tema og visningsnivå i `localStorage` etter at brukeren trykker på valget, «strengt nødvendig for en tjeneste brukeren uttrykkelig har bedt om», eller bør det bare gjelde økten? Er en tur fra kalkulatoren til veiledningen i samme fane nok til at arbeidsplanen i `sessionStorage` faller inn under unntaket?
- Datatilsynet: Hvordan bør behandlingsansvar og informasjonsplikt vurderes for GitHubs IP-logger på en gratis Pages-side? Er lokal lagring av økonomiske opplysninger som operatøren aldri mottar, en behandling operatøren er ansvarlig for?

## Kjente begrensninger

- Nettlesertestene kjøres bare i GitHub Actions (Chromium, Firefox og WebKit i Linux). Arbeidsmiljøet har ingen nettleser. Safari på iPhone er ikke testet. Den publiserte siden er ikke kontrollert.
- Går brukeren til «Spør om sparing» via adressefeltet eller Om-siden, følger ikke planen med lenger.
- Personvernsiden har inline CSS og punkter merket «Avklares». Den er `noindex` til den er ferdig.
- Åpen PR #75 legger til `tilgjengelighet.html`; den siden må også få lenke til personvernsiden hvis begge slås sammen.
