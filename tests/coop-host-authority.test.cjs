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
