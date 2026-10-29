'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {Simulation}=require('../backend/simulation.cjs');

function setup(){
 const sim=new Simulation('campo',[0,1],path.resolve(__dirname,'..')),P=sim.P,s=P.state,c=P.Data.characters.find(c=>c.id==='sideral'),p=P.Entities.player(c);
 Object.assign(p,{slot:0,shots:[],fields:[],revive:0,x:120,y:90});s.player=p;P.Ultimate.reset();p.ultimate=s.ultimate;sim.players[0]=p;return {sim,P,s,p};
}

test('Sideral: reemplaza el mapa por una habitación física y la serializa en cooperativo',()=>{
 const {sim,P,s,p}=setup();p.ultimate.charge=100;sim.tick(.04,[{domain:true},{}]);for(let i=0;i<160&&!s.sideralDomain?.arena;i++)sim.tick(.04,[{},{}]);
 assert.equal(s.sideralDomain.arena,true);assert.equal(P.Terrain.active().filter(o=>o.kind==='sideral-wall').length,4);
 assert.equal(s.sideralDomain.waves,1);assert.equal(s.sideralDomain.pulse,0);
 assert(P.Terrain.active().some(o=>o.kind==='sideral-desk'));assert(P.Terrain.active().some(o=>o.kind==='sideral-library'));
 assert(!P.Terrain.active().some(o=>o.kind==='sideral-rug'));assert(!P.Terrain.hit(p.x,p.y,p.r));
 assert.equal(sim.snapshot().sideralDomain.arena,true);assert.equal(sim.snapshot().sideralDomain.roomProps,undefined);
 const d=s.sideralDomain,b=P.SideralDomain.bounds(d),portal=P.Encounters.definition().portal;assert(P.Terrain.hit(d.x-P.SideralDomain.roomWidth/2,b.top+100,12));
 assert(portal.x>b.left&&portal.x<b.right&&portal.y>b.top&&portal.y<b.bottom);assert.equal(P.Combat.cast(),false);assert.equal(p.castUntil,0);
});

test('Sideral: choque daña, rebota y al terminar restaura coordenadas',()=>{
 const {sim,P,s,p}=setup(),e={x:640,y:90,hp:100,max:100,r:14,speed:0,boss:false,hit:0,attackT:9};P.Attributes.init(e);s.enemies=[e];p.ultimate.charge=100;assert(P.SideralDomain.activate());s.sideralDomain.age=P.SideralDomain.entry;P.SideralDomain.enter(s.sideralDomain);
 const d=s.sideralDomain,b=P.SideralDomain.bounds(d);e.x=b.right-e.r-20;e.sideralFear=.9;e.sideralWallHit={side:'right'};P.SideralDomain.boundary(e,d,.04);
 assert.equal(e.hp,92);assert.equal(e.domainEdgeHits,1);assert(e.charge.x<0);assert.equal(e._sideralReturnX,640);
 P.SideralDomain.end();assert.equal(s.sideralDomain,null);assert.equal(e.x,640);assert.equal(e._sideralReturnX,undefined);assert.equal(p.x,120);assert.equal(p.y,90);
});

test('Sideral: la destrucción mezcla actores, cámara y zoom sin salto final',()=>{
 const {P,s,p}=setup(),D=P.SideralDomain,e={x:920,y:610,hp:100,max:100,r:14,speed:0,boss:false,hit:0};P.Attributes.init(e);s.enemies=[e];p.ultimate.charge=100;assert(D.activate());const d=s.sideralDomain;d.age=D.entry;D.enter(d);const inside={x:e.x,y:e.y},home={x:e._sideralReturnX,y:e._sideralReturnY};assert.notDeepEqual(inside,home);
 d.exit=d.exitTotal=1.35;P.DomainReturn.begin(D.returnObjects(),'sideral');const arena={x:d.x,y:d.y-70},map={x:home.x,y:home.y},initialCamera=P.DomainReturn.frame(d,arena,map);assert.equal(initialCamera.x,arena.x);assert.equal(initialCamera.y,arena.y);D.tick(.7);assert(Math.hypot(e.x-home.x,e.y-home.y)<Math.hypot(inside.x-home.x,inside.y-home.y));assert(Math.hypot(e.x-home.x,e.y-home.y)>0);const camera=P.DomainReturn.frame(d,arena,map);assert.notDeepEqual(camera,arena);assert.notDeepEqual(camera,map);D.tick(.66);assert.equal(s.sideralDomain,null);assert.deepEqual({x:e.x,y:e.y},home);assert.equal(JSON.stringify({player:p,enemies:s.enemies}).includes('_sideralExit'),false)
});

test('Sideral: el dominio entra directamente y cada pulso nace desde el personaje',()=>{
 const {sim,P,s,p}=setup();p.ultimate.charge=100;sim.tick(.04,[{domain:true},{}]);const d=s.sideralDomain;
 sim.tick(.4,[{},{}]);assert(d.age>0);assert.equal(d.card,undefined);assert(sim.players[1].inv>0);
 assert.equal(P.SideralDomain.pose(P.SideralDomain.entry*.7).hop,0);assert(P.SideralDomain.pose(P.SideralDomain.entry*.88).hop>0);assert(P.SideralDomain.pose(P.SideralDomain.entry*.98).laugh>0);
 p.x=333;p.y=222;P.SideralDomain.burst();assert.equal(d.waveX,333);assert.equal(d.waveY,222);
});

test('Sideral dinámico: construye sobre el mapa sin mover actores ni tomar la cámara',()=>{
 const {sim,P,s,p}=setup(),D=P.SideralDomain,boss=P.Entities.enemy(true);s.devRun=true;D.practicePresentation='dynamic';Object.assign(boss,{x:p.x+180,y:p.y,attackT:1});s.enemies=[boss];p.ultimate.charge=100;
 assert(D.activate());const d=s.sideralDomain,startX=p.x,startElapsed=s.elapsed;assert(D.dynamic(d));assert.equal(D.entryFor(d),2.6);assert.equal(P.Progression.cinematicOnly(),false);assert.equal(d.arena,false);assert.equal(D.frozen(boss),false);assert(p.inv<1);
 sim.tick(.1,[{x:1},{}]);assert(p.x>startX);assert(s.elapsed>startElapsed);assert.equal(d.arena,false);
 const before={x:p.x,y:p.y},zoom=P.World.zoomFor(1280,720,true,false),camera=P.Maps.camera(p.x,p.y-55,1280/zoom,720/zoom);d.age=2.55;sim.tick(.06,[{},{}]);assert.equal(d.arena,true);assert.equal(D.frozen(boss),false);assert.deepEqual({x:p.x,y:p.y},before);assert(d.roomProps.some(o=>o.kind==='sideral-desk'));assert(d.roomProps.some(o=>o.kind==='sideral-library'));assert.equal(P.Terrain.active().filter(o=>o.kind==='sideral-wall').length,0);assert.equal(P.World.zoomFor(1280,720,true,false),zoom);const after=P.Maps.camera(p.x,p.y-55,1280/zoom,720/zoom);assert.equal(after.x,camera.x);assert.equal(after.y,camera.y);
 d.age=D.entryFor(d)+D.duration-.01;sim.tick(.04,[{},{}]);assert.equal(d.exitTotal,1.35);
});

test('Dominios dinámicos sumergen objetos y cofres sin borrar su estado',()=>{
 const {P,s,p}=setup(),D=P.SideralDomain;s.devRun=true;D.practicePresentation='dynamic';p.ultimate.charge=100;assert(D.activate());const d=s.sideralDomain,inside={id:'inside',x:d.x+20,y:d.y+15,progress:0,opened:false,rarity:'common'},outside={id:'outside',x:d.x+D.roomWidth,y:d.y,progress:0,opened:false,rarity:'common'},prop={id:'domain-prop',kind:'bench',x:d.x+60,y:d.y+40,w:80,h:32,solid:true,hp:Infinity};P.Loot.chests=[inside,outside];P.Terrain.props.push(prop);P.Terrain.indexProps();d.age=D.entryFor(d)*.5;assert.equal(P.Terrain.hit(prop.x,prop.y),prop);d.age=D.entryFor(d);D.enter(d);
 assert(P.DomainScenery.inside(inside));assert(!P.DomainScenery.inside(outside));assert(P.DomainScenery.hideChest(inside));assert(!P.Loot.active().includes(inside));assert(P.Loot.active().includes(outside));assert.equal(P.Loot.canOpen(inside),false);assert.equal(inside.opened,false);
 assert.equal(P.DomainScenery.hideProp(prop),true);assert.equal(P.Terrain.hit(prop.x,prop.y),undefined);const body={x:prop.x,y:prop.y};P.Terrain.resolve(body,{x:prop.x-100,y:prop.y});assert.deepEqual(body,{x:prop.x,y:prop.y});
 d.exit=d.exitTotal=1.35;assert(P.Loot.active().includes(inside));assert.equal(P.DomainScenery.progress(),1);d.exit=.01;assert(P.DomainScenery.progress()<.01);assert.equal(P.Terrain.hit(prop.x,prop.y),prop);assert.equal(inside.opened,false);
});

test('Sideral dinámico: el servidor cooperativo conserva la presentación solicitada',()=>{
 const {sim,P,s,p}=setup();p.ultimate.charge=100;sim.tick(.04,[{domain:true,domainPresentation:'dynamic'},{}]);const d=s.sideralDomain;
 assert(d);assert.equal(d.presentationOverride,'dynamic');assert.equal(P.SideralDomain.entryFor(d),2.6);assert.equal(sim.snapshot().sideralDomain.presentationOverride,'dynamic');
});

test('Sideral dinámico: conserva construcción, título y accesos de laboratorio',()=>{
 const fs=require('node:fs'),source=fs.readFileSync('src/systems/sideral-domain.js','utf8'),options=fs.readFileSync('src/ui/reference-menus.js','utf8');
 for(const token of ['construction(c,d,time,opacity=1)','dynamicTitle(c,text,x,y,size','dynamicIntro(c,w,h,d)',"'EXPANSIÓN DE DOMINIO'","'HABITACIÓN DEL'","'LAGARTO'",'sideral-domain-dynamic-practice','bench-sideral-presentation','bench-sideral-dynamic',"labToggle.type='checkbox'","P.state.mode==='play'"])assert(source.includes(token),token);
 assert(options.includes("'Dominios dinámicos'"));assert(options.includes("'domain-dynamic'"));
});

test('Sideral: la cinemática compone una sola figura sobre una sola habitación',()=>{
 const {P}=setup(),D=P.SideralDomain,calls=[];D.room=()=>calls.push('room');D.lizardSeal=()=>calls.push('seal');D.manifest=()=>calls.push('manifest');D.figure=()=>calls.push('figure');D.companion=()=>calls.push('companion');
 const c={save(){},restore(){},fillRect(){},strokeRect(){},strokeText(){},fillText(){},beginPath(){},ellipse(){},stroke(){},translate(){},rotate(){},lineTo(){},moveTo(){},closePath(){}};
 D.introClean(c,1280,720,{age:D.entry*.72});
 assert.equal(calls.filter(x=>x==='room').length,1);assert.equal(calls.filter(x=>x==='figure').length,1);assert(calls.indexOf('manifest')<calls.indexOf('figure'));assert(calls.indexOf('figure')<calls.indexOf('companion'));
});

test('Sideral: el cierre dura 0,95 s y protege a ambos jugadores',()=>{
 const {sim,P,s,p}=setup();p.ultimate.charge=100;sim.tick(.04,[{domain:true},{}]);const d=s.sideralDomain;d.age=P.SideralDomain.entry+P.SideralDomain.duration-.01;sim.tick(.04,[{},{}]);
 assert.equal(d.exitTotal,.95);p.inv=0;sim.players[1].inv=0;sim.tick(.04,[{},{}]);assert(p.inv>0);assert(sim.players[1].inv>0);assert(d.exit>0);
});
test('Sideral: impactos breves por salto, último más fuerte, risa y movimiento reducido sin temblor',()=>{const {P}=setup(),D=P.SideralDomain,peak=i=>{let n=0;for(let j=0;j<120;j++){const q=D.introShake(D.entry*(.82+.14*i/4)+j/1000,false);n=Math.max(n,Math.abs(q.x),Math.abs(q.y))}return n};assert(peak(1)>0);assert(peak(4)>peak(1));assert.deepEqual({...D.introShake(D.entry*.81,false)},{x:0,y:0});let laugh=false;for(let i=0;i<1000;i++){const age=D.entry*i/1000,q=D.introShake(age,true);assert.equal(q.x,0);assert.equal(q.y,0);if(i>960&&Math.abs(D.introShake(age,false).x)>0)laugh=true}assert(laugh);assert.equal(D.introShake(D.entry,false).x,0);P.Ambient.reduced={matches:true};assert.equal(D.introShake(D.entry*.965).x,0)});
test('Sideral: jefes y minijefes inmóviles e inmunes; al salir retoman combate y daño',()=>{const {sim,P,s,p}=setup(),D=P.SideralDomain,mini=P.Minibosses.create('campo',{x:p.x+100,y:p.y}),boss=P.Entities.enemy(true),mapBoss={...P.Entities.enemy(),mapBoss:true,kind:'fujimori'};Object.assign(boss,{x:p.x,y:p.y,attackT:.01});Object.assign(mapBoss,{x:p.x+90,y:p.y});s.enemies=[mini,boss,mapBoss];p.ultimate.charge=100;assert(D.activate());const d=s.sideralDomain;d.age=D.entry;D.enter(d);const initial=s.enemies.map(e=>({x:e.x,y:e.y,hp:e.hp,phase:e.phase,attackT:e.attackT}));P.Systems.spawn=()=>{};P.Combat.tick=()=>{};const hp=sim.players.map(p=>p.hp);for(let i=0;i<10;i++)sim.tick(.04,[{},{}]);for(let i=0;i<s.enemies.length;i++){const e=s.enemies[i];assert.equal(e.x,initial[i].x);assert.equal(e.y,initial[i].y);assert.equal(e.phase,initial[i].phase);assert.equal(e.attackT,initial[i].attackT);P.Entities.hurt(e,99999,80);assert.equal(e.hp,initial[i].hp);assert(!e.sideralWeak)}assert.deepEqual(sim.players.map(p=>p.hp),hp);assert.equal(s.danger.length,0);assert.doesNotThrow(()=>JSON.stringify(sim.snapshot()));D.end();assert(sim.players.every(p=>p.hp<=0||p.inv>=.8));assert(!D.frozen(boss));const before=boss.hp;P.Entities.hurt(boss,10);assert(boss.hp<before);const miniHp=mini.hp;P.Minibosses.hurt(mini,10,0);assert(mini.hp<miniHp)});
test('Sideral: la ventana inmoviliza sin impedir reanimar al compañero',()=>{const {sim,P,s,p}=setup(),ally=sim.players[1],boss=P.Entities.enemy(true);ally.hp=0;ally.x=p.x;ally.y=p.y;Object.assign(boss,{x:p.x,y:p.y,attackT:0});s.enemies=[boss];P.Systems.spawn=()=>{};P.Combat.tick=()=>{};p.ultimate.charge=100;assert(P.SideralDomain.activate());s.sideralDomain.age=P.SideralDomain.entry;P.SideralDomain.enter(s.sideralDomain);ally.x=p.x;ally.y=p.y;for(let i=0;i<103;i++)sim.tick(.04,[{},{}]);assert(ally.hp>0);assert(s.sideralDomain);assert.equal(s.danger.length,0)});
test('Sideral individual: sin contacto del jefe y cofres utilizables dentro de la habitación',()=>{const {P,s,p}=setup(),boss=P.Entities.enemy(true);Object.assign(boss,{x:p.x,y:p.y,attackT:0});s.enemies=[boss];p.ultimate.charge=100;assert(P.SideralDomain.activate());const d=s.sideralDomain;d.age=P.SideralDomain.entry;P.SideralDomain.enter(d);boss.x=p.x;boss.y=p.y;p.inv=0;const hp=p.hp;P.Core.direction=()=>({x:0,y:0});P.Systems.move(.04);assert.equal(p.hp,hp);assert.equal(boss.attackT,0);const chest={id:'rescue-test',x:p.x,y:p.y,rarity:'common',progress:0,opened:false};P.Loot.chests=[chest];P.Loot.open(chest);assert(chest.opened);assert.equal(s.mode,'loot-opening');assert(s.sideralDomain)});
