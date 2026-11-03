# Kildevakt og faktaregisteret

Tre deler som henger sammen:

1. **Faktaregisteret** (`kilder/fakta/*.json`): ett sted for hvert tall som står i svar og kalkulator. Hvert tall har kilde, status og en dato det gjelder fra. Én fil per tema (`bsu.json`, `ips.json`, `generelt.json`, `ssb-renter.json`). Nye temaer får egen fil.
2. **Begrepsregisteret** (`kilder/begreper/*.json`): faste forklaringer av fagord (ordbok-setninger). Samme setning vises der ordet er merket, og hentes inn i svar med `{{begrep:ID}}`.
3. **Kildevakt** (`scripts/kildevakt.py`): sjekker kildene hver hverdag, sammenligner med registeret og forrige henting, og åpner saker. Nye SSB-måneder blir en PR.

Felles kontrolldato og kildeadresser ligger i `kilder/register.json`. `python3 scripts/fakta.py` lager `dist/veileder-facts.js` og `dist/begreper.js` fra registeret. De to filene skal aldri redigeres for hånd.

Kildevakt retter aldri tall på nettsiden. Alt går som PR til Lars.

## Slik endrer du et tall

### Ny regel fra 1. januar eller 1. juli

Eksempel: Stortinget har vedtatt at BSU-grensen blir 30 000 kroner fra 1. januar 2027.

```json
"bsuAnnual": {"type": "regel", "enhet": "kr", "kilde": "tax-bsu", "bekreftet_til": "2027-12-31",
  "verdier": [
    {"verdi": 27500, "fra": "2026-01-01", "status": "i kraft"},
    {"verdi": 30000, "fra": "2027-01-01", "status": "vedtatt", "kilde": "Lovtidend LTI/lov/2026-12-20-99"}
  ]}
```

Kjør `python3 scripts/fakta.py` og lag PR. Nettsiden viser 27 500 til og med 31. desember og 30 000 fra 1. januar. Datoen leses i brukerens nettleser, så ingen må publisere på nyttårsaften.

- `vedtatt` og `i kraft` brukes på nettsiden fra datoen i `fra`. En vedtatt verdi må ha sin egen `kilde`.
- `foreslått` kan stå i registeret som påminnelse, men vises aldri (KILDEREGLER K4). Overgangen til `vedtatt` er en bevisst redigering etter at primærkilden er lest.
- `bekreftet_til` sier hvor lenge tallet er kontrollert. 75 dager før 1. januar og 1. juli åpner Kildevakt saken «Klar for 1. januar …?» med alle regler som ikke er bekreftet over fristen.
- Tester som sjekker selve tallet (for eksempel `assert.match(…, /27 500/)`) må oppdateres i samme PR. `python3 scripts/fakta.py steder bsuAnnual` viser hvor. Ellers feiler testene den dagen den nye verdien gjelder.

### Ny SSB-måned

Gjør ingenting. Kildevakt lager en PR med nye tall i `research/bsu-rentehistorikk.csv`, årssnittene, `kilder/fakta/ssb-renter.json`, `dist/veileder-facts.js`, `dist/bsu-rates.js` og `?v=` i HTML. Godkjenn eller avvis.

PR-er laget av GitHub Actions starter ikke CI av seg selv. Lukk og åpne PR-en igjen for å kjøre hele testpakken. Kildevakt kjører de viktigste testene før den lager PR-en.

### Tall og forklaringer i tekst

Skriv aldri tallet eller forklaringen direkte. Bruk plassholdere:

| Skriv | Blir |
| --- | --- |
| `{{bsuAnnual}}` | 27 500 |
| `{{bsuRate}}` | 5,61 |
| `{{bsuRate.periode}}` | august 2026 |
| `{{bsuRate.hentet}}` | 28. oktober 2026 |
| `{{begrep:kjopekraft}}` | Kjøpekraft er hvor mye du kan kjøpe for pengene. |
| `{{begrep:kjopekraft.utdyping}}` | Når prisene stiger, rekker det samme kronebeløpet til mindre. |
| `{{begrep:kjopekraft.ord}}` | Kjøpekraft |

For å vise forklaringen i en boks der ordet står, merk ordet: `<span data-begrep="kjopekraft">kjøpekraft</span>`.

Et nytt begrep legges i en fil under `kilder/begreper/` og følger reglene i SPRAKREGLER.md, «Ordbok-setningen». En ordbok-setning kan ikke inneholde tall eller plassholdere, så den gjelder også når satsene endres.

`python3 scripts/fakta.py --check` (kjøres i CI) stopper tre ting:

- et tall eller en ordbok-setning fra registeret som står skrevet direkte i `dist/`,
- en plassholder som ikke finnes, for eksempel `{{bsuAnual}}`. Uten kontrollen ville svaret ikke vist seg i nettleseren,
- et unntak som ikke lenger treffer noe.

**Unntak gjelder én linje.** Står det samme tallet et sted med en annen betydning, legg et unntak på faktumet:

```json
"tillatt": [{"fil": "dist/app.js", "tekst": "et unikt stykke av linjen", "grunn": "eksempeltall, ikke BSU-grensen"}]
```

Bare linjer i den fila som inneholder `tekst`, er unntatt. En ny kopi andre steder i samme fil blir fortsatt funnet. Små tall som 10 eller 33 sjekkes bare i faste uttrykk (`mønstre`), som «fyller 33».

I JavaScript: `SpareFacts.value('savingsRate')`, `SpareFacts.text('bsuAnnual')`, `SpareFacts.term('kjopekraft')`, `SpareFacts.expand('… {{bsuAnnual}} …')` og `SpareFacts.upcoming('bsuAnnual')` (neste vedtatte verdi, til et varsel som «Fra 1. januar 2027»).

### Når registeret vokser

- Ny fil under `kilder/fakta/` eller `kilder/begreper/` blir lest automatisk. Samme ID i to filer stoppes.
- Kildevakt skriver SSB-tall tilbake til fila tallet står i.
- Kontrollen leser hver fil én gang med ett samlet søk. Testen `stort_register_kontrolleres_raskt` sjekker 1 500 tall, 200 begreper og 300 filer på under ett sekund. Tall slås opp som hele tall, så «300 000» inne i «1 300 000» er ikke et treff.
- Alle fakta og begreper ligger i `dist/veileder-facts.js`. Blir fila stor (over 100 kB), bør den deles per side. Det er ikke gjort ennå.

## Hva Kildevakt følger

Se `kilder/kildeliste.json`. Kildene er ordnet etter «lovstigen», så vi får beskjed før reglene trer i kraft:

| Trinn | Kilde | Varsler når |
| --- | --- | --- |
| 1 og 2. Forslag og vedtak | Stortingets API | ny sak eller ny status om BSU, IPS, ASK, skatteloven eller «Skatter, avgifter og toll» |
| 3 Kunngjort | Norsk Lovtidend avd. I (Lovdata) | nytt dokument som endrer skatteloven eller skatteforskriften, med dato for ikrafttredelse |
| 4 I kraft | Gjeldende lover og forskrifter (Lovdata) | teksten i § 16-10 (BSU) eller § 6-47 (IPS) endres |
| 5 Etaten | Skatteetaten | nøkkeltall på siden avviker fra registeret, teksten endres, eller neste års satsside dukker opp |
| Statistikk | SSB tabell 11018, Norges Bank | ny måned, revisjon, strukturendring eller ny styringsrente |

## Støy

- Én åpen sak per kilde (etikett `kildevakt`). Nye funn blir kommentarer.
- Nettsider sammenlignes på hovedtekst, ikke hele HTML-en. Avvik i nøkkeltall varsles én gang.
- SSB: bare verdier teller. Ny `updated` alene gir ingenting.
- Lovdata: pakken lastes bare ned når `lastModified` er endret. Bare fulgte paragrafer teller.
- Første kjøring lager grunnlinje uten saker, unntatt kunngjorte endringer som ikke er i kraft ennå.
- Hentefeil blir sak først etter tre på rad, samlet i «Kildevakt drift».
- `info` (for eksempel bekreftet manuell kontroll) står bare i sammendraget for kjøringen.

## Rådata

Tilstand og rådata ligger på grenen `kildedata`, ikke på main, så lagringen starter ikke publisering. Rådata lagres byte for byte slik kilden sendte dem, med `.meta.json` ved siden av (kilde, URL, hentetidspunkt, SHA256, lisens). Avledede tall ligger i `siste.json`. Det følger Norges Banks vilkår (kilde oppgis, innholdet endres ikke), SSBs CC BY 4.0 og Lovdatas og Stortingets NLOD 2.0. Store Lovdata-pakker lagres ikke, bare det fulgte dokumentet når det endres. Hver kjøring lastes også opp som Actions-artefakt i 90 dager.

## Innstillinger i GitHub

- **Settings → Actions → General → Workflow permissions:** «Allow GitHub Actions to create and approve pull requests» må være på for SSB-PR-er. Ellers ligger grenen klar, og saken sier fra.
- GitHub slår av planlagte kjøringer etter 60 dager uten aktivitet i repoet. Kildevakt committer til `kildedata`, men det er ikke bekreftet at det teller. Start manuelt under Actions → Kildevakt → Run workflow om den har stoppet.

## Kommandoer

```
python3 scripts/fakta.py                 # generer dist/veileder-facts.js og dist/begreper.js
python3 scripts/fakta.py --check         # kontroll (CI)
python3 scripts/fakta.py steder ID       # alle steder et tall står (begrep:ID for begreper)
python3 scripts/fakta.py frister         # regler som må bekreftes før neste frist
python3 scripts/kildevakt.py tilgang     # HTTP-status mot kildene
python3 scripts/kildevakt.py kjør --tilstand DIR --rapport rapport.json
python3 scripts/kildevakt.py varsle --rapport rapport.json --tørrkjør
python3 scripts/kildevakt.py oppdater-ssb --tilstand DIR
python3 tests/fakta.test.py              # tester av registeret
python3 tests/kildevakt.test.py          # tester av Kildevakt, uten nett
```

## Ikke testet mot ekte kilder ennå

Alt er testet med lagrede eller syntetiske svar (se `tests/fixtures/kildevakt/README.md`). Første kjøring i Actions avgjør om disse stemmer med virkeligheten:

- SSB json-stat2 for tabell 11018 (testdataene er syntetiske).
- Skatteetatens BSU-side: mønstrene bygger på ordlyd lest 3.11.2026, ikke en lagret side.
- Hvordan neste års satsside oppfører seg før den er publisert.
- Lovtidend-pakkens dokumentformat, Stortingets JSON og Norges Banks SDMX-JSON.
