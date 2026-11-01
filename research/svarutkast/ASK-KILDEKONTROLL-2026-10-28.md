# ASK: integrasjon og kildekontroll 28.10.2026

Lars bestilte ferdig innlegging og notat i PR. Arbeidet bygger på docs/svarstruktur-ask ved f1d00cd, som bygger på BSU-PR #101 og svarmal-PR #100. Ingen sammenslåing eller publisering er bestilt. Kun q-aksjesparekonto endres i svarbasen; id, keys, questions og words beholdes.

## Tekst og struktur

Tekstgrunnlag er Lars' siste fullstendige ASK-tekst i samtalen, med etterfølgende rettelser. Strukturfilen er veiledning, ikke en godkjenning av gammel ordlyd. Caveat utgår; risiko står i kortsvaret og avgrensning i review. Tre kilder beholdes. Den gamle skjermingskilden utgår fordi ASK-siden dekker påstandene.

Presiseringer: «Dette kan også gjelde selskaper på Oslo Børs», gjenværende innskudd og tidligere uttak av innskudd, skattemessig behandling av overføring fra vanlig verdipapirkonto, samt forklaring av hjemmehørende. Skjerming forklares ved første bruk, før regneeksemplet. Ingen nye tabeller eller visningsfunksjoner.

## Faktagrunnlag fra vedlagte PDF-er

- Aksjesparekonto (ASK) - Skatteetaten.pdf, side 1: personlige skattytere, skatteutsettelse, utbytte, innskudd og tapsfradrag ved opphør. Side 2: EØS, børsnotering, mer enn 80 prosent ved årets begynnelse, kontanter uten rente og flytting med forholdsmessig videreføring. Side 3: senere endrede vilkår. Side 4: skjerming. Side 5: overføring fra vanlig konto behandles som realisasjon fra 2020. Side 7–8: arv, gave, ikke sameie.
- Gevinst, tap eller utbytte på aksjer - Skatteetaten.pdf, side 1–2: 37,84 prosent og faktor 1,72. PDF har motstrid mellom valgt år 2026 og brødtekst/URL 2024. Satsen er derfor i tillegg bekreftet i nettsidens 2026-visning, og ASK-PDF side 1 oppgir uttrykkelig satsen for 2026. Publiseringslenken er etter Lars' ønske uten årsparameter; regelår står i tekst og lenketittel.
- A-10-9 Videreføring av aksjesparekonto etter reglene om skattemessig kontinuitet.pdf, side 1: gave av hele kontoen, arv, utlodning til arvingers ASK, forholdsmessig videreføring, ikke sameie og fordeling til flere egne ASK før gave. Utgave 2025/2026. Utskrift 28.10.2026 er ikke oppdateringsdato.

Kontroll: ChatGPT/Codex, egenkontroll. Ingen uavhengig fagkontroll eller godkjenning fra Skatteetaten erklæres. Avgrenset mot utflyttingsskatt, formuesskatt og utenlandsk kildeskatt. Ingen generell påstand om skattefritak ved gave uten kontinuitet. Neste kontroll før 01.01.2027 og ved regelendringer.

## Regneeksempel og lengde

(150 000 - 100 000 - 5 000) × 0,3784 = 17 028 kr. Forutsatt ingen tidligere uttak og 5 000 kr tilgjengelig skjerming. Valgte tall, ingen personlig skatteberegning.

Repoets ordteller: 482 ord i svaret, 566 med kildetitler og kontrolltekst. Dette er over målet på 300 ord. Begrunnelse: nødvendige vilkår og dekning av skjerming, flytting, arv og gave. Lars har ikke godkjent lengdeavviket; instruksen er å beholde teksten og varsle i PR, ikke kutte automatisk. Ordtelleren teller numeriske grupper, derfor avviker den fra enkel telling på mellomrom.

## Kontroller

Alle 20 lokale *.test.cjs-filer består, inkludert svarmal, svartekst og søk. Kontroll av søkeinnganger mot baseline består. Eksemplet kontrollregnes i test. Ingen identiske setninger på seks ord eller mer. ASK har et uttrykkelig dokumentert unntak fra den gamle testen om at alle svar må være kortere; øvrige svar beholder kravet. Nettlesertesten forventer nå tre kilder og kontrollerer også fullt åpnet svar uten vannrett rulling samt eksport av gjengitt HTML.

Lokal nettleserkjøring blokkert: Playwright-nettlesere mangler og nedlasting feiler. Visuell gjennomgang og W3C Nu-validering av gjengitt HTML er derfor ikke fullført lokalt. GitHub CI kjører svarmal og ASK i Chromium, Firefox og WebKit ved 320/390/1280 px, med skjermbilder. Faktisk CI-status følges i PR. Grønne tester betyr ikke full UU- eller brukerforståelseskontroll. Ingen fysisk iPhone- eller skjermleserkontroll utført.
