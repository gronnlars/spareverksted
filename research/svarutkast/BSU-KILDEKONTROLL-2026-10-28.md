# BSU: godkjent samtaleutkast og integrasjon

Lars ba 28.10.2026 om å legge samtalens siste BSU-utkast inn i GitHub med kilder. Bidrag: ChatGPT/Codex. Egenkontroll, ingen uavhengig fagkontroll eller publiseringspåstand.

## Arbeidsgrunnlag og avgrensning

Main 1082c4f er lest. Bygger på PR #100, fix/sprak-og-svarmal ved f738529, for å gjenbruke den nøytrale svarformen og unngå konkurrerende omskriving av samme svar. Denne PR-en har #100-grenen som base. Retarget til main etter at #100 eventuelt er slått sammen. Ingen andre svar eller kalkulatorberegninger endret. Ingen sammenslåing bestilt.

Svar-ID q-bsu-basics, kind explainer, layout overview. Kort svar først, to fordeler, én ulempe, boligformål og konto/renter i fordypning. Ingen kunstig alternativkonto, ingen råd eller profilmerknader. Søkeinngangene og searchFamily bsu beholdes. Eksempel utelates fordi det bare ville gjenta fradraget. Eksisterende oversiktsmal får derfor vise svar uten eksempel; øvrige forklaringers krav beholdes.

## Kilder lest og påstander

PDF: «Bustadsparing for ungdom (BSU) - Skatteetaten», fire sider, utskrift 28.10.2026. Utskriftstid er ikke kildens oppdateringsdato. PDF-en angir ikke uttrykkelig regelår. Brukerens vedlegg er kildegrunnlaget, med opprinnelig URL i svarets kildeliste:
https://www.skatteetaten.no/nn/person/skatt/hjelp-til-rett-skatt/bank-og-lan/bsu--bustadsparing-for-ungdom/

| Påstand | PDF-side |
| --- | --- |
| Til og med 33 år, 27 500 årlig, 300 000 samlet innbetalt | 1 |
| Renter utenfor innskuddsgrenser, uttaksunntak for renter fra året man fyller 34 | 1 |
| 10 prosent, maksimalt 2 750, nok skatt, bankrapportering og innskudd innen årsslutt | 2 |
| Boligeierskap 31. desember og ingen nye innskudd etter bruk eller vilkårsbrudd | 2 |
| Egen fast bolig, kjøpskostnader, renter/avdrag og oppussing; ikke bare førstegangskjøp | 2–3 |
| Konto opprettes én gang, direkte bankoverføring ved flytting | 3 |
| Tilbakeføring av tidligere fradrag, med unntak for del brukt til boligkjøp etter vilkårene | 4 |

SSB: brukerens CSV 11018_20261028-202028.csv, uttrekk 28.10.2026. Husholdninger, BSU og kategorien «Bundne innskudd». Alle 104 sammenlignbare måneder fra januar 2018 til august 2026 har høyere BSU-rente. Tidligere måneder mangler BSU-tall. Ingen årsakspåstand om bankkonkurranse, ingen garanti om fremtidig rente eller enkeltbanker. Sammenlignbare rader er bevart i research/bsu-rentehistorikk-2026-10-28.csv. Lagret visning:
https://www.ssb.no/statbank/table/11018?sq=30128709
Automatisk oppdatering av lenken er opplyst av Lars, ikke teknisk kontrollert. Påstanden er derfor eksplisitt datert.

## Bevarte vilkår og åpne punkter

Skattefradrag, innskudd og renter holdes atskilt. «Må betale tilbake» erstatter det for svake «kan». Delvis riktig bruk gjelder her kjøp av fast bolig, slik PDF-en formulerer unntaket. Ingen påstand om at alle uttak alltid gir skatt uten tidligere fradrag.

Den godkjente teksten sier «ikke eie egen bolig». PDF-en forklarer ikke direkte/indirekte eller primær-/sekundærbolig. Detaljene om boligeierskap og fritidseiendom i #100 er derfor ikke gjengitt i dette utkastet. Satsiden i #100 er også lest under integrasjonen og bekrefter helt/delvis og direkte/indirekte eierskap, men den er ikke lagt inn som nytt grunnlag i brukerens PDF-baserte utkast. Presiseringen må avklares før publisering, og ikke kalles ferdig fagkontrollert. Regelåret bør også bekreftes før publisering.

## Kontrollstatus

Alle eksisterende Node-testfiler består lokalt. Testbevis for boligeierskap er oppdatert til den faktiske setningen, ikke svekket til bare et temanavn. Test om manglende utenlandsflyttingsdekning skiller nå ut den konkrete setningen om bankbytte; utenlandsflytting står fortsatt som udekket. Profiluavhengighet og uendrede søkeinnganger kontrolleres av svarmaltesten. Ingen identiske setninger innført.

Visningskontroll registreres i PR-en. Uavhengig fagkontroll, ekte iPhone og skjermleser gjenstår. Neste kildekontroll før 01.01.2027, ved regelendringer og ved nye SSB-tall for rentehistorikken. Dette notatet erstatter ikke den samlede kontrollrunden.


## Oppdatering etter Lars' bestilling om årstabell, 28.10.2026

Claudes vedlagte bsu-rente-arssnitt-2018-2026.csv er lagret i research. Alle 18 relevante årssnitt er kontrollregnet mot de 104 månedene med Decimal og to desimalers avrunding. Vanlig aritmetisk snitt av månedsrenter, ikke effektiv årlig avkastning eller vektet årsrente. Årene 2018 til 2025 har tolv måneder; 2026 har januar til august. Uttrekk 28.10.2026. Den tredje rentekolonnen beholdes i årsfilen, men vises ikke, for å prioritere lesbarhet på mobil.

scripts/generate-bsu-rates.py bygger dist/bsu-rates.js fra årsfilen og verifiserer den mot månedsfilen. Testen --check avslører både avvik i årssnitt og utdatert visningsfil. tests/bsu-rates.test.cjs kontrollregner i tillegg med heltallsaritmetikk i JavaScript og kontrollerer at den faktiske svaroppføringen bruker datasettet. Ingen årssnitt er skrevet inn manuelt i svarteksten. Tabellen har caption, kolonneoverskrifter med scope=col og årsoverskrifter med scope=row. Et generelt, lite tillegg til eksisterende avsnittsvisning støtter tabellen via part.table, uten innerHTML.

Fordelene har bestilt ny ordlyd. Boligvilkåret står én gang, med «alene eller sammen med andre». Skatteetatens satsside for 2026 er nå uttrykkelig bestilt som tilleggskilde og lest på nytt 28.10.2026:
https://www.skatteetaten.no/satser/fradrag-for-boligsparing-for-ungdom-bsu/?year=2026
Siden dokumenterer helt/delvis, direkte/indirekte eie av primær-/sekundærbolig, med borettslagsandel som eksempel. Den støtter også 27 500, 300 000 og 10 prosent for valgt år 2026. Ingen synlig oppdateringsdato. Den tidligere merknaden om at satssiden ikke inngår i grunnlaget er dermed historisk. Den detaljerte forklaringen av indirekte eie er fortsatt ikke skrevet inn i det bestilte kortsvaret.

«Hvert år siden 2018» viser til årssnittene i tabellen, med 2026 som uttrykkelig delår. SSBs kategorinavn er «Bundne innskudd», ikke «andre bundne innskudd». Ordet «andre» i den bestilte prosaen er ikke en egen SSB-serie og betyr ikke at BSU er trukket fra kategorien. Tabellen bruker kategorinavnet korrekt. Fremtidige renter er ikke lovet.

2026-raden og perioden skal oppdateres ved kildekontrollen før 1. januar 2027. Bruk nye månedstall fra samme SSB-serie, oppdater månedlig grunnlag og årsfil, regenerer visningsfilen og kjør testene. SSB-lenken alene endrer ikke den statiske tabellen. Samme kontroll må også oppdatere delårsmerkingen.

Alle lokale Node-testfiler og generatorens --check består etter oppdateringen. Nettleserprøven kontrollerer tabellsemantikk, ni rader, desimalkomma, kilder, tastatur og ingen vannrett rulling etter åpning ved 320/390/1280 px. Resultater fra faktisk nettleserkjøring føres i PR-en.
