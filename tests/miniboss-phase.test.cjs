'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');
for(const map of ['campo','plaza','machu'])test('Segunda fase: '+map+' · umbral, aviso y dos ejecuciones',()=>{
 const sim=new Simulation(map,[0,6]),P=sim.P,s=P.state,M=P.Minibosses,e=M.create(map,{x:0,y:0});s.enemies=[e];s.player.x=200;s.player.y=0;e.attackT=100;P.Terrain.resolve=()=>{};P.Terrain.clear=()=>true;
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

test('Flecha de minijefe: ocho sentidos, zoom, regreso, muerte y arena',()=>{
 const {P}=new Simulation('campo',[0,6]),M=P.Minibosses,s=P.state,e=M.create('campo',{x:0,y:0});s.enemies=[e];s.mode='play';assert.equal(M.edgePoint(e,0,0,1280,720,1.3),null);
 for(const [x,y] of [[3000,0],[-3000,0],[0,3000],[0,-3000],[3000,3000],[-3000,-3000],[3000,-3000],[-3000,3000]])for(const [w,h,z] of [[1280,720,1.3],[390,844,.95]]){e.x=x;e.y=y;const q=M.edgePoint(e,0,0,w,h,z);assert(q);assert(q.x>=79&&q.x<=w-79);assert(q.y>=0&&q.y<=h);assert(Math.cos(q.angle*Math.PI/180)*x+Math.sin(q.angle*Math.PI/180)*y>0)}
 e.x=3000;M.indicator(0,0,390,844,.95);assert.equal(M.arrow.hidden,false);e.x=e.y=0;M.indicator(0,0,390,844,.95);assert(M.arrow.hidden);e.x=3000;s.encounter={};M.indicator(0,0,390,844,.95);assert(M.arrow.hidden);s.encounter=null;e.hp=0;M.indicator(0,0,390,844,.95);assert(M.arrow.hidden);
});
test('Audio propio: eventos serializados únicos y pausa sin repetición',()=>{
 const {P}=new Simulation('campo',[0,6]),M=P.Minibosses,s=P.state,calls=[];P.Audio.mini=(map,event)=>calls.push(map+':'+event);s.mode='play';
 for(const map of ['campo','plaza','machu']){const e=M.create(map,{x:0,y:0});s.enemies=[e];s.effects=[];M.soundEvents();M.warn(e,M.primary(e));M.soundEvents();M.soundEvents();assert.equal(calls.filter(c=>c===map+':attack').length,1);e.chainLeft=0;M.recover(e);s.mode='pause';M.soundEvents();assert(!calls.includes(map+':recover'));s.mode='play';M.soundEvents();assert(calls.includes(map+':recover'));s.enemies=[];s.effects=[{...e,kind:'miniboss-death'}];M.soundEvents();M.soundEvents();assert.equal(calls.filter(c=>c===map+':defeat').length,1)}
});
test('Motivos sintetizados distintos y silencio respetado',()=>{
 const {P}=new Simulation('campo',[0,6]),a=P.Audio,notes=[];a.ctx={currentTime:1};a.muted=false;a.blurred=false;P.state.mode='play';a.tone=(...n)=>notes.push(n);let time=1;
 for(const map of ['campo','plaza','machu'])for(const event of ['entry','attack','recover','defeat']){a.ctx.currentTime=time++;const before=notes.length;a.mini(map,event);assert(notes.length>before)}
 assert(new Set(notes.map(n=>n[0])).size>8);const count=notes.length;a.muted=true;a.mini('campo','entry');assert.equal(notes.length,count);a.muted=false;P.state.mode='pause';a.mini('plaza','defeat');assert.equal(notes.length,count);
});

test('Legibilidad: spawn reducido, exclusión, conservación y retorno normal',()=>{
 const {P}=new Simulation('campo',[0,6]),M=P.Minibosses,s=P.state;const normal=M.spawnPolicy(),e=M.create('campo',{x:0,y:0});s.enemies=[e];const reduced=M.spawnPolicy();assert.equal(reduced.interval,normal.interval*2.5);assert(reduced.cap<normal.cap);assert(!M.spawnSafe({x:100,y:0,r:13}));assert(M.spawnSafe({x:500,y:0,r:13}));
 s.devRun=false;s.spawn=0;s.enemies.push(...Array.from({length:normal.cap},()=>({hp:100,x:10,y:10})));const count=s.enemies.length;M.tick=()=>{};P.Systems.spawn(.04);assert.equal(s.enemies.length,count);e.hp=0;assert.equal(M.spawnPolicy().interval,normal.interval);
});
test('Premio y resumen: una vez por ventana, mitigación real y sin premio de práctica',()=>{
 const {P}=new Simulation('campo',[0,6]),M=P.Minibosses,s=P.state,e=M.create('campo',{x:0,y:0});s.enemies=[e];s.elapsed=12;e.combatStart=2;e.hp=10000;e.max=10000;
 e.phase='mini-recover';e.soundRecover=1;M.hurt(e,1,0);M.hurt(e,1,0);assert.equal(e.counterWindows,1);e.soundRecover=2;M.hurt(e,1,0);assert.equal(e.counterWindows,2);
 s.player.inv=0;s.player.equipmentReduction=.5;P.PlayerFeedback.hit(s.player,20);assert.equal(e.damageTaken,10);const coins=s.coins;M.hurt(e,99999,0);assert.equal(s.coins,coins+10);assert.equal(s.miniReport.time,10);assert.equal(s.miniReport.damage,10);assert.equal(s.miniReport.windows,2);M.hurt(e,99999,0);assert.equal(s.coins,coins+10);assert.doesNotThrow(()=>JSON.stringify(s.miniReport));
 s.devRun=true;const practice=M.create('campo',{x:0,y:0});s.enemies=[practice];M.hurt(practice,99999,0);assert.equal(s.coins,coins+10);assert(s.miniReport.practice);
});
test('Visitas: tres niveles, igual cantidad de proyectiles y variación suprimida con multitud',()=>{
 const {P}=new Simulation('plaza',[0,6]),M=P.Minibosses,s=P.state;M.partySize=()=>1;const visits=Array.from({length:5},()=>M.create('plaza',{x:0,y:0}));assert.equal(visits.map(e=>e.tier).join(','),'0,1,2,2,2');assert.equal(visits[4].speed,M.catalog.plaza.speed*1.1);
 const e=visits[4];s.enemies=[e];M.warn(e,'feathers');assert.equal(e.variation,2);s.danger=[];M.fire(e);assert.equal(s.danger.length,5);s.enemies.push(...Array.from({length:35},()=>({hp:1})));M.warn(e,'feathers');assert.equal(e.variation,0);s.danger=[];M.fire(e);assert.equal(s.danger.length,5);
});
test('Tarjeta lateral: entrada, resumen, pausa y snapshot cooperativo',()=>{
 const sim=new Simulation('machu',[0,6]),P=sim.P,M=P.Minibosses,s=P.state,e=M.create('machu',{x:0,y:0});s.enemies=[e];M.hud();assert(M.card.textContent.includes('No debiste despertarlo'));M.hurt(e,99999,0);s.enemies=[];M.encounterCard();assert(M.card.textContent.includes('Daño recibido'));assert(sim.snapshot().miniReport);s.mode='pause';M.encounterCard();assert.equal(M.card.hidden,false);s.elapsed+=9;M.encounterCard();assert(M.card.hidden);M.reset();assert.equal(s.miniReport,null);
});

test('Navegación: los tres rodean muros, salen de U y evitan fuentes sin atravesar geometría',()=>{
 for(const map of ['campo','plaza','machu'])for(const layout of ['wall','u','fountain']){
  const {P}=new Simulation(map,[0,6]),M=P.Minibosses,s=P.state,e=M.create(map,{x:layout==='u'?-110:-270,y:0});s.enemies=[e];s.player.x=270;s.player.y=0;e.attackT=10000;
  const rectangles=layout==='u'?[{x:0,y:0,w:70,h:360},{x:-140,y:-180,w:280,h:50},{x:-140,y:180,w:280,h:50}]:[{x:0,y:0,w:120,h:360}];
  P.Terrain.hit=(x,y,r)=>layout==='fountain'?Math.hypot(x/(140+r),y/(95+r))<1?{}:null:rectangles.find(o=>x>o.x-o.w/2-r&&x<o.x+o.w/2+r&&y>o.y-o.h/2-r&&y<o.y+o.h/2+r);
  P.Terrain.resolve=(q,old,r)=>{if(P.Terrain.hit(q.x,q.y,r)){q.x=old.x;q.y=old.y}};
  for(let i=0;i<1000&&Math.hypot(e.x-s.player.x,e.y-s.player.y)>125;i++){M.move(e,.04);assert(!P.Terrain.hit(e.x,e.y,e.r),'Sin penetrar cobertura');assert((e.navExpanded||0)<=900)}
  assert(Math.hypot(e.x-s.player.x,e.y-s.player.y)<=125,map+' '+layout+' llega rodeando el obstáculo');assert.doesNotThrow(()=>JSON.stringify(e));
 }
});
test('Ruta: bloqueo cercano, objetivo móvil y terreno modificado',()=>{
 const {P}=new Simulation('campo',[0,6]),M=P.Minibosses,s=P.state,e=M.create('campo',{x:-50,y:0});s.player.x=50;s.player.y=0;e.attackT=10000;let solid=true;P.Terrain.hit=(x,y,r)=>solid&&Math.abs(x)<10+r&&Math.abs(y)<90+r?{}:null;P.Terrain.resolve=(q,old,r)=>{if(P.Terrain.hit(q.x,q.y,r)){q.x=old.x;q.y=old.y}};M.move(e,.04);assert(e.navPath?.length>0);assert.notEqual(e.y,0);s.player.y=300;M.navigate(e,s.player,.04);assert.equal(e.navGoal.y,300);solid=false;const dir=M.navigate(e,s.player,.04);assert.equal(e.navPath.length,0);assert(dir.y>0);
});
test('Agotamiento: poses distintas, cuerpo completo, pausa y movimiento reducido',()=>{
 const {P}=new Simulation('campo',[0,6]),M=P.Minibosses,poses=[];for(const map of ['campo','plaza','machu']){const e=M.create(map,{x:0,y:0});e.phase='mini-recover';e.recoveryTotal=1.5;e.recovery=1;e.ambientTime=1;poses.push(JSON.stringify(M.pose(e)));assert.equal(M.frame(e),map==='plaza'?1:0);const first=JSON.stringify(M.pose(e));assert.equal(JSON.stringify(M.pose(e)),first);P.Ambient.reduced={matches:true};const still=JSON.stringify(M.pose(e));e.ambientTime=7;assert.equal(JSON.stringify(M.pose(e)),still);P.Ambient.reduced={matches:false};}assert.equal(new Set(poses).size,3);
});
