# Universell utforming i Spareverksted

Felles arbeidsgrunnlag for hele nettstedet. Samlet 24. oktober 2026 fra arbeidet med kalkulatoren (fase 1 og 2). Gjelder alle nye deler fra første utkast, ikke som etterarbeid.

Standard: WCAG 2.2 nivå AA. Vi omtaler resultatet som «ingen avvik funnet i de gjennomførte kontrollene», aldri som full WCAG-godkjenning. Om forskrift om universell utforming av IKT formelt gjelder for Spareverksted, er ikke avklart. Uu-tilsynet skriver at både private og offentlige virksomheter, lag og organisasjoner må følge regelverket ([uutilsynet.no/regelverk](https://www.uutilsynet.no/regelverk/), lest av Lars via skjermbilde 28.10.2026). Om en privatperson med en gratis hobbyside regnes som virksomhet, sier siden ikke. Vi følger standarden uansett.

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
- **Fagord forklares der de står, uten sprettoppvindu.** Valgt 28.10.2026, ikke bygget. Se punkt 6.

## 3. Kontroller som er gjennomført

| Kontroll | Hvor | Dekker | Ikke dekket |
| --- | --- | --- | --- |
| `tests/a11y-browser.cjs` | CI, Chromium | Kontrast (tekst, grafens tekst og linjer), trykkflater, navn, reflow ved 320 og 640 px, synlig fokus, tastatur, faste elementer over fokus. Tre temaer, kalkulator, veileder, Om-side, personvernside og tilgjengelighetsside. Fra 27.10.2026 også bokser inni siden som må rulles sidelengs (talltabeller unntatt) | Safari, Firefox, skjermleser |
| `tests/polish-browser.cjs` | CI, Chromium, Firefox og WebKit | Svar straks etter startguiden, fokus ved feil, eksport lik grafen | WebKit er ikke Safari på iPhone |
| Revisjon 23.10 | Manuelt i Chromium | 27 kombinasjoner (tre temaer × 320, 375, 1280 px × tre sider). Rettet: trykkflater, fokus som ble stående i lukket dialog | |
| iPhone Safari, VoiceOver | Lars | Se `research/plan.md`, punkt 3 | NVDA, Firefox med bare tekstforstørring |
| iPhone Safari, VoiceOver og zoom, personvernsiden | Lars, 27.10.2026 | Knappene «Vis e-postadresse» og «Slett» virket, VoiceOver leste riktig, zoom fungerte. Lars er ny bruker av hjelpemidlene | Kalkulator og veileder med VoiceOver, NVDA |
| Ekstern tester med skjermleser, uformell | Publisert side, 28.10.2026, rapportert til Lars i melding | Det meste virket med skjermleser, zoomen fikk ros. **Feil:** grafen beskrives ikke i ord, bare sluttbeløp og akser. Ønske: opplesingsknapp. Testerens navn lagres ikke her | Hvilken enhet, nettleser og skjermleser. Om tabellvisningen ble funnet |

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

## 6. Fagord forklart der de står (28. oktober 2026)

**Status:** Valgt standard etter undersøkelse 28.10.2026, på oppdrag fra Lars. Ikke bygget. Lars vedtok samme dag at funksjonen er UU, kan bygges under pausen og skal være slått på når den publiseres. Mønsteret regnes som endelig først når prøvingen under er gjort. Begrunnelse og forkastede alternativer: [BESLUTNINGER.md](../BESLUTNINGER.md), «Standard for fagord forklart der de står».

### Mønster

- **Knapp i teksten.** Fagordet er en `<button type="button">` med ordet som navn. Prikket understrek, slik at farge ikke er eneste kjennetegn. Ser annerledes ut enn lenker. Synlig fokus i alle tre temaer.
- **Tilstand.** `aria-expanded="false"` eller `"true"`, og `aria-controls` mot forklaringen.
- **Forklaringen står i teksten.** Den er en `<span>` rett etter knappen, vist som egen blokk når den er åpen. Den skyver resten av teksten ned og dekker ikke noe. `<span>` fordi den må kunne stå inne i et avsnitt.
- **Åpne og lukke.** Trykk, Enter eller mellomrom åpner og lukker. Escape lukker når fokus er på knappen. Fokus flyttes ikke.
- **Ingen opplesning med `aria-live`.** Forklaringen står rett etter knappen i lesrekkefølgen, i tråd med punkt 1 om sparsom opplesning.
- **Ingen hover og ingen `title`.** Forklaringen vises aldri bare fordi musepekeren eller fokus er på ordet.
- **Flere kan være åpne.** Én forklaring lukkes ikke fordi en annen åpnes.
- **Uten JavaScript** er ordet en lenke til ordlisten.
- **Bevegelse.** Ingen animasjon, og i alle fall ingen ved `prefers-reduced-motion`.
- **Trykkflate.** Hele ordet er trykkflaten. Knapper i løpende tekst er unntatt minstekravet i 2.5.8, men linjeavstanden skal gi minst 24 px høyde. 44 px høyde er ikke realistisk inne i et avsnitt uten å endre linjeavstanden for all tekst.
- **Hvor ofte.** Første gang ordet står i hvert avsnitt eller innholdsseksjon. I Enkel markeres alle fagord, i Avansert bare de minst kjente eller med svakere markering. Forklaringen finnes i alle nivåer.
- **Tekst.** Den korte forklaringen hentes fra begrepsregisteret, slik at ordlisten og forklaringen i teksten bygger på samme definisjon.

### Prøving før mønsteret regnes som endelig

- Tastatur i Chromium, Firefox og WebKit.
- VoiceOver på iPhone (Lars). NVDA på Windows og TalkBack hvis eksterne testere kan.
- Zoom 200 % og 400 % (320 px bredde), og tekstforstørring.
- Smal og bred mobil.
- Hovedspørsmålet: finner en skjermleserbruker forklaringen uten hjelp, og forstår hen at ordet kan trykkes på?
- `tests/a11y-browser.cjs` utvides med knappenavn, `aria-expanded`, kontrast for understrek og fokus, og at ingen forklaring dekker annet innhold.

Viser VoiceOver-testen at forklaringen ikke blir funnet, vurderes alternativ G i beslutningsloggen (opplesning når den åpnes).

### Tekst til tilgjengelighetssiden

Utkast. Legges inn under «Valg jeg har tatt» i `dist/tilgjengelighet.html` i samme PR som funksjonen, ikke før. Siden skal bare beskrive det som er bygget og kontrollert.

> **Fagord forklares der de står, uten sprettoppvindu.** Trykker du på et ord med prikket understrek, kommer forklaringen rett under ordet og skyver teksten ned. Den dekker ikke annet innhold, og den virker likt med mus, tastatur, berøring og skjermleser. Jeg valgte bort små vinduer som dukker opp når du holder musepekeren over et ord. De virker ikke på mobil og dekker lett teksten når siden er forstørret.

### Kilder, lest 28.10.2026

- [W3C: Understanding SC 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus) (oppdatert 12.07.2026). Innhold som vises ved hover eller fokus må kunne lukkes, holdes over og bli stående. Sier at det vanligvis finnes mer forutsigbare og tilgjengelige måter å legge til innhold på.
- [Pearson Accessibility: Tooltips and Toggletips](https://accessibility.pearson.com/resources/component-library/tooltips-and-toggletips). Skiller verktøytips (hover og fokus) fra toggletips (åpnes ved aktivering). Knapp som utløser, fokus blir på knappen, innholdet skal ikke blokkere innhold rundt.
- [U.S. Web Design System: Tooltip](https://designsystem.digital.gov/components/tooltip/) (publisert 20.10.2026). Ikke skjul nødvendig informasjon i verktøytips. Vis innholdet på siden når det er plass.
- Inspirasjon: NRK sine ordforklaringer (skjermbilde fra Lars 28.10.2026). Åpnes ved trykk, men som flytende boks som dekker teksten under.
- Ikke nylest i denne økten: HTML-spesifikasjonen om at `<details>` ikke kan stå inne i et avsnitt, og unntaket for knapper i løpende tekst i [WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). Kontrolleres før funksjonen bygges.

## 7. Lenker til regelverket på tilgjengelighetssiden (28. oktober 2026)

Forslag, legges inn i `dist/tilgjengelighet.html` i egen PR etter Lars' godkjenning.

- **Hovedlenke:** Uu-tilsynets side [Regelverk](https://www.uutilsynet.no/regelverk/), med undersidene «Regelverk og krav» (gjeldende) og «Fremtidige regelverk og krav». Tilsynsmyndigheten, nivå 1 i kildereglene. Lars vurderte siden 28.10.2026 og mente den ser veldig bra ut.
- **Ingen egne påstander om status eller datoer.** Undersiden [Fremtidige regelverk og krav](https://www.uutilsynet.no/regelverk/fremtidige-regelverk-og-krav/747) sa 28.10.2026 at tilgjengelighetsdirektivet skal tre i kraft i juni 2025. Siden er udatert og virker utdatert, så den brukes ikke som kilde for når direktivet gjelder i Norge.
- **Primærkilder ved behov:** EUR-Lex for [webdirektivet (EU) 2016/2102](https://eur-lex.europa.eu/eli/dir/2016/2102/oj) og [tilgjengelighetsdirektivet (EU) 2019/882](https://eur-lex.europa.eu/eli/dir/2019/882/oj), og [Prop. 111 LS (2025-2026)](https://www.regjeringen.no/no/dokumenter/prop.-111-ls-20252026/id3172632/). Ingen av disse er lest. Claude fikk ikke åpnet dem 28.10.2026.
- **Spørsmål til Uu-tilsynet:** om regelverket gjelder Spareverksted, kan tas med i oppfølgingen av henvendelsen som allerede er sendt.

