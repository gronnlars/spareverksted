"""Tester for scripts/versjoner.py. Kjør: python3 tests/versjoner.test.py"""
import hashlib
import shutil
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
import versjoner  # noqa: E402

passed = []


def test(fn):
    fn()
    passed.append(fn.__name__)
    return fn


def site(app='a', page='<head><script src="app.js?v=ux52"></script><script src="b.js?v=3"></script><link rel="stylesheet" href="s.css?v=1"></head>'):
    root = Path(tempfile.mkdtemp(prefix='versjoner-'))
    (root / 'dist').mkdir()
    (root / 'dist/app.js').write_text(app, encoding='utf-8')
    (root / 'dist/b.js').write_text('b', encoding='utf-8')
    (root / 'dist/s.css').write_text('s', encoding='utf-8')
    (root / 'dist/index.html').write_text(page, encoding='utf-8')
    return root


def v(text):
    return hashlib.sha256(text.encode()).hexdigest()[:10]


@test
def versjonen_folger_innholdet():
    root = site()
    assert versjoner.run(root, check=True) == ['index.html']
    versjoner.run(root)
    html = (root / 'dist/index.html').read_text(encoding='utf-8')
    assert f'app.js?v={v("a")}"' in html and f'b.js?v={v("b")}"' in html and f's.css?v={v("s")}"' in html, html
    assert versjoner.run(root, check=True) == []


@test
def samme_versjon_for_ulikt_innhold_blir_rettet():
    """Det som skjedde med app.js?v=ux52 i #173 og #174: to PR-er, samme versjon, ulikt innhold."""
    a, b = site(app='endring fra #173'), site(app='endring fra #174')
    for r in (a, b):
        versjoner.run(r)
    va, vb = ((r / 'dist/index.html').read_text(encoding='utf-8') for r in (a, b))
    assert va != vb, 'ulikt innhold gir ulik versjon'
    (a / 'dist/app.js').write_text('endring fra #173 og #174', encoding='utf-8')
    assert versjoner.run(a, check=True) == ['index.html'], 'CI oppdager at versjonen ikke stemmer etter sammenslåing'


@test
def ett_skript_per_linje():
    root = site()
    versjoner.run(root)
    lines = (root / 'dist/index.html').read_text(encoding='utf-8').splitlines()
    assert sum('<script' in l for l in lines) == 2 and all(l.count('<script') <= 1 for l in lines), lines


@test
def manglende_fil_stopper():
    root = site(page='<script src="borte.js?v=1"></script>')
    try:
        versjoner.run(root)
    except SystemExit as error:
        assert 'borte.js' in str(error)
    else:
        raise AssertionError('manglende fil skal stoppe')


@test
def eksterne_adresser_endres_ikke():
    root = site(page='<a href="https://example.org/x.js">x</a><script src="app.js?v=1"></script>')
    versjoner.run(root)
    assert 'https://example.org/x.js"' in (root / 'dist/index.html').read_text(encoding='utf-8')


@test
def nettsiden_er_i_takt():
    assert versjoner.run(ROOT, check=True) == [], 'kjør python3 scripts/versjoner.py'


print(f'Versjoner: {len(passed)} tester bestått ({", ".join(passed)}).')
