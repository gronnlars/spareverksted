'use strict';
const {spawnSync}=require('node:child_process');

// A successful predecessor may be reused only in the same Actions attempt,
// checkout and browser engine. Standalone calls always retain the preflight.
function publicationPreflight(env=process.env,spawn=spawnSync){
 const engine=env.SPARE_ENGINE||'chromium';
 const valid=env.GITHUB_ACTIONS==='true'&&/^\d+$/.test(env.GITHUB_RUN_ID||'')&&/^\d+$/.test(env.GITHUB_RUN_ATTEMPT||'')&&/^[a-f0-9]{40}$/.test(env.GITHUB_SHA||'')&&['chromium','firefox','webkit'].includes(engine);
 const expected=[env.GITHUB_RUN_ID,env.GITHUB_RUN_ATTEMPT,env.GITHUB_SHA,engine].join(':');
 if(valid&&env.SPARE_PUBLICATION_CHECKED===expected){
  const head=spawn('git',['rev-parse','HEAD'],{encoding:'utf8'});
  if(head.status===0&&head.stdout.trim()===env.GITHUB_SHA){
   console.log(engine+': bruker bestått publiseringskontroll fra samme CI-forsøk og commit.');
   return true;
  }
 }
 return spawn(process.execPath,['tests/published-answers-browser.cjs'],{stdio:'inherit',env}).status===0;
}
module.exports={publicationPreflight};
