# Plan for Spareverksted

Én levende plan. Oppdateres her i stedet for nye planfiler. Samlet 24. oktober 2026 med main `968fa37` som kodegrunnlag. Eldre målinger nedenfor er historikk, ikke nye testresultater.

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

## 1. Gjeldende rekkefølge og status

1. Samle arbeidsregler, beslutninger, faseplan og spørsmålkø på main. Denne dokumentasjonsleveransen gjør dette.
2. Deretter åpnes kontrollert innholdspåfyll etter punkt 6. Nattoppgaven fortsetter som upublisert research.
3. Valgomaten venter. Ingen implementering eller ny brukerflyt inngår i innholdspåfyllet.

Kodegrunnlag ved sammenstillingen: main `968fa37`, med ASK- og fondskontoforklaringer fra #61. Søket har også fått egne moduler og tester. Historiske kartlegginger i punkt 4 og den opprinnelige leveranseskissen i punkt 5 beskriver en eldre versjon og skal ikke brukes som dagens feilliste eller åpne oppgaver uten ny kontroll.

Lars melder at iPhone-visningen fungerer godt og at andre testere liker siden. Dette er nyttige brukerinnspill, men dokumenterer ikke VoiceOver, NVDA eller alle manuelle kontrollpunkter. Skjermlesertesting står åpen. Denne dokumentasjonsrunden kjører ingen nye nettleser- eller tilgjengelighetstester og erklærer ikke fase 2 fullført.

## 2. Fase 1: ferdig

Kriteriene er oppfylt: uavhengige kontrollberegninger, grensetilfeller, validering, lenker og lagrede planer er testet, og testene er grønne.

## 3. Fase 2: avsluttes som kvalitetssikring

Funn i denne runden rettes bare hvis de faller inn under begrunnelsene i punkt 0.

Kontrollert automatisk (Chromium, og hovedflyten også i Firefox og WebKit):
- Svaret vises straks etter startguiden, med «Før skatt» og forutsetningene. «Se graf» kommer før forklaringen.
- Navigasjon resultat, graf og felt. Feil i felt holder fokus i feltet.
- Kontrast, trykkflater, navn, reflow ved 320 og 640 px, synlig fokus, tastatur, tre temaer.
- Eksport har samme tall som grafen.

Ingen avvik funnet i de gjennomførte kontrollene. Det er ikke en full WCAG-godkjenning.

Gjenstår, bare det som ikke kan gjøres herfra (Lars, iPhone Safari, rundt 10 minutter):
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

Åpnes når denne samlingen er på main. Normalt ett til to spørsmål per PR, valgt fra køen etter kontroll av dagens dekning. Allerede eksisterende ASK- og fondskontosvar skal vurderes før det skrives nye svar med samme tema. Ingen masseimport.

Hvert nytt eller endret svar krever:

- Avgrenset spørsmål og riktig svarform: forklaring eller sammenligning.
- Primærkilder med faktisk lesedato, regelår, ikrafttredelse når relevant, vesentlige unntak og dato for neste kontroll.
- Kort svar med nødvendige forbehold, eksempel med oppgitte forutsetninger, angrepsflater og korrektur etter språkreglene.
- Kobling til faste kø-ID-er og eksisterende grunnbegreper. Overlapp bevares som søkeinnganger.
- Søketester for brukerens spørsmål, alternative formuleringer, særskriving, skrivefeil og nærliggende spørsmål som svaret ikke dekker. Test eksisterende treff når søkeord endres.
- Relevante eksisterende Node- og nettlesertester, mobilvisning, tastatur og tilgjengelighetskontroll for det som endres. Ikke testet merkes konkret.
- Oppdatert kø og arbeidslogg med PR, kildekontroll og faktisk publiseringsstatus.

Researchoppgaven lager fortsatt bare utkast i dokumentasjons-PR. Integrasjon i svarbasen er et eget avgrenset oppdrag. En kontrollert status gir ikke automatisk sammenslåing eller publisering; fullmakten oppgis i det enkelte oppdraget. Main-push utløser dagens test- og publiseringsflyt, også ved dokumentasjonsendringer.

Kontroller både at kildelenken virker og at svaret fortsatt følger kilden. Lovendringer, budsjettvedtak og ikrafttredelser prioriteres foran ordinært påfyll. Forslag og kommende regler skilles fra gjeldende regler. Brutte kilder eller usikre påstander får en konkret oppfølgingsoppgave; ikke erstatt bare URL uten å lese svaret på nytt.

## 7. Fase 5: lånekalkulator, eget arbeid

Versjon 1: annuitet, serielån, restgjeld, renteendring og ekstra innbetaling. Refinansiering og «lån eller fond?» venter.

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

## 10. Kjente feil som venter

| Feil | Status og hva som avgjør |
| --- | --- |
| **Safari Reader viser eksempeltallene, ikke brukerens plan.** Etter at lesemodus lukkes, er planen av og til nullstilt til eksempelplanen. Safaris KI-oppsummering gjentar eksempeltallene som om de var brukerens. | Funnet av Lars på iPhone 29.10.2026, både på spareverksted.no og på rettegrenen for #106. Gjelder ikke lesemodus i Chrome. Trolig laster Safari siden på nytt, og planen ligger bare i minnet. Mulig løsning: husk planen i fanen (`sessionStorage`) hele tiden. Det er en personvernavgjørelse og venter på Nkoms svar om fanelagring (se docs/personvern-lagring.md). Lars 29.10.2026: ingen tiltak nå, siden siden ikke er delt eller søkbar ennå. Opplysning på tilgjengelighetssiden vurderes hvis svaret drøyer. |
