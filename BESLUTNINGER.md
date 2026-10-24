# Hvorfor Spareverksted er laget slik

Beslutningsnotat, 24. oktober 2026.

Les dette før du foreslår større endringer. Notatet samler prinsipper og valg fra prosjektarbeidet. Det er ikke dokumentasjon på at alle deler er ferdige eller fullstendig brukertestet.

## En ulempe betyr ikke at valget var feil

Som når man velger skuffer framfor skap på et kjøkken: Begge løsninger har ulemper. Et godt valg kan innebære at man aksepterer noe irriterende for å slippe noe som ville vært verre.

Spareverksted har begrensninger vi har valgt med åpne øyne. Nye innspill skal vurderes seriøst, men ikke automatisk føre til flere funksjoner, flere forbehold eller en ny utforming. Vi skal huske hvorfor alternativet ble valgt bort.

Før en endring:
1. Hva skulle dagens løsning løse?
2. Hvilket alternativ valgte vi bort, og hvorfor?
3. Hva er den kjente ulempen vi aksepterer?
4. Gir innspillet ny kunnskap som endrer avveiningen?
5. Hva mister brukeren hvis vi følger forslaget?

En begrunnelse er ikke et vern mot kritikk. Faktiske regnefeil, utilgjengelige kontroller og dokumenterte misforståelser skal undersøkes og rettes.

## Raske svar og mulighet for fordypning

**Valg:** Enkel inngang, resultat først og mer kunnskap når brukeren ønsker det. Tenk på et godt museum: Både den som vil prøve noe raskt og den som vil undersøke detaljene, skal få utbytte.

**Alternativ:** Alle innstillinger, forklaringer og forbehold synlig fra starten, eller en så enkel side at fordypningen forsvinner.

**Begrunnelse:** Mennesker har ulike forkunnskaper og behov. Vi skal gi tilgang til dybden uten å kreve at alle går gjennom den.

**Akseptert ulempe:** Noe viktig informasjon krever et ekstra trykk. Opplysninger som endrer forståelsen av resultatet, må likevel være tydelige der resultatet vises.

**Vurder på nytt når:** Brukertester viser at folk ikke finner nødvendig informasjon eller misforstår resultatet.

## En avgrenset sparekalkulator

**Valg:** Kalkulatoren utforsker spareutvikling, kjøpekraft, kostnader, mål og uttak under oppgitte forutsetninger.

**Alternativ:** Bygge en samlet modell for bolig, utdanning, skatt, støtteordninger, gjeld og livslønn med en gang.

**Begrunnelse:** En større modell krever flere opplysninger og antakelser. Det øker vedlikeholdsbehovet og faren for å gi inntrykk av mer personlig og presis veiledning enn vi kan stå inne for. Utviklingen følger fasene i prosjektet.

**Akseptert ulempe:** Kalkulatoren kan ikke avgjøre hva som er best for hele privatøkonomien. Høyest sluttsaldo er ikke nødvendigvis det beste livsvalget.

**Vurder på nytt når:** Vi kommer til den aktuelle utviklingsfasen og kan dokumentere nytte og faglig kvalitet.

## Gjør kroner og kjøpekraft forståelige

**Valg:** Vis at saldoen kan øke samtidig som kjøpekraften faller. Forklaringene skal bygge på tallene brukeren faktisk har valgt.

**Alternativ:** Bare vise et stort sluttbeløp og en stigende kurve.

**Begrunnelse:** Et riktig kronebeløp kan likevel gi et misvisende bilde av hva pengene vil rekke til.

**Akseptert ulempe:** Flere måleenheter krever mer forklaring. Sammenligninger må bruke samme grunnlag.

**Vurder på nytt når:** Brukere blander tap i kroner med redusert kjøpekraft, eller ikke forstår hvilken visning de ser.

## Synlig usikkerhet uten å late som vi kjenner framtiden

**Valg:** Dokumenterte regneforutsetninger, scenarioer og stresstester med tydelige begrensninger. Dagens modell bruker ikke Monte Carlo.

**Alternativ:** Én tilsynelatende sikker vekstkurve, eller mer omfattende simuleringer.

**Begrunnelse:** Brukeren skal kunne undersøke konsekvenser uten at modellens detaljer gir falsk trygghet. Flere simuleringer er ikke automatisk bedre beslutningsstøtte.

**Akseptert ulempe:** Modellen dekker ikke alle mulige markedsforløp eller sannsynligheten for å nå ethvert mål. Forenklinger må forklares.

**Vurder på nytt når:** Brukerbehov krever analyse av ulike avkastningsforløp, og en ny modell kan etterprøves. Test særlig om brukeren forstår at målet kan glippe på datoen pengene trengs.

## Forhåndsskrevne svar framfor KI-svar

**Valg:** «Spør om sparing» bruker kvalitetssikrede tekster og regler, med kilder og kontrolldato.

**Alternativ:** La en språkmodell generere personlige svar.

**Begrunnelse:** Svarene skal være etterprøvbare, forutsigbare og mulige å vedlikeholde. Tjenesten skal ikke kreve innlogging, reklame eller eksterne KI-kall.

**Akseptert ulempe:** Søket forstår ikke alle formuleringer, og veilederen kan ikke svare fritt på alt. Manglende dekning skal ikke skjules med et irrelevant svar.

**Vurder på nytt når:** Faktiske spørsmål viser hull i ruting eller innhold. Utvid kvalitetssikret dekning i riktig fase.

## Søk som tåler skrivefeil og særskriving

**Problem:** «boligflån» og «bolig lån» ga ingen treff, selv om «boliglån» finner svaret. Søket matchet ordlistene mot hele teksten, så én feil bokstav eller ett mellomrom stoppet det.

**Valg:** Faste regler, uten KI. To ord leses som ett sammensatt ord («bolig lån» som «boliglån»). Et ukjent ord på minst fem bokstaver som ligger én endring fra et ord som utløser et tema, leses som det ordet. Ord to endringer unna foreslås bare («Mente du …?»). Siden sier alltid hva den leste. Ved bom vises ingen svar, bare forslag og temaene, merket som at de ikke er svar på spørsmålet.

**Alternativ:** Legge inn hver feilskriving som eget søkeord. Det treffer bare dem vi har tenkt på og må vedlikeholdes for alltid. Å la en språkmodell tolke spørsmålet strider mot valget over.

**Begrunnelse:** Små regler kan testes, forklares for brukeren og vedlikeholdes sammen med temaene. Vanlige skrivefeil skal ikke føre til at siden later som den mangler innhold den har.

**Akseptert ulempe:** Et ord kan bli rettet til noe brukeren ikke mente, for eksempel «buffet» til «buffer». Derfor står det synlig hva siden leste. Ord på fire bokstaver eller færre rettes ikke, og søket forstår fortsatt ikke alle formuleringer.

**Vurder på nytt når:** Faktiske søk viser rettelser som ofte er feil, eller ord uten treff som tydelig ligger nær et tema.

## Kvalitet før flere funksjoner

**Valg:** Avgrensede endringer, uavhengige kontrollberegninger og kontroller av flyt og tilgjengelighet. Kalkulatorens ferdige deler skal få ro før vi bygger videre.

**Alternativ:** Gjøre forbedringer hver gang et nytt forslag virker nyttig.

**Begrunnelse:** Stadige lokale forbedringer kan gjøre helheten tyngre og åpne gamle feil.

**Akseptert ulempe:** Gode forslag må noen ganger vente. Automatiske tester kan heller ikke alene vise at mennesker forstår siden.

**Vurder på nytt når:** Det finnes en konkret feil eller dokumentert brukshindring. Skill dette fra ønsker om utvidelser. Tilgjengelighetsstatus omtales som «ingen avvik funnet i de gjennomførte kontrollene», ikke som fullstendig WCAG-samsvar.

## Gratis bruk og frivillige gaver

**Valg:** Tjenesten skal være gratis og uten reklame. Prosjektet kan forklare formålet og gjøre det enkelt å støtte gode formål frivillig.

**Alternativ:** Reklame, betaling for personlig bruk eller ingen synlig mulighet for gaver.

**Begrunnelse:** Spareverksted skal hjelpe mennesker og kunne bidra til noe utover størst mulig personlig formue.

**Akseptert ulempe:** Donasjonsbudskap kan oppleves som et avbrudd eller en oppfordring brukeren ikke ba om. Gaver skal være frivillige. Plasseringen må vurderes mot beregningsflyten; dette notatet fastsetter ikke en ny plassering.

**Vurder på nytt når:** Brukertester viser press, forvirring eller forstyrrelser. Ikke anta at et lite gavebeløp har ubetydelig økonomisk effekt for alle.

## Bruk notatet videre

Ved viktige nye valg: Legg til problemet, valgt løsning, alternativet, begrunnelsen, ulempen vi aksepterer og hva som kan få oss til å endre mening.

Skill mellom:
- En påvist feil.
- Ny kunnskap som endrer en tidligere avveining.
- En kjent ulempe vi fortsatt aksepterer.
- Et forslag som hører til en senere fase.

Målet er å bevare tankearbeidet, ikke å fryse prosjektet.
