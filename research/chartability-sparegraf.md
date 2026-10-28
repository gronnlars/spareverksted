# Sparegrafen gjennomgått mot Chartability

Gjennomført 28. oktober 2026 av Claude, på oppdrag fra Lars. Upublisert arbeidsgrunnlag. Endrer ikke nettsiden.

## Kilde

Testlisten fra Chartability (Elavsky, Bennett og Moritz, «How accessible is my visualization? Evaluating visualization accessibility with Chartability», Computer Graphics Forum / EuroVis 2022, [diglib.eg.org](https://diglib.eg.org/handle/10.1111/cgf14522)). Lest fra en PDF Lars la ved 28.10.2026: et resultatark fra forfatternes gjennomgang av åtte visualiseringer (Word-fil, laget september 2021). Arket lister testene etter prinsippene Perceivable, Operable, Understandable, Robust, Compromising, Assistive og Flexible, merket «CRITICAL» der det gjelder. Selve artikkelen er ikke lest. Testene er derfor brukt slik de er formulert i arket, uten forfatternes utdypinger.

## Hvordan gjennomgangen er gjort

- Kontrollert i koden på grenen `fix/grafbeskrivelse` (PR #92) og mot eksisterende automatiske tester. Ikke prøvd med skjermleser, og ikke sett på iPhone.
- **Ok** = støttet av kode eller test. **Avvik** = funnet i koden. **Ikke kontrollert** = ikke undersøkt nok til å si.

## Resultat

| Prinsipp | Test (forkortet) | Status | Grunnlag |
| --- | --- | --- | --- |
| Perceivable | CRITICAL: Lav kontrast på grafelementer og tekst | Ok | `a11y-browser.cjs` måler kontrast på grafens tekst og linjer i tre temaer |
| Perceivable | CRITICAL: For liten tekst | **Avvik** | Aksetallene er 12 px (`svg text` i `style.css`). Egen regel i `research/universell-utforming.md` sier etiketter minst 13 px. Forbeholdet under grafen (`#chartNote`, klassen `hint`) er 12 px, mens regelen sier minst 14 px for forbehold som påvirker forståelsen |
| Perceivable | CRITICAL: Informasjon bare tilgjengelig visuelt | Ok med PR #92 | «Slik leser du grafen» og tabellvisning |
| Perceivable | Farge er eneste kanal | Ok | Linjene skilles også med heltrukket, stiplet og lang stiplet strek, og forklaringen viser strektypen |
| Perceivable | Fargevalg ikke trygt for fargeblinde | Ikke kontrollert | |
| Operable | CRITICAL: Interaksjon bare på én måte | Ok, med forbehold | Peker, trykk og piltaster, pluss tabell. Piltastene virker ikke med VoiceOver på iPhone, så der er tabellen eneste vei |
| Operable | CRITICAL: Ingen instruksjon for interaksjon | Ok | «Pek eller trykk på grafen for å lese tall. Piltastene virker også.» |
| Operable | Fokus vanskelig å se | Ok | `a11y-browser.cjs` kontrollerer synlig fokus |
| Operable | Egne tastaturkontroller overstyrer skjermleseren | **Må undersøkes** | Grafen fanger venstre- og høyrepil når den har fokus. Det kan komme i konflikt med skjermleserens egne piltaster |
| Understandable | CRITICAL: Ingen tittel, oppsummering eller kontekst | Ok med PR #92 | Overskrift, forklaring av linjene og «Slik leser du grafen» |
| Understandable | Aksetekst mangler eller er uklar | **Avvik** | Den loddrette aksen viser tall som «200 tusen» uten «kr». Enheten står bare i den skjulte beskrivelsen |
| Understandable | Mål eller variabler er uklare | Delvis | Begrepsregisteret (PR #91) viser at «dagens kroner», «kjøpekraft» og «forventet avkastning» mangler forklaring der de står |
| Understandable | Usikkerhet kommuniseres ikke tydelig | Ok | Båndet beskrives som regneeksempler, ikke sannsynligheter |
| Robust | Semantisk feil bruk av elementer | **Avvik** | Grafens ytre `div` har `aria-label` uten rolle |
| Robust | Virker bare i én nettleser | Ok | Brukerflyter testes i Chromium, Firefox og WebKit |
| Compromising | CRITICAL: Ingen tabell for dataene | Ok | Knappen «Tabell» |
| Compromising | Tabellen kan ikke lastes ned, filtreres eller sorteres | Delvis | Kan lastes ned som CSV og Excel. Kan ikke filtreres eller sorteres på siden |
| Compromising | Tilstanden er vanskelig å dele | Ok | Delte lenker |
| Compromising | Data kan ikke navigeres etter strukturen | Ok, med forbehold | Piltaster måned for måned, Home og End. Se forbeholdet om VoiceOver |
| Assistive | Synlige trekk beskrives ikke i tekst | Ok med PR #92 | Formen på linjen, fall og avstand til innskuddene beskrives |
| Assistive | Data er ikke lesbart formatert | Ok | Norske tall med «tusen», «mill.» og «mrd.» |
| Flexible | CRITICAL: Brukerens egne stilvalg respekteres ikke | Ikke kontrollert | |
| Flexible | Tekstavstand og skriftstørrelse fra brukeren respekteres ikke | **Må undersøkes** | Ingen automatisk test for WCAG 1.4.12 (tekstavstand). Teksten i grafen er SVG og følger trolig ikke brukerens skriftstørrelse |
| Flexible | Grafen kan ikke forstørres | Ok | Reflow ved 320 px testes |
| Flexible | Kontrast kan ikke justeres | Ok | Tre fargetemaer |

## Forslag, i prioritert rekkefølge

1. **Større tekst i grafen og forbeholdet** til egne minstekrav (13 og 14 px). Dokumentert brudd på egen regel. Liten retting.
2. **«kr» på den loddrette aksen**, for eksempel som enhet over aksen, slik Finanstilsynets designmanual beskriver.
3. **Rolle på grafens ytre element**, og vurder `<figure>` med `<figcaption>` som W3C foreslår.
4. **Prøv piltastene med skjermleser.** Overstyrer de skjermleseren, må de bare virke når grafen er valgt med Tab, eller fjernes til fordel for tabellen.
5. **Automatisk test for tekstavstand (WCAG 1.4.12).**

Punkt 1 til 3 og 5 er retting av UU-feil og tillatt under pausen etter `docs/regulatorisk.md`, krav 6. Punkt 4 krever prøving med skjermleser først.
