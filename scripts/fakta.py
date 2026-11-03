"""Fakta- og begrepsregisteret: én kilde for tall og faste forklaringer i svar og kalkulator.

  kilder/register.json        felles: kontrolldato og kildeadresser
  kilder/fakta/*.json         tall med kilde, status og gjelder-fra-dato, én fil per tema
  kilder/begreper/*.json      ordbok-setninger som kan hentes i tekst med {{begrep:ID}}

  python3 scripts/fakta.py              lag dist/veileder-facts.js og dist/begreper.js
  python3 scripts/fakta.py --check      kontroller register, genererte filer, plassholdere og dubletter (CI)
  python3 scripts/fakta.py steder ID    vis alle steder et faktum eller begrep står (begrep:ID for begreper)
  python3 scripts/fakta.py frister      vis regler som må bekreftes før neste 1. januar eller 1. juli

Plassholdere i tekst:
  {{bsuAnnual}}  {{bsuRate.periode}}  {{bsuRate.hentet}}  {{begrep:kjopekraft}}  {{begrep:kjopekraft.utdyping}}
  {{kpiPrognose.rapport}}  {{kpiPrognose.publisert}}  {{kpiPrognose.liste}}  (prognoser: «3,3 % i 2026, 2,6 % i 2027 …»)

Bare standardbiblioteket. Se docs/kildevakt.md.
"""
import csv
import datetime as dt
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGET = 'dist/veileder-facts.js'
BEGREP_TARGET = 'dist/begreper.js'
TYPES = {'regel': 'rule', 'kildeanbefaling': 'source-recommendation', 'statistikk': 'statistic', 'prognose': 'forecast'}
STATUSES = ('i kraft', 'vedtatt', 'foreslått')
PUBLISHED = ('i kraft', 'vedtatt')
MONTHS = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
# Generert fra registeret: her skal tallene og setningene stå.
GENERATED = {TARGET, BEGREP_TARGET, 'dist/bsu-rates.js'}
DEADLINES = ('01-01', '07-01')
WARN_DAYS = 75
FACT_ID = r'[a-zA-Z][a-zA-Z0-9]*'
BEGREP_ID = r'[a-z0-9]+(?:-[a-z0-9]+)*'
FACT_KEYS = ('periode', 'hentet')
FORECAST_KEYS = ('rapport', 'publisert', 'liste')
BEGREP_KEYS = ('utdyping', 'ord')
PLACEHOLDER = re.compile(r'\{\{(?:(begrep):)?([^{}.]+)(?:\.([^{}]+))?\}\}')
# Setninger kortere enn dette i en utdyping regnes ikke som dubletter (for vanlige formuleringer).
MIN_SENTENCE_WORDS = 6


# ---------- lesing og skriving ----------

def _read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def load(root=ROOT):
    """Slår sammen register.json, fakta/*.json og begreper/*.json. Husker hvilken fil hvert faktum kom fra."""
    base = _read(root / 'kilder/register.json')
    reg = {'sjekket': base['sjekket'], 'kilder': dict(base['kilder']), 'fakta': {}, 'begreper': [],
           '_fil': {}, '_feil': [], '_meta': {}}
    for path in sorted((root / 'kilder/fakta').glob('*.json')):
        rel = path.relative_to(root).as_posix()
        data = _read(path)
        reg['_meta'][rel] = {k: v for k, v in data.items() if k != 'fakta'}
        for fid, fact in data.get('fakta', {}).items():
            if fid in reg['fakta']:
                reg['_feil'].append(f'{rel}: ID {fid} finnes også i {reg["_fil"][fid]}')
                continue
            reg['fakta'][fid] = fact
            reg['_fil'][fid] = rel
    for path in sorted((root / 'kilder/begreper').glob('*.json')):
        rel = path.relative_to(root).as_posix()
        for begrep in _read(path).get('begreper', []):
            begrep = dict(begrep, _fil=rel)
            if any(b['id'] == begrep.get('id') for b in reg['begreper']):
                reg['_feil'].append(f'{rel}: begrepet {begrep.get("id")} finnes fra før')
                continue
            reg['begreper'].append(begrep)
    return reg


def save(reg, root=ROOT):
    """Skriver faktaene tilbake til filene de kom fra."""
    files = {}
    for fid, fact in reg['fakta'].items():
        files.setdefault(reg['_fil'].get(fid, 'kilder/fakta/nye.json'), {})[fid] = fact
    for rel, facts in files.items():
        data = {**reg['_meta'].get(rel, {}), 'fakta': facts}
        (root / rel).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def series(fact, root=ROOT):
    """Perioder og verdier for en statistikk, eldst først."""
    if 'serie' in fact:
        spec = fact['serie']
        with (root / spec['fil']).open(encoding='utf-8') as stream:
            rows = [(r['måned'], float(r[spec['kolonne']])) for r in csv.DictReader(stream)]
    else:
        rows = [(p['periode'], float(p['verdi'])) for p in fact['perioder']]
    return sorted(rows)


# ---------- tekstformer ----------

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
    """Verdien som gjelder på datoen, eller None. Prognoser har ingen enkeltverdi og sjekkes ikke for dubletter."""
    if fact['type'] == 'prognose':
        return None
    if fact['type'] == 'statistikk':
        return series(fact, root)[-1][1]
    valid = [v for v in fact['verdier'] if v['status'] in PUBLISHED and v['fra'] <= date]
    return valid[-1]['verdi'] if valid else None


def words(text):
    return len(text.split())


# ---------- kontroll av registeret ----------

def validate(reg, root=ROOT):
    errors = list(reg.get('_feil', []))
    for fid, fact in reg['fakta'].items():
        where = f'{reg["_fil"].get(fid, "?")}: {fid}'
        if not re.fullmatch(FACT_ID, fid):
            errors.append(f'{where}: ID må starte med bokstav og bare ha bokstaver og sifre (brukes som {{{{ID}}}})')
        if fact.get('type') not in TYPES:
            errors.append(f'{where}: ukjent type {fact.get("type")!r}')
            continue
        if fact.get('kilde') not in reg['kilder']:
            errors.append(f'{where}: kilden {fact.get("kilde")!r} mangler i kilder/register.json')
        for allowed in fact.get('tillatt', []):
            if not allowed.get('fil') or not allowed.get('tekst') or not allowed.get('grunn'):
                errors.append(f'{where}: hvert unntak i "tillatt" trenger "fil", "tekst" (et unikt stykke av linjen) og "grunn"')
        if fact['type'] == 'prognose':
            anslag = fact.get('anslag') or {}
            if not fact.get('rapport') or not anslag or not all(re.fullmatch(r'\d{4}', y) and isinstance(v, (int, float)) for y, v in anslag.items()):
                errors.append(f'{where}: prognose trenger "rapport" og "anslag" som {{"2027": 2.6}}')
            try:
                dt.date.fromisoformat(fact.get('publisert', ''))
            except ValueError:
                errors.append(f'{where}: "publisert" må være en dato')
            continue
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
    for b in reg['begreper']:
        where = f'{b.get("_fil")}: begrep {b.get("id")}'
        if not re.fullmatch(BEGREP_ID, b.get('id') or ''):
            errors.append(f'{where}: ID må være små bokstaver, sifre og bindestrek, som «dagens-kroner»')
        for key in ('ord', 'definisjon', 'kontrollert', 'kilder'):
            if not b.get(key):
                errors.append(f'{where}: mangler «{key}»')
        if '{{' in (b.get('definisjon', '') + b.get('utdyping', '')):
            errors.append(f'{where}: en ordbok-setning kan ikke inneholde plassholdere')
    return errors


# ---------- genererte filer ----------

def public_begreper(reg):
    return [{k: v for k, v in b.items() if not k.startswith('_') and k != 'tillatt'} for b in reg['begreper']]


def build(reg, root=ROOT):
    facts = {}
    for fid, fact in reg['fakta'].items():
        out = {'kind': TYPES[fact['type']], 'unit': fact['enhet'], 'source': reg['kilder'][fact['kilde']]}
        if fact.get('desimaler'):
            out['decimals'] = fact['desimaler']
        if fact.get('format') == 'årstall':
            out['plain'] = True
        if fact['type'] == 'prognose':
            years = sorted(fact['anslag'])
            parts = [f"{number_text(fact['anslag'][y], fact)} % i {y}" for y in years]
            out.update(value=None, report=fact['rapport'], published=fact['publisert'], publishedText=date_text(fact['publisert']),
                       forecast={y: fact['anslag'][y] for y in years},
                       listText=parts[0] if len(parts) == 1 else ', '.join(parts[:-1]) + ' og ' + parts[-1])
        elif fact['type'] == 'statistikk':
            period, value = series(fact, root)[-1]
            out.update(value=value, period=period, periodText=period_text(period))
            if fact.get('hentet'):
                out['fetched'] = fact['hentet']
                out['fetchedText'] = date_text(fact['hentet'])
        else:
            out['values'] = [{'value': v['verdi'], 'from': v['fra']} for v in fact['verdier'] if v['status'] in PUBLISHED]
        facts[fid] = out
    terms = {b['id']: {'ord': b['ord'], 'definisjon': b['definisjon'], **({'utdyping': b['utdyping']} if b.get('utdyping') else {})} for b in reg['begreper']}
    data = json.dumps({'checked': reg['sjekket'], 'facts': facts, 'terms': terms}, ensure_ascii=False, separators=(',', ':'))
    return RUNTIME.replace('__DATA__', data)


def build_begreper(reg):
    data = json.dumps(public_begreper(reg), ensure_ascii=False, separators=(',', ':'))
    return BEGREP_RUNTIME.replace('__DATA__', data)


RUNTIME = """// Generert av scripts/fakta.py fra kilder/. Rediger registeret, ikke denne filen.
/* Dated factual values and shared explanations for the guidance. User inputs and technical limits are separate. */
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
 const pick=f=>f.values?(f.values.filter(v=>v.from<=date).pop()||null):{value:f.value===undefined?null:f.value};
 const checked=REG.checked,data={};
 for(const [id,f] of Object.entries(REG.facts)){const v=pick(f);data[id]={value:v?v.value:null,unit:f.unit,checked,source:f.source,kind:f.kind};
  if(f.period)Object.assign(data[id],{period:f.period,periodText:f.periodText,fetched:f.fetched||null,fetchedText:f.fetchedText||''});
  if(f.forecast)Object.assign(data[id],{report:f.report,published:f.published,publishedText:f.publishedText,forecast:f.forecast,listText:f.listText});}
 const year=data.year.value;for(const id in data)data[id].year=year;
 function value(id){if(!Object.hasOwn(data,id))throw Error('Ukjent faktanøkkel: '+id);return data[id].value;}
 function text(id){const n=value(id);if(n===null)return '';const f=REG.facts[id];
  return new Intl.NumberFormat('nb-NO',{useGrouping:!f.plain,minimumFractionDigits:f.decimals||0,maximumFractionDigits:f.decimals||0}).format(n).replace(/\\u00a0/g,' ').replace(/\\u2212/g,'-');}
 // Faste forklaringer: {{begrep:ID}} er ordbok-setningen, {{begrep:ID.utdyping}} utdypingen.
 function term(id,key){const t=REG.terms[id];if(!t)throw Error('Ukjent begrep: '+id);return t[key||'definisjon']||'';}
 function part(kind,id,key){if(kind)return term(id,key);value(id);if(!key)return text(id);if(key==='periode')return data[id].periodText||'';if(key==='hentet')return data[id].fetchedText||'';if(key==='rapport')return data[id].report||'';if(key==='publisert')return data[id].publishedText||'';if(key==='liste')return data[id].listText||'';return '';}
 function expand(s){return String(s).replace(/\\{\\{(?:(begrep):)?([a-zA-Z0-9-]+)(?:\\.(periode|hentet|rapport|publisert|liste|utdyping|ord))?\\}\\}/g,(_,kind,id,key)=>part(kind,id,key)).replace(/[\\u2013\\u2014]/g,' til ');}
 function resolve(x){if(typeof x==='string')return expand(x);if(Array.isArray(x))return x.map(resolve);if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,resolve(v)]));return x;}
 // Neste vedtatte verdi etter datoen, til varsler som «Fra 1. januar 2027».
 function upcoming(id){value(id);const f=REG.facts[id];const v=f.values&&f.values.find(x=>x.from>date);return v?{value:v.value,from:v.from}:null;}
 return {date,checked,year,data,value,text,term,expand,resolve,upcoming,at:make};
}
const api=make(today());if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SpareFacts=api;
})(typeof window!=='undefined'?window:globalThis);
"""

BEGREP_RUNTIME = """// Generert av scripts/fakta.py fra kilder/begreper/*.json. Rediger registeret, ikke denne filen.
/* Begrepsregister: én kilde for korte forklaringer av fagord.
   Felt per begrep:
   - id:        fast nøkkel. Brukes i markeringen <span data-begrep="id"> og i tekst som {{begrep:id}}
   - ord:       oppslagsordet slik det vises i overskriften
   - definisjon: ordbok-setningen. Én setning som starter med ordet og sier hva det er eller betyr.
                Reglene står i SPRAKREGLER.md, «Ordbok-setningen».
   - utdyping:  (valgfritt) én kort setning om hvorfor ordet betyr noe. I tekst: {{begrep:id.utdyping}}
   - svar:      (valgfritt) id til et svar i «Spør om sparing». Svaret henter definisjonen med {{begrep:id}}
                (testes). «Les mer» vises bare når svaret er publisert.
   - kilder:    primærkilder for forklaringen
   - kontrollert: dato teksten sist ble kontrollert mot kildene */
(function(root){
'use strict';
const liste=__DATA__;
const byId=new Map(liste.map(b=>[b.id,b]));
function ord(t){return t.trim().split(/\\s+/).length;}
// Ordbokreglene står i SPRAKREGLER.md, «Ordbok-setningen». Det som kan sjekkes maskinelt, sjekkes her.
function kontroller(b){
 if(!b.id||!b.ord||!b.definisjon||!b.kontrollert||!b.kilder?.length)throw Error('Ufullstendig begrep: '+b.id);
 const d=b.definisjon,hode=b.ord.replace(/\\s*\\(.*\\)$/,'');
 if(!d.toLocaleLowerCase('nb').startsWith(hode.toLocaleLowerCase('nb')+' '))throw Error('Definisjonen må starte med ordet: '+b.id);
 if(!/^\\S+(?:\\s\\S+)*?\\s(?:er|betyr)\\s/.test(d))throw Error('Definisjonen må si hva ordet er eller betyr: '+b.id);
 if((d.match(/[.!?]/g)||[]).length!==1||!d.endsWith('.'))throw Error('Definisjonen skal være én setning: '+b.id);
 if(ord(d)>25)throw Error('Definisjonen er over 25 ord: '+b.id);
 if(b.utdyping&&ord(b.utdyping)>25)throw Error('Utdypingen er over 25 ord: '+b.id);
 const alt=d+' '+(b.utdyping||'');
 if(/[\\u2013\\u2014]|\\.\\.\\./.test(alt))throw Error('Tankestrek eller tre prikker i '+b.id);
 if(/\\b(?:du bør|bør du|anbefal|lønner seg)/i.test(alt))throw Error('Råd hører ikke hjemme i en definisjon: '+b.id);
 if(/\\d/.test(d))throw Error('Ingen tall i definisjonen: '+b.id);
}
liste.forEach(kontroller);
const api={liste,hent:id=>byId.get(id)||null,kontroller};
if(typeof module==='object'&&module.exports)module.exports=api;else root.SpareBegreper=api;
})(typeof window!=='undefined'?window:globalThis);
"""


# ---------- søk etter dubletter og plassholdere ----------

def forms(fact, value):
    """Tekstformer som avslører et hardkodet tall."""
    if value is None:
        return []
    text = number_text(value, fact)
    out = [p.replace('{}', text) for p in fact.get('mønstre', [])]
    if fact.get('format') != 'årstall' and (fact.get('desimaler') or value >= 1000):
        out.append(text)
    return out


def needles(reg, date, root=ROOT):
    """Alle tekstbiter som ikke skal stå hardkodet, med eier: {tekst: [(plassholder, unntak)]}."""
    out = {}
    for fid, fact in reg['fakta'].items():
        for text in forms(fact, current(fact, date, root)):
            out.setdefault(text, []).append(('{{' + fid + '}}', fact.get('tillatt', [])))
    for b in reg['begreper']:
        out.setdefault(b['definisjon'], []).append(('{{begrep:' + b['id'] + '}}', b.get('tillatt', [])))
        if b.get('utdyping') and words(b['utdyping']) >= MIN_SENTENCE_WORDS:
            out.setdefault(b['utdyping'], []).append(('{{begrep:' + b['id'] + '.utdyping}}', b.get('tillatt', [])))
    return out


NUMBER = re.compile(r'(?<![\d,.])\d{1,3}(?: \d{3})+(?:,\d+)?(?![\d])|(?<![\d,.])\d+(?:,\d+)?(?![\d])')
WORD = re.compile(r'\w+')


class Matcher:
    """Finner kjente tekstbiter i en linje uten ett stort søkeuttrykk.

    Rene tall slås opp blant tallene i linjen («1 300 000» er ett tall, ikke treff på «300 000»).
    Andre tekstbiter sjekkes bare når linjen inneholder første ord i tekstbiten."""

    def __init__(self, texts):
        self.numbers, self.by_word = set(), {}
        for text in texts:
            if NUMBER.fullmatch(text):
                self.numbers.add(text)
            else:
                first = WORD.search(text)
                self.by_word.setdefault(first.group(0).lower() if first else '', []).append(text)
        for items in self.by_word.values():
            items.sort(key=len, reverse=True)

    def find(self, line):
        found = [m.group(0) for m in NUMBER.finditer(line) if m.group(0) in self.numbers] if self.numbers else []
        if self.by_word:
            words = {w.lower() for w in WORD.findall(line)} | {''}
            for word in words & self.by_word.keys():
                found += [t for t in self.by_word[word] if t in line]
        return found


def scan(paths, texts, root=ROOT):
    """(fil, linje, treff, linjetekst) for hver forekomst. Hver fil leses én gang."""
    hits = []
    if not texts:
        return hits
    finder = Matcher(texts)
    for path in paths:
        for number, line in enumerate(path.read_text(encoding='utf-8', errors='replace').splitlines(), 1):
            for text in finder.find(line):
                hits.append((path.relative_to(root).as_posix(), number, text, line.strip()))
    return hits


def published_files(root=ROOT):
    return [p for p in sorted((root / 'dist').rglob('*')) if p.suffix in ('.js', '.html') and p.relative_to(root).as_posix() not in GENERATED]


def duplicates(reg, root=ROOT, date=None):
    """Hardkodede tall og setninger i dist/, og unntak som ikke lenger treffer noe."""
    date = date or dt.date.today().isoformat()
    owners, problems, used = needles(reg, date, root), [], set()
    for rel, number, text, line in scan(published_files(root), owners, root):
        for placeholder, allowed in owners[text]:
            hit = next((i for i, a in enumerate(allowed) if a['fil'] == rel and a['tekst'] in line), None)
            if hit is None:
                problems.append(f'{rel}:{number}: «{text[:60]}» står hardkodet. Bruk {placeholder}. Linje: {line[:120]}')
            else:
                used.add((placeholder, hit))
    for text, items in owners.items():
        for placeholder, allowed in items:
            for i, a in enumerate(allowed):
                if (placeholder, i) not in used:
                    problems.append(f'Unntaket for {placeholder} i {a["fil"]} («{a["tekst"][:50]}») treffer ikke lenger. Fjern det.')
    return problems


def placeholder_problems(reg, root=ROOT, files=None):
    """Plassholdere som peker på noe som ikke finnes. I nettleseren ville de stoppet visningen av svaret."""
    terms = {b['id']: b for b in reg['begreper']}
    problems = []
    for path in files or published_files(root):
        rel = path.relative_to(root).as_posix() if path.is_absolute() else str(path)
        for number, line in enumerate(path.read_text(encoding='utf-8', errors='replace').splitlines(), 1):
            for match in PLACEHOLDER.finditer(line):
                kind, pid, key = match.groups()
                if kind:
                    ok = pid in terms and (key is None or (key in BEGREP_KEYS and (key != 'utdyping' or terms[pid].get('utdyping'))))
                else:
                    fact = reg['fakta'].get(pid)
                    ok = fact is not None and ((key is None and fact['type'] != 'prognose') or (key in FACT_KEYS and fact['type'] == 'statistikk')
                                               or (key in FORECAST_KEYS and fact['type'] == 'prognose'))
                if not ok:
                    problems.append(f'{rel}:{number}: {match.group(0)} finnes ikke i registeret')
    return problems


def places(pid, reg, root=ROOT, value=None):
    """Alle filer som bruker faktumet eller begrepet, med plassholder eller som tekst. pid: ID eller begrep:ID."""
    if pid.startswith('begrep:'):
        b = next(x for x in reg['begreper'] if x['id'] == pid[7:])
        texts = [b['definisjon']] + ([b['utdyping']] if b.get('utdyping') and words(b['utdyping']) >= MIN_SENTENCE_WORDS else [])
        texts += ['{{' + pid + '}}', '{{' + pid + '.', f'data-begrep="{b["id"]}"']
    else:
        fact = reg['fakta'][pid]
        texts = forms(fact, current(fact, dt.date.today().isoformat(), root) if value is None else value) + ['{{' + pid + '}}', '{{' + pid + '.']
    files = [p for p in sorted(root.rglob('*')) if p.is_file() and not any(x.startswith('.') or x == 'node_modules' for x in p.relative_to(root).parts)
             and p.suffix in ('.js', '.html', '.md', '.json', '.csv', '.py', '.cjs') and not p.relative_to(root).as_posix().startswith('kilder/')]
    return scan(files, texts, root)


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


def bump_versions(names=None, root=ROOT):
    """Sett ?v= fra innholdet i filene (scripts/versjoner.py). «names» brukes ikke lenger; alle filer sjekkes."""
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import versjoner
    return versjoner.run(root)


def write_generated(reg, root=ROOT):
    """Skriver de genererte filene. Returnerer navnene på filene som faktisk endret seg."""
    changed = []
    for rel, text in ((TARGET, build(reg, root)), (BEGREP_TARGET, build_begreper(reg))):
        path = root / rel
        if not path.exists() or path.read_text(encoding='utf-8') != text:
            path.write_text(text, encoding='utf-8')
            changed.append(Path(rel).name)
    return changed


def main(argv):
    reg = load()
    errors = validate(reg)
    if errors:
        print('\n'.join(errors), file=sys.stderr)
        return 1
    if argv[:1] == ['steder']:
        for rel, number, text, line in places(argv[1], reg):
            print(f'{rel}:{number}  [{text[:40]}]  {line[:140]}')
        return 0
    if argv[:1] == ['frister']:
        for row in deadlines(reg, dt.date.today()):
            print(f"{row['id']}: bekreftet til {row['bekreftet_til']}, frist {row['frist']}" + (' (ny verdi registrert)' if row['ny_verdi'] else ''))
        return 0
    if '--check' in argv:
        problems = []
        for rel, text in ((TARGET, build(reg)), (BEGREP_TARGET, build_begreper(reg))):
            if (ROOT / rel).read_text(encoding='utf-8') != text:
                problems.append(f'{rel} er ikke generert fra kilder/. Kjør python3 scripts/fakta.py.')
        problems += placeholder_problems(reg)
        problems += duplicates(reg)
        if problems:
            print('\n'.join(problems), file=sys.stderr)
            return 1
        print(f'Fakta: {len(reg["fakta"])} fakta og {len(reg["begreper"])} begreper i {len(reg["_meta"]) + 2} filer kontrollert. '
              'Genererte filer i takt, alle plassholdere finnes, ingen hardkodede dubletter.')
        return 0
    changed = write_generated(reg)
    print('Skrev ' + (', '.join(changed) if changed else 'ingenting (alt var i takt)'))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
