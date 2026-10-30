'use strict';
// La rueda solicita el mismo cambio validado que las teclas 1–3.
P.WeaponInput={
 delta:0,lastAt:-Infinity,lastDirection:0,lastEventAt:-Infinity,
 arsenal(p=P.state.player){return({kingteka:P.KingtekaArsenal,makanaky:P.MakanakyArsenal,sideral:P.SideralArsenal,cirilo:P.CiriloArsenal,chamelin:P.ChamelinArsenal,cristorata:P.CristorataArsenal,marciano:P.MarcianoArsenal})[p?.id]||null},
 cycle(direction){if(!Number.isFinite(direction)||!direction)return false;const p=P.state.player,system=this.arsenal(p);if(P.state.mode!=='play'||!(p?.hp>0)||P.Coop?.session&&!P.Coop.active||P.Coop?.active&&!P.Coop.canAct())return false;const state=system?.init(p);if(!state)return false;const unlocked=system.order.filter(id=>state.unlocked[id]);if(unlocked.length<2)return false;const pending=P.Coop?.active?system.order[(P.Coop.weapon||0)-1]:null,current=unlocked.includes(pending)?pending:state.active,index=unlocked.indexOf(current),next=unlocked[(index+(direction>0?1:-1)+unlocked.length)%unlocked.length];return system.request(system.order.indexOf(next)+1)},
 wheel(e,now=globalThis.performance?.now?.()??Date.now()){
  if(e.ctrlKey||e.metaKey||e.shiftKey||!Number.isFinite(e.deltaY)||!e.deltaY||P.state.mode!=='play'||!(P.state.player?.hp>0))return false;
  const system=this.arsenal(),state=system?.init(P.state.player);if(!state||system.order.filter(id=>state.unlocked[id]).length<2)return false;
  e.preventDefault();const direction=Math.sign(e.deltaY);if(direction!==this.lastDirection||now-this.lastEventAt>250)this.delta=0;this.lastDirection=direction;this.lastEventAt=now;this.delta+=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?120:1);if(Math.abs(this.delta)<24||now-this.lastAt<180)return false;this.delta=0;if(!this.cycle(direction))return false;this.lastAt=now;return true
 },
 reset(){this.delta=0;this.lastAt=-Infinity;this.lastDirection=0;this.lastEventAt=-Infinity}
};
P.Core.canvas.addEventListener('wheel',e=>P.WeaponInput.wheel(e),{passive:false});
addEventListener('blur',()=>P.WeaponInput.reset());
