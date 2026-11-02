'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {Simulation}=require('../backend/simulation.cjs');
const root=path.resolve(__dirname,'..');

test('El runtime del creador ejecuta la simulación completa compartida',()=>{
 const server=new Simulation('campo',[0,1],root),context={P:server.P,console};
 vm.runInNewContext(fs.readFileSync(path.join(root,'dist/js/coop-host-runtime.js'),'utf8'),context);
 assert.equal(typeof context.P.CoopHostSimulation,'function');
 const host=new context.P.CoopHostSimulation('campo',[0,1]);
 const before=host.players[0].x;host.tick(.04,[{x:1,y:0},{x:0,y:0}]);
 assert(host.players[0].x>before);const state=host.snapshot();
 assert.equal(state.players.length,2);assert.equal(state.map,'campo');
 assert.doesNotThrow(()=>JSON.stringify(state));
});

test('El creador conserva su sesión y el estado autoritativo al iniciar la partida',()=>{
 const server=new Simulation('campo',[0,1],root),P=server.P,context={P,console,performance:{now:()=>0},JSON,Math,Number,setTimeout,clearTimeout};
 vm.runInNewContext(fs.readFileSync(path.join(root,'dist/js/coop-host-runtime.js'),'utf8'),context);
 let leaves=0,receives=0;
 P.Coop={
  session:{code:'CAUSAS',slot:0},room:{started:true,route:'direct',map:'campo',players:[{character:0},{character:1}]},active:false,
  send(){},open(){},roomRender(){},tick(){},leave(){leaves++;this.session=null},
  receive(state){receives++;P.state.player={copied:true};P.state.enemies=[{copied:true}];P.state.shots=[{copied:true}];P.Loot.message='copia';P.Loot.messageTime=1;P.Chunks.broken=new Set(['copia']);this.peers=state.players.filter(p=>p.slot!==0)}
 };
 vm.runInNewContext(fs.readFileSync(path.join(root,'src/network/coop-direct.js'),'utf8'),context);
 assert.equal(P.CoopDirect.startHost(),true);
 assert.equal(leaves,0);assert.equal(P.Coop.session.slot,0);assert.equal(receives,1);
 assert.equal(P.state.player,P.CoopDirect.hostSim.players[0]);
 assert.equal(P.state.enemies.some(enemy=>enemy.copied),false);
 assert.equal(P.state.shots.some(shot=>shot.copied),false);
 assert.equal(P.Coop.peers.length,1);assert.equal(P.Coop.peers[0].slot,1);
});
