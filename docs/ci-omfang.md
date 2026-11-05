# Avgrenset nettleserkontroll ved dokumentasjonsendringer

Forslag, 5. november 2026. ChatGPT/Codex, egenkontroll. Gjelder PR-kjøringer i static.yml. Ingen publisert kalkulatorkode eller tester for brukerreisene er endret.

## Hva som endres

En PR som bare endrer Markdown under docs/ eller de åtte styringsdokumentene angitt i scripts/ci-omfang.py, hopper over browser-jobben. Alle øvrige kontroller i checks går fortsatt, inkludert beregninger, kildegrunnmur, sikkerhet, lokal lagring, gammel-kode-vern, versjoner og HTML-validering.

Endring i dist, scripts, tests, kilder, research, workflows, ukjent rotfil eller annet format kjører hele nettleserrunden. Research er holdt utenfor fordi utkast kan inngå i genererte svar og tester. Ved blandede endringer kjører hele runden. Flytting ut av dokumentasjonsområdet kan ikke skjules som en navneendring. Ukjent sammenligningsgrunnlag og tom diff gir full nettleserrunde.

På push til main kjøres alltid hele nettleserrunden, også etter en dokumentasjons-PR. Deploy har fortsatt needs: [checks, browser] og samme main/push-vilkår. Den verifiserte personvernsiden og artifact-rundturen inngår som før. Ingen personvernrapport eller vellykket nettlesertest fabrikeres for en hoppet over jobb. Ingen test er slettet eller gjort svakere.

## Gevinst og kostnad

Kjøring 42100281184 brukte 689 sekunder på browser, 26 sekunder på checks og 75 sekunder på deploy. Ved en ren dokumentasjons-PR unngås nettleserjobben og containeroppsettet. Dette er et historisk målepunkt, ikke en måling av besparelsen etter endringen.

Browser venter nå på checks for å få det verifiserte omfanget. For kodeendringer og main forlenges derfor den kritiske stien med tiden checks tar, historisk omtrent 26 sekunder. Dette er valgt framfor en ny jobb med eget checkout-oppsett. Delvis testutvalg ved kodeendringer og parallellisering utsettes til avhengigheter og midlertidige filbaner er kartlagt.

## Kontroll og videre prøving

Den nye testen lager et eget midlertidig git-repo og prøver dokumentasjon, kode, blandede endringer, flytting, sletting, nyere main, manglende base og andre hendelser. YAML sammenlignes med main for å bevare alle teststeg, rettigheter og hele deploy-jobben. Egenkontroll er ikke uavhengig gjennomgang.

Denne PR-en endrer workflow og scripts og skal derfor kjøre hele nettleserrunden. Etter sammenslåing skal main også gjøre det. Først en senere ren dokumentasjons-PR kan bevise at browser blir skipped, mens checks består. Kontroller begge tilfeller før løsningen beskrives som verifisert i drift. GitHub-regler for påkrevde kontroller er ikke kontrollert eller endret her. Hvis repoets regler krever at en hoppet over browser-jobb behandles annerledes, avklares dette uten å svekke publiseringssperrene.

Java-oppgraderingen i #193 er en separat endring. Dette forslaget endrer ingen Action-versjoner.
