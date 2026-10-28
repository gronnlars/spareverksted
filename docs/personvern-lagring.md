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
| `sv-level` (sessionStorage) | `app.js` | `explore` eller `advanced` | Bare ved trykk på nivåknapp. «Enkel» fjerner nøkkelen | Ved lasting | Trykk på Utforsk eller Avansert | At siden står på nivået du valgte mens du bruker den | Fanen. Kan gjenopprettes av nettleseren | «Enkel», sletteknappen | Ingen | Fanelagring vedtatt (alternativ B). Samtykkespørsmålet er ikke avgjort av det |
| `sv-color-theme` (sessionStorage) | `theme.js` | `neutral`, `light` eller `night` | Bare ved trykk på tema | Før stiler lastes | Trykk på tema | At temaet er likt mellom sidene i fanen og ikke blinker | Fanen. Kan gjenopprettes av nettleseren | Sletteknappen | Ingen | Fanelagring vedtatt (alternativ B). Samtykkespørsmålet er ikke avgjort av det |
| `sv-level`, `sv-color-theme` (localStorage, gamle) | `app.js`, `theme.js` | ingen | Skrives ikke lenger | Leses ikke | ingen | ingen | ingen | Fjernes ved besøk | ingen | Opprydding av tidligere versjon. Valg fra tidligere besøk går tapt |
| `sv-started` (sessionStorage) | `journey.js` | `'1'` | Når brukeren trykker seg videre fra startguiden. **Ikke** ved lasting, delt lenke eller «Tilbake til planen» | Ved lasting | Gå videre fra startguiden | At startguiden ikke vises igjen ved tur til veilederen og tilbake | Fanen, kan gjenopprettes | Sletteknappen, tilbake til startskjermen | Ingen | Vurderes som del av flyten |
| `sv-started` (localStorage, gammel) | `journey.js` | `'1'` | Skrives ikke lenger | ingen | ingen | ingen | ingen | Fjernes (`removeItem`) ved hvert besøk | ingen | Opprydding av tidligere versjon |
| `sv-working-plan-v1` (sessionStorage) | `veileder-context.js`, `veileder-bridge.js` | Hele planen med beløp, modus, visning | Når brukeren klikker lenke til `spor.html`; deretter ved `pagehide` bare hvis nøkkelen finnes | Ved lasting av kalkulatoren uten `#` | Klikk til «Spør om sparing» | At planen er uendret ved retur | Fanen. Kan gjenopprettes av nettleseren | Tilbake til startskjermen, sletteknappen (i denne fanen) | Ingen | Vurderes som del av flyten |
| `sv-guidance-tab-v2` (sessionStorage) | `veileder-context.js`, `veileder-ui.js`, `veileder-bridge.js` | Alder, sparetid, risiko, buffer, dyr gjeld, inntekt, sparemåte, fastrente, boligeier, skatt (BSU), sparetid per tema. Ingen beløp, navn eller fritekst | Ved klikk til veilederen fra en startet plan; «Oppdater vurderingen» | I veilederen og ved retur | Klikk til veilederen eller «Oppdater vurderingen» | At du slipper å fylle inn det samme to ganger | Fanen. Kan gjenopprettes | «Glem opplysningene mine», sletteknappen | Ingen | Vurderes som del av flyten. Opplysningene sier noe om økonomien din |
| Utklippstavle | `experience.js`, `om.js`, `kontakt.js` | Delingslenke, Vipps-nummer, e-postadresse | Bare ved eget trykk på «Kopier» | ingen | Trykk | Å kopiere | Styres av operativsystemet | ingen | Ingen | Ikke vurdert som lagring etter § 3-15 |
| Nettleserens vanlige cache | Ikke egen kode | Sider, skript, bilder | Nettleseren | Nettleseren | Besøk | Raskere lasting | Styres av nettleser og serverens hoder | Nettleser | ingen | Ikke egendefinert datalagring. Serverens `Cache-Control` er ikke kontrollert |

### Hva som skjer før første brukerhandling

**Før rettingene (main `04eed8e`):** `sv-started` ble skrevet permanent ved åpning av en delt lenke. Veilederkonteksten og (hvis planen var startet) arbeidsplanen med beløp ble skrevet til sessionStorage ved hver `pagehide`, også uten tur til veilederen. `sv-level=simple` ble skrevet permanent ved «Vis spareplanen min» og «Se et eksempel».

**Etter rettingene (kodefunn):** Å åpne siden eller en delt lenke skriver ingenting. Siden **leser** `sv-scenarios` (localStorage), `sv-level`, `sv-color-theme`, `sv-started` (session) og `sv-working-plan-v1` (session) hvis de finnes, og den **sletter** de gamle nøklene `sv-started`, `sv-level` og `sv-color-theme` i localStorage uten å lese dem (en skriveoperasjon som bare fjerner). Lokal observasjon bekrefter at et første besøk og en delt lenke gir tomme lagringsområder (`tests/personvern-browser.cjs`, Chromium; Firefox og WebKit i CI).

Dette er ikke et argument for at lagring etter et trykk er lovlig. Det er en minimering.

## Husking av tema og nivå: vedtatt alternativ B

**Vedtatt av Lars 26.10.2026: alternativ B, husking bare i fanen (`sessionStorage`).** GPT anbefalte B. Hvorfor: det reduserer permanent lagring uten å fjerne funksjonen, og vi trenger ikke vente på Nkom for å velge mindre lagring.

Hva B betyr, og ikke betyr:
- Valget huskes når du går mellom sidene i samme fane. Det huskes ikke til neste besøk. Det følger ikke med til en helt ny, tom fane, men nettleseren kopierer det når en fane åpnes fra siden (lenke i ny fane, `window.open`) eller dupliseres. Rettet 27.10.2026; tidligere tekst sa at det aldri følger med til ny fane.
- Det er ikke garantert slettet når nettleseren lukkes. Nettlesere kan gjenopprette faner og dermed økten og valgene.
- Det avgjør ikke alene om § 3-15-unntaket gjelder. Spørsmålet står åpent hos Nkom.
- Gamle verdier fra tidligere besøk i `localStorage` leses ikke og fjernes. Brukere som hadde valgt Natt eller Avansert, må velge på nytt.

| Alternativ | Hva det betyr | Status |
|---|---|---|
| A. Permanent etter aktivt valg | `localStorage`, ingen utløpstid | Ikke valgt. Forutsetter at unntaket i § 3-15 holder |
| **B. Bare i fanen** | `sessionStorage` | **Valgt 26.10.2026** |
| C. Ingen husking | Standard hver gang (tema kan følge operativsystemet via `prefers-color-scheme`) | Ikke valgt. Mulig senere, hvis Nkom sier at heller ikke B holder |
| D. Samtykke | Egen boks | Bygges ikke før noe krever det |

Merk: henvendelsen til Nkom ble sendt før valget av B, men spør uttrykkelig også om `sessionStorage`. Svaret må leses mot at løsningen i PR #78 nå er B.

## Sletting og andre faner

Sletteknappen på `personvern.html` fjerner Spareverksteds nøkler i `localStorage` for hele nettstedet, men `sessionStorage` (arbeidsplan, veilederkontekst, nivå, tema) bare i fanen der knappen trykkes. Andre åpne faner beholder da sitt nivå og tema. Andre åpne faner beholder sin arbeidsplan og veilederkontekst i fanen og i minnet til de lukkes. Dette er ikke endret og lovet ikke annet. Lagrede planer kommer ikke tilbake: kalkulatoren lytter på `storage`-hendelsen og leser planene på nytt når de endres i en annen fane (`app.js`). Kontrollert i `tests/personvern-browser.cjs`.

Knappen: forklarer og krever bekreftelse når det finnes lagrede planer («kan ikke angres»), rører bare nøklene i listen (`personvern.js`), melder fra hvis noe ikke kunne slettes, og viser ingen knapp og en forklaring hvis nettleseren blokkerer lagring.

`localStorage` har ingen innebygd utløpstid, men nettleseren kan fjerne data. `sessionStorage` forsvinner vanligvis når fanen lukkes, men nettlesere som gjenoppretter faner kan gjenopprette den. Produkttekst lover derfor ikke sletting ved lukking.

## Delte lenker

Delen etter `#` sendes ikke i selve HTTP-forespørselen til nettstedet. Sidens skript leser den. Tjenester brukeren deler lenken gjennom (e-post, meldingsapper) kan se og lagre hele lenken. Vi skriver ikke at fragmentet «aldri» kan sendes.

## Lokal observasjon av PR-versjonen

Kjørt 25.10.2026 med `scripts/produksjonskontroll.cjs --local` (Chromium 153, ren profil, dist/ fra grenen, oppdiktede tall: 1 000 kr start, 500 og 750 kr per måned). Åtte trinn: første besøk, start, endre beløp/nivå/tema, lagre plan, gjenåpne, tur til veilederen med søk, personvernside med sletting, feilside.

- 64 forespørsler, alle til samme opprinnelse. Ingen til andre verter. Ingen forespørsler med annen metode enn GET. Ingen omdirigeringer. Ingen WebSocket.
- Ingen `Set-Cookie`. `context.cookies()` tom etter alle trinn.
- Lagring etter trinn: tom → `sv-started` (session) → `sv-level`, `sv-color-theme` (session) → `sv-scenarios` (local) → (veileder) `sv-working-plan-v1`, `sv-guidance-tab-v2` → tom etter sletting.

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

- Sidene publiseres med GitHub Pages (workflow-fil). Egendomenet går direkte til GitHub: DNS-oppslag (dns.google, gjengitt av Lars 28.10.2026) gir bare A-oppføringene 185.199.108.153, .109.153, .110.153 og .111.153, som er GitHub Pages. Sertifikatet er fra Let's Encrypt (kjede ISRG Root X1 → YR2), vist i Safari og Chrome. `www.spareverksted.no` er ikke kontrollert.
- GitHub skriver at besøkendes IP-adresse logges og lagres av sikkerhetshensyn, også for besøkende som ikke er logget inn ([What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)).
- GitHubs generelle personvernerklæring (ikrafttredelse 27. april 2026) nevner ikke Pages særskilt, oppgir ingen lagringstid for slike logger, oppgir GitHub, Inc. og GitHub B.V. som behandlingsansvarlige og viser til standard kontraktsklausuler og EU-US Data Privacy Framework for overføring ([GitHub General Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)). Ingen avtale mellom Lars og GitHub om databehandling er kjent. Roller avgjøres ut fra faktisk forhold og avtale, ikke ut av overskriften i en erklæring.
- Serverlogger: **ikke tilgjengelig**. Lagringstid er ikke gjettet. Spørsmål til GitHub Support ligger som usendt utkast.

## E-post

E-post til oss er en egen behandling. Se `docs/kontakt-epost.md`.

## Logg over henvendelser

Opplysningene er gitt av Lars og kontrollert mot sendte e-poster i Gmail av ChatGPT/Codex 26.10.2026. Originalene bevares privat. Private adresser, telefonnumre, signaturer, meldings-ID-er, sakslenker og skjermbilder skal ikke inn i repoet.

| Mottaker | Sendt | Status (26.10.2026) | Referanse |
|---|---|---|---|
| Domene.no | E-post 1, uendret fra utkastet (versjonen med rettingene 25.10.2026) | Mottak bekreftet 25.10.2026 kl. 23.58. 26.10.2026: to KI-svar mottatt (første mottaksvar, deretter et utfyllende svar fra «Anna KI»). Videresending til teamet bekreftet. De sentrale spørsmålene om videresending er fortsatt uavklarte. Venter på konkrete, etterprøvbare opplysninger om tjenesten og avtalevilkårene fra Domene.no. Et menneske som gjentar samme tekst, avklarer ingenting | Sak 39138152 |
| Nkom | E-post 2, uendret fra utkastet | Mottak bekreftet 26.10.2026 kl. 00.01. Venter på svar | Saksnummer ikke oppgitt i bekreftelsen |

Spørsmål som er sendt:
- **Domene.no (fem):** hvilken avtale eller vilkår som gjelder for videresending, og om den er en databehandleravtale; lagring i kø, retur og sikkerhetskopi og hvor lenge; e-postlogger og oppbevaring; hvor e-posten behandles og underleverandører; sletting og behandling utenfor EØS.
- **Nkom (tre, kontrollert mot sendt e-post):** tema og visningsnivå i localStorage etter aktivt valg, betydningen av at knappen ikke sier «husk ved senere besøk», og forskjellen ved sessionStorage; arbeidsplan med beløp og veilederopplysninger i sessionStorage ved tur til veilederen; uttrykkelig lagring av plan i localStorage uten innebygd utløpstid. Sendt tekst presiserer at foreslått løsning beskrives, ikke nødvendigvis publisert versjon. Ingen lagringstabell eller vedlegg er observert i den sendte meldingen.

Merk: Nkom-henvendelsen spør allerede om både localStorage og sessionStorage. Lars vedtok 26.10.2026 alternativ B (fane); PR #78 er endret deretter. Svaret må vurderes mot B og faktisk kodeversjon. Ingen ny e-post er sendt i denne gjennomgangen.

Konsekvens for personverninformasjonen: rolle og avtale for videresending er ikke dokumentert, og lagring av meldingsinnhold, logger og underleverandører er uavklart. `personvern.html` har dette som «Avklares» og skal ikke fylles ut med antakelser.

De reviderte utkastene (25.10.2026) er historikk, ikke ventende utsendinger. Ingen ny e-post trengs for presiseringene alene.

Ikke sendt: spørsmål til GitHub Support og til Datatilsynet. Utkast finnes hos Lars.

Svarene fra Domene.no 26.10.2026 er KI-generert (ordlyden er gjengitt av Lars). Det andre svaret er utfyllende. At det er KI-generert avgjør ikke alene hvilken rettslig betydning det kan ha. De tjenestespesifikke påstandene er ikke tilstrekkelig dokumentert med avtalehenvisninger og konkrete driftsopplysninger, og behandles derfor som uavklarte. Innholdet, slik det ble gjengitt:
- Domene AS oppgis som databehandler og domeneeieren som behandlingsansvarlig. Svaret sier ikke uttrykkelig at dette gjelder bare domenetjenesten; hvilken rolle Domene AS har ved e-postvideresending, er ikke besvart.
- Punkt 1.6: informasjon som sendes med e-post via tjenesten er ikke dekket av avtalen. Ansvaret for meldingsinnholdet ligger hos domeneeieren. Dette bekrefter Lars' tidligere gjengivelse og viser at denne avtalen ikke dekker meldingene. Det avgjør ikke hvilken rolle Domene AS har ved videresending, og viser ikke at ingen annen avtale finnes. Det er ikke dokumentert hvilken leverandørrolle Domene AS har ved e-postvideresending, eller hvilken avtale som dekker behandlingen. Dette er fortsatt uavklart.
- Generelle oppbevaringstider (3 år etter avsluttet kundeforhold, 5 år for fakturadata) gjelder kundeopplysninger, ikke meldingsinnhold. De er ikke våre sletterutiner og er ikke kopiert.
- Oppgitt: automatisk logging av tidspunkt, IP-adresse ved bruk av e-posttjenesten og web- og sikkerhetslogger, for drift og sikkerhet. Ikke kontrollert mot konkrete avtalevilkår eller driftsdokumentasjon.
- Oppgitt: deling bare når nødvendig for drift, med underleverandører bundet av samme regler, og aldri for markedsføring.
- Oppgitt: behandling utenfor EØS kan forekomme «ved internasjonale domenenavn», og data er da kryptert (TLS). Det svarer ikke på om e-postvideresendingen behandles utenfor EØS, og TLS alene er ikke et overføringsgrunnlag.
- Uspesifisert, ifølge svaret: hvor lenge meldingsinnhold lagres ved videresending, kø og sikkerhetskopier, nøyaktig innhold i e-postlogger og konkrete underleverandører for e-posttjenesten. Dette er dermed fortsatt de uavklarte punktene fra spørsmål 2, 3 og 4.

Hva logginnslagene betyr:
- Mottaksbekreftelsene er ikke faglige svar eller godkjenninger.
- De bekrefter ikke at aliasene for personvern og generell kontakt fungerer, med mindre henvendelsene ble sendt med disse som svaradresse. Mottakstest av begge aliasene gjenstår.
- Videresending til teamet hos Domene.no er bekreftet 26.10.2026. Neste steg er å avklare rollen og hvilke avtaler som faktisk gjelder. «Videresending uten avtale» godtas ikke som konklusjon før det er gjort. Eventuell annen e-postløsning vurderes etterpå.
- Endringer i løsningen som skyldes svar, skal føres inn her med dato og referanse. Alternativ B er valgt. Eventuell endring etter svaret krever en ny beslutning fra Lars.

## Åpne spørsmål for myndighetsveiledning

- Nkom (spørsmål sendt før valg av B, med både localStorage og sessionStorage): Er lagring av tema og visningsnivå i `localStorage` etter aktivt valg «strengt nødvendig for en tjeneste brukeren uttrykkelig har bedt om», eller bør det bare gjelde økten? Løsningen er nå B. Gjenstår: holder også fanelagring av valgene som unntak? Er en tur fra kalkulatoren til veiledningen i samme fane nok til at arbeidsplanen i `sessionStorage` faller inn under unntaket?
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

## Kontroll mot faktisk sendt e-post 26.10.2026

ChatGPT/Codex har lest de sendte henvendelsene til Finanstilsynet, Nkom, Domene.no og Uu-tilsynet samt tilgjengelige mottaksbekreftelser og svar i de identifiserte trådene. Bare korte oppsummeringer føres her; originaler og personopplysninger er utelatt.

- Finanstilsynet: sendt 25.10.2026. Automatisk mottaksbekreftelse samme dag; ingen faglig avklaring funnet i gjennomgåtte meldinger. Spørsmålene gjelder anbefalinger, tilpasning, regneeksempler, produktomtale og gratis drift. Prosjektpausen oppheves ikke.
- Nkom: sendt 25.10.2026 kl. 23.59 norsk tid. Tre spørsmål, inkludert eksplisitt lagring av plan. Loggen over er rettet fra det tidligere utkastet til faktisk sendt tekst. Tidligere oppgitt mottaksbekreftelse er brukeroppgitt og ikke selv lest i denne gjennomgangen.
- Domene.no: sendt 25.10.2026 kl. 23.57 norsk tid. Utfyllende svar mottatt samme kveld. Svaret avklarer ikke tjenestespesifikk lagringstid, kø, sikkerhetskopier og underleverandører for videresending. Generelle kundedatalagringstider skal ikke brukes som lagringstid for meldinger. Påstanden om videresending til teamet i tidligere logg er ikke selv bekreftet i de gjennomgåtte meldingene.
- Uu-tilsynet: sendt 25.10.2026. Automatisk registreringsbekreftelse lest; ingen faglig vurdering funnet i gjennomgåtte meldinger. Påstandene om gjennomført testing er opplysninger i henvendelsen, ikke nye testresultater fra denne kontrollen.

Støttede neste steg: Behold skillet mellom utkast, sendt melding, mottaksbekreftelse og faglig svar. Bevar åpne spørsmål om leverandørroller, avtaler og behandling. Kontotype, mottakstest og sletterutine kan ikke fastslås fra disse meldingene. Det er ikke sendt oppfølging, endret kontoinnstillinger, testet nettsted eller publisert kode i denne gjennomgangen.

## Personvernsiden skrevet som status per 27.10.2026

Lars bestemte 27.10.2026 at siden skal beskrive det som gjelder nå, og endres hvis svar fra Nkom, Domene.no eller andre krever det. De fem boksene merket «Avklares» i `dist/personvern.html` er derfor erstattet med vanlig tekst som sier hva vi vet, hva vi har spurt om og hva vi ikke vet. Ingen påstand om at åpne spørsmål er avklart.

Endringer:

- Roller: sier at GitHub, Domene.no og Google behandler opplysninger etter egne vilkår, og at ansvarsfordelingen ikke er klart besvart.
- Tema og nivå: sier at valget er fanelagring for å lagre minst mulig, at Nkom er spurt, og at løsningen endres hvis svaret krever det.
- E-post: legger til grunnlag (berettiget interesse, art. 6 nr. 1 f) og at e-post slettes på forespørsel. Sier at Domene.no-svaret ikke er konkret nok og at Google lagrer etter egne vilkår.
- GitHub: sier at lagringstid og sted ikke er oppgitt, at vi ikke kan se eller slette loggene, og at mulig mellomledd ikke er kontrollert.
- Rettigheter: sier at rettighetene i praksis gjelder e-post, at kalkulatortall bare finnes i nettleseren, og at GitHub-logger må tas med GitHub.

**Krever Lars' godkjenning før publisering:** behandlingsgrunnlaget for e-post og løftet om å slette e-post på forespørsel. Begge er fra forslaget i `docs/kontakt-epost.md`, ikke vedtatt rutine. Mottakstest av begge alias gjenstår fortsatt. Siden er fortsatt `noindex`.

Kontroller 27.10.2026 (lokalt, Chromium via Playwright 1.56.0): `personvern-browser`, `kontakt-browser`, `a11y-browser` og alle `*.test.cjs` består. Sjekket visuelt i 390 px bredde. Publisert side ikke kontrollert (egress-proxyen gir 403 mot spareverksted.no). Firefox og WebKit kjøres i CI.

Lars viste 27.10.2026 et skjermbilde av mottaksbekreftelsen fra Nkom, datert 26.10.2026, og teksten i den sendte henvendelsen. Den samsvarer med Nkom-raden i loggen over. Ingen ny henvendelse. Mottaksbekreftelsen er ikke et faglig svar.

Kontroll etter innspill fra GPT 27.10.2026:

- Lagringstabellen er sjekket mot koden på grenen. Samme seks nøkler, samme lagringstype. Én feil rettet: siden sa at én gammel nøkkel fjernes, koden fjerner tre (`sv-started`, `sv-level`, `sv-color-theme` i localStorage).
- Egen behandling og leverandørenes er nå skilt i første avsnitt under «Hvem er ansvarlig?».
- Nkom-avsnittet sier nå uttrykkelig at en henvendelse ikke betyr godkjenning. Ingen andre steder på siden omtaler godkjenning.
- Sletteformuleringen er myket opp. Utkast til interesseavveining ligger i `docs/kontakt-epost.md`.


## Gjennomlesing av Lars 27.10.2026 og rettinger

Lars leste PDF-utkastet og påpekte seks ting. Status:

1. **Tekst kuttet.** Ekte feil: felles `table{white-space:nowrap}` i `style.css` gjorde personverntabellen 1367 px bred i 390 px skjerm (sidelengs scrolling). Rettet med `white-space:normal` på `.privacy-table`. Kontrollert lokalt: ingen sidelengs scrolling i 320, 390 og 1280 px.
2. **«Ny fane» kan forveksles med menyvalgene på siden.** Endret til «nettleserfane» og lagt til en forklaring.
3. **Valg følger med mellom faner.** Lars observerte dette på publisert versjon (main), som fortsatt lagrer tema og nivå permanent i `localStorage`. Lokal test av PR-versjonen (Chromium): helt ny fane uten opphav får ikke valgene; fane åpnet med `window.open` fra siden får en kopi. Siden sa tidligere at valgene ikke følger med til ny fane. Det var for bastant og er rettet.
4. **Planer oppdateres mellom faner.** Riktig for lagrede planer (`localStorage`, `storage`-hendelse), både på main og i PR-en. Står nå uttrykkelig.
5. **«Vi mottar» e-post.** Endret til at det er Lars som mottar, leser, svarer og sletter.
6. **Åpen kode.** Lagt til avsnitt med lenke til kildekoden og testene, slik at påstandene kan etterprøves.

Lars opplyser også at han har slått av et statistikkverktøy i cPanel. Hvilket er ikke oppgitt. Det berører ikke besøkende på nettstedet, som ligger på GitHub Pages.

## Innspill fra GPT 27.10.2026 (etter lesing av fila og koden)

1. «De huskes ikke til neste besøk» var for absolutt, siden gjenopprettede faner kan ta med valgene. Endret til «med forbeholdene om faner over».
2. Slettestatusen sa «har ikke lagret noe i denne nettleseren nå», selv om andre faner kan ha fanelagring. Endret til «Ingen lagrede planer i denne nettleseren og ingen lagrede valg i denne fanen.» I tillegg (Claude): meldingen etter sletting nevner nå arbeidsplan, valg og veilederopplysninger i andre faner, ikke bare arbeidsplanen. `personvern.js` versjon 3.
3. Leverandøravsnittene: GPT påpeker at åpenhet om usikkerhet ikke avklarer forholdene. Enig. Står som videre arbeid, ikke publiseringssperre: konkrete svar om ansvar, lagringssted og slettetider fra GitHub, Domene.no (inkludert MailChannels) og Google bør erstatte «vi har spurt» etter hvert.

## Delingslenker kontrollert 28.10.2026

- `start` i lenken er startbeløpet, ikke alder. Alder (`userAge`) og risikovalg (`riskChosen`) holdes utenfor, sammen med `ageKnown`, `until67`, `stress`, `ageGroup` og `purpose`. Sikret i `veileder-browser.cjs` og nå `deling-browser.cjs`.
- Før endringen tok lenken med 52 verdier fra alle deler. Nå bare feltene for delen som deles (se BESLUTNINGER.md).
- Åpner du en delt lenke i samme fane som en plan du jobber med, erstattes arbeidsplanen i fanen uten beskjed. Lagrede planer røres ikke. Ikke endret; foreslått som egen sak.
- Nedlasting og utskrift inneholder alder hvis den er oppgitt. Står nå på personvernsiden.
- Første kontroll på publisert nettsted (Lars, iPhone, 28.10.2026): Safari («Personvernrapport: Ingen kontaktede sporere») og Brave («0 annonser og andre ekle ting blokkert»). Verktøyene kjenner igjen sporingstjenester fra kjente lister. Det bekrefter at ingen kjente sporere ble funnet, ikke at all trafikk er kontrollert. Nettverkstrafikk og HTTP-hoder på publisert side er fortsatt ikke målt.
- Personvernsiden: rettet «utskrifter», «Spareverksteds kode leser», «Jeg har ikke funnet opplysninger fra GitHub», og setningen om GitHub-logger under rettigheter (innspill fra GPT).
