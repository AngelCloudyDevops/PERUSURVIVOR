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
function encodeState(state){
 const visual=({combatStats,hits,hitSlots,...item})=>item;
 const packet={...state};for(const key of ['shots','fields','danger'])if(packet[key])packet[key]=packet[key].map(visual);
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
module.exports={encodeState,createSender};
