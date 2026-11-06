"""Prøv ekte prosesser uten å starte nettlesere eller bruke nettverk."""
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
RUNNER = ROOT / 'scripts/nettleserpar.py'
NODE = '''#!{python}
import os, sys, time
from pathlib import Path
root = Path(os.environ['PAIR_TEST_ROOT'])
engine = os.environ['SPARE_ENGINE']
assert sys.argv[1] == os.environ['PAIR_TEST_FILE']
assert os.environ['PAIR_PASSTHROUGH'] == 'beholdt'
(root / (engine + '.started')).touch()
limit = time.monotonic() + 5
while not all((root / (name + '.started')).exists() for name in ['chromium', 'firefox']):
    if time.monotonic() > limit:
        sys.exit(90)
    time.sleep(.01)
print('stdout-' + engine)
print('stderr-' + engine, file=sys.stderr)
(root / (engine + '.finished')).touch()
sys.exit(int(os.environ.get('FAIL_' + engine, '0')))
'''


class BrowserPairTests(unittest.TestCase):
    def test_engines_complete_and_errors_are_preserved(self):
        for test in ['tests/rapport-html-browser.cjs', 'tests/planer-browser.cjs', 'tests/felt-browser.cjs']:
            for failure in ['none', 'chromium', 'firefox', 'both']:
                with self.subTest(test=test, failure=failure), tempfile.TemporaryDirectory() as directory:
                    root = Path(directory)
                    node = root / 'node'
                    node.write_text(NODE.format(python=sys.executable))
                    node.chmod(0o755)
                    env = {**os.environ, 'PATH': directory, 'PAIR_TEST_ROOT': directory,
                           'PAIR_TEST_FILE': test, 'PAIR_PASSTHROUGH': 'beholdt',
                           'FAIL_chromium': '7' if failure in ['chromium', 'both'] else '0',
                           'FAIL_firefox': '8' if failure in ['firefox', 'both'] else '0'}
                    result = subprocess.run([sys.executable, str(RUNNER), test], cwd=ROOT,
                                            env=env, capture_output=True, text=True, timeout=15)
                    self.assertEqual(result.returncode, 0 if failure == 'none' else 1, result.stdout)
                    for engine in ['chromium', 'firefox']:
                        self.assertTrue((root / (engine + '.finished')).exists())
                        self.assertIn('stdout-' + engine, result.stdout)
                        self.assertIn('stderr-' + engine, result.stdout)
                        self.assertIn(f'{engine}={env["FAIL_" + engine]}', result.stdout)

    def test_missing_node_fails_both_with_logs(self):
        with tempfile.TemporaryDirectory() as directory:
            result = subprocess.run([sys.executable, str(RUNNER), 'tests/planer-browser.cjs'],
                                    cwd=ROOT, env={**os.environ, 'PATH': directory},
                                    capture_output=True, text=True, timeout=10)
            self.assertEqual(result.returncode, 1)
            self.assertIn('chromium=127 firefox=127', result.stdout)
            self.assertEqual(result.stdout.count('No such file'), 2)

    def test_unknown_group_is_rejected(self):
        result = subprocess.run([sys.executable, str(RUNNER), 'tests/personvern-browser.cjs'],
                                cwd=ROOT, capture_output=True, text=True, timeout=10)
        self.assertEqual(result.returncode, 2)
        self.assertIn('invalid choice', result.stderr)


if __name__ == '__main__':
    unittest.main()
