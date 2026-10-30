import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
spec = importlib.util.spec_from_file_location('monitor', Path(__file__).resolve().parents[1] / 'scripts/uu-monitor.py')
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)

class MonitorTests(unittest.TestCase):
    def test_normalization(self):
        self.assertEqual(m.normalize(b'{"b":2,"a":1}', 'json'), m.normalize(b'{ "a":1,"b":2}', 'json'))
        self.assertEqual(m.normalize(('<html><script>noise</script><p>'+'text '*30+'</p></html>').encode(), 'html'), ' '.join(['text']*30))
    def test_failure_preserves_baseline_and_recovery(self):
        source = {'id':'example', 'url':'https://example.org', 'kind':'json', 'role':'test'}
        def good(s): return b'{"value":1}', {}
        def changed(s): return b'{"value":2}', {}
        def bad(s): raise ValueError('incomplete')
        with tempfile.TemporaryDirectory() as folder:
            out = Path(folder)
            self.assertFalse(m.observe([source], {}, out, good))
            state = json.loads((out/'state.json').read_text())
            self.assertTrue(m.observe([source], state, out, bad))
            self.assertEqual(state, json.loads((out/'state.json').read_text()))
            self.assertFalse(m.observe([source], state, out, changed))
            row = json.loads((out/'report.json').read_text())['sources'][0]
            self.assertEqual(row['status'], 'changed'); self.assertEqual(row['review_status'], 'not_reviewed')
    def test_invalid_json_not_success(self):
        with self.assertRaises(ValueError): m.normalize(b'[]', 'json')
    def test_rule_tree_detects_body_changes(self):
        tree = {'truncated': False, 'tree': [{'type':'blob','path':'Testreglar/1.1.1/Nett/a.json','sha':'old'}, {'type':'blob','path':'README.md','sha':'ignored'}]}
        first = m.normalize(json.dumps(tree).encode(), 'json')
        tree['tree'][0]['sha'] = 'new'
        self.assertNotEqual(first, m.normalize(json.dumps(tree).encode(), 'json'))
        tree['truncated'] = True
        with self.assertRaises(ValueError): m.normalize(json.dumps(tree).encode(), 'json')
    def test_redirect_rejected(self):
        request = m.urllib.request.Request('https://example.org/a')
        with self.assertRaises(ValueError): m.SafeRedirect().redirect_request(request, None, 302, '', {}, 'https://other.org/')

if __name__ == '__main__': unittest.main()
