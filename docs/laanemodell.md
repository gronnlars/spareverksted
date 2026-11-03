# Lånemodell

Teknisk beskrivelse av lånekalkulatorens regnemotor, `dist/laan-motor.js`. Opprettet 3. november 2026. Beslutningen og alternativene står i [BESLUTNINGER.md](../BESLUTNINGER.md), «Lånekalkulator v1».

Status: motoren brukes av `laan.html` (siden), `laan.js` (skjema og graf) og `laan-tekst.js` (resultat og grafbeskrivelse i ord). Referanserentene og effektiv rente kommer i egne PR-er. Rentefeltet står tomt til brukeren fyller inn sin egen rente.

## Regnereglene

1. **Terminer.** Månedlige terminer i etterskudd. Første termin er én måned etter utbetaling.
2. **Rente per termin.** Nominell årsrente delt på 12. Feltet tar bare nominell rente. Effektiv rente inneholder gebyrer og gir feil resultat om den skrives inn her.
3. **Annuitetslån.** Terminbeløp (rente + avdrag) = L · i / (1 − (1 + i)^−n), der L er lånebeløpet, i renten per termin og n antall terminer. Ved 0 % rente: L / n. Motoren regner nevneren som −expm1(−n · ln(1 + i)), som holder presisjonen også ved svært lav rente. Den vanlige skrivemåten mister presisjon der og ga feil terminbeløp ved for eksempel 0,0000000001 % (funnet av GPT 3.11.2026, rettet før sammenslåing).
4. **Serielån.** Fast avdrag L / n. Renten regnes av restgjelden, så terminbeløpet synker.
5. **Avrunding.** Ingen i beregningen. Siden avrunder til hele kroner. Summer regnes av uavrundede tall, så en tabell med avrundede tall kan avvike med 1 kr fra summen.
6. **Siste termin.** Hele restgjelden, pluss påløpt rente og termingebyr. Den kan være mindre enn de andre.
7. **Ekstra innbetaling.** Betales etter terminen. Annuitetslån beholder gjeldende terminbeløp, serielån beholder avdraget. Løpetiden blir kortere. Innbetalingen begrenses til restgjelden. Er lånet innfridd, løper ingen rente eller gebyrer etterpå.
8. **Renteendring.** Annuitetslån får nytt terminbeløp beregnet over gjenværende løpetid: antall terminer igjen i planen slik den er når renten endres. En tidligere ekstra innbetaling er altså regnet med. Serielån beholder avdraget, bare renten endres.
9. **Samme termin.** Ny rente gjelder hele terminen. Deretter betales terminen, deretter den ekstra innbetalingen.
10. **Gebyrer.** Etableringsgebyret betales ved utbetaling. Termingebyret betales hver termin og endrer ikke restgjelden. Rente regnes bare av lånet, ikke av gebyrene.
11. **Samlet tilbakebetalt** = lånebeløp + rente + gebyrer. De fire delene vises hver for seg.

Hendelser angis i terminer (termin 1 er første betaling). Siden gjør om «fra år X» til termin.

## Grenser

Lånebeløp over 0 og opptil 1 milliard kr. Nominell årsrente fra 0 til 100 %. Nedbetalingstid fra én måned (1/12 år) til 50 år. Tiden regnes i hele måneder: år ganges med 12 og avrundes til nærmeste hele termin. Etableringsgebyr fra 0 til 10 millioner kr og lavere enn lånebeløpet. Termingebyr fra 0 til 100 000 kr. Samme grenser for alle lånetyper. Grensene stopper meningsløse tall og er ingen påstand om vanlig praksis.

## Det motoren gir

- `plan(input)`: hver termin (rente, avdrag, gebyr, ekstra, terminbeløp, totalt betalt og restgjeld), summer, første og siste terminbeløp, terminen lånet er innfridd og merknader (for eksempel at en ekstra innbetaling ble begrenset).
- `byYear(plan)`: summer per år til graf og tabell. Etableringsgebyret står i år 1.
- `flows`: betalingsstrømmen sett fra låntaker. Utbetalt beløp etter etableringsgebyr, deretter alt som betales. Grunnlag for effektiv rente, som beregnes først når regelverket er lest i primærkilden.
- `hiddenActive(input, nivå)`: valg som regnes med, men ikke vises på valgt detaljnivå. Siden viser dem som en kort oppsummering med mulighet til å endre. Forbrukslån viser gebyrene på alle nivåer.

## Kontroller

- `tests/laan-motor.test.cjs`: lukkede formler for annuitet og serie, nullrente, én termin, renteendring, ekstra innbetaling, full innfrielse, begge i samme termin, gebyrer, 400 tilfeldige planer med faste egenskaper (gjelden går til 0, avdragene summerer seg til lånebeløpet, ingen gebyr etter innfrielse), svært lave renter der betalingsforløpet sammenlignes med nullrentetilfellet termin for termin, grenser og feilmeldinger, detaljnivå.
- `tests/laan-kontroll.test.py`: reglene over skrevet på nytt i Python med Decimal, og sammenlignet termin for termin med motoren for 105 planer, blant dem svært lave renter (fra 0,000000000000001 %) med og uten ekstra innbetaling og renteendring.

Eksempel: 3 millioner kr, 5 %, 25 år, uten gebyrer. Annuitetslån gir 17 538 kr per måned og 2 261 310 kr i samlet rente. Serielån gir 22 500 kr i første termin og 1 881 250 kr i samlet rente. Serielånet gir lavere samlet rente fordi gjelden nedbetales raskere, og de første terminene er høyere.

## Ikke med ennå

Effektiv rente (egen PR etter kildekontroll), referanserenter per lånetype, terminbeløp i dagens kroner (v1.1), rentefradrag og skatt, refinansiering, fastrente, lagring og deling.
