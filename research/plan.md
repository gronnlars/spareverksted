# Plan for Spareverksted

Én levende plan. Oppdateres her i stedet for nye planfiler. Sist kontrollert 24. oktober 2026 mot `main` `a5777f6`.

Redaksjonell arbeidsliste for enkeltspørsmål ligger i `research/sporsmal-og-prioritering.md`. Denne filen sier hva som skal gjøres og i hvilken rekkefølge.

## 1. Status

| Punkt | Funn | Hvordan |
| --- | --- | --- |
| main | `a5777f6`. Ingen åpne PR-er | GitHub API |
| CI på `a5777f6` | `checks`, `browser` og `deploy` grønne. `browser` kjører `polish-browser.cjs` i Chromium, Firefox og WebKit | GitHub API og workflow-fila |
| Tester lokalt | 11 Node-filer og 10 nettlesertester grønne i Chromium | Kjørt 24.10 |
| Tidligere feil i `polish-browser.cjs` | Feilet 1 av 12 kjøringer 24.10 natt. Ikke gjenskapt i 28 nye kjøringer, 16 av dem fire i parallell. Feilmeldingen ble ikke tatt vare på. Mest sannsynlige kilde er kontrollen av at varselet er skjult rett etter et klikk (`isHidden` venter ikke). Ingen endring gjort | Kjørt 24.10 |
| Publisert side | Ikke hentet. Blokkert fra arbeidsmiljøet. Grønn `deploy` er ikke det samme som kontrollert side | |

## 2. Fase 1: ferdig

Kriteriene er oppfylt: uavhengige kontrollberegninger, grensetilfeller, validering, lenker og lagrede planer er testet, og testene er grønne.

## 3. Fase 2: kan avsluttes etter én kort manuell runde

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

Når disse er OK: fase 2 avsluttes. Det skal stå ærlig at forståelsen ikke er systematisk testet med brukere. Brukertest er ikke et krav.

## 4. Dekningsoversikt

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

## 5. Fase 3: første leveranse (forslag, ikke startet)

**Ærlig søk og grunnbegreper som svar.** Den minste sammenhengende forbedringen: brukeren får enten et riktig svar, eller beskjed om at spørsmålet ikke er dekket ennå.

1. **Søketestsett.** 30 realistiske spørsmål, hvert med forventet tema eller «ikke dekket». Låses i en test. Dagens resultat er utgangspunktet.
2. **Søkeord for temaene som finnes.** For eksempel «betale ned lån» til boliglån eller sparing, «flytte hjemmefra» til buffer.
3. **Ærlig bom.** Når et spørsmål nevner noe som ikke er dekket (samlivsbrudd, arv, formuesskatt), sier siden det tydelig, i stedet for å vise et svar som bare treffer et ord.
4. **Ny svarform «Forklaring».** Kort svar, konkret eksempel, lenke til egne tall i kalkulatoren. Krever ikke to alternativer med fordeler og ulemper. Første tre: renters rente, kjøpekraft, kostnader. Gjenbruker tekst som finnes.

Ikke med i første leveranse: spareform fra kalkulatoren til veilederen, nye temaer, lagring av spørsmål, analyseverktøy.

Ferdig når: søketestsettet består, ingen spørsmål i settet gir et misvisende svar, og de tre forklaringene har kilde og kontrolldato.

## 6. Fase 4: bred dekning, én del av kartet om gangen

Fyll kartet over i rekkefølge etter nytte: boligkjøp, første lønn og flytte hjemmefra, arv og engangsbeløp, skatt (formuesskatt, renter, fond), pensjon, samlivsbrudd. Hvert svar trenger primærkilde, kontrolldato og en dato for neste kontroll. Gjeldende regler skilles fra forslag og framtidige satser.

## 7. Fase 5: lånekalkulator, eget arbeid

Versjon 1: annuitet, serielån, restgjeld, renteendring og ekstra innbetaling. Refinansiering og «lån eller fond?» venter.

## 8. Beslutninger tatt 24.10

- Brukerpanel er ikke et krav. Fase 2 kan avsluttes etter tekniske og manuelle kontroller, med ærlig forbehold om forståelse.
- Ingen egen bank-fond-prototype nå.
- «10 til 12 svar» var en første leveranse, ikke et tak. Målet er bred dekning.
