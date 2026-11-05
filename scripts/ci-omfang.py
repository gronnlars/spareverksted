"""Skip browser work only for a verified documentation-only pull request."""
import argparse
from pathlib import PurePosixPath
import subprocess
import sys

# Research and source data are intentionally excluded: they can feed generated pages.
ROOT_DOCS = frozenset({
    'AGENTS.md', 'CONTRIBUTING.md', 'BESLUTNINGER.md', 'KALKULATORDESIGN.md',
    'KILDEREGLER.md', 'SPRAKREGLER.md', 'KLARSPRAK.md', 'README.md',
})


def browser_required(event, base, cwd=None):
    if event != 'pull_request':
        return True

    def git(*args):
        return subprocess.check_output(['git', *args], cwd=cwd, stderr=subprocess.PIPE)

    try:
        base_sha = git('rev-parse', '--verify', '--end-of-options', base + '^{commit}').strip().decode('ascii')
        ancestor = git('merge-base', 'HEAD', base_sha).strip().decode('ascii')
        # Disable rename detection so a move out of the allowlist cannot hide either path.
        paths = git('diff', '--name-only', '--no-renames', '-z', ancestor, 'HEAD').decode('utf-8').split('\0')
        paths = [path for path in paths if path]
    except (subprocess.CalledProcessError, UnicodeError):
        print('CI-omfang: ukjent sammenligningsgrunnlag, kjører alle nettlesertester.', file=sys.stderr)
        return True
    if not paths:
        return True
    return any(path not in ROOT_DOCS and not (
        path.startswith('docs/') and PurePosixPath(path).suffix == '.md'
    ) for path in paths)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--event', required=True)
    parser.add_argument('--base', default='origin/main')
    args = parser.parse_args()
    print('true' if browser_required(args.event, args.base) else 'false')
