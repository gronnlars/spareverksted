"""Sperren mot gammel kode (scripts/foreldet.py) i et lite git-repo med kjente tilfeller."""
import importlib.util
import pathlib
import subprocess
import tempfile

spec = importlib.util.spec_from_file_location('foreldet', pathlib.Path(__file__).resolve().parent.parent / 'scripts/foreldet.py')
foreldet = importlib.util.module_from_spec(spec)
spec.loader.exec_module(foreldet)

V1 = [f'const gammelRegel{i} = beregnGammelt(verdi, {i});' for i in range(6)]
V2 = V1[:2] + [f'const nyRegelFraMain{i} = beregnNytt(verdi, {i});' for i in range(4)]


def run(repo, *args):
    subprocess.run(('git',) + args, cwd=repo, check=True, capture_output=True)


def skriv(repo, path, linjer):
    fil = repo / path
    fil.parent.mkdir(parents=True, exist_ok=True)
    fil.write_text('\n'.join(linjer) + '\n', encoding='utf-8')


def commit(repo, melding):
    run(repo, 'add', '-A')
    run(repo, 'commit', '-q', '-m', melding)


def nytt_repo(tmp):
    repo = pathlib.Path(tmp)
    run(repo, 'init', '-q', '-b', 'main')
    run(repo, 'config', 'user.email', 'test@example.invalid')
    run(repo, 'config', 'user.name', 'Test')
    skriv(repo, 'dist/engine.js', V1)
    skriv(repo, 'tests/engine.test.cjs', ['assert.equal(beregnNytt(1, 0), 1, "motoren regner riktig");'])
    commit(repo, 'v1')
    skriv(repo, 'dist/engine.js', V2)
    commit(repo, 'v2')
    run(repo, 'checkout', '-q', '-b', 'pr')
    return repo


def sjekk(lag, ventet_feil, navn):
    with tempfile.TemporaryDirectory() as tmp:
        repo = nytt_repo(tmp)
        lag(repo)
        feil = foreldet.kontroller('main', cwd=repo)
        assert bool(feil) == ventet_feil, f'{navn}: {feil}'


sjekk(lambda r: (skriv(r, 'dist/engine.js', V2 + ['const heltNyFunksjon = () => verdi * 2;']), commit(r, 'ny linje')), False, 'vanlig endring')
sjekk(lambda r: (skriv(r, 'dist/engine.js', V1), commit(r, 'gammel motor')), True, 'hel tilbakestilling')
sjekk(lambda r: (skriv(r, 'dist/engine.js', V1 + ['const liten = justering(verdi);']), commit(r, 'gammel kopi')), True, 'delvis gammel kopi')
sjekk(lambda r: (skriv(r, 'dist/engine.js', V1), commit(r, 'tilbake til v1 [bevisst tilbakestilling]')), False, 'bevisst unntak')
sjekk(lambda r: (skriv(r, 'dist/engine.js', V1[:2]), commit(r, 'rydding')), False, 'fjerner bare nye linjer')
sjekk(lambda r: (skriv(r, 'README.md', ['tekst']), commit(r, 'utenfor')), False, 'filer utenfor områdene')
sjekk(lambda r: ((r / 'tests/engine.test.cjs').unlink(), commit(r, 'slett')), True, 'slettet test')
sjekk(lambda r: ((r / 'tests/engine.test.cjs').unlink(), commit(r, 'slett [sletter test]')), False, 'bevisst slettet test')
print('Gammel kode: 8 tilfeller stemmer (hel og delvis tilbakestilling, slettede tester, unntak, vanlige endringer).')
