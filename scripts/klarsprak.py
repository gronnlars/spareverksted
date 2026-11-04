"""Offline editorial indicators, not a test of human comprehension. See docs/klarsprak.md."""
import argparse
from collections import Counter, defaultdict
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
import sys
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
METHOD = 'sv-klarsprak-1'
# Review triggers chosen by the project, NOT limits from Språkrådet or ISO.
LIMITS = {'sentence_words': 30, 'paragraph_words': 100, 'word_letters': 14,
          'lix_min_words': 100, 'lix_min_sentences': 3}
ABBREVIATIONS = ('f.eks.', 'bl.a.', 'dvs.', 'osv.', 'm.m.', 'm.fl.', 'ev.', 'jf.',
                 'ca.', 'kr.', 'nr.', 'jan.', 'feb.', 'apr.', 'jun.', 'jul.',
                 'aug.', 'sep.', 'sept.', 'okt.', 'nov.', 'des.', 'kl.', 'pst.')
LETTERS = r'[^\W\d_]'
TOKEN = re.compile(r'\d+(?:[ \u00a0\u202f]\d{3})*(?:[,.]\d+)*|'
                   + LETTERS + r'+(?:(?:[-’\x27]|\.)' + LETTERS + r'+)*\.?', re.UNICODE)
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
BLOCKS = {'p','li','dd','dt','blockquote','figcaption','caption','td','th','label','button','summary',
          'h1','h2','h3','h4','h5','h6','option','pre'}


def normalize(text):
    return unicodedata.normalize('NFC', text).replace('\u00ad', '')


def analysis_text(text):
    # Resource addresses are not prose words or sentence boundaries.
    return re.sub(r'https?://[^\s<>]+', '', normalize(text))


def tokens(text):
    return TOKEN.findall(analysis_text(text))


def protect_abbreviation(match, text):
    value = match[0].replace('.', '∯')
    # End abbreviations can also close a sentence. This is a documented heuristic.
    tail = text[match.end():].lstrip(' »”\"\')')
    if match[0].casefold() in {'kr.', 'osv.', 'm.m.', 'm.fl.', 'pst.'} and tail[:1].isupper():
        value = value[:-1] + '.'
    return value


def sentences(text):
    text = analysis_text(text)
    # Protect punctuation which is not normally a sentence boundary.
    protected = re.sub(r'(?<=\d)[.,](?=\d)', lambda m: '∯' if m[0] == '.' else '∰', text)
    protected = re.sub(r'(?<=\d)\.(?=\s+(?:januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember)\b)', '∯', protected, flags=re.I)
    for abbr in sorted(ABBREVIATIONS, key=len, reverse=True):
        protected = re.sub(r'(?<!\w)' + re.escape(abbr),
                           lambda m: protect_abbreviation(m, protected), protected, flags=re.I)
    protected = re.sub(r'(?<!\w)(?:' + LETTERS + r'\.){2,}',
                       lambda m: m[0].replace('.', '∯'), protected)
    return [s.replace('∯', '.').replace('∰', ',').strip() for s in re.split(r'[.!?]+(?:[»”"\x27)]*)\s*', protected)
            if tokens(s)]


def metrics(blocks):
    ts = [t for b in blocks for t in tokens(b['text'])]
    ns = sum(len(sentences(b['text'])) for b in blocks)
    long = sum(sum(c.isalpha() for c in t) > 6 for t in ts)
    w = len(ts)
    raw = w / ns + 100 * long / w if w and ns else None
    enough = w >= LIMITS['lix_min_words'] and ns >= LIMITS['lix_min_sentences']
    return {'words': w, 'sentences': ns, 'long_words': long,
            'words_per_sentence': round(w/ns, 2) if ns else None,
            'long_word_percent': round(100*long/w, 2) if w else None,
            'lix': round(raw, 2) if enough else None,
            'sample': 'tilstrekkelig for indikator' if enough else 'kort utvalg, LIX utelatt'}


class Node:
    def __init__(self, tag='', attrs=(), line=1, parent=None):
        self.tag, self.attrs, self.line, self.parent = tag, dict(attrs), line, parent
        self.children = []


class Document(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.getpos()[0], self.stack[-1])
        self.stack[-1].children.append(n)
        if tag not in VOID:
            self.stack.append(n)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, text):
        self.stack[-1].children.append((text, self.getpos()[0]))


def extract(html, file):
    doc = Document()
    doc.feed(html)
    blocks, grouped = [], {}
    chapter = 'innledning'
    def walk(node, ancestors):
        nonlocal chapter
        chain = ancestors + [node]
        if node.tag in {'h1','h2','h3'}:
            def plain(n):
                return ''.join(c[0] if isinstance(c, tuple) else plain(c) for c in n.children)
            title = ' '.join(plain(node).split())
            if title:
                chapter = node.attrs.get('id') or title
        for c in node.children:
            if isinstance(c, Node):
                walk(c, chain)
                continue
            text, line = c
            tags = {n.tag for n in chain}
            attrs = [n.attrs for n in chain]
            if tags & {'script','style','head','template'}:
                kind = 'kode/metadata'
            elif any('hidden' in a or a.get('aria-hidden') == 'true'
                     or set(a.get('class','').split()) & {'sr-only','visually-hidden','screen-reader-only'}
                     or re.search(r'(?:display\s*:\s*none|visibility\s*:\s*hidden)', a.get('style',''), re.I)
                     for a in attrs):
                kind = 'skjult'
            elif tags & {'nav','header','footer'} or any(a.get('role') == 'navigation' for a in attrs):
                kind = 'navigasjon'
            elif tags & {'button','label','select','option','summary'} and not tags & {'h1','h2','h3','h4','h5','h6'}:
                kind = 'grensesnitt'
            elif tags & {'h1','h2','h3','h4','h5','h6'}:
                kind = 'overskrift'
            elif tags & {'td','th','caption'}:
                kind = 'tabell'
            elif tags & {'pre','code','kbd','samp'}:
                kind = 'kode/metadata'
            elif tags & {'p','li','dd','blockquote','figcaption'}:
                kind = 'forklaring'
            else:
                kind = 'annet'
            owner = next((n for n in reversed(chain) if n.tag in BLOCKS), node)
            # Separate categories within an otherwise shared paragraph.
            key = (owner, kind, chapter)
            if key not in grouped:
                b = {'file':file, 'line':line, 'chapter':chapter, 'kind':kind,
                     'disclosure': any(n.tag == 'details' for n in chain), 'text':'', 'terms':[]}
                grouped[key] = b
                blocks.append(b)
            grouped[key]['text'] += text
            grouped[key]['terms'] += [a['data-begrep'] for a in attrs if 'data-begrep' in a]
    walk(doc.root, [])
    for b in blocks:
        b['text'] = ' '.join(normalize(b['text']).split())
        b['terms'] = sorted(set(b['terms']))
    return [b for b in blocks if b['text']]


def read_json(path):
    return json.loads(path.read_text(encoding='utf-8'))


def vocabulary(root, config):
    known = {}
    for path in sorted((root/'kilder/begreper').glob('*.json')):
        for item in read_json(path)['begreper']:
            if item['id'] in known:
                raise ValueError('Duplisert begrep: ' + item['id'])
            known[item['id']] = item
    if not known:
        raise ValueError('Begrepsregisteret mangler')
    data = read_json(config)
    if data.get('version') != 1 or not isinstance(data.get('terms'), list):
        raise ValueError('Ugyldig ordlisteformat')
    ids, aliases = set(), set()
    for t in data['terms']:
        if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', t.get('id','')) or t['id'] in ids:
            raise ValueError('Ugyldig eller duplisert ordliste-ID')
        ids.add(t['id'])
        if not t.get('variants') or any(not isinstance(v,str) or not v.strip() for v in t['variants']):
            raise ValueError('Ordet trenger søkeformer: ' + t['id'])
        for variant in t['variants']:
            alias = normalize(variant).casefold()
            if alias in aliases:
                raise ValueError('Duplisert søkeform: ' + variant)
            aliases.add(alias)
        if t.get('reference'):
            if t['reference'] not in known:
                raise ValueError('Ukjent begrepsreferanse: '+t['reference'])
            t['definition'] = known[t['reference']]['definisjon']
        elif t.get('status') == 'kildekontroll gjenstår':
            if t.get('definition') or not t.get('review_task'):
                raise ValueError('Uavklart ord skal ha oppgave, ingen definisjon: '+t['id'])
            continue
        elif t.get('status') != 'utkast' or not t.get('definition') or not t.get('sources'):
            raise ValueError('Nye ord trenger utkast, forklaring og kilde: ' + t['id'])
        if len(tokens(t['definition'])) > 25 or len(sentences(t['definition'])) != 1:
            raise ValueError('Forklaringen må være én setning på høyst 25 ord: '+t['id'])
        if not t.get('reference'):
            for source in t['sources']:
                if not source.get('url','').startswith('https://') or not source.get('source_date'):
                    raise ValueError('Kilde mangler URL eller kildedato')
                if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', source.get('read','')):
                    raise ValueError('Kilde mangler lesedato')
    return data['terms'], known


def answer_blocks(root):
    result = subprocess.run(['node', str(ROOT/'scripts/klarsprak-svar.cjs'), str(root)],
                            capture_output=True, text=True, check=True, timeout=30)
    rows = json.loads(result.stdout)
    blocks = []
    for row in rows:
        files = ['dist/veileder-knowledge.js','dist/veileder-svar-generert.js']
        needle = json.dumps(row['raw'], ensure_ascii=False)[1:-1]
        file, line, exact = files[0], 1, False
        for candidate in files:
            content = (root/candidate).read_text(encoding='utf-8')
            pos = content.find(needle)
            if pos >= 0:
                file, line, exact = candidate, content[:pos].count('\n')+1, True
                break
        if not exact:
            content = (root/file).read_text(encoding='utf-8')
            pos = content.find(row['id'])
            line = content[:max(0,pos)].count('\n')+1
        # These fields are editorial strings, not entire HTML documents.
        parts = extract('<p>'+row['text']+'</p>', file)
        for b in parts:
            b.update(line=line, chapter=row['id'], page='dist/spor.html#'+row['id'],
                     pointer=row['pointer'], location='teksttreff' if exact else 'svarstart, se feltsti')
            blocks.append(b)
    if not blocks:
        raise ValueError('Ingen publiserte svar ble målt')
    return blocks


def findings(blocks, terms):
    out = []
    chapters = defaultdict(list)
    for b in blocks:
        if b['kind'] == 'forklaring':
            chapters[(b['page'],b['chapter'])].append(b)
    def add(b, rule, detail, excerpt):
        item = {k:b[k] for k in ('page','file','line','chapter')}
        item.update(rule=rule, detail=detail, excerpt=excerpt[:280], severity='forslag')
        if 'pointer' in b:
            item['pointer'] = b['pointer']
        stable = '\0'.join([b['page'], b['chapter'], rule, detail, excerpt])
        item['id'] = hashlib.sha256(stable.encode()).hexdigest()[:16]
        out.append(item)
    for bs in chapters.values():
        full = ' '.join(b['text'] for b in bs).casefold()
        marked = {t for b in bs for t in b['terms']}
        for b in bs:
            for s in sentences(b['text']):
                n = len(tokens(s))
                if n > LIMITS['sentence_words']:
                    add(b,'lang-setning',f'{n} ord, vurder ledd og forbehold',s)
            if len(tokens(b['text'])) > LIMITS['paragraph_words']:
                add(b,'langt-avsnitt',f'{len(tokens(b["text"]))} ord, vurder ett hovedpoeng per avsnitt',b['text'])
            long = sorted({t.casefold().rstrip('.') for t in tokens(b['text'])
                           if sum(c.isalpha() for c in t) >= LIMITS['word_letters']})
            if long:
                add(b,'lange-ord','Vurder kjennskap, behold presise fagord: '+', '.join(long),b['text'])
        for t in terms:
            pattern = re.compile(r'(?<!\w)(?:'+ '|'.join(re.escape(v) for v in t['variants'])+r')(?!\w)', re.I)
            first = next((b for b in bs if pattern.search(b['text'])), None)
            if first:
                signal = t.get('reference') in marked or bool(t.get('definition')) and t['definition'].casefold() in full
                # A matching phrase or marker is a signal, never proof of comprehension.
                add(first,'fagord',t['id']+(': forklaringssignal finnes, kontroller kontekst' if signal
                    else ': vurder forklaring ved første behov, automatisk kontroll vet ikke om ordet er forklart'),first['text'])
    priority = {'lang-setning':0, 'langt-avsnitt':1, 'fagord':2, 'lange-ord':3}
    return sorted(out, key=lambda f:(priority[f['rule']], f['file'], f['line'], f['id']))


def measure(root=ROOT, config=None):
    root = root.resolve()
    terms, known = vocabulary(root, config or ROOT/'docs/klarsprak/ordliste.json')
    blocks, hashes = [], {}
    pages = sorted((root/'dist').rglob('*.html'))
    if not pages:
        raise ValueError('Ingen HTML-sider funnet')
    for path in pages:
        file = path.relative_to(root).as_posix()
        text = path.read_text(encoding='utf-8')
        hashes[file] = hashlib.sha256(text.encode()).hexdigest()
        bs = extract(text, file)
        for b in bs:
            b['page'] = file
            for term in b['terms']:
                if term not in known:
                    raise ValueError(f'{file}:{b["line"]}: Ukjent data-begrep {term}')
        blocks.extend(bs)
    blocks.extend(answer_blocks(root))
    if not any(b['kind'] == 'forklaring' for b in blocks):
        raise ValueError('Ingen forklaringstekst funnet')
    for b in blocks:
        if b['kind'] == 'forklaring' and '{{' in b['text']:
            raise ValueError(f'{b["file"]}:{b["line"]}: Uavklart plassholder i målt tekst')
    for file in ['dist/veileder-knowledge.js','dist/veileder-svar-generert.js','dist/publiserte-svar.js',
                 'dist/veileder-facts.js','dist/begreper.js']:
        hashes[file] = hashlib.sha256((root/file).read_bytes()).hexdigest()
    inventory, by_page, chapters = {}, defaultdict(list), defaultdict(list)
    for b in blocks:
        by_page[b['page']].append(b)
        if b['kind'] == 'forklaring':
            chapters[(b['page'],b['chapter'])].append(b)
    for page, bs in sorted(by_page.items()):
        counts = Counter()
        for b in bs:
            counts[b['kind']] += len(tokens(b['text']))
        inventory[page] = {'metrics':metrics([b for b in bs if b['kind']=='forklaring']),
                           'words_by_kind':dict(sorted(counts.items())),
                           'disclosure_prose_words':sum(len(tokens(b['text'])) for b in bs
                                                       if b['kind']=='forklaring' and b['disclosure'])}
    return {'method':METHOD,'limits':LIMITS,'input_sha256':hashes,
            'vocabulary_sha256':hashlib.sha256((config or ROOT/'docs/klarsprak/ordliste.json').read_bytes()).hexdigest(),
            'pages':inventory,'chapters':[{'page':p,'chapter':c,**metrics(bs)}
                                         for (p,c),bs in sorted(chapters.items())],
            'findings':findings(blocks,terms),'blocks':blocks}


def word_occurrences(report, word):
    """Count a complete word in extracted TEXT, never in paths, attrs or findings."""
    word = normalize(word).strip()
    if not word or len(tokens(word)) != 1:
        raise ValueError('Oppgi ett helt ord for ordtellingen')
    pattern = re.compile(r'(?<!\w)' + re.escape(word) + r'(?!\w)', re.I)
    counts, locations = Counter(), []
    for block in report['blocks']:
        count = len(pattern.findall(block['text']))
        if not count:
            continue
        counts[block['kind']] += count
        locations.append({**{k:block[k] for k in ('file','line','chapter','kind')},
                          'count':count, 'text':block['text']})
    return {'word':word,'scope':'Uttrekt tekst. Filnavn, HTML-attributter og funnlisten telles ikke.',
            'occurrences_by_kind':dict(sorted(counts.items())), 'locations':locations}


def esc(value):
    return str(value).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('|','&#124;').replace('\n',' ')


def markdown(report, previous=None, label='grunnmåling'):
    lines = ['# Klarspråkkontroll', '', 'Egne tekstindikatorer. Ingen godkjenning av klarspråk, ISO eller brukerforståelse.', '',
             f'Metode: `{report["method"]}`. Bare forklaringer inngår i LIX. Korte utvalg får ingen LIX.', '',
             '| Side / publisert svar | Ord i forklaringer | Setninger | Lange ord % | LIX | Δ LIX mot '+esc(label)+' |',
             '| --- | ---: | ---: | ---: | ---: | ---: |']
    comparable = previous and previous.get('method') == report['method'] and previous.get('limits') == report['limits'] and previous.get('vocabulary_sha256') == report['vocabulary_sha256']
    if previous and not comparable:
        lines += ['| Sammenligning utelatt: ulik metode, terskler eller ordliste | | | | | |']
    for page, row in report['pages'].items():
        m = row['metrics']
        old = previous.get('pages',{}).get(page,{}).get('metrics',{}) if comparable else {}
        delta = round(m['lix']-old['lix'],2) if m['lix'] is not None and old.get('lix') is not None else 'ikke sammenlignbart'
        lines.append('| '+ ' | '.join(esc(v) for v in [page,m['words'],m['sentences'],m['long_word_percent'],
                                                       m['lix'] if m['lix'] is not None else 'kort utvalg',delta])+' |')
    groups = report['chapters']
    eligible = sum(c['lix'] is not None for c in groups)
    word_total = sum(p['metrics']['words'] for p in report['pages'].values())
    lines += ['', f'Utvalget inneholder {word_total} ordforekomster totalt i forklaringer. Dette er ikke antall ulike ord eller forekomster av ett bestemt ord.',
              f'LIX kan vises for {eligible} av {len(groups)} målegrupper. De andre får bare råtellinger.',
              'Statisk tekstutvalg, ikke all tekst brukerne kan møte. Knapper og tabeller er kategorisert, men språkvurderes ikke her. Dynamiske tekster og PDF er ikke fullstendig dekket.', '']
    counts = Counter(f['rule'] for f in report['findings'])
    lines += ['', '## Funn til vurdering', '', ', '.join(f'{esc(k)}: {v}' for k,v in sorted(counts.items())), '',
              'Alle språkfunn er forslag. De stopper ingen PR. Lange-ord teller tekstblokker med minst ett langt ord, ikke forekomster av et bestemt ord. Full tekst, kategorier og kapitler ligger i JSON-rapporten.', '']
    if comparable:
        old_ids = {f['id'] for f in previous['findings']}
        new_ids = {f['id'] for f in report['findings']}
        lines += [f'Mot {esc(label)}: {len(new_ids-old_ids)} nye og {len(old_ids-new_ids)} bortfalte funn. Bortfall kan skyldes fjernet tekst, ikke forbedring.', '']
    for f in report['findings'][:80]:
        pointer = f.get('pointer','')
        lines.append(f'- `{esc(f["file"])}:{f["line"]}` {esc(pointer)} / {esc(f["chapter"])}: **{f["rule"]}**. {esc(f["detail"])}. «{esc(f["excerpt"])}»')
    if len(report['findings']) > 80:
        lines += ['', f'Viser 80 av {len(report["findings"])} funn. Se fullstendig JSON-rapport.']
    lines += ['', '## Dekning og oppfølging', '',
              'Statisk HTML og redaksjonelle tekstfelt i publiserte svar. Skjult tekst, navigasjon, tabeller og grensesnitt telles separat.',
              'CSS, dynamiske resultater, feilmeldinger, PDF og brukerreiser er ikke fullstendig målt. Kontroller disse manuelt.',
              'Prioriter risiko for misforståelser, deretter fagord og lange avsnitt. Bevar presisjon. Se docs/klarsprak.md.', '']
    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root',type=Path,default=ROOT)
    parser.add_argument('--output',type=Path,default=Path('/tmp/spareverksted-klarsprak'))
    parser.add_argument('--previous',type=Path)
    parser.add_argument('--label',default='grunnmåling')
    parser.add_argument('--verify-baseline',action='store_true')
    parser.add_argument('--word', help='Tell ett helt ord i uttrekt tekst, adskilt per kategori')
    args = parser.parse_args()
    try:
        report = measure(args.root)
        baseline_path = ROOT/'docs/klarsprak/grunnmaling.json'
        previous = read_json(args.previous or baseline_path) if (args.previous or baseline_path).exists() else None
        if args.verify_baseline:
            if not previous or previous.get('method') != METHOD:
                raise ValueError('Grunnmålingen mangler eller har annen metode')
            if previous != report:
                raise ValueError('Grunnmålingen avviker fra denne kildekopien')
        args.output.mkdir(parents=True,exist_ok=True)
        (args.output/'rapport.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        (args.output/'rapport.md').write_text(markdown(report,previous,args.label),encoding='utf-8')
        if args.word:
            audit = word_occurrences(report,args.word)
            (args.output/'ordtelling.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
            print(json.dumps(audit['occurrences_by_kind'],ensure_ascii=False))
        print(f'{len(report["pages"])} sider/svar, {len(report["chapters"])} kapitler, {len(report["findings"])} forslag. {args.output}/rapport.md')
    except (ValueError, KeyError, TypeError, OSError, subprocess.SubprocessError) as error:
        print('Klarspråkkontroll: faktisk kontrollfeil: '+str(error),file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
