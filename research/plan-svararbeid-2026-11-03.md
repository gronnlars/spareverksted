# Plan for spørsmål og svar fra november 2026

**Implementeringsstatus 3.11.2026:** Lars har bestilt implementering. Anbefalingene er lagt til grunn. Validator, generator, avhengighetsindeks, kontrollbevis og CI er implementert. To pilotskjemaer er overført som utkast. Faglig pilotkontroll og godkjenning gjenstår. Trinn 4 til 6 er videre innholdsarbeid, ikke gjennomført. Se [svargrunnmur](../docs/svargrunnmur.md). Resten av dokumentet bevarer Claudes opprinnelige plan.

Laget av Claude 3. november 2026 på main `4008b01`. Forslag til Lars, ikke vedtatt. Skrevet slik at ChatGPT og andre modeller kan føre arbeidet videre uten Claude. Standarden står i [SVARSKJEMA.md](../SVARSKJEMA.md). Denne fila sier i hvilken rekkefølge den tas i bruk, og hva Lars må avgjøre.

Regeldokumentene ([docs/regulatorisk.md](../docs/regulatorisk.md), [KILDEREGLER.md](../KILDEREGLER.md), [SPRAKREGLER.md](../SPRAKREGLER.md), [SVARMAL.md](../SVARMAL.md)) går foran denne planen.

## 1. Hva som er undersøkt

- Lest på main `4008b01`: AGENTS.md, SVARMAL.md, KILDEREGLER.md, SPRAKREGLER.md, SPORSMALSKO.md, SOK.md, docs/regulatorisk.md, research/plan.md (punkt 6 til 10), research/DAGLIG-OPPGAVE.md, starten av research/ARBEIDSLOGG.md og relevante oppføringer i BESLUTNINGER.md.
- Lest kode: `dist/veileder-knowledge.js` (de tre publiserte svarene i sin helhet), `dist/veileder-engine.js` (hvilke felt svarbasen krever), `dist/veileder-cards.js`, `dist/veileder-context.js`, `dist/publiserte-svar.js`, `kilder/fakta/`, `kilder/begreper/`, `kilder/register.json`, starten av `kilder/kildeliste.json` og `scripts/fakta.py`.
- Lest tester som styrer publisering: `tests/published-answers.test.cjs` og `tests/svarmal.test.cjs`.
- Målt ordtall i fem svar med `node`, for å sette veiledende lengder i skjemaet.
- Lest GPTs gjennomgang av Tidsmaskin og Kildevakt (3.11.2026, main `e007f3e`). Skriptene og arbeidsflytene er ikke endret mellom `e007f3e` og `4008b01` (`git log` tom). Funn 1 er gjenskapt lokalt: `python3 scripts/kildevakt.py tilgang` stopper med `KeyError: 'url'`. Arbeidsflyten oppgir ikke `shell: bash`, så røret gjennom `tee` skjuler feilen. Funn 2 er bekreftet i koden: `hent` avgjør returkoden bare ut fra `verify()`, ikke ut fra hentefeil. Funn 3 til 7 er ikke prøvd av meg.
- Ingen kilder er lest i denne økta. Planen inneholder derfor ingen faktapåstander om satser eller regler.

## 2. Hva jeg fant

**Viktig:**

1. **Reglene er gode, men spredt og delvis utdatert.** Dokumentene en skribent skal lese, er på til sammen omtrent 250 kB, BESLUTNINGER.md alene 118 kB. Tre steder sier noe som ikke stemmer lenger: research/DAGLIG-OPPGAVE.md har fortsatt «STANS» øverst selv om pausen ble avsluttet 2.11.2026, research/plan.md punkt 6 sier at innholdspåfyllet er «overstyrt av prosjektpausen», og køen viser SV-035 og SV-017 som «Integrert, avventer publisering» selv om svarene ble trukket 29.10.2026. En mindre modell vil følge den linjen den leser sist.
2. **Ingen utfyllingsform speiler svarbasen.** Svar skrives rett inn i `dist/veileder-knowledge.js`, som blander JavaScript, JSON og regulære uttrykk. Bare SV-022 har et generatorskript.
3. **Publiserte svar mangler kobling mellom påstand og kilde.** Kontrollteksten lister kildene, men ikke hvilken setning hver kilde støtter. En kontrollør må finne det ut på nytt hver gang. Det gjør kontrollen treg og lett å gjøre halvveis.
4. **Ni statusnavn med overlappende betydning** i køen, for eksempel «Delkontroll, åpne funn» og «Utkast med forbehold».
5. **Rundt 30 av 149 spørsmål i køen spør hva brukeren bør gjøre.** De kan ikke besvares slik de står, etter docs/regulatorisk.md.
6. **Kildevakt kan vise grønt når en kontroll har feilet** (GPTs funn 1 og 2, bekreftet). For svarene betyr det at grønn Kildevakt ikke er bevis på at et tall er oppdatert.

**Bevisst og bør beholdes:** Et svar vises bare når ID-en står både i `dist/publiserte-svar.js` og i lista i `tests/published-answers.test.cjs`. Dobbeltføringen beskytter mot at et svar vises ved en feil. Den er nå beskrevet i skjemaet, punkt 4E.

**Valgfritt, senere:** Svarbasen har sju kategorier og ingen for skatt. Forklaringer trenger ingen kategori. Den første sammenligningen innen skatt, lån eller pensjon krever en beslutning (D7).

## 3. Det som er laget i denne økta

- [SVARSKJEMA.md](../SVARSKJEMA.md): skjema, statuser, roller, arbeidsgang, feltregler, stoppregler og ferdige oppdragstekster.
- Denne planen.
- Små koblinger: AGENTS.md (leseliste), research/DAGLIG-OPPGAVE.md (statuslinje og henvisning til skjemaet), SPORSMALSKO.md (varsel om utdaterte statuser) og en foreslått oppføring i BESLUTNINGER.md.
- Ingen endring i `dist/`, tester, skript eller arbeidsflyter. Ingenting er pushet eller publisert.

## 4. Beslutninger for Lars

Lars kan svare kort, for eksempel «D1 A, D2 A, D3 A, D4 B, D5 A, D6 A».

| Nr | Spørsmål | Alternativer | Anbefalt |
| --- | --- | --- | --- |
| D1 | Hva er fasiten for et svar? | **A.** Ett skjema i Markdown med faste overskrifter, kontrollert av skript, svarbasen generert. **B.** JSON per svar, som faktaregisteret. **C.** Som i dag, rett i svarbasen | A. Lars og ChatGPT kan lese og skrive skjemaet i samtale uten omgjøring. Faste overskrifter er lette å følge for mindre modeller, og et skript kan stoppe avvik |
| D2 | Hvor ligger skjemaene? | **A.** `kilder/svar/`, ved siden av fakta og begreper. **B.** `research/svarutkast/` | A. Skjemaet blir kilden nettsiden lages fra, ikke bare research |
| D3 | Hvem kontrollerer når Claude ikke er tilgjengelig? | **A.** Ny ChatGPT-økt med kontrolloppdraget, merket «KI-kontroll i ny økt». **B.** Lars. **C.** Vente på Claude | A, pluss at Lars tar stikkprøve av én eller to påstander i svar om regler og satser |
| D4 | Skal nattkjøringen starte igjen? | **A.** Nå. **B.** Etter piloten i trinn 2. **C.** Ikke, bare når Lars ber om det | B. Først når skjemaet har vært gjennom hele kjeden to ganger |
| D5 | Titler for «Bør jeg»-spørsmål | **A.** Skrives om etter SVARSKJEMA punkt 8, brukerens ord blir søkeinngang. **B.** Brukerens ord som tittel, premisset rettes i kortsvaret | A. En tittel som spør «Bør jeg» lover et råd |
| D6 | Veiledende lengder | **A.** Kort svar 60 ord, fordel eller ulempe 5 og 45 ord, eksempel 80, fordypning 90 per del, 300 totalt som i SVARMAL. **B.** Bare 300 totalt | A. Faste tall er lettere å følge. Overskridelse begrunnes |
| D7 | Kategorier for sammenligninger i fase 4 | Avgjøres før første sammenligning innen skatt, lån eller pensjon | Ikke nå |

## 5. Rekkefølge

### Trinn 0. Lars avgjør D1 til D6

### Trinn 1. Opprydding (ChatGPT eller Codex, én dokumentasjons-PR)

1. Legg endringene fra denne leveransen i en PR, og slå den sammen etter Lars' godkjenning.
2. Oversett statusene i køen med tabellen i SVARSKJEMA punkt 2. Sjekk hver rad mot `dist/publiserte-svar.js` og `dist/veileder-knowledge.js`, ikke mot køen selv.
3. Rett research/plan.md punkt 6, så det ikke lenger viser til pausen.
4. Ta bort den gamle malen i research/DAGLIG-OPPGAVE.md og vis til SVARSKJEMA punkt 5.

### Trinn 2. Pilot med to svar gjennom hele kjeden

- **BSU (`q-bsu-basics`, publisert):** Fyll skjemaet fra den publiserte teksten, og bygg påstandstabellen ved å lese kildene. Det er samtidig en reell gjennomgang etter punkt 4F. Prøven viser om skjemaet kan holde et publisert svar uten tap.
- **Renters rente (`q-renters-rente`, trukket 29.10.2026):** Kvalifiser på nytt etter punkt 4B til 4E.

Ferdig når en kontrollør i ny økt har gått gjennom begge etter 4C uten å spørre skribenten, Lars har lest den offentlige delen, og det som var tungvint i skjemaet er justert én gang. Ingen nye justeringsrunder før ti svar er gjennom. Bra nok er mer enn nok.

### Trinn 3. Kontrollskript (Codex eller Claude, egen PR)

`python3 scripts/svar.py --check`, bare standardbiblioteket, kjøres i CI. Det skal stoppe:

- manglende, ekstra eller omstokkede overskrifter, og påkrevde felt uten innhold,
- ugyldig status, og datoer som ikke følger `published ≤ changed ≤ checked`,
- `[Pn]` i teksten som ikke finnes i påstandstabellen, og rader som ikke brukes,
- kilde-ID-er i påstandstabellen som ikke står i kildetabellen,
- `{{ID}}` og `{{begrep:ID}}` som ikke finnes i registeret,
- tankestrek og tre prikker i den offentlige delen,
- tittel som begynner med «Bør».

Det skal varsle, ikke stoppe, ved ordtall over veiledningen og ved uttrykk som «best for deg», «du bør», «vi anbefaler» og «garantert» i den offentlige delen. Hver regel får en test med ett moteksempel som feiler.

Deretter `python3 scripts/svar.py bygg`, etter samme mønster som `scripts/fakta.py`: lager svarbasens poster fra skjemaene i en egen generert fil, slik at den håndskrevne fila krymper svar for svar. Da forsvinner ord-for-ord-sammenligningen i punkt 4E.

### Trinn 4. De trukne svarene på nytt, to per PR

Teksten finnes, og flere av dem bærer prinsippet «fra tall til forståelse»: `q-kjopekraft` (dekker også SV-023), `q-indeksfond` (SV-035), `q-sparing-investering` (SV-017), deretter `q-ips-ask` (SV-087, SV-090) og `q-ask-zero` (SV-034).

### Trinn 5. Nye svar i fase 4

Bolig og lån først, fordi de også forbereder lånekalkulatoren. Deretter skatt og pensjon. Forslag til de tolv første, med nøytrale titler etter punkt 8:

| Kø-ID | Tittel | Svarform | Vedlikehold |
| --- | --- | --- | --- |
| SV-101 | Hvordan fungerer annuitetslån og serielån? | Regnemåte | A |
| SV-103 | Fast og flytende boliglånsrente: hva er forskjellen? | Sammenligning (krever D7) eller ordning | A, B |
| SV-029 | Hvor mye egenkapital kreves for å kjøpe bolig? | Ordning | B |
| SV-104 | Hvordan vurderer banken gjeldsgrad og om du tåler høyere rente? | Ordning | B |
| SV-106 | Hva koster et boligkjøp utover kjøpesummen? | Ordning | B |
| SV-110 | Hvordan virker fradraget for gjeldsrenter? | Ordning | B |
| SV-112 | Hvordan skattlegges renteinntekter? | Ordning | B |
| SV-102 | Refinansiering: hva koster det, og hva kan det spare? | Regnemåte | A, B |
| SV-109 | Hva er formuesskatt, og hvem omfattes? | Ordning | B |
| SV-111 | Når er gevinst ved boligsalg skattefri? | Ordning | B |
| SV-073 | Hva er alderspensjon fra folketrygden? | Ordning | B |
| SV-077 | Hva er tjenestepensjon? | Ordning | B |

SV-002 («Bør jeg betale ned boliglånet eller spare i fond?») er det viktigste spørsmålet på sikt, men avhenger av SV-101, SV-110 og SV-035, og helst av lånekalkulatoren. Det venter til de finnes.

### Trinn 6. Relevans i veilederen (fase 3)

Når rundt ti publiserte svar har feltet «Relevant når», kan visningen bygges i egen PR etter SVARSKJEMA punkt 10. Lars godkjenner.

### Parallelt: spor T, GPTs funn i skriptene

I GPTs rekkefølge, små PR-er, og moteksemplet skal feile før rettingen og bestå etter:

1. Tilgangstesten finner kilde etter ID, og arbeidsflyten bruker `shell: bash` eller `set -o pipefail` (funn 1, gjenskapt).
2. `tidsmaskin.py hent` gir feilstatus ved hentefeil og når forventede kilder mangler (funn 2, bekreftet i koden).
3. Varig kø for varsler og SSB-PR-er (funn 3).
4. Tilbaketrukne SSB-observasjoner og stabil saksnøkkel (funn 4 og 5).
5. Rådatabevaring og presis statusdokumentasjon (funn 6).
6. Serieavtale og metodekontroll før historiske beregninger (funn 7).

Til punkt 1 til 4 er rettet, gjelder SVARSKJEMA punkt 4G, nummer 5: grønn Kildevakt flytter aldri «Sist gjennomgått».

## 6. Arbeidsrytme

- Høyst to svar per PR.
- Høyst fem svar med status `til kontroll` eller `kontrollert` samtidig. Lars' godkjenning er flaskehalsen, og uleste utkast hjelper ingen.
- Mål for Lars' tid per svar: under ti minutter. Han leser den offentlige delen, sperrene og «Ikke kontrollert», ikke påstandstabellen.
- Funn i kontrollen føres med nummeret i 4C. Etter ti svar ser vi hvilke nummer som oftest får nei, og lar skriptet ta dem der det går.

## 7. Usikkert og ikke gjort

- Skjemaet er ikke prøvd av en annen modell ennå. Det er hensikten med piloten.
- GPTs funn 3 til 7 er ikke gjenskapt av meg.
- Ingen tester er kjørt, fordi ingen kode er endret. Lenker og tegn i de nye dokumentene er kontrollert lokalt.
- Ingen brukertesting av forståelse. Det er ikke et krav (beslutning 24.10.2026), men det betyr at vi ikke vet om svarene blir forstått slik vi tror.
