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
 const files=["enemies/gallinazos-atlas-v1.png","characters/causas-atlas-v1.png","characters/powers-atlas-v1.png","characters/streamers-atlas-v1.png","enemies/rivales-atlas-v1.png","maps/campo-v1.png","maps/plaza-v1.png","maps/machu-v1.png","environment/campo-props-v1.png","environment/plaza-props-v1.png","environment/machu-props-v1.png","environment/ground-tiles-v1.png","bosses/boss-atlas-v1.png","arenas/combi-v1.png","arenas/cabinet-v1.png","arenas/guardian-v1.png"];
 for(const file of files){const data=fs.readFileSync(path.join(root,'public/assets',file));assert.equal(data.toString('hex',0,8),'89504e470d0a1a0a');assert(data.readUInt32BE(16)>0);assert(data.readUInt32BE(20)>0)}
});

test('El recorte del atlas excluye fragmentos de la celda vecina',()=>{
 const vm=require('node:vm'),width=1536,height=1024,data=new Uint8ClampedArray(width*height*4);
 for(const [x,y,w,h] of [[1190,150,120,180],[1026,150,22,70]])for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)data[(yy*width+xx)*4+3]=255;
 const ctx={drawImage(){},getImageData(){return {data}},putImageData(){}},P={};
 vm.runInNewContext(fs.readFileSync(path.join(root,'src/rendering/map-art.js'),'utf8'),{P,document:{createElement(){return {getContext(){return ctx}}}}});
 const sheet={id:'machu',image:{width,height},cells:[]};P.MapArt.measure(sheet);assert.equal(sheet.cells.length,6);assert(sheet.cells[2].x>=1180);assert(sheet.cells[2].w<150);assert(sheet.cells[2].h>=180);
});

test('Las zonas varían y la red de caminos conecta sectores sin obstáculos',()=>{
 const vm=require('node:vm'),P={Maps:{selected:'campo'},state:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'src/systems/chunks.js'),'utf8'),{P});const c=P.Chunks;
 for(const map of ['campo','plaza','machu']){P.Maps.selected=map;c.reset();const zones=new Set(),layouts=new Set();let count=0,vertical=0,horizontal=0;
 for(let cy=-7;cy<=7;cy++)for(let cx=-7;cx<=7;cx++){zones.add(c.zone(cx*512,cy*512).type);const ch=c.get(cx,cy);layouts.add(ch.props.map(o=>o.kind).join(','));count+=ch.props.length;for(const o of ch.props){assert(c.roadDistance(o.x,o.y)>=Math.hypot(o.w,o.h)/2+65);assert(!c.ground(o.x,o.y).road);if(o.kind==='wall'){if(o.w>o.h)horizontal++;else vertical++}}}
 assert.equal(zones.size,4,map);assert(layouts.size>15,map);assert(count>150,map);if(map==='machu')assert(vertical>0&&horizontal>0);
 for(let gy=-3;gy<=3;gy++)for(let gx=-3;gx<=3;gx++){const a=c.node(gx,gy),b=c.node(gx+1,gy);for(let n=0;n<=16;n++)assert(c.ground(a.x+(b.x-a.x)*n/16,a.y+(b.y-a.y)*n/16).road,'Conexión horizontal continua')}
 const before=JSON.stringify(c.get(4,-3).props);c.cache.delete('4,-3');assert.equal(JSON.stringify(c.get(4,-3).props),before);assert(c.node(4,3).y!==c.node(5,3).y,'Caminos con desvíos');
 }
});

test('Audio: inicio por gesto, silencio, pausa y temas por mapa',()=>{
 const vm=require('node:vm'),gains=[],saved={},P={state:{mode:'play'},Maps:{selected:'campo'},$:()=>({setAttribute(){}})},context={P,localStorage:{getItem:k=>saved[k],setItem:(k,v)=>saved[k]=v},document:{hidden:false},addEventListener(){}};
 class AC{constructor(){this.currentTime=0;this.state='running';this.destination={}}createGain(){const g={gain:{value:0,setTargetAtTime(v){this.value=v}},connect(){}};gains.push(g);return g}}
 context.window={AudioContext:AC};vm.runInNewContext(fs.readFileSync(path.join(root,'src/systems/audio.js'),'utf8'),context);const a=P.Audio;a.init();assert.equal(a.ctx,null,'Sin autoplay');a.unlock();assert(a.ctx);const notes=[];a.tone=(...v)=>notes.push(v);a.tick();assert.equal(a.theme,'campo');assert(notes.length>0);P.state.mode='pause';a.tick();assert.equal(a.master.gain.value,0);P.state.mode='upgrade';a.tick();assert.equal(a.music.gain.value,0);assert(a.master.gain.value>0);a.fx('upgrade');assert(notes.length>=6);a.muted=true;a.tick();assert.equal(a.master.gain.value,0);a.muted=false;P.state.mode='play';P.Maps.selected='machu';a.ctx.currentTime+=1;a.tick();assert.equal(a.theme,'machu');context.document.hidden=true;a.tick();assert.equal(a.master.gain.value,0);
});
