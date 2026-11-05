# Kalkulatordesign

Vedtatt av Lars 4. november 2026. Gjelder alle kalkulatorer på Spareverksted: sparing, sparemål, uttak, lån og alt som kommer senere (for eksempel tidsmaskin, budsjett eller bolig).

**Malen er sparekalkulatoren**, fanen Sparing på `dist/index.html`. En ny kalkulator skal se ut og oppføre seg som den. Brukeren skal ikke merke at hen bytter kalkulator, bare at spørsmålet er et annet. Spareverksted skal være én sømløs opplevelse.

Avvik er lov når kalkulatoren trenger noe malen ikke har. Hvert avvik skal stå i tabellen «Godkjente avvik» nederst, med begrunnelse og hvem som godkjente det. Et avvik som ikke står der, er en feil som skal rettes.

Dokumentet gjelder sammen med disse, som går foran ved konflikt:

- [docs/regulatorisk.md](docs/regulatorisk.md): ingen produktråd, ingen «best for deg».
- [research/universell-utforming.md](research/universell-utforming.md): kravene til tastatur, skjermleser, kontrast, trykkflater og forstørring. De gjentas ikke her.
- [SPRAKREGLER.md](SPRAKREGLER.md), [KLARSPRAK.md](KLARSPRAK.md) og [KILDEREGLER.md](KILDEREGLER.md). Ordene i del 3 skal også oppfylle klarspråkstandarden.

Bra nok er mer enn nok. Malen er ikke en invitasjon til å bygge alt på nytt. Bruk komponentene som finnes.

## 1. Sideoppbygging

Delene kommer i denne rekkefølgen. Det som er felles for nettstedet (toppfelt, meny, bunntekst, fargetema), følger [AGENTS.md](AGENTS.md), «Ny side eller endring i utseende».

| Nr. | Del | Slik er den i malen | Krav |
| --- | --- | --- | --- |
| 1 | Overskrift | `h1#pageTitle` som et spørsmål, siste ord i `<em>`: «Hva kan sparingen *bli?*» | Én h1 per side og per steg. Spørsmålet brukeren vil ha svar på |
| 2 | Ingress | `p#introText`, én setning om hva du fyller inn og hva du får | Samme `id`, så stilen blir lik |
| 3 | Ny beregning | `button.text.guide-return` i `.intro` | Går til tallene. Samme plass og stil i alle kalkulatorer |
| 4 | Kalkulatorfaner | `.page-nav`: Sparing, Sparemål, Uttak, Lån | Samme rekkefølge og plass på alle kalkulatorsider. Like på pikselen enten fanen er knapp eller lenke (`tests/linjeforing-browser.cjs`) |
| 5 | Detaljnivå | Enkel, Utforsk, Avansert | Samme tre nivåer. Enkel viser det viktigste. Ingenting vesentlig skjules i Enkel |
| 6 | Tallene dine | Venstre kolonne på PC, øverst på mobil. Panel med overskrift og «Nullstill» | Få felt i Enkel. Mer bak `<details>` med kort oppsummering av verdiene |
| 7 | Resultat | `.hero-result`: liten etikett (h2), stort tall, én forklarende linje, nøkkeltall. Merke som «Før skatt» og «Last ned ↓» | Det viktigste resultatet først. Merket sier hva tallet ikke tar med |
| 8 | Endre tall | `button.text-link` «Endre tall ↑» under resultatet | Går tilbake til feltene med fokus på første felt |
| 9 | Dette betyr tallene dine | Kort forklaring i vanlige ord, mer bak «Mer om tallene» | Fra tall til forståelse: hva tallet betyr for brukeren |
| 10 | Graf | Panel med overskrift, Graf og Tabell, tegnforklaring, «Slik leser du grafen» | Tabell med samme tall. Tekstalternativ med hovedresultatet. Linjemønster, ikke bare farge |
| 11 | Prøv små endringer | Kort med én endring hver og knapp for å bruke den | Valgfri del. Viser sammenhenger, ikke råd |
| 12 | Lagre, del og sammenlign | Felles `<details>` i full bredde: «Lagre plan», «Del plan», «Last ned plan», liste med avkrysning, «Last ned planene» | Samme sted, samme ord og samme dialoger i alle kalkulatorer |
| 13 | Bakgrunnstall | For eksempel «Hva er vanlig å ha spart?» | Valgfri del. Kilde og dato synlig |
| 14 | Metode, forutsetninger og kilder | `<details>` til slutt | Samme overskrift i alle kalkulatorer |

## 2. Felt og inntasting

- Etikett over feltet, enhet inne i feltet til høyre (`kr`, `%`, `år`). Norsk tallformat: mellomrom som tusenskille, komma som desimaltegn.
- Hjelp med «?»-knapp ved etiketten. Fagord forklares med begrepsforklaring der de står ([research/universell-utforming.md](research/universell-utforming.md), del 6).
- Glidebryter er et tillegg. Tallfeltet er alltid hovedveien, og gyldige tall utenfor glidebryterens område skal kunne skrives inn.
- Ingen autoutfylling: `autocomplete="off"` på alle felt.
- Felt som kan være negative, har ikke `inputmode="decimal"` (iPhone mangler minus).
- Påkrevde felt sier det synlig: «(må fylles ut)».
- Feil vises ved feltet med feltnavn, er koblet til feltet og forsvinner når verdien er gyldig. Resultatet dempes og sier fra når det ikke lenger stemmer med tallene. Et ugyldig tall gir aldri et resultat som ser riktig ut.
- Eksempeltall er merket som eksempler.
- «Nullstill» og «Angre» virker likt i alle kalkulatorer.

## 3. Resultat, grafer og ord

- Et beregnet tall er et regneeksempel, ikke en prognose eller garanti. Skill mellom løpende kroner og dagens kroner (kjøpekraft) i tekst, graf og tabell.
- Grafen har akser med jevne verdier, samme skala når planer sammenlignes, og stiplet eller mønstret linje i tillegg til farge.
- Samme ting har samme navn overalt. Bruk ordene fra malen:

| Handling eller del | Ord |
| --- | --- |
| Lagre | «Lagre plan», dialog «Ta vare på denne planen» |
| Dele | «Del plan», dialog «Del denne planen» |
| Laste ned én plan | «Last ned plan», og «Last ned ↓» på resultatet. Dialog «Ta med deg beregningen». Utskrift er et valg i dialogen |
| Laste ned flere planer | «Last ned planene», med antall i parentes når noen er valgt. «Last ned planen» når bare én er med. Antall vises også ved én avkrysset plan. Dialog «Ta med deg planene». Fila har sammenligningen først og så hver plan |
| Rapport | Dialog «Rapporten din», knapp «Skriv ut / lagre som PDF» |
| Tilbake til feltene | «Endre tall ↑» |
| Starte på nytt | «Ny beregning» |
| Forklaring | «Dette betyr tallene dine», «Mer om tallene» |
| Metode | «Metode, forutsetninger og kilder» |

- Korte ord der det er mulig (Lars 4.11.2026). Det er best for universell utforming: lettere å lese med dysleksi, på liten skjerm og med forstørring, og raskere å høre med skjermleser. Ordet må fortsatt si det riktige, se [KLARSPRAK.md](KLARSPRAK.md), regel 13.
- Knapper bruker «plan» uten «denne» og uten navnet på kalkulatoren. Du står allerede i planen.
- Teksten skrives i jeg-form der det er en avsender, aldri «vi».

## 4. Lagring, deling og eksport

- Alt lagres lokalt i nettleseren. Ingen konto, ingen sending til server.
- Lagre åpner dialogen «Ta vare på denne planen» med forslag til navn. Like navn får første ledige nummer i parentes.
- Eksport har de samme formatene i samme rekkefølge der de passer: Excel (.xlsx), CSV, Rapport (HTML / PDF), Data (.json). Eksporten gir de samme tallene og forutsetningene som siden.
- Delte lenker inneholder bare tallene for kalkulatoren du ser på.

## 5. Rapport, HTML og PDF

- Ett rapportvalg «Rapport (HTML / PDF)» åpner forhåndsvisningen. Der velges «Last ned HTML» eller «Skriv ut / lagre som PDF». Samme rapport og planutvalg brukes i begge formatene, også ved sammenligning og valgte planer.
- HTML-filen er et selvstendig øyeblikksbilde med stiler og SVG-grafer. Ingen nødvendige skript, nettressurser eller beregninger ved åpning. Den bevarer språk, overskrifter, tekstalternativer og tabelltall. Smale tabeller vises radvis med etiketter. `dist/report-html.js` lager filen fra den eksisterende rapportkopien, og `tests/rapport-html-browser.cjs` åpner den nedlastede filen uten nett og JavaScript. Fysisk åpning fra Filer og VoiceOver på iPhone må prøves separat.

- Nedlastet HTML valideres som en egen fil med Nu Html Checker, med CSS-kontroll. Bare stiler som brukes i rapporten eksporteres. Rapporten følger nettsidens valgte tema, og testen sammenligner farger i forhåndsvisning og fil.

- Rapporten for Sparing inneholder også den viste sparetabellen, med de samme kolonnene og verdiene.
- Ved rapportens eksisterende størrelsesgrense på 10²¹ kr vises en tydelig begrensning og avtalt testhilsen. HTML/PDF-knappene erstattes i denne ekstremrapporten med «Kontakt Lars» til `om.html#kontakt`. Normal rapport gjenoppretter formatknappene.
- Rapporten lages med `dist/report-print.js`. Den lukker rapportvinduet mens PDF-en lages, slik at Chrome og Edge merker PDF-en, og åpner det igjen etterpå. Se BESLUTNINGER.md, «PDF-rapporten».
- Det samme gjelder når brukeren velger utskrift i nettleserens meny mens rapporten er åpen. Rapportens planutvalg beholdes. Et ignorert eller feilet utskriftskall skal gi rapporten, tittelen og fokus tilbake, med hjelp om nettleserens meny. Bruk utskriftshendelser, ikke mus eller berøring, til å avgjøre om utskrift pågår.
- Utskriftskopien har én h1 og nivåer uten hopp. Den h1-en blir PDF-ens tittel og forslag til filnavn.
- Ingen `aria-hidden` på utskriftskopien. Ingen knapper i utskriften.
- `<figure>` rundt en graf får `role="group"`. Grafen selv har `role="img"` og et tekstalternativ. Ellers blir det en tom figur i PDF-en.
- Hver plan har én overskrift på sitt nivå. En samlet rapport har sammenligningen under egen overskrift.
- `tests/pdf-merking-browser.cjs` kontrollerer dette. En ny kalkulator med rapport legges inn i testen.
- `tests/rapport-utskrift-browser.cjs` kontrollerer feil og retur for åpen plan, sammenligning og valgte planer. Fysisk iPhone/Safari må fortsatt prøves. PDF-arbeidet bygger på [PDF-teknikkene til WCAG 2.2](https://www.w3.org/WAI/WCAG22/Techniques/#pdf), sammen med prosjektets UU-krav. En teknikk eller en poengsum er ikke en full godkjenning.

## 6. Mobil og PC

- Mobil først. Under 761 px bredde ligger alt i én kolonne. Resultatlinjen nederst kan skjules og åpnes igjen, også på vanlig PC uten zoom. Den vises først nedenfor det grønne resultatkortet, aldri over eller på kortet, og skal ikke dekke feltet med fokus.
- På PC står tallene til venstre og resultatet til høyre. «Endre tall» vises i sparekalkulatoren når oppsettet har én kolonne. «Se resultat» finnes etter grunnfeltene og ved bunnen av PC-skjemaet. Kommandoen bruker det levende resultatfeltet som mål.
- «Lagre plan» finnes ved hovedresultatet og bruker samme lagredialog som plandelen.
- Spareperioder i forklaring og rapport vises med år og måneder, avrundet til samme antall måneder som motoren. Desimalår i tallfelt og eksportdata beholdes.
- Resultatkortets delbeløp følger plassen i kolonnen og legges under hverandre ved plassmangel. Siffergrupper skal ikke deles midt i sifrene.
- Rapportens forhåndsvisning bruker samme radvise tabellmønster ved plassmangel. Tilpasningen endrer ikke den separate PDF-kopien.
- En lang sparetabell har hopp til siste år og tilbake til tabellstart. Ved åpen resultatlinje brukes også den eksisterende knappen mens man leser tabellen. Når linjen er lukket eller ikke vises på PC, vises to små piler til resultat og siste år i tabellområdet. Årstallet følger egen rad i radvis visning.
- Samlede innskudd merkes «Innskudd totalt», med presisering om dagens kroner når det gjelder.
- Ingen sideveis rulling ved 320 px. Liggende mobil skal fungere.
- Ingen plutselige sprang i oppsettet når tall endres.
- Fanene, ingressen og «Ny beregning» står likt på alle kalkulatorsider. Kontrollert i `tests/linjeforing-browser.cjs`.

## 7. Navn på filer, adresser og kode

Gjelder filnavn, nettadresser, id-er, CSS-klasser, grener, testfiler og navn på nedlastede filer.

- Små bokstaver, ord skilt med bindestrek, bare a–z, 0–9 og bindestrek.
- **æ blir a, ø blir o, å blir a.** Eksempler: `lan.html` (lån), `sparemal` (sparemål), `kjopekraft` (kjøpekraft), `spor.html` (spør), `forbrukslan`, `sarlig` (særlig).
- Ikke «ae», «aa» eller «oe». Eksisterende navn med «aa» (`laan`, `ressursmaaling`) skal endres. Gamle nettadresser må fortsatt virke og sende brukeren videre.
- Nøkler i nettleserens lagring beholdes (`sv-...`). Endres de, forsvinner brukernes lagrede planer.
- Tekst brukeren ser, skrives alltid med æ, ø og å.

Kilde: Språkrådet, «Æ, ø og å i internasjonal sammenheng» ([sprakradet.no](https://sprakradet.no/spraksporsmal-og-svar/ae-o-og-a-i-internasjonal-sammenheng/)), lest av Lars 4.11.2026: «Det finnes en norsk standard (NS 4129:1995) «Kontordokumenter og blanketter. Utforming» der dette mønsteret er tilrådd: æ > a (Næs > Nas), ø > o (Løland > Loland), å > a (Aas > As).» Språkrådet praktiserer dette selv (`sprakradet.no`). De nevner ae, o og a som «en annen løsning», og at ae, oe og aa har den ulempen at oe kan forveksles med oe i navn og aa kan leses som lang a. «Det finnes ingen lytefri løsning.» Lars ba først om ae, o og a. Regelen følger standarden Språkrådet tilrår, fordi målet var å følge Språkrådet. Ingen navn i repoet kom fra æ da regelen ble vedtatt.

## 8. Før en kalkulator regnes som ferdig

1. Delene i del 1 står i riktig rekkefølge, eller avviket står i tabellen under.
2. Ordene i del 3 er brukt.
3. `tests/linjeforing-browser.cjs`, `tests/pdf-merking-browser.cjs`, `tests/a11y-browser.cjs` og `tests/bunntekst-browser.cjs` omfatter den nye siden og består.
4. Lars har prøvd den på iPhone og PC etter publisering.
5. Det som ikke er kontrollert, står som «ikke testet» i PR-en.

## Godkjente avvik

| Kalkulator | Avvik | Begrunnelse | Godkjent |
| --- | --- | --- | --- |
| Sparemål | Tre kort (lavere, moderat og høyere risiko) i stedet for graf som hovedresultat | Spørsmålet er hva du må spare, ikke hvordan pengene vokser. Kortene viser risiko ved siden av hverandre | Eksisterte da malen ble vedtatt. Lars bekrefter |
| Uttak | Startbeløpet kommer fra spareplanen («Endre spareplanen ↗») | Uttak bygger på det du har spart | Eksisterte da malen ble vedtatt. Lars bekrefter |
| Lån | Merket sier «Før rentefradrag» i stedet for «Før skatt» | Det er skatteeffekten som ikke er med for lån | Eksisterte da malen ble vedtatt. Lars bekrefter |

## Kjente avvik som skal rettes (4. november 2026)

Funnet ved å sammenligne sidene på main. Rettes i egne, små PR-er. Når et punkt er rettet eller godkjent som avvik, flyttes det.

- Lån: lagrede planer står i eget panel i resultatkolonnen, ikke i den felles delen «Lagre, del og sammenlign planer» i full bredde. Lån mangler «Del plan».
- Lån: panelet «Nominell og effektiv rente» står som egen del. Vurder å flytte det til «Mer om tallene» eller en begrepsforklaring.
- Lån: filnavnene bruker «laan». Skal være «lan» etter del 7. Navnene på nedlastede filer er rettet i #214.
- Knappetekster, vedtatt av Lars 4.11.2026: rettes i #214 («Lagre plan», «Last ned plan», «Last ned planene»/«Last ned planen»).
- Lån: «Dette betyr tallene dine» og «Metode, forutsetninger og kilder»: rettes i #214.
- `ressursmaaling` (arbeidsflyt og skript) bruker «aa».


### Rapportvalg etter nedrulling

Rapportforhåndsvisningen beholder knappene øverst. Når disse er rullet ut av syne og det er nok leseplass, vises en lav bunnlinje med HTML, PDF, opp til rapportens topp, ned til bunnen og lukk. Rapportteksten rulles i en egen flate over linjen. Bunnlinjen har egen plass inntil dialogens bunnkant og ligger aldri over teksten. Ved smal visning samles HTML/PDF i ett nedlastingsvalg. Ved høyst 360 CSS-piksler i vindushøyde, under 248 CSS-piksler i bredde eller hvis linjen ville tatt mer enn en tredjedel av dialogen, skjules den helt. Toppknappene kan fortsatt nås ved å rulle opp. × betyr alltid lukk rapporten. Bunnlinjen bruker eksisterende nedlastings- og utskriftshandlinger og ligger utenfor både HTML- og PDF-kopien. I ekstremrapporten vises bare Kontakt Lars dersom bunnlinjen trengs og får plass. Avtalt med Lars 5. november 2026 etter test av #226. Linjeskift foran «kr» ved 500 % beholdes når tallet er lesbart og ikke klippes.

På PC med mus er lukket resultatlinje en liten knapp til venstre, også når zoom gir smal visning. Berøringsvisningens eksisterende trykkflate og sikkerhetsfelt beholdes. Presisert etter Lars sine skjermbilder 5. november 2026.
