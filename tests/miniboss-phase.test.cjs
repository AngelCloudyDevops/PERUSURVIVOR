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

test('Matriz minijefes: corto alcance, escopeta y proyectiles aprovechan recuperación sin contacto',()=>{
 for(const map of ['campo','plaza','machu'])for(const id of ['g5','cuy','kingteka','sustento']){
  const index=new Simulation('campo',[0]).P.Data.characters.findIndex(c=>c.id===id),sim=new Simulation(map,[index]),P=sim.P,s=P.state,p=s.player,M=P.Minibosses,e=M.create(map,{x:0,y:0});P.Terrain.active=()=>[];P.Terrain.hit=()=>null;P.Progression.tick=()=>{};s.enemies=[e];e.hp=e.max=10000;M.recover(e);p.x=-200;p.y=0;p.inv=0;s.fire=0;const hp=p.hp,near=['g5','cuy'].includes(id)?90:160;
  for(let step=0;step<36;step++){s.elapsed+=.04;if(Math.abs(p.x)>near)p.x+=p.speed*.04;M.move(e,.04);P.Combat.tick(.04);M.contact(e,[p])}
  assert(e.hp<10000,map+' '+id+' conecta dentro de la ventana');assert.equal(p.hp,hp);assert.equal(e.counterWindows,1);assert.equal(s.effects.filter(q=>q.kind==='mini-counter').length,1);
 }
});
test('Cobertura de minijefes: melee, área, bandas y tiradores no eligen objetivos tras paredes',()=>{
 for(const id of ['g5','cuy','alberto','kingteka','sustento']){
  const index=new Simulation('campo',[0]).P.Data.characters.findIndex(c=>c.id===id),{P}=new Simulation('campo',[index]),s=P.state,p=s.player,e=P.Minibosses.create('campo',{x:100,y:0});p.x=p.y=0;s.enemies=[e];P.Terrain.active=()=>[];P.Terrain.hit=(x,y,r=0)=>x>40-r&&x<50+r&&Math.abs(y)<150+r?{solid:true,hp:Infinity}:null;P.Progression.tick=()=>{};const hp=e.hp;
  assert.equal(P.Combat.cast(),false,id+' no apunta a través del muro');s.fields=[{x:0,y:0,r:200,power:100,life:1,tick:0}];s.fire=100;P.Combat.tick(.04);assert.equal(e.hp,hp,id+' nube respeta cobertura');P.Terrain.hit=()=>null;assert(P.Combat.cast(),id+' puede atacar al salir de cobertura');
 }
});
test('Pared fina: un bumerán no atraviesa la cobertura entre pasos durante minijefe',()=>{
 const {P}=new Simulation('campo',[0]),s=P.state,e=P.Minibosses.create('campo',{x:160,y:0});s.player.x=s.player.y=0;s.enemies=[e];P.Progression.tick=()=>{};P.Terrain.active=()=>[];P.Terrain.hit=x=>x>=45&&x<=47?{solid:true,hp:Infinity}:null;s.fire=100;s.shots=[{x:0,y:0,vx:2000,vy:0,age:0,life:1,history:[],kind:'boomerang',turnAt:2,power:100,hits:new Set(),remaining:Infinity}];const hp=e.hp;P.Combat.tick(.1);assert.equal(e.hp,hp);assert.equal(s.shots.length,0);
});
test('Señales: impacto acotado por material, confirmación única y pausa',()=>{
 for(const map of ['campo','plaza','machu']){const {P}=new Simulation(map,[0]),M=P.Minibosses,s=P.state,e=M.create(map,{x:0,y:0});s.enemies=[e];e.hp=e.max=10000;M.recover(e);for(let i=0;i<20;i++)M.hurt(e,1,0);assert.equal(s.effects.filter(q=>q.kind==='mini-counter').length,1);assert.equal(s.effects.filter(q=>q.kind==='mini-impact').length,1);const impact=s.effects.find(q=>q.kind==='mini-impact');assert.equal(impact.miniMap,map);const life=impact.life;s.mode='pause';P.Game.update(.2);assert.equal(impact.life,life);P.Ambient.reduced={matches:true};e.impactCooldown=0;M.hurt(e,1,0);assert.equal(s.effects.filter(q=>q.kind==='mini-impact').length,1);}
});

test('Nubes tras el objetivo: no permiten esconderse detrás de cobertura',()=>{
 const {P}=new Simulation('campo',[0]),s=P.state,p=s.player,e=P.Minibosses.create('campo',{x:100,y:0});p.x=p.y=0;s.enemies=[e];P.Terrain.active=()=>[];P.Progression.tick=()=>{};P.Terrain.hit=(x,y,r=0)=>x>40-r&&x<50+r?{solid:true,hp:Infinity}:null;s.fire=100;s.fields=[{x:100,y:0,r:200,power:100,life:1,tick:0}];const hp=e.hp;P.Combat.tick(.04);assert.equal(e.hp,hp);P.Terrain.hit=()=>null;s.fields[0].tick=0;P.Combat.tick(.04);assert(e.hp<hp);
});
test('Pantalla cargada: avisos de minijefes se dibujan después de proyectiles y efectos',()=>{
 const {P}=new Simulation('campo',[0]),s=P.state,e=P.Minibosses.create('campo',{x:0,y:220});s.enemies=[e,...Array.from({length:80},(_,i)=>({x:(i%8)*10,y:220,r:12,hp:20,design:0}))];P.Minibosses.warn(e,'charge');s.shots=Array.from({length:200},()=>({x:0,y:220,vx:1,vy:0,history:[],life:1}));s.effects=Array.from({length:100},()=>({kind:'damage',x:0,y:220,life:1,maxLife:1,text:'1'}));const order=[];P.FX.projectile=()=>order.push('projectile');P.FX.effect=()=>order.push('effect');const front=P.Minibosses.foreground.bind(P.Minibosses);P.Minibosses.foreground=ctx=>{order.push('warning');front(ctx)};P.World.render(1000);assert.equal(order.filter(x=>x==='projectile').length,200);assert.equal(order.filter(x=>x==='effect').length,100);assert.equal(order.at(-1),'warning');
});

test('Huaco: acercarse tras terminar la onda permite contraataque melee sin daño',()=>{
 const index=new Simulation('campo',[0]).P.Data.characters.findIndex(c=>c.id==='g5'),{P}=new Simulation('machu',[index]),s=P.state,p=s.player,M=P.Minibosses,e=M.create('machu',{x:0,y:0});P.Terrain.active=()=>[];P.Terrain.hit=()=>null;P.Progression.tick=()=>{};s.enemies=[e];e.hp=e.max=10000;p.x=-200;p.y=0;p.inv=0;s.fire=0;const hp=p.hp;e.attack='quake';M.fire(e);M.recover(e);
 for(let i=0;i<36;i++){s.elapsed+=.04;if(i>=11&&Math.abs(p.x)>100)p.x+=p.speed*.04;M.move(e,.04);P.Combat.tick(.04);M.contact(e,[p])}assert.equal(p.hp,hp);assert(e.hp<10000);assert.equal(e.counterWindows,1);
});
test('Evoluciones y daño nulo: sin atajos detrás de cobertura ni falso contraataque',()=>{
 const index=new Simulation('campo',[0]).P.Data.characters.findIndex(c=>c.id==='g5'),{P}=new Simulation('campo',[index]),s=P.state,p=s.player,M=P.Minibosses,e=M.create('campo',{x:100,y:0});p.x=p.y=0;p.aim=0;p.evolved={primary:true};s.enemies=[e];P.Terrain.active=()=>[];P.Terrain.hit=x=>x>40&&x<50?{solid:true,hp:Infinity}:null;const hp=e.hp;P.Evolutions.afterCast(p,P.Evolutions.attack(p),{x:100,y:0});assert.equal(e.hp,hp);M.recover(e);M.hurt(e,0,0);assert.equal(e.counterWindows,0);assert(!s.effects.some(q=>q.kind==='mini-counter'));
});

test('Makanaky: alternancia de Plaza, un minijefe activo y reinicio',()=>{
 const {P}=new Simulation('plaza',[0]),M=P.Minibosses,s=P.state;P.Terrain.hit=()=>null;P.Loot.safe=()=>true;M.point=()=>({x:s.player.x+230,y:s.player.y});const ids=[];for(const time of [75,150,225]){s.mapTime=time;s.miniNext=time;s.enemies=[];M.tick(0);assert(s.miniWarning);const key=s.miniWarning.miniKey;M.tick(.1);assert.equal(s.enemies.length,1);ids.push(s.enemies[0].miniMap);assert.equal(ids.at(-1),key);M.tick(2);assert.equal(s.enemies.length,1);assert.equal(P.Maps.selected,'plaza')}assert.equal(ids.join(','),'plaza,makanaky,plaza');M.reset();assert.equal(M.choose('plaza'),'plaza');assert.equal(M.choose('campo'),'campo');
});
test('Makanaky: ondas, pulso con cobertura, fase dos, bonus y laboratorio',()=>{
 const {P}=new Simulation('plaza',[0]),M=P.Minibosses,s=P.state,e=M.create('makanaky',{x:0,y:0});s.enemies=[e];M.warn(e,'shout');M.move(e,.81);assert.equal(s.danger.length,3);assert(s.danger.every(q=>q.minion&&q.glyph==='PULSE'));s.danger=[];M.warn(e,'flash');M.move(e,.81);assert.equal(s.danger.length,1);assert.equal(s.danger[0].radius,110);assert(!s.danger[0].groundWave);s.danger=[];e.hp=e.max*.5;M.beginFury(e);M.move(e,1);M.warn(e,'shout');M.move(e,.81);assert.equal(e.phase,'mini-chain-gap');M.move(e,.7);M.move(e,.81);assert.equal(s.danger.length,6);assert.equal(e.phase,'mini-recover');M.hurt(e,99999,0);assert.equal(s.kills,1);assert(P.Loot.chests.some(c=>c.miniReward==='makanaky'));assert.equal(P.Relics.ids.makanaky,'mini_whistle');assert.doesNotThrow(()=>JSON.stringify(s.effects));M.lab('makanaky');assert.equal(P.Maps.selected,'plaza');assert.equal(s.miniLab,'makanaky');assert.equal(s.enemies[0].miniMap,'makanaky');
});

test('Makanaky jugable: gratuito en guardados antiguos, mejoras, combate y minijefe separado',()=>{
 const {P}=new Simulation('plaza',[18,0]),s=P.state,c=P.Data.characters.find(c=>c.id==='makanaky');assert(c);assert.equal(s.player.id,'makanaky');assert(P.Meta.blank().unlocked.includes('makanaky'));const old=P.Meta.blank();old.unlocked=old.unlocked.filter(id=>id!=='makanaky');old.wallet=123;old.characters.cristorata={runs:1,wins:0,kills:20,bestTime:45,bestLevel:2,upgrades:{power:1}};const migrated=P.Meta.normalize(old);assert(migrated.unlocked.includes('makanaky'));assert.equal(migrated.wallet,123);assert.equal(migrated.characters.cristorata.upgrades.power,1);
 P.Terrain.active=()=>[];P.Terrain.hit=()=>null;P.Muzzle.blocker=()=>null;P.Progression.tick=()=>{};const player=s.player;player.x=player.y=0;s.enemies=[{x:100,y:0,r:20,hp:10000}];assert(P.Combat.cast());assert.equal(s.shots.length,3);s.fire=100;for(let i=0;i<15;i++)P.Combat.tick(.04);assert(s.enemies[0].hp<10000);for(let i=0;i<4;i++)P.Progression.apply(player,'primary');s.level=8;P.Progression.apply(player,'evolve:primary');assert.equal(P.Evolutions.attack(player).count,5);assert.equal(P.Evolutions.attack(player).name,'GAA de la realeza');assert.equal(P.Minibosses.catalog.makanaky.hp,480);assert.notEqual(P.Minibosses.create('makanaky',{x:0,y:0}),player);assert.equal(player.maxHp,105);
});
test('Makanaky: adaptador de arte íntegro y recuperación después de caché',()=>{
 const {P}=new Simulation('campo',[18]),art=P.MakanakyPlayerArt;art.image={};art.height=100;art.frames=Array.from({length:4},(_,i)=>({sx:i*80,sy:0,w:80,h:100,anchorX:40,anchorY:100,localX:0,localY:0}));art.ready=true;art.installSheets();let calls=0;const ctx=new Proxy({drawImage(){calls++}},{get:(o,k)=>o[k]||(()=>{})});P.Sprites.draw(ctx,0,0,27,P.Data.characters[18],3,false);assert.equal(calls,1);assert.equal(P.WalkArt.sheets.makanaky.frames.length,6);assert.equal(P.WalkArt.sheets['attack-makanaky'].frames[1],art.frames[2]);delete P.WalkArt.sheets.makanaky;art.load();assert(P.WalkArt.sheets.makanaky.ready);
});
