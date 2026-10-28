# Egenkontroll etter Uu-tilsynets veiledning

Gjennomført 28. oktober 2026 av Claude, på oppdrag fra Lars. Upublisert arbeidsgrunnlag. Endrer ikke nettsiden.

## Kilder

Lars la ved to sider fra Uu-tilsynet som PDF 28.10.2026, fordi tilsynets nettsted er stengt for Claudes verktøy:

- «Sjekk nettstedet ditt selv», https://www.uutilsynet.no/veiledning/sjekk-nettstedet-ditt-selv/708. Opprettet 10.02.2016, sist endret 26.10.2026. Ti punkter for egen testing. Tilsynet skriver selv at punktene ikke dekker alle lovkrav.
- «Løsningsforslag etter tema: Skjema», https://www.uutilsynet.no/veiledning/skjema/38. Opprettet 28.04.2020, sist endret 19.12.2023. Skiller mellom krav i forskriften og anbefalinger utover kravene.

Uu-tilsynet er nivå 1 i kildereglene. Teksten i PDF-ene manglet noen bokstaver ved uttrekk, men innholdet var lesbart.

- «Løsningsforslag etter tema: Bilder og grafikk», https://www.uutilsynet.no/veiledning/bilder-og-grafikk/205. Opprettet 17.04.2015, sist endret 15.12.2023. Lagt ved samme dag. Brukt i PR #92 for grafenes tekstalternativ, se `BESLUTNINGER.md`, «Grafene beskrives i ord».

## Hvordan kontrollen er gjort

Kontrollert mot koden på main `00d8f15`, de automatiske testene og `research/universell-utforming.md`. Ikke testet manuelt med tastatur, skjermleser eller fargeblindsimulering. **Ok** = støttet av kode eller test. **Avvik** = funnet. **Ikke kontrollert** = ikke undersøkt nok.

## Sjekk nettstedet ditt selv

| Punkt | Hva tilsynet ber om å sjekke | Status | Grunnlag |
| --- | --- | --- | --- |
| 1. Tastatur | Snarveilenke, synlig fokus, fornuftig rekkefølge, fokus ved utvid og lukk | Ok, delvis | Hopp-lenke og synlig fokus testes i `a11y-browser.cjs`. Rekkefølgen er ikke gått gjennom manuelt |
| 2. Forstørring | 200 til 400 % zoom, smal og bred skjerm, zoom på mobil | Ok | Reflow ved 320 og 640 px testes. Viewport sperrer ikke zoom på mobil |
| 3. Farger og kontrast | Lenker markert med mer enn farge, kontrast 4,5:1 og 3:1, fargeblindsimulering av diagrammer | Delvis | Kontrast testes automatisk. Grafene bruker strektype i tillegg til farge. **Fargeblindsimulering av grafene er ikke gjort** |
| 4. Overskrifter | Riktig koding, ingen hopp i nivå | Ok for HTML-filene | Ingen hopp funnet i de fem sidene. Oppdatert 28.10.2026: tomme overskrifter i innhold laget med JavaScript er rettet i PR #99, og `tests/html-struktur-browser.cjs` sjekker den ferdige siden. Hopp i nivå i innhold fra JavaScript er ikke sjekket |
| 5. Lenker | Lenker skiller seg ut, beskrivende lenketekst | Ikke kontrollert | |
| 6. Bilder | Alternativ tekst, tom for pynt | Ok for grafene med PR #92 | Grafene har kort tekstalternativ med hovedinformasjon og typen sist, beskrivelse i tekst og tabell, slik løsningsforslaget «Bilder og grafikk» beskriver. `<figure>` med `<figcaption>` gjenstår. Andre bilder er ikke gått gjennom |
| 7. Skjema | Synlig ledetekst koblet til feltet | Ok | Feltene har synlige ledetekster og navn. Oppdatert 28.10.2026: hvert felt har nå én `label` som bare peker på feltet (PR #99) |
| 8. Søk | Vanlige ord, skrivefeil, kombinasjoner | Ok | Søket i veilederen tåler skrivefeil og har egne tester. Søkestatistikk finnes ikke, siden ingenting logges |
| 9. Sidetitler | Starter med sidens innhold, slutter med nettstedets navn | Delvis | Fire sider følger mønsteret. Forsiden heter «Spareverksted · Din plan, i ditt tempo», som starter med nettstedets navn. «Om Spareverksted» mangler skilletegn før navnet, men er tydelig |
| 10. Kodevalidering | Riktig nøsting, ingen like id-er | Ok | Ingen like id-er i de fem HTML-filene. Oppdatert 28.10.2026: W3C-validatoren er kjørt av Lars (PR #94) og av Claude på den ferdige siden etter JavaScript (PR #99): ingen feil |

## Skjema: krav i forskriften

| Krav | Status | Grunnlag |
| --- | --- | --- |
| Ledetekst eller instruksjon for alle felt, koblet i koden | Ok | |
| Obligatoriske felt merket på forhånd | Ikke kontrollert | Kalkulatoren har standardverdier. Om noen felt bør merkes som påkrevd, er ikke vurdert |
| Feilmelding som tekst, som sier hvilket felt og hva som er feil | Ok | Feilmeldingene har feltnavn (fase 1) |
| Feilmeldingen synlig uten ekstra handling | **Må undersøkes** | Når lagring eller deling stoppes, vises en melding i et lite felt (`#toast`) som forsvinner etter 8 sekunder. Feltet markeres i tillegg. Om feilteksten ved feltet blir stående, må sjekkes |
| Innfylte data blir stående ved feil | Ok | Et tomt eller ugyldig felt endrer ikke de andre feltene |
| Farge er ikke eneste markering | Ok | Feil vises med tekst og `aria-invalid` i tillegg til rød ramme |
| Finansielle skjema (WCAG 3.3.4) | Gjelder ikke | Siden har ingen kjøp, avtaler eller innsending |

## Skjema: anbefalinger utover kravene

Her kan Spareverksted være bedre enn minstekravet, slik Lars ønsker.

1. **Samlet feilliste over skjemaet.** Tilsynet anbefaler en liste over alle feil rett før skjemaet, med overskrift, og at fokus flyttes dit. I dag flyttes fokus til første ugyldige felt. Det er et bevisst valg i `research/universell-utforming.md`, punkt 2. En samlet liste hjelper mest når flere felt er feil samtidig. Bør vurderes.
2. **Ingen feilmeldinger i sprettoppvinduer.** Meldingen som forsvinner etter 8 sekunder bør vurderes mot dette.
3. **Veiledning ved feltet, med utvid og lukk.** Tilsynet anbefaler veiledningstekst rett ved feltet, gjerne med utvid og lukk, slik at brukeren kan lese og fylle ut samtidig. Dette støtter standarden for forklaring der ordet står (`research/universell-utforming.md`, punkt 6).
4. **Lagre automatisk.** Planen huskes lokalt i nettleseren.

## Forslag, prioritert

1. Fargeblindsimulering av grafene i alle tre temaer.
2. Sjekk om feilmeldingen ved feltet blir stående når meldingen i `#toast` forsvinner. Hvis ikke: rett det.
3. Vurder samlet feilliste over skjemaet.
4. ~~Kjør W3C-validatoren på de fem sidene.~~ Gjort 28.10.2026, se punkt 10.
5. Forsiden: tittel som starter med sidens innhold, for eksempel «Sparekalkulator · Spareverksted». Liten endring, men forsiden er også det folk deler.

Alle er retting av UU-feil eller kontroller, og tillatt under pausen etter `docs/regulatorisk.md`, krav 6. Punkt 3 og 5 endrer det brukeren ser og bør godkjennes av Lars først.

## Status ved sammenslåing (28. oktober 2026, kveld)

Punkt 4, 7 og 10 er oppdatert etter PR #94, #99 og #103. Forslag 1, 2, 3 og 5 er fortsatt åpne og ikke påbegynt. Forslag 3 og 5 endrer det brukeren ser og krever Lars' godkjenning. Grafforklaringen er i tillegg gjort om til en liste, så den leses riktig uten sidens stilark (PR #103, funnet i Chrome sin lesemodus).
