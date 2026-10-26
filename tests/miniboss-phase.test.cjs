'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');
for(const map of ['campo','plaza','machu'])test('Segunda fase: '+map+' · umbral, aviso y dos ejecuciones',()=>{
 const sim=new Simulation(map,[0,6]),P=sim.P,s=P.state,M=P.Minibosses,e=M.create(map,{x:0,y:0});s.enemies=[e];s.player.x=200;s.player.y=0;e.attackT=100;P.Terrain.resolve=()=>{};
 e.hp=e.max*.5+1;M.move(e,0);assert(!e.enraged);e.hp=e.max*.5;s.danger=[{miniId:e.miniId},{miniId:999}];M.move(e,0);assert(e.enraged);assert.equal(e.phase,'mini-fury');assert.equal(s.danger.length,1);assert.equal(s.danger[0].miniId,999);assert.equal(M.beginFury(e),false);
 const hp=s.player.hp;s.player.x=e.x;s.player.y=e.y;s.player.inv=0;M.contact(e,[s.player]);assert.equal(s.player.hp,hp);const frozen=JSON.stringify(e);s.mode='pause';P.Game.update(.3);assert.equal(JSON.stringify(e),frozen);s.mode='play';s.player.x=200;s.danger=[];
 const fx=P.Audio.fx,calls=[];P.Audio.fx=name=>calls.push(name);M.furyAudio(e);M.furyAudio(e);assert.deepEqual(calls,['mini-fury-'+map]);P.Audio.fx=fx;
 const reduced=P.Ambient.reduced;P.Ambient.reduced={matches:true};assert.equal(M.pose(e).lift,0);P.Ambient.reduced=reduced;M.move(e,.95);assert.equal(e.phase,'approach');M.move(e,.01);assert.equal(e.phase,'mini-warning');assert.equal(e.comboStep,1);assert.equal(e.chainLeft,1);assert.equal(e.attack,M.primary(e));const aim=e.aim;s.player.y+=80;M.move(e,.2);assert.equal(e.aim,aim);assert.equal(s.danger.length,0);M.move(e,1);
 if(map==='campo'){assert.equal(e.phase,'mini-charge');M.move(e,.9)}
 assert.equal(e.phase,'mini-chain-gap');assert.equal(e.chainLeft,0);const first=s.danger.length;if(map!=='campo')assert.equal(first,map==='plaza'?5:1);const x=e.x,y=e.y;M.move(e,.2);if(map==='plaza'){assert(Math.hypot(e.x-x,e.y-y)>0);assert(M.pose(e).lift>0)}assert.equal(s.danger.length,first);
 M.move(e,.5);assert.equal(e.phase,'mini-warning');assert.equal(e.comboStep,2);assert.equal(e.windup,map==='machu'?1:.8);assert.equal(s.danger.length,first);const secondAim=e.aim;s.player.x-=100;M.move(e,.3);assert.equal(e.aim,secondAim);assert.equal(s.danger.length,first);M.move(e,1);if(map==='campo'){assert.equal(e.phase,'mini-charge');M.move(e,.9)}else assert.equal(s.danger.length,map==='plaza'?10:2);
 assert.equal(e.phase,'mini-recover');assert.equal(e.chainLeft,0);M.move(e,.6);assert.equal(e.phase,'approach');assert.doesNotThrow(()=>JSON.stringify(e));
 M.warn(e,M.catalog[map].attacks[1]);assert.equal(e.comboStep,0);assert.equal(e.chainLeft,0);const kills=s.kills;M.hurt(e,99999,0);M.hurt(e,99999,0);assert.equal(s.kills,kills+1);P.Game.start();assert.equal(M.furyHeard.size,0);
});
test('Salto de segunda fase: colisión y autoridad cooperativa',()=>{
 const sim=new Simulation('plaza',[0,6]),P=sim.P,s=P.state,M=P.Minibosses,e=M.create('plaza',{x:0,y:0});e.enraged=true;e.phase='mini-chain-gap';e.attack='feathers';e.aim=0;e.chainTime=e.chainTotal=.55;e.chainLeft=0;P.Terrain.resolve=(q,old)=>{q.x=old.x;q.y=old.y};M.move(e,.2);assert.equal(e.x,0);assert.equal(e.y,0);
 e.phase='approach';e.enraged=false;e.hp=e.max*.5;s.enemies=[e];P.Systems.spawn=()=>{};for(const p of sim.players){p.x=600;p.y=400;p.fire=100}sim.tick(.04,[{},{}]);assert.equal(sim.snapshot().enemies[0].phase,'mini-fury');assert(sim.snapshot().enemies[0].enraged);assert.doesNotThrow(()=>JSON.stringify(sim.snapshot()));
});

test('HUD superior de minijefes: vida continua, fases y visibilidad',()=>{
 for(const map of ['campo','plaza','machu']){
  const {P}=new Simulation(map,[0,6]),M=P.Minibosses,s=P.state,e=M.create(map,{x:200,y:0});s.mode='play';s.enemies=[e];M.hud();
  assert(P.$('#hud').children.includes(M.status));assert.equal(M.healthFill.style.width,'100%');assert.equal(M.healthPhase.textContent,'FASE 1');
  e.hp=e.max*.5;M.beginFury(e);M.hud();assert.equal(M.healthFill.style.width,'50%');assert.equal(M.healthPhase.textContent,'FASE 2');assert.equal(e.hp,e.max*.5);assert.equal(M.status.dataset.phase,'2');
  e.hp=e.max*.25;s.mode='pause';M.hud();assert.equal(M.healthFill.style.width,'25%');assert.equal(M.status.hidden,false);
  s.encounter={};M.hud();assert(M.status.hidden);s.encounter=null;s.enemies=[];s.miniWarning={map,x:200,y:0};M.hud();assert.equal(M.healthTrack.hidden,true);assert.equal(M.healthPhase.textContent,'SE ACERCA');
  s.miniWarning=null;M.hud();assert(M.status.hidden);s.enemies=[e];s.mode='end';M.hud();assert(M.status.hidden);s.mode='menu';M.hud();assert(M.status.hidden);
 }
});
