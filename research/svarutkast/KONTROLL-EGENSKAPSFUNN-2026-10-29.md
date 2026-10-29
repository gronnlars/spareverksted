# To kildefunn fra egenskapsprøven

29.10.2026. ChatGPT/Codex, egenkontroll. Base main `29344dc343448e2d9ec5d7beadc12b0cbe21bf7a`. Lars ga uttrykkelig klarsignal til oppfølging i samtalen. Egen avgrenset rettings-PR. Ingen sammenslåing eller publisering.

## Hva som rettes

- ASK: «Bare personlige skattytere» manglet EØS-bosted ved opprettelse. Ny tekst: «Personlige skattytere bosatt i EØS kan opprette ASK.» Dette gjelder opprettelse, ikke et automatisk krav om å avslutte eldre konto ved senere utflytting. Utflyttingsskatt er fortsatt utenfor svarets omfang.
- BSU: Den generelle formuleringen om bruk til andre formål omfattet også årets innskudd. Skatte-ABC B-19-7.1 sier at årets innskudd kan tas ut før årsslutt uten brudd. Tilbakebetalingssetningen avgrenses til tidligere års innskudd. Renter og boligunntaket beholdes. Uttrykket «bundne BSU-midler» skiller påbegynt bruk fra lovlig tilbakeføring av årets innskudd.

## Kilder lest og kontrollert i arbeidsøkten

Alle under er lest 29.10.2026 av ChatGPT/Codex. Myndighetsveiledning, ikke direkte lest lovtekst. Lovdata lot seg ikke åpne (HTTP 405). Norsk versjon brukt.

| Svar | Kilde og dato/utgave | Kontroll |
| --- | --- | --- |
| ASK | [Hovedsiden](https://www.skatteetaten.no/person/skatt/hjelp-til-rett-skatt/aksjar-og-verdipapir/om/aksjesparekonto-ask/), udatert, regler for 2026 | Investeringer, EØS, over 80 prosent ved årets begynnelse og kvalifikasjon ved kjøp, gevinst/utbytte, innskudd først, opphør ved tapsfradrag, skjermingsgrunnlag, flytting, arv og gave. |
| ASK | [A-10-1 Generelt](https://www.skatteetaten.no/rettskilder/type/handboker/skatte-abc/gjeldende/a-10-aksjesparekonto/A-10.001/), Skatte-ABC 2025/2026 | EØS-bosted ved opprettelse. Ny kilde-ID tax-ask-opprette. Kilden skiller også opprettelse fra videreføring av eksisterende konto. |
| ASK | [A-10-9 Arv og gave](https://www.skatteetaten.no/nn/rettskjelder/type/handboker/skatte-abc/gjeldende/a-10-aksjesparekonto/A-10.030/), Skatte-ABC 2025/2026 | Hele kontoen ved gave, kontinuitet, fordeling ved dødsboskifte og ingen sameie. |
| ASK | [Gevinst, tap eller utbytte](https://www.skatteetaten.no/satser/faktor-for-oppjustering-av-gevinsttap-eller-utbytte-pa-aksjer/), regelår 2026 | 37,84 prosent. Eksempel: (150 000 − 100 000 − 5 000) × 0,3784 = 17 028 kr. |
| BSU | [Hovedsiden](https://www.skatteetaten.no/nn/person/skatt/hjelp-til-rett-skatt/bank-og-lan/bsu--bustadsparing-for-ungdom/), udatert | Alder, innskudd/renter, boligbruk, førstegangsbruk, kontoopprettelse, direkte flytting, tillegg i skatt og unntak for boligbrukt del. |
| BSU | [Satser 2026](https://www.skatteetaten.no/satser/fradrag-for-boligsparing-for-ungdom-bsu/?year=2026) | 10 prosent, 27 500 kr, 300 000 kr, boligeierskap helt/delvis, direkte/indirekte og primær-/sekundærbolig 31. desember. Maksfradrag kontrollregnet: 2 750 kr. |
| BSU | [Forskuddsutskrivingen 2026](https://www.skatteetaten.no/rettskilder/type/uttalelser/uttalelser/forskuddsutskrivingen-2026/), avgitt 15.12.2025 | BSU-satser og skillet mellom bolig og fritidsbolig. Kilden er datert, i motsetning til den gamle generelle kontrollteksten. |
| BSU | [B-19-7.1 Uttak](https://www.skatteetaten.no/rettskilder/type/handboker/skatte-abc/gjeldende/b-19-boligsparing-for-ungdom-bsu/B-19.034/B-19.035/), Skatte-ABC 2025/2026 | Uttak av årets innskudd før årsslutt er ikke brudd. Renter til og med året man fyller 33 er bundet. Ny kilde-ID tax-bsu-uttak. |
| BSU | [SSB tabell 11018](https://www.ssb.no/statbank/table/11018?sq=30128709), historisk periode januar 2018 til august 2026 | Statbankens skall åpnet, dataverdiene hentet direkte fra [SSBs API](https://data.ssb.no/api/v0/no/table/11018). Sektor 04b, innskuddstype 16 og 20, variabel Innskudd. Kildedatasettet oppgir oppdatert 2026-10-29T07:00:00Z. Alle 208 renteverdier samsvarer med repoets uttrekk. Eksisterende generator kontrollerer 18 årssnitt over 104 måneder. BSU-rente høyere i begge seriers årssnitt. Tabellen i svaret gjelder fortsatt den oppgitte perioden, ikke siste måned i datasettet. |

## Datoer og omfang

published beholdes. ASK og BSU får changed og checked 29.10.2026 etter gjennomgang av kildene og tallene. Tidligere kontroll av andre er historikk, ikke uavhengig kontroll av denne revisjonen. Fondskonto endres ikke. Ingen ny fradragspåstand, ingen nytt innskuddstak og ingen 2027-forslag legges i gjeldende svar. Ingen endring i profiltilpasning, søk, kalkulator eller design. Cacheversjonen for knowledge-filen økes i spor.html.

## Angrepsflater og korrektur

1. Bosted i EØS ved opprettelse betyr ikke at enhver utflytting avslutter kontoen. Reparer ved å beholde «opprette» og avgrensningen mot utflyttingsskatt.
2. Årets BSU-innskudd må ikke forveksles med tidligere innskudd eller bundne renter. Reparer ved å vise både unntaket og hva tilbakeføringen gjelder.
3. Lovlig uttak er ikke lik rett til fradrag for penger som ikke står innbetalt ved årsslutt. Årsskiftevilkåret i skattefordelen beholdes.
4. Skatte-ABC er myndighetsveiledning. Ingen påstand om at Lovdata eller en uavhengig fagperson har bekreftet revisjonen.

Navn, datoer og regnestykker kontrollert. BSU har 295 ord innhold, 365 med dokumentasjon. ASK har 484 ord innhold, 559 med dokumentasjon. Korte hovedsvar og eksisterende struktur beholdes. ASK overskrider redaksjonelt lengdemål på grunn av tidligere dokumenterte regler om gave, arv og flytting. Ingen fagvilkår kuttes for å tilfredsstille et ordmål.

## Utført og gjenstående validering

21 Node-testfiler kjørt. Én feilet først fordi kildetallet var hardkodet til tre. Etter oppdatering til de fire faktiske ASK-kildene består den også. Dato- og kildetall i eksisterende nettlesertester oppdateres til revisjonen. To kontrollpåstander i eksisterende kunnskapstest dekker bosted og uttaksunntak. Gaps-generatorens produktkontroll, BSU-generatorens kontroll og git diff --check består.

Lokal Chrome-visning er åpnet gjennom forhåndsvisningen. Rettet ASK-vilkår, BSU-unntak, kontrollhistorikk og nye kildelenker finnes i den gjengitte siden. Ingen endring i CSS. Mobilbredder 320/390 px, Firefox/WebKit og full tastatur- og skjermleserkontroll er ikke utført lokalt. PR må derfor kontrolleres før sammenslåing. Eksisterende CI har ASK/BSU-visningstester for 320/390/1280 px i Chromium, Firefox og WebKit. CI-status skal oppgis separat når den er kjent. Ingen påstand om at grønne tester beviser faglig riktighet eller full UU.

## Etterkontroll, 29.10.2026

Claude har lest diffen uavhengig av skribenten. ASK-hovedsiden nevner ikke bostedskravet, og A-10-1 lot seg ikke åpne i Claudes økt. Lars åpnet A-10-1 og bekreftet innledningen: sktl. § 10-21 gjelder personlig skattyter bosatt i EØS-området, bosted avgjøres etter landets internrett, og konto opprettet mens man bodde i EØS kan videreføres etter utflytting. Påstanden om opprettelse er dermed bekreftet mot kilden. Tre språkjusteringer i BSU-svaret, se arbeidsloggen. Ingen ny faktapåstand.
