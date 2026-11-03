# Referansesvar for «Spør om sparing»

Arbeidsgrunnlag etter retting: main `3590e1403654ed4088b8c621dacb226fda349904`. Første versjon ble skrevet etter #198. Oppdrag fra Lars 3.11.2026: prioriter ett grundig referansesvar som mindre modeller kan følge. Utarbeidet med ChatGPT/Codex. Prosjektets lisens gjelder. Denne veiledningen viser hvordan eksisterende regler brukes. Den innfører ingen ny svarform eller godkjenningsregel.

**Start her:** [SV-022](../kilder/svar/SV-022.md) er et ferdig utfylt eksempel med status `til kontroll`. Egenkontroll og en videresendt delkontroll foreligger. Fullstendig separat kontroll og godkjenning gjenstår. [SVARSKJEMA](../SVARSKJEMA.md) er fortsatt kontrakten. [Svargrunnmur](svargrunnmur.md) beskriver hva generatoren faktisk gjør.

## Kort sjekkliste

1. Hent og les fersk main. Før den faktisk leste SHA-en i `Lest main`.
2. Behold riktig SV-ID og svar-ID. Velg svarform før du skriver.
3. Les kildene. Før hver påstand med kilde, dato, presist avsnitt og nødvendige vilkår.
4. Svar forståelig først. Bruk «Eksemplet forutsetter» om regneforutsetninger og registerreferanser for fakta og begreper.
5. Regn eksemplene med kode. Før kommando, resultat, forutsetninger og avrunding under `Kontrollregning`.
6. Kontroller felt, påstandsmerker, lenker og avgrensninger. Kjør `python3 scripts/svar.py --check`.
7. Før egenkontroll og det som gjenstår. Lever som `til kontroll`. Separat kontroll og Lars sin godkjenning følger før publisering.

Bruk deretter detaljene nedenfor ved behov. Referansen er et kontrollgrunnlag. Den omtales ikke som ferdig gullstandard før separat kontroll og faktisk godkjenning er dokumentert.

## Hva gjennomgangen av svarbasen viser

Kontrollert mot publiseringslisten og hele de tre publiserte postene i `dist/veileder-knowledge.js`, ikke utledet av eldre samtaler. Ingen ny juridisk godkjenning av de tre svarene er utført.

| Svar | Kø-ID | Faktisk status ved gjennomgangen | Neste arbeid |
| --- | --- | --- | --- |
| Hva er BSU? `q-bsu-basics` | SV-133 | Publisert. Nytt skjema er et mekanisk utkast med sperrer. | Del de sammensatte påstandene. Knytt SSB-sammenligningen til SSB, uttak til uttaksregelen og hver aldersregel til riktig registerverdi. Bevar tabellen `bsuRates`. |
| Hva er en aksjesparekonto (ASK)? `q-aksjesparekonto` | SV-031 | Publisert som nøytral oversikt. Ikke overført til nytt skjema. | Overfør ett avsnitt av gangen. Skattesatsen og det avledede skattebeløpet i eksemplet er skrevet som tall i posten. Finn riktig register-ID og kildekontroller før endring. Bevar søkets avgrensning mot fondskonto. |
| Hva er en fondskonto? `q-fondskonto` | SV-122 | Publisert som nøytral oversikt. Ikke overført til nytt skjema. | Bevar skillet mellom investering og forsikring og avgrensningen til lite forsikringstillegg. Tallfestede grenser og skattesatser i posten trenger registerkobling og ny kontroll. Bevar søkeavgrensningen mot ASK. |
| Hva er renters rente? `q-renters-rente` | SV-022 | Eldre post finnes, men er trukket fra publisering. Nytt skjema er nå `til kontroll`. | Bruk kontrolloppdraget nedenfor. Ikke legg den nye posten inn ved siden av den gamle. |

De to nye skjemaene etter #197 var BSU og renters rente. Oppføringene over er en kartlegging av struktur og vedlikehold, ikke en full innholdsrevisjon. ASK og fondskonto skal ikke masseoverføres av en modell uten å lese kildene. Køen i `SPORSMALSKO.md` er fortsatt eneste arbeidskø.

## Slik bygger du et svar etter referansen

1. Finn eksisterende SV-ID og `q-`-ID. Filnavnet bruker kø-ID, offentlig svar bruker `q-`-ID. Ikke opprett en ny ID for et spørsmål som allerede finnes.
2. Velg hva svaret forklarer. SV-022 er `regnemåte`, derfor `kind: explainer` og `layout: overview`. Det har ingen fordeler og ulemper. Kopier ikke dette valget til BSU, ASK eller en sammenligning uten å vurdere svarformen.
3. Les kildene før du skriver. Noter kildens dato og avsnitt, egen lesedato og hvem som leste. `Kilde-ID` er en lokal identifikator, ikke et bevis på at kilden støtter teksten.
4. Skriv påstandstabellen først. Skill skatteregel, matematikk og prisvekst. En beregning får metodekilden og teksten «egen beregning». Ikke skriv at SSB publiserte våre valgte eksempeltall.
5. Skriv kortsvaret, deretter ett enkelt eksempel. SV-022 forklarer nøyaktig hva de ekstra 25 kronene er. Den forteller ikke bare at sluttbeløpet øker.
6. Legg hvert faglige poeng ett sted i fordypningen. Bevar forutsetninger ved tallet de gjelder. Et forbehold må ikke gjemmes i kontrollteksten hvis det endrer forståelsen av eksemplet.
7. Sett inn registerreferanser. `{{begrep:renters-rente}}` er den eksisterende definisjonen. `{{ID}}` brukes for endringsutsatte fakta. Valgte 5 % og 10 000 kr er eksempeltall, ikke nye faktaoppføringer. Du skal ikke bruke faktisk bankrente som en prognose.
8. Lag eksempellenker med `Del plan`. Åpne dem på nytt og sammenlign resultat og forutsetninger med teksten. Ved navigering som bare endrer URL-fragmentet: last siden på nytt, fordi kalkulatoren leser forutsetningene ved oppstart.
9. Fyll angrepsflater, sperrer og det som ikke er kontrollert. Skriv egenkontroll som egenkontroll. Behold status `til kontroll` når separat kontroll gjenstår.
10. Kjør kontrollene under. Rett meningen og kildesporet når noe feiler. Ikke endre en testforventning eller en status bare for å få grønt.

## Feltene og kodene i dette eksemplet

| I skjemaet | Koden det blir til | Kontrollpunkt |
| --- | --- | --- |
| `Svar-ID: q-renters-rente` | `id` | Én offentlig post, stabil ID. |
| `Svarform: regnemåte` | `kind: explainer`, `layout: overview` | Ingen `options` eller `tradeoffs`. |
| `Kort svar` | `intro` | Definisjonen hentes fra registeret. |
| `Eksempel` | `example.title`, `example.text` | `Kontrollregning` følger ikke med til leseren. |
| Hver `###` i felt 7 | `parts[].title`, `parts[].text` | Avslutt hver del med `Tabell: ingen`. |
| Felt 8 | `next.text`, `next.href`, `next.more` | To testede lenker, ingen personopplysninger eller valgt spareform. |
| Felt 9 | `sources[].id`, `.title`, `.url` | Hver påstands kilde finnes her. |
| Felt 10 | `review.text` | Kontrollform og begrensninger er synlige. |
| `[P1]` til `[P12]` | Fjernes av generatoren | Merkene må stemme med felt 14. |
| Felt 14 til 18 | Ingen offentlige felt | Påstandstabell og intern kontroll skal ikke lekke. |
| `til kontroll` | Ingen offentlig generert post | Separate kontrollbevis og godkjenning kreves før integrasjon. |

Relevans og «Se også» er interne koblinger i dagens grunnmur. Ikke lov at de vises, og ikke lag personlige varianter av teksten.

## Utførte kontroller og forventede tall

Tre myndighetskilder på nivå 1 og én metodekilde på nivå R er åpnet og lest 3.11.2026. Presise avsnitt og avgrensninger står i skjemaet. Formlene brukes selvstendig, uten kopierte lærebokeksempler, figurer eller oppgaver. Referansen har 252 ord i kortsvar, eksempel og fordypning når registerdefinisjonen er løst ut. Kontrolltekst, titler og kildeliste kommer i tillegg. Den passerer også validatorens samlede lengdekontroll.

| Tilfelle | Forutsetning | Forventet resultat |
| --- | --- | --- |
| Hovedeksempel, ett år | 10 000 kr, 5 %, ingen innskudd eller uttak | 10 500 kr. |
| Hovedeksempel, to år | Samme | 11 025 kr, hvorav 1 025 kr samlet rente. |
| Andre års rente | Samme | 525 kr, hvorav 25 kr fra første års rente. |
| Rentene tas ut årlig | Samme, uttak ved årsslutt | 10 000 kr igjen og 1 000 kr utbetalt etter to år. |
| Kjøpekraftskontrast | 2 % rente, 2,5 % prisvekst, to år | 10 404 kr. Kjøpekraft 9 902,676977989 kr, avrundet til 9 903 kr ved startens priser. |
| Fondsillustrasjon | Først +10 %, deretter −10 % | 11 000 kr, deretter 9 900 kr. |

Begge fullstendige delingslenker ble hentet fra kalkulatorens delingsfunksjon og åpnet på nytt i Chrome. Synlige hovedresultater, innskudd og kjøpekraft stemte. Dette prøver kalkulatoren på den publiserte siden, ikke kandidatens svarvisning. Mobilvisning, skjermleser, Safari og Firefox gjenstår ved integrasjon.

```sh
python3 scripts/kontroller-sv022.py
python3 scripts/svar.py --check
python3 tests/svar.test.py
python3 scripts/fakta.py --check
node tests/svar-generated.test.cjs
node tests/published-answers.test.cjs
```

Kontrollskriptet for SV-022 er et særskilt eksempel som prøver sammenhengen mellom tekst, eksempellenker og kalkulatormotor. Det er ikke en mal som skal kopieres til hvert svar. For vanlige svar føres kontrollregningen i skjemaet med kommando, resultat og avrunding, og en kontrollør regner selv. Nye skript krever et konkret behov for å kontrollere kode eller en feil som kan gjenta seg. Et skript med de samme formlene og tallene som skribenten brukte, gir ikke alene separat kontroll. Vurder en felles regnekontroll ved flere slike behov fremfor en samling skript per svar.

Skriptet skriver ingenting og bruker ikke nettverk. Det sammenligner egen desimalberegning med kalkulatormotoren og kontrollerer lenkenes faktiske inndata. Det validerer skjemaet og at kandidatens interne felt ikke blir offentlig tekst. Det beviser ikke kildekvalitet eller brukerforståelse.

## Oppdrag til en kontrollør i ny økt

Kopier denne teksten uten å legge ved skribentens samtale:

> Kontroller SV-022 i gronnlars/spareverksted, gren docs/referansesvar-renters-rente. Les fersk gren og main, SVARSKJEMA.md punkt 4C, KILDEREGLER.md, SPRAKREGLER.md, SVARMAL.md og kilder/svar/SV-022.md. Åpne alle fire kilder. Finn avsnittet for hver av P1 til P12 og vurder både setning og overskrift. Regn alle eksempler selv med kode. Skill metodestøtte fra egne eksempeltall. Kontroller at {{begrep:renters-rente}} er brukt riktig. Kjør kontrollkommandoene i docs/referansesvar.md. Rapporter ja eller nei på alle tolv kontrollpunkter. Foreslå ordlyd ved funn, men ikke skriv om teksten og ikke publiser. Før kontrollformen med eget navn og ny økt. Bruk gjeldende hash fra python3 scripts/svar.py hash SV-022 først når innholdet er ferdig. Ikke finn på en godkjenning fra Lars. Ingen kontroll av en annen KI skal kalles menneskelig fagkontroll.

## Før en integrator publiserer referansen

Følg eksisterende kontrollbevis i `docs/svargrunnmur.md`. Denne PR-en er dokumentasjon og egenkontroll, ikke publisering av et nytt svar. Historisk publiseringsdato må avklares fra git-historikken ved integrasjon. `ikke publisert` i kandidatskjemaet gjelder den nye revisjonens arbeidsstatus, ikke en påstand om at ID-en aldri har vært vist.

Etter separat kontroll og faktisk godkjenning: fjern den eldre posten i `veileder-knowledge.js`, generer den godkjente posten, oppdater begge publiseringslistene og søkegrunnlaget, og kjør relevante søke- og visningstester. Ikke kopier Markdown-filen manuelt inn i JavaScript.

Minst følgende søketilfeller må prøves: de fem formuleringene i felt 2, sammenskrivingene «rentersrente» og «rentesrente», skrivefeilen «renters rnete», og nærliggende spørsmål om beste spareform, månedssparing, skatt og fondsdobling. De siste skal ikke framstilles som fullstendig besvart av SV-022. Dagens spesialuttrykk i den eldre posten og den nye generatorens bokstavelige fraser er forskjellige. Søkeparitet er derfor en faktisk kontrolloppgave.

De fire kilde-ID-ene i referansen er ikke registrert som egne kilder i Kildevakts kildeliste eller faktaregisterets kildetabell på arbeidsgrunnlaget. Avhengighetsindeksen gjør dem søkbare i svargrunnmuren. Det beviser ikke at Kildevakt henter dem. Før integrasjon må oppfølging av disse URL-ene kobles til eksisterende Kildevakt og prøves, eller den manglende automatiske oppfølgingen føres som uttrykkelig sperre. Tidsmaskin brukes fortsatt til dataserier. Ingen tredje innhenter opprettes.


## Verifikasjon av denne leveransen

Kjørt 3.11.2026: referansekontrollen, svarskjemaenes bygging og konsistenskontroll, faktaregister, sikkerhetskontroll, innholdsbaserte cacheversjoner og de fire Node-testfilene `svar-generated`, `published-answers`, `svarmal` og `engine`. Python-testfilen `svar.test.py` omfatter også referansekontrollen og et moteksempel: 525 kr endres til 526 kr i offentlig tekst og skal avvises. Kontrollene består. De to eksisterende lengdevarslene i BSU-utkastet er ikke behandlet her. Nettverksfeilene i moteksempeltestenes utskrift er simulerte, ikke resultat av en live tilgangstest.

Samordnet med main `1b91b2c5540c85a51be1a2aea2c3d3416d066fd3` før levering. Nye endringer på main er bevart. Referansekontrollen, alle 35 Python-kontroller i `tests/svar.test.py`, skjemaenes konsistenskontroll og Node-kontrollene av generering og publiseringsutvalg er kjørt på nytt etter samordningen.

## Retting etter videresendt delkontroll, 3. november 2026

Kortsvaret er skjerpet med vilkåret fast, positiv rente, og P2 er oppdatert til samme ordlyd. Formelen hos OpenStax er lest på nytt for denne endringen. «Vi regner med» er erstattet med «Eksemplet forutsetter». Formelforklaringen og to formuleringer i eksemplene er forkortet uten å fjerne vilkår eller endre tall. Kontrolloggen skiller tre myndighetskilder på nivå 1 fra metodekilden på nivå R. `Lest main` viser faktisk lest og innflettet main `3590e1403654ed4088b8c621dacb226fda349904`, inkludert sperren mot foreldet kode. Den historiske lesingen av øvrige kilder er ikke ført som en ny full kildekontroll.

Sju korte sjekkpunkter er lagt foran detaljene. Kontrollskriptet er presisert som en særskilt prøve for SV-022, uten krav om eget skript for hvert svar. Kjørbar kontrollregning i skjemaet er normal arbeidsform. En felles regnekontroll er et mulig senere tiltak, ikke implementert her.

Referansekontrollen, `svar.py --check`, alle 35 tester i `svar.test.py`, faktaregisteret, Node-kontrollene av generert svarbase og publiseringsutvalg og de åtte tilfellene i testen av foreldet kode består etter rettingen. De eksisterende BSU-lengdevarslene gjenstår. Videresendt delkontroll er ikke registrert som fullført separat 4C-kontroll. Status er fortsatt `til kontroll`.
