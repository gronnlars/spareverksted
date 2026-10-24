# Spørsmålkø for Spareverksted

Opprettet 24. oktober 2026. Dette er prosjektets samlede arbeidskø. Den erstatter prioriteringslisten i `research/sporsmal-og-prioritering.md`; den gamle filen beholdes som historikk.

**Daglig oppgave: research og forberedelse. Kontrollert innholdspåfyll åpnes etter at arbeidsgrunnlaget er samlet på main, etter [faseplanens punkt 6](research/plan.md).** Køen gir ingen fullmakt til å endre nettsiden eller kalkulatoren. Se [daglig arbeidsoppgave](research/DAGLIG-OPPGAVE.md) og [arbeidslogg/reservasjoner](research/ARBEIDSLOGG.md).

## Slik brukes køen

- Rekkefølgen i tabellen er prioriteten. ID-ene flyttes aldri til andre spørsmål. SV-001 til SV-100 svarer til brukerens opprinnelige nummer. SV-101 og videre er tillegg og spørsmål fra den gamle listen.
- Først: nødvendige grunnbegreper og noen representative prøvesvar. Deretter høyt prioriterte hull i bolig/lån, før øvrig bredde. Dette er redaksjonell prioritering etter forståelse, konsekvens og dekning, ikke målt popularitet. Hele køen skal ikke ferdigskrives før strukturen er vurdert.
- Konkrete feil og utløpte påstander går foran rekkefølgen. Registrer begrunnelsen i loggen. Normalt to spørsmål per natt, færre ved krevende emner.
- Alternativ ordlyd og overlapp beholdes som søkeinnganger. Når flere ID-er får samme svar, merk `Se SV-xxx`; ikke slett sporbarheten eller bygg to konkurrerende svar.
- Dekning er en innholdsvurdering, fagstatus en kildevurdering og søketest en egen kontroll. Ingen av dem innebærer godkjenning for publisering.

## Status og første kartlegging

Lest main: `1de2847ab5eac3435b404ccdbb3574ad844b7534`. Lest registrerte temaer i `dist/veileder-engine.js` og spørsmål i `dist/veileder-knowledge.js`. «Delvis» nedenfor er en foreløpig kobling til relevant innhold, ikke full kontroll av svaret eller søket. «Ikke kontrollert» betyr ikke at noe mangler. Bare aktuelle hovedinnganger er kartlagt nå. Ingen finansfaglige påstander er nykontrollert i denne organiseringsrunden.

Arbeidsstatus: `Kø`, `Pågår`, `Utkast`, `Kontrollert utkast`, `Avventer` eller `Se SV-xxx`. Kontrollert utkast krever kildekontroll og egen korrekturrunde, og er fortsatt upublisert. Eventuell uavhengig kontroll dokumenteres separat med hvem og dato.

For hver rad gjelder foreløpig **fagkontroll: ikke nykontrollert; søketest: ikke kjørt; kilder/kontrolldato: ikke registrert**. Når et spørsmål behandles, skal resultat og faktisk kontrolldato stå i radens utkastlenke, med kildetabell etter malen i arbeidsinstruksen. Et tidligere researchresultat fra samtalen kan brukes som startpunkt, men må leses og kontrolleres før det får ny status. Dagens dato er ikke en felles faktasjekkdato.

## Prioritert kø

| Rekkefølge | Fast ID | Spørsmål | Først / overlapp / andre formuleringer | Foreløpig dekning | Arbeidsstatus | Utkast og kontroll |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | SV-031 | Hva er en aksjesparekonto (ASK)? | Ingen registrert | Delvis: q-ips-ask / q-ask-zero | Kø | Ikke opprettet |
| 2 | SV-035 | Hva er et indeksfond? | Ingen registrert | Delvis: funds | Kø | Ikke opprettet |
| 3 | SV-017 | Hva er forskjellen på sparing og investering? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 4 | SV-022 | Hva er renters rente? | rentes rente | Ikke kontrollert | Kø | Ikke opprettet |
| 5 | SV-023 | Hvordan påvirker inflasjon sparepengene mine i banken? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 6 | SV-001 | Hvor mye bør jeg ha på bufferkontoen? | Ingen registrert | Delvis: buffer | Kø | Ikke opprettet |
| 7 | SV-025 | Bør jeg spare før jeg betaler ned kredittkortgjeld? | Ingen registrert | Delvis: buffer | Kø | Ikke opprettet |
| 8 | SV-013 | Hvordan setter jeg opp et enkelt budsjett? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 9 | SV-008 | Hva er en høyrentekonto? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 10 | SV-010 | Hva er innskuddsgarantien? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 11 | SV-011 | Gjelder innskuddsgarantien for utenlandske banker i Norge? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 12 | SV-029 | Hvor mye egenkapital trenger jeg for å kjøpe bolig? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 13 | SV-104 | Hvordan vurderer banken gjeldsgrad og om jeg tåler høyere rente? | Først SV-029; stresstest; fem ganger inntekt | Ikke kontrollert | Kø | Ikke opprettet |
| 14 | SV-101 | Hvordan fungerer annuitetslån og serielån? | annuitet eller serie | Ikke kontrollert | Kø | Ikke opprettet |
| 15 | SV-102 | Når lønner det seg å refinansiere boliglånet? | Først SV-101 | Ikke kontrollert | Kø | Ikke opprettet |
| 16 | SV-103 | Hva innebærer fast og flytende boliglånsrente? | Ingen registrert | Delvis: mortgage | Kø | Ikke opprettet |
| 17 | SV-106 | Hva koster boligkjøpet utover kjøpesummen? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 18 | SV-105 | Hva er forskjellen på selveier, borettslagsandel og aksjeleilighet? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 19 | SV-110 | Hvordan virker fradraget for gjeldsrenter? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 20 | SV-024 | Bør jeg betale ned studielånet så fort som mulig? | Ingen registrert | Delvis: student | Kø | Ikke opprettet |
| 21 | SV-003 | Lønner det seg alltid å fylle opp BSU-kontoen? | Ingen registrert | Delvis: bsu / q-bsu-basics | Kø | Ikke opprettet |
| 22 | SV-004 | Hva er aldersgrensen for BSU? | Ingen registrert | Delvis: q-bsu-basics | Kø | Ikke opprettet |
| 23 | SV-005 | Kan jeg bruke BSU på oppussing? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 24 | SV-133 | Hva er BSU, og hvordan fungerer ordningen? | Ingen registrert | Eget svar: q-bsu-basics | Kø | Ikke opprettet |
| 25 | SV-134 | Får jeg BSU-fradrag hvis jeg betaler lite skatt eller eier bolig? | Ingen registrert | Delvis: q-bsu-basics | Kø | Ikke opprettet |
| 26 | SV-135 | Hva kan BSU brukes til, og hva skjer ved feil bruk? | Først SV-133 | Ikke kontrollert | Kø | Ikke opprettet |
| 27 | SV-136 | Bør jeg prioritere buffer, BSU eller annen sparing til bolig? | Først SV-001, SV-133 | Delvis: bsu / buffer | Kø | Ikke opprettet |
| 28 | SV-007 | Bør barnesparing stå i barnets eller foreldrenes navn? | Ingen registrert | Delvis: children | Kø | Ikke opprettet |
| 29 | SV-006 | Hvordan sparer jeg best til barna? | Ingen registrert | Delvis: children | Kø | Ikke opprettet |
| 30 | SV-033 | Hva skjer med skatten når jeg tar ut penger fra ASK? | Først SV-031 | Delvis: q-ask-zero | Kø | Ikke opprettet |
| 31 | SV-032 | Kan jeg ha rentefond på ASK? | Først SV-031, SV-061 | Delvis: q-ips-ask / q-ask-zero | Kø | Ikke opprettet |
| 32 | SV-122 | Hva kan fondskonto bety, og hvordan skiller det seg fra et fond? | vanlig fondskonto; aksje- og fondskonto; kapitalforsikring | Ikke kontrollert | Kø | Ikke opprettet |
| 33 | SV-034 | Hva er forskjellen på ASK og forsikringsbasert fondskonto, som Nordnet Investeringskonto Zero? | Først SV-031, SV-122; ASK eller Zero; IKZ; investeringskonto | Delvis: q-ask-zero | Kø | Ikke opprettet |
| 34 | SV-087 | Hva er individuell pensjonssparing (IPS)? | IPS; individuell sparing til pensjon | Delvis: q-ips-ask | Kø | Ikke opprettet |
| 35 | SV-090 | Hvordan sammenligner jeg IPS med langsiktig sparing på ASK? | Først SV-031, SV-087; IPS eller ASK | Delvis: q-ips-ask | Kø | Ikke opprettet |
| 36 | SV-081 | Hva er egen pensjonskonto (EPK)? | Først SV-077; EPK; egen pensjonskonto | Ikke kontrollert | Kø | Ikke opprettet |
| 37 | SV-082 | Bør jeg velge egen leverandør for pensjonskontoen? | Først SV-081, SV-141 | Ikke kontrollert | Kø | Ikke opprettet |
| 38 | SV-083 | Hva er et pensjonskapitalbevis? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 39 | SV-084 | Bør jeg samle pensjonskapitalbevisene mine? | Først SV-083 | Ikke kontrollert | Kø | Ikke opprettet |
| 40 | SV-141 | Hvilke kostnader ved egen pensjonskonto dekkes av arbeidsgiver? | Først SV-081 | Ikke kontrollert | Kø | Ikke opprettet |
| 41 | SV-142 | Hva skjer med IPS ved uførhet eller dødsfall? | Først SV-087 | Ikke kontrollert | Kø | Ikke opprettet |
| 42 | SV-143 | Kan jeg utsette skatt i ENK ved å la overskudd stå på bedriftskonto? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 43 | SV-144 | Hva skattlegges i et AS, og hva skattlegges hos eieren? | Først SV-143 | Ikke kontrollert | Kø | Ikke opprettet |
| 44 | SV-145 | Når kan det være aktuelt å investere overskudd i AS? | Først SV-143 | Ikke kontrollert | Kø | Ikke opprettet |
| 45 | SV-146 | Hva koster det å opprette og drive AS? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 46 | SV-147 | Hva dekker fritaksmetoden, og hva faller utenfor? | Først SV-143, SV-146 | Ikke kontrollert | Kø | Ikke opprettet |
| 47 | SV-148 | Hva blir samlet skatt når penger tas ut av AS privat? | Først SV-143 | Ikke kontrollert | Kø | Ikke opprettet |
| 48 | SV-149 | Hva kreves for skattefri omdanning av ENK til AS? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 49 | SV-132 | Hvordan skiller sparing i AS seg fra ENK og privat sparing? | Først SV-143, SV-144, SV-146, SV-147, SV-148; AS eller ENK; spare i selskap; utsatt eller spart skatt | Ikke kontrollert | Kø | Ikke opprettet |
| 50 | SV-002 | Bør jeg betale ned boliglånet eller spare i fond? | Ingen registrert | Delvis: mortgage | Kø | Ikke opprettet |
| 51 | SV-009 | Hvor ofte bør jeg bytte bank for å få bedre sparerente? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 52 | SV-012 | Bør jeg binde renten på sparepengene? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 53 | SV-014 | Hva er 50/30/20-regelen, og når passer den dårlig? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 54 | SV-015 | Hvordan unngår jeg livsstilsinflasjon? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 55 | SV-016 | Hvor stor andel av lønnen bør jeg spare hver måned? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 56 | SV-018 | Bør jeg ha flere sparekontoer for ulike formål? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 57 | SV-019 | Hva er mikrosparing? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 58 | SV-020 | Hvordan kan jeg spare penger på matbudsjettet? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 59 | SV-021 | Bør samboere spare på en felles konto? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 60 | SV-026 | Hvilke faste utgifter kan jeg redusere? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 61 | SV-027 | Bør jeg kjøpe bolig sammen med venner? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 62 | SV-028 | Bør jeg leie eller eie hvis jeg skal bo der i under tre år? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 63 | SV-030 | Kan kausjonist erstatte oppspart egenkapital? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 64 | SV-036 | Hvorfor omtales globale indeksfond ofte som et utgangspunkt? | Først SV-035 | Delvis: funds | Kø | Ikke opprettet |
| 65 | SV-037 | Hva er et aktivt forvaltet fond? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 66 | SV-038 | Kan aktive fond forsvare høyere kostnader? | Først SV-035, SV-037, SV-039 | Ikke kontrollert | Kø | Ikke opprettet |
| 67 | SV-039 | Hva er forvaltningshonorar? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 68 | SV-040 | Hvordan vurderer jeg samlede kostnader i et indeksfond? | Først SV-039 | Ikke kontrollert | Kø | Ikke opprettet |
| 69 | SV-041 | Hva er en ETF, eller et børshandlet fond? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 70 | SV-042 | Hva er forskjellen på en aksje og et aksjefond? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 71 | SV-043 | Hvordan begynner jeg å kjøpe enkeltaksjer? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 72 | SV-044 | Hva betyr kurtasje? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 73 | SV-045 | Hvor lite kan jeg begynne å investere med? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 74 | SV-046 | Bør jeg investere et større beløp med én gang eller over tid? | Først SV-017, SV-035 | Ikke kontrollert | Kø | Ikke opprettet |
| 75 | SV-047 | Hva betyr det å time markedet? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 76 | SV-048 | Hva gjør jeg med fondene mine ved et børskrakk? | Ingen registrert | Delvis: funds | Kø | Ikke opprettet |
| 77 | SV-049 | Bør jeg selge fond når børsen går ned? | Se også SV-048; behold som søkeinngang | Delvis: funds | Kø | Ikke opprettet |
| 78 | SV-050 | Hva er utbytteaksjer? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 79 | SV-051 | Må jeg betale skatt av aksjeutbytte? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 80 | SV-052 | Hva er skjermingsfradrag? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 81 | SV-053 | Hvordan beregnes skjermingsfradraget i praksis? | Først SV-052 | Ikke kontrollert | Kø | Ikke opprettet |
| 82 | SV-054 | Hva betyr ESG og grønne investeringer? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 83 | SV-055 | Hva er risikoen ved å ha kryptovaluta i porteføljen? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 84 | SV-056 | Hvordan skattlegges kryptovaluta i Norge? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 85 | SV-057 | Hva bør jeg kontrollere om aksjer og fond i skattemeldingen? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 86 | SV-058 | Hva er risikoen i fremvoksende markeder? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 87 | SV-059 | Bør jeg valutasikre globale fond? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 88 | SV-060 | Hva er forskjellen på vekstaksjer og verdiaksjer? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 89 | SV-061 | Hva er et rentefond? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 90 | SV-062 | Hva er forskjellen på likviditetsfond og høyrentefond? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 91 | SV-063 | Når kan rentefond passe framfor bankinnskudd? | Først SV-008, SV-010, SV-061, SV-062 | Ikke kontrollert | Kø | Ikke opprettet |
| 92 | SV-064 | Kan rentefond dempe risikoen i porteføljen? | Først SV-061, SV-062 | Ikke kontrollert | Kø | Ikke opprettet |
| 93 | SV-065 | Hva er et kombinasjonsfond? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 94 | SV-066 | Kan jeg flytte ASK til en annen tilbyder? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 95 | SV-067 | Hva koster det å flytte ASK? | Først SV-066 | Ikke kontrollert | Kø | Ikke opprettet |
| 96 | SV-068 | Hva skjer med investeringene hvis banken eller megleren går konkurs? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 97 | SV-069 | Kan jeg ha unoterte aksjer på ASK? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 98 | SV-070 | Hva er folkeinvestering, og hvilke risikoer har det? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 99 | SV-071 | Hvor mye pensjon ligger jeg an til å få? | Først SV-072, SV-073, SV-077 | Ikke kontrollert | Kø | Ikke opprettet |
| 100 | SV-072 | Hvordan sjekker jeg pensjonen min hos Nav og Norsk Pensjon? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 101 | SV-073 | Hva er alderspensjon fra folketrygden? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 102 | SV-074 | Hva betyr pensjonsopptjening og pensjonsbeholdning? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 103 | SV-075 | Hva er omsorgsopptjening ved omsorg for små barn? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 104 | SV-076 | Får jeg pensjonsopptjening som student? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 105 | SV-077 | Hva er tjenestepensjon? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 106 | SV-078 | Hva er forskjellen på innskudds- og ytelsespensjon? | Først SV-077 | Ikke kontrollert | Kø | Ikke opprettet |
| 107 | SV-079 | Hva må arbeidsgiver minst spare til pensjon for meg? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 108 | SV-080 | Hvordan vurderer jeg arbeidsgiverens pensjonsordning? | Først SV-077, SV-079 | Ikke kontrollert | Kø | Ikke opprettet |
| 109 | SV-085 | Bør jeg endre aksjeandelen i tjenestepensjonen? | Ingen registrert | Delvis: pension | Kø | Ikke opprettet |
| 110 | SV-086 | Når bør jeg vurdere lavere aksjeandel før pensjonsuttak? | Først SV-085 | Delvis: pension | Kø | Ikke opprettet |
| 111 | SV-088 | Hvilke skattefordeler og skatteulemper har IPS? | Først SV-087 | Delvis: q-ips-ask | Kø | Ikke opprettet |
| 112 | SV-089 | Hvordan er IPS bundet, og hvilke unntak finnes? | Først SV-087 | Delvis: q-ips-ask | Kø | Ikke opprettet |
| 113 | SV-091 | Hvordan kan jeg spare til pensjon som selvstendig næringsdrivende? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 114 | SV-092 | Når er egen pensjonsordning aktuelt for frilansere? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 115 | SV-093 | Hva skjer med pensjonsopptjeningen hvis jeg blir ufør? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 116 | SV-094 | Hva er avtalefestet pensjon (AFP)? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 117 | SV-095 | Hvordan sjekker jeg AFP-tilknytning og egne vilkår? | Først SV-094 | Ikke kontrollert | Kø | Ikke opprettet |
| 118 | SV-096 | Kan jeg ta ut pensjon og fortsette i full jobb? | Først SV-073, SV-094 | Ikke kontrollert | Kø | Ikke opprettet |
| 119 | SV-097 | Hva skjer med pensjonssparingen hvis jeg dør før pensjonsalder? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 120 | SV-098 | Hva kan ektefelle eller barn arve av pensjonen? | Først SV-097 | Ikke kontrollert | Kø | Ikke opprettet |
| 121 | SV-099 | Hvordan skattlegges pensjon sammenlignet med lønn? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 122 | SV-100 | Hvordan kan jeg begynne å spare til pensjon etter fylte 50? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 123 | SV-107 | Hva er en fremtidsfullmakt, og når kan den være nyttig? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 124 | SV-108 | Hva menes med boligforsikring, og hvilke forsikringer må skilles? | Avklar boligkjøper-, boligselger-, hus- eller innboforsikring | Ikke kontrollert | Kø | Ikke opprettet |
| 125 | SV-109 | Hva er formuesskatt, og hvem omfattes? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 126 | SV-111 | Når er gevinst ved boligsalg skattefri? | Først SV-106; eiertid; botid; boligsalg etter 12 måneder | Ikke kontrollert | Kø | Ikke opprettet |
| 127 | SV-112 | Hvordan skattlegges renteinntekter? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 128 | SV-113 | Hva bør jeg sjekke i den forhåndsutfylte skattemeldingen? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 129 | SV-114 | Når kan livs-, uføre- eller kritisk sykdomsforsikring være aktuelt? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 130 | SV-115 | Hva dekker Nav ved sykdom og uførhet, og hva kan inntektsgapet bli? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 131 | SV-116 | Hvordan beskytter jeg meg mot svindel og ID-tyveri? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 132 | SV-117 | Hva bør jeg gjøre økonomisk ved samlivsbrudd eller skilsmisse? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 133 | SV-118 | Hva bør jeg gjøre økonomisk når en nærstående dør? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 134 | SV-119 | Hvordan fungerer arv, testament og uskifte? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 135 | SV-120 | Hva bør jeg sjekke om skatt ved min første lønn? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 136 | SV-121 | Hvordan planlegger jeg uttak av egen sparing som pensjonist? | Først SV-071 | Ikke kontrollert | Kø | Ikke opprettet |
| 137 | SV-123 | Hvordan vurderer jeg bærekraftige fond og grønnvasking? | Først SV-035, SV-054 | Ikke kontrollert | Kø | Ikke opprettet |
| 138 | SV-124 | Hva innebærer investering i gull? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 139 | SV-125 | Hva er eiendomsfond? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 140 | SV-126 | Hva er en obligasjon? | Ingen registrert | Ikke kontrollert | Kø | Ikke opprettet |
| 141 | SV-127 | Hva er risikoen ved å låne for å kjøpe aksjer eller fond? | Først SV-017 | Ikke kontrollert | Kø | Ikke opprettet |
| 142 | SV-128 | Hva innebærer investering i utleiebolig eller eiendom sammen med andre? | Avklar hva boligsameie betyr i spørsmålet | Ikke kontrollert | Kø | Ikke opprettet |
| 143 | SV-129 | Hva må jeg regne på for å bli økonomisk uavhengig eller pensjonere meg tidlig (FIRE)? | Først SV-121 | Ikke kontrollert | Kø | Ikke opprettet |
| 144 | SV-130 | Hva er forskjellen på brutto og netto pensjon? | Først SV-071, SV-099 | Ikke kontrollert | Kø | Ikke opprettet |
| 145 | SV-131 | Hva skjer med pensjonsrettigheter ved samlivsbrudd eller skilsmisse? | Først SV-077 | Ikke kontrollert | Kø | Ikke opprettet |
| 146 | SV-137 | Bør egenkapital til et nært boligkjøp stå på konto eller i fond? | Først SV-008, SV-035 | Delvis: bsu / funds | Kø | Ikke opprettet |
| 147 | SV-138 | Når får jeg fradrag for tap på ASK eller fondskonto? | Først SV-031, SV-122 | Delvis: q-ask-zero | Kø | Ikke opprettet |
| 148 | SV-139 | Hvorfor kan et globalt fond være tillatt på ASK når direkte amerikanske aksjer ikke er det? | Først SV-031, SV-035 | Delvis: q-ask-zero | Kø | Ikke opprettet |
| 149 | SV-140 | Hva er forskjellen på et fond og kontoen fondet ligger på? | Først SV-017, SV-031, SV-122 | Delvis: q-ask-zero | Kø | Ikke opprettet |

## Ferdig før et svar kan foreslås til senere innholdsfase

Et utkast må svare på et avgrenset spørsmål, forklare nødvendige grunnbegreper, ha etterprøvbare kilder med faktisk kontrolldato og regelår, skille fakta fra eksempler og vise vesentlige unntak. Konkrete angrepsflater og korrektur følger utkastet. Sammenligning er bare én mulig svarform. Grunnforklaringer skal ikke tvinges inn i to kunstige alternativer.

Integrasjon i nettsted, søkeord, treffkontroll, brukerforståelse og tilgjengelighet er egne oppgaver i den aktuelle fasen. En ren researchøkt kaller ikke et svar «ferdig publisert» eller hevder at søket virker uten utført test.

## Overlevering

Den opprinnelige startrekkefølgen var SV-031 og SV-035. ASK- og fondskontoforklaringer finnes nå på main etter #61. Neste kjøring må først oppdatere dekningen mot faktisk kode, og gjenbruke de eksisterende svarene. De prøver grunnforklaringer som flere senere sammenligninger trenger. Les aktuell dekning før du skriver. Fortsett deretter i køen, og forklar avvik i loggen. Bolig/lån prioriteres tidlig uten at vi åpner for nye kalkulatorfunksjoner.

Køen kan utvides med faktiske brukerspørsmål. Oppgi hvor spørsmålet kommer fra uten å lagre personopplysninger eller brukerens private økonomi.
