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
test('Separacion: dos minions solapados en fila se separan sin atravesar paredes',()=>{
 const {sim,P,s,a}=room(),mk=(x,y,id)=>{const e=enemy(P,x,y);Object.assign(e,{speed:60,minionId:id,rangedCooldown:99});return e};
 const e1=mk(a.x+300,0,1),e2=mk(a.x+305,0,2);s.enemies=[e1,e2];const gap=()=>Math.hypot(e1.x-e2.x,e1.y-e2.y);assert(gap()<6);
 for(let i=0;i<30;i++)sim.tick(.04,[{},{}]);assert(gap()>e1.r+e2.r-4,'se separaron (hueco '+gap().toFixed(1)+')');
 const run=()=>{const g=room();const [x,y]=[g.a.x+300,0];const l=g.s.enemies=[1,2,3].map(i=>{const e=enemy(g.P,x+i*3,0);Object.assign(e,{speed:60,minionId:i,rangedCooldown:99});return e});for(let i=0;i<20;i++)g.sim.tick(.04,[{},{}]);return l.map(e=>[e.x,e.y].join()).join('|')};
 assert.equal(run(),run(),'determinista');
 assert(!P.Terrain.hit(e1.x,e1.y,e1.r));
});
test('Atasco: un minion que empuja recto contra una pared se desliza de lado y la rodea',()=>{
 const {P,s,a}=room(),wall={x:0,y:0,w:40,h:100,solid:true};Object.assign(a,{x:400,y:0});s.encounter={obstacles:[wall],definition:{kind:'test'}};
 const e=enemy(P,-60,0);Object.assign(e,{speed:100,minionId:2,rangedCooldown:99});s.enemies=[e];
 const step=()=>{s.elapsed+=.04;P.Systems.beginTick();P.Systems.stepEnemy(e,[a],.04);P.Systems.endTick()};
 for(let i=0;i<10;i++)step();assert(e.x<=-20+1&&Math.abs(e.y)<5,'al principio esta pegado a la pared');
 for(let i=0;i<100;i++)step();assert(e.x>40,'rodeo la pared (x='+e.x.toFixed(0)+', y='+e.y.toFixed(0)+')');assert(!P.Terrain.hit(e.x,e.y,e.r));
});
