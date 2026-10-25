'use strict';
P.World={
collide(p,old){P.Maps.collide(p,old)},
draw(ctx,cx,cy,w,h,time){P.Maps.draw(ctx,cx,cy,w,h,time)},
render(time){const s=P.state,{ctx,width:w,height:h}=P.Core,playing=s.mode!=='menu',p=s.player,zoom=Math.max(playing?1.15:.6,w/2400,h/1600),target=P.Maps.camera(playing?p.x:0,(playing?p.y:-100)-(playing?55:160),w/zoom,h/zoom);if(playing){const follow=1-Math.exp(-Math.min((time-(this.lastCamera||time))/1000,.05)*10);P.Terrain.cameraX+=(target.x-P.Terrain.cameraX)*follow;P.Terrain.cameraY+=(target.y-P.Terrain.cameraY)*follow}this.lastCamera=time;const cx=playing?P.Terrain.cameraX:target.x,cy=playing?P.Terrain.cameraY:target.y;P.Terrain.zoom=zoom;ctx.clearRect(0,0,w,h);ctx.save();ctx.translate(w*.5,h*.5);ctx.scale(zoom,zoom);ctx.translate(-cx,-cy);this.draw(ctx,cx,cy,w/zoom,h/zoom,time);if(playing)P.Encounters.draw(ctx,time);
if(playing){
for(const g of s.gems){ctx.save();ctx.translate(g.x,g.y);ctx.rotate(Math.PI/4);ctx.fillStyle=g.kind==='heal'?'#93e7a6':'#f6cc65';ctx.fillRect(-4,-4,8,8);ctx.restore()}
const props=P.Terrain.active().filter(o=>o.solid).map(o=>({terrainProp:o,y:o.y+o.h/2}));const actors=[...s.enemies,p,...props].sort((a,b)=>a.y-b.y);
for(const actor of actors){if(actor.terrainProp){P.Terrain.draw(ctx,actor.terrainProp);continue}if(actor===p){if(p.inv<=0||Math.floor(time/70)%2){if(!P.Sprites.actor(ctx,p))P.Entities.portrait(ctx,p.x,p.y,24,p)}ctx.fillStyle='#fbefdc';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText(p.name,p.x,p.y+37);continue}
const e=actor;if(e.mapBoss){P.Encounters.drawBoss(ctx,e);continue}if(e.boss){P.Sprites.draw(ctx,e.x,e.y,43,P.Data.boss,e.castUntil>s.elapsed?3:1+Math.floor(s.elapsed*6)%2,p.x<e.x)}else if(!P.EnemyArt.draw(ctx,e))P.Entities.portrait(ctx,e.x,e.y,e.r,{look:e.boss?'headset':'cap',color:e.hit>0?'#fff':e.boss?'#bc66a0':e.heavy?'#8c7caa':'#667c97',skin:e.boss?'#a89bc3':'#9dabb7'});ctx.fillStyle='#182137';ctx.font='bold '+(e.boss?18:11)+'px monospace';ctx.textAlign='center';ctx.fillText(e.boss?'ELZEEIN':e.design===5?'PNP':e.heavy?P.EnemyArt.names[e.design||0]:'',e.x,e.y-e.r-10);if(e.boss){ctx.fillStyle='#303248';ctx.fillRect(e.x-50,e.y-65,100,6);ctx.fillStyle='#f0a75e';ctx.fillRect(e.x-50,e.y-65,100*Math.max(0,e.hp/e.max),6)}}
for(const shot of [...s.shots,...s.danger])P.FX.projectile(ctx,shot);
if(p.attack==='orbit')P.FX.orbit(ctx,p);
for(const effect of s.effects)P.FX.effect(ctx,effect)
}
ctx.restore();const g=ctx.createRadialGradient(w/2,h/2,150,w/2,h/2,Math.max(w,h)*.7);g.addColorStop(0,'#14203200');g.addColorStop(1,'#14203299');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);if(playing)P.Terrain.minimap(ctx,w,h)}
};
