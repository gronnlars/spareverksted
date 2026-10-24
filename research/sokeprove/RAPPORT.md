# Søkeforsøk: dagens søk, #54 og et bibliotek (MiniSearch)

Utkast til gjennomgang. Ingenting her er slått sammen, publisert eller koblet til nettsiden. Kalkulatoren og beregningsmotoren er ikke rørt. Søket i produksjon er ikke byttet.

## Kort svar

1. **Ikke bytt til MiniSearch nå.** På holdout (45 tilfeller, kjørt én gang etter at kandidaten var låst) ga #54 riktig førstevalg i 33 tilfeller og kandidaten i 30. Feil direkte svar: 1 mot 2. Rå MiniSearch uten eget lag ga 7 feil direkte svar. Biblioteket løser ikke de vanskelige delene (hva som er et svar, hva som er «Mente du», hva som er valg). Det gjør det eget lag.
2. **Behold #54-tilnærmingen, men rett det forsøket avdekket.** Det er reelle feil i #54 som ikke var synlige i de variantene vi har prøvd: skrivefeil som inneholder et kjent ordstamme-treff (`aksjesparekonot`, `fondskotno`, `fondkonto`) leses som kjente ord og havner på «Sparekonto eller fond». Og #54 bygger ordlisten på nytt ved hvert søk: 2 ms ved 13 dokumenter, 55 ms ved 130 og 780 ms ved 1300 syntetiske dokumenter.
3. **Ta i bruk registeret (begrepsrelasjoner) uansett motor.** Likeverdige navn, produktnavn og beslektede begreper som egne, validerte relasjoner er en klar forbedring av vedlikeholdet. Prototypen med validering og indeksbygger er laget og testet (16 tester).
4. **Det finnes parallelt søkearbeid jeg ikke har vurdert:** PR #52 (`veileder-sok.js`, åpnet i dag, ikke utkast) og #45 (integrasjon). #52 skriver selv at #47 blir overflødig. Før noe av dette velges, må noen avgjøre hvilken søkelinje som skal fortsette. Se punkt 7.

Alt nedenfor er min egen gjennomgang og automatiske kontroller. Ingen brukere har testet noe. Jeg påstår ikke at alt fungerer.

Grunnlag: grenen `research/sokeprove-forsok` bygger på `research/integrasjon-47-53-54` (main + #54 + #47 + #53 + en testrettelse). Alle motorer kjører på nøyaktig samme 13 dokumenter. «Dagens» er søkefunksjonen fra main kjørt på dette innholdet (på ekte main uten #47 og #53 mangler også innholdet for ASK og fondskonto).

## 1. Dagens situasjon og bekreftet årsak til «boligflån» og «bolig lån»

Dagens søk (main, `dist/veileder-engine.js`):
- linje 28 til 34, `findTopics`: først eksakt treff på et ferdig spørsmål (linje 32), ellers en poengsum der hvert tema har en liste regulære uttrykk (`words`) som testes mot hele søketeksten (linje 34, `re.test(q)`).
- linje 20: temaet «Boliglån eller sparing» har `/boligl[aå]n/` som ett av uttrykkene.
- `dist/veileder-ui.js` linje 92 kaller `V.findTopics(tekst)`. Første id vises som svar, resten som «Andre temaer».

Årsak, bekreftet ved kjøring (d40, d50, d60, d61 i utviklingssettet):
- «boliglån» treffer, fordi teksten inneholder `boliglån`.
- «boligflån» treffer ikke, fordi teksten ikke inneholder `boligl`. Uttrykket tåler ingen skrivefeil.
- «bolig lån» treffer ikke, fordi uttrykket krever `boligl` uten mellomrom. Uttrykket tåler ingen særskriving.
- Innholdet finnes altså (temaet «Boliglån eller sparing»), men søket finner det bare når ordet er skrevet nøyaktig. ASK og Zero fungerte fordi uttrykkene deres er korte stammer (`\bask\b`, `\bzero\b`) som er vanskelige å skrive feil, ikke fordi søket tåler feil.

I tillegg har #54 (linje 62 til 89 i `dist/veileder-engine.js`, `interpret`) en svakhet som dette forsøket avdekket: `known=w=>triggers(w)` (linje 68) tester ordet mot regexene, og regexene treffer midt i ord. `aksjesparekonot` inneholder `aksj` og regnes derfor som kjent, ingen retting forsøkes, og søket ender på funds. Samme for `fondskotno` og `fondkonto`. Det er reproduserbart med `node research/sokeprove/kjor.cjs --sett utvikling --motorer pr54 --detaljer` (d63, d64) og holdout (h20).

## 2. Arkitekturskisse

```
Én tekstkilde: veileder-engine.js (temaer) + veileder-knowledge.js (oppføringer, forklaringer)
        +  register/begreper.json (navn, produktnavn, relasjoner)
                    |
          valider-register.cjs   (stopper ved feil, advarer ved svakheter)
                    |
          bygg-indeks.cjs        (avledet indeks med sjekksum, ikke håndskrevet)
                    |
   MiniSearch (BM25, prefiks, uskarpt søk, bokstavavstand)
                    |
   Eget lag (motorer/minisearch.cjs, ca. 190 linjer):
     stoppord, sammensetning av naboord (maks tre ledd, bare når resultatet er et kjent ord),
     stammer fra registerets navn, ombytting av to bokstaver,
     hensikt (sammenligning, definisjon), negasjon, begrepsregister,
     klassifisering uten å tolke rå poengsum som sikkerhet
                    |
   { direct | corrected | dym («Mente du») | choices (flere temaer) | none (mangler) }
                    |
   samme kontrakt som UI-et bruker i dag: ett førstevalg + øvrige forslag
```

Hva det egne laget bidrar med er målt ved å slå av én del om gangen (ablasjon, `resultater/utvikling.md` og `resultater/holdout.md`). Tallene er riktige førstevalg inkludert akseptable. Hele kandidaten: 60 av 81 på utviklingssettet og 30 av 45 på holdout.

| Slått av | Utvikling | Holdout |
|---|---:|---:|
| sammensetning av naboord | 55 | 26 |
| ombytting av to bokstaver | 56 | 29 |
| uskarpt søk | 56 | 25 |
| begrepsregister | 55 | 24 |
| hensikt (sammenligning, definisjon) | 58 | 27 |
| negasjon | 61 | 30 |
| stammeregel | 60 | 32 |

Fem deler hjelper tydelig (sammensetning, ombytting, uskarpt søk, register, hensikt). Stammeregelen skader på holdout (32 uten, mot 30 med: den forklarer «boligløn» til BSU). Negasjonsregelen gir ingen målbar gevinst på førstevalg. Den finnes for at forklaringen av det brukeren avviser ikke skal vises som svar, og det er et valg jeg ber om en avgjørelse på (punkt 7).

## 3. Sammenligningstabell (utvalg)

Hele tabellene med alle 126 tilfeller og alle ablasjoner ligger i `resultater/utvikling.md` og `resultater/holdout.md`. «Riktig» betyr at førstevalget er det jeg skrev som forventet før jeg så noe svar. Forventningene er håndskrevne i `testsett/*.json`.

Tegnforklaring: **riktig** = riktig førstevalg. **FEIL svar** = et annet dokument vises som svar (feil direkte svar). **ingen treff** = ingenting, selv om innholdet finnes. **bare forslag** = riktig dokument finnes bare blant forslag eller «Mente du», uten å vises som svar. **riktig avvist** = ærlig «har ikke svar». Rader med d er utviklingssett, h er holdout.

| id | Søk | Forventet | Dagens | #54 | MiniSearch rå | Kandidat |
|---|---|---|---|---|---|---|
| d01 | "ASK" | q-aksjesparekonto | riktig: q-aksjesparekonto | riktig: q-aksjesparekonto | riktig: q-aksjesparekonto | riktig: q-aksjesparekonto |
| d03 | "Hva betyr ASK?" | q-aksjesparekonto | riktig: q-aksjesparekonto | riktig: q-aksjesparekonto | riktig: q-aksjesparekonto | riktig: q-aksjesparekonto |
| d10 | "Hva er IKZ?" | q-fondskonto | riktig: q-fondskonto | riktig: q-fondskonto | riktig: q-fondskonto | riktig: q-fondskonto |
| d11 | "Hva er Investeringskonto Zero?" | q-fondskonto | riktig: q-fondskonto | riktig: q-fondskonto | riktig: q-fondskonto | riktig: q-fondskonto |
| d12 | "Investeringskonto Zero" | q-fondskonto | riktig: q-fondskonto | riktig: q-fondskonto | riktig: q-fondskonto | riktig: q-fondskonto |
| d20 | "ASK eller fondskonto?" | q-ask-zero | riktig: q-ask-zero | riktig: q-ask-zero | riktig: q-ask-zero | riktig: q-ask-zero |
| d21 | "ASK eller Zero?" | q-ask-zero | riktig: q-ask-zero | riktig: q-ask-zero | riktig: q-ask-zero | riktig: q-ask-zero |
| d22 | "Hva er forskjellen på ASK og fondskonto?" | q-ask-zero | riktig: q-ask-zero | riktig: q-ask-zero | riktig: q-ask-zero | riktig: q-ask-zero |
| d30 | "fondskonto" | q-fondskonto | riktig: q-fondskonto | riktig: q-fondskonto | riktig: q-fondskonto | riktig: q-fondskonto |
| d31 | "fond" | funds | riktig: funds | riktig: funds | riktig: funds | riktig: funds |
| d40 | "boliglån" | mortgage | riktig: mortgage | riktig: mortgage | riktig: mortgage | riktig: mortgage |
| d50 | "bolig lån" | mortgage | ingen treff | riktig: mortgage | FEIL svar: bsu | riktig: mortgage |
| d51 | "hva er bolig lån" | mortgage | ingen treff | riktig: mortgage | FEIL svar: bsu | riktig: mortgage |
| d52 | "gjeld rådgivning" | skjønn: buffer | forslag mangler | forslag mangler | forslag dekker: buffer | forslag dekker |
| d57 | "aksje spare konto" | q-aksjesparekonto | FEIL svar: funds | FEIL svar: funds | FEIL svar: funds | bare forslag |
| d60 | "boligflån" | mortgage | ingen treff | riktig: mortgage | riktig: mortgage | riktig: mortgage |
| d61 | "bloiglån" | mortgage | ingen treff | riktig: mortgage | riktig: mortgage | riktig: mortgage |
| d62 | "inlfasjon" | q-kjopekraft | ingen treff | riktig: q-kjopekraft | riktig: q-kjopekraft | riktig: q-kjopekraft |
| d63 | "aksjesparekonot" | q-aksjesparekonto | FEIL svar: funds | FEIL svar: funds | riktig: q-aksjesparekonto | riktig: q-aksjesparekonto |
| d64 | "fondskotno" | q-fondskonto | FEIL svar: funds | FEIL svar: funds | riktig: q-fondskonto | riktig: q-fondskonto |
| d74 | "BSUU" | q-bsu-basics | riktig (akseptabelt): bsu | riktig (akseptabelt): bsu | riktig: q-bsu-basics | ingen treff |
| d76 | "AS" | ingen svar | riktig avvist | riktig avvist | FEIL svar: q-aksjesparekonto | riktig avvist |
| d77 | "tips" | ingen svar | riktig avvist | riktig avvist | FEIL svar: q-ips-ask | riktig avvist |
| d80 | "bilreparasjon" | ingen svar | riktig avvist | riktig avvist | riktig avvist | riktig avvist |
| d85 | "formuesskatt" | ingen svar | riktig avvist | riktig avvist | riktig avvist | riktig avvist |
| d90 | "" | ingen svar | riktig avvist | riktig avvist | riktig avvist | riktig avvist |
| d93 | "boliglån (gjentatt 80 ganger)" | mortgage | riktig: mortgage | riktig: mortgage | riktig: mortgage | riktig: mortgage |
| d100 | "ASK, men ikke fondskonto" | q-ask-zero | riktig: q-ask-zero | riktig: q-ask-zero | FEIL svar: q-fondskonto | riktig (akseptabelt): q-aksjesparekonto |
| d101 | "Jeg vil ikke ha fond" | funds | riktig: funds | riktig: funds | riktig: funds | bare forslag |
| d103 | "lån" | skjønn: mortgage, student, buffer | forslag mangler | forslag mangler | forslag mangler: student | forslag dekker |
| h07 | "ASK vs IKZ" | q-ask-zero | riktig: q-ask-zero | riktig: q-ask-zero | FEIL svar: q-aksjesparekonto | riktig: q-ask-zero |
| h12 | "bolig lånet" | mortgage | ingen treff | riktig: mortgage | FEIL svar: bsu | bare forslag |
| h15 | "boligløn" | mortgage | ingen treff | riktig: mortgage | riktig: mortgage | FEIL svar: bsu |
| h20 | "fondkonto" | q-fondskonto | FEIL svar: funds | FEIL svar: funds | riktig: q-fondskonto | riktig: q-fondskonto |
| h21 | "akjsesparekonto" | q-aksjesparekonto | ingen treff | riktig: q-aksjesparekonto | riktig: q-aksjesparekonto | bare forslag |
| h22 | "pensjonssparing" | pension | riktig: pension | riktig: pension | FEIL svar: q-ips-ask | FEIL svar: q-ips-ask |
| h29 | "BSU eller ASK?" | skjønn: q-bsu-basics, q-aksjesparekonto | forslag dekker: bsu | forslag dekker: bsu | FEIL svar: q-ips-ask | forslag dekker |
| h37 | "hva koster en reise til Spania" | ingen svar | riktig avvist | riktig avvist | FEIL svar: q-fondskonto | riktig avvist |
| h47 | "gjeldsrådgivning" | skjønn: buffer | forslag mangler | forslag mangler | forslag mangler | forslag mangler |

Merknad til tabellen: tabellen er et utvalg for lesbarhet. Den er ikke valgt for å se bra ut. Alle avvik for kandidaten i holdout er med (h12, h15, h21, h22, h29, h47), og de fleste avvik for #54 og dagens søk også.

## 4. Resultater, delt på de fire utfallene

Utfallene er telt hver for seg, slik at «riktig førstevalg» ikke blandes med «bare forslag» eller «feil svar». Tilfeller der skjønn avgjør («lån», «bolig», «gjeldsrådgivning») er ikke gitt bestått eller ikke bestått. De telles som «forslag dekker det forventede» eller ikke.

**Utviklingssett, 81 tilfeller** (kandidaten er stilt inn mot dette, så tallene hennes er optimistiske):

| Utfall | Dagens | #54 | MiniSearch rå | Kandidat |
|---|---:|---:|---:|---:|
| Riktig førstevalg (inkl. akseptabelt) | 49 | 59 | 59 | 60 |
| Riktig dokument bare som forslag eller «Mente du» | 0 | 0 | 0 | 2 |
| Ingen treff, selv om innholdet finnes | 10 | 0 | 0 | 1 |
| Feil direkte svar | 4 | 4 | 9 | 0 |
| Riktig avvisning (innhold finnes ikke) av 12 | 12 | 12 | 7 | 12 |
| Skjønnstilfeller der forslagene dekker det forventede, av 6 | 1 | 1 | 3 | 6 |

**Holdout, 45 tilfeller** (kjørt én gang etter låsing, `resultater/holdout.md`):

| Utfall | Dagens | #54 | MiniSearch rå | Kandidat |
|---|---:|---:|---:|---:|
| Riktig førstevalg (inkl. akseptabelt) | 22 | 33 | 29 | 30 |
| Riktig dokument bare som forslag eller «Mente du» | 0 | 0 | 0 | 2 |
| Ingen treff, selv om innholdet finnes | 11 | 0 | 0 | 0 |
| Feil direkte svar | 1 | 1 | 7 | 2 |
| Riktig avvisning av 6 | 6 | 6 | 5 | 6 |
| Skjønnstilfeller der forslagene dekker det forventede, av 5 | 2 | 2 | 2 | 3 |

Tolkning:
- Dagens søk taper mest på «ingen treff» (skrivefeil og særskriving). Det er årsaken til feilen du så.
- #54 retter dette og er best på holdout. Feilene er fem tilfeller der ordet, eller delene av det, inneholder en kjent stamme: tre skrivefeil og to særskrivinger (se 1 og 7).
- Rå MiniSearch finner nesten alt, men svarer også på det den ikke bør: «AS» og «tips» gir ASK og IPS, «hva koster en reise til Spania» gir fondskonto, «bolig lån» gir BSU. Det er den vanlige feilen med BM25 på et lite materiale: ett felles ord gir et «sikkert» treff.
- Kandidaten rydder opp i dette med eget lag, men får egne feil på holdout (se punkt 7).

### Skrivefeiltoleranse, målt systematisk

Biblioteket er undersøkt i kildekoden (`src/SearchableMap/fuzzySearch.ts`, `src/MiniSearch.ts` linje 1745 til 1748, tag v7.2.0) og prøvd:
- Avstanden er vanlig Levenshtein: sletting, innsetting og bytte av én bokstav. Ombytting av to nabobokstaver koster **to**.
- Brøkdelen i `fuzzy` blir til en største avstand slik: `min(6, round(ordlengde × brøk))`. Med 0.2 blir 5 til 7 bokstaver 1 og 8 til 12 bokstaver 2.
- «bloiglån» (foldet «bloiglan», 8 bokstaver) er to bytter fra «boliglan». Bekreftet med det bygde biblioteket: `fuzzy: 1` finner ingenting, `fuzzy: 2` finner temaet «mortgage». Med #54 (Damerau-Levenshtein) er det én endring.

Systematisk måling (`skrivefeil-maaling.cjs`): alle enkeltfeil av fire typer (sletting, ombytting, bytte, innsetting) for de 32 navnene i registeret som har minst fem bokstaver, 1127 varianter per motor. Rett svar betyr at hjemmedokumentet vises som svar. I tillegg 39 ord som ikke finnes i innholdet, for å måle falske treff.

| Motor | Riktig førstevalg | Bare som forslag | Falske svar på ukjente ord |
|---|---:|---:|---:|
| Dagens | 114 (10 %) | 0 | 0 av 39 |
| #54 | 970 (86 %) | 0 | 0 av 39 |
| MiniSearch rå (fuzzy 0.2) | 1071 (95 %) | 1 | 0 av 39 |
| Kandidat | 1072 (95 %) | 47 | 0 av 39 |

Etter feiltype og lengde: ombytting av to bokstaver i ord på 5 til 7 bokstaver gir 0 av 55 for rå MiniSearch, 51 av 55 for #54 og 55 av 55 for kandidaten (som har en egen ombyttingsregel). Kandidatens 47 «bare som forslag» er avstand 2 på lange ord, som den bevisst bare foreslår. Ord på fire bokstaver eller færre rettes verken av #54 eller kandidaten (tiltenkt: «AS» og «tips» skal ikke bli ASK og IPS). Alle tall i `resultater/skrivefeil.md`. Dette er syntetiske feil, ikke ekte skrivefeil fra brukere.

Reservasjon: «falske svar på ukjente ord» er målt på enkeltord. Et søk med flere ord kan oppføre seg annerledes.

### Forstyrrende dokumenter

Fire urelaterte dokumenter ble lagt til i alle motorer (`forstyrr-diff.cjs`): en om bilforsikring, en om «Bolig og lånetyper for ungdom», en der «ask» er et engelsk verb, og en stappet full av «sparing, fond, lån, bolig». Antall av 81 førstevalg som endret seg:

| Dagens | #54 | MiniSearch rå | Kandidat |
|---:|---:|---:|---:|
| 17 | 16 | 4 | 0 |

Det stappede dokumentet tar over «boliglån» hos både dagens søk og #54, fordi poengsummen der er antall regexer som treffer. Kandidaten påvirkes ikke. Forbehold: forstyrrerne har ingen oppføring i registeret, og de svake treffene i spørsmålstekst avvises av en egen regel. Et forstyrrende dokument med eget register og sterke navn kunne gitt flere endringer. Det er ikke testet.

## 5. Størrelse, oppstart og søketid

Metode: `maal.cjs` (Node) og `maal-nettleser.cjs` (Chromium headless via Playwright), kjørt i denne økten. Miljø: Node v22.23.4, Intel Xeon 2,1 GHz med 2 kjerner, Linux 6.18 (skymiljø), headless Chrome 153. MiniSearch 7.2.0 (commit 3d239d1), bygd lokalt med esbuild fordi npm var sperret. Datamengde: 13 dokumenter, 55 spørsmål, 2078 byte tekst. Søketid: 81 utviklingssøk × 20 runder = 1620 søk per motor etter 3 oppvarmingsrunder. Dette er ikke tall fra brukernes enheter, og ikke fra iPhone eller Safari.

Størrelse (byte, minifisert / gzip):

| Del | Byte | gzip |
|---|---:|---:|
| `veileder-engine.js` på main | 17 791 | 6 871 |
| `veileder-engine.js` i #54 | 21 814 | 8 557 |
| MiniSearch 7.2.0 | 18 170 | 6 089 |
| Kandidatlag (minifisert) | 6 794 | 2 853 |
| Register (`begreper.json`) | 3 262 | 878 |
| Avledet indeks (JSON) | 6 535 | 1 639 |
| Samlet pakke for nettleseren (bibliotek, lag, indeks) | 31 366 | 10 402 |

Tillegget for kandidaten er altså ca. 10,4 KB gzip. #54 la til ca. 1,7 KB gzip.

Søketid i Node (ms per søk):

| Motor | Median | 95-prosentil | Maks |
|---|---:|---:|---:|
| Dagens | 0,039 | 0,069 | 0,36 |
| #54 | 1,93 | 3,16 | 26,2 |
| MiniSearch rå | 0,035 | 0,134 | 3,8 |
| Kandidat | 0,028 | 0,097 | 7,4 |

Oppstart:
- Kandidat, bygg indeks (13 dokumenter): median 0,48 ms i Node, 1,6 ms i Chromium (første bygg 7,1 ms inkludert kald JIT).
- Søk i Chromium: median under måleoppløsningen (0), 95-prosentil 0,2 ms, maks 3,8 ms. `performance.now()` har grov oppløsning der.
- #54 har ingen byggetrinn, men bygger ordlisten ved hvert søk (derfor medianen over).
- Kald Node-prosess fra start til første søk: 33 ms for kandidaten og 35 ms for #54. Forskjellen er ikke målbar mot oppstartstiden til Node selv.

Syntetisk skalering (merket syntetisk: dokumentene er laget av tilfeldige ord fra innholdets eget vokabular, med faste frø, ikke ekte innhold):

| Dokumenter | Kandidat: bygg | Kandidat: søk median / 95 % | #54: søk median | Indeksdata (JSON) |
|---:|---:|---:|---:|---:|
| 13 | 0,7 ms | 0,022 / 0,075 ms | 2,0 ms | 6,4 KB |
| 130 | 4,6 ms | 0,084 / 0,28 ms | 55,5 ms | 45 KB |
| 1 300 | 51,6 ms | 1,06 / 4,9 ms | 777 ms | 434 KB |
| 13 000 | 621 ms | 6,9 / 29,6 ms | prøve på 5 søk, 95 % = 7,7 s | 4,3 MB |

#54 skalerer lineært til kvadratisk fordi ordlisten bygges om ved hvert søk. Det er enkelt å rette (bygg én gang ved `register()`), og er en egen, liten endring. Tallene for #54 ved 13 000 er en prøve på bare fem søk og ikke direkte sammenlignbare.

Forslagene fra Gemini (ca. 10 KB, 100 KB og 10 ms) er ikke brukt som utgangspunkt. De målte tallene over er det som gjelder. Ved 13 dokumenter er ingen av dem et problem for noen av motorene.

## 6. Metadata, register og automatisk indeksering

Prototype: `register/begreper.json`, `valider-register.cjs`, `bygg-indeks.cjs`, `test-register.cjs` (16 tester, alle bestått).

Register: ett begrep har ett hjemmedokument. Relasjonene er hver for seg:
- **Likeverdige navn** (`navn`): ASK og aksjesparekonto er samme begrep. Prisvekst, inflasjon og kjøpekraft peker til samme forklaring.
- **Produktnavn** (`produktnavn`): IKZ, Investeringskonto Zero og Zero peker til forklaringen om fondskonto. De er gjenkjenningshjelp, ikke egne begreper.
- **Beslektede begreper** (`beslektet`, med type `sammenlignes-med` eller `relatert`): ASK og fondskonto sammenlignes. Sammenligningsdokumentet står i `sammenligninger`.
- **Samlebegrep** (`type: samlebegrep`): «lån», «bolig», «sparing», «konto» har ikke ett svar. De gir valg, aldri ett svar.

Hva forfatteren fyller ut for et nytt dokument:
1. Selve oppføringen som i dag (id, tittel, spørsmål, innhold). Dette er den eneste autoritative teksten.
2. Ett begrep i registeret: id, type, dokument, likeverdige navn, eventuelle produktnavn, beslektede begreper.
3. Ved sammenligning: en linje i `sammenligninger` og relasjonen på begge sider.

Forfatteren trenger ikke skrive regulære uttrykk, bøyningsformer, sammensetninger eller skrivefeil. Disse er avledet eller testet (se under).

Automatisk (`bygg-indeks.cjs`): leser dokumentene og registeret, validerer, og bygger en avledet indeks med sjekksum. Bygget stopper ved feil. Indeksen sjekkes ikke inn, den er avledet (`.gitignore`).

Validerer i dag: unike id-er, påkrevde felt og typer, at dokumenter og relasjonsmål finnes, kjente relasjonstyper, at samme navn (også med annen skrivemåte, store og små bokstaver, med eller uten æøå) ikke peker til to begreper, at sammenligninger har minst to kjente begreper, at samlebegrep har forslag. Advarsler: dokument uten begrep, manglende symmetri i `sammenlignes-med`.

Vedlikeholdsregler jeg foreslår, men ikke har bygd (ikke del av forsøket):
- **Ingen aliaser for skrivefeil.** Nye skrivefeil som dukker opp i bruk blir testtilfeller i testsettet, ikke navn i registeret. Ellers vokser registeret med støy, og to begreper kan til slutt dele «navn».
- **Fullt regresjonskjør med lesbar endringsoversikt.** `kjor.cjs` og `forstyrr-diff.cjs` viser hvilke førstevalg som endres når et dokument eller et navn legges til. Dette bør kjøres før hver sammenslåing av innhold.
- **Konflikt og tvetydighet:** identiske navn på ulike begreper stoppes (gjort). Navn med felles ord mellom dokumenter bør gi advarsel (ikke gjort): «pensjonssparing» som ordledd i navnet «individuell pensjonssparing» (IPS) gjorde at IPS tok «pensjonssparing» fra temaet «Sparing til pensjon» (h22).
- **Ingen ekstern logging av søk.** Forbedringer må komme fra testsett og fra innsendt tilbakemelding, ikke fra automatisk innsamling.

## 7. Testresultater, begrensninger, åpne valg og anbefalt neste endring

**Hva er kjørt:**
- Testsett: 81 utviklingstilfeller og 45 holdout, håndskrevet av meg (Claude) før noen motor ble kjørt på dem, ut fra innholdet. Holdout har andre ord og skrivefeil enn utviklingssettet og ble kjørt én gang, på commit 9d8da67. Ingen innstilling er endret etter det.
- Grupper dekket: eksakt definisjon, produktnavn, sammenligninger, begrepsskille (fondskonto, fond, sparekonto), kontroll (boliglån), sammensatte ord, skrivefeil, korte ord (ASK, IPS, BSU), manglende innhold (bilreparasjon, kryptovaluta og flere), inndata (tom, bare tegn, lang, store bokstaver, æøå), negasjon, flertydighet og urelaterte nye dokumenter.
- Ikke laget: bestått-tester for innhold som ikke finnes. Formuesskatt og gjeldsrådgivning er med som avvisning eller skjønnstilfelle, ikke som «riktig svar».
- Registertester: 16 av 16 bestått (`node research/sokeprove/test-register.cjs`).
- Alle 12 Node-testfiler i `tests/` består på forsøksgrenen (kjørt etter at forsøket var ferdig). Forsøket endrer ingen av dem og er ikke lagt til i `.github/workflows/static.yml`. Nettlesertestene i `tests/` er ikke kjørt på nytt.

**Kandidatens egne svakheter (holdout, uten justering):**
- h15 «boligløn» gir BSU som direkte svar. Årsak (bekreftet: med stammeregelen av blir svaret riktig): stammeregelen leser «boliglon» som «bolig» + rest før nærmeste ord er prøvd. Biblioteket alene finner riktig tema.
- h12 «bolig lånet» blir bare valg. Sammensetningen krever at resultatet er et ord i indeksen, og «boliglanet» er ikke det (årsak lest i koden, ikke isolert med egen måling).
- h21 «akjsesparekonto» blir «Mente du» i stedet for svar. Årsak (bekreftet på samme måte): stammeregelen. Uten den blir svaret riktig.
- h22 «pensjonssparing» gir IPS-dokumentet (navnekollisjon i registeret, se 6).
- d57 «aksje spare konto» (tre ledd) og d74 «BSUU» (fire bokstaver) er kjente begrensninger.

**Svakheter i #54 (funnet av forsøket):** `aksjesparekonot`, `fondskotno`, `fondkonto` og to særskrivingsvarianter ender feil (d57, d58, d63, d64, h20), og ordlisten bygges ved hvert søk (punkt 5).

**Begrensninger ved forsøket:**
- Testsettet er skrevet av meg og dekker 13 dokumenter. Det er ikke ekte brukerspørsmål, og slike finnes ikke, siden nettsiden bevisst ikke logger søk.
- Holdout er liten (45). Forskjeller på én til tre tilfeller kan ikke leses som sikre.
- Noen forventninger kan diskuteres (d101 «Jeg vil ikke ha fond», h22). Jeg har ikke endret dem etter å ha sett svar.
- Bare Node 22 og headless Chromium. Ikke Safari, iPhone eller Firefox.
- Tidsmålingene er fra et skymiljø med to kjerner.
- Registeret er skrevet av meg og dekker de samme 13 dokumentene. Hvor mye arbeid det blir for flere hundre dokumenter, er ikke målt.
- **PR #52 og #45 er ikke vurdert.** #52 inneholder en egen søkemodul (`veileder-sok.js`, nøkkelord per tema, Damerau-Levenshtein, «Mente du», valg ved uavgjort). Den trenger egne `keys` per tema, og en rettferdig sammenligning krever enten at jeg skriver dem eller at den kjøres på sitt eget innhold. Det har jeg ikke gjort.

**Åpne valg (jeg har ikke tatt dem):**
1. Hvilken søkelinje skal fortsette: #54, #52 eller integrasjonen #45?
2. Skal én skrivefeil med to endringer bare gi «Mente du» (kandidaten), eller rettes automatisk (#54 gjør det ved én endring)?
3. Skal «Jeg vil ikke ha fond» gi valg (kandidaten) eller temaet om sparekonto og fond (#54)?
4. Skal registeret bli felles kilde til navn og produktnavn, uavhengig av motor?

**Anbefaling:**
- **Behold** #54-tilnærmingen som motor. Bytt ikke til MiniSearch nå. Biblioteket gir ikke bedre svar enn #54 på holdout, og det egne laget som måtte til er like stort som det #54 allerede har.
- **Forbedre** #54 i en egen liten endring etter gjennomgang: (a) ordet regnes bare som kjent når det er et ord i ordlisten, ikke når et regex treffer midt i ordet; (b) bygg ordlisten én gang ved `register()`; (c) legg tilfellene fra dette forsøket til som tester, og merk de som ikke er løst som kjente begrensninger. Dette er et forslag. Jeg har ikke implementert eller testet det.
- **Bytt ut deler:** ta i bruk registeret med validator og indeksbygger som felles kilde til navn og relasjoner. Det er motoruavhengig.
- **Se på MiniSearch igjen** hvis innholdet vokser forbi omtrent 150 til 200 dokumenter, eller hvis søk i brødtekst (ikke bare titler og spørsmål) blir et krav. Det er mine skjønnsmessige terskler, ikke målt. Da må holdout lages på nytt, for dette settet er brukt.

**Minimal utrulling og tilbakerulling:**
1. Dette forsøket: ingen produksjonsendring. Tilbakerulling er å lukke PR-en.
2. Registeret, validatoren og indeksbyggeren som egen PR uten runtimeendring og med testene i CI. Tilbakerulling: revert én commit.
3. Rettelsene i #54 (a og b) bak samme `interpret`-kontrakt, med regresjonskjøret som viser endrede førstevalg. Tilbakerulling: revert én commit.
4. Bare hvis terskelen nås: MiniSearch bak en URL-parameter (for eksempel `?sok=ms`) for gjennomgang, standard uendret. Bytte av standard i en egen commit. Tilbakerulling: sett standard tilbake. Den gamle motoren beholdes i en utgave.

## 8. Hva er endret, og hva er ikke gjort

Endret (alt under `research/sokeprove/`, ingen filer i `dist/`, `tests/`, `.github/` eller andre steder):
- `testsett/utvikling.json`, `testsett/holdout.json`: motoruavhengige testsett.
- `motorer/`: dagens, #54, rå MiniSearch og kandidaten, på lik datakilde.
- `kjor.cjs`, `skrivefeil-maaling.cjs`, `forstyrr-diff.cjs`, `maal.cjs`, `maal-nettleser.cjs`, `nettleser-inngang.cjs`, `lag-tabell.cjs`: kjøring og målinger.
- `register/begreper.json`, `valider-register.cjs`, `bygg-indeks.cjs`, `test-register.cjs`: registerprototype.
- `lib/`: MiniSearch 7.2.0 bygd fra GitHub-kilden (MIT, lisensfil og bygg-beskrivelse følger med). npm var ikke tilgjengelig i miljøet. Biblioteket lastes ikke av nettsiden.
- `resultater/`: alle kjøringer slik de ble produsert.

Bekreftelse:
- Ingenting er slått sammen. Ingenting er publisert. GitHub Pages bygger bare fra `main` og er ikke berørt.
- Sparekalkulatoren og beregningsmotoren er ikke endret. Ingen produksjonsfiler er endret.
- Ingen ekstern logging, ingen analyse og ingen nettverkskall i noen av de nye filene. Eneste nettverk i økten var `git clone` av MiniSearch-kilden og lesing av GitHub.
- Utkast-PR-en har som base grenen `research/integrasjon-47-53-54`, ikke `main`, slik at bare forsøket vises. Den grenen er min lokale samling av #54, #47 og #53 og er ikke ment for sammenslåing. PR-en skal ikke slås sammen.

Kilder: [MiniSearch på GitHub](https://github.com/lucaong/minisearch) (v7.2.0, MIT). Dokumentasjonssiden for MiniSearch var ikke tilgjengelig fra miljøet, så oppførselen er lest i kildekoden og målt.
