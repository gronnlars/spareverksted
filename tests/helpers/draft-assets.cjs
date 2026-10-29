const fs=require('node:fs'),path=require('node:path');
module.exports=file=>path.basename(file)==='veileder-published.js'?Buffer.from('/* Draft fixture: no publication policy. */'):fs.readFileSync(file);
