# UU: kildeovervåking og dokumenterte kontroller

Bestilt av Lars 30.10.2026. Bidrag: ChatGPT/Codex. Relatert: #121, research/universell-utforming.md og research/uu-egenkontroll-uutilsynet.md. Bygger på main 521de3f1e7ae073c973aaeda70395a9a52d3048a. Åpne PR-er undersøkt, ingen eksisterende kildeovervåking funnet på main. PR #122 gjelder ressursmåling og holdes separat.

## Hva løsningen gjør

Egen GitHub Actions-workflow kjører daglig klokken 05.23 UTC, altså 06.23 norsk vintertid og 07.23 sommertid, og kan startes manuelt. Første automatiske kjøring krever at workflowen er slått sammen til standardgrenen. PR-kjøringer utfører bare offline tester. Ingen innhenting skjer i brukerens nettleser.

Registeret research/uu-monitor-sources.json skiller myndighetsveiledning, fremtidig regelverk, testregler, prosjektets WCAG 2.2 AA-mål og WCAG 3-utkast. Nyeste WCAG-publikasjon og W3Cs oversikt overvåkes i tillegg, slik at ny hovedversjon kan oppdages. Endringer er kandidater til gjennomgang, ikke automatiske nye krav.

Skriptet lagrer kildebytes, rå og normalisert SHA-256, hentetidspunkt, HTTP-metadata og rapport som artifact i 90 dager. HTML sammenlignes som tekst uten script/style. Endringer i navigasjon kan gi støy. Git-treet for tilsynets testregler filtreres til nettreglenes JSON-filer. Filhashene avslører også endringer i selve reglene uten at index.json trenger å endres. Rapporten lister endrede filer. Filene hentes og leses i en senere konkret kontroll før tester endres. Treet er en oppdagelsesmekanisme, ikke innholdskontroll av hver regel.

Siste vellykkede hash per kilde lagres i én bot-opprettet GitHub-sak. Feil overskriver ikke denne. Alle kjøringer oppdaterer status i saken, og endringer eller endret feilstatus gir kommentar. Ved feil blir workflowen rød. GitHubs varslingsinnstillinger bestemmer om Lars får e-post eller push. Ingen egen e-post sendes. Gjentatte identiske feil gir ikke daglige kommentarer.

Første henting merkes first_observation, aldri unchanged eller bestått. Ingen kilde er innholdskontrollert bare fordi uthentingen virker. En manuelt gjennomgått normalisert hash kan settes som reviewed_sha256 i registeret. Bare en dokumentert kontroll med omfang, dato og ansvarlig gir grunnlag for det. Endret hash gjør gjennomgangen utdatert. Dette er fortsatt ikke en test av nettstedet.

## Tre separate spor

1. Gjeldende lovkrav: følg myndighetsveiledning som varsel, kontroller den konkrete loven eller forskriften og omfang/ikrafttredelse før juridiske påstander endres. Monitoren avgjør ikke om regelverket gjelder Spareverksted.
2. Frivillig standardmål: prosjektet bruker WCAG 2.2 AA. Ny ferdig standard vurderes og kobles til testplanen også når den går utover norske lovkrav. Ingen automatisk påstand om etterlevelse. W3C-utkast registreres som utkast og kan gi ideer til forbedringer, men erstatter ikke ferdig standard.
3. Erfaringer: tilgjengelighetserklæringer er selvrapportering, ikke tilsynets egen godkjenning. Brukes til testideer, aldri til rangering eller bevis for vår tilgjengelighet.

W3Cs engelske primærkilder brukes til teknisk standardovervåking, slik de allerede inngår i research/universell-utforming.md. Det endrer ikke språk- eller kildekrav for publiserte norske juridiske og økonomiske påstander.

## Hvordan dette hjelper bakgrunnsarbeidet

Ved kildeendring: les forskjellen, bestem hvilke konkrete WCAG-kriterier og brukerreiser som berøres, kartlegg eksisterende testdekning, opprett avgrenset retting ved dokumentert feil og kjør relevante tester. Ingen KI brukes i workflowen. Eksternt kildeinnhold kjøres aldri som kode.

Prioriter #121: VoiceOver/NVDA, grafer, feilmeldinger som forsvinner, fokusmarkering og faktisk zoom. En kilde som er oppdatert betyr ikke at disse kontrollene er gjennomført. Manglende kjøringer oppdages ved å se siste forsøk i saken. Ingen uavhengig vakt overvåker om GitHub selv slutter å kjøre planlagte oppgaver.

## Hva vi kan vise brukerne

Bruk tilgjengelighetssiden til å vise valgt standardmål, siste faktisk utførte tester, testmiljø, kjente feil og hva som ikke er testet. Kildekontroll vises separat fra testdato. Ingen grønn godkjenningsstatus utledes fra at kildene svarer eller at HTML-validering består.

Denne PR-en endrer ikke dist. Offentlig tekst om at overvåkingen er aktiv legges først inn etter en vellykket produksjonskjøring av denne workflowen, med lenke til evidens. Foreslått kort tekst til senere kontroll: «Jeg følger med på endringer i standarder og veiledning. Endringer vurderes før jeg oppdaterer testene. Det betyr ikke at nettstedet er kontrollert mot alle krav.» Teksten er et forslag, ikke publisert informasjon.

## API-prøve 30.10.2026

En forespørsel til https://data.uutilsynet.no/dataset/alle-erklaeringer?size=1 returnerte HTTP 200 og ett element under _embedded.dataElements. Sidelenken pekte til page=2&size=1. TotalElements var 9632 i akkurat dette svaret, ingen stabil bestandspåstand. Bare feltnavn, sidemetadata og lenkestruktur ble inspisert, ikke en faglig gjennomgang av erklæringen. Ingen erklæringsinnhold committes.

Full datasettinnhenting er bevisst ikke automatisert. Før et eget behov oppstår: velg konkrete erklærings-ID-er, bekreft filterstøtte og lisens, begrens sider/bytes/tid, valider sidelenker, behold ufullstendig som egen status og vurder fritekst før eventuell deling. Bruk tilsynets eksempelskript som dokumentasjon, ikke ukritisk produksjonskode.

## Kontroller og videre arbeid

Kjør python3 tests/uu-monitor-test.py. Kjør python3 scripts/uu-monitor.py for ekte kildeobservasjon, resultat i tmp/uu-monitor. Utgående forespørsler har tidsavbrudd, ett nytt forsøk ved nettverksfeil, 2 MB-grense per kilde og samme vertsnavn ved videresending. Workflowen har ti minutters totalgrense. Kildesnapshot kan etterprøves i artifacts, men henting er ikke en faglig kontroll.

Første CI-kjøring må verifiseres etter PR. Testene dekker normalisering, feilet henting, bevaring av baseline, endring etter feil og sperre mot ekstern videresending. Ingen nettleserkode er endret. Ved senere utvidelse bør offisielle kilder kobles per kriterium til dokumenterte testutfall, slik at maskinlagde sammendrag ikke blir sterkere enn testgrunnlaget.

### Utført kontroll i denne PR-en

30.10.2026: Alle ni konfigurerte kilder ble hentet fra arbeidsmiljøet uten feil. Hentede snapshots ble deretter behandlet med sluttversjonen av normaliseringen, inkludert 130 nettregelfiler. Ny sammenligning av samme snapshots ga unchanged for alle ni. Dette er ikke en ny nettforespørsel eller faglig gjennomgang. Fem offline tester består. engine.test.cjs og tax-export.test.cjs består. Workflow-YAML er parsbar og git diff --check er uten feil. Automatisk kjøring på GitHub, bot-sakens opprettelse/oppdatering og GitHub-varsler er ikke verifisert ennå. Ingen skjermleser- eller nettlesertest ble utført fordi nettstedets kode ikke endres.
