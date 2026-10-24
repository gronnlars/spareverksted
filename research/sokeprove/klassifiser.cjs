'use strict';
// Felles klassifisering av ett søkesvar mot én forventning. Brukes av kjor.cjs og sammenlign-prer.cjs.
function klass(c,r){
 const f=c.f||[],ok=c.ok||[],nf=c.nf||[],liste=[r.first,...r.others].filter(Boolean);
 if(c.soft){
  if(r.first&&nf.includes(r.first))return 'WD';
  const dekket=(c.also||[]).every(x=>liste.includes(x));
  return dekket?'soft-dekket':'soft-mangler';
 }
 if(c.none){if(!r.first)return r.kind==='choices'?'FS':'CR';return 'WD';}
 if(r.first){if(nf.includes(r.first))return 'WD';if(f.includes(r.first))return 'RF';if(ok.includes(r.first))return 'RFok';return 'WD';}
 return liste.some(x=>f.includes(x)||ok.includes(x))?'RS':'MISS';
}
module.exports={klass};
