'use strict';
P.ChosicanoCombat={
 hornOrigin(e){const x=e.x+Math.cos(e.aim||0)*(e.r+20),y=e.y+Math.sin(e.aim||0)*(e.r+20);return P.Terrain.clear(e.x,e.y,x,y,5)?{x,y}:{x:e.x,y:e.y}},
 fireHorn(e){const s=P.state,o=this.hornOrigin(e);e.hornAt=s.elapsed;s.danger.push({...P.Attributes.source(e,'special'),...o,vx:0,vy:0,age:0,life:.44,maxLife:.44,kind:'stomp',hornWave:true,waveSpeed:650,waveFrom:0,radius:245,angle:e.aim||0,arc:Math.PI*.55,damage:14,color:'#ffe1a0',history:[]});P.Audio.fx('chosicano-horn')},
 brake(e){const s=P.state;e.phase='recover';e.recovery=1.1;e.attackT=1.8;e.brakeAt=s.elapsed;e.skids=(e.skids||[]).slice(-2);e.skids.push({x:e.x,y:e.y,angle:e.aim||0,born:s.elapsed});P.Audio.fx('chosicano-brake')},
 move(e,dt){const s=P.state,p=s.player;e.hit=Math.max(0,e.hit-dt);e.busMoving=false;e.skids=(e.skids||[]).filter(q=>s.elapsed-q.born<2.5);
  if(e.phase==='recover'){e.recovery-=dt;if(e.recovery<=0)e.phase='approach';return}
  if(e.phase==='charge'){const b=s.encounter.scene.bounds,old={x:e.x,y:e.y},time=Math.max(0,Math.min(dt,e.windup)),distance=530*time,steps=Math.max(1,Math.ceil(distance/12));let stop=false;for(let i=0;i<steps;i++){const previous={x:e.x,y:e.y};e.x+=e.dx*distance/steps;e.y+=e.dy*distance/steps;const blocked=P.Terrain.hit(e.x,e.y,e.r);if(blocked)P.Terrain.resolve(e,previous,e.r);if(blocked||e.x<b.left+e.r||e.x>b.right-e.r||e.y<b.top+e.r||e.y>b.bottom-e.r){e.x=Math.max(b.left+e.r,Math.min(b.right-e.r,e.x));e.y=Math.max(b.top+e.r,Math.min(b.bottom-e.r,e.y));stop=true;break}}e.windup-=dt;P.ChosicanoArt.step(e,old);if(stop||e.windup<=0)this.brake(e);return}
  if(e.phase==='warning'){e.windup-=dt;if(e.windup<=0){if(e.attack==='horn'){this.fireHorn(e);e.phase='recover';e.recovery=1.1;e.attackT=1.8}else{e.phase='charge';e.windup=1}}return}
  const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1;if(d>150){const direction=P.Encounters.steer(e,p),old={x:e.x,y:e.y};e.x+=direction.x*e.speed*dt;e.y+=direction.y*e.speed*dt;P.Terrain.resolve(e,old,e.r);P.ChosicanoArt.step(e,old)}e.attackT-=dt;if(e.attackT<=0){e.attackIndex=(e.attackIndex||0)+1;e.attack=e.attackIndex%2?'charge':'horn';e.phase='warning';e.windup=e.attack==='horn'?1:1.15;e.dx=dx/d;e.dy=dy/d;e.aim=Math.atan2(dy,dx);P.Audio.fx('chosicano-ready')}
 },
 brakePose(e,reduced=false){if(e.phase!=='recover'||e.attack==='horn'||e.brakeAt===undefined)return null;const age=P.state.elapsed-e.brakeAt;if(age<0||age>.6)return null;return {age,tilt:reduced?0:age<.35?Math.sin(age/.35*Math.PI)*.07:0,dust:reduced?0:Math.max(0,1-age/.6)}}
};
