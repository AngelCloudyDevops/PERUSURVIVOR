import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'public','assets','branding','kick-all-stars-peru-logo-v1.webp');
const output=path.join(root,'build','windows','icon.ico');
const temp=path.join(root,'tmp','desktop-icon');
const sizes=[16,32,48,64,128,256];

await fs.rm(temp,{recursive:true,force:true});
await fs.mkdir(temp,{recursive:true});
const files=[];
for(const size of sizes){
 const file=path.join(temp,`icon-${size}.png`);
 await sharp(source).resize(size,size,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toFile(file);
 files.push(file);
}
await fs.mkdir(path.dirname(output),{recursive:true});
await fs.writeFile(output,await pngToIco(files));
await fs.rm(temp,{recursive:true,force:true});
console.log(`Icono Windows listo: ${path.relative(root,output)}`);
