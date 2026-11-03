"""Tester for tidsmaskinen. Ingen nett. Kjør: python3 tests/tidsmaskin.test.py"""
import io
import json
import sys
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
import tidsmaskin as tm  # noqa: E402

SOURCES = tm.load_sources()
passed = []


def test(fn):
    fn()
    passed.append(fn.__name__)
    return fn


def xlsx(rows=(('Year', 'Deposit rate'), ('1819', '4.0'), ('1820', '4.5'))):
    """Minste gyldige xlsx med ett ark og delte strenger, som Excel lager dem."""
    strings, sheet_rows = [], []
    for r, row in enumerate(rows, 1):
        cells = []
        for c, value in enumerate(row):
            ref = 'AB'[c] + str(r)
            try:
                float(value)
                cells.append(f'<c r="{ref}"><v>{value}</v></c>')
            except ValueError:
                strings.append(value)
                cells.append(f'<c r="{ref}" t="s"><v>{len(strings) - 1}</v></c>')
        sheet_rows.append(f'<row r="{r}">{"".join(cells)}</row>')
    ns = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
    files = {
        '[Content_Types].xml': '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>',
        'xl/workbook.xml': f'<?xml version="1.0"?><workbook {ns} xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Table 1" sheetId="1" r:id="rId1"/></sheets></workbook>',
        'xl/_rels/workbook.xml.rels': '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Target="worksheets/sheet1.xml" Type="x"/></Relationships>',
        'xl/sharedStrings.xml': f'<?xml version="1.0"?><sst {ns}>' + ''.join(f'<si><t>{s}</t></si>' for s in strings) + '</sst>',
        'xl/worksheets/sheet1.xml': f'<?xml version="1.0"?><worksheet {ns}><sheetData>{"".join(sheet_rows)}</sheetData></worksheet>',
    }
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as archive:
        for name, text in files.items():
            archive.writestr(name, text)
    return buffer.getvalue()


PAGE = ('<html><body><main><h1>Historical monetary statistics</h1>'
        + ''.join(f'<a href="/globalassets/upload/hms/data/{s["fil"]}?v=17082017181356">x</a>' for s in SOURCES['kilder'] if s['type'] == 'nb-hms')
        + '<a href="/globalassets/upload/hms/data/gdp.xlsx?v=03052018162636">GDP</a></main></body></html>').encode()
SSB = json.dumps({'version': '2.0', 'class': 'dataset', 'label': '14709: Konsumprisindeks', 'updated': '2026-10-09T06:00:00Z', 'id': ['Maaned', 'ContentsCode', 'Tid'],
                  'size': [1, 1, 2], 'role': {'time': ['Tid']}, 'dimension': {'Maaned': {'category': {'index': {'01': 0}}}, 'ContentsCode': {'category': {'index': {'KpiIndMnd': 0}}},
                  'Tid': {'category': {'index': {'1920': 0, '1921': 1}}}}, 'value': [2.7, 2.5]}).encode()
SDMX = json.dumps({'data': {'dataSets': [{'series': {'0:0:0:0': {'observations': {'0': ['4.5']}}}}], 'structure': {'dimensions': {'observation': [{'values': [{'id': '2026-09-25'}]}]}}}}).encode()


def net(overrides=None):
    routes = {'https://www.norges-bank.no/en/topics/': PAGE, 'https://www.norges-bank.no/globalassets/': xlsx(),
              'https://data.ssb.no/': SSB, 'https://data.norges-bank.no/': SDMX, **(overrides or {})}

    def get(url):
        get.calls.append(url)
        for prefix in sorted(routes, key=len, reverse=True):
            if url.startswith(prefix):
                body = routes[prefix]
                return tm.Response(404, url, b'') if body is None else tm.Response(200, url, body)
        raise AssertionError('Uventet henting: ' + url)
    get.calls = []
    return get


def store():
    return tm.Store(tempfile.mkdtemp(prefix='historikk-'))


@test
def kildelisten_er_gyldig():
    ids = [s['id'] for s in SOURCES['kilder']]
    assert len(ids) == len(set(ids))
    for s in SOURCES['kilder']:
        assert s['utgiver'] in SOURCES['vilkår'] and s.get('navn') and s.get('bruk'), s['id']
    assert 'Egne beregninger og visualiseringer merkes tydelig som Spareverksteds egne.' in SOURCES['vilkår']['norges-bank']['regler']


@test
def foerste_henting_lagrer_alt_uendret_med_kilde():
    s, get = store(), net()
    report = tm.fetch(SOURCES, s, get)
    status = {sid: st for sid, st, _ in report}
    assert status['nb-hms-oversikt'] == 'ny fil på siden', 'gdp.xlsx er på siden, men ikke i kildelisten'
    assert all(status[x['id']] == 'ny' for x in SOURCES['kilder'] if x['type'] != 'side'), status
    record = s.register['nb-hms-aksjer']
    assert (s.root / record['fil']).read_bytes() == xlsx(), 'byte for byte'
    assert record['versjon'] == '17082017181356' and record['url'].endswith('stockprices.xlsx?v=17082017181356'), 'adressen fra oversiktssiden brukes'
    meta = json.loads((s.root / (record['fil'] + '.meta.json')).read_text(encoding='utf-8'))
    assert meta['kilde'] == 'Kilde: Norges Bank.' and meta['sha256'] == record['sha256'] and 'uendret' in ' '.join(meta['vilkår'])
    assert s.register['ssb-14709']['ssb_oppdatert'] == '2026-10-09T06:00:00Z'
    assert tm.verify(s) == []


@test
def uendret_kilde_gir_ingen_endring():
    s = store()
    tm.fetch(SOURCES, s, net())
    before = {p: p.stat().st_mtime_ns for p in s.root.rglob('*') if p.is_file() and p.name != 'register.json'}
    report = tm.fetch(SOURCES, s, net())
    assert all(st in ('uendret', 'ny fil på siden') for _, st, _ in report), report
    assert before == {p: p.stat().st_mtime_ns for p in s.root.rglob('*') if p.is_file() and p.name != 'register.json'}, 'ingen filer skrevet på nytt'


@test
def ny_versjon_bytter_fila_og_registeret():
    s = store()
    tm.fetch(SOURCES, s, net())
    new = xlsx((('Year', 'Deposit rate'), ('1819', '4.0'), ('1820', '4.6')))
    report = dict((sid, st) for sid, st, _ in tm.fetch(SOURCES, s, net({'https://www.norges-bank.no/globalassets/upload/hms/data/shortterm_ir.xlsx': new})))
    assert report['nb-hms-korte-renter'] == 'endret' and report['nb-hms-aksjer'] == 'uendret', report
    assert (s.root / 'nb-hms-korte-renter/shortterm_ir.xlsx').read_bytes() == new and tm.verify(s) == []


@test
def feilside_eller_avkuttet_fil_lagres_ikke():
    s = store()
    report = dict((sid, (st, t)) for sid, st, t in tm.fetch(SOURCES, s, net({
        'https://www.norges-bank.no/globalassets/upload/hms/data/cpi.xlsx': b'<html>Not found</html>',
        'https://www.norges-bank.no/globalassets/upload/hms/data/fx.xlsx': xlsx()[:300],
        'https://data.ssb.no/': b'{"error": "too many cells"}'})))
    assert report['nb-hms-kpi'][0] == 'hentefeil' and 'gyldig xlsx' in report['nb-hms-kpi'][1], report['nb-hms-kpi']
    assert report['nb-hms-valuta'][0] == 'hentefeil'
    assert report['ssb-14709'][0] == 'hentefeil'
    assert 'nb-hms-kpi' not in s.register and not (s.root / 'nb-hms-kpi').exists()


@test
def uten_oversiktssiden_brukes_faste_adresser():
    s, get = store(), net({'https://www.norges-bank.no/en/topics/': None})
    report = dict((sid, st) for sid, st, _ in tm.fetch(SOURCES, s, get))
    assert report['nb-hms-oversikt'] == 'hentefeil' and report['nb-hms-aksjer'] == 'ny'
    assert tm.NB_DATA + 'stockprices.xlsx' in get.calls


@test
def endret_raadata_i_repoet_blir_oppdaget():
    s = store()
    tm.fetch(SOURCES, s, net())
    path = s.root / s.register['ssb-14709']['fil']
    path.write_bytes(path.read_bytes().replace(b'2.7', b'2.8'))
    (s.root / 'nb-hms-aksjer' / 'egen-beregning.csv').write_text('x', encoding='utf-8')
    problems = '\n'.join(tm.verify(s))
    assert 'er endret etter henting' in problems and 'egen-beregning.csv ligger i mappen uten å stå i register.json' in problems, problems


@test
def oversikten_viser_ark_og_perioder():
    s = store()
    tm.fetch(SOURCES, s, net())
    text = tm.describe(s)
    assert '| Table 1 | 3 | 2 | Year / Deposit rate<br>1819 / 4.0<br>1820 / 4.5 |' in text, text[:800]
    assert 'Tid: 1920 til 1921. 2 verdier.' in text and '1 observasjoner, 2026-09-25 til 2026-09-25.' in text


@test
def kommandolinjen_virker_for_alle_kommandoer():
    """lag-pr krasjet i første ekte kjøring 3.11.2026 fordi den leste --mål. Alle kommandoer kjøres her."""
    import os
    import urllib.error
    calls = []
    real = tm.github

    def fake(method, path, body=None):
        calls.append((method, path, body['head']))
        return {'html_url': 'https://github.com/x/y/pull/1'}
    tm.github = fake
    os.environ.update(GITHUB_REPOSITORY='x/y', GITHUB_TOKEN='t')
    try:
        text = Path(tempfile.mkdtemp()) / 'pr.md'
        text.write_text('Tekst', encoding='utf-8')
        assert tm.main(['lag-pr', '--gren', 'tidsmaskin/2026-11-03', '--tittel', 'T', '--tekst', str(text)]) == 0
        assert calls == [('POST', '/repos/x/y/pulls', 'tidsmaskin/2026-11-03')], calls

        def refuse(method, path, body=None):
            raise urllib.error.HTTPError(path, 403, 'nei', {}, None)
        tm.github = refuse
        assert tm.main(['lag-pr', '--gren', 'g', '--tittel', 'T', '--tekst', str(text)]) == 0, 'avvist PR gir melding, ikke krasj'
    finally:
        tm.github = real
    target = tempfile.mkdtemp()
    assert tm.main(['sjekk', '--mål', target]) == 0
    assert tm.main(['oversikt', '--mål', target]) == 0


@test
def lagret_historikk_i_repoet_er_uendret():
    """Når research/historikk/ har filer, skal de stemme med registeret (kjøres også i CI)."""
    s = tm.Store(tm.TARGET)
    assert tm.verify(s) == [], tm.verify(s)


print(f'Tidsmaskin: {len(passed)} tester bestått ({", ".join(passed)}).')
