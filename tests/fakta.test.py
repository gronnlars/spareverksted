"""Tester for fakta- og begrepsregisteret i flere filer. Ingen nett. Kjør: python3 tests/fakta.test.py"""
import copy
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
import fakta  # noqa: E402

REG = fakta.load()
DATE = '2026-11-03'
passed = []


def test(fn):
    fn()
    passed.append(fn.__name__)
    return fn


def sandbox(files=None):
    """Kopi av kilder/ og BSU-serien, og en tom dist/ med valgfrie filer."""
    root = Path(tempfile.mkdtemp(prefix='fakta-'))
    shutil.copytree(ROOT / 'kilder', root / 'kilder')
    (root / 'research').mkdir()
    shutil.copy(ROOT / 'research/bsu-rentehistorikk.csv', root / 'research/bsu-rentehistorikk.csv')
    (root / 'dist').mkdir()
    for name, text in (files or {}).items():
        (root / name).write_text(text, encoding='utf-8')
    return root


def edit(root, rel, change):
    path = root / rel
    data = json.loads(path.read_text(encoding='utf-8'))
    change(data)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')


@test
def registeret_er_samlet_fra_flere_filer():
    assert fakta.validate(REG) == [], fakta.validate(REG)
    files = set(REG['_fil'].values())
    assert {'kilder/fakta/bsu.json', 'kilder/fakta/ips.json', 'kilder/fakta/generelt.json', 'kilder/fakta/ssb-renter.json'} <= files, files
    assert REG['_fil']['bsuAnnual'] == 'kilder/fakta/bsu.json' and REG['_fil']['savingsRate'] == 'kilder/fakta/ssb-renter.json'
    assert [b['id'] for b in REG['begreper']] == ['kjopekraft', 'prisvekst', 'dagens-kroner', 'renters-rente']


@test
def samme_id_i_to_filer_avvises():
    root = sandbox()
    (root / 'kilder/fakta/ekstra.json').write_text(json.dumps({'fakta': {'bsuAnnual': REG['fakta']['bsuAnnual']}}), encoding='utf-8')
    errors = fakta.validate(fakta.load(root), root)
    assert any('bsuAnnual finnes også i kilder/fakta/bsu.json' in e for e in errors), errors


@test
def lagring_skriver_tilbake_til_riktig_fil():
    root = sandbox()
    reg = fakta.load(root)
    reg['fakta']['savingsRate']['perioder'].append({'periode': '2026M09', 'verdi': 2.88})
    fakta.save(reg, root)
    ssb = json.loads((root / 'kilder/fakta/ssb-renter.json').read_text(encoding='utf-8'))
    assert ssb['fakta']['savingsRate']['perioder'][-1] == {'periode': '2026M09', 'verdi': 2.88}
    assert ssb['_om'].startswith('Renter fra SSB'), 'beskrivelsen i fila beholdes'
    for rel in ('kilder/fakta/bsu.json', 'kilder/fakta/ips.json', 'kilder/fakta/generelt.json'):
        assert (root / rel).read_text(encoding='utf-8') == (ROOT / rel).read_text(encoding='utf-8'), rel + ' skal ikke endres'


@test
def unntak_gjelder_en_linje_ikke_hele_fila():
    root = sandbox({'dist/side.js': "const a='Grensen 27 500 kr i 2026-eksempelet';\nconst b='Opptil 27 500 kroner i året';\n"})
    reg = fakta.load(root)
    reg['fakta']['bsuAnnual']['tillatt'] = [{'fil': 'dist/side.js', 'tekst': '2026-eksempelet', 'grunn': 'historisk eksempel'}]
    found = fakta.duplicates(reg, root, DATE)
    assert len(found) == 1 and 'dist/side.js:2' in found[0], found
    (root / 'dist/side.js').write_text("const b='Opptil 27 500 kroner i året';\n", encoding='utf-8')
    found = fakta.duplicates(reg, root, DATE)
    assert any('treffer ikke lenger' in p for p in found), 'gamle unntak skal ryddes bort'


@test
def tall_inne_i_storre_tall_er_ikke_treff():
    root = sandbox({'dist/side.js': "a='1 300 000 kr og 27 500 000 kr og 127 500 kr og 300 000,50';\nb='300 000 kroner totalt';\n"})
    found = fakta.duplicates(fakta.load(root), root, DATE)
    assert len(found) == 1 and 'dist/side.js:2' in found[0] and '«300 000»' in found[0], found


@test
def unntak_uten_tekst_eller_grunn_avvises():
    reg = copy.deepcopy(REG)
    reg['fakta']['bsuAnnual']['tillatt'] = [{'fil': 'dist/side.js'}]
    assert any('"tekst"' in e for e in fakta.validate(reg))


@test
def kopi_av_begrepssetning_blir_funnet():
    root = sandbox({'dist/side.html': '<p>Kjøpekraft er hvor mye du kan kjøpe for pengene. Les mer.</p>\n'})
    found = fakta.duplicates(fakta.load(root), root, DATE)
    assert len(found) == 1 and '{{begrep:kjopekraft}}' in found[0], found


@test
def plassholdere_som_ikke_finnes_blir_funnet():
    root = sandbox({'dist/side.js': "a='{{bsuAnnual}} {{bsuRate.periode}} {{begrep:kjopekraft}} {{begrep:kjopekraft.utdyping}}';\n"
                                    "b='{{bsuAnual}} {{bsuAnnual.periode}} {{begrep:ukjent}} {{begrep:prisvekst.ord}} {{begrep:kjopekraft.feil}}';\n"})
    problems = fakta.placeholder_problems(fakta.load(root), root)
    bad = sorted(p.split(': ', 1)[1] for p in problems)
    assert bad == sorted(f'{x} finnes ikke i registeret' for x in ('{{bsuAnual}}', '{{bsuAnnual.periode}}', '{{begrep:ukjent}}', '{{begrep:kjopekraft.feil}}')), bad
    assert all(p.startswith('dist/side.js:2:') for p in problems)


@test
def begrep_hentes_i_nettleserkoden():
    script = ("global.window=globalThis;const F=require(process.argv[1]);"
              "console.log(JSON.stringify([F.expand('{{begrep:renters-rente}} {{begrep:renters-rente.utdyping}}'),F.term('prisvekst','ord'),"
              "(()=>{try{F.expand('{{begrep:ukjent}}');return 'ingen feil'}catch(e){return e.message}})()]))")
    out = json.loads(subprocess.run(['node', '-e', script, str(ROOT / 'dist/veileder-facts.js')], capture_output=True, text=True, check=True).stdout)
    assert out == ['Renters rente betyr at du får renter også på renter du har fått tidligere. Når rentene blir stående, kan også de gi nye renter.',
                   'Prisvekst (inflasjon)', 'Ukjent begrep: ukjent'], out


@test
def begreper_js_er_generert_og_ordbokreglene_virker():
    assert (ROOT / 'dist/begreper.js').read_text(encoding='utf-8') == fakta.build_begreper(REG)
    root = sandbox()
    edit(root, 'kilder/begreper/grunnbegreper.json', lambda d: d['begreper'][0].update(definisjon='Kjøpekraft er hvor mye du får for 100 kr.'))
    tmp = root / 'begreper.js'
    tmp.write_text(fakta.build_begreper(fakta.load(root)), encoding='utf-8')
    run = subprocess.run(['node', '-e', 'require(process.argv[1])', str(tmp)], capture_output=True, text=True)
    assert run.returncode != 0 and 'Ingen tall i definisjonen: kjopekraft' in run.stderr, run.stderr[-300:]


@test
def stort_register_kontrolleres_raskt():
    """1 500 fakta, 200 begreper og 300 filer med 200 linjer skal kontrolleres på få sekunder."""
    root = sandbox()
    big = {f'test{i}': {'type': 'regel', 'enhet': 'kr', 'kilde': 'tax-bsu', 'verdier': [{'verdi': 100000 + i * 7, 'fra': '2026-01-01', 'status': 'i kraft'}]} for i in range(1500)}
    (root / 'kilder/fakta/stor.json').write_text(json.dumps({'fakta': big}), encoding='utf-8')
    terms = [{'id': f'ord{i}', 'ord': f'Ord{i}', 'definisjon': f'Ord{i} er et testord nummer som ikke betyr noe særlig.', 'kilder': [{'title': 't', 'url': 'u'}], 'kontrollert': DATE} for i in range(200)]
    (root / 'kilder/begreper/stor.json').write_text(json.dumps({'begreper': terms}), encoding='utf-8')
    line = "x='{{test5}} {{begrep:ord3}} og vanlig tekst uten tall';\n" * 200
    for i in range(300):
        (root / f'dist/side{i}.js').write_text(line, encoding='utf-8')
    (root / 'dist/side7.js').write_text(line + "y='100 035 kroner';\n", encoding='utf-8')
    reg = fakta.load(root)
    start = time.perf_counter()
    assert fakta.validate(reg, root) == []
    dup = fakta.duplicates(reg, root, DATE)
    ph = fakta.placeholder_problems(reg, root)
    fakta.build(reg, root)
    used = time.perf_counter() - start
    assert len(dup) == 1 and 'dist/side7.js:201' in dup[0] and '{{test5}}' in dup[0], dup
    assert ph == [], ph[:3]
    assert used < 10, f'{used:.1f} s'
    print(f'  Stort register: 1 517 fakta, 204 begreper, 300 filer kontrollert på {used:.1f} s')


print(f'Fakta: {len(passed)} tester bestått ({", ".join(passed)}).')
