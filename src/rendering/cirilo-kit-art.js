'use strict';
P.CiriloKitArt={
 taxi(ctx,p){const t=p.ciriloTaxi;if(!t)return false;const reverse=t.phase==='back',reduced=P.Ambient?.reduced?.matches,rumble=reduced?0:t.phase==='windup'?Math.sin(t.age*45):Math.sin(t.wheel*.25)*.55;ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y));ctx.fillStyle='#0a172b55';ctx.beginPath();ctx.ellipse(0,16,39,16,0,0,Math.PI*2);ctx.fill();ctx.rotate(t.angle);ctx.translate(0,rumble);ctx.imageSmoothingEnabled=false;
  const rect=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h)};
  // Complete top-down silhouette, with all wheels and windows attached to the body.
  for(const x of [-22,19])for(const y of [-20,15]){rect(x-5,y,12,6,'#111b27');rect(x-3,y+1,8,2,Math.floor(t.wheel/5)%2?'#75818b':'#394753')}
  rect(-37,-14,72,29,'#17212b');rect(-34,-17,64,35,'#17212b');rect(-32,-14,61,29,'#d18e24');rect(-29,-12,56,24,'#f0bd43');rect(27,-10,7,20,'#f8d775');rect(32,-9,3,18,'#ced2ba');
  rect(-17,-14,29,28,'#76552f');rect(-15,-12,25,24,'#1a3544');rect(6,-11,6,22,'#a0dce1');rect(-14,-10,16,20,p.ciriloDemon?'#913847':'#497b87');rect(-8,-7,12,14,'#e7bd42');rect(-8,-8,12,3,'#faf0b5');
  // Driver remains inside the cabin; demon detail changes color, not the transformation state.
  rect(-12,-5,6,10,p.ciriloDemon?'#b74a3c':'#bd8a68');rect(-14,-6,8,3,p.ciriloDemon?'#3c1b2b':'#354951');rect(-9,-3,2,2,'#fff0b0');if(p.ciriloDemon){rect(-14,-8,2,4,'#f3ca8b');rect(-14,5,2,4,'#f3ca8b')}
  rect(-27,-10,9,20,'#d8a437');rect(-25,-8,5,16,'#e8b847');rect(-34,-11,3,6,reverse?'#fff9d4':'#cf4543');rect(-34,6,3,6,reverse?'#fff9d4':'#cf4543');rect(28,-12,5,5,'#fff4ad');rect(28,8,5,5,'#fff4ad');
  ctx.strokeStyle='#7dbcd9';ctx.lineWidth=2;ctx.globalAlpha=.65;ctx.beginPath();ctx.ellipse(0,0,43,24,0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
  if(!reduced&&t.phase!=='windup'){rect(-44,-12,5,4,'#b8ad9477');rect(-49,6,7,5,'#b8ad9455');if(reverse){rect(-46,-7,8,2,'#fff0ad');rect(-46,6,8,2,'#fff0ad')}}ctx.restore();return true
 },
 marks(ctx){for(const p of [P.state.player,...(P.Coop?.peers||[])])for(const m of p?.ciriloMarks||[]){const left=Math.max(0,m.at-(P.state.elapsed||0)),r=10+(1-Math.min(1,left/.75))*12;ctx.save();ctx.translate(m.x,m.y-22);ctx.strokeStyle=m.demon?'#ff9552':'#a4ed6e';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();ctx.fillStyle=m.demon?'#f8ca79':'#d4ff9c';ctx.fillRect(-2,-7,4,9);ctx.fillRect(-2,5,4,3);ctx.restore()}},
 projectile(ctx,q){ctx.save();ctx.translate(q.x,q.y);ctx.rotate(q.angle||Math.atan2(q.vy,q.vx));ctx.fillStyle=q.color||'#a4ed6e';if(q.glyph==='CIRILO_ECHO'){ctx.lineWidth=3;ctx.strokeStyle=q.color;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(-i*6,0,6+i*2,-.9,.9);ctx.stroke()}}else{const pulse=P.Ambient?.reduced?.matches?0:Math.floor((q.age||0)*18)%3;ctx.fillRect(-18,-5,30+pulse*2,10);ctx.fillStyle='#fff1b4';ctx.fillRect(-7,-2,24,4);ctx.fillStyle=q.glyph==='CIRILO_Q_FIRE'?'#b54838':'#347c50';ctx.fillRect(-23,-8,9,5);ctx.fillRect(-20,5,12,4)}ctx.restore()}
};
{
 const actor=P.Sprites.actor,draw=P.Ultimate.draw,projectile=P.FX.projectile,effect=P.FX.effect;
 P.Sprites.actor=function(ctx,p,...args){if(P.CiriloKit.taxiActive(p))return P.CiriloKitArt.taxi(ctx,p);return actor.call(this,ctx,p,...args)};
 P.Ultimate.draw=function(ctx,...args){const value=draw.call(this,ctx,...args);P.CiriloKitArt.marks(ctx);return value};
 P.FX.projectile=function(ctx,q,...args){if(['CIRILO_ECHO','CIRILO_Q_FIRE','CIRILO_Q_TOXIN'].includes(q.glyph))return P.CiriloKitArt.projectile(ctx,q);return projectile.call(this,ctx,q,...args)};
 P.FX.effect=function(ctx,e,...args){if(e.kind!=='cirilo-echo-burst')return effect.call(this,ctx,e,...args);ctx.save();ctx.globalAlpha=Math.max(0,e.life/e.maxLife)*.6;ctx.strokeStyle=e.color;ctx.fillStyle=e.color;ctx.lineWidth=4;ctx.beginPath();ctx.arc(e.x,e.y,e.r*(1-e.life/e.maxLife*.7),0,Math.PI*2);ctx.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4,r=e.r*(1-e.life/e.maxLife);ctx.fillRect(e.x+Math.cos(a)*r-3,e.y+Math.sin(a)*r-3,6,6)}ctx.restore()}
}
