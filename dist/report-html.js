// Selvstendig HTML fra rapporten som allerede vises. Ingen nye beregninger eller nettressurser.
(function(){
'use strict';
function reportStyles(){
 function copy(rule){
  // Utskriftsreglene på kalkulatorsiden skjuler alt utenom PDF-kopien.
  if(rule.type===3||rule.type===5||rule.type===6)return '';
  if(rule.media&&/\bprint\b/.test(rule.media.mediaText))return '';
  if(rule.type!==1&&rule.cssRules)return rule.cssText.slice(0,rule.cssText.indexOf('{')+1)+Array.from(rule.cssRules,copy).join('\n')+'}';
  if(/url\s*\(|@import/i.test(rule.cssText))throw Error('Rapportens utforming krever en ekstern ressurs.');
  return rule.cssText;
 }
 return Array.from(document.styleSheets,sheet=>Array.from(sheet.cssRules,copy).join('\n')).join('\n');
}
function build(){
 const source=document.getElementById('printReportContent');
 if(!source.querySelector('h1'))throw Error('Åpne rapporten før du laster den ned.');
 const doc=document.implementation.createHTMLDocument(source.querySelector('h1').textContent.trim()+' | Spareverksted');
 doc.documentElement.lang='nb';
 doc.documentElement.dataset.theme=document.documentElement.dataset.theme||'neutral';
 const charset=doc.createElement('meta');charset.setAttribute('charset','utf-8');doc.head.prepend(charset);
 const csp=doc.createElement('meta');csp.httpEquiv='Content-Security-Policy';
 csp.content="default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'";
 charset.after(csp);
 const viewport=doc.createElement('meta');viewport.name='viewport';viewport.content='width=device-width, initial-scale=1';doc.head.append(viewport);
 const style=doc.createElement('style');style.textContent=reportStyles()+`
 body{background:var(--surface,#fff)}
 main#reportPreview{max-width:950px;margin:0 auto;border:0;padding:24px;overflow-wrap:anywhere}
 #reportPreview .report-assumptions{grid-template-columns:1fr}
 #reportPreview .report-assumptions div{flex-wrap:wrap;font-size:1rem}
 #reportPreview .report-assumptions b{margin-left:auto}
 #reportPreview .report-footnote{font-size:.875rem!important}
 #reportPreview .report-result strong{overflow-wrap:anywhere}
 #reportPreview .report-comparison,#reportPreview .report-table,#reportPreview .table-scroll{overflow:visible;max-height:none}
 #reportPreview table{white-space:normal}
 #reportPreview .cmp-chart svg{width:100%;max-width:100%;height:auto}
 #reportPreview .report-cmp-legend li{white-space:normal;min-width:0;max-width:100%}
 #reportPreview .cmp-key{max-width:100%;overflow-wrap:anywhere}
 #reportPreview th{position:static}
 #reportPreview .html-cell-label{display:none}
 @media(max-width:640px){
  main#reportPreview{padding:16px}
  #reportPreview table,#reportPreview tbody,#reportPreview tr{display:block}
  #reportPreview thead{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
  #reportPreview tr{border-top:1px solid var(--line);padding-block:12px}
  #reportPreview th[scope=row],#reportPreview td{display:block;text-align:left;white-space:normal;border:0;padding:6px 0;overflow-wrap:anywhere}
  #reportPreview .html-cell-label,#reportPreview .html-cell-value{display:block}
  #reportPreview .html-cell-label{color:var(--muted)}
  #reportPreview .html-cell-value{font-weight:600}
 }
 @media print{
  @page{margin:16mm}
  main#reportPreview{max-width:none;padding:0}
  .report-page{break-before:page}
  h1,h2,h3{break-after:avoid}
 }
 `;doc.head.append(style);
 const main=doc.createElement('main');main.id='reportPreview';
 for(const child of source.childNodes)main.append(doc.importNode(child,true));
 doc.body.append(main);
 for(const el of main.querySelectorAll('script,style,link,iframe,object,embed,base,meta,input,select,textarea'))el.remove();
 for(const el of main.querySelectorAll('button'))el.replaceWith(doc.createTextNode(el.textContent));
 for(const el of main.querySelectorAll('.savings-cell-label,.savings-year-label'))el.remove();
 for(const el of main.querySelectorAll('*')){
  el.removeAttribute('tabindex');el.removeAttribute('aria-pressed');
  for(const attr of [...el.attributes])if(/^on/i.test(attr.name)||['src','srcset','poster','action','formaction'].includes(attr.name))el.removeAttribute(attr.name);
  for(const attr of ['href','xlink:href'])if(el.hasAttribute(attr)&&!(/^(https:\/\/|#)/i.test(el.getAttribute(attr))))el.removeAttribute(attr);
  if(el.tagName==='DETAILS')el.open=true;
 }
 for(const table of main.querySelectorAll('table')){
  table.classList.remove('savings-table');table.setAttribute('role','table');
  const headers=[...table.querySelectorAll('thead th')];
  headers.forEach(h=>{h.scope='col';h.setAttribute('role','columnheader');});
  for(const group of table.querySelectorAll('thead,tbody'))group.setAttribute('role','rowgroup');
  for(const row of table.querySelectorAll('tr'))row.setAttribute('role','row');
  for(const row of table.querySelectorAll('tbody tr')){
   const first=row.cells[0];if(!first)continue;
   let heading=first;
   if(first.tagName!=='TH'){heading=doc.createElement('th');heading.append(...first.childNodes);first.replaceWith(heading);}
   heading.scope='row';heading.setAttribute('role','rowheader');
   [...row.cells].slice(1).forEach((cell,i)=>{
    cell.setAttribute('role','cell');
    const label=doc.createElement('span');label.className='html-cell-label';label.setAttribute('aria-hidden','true');label.textContent=headers[i+1]?.textContent||'';
    const value=doc.createElement('span');value.className='html-cell-value';value.append(...cell.childNodes);cell.append(label,value);
   });
  }
 }
 return '<!doctype html>\n'+doc.documentElement.outerHTML;
}
document.getElementById('downloadReportHtml').onclick=()=>{
 const error=document.getElementById('reportHtmlError');error.hidden=true;
 try{
  const html=build(),title=document.getElementById('printReportContent').querySelector('h1').textContent;
  const name=title.toLowerCase().replace(/æ/g,'a').replace(/ø/g,'o').replace(/å/g,'a').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80)||'rapport';
  const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'})),a=document.createElement('a');
  a.href=url;a.download='spareverksted-'+name+'.html';a.hidden=true;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
 }catch(e){error.textContent='HTML-rapporten kunne ikke lastes ned. Prøv igjen, eller bruk PDF og utskrift.';error.hidden=false;}
};
})();
