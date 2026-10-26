const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist'),modules=require('./modules.cjs');
function copy(from,to){fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to)}
function build(){
 // dist es una salida reconstruible; comprobar el destino antes de limpiarlo.
 if(path.dirname(out)!==root||path.basename(out)!=='dist')throw new Error('Destino de build inválido');
 if(fs.existsSync(out)&&fs.lstatSync(out).isSymbolicLink())throw new Error('dist no puede ser un enlace simbólico');
 fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
 copy(path.join(root,'src/index.html'),path.join(out,'index.html'));
 copy(path.join(root,'src/ui/styles.css'),path.join(out,'style.css'));
 for(const m of modules)copy(path.join(root,m.source),path.join(out,m.output));
 fs.cpSync(path.join(root,'public'),out,{recursive:true,filter:source=>!source.endsWith('.png')||!fs.existsSync(source.slice(0,-4)+'.webp')});
 fs.cpSync(path.join(root,'backend'),path.join(out,'backend'),{recursive:true});
 fs.writeFileSync(path.join(out,'backend/modules.json'),JSON.stringify(modules.map(m=>m.output)));
 for(const file of ['package.json','package-lock.json'])copy(path.join(root,file),path.join(out,'backend',file));
 copy(path.join(root,'ops/hostinger/install-coop.py'),path.join(out,'backend/install-vps.py'));
 // Identidad reproducible del contenido; cada recurso cambia de URL cuando cambia.
 const digest=crypto.createHash('sha256');function fingerprint(dir){for(const name of fs.readdirSync(dir).sort()){const file=path.join(dir,name);if(fs.statSync(file).isDirectory())fingerprint(file);else{digest.update(path.relative(out,file).split(path.sep).join('/'));digest.update(fs.readFileSync(file))}}}fingerprint(out);const version=digest.digest('hex').slice(0,20);
 const index=path.join(out,'index.html');let html=fs.readFileSync(index,'utf8');for(const mod of modules)if(!html.includes('src="'+mod.output+'"'))html=html.replace('</body>','<script src="'+mod.output+'"></script></body>');html=html.replace('</head>','<meta name="game-version" content="'+version+'"></head>');html=html.replace(/(src|href)="((?:js\/[^"?]+\.js|style\.css))"/g,(_,attribute,file)=>attribute+'="'+file+'?v='+crypto.createHash('sha256').update(fs.readFileSync(path.join(out,file))).digest('hex').slice(0,16)+'"');fs.writeFileSync(index,html);fs.writeFileSync(path.join(out,'version.json'),JSON.stringify({version})+'\n');
 const qa=path.join(out,'qa-portals.html');if(fs.existsSync(qa))fs.unlinkSync(qa);
 console.log('Build listo: dist/ ('+modules.length+' módulos)');
}
module.exports={build};if(require.main===module)build();
