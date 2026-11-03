'use strict';
// Progressive explanations use the same assumptions at every level.
const SIMPLE_HELP={
 start:'Pengene du allerede har satt av til denne planen. Skriv 0 hvis du begynner fra bunnen.',
 monthly:'Beløpet du setter inn hver måned. Begynn med noe som passer økonomien din. Du kan prøve flere beløp uten å endre noe i banken.',
 years:'Hvor lenge du lar pengene stå og fortsetter å spare. Du kan skrive 0,5 for et halvt år.',
 rate:'Veksten du antar at pengene får på ett år. 5 % betyr at 100 kr blir 105 kr før kostnader. Dette er et regneeksempel, ikke et løfte.',
 inflation:'Når prisene øker, får du mindre for hver krone. Med 2 % prisvekst vil noe som koster 100 kr i dag koste omtrent 102 kr om ett år.',
 fee:'Det du betaler hvert år for å ha pengene investert. 0,2 % av 100 000 kr er 200 kr. Pengene som går til kostnader, får heller ikke vokse videre.',
 growth:'Vil du øke sparingen etter hvert? 0 % betyr samme beløp hver måned. En positiv sats betyr at du setter av mer over tid.',
 goal:'Beløpet du ønsker å nå. «Dagens kroner» betyr at målet øker i takt med prisene, slik at pengene skal kunne kjøpe like mye.',
 annualWithdraw:'Hvor mye du vil ta ut det første året. Kalkulatoren viser også årsbeløpet delt på 12, men beregner selve uttaket én gang i året.',
 withdrawPercent:'Du kan ta ut en andel av det som står igjen, eller bruke en andel av startbeløpet. Den første metoden gir et beløp som endrer seg fra år til år.'
};
const fullOpenHelp=openHelp;
openHelp=function(key){
 if(level==='advanced'||!SIMPLE_HELP[key]){fullOpenHelp(key);return;}
 const [title,body]=HELP[key];$('helpTitle').textContent=title;
 $('helpBody').innerHTML='<p>'+SIMPLE_HELP[key]+'</p><details><summary>'+ (key==='monthly'?'Se statistikk og sammenligning':'Mer om forutsetninger og metode')+'</summary>'+body+'</details>';
 if($('helpAge'))$('helpAge').innerHTML=ageText();
 if($('goAge'))$('goAge').onclick=()=>{$('helpDialog').close();$('ageGroup').closest('details').open=true;$('ageGroup').focus();};
 for(const b of $('helpBody').querySelectorAll('[data-inflation]'))b.onclick=()=>{changePlan({inflation:Number(b.dataset.inflation)},'Prisveksten er endret.');$('helpDialog').close();};
 $('helpDialog').showModal();
};
// Field-level hints explain the four numbers without a compulsory tour.
for(const [id,text]of [['start','Penger som er satt av fra før.'],['monthly','Nye penger du setter inn.'],['years','Tiden frem til du vil bruke pengene.'],['rate','Din antakelse, før kostnader og skatt.']]){const small=document.createElement('small');small.className='field-description';small.id=id+'Description';small.textContent=text;$(id).setAttribute('aria-describedby',small.id);$(id).closest('.field,label').append(small);}
const dreamInflationLabel=$('dreamInflation').closest('.field,label'),prices=document.createElement('details');prices.innerHTML='<summary>Prisvekst for dette kjøpet</summary>';dreamInflationLabel.before(prices);prices.append(dreamInflationLabel);
// Only apply a preset after showing the values it changes; starting capital is preserved.
const PRESETS={
 buffer:{name:'Buffer',cost:30000,years:2,monthly:1200,type:'buffer'},
 car:{name:'Bil',cost:200000,years:5,monthly:3000,type:'car'},
 home:{name:'Egenkapital til bolig',cost:500000,years:7,monthly:5000,type:'home'},
 holiday:{name:'Ferie',cost:30000,years:1,monthly:2500,type:'holiday'},
 renovation:{name:'Oppussing',cost:150000,years:4,monthly:3000,type:'renovation'},
 freedom:{name:'Friår',cost:300000,years:8,monthly:2500,type:'freedom'},
 other:{name:'Ditt eget mål',cost:100000,years:5,monthly:1500,type:'other'}
};
let pendingPreset=null;
$('presetButton').onclick=()=>{pendingPreset=PRESETS[s.dreamType]||PRESETS.other;$('presetTitle').textContent='Eksempel: '+pendingPreset.name;$('presetValues').innerHTML=`<dl class="report-assumptions"><div><dt>Budsjett i dagens priser</dt><dd>${money(pendingPreset.cost)}</dd></div><div><dt>Tid</dt><dd>${pendingPreset.years} år</dd></div><div><dt>Sparing per måned</dt><dd>${money(pendingPreset.monthly)}</dd></div><div><dt>Prisvekst</dt><dd>2,5 %</dd></div></dl><p>Startbeløpet ditt beholdes. Rentene i alternativene settes til 3,5 %, 4,5 % og 6,5 % som illustrasjoner. Kjøpsdatoen settes som fast.</p>`;$('presetDialog').showModal();};
$('cancelPreset').onclick=()=>$('presetDialog').close();
$('applyPreset').onclick=()=>{if(!pendingPreset)return;changePlan({dreamType:pendingPreset.type,dreamCost:pendingPreset.cost,dreamYears:pendingPreset.years,dreamMonthly:pendingPreset.monthly,dreamInflation:2.5,dreamReal:true,dreamFlexible:false,dreamSafe:3.5,dreamModerate:4.5,dreamRisk:6.5},'Eksemplet for '+pendingPreset.name.toLowerCase()+' er lagt inn.');$('presetDialog').close();};
// Report generation snapshots all relevant assumptions, including hidden ones.
const labelMap=Object.fromEntries(Object.values(specs).flat().map(([k,label,unit])=>[k,{label,unit}]));
function assumptionRows(keys,state=s){return '<div class="report-assumptions">'+keys.map(k=>{const meta=labelMap[k]||{label:k,unit:''};return '<div><span>'+escapeHTML(meta.label)+'</span><b>'+escapeHTML(typeof state[k]==='number'?dec.format(state[k]):state[k])+' '+meta.unit+'</b></div>';}).join('')+'</div>';}
function reportChart(){const svg=$('chart').querySelector('svg');if(!svg)return '';return '<div class="report-chart">'+svg.outerHTML.replaceAll('spareArea','reportArea').replaceAll('plotClip','reportClip').replace('id="chartGuide"','id="reportGuide"')+'</div><ul class="legend">'+$('chartLegend').innerHTML+'</ul>';}
function cleanComparisonHTML(){return $('comparison').innerHTML.replace(/<div class="cmp-actions[^"]*">[\s\S]*?<\/div>/g,'').replace(/<label class="check cmp-current">[\s\S]*?<\/label>/,'').replace(/<button type="button" class="cmp-key"[^>]*>/g,'<span class="cmp-key">').replace(/<\/button>/g,'</span>').replace(/<p id="cmpDetail"[^>]*>[\s\S]*?<\/p>/,'');}
function comparisonReport(now){const dreams=window.lastCompare.kind==='dreams';let html=`<div class="report-heading"><p class="eyebrow">SPAREVERKSTED</p><h2>${dreams?'Sparemål sammenlignet':'Planer sammenlignet'}</h2><p>${window.lastCompare.names.map(escapeHTML).join(', ')}</p><p>Beregnet ${now} · Regneeksempel før skatt</p></div><div class="report-block"><div class="report-comparison">${cleanComparisonHTML()}</div><p class="report-footnote">${escapeHTML($('comparisonNote').textContent)}</p></div>`;html+=dreams?'<div class="report-block"><h3>Slik leses det</h3><p>Søylene viser hvor mye du må spare per måned for å nå målet med hvert alternativ. Lavere søyle betyr at du regner med høyere avkastning, ikke at målet er sikrere. Med kort tid eller fast kjøpsdato kan et fall rett før kjøpet gi underskudd.</p></div>':'<div class="report-block"><h3>Slik leses det</h3><p>Søylene viser beløpet ved hvert tidspunkt med jevn avkastning. Stripet del betyr at planen er forlenget, som om du sparer likt videre etter planens slutt.</p></div>';return html+'<div class="report-block"><p class="report-footnote">Jevn avkastning er en forenkling. Ingen markedsavkastning er garantert. Alle beløp er før skatt.</p></div>';}
function buildReport(){
 E.validate(s);if(!$('error').hidden)throw Error('Rett tallene før du lager rapporten.');
 const t=endYear(s),final=E.value(s,t),now=new Date().toLocaleDateString('nb-NO',{year:'numeric',month:'long',day:'numeric'});
 const type=s.activePage==='dreams'?'Sparemål':s.activePage==='withdrawals'?'Uttaksplan':'Spareplan';
 if(window.reportComparisonOnly&&window.lastCompare)return comparisonReport(now);
 let html=`<div class="report-heading"><p class="eyebrow">SPAREVERKSTED</p><h2>${type}</h2>${typeof activePlan!=='undefined'&&activePlan&&saved.includes(activePlan)?'<p>Plan: '+escapeHTML(activePlan.name)+(planDirty()?' (ikke lagret)':'')+'</p>':''}<p>Beregnet ${now} · Regneeksempel før skatt</p></div>`;
 if(s.activePage==='dreams'){
 const plans=E.dreamPlans(s);const labels={car:'Bil',home:'Bolig / egenkapital',holiday:'Ferie',renovation:'Oppussing',freedom:'Friår',buffer:'Buffer',other:'Eget mål'};
 html+=`<div class="report-result"><span>${labels[s.dreamType]||'Sparemål'}</span><strong>${money(plans[0].goal)}</strong><p>Behov om ${dec.format(plans[0].plan.years)} år. ${s.dreamReal?'Budsjettet er justert for valgt prisvekst.':'Budsjettet er et fast fremtidig beløp.'}</p></div><p>Startbeløp: ${money(s.dreamStart)}. Månedssparing: ${money(s.dreamMonthly)}. Budsjett: ${money(s.dreamCost)}${s.dreamReal?' i dagens priser':''}. Prisvekst: ${dec.format(s.dreamInflation)} %. Kjøpsdato ${s.dreamFlexible?'kan utsettes':'er fast'}.</p><div class="report-table" role="region" aria-label="Alternativer for sparemålet" tabindex="0"><table><thead><tr><th>Alter&shy;nativ</th><th>Av&shy;kastning¹</th><th>Nød&shy;vendig per måned, kr</th><th>Med ditt bud&shy;sjett, kr</th><th>Stress&shy;test², kr</th></tr></thead><tbody>${plans.map((p,i)=>`<tr><td>${['Lavere risiko','Moderat risiko','Høyere risiko'][i]}</td><td>${dec.format(p.rate)} %</td><td>${bare(Math.ceil(p.required))}</td><td>${bare(p.end)}</td><td>${bare(p.stressed)}</td></tr>`).join('')}</tbody></table></div><p class="report-footnote">¹ Etter kostnader, før skatt. ² Bank med 0 % rente gjennom perioden, eller et fall på henholdsvis 15 % og 35 % rett før kjøpet. Ikke sannsynligheter eller største mulige tap. Prisvekst kan avvike fra forutsetningen.</p>`+(plans.some(p=>dreamDiscouraged(p,s))?`<p><strong>${plans.filter(p=>dreamDiscouraged(p,s)).map(p=>({moderate:'Moderat',risk:'Høyere'})[p.id]+' risiko').join(' og ')} kan gi underskudd her.</strong> ${escapeHTML(dreamCaution(plans.find(p=>dreamDiscouraged(p,s)),s))}</p>`:`<p>Kjøpet kan utsettes, så et fall før kjøpet kan hentes inn ved å vente. Det er ikke garantert.</p>`);
 }else{
 html+=`<div class="report-result"><span>Etter ${dec.format(t)} år med sparing</span><strong>${money(final)}</strong><p>${money(final/inflation(t))} i dagens kjøpekraft. Egne innskudd: ${money(nominalPaid(t))}.</p></div><p>Spareform: ${escapeHTML({checking:'Brukskonto',savings:'Sparekonto',index:'Indeksfond'}[s.savingsType]||'ikke valgt')}.</p>`+assumptionRows(['start','monthly','years','rate','inflation','fee',...(s.growth?['growth']:[]),...((view.showGoal||mode==='goal')?['goal']:[]),...(view.showBank?['bank']:[]),...(view.showRange?['spread']:[]),...(s.extra?['extra','extraYear']:[]),...(s.crash?['crash','crashYear']:[])]);
 html+=`<p class="report-footnote">${(view.showGoal||mode==='goal')?'Målet er '+(s.goalReal?'i dagens kroner':'et fast fremtidig kronebeløp')+'. ':''}Grafen viser ${s.real?'dagens kjøpekraft':'fremtidige kroner'}${s.log?' på logaritmisk skala':''}.</p>`+reportChart();
 if(s.activePage==='withdrawals'){
 const r=E.withdrawal(s,final);html+='<div class="report-block"><h3>Uttak etter spareperioden</h3>'+assumptionRows(['retireYears',...(['amount','duration'].includes(s.withdrawMode)?['annualWithdraw']:[]),...(s.withdrawMode==='percent'?['withdrawPercent']:[]),...(s.extraWithdraw?['extraWithdraw','extraWithdrawYear']:[])])+`<p>Valg: ${escapeHTML($('withdrawMode').selectedOptions[0].textContent)} ${s.withdrawMode==='percent'?'Prosentgrunnlag: '+escapeHTML($('withdrawBase').selectedOptions[0].textContent)+'. ':''}Årsbeløpet ${r.remaining?'følger gjenværende saldo':s.withdrawInflation?'prisjusteres fra år 2':'prisjusteres ikke'}. Ekstrauttaket ${s.extraWithdrawInflation?'prisjusteres fra uttaksstart':'prisjusteres ikke'}.</p><p>Første uttak: <b>${money(r.first.actual)}</b>. Totalt tatt ut: <b>${money(r.last.total)}</b>. Igjen etter ${r.n} år: <b>${money(r.last.balance)}</b>, omtrent ${money(r.last.balance/inflation(t+r.n))} i dagens kjøpekraft.</p><p>Uttak skjer én gang ved slutten av hvert år, etter avkastning. Dette er ikke en trygg uttaksrate. Fall tidlig i perioden kan gi dårligere utfall.</p><div class="report-chart">${$('withdrawChart').innerHTML}</div></div>`;
 }
 const comparisons=selectedComparisons();if(comparisons.length){html+='<div class="report-block"><h3>Sammenligning</h3><div class="report-comparison">'+$('comparison').innerHTML.replace(/<div class="cmp-actions[^"]*">[\s\S]*?<\/div>/g,'').replace(/<label class="check cmp-current">[\s\S]*?<\/label>/,'').replace(/<button type="button" class="cmp-key"[^>]*>/g,'<span class="cmp-key">').replace(/<\/button>/g,'</span>').replace(/<p id="cmpDetail"[^>]*>[\s\S]*?<\/p>/,'')+'</div><p class="report-footnote">'+escapeHTML($('comparisonNote').textContent)+'</p></div>';for(const c of comparisons)html+='<div class="report-block"><h3>'+escapeHTML(c.name)+': forutsetninger</h3>'+assumptionRows(['start','monthly','years','rate','inflation','fee','growth','extra','extraYear','crash','crashYear'],c.n)+'</div>';}
 html+='<div class="report-block"><h3>Slik kan resultatet forstås</h3>'+$('plainExplanation').innerHTML+'</div>';
 }
 html+='<div class="report-block"><h3>Metode og begrensninger</h3><p>Effektiv årlig vekst etter kostnader = (1 + avkastning) × (1 − kostnad). Månedlige innskudd ved månedsslutt (kalkulatorer som regner ved månedsstart, viser litt høyere tall). Spareøkning fordeles jevnt gjennom året. Dagens kroner = beløpet / (1 + inflasjon)^år. Kostnadseffekten inkluderer tapt rentes rente.</p><p>Jevn avkastning er en forenkling. Ingen markedsavkastning er garantert. Spareutviklingen og ordinære uttaksbeløp er før skatt. Et eventuelt skatteanslag for uttak er en separat forenkling. Fremtidig skjerming, IPS, BSU og formuesskatt er ikke beregnet. Veiledningen er generell.</p><p class="report-footnote">'+reportSources()+escapeHTML(DATA_STATUS)+' Modellen bruker egne forutsetninger, ikke oppdaterte produkttilbud.</p></div>';
 return html;
}
$('reportButton').onclick=()=>{try{const html=buildReport();$('reportPreview').innerHTML=html;$('printReportContent').innerHTML=forPrint(html);$('reportDialog').showModal();}catch(e){notice(e.message);}};
// Utskriftskopien av rapporten (Lars 3.11.2026, PDF-sjekk). Overskriftene flyttes ett nivå opp, slik at PDF-en starter med h1 uten hopp i nivåene.
// Begrepsknappene blir vanlig tekst: en knapp i en PDF kan ikke trykkes på, men blir likevel lest opp som knapp.
function forPrint(html){return html.replaceAll('reportArea','printArea').replaceAll('reportClip','printClip').replaceAll('reportGuide','printGuide').replace(/<(\/?)h([2-6])\b/g,(m,slash,n)=>'<'+slash+'h'+(n-1)).replace(/<button type="button" class="begrep"[^>]*>([\s\S]*?)<\/button>/g,'$1');}
window.forPrint=forPrint;
// «Lagre som PDF» bruker nettleserens utskrift. Chrome og Edge merker PDF-en (overskrifter, avsnitt, tabeller, bokmerker) ut fra det skjermlesere ser.
// Et åpent modalt <dialog> gjør resten av siden inert, og da kom utskriftskopien ikke med i merkingen. Derfor lukkes dialogen mens utskriften lages og åpnes igjen etterpå.
// Sidetittelen blir PDF-ens tittel og forslag til filnavn.
let printRestore=null;
function restoreAfterPrint(){if(!printRestore)return;const r=printRestore;printRestore=null;document.title=r.title;if(!$('reportDialog').open)$('reportDialog').showModal();$('printReport').focus();}
function printReportNow(){const h=$('printReportContent').querySelector('h1');const name=h?h.textContent.trim():'Rapport';const date=new Date().toLocaleDateString('nb-NO',{year:'numeric',month:'long',day:'numeric'});printRestore={title:document.title};document.title=name+', Spareverksted, '+date;$('reportDialog').close();window.print();if(!matchMedia('(hover: none)').matches)setTimeout(restoreAfterPrint,0);}
window.addEventListener('afterprint',()=>setTimeout(restoreAfterPrint,0));
$('closeReport').onclick=()=>$('reportDialog').close();$('printReport').onclick=printReportNow;
// A normal browser print also gets the complete report, rather than a half-hidden interface.
window.addEventListener('beforeprint',()=>{if($('reportDialog').open||printRestore)return;try{$('printReportContent').innerHTML=forPrint(buildReport());}catch{$('printReportContent').textContent='Rapporten kunne ikke beregnes. Rett ugyldige felt og prøv igjen.';}});
fill();render();

$('copyLink').onclick=async()=>{try{await navigator.clipboard.writeText($('shareUrl').value);notice('Lenken er kopiert.');$('copyLink').textContent='Kopiert';}catch{$('shareUrl').select();notice('Trykk Ctrl+C eller hold på teksten for å kopiere lenken.');}};

$('mobileResultButton').onclick=()=>{const target=$('savingsResult');target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});target.focus({preventScroll:true});};
new IntersectionObserver(entries=>$('mobileSummary').classList.toggle('is-visible',!entries[0].isIntersecting),{threshold:.2}).observe(document.querySelector('.hero-result'));

$('share').addEventListener('click',()=>{$('copyLink').textContent='Kopier lenke';});


// Status for tallene hentes fra registeret, så datoen ikke blir stående gammel (Lars 3.11.2026).
const DATA_STATUS=SpareFacts.expand('Renter og prisvekst fra SSB oppdateres hver måned etter kontroll. Nyeste tall: {{savingsRate.periode}}.');
document.querySelectorAll('[data-datastatus]').forEach(e=>{e.textContent=(e.dataset.datastatus==='hjelp'?'Tallene hentes ikke mens du bruker siden. ':'')+DATA_STATUS+(e.dataset.datastatus==='metode'?' Jeg får varsel når kildene til andre tall og regler endres.':'');});
// Kildene i rapporten: adressene kommer fra registeret og forutsetningsfila, ikke skrevet inn i teksten (3.11.2026).
function reportSources(st=s){const F=SpareFacts,list=[['Forbrukerrådet: Sparing i fond og spareprofiler',F.data.fundMinYears.source],['SSB tabell 11018: renter på innskudd, '+F.expand('{{savingsRate.periode}}'),F.data.savingsRate.source],...(st.savingsType==='index'?[[Assumptions.index.source.name,Assumptions.index.source.url]]:[]),['Finansportalen: Risiko og avkastning','https://www.finansportalen.no/sparing/risiko-og-avkastning']];return 'Kilder: '+list.map(([n,u])=>escapeHTML(n)+' ('+escapeHTML(String(u).replace(/^https:\/\/(www\.)?/,''))+')').join('; ')+'. ';}
