# Klarspråkstandard for Spareverksted

Status: Prosjektstandard til gjennomgang. Opprettet 4. november 2026. Gjelder alt brukerrettet innhold og alle brukerreiser. Endrer ikke vedtatte knappetekster eller funksjoner i seg selv.

## Formål og rettslig avgrensning

Spareverksted bygger frivillig sin språkstandard på prinsippet i [språkloven § 9](https://lovdata.no/lov/2021-05-21-42/%C2%A79): offentlig språk skal være klart, korrekt og tilpasset målgruppen. Spareverksted er ikke automatisk omfattet av bestemmelsen som privat tjeneste. Vi skal derfor ikke påstå lovoppfyllelse eller offentlig godkjenning. Rettskrivingsspørsmål kontrolleres mot Språkrådets normering.

Språkrådet gjengir den internasjonale definisjonen av klarspråk: «Klarspråk er kommunikasjon med så tydelig ordlyd, struktur og utforming at leserne i målgruppen lett finner informasjonen de trenger, forstår den og kan bruke den.» [Kilde: Språkrådet, Kort om klarspråk](https://sprakradet.no/klarsprak/kunnskap-om-klarsprak/kort-om-klarsprak/).

**Dette er prosjektets hovedmål for klarspråk:** Brukeren skal lett kunne **finne**, **forstå** og **bruke** informasjonen. Vi vurderer derfor både ordlyd, struktur og utforming, herunder skjema, interaksjon, grafer, feilmeldinger og rapporter. En kort tekst er ikke nødvendigvis en klar tekst. De tre målene skal kontrolleres i sammenheng, ikke bare som separate skriveøvelser.

## Grunnregler

1. **Svar først.** Gi hovedpoenget og nødvendige forbehold før detaljer. Legg fordypning der den er lett å finne.
2. **Skriv for målgruppen.** Ikke forutsett kjennskap til økonomi, bank eller digitale verktøy. Ikke anta bestemt livssituasjon eller økonomisk handlingsrom.
3. **Skriv konkret.** Bruk aktive verb, synlig aktør og vanlige ord der de er like presise. Fjern fyllord og unødvendig byråkratspråk.
4. **Forklar fagord.** Behold etablerte presise begreper, for eksempel effektiv rente, og forklar dem første gang de trengs. Bruk felles begrepsregister fremfor parallelle definisjoner.
5. **Bruk overskrifter som informerer.** De skal gjøre innholdet lett å finne og beskrive det som faktisk følger.
6. **Vær konsekvent.** Samme ord skal bety samme ting på tvers av kalkulatorer, svar, grafer, eksport og rapporter. Ulike handlinger skal ikke få samme navn bare for å skape likhet.
7. **Skill fakta fra forutsetninger.** Brukerens tall, historiske observasjoner, eksempler, scenarioer og prognoser må ikke blandes. Et beregnet resultat er ikke et løfte.
8. **Bevar økonomisk presisjon.** Skill nominelle kroner fra kjøpekraft, saldo fra opptjent avkastning, rente fra avkastning, og prosent fra prosentpoeng. Forenkling må ikke endre meningen.
9. **Forklar hva resultatet betyr.** Oppgi periode, enhet, relevante kostnader, skatt og usikkerhet når dette påvirker tolkningen. Ikke gjem avgjørende forbehold i avansert visning.
10. **Skriv nøytralt.** Ingen skjulte produktanbefalinger, salgsretorikk, skam, garantiord eller personlige investeringsråd. Se `docs/regulatorisk.md` og `KILDEREGLER.md`.
11. **Skriv korrekt norsk.** Følg offisiell bokmålsrettskriving, norsk tallformat og prosjektets stilvalg i `SPRAKREGLER.md`. Ingen mekanisk ord- eller setningsgrense som fjerner mening.
12. **Test forståelse.** Automatiske sjekker kan varsle om mulige problemer, men dokumenterer ikke at mennesker forstår teksten.

13. **Velg korte, kjente ord når de er like presise.** Det kan gjøre teksten lettere å lese for blant andre personer med dysleksi, dem som leser på liten skjerm, og dem som bruker lese- og skrivestøtte. Velg «bruk» framfor «implementer» når betydningen er den samme. Unngå lange sammensetninger og forkortelser når enklere ord dekker meningen. Ikke bytt ut presise fagord med misvisende kortord. Korte ord er et hjelpemiddel, ikke en garanti for tilgjengelighet.
14. **Gjør teksten lett å lese med hjelpemidler.** Bruk tydelige etiketter, logisk leserekkefølge, riktig overskriftsstruktur og forståelige lenkenavn. Ikke del ord kunstig for å få dem kortere. Kontroller ved behov med opplesning, skjermleser og forstørring.

## Tekst i grensesnittet

- **Knapper og lenker:** Beskriv neste faktiske handling eller mål. Vurder ordlyden sammen med plassering, tilgjengelig navn, kontekst og hva som skjer etter trykk. Ikke bruk «Klikk her». Ikke gi en knapp navn etter sluttresultatet dersom den først åpner en dialog med flere valg.
- **Skjema:** Etiketter og enheter skal være synlige og entydige. Hjelpetekst skal stå der spørsmålet oppstår. Obligatoriske og valgfrie felt skal være forståelige.
- **Feil:** Si hva som er galt, hvordan det kan rettes, og bevar gyldige data. Unngå bare «Ugyldig verdi».
- **Grafer:** Oppgi akser, enheter, tidsrom og forutsetninger. Hovedpoenget og vesentlige tall må også være tilgjengelige som tekst, ikke bare farge eller form.
- **Rapporter og eksport:** Navn, tall, enheter og forbehold skal samsvare med kalkulatoren. Bevar semantisk struktur, logisk leserekkefølge og eksisterende tilgjengelighetsfunksjoner.
- **Spørsmål og svar:** Kort svar først, deretter relevant forklaring, avveininger, kilde, kontrolldato og forbehold. Bruk eksisterende svarmal og begrepsregister.
- **Mobil, zoom og skjermleser:** Kontroller at forkortede etiketter ikke mister mening, og at tekst, synlig etikett og tilgjengelig navn samsvarer.

## Eksempler som må tilpasses konteksten

| Mindre klart | Klarere når faglig riktig | Merknad |
| --- | --- | --- |
| Estimert sluttverdi | Beregnet verdi etter 20 år | Bruk faktisk valgt periode. |
| Inflasjonsjustert avkastning | Avkastning når vi tar hensyn til prisveksten | Behold fagordet i fordypning. |
| Du taper penger på bankkonto | Pengene kan miste kjøpekraft selv om beløpet øker | Skill beløp fra kjøpekraft. |
| Du vil ha 2 millioner kroner | Med disse forutsetningene blir beregnet verdi 2 millioner kroner | Ikke lov framtidig resultat. |
| Ugyldig verdi | Skriv et tall innenfor grensene som står ved feltet | Oppgi de faktiske grensene når mulig. |

Eksemplene er språkretning, ikke godkjente faktapåstander eller generelle erstatningsregler.

## Vedtatte knappetekster

Vedtatt av Lars 4. november 2026 etter vurdering mot denne standarden: «Korte ord der det er mulig. Best med tanke på UU.»

| Knapp | Brukes når |
| --- | --- |
| Lagre plan | Lagrer planen du står i. Åpner dialog for navn |
| Del plan | Lager en lenke til planen du står i |
| Last ned plan | Åpner valg av format for den samme planen |
| Last ned planene | Flere planer er med, med antall når noen er valgt. «Last ned planen» når bare én er med |

Synlig tekst, tilgjengelig navn, dialogtittel og filnavn skal stemme med knappen. Språklig godkjenning erstatter ikke funksjonstest. Se `KALKULATORDESIGN.md`, del 3, og `BESLUTNINGER.md`, «Knappetekster: plan».

## Kontroll før publisering

Ved endring av brukerrettet tekst skal bidragsyteren dokumentere:

1. Hvor teksten står, hva brukeren forsøker å gjøre, og hvilken misforståelse som skal unngås.
2. At hovedbudskap og viktige forbehold er synlige på riktig sted.
3. At ordvalg er konsekvent og at faktiske handlinger, navn, tall, enheter og kilder stemmer.
4. At faglig betydning, unntak, nøytralitet og regulatoriske grenser er bevart.
5. At relevant mobilvisning, forstørring, tastatur, skjermlesernavn og eksport er kontrollert når endringen berører dem.
6. Hvilke automatiske kontroller og faktiske brukertester som er utført, og hva som gjenstår.

Automatisk kontroll kan finne inkonsekvens, manglende etiketter og mulige skrivefeil. Den kan ikke alene godkjenne forståelighet, faglig riktighet eller universell utforming. Brukertesting skal undersøke om folk finner, forstår og kan bruke informasjonen, uten ledende spørsmål.

## Forhold til andre regler

`SPRAKREGLER.md` gir prosjektets detaljerte skriveregler og økonomiske begreper. Denne filen samler klarspråkkravene og kontrollmetoden. Ved motstrid skal bidragsyteren ikke velge selv, men dokumentere konflikten og få avklaring i `BESLUTNINGER.md`. `KILDEREGLER.md`, `docs/regulatorisk.md` og kravene til universell utforming gjelder uavhengig av denne filen.

Denne standarden gir ikke i seg selv mandat til å skrive om eksisterende sider, endre knapper eller justere funksjoner.

## Offentlige kilder

- [Lovdata: lov om språk (språklova), særlig §§ 9 og 10](https://lovdata.no/lov/2021-05-21-42)
- [Språkrådet: kort om klarspråk](https://sprakradet.no/klarsprak/kunnskap-om-klarsprak/kort-om-klarsprak/)
- [Språkrådet: generelle skriveråd på bokmål](https://sprakradet.no/klarsprak/om-skriving/generelle-skriverad-bokmal/)
- [Språkrådet: klarspråk og språkloven § 9](https://sprakradet.no/spraklova/klart-sprak/melding-om-uklart-sprak/)
- [Tilsynet for universell utforming av ikt: redaktørens ansvar](https://www.uutilsynet.no/veiledning/redaktorens-ansvar-universell-utforming/200)
- [IMDi: bruk et språk som alle kan forstå](https://www.imdi.no/tall-og-fakta/veiledere/veileder-hvordan-na-ut-med-informasjon-til-personer-med-innvandrerbakgrunn/5.-bruk-et-sprak-som-alle-kan-forsta)

Kildene er normgrunnlag og videre lesning, ikke dokumentasjon på at Spareverksted er testet eller godkjent.

## Automatisk støtte til gjennomgangen

[Klarspråkkontrollen](docs/klarsprak.md) måler teksttrekk lokalt og rapporterer funn i GitHub Actions. Den skiller forklaringer fra grensesnitt, navigasjon og skjult tekst, og bruker både LIX-komponenter, lengdefunn og en analyseordliste. Ingen språkscore stopper publisering. Manuell kontroll og brukertesting må undersøke relevans, om informasjonen finnes, forstås og kan brukes. [Grunnmåling og oppfølging](docs/klarsprak/sluttrapport.md) dokumenterer dekning og hull. Ingen automatisk rapport er en ISO-godkjenning.
