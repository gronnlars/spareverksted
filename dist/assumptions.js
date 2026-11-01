// Forutsetninger per spareform, med kilde og kontrolldato. Én fil, så tallene kan vedlikeholdes samlet.
// Vedlikehold: kontroller etter Finans Norges årlige revisjon av prognosestandarden (vanligvis februar)
// og når SSB publiserer nye innskuddsrenter. Endre kontrolldatoen når tallene er sjekket.
(function(root){
'use strict';
const A={
 checked:'23.10.2026',
 nextReview:'februar 2027',
 // Brukskonto: SSB har ingen egen serie for brukskontorente. 0 % er et regneeksempel, ikke en statistikk.
 checking:{rate:0,fee:0,
  note:'Renten 0 % er et regneeksempel for brukskonto. Bruk kontoens rente hvis du kjenner den.',
  undo:'Rente satt til 0 % og kostnad til 0 %.'},
 // Sparekonto: gjennomsnittlig rente på ikke-bundne innskudd for husholdninger. Et gjennomsnitt for hele
 // beholdningen ved månedsslutt, ikke den beste sparekontoen, og ikke bare sparekontoer.
 savings:{rate:2.87,fee:0,period:'august 2026',
  source:{name:'SSB tabell 11018: renter på ikke-bundne innskudd, husholdninger',url:'https://www.ssb.no/statbank/table/11018/',updated:'25.09.2026'},
  note:'Renten 2,87 % er gjennomsnittet for husholdningers innskudd uten binding (SSB, august 2026), ikke beste tilgjengelige rente. Bruk kontoens rente hvis du kjenner den.',
  undo:'Rente satt til 2,87 % og kostnad til 0 %.'},
 // Indeksfond: Finans Norges avtale om avkastningsprognoser, revidert 04.02.2026, gjeldende fra 11.02.2026.
 // Aksjer: 4,5 % forventet realavkastning (geometrisk) og 16 % årlig standardavvik. Formelverket (vedlegg 2)
 // gir et 95 % utfallsrom der hvert innskudd får avkastningen r ± 1,96·σ/√(år til slutt).
 index:{realRate:4.5,sigma:16,
  source:{name:'Finans Norge: Avtale om avkastningsprognoser, revidert 04.02.2026',url:'https://www.finansnorge.no/siteassets/dokumenter/avtaler/avtale-om-avkastningsprognoser_revidert-04.02.2026_ikrafttredelse-11.02.2026.pdf'}},
 // Skatt på renter og andre kapitalinntekter (alminnelig inntekt) for personer, inntektsåret 2026.
 // Brukes bare i forklaringstekst, ikke i beregningene. Se beslutningsnotatet om skatt.
 tax:{interest:22,year:2026,
  source:{name:'Skatteetaten: satser 2026',url:'https://www.skatteetaten.no/satser/faktor-for-oppjustering-av-gevinsttap-eller-utbytte-pa-aksjer/?year=2026'}},
 // Nominell vekst for indeksfond: realavkastningen lagt til planens prisvekst, avrundet til to desimaler.
 indexRate(inflation){return Math.round(((1+A.index.realRate/100)*(1+inflation/100)-1)*10000)/100;}
};
if(typeof module!=='undefined')module.exports=A;else root.Assumptions=A;
})(this);
