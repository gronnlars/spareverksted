"""Offline inventory, not network/energy measurement. Python standard library only."""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1] / 'dist'

class Resources(HTMLParser):
    def __init__(self):
        super().__init__()
        self.external = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        # Links to other pages are not downloads. Only resource references.
        keys = ['src', 'srcset'] if tag in ('script', 'img', 'iframe', 'video', 'audio', 'source', 'input', 'embed', 'track') else []
        if tag == 'link' and set(a.get('rel', '').split()) & {'stylesheet', 'preload', 'modulepreload', 'icon', 'prefetch'}:
            keys += ['href']
        if tag == 'object':
            keys += ['data']
        for key in keys:
            values = a.get(key, '').split(',') if key == 'srcset' else [a.get(key, '')]
            for value in values:
                value = value.strip().split(' ')[0]
                if urlsplit(value).netloc:
                    self.external.append({'element': tag, 'attribute': key, 'url': value})

def report():
    files = []
    pages = []
    for path in sorted(ROOT.rglob('*')):
        if not path.is_file() or path.suffix not in ('.html', '.css', '.js'):
            continue
        files.append({'path': path.relative_to(ROOT).as_posix(), 'bytes': path.stat().st_size})
        if path.suffix == '.html':
            parser = Resources()
            parser.feed(path.read_text())
            pages.append({'path': path.relative_to(ROOT).as_posix(), 'external_html_resources': parser.external})
    return {'scope': 'Uncompressed files on disk; not bytes transferred, energy or emissions. Does not execute JavaScript or inspect CSS imports/URLs.', 'files': files, 'pages': pages}

if __name__ == '__main__':
    print(json.dumps(report(), ensure_ascii=False, indent=2))
