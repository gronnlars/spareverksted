# Spareverksted

Denne versjonen av Spareverksted er i en tidlig fase. Jeg anbefaler å vente med ordinær bruk og med å publisere egne kopier til relevante regulatoriske spørsmål er avklart.

Jeg bygger en grunnmur for personvern, universell utforming og innhold som skal være enkelt å kontrollere og oppdatere etter hvert som nettstedet vokser. Strenge regler for kilder og innhold setter grenser for både meg og KI-en jeg bruker, for å redusere risikoen for faktafeil og påstander uten kildegrunnlag.

Spareverksted.no er tilgjengelig for utprøving. Jeg bruker nettstedet til å få tilbakemeldinger fra testpersoner og brukergrupper og som grunnlag for spørsmål til offentlige myndigheter.

Spareverksted er et gratis verktøy for å utforske sparing og forstå forskjellen mellom beløp i kroner og kjøpekraft. Du kan justere tallene og se hvordan sparetid, innbetalinger, avkastning, kostnader og prisvekst påvirker resultatet.

[Se testversjonen på nett](https://spareverksted.no/)

## Hva kan du gjøre?

- Beregne spareutvikling, sparemål og uttak.
- Se resultatet som tall, graf og tabell.
- Sammenligne kroner med kjøpekraft i dagens kroner.
- Lagre planer i egen nettleser, dele en plan med lenke og eksportere resultater.
- Lese forhåndsskrevne forklaringer om BSU, aksjesparekonto (ASK) og fondskonto.

Forklaringene er generelle. Spareverksted anbefaler ingen bestemte fond, aksjer eller tilbydere. Ingen KI-modell lager svar mens du bruker siden.

## Start den nedlastede pakken

1. Pakk ut ZIP-fila.
2. Åpne den utpakkede prosjektmappen som inneholder `dist`. GitHubs «Code → Download ZIP» gir vanligvis mappen `spareverksted-main`. Pakken fra `scripts/package-source.py` gir mappen `spareverksted`.
3. Start en lokal webserver fra denne mappen. Med Python 3 installert:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

4. Åpne [http://127.0.0.1:8000](http://127.0.0.1:8000) i nettleseren.

På Windows kan kommandoen hete `py` eller `python` i stedet for `python3`.

Du trenger en nettleser med JavaScript aktivert. Python brukes bare til å servere filene lokalt. En annen lokal webserver kan også brukes.

Du kan forsøke å åpne `dist/index.html` direkte. Lokal lagring og kopiering av lenker fungerer best når siden åpnes fra en nettadresse.

## Bruk og lokal drift

Velg spareutvikling eller sparemål, fyll inn tallene og se resultatet. Prøv deretter å endre én forutsetning om gangen. For eksempel viser høyere prisvekst hvordan kjøpekraften kan bli lavere selv om beløpet i kroner vokser.

Beregningene skjer i nettleseren. Når pakken er lastet ned og en lokal server er startet, trenger selve beregningene ingen internettilkobling. Eksterne kilder, GitHub-dokumentasjon og e-post krever nett. En lenke med en lokal adresse virker bare hos den som har tilgang til den adressen.

ZIP-fila er et øyeblikksbilde. Den henter ikke nye regler, satser eller rettelser automatisk. Se datoene ved kildene, og hent en nyere utgave når du trenger oppdatert innhold.

## Slik skal resultatene forstås

Resultatene er regneeksempler basert på forutsetningene du velger. Jevn avkastning gjennom mange år er en forenkling. Faktisk rente, avkastning og prisvekst vil variere.

Spareutviklingen vises før skatt. Et eventuelt separat skatteanslag på uttak er forenklet og dekker ikke alle skatteregler. Lavere og høyere scenarioer viser modellens utslag, ikke et løfte om hva du vil få.

Eksporterte filer viser planen slik den var ved eksport. XLSX-fila inneholder beregnede tall, ikke formler som regner planen på nytt når du endrer cellene.

## Personvern

Ingen innlogging, reklame eller statistikkverktøy. Nettstedets egen kode bruker ingen informasjonskapsler og sender ikke tallene du skriver inn til en server.

Å åpne siden eller en delt lenke lagrer ingenting. Bestemte handlinger lagrer planer eller valg i nettleseren. Du kan slette planer under «Mine planer» og bruke sletteknappen på personvernsiden. Lagringen er ikke kryptert. Planer lagret ved lokal kjøring er atskilt fra planer på spareverksted.no. Lagringen er knyttet til nettadressen og nettleseren du bruker.

Delte lenker inneholder tallene i planen. Delen etter `#` sendes ikke i selve HTTP-forespørselen, men kan leses av tjenesten du deler lenken gjennom.

Ved bruk av spareverksted.no logger GitHub Pages IP-adresser av sikkerhetshensyn. E-post er en egen behandling hos e-postleverandørene. Disse forholdene er beskrevet på [personvernsiden](https://spareverksted.no/personvern.html), som også finnes som `dist/personvern.html` i pakken.

## Universell utforming

Målet er WCAG 2.2 nivå AA. Siden kontrolleres med automatiske tester og manuelle gjennomganger, men full tilgjengelighet er ikke dokumentert. Blant annet gjenstår en full gjennomgang med VoiceOver og NVDA.

Se [tilgjengelighetssiden](https://spareverksted.no/tilgjengelighet.html), eller åpne `dist/tilgjengelighet.html` i pakken, for utførte kontroller og kjente begrensninger.

## Prosjektstatus og hjelp

Videre utvikling er delvis satt på vent mens regulatoriske spørsmål avklares. Det arbeides innenfor avgrensede områder, blant annet personvern, tilgjengelighet og kildekontroll. Henvendelser til myndigheter er ikke en godkjenning av tjenesten.

Fant du en feil? Beskriv hva du prøvde, hva som skjedde, og hvilken nettleser du brukte. Bruk oppdiktede tall i offentlige feilrapporter. Ikke send opplysninger om din egen økonomi på e-post. Jeg tilbyr ikke personlig økonomisk rådgivning. For generell forbrukerinformasjon, se [Forbrukerrådet](https://www.forbrukerradet.no/).

- [Kontakt](https://spareverksted.no/om.html)
- [Meld en feil på GitHub](https://github.com/gronnlars/spareverksted/issues)
- [Dokumentasjon og arbeidsregler for bidragsytere](https://github.com/gronnlars/spareverksted/blob/main/AGENTS.md)
- [Regulatorisk status og avgrensninger](https://github.com/gronnlars/spareverksted/blob/main/docs/regulatorisk.md)
- [Tester som kjøres automatisk](https://github.com/gronnlars/spareverksted/blob/main/.github/workflows/static.yml)
- [Beregningsmodell](https://github.com/gronnlars/spareverksted/blob/main/docs/beregningsmodell.md)
- [Lokal drift og publisering](https://github.com/gronnlars/spareverksted/blob/main/docs/drift.md)

## Lisens, opphav og viderebruk

Alle kan bruke den publiserte kalkulatoren gratis til egen økonomi og teste den for å gi tilbakemelding, også ansatte i kommersielle virksomheter. Egen sparing og avkastning er tillatt.

Fra 24. oktober 2026 tilbys nye originale bidrag etter commit `8392d9adb934533ceca9627a93b768c223a1b704` under PolyForm Noncommercial 1.0.0, med tilleggstillatelsen i [LICENSE](https://github.com/gronnlars/spareverksted/blob/main/LICENSE). Kommersiell viderebruk av disse bidragene krever egen avtale med de aktuelle rettighetshaverne. Dette gjelder blant annet salg av tjenester, kommersiell integrasjon og markedsføring. En donasjon gir ingen kommersiell lisens. Kildekoden er tilgjengelig, men de nye vilkårene er ikke en åpen kildekode-lisens.

**Den tidligere kalkulatoren er fortsatt MIT-lisensiert.** Materialet til og med commiten ovenfor kan fortsatt brukes kommersielt under MIT, også når det inngår i en nyere utgave. Endringen trekker ikke tilbake tidligere tillatelser. Git-historikken skiller grunnlaget fra senere bidrag. Andres materiale følger sine egne vilkår; vi kan bare lisensiere rettigheter vi faktisk har.

Prosjektet er utviklet av Lars med hjelp fra ChatGPT og Claude, med innspill fra Vibe og andre. KI er brukt i stor grad til kode, tekster, feilsøking og forslag. Svarene i veilederen skrives og kildekontrolleres før publisering. Kildekontrollen kan være utført med KI; menneskelig eller uavhengig fagkontroll oppgis bare når den er dokumentert. Ingen KI-modell lager svar under brukerens besøk. Se [PROVENANCE.md](https://github.com/gronnlars/spareverksted/blob/main/PROVENANCE.md) for avgrensninger og kilder og [CONTRIBUTING.md](https://github.com/gronnlars/spareverksted/blob/main/CONTRIBUTING.md) for nye bidrag. Gaver er frivillige og er aldri et vilkår for personlig bruk.


Lisensvilkårene følger også pakken i fila `LICENSE`. Opphavsopplysninger finnes i `PROVENANCE.md`.
