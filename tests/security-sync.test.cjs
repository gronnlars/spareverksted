const {spawnSync}=require('node:child_process'),assert=require('node:assert/strict'),path=require('node:path');
const r=spawnSync(process.execPath,[path.resolve(__dirname,'../scripts/sync-security.cjs'),'--check'],{encoding:'utf8'});
assert.equal(r.status,0,r.stderr||r.stdout);
const {headers,fullObservatoryHsts,HSTS_STAGE}=require('../deploy/headers.cjs');
assert.match(headers['Strict-Transport-Security'],/^max-age=\d+(; includeSubDomains)?$/,'HSTS must be a plain max-age value');
assert(!/unsafe-inline|unsafe-eval|\*/.test(headers['Content-Security-Policy']),'CSP must not weaken script or style rules');
for(const k of ['Content-Security-Policy','Strict-Transport-Security','X-Content-Type-Options','X-Frame-Options','Referrer-Policy','Permissions-Policy','Cross-Origin-Opener-Policy','Cross-Origin-Embedder-Policy','Cross-Origin-Resource-Policy'])assert(headers[k],k+' missing');
console.log('Passed: security files in sync, no weakened CSP, HSTS stage '+HSTS_STAGE+(fullObservatoryHsts?' (full Observatory score possible).':' (below 6 months: raise HSTS_STAGE later for 100).'));
