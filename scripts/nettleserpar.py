#!/usr/bin/env python3
"""Kjør to gjennomgåtte nettleserkontroller med separate logger og samlet feilstatus."""
import argparse
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile


TESTS = {
    'tests/rapport-html-browser.cjs': 'HTML report',
    'tests/planer-browser.cjs': 'Saved plans',
    'tests/felt-browser.cjs': 'Number fields',
}
ENGINES = ('chromium', 'firefox')


def run_pair(test):
    label = TESTS[test]
    with tempfile.TemporaryDirectory(prefix='spare-browser-pair-') as directory:
        logs, processes, statuses = {}, {}, {}
        try:
            for engine in ENGINES:
                logs[engine] = Path(directory, engine + '.log').open('wb')
                try:
                    processes[engine] = subprocess.Popen(
                        ['node', test], env={**os.environ, 'SPARE_ENGINE': engine},
                        stdout=logs[engine], stderr=subprocess.STDOUT)
                except OSError as error:
                    logs[engine].write(str(error).encode('utf-8'))
                    statuses[engine] = 127
            # Start begge før vi venter. En feilet kontroll avbryter ikke den andre.
            for engine, process in processes.items():
                statuses[engine] = process.wait()
        finally:
            for process in processes.values():
                if process.poll() is None:
                    process.terminate()
                    try:
                        process.wait(timeout=5)
                    except subprocess.TimeoutExpired:
                        process.kill()
                        process.wait()
            for log in logs.values():
                log.close()
        for engine in ENGINES:
            print(f'::group::{label}: {engine}', flush=True)
            with Path(directory, engine + '.log').open('rb') as log:
                # Ingen avkorting eller sammenblanding av motorenes feilutskrift.
                shutil.copyfileobj(log, sys.stdout.buffer)
                sys.stdout.buffer.flush()
            print('\n::endgroup::', flush=True)
        print(f'{label} exit codes: ' + ' '.join(
            f'{engine}={statuses[engine]}' for engine in ENGINES), flush=True)
        return 0 if all(statuses[engine] == 0 for engine in ENGINES) else 1


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('test', choices=TESTS)
    raise SystemExit(run_pair(parser.parse_args().test))
