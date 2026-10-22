# Redaksjonell kontroll av spørreveilederen

Kontrollert 22. oktober 2026. Dette er en første versjon med syv temaer og 28 eksempelspørsmål. Spørsmålene rutes til temaer, ikke til frie språkmodellsvar. Tall i fritekst blir ikke tolket; felter bekreftes separat. Veilederen foretar ikke en full egnethetsvurdering, anbefaler ikke navngitte produkter og fastsetter ikke en bestemt aksjeandel.

## Kilder og avgrensninger

- Forbrukerrådet, «Sparing i fond og spareprofiler»: risiko, spredning og kostnader. https://www.forbrukerradet.no/sparing-i-fond-og-spareprofiler/
- Forbrukerrådet, «Pensjon fra egen sparing»: kostnader, sparing og gjeld. https://www.forbrukerradet.no/finansportalen/pensjon/pensjon-fra-egen-sparing/
- KLP, «Betale lån eller spare?», oppdatert 13. oktober 2026: buffer, dyr gjeld, kombinasjonen av nedbetaling og sparing og tidshorisont ved pensjon. Kommersiell kilde, merket som dette i grensesnittet. Ingen anbefaling av KLP-produkter. https://www.klp.no/artikler/nedbetale-lan-eller-spare
- Husbanken, «Ekstra innbetaling på lånet»: ekstra innbetaling på fastrentelån kan gi over-/underkurs. Brukerens avtale må sjekkes hos egen bank. https://husbanken.no/kunde-i-husbanken/ekstraordinaer-betaling-paa-laan/
- Lånekassen, «Renter og gebyrer» og «Omgjøring av basislån til stipend»: vilkår for rentefrihet og stipend. Ingen aktuelle rentesatser eller inntektsgrenser hardkodes. https://lanekassen.no/nb-NO/gjeld-og-betaling/renter-og-gebyrer/ og https://lanekassen.no/nb-NO/stipend-og-lan/omgjoring-av-basislan/
- Statsforvalteren, «Bank og forvaltning»: arkivert side. Den gir bakgrunn, men bekrefter ikke alene gjeldende regler. Barnesvaret angir derfor ingen beløpsgrense og ber om avklaring før større overføringer. Arkivstatus markeres i svaret. https://utdatert.statsforvalteren.no/ostfold-buskerud-oslo-og-akershus/vergemal/vergemal-for-barn/jeg-er-verge/bank-og-forvaltning/
- Nav, «Trenger rådgivning om økonomi og gjeld»: gratis økonomi- og gjeldsrådgivning. https://www.nav.no/okonomi-gjeld
- Skatteetaten, «Bustadsparing for ungdom (BSU)»: til og med året man fyller 33, eierskap ved utgangen av året og tilstrekkelig skatt. Ingen satser hardkodes. https://www.skatteetaten.no/nn/person/skatt/hjelp-til-rett-skatt/bank-og-lan/bsu--bustadsparing-for-ungdom/
- Finanstilsynet, informasjon om verdipapirfond: kostnader og risiko. https://www.finanstilsynet.no/forbrukerinformasjon/verdipapirforetak-verdipapirfond-og-alternative-investeringsfond/

## Egne redaksjonelle valg

Under 5, 5–10 og minst 10 år er grove inndelinger, ikke risikofrie grenser. Terskelen 55 år utløser en forklaring om pensjon, ikke automatisk lavere aksjeandel. Ved ung alder er forskjellen mellom pensjonssparing og kortsiktige kjøp eksplisitt. Høyere aksjeandel omtales betinget og uten prosent. Manglende buffer, dyr gjeld og usikker inntekt løftes fram før temaforklaringen. Kildene har ikke godkjent produktet. Forbeholdene erstatter ikke innholdskontroll.

## Vedlikehold

Kontroller lenker og regelpåstander før neste utvidelse og ved kjente regelendringer. Oppdater dato i veileder-engine.js, veileder-ui.js og denne filen samtidig. Bytt ut den arkiverte Statsforvalteren-kilden når en oppdatert, verifiserbar primærkilde finnes. Ikke legg inn beløpsgrenser uten riktig referanseår. Vurder spørsmålene mot et bredere norsk språkutvalg før søket utvides. Ingen automatisk kildesynkronisering.

## Kvalitetssikring

Kjør eksisterende beregningstester og tests/veileder.test.cjs. Nettlesertesten krever Playwright og lokal server på port 8000. Den kontrollerer temabekreftelse, endrede opplysninger, tømming, innsettingsangrep, lenker, fokus, ingen eksterne forespørsler fra veiledersiden og horisontal overløp ved fire skjermbredder. Temaene gir samme grunnsvar for sine eksempelspørsmål; dette opplyses i grensesnittet.

## Forenklet versjon, 22. oktober 2026

Kortsvaret viser to alternativer med lukkede fordeler og ulemper. Utdyping og kilder åpnes ved behov. Alder, oppgitt sparetid og eksplisitt risikovalg følger fra kalkulatoren via fanens øktlagring. Ukjent alder og risikovalg blir ikke gjettet fra standardverdier. Sparetiden for barn må oppgis separat; foreldres tid til pensjon brukes ikke automatisk. Øktlagringen inneholder ikke fritekst eller sparebeløp.

Stipendpunktet er nå konkretisert med nettoformuesgrensen 534 225 kroner for ugifte i 2026, verifisert på Lånekassens side om omgjøring. Egne regler for gifte/samboere med felles barn og gradvis reduksjon er nevnt. Grensen beskriver ikke framtidige vilkår eller alle stipend i videregående skole. Kilden: https://lanekassen.no/nb-NO/stipend-og-lan/omgjoring-av-basislan/

Statsforvalteren omtales med dagens navn. Påstanden «lav rente» brukes ikke, siden verken dagens rentenivå eller alle aktuelle kontovilkår er kontrollert. Poenget er bankplassering og begrensede investeringsvalg. Forvaltningsgrenser og unntak må avklares før overføring; den arkiverte bakgrunnskilden erstatter ikke en slik kontroll.

Fleksibilitet ved økonomiske problemer i familien gjelder penger forelderen fortsatt eier. Teksten presiserer at penger som allerede er gitt bort, ikke fritt kan tas tilbake. Fordelene ved foreldreeierskap balanseres mot arv, kreditorer, samlivsbrudd og at barnet ikke automatisk har krav på beløpet. Dette er forhold å undersøke, ikke individuell juridisk rådgivning.

Nye tester dekker 504 kombinasjoner i kortsvarene, validering av kontekst, blokkert/ødelagt øktlagring og at en forelders sparehorisont ikke overføres til barnet. Nettlesertesten er oppdatert for den forenklede flyten.
