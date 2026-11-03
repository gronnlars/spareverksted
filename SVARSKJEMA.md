# Svarskjema for «Spør om sparing»

**Implementert som arbeidsstandard 3. november 2026 etter Lars sitt oppdrag. Sammenslåing av PR og godkjenning av svar er separate handlinger.** Begrunnelse og alternativer står i [BESLUTNINGER.md](BESLUTNINGER.md), «Felles svarskjema for spørsmål og svar». Planen for innføringen står i [research/plan-svararbeid-2026-11-03.md](research/plan-svararbeid-2026-11-03.md).

Dette er arbeidsskjemaet for alle som skriver, kontrollerer eller legger inn svar i «Spør om sparing»: Lars, ChatGPT/Codex, Claude og andre KI-verktøy, også mindre modeller. Skjemaet sier hvordan et svar fylles ut, hvilken status det har og hvem som gjør hva. Selve reglene står der de stod fra før:

| Spørsmål | Dokumentet som avgjør |
| --- | --- |
| Hva er en god kilde, og hvilke datoer føres? | [KILDEREGLER.md](KILDEREGLER.md) |
| Hvordan skal teksten lyde? | [SPRAKREGLER.md](SPRAKREGLER.md) |
| Svarform, rekkefølge, lengde og datoer for publiserte svar | [SVARMAL.md](SVARMAL.md) |
| Hva er tillatt (råd, produkter, tilpasning)? | [docs/regulatorisk.md](docs/regulatorisk.md) |
| Hvordan virker søket? | [SOK.md](SOK.md) |
| Hvor står tall og fagord? | [AGENTS.md](AGENTS.md), «Tall fra kilder», og [docs/kildevakt.md](docs/kildevakt.md) |

Er skjemaet og et regeldokument uenige, gjelder regeldokumentet. Skriv avviket i svarets publiseringssperrer og si fra til Lars.

## 0. Kortversjon: ti regler

Maskinell kontrakt, kommandoer og begrensninger: [docs/svargrunnmur.md](docs/svargrunnmur.md).

1. **Ett svar er én fil:** `kilder/svar/SV-xxx.md`, fylt ut etter malen i punkt 5. Ikke endre, legg til eller fjern overskrifter. Felt som ikke brukes, får «ingen».
2. **Du setter bare `utkast` eller `til kontroll`.** En annen enn skribenten setter `kontrollert`. Bare Lars godkjenner og slår sammen. Ingen modell publiserer.
3. **Hver påstand står i påstandstabellen** med en kilde du har åpnet og lest i samme arbeidsøkt. Får du ikke åpnet kilden, skriv «vet ikke» i tabellen og ta påstanden ut av teksten.
4. **Tall som kan endre seg, skrives som `{{ID}}`** fra `kilder/fakta/`. Finnes ikke ID-en, før tallet under «Nye fakta». Skriv det aldri rett i teksten.
5. **Ingen produktnavn, tilbydernavn, «best for deg», «du bør» eller «vi anbefaler».** Tittelen begynner aldri med «Bør jeg» (punkt 8). En kildes anbefaling gjengis som kildens (K5).
6. **Kort svar først:** høyst 60 ord, med det forbeholdet som endrer meningen.
7. **Fordeler og ulemper** brukes bare om en ordning eller et reelt valg, og skrives som følger som kan etterprøves.
8. **Hold fra hverandre:** kroner og kjøpekraft, før og etter skatt, forventet og garantert, foreslått, vedtatt og i kraft.
9. **Skriv rett ut hva du ikke har gjort**, under «Ikke kontrollert». Egen kontroll heter «egenkontroll», aldri «uavhengig».
10. **Stopp og spør Lars** når punkt 12 slår inn.

## 1. Hvor ting ligger

| Hva | Hvor |
| --- | --- |
| Køen med faste ID-er (SV-001 og oppover) | [SPORSMALSKO.md](SPORSMALSKO.md) |
| Reservasjoner og logg | [research/ARBEIDSLOGG.md](research/ARBEIDSLOGG.md) |
| Ett utfylt skjema per svar | `kilder/svar/SV-xxx.md` (ny mappe) |
| Tall med kilde, status og gjelder-fra-dato | `kilder/fakta/*.json` |
| Ordbok-setninger for fagord | `kilder/begreper/*.json` |
| Kilder Kildevakt følger | `kilder/kildeliste.json` og `kilder/register.json` |
| Svarbasen nettsiden leser | `dist/veileder-knowledge.js` |
| Hvilke svar som vises | `dist/publiserte-svar.js`. Endres bare etter Lars' godkjenning |
| Eldre utkast og kontrollnotater | `research/svarutkast/`. Historikk, flyttes ikke |

Filnavnet er den første kø-ID-en svaret dekker. Dekker svaret flere ID-er, står de andre i feltet «Kø-ID-er som dekkes», og radene i køen får `se SV-xxx`.

## 2. Statuser

Ett svar har én status om gangen. Statusen står i skjemaet og i køen.

| Status | Betyr | Krav for å sette den | Settes av |
| --- | --- | --- | --- |
| `kø` | Spørsmålet er registrert, ingen tekst | Spørsmålskortet i punkt 4A er fylt ut | Alle |
| `reservert` | Noen arbeider med svaret | Rad i arbeidsloggen: aktør, start, utløp høyst fire timer senere | Den som arbeider |
| `utkast` | Tekst finnes, men noe mangler | Skjemaet finnes. Det som mangler står i «Ikke kontrollert» | Skribent |
| `til kontroll` | Klart for kontroll | Alle påkrevde felt fylt. Påstandstabellen dekker teksten. Egenkontroll etter punkt 4C er ført i kontrolloggen | Skribent |
| `kontrollert` | En annen enn skribenten har kontrollert hver påstand mot kilden | Kontrollørens rad i kontrolloggen, alle funn lukket eller ført som sperre | Kontrollør |
| `godkjent` | Lars har godkjent teksten | Lars' godkjenning med dato i kontrolloggen | Lars |
| `integrert` | Lagt inn i svarbasen i en PR | PR-lenke, tester grønne, visning kontrollert (punkt 4E) | Integrator |
| `publisert` | På main og i `dist/publiserte-svar.js` | Lars har slått sammen | Lars |
| `til gjennomgang` | Publisert, men noe må sjekkes | Grunnen og datoen: frist, Kildevakt-sak, 12 måneder eller funn | Alle |
| `venter` | Stoppet av en konkret sperre | Sperren står i «Publiseringssperrer» | Alle |
| `se SV-xxx` | Besvart av et annet svar | Lenke til det svaret | Alle |
| `trukket` | Tatt av nettsiden | Dato og grunn | Lars |

Et svar som endres etter `godkjent`, går tilbake til `til kontroll`. Unntak: ren skrivefeil som ikke endrer betydningen. Den føres i kontrolloggen.

**Oversettelse av eldre statuser i køen:**

| Eldre status | Ny status |
| --- | --- |
| Kø | `kø` |
| Pågår | `reservert` |
| Utkast, Utkast med forbehold | `utkast` |
| Kontrollert utkast | `kontrollert` hvis en annen enn skribenten har kontrollert, ellers `til kontroll` |
| Delkontroll, åpne funn | `til gjennomgang` hvis svaret er publisert, ellers `utkast` |
| Integrert, avventer publisering | `integrert` hvis svaret står i `dist/publiserte-svar.js`, ellers `trukket` eller `utkast` |
| Avventer | `venter` |

Les alltid `dist/publiserte-svar.js` før du setter en status. Køen kan være utdatert. Lista i fila er fasit for hva som vises.

## 3. Roller

| Rolle | Gjør | Gjør ikke |
| --- | --- | --- |
| **Lars** | Avgjør, godkjenner tekst, slår sammen, tar stikkprøver | Trenger ikke lese påstandstabellen eller regne |
| **Skribent** (normalt ChatGPT) | Leser kilder, fyller skjemaet, gjør egenkontroll | Kontrollerer ikke sitt eget svar som «kontrollert» |
| **Kontrollør** | Kontrollerer hver påstand mot kilden og sjekklisten i punkt 4C | Skriver ikke om teksten. Foreslår ny ordlyd |
| **Integrator** (normalt Codex eller Claude) | Legger godkjent tekst inn i svarbasen, søk og tester | Endrer ikke betydningen. Funn sendes tilbake |

Kontrolløren er en annen enn skribenten: en ny KI-økt som ikke har sett skribentens samtale, et annet verktøy eller Lars. Kontrollen beskrives som det den er: «KI-kontroll i ny økt, ChatGPT, 4.11.2026» eller «Lars kontrollerte P3 og P5». «Uavhengig fagkontroll» brukes bare når en person med fagkompetanse har gjort den og det er dokumentert. Endringer med ikrafttredelsesdato kontrolleres alltid av en annen enn skribenten (K7).

## 4. Arbeidsgangen

### 4A. Nytt spørsmål i køen

Et nytt spørsmål får neste ledige SV-ID. ID-er gjenbrukes aldri. Fyll ut kortet og legg det som rad i køen, eller som eget skjema med status `kø` hvis det trenger mer plass.

```markdown
SV-ID: SV-150
Spørsmål: <slik en bruker ville stilt det>
Andre formuleringer: <liste, også skrivemåter og «Bør jeg»-varianter>
Svarform: begrep | ordning | regnemåte | slik sjekker du | sammenligning
Tema: sparing | bolig og lån | skatt | pensjon | hverdagsøkonomi
Premiss: <ingen feil premiss | hva som er feil eller udokumentert i spørsmålet>
Avhenger av: <SV-ID-er som bør finnes først | ingen>
Kildespor: <hvilke primærkilder som trolig svarer, for eksempel Skatteetaten, Nav>
Rådsrisiko: lav | middels | høy, med én setning om hvorfor
Prioritet: høy | middels | lav, med én setning: hvor mange det gjelder, hva en misforståelse koster, og om kalkulatoren kan vise det
Hvor spørsmålet kom fra: <redaksjonelt | brukerhenvendelse uten personopplysninger>
```

Rådsrisiko er høy når spørsmålet bare kan besvares med hva brukeren bør gjøre eller kjøpe. Slike spørsmål skrives om etter punkt 8, eller får status `venter`.

### 4B. Skrive et svar

1. Hent fersk main. Les [AGENTS.md](AGENTS.md) og dette skjemaet. Noter main-SHA.
2. Sjekk at spørsmålet ikke er besvart. Søk etter tittel og søkeord i `dist/veileder-knowledge.js` og i `kilder/svar/`. Finnes et svar, oppdater det.
3. Reserver ID-en i arbeidsloggen.
4. Velg svarform (punkt 7). Sjekk premisset (punkt 8).
5. Finn primærkildene etter K2. Les dem. Fyll kildetabellen med kildens dato eller regelår og egen lesedato.
6. Skriv påstandstabellen **før** teksten: én rad per påstand om tall, regler, grenser, aldre, datoer og årsaker, med stedet i kilden.
7. Skriv de offentlige feltene ut fra påstandstabellen. Merk hvert avsnitt med påstandene det bygger på, for eksempel `[P3]`.
8. Bytt tall som kan endre seg med `{{ID}}`. Bytt fagord som har ordbok-setning med `{{begrep:ID}}`. Før nye fakta og begreper i felt 11.
9. Regn eksemplet med kode (`python3` eller `node`). Før kommandoen og resultatet under «Kontrollregning».
10. Fyll angrepsflater (minst tre), mulig oppfattet anbefaling og publiseringssperrer.
11. Gå gjennom sjekklisten i 4C selv. Før resultatet i kontrolloggen som egenkontroll.
12. Sett `til kontroll`, eller `utkast` hvis noe mangler. Avslutt reservasjonen. Lever skjemaet i egen gren og PR med bare dokumentasjonsfiler. Ingen endring i `dist/`.

### 4C. Kontrollere

Kontrolløren leser bare dette skjemaet, regeldokumentene, det utfylte skjemaet og kildene. Ikke skribentens samtale. Svar ja eller nei:

1. Er hver rad i påstandstabellen bekreftet mot kilden i dag? Åpne kilden og finn stedet.
2. Står hver påstand i teksten i tabellen? Les teksten setning for setning.
3. Er riktig primærkilde og nivå brukt (K2)? Ingen nyhetssak eller omtale som kilde til en regel.
4. Er foreslått, vedtatt og i kraft skilt, med gjelder-fra-dato (K4)?
5. Er teksten riktig også om ett år (K6)? Ingen «i år», «nå», «neste år» eller «nylig».
6. Er kroner og kjøpekraft, før og etter skatt, forventet og garantert tydelige der det betyr noe?
7. Rettes et feil premiss i spørsmålet?
8. Kan teksten leses som et råd eller peke mot et produkt? Les tittel, rekkefølge, eksempeltall og hva som er utelatt (SPRAKREGLER punkt 7).
9. Stemmer eksemplet? Regn selv med kode.
10. Språk: ingen tankestrek, ingen tre prikker, «renters rente», «hverken», norsk tallformat, fagord forklart.
11. Har hvert faglige poeng ett hovedsted (SVARMAL)? Ingen gjentakelse.
12. Er lengden innenfor punkt 6, eller er overskridelsen begrunnet?

Før resultatet som én rad i kontrolloggen: «12 ja», eller hvilke nummer som fikk nei og hvorfor. Foreslå ny ordlyd i rapporten. Skribenten retter, og kontrolløren sjekker de endrede radene på nytt. Sett `kontrollert` bare når alle tolv er ja, eller når et nei er ført som sperre Lars må ta stilling til.

### 4D. Godkjenne

Lars leser den offentlige delen (felt 1 til 13), «Publiseringssperrer» og «Ikke kontrollert». Han kan be om en stikkprøve: «vis meg kilden til P4». Godkjenning skrives i kontrolloggen med dato, for eksempel «Lars: godkjent 5.11.2026». Godkjenning av teksten er ikke det samme som tillatelse til å slå sammen en PR.

### 4E. Legge inn på nettsiden

Bare svar med status `godkjent`.

1. Overfør feltene til `dist/veileder-knowledge.js` etter tabellen i punkt 6. Fjern `[Pn]`-merkene. Teksten skal ellers være lik skjemaet ord for ord. Når et skript gjør dette, brukes skriptet.
2. Nye fakta og begreper inn i registeret. Kjør `python3 scripts/fakta.py` og `python3 scripts/fakta.py --check`.
3. Søk etter [SOK.md](SOK.md): `keys`, `questions` og `words`. Nye rader i `tests/veileder-sok-utvidet.test.cjs` for hvert navn og én skrivefeil. Nærliggende spørsmål svaret ikke dekker, blir kjente hull i `GAPS` eller egne kø-ID-er.
4. Tre steder endres bevisst. For å vise svaret: ID-en i `dist/publiserte-svar.js` og i lista i `tests/published-answers.test.cjs`. Dobbeltføringen er med vilje: den hindrer at et svar vises ved en feil. For hvert nytt svar i svarbasen, også et som ikke vises: søkegrunnlaget `tests/fixtures/svarmal-search-baseline.json`.
5. Kjør `python3 scripts/versjoner.py` når filer i `dist/` er endret. Kjør testene slik `.github/workflows/static.yml` gjør.
6. Se den gjengitte siden ved 320 px, 390 px og på PC. Åpne fordeler og ulemper, fordypning og kilder. Prøv med tastatur. Ikke testet skrives konkret i PR-en.
7. PR med svar-ID, endrede filer, tester, skjermbilder og det som ikke er testet. Lars slår sammen.
8. Etter sammenslåing: status `publisert`. «Først publisert», «Sist endret» og «Sist gjennomgått» settes etter SVARMAL.

### 4F. Gjennomgå et publisert svar

Følg SVARMAL, «Datoer og gjennomgang». I skjemaet betyr det: les hver kilde på nytt, oppdater «Lest» i kildetabellen, bekreft hver rad i påstandstabellen og skriv en rad i kontrolloggen. «Sist gjennomgått» flyttes bare når alle kildene er lest og alle påstandene bekreftet. Er noe endret, går svaret gjennom 4C og 4D igjen.

### 4G. Når Kildevakt eller en frist slår inn

1. Finn hvor faktaet brukes: `python3 scripts/fakta.py steder ID`. Finn svar som bruker kilden: søk etter kilde-ID-en i `kilder/svar/`.
2. Sett de berørte svarene til `til gjennomgang` i køen.
3. Les primærkilden. Endre verdien i registeret med riktig status (foreslått, vedtatt eller i kraft) og gjelder-fra-dato. Aldri ut fra Kildevakts rapport alene.
4. Les teksten i hvert berørt svar. Stemmer den fortsatt med ny verdi? En sats kan endre en setning, ikke bare et tall.
5. De to bekreftede feilene i tilgang og hentestatus er rettet med regresjonstester. De øvrige funnene er ikke sluttført i denne leveransen. En vellykket henting er uansett aldri faglig kontroll og flytter aldri «Sist gjennomgått».

## 5. Malen

Kopier alt i blokken. Bytt teksten i `<>`. Felt uten innhold får «ingen».

````markdown
# SV-000: <spørsmålet slik brukeren ville stilt det>

<!-- Svarskjema versjon 1. Ikke endre overskriftene. -->

## 1. Styring
Svar-ID: q-<kort-navn>
Kø-ID-er som dekkes: SV-000
Status: utkast
Svarform: begrep | ordning | regnemåte | slik sjekker du | sammenligning
Kategori: <funds | pension | mortgage | student | children | buffer | bsu | ingen. Påkrevd ved sammenligning>
Søkefamilie: <valgfritt, for eksempel bsu | ingen>
Regelår: <2026 | ikke regelbundet>
Vedlikehold: <A | B | C | D, flere kan gjelde, se punkt 11>
Først publisert: <ÅÅÅÅ-MM-DD | ikke publisert>
Sist endret: <ÅÅÅÅ-MM-DD | ikke publisert>
Sist gjennomgått: <ÅÅÅÅ-MM-DD | ikke publisert>
Neste kontroll: <ÅÅÅÅ-MM-DD, internt>
Skribent: <verktøy eller navn>, <ÅÅÅÅ-MM-DD>
Lest main: <SHA>
Avhenger av: <SV-ID-er | ingen>

## 2. Spørsmål og søk
Tittel: <nøytral, spørsmålsform, høyst 70 tegn>
Spørsmål brukere kan stille:
- <minst tre, med brukerens egne ord>
Søkeord: <ord1, ord2. Bare små bokstaver og tall>
Søkefraser: <kommaseparerte bokstavelige fraser. Ikke regulære uttrykk>
Dekker ikke: <nærliggende spørsmål svaret ikke besvarer | ingen>
Premiss: <ingen feil premiss funnet ved egenkontroll | hva som rettes, og hvor i teksten>

## 3. Kort svar
<To til fire setninger, høyst 60 ord. Svar først. Nødvendig forbehold.> [P1, P2]

## 4. Forbehold
<ingen | én setning som ikke står i kortsvaret, men endrer forståelsen> [Pn]

## 5. Fordeler og ulemper
- Fordel: <tittel, høyst fem ord>
  <én følge som kan etterprøves, høyst 45 ord> [P3]
- Ulempe: <tittel>
  <tekst> [P4]

## 6. Eksempel
Tittel: Eksempel: <hva eksemplet viser>
<Tekst. Forutsetninger én gang. Før eller etter skatt. Kroner eller dagens kroner. Si at tallene er valgt for eksemplet.> [P5]
Kontrollregning: <kommando og resultat, for eksempel python3 -c "print(round(10000*1.05**2))" gir 11025>

## 7. Fordypning
### <Tittel som sier hva leseren får vite>
<Tekst, høyst 90 ord per del> [P6, P7]
Tabell: <ingen | tabell generert fra registeret, for eksempel bsuRates>

## 8. Vis det i kalkulatoren
Lenketekst: <ingen | for eksempel «Se regneeksemplet i kalkulatoren»>
Lenke: <ingen | index.html#<parametre>, laget med kalkulatorens delingsfunksjon>
Flere lenker: <ingen | én lenketekst og én lenke per linje, skilt med mellomrom, loddrett strek og mellomrom>
Kontrollert: <åpnet ÅÅÅÅ-MM-DD, viser samme tall som eksemplet | ikke kontrollert>

## 9. Kilder
| Kilde-ID | Tittel slik den vises | URL | Nivå | Kildens dato eller regelår | Lest | Lest av |
| --- | --- | --- | --- | --- | --- | --- |
| <tax-xxx> | <Etat: sidetittel> | <https://adresse> | <1 til 5, eller R> | <dato, regelår eller «ingen dato oppgitt på siden»> | <ÅÅÅÅ-MM-DD> | <verktøy eller navn> |

## 10. Om kildekontrollen
<Teksten leseren ser: kildens dato eller regelår, lesedato, hvem som kontrollerte og kontrollformen, vesentlige avgrensninger med «jeg».>

## 11. Fakta og begreper
Fakta fra registeret: <{{bsuAnnual}}, {{bsuRate.periode}} | ingen>
Nye fakta:
| Foreslått ID | Verdi | Enhet | Kilde-ID | Status | Gjelder fra | Bekreftet til |
| --- | --- | --- | --- | --- | --- | --- |
Begreper fra registeret: <{{begrep:kjopekraft}} | ingen>
Nye begreper:
| ID | Ord | Ordbok-setning | Utdyping | Kilde-ID |
| --- | --- | --- | --- | --- |

## 12. Relevans i veilederen
Relevant når: <ingen | signaler fra punkt 10 i SVARSKJEMA.md>
Begrunnelse som vises: <ingen | «Vises først fordi du har oppgitt sparetid 2 år.»>

## 13. Kobling til andre svar
Se også: <svar-ID-er | ingen>

---

Alt under streken er internt og publiseres ikke.

## 14. Påstandstabell
| Nr | Påstand slik den står i teksten | Kilde-ID | Hvor i kilden | Støtter kilden påstanden? | Unntak og usikkerhet |
| --- | --- | --- | --- | --- | --- |
| P1 | <påstanden> | <kilde-ID> | <overskrift eller avsnitt> | <ja, nei eller vet ikke> | <unntak, eller «ingen»> |

## 15. Angrepsflater
| Mulig feiltolkning | Hvordan teksten forebygger den |
| --- | --- |
| <minst tre rader> | <forklaring> |

Mulig oppfattet anbefaling: <ingen funnet ved egenkontroll | hva som er endret>

## 16. Publiseringssperrer
<ingen | konkrete punkter som må løses før godkjenning, med spørsmål til Lars>

## 17. Kontrollogg
| Dato | Hvem | Rolle | Hva ble kontrollert | Resultat |
| --- | --- | --- | --- | --- |
| <ÅÅÅÅ-MM-DD> | <verktøy eller navn> | skribent | egenkontroll etter 4C | <12 ja, eller nummer med nei> |

## 18. Ikke kontrollert
<Det som ikke er gjort: kilder som ikke kunne åpnes, visning, søk, skjermleser | ingen>
````

**Sammenligning** bruker samme mal, men felt 5 ser slik ut:

```markdown
## 5. Fordeler og ulemper
### Alternativ 1: <navn>
Undertittel: <én setning om hva alternativet er>
- Fordel: <tittel>
  <tekst> [P3]
- Ulempe: <tittel>
  <tekst> [P4]
### Alternativ 2: <navn>
Undertittel: <én setning om hva alternativet er>
- Fordel: <tittel>
  <tekst> [P5]
- Ulempe: <tittel>
  <tekst> [P6]
```

## 6. Feltregler

Tallgrensene er veiledende. En overskridelse begrunnes i kontrolloggen. Den løses aldri ved å kutte et vilkår eller et forbehold (SVARMAL). SVARMAL sitt mål på inntil 300 ord for hele svaret gjelder fortsatt. Fordypningen kan gå over når det trengs for et fullstendig svar (Lars 29.10.2026).

| Felt i skjemaet | Felt i svarbasen | Påkrevd | Regel |
| --- | --- | --- | --- |
| Svar-ID | `id` | Ja | `q-` og små bokstaver, tall og bindestrek. Endres aldri etter publisering |
| Svarform | `kind`, `layout`, `neutral` | Ja | Se punkt 7 |
| Kategori, søkefamilie | `category`, `searchFamily` | Ved sammenligning | Bare de sju kategoriene som finnes. Ny kategori: stopp (punkt 12) |
| Tittel | `title` | Ja | Nøytral spørsmålsform. Ikke «Bør jeg» |
| Spørsmål brukere kan stille | `questions` | Ja, minst tre | Brukerens ord, også «Bør jeg» og vanlige skrivemåter |
| Søkeord | `keys` | Ja | Bare `[a-zæøå0-9]`. Hvert navn har én eier (SOK.md) |
| Søkefraser | `words` | Ja | Generatoren lager sikre, bokstavelige ordtreff |
| Kort svar | `intro` | Ja | Høyst 60 ord |
| Forbehold | `caveat` | Nei | Bare når det tilfører noe kortsvaret ikke sier |
| Fordeler og ulemper | `tradeoffs.pros`, `tradeoffs.cons` eller `options` | Ved ordning når det er relevant, alltid ved sammenligning | Brukes feltet, må det ha både fordel og ulempe. Tittel høyst fem ord, tekst høyst 45 ord |
| Eksempel | `example.title`, `example.text` | Nei | Høyst 80 ord. Kontrollregning påkrevd |
| Fordypning | `parts[].title`, `parts[].text` | Ja, minst én del | Høyst 90 ord per del. Svarbasen krever minst én |
| Tabell i fordypning | `parts[].table` | Nei | Bare tabeller som lages fra registeret, for eksempel `bsuRates` |
| Begrepsliste | `terms` | Nei | Brukes ikke i nye svar. Fagord forklares i teksten eller med `{{begrep:ID}}` (SVARMAL, punkt 4) |
| Vis det i kalkulatoren | `next.text`, `next.href`, `next.more` | Nei | Laget med delingsfunksjonen, åpnet og kontrollert |
| Kilder | `sources[].id`, `.title`, `.url` | Ja | `https://`. Kilde-ID som i `kilder/register.json` når kilden finnes der |
| Om kildekontrollen | `review.text` | Ja | SVARMAL, «Kort kontrolltekst for leseren» |
| Først publisert, sist endret, sist gjennomgått | `published`, `changed`, `checked` | Ja ved publisering | SVARMAL, «Datoer og gjennomgang» |
| Relevans | Ikke i svarbasen ennå | Nei | Data for fase 3, se punkt 10 |
| Felt 14 til 18 | Ingen | Ja | Interne. Publiseres aldri |

Kildenivå skrives som tallet fra K2 (1 til 5) eller «R» for faglig grunnlag for regnemetoder. Nivå 6 brukes aldri.

## 7. Svarformer

| Svarform | Når | I svarbasen | Fordeler og ulemper | Eksempel |
| --- | --- | --- | --- | --- |
| Begrep | «Hva betyr X?» | `kind: 'explainer'`, `layout: 'overview'` | Normalt ikke | Når det forklarer mer enn teksten |
| Ordning | «Hva er BSU, ASK eller IPS, og hvilke følger har den?» | Som begrep | Ja, dokumenterte følger | Ofte, for eksempel skatt ved uttak |
| Regnemåte | «Hvordan regnes X?» | Som begrep | Nei | Ja, med kontrollregning og gjerne kalkulatorlenke |
| Slik sjekker du | «Hvordan finner jeg min pensjon?» | Som begrep | Nei | Nei. Pek på den offentlige tjenesten |
| Sammenligning | To reelle alternativer | `neutral: true`, `category`, `options` med nøyaktig to alternativer | Minst én fordel og én ulempe per alternativ | Valgfritt |

Ikke lag et kunstig alternativ for å fylle en sammenligning. Et grunnbegrep trenger ofte forklaring og eksempel, ikke to kort.

## 8. Spørsmål som ber om et råd

Rundt 30 av 149 spørsmål i køen spør hva brukeren bør gjøre: «Bør jeg», «Lønner det seg», «Hva bør jeg». Spareverksted svarer ikke på hva den enkelte bør gjøre (docs/regulatorisk.md). Slik håndteres de:

1. Brukerens ord beholdes som søkeinngang under «Spørsmål brukere kan stille».
2. Tittelen skrives om til det svaret faktisk gjør:

| Brukeren spør | Tittel |
| --- | --- |
| «Bør jeg A eller B?» | «A eller B: hva er forskjellen?» |
| «Lønner det seg alltid å X?» | «Når gir X en fordel, og når gjør det ikke det?» |
| «Hvor mye bør jeg ha i X?» | «Hva påvirker hvor stor X trenger å være?» |
| «Hvordan sparer jeg best til Y?» | «Hvilke måter å spare til Y finnes, og hva skiller dem?» |

3. Kortsvaret svarer på det som kan besvares. «Det kommer an på» er aldri hele svaret. Nevn de forholdene kildene sier betyr mest.
4. Har en kilde på nivå 1 eller 2 en anbefaling, gjengis den som kildens, med navn (K5).
5. Beskriv følger og situasjoner der en følge betyr mye, for eksempel «Pengene er bundet til bolig». Ikke beskriv hvilken type person som bør velge hva.
6. Rett premisset kort i kortsvaret når spørsmålet bygger på noe feil, for eksempel at fond dobler seg hvert tiende år.

## 9. Fra tall til forståelse

Prosjektets hovedprinsipp er at brukeren skal forstå hva tallene betyr. Det gjelder også svarene.

1. Handler svaret om penger over tid, vis minst ett eksempel i kroner. Påvirker prisvekst forståelsen, vis også dagens kroner og si hvilken prisvekst som er brukt.
2. Lenk til kalkulatoren når brukeren kan se poenget ved å endre ett tall, for eksempel at saldoen øker mens kjøpekraften faller. Lag lenken med kalkulatorens delingsfunksjon, ikke for hånd. Åpne den og kontroller at tallene stemmer med eksemplet.
3. Eksempeltall er valgt for eksemplet, og teksten sier det. Bruk runde tall. Skal eksemplet ligne virkeligheten, bruk tall fra registeret og si hvilken periode de gjelder.
4. Et eksempel med jevn vekst forklarer regnemåten, ikke hva som vil skje. Si det én gang ved eksemplet.
5. Regn alle eksempler med kode, og før regnestykket under «Kontrollregning». Si hvor det er avrundet.
6. Skill innskudd fra avkastning og gevinst før skatt fra etter skatt.
7. Gjør aldri en forskjell større enn den er for å få fram poenget.

## 10. Relevans i veilederen (fase 3)

Feltet «Relevant når» bestemmer bare hvilke spørsmål som foreslås først. Det endrer aldri teksten i svaret: alle får samme svar (testen i `tests/svarmal.test.cjs`). Alle temaer er tilgjengelige for alle. Vilkårene står i docs/regulatorisk.md, «Sperrer som gjelder også etter oppstart».

Bruk bare signaler fra opplysninger brukeren faktisk har fylt inn:

| Signal | Kommer fra | Finnes i koden |
| --- | --- | --- |
| `alder` med grense, for eksempel `alder ≤ {{bsuMaxAge}}` | Kalkulatoren eller veilederen | Ja (`dist/veileder-context.js`) |
| `sparetid` med grense, for eksempel `sparetid < {{fundMinYears}}` | Kalkulatoren, sparemålet eller veilederen | Ja |
| `risiko = lav`, `middels` eller `høy` | Brukerens valg | Ja |
| `eier bolig`, `dyr gjeld`, `buffer`, `betaler skatt`, `usikker inntekt` | Veilederens felt | Ja |
| `kalkulator = sparing`, `sparemål` eller `uttak` | Hvilken del brukeren kom fra | Nei, krever egen PR |
| `månedssparing` med grense | Kalkulatoren | Nei, krever egen PR |

Regler:

- En grense fra en kilde hentes fra registeret, for eksempel `{{fundMinYears}}` (Forbrukerrådet). En grense uten kilde merkes «redaksjonell» og godkjennes av Lars.
- Begrunnelsen som vises, nevner bare opplysningen brukeren ga: «Vises først fordi du har oppgitt sparetid 2 år.» Aldri en slutning om personen, som «fordi du er nær pensjon» eller «fordi du er ung».
- Signaler kombineres med «og». Høyst to signaler per svar, så det er lett å forklare.
- Feltet er data til fase 3 bygges. Visningen er en egen PR som Lars godkjenner.

## 11. Vedlikeholdsklasser

| Klasse | Gjelder | Utløser gjennomgang |
| --- | --- | --- |
| A | Begreper og regnemåter uten satser | Hver 12. måned |
| B | Regler og satser: skatt, BSU, ASK, IPS, Lånekassen, lån og bolig | Statsbudsjettet, før 1. januar, før 1. juli, Kildevakt-sak og `python3 scripts/fakta.py frister` |
| C | Statistikk, for eksempel SSB-renter og prisvekst | Tallet oppdateres fra registeret. Teksten hver 12. måned, og når en serie revideres, mangler eller endrer enhet |
| D | Prognoser og analyser, for eksempel Norges Banks anslag | Ny rapport |

Et svar kan ha flere klasser. Da gjelder alle utløserne. Kalenderen i K7 gjelder i tillegg.

## 12. Stopp og spør Lars

Stopp arbeidet med den delen og still Lars ett konkret spørsmål med alternativer når:

- svaret trenger ny kategori, ny svarform, nytt felt i svarbasen eller en ny funksjon,
- kilder på samme nivå er uenige (K2),
- regelen er foreslått eller vedtatt, men ikke i kraft, og svaret må omtale den (K4),
- spørsmålet bare kan besvares med et personlig råd eller et produktvalg,
- en nødvendig kilde ikke kan åpnes (K1),
- endringen endrer betydningen av et publisert svar,
- et produkt eller en tilbyder må nevnes for at svaret skal forstås,
- temaet krever juridisk tolkning ut over det kilden sier rett ut,
- du er usikker på om noe er tillatt etter docs/regulatorisk.md.

Skriv spørsmålet i «Publiseringssperrer» og sett status `venter`. Fortsett med andre deler av svaret om de ikke avhenger av svaret fra Lars.

## 13. Oppdragstekster

Lim inn teksten og bytt ut `SV-xxx`. Hver tekst står alene og kan gis til en ny økt.

**Skrive et svar**

> Arbeid i gronnlars/spareverksted på fersk main. Les AGENTS.md, SVARSKJEMA.md (hele), KILDEREGLER.md og SPRAKREGLER.md. Lag svarskjema for SV-xxx etter SVARSKJEMA punkt 4B og malen i punkt 5. Les hver kilde i denne økta, og fyll påstandstabellen før teksten. Lever `kilder/svar/SV-xxx.md` i egen gren og PR med status `til kontroll` eller `utkast`. Ikke endre `dist/`, ikke sett `kontrollert` eller `godkjent`, ikke slå sammen. Svar Lars med: svar-ID, status, kilder lest, det du ikke fikk kontrollert og PR-lenke.

**Kontrollere et svar**

> Du har ikke skrevet dette svaret. Arbeid i gronnlars/spareverksted. Les SVARSKJEMA.md, KILDEREGLER.md, SPRAKREGLER.md og `kilder/svar/SV-xxx.md`. Åpne hver kilde. Gå gjennom sjekklisten i SVARSKJEMA punkt 4C, og bekreft hver rad i påstandstabellen mot kilden. Skriv ikke om teksten. Foreslå ny ordlyd der noe er feil. Før én rad i kontrolloggen med resultatet, og beskriv kontrollen som det den er (for eksempel «KI-kontroll i ny økt»). Sett `kontrollert` bare hvis alle tolv punktene er ja.

**Legge inn et godkjent svar**

> Arbeid i gronnlars/spareverksted på fersk main. SV-xxx har status `godkjent`. Følg SVARSKJEMA punkt 4E. Teksten skal være lik skjemaet ord for ord, uten `[Pn]`-merkene. Kjør testene som i `.github/workflows/static.yml`, se siden ved 320 px, 390 px og på PC, og lag PR med det som ikke er testet. Ikke slå sammen.

**Gjennomgå publiserte svar**

> Arbeid i gronnlars/spareverksted på fersk main. Gå gjennom svarene med status `publisert` eller `til gjennomgang` som har passert «Neste kontroll» eller er berørt av en åpen Kildevakt-sak. Følg SVARSKJEMA punkt 4F og 4G og SVARMAL, «Datoer og gjennomgang». Flytt «Sist gjennomgått» bare når alle kilder er lest. Logg i research/ARBEIDSLOGG.md. Endringer i tekst eller tall går til kontroll før Lars godkjenner.

**Nye spørsmål i køen**

> Arbeid i gronnlars/spareverksted på fersk main. Les SPORSMALSKO.md og SVARSKJEMA punkt 4A og 8. Legg inn disse spørsmålene med neste ledige SV-ID-er og utfylt spørsmålskort: <liste>. Slå sammen overlapp med `se SV-xxx`, og behold brukerens ordlyd som søkeinngang. Ingen svartekst i denne oppgaven.

**Kildevakt-sak**

> Arbeid i gronnlars/spareverksted på fersk main. Kildevakt har åpnet sak <nummer>. Følg SVARSKJEMA punkt 4G. Les primærkilden før du endrer noe. Sett berørte svar til `til gjennomgang`. Lever endringer i registeret og svarene i egen PR med kilde, status og gjelder-fra-dato. Ikke slå sammen.

## 14. Eksempel: BSU-svaret i skjemaet (utdrag)

Utdraget viser hvordan et publisert svar ser ut i skjemaet. Teksten er hentet fra `dist/veileder-knowledge.js` på main `4008b01`. **Påstandstabellen er ikke kartlagt ennå.** Det gjøres ved neste reelle gjennomgang, som er første pilot i planen. Ikke kopier datoer eller kontrollstatus herfra.

```markdown
# SV-133: Hva er BSU, og hvordan fungerer ordningen?

## 1. Styring
Svar-ID: q-bsu-basics
Kø-ID-er som dekkes: SV-133
Status: publisert
Svarform: ordning
Kategori: bsu
Søkefamilie: bsu
Regelår: 2026
Vedlikehold: B, C
Først publisert: 2026-10-22
Sist endret: 2026-10-29
Sist gjennomgått: 2026-10-29
Skribent: ChatGPT/Codex, 2026-10-29

## 2. Spørsmål og søk
Tittel: Hva er BSU?
Spørsmål brukere kan stille:
- Hva er BSU?
- Hva betyr BSU?
- Hvordan fungerer boligsparing for ungdom?
Søkeord: bsu, boligsparing
Søkefraser: bsu, boligsparing for ungdom
Dekker ikke: BSU ved flytting til utlandet (kjent hull bsu-flytting)

## 3. Kort svar
BSU betyr boligsparing for ungdom. Du kan spare til og med året du fyller {{bsuMaxAge}} og sette inn opptil {{bsuAnnual}} kroner i året og {{bsuTotal}} kroner totalt. Rentene kommer i tillegg og teller ikke med i innskuddsgrensene. [P1, P2, P3, P4]

## 5. Fordeler og ulemper
- Fordel: Lavere skatt
  Du kan få {{bsuPercent}} prosent av årets innskudd i skattefradrag, maksimalt {{bsuMaxDeduction}} kroner. (Teksten fortsetter med vilkårene.) [P5, P6, P7]
- Ulempe: Tilbakebetaling ved annen bruk
  Bruker du tidligere års innskudd til andre formål, bryter du vilkårene og må betale tilbake skattefradrag du tidligere har fått, gjennom økt skatt. (Teksten fortsetter.) [P8]

## 11. Fakta og begreper
Fakta fra registeret: {{bsuMaxAge}}, {{bsuAnnual}}, {{bsuTotal}}, {{bsuPercent}}, {{bsuMaxDeduction}}, {{bsuRate}}, {{bsuRate.periode}}, {{bsuRate.hentet}}

## 14. Påstandstabell
| Nr | Påstand slik den står i teksten | Kilde-ID | Hvor i kilden | Støtter kilden påstanden? | Unntak og usikkerhet |
| --- | --- | --- | --- | --- | --- |
| P1 | Kan spare til og med året du fyller {{bsuMaxAge}} | tax-bsu (fra registeret) | ikke kartlagt | ikke kontrollert i denne økta | |
| P2 | Opptil {{bsuAnnual}} kroner i året | tax-bsu (fra registeret) | ikke kartlagt | ikke kontrollert i denne økta | |

## 17. Kontrollogg
| Dato | Hvem | Rolle | Hva ble kontrollert | Resultat |
| --- | --- | --- | --- | --- |
| 2026-10-29 | ChatGPT/Codex | skribent | Kilder lest, egenkontroll (fra svarets kontrolltekst) | Ikke ført per punkt |
```

Lengden på fordelen «Lavere skatt» er 55 ord, over veiledningen på 45. Vilkårene om skatt og boligeie kan ikke kuttes. Det er en begrunnet overskridelse og føres i kontrolloggen ved neste gjennomgang.
