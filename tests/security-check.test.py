import importlib.util
from pathlib import Path
s=importlib.util.spec_from_file_location('security',Path(__file__).resolve().parents[1]/'scripts/security-check.py')
m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
page=(Path(__file__).resolve().parents[1]/'dist/index.html').read_text()
assert not m.check(page)
for fragment in ['<a href="http://spareverksted.no/">bad</a>','<form action="http://example.org/">','<button formaction="http://example.org/">','<img src="//example.org/a">','<img onerror="alert(1)">','<script>alert(1)</script>']:
 assert m.check(page+fragment),fragment
assert m.check(page.replace("form-action 'none'", "form-action 'self'"))
assert m.check(page.replace('<head>','<head><script src="theme.js"></script>'))
print('Security guards reject injected HTTP links/forms, inline code and weakened policy.')
