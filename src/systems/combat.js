'use strict';
P.Combat={
orbitPoints(p,time){return Array.from({length:3},(_,i)=>{const a=time*2.8+i*Math.PI*2/3;return {x:p.x+Math.cos(a)*100*p.reach,y:p.y+Math.sin(a)*100*p.reach}})},
inArc(p,e,range,arc){const dx=e.x-p.x,dy=e.y-p.y;if(Math.hypot(dx,dy)>range+(e.r||0))return false;const angle=Math.atan2(dy,dx)-p.aim;return Math.abs(Math.atan2(Math.sin(angle),Math.cos(angle)))<=arc/2+1e-9},
cast(){const s=P.state,p=s.player,a=P.Data.attacks[p.attack],targets=s.enemies.filter(e=>e.hp>0),props=P.Terrain.active().filter(o=>o.solid&&Number.isFinite(o.hp)&&o.hp>0),candidates=[...targets,...props];if(!candidates.length)return false;const target=candidates.reduce((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)<Math.hypot(b.x-p.x,b.y-p.y)?a:b);
const r=a.range*p.reach;if(a.kind==='melee'&&Math.hypot(target.x-p.x,target.y-p.y)>r+(target.r||0))return false;
p.aim=Math.atan2(target.y-p.y,target.x-p.x);p.facing=Math.cos(p.aim)<0?-1:1;p.castUntil=s.elapsed+.28;s.effects.push({kind:'cast',x:p.x,y:p.y-15,life:.25,maxLife:.25,color:p.color});
if(a.shout)s.effects.push({kind:'shout',text:a.shout,x:p.x,y:p.y-60,life:.55,maxLife:.55,color:p.color});
if(a.kind==='spread'||a.kind==='boomerang'){
 const count=(a.count||(p.attack==='feathers'?5:a.kind==='spread'?3:1))+(p.projectileBonus||0),speed=a.speed||470;
 for(let i=0;i<count;i++){const angle=p.aim+(i-(count-1)/2)*(a.spread===undefined?.18:a.spread);s.shots.push({x:p.x,y:p.y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,angle,life:a.kind==='boomerang'?1.3*p.reach:r/speed,turnAt:.55*p.reach,age:0,history:[],kind:a.kind,glyph:a.glyph,color:p.color,power:p.power*(a.powerScale||1),hits:new Set(),remaining:a.kind==='boomerang'?Infinity:(a.pierce||1),motion:a.motion,amplitude:a.amplitude||0,frequency:a.frequency||0,cloud:!!a.cloud,returning:false})}
 if(['BULLET','FISH','ROACH','DIAPER'].includes(a.glyph))s.effects.push({kind:'muzzle',x:p.x+Math.cos(p.aim)*24,y:p.y+Math.sin(p.aim)*24,angle:p.aim,life:.12,maxLife:.12,color:a.glyph==='BULLET'?'#ffd48c':p.color});
}
if(['nova','cone','melee'].includes(a.kind)){
 const arc=a.kind==='nova'?Math.PI*2:(a.arc||1.3);
 for(const o of P.Terrain.active())if(o.solid&&Number.isFinite(o.hp)&&this.inArc(p,o,r,arc))P.Terrain.damage(o,p.power);
 s.effects.push({kind:a.kind==='melee'?'kick':a.kind,x:p.x,y:p.y,angle:p.aim,arc,r,life:a.kind==='melee'?.3:.32,maxLife:a.kind==='melee'?.3:.32,color:p.color,glyph:a.glyph});
 for(const e of targets){if(this.inArc(p,e,r,arc))P.Entities.hurt(e,p.power,a.push||(a.kind==='nova'?28:10));if(s.mode!=='play')return true}
}
if(a.kind==='orbit')for(const point of this.orbitPoints(p,s.elapsed)){const obstacle=P.Terrain.hit(point.x,point.y,15);if(obstacle)P.Terrain.damage(obstacle,p.power);for(const e of targets){if(Math.hypot(point.x-e.x,point.y-e.y)<e.r+24)P.Entities.hurt(e,p.power);if(s.mode!=='play')return true}}
return true
},
impact(shot){if(!shot.cloud)return;P.state.fields.push({x:shot.x,y:shot.y,r:85,power:shot.power*.25,life:2.5,tick:0,color:'#a6bb78'});shot.cloud=false},
segmentHit(shot,e,oldX,oldY){const dx=shot.x-oldX,dy=shot.y-oldY,len=dx*dx+dy*dy,t=len?Math.max(0,Math.min(1,((e.x-oldX)*dx+(e.y-oldY)*dy)/len)):0;return Math.hypot(e.x-oldX-t*dx,e.y-oldY-t*dy)<e.r+7},
tick(dt){const s=P.state,p=s.player;s.fire-=dt;if(s.fire<=0)s.fire=this.cast()?p.rate:.05;if(s.mode!=='play')return;
for(const shot of s.shots){const oldX=shot.x,oldY=shot.y,oldAge=shot.age;shot.history.push({x:shot.x,y:shot.y});if(shot.history.length>8)shot.history.shift();shot.age+=dt;shot.life-=dt;
 if(shot.kind==='boomerang'&&shot.age>shot.turnAt){if(!shot.returning){shot.returning=true;shot.hits.clear()}const dx=p.x-shot.x,dy=p.y-shot.y,d=Math.hypot(dx,dy)||1;shot.vx=dx/d*530;shot.vy=dy/d*530;if(d<18)shot.life=0}
 shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;
 if(shot.motion==='zigzag'){const wobble=(Math.sin(shot.age*shot.frequency)-Math.sin(oldAge*shot.frequency))*shot.amplitude;shot.x-=Math.sin(shot.angle)*wobble;shot.y+=Math.cos(shot.angle)*wobble}
 const obstacle=P.Terrain.hit(shot.x,shot.y,5);if(obstacle){P.Terrain.damage(obstacle,shot.power);this.impact(shot);shot.life=0;continue}
 for(const e of s.enemies){if(e.hp<=0||shot.hits.has(e)||shot.life<=0)continue;if(this.segmentHit(shot,e,oldX,oldY)){shot.hits.add(e);P.Entities.hurt(e,shot.power);if(s.mode!=='play')return;shot.remaining--;if(shot.remaining<=0)shot.life=0;this.impact(shot);if(s.mode!=='play')return}}
 if(shot.life<=0)this.impact(shot)
}
s.shots=s.shots.filter(shot=>shot.life>0);s.enemies=s.enemies.filter(e=>e.hp>0);
for(const field of s.fields){field.life-=dt;field.tick-=dt;if(field.tick<=0){field.tick=.4;for(const e of s.enemies){if(e.hp>0&&Math.hypot(e.x-field.x,e.y-field.y)<field.r+e.r)P.Entities.hurt(e,field.power);if(s.mode!=='play')return}}}s.fields=s.fields.filter(f=>f.life>0);
for(const shot of s.danger){shot.history.push({x:shot.x,y:shot.y});if(shot.history.length>8)shot.history.shift();shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.age+=dt;shot.life-=dt;if(s.encounter&&P.Terrain.hit(shot.x,shot.y,7)){shot.life=0;continue}if(Math.hypot(shot.x-p.x,shot.y-p.y)<24&&p.inv<=0){p.hp=Math.max(0,p.hp-P.Loot.damage(p,14));p.inv=.7;shot.life=0;P.Entities.burst(p.x,p.y,'#d89cff');if(p.hp<=0){P.Game.finish(false);return}}}s.danger=s.danger.filter(shot=>shot.life>0)
}
};