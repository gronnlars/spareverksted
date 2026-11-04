"""Regression and counterexample tests for the editorial tool, with no extra packages."""
import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('klarsprak', ROOT/'scripts/klarsprak.py')
K = importlib.util.module_from_spec(spec)
spec.loader.exec_module(K)


def block(text, chapter='kapittel'):
    return dict(text=text,kind='forklaring',page='test.html',file='test.html',line=3,
                chapter=chapter,terms=[],disclosure=False)


class LanguageTests(unittest.TestCase):
    def test_norwegian_unicode_and_normalization(self):
        self.assertEqual(K.tokens('Ærlig økning blåbær'), ['Ærlig','økning','blåbær'])
        self.assertEqual(K.tokens('bla\u030abær'), ['blåbær'])
        self.assertEqual(K.tokens('kjøpe\u00adkraft'), ['kjøpekraft'])

    def test_compounds_and_apostrophes(self):
        self.assertEqual(K.tokens('BSU-konto PDF-leser Lars’ økonomi'),['BSU-konto','PDF-leser','Lars','økonomi'])
        self.assertEqual(K.tokens("O'Neills fond"),["O'Neills",'fond'])

    def test_numbers(self):
        self.assertEqual(K.tokens('10 000 kr, 2,5 % og 37,84 prosent'),['10 000','kr','2,5','og','37,84','prosent'])
        self.assertEqual(K.tokens('10\u00a0000 1\u202f000'),['10\u00a0000','1\u202f000'])
        self.assertEqual(len(K.sentences('Renten er 2,5 %. Beløpet er 10 000 kr. Det øker.')),3)
        self.assertIn('2,5',K.sentences('Renten er 2,5 %.')[0])

    def test_abbreviations_dates_punctuation(self):
        self.assertEqual(len(K.sentences('Du kan f.eks. spare i fond. Se bl.a. kostnader.')),2)
        self.assertEqual(len(K.sentences('Fra 1. januar gjelder dette. Datoen er 04.11.2026.')),2)
        self.assertEqual(len(K.sentences('Hva betyr det? «Les dette!» Så gjør vi det.')),3)
        self.assertEqual(len(K.sentences('Bruk A.B. som navn.')),1)

    def test_urls_do_not_make_sentences(self):
        self.assertEqual(K.tokens('Se https://eksempel.no/fagord her.'),['Se','her.'])
        self.assertEqual(len(K.sentences('Se https://eksempel.no/fagord her. Neste setning.')),2)

    def test_empty_and_fragments(self):
        self.assertIsNone(K.metrics([])['lix'])
        self.assertEqual(K.sentences('... !  '),[])
        self.assertEqual(len(K.sentences('En forklaring uten punktum')),1)

    def test_formula_by_hand(self):
        # 120 words, 6 sentences, 30 long words: 120/6 + 100*30/120 = 45.
        text = ('bank '*15+'kjøpekraft '*5).strip()+'.'
        m = K.metrics([block(text)]*6)
        self.assertEqual((m['words'],m['sentences'],m['long_words'],m['lix']),(120,6,30,45))

    def test_six_seven_letters(self):
        m=K.metrics([block('spares sparing 1234567.')])
        self.assertEqual(m['long_words'],1)

    def test_minimum_sample(self):
        self.assertIsNone(K.metrics([block('ord '*33+'.')]*3)['lix'])
        self.assertIsNotNone(K.metrics([block('ord '*34+'.'),block('ord '*33+'.'),block('ord '*33+'.')])['lix'])
        self.assertIsNone(K.metrics([block('ord '*100+'.')])['lix'])

    def test_thresholds_are_advisory(self):
        self.assertFalse(any(f['rule']=='lang-setning' for f in K.findings([block('ord '*30+'.')],[])))
        self.assertTrue(any(f['rule']=='lang-setning' for f in K.findings([block('ord '*31+'.')],[])))
        self.assertFalse(any(f['rule']=='langt-avsnitt' for f in K.findings([block('ord '*100)],[])))
        self.assertTrue(any(f['rule']=='langt-avsnitt' for f in K.findings([block('ord '*101)],[])))
        self.assertFalse(any(f['rule']=='lange-ord' for f in K.findings([block('a'*13)],[])))
        self.assertTrue(any(f['rule']=='lange-ord' for f in K.findings([block('a'*14)],[])))
        self.assertTrue(all(f['severity']=='forslag' for f in K.findings([block('kompliserteord '*101)],[])))

    def test_extraction_and_inline_boundaries(self):
        bs=K.extract('<main><h2 id="a">Tema</h2><p>Kjøpe<em>kraft</em> og <a href="#">rente</a>.</p></main>','x')
        p=next(b for b in bs if b['kind']=='forklaring')
        self.assertEqual(p['text'],'Kjøpekraft og rente.')
        self.assertEqual(p['chapter'],'a')
        self.assertEqual(p['line'],1)

    def test_kinds_are_separate(self):
        html='''<nav><p>Meny</p></nav><p>Tekst <button>Åpne</button> her.</p>
        <p hidden>Skjult</p><div aria-hidden="true"><p>Også skjult</p></div>
        <p class="sr-only">Opplesning</p><p style="display: none">Borte</p>
        <table><tr><td><p>Tabell</p></td></tr></table><script>kode</script>'''
        bs=K.extract(html,'x')
        self.assertEqual([b['text'] for b in bs if b['kind']=='forklaring'],['Tekst her.'])
        counts={kind:sum(b['kind']==kind for b in bs) for kind in ['navigasjon','grensesnitt','skjult','tabell','kode/metadata']}
        self.assertEqual(counts,dict(navigasjon=1,grensesnitt=1,skjult=4,tabell=1,**{'kode/metadata':1}))

    def test_details_and_nested_list(self):
        bs=K.extract('<details><summary>Åpne</summary><p>Fordypning</p></details><ul><li>A<p>B</p></li></ul>','x')
        self.assertEqual(sum(len(K.tokens(b['text'])) for b in bs if b['kind']=='forklaring'),3)
        self.assertTrue(next(b for b in bs if b['text']=='Fordypning')['disclosure'])

    def test_technical_words_and_scoping(self):
        t=dict(id='rente',variants=['effektiv rente'],definition='Effektiv rente er et fagord.')
        bs=[block('Effektiv rente og ineffektiv renteberegning.'),block('Effektiv rente på nytt.'),block('Effektiv rente.',chapter='ny')]
        fs=K.findings(bs,[t])
        self.assertEqual(sum(f['rule']=='fagord' for f in fs),2)
        self.assertEqual(sum(f['rule']=='fagord' for f in K.findings([block('Ineffektiv rente.')],[t])),0)

    def test_definition_is_only_signal(self):
        t=dict(id='k',reference='k',variants=['kjøpekraft'],definition='Kjøpekraft er hva pengene kjøper.')
        b=block(t['definition'])
        self.assertIn('signal',K.findings([b],[t])[0]['detail'])
        b=block('Kjøpekraft.');b['terms']=['k']
        self.assertIn('signal',K.findings([b],[t])[0]['detail'])

    def test_stable_findings_and_safe_markdown(self):
        r=K.measure()
        shifted=copy.deepcopy(r['findings'])
        for f in shifted:f['line']+=10
        self.assertEqual({x['id'] for x in r['findings']},{x['id'] for x in shifted})
        changed=copy.deepcopy(r);changed['method']='other'
        self.assertIn('ulik metode',K.markdown(r,changed))
        self.assertEqual(K.esc('<script>|'), '&lt;script&gt;&#124;')
        self.assertIn('0 nye og 0 bortfalte',K.markdown(r,r))

    def test_public_answers_only_and_location(self):
        bs=K.answer_blocks(ROOT)
        ids={b['chapter'] for b in bs}
        expected=json.loads(subprocess.check_output(['node','-e',"process.stdout.write(JSON.stringify(require('./dist/publiserte-svar.js')))"],cwd=ROOT))
        self.assertEqual(ids,set(expected))
        self.assertTrue(all(b['line']>=1 and b['pointer'] for b in bs))
        self.assertFalse(any('{{' in b['text'] for b in bs))
        self.assertFalse(any(b['pointer'].startswith(('/review','/sources','/questions')) for b in bs))

    def test_invalid_registry_and_no_pages_fail(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp)
            with self.assertRaises(ValueError):K.measure(root)
        data=json.loads((ROOT/'docs/klarsprak/ordliste.json').read_text())
        for mutation in ['duplicate','reference','source','words','variant']:
            bad=copy.deepcopy(data)
            if mutation=='duplicate':bad['terms'].append(bad['terms'][0])
            if mutation=='reference':bad['terms'][0]['reference']='finnes-ikke'
            if mutation=='source':bad['terms'][4]['sources'][0]['read']=''
            if mutation=='words':bad['terms'][4]['definition']='ord '*26+'.'
            if mutation=='variant':bad['terms'][-1]['variants']=['']
            with tempfile.TemporaryDirectory() as temp:
                config=Path(temp)/'ord.json';config.write_text(json.dumps(bad))
                with self.assertRaises(ValueError,msg=mutation):K.vocabulary(ROOT,config)

    def test_control_errors_and_advisory_exit_status(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp)
            (root/'dist').mkdir()
            (root/'kilder/begreper').mkdir(parents=True)
            (root/'kilder/begreper/base.json').write_text((ROOT/'kilder/begreper/grunnbegreper.json').read_text() if (ROOT/'kilder/begreper/grunnbegreper.json').exists() else next((ROOT/'kilder/begreper').glob('*.json')).read_text())
            (root/'dist/publiserte-svar.js').write_text("module.exports=['test'];")
            (root/'dist/veileder-svar-generert.js').write_text('module.exports=[];')
            (root/'dist/veileder-facts.js').write_text('module.exports={expand:x=>x};')
            (root/'dist/begreper.js').write_text('module.exports={};')
            (root/'dist/veileder-knowledge.js').write_text("module.exports=[{id:'test',title:'Test',intro:'Et publisert svar.'}];")
            page=root/'dist/index.html'
            page.write_text('<p>'+'kompliserteord '*101+'</p>')
            result=subprocess.run(['python3',str(ROOT/'scripts/klarsprak.py'),'--root',str(root),'--output',str(root/'rapport')],capture_output=True)
            self.assertEqual(result.returncode,0,result.stderr)
            for html in ['<p>{{ukjent}}</p>', '<p data-begrep="ukjent">Fagord</p>']:
                page.write_text(html)
                with self.assertRaises(ValueError):K.measure(root)
            page.unlink()
            with self.assertRaises(ValueError):K.measure(root)

    def test_word_audit_uses_text_not_paths_or_findings(self):
        report={'blocks':[dict(block('Tilgjengelighet og tilgjengelighet.'),file='tilgjengelighet.html'),
                           dict(block('Tilgjengeligheten er bedre.'),kind='navigasjon'),
                           dict(block('tilgjengelighet'),kind='skjult')],
                'findings':[{'detail':'tilgjengelighet '*1000}]}
        audit=K.word_occurrences(report,'tilgjengelighet')
        self.assertEqual(audit['occurrences_by_kind'],{'forklaring':2,'skjult':1})
        self.assertEqual(sum(x['count'] for x in audit['locations']),3)
        with self.assertRaises(ValueError):K.word_occurrences(report,'to ord')

    def test_frozen_baseline_word_audit(self):
        report=json.loads((ROOT/'docs/klarsprak/grunnmaling.json').read_text())
        self.assertEqual(K.word_occurrences(report,'tilgjengelighet')['occurrences_by_kind'],
                         {'forklaring':8,'kode/metadata':1,'navigasjon':11,'overskrift':1})
        self.assertIn('21 av 73',K.markdown(report))
        self.assertIn('6667 ordforekomster',K.markdown(report))

    def test_deterministic_inventory(self):
        a=K.measure();b=K.measure()
        self.assertEqual(a,b)
        self.assertEqual(set(a['pages'])-{p for p in a['pages'] if '#' in p},
                         {p.relative_to(ROOT).as_posix() for p in (ROOT/'dist').rglob('*.html')})
        self.assertGreater(len(a['chapters']),0)


if __name__=='__main__':
    unittest.main()
