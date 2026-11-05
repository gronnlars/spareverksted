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
