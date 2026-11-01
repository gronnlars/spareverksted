# Sikkerhetskontroll, 31. oktober 2026

Lars rapporterte Sitechecker-varsler: HTTPS-sider med interne HTTP-lenker, HTTP-URL-er, skjema til HTTP og manglende XSS-forsvar. Kontrollen er teknisk egenkontroll av ChatGPT/Codex, ikke en sikkerhetsrevisjon.

Bekreftet på publisert forside med curl 31.10.2026: HTTP gir 301 til HTTPS, HTTPS gir 200. Ingen Content-Security-Policy i svarhodene eller HTML-en. Publisert HTML har tre skjema uten action, ingen eksplisitte HTTP-lenker. Alle seks HTML-filer i main er undersøkt uten funn av HTTP-lenker eller HTTP-action. Sitecheckers konkrete berørte URL-er er ikke mottatt, så disse funnene er ikke ferdig gjenskapt. HTTP-identifikatorene i XLSX-eksporten er XML-navnerom og skal ikke endres.

Tiltak: tidlig CSP-meta på alle sider. Script kan lastes fra eget opphav. Inline script, inline hendelsesattributter, eval, nettverkskall fra script, native skjemainnsending, objekter, iframes, workers og base-element blokkeres. Lokale skjemaers submit-håndtering med preventDefault fortsetter. CSS tillater inline stil fordi eksisterende layout og graf bruker det. Det er en bevisst begrensning, og gjelder ikke JavaScript. Bildedata og blob-bilder er tillatt for lokal eksport. CSP eliminerer ikke alle former for XSS, og erstatter ikke korrekt behandling av tekst og HTML.

På GitHub Pages brukes CSP i HTML. Dette gir ikke en CSP-svarheader, og Sitechecker kan fortsatt varsle hvis testen bare sjekker headers. `frame-ancestors` og rapportering legges ikke i meta, siden dette ikke gir tilsvarende beskyttelse. Det er besluttet å klargjøre opplasting av testet `dist/` til Bunny Storage, men dette setter ikke opp besøksruting eller HTTP-hoder. En Bunny Pull Zone må konfigureres separat, med nødvendige sikkerhetshoder, før domenet rutes dit. Ingen garanti for at enhver sikkerhetsskanner gir grønt.

Forebygging: Python parser alle HTML-filer og avviser HTTP-adresser i lenker/ressurser/skjemaer, protokollrelative adresser, inline kode og svekket policy. Negative tester kontrollerer selve sperren. Playwright prøver i tre motorer at inline script, hendelsesattributter og native skjema faktisk blokkeres på alle sider. Eksisterende nettleserpakke kjøres også med CSP. Dette er ikke test av alle angrepsmuligheter eller alle headerinnstillinger i produksjon.

Kilder lest av ChatGPT/Codex 31.10.2026:
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/form-action
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors
- https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https

Status ved gjennomgangen 31.10.2026: lokal Python-kontroll, negative tester og syntakskontroll bestått. Ekte nettlesertester avventer CI. Bunny-deployen er ikke aktiv på main, og produksjonshoder er ikke kontrollert mot Bunny.
