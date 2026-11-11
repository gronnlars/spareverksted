"""Isolated schema and inventory experiment. Run from repository root with Python 3.
No production writes, network calls, or third-party dependencies.
"""
from pathlib import Path
from copy import deepcopy
from datetime import date
from math import isfinite
import subprocess, json, re

ROOT=Path(__file__).resolve().parents[2]
OUT=Path(__file__).resolve().parent
IDS=['q-aksjesparekonto','q-fondskonto','q-bsu-basics']

def inventory():
 raw=subprocess.check_output(['node','-e',"process.stdout.write(JSON.stringify(require('./dist/veileder-knowledge.js')))"],cwd=ROOT,text=True)
 entries=json.loads(raw)
 selected=[x for x in entries if x['id'] in IDS]
 # Fail closed if the database uses different IDs.
 assert len(selected)==3, [x['id'] for x in entries]
 lines=['# Kartlegging av tre svar og kjente tall','',
 'Generert fra main-grunnlaget med prove.py. Dette er kandidater til faglig oppdeling, ikke kildekontrollerte fakta eller en fullstendighetsgaranti.','',
 '## Tekstfelt i svarene','',
 'Alle tekstfelt tas med, også metadata. Klassifisering må vurderes før felt blir fakta. RegExp-søkeregler blir tomme objekter ved JSON-eksport og er ikke analysert.','']
 count=0
 source_lines=(ROOT/'dist/veileder-knowledge.js').read_text().splitlines()
 def walk(x,path):
  nonlocal count
  if isinstance(x,str):
   count+=1
   needle=json.dumps(x,ensure_ascii=False)[1:-1]
   positions=[str(i) for i,line in enumerate(source_lines,1) if needle in line] if needle else []
   location='dist/veileder-knowledge.js:'+','.join(positions) if positions else 'tekst satt inn fra import eller annen formatering, se feltstien'
   lines.append(f'- `{path}` ({location}): '+x.replace('\n',' '))
  elif isinstance(x,list):
   for i,v in enumerate(x): walk(v,f'{path}[{i}]')
  elif isinstance(x,dict):
   for k,v in x.items(): walk(v,f'{path}.{k}')
 for e in selected:
  lines.extend(['',f'### {e["id"]}',''])
  walk(e,e['id'])
 lines.extend(['','## Talltreff i sporede dist-filer','',
 'Søk etter utvalgte kjente tallvarianter, ikke alle tall. Genererte filer er med og merkes. Treff er vurderingskandidater, ikke feil. Ingen byggesperre.',''])
 pattern=re.compile(r'(?<!\d)(?:27[ \u00a0]?500|300[ \u00a0]?000|2[ \u00a0]?750|37[.,]84|33|34|80|10)(?!\d)')
 paths=subprocess.check_output(['git','ls-files','dist'],cwd=ROOT,text=True).splitlines()
 hits=0
 for name in paths:
  p=ROOT/name
  if p.suffix not in ['.js','.html','.json','.css']: continue
  for n,line in enumerate(p.read_text().splitlines(),1):
   vals=sorted(set(m.group() for m in pattern.finditer(line)))
   if vals:
    hits+=1
    kind='generert' if name=='dist/bsu-rates.js' else 'må klassifiseres'
    snippet=line.strip().replace('|','\\|')
    if len(snippet)>450: snippet=snippet[:450]+' [avkortet, se kildelinjen]'
    lines.append(f'- `{name}:{n}` [{kind}], tall {", ".join(vals)}: `{snippet}`')
 lines.extend(['',f'Tekstfelt: {count}. Linjer med talltreff: {hits}.',
 '', 'Filene undersøkes fra git ls-files. Usporede filer, bilder, PDF, andre tall, tallord og framtidige funksjoner dekkes ikke.'])
 (OUT/'KARTLEGGING.md').write_text('\n'.join(lines)+'\n')
 return count,hits

def fact(value,scope='deposit'):
 return dict(value=value,knowledge='known',legal='in_force',review='checked',effective_from=None,confirmed={'basis':'income_year','from':2026,'through':2026},source={'id':'fixture','location':'synthetic fixture, not evidence'},conditions=[],related=[],scope=scope)

def fixtures():
 db={'annual':fact(27500),'total':fact(300000),'age':fact(33),
     'rate':fact(10,'tax_benefit'),'housing':fact('excludes_deduction','tax_benefit'),
     'interest':fact('annual','interest_tax'),'withdrawal':fact('terms','withdrawal')}
 db['annual']['conditions']=['age']
 db['rate']['conditions']=['age','housing']
 return db

REQUIRED=set(['annual','total','age','rate','housing','interest','withdrawal'])
PROFILES={'deposit':{'annual','total'},'benefit':{'rate','age','housing'},'interest':{'interest'}}
FIELDS=set(fact(0))
EXPECTED_SCOPE={key:record['scope'] for key,record in fixtures().items()}
VIEW_SCOPES={'deposit':{'deposit'},'benefit':{'deposit','tax_benefit'},'interest':{'interest_tax'}}

def validate(db):
 if not REQUIRED<=db.keys(): raise ValueError('missing scheme coverage')
 for fid,f in db.items():
  if set(f)!=FIELDS: raise ValueError('schema fields')
  if fid in EXPECTED_SCOPE and f['scope']!=EXPECTED_SCOPE[fid]: raise ValueError('fact scope mismatch')
  if f['scope'] not in {'deposit','tax_benefit','interest_tax','withdrawal'}: raise ValueError('unknown scope')
  if f['knowledge'] not in ['known','unknown','none','not_applicable']: raise ValueError('knowledge')
  if f['legal'] not in ['in_force','adopted','proposed','repealed']: raise ValueError('legal')
  if f['review'] not in ['checked','unreviewed','open']: raise ValueError('review')
  if f['knowledge']=='known' and f['value'] is None: raise ValueError('missing value')
  if f['knowledge']!='known' and f['value'] is not None: raise ValueError('inconsistent value')
  if f['knowledge'] in ['known','none','not_applicable'] and not all(f['source'].get(k) for k in ['id','location']): raise ValueError('missing evidence location')
  c=f['confirmed']
  if set(c)!={'basis','from','through'}: raise ValueError('confirmation fields')
  if c['basis'] not in ['income_year','withdrawal_year']: raise ValueError('unsupported time basis')
  if type(c['from']) is not int or type(c['through']) is not int or c['from']>c['through']: raise ValueError('confirmation interval')
  if f['effective_from'] is not None:
   try: date.fromisoformat(f['effective_from'])
   except (ValueError,TypeError): raise ValueError('invalid effective date')
  for dep in f['conditions']+f['related']:
   if dep not in db: raise ValueError('missing link')

def view(db,profile,claims,year=2026,calculation=False,basis='income_year'):
 validate(db)
 if profile not in PROFILES: raise ValueError('unknown profile')
 if not PROFILES[profile]<=set(claims): raise ValueError('view coverage')
 if any(fid not in db or db[fid]['scope'] not in VIEW_SCOPES[profile] for fid in claims): raise ValueError('view scope mismatch')
 out=[]
 def bundle(fid,trail=()):
  if fid in trail: raise ValueError('cycle')
  f=db[fid]
  if f['knowledge'] in ['unknown','not_applicable'] or f['review']!='checked' or f['legal']!='in_force': raise ValueError('not ready')
  if f['confirmed']['basis']!=basis: raise ValueError('time basis mismatch')
  # This prototype handles full years only. Midyear changes need a dated case.
  if f['effective_from'] is not None and date.fromisoformat(f['effective_from'])>date(year,1,1): raise ValueError('not effective for full requested year')
  if year<f['confirmed']['from']: raise ValueError('unconfirmed historical year')
  old=year>f['confirmed']['through']
  if calculation and old: raise ValueError('unconfirmed calculation year')
  if calculation and f['knowledge']!='known': raise ValueError('no calculation value')
  if calculation and fid in claims and (type(f['value']) not in [int,float] or not isfinite(f['value'])): raise ValueError('non-numeric calculation input')
  return dict(id=fid,scope=f['scope'],warning='last confirmed '+str(f['confirmed']['through']) if old else None,
      conditions=[bundle(d,trail+(fid,)) for d in f['conditions']])
 for fid in claims: out.append(bundle(fid))
 return out

def run_tests():
 results=[]
 def check(name,fn):
  try:
   assert fn()
   results.append({'test':name,'result':'pass'})
  except Exception as e: results.append({'test':name,'result':'FAIL','detail':str(e)})
 def blocked(fn):
  try: fn(); return False
  except ValueError: return True
 def mutate(key,field,value):
  db=fixtures();db[key][field]=value;return db
 check('deposit covers annual and total',lambda:len(view(fixtures(),'deposit',['annual','total']))==2)
 check('missing total fact detected',lambda:blocked(lambda:validate({k:v for k,v in fixtures().items() if k!='total'})))
 check('total as related only does not satisfy view',lambda:blocked(lambda:view(mutate('annual','related',['total']),'deposit',['annual'])))
 check('benefit view without housing rejected',lambda:blocked(lambda:view(fixtures(),'benefit',['rate','age'])))
 check('housing condition stays under rate',lambda:'housing' in [x['id'] for x in view(fixtures(),'benefit',['rate','age','housing'])[0]['conditions']])
 check('housing does not infect annual limit',lambda:'housing' not in [x['id'] for x in view(fixtures(),'deposit',['annual','total'])[0]['conditions']])
 check('age does not infect interest taxation',lambda:not view(fixtures(),'interest',['interest'])[0]['conditions'])
 unknown=fixtures();unknown['annual'].update(knowledge='unknown',value=None)
 check('unknown value rejected in display',lambda:blocked(lambda:view(unknown,'deposit',['annual','total'])))
 db=fixtures();db['annual'].update(knowledge='none',value=None)
 check('documented none allowed',lambda:len(view(db,'deposit',['annual','total']))==2)
 check('none requires evidence',lambda:blocked(lambda:view({**db,'annual':{**db['annual'],'source':{}}},'deposit',['annual','total'])))
 check('reviewed proposal still blocked',lambda:blocked(lambda:view(mutate('annual','legal','proposed'),'deposit',['annual','total'])))
 check('unreviewed current rule blocked',lambda:blocked(lambda:view(mutate('annual','review','unreviewed'),'deposit',['annual','total'])))
 check('2027 explanation gets warning',lambda:all(x['warning'] for x in view(fixtures(),'deposit',['annual','total'],year=2027)))
 check('2027 calculation blocked',lambda:blocked(lambda:view(fixtures(),'deposit',['annual','total'],year=2027,calculation=True)))
 check('unknown effective date allowed',lambda:view(fixtures(),'deposit',['annual','total'])[0]['id']=='annual')
 check('precise source location required',lambda:blocked(lambda:validate(mutate('annual','source',{'id':'fixture'}))))
 check('unknown field rejected',lambda:blocked(lambda:validate({**fixtures(),'annual':{**fact(27500),'typo':True}})))
 check('withdrawal coverage required',lambda:blocked(lambda:validate({k:v for k,v in fixtures().items() if k!='withdrawal'})))
 check('missing condition ID rejected',lambda:blocked(lambda:view(mutate('annual','conditions',['absent']),'deposit',['annual','total'])))
 check('condition cycle rejected',lambda:blocked(lambda:view(mutate('age','conditions',['annual']),'deposit',['annual','total'])))
 check('repealed fact rejected for current display',lambda:blocked(lambda:view(mutate('annual','legal','repealed'),'deposit',['annual','total'])))
 check('2028 rule blocked in 2026 display',lambda:blocked(lambda:view(mutate('annual','effective_from','2028-01-01'),'deposit',['annual','total'])))
 check('2019 calculation blocked without historical evidence',lambda:blocked(lambda:view(fixtures(),'deposit',['annual','total'],year=2019,calculation=True)))
 na=fixtures();na['annual'].update(knowledge='not_applicable',value=None)
 check('not applicable blocked in display',lambda:blocked(lambda:view(na,'deposit',['annual','total'])))
 check('not applicable blocked in calculation',lambda:blocked(lambda:view(na,'deposit',['annual','total'],calculation=True)))
 check('documented none blocked in calculation',lambda:blocked(lambda:view(db,'deposit',['annual','total'],calculation=True)))
 check('empty string blocked in calculation',lambda:blocked(lambda:view(mutate('annual','value',''),'deposit',['annual','total'],calculation=True)))
 check('numeric zero allowed in calculation',lambda:bool(view(mutate('annual','value',0),'deposit',['annual','total'],calculation=True)))
 check('confirmation time basis enforced',lambda:blocked(lambda:view(fixtures(),'deposit',['annual','total'],basis='withdrawal_year')))
 check('midyear effective date rejected for full year',lambda:blocked(lambda:view(mutate('annual','effective_from','2026-07-01'),'deposit',['annual','total'])))
 check('historical display blocked without evidence',lambda:blocked(lambda:view(fixtures(),'deposit',['annual','total'],year=2019)))
 check('withdrawal scope cannot label annual deposit fact',lambda:blocked(lambda:view(mutate('annual','scope','withdrawal'),'deposit',['annual','total'])))
 check('unknown scope rejected',lambda:blocked(lambda:validate(mutate('annual','scope','typo'))))
 check('withdrawal fact cannot be added to deposit card',lambda:blocked(lambda:view(fixtures(),'deposit',['annual','total','withdrawal'])))
 check('benefit card accepts its required mixed scopes',lambda:len(view(fixtures(),'benefit',['rate','age','housing']))==3)
 return results

if __name__=='__main__':
 counts=inventory()
 results=run_tests()
 payload=dict(text_fields=counts[0],number_hit_lines=counts[1],tests=results,passed=sum(x['result']=='pass' for x in results),total=len(results))
 (OUT/'RESULTAT.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({k:v for k,v in payload.items() if k!='tests'}))
 assert payload['passed']==payload['total']
