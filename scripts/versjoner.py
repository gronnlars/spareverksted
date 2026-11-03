"""Versjoner for mellomlagring: ?v= lages fra innholdet i fila, ikke for hånd.

  python3 scripts/versjoner.py            sett ?v= for alle lokale .js og .css i dist/*.html
  python3 scripts/versjoner.py --check    feil hvis en versjon ikke stemmer med fila (CI)

Versjonen er de ti første tegnene i SHA256 av fila. Samme innhold gir samme versjon, endret innhold gir
alltid ny versjon. Da kan to PR-er ikke ende med samme versjon for ulikt innhold (skjedde med app.js?v=ux52
i #173 og #174, 3.11.2026), og ingen må huske å øke tallet. Ved konflikt i HTML: velg en av sidene og kjør
skriptet. Hvert skript og stilark står på egen linje, så konflikter blir sjeldne.

Bare standardbiblioteket. Se AGENTS.md, «Mellomlagring».
"""
import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LENGTH = 10
REF = re.compile(r'((?:src|href)=")([A-Za-z0-9_./-]+\.(?:js|css))(?:\?v=[^"]*)?(")')
JOINED = re.compile(r'(</script>|<link [^>]*>)(?=<script |<link )')


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()[:LENGTH]


def render(text, dist):
    """HTML med riktige versjoner og ett skript eller stilark per linje."""
    def fix(match):
        target = dist / match.group(2)
        if not target.is_file():
            raise SystemExit(f'Fant ikke {match.group(2)}, som HTML-en viser til')
        return f'{match.group(1)}{match.group(2)}?v={digest(target)}{match.group(3)}'
    text = REF.sub(fix, text)
    return JOINED.sub(lambda m: m.group(1) + '\n', text)


def run(root=ROOT, check=False):
    dist = root / 'dist'
    changed = []
    for html in sorted(dist.glob('*.html')):
        old = html.read_text(encoding='utf-8')
        new = render(old, dist)
        if new != old:
            changed.append(html.name)
            if not check:
                html.write_text(new, encoding='utf-8')
    return changed


def main(argv):
    check = '--check' in argv
    changed = run(check=check)
    if check:
        if changed:
            print('Versjonene stemmer ikke med filene i: ' + ', '.join(changed) + '. Kjør python3 scripts/versjoner.py.', file=sys.stderr)
            return 1
        print('Versjoner: alle ?v= i dist/*.html stemmer med innholdet i filene.')
        return 0
    print('Oppdaterte ' + (', '.join(changed) if changed else 'ingenting (alt stemte)'))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
