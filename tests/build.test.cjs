const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),modules=require('../scripts/modules.cjs');
test('El HTML incluye los controles que el mercado necesita al iniciar',()=>{const html=fs.readFileSync(path.join(root,'src/index.html'),'utf8');for(const id of ['market-open','market-status'])assert(html.includes('id="'+id+'"'),id)});
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
 for(let gy=-3;gy<=3;gy++)for(let gx=-3;gx<=3;gx++){const a=c.node(gx,gy),b=c.node(gx+1,gy),seed=c.hash(gx,gy,97);for(let n=0;n<=16;n++){const p=c.curve(a,b,seed,n/16);assert(c.ground(p.x,p.y).road,'Conexión horizontal continua')}}
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
 const report=require('../docs/asset-optimization.json');assert.equal(report.assets.length,27);let before=0,after=0;
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

test('Índice de enemigos: conserva impactos, orden y trayectorias largas',()=>{
 const {combat,populate}=require('./performance-fixture.cjs'),{P,events}=combat();populate(P);const reference=P.state.enemies.map(e=>({...e})),expected=[];
 for(const shot of P.state.shots){const tx=shot.x+shot.vx*.04,ty=shot.y+shot.vy*.04,dx=tx-shot.x,dy=ty-shot.y,len=dx*dx+dy*dy;let remaining=shot.remaining;for(const e of reference){const t=Math.max(0,Math.min(1,((e.x-shot.x)*dx+(e.y-shot.y)*dy)/len));if(e.hp>0&&Math.hypot(e.x-shot.x-t*dx,e.y-shot.y-t*dy)<e.r+7){e.hp-=shot.power;expected.push(e.id);if(--remaining<=0)break}}}
 P.Combat.tick(.04);assert.deepEqual(events,expected);assert.deepEqual(Array.from(P.state.enemies,e=>e.hp),reference.map(e=>e.hp));
 const index=P.Combat.indexEnemies([{x:-500,y:-500,r:140},{x:1500,y:1500,r:13}]);assert.equal(P.Combat.nearSegment(index,-1000,-500,2000,-500).length,1);assert.equal(P.Combat.nearSegment(index,5000,5000,5010,5010).length,0);
});
test('Decoración: reutiliza posiciones e invalida por colisión, mapa y cámara',()=>{
 const vm=require('node:vm');let tests=0;const P={state:{mode:'play'},Maps:{selected:'campo'},Terrain:{revision:1,hit(){tests++;return false}},Chunks:{hash(){return 12345},roadDistance(){return 150},ground(){return {road:false}}}};vm.runInNewContext(fs.readFileSync(path.join(root,'src/rendering/ambient.js'),'utf8'),{P,Math});const a=P.Ambient.items(0,0,800,600),n=tests;assert(a.length);assert.strictEqual(P.Ambient.items(0,0,800,600),a);assert.equal(tests,n);P.Terrain.revision++;assert.notStrictEqual(P.Ambient.items(0,0,800,600),a);assert(tests>n);const b=P.Ambient.items(0,0,800,600);assert.notStrictEqual(P.Ambient.items(1000,0,800,600),b);P.state.encounter={};assert.equal(P.Ambient.items(0,0,800,600).length,0);
});
test('Cámara: conserva márgenes de animación y descarta objetos lejanos',()=>{
 const vm=require('node:vm'),P={};vm.runInNewContext(fs.readFileSync(path.join(root,'src/rendering/world.js'),'utf8'),{P});P.World.view={left:-400,right:400,top:-300,bottom:300};assert(P.World.visible(550,0,200));assert(P.World.visible(0,450,200));assert(!P.World.visible(2000,0,200));assert(!P.World.visible(0,2000,200));assert(P.World.visible(-600,0,201));
});
test('Los cuadros de personajes conservan la figura principal y excluyen pies vecinos',()=>{
 const vm=require('node:vm'),scope={P:{}};vm.createContext(scope);vm.runInContext(fs.readFileSync(path.join(root,'src/rendering/sprites.js'),'utf8'),scope);const width=240,height=100,pixels=new Uint8ClampedArray(width*height*4);
 function box(left,top,right,bottom){for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++)pixels[(y*width+x)*4+3]=255}
 box(40,25,80,80);box(53,19,65,22);box(105,70,115,82);box(130,5,220,95);
 const cell=scope.P.Sprites.bounds(pixels,width,0,0,120,100);assert(cell.sx<=40);assert(cell.sy<=19,'Conservar detalle cercano del sombrero');assert(cell.sx+cell.w<105,'Excluir pie suelto del vecino');assert(cell.sy+cell.h>80,'Conservar pies propios');assert(cell.sx+cell.w<=120);
 const empty=scope.P.Sprites.bounds(new Uint8ClampedArray(width*height*4),width,120,0,120,100);assert.equal(empty.sx,120);assert.equal(empty.w,120);assert.equal(empty.h,100);
});

test('FPS reales, pausa, pestaña oculta y resumen sin récords',()=>{
 const vm=require('node:vm'),els=new Map();const get=id=>{if(!els.has(id))els.set(id,{hidden:false,checked:false,textContent:'',value:'1'});return els.get(id)};let starts=0,menus=0,shown;
 const P={$:get,state:{mode:'play',enemies:[],shots:[],danger:[],player:{x:0,y:0}},Core:{clear(){},canvas:{setAttribute(){}}},UI:{menu(){menus++;P.Performance.stop();P.state.mode='menu'},hud(){},show(title,text,buttons){shown={title,text,buttons}}},Game:{start(){starts++;Object.assign(P.state,{mode:'play',player:{x:0,y:0},enemies:[],shots:[],danger:[]})}},Entities:{enemy(){return {design:0,r:13,speed:60}}}};const document={hidden:false,addEventListener(){}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'src/development/performance.js'),'utf8'),{P,document,Math,Set});const perf=P.Performance;perf.init();perf.frame(0);perf.frame(100);assert.equal(perf.metrics().fps,10,'Usar intervalo RAF real, sin límite de 40 ms');perf.recent=[];perf.last=null;perf.frame(1000);perf.frame(1010);perf.frame(1020);assert.equal(perf.metrics().fps,100);document.hidden=true;perf.frame(10000);document.hidden=false;perf.frame(20000);perf.frame(20010);assert.equal(perf.metrics().fps,100,'Excluir el tiempo en segundo plano');
 perf.start();assert.equal(starts,1);assert.equal(menus,1);assert(P.state.devRun);assert(P.state.performanceRun);assert.equal(P.state.enemies.length,80);assert.equal(P.state.enemies.filter(e=>e.heavy).length,16);assert(P.state.enemies.every(e=>Number.isFinite(e.speed)));assert.equal(P.state.shots.length,400);assert(P.state.player.inv>0);assert(P.state.shots.every(s=>s.history.length===0&&s.hits instanceof Set));P.state.shots.length=0;perf.tick();assert.equal(P.state.shots.length,400);
 perf.frame(30000);for(let i=1;i<=4;i++)perf.frame(30000+i*1000);const count=perf.frames;P.state.mode='pause';perf.frame(35000);assert.equal(perf.frames,count);P.state.mode='play';perf.frame(36000);assert(perf.frames>count);perf.finish();assert.equal(P.state.mode,'end');assert(!perf.active);assert(get('#performance-panel').hidden);assert(perf.result.fps>0);assert.match(shown.text,/Sin récords/);assert.equal(shown.buttons.length,2);perf.stop();assert(!perf.active);assert(get('#performance-panel').hidden);perf.start();perf.frame(100000);for(let i=1;i<=33&&perf.active;i++)perf.frame(100000+i*1000);assert(!perf.active,'Terminar automáticamente tras medir 30 s');assert.equal(perf.result.seconds,30);assert.equal(perf.result.fps,1);perf.start();perf.finish();assert.equal(perf.result,null,'Salida temprana sin división por cero');perf.stop();
});

test('Proyectiles: reutiliza geometría y brillo, conserva estelas y estados animados',()=>{
 const vm=require('node:vm');let compilations=0,blits=0,trailPixels=0;const make=()=>new Proxy({setTransform(){},drawImage(){blits++},getTransform(){return {a:1,b:0,c:0,d:1}},fillRect(){trailPixels++}}, {get(t,k){return k in t?t[k]:(()=>{})}}),surfaces=[],P={PowerFX:{projectile(){compilations++;return false}},Performance:{active:false}};
 const document={createElement(){const c={getContext:make};surfaces.push(c);return c}};vm.runInNewContext(fs.readFileSync(path.join(root,'src/rendering/effects.js'),'utf8'),{P,document,Math,Map});const ctx=make(),shot={glyph:'KEY',kind:'spread',color:'#ffcc88',age:0,x:0,y:0,vx:1,vy:0,history:[{x:0,y:0}]};P.FX.projectile(ctx,shot);assert.equal(compilations,1);const pixels=trailPixels;for(let i=0;i<50;i++)P.FX.projectile(ctx,{...shot,x:i});assert.equal(compilations,1);assert.equal(blits,51);assert(trailPixels>pixels,'La estela sigue dibujándose');
 P.FX.projectile(ctx,{...shot,glyph:'ROACH',age:0});P.FX.projectile(ctx,{...shot,glyph:'ROACH',age:.06});const phases=compilations;P.FX.projectile(ctx,{...shot,glyph:'ROACH',age:.1});assert.equal(compilations,phases,'Reutilizar las dos fases animadas');const images=blits;P.FX.projectile(ctx,{...shot,glyph:'STAR',age:.7});assert.equal(blits,images,'La estrella conserva su animación vectorial');P.Performance.active=true;P.Performance.legacyRendering=true;const count=compilations;P.FX.projectile(ctx,shot);assert.equal(compilations,count+1);P.Performance.active=false;
 P.FX.maxCachePixels=15000;for(let i=0;i<12;i++)P.FX.projectile(ctx,{...shot,color:'#'+String(i).padStart(6,'0')});assert(P.FX.cachePixels<=15000);assert(P.FX.glyphCache.size<=2,'Memoria de texturas acotada');
});
test('Colisiones: salida rápida en espacio libre y resolución intacta junto a paredes',()=>{
 const vm=require('node:vm'),P={state:{mode:'play'},Maps:{current(){return {}}}};vm.runInNewContext(fs.readFileSync(path.join(root,'src/systems/terrain.js'),'utf8'),{P,Math,Map});const t=P.Terrain;let reads=0;const wall={x:0,y:0,w:40,h:40,get solid(){reads++;return true}};t.props=[wall];t.indexProps();reads=0;const free={x:50000,y:50000};t.resolve(free,{...free},14);assert.equal(reads,0,'No recorrer obstáculos si la celda está vacía');assert.deepEqual(free,{x:50000,y:50000});const body={x:0,y:0};t.resolve(body,{x:-80,y:0},14);assert.equal(body.x,-34);t.props=[{x:200,y:0,w:40,h:40,solid:true}];const manual={x:200,y:0};t.resolve(manual,{x:120,y:0},14);assert.equal(manual.x,166,'Conservar resolución si el índice no corresponde al arreglo actual');
});

test('HUD: conserva valores y evita reescribir texto idéntico',()=>{const vm=require('node:vm');let writes=0,lookups=0,value='';const node={get textContent(){return value},set textContent(v){writes++;value=v}},P={$(){lookups++;return node}};vm.runInNewContext(fs.readFileSync(path.join(root,'src/ui/screens.js'),'utf8'),{P});P.UI.text('#hp','95');for(let i=0;i<120;i++)P.UI.text('#hp','95');assert.equal(writes,1);assert.equal(lookups,1);P.UI.text('#hp','85');assert.equal(writes,2);assert.equal(value,'85');});

test('Ciclo de luz: fases, límites, continuidad y reloj del mapa',()=>{
 const vm=require('node:vm'),P={state:{mode:'play',mapTime:0},$:()=>({})};vm.runInNewContext(fs.readFileSync(path.join(root,'src/rendering/day-night.js'),'utf8'),{P});const c=P.DayNight;assert.equal(c.sample(0).label,'DÍA');assert.equal(c.sample(90).label,'ATARDECER');assert.equal(c.sample(180).label,'ANOCHECER');assert.equal(c.sample(270).label,'NOCHE');let prev=0;for(let t=0;t<=600;t++){const v=c.sample(t);assert(v.night>=prev&&v.night<=1);assert(v.warm>=0&&v.warm<=1);assert(v.lamps>=0&&v.lamps<=1);assert(Math.abs(v.night-c.sample(t+.01).night)<.001);prev=v.night}P.state.mapTime=240;const night=c.current().night;P.state.mode='pause';assert.equal(c.current().night,night);P.state.encounter={};assert.equal(c.active(),false);assert.equal(c.current().night,0);P.state.encounter=null;P.state.mode='play';assert.equal(c.current().night,night);P.state.mapTime=0;assert.equal(c.current().night,0);
});

test('Garúa: episodios acotados, continuidad, pausa, mapas y movimiento reducido',()=>{
 const vm=require('node:vm'),P={Maps:{selected:'campo'},state:{mode:'play',mapTime:70},Ambient:{reduced:{matches:false}}};vm.runInNewContext(fs.readFileSync(path.join(root,'src/rendering/weather.js'),'utf8'),{P});const w=P.Weather;for(const t of [0,59,60,85,100,149,175,265])assert.equal(w.sample(t).intensity,0);for(const t of [65,80,155,170,245,260])assert(w.sample(t).intensity>.9);for(let t=0;t<300;t++)assert(Math.abs(w.sample(t).intensity-w.sample(t+.01).intensity)<.01);const value=w.current().intensity;P.state.mode='pause';assert.equal(w.current().intensity,value);P.state.encounter={};assert.equal(w.current().intensity,0);P.state.encounter=null;P.state.mode='play';P.Maps.selected='plaza';assert.equal(w.current().intensity,0);P.Maps.selected='campo';P.Ambient.reduced.matches=true;assert.equal(w.current().intensity,0);P.Ambient.reduced.matches=false;P.state.devRun=true;assert.equal(w.current().intensity,0);
});
