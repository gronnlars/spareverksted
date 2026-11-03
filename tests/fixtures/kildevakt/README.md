# Testdata for Kildevakt

Testene i `tests/kildevakt.test.py` bruker ikke nett. Opphavet til hver fil:

| Fil | Opphav |
| --- | --- |
| `skatteetaten-ips-2026-10-30.html` | Ekte. Skatteetatens IPS-side, hentet uendret 30.10.2026 av GPT/Codex-kildeprøven (`IPS-kildeprove-v3`). |
| `lovdata-list-2026-10-30.json` | Ekte. Lovdatas liste over åpne datasett, 30.10.2026 (NLOD 2.0). |
| `skatteloven-utdrag.xml` | Utdrag av ekte fil. Dokumenthodet og § 16-10 og § 6-47 fra skatteloven i Lovdatas datasett «gjeldende lover», 30.10.2026. Resten av loven er fjernet. |
| `ssb-11018-syntetisk.json` | **Syntetisk.** Samme oppbygning som SSBs json-stat2. Tallene er avlest via WebFetch 3.11.2026 og fra `research/bsu-rentehistorikk.csv`. Ikke-bundne innskudd før august 2026 er satt til `null`. Byttes ut med et ekte svar fra første kjøring i GitHub Actions. |

Testene lager også små syntetiske svar for Skatteetatens BSU-side, Lovtidend, Stortinget og Norges Bank. De sjekker logikken, ikke formatet hos kilden. Formatet sjekkes ved første ekte kjøring.
