# Delkontroll: BSU og IPS, 28. oktober 2026

Upublisert dokumentasjon fra ChatGPT/Codex. Egenkontroll, hverken uavhengig fagkontroll eller juridisk vurdering. Viderefører PR #72. Lars ba uttrykkelig om å fortsette kontrollarbeidet. Ingen produktendringer eller publisering inngår.

## Ny gjennomgang før Claude-kontroll, 28.10.2026

Main er bekreftet som `11df29417b0e094958cf2958b1b14044258b7c5d`. BSU-, IPS-, BSU-sats- og forskuddssidene, Finansdepartementets tabell og Forbrukerrådets side er åpnet på nytt. Relevante avsnitt er lest i denne arbeidsøkten. Faktisk lesedato er 28.10.2026, ikke en ny publiseringsdato. Ingen dato oppgitt på de udaterte hovedsidene. Tabellens dato er 07.10.2026 og forskuddsmeldingens dato er 15.12.2025.

BSU-satsene og IPS-grensen er fortsatt dokumentert for 2026. Budsjetttabellens 2027-kolonne er et forslag. At beløpene er like, gjør ikke forslaget vedtatt. De tre tidsangivelsene holdes atskilt: kildedato, regelår og lesedato. Dato for nettsidens publisering er fortsatt ikke fastslått.

[Skatte-ABC 2025/2026, P-4-5.1](https://www.skatteetaten.no/rettskilder/type/handboker/skatte-abc/gjeldende/p-4-pensjon--individuell-sparing-til-pensjon/P-4.005/P-4.006/) er også åpnet, og selve fagavsnittet etter innholdsmenyen er lest. Kilden støtter fradragets type. Den har en 2026-merknad om 25 000 kr, men beholder eldre 15 000 kr i løpende tekst. Dette er en versjonsuklarhet i kilden, ikke grunnlag for å gjeninnføre den eldre grensen. Begge beløp registreres åpent. 2026-grensen bekreftes av den årsspesifikke hovedveiledningen og Finansdepartementets tabell. Ingen generell påstand om at Skatte-ABC er gjennomgått i sin helhet.

**Presisering av fradrag:** IPS gir fradrag i alminnelig inntekt. BSU gir fradrag i skatt. Ordet «skattefradrag» alene kan skjule denne forskjellen, og skal ikke brukes som om samme innskudd gir samme skattevirkning i de to ordningene. Ingen personlig skatteberegning er gjort.

Status for arvede råd er fortsatt åpen. At Forbrukerrådet oppgir fem års anbefalt sparehorisont for aksjefond dokumenterer ikke sparevaneeffekt, individuell egnethet eller prioritering av IPS mot ASK. Ingen handlingsråd godkjennes gjennom denne kildekontrollen. Historiske kodeprøver nedenfor er bevart med sitt opprinnelige grunnlag.

## Grunnlag og avgrensning i første delkontroll

Lest main: `00d8f1536802b69eebf05a1034f388bd87550d9f`. Ferske prosjektregler, regulatorisk pause, kø, logg og åpne PR-er lest. #91 til #94 gjelder annen dokumentasjon og UU, ikke disse svarenes fagtekst. Ingen aktiv reservasjon for disse ID-ene funnet i lest logg før egen reservasjon.

Kontrollert eksisterende `q-bsu-basics` (SV-133, med overlapp SV-004/SV-134/SV-005) og `q-ips-ask` (SV-087/SV-090). Dette er to eksisterende svar, ikke nye utkast til alle de tilknyttede spørsmålene.

| Fil på main | Blob-SHA |
| --- | --- |
| dist/veileder-knowledge.js | baa420596e669867e7c565a99fefb1464032ac7b |
| dist/veileder-facts.js | e4121dc8c3fa7f21d4b8fe2b97471830e50f34a3 |
| dist/veileder-engine.js | f4fbc87dd2ab5d343a78408c322dc93271a1228e |
| dist/veileder-cards.js | 1ddfb0877bf26e74700fcfe7619dfd19f021577f |

Filenes lagrede kontrolldato er 22.10.2026. Den er ikke oppdatert av denne kontrollen. Publiseringsdato og dagens live-versjon er ikke fastslått her. Forrige delkontroll bekreftet enkelte publiserte filer, men erstatter ikke en ny live-kontroll.

## Kilder faktisk lest 28.10.2026

| Kilde | Dato/regelår og konkret bruk |
| --- | --- |
| [Skatteetaten: Bustadsparing for ungdom](https://www.skatteetaten.no/nn/person/skatt/hjelp-til-rett-skatt/bank-og-lan/bsu--bustadsparing-for-ungdom/) | Ingen oppdateringsdato i lest hovedtekst. Aldersgrense, boligformål, renter, skatt og brudd på vilkår. |
| [Skatteetaten: Fradrag for BSU, år valgt med 2026 i URL](https://www.skatteetaten.no/satser/fradrag-for-boligsparing-for-ungdom-bsu/?year=2026) | Ingen oppdateringsdato i lest tekst. Årsvelgerens valgte verdi vises ikke i uttrekket. Satser og boligeierskap; regelåret bekreftet med neste kilde. |
| [Skatteetaten: Forskuddsutskrivingen 2026](https://www.skatteetaten.no/rettskilder/type/uttalelser/uttalelser/forskuddsutskrivingen-2026/) | Avgitt 15.12.2025, regelår 2026. BSU-satser og avgrensning av bolig. Bare relevante avsnitt lest, ikke hele meldingen. |
| [Skatteetaten: Individuell sparing til pensjon](https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/arbeid-trygd-og-pensjon/pensjon-og-uforetrygd/ny-ordning-for-skattefavorisert-individuell-sparing-til-pensjon/) | Ingen oppdateringsdato i hovedtekst. Skiller 2025 fra 2026, gammel og ny ordning, skatt, innbetaling og uttak. |
| [Finansdepartementet: Skattesatser 2027](https://www.regjeringen.no/no/tema/okonomi-og-budsjett/skatter-og-avgifter/skatte-og-avgiftssatser/skattesatser-2027/id3173438/) | Datert 07.10.2026. Relevante tabellrader lest: vedtatt 2026 mot foreslått 2027. Samme BSU-grenser og IPS-fradragsgrense i begge kolonner. Forslaget brukes ikke som gjeldende regel. |
| [Forbrukerrådet: Sparing i fond og spareprofiler](https://www.forbrukerradet.no/sparing-i-fond-og-spareprofiler/) | Ingen oppdateringsdato i lest hovedtekst. Fem år er en anbefalt minstehorisont for aksjefond, ikke IPS-binding eller garanti. |

Skatteetatens sider er myndighetsveiledning, ikke selv lest lovtekst. Finansdepartementets tabell er primærkilde til regjeringens forslag; den dokumenterer ikke et stortingsvedtak om 2027. Forbrukerrådet er nivå 2, brukt bare til rådets egen anbefaling. Skatte-ABC-landingssiden ble åpnet, men underkapitlene er ikke kontrollert. Budsjettproposisjonens landingsside er åpnet uten gjennomgang av kapitlene. Ingen fullført K7-runde eller samlet kontroll av 2027-endringer erklæres.

## Påstander og konkrete reparasjoner

| Sted | Resultat og forslag før eventuell integrasjon |
| --- | --- |
| knowledge.js:154, BSU-grenser | 33 år, 27 500 kr årlig, 300 000 kr samlet og 10 prosent samsvarer med kildene for 2026. Maksimalt 2 750 kr er også kontrollregnet. Behold skillet mellom innbetalt beløp og saldo: renter inngår ikke i sparegrensene. |
| knowledge.js:155, boligeierskap | Presiser hva bolig betyr: helt eller delvis, direkte eller indirekte eierskap til primær- eller sekundærbolig per 31. desember. Fritidseiendom alene stenger ikke for fradraget. Kilde: satsiden og Forskuddsutskrivingen. |
| knowledge.js:153–156, boligformål | Svaret nevner bare godkjente formål, uten å forklare oppussing. Kort faktatillegg til vurdering: «BSU kan blant annet brukes til oppussing og vedlikehold av egen faste bolig. Møbler, frittstående hvitevarer og verktøy faller utenfor.» Kilde: BSU-veiledningen. Dette er et dokumentert dekningshull ved direkte søketreff, ikke feil i satsene. |
| knowledge.js:159, IPS | 25 000 kr for 2026, inkludert angitte kostnader og forsikring, støttes. Ny ordning fra 1. november 2017; gammel IPS må holdes atskilt. Skatt ved uttak og fritak for formuesskatt/løpende avkastningsskatt støttes. |
| knowledge.js:159–160, uttak | 62 år, minst til 80 år og minst ti år støttes som ordinære regler. Behold «ordinært» også i kort forklaring: kilden omtaler unntak ved rett til uføreytelser. Full kontroll av småbeløpsregler og øvrige forskriftsunntak gjenstår. |
| knowledge.js:160, sparevaner | Påstanden om at binding hjelper sparevanene er ikke dokumentert av den leste skatteveiledningen. Forslag: behold den observerbare bindingen, og ta ut den udokumenterte effekten i et senere nøytralt begrepssvar. |
| Begge svar, kildemetadata | Ingen egen caveat med kildedato, faktisk lesedato og individuell neste frist i oppføringene. Forslag: registrer regelår 2026 og faktisk lesedato, og oppgi «ingen dato oppgitt» der det er riktig. Ikke erstatt historiske datoer som om alt var nylest. |

De øvrige ASK-påstandene, leverandørvilkår, anbefalinger om buffer/gjeld og Forbrukerrådets pensjonsside er ikke fullstendig nykontrollert. Skattefradrag på IPS må ikke forveksles med direkte fradrag i skatt på BSU. Ingen IPS-skattebesparelse er beregnet. Ingen skatte-, avkastnings- eller egnethetskonklusjon for en bestemt person.

## Faktisk søkeprøve i Node på uendret main

| Søk | Faktisk resultat | Vurdering |
| --- | --- | --- |
| Hva er BSU? | answer, q-bsu-basics | Riktig tema |
| Hva er IPS? | answer, q-ips-ask | Åpner sammenligning med råd, ikke rent begrepssvar |
| IPS eller ASK? | answer, q-ips-ask | Riktig sammenligning |
| hva er aldersgrensen for BSU | answer, q-bsu-basics først | Aldersgrensen finnes |
| kan jeg bruke BSU på oppussing | answer, q-bsu-basics først | Direkte treff uten konkret svar på oppussing |
| hva skjer med BSU hvis jeg flytter | uncovered, bsu-flytting | Hullet beholdes |
| hva skjer med IPS ved uførhet | answer, q-ips-ask først | Bare kort omtale av særregel, ikke et fullstendig svar |
| flytte strømavtale | none | Ingen irrelevant BSU-forklaring |

## Eksisterende tilpasning og anbefalingspreg

Kortbyggeren er faktisk kjørt for begge svar med sju profiler: tom profil; alder 33; alder 34; boligeier; alder 30/sparetid 31; alder 30/sparetid 32; dyr gjeld og ingen buffer. Totalt 14 kort. Alder 70 ble i tillegg kjørt i den første utforskende kontrollen.

- BSU: 33 gir ingen aldersmerknad, 34 gir merknad om nye innskudd. Boligeierskap gir merknad om fradrag.
- IPS: 30 + 31 gir merknad om at sparetiden slutter før 62. Ved 30 + 32 er denne merknaden borte.
- Begge: kombinasjonen `debt:yes, buffer:no` erstatter alternativene med «Bygge en tilgjengelig buffer» og «Betale ned dyr gjeld». Tittelen og fagavsnittene om BSU/IPS beholdes. Merknaden prioriterer konkrete handlinger.
- Andre råd arves fra kategoriens svar i engine.js:113 og pensjonsavsnittene. Også tom profil gir derfor mer enn en ren definisjon.

Dette er bekreftet lokal kodeatferd, ikke faktisk visningskontroll. Ingen funksjon er endret. At svarene er eldre gir ingen ny godkjenning under unntaket for nøytrale begreper. Eventuell avgrensning til nøytrale svar må vurderes som egen, konkret endring etter prosjektreglene. Ingen juridisk konklusjon trekkes.

## Angrepsflater og overlevering

| Feiltolkning | Reparasjon |
| --- | --- |
| Treff betyr at spørsmålet er besvart | Kontroller oppussing og uførhet som egne innholdstilfeller før søket kalles dekkende |
| Hele BSU-saldoen må holde seg under innskuddsgrensen | Forklar renter og innbetalt beløp hver for seg |
| Boligeier betyr også bare hytteeier | Bruk presis avgrensning fra skattekilden |
| Et IPS-fradrag er penger mottatt skattefritt | Forklar fradragets type sammen med skatt ved uttak |
| Kildelisten dekker alle arvede råd | Kartlegg hvert arvet avsnitt og påstand; en skatteside dokumenterer ikke sparevaner |
| Kontroll av satser betyr at tilpasningen er avklart | Hold regelfakta, kodeatferd og juridisk avklaring atskilt |

Premiss: Direkte treff på et kontonavn er ikke bevis på full dekning av brukerens spørsmål. Mulig oppfattet anbefaling: bekreftet ved egenkontroll i handlingsvalg, prioriteringsmerknader og arvede avsnitt.

Utført: kildeavsnitt lest, kode gjennomgått, åtte søk og profiltilfellene kjørt, 27 500 × 10 / 100 = 2 750 kontrollert i Node. Ingen vekstmodell, nominelt tap eller kjøpekraftberegning inngår. Dokumentets lenker, ID-er og omfang kontrolleres ved lagring. Ingen nettleser-, mobil-, skjermleser-, brukerforståelses- eller full regresjonstest. Ingen uavhengig fagkontroll. Ingen produktfiler eller tester endret.

Neste kontroll: før eventuell integrasjon og senest før 01.01.2027, med ny status for budsjettvedtak og ASK-avgrensning. Fortsett deretter samlet påstandskontroll av arvede pensjons-/bufferavsnitt og de øvrige eksisterende svarene før nye temaer. Denne delkontrollen fullfører ikke K7-runden. Aktive avvik er lest; ingen tidsbestemt aktiv dispensasjon med utløp innen to uker er funnet.
