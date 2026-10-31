"""Publish only complete, current three-engine evidence. No visitor-side requests."""
import html
import json
import os
from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
ENGINES = ('chromium', 'firefox', 'webkit')


def render(directory, commit, pages):
    reports = [json.loads((Path(directory) / f'{e}.json').read_text()) for e in ENGINES]
    for engine, r in zip(ENGINES, reports):
        if (r.get('schema') != 1 or r.get('engine') != engine or r.get('passed') is not True
                or r.get('commit') != commit or r.get('pages') != sorted(pages)
                or r.get('external') != [] or r.get('cookies') != [] or r.get('requests', 0) < 1):
            raise ValueError(f'Ufullstendig eller feil kontrollgrunnlag: {engine}')
    date = max(datetime.fromisoformat(r['checkedAt'].replace('Z', '+00:00')) for r in reports)
    date = date.astimezone(ZoneInfo('Europe/Oslo')).strftime('%d.%m.%Y kl. %H:%M')
    versions = ', '.join(f"{r['engine']} {r['browser']} (Playwright {r['playwright']})" for r in reports)
    return (f'<p class="hint">Siste automatiske personvernkontroll: {date}. '
            f'Ingen avvik i de testede handlingene. {len(pages)} sider i tre nettlesermotorer.</p>',
            f'<p>Kontrollert {date} mot lokal kopi av nettstedet, kodeversjon '
            f'<code>{html.escape(commit[:12])}</code>. {html.escape(versions)}. '
            'Alle sider ble åpnet med tom lagring. Testen undersøkte informasjonskapsler, '
            'skriving til nettleserlagring, IndexedDB, Cache Storage og service workers der nettleseren gir innsyn. '
            'Den prøvde også start, delt lenke, lagring av plan, avbrutt sletting, sletting og flere faner. '
            'Uventede nettverkskall og WebSocket-forsøk stopper testen. '
            'Dette er prosjektets tekniske egenkontroll med Playwright og Python, ikke en uavhengig revisjon '
            'eller en test av om mennesker forstår teksten. Kontrollen undersøker ikke publisert servers '
            'logger, e-postbehandling, alle mulige handlinger eller om personvernreglene er oppfylt.</p>')


def write_status(directory, commit):
    pages = sorted(p.name for p in (ROOT / 'dist').glob('*.html'))
    short, detail = render(directory, commit, pages)
    page = ROOT / 'dist/personvern.html'
    text = page.read_text()
    for name, content in [('status', short), ('detail', detail)]:
        start, end = f'<!-- privacy-{name}:start -->', f'<!-- privacy-{name}:end -->'
        if text.count(start) != 1 or text.count(end) != 1:
            raise ValueError('Mangler entydige personvernmarkører')
        a, b = text.index(start) + len(start), text.index(end)
        text = text[:a] + '\n' + content + '\n' + text[b:]
    page.write_text(text)
    print(short)


if __name__ == '__main__':
    import sys
    write_status(sys.argv[1], os.environ['GITHUB_SHA'])
