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
 assert.equal(e.phase,'mini-recover');assert.equal(e.chainLeft,0);M.move(e,1.6);assert.equal(e.phase,'approach');assert.doesNotThrow(()=>JSON.stringify(e));
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

test('Contraataque: fin de combo, choque y daño extra sin contacto',()=>{
 for(const map of ['campo','plaza','machu']){
  const {P}=new Simulation(map,[0,6]),M=P.Minibosses,e=M.create(map,{x:0,y:0});P.state.enemies=[e];e.attack=M.primary(e);e.phase='mini-charge';e.chainLeft=1;M.recover(e);assert.equal(e.phase,'mini-chain-gap');
  e.phase='mini-charge';M.recover(e);assert.equal(e.phase,'mini-recover');assert.equal(e.recovery,1.5);const hp=e.hp;M.hurt(e,20,0);assert.equal(e.hp,hp-27);const p=P.state.player;p.x=0;p.y=0;p.inv=0;const health=p.hp;M.contact(e,[p]);assert.equal(p.hp,health);M.move(e,1);assert.equal(e.phase,'mini-recover');M.move(e,.5);assert.equal(e.phase,'approach');
  e.phase='mini-charge';e.chainLeft=1;M.recover(e,true);assert.equal(e.phase,'mini-recover');assert.equal(e.chainLeft,0);assert.equal(e.recovery,2);
 }
});
test('Cobertura: plumas no atraviesan muros finos y onda del huaco es radial',()=>{
 const {P}=new Simulation('machu',[0,6]),M=P.Minibosses,e=M.create('machu',{x:0,y:0});P.Terrain.hit=x=>x>=49&&x<=51?{}:null;
 assert(M.coverBlocked({x:100,y:0,vx:200,vy:0,minion:true,kind:'spread'},.5));assert(!M.coverBlocked({x:100,y:20,vx:200,vy:0,minion:true,kind:'stomp'},.5));
 e.attack='quake';M.fire(e);assert.equal(P.state.danger.at(-1).groundWave,true);
});

test('Derrotas propias: cuerpo, fragmentos, pausa y resultado diferido',()=>{
 for(const map of ['campo','plaza','machu']){
  const {P}=new Simulation(map,[0,6]),M=P.Minibosses,s=P.state,e=M.create(map,{x:200,y:0});s.enemies=[e];s.miniLab=map;const kills=s.kills;M.hurt(e,99999,0);M.hurt(e,99999,0);assert.equal(s.kills,kills+1);
  const fx=s.effects.find(q=>q.kind==='miniboss-death');assert.equal(fx.maxLife,2.2);assert.equal(s.miniLabFinish,2.2);const frozen=fx.life;s.mode='pause';P.Game.update(.4);assert.equal(fx.life,frozen);
  M.sheets[map]={ready:true,height:100,cells:Array.from({length:4},()=>({image:{},x:0,y:0,w:80,h:100}))};const calls=[],ctx=new Proxy({drawImage(...args){calls.push(args)}},{get:(o,k)=>o[k]||(()=>{})});M.drawDefeat(ctx,fx,.5);assert.equal(calls.length,map==='machu'?16:1);assert(calls.every(args=>args.slice(1).every(Number.isFinite)));assert.equal(M.defeatPose(map,1).alpha,0);
  if(map==='plaza')assert(M.defeatPose(map,.6).angle>1);if(map==='machu')assert(M.defeatPose(map,.6).spread>0);
  P.Ambient.reduced={matches:true};calls.length=0;M.drawDefeat(ctx,fx,.5);assert.equal(calls.length,1);assert.equal(M.defeatPose(map,.6).angle,0);assert.equal(M.defeatPose(map,.6).spread,0);
  let finished=0;P.Lab.finish=()=>finished++;s.mode='play';M.tick(1.5);assert.equal(finished,0);M.tick(.8);assert.equal(finished,1);M.tick(.1);assert.equal(finished,1);
 }
});
