'use strict';
/*
 * Protocol 3 slim snapshot. Evidence table (field -> decision -> client-side evidence).
 * Co-op clients never simulate: src/scenes/game.js:4 Game.update -> P.Coop.tick and return; src/network/cooperative.js:82-86 ("no se ejecuta Game.update en este cliente").
 * enemy.balanceBase/balanceId/balanceDamage/balanceCooldown/balanceArea/balanceEffectDuration -> DROP: only src/systems/character-balance.js:17 (applyEnemy writes) and :23 (Attributes.source/incoming, prepareDanger, wrapTimers: server spawn/hurt/Combat.tick paths); src/development/test-bench.js:17 is player balance, guarded by !P.Coop.active (:108).
 * enemy.waveRole -> DROP: written only in src/data/difficulty.js:16 (pace at spawn).
 * enemy.evolutionApplied -> DROP: src/systems/minion-evolution.js:12 apply() guard at spawn.
 * enemy.progressive/threatStage -> DROP: src/data/difficulty.js:21, src/systems/minion-tactics.js:17, src/systems/minion-professions.js:16 (attack-profile selection used by Systems.ranged, progression.js:35: simulation only).
 * enemy.targetSlot -> DROP: src/systems/progression.js:7 Systems.target (stepEnemy). map-events.js:36/125 targetSlot belong to other objects.
 * enemy.combatStats -> DROP only when identical to what the client regenerates: src/rendering/world.js:39 calls P.Attributes.init(actor) before the badge; src/systems/stat-runtime.js:5 Stats.step runs Attributes.init every frame (src/data/attributes.js:8, src/data/stats.js:23). KEPT when different (bosses, professions, balance overrides, evolved defense).
 * enemy.boss=false, heavy=false, profession=null, evolution=0, ultiFlash=0 -> DROP when default: reads are truthiness, >0, Number.isInteger or ||0 (enemy-art.js:23,31; minion-evolution.js:10; walk-art.js:66; ultimate.js:14,23); no ===false/null comparisons anywhere in src.
 * enemy.minionId, design, hit, castUntil, attackT, moving, facing, walkPhase, hitDir, x, y, hp, max, r, speed -> KEEP (coop-motion.js:4 pose key, enemy-art, world.js, boss bars, bossTelegraph).
 * shot.startX/startY (combat.js:12), turnAt/returning (combat.js:45), amplitude/frequency (combat.js:48), pelletVolley/falloff (combat.js:12,14), dotaCast/dotaPower (dota-equipment.js:53,65), comboBlocked (combat.js:37), remaining (combat.js:39,50), homing (combat.js:46) -> DROP: Combat.tick/hit simulation only. Danger shots are NOT stripped (minion-tactics.js:59,74 reads returning on danger).
 * shot.history -> KEEP: src/rendering/effects.js:12 FX.projectile draws this.trail(ctx,s.history) for every default shot, contraTrail (:5) and gaaTrail (:6) too; combat.js:44 already caps it at 8 points.
 */
const test=require('node:test'),assert=require('node:assert/strict');
const {Simulation}=require('../backend/simulation.cjs'),{encodeState,slimEnemy}=require('../backend/state-wire.cjs');
const ENEMY_DROP=['balanceBase','balanceId','balanceDamage','balanceCooldown','balanceArea','balanceEffectDuration','waveRole','evolutionApplied','progressive','threatStage','targetSlot'];
const SHOT_DROP=['startX','startY','turnAt','amplitude','frequency','pelletVolley','falloff','dotaCast','dotaPower','comboBlocked','remaining','returning','homing','combatStats','hits','hitSlots'];
const DEFAULTS={boss:false,heavy:false,profession:null,evolution:0,ultiFlash:0};
function mulberry32(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
// the pre-protocol-3 per-key replacer (rounding rule of the reference wire)
const old=v=>JSON.stringify(v,function(key,value){if((key==='x'||key==='y')&&typeof value==='number'&&typeof this.x==='number'&&typeof this.y==='number'&&(Math.abs(this.x)>1||Math.abs(this.y)>1))return Math.round(value*100)/100;return value});
const plain=v=>JSON.parse(JSON.stringify(v));
function run(fn){
 const real=Math.random;Math.random=mulberry32(20240607);
 try{
  const sim=new Simulation('campo',[2,3],undefined,null,'chaos'),P=sim.P,s=P.state;
  for(const p of sim.players){p.hp=p.maxHp=1e9;p.inv=0;p.rate=.08}
  s.mapTime=300;let t=0;
  for(let i=0;i<150;i++){
   let g=0;while(s.enemies.length<160&&g++<640){const e=P.Entities.enemy();if(!P.Terrain.hit(e.x,e.y,e.r+4))s.enemies.push(e)}
   if(sim.activities.pending)sim.activities.pending=null;s.xp=Math.min(s.xp,s.need-1);
   sim.tick(.04,[0,1].map(k=>({x:Math.cos(t*.35+k*Math.PI),y:Math.sin(t*.35+k*Math.PI)})));t+=.04;
   if(i>=60&&i%30===0)fn(sim,sim.snapshot(),P);
  }
 }finally{Math.random=real}
}
test('slim snapshot keeps everything the co-op client renders and drops only simulation data',()=>{
 let checked=0,dropped=0,kept=0;
 run((sim,snap,P)=>{
  const wire=JSON.parse(encodeState(snap)),orig=P.state.enemies;
  assert.equal(wire.enemies.length,orig.length);
  for(let i=0;i<orig.length;i++){
   const o=orig[i],w=wire.enemies[i];
   const expected=JSON.parse(old(o));
   for(const k of ENEMY_DROP)assert.ok(!(k in w),'enemy '+k+' must be absent');
   for(const k in o){
    if(ENEMY_DROP.includes(k)||k==='combatStats')continue;
    if(k in DEFAULTS&&o[k]===DEFAULTS[k]){assert.ok(!(k in w),k+' default must be absent');continue}
    assert.ok(k in w||o[k]===undefined,'enemy key missing: '+k);assert.deepEqual(w[k],expected[k],k);
   }
   assert.equal(w.minionId,o.minionId);assert.equal(w.design,o.design);
   // client regeneration (World.render / Stats.step): Attributes.init on the received enemy must restore the server combatStats
   const client=plain(w);P.Attributes.init(client);
   if(w.combatStats)kept++;else dropped++;
   assert.deepEqual(plain(client.combatStats),plain(o.combatStats),'combatStats regenerated '+i);
   // missing-as-default reads
   assert.equal(!!client.heavy,!!o.heavy);assert.equal(!!client.boss,!!o.boss);assert.equal(!!client.profession,!!o.profession);assert.equal(client.evolution||0,o.evolution||0);assert.equal((client.ultiFlash||0)>0,o.ultiFlash>0);
  }
  const shots=snap.shots;assert.equal(wire.shots.length,shots.length);
  for(let i=0;i<shots.length;i++){
   for(const k of SHOT_DROP)assert.ok(!(k in wire.shots[i]),'shot '+k+' must be absent');
   for(const k in shots[i])if(!SHOT_DROP.includes(k)&&shots[i][k]!==undefined)assert.ok(k in wire.shots[i],'shot key missing: '+k);
   assert.ok(Array.isArray(wire.shots[i].history),'history kept for FX.trail');assert.equal(wire.shots[i].history.length,shots[i].history.length);
  }
  checked++;
 });
 assert.ok(checked>=3&&dropped>0);console.log('  combatStats dropped',dropped,'kept (non-default)',kept);
});
test('non-default combatStats and special enemies are never stripped',()=>{
 let done=0;
 run((sim,snap,P)=>{
  if(done++)return;
  const e=P.state.enemies.find(q=>Number.isInteger(q.design)),defended={...e,combatStats:{...e.combatStats,physicalDefense:e.combatStats.physicalDefense*1.6}};
  assert.deepEqual(plain(slimEnemy(P,defended).combatStats),plain(defended.combatStats));
  assert.equal(slimEnemy(P,{...e,heavy:true}).heavy,true);
  const odd={x:1,y:2,hp:5,max:5,r:10,boss:true,combatStats:{attribute:'wit',damageType:'special'}};
  assert.equal(slimEnemy(P,odd).boss,true);assert.ok(slimEnemy(P,odd).combatStats);
  assert.equal(slimEnemy(P,{x:1,y:2,hp:1,max:1,r:5}).combatStats,undefined);
 });
});
test('KB per snapshot before/after',()=>{
 let before=0,after=0,n=0;
 run((sim,snap,P)=>{before+=JSON.stringify({...snap,enemies:P.state.enemies}).length;after+=encodeState(snap).length;n++});
 console.log('  snapshot KB raw/slim:',(before/n/1024).toFixed(1),(after/n/1024).toFixed(1));
 assert.ok(after<before*.55);
});
