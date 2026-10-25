const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const modules=require('./modules.cjs'),root=path.resolve(__dirname,'..');
for(const {source} of modules)new vm.Script(fs.readFileSync(path.join(root,source),'utf8'),{filename:source});
console.log('Sintaxis correcta: '+modules.length+' módulos.');
