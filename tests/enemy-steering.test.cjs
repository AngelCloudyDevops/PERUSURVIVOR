'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');
function room(){const sim=new Simulation('campo',[0,6]),P=sim.P;P.Systems.spawn=()=>{};P.Encounters.bossMove=()=>{};const s=P.state,a=sim.players[0],b=sim.players[1];Object.assign(a,{x:-100,y:0});Object.assign(b,{x:100,y:0});s.obstacles=[];return {sim,P,s,a,b}}
const enemy=(P,x,y)=>{const e=P.Entities.enemy();Object.assign(e,{x,y,speed:0,hp:99,max:99});return e};
test('Objetivo: sin cambios mientras los jugadores estan casi equidistantes',()=>{
 const {P,s,a,b}=room(),e=enemy(P,-10,0);s.enemies=[e];assert.equal(P.Systems.target(e,[a,b]),a);
 e.x=10;assert.equal(P.Systems.target(e,[a,b]),a,'110 vs 90 no supera el umbral 0.75');
});
test('Objetivo: cambia cuando otro jugador esta claramente mas cerca o el actual muere',()=>{
 const {P,a,b}=room(),e=enemy(P,-10,0);P.Systems.target(e,[a,b]);
 e.x=60;assert.equal(P.Systems.target(e,[a,b]),b,'160 vs 40');assert.equal(e.targetSlot,b.slot);
 e.x=-10;assert.equal(P.Systems.target(e,[a,b]),b,'conserva a b aunque a sea algo mas cercano');
 b.hp=0;assert.equal(P.Systems.target(e,[a,b]),a,'objetivo muerto');
 const f=enemy(P,0,0);assert.equal(P.Systems.target(f,[a]),a);
});
