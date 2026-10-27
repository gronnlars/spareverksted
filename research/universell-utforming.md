# Universell utforming i Spareverksted

Felles arbeidsgrunnlag for hele nettstedet. Samlet 24. oktober 2026 fra arbeidet med kalkulatoren (fase 1 og 2). Gjelder alle nye deler fra første utkast, ikke som etterarbeid.

Standard: WCAG 2.2 nivå AA. Vi omtaler resultatet som «ingen avvik funnet i de gjennomførte kontrollene», aldri som full WCAG-godkjenning. Om forskrift om universell utforming av IKT formelt gjelder for Spareverksted, er ikke undersøkt. Vi følger standarden uansett.

## 1. Krav til hver ny del

En ny side eller funksjon er ikke ferdig før punktene under er oppfylt og kontrollert. Det som ikke er kontrollert, står som «ikke testet».

| Område | Krav | WCAG |
| --- | --- | --- |
| Tastatur | Alt kan nås og brukes med Tab, Enter, mellomrom og Escape. Ingen tastaturfeller. Logisk rekkefølge | 2.1.1, 2.1.2, 2.4.3 |
| Synlig fokus | Fokus synes i alle tre temaer. Faste elementer dekker ikke elementet med fokus | 2.4.7, 2.4.11 |
| Fokus etter handling | Dialog lukkes: fokus tilbake til knappen som åpnet den. Handling stoppes av feil: fokus til første ugyldige felt. Ellers flyttes fokus ikke | 2.4.3, 3.3.1 |
| Skjermleser | `lang="nb"`. Meningsfulle overskrifter i riktig nivå. Alle kontroller har navn. Feilmelding koblet til feltet med `aria-describedby`, feltet har `aria-invalid` | 1.3.1, 4.1.2, 3.3.1 |
| Opplesning | `role="alert"` bare for feil. Ingen `aria-live` på innhold som endres mens brukeren skriver | 4.1.3 |
| Kontrast | Tekst minst 4,5:1, stor tekst og grafikk minst 3:1, i Nøytral, Lys og Natt | 1.4.3, 1.4.11 |
| Farge | Farge er aldri eneste kjennetegn. Grafer bruker også strek, stiplet linje eller kantlinje | 1.4.1 |
| Tekststørrelse | Brødtekst som resten av nettstedet (15 px i dag). Forbehold som påvirker forståelsen minst 14 px, etiketter minst 13 px | Egen regel |
| Forstørring | 200 % tekst og 400 % zoom (320 px bredde) uten sideveis scrolling og uten avkuttet tekst | 1.4.4, 1.4.10 |
| Trykkflater | Minst 24 × 24 px. Hjelpeknapper og hovedhandlinger helst 44 px | 2.5.8 |
| Dra-bevegelser | Alt som kan dras (glidebrytere, graf), har et alternativ: tallfelt, piltaster, tabell | 2.5.7 |
| Bevegelse | Respekterer `prefers-reduced-motion` | 2.3.3 |
| Tallinntasting | Felt som kan være negative, har ikke `inputmode="decimal"` (iPhone mangler minus) | |
| Grafer | Tekstalternativ som sier hovedresultatet. Tabellvisning med samme tall | 1.1.1 |
| Navigering | Hopp-lenke til innholdet. Samme meny på alle sider. Siden sier hvor du er | 2.4.1, 3.2.3 |
| Språk | Kort svar først. Vanlige ord. Fagord forklares der de brukes. Ett navn per ting på tvers av sidene | 3.1, 3.2.4 |

## 2. Valg vi har tatt, og hvorfor

- **Resultatet leses ikke opp ved hver endring.** WCAG 4.1.3 krever ikke at tallene leses opp, og stadige opplesninger forstyrrer. «Dette betyr tallene dine» har ingen `aria-live`. Skjermleserbrukere finner den med overskriften.
- **Forklaringen oppdateres ved `change`, ikke ved hvert tastetrykk.** Ingen automatisk scrolling, ingen sprettoppvindu.
- **Fokus flyttes bare når brukeren trenger å handle.** Ved stoppet Del, Lagre eller Eksporter går fokus til feltet som må rettes. Ved feil inndata blir fokus stående i feltet.
- **Tomt felt gir ikke 0 kr.** Siste gyldige resultat står dempet med beskjed om at det ikke er oppdatert. Et tilsynelatende gyldig resultat er verre enn intet resultat.
- **Glidebryteren begrenser ikke inntasting.** Tallfeltet er hovedkontrollen. Bryteren er en snarvei.
- **Utfallsbåndet har stiplede kantlinjer** med minst 3:1 mot bakgrunn og fyll. Fyllflaten alene ga 1,22:1 i lyse temaer.
- **Usikkerhet framstilles som scenario eller modell, ikke som sannsynlighet**, når grunnlaget mangler. Bygger på Spiegelhalter m.fl.
- **Eksempeltall og standardforutsetninger forklares i én kort tekst over feltene**, ikke med merke ved hvert felt.

## 3. Kontroller som er gjennomført

| Kontroll | Hvor | Dekker | Ikke dekket |
| --- | --- | --- | --- |
| `tests/a11y-browser.cjs` | CI, Chromium | Kontrast (tekst, grafens tekst og linjer), trykkflater, navn, reflow ved 320 og 640 px, synlig fokus, tastatur, faste elementer over fokus. Tre temaer, kalkulator, veileder, Om-side, personvernside og tilgjengelighetsside. Fra 27.10.2026 også bokser inni siden som må rulles sidelengs (talltabeller unntatt) | Safari, Firefox, skjermleser |
| `tests/polish-browser.cjs` | CI, Chromium, Firefox og WebKit | Svar straks etter startguiden, fokus ved feil, eksport lik grafen | WebKit er ikke Safari på iPhone |
| Revisjon 23.10 | Manuelt i Chromium | 27 kombinasjoner (tre temaer × 320, 375, 1280 px × tre sider). Rettet: trykkflater, fokus som ble stående i lukket dialog | |
| iPhone Safari, VoiceOver | Lars | Se `research/plan.md`, punkt 3 | NVDA, Firefox med bare tekstforstørring |
| iPhone Safari, VoiceOver og zoom, personvernsiden | Lars, 27.10.2026 | Knappene «Vis e-postadresse» og «Slett» virket, VoiceOver leste riktig, zoom fungerte. Lars er ny bruker av hjelpemidlene | Kalkulator og veileder med VoiceOver, NVDA |

Testene beskytter det som er kontrollert. De beviser ikke at folk forstår innholdet.

## 4. Kilder

- [W3C: WCAG 2.2](https://www.w3.org/TR/WCAG22/) og forklaringssidene for hvert kriterium, blant annet [Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html), [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) og [Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C: Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/)
- [GOV.UK Design System: Text input](https://design-system.service.gov.uk/components/text-input/) (tallfelt og `inputmode`)
- [Nielsen Norman Group: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) og [Visibility of System Status](https://www.nngroup.com/articles/visibility-system-status/)
- [Spiegelhalter m.fl.: Visualizing uncertainty about the future](https://www.stat.berkeley.edu/users/aldous/157/Papers/spiegelhalter_visualizing.pdf)
- Tidligere notater: `research/ux-2026-10-22.md`

## 5. Tilgjengelighetsside og ny kontroll (27. oktober 2026)

- `dist/tilgjengelighet.html` er oppdatert fra utkastet i PR #75 (25.10.2026): ny seksjon «Valg vi har tatt» (fra punkt 2 over), «Svar vi venter på» (Uu-tilsynet, sendt 25.10.2026, registreringsbekreftelse, ikke svar), kontakt via e-post (`post`) i tillegg til GitHub, og Lars' første iPhone-test. Lenket fra Om-siden og bunnteksten der.
- Påstanden om at forskriften er «strengere/mindre streng» for private er fjernet. Siden sier bare at vi ikke vet om forskriften gjelder, og at vi følger WCAG 2.2 AA uansett.
- Funn: tabellen på personvernsiden måtte rulles sidelengs på mobil (rettet i #78), men `a11y-browser.cjs` fanget det ikke, fordi reflow-kontrollen bare målte hele siden. Ny kontroll flagger bokser med `overflow-x:auto|scroll` som har innhold bredere enn boksen. Talltabellene `#tableWrap`, `.withdraw-table`, `#comparison` og `.report-comparison` er unntatt, siden WCAG 1.4.10 tillater todimensjonal rulling for datatabeller. Kontrollert at testen feiler med den gamle feilen og består med rettingen.
