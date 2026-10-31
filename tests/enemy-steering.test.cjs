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
test('Propietario: damageMultiplier y la guardia del anquilosaurio usan ownerSlot, no al anfitrion',()=>{
 const {P,s,a,b}=room();b.extinctionRelic='predator';b.predatorUntil=s.elapsed+5;b.extinctionDungeonPower=2;
 const src=slot=>P.Attributes.source(slot,'physical');
 assert.equal(P.Attributes.owner(src(b)),b);assert.equal(P.Attributes.owner(src(a)),a);assert.equal(P.Attributes.owner({}),null);
 assert.equal(P.MapEvents.damageMultiplier(src(b)),2.5);assert.equal(P.MapEvents.damageMultiplier(src(a)),1);
 P.state.player=a;assert.equal(P.MapEvents.damageMultiplier(src(b)),2.5,'independiente del jugador activo');
 const ank={extinctionDino:true,dinoKind:'ankylosaur',x:0,y:0,facing:1};
 assert.equal(P.MapEvents.incomingMultiplier(ank,src(b)),.48,'b esta delante (x=100)');
 assert.equal(P.MapEvents.incomingMultiplier(ank,src(a)),1.3,'a esta detras (x=-100)');
 const meteor={owner:a};assert.equal(P.MapEvents.damageMultiplier(meteor),1);
});
test('Contador de ocupados: busyEnemies coincide con el filtro completo en cada paso',()=>{
 const {sim,P,s,a}=room();P.Difficulty.index=()=>4;s.enemies=[];for(let i=0;i<30;i++){const e=P.Entities.enemy();Object.assign(e,{x:a.x+140+i*8,y:a.y+(i%5)*20,speed:20,rangedCooldown:0,attackProfile:P.Systems.minionAttacks[i%2]});s.enemies.push(e)}
 const full=()=>s.enemies.filter(q=>q.hp>0&&(q.tactic||q.rangedAim||q.burst||q.charge)),orig=P.Systems.busyEnemies;let checks=0,seen=0;
 P.Systems.busyEnemies=function(){const r=orig.call(this),f=full();assert.equal(r.length,f.length);assert.deepEqual(new Set(r),new Set(f));checks++;return r};
 for(let i=0;i<150;i++){sim.tick(.04,[{},{}]);seen+=full().length}assert(checks>0&&seen>0,'se consulto el contador con enemigos ocupados');
});
