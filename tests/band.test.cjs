// Utfallsrom for indeksfond etter Finans Norges formelverk, kontrollert uavhengig av motoren.
// Kilde: Finans Norge, Avtale om avkastningsprognoser, revidert 04.02.2026, vedlegg 2:
// hvert innskudd j får årlig avkastning r + Z·σ/√(t − j), Z = ±1,96 for 95 %.
const assert=require('node:assert/strict');
const E=require('../dist/engine.js'),A=require('../dist/assumptions.js'),M=require('../dist/meaning.js');
const near=(a,b,label,tol=1e-9)=>assert.ok(Number.isFinite(a)&&Math.abs(a-b)<=Math.max(1,Math.abs(b))*tol,`${label}: ${a} vs ${b}`);
const base={...E.defaults,crash:0,extra:0,growth:0};
const sigma=A.index.sigma;

// 1. Kildetallene: 4,5 % realavkastning og 16 % svingning for aksjer. Nominell vekst = realavkastning pluss prisvekst.
assert.equal(A.index.realRate,4.5);assert.equal(sigma,16);
assert.equal(A.indexRate(2.5),7.11);assert.equal(A.indexRate(2),6.59);assert.equal(A.indexRate(0),4.5);
assert.equal(A.savings.rate,2.87);assert.equal(A.checking.rate,0);

// 2. Engangsbeløp: lukket formel startbeløp · (1 + r + Z·σ/√T)^T · (1 − k)^T.
for(const T of [1,3,10,25,40])for(const Z of [-1.96,0,1.96]){const s={...base,start:100000,monthly:0,rate:7.11,fee:0.2,years:T};
 near(E.band(s,T,Z,sigma),100000*(1+0.0711+Z*0.16/Math.sqrt(T))**T*(1-0.002)**T,`engangsbeløp ${T} år, Z ${Z}`);}

// 3. Månedlige innskudd: egen løkke med potenser (ikke logaritmer). Innskudd som står under ett år får ett års usikkerhet.
function loop(s,Z){const n=Math.round(s.years*12);let v=s.start*((1+s.rate/100+Z*sigma/100/Math.sqrt(Math.max(n/12,1)))*(1-s.fee/100))**(n/12);
 for(let m=1;m<=n;m++){const h=(n-m)/12,r=s.rate/100+Z*sigma/100/Math.sqrt(Math.max(h,1));v+=s.monthly*(1+s.growth/100)**((m-1)/12)*((1+r)*(1-s.fee/100))**h;}return v;}
for(const years of [0.5,3,10,30])for(const Z of [-1.96,1.96]){const s={...base,start:5000,monthly:2000,growth:2,rate:7.11,fee:0.2,years};near(E.band(s,years,Z,sigma),loop(s,Z),`månedlig ${years} år, Z ${Z}`,1e-8);}

// 4. Med Z = 0 er båndet lik den vanlige beregningen, også med ekstrainnskudd og børsfall.
let seed=7;const rnd=()=>((seed=(seed*16807)%2147483647)-1)/2147483646;
for(let i=0;i<200;i++){const s={...base,start:rnd()*1e6,monthly:rnd()*2e4,growth:rnd()*6-3,rate:rnd()*12-2,fee:rnd()*2,years:Math.round(rnd()*480+1)/12,extra:i%2?rnd()*1e5:0,extraYear:Math.round(rnd()*240)/12,crash:i%3?rnd()*60:0,crashYear:Math.round(rnd()*240)/12};
 near(E.band(s,s.years,0,sigma),E.value(s,s.years),'Z = 0 lik value '+i,1e-9);
 assert.ok(E.band(s,s.years,-1.96,sigma)<=E.value(s,s.years)+1e-6&&E.band(s,s.years,1.96,sigma)>=E.value(s,s.years)-1e-6,'midten ligger mellom grensene '+i);
 assert.ok(E.band(s,s.years,-1.96,sigma)>=0,'aldri negativ '+i);}

// 5. Kort sparetid er mer usikkert. Engangsbeløp med 7,11 %: tap i nedre del etter 3 år, gevinst i nedre del etter 25 år.
{const s={...base,start:100000,monthly:0,fee:0,rate:7.11};
 const low=y=>E.band({...s,years:y},y,-1.96,sigma)/100000,annual=y=>low(y)**(1/y)-1;
 assert.ok(low(3)<1,'3 år: nedre del under innskuddet');assert.ok(low(25)>1,'25 år: nedre del over innskuddet');
 assert.ok(annual(3)<annual(10)&&annual(10)<annual(25),'snittavkastningen i nedre del blir bedre jo lengre tid');}

// 6. Forklaringen bruker båndet og sparetiden.
{const f={money:x=>Math.round(x)+' kr',pct:v=>v+' %',years:t=>t+' år'};
 const short=M.build(E,{...base,start:100000,monthly:0,fee:0,rate:7.11,years:3,savingsType:'index'},3,f,A);
 assert.match(short.main,/Et indeksfond kan falle mye/);assert.match(short.details.at(-1).text,/Med 3 år sparetid kan verdien også ende under det du har satt inn/);
 const long=M.build(E,{...base,start:100000,monthly:0,fee:0,rate:7.11,years:25,savingsType:'index'},25,f,A);
 assert.match(long.details.at(-1).text,/Med 25 år sparetid ligger også den nedre delen av utfallsrommet over innskuddene/);assert.match(long.details.at(-1).text,/ikke en garanti/);
 assert.match(long.details.at(-1).text,/Finans Norges standard for avkastningsprognoser/);
 const none=M.build(E,{...base,start:100000,monthly:0,fee:0,rate:7.11,years:3,savingsType:'savings'},3,f,A);assert.doesNotMatch(none.main,/utfallsrom/);}
console.log('Passed: index fund outcome range follows the Finans Norge formula and depends on the horizon.');
