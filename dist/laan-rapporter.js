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
  let planCount=0;
  function updateButtons(){
   get('loanDownloadRow').hidden=planCount===0;
   // «Last ned planene» med antall når noen er valgt, «Last ned planen» når bare én er med (Lars 4.11.2026, korte ord).
   const count=selected.size||planCount;
   get('downloadLoans').textContent=(count===1?'Last ned planen':'Last ned planene')+(selected.size>1?' ('+selected.size+')':'');
  }
  function list(){
   const container=get('loanList');
   container.replaceChildren();
   try{
    const records=read();
    planCount=records.length;
    for(const id of selected)if(!records.some(r=>r.id===id))selected.delete(id);
    for(const entry of records){
     const row=document.createElement('div'),label=document.createElement('label');
     const check=document.createElement('input'),remove=document.createElement('button');
     row.className='saved-row';label.className='check';
     check.type='checkbox';check.checked=selected.has(entry.id);
     check.onchange=()=>{if(check.checked)selected.add(entry.id);else selected.delete(entry.id);updateButtons();};
     label.append(check,' '+entry.name);
     remove.type='button';remove.textContent='Slett';remove.setAttribute('aria-label','Slett '+entry.name);
     remove.onclick=()=>{
      if(!confirm('Slette «'+entry.name+'»?'))return;
      try{
       const remaining=read().filter(r=>r.id!==entry.id);
       if(remaining.length)localStorage.setItem(key,JSON.stringify(remaining));else localStorage.removeItem(key);
       list();get('saveLoan').focus();status('Planen er slettet.');
      }catch{status('Kunne ikke slette planen.');}
     };
     row.append(label,remove);container.append(row);
    }
   }catch{planCount=0;selected.clear();status('Kunne ikke lese lagrede låneplaner.');}
   updateButtons();
  }
  function freeName(base,records){
   const names=new Set(records.map(r=>r.name.trim().toLocaleLowerCase('nb-NO')));
   let name=base;
   for(let n=1;names.has(name.toLocaleLowerCase('nb-NO'));n++)name=base.replace(/\s*\(\d+\)$/,'')+' ('+n+')';
   return name;
  }
  let pending=null;
  get('saveLoan').onclick=()=>{
   pending=exportPlan();if(!pending)return;
   try{
    const base={bolig:'Hus',bil:'Bil',forbruk:'Forbrukslån'}[pending.input.kind];
    get('loanName').value=freeName(base,read());
    get('loanSaveError').hidden=true;
    get('loanSaveDialog').showModal();get('loanName').select();
   }catch{status('Kunne ikke lese lagrede planer.');}
  };
  get('cancelLoan').onclick=()=>get('loanSaveDialog').close();
  get('loanSaveDialog').addEventListener('close',()=>{pending=null;});
  get('loanSaveForm').onsubmit=event=>{
   event.preventDefault();
   const wanted=get('loanName').value.trim();
   if(!wanted){get('loanName').value='';get('loanName').reportValidity();return;}
   try{
    const records=read(),name=freeName(wanted,records);
    records.push({id:crypto.randomUUID(),name,input:pending.input});
    localStorage.setItem(key,JSON.stringify(records));
    get('loanSaveDialog').close();list();status('Lagret «'+name+'».');
   }catch{get('loanSaveError').textContent='Kunne ikke lagre planen i nettleseren.';get('loanSaveError').hidden=false;}
  };
  get('downloadLoans').onclick=()=>{
   get('bundleCount').textContent='Antall planer i rapporten: '+(selected.size||planCount)+'.';
   get('loanBundleDialog').showModal();
  };
  get('closeBundle').onclick=()=>get('loanBundleDialog').close();
  function withPlans(action){
   try{
    const plans=read().filter(r=>!selected.size||selected.has(r.id)).map(r=>({name:r.name,plan:LaanMotor.plan(r.input)}));
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
   // role=group: <figure> blir ellers et eget figurmerke uten tekstalternativ i PDF-en. Grafen inni har eget navn.
   const figure=element('figure');figure.setAttribute('role','group');
   figure.append(svg,element('figcaption','Fra utbetaling til '+months+' måneder. Samme skala fra null til '+LaanTekst.money(amount)+'. '+legend));
   return figure;
  }
  get('compareLoans').onclick=()=>withPlans(plans=>{
   const [titles,...rows]=comparison(plans);
   for(const [id,prefix] of [['reportPreview','savedPreview'],['printReportContent','savedPrint']]){
    const root=get(id);root.replaceChildren(element('h1','Lagrede låneplaner'),element('p','De tre første planene i rapporten sammenlignes i løpende kroner før rentefradrag. Hver plan følger etterpå med sine egne forutsetninger.'),element('h2','Planene sammenlignet'),element('h3','Restgjeld over tid'),balanceChart(plans,prefix));
    for(const row of rows){
     const list=element('dl');list.className='report-assumptions';
     for(let i=1;i<row.length;i++){
      const pair=element('div');
      pair.append(element('dt',titles[i]),element('dd',i===row.length-1?row[i]:LaanTekst.money(row[i])));
      list.append(pair);
     }
     root.append(element('h3',row[0]),list);
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
   get('loanBundleDialog').close();get('downloadLoans').focus();get('reportDialog').showModal();
  });
  get('excelLoans').onclick=()=>withPlans(plans=>{
   const sheets=[{name:'Sammenligning',rows:comparison(plans)}];
   plans.forEach(({name,plan},i)=>{
    for(const sheet of LaanEksport.sheets(plan))sheets.push({name:(i+1)+' '+sheet.name,rows:[['Plan',name],...sheet.rows]});
   });
   download(ExportKit.workbook(sheets),'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','spareverksted-laneplaner.xlsx');
  });
  addEventListener('storage',event=>{if(!event.key||event.key===key)list();});
  list();
 }
};
