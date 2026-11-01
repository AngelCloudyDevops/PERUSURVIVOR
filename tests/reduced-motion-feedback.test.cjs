'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {Simulation}=require('../backend/simulation.cjs');
const motion=(env)=>{const P={state:{}};vm.runInNewContext(fs.readFileSync('src/rendering/ambient.js','utf8'),{P,...env});return P};
const body=(cls)=>({body:{classList:{contains:c=>cls.includes(c)}}}),os=(m)=>({matchMedia:()=>({matches:m})});
test('Movimiento reducido: sistema, clase del cuerpo u opción guardada',()=>{
 assert.equal(motion({...os(false),document:body([])}).Motion.reduced(),false);
 assert.equal(motion({...os(true),document:body([])}).Motion.reduced(),true);
 const P=motion({...os(false),document:body(['ref-reduced-motion'])});assert.equal(P.Motion.reduced(),true);assert.equal(P.Ambient.reduced.matches,true);
 assert.equal(motion({localStorage:{getItem:k=>k==='perusurvivor-option-reduced-motion'?'true':null}}).Motion.reduced(),true);
 assert.equal(motion({}).Motion.reduced(),false);
});
test('Daño: suena una vez (con límite), viñeta roja y legible sin pulso con movimiento reducido',()=>{
 const {P}=new Simulation('campo',[7,0]),s=P.state,p=s.player,fx=P.HurtFx;let sounds=0;P.Audio.fx=n=>{if(n==='hurt')sounds++};
 s.mode='play';p.maxHp=100;p.hp=100;fx.who=null;fx.observe(p);assert.equal(sounds,0);
 p.hp=90;fx.observe(p);assert.equal(sounds,1);assert.ok(fx.power>=.25&&fx.power<=1);
 fx.observe(p);assert.equal(sounds,1);
 const alphas=[],ctx={createRadialGradient:()=>({addColorStop(){}}),save(){},restore(){},fillRect(){alphas.push(ctx.globalAlpha)},globalAlpha:1};
 P.Motion.reduced=()=>false;fx.start=fx.now()-.05;assert.equal(fx.draw(ctx,800,600),true);
 P.Motion.reduced=()=>true;fx.start=fx.now()-.05;assert.equal(fx.draw(ctx,800,600),true);assert.ok(alphas[1]>=.2,'legible con movimiento reducido');fx.power=.25;fx.start=fx.now()-.36;assert.equal(fx.draw(ctx,800,600),true,'dura más y se desvanece en línea');
 fx.start=fx.now()-1;assert.equal(fx.draw(ctx,800,600),false);
 p.hp=100;fx.observe(p);assert.equal(sounds,1);
});
test('Daño en cooperativo: el snapshot crea un jugador nuevo por paquete y la caída de vida igual se detecta',()=>{const {P}=new Simulation('campo',[7,0]),fx=P.HurtFx;let sounds=0;P.Audio.fx=n=>{if(n==='hurt')sounds++};P.state.mode='play';fx.who=null;const snap=hp=>({slot:1,hp,maxHp:100});fx.observe(snap(100));fx.observe(snap(100));assert.equal(sounds,0);fx.observe(snap(88));assert.equal(sounds,1);fx.observe(snap(88));assert.equal(sounds,1);fx.observe({slot:0,hp:50,maxHp:100});assert.equal(sounds,1,'cambiar de jugador no cuenta como daño')});
test('Movimiento reducido: sin sacudida de dominio y parpadeo de invulnerabilidad estable',()=>{
 const {P}=new Simulation('campo',[7,0]),s=P.state;s.sideralDomain={age:1,impactShake:.28,exit:0};
 P.Motion.reduced=()=>false;const a=P.Ultimate.shake();assert.ok(Math.abs(a.x)+Math.abs(a.y)>0);
 P.Motion.reduced=()=>true;const b=P.Ultimate.shake();assert.equal(b.x,0);assert.equal(b.y,0);
 assert.match(fs.readFileSync('src/rendering/world.js','utf8'),/\(P\.Motion\?P\.Motion\.reduced\(\):globalThis\.matchMedia\?\.\('\(prefers-reduced-motion: reduce\)'\)\.matches\)\|\|Math\.floor\(s\.elapsed\/\.09\)%2\)\{ctx\.save\(\);if\(p\.inv>0&&p\.hp>0&&\(P\.Motion\?P\.Motion\.reduced\(\):globalThis\.matchMedia\?\.\('\(prefers-reduced-motion: reduce\)'\)\.matches\)\)ctx\.globalAlpha=\.6/);
});
