'use strict';
// Complete six-frame attack sprites share the walking baseline and body scale.
P.PlayerAttackArt={
 duration(p){const kind=P.Data.attacks[p.attack]?.kind;return Math.min(kind==='melee'?.28:kind==='cone'?.23:kind==='nova'?.25:.22,Math.max(.07,(p.rate||.4)*.65))},
 progress(p){const duration=p.castPoseDuration||this.duration(p),started=p.castStarted===undefined?(p.castUntil||0)-.28:p.castStarted,age=P.state.elapsed-started;return p.castUntil>P.state.elapsed&&age>=0&&age<duration?age/duration:null},
 draw(ctx,p){const progress=this.progress(p);if(progress===null)return false;const w=P.WalkArt,id='attack-'+p.id,s=w.sheets[id],base=w.sheets[p.id];if(!s?.ready||!base?.ready){w.load(id);w.load(p.id);return false}const melee=P.Data.attacks[p.attack]?.kind==='melee',index=p.moving&&!melee?w.frame(p.walkPhase):Math.min(5,Math.floor(progress*6)),f=s.frames[index],walk=base.frames[w.frame(p.walkPhase)],baseScale=67.5/base.height,scale=baseScale*(base.sourceHeight||1)/(s.sourceHeight||1),headOffset=((walk.headX||walk.anchorX)-walk.anchorX)*baseScale-((f.headX||f.anchorX)-f.anchorX)*scale;
 s.used=++w.clock;ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y+21.6));if((Number.isFinite(p.aim)?Math.cos(p.aim):(p.facing||1))<0)ctx.scale(-1,1);ctx.imageSmoothingEnabled=false;ctx.drawImage(s.image,f.sx,f.sy,f.w,f.h,(f.localX-f.anchorX)*scale+headOffset,(f.localY-f.anchorY)*scale,f.w*scale,f.h*scale);ctx.restore();return true}
};
