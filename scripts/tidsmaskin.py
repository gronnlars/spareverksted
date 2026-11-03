"""Tidsmaskin: henter historiske dataserier og lagrer dem uendret, med kilde.

  python3 scripts/tidsmaskin.py tilgang                        HTTP-status mot kildene
  python3 scripts/tidsmaskin.py hent [--mål DIR] [--kilde ID] [--sammendrag FIL]
  python3 scripts/tidsmaskin.py sjekk [--mål DIR]              kontroller at lagrede filer er uendret
  python3 scripts/tidsmaskin.py oversikt [--mål DIR]           lag OVERSIKT.md over innholdet
  python3 scripts/tidsmaskin.py lag-pr --gren GREN --tittel T --tekst FIL

Kildene står i kilder/historikk.json. Rådata lagres byte for byte i research/historikk/<id>/, med
<fil>.meta.json (kilde, adresse, versjon, hentetidspunkt, SHA256, vilkår). En fil byttes bare ut når
innholdet hos kilden er endret, og da som PR til godkjenning. Skriptet beregner ingenting: alt som
regnes ut av dataene, gjøres i egen kode og merkes som Spareverksteds beregning (Norges Banks vilkår).

Bare standardbiblioteket. Se docs/tidsmaskin.md.
"""
import argparse
import datetime as dt
import hashlib
import io
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCES = ROOT / 'kilder/historikk.json'
TARGET = ROOT / 'research/historikk'
AGENT = 'Spareverksted-tidsmaskin/1.0 (+https://spareverksted.no)'
MAX_BYTES = 80_000_000
NB_BASE = 'https://www.norges-bank.no'
NB_DATA = NB_BASE + '/globalassets/upload/hms/data/'
SS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
REL = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
PKG = '{http://schemas.openxmlformats.org/package/2006/relationships}'


class Response:
    def __init__(self, status, url, body, headers=None):
        self.status, self.url, self.body, self.headers = status, url, body, headers or {}


def http_get(url):
    request = urllib.request.Request(url, headers={'User-Agent': AGENT})
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            body = response.read(MAX_BYTES + 1)
            if len(body) > MAX_BYTES:
                raise ValueError('Filen er større enn grensen; fullstendighet kan ikke bekreftes')
            return Response(response.status, response.url, body, dict(response.headers))
    except urllib.error.HTTPError as error:
        return Response(error.code, url, b'', dict(error.headers or {}))


def sha(data):
    return hashlib.sha256(data).hexdigest()


def now():
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()


def load_sources():
    return json.loads(SOURCES.read_text(encoding='utf-8'))


# ---------- kontroll av innhold ----------

def check_xlsx(body):
    """En ekte xlsx er en zip med arbeidsbok. Feilsider og avkuttede filer stoppes her."""
    try:
        with zipfile.ZipFile(io.BytesIO(body)) as archive:
            names = set(archive.namelist())
            if not {'[Content_Types].xml', 'xl/workbook.xml'} <= names:
                raise ValueError('Mangler arbeidsbok i xlsx-filen')
            bad = archive.testzip()
            if bad:
                raise ValueError(f'Ødelagt del i xlsx-filen: {bad}')
    except zipfile.BadZipFile as error:
        raise ValueError(f'Ikke en gyldig xlsx-fil ({error})') from error


def check_json(body, kind):
    data = json.loads(body)
    if kind == 'ssb' and not (data.get('class') == 'dataset' and data.get('value') and data.get('id')):
        raise ValueError('SSB-svaret er ikke et json-stat2-datasett med verdier')
    if kind == 'nb-api':
        inner = data.get('data', data)
        if not inner.get('dataSets'):
            raise ValueError('Norges Bank-svaret mangler dataSets')
    return data


def page_links(body, pattern):
    """Filnavn til full adresse med versjon, slik oversiktssiden lenker til dem i dag."""
    text = body.decode('utf-8', errors='replace')
    if not re.search(r'</html\s*>', text[-5000:], re.I):
        raise ValueError('Oversiktssiden mangler sluttmarkør; den kan være avkuttet')
    links = {}
    for match in re.finditer(pattern, text):
        path = match.group(0).replace('&amp;', '&')
        name = path.split('/')[-1].split('?')[0]
        links[name] = urllib.parse.urljoin(NB_BASE, path)
    return links


def version(url):
    return urllib.parse.parse_qs(urllib.parse.urlparse(url).query).get('v', [None])[0]


# ---------- lagring ----------

class Store:
    """research/historikk/: register.json og én mappe per kilde med rådata og .meta.json."""

    def __init__(self, root):
        self.root = Path(root)
        self.path = self.root / 'register.json'
        self.register = json.loads(self.path.read_text(encoding='utf-8')) if self.path.exists() else {}

    def put(self, source, name, body, meta):
        """Lagrer bare når innholdet er nytt. Returnerer 'ny', 'endret' eller None."""
        old = self.register.get(source['id'])
        digest = sha(body)
        if old and old['sha256'] == digest and old['fil'] == f"{source['id']}/{name}":
            return None
        folder = self.root / source['id']
        folder.mkdir(parents=True, exist_ok=True)
        if old and old['fil'] != f"{source['id']}/{name}":
            for stale in (self.root / old['fil'], self.root / (old['fil'] + '.meta.json')):
                stale.unlink(missing_ok=True)
        (folder / name).write_bytes(body)
        record = {**meta, 'fil': f"{source['id']}/{name}", 'sha256': digest, 'bytes': len(body)}
        (folder / (name + '.meta.json')).write_text(json.dumps(record, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
        self.register[source['id']] = record
        return 'endret' if old else 'ny'

    def save(self):
        self.root.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(dict(sorted(self.register.items())), ensure_ascii=False, indent=1) + '\n', encoding='utf-8')


def meta_for(source, url, response, terms, extra=None):
    rules = terms[source['utgiver']]
    return {'id': source['id'], 'navn': source['navn'], 'kilde': rules['kilde'], 'url': url, 'endelig_url': response.url,
            'versjon': version(response.url) or version(url), 'hentet': now(), 'vilkår': rules['regler'],
            'bruk': source.get('bruk'), **(extra or {})}


# ---------- henting ----------

def fetch(sources, store, get, only=None):
    """Henter alle kilder. Returnerer liste med (id, status, tekst)."""
    terms, report, links = sources['vilkår'], [], {}
    overview = next(s for s in sources['kilder'] if s['type'] == 'side')
    known = {s['fil'] for s in sources['kilder'] if s['type'] == 'nb-hms'}
    try:
        response = get(overview['url'])
        if response.status != 200:
            raise ValueError(f'HTTP {response.status}')
        links = page_links(response.body, overview['lenker'])
        for name in sorted(set(links) - known):
            report.append((overview['id'], 'ny fil på siden', f'{name} ({links[name]}) er ikke i kilder/historikk.json'))
        for name in sorted(known - set(links)):
            report.append((overview['id'], 'mangler på siden', f'{name} lenkes ikke lenger fra oversiktssiden'))
    except (ValueError, OSError) as error:
        report.append((overview['id'], 'hentefeil', f'Oversiktssiden: {error}. Bruker faste adresser uten versjon.'))
    for source in sources['kilder']:
        if source['type'] == 'side' or (only and source['id'] not in only):
            continue
        try:
            if source['type'] == 'nb-hms':
                url = links.get(source['fil'], NB_DATA + source['fil'])
                name = source['fil']
            else:
                url = source['url']
                name = source['id'] + '.json'
            response = get(url)
            if response.status != 200:
                raise ValueError(f'HTTP {response.status}')
            extra = {}
            if source['type'] == 'nb-hms':
                check_xlsx(response.body)
            else:
                data = check_json(response.body, source['type'])
                if source['type'] == 'ssb':
                    extra = {'ssb_oppdatert': data.get('updated'), 'tabell': (data.get('extension') or {}).get('px', {}).get('tableid')}
            status = store.put(source, name, response.body, meta_for(source, url, response, terms, extra))
            report.append((source['id'], status or 'uendret', f'{name}, {len(response.body):,} byte'.replace(',', ' ')))
        except (ValueError, OSError, json.JSONDecodeError) as error:
            report.append((source['id'], 'hentefeil', str(error)))
    store.save()
    return report


# ---------- kontroll av lagrede filer ----------

def verify(store):
    """Hver lagret fil skal ha samme SHA256 som da den ble hentet. Ellers er den endret i repoet."""
    problems = []
    for sid, record in store.register.items():
        path = store.root / record['fil']
        meta_path = Path(str(path) + '.meta.json')
        if not path.exists():
            problems.append(f'{sid}: {record["fil"]} mangler')
            continue
        if sha(path.read_bytes()) != record['sha256']:
            problems.append(f'{sid}: {record["fil"]} er endret etter henting. Rådata skal gjengis uendret.')
        if not meta_path.exists():
            problems.append(f'{sid}: {meta_path.name} mangler')
        else:
            meta = json.loads(meta_path.read_text(encoding='utf-8'))
            if meta.get('sha256') != record['sha256'] or not meta.get('kilde') or not meta.get('url'):
                problems.append(f'{sid}: .meta.json stemmer ikke med registeret eller mangler kilde og adresse')
    for path in sorted(store.root.glob('*/*')):
        rel = path.relative_to(store.root).as_posix()
        if not rel.endswith('.meta.json') and rel not in {r['fil'] for r in store.register.values()}:
            problems.append(f'{rel} ligger i mappen uten å stå i register.json')
    return problems


# ---------- oversikt over innholdet ----------

def xlsx_sheets(body, preview=3):
    """Arkene i en xlsx: navn, antall rader og kolonner, og de første radene med innhold."""
    with zipfile.ZipFile(io.BytesIO(body)) as archive:
        strings = []
        if 'xl/sharedStrings.xml' in archive.namelist():
            for si in ET.fromstring(archive.read('xl/sharedStrings.xml')).iter(SS + 'si'):
                strings.append(''.join(t.text or '' for t in si.iter(SS + 't')))
        rels = {r.get('Id'): r.get('Target') for r in ET.fromstring(archive.read('xl/_rels/workbook.xml.rels')).iter(PKG + 'Relationship')}
        out = []
        for sheet in ET.fromstring(archive.read('xl/workbook.xml')).iter(SS + 'sheet'):
            target = rels[sheet.get(REL + 'id')].lstrip('/')
            target = target if target.startswith('xl/') else 'xl/' + target
            rows, width, first = 0, 0, []
            for row in ET.fromstring(archive.read(target)).iter(SS + 'row'):
                cells = []
                for c in row.iter(SS + 'c'):
                    kind, v = c.get('t'), c.find(SS + 'v')
                    if kind == 's' and v is not None:
                        cells.append(strings[int(v.text)])
                    elif kind == 'inlineStr':
                        cells.append(''.join(t.text or '' for t in c.iter(SS + 't')))
                    else:
                        cells.append(v.text if v is not None and v.text else '')
                if any(x.strip() for x in cells):
                    rows += 1
                    width = max(width, len(cells))
                    if len(first) < preview:
                        first.append(' | '.join(x.strip()[:24] for x in cells[:8]) + (' | …' if len(cells) > 8 else ''))
            out.append({'ark': sheet.get('name'), 'rader': rows, 'kolonner': width, 'første': first})
        return out


def describe(store):
    lines = ['# Oversikt over historiske data', '', 'Generert av `python3 scripts/tidsmaskin.py oversikt`. Viser hva filene inneholder, så seriene kan velges. Tallene er ikke bearbeidet.', '']
    for sid, record in sorted(store.register.items()):
        body = (store.root / record['fil']).read_bytes()
        lines += [f'## {record["navn"]}', '', f'`{record["fil"]}` · {record["bytes"]:,} byte · hentet {record["hentet"][:10]}'.replace(',', ' ') +
                  (f' · versjon {record["versjon"]}' if record.get('versjon') else '') + f' · {record["kilde"]}', '']
        try:
            if record['fil'].endswith('.xlsx'):
                lines += ['| Ark | Rader | Kolonner | Første rader |', '| --- | ---: | ---: | --- |']
                for s in xlsx_sheets(body):
                    lines.append(f"| {s['ark']} | {s['rader']} | {s['kolonner']} | {'<br>'.join(x.replace('|', '/') for x in s['første'])} |")
            else:
                data = json.loads(body)
                if data.get('class') == 'dataset':
                    time_dim = (data.get('role') or {}).get('time', ['Tid'])[0]
                    index = data['dimension'][time_dim]['category']['index']
                    periods = sorted(index, key=index.get)
                    dims = ', '.join(f'{d} ({n})' for d, n in zip(data['id'], data['size']))
                    lines += [f"{data.get('label', '')}. SSB oppdatert {data.get('updated')}. Dimensjoner: {dims}. "
                              f"Tid: {periods[0]} til {periods[-1]}. {sum(v is not None for v in data['value'])} verdier."]
                else:
                    inner = data.get('data', data)
                    dates = inner['structure']['dimensions']['observation'][0]['values']
                    count = sum(len(s['observations']) for s in inner['dataSets'][0]['series'].values())
                    lines += [f'{count} observasjoner, {dates[0]["id"]} til {dates[-1]["id"]}.']
        except (KeyError, IndexError, ValueError, zipfile.BadZipFile, ET.ParseError) as error:
            lines += [f'Kunne ikke lese innholdet: {error}']
        lines.append('')
    return '\n'.join(lines)


# ---------- kommandolinje ----------

def report_markdown(report):
    lines = ['## Tidsmaskin: henting', '', '| Kilde | Status | Detaljer |', '| --- | --- | --- |']
    lines += [f'| {sid} | {status} | {text} |' for sid, status, text in report]
    changed = [r for r in report if r[1] in ('ny', 'endret')]
    lines += ['', f'{len(changed)} filer er nye eller endret.' if changed else 'Ingen nye eller endrede filer.']
    return '\n'.join(lines)


def github(method, path, body=None):
    request = urllib.request.Request('https://api.github.com' + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                                     headers={'Authorization': f'Bearer {os.environ["GITHUB_TOKEN"]}', 'Accept': 'application/vnd.github+json',
                                              'User-Agent': AGENT, 'X-GitHub-Api-Version': '2022-11-28'})
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.loads(response.read() or b'null')


def make_pr(args):
    repo = os.environ['GITHUB_REPOSITORY']
    try:
        pr = github('POST', f'/repos/{repo}/pulls', {'title': args.tittel, 'head': args.gren, 'base': 'main', 'body': Path(args.tekst).read_text(encoding='utf-8')})
        print(pr['html_url'])
    except urllib.error.HTTPError as error:
        print(f'Kunne ikke lage PR (HTTP {error.code}). Grenen {args.gren} er klar. Slå på «Allow GitHub Actions to create and approve pull requests».', file=sys.stderr)
    return 0


def main(argv):
    parser = argparse.ArgumentParser(prog='tidsmaskin')
    sub = parser.add_subparsers(dest='cmd', required=True)
    sub.add_parser('tilgang')
    p = sub.add_parser('hent'); p.add_argument('--mål', default=str(TARGET)); p.add_argument('--kilde', action='append'); p.add_argument('--sammendrag')
    p = sub.add_parser('sjekk'); p.add_argument('--mål', default=str(TARGET))
    p = sub.add_parser('oversikt'); p.add_argument('--mål', default=str(TARGET))
    p = sub.add_parser('lag-pr'); p.add_argument('--gren', required=True); p.add_argument('--tittel', required=True); p.add_argument('--tekst', required=True)
    args = parser.parse_args(argv)
    sources = load_sources()
    if args.cmd == 'tilgang':
        print('| Kilde | HTTP |\n| --- | --- |')
        for s in sources['kilder']:
            url = s.get('url') or NB_DATA + s['fil']
            try:
                status = http_get(url).status
            except Exception as error:  # noqa: BLE001  rapporteres, ikke skjules
                status = f'feil: {error}'
            print(f"| {s['id']} | {status} |")
        return 0
    if args.cmd == 'lag-pr':
        return make_pr(args)
    store = Store(args.mål)
    if args.cmd == 'hent':
        text = report_markdown(fetch(sources, store, http_get, args.kilde))
        (store.root / 'OVERSIKT.md').write_text(describe(store), encoding='utf-8')
        print(text)
        if args.sammendrag:
            Path(args.sammendrag).write_text(text, encoding='utf-8')
        problems = verify(store)
        if problems:
            print('\n'.join(problems), file=sys.stderr)
            return 1
        return 0
    if args.cmd == 'sjekk':
        problems = verify(store)
        if problems:
            print('\n'.join(problems), file=sys.stderr)
            return 1
        print(f'Tidsmaskin: {len(store.register)} filer i {store.root} er uendret siden henting og har kilde.')
        return 0
    if args.cmd == 'oversikt':
        (store.root / 'OVERSIKT.md').write_text(describe(store), encoding='utf-8')
        print(f'Skrev {store.root / "OVERSIKT.md"}')
        return 0
    return 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
