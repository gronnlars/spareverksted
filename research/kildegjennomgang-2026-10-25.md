# Kildegjennomgang: løpende kontroll av eksisterende innhold

## Delkontroll 28.10.2026: BSU og IPS

[Fullt kontrollnotat](svarutkast/KONTROLL-BSU-IPS-2026-10-28.md). SV-133 og SV-087/SV-090, to eksisterende svar. Kontrollerte 2026-grenser samsvarer med Skatteetatens veiledning. Dokumentert dekningshull ved søk om BSU til oppussing. Sparevaneeffekten i IPS-svaret mangler støtte i den leste kilden. Åtte søk og 14 systematiske profiltilfeller kjørt i Node: dyr gjeld kombinert med manglende buffer bytter alternativkort i begge svar. Dette er eksisterende kodeatferd, ikke ny funksjonalitet eller juridisk avklaring. Ingen produktendringer. K7-runden, full kontroll av arvede råd, uavhengig kontroll og faktisk visning gjenstår.

## Videreført delkontroll 28.10.2026: ASK og fondskonto

Lest main-commit `00d8f1536802b69eebf05a1034f388bd87550d9f`. PR #90 er nå sammenslått. [Kontrollnotat med påstandsdekning, kilder, regneforutsetninger, søkeprøve og reparasjoner](svarutkast/KONTROLL-ASK-FONDSKONTO-2026-10-28.md).

**Rettelse av tidligere funn i denne rapporten:** En `/en/`-adresse beviser ikke engelsk fagtekst. Den eksisterende Skatteetaten-rettledningen viser norsk innhold. Språkbruddet som ble konstatert tidligere, er derfor ikke dokumentert. De eldre formuleringene nedenfor står som kontrollhistorikk og er erstattet på dette punktet.

Konkrete nye funn: fondskontosvaret mangler avgrensning mot garantert avkastning og omtaler en eldre rettledningsversjon. ASK-kortsvaret bør synliggjøre skjerming. De publiserte knowledge-, facts- og ui-filene er byteidentiske med lest main. Regneeksemplene stemmer. Åtte lokale søketilfeller er kjørt, inkludert et for bredt treff for garantert kapitalforsikring. Ingen faktisk visnings- eller brukertest. Produktomtalen står urørt og er ikke nykontrollert.

Aktive avvik er gjennomgått: #67 er fortsatt foreslått, utløp 31.01.2027. Ingen datofestet aktiv dispensasjon funnet med utløp innen to uker. En fullført K7-runde etter statsbudsjettet er ikke dokumentert i de leste loggene. Fortsett kontrollarbeidet før ordinært nytt innhold.

### Utvidet register over eksisterende svar

Dette er en opptelling av 16 registrerte svar på lest main, ikke en ny prioritert kø eller full fagkontroll. De sju grunnsvarene bygges fra veileder-engine.js og veileder-cards.js, de ni øvrige fra veileder-knowledge.js. Kilde-ID-er nedenfor peker til disse filenes kilderegistreringer. Alle har plassering på spørresiden. Kildenes individuelle datoer, påstandsdekning og vedlikeholdsfrister må fortsatt kartlegges for svarene utenfor dagens delkontroll. Tom metadata skal ikke tolkes som at innholdet er tidløst.

| Svar-ID | Tittel | Kilde-ID-er | Lagret kontrolldato | Regelår / neste kontroll | Kontrollstatus |
| --- | --- | --- | --- | --- | --- |
| mortgage | Boliglån eller sparing | mortgage, pension, fixed, funds | 2026-10-22 | Ikke fullstendig kartlagt | Ikke ny fagkontrollert |
| student | Studielån | student, grant | 2026-10-22 | Ikke fullstendig kartlagt | Ikke ny fagkontrollert |
| children | Sparing til barn | child, adult, grant, funds | 2026-10-22 | Ikke fullstendig kartlagt | Ikke ny fagkontrollert |
| buffer | Buffer og dyr gjeld | mortgage, nav | 2026-10-22 | Ikke fullstendig kartlagt | Ikke ny fagkontrollert |
| funds | Sparekonto eller fond | funds, risk | 2026-10-22 | Ikke fullstendig kartlagt | Ikke ny fagkontrollert |
| pension | Sparing til pensjon | pension, mortgage, funds | 2026-10-22 | Ikke fullstendig kartlagt | Ikke ny fagkontrollert |
| bsu | BSU og boligkjøp | bsu, funds | 2026-10-22 | Ikke fullstendig kartlagt | Ikke ny fagkontrollert |
| q-renters-rente | Hva er renters rente? | rente-skatt, ssb-inflasjon, finanstilsynet-fond | 2026-10-25 | Neste kontroll 25.01.2027 i forbehold; øvrige datoer gjenstår | Ikke ny fagkontrollert |
| q-indeksfond | Hva er et indeksfond? | q-indeksfond-0, q-indeksfond-1, q-indeksfond-2, q-indeksfond-3 | 2026-10-25 | Neste kontroll 25.01.2027 i forbehold; øvrige datoer gjenstår | Ikke ny fagkontrollert |
| q-sparing-investering | Hva er forskjellen på sparing og investering? | q-sparing-investering-0, q-sparing-investering-1, q-sparing-investering-2, q-sparing-investering-3 | 2026-10-25 | Neste kontroll 25.01.2027 i forbehold; øvrige datoer gjenstår | Ikke ny fagkontrollert |
| q-aksjesparekonto | Hva er en aksjesparekonto (ASK)? | tax-ask-no | 2026-10-24 | Se kontrollnotatet | Delkontroll med åpne funn |
| q-fondskonto | Hva er en fondskonto? | tax-fondskonto-no, tax-fondskonto-rettledning, nordnet-ikz | 2026-10-24 | Se kontrollnotatet | Delkontroll med åpne funn |
| q-bsu-basics | Hva er BSU? | tax-bsu, funds | 2026-10-22 | Ikke fullstendig kartlagt | Ikke ny fagkontrollert |
| q-ips-ask | IPS eller ASK? | tax-ips, tax-ask, pension, mortgage, funds | 2026-10-22 | Ikke fullstendig kartlagt | Ikke ny fagkontrollert |
| q-ask-zero | ASK eller fondskonto? | tax-ask, tax-fondskonto, funds, risk | 2026-10-22 | Ikke fullstendig kartlagt | Ikke ny fagkontrollert |
| q-kjopekraft | Hva er kjøpekraft? | ssb-inflasjon | 2026-10-24 | Ikke fullstendig kartlagt | Ikke ny fagkontrollert |

De sju grunnsvarenes kilde-URL-er ligger i `sources` i motoren. Øvrige ligger i knowledge-filens konstanter og oppføringer. Kilderegistreringene er lest som kode, men kildene til de øvrige 14 svarene er ikke nyåpnet i denne økten. Kildetall i facts-filen har et felles årsfelt 2026; det er ikke dokumentasjon på at alle påstander i hvert svar er kontrollert for 2026.

## Tidligere delkontroll 28.10.2026: publisert svarfil

Denne delkontrollen erstatter ikke full fagkontroll. Den eldre rapporten nedenfor er historikk; dens konklusjon om ingen nivå 4-kilder og klassifiseringen av Nordnet er ikke gjeldende.

**Arbeidsgrunnlag:** main `0dd1007150ecb1c48f8f7e4c867b44224985537c`, KILDEREGLER.md og SPRAKREGLER.md på denne versjonen. Lars åpnet uttrykkelig kontrollarbeidet 28.10.2026. PR #90 er fortsatt åpen og er ikke behandlet som main. Ingen produktendringer eller publisering er gjort.

**Live-kontroll:** hentet https://spareverksted.no/veileder-knowledge.js 28.10.2026. Git blob-SHA beregnet fra responsen: `baa420596e669867e7c565a99fefb1464032ac7b`, identisk med filen på kontrollert main. Dette bekrefter selve svarfilen, ikke visning, søketreff eller alle andre filer. Live facts-fil er også hentet for å lese svarenes faktiske kontrolldatoer. Ingen nettleser-, skjermleser- eller uavhengig fagkontroll utført.

### Ni registrerte svar i denne filen

| ID | Tittel | Oppgitt kontrolldato |
| --- | --- | --- |
| q-renters-rente | Hva er renters rente? | 25.10.2026 |
| q-indeksfond | Hva er et indeksfond? | 25.10.2026 |
| q-sparing-investering | Hva er forskjellen på sparing og investering? | 25.10.2026 |
| q-aksjesparekonto | Hva er en aksjesparekonto (ASK)? | 24.10.2026 |
| q-fondskonto | Hva er en fondskonto? | 24.10.2026 |
| q-bsu-basics | Hva er BSU? | 22.10.2026 |
| q-ips-ask | IPS eller ASK? | 22.10.2026 |
| q-ask-zero | ASK eller fondskonto? | 22.10.2026 |
| q-kjopekraft | Hva er kjøpekraft? | 24.10.2026 |

Datoene over er nettstedets lagrede datoer, ikke ny kildekontroll utført i denne økten. Andre svar i veileder-engine.js og øvrige moduler er ennå ikke kartlagt i denne delkontrollen.

### Bekreftede dokumentasjonsavvik

1. **K2, norsk kilde:** q-fondskonto bruker fortsatt den engelske Skatteetaten-rettledningen som kilde til norske forhold. At kilden merkes engelsk opphever ikke regelen om norsk kilde. Norsk fulltekst må finnes, leses og kobles til de konkrete påstandene før en kildebytting kan foreslås. Nordnet-omtalen står urørt etter egen sperre.
2. **Foreldet kildeoversikt:** Den eldre rapporten sier ingen nivå 4-kilder og plasserer Nordnet på nivå 3. Gjeldende K2 plasserer norske banker/finansinstitusjoner på nivå 4. DNBs indeksfondside er også kilde i q-indeksfond. Kommersielle kilder er ikke automatisk feil, men behovet og den konkrete påstandsdekningen må kontrolleres mot nivårekkefølgen.
3. **K1/K3, manglende kildedato i svarfilen:** q-indeksfond og q-sparing-investering har vår kontrolldato og neste kontroll, men kildetitlene har ikke kildedato/regelår eller eksplisitt «ingen dato oppgitt». q-kjopekraft mangler også kildedato i denne filen. Kildeorganisasjon og URL er ikke nok. Endelig vurdering av hva brukeren ser krever også kontroll av renderer og eventuell annen metadata.
4. **Kildedato fra søkeuttrekk:** q-renters-rente beskriver Finanstilsynets dato som hentet fra søkeuttrekk. Dato og innhold må kontrolleres i selve kilden før dette kan regnes som ny full kildekontroll. Datoen er ikke bekreftet på nytt her.

### Forhold som må undersøkes, ikke konstaterte fagfeil

- **Formelgrunnlag i q-renters-rente:** Svaret viser en sammensatt renteformel, men har ingen universitetskilde i kildelisten. Undersøk kildenes faktiske dekning og prosjektets særkrav til regnemetoder. Egne beregninger alene dokumenterer ikke at kildekravet er oppfylt.
- **Mulig anbefalingspreg i q-sparing-investering:** «Start med formålet», «Del pengene etter behov» og eksempelet med reserve på konto og langsiktig investering kan oppfattes som framgangsmåte, selv om teksten sier at fordelingen ikke er anbefalt for alle. Kontroller mot K5 og SPRAKREGLER punkt 7. Dette er ikke en juridisk konklusjon, og nye begrepskrav er ikke automatisk et slettingsvedtak for eldre svar.
- **Eksisterende tilpasning:** q-bsu-basics og q-ips-ask har funksjoner som velger merknad etter alder, boligeierskap eller sparetid. Eksistensen er bekreftet i filen. Live brukerflyt er ikke kjørt. Dette må vurderes som eksisterende, tidligere rapportert funksjonalitet, ikke ny utvikling eller bevis på lovbrudd.
- **Kildeunderstøttelse:** Ingen av finanspåstandene er nylest mot ekstern primærkilde i denne delkontrollen. DNB/Forbrukerrådet-henvisninger, universitet/formelgrunnlag, norske skatteregler, kildedatoer og renderer prioriteres videre.

### Regnekontroll utført

Egenkontroll med JavaScript:
- 100 000 × 1,025^10 = 128 008,45 kr.
- 100 000 / 1,025^10 = 78 119,84 kr.
Avrundingene til omtrent 128 000 kr og 78 000 kr i q-kjopekraft stemmer. Dette kontrollerer illustrasjonen, ikke eksterne påstander eller hele svaret.

### Videreføring og fullmakt

Den eksisterende planlagte oppgaven `6ad9f279fa0c819185b8f2b74f12038f` er oppdatert 28.10.2026 til konkret arbeid hver femte time. Eksisterende publisert innhold og tilgjengelige utkast gjennomgås og klargjøres før ordinært nytt innhold. Ingen konkurrerende spørsmålkø opprettes. Bruk denne PR-en og eksisterende kø/logg for videreføring. Kildekontroll og rettelsesforslag dokumenteres, ikke bare mangler i lenker.

Tillatelsen gjelder kontroll, research og dokumentasjons-PR. Ingen endring i dist/, søk, beregninger eller funksjoner, ingen sammenslåing og ingen publisering uten Lars' uttrykkelige oppdrag eller godkjenning. Kontroll av en annen enn skribenten gjenstår. Sparetid er uttrykkelig bekreftet av Lars i samtalen.

---

## Historisk rapport fra 25.10.2026

# Kildegjennomgang 25.10.2026

Gjennomgang av alle kilder i `dist/` mot KILDEREGLER.md (K1 til K7, slik reglene står i PR #71).
Metode: automatisk uttrekk fra `veileder-knowledge.js`, `veileder-engine.js` og `veileder-facts.js`, pluss gjennomlesing av `assumptions.js` og `guidance.js`.
Begrensning: jeg kan ikke åpne Skatteetaten eller SSB fra arbeidsmiljøet. Derfor er ikke påstandene i teksten kontrollert mot siden på nytt i dag. Det som ikke er kontrollert, står som åpent.

## Samlet vurdering

Ingen kilder på nivå 4 eller 5. Alle faktatall (14 stk) peker til nivå 1, bortsett fra `fundMinYears` som er en anbefaling fra Forbrukerrådet (nivå 2) og er merket slik. Hovedproblemene er manglende datoer og én engelsk side.

## Avvik

| # | Regel | Hvor | Avvik | Alvor | Tiltak | Eier |
|---|---|---|---|---|---|---|
| 1 | K2 norsk versjon | `q-fondskonto`, kilden «tax-fondskonto-rettledning» | Engelsk Skatteetaten-side (`/en/…`). Norsk side finnes trolig, men er ikke funnet og verifisert. | Middels | Finn norsk side på skatteetaten.no, bytt lenke, kontroller at «revidert oktober 2025» stemmer på den. Inntil videre står sidetittelen som «engelsk side», så avviket er synlig. | ChatGPT (oppgave I), Lars godkjenner |
| 2 | K3 kildens dato og vår kontrolldato | `q-bsu-basics`, `q-ips-ask`, `q-ask-zero`, `q-kjopekraft` | Ingen forbehold-tekst om at siden mangler dato eller hva kildens dato er. Kontrolldato finnes i `checked` (22. og 24.10.), men vises ikke som tekst. | Middels | Legg inn `caveat` som i `q-aksjesparekonto`: kilde-dato eller «oppgir ingen dato», og «Kontrollert mot siden <dato>». Krever at noen leser sidene. | ChatGPT (oppgave H) |
| 3 | K3 | `q-aksjesparekonto`, `q-fondskonto` | Kontrolldato 24.10. og kilden oppgir ingen dato. Dette er korrekt oppgitt, men to av tre sider i `q-fondskonto` har ingen kildedato. | Lav | Behold. Ta med i neste kontrollrunde. | ChatGPT |
| 4 | K2 duplikater | `veileder-knowledge.js`: `ask` og `askNo`, `zeroTax` og `fondNo` | Samme side med to lenker (`/nn/…` og uten prefiks, ulik skråstrek i slutten). Kan gi to like kilder i listen og tvil om hvilken som er kontrollert. | Lav | Samle til én konstant per side og bruk den norske bokmålslenken. Må sjekkes at lenken virker før bytte. | ChatGPT |
| 5 | K2 nivå | `q-fondskonto`, Nordnet FAQ | Nivå 3 med salgsinteresse. Brukt bare til å vise hva produktet kalles og hvordan Nordnet beskriver det. Teksten sier det («ikke som anbefaling»). | Ingen | Greit. Notert som eksempel på riktig bruk. | |
| 6 | K2 nivå | `q-sparing-investering`, Bankenes sikringsfond | Avklart 25.10.2026 av Lars. Teksten oppgir ingen sum, og Finanstilsynet (nivå 1) dekker sikringsordningene i samme svar. Regjeringen (nivå 1, oppdatert 11.11.2024) bekrefter 2 millioner kroner per innskyter per bank og at finansforetaksloven regulerer ordningen. | Lukket | Sikringsfondet står som «les mer» ved siden av offentlig kilde. Ingen endring i `dist/`. K2 får setning om at lov eller departement er hovedkilde når regelen er lovfestet. Lovdata er ikke åpnet. | Lars (K2-setning i #71) |
| 7 | K1 | Alle svar | Jeg har ikke i dag lest sidene på nytt for å sjekke at hver setning er dekket. Det gjelder særlig påstander med tall (BSU 2026, IPS-grenser). | Middels | Ukentlig kontrollrunde etter K7. Andre leser enn forfatteren. | ChatGPT og Lars |
| 8 | K1 | Veileder: BSU, arveavgift, forskudd på arv | Norske Skatteetaten-sider for BSU (flere BSU-typer?) og arveavgift er ikke lest av meg. Engelske sider ble brukt tidligere. | Middels | Les norsk side, bekreft tall og inntektsår. Forskudd på arv er ikke dekket i det hele tatt, og skal ikke besvares før kilde finnes. | ChatGPT (oppgave I) |
| 9 | K6 | `q-indeksfond`, `q-sparing-investering` | «Neste kildekontroll senest 25. januar 2027» står i teksten. Det er en dato som går ut av tid og blir stående til neste redigering. | Lav | Behold til K6-valget (A eller B) er tatt. Flytt til felt `nesteKontroll` etter oppgave H. | Claude |
| 10 | Lenker | Alle | Lenkene er ikke testet for liv i dag. | Lav | La CI-oppgaven i issue #70 sjekke statuskoder, og logg treff. | ChatGPT |

## Ikke funnet som avvik

- Temakildene (11 stk): åtte på nivå 1 og tre fra Forbrukerrådet (nivå 2). Ingen engelske lenker.
- Fakta: alle har `year` 2026 og `checked` 2026-10-22, som testene krever.
- `assumptions.js`: SSB 11018 har `updated` og `checked`. Forbrukerrådet-kilden for sparehorisont har `checked` 25.10.2026 (avvik fra frysen er logget i BESLUTNINGER.md, utløper 31.01.2027).
- Ingen kilde på nivå 5.

## Hva jeg har rettet nå

Ingenting i `dist/`. Alt som kunne rettes uten å lese sidene på nytt, er enten allerede i orden eller krever at noen leser kilden. Å gjette datoer ville brutt K1. Derfor er avvikene lagt som oppgaver i stedet, og siden er ikke endret (ingen `?v=`-bump nødvendig).

## Oppgaver videre

1. Avvik 1, 2, 8: ChatGPT leser norske sider og foreslår endringer i egen PR. Lars godkjenner.
2. Avvik 6: Lars bestemmer nivå for Bankenes sikringsfond.
3. Avvik 4 og 10: små ryddeoppgaver, kan gjøres etter at #65 og #66 er slått sammen.
