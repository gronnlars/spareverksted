# Daglig arbeid med spørsmålkøen

Opprettet 24. oktober 2026. Kan utføres av ChatGPT/Codex eller Claude.

## Oppdrag og grense

Gjør en liten, etterprøvbar del av [spørsmålkøen](../SPORSMALSKO.md). Normalt to spørsmål per kjøring, ett ved kompliserte regler og høyst tre hvis de henger tett sammen. Kvalitet veier mer enn antall. Hele køen er en arbeidsliste, ikke en bestilling om å skrive alle svar nå.

**Denne daglige oppgaven gjelder fortsatt bare research og forberedelse. Kontrollert innholdspåfyll er et separat oppdrag etter faseplanens punkt 6.** Du kan opprette og oppdatere dokumentasjon i en egen gren og PR. Ikke endre `dist/`, beregninger, søkelogikk, nettsidens svarbase, tester, hosting eller arbeidsflyter. Ikke slå sammen til main, starte publiserings-Actions eller be Lars kjøre Action. En kvalitetsstatus i køen gir ingen fullmakt til integrasjon eller publisering.

## Før du begynner

1. Hent fersk main fra `gronnlars/spareverksted`. Les `BESLUTNINGER.md`, `CONTRIBUTING.md`, eventuelle `AGENTS.md` og gjeldende språkregler. Arbeidsregler og språkregler leses fra main. Ikke anta at en usammenslått gren er publisert.
2. Les køen, denne instruksen, siste arbeidslogg og åpne PR-er. Main er autoritativt arbeidsgrunnlag. Ikke opprett en ny parallell kø.
3. Kontroller at køen du skal endre bygger på siste fjernversjon. Ikke overskriv en annen agents arbeid eller lokale endringer. Oppgi lest main-SHA i loggen.
4. Se etter pågående arbeid. Ved en aktiv reservasjon: velg andre spørsmål. Hvis den felles grenen ikke kan oppdateres trygt, ikke start konkurrerende arbeid på samme ID-er. Bruk egen dokumentasjonsgren og rapporter hindringen.

## Velg dagens leveranse

- Rett dokumenterte feil og utløpte faktapåstander før nye emner. Feil i nettstedet rapporteres med fil, sted og konsekvens; denne oppgaven åpner ikke kodearbeid.
- Velg øverste uferdige og ureserverte spørsmål i køen. Gjør nødvendige grunnbegreper før sammenligninger. Bolig og lån har høy prioritet blant nye hull, men dette åpner ikke fase 5 eller en lånekalkulator.
- Kontroller dekning i faktisk kode. Skill innhold som finnes, innhold som er fagkontrollert og søk som faktisk er testet. Et tematreff er ikke bevis på at spørsmålet besvares.
- Slå sammen overlapp uten å miste brukerens formuleringer eller opprinnelige nummer. Bruk `Se SV-xxx` for duplikater, og behold ID-ene.
- Reserver valgte ID-er i arbeidsloggen med aktør, starttid, gren og utløp senest fire timer senere. Push reservasjonen før research dersom skrivetilgang finnes. Forny bare hvis du faktisk fortsetter. Kontroller fjernloggen igjen etter push; ved kollisjon lar den sist påbegynte kjøringen de overlappende ID-ene ligge. Utløp betyr ikke at arbeidet er ferdig, les gren/PR først.

## Undersøk og skriv

1. Les aktuelle primærkilder ved hver ny faktakontroll. Bruk relevante sider fra Skatteetaten, Nav, Lånekassen, Finanstilsynet, Finansdepartementet, Kartverket, Statsforvalteren, Altinn, Brønnøysundregistrene eller lov/forskrift. Bruk tilbydervilkår for produktfakta og merk kommersielle kilder. Kildeorganisasjonen er ikke i seg selv nok; kontroller den konkrete påstanden.
2. Registrer URL, sidetittel, faktisk lesedato, regelår, påstand kilden støtter og vesentlige unntak. Skill vedtatte regler fra forslag og kjente fakta fra egne eksempler. Ikke kopier dato eller satser fra gammel research som om de var kontrollert i dag. Ved utilgjengelig kilde: marker hva som mangler og stopp den berørte konklusjonen.
3. Lag eller oppdater `research/svarutkast/SV-xxx.md` etter malen under. Gjenbruk kilder og beslektede utkast med lenker. Ikke lag et kunstig valg eller like lange fordeler/ulemper for å fylle malen. Et grunnbegrep trenger ofte forklaring og eksempel framfor to kort.
4. Skriv kort svar først, med nødvendig forbehold der det endrer meningen. Bruk fordeler og ulemper når spørsmålet gjelder et valg. Forklar nye fagord og henvis til relevante grunnbegreper. Ikke anta alder, bolig, barn, inntekt eller andre brukerforhold. Personalisering beskrives som betingede regler, ikke ny kode.
5. Kontroller angrepsflater: minst tre konkrete feiltolkninger med reparasjon, deretter navn, tall, enheter, forutsetninger, datoer og språk. Unngå tankestrek, tre prikker og oppdiktet søkevolum. Bruk «hverken» og «renters rente».
6. Gjør en egen kontrollrunde mot kildene. Merk selvkontroll som selvkontroll. Ikke kall det uavhengig kontroll. Et annet verktøy eller en annen agent kan senere overta; denne instruksen krever ikke samtidig agentarbeid.

Særlige faggrenser: Konto er ikke investering. Zero er et produktnavn, ikke et generelt navn på alle fondskontoer. AS/ENK må skille utsatt skatt fra spart skatt, selskapets skatt fra eierens skatt og ta med uttak og administrasjon. Boligsalg krever presis eier- og botid. Pensjonsordninger må skilles før regler om uttak, arv og AFP beskrives. Ikke gi én universell trygg uttaksrate eller garanti om avkastning.

## Ferdig leveranse per kjøring

- Ett eller to kildebelagte, upubliserte svarutkast, eller en dokumentert avklaring som viser hvorfor et svar må vente.
- Oppdatert dekning, arbeidsstatus, lenke og kontrolldato for berørte ID-er. Ikke sett kildedato for et spørsmål som bare er sortert.
- En kort rad i `research/ARBEIDSLOGG.md`: dato/tid i Europe/Oslo, aktør, main-SHA, ID-er, konkret endring, kontroll, hindring og anbefalt neste steg. Avslutt reservasjonen.
- Commit og push kun dokumentasjonsfilene til felles dokumentasjonsgren, og opprett eller oppdater én PR. Hent siste fjernversjon før push. Ingen tvungen push. Hvis main har endret seg, les relevante endringer før du fortsetter; ikke løs konflikter ved å forkaste andres arbeid.
- Kontroller diff, interne lenker, ID-er og at ingen filer utenfor dokumentasjonsomfanget er endret. Rene dokumentasjonsendringer trenger ikke kalkulator- eller nettlesertester. Oppgi nøyaktig hva du kontrollerte. Registrer eventuell automatisk CI separat; ikke start eller omstart publisering.
- Gi Lars kort status: ID-er/tema, resultat, kilde-/regelår, hva som fortsatt er uavklart og PR-lenke. Si at ingenting er lagt inn på nettsiden. Hvis tilgang svikter, lever det konkrete utkastet der det er mulig og oppgi feilen. Ett kontrollert nytt forsøk ved en midlertidig feil er nok; ikke omgå sperrer.

## Mal for et svarutkast

```markdown
# SV-xxx: Spørsmålet

Upublisert utkast. Arbeidsstatus: Utkast.
Lest main: <SHA>. Forfatter/verktøy: <navn>. Dato: <dato>.
Dekning: <fil, svar-ID, hva som finnes og hva som mangler>.
Avhenger av: <ID-er eller ingen>. Alternative formuleringer: <liste>.

## Kort svar
<Svar først. Viktigste forbehold.>

## Forklaring eller sammenligning
<Konsekvenser, fordeler/ulemper der det passer, hvem det passer dårlig for.>

## Eksempel og fordypning
<Frivillig. Tydelige forutsetninger. Skill eksempeltall fra faktiske satser.>

## Kilder og faktakontroll
| Påstand | Primærkilde og tittel | Regelår | Lest dato | Unntak/usikkerhet |
| --- | --- | --- | --- | --- |

## Angrepsflater og reparasjoner
<Minst tre konkrete feiltolkninger og hvordan teksten forebygger dem.>

## Korrektur og overlevering
<Navn, tall, språk. Hva ble kontrollert? Hva gjenstår? Neste anbefalte oppgave.>
```

## Kjør manuelt hos ChatGPT eller Claude

Lim inn dette som oppdrag:

> Arbeid i gronnlars/spareverksted. Les SPORSMALSKO.md, research/DAGLIG-OPPGAVE.md og siste research/ARBEIDSLOGG.md fra fersk main. Følg prosjektreglene. Gjør neste avgrensede leveranse i køen, normalt to spørsmål. Fortsett andres utkast når det er riktig framfor å lage duplikater. Lever kildebelagt upublisert research, oppdatert kø og logg i dokumentasjonsgrenen og PR. Ikke endre nettsiden, kalkulatoren eller svarbasen, slå sammen eller publiser. Rapporter konkret resultat og hindringer.

## Nattkjøring

Planlagt ChatGPT-kjøring starter daglig kl. 02.00 i `Europe/Oslo`, med ønske om hovedarbeid mellom 02 og 04. Dette er én avgrenset kjøring, ikke to timers garantert kontinuerlig arbeid. Samme instruks kan startes manuelt hos Claude; ChatGPT-planen starter ikke Claude. Følg reservasjonene for å unngå dobbeltarbeid.
