# Fase 2: resultat, graf og retur til tallene

## Beslutninger

- Resultatet kommer først. «Se graf» ligger etter den korte forklaringen, og går til grafen med fokus på den navngitte grafseksjonen.
- «Endre tall» går til tallfeltene i aktiv modul, uten nullstilling og uten automatisk åpning av skjermtastaturet.
- Mobilens eksisterende bunnlinje brukes om igjen. Over resultatet står «Se resultat ↓». Under resultatet står «Endre tall ↑». Ingen ekstra flytende knapp.
- Beregningstall, spareform, risikovalg, skjulte forutsetninger og grafvalg endres ikke av hoppene.
- Den korte forklaringen beholder advarselen om verdifall i indeksfond. Detaljtallet om den nedre delen av utfallsrommet ligger under «Mer om tallene». Kontrollen for å vise utfallsrommet ligger ved grafen.
- «Endre startvalg» åpner eksisterende verdier. Oppdatering bevarer øvrige forutsetninger, grafvalg og detaljnivå, og kan angres.
- «Ny beregning» åpner standardverdier og forklarer at planen først erstattes når brukeren går videre. Avbryt beholder planen.
- Sparing, Sparemål og Uttak beholdes. Menyen får «Mine planer» og «Last ned eller skriv ut». Kildekodelenken finnes fortsatt i bunnteksten. Kalkulator og Spør om sparing vises direkte ved minst 1000 px bredde.
- Valgt detaljnivå er synlig i «Visning: Enkel/Utforsk/Avansert».

## Kontroll

Ved 375 × 812 px, indeksfond og 22 års sparing var forklaringen tidligere 429 px høy. Etter endringen er den 287 px. Etter hopp til resultatet ligger «Se graf» omtrent 615 px fra toppen, synlig på samme skjerm. Dette er et kontrolltilfelle, ikke et løfte om identisk plassering med alle tall, tekststørrelser og enheter.

`navigation-browser.cjs` dekker resultat/graf/retur, kontekst for bunnknappen, tre temaer, 320/375/390/768/1280 px, tastaturfokus, meny, valgt nivå, redigering uten tap av skjulte forutsetninger, ny beregning, angre og retur i alle tre moduler. Eksisterende beregnings- og nettlesertester beholdes. Skjermbilder er vurdert på mobil og PC.

Fysisk iPhone Safari, Firefox og skjermleser er ikke kontrollert i denne runden. Endringen er ikke en full tilgjengelighetsrevisjon. Den legger ikke til bevaring av hele beregningen mellom kalkulator og veileder; eksisterende kontekstoverføring er uendret.

## Grunnlag

- [NN/g: Back-to-Top Button Design Guidelines](https://www.nngroup.com/articles/back-to-top/): bruk målrettede snarveier, og vurder oppgaven brukeren vil tilbake til.
- [NN/g: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/): behold hyppige handlinger og viktig informasjon tilgjengelig, og gjør fordypning valgfri.
- [NN/g: Hamburger Menus and Hidden Navigation Hurt UX Metrics](https://www.nngroup.com/articles/hamburger-menus/): synlig hovednavigasjon når plassen tillater det.
- [W3C: Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html): faste elementer må ikke skjule tastaturfokus.

Plasseringen av knappene og navngivingen er prosjektvurderinger basert på prinsippene. De er ikke dokumentert som optimale gjennom sammenlignende brukertesting.
