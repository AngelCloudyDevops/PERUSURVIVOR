'use strict';
P.VultureMoon={
  takeoffDuration:1.25,landingDuration:1.2,radius:110,ready:false,failed:false,
  init(){if(this.started||typeof Image==='undefined')return;this.started=true;const image=new Image();image.onload=()=>{this.sky=image;this.ready=true};image.onerror=()=>{this.failed=true};image.src='assets/arenas/gallinazo-moon-sky-v1.webp'},
  smooth(v){v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)},
  noContact(e){return !!e.moonSequence&&(e.moonAirborne||e.phase==='vulture-landing'||e.phase==='vulture-ultimate'&&e.ultimateGrace>0)},
  lift(t,reduced=false){return reduced?(t>.25?700:0):700*this.smooth((t-.22)/1.03)},
  landingPose(t,reduced=false){const q=Math.max(0,Math.min(1,(t-.58)/.62));return {x:reduced?0:-180*(1-q),y:reduced?-650*(1-q):-650*(1-q*q),angle:reduced?0:1.05*(1-this.smooth((q-.78)/.22))}},
  target(e){
    const s=P.state,p=s.player,b=s.encounter.scene.bounds;
    for(let i=0;i<17;i++){const a=i*2.399,r=i?100+Math.floor(i/5)*50:0,x=Math.max(b.left+125,Math.min(b.right-125,p.x+Math.cos(a)*r)),y=Math.max(b.top+125,Math.min(b.bottom-125,p.y+Math.sin(a)*r));if(!P.Terrain.hit(x,y,e.r||62))return {x,y}}
    return {x:e.x,y:e.y};
  },
  beginLanding(e){const q=this.target(e);e.moonTarget={...q};e.x=q.x;e.y=q.y;e.phase='vulture-landing';e.moonStageTime=0;e.moonAirborne=true;P.Core.clear()},
  impact(e){
    if(e.moonLanded)return;e.moonLanded=true;e.moonAirborne=false;e.phase='vulture-ultimate';e.ultimateTime=P.VultureUltimate.duration;e.ultimateGrace=.7;e.ultimateWave=0;e.handoffTime=0;e.moonJustLanded=true;
    const p=P.state.player;e.aim=Math.atan2(p.y-e.y,p.x-e.x);e.dx=Math.cos(e.aim);e.dy=Math.sin(e.aim);
    P.VultureImpact.mark(e);const scar=P.state.encounter?.gallinazoScar;if(scar)scar.moon=true;
    if(P.state.danger.length<70)P.state.danger.push({x:e.x,y:e.y,vx:0,vy:0,history:[],age:0,life:.25,kind:'stomp',glyph:'MOON_IMPACT',radius:this.radius,damage:20,color:'#c6a0ef'});
  },
  tick(e,dt){
    if(P.state.mode!=='play')return false;
    if(e.phase==='vulture-activation'){
      e.ultimateEntryTime=Math.min(P.VulturePhase2.entryDuration,e.ultimateEntryTime+dt);
      if(e.ultimateEntryTime>=P.VulturePhase2.entryDuration){e.phase='vulture-takeoff';e.moonStageTime=0;e.moonFlap=0}
      return false;
    }
    if(e.phase==='vulture-takeoff'){
      e.moonStageTime=Math.min(this.takeoffDuration,(e.moonStageTime||0)+dt);e.moonAirborne=this.lift(e.moonStageTime)>45;
      if(e.moonStageTime>=(e.moonFlap||0)){P.Audio.play('flap');e.moonFlap=e.moonStageTime+.3}
      if(e.moonStageTime>=this.takeoffDuration){e.phase='vulture-moon';e.ultimateTime=0;P.Core.clear();return true}
      return false;
    }
    if(e.phase==='vulture-moon'){
      e.ultimateTime=Math.min(P.VultureUltimate.duration,e.ultimateTime+dt);
      if(e.ultimateTime>=2.05&&!e.moonRoar){e.moonRoar=true;P.Audio.fx('boss')}
      if(e.ultimateTime>=3.05&&!e.moonDiveSound){e.moonDiveSound=true;P.Audio.play('flap')}
      if(e.ultimateTime>=P.VultureUltimate.duration)this.beginLanding(e);
      return true;
    }
    if(e.phase==='vulture-landing'){
      e.moonStageTime=Math.min(this.landingDuration,(e.moonStageTime||0)+dt);
      if(e.moonStageTime>=this.landingDuration)this.impact(e);
      return false;
    }
    return false;
  },
  flightMotion(t){const q=Math.min(1,t/this.takeoffDuration),beat=Math.sin(q*Math.PI*4);return {near:-.7+beat*.9,far:-.3+Math.sin(q*Math.PI*4-.15)*.85,jaw:0,head:0,phase:0,ruffle:0,tuck:this.smooth((t-.3)/.5)}},
  ground(c,e){
    c.save();
    if(e.phase==='vulture-landing'){
      const q=Math.min(1,e.moonStageTime/this.landingDuration);c.translate(e.x,e.y);c.fillStyle='#090b18';c.globalAlpha=.15+q*.4;c.beginPath();c.ellipse(0,0,28+q*72,10+q*25,0,0,Math.PI*2);c.fill();c.globalAlpha=1;c.strokeStyle='#e7bc69';c.fillStyle='#c688dd22';c.lineWidth=3;c.beginPath();c.arc(0,0,this.radius,0,Math.PI*2);c.fill();c.stroke();c.beginPath();c.arc(0,0,this.radius*(1-q),0,Math.PI*2);c.stroke();c.fillStyle='#fff1c5';c.fillRect(-14,-2,28,4);c.fillRect(-2,-14,4,28);
      c.font='bold 12px monospace';c.textAlign='center';c.fillText('¡PICADA LUNAR! · SAL DE LA SOMBRA',0,145);
    }else if(e.phase==='vulture-takeoff'){
      const q=e.moonStageTime/this.takeoffDuration;c.fillStyle='#0a0c18';c.globalAlpha=.4*(1-q);c.beginPath();c.ellipse(e.x,e.y+25,60*(1-q*.6),17*(1-q*.6),0,0,Math.PI*2);c.fill();
      if(!P.Vulture.reduced()){c.globalAlpha=.3*(1-q);c.strokeStyle='#b3a28f';c.lineWidth=4;c.beginPath();c.ellipse(e.x,e.y+25,30+q*110,10+q*28,0,0,Math.PI*2);c.stroke()}
    }
    c.restore();
  },
  drawArena(c,e){
    const R=P.VultureRig,reduced=P.Vulture.reduced();if(!R.ready)return false;
    let x=e.x,y=e.y+e.r*.5,angle=0,m;
    if(e.phase==='vulture-activation'){m={near:-.8,far:-.4,jaw:0,head:.04,phase:0,ruffle:0}}
    else if(e.phase==='vulture-takeoff'){y-=this.lift(e.moonStageTime,reduced);m=this.flightMotion(e.moonStageTime)}
    else if(e.phase==='vulture-landing'){
      if(e.moonStageTime<.58)return true;
      const pose=this.landingPose(e.moonStageTime,reduced);x+=pose.x;y+=pose.y;angle=pose.angle;m={near:-.9,far:-.55,jaw:0,head:0,phase:1,ruffle:0,tuck:1-this.smooth((e.moonStageTime-1)/.18)};
    }else return false;
    c.save();c.translate(x,y-78);c.rotate(angle);R.draw(c,0,78,260,0,false,reduced,m);c.restore();return true;
  },
  clouds(c,w,h,t,reduced){
    if(reduced||!this.ready)return;const image=this.sky;
    for(const side of [-1,1]){c.save();c.globalAlpha=.48;c.beginPath();c.moveTo(side<0?0:w,0);for(let i=0;i<=12;i++)c.lineTo(w*(side<0?.23:.77)+Math.sin(i*2.1)*w*.025,i*h/12);c.lineTo(side<0?0:w,h);c.closePath();c.clip();
      const shift=Math.sin(t*.4+side)*w*.025;
      if(side<0)c.drawImage(image,0,image.height*.12,image.width*.27,image.height*.88,-w*.045+shift,h*.08,w*.32,h*.98);
      else c.drawImage(image,image.width*.77,image.height*.1,image.width*.23,image.height*.9,w*.73+shift,h*.06,w*.30,h);
      c.restore();}
  },
  scene(c,w,h,e){
    const t=e.ultimateTime,reduced=P.Vulture.reduced(),R=P.VultureRig,F=P.VulturePhase2;
    c.save();c.imageSmoothingEnabled=false;c.fillStyle='#080b1b';c.fillRect(0,0,w,h);
    if(this.ready){const k=Math.max(w/this.sky.width,h/this.sky.height)*1.04,dw=this.sky.width*k,dh=this.sky.height*k;c.drawImage(this.sky,(w-dw)/2,(h-dh)/2,dw,dh)}
    else{c.fillStyle='#d7d0df';c.beginPath();c.arc(w*.55,h*.35,h*.24,0,Math.PI*2);c.fill()}
    this.clouds(c,w,h,t,reduced);
    const dive=this.smooth((t-3.05)/.95),rise=this.smooth(t/.9),height=Math.min(h*.66,w*.58),x=w*(.54+dive*.16),centerY=h*(1.35-rise*.8+dive*1.15),angle=reduced?0:dive*1.08;
    c.save();c.translate(x,centerY);c.rotate(angle);
    const m=R.motion(t,false,reduced);m.tuck=reduced?0:rise;if(dive>0){m.near-=dive*1.6;m.far-=dive*2.05}
    const g={x:-height*.5,y:-height*.6,w:height,h:height};P.VultureScene.ribbons(c,g,t,m.phase*.75,false);
    if(!R.draw(c,0,height*.3,height,t,false,reduced,m)&&P.VultureStrike.ready){const a=P.VultureStrike,f=a.frames[0],k=height/a.height;c.drawImage(a.surface,f.x,f.y,f.w,f.h,-f.w*k/2,height*.3-f.h*k,f.w*k,f.h*k)}
    F.electricity(c,0,-height*.1,height*.32,t,m.phase*(reduced?.2:.75),reduced);
    if(!reduced&&dive>0)for(let i=0;i<10;i++)P.VultureImpact.feather(c,-height*.2-(i%3)*height*.1,-height*.4-i*height*.05,18+i%3*8,-1.4+t*.3,.55);
    c.restore();
    if(!reduced&&dive>0){c.save();c.globalAlpha=dive*.5;c.strokeStyle='#c6acd7';c.lineWidth=2;for(let i=0;i<20;i++){const xx=(i*83)%w,yy=(i*61-t*450)%h;c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+25,yy+90);c.stroke()}c.restore()}
    c.restore();
  }
};
{
  const M=P.VultureMoon,u=P.VultureUltimate,F=P.VulturePhase2,I=P.VultureImpact,R=P.VultureRig,scene=P.VultureScene,init=scene.init,pending=scene.pending,start=u.start,tick=u.introTick,overlay=u.overlay,sound=u.introSounds,move=P.Vulture.move,draw=P.Vulture.draw,ground=P.Vulture.ground,effects=P.Vulture.effects,age=I.impactAge,hurt=P.Entities.hurt,inArc=P.Combat.inArc,segment=P.Combat.segmentHit,onScreen=P.Combat.onScreen,arena=R.arenaMotion,camera=I.cameraTarget;
  scene.init=function(){M.init();return init.call(this)};scene.pending=()=>pending()||typeof Image!=='undefined'&&!M.ready&&!M.failed;
  // La entrada ya no utiliza el antiguo cómic de tres paneles.
  u.initComic=function(){scene.init();this.comicStarted=true;this.comicReady=true};
  u.start=function(e,...args){const ok=start.call(this,e,...args);if(ok){e.moonSequence=true;e.moonLanded=false;e.moonAirborne=false;e.moonStageTime=0;e.moonRoar=false;e.moonDiveSound=false}return ok};
  u.introTick=function(dt){const e=this.boss();if(e?.moonSequence&&['vulture-activation','vulture-takeoff','vulture-moon','vulture-landing'].includes(e.phase))return M.tick(e,dt);return tick.call(this,dt)};
  u.introSounds=function(e){if(!e.moonSequence)return sound.call(this,e)};
  u.overlay=function(){const e=this.boss();document.body.classList.toggle('vulture-card',e?.phase==='vulture-activation');if(e?.moonSequence&&e.phase==='vulture-moon'){document.body.classList.add('vulture-cinematic');M.scene(P.Core.ctx,P.Core.width,P.Core.height,e);return}if(e?.moonSequence&&['vulture-takeoff','vulture-landing'].includes(e.phase)){document.body.classList.remove('vulture-cinematic');return}return overlay.call(this)};
  P.Vulture.move=function(e,dt){if(e.moonSequence&&(e.phase==='vulture-takeoff'||e.phase==='vulture-landing'||e.moonJustLanded)){e.moonJustLanded=false;e.hit=Math.max(0,(e.hit||0)-dt);P.Vulture.tickVisuals(e,dt);return}return move.call(this,e,dt)};
  P.Vulture.draw=function(c,e){if(e.moonSequence&&['vulture-activation','vulture-takeoff','vulture-landing'].includes(e.phase)&&M.drawArena(c,e))return true;return draw.call(this,c,e)};
  P.Vulture.ground=function(c){const e=u.boss();if(e?.moonSequence&&['vulture-takeoff','vulture-landing'].includes(e.phase)){M.ground(c,e);return}return ground.call(this,c)};
  P.Vulture.effects=function(c){if(u.boss()?.moonAirborne)return;return effects.call(this,c)};
  I.impactAge=function(e){const scar=P.state.encounter?.gallinazoScar;return scar?.moon?Math.max(0,P.state.elapsed-scar.time):age.call(this,e)};
  I.cameraTarget=function(p){const e=u.boss();if(e?.moonSequence&&e.phase==='vulture-landing')return {x:(p.x+e.x)/2,y:(p.y+e.y)/2};return camera.call(this,p)};
  R.arenaMotion=function(e,reduced){if(e.moonSequence&&e.phase==='vulture-ultimate'&&e.ultimateGrace>0){const m=arena.call(this,e,reduced),q=M.smooth((e.handoffTime||0)/.7);m.near=-.9+(m.near+.9)*q;m.far=-.55+(m.far+.55)*q;return m}return arena.call(this,e,reduced)};
  P.Entities.hurt=function(e,...args){if(e.moonAirborne)return;return hurt.call(this,e,...args)};
  P.Combat.inArc=function(p,e,...args){return !e.moonAirborne&&inArc.call(this,p,e,...args)};
  P.Combat.segmentHit=function(s,e,...args){return !e.moonAirborne&&segment.call(this,s,e,...args)};
  P.Combat.onScreen=function(e,...args){return !e.moonAirborne&&onScreen.call(this,e,...args)};
}
