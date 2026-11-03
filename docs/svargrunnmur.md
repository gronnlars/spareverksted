# Svargrunnmur

Implementert etter Lars sitt oppdrag 3.11.2026. Opphav: Claudes SVARSKJEMA og plan, videreført i kode av ChatGPT/Codex. Prosjektets lisens gjelder. Dette dokumentet beskriver hva koden faktisk gjør.

## Bruk

```sh
python3 scripts/svar.py ny SV-150
# Fyll ut kilder/svar/SV-150.md etter SVARSKJEMA.md
python3 scripts/svar.py bygg
python3 scripts/svar.py --check
python3 scripts/svar.py hash SV-150
python3 scripts/svar.py berørt bsuAnnual
python3 scripts/svar.py berørt tax-bsu
python3 scripts/svar.py frister
```

`ny` overskriver aldri en fil. Uutfylte maler er arbeidsfiler og passerer ikke kontrollen. `bygg` validerer alle skjemaer før den skriver. `--check` skriver ingenting og stopper ved avvik i både skjemaer og genererte filer. CI kjører samme kommando og moteksempeltestene.

Skjemaet har 18 overskrifter i fast rekkefølge. Forbehold, eksempel og fordeler/ulemper kan være `ingen`. Hver fordypningsdel avsluttes med `Tabell: ingen` eller `Tabell: bsuRates`. Søkefraser er kommaseparerte, bokstavelige fraser, ikke kode eller regulære uttrykk. Generatoren avgrenser treff til ordgrenser. Alternative skrivemåter føres hver for seg. Eksisterende spesialuttrykk må få egne søketester før migrering.

I en Markdown-tabell skrives en loddrett strek inne i en celle som `&#124;`. Ekstra kalkulatorlenker skrives som `lenketekst | index.html#...`, én per linje. Kontrollregning er dokumentasjon. Skriptet kjører aldri kommandoer fra et skjema.

## Kontroll og godkjenning

Utkast kan ha kildevurderingen `vet ikke` og `Lest: ikke lest`. Da kan de ikke få status `til kontroll`. De kan inneholde gammel tekst under overføring, men skal ha tydelig sperre. En modell kan ikke endre status til `godkjent` og dermed få teksten gjennom byggingen.

Etter egenkontroll og separat kildekontroll:

1. Før skribentens egenkontroll i kontrolloggen.
2. Kjør `hash SV-xxx` når offentlig tekst, kildetabell, påstandstabell, sperrer og avgrensninger er ferdige.
3. Kontrolløren fører en rad med rollen `kontrollør`, eget navn/økt og `sha256:<hele hashverdien>` i resultatfeltet. Navnet må være forskjellig fra skribenten.
4. Lars sin faktiske godkjenning dokumenteres med `Hvem: Lars`, `Rolle: godkjenner` og samme `sha256:<verdi>`. Ingen modell skal finne på denne godkjenningen.
5. Endringer i kontrollgrunnlaget eller i brukte registerverdier, kildelenker eller underliggende CSV-serier krever ny kontroll og godkjenning. Loggen, arbeidsstatus og neste kontrollfrist inngår ikke i hashen. `hash` kan beregnes også når gamle kontrollrader ikke lenger er gyldige.

Hashen binder dokumenterte handlinger til innholdet. Den autentiserer ingen person. En modell med skrivetilgang kan fabrikere en rad. Kontroll av faktisk fullmakt og PR-godkjenning ligger fortsatt hos Lars. Validatoren beviser heller ikke at hvert avsnitt har alle nødvendige påstander eller at kilden faktisk støtter dem. Det er kontrollørens oppgave.

## Integrasjon og publisering

Bare `godkjent`, `integrert`, `publisert` og `til gjennomgang` kan genereres, og alle må ha gyldige kontrollbevis, kilder og datoer og ingen publiseringssperrer. `til gjennomgang` tillater at uendret, tidligere godkjent tekst fortsatt vises mens en kontroll pågår. Endringer i innhold eller registre krever ny kontroll før bygging.

Generatoren skriver `dist/veileder-svar-generert.js`. Bare eksplisitt valgte offentlige felt blir med. Påstandstabell, angrepsflater, kontrollregning, kontrollogg og interne avgrensninger følger aldri med. Påstandsmerkene fjernes. Tabeller hentes fra eksisterende registergenererte modul. Kontroll- og kildekontrolldatoer flyttes aldri av skriptet.

`veileder-knowledge.js` setter sammen eldre og genererte svar. Duplisert svar-ID stopper. Ved migrering fjernes den tilsvarende håndskrevne posten først etter kontroll av tekst, datoer, søk, tabeller og lenker. De separate publiseringslistene og eksisterende søketester må fortsatt oppdateres bevisst. Generatoren endrer aldri publiseringsutvalget.

Ingen pilotsvar er migrert til offentlig levering i denne PR-en. BSU vises fortsatt fra den kontrollerte, eksisterende posten. Renters rente er fortsatt trukket. De to skjemaene dokumenterer overføringen og gjenstående kontroll.

## Avhengigheter og frister

`kilder/svar/avhengigheter.json` er en generert, intern omvendt indeks: kilde, faktum, begrep eller relatert svar til berørte SV-ID-er. `berørt` følger også svaravhengigheter videre uten å endre status eller dato. Faktakildene tas med selv om en kilde bare nås gjennom et registerfaktum. Eldre svar uten skjema er utenfor indeksen og må fortsatt søkes med `scripts/fakta.py steder ID` og i den gamle svarbasen.

`frister` viser forfalte skjemaer. Den starter ingen automatikk. Regelkalenderen og Kildevakts hendelser må også følges etter KILDEREGLER. Ny kildetekst, en 404 eller nye tall er signaler om behov for kontroll, aldri automatisk faglig godkjenning.

Indeksen bruker oppslag og gjennomløp av berørte kanter. Det er ikke kjørt en ytelsesprøve med 200 000 svar. Dagens nettsted laster svarbasen samlet. Før vesentlig vekst må offentlig levering deles i et lite søkegrunnlag og svarfiler som lastes ved behov. Dette krever egen måling og søke-/visningsendring. Ingen påstand om at dagens nettleser tåler 200 000 svar følger av denne grunnmuren.

## Innhenting og resterende arbeid

Kildevakts tilgangstest finner Skatteetaten-kilden etter ID og gir feilstatus ved HTTP-feil. Begge innhentingsarbeidsflytene bruker eksplisitt Bash, slik at feil før `tee` ikke blir skjult. Tidsmaskin gir feilstatus ved hentefeil selv om gamle filer fortsatt består integritetskontroll, og ved manglende forventede kilder eller ukjent kildevalg.

Ikke løst her: varig varslingskø/SSB-PR-kø, tilbaketrukne SSB-observasjoner, stabil saksnøkkel, full rådatabevaring og serie-/metodeavtale. Funn 3 til 7 er omtalt i Claudes plan, men den opprinnelige detaljrapporten var ikke vedlagt. Ikke erklær disse som rettet.

Ferdigkriteriet for innholdspiloten gjenstår: les primærkildene, del sammensatte påstander, angi presist avsnitt, regn alle eksempler, kontroller søkeparitet og visning, separat kontrolløkt og Lars sin godkjenning. Først da kan nattarbeid vurderes startet. Implementering av kontrollmaskineriet gir ingen godkjenning av innholdet.

## Utført kontroll i implementeringsøkten

Alle 32 Python- og Node-testfiler bestod på arbeidsgrunnlaget, inkludert 33 nye moteksempler/integrasjonskontroller i `tests/svar.test.py`. BSU-skjemaets offentlige tekst, kilder, datoer og tabellkobling er sammenlignet maskinelt med eksisterende svar. Nettlesermodulen er også kjørt i isolert JavaScript-kontekst. Faktaregister, sikkerhetskontroll og innholdsbaserte cacheversjoner består.

Ingen faktisk nettleser-/skjermleserprøve eller live HTTP-tilgangstest er utført i denne økten. Ingen faglig pilotkontroll er utført. Eksisterende nettlesertester kjøres i CI når PR-en opprettes. Grønne tester er egenkontroll av implementeringen.
