// Navngitte øyeblikksbilder. Regn fra forutsetningene når rapporten åpnes.
window.LoanReports={
 attach({exportPlan,download}){
  const get=id=>document.getElementById(id);
  const key='sv-loan-plans-v1';
  const selected=new Set();
  const status=message=>{get('loanStatus').textContent=message;};
  const escape=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function read(){
   const records=JSON.parse(localStorage.getItem(key)||'[]');
   if(!Array.isArray(records))throw Error('Uleselig liste');
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
  get('compareLoans').onclick=()=>withPlans(plans=>{
   const [titles,...rows]=comparison(plans);
   for(const [id,prefix] of [['reportPreview','savedPreview'],['printReportContent','savedPrint']]){
    let html='<h1>Valgte låneplaner</h1><p>De tre første valgte planene sammenlignes i løpende kroner før rentefradrag. Hver plan følger med sine egne forutsetninger.</p>';
    for(const row of rows){
     html+='<h2>'+escape(row[0])+'</h2><dl class="report-assumptions">';
     for(let i=1;i<row.length;i++)html+='<div><dt>'+titles[i]+'</dt><dd>'+escape(i===row.length-1?row[i]:LaanTekst.money(row[i]))+'</dd></div>';
     html+='</dl>';
    }
    plans.forEach(({name,plan},i)=>{
     const detail=LaanEksport.report(plan,prefix+i).replace(/<(\/?)(h[123])>/g,(_,end,h)=>'<'+end+'h'+(Number(h[1])+1)+'>').replace('<h2>Låneberegning</h2>',()=>'<h2>'+escape(name)+'</h2>');
     html+=detail;
    });
    get(id).innerHTML=html;
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
