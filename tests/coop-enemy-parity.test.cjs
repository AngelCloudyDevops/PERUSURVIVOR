'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');
// El servidor y el cliente comparten P.Systems.stepEnemy: estos casos fallaban solo en cooperativo.
function room(){const sim=new Simulation('campo',[0,6]),P=sim.P;P.Systems.spawn=()=>{};P.Encounters.bossMove=()=>{};return {sim,P,s:P.state,a:sim.players[0],b:sim.players[1]}}
const danger=s=>s.danger.filter(q=>q.kind==='spread').length;
test('Cooperativo: el jefe final avisa antes de la ráfaga y dispara el evento de fase',()=>{
 const {sim,P,s,a}=room(),boss=P.Entities.enemy(true);Object.assign(boss,{x:a.x+250,y:a.y,speed:0,attackT:0});s.enemies=[boss];
 sim.tick(.04,[{},{}]);assert(boss.bossAim,'El jefe debe fijar bossAim');assert(boss.bossWindup>0);assert.equal(danger(s),0,'El aviso no daña');
 for(let i=0;i<20;i++)sim.tick(.04,[{},{}]);assert.equal(boss.bossAim,null);assert.equal(danger(s),5,'Cinco proyectiles tras el aviso');
 const called=[];const phaseEvent=P.Encounters.phaseEvent;P.Encounters.phaseEvent=function(e,dt){called.push(e);return phaseEvent.call(this,e,dt)};sim.tick(.04,[{},{}]);assert(called.includes(boss),'bossAttack debe pasar por phaseEvent');
});
test('Cooperativo: un minion aturdido por Makanaky no ataca ni hace daño de contacto',()=>{
 const {sim,P,s,a}=room(),stunned=P.Entities.enemy(),control=P.Entities.enemy();
 Object.assign(stunned,{x:a.x+4,y:a.y,speed:0,makanakyStunUntil:s.elapsed+5,rangedAim:{x:1,y:0,distance:50},burst:{aim:{x:1,y:0},left:2,timer:0}});s.enemies=[stunned];
 const hp=a.hp;sim.tick(.04,[{},{}]);assert.equal(a.hp,hp,'Sin contacto');assert.equal(stunned.rangedAim,null);assert.equal(stunned.burst,null);assert.equal(s.danger.length,0);
 Object.assign(control,{x:a.x+4,y:a.y,speed:0});s.enemies=[control];sim.tick(.04,[{},{}]);assert(a.hp<hp,'Un minion libre sí daña');
});
test('Cooperativo: el jefe de mapa respeta VultureMoon.noContact',()=>{
 const {sim,P,s,a}=room(),vulture=moon=>({x:a.x+4,y:a.y,r:30,hp:100,max:100,mapBoss:true,moonSequence:true,moonAirborne:moon,speed:0,hit:0});
 const hp=a.hp,air=vulture(true);s.enemies=[air];sim.tick(.04,[{},{}]);assert.equal(a.hp,hp,'Sin daño en fase aérea');
 const ground=vulture(false);s.enemies=[ground];sim.tick(.04,[{},{}]);assert(a.hp<hp,'En tierra sí hace contacto');
});
