'use strict';
P.ChamelinPrimeArt={
 sheets:{
  player:{src:'assets/characters/chamelin-prime-motion-v1.webp',cells:[]},
  turret:{src:'assets/characters/chamelin-prime-turret-v1.webp',cells:[]}
 },
 loadSheet(sheet){
  if(sheet.image||typeof Image==='undefined')return;
  const image=sheet.image=new Image();image.decoding='async';
  image.onload=()=>{const cv=document.createElement('canvas');cv.width=image.naturalWidth;cv.height=image.naturalHeight;const c=cv.getContext('2d');c.drawImage(image,0,0);const raster=c.getImageData(0,0,cv.width,cv.height),cellWidth=cv.width/6;sheet.cells=Array.from({length:6},(_,index)=>P.Sprites.bounds(raster.data,cv.width,Math.round(index*cellWidth),0,Math.round(cellWidth),cv.height));sheet.ready=true};
  image.onerror=()=>{sheet.failed=true};image.src=sheet.src
 },
 load(){this.loadSheet(this.sheets.player);this.loadSheet(this.sheets.turret)},
 sprite(ctx,sheet,index,x,y,height,flip=false){
  this.loadSheet(sheet);const frame=sheet.cells?.[index];if(!sheet.ready||!frame)return false;
  const width=height*frame.w/frame.h;ctx.save();ctx.translate(Math.round(x),Math.round(y));if(flip)ctx.scale(-1,1);ctx.imageSmoothingEnabled=true;ctx.drawImage(sheet.image,frame.sx,frame.sy,frame.w,frame.h,Math.round(-width/2),-Math.round(height),Math.round(width),Math.round(height));ctx.restore();return true
 },
 playerFrame(p,now){
  const deployLeft=(p.primeDeployUntil||0)-now;
  if(deployLeft>0)return deployLeft>.36?3:deployLeft>.16?4:5;
  if(p.moving)return Math.floor((p.walkPhase||0)*2.4)%2?1:2;
  return 0
 },
 player(ctx,p){
  const now=P.state.elapsed||0,frame=this.playerFrame(p,now),flip=(p.facing||1)<0;
  ctx.save();ctx.fillStyle='#11192955';ctx.beginPath();ctx.ellipse(Math.round(p.x),Math.round(p.y+19),24,7,0,0,Math.PI*2);ctx.fill();ctx.restore();
  this.sprite(ctx,this.sheets.player,frame,p.x,p.y+20,frame===4?106:102,flip);return true
 },
 ground(ctx){
  const p=P.state.player;if(!P.ChamelinPrime?.eligible(p))return;const q=P.ChamelinPrime.state(p),now=P.state.elapsed||0;ctx.save();
  ctx.globalAlpha=.16;ctx.strokeStyle='#b87334';ctx.lineWidth=84;for(let i=0;i<q.turrets.length;i++)for(let j=i+1;j<q.turrets.length;j++)if(P.ChamelinPrime.connected(q.turrets[i],q.turrets[j])){ctx.beginPath();ctx.moveTo(q.turrets[i].x,q.turrets[i].y);ctx.lineTo(q.turrets[j].x,q.turrets[j].y);ctx.stroke()}
  for(const t of q.turrets){const pulse=1+Math.sin(now*2+t.id)*.025,g=ctx.createRadialGradient(t.x,t.y,12,t.x,t.y,t.radius*pulse);g.addColorStop(0,'#c98a4638');g.addColorStop(.72,'#a9683026');g.addColorStop(1,'#7e421000');ctx.fillStyle=g;ctx.beginPath();ctx.arc(t.x,t.y,t.radius*pulse,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.48;ctx.strokeStyle=t.links?'#f1c35d':'#b8793f';ctx.lineWidth=2;ctx.setLineDash([8,9]);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=.16}
  ctx.restore();for(const puddle of q.puddles)this.sprite(ctx,this.sheets.turret,5,puddle.x,puddle.y+15,42,false)
 },
 turretFrame(t){if(t.hp/t.maxHp<.35)return 4;if((t.shield||0)>0)return 3;if((t.recoil||0)>.08)return 2;if((t.recoil||0)>0)return 1;return 0},
 turret(ctx,t){
  const frame=this.turretFrame(t);ctx.save();ctx.fillStyle='#17141d55';ctx.beginPath();ctx.ellipse(t.x,t.y+9,23,7,0,0,Math.PI*2);ctx.fill();ctx.restore();this.sprite(ctx,this.sheets.turret,frame,t.x,t.y+12,62,false);
  ctx.save();ctx.fillStyle='#182137';ctx.fillRect(t.x-21,t.y+15,42,4);ctx.fillStyle=t.hp/t.maxHp<.35?'#ef6a62':'#7ddf82';ctx.fillRect(t.x-21,t.y+15,42*Math.max(0,t.hp/t.maxHp),4);ctx.restore()
 },
 shot(ctx,s){ctx.save();ctx.translate(s.x,s.y);ctx.rotate(Math.atan2(s.vy,s.vx));ctx.fillStyle='#e9b74f';ctx.strokeStyle='#6e451d';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,9,5,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.strokeStyle='#f7db75';ctx.beginPath();ctx.moveTo(-4,-2);ctx.lineTo(4,2);ctx.stroke();ctx.restore()},
 foreground(ctx){const p=P.state.player;if(!P.ChamelinPrime?.eligible(p))return;const q=P.ChamelinPrime.state(p);for(const t of q.turrets)this.turret(ctx,t);for(const s of q.shots)this.shot(ctx,s)},
 install(){
  this.load();const actor=P.Sprites.actor,draw=P.Sprites.draw,zones=P.DynamicZones?.draw,front=P.Minibosses.foreground;
  if(actor)P.Sprites.actor=function(ctx,p,...args){if(P.ChamelinPrime?.eligible(p))return P.ChamelinPrimeArt.player(ctx,p);return actor.call(this,ctx,p,...args)};
  if(draw)P.Sprites.draw=function(ctx,x,y,r,p,...args){if(P.ChamelinPrime?.eligible(p)){ctx.save();ctx.globalAlpha=0;draw.call(this,ctx,x,y,r,p,...args);ctx.restore();return P.ChamelinPrimeArt.player(ctx,{...p,x,y:y-18})}return draw.call(this,ctx,x,y,r,p,...args)};
  if(zones)P.DynamicZones.draw=function(ctx,...args){P.ChamelinPrimeArt.ground(ctx);return zones.call(this,ctx,...args)};
  if(front)P.Minibosses.foreground=function(ctx,...args){const value=front.call(this,ctx,...args);P.ChamelinPrimeArt.foreground(ctx);return value}
 }
};
P.ChamelinPrimeArt.install();
