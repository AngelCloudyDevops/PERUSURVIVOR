'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');
function setup(){const sim=new Simulation('machu',[0]),P=sim.P,s=P.state;P.Game.start();P.$('#lab-boss').value='machu';P.Lab.run();const e=s.enemies[0],p=s.player;return {P,s,e,p,G:P.GuardianBoss}}

test('Guardián: controlador exclusivo y cuatro patrones propios',()=>{const {P,G,e}=setup(),g=G.init(e),phases=[];assert(G.eligible(e));for(let i=0;i<4;i++){G.start(e);phases.push(g.phase);G.recover(e,0);g.phase='idle'}assert.deepEqual(phases,['ring','refuges','terraces','record']);const entry=P.Lobby.codexEntries().find(x=>x.guardianKit==='niebla'),contract=P.EnemyContract.describe(entry);assert.equal(entry.attacks.length,4);assert.equal(contract.reserved,0);assert.equal(contract.completion,100)});

test('Velo quebrado y Memoria de piedra obligan a acercarse y rotar cuadrantes',()=>{const {P,e,p,G}=setup(),g=G.init(e);Object.assign(p,{x:e.x+400,y:e.y});assert.equal(G.outgoingMultiplier(e),.65);p.x=e.x+100;assert.equal(G.outgoingMultiplier(e),1);p.inv=0;p.hp=100;Object.assign(p,{x:120,y:120});G.memory(e,.01);G.memory(e,3.6);assert(g.mark);G.memory(e,.81);assert(p.hp<100);const damage=P.Attributes.outgoing(e,100,P.Attributes.source(p));assert(damage>0)});

test('Refugios, terrazas y eco resuelven lectura, altura y memoria de ruta',()=>{const {e,p,G}=setup(),g=G.init(e);G.refuges(e);Object.assign(p,g.zones[g.safe]);g.timer=0;G.tickSpecial(e,.01);assert.equal(g.phase,'recover');G.terraces(e);p.y=(g.bands[g.safe].top+g.bands[g.safe].bottom)/2;g.timer=0;G.tickSpecial(e,.01);assert.equal(g.phase,'recover');G.echo(e);for(let i=0;i<14;i++){p.x=i*20;G.tickSpecial(e,.12)}assert.equal(g.phase,'replay');assert(g.path.length>5)});

test('Ciudad Perdida y Juicio del Apu tienen objetivos distintos',()=>{const {s,e,p,G}=setup(),g=G.init(e);G.domain(e);for(const beacon of g.beacons){Object.assign(p,beacon);G.tickSpecial(e,.01)}assert.equal(g.phase,'recover');assert(g.domainUsed);G.ultimate(e);Object.assign(p,g.echoes[g.trueEcho]);G.tickSpecial(e,.01);assert.equal(g.phase,'recover');assert(g.ultimateUsed);assert(g.noticeUntil>s.elapsed)});
