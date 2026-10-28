'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');

function ready(duo=false,map='campo'){
 const sim=new Simulation(map,duo?[0,6]:[0]),P=sim.P,s=P.state;
 if(!duo){s.runMode='chaos';P.Data.arena.duration=1800}
 s.enemies=[];s.miniWarning=null;s.portal.open=false;P.Market.merchant=null;P.Exploration.station=null;
 s.mapTime=P.MapEvents.worldDue();P.Terrain.hit=()=>null;
 return {sim,P,s};
}

test('Impacto del cielo: una cinemática garantizada congela combate y crea un cráter persistente',()=>{
 const {P,s}=ready(),M=P.MapEvents,p=s.player;const before={x:p.x,y:p.y,time:s.mapTime};
 assert(M.tick(.04));assert(M.cinematic());assert.equal(M.event.world,true);assert.equal(M.worldPlayed,true);assert.equal(M.impacts.length,0);
 const frame=M.camera(p,1280,720,1.3);assert(frame&&frame.zoom>0);
 for(let i=0;i<122;i++){s.mapTime+=.04;assert(M.tick(.04))}
 assert.equal(M.impacts.length,1);assert(M.impacts[0].radius>=200);assert(P.Terrain.props.some(o=>o.meteorImpact));assert(P.Terrain.props.some(o=>o.meteorImpact&&o.solid));
 while(M.cinematic()){s.mapTime+=.04;M.tick(.04)}assert.equal(M.event.phase,'active');assert.equal(M.event.points.length,5);assert.deepEqual({x:p.x,y:p.y},{x:before.x,y:before.y});assert(Math.abs(s.mapTime-before.time)<.08,'La cinemática no consume tiempo de supervivencia');
 const impact=JSON.stringify(M.impacts);P.Chunks.signature='';P.Chunks.sync();M.ensureTerrain();assert.equal(JSON.stringify(M.impacts),impact);assert(P.Terrain.props.some(o=>o.meteorImpact));
});

test('Impacto cooperativo: el servidor elige un jugador vivo, sincroniza el terreno y recoge con cualquiera',()=>{
 const {sim,P,s}=ready(true,'plaza'),M=P.MapEvents,[a,b]=sim.players;a.x=-500;a.y=80;b.x=620;b.y=-40;const positions=sim.players.map(p=>[p.x,p.y]);
 sim.tick(.04,[{x:1},{x:-1}]);let snap=JSON.parse(JSON.stringify(sim.snapshot()));assert(snap.mapEvent?.world);assert([0,1].includes(snap.mapEvent.targetSlot));assert.deepEqual(sim.players.map(p=>[p.x,p.y]),positions,'El servidor congela a los dos durante la toma');
 for(let i=0;i<165;i++)sim.tick(.04,[{x:1},{x:-1}]);snap=JSON.parse(JSON.stringify(sim.snapshot()));assert.equal(snap.mapEvent.phase,'active');assert.equal(snap.meteorImpacts.length,1);assert.doesNotThrow(()=>JSON.stringify(snap));
 const point=M.event.points.find(q=>!q.taken);Object.assign(b,{x:point.x,y:point.y});const coins=s.coins;sim.tick(.04,[{},{}]);assert(point.taken);assert.equal(s.coins,coins+8);assert.equal(JSON.parse(JSON.stringify(sim.snapshot())).mapEvent.collected,1);
});
