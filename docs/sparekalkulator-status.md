# Sparekalkulatoren: status og vern ved videre endringer

Oppdatert 5. november 2026. Dette er gjeldende status for Sparing, «Hva kan sparingen bli?», og arbeidsmåten når denne kalkulatoren brukes som mal. Eldre datomerkede statusfiler er historikk. Arbeidsgrunnlaget er main `daa63ca5a334a023b25d43d31ca5f1e721342be1`, etter sammenslåing av #227. Publiseringskjøring og innholdet på domenet er ikke kontrollert på nytt i denne dokumentasjonsrunden.

Lars ba om å dokumentere den ferdige finpussen og bevare den gjennom små, kontrollerte oppdateringer. Dette er en stabiliseringsfase, ikke en ny generell utviklingsfrys. Konkrete feil kan rettes. Større ombygging, nye funksjoner og overføring til andre kalkulatorer krever et eget avgrenset oppdrag. «Gullstandard» er ambisjonen for malen, ikke en dokumentert sertifisering.

## Hva som er gjort

| Område | Nåværende løsning | Kontroll og begrensning |
| --- | --- | --- |
| Resultat og navigering | Se resultat etter grunnfeltene og ved bunnen av PC-skjemaet. Lagre plan ved resultatet. Hopp bruker mål i den levende siden og flytter fokus | Lokale navigasjonstester. Lars har bekreftet at hoppknappene fungerer godt |
| Resultatlinje | Kan skjules/åpnes på mobil, ved zoom og på vanlig PC. Vises først nedenfor grønt resultatkort. Korte enheter for store beløp, med utvidet skjermlesertekst | #226 og #227 er slått sammen. Lokale tester består. Endelig fysisk prøve av de to tilleggene i #227 gjenstår å bli meldt tilbake |
| Lange tabeller | Kolonne- og radoverskrifter beholdes. Radvis visning ved plassmangel, uten at årstallet dekker verdier. Hopp til siste år og retur. To små reservepiler når resultatlinjen er lukket eller ikke vises | Lars har prøvd mobilens rullefelt og PC-pilene. Lokale tester kontrollerer fokus, ingen verdiendring og plassmangel |
| Innskudd og perioder | «Innskudd totalt» presiserer at beløpet er samlet. Dagens kroner merkes separat. Periodetekst bruker år/måneder fra motorens månedsavrunding | Finansielle forutsetninger og lagrede inndata er bevart. Dette er ingen ny uavhengig revisjon av motoren |
| Sammenligning | Diagram, forklaringer, planutvalg og tabell tilpasses tilgjengelig plass. Lavere/høyere scenario er inaktivt der kombinasjonen ikke støttes | Vanlige og eldre planer inngår i eksisterende regresjonskontroller. Hele hovedoppdraget var avgrenset til Sparing |
| Rapportformater | Rapport (HTML/PDF) har én forhåndsvisning. HTML er selvstendig og kan åpnes uten nett/JavaScript. Sammenligning har også Excel/CSV, valgte planer Rapport/Excel | HTML-kontroll dekker fem rapportveier og Nu-validering. Formatvalg følger innholdet, ikke et krav om like mange valg overalt |
| Rapportinnhold | Sparetabellen følger rapporten med samme år, kolonner og tall. Ved plassmangel vises rader med etiketter. Sammenligningskopien har statisk forklaring, og HTML/forhåndsvisning har rolig tabellbakgrunn | PDF-kopien holdes adskilt fra tilpasningen av forhåndsvisningen. Rapportverdier, tema og planutvalg kontrolleres i eksisterende tester |
| Rapportvalg underveis | Etter at toppknappene er rullet ut av syne, kommer en lav bunnlinje med HTML/PDF, opp/ned og lukk. På smal skjerm samles formatene. Linjen inngår ikke i filene | #227. Lokal kontroll ved 256–1280 px, inkludert 256 × 200. Fysisk iPhone/Safari må fortsatt prøves |
| Utskrift/PDF | Eksisterende nettleserutskrift, merket utskriftskopi og retur til rapporten er bevart. Feil/ignorerte kall har reservevei | Lars har bekreftet utskrift/nedlasting på PC og iPhone tidligere i runden. Nettleserne lager ulike PDF-er. Poengsummer er ikke full PDF-/UU-godkjenning |
| Store tall og grenser | Aksetekst får målt plass. Ved rapportgrensen 10²¹ kr vises forklaring/testhilsen og Kontakt Lars i stedet for HTML/PDF. Vanlige rapportvalg gjenopprettes ved normale tall | Tester skiller åpen plan, sammenligning og valgte planer. Lesbart linjeskift foran kr ved 500 % beholdes som avtalt |
| Kildelenke | Den videresendte særlenken til Finansportalen er fjernet. Eksisterende navngitt Forbrukerrådet-artikkel er beholdt | Kontrollert 5. november i feilrettingsrunden. Ingen nye data eller produktråd er integrert |

Detaljer, konkrete testverdier og observerte feil står i [testfunn og manuelle kontroller](sparekalkulator-testfunn-2026-11-05.md). Visningsreglene står i [KALKULATORDESIGN.md](../KALKULATORDESIGN.md). Beregningsmotoren og `report-print.js` er uendret mellom main etter #222 og arbeidsgrunnlaget over.

## Vern mot tilbakefall

Det eksisterende vernet skal beholdes:

- `scripts/foreldet.py` undersøker historikken for hele eldre filer, visse delvise tilbakeføringer og slettede tester. Det er ikke bare en innholdssjekk av den nye fila. `tests/foreldet.test.py` prøver åtte kontrolltilfeller, inkludert gammel motor og slettet test.
- `.github/workflows/static.yml` henter historikken og kjører dette vernet før publisering. `deploy` avhenger av både `checks` og `browser`. Innholdsbaserte `?v=` kontrolleres med `scripts/versjoner.py --check`.
- De nye `testfunn-browser.cjs` og `rapportvalg-browser.cjs` kobles i denne PR-en til den eksisterende navigasjonskontrollen i Chromium. De lå tidligere bare som lokale kontroller. Ingen ny jobb, ny nettlesermatrise eller dublett av motorens beregningstester legges til.
- Eksisterende motor-, inndata-, lagring-, rapport-, HTML/PDF-, fokus- og tilgjengelighetstester skal beholdes. Endret knappetekst kan kreve ny testforventning. Tallkrav, sikkerhetskontroller og fokuskrav skal ikke svekkes for å få grønt resultat.

Dette hindrer kjente tilbakefall. Det garanterer ikke fravær av nye feil. Skriptet dekker utvalgte mønstre og har eksplisitte unntak for bevisste tilbakeføringer. Slike unntak skal ikke brukes som omvei rundt Lars sin godkjenning. GitHub-regler som håndhever krav til gjennomgang eller hindrer direkte push er ikke kontrollert eller endret i denne runden. Ikke påstå at branch protection er bekreftet.

## Arbeidsmåte for neste endring

1. Hent fersk main og kontroller åpne PR-er. Lag en gren fra main. Les denne statusen og kalkulatordesignet. Ikke bruk en gammel samtale, patch eller kopi som kilde til hele produksjonsfiler.
2. Beskriv én konkret feil eller brukernytte, berørte filer, hva som skal bevares og hvordan resultatet skal etterprøves. Avklar større endringer før implementering. Nye diagrammer, datainnhenting og ombygging inngår ikke automatisk i en feilretting.
3. Gjør en liten endring i gjeldende kode. Bevar motor, lagringsnøkler, rapportens utskriftsflyt og kildereglene med mindre oppdraget uttrykkelig gjelder disse. Endring i felles CSS/JS kontrolleres også mot de andre brukerne av den aktuelle komponenten.
4. Kjør relevante kontroller én gang. Ved visning: gjenskap feilen og prøv mobil, PC, trang flate, tastatur/fokus og relevant rapportvei. Ved beregning: kontroller mot uavhengige forventede tall. Kjør vernet mot gammel kode, og generer versjoner etter CSS/JS-endring. En ren dokumentasjonsendring trenger ingen ny full nettleserrunde.
5. Lever en liten PR med problem, løsning, utførte kontroller og det som ikke er testet. Ikke legg gamle produksjonsfiler eller svekkede tester inn for å løse konflikt. Ved konflikt hentes main og den avgrensede endringen gjøres på nytt der.
6. Lars godkjenner før sammenslåing. Main-push starter testing og publisering. Etter publisering prøves bare berørt brukerreise, med presist testoppsett. Ikke erklær publisering vellykket uten kontroll. Stopp eller lag en konkret retting dersom kontrollene feiler.

Ikke følg hele CI-kjøringen løpende. Les de relevante feilmeldingene hvis noe feiler. Mer omfattende opprydding i testarbeidsflytene er et eget oppdrag.

## Testoppsett og gjenstående brukertesting

Lars tester på 1920 × 1080 med normalt 150 % systemskalering. Ved 100 % systemskalering og 500 % nettleserzoom opplyser han at visningen er fin. Ved 175 % systemskalering og 500 % zoom er flere problemer observert, uten full kartlegging. Nettleserversjon og faktisk CSS-visningsflate er ikke registrert for hver prøve. Se den presise tabellen i [testnotatet](sparekalkulator-testfunn-2026-11-05.md).

Automatiske kontroller og Lars sine manuelle prøver erstatter ikke testing med folk som bruker skjermleser eller andre hjelpemidler. Det påstås hverken full WCAG-godkjenning, ferdig språk-/nivårevisjon eller uavhengig kontroll av alle beregninger. De to manuelle kontrollene etter #227 står fortsatt åpne til Lars har meldt resultatet.

## Eksterne henvendelser

| Kontakt | Bekreftet status fra Lars | Ikke avklart |
| --- | --- | --- |
| Inklud, inklud.no | E-post sendt med spørsmål om hjelp til å få til brukertesting. Egen logg er foreslått i [PR #225](https://github.com/gronnlars/spareverksted/pull/225), som fortsatt er åpen ved denne kontrollen | Ingen avtalt eller gjennomført ekstern brukertest er dokumentert. Dette er ikke en godkjenning fra Inklud |
| Forbrukerrådet / Finansportalen | Lars opplyser at dialog er startet om mulig bruk av data fra Finansportalen | Hvilke data som kan brukes, formål, vilkår, kildekrav og teknisk løsning er ikke ferdig avklart i dette oppdraget. Ingen ny dataintegrasjon er implementert |

Referer til den eksisterende Inklud-loggen når #225 er slått sammen. Ikke kopier korrespondansen inn i flere parallelle logger. Videre databruk må avklares før integrasjon og følge eksisterende Kildevakt/Tidsmaskin og kilderegler. Ingen ny henvendelse er sendt i denne arbeidsøkten.

## Parkert

Kakediagram/tidslinje, generell opprydding i GitHub Actions, GHSA-varselet til senere GitHub-gjennomgang, bred ny språk-/nivårevisjon og ny låneside er ikke implementert gjennom denne dokumentasjonsoppdateringen. Se [GitHub-oppfølging](github-oppfolging-2026-11-05.md). Lånemodellene bevares, mens lånesiden fortsatt fjernes fra publiseringsartefakten.

## Kontroll av denne oppdateringen

ChatGPT/Codex, egenkontroll. Åtte tilfeller for gammel-kode-vernet er prøvd og består. Versjonskontrollen består. De tre Chromium-testene i den utvidede navigasjonskontrollen er kjørt lokalt og består. Arbeidsflytens YAML er lest maskinelt, og publiseringens avhengigheter og listen over jobber er bevart. Ingen full CI-overvåking eller ny fysisk brukertest. Produksjonskode og økonomiske forutsetninger endres ikke her.
