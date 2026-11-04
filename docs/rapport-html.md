# HTML fra den eksisterende rapporten

Bestilt av Lars 4. november 2026. Ett formatvalg «Rapport (HTML / PDF)» åpner den eksisterende forhåndsvisningen. Der velges HTML eller PDF/utskrift. Ingen femte formatknapp i hoveddialogen.

## Innhold og avgrensning

`dist/report-html.js` bruker `printReportContent`, som allerede inneholder rapporten som vises. Den regner ikke på nytt og velger ikke planer på nytt. Samme knapp dekker vanlig spareplan, sparemål, uttak, sammenligning og valgte planer. PDF-kopien, utskriftskontrolleren og alle beregninger beholdes.

HTML-filen inneholder hele dokumentet med norsk språk, tittel, overskrifter, gjeldende tema/stiler og SVG-grafer. Nettsidens utskriftsregler som skjuler kalkulatoren kopieres ikke. Fila får egne utskriftsregler. Skript og uvirksomme knapper følger ikke med. En egen CSP sperrer skript, forbindelser, objekter, rammer og skjemainnsending. Innebygde stiler tillates for å gjøre fila selvstendig. Dette endrer ikke nettstedets CSP.

Tabellverdier og merknader bevares. Kolonneoverskrifter får `scope=col`, første felt i hver rad får `scope=row`, og tabellen beholder `role=table` når radene vises loddrett. Radene og cellene bruker HTML-elementenes innebygde roller. Smal visning viser kolonnenavnet ved hvert felt. De gjentatte etikettene er dekorative for skjermlesere. Brede grafer skalerer med siden. Filnavn bruker små bokstaver, bindestrek og a/o/a for æ/ø/å.

Dette gir en vei utenom PDF-konverteringen. Det reparerer ikke PDF-filer, og filformatet alene garanterer ikke tilgjengelighet. En lagret rapport er fortsatt et øyeblikksbilde og oppdateres ikke når kilder eller beregninger på nettstedet endres.

## Kontroller

`tests/rapport-html-browser.cjs` laster ned faktiske filer fra alle fem rapportveier og åpner dem som lokale filer med JavaScript avslått. HTTP/HTTPS-ressurser sperres og telles. Testen kontrollerer:

- Samme tabellverdier og merknader som rapportkopien, og samme antall SVG-grafer.
- Riktig planutvalg, også når en tredje lagret plan ikke er valgt.
- Plan med HTML-lignende tekst i navnet forblir tekst.
- Norsk språk, én h1, gjeldende fargetema og stiler, ingen brutte ARIA-referanser.
- Ingen skript, eksterne stilark, kjørbare kontroller eller nettforespørsler.
- Ingen rulling på tvers av siden ved 256, 320, 390, 640 og 1280 CSS-piksler.
- Rapporten kan vises i utskriftsmediet, og nedlastingen endrer ikke PDF-kopien eller lukker forhåndsvisningen.

Lokalt bestått i Chromium med Playwright 1.56.0. Eksisterende PDF-merking, rapportutskrift og UU-nettlesertest består også. Sistnevnte omfatter kontrast, trykkflater, navn, reflow, fokus og tastatur i tre temaer. Sikkerhet, innholdsversjoner, syntaks og diff er kontrollert. HTML-testen er lagt tidlig i CI for Chromium, Firefox og WebKit. CI på siste commit må kontrolleres separat.

Fysisk iPhone/Filer, Safari, VoiceOver og faktisk PC-zoom er ikke prøvd. En smal testsides bredde er ikke en fysisk zoomtest. Ingen WCAG-poengsum eller full godkjenning påstås. Prøv spesielt nedlasting, åpning fra Filer, leserekkefølge og tabelloverskrifter på iPhone etter publisering.

## Designreferanser

Lest 4. november 2026:

- [Uu-tilsynet: Dokumenter](https://www.uutilsynet.no/veiledning/dokumenter/741), sist endret 16. januar 2024. Anbefaler HTML som hovedregel for informasjon på nett.
- [OMB M-23-22: Delivering a Digital-First Public Experience](https://www.whitehouse.gov/wp-content/uploads/2023/09/M-23-22-Delivering-a-Digital-First-Public-Experience.pdf), 22. september 2023, side 21–22. HTML som standard for nettinnhold. Gjelder amerikanske føderale etater, brukt her som designreferanse.

Oppdrag: Lars. Implementasjon og egenkontroll: ChatGPT/Codex. Ikke uavhengig hjelpemiddelkontroll.

## Retting etter Lars sin filkontroll

Lars lastet opp resultat fra Nu Html Checker 26.11.4 med blant annet tomme kantverdier ved linje 469 og mange utvidede reset-egenskaper ved linje 605. Den første eksporten kopierte hele stilark via nettleserens CSSOM. Da fulgte ubrukte knapperegler og sideoverganger med, og serialisering av kombinerte kortformer med CSS-variabler kunne gi tomme verdier. Dette var en feil i HTML-eksporten. Kodeutdrag i validatoren betyr ikke at rapporten er lest som ren tekst.

Stileksporten vurderer nå den ferdige rapporten og tar bare med regler som gjelder elementene der. Tomme deklarasjoner fjernes. Kortformer med `var(...)`, anførselstegn, parenteser og `!important` bevares. Sideoverganger og animasjon eksporteres ikke. Valgt tema på nettsiden beholdes i filen. Det legges ikke til et nytt temavalg i denne rettingen.

For tabeller beholdes `role=table`, mens rad-/cellerollene utledes fra `tr`, `th` og `td` med `scope`. Dette følger anbefalingen om native HTML-semantikk. Ekstra roller på native celler ga validatorutslag ved kontroll av sammenligningsrapportene. Browser-testen kontrollerer tabell, kolonneoverskrifter og radoverskrifter i bred og smal visning. Fysisk VoiceOver må fortsatt prøves.

Reprodusert lokalt i Chromium 141: vanlig rapport før rettingen ga 79 feil i Nu 26.11.4. Etter rettingen har alle fem rapportveier null HTML-/CSS-feil. Validatoren gir fortsatt informasjon om eksplisitt `role=table`. Denne rollen beholdes av hensyn til tabellgjenkjenning når layouten endres. Det er ikke en CSS-feil. Antall gamle feil kan variere mellom nettlesere og rapportinnhold.

Testen laster ned faktiske filer og validerer HTML/CSS med Nu også i GitHub Actions, for Chromium, Firefox og WebKit. Filene fra testene legges ved som testartefakter. Valideringen filtrerer ikke bort HTML- eller CSS-feil. Testen kontrollerer i tillegg at bakgrunnsfargen i resultatfeltet og strekfargen i grafen er lik forhåndsvisningen.

Lighthouse 13.6.0, lokal HTTP-server, Chromium 141, bare tilgjengelighetskategorien: 100/100 for vanlig spareplan i nøytralt tema, valgte planer i nøytralt tema og sparemål i mørkt tema. Ingen av rapportene ble publisert for prøven. Dette er automatiske målinger av disse tre testfilene, ikke full WCAG-godkjenning. Rapporttabeller, planutvalg, temaer, offline-åpning og uendrede verdier består i den lokale nettlesertesten. PDF-kontrolleren er uendret.

Kilder for semantikk: [W3C ARIA in HTML](https://www.w3.org/TR/html-aria/), anbefaling 11. august 2026, og [MDN om CSS display og tabeller](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/display), lest 4. november 2026. Kontroll og retting ved ChatGPT/Codex, egenkontroll. Ny CI må være grønn før sammenslåing.
