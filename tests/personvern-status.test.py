import importlib.util
import json
import tempfile
from pathlib import Path

spec = importlib.util.spec_from_file_location('status', Path(__file__).resolve().parents[1] / 'scripts/personvern-status.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
with tempfile.TemporaryDirectory() as directory:
    d = Path(directory)
    def seed():
        for engine in m.ENGINES:
            (d / f'{engine}.json').write_text(json.dumps(dict(schema=1, engine=engine, passed=True,
                commit='abc123', pages=['index.html'], external=[], cookies=[], requests=3,
                checkedAt='2026-10-31T10:00:00Z', browser='test', playwright='test')))
    seed()
    assert '31.10.2026 kl. 11:00' in m.render(d, 'abc123', ['index.html'])[0]
    for field, value in [('passed', False), ('commit', 'old'), ('pages', []), ('external', ['https://example.org']), ('cookies', ['tracking']), ('requests', 0)]:
        seed()
        f = d / 'webkit.json'
        r = json.loads(f.read_text()); r[field] = value; f.write_text(json.dumps(r))
        try:
            m.render(d, 'abc123', ['index.html'])
            raise AssertionError(f'Accepted invalid {field}')
        except ValueError:
            pass
    seed(); (d / 'firefox.json').unlink()
    try:
        m.render(d, 'abc123', ['index.html'])
        raise AssertionError('Accepted missing browser')
    except FileNotFoundError:
        pass
print('Privacy report: complete evidence required, stale/failed/missing results rejected.')
