"""Svarskjema v1. Standardbibliotek, ingen KI eller nettverk under bygging.

ny SV-150 | --check | bygg | hash SV-150 | berørt KILDE/FAKTA/SVAR | frister
Se docs/svargrunnmur.md. Maskinell kontroll er ikke fagkontroll.
"""
import argparse
import datetime as dt
import hashlib
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit
import fakta

ROOT = Path(__file__).resolve().parent.parent
HEADINGS = ['Styring', 'Spørsmål og søk', 'Kort svar', 'Forbehold', 'Fordeler og ulemper',
            'Eksempel', 'Fordypning', 'Vis det i kalkulatoren', 'Kilder', 'Om kildekontrollen',
            'Fakta og begreper', 'Relevans i veilederen', 'Kobling til andre svar', 'Påstandstabell',
            'Angrepsflater', 'Publiseringssperrer', 'Kontrollogg', 'Ikke kontrollert']
STATUSES = {'kø', 'reservert', 'utkast', 'til kontroll', 'kontrollert', 'godkjent', 'integrert',
            'publisert', 'til gjennomgang', 'venter', 'trukket'}
READY = {'godkjent', 'integrert', 'publisert', 'til gjennomgang'}
FORMS = {'begrep', 'ordning', 'regnemåte', 'slik sjekker du', 'sammenligning'}
CATEGORIES = {'funds', 'pension', 'mortgage', 'student', 'children', 'buffer', 'bsu'}
MARK = re.compile(r'\[P\d+(?:,\s*P\d+)*\]')
TOKEN = fakta.PLACEHOLDER
TARGET = 'dist/veileder-svar-generert.js'
INDEX = 'kilder/svar/avhengigheter.json'
FIELDS = {
 1: ['Svar-ID', 'Kø-ID-er som dekkes', 'Status', 'Svarform', 'Kategori', 'Søkefamilie', 'Regelår',
     'Vedlikehold', 'Først publisert', 'Sist endret', 'Sist gjennomgått', 'Neste kontroll',
     'Skribent', 'Lest main', 'Avhenger av'],
 2: ['Tittel', 'Spørsmål brukere kan stille', 'Søkeord', 'Søkefraser', 'Dekker ikke', 'Premiss'],
 8: ['Lenketekst', 'Lenke', 'Flere lenker', 'Kontrollert'],
 12: ['Relevant når', 'Begrunnelse som vises'], 13: ['Se også']}


class Invalid(ValueError):
    pass


def need(ok, message):
    if not ok:
        raise Invalid(message)


def clean(s):
    return re.sub(r'\s+', ' ', MARK.sub('', s)).strip()


def values(s):
    return [] if s in ('ingen', '') else [v.strip() for v in s.split(',')]


def date(s):
    need(bool(re.fullmatch(r'\d{4}-\d{2}-\d{2}', s)), f'Ugyldig dato: {s}')
    try:
        return dt.date.fromisoformat(s)
    except ValueError as e:
        raise Invalid(f'Ugyldig dato: {s}') from e


def fields(text, expected):
    matches = list(re.finditer(r'^([^\n:]+):[ \t]*(.*)$', text, re.M))
    need([m[1] for m in matches] == expected, f'Felt eller rekkefølge: forventet {expected}')
    result = {}
    for i, m in enumerate(matches):
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        result[m[1]] = text[m.start(2):end].strip()
        need(result[m[1]], f'Tomt felt: {m[1]}')
    return result


def table(text, columns):
    lines = [x.strip() for x in text.splitlines() if x.strip().startswith('|')]
    need(len(lines) >= 2, 'Tabell mangler')
    rows = [[c.strip().replace('&#124;', '|') for c in x.strip('|').split('|')] for x in lines]
    need(all(len(r) == columns for r in rows), f'Tabell krever {columns} kolonner. Bruk &#124; for loddrett strek i tekst.')
    need(all(re.fullmatch(r':?-{3,}:?', c) for c in rows[1]), 'Ugyldig tabellskille')
    return rows[2:]


def safe_url(url, local=False):
    u = urlsplit(url)
    need(not any(c.isspace() or c in '<>"\\' for c in url), f'Utrygg URL: {url}')
    need((u.scheme == 'https' and bool(u.hostname) and not u.username and not u.password) or
         (local and re.fullmatch(r'index\.html(?:#[^\s]*)?', url)), f'Ugyldig URL: {url}')


def read(path):
    text = path.read_text(encoding='utf-8')
    need(text.startswith(f'# {path.stem}:'), 'Filnavn og SV-ID i overskrift må stemme')
    need('<!-- Svarskjema versjon 1.' in text, 'Skjemaversjon mangler')
    matches = list(re.finditer(r'^## (.+)$', text, re.M))
    need([m[1] for m in matches] == [f'{i}. {h}' for i, h in enumerate(HEADINGS, 1)],
         'Manglende, ekstra eller omstokkede overskrifter')
    sections = {}
    for i, m in enumerate(matches):
        end = matches[i+1].start() if i+1 < len(matches) else len(text)
        s = text[m.end():end].strip()
        if i == 12:
            s = s.split('\n---\n')[0].strip()
        need(s, f'Tom seksjon {i+1}')
        sections[i+1] = s
    parsed = {n: fields(sections[n], names) for n, names in FIELDS.items()}
    return {'queue': path.stem, 'path': path, 'sections': sections, 'fields': parsed}


def references(text, reg):
    refs = set()
    for m in TOKEN.finditer(text):
        kind, ident, key = m.groups()
        if kind:
            b = next((x for x in reg['begreper'] if x['id'] == ident), None)
            need(b is not None and (not key or key in fakta.BEGREP_KEYS), f'Ukjent begrep/felt: {m[0]}')
            need(not key or b.get(key), f'Tomt begrepsfelt: {m[0]}')
            refs.add('begrep:' + ident)
        else:
            f = reg['fakta'].get(ident)
            need(f is not None, f'Ukjent fakta: {m[0]}')
            need(not key or (key in fakta.FACT_KEYS and f['type'] == 'statistikk') or
                 (key in fakta.FORECAST_KEYS and f['type'] == 'prognose'), f'Ukjent faktafelt: {m[0]}')
            refs.add(ident)
    rest = TOKEN.sub('', text)
    need('{{' not in rest and '}}' not in rest, 'Ugyldig plassholder')
    return refs


def digest(a, reg, root=ROOT):
    # Arbeidsstatus og neste kontroll er administrative. Alle øvrige felt, kildebevis,
    # sperrer og faktisk brukte registerverdier inngår. Loggen signerer, ikke seg selv.
    s = dict(a['sections'])
    s.pop(17)
    s[1] = re.sub(r'^(Status|Neste kontroll):.*$', '', s[1], flags=re.M)
    refs = references('\n'.join(s.values()), reg)
    if 'Tabell: bsuRates' in s[7]:
        refs.update(('bsuRate', 'boundRate'))
    facts = {k: reg['fakta'][k] for k in sorted(refs) if not k.startswith('begrep:')}
    terms = {b['id']: b for b in reg['begreper'] if 'begrep:'+b['id'] in refs}
    files = {f['serie']['fil'] for f in facts.values() if 'serie' in f}
    if 'Tabell: bsuRates' in s[7]:
        files.add('research/bsu-rente-arssnitt-2018-2026.csv')
    series = {f: hashlib.sha256((root/f).read_bytes()).hexdigest() for f in sorted(files)}
    sources = {f['kilde']: reg['kilder'][f['kilde']] for f in facts.values()}
    data = {'sections': s, 'facts': facts, 'terms': terms, 'series': series, 'sources': sources}
    return hashlib.sha256(json.dumps(data, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


def tradeoffs(text):
    if text == 'ingen':
        return None
    matches = list(re.finditer(r'^- (Fordel|Ulempe): (.+)\n', text + '\n', re.M))
    need(matches and not text[:matches[0].start()].strip(), 'Ugyldig fordel/ulempe')
    result = {'pros': [], 'cons': []}
    for i, m in enumerate(matches):
        body = text[m.end():matches[i+1].start() if i+1 < len(matches) else len(text)].strip()
        need(body, 'Fordel/ulempe mangler tekst')
        result['pros' if m[1] == 'Fordel' else 'cons'].append({'title': clean(m[2]), 'text': clean(body)})
    need(result['pros'] and result['cons'], 'Både fordel og ulempe kreves')
    return result


def compile_answer(a):
    s, f = a['sections'], a['fields']
    m, search = f[1], f[2]
    e = {'id': m['Svar-ID'], 'title': search['Tittel'], 'intro': clean(s[3]),
         'keys': values(search['Søkeord']), 'questions': [x[2:] for x in search['Spørsmål brukere kan stille'].splitlines()],
         'words': values(search['Søkefraser']), 'layout': 'overview',
         'sources': [{'id': r[0], 'title': r[1], 'url': r[2]} for r in table(s[9], 7)],
         'review': {'text': clean(s[10])}, 'caveat': '' if s[4] == 'ingen' else clean(s[4]), 'parts': []}
    if m['Svarform'] == 'sammenligning':
        chunks = re.split(r'^### Alternativ [12]: ', s[5], flags=re.M)
        need(len(chunks) == 3 and not chunks[0].strip(), 'Sammenligning trenger nøyaktig to alternativer')
        e.update(neutral=True, options=[])
        for chunk in chunks[1:]:
            title, rest = chunk.split('\n', 1)
            sub, body = rest.split('\n', 1)
            need(sub.startswith('Undertittel: '), 'Alternativ mangler undertittel')
            e['options'].append({'title': clean(title), 'subtitle': clean(sub[13:]), **tradeoffs(body.strip())})
    else:
        e.update(kind='explainer', terms=[])
        t = tradeoffs(s[5])
        if t:
            e['tradeoffs'] = t
    for key, target in [('Kategori', 'category'), ('Søkefamilie', 'searchFamily')]:
        if m[key] != 'ingen':
            e[target] = m[key]
    for key, target in [('Først publisert', 'published'), ('Sist endret', 'changed'), ('Sist gjennomgått', 'checked')]:
        if m[key] != 'ikke publisert':
            e[target] = m[key]
    if s[6] != 'ingen':
        need(s[6].startswith('Tittel: ') and '\nKontrollregning: ' in s[6], 'Eksempel trenger tittel og kontrollregning')
        title, body = s[6][8:].split('\n', 1)
        body, calculation = body.rsplit('\nKontrollregning: ', 1)
        need(calculation.strip() not in ('', 'ingen', 'ikke kontrollert'), 'Kontrollregning mangler')
        e['example'] = {'title': clean(title), 'text': clean(body)}
    chunks = re.split(r'^### ', s[7], flags=re.M)
    need(len(chunks) > 1 and not chunks[0].strip(), 'Fordypning trenger minst én ###-del')
    for chunk in chunks[1:]:
        title, body = chunk.split('\n', 1)
        need('\nTabell: ' in body, 'Hver fordypningsdel trenger Tabell: ingen eller bsuRates')
        body, tab = body.rsplit('\nTabell: ', 1)
        need(tab.strip() in ('ingen', 'bsuRates'), 'Ukjent tabell')
        need(body.strip(), 'Tom fordypning')
        part = {'title': clean(title), 'text': clean(body)}
        if tab.strip() != 'ingen':
            part['table'] = {'$table': tab.strip()}
        e['parts'].append(part)
    link = f[8]
    if link['Lenke'] != 'ingen':
        safe_url(link['Lenke'], local=True)
        need(link['Lenketekst'] != 'ingen', 'Lenketekst mangler')
        e['next'] = {'text': link['Lenketekst'], 'href': link['Lenke']}
        if link['Flere lenker'] != 'ingen':
            e['next']['more'] = []
            for line in link['Flere lenker'].splitlines():
                parts = line.split(' | ')
                need(len(parts) == 2, 'Flere lenker: bruk tekst | URL per linje')
                safe_url(parts[1], local=True)
                e['next']['more'].append({'text': parts[0], 'href': parts[1]})
    else:
        need(link['Lenketekst'] == link['Flere lenker'] == 'ingen', 'Lenkefelt uten hovedlenke')
    return e


def validate(a, reg):
    s, f = a['sections'], a['fields']
    m, search = f[1], f[2]
    status = m['Status']
    need(status in STATUSES or re.fullmatch(r'se SV-\d{3,}', status), 'Ugyldig status')
    need(re.fullmatch(r'q-[a-z0-9]+(?:-[a-z0-9]+)*', m['Svar-ID']), 'Ugyldig svar-ID')
    need(m['Svarform'] in FORMS, 'Ugyldig svarform')
    need(m['Kategori'] in CATEGORIES | {'ingen'}, 'Ukjent kategori')
    need(m['Svarform'] != 'sammenligning' or m['Kategori'] != 'ingen', 'Sammenligning krever kategori')
    need(set(values(m['Vedlikehold'])) <= set('ABCD') and values(m['Vedlikehold']), 'Vedlikehold krever A, B, C eller D')
    ids = values(m['Kø-ID-er som dekkes'])
    need(ids and ids[0] == a['queue'] and all(re.fullmatch(r'SV-\d{3,}', i) for i in ids), 'Ugyldige kø-ID-er')
    need(not search['Tittel'].casefold().startswith('bør'), 'Tittelen begynner med Bør')
    questions = search['Spørsmål brukere kan stille'].splitlines()
    need(len(questions) >= 3 and all(x.startswith('- ') and len(x) > 2 for x in questions), 'Minst tre spørsmål som punktliste')
    need(values(search['Søkeord']) and all(re.fullmatch('[a-zæøå0-9]+', k) for k in values(search['Søkeord'])), 'Ugyldige søkeord')
    need(values(search['Søkefraser']), 'Søkefraser mangler')
    need(re.fullmatch(r'[0-9a-f]{7,40}', m['Lest main']), 'Main-SHA mangler')
    date(m['Neste kontroll'])
    dates = [m[k] for k in ('Først publisert', 'Sist endret', 'Sist gjennomgått')]
    need(all(x == 'ikke publisert' for x in dates) or all(x != 'ikke publisert' for x in dates), 'Datoer må fylles samlet')
    if dates[0] != 'ikke publisert':
        ds = [date(x) for x in dates]
        need(ds == sorted(ds), 'Krever publisert ≤ endret ≤ gjennomgått')
    public = '\n'.join(s[n] for n in (3, 4, 5, 6, 7, 10))
    public = re.sub(r'^Kontrollregning:.*$', '', public, flags=re.M)
    need(not re.search(r'[–—…]|\.\.\.', public + search['Tittel']), 'Tankestrek eller tre prikker i offentlig tekst')
    need(not re.search(r'<[^>]+>', public), 'HTML eller uutfylt plassholder i offentlig tekst')
    refs = references('\n'.join(s.values()), reg)
    sources = table(s[9], 7)
    source_ids = [r[0] for r in sources]
    need(sources and len(set(source_ids)) == len(source_ids), 'Kilder mangler eller duplisert kilde-ID')
    for sid, title, url, level, when, read_at, who in sources:
        need(all((sid, title, when, who)) and level in {'1','2','3','4','5','R'}, 'Ufullstendig kilde')
        safe_url(url)
        if sid in reg['kilder']:
            need(url == reg['kilder'][sid], f'Kilde-URL avviker fra registeret: {sid}')
        if read_at != 'ikke lest':
            date(read_at)
    claims = table(s[14], 6)
    claim_ids = [r[0] for r in claims]
    used = set(re.findall(r'P\d+', ' '.join(MARK.findall(public))))
    need(claims and len(set(claim_ids)) == len(claim_ids), 'Påstander mangler eller duplisert ID')
    need(used == set(claim_ids), f'Påstandsmerker og tabell avviker: {sorted(used ^ set(claim_ids))}')
    for pid, claim, sid, locator, support, uncertainty in claims:
        need(re.fullmatch(r'P\d+', pid) and all((claim, locator, uncertainty)), 'Ufullstendig påstand')
        need(sid in source_ids, f'Ukjent kilde i {pid}: {sid}')
        need(support in ('ja', 'nei', 'vet ikke'), f'Ugyldig kildevurdering i {pid}')
    need(len(table(s[15], 2)) >= 3, 'Minst tre angrepsflater kreves')
    log = table(s[17], 5)
    for row in log:
        date(row[0])
    h = digest(a, reg)
    strict = status in READY | {'til kontroll', 'kontrollert'}
    if strict:
        need(all(r[4] == 'ja' for r in claims), 'Udokumentert påstand')
        need(all(r[5] != 'ikke lest' for r in sources), 'Uåpnet kilde')
        need(any(r[2] == 'skribent' and 'egenkontroll' in r[3] for r in log), 'Egenkontroll mangler')
    if status in READY | {'kontrollert'}:
        author = m['Skribent'].rsplit(',', 1)[0].strip()
        need(any(r[2] == 'kontrollør' and r[1] != author and 'sha256:'+h in r[4] for r in log), 'Separat kontroll med gjeldende sjekksum mangler')
    if status in READY:
        need(s[16] == 'ingen', 'Publiseringssperre')
        need(dates[0] != 'ikke publisert', 'Publiseringsdatoer mangler')
        need(any(r[1] == 'Lars' and r[2] == 'godkjenner' and 'sha256:'+h in r[4] for r in log), 'Lars sin godkjenning med gjeldende sjekksum mangler')
        need(not table(s[11].split('Nye begreper:')[0], 7) and not table(s[11].split('Nye begreper:')[1], 5), 'Nye fakta/begreper må inn i registeret før bygging')
        if f[8]['Lenke'] != 'ingen':
            need(f[8]['Kontrollert'].startswith('åpnet '), 'Kalkulatorlenke ikke åpnet og kontrollert')
    need(s[11].startswith('Fakta fra registeret: ') and '\nNye fakta:\n' in s[11] and '\nBegreper fra registeret: ' in s[11] and '\nNye begreper:\n' in s[11], 'Fakta/begrepsfelt mangler')
    table(s[11].split('Nye begreper:')[0], 7)
    table(s[11].split('Nye begreper:')[1], 5)
    e = compile_answer(a)
    warnings = []
    for label, text, limit in [('Kort svar', e['intro'], 60), *[(p['title'], p['text'], 90) for p in e['parts']]]:
        if len(text.split()) > limit:
            warnings.append(f'{label}: over {limit} ord. Begrunn i kontrolloggen.')
    if e.get('example') and len(e['example']['text'].split()) > 80:
        warnings.append('Eksempel: over 80 ord')
    groups = [e.get('tradeoffs', {})] + e.get('options', [])
    for group in groups:
        for item in group.get('pros', []) + group.get('cons', []):
            if len(item['title'].split()) > 5 or len(item['text'].split()) > 45:
                warnings.append('Fordel/ulempe over 5 ord i tittel eller 45 ord i tekst')
    if len(clean(public).split()) > 300:
        warnings.append('Samlet tekst over 300 ord. Begrunn nødvendig utdyping.')
    if len(search['Tittel']) > 70:
        warnings.append('Tittel over 70 tegn')
    if re.search(r'best for deg|du bør|vi anbefaler|garantert', public, re.I):
        warnings.append('Mulig råd eller garanti: må vurderes i kontrollen')
    if 'Tabell: bsuRates' in s[7]:
        refs.update(('bsuRate', 'boundRate'))
    a.update(entry=e, refs=refs, sources=source_ids, hash=h)
    return warnings


def load(root=ROOT):
    reg = fakta.load(root)
    need(not fakta.validate(reg, root), 'Faktaregisteret er ugyldig. Kjør fakta.py --check.')
    answers, errors, warnings = [], [], []
    for path in sorted((root/'kilder/svar').glob('SV-*.md')):
        try:
            a = read(path)
            warnings += [f'{path.name}: {w}' for w in validate(a, reg)]
            answers.append(a)
        except (Invalid, ValueError, KeyError, IndexError) as e:
            errors.append(f'{path.name}: {e}')
    owners, keys, queue = {}, {}, {}
    for a in answers:
        m = a['fields'][1]
        for ident, mapping, label in [(m['Svar-ID'], owners, 'Svar-ID'),
                                      *[(k, keys, 'søkeord') for k in a['entry']['keys']],
                                      *[(k, queue, 'kø-ID') for k in values(m['Kø-ID-er som dekkes'])]]:
            if ident in mapping:
                errors.append(f'{label} {ident} finnes i både {mapping[ident]} og {a["queue"]}')
            mapping[ident] = a['queue']
    known_queue = set(re.findall(r'SV-\d{3,}', (root/'SPORSMALSKO.md').read_text())) | set(queue)
    legacy = set(re.findall(r'''["'](q-[a-z0-9-]+)["']''', (root/'dist/veileder-knowledge.js').read_text()))
    for a in answers:
        for dep in values(a['fields'][1]['Avhenger av']):
            if dep not in known_queue:
                errors.append(f'{a["queue"]}: ukjent avhengighet {dep}')
        for dep in values(a['fields'][13]['Se også']):
            if dep not in owners and dep not in legacy:
                errors.append(f'{a["queue"]}: ukjent svarlenke {dep}')
    need(not errors, '\n'.join(errors))
    return answers, warnings


def index(answers, reg):
    out = {}
    terms = {b['id']: b for b in reg['begreper']}
    for a in answers:
        refs = set(a['refs']) | set(a['sources']) | set(values(a['fields'][1]['Avhenger av'])) | set(values(a['fields'][13]['Se også']))
        for ref in a['refs']:
            if ref in reg['fakta']:
                refs.add(reg['fakta'][ref]['kilde'])
                refs.add(reg['kilder'][reg['fakta'][ref]['kilde']])
            elif ref.startswith('begrep:'):
                refs.update(k['url'] for k in terms[ref[7:]].get('kilder', []))
        for ref in sorted(refs):
            out.setdefault(ref, []).append(a['queue'])
    return {k: sorted(v) for k, v in sorted(out.items())}


def runtime(answers):
    entries = [a['entry'] for a in answers if a['fields'][1]['Status'] in READY]
    data = json.dumps(entries, ensure_ascii=False, indent=1)
    return r'''// Generert av scripts/svar.py. Rediger kilder/svar/, aldri denne filen.
(function(root){
'use strict';
const entries=__DATA__;
const table=typeof module!=='undefined'&&module.exports?require('./bsu-rates.js'):root.SpareBsuRates;
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
for(const e of entries){
 e.words=e.words.map(s=>new RegExp('(?<![a-zæøå0-9])'+escape(s)+'(?![a-zæøå0-9])','i'));
 for(const p of e.parts)if(p.table)p.table=table;
}
if(typeof module!=='undefined'&&module.exports)module.exports=entries;
else root.SpareSvarGenerert=entries;
})(typeof window!=='undefined'?window:globalThis);
'''.replace('__DATA__', data)


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('command', nargs='?', choices=['bygg', 'ny', 'hash', 'berørt', 'frister'])
    p.add_argument('id', nargs='?')
    p.add_argument('--check', action='store_true')
    args = p.parse_args(argv)
    try:
        if args.command == 'ny':
            need(args.id and re.fullmatch(r'SV-\d{3,}', args.id), 'Oppgi SV-ID')
            target = ROOT/'kilder/svar'/f'{args.id}.md'
            need(not target.exists(), 'Filen finnes allerede')
            text = (ROOT/'SVARSKJEMA.md').read_text().split('````markdown\n',1)[1].split('\n````',1)[0]
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(text.replace('SV-000', args.id), encoding='utf-8')
            print(f'Skrev {target}. Fyll alle felt før --check.')
            return 0
        if args.command == 'hash':
            need(args.id and re.fullmatch(r'SV-\d{3,}', args.id), 'Oppgi SV-ID')
            a = read(ROOT/'kilder/svar'/f'{args.id}.md')
            print(digest(a, fakta.load(ROOT)))
            return 0
        answers, warnings = load()
        for w in warnings:
            print('VARSEL: '+w, file=sys.stderr)
        reg = fakta.load(ROOT)
        if args.command == 'hash':
            found = next((a for a in answers if a['queue'] == args.id), None)
            need(found, 'Ukjent SV-ID')
            print(found['hash'])
            return 0
        deps = index(answers, reg)
        if args.command == 'berørt':
            # Transitivt, også når en definisjon brukes av et annet svar. Ingen dato endres.
            pending, seen = [args.id], set()
            by_queue = {a['queue']: a for a in answers}
            while pending:
                ref = pending.pop()
                for q in deps.get(ref, []):
                    if q not in seen:
                        seen.add(q)
                        pending.extend([q, by_queue[q]['entry']['id']])
            print('\n'.join(sorted(seen)) or 'Ingen registrerte svar. Eldre svar må kontrolleres separat.')
            return 0
        if args.command == 'frister':
            for a in answers:
                if date(a['fields'][1]['Neste kontroll']) <= dt.date.today():
                    print(a['queue'] + ': til gjennomgang')
            return 0
        outputs = {TARGET: runtime(answers), INDEX: json.dumps(deps, ensure_ascii=False, indent=2)+'\n'}
        for rel, text in outputs.items():
            path = ROOT/rel
            if args.check:
                need(path.exists() and path.read_text() == text, f'{rel} er ikke i takt. Kjør scripts/svar.py bygg.')
            else:
                need(args.command == 'bygg', 'Bruk --check eller bygg')
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(text, encoding='utf-8')
        print(f'{len(answers)} skjemaer kontrollert. {sum(a["fields"][1]["Status"] in READY for a in answers)} klare for integrasjon. Ingen fagkontroll utført av skriptet.')
        return 0
    except (Invalid, OSError, ValueError) as e:
        print(str(e), file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
