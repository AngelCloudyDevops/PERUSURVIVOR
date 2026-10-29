'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');

function ready(duo=false,map='campo'){
 const sim=new Simulation(map,duo?[0,6]:[0]),P=sim.P,s=P.state;
 if(!duo){s.runMode='chaos';P.Data.arena.duration=1800}
 s.enemies=[];s.miniWarning=null;s.portal.open=false;P.Market.merchant=null;P.Exploration.station=null;
 P.MapEvents.worldPlanned=true;P.MapEvents.worldAt=duo?105:630;s.mapTime=P.MapEvents.worldDue();P.Terrain.hit=()=>null;
 return {sim,P,s};
}

test('Impacto del cielo: una cinemática garantizada congela combate y crea un cráter persistente',()=>{
 const {P,s}=ready(),M=P.MapEvents,p=s.player;const before={x:p.x,y:p.y,time:s.mapTime};
 assert(M.tick(.04));assert(M.cinematic());assert.equal(M.event.world,true);assert.equal(M.worldPlayed,true);assert(Math.hypot(M.event.x-p.x,M.event.y-p.y)>300,'El impacto queda lejos del jugador');assert.equal(M.impacts.length,0);
 const frame=M.camera(p,1280,720,1.3);assert(frame&&frame.zoom>0);
 for(let i=0;i<122;i++){s.mapTime+=.04;assert(M.tick(.04))}
 assert.equal(M.impacts.length,1);assert(M.impacts[0].radius>=300);assert(P.Terrain.props.filter(o=>o.meteorImpact).length>=10);assert(P.Terrain.props.some(o=>o.meteorImpact&&o.solid));
 while(M.cinematic()){s.mapTime+=.04;M.tick(.04)}assert.equal(M.event.phase,'invasion');assert.equal(M.event.invasionTarget,9);assert.equal(P.Loot.canOpen({rarity:'common'}),false,'Los cofres quedan sellados durante Extinción');assert.deepEqual({x:p.x,y:p.y},{x:before.x,y:before.y});assert(Math.abs(s.mapTime-before.time)<.08,'La cinemática no consume tiempo de supervivencia');
 for(let i=0;i<M.event.invasionTarget;i++)M.defeated({extinctionDino:true});assert.equal(M.event.phase,'fragments');assert.equal(s.enemies.filter(e=>e.extinctionFragment).length,3);
 for(const fragment of s.enemies.filter(e=>e.extinctionFragment))M.defeated(fragment);assert.equal(M.event.phase,'boss');const boss=s.enemies.find(e=>e.extinctionBoss);assert(boss&&boss.max>=1500);p.x=M.event.x+700;p.y=M.event.y;M.tick(.04);assert(Math.hypot(p.x-M.event.x,p.y-M.event.y)<=520.01,'El jefe contiene al jugador dentro del cráter');M.defeated(boss);assert.equal(M.event.phase,'portal');assert.equal(s.coins,75);
 const impact=JSON.stringify(M.impacts);P.Chunks.signature='';P.Chunks.sync();M.ensureTerrain();assert.equal(JSON.stringify(M.impacts),impact);assert(P.Terrain.props.some(o=>o.meteorImpact));
});

test('Extinción: las oleadas usan roles, el tanque tiene armadura direccional y el anti-kite limita meteoritos',()=>{
 const {P,s}=ready(),M=P.MapEvents,p=s.player;M.startWorld();const e=M.event;M.activateWorld(e);for(let i=0;i<30;i++)M.tickWorld(.1);const first=s.enemies.filter(q=>q.extinctionDino);assert.deepEqual(first.map(q=>q.dinoKind).sort(),['ankylosaur','raptor','raptor']);assert(first.every(q=>q.dinoRole));
 const tank=first.find(q=>q.dinoKind==='ankylosaur');tank.facing=1;assert.equal(M.incomingMultiplier(tank,{owner:{x:tank.x+20}}),.48);assert.equal(M.incomingMultiplier(tank,{owner:{x:tank.x-20}}),1.3);
 p.x=e.x+700;p.y=e.y;for(let i=0;i<80;i++)M.tickWorld(.04);assert((e.fallingMeteors||[]).length>0);assert((e.fallingMeteors||[]).length<=3);
});

test('Impacto cooperativo: el servidor elige un jugador vivo y sincroniza la invasión con ambos',()=>{
 const {sim,P,s}=ready(true,'plaza'),M=P.MapEvents,[a,b]=sim.players;a.x=-500;a.y=80;b.x=620;b.y=-40;const positions=sim.players.map(p=>[p.x,p.y]);
 sim.tick(.04,[{x:1},{x:-1}]);let snap=JSON.parse(JSON.stringify(sim.snapshot()));assert(snap.mapEvent?.world);assert([0,1].includes(snap.mapEvent.targetSlot));assert.deepEqual(sim.players.map(p=>[p.x,p.y]),positions,'El servidor congela a los dos durante la toma');
 for(let i=0;i<165;i++)sim.tick(.04,[{x:1},{x:-1}]);snap=JSON.parse(JSON.stringify(sim.snapshot()));assert.equal(snap.mapEvent.phase,'invasion');assert.equal(snap.meteorImpacts.length,1);assert(snap.enemies.some(e=>e.extinctionDino));assert.doesNotThrow(()=>JSON.stringify(snap));
});

test('Extinción cooperativa: ambos deciden el portal, completan la mazmorra y reciben la misma reliquia',()=>{
 const {sim,P,s}=ready(true,'plaza'),M=P.MapEvents,[a,b]=sim.players;M.startWorld();const e=M.event;e.phase='boss';e.impacted=true;e.boss={extinctionBoss:true};const origins=sim.players.map(p=>({x:p.x,y:p.y,maxHp:p.maxHp}));
 M.defeated(e.boss);assert.equal(e.phase,'portal');assert.equal(s.coins,75);assert.equal(M.event,e,'El evento no termina al derrotar al jefe en dúo');
 a.x=e.x;a.y=e.y;b.x=e.x+300;b.y=e.y;const returnPositions=sim.players.map(p=>({x:p.x,y:p.y}));sim.activities.tick(0);let pending=sim.activities.pending;assert.equal(pending.kind,'extinction-portal');assert(sim.activities.choose(0,pending.id,0));assert.equal(sim.activities.pending,pending);assert(sim.activities.choose(1,pending.id,0));assert.equal(sim.activities.pending,null);assert.equal(e.phase,'dungeon');assert.equal(s.mode,'play');assert.notDeepEqual(sim.players.map(p=>({x:p.x,y:p.y})),returnPositions);
 for(let i=0;i<e.dungeonTarget;i++)M.defeated({extinctionDino:true,dungeonDino:true});assert.equal(e.phase,'dungeonBoss');assert(e.dungeonBoss?.extinctionDungeonBoss);M.defeated(e.dungeonBoss);assert.equal(e.phase,'reward');sim.activities.tick(0);pending=sim.activities.pending;assert.equal(pending.kind,'extinction-reward');assert(sim.activities.choose(0,pending.id,0));assert(sim.activities.choose(1,pending.id,2),'El voto diferente conserva la decisión del anfitrión');assert.equal(M.event,null);
 for(const [i,p] of sim.players.entries()){assert.equal(p.extinctionRelic,'fossil');assert.equal(p.maxHp,origins[i].maxHp+35);assert.deepEqual({x:p.x,y:p.y},returnPositions[i])}
 assert.doesNotThrow(()=>JSON.stringify(sim.snapshot()));
});

test('Extinción cooperativa: si uno rechaza el portal, el equipo continúa sin entrar',()=>{
 const {sim,P}=ready(true),M=P.MapEvents;M.startWorld();const e=M.event;e.phase='portal';e.impacted=true;for(const p of sim.players){p.x=e.x;p.y=e.y}sim.activities.tick(0);const pending=sim.activities.pending;assert.equal(pending.kind,'extinction-portal');sim.activities.choose(0,pending.id,0);sim.activities.choose(1,pending.id,1);assert.equal(M.event,null);assert.equal(P.state.mode,'play');assert.equal(sim.activities.pending,null);
});

test('Reliquias cooperativas: daño y velocidad se calculan por dueño',()=>{
 const {sim,P,s}=ready(true),M=P.MapEvents,[a,b]=sim.players;M.worldPlayed=true;a.extinctionRelic='predator';b.extinctionRelic='fossil';a.predatorUntil=s.elapsed+5;b.predatorUntil=0;
 assert.equal(M.damageMultiplier({owner:a}),1.25);assert.equal(M.damageMultiplier({owner:b}),1);assert.equal(M.speedMultiplier(a),1.18);assert.equal(M.speedMultiplier(b),1);
 const start=a.x;sim.tick(.1,[{x:1,y:0},{x:0,y:0}]);assert(a.x-start>a.speed*.1,'El servidor incluye el bono de velocidad de la reliquia');
});

test('Eventos: el impacto tiene 65 % de probabilidad, momento variable, arte propio y minieventos sin repetición',()=>{
 const {P,s}=ready(),M=P.MapEvents,fs=require('node:fs'),path=require('node:path');M.reset(.64,.5);assert.equal(M.worldPlanned,true);assert(M.worldAt>=420&&M.worldAt<=1080);M.reset(.65,.5);assert.equal(M.worldPlanned,false);assert.equal(M.worldDue(),Infinity);
 M.worldPlayed=true;s.mapTime=1;assert(M.start(false,null,.99));const first=M.event.kind;M.event=null;assert(M.start(false,null,.99));assert.notEqual(M.event.kind,first);const source=fs.readFileSync(path.resolve(__dirname,'../src/systems/map-events.js'),'utf8');for(const file of ['meteor-cinematic-far-v1.webp','meteor-cinematic-mid-v1.webp','meteor-cinematic-v1.webp']){const art=path.resolve(__dirname,'../public/assets/environment/'+file);assert(fs.existsSync(art));assert(fs.statSync(art).size>20000);assert(source.includes(file))}const dinosaurs=path.resolve(__dirname,'../public/assets/enemies/extinction-dinosaurs-v4.webp');assert(fs.existsSync(dinosaurs));assert(fs.statSync(dinosaurs).size>90000);assert(source.includes('extinction-dinosaurs-v4.webp'));assert(source.includes('ctx.drawImage(image'));assert(source.includes('Math.pow(q,1.7)'));
});

test('Extinción: la mazmorra entrega una reliquia real y devuelve al jugador al mundo',()=>{
 const {P,s}=ready(),M=P.MapEvents,p=s.player;M.startWorld();const e=M.event;e.phase='portal';e.impacted=true;const origin={x:p.x,y:p.y};M.beginDungeon(e);assert.equal(e.phase,'dungeon');assert.equal(s.mode,'play');assert.notDeepEqual({x:p.x,y:p.y},origin);
 for(let i=0;i<e.dungeonTarget;i++)M.defeated({extinctionDino:true,dungeonDino:true});assert.equal(e.phase,'dungeonBoss');assert(e.dungeonBoss?.extinctionDungeonBoss);M.defeated(e.dungeonBoss);assert.equal(e.phase,'reward');assert.equal(s.mode,'extinction-reward');M.applyRelic(e,'predator');assert.equal(M.event,null);assert.equal(p.extinctionRelic,'predator');assert.deepEqual({x:p.x,y:p.y},origin);
 p.predatorUntil=s.elapsed+1;assert.equal(M.damageMultiplier({}),1.25);assert.equal(M.speedMultiplier(p),1.18);p.predatorUntil=0;assert.equal(M.damageMultiplier({}),1);
});

test('Laboratorio de ambiente: permite forzar cada hora, clima y evento sin alterar el reloj',()=>{
 const {P,s}=ready(),bench=P.TestBench,M=P.MapEvents;bench.active=true;s.devRun=true;s.balanceTest=true;s.mode='play';s.mapTime=42;M.worldPlayed=true;P.Terrain.hit=()=>null;
 assert(P.$('#bench-environment'));assert.notEqual(P.$('#bench-environment').hidden,true);assert(P.$('#bench-climate'));assert(P.$('#bench-weather'));assert(P.$('#bench-event'));
 bench.climate='4';bench.weather='storm';assert.equal(P.DayNight.current().label,'NOCHE');assert.equal(P.Weather.current().storm,true);assert.equal(P.Weather.current().intensity,1);assert.equal(s.mapTime,42);
 bench.weather='clear';assert.equal(P.Weather.current().intensity,0);bench.eventChoice='garua';assert(bench.startEvent());assert.equal(M.event.kind,'garua');assert.equal(M.event.phase,'warning');
 for(let i=0;i<180;i++)M.tick(.04);assert.equal(M.event.phase,'active');bench.stopEvent();assert.equal(M.event,null);assert.equal(M.impacts.length,0);
 s.mode='upgrade';bench.eventChoice='world';bench.hud();assert.notEqual(P.$('#bench-event-start').disabled,true);assert(bench.startEvent());assert(M.cinematic(),'El evento queda preparado durante una mejora');s.mode='play';assert(M.tick(.04));bench.stopEvent();
 s.balanceTest=false;s.practice=true;bench.climate='5';bench.weather='auto';bench.eventChoice='kite';bench.hud();assert.notEqual(P.$('#bench-event-start').disabled,true,'El botón funciona también en Práctica');assert.equal(P.DayNight.current().label,'TORMENTA FINAL');assert.equal(P.Weather.current().storm,true);assert(bench.startEvent());assert.equal(M.event.kind,'kite');M.tick(.04);assert.equal(M.event.phase,'warning');bench.stopEvent();
 bench.climate='auto';bench.weather='auto';assert.equal(bench.climatePreview(),null);assert.equal(bench.weatherPreview(),null);
});
