// Only reader-facing content. No routing, profiles, source URLs or editorial notes.
function pieces(a,{documentation=true}={}){
 const result=[a.title,a.intro,a.caveat];
 const add=x=>{if(x)result.push(x.title,x.text);};
 add(a.example);for(const x of a.parts||[])add(x);
 for(const x of a.terms||[])result.push(x.term,x.text);
 for(const o of a.options||[]){result.push(o.title,o.subtitle);for(const x of [...o.pros,...o.cons])add(x);}
 if(a.tradeoffs)for(const x of [...a.tradeoffs.pros,...a.tradeoffs.cons])add(x);
 if(a.next){result.push(a.next.text);for(const x of a.next.more||[])result.push(x.text);}
 if(documentation){for(const x of a.sources||[])result.push(x.title);result.push(a.review?.text);}
 return result.filter(Boolean);
}
function words(a,options){return pieces(a,options).join(' ').match(/[\p{L}\p{N}]+(?:[,.][\p{N}]+)?/gu)?.length||0;}
function duplicates(a){
 const fields=[a.intro,a.caveat,a.example?.text,...(a.parts||[]).map(x=>x.text),...(a.terms||[]).map(x=>x.text),...(a.options||[]).flatMap(o=>[...o.pros,...o.cons].map(x=>x.text)),...(a.tradeoffs?[...a.tradeoffs.pros,...a.tradeoffs.cons].map(x=>x.text):[]),a.review?.text].filter(Boolean);
 const seen=new Set(),out=[];const seg=new Intl.Segmenter('nb',{granularity:'sentence'});
 for(const f of fields)for(const {segment}of seg.segment(f)){
  const norm=segment.toLocaleLowerCase('nb').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  // Headings and short labels are not repeated prose sentences.
  if((norm.match(/\S+/g)||[]).length<6)continue;
  if(seen.has(norm))out.push(segment.trim());else seen.add(norm);
 }
 return out;
}
module.exports={pieces,words,duplicates};
