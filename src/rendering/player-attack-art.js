'use strict';
// Complete six-frame attack sprites share the walking baseline and body scale.
P.PlayerAttackArt={
 direction(p){const angle=p.attackAim??p.aim??0,pitch=Math.atan2(Math.sin(angle),Math.abs(Math.cos(angle))),row=Math.max(0,Math.min(4,Math.round(pitch/(Math.PI/4))+2));return {row,flip:Math.cos(angle)<-1e-6||(Math.abs(Math.cos(angle))<=1e-6&&(p.attackFacing??p.facing??1)<0)}},
 aiming(p){return p.hp!==0&&['spread','boomerang','cone'].includes(P.Data.attacks[p.attack]?.kind)&&(p.aimUntil||0)>P.state.elapsed},
 heading(p){const aiming=this.aiming(p)||this.progress(p)!==null;return aiming&&Number.isFinite(p.attackAim??p.aim)?Math.cos(p.attackAim??p.aim):(p.facing||1)},
 duration(p){const kind=P.Data.attacks[p.attack]?.kind;return Math.min(kind==='melee'?.28:kind==='cone'?.23:kind==='nova'?.25:.22,Math.max(.07,(p.rate||.4)*.65))},
 progress(p){const duration=p.castPoseDuration||this.duration(p),started=p.castStarted===undefined?(p.castUntil||0)-.28:p.castStarted,age=P.state.elapsed-started;return this.aiming(p)?Math.min(.999,Math.max(0,age/duration)):p.castUntil>P.state.elapsed&&age>=0&&age<duration?age/duration:null},
 draw(ctx,p){const progress=this.progress(p);if(progress===null)return false;const w=P.WalkArt,id='attack-'+p.id,s=w.sheets[id],base=w.sheets[p.id];if(!s?.ready||!base?.ready){w.load(id);w.load(p.id);return false}const melee=P.Data.attacks[p.attack]?.kind==='melee',index=p.moving&&!melee?w.frame(p.walkPhase):Math.min(5,Math.floor(progress*6)),direction=this.direction(p),f=s.frames[s.directional?direction.row*6+index:index],walk=base.frames[w.frame(p.walkPhase)],baseScale=67.5/base.height,scale=s.directional?67.5/s.height:baseScale*(base.sourceHeight||1)/(s.sourceHeight||1),headOffset=s.directional?0:((walk.headX||walk.anchorX)-walk.anchorX)*baseScale-((f.headX||f.anchorX)-f.anchorX)*scale;
 s.used=++w.clock;ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y+21.6));if(s.directional?direction.flip:this.heading(p)<0)ctx.scale(-1,1);ctx.imageSmoothingEnabled=false;ctx.drawImage(s.image,f.sx,f.sy,f.w,f.h,(f.localX-f.anchorX)*scale+headOffset,(f.localY-f.anchorY)*scale,f.w*scale,f.h*scale);ctx.restore();return true}
};
