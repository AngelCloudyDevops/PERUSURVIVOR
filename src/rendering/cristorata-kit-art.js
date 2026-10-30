'use strict';
// Spectral effects around existing whole-body walk/attack atlases; no new mount.
P.CristorataKitArt={
 ground(c){const s=P.state;for(const p of [s.player,...(P.Coop?.peers||[])])for(const q of p?.cristoTrails||[]){if(q.until<=s.elapsed)continue;c.save();c.globalAlpha=Math.min(.35,(q.until-s.elapsed)*.5);c.fillStyle='#73e8e8';c.fillRect(Math.round(q.x-q.r),Math.round(q.y-8),q.r*2,16);c.fillStyle='#defafa';c.fillRect(Math.round(q.x-12),Math.round(q.y-3),24,4);c.restore()}const d=s.cristorataDomain;if(!d)return;c.save();c.strokeStyle='#509dba';c.lineWidth=3;c.setLineDash?.([18,12]);c.beginPath();c.arc(d.x,d.y,d.r,0,Math.PI*2);c.stroke();c.setLineDash?.([]);for(const q of d.seals){const ready=s.elapsed>=q.ready,flash=s.elapsed<q.flash;c.strokeStyle=flash?'#fff3b2':ready?'#99f5ee':'#4f647b';c.fillStyle=ready?'#367f8b44':'#1d253e55';c.beginPath();c.ellipse(q.x,q.y,34,22,0,0,7);c.fill();c.stroke();for(let i=0;i<3;i++){const x=q.x+(i-1)*11;c.beginPath();c.moveTo(x-4,q.y-9);c.lineTo(x+4,q.y);c.lineTo(x-4,q.y+9);c.stroke()}}c.restore()}
};
{
 const ground=P.DomainAftermath.draw,effect=P.FX.effect,projectile=P.FX.projectile,actor=P.Sprites.actor;
 P.DomainAftermath.draw=function(c,...args){const value=ground.call(this,c,...args);P.CristorataKitArt.ground(c);return value};
 P.FX.effect=function(c,e,...args){if(e.kind!=='cristo-claw')return effect.call(this,c,e,...args);const t=1-e.life/e.maxLife;c.save();c.translate(e.x,e.y);c.rotate(e.angle);c.globalAlpha=1-t;c.strokeStyle=e.second?'#defaff':'#81d9ee';c.lineWidth=4;for(let i=-1;i<=1;i++){c.beginPath();const x=e.r*.5+i*15;c.moveTo(x-30,-e.r*.4);c.quadraticCurveTo(x+40,0,x-20,e.r*.4);c.stroke()}c.restore()};
 P.FX.projectile=function(c,q,...args){if(q.glyph!=='CRISTO_SEAL')return projectile.call(this,c,q,...args);c.save();c.translate(q.x,q.y);c.rotate(q.angle);c.fillStyle='#7ae7e6';c.fillRect(-17,-5,29,10);c.fillStyle='#f0ffec';c.fillRect(-6,-2,21,4);c.restore()};
 P.Sprites.actor=function(c,p,...args){if(!P.CristorataKit.dashing(p)||P.PlayerFeedback.pose(p))return actor.call(this,c,p,...args);c.save();c.translate(p.x,p.y);if(!P.Ambient?.reduced?.matches)c.rotate((p.facing||1)*.12);const value=actor.call(this,c,{...p,x:0,y:0,moving:true,castUntil:0},...args);c.restore();return value}
}
