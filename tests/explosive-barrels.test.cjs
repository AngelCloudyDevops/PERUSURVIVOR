'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');

function scene(map='campo',characters=[0]){
 const sim=new Simulation(map,characters),P=sim.P,s=P.state,B=P.ExplosiveBarrels;
 P.Systems.spawn=()=>{};P.MapEvents.event=null;s.mode='play';s.mapTime=40;s.elapsed=40;B.reset();B.nextAt=Infinity;s.mapTime=40;s.elapsed=40;
 return{sim,P,s,B,p:sim.players[0]}
}

test('Barriles: aparecen en terreno libre, lejos del jugador y respetan el límite',()=>{
 const {P,B,p}=scene();P.Terrain.hit=()=>null;const barrel=B.spawn(p);
 assert(barrel);assert.equal(barrel.dynamite,true);assert(Math.hypot(barrel.x-p.x,barrel.y-p.y)>210);assert.equal(B.cap(),3);
 for(let i=0;i<8;i++)B.spawn(p);assert(B.targets().length<=3);assert(B.targets().every(b=>b.hp===36));
});

test('Disparos detonan el barril, dañan por categoría y dejan fuego temporal',()=>{
 const {P,s,B,p}=scene(),barrel={id:'shot',dynamite:true,x:p.x+70,y:p.y,r:19,hp:20,maxHp:20,flash:0,fuseUntil:0};
 const minion=P.Attributes.init({x:barrel.x+10,y:barrel.y,hp:100,max:100,r:13,speed:70,design:0}),boss=P.Attributes.init({x:barrel.x,y:barrel.y+20,hp:1000,max:1000,r:26,speed:50,boss:true,design:0});boss.boss=true;s.enemies=[minion,boss];s.dynamicBarrels=[barrel];p.hp=p.maxHp;
 const shot={x:barrel.x+25,y:barrel.y,vx:500,vy:0,power:25,life:1,age:0,history:[],hits:new Set(),remaining:1};assert(B.hitShot(shot,barrel.x-25,barrel.y));assert(barrel.detonated);assert.equal(B.fires().length,1);assert.equal(B.blasts().length,1);assert(minion.hp<=55);assert(boss.hp<=975&&boss.hp>900);assert.equal(p.hp,p.maxHp*.92);
});

test('Explosiones encadenadas usan mecha y el fuego superpuesto no acumula pulsos',()=>{
 const {s,B,p}=scene(),a={id:'a',x:p.x+90,y:p.y,r:19,hp:1,maxHp:1},b={id:'b',x:p.x+190,y:p.y,r:19,hp:36,maxHp:36};s.dynamicBarrels=[a,b];
 B.detonate(a);assert(b.fuseUntil>s.elapsed);assert.equal(b.detonated,undefined);s.elapsed=b.fuseUntil+.01;B.tick(.3);assert(b.detonated);assert.equal(B.fires().length,2);
 B.reset();B.nextAt=Infinity;p.hp=p.maxHp;s.barrelFires=[{id:'one',x:p.x,y:p.y,r:80,tickIn:0,expiresAt:s.mapTime+4},{id:'two',x:p.x,y:p.y,r:80,tickIn:0,expiresAt:s.mapTime+4}];B.tick(.1);assert(Math.abs(p.hp-p.maxHp*.996)<1e-8,'Dos fuegos superpuestos aplican un solo pulso');s.mapTime+=5;B.tick(.1);assert.equal(B.fires().length,0);
});

test('Barriles cooperativos: servidor autoritativo y snapshot serializable',()=>{
 const {sim,s,B}=scene('plaza',[0,6]);s.dynamicBarrels=[{id:'coop-barrel',x:120,y:80,r:19,hp:36,maxHp:36}];s.barrelFires=[{id:'coop-fire',x:120,y:80,r:72,tickIn:.3,expiresAt:50}];s.barrelBlasts=[{id:'coop-blast',x:120,y:80,r:132,started:39.8,expiresAt:40.3}];const snapshot=JSON.parse(JSON.stringify(sim.snapshot()));assert.equal(snapshot.dynamicBarrels[0].id,'coop-barrel');assert.equal(snapshot.barrelFires[0].id,'coop-fire');assert.equal(snapshot.barrelBlasts[0].id,'coop-blast');assert.doesNotThrow(()=>JSON.stringify(snapshot));B.reset();assert.equal(s.dynamicBarrels.length,0);
});
