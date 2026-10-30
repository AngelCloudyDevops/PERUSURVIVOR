'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');

function setup(){const sim=new Simulation('campo',[0]),P=sim.P,s=P.state;P.Game.start();s.mode='play';s.danger=[];return {P,s}}
function angle(shot){return Math.atan2(shot.vy,shot.vx)}
function close(actual,expected,message){assert(Math.abs(actual-expected)<1e-8,message||`${actual} != ${expected}`)}

test('Gabinete y Guardián: aviso y disparo comparten cantidad, ángulos y alcance máximo',()=>{
 const {P,s}=setup();
 for(const [kind,count,speed] of [['cabinet',9,190],['stone',12,145]]){
  s.danger=[];const e={kind,x:0,y:0,aim:.35,attackIndex:3,color:'#fff'},plan=P.Encounters.projectilePlan(e);
  assert.equal(plan.count,count);assert.equal(plan.speed,speed);assert.equal(plan.maxRange,speed*plan.life);
  P.Encounters.fire(e);assert.equal(s.danger.length,count);
  s.danger.forEach((shot,i)=>{close(Math.hypot(shot.vx,shot.vy),plan.speed);close(shot.life,plan.life);close(angle(shot),Math.atan2(Math.sin(plan.angles[i]),Math.cos(plan.angles[i])))})
 }
});

test('Gabinete: Pleno descontrolado es exclusivo, físico y rebota dos veces',()=>{
 const {P,s}=setup(),gabinete={kind:'cabinet',cabinetKit:'gabinete',attack:'congress',x:0,y:0,aim:.2,attackIndex:3,color:'#cc7f9d'};
 const plan=P.Encounters.projectilePlan(gabinete);assert.equal(plan.kind,'congress');assert.equal(plan.count,5);assert.equal(plan.speed,175);
 P.Encounters.fire(gabinete);assert.equal(s.danger.length,5);assert(s.danger.every(shot=>shot.congress&&shot.damage===12&&shot.damageType==='physical'&&shot.congressBounces===2));
 const shot=s.danger[0],vx=shot.vx,vy=shot.vy;shot.x=20;shot.y=30;shot.history.push({x:1,y:1});assert(P.Combat.bounceDanger(shot,4,5));assert.deepEqual([shot.x,shot.y,shot.vx,shot.vy,shot.congressBounces,shot.history.length],[4,5,-vx,-vy,1,0]);assert(P.Combat.bounceDanger(shot,4,5));assert.equal(shot.congressBounces,0);assert.equal(P.Combat.bounceDanger(shot,4,5),false);
 const grinch={...gabinete,cabinetKit:undefined};assert.equal(P.Encounters.projectilePlan(grinch).kind,'cabinet','Los jefes estacionales que comparten render no heredan el ataque');
});

test('Los avisos de proyectil terminan en la primera cobertura o en el borde real',()=>{
 const {P,s}=setup(),hit=P.Terrain.hit;s.encounter={scene:{bounds:{left:-500,right:500,top:-300,bottom:300}}};
 P.Terrain.hit=(x,y,r)=>x+r>=180?{}:null;const blocked=P.Encounters.projectilePath(0,0,0,570,7);assert(blocked>=168&&blocked<180);
 P.Terrain.hit=()=>false;assert.equal(P.Encounters.projectilePath(0,0,0,570,7),488);
 let checks=0;P.Terrain.hit=()=>{checks++;return false};const noop=()=>{},ctx=new Proxy({},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)}),e={x:0,y:0};P.Encounters.projectileWarning(ctx,e,[0,.2],570);const first=checks;assert(first>0);P.Encounters.projectileWarning(ctx,e,[0,.2],570);assert.equal(checks,first,'El dibujo debe reutilizar las rutas durante el mismo aviso');P.Terrain.hit=hit;
});

test('Fujimori y Gallinazo reutilizan el mismo plan para avisar y disparar',()=>{
 const {P,s}=setup(),fuji={x:0,y:0,aim:.2,fury:true,attack:'papers'},paper=P.FujimoriBoss.paperPlan(fuji);
 assert.equal(paper.count,7);assert.equal(paper.maxRange,570);P.FujimoriBoss.fire(fuji);assert.equal(s.danger.length,7);s.danger.forEach((shot,i)=>{close(angle(shot),paper.angles[i]);close(Math.hypot(shot.vx,shot.vy)*shot.life,paper.maxRange)});
 s.danger=[];const bird={x:0,y:0,aim:-.1,fury:false,diveFx:[]},feathers=P.Vulture.featherPlan(bird);assert.equal(feathers.count,7);assert.equal(feathers.maxRange,787.5);P.Vulture.feathers(bird);assert.equal(s.danger.length,7);s.danger.forEach((shot,i)=>{close(angle(shot),feathers.angles[i]);close(Math.hypot(shot.vx,shot.vy)*shot.life,feathers.maxRange)});
});

test('Gallinazo fase 2 y ulti describen cada ráfaga con su recorrido real',()=>{
 const {P}=setup(),e={aim:.25,fury:true};
 for(const index of [0,1]){const plan=P.VulturePhase2.rakePlan(e,index);assert.equal(plan.count,9);assert.equal(plan.maxRange,630)}
 const expected=[875,945,665];for(let index=0;index<3;index++){if(index===2)e.heavyAim=-.4;const plan=P.VultureImpact.wavePlan(e,index);assert.equal(plan.maxRange,expected[index]);assert.equal(plan.angles.length,plan.count)}
});

test('ElZeein fija el objetivo, avisa y solo después lanza sus cinco proyectiles',()=>{
 const {P,s}=setup(),e={x:0,y:0,boss:true,attackT:0,castUntil:0};Object.assign(s.player,{x:200,y:0});
 P.Systems.bossAttack(e,.01);assert(e.bossAim);assert.equal(s.danger.length,0);const locked=e.bossAim.angle;
 Object.assign(s.player,{x:0,y:300});P.Systems.bossAttack(e,.68);assert.equal(s.danger.length,0);P.Systems.bossAttack(e,.02);
 assert.equal(s.danger.length,5);assert.equal(e.bossAim,null);const planAngles=s.danger.map(angle);close(planAngles[2],locked);assert(s.danger.every(shot=>Math.abs(Math.hypot(shot.vx,shot.vy)*shot.life-1020)<1e-8));
});
