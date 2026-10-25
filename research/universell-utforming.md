# Universell utforming i Spareverksted

Felles arbeidsgrunnlag for hele nettstedet. Samlet 24. oktober 2026 fra arbeidet med kalkulatoren (fase 1 og 2). Gjelder alle nye deler fra første utkast, ikke som etterarbeid.

Standard: WCAG 2.2 nivå AA. Vi omtaler resultatet som «ingen avvik funnet i de gjennomførte kontrollene», aldri som full WCAG-godkjenning. Om forskrift om universell utforming av IKT formelt gjelder for Spareverksted, er ikke avklart (se punkt 4). Vi følger standarden uansett.

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
| `tests/a11y-browser.cjs` | CI, Chromium | Kontrast (tekst, grafens tekst og linjer), trykkflater, navn, reflow ved 320 og 640 px, synlig fokus, tastatur, faste elementer over fokus. Tre temaer, kalkulator, veileder og Om-side | Safari, Firefox, skjermleser |
| `tests/polish-browser.cjs` | CI, Chromium, Firefox og WebKit | Svar straks etter startguiden, fokus ved feil, eksport lik grafen | WebKit er ikke Safari på iPhone |
| Revisjon 23.10 | Manuelt i Chromium | 27 kombinasjoner (tre temaer × 320, 375, 1280 px × tre sider). Rettet: trykkflater, fokus som ble stående i lukket dialog | |
| iPhone Safari, VoiceOver | Lars | Se `research/plan.md`, punkt 3 | NVDA, Firefox med bare tekstforstørring |

Testene beskytter det som er kontrollert. De beviser ikke at folk forstår innholdet.

## 4. Forskriften om universell utforming av IKT (undersøkt 25.10.2026)

Grunnlag: Uu-tilsynets regelverkssider (se kilder). Dette er ingen juridisk vurdering.

**Hva reglene sier, slik tilsynet beskriver dem**
- Private virksomheter, lag og organisasjoner er omfattet, uansett antall ansatte.
- Gjelder nettsider og apper rettet mot publikum i Norge som er en viktig kanal for informasjon eller tjenester. Privatpersoners egne hjemmesider er unntatt.
- Krav for privat sektor: WCAG 2.0 nivå A og AA, 35 suksesskriterier (1.2.3, 1.2.4 og 1.2.5 er unntatt).
- Tilgjengelighetserklæring er krav for offentlig sektor. Tilsynets sider nevner ikke slikt krav for private.
- EUs tilgjengelighetsdirektiv er ikke innført i Norge ennå. Datoer og omfang for private er ikke kontrollert.
- **Om Spareverksted er omfattet, er ikke avklart.** Vi ber tilsynet om svar. Til da arbeider vi som om reglene gjelder.

**Hva vi har gjort, og hvor det er kontrollert**

| Område | Gjort | Kontroll |
| --- | --- | --- |
| Standard | Vi følger WCAG 2.2 AA, strengere enn kravet for privat sektor | Punkt 1 |
| Kontrast | Tekst 4,5:1 og grafikk 3:1 i Nøytral, Lys og Natt, også grafens tekst, linjer og utfallsrom | `a11y-browser.cjs`, `theme-browser.cjs` (CI, Chromium) |
| Tastatur og fokus | Hele flyten uten mus, synlig fokus, fokus tilbake etter dialog, faste elementer dekker ikke feltet med fokus | `a11y-browser.cjs` |
| Skjermleser (kode) | `lang="nb"`, sidetitler, navn på alle kontroller, etiketter på alle felt, feilmelding koblet til feltet, hopp-lenke, `main` | Kodegjennomgang og probe 25.10.2026 (Chromium) |
| Forstørring | 200 % tekst og 400 % zoom uten sideveis scrolling. Tekstavstand (1.4.12) uten overflyt | `a11y-browser.cjs`, probe 25.10.2026 |
| Trykkflater | Minst 24 px, hjelpeknapper og hovedhandlinger helst 44 px | `a11y-browser.cjs` |
| Farge og grafer | Farge er ikke eneste kjennetegn. Tabellvisning og tekstalternativ for grafen | Revisjon 23.10.2026 |
| Bevegelse | `prefers-reduced-motion` respekteres | Kode |
| Feilmeldinger | Feltet markeres og navngis, `aria-invalid`, fokus til første feil | Fase 1, testet |
| Revisjon | 27 kombinasjoner (tre temaer, 320, 375 og 1280 px, tre sider) | 23.10.2026, manuelt i Chromium |

**Åpent**
- Ikke testet: iPhone Safari, VoiceOver, NVDA, Firefox og Edge med bare tekstforstørring. Sjekkliste: `claude/manuell-sjekkliste-2026-10-23.md` i prosjektet.
- Ikke gjennomgått kriterium for kriterium: manuelle kriterier som informasjon og relasjoner (1.3.1), formål med lenker (2.4.4) og forutsigbarhet (3.2.x). De automatiske testene dekker dem ikke fullt ut.
- Forsiden har to `h1`, men de vises aldri samtidig (kontrollert 25.10.2026). I steget med skjemaet for utgangspunktet er ingen `h1` synlig. Ikke endret, siden kalkulatoren er fryst.
- Tilgjengelighetsside finnes i PR #75, lenket fra Om-siden. Ikke lagt i hovedmenyen eller kalkulatorens bunntekst. Lars avgjør.
- Lenkevarselet (toast) forsvinner av seg selv. Ikke vurdert mot 2.2.1.
- Ingen test med brukere som har funksjonsnedsettelser.
- Automatisk verktøy som axe-core er ikke kjørt (ikke tilgjengelig i arbeidsmiljøet).
- **Henvendelse til Uu-tilsynet:** sendt og registrert 25.10.2026 kl. 12.40, saksnummer 2610 2553. Spørsmål: er Spareverksted omfattet, stemmer WCAG 2.0 A og AA for private, kan tilsynet eller andre vurdere om vi oppfyller kravene, hva skal til for å være best i klassen, og hvem kan teste med skjermleser og brukere. Svar ikke mottatt. Når svaret kommer, oppdateres punkt 4 og beslutningen under.

**Beslutning: ingen egen UU-versjon eller UU-skin**
Siden skal være tilgjengelig i alle temaer, ikke ha en tilgjengelig variant ved siden av. Et fjerde tema ville gitt samme krav og mer vedlikehold, og navnet antyder at de andre ikke er tilgjengelige. Revurderes hvis brukertest eller tilsynet (sak 2610 2553) viser et reelt behov. Mulig tillegg: en valgfri «Tydelig visning» eller tekststørrelsesvelger. Behovet er en hypotese som ikke er testet.

## 5. Kilder

- [Uu-tilsynet: Hva sier forskriften?](https://www.uutilsynet.no/regelverk/kva-seier-forskrifta/153), [Unntakene](https://www.uutilsynet.no/regelverk/unntakene-fra-universell-utforming-av-ikt/2248) og [Fremtidige regelverk](https://www.uutilsynet.no/regelverk/fremtidige-regelverk-og-krav/747), lest 25.10.2026

- [W3C: WCAG 2.2](https://www.w3.org/TR/WCAG22/) og forklaringssidene for hvert kriterium, blant annet [Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html), [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) og [Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C: Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/)
- [GOV.UK Design System: Text input](https://design-system.service.gov.uk/components/text-input/) (tallfelt og `inputmode`)
- [Nielsen Norman Group: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) og [Visibility of System Status](https://www.nngroup.com/articles/visibility-system-status/)
- [Spiegelhalter m.fl.: Visualizing uncertainty about the future](https://www.stat.berkeley.edu/users/aldous/157/Papers/spiegelhalter_visualizing.pdf)
- Tidligere notater: `research/ux-2026-10-22.md`
