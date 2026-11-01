# Svarstruktur for forklaringer (UU), med ASK som utfylt eksempel

Til GPT/Codex. Skrevet av Claude 28.10.2026 for Lars. Gjelder forklaringer (`kind: "explainer"`, `layout: "overview"`) i `dist/veileder-knowledge.js`.

**Referanse:** BSU-svaret `q-bsu-basics` på grenen `fix/bsu-kildekontroll` (PR #101, bygger på #100). Les også `SVARMAL.md` på samme gren. Main (1082c4f) har ikke denne strukturen ennå. Bygg derfor på #101-grenen, ikke på main.

## 1. Slik blir feltene til HTML

Du skriver bare data. `dist/veileder-ui.js` lager all HTML og alle faste overskrifter. Rekkefølgen på skjermen er fast:

| Felt | Blir til | Merknad |
| --- | --- | --- |
| `title` | `h2` i svarpanelet | Spørsmålsform, uten punktum |
| `intro` | `p.answer-lead` | Kortsvaret. Nødvendig forbehold, for eksempel risiko, skal stå her |
| `checked` | «Sist sjekket: …» | ISO-dato, `"2026-10-28"` |
| `caveat` | `p.answer-caveat` | **Utelates** når forbeholdet alt står i `intro`. Avgrensning legges i `review` |
| `tradeoffs.pros` / `cons` | `h3` «Fordeler og ulemper», to `details` med «Fordeler (n)» og «Ulemper (n)», `ul` > `li` > `strong` (tittel) + `p` (tekst) | Fritt antall, ingen kunstig likhet |
| `example` | `section` med `h3` (tittel) + én `p` | Valgfritt. Brukes når det forklarer mer enn teksten |
| `parts[]` | inne i `details` «Fordypning», hver del er `section` med `h3` + én `p` | Valgfri `table`, se punkt 3 |
| `terms[]` | `dl` i Fordypning, bare når lista ikke er tom | La stå `[]` når fagord forklares i teksten |
| `sources[]` | `details` «Kilder og kontrollgrunnlag», `ul` med lenker som åpnes i ny fane | |
| `review.text` | nestet `details` «Om kildekontrollen» | Kildedato eller regelår, lesedato, «egenkontroll», avgrensning og neste kontroll |

## 2. UU-regler for teksten

1. **Ingen egne overskrifter, lister eller linjeskift i tekstfeltene.** Hvert `text` blir én `<p>`. Markdown, `\n`, kulepunkter og `**` vises som rå tegn.
2. **Titler** på fordeler, ulemper, eksempel og deler skal være korte, unike i svaret og uten punktum. De er det skjermleseren hopper mellom.
3. **Fagord forklares i vanlig tekst der de først brukes.** Det gjelder for eksempel skjermingsfradrag, hjemmehørende og skattemessig kontinuitet. Ingen skjult skjermlesertekst og ingen egen ordliste for å fylle malen.
4. **Lenketitler beskriver målet**, med avsender først: «Skatteetaten: …». Ikke «les mer» eller «her». Ta med år i tittelen når siden gjelder et bestemt år.
5. **Tall skrives med mellomrom som tusenskille og «kr»** i løpende tekst: «100 000 kr». Prosent skrives med komma og ordet «prosent»: «37,84 prosent».
6. **Ingen tankestreker** (– —) og ingen identiske setninger på seks ord eller mer i samme svar. `tests/svartekst.test.cjs` stopper det siste.
7. **Ett hovedsted per poeng** (SVARMAL). Det som står i fordeler eller ulemper, gjentas ikke i Fordypning.

## 3. Tabeller (som BSU-årstabellen)

Lag bare tabell når tallene er data, ikke tekst. Mønsteret fra #101:

- Tallene ligger i en CSV under `research/`. Et skript i `scripts/` genererer `dist/<navn>.js`. Ikke rediger den genererte fila for hånd.
- Delen får `table: <data>` med `caption`, `columns`, `rows` og `note`.
- Første kolonne blir radoverskrift (`th scope="row"`), og kolonnetitlene får `th scope="col"`.
- Tallene formateres med `nb-NO` og alltid to desimaler. Det passer for prosent, ikke for kronebeløp. Trengs det kronebeløp, må formateringen utvides først.
- `note` sier hva tallene er og at historikk ikke er en prognose.
- Legg til en enhetstest som kontrollregner tabellen mot CSV-en, slik `tests/bsu-rates.test.cjs` gjør.

**ASK trenger ingen tabell.**

## 4. Kontroll før PR

- Kjør `tests/svarmal.test.cjs`, `tests/svartekst.test.cjs`, `tests/svarmal-browser.cjs` og søketestene.
- Se på den gjengitte siden ved 320 og 390 px og på PC, med Fordeler, Ulemper, Fordypning og Kilder åpne. Kontroller tastatur og fokus.
- Kjør W3C Nu-validatoren på den gjengitte siden.
- Øk cacheversjonen i `dist/spor.html` for endrede filer.
- Logg i `BESLUTNINGER.md` og i et kontrollnotat under `research/svarutkast/`.
- Ingen sammenslåing med main.

## 5. ASK utfylt (erstatter `q-aksjesparekonto`)

Behold eksisterende `keys`, `questions` og `words`. `words` bruker hjelperen `alone()` og skal stå urørt. Feltet `caveat` fjernes: risikoen står i `intro`, og avgrensningen står i `review`.

```js
{"kind":"explainer",
"layout":"overview",
"id":"q-aksjesparekonto",
"title":"Hva er en aksjesparekonto (ASK)?",
"checked":"2026-10-28",
/* keys, questions og words: uendret fra dagens oppføring */
"terms":[],
"intro":"En aksjesparekonto (ASK) er en konto for aksjer og aksjefond i EØS. Du betaler skatt av gevinst og utbytte først når du tar ut mer enn du har satt inn. Kontoen fjerner ikke risikoen. Den avhenger av hva du investerer i.",
"tradeoffs":{"pros":[
 {"title":"Skatten utsettes","text":"Gevinst og utbytte kan investeres videre uten at du betaler skatt underveis."},
 {"title":"Innskuddet kommer ut først","text":"Du kan når som helst ta ut det du har satt inn, uten skatt."}],
"cons":[
 {"title":"Ikke alle aksjer er tillatt","text":"Selskapet må være hjemmehørende i EØS. Enkeltaksjer i for eksempel amerikanske selskaper kan derfor ikke kjøpes på ASK. Det gjelder også mange selskaper på Oslo Børs."},
 {"title":"Tapsfradrag først til slutt","text":"Taper du penger, får du fradrag først når kontoen avsluttes. Salg med tap inne på kontoen gir ikke fradrag."},
 {"title":"Kontanter gir ikke rente","text":"Penger som står uinvestert på kontoen, gir ingen rente."}]},
"example":{"title":"Eksempel: skatt når kontoen avsluttes",
 "text":"Du har satt inn 100 000 kr og ikke tatt ut noe. Kontoen er verdt 150 000 kr. Du tar ut alt og avslutter kontoen. 100 000 kr er innskudd og skattefritt. 50 000 kr er gevinst. Med 5 000 kr i skjermingsfradrag er 45 000 kr skattepliktig. Med satsen for 2026 blir skatten 17 028 kr. Tallene er valgt for eksemplet og er ikke en beregning av din skatt."},
"parts":[
 {"title":"Skatt ved uttak","text":"Tar du ut mer enn innskuddet du har igjen, betaler du skatt av det som overstiger innskuddet. Først trekkes eventuelt skjermingsfradrag fra. I 2026 er skatten 37,84 prosent av det skattepliktige beløpet. Tidligere uttak trekkes fra innskuddet du har igjen."},
 {"title":"Skjermingsfradrag","text":"Skjermingsfradraget reduserer beløpet du betaler skatt av. Grunnlaget er årets laveste innskuddssaldo pluss ubenyttet skjerming fra tidligere år. Grunnlaget ganges med årets skjermingsrente."},
 {"title":"Krav til konto og investeringer","text":"Bare personlige skattytere kan opprette ASK. Aksjene må være børsnoterte. Fond må være hjemmehørende i EØS og ha mer enn 80 prosent aksjer ved inntektsårets begynnelse. Kravene gjelder når du kjøper. Et verdipapir kan bli stående selv om det senere ikke oppfyller dem, for eksempel fordi selskapet flytter til USA."},
 {"title":"Flytting","text":"Du kan flytte ASK til en annen tilbyder eller mellom egne ASK-er uten skatt. Innskudd og ubenyttet skjerming følger med i samme forhold som verdiene. Aksjer og fond på en vanlig konto kan ikke flyttes direkte inn. Overføringen regnes som salg, med gevinst eller tap."},
 {"title":"Gave og arv","text":"ASK kan arves uten at overføringen skattlegges. Den kan også gis i gave, men da må hele kontoen overføres. Mottakeren fører videre innskuddet og skjermingen som hører til kontoen. Skattereglene kaller dette skattemessig kontinuitet. Når et dødsbo fordeles, kan også utvalgte aksjer og fond overføres til arvingens ASK. Innskudd og ubenyttet skjerming følger da med i samme forhold som verdiene. En ASK kan ikke eies av flere sammen. Vil du gi til flere, kan du fordele verdiene på flere egne ASK-er og gi bort hver konto."}],
"sources":[
 {"id":"tax-ask-no","title":"Skatteetaten: Aksjesparekonto (ASK)","url":"https://www.skatteetaten.no/person/skatt/hjelp-til-rett-skatt/aksjar-og-verdipapir/om/aksjesparekonto-ask/"},
 {"id":"tax-aksjefaktor-2026","title":"Skatteetaten: Faktor for oppjustering av gevinst, tap eller utbytte på aksjer, 2026","url":"https://www.skatteetaten.no/satser/faktor-for-oppjustering-av-gevinsttap-eller-utbytte-pa-aksjer/?year=2026"},
 {"id":"tax-ask-arv-gave","title":"Skatteetaten: Skatte-ABC 2025/2026, A-10-9 Videreføring av aksjesparekonto ved arv eller gave","url":"https://www.skatteetaten.no/nn/rettskjelder/type/handboker/skatte-abc/gjeldende/a-10-aksjesparekonto/A-10.030/"}],
"review":{"text":"Skatteetatens sider er udaterte. Satsen gjelder inntektsåret 2026. Skatte-ABC 2025/2026 er lest fra en utskrift datert 28.10.2026, og utskriftstiden er ikke kildens oppdateringsdato. Alle kilder er lest 28. oktober 2026, egenkontroll. Svaret dekker ikke skatt ved flytting til utlandet, formuesskatt eller utenlandsk kildeskatt. Neste kontroll før 1. januar 2027 og ved regelendringer."}}
```

### Merknader til ASK

- **Tidligere skjermingskilde:** Dagens oppføring har kilden `tax-ask-skjerming` (Skatte-ABC A-10-5.6). Den er utelatt fordi alle påstandene om skjerming er kontrollert mot ASK-siden. Beholdes den, må det oppgis hvilken setning den dekker.
- **Kontrollberegning av eksemplet:** (150 000 − 100 000 − 5 000) × 0,3784 = 17 028.
- **Fondskonto-eksemplet** viser til ASK-regelen om at innskuddet tas ut først. Den regelen står i fordelene, så henvisningen stemmer fortsatt.
- **Lengde:** rundt 420 ord, over målet på 300. Begrunnelsen er at svaret dekker arv, gave og flytting. Lars har ikke tatt stilling til lengden. Varsel med begrunnelse i PR-en, ikke kutt.
- **Avgrensning som ikke er tatt med:** Om et EØS-fond kan eie amerikanske aksjer, er ikke funnet i kildene. Det står derfor ikke i teksten.
