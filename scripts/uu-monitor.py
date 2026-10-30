"""Bounded source observation, never a compliance assessment. Standard library only."""
import argparse
import datetime as dt
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import time
import urllib.request
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]

class Text(HTMLParser):
    def __init__(self):
        super().__init__(); self.parts = []; self.skip = 0
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'): self.skip += 1
    def handle_endtag(self, tag):
        if tag in ('script', 'style'): self.skip = max(0, self.skip - 1)
    def handle_data(self, data):
        if not self.skip: self.parts.append(data)

def normalize(raw, kind):
    value = raw.decode('utf-8-sig')
    if kind == 'json':
        data = json.loads(value)
        if not isinstance(data, dict): raise ValueError('Expected JSON object')
        if 'tree' in data:
            if data.get('truncated') is not False: raise ValueError('Incomplete Git tree')
            data = {item['path']: item['sha'] for item in data['tree'] if item.get('type') == 'blob' and item['path'].startswith('Testreglar/') and '/Nett/' in item['path'] and item['path'].endswith('.json')}
            if not data: raise ValueError('Missing web test rules')
        return json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
    parser = Text(); parser.feed(value)
    text = re.sub(r'\s+', ' ', ' '.join(parser.parts)).strip()
    if len(text) < 100: raise ValueError('Empty or unexpectedly short page')
    if any(x in text.lower() for x in ('verify you are human', 'just a moment...', 'access denied')):
        raise ValueError('Possible access barrier, not source content')
    return text

class SafeRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if urlparse(newurl).scheme != 'https' or urlparse(newurl).netloc != urlparse(req.full_url).netloc:
            raise ValueError('Cross-host or non-HTTPS redirect')
        return super().redirect_request(req, fp, code, msg, headers, newurl)

def fetch(source):
    url = source['url']
    if urlparse(url).scheme != 'https': raise ValueError('HTTPS required')
    request = urllib.request.Request(url, headers={'User-Agent': 'Spareverksted-source-monitor/1.0', 'Accept-Encoding': 'identity'})
    for attempt in range(2):
        try:
            with urllib.request.build_opener(SafeRedirect()).open(request, timeout=12) as response:
                raw = response.read(2_000_001)
                if len(raw) > 2_000_000: raise ValueError('Response exceeds 2 MB, incomplete')
                content_type = response.headers.get('Content-Type', '')
                if source['kind'] == 'json' and 'json' not in content_type: raise ValueError('Expected JSON content type')
                if source['kind'] == 'html' and 'html' not in content_type: raise ValueError('Expected HTML content type')
                return raw, {'last_modified': response.headers.get('Last-Modified'), 'etag': response.headers.get('ETag'), 'final_url': response.url}
        except (OSError, TimeoutError):
            if attempt: raise
            time.sleep(1)

def observe(sources, previous, output, fetcher=fetch):
    now = dt.datetime.now(dt.timezone.utc).isoformat()
    rows = []; state = dict(previous)
    for source in sources:
        key = source['id']; old = previous.get(key, {})
        row = {**source, 'observed_at': now}
        try:
            raw, metadata = fetcher(source)
            normalized = normalize(raw, source['kind'])
            digest = hashlib.sha256(normalized.encode()).hexdigest()
            row.update(metadata, sha256=digest, raw_sha256=hashlib.sha256(raw).hexdigest(), bytes=len(raw))
            row['status'] = 'first_observation' if not old.get('sha256') else ('changed' if old['sha256'] != digest else 'unchanged')
            row['review_status'] = 'not_reviewed' if source.get('reviewed_sha256') != digest else 'source_reviewed_not_compliance_tested'
            state[key] = {**old, 'sha256': digest, 'last_success': now}
            if key == 'uu-testregler':
                files = json.loads(normalized)
                before = old.get('files', {})
                row['changed_rule_files'] = sorted(p for p in set(files) | set(before) if files.get(p) != before.get(p))
                state[key]['files'] = files
            (output / (key + '.source')).write_bytes(raw)
        except Exception as exc:
            row.update(status='error', error=f'{type(exc).__name__}: {exc}', last_success=old.get('last_success'))
        rows.append(row)
    report = {'generated_at': now, 'code_sha': __import__('os').environ.get('GITHUB_SHA'), 'sources': rows,
              'meaning': 'Source observation only. No legal determination or accessibility approval.'}
    (output / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
    (output / 'state.json').write_text(json.dumps(state, ensure_ascii=False, indent=2))
    lines = ['# UU: kildekontroll', '', 'Dette er kildeovervåking, ikke en test eller godkjenning av Spareverksted.', '', '| Kilde | Rolle | Henting | Innholdskontroll |', '| --- | --- | --- | --- |']
    for row in rows:
        lines.append(f"| {row['id']} | {row['role']} | {row['status']} | {row.get('review_status', 'ikke utført')} |")
    for row in rows:
        if row.get('changed_rule_files'):
            lines += ['', 'Endrede eller først observerte testregelfiler:'] + ['- ' + p for p in row['changed_rule_files']]
    lines += ['', 'Endringer må vurderes mot eksisterende tester og manuelle kontroller. Utkast er ikke vedtatte standarder. Virksomhetenes erklæringer er ikke tilsynsfunn.', '', 'Se report.json og kildesnapshot i kjøringens artifact. Feil bevarer siste vellykkede observasjon.']
    (output / 'summary.md').write_text('\n'.join(lines) + '\n')
    return any(row['status'] == 'error' for row in rows)

def main():
    parser = argparse.ArgumentParser(); parser.add_argument('--previous', type=Path); parser.add_argument('--out', type=Path, default=Path('tmp/uu-monitor')); args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    sources = json.loads((ROOT / 'research/uu-monitor-sources.json').read_text())
    previous = json.loads(args.previous.read_text()) if args.previous and args.previous.exists() else {}
    raise SystemExit(1 if observe(sources, previous, args.out) else 0)

if __name__ == '__main__': main()
