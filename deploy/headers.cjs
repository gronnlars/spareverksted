// Eneste kilde til responshoder. Alt annet genereres herfra med `node scripts/sync-security.cjs`:
// Terraform-variabler (deploy/terraform/headers.auto.tfvars.json) og <meta>-CSP i dist/*.html.
// Brukes også av tests/csp-browser.cjs og scripts/check-live.cjs.

// HSTS innføres i trinn. Hev HSTS_STAGE først når forrige trinn har fungert i minst et par dager.
// Trinn 1 og 2 gir ikke full Observatory-score. Det gjør trinn 3 og 4 (minst 6 måneder).
const HSTS_STAGES=[300,86400,15768000,63072000];
const HSTS_STAGE=1;
// Slå på bare hvis alle underdomener alltid skal ha HTTPS. Gir bonuspoeng i Observatory, ikke krav for 100.
const HSTS_INCLUDE_SUBDOMAINS=false;

const cspParts=["default-src 'none'","script-src 'self'","style-src 'self'","img-src 'self'","font-src 'self'","connect-src 'self'","manifest-src 'self'","base-uri 'none'","form-action 'none'","object-src 'none'","upgrade-insecure-requests"];
// frame-ancestors kan ikke settes i <meta>, bare som header.
const csp=[...cspParts,"frame-ancestors 'none'"].join('; ');
const cspMeta=cspParts.join('; ');
const hsts='max-age='+HSTS_STAGES[HSTS_STAGE-1]+(HSTS_INCLUDE_SUBDOMAINS?'; includeSubDomains':'');
const headers={
 'Content-Security-Policy':csp,
 'Strict-Transport-Security':hsts,
 'X-Content-Type-Options':'nosniff',
 'X-Frame-Options':'DENY',
 'Referrer-Policy':'no-referrer',
 'Permissions-Policy':'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), clipboard-write=(self)',
 'Cross-Origin-Opener-Policy':'same-origin',
 'Cross-Origin-Embedder-Policy':'require-corp',
 'Cross-Origin-Resource-Policy':'same-origin'
};
// Cache: HTML skal alltid sjekkes på nytt, filer med ?v= kan ligge en time.
const cache={html:'no-cache',assets:'public, max-age=3600'};
module.exports={headers,cache,csp,cspMeta,hsts,HSTS_STAGE,HSTS_STAGES,fullObservatoryHsts:HSTS_STAGES[HSTS_STAGE-1]>=15768000};
