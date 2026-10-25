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
             'Arbeidsgrunnlag: main `f9c553aa668fd0bf96ce14d6930f5ec02897abd6`. ChatGPT/Codex. Upublisert lokal gren. Ingen push, merge eller publisering.', '',
             f"Dekning: GAPS `{e['gap']}`. Kø-ID-er: {', '.join(e['queue'])}. Foreslått svar-ID: `{e['id']}`.", '',
             '## Kort svar', '', e['intro'], '',
             '## Eksempel', '', e['example']['text'], '',
             '## Begreper', '']
    for term in e['terms']:
        lines += [f"- **{term['term']}:** {term['text']}"]
    if e.get('next'):
        lines += ['', f"Lenke i nettstedets visning: [{e['next']['text']}](../../dist/{e['next']['href']})."]
    for example in e.get('additionalExamples', []):
        lines += ['', f"Ekstra utkastlenke: [{example['text']}](../../dist/{example['href']}).", '', example['note']]
    lines += ['', '## Fordypning', '']
    for part in e['parts']:
        lines += [f"### {part['title']}", '', part['text'], '']
    lines += ['## Kilder og faktakontroll', '', e['caveat'], '',
              'Publiseringsdato: ikke publisert. Faktisk lesedato i denne utkastleveransen: 25.10.2026. Ingen nye skattesatser. Historisk ikrafttredelse er bare angitt der den faktisk er undersøkt.', '',
              '| Påstand | Kilde | Kildens dato / regelår | Unntak og usikkerhet |',
              '| --- | --- | --- | --- |']
    for note in e['sourceNotes']:
        lines += ['| ' + ' | '.join(note) + ' |']
    lines += ['']
    for source in e['sources']:
        lines += [f"- [{source['title']}]({source['url']})"]
    lines += ['', '## Angrepsflater og reparasjoner', '']
    lines += [f'{i}. {risk}' for i, risk in enumerate(e['risks'], 1)]
    lines += ['', '## Korrektur og overlevering', '',
              'Navn, tallformat, forutsetninger og påstander kontrolleres mot kildene og egne kontrollregnestykker. Selvkontroll er ikke uavhengig fagkontroll. Se leveranserapporten for faktisk utførte tester og gjenstående kontroller.', '',
              'Søkeinnganger: ' + '; '.join(e['questions']) + '.', '',
              'JSON er fasit for svartekst, søkeinnganger og kildemetadata. Denne Markdown-filen er generert. Kjør `python3 research/svarutkast/generer-gaps.py --check` for samsvarskontroll og `node research/svarutkast/prov-gaps.cjs` for isolert søkeprøve.', '',
              ('SV-022 er integrert på arbeidsgrenen etter Lars sin godkjenning. CI og publisering må bekreftes separat. Lars har kontrollert kildene, ikke regnet. iPhone Safari og VoiceOver står åpne.' if e.get('integrationState') == 'branch' else '[Leveranserapport](GAPS-RAPPORT-2026-10-25.md). Dette svaret er ikke integrert i nettstedet. GAPS for svaret beholdes. Godkjenning gjenstår.'), '']
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
        fields = ['kind', 'id', 'category', 'title', 'checked', 'keys', 'questions', 'intro', 'terms', 'example', 'parts', 'sources', 'caveat', 'next']
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
