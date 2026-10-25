const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),modules=require('../scripts/modules.cjs');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
test('El HTML carga todos los módulos en el orden declarado',()=>{
 const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
 const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1].split('?')[0]);
 assert.deepEqual(scripts,modules.map(m=>m.output));
 for(const file of [...scripts,'style.css'])assert(fs.existsSync(path.join(root,'dist',file)),file);
 assert(!fs.existsSync(path.join(root,'dist/qa-portals.html')),'No distribuir controles locales de QA');
});
test('La compilación copia el código y recursos sin transformarlos',()=>{
 for(const m of modules)assert.equal(hash(path.join(root,m.source)),hash(path.join(root,'dist',m.output)),m.source);
 function inspect(folder){for(const name of fs.readdirSync(folder)){const file=path.join(folder,name);if(fs.statSync(file).isDirectory())inspect(file);else{if(file.endsWith('.png')&&fs.existsSync(file.slice(0,-4)+'.webp')){assert(!fs.existsSync(path.join(root,'dist',path.relative(path.join(root,'public'),file))));continue}const rel=path.relative(path.join(root,'public'),file);assert.equal(hash(file),hash(path.join(root,'dist',rel)),rel)}}}
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

test('Emoliente: distancia, pausa, salida y recompensa única',()=>{
 const vm=require('node:vm'),P={Maps:{selected:'campo'},state:{mode:'play',player:{x:850,y:400,hp:20,maxHp:100},coins:0,enemies:[]},Terrain:{hit:()=>false,resolve(){}},Data:{arena:{enemyCap:100}},Entities:{enemy:()=>({r:13})},Loot:{notify(){}},Audio:{fx(){} }};vm.runInNewContext(fs.readFileSync(path.join(root,'src/systems/exploration.js'),'utf8'),{P});const e=P.Exploration;e.reset();e.start();assert.equal(e.station.phase,'active');e.tick(5);assert.equal(e.station.progress,5);P.state.mode='pause';e.tick(10);assert.equal(e.station.progress,5);P.state.mode='play';P.state.encounter={};e.tick(10);assert.equal(e.station.progress,5);P.state.encounter=null;P.state.player.x=0;e.tick(1);assert.equal(e.station.progress,0);P.state.player.x=850;for(let n=0;n<20;n++)e.tick(1);assert.equal(e.station.phase,'done');assert.equal(P.state.coins,25);assert.equal(P.state.player.hp,55);e.tick(30);e.start();assert.equal(P.state.coins,25);e.reset();assert.equal(e.station.phase,'idle');P.Maps.selected='machu';e.reset();assert.equal(e.station,null);
});

test('Carga inicial: oculta arte provisional, espera recursos y ofrece reintento',()=>{
 const vm=require('node:vm'),elements=new Map(),classes=new Set(['assets-loading']);
 const P={$:id=>{if(!elements.has(id))elements.set(id,{hidden:false,textContent:''});return elements.get(id)},Sprites:{ready:false,sheets:{base:{},streamers:{},powers:{}}},Maps:{selected:'campo',ready:{}},EnemyArt:{ready:false},state:{mode:'menu'}};
 const context={P,Image:function(){},document:{body:{classList:{remove(c){classes.delete(c)}}}}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'src/ui/screens.js'),'utf8'),context);
 let portraits=0;P.UI.animate=()=>portraits++;
 assert.equal(P.UI.loading(100),true);assert(classes.has('assets-loading'));assert.equal(portraits,0);
 P.Sprites.sheets.base.ready=true;P.Sprites.sheets.streamers.ready=true;P.Maps.ready.campo=true;P.EnemyArt.ready=true;
 assert.equal(P.UI.loading(200),true,'No revelar un atlas incompleto');
 P.Sprites.sheets.powers.ready=true;assert.equal(P.UI.loading(300),false);assert.equal(portraits,1);assert(!classes.has('assets-loading'));assert(P.$('#loading-screen').hidden);assert.equal(P.UI.loading(400),false);assert.equal(portraits,1);
 P.UI.assetsReady=false;P.Sprites.sheets.powers.ready=false;P.Sprites.sheets.powers.failed=true;assert(P.UI.loading(500));assert.equal(P.$('#loading-retry').hidden,false);assert.match(P.$('#loading-message').textContent,/conexión/);
 P.Sprites.sheets.powers.failed=false;P.$('#loading-retry').hidden=true;assert(P.UI.loading(20200));assert.equal(P.$('#loading-retry').hidden,false);
 const html=fs.readFileSync(path.join(root,'src/index.html'),'utf8');assert.match(html,/body class="assets-loading"/);assert.match(html,/body.assets-loading #menu/);assert.equal((html.match(/rel="preload"/g)||[]).length,4);
});

test('Cada build identifica su contenido y versiona scripts y estilos',()=>{const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8'),version=JSON.parse(fs.readFileSync(path.join(root,'dist/version.json'),'utf8')).version;assert.match(version,/^[a-f0-9]{20}$/);assert(html.includes('name="game-version" content="'+version+'"'));for(const m of [...modules,{output:'style.css'}])assert(html.includes(m.output+'?v='+hash(path.join(root,'dist',m.output)).slice(0,16)))});
test('Actualizaciones: menú automático, partida preservada y red sin conexión',async()=>{const vm=require('node:vm');let reloads=0,request,answer={version:'aaaaaaaaaaaaaaaaaaaa'};const button={hidden:true},P={state:{mode:'play'}};const env={P,console,Date,location:{reload(){reloads++}},fetch:async(url,options)=>{request={url,options};if(answer instanceof Error)throw answer;return {ok:true,json:async()=>answer}}};vm.createContext(env);vm.runInContext(fs.readFileSync(path.join(root,'src/core/updates.js'),'utf8'),env);const u=P.Updates;u.version='aaaaaaaaaaaaaaaaaaaa';u.button=button;await u.check();assert.equal(reloads,0);assert.equal(request.options.cache,'no-store');answer=new Error('offline');await u.check();assert.equal(reloads,0);assert(!u.pending);answer={version:'bbbbbbbbbbbbbbbbbbbb'};await u.check();assert(u.pending);assert.equal(reloads,0);assert.equal(button.hidden,false);P.state.mode='menu';await u.check();assert.equal(reloads,1);await u.check();assert.equal(reloads,1)});

test('Arte WebP sin pérdida: integridad del informe y salida sin PNG duplicados',()=>{
 const report=require('../docs/asset-optimization.json');assert.equal(report.assets.length,19);let before=0,after=0;
 for(const asset of report.assets){const source=path.join(root,'public',asset.source),output=path.join(root,'public',asset.output),built=path.join(root,'dist',asset.output),data=fs.readFileSync(output);assert.equal(hash(source),asset.sourceSha256);assert.equal(hash(output),asset.outputSha256);assert.equal(hash(output),hash(built));assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.toString('ascii',8,12),'WEBP');assert(asset.optimizedBytes<asset.originalBytes);assert(!fs.existsSync(path.join(root,'dist',asset.source)));before+=asset.originalBytes;after+=asset.optimizedBytes}
 assert.equal(before,report.originalBytes);assert.equal(after,report.optimizedBytes);assert(after<before*.75);
 for(const p of report.previews){assert.equal(hash(path.join(root,'public',p.output)),p.sha256);assert(p.width<=384);assert(p.height<=256);assert(p.bytes<200000)}
});
test('El inicio descarga solo el mapa seleccionado y reutiliza las solicitudes',()=>{
 const vm=require('node:vm'),requests=[],elements=new Map();const P={state:{mode:'menu'},UI:{},Core:{canvas:{setAttribute(){}}},$:id=>{if(!elements.has(id))elements.set(id,{textContent:'',append(){}});return elements.get(id)}};
 const document={createElement(){return {dataset:{},setAttribute(){},append(){}}},querySelectorAll(){return []},body:{classList:{add(){}}}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'src/scenes/maps.js'),'utf8'),{P,document,Image:function(){requests.push(this)}});
 P.Maps.init();assert.equal(requests.length,1);assert.equal(requests[0].src,'assets/maps/campo-v1.webp');P.Maps.load('campo');assert.equal(requests.length,1);requests[0].onload();assert(P.Maps.ready.campo);P.Maps.select('plaza');assert.equal(requests.length,2);assert.equal(requests[1].src,'assets/maps/plaza-v1.webp');
});
