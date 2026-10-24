'use strict';
// Setter opp alle motorer på identisk innhold. forstyrr=true legger til fire urelaterte dokumenter i alle motorer.
const fs=require('fs'),path=require('path');
const {lesDokumenter,bygg}=require('../bygg-indeks.cjs');
const FORSTYRRERE=[
 {id:'x-bilforsikring',tittel:'Bilforsikring og egenandel',sporsmal:['Hva er egenandel på bilforsikring?'],words:[/bilforsikring/,/egenandel/]},
 {id:'x-lanetyper',tittel:'Bolig og lånetyper for ungdom',sporsmal:['Hva er forskjellen på lån og kreditt?','Hvordan søker jeg om lån til bolig?'],words:[/l[aå]netyp/,/kreditt/,/\bbolig\b/,/\bl[aå]n\b/]},
 {id:'x-ask-bank',tittel:'Slik ask du banken om hjelp',sporsmal:['Hvordan ask jeg banken om hjelp?'],words:[/\bask\b/]},
 {id:'x-stappet',tittel:'Alt om sparing, fond, lån og bolig',sporsmal:['Sparing fond lån bolig pensjon buffer konto?','Fond lån sparing bolig konto pensjon?'],words:[/sparing/,/fond/,/l[aå]n/,/bolig/]},
];
module.exports=function(opt={}){
 const {motorer=['idag','pr54','ms-naiv','ms-kandidat'],forstyrr=false,msOpt={}}=opt;
 const {docs,V}=lesDokumenter();
 const reg=JSON.parse(fs.readFileSync(path.join(__dirname,'../register/begreper.json'),'utf8'));
 let alle=docs.slice();
 if(forstyrr){for(const f of FORSTYRRERE){V.topics.push({id:f.id,title:f.tittel,questions:f.sporsmal,words:f.words});alle.push({id:f.id,tittel:f.tittel,sporsmal:f.sporsmal,form:'tema'});}}
 // Forstyrrerne har ingen begreper i registeret. De finnes bare via tittel og spørsmål. Det er poenget.
 const indeks=bygg(reg,docs);
 if(forstyrr)for(const f of FORSTYRRERE)indeks.dokumenter.push({id:f.id,tittel:f.tittel,sporsmal:f.sporsmal,form:'tema',navn:[],produktnavn:[],begreper:[]});
 const ms=require('./minisearch.cjs');
 const bygget={
  'idag':()=>require('./idag.cjs')(V),
  'pr54':()=>require('./pr54.cjs')(V),
  'ms-naiv':()=>ms.naiv(indeks),
  'ms-kandidat':()=>ms.lagMotor(indeks,msOpt),
 };
 for(const k of ['stemmer','sammensatt','byttet','register','hensikt','negasjon','uskarp'])bygget['ms-uten-'+k]=()=>ms.lagMotor(indeks,{...msOpt,[k]:false,navn:'ms-uten-'+k});
 return {motorer:motorer.map(n=>bygget[n]()),indeks,V};
};
module.exports.FORSTYRRERE=FORSTYRRERE;
