const fs=require('node:fs'),path=require('node:path');
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
 fs.cpSync(path.join(root,'public'),out,{recursive:true});
 fs.cpSync(path.join(root,'backend'),path.join(out,'backend'),{recursive:true});
 fs.writeFileSync(path.join(out,'backend/modules.json'),JSON.stringify(modules));
 for(const file of ['package.json','package-lock.json'])copy(path.join(root,file),path.join(out,'backend',file));
 copy(path.join(root,'ops/hostinger/install-coop.py'),path.join(out,'backend/install-vps.py'));
 const qa=path.join(out,'qa-portals.html');if(fs.existsSync(qa))fs.unlinkSync(qa);
 console.log('Build listo: dist/ ('+modules.length+' módulos)');
}
module.exports={build};if(require.main===module)build();
