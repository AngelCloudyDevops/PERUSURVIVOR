'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');

test('Gallinazo: la picada consume exactamente la ruta anunciada con fotogramas irregulares',()=>{
 const {P}=new Simulation('campo',[0]),s=P.state;P.$('#lab-boss').value='vulture';P.Lab.run();const e=s.enemies[0],hit=P.Terrain.hit,resolve=P.Terrain.resolve,bounds=s.encounter.scene.bounds;
 P.Terrain.hit=()=>false;P.Terrain.resolve=()=>{};s.encounter.scene.bounds={left:-2000,right:2000,top:-2000,bottom:2000};Object.assign(e,{x:0,y:0});Object.assign(s.player,{x:800,y:0});P.Vulture.warn(e,'dive');assert.equal(e.diveLength,448);e.diveRemaining=1;e.windup=0;P.Vulture.move(e,.01);const start=e.x;
 for(const dt of [.13,.07,.19,.11,.3,.4])if(e.phase==='vulture-dive')P.Vulture.move(e,dt);
 assert.equal(e.phase,'vulture-recover');assert(Math.abs(e.x-start-e.diveLength)<.001);P.Terrain.hit=hit;P.Terrain.resolve=resolve;s.encounter.scene.bounds=bounds;
});

test('Minijefes: embestida y picada muestran la distancia real y la acortan ante cobertura',()=>{
 const {P}=new Simulation('campo',[0]),s=P.state,M=P.Minibosses;P.Game.start();const hit=P.Terrain.hit,resolve=P.Terrain.resolve;P.Terrain.hit=()=>false;P.Terrain.resolve=()=>{};
 for(const [map,attack] of [['campo','charge'],['plaza','peck']]){const e=M.create(map,{x:0,y:0});Object.assign(s.player,{x:800,y:0});M.warn(e,attack);const shown=e.chargeDistance;e.windup=0;M.move(e,.01);const start=e.x;for(const dt of [.13,.07,.19,.11,.3,.4])if(e.phase==='mini-charge')M.move(e,dt);assert.equal(e.phase,'mini-recover');assert(Math.abs(e.x-start-shown)<.001)}
 const e=M.create('campo',{x:0,y:0});Object.assign(s.player,{x:800,y:0});P.Terrain.hit=x=>x+e.r>=180;P.Terrain.resolve=(q,old)=>{if(P.Terrain.hit(q.x,q.y,q.r))Object.assign(q,old)};M.warn(e,'charge');assert(e.chargeDistance>0&&e.chargeDistance<272);const shown=e.chargeDistance;e.windup=0;M.move(e,.01);const start=e.x;for(let i=0;i<30&&e.phase==='mini-charge';i++)M.move(e,.04);assert.equal(e.phase,'mini-recover');assert(Math.abs(e.x-start-shown)<=6,JSON.stringify({start,end:e.x,shown,difference:e.x-start-shown}));P.Terrain.hit=hit;P.Terrain.resolve=resolve;
});
