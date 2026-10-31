# Arbeidsregler for Spareverksted

**STANS: Prosjektet er på vent til Finanstilsynet har svart og alt er klarert. Les [docs/regulatorisk.md](docs/regulatorisk.md) før du gjør noe. Ikke start arbeid uten uttrykkelig beskjed fra Lars. Pausen gjelder ikke (vedtatt 28.10.2026): kildekrav, universell utforming, personvern, nøytrale spørsmål og svar om økonomiske begreper, og retting av opplagte lovbrudd. Ingen nye funksjoner. Grensene står i regulatorisk.md, «Områder pausen ikke gjelder».**

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

## Sikkerhet ved endringer

Alle publiserte HTML-sider skal ha CSP før første script. Ingen HTTP-lenker, usikre ressursadresser, inline JavaScript eller skjemainnsending til server. Skjemaer behandles lokalt. Kjør `python3 scripts/security-check.py` og relevante nettlesertester ved endring. XML-navnerom i XLSX er identifikatorer, ikke HTTP-forespørsler, og skal bevares. Ikke svekk CSP for å få en test grønn. Nye behov må vurderes og dokumenteres. Se docs/sikkerhet.md.
