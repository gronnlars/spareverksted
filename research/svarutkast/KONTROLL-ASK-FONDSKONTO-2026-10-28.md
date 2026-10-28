# Delkontroll: ASK og fondskonto, 28. oktober 2026

Upublisert kontrollnotat fra ChatGPT/Codex. Egenkontroll, ikke uavhengig fagkontroll eller juridisk vurdering. Eksisterende svar undersøkes, ingen nye svar innføres.

## Grunnlag og faktisk versjon

Lest main-commit: `00d8f1536802b69eebf05a1034f388bd87550d9f`. PR #90 er sammenslått og inngår i denne commiten. Alle obligatoriske prosjektregler og Aktive avvik er lest. PR #72 videreføres. Åpne #91 og #92 gjelder begrepsregister og grafbeskrivelse, ikke disse svarenes fagtekst. Ingen nye funksjoner eller konkurrerende kø opprettes.

Hentet fra spareverksted.no 28.10.2026:

| Fil | Git blob-SHA av HTTP-respons | Samsvar med lest main |
| --- | --- | --- |
| veileder-knowledge.js | baa420596e669867e7c565a99fefb1464032ac7b | Identiske bytes |
| veileder-facts.js | e4121dc8c3fa7f21d4b8fe2b97471830e50f34a3 | Identiske bytes |
| veileder-ui.js | ea98a347661679b943f84f2b7dbdce975a265aa4 | Identiske bytes |

Dette er kontroll av publiserte filer, hverken nettlesertest eller bekreftelse av hele nettstedets versjon. Motor og kortbygger er undersøkt fra repoet. Ingen skjermleser- eller forståelsestest.

| Kø-ID / svar-ID | Plassering | Lagret kontrolldato | Regelår og neste kontroll på nettstedet | Status i denne økten |
| --- | --- | --- | --- | --- |
| SV-031 / q-aksjesparekonto | dist/veileder-knowledge.js:117 | 24.10.2026 | Intet uttrykkelig regelår eller neste frist i svaret | Avgrenset ny kildekontroll, forbehold nedenfor |
| SV-122 / q-fondskonto | dist/veileder-knowledge.js:134 | 24.10.2026 | Henviser til 2025-rettledning, ingen neste frist | Konkrete funn klargjort, produktomtale ikke nykontrollert |

Lesedatoen 28.10.2026 endrer ikke nettstedets lagrede dato. Publiseringsdato for de to svarversjonene er ikke fastslått her.

## Kilder faktisk lest i økten

Alle er Skatteetatens egen veiledning, nivå 1 og primærkilde for etatens forklaring. Lovtekst er ikke selv lest. Ingen lavere kilde erstatter den norske myndighetsveiledningen. Produktpåstander holdes utenfor denne delkontrollen.

| Kilde | Kildedato / regelår | Konkret støtte og avgrensning |
| --- | --- | --- |
| [Aksjesparekonto (ASK)](https://www.skatteetaten.no/person/skatt/hjelp-til-rett-skatt/aksjar-og-verdipapir/om/aksjesparekonto-ask/) | Ingen oppdateringsdato i lest hovedtekst. Omtaler også 2026. | Innskudd før skattepliktig gevinst, skjerming, verdipapirkrav, utbytte, tap ved opphør og personlig eierskap. Ingen ny skattesats tas inn. |
| [Fondskonto](https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/aksjer-og-verdipapirer/om/skatteregler-investere-i-aksjer-og-andre-verdipapirer-gjennom-kapitalforsikring-fondskonto) | Ingen oppdateringsdato i hovedteksten. Satsavsnittet gjelder 2023 til 2025. | Eierskap, risiko og forholdsmessige uttak. Satser herfra generaliseres ikke til 2026. |
| [Rettledning for utfylling og innlevering av tredjepartsopplysninger for Fondskonto](https://www.skatteetaten.no/nn/bedrift-og-organisasjon/rapportering-og-bransjar/tredjepartsopplysninger/bank-finans-og-forsikring/fondskonto/rettledning/) | Ingen revisjonsdato i åpnet hovedtekst. Oppgir inntektsåret 2026 og senere. | Avgrensningen til lite forsikringselement og uten garantert avkastning, samt uttak og skjerming. Søkeuttrekket viste en eldre 2025-versjon. Fulltekst prioriteres. |

Også den eksisterende `/en/business-and-organisation/reporting-and-industries/third-part-data/bank-finans-og-forsikring/fondskonto/rettledning/` er åpnet. Den viser norsk fagtekst med beskjed om at engelsk ikke er tilgjengelig. Den tidligere rapportens konstatering av et språkbrudd ut fra URL-en trekkes derfor tilbake. En norsk navigasjonsadresse er funnet, men nettstedets lenke er ikke endret.

Neste kontroll for denne leveransen: før eventuell retting foreslås til integrasjon og senest før 01.01.2027, med budsjettvedtak og aktive avvik i K7-runden. Det er ikke dokumentert en fullført kontrollrunde etter statsbudsjettet i de leste loggene. Dette er en dokumentasjonsmangel, ikke bevis for at ingen kontroll er gjort andre steder. Ikke åpne ordinært nytt innhold før den samlede gjennomgangen er dokumentert.

## Funn og avgrensede rettelsesforslag

1. **Faktisk forbeholdsmangel, q-fondskonto:** Skatteavsnittene avgrenser ikke tydelig mot garantert avkastning. Det brede spørsmålet «Hva er kapitalforsikring?» fører dessuten direkte til svaret. Forslag til tillegg ved skatteforklaringen: «Skattereglene som forklares her, gjelder kapitalforsikring med lite forsikringselement og uten garantert avkastning.» Begrepsdefinisjonen kan beholdes. Dette er ikke en konklusjon om lovbrudd.
2. **Dokumentasjon, q-fondskonto:** Forbeholdet beskriver rettledningen som revidert oktober 2025 og gjeldende fra 2025. Det samsvarer ikke med den nå åpnete rettledningen. Historisk lesedato 24.10 beholdes som historikk. Ved senere retting registreres den faktisk leste versjonen og ny lesedato, uten å finne på en revisjonsdato.
3. **Presisjon, q-aksjesparekonto:** Innledningen sier at skatten kommer når uttak overstiger innskuddet. Skjerming forklares først senere. Forslag til kort presisering: «Uttak utover gjenværende innskudd kan skattlegges, etter fradrag for eventuell skjerming.» Presiseringen bør stå i kortsvaret, slik at dette får samme forbehold som fordypningen.
4. **Presisjon, q-aksjesparekonto:** Fordypningen nevner laveste innskuddsbeholdning, men ikke at ubenyttet skjerming inngår i grunnlaget. Dette er en ufullstendig forklaring, ikke dokumentert feil i eksempelet. Foreslå å føye til «med tillegg av ubenyttet skjerming fra tidligere år» etter kontroll av hele avsnittet.
5. **Manglende dokumentasjon:** Ingen individuell neste kontrollfrist i disse to svarene. Renderer viser lagret kontrolldato og forbehold, men har ingen separat publiseringsdato eller regelårsvisning. Kildedato og faktisk lesedato må holdes fra hverandre. Ingen implementering foreslås her.

ASK-eksempelet og fondskontoeksempelets forholdstall stemmer ved egen kontroll. Nordnet, Investeringskonto Zero, selskapsnavn, stemmerett, forsikringsutbetaling og produktvilkår er hverken omskrevet eller nykontrollert. De står som åpne produktpåstander, ikke godkjente funn. At myndighetskilden støtter kontotypen, godkjenner ikke tilbyderens egne vilkår.

## Regneforutsetninger og søkeprøve

Node-kontroll av egne illustrasjoner: 150 000 minus 100 000 gir 50 000 kroner. Ved uttak på 30 000 kroner fra fondskonto gir 30 000 × 100 000 / 150 000 = 20 000 kroner tilbakebetalt innskudd og 10 000 kroner gevinst før skjerming. Ingen skattesum er beregnet. Beløpene forutsetter at innskuddet ikke tidligere er redusert ved uttak. Tidsforløp, innbetalingstidspunkt, rentetilskriving og avkastningsrate er ikke modellert. Inflasjon og kostnader er utelatt. Dette bør oppgis ved en senere presisering av eksemplene.

Faktisk utført mot uendret main i Node, ikke i nettleseren:

| Søk | Resultat | Vurdering |
| --- | --- | --- |
| Hva er ASK? | q-aksjesparekonto | Forventet |
| Hva er fondskonto? | q-fondskonto | Forventet |
| Hva er kapitalforsikring? | q-fondskonto | Krever tydelig avgrensning av skatteforklaringen |
| ASK eller fondskonto? | q-ask-zero | Forventet sammenligning, ikke nykontrollert svar |
| kan vi eie ASK sammen | q-aksjesparekonto | Innholdet dekker spørsmålet |
| hva er en garantert kapitalforsikring | q-fondskonto | For bredt direkte treff for skatteforklaringen som står der |
| hvilken konto bør jeg velge | Ingen svar | Ingen oppdiktet kontoanbefaling |
| flytte strømavtale | Ingen svar | Ingen irrelevant kontoforklaring |

Kortbyggeren gir samme intro og fordypning for begge svarene med tom profil og med alder 70, sparetid 1 år, dyr gjeld og manglende buffer. Koden returnerer begrepssvar før generelle profilmerknader. Dette er kontroll av disse to profiltilfellene, ikke en generell attest for all tilpasning på siden.

## Premiss, anbefalingspreg og angrepsflater

Premiss: En kapitalforsikring og fondskontoens særlige skatteregler er ikke uten videre samme avgrensning. Funn 1 må løses før svaret omtales som dekkende for det brede spørsmålet.

Mulig oppfattet anbefaling: ASK-svaret gir hovedsakelig en forklaring. Fondskontosvaret inneholder oppfordringer om å lese vilkår og sjekke kostnader. De er generelle kontrollhandlinger, men skal vurderes etter den nye grensen mot handlingsanbefalinger. Produktomtalen har egen sperre og står urørt. Ingen individuell egnethet er vurdert.

| Angrepsflate | Reparasjon før eventuell integrasjon |
| --- | --- |
| Alle kapitalforsikringer får samme skatteregler | Avgrens kortsvaret og prøv det negative tilfellet om garanti |
| Innskuddet kan alltid tas ut på nytt | Presiser gjenværende innskudd og at eksemplet starter uten tidligere uttak |
| Hele gevinstdelen må nødvendigvis skattlegges | Behold skjerming ved uttak og i kortforklaringen |
| En gammel kildebeskrivelse blir ny ved å endre kontrolldato | Oppgi faktisk kildeversjon, og behold tidligere dato som historikk |
| Produktomtalen anses kontrollert sammen med skattereglene | Merk de konkrete produktpåstandene som fortsatt åpne |

Korrektur: ASK, fondskonto, kroner og prosent er skilt. Ingen satsforespørsel besvares med gamle satser. Regnestykkene stemmer. Ingen kilde er kalt lovtekst. Egenkontroll er ikke uavhengig kontroll. Mobil, tastatur, skjermleser, forståelse og full regresjonskontroll er ikke utført. Ingen UU-feil konstateres ut fra denne kildekontrollen.

## Neste del

Fortsett med q-bsu-basics og q-ips-ask, særlig 2026-grenser, kildedatoer, kildeattribuerte råd og allerede eksisterende tilpasning. Full kartlegging av de øvrige svarenes påstander og kildefrister gjenstår. Den tidligere samlingen av ni begrepsutkast er tilgjengelig i Library, fil `libfile_5a427db66dd88191b78c836b3d24c9a3`, og er ikke erstattet eller godkjent her. Ingen nye begrepstekster er produsert.
