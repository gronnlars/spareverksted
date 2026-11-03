# Kildevakt og faktaregisteret

To deler som henger sammen:

1. **Faktaregisteret** (`kilder/fakta.json`): ett sted for hvert tall som står i svar og kalkulator. Hvert tall har kilde, status og en dato det gjelder fra.
2. **Kildevakt** (`scripts/kildevakt.py`): sjekker kildene hver hverdag, sammenligner med registeret og forrige henting, og åpner saker. Nye SSB-måneder blir en PR.

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

Gjør ingenting. Kildevakt lager en PR med nye tall i `research/bsu-rentehistorikk.csv`, årssnittene, `kilder/fakta.json`, `dist/veileder-facts.js`, `dist/bsu-rates.js` og `?v=` i HTML. Godkjenn eller avvis.

PR-er laget av GitHub Actions starter ikke CI av seg selv. Lukk og åpne PR-en igjen for å kjøre hele testpakken. Kildevakt kjører de viktigste testene før den lager PR-en.

### Tall i tekst

Skriv aldri tallet direkte. Bruk plassholdere:

| Skriv | Blir |
| --- | --- |
| `{{bsuAnnual}}` | 27 500 |
| `{{bsuRate}}` | 5,61 |
| `{{bsuRate.periode}}` | august 2026 |
| `{{bsuRate.hentet}}` | 28. oktober 2026 |

`python3 scripts/fakta.py --check` (kjøres i CI) feiler hvis et tall fra registeret står hardkodet i `dist/`. Det er slik vi vet at alle steder blir rettet. Trengs et unntak, legg filen i `tillatt` på faktumet med en grunn.

I JavaScript: `SpareFacts.value('savingsRate')`, `SpareFacts.text('bsuAnnual')`, `SpareFacts.expand('… {{bsuAnnual}} …')` og `SpareFacts.upcoming('bsuAnnual')` (neste vedtatte verdi, til et varsel som «Fra 1. januar 2027»).

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
python3 scripts/fakta.py                 # generer dist/veileder-facts.js
python3 scripts/fakta.py --check         # kontroll (CI)
python3 scripts/fakta.py steder ID       # alle steder et tall står
python3 scripts/fakta.py frister         # regler som må bekreftes før neste frist
python3 scripts/kildevakt.py tilgang     # HTTP-status mot kildene
python3 scripts/kildevakt.py kjør --tilstand DIR --rapport rapport.json
python3 scripts/kildevakt.py varsle --rapport rapport.json --tørrkjør
python3 scripts/kildevakt.py oppdater-ssb --tilstand DIR
python3 tests/kildevakt.test.py          # tester uten nett
```

## Ikke testet mot ekte kilder ennå

Alt er testet med lagrede eller syntetiske svar (se `tests/fixtures/kildevakt/README.md`). Første kjøring i Actions avgjør om disse stemmer med virkeligheten:

- SSB json-stat2 for tabell 11018 (testdataene er syntetiske).
- Skatteetatens BSU-side: mønstrene bygger på ordlyd lest 3.11.2026, ikke en lagret side.
- Hvordan neste års satsside oppfører seg før den er publisert.
- Lovtidend-pakkens dokumentformat, Stortingets JSON og Norges Banks SDMX-JSON.
