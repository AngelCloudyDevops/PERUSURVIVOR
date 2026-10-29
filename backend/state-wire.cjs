'use strict';
// Transport only: authoritative actors, collisions and solo code stay untouched.
function encodeState(state){
 const visual=({combatStats,hits,hitSlots,...item})=>item;
 const packet={...state};for(const key of ['shots','fields','danger'])if(packet[key])packet[key]=packet[key].map(visual);
 return JSON.stringify(packet,function(key,value){
  // Hundredths of a world pixel are sufficient for drawing. Keep unit aim vectors exact.
  if((key==='x'||key==='y')&&typeof value==='number'&&typeof this.x==='number'&&typeof this.y==='number'&&(Math.abs(this.x)>1||Math.abs(this.y)>1))return Math.round(value*100)/100;
  return value;
 });
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
