# Kildegjennomgang 25.10.2026

Gjennomgang av alle kilder i `dist/` mot KILDEREGLER.md (K1 til K7, slik reglene står i PR #71).
Metode: automatisk uttrekk fra `veileder-knowledge.js`, `veileder-engine.js` og `veileder-facts.js`, pluss gjennomlesing av `assumptions.js` og `guidance.js`.
Begrensning: jeg kan ikke åpne Skatteetaten eller SSB fra arbeidsmiljøet. Derfor er ikke påstandene i teksten kontrollert mot siden på nytt i dag. Det som ikke er kontrollert, står som åpent.

## Samlet vurdering

Ingen kilder på nivå 4 eller 5. Alle faktatall (14 stk) peker til nivå 1, bortsett fra `fundMinYears` som er en anbefaling fra Forbrukerrådet (nivå 2) og er merket slik. Hovedproblemene er manglende datoer og én engelsk side.

## Avvik

| # | Regel | Hvor | Avvik | Alvor | Tiltak | Eier |
|---|---|---|---|---|---|---|
| 1 | K2 norsk versjon | `q-fondskonto`, kilden «tax-fondskonto-rettledning» | Engelsk Skatteetaten-side (`/en/…`). Norsk side finnes trolig, men er ikke funnet og verifisert. | Middels | Finn norsk side på skatteetaten.no, bytt lenke, kontroller at «revidert oktober 2025» stemmer på den. Inntil videre står sidetittelen som «engelsk side», så avviket er synlig. | ChatGPT (oppgave I), Lars godkjenner |
| 2 | K3 kildens dato og vår kontrolldato | `q-bsu-basics`, `q-ips-ask`, `q-ask-zero`, `q-kjopekraft` | Ingen forbehold-tekst om at siden mangler dato eller hva kildens dato er. Kontrolldato finnes i `checked` (22. og 24.10.), men vises ikke som tekst. | Middels | Legg inn `caveat` som i `q-aksjesparekonto`: kilde-dato eller «oppgir ingen dato», og «Kontrollert mot siden <dato>». Krever at noen leser sidene. | ChatGPT (oppgave H) |
| 3 | K3 | `q-aksjesparekonto`, `q-fondskonto` | Kontrolldato 24.10. og kilden oppgir ingen dato. Dette er korrekt oppgitt, men to av tre sider i `q-fondskonto` har ingen kildedato. | Lav | Behold. Ta med i neste kontrollrunde. | ChatGPT |
| 4 | K2 duplikater | `veileder-knowledge.js`: `ask` og `askNo`, `zeroTax` og `fondNo` | Samme side med to lenker (`/nn/…` og uten prefiks, ulik skråstrek i slutten). Kan gi to like kilder i listen og tvil om hvilken som er kontrollert. | Lav | Samle til én konstant per side og bruk den norske bokmålslenken. Må sjekkes at lenken virker før bytte. | ChatGPT |
| 5 | K2 nivå | `q-fondskonto`, Nordnet FAQ | Nivå 3 med salgsinteresse. Brukt bare til å vise hva produktet kalles og hvordan Nordnet beskriver det. Teksten sier det («ikke som anbefaling»). | Ingen | Greit. Notert som eksempel på riktig bruk. | |
| 6 | K2 nivå | `q-sparing-investering`, Bankenes sikringsfond | Avklart 25.10.2026 av Lars. Teksten oppgir ingen sum, og Finanstilsynet (nivå 1) dekker sikringsordningene i samme svar. Regjeringen (nivå 1, oppdatert 11.11.2024) bekrefter 2 millioner kroner per innskyter per bank og at finansforetaksloven regulerer ordningen. | Lukket | Sikringsfondet står som «les mer» ved siden av offentlig kilde. Ingen endring i `dist/`. K2 får setning om at lov eller departement er hovedkilde når regelen er lovfestet. Lovdata er ikke åpnet. | Lars (K2-setning i #71) |
| 7 | K1 | Alle svar | Jeg har ikke i dag lest sidene på nytt for å sjekke at hver setning er dekket. Det gjelder særlig påstander med tall (BSU 2026, IPS-grenser). | Middels | Ukentlig kontrollrunde etter K7. Andre leser enn forfatteren. | ChatGPT og Lars |
| 8 | K1 | Veileder: BSU, arveavgift, forskudd på arv | Norske Skatteetaten-sider for BSU (flere BSU-typer?) og arveavgift er ikke lest av meg. Engelske sider ble brukt tidligere. | Middels | Les norsk side, bekreft tall og inntektsår. Forskudd på arv er ikke dekket i det hele tatt, og skal ikke besvares før kilde finnes. | ChatGPT (oppgave I) |
| 9 | K6 | `q-indeksfond`, `q-sparing-investering` | «Neste kildekontroll senest 25. januar 2027» står i teksten. Det er en dato som går ut av tid og blir stående til neste redigering. | Lav | Behold til K6-valget (A eller B) er tatt. Flytt til felt `nesteKontroll` etter oppgave H. | Claude |
| 10 | Lenker | Alle | Lenkene er ikke testet for liv i dag. | Lav | La CI-oppgaven i issue #70 sjekke statuskoder, og logg treff. | ChatGPT |

## Ikke funnet som avvik

- Temakildene (11 stk): åtte på nivå 1 og tre fra Forbrukerrådet (nivå 2). Ingen engelske lenker.
- Fakta: alle har `year` 2026 og `checked` 2026-10-22, som testene krever.
- `assumptions.js`: SSB 11018 har `updated` og `checked`. Forbrukerrådet-kilden for sparehorisont har `checked` 25.10.2026 (avvik fra frysen er logget i BESLUTNINGER.md, utløper 31.01.2027).
- Ingen kilde på nivå 5.

## Hva jeg har rettet nå

Ingenting i `dist/`. Alt som kunne rettes uten å lese sidene på nytt, er enten allerede i orden eller krever at noen leser kilden. Å gjette datoer ville brutt K1. Derfor er avvikene lagt som oppgaver i stedet, og siden er ikke endret (ingen `?v=`-bump nødvendig).

## Oppgaver videre

1. Avvik 1, 2, 8: ChatGPT leser norske sider og foreslår endringer i egen PR. Lars godkjenner.
2. Avvik 6: Lars bestemmer nivå for Bankenes sikringsfond.
3. Avvik 4 og 10: små ryddeoppgaver, kan gjøres etter at #65 og #66 er slått sammen.
