# GitHub-gjennomgang og kontrollplan, 5. november 2026

Arbeidsgrunnlag: main `ae3531d860b25773a3a91bce513bfbc48cf7cf45`, etter avsluttet kalkulatorfinpuss i #231. ChatGPT/Codex, egenkontroll. Denne gjennomgangen endrer ingen filer i `dist/`, beregninger, grafikk, rapportbygger eller lagringsnøkler. #228 er en separat statuslogg og er ikke kopiert inn eller slått sammen her.

## Verifisert sikkerhetsvarsel

Riktig ID er **GHSA-cxww-7g56-2vh6**, CVE-2024-42471. Tidligere notat hadde skrivefeil i ID og versjonsnummer. Lars viste 5. november skjermbildet med `v4.1.3` og et forslag merket «Outdated».

GitHubs sikkerhetsmelding oppgir berørte versjoner fra og med 4.0.0 til før 4.1.3. Første rettede versjon er 4.1.3. Meldingen tillater også oppdatert v4-tagg. Ved kontroll i denne økten peker både `v4` og `v4.3.0` på `d3f86a106a0bac45b974a628896c90dbdf5c8093`. Valget er å feste denne nyere revisjonen, uten å gå tilbake til 4.1.3 eller gjøre et større hovedversjonsbytte. Dette dokumenterer rettingen for dette varselet, ingen generell sikkerhetsgodkjenning.

Primærkilder lest 5. november 2026:

- https://github.com/advisories/GHSA-cxww-7g56-2vh6
- https://github.com/actions/download-artifact/releases/tag/v4.1.3
- https://github.com/actions/download-artifact/releases/tag/v4.3.0
- https://api.github.com/repos/actions/download-artifact/git/ref/tags/v4
- https://api.github.com/repos/actions/download-artifact/git/ref/tags/v4.3.0

## Endringen og kontrollen

Deploy bruker fast SHA med versjon og varsel-ID i kommentar. Navn `privacy-page`, kildekjøring og målmappe `dist` beholdes. Ingen andre Actions oppgraderes i denne runden. Åpne #193 vurderes separat mot fersk main før større oppdatering.

Nettleserjobben laster nå ned den verifiserte personvernsiden til en midlertidig mappe med samme Action og sammenligner den byte for byte med originalen. Dette skjer på PR og main etter at alle tre personvernmotorene har bestått og siden er lastet opp. Feil ved nedlasting eller sammenligning gir rød jobb og stopper deploy gjennom eksisterende `needs: [checks, browser]`. Ingen `continue-on-error`, ekstra rettigheter, eksterne mottakere eller egen publiseringsvei.

Renters rente-testens kommentar er korrigert: lokal testserver erstatter publiseringsfilteret. Den tester den historiske svarvisningen, ikke den nye kandidaten i #200. Den faktiske publiseringslisten testes separat i `published-answers-browser.cjs`, som avviser renters rente så lenge det ikke er godkjent for publisering. Testlogikk og publiseringsutvalg endres ikke.

Bidragsveiledningen viser relevante Node-, Python- og nettlesertester i stedet for den utdaterte instruksen «begge testfilene».

## Hva som undersøkes når

| Steg | Undersøkelse | Ferdigkriterium |
| --- | --- | --- |
| Denne PR-en | Sikkerhetsvarsel, fast revisjon, faktisk artifact-nedlasting og tydelig testomfang | Lokale struktursjekker og eksisterende relevante tester består. PR-kjøringen må bevise opplasting, nedlasting og identisk innhold. |
| Etter godkjent sammenslåing | Samme revisjon i deploy, faktisk nedlasting og fullført publisering | Kontroller main-kjøringen. PR beviser ikke produksjonsdeploy. Aikido-status bekreftes separat, ikke antatt løst av kodeendringen. |
| Før flere tester kobles inn | `finpuss`, `testfunn`, `rapportvalg` og låneavhengig `linjeforing` er ikke direkte koblet inn på denne main-versjonen. #228 foreslår to av dem. | Sammenhold med endelig #228. Vurder om forventningene fortsatt stemmer, og kjør dem før innkobling. Ingen blind masseinnkobling. |
| Før videre svarpublisering | Skillet mellom ekte publiseringsfilter og seks lokale testservere som bruker `draft-assets.cjs` | Dokumenter hvert testformål og kontroller kandidaten gjennom ekte generator, kildeoppfølging og publiseringsfilter. Ingen slutning fra utkasttest til publiseringsklar kandidat. |
| Før endret testutvalg | Avhengigheter mellom felles CSS/JS, genererte svar, rapporter, lagring og tester | Filbasert utvalg må inkludere følgevirkninger. Beregnings-, personvern- og sikkerhetssperrer bevares. |
| Før kortere kjøretid | Flere kjøringer, oppstartskostnad, dupliserte kontroller og midlertidige filbaner | Bevar testdekning og rapporter. Parallellisering må unngå kollisjon og samle alle nødvendige resultater før deploy. |
| Før samordning av Actions | #193, offisielle versjonskrav, runner og sikkerhetsvarsel | Avgrenset oppgradering fra fersk main, uten å overskrive nyere trinn eller redusere tester. |
| Fast faglig vedlikehold | Eksisterende Kildevakt/Tidsmaskin og kontrollkalender i KILDEREGLER K7 | Skill vellykket henting fra faglig kontroll. Varsler om kommende regelår behandles selv om kjøringen er grønn. |

## Målegrunnlag og begrensninger

Kjøring 42061495454 på #200: checks 24 sekunder, browser 751 sekunder, 91 nettlesertrinn, deploy hoppet over. Kildevakt 42061495934 tok 54 sekunder og klarspråk 42061495748 tok 13 sekunder. Dette er historiske målinger fra før siste finpuss, ikke nye målinger av denne PR-en. Nettleserjobben kjører sekvensielt. Fakta- og Kildevakt-tester kjøres både i hovedjobben og i relevant kildearbeidsflyt. Dobbeltkjøring er et vurderingspunkt, ikke i seg selv en feil.

Lokalt i denne økten: YAML lest maskinelt, gamle testkommandoer og deploy-vilkår sammenlignet med main, sikkerhet, innholdsbaserte versjoner, personvernrapportens validering, tre deploy-tester, JavaScript-syntaks og diff-kontroll. Ingen lokal full nettleserkjøring eller ny domeneskanning. Artifact-rundturen krever GitHub Actions. Produksjonsdeploy og ny Aikido-skanning gjenstår etter sammenslåing.

## Opprinnelig notat, bevart som historikk

Følgende avsnitt er den opprinnelige registreringen. Feil ID og versjonsnummer er avklart over.


Lars meldte 5. november 2026 et Aikido-varsel med ID **GHSA-cxwv-7g56-2vh6** og foreslo `v4`-tagg eller versjon `4.3.1`. Han ba om at oppfølgingen tas ved den planlagte gjennomgangen av GitHub, uten å utvide kalkulatorrettingene.

Dette er registrert som et **rapportert varsel**, ikke som en ferdig verifisert beskrivelse av berørt komponent eller en påstand om at en versjonsendring er utført. Advisory-siden og korrekt versjonsgrense må kontrolleres mot primærkilden før retting:

https://github.com/advisories/GHSA-cxwv-7g56-2vh6

Ved gjennomgangen:

1. Bekreft ID, berørt Action/pakke, berørte versjoner og rettet versjon i den offisielle sikkerhetsmeldingen. Ta utgangspunkt i Aikido-funnet dersom ID-en ikke kan slås opp direkte.
2. Kontroller alle brukssteder og hva taggen faktisk peker til. Koden på main etter #222 bruker allerede `actions/download-artifact@v4` i `.github/workflows/static.yml`; det beviser ikke alene hvilken revisjon en tidligere kjøring brukte, eller at dette er komponenten i varselet.
3. Vurder om verifisert rettet revisjon skal festes til SHA eller versjon etter prosjektets policy. Ikke stol på at ordet `v4` alene dokumenterer en retting.
4. Kontroller både PR-kjøring og publiseringens nedlasting av artefakter før saken lukkes. Før opp faktisk verifisert status og eventuelle gjenstående funn.

Lars opplyser også at domeneskanningen i Aikido ikke fant problemer. Dette er et avgrenset resultat fra hans skanning. Det er ikke utført en ny domeneskanning i denne økten, og notatet er ingen generell sikkerhetssertifisering.

Arbeidsflytene er ikke endret som del av dette notatet. Oppfølgingen holdes atskilt fra kalkulatorens pågående feilrettinger.


## Neste trinn: Java-varselet i #193

Oppdatert 5. november 2026 etter main 018d80f og kjøring 42100281184. Kjøringen fullførte checks, browser og deploy med success. Browser hadde 107 steg og tok 689 sekunder. Checks tok 26 sekunder, deploy 75 sekunder. Dette er ett målepunkt, ikke et gjennomsnitt eller en garanti for neste kjøring. #228 er nå slått sammen, inkludert testfunn og rapportvalg. Eldre status over bevares som historikk.

#193 avgrenses til de tre bruksstedene for setup-java i static.yml. Alle bruker fast revisjon b6effb05e454b25005698d916606bdc6ffcbf961 fra v5. Temurin og Java 21 beholdes. V5 bruker Node 24 og krever runner 2.327.1 eller nyere. Arbeidsflyten bruker GitHub-hostede ubuntu-latest-runnere, og browser beholder Playwright-bildet basert på Ubuntu Noble. Faktisk kjøring i GitHub må bekrefte kompatibilitet, også inne i containeren.

Kilder lest i samme økt, 5. november 2026:

- https://github.com/actions/setup-java/blob/v5/README.md
- https://github.com/actions/setup-java/blob/b6effb05e454b25005698d916606bdc6ffcbf961/action.yml
- https://api.github.com/repos/actions/setup-java/git/ref/tags/v5

Alternativer: behold v4 og varselet, oppgrader Java-oppsettet alene, eller gjennomfør alle hovedversjonsbyttene fra opprinnelig #193 samtidig. Java alene er valgt for å kunne etterprøve én endring. Forslaget om checkout v5, setup-node v5, setup-python v6, upload-artifact v6, download-artifact v7 og ubuntu-24.04 fra opprinnelig #193 er utsatt, ikke godkjent eller slettet fra historikken. Versjoner og krav må undersøkes på nytt før de eventuelt brukes. Ingen nyere artifact-revisjon byttes ut.

Testkommandoer, antall steg, jobber, rettigheter, vilkår og publiseringsavhengigheter beholdes. Dette fjerner et vedlikeholdsvarsel, men er ikke et tiltak som lover kortere kjøretid. Før testutvalg eller parallellisering endres, kartlegges avhengigheter og filbaner som kan kollidere.

Kontrollform: ChatGPT/Codex, egenkontroll av YAML og diff mot fersk main. Ingen lokal full nettleserrunde for en Action-versjon som må prøves på GitHub. PR-kjøringen skal vise Java 21 og vellykket HTML-validering i checks og browser uten v4-varselet. Etter Lars sin merge må deploy vise det samme og fullføre. Publisering av denne endringen er ikke kontrollert på forhånd.


## Trinnvis artifact-oppgradering til Node 24, 7. november 2026

Arbeidsgrunnlag main 27b13e9 etter #245. Main-kjøring 42319736189 bestod checks, browser og deploy. Browser tok 612 sekunder. Resultatlinjeparet og WebKit-kontrollen av infosidene bestod. Dette er én kjøring, ikke et gjennomsnitt.

Lars viste to varsler i den separate «pages build and deployment»-kjøringen. Kjøring 42319735178 bruker den genererte stien dynamic/pages/pages-build-deployment. Den er ikke definert i static.yml. Opplasting via upload-artifact@v4 varsler om Node 20 som er tvunget over på Node 24. ubuntu-latest varsler om flytting til Ubuntu 26.04. Begge er vedlikeholdsmeldinger i en bestått kjøring, ikke bevis på feil i kalkulatoren. Endringen under fjerner ikke disse meldingene fra GitHubs genererte workflow.

Neste avgrensede PR oppdaterer bare de tre upload-artifact-stegene i static.yml til fast SHA b7c566a772e6b6bfb58ed0dc250532a479d7789f, kontrollert som både v6 og v6.0.0 den 7. november. Action-filen på denne SHA-en angir runs.using: node24. V6 krever runner 2.327.1 eller nyere. Vi bruker GitHub-hostede ubuntu-latest-runnere, og browser beholder Playwright/Noble-containeren. Faktisk kjøring må bekrefte Node 24-støtte også der.

V7.0.2 er nyeste publiserte versjon ved kontrollen. V6 velges her for det avgrensede Node 24-bytte. V7 innfører også ESM og nye muligheter for direkte filopplasting. Dette er ikke en påstand om at v7 er inkompatibel eller usikker. Større dependency-/modulbytte vurderes separat. Andre workflows beholder sine upload-versjoner til denne runden er prøvd.

Alle artifact-navn, filbaner, lagringstider, kjørevilkår og rettigheter beholdes. Personvernbevis, personvernside og UI-bilder er de tre opplastingene. Eksisterende download-artifact er fortsatt festet til v4.3.0 med sikkerhetsrettingen. Den skal ikke nedgraderes. Rundturen laster ned privacy-page og sammenligner byte for byte før publisering, og deploy laster ned samme navngitte artifact fra samme kjøring. Ingen endring i testutvalg, produksjonsfiler eller deploy-avhengigheter. Ingen bestemt tidsgevinst loves.

Primærkilder lest i denne økten:

- https://github.com/actions/upload-artifact/releases/tag/v6.0.0
- https://api.github.com/repos/actions/upload-artifact/git/ref/tags/v6
- https://api.github.com/repos/actions/upload-artifact/git/ref/tags/v6.0.0
- https://github.com/actions/upload-artifact/blob/b7c566a772e6b6bfb58ed0dc250532a479d7789f/action.yml
- https://github.com/actions/upload-artifact/blob/v6/README.md
- https://github.com/actions/upload-artifact/releases/tag/v7.0.0
- https://github.com/actions/upload-artifact/releases/tag/v7.0.2
- https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
- https://github.com/actions/runner-images/issues/14748

Lokalt: YAML-paritet viser nøyaktig tre endrede uses-felt og identisk øvrig workflow. Sikkerhet, versjoner, gammel-kode-vern og diff består. Ingen ny lokal full nettleserrunde for en Action som kjører i GitHub. Før Lars merger: PR må bestå alle kontroller, de tre opplastingene og personvern-rundturen. Etter merge må main bekrefte deploy-nedlasting og publisering. Manglende UI-bilder følger fortsatt eksisterende ignore-valg.

Pages-oppsettet og valg av runner endres ikke. Før eventuell avvikling av Pages må domene/DNS, eventuelle lenker til github.io, reservebruk og hvilken publiseringsvei som faktisk betjener brukerne avklares. Ingen konklusjon om overflødig publisering trekkes bare fra at Bunny også kjører. ChatGPT/Codex, egenkontroll.


## Samme artifact-revisjon i øvrige egne workflows, 7. november 2026

Arbeidsgrunnlag main 4cd0321 etter #246. Kjøring 42352020964 bestod checks, browser og deploy. Alle tre opplastinger, nedlasting av privacy-page og bytekontrollen bestod. Dermed er v6.0.0-revisjonen prøvd i prosjektets hovedløp og container. Det beviser ikke at alle andre arbeidsflyter har kjørt med den.

Neste steg bruker samme faste SHA b7c566a772e6b6bfb58ed0dc250532a479d7789f i de fire gjenværende upload-artifact-bruksstedene: én i klarsprak.yml, to i kildevakt.yml og én i ressursmaaling.yml. Alle tre workflows er lest i sin helhet. Bare uses-feltene endres. Filtre, tidsplaner, tillatelser, rapportnavn, filbaner, lagringstider, feilvalg og kommandoer er identiske. Ingen hovedworkflow, produksjonsfil, kildebehandling eller målemetode endres.

Disse filendringene utløser eksisterende PR-kontroller for klarspråk, Kildevakts provekjoring og ressursmåling. Kildevakts vakt-jobb er sperret for pull_request og skal være skipped i PR. Vi starter ikke vakt manuelt. Prøvekjøringen beholder eksisterende innhenting og tørrkjørt varsling uten saker og lagring på kildedata-grenen. Forventede rapporter er klarsprak, kildevakt-provekjoring og ressursmaaling. Gjeldende warn/always-valg kan gi opplastet delrapport selv om tidligere steg feiler. En artifact alene er derfor ikke bevis på bestått måling.

Før Lars merger skal relevante PR-kontroller og rapportopplastinger bekreftes i GitHub. Den fjerde opplastingen, kildevakt-${{ github.run_id }}, hører til vakt-jobben og prøves først ved neste ordinære planlagte eller særskilt autoriserte kjøring etter merge. Ingen påstand om at denne er verifisert før den faktisk kjører. Main beholder full hovedtest og publisering som før.

Lokalt: maskinell YAML-paritet normaliserer bare de fire nye uses-feltene og sammenligner hele workflowene med main. Sikkerhet, versjoner, gammel-kode-vern og diff består. Ingen ny lokal nettleserrunde eller ekstern kildehenting er startet for dette revisjonsbyttet. Node 24-krav og primærkilder er dokumentert i forrige avsnitt. GitHubs genererte Pages-workflow og ubuntu-latest endres ikke, så varsler der kan fortsatt forekomme. ChatGPT/Codex, egenkontroll.


## Fest hovedløpet til faktisk prøvd Ubuntu-versjon, 8. november 2026

Arbeidsgrunnlag main 21c2567 etter #247. Main-kjøring 42355033323 bestod checks, browser og deploy. Klarspråk 42355033319 og ressursmåling 42355033260 bestod også på samme commit. Kildevakts ordinære vakt er ikke bekreftet i denne gjennomgangen og startes ikke manuelt.

Oppstartsloggene fra alle tre hovedjobber er lest: checks 128351148608, browser 128351254124 og deploy 128353842144. Alle oppgir Ubuntu 26.04.1, Image ubuntu-26.04. Det er dermed feil å anta at prosjektet fortsatt bruker Ubuntu 24.04 på vertsmaskinen. Browser kjører fortsatt sin faste Playwright 1.56.0/Noble-container oppå verten.

Neste PR endrer bare runs-on fra ubuntu-latest til ubuntu-26.04 i de tre jobbene i static.yml. Dette fester OS-hovedversjonen til den som nettopp bestod. Det fryser ikke runnerbildet, sikkerhetsoppdateringer eller alle installerte verktøy. Ingen påstand om raskere kjøring eller løst produktproblem. Andre egne workflows og GitHubs genererte Pages-jobb beholdes i denne avgrensningen.

Alternativer: behold latest, gå tilbake til 24.04 eller navngi faktisk prøvd 26.04. Sistnevnte velges for kontroll over framtidige hovedversjonsbytter. Tilbakegang til 24.04 mangler et konkret feilgrunnlag her. GitHubs migreringsmelding er lest på https://github.com/actions/runner-images/issues/14748 og støtter eksplisitt 26.04 som valgt etikett. Dette er ingen full livsløpsvurdering av runnerplattformen.

Lokalt: YAML-paritet bekrefter bare tre endrede runs-on-felt. Alle Actions, kommandoer, containere, rettigheter, artifact-rundtur og publiseringsvilkår er identiske. Sikkerhet, versjoner, gammel-kode-vern og diff består. Ingen produksjonsfil endres. PR må bekrefte samme runnerhovedversjon og alle kontroller før Lars merger. Deploy på eksplisitt etikett bekreftes først på main etter merge. Revurder ved dokumentert kompatibilitetsfeil eller varslet utfasing. ChatGPT/Codex, egenkontroll.


## Checkout til Node 24 i hovedløpet, 8. november 2026

Arbeidsgrunnlag main 326c8e7 etter #248. Kjøring 42497112368 fullførte med success. Neste avgrensning oppdaterer bare tre checkout-brukssteder i static.yml til fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09. Både v5 og v5.1.0 er kontrollert mot denne commit-en. Action-filen angir node24 for kjøring og opprydding. V5 krever runner minst 2.327.1; prosjektet bruker GitHub-hostede runnere og har allerede prøvd Node 24-Actions i Playwright-containeren. Checkout må likevel prøves i sin egen oppstarts- og oppryddingsfase.

V5.1.0 har strengere standarder rundt checkout av PR-kode ved privilegerte hendelser som pull_request_target og workflow_run. static.yml bruker push/main og vanlig pull_request. Ingen eksplisitt ref, token eller allow-unsafe-pr-checkout legges til. fetch-depth: 0 i checks beholdes for omfang og gammel-kode-vern. Standard checkout av PR-mergegrunnlaget, safe-directory-håndtering, credentials-opprydding og etterfølgende HEAD-kontroller skal fortsatt virke. Browser og deploy beholder sine øvrige standardvalg.

Alternativer: behold v4, oppgrader checkout alene til v5 med Node 24, eller flytt samtidig flere Actions og endre checkout-innstillinger. V5 alene velges for avgrenset prøving. Ingen påstand om at v5 er nyeste hovedversjon. Andre egne workflows beholdes til dette er prøvd.

Primærkilder lest 8. november:

- https://github.com/actions/checkout/releases/tag/v5.0.0
- https://github.com/actions/checkout/releases/tag/v5.1.0
- https://api.github.com/repos/actions/checkout/git/ref/tags/v5
- https://api.github.com/repos/actions/checkout/git/ref/tags/v5.1.0
- https://github.com/actions/checkout/blob/fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09/action.yml
- https://github.com/actions/checkout/blob/fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09/README.md

Lokalt: YAML-paritet viser bare tre endrede uses-felt. Sikkerhet, versjoner, gammel-kode-vern og diff består. Ingen produksjonsfil eller testforventning endres. GitHub må bekrefte checkout og opprydding i checks/browser, riktig git-grunnlag, full testpakke og artifact-rundtur før Lars merger. Deploy-checkout prøves først i main-push etter merge. Ingen bestemt tidsgevinst loves. ChatGPT/Codex, egenkontroll.


## Siste Node 20-Actions i hovedløpet, 8. november 2026

Arbeidsgrunnlag main e7cbb10 etter #249. Claude, egenkontroll. Main-kjøring 42500414892 er kontrollert, se eget avsnitt nederst.

Annotasjonene i main-kjøring 42497112368 viser hvilke Actions i static.yml som fortsatt deklarerer Node 20 og tvinges over på Node 24. Etter #249 gjenstår tre: setup-node i checks, download-artifact i browser og deploy, og setup-python i deploy. Denne PR-en fester disse fire bruksstedene til revisjoner som deklarerer node24. Målet er null Node 20-varsler fra egne steg i hovedløpet, slik at publiseringen ikke er avhengig av GitHubs midlertidige tvangsoverføring.

| Action | Fra | Til | Bruk |
| --- | --- | --- | --- |
| setup-node | v4 (flyttbar tagg) | a0853c24544627f65ddf259abe73b1d18a591444, v5.0.0 | checks |
| download-artifact | d3f86a1, v4.3.0 | 37930b1c2abaa49bbe596cd826c3c89aef350131, v7.0.0 | browser-rundtur og deploy |
| setup-python | v5 (flyttbar tagg) | e797f83bcb11b83ae66e0230d6156d7c80228e7c, v6.0.0 | deploy |

Taggene er lest med git ls-remote mot actions-repoene 8. november, og action.yml på hver revisjon er lest. Alle tre angir runs.using: node24.

Vurdering per Action:

- setup-node v5 legger til automatisk mellomlagring når package.json har feltet packageManager. Repoet har ingen package.json. Koden fanger manglende fil og slår da ikke på mellomlagring. Node-versjon 22 beholdes. Ellers er inndata uendret.
- download-artifact v5 endret utpakking ved nedlasting med artifact-ID, slik at den blir lik nedlasting med navn. Begge brukssteder laster ned med navn til fast mappe, så filbanen dist/personvern.html er den samme. v6.0.0 deklarerer fortsatt node20. v7.0.0 er første versjon med node24 som standard. Sikkerhetsrettingen for GHSA-cxww-7g56-2vh6 kom i 4.1.3, og v7.0.0 er nyere. Ingen nedgradering. v8 er nyere, men velges ikke i samme runde.
- setup-python v6 legger bare til inndata pip-version. Python 3.12 og pip-installasjonen fra requirements-deploy.txt beholdes.

Alternativer: tre separate PR-er, eller bare de stegene som kan prøves på PR. Én samlet PR velges fordi alle tre er rene runtime-bytter uten endrede inndata, og fordi deploy uansett først kan prøves på main. Tre separate runder ville gitt tre main-publiseringer for samme type endring. Ulempen er at en feil i deploy må spores mellom to Actions. Første feillogg viser hvilken.

Hva som prøves hvor:

- PR: setup-node i checks og download-artifact i browser-rundturen, inkludert bytesammenligning av personvernsiden. Rundturen bruker samme navn og samme kallform som deploy.
- Main etter merge: download-artifact og setup-python i deploy, W3C-skriving, Bunny-opplasting og cache-tømming.

Lokalt: YAML-paritet viser nøyaktig fire endrede uses-felt og identisk øvrig struktur. Sikkerhet, versjoner, gammel-kode-vern og diff består. Ingen produksjonsfil, testforventning, tillatelse eller publiseringsvilkår endres. Ingen tidsgevinst loves.

Utenfor denne PR-en, egne workflows: checkout@v4 (seks steder i klarspråk, Kildevakt, Tidsmaskin og ressursmåling), setup-node@v4 (tre), setup-python@v5 (ett) og ubuntu-latest (fem jobber). Kildevakt bruker git-worktrees, autentisering og push, og vurderes for seg. GitHubs genererte Pages-jobb endres ikke av dette.

Primærkilder lest 8. november 2026:

- https://github.com/actions/setup-node/blob/a0853c24544627f65ddf259abe73b1d18a591444/action.yml
- https://github.com/actions/setup-node/blob/a0853c24544627f65ddf259abe73b1d18a591444/README.md
- https://github.com/actions/download-artifact/blob/37930b1c2abaa49bbe596cd826c3c89aef350131/action.yml
- https://github.com/actions/download-artifact/blob/37930b1c2abaa49bbe596cd826c3c89aef350131/README.md
- https://github.com/actions/download-artifact/blob/018cc2cf5baa6db3ef3c5f8a56943fffe632ef53/action.yml (v6.0.0, node20)
- https://github.com/actions/setup-python/blob/e797f83bcb11b83ae66e0230d6156d7c80228e7c/action.yml
- https://github.com/advisories/GHSA-cxww-7g56-2vh6

### Kontroll av #249 på main

Main-kjøring 42500414892 på e7cbb10 fullførte med success: checks 24 sekunder, browser 9 min 34 s, deploy 58 sekunder. Alle tre jobber oppgir Image ubuntu-26.04 og lastet ned checkout fbc6f39. Post Run for checkout bestod i alle tre. I browser bestod personvernrapport, opplasting, nedlasting og bytesammenligning. Deploy bestod nedlasting av privacy-page, W3C-skriving, opplasting til Bunny Storage og tømming av CDN-cachen. Checkout er ikke lenger nevnt i Node 20-annotasjonene. De gjenværende annotasjonene nevner nøyaktig setup-node@v4, download-artifact d3f86a1 og setup-python@v5, som er de tre denne PR-en endrer. Én kjøring, ikke et gjennomsnitt.
