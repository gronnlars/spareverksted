# Kilderegler for Spareverksted

Forslag fra Claude 25.10.2026 etter samtale med Lars. Gjelder for alle bidragsytere, også KI-verktøy, når Lars har godkjent PR-en. Begrunnelsene og alternativene som ble forkastet står i [BESLUTNINGER.md](BESLUTNINGER.md), oppføringene «Kildenivå for påstander og råd» og «Sparehorisont og Forbrukerrådets anbefaling». Språk og tone følger [SPRAKREGLER.md](SPRAKREGLER.md).

Reglene er få med vilje. De har ingen innebygde unntak (se «Når en regel må brytes»).

## K1. Ingen påstand uten kilde

Hver påstand om tall, grenser, regler og anbefalinger har en kilde med URL, kildens dato eller regelår og vår kontrolldato. Mangler vi kilde, skriver vi «ikke avklart» eller utelater påstanden. Vi utelater bare når svaret er til nytte uten den. Har brukeren spurt om akkurat dette, eller kan taushet gi et feil inntrykk, skriver vi «ikke avklart» i stedet for å utelate.

- Tall og regler leses fra kilden i samme arbeidsøkt. Aldri fra hukommelsen, og dette gjelder også KI.
- Det vi ikke vet, skriver vi at vi ikke vet («veit itte»). Vi skiller det vi har funnet fra det vi antar.

## K2. Kilder i prioritert rekkefølge

1. Lov, forskrift og tilsyn (Skatteetaten, Finanstilsynet, SSB).
2. Forbrukerrådet og Finansportalen.
3. Norske bank- og finansinstitusjoner med åpne sider. De har salgsinteresse, så vi bruker dem for deres egne produkter og vilkår, ikke som eneste kilde til generelle råd.
4. Medier med redaksjonelt ansvar. De viser vei til primærkilden og er ikke eneste kilde til tall, regler eller råd. Vi navngir ikke bestemte medier som solide før de er kontrollert mot kriteriene.
5. Alt annet. Brukes aldri.

En kilde høyere opp går foran en lavere når de er uenige. Vi går ned ett nivå bare når nivået over ikke dekker spørsmålet. Er kildene uenige på samme nivå, viser vi begge med kildehenvisning, eller vi skriver «ikke avklart». Vi velger aldri stille mellom dem.

## K3. Tre datoer, hver for seg

Kildens egen dato eller regelår, vår kontrolldato og dato for publisering på nettsiden er tre ulike ting. Vi blander dem aldri. Har siden ingen synlig dato, skriver vi «ingen dato oppgitt på siden». Nivå 3 og 4 krever kildedato.

## K4. Foreslått er ikke vedtatt, og vedtatt er ikke i kraft

Hver endring i regler har en status: foreslått, vedtatt eller i kraft, og en dato for når den gjelder fra. En foreslått endring beskrives med hvem som foreslår og at den ikke er vedtatt. Den brukes aldri som gjeldende regel. Overgangen fra foreslått til vedtatt er en bevisst redigering etter at primærkilden er lest.

## K5. Vi forklarer og siterer, vi gir ikke egne råd

Vi gir ikke råd uten en solid og oppdatert kilde. En anbefaling fra en kilde gjengis som deres anbefaling, for eksempel «Forbrukerrådet anbefaler minst 5 års sparehorisont for aksjefond», og med at den ikke er en regel eller garanti.

## K6. Formuleringer skal være riktige uansett når de leses

Skriv «fra 1. januar 2027», ikke «neste år», «i år», «snart» eller «nylig» i tekst som blir stående. Verdier som endrer seg, som renter og priser, står med «per» og dato eller måned, aldri «i dag» eller «nå», og verdien har kontrolldato i faktaoppføringen. Tekst som skifter etter dato avgjøres i en egen beslutning før den tas i bruk.

## K7. Jevnlig kontroll, og en annen enn forfatteren kontrollerer fristsatte endringer

Kilder gjennomgås jevnlig, og alltid etter statsbudsjettet, før 1. januar og før 1. juli. Prognosene fra Finans Norge følges opp i februar, og SSB-renter når de publiseres. For endringer med ikrafttredelsesdato (satser, grenser, fradrag) kontrollerer en annen enn den som skrev teksten, mot primærkilden. Selvkontroll merkes som selvkontroll. Hver kontrollrunde går også gjennom tabellen «Aktive avvik» øverst i BESLUTNINGER.md. Kontrollkalenderen er en fast del av [research/DAGLIG-OPPGAVE.md](research/DAGLIG-OPPGAVE.md): er en runde forfalt, gjøres den før nye spørsmål.

## Når en regel må brytes

Reglene har ingen unntak i selve teksten. Skal en regel brytes, skjer det som et avvik i BESLUTNINGER.md med disse fire opplysningene og en rad i tabellen «Aktive avvik» øverst i samme fil: hva som avviker, hvorfor, hvem som godkjente (Lars), og utløpsdato. Et avvik utløper på datoen og må fornyes hvis det skal fortsette. Lars fornyer. Den som gjør kontrollrunden varsler ham minst to uker før utløp. Brytes samme regel to ganger av samme grunn, endrer vi regelen i stedet for å samle avvik.

Eksempel: kalkulatoren er fryst, og en endring der som ikke har en av de fire godkjente begrunnelsene er et avvik. Det loggføres, og det får ikke bli en vane.

## Sjekkliste for PR-er som berører tekst

Svar ja eller nei. Ett nei betyr at PR-en ikke er klar.

1. Har hver faktapåstand en kilde med URL, kildens dato eller regelår og vår kontrolldato (K1, K3)?
2. Er kilden på nivå 1 til 4, og er den høyeste tilgjengelige brukt (K2)?
3. Er foreslått, vedtatt og i kraft skilt, med gjelder-fra-dato (K4)?
4. Gir teksten bare det kilden sier, uten eget råd (K5)?
5. Er alle formuleringer riktige også om ett år (K6)?
6. Er endringer med dato kontrollert av en annen enn forfatteren (K7)?
7. Er `?v=` økt for hver endret fil i `dist/` som lastes fra en HTML-side (SOK.md punkt 11)?
8. Er beslutningen loggført i BESLUTNINGER.md med alle alternativer?
