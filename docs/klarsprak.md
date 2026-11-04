# Automatisk klarspråkkontroll

Status: forslag til kvalitetssystem, 4. november 2026. Implementert med ChatGPT/Codex og egenkontroll. Ingen uavhengig fagrevisjon eller brukertest er gjennomført som del av dette arbeidet. Ingen brukerrettede tekster eller funksjoner endres.

Målet følger [KLARSPRAK.md](../KLARSPRAK.md): mennesker skal få relevant informasjon som de finner, forstår og kan bruke. Verktøyet finner steder en redaktør bør undersøke. Det avgjør hverken om teksten er faglig riktig, om den oppfyller en ISO-standard eller om brukerne forstår den.

## Kjør lokalt

Krever Python 3.10 eller nyere og Node.js (CI bruker Python 3.12 og Node 22). Ingen pakker installeres for målingen. Ingen nettverkstilgang, KI-tjeneste, besøksdata eller analyseleverandør brukes.

```sh
python3 tests/klarsprak.test.py
node tests/begreper.test.cjs
python3 scripts/klarsprak.py --output /tmp/klarsprak
```

Les `rapport.md` og `rapport.json` i utmappen. JSON inneholder alle funn, tekstutdrag, kategorier, kapitteltall, kildefiler, linjer og SHA256 for målte inngangsfiler. Markdown viser sidetall og de første 80 funnene, prioritert med lange setninger og avsnitt først. Dette er egne tekniske kontroller, ikke en ekstern vurdering.

[Grunnmålingen](klarsprak/grunnmaling.json) beholdes uendret når innholdet senere endres. Den er et historisk sammenligningsgrunnlag, ingen tillatelse til å beholde en feil. [Sluttrapporten](klarsprak/sluttrapport.md) beskriver første måling og oppfølging. `--verify-baseline` krever identisk rapport og brukes bare mot kildekopien grunnmålingen gjelder. Den skal ikke kjøres som krav om uendret tekst i framtidige PR-er.

For å gjenta den historiske målingen: pakk ut commit-en oppgitt i sluttrapporten med `git archive`, behold måleverktøyet og analyseordlisten fra denne PR-en, og kjør med `--root /sti/til/utpakket/kilde --verify-baseline`. Rapporten er deterministisk og inneholder ikke klokkeslett eller maskinavhengige mapper.

## Avklaring etter gjennomgangen av grunnmålingen

Kontrollen leser HTML-filer i `dist`, ikke Markdown-kildetekst. Det er ferdige HTML-filer, men de er ikke det samme som DOM-en etter at nettleseren har kjørt JavaScript. Publiserte svar leses gjennom en egen, avgrenset Node-adapter som løser de samme faktaplassholderne som nettstedet. Den skanner ikke hele JS-filer som brødtekst. Alle sju sidene har `<main>`. Dagens parser bruker elementtyper og kategorier i hele dokumentet, ikke en nettlesers synlighet eller et absolutt krav om at all tekst ligger under `<main>`.

NFC-normalisering utføres med Python `unicodedata.normalize('NFC', ...)`. JavaScripts `String.prototype.normalize` trengs ikke for at Python-parseren skal normalisere de samme tegnene. Norske forkortelser, desimaltall og datoer håndteres allerede og har egne tester.

For etterprøvbar telling av ett ord i dagens kildekopi:

```sh
python3 scripts/klarsprak.py --word tilgjengelighet --output /tmp/klarsprak-ord
```

`ordtelling.json` viser ordet per kategori og alle tekstplasseringene. Den teller ikke treff i filnavn, HTML-attributter eller de gjentatte utdragene i funnlisten. Grunnmålingens historiske ordtelling er dokumentert i sluttrapporten og beskyttet av en test. Denne rapportutvidelsen endrer ingen av grunnmålingens tall eller metodeversjon.

Kontrollen skal foreløpig være rådgivende: egen grønn/rød status uten ny flettesperre og uten kobling til deploy. Rødt betyr at verktøyet eller datagrunnlaget har en konkret feil, ikke at språkscoren er for høy. Ingen grenregler endres. Eventuell obligatorisk status skal vurderes særskilt etter bedre dekning og dokumentert driftserfaring, ikke innføres automatisk når en adapter er utvidet.

JSON, lesbar grunnmåling, metode og kode er allerede varig i git. Bare rapportene fra løpende Actions-kjøringer utløper etter 30 dager. [Et separat kontrolloppdrag](klarsprak/kontrolloppdrag.md) er klargjort. Det skal ikke merkes som utført eller som menneskelig kontroll før det faktisk er gjort.

## Forholdet til Språkrådet og ISO 24495-1

Metoden er kontrollert mot Språkrådets offentlige veiledning om skriveråd, testing og de fire styringsprinsippene i ISO 24495-1. Språkrådet beskriver prinsippene som relevans, å finne, å forstå og å bruke. ISO-katalogen beskriver virkeområdet og at standarden ikke erstatter tekniske tilgjengelighetskrav. Hele standardteksten er ikke gjennomgått. Vi dokumenterer derfor samsvar med de offentlig beskrevne prinsippene, ikke full kontroll av alle retningslinjene i standarden.

| Prinsipp | Automatisk støtte | Nødvendig manuell kontroll og brukertest |
| --- | --- | --- |
| Relevant informasjon | Ingen direkte måling av relevans. Tekstinventaret viser hva som er med og utenfor. | Avklar brukerens oppgave og forkunnskaper. Mangler avgjørende informasjon, eller tar irrelevant tekst plassen? |
| Finne informasjon | Funn er gruppert etter side, svar og overskrift. Eksisterende UU-tester kontrollerer deler av strukturen. | Be brukeren finne informasjon uten å oppgi riktig overskrift eller lenke. Observer feil vei, hjelp og tid. |
| Forstå informasjon | LIX-komponenter, setningslengder, avsnittslengder, lange ord og fagord gir signaler. | La brukeren forklare med egne ord. Kontroller særlig kroner/kjøpekraft, innskudd/gevinst og prosent/prosentpoeng. |
| Bruke informasjon | Ingen direkte måling av riktig anvendelse. Eksisterende funksjonstester kontrollerer bestemte handlinger. | Gi en konkret oppgave med oppdiktede tall. Observer om personen tolker resultatet og fullfører riktig. |

Ingen av kildene som er lest her, gir en norsk, universell LIX-grense for publisering. Verktøyet har ingen slik grense. En lavere indeks kan skyldes at et viktig forbehold er fjernet. Les derfor både tekst og endring før en forbedring konkluderes.

## Tekstutvalg og kapittelinndeling

Alle `dist/**/*.html` oppdages automatisk. HTML leses med Pythons standardbibliotek, med kategorier i prioritert rekkefølge:

1. Script, stil, dokumenthode og template er kode/metadata.
2. `hidden`, `aria-hidden="true"`, kjente skjermleserklasser og eksplisitt inline skjuling gir kategorien skjult. Kategorien sier ikke at teksten er utilgjengelig for alle hjelpemidler.
3. `nav`, `header`, `footer` og navigasjonsroller er navigasjon.
4. Knapper, etiketter, valg og summary er grensesnitt. Overskrift inne i summary registreres som overskrift.
5. Overskrifter, tabelltekst og kode har egne kategorier.
6. Avsnitt, listepunkter, definisjonsbeskrivelser, sitater og figurtekster er forklaringer. Bare disse inngår i LIX og de redaksjonelle varslene.
7. Resten er «annet» og telles separat.

Inline lenketekst inngår i forklaringen den står i. Knappetekst inne i avsnitt tas ut. Nestede blokker telles ikke dobbelt. Skjulte felt og skjermlesertekst får ingen LIX sammen med synlig brødtekst. URL-er er ikke ord eller setningsgrenser i målingen. Norske sammensetninger beholdes samlet.

«Kapittel» betyr teksten etter siste h1, h2 eller h3 i kildefilas rekkefølge fram til neste slik overskrift. Overskriftens ID brukes når den finnes, ellers teksten. Det er en teknisk inndeling, ikke en påstand om den opplevde strukturen. Identiske overskriftstekster uten ID kan havne i samme gruppe. h4 til h6 telles som overskrifter, men starter ikke ny målegruppe. Linjen peker på starten av tekstblokken, ikke nødvendigvis ordets eksakte kolonne. En komprimert HTML-linje kan ha mange funn.

Tekst i `details` tas med som tilgjengelig fordypning og telles også særskilt som `disclosure_prose_words`. Dette er ikke en måling av hva brukeren ser straks siden åpnes. Lukkede dialoger uten `hidden` kan også inngå. Full CSS, responsive visninger, tilstandsbytter, `inert` og nettleserens tilgjengelighetstre evalueres ikke. Derfor kalles tallene statisk tekstutvalg, ikke synlig tekst i en bestemt skjermvisning.

For «Spør om sparing» gjenbrukes `publiserte-svar.js`, `veileder-knowledge.js` og samme `F.expand` som løser faktaplassholderne i nettstedet. Adapteren leser eksplisitte redaksjonelle felt: intro, caveat, text og neutral i hovedsvaret, parts, example, tradeoffs, pros, cons, options og terms. Utkast, søkeord, alternative spørsmål, regulære uttrykk, kildetitler, review, tabeller og neste-knapper blir ikke feilaktig løpende tekst. Publiserte svar rapporteres separat fra skall-siden, med svar-ID og feltsti, eksempel `/parts/1/text`.

Plassering i svarbasen bygger på første treff på den serialiserte tekststrengen. Ved sammensatte JavaScript-strenger brukes svarstart og feltsti. Linjen er da omtrentlig. JSON merker forskjellen. Nye tekstfelt i svarmodellen krever utvidet adapter og test. Dette er en eksplisitt dekningsbegrensning.

Dynamiske kalkulatorforklaringer, alle valideringsmeldinger, graftekster, eksport/PDF og betingede svarvarianter er ikke fullstendig kartlagt. Denne versjonen skal ikke brukes til å hevde at hele nettstedets språk er målt. Bruk eksisterende nettlesertester og manuell kontroll for disse delene. Det er ingen grunn til å laste ned nettlesere på nytt for hver enkel tekstanalyse.

## Norsk LIX og segmentering

Formelen i denne implementasjonen er:

`LIX = antall ord / antall setninger + 100 × antall lange ord / antall ord`

Lange ord betyr mer enn seks bokstaver, inklusive æ, ø og å. Det er noe annet enn kontrollen «lange-ord», som varsler om ord med minst 14 bokstaver. Tall har ingen bokstaver og regnes aldri som lange ord.

Teksten normaliseres til Unicode NFC. Myk orddeling fjernes. Ord med bindestrek eller apostrof regnes som ett ord, bokstavene summeres. Tall regnes som ett ord per tallgruppe: `10 000`, `10 000` og `2,5` er ett hver. Prosenttegn og andre rene symboler er ikke ord. Forkortelser med indre punktum beholdes som ett ord. Dette er dokumenterte tokenvalg for norsk økonomitekst, ikke en påstand om at alle LIX-verktøy bruker samme avgrensning.

Punktum, spørsmålstegn og utropstegn avslutter en setning. Desimaltall, punktumdatoer, dato med månedsnavn og en eksplisitt liste med norske forkortelser beskyttes. Noen sluttforkortelser, som `kr.`, kan avslutte en setning foran stor bokstav. Ukjente forkortelser, navn med initialer og tvetydige forkortelser ved setningsslutt kan fortsatt deles feil. Listen finnes åpent i skriptet og dekkes av tester. Uavsluttet tekst ved slutten av en blokk teller som én setningsenhet. Det gjør blant annet punktlister følsomme for utvalg.

LIX vises bare for grupper med minst 100 ord og tre setningsenheter. Dette er prosjektets forsiktighetsregel for rapportering av korte utvalg, ikke en validert grense fra Språkrådet eller ISO. Ord, setninger og andel lange ord vises også for kortere utvalg. Sideverdien beregnes fra summerte tellinger, aldri som gjennomsnitt av kapitlenes LIX. Det gis ingen samlet rangering av hele nettstedet.

LIX vurderer ikke logikk, ordkjennskap, forkunnskaper, presisjon, lovlighet, relevant informasjon, overskriftenes verdi, visuell utforming eller faktisk bruk. Norske sammensetninger, institusjonsnavn og nødvendige fagord kan øke indeksen uten at teksten bør endres. Grupper med ulike innholdstyper skal ikke rangeres mot hverandre som om de var like. Etterprøv tellingen på konkrete utdrag før du handler på et overraskende resultat.

## Ordliste og forklaringer

[Analyseordlisten](klarsprak/ordliste.json) har stabile ID-er og eksplisitte søkeformer. Det finnes ingen skjult stemming eller ordliste fra en ekstern leverandør.

- Fire poster viser til eksisterende `kilder/begreper/` og henter definisjonen derfra. Ingen kopierte definisjoner å vedlikeholde.
- Fem nye poster har korte forklaringer, kilder, kildedato, lesedato og `status: utkast`. De er bare upublisert arbeidsgrunnlag. Videre fagkontroll og utdypingsbehov er beskrevet i hver post.
- 21 poster har `status: kildekontroll gjenstår` og en oppgave, ingen usikret definisjon. De kan allerede varsle om ord som må undersøkes.

Når en ny forklaring er faglig kontrollert, flyttes den til eksisterende begrepsregister i en egen innholds-PR. Analyseposten erstattes da av en referanse. Runtime og nettstedets ordforklaringer endres ikke i denne PR-en. Eksisterende `fakta.py`, `tests/begreper.test.cjs` og kontroll av publiserte svar brukes videre. Kildehenting og kildevedlikehold tilhører Kildevakt, ikke en ny innhenter her.

Fagord varsles ved første teksttreff per kapittel. En kjent definisjon i samme kapittel eller `data-begrep` gir bare et forklaringssignal. Programmet vet ikke om en annen god forklaring står der, om den kommer tidsnok, eller om leseren finner og forstår den. Det foreslår aldri automatisk erstatning av et fagord. Søkeformene må vedlikeholdes når nye bøyninger eller begreper dukker opp.

## Feil, forslag og historikk i GitHub

Arbeidsflyten `Klarspråkkontroll` kjører på PR, push til main og manuelt fra Actions. Den bruker samme Actions-versjoner og rapportmønster som eksisterende kvalitetskontroller, med lesetilgang til repoet og ingen hemmeligheter. Kjøringen får egen status på PR-en. Den oppretter ingen kommentar, sak eller endring automatisk. Å gjøre statusen obligatorisk ved sammenslåing er en separat innstilling i GitHubs grenregler, ikke noe YAML alene sikrer. Eksisterende publiseringsflyt er ikke endret.

| Type | Reaksjon | Begrunnelse |
| --- | --- | --- |
| Feil i måleverktøyets tester, ugyldig ordliste, dupliserte ID-er/søkeformer, ukjent begrepsreferanse, ingen sider, ingen publiserte svar, uavklarte plassholdere i målt forklaring, ugyldig begrepsmarkering | Kjøringen feiler, PR får rødt kontrollresultat | Rapporten kan ikke brukes som gyldig målebevis. Dette er konkrete kontroll- eller datafeil. |
| Setning over 30 ord, avsnitt over 100 ord, ord med minst 14 bokstaver, fagordtreff | Forslag, ingen feilstatus | Tersklene er prosjektets første prioriteringshjelp. De beskriver ikke en feil i seg selv. |
| Høy eller økende LIX | Tall i rapporten, ingen sperre | Verdien må tolkes med tekstens funksjon, nødvendige forbehold og utvalget. |
| Faglig feil eller misforståelse fra manuell kontroll eller brukertest | Konkret oppgave og ordinær fagkontroll før godkjenning | Maskinen kan ikke avgjøre sannhet eller forståelse. |

Tersklene skal revurderes etter at faktiske falske treff og brukermisforståelser er dokumentert. De kommer ikke fra ISO eller Språkrådet. Det er ikke lagt inn faste stilforbud som stopper historisk brukerrettet tekst. Eksisterende kontroller håndhever allerede enkelte konkrete regler for begrepsdefinisjoner.

Arbeidsflyten lager to sammenligninger: mot fast grunnmåling og mot PR-ens basecommit eller forrige main-push. Forrige kildekopi måles med den samme nye motoren og ordlisten som den aktuelle kopien. Ingen gammel PR-kode kjøres med skrivetilgang eller hemmeligheter. Faktiske målefeil i forrige kopi blir synlige som feil, ikke stille utelatt. Manuell kjøring uten sammenligningscommit bruker grunnmålingen.

Nye og bortfalte funn telles med stabile fingeravtrykk uten linjenummer. Samme tekst på ny linje blir ikke automatisk et nytt funn. Endret ordlyd kan gi ett bortfall og ett nytt funn. Endret overskrift eller slettet innhold påvirker også tallene. Rapporten sier derfor ikke at bortfall er en forbedring. Metode, terskler eller ordliste med ulik versjon/hash gir ingen direkte historisk sammenligning. Ved metodeendring: øk `METHOD`, dokumenter grunnen og lag en ny, navngitt grunnmåling i egen PR uten å slette den gamle.

Markdown går til Actions-sammendraget. Fullstendige JSON- og Markdown-rapporter lagres som artefakten `klarsprak` i 30 dager, med grunnmåling og mot forrige versjon. Varig historikk er git-loggen og de innmeldte grunnmålingene. Det bygges ikke en evig, automatisk database med hver kjøring. Bevar en rapport i repoet ved en avtalt språkrevisjon dersom den skal kunne sammenlignes etter at artefakten utløper.

## Manuell kontroll og brukertesting

Prosjekteier prioriterer sammen med tekstansvarlig. Den som foreslår en språkendring, registrerer side, kapittel, brukeroppgave, konkret mulig misforståelse, tekst før/etter og kildekontroll. Bruk funn-ID og commit som spor. Avgjørelsen er enten endring, forståelig i kontekst eller trenger testing. Begrunn hvorfor et presist fagord beholdes. Ingen automatisk omskriving eller skjuling av funn for å få lavere tall.

Start med én hel brukerreise. Rekrutter faktiske eller relevante brukere med ulike forkunnskaper, gjerne også personer som bruker skjermleser eller har lesevansker. Bruk oppdiktede tall og ikke be om privatøkonomiske opplysninger. Ingen produksjonslogging eller opptak er nødvendig. Brukertesting er ikke gjennomført ennå.

1. Avtal hva oppgaven betyr og hva som teller som riktig resultat før testen. Eksempel: «Du har mer penger på konto etter ti år. Undersøk hva du kan kjøpe for dem.» Ikke gi brukeren ordene «kjøpekraft» eller riktig meny som ledetråd.
2. Observer om personen finner rett informasjon uten hjelp. Noter fullført/ikke fullført, feil vei og hvor hjelp ble nødvendig. Tidsbruk er et lokalt observasjonspunkt, ingen universell beståttgrense.
3. Be personen forklare resultatet med egne ord. Spør «Hva betyr dette for eksemplet?» fremfor «Var forklaringen lett å forstå?» Kontroller mot forhåndsavtalt betydning og viktige forbehold.
4. La personen bruke opplysningen i en ny deloppgave, for eksempel endre prisvekst eller finne ut hva et uttak består av. Observer faktisk handling og tolkning. For lånesiden: forskjellen mellom avdrag og samlet betaling.
5. Gjenta oppgavene etter endring med sammenlignbare forutsetninger. Skill små kvalitative funn fra dokumenterte tall om hele målgruppen. Ingen representativitets- eller årsakspåstand fra noen få deltakere.

Før språk-PR godkjennes, skal en annen gjennomleser når mulig kontrollere at presisjon, nødvendige unntak, nøytralitet og kilder er bevart. Oppgi faktisk hvem som kontrollerte, og om det var egenkontroll. Skjema, feilmeldinger og rapport må kontrolleres i konteksten de brukes i, på mobil og PC, med forstørring og relevante hjelpemidler. Grønne funksjonstester erstatter ikke dette.

En oppfølgingslogg bør ha: commit, oppgave, målgruppe uten personnavn, metode, observert misforståelse, funn-ID/sted, beslutning, ansvarlig og ny kontroll. Lagre bare det som trengs for å reparere teksten. Ikke legg deltakernes økonomi eller identitet i et offentlig repo.

## Kildegrunnlag og avgrensning

Følgende offentlige veiledning er lest 4. november 2026 av ChatGPT/Codex, egenkontroll. Datoen er vår lesedato, ingen ny offentlig godkjenning. Ingen synlig kildedato er brukt for de udaterte nettsidene under.

- Språkrådet, [Kort om klarspråk](https://sprakradet.no/klarsprak/kunnskap-om-klarsprak/kort-om-klarsprak/), udatert. Definisjon, råd og fire prinsipper. Nivå 1.
- Språkrådet, [Generelle skriveråd](https://sprakradet.no/klarsprak/om-skriving/generelle-skriverad-bokmal/), udatert. Målgruppe, relevans, rekkefølge, avsnitt, setninger og forklaring av fagord. Nivå 1.
- Språkrådet, [NS-ISO 24495-1](https://sprakradet.no/klarsprak/kunnskap-om-klarsprak/iso-standard-for-klarsprak/), udatert. Offentlig norsk beskrivelse av styringsprinsippene, kontekst og leserbehov. Standarden fra 2023. Nivå 1.
- Språkrådet, [Brukartesting av tekstar](https://sprakradet.no/klarsprak/brukartesting-av-tekstar/), udatert. Reelle brukere, åpne spørsmål og testing underveis. Nivå 1.
- ISO, [24495-1:2023](https://www.iso.org/standard/78907.html), utgave 1, juni 2023, på engelsk. Bare kataloginformasjon og offentlig sammendrag lest, ikke den fullstendige standarden. Norsk normgrunnlag hentes fra Språkrådet over.
- Universitetet i Agder, [Lærerfokus, avsnitt om LIX](https://dekomp.uia.no/doku.php?id=kunstig_intelligens_i_skolen_for_laereren), udatert. Metodegrunnlag ved siden av nivåene: gjennomsnittlig setningslengde og andel ord over seks bokstaver. Ikke kilde til en terskel for våre sider, norsk tokenisering eller validering av forståelse. Ingen KI-metode fra siden brukes.

Kildene for de fem nye, upubliserte begrepsutkastene står i analyseordlisten med kildedato, lesedato og avsnitt. Finanstilsynets analyse er ført på nivå 3, ikke nivå 1, i tråd med KILDEREGLER.md. Det er bare lånetypenes beskrivelser på trykt side 11 som brukes. Ingen markedstall eller anbefalinger hentes derfra. Skatteetatens ASK-side brukes for kontotypen og skjermingsfradrag, ikke som kilde til en ny skatteberegning. Nkoms side brukes bare til teknologiforklaringen, ikke til en ny juridisk konklusjon.
