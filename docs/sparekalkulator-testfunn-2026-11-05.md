# Retting etter Lars sin test av #222

Arbeidsgrunnlag: main `ac3043af0148ae8f1cc0af56c632bb03e13a1657`. Gren: `fix/sparekalkulator-testfunn`. Lars ba om å stoppe den brede testrunden og rette funnene samlet, slik at manuell etterprøving blir overkommelig. Ikke slå sammen eller publiser uten nytt klarsignal. Kakediagram, tidslinje og opprydding i GitHub Actions inngår ikke.

## Rettet

| Funn | Endring |
| --- | --- |
| PC-brukeren kommer for langt ned i skjemaet uten vei til resultatet | Se resultat vises etter grunnfeltene også på PC. En egen knapp ved bunnen av feltpanelet går til resultatet. Retningen på pilen følger plasseringen. Ingen ny fast linje på PC |
| Årstallet følger med nedover og dekker verdier i radvis tabell | Radoverskriften i den stablede sparetabellen har nå statisk plassering. Vanlig tabellstruktur og kolonneoverskrifter beholdes |
| Lang mobiltabell krever mye blaing | Til siste år og retur til tabellstart ved lange tabeller. Den eksisterende resultatlinjens knapp brukes også til dette mens tabellen er i synsfeltet. Ingen ekstra flytende linje. Målet hentes fra den levende tabellens første/siste rad |
| Du setter inn kan oppfattes som årets innskudd | Innskudd totalt i resultat, sparetabell og graf. I kjøpekraftvisning beholdes presiseringen om dagens kroner. Radvis etikett har dekorativt kolon, kolonneoverskrift uten kolon. Beregningen er uendret |
| Sparetabellen mangler i rapport og nedlastet HTML/PDF | Rapporten får en egen del Sparing år for år, med en kopi av samme tabell som vises i kalkulatoren. Samme kolonner, år og verdier, også for delår og valgte visninger. Navigeringsfokus og dekorative mobil-etiketter fjernes fra rapportkopien |
| Finansportalen-lenken videresendes til en oversikt | Den ugyldige særlenken fjernes fra metode og rapportkilder. Eksisterende kilde Forbrukerrådet: Sparing i fond og spareprofiler beholdes. Den er åpnet 5.11.2026 og inneholder både sparehorisont og avsnittet om risiko og avkastning. Ingen ny anbefaling eller økonomisk sats er lagt til |
| Lange aksetekster klippes | Venstremargen i sparegrafen måles ut fra de faktiske etikettene. Grensen for gjentatt «over 1 000 trill.» håndteres som et eget ekstremtilfelle |
| Ekstremt store rapporter viser samme grenseangivelse som om det var ulike presise tall | Ved verdier fra 10²¹ kroner, rapportens eksisterende størrelsesgrense, vises en tydelig forklaring og Lars sin avtalte testhilsen. Rapportens HTML/PDF-knapper erstattes med Kontakt Lars, som lenker til om.html#kontakt. Vanlige rapportvalg gjenopprettes ved neste normale rapport |
| Risiko for at én ekstrem plan blokkerer andre rapporter | Åpen plan, sammenligning og valgte planer vurderes ut fra innholdet i den aktuelle rapportveien. En vanlig valgt plan kan fortsatt lastes ned selv om den åpne kalkulatoren er ekstrem. Skjult bankeksempel skal ikke blokkere rapporten |

I ekstremgrafen erstattes ubrukelige akser med forklaring. Det er en visningsgrense, ikke en ny begrensning av hvilke gyldige tall motoren kan regne på. CSV/Excel og brukerens lagrede tall er ikke erstattet av kontaktlenken. Vanlig PDF-utskriftsflyt er uendret.

Testhilsen, godkjent av Lars:

> Takk for at du tester hva kalkulatoren tåler! Hvis tallene er reelle, må du gjerne ansette et helt team til å hjelpe meg.

Kildekontroll: https://www.forbrukerradet.no/sparing-i-fond-og-spareprofiler/ åpnet 5. november 2026. Den gamle https://www.finansportalen.no/sparing/risiko-og-avkastning videresendes til https://www.forbrukerradet.no/finansportalen/ og gir ikke lenger den navngitte artikkelen. Det er ingen direkte sitater fra den gamle artikkelen i denne rettingen.

## Målrettet egenkontroll

`tests/testfunn-browser.cjs` kontrollerer PC-knappen og fokus, uendret referanseresultat 385 265 kr, samlet innskudd, radoverskrift uten fast plassering, første/siste årsrad, den eksisterende resultatlinjens tabellhopp, ingen siderulling ved 256–640 px med alle felt åpne, identiske tabellverdier i kalkulator og rapport, 11 rader for år 0–10 i HTML/PDF-kopien, lokal HTML uten JavaScript, plass til lange aksetekster ved 256–1280 px og lineær/logaritmisk skala, ekstrem/normal rapport og uavhengig planutvalg.

Testen er også prøvd på main før rettingen. Den stopper ved den manglende knappen ved bunnen av PC-skjemaet. Dette er et dokumentert moteksempel, ikke en påstand om at alle skjermbildene fra fysisk iPhone er gjenskapt.

Ved 256 px med alle avanserte felt åpne fant kontrollen også overløp fra den lange kostnadsetiketten og Regn mot mål. På denne bredden får de aktuelle feltparene én kolonne, og målknappene kan bryte til ny linje. Det legges ikke inn mindre skrift eller skjuling av felt.

Lokalt består den nye testfunn-kontrollen, navigering, inndata, spareform, forklaringsoppdatering og PDF-merking i Playwright 1.56.0 / Chromium 141. HTML-kontrollen består for fem rapportveier, med Nu HTML/CSS-validering uten feil i nedlastede filer. Tilgjengelighetskontrollen består for kontrast, navn, trykkflater, tastatur, korte vinduer og reflow ved 320/640 px i tre temaer. Resultatene fra disse kontrollene gjelder denne arbeidsgrenen, ikke en full manuell godkjenning. Skjermbilder av vanlig og ekstrem rapport er gjennomgått. Sikkerhet, fakta, filversjoner, syntaks, diff og vern mot gammel kode kontrolleres før opplasting. Motor-, resultat-, forklarings- og grafsammendragstestene består. `dist/engine.js`, `dist/report-print.js`, lagringsnøkler og finansielle forutsetninger er ikke endret. Endrede tekstforventninger i eksisterende tester følger Lars sitt vedtatte navn Innskudd totalt. Tallkravene er beholdt.

Full CI er ikke overvåket. Ingen flere trinn er lagt til GitHub-arbeidsflyten i dette oppdraget. Fysisk Safari/iPhone, VoiceOver, Firefox og reell PC-zoom må fortsatt skilles fra lokal Chromium-kontroll.

## Kort ny testliste for Lars

Bruk oppdiktede planer og behold ekte lagrede planer. Test denne nye arbeidsversjonen først etter at riktig versjon er gjort tilgjengelig. Den gamle brede listen skal ikke kjøres helt på nytt som vilkår for denne runden.

1. **PC-navigering:** Åpne feltdelene og gå til bunnen. Se resultat skal være synlig og ta deg til resultatkortet. Prøv også knappen etter grunnfeltene. Tallene skal være uendret.
2. **Lang tabell på iPhone:** Velg 10 år, Tabell og lavere/høyere scenario. Årstallet skal følge sin rad og ikke dekke beløp. Prøv Til siste år fra toppen og via resultatlinjen underveis. Du skal lande ved starten av siste årsrad. Prøv retur til tabellstart. Gjenta liggende.
3. **Innskudd totalt:** Med start 0, 1 000 kr/mnd., 0 % vekst, 0 % kostnad og 0 % årlig spareøkning skal år 1 vise 12 000 kr og år 2 vise 24 000 kr. Det er samlet innskudd, ikke en økning av månedsbeløpet. Prisvekst øker ikke innskuddene automatisk.
4. **Tabell i rapport:** Bruk start 50 000 kr, 2 000 kr/mnd., 10 år, 5 % vekst, 0,2 % kostnad og 2,5 % prisvekst. Ingen spareøkning, ekstra innskudd eller fall. Resultatet i Kroner skal være 385 265 kr, innskudd 290 000 kr og kjøpekraft 300 968 kr. Åpne rapport: Sparing år for år skal være med, med samme tabelltall som siden. Prøv HTML og PDF. Sjekk også Kjøpekraft og Begge.
5. **Vanlige akser:** Prøv høye beløp som fortsatt kan vises normalt, for eksempel 100 år med 15 % vekst og 0 % prisvekst. Etikettene skal holde seg innenfor grafen i stående og liggende visning. Prøv med og uten logaritmisk skala. Resultater kan bli store uten at rapportgrensen er nådd.
6. **Ekstremtilfelle og retur:** Sett deretter 100 % vekst i samme lange plan. Rapporten skal vise begrensningen, testhilsenen og Kontakt Lars. Knappen går til kontaktfeltet på Om-siden. Gå tilbake, reduser til vanlige tall og åpne rapport på nytt: HTML/PDF-knappene og vanlig rapportinnhold skal være tilbake. Sammenlign og velg også en vanlig lagret plan mens åpen plan er ekstrem. Den vanlige planen skal fortsatt kunne lastes ned.
7. **Kilde:** Lenken i Metode, forutsetninger og kilder skal åpne Forbrukerrådets navngitte artikkel. Rapporten skal ikke lenger føre opp den videresendte Finansportalen-artikkelen.

Prøv i tillegg 200, 400 og 500 % PC-zoom på punkt 1, 2 og 4. Noter bestått/feil, enhet, nettleser og zoom. Ved feil er det nok å sende punktnummer, handling og skjermbilde. Nye funksjoner og øvrig rydding venter til disse punktene er avklart.


## Parkert funksjonsidé

Kakediagram for innskudd og beregnet vekst, med tidslinje og eventuell avspilling, er diskutert og skal vurderes etter feilrettingene. Skill mellom vekst i en periode som overstiger periodens innskudd og samlet vekst som overstiger samlede innskudd. Et slikt punkt finnes ikke i alle scenarioer. Ved tap skal framstillingen være forståelig, og redusert kjøpekraft skal ikke kalles tap i kroner. Kakevalget kan dempes når framstillingen ikke passer, med eksisterende hjelpemønster uten ekstra tekstlinje. Denne funksjonen er ikke implementert her.

## Flere rapportfunn, meldt etter at utkastet var opprettet

Bildene IMG_3292–3295 viser den publiserte versjonen etter #222. #224 sto fortsatt som upublisert utkast da de ble gjennomgått.

- Rapporttabeller skal ikke beholde kolonneoppsett bare fordi teksten kan presses til å passe ved at et vanlig kronebeløp deles over flere linjer. I forhåndsvisningen måles derfor hele beløpet uten slik bryting før radvis visning velges. Tallene er uendret. Lange beløp kan fortsatt bryte mellom siffergrupper når selv en hel rad er for smal.
- Dette kontrolleres med fire planer, både i ren sammenligningsrapport og i en vanlig planrapport som inkluderer sammenligningen, ved 256, 320, 390, 640 og 1280 px. Vanlige beløp som 29 083 631 skal stå samlet når de har plass i en rad.
- Statisk rapporttekst ber ikke lenger brukeren trykke på søyler eller plannavn. Begge rapportveier bruker samme opprydding av sammenligningskopien. HTML-id-er, knappetilstander og klikkdata fjernes fra denne kopien. SVG-definisjoner for skravering bevares.
- Formatkortene får én kolonne på mobil. Excel står før Rapport også for valgte planer. I sammenligningsdialogens tokolonneoppsett får det tredje kortet full bredde. Korttitler starter på samme høyde.

Til punkt 4 i den korte testlisten: prøv både ren sammenligning og en vanlig planrapport med tre valgte planer pluss den åpne planen. Kontroller at vanlige beløp står samlet, at radvis visning har riktige plannavn, og at rapporten ikke gir instruksjoner om å trykke på statiske søyler. Formatdialogene skal være lesbare uten trange sideordnede kort på mobil.

Det rapporterte Aikido-varselet er bevart i [notatet til GitHub-gjennomgangen](github-oppfolging-2026-11-05.md). Ingen endring i GitHub Actions inngår.


## Siste visningsdetaljer etter #224

Arbeidsgrunnlag: main `61a236e3117f830e576862f2b8d4e6a369cb23e2`, hvor #224 er slått sammen. Gren `fix/siste-visningsdetaljer`. Ingen publisering uten Lars sitt klarsignal.

- Lange tabeller får to kompakte piler når resultatlinjen er lukket eller ikke vises på PC. Opp går til resultatkortet, ned til siste årsrad. Man trenger ikke åpne resultatlinjen for å bruke dem. Pilene vises bare mens tabellen er i synsfeltet. Tastatur og skjermleser får beskrivende navn og fokus på målet. Ved åpen resultatlinje brukes de eksisterende knappene.
- Resultatlinjen bruker korte enheter fra én million kroner, for eksempel «452,83 mrd. kr». Den har samme beregnede verdi som hovedresultatet. Skjermleser får den utvidede teksten. Hovedresultat, tabelltall, motor og lagring er uendret.
- Stripete bakgrunn er fjernet fra rapporttabeller i forhåndsvisning og HTML. Skillelinjer og overskrifter beholdes. PDF-kopien og utskriftsreglene er ikke endret.
- Formatvalg endres ikke. «Last ned planene» tilbyr Rapport og Excel. «Last ned sammenligningen» tilbyr Excel, CSV og Rapport.

Målrettet egenkontroll: `tests/testfunn-browser.cjs` består i Chromium, med begge piler og fokus ved 256, 390, 853 og 1280 px samt kort/utvidet beløpstekst. `tests/rapport-html-browser.cjs` består for fem rapportveier, HTML/CSS-validering, uendret PDF-kopi og fil uten nett eller JavaScript. Syntaks, versjoner, sikkerhetskontroll og vern mot gammel kode er kontrollert. Fysisk iPhone/Safari, faktisk PC-zoom og skjermleser er ikke testet her.

Bare disse tre kontrollene trengs nå:

1. På PC ved 150, 400 og 500 % zoom og på iPhone: åpne en lang tabell, lukk resultatlinjen og bruk pil ned. Bruk deretter pil opp til resultatet. Prøv også pil opp halvveis i tabellen. Pilene skal ligge i én lav rad uten å dekke hverandre eller knappen som åpner resultatlinjen.
2. Prøv et stort sluttbeløp i milliarder og billioner. Resultatlinjen skal bruke korte enheter, hovedresultat og tabell beholder sine egne tallvisninger. Prøv å åpne og lukke linjen ved sterk zoom.
3. Åpne både en vanlig planrapport og en sammenligningsrapport. Forhåndsvisning og HTML skal ha rolige tabellrader, tydelige overskrifter og samme beløp som før. Ingen ny full testrunde.


## Avtalt siste runde etter publisert #226

Arbeidsgrunnlag: main `d4656978c7ccf01e1024fc9a64db625757816e67`. Gren `fix/resultatlinje-og-rapportvalg`. Lars ba uttrykkelig om disse endringene. Ingen sammenslåing eller publisering inngår uten nytt klarsignal.

Resultatlinjen er tilgjengelig også på PC uten zoom, først nedenfor resultatkortet, med samme åpne/lukke-funksjon og eksisterende fokushensyn. Rapporten får en lav bunnlinje etter at toppknappene er rullet ut av syne. HTML/PDF bruker de samme handlingene som toppknappene. Opp og ned flytter fokus til rapportens topp eller siste innholdsdel. Lukk bruker eksisterende lukkeknapp. Ved smal skjerm er HTML/PDF samlet i et eget nedlastingsvalg. Escape lukker dette valget først, deretter kan rapporten lukkes som før. Ekstremrapporten har bare Kontakt Lars i bunnlinjen.

Bunnlinjen ligger utenfor rapportinnholdet som kopieres til HTML og PDF. Den endrer hverken beregning, lagring, rapportverdier eller utskriftsflyt. Lesbart linjeskift foran kr ved 500 % beholdes som avtalt.

Målrettede lokale kontroller i Chromium: `rapportvalg-browser.cjs` kontrollerer PC-linjen over/på/under resultatet, åpne/lukke, tre rapportveier, bunnvalg ved 256–1280 px (256 × 200 px for den korteste flaten), én lav rad, fokus, formatvalg/Escape, HTML-nedlasting uten bunnvalg, utskriftskall med bevart PDF-kopi, lukking og ekstremkontakt. `rapport-html-browser.cjs` består for fem rapportveier, Nu HTML/CSS-validering, frakoblet fil uten JavaScript og bevart PDF-kopi. `resultatlinje-browser.cjs` består for tidligere mobil-/zoom-/fokusforløp. Versjoner, syntaks, sikkerhet, diff og vern mot gammel kode kontrolleres før opplasting. Ingen full CI-oppfølging. Fysisk iPhone/Safari, reell PC-zoom og skjermleser er ikke testet her.

Etter publisering gjenstår bare:

1. **PC uten zoom:** Rull forbi grønt resultatfelt. Resultatlinjen skal komme, kunne lukkes og åpnes igjen, og forsvinne når du går tilbake til grønt felt.
2. **Rapport på PC og iPhone:** Åpne en vanlig rapport og en sammenligning, rull ned til toppknappene er borte. Prøv HTML/PDF, opp/ned og lukk fra bunnlinjen. På smal visning åpnes HTML/PDF fra nedlastingssymbolet. Kontroller at linjen holder seg lav ved 400 % og ikke følger med i filene. Ekstremrapporten skal fortsatt ha Kontakt Lars.
