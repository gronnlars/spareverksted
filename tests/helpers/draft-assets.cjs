const fs=require('node:fs'),path=require('node:path');
module.exports=file=>path.basename(file)==='veileder-published.js'?Buffer.from('window.SpareVeileder.publicationReady=true; /* Draft fixture only. */'):fs.readFileSync(file);
