'use strict';
P.ChamelinPrimeArt={
 player(ctx,p){
  const t=P.state.elapsed||0,walk=p.moving?Math.sin((p.walkPhase||0)*1.15):0,deploy=(p.primeDeployUntil||0)>t,flip=(p.facing||1)<0;
  ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y+18));if(flip)ctx.scale(-1,1);ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle='#17141d';ctx.lineWidth=3;
  ctx.fillStyle='#11192955';ctx.beginPath();ctx.ellipse(0,3,22,6,0,0,Math.PI*2);ctx.fill();
  const bob=p.moving?-Math.abs(Math.cos(p.walkPhase||0))*2:Math.sin(t*3)*.7;ctx.translate(0,bob);if(deploy){ctx.rotate(-.12);ctx.translate(-3,4)}
  // Legs and white sneakers.
  ctx.fillStyle='#d89a67';for(const side of [-1,1]){ctx.beginPath();ctx.roundRect(side*4-5+(p.moving?walk*side*3:0),-16,10,17,5);ctx.fill();ctx.stroke()}
  ctx.fillStyle='#f7f8ff';for(const side of [-1,1]){ctx.beginPath();ctx.roundRect(side*8-8+(p.moving?walk*side*4:0),-4,17,7,4);ctx.fill();ctx.stroke();ctx.strokeStyle='#8ca0bc';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(side*8-5,-1);ctx.lineTo(side*8+5,-1);ctx.stroke();ctx.strokeStyle='#17141d';ctx.lineWidth=3}
  // Torso and unmistakable white briefs with blue waistband.
  ctx.fillStyle='#d89a67';ctx.beginPath();ctx.ellipse(0,-27,18,20,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#f9fbff';ctx.beginPath();ctx.moveTo(-16,-24);ctx.lineTo(16,-24);ctx.lineTo(12,-12);ctx.quadraticCurveTo(0,-8,-12,-12);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle='#4f84bb';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-15,-22);ctx.lineTo(15,-22);ctx.stroke();
  // Arms.
  ctx.strokeStyle='#17141d';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(-13,-37);ctx.lineTo(-22+(deploy?-2:walk*2),-22+(deploy?6:0));ctx.moveTo(13,-37);ctx.lineTo(21+(deploy?2:-walk*2),-24+(deploy?5:0));ctx.stroke();ctx.strokeStyle='#d89a67';ctx.lineWidth=5;ctx.stroke();
  // Head.
  ctx.fillStyle='#d89a67';ctx.strokeStyle='#17141d';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-55,17,16,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#17141d';ctx.beginPath();ctx.arc(-4,-61,13,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(6,-55,4,3,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#17141d';ctx.beginPath();ctx.arc(7,-55,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(2,-48,5,.15,Math.PI-.15);ctx.stroke();
  // Andean chullo.
  ctx.fillStyle='#e43837';ctx.beginPath();ctx.moveTo(-17,-65);ctx.quadraticCurveTo(0,-81,17,-65);ctx.lineTo(14,-58);ctx.lineTo(-14,-58);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#24a869';ctx.fillRect(-15,-66,30,4);ctx.fillStyle='#f4cc45';for(let x=-11;x<=11;x+=7)ctx.fillRect(x,-65,3,3);ctx.fillStyle='#df2d39';ctx.beginPath();ctx.arc(0,-76,5,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.restore();return true
 },
 ground(ctx){
  const p=P.state.player;if(!P.ChamelinPrime?.eligible(p))return;const q=P.ChamelinPrime.state(p),now=P.state.elapsed||0;ctx.save();
  // Link circles with broad strokes so overlapping bases read as one territory.
  ctx.globalAlpha=.16;ctx.strokeStyle='#b87334';ctx.lineWidth=84;for(let i=0;i<q.turrets.length;i++)for(let j=i+1;j<q.turrets.length;j++)if(P.ChamelinPrime.connected(q.turrets[i],q.turrets[j])){ctx.beginPath();ctx.moveTo(q.turrets[i].x,q.turrets[i].y);ctx.lineTo(q.turrets[j].x,q.turrets[j].y);ctx.stroke()}
  for(const t of q.turrets){const pulse=1+Math.sin(now*2+t.id)*.025,g=ctx.createRadialGradient(t.x,t.y,12,t.x,t.y,t.radius*pulse);g.addColorStop(0,'#c98a4655');g.addColorStop(.72,'#a9683033');g.addColorStop(1,'#7e421000');ctx.fillStyle=g;ctx.beginPath();ctx.arc(t.x,t.y,t.radius*pulse,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.55;ctx.strokeStyle=t.links?'#f1c35d':'#b8793f';ctx.lineWidth=2;ctx.setLineDash([8,9]);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=.16}
  ctx.globalAlpha=.48;for(const v of q.puddles){ctx.fillStyle='#8a512f';ctx.beginPath();for(let i=0;i<12;i++){const a=i*Math.PI/6,r=v.r*(i%2?.82:1);const x=v.x+Math.cos(a)*r,y=v.y+Math.sin(a)*r;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y)}ctx.closePath();ctx.fill()}
  ctx.restore()
 },
 turret(ctx,t){
  ctx.save();ctx.translate(t.x,t.y);const recoil=(t.recoil||0)>0?Math.sin(t.recoil*30)*3:0;ctx.fillStyle='#17141d55';ctx.beginPath();ctx.ellipse(0,8,22,7,0,0,Math.PI*2);ctx.fill();ctx.translate(-recoil,0);ctx.strokeStyle='#21150e';ctx.lineWidth=3;ctx.fillStyle='#8e542e';ctx.beginPath();ctx.moveTo(-20,7);ctx.quadraticCurveTo(-18,-11,-7,-10);ctx.quadraticCurveTo(-2,-25,5,-11);ctx.quadraticCurveTo(20,-10,20,7);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#59aa3c';ctx.beginPath();ctx.ellipse(-10,-12,7,4,-.5,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.strokeStyle='#7c4928';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(4,-11);ctx.quadraticCurveTo(5,-30,18,-28);ctx.stroke();ctx.strokeStyle='#d79b59';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(-6,-2,4,5,0,0,Math.PI*2);ctx.ellipse(7,-2,4,5,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#1e1713';ctx.beginPath();ctx.arc(-5,-1,2,0,Math.PI*2);ctx.arc(6,-1,2,0,Math.PI*2);ctx.fill();
  if(t.maxShield>0){ctx.strokeStyle='#8ee8ff';ctx.globalAlpha=.5+.2*Math.sin((P.state.elapsed||0)*4+t.id);ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-5,29,0,Math.PI*2);ctx.stroke()}
  ctx.globalAlpha=1;ctx.fillStyle='#182137';ctx.fillRect(-20,14,40,4);ctx.fillStyle=t.hp/t.maxHp<.35?'#ef6a62':'#7ddf82';ctx.fillRect(-20,14,40*Math.max(0,t.hp/t.maxHp),4);ctx.restore()
 },
 foreground(ctx){const p=P.state.player;if(!P.ChamelinPrime?.eligible(p))return;const q=P.ChamelinPrime.state(p);for(const t of q.turrets)this.turret(ctx,t);for(const s of q.shots){ctx.save();ctx.translate(s.x,s.y);ctx.rotate(Math.atan2(s.vy,s.vx));ctx.fillStyle='#e9b74f';ctx.strokeStyle='#6e451d';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,8,4,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.strokeStyle='#f7db75';ctx.beginPath();ctx.moveTo(-3,-2);ctx.lineTo(3,2);ctx.stroke();ctx.restore()}},
 install(){const actor=P.Sprites.actor,draw=P.Sprites.draw,zones=P.DynamicZones?.draw,front=P.Minibosses.foreground;if(actor)P.Sprites.actor=function(ctx,p,...args){if(P.ChamelinPrime?.eligible(p))return P.ChamelinPrimeArt.player(ctx,p);return actor.call(this,ctx,p,...args)};if(draw)P.Sprites.draw=function(ctx,x,y,r,p,...args){if(P.ChamelinPrime?.eligible(p)){ctx.save();ctx.globalAlpha=0;draw.call(this,ctx,x,y,r,p,...args);ctx.restore();ctx.save();ctx.translate(x,y);const scale=r/27;ctx.scale(scale,scale);P.ChamelinPrimeArt.player(ctx,{...p,x:0,y:-18});ctx.restore();return true}return draw.call(this,ctx,x,y,r,p,...args)};if(zones)P.DynamicZones.draw=function(ctx,...args){P.ChamelinPrimeArt.ground(ctx);return zones.call(this,ctx,...args)};if(front)P.Minibosses.foreground=function(ctx,...args){const value=front.call(this,ctx,...args);P.ChamelinPrimeArt.foreground(ctx);return value}}
};
P.ChamelinPrimeArt.install();
