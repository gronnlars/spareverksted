# Bidra til Spareverksted

Forslag, feilrapporter og pull requests er velkomne. Beskriv forventet resultat,
faktisk resultat og hvordan feilen kan gjenskapes. Bruk oppdiktede tall.

1. Fork prosjektet og opprett en egen gren.
2. Kjør lokalt som beskrevet i README.
3. Gjør en avgrenset endring og forklar hvordan den hjelper brukeren.
4. Kjør begge testfilene med Node.js.
5. Kontroller mobilvisning, tastaturbetjening og relevante eksportformater.
6. Åpne en pull request med endringen og kontrollene du har gjort.

Endringer i finansielle modeller må dokumentere forutsetningene og kontrolleres
mot uavhengige beregninger. Hold enkel modus lett å forstå og legg fordypning bak hjelp.
Nye originale bidrag tilbys under PolyForm Noncommercial 1.0.0 med
tilleggstillatelsen for personlig bruk og testing i LICENSE. Historisk
MIT-materiale og tredjepartsmateriale beholder sine vilkår. Oppgi opphav,
lisens og eventuelle endringer for materiale du gjenbruker, og opplys om
KI-verktøy som har bidratt. Ikke fjern andres opphavsrettsmerknader.
Send bare bidrag du har rett til å dele på disse vilkårene. En pull request
overfører ikke opphavsretten og gir ikke prosjektet rett til å tilby ditt
bidrag kommersielt uten din tillatelse.

## Overlevering mellom tråder, personer og verktøy

Vedtatt av Lars 24. oktober 2026 etter en ufullstendig instruks til Claude.
Gjelder alle som skriver oppdrag, også ChatGPT/Codex som arbeidsleder.

Anta at mottakeren ikke har lest noen av våre samtaler, andre tråder eller tidligere svar.
Den som overleverer oppgaven har ansvar for å ta med nødvendig kontekst.
Lars skal ikke måtte rekonstruere eller videresende manglende opplysninger.

Hvert oppdrag som skal kopieres eller sendes videre skal inneholde:

1. Mål og problem: hva brukeren opplever, faktisk resultat og ønsket resultat.
2. Arbeidsgrunnlag: repo, PR eller gren, kontrollert commit når tilgjengelig,
   relevante filer og regler. Skill bekreftet status fra eldre eller ukjent status.
   Be mottakeren kontrollere fersk status før endring.
3. Nødvendige beslutninger og begrunnelser. Ta med selve beslutningen,
   ikke bare at noe er «avklart med Lars».
4. Konkrete eksempler og testdata, skrevet fullt ut, med forventet resultat
   for hvert tilfelle. Ta med både feilen som skal rettes og nærliggende
   tilfeller som fortsatt skal fungere.
5. Avgrensning, avhengigheter og fullmakt: hva som kan endres, hva som skal
   bevares, og om oppgaven omfatter utkast, PR, sammenslåing eller publisering.
   Ikke utvid fullmakten ved overlevering.
6. Ferdigkriterier, relevante kontroller og ønsket leveranse.
   Skill utførte tester fra tester som mottakeren skal kjøre.

Ikke bruk «som over», «de fire spørsmålene», «samme regler som før» eller
tilsvarende som erstatning for nødvendig informasjon. Lenker til filer og
PR-er er nyttige arbeidsgrunnlag, men erstatter ikke konkrete testtilfeller,
beslutninger og avgrensninger som oppdraget avhenger av.
Hvis en ekstern fil må leses, oppgi nøyaktig fil/lenke og hva som må hentes derfra.
Ikke anta at mottakeren har tilgang; oppgi nødvendig innhold direkte hvis tilgang mangler.

Før overlevering: Les oppdraget alene, uten teksten rundt.
Kan mottakeren gjennomføre det og kontrollere resultatet uten å se vår tråd?
Hvis ikke, fyll inn det som mangler før Lars blir bedt om å videresende.

### Eksempel på fullstendige kontrolltilfeller

Ved retting av BSU-flytteregelen i #59 var følgende opplysninger nødvendige:

| Søk | Forventet resultat |
| --- | --- |
| jeg flytter | Skal ikke utløse BSU-hullet |
| hva koster flytting | Skal ikke utløse BSU-hullet |
| flytte strømavtale | Skal ikke utløse BSU-hullet |
| flytte til utlandet | Skal ikke utløse BSU-hullet |
| hva skjer med BSU hvis jeg flytter | Skal gi `uncovered` for BSU ved flytting |
| hvordan fungerer renters rente | Skal fortsatt gi `uncovered` selv uten ordinære tematreff |

Dette er et dokumentasjonseksempel fra hendelsen, ikke en påstand om
dagens kode eller en permanent regel om at disse svarene skal mangle.
Når innhold og søk endres, vurderes forventet resultat på nytt.

## Felles arbeidsgrunnlag

Les [AGENTS.md](AGENTS.md), [språkreglene](SPRAKREGLER.md), [beslutningene](BESLUTNINGER.md), [faseplanen](research/plan.md) og [kravene til universell utforming](research/universell-utforming.md) før arbeid. Dokumenter viktige nye valg og begrunnelser i beslutningsloggen samme dag. Bevar tidligere beslutninger med status når de erstattes.

[Spørsmålkøen](SPORSMALSKO.md) er eneste prioriterte kø. [Daglig oppgave](research/DAGLIG-OPPGAVE.md) gjelder upublisert research; [arbeidsloggen](research/ARBEIDSLOGG.md) brukes til reservasjoner og overlevering. Kontrollert innholdspåfyll følger faseplanens punkt 6. Valgomaten venter. Kalkulatorens frys gjelder fortsatt.

Ved arbeid med spørsmål og svar: les [SVARMAL.md](SVARMAL.md). Oppgi ønsket svarform og konkret visning i overleveringen. Den som integrerer, skal kontrollere den gjengitte siden og får ikke publiseringsfullmakt av at teksten er godkjent.
