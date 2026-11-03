"""Tester for Kildevakt og faktaregisteret. Ingen nett. Kjør: python3 tests/kildevakt.test.py"""
import bz2
import copy
import datetime as dt
import io
import json
import os
import shutil
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIX = ROOT / 'tests/fixtures/kildevakt'
sys.path.insert(0, str(ROOT / 'scripts'))
import fakta  # noqa: E402
import kildevakt as kv  # noqa: E402

TODAY = dt.date(2026, 11, 3)
SOURCES = kv.load_sources()
REG = fakta.load()
SRC = {s['id']: s for s in SOURCES['kilder']}
passed = []


def test(fn):
    fn()
    passed.append(fn.__name__)
    return fn


class Net:
    """Falsk nett: URL-prefiks til svar. Ukjent URL feiler testen."""

    def __init__(self, routes):
        self.routes, self.calls = routes, []

    def __call__(self, url, accept=None):
        self.calls.append(url)
        for prefix, response in self.routes.items():
            if url.startswith(prefix):
                return response() if callable(response) else response
        raise AssertionError('Uventet henting: ' + url)


def ok(body, url='https://x/'):
    return kv.Response(200, url, body if isinstance(body, bytes) else body.encode('utf-8'))


def state():
    return kv.State(tempfile.mkdtemp(prefix='kildevakt-'))


def ssb_body(change=None):
    data = json.loads((FIX / 'ssb-11018-syntetisk.json').read_text(encoding='utf-8'))
    if change:
        change(data)
    return json.dumps(data).encode()


SSB = 'https://data.ssb.no/api/pxwebapi/v2/tables/11018/data'


def levels(events):
    return [(e['nivå'], e['tittel']) for e in events]


# ---------- faktaregisteret ----------

@test
def registeret_er_gyldig_og_generert():
    assert fakta.validate(REG) == []
    assert (ROOT / 'dist/veileder-facts.js').read_text(encoding='utf-8') == fakta.build(REG)
    assert fakta.duplicates(REG) == [], fakta.duplicates(REG)


@test
def datert_regel_byttes_paa_riktig_dag_og_forslag_brukes_aldri():
    fact = {'type': 'regel', 'enhet': 'kr', 'kilde': 'tax-bsu', 'verdier': [
        {'verdi': 27500, 'fra': '2026-01-01', 'status': 'i kraft'},
        {'verdi': 30000, 'fra': '2027-01-01', 'status': 'vedtatt', 'kilde': 'Lovtidend'},
        {'verdi': 99999, 'fra': '2027-07-01', 'status': 'foreslått'}]}
    assert fakta.current(fact, '2026-12-31') == 27500
    assert fakta.current(fact, '2027-01-01') == 30000
    assert fakta.current(fact, '2027-08-01') == 30000
    reg = copy.deepcopy(REG)
    reg['fakta']['bsuAnnual'] = {**reg['fakta']['bsuAnnual'], 'verdier': fact['verdier']}
    assert fakta.validate(reg) == []
    js = fakta.build(reg)
    assert '99999' not in js, 'foreslåtte verdier skal aldri nå nettsiden'
    tmp = Path(tempfile.mkdtemp()) / 'f.js'
    tmp.write_text(js, encoding='utf-8')
    script = f"const F=require({json.dumps(str(tmp))});console.log(JSON.stringify([F.text('bsuAnnual'),F.upcoming('bsuAnnual'),F.at('2027-01-01').text('bsuAnnual'),F.expand('{{{{bsuRate}}}} % i {{{{bsuRate.periode}}}}')]))"
    for date, expected in (('2026-12-31', '27 500'), ('2027-01-01', '30 000')):
        out = json.loads(subprocess.run(['node', '-e', script], capture_output=True, text=True, check=True, env={**os.environ, 'SPARE_FAKTA_DATO': date}).stdout)
        assert out[0] == expected, (date, out)
        assert out[2] == '30 000'
        assert out[3] == '5,61 % i august 2026'
    assert out[1] is None
    out = json.loads(subprocess.run(['node', '-e', script], capture_output=True, text=True, check=True, env={**os.environ, 'SPARE_FAKTA_DATO': '2026-11-03'}).stdout)
    assert out[1] == {'value': 30000, 'from': '2027-01-01'}


@test
def registeret_avviser_feil():
    reg = copy.deepcopy(REG)
    reg['fakta']['bsuAnnual']['verdier'].append({'verdi': 1, 'fra': '2027-01-01', 'status': 'vedtatt'})
    reg['fakta']['bsuTotal']['verdier'][0]['status'] = 'kanskje'
    reg['fakta']['ipsAnnual']['verdier'].insert(0, {'verdi': 1, 'fra': '2027-01-01', 'status': 'i kraft'})
    errors = '\n'.join(fakta.validate(reg))
    assert 'trenger egen "kilde"' in errors and 'status må være' in errors and 'datorekkefølge' in errors, errors


@test
def hardkodet_tall_blir_funnet():
    root = Path(tempfile.mkdtemp())
    (root / 'dist').mkdir()
    (root / 'research').mkdir()
    shutil.copy(ROOT / 'research/bsu-rentehistorikk.csv', root / 'research/bsu-rentehistorikk.csv')
    (root / 'dist/side.js').write_text("const t='Opptil 27 500 kroner, fyller 33 og 2,87 %. Ikke 127 500.';", encoding='utf-8')
    found = '\n'.join(fakta.duplicates(REG, root, '2026-11-03'))
    assert '«27 500»' in found and '«fyller 33»' in found and '«2,87»' in found, found
    assert found.count('dist/side.js:1') == 3


@test
def frister_foer_nyttaar():
    rows = fakta.deadlines(REG, TODAY)
    ids = {r['id'] for r in rows}
    assert {'bsuAnnual', 'bsuTotal', 'ipsAnnual', 'year'} <= ids and 'grantSingleAssets' not in ids, ids
    assert all(r['frist'] == '2027-01-01' for r in rows)
    assert fakta.deadlines(REG, dt.date(2026, 9, 1)) == [], 'mer enn 75 dager før fristen: ingen varsel'


# ---------- SSB ----------

@test
def ssb_foerste_henting():
    s = state()
    events, data, info = kv.check_ssb(SRC['ssb-11018'], s, Net({SSB: ok(ssb_body())}), REG, TODAY)
    assert info['perioder'] == {'bsuRate': '2026M09', 'boundRate': '2026M09', 'savingsRate': '2026M09'}, info
    assert data['serier']['bsuRate']['2026M09'] == 5.6
    assert data['serier']['savingsRate'] == {'2026M08': 2.87, '2026M09': 2.88}, 'null fra SSB er ingen verdi'
    news = [e for e in events if e.get('ssb_ventende')]
    assert len(news) == 1 and news[0]['periode'] == '2026M09' and news[0]['nivå'] == 'middels'
    assert 'bsuRate: ny måned 2026M09 = 5.6' in news[0]['tekst'] and 'savingsRate: ny måned 2026M09 = 2.88' in news[0]['tekst']
    manual = [e for e in events if e['tittel'].startswith('Manuell kontroll')]
    assert levels(manual) == [('info', 'Manuell kontroll bekreftet')], 'Lars leste 5,60; samme tall skal bekreftes, ikke gi sak'
    assert 'revidert' not in news[0]['tekst'], 'repoets måneder stemmer med SSB'
    assert data['rådata'].endswith('-ssb.json')
    raw = s.root / data['rådata']
    assert raw.read_bytes() == ssb_body(), 'rådata lagres byte for byte'
    meta = json.loads(Path(str(raw) + '.meta.json').read_text(encoding='utf-8'))
    assert meta['sha256'] == kv.sha(ssb_body()) and meta['lisens'].startswith('CC BY')


@test
def ssb_samme_svar_gir_ingen_ny_sak():
    s = state()
    s.save('ssb-11018', kv.check_ssb(SRC['ssb-11018'], s, Net({SSB: ok(ssb_body())}), REG, TODAY)[1], {})
    events, data, _ = kv.check_ssb(SRC['ssb-11018'], s, Net({SSB: ok(ssb_body())}), REG, TODAY)
    assert events == [], levels(events)
    assert data['rådata'], 'peker fortsatt på forrige rådata'


@test
def ssb_bare_ny_oppdateringstid_er_ikke_en_endring():
    s = state()
    s.save('ssb-11018', kv.check_ssb(SRC['ssb-11018'], s, Net({SSB: ok(ssb_body())}), REG, TODAY)[1], {})
    body = ssb_body(lambda d: d.update(updated='2026-11-02T07:00:00Z'))
    events, _, _ = kv.check_ssb(SRC['ssb-11018'], s, Net({SSB: ok(body)}), REG, TODAY)
    assert events == [], levels(events)


@test
def ssb_revisjon_samme_dag_blir_oppdaget():
    s = state()
    s.save('ssb-11018', kv.check_ssb(SRC['ssb-11018'], s, Net({SSB: ok(ssb_body())}), REG, TODAY)[1], {})
    body = ssb_body(lambda d: d['value'].__setitem__(11, 5.65))   # BSU 2026M08
    events, _, _ = kv.check_ssb(SRC['ssb-11018'], s, Net({SSB: ok(body)}), REG, TODAY)
    kinds = levels(events)
    assert ('info', 'bsuRate: SSB har revidert 1 måned(er) siden forrige henting') in kinds, kinds
    pending = [e for e in events if e.get('ssb_ventende')][0]
    assert '2026M08 revidert fra 5.61 til 5.65' in pending['tekst']


@test
def ssb_avvik_fra_manuell_avlesning_gir_sak():
    body = ssb_body(lambda d: d['value'].__setitem__(12, 5.59))
    events, _, _ = kv.check_ssb(SRC['ssb-11018'], state(), Net({SSB: ok(body)}), REG, TODAY)
    assert ('høy', 'Manuell kontroll avviker') in levels(events)


@test
def ssb_endret_tabell_stopper_tallene():
    body = ssb_body(lambda d: d['dimension']['Sektor']['category']['label'].__setitem__('04b', 'Ikke-finansielle foretak'))
    events, _, info = kv.check_ssb(SRC['ssb-11018'], state(), Net({SSB: ok(body)}), REG, TODAY)
    assert info['status'] == 'strukturendring' and levels(events) == [('høy', 'SSB har endret tabellen')]


@test
def ssb_url_har_riktige_koder():
    url = kv.ssb_url(SRC['ssb-11018'])
    assert url.startswith(SSB + '?') and 'valueCodes[Innskuddstype]=20,16,15' in url and 'valueCodes[Tid]=top(13)' in url and 'json-stat2' in url, url


def data_date(s):
    return s.last('ssb-11018')['hentet'][:10]


@test
def ssb_oppdatering_skriver_alle_steder_og_er_idempotent():
    root = Path(tempfile.mkdtemp())
    for rel in ('kilder', 'research', 'scripts', 'dist'):
        (root / rel).mkdir()
    for rel in ('kilder/fakta.json', 'kilder/kildeliste.json', 'research/bsu-rentehistorikk.csv', 'research/bsu-rente-arssnitt-2018-2026.csv',
                'scripts/fakta.py', 'scripts/generate-bsu-rates.py', 'dist/veileder-facts.js', 'dist/bsu-rates.js', 'dist/index.html', 'dist/spor.html'):
        shutil.copy(ROOT / rel, root / rel)
    s = state()
    s.save('ssb-11018', kv.check_ssb(SRC['ssb-11018'], s, Net({SSB: ok(ssb_body())}), REG, TODAY)[1], {})
    summary = kv.apply_ssb(s, root)
    assert summary and 'Siste måned: 2026M09' in summary, summary
    csv_text = (root / 'research/bsu-rentehistorikk.csv').read_text(encoding='utf-8')
    assert csv_text.endswith('2026M08,5.61,4.59\n2026M09,5.6,4.6\n'), csv_text[-80:]
    annual = (root / 'research/bsu-rente-arssnitt-2018-2026.csv').read_text(encoding='utf-8')
    assert '2026,jan.–sep.,9,5.50,4.49,' in annual, annual
    assert '2025,jan.–des.,12,5.85,4.68,2.83' in annual, 'eldre år endres ikke'
    assert 'ikke regnet på nytt' in summary, 'ikke-bundne mangler måneder i testdataene'
    reg = fakta.load(root)
    assert reg['fakta']['savingsRate']['perioder'][-1] == {'periode': '2026M09', 'verdi': 2.88}
    assert reg['fakta']['bsuRate']['hentet'] == data_date(s)
    script = "const F=require(process.argv[1]);console.log(JSON.stringify([F.text('bsuRate'),F.data.bsuRate.periodText,F.text('savingsRate')]))"
    out = json.loads(subprocess.run(['node', '-e', script, str(root / 'dist/veileder-facts.js')], capture_output=True, text=True, check=True).stdout)
    assert out == ['5,60', 'september 2026', '2,88'], out
    assert '"2026 (jan. til sep.)",5.5,4.49' in (root / 'dist/bsu-rates.js').read_text(encoding='utf-8')
    html = (root / 'dist/spor.html').read_text(encoding='utf-8')
    assert 'veileder-facts.js?v=3' in html and 'bsu-rates.js?v=2' in html, 'versjon økt for endrede filer'
    assert kv.apply_ssb(s, root) is None, 'andre gang er alt à jour'



# ---------- Skatteetaten ----------

def bsu_page(annual='27 500', age='34'):
    return f"""<!doctype html><html><body><nav>Meny</nav><main><h1>Boligsparing for ungdom (BSU)</h1>
<p>Boligsparing for ungdom (BSU) er en spareform for deg som er under {age} år. Du kan spare til og med året du fyller {int(age) - 1}.</p>
<p>Årlig sparebeløp kan ikke overstige {annual} kroner.</p><p>Samlet innbetalt sparebeløp kan ikke overstige 300&nbsp;000 kroner.</p>
<p>For inntektsåret 2025 er fradraget 10 % av beløpet du har betalt inn. Du må ha skatt å betale for å få fradraget.</p>
<script>var x=1</script></main><footer>Bunn</footer></body></html>"""


@test
def side_med_ekte_ips_data_stemmer():
    body = (FIX / 'skatteetaten-ips-2026-10-30.html').read_bytes()
    events, data, info = kv.check_page(SRC['skatteetaten-ips'], state(), Net({'https://www.skatteetaten.no/': ok(body)}), REG, TODAY)
    assert info['nøkkeltall'] == {'ipsAnnual': 25000, 'ipsStartAge': 62, 'ipsEndAge': 80, 'ipsMinYears': 10}, info
    assert events == [], levels(events)


@test
def side_avvik_tekstendring_og_ingen_gjentakelse():
    s, src = state(), SRC['skatteetaten-bsu']
    events, data, info = kv.check_page(src, s, Net({'https://www.skatteetaten.no/': ok(bsu_page())}), REG, TODAY)
    assert events == [] and info['nøkkeltall'] == {'bsuAnnual': 27500, 'bsuTotal': 300000, 'bsuPercent': 10, 'bsuMaxAge': 33, 'Regelår nevnt på siden': 2025}, (levels(events), info)
    s.save(src['id'], data, {})
    events, data, _ = kv.check_page(src, s, Net({'https://www.skatteetaten.no/': ok(bsu_page('30 000'))}), REG, TODAY)
    assert ('høy', 'bsuAnnual: kilden sier 30000, nettsiden bruker 27500') in levels(events), levels(events)
    assert any(e['nivå'] == 'lav' and '+Årlig sparebeløp kan ikke overstige 30 000 kroner.' in e['tekst'] for e in events)
    s.save(src['id'], data, {})
    events, _, _ = kv.check_page(src, s, Net({'https://www.skatteetaten.no/': ok(bsu_page('30 000'))}), REG, TODAY)
    assert events == [], 'samme avvik varsles bare én gang'


@test
def side_som_er_avkuttet_eller_feil_godtas_ikke():
    for body, why in ((bsu_page()[:-20], 'sluttmarkør'), ('<html><main><h1>Siden finnes ikke</h1>' + 'x' * 300 + '</main></html>', 'feilside'),
                      ('<html><main><h1>A</h1><p>kort</p></main></html>', 'For lite')):
        try:
            kv.main_text(body.encode())
        except ValueError as error:
            assert why in str(error), error
        else:
            raise AssertionError(why)


@test
def tre_hentefeil_paa_rad_gir_driftssak():
    s = state()
    sources = {'kilder': [SRC['skatteetaten-bsu']], '_trinn': SOURCES['_trinn']}
    net = Net({'https://www.skatteetaten.no/': kv.Response(503, 'x', b'')})
    results = [kv.run(sources, s, net, REG, dt.date(2026, 9, 1))[0] for _ in range(4)]
    assert [len(r) for r in results] == [0, 0, 1, 0], [levels(r) for r in results]
    assert results[2][0]['sak'] == 'kildevakt-drift'


@test
def neste_aars_satser():
    s, src = state(), SRC['skatteetaten-bsu-satser-neste-ar']
    events, data, info = kv.check_page(src, s, Net({'https://www.skatteetaten.no/satser/fradrag-for-boligsparing-for-ungdom-bsu/?year=2027': kv.Response(404, 'x', b'')}), REG, TODAY)
    assert events == [] and data['publisert'] is False
    s.save(src['id'], data, {})
    page = bsu_page().replace('For inntektsåret 2025', 'For inntektsåret 2027')
    events, data, _ = kv.check_page(src, s, Net({'https://www.skatteetaten.no/satser/': ok(page)}), REG, TODAY)
    assert levels(events) == [('middels', 'Skatteetaten har trolig publisert BSU-satser for 2027')], levels(events)
    s.save(src['id'], data, {})
    assert kv.check_page(src, s, Net({'https://www.skatteetaten.no/satser/': ok(page)}), REG, TODAY)[0] == []


# ---------- Lovdata og Lovtidend ----------

def tar(files):
    buffer = io.BytesIO()
    with tarfile.open(fileobj=buffer, mode='w:bz2') as archive:
        for name, body in files.items():
            info = tarfile.TarInfo(name)
            info.size = len(body)
            archive.addfile(info, io.BytesIO(body))
    return buffer.getvalue()


def listing(**changed):
    rows = json.loads((FIX / 'lovdata-list-2026-10-30.json').read_text(encoding='utf-8'))
    for row in rows:
        row['lastModified'] = changed.get(row['filename'].split('.')[0].replace('-', '_'), row['lastModified'])
    return ok(json.dumps(rows))


@test
def lovdata_paragraf_endret():
    s, src = state(), SRC['lovdata-skatteloven']
    xml = (FIX / 'skatteloven-utdrag.xml').read_bytes()
    net = Net({kv.LOVDATA + '/list': listing(), kv.LOVDATA + '/get/gjeldende-lover': ok(tar({'nl/nl-19990326-014.xml': xml}))})
    events, data, info = kv.check_lovdata(src, s, net, REG, TODAY)
    assert events == [] and set(data['paragrafer']) == {'§16-10', '§6-47'}, (levels(events), list(data['paragrafer']))
    assert info['sist_endret_ved'].startswith('lov/2026-06-23-66'), info
    s.save(src['id'], data, {})
    quiet = Net({kv.LOVDATA + '/list': listing()})
    events, data2, info = kv.check_lovdata(src, s, quiet, REG, TODAY)
    assert events == [] and info['status'] == 'uendret pakke' and quiet.calls == [kv.LOVDATA + '/list'], 'laster ikke ned pakken når den er uendret'
    marker = 'data-name="§16-10" '.encode()
    start = xml.index(marker)
    end = xml.index(b'>', start) + 1
    changed = xml[:end] + 'Nytt ledd om BSU fra 2027.'.encode() + xml[end:]
    net = Net({kv.LOVDATA + '/list': listing(gjeldende_lover='2027-01-02T02:00:00Z'), kv.LOVDATA + '/get/gjeldende-lover': ok(tar({'nl/nl-19990326-014.xml': changed}))})
    events, _, _ = kv.check_lovdata(src, s, net, REG, TODAY)
    assert [e['nivå'] for e in events] == ['høy'] and '§16-10 er endret' in events[0]['tittel'], levels(events)
    assert 'bsuAnnual' in events[0]['fakta'] and '```diff' in events[0]['tekst']


def gazette(doc_id, title, in_force, refers):
    body = f'<html><head><title>{title}</title></head><body><header><dl><dd class="dokid">{doc_id}</dd><dd class="dateInForce">{in_force}</dd></dl></header>' \
           f'<main><p>I lov <a href="lov/{refers}">om skatt</a> gjøres endringer.</p></main></body></html>'
    return body.encode()


@test
def lovtidend_grunnlinje_og_ny_kunngjoring():
    s, src = state(), SRC['lovtidend']
    pack = {'lt/a.xml': gazette('LTI/lov/2026-06-23-66', 'Lov om endringer i skatteloven', '2026-07-01', '1999-03-26-14'),
            'lt/b.xml': gazette('LTI/lov/2026-06-20-60', 'Lov om endringer i skatteloven (BSU)', '2027-01-01', '1999-03-26-14'),
            'lt/c.xml': gazette('LTI/lov/2026-05-01-1', 'Lov om noe annet', '2026-06-01', '2005-06-17-62')}
    net = Net({kv.LOVDATA + '/list': listing(), kv.LOVDATA + '/get/lovtidend-avd1-2026': ok(tar(pack))})
    events, data, info = kv.check_lovtidend(src, s, net, REG, TODAY)
    kinds = levels(events)
    assert kinds[0] == ('middels', 'Kunngjorte endringer som ikke er i kraft ennå') and 'I kraft: 2027-01-01' in events[0]['tekst'], kinds
    assert '(BSU)' in events[0]['tekst'] and 'Lov om endringer i skatteloven.' not in events[0]['tekst'], 'bare framtidige i første varsel'
    assert kinds[1][0] == 'info' and info['nye_treff'] == 2
    s.save(src['id'], data, {})
    pack['lt/d.xml'] = gazette('LTI/forskrift/2026-11-10-9', 'Forskrift om endring i skatteforskriften', '2027-01-01', '1999-11-19-1158')
    net = Net({kv.LOVDATA + '/list': listing(lovtidend_avd1_2026='2026-11-11T02:31:00Z'), kv.LOVDATA + '/get/lovtidend-avd1-2026': ok(tar(pack))})
    events, _, info = kv.check_lovtidend(src, s, net, REG, TODAY)
    assert levels(events) == [('høy', 'Ny endring kunngjort i Norsk Lovtidend')] and 'skatteforskriften (FSFIN)' in events[0]['tekst'] and info['nye_treff'] == 1, levels(events)


# ---------- Stortinget og Norges Bank ----------

def storting(cases):
    return {kv.STORTINGET + '/sesjoner': ok(json.dumps({'innevaerende_sesjon': {'id': '2026-2027'}})),
            kv.STORTINGET + '/saker': ok(json.dumps({'sesjon_id': '2026-2027', 'saker_liste': cases}))}


@test
def stortinget_grunnlinje_ny_sak_og_ny_status():
    s, src = state(), SRC['stortinget']
    cases = [{'id': 1, 'tittel': 'Skatter, avgifter og toll 2027', 'korttittel': 'Skatter, avgifter og toll 2027', 'status': 'varslet'},
             {'id': 2, 'tittel': 'Petroleumsskatt', 'korttittel': 'Petroleumsskatt', 'status': 'varslet'},
             {'id': 3, 'tittel': 'Statsbudsjettet', 'korttittel': 'SBSU-ordningen', 'status': 'varslet'}]
    events, data, info = kv.check_stortinget(src, s, Net(storting(cases)), REG, TODAY)
    assert info['saker'] == 1 and [e['nivå'] for e in events] == ['info'], (info, levels(events))
    s.save(src['id'], data, {})
    cases[0]['status'] = 'behandlet'
    cases.append({'id': 4, 'tittel': 'Representantforslag om å øke BSU-grensen', 'korttittel': 'Øke BSU-grensen', 'status': 'mottatt'})
    events, _, _ = kv.check_stortinget(src, s, Net(storting(cases)), REG, TODAY)
    assert levels(events) == [('middels', 'Ny status på Stortinget: Skatter, avgifter og toll 2027'), ('middels', 'Ny sak på Stortinget: Øke BSU-grensen')], levels(events)


def sdmx(date, value):
    return ok(json.dumps({'data': {'dataSets': [{'series': {'0:0:0:0': {'observations': {'0': [value]}}}}],
                                   'structure': {'dimensions': {'observation': [{'values': [{'id': date}]}]}}}}))


@test
def norges_bank_endring():
    s, src = state(), SRC['norges-bank-styringsrente']
    events, data, _ = kv.check_norges_bank(src, s, Net({'https://data.norges-bank.no/': sdmx('2026-09-25', '4.5')}), REG, TODAY)
    assert events == [] and data['verdi'] == 4.5
    s.save(src['id'], data, {})
    events, _, _ = kv.check_norges_bank(src, s, Net({'https://data.norges-bank.no/': sdmx('2026-11-06', '4.25')}), REG, TODAY)
    assert levels(events) == [('middels', 'Styringsrenten er endret fra 4.5 til 4.25')]


# ---------- hele kjøringen og saker ----------

@test
def hel_kjoring_og_saker_i_toerrkjoring():
    s = state()
    pack = tar({'lt/b.xml': gazette('LTI/lov/x', 'Lov om endringer i skatteloven (BSU)', '2027-01-01', '1999-03-26-14')})
    xml = (FIX / 'skatteloven-utdrag.xml').read_bytes()
    net = Net({SSB: ok(ssb_body()), 'https://www.skatteetaten.no/satser/': kv.Response(404, 'x', b''),
               'https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bank-og-lan/': ok(bsu_page()),
               'https://www.skatteetaten.no/nn/': ok(bsu_page()),
               'https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/arbeid': ok((FIX / 'skatteetaten-ips-2026-10-30.html').read_bytes()),
               kv.LOVDATA + '/list': listing(), kv.LOVDATA + '/get/gjeldende-lover': ok(tar({'nl/nl-19990326-014.xml': xml})),
               kv.LOVDATA + '/get/gjeldende-sentrale-forskrifter': ok(tar({'sf/sf-19991119-1158.xml': xml.replace(b'NL/lov/1999-03-26-14', b'SF/forskrift/1999-11-19-1158')})),
               kv.LOVDATA + '/get/lovtidend-avd1-2026': ok(pack), **storting([]),
               'https://data.norges-bank.no/': sdmx('2026-09-25', '4.5')})
    events, summary = kv.run(SOURCES, s, net, REG, TODAY)
    status = {src['id']: st for src, st, _ in summary}
    assert all(not st.startswith('hentefeil') for st in status.values()), status
    assert kv.LOVDATA + '/list' in net.calls and net.calls.count(kv.LOVDATA + '/list') == 1, 'Lovdata-listen hentes én gang per kjøring'
    keys = {e['sak'] for e in events if e['nivå'] in kv.LEVELS}
    assert keys == {'ssb-11018', 'lovtidend', 'frister-2027-01-01'}, keys
    done = kv.notify(events, REG, None, dry_run=True)
    titles = [t for _, t, _ in done]
    assert 'Kildevakt: SSB tabell 11018: renter på innskudd, husholdninger' in titles, titles
    body = next(b for _, t, b in done if t.startswith('Kildevakt: SSB'))
    assert 'dist/veileder-knowledge.js' in body and 'Kildevakt retter aldri tall selv' in body, body
    assert 'Klar for 1. januar 2027?' in ' '.join(titles)
    md = kv.report_markdown(events, summary, TODAY)
    assert '| Lovdata: skatteloven (gjeldende) | ok |' in md
    events2, _ = kv.run(SOURCES, s, net, REG, TODAY)
    assert [e for e in events2 if e['nivå'] in kv.LEVELS] == [], levels(events2)


@test
def kildelisten_peker_paa_ekte_fakta():
    for src in SOURCES['kilder']:
        assert src['type'] in kv.CHECKS, src['id']
        ids = [k['fakta'] for k in src.get('nøkkeltall', []) if k.get('fakta')] + src.get('fakta', []) + list(src.get('serier', {}))
        ids += [f for fs in src.get('paragrafer', {}).values() for f in fs]
        for fid in ids:
            assert fid in REG['fakta'], (src['id'], fid)
        assert src.get('lisens'), src['id']


print(f'Kildevakt: {len(passed)} tester bestått ({", ".join(passed)}).')
