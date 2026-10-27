# E-postkontakt: flyt, fakta og forslag

Utarbeidet av Claude på oppdrag fra Lars, 25. oktober 2026. Ikke juridisk vurdering. Dokumentet skiller bekreftede fakta, forslag og ukjente forhold. Privatadressen er bevisst ikke skrevet her eller andre steder i repoet.

E-post er en egen behandling. Den er adskilt fra tallene brukeren legger inn i kalkulatoren, som behandles lokalt i nettleseren. Vi påstår ikke at nettstedet sender kalkulatorverdier til oss. Vi påstår heller ikke at vi aldri mottar personopplysninger: den som skriver til oss, sender navn, adresse og innhold.

## Flyt

Avsender → Domene.no (videresending av personvern (at) og post (at) på spareverksted.no) → Gmail hos Lars → Lars svarer.

## Bekreftet av Lars (25.10.2026)

- Ansvarlig: Lars Kjelkenes Giæver, ingen egen virksomhet.
- Personvernhenvendelser: aliaset «personvern». Generelle henvendelser: aliaset «post».
- Begge videresendes hos Domene.no til Lars' private adresse.
- Mottak skjer i Gmail.

## Ikke bekreftet

- At testmelding til begge alias faktisk kommer fram. **Må bekreftes av Lars før publisering.** Vi sender ikke testmeldinger på hans vegne.
- Om Gmail-kontoen er Google Workspace eller en privat Google-konto. Ikke gjett ut fra at Gmail brukes.
- Om det finnes databehandleravtale med Google. For Workspace aksepteres Cloud Data Processing Addendum av administrator i Admin-konsollen (Konto > Kontoinnstillinger > Juridisk og sikkerhet > Tilleggsvilkår for sikkerhet og personvern) ([Google](https://support.google.com/a/answer/2888485)). Siden omtaler ikke private Google-kontoer. Lars må sjekke hvilken kontotype det er.
- Om Domene.no behandler videresendingen som databehandler. Domene.nos personvernerklæring ([domene.no/personvern.html](https://www.domene.no/personvern.html)) skal ifølge Lars' gjengivelse (punkt 1.6) si at informasjon publisert på nettsteder eller sendt med e-posttjenesten ikke omfattes av deres databehandleravtale. Vi har ikke klart å lese siden herfra. Punktet bekrefter da ikke en avtale for videresending. Rollen vurderes for hver behandling ut fra faktiske forhold, ikke av overskriften.
- Lagring i kø, retur (bounce), sikkerhetskopi og logger hos Domene.no, og hvor lenge. Et KI-svar fra Domene.no 26.10.2026 sier at dette ikke er spesifisert i de offentlige vilkårene, og at e-post sendt via tjenesten ikke er dekket av avtalen (punkt 1.6). At svaret er KI-generert avgjør ikke alene rettslig betydning. De konkrete drifts- og avtaleforholdene er fortsatt utilstrekkelig dokumentert. Se loggen i `docs/personvern-lagring.md`.
- Hvor e-post behandles og om underleverandører utenfor EØS er involvert.

## E-postadresser på nettsiden

- Knappene «Vis e-postadresse for personvern» og «… for generell kontakt» setter sammen adressen i nettleseren når brukeren trykker (`dist/kontakt.js`). Ingen ferdig adresse i HTML, `mailto`, `aria-label`, `data-`attributter eller metadata. Test sjekker dette.
- Dette gjør bare automatisk innhøsting litt vanskeligere. Det stopper ikke avanserte roboter, og vi påstår ikke det.
- Etter trykk vises adressen som markerbar tekst, `mailto`-lenke og knappen «Kopier e-postadresse». Kopiering skjer bare ved eget trykk. Hvis utklippstavlen er blokkert, markeres adressen. Fokus flyttes ikke. Valget lagres ikke. Ingen nettverkskall før brukerens e-postprogram åpnes.
- Uten JavaScript står det en forklaring om hvordan adressen kan skrives selv: bruker, tegnet at, og domenet `spareverksted.no`.

## Svar kan avsløre avsenderadressen

Videresending alene gir ingen garanti for at privatadressen er skjult. Et vanlig svar fra Gmail går fra Lars' adresse, og mottakeren ser den. Valgfri oppfølging, ikke bestilt: sette opp «Send som» fra Spareverksted-adressen i Gmail. Det krever egen avklaring og egen bestilling, og ligger ikke i denne PR-en.

## Forslag (ikke vedtatt rutine, ikke dokumentert fakta)

Alt nedenfor er et forslag Lars må ta stilling til.

| Punkt | Forslag |
|---|---|
| Formål | Svare på henvendelser om personvern og om siden, og dokumentere at forespørsler om rettigheter er besvart |
| Typer opplysninger | Avsenders e-postadresse og eventuelt navn, innholdet i meldingen, tidspunkt, vårt svar |
| Mulig rettslig grunnlag | Berettiget interesse (art. 6 nr. 1 bokstav f) for å besvare henvendelser. For rettighetsforespørsler kan plikten til å svare (bokstav c) være aktuell. Dette er et forslag som må vurderes, ikke en konklusjon. Vi hevder ikke at alle henvendelser krever samtykke |
| Sletting | Fast sletterutine må velges av Lars, for eksempel en bestemt tid etter at saken er avsluttet. Tallet er hans valg. Vi har ikke kopiert Domene.nos oppbevaringstider |
| Tilgang | Bare Lars. Ikke videresending til andre uten behov |
| Overføring | Ikke vurdert. TLS alene gir ikke et overføringsgrunnlag til tredjeland. Avhenger av svar fra Domene.no og kontotype hos Google |

## Hva som må skje før publisering

1. Lars bekrefter at testmelding til begge alias kommer fram.
2. Lars avklarer Google-kontotype og avtaleforhold.
3. Lars velger sletterutine og bekrefter eller endrer forslagene over.
4. Henvendelsen med fem spørsmål er sendt til Domene.no 25.10.2026, kontrollert mot Gmail 26.10.2026. Et utfyllende svar er mottatt, men avtalegrunnlag og tjenestespesifikke opplysninger om videresending gjenstår. Se loggen i `docs/personvern-lagring.md`.

## Gjennomgang 26.10.2026

Sendt henvendelse og tilgjengelig svar fra Domene.no er lest av ChatGPT/Codex. Originaler, privat kontaktinformasjon, meldings-ID-er og kundesakslenker er ikke kopiert til repoet. Forslagene om å avklare kontotype, faktisk leverandørrolle, avtaler og sletterutine støttes som videre avklaringspunkter. Ingen konkret oppbevaringstid er vedtatt i denne gjennomgangen. Ingen ny e-post, «Send som»-konfigurasjon eller annen kontoendring er utført.

## Utkast til interesseavveining for e-post (27.10.2026)

Skrevet av Claude. Ikke juridisk vurdering og ikke vedtatt. Lars må godkjenne før personvernsiden publiseres. Bygger på de tre trinnene i GDPR art. 6 nr. 1 bokstav f: berettiget interesse, nødvendighet og avveining.

1. **Interesse:** å kunne svare på spørsmål, feilmeldinger og tips om nettstedet, og å svare på forespørsler om personvern. Avsenderen har selv tatt kontakt og venter svar.
2. **Nødvendighet:** for å svare må vi lese meldingen og bruke avsenderadressen. Vi trenger ikke flere opplysninger enn avsenderen selv sender. Siden ber om at man ikke skriver mer om egen økonomi enn nødvendig. Meldinger brukes ikke til noe annet enn å svare.
3. **Avveining:** behandlingen er forventet av avsenderen, begrenset til det avsenderen selv sender, og leses bare av Lars. Det som trekker i motsatt retning: meldinger kan inneholde økonomiske opplysninger, de passerer Domene.no og Google, og vi har ikke fast slettefrist. Tiltak: oppfordring om å skrive lite om egen økonomi, sletting på forespørsel, og en fast slettefrist når Lars har valgt den.

**Godkjent av Lars 27.10.2026** (se BESLUTNINGER.md).

Foreløpig vurdering: grunnlaget virker egnet for vanlige henvendelser. Svar på forespørsler om rettigheter kan i tillegg bygge på plikten etter art. 12 til 22 (bokstav c), som ikke er vurdert her.

**Sletteformulering på siden:** endret 27.10.2026 etter innspill fra GPT. Den lover ikke lenger sletting uten unntak, og sier at kopier hos Domene.no og i Googles sikkerhetskopier ikke kan slettes av oss.

## Status for aliasene 27.10.2026

Lars opplyser at aliasene for personvern og generell kontakt ikke virker ennå. Årsaken er ikke undersøkt. Lars observerer at Domene.no ser ut til å bruke cPanel ([cPanel legal notices](https://www.cpanel.net/legal-notices/)). Han vurderer at cPanel er programvare hos leverandøren og ikke en egen part siden må nevne. Claude er enig i at programvare leverandøren bruker, normalt hører inn under leverandørens eget ansvar, men det er ikke kontrollert om cPanel som selskap får tilgang til meldinger. PR #78 publiseres ikke før begge alias er mottakstestet.

## Ny løsning 27.10.2026: egne e-postkasser, ingen videresending

Opplyst av Lars 27.10.2026, med skjermbilder av webmail-siden:

- Aliasene `personvern` og `post` er nå egne e-postkasser hos Domene.no. Ingen videresending.
- Lars bruker dem i Gmail-appen med IMAP og SMTP (SSL).
- E-posttjenesten hos Domene.no kjøres på cPanel. Webmailen er Roundcube 1.6.19 med flere cPanel-tillegg.
- Sending fra begge adressene virker. En testmelding til Lars' private adresse havnet i Googles søppelpostfilter.
- **Mottak er ikke bekreftet.** Svar sendt til spareverksted-adressene var ikke kommet fram da Lars sjekket. Ingen feilmelding.

Konsekvenser:

- Flyten over («Avsender → Domene.no → Gmail») er erstattet: avsender → e-postkasse hos Domene.no → Lars leser i Gmail-appen.
- Meldinger lagres nå i e-postkassen hos Domene.no, ikke bare i en kø. Sletting i e-postkassen er mulig for Lars; sikkerhetskopier hos Domene.no er ikke.
- **Ikke kontrollert:** om Gmail-appen henter e-post fra andre kontoer via Googles servere og lagrer kopier der. Personvernsiden sier derfor at Google «kan» behandle meldingene, ikke at de gjør det.
- Roundcube-listen viser et tillegg som heter `mixpanel_analytics`. Navnet tyder på bruksstatistikk fra webmailen til Mixpanel. Det gjelder trolig Lars' bruk av webmailen, ikke meldingsinnholdet, men det er ikke kontrollert. Det berører ikke besøkende på Spareverksted. Bruker Lars bare Gmail-appen, er det lite relevant.
- At testmeldingen havnet i søppelpost, tyder på at domenet mangler eller har ufullstendig SPF, DKIM eller DMARC. Det er ikke kontrollert. cPanel har vanligvis et verktøy for dette («Email Deliverability»). Betyr at svar fra Spareverksted kan havne i søppelpost hos mottakeren.

Før publisering av PR #78:

1. Bekreft mottak i begge e-postkassene, helst ved å se i webmailen direkte. Kommer meldingen fram der, men ikke i Gmail-appen, er feilen i appoppsettet. Kommer den ikke fram i webmailen, er feilen hos Domene.no eller i DNS (MX-oppføringen).
2. Sjekk e-postlevering (SPF, DKIM, DMARC) i cPanel.

## Mottak løst 27.10.2026

- Årsak: domenet hadde ingen MX-oppføring. Oppslag (dns.google, gjengitt av Lars) viste bare SOA fra `ns1.dnsdomene.net`, serie `2026102207`. Intern levering mellom kassene virket fordi tjeneren leverer lokalt uten DNS. Dette forklarer trolig også at den tidligere videresendingen ikke virket.
- Rettet av Lars i DNS hos Domene.no. Nytt oppslag viser MX `10 loke.domene.no`.
- Lars bekrefter etterpå at e-post sendt utenfra kom fram, også meldinger sendt før rettingen.
- Lars oppdaterte samtidig SSL-sertifikater i cPanel. Nettstedet ligger på GitHub Pages; sertifikater i cPanel gjelder e-post og webmail, ikke nettstedet, så lenge DNS for nettstedet peker til GitHub.
- Gjenstår, ikke sperre for publisering: SPF og DKIM via «Email Deliverability» i cPanel, så svar ikke havner i søppelpost.
