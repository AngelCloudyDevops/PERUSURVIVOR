'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('Menú: limita dibujos repetidos sin limitar combate ni retrasar cambios de escena',()=>{
 const P={state:{mode:'menu'}};vm.runInNewContext(fs.readFileSync('src/scenes/game.js','utf8').replace('P.Game.boot();',''),{P});
 let paints=0;for(let i=0;i<120;i++)if(P.Game.shouldPaint(i*1000/120))paints++;assert.equal(paints,30);
 P.state.mode='play';for(let i=0;i<120;i++)assert.equal(P.Game.shouldPaint(1000+i*1000/120),true);
 P.state.mode='menu';assert.equal(P.Game.shouldPaint(1995),true);
});
test('Laboratorio: abandona sesiones pendientes y reconexión antes de cargar arte',()=>{
 let leaves=0,waits=0;const P={Coop:{session:{},reconnecting:true,leave(menu){assert.equal(menu,false);this.session=null;this.reconnecting=false;leaves++}},WalkArt:{readyForStart:()=>false,waitForStart(){waits++}}};
 vm.runInNewContext(fs.readFileSync('src/development/lab.js','utf8'),{P});P.Lab.run();assert.equal(leaves,1);assert.equal(waits,1);P.Lab.run();assert.equal(leaves,1);
});
test('HUD: agrupa llamadas de fotogramas y conserva llamadas inmediatas y cambios de modo',()=>{
 let now=0,writes=0;const element={hidden:false,classList:{toggle(){writes++}}},P={state:{mode:'play',player:null},$:()=>element};
 vm.runInNewContext(fs.readFileSync('src/ui/screens.js','utf8'),{P,performance:{now:()=>now}});
 for(let i=0;i<120;i++){now=i*1000/120;P.UI.hud(true)}assert.ok(writes>=17&&writes<=20);const before=writes;P.UI.hud();assert.equal(writes,before+1);P.UI.hud(true);const after=writes;P.state.mode='pause';P.UI.hud(true);assert.equal(writes,after+1);
});
test('HUD completo: limita también capas externas, conserva cambios de escena y personaje',()=>{
 let now=0,base=0,outer=0;const P={state:{mode:'play',player:{id:'a'}},$:()=>({})};vm.runInNewContext(fs.readFileSync('src/ui/screens.js','utf8'),{P,performance:{now:()=>now}});
 P.UI.hud=()=>{base++;outer++};for(let i=0;i<120;i++){now=i*1000/120;P.UI.hudFrame()}assert.ok(base>=17&&base<=20);assert.equal(outer,base);let before=base;P.UI.hud();assert.equal(base,++before);P.state.mode='pause';P.UI.hudFrame();assert.equal(base,++before);P.state.player={id:'b'};P.UI.hudFrame();assert.equal(base,++before);
});
test('Perfil CPU: optativo, conserva receptor, retorno y errores sin cambiar la lógica',()=>{
 let now=0;const original=function(n){assert.equal(this,P.Game);now+=2;return n+1},P={state:{mode:'play'},Game:{update:original}};
 vm.runInNewContext(fs.readFileSync('src/development/performance.js','utf8'),{P,document:{hidden:false},performance:{now:()=>now}});const perf=P.Performance;
 perf.instrument();assert.equal(P.Game.update,original);perf.profiling=true;perf.instrument();assert.equal(P.Game.update(4),5);assert.equal(perf.cpu['Lógica'].sum,2);assert.equal(perf.cpu['Lógica'].count,1);perf.enabled=false;P.Game.update(8);assert.equal(perf.cpu['Lógica'].count,1);
});
test('HUD: las extensiones dejan de ejecutarse en cada fotograma aunque el HUD base ya limite escrituras',()=>{
 let now=0;function setup(){const element={classList:{toggle(){}},setAttribute(){},style:{}},P={state:{mode:'play',player:null},$:()=>element};vm.runInNewContext(fs.readFileSync('src/ui/screens.js','utf8'),{P,performance:{now:()=>now}});let layers=0;const base=P.UI.hud;P.UI.hud=function(...args){base.apply(this,args);layers++};return {P,count:()=>layers}}
 const before=setup(),after=setup();for(let i=0;i<120;i++){now=i*1000/120;before.P.UI.hud(true);after.P.UI.hudFrame()}assert.equal(before.count(),120);assert.ok(after.count()<=20);assert.ok(after.count()>=17);
});
test('Espíritus de Kingteka: reutiliza siluetas, conserva espejo/opacidad y limita memoria',()=>{
 const noop=()=>{},calls=[],raster=new Proxy({setTransform:noop},{get:(o,k)=>o[k]||noop}),P={Game:{},World:{},UI:{},Ultimate:{}};const document={createElement:()=>({getContext:()=>raster})};vm.runInNewContext(fs.readFileSync('src/systems/kingteka-domain.js','utf8'),{P,document});const domain=P.KingtekaDomain;let rasters=0;const raw=domain.animalRaw;domain.animalRaw=function(...args){rasters++;return raw.apply(this,args)};let scale=1;const c={save:noop,restore:noop,translate:noop,scale:(x,y)=>calls.push(['mirror',x,y]),drawImage:(...args)=>calls.push(['image',...args]),getTransform:()=>({a:scale,b:0})};
 domain.animal(c,'puma',10,20,38,false,.6);domain.animal(c,'puma',30,40,38,true,.4);assert.equal(rasters,1);assert.equal(c.globalAlpha,.4);assert(calls.some(x=>x[0]==='mirror'&&x[1]===-1));scale=2;domain.animal(c,'puma',0,0,38);assert.equal(rasters,2);for(let i=0;i<40;i++)domain.animal(c,'bear',0,0,30+i);assert.equal(domain.spiritCache.size,24);assert(calls.filter(x=>x[0]==='image').every(x=>x[1].width>0&&x[1].height>0));
});
