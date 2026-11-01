// Laster dist/ opp til en bunny.net Storage Zone og tømmer CDN-cachen.
// Miljøvariabler (sett som GitHub-hemmeligheter, aldri i filer):
//   BUNNY_STORAGE_ZONE   navn på lagringssonen            (påkrevd)
//   BUNNY_STORAGE_KEY    lagringssonens passord           (påkrevd)
//   BUNNY_STORAGE_HOST   standard storage.bunnycdn.com (Tyskland). Bruk regionens vertsnavn hvis sonen ligger andre steder.
//   BUNNY_API_KEY + BUNNY_PULLZONE_ID   valgfritt: tømmer cachen etter opplasting
// Mangler påkrevde variabler, avslutter skriptet uten feil, så CI ikke feiler for forks.
const fs=require('node:fs'),path=require('node:path');
const zone=process.env.BUNNY_STORAGE_ZONE,key=process.env.BUNNY_STORAGE_KEY,host=process.env.BUNNY_STORAGE_HOST||'storage.bunnycdn.com';
if(!zone||!key){console.log('Hopper over bunny.net-opplasting: BUNNY_STORAGE_ZONE og BUNNY_STORAGE_KEY er ikke satt.');process.exit(0);}
const root=path.resolve(__dirname,'../dist');
const files=(dir=root)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);
(async()=>{
 const all=files().filter(f=>!f.endsWith('.zip')||path.basename(f)==='spareverksted-kildekode.zip');
 // HTML sist, så nye sider aldri peker på filer som ikke er lastet opp ennå.
 all.sort((a,b)=>Number(a.endsWith('.html'))-Number(b.endsWith('.html')));
 for(const file of all){
  const rel=path.relative(root,file).split(path.sep).map(encodeURIComponent).join('/');
  const res=await fetch(`https://${host}/${encodeURIComponent(zone)}/${rel}`,{method:'PUT',headers:{AccessKey:key,'Content-Type':'application/octet-stream'},body:fs.readFileSync(file)});
  if(!res.ok){console.error(`Opplasting feilet for ${rel}: ${res.status}`);process.exit(1);}
  console.log('lastet opp '+rel);
 }
 if(process.env.BUNNY_API_KEY&&process.env.BUNNY_PULLZONE_ID){
  const res=await fetch(`https://api.bunny.net/pullzone/${encodeURIComponent(process.env.BUNNY_PULLZONE_ID)}/purgeCache`,{method:'POST',headers:{AccessKey:process.env.BUNNY_API_KEY}});
  console.log(res.ok?'tømte CDN-cachen':'kunne ikke tømme CDN-cachen: '+res.status);
 }
})().catch(e=>{console.error(e.message);process.exit(1);});
