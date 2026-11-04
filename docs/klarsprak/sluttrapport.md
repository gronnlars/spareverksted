# Sluttrapport: grunnmåling av klarspråk

Status 4. november 2026. Gjennomført av ChatGPT/Codex med egenkontroll. Arbeidet foreslås i en PR som krever Lars sin godkjenning. Ingen sammenslåing eller publisering inngår. Ingen eksisterende brukerrettede tekster, design, beregninger eller funksjoner er endret.

Kildefiler fra main `5fd6650517bf605444350f24b0c1fb3ca4ba4d81`. Målemetode `sv-klarsprak-1`, implementasjon og analyseordliste følger denne PR-en. SHA256 for alle målte inngangsfiler og ordlisten står i [grunnmålingen](grunnmaling.json). Den kan gjentas mot en utpakket kopi av denne commit-en med verktøyet fra PR-en, som beskrevet i [metoden](../klarsprak.md). Dette er kildekopien av nettsidene, ingen produksjonsmåling.

## Grunnmåling ved oppstart

Målt 6 667 ordforekomster totalt i forklaringer på sju HTML-sider og tre publiserte svar. 73 kapitler/målegrupper er registrert. 52 grupper er for korte til å få LIX etter vår rapporteringsregel. Bare 21 av 73 grupper får LIX. Alle får råtellinger. Side- og svarverdiene under er beregnet fra tellingene, ikke som snitt av kapittelscorer.

| Side / tekst | Ord | Setningsenheter | Lange ord % | LIX |
| --- | ---: | ---: | ---: | ---: |
| Sparekalkulator, statisk tekst | 317 | 40 | 29,02 | 36,95 |
| Lånekalkulator, statisk tekst | 648 | 83 | 31,64 | 39,44 |
| Om | 740 | 74 | 27,43 | 37,43 |
| Personvern | 1247 | 139 | 27,99 | 36,96 |
| Ressursbruk | 730 | 71 | 34,93 | 45,21 |
| Spør om sparing, sidens faste tekst | 167 | 23 | 31,14 | 38,40 |
| Publisert svar: ASK | 433 | 42 | 28,87 | 39,18 |
| Publisert svar: BSU | 298 | 21 | 19,80 | 33,99 |
| Publisert svar: fondskonto | 265 | 24 | 32,45 | 43,49 |
| Tilgjengelighet | 1822 | 171 | 25,96 | 36,62 |

Dette er ikke en rangering av klarspråk. Siden om ressursbruk og svaret om fondskonto har høyest LIX i dette utvalget. Det gir grunn til å undersøke ordvalget, ingen konklusjon om at de er vanskeligst å forstå. Sparekalkulatorens 317 ord dekker for eksempel ikke alle tekster som blir synlige under bruk.

Kontrollen gir 185 forslag: fem lange setninger, tre lange avsnitt, 55 fagordtreff ved første forekomst per målegruppe og 122 blokker med ett eller flere ord på minst 14 bokstaver. De 122 treffene er blokker, ikke 122 ulike vanskelige ord. Mange er kjente og nødvendige ord som «forutsetningene» og «tilgjengelighet». Ingen funn dokumenterer alene en feil. Fullstendig tekstutvalg, tall per kategori og alle funn finnes i JSON. [Lesbar grunnrapport](grunnmaling.md) viser de første 80.

## Kontroll av hva tallene betyr

6 667 er totalt antall ordforekomster i forklaringstekst. Det er ikke antall forekomster av «tilgjengelighet», ikke antall unike fagord og ikke kodeord. Tallet 1 822 i sideraden «Tilgjengelighet» er alle ord i forklaringene på den siden, ikke antall ganger ordet står der.

En ny kontroll av hele ordet «tilgjengelighet» i grunnmålingens uttrekte tekst gir:

| Kategori | Forekomster | Inngår i LIX? |
| --- | ---: | --- |
| Forklaringer | 8 | Ja |
| Navigasjon, inkludert bunntekst | 11 | Nei |
| Overskrift | 1 | Nei |
| Dokumenthode/kode/metadata | 1 | Nei |

De åtte i forklaringer fordeler seg på Om (1), Ressursbruk (3) og Tilgjengelighet (4). Antall treff i rå HTML kan være høyere fordi ordet også forekommer i adresser og attributter. Slike treff er ikke med i denne ordtellingen. Funnlisten kan gjenta tekstutdrag, men telles aldri som nettstedstekst.

Grunnmålingen er et dokumentert referansepunkt, ikke en fasit for klarspråk.

**Dekningsgapet er vesentlig og ikke tallfestet.** Det finnes ingen nevner for alle ord som brukere kan møte i alle tilstander. Vi kan derfor hverken hevde en bestemt dekningsprosent eller at rapporten dekker en bestemt brøkdel av tjenesten. Særlig dynamiske låneforklaringer og feilmeldinger gjenstår. Knapper og tabeller er kategorisert, men ikke språkvurdert. De 21 LIX-gruppene er ikke en måling av 21 hele brukerreiser.

JSON-grunnmålingen, den lesbare grunnrapporten, metoden og implementasjonen ligger allerede i git i denne PR-en. De forsvinner ikke etter 30 dager. Det er de nye kjøringenes Actions-artefakter som har 30 dagers levetid. Grunnmålingen bevares historisk når main endres og overskrives ikke for å følge nyere innhold.

Kontrollen skal foreløpig være rådgivende. Den skal ikke gjøres obligatorisk i grenreglene eller kobles til publiseringsjobben i denne runden. En teknisk feil får fortsatt rødt resultat slik at et ødelagt måleverktøy ikke ser friskt ut, men språkfunn påvirker ikke statusen.

[Separat kontrolloppdrag](kontrolloppdrag.md) er klart, men ikke utført. Tidligere gjentakelse var forfatterens egenkontroll og skal fortsatt kalles det. Utvidelse til dynamiske lånetekster er registrert i research/plan.md, punkt 10b. Første eventuelle tekstendring foreslås avgrenset til BSU-setningen, med fagkontroll og før/etter, i en egen PR.

## Prioritert gjennomgang senere

| Prioritet | Tekst og plassering i målecommit | Hva bør undersøkes | Konkret kontroll |
| --- | --- | --- | --- |
| 1 | BSU, `dist/veileder-knowledge.js:418`, `/parts/1/text` | Setning på 34 ord om når nye innskudd stopper. Flere vilkår og innskutte forklaringer. | La brukeren avgjøre om innskudd er tillatt i et oppdiktet tilfelle. Eventuell deling må bevare år, renter og vilkår. |
| 1 | ASK, særlig skjerming og gave/arv. Fondskonto, særlig skatt og forholdsmessige uttak | Korte setninger kan fortsatt ha mange ukjente begreper. ASK-innledningen forklarer allerede skjermingsfradrag med andre ord. Maskinen kan ikke bekrefte kvaliteten på forklaringen. | Be brukeren forklare hva som er innskudd og gevinst, og hvilke vilkår som gjelder. Ikke endre regler for å korte ned tekst. |
| 1 | Lån, kapitlene om forskjellen på lånetyper og renteforklaringen | Avdrag, termin, nominell/effektiv rente, restgjeld og dagens kroner. | Test hele reisen fra felt til resultat og rapport. Den dynamiske teksten må leses separat. |
| 2 | Tilgjengelighet, `dist/tilgjengelighet.html:113,124,125`, `a11yChecked` | Avsnitt på 198, 121 og 153 ord, med setninger på 44 og 32 ord. Kontrollmetoder og forbehold er samlet tett. | Undersøk om leseren finner hva som faktisk er testet og hva som gjenstår. Del eventuelt etter kontrolltype, behold begrensningene. |
| 2 | Personvern, `dist/personvern.html:166`, `shareTitle` | Setning på 35 ord om kryptering og filbruk. Flere begrunnelser samtidig. | La brukeren forklare hva fila inneholder og hvem som kan lese den. Skill begrunnelsene ved eventuell omskriving. |
| 3 | Ressursbruk, `dist/ressursbruk.html:78`, `kiTitle` | Setning på 33 ord om prosjektets ambisjon. Flere lange ord og flere mål. | Vurder hva leseren faktisk trenger for å tolke ressursmålingen. Bevar skillet mellom håp og dokumenterte resultater. |

Prioriteringen bygger på mulige konsekvenser av misforståelse og manuell lesing av funnene, ikke på LIX-rangering eller dokumenterte brukermisforståelser. Linjene gjelder commit-en over. Nye endringer kan flytte dem.

## Prioriterte fagord

| Prioritet | Ord | Neste arbeid |
| --- | --- | --- |
| 1 | Skjermingsfradrag, skjermingsgrunnlag, skjermingsrente, skattemessig kontinuitet, EØS | Avklar hvilke forklaringer brukeren trenger ved første møte. Kontroller juridisk betydning og ikke forklar ett ukjent begrep med et annet. |
| 1 | Nominell rente, effektiv rente, avdrag, terminbeløp, restgjeld | Lag kildekontrollerte definisjoner og prøv dem sammen med lånekalkulatorens tall og eksport. |
| 1 | Kjøpekraft, dagens kroner, avkastning, prisvekst, prosentpoeng | Gjenbruk eksisterende definisjoner der de finnes. Test skillet mellom beløp, verdi og kjøpekraft. |
| 2 | Annuitetslån, serielån | To korte definisjonsutkast med kildespor er klare for senere kontroll. Forklar også termin og avdrag. |
| 2 | Informasjonskapsler, øktlagring/fanelagring, localStorage/sessionStorage, kryptering | Ett definisjonsutkast finnes. Avklar først hvor tekniske navn er nødvendige. Skill teknologiforklaring fra juridiske konklusjoner. |
| 3 | JavaScript, WCAG, skjermleser, API, CSP, CDN | Forklar ved faktisk behov. Teknisk dokumentasjon og brukerrettet hjelpetekst har ulike målgrupper. |

[Analyseordlisten](ordliste.json) har 30 poster: fire referanser til eksisterende definisjoner, fem upubliserte definisjonsutkast med primærkilder og 21 kildekontrolloppgaver uten definisjon. Ord som ikke forekommer i målt forklaring, gir ingen treff. Knapper, skjult tekst og tabeller inngår ikke i fagordfunnene i denne versjonen. Det kan derfor være behov for forklaring også uten treff. Ingen ny ordliste publiseres på nettstedet.

## Metodiske begrensninger og angrepsflater

1. **Grønt resultat kan mistolkes som godkjenning.** Rapporten sier uttrykkelig at det er egne indikatorer. Språkrådets offentlige veiledning er lest, hele ISO-standarden er ikke kontrollert. Ingen sertifiseringspåstand.
2. **Utvalget kan gi falsk trygghet.** CSS, dynamiske kalkulatortekster, feilmeldinger, PDF og hele brukerreiser er ikke fullstendig målt. Kontroller dem manuelt og utvid adapteren når modellen endres.
3. **Setningsdeling kan gi falske treff.** Norske forkortelser, tall, datoer og særtegn er testet, men tvetydighet finnes fortsatt. Kontroller originalteksten før omskriving.
4. **Lavere LIX kan skjule dårligere innhold.** Fjernede forbehold og endret tekstutvalg kan redusere scoren. Sammenlign tekst og faglig betydning, ikke bare tall.
5. **Fagordtreff er ingen mangelliste.** Annen ordlyd kan allerede forklare begrepet. Den første forekomsten og brukerens behov må vurderes av en leser. Nye definisjoner skal senere inn i det eksisterende begrepsregisteret.
6. **Historikken har begrenset varighet.** Actions-artefakter varer 30 dager. Fast grunnmåling og git-logg er varige kontrollpunkter. Bevar utvalgte senere rapporter ved språkrevisjoner.

## Verifikasjon og videre oppfølging

Opprinnelig 20 automatiske tester besto. Etter oppfølgingen består 22 tester, med egne moteksempler for ordtelling uten filnavn, attributter eller dupliserte rapportfunn. De dekker håndregnet LIX, æ/ø/å, Unicode-normalisering, myk orddeling, forkortelser, desimaltall, datoer, bindestreker, apostrofer, tom tekst, korte utvalg, terskler, kategorier, innfoldet tekst, publiseringsutvalg, feltstier, ugyldige ordlister, kontrollfeil, høy tekstbelastning uten feilstatus, stabile funn og deterministisk rapport. Eksisterende begrepstester, faktakontroll, versjonskontroll og sikkerhetskontroll består. Historisk grunnmåling er gjentatt mot en utpakket kopi av kildecommit-en.

Ingen nettlesertest eller brukertest er utført for denne endringen, ettersom brukerrettet kode ikke endres. Den første Actions-kjøringen besto. Oppfølgingscommit-en må få sitt eget kjøresultat. Om kontrollen skal være obligatorisk for sammenslåing, må det settes i grenreglene. Eksisterende publiseringsflyt er bevart.

Neste språk-PR bør ta én av de prioriterte brukerreisene. Dokumenter oppgaven, mulig misforståelse, tekst før/etter, kilder og hvem som kontrollerte. Følg planen for manuell kontroll og åpne brukeroppgaver i metodedokumentet. Ingen har ennå dokumentert at disse tekstene er vanskelige for målgruppen.

Korrektur og faktakontroll: tallene er hentet fra den lagrede rapporten. Kildecommit, metodeversjon, filnavn og publiseringsutvalg er kontrollert mot kildekopien. Dagens måledato er holdt atskilt fra kildenes dato og tidligere fagkontrolldatoer.
