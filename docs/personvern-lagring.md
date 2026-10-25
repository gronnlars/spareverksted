# Personvern og lokal lagring: kartlegging

Arbeidsnotat utført av Claude på oppdrag fra Lars, 25. oktober 2026. Ikke juridisk vurdering. Ingenting her betyr at siden er «godkjent» etter GDPR eller ekomloven. Prosjektet er på vent (se `docs/regulatorisk.md` på grenen `docs/regulatorisk-pause`); dette er avgrenset personvernarbeid på eget oppdrag.

## Grunnlag og kildekategorier

- Repo: `gronnlars/spareverksted`. Main da kartleggingen startet: `04eed8e278d672bd4aae31213b346b8befc5e6a5`. Rettingene ligger på grenen `fix/personvern-lokal-lagring` (PR #78). Full commit-ID på siste head oppgis i PR-en.
- Publisering: `.github/workflows/static.yml` bygger `dist/` og publiserer med `actions/deploy-pages` ved push til main. `dist/` har ingen `CNAME`-fil.

Hver opplysning under har én av disse kategoriene. De skal ikke blandes.

| Kategori | Hva det betyr |
|---|---|
| **Kodefunn** | Lest i kildekoden på grenen. Viser hva koden gjør, ikke hva som er publisert. |
| **Lokal observasjon** | Målt i nettleser mot dist/ fra grenen (ikke publisert). Chromium 153 via Playwright 1.63.0, Linux. CI kjører i tillegg Chromium, Firefox og WebKit (Playwright 1.56.0). WebKit i CI er ikke en fysisk iPhone. |
| **Observasjon fra publisert side** | **Ingen.** Arbeidsmiljøet har ikke tilgang til `spareverksted.no` eller `gronnlars.github.io` (egress-proxyen avviser vertene). |
| **Leverandørens opplysninger** | Fra leverandørens egne sider, med lesedato. |
| **Ukjent** | Ikke undersøkt eller ikke tilgjengelig. Gjettes ikke. |

## Kodefunn

- Ingen `fetch`, XHR, `sendBeacon`, WebSocket, `indexedDB`, Cache Storage, service worker eller `document.cookie` i `dist/`.
- Ingen eksterne skript, stilark, skrifter eller bilder. Alle `https://`-adresser i HTML og JS er lenker brukeren selv må åpne, eller `canonical`/`og:`-metadata.
- Skjemaene (`journeyForm`, `saveForm`, `questionForm`, `profileForm`) har ingen `action` og stoppes med `preventDefault`. De behandles lokalt.
- Delingslenken legger tallene etter `#` (`app.js`, `share`). Alder, risikovalg, aldersgruppe og formål holdes utenfor.
- Nedlasting lages med `Blob` og `URL.createObjectURL` (`journey.js`), PDF via `window.print()`.
- Søketeksten i «Spør om sparing» legges ikke i URL og lagres ikke.
- E-postadressene settes sammen i nettleseren først når brukeren trykker (`kontakt.js`). Ingen ferdig adresse i HTML, attributter eller metadata. Bitene ligger i `kontakt.js` og kan hentes ut av den som leser filen. Dette er ikke sikker beskyttelse.

Fravær av dette i kildekoden beviser ikke at den publiserte siden ikke kommuniserer med andre, eller at leverandøren ikke setter cookies.

## Lagringstabell (kodefunn, grenen)

«Nødvendig for» er vår begrunnelse for hvorfor lagringen hører til en funksjon brukeren ber om. Den er et forslag til vurdering, ikke en konklusjon. Ekomloven § 3-15 gjelder også lagring som ikke er personopplysninger. At lagringen er kort, lokal eller etter et trykk, gjør den ikke automatisk unntatt.

| Nøkkel / mekanisme | Fil | Felt | Skrives | Leses | Brukerhandling | Nødvendig for | Varighet | Sletting | Mottaker | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `sv-scenarios` (localStorage) | `app.js` (les ved lasting, `persist`) | Navn og hele planen (beløp, sparetid, avkastning, alder hvis oppgitt, visning) | Ved «Lagre plan», sletting av plan, angre | Ved lasting av kalkulatoren | «Lagre plan» | Å finne planen igjen. Dette er det brukeren ber om. | Ingen innebygd utløpstid | «Slett» per plan, sletteknappen på personvernsiden, nettleserens innstillinger | Ingen | Sterkest grunnlag |
| `sv-level` (localStorage) | `app.js` | `explore` eller `advanced` | Bare ved trykk på nivåknapp. «Enkel» fjerner nøkkelen | Ved lasting | Trykk på Utforsk eller Avansert | At siden åpner på valgt nivå | Ingen innebygd utløpstid | Velg «Enkel», sletteknappen | Ingen | **Uavklart** (permanent husking) |
| `sv-color-theme` (localStorage) | `theme.js` | `neutral`, `light` eller `night` | Bare ved trykk på tema | Før stiler lastes | Trykk på tema | At temaet er likt neste gang og ikke blinker | Ingen innebygd utløpstid | Sletteknappen | Ingen | **Uavklart** (permanent husking) |
| `sv-started` (sessionStorage) | `journey.js` | `'1'` | Når brukeren trykker seg videre fra startguiden. **Ikke** ved lasting, delt lenke eller «Tilbake til planen» | Ved lasting | Gå videre fra startguiden | At startguiden ikke vises igjen ved tur til veilederen og tilbake | Fanen, kan gjenopprettes | Sletteknappen, tilbake til startskjermen | Ingen | Vurderes som del av flyten |
| `sv-started` (localStorage, gammel) | `journey.js` | `'1'` | Skrives ikke lenger | – | – | – | – | Fjernes (`removeItem`) ved hvert besøk | – | Opprydding av tidligere versjon |
| `sv-working-plan-v1` (sessionStorage) | `veileder-context.js`, `veileder-bridge.js` | Hele planen med beløp, modus, visning | Når brukeren klikker lenke til `spor.html`; deretter ved `pagehide` bare hvis nøkkelen finnes | Ved lasting av kalkulatoren uten `#` | Klikk til «Spør om sparing» | At planen er uendret ved retur | Fanen. Kan gjenopprettes av nettleseren | Tilbake til startskjermen, sletteknappen (i denne fanen) | Ingen | Vurderes som del av flyten |
| `sv-guidance-tab-v2` (sessionStorage) | `veileder-context.js`, `veileder-ui.js`, `veileder-bridge.js` | Alder, sparetid, risiko, buffer, dyr gjeld, inntekt, sparemåte, fastrente, boligeier, skatt (BSU), sparetid per tema. Ingen beløp, navn eller fritekst | Ved klikk til veilederen fra en startet plan; «Oppdater vurderingen» | I veilederen og ved retur | Klikk til veilederen eller «Oppdater vurderingen» | At du slipper å fylle inn det samme to ganger | Fanen. Kan gjenopprettes | «Glem opplysningene mine», sletteknappen | Ingen | Vurderes som del av flyten. Opplysningene sier noe om økonomien din |
| Utklippstavle | `experience.js`, `om.js`, `kontakt.js` | Delingslenke, Vipps-nummer, e-postadresse | Bare ved eget trykk på «Kopier» | – | Trykk | Å kopiere | Styres av operativsystemet | – | Ingen | Ikke vurdert som lagring etter § 3-15 |
| Nettleserens vanlige cache | Ikke egen kode | Sider, skript, bilder | Nettleseren | Nettleseren | Besøk | Raskere lasting | Styres av nettleser og serverens hoder | Nettleser | – | Ikke egendefinert datalagring. Serverens `Cache-Control` er ikke kontrollert |

### Hva som skjer før første brukerhandling

**Før rettingene (main `04eed8e`):** `sv-started` ble skrevet permanent ved åpning av en delt lenke. Veilederkonteksten og (hvis planen var startet) arbeidsplanen med beløp ble skrevet til sessionStorage ved hver `pagehide`, også uten tur til veilederen. `sv-level=simple` ble skrevet permanent ved «Vis spareplanen min» og «Se et eksempel».

**Etter rettingene (kodefunn):** Å åpne siden eller en delt lenke skriver ingenting. Siden **leser** `sv-scenarios`, `sv-level`, `sv-color-theme`, `sv-started` (session) og `sv-working-plan-v1` (session) hvis de finnes, og den **sletter** den gamle nøkkelen `sv-started` i localStorage (en skriveoperasjon som bare fjerner). Lokal observasjon bekrefter at et første besøk og en delt lenke gir tomme lagringsområder (`tests/personvern-browser.cjs`, Chromium; Firefox og WebKit i CI).

Dette er ikke et argument for at lagring etter et trykk er lovlig. Det er en minimering.

## Permanent husking av tema og nivå: alternativer

Uavklart punkt. Vi bygger ikke en samtykkeboks og fjerner ikke funksjonen for å lukke punktet.

| Alternativ | Hva det betyr | Konsekvens |
|---|---|---|
| A. Som nå | Husk valget i localStorage etter trykk, uten utløpstid | Mest brukervennlig. Forutsetter at § 3-15-unntaket for «uttrykkelig ønsket tjeneste» holder, noe vi ikke har fått bekreftet |
| B. Bare i økten | Flytt til sessionStorage | Mindre inngrep, og valget går tapt når nettleseren lukkes. Skriftlig forklaring på siden er enklere. Brukeren må velge på nytt neste dag |
| C. Ingen husking | Bruk standard hver gang (tema følger operativsystemets innstilling via CSS `prefers-color-scheme` er en mulighet) | Ingen lagring. Svakere tilpasning, og tema kan ikke velges varig |
| D. Samtykke | Vise valg om å lagre | Bygges ikke før noe krever det |

Spørsmålet er ikke avgjort av grønn CI eller av at brukeren trykker. Det er formulert som spørsmål til Nkom (utkast levert til Lars, ikke sendt).

## Sletting og andre faner

Sletteknappen på `personvern.html` fjerner Spareverksteds nøkler i `localStorage` for hele nettstedet, men `sessionStorage` bare i fanen der knappen trykkes. Andre åpne faner beholder sin arbeidsplan og veilederkontekst i fanen og i minnet til de lukkes. Dette er ikke endret og lovet ikke annet. Lagrede planer kommer ikke tilbake: kalkulatoren lytter på `storage`-hendelsen og leser planene på nytt når de endres i en annen fane (`app.js`). Kontrollert i `tests/personvern-browser.cjs`.

Knappen: forklarer og krever bekreftelse når det finnes lagrede planer («kan ikke angres»), rører bare nøklene i listen (`personvern.js`), melder fra hvis noe ikke kunne slettes, og viser ingen knapp og en forklaring hvis nettleseren blokkerer lagring.

`localStorage` har ingen innebygd utløpstid, men nettleseren kan fjerne data. `sessionStorage` forsvinner vanligvis når fanen lukkes, men nettlesere som gjenoppretter faner kan gjenopprette den. Produkttekst lover derfor ikke sletting ved lukking.

## Delte lenker

Delen etter `#` sendes ikke i selve HTTP-forespørselen til nettstedet. Sidens skript leser den. Tjenester brukeren deler lenken gjennom (e-post, meldingsapper) kan se og lagre hele lenken. Vi skriver ikke at fragmentet «aldri» kan sendes.

## Lokal observasjon av PR-versjonen

Kjørt 25.10.2026 med `scripts/produksjonskontroll.cjs --local` (Chromium 153, ren profil, dist/ fra grenen, oppdiktede tall: 1 000 kr start, 500 og 750 kr per måned). Åtte trinn: første besøk, start, endre beløp/nivå/tema, lagre plan, gjenåpne, tur til veilederen med søk, personvernside med sletting, feilside.

- 64 forespørsler, alle til samme opprinnelse. Ingen til andre verter. Ingen forespørsler med annen metode enn GET. Ingen omdirigeringer. Ingen WebSocket.
- Ingen `Set-Cookie`. `context.cookies()` tom etter alle trinn.
- Lagring etter trinn: tom → `sv-started` (session) → `sv-level`, `sv-color-theme` → `sv-scenarios` → (veileder) `sv-working-plan-v1`, `sv-guidance-tab-v2` → tom etter sletting.

Dette gjelder en lokal server uten CDN og uten leverandørens hoder. Det sier ingenting om hva hostingen sender.

## Observasjon fra publisert side

**Ikke utført.** Egress-proxyen i arbeidsmiljøet avviser tilkobling til `spareverksted.no`, `gronnlars.github.io` og DNS-oppslag. Ikke omgått. Kort kontroll for en maskin med tilgang:

```
node scripts/produksjonskontroll.cjs https://spareverksted.no > produksjon.json
curl -sIL https://spareverksted.no/        # omdirigeringer, HTTPS, hoder
curl -sI http://spareverksted.no/          # skal gå til https
curl -sI https://www.spareverksted.no/
dig +short spareverksted.no A AAAA CNAME NS; dig +short www.spareverksted.no CNAME
```

Se i `sammendrag`: `forespørslerTilAndreVerter`, `Set_Cookie`, `ikkeGET_ellerMedBody`, `omdirigeringer`, `førsteDokument` (server, via, hsts, cache) og `lagringEtterHvertTrinn`. GitHub Pages kjenner man igjen på `server: GitHub.com` og `x-github-request-id`. Hvis andre verter dukker opp (proxy/CDN), gjelder leverandørspørsmålene også dem. Gjenta etter eventuell senere publisering for å bekrefte at riktig versjon er ute. Nettleserens logg viser ikke hva leverandøren lagrer på serveren.

## Nettleverandøren (leverandørens opplysninger, lest 25.10.2026)

- Sidene publiseres med GitHub Pages (workflow-fil). At egendomenet går direkte til GitHub uten annen proxy eller CDN er **ukjent**.
- GitHub skriver at besøkendes IP-adresse logges og lagres av sikkerhetshensyn, også for besøkende som ikke er logget inn ([What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)).
- GitHubs generelle personvernerklæring (ikrafttredelse 27. april 2026) nevner ikke Pages særskilt, oppgir ingen lagringstid for slike logger, oppgir GitHub, Inc. og GitHub B.V. som behandlingsansvarlige og viser til standard kontraktsklausuler og EU-US Data Privacy Framework for overføring ([GitHub General Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)). Ingen avtale mellom Lars og GitHub om databehandling er kjent. Roller avgjøres ut fra faktisk forhold og avtale, ikke ut av overskriften i en erklæring.
- Serverlogger: **ikke tilgjengelig**. Lagringstid er ikke gjettet. Spørsmål til GitHub Support ligger som usendt utkast.

## E-post

E-post til oss er en egen behandling. Se `docs/kontakt-epost.md`.

## Logg over henvendelser

Opplysningene er gitt av Lars. Selve e-postene ligger hos ham i Gmail. Private adresser og skjermbilder skal ikke inn i repoet.

| Mottaker | Sendt | Status (26.10.2026) | Referanse |
|---|---|---|---|
| Domene.no | E-post 1, uendret fra utkastet (versjonen med rettingene 25.10.2026) | Mottak bekreftet 25.10.2026 kl. 23.58. Venter på svar | Sak 39138152 |
| Nkom | E-post 2, uendret fra utkastet | Mottak bekreftet 26.10.2026 kl. 00.01. Venter på svar | Saksnummer ikke oppgitt i bekreftelsen |

Spørsmål som er sendt:
- **Domene.no (fem):** hvilken avtale eller vilkår som gjelder for videresending, og om den er en databehandleravtale; lagring i kø, retur og sikkerhetskopi og hvor lenge; e-postlogger og oppbevaring; hvor e-posten behandles og underleverandører; sletting og behandling utenfor EØS.
- **Nkom (to):** om lagring av tema og visningsnivå i localStorage etter aktivt valg er strengt nødvendig etter § 3-15, eller bør gjelde bare økten; om arbeidsplanen og veilederkonteksten i sessionStorage ved tur fra kalkulatoren til veiledningen faller under unntaket. Vedlagt var den korte lagringstabellen.

De reviderte utkastene (25.10.2026) er historikk, ikke ventende utsendinger. Ingen ny e-post trengs for presiseringene alene.

Ikke sendt: spørsmål til GitHub Support og til Datatilsynet. Utkast finnes hos Lars.

Hva logginnslagene betyr:
- Mottaksbekreftelsene er ikke faglige svar eller godkjenninger.
- De bekrefter ikke at aliasene for personvern og generell kontakt fungerer, med mindre henvendelsene ble sendt med disse som svaradresse. Mottakstest av begge aliasene gjenstår.
- Endringer i løsningen som skyldes svar, skal føres inn her med dato og referanse. Avvent svar før nivå- og temavalget (alternativ A, B eller C) avgjøres endelig.

## Åpne spørsmål for myndighetsveiledning

- Nkom: Er lagring av tema og visningsnivå i `localStorage` etter aktivt valg «strengt nødvendig for en tjeneste brukeren uttrykkelig har bedt om», eller bør det bare gjelde økten? Er en tur fra kalkulatoren til veiledningen i samme fane nok til at arbeidsplanen i `sessionStorage` faller inn under unntaket?
- Datatilsynet: Hvordan bør behandlingsansvar og informasjonsplikt vurderes for GitHubs IP-logger på en gratis Pages-side? Er lokal lagring av økonomiske opplysninger som operatøren aldri mottar, en behandling operatøren er ansvarlig for? Hvordan skilles lokal behandling fra e-postkontakt i personverninformasjonen?

## Kjente begrensninger

- Nettlesertestene kjører i Chromium (lokalt og i CI), Firefox og WebKit (bare CI). Safari på iPhone er ikke testet. Den publiserte siden er ikke kontrollert.
- Går brukeren til «Spør om sparing» via adressefeltet eller Om-siden, følger ikke planen med.
- `personvern.html` har inline CSS, punkter merket «Avklares» og er `noindex`. `noindex` er ingen tilgangskontroll og gjør ikke en uferdig erklæring publiseringsklar.
- PR #75 legger til `tilgjengelighet.html`. Den siden må få lenke til personvernsiden hvis begge slås sammen. Se PR-en for status.

## Feil funnet i kontroll av PR #78

1. `journey.js` pakket inn `setLevel` og sendte bare nivået videre, så `{remember:false}` gikk tapt. Rettet; testen kobler funksjonene sammen som på siden og feiler mot gammel innpakning.
2. «Tilbake til planen» ble skjult for planer åpnet fra delt lenke etter at `sv-started` ikke lenger ble skrevet (`startflyt-browser.cjs:98`). Rettet med `planShown` i minnet. «Tilbake til planen» skriver ingenting.
3. Påstander om utløpstid, «ingenting lagres» og fullstendig sletting ble gjort presise.
