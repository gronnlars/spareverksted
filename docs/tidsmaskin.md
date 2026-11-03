# Tidsmaskin: historiske data

Tidsmaskinen (den historiske pengereisen) skal la brukeren kjøre sin egen plan gjennom faktisk historikk: renter, aksjer og prisvekst. Denne delen henter og lagrer dataene. Selve beregningen og grafen er ikke laget ennå.

## Hva som hentes

Kildene står i `kilder/historikk.json`.

| Kilde | Fil | Brukes til |
| --- | --- | --- |
| Norges Bank, Historical Monetary Statistics | `cpi.xlsx` | prisvekst før 1920, kontroll mot SSB |
| | `shortterm_ir.xlsx` | bankrente før 2013 |
| | `stockprices.xlsx` | «norske aksjer, illustrasjon» |
| | `bond_yields.xlsx`, `fx.xlsx`, boligpriser 1819 til 2023 | lagres for senere, ikke vurdert |
| Norges Bank, Datatorg | styringsrenten fra 1991 | rentenivå i forklaringer |
| SSB tabell 14709 | konsumprisindeks per måned fra 1920 | prisvekst og kjøpekraft |
| SSB tabell 11018 | renter på innskudd fra desember 2013 | bankrente og BSU-rente |

Oversiktssiden til Norges Bank leses først. Den gir gjeldende adresse og versjon (`?v=`) for hver fil, og varsler om filer som er nye eller borte.

## Vilkår

**Norges Bank.** E-post fra Norges Bank, DM IKT, til Lars 3.11.2026: bruken slik Lars beskrev den er i tråd med Norges Banks publiserte vilkår, forutsatt at

1. Norges Bank oppgis som kilde,
2. de opprinnelige dataseriene gjengis uendret,
3. egne beregninger og visualiseringer merkes tydelig som Spareverksteds egne.

Seriene på nettsidene er de mest oppdaterte versjonene. Varsler om nye publiseringer og API-endringer kan bestilles på https://www.norges-bank.no/Abonnement/ShowSubscriptions. Fra siden «Opphavsrett og ansvar» (lest av Lars 2.11.2026): ingen kommersielle formål, ingen frames.

E-posten oppbevares av Lars. Det er ikke avklart om aksjeseriene har egne tredjepartsvilkår.

**SSB.** CC BY 4.0. SSB oppgis som kilde.

## Slik følges vilkårene

- **Uendret:** hver fil lagres byte for byte i `research/historikk/<id>/`. SHA256 står i `register.json` og i `<fil>.meta.json`. `python3 scripts/tidsmaskin.py sjekk` (kjøres i CI) feiler hvis en lagret fil er endret, eller hvis det ligger andre filer i mappene.
- **Kilde:** `.meta.json` har kildetekst, adresse, versjon, hentetidspunkt og vilkår.
- **Egne beregninger:** gjøres i egen kode med egne filer, aldri ved å redigere rådata. Alt som vises på siden og er regnet ut, merkes «Spareverksteds beregning på data fra Norges Bank» (eller SSB).

## Kjøring

- Den 3. hver måned, eller manuelt under Actions → Tidsmaskin → Run workflow.
- Nye eller endrede filer kommer som PR. Uendrede filer skrives ikke på nytt, så det blir ingen PR uten grunn.
- `research/historikk/OVERSIKT.md` lages ved hver henting. Den viser ark, rader og de første radene i hver fil. Den brukes når seriene skal velges.

## Neste steg

1. Første kjøring: se gjennom PR-en og `OVERSIKT.md`.
2. Velg serier og kolonner til beregningen, med kontroll mot JST Macrohistory der det er mulig.
3. Beregning og graf etter planen i prosjektnotatet `historisk-pengereise-plan-2026-11-02.md`.

## Kommandoer

```
python3 scripts/tidsmaskin.py tilgang
python3 scripts/tidsmaskin.py hent [--kilde ID]
python3 scripts/tidsmaskin.py sjekk
python3 scripts/tidsmaskin.py oversikt
python3 tests/tidsmaskin.test.py
```
