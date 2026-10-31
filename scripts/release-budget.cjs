'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const maxBytes=Number(process.env.RELEASE_MAX_CONTENT||80*1024*1024);
const maxFiles=Number(process.env.RELEASE_MAX_FILES||1000);
if(!fs.existsSync(path.join(dist,'index.html')))throw Error('Falta dist/index.html; ejecuta npm run build');
const rows=[];
function walk(directory){for(const name of fs.readdirSync(directory)){const file=path.join(directory,name),stat=fs.statSync(file);if(stat.isDirectory())walk(file);else rows.push({file:path.relative(dist,file).split(path.sep).join('/'),size:stat.size})}}
walk(dist);
const total=rows.reduce((sum,row)=>sum+row.size,0),groups=new Map();
for(const row of rows){const parts=row.file.split('/'),group=parts[0]==='assets'&&parts[1]?'assets/'+parts[1]:parts[0];groups.set(group,(groups.get(group)||0)+row.size)}
const mib=value=>(value/1024/1024).toFixed(2);
console.log(`Release: ${rows.length} archivos · ${mib(total)} MiB extraídos`);
for(const [group,size] of [...groups].sort((a,b)=>b[1]-a[1]).slice(0,12))console.log(`${mib(size).padStart(7)} MiB  ${group}`);
if(rows.length>maxFiles)throw Error(`La release supera ${maxFiles} archivos`);
if(total>maxBytes)throw Error(`La release supera ${mib(maxBytes)} MiB extraídos`);
