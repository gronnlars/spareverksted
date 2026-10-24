// Inngang for nettlesermålingen: pakkes med esbuild til én IIFE (kun forsøk, ikke produksjon).
const MiniSearchMotor=require('./motorer/minisearch.cjs');
const indeks=require('./register/indeks.json');
window.__sok={
 bygg:()=>MiniSearchMotor.lagMotor(indeks),
 bygg2:(ix)=>MiniSearchMotor.lagMotor(ix),
 indeks
};
