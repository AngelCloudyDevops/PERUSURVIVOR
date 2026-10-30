'use strict';
// Authored whole-body reactions replace generic rotation without changing hit timing or collision.
P.PlayerReactionArt={
 ids:new Set(['kingteka']),
 sheetId(p){const visual=P.CharacterSkins?.artId(p)||p?.id;return this.ids.has(visual)?'reaction-'+visual:null},
 frame(pose){return pose.dead?3+Math.min(2,Math.floor(pose.t*3)):Math.min(2,Math.floor(pose.t*3))},
 draw(ctx,p,pose){const id=this.sheetId(p);if(!id)return false;const w=P.WalkArt,s=w?.sheets[id];if(!s?.ready){w?.load(id,true);return false}const f=s.frames[this.frame(pose)];if(!f)return false;s.used=++w.clock;const scale=67.5/s.height,flip=(pose.dead?p.deathFacing:p.facing)<0;ctx.save();ctx.translate(Math.round(p.x+pose.x),Math.round(p.y+21.6+pose.y));if(flip)ctx.scale(-1,1);ctx.imageSmoothingEnabled=false;ctx.drawImage(s.image,f.sx,f.sy,f.w,f.h,(f.localX-f.anchorX)*scale,(f.localY-f.anchorY)*scale,f.w*scale,f.h*scale);ctx.restore();return true}
};
