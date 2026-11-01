'use strict';
// Transport only: authoritative actors, collisions and solo code stay untouched.
// Hundredths of a world pixel are sufficient for drawing. Keep unit aim vectors exact.
// Pre-pass copy that rounds x/y with the old replacer's rule: a per-key replacer slowed every key; without it stringify takes the native fast path.
function rounded(v){
 if(v===null||typeof v!=='object')return v;
 if(typeof v.toJSON==='function')return rounded(v.toJSON());
 if(Array.isArray(v)){const o=v.slice();for(let i=0;i<o.length;i++){const e=o[i];if(e!==null&&typeof e==='object')o[i]=rounded(e)}return o}
 if(v instanceof Map||v instanceof Set)return v;
 const o={...v},x=v.x,y=v.y;
 if(typeof x==='number'&&typeof y==='number'&&(Math.abs(x)>1||Math.abs(y)>1)){o.x=Math.round(x*100)/100;o.y=Math.round(y*100)/100}
 for(const k in o){const e=o[k];if(e!==null&&typeof e==='object')o[k]=rounded(e)}
 return o;
}
// Protocol 3 slimming: the field-by-field evidence (file:line) is in tests/snapshot-slim.test.cjs.
// Dropped enemy keys are only read by simulation code that co-op clients never run (Game.update hands off to Coop.tick); default-valued keys are read by truthiness or ||0.
const ENEMY_SIM=new Set(['balanceBase','balanceId','balanceDamage','balanceCooldown','balanceArea','balanceEffectDuration','waveRole','evolutionApplied','progressive','threatStage','targetSlot']);
const ENEMY_DEFAULT={boss:false,heavy:false,profession:null,evolution:0,ultiFlash:0};
const sameStats=(a,b)=>{for(const k in a)if(a[k]!==b[k])return false;for(const k in b)if(!(k in a))return false;return true};
// combatStats is dropped only when the client's own Attributes.init (World.render, Stats.step) regenerates the identical object from the kept fields.
const defaultStats=new WeakMap();
// Attributes.init depends only on these keys; the regenerated default is computed once per signature and compared key by key.
function slimEnemy(P,e){
 const o={};for(const k in e){if(ENEMY_SIM.has(k)||k==='combatStats'||k in ENEMY_DEFAULT&&e[k]===ENEMY_DEFAULT[k])continue;o[k]=e[k]}
 const stats=e.combatStats;if(!stats)return o;
 let cache=defaultStats.get(P);if(!cache)defaultStats.set(P,cache=new Map);
 const sig=[o.id,o.miniboss,o.miniMap,o.vultureMinion,o.mapBoss,o.boss,o.kind,o.design,o.mimic,o.heavy].join('|');let base=cache.get(sig);
 if(base===undefined){const probe={...o};P.Attributes.init(probe);base=probe.combatStats||null;cache.set(sig,base)}
 if(!(base&&sameStats(base,stats)))o.combatStats=stats;
 return o;
}
const slimEnemies=(P,list)=>list.map(e=>slimEnemy(P,e));
const visualShot=({combatStats,hits,hitSlots,startX,startY,turnAt,amplitude,frequency,pelletVolley,falloff,dotaCast,dotaPower,comboBlocked,remaining,returning,homing,...item})=>item;
function encodeState(state){
 const visual=({combatStats,hits,hitSlots,...item})=>item;
 const packet={...state};for(const key of ['shots','fields','danger'])if(packet[key])packet[key]=packet[key].map(key==='shots'?visualShot:visual);
 return JSON.stringify(rounded(packet));
}
function createSender(diagnostics){
 const canState=ws=>ws?.readyState===1&&!ws.coopStatePending&&ws.bufferedAmount<64*1024;
 function send(ws,data,state=false){
  if(ws?.readyState!==1)return;
  if(state&&!canState(ws)||!state&&ws.bufferedAmount>=512*1024){diagnostics.droppedStates++;return}
  if(state)ws.coopStatePending=true;
  try{ws.send(typeof data==='string'?data:JSON.stringify(data),state?undefined:{compress:false},()=>{if(state)ws.coopStatePending=false})}catch(error){if(state)ws.coopStatePending=false;throw error}
 }
 return {send,canState};
}
module.exports={encodeState,createSender,slimEnemies,slimEnemy};
