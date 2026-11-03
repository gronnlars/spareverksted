"""Moteksempler for svargrunnmuren. Ingen nett eller modellkall."""
import copy
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'scripts'))
import svar
import fakta
import kildevakt as kv
import tidsmaskin as tm
ROOT=svar.ROOT

class SchemaTests(unittest.TestCase):
    def setUp(self):
        self.reg=fakta.load(ROOT)
        self.a=svar.read(ROOT/'kilder/svar/SV-133.md')

    def check(self,a=None):
        return svar.validate(a or self.a,self.reg)

    def reject(self,change,pattern):
        change(self.a)
        with self.assertRaisesRegex(svar.Invalid,pattern):self.check()

    def ready(self):
        a=self.a;s=a['sections'];m=a['fields'][1]
        m['Status']='godkjent'
        s[14]=s[14].replace('| vet ikke |','| ja |')
        s[9]=s[9].replace('| ikke lest |','| 2026-11-03 |')
        s[16]='ingen'
        h=svar.digest(a,self.reg)
        author=m['Skribent'].rsplit(',',1)[0].strip()
        s[17]+=f'\n| 2026-11-03 | {author} | skribent | egenkontroll | utført |\n| 2026-11-03 | Kontrollør i separat testøkt | kontrollør | 12 punkter | sha256:{h} |\n| 2026-11-03 | Lars | godkjenner | Testgodkjenning, kun fixture | sha256:{h} |'
        return a

    def test_pilot_roundtrip_text(self):
        self.check()
        originals=json.loads(subprocess.check_output(['node','-e',"console.log(JSON.stringify(require('./dist/veileder-knowledge.js')))"] ,cwd=ROOT))
        old=next(e for e in originals if e['id']=='q-bsu-basics')
        new=self.a['entry']
        for key in ('id','title','intro','questions','keys','tradeoffs','sources','review','published','changed','checked'):
            self.assertEqual(old[key],new[key],key)
        for p,q in zip(old['parts'],new['parts']):
            self.assertEqual(p['title'],q['title']);self.assertEqual(p['text'],q['text'])
        self.assertEqual(new['parts'][-1]['table'],{'$table':'bsuRates'})

    def test_unknown_status(self):self.reject(lambda a:a['fields'][1].update(Status='ferdig'),'Ugyldig status')
    def test_invalid_calendar_date(self):self.reject(lambda a:a['fields'][1].update({'Neste kontroll':'2026-02-30'}),'Ugyldig dato')
    def test_date_order(self):self.reject(lambda a:a['fields'][1].update({'Først publisert':'2027-01-01'}),'Krever publisert')
    def test_advice_title(self):self.reject(lambda a:a['fields'][2].update(Tittel='Bør jeg velge BSU?'),'begynner med Bør')
    def test_missing_claim(self):self.reject(lambda a:a['sections'].update({3:a['sections'][3]+' [P999]'}),'Påstandsmerker')
    def test_unused_claim(self):self.reject(lambda a:a['sections'].update({3:a['sections'][3].replace('[P1]','')}),'Påstandsmerker')
    def test_unknown_source(self):self.reject(lambda a:a['sections'].update({14:a['sections'][14].replace('| tax-bsu |','| unknown |')}),'Ukjent kilde')
    def test_duplicate_claim(self):self.reject(lambda a:a['sections'].update({14:a['sections'][14]+'\n'+a['sections'][14].splitlines()[2]}),'duplisert ID')
    def test_unknown_fact(self):self.reject(lambda a:a['sections'].update({3:a['sections'][3]+' {{missing}}'}),'Ukjent fakta')
    def test_unknown_term(self):self.reject(lambda a:a['sections'].update({3:a['sections'][3]+' {{begrep:missing}}'}),'Ukjent begrep')
    def test_unknown_property(self):self.reject(lambda a:a['sections'].update({3:a['sections'][3]+' {{bsuAnnual.nope}}'}),'Ukjent faktafelt')
    def test_typography(self):
        for text in ['–','—','…','...']:
            with self.subTest(text=text):
                a=copy.deepcopy(self.a);a['sections'][3]+=text
                with self.assertRaisesRegex(svar.Invalid,'Tankestrek'):self.check(a)
    def test_unsafe_source(self):self.reject(lambda a:a['sections'].update({9:a['sections'][9].replace('https://','http://')}),'Ugyldig URL')
    def test_insufficient_questions(self):self.reject(lambda a:a['fields'][2].update({'Spørsmål brukere kan stille':'- Hva?'}),'Minst tre')
    def test_draft_not_compiled(self):
        self.check();self.assertNotIn('q-bsu-basics',svar.runtime([self.a]))
    def test_unread_cannot_be_ready(self):self.reject(lambda a:a['fields'][1].update(Status='til kontroll'),'Udokumentert')
    def test_valid_approval(self):
        self.check(self.ready());output=svar.runtime([self.a]);self.assertIn('q-bsu-basics',output)
        for private in ['Publiseringssperrer','Påstandstabell','Kontrollør i separat','sha256:','[P1]']:
            self.assertNotIn(private,output)
    def test_edit_invalidates_approval(self):
        self.ready();self.a['sections'][3]+=' Endret tekst.'
        with self.assertRaisesRegex(svar.Invalid,'gjeldende sjekksum'):self.check()
    def test_fact_edit_invalidates_approval(self):
        self.ready();self.reg['fakta']['bsuAnnual']['verdier'][0]['verdi']+=1
        with self.assertRaisesRegex(svar.Invalid,'gjeldende sjekksum'):self.check()
    def test_series_edit_invalidates_approval(self):
        before=svar.digest(self.a,self.reg)
        original=Path.read_bytes
        def changed(path):
            data=original(path)
            return data+b'changed' if path.name=='bsu-rentehistorikk.csv' else data
        with patch.object(Path,'read_bytes',changed):
            self.assertNotEqual(before,svar.digest(self.a,self.reg))

    def test_author_cannot_review_self(self):
        self.ready();author=self.a['fields'][1]['Skribent'].rsplit(',',1)[0]
        self.a['sections'][17]=self.a['sections'][17].replace('Kontrollør i separat testøkt',author)
        with self.assertRaisesRegex(svar.Invalid,'Separat kontroll'):self.check()
    def test_no_lars_approval(self):
        self.ready();self.a['sections'][17]=self.a['sections'][17].replace('| Lars |','| Modell |')
        with self.assertRaisesRegex(svar.Invalid,'Lars sin'):self.check()
    def test_structure_mutations(self):
        text=(ROOT/'kilder/svar/SV-133.md').read_text()
        for changed in [text.replace('## 3. Kort svar','## 3. Feil'),text.replace('## 4. Forbehold','## 3. Kort svar'),text+'\n## 19. Ekstra\nnei']:
            with tempfile.TemporaryDirectory() as d:
                p=Path(d)/'SV-133.md';p.write_text(changed)
                with self.assertRaisesRegex(svar.Invalid,'overskrifter'):svar.read(p)
    def test_empty_field(self):
        with self.assertRaisesRegex(svar.Invalid,'Tomt felt'):svar.fields('Tittel: ',['Tittel'])
    def test_literal_search_no_regex_injection(self):
        self.ready();self.a['fields'][2]['Søkefraser']='bsu.*, (test), a+b'
        self.a['sections'][17]=self.a['sections'][17].replace('sha256:'+svar.digest(self.a,self.reg),'sha256:'+svar.digest(self.a,self.reg))
        # Compiler accepts literal phrases only. JS must match punctuation literally.
        e=svar.compile_answer(self.a);self.a['entry']=e
        js=svar.runtime([self.a])
        with tempfile.TemporaryDirectory(dir=ROOT/'dist') as d:
            p=Path(d)/'check.cjs'
            js=js.replace("require('./bsu-rates.js')","require('../bsu-rates.js')")
            p.write_text(js+"\nconst assert=require('assert');const w=module.exports[0].words;assert(w[0].test('bsu.*'));assert(!w[0].test('bsuuuu'));assert(w[1].test('(test)'));assert(w[2].test('a+b'));")
            subprocess.run(['node',str(p)],check=True)
    def test_dependency_index(self):
        self.check();index=svar.index([self.a],self.reg)
        self.assertEqual(index['bsuAnnual'],['SV-133']);self.assertIn('SV-133',index['tax-bsu'])
    def test_hash_stable(self):self.assertEqual(svar.digest(self.a,self.reg),svar.digest(copy.deepcopy(self.a),self.reg))

class IngestionTests(unittest.TestCase):
    def test_kildevakt_access_uses_named_source(self):
        class R:status=200
        sources=kv.load_sources();sources['kilder'].reverse()
        with patch.object(kv,'load_sources',return_value=sources):
            text,failed=kv.access(lambda _:R(),with_status=True)
            self.assertFalse(failed);self.assertIn('skatteetaten',text)
    def test_kildevakt_access_errors_exit_nonzero(self):
        class R:status=503
        with patch.object(kv,'http_get',return_value=R()):self.assertEqual(kv.main(['tilgang']),1)
    def test_fetch_error_is_failure_even_with_valid_cache(self):
        with tempfile.TemporaryDirectory() as d, patch.object(tm,'fetch',return_value=[('cached','hentefeil','HTTP 503')]),patch.object(tm,'verify',return_value=[]),patch.object(tm,'describe',return_value=''):
            self.assertEqual(tm.main(['hent','--mål',d]),1)
    def test_empty_fetch_does_not_pass(self):
        with tempfile.TemporaryDirectory() as d,patch.object(tm,'fetch',return_value=[]),patch.object(tm,'verify',return_value=[]),patch.object(tm,'describe',return_value=''):
            self.assertEqual(tm.main(['hent','--mål',d]),1)
    def test_workflows_pipefail(self):
        for name in ['kildevakt','tidsmaskin']:
            self.assertIn('defaults:\n  run:\n    shell: bash',(ROOT/f'.github/workflows/{name}.yml').read_text())

if __name__=='__main__':unittest.main()
