'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {Simulation}=require('../backend/simulation.cjs'),{encodeState}=require('../backend/state-wire.cjs');
// Reference: the original replacer-based implementation. The wire format must not change.
function reference(state){
 const visual=({combatStats,hits,hitSlots,...item})=>item;
 const packet={...state};for(const key of ['shots','fields','danger'])if(packet[key])packet[key]=packet[key].map(visual);
 return JSON.stringify(packet,function(key,value){
  if((key==='x'||key==='y')&&typeof value==='number'&&typeof this.x==='number'&&typeof this.y==='number'&&(Math.abs(this.x)>1||Math.abs(this.y)>1))return Math.round(value*100)/100;
  return value;
 });
}
function mulberry32(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
test('encodeState equals the reference on real simulation snapshots',()=>{
 const real=Math.random;Math.random=mulberry32(20240607);
 try{
  const sim=new Simulation('campo',[2,3],undefined,null,'chaos'),P=sim.P,s=P.state;
  for(const p of sim.players){p.hp=p.maxHp=1e9;p.inv=0;p.rate=.08}
  let t=0,checked=0;
  for(let i=0;i<120;i++){
   let g=0;while(s.enemies.length<120&&g++<480){const e=P.Entities.enemy();if(!P.Terrain.hit(e.x,e.y,e.r+4))s.enemies.push(e)}
   if(sim.activities.pending)sim.activities.pending=null;s.xp=Math.min(s.xp,s.need-1);
   sim.tick(.04,[0,1].map(k=>({x:Math.cos(t*.35+k*Math.PI),y:Math.sin(t*.35+k*Math.PI)})));t+=.04;
   if(i%2===0){const snap=sim.snapshot();assert.equal(encodeState(snap),reference(snap),'tick '+i);checked++}
  }
  assert.ok(checked>=50);
 }finally{Math.random=real}
});
test('encodeState equals the reference on edge values',()=>{
 const cases=[
  {enemies:[{x:NaN,y:5},{x:Infinity,y:-Infinity},{x:-0,y:2},{x:-0.001,y:-0.002},{x:0.5,y:0.7},{x:.123456,y:.9},{x:1.005,y:2.675},{x:12345.6789,y:undefined},{y:300.456},{x:1e21,y:1e-9},{x:'7.77',y:8.888}]},
  {shots:[{x:3.14159,y:2.71828,combatStats:{x:9.999,y:9.999},hits:[1],hitSlots:{a:1},aim:{x:.6,y:.8},history:[{x:10.1234,y:5.6789},[{x:1.2345,y:100.5555}]]}],fields:[{x:2.345,y:7.891,hits:1}],danger:[{x:1.5,y:1.5,hitSlots:[]}]},
  {nested:[[[{x:5.5555,y:6.6666}],[]],null,undefined,()=>1,Symbol('s')],u:undefined,f(){},n:null,m:new Map([[1,{x:1.234,y:5.678}]]),st:new Set([{x:1.234,y:5.678}]),d:new Date(0),j:{toJSON(){return {x:1.2345,y:9.8765}}},jn:{toJSON(){return null}},s:'x\u2028"y"',b:true},
  {x:123.456,y:789.012,inner:{x:1.23456,y:0.1},list:[{x:0.4,y:1.234567}]},
  {},{enemies:[]},
 ];
 for(const c of cases)assert.equal(encodeState(c),reference(c));
});
