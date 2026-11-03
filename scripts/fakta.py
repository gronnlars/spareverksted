"""Faktaregisteret: kilder/fakta.json er eneste kilde for tall i svar og kalkulator.

  python3 scripts/fakta.py              lag dist/veileder-facts.js
  python3 scripts/fakta.py --check      kontroller register, generert fil og hardkodede tall (CI)
  python3 scripts/fakta.py steder ID    vis alle steder i repoet der faktumet står
  python3 scripts/fakta.py frister      vis regler som må bekreftes før neste 1. januar eller 1. juli

Bare standardbiblioteket. Se docs/kildevakt.md.
"""
import csv
import datetime as dt
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REGISTER = ROOT / 'kilder/fakta.json'
TARGET = ROOT / 'dist/veileder-facts.js'
TYPES = {'regel': 'rule', 'kildeanbefaling': 'source-recommendation', 'statistikk': 'statistic'}
STATUSES = ('i kraft', 'vedtatt', 'foreslått')
PUBLISHED = ('i kraft', 'vedtatt')
MONTHS = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
# Generert eller selve registeret: her skal tallene stå.
GENERATED = {'dist/veileder-facts.js', 'dist/bsu-rates.js'}
DEADLINES = ('01-01', '07-01')
WARN_DAYS = 75


def load(root=ROOT):
    return json.loads((root / 'kilder/fakta.json').read_text(encoding='utf-8'))


def series(fact, root=ROOT):
    """Perioder og verdier for en statistikk, eldst først."""
    if 'serie' in fact:
        spec = fact['serie']
        with (root / spec['fil']).open(encoding='utf-8') as stream:
            rows = [(r['måned'], float(r[spec['kolonne']])) for r in csv.DictReader(stream)]
    else:
        rows = [(p['periode'], float(p['verdi'])) for p in fact['perioder']]
    return sorted(rows)


def number_text(value, fact):
    decimals = fact.get('desimaler', 0)
    if fact.get('format') == 'årstall':
        return str(int(value))
    if decimals:
        whole, frac = f'{value:,.{decimals}f}'.split('.')
        return whole.replace(',', ' ') + ',' + frac
    return f'{int(value):,}'.replace(',', ' ')


def period_text(period):
    year, month = period.split('M')
    return f'{MONTHS[int(month) - 1]} {year}'


def date_text(iso):
    d = dt.date.fromisoformat(iso)
    return f'{d.day}. {MONTHS[d.month - 1]} {d.year}'


def current(fact, date, root=ROOT):
    """Verdien som gjelder på datoen, eller None."""
    if fact['type'] == 'statistikk':
        return series(fact, root)[-1][1]
    valid = [v for v in fact['verdier'] if v['status'] in PUBLISHED and v['fra'] <= date]
    return valid[-1]['verdi'] if valid else None


def validate(reg, root=ROOT):
    errors = []
    for fid, fact in reg['fakta'].items():
        where = f'fakta.{fid}'
        if not re.fullmatch(r'[a-zA-Z]+', fid):
            errors.append(f'{where}: ID kan bare ha bokstaver (brukes som {{{{ID}}}})')
        if fact.get('type') not in TYPES:
            errors.append(f'{where}: ukjent type {fact.get("type")!r}')
            continue
        if fact.get('kilde') not in reg['kilder']:
            errors.append(f'{where}: kilden {fact.get("kilde")!r} mangler under "kilder"')
        if fact['type'] == 'statistikk':
            if ('serie' in fact) == ('perioder' in fact):
                errors.append(f'{where}: statistikk trenger enten "serie" eller "perioder"')
                continue
            try:
                rows = series(fact, root)
                if not rows:
                    errors.append(f'{where}: ingen perioder')
                for period, _ in rows:
                    if not re.fullmatch(r'\d{4}M\d{2}', period):
                        errors.append(f'{where}: periode {period!r} er ikke på formen 2026M09')
            except (OSError, KeyError, ValueError) as error:
                errors.append(f'{where}: kan ikke lese serien ({error})')
            continue
        values = fact.get('verdier') or []
        if not values:
            errors.append(f'{where}: mangler verdier')
        dates = [v.get('fra', '') for v in values]
        if dates != sorted(dates):
            errors.append(f'{where}: verdiene må stå i datorekkefølge')
        for v in values:
            if v.get('status') not in STATUSES:
                errors.append(f'{where}: status må være en av {", ".join(STATUSES)}')
            try:
                dt.date.fromisoformat(v.get('fra', ''))
            except ValueError:
                errors.append(f'{where}: "fra" må være en dato som 2027-01-01')
            if v.get('status') == 'vedtatt' and not v.get('kilde'):
                errors.append(f'{where}: vedtatt verdi fra {v.get("fra")} trenger egen "kilde" (vedtak eller kunngjøring)')
        if not any(v.get('status') in PUBLISHED for v in values):
            errors.append(f'{where}: ingen verdi er i kraft eller vedtatt')
    return errors


def build(reg, root=ROOT):
    facts = {}
    for fid, fact in reg['fakta'].items():
        out = {'kind': TYPES[fact['type']], 'unit': fact['enhet'], 'source': reg['kilder'][fact['kilde']]}
        if fact.get('desimaler'):
            out['decimals'] = fact['desimaler']
        if fact.get('format') == 'årstall':
            out['plain'] = True
        if fact['type'] == 'statistikk':
            period, value = series(fact, root)[-1]
            out.update(value=value, period=period, periodText=period_text(period))
            if fact.get('hentet'):
                out['fetched'] = fact['hentet']
                out['fetchedText'] = date_text(fact['hentet'])
        else:
            out['values'] = [{'value': v['verdi'], 'from': v['fra']} for v in fact['verdier'] if v['status'] in PUBLISHED]
        facts[fid] = out
    data = json.dumps({'checked': reg['sjekket'], 'facts': facts}, ensure_ascii=False, separators=(',', ':'))
    return RUNTIME.replace('__DATA__', data)


RUNTIME = """// Generert av scripts/fakta.py fra kilder/fakta.json. Rediger registeret, ikke denne filen.
/* Dated factual values for the guidance. User inputs and technical limits are separate. */
(function(root){
'use strict';
const REG=__DATA__;
const pad=n=>String(n).padStart(2,'0');
function today(){
 const env=typeof process!=='undefined'&&process.env&&process.env.SPARE_FAKTA_DATO;
 if(env)return env;
 const d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
}
function make(date){
 const pick=f=>f.values?(f.values.filter(v=>v.from<=date).pop()||null):{value:f.value};
 const checked=REG.checked,data={};
 for(const [id,f] of Object.entries(REG.facts)){const v=pick(f);data[id]={value:v?v.value:null,unit:f.unit,checked,source:f.source,kind:f.kind};
  if(f.period)Object.assign(data[id],{period:f.period,periodText:f.periodText,fetched:f.fetched||null,fetchedText:f.fetchedText||''});}
 const year=data.year.value;for(const id in data)data[id].year=year;
 function value(id){if(!Object.hasOwn(data,id))throw Error('Ukjent faktanøkkel: '+id);return data[id].value;}
 function text(id){const n=value(id);if(n===null)return '';const f=REG.facts[id];
  return new Intl.NumberFormat('nb-NO',{useGrouping:!f.plain,minimumFractionDigits:f.decimals||0,maximumFractionDigits:f.decimals||0}).format(n).replace(/\\u00a0/g,' ').replace(/\\u2212/g,'-');}
 function part(id,key){value(id);if(!key)return text(id);if(key==='periode')return data[id].periodText||'';if(key==='hentet')return data[id].fetchedText||'';return '';}
 function expand(s){return String(s).replace(/\\{\\{([a-zA-Z]+)(?:\\.(periode|hentet))?\\}\\}/g,(_,id,key)=>part(id,key)).replace(/[\\u2013\\u2014]/g,' til ');}
 function resolve(x){if(typeof x==='string')return expand(x);if(Array.isArray(x))return x.map(resolve);if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,resolve(v)]));return x;}
 // Neste vedtatte verdi etter datoen, til varsler som «Fra 1. januar 2027».
 function upcoming(id){value(id);const f=REG.facts[id];const v=f.values&&f.values.find(x=>x.from>date);return v?{value:v.value,from:v.from}:null;}
 return {date,checked,year,data,value,text,expand,resolve,upcoming,at:make};
}
const api=make(today());if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SpareFacts=api;
})(typeof window!=='undefined'?window:globalThis);
"""


def forms(fact, value):
    """Tekstformer som avslører et hardkodet tall."""
    if value is None:
        return []
    text = number_text(value, fact)
    out = [p.replace('{}', text) for p in fact.get('mønstre', [])]
    if fact.get('format') != 'årstall' and (fact.get('desimaler') or value >= 1000):
        out.append(text)
    return out


def scan(paths, needles):
    hits = []
    for path in paths:
        for number, line in enumerate(path.read_text(encoding='utf-8', errors='replace').splitlines(), 1):
            for needle in needles:
                if re.search(r'(?<![\d,.])' + re.escape(needle) + r'(?![\d])', line):
                    hits.append((path, number, needle, line.strip()))
    return hits


def published_files(root=ROOT):
    return [p for p in sorted((root / 'dist').rglob('*')) if p.suffix in ('.js', '.html') and p.relative_to(root).as_posix() not in GENERATED]


def duplicates(reg, root=ROOT, date=None):
    date = date or dt.date.today().isoformat()
    problems = []
    for fid, fact in reg['fakta'].items():
        allowed = {a['fil'] for a in fact.get('tillatt', [])}
        for path, number, needle, line in scan(published_files(root), forms(fact, current(fact, date, root))):
            rel = path.relative_to(root).as_posix()
            if rel not in allowed:
                problems.append(f'{rel}:{number}: «{needle}» står hardkodet. Bruk {{{{{fid}}}}} fra kilder/fakta.json. Linje: {line[:120]}')
    return problems


def places(fid, reg, root=ROOT, value=None):
    """Alle filer som bruker faktumet, med plassholder eller som tekst."""
    fact = reg['fakta'][fid]
    needles = forms(fact, current(fact, dt.date.today().isoformat(), root) if value is None else value)
    files = [p for p in sorted(root.rglob('*')) if p.is_file() and not any(x.startswith('.') or x == 'node_modules' for x in p.relative_to(root).parts)
             and p.suffix in ('.js', '.html', '.md', '.json', '.csv', '.py', '.cjs') and p.relative_to(root).as_posix() != 'kilder/fakta.json']
    hits = scan(files, needles + ['{{' + fid])
    return [(p.relative_to(root).as_posix(), n, needle, line) for p, n, needle, line in hits]


def deadlines(reg, today):
    """Regler som ikke er bekreftet over neste 1. januar eller 1. juli innen WARN_DAYS dager."""
    out = []
    for year in (today.year, today.year + 1):
        for md in DEADLINES:
            deadline = dt.date.fromisoformat(f'{year}-{md}')
            if not 0 < (deadline - today).days <= WARN_DAYS:
                continue
            for fid, fact in reg['fakta'].items():
                until = fact.get('bekreftet_til')
                if fact['type'] == 'regel' and until and dt.date.fromisoformat(until) < deadline:
                    later = [v for v in fact['verdier'] if v['fra'] >= deadline.isoformat()]
                    out.append({'id': fid, 'frist': deadline.isoformat(), 'bekreftet_til': until,
                                'ny_verdi': later[0] if later else None})
    return out


def bump_versions(names, root=ROOT):
    """Øk ?v= for endrede filer i alle HTML-filer (AGENTS.md, Mellomlagring)."""
    changed = []
    for html in sorted((root / 'dist').glob('*.html')):
        text = html.read_text(encoding='utf-8')
        new = text
        for name in names:
            new = re.sub(r'((?:src|href)="' + re.escape(name) + r'\?v=)(\d+)"', lambda m: f'{m.group(1)}{int(m.group(2)) + 1}"', new)
        if new != text:
            html.write_text(new, encoding='utf-8')
            changed.append(html.name)
    return changed


def main(argv):
    reg = load()
    errors = validate(reg)
    if errors:
        print('\n'.join(errors), file=sys.stderr)
        return 1
    if argv[:1] == ['steder']:
        for rel, number, needle, line in places(argv[1], reg):
            print(f'{rel}:{number}  [{needle}]  {line[:140]}')
        return 0
    if argv[:1] == ['frister']:
        for row in deadlines(reg, dt.date.today()):
            print(f"{row['id']}: bekreftet til {row['bekreftet_til']}, frist {row['frist']}" + (' (ny verdi registrert)' if row['ny_verdi'] else ''))
        return 0
    text = build(reg)
    if '--check' in argv:
        problems = []
        if TARGET.read_text(encoding='utf-8') != text:
            problems.append('dist/veileder-facts.js er ikke generert fra kilder/fakta.json. Kjør python3 scripts/fakta.py.')
        problems += duplicates(reg)
        if problems:
            print('\n'.join(problems), file=sys.stderr)
            return 1
        print(f'Fakta: {len(reg["fakta"])} fakta kontrollert, generert fil i takt, ingen hardkodede dubletter.')
        return 0
    TARGET.write_text(text, encoding='utf-8')
    print('Skrev dist/veileder-facts.js')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
