'use strict';
/*
 * Benchmark realista y determinista de la lógica del juego (sin dibujo).
 *
 * Uso:  node scripts/benchmark-game.cjs [escenario] [--detail] [--json salida.json]
 *                                       [--ticks N] [--character N] [--map id] [--rate s]
 *   escenario: solo-80 | solo-160 | coop-160 | all (por defecto: all)
 *   --detail : envuelve funciones de P para cronometrar subsistemas (añade sobrecarga:
 *              los ms por tick de esa pasada NO son comparables con la pasada limpia).
 *   --json   : además de la tabla, escribe el resultado completo en ese archivo.
 *   --ticks  : ticks medidos (por defecto 1500, dt = 0.04 s -> 60 s de juego).
 *   --rate   : cadencia del jugador en s (por defecto 0.08, simula mejoras de cadencia).
 *   --character: índice en P.Data.characters (por defecto 2, paloma/plumas: ~60 disparos vivos).
 *
 * Qué ejecuta: backend/simulation.cjs con los módulos fuente (scripts/modules.cjs) en
 * node:vm, o sea la misma lógica que el navegador salvo el dibujo. Nada de dist/.
 *
 * Determinismo: el contexto vm comparte el objeto `Math` del host, así que se sustituye
 * Math.random por un mulberry32 con semilla fija ANTES de crear cada Simulation (el
 * reinicio de Loot y el resto de sistemas leen de ahí). Cada escenario reinicia la
 * semilla. Ni el juego simulado ni el benchmark usan Date.now/performance.now para
 * decidir nada. La entrada del jugador es un círculo determinista. Los ms varían por la
 * máquina, pero los recuentos (enemigos, disparos, llamadas) son idénticos entre
 * ejecuciones mientras el código del juego no cambie.
 *
 * Realismo: enemigos con hp normal (mueren, sueltan gemas y efectos). Antes de cada tick
 * se repone la población hasta el objetivo con P.Entities.enemy() (misma fábrica y misma
 * comprobación de terreno que Systems.spawn), además del spawn natural en modo 'chaos'.
 * Solo el jugador tiene hp enorme; las mejoras de nivel/cofres pendientes se descartan
 * (state.pending = null) para que el tick no se detenga.
 *
 * Fases por escenario:
 *   A) calentamiento (3 s de juego) y medición LIMPIA: solo sim.tick cronometrado
 *      (o con envoltorios si --detail). GC contado con PerformanceObserver('gc').
 *   B) 300 ticks más con contadores de llamadas (Terrain.direction/hit/clear,
 *      Entities.hurt, Maps.definition/current) y cronometraje de snapshot() y
 *      encodeState(), fuera de la medición limpia para no contaminarla.
 */
const {performance,PerformanceObserver}=require('node:perf_hooks');
const fs=require('node:fs'),path=require('node:path'),v8=require('node:v8'),vm=require('node:vm');
const {Simulation}=require('../backend/simulation.cjs'),{encodeState}=require('../backend/state-wire.cjs');

const SCENARIOS={'solo-80':{players:1,enemies:80},'solo-160':{players:1,enemies:160},'coop-160':{players:2,enemies:160}};
const DT=.04,WARMUP=75,COUNT_TICKS=300;
const args=process.argv.slice(2);
const opt=(name,def)=>{const i=args.indexOf(name);return i<0?def:args[i+1]};
const detail=args.includes('--detail'),jsonFile=opt('--json',null),ticks=Number(opt('--ticks',1500)),character=Number(opt('--character',2)),mapId=opt('--map','campo');
const RATE=Number(opt('--rate',.08));
const valueArgs=new Set(['--json','--ticks','--character','--map','--rate']);
const positional=args.filter((a,i)=>!a.startsWith('--')&&!valueArgs.has(args[i-1]));
const wanted=positional[0]||'all';
if(wanted!=='all'&&!SCENARIOS[wanted]){console.error('Escenario desconocido: '+wanted+' (usa '+Object.keys(SCENARIOS).join(', ')+', all)');process.exit(1)}
let forceGc=()=>{};try{v8.setFlagsFromString('--expose-gc');forceGc=vm.runInNewContext('gc')}catch{}

function mulberry32(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const realRandom=Math.random;
const stat=a=>{const s=[...a].sort((x,y)=>x-y),q=p=>s[Math.min(s.length-1,Math.ceil(s.length*p)-1)];return {median:q(.5),p95:q(.95),max:s[s.length-1],mean:s.reduce((x,y)=>x+y,0)/s.length}};
const r3=n=>Math.round(n*1000)/1000;

function setup(cfg){
 Math.random=mulberry32(20240607);
 const ids=Array.from({length:cfg.players},(_,i)=>(character+i)%21);
 const sim=new Simulation(mapId,ids,undefined,null,'chaos'),P=sim.P,s=P.state;
 for(const p of sim.players){p.hp=p.maxHp=1e9;p.inv=0;p.rate=RATE}
 return {sim,P,s};
}
function topUp(sim,P,s,target){
 const alive=sim.players.filter(p=>p.hp>0);
 let guard=0;
 while(s.enemies.length<target&&guard++<target*4){
  for(let i=0;i<8;i++){const e=P.Entities.enemy();if(!P.Terrain.hit(e.x,e.y,e.r+4)){s.enemies.push(e);break}}
 }
 // los jugadores no mueren y no hay decisiones: se descartan cofres/mejoras pendientes
 if(sim.activities.pending)sim.activities.pending=null;
 s.xp=Math.min(s.xp,s.need-1);
 return alive.length;
}
function inputs(sim,t,n){const out=[];for(let i=0;i<n;i++){const a=t*.35+i*Math.PI;out.push({x:Math.cos(a),y:Math.sin(a)})}return out}

// Envoltorios opcionales. owner[key] se sustituye por una versión que acumula tiempo/llamadas.
function wrap(list,table,timed){
 const restore=[];
 for(const [owner,key,label] of list){
  const original=owner?.[key];if(typeof original!=='function')continue;
  const e=table[label]={calls:0,ms:0};
  owner[key]=timed?function(...a){const t=performance.now();try{return original.apply(this,a)}finally{e.ms+=performance.now()-t;e.calls++}}:function(...a){e.calls++;return original.apply(this,a)};
  restore.push(()=>{owner[key]=original});
 }
 return ()=>restore.forEach(f=>f());
}
const timedTargets=P=>[[P.Stats,'step','Stats.step'],[P.Systems,'stepEnemy','Systems.stepEnemy'],[P.Combat,'tick','Combat.tick'],[P.MapEvents,'tick','MapEvents.tick'],[P.Entities,'hurt','Entities.hurt'],[P.Terrain,'direction','Terrain.direction'],[P.Terrain,'hit','Terrain.hit'],[P.Terrain,'clear','Terrain.clear'],[P.Maps,'definition','Maps.definition'],[P.Maps,'current','Maps.current']];
const countTargets=P=>[[P.Terrain,'direction','Terrain.direction'],[P.Terrain,'hit','Terrain.hit'],[P.Terrain,'clear','Terrain.clear'],[P.Entities,'hurt','Entities.hurt'],[P.Maps,'definition','Maps.definition'],[P.Maps,'current','Maps.current'],[P.Systems,'stepEnemy','Systems.stepEnemy']];

async function run(name){
 const cfg=SCENARIOS[name],{sim,P,s}=setup(cfg),n=cfg.players;
 let t=0;const step=()=>{topUp(sim,P,s,cfg.enemies);sim.tick(DT,inputs(sim,t,n));t+=DT};
 for(let i=0;i<WARMUP;i++)step();
 const shotsOf=()=>sim.players.reduce((a,p)=>a+p.shots.length,0);
 // Fase A
 const table={},undo=detail?wrap(timedTargets(P),table,true):()=>{};
 const times=[],pops=[],gc=[];let kills0=s.kills;
 const obs=new PerformanceObserver(l=>{for(const g of l.getEntries())gc.push(g)});obs.observe({entryTypes:['gc']});
 forceGc();await tick();gc.length=0;const heap0=process.memoryUsage().heapUsed;let maxShots=0,sumShots=0,sumEff=0,sumGems=0,sumDanger=0;
 for(let i=0;i<ticks;i++){
  if(i%20===0)await tick(); // cede el bucle de eventos (fuera del cronómetro) para que lleguen los eventos gc
  topUp(sim,P,s,cfg.enemies);const inp=inputs(sim,t,n);t+=DT;
  const a=performance.now();sim.tick(DT,inp);times.push(performance.now()-a);
  const sh=shotsOf();sumShots+=sh;maxShots=Math.max(maxShots,sh);pops.push(s.enemies.length);sumEff+=s.effects.length;sumGems+=s.gems.length;sumDanger+=s.danger.length;
 }
 await tick();obs.disconnect();
 const heapDelta=process.memoryUsage().heapUsed-heap0;undo();
 const result={scenario:name,players:n,character:sim.players.map(p=>p.id),detail,ticks,dt:DT,
  tickMs:Object.fromEntries(Object.entries(stat(times)).map(([k,v])=>[k,r3(v)])),
  population:{enemiesAvg:r3(pops.reduce((a,b)=>a+b,0)/pops.length),shotsAvg:r3(sumShots/ticks),shotsMax:maxShots,effectsAvg:r3(sumEff/ticks),gemsAvg:r3(sumGems/ticks),dangerAvg:r3(sumDanger/ticks),kills:s.kills-kills0,killsPerSec:r3((s.kills-kills0)/(ticks*DT)),mapTimeEnd:r3(s.mapTime)},
  gc:{events:gc.length,totalMs:r3(gc.reduce((a,g)=>a+g.duration,0)),maxMs:r3(Math.max(0,...gc.map(g=>g.duration))),byKind:gc.reduce((o,g)=>{const k=g.detail?.kind??g.kind;o[k]=(o[k]||0)+1;return o},{}),heapUsedDeltaMB:r3(heapDelta/1048576)}};
 if(detail){result.subsystemMsPerTick={};result.subsystemCallsPerTick={};for(const [k,e] of Object.entries(table)){result.subsystemMsPerTick[k]=r3(e.ms/ticks);result.subsystemCallsPerTick[k]=r3(e.calls/ticks)}}
 // Fase B: contadores + snapshot/encode
 const counts={},undoC=wrap(countTargets(P),counts,false),snap=[],enc=[];let bytes=0;
 for(let i=0;i<COUNT_TICKS;i++){
  topUp(sim,P,s,cfg.enemies);const inp=inputs(sim,t,n);t+=DT;sim.tick(DT,inp);
  if(n<2)continue; // snapshot() es del servidor cooperativo (TeamCombo exige 2 jugadores)
  const a=performance.now(),snapshot=sim.snapshot(),b=performance.now(),text=encodeState(snapshot),c=performance.now();
  snap.push(b-a);enc.push(c-b);bytes+=text.length;
 }
 undoC();
 result.callsPerTick=Object.fromEntries(Object.entries(counts).map(([k,e])=>[k,r3(e.calls/COUNT_TICKS)]));
 if(snap.length){result.snapshotMs=Object.fromEntries(Object.entries(stat(snap)).map(([k,v])=>[k,r3(v)]));
 result.encodeMs=Object.fromEntries(Object.entries(stat(enc)).map(([k,v])=>[k,r3(v)]));
 result.snapshotBytesAvg=Math.round(bytes/COUNT_TICKS)}
 return result;
}

const tick=()=>new Promise(r=>setImmediate(r));
(async()=>{
const names=wanted==='all'?Object.keys(SCENARIOS):[wanted],results=[];
for(const name of names){results.push(await run(name))}
Math.random=realRandom;

const pad=(v,w)=>String(v).padStart(w),padr=(v,w)=>String(v).padEnd(w);
console.log('\nBenchmark de juego  node '+process.version+'  dt='+DT+'  ticks='+ticks+'  personaje='+character+'  mapa='+mapId+(detail?'  [--detail: tiempos CON envoltorios]':'  [pasada limpia]'));
console.log(padr('escenario',10)+pad('med ms',9)+pad('p95 ms',9)+pad('max ms',9)+pad('media',9)+pad('enem',8)+pad('disp',8)+pad('dispMax',9)+pad('efec',8)+pad('gemas',8)+pad('kills/s',9));
for(const r of results)console.log(padr(r.scenario,10)+pad(r.tickMs.median,9)+pad(r.tickMs.p95,9)+pad(r.tickMs.max,9)+pad(r.tickMs.mean,9)+pad(r.population.enemiesAvg,8)+pad(r.population.shotsAvg,8)+pad(r.population.shotsMax,9)+pad(r.population.effectsAvg,8)+pad(r.population.gemsAvg,8)+pad(r.population.killsPerSec,9));
console.log('\nGC durante la medición y servidor (snapshot + encode)');
console.log(padr('escenario',10)+pad('gc n',7)+pad('gc ms',9)+pad('gc max',9)+pad('heap MB',9)+pad('snap med',10)+pad('snap p95',10)+pad('enc med',9)+pad('enc p95',9)+pad('KB/snap',9));
for(const r of results){const sn=r.snapshotMs,en=r.encodeMs,d=v=>v===undefined?'-':v;console.log(padr(r.scenario,10)+pad(r.gc.events,7)+pad(r.gc.totalMs,9)+pad(r.gc.maxMs,9)+pad(r.gc.heapUsedDeltaMB,9)+pad(d(sn?.median),10)+pad(d(sn?.p95),10)+pad(d(en?.median),9)+pad(d(en?.p95),9)+pad(sn?(r.snapshotBytesAvg/1024).toFixed(1):'-',9))}
const callKeys=Object.keys(results[0].callsPerTick);
console.log('\nLlamadas por tick (fase B)');
console.log(padr('escenario',10)+callKeys.map(k=>pad(k,19)).join(''));
for(const r of results)console.log(padr(r.scenario,10)+callKeys.map(k=>pad(r.callsPerTick[k],19)).join(''));
if(detail){
 const keys=Object.keys(results[0].subsystemMsPerTick);
 console.log('\nms por tick por subsistema (INCLUSIVO, anidados se solapan; con sobrecarga de cronometraje)');
 console.log(padr('escenario',10)+keys.map(k=>pad(k,19)).join(''));
 for(const r of results)console.log(padr(r.scenario,10)+keys.map(k=>pad(r.subsystemMsPerTick[k],19)).join(''));
 console.log('\nllamadas por tick (pasada detail)');
 for(const r of results)console.log(padr(r.scenario,10)+keys.map(k=>pad(r.subsystemCallsPerTick[k],19)).join(''));
}
if(jsonFile){fs.mkdirSync(path.dirname(path.resolve(jsonFile)),{recursive:true});fs.writeFileSync(jsonFile,JSON.stringify({node:process.version,detail,ticks,character,map:mapId,results},null,1));console.log('\nJSON: '+jsonFile)}
})();
