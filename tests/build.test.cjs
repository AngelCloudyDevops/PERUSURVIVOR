const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),modules=require('../scripts/modules.cjs');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
test('El HTML carga todos los módulos en el orden declarado',()=>{
 const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
 const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(scripts,modules.map(m=>m.output));
 for(const file of [...scripts,'style.css'])assert(fs.existsSync(path.join(root,'dist',file)),file);
 assert(!fs.existsSync(path.join(root,'dist/qa-portals.html')),'No distribuir controles locales de QA');
});
test('La compilación copia el código y recursos sin transformarlos',()=>{
 for(const m of modules)assert.equal(hash(path.join(root,m.source)),hash(path.join(root,'dist',m.output)),m.source);
 function inspect(folder){for(const name of fs.readdirSync(folder)){const file=path.join(folder,name);if(fs.statSync(file).isDirectory())inspect(file);else{const rel=path.relative(path.join(root,'public'),file);assert.equal(hash(file),hash(path.join(root,'dist',rel)),rel)}}}
 inspect(path.join(root,'public'));
});
test('Las hojas y mapas PNG contienen imágenes válidas de tamaño no nulo',()=>{
 const files=["characters/causas-atlas-v1.png","characters/powers-atlas-v1.png","characters/streamers-atlas-v1.png","enemies/rivales-atlas-v1.png","maps/campo-v1.png","maps/plaza-v1.png","maps/machu-v1.png","environment/campo-props-v1.png","environment/plaza-props-v1.png","environment/machu-props-v1.png","environment/ground-tiles-v1.png","bosses/boss-atlas-v1.png","arenas/combi-v1.png","arenas/cabinet-v1.png","arenas/guardian-v1.png"];
 for(const file of files){const data=fs.readFileSync(path.join(root,'public/assets',file));assert.equal(data.toString('hex',0,8),'89504e470d0a1a0a');assert(data.readUInt32BE(16)>0);assert(data.readUInt32BE(20)>0)}
});

test('El recorte del atlas excluye fragmentos de la celda vecina',()=>{
 const vm=require('node:vm'),width=1536,height=1024,data=new Uint8ClampedArray(width*height*4);
 for(const [x,y,w,h] of [[1190,150,120,180],[1026,150,22,70]])for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)data[(yy*width+xx)*4+3]=255;
 const ctx={drawImage(){},getImageData(){return {data}},putImageData(){}},P={};
 vm.runInNewContext(fs.readFileSync(path.join(root,'src/rendering/map-art.js'),'utf8'),{P,document:{createElement(){return {getContext(){return ctx}}}}});
 const sheet={id:'machu',image:{width,height},cells:[]};P.MapArt.measure(sheet);assert.equal(sheet.cells.length,6);assert(sheet.cells[2].x>=1180);assert(sheet.cells[2].w<150);assert(sheet.cells[2].h>=180);
});
