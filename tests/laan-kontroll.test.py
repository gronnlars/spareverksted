"""Uavhengig kontroll av lånemotoren (dist/laan-motor.js).

Regnereglene i docs/laanemodell.md er skrevet på nytt her i Python med Decimal (40 sifre), uten å lese
JavaScript-koden. Begge regner de samme planene, og terminene, restgjelden og summene sammenlignes, også ved
svært lave renter der flyttall mister presisjon.
Kontrollen går på gjeldsbalansen og betalingene, ikke på grafen.

  python3 tests/laan-kontroll.test.py
"""
import json
import random
import subprocess
from decimal import Decimal as D, getcontext
from pathlib import Path

getcontext().prec = 40
ROOT = Path(__file__).resolve().parent.parent


def annuitet(saldo, i, n):
    if i == 0:
        return saldo / n
    return saldo * i / (1 - (1 + i) ** -n)


def gjenstaende_terminer(saldo, i, belop):
    """Minste antall hele terminer som betaler ned saldoen med fast terminbeløp."""
    k = 0
    while saldo > 0:
        k += 1
        saldo = saldo * (1 + i) - belop
    return k


def nedbetaling(s):
    n = round(s['years'] * 12)
    laan = D(repr(s['amount']))
    saldo = laan
    arsrente = D(repr(s['rate']))
    endringer = {e['term']: D(repr(e['rate'])) for e in s['rateChanges']}
    ekstra = {}
    for e in s['extraPayments']:
        ekstra[e['term']] = ekstra.get(e['term'], D(0)) + D(repr(e['amount']))
    gebyr = D(repr(s['termFee']))
    slutt = n
    serie_avdrag = laan / n
    termin_belop = annuitet(saldo, arsrente / 1200, n)
    rader = []
    k = 0
    while saldo > 0 and k < slutt:
        k += 1
        if k in endringer:
            arsrente = endringer[k]
            if s['type'] == 'annuitet':
                termin_belop = annuitet(saldo, arsrente / 1200, slutt - k + 1)
        i = arsrente / 1200
        rente = saldo * i
        avdrag = termin_belop - rente if s['type'] == 'annuitet' else serie_avdrag
        if k == slutt or avdrag >= saldo:
            avdrag = saldo
        saldo -= avdrag
        brukt = min(ekstra.get(k, D(0)), saldo)
        saldo -= brukt
        if saldo > 0 and brukt > 0:
            if s['type'] == 'annuitet':
                slutt = k + gjenstaende_terminer(saldo, i, termin_belop)
            else:
                hele, rest = divmod(saldo, serie_avdrag)
                slutt = k + int(hele) + (1 if rest > laan * D('1e-15') else 0)
        rader.append({'rente': rente, 'avdrag': avdrag, 'ekstra': brukt, 'saldo': saldo, 'gebyr': gebyr})
    sum_rente = sum(r['rente'] for r in rader)
    gebyrer = D(repr(s['establishmentFee'])) + gebyr * len(rader)
    return rader, {'interest': sum_rente, 'fees': gebyrer, 'paid': laan + sum_rente + gebyrer}


def scenarier():
    faste = [
        {'type': 'annuitet', 'amount': 3000000, 'rate': 5, 'years': 25},
        {'type': 'serie', 'amount': 3000000, 'rate': 5, 'years': 25},
        {'type': 'annuitet', 'amount': 120000, 'rate': 0, 'years': 10},
        {'type': 'serie', 'amount': 100000, 'rate': 12, 'years': 1 / 12},
        {'type': 'annuitet', 'amount': 3000000, 'rate': 5, 'years': 25, 'rateChanges': [{'term': 60, 'rate': 7}], 'extraPayments': [{'term': 60, 'amount': 500000}]},
        {'type': 'serie', 'amount': 3000000, 'rate': 5, 'years': 25, 'rateChanges': [{'term': 61, 'rate': 7}], 'extraPayments': [{'term': 60, 'amount': 500000}]},
        {'type': 'annuitet', 'amount': 3000000, 'rate': 5, 'years': 25, 'extraPayments': [{'term': 60, 'amount': 500000}], 'rateChanges': [{'term': 100, 'rate': 7}]},
        {'kind': 'forbruk', 'type': 'annuitet', 'amount': 100000, 'rate': 12, 'years': 5, 'establishmentFee': 950, 'termFee': 45, 'extraPayments': [{'term': 30, 'amount': 1e9}]},
        {'type': 'serie', 'amount': 450000, 'rate': 7.5, 'years': 7, 'termFee': 50, 'extraPayments': [{'term': 24, 'amount': 1e9}]},
    ]
    # Svært lave renter (GPT 3.11.2026): den naive annuitetsformelen mistet presisjon her.
    for rente in (1e-15, 1e-12, 1e-10, 1e-8, 1e-6, 1e-4):
        for type_ in ('annuitet', 'serie'):
            faste.append({'type': type_, 'amount': 3000000, 'rate': rente, 'years': 25})
            faste.append({'type': type_, 'amount': 3000000, 'rate': rente, 'years': 25, 'extraPayments': [{'term': 60, 'amount': 500000}]})
            faste.append({'type': type_, 'amount': 3000000, 'rate': 5, 'years': 25, 'rateChanges': [{'term': 100, 'rate': rente}]})
    tilfeldig = random.Random(2026)
    for c in range(60):
        n = max(1, tilfeldig.randint(1, 480))
        s = {'type': ('annuitet', 'serie')[c % 2], 'amount': round(tilfeldig.uniform(1000, 5e6), 2),
             'rate': round(tilfeldig.uniform(0, 20), 3), 'years': n / 12,
             'establishmentFee': tilfeldig.choice([0, 950]), 'termFee': tilfeldig.choice([0, 45])}
        if tilfeldig.random() < .6:
            s['rateChanges'] = [{'term': tilfeldig.randint(1, n), 'rate': round(tilfeldig.uniform(0, 15), 3)}]
        if tilfeldig.random() < .6:
            s['extraPayments'] = [{'term': tilfeldig.randint(1, n), 'amount': round(tilfeldig.uniform(1, 2e6), 2)}]
        faste.append(s)
    return [{'kind': 'bolig', 'establishmentFee': 0, 'termFee': 0, 'rateChanges': [], 'extraPayments': [], **s} for s in faste]


def main():
    alle = scenarier()
    skript = "const L=require(process.argv[1]);const a=JSON.parse(require('fs').readFileSync(0,'utf8'));" \
             "process.stdout.write(JSON.stringify(a.map(s=>{const p=L.plan(s);return {rows:p.rows,totals:p.totals};})));"
    ut = subprocess.run(['node', '-e', skript, str(ROOT / 'dist/laan-motor.js')], input=json.dumps(alle),
                        capture_output=True, text=True, check=True).stdout
    js = json.loads(ut)
    for nr, (s, svar) in enumerate(zip(alle, js)):
        rader, sum_ = nedbetaling(s)
        navn = f'scenario {nr} ({s["type"]})'
        assert len(rader) == len(svar['rows']), f'{navn}: {len(rader)} terminer i Python, {len(svar["rows"])} i motoren'
        grense = D(repr(s['amount'])) * D('1e-9') + D('1e-6')
        for k, (p, j) in enumerate(zip(rader, svar['rows']), start=1):
            for a, b in (('saldo', 'balance'), ('rente', 'interest'), ('avdrag', 'principal'), ('ekstra', 'extra'), ('gebyr', 'fee')):
                assert abs(p[a] - D(repr(j[b]))) <= grense, f'{navn}, termin {k}, {a}: {p[a]} mot {j[b]}'
        for a in ('interest', 'fees', 'paid'):
            assert abs(sum_[a] - D(repr(svar['totals'][a]))) <= grense * 10, f'{navn}, {a}: {sum_[a]} mot {svar["totals"][a]}'
        assert rader[-1]['saldo'] == 0
    # Eksemplet i planen og BESLUTNINGER.md, regnet med lukket formel.
    i = D(5) / 1200
    a = annuitet(D(3000000), i, 300)
    assert round(a) == 17538 and round(a * 300 - 3000000) == 2261310
    assert round(D(3000000) * i * 301 / 2) == 1881250
    # Ved svært lav rente skal betalingsforløpet ligge tett på nullrentetilfellet: 10 000 kr per termin.
    for nr, (s, svar) in enumerate(zip(alle, js)):
        if s['rate'] <= 1e-6 and not s['rateChanges'] and not s['extraPayments'] and s['amount'] == 3000000:
            for r in svar['rows']:
                assert abs(r['payment'] - 10000) < 0.01, f'scenario {nr}, rente {s["rate"]} %, termin {r["term"]}: {r["payment"]}'
    print(f'Uavhengig kontroll av lånemotoren: {len(alle)} planer stemmer termin for termin.')


if __name__ == '__main__':
    main()
