"""Write the latest W3C validator result into dist/tilgjengelighet.html.

Runs in GitHub Actions. Reads JSON from the Nu Html Checker (vnu.jar,
the same checker validator.w3.org uses), counts errors and warnings for
each page, and replaces the text between the w3c-status markers.

The visitor's browser never contacts W3C. The result is plain text in
the published page.

Usage:
  python3 scripts/w3c-status.py RESULT.json VERSION          # check only
  python3 scripts/w3c-status.py RESULT.json VERSION --write  # also update page
Exit code 1 if the checker reports any error.
"""
import json
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / 'dist/tilgjengelighet.html'
START = '<!-- w3c-status:start -->'
END = '<!-- w3c-status:end -->'
DSTART = '<!-- w3c-detail:start -->'
DEND = '<!-- w3c-detail:end -->'
MONTHS = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli',
          'august', 'september', 'oktober', 'november', 'desember']
NAMES = {
    'index.html': 'Forsiden',
    'spor.html': '«Spør om sparing»',
    'om.html': 'Om Spareverksted',
    'personvern.html': 'Personvern',
    'tilgjengelighet.html': 'Tilgjengelighet',
}


def count(messages, pages):
    result = {page: Counter() for page in pages}
    for m in messages:
        page = m.get('url', '').rsplit('/', 1)[-1]
        if page not in result:
            continue
        if m.get('type') == 'error' or m.get('subType') == 'fatal':
            result[page]['feil'] += 1
        elif m.get('type') == 'info' and m.get('subType') == 'warning':
            result[page]['advarsler'] += 1
    return result


def words(n, one, many):
    return f'{n} {one if n == 1 else many}'


def render(result, version, now):
    errors = sum(c['feil'] for c in result.values())
    warnings = sum(c['advarsler'] for c in result.values())
    date = f'{now.day}. {MONTHS[now.month - 1]} {now.year}'
    mark = '✓' if errors == 0 else '!'
    short = '\n'.join([
        START,
        f'<p class="hint w3c-status"><span aria-hidden="true">{mark}</span> '
        f'Siste W3C-kontroll: {date}. {words(errors, "feil", "feil")}.</p>',
        END,
    ])
    pages = '; '.join(f'{NAMES.get(page, page)}: {words(c["feil"], "feil", "feil")}, '
                      f'{words(c["advarsler"], "advarsel", "advarsler")}'
                      for page, c in result.items())
    detail = '\n'.join([
        DSTART,
        f'Siste automatiske kontroll var {date}, med Nu Html Checker versjon {version}, '
        f'den samme validatoren som validator.w3.org bruker. Den kjøres hver gang siden publiseres. '
        f'Totalt {words(errors, "feil", "feil")} og {words(warnings, "advarsel", "advarsler")} '
        f'på {words(len(result), "side", "sider")}. {pages}.',
        DEND,
    ])
    return short, detail, errors


def replace(text, a_marker, b_marker, block):
    a, b = text.index(a_marker), text.index(b_marker) + len(b_marker)
    return text[:a] + block + text[b:]


def main(argv):
    data = json.loads(Path(argv[1]).read_text())
    pages = sorted(p.name for p in (ROOT / 'dist').glob('*.html'))
    result = count(data.get('messages', []), pages)
    short, detail, errors = render(result, argv[2], datetime.now(ZoneInfo('Europe/Oslo')))
    print(short + '\n' + detail)
    if '--write' in argv:
        text = replace(PAGE.read_text(), START, END, short)
        PAGE.write_text(replace(text, DSTART, DEND, detail))
    return 1 if errors else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
