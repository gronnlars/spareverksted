# GAPS-utkast: leveranse 25. oktober 2026

**Oppdatert status for SV-022:** Se [revisjonskontrollen](SV-022-KONTROLL.md). DNB er tatt ut, kildene er åpnet på nytt, JSON er fasit og Markdown genereres. Den opprinnelige statusen nedenfor er historikk der den avviker fra revisjonskontrollen.

Lokal gren: `draft/gaps-2026-10-25`. Bygger på main `f9c553aa668fd0bf96ce14d6930f5ec02897abd6`. Ingen push, PR, merge eller publisering. Ingen filer i `dist/` er endret. Kalkulatoren er urørt.

## Utkast til gjennomlesning

1. [Renters rente, SV-022](SV-022.md). Gjenbruk av svaret fra [PR #65](https://github.com/gronnlars/spareverksted/pull/65), head `2385ddb3d9902dc9d0de1fd6aa2934c963ea4273`. Kortsvaret har fått tapsforbehold, og fordel/begrensning er gjort eksplisitt. Ingen konkurrerende implementering av #65.
2. [Skatt på barnesparing, SV-006/SV-007](SV-006.md). Hvem som skattlegges, inntektsår og sentrale unntak. Dette besvarer ikke hele køspørsmålet om beste barnesparing.
3. [BSU ved flytting, SV-135](SV-135.md). Skiller bank, bolig og utenlandsflytting. Utenlandsdelen er uavklart og sier «veit itte».
4. [Utbytte, SV-050/SV-051](SV-050.md). Begrep, utdeling fra fond, skjerming og ASK. Ingen skattesats eller anbefaling av utbytteaksjer.
5. [Rentefond, SV-061](SV-061.md). Typer, risiko, garanti og ASK-avgrensning. Ingen anbefalt plassering eller garantert avkastning.

Alle har kort svar, fordeler og ulemper eller begrensninger, eksempel, fordypning, kilder, faktisk lesedato, kildedato/regelår der tilgjengelig, angrepsflater og korrektur. Kildene er lest i denne økten. Selvkontroll er ikke uavhengig fagkontroll.

Maskinlesbart utkast: [gaps-2026-10-25.json](gaps-2026-10-25.json). Dette er testdata for en isolert søkeprøve, ikke del av nettstedets svarbase. Markdown-filene er lesbare gjennomganger av samme utkast. JSON er nå fasit, og Markdown genereres med `generer-gaps.py`. Bruk `--check` for å oppdage avvik.

## Undersøkt arbeidsgrunnlag

AGENTS.md, BESLUTNINGER.md og research/plan.md ble lest før språkregler og kø. Deretter ble evalueringsfilen forsøkt hentet. `research/SPAREVERKSTED-EVALUERING.md` finnes hverken på main eller i treet på gjennomgangsgrenen `origin/review-spareverksted-15379697258072798651`, head `d7e02fd683f696f76d577f61ec545e98e2ff174c`. Filen kunne derfor ikke leses. Ingen antatt evaluering er brukt som grunnlag.

CONTRIBUTING.md, SOK.md, daglig oppgave, arbeidslogg, tilgjengelighetskrav, søkekode, svarkort, svarbase og relevante tester er lest. Åpne PR-er er hentet fra GitHub. PR #65 og dens gren er kontrollert særskilt for å unngå duplisering av SV-022. PR #63 er allerede på main. PR #71 med foreslåtte kilderegler er lest fra `origin/docs/kilderegler`; den er ikke behandlet som sammenslått. Ingen aktiv reservasjon på main. Ingen fjernreservasjon er pushet, i tråd med Lars sitt uttrykkelige pushforbud.

## Faktisk kjørt

| Kontroll | Resultat |
| --- | --- |
| Alle `tests/*.test.cjs`, hver i egen Node-prosess | 15 filer bestått, 0 feil |
| `node research/sok-sluttkontroll/kjor.cjs . --detaljer` | 156 tilfeller; 0 WD. 115/115 prioriterte søk har relevant svar eller valg blant de tre første. Fire skjønnstilfeller står fortsatt som soft-mangler, som i basisen. |
| `node research/svarutkast/prov-gaps.cjs` | 35 søketilfeller bestått; alle fem utkast kan nås, og alle fem svarkort bygges med kilder og dato. |
| Samme prøve, sammenligning før/etter registrering | Fire av 156 historiske søk endres, alle innenfor bestilte hull. De øvrige 152 har identisk modus, treff og forslag. |
| Kontrollregning i utkastprøven | 10 000 kr med 5 % to ganger gir 11 025 kr. 10 % opp og 10 % ned gir 9 900 kr. Ingen bruk av kalkulatormotoren som fasit. |
| `git diff --check` | Ingen feil |

Søkeprøven registrerer utkastene i en egen Node-prosess med eksisterende `V.register`, `V.search` og svarkortbygger. GAPS i produktkoden blir stående. At de eksisterende testene består betyr derfor at dagens produktkode fortsatt består. Det er ikke en test av at innholdet allerede er integrert i nettstedet.

De fire historiske endringene i utkastprøven:

| Søk | Basis | Med utkast |
| --- | --- | --- |
| hva skjer med BSU hvis jeg flytter | uncovered | q-bsu-flytting, med eksplisitt uavklart utenlandsdel |
| hvordan fungerer renters rente | uncovered | q-renters-rente |
| aksjeutbytte | uncovered | Valg, q-utbytte først og funds som annet treff |
| hva er et rentefond | uncovered | q-rentefond |

«Rente fond» og «skatt på barne sparing» gir valg med riktig utkast blant de tre første. Skrivefeilene rentersrnete, rentefnod og utbytet gir forslag til riktig utkast. Generelle flyttesøk åpner ikke BSU-utkastet. Kjente hull er ikke erklært lukket i produksjonskoden.

Første utkastprøve stoppet fordi fire forklaringer manglet påkrevde begreper og eksempler. Dette ble fylt inn. Deretter feilet for strenge forventninger om direkte svar for de to særskrevne søkene over. Resultatet ble kontrollert og forventningen endret til relevant valg blant de tre første, slik søkereglene tillater. Ingen rangering eller algoritme ble endret for å få prøven grønn.

## Usikkert og ikke testet

- BSU ved utenlandsflytting er ikke tilstrekkelig avklart. Et bankbyttesvar skal ikke senere brukes som et fullstendig svar på dette. Ikke fjern hele GAPS-raden automatisk ved integrasjon.
- DNBs fagavsnitt om renters rente har ingen dokumentert egen kildedato. Datoen 7. oktober 2026 på sparekalkulatorsiden står ved markedsføring av fond, og er ikke tillagt fagavsnittet. Dette er en kildebegrensning etter foreslått K3. Avklar datert kilde før publisering; ingen godkjent regelunntak er antatt.
- Uavhengig fagkontroll er ikke utført. Ingen nye skattesatser er tatt fra eldre eksempler. Ingen forslag for 2027 brukes som gjeldende regler.
- Ingen nettleser-, mobil-, tastatur-, skjermleser- eller forståelsestest er kjørt i denne leveransen. Utkastene er ikke integrert i HTML-visningen. Senere integrasjon må kontrollere mobil, reflow, tastatur og kildelenker; iPhone Safari og VoiceOver gjør Lars.
- Søkeprøven dekker valgte formuleringer, ikke alle mulige spørsmål. Komplekse skatte-, utenlands- og nektingsspørsmål krever avgrensning før integrasjon. «Renters renet» fra #65 er ikke reparert i denne oppgaven.
- Ingen CI- eller publiseringsstatus er kontrollert som del av denne lokale leveransen. Tidligere PR-tester er ikke rapportert som nye egne kjøringer.

## Tekster som venter på godkjenning

[Fire søkemeldinger](TEKSTFORSLAG-SOK-2026-10-25.md): ingen treff, kjent hull, bare avvist tema og merknad ved delvis nekting. Ikke lagt inn i UI. Nektingsforslagene har egne forbehold som må kontrolleres mot faktisk kode før innlegging.

De fem svarutkastene venter også på faglig gjennomlesning og godkjenning før integrasjon og eventuell senere publisering. Lars har ikke godkjent push. Ingen endring av inflasjonsforutsetning, etter-skatt-visning, SSB-data, månedsstart, valgomat eller lånekalkulator inngår.
