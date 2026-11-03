"""Sperre mot gammel kode: stopper endringer som legger tilbake en eldre versjon av en fil.

  python3 scripts/foreldet.py --base origin/main     sjekk alt som er endret siden base (PR i CI)
  python3 scripts/foreldet.py --base <sha>           sjekk et push mot forrige main (CI på main)

Bakgrunn (3.11.2026): En modell som jobber fra en gammel kopi kan laste opp en eldre motor (engine.js, app.js,
tester) over nyere arbeid. Git slår gjerne sammen uten konflikt, og testene kan være gamle de også. Derfor ser
dette skriptet på historikken, ikke på innholdet alene.

Tre kontroller for filer under dist/, scripts/, tests/, kilder/ og .github/:
  1. Hel tilbakestilling: fila er byte for byte lik en tidligere versjon fra main, men ikke dagens.
  2. Delvis gammel kopi: endringen legger tilbake minst GRENSE linjer som main har fjernet, og fjerner samtidig
     minst GRENSE linjer som main har lagt til. Det er kjennetegnet på å ha limt inn en gammel fil.
  3. Slettede tester: en fil under tests/ forsvinner.

Er tilbakestillingen bevisst, skriv [bevisst tilbakestilling] (eller [sletter test]) i en commit-melding.
Bare standardbiblioteket og git. CI henter hele historikken (fetch-depth: 0). Se AGENTS.md, «Gammel kode».
"""
import subprocess
import sys

OMRADER = ('dist/', 'scripts/', 'tests/', 'kilder/', '.github/')
GRENSE = 3
MINSTE_LINJE = 12  # korte linjer som «}» eller «</div>» sier ingenting om alder
DAGER = 120
UNNTAK = '[bevisst tilbakestilling]'
UNNTAK_TEST = '[sletter test]'


def git(*args, cwd=None):
    return subprocess.run(('git',) + args, cwd=cwd, check=True, capture_output=True, text=True).stdout


def blob(ref, path, cwd):
    try:
        return git('rev-parse', f'{ref}:{path}', cwd=cwd).strip()
    except subprocess.CalledProcessError:
        return None


def historikk(base, path, cwd):
    """Alle tidligere innhold (blob) av fila på base, med dato og commit."""
    tidligere = {}
    for linje in git('log', '--format=@%h %cs', '--raw', '--no-abbrev', '--no-renames', base, '--', path, cwd=cwd).splitlines():
        if linje.startswith('@'):
            sha, dato = linje[1:].split()
            commit = f'{sha[:9]} fra {dato}'
        elif linje.startswith(':'):
            ny = linje.split()[3]
            tidligere.setdefault(ny, commit)
    return tidligere


def linjer(tekst, plus):
    return {l[1:].strip() for l in tekst.splitlines()
            if l.startswith(plus) and not l.startswith(plus * 3) and len(l[1:].strip()) >= MINSTE_LINJE}


def kontroller(base, head='HEAD', cwd=None):
    feil = []
    meldinger = git('log', '--format=%B', f'{base}..{head}', cwd=cwd)
    bevisst = UNNTAK in meldinger
    for status_linje in git('diff', '--name-status', '--no-renames', f'{base}...{head}', cwd=cwd).splitlines():
        status, path = status_linje.split('\t', 1)
        if not path.startswith(OMRADER):
            continue
        if status == 'D':
            if path.startswith('tests/') and UNNTAK_TEST not in meldinger and not bevisst:
                feil.append(f'{path} er slettet. Tester skal ikke forsvinne. Bevisst? Skriv {UNNTAK_TEST} i commit-meldingen.')
            continue
        if bevisst:
            continue
        ny, dagens = blob(head, path, cwd), blob(base, path, cwd)
        if ny is None or ny == dagens:
            continue
        gamle = historikk(base, path, cwd)
        if ny in gamle:
            feil.append(f'{path} er identisk med en eldre versjon (commit {gamle[ny]}), ikke dagens main. '
                        'Du jobber trolig fra en gammel kopi. Hent fersk main og gjør endringen på nytt.')
            continue
        endring = git('diff', '-U0', f'{base}...{head}', '--', path, cwd=cwd)
        main_nylig = git('log', f'--since={DAGER} days ago', '-p', '-U0', '--format=', base, '--', path, cwd=cwd)
        tilbake = linjer(endring, '+') & linjer(main_nylig, '-')
        fjernet = linjer(endring, '-') & linjer(main_nylig, '+')
        if len(tilbake) >= GRENSE and len(fjernet) >= GRENSE:
            eksempel = sorted(tilbake, key=len)[-1][:90]
            feil.append(f'{path} ser ut som en gammel kopi: endringen legger tilbake {len(tilbake)} linjer som main har '
                        f'fjernet og fjerner {len(fjernet)} linjer som main har lagt til (f.eks. «{eksempel}»). '
                        'Hent fersk main og gjør bare den endringen du trenger.')
    return feil


def main(argv):
    base = argv[argv.index('--base') + 1] if '--base' in argv else 'origin/main'
    if set(base) <= {'0'}:  # første push til en ny gren har ingen forrige versjon
        print('Gammel kode: ingen forrige versjon å sammenligne med.')
        return 0
    feil = kontroller(base)
    if feil:
        print('Stoppet: endringen ser ut til å bygge på gammel kode.\n- ' + '\n- '.join(feil), file=sys.stderr)
        print(f'\nEr tilbakestillingen bevisst og godkjent av Lars, skriv {UNNTAK} i commit-meldingen.', file=sys.stderr)
        return 1
    print('Gammel kode: ingen filer legger tilbake eldre versjoner fra main.')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
