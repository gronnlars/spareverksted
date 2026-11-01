"""Static deployment guard. XML namespace identifiers are not network URLs."""
from html.parser import HTMLParser
from pathlib import Path
import re

REQUIRED = {"default-src": "'self'", "script-src": "'self'", "script-src-attr": "'none'", "connect-src": "'none'", "object-src": "'none'", "base-uri": "'none'", "form-action": "'none'", "frame-src": "'none'", "worker-src": "'none'"}
class Check(HTMLParser):
    def __init__(self):
        super().__init__(); self.errors=[]; self.policies=[]; self.script=False
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='meta' and a.get('http-equiv','').lower()=='content-security-policy':
            self.policies.append(a.get('content',''))
        if tag=='script':
            self.script=True
            if not self.policies: self.errors.append('script before CSP')
            if not a.get('src'): self.errors.append('inline script')
        if tag=='base': self.errors.append('base element')
        for k,v in attrs:
            if k.startswith('on'): self.errors.append('inline event handler')
            if k in ('href','src','action','formaction','data','poster','srcset') and v:
                if re.search(r'(?:^|[\s,])(?:http:|//|javascript:)',v,re.I): self.errors.append(f'unsafe {tag}.{k}: {v}')
    def handle_endtag(self, tag):
        if tag=='script': self.script=False
    def result(self):
        if len(self.policies)!=1: self.errors.append('exactly one CSP required')
        else:
            directives={x.strip().split(' ',1)[0]:x.strip().partition(' ')[2] for x in self.policies[0].split(';') if x.strip()}
            for key,value in REQUIRED.items():
                if directives.get(key)!=value: self.errors.append('incorrect '+key)
        return self.errors

def check(text):
    parser=Check();parser.feed(text);return parser.result()

if __name__=='__main__':
    errors=[]
    root=Path(__file__).resolve().parents[1]/'dist'
    for p in root.glob('*.html'):
        errors += [p.name+': '+e for e in check(p.read_text())]
    for p in root.glob('*.css'):
        if re.search(r'(?:url\(\s*[\'\"]?|@import\s*[\'\"])(?:http:|//)',p.read_text(),re.I): errors.append(p.name+': insecure CSS resource')
    if errors: raise SystemExit('\n'.join(errors))
    print('Security: all HTML pages have early CSP; no HTTP links, resources or form destinations.')
