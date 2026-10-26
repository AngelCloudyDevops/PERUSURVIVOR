'use strict';
// Optional parody boss, separate from Alberto's playable ultimate.
P.FujimoriBoss={
 definition:{name:'Alberto Fujimori · El Expediente Final',kind:'fujimori',color:'#ffbd70',hp:1600,r:43,speed:48},
 move(e,dt){const s=P.state,p=s.player;e.hit=Math.max(0,e.hit-dt);e.fury=e.hp<=e.max*.5;
  if(e.phase==='recover'){e.recovery-=dt;if(e.recovery<=0){e.phase='approach';e.attackT=e.fury?1.1:1.65}return}
  if(e.phase==='warning'){e.windup-=dt;if(e.windup<=0){this.fire(e);e.attackUntil=s.elapsed+.35;e.phase='recover';e.recovery=1.1}return}
  const d=Math.hypot(p.x-e.x,p.y-e.y);if(d>210){const direction=P.Encounters.steer(e,p),old={x:e.x,y:e.y};e.x+=direction.x*e.speed*dt;e.y+=direction.y*e.speed*dt;P.Terrain.resolve(e,old,e.r);e.walkPhase=(e.walkPhase||0)+Math.hypot(e.x-old.x,e.y-old.y)/10}
  e.attackT-=dt;if(e.attackT<=0){e.attackIndex++;e.attack=e.attackIndex%2?'papers':'stamp';e.aim=Math.atan2(p.y-e.y,p.x-e.x);e.mark={x:p.x,y:p.y};e.phase='warning';e.windup=1.1;P.Audio.fx('attack')}
 },
 fire(e){const s=P.state;if(e.attack==='stamp'){s.danger.push({...P.Attributes.source(e,'special'),x:e.mark.x,y:e.mark.y,vx:0,vy:0,age:0,life:.3,kind:'stomp',radius:e.fury?105:85,damage:18,color:e.color,history:[]});P.Audio.fx('hit');return}
  const count=e.fury?7:5;for(let i=0;i<count&&s.danger.length<70;i++){const angle=e.aim+(i-(count-1)/2)*.21;s.danger.push({...P.Attributes.source(e,'special'),x:e.x,y:e.y,vx:Math.cos(angle)*190,vy:Math.sin(angle)*190,age:0,life:3,kind:'spread',glyph:'CARD',color:'#ffe4bc',damage:12,history:[],minion:true})}
 },
 telegraph(ctx,e){if(e.phase!=='warning')return;ctx.save();ctx.strokeStyle='#ffcf83';ctx.fillStyle='#ffb95733';ctx.lineWidth=3;if(e.attack==='stamp'){ctx.beginPath();ctx.arc(e.mark.x,e.mark.y,e.fury?105:85,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.font='bold 13px monospace';ctx.textAlign='center';ctx.fillStyle='#fff1ce';ctx.fillText('SELLO · SAL DEL ÁREA',e.mark.x,e.mark.y-115)}else{ctx.translate(e.x,e.y);ctx.rotate(e.aim);ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,220,-.72,.72);ctx.closePath();ctx.fill();ctx.stroke()}ctx.restore()},
 draw(ctx,e){const actor=P.Data.characters.find(c=>c.id==='alberto'),flip=Math.cos(e.aim||0)<0;if(e.phase==='approach'&&Math.hypot(e.x-P.state.player.x,e.y-P.state.player.y)>210){P.WalkArt.load('alberto');P.Sprites.draw(ctx,e.x,e.y,52,actor,1,flip,{phase:e.walkPhase||0})}else P.Sprites.draw(ctx,e.x,e.y,52,actor,e.phase==='warning'||e.attackUntil>P.state.elapsed?3:0,flip);if(e.fury){ctx.fillStyle='#ffcd80';ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.fillText('FASE II · EXPEDIENTE ABIERTO',e.x,e.y-155)}if(e.phase==='recover'){ctx.fillStyle='#a2efc3';ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.fillText('¡CONTRAATACA!',e.x,e.y+65)}return true}
};
P.BossArt.scenes.fujimori={...P.BossArt.scenes.cabinet,id:'archivo-final',name:'Archivo del Expediente Final',color:'#9c6549'};
const fujiBossMove=P.Encounters.bossMove;P.Encounters.bossMove=function(e,dt){return e.kind==='fujimori'?P.FujimoriBoss.move(e,dt):fujiBossMove.call(this,e,dt)};
const fujiBossTelegraph=P.Encounters.drawBoss;P.Encounters.drawBoss=function(ctx,e){if(e.kind==='fujimori')P.FujimoriBoss.telegraph(ctx,e);return fujiBossTelegraph.call(this,ctx,e)};
