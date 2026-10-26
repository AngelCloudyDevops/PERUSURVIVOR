'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {Simulation}=require('../backend/simulation.cjs');

function setup(){const sim=new Simulation('campo',[0,7]),P=sim.P,p=sim.players[0];sim.use(p);P.state.mode='play';P.Terrain.hit=()=>null;P.Terrain.active=()=>[];P.Muzzle.blocker=()=>null;P.Progression.init(p);return {sim,P,p}}

test('Combi Express exige tarjetas y velocidad, se registra y crea tarjetas con rebotes',()=>{
 const {P,p}=setup();assert.equal(P.Progression.comboReady(p,'express'),false);
 P.Progression.apply(p,'cards');P.Progression.apply(p,'stat:speed');assert.equal(P.Progression.comboReady(p,'express'),true);
 P.Progression.apply(p,'combo:express');assert.equal(p.combos.express,true);assert(p.runChoices.includes('combo:express'));
 p.powerTimers.cards=0;P.state.enemies=[{x:p.x+100,y:p.y,hp:100,max:100,r:12},{x:p.x+190,y:p.y+20,hp:100,max:100,r:12}];P.Progression.tick(.02);
 const shot=P.state.shots.find(q=>q.source==='cards');assert(shot);assert.equal(shot.combo,'express');assert.equal(shot.bounces,2);assert.equal(shot.color,'#ffd35c');
});

test('El rebote busca otro rival y el reporte limita el daño sobrante',()=>{
 const {P,p}=setup(),first={x:40,y:0,hp:30,max:30,r:12},second={x:120,y:30,hp:80,max:80,r:12};P.state.enemies=[first,second];
 const shot={x:40,y:0,vx:500,vy:0,hits:new Set([first]),bounces:2,life:.1};assert.equal(P.Combat.bounce(shot,first),true);assert.equal(shot.bounces,1);assert(shot.vy>0);assert(shot.life>=.55);
 P.Entities.hurt(first,999,0,{source:'cards',combo:'express'});const report=P.DamageStats.report(p);assert.equal(report.total,30);assert.equal(JSON.stringify(report.powers.map(q=>[q.id,q.value])),JSON.stringify([['cards',30]]));assert.equal(JSON.stringify(report.combo),JSON.stringify({name:'Combi Express',value:30}));
});

test('El catálogo expone las tres recetas del árbol de combinaciones',()=>{
 const {P}=setup();assert.equal(Object.keys(P.Progression.combos).join(','),'direct,press,express');assert.equal(P.Progression.combos.express.needs.join(','),'cards,stat:speed');
});
