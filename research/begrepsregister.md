# Begrepsregister for Spareverksted

Opprettet 28. oktober 2026 av Claude, på oppdrag fra Lars (veikartet, trinn 3.0.1). Upublisert arbeidsgrunnlag. Endrer ikke nettsiden.

Registeret er grunnlaget for forklaringene GPT skriver (veikartet 0.4 og 3.0). Det skal bli den ene kilden for definisjoner, med kort og lang forklaring per begrep, når forklaringene er godkjent.

## Status ved sammenslåing (28. oktober 2026, kveld)

Registeret er fortsatt riktig som arbeidsgrunnlag, men tre ting er endret etter at det ble skrevet. Tellingen i tabellen er ikke laget på nytt.

- **«Renters rente» og «sparetid» er vedtatt** (BESLUTNINGER.md, «Skrivemåte: «renters rente»»). Funn 2 er dermed avgjort som beslutning. Teksten på siden er ikke rettet ennå: «rentes rente» står fortsatt fire steder i kalkulatorens forklaringer (`index.html`, `experience.js`, `guidance.js`, `journey.js`), og «sparehorisont» én gang i veilederen (`veileder-engine.js`, i gjengivelsen av Forbrukerrådets anbefaling). Rettingen er egen oppgave.
- **Kolonnen «Regel/sats»:** Begreper som hviler på regler eller satser venter ikke lenger på en senere runde. Etter endringen 28.10.2026 i `docs/regulatorisk.md`, punkt 4, kan de forklares når regelen er lest i primærkilden og forklaringen får kontrolldato.
- **Forklaring der ordet står og egen ordlisteside** er nye funksjoner som venter til oppstart (`docs/regulatorisk.md`, punkt 6). Funn 1 beskriver behovet, ikke en løsning som kan bygges nå.

## Slik er registeret laget

- Lest fra `dist/` på main `0dd1007`. Synlig tekst i HTML-filene og tekststrenger i JavaScript-filene, uten kommentarer.
- Tallet i parentes er antall treff per del av siden. Tellingen er grov: den tar med bøyningsformer og noen ganger vanlig bruk av ordet, og den kan ta med tekst som bare vises i bestemte nivåer eller situasjoner.
- **Eksisterende forklaring** er kontrollert mot ordforklaringene i `veileder-knowledge.js` (18 begreper), egne svar som «Hva er ...?», temakortene i veilederen, de to hjelpeknappene i grafen og metodepanelet i kalkulatoren. Andre steder kan ha korte forklaringer som ikke er fanget opp.
- **Behov:** Høy = brukes i kalkulatorens hovedflyt og mangler forklaring der det står. Middels = forklart bare et annet sted, delvis forklart, eller brukt i veilederen uten forklaring. Lav = allerede forklart der det står, sjelden brukt eller forklarer seg selv. Dette er Claudes vurdering.
- **Regel/sats:** Ja = forklaringen hviler på regelverk eller satser og venter etter kravet i 0.4.4. Nei = kan være med i første runde.
- Listen over begreper er satt opp av Claude ut fra fagområdet og et søk i tekstene. Den er ikke garantert fullstendig. Nye fagord legges til når de oppdages.

## Register

| Begrep | Plassering (treff) | Eksisterende forklaring | Behov | Regel/sats | Merknad |
| --- | --- | --- | --- | --- | --- |
| avkastning | Kalkulator (32); Veileder (24); Kalkulator (veiledning) (10); Kalkulator (resultattekst) (8); Eksport (7); Kalkulator (forutsetninger) (2) | Ordforklaring i veilederen (`veileder-knowledge.js`); metodepanelet sier at den er en regneforutsetning | Høy | Nei | Hovedfelt i kalkulatoren. Forklaringen står i veilederen og metodepanelet, ikke ved feltet |
| dagens kroner | Kalkulator (25); Eksport (5); Kalkulator (resultattekst) (5); Veileder (2); Kalkulator (veiledning) (1) | Ordforklaring i veilederen (`veileder-knowledge.js`); metodepanelet | Høy | Nei | Visningsvalg i grafen. Brukes også som «dagens kroneverdi» |
| forventet avkastning | Kalkulator (2); Veileder (2); Kalkulator (veiledning) (1) | Ingen egen | Høy | Nei | Skillet mellom forventet og garantert er kjernen i siden |
| prisvekst / inflasjon | Veileder (30); Kalkulator (29); Kalkulator (veiledning) (13); Kalkulator (resultattekst) (5); Eksport (2) | Ordforklaring i veilederen (`veileder-knowledge.js`) (prisvekst); metodepanelet gir formelen | Høy | Nei | Begge ord skal gi treff (vedtak 24.10). Felt i kalkulatoren |
| risiko | Veileder (33); Kalkulator (veiledning) (12); Kalkulator (9); Eksport (5); Personvern (1) | Ingen egen | Høy | Nei | Brukes mye i både kalkulator og veileder |
| skjerming / skjermingsfradrag | Kalkulator (8); Veileder (6); Eksport (4) | Ingen egen forklaring | Høy | Ja | Brukes i skattedelen av kalkulatoren. Venter etter 0.4.4 |
| årlig kostnad / forvaltningskostnad | Kalkulator (2); Eksport (1); Veileder (1); Kalkulator (veiledning) (1) | Metodepanelet gir formelen, ingen forklaring av hva kostnaden er | Høy | Nei | Felt i kalkulatoren |
| IPS | Veileder (20); Kalkulator (3); Eksport (1) | Sammenlignes med ASK i eget svar | Middels | Ja | Venter etter 0.4.4. Står i metodepanelet uten forklaring |
| avdrag | Veileder (11) | Ingen | Middels | Nei | Viktig for senere lånekalkulator |
| buffer | Veileder (38); Kalkulator (veiledning) (12); Kalkulator (7); Eksport (3); Personvern (1) | Temakort «Bygge en tilgjengelig buffer» | Middels | Nei |  |
| børsfall / markedsfall | Kalkulator (7); Veileder (6); Kalkulator (veiledning) (3); Kalkulator (resultattekst) (1) | Ingen | Middels | Nei | Funksjon i Avansert |
| effektiv rente | Veileder (3) | Ingen | Middels | Ja | Viktig for senere lånekalkulator |
| egenkapital | Kalkulator (3); Veileder (2); Kalkulator (veiledning) (2) | Ingen | Middels | Ja | Hviler på boliglånsregler |
| fond | Veileder (60); Kalkulator (veiledning) (4); Kalkulator (2); Kalkulator (resultattekst) (1) | Ordforklaring i veilederen (`veileder-knowledge.js`) | Middels | Nei |  |
| formuesskatt | Kalkulator (3); Veileder (3); Eksport (1) | Ingen | Middels | Ja | Venter etter 0.4.4 |
| gevinst / gevinstskatt | Veileder (23); Kalkulator (3); Kalkulator (forutsetninger) (1); Kalkulator (veiledning) (1) | Ingen egen | Middels | Ja | Ordet «gevinst» alene hviler ikke på regler |
| indeksfond | Veileder (19); Kalkulator (resultattekst) (4); Kalkulator (2); Eksport (2); Kalkulator (veiledning) (1) | Eget svar «Hva er et indeksfond?» | Middels | Nei | Valg av spareform i kalkulatoren |
| innskudd | Kalkulator (35); Veileder (29); Kalkulator (resultattekst) (13); Kalkulator (veiledning) (11); Eksport (8); Kalkulator (forutsetninger) (2) | Ordforklaring i veilederen (`veileder-knowledge.js`) (innskutt kapital) | Middels | Nei |  |
| innskuddsgaranti | Veileder (3); Kalkulator (veiledning) (2) | Nevnt i svaret om sparing og investering | Middels | Ja | Hviler på regler |
| kjøpekraft | Veileder (16); Kalkulator (15); Kalkulator (resultattekst) (7); Kalkulator (veiledning) (3); Eksport (2) | Eget svar «Hva er kjøpekraft?» og ordforklaring | Middels | Nei | Mangler der ordet står i kalkulatoren |
| kostnad (generelt) | Kalkulator (28); Veileder (27); Kalkulator (veiledning) (12); Eksport (9); Kalkulator (resultattekst) (5); Kalkulator (forutsetninger) (2) | Se over | Middels | Nei | Tellingen er grov og tar med vanlig bruk av ordet |
| prognose | Kalkulator (veiledning) (7); Veileder (4); Kalkulator (2); Kalkulator (forutsetninger) (2); Eksport (2); Kalkulator (resultattekst) (1) | Ingen | Middels | Nei | Skillet prognose og regneeksempel er viktig |
| prosentpoeng | Kalkulator (6); Eksport (2); Kalkulator (veiledning) (1) | Ingen | Middels | Nei | Brukes i «Prøv små endringer» og metodepanelet |
| realavkastning / realverdi / realrente | Eksport (2); Kalkulator (1); Kalkulator (resultattekst) (1) | Ingen | Middels | Nei | Brukes i Avansert og eksport |
| rente (bankrente) | Veileder (49); Kalkulator (resultattekst) (11); Kalkulator (forutsetninger) (7); Kalkulator (veiledning) (6); Kalkulator (3); Eksport (2) | Ingen egen | Middels | Nei | Felt «bankrente» i kalkulatoren |
| rentefond | Veileder (5) | Ingen | Middels | Nei | Bare i veilederen |
| renters rente | Veileder (9); Kalkulator (2); Eksport (1); Kalkulator (veiledning) (1) | Eget svar «Hva er renters rente?» og ordforklaring i veilederen | Middels | Nei | Mangler der ordet står i kalkulatoren. Varianten «rentes rente» brukes også |
| skatt (generelt) | Veileder (76); Kalkulator (35); Eksport (22); Kalkulator (veiledning) (8); Kalkulator (resultattekst) (6) | Ingen samlet | Middels | Ja | Tellingen er grov |
| sparehorisont | Veileder (1) | Ingen | Middels | Nei | Ett synlig treff. Ett navn per ting: sparetid eller sparehorisont? |
| sparekonto | Veileder (26); Eksport (2); Kalkulator (resultattekst) (2); Kalkulator (1) | Temakort «Sparekonto» | Middels | Nei | Valg av spareform i kalkulatoren |
| spredning | Veileder (4); Kalkulator (veiledning) (2) | Ingen | Middels | Nei |  |
| svingning / volatilitet | Veileder (8); Eksport (3); Kalkulator (1); Kalkulator (resultattekst) (1) | Ingen | Middels | Nei |  |
| uttak | Kalkulator (59); Veileder (45); Eksport (13); Kalkulator (veiledning) (9); Personvern (3) | Ordforklaring i veilederen (`veileder-knowledge.js`) | Middels | Nei | Egen del av kalkulatoren |
| uttaksperiode | Kalkulator (3); Kalkulator (veiledning) (2); Veileder (1) | Ingen | Middels | Nei | Felt i uttaksdelen |
| verdifall / tap | Veileder (24); Kalkulator (6); Kalkulator (veiledning) (3) | Ingen egen | Middels | Nei | Skillet mellom tap i kroner og tapt kjøpekraft er vedtatt i fase 1 |
| BSU | Veileder (56); Kalkulator (2); Eksport (1); Kalkulator (veiledning) (1) | Eget svar «Hva er BSU?» | Lav | Ja | Venter etter 0.4.4 |
| aksje | Veileder (19); Eksport (3); Kalkulator (1); Kalkulator (forutsetninger) (1); Kalkulator (resultattekst) (1) | Ingen | Lav | Nei |  |
| aksjefond | Veileder (22); Kalkulator (veiledning) (4) | Ordforklaring i veilederen (`veileder-knowledge.js`); temakort «Bredt aksjefond» | Lav | Nei |  |
| aksjesparekonto (ASK) | Veileder (57); Kalkulator (6); Eksport (3); Kalkulator (skatt) (3) | Eget svar «Hva er en aksjesparekonto (ASK)?» | Lav | Ja | Venter etter 0.4.4 |
| brukskonto | Kalkulator (resultattekst) (2); Kalkulator (1); Kalkulator (forutsetninger) (1); Eksport (1) | Ingen | Lav | Nei | Valg av spareform i kalkulatoren |
| fondsandel | Veileder (4) | Forklart i svaret om sparing og investering | Lav | Nei |  |
| fondskonto | Veileder (32) | Eget svar «Hva er en fondskonto?» | Lav | Ja | Nordnet-omtalen står urørt |
| forutsetning | Kalkulator (16); Kalkulator (veiledning) (7); Eksport (3); Veileder (3); Om-siden (2); Personvern (1); Kalkulator (resultattekst) (1) | Ingen | Lav | Nei |  |
| geometrisk | Kalkulator (veiledning) (1) | Ingen | Lav | Nei | Ett treff i veiledningstekst |
| gjeld | Veileder (38); Kalkulator (veiledning) (2) | Temakort om dyr gjeld | Lav | Nei |  |
| indeks | Veileder (10) | Ordforklaring i veilederen (`veileder-knowledge.js`) | Lav | Nei |  |
| kapitalforsikring | Veileder (13) | Ordforklaring i veilederen (`veileder-knowledge.js`) | Lav | Ja |  |
| lavere og høyere vekst / utfallsrom | Eksport (9); Kalkulator (6); Kalkulator (resultattekst) (5); Kalkulator (veiledning) (2) | Hjelpeknapp i grafen; metodepanelet | Lav | Nei | Allerede forklart der det står |
| like prosentsteg (logaritmisk akse) | Kalkulator (3); Eksport (3) | Hjelpeknapp i grafen | Lav | Nei | Allerede forklart der det står |
| nominell | Kalkulator (veiledning) (1) | Ingen | Lav | Nei | Ett treff. Vurder å unngå ordet i teksten |
| nøkkelinformasjon | Veileder (2) | Nevnt i svaret om indeksfond | Lav | Ja | Fondets nøkkelinformasjon er et regulert dokument |
| passiv / aktiv forvaltning | Veileder (6) | Ordforklaring i veilederen (`veileder-knowledge.js`) (passiv forvaltning) | Lav | Nei | Aktiv forvaltning er ikke forklart |
| pensjon | Veileder (37); Kalkulator (2); Kalkulator (veiledning) (1) | Temakort «Sparing til pensjon» | Lav | Ja |  |
| plattformgebyr | Veileder (3); Kalkulator (1); Kalkulator (veiledning) (1) | Nevnt i svaret om indeksfond | Lav | Nei |  |
| regneeksempel | Kalkulator (6); Veileder (5); Kalkulator (forutsetninger) (1) | Ingen | Lav | Nei | Ordet forklarer seg langt på vei selv |
| sparemål | Kalkulator (10); Personvern (1); Eksport (1); Kalkulator (veiledning) (1) | Ingen | Lav | Nei | Egen del av kalkulatoren |
| sparetid | Veileder (4); Eksport (4); Kalkulator (2); Kalkulator (resultattekst) (2); Personvern (1) | Ingen | Lav | Nei | Felt i kalkulatoren. Ordet forklarer seg langt på vei selv |
| standardavvik | Ikke i synlig tekst | Ingen | Lav | Nei | Bare i kode og kommentarer, ikke synlig tekst i dag |
| startbeløp | Kalkulator (9); Kalkulator (veiledning) (3); Veileder (1); Kalkulator (resultattekst) (1) | Ingen | Lav | Nei | Felt i kalkulatoren |
| utbytte | Veileder (3); Kalkulator (forutsetninger) (1) | Ingen | Lav | Nei |  |

## Funn

1. **Kalkulatorens viktigste ord mangler forklaring der de står.** Avkastning, forventet avkastning, prisvekst, dagens kroner, årlig kostnad og risiko er forklart bare i veilederen eller i metodepanelet, ikke ved feltene og i resultatet. Det er her forklaring der ordet står (UU-standarden, punkt 6) gir mest.
2. **To ord for samme ting.** «Sparetid» brukes i kalkulatoren og «sparehorisont» i veilederen. «Renters rente» og «rentes rente» brukes begge. SPRAKREGLER krever ett navn per ting. Bør avgjøres før forklaringene skrives.
3. **Metodepanelet forklarer mye, men er gjemt.** Det beskriver blant annet innskudd ved månedsslutt, dagens kroner og lavere og høyere vekst. Det er også et godt utgangspunkt for notatet om beregningskonvensjoner (veikartet 1.3.0).
4. **Forslag til første prøvepulje for GPT,** begreper uten regler og satser og med høyt behov: forventet avkastning, prisvekst og inflasjon, dagens kroner, årlig kostnad, risiko. Deretter avkastning, renters rente og kjøpekraft, som allerede har forklaringer som kan gjenbrukes. Dette er et forslag. GPT og Lars bestemmer puljen.
