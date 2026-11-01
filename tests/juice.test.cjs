'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const load=(reduced=false,extra={})=>{const P={state:{mode:'play',enemies:[],effects:[]},World:{render(){}},Core:{},Combat:{},Motion:{reduced:()=>reduced},...extra};vm.runInNewContext(fs.readFileSync('src/rendering/juice.js','utf8'),{P});return P};
test('Trauma: se limita a 1 y decae hasta 0',()=>{
 const P=load(),J=P.Juice;J.add(.8);J.add(.8);assert.equal(J.trauma,1);
 J.step(10);J.step(10.2);assert.ok(Math.abs(J.trauma-(1-1.3*.2))<1e-9);
 for(let t=11;t<14;t+=.2)J.step(t);assert.equal(J.trauma,0);
});
test('Desplazamiento: 0 con movimiento reducido, acotado y compensado por zoom',()=>{
 let P=load(true);P.Juice.add(1);let o=P.Juice.offset(1,[],5);assert.equal(Math.abs(o.x)+Math.abs(o.y),0);
 P=load(false);P.Juice.add(1);let max1=0,max2=0;for(let i=0;i<60;i++){const J=P.Juice;J.trauma=1;J.clock=null;J.phase=i*.05;const a=J.offset(1,[],1);max1=Math.max(max1,Math.abs(a.x));J.trauma=1;J.clock=null;J.phase=i*.05;const b=J.offset(2,[],1);max2=Math.max(max2,Math.abs(b.x))}
 assert.ok(max1>1&&max1<=14.01);assert.ok(Math.abs(max2*2-max1)<1e-6,'pantalla constante');
 P.Juice.scale=0;P.Juice.trauma=1;assert.equal(Math.abs(P.Juice.own().x),0);
});
test('Suma de fuentes: se acota el total',()=>{
 const P=load(false),o=P.Juice.offset(1,[{x:40,y:-40},{x:40,y:-40}],1);assert.equal(o.x,18);assert.equal(o.y,-18);
 assert.equal(P.Juice.offset(2,[{x:100,y:0}],2).x,9);
});
test('Derrota de jefe: un solo golpe de trauma y ráfaga; miniboss menor; sin falsos positivos',()=>{
 const P=load(false),s=P.state,boss={boss:true,hp:10,x:5,y:6},mini={miniboss:true,hp:3,x:1,y:1};s.enemies=[boss,mini];
 P.Juice.observe();assert.equal(P.Juice.trauma,0);
 boss.hp=0;P.Juice.observe();P.Juice.observe();assert.equal(P.Juice.trauma,.8);assert.equal(s.effects.length,30);assert.equal(P.Juice.flash.on,true);
 s.enemies=[mini];P.Juice.observe();assert.equal(P.Juice.trauma,.8);
 P.Juice.trauma=0;mini.hp=0;P.Juice.observe();assert.equal(P.Juice.trauma,.45);
 const q=load(false);q.state.enemies=[{boss:true,hp:5}];q.Juice.observe();q.state.enemies=[];q.Juice.observe();assert.equal(q.Juice.trauma,0);
 const sv=load(false,{Combat:{server:true}});sv.state.enemies=[{boss:true,hp:0}];sv.Juice.observe();assert.equal(sv.Juice.trauma,0);
});
test('Ulti base: el temblor decae sin corte brusco',()=>{
 const P={Motion:{reduced:()=>false},state:{ultimate:{age:0,paper:0}}};vm.runInNewContext(fs.readFileSync('src/systems/ultimate.js','utf8'),{P,document:{}});
 P.Ultimate.active=()=>true;const m=a=>{P.state.ultimate.age=a;const v=P.Ultimate.shake();return Math.hypot(v.x,v.y)};
 assert.ok(m(.39)<.1);assert.ok(m(.2)<m(.05)+4);
});
