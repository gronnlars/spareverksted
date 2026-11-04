# Separat gjentakelse av klarspråkgrunnmålingen

Status: klargjort oppgave, ikke gjennomført. Opprettet 4. november 2026 etter innspill til PR #215. Dette er en avgrenset teknisk kontroll, ikke et nytt innholdsoppdrag eller fullmakt til sammenslåing.

## Mål og arbeidsgrunnlag

Kontroller om rapporten i gronnlars/spareverksted, PR #215, faktisk kan gjentas, og om tellingen er riktig på et lite utvalg. Gjør kontrollen i en separat økt uten å bruke forfatterens «OK» som bevis. Oppgi hvem eller hvilket verktøy som kontrollerte. En ny KI-økt er ikke en uavhengig menneskelig fagkontroll.

Fryst utgangspunkt: rapport og måleverktøy fra commit `2c46bafcdd7224daebb710c1ae19f2b93d573345`. Målt nettstedskilde: `5fd6650517bf605444350f24b0c1fb3ca4ba4d81`. Filer: `scripts/klarsprak.py`, `scripts/klarsprak-svar.cjs`, `docs/klarsprak/ordliste.json`, `docs/klarsprak/grunnmaling.json` og `docs/klarsprak.md`. Les ferske AGENTS.md, SPRAKREGLER.md, KLARSPRAK.md og KILDEREGLER.md før arbeid. Ikke skriv over main eller den eksisterende PR-grenen.

## Gjennomføring

Fra en oppdatert lokal git-kopi, bruk egne tomme mapper for arbeidskopi og utpakket nettsted. Stiene under er eksempler. Velg andre hvis de finnes fra før.

```sh
git fetch origin
git worktree add --detach /tmp/klarsprak-separat-arbeid 2c46bafcdd7224daebb710c1ae19f2b93d573345
mkdir /tmp/klarsprak-separat-nettsted
git archive 5fd6650517bf605444350f24b0c1fb3ca4ba4d81 | tar -x -C /tmp/klarsprak-separat-nettsted
cd /tmp/klarsprak-separat-arbeid
python3 tests/klarsprak.test.py
python3 scripts/klarsprak.py --root /tmp/klarsprak-separat-nettsted --verify-baseline --output /tmp/klarsprak-separat-resultat
```

Forventninger for den fryste versjonen: 20 tester består, identisk grunnmåling, 6 667 ordforekomster i forklaringer, sju HTML-sider og tre publiserte svar, 73 målegrupper og LIX for 21 av dem. Det er 185 forslag, ikke 185 bekreftede feil. Den nyere PR-versjonen har flere rapporttester, uten endret historisk grunnmåling.

Kontroller også følgende uten å stole på programmets kategorisering:

| Tilfelle | Kontroll og forventet resultat |
| --- | --- |
| Ordet «tilgjengelighet» i den fryste HTML-kopien | Tell bare ordet i tekstnoder, ikke filnavn, attributter eller JSON-funn. Åtte i forklaringer, elleve i navigasjon, én i overskrift og én i dokumenthodet. Kontroller hver plassering. |
| `<p>Du kan f.eks. spare 10 000 kr. Renten er 2,5 %.</p>` | To setningsenheter. Forkortelsen, tallet og desimaltegnet skal ikke gi ekstra setninger. |
| `<p>Forklaring</p><button>Tilgjengelighet</button><p hidden>Tilgjengelighet</p>` | Bare «Forklaring» inngår i LIX. Knappeordet og skjult ord telles i hver sin kategori. |
| 120 ord, seks setninger, 30 ord over seks bokstaver | Regn for hånd: LIX = 120/6 + 100 × 30/120 = 45. |
| Publiseringsutvalget | Bare de tre svarene i den fryste publiseringslisten inngår. Søkeord, utkast og regexer skal ikke være forklaringer. |
| BSU, `/parts/1/text` | Kontroller setningen på 34 ord manuelt og om meningen bevares. Ikke skriv den om i denne oppgaven. |

Å kopiere JSON og få lik SHA er nødvendig for reproduksjon, men beviser ikke at parseren har valgt riktig tekst. Den manuelle stikkprøven er derfor en egen del av oppgaven. For hver uenighet: oppgi fil, linje, originaltekst, forventet telling/kategori, faktisk resultat og konsekvens for rapporten.

## Leveranse

Lag et kort kontrollnotat med commit-er, kommandoer, versjoner, utførte stikkprøver, avvik og avgrensning. Skill identisk reproduksjon fra metodefeil og fra ukjent brukerforståelse. Ingen omskriving, ny definisjon, terskelendring, sammenslåing eller publisering inngår. Faktiske feil meldes med konkrete moteksempler og repareres i en avgrenset oppfølging av PR #215.
