// Checks scripts/w3c-status.py with a made-up validator result.
// The real validator runs in GitHub Actions (see .github/workflows/static.yml).
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const page = path.join(root, 'dist/tilgjengelighet.html');
const html = fs.readFileSync(page, 'utf8');
assert.strictEqual(html.split('<!-- w3c-status:start -->').length, 2, 'én startmarkør');
assert.strictEqual(html.split('<!-- w3c-status:end -->').length, 2, 'én sluttmarkør');
const start = html.indexOf('<!-- w3c-status:start -->');
assert(start < html.indexOf('<details class="check-log">'), 'kortlinjen står synlig, før den utvidbare delen');
assert(html.indexOf('<!-- w3c-detail:start -->') > html.indexOf('<details class="check-log">'), 'detaljene står i den utvidbare delen');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'w3c-'));
const run = (messages, write) => {
  const file = path.join(dir, 'r.json');
  fs.writeFileSync(file, JSON.stringify({ messages }));
  return spawnSync('python3', [path.join(root, 'scripts/w3c-status.py'), file, '99.1.2', ...(write ? ['--write'] : [])], { encoding: 'utf8' });
};

const warn = (p) => ({ url: `file:/x/dist/${p}`, type: 'info', subType: 'warning', message: 'w' });
let r = run([warn('index.html'), warn('index.html'), warn('spor.html'), { type: 'info', url: 'file:/x/dist/om.html', message: 'bare info' }]);
assert.strictEqual(r.status, 0, r.stderr);
assert.match(r.stdout, /✓<\/span> Siste W3C-kontroll: \d+\. \w+ \d{4}\. 0 feil\.<\/p>/);
assert.match(r.stdout, /Totalt 0 feil og 3 advarsler på 5 sider/);
assert.match(r.stdout, /Forsiden: 0 feil, 2 advarsler;/);
assert.match(r.stdout, /«Spør om sparing»: 0 feil, 1 advarsel;/);
assert.match(r.stdout, /Om Spareverksted: 0 feil, 0 advarsler/);
assert.match(r.stdout, /versjon 99\.1\.2/);
assert(!/[–—]/.test(r.stdout), 'ingen tankestreker');

r = run([{ url: 'file:/x/dist/om.html', type: 'error', message: 'e' }]);
assert.strictEqual(r.status, 1, 'feil gir exit 1');
assert.match(r.stdout, /!<\/span> Siste W3C-kontroll: .*1 feil\./);
assert.match(r.stdout, /Totalt 1 feil og 0 advarsler/);

// --write skal bare endre blokken mellom markørene.
const backup = html;
try {
  r = run([warn('index.html')], true);
  assert.strictEqual(r.status, 0, r.stderr);
  const out = fs.readFileSync(page, 'utf8');
  const strip = (s) => s.replace(/<!-- w3c-status:start -->[\s\S]*?<!-- w3c-status:end -->/, '').replace(/<!-- w3c-detail:start -->[\s\S]*?<!-- w3c-detail:end -->/, '');
  assert.strictEqual(strip(out), strip(backup));
  assert.match(out, /Totalt 0 feil og 1 advarsel på 5 sider/);
} finally {
  fs.writeFileSync(page, backup);
}
console.log('w3c-status: telling, tekst og innskriving kontrollert.');
