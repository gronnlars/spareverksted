# Arbeidsregler for Spareverksted

**Pausen er avsluttet 2. november 2026 (Lars). Finanstilsynet er orientert samme dag. Sperrene som gjelder etter oppstart, står i [docs/regulatorisk.md](docs/regulatorisk.md): ingen navngitte produkter eller «best for deg», kildekontroll før nye råd, og tilpasning som velger forklaringer uten å konkludere for brukeren. Hver PR godkjennes fortsatt av Lars før sammenslåing.**

Gjelder hele repoet og alle bidragsytere, inkludert ChatGPT/Codex, Claude, Gemini og Vibe.

Les før arbeid:

1. [CONTRIBUTING.md](CONTRIBUTING.md): bidrag, lisens og selvstendige overleveringer.
2. [BESLUTNINGER.md](BESLUTNINGER.md): valgene, alternativene og begrunnelsene.
3. [SPRAKREGLER.md](SPRAKREGLER.md): språk og faglig presisjon.
4. [SVARMAL.md](SVARMAL.md): valg av svarform, presentasjon og kontroll før publisering.
5. [KILDEREGLER.md](KILDEREGLER.md): kilder, datoer, foreslått mot vedtatt og når en regel må brytes.
6. [research/plan.md](research/plan.md): faser, kalkulatorfrys og åpning for kontrollert innholdspåfyll.
7. [research/universell-utforming.md](research/universell-utforming.md): krav og åpne kontroller.
8. [SPORSMALSKO.md](SPORSMALSKO.md), [daglig oppgave](research/DAGLIG-OPPGAVE.md) og [arbeidslogg](research/ARBEIDSLOGG.md) ved innholdsarbeid.

Main er autoritativt arbeidsgrunnlag. Hent fersk status og les åpne PR-er før endring. Ikke anta at en samtale eller usammenslått gren er kjent for neste bidragsyter. Ikke overskriv andres arbeid eller opprett konkurrerende køer. Dokumenter viktige beslutninger og hva som kan få oss til å revurdere dem.

Prioritet: konkrete feil og utløpte påstander, deretter neste avgrensede spørsmål i køen. Vanlig research gir upublisert dokumentasjon. Integrasjon i nettsiden krever eget oppdrag og følger planens ferdigkriterier. Valgomaten er parkert. Ingen nye kalkulatorfunksjoner innenfor innholdsarbeidet.

KI brukes i stor grad til å utvikle innhold og kode. Svarene i «Spør om sparing» skrives og kildekontrolleres før publisering. Kildekontrollen kan være utført med KI. Menneskelig eller uavhengig fagkontroll oppgis bare når den er dokumentert. Ingen KI-modell lager svar under brukerens besøk. Ingen innlogging, reklame eller ekstern logging som del av dette arbeidet. Beregninger foregår i størst mulig grad lokalt.

Oppgi utførte kontroller, begrensninger og faktisk status. Grønne tester beviser ikke full tilgjengelighet eller brukerforståelse. Main-push starter automatisk testing og publisering; ikke beskriv sammenslåing som en upublisert handling.

## Mellomlagring

Versjonen i `?v=` lages fra innholdet i fila. Ikke rediger den for hånd. Etter endring i en CSS- eller JS-fil i `dist/`: kjør `python3 scripts/versjoner.py`. CI (`versjoner.py --check`) feiler hvis en versjon ikke stemmer med fila. Ved konflikt i en HTML-fil: velg en av sidene og kjør skriptet. Hvert skript og stilark står på egen linje.

Bakgrunn: 2.11.2026 blandet nettleseren ny HTML med en gammel fil fordi versjonen ikke ble økt. 3.11.2026 ga #173 og #174 `app.js` samme versjon (ux52) med ulikt innhold. Begge deler er umulige når versjonen følger innholdet.

## Tall fra kilder

Tall som står i svar eller kalkulator (satser, grenser, aldre, SSB-renter) ligger i temafiler under `kilder/fakta/` med kilde, status og gjelder-fra-dato. Faste forklaringer av fagord ligger i `kilder/begreper/`. Skriv `{{ID}}` eller `{{begrep:ID}}` i teksten, ikke tallet eller setningen. Kjør `python3 scripts/fakta.py` etter endring. `python3 scripts/fakta.py --check` feiler ved hardkodede dubletter og plassholdere som ikke finnes. Kildevakt følger kildene og åpner saker; den retter aldri tall selv. Se [docs/kildevakt.md](docs/kildevakt.md).

## Sikkerhet ved endringer

Alle publiserte HTML-sider skal ha CSP før første script. Ingen HTTP-lenker, usikre ressursadresser, inline JavaScript eller skjemainnsending til server. Skjemaer behandles lokalt. Kjør `python3 scripts/security-check.py` og relevante nettlesertester ved endring. XML-navnerom i XLSX er identifikatorer, ikke HTTP-forespørsler, og skal bevares. Ikke svekk CSP for å få en test grønn. Nye behov må vurderes og dokumenteres. Se docs/sikkerhet.md.
