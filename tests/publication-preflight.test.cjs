'use strict';
const assert=require('node:assert/strict');
const {publicationPreflight}=require('./helpers/publication-preflight.cjs');
const sha='a'.repeat(40);
const base={GITHUB_ACTIONS:'true',GITHUB_RUN_ID:'123',GITHUB_RUN_ATTEMPT:'2',GITHUB_SHA:sha,SPARE_ENGINE:'firefox',SPARE_PUBLICATION_CHECKED:`123:2:${sha}:firefox`};
function check(env,{head=sha,gitStatus=0,testStatus=0,reuse=false}={}){
 const calls=[];
 const spawn=(command,args)=>{calls.push({command,args});return command==='git'?{status:gitStatus,stdout:head+'\n'}:{status:testStatus};};
 assert.equal(publicationPreflight(env,spawn),reuse||testStatus===0);
 const tests=calls.filter(c=>c.command===process.execPath);
 assert.equal(tests.length,reuse?0:1);
 if(!reuse)assert.deepEqual(tests[0].args,['tests/published-answers-browser.cjs']);
}
check(base,{reuse:true});
check({...base,SPARE_ENGINE:'chromium'});
check({...base,SPARE_PUBLICATION_CHECKED:''});
check({...base,GITHUB_RUN_ATTEMPT:'3'});
check({...base,GITHUB_RUN_ID:'456'});
check({...base,GITHUB_SHA:'b'.repeat(40)});
check({...base,GITHUB_ACTIONS:'false'});
check({});
check(base,{head:'b'.repeat(40)});
check(base,{gitStatus:128});
check({...base,SPARE_PUBLICATION_CHECKED:''},{testStatus:1});
check({...base,SPARE_PUBLICATION_CHECKED:''},{testStatus:null});
for(const engine of ['chromium','webkit'])check({...base,SPARE_ENGINE:engine,SPARE_PUBLICATION_CHECKED:`123:2:${sha}:${engine}`},{reuse:true});
console.log('Publiseringskontroll: 14 tilfeller bestod, inkludert lokal kjøring, feil, motor, commit og nytt CI-forsøk.');
