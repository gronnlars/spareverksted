// Kontrollerer den ekte siden: omdirigering fra alle adresser, sikkerhetshoder og at ingenting lekker ekstra.
// Bruk: node scripts/check-live.cjs [domene]   (standard spareverksted.no). Krever Node 18+ og tilgang til nettet.
const {headers,cache}=require('../deploy/headers.cjs');
const domain=(process.argv[2]||'spareverksted.no').replace(/^www\./,''),canonical='https://'+domain+'/';
let failed=0;const ok=(c,t)=>{console.log((c?'  ok   ':'  FEIL ')+t);if(!c)failed++;};
const get=(url,method='GET')=>fetch(url,{redirect:'manual',method});
(async()=>{
 console.log('Omdirigering (første hopp skal beholde samme vertsnavn, så HTTPS):');
 for(const start of ['http://'+domain,'http://www.'+domain,'https://www.'+domain,'https://'+domain]){
  let url=start,hops=[start];
  for(let i=0;i<4;i++){const r=await get(url);if(r.status<300||r.status>=400)break;url=new URL(r.headers.get('location'),url).href;hops.push(url);}
  ok(url===canonical,start+'  ->  '+hops.slice(1).join('  ->  ')+(hops.length===1?'(ingen hopp)':''));
  if(start.startsWith('http://')){const first=new URL(hops[1]||start);ok(first.protocol==='https:'&&first.hostname===new URL(start).hostname,'  første hopp fra '+start+' går til https på samme vertsnavn');}
 }
 console.log('\nHoder på forsiden og spor.html:');
 for(const page of ['','spor.html']){const r=await get(canonical+page);ok(r.status===200,page||'/'+' gir 200');
  for(const [k,v] of Object.entries(headers))ok(r.headers.get(k)===v,k+(r.headers.get(k)===v?'':'  forventet: '+v+'  fikk: '+r.headers.get(k)));
  ok(r.headers.get('cache-control')===cache.html,'Cache-Control (HTML) = '+cache.html+'  fikk: '+r.headers.get('cache-control'));
  ok(!r.headers.get('access-control-allow-origin'),'Ingen Access-Control-Allow-Origin (CORS av)  fikk: '+r.headers.get('access-control-allow-origin'));
  ok(!r.headers.get('set-cookie'),'Ingen cookies  fikk: '+r.headers.get('set-cookie'));}
 const www=await get('https://www.'+domain+'/');ok(www.headers.get('strict-transport-security')===headers['Strict-Transport-Security'],'HSTS også på www-omdirigeringen');
 const js=await get(canonical+'app.js');ok(js.status===200&&/javascript/.test(js.headers.get('content-type')||''),'app.js leveres som JavaScript');
 ok((js.headers.get('cache-control')||'')===cache.assets,'Cache-Control (JS/CSS) = '+cache.assets+'  fikk: '+js.headers.get('cache-control'));
 const post=await fetch(canonical,{method:'POST',redirect:'manual'});ok(post.status>=400,'POST avvises  fikk: '+post.status);
 console.log('\nKjør deretter https://developer.mozilla.org/en-US/observatory og skriv inn '+domain+'. Mål: 100.');
 console.log(failed?'\n'+failed+' avvik.':'\nAlt stemmer.');process.exit(failed?1:0);
})().catch(e=>{console.error(e.message);process.exit(2);});
