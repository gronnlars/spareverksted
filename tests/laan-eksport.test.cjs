// Kontrollerer at de faktiske filformatene inneholder den samme betalingsplanen som lånemotoren.
const assert=require('node:assert/strict');
const L=require('../dist/laan-motor.js'),E=require('../dist/laan-eksport.js'),K=require('../dist/export-kit.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<0.00001,`${a} != ${b}`);
for(const type of L.TYPES){
 const p=L.plan({type,amount:3000000,rate:5,years:25,establishmentFee:950,termFee:45,extraPayments:[{term:60,amount:500000}],rateChanges:[{term:100,rate:7}]});
 const sheets=E.sheets(p),monthly=E.monthly(p),yearly=E.yearly(p);
 assert.deepEqual(sheets.map(s=>s.name),['Oversikt','Forutsetninger','Per år','Per måned','Annuitet og serie']);
 assert.equal(monthly.length,p.rows.length+2);assert.equal(monthly[1][0],0);assert.equal(monthly[1][6],950);
 near(monthly.slice(1).reduce((s,r)=>s+r[6],0),p.totals.paid);
 near(monthly.slice(2).reduce((s,r)=>s+r[3]+r[4],0),p.input.amount);
 near(yearly.slice(1).reduce((s,r)=>s+r[4],0),p.totals.paid);
 assert.equal(yearly.at(-1).at(-1),0);
 const csv=K.csv(monthly);assert.equal(csv.split('\r\n').length,monthly.length);assert.ok(csv.startsWith('\ufeffTermin;'));
 const xlsx=K.workbook(sheets);assert.equal(Buffer.from(xlsx).subarray(0,2).toString(),'PK');
 const html=E.report(p);
 assert.equal((html.match(/<h1>/g)||[]).length,1);assert.match(html,/<title[^>]*>Restgjeld over tid/);assert.match(html,/<th scope="col">/);
 assert.match(html,/Før rentefradrag/);assert.match(html,/Effektiv rente er ikke beregnet/);assert.match(html,/Ønsket ekstra innbetaling etter termin 60/);assert.match(html,/Ny nominell rente fra termin 100/);
 assert.doesNotMatch(html,/<script|<button|aria-hidden|tabindex/);
}
console.log('Låneeksport: betalingsstrøm, gebyr ved utbetaling, års- og månedssummer, CSV, XLSX og rapportstruktur består.');
