#!/usr/bin/env python3
"""Egenkontroll av SV-022. Ingen nettverk, skriving eller innholdsgodkjenning."""
import json
import re
import subprocess
from decimal import Decimal as D, ROUND_HALF_UP
from urllib.parse import parse_qs, urlsplit

import fakta
import svar


def require(ok, message):
    if not ok:
        raise ValueError(message)


def check():
    root = svar.ROOT
    a = svar.read(root / 'kilder/svar/SV-022.md')
    reg = fakta.load(root)
    warnings = svar.validate(a, reg)
    require(not warnings, str(warnings))
    e = a['entry']
    p = D('10000')
    first, second = p * D('1.05'), p * D('1.05') ** 2
    interest = second - first
    compound = (first - p) * D('.05')
    paid_out = p * D('.05') * 2
    nominal = p * D('1.02') ** 2
    purchasing_power = nominal / D('1.025') ** 2
    loss = p * D('1.10') * D('.90')
    require((first, second, interest, compound, paid_out, nominal, loss) ==
            tuple(map(D, ['10500', '11025', '525', '25', '1000', '10404', '9900'])),
            'Desimalberegningene avviker')
    rounded = purchasing_power.quantize(D('1'), rounding=ROUND_HALF_UP)
    require(rounded == 9903 and nominal > p and purchasing_power < p,
            'Kroner og kjøpekraft må gå i hver sin retning i kontrasten')
    require(first - p == 500 and p + paid_out == 11000,
            'Uttakskontrasten må beholde innskuddet og telle utbetalte renter separat')
    require(11000 - 9900 == 1100 and 11000 - 10000 == 1000,
            'Ti prosent opp og ned må ha ulike beregningsgrunnlag')

    # Kontroller de faktiske lenkene, ikke et nytt sett inndata skrevet ved siden av dem.
    links = [e['next']['href'], e['next']['more'][0]['href']]
    plans = []
    for link, rate, inflation, both in zip(links, ['5', '2'], ['0', '2.5'], ['0', '1']):
        parsed = urlsplit(link)
        require(parsed.path == 'index.html', 'Lenken må peke til kalkulatoren')
        params = parse_qs(parsed.fragment, keep_blank_values=True)
        require(all(len(v) == 1 for v in params.values()), 'Dupliserte lenkeparametre')
        params = {k: v[0] for k, v in params.items()}
        expected = dict(start='10000', monthly='0', years='2', rate=rate, fee='0',
                        inflation=inflation, growth='0', extra='0', crash='0',
                        activePage='calculator', savingsType='', real='0', both=both,
                        showBank='0', showRange='0', showGoal='0')
        require(all(params.get(k) == v for k, v in expected.items()),
                'Lenkens forutsetninger avviker fra svaret')
        require(not set(params) & {'userAge', 'riskChosen', 'ageGroup'},
                'Eksemplet skal ikke sende personopplysninger')
        plans.append({k: float(params[k]) for k in
                      ('start', 'monthly', 'years', 'rate', 'fee', 'inflation',
                       'growth', 'extra', 'crash')})
    node = """
const E=require('./dist/engine.js');
const plans=JSON.parse(require('node:fs').readFileSync(0,'utf8'));
console.log(JSON.stringify(plans.map(p=>{
 const s={...E.defaults,...p}; E.validate(s);
 const value=E.value(s,s.years);
 return {value,real:value/(1+s.inflation/100)**s.years};
})));
"""
    engine = json.loads(subprocess.check_output(['node', '-e', node], cwd=root,
                                                input=json.dumps(plans), text=True))
    for result, expected in zip(engine, [second, nominal]):
        require(abs(D(str(result['value'])) - expected) < D('.000001'),
                'Kalkulatormotoren avviker fra desimalberegningen')
    require(abs(D(str(engine[1]['real'])) - purchasing_power) < D('.000001'),
            'Motorens kjøpekraft avviker fra desimalberegningen')

    # Bevis at malen gir ønsket offentlig form uten å late som at svaret er godkjent.
    require(e['kind'] == 'explainer' and e['layout'] == 'overview', 'Feil svarform')
    require('tradeoffs' not in e and 'options' not in e, 'Regnemåte skal ikke ha valgkort')
    require(e['intro'].startswith('{{begrep:renters-rente}}'), 'Bruk registerdefinisjonen')
    public = [e['intro'], e['example']['text'], *[x['text'] for x in e['parts']]]
    definition = next(b['definisjon'] for b in reg['begreper'] if b['id'] == 'renters-rente')
    public[0] = public[0].replace('{{begrep:renters-rente}}', definition)
    words = sum(len(x.split()) for x in public)
    require(words <= 300, f'Svarteksten er {words} ord, over målet på 300')
    require(len(public[0].split()) <= 60 and len(e['example']['text'].split()) <= 80,
            'Kort svar eller eksempel overstiger veiledende lengde')
    require(not any(re.search(r'\[P\d|Kontrollregning:|Publiseringssperrer', x)
                    for x in public), 'Interne felt har lekket til offentlig tekst')
    if a['fields'][1]['Status'] not in svar.READY:
        require(e['id'] not in svar.runtime([a]), 'Ikke godkjent svar må ikke genereres')
    # Bind den kontrollerte regningen til tallene som faktisk står i kandidatteksten.
    number = r'(?<![\w])\d+(?:[ \u00a0]\d{3})*(?:,\d+)?(?: ?%)?'
    expected_numbers = [
        ['10 000', '5 %', '10 500', '11 025', '525', '25'],
        ['500', '10 000', '1 000'],
        ['2 %', '10 000', '10 404', '2,5 %', '9 903'],
        ['10 000', '10 %', '10 %', '9 900'],
        ['1', '100', '5'],
    ]
    for text, expected in zip([e['example']['text'], *[p['text'] for p in e['parts']]], expected_numbers):
        require(re.findall(number, text) == expected, 'Offentlig tekst har andre tall enn kontrollregningen')
    print(f'SV-022: desimalregning, to lenker, motorparitet og feltkobling OK. {words} ord.')
    print(f'Kjøpekraft før avrunding: {purchasing_power:.9f}. Ingen faglig godkjenning.')


if __name__ == '__main__':
    check()
