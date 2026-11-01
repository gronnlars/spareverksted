// Holder deploy/terraform og <meta>-CSP i synk med deploy/headers.cjs.
// Bruk: node scripts/sync-security.cjs          skriver filene
//       node scripts/sync-security.cjs --check  feiler hvis noe er ute av synk (brukes i test og CI)
const fs=require('node:fs'),path=require('node:path');
const {headers,cache,cspMeta}=require('../deploy/headers.cjs');
const root=path.resolve(__dirname,'..'),check=process.argv.includes('--check'),stale=[];
const write=(file,text)=>{const full=path.join(root,file),old=fs.existsSync(full)?fs.readFileSync(full,'utf8'):null;if(old===text)return;if(check){stale.push(file);return;}fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,text);console.log('skrev '+file);};
write('deploy/terraform/headers.auto.tfvars.json',JSON.stringify({security_headers:headers,cache_control_html:cache.html,cache_control_assets:cache.assets},null,2)+'\n');
const tag='<meta http-equiv="Content-Security-Policy" content="'+cspMeta.replace(/"/g,'&quot;')+'">',re=/<meta http-equiv="Content-Security-Policy"[^>]*>/;
for(const file of fs.readdirSync(path.join(root,'dist')).filter(f=>f.endsWith('.html'))){
 const rel='dist/'+file,html=fs.readFileSync(path.join(root,rel),'utf8');
 const next=re.test(html)?html.replace(re,()=>tag):html.replace(/(<meta charset="utf-8">)/i,(m)=>m+tag);
 if(next===html&&!re.test(html)){console.error(rel+': fant ingen <meta charset="utf-8"> å plassere CSP etter');process.exit(1);}
 write(rel,next);
}
if(stale.length){console.error('Ute av synk med deploy/headers.cjs: '+stale.join(', ')+'. Kjør: node scripts/sync-security.cjs');process.exit(1);}
if(check)console.log('Synk OK: Terraform-variabler og <meta>-CSP stemmer med deploy/headers.cjs.');
