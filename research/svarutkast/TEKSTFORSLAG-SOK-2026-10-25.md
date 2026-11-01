# Tekstforslag for ingen treff og nekting

Avventer Lars sin godkjenning. Ikke lagt inn i `dist/veileder-ui.js`.
Arbeidsgrunnlag: main f9c553a, som allerede inneholder #63. Dette er grensesnittmeldinger, ikke økonomiske råd.

| Situasjon | Foreslått tekst |
| --- | --- |
| Ingen treff (`none`) | Vi fant ikke et ferdig svar som passer til det du skrev. Prøv andre ord, eller velg et tema. |
| Kjent innholdshull (`uncovered`) | Vi har ikke et eget svar på «{emne}» ennå. Du kan se beslektede temaer nedenfor, men de besvarer ikke hele spørsmålet ditt. |
| Bare et avvist tema gjenkjennes (`negated`) | Du skriver at du ikke ønsker «{ord}». Vi har ikke funnet et ferdig svar som passer til resten av det du skrev. Velg et tema, eller skriv hva du vil vite mer om. |
| Et annet tema får treff, mens ett er avvist (`negNote`) | «{ord}» er utelatt fra treffene fordi du skriver at du ikke ønsker det. |

Forbehold ved nekting: Dagens kode finner ord etter blant annet «ikke», «uten» og «bortsett». Den forstår ikke setningen fullt ut. «Jeg ønsker ikke fond», «ikke lån» og «uten fond» passer til formuleringen. Lengre setninger og «ikke alle fond» må vurderes før teksten tas i bruk. Ikke si at hele temaet er fjernet dersom koden bare har utelatt et ord. Forslaget til `negNote` må derfor avvente denne kontrollen.

Når et kjent hull ikke har beslektede treff, må teksten avsluttes etter «ennå», og deretter vise temavelgeren. Ikke vis «nedenfor» uten relevante knapper. For nekting må treff merket `negated` fortsatt være tydelig merket som beslektede temaer, ikke svar. Ingen foreslått tekst endrer rangering, automatisk åpning eller søkelogikk.

## Angrepsflater og reparasjoner

1. «Ingen treff» kan høres ut som at svaret umulig finnes. Forslaget sier at søket ikke fant et passende ferdig svar.
2. Beslektede temaer kan forveksles med et svar. Kjent hull sier uttrykkelig at de ikke besvarer hele spørsmålet.
3. Nekting kan gi et falskt inntrykk av språkforståelse. Korte, konkrete setninger må testes; ikke omtale dette som forståelse av brukerens hensikt.
4. «Utbytte uten skatt» betyr noe annet enn «uten utbytte». Kontroller hva som faktisk nektes før disse ordene interpoleres.

## Korrektur og godkjenning

Ingen navn, beløp eller økonomiske satser. Ingen tankestrek, tre prikker eller fagordet «nekting» i produktteksten. Plassholderne er redaksjonelle og skal aldri vises bokstavelig. Tekstforslagene er ikke implementert eller testet i nettleser. Lars godkjenner ordlyden før innlegging. iPhone Safari og VoiceOver kontrolleres etter eventuell integrasjon.
