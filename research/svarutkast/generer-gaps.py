"""JSON er fasit. Genererer lesbare utkast; ingen filer i dist endres.
Kjør med --check for å oppdage utdaterte Markdown-filer uten å skrive dem.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def render(e):
    lines = [f"# {e['queue'][0]}: {e['title']}", '',
             '<!-- Generert fra gaps-2026-10-25.json. Rediger JSON og kjør generer-gaps.py. -->', '',
             e['status'], '',
             f"Svar-ID: `{e['id']}`. Kø-ID-er: {', '.join(e['queue'])}. Svarmal: `{e.get('layout', 'overview')}`.", '',
             '## Kort svar', '', e['intro'], '']
    if e.get('tradeoffs'):
        lines += ['## Fordeler og ulemper', '']
        for name, label in [('pros', 'Fordeler'), ('cons', 'Ulemper')]:
            lines += ['### ' + label, '']
            for item in e['tradeoffs'][name]:
                lines += ['- **' + item['title'] + ':** ' + item['text']]
            lines += ['']
    lines += ['## Eksempel', '', e['example']['text'], '']
    if e.get('next'):
        lines += [f"Lenke i nettstedets visning: [{e['next']['text']}](../../dist/{e['next']['href']}).", '']
    for example in e.get('additionalExamples', []):
        lines += [f"Ekstra utkastlenke: [{example['text']}](../../dist/{example['href']}).", '', example['note'], '']
    lines += ['## Fordypning', '']
    for part in e['parts']:
        lines += [f"### {part['title']}", '', part['text'], '']
    if e.get('terms'):
        lines += ['### Begreper i svaret', '']
        for term in e['terms']:
            lines += [f"- **{term['term']}:** {term['text']}"]
        lines += ['']
    lines += ['## Kilder og forbehold', '', e['caveat'], '']
    for source in e['sources']:
        lines += [f"- [{source['title']}]({source['url']})"]
    if e.get('publicationBlockers'):
        lines += ['', '## Publiseringssperrer (arbeidsnotat)', ''] + ['- ' + x for x in e['publicationBlockers']]
    lines += ['', '## Kontrolldokumentasjon', '', e.get('review', {}).get('text', ''), '',
              e.get('languageReview', ''), '',
              'Opprinnelig arbeidsgrunnlag: main `f9c553aa668fd0bf96ce14d6930f5ec02897abd6`. Historisk lesedato: 25.10.2026. Nye kildelesinger angis per kilde. Språkendring gir ingen ny faglig godkjenning.', '',
              '| Påstand | Kilde | Kildens dato / regelår | Unntak og usikkerhet |',
              '| --- | --- | --- | --- |']
    for note in e['sourceNotes']:
        lines += ['| ' + ' | '.join(note) + ' |']
    lines += ['', '## Angrepsflater og reparasjoner', '']
    lines += [f'{i}. {risk}' for i, risk in enumerate(e['risks'], 1)]
    lines += ['', '## Korrektur og overlevering', '',
              'Egenkontroll er ikke uavhengig fagkontroll. Språk og svarmal er gjennomgått, med faglige vilkår og uavklarte spørsmål bevart. Se research/sprak-og-svarmal-2026-10-28.md for samlet kontrollstatus.', '',
              'Søkeinnganger: ' + '; '.join(e['questions']) + '.', '',
              'JSON er fasit. Markdown genereres. Samsvar kontrolleres med `python3 research/svarutkast/generer-gaps.py --check --product`. Isolert søkeprøve: `node research/svarutkast/prov-gaps.cjs`.', '',
              ('SV-022 finnes på main. Språkendringen i denne leveransen er ikke publisert.' if e.get('integrationState') == 'branch' else 'Dette svaret er fortsatt upublisert og er ikke lagt i nettstedets svarbase. GAPS beholdes. Godkjenning gjenstår.'), '']
    return '\n'.join(lines)

if __name__ == '__main__':
    entries = json.loads((ROOT / 'gaps-2026-10-25.json').read_text())
    stale = []
    for entry in entries:
        target = ROOT / (entry['queue'][0] + '.md')
        content = render(entry)
        if '--check' in sys.argv:
            if not target.exists() or target.read_text() != content:
                stale.append(target.name)
        else:
            target.write_text(content)
    if '--product' in sys.argv:
        import re
        entry = next(e for e in entries if e['id'] == 'q-renters-rente')
        fields = ['kind', 'id', 'category', 'title', 'checked', 'keys', 'questions', 'intro', 'terms', 'example', 'parts', 'sources', 'caveat', 'next', 'layout', 'tradeoffs', 'review']
        product = {k: entry[k] for k in fields if k in entry}
        product['next'] = dict(product['next'], more=[{'text': x['text'], 'href': x['href']} for x in entry.get('additionalExamples', [])])
        body = json.dumps(product, ensure_ascii=False, indent=1)
        body = body[:-2] + ',\n "words": ' + json.dumps(entry['words'], ensure_ascii=False) + '.map(s=>new RegExp(s))\n}'
        block = '// BEGIN GENERATED SV-022\n' + body + ',\n// END GENERATED SV-022\n'
        target = ROOT.parent.parent / 'dist/veileder-knowledge.js'
        original = target.read_text()
        if '// BEGIN GENERATED SV-022' in original:
            updated = re.sub(r'// BEGIN GENERATED SV-022\n.*?// END GENERATED SV-022\n', lambda _: block, original, flags=re.S)
        else:
            updated = original.replace('const entries=[\n', 'const entries=[\n' + block, 1)
        if '--check' in sys.argv:
            if original != updated:
                stale.append(str(target))
        else:
            target.write_text(updated)
    if stale:
        raise SystemExit('Utdaterte utkast: ' + ', '.join(stale))
    print(f'{len(entries)} utkast ' + ('kontrollert mot JSON.' if '--check' in sys.argv else 'generert fra JSON.'))
