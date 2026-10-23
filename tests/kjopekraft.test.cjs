// Innskudd, sluttverdi og kjøpekraft i dagens kroner, kontrollert uavhengig av beregningsmotoren.
// Kontrollen går måned for måned med et prisindeks P(m) = (1 + prisvekst)^(m/12). Hvert innskudd
// deles på prisindeksen den måneden det settes inn. Startbeløpet settes inn ved m = 0, der P = 1.
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const near=(a,b,label,tol=2e-8)=>assert.ok(Number.isFinite(a)&&Math.abs(a-b)<=Math.max(1,Math.abs(b))*tol,`${label}: ${a} vs ${b}`);
const round=(a,b,label)=>assert.equal(Math.round(a),b,`${label}: ${a}`);

function independent(s){
 const n=Math.round(s.years*12),i=(1+s.inflation/100)**(1/12),g=(1+s.growth/100)**(1/12),e=Math.round(s.extraYear*12);
 let nominal=s.start,today=s.start,p=s.monthly,P=1;
 for(let m=1;m<=n;m++){P*=i;nominal+=p;today+=p/P;p*=g;}
 if(s.extra&&e<=n){nominal+=s.extra;today+=s.extra/((1+s.inflation/100)**(e/12));}
 return {nominal,today,priceLevel:(1+s.inflation/100)**(n/12)};
}
const plan=over=>({...E.defaults,start:0,monthly:0,rate:0,fee:0,growth:0,extra:0,crash:0,inflation:2.5,years:10,...over});

// 1. Engangsinnskudd uten vekst: kronebeløpet står stille, kjøpekraften faller.
{const s=plan({start:100000});const end=E.value(s,10),today=E.depositsToday(s,10),P=1.025**10;
 round(end,100000,'kroner etter 10 år');
 round(today,100000,'startbeløpet er allerede i dagens kroner, ikke 78 120 kr');
 round(end/P,78120,'sluttverdi i dagens kroner');
 round(end/P-today,-21880,'tapt kjøpekraft');}

// 2. Bankkonto med 0,2 % rente: kronene øker, kjøpekraften faller.
{const s=plan({start:100000,rate:0.2});const end=E.value(s,10),P=1.025**10;
 round(end,102018,'kroner på kontoen');round(end/P,79696,'kjøpekraft');round(E.depositsToday(s,10),100000,'innskudd i dagens kroner');
 assert.ok(end>100000&&end/P<100000,'saldo opp, kjøpekraft ned');}

// 3. Månedssparing: 2 000 kr i 10 år, 2 % vekst, 0,2 % kostnad, 2,5 % prisvekst.
// 120 innskudd på 2 000 kr er 240 000 kr. Senere innskudd er verdt mindre i dagens kroner enn tidlige.
{const s=plan({monthly:2000,rate:2,fee:0.2});const end=E.value(s,10),P=1.025**10,today=E.depositsToday(s,10);
 round(end,262492,'sluttverdi i kroner');round(today,212446,'innskudd i dagens kroner');round(today-end/P,7387,'gap i kjøpekraft');
 assert.ok(end>240000,'ingen tap i kroner');assert.ok(today<240000,'innskudd i dagens kroner er under 240 000 kr når prisene stiger');
 round(240000/P,187488,'gammel metode: alle innskudd delt på sluttprisnivået');assert.ok(today-240000/P>24000,'den gamle metoden undervurderte innskuddene med om lag 25 000 kr');}

// 4. Uten prisvekst er innskudd i dagens kroner lik innskuddene i kroner.
{const s=plan({start:50000,monthly:1500,growth:3,extra:20000,extraYear:4,inflation:0,years:12});
 near(E.depositsToday(s,12),independent(s).nominal,'0 % prisvekst');}

// 5. Nominelt tap: 100 000 kr, 0 % vekst, 0,2 % kostnad. Tapet i kroner er 1 982 kr,
// og tapet i kjøpekraft er større fordi prisene også har steget.
{const s=plan({start:100000,fee:0.2});const end=E.value(s,10),P=1.025**10;
 round(end,98018,'sluttverdi');round(100000-end,1982,'tap i kroner');round(E.depositsToday(s,10)-end/P,23429,'tapt kjøpekraft: 100 000 − 100 000 · 0,998^10 / 1,025^10');}

// 6. Ekstra innskudd regnes om med prisnivået da det settes inn.
{const s=plan({start:10000,extra:50000,extraYear:6});near(E.depositsToday(s,10),10000+50000/1.025**6,'ekstra innskudd');}

// 7. Tilfeldige planer mot den uavhengige kontrollen, med og uten prisvekst og vekst i månedssparingen.
let seed=2026;const rnd=()=>((seed=(seed*16807)%2147483647)-1)/2147483646;
for(let k=0;k<300;k++){const s=plan({start:rnd()*1e6,monthly:rnd()*2e4,growth:rnd()*8-4,inflation:k%5?rnd()*6:0,extra:k%3?rnd()*2e5:0,extraYear:Math.round(rnd()*480)/12,years:Math.round(rnd()*600)/12});
 const c=independent(s);near(E.depositsToday(s,s.years),c.today,'dagens kroner '+k,1e-9);
 near(E.raw({...s,rate:0,fee:0},s.years,0,0),c.nominal,'kroner '+k,1e-9);
 assert.ok(E.depositsToday(s,s.years)<=c.nominal+1e-6,'innskudd i dagens kroner er aldri over kronebeløpet når prisveksten er minst 0 % ('+k+')');}

// 8. Kontrolltilfellet fra fase 1-rapporten: 2 000 kr/mnd i 10 år, innskudd ved månedsslutt, 2,5 % prisvekst.
// Innskuddslinjen avhenger bare av innskudd og prisvekst, ikke av vekst eller kostnad.
for(const [rate,fee] of [[0,0],[5,0.2],[2,0.2]]){const s=plan({monthly:2000,rate,fee});
 round(E.depositsToday(s,10),212446,`innskuddenes kjøpekraft ved innbetaling (vekst ${rate} %)`);
 round(E.raw({...s,rate:0,fee:0},10,0,0)/1.025**10,187488,`nominelle innskudd omregnet med sluttprisnivået (vekst ${rate} %)`);
 round(independent(s).nominal,240000,'nominelle innskudd');}

// 9. Samme målestokk i resultatteksten (explain) og innskuddslinjen: kjøpekraftsgapet er innskudd i dagens kroner minus sluttverdi i dagens kroner.
{const s=plan({monthly:2000,rate:2,fee:0.2});const X=E.explain(s,10);near(X.powerGap,E.depositsToday(s,10)-X.real,'powerGap = innskudd i dagens kroner − sluttverdi i dagens kroner',1e-9);}

// 10. Sparetid som ikke er et helt antall måneder: innskudd og prisnivå bruker samme avrundede måned.
{const s=plan({monthly:2000,years:10.04});near(E.depositsToday(s,10.04),independent(s).today,'avrundet måned',1e-9);}

console.log('Passed: deposits and purchasing power in today’s kroner.');
