"""Exercise actual git history, including renames, mixed changes and unknown bases."""
import importlib.util
from pathlib import Path
import subprocess
import tempfile

spec = importlib.util.spec_from_file_location('ci_omfang', Path(__file__).resolve().parents[1] / 'scripts/ci-omfang.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def git(repo, *args):
    return subprocess.check_output(['git', *args], cwd=repo, stderr=subprocess.PIPE)


def write(repo, name, text='new text'):
    path = repo / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)


def commit(repo):
    git(repo, 'add', '-A')
    git(repo, 'commit', '-qm', 'test')


with tempfile.TemporaryDirectory() as directory:
    repo = Path(directory)
    git(repo, 'init', '-q', '-b', 'main')
    git(repo, 'config', 'user.email', 'test@example.invalid')
    git(repo, 'config', 'user.name', 'Test')
    write(repo, 'README.md', 'initial')
    write(repo, 'docs/old.md', 'old')
    commit(repo)
    git(repo, 'checkout', '-qb', 'pr')
    assert module.browser_required('pull_request', 'main', repo), 'empty diff must run'
    for name, expected in [
        ('docs/status.md', False), ('AGENTS.md', False),
        ('dist/style.css', True), ('scripts/build.py', True),
        ('.github/workflows/static.yml', True), ('tests/check.cjs', True),
        ('kilder/fakta/rule.md', True), ('research/svarutkast/answer.md', True),
        ('docs/demo.html', True), ('unknown.md', True),
    ]:
        git(repo, 'reset', '--hard', 'main')
        write(repo, name)
        commit(repo)
        assert module.browser_required('pull_request', 'main', repo) == expected, name
    git(repo, 'reset', '--hard', 'main')
    write(repo, 'docs/status.md')
    write(repo, 'dist/app.js')
    commit(repo)
    assert module.browser_required('pull_request', 'main', repo), 'mixed change'
    git(repo, 'reset', '--hard', 'main')
    (repo / 'dist').mkdir(exist_ok=True)
    git(repo, 'mv', 'docs/old.md', 'dist/moved.md')
    commit(repo)
    assert module.browser_required('pull_request', 'main', repo), 'rename out of docs'
    git(repo, 'reset', '--hard', 'main')
    git(repo, 'rm', 'docs/old.md')
    commit(repo)
    assert not module.browser_required('pull_request', 'main', repo), 'documentation deletion'
    assert module.browser_required('push', 'main', repo), 'main push always runs'
    assert module.browser_required('workflow_dispatch', 'main', repo), 'other events always run'
    assert module.browser_required('pull_request', 'missing-base', repo), 'unknown base fails closed'
    # A base branch changed after the PR diverged: inspect the whole PR from merge-base.
    git(repo, 'checkout', '-q', 'main')
    write(repo, 'dist/main.js')
    commit(repo)
    git(repo, 'checkout', '-q', 'pr')
    assert not module.browser_required('pull_request', 'main', repo), 'unrelated newer main'
print('CI-omfang: 18 git-tilfeller bestod.')
