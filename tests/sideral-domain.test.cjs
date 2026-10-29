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

test('Sideral: el dominio entra directamente y cada pulso nace desde el personaje',()=>{
 const {sim,P,s,p}=setup();p.ultimate.charge=100;sim.tick(.04,[{domain:true},{}]);const d=s.sideralDomain;
 sim.tick(.4,[{},{}]);assert(d.age>0);assert.equal(d.card,undefined);assert(sim.players[1].inv>0);
 assert.equal(P.SideralDomain.pose(P.SideralDomain.entry*.7).hop,0);assert(P.SideralDomain.pose(P.SideralDomain.entry*.88).hop>0);assert(P.SideralDomain.pose(P.SideralDomain.entry*.98).laugh>0);
 p.x=333;p.y=222;P.SideralDomain.burst();assert.equal(d.waveX,333);assert.equal(d.waveY,222);
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
