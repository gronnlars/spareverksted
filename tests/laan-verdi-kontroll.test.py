"""Uavhengig Decimal-kontroll av prisjustering, rad for rad. Ingen JS-visningsformel gjenbrukes."""
import json, subprocess
from decimal import Decimal, localcontext
plans=json.loads(subprocess.check_output(['node','-e',"""
const L=require('./dist/laan-motor.js'),V=require('./dist/laan-visning.js');const out=[];
for(const type of L.TYPES)for(const inflation of [0,2.5,25,100])for(const years of [1/12,2,50]){
const p=L.plan({type,amount:100000,rate:5,years,establishmentFee:700,termFee:30,real:true,inflation,
...(years>2?{rateChanges:[{term:14,rate:7}],extraPayments:[{term:25,amount:20000}]}:{})});out.push({nominal:p,display:V.present(p)});
}console.log(JSON.stringify(out));
"""],text=True))
with localcontext() as ctx:
    ctx.prec=60
    for case in plans:
        p,d=case['nominal'],case['display']
        price=Decimal(1)+Decimal(str(p['input']['inflation']))/100
        total=Decimal(str(p['input']['establishmentFee']))
        for r,v in zip(p['rows'],d['rows']):
            discount=price ** (-Decimal(r['term'])/12)
            for key in ['interest','principal','fee','extra','payment','total','balance']:
                expected=Decimal(str(r[key]))*discount
                assert abs(Decimal(str(v[key]))-expected)<max(Decimal('0.0000001'),abs(expected)*Decimal('1e-11')),(key,r['term'])
            total+=Decimal(str(r['total']))*discount
        assert abs(Decimal(str(d['totals']['paid']))-total)<Decimal('0.00001')
print(f'Prisjustering: {len(plans)} planer kontrollert uavhengig med Decimal, også én termin, 50 år, hendelser og 100 % prisvekst.')
