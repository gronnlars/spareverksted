# Faktagrunnmur: andre forsøksrunde

29.10.2026, ChatGPT/Codex, egenkontroll. Isolert metodeforsøk etter Lars' uttrykkelige oppdrag om nødvendige tester og dokumentasjon på GitHub. Ingen ny primærkontroll av skatteregler, uavhengig fagkontroll, produksjonsendring eller publisering.

## Resultat og anbefaling

Behold små faktaregistre i git og redaksjonelt skrevne svar. Legg til en kort sjekkliste per ordning og egne dekningskrav per visning. Vilkår skal være knyttet til påstanden de begrenser. En generell koblingsliste er utilstrekkelig.

Den nye prototypen består 31 av 31 kontroller. Kartleggingen omfatter alle 154 tekstfelt i de tre eksporterte svarobjektene, inkludert metadata. Talljakten finner 137 linjer i sporede dist-filer med utvalgte tallvarianter. Dette er ikke 154 selvstendige fakta eller 137 feil. Kartleggingen er første sorteringsgrunnlag, ikke ferdig manuell oppdeling og kildekontroll av alle påstander.

## Arbeidsgrunnlag og utført arbeid

- Autoritativt kodegrunnlag: main `5e154842f75ec4ffb8c0274fdc4bc9dcbfdb5f2d`, hentet i denne økten. Egen worktree beskytter eldre lokale endringer.
- AGENTS.md og regulatorisk.md er lest i denne samtalens metodearbeid. CONTRIBUTING.md, SPRAKREGLER.md, SVARMAL.md og research/plan.md er lest for denne runden. Eksisterende KILDEREGLER er gjennomgått tidligere i samme samtale. Ingen ny økonomisk faktapåstand godkjennes her.
- Åpne PR-er er kontrollert på tittel og beskrivelse. Særlig #112 om deling og #83/#82 om navigasjon og sammenhenger er relevante, men endres ikke. Ingen konkurrerende faktagrunnmur-PR ble funnet i oversikten.
- Claudes vedlagte rapport og etterfølgende rettelser fra samtalen er vurderingsgrunnlag. `claude/vurdering-faktagrunnmur-2026-10-29.md` finnes ikke i det hentede main-treet. Notatet ligger ifølge Claude i Claude-prosjektet, ikke i git. Prosjektkopien er ikke lest herfra. Vedlegget er lest, og ingen fil fra Claude overskrives.
- `prove.py` leser eksisterende svar via Node, kartlegger tekstfelt og kjente tall, og kjører en separat strukturforsøksmodell. Den skriver bare KARTLEGGING.md og RESULTAT.json i forsøksmappen.
- Første kjøring stoppet ved feil antatt BSU-ID. Den ble korrigert til eksisterende `q-bsu-basics`, og sluttskriptet er kjørt med alle tre påkrevde ID-er til stede.

## Konkrete funn i dagens kode

| Sted | Observasjon | Konsekvens for grunnmuren |
| --- | --- | --- |
| dist/veileder-facts.js:10 | BSU-alder, årsgrense, totalgrense, sats og maksimalfradrag finnes allerede som felles oppføringer | Kartlegg og gjenbruk eksisterende register før vi lager et nytt parallelt system |
| dist/veileder-knowledge.js:392 | BSU-innledningen har alder og innskuddsgrenser som direkte tekst | Felles register alene garanterer ikke ett vedlikeholdssted |
| dist/engine.js:2 | Standardfeltet taxRate er 37.84 direkte i beregningsoppsettet | Kalkulatorens standardverdi er en faktisk separat avhengighet som må være med i en senere endringsliste |
| dist/index.html:80 | Forklaringen av skatteanslaget har satsen og regelåret i HTML | Også hjelpetekst rundt en beregning må kobles til vedlikeholdet |
| dist/veileder-knowledge.js:226 og :321 | ASK- og fondskontofordypningene har satser direkte i tekst | Samme økonomiske verdi finnes flere steder uten ett felles vedlikeholdspunkt |
| dist/experience.js:35 og dist/engine.js:2 | 300000 brukes også som eksempelpris eller målbeløp | Et talltreff alene er ingen dokumentert forbindelse til BSUs totalgrense |
| dist/bsu-rates.js | Rentetabellen er generert fra egne kildedata | Ikke rediger genererte tall. Følg deres generator og kildegrunnlag |

Dette konstaterer lagring og bruk, ikke at satsene er feil eller at kalkulatoren skal endres nå. Det er ikke utført en full kartlegging av alle beregningsstier.

## Hva forsøksmodellen endrer

Oppføringene skiller mellom kunnskapsstatus, regelstatus og kontrollstatus. «Ingen» og «ukjent» er forskjellige verdier. Kildestøtte har både ID og sted. Dokumentert regelstart kan være ukjent, mens kontrollens rekkevidde er et separat år med angitt tidsgrunnlag. Vilkår beholdes under påstanden de tilhører. «Se også» oppfyller ikke visningens dekningskrav.

Ordningen må i denne BSU-prøven ha årsgrense, totalgrense, alder, fradragssats, boligvilkår, renteskatt og uttaksregel. Innskuddsvisningen må uttrykkelig velge både års- og totalgrense. Fradragsvisningen må dekke sats, alder og boligvilkår. Dette er forsøksprofiler, ikke en vedtatt komplett katalog over alt hvert publisert kort trenger. For eksempel er kravet om tilstrekkelig skatt ikke implementert i denne prøven.

Testdataene er syntetiske struktureksempler. `source: fixture` er en uttrykkelig plassholder, ikke et godkjent kildebevis. Skjemaet kontrollerer at et sted er oppgitt, ikke at kilden faktisk støtter påstanden. Det er fortsatt en faglig kontroll.

## De 31 kontrollene

Fullstendige testnavn og resultat ligger i RESULTAT.json. De omfatter:

- Totalgrense må finnes i ordningen og velges i innskuddsvisningen. En «se også»-lenke er ikke nok.
- Boligvilkår følger fradraget og smitter ikke til innskuddsgrensen. Alder smitter ikke til renteskatt.
- Ukjent verdi, ukontrollert regel, forslag og opphevet regel sperres i gjeldende visning.
- En dokumentert negativ verdi tillates, men krever kildested.
- En forklaring for 2027 får varsel når verdien bare er bekreftet for 2026. Beregning for 2027 sperres. Dette er forsøksatferd, ikke vedtatt publiseringspolitikk.
- Ukjent opprinnelig ikrafttredelse tillates uten å dikte en dato.
- Manglende kildeplassering, fremmed felt, manglende uttaksregel, ugyldig kobling og sirkulært vilkår oppdages.

Det er ikke laget en universell kortgenerator. Modellens utdata er en struktur for kontroll av tilhørighet, ikke en språklig godkjent offentlig tekst. Den viser heller ikke alle unntak i BSU-uttaksreglene.

## Hva modellen fortsatt ikke fanger

En glemt regel i både sjekklisten og faktaregisteret er fortsatt usynlig. Feil i selve dekningsprofilen kan passere alle tester. Dette gjør menneskelig gjennomgang av profilene nødvendig.

Talljakten søker bare utvalgte tallvarianter i sporede JS-, HTML-, JSON- og CSS-filer under dist. Den har bevisst falske treff, også tekniske mål. Den dekker ikke alle satser, tallord, bilder, uttrykk som regner ut samme verdi, framtidige funksjoner eller alle negative regelpåstander. Trefflistene skal vurderes, ikke stoppe bygget automatisk. Lange kildelinjer er avkortet i rapporten, med fil og linje for oppslag. Tekstfelt oppgir alle linjer der nøyaktig tekst gjenfinnes. Importerte eller annerledes formaterte tekster merkes uten et oppdiktet linjenummer.

Ingen full tidsseriemotor, forslagsfil, kildeendringsdetektor, full ASK/fondskonto-modell, syntetisk avskaffelsesøvelse eller endringsliste for alle innholdstyper er implementert i denne runden. De første kontrollene gjelder en avgrenset BSU-struktur. Den tidligere dokumentprøven av ASK/fondskonto er ikke dermed ferdig gjennomført på nytt.

## Valg etter prøven

1. Ikke innfør et nytt parallelt faktaregister. Undersøk hvordan dagens veileder-facts kan videreføres og hva som må skilles ut.
2. Bruk påkrevde egenskaper per ordning og dekningskrav per visning som to separate kontroller.
3. Behold vilkår under riktig påstand. Automatisk fjerning av gjentatte vilkår på tvers av påstander er ikke et mål i seg selv.
4. Bruk datoer til å dokumentere det vi faktisk vet. Ukjent startdato er tillatt. Kontroll for ett år gir ikke beregningstillatelse for neste år.
5. Bruk git-versjonen til å identifisere samlet publisering. Kildekontroll og berørte innholdsdeler må fortsatt dokumenteres.

Neste avgrensede runde er manuell klassifisering av kartleggingen, med regelpåstand, kildebehov og eksisterende vedlikeholdssted. Deretter kan samme skjema prøves på ASK/fondskonto og kildebytte, regelendring og tilbaketrekking. Det er en fortsettelse av metodeforsøket, ingen tillatelse til integrasjon eller sammenslåing.

## Reproduksjon og begrensninger

Kjør fra repoets rot:

```sh
python3 research/faktagrunnmur/prove.py
```

Krever Python 3 og Node. Ingen tilleggspakker eller nettverk. Kartleggingen er et øyeblikksbilde av oppgitt main-SHA. Kjøring mot en annen kodeversjon kan gi andre treff, og rapportens grunnlags-SHA må da oppdateres av redaktøren.

Ingen produksjonstester eller nettlesertester er kjørt fordi produksjonskode og visninger ikke endres. Ingen test av forståelse, mobil, skjermleser, ytelse eller tokenbesparelse. Resultatene er egenkontroll. Ingen lovpåstander eller datoer i publiserte svar er nygodkjent.

## Angrepsflater og korrektur

- Grønne tester er bare evidens for de kodede kontrollene. Reparasjon: uavhengig gjennomlesing av manglende egenskaper og profiler.
- En treffliste kan se ut som en feilliste. Reparasjon: klassifiser regelverdi, eksempel, teknisk tall og generert verdi før tiltak.
- Trekk i retning av ett nytt stort system kan doble vedlikeholdet. Reparasjon: bygg videre på eksisterende faktaregister først.
- Feltet «bekreftet til» kan tolkes som at regelen utløper. Reparasjon: merk det uttrykkelig som kildekontrollens rekkevidde.

Korrektur: ASK, fondskonto og BSU er de eneste kartlagte svarene. IPS er ikke tatt inn. 154 tekstfelt inkluderer metadata. 137 gjelder linjer med søketreff, ikke antall tall eller feil. 31 er antall strukturelle kontroller i denne runden. Ingen tankestrek eller tre prikker er brukt i notatets egen prosa.

## Oppfølging etter Claudes gjennomgang

Gjennomgangen er formidlet av Lars i samtalen. Den separate filen gjennomgang-pr114-2026-10-29.md er ikke vedlagt denne oppfølgingen og er ikke omtalt som lest. Tilbakemeldingen er ikke en uavhengig menneskelig fagkontroll.

Fire reelle hull er tettet i forsøksmodellen: dokumentert startdato brukes nå, kontrollintervallet har både første og siste bekreftede år, «gjelder ikke» sperres i denne avgrensede visningen, og beregningsinnganger må ha endelige numeriske verdier. Dokumentert «ingen» kan fortsatt forklares, men kan ikke brukes som en tallverdi. Null kroner er en gyldig numerisk verdi og må ikke forveksles med tom verdi.

Ti nye kontroller dekker framtidig regelstart, historisk beregning og visning, «gjelder ikke» i visning og beregning, «ingen» og tom tekst i beregning, numerisk null, feil tidsgrunnlag og regelendring midt i året. Fullårsprøven avviser endringer midt i året. En datostyrt løsning for slike tilfeller er ikke implementert. Startdato kan fortsatt være ukjent, men et bekreftet kontrollintervall må oppgis.

Registerets faktiske bruk er svakere enn en opplisting av innholdet kan antyde. Søk i dist etter de fem BSU-nøklene finner produksjonsreferanser bare til bsuMaxAge utenfor definisjonsfilen. bsuAnnual, bsuTotal, bsuPercent og bsuMaxDeduction har ingen direkte referanser i de undersøkte produksjonsfilene. Registeret oppretter dessuten postene med én felles kontrolldato. Maksimalfradraget er et eget lagret tall uten uttrykkelig beregningsavhengighet. Dette dokumenterer ikke et fungerende felles vedlikehold av BSU-tallene. tests/veileder-relevance.test.cjs:28 krever Number.isFinite(fact.value) for hver oppføring. «Ingen» og «ukjent» krever derfor også en bevisst endring av registerkontrakten og testen ved eventuell senere integrasjon.

En smal kontroll av regelverdier i utvalgte svartekster kan bli en byggesperre etter klassifisering og avgrensning. Den brede talljakten forblir en vurderingsliste. En identisk tallverdi dokumenterer ikke alene regelidentitet. En senere BSU-PR bør koble tekst til eksisterende register, uttrykke maksimalfradrag som avledet verdi og teste at en endring faktisk når svarteksten. Denne oppfølgingen endrer fortsatt ingen produksjonskode eller eksisterende tester, og oppretter ingen slik integrasjons-PR.

Resultat etter retting: 31 av 31 strukturelle kontroller, fortsatt 154 tekstfelt og 137 linjer med talltreff. Antallet tester er ikke et fullstendighetsbevis. PR-en beholdes som utkast til videre gjennomgang.
