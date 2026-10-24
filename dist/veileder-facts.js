/* Dated factual values for the guidance. User inputs and technical limits are separate. */
(function(root){
'use strict';
const checked='2026-10-22',year=2026;
const bsu='https://www.skatteetaten.no/nn/person/skatt/hjelp-til-rett-skatt/bank-og-lan/bsu--bustadsparing-for-ungdom/';
const ips='https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/arbeid-trygd-og-pensjon/pensjon-og-uforetrygd/ny-ordning-for-skattefavorisert-individuell-sparing-til-pensjon/';
const record=(value,unit,source,kind='rule')=>({value,unit,year,checked,source,kind});
const data={
 year:record(year,'inntektsår',bsu),
 bsuMaxAge:record(33,'år',bsu),bsuAnnual:record(27500,'kr',bsu),bsuTotal:record(300000,'kr',bsu),bsuPercent:record(10,'prosent',bsu),bsuMaxDeduction:record(2750,'kr',bsu),
 ipsAnnual:record(25000,'kr',ips),ipsStartAge:record(62,'år',ips),ipsEndAge:record(80,'år',ips),ipsMinYears:record(10,'år',ips),ipsIntroduced:record(2017,'årstall',ips),
 adultAge:record(18,'år','https://stortinget.no/no/Saker-og-publikasjoner/Vedtak/Beslutninger/Lovvedtak/2009-2010/vedtak-200910-036/'),
 grantSingleAssets:record(534225,'kr','https://lanekassen.no/nb-NO/stipend-og-lan/omgjoring-av-basislan/'),
 fundMinYears:record(5,'år','https://www.forbrukerradet.no/sparing-i-fond-og-spareprofiler/','source-recommendation')
};
function value(id){if(!Object.hasOwn(data,id))throw Error('Ukjent faktanøkkel: '+id);return data[id].value;}
function text(id){const n=value(id);if(n===null)return '';return new Intl.NumberFormat('nb-NO',{useGrouping:!['ipsIntroduced','year'].includes(id)}).format(n).replace(/\u00a0/g,' ');}
function expand(s){return String(s).replace(/\{\{([a-zA-Z]+)\}\}/g,(_,id)=>text(id)).replace(/[\u2013\u2014]/g,' til ');}
function resolve(x){if(typeof x==='string')return expand(x);if(Array.isArray(x))return x.map(resolve);if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,resolve(v)]));return x;}
const api={checked,year,data,value,text,expand,resolve};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SpareFacts=api;
})(typeof window!=='undefined'?window:globalThis);
