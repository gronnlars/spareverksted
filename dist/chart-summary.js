// «Slik leser du grafen»: beskriver i ord hva grafen viser, for dem som ikke ser den.
// Retter UU-feilen fra ekstern skjermlesertest 28.10.2026 (WCAG 1.1.1): grafen hadde bare sluttbeløp og akser i tekst.
// Regelbasert og uten KI. Funksjonene er rene, slik at de kan testes uten nettleser, og kan gjenbrukes senere.
(function(root){
'use strict';
const at=(points,t)=>{let best=points[0];for(const p of points)if(Math.abs(p.t-t)<Math.abs(best.t-t))best=p;return best.v;};
const yearText=t=>{const y=Math.max(1,Math.ceil(t-1e-9));return 'år '+y;};

// Beskrivelse av hovedgrafen.
// d: {main:{name,points}, paid?:{points}, real?:{points}, low?, high?, bank?, comparisons?:[{name,end}], maxTime, nominal:boolean}
// f: {money, period}
function savings(d,f){
 const out=[],m=d.main.points;if(!m||m.length<2)return '';
 const v0=m[0].v,vEnd=m.at(-1).v,period=f.period(d.maxTime),both=!!d.real;
 // 1. Hva grafen viser.
 if(both)out.push(`Grafen viser to linjer over ${period}: beløpet i kroner og hva det kan kjøpe målt i dagens kroner.`);
 else out.push(`Grafen viser ${d.main.name.toLowerCase()} over ${period}`+(d.paid?', sammen med en linje for det du selv setter inn.':'.'));
 // 2. Start og slutt.
 out.push(`${both?'Kronebeløpet':'Beløpet'} går fra ${f.money(v0)} til ${f.money(vEnd)}.`);
 // 3. Formen på linjen. Beskriver bare det som synes, ikke årsaken.
 let drop=null;for(let i=1;i<m.length;i++){const a=m[i-1].v,b=m[i].v;if(a>0&&(a-b)/a>0.1&&(!drop||(a-b)/a>drop.r))drop={r:(a-b)/a,t:m[i].t};}
 const mid=at(m,d.maxTime/2),g1=mid-v0,g2=vEnd-mid;
 if(vEnd<v0-0.5)out.push('Linjen synker over perioden.');
 else if(Math.abs(g1)+Math.abs(g2)<1)out.push('Linjen ligger flatt.');
 else if(g1>=0&&g2>1.25*g1)out.push('Linjen blir brattere mot slutten: beløpet øker mer i siste halvdel av perioden enn i første.');
 else if(g2>=0&&g2<0.8*g1)out.push('Linjen flater ut mot slutten: beløpet øker mindre i siste halvdel av perioden enn i første.');
 else out.push('Linjen stiger omtrent jevnt.');
 if(drop)out.push(`Den har et tydelig fall rundt ${yearText(drop.t)}.`);
 // 4. Avstanden til innskuddene. Bare i kroner, der avstanden er beregnet avkastning.
 if(d.paid&&!both){const p=d.paid.points,pEnd=p.at(-1).v;
  if(vEnd<pEnd-0.5)out.push(`Til slutt ligger beløpet ${f.money(pEnd-vEnd)} under linjen for det du har satt inn.`);
  else if(d.nominal&&pEnd>0.5){const cross=m.find((r,i)=>p[i]&&p[i].v>0.5&&r.v-p[i].v>=p[i].v);
   if(cross&&cross.t>0)out.push(`Avstanden mellom linjene er beregnet avkastning. Fra rundt ${yearText(cross.t)} er den større enn det du selv har satt inn.`);
   else out.push(`Avstanden mellom linjene er beregnet avkastning. Til slutt er den ${f.money(Math.max(0,vEnd-pEnd))}.`);}
 }
 // 5. Kroner og kjøpekraft.
 if(both){const r=d.real.points.at(-1).v;out.push(`Avstanden mellom linjene viser hvor mye prisveksten tar av det beløpet kan kjøpe. Til slutt er den ${f.money(Math.max(0,vEnd-r))}, og kjøpekraften er ${f.money(r)}.`);}
 // 6. Bånd, bank og sammenligninger.
 if(d.low&&d.high)out.push(`Det skraverte båndet viser et lavere og et høyere regneeksempel. Til slutt går det fra ${f.money(d.low)} til ${f.money(d.high)}.`);
 if(Number.isFinite(d.bank))out.push(`Linjen for bank ender på ${f.money(d.bank)}.`);
 if(d.comparisons&&d.comparisons.length)out.push('Grafen viser også lagrede planer: '+d.comparisons.map(c=>`${c.name}, som ender på ${f.money(c.end)}`).join('; ')+'.');
 out.push('Linjene er regneeksempler, ikke garantier. Tallene år for år finner du med knappen «Tabell» over grafen.');
 return out.join(' ');
}

// Beskrivelse av uttaksgrafen. r: resultatet fra E.withdrawal. capital: beløpet ved uttaksstart.
function withdrawal(r,capital,f){
 if(!r||!r.points||!r.points.length)return '';
 const end=r.points.at(-1).balance,out=[`Grafen viser pengene som er igjen gjennom ${r.n} år med uttak. Saldoen går fra ${f.money(capital)} til ${f.money(end)}.`];
 if(Number.isFinite(r.exhausted)&&r.exhausted<=r.n)out.push(`Linjen når null etter ${r.exhausted} år. Da er pengene brukt opp.`);
 else if(end>capital+0.5)out.push('Linjen stiger, fordi beregnet avkastning er større enn uttakene.');
 else out.push('Linjen synker, men pengene varer hele perioden i dette regneeksempelet.');
 out.push('Dette er et regneeksempel med jevn avkastning, ikke en garanti.');
 return out.join(' ');
}

const S={savings,withdrawal};
if(typeof module!=='undefined')module.exports=S;else root.ChartSummary=S;
})(this);
