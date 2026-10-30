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
