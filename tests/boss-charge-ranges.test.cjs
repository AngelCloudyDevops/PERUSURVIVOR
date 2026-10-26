'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');

test('Gallinazo: la picada consume exactamente la ruta anunciada con fotogramas irregulares',()=>{
 const {P}=new Simulation('campo',[0]),s=P.state;P.$('#lab-boss').value='vulture';P.Lab.run();const e=s.enemies[0],hit=P.Terrain.hit,resolve=P.Terrain.resolve,bounds=s.encounter.scene.bounds;
 P.Terrain.hit=()=>false;P.Terrain.resolve=()=>{};s.encounter.scene.bounds={left:-2000,right:2000,top:-2000,bottom:2000};Object.assign(e,{x:0,y:0});Object.assign(s.player,{x:800,y:0});P.Vulture.warn(e,'dive');assert.equal(e.diveLength,448);e.diveRemaining=1;e.windup=0;P.Vulture.move(e,.01);const start=e.x;
 for(const dt of [.13,.07,.19,.11,.3,.4])if(e.phase==='vulture-dive')P.Vulture.move(e,dt);
 assert.equal(e.phase,'vulture-recover');assert(Math.abs(e.x-start-e.diveLength)<.001);P.Terrain.hit=hit;P.Terrain.resolve=resolve;s.encounter.scene.bounds=bounds;
});

test('Minijefes: embestida y picada muestran la distancia real y la acortan ante cobertura',()=>{
 const {P}=new Simulation('campo',[0]),s=P.state,M=P.Minibosses;P.Game.start();const hit=P.Terrain.hit,resolve=P.Terrain.resolve;P.Terrain.hit=()=>false;P.Terrain.resolve=()=>{};
 for(const [map,attack] of [['campo','charge'],['plaza','peck']]){const e=M.create(map,{x:0,y:0});Object.assign(s.player,{x:800,y:0});M.warn(e,attack);const shown=e.chargeDistance;e.windup=0;M.move(e,.01);const start=e.x;for(const dt of [.13,.07,.19,.11,.3,.4])if(e.phase==='mini-charge')M.move(e,dt);assert.equal(e.phase,'mini-recover');assert(Math.abs(e.x-start-shown)<.001)}
 const e=M.create('campo',{x:0,y:0});Object.assign(s.player,{x:800,y:0});P.Terrain.hit=x=>x+e.r>=180;P.Terrain.resolve=(q,old)=>{if(P.Terrain.hit(q.x,q.y,q.r))Object.assign(q,old)};M.warn(e,'charge');assert(e.chargeDistance>0&&e.chargeDistance<272);const shown=e.chargeDistance;e.windup=0;M.move(e,.01);const start=e.x;for(let i=0;i<30&&e.phase==='mini-charge';i++)M.move(e,.04);assert.equal(e.phase,'mini-recover');assert(Math.abs(e.x-start-shown)<=6,JSON.stringify({start,end:e.x,shown,difference:e.x-start-shown}));P.Terrain.hit=hit;P.Terrain.resolve=resolve;
});

test('IA de jefes: atasco persistente fuerza recálculo y maniobra de flanqueo',()=>{
 const {P}=new Simulation('campo',[0]),s=P.state,e=P.Minibosses.create('campo',{x:0,y:0});s.player.x=300;s.player.y=0;e.speed=70;
 for(let i=0;i<28;i++)P.Encounters.trackMotion(e,{x:e.x,y:e.y},.04);
 assert(e.navReplans>=2);assert(e.navFlank>0);assert([-1,1].includes(e.navSide));
 P.Terrain.hit=(x,y,r=0)=>x>80-r&&x<140+r&&Math.abs(y)<130+r?{x:110,y:0,w:60,h:260,solid:true}:null;
 P.Terrain.clear=(x,y,tx,ty,r=4)=>{const steps=Math.max(1,Math.ceil(Math.hypot(tx-x,ty-y)/12));for(let i=1;i<=steps;i++)if(P.Terrain.hit(x+(tx-x)*i/steps,y+(ty-y)*i/steps,r))return false;return true};
 const dir=P.Encounters.navigate(e,s.player,.04);assert(Number.isFinite(dir.x)&&Number.isFinite(dir.y));assert(e.navPath.length>0);assert.doesNotThrow(()=>JSON.stringify(e));
});

test('Contratos de carga: cobertura, final anunciado y cancelación limpia',()=>{
 const {P}=new Simulation('campo',[0]),s=P.state;P.$('#lab-boss').value='campo';P.Lab.run();const e=s.enemies[0],o=P.Terrain.active()[0];e.x=o.x-o.w/2-e.r-30;e.y=o.y;e.dx=1;e.dy=0;e.aim=0;e.attack='charge';e.phase='warning';e.windup=0;e.chargeLength=P.ChosicanoCombat.chargePath(e);
 assert.strictEqual(e.chargeBlocker,o);assert.equal(e.chargeEnd.x,e.x+e.chargeLength);P.ChosicanoCombat.move(e,.01);for(let i=0;i<30&&e.phase==='charge';i++)P.ChosicanoCombat.move(e,.04);assert.equal(e.phase,'recover');assert.equal(e.chargeLeft,0);assert(['blocked','complete'].includes(e.chargeStopReason));
 const mini=P.Minibosses.create('campo',{x:o.x-o.w/2-60,y:o.y});mini.dx=1;mini.dy=0;mini.aim=0;mini.attack='charge';mini.phase='mini-warning';mini.windup=0;mini.chargeDistance=P.Minibosses.chargePath(mini);assert.strictEqual(mini.chargeBlocker,o);P.Minibosses.move(mini,.01);for(let i=0;i<30&&mini.phase==='mini-charge';i++)P.Minibosses.move(mini,.04);assert.equal(mini.phase,'mini-recover');assert.equal(mini.chargeDistanceLeft,0);
});

test('Evento rápido de fase es opcional, único y concede una esquiva breve',()=>{
 const {P}=new Simulation('plaza',[0]),s=P.state;P.$('#lab-boss').value='plaza';P.Lab.run();const e=s.enemies[0];e.hp=e.max*.5;P.Encounters.phaseEvent(e,.04);assert(e.quickEvent?.left>0);s.player.inv=0;assert(P.Encounters.quickEvent());assert(e.quickEvent.success);assert(s.player.inv>=.85);assert(!P.Encounters.quickEvent());P.Encounters.phaseEvent(e,2);assert(e.quickEvent.success);assert(e.phaseEventDone);
});

test('Daño de jefe: impacto único, invulnerabilidad y escudo se respetan',()=>{
 const {P}=new Simulation('campo',[0]),s=P.state,p=s.player;p.x=p.y=0;p.inv=0;const hp=p.hp;s.danger=[{x:0,y:0,vx:0,vy:0,age:0,life:.5,kind:'stomp',radius:80,damage:17,history:[]}];P.Combat.tick(.04);assert.equal(hp-p.hp,17);const after=p.hp;P.Combat.tick(.04);assert.equal(p.hp,after);
 p.inv=0;p.courtShieldUntil=s.elapsed+2;s.danger=[{x:0,y:0,vx:0,vy:0,age:0,life:.5,kind:'stomp',radius:80,damage:30,history:[]}];P.Combat.tick(.04);assert.equal(p.hp,after);assert(s.danger[0].spent,'El impacto queda consumido aunque el escudo lo bloquee');
});

test('Diagnóstico del laboratorio dibuja hitbox, ruta, destino y estado sin mutar IA',()=>{
 const {P}=new Simulation('campo',[0]),s=P.state,e=P.Minibosses.create('campo',{x:0,y:0}),calls=[];s.devRun=true;s.enemies=[e];e.navPath=[{x:40,y:10},{x:80,y:30}];e.navGoal={x:120,y:50};e.navReplans=2;P.Lab.diagnostics=true;const before=JSON.stringify(e),ctx=new Proxy({arc(){calls.push('arc')},lineTo(){calls.push('line')},fillText(){calls.push('text')}},{get:(o,k)=>o[k]||(()=>{})});P.Encounters.diagnostics(ctx);assert(calls.includes('arc')&&calls.includes('line')&&calls.includes('text'));assert.equal(JSON.stringify(e),before);
});
