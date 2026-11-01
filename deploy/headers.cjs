// Fasit for responshoder. Brukes av tests/csp-browser.cjs og scripts/check-live.cjs, og lagt inn som Edge Rules i bunny.net (se deploy/bunny-oppsett.md).
const csp=["default-src 'none'","script-src 'self'","style-src 'self'","img-src 'self'","font-src 'self'","connect-src 'self'","manifest-src 'self'","base-uri 'none'","form-action 'none'","frame-ancestors 'none'","object-src 'none'","upgrade-insecure-requests"].join('; ');
const headers={
 'Content-Security-Policy':csp,
 'Strict-Transport-Security':'max-age=63072000; includeSubDomains',
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
module.exports={headers,cache,csp};
