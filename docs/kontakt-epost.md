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
- Lagring i kø, retur (bounce), sikkerhetskopi og logger hos Domene.no, og hvor lenge.
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
4. Svar fra Domene.no er ønskelig. Usendt utkast med fem spørsmål ligger hos Lars.
