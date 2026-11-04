// Navngitte øyeblikksbilder. Regn fra forutsetningene når rapporten åpnes.
window.LoanReports={
 attach({exportPlan,download}){
  const get=id=>document.getElementById(id);
  const key='sv-loan-plans-v1';
  const selected=new Set();
  const status=message=>{get('loanStatus').textContent=message;};
  function element(tag,text){
   const node=document.createElement(tag);
   if(text!==undefined)node.textContent=text;
   return node;
  }
  function read(){
   const records=JSON.parse(localStorage.getItem(key)||'[]');
   if(!Array.isArray(records))throw Error('Uleselig liste');
   if(records.some(entry=>!entry||typeof entry.name!=='string'||typeof entry.id!=='string'||!entry.input))throw Error('Uleselig plan');
   return records;
  }
  function updateButtons(){
   get('compareLoans').disabled=get('excelLoans').disabled=!selected.size;
  }
  function list(){
   const container=get('loanList');
   container.replaceChildren();
   try{
    const records=read();
    for(const id of selected)if(!records.some(r=>r.id===id))selected.delete(id);
    for(const entry of records){
     const row=document.createElement('div'),label=document.createElement('label');
     const check=document.createElement('input'),remove=document.createElement('button');
     check.type='checkbox';check.checked=selected.has(entry.id);
     check.onchange=()=>{if(check.checked)selected.add(entry.id);else selected.delete(entry.id);updateButtons();};
     label.append(check,' '+entry.name);
     remove.type='button';remove.textContent='Slett';remove.setAttribute('aria-label','Slett '+entry.name);
     remove.onclick=()=>{
      if(!confirm('Slette «'+entry.name+'»?'))return;
      try{
       const remaining=read().filter(r=>r.id!==entry.id);
       if(remaining.length)localStorage.setItem(key,JSON.stringify(remaining));else localStorage.removeItem(key);
       list();get('loanName').focus();status('Planen er slettet.');
      }catch{status('Kunne ikke slette planen.');}
     };
     row.append(label,remove);container.append(row);
    }
   }catch{selected.clear();status('Kunne ikke lese lagrede låneplaner.');}
   updateButtons();
  }
  get('saveLoan').onclick=()=>{
   const p=exportPlan();if(!p)return;
   try{
    const records=read(),id=crypto.randomUUID();
    const name=get('loanName').value.trim()||'Låneplan '+(records.length+1);
    records.push({id,name,input:p.input});
    localStorage.setItem(key,JSON.stringify(records));selected.add(id);
    get('loanName').value='';list();status('Lagret «'+name+'».');
   }catch{status('Kunne ikke lagre planen. Du kan laste ned beregningen i stedet.');}
  };
  function withPlans(action){
   try{
    const plans=read().filter(r=>selected.has(r.id)).map(r=>({name:r.name,plan:LaanMotor.plan(r.input)}));
    if(!plans.length){list();return;}
    action(plans);
   }catch{status('Kunne ikke lage rapporten fra de valgte planene.');}
  }
  function comparison(plans){
   const rows=[['Plan','Lånebeløp (kr)','Første betaling inkl. gebyr (kr)','Renter og gebyrer (kr)','Samlet tilbakebetaling (kr)','Antall måneder']];
   for(const {name,plan} of plans.slice(0,3))rows.push([name,plan.input.amount,plan.rows[0].total,plan.totals.interest+plan.totals.fees,plan.totals.paid,plan.payoffTerm]);
   return rows;
  }
  function balanceChart(plans,prefix){
   const shown=plans.slice(0,3);
   const months=Math.max(...shown.map(r=>r.plan.payoffTerm));
   const amount=Math.max(...shown.map(r=>r.plan.input.amount));
   const patterns=['','9 4','2 4'];
   const ns='http://www.w3.org/2000/svg';
   const svg=document.createElementNS(ns,'svg');
   svg.setAttribute('viewBox','0 0 600 188');svg.setAttribute('role','img');
   svg.setAttribute('aria-labelledby',prefix+'BalanceTitle');
   const title=document.createElementNS(ns,'title');title.id=prefix+'BalanceTitle';
   title.textContent='Restgjeld i løpende kroner';svg.append(title);
   shown.forEach(({plan},i)=>{
    const line=document.createElementNS(ns,'polyline');
    const balances=[plan.input.amount,...plan.rows.map(row=>row.balance)];
    const points=balances.map((balance,month)=>(24+month/months*552).toFixed(2)+','+(20+(1-balance/amount)*140).toFixed(2));
    line.setAttribute('points',points.join(' '));line.setAttribute('fill','none');
    line.setAttribute('stroke','currentColor');line.setAttribute('stroke-width','3');
    if(patterns[i])line.setAttribute('stroke-dasharray',patterns[i]);
    svg.append(line);
   });
   const styles=['Heltrukket','Lang stipling','Kort stipling'];
   const legend=shown.map(({name,plan},i)=>styles[i]+': '+name+', fra '+LaanTekst.money(plan.input.amount)+' til null etter '+plan.payoffTerm+' måneder.').join(' ');
   const figure=element('figure');
   figure.append(svg,element('figcaption','Fra utbetaling til '+months+' måneder. Samme skala fra null til '+LaanTekst.money(amount)+'. '+legend));
   return figure;
  }
  get('compareLoans').onclick=()=>withPlans(plans=>{
   const [titles,...rows]=comparison(plans);
   for(const [id,prefix] of [['reportPreview','savedPreview'],['printReportContent','savedPrint']]){
    const root=get(id);root.replaceChildren(element('h1','Valgte låneplaner'),element('p','De tre første valgte planene sammenlignes i løpende kroner før rentefradrag. Hver plan følger med sine egne forutsetninger.'),element('h2','Restgjeld over tid'),balanceChart(plans,prefix));
    for(const row of rows){
     const list=element('dl');list.className='report-assumptions';
     for(let i=1;i<row.length;i++){
      const pair=element('div');
      pair.append(element('dt',titles[i]),element('dd',i===row.length-1?row[i]:LaanTekst.money(row[i])));
      list.append(pair);
     }
     root.append(element('h2',row[0]),list);
    }
    plans.forEach(({name,plan},i)=>{
     const detail=element('div');
     detail.innerHTML=LaanEksport.report(plan,prefix+i);
     for(const h of detail.querySelectorAll('h1,h2,h3')){
      h.replaceWith(element('h'+(Number(h.tagName[1])+1),h.tagName==='H1'?name:h.textContent));
     }
     root.append(detail);
    });
   }
   get('reportDialog').showModal();
  });
  get('excelLoans').onclick=()=>withPlans(plans=>{
   const sheets=[{name:'Sammenligning',rows:comparison(plans)}];
   plans.forEach(({name,plan},i)=>{
    for(const sheet of LaanEksport.sheets(plan))sheets.push({name:(i+1)+' '+sheet.name,rows:[['Plan',name],...sheet.rows]});
   });
   download(ExportKit.workbook(sheets),'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','valgte-laaneplaner.xlsx');
  });
  addEventListener('storage',event=>{if(!event.key||event.key===key)list();});
  list();
 }
};
