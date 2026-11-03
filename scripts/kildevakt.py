"""Kildevakt: følger kildene bak tallene på Spareverksted og varsler ved endring.

  python3 scripts/kildevakt.py tilgang                       HTTP-status for hver kilde
  python3 scripts/kildevakt.py kjør --tilstand DIR [--rapport FIL] [--kilde ID]
  python3 scripts/kildevakt.py varsle --rapport FIL [--tørrkjør]
  python3 scripts/kildevakt.py oppdater-ssb --tilstand DIR [--sammendrag FIL]
  python3 scripts/kildevakt.py lag-pr --gren GREN --tittel T --tekst FIL

Kildevakt retter aldri tall på nettsiden. Den lagrer hva kildene sa, sammenligner med forrige
henting og med kilder/fakta/, og åpner saker. Nye SSB-måneder kan bli en PR som Lars godkjenner.
Bare standardbiblioteket. Se docs/kildevakt.md.
"""
import argparse
import bz2
import csv
import datetime as dt
import difflib
import hashlib
import io
import json
import os
import re
import sys
import tarfile
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from decimal import Decimal, ROUND_HALF_UP
from html.parser import HTMLParser
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import fakta  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SOURCES = ROOT / 'kilder/kildeliste.json'
AGENT = 'Spareverksted-kildevakt/1.0 (+https://spareverksted.no)'
MAX_BYTES = 60_000_000
RAW_LIMIT = 3_000_000          # større rådata lagres bare som Actions-artefakt
FAIL_LIMIT = 3                 # hentefeil på rad før det blir sak
SSB_API = 'https://data.ssb.no/api/pxwebapi/v2/tables/{tabell}/data'
LOVDATA = 'https://api.lovdata.no/v1/publicData'
STORTINGET = 'https://data.stortinget.no/eksport'
NORGES_BANK = 'https://data.norges-bank.no/api/data/{flyt}/{nøkkel}'
LEVELS = ('høy', 'middels', 'lav')   # gir sak. 'info' havner bare i kjøringssammendraget.


# ---------- henting ----------

class Response:
    def __init__(self, status, url, body, headers=None):
        self.status, self.url, self.body, self.headers = status, url, body, headers or {}


def http_get(url, accept=None):
    request = urllib.request.Request(url, headers={'User-Agent': AGENT, **({'Accept': accept} if accept else {})})
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            body = response.read(MAX_BYTES + 1)
            if len(body) > MAX_BYTES:
                raise ValueError('Svaret er større enn grensen; fullstendighet kan ikke bekreftes')
            return Response(response.status, response.url, body, dict(response.headers))
    except urllib.error.HTTPError as error:
        return Response(error.code, url, error.read(200_000), dict(error.headers or {}))


def sha(data):
    return hashlib.sha256(data if isinstance(data, bytes) else data.encode('utf-8')).hexdigest()


def now():
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()


# ---------- tekst fra nettsider ----------

class MainText(HTMLParser):
    BLOCKS = {'p', 'li', 'tr', 'h1', 'h2', 'h3', 'h4', 'dt', 'dd', 'td', 'th', 'br', 'div', 'section'}
    SKIP = {'script', 'style', 'nav', 'noscript', 'svg', 'template'}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.depth = 0; self.mains = 0; self.skip = 0; self.parts = []; self.h1 = []; self.in_h1 = False

    def handle_starttag(self, tag, attrs):
        if tag == 'main':
            self.mains += 1; self.depth += 1; return
        if self.depth:
            if tag in self.SKIP: self.skip += 1
            if tag in self.BLOCKS: self.parts.append('\n')
            if tag == 'h1': self.in_h1 = True

    def handle_endtag(self, tag):
        if tag == 'main' and self.depth:
            self.depth -= 1; return
        if self.depth:
            if tag in self.SKIP and self.skip: self.skip -= 1
            if tag in self.BLOCKS: self.parts.append('\n')
            if tag == 'h1': self.in_h1 = False

    def handle_data(self, data):
        if self.depth and not self.skip:
            self.parts.append(data)
            if self.in_h1: self.h1.append(data)


def normalize(text):
    text = text.replace(' ', ' ').replace(' ', ' ').replace(' ', ' ')
    lines = (' '.join(line.split()) for line in text.splitlines())
    return '\n'.join(line for line in lines if line)


def main_text(raw):
    """Hovedteksten i <main>. Stopper ved avkuttede sider og feilsider."""
    if not re.search(rb'</html\s*>', raw[-5000:], re.I):
        raise ValueError('HTML mangler sluttmarkør; siden kan være avkuttet')
    parser = MainText()
    parser.feed(raw.decode('utf-8', errors='replace'))
    if parser.mains != 1:
        raise ValueError(f'Forventet ett <main>-element, fant {parser.mains}')
    text = normalize(''.join(parser.parts))
    heading = ' '.join(''.join(parser.h1).split()).lower()
    if len(text) < 200 or not heading:
        raise ValueError('For lite hovedinnhold eller mangler overskrift')
    if any(x in heading for x in ('ikke funnet', 'finnes ikke', 'finner ikke', 'not found', 'access denied', 'gikk galt', 'gikk feil', '404')):
        raise ValueError('Siden ser ut som en feilside: ' + heading)
    return text


def number(text):
    return int(re.sub(r'\D', '', text))


# ---------- tilstand ----------

class State:
    """Én mappe per kilde: siste.json, logg.jsonl og rå/ med uendrede kildefiler."""

    def __init__(self, root):
        self.root = Path(root)

    def last(self, sid):
        path = self.root / sid / 'siste.json'
        return json.loads(path.read_text(encoding='utf-8')) if path.exists() else None

    def save(self, sid, data, log):
        folder = self.root / sid
        folder.mkdir(parents=True, exist_ok=True)
        (folder / 'siste.json').write_text(json.dumps(data, ensure_ascii=False, indent=1, sort_keys=True) + '\n', encoding='utf-8')
        with (folder / 'logg.jsonl').open('a', encoding='utf-8') as stream:
            stream.write(json.dumps(log, ensure_ascii=False, sort_keys=True) + '\n')

    def raw(self, sid, name, body, meta):
        """Lagrer rådata byte for byte, med kilde og sjekksum ved siden av. Endres aldri etterpå."""
        if len(body) > RAW_LIMIT:
            return None
        folder = self.root / sid / 'rå'
        folder.mkdir(parents=True, exist_ok=True)
        stamp = meta['hentet'].replace(':', '').replace('+0000', 'Z')[:17]
        path = folder / f'{stamp}-{name}'
        path.write_bytes(body)
        (folder / f'{stamp}-{name}.meta.json').write_text(json.dumps({**meta, 'fil': path.name, 'sha256': sha(body), 'bytes': len(body)}, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
        return path.relative_to(self.root).as_posix()


def event(source, level, title, text, facts=(), key=None, **extra):
    return {'kilde': source['id'], 'navn': source['navn'], 'trinn': source.get('trinn'), 'nivå': level, 'tittel': title,
            'tekst': text, 'fakta': list(facts), 'sak': key or source['id'], **extra}


def diff(old, new, limit=60):
    lines = list(difflib.unified_diff(old.splitlines(), new.splitlines(), 'forrige', 'ny', lineterm='', n=1))
    return '\n'.join(lines[:limit]) + ('\n…' if len(lines) > limit else '')


# ---------- SSB ----------

def ssb_url(source):
    params = [('lang', 'no'), ('outputFormat', 'json-stat2')]
    for dim, codes in source['spørring'].items():
        params.append((f'valueCodes[{dim}]', codes if isinstance(codes, str) else ','.join(codes)))
    return SSB_API.format(tabell=source['tabell']) + '?' + urllib.parse.urlencode(params, safe='[](),')


def parse_ssb(raw, source):
    """json-stat2 til {serie: {periode: verdi}}. Perioden leses fra dataene, aldri fra dagens dato."""
    data = json.loads(raw)
    ids, sizes, dims = data['id'], data['size'], data['dimension']
    for dim, expected in source['forventet'].items():
        labels = dims[dim]['category']['label']
        for code, word in expected.items():
            if code not in labels or word.lower() not in labels[code].lower():
                raise StructureError(f'{dim} {code}: forventet «{word}», SSB sier «{labels.get(code)}»')
    time_dim = (data.get('role') or {}).get('time', ['Tid'])[0]
    index = {dim: dims[dim]['category']['index'] for dim in ids}
    periods = sorted(index[time_dim], key=index[time_dim].get)
    values = data['value']
    if isinstance(values, dict):
        values = [values.get(str(i)) for i in range(eval_size(sizes))]
    out = {}
    for name, spec in source['serier'].items():
        series = {}
        for period in periods:
            position = {**spec, time_dim: period}
            flat = 0
            for dim, size in zip(ids, sizes):
                code = position.get(dim)
                if code is None:
                    if size != 1:
                        raise StructureError(f'Dimensjonen {dim} mangler i serien {name}')
                    code = next(iter(index[dim]))
                flat = flat * size + index[dim][code]
            if values[flat] is not None:
                series[period] = float(values[flat])
        out[name] = series
    return out, data.get('updated')


def eval_size(sizes):
    total = 1
    for size in sizes:
        total *= size
    return total


class StructureError(ValueError):
    pass


def check_ssb(source, state, get, reg, today):
    url = ssb_url(source)
    response = get(url)
    if response.status != 200:
        raise FetchError(f'HTTP {response.status}', response.status)
    fetched = now()
    previous = state.last(source['id']) or {}
    events = []
    try:
        series, updated = parse_ssb(response.body, source)
    except (StructureError, KeyError, IndexError, ValueError) as error:
        events.append(event(source, 'høy', 'SSB har endret tabellen', f'Kildevakt leste ikke tallene: {error}. Ingen tall er brukt.', list(source['serier'])))
        return events, {**previous, 'hentet': fetched}, {'status': 'strukturendring'}
    meta = {'kilde': source['navn'], 'url': url, 'endelig_url': response.url, 'hentet': fetched, 'lisens': source['lisens'], 'ssb_oppdatert': updated}
    raw_path = None
    if sha(response.body) != previous.get('sha256'):
        raw_path = state.raw(source['id'], 'ssb.json', response.body, meta)
    pending = {}
    for name, values in series.items():
        fact = reg['fakta'][name]
        repo = dict(fakta.series(fact, ROOT))
        latest = max(repo) if repo else ''
        new = {p: v for p, v in values.items() if p > latest}
        revised = {p: (repo[p], v) for p, v in values.items() if p in repo and abs(repo[p] - v) > 1e-9}
        old_seen = (previous.get('serier') or {}).get(name, {})
        same_day = {p: (old_seen[p], v) for p, v in values.items() if p in old_seen and abs(old_seen[p] - v) > 1e-9}
        if new or revised:
            pending[name] = {'nye': new, 'revidert': {p: list(x) for p, x in revised.items()}}
        if same_day:
            events.append(event(source, 'info', f'{name}: SSB har revidert {len(same_day)} måned(er) siden forrige henting',
                                ', '.join(f'{p}: {a} → {b}' for p, (a, b) in sorted(same_day.items())), [name]))
    checks = dict(previous.get('manuell_kontroll') or {})
    for manual in source.get('manuell_kontroll', []):
        key = f"{manual['fakta']}:{manual['periode']}"
        got = series.get(manual['fakta'], {}).get(manual['periode'])
        if got is None or key in checks:
            continue
        ok = abs(got - manual['verdi']) < 1e-9
        checks[key] = {'resultat': 'bekreftet' if ok else 'avvik', 'hentet': got, 'avlest': manual['verdi'], 'tid': fetched}
        text = (f"{manual['avlest_av']} leste av {manual['verdi']} for {manual['periode']} ({manual['hvor']}, {manual['dato']}). "
                f"Første automatiske henting ga {got}.")
        events.append(event(source, 'info' if ok else 'høy', 'Manuell kontroll ' + ('bekreftet' if ok else 'avviker'), text, [manual['fakta']]))
    fingerprint = sha(json.dumps(pending, sort_keys=True))
    if pending and fingerprint != previous.get('ventende_sha'):
        lines = []
        for name, change in pending.items():
            for p, v in sorted(change['nye'].items()):
                lines.append(f'- {name}: ny måned {p} = {v}')
            for p, (a, b) in sorted(change['revidert'].items()):
                lines.append(f'- {name}: {p} revidert fra {a} til {b}')
        latest = max(p for c in pending.values() for p in c['nye']) if any(c['nye'] for c in pending.values()) else None
        events.append(event(source, 'middels', f'Nye SSB-tall' + (f' til og med {latest}' if latest else ' (revisjon)'),
                            'SSB har tall som ikke er på nettsiden ennå:\n' + '\n'.join(lines), list(pending), ssb_ventende=True, periode=latest))
    data = {'hentet': fetched, 'url': url, 'sha256': sha(response.body), 'ssb_oppdatert': updated, 'serier': series,
            'ventende': pending, 'ventende_sha': fingerprint if pending else None, 'manuell_kontroll': checks, 'rådata': raw_path or previous.get('rådata')}
    return events, data, {'status': 'ok', 'perioder': {k: max(v) if v else None for k, v in series.items()}, 'ssb_oppdatert': updated}


# ---------- nettsider (Skatteetaten) ----------

def check_page(source, state, get, reg, today):
    target_year = today.year + 1
    url = source['url'].replace('{neste_år}', str(target_year))
    response = get(url)
    previous = state.last(source['id']) or {}
    fetched = now()
    if source.get('neste_år'):
        published = response.status == 200
        text = None
        if published:
            try:
                text = main_text(response.body)
                published = str(target_year) in text
            except ValueError:
                published = False
        was = previous.get('publisert') and previous.get('år') == target_year
        data = {**previous, 'hentet': fetched, 'url': url, 'år': target_year, 'publisert': bool(published), 'status': response.status}
        events = []
        if published and not was:
            data['tekst_sha256'] = sha(text)
            data['tekst'] = text
            events.append(event(source, 'middels', f'Skatteetaten har trolig publisert BSU-satser for {target_year}',
                                f'Siden {url} svarer og nevner {target_year}. Sjekk satsene og legg inn nye verdier med fra={target_year}-01-01 '
                                f'og status vedtatt i kilder/fakta/, eller sett bekreftet_til.\n\nUtdrag:\n' + text[:1200], source.get('fakta', []), key=f"{source['id']}-{target_year}"))
        return events, data, {'status': 'publisert' if published else f'ikke publisert (HTTP {response.status})'}
    if response.status != 200:
        raise FetchError(f'HTTP {response.status}', response.status)
    text = main_text(response.body)
    text_sha = sha(text)
    events = []
    meta = {'kilde': source['navn'], 'url': url, 'endelig_url': response.url, 'hentet': fetched, 'lisens': source['lisens'], 'html_sha256': sha(response.body)}
    if text_sha != previous.get('tekst_sha256'):
        state.raw(source['id'], 'hovedtekst.txt', text.encode('utf-8'), meta)
        if previous.get('tekst'):
            events.append(event(source, 'lav', 'Teksten på siden er endret', 'Endring i hovedteksten:\n\n```diff\n' + diff(previous['tekst'], text) + '\n```',
                                [k['fakta'] for k in source['nøkkeltall'] if k.get('fakta')]))
    found, mismatches = {}, dict(previous.get('avvik') or {})
    date = today.isoformat()
    for spec in source['nøkkeltall']:
        match = re.search(spec['mønster'], text)
        label = spec.get('fakta') or spec['navn']
        if not match:
            found[label] = None
            if (previous.get('nøkkeltall') or {}).get(label) is not None or not previous:
                events.append(event(source, 'middels', f'Fant ikke «{label}» på siden', f'Mønsteret «{spec["mønster"]}» traff ikke. Siden kan være skrevet om.', [spec.get('fakta')] if spec.get('fakta') else []))
            continue
        value = match.group(1) if spec.get('tekst') else number(match.group(1)) + spec.get('justering', 0)
        found[label] = value
        if spec.get('fakta'):
            fact = reg['fakta'][spec['fakta']]
            ours = fakta.current(fact, date, ROOT)
            if ours != value:
                if mismatches.get(label) != value:
                    events.append(event(source, 'høy', f'{spec["fakta"]}: kilden sier {value}, nettsiden bruker {ours}',
                                        f'Treff: «{match.group(0)}». Kontroller mot primærkilden og oppdater kilder/fakta/ med riktig dato og status.', [spec['fakta']]))
                mismatches[label] = value
            else:
                mismatches.pop(label, None)
        elif (previous.get('nøkkeltall') or {}).get(label) not in (None, value):
            events.append(event(source, 'middels', f'{label}: endret fra {previous["nøkkeltall"][label]} til {value}', f'Treff: «{match.group(0)}». ' + spec.get('gjør', ''), spec.get('berører', [])))
    data = {'hentet': fetched, 'url': url, 'endelig_url': response.url, 'html_sha256': meta['html_sha256'], 'tekst_sha256': text_sha, 'tekst': text,
            'nøkkeltall': found, 'avvik': mismatches}
    return events, data, {'status': 'ok', 'nøkkeltall': found}


# ---------- Lovdata ----------

def lovdata_list(get):
    response = get(LOVDATA + '/list')
    if response.status != 200:
        raise FetchError(f'Lovdata-listen: HTTP {response.status}', response.status)
    return {row['filename']: row for row in json.loads(response.body)}


def tar_members(body):
    return tarfile.open(fileobj=io.BytesIO(body), mode='r:bz2')


def header(root):
    out = {}
    for dd in root.iter('dd'):
        cls = dd.get('class')
        if cls:
            out[cls] = ' '.join(''.join(dd.itertext()).split())
    return out


def paragraphs(root, prefixes):
    out = {}
    for article in root.iter('article'):
        name = article.get('data-name') or ''
        if article.get('class') == 'legalArticle' and any(name == p or name.startswith(p + '-') for p in prefixes):
            out[name] = normalize(' '.join(article.itertext()))
    return out


def parse_law(xml_bytes, prefixes):
    root = ET.fromstring(xml_bytes)
    head = header(root)
    return {'tittel': ' '.join(''.join(root.find('.//title').itertext()).split()) if root.find('.//title') is not None else '',
            'sist_endret_ved': head.get('lastChangedBy'), 'siste_endring_i_kraft': head.get('lastChangeInForce'),
            'paragrafer': paragraphs(root, prefixes)}


def check_lovdata(source, state, get, reg, today, listing=None):
    listing = listing or lovdata_list(get)
    package = listing.get(source['pakke'])
    if not package:
        raise StructureError(f'Lovdata har ikke pakken {source["pakke"]}')
    previous = state.last(source['id']) or {}
    if previous.get('pakke_endret') == package['lastModified']:
        return [], {**previous, 'kontrollert': now()}, {'status': 'uendret pakke'}
    url = f'{LOVDATA}/get/{source["pakke"]}'
    response = get(url)
    if response.status != 200:
        raise FetchError(f'HTTP {response.status}', response.status)
    fetched = now()
    with tar_members(response.body) as archive:
        member = archive.extractfile(source['dokument'])
        if member is None:
            raise StructureError(f'Fant ikke {source["dokument"]} i pakken')
        xml = member.read()
    law = parse_law(xml, list(source['paragrafer']))
    if not law['paragrafer']:
        raise StructureError('Fant ingen av de fulgte paragrafene')
    events = []
    meta = {'kilde': source['navn'], 'url': url, 'hentet': fetched, 'lisens': source['lisens'], 'pakke': package, 'dokument': source['dokument']}
    if sha(xml) != previous.get('dokument_sha256'):
        state.raw(source['id'], Path(source['dokument']).name, xml, meta)
    old = previous.get('paragrafer') or {}
    if old:
        for name in sorted(set(old) | set(law['paragrafer'])):
            before, after = old.get(name), law['paragrafer'].get(name)
            if before == after:
                continue
            prefix = next(p for p in source['paragrafer'] if name == p or name.startswith(p + '-'))
            what = 'ny' if before is None else 'opphevet' if after is None else 'endret'
            events.append(event(source, 'høy', f'{law["tittel"][:60]} {name} er {what}',
                                f'Sist endret ved {law["sist_endret_ved"]}, siste endring i kraft {law["siste_endring_i_kraft"]}.\n\n```diff\n{diff(before or "", after or "")}\n```',
                                source['paragrafer'][prefix]))
    data = {'hentet': fetched, 'pakke_endret': package['lastModified'], 'dokument_sha256': sha(xml), 'paragrafer': law['paragrafer'],
            'sist_endret_ved': law['sist_endret_ved'], 'siste_endring_i_kraft': law['siste_endring_i_kraft']}
    return events, data, {'status': 'ok', 'sist_endret_ved': law['sist_endret_ved']}


def check_lovtidend(source, state, get, reg, today, listing=None):
    listing = listing or lovdata_list(get)
    previous = state.last(source['id']) or {}
    years = [today.year] + ([today.year - 1] if today.month == 1 else [])
    seen = dict(previous.get('sett') or {})
    stamps = dict(previous.get('pakke_endret') or {})
    events, found = [], []
    baseline = not previous
    for year in years:
        name = source['pakke'].replace('{år}', str(year))
        package = listing.get(name)
        if not package or stamps.get(name) == package['lastModified']:
            continue
        response = get(f'{LOVDATA}/get/{name}')
        if response.status != 200:
            raise FetchError(f'HTTP {response.status}', response.status)
        with tar_members(response.body) as archive:
            for member in archive.getmembers():
                if not member.isfile() or member.name in seen:
                    continue
                body = archive.extractfile(member).read()
                hits = [label for key, label in source['følger'].items() if key.encode() in body]
                seen[member.name] = bool(hits)
                if hits:
                    try:
                        root = ET.fromstring(body)
                        head = header(root)
                        title = ' '.join(''.join(root.find('.//title').itertext()).split())
                    except (ET.ParseError, AttributeError):
                        head, title = {}, member.name
                    found.append({'dokument': member.name, 'tittel': title, 'endrer': hits, 'i_kraft': head.get('dateInForce'),
                                  'kunngjort': head.get('dateOfPublication') or head.get('datePublished'), 'id': head.get('dokid')})
        stamps[name] = package['lastModified']
    if found:
        lines = '\n'.join(f"- {f['tittel']} ({', '.join(f['endrer'])}). I kraft: {f['i_kraft'] or 'ikke oppgitt'}. {f['dokument']}" for f in found)
        if baseline:
            future = [f for f in found if (f['i_kraft'] or '') > today.isoformat()]
            if future:
                events.append(event(source, 'middels', 'Kunngjorte endringer som ikke er i kraft ennå',
                                    'Første kjøring fant endringer i skatteloven eller skatteforskriften med senere ikrafttredelse:\n' +
                                    '\n'.join(f"- {f['tittel']}. I kraft: {f['i_kraft']}." for f in future)))
            events.append(event(source, 'info', f'Grunnlinje: {len(found)} endringer kunngjort i år berører fulgte regelverk', lines))
        else:
            events.append(event(source, 'høy', 'Ny endring kunngjort i Norsk Lovtidend',
                                lines + '\n\nLes kunngjøringen. Gjelder den BSU, IPS eller ASK, legg inn ny verdi med fra=ikrafttredelsesdatoen og status vedtatt i kilder/fakta/.'))
    data = {'hentet': now(), 'pakke_endret': stamps, 'sett': seen, 'funn': (previous.get('funn') or []) + found}
    return events, data, {'status': 'ok', 'nye_treff': len(found)}


# ---------- Stortinget ----------

def find_list(data, key):
    if isinstance(data, dict):
        for k, v in data.items():
            if k == key and isinstance(v, list):
                return v
            got = find_list(v, key)
            if got is not None:
                return got
    return None


def check_stortinget(source, state, get, reg, today):
    response = get(STORTINGET + '/sesjoner?format=json')
    if response.status != 200:
        raise FetchError(f'HTTP {response.status}', response.status)
    session = json.loads(response.body)['innevaerende_sesjon']['id']
    response = get(STORTINGET + f'/saker?sesjonid={session}&format=json')
    if response.status != 200:
        raise FetchError(f'HTTP {response.status}', response.status)
    cases = find_list(json.loads(response.body), 'saker_liste')
    if cases is None:
        raise StructureError('Fant ikke saker_liste i svaret fra Stortinget')
    words = [w.lower() for w in source['ord']]
    matches = {}
    for case in cases:
        title = ' '.join(str(case.get(k) or '') for k in ('tittel', 'korttittel'))
        if any(re.search(r'(?<!\w)' + re.escape(w) + r'(?!\w)', title.lower()) for w in words):
            matches[str(case.get('id'))] = {'tittel': case.get('korttittel') or case.get('tittel'), 'status': case.get('status'),
                                           'sist_oppdatert': case.get('sist_oppdatert_dato'), 'dokumentgruppe': case.get('dokumentgruppe')}
    previous = state.last(source['id']) or {}
    old = previous.get('saker') if previous.get('sesjon') == session else None
    events = []
    link = 'https://www.stortinget.no/no/Saker-og-publikasjoner/Saker/Sak/?p='
    if old is None:
        if matches:
            events.append(event(source, 'info', f'Grunnlinje {session}: {len(matches)} saker følges',
                                '\n'.join(f"- {m['tittel']} (status {m['status']}) {link}{i}" for i, m in sorted(matches.items()))))
    else:
        for case_id, case in sorted(matches.items()):
            before = old.get(case_id)
            if before is None:
                events.append(event(source, 'middels', f'Ny sak på Stortinget: {case["tittel"]}', f'Status {case["status"]}. {link}{case_id}', key=f'stortinget-{case_id}'))
            elif before.get('status') != case['status']:
                events.append(event(source, 'middels', f'Ny status på Stortinget: {case["tittel"]}', f'Status {before.get("status")} → {case["status"]}. {link}{case_id}', key=f'stortinget-{case_id}'))
    data = {'hentet': now(), 'sesjon': session, 'saker': matches}
    return events, data, {'status': 'ok', 'saker': len(matches)}


# ---------- Norges Bank ----------

def check_norges_bank(source, state, get, reg, today):
    url = NORGES_BANK.format(flyt=source['flyt'], nøkkel=source['nøkkel']) + '?format=sdmx-json&lastNObservations=1&locale=no'
    response = get(url)
    if response.status != 200:
        raise FetchError(f'HTTP {response.status}', response.status)
    data = json.loads(response.body)
    body = data.get('data', data)
    dates = body['structure']['dimensions']['observation'][0]['values']
    series = next(iter(body['dataSets'][0]['series'].values()))
    position, value = max(((int(k), v) for k, v in series['observations'].items()))
    period, value = dates[position]['id'], float(value[0])
    previous = state.last(source['id']) or {}
    fetched = now()
    meta = {'kilde': 'Norges Bank', 'url': url, 'hentet': fetched, 'lisens': source['lisens']}
    events = []
    if (previous.get('periode'), previous.get('verdi')) != (period, value):
        state.raw(source['id'], 'sdmx.json', response.body, meta)
        if previous.get('verdi') is not None and previous['verdi'] != value:
            events.append(event(source, 'middels', f'Styringsrenten er endret fra {previous["verdi"]} til {value}', f'Gjelder fra {period}. Kilde: Norges Bank. Sjekk tekster som omtaler rentenivået.'))
    return events, {'hentet': fetched, 'periode': period, 'verdi': value}, {'status': 'ok', 'periode': period, 'verdi': value}


class FetchError(RuntimeError):
    def __init__(self, message, status=None):
        super().__init__(message)
        self.status = status


CHECKS = {'ssb': check_ssb, 'side': check_page, 'lovdata': check_lovdata, 'lovtidend': check_lovtidend,
          'stortinget': check_stortinget, 'norges-bank': check_norges_bank}


def deadline_events(reg, state, today):
    events = []
    groups = {}
    for row in fakta.deadlines(reg, today):
        groups.setdefault(row['frist'], []).append(row)
    previous = state.last('frister') or {}
    for deadline, rows in sorted(groups.items()):
        fingerprint = sha(json.dumps(rows, sort_keys=True))
        if previous.get(deadline) == fingerprint:
            continue
        previous[deadline] = fingerprint
        lines = '\n'.join(f"- {r['id']}: bekreftet til {r['bekreftet_til']}" + (f" (ny verdi {r['ny_verdi']['verdi']} fra {r['ny_verdi']['fra']}, status {r['ny_verdi']['status']})" if r['ny_verdi'] else '') for r in rows)
        events.append({'kilde': 'frister', 'navn': 'Faktaregisteret', 'trinn': None, 'nivå': 'middels', 'tittel': f'Klar for {fakta.date_text(deadline)}?',
                       'tekst': f'Disse reglene er ikke bekreftet til etter {fakta.date_text(deadline)}:\n{lines}\n\nFor hver: les primærkilden, og enten sett «bekreftet_til» '
                                f'eller legg inn ny verdi med «fra»: «{deadline}», status «vedtatt» og kilde i kilder/fakta/.',
                       'fakta': [r['id'] for r in rows], 'sak': f'frister-{deadline}'})
    if events:
        state.save('frister', previous, {'hentet': now(), 'frister': list(groups)})
    return events


def run(sources, state, get, reg, today, only=None):
    events, summary = [], []
    listing = None
    for source in sources['kilder']:
        if only and source['id'] not in only:
            continue
        check = CHECKS[source['type']]
        previous = state.last(source['id']) or {}
        try:
            if source['type'] in ('lovdata', 'lovtidend'):
                listing = listing or lovdata_list(get)
                found, data, info = check(source, state, get, reg, today, listing)
            else:
                found, data, info = check(source, state, get, reg, today)
            data['feil_på_rad'] = 0
            state.save(source['id'], data, {'tid': now(), **info, 'hendelser': len(found)})
            events += found
            summary.append((source, info.get('status', 'ok'), info))
        except (FetchError, StructureError, OSError, ValueError, KeyError, ET.ParseError, tarfile.TarError) as error:
            failures = int(previous.get('feil_på_rad') or 0) + 1
            state.save(source['id'], {**previous, 'feil_på_rad': failures, 'siste_feil': str(error)}, {'tid': now(), 'status': 'hentefeil', 'feil': str(error)})
            summary.append((source, f'hentefeil ({error})', {}))
            if failures == FAIL_LIMIT:
                events.append({'kilde': source['id'], 'navn': 'Kildevakt drift', 'trinn': None, 'nivå': 'middels', 'tittel': f'{source["navn"]}: {FAIL_LIMIT} hentefeil på rad',
                               'tekst': f'Siste feil: {error}', 'fakta': [], 'sak': 'kildevakt-drift'})
    events += deadline_events(reg, state, today)
    return events, summary


# ---------- rapport og saker ----------

def report_markdown(events, summary, today):
    lines = [f'## Kildevakt {today.isoformat()}', '', '| Kilde | Status |', '| --- | --- |']
    for source, status, _ in summary:
        lines.append(f"| {source['navn']} | {status} |")
    lines.append('')
    if not events:
        lines.append('Ingen endringer.')
    for e in events:
        lines += [f"### [{e['nivå']}] {e['tittel']}", '', e['tekst'], '']
    return '\n'.join(lines)


def issue_body(e, reg):
    stage = load_sources()['_trinn'].get(str(e.get('trinn')), '') if e.get('trinn') else ''
    lines = [f"**{e['tittel']}**", '', f"Kilde: {e['navn']}" + (f' · trinn: {stage}' if stage else '') + f" · nivå: {e['nivå']}", '', e['tekst'], '']
    if e.get('pr'):
        lines += [f"Forslag til endring: {e['pr']}", '']
    places = []
    for fid in e['fakta']:
        if fid in reg['fakta']:
            files = sorted({h[0] for h in fakta.places(fid, reg)})
            site = [f for f in files if f.startswith('dist/')]
            tests = [f for f in files if f.startswith('tests/') and not f.startswith('tests/fixtures/') and f != 'tests/kildevakt.test.py']
            notes = len(files) - len(site) - len(tests)
            places.append(f'- `{fid}`: nettsiden ' + (', '.join(f'`{f}`' for f in site) or 'ingen') +
                          (f'; tester som sjekker tallet: ' + ', '.join(f'`{f}`' for f in tests) if tests else '') +
                          (f'; {notes} notater (historikk, endres ikke)' if notes else ''))
    if places:
        lines += ['Berørte fakta (`python3 scripts/fakta.py steder ID` viser linjene):', *places, '']
    lines += ['Kildevakt retter aldri tall selv. Endringer i kilder/fakta/ går som vanlig PR til godkjenning.']
    return '\n'.join(lines)


class GitHub:
    def __init__(self, repo, token, api='https://api.github.com'):
        self.repo, self.token, self.api = repo, token, api

    def call(self, method, path, body=None):
        request = urllib.request.Request(self.api + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                                         headers={'Authorization': f'Bearer {self.token}', 'Accept': 'application/vnd.github+json', 'User-Agent': AGENT,
                                                  'X-GitHub-Api-Version': '2022-11-28'})
        with urllib.request.urlopen(request, timeout=60) as response:
            return json.loads(response.read() or b'null')

    def open_issues(self):
        return self.call('GET', f'/repos/{self.repo}/issues?labels=kildevakt&state=open&per_page=100')


def notify(events, reg, github, dry_run=False):
    actionable = [e for e in events if e['nivå'] in LEVELS]
    grouped = {}
    for e in actionable:
        grouped.setdefault(e['sak'], []).append(e)
    existing = {} if dry_run else {i['title']: i for i in github.open_issues() if 'pull_request' not in i}
    done = []
    for key, items in grouped.items():
        title = f"Kildevakt: {items[0]['navn']}" + ('' if key == items[0]['kilde'] else f' ({items[0]["tittel"][:70]})')
        body = '\n\n---\n\n'.join(issue_body(e, reg) for e in items)
        level = 'høy' if any(e['nivå'] == 'høy' for e in items) else items[0]['nivå']
        if dry_run:
            done.append(('tørrkjør', title, body))
        elif title in existing:
            github.call('POST', f"/repos/{github.repo}/issues/{existing[title]['number']}/comments", {'body': body})
            done.append(('kommentar', title, existing[title]['number']))
        else:
            issue = github.call('POST', f'/repos/{github.repo}/issues', {'title': title, 'body': body, 'labels': ['kildevakt', f'kildevakt-{level}']})
            done.append(('ny sak', title, issue['number']))
    return done


# ---------- SSB-oppdatering som PR ----------

SHORT = ['jan.', 'feb.', 'mars', 'apr.', 'mai', 'juni', 'juli', 'aug.', 'sep.', 'okt.', 'nov.', 'des.']


def mean(values):
    return (sum(Decimal(str(v)) for v in values) / len(values)).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)


def apply_bsu_csv(series, reg, root, changes):
    """BSU og bundne innskudd ligger i en egen månedsfil og har årssnitt. Returnerer år som er endret, og radene."""
    monthly_path = root / reg['fakta']['bsuRate']['serie']['fil']
    with monthly_path.open(encoding='utf-8') as stream:
        reader = csv.DictReader(stream)
        fields, rows = reader.fieldnames, {r['måned']: r for r in reader}
    bsu, bound = series.get('bsuRate', {}), series.get('boundRate', {})
    touched = set()
    for period in sorted(set(bsu) & set(bound)):
        new = {'måned': period, 'BSU prosent': repr(bsu[period]), 'bundne innskudd prosent': repr(bound[period])}
        old = rows.get(period)
        if old is None:
            changes.append(f'BSU og bundne innskudd: ny måned {period} ({bsu[period]} og {bound[period]})')
        elif float(old['BSU prosent']) != bsu[period] or float(old['bundne innskudd prosent']) != bound[period]:
            changes.append(f"{period} revidert: BSU {old['BSU prosent']} → {bsu[period]}, bundne {old['bundne innskudd prosent']} → {bound[period]}")
        else:
            continue
        rows[period] = new
        touched.add(period[:4])
    if touched:
        with monthly_path.open('w', encoding='utf-8', newline='') as stream:
            writer = csv.DictWriter(stream, fieldnames=fields, lineterminator='\n')
            writer.writeheader()
            for period in sorted(rows):
                writer.writerow(rows[period])
    return touched, rows


def apply_bsu_annual(rows, touched, savings_known, root, changes):
    annual_path = root / 'research/bsu-rente-arssnitt-2018-2026.csv'
    with annual_path.open(encoding='utf-8') as stream:
        reader = csv.DictReader(stream)
        afields, annual = reader.fieldnames, list(reader)
    by_year = {}
    for period in sorted(rows):
        by_year.setdefault(period[:4], []).append(rows[period])
    for year in sorted(y for y in touched if y in by_year):
        months = by_year[year]
        row = next((r for r in annual if r['år'] == year), None)
        if row is None:
            row = {'år': year, 'ikke-bundne innskudd prosent': ''}
            annual.append(row)
        row['antall måneder'] = str(len(months))
        row['periode'] = 'jan.–' + SHORT[len(months) - 1]
        row['BSU prosent'] = str(mean([m['BSU prosent'] for m in months]))
        row['bundne innskudd prosent'] = str(mean([m['bundne innskudd prosent'] for m in months]))
        year_savings = [v for p, v in savings_known.items() if p.startswith(year)]
        if len(year_savings) == len(months):
            row['ikke-bundne innskudd prosent'] = str(mean(year_savings))
        else:
            changes.append(f'Merk: snittet for ikke-bundne innskudd i {year} er ikke regnet på nytt (SSB-hentingen dekker ikke alle månedene).')
    with annual_path.open('w', encoding='utf-8', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=afields, lineterminator='\n')
        writer.writeheader()
        writer.writerows(sorted(annual, key=lambda r: r['år']))


def apply_ssb(state, root=ROOT):
    """Skriv nye og reviderte SSB-tall inn i repoet, for alle SSB-kilder i kildelisten.
    Tall med "serie" (BSU-fila) og tall med "perioder" i registeret håndteres. Returnerer sammendrag, eller None."""
    reg = fakta.load(root)
    snaps = {s['id']: (s, state.last(s['id'])) for s in load_sources()['kilder'] if s['type'] == 'ssb'}
    snaps = {k: v for k, v in snaps.items() if v[1] and v[1].get('serier')}
    if not snaps:
        raise SystemExit('Ingen SSB-henting i tilstanden')
    changes, touched, bsu_touched, rows, headers, changed_files = [], set(), set(), None, [], set()
    for sid, (source, snap) in snaps.items():
        series, before = snap['serier'], len(changes)
        if 'bsuRate' in series and 'serie' in reg['fakta']['bsuRate']:
            bsu_touched, rows = apply_bsu_csv(series, reg, root, changes)
            touched |= bsu_touched
            if bsu_touched:
                changed_files |= {'research/bsu-rentehistorikk.csv', 'research/bsu-rente-arssnitt-2018-2026.csv'}
        for name, values in series.items():
            fact = reg['fakta'].get(name)
            if not fact or 'perioder' not in fact:
                continue
            known = {p['periode']: p['verdi'] for p in fact['perioder']}
            for period, value in sorted(values.items()):
                if known.get(period) != value:
                    changes.append(f'{name}: {period} = {value}' + (f' (var {known[period]})' if period in known else ''))
                    known[period] = value
                    touched.add(period[:4])
            fact['perioder'] = [{'periode': p, 'verdi': v} for p, v in sorted(known.items())[-13:]]
        if len(changes) > before:
            for name in series:
                if name in reg['fakta']:
                    reg['fakta'][name]['hentet'] = snap['hentet'][:10]
                    reg['fakta'][name]['ssb_oppdatert'] = (snap.get('ssb_oppdatert') or '')[:10] or None
                    changed_files.add(reg['_fil'][name])
            latest = max(max(v) for v in series.values() if v)
            headers.append(f'{source["navn"]}, hentet {snap["hentet"][:10]} (SSB oppdatert {snap.get("ssb_oppdatert")}). Siste måned: {latest}.')
    if not changes:
        return None
    if rows is not None and touched:
        savings = reg['fakta'].get('savingsRate', {})
        apply_bsu_annual(rows, touched, {p['periode']: p['verdi'] for p in savings.get('perioder', [])}, root, changes)
    fakta.save(reg, root)
    generated = fakta.write_generated(reg, root)
    import subprocess
    subprocess.run([sys.executable, str(root / 'scripts/generate-bsu-rates.py')], check=True, cwd=root, stdout=subprocess.DEVNULL)
    fakta.bump_versions(generated + (['bsu-rates.js'] if bsu_touched else []), root)
    summary = [*headers, '', *[f'- {c}' for c in changes], '',
               'Endret: ' + ', '.join(sorted(changed_files) + [f'dist/{g}' for g in generated] + (['dist/bsu-rates.js'] if bsu_touched else [])) + ' og ?v= i HTML.',
               '', 'Dette er en automatisk PR fra Kildevakt. Den slås ikke sammen automatisk. Kontroller tallene mot SSB før godkjenning.']
    return '\n'.join(summary)


def load_sources():
    return json.loads(SOURCES.read_text(encoding='utf-8'))


def access(get):
    tests = [('data.ssb.no', 'https://data.ssb.no/api/pxwebapi/v2/tables/11018/metadata?lang=no'),
             ('data.norges-bank.no', NORGES_BANK.format(flyt='IR', nøkkel='B.KPRA.SD.R') + '?format=sdmx-json&lastNObservations=1'),
             ('www.norges-bank.no', 'https://www.norges-bank.no/'),
             ('api.lovdata.no', LOVDATA + '/list'),
             ('www.skatteetaten.no', load_sources()['kilder'][1]['url']),
             ('data.stortinget.no', STORTINGET + '/sesjoner?format=json')]
    lines = ['| Vert | HTTP |', '| --- | --- |']
    for host, url in tests:
        try:
            status = get(url).status
        except Exception as error:  # noqa: BLE001  rapporteres, ikke skjules
            status = f'feil: {error}'
        lines.append(f'| {host} | {status} |')
    return '\n'.join(lines)


def main(argv):
    parser = argparse.ArgumentParser(prog='kildevakt')
    sub = parser.add_subparsers(dest='cmd', required=True)
    sub.add_parser('tilgang')
    p = sub.add_parser('kjør'); p.add_argument('--tilstand', required=True); p.add_argument('--rapport'); p.add_argument('--kilde', action='append')
    p = sub.add_parser('varsle'); p.add_argument('--rapport', required=True); p.add_argument('--tørrkjør', action='store_true')
    p = sub.add_parser('oppdater-ssb'); p.add_argument('--tilstand', required=True); p.add_argument('--sammendrag')
    p = sub.add_parser('lag-pr'); p.add_argument('--gren', required=True); p.add_argument('--tittel', required=True); p.add_argument('--tekst', required=True); p.add_argument('--rapport')
    args = parser.parse_args(argv)
    today = dt.date.fromisoformat(os.environ['KILDEVAKT_DATO']) if os.environ.get('KILDEVAKT_DATO') else dt.date.today()
    if args.cmd == 'tilgang':
        print(access(http_get))
        return 0
    if args.cmd == 'kjør':
        reg = fakta.load()
        errors = fakta.validate(reg)
        if errors:
            print('\n'.join(errors), file=sys.stderr)
            return 1
        events, summary = run(load_sources(), State(args.tilstand), http_get, reg, today, args.kilde)
        text = report_markdown(events, summary, today)
        print(text)
        if os.environ.get('GITHUB_STEP_SUMMARY'):
            with open(os.environ['GITHUB_STEP_SUMMARY'], 'a', encoding='utf-8') as stream:
                stream.write(text + '\n')
        if args.rapport:
            Path(args.rapport).write_text(json.dumps({'dato': today.isoformat(), 'hendelser': events}, ensure_ascii=False, indent=1), encoding='utf-8')
        return 0
    if args.cmd == 'varsle':
        report = json.loads(Path(args.rapport).read_text(encoding='utf-8'))
        github = GitHub(os.environ.get('GITHUB_REPOSITORY', ''), os.environ.get('GITHUB_TOKEN', ''))
        for kind, title, ref in notify(report['hendelser'], fakta.load(), github, args.tørrkjør):
            print(f'{kind}: {title}' + (f' #{ref}' if isinstance(ref, int) else '\n' + str(ref) if args.tørrkjør else ''))
        return 0
    if args.cmd == 'oppdater-ssb':
        summary = apply_ssb(State(args.tilstand))
        if summary is None:
            print('SSB: ingen nye tall.')
            return 3
        print(summary)
        if args.sammendrag:
            Path(args.sammendrag).write_text(summary, encoding='utf-8')
        return 0
    if args.cmd == 'lag-pr':
        github = GitHub(os.environ['GITHUB_REPOSITORY'], os.environ['GITHUB_TOKEN'])
        try:
            pr = github.call('POST', f'/repos/{github.repo}/pulls', {'title': args.tittel, 'head': args.gren, 'base': 'main', 'body': Path(args.tekst).read_text(encoding='utf-8')})
            url = pr['html_url']
        except urllib.error.HTTPError as error:
            url = None
            print(f'Kunne ikke lage PR (HTTP {error.code}). Slå på «Allow GitHub Actions to create and approve pull requests» under Settings → Actions, '
                  f'eller lag PR fra grenen {args.gren} for hånd.', file=sys.stderr)
        if args.rapport:
            report = json.loads(Path(args.rapport).read_text(encoding='utf-8'))
            for e in report['hendelser']:
                if e.get('ssb_ventende'):
                    e['pr'] = url or f'grenen `{args.gren}` er klar, men PR kunne ikke opprettes automatisk'
            Path(args.rapport).write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding='utf-8')
        print(url or '')
        return 0
    return 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
