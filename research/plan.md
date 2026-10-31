# Plan for Spareverksted

Én levende plan. Oppdateres her i stedet for nye planfiler. Samlet 24. oktober 2026. Status gjennomgått 30. oktober 2026 mot main `6d451f1` og åpne PR-er. Oppdatert 31. oktober etter sammenslåing av W3C-rettingen #129 som `1731c1f`. Eldre målinger nedenfor er historikk, ikke nye testresultater.

Redaksjonell arbeidskø ligger i [SPORSMALSKO.md](../SPORSMALSKO.md). Arbeidsinstruksen er [DAGLIG-OPPGAVE.md](DAGLIG-OPPGAVE.md). Denne filen sier hva som skal gjøres og i hvilken rekkefølge.

## 0. Sparekalkulatoren er fryst (24.10.2026)

Kalkulatoren er ferdig og er grunnmuren i Spareverksted.

- Ingen nye funksjoner, ingen ombygging, ingen kosmetisk finpuss.
- Endringer krever en av disse begrunnelsene: dokumentert regnefeil, alvorlig brukshindring, nødvendig kildeoppdatering (satser, renter, forutsetninger i `dist/assumptions.js`) eller tilgjengelighetsfeil.
- Gjenstående kontroller er kvalitetssikring. Funn som ikke faller inn under begrunnelsene over, parkeres.
- Nye ideer går til parkeringslisten (punkt 9). De får ikke automatisk plass i planen.
- Andre deler kan lenke til kalkulatoren med delingslenker som finnes i dag, uten å endre den.

Offentlig beskriver vi bare det vi kan dokumentere: hvilke beregninger som er uavhengig kontrollert, hvilke tester som kjøres, og hva som ikke er testet. Ingen påstander om å være best.

Universell utforming følger hele nettstedet. Krav, begrunnelser og gjennomførte kontroller står i `research/universell-utforming.md` og gjelder hver ny del fra første utkast.

Videre arbeid gjelder helheten rundt kalkulatoren: lære, finne svar, utforske og teste forståelsen.

## 1. Gjeldende rekkefølge og status, 30. oktober 2026

Prosjektpausen i [docs/regulatorisk.md](../docs/regulatorisk.md) gjelder. Arbeid kan utføres innenfor de vedtatte unntakene og Lars' konkrete oppdrag. Ingen generell gjenåpning av innholdspåfyll, nattoppgave, nye kalkulatorfunksjoner eller tilpasning etter brukeropplysninger. Hver PR krever Lars' godkjenning før sammenslåing. Main-push starter testing og publisering, også for dokumentasjon.

### Publisert og kontrollert

| Arbeid | Faktisk status og dokumentasjon |
| --- | --- |
| Feltfeil og startguide | #125 publisert. Retting fjerner gamle feilmarkeringer, bruker samme grenser i startguide og kalkulator og viser feil ved feltet. Skrivefeltets grense på 10 millioner kr per måned beholdes etter Lars' valg. Skyveknappen går fortsatt til 20 000 kr. |
| Menyer og temavalg | #127 publisert. Rettet tom meny på infosider, skjult meny på Spør om sparing/startvisning og plass til temavalg ved smal visning. CI prøver Enter, Tab og Escape, synlige lenker, sidebredde og temaknapper. Smal viewport er ikke en faktisk zoomtest. |
| Offentlig UU-status | #126 og #127 publisert. Lars' Chrome-egentest og WAVE-observasjon dokumentert i [uu-egenprove-2026-10-30.md](uu-egenprove-2026-10-30.md). Ny WAVE-observasjon: 0 feil, 0 kontrastfeil og 10 varsler i testet tilstand. Ingen full WCAG-godkjenning. |
| Ressursbruk og miljø | #122 publisert som `6d451f1`. Egen side med lenke fra Om. Main-run 41068973533: checks, browser og deploy grønne. Ressursmåling på main 41068973825 besto. Lokal syntetisk gzip/cache og oppdiktede brukerhandlinger, ikke måling av produksjonens overføring, energibruk eller utslipp. Se [docs/ressursbruk.md](../docs/ressursbruk.md). |
| W3C-kontroll | Alle seks HTML-sider, inkludert ressursbruk.html, inngår allerede i automatisk Nu-kontroll. Publisert resultat oppdateres ved deploy. Nyere kontroll på en PR må ikke omtales som kontroll av publisert versjon. |

### Nærmeste oppfølging

1. **W3C #129, sammenslått 31. oktober 2026.** «Article lacks heading» er rettet ved at eksisterende resultatoverskrift tilhører artikkelen. Ressurssiden får lesernavnet «Ressursbruk og miljø» i kontrollrapporten. Nu 26.10.12 lokalt: 0 feil og 0 advarsler på alle seks sider. CI testpakke 41074391843, ressursmåling 41074392109 og CodeQL er grønne på `76b0d68`. Sammenslått som `1731c1f` etter Lars' oppdrag om å oppdatere siste sideendringer. Publiseringskjøringen på main må fullføres før rettingen regnes som publisert.
2. **Manuell UU-oppfølging.** Gjenskap grafens opplesning og vurder WAVE-varslene i de tilstandene innholdet vises. Prøv den publiserte menyrettingen med faktisk 400/500 % zoom. Konkrete åpne punkter står i punkt 3 og 10. Ingen ny funksjon for å starte beregning via Shift+Tab.
3. **UU-kildeovervåking #123, til kontroll og godkjenning.** Kode og dokumentasjon ligger i åpen PR. Daglig kjøring og feilvarsling er ikke aktivert på main. Før aktivering kontrolleres siste gren mot main, og etter godkjent sammenslåing verifiseres en ekte kjøring og GitHub-sakens oppdatering. Skill lovkrav, frivillig WCAG-mål og utkast. Regel- og innholdsendringer skal fortsatt vurderes før publisering.
4. **Ressursbruk, neste avgrensede steg.** Kontroller separat produksjonsmåling med faktisk komprimering/cache og dokumenter resultatets kodegrunnlag og begrensninger. Modellanslag, CO₂.js, terskler og eventuell miljømerking er ikke innført. Videre arbeid følger den eksisterende planen i docs/ressursbruk.md og krever avgrenset oppdrag.

5. **Personvernkontroll og CSP, publisert 31. oktober.** #132 og #133 er slått sammen. Main `ec6a45c`: kjøring 41198991519 besto checks, browser og deploy. Datert resultat og utdyping er kontrollert på publisert personvernside, sammen med CSP og beskrivelse av sikkerhetstiltak. Dette er teknisk egenkontroll, ikke ekstern revisjon eller menneskelig brukertest. Manglende sikkerhetshoder fra serveren gjenstår. Se docs/personvern-lagring.md og docs/sikkerhet.md.

### Før offentlig lansering: vurder bunny.net som mellomledd

**Beslutning fra Lars 31. oktober 2026:** Grunnmuren og en god kunnskapsbase skal prioriteres først. Deretter undersøkes og eventuelt innføres bunny.net foran GitHub Pages før nettsiden lanseres for allmennheten. GitHub skal fortsatt brukes til kode, testing og automatisk publisering. Minstekostnaden på 1 USD per måned er akseptabel; trafikk kan gi høyere kostnad. Dette er en prioritert kandidat, ikke et endelig leverandørvalg eller en personverngodkjenning.

**Avvent innføring.** Dette planvedtaket gir ingen fullmakt til å opprette konto, kjøpe tjenesten, endre DNS/navnetjenere eller aktivere proxy nå. Prosjektpausen og øvrige lanseringsvilkår gjelder fortsatt.

Før eventuell innføring må følgende være dokumentert:

1. Gjeldende pris, trafikkgrenser, kostnadsstyring og faktisk støtte for GitHub Pages som opprinnelsesserver og egne HTTP-svarhoder. Kontroller oppdaterte primærkilder på nytt når arbeidet starter.
2. Databehandleravtale, underleverandører, behandlingssteder, overføringer, hvilke besøksdata/logger som behandles, lagringstid og sletting. Kontroller muligheten til å minimere logging og fjerne IP-adresser fra lagrede logger. EU-baserte logger er ikke bevis på at all behandling skjer i EU.
3. Cookies, innskutt JavaScript, botutfordringer og sporing i valgt konfigurasjon. Prøv både vanlige besøk og eventuelle sikkerhetsutfordringer. Leverandørens generelle personvernprofil erstatter ikke måling og avtalegjennomgang.
4. HTTPS på begge forbindelser, tilpasset CSP, HSTS innført trinnvis, nosniff og beskyttelse mot innramming. Ingen ukritisk preload eller includeSubDomains. Bevar e-postens DNS-poster, GitHub-publisering, kontakt, deling, nedlasting og andre eksisterende funksjoner. Dokumenter tilbakeføring før DNS endres.
5. Gjenta personvern- og sikkerhetstester i tre nettlesermotorer, kontroller faktiske produksjonssvarhoder og kjør Observatory på riktig vertsnavn. Vurder hvert funn; høy poengsum er ikke full sikkerhets- eller personverngodkjenning. Kontroller cache og at nye publiseringer faktisk blir synlige.
6. Oppdater personvernsiden og driftsdokumentasjonen til faktisk trafikkvei og behandling før den nye løsningen tas i ordinær bruk. Lars vurderer dokumentasjonen og godkjenner eventuell innføring.

Arbeidsgrunnlag fra samtalen, lest 31.10.2026: [pris](https://bunny.net/pricing/cdn/), [Edge Rules](https://docs.bunny.net/docs/edge-rules-variable-expansion), [logger og IP-anonymisering](https://bunny.net/faq/), [personvern](https://bunny.net/privacy/) og [GDPR-oversikt](https://bunny.net/gdpr/). Disse avklarer ikke alle punktene over. Cloudflare og bytte av hosting er alternativer hvis bunny ikke oppfyller kravene. Svar fra Domene.no om mulig løsning innenfor eksisterende abonnement avventes også.

### Andre åpne spor

- Deling på alle sider og svar: planforslag #112 er åpent, ingen ny svarlenke eller deleknapp levert i denne runden. Kravene i den PR-en gjentas ikke i en ny kø.
- Faktagrunnmur: forsknings-PR #114 er åpen. Ikke integrert i produksjonskoden. Denne oppdateringen har ikke kjørt forsøks- eller scope-testene på nytt.
- Overvåking av økonomikilder og statsbudsjett: Lars har etterspurt endringsvarsling. Implementerings- og driftsstatus er ikke verifisert i denne gjennomgangen. Ikke regn dette som aktiv varsling, og ikke bland budsjettforslag med vedtatte regler.
- Valgomat, lånekalkulator, fagord i teksten og andre nye funksjoner venter på egen åpning etter prosjektpausen. Punkt 4 og 5 er fortsatt historiske skisser, ikke dagens feilliste eller fullmakt til implementering.

## 2. Fase 1: ferdig

Kriteriene er oppfylt: uavhengige kontrollberegninger, grensetilfeller, validering, lenker og lagrede planer er testet, og testene er grønne.

## 3. Fase 2: avsluttes som kvalitetssikring

Funn i denne runden rettes bare hvis de faller inn under begrunnelsene i punkt 0.

Kontrollert automatisk (Chromium, og hovedflyten også i Firefox og WebKit):
- Svaret vises straks etter startguiden, med «Før skatt» og forutsetningene. «Se graf» kommer før forklaringen.
- Navigasjon resultat, graf og felt. Feil i felt holder fokus i feltet.
- Kontrast, trykkflater, navn, reflow ved 320 og 640 px, synlig fokus, tastatur, tre temaer.
- Eksport har samme tall som grafen.

Historiske kontroller fant ingen avvik innenfor sitt omfang. Senere feil og rettinger står i punkt 1 og 10. Dette er ikke en full WCAG-godkjenning.

Gjenstående manuelle kontroller. Punktene under har ikke fått en dokumentert fullføring i denne oppdateringen (Lars, iPhone Safari):
1. Skjermtastaturet dekker ikke feltet du skriver i.
2. Minus i «Antatt årlig vekst».
3. Tilbake fra «Spør om sparing» med Safaris tilbakeknapp beholder planen.
4. «Før skatt» og forbeholdene er lesbare uten zoom.
5. VoiceOver leser sluttbeløp og «Før skatt».

Fase 2 avsluttes først når status for kontrollpunktene er dokumentert. Utestet skjermleserbruk står som åpen kontroll og skal ikke omtales som godkjent. Kontrollert innholdspåfyll kan foregå mens dette følges opp, forutsatt at kjente alvorlige brukshindringer rettes først. Det skal stå ærlig hvor forståelsen ikke er systematisk testet med brukere.

Hvis det senere blir brukertesting, gjenbrukes denne planen. Brukerpanel er fortsatt ikke et krav (punkt 8). La testbrukeren forklare med egne ord, uten at ønsket svar er forklart først:

- Hva betyr resultatet eller hovedpoenget?
- Hvilke forutsetninger og usikkerheter er viktige?
- Sier siden noe om hva du bør gjøre? Hvis ja, hva?

Registrer konkrete misforståelser og hvor de oppstår. Hold faktisk brukertesting atskilt fra redaksjonell egenkontroll og tekniske tester. Egenkontroll er ikke en brukertest.

## 4. Historisk dekningsoversikt, må kontrolleres før bruk

Hva som finnes nå: sju temaer i veilederen (boliglån eller sparing, studielån, sparing til barn, buffer og dyr gjeld, sparekonto eller fond, pensjon, BSU) og tre egne svar (Hva er BSU?, IPS eller ASK?, ASK eller fondskonto?). Kalkulatoren dekker sparing, sparemål og uttak.

Veilederen får fra kalkulatoren: alder (hvis oppgitt), sparetid og risikovalg. Den får ikke spareform, startbeløp eller månedsbeløp.

Søketest 24.10 (`findTopics`, 20 vanlige spørsmål): 8 riktige treff, 1 misvisende, 11 uten treff. Se tabellen.

### Etter livssituasjon

Type: **T** = trenger tekst, **B** = trenger beregning, **G** = kan gjenbruke det som finnes.

| Situasjon | Typiske spørsmål | Dekning nå | Mangler | Type | Fase |
| --- | --- | --- | --- | --- | --- |
| Flytte hjemmefra | Hva må jeg ha i buffer? Hva koster det å bo? | Buffer (tema) | Månedsbudsjett, depositum, faste utgifter. Søket finner ikke «flytte hjemmefra» | T, G | 3 søk, 4 tekst |
| Første lønn | Hva gjør jeg først: buffer, BSU, fond? | Spredt i buffer, BSU og fond | Én samlet rekkefølge. Ingen treff i søket | T, G | 4 |
| Studier | Ta opp studielån? Betale ned? | Studielån (tema), stipend nevnt | God nok for første versjon | G | |
| Boligkjøp | Egenkapital, kjøpskostnader, annuitet eller serie | BSU, boliglån eller sparing. Egenkapital nevnt i sparemål | Egenkapitalkrav, dokumentavgift, annuitet mot serie. Søket finner ikke «betale ned lån eller spare» selv om temaet finnes | T, B | 3 søk, 4 tekst, 5 beregning |
| Samlivsbrudd | Hva skjer med sparingen? | Nevnt i to setninger (barn) | Hele temaet. Søket gir i dag fondsvaret, som ikke svarer på spørsmålet | T | 3 (ærlig søk), 4 (tekst, med juridiske forbehold) |
| Trang eller varierende økonomi | Får ikke betalt regningene | Buffer og dyr gjeld, henvisning til Nav | God nok for første versjon | G | |
| Familie og barn | Spare i mitt eller barnets navn? | Sparing til barn (tema) | God nok for første versjon | G | |
| Arv og større engangsbeløp | Hva gjør jeg med 500 000 kr? | Kalkulatoren tar startbeløp | Tekst om rekkefølge (gjeld, buffer, tidshorisont). Ingen treff i søket | T, G | 4 |
| Pensjon | Når kan jeg ta ut? IPS eller ASK? | Pensjon (tema), IPS eller ASK, uttak i kalkulatoren | Folketrygd og tjenestepensjon (henvise til Nav og norskpensjon.no) | T | 4 |

### Grunnbegreper (kjernen i «fra tall til forståelse»)

| Spørsmål | Dekning nå | Mangler | Type |
| --- | --- | --- | --- |
| Hva er renters rente? | Vises i kalkulatoren | Ingen treff i søket, ingen kort forklaring | T, G |
| Hvorfor taper penger på konto verdi? | «Dette betyr tallene dine» og kjøpekraftvisningen | Ingen treff i søket | G |
| Hvorfor betyr lite gebyr mye? | Kostnadseffekten i kalkulatoren | Ingen kort forklaring med lenke til egne tall | T, G |
| Skatt på konto og fond | Forbehold i resultatet, skattenotat | Kort forklaring | T |
| Formuesskatt | Ingenting | Kort forklaring med innslagspunkt og kilde | T |

## 5. Opprinnelig leveranseskisse for fase 3 (historikk)

**Ærlig søk og grunnbegreper som svar.** Den minste sammenhengende forbedringen: brukeren får enten et riktig svar, eller beskjed om at spørsmålet ikke er dekket ennå.

1. **Søketestsett.** 30 realistiske spørsmål, hvert med forventet tema eller «ikke dekket». Låses i en test. Dagens resultat er utgangspunktet.
2. **Søkeord for temaene som finnes.** For eksempel «betale ned lån» til boliglån eller sparing, «flytte hjemmefra» til buffer.
3. **Ærlig bom.** Når et spørsmål nevner noe som ikke er dekket (samlivsbrudd, arv, formuesskatt), sier siden det tydelig, i stedet for å vise et svar som bare treffer et ord.
4. **Ny svarform «Forklaring».** Kort svar, konkret eksempel, lenke til et ferdig eksempel i kalkulatoren (dagens delingslenker, ingen endring i kalkulatoren). Krever ikke to alternativer med fordeler og ulemper. Første tre: renters rente, kjøpekraft, kostnader. Gjenbruker tekst som finnes.

Ikke med i første leveranse: spareform fra kalkulatoren til veilederen, nye temaer, lagring av spørsmål, analyseverktøy.

Ferdig når: søketestsettet består, ingen spørsmål i settet gir et misvisende svar, de tre forklaringene har kilde og kontrolldato, og kravene i `research/universell-utforming.md` er kontrollert for det som er nytt.

## 6. Kontrollert innholdspåfyll

Den opprinnelige planen om åpning ved sammenslåing er overstyrt av prosjektpausen. Bare nøytrale begrepsforklaringer og øvrige vedtatte unntak kan bestilles nå, etter docs/regulatorisk.md. Normalt ett til to spørsmål per PR, valgt fra køen etter kontroll av dagens dekning. Allerede eksisterende ASK- og fondskontosvar skal vurderes før det skrives nye svar med samme tema. Ingen masseimport.

Hvert nytt eller endret svar krever:

- Avgrenset spørsmål og riktig svarform: forklaring eller sammenligning.
- Primærkilder med faktisk lesedato, regelår, ikrafttredelse når relevant, vesentlige unntak og dato for neste kontroll.
- Kort svar med nødvendige forbehold, eksempel med oppgitte forutsetninger, angrepsflater og korrektur etter språkreglene.
- Kobling til faste kø-ID-er og eksisterende grunnbegreper. Overlapp bevares som søkeinnganger.
- Søketester for brukerens spørsmål, alternative formuleringer, særskriving, skrivefeil og nærliggende spørsmål som svaret ikke dekker. Test eksisterende treff når søkeord endres.
- Relevante eksisterende Node- og nettlesertester, mobilvisning, tastatur og tilgjengelighetskontroll for det som endres. Ikke testet merkes konkret.
- Oppdatert kø og arbeidslogg med PR, kildekontroll og faktisk publiseringsstatus.

Den generelle daglige researchoppgaven er stanset under prosjektpausen. Særskilt bestilt research lager bare utkast i dokumentasjons-PR. Integrasjon i svarbasen er et eget avgrenset oppdrag. En kontrollert status gir ikke automatisk sammenslåing eller publisering; fullmakten oppgis i det enkelte oppdraget. Main-push utløser dagens test- og publiseringsflyt, også ved dokumentasjonsendringer.

Kontroller både at kildelenken virker og at svaret fortsatt følger kilden. Lovendringer, budsjettvedtak og ikrafttredelser prioriteres foran ordinært påfyll. Forslag og kommende regler skilles fra gjeldende regler. Brutte kilder eller usikre påstander får en konkret oppfølgingsoppgave; ikke erstatt bare URL uten å lese svaret på nytt.

## 7. Fase 5: lånekalkulator, parkert under prosjektpausen

Ingen implementeringsfullmakt. Opprinnelig skisse for versjon 1: annuitet, serielån, restgjeld, renteendring og ekstra innbetaling. Refinansiering og «lån eller fond?» venter.

## 8. Beslutninger tatt 24.10

- Brukerpanel er ikke et krav. Fase 2 kan avsluttes etter tekniske og manuelle kontroller, med ærlig forbehold om forståelse.
- Ingen egen bank-fond-prototype nå.
- «10 til 12 svar» var en første leveranse, ikke et tak. Målet er bred dekning.
- Sparekalkulatoren er fryst (punkt 0).

## 9. Parkert

Ideer uten plass i planen. Et punkt flyttes inn bare ved en egen beslutning.

| Idé | Kilde |
| --- | --- |
| Historiske eksempler med SSB-data (rente og prisvekst) | Historikknotat 23.10 |
| Visning etter skatt i kalkulatoren (Utforsk og Avansert) | Skattenotat 23.10 |
| Kompakt resultat nær feltene på mobil, egen handlingsmeny på pc | Del B 23.10 |
| Spareform fra kalkulatoren til veilederen | Dekningsoversikten 24.10 |
| Standard prisvekst 2,0 % i stedet for 2,5 % | Spareformbeslutning 23.10. Kan bli en kildeoppdatering hvis Lars vil |
| Gjøre `polish-browser.cjs` robust mot tidsfeil | Status 24.10. Testendring, ikke kalkulatorendring |

Valgomaten er parkert etter Lars sin beslutning 24. oktober 2026. Den vurderes separat etter at arbeidsgrunnlaget er samlet og kontrollert innholdspåfyll har en fungerende arbeidsflyt. Målet om et nedlastbart hverdagsbudsjett beholdes som framtidig krav, ikke som vedtatt implementeringsplan.

## 10. Åpne feil og kontrollpunkter

| Feil | Status og hva som avgjør |
| --- | --- |
| **Safari Reader viser eksempeltallene, ikke brukerens plan.** Etter at lesemodus lukkes, er planen av og til nullstilt til eksempelplanen. Safaris KI-oppsummering gjentar eksempeltallene som om de var brukerens. | Funnet av Lars på iPhone 29.10.2026, både på spareverksted.no og på rettegrenen for #106. Gjelder ikke lesemodus i Chrome. Trolig laster Safari siden på nytt, og planen ligger bare i minnet. Mulig løsning: husk planen i fanen (`sessionStorage`) hele tiden. Det er en personvernavgjørelse og venter på Nkoms svar om fanelagring (se docs/personvern-lagring.md). Lars 29.10.2026: ingen tiltak nå, siden siden ikke er delt eller søkbar ennå. Opplysning på tilgjengelighetssiden vurderes hvis svaret drøyer. |
| **WAVE: 10 varsler om visuelt skjult innhold.** | Lars opplyser at alle ti viser meldingen om visuelt skjult element. Skjermbildene viser 1 redundant lenke, 2 PDF-lenker, 1 noscript-element og 6 små tekster. Ikke ti bekreftede feil i synlig innhold. Identifiser hvert element og prøv det i relevant visning, også eventuell skjermlesertilgang. Ingen blind fjerning av innhold eller justering bare for å få null varsler. |
| **Grafens linjeforklaring oppleves som navn uten verdier ved opplesning.** | Punktavlesningen gir tall, mens chartLegend er navn på linjene. Lesemåte/skjermleser er ikke oppgitt. Gjenskap med konkret verktøy og undersøk leserekkefølge, punktverdier, beskrivelse og tabell før endring. Ikke skjul linjeforklaringen uten å bekrefte brukerproblemet. |
| **Faktisk zoom etter menyrettingen.** | Lars' første prøve fant meny- og temaproblemer. #127 er publisert og automatiske tester består. Gjenta manuell prøve av kalkulator, Spør om sparing og infosider ved 400/500 %, med tilgjengelig meny og eksisterende «Ny beregning». Ikke regn tidligere prøve før rettingen som etterkontroll. |
