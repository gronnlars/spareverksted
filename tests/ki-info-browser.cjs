// KI-informasjonen er synlig på forsiden og ved «Spør om sparing», lenker til Om-siden og er lesbar på mobil.
const {chromium,firefox,webkit}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path');
const engine=process.env.SPARE_ENGINE||'chromium',types={'.html':'text/html;charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png'};
const dist=path.join(__dirname,'..','dist');
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0].split('#')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(dist,p);if(!f.startsWith(dist)||!fs.existsSync(f)){r.writeHead(404);return r.end();}r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});r.end(fs.readFileSync(f));});
(async()=>{
 await new Promise(r=>srv.listen(0,r));const base='http://localhost:'+srv.address().port+'/';
 const b=await({chromium,firefox,webkit}[engine]).launch();
 for(const [name,vp] of [['mobil',{width:360,height:740}],['pc',{width:1280,height:800}]]){
  const page=await(await b.newContext({viewport:vp})).newPage();
  for(const [url,txt] of [['index.html','Kan inneholde feil, utdatert informasjon og mangler. Innholdet er i stor grad laget med KI.'],['spor.html','Svarene er skrevet på forhånd.']]){
   await page.goto(base+url);const n=page.locator('.ki-note');
   if(!(await n.isVisible()))throw Error(name+' '+url+': KI-notatet er ikke synlig');
   if(!(await n.innerText()).includes(txt))throw Error(url+': feil tekst');
   const fs_=await n.evaluate(e=>parseFloat(getComputedStyle(e).fontSize));if(fs_<14)throw Error('for liten skrift '+fs_);
   const box=await n.boundingBox();if(box.x<0||box.x+box.width>vp.width+1)throw Error('går utenfor skjermen');
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error(name+' '+url+': horisontal scrolling');
   await n.locator('a').click();await page.waitForURL(/om\.html#ki/);
   if(!(await page.locator('#ki').isVisible()))throw Error('Om-seksjonen mangler');
  }
 }
 await b.close();srv.close();console.log(engine+': KI-info passed: synlig på forsiden og spørsmålssiden, lenke til Om, ingen horisontal scrolling, lesbar skriftstørrelse.');
})().catch(e=>{console.error(e);process.exit(1);});
