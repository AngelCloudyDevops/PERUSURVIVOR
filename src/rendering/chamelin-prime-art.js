'use strict';
P.ChamelinPrimeArt={
 sheets:{
  player:{src:'assets/characters/chamelin-prime-motion-v1.webp',cells:[]},
  turret:{src:'assets/characters/chamelin-prime-turret-v2.webp',cells:[]},
  pressure:{src:'assets/characters/chamelin-prime-pressure-v1.webp',cells:[]},
  spit:{src:'assets/characters/chamelin-prime-spit-v1.webp',cells:[]},
  reactions:{src:'assets/characters/chamelin-prime-ultimate-reactions-v1.webp',cells:[]}
 },
 loadSheet(sheet){
  if(sheet.image||typeof Image==='undefined')return;
  const image=sheet.image=new Image();image.decoding='async';
  image.onload=()=>{const cv=document.createElement('canvas');cv.width=image.naturalWidth;cv.height=image.naturalHeight;const c=cv.getContext('2d');c.drawImage(image,0,0);const raster=c.getImageData(0,0,cv.width,cv.height),cellWidth=cv.width/6;sheet.cells=Array.from({length:6},(_,index)=>P.Sprites.bounds(raster.data,cv.width,Math.round(index*cellWidth),0,Math.round(cellWidth),cv.height));sheet.ready=true};
  image.onerror=()=>{sheet.failed=true};image.src=sheet.src
 },
 load(){Object.values(this.sheets).forEach(sheet=>this.loadSheet(sheet))},
 sprite(ctx,sheet,index,x,y,height,flip=false){
  this.loadSheet(sheet);const frame=sheet.cells?.[index];if(!sheet.ready||!frame)return false;
  const width=height*frame.w/frame.h;ctx.save();ctx.translate(Math.round(x),Math.round(y));if(flip)ctx.scale(-1,1);ctx.imageSmoothingEnabled=true;ctx.drawImage(sheet.image,frame.sx,frame.sy,frame.w,frame.h,Math.round(-width/2),-Math.round(height),Math.round(width),Math.round(height));ctx.restore();return true
 },
 playerFrame(p,now){
  const deployLeft=(p.primeDeployUntil||0)-now;
  if(deployLeft>0)return deployLeft>.36?3:deployLeft>.16?4:5;
  if(p.moving)return Math.sin(p.walkPhase||0)<0?1:2;
  return 0
 },
 playerPose(p,now){
  if((p.primeDefeatUntil||0)>now)return [this.sheets.reactions,4,108];
  if((p.primeHurtUntil||0)>now)return [this.sheets.reactions,3,108];
  if((p.primeHealUntil||0)>now)return [this.sheets.reactions,5,108];
  if((p.primeUltimateUntil||0)>now){const left=p.primeUltimateUntil-now;return [this.sheets.reactions,left>4.15?0:left>.75?2:1,116]}
  if((p.primeExhaustedUntil||0)>now)return [this.sheets.pressure,4,108];
  if((p.primePressureUntil||0)>now){const ratio=p.primePressureRatio||0;return [this.sheets.pressure,ratio>.68?1:ratio>.3?2:3,110]}
  if((p.primeSpitReleaseUntil||0)>now)return [this.sheets.spit,3,110];
  const q=P.state.chamelinPrime;if(q?.spitArmed){const ratio=q.spitCharge/100;return [this.sheets.spit,ratio>.66?1:0,108]}
  if((p.primeTransitionUntil||0)>now)return [this.sheets.reactions,0,108];
  return [this.sheets.player,this.playerFrame(p,now),102]
 },
 player(ctx,p){
  const now=P.state.elapsed||0,[sheet,frame,height]=this.playerPose(p,now),flip=(p.facing||1)<0,deploy=Math.max(0,(p.primeDeployUntil||0)-now),step=p.moving?Math.abs(Math.sin(p.walkPhase||0)):0,bob=p.moving?-step*2:Math.sin(now*2.5)*.45;
  ctx.save();ctx.fillStyle='#11192955';ctx.beginPath();ctx.ellipse(Math.round(p.x),Math.round(p.y+19),24,7,0,0,Math.PI*2);ctx.fill();ctx.restore();
  ctx.save();if(deploy>0){const kick=Math.sin(Math.min(1,deploy/.55)*Math.PI);ctx.translate((flip?-1:1)*kick*2,kick*1.5);ctx.rotate((flip?-1:1)*kick*.045)}this.sprite(ctx,sheet,frame,p.x,p.y+20+bob,height,flip);ctx.restore();return true
 },
 ground(ctx){
  const p=P.state.player;if(!P.ChamelinPrime?.eligible(p))return;const q=P.ChamelinPrime.state(p),now=P.state.elapsed||0;ctx.save();
  ctx.globalAlpha=.16;ctx.strokeStyle='#b87334';ctx.lineWidth=84;for(let i=0;i<q.turrets.length;i++)for(let j=i+1;j<q.turrets.length;j++)if(P.ChamelinPrime.connected(q.turrets[i],q.turrets[j])){ctx.beginPath();ctx.moveTo(q.turrets[i].x,q.turrets[i].y);ctx.lineTo(q.turrets[j].x,q.turrets[j].y);ctx.stroke()}
  for(const t of q.turrets){const pulse=1+Math.sin(now*2+t.id)*.025,g=ctx.createRadialGradient(t.x,t.y,12,t.x,t.y,t.radius*pulse);g.addColorStop(0,'#c98a4638');g.addColorStop(.72,'#a9683026');g.addColorStop(1,'#7e421000');ctx.fillStyle=g;ctx.beginPath();ctx.arc(t.x,t.y,t.radius*pulse,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.48;ctx.strokeStyle=t.links?'#f1c35d':'#b8793f';ctx.lineWidth=2;ctx.setLineDash([8,9]);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=.16}
  ctx.restore();for(const puddle of q.puddles)this.sprite(ctx,this.sheets.turret,5,puddle.x,puddle.y+15,42,false);
  for(const z of q.spitZones||[]){ctx.save();ctx.globalAlpha=.18+.08*Math.sin(now*5);ctx.fillStyle='#82e9df';ctx.strokeStyle='#d9ffff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(z.x,z.y,z.r,z.r*.52,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore()}
 },
 turretFrame(t){if((t.shieldFlash||0)>0)return 3;if((t.recoil||0)>.13)return 2;if((t.recoil||0)>0)return 1;if(t.hp/t.maxHp<.35)return 4;return 0},
 turret(ctx,t){
  const now=P.state.elapsed||0,frame=this.turretFrame(t),phase=now*3.1+t.id*1.73,flip=Math.cos(t.aim||0)<0,bob=Math.sin(phase)*1.5,squash=1+Math.sin(phase*2)*.018,recoil=(t.recoil||0)/.22,tilt=Math.sin(phase*.7)*.025+(flip?-1:1)*recoil*.09;ctx.save();ctx.fillStyle='#17141d55';ctx.beginPath();ctx.ellipse(t.x,t.y+9,23-recoil*2,7,0,0,Math.PI*2);ctx.fill();ctx.restore();ctx.save();ctx.translate(t.x,t.y+12+bob);ctx.rotate(tilt);ctx.scale(1/squash,squash);this.sprite(ctx,this.sheets.turret,frame,0,0,62,flip);ctx.restore();
  if(recoil>.38){const angle=t.aim||0,x=t.x+Math.cos(angle)*27,y=t.y-19+bob+Math.sin(angle)*8;ctx.save();ctx.globalAlpha=Math.min(1,recoil);ctx.fillStyle='#ffd75c';ctx.shadowColor='#ff8b31';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(x,y,4+recoil*3,0,Math.PI*2);ctx.fill();ctx.restore()}
  ctx.save();ctx.fillStyle='#182137';ctx.fillRect(t.x-21,t.y+15,42,4);ctx.fillStyle=t.hp/t.maxHp<.35?'#ef6a62':'#7ddf82';ctx.fillRect(t.x-21,t.y+15,42*Math.max(0,t.hp/t.maxHp),4);ctx.restore()
 },
 shot(ctx,s){ctx.save();ctx.translate(s.x,s.y);ctx.rotate(Math.atan2(s.vy,s.vx));ctx.fillStyle='#e9b74f';ctx.strokeStyle='#6e451d';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,9,5,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.strokeStyle='#f7db75';ctx.beginPath();ctx.moveTo(-4,-2);ctx.lineTo(4,2);ctx.stroke();ctx.restore()},
 spitOrb(ctx,o){ctx.save();const g=ctx.createRadialGradient(o.x-6,o.y-7,2,o.x,o.y,o.r);g.addColorStop(0,'#ffffff');g.addColorStop(.35,'#bafcff');g.addColorStop(1,'#45aeba88');ctx.fillStyle=g;ctx.shadowColor='#9df8ff';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(o.x,o.y,o.r,0,Math.PI*2);ctx.fill();ctx.restore()},
 blackHole(ctx,h){const now=P.state.elapsed||0;ctx.save();ctx.translate(h.x,h.y);ctx.globalCompositeOperation='lighter';for(let i=0;i<5;i++){ctx.rotate(now*(.7+i*.13));ctx.strokeStyle=`rgba(${130+i*22},${55+i*8},255,${.3+i*.08})`;ctx.lineWidth=4+i;ctx.beginPath();ctx.ellipse(0,0,h.r*(.2+i*.13),h.r*(.08+i*.055),i*.42,0,Math.PI*2);ctx.stroke()}const g=ctx.createRadialGradient(0,0,2,0,0,38);g.addColorStop(0,'#000');g.addColorStop(.55,'#21002f');g.addColorStop(1,'#a040ff00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,48+Math.sin(now*8)*5,0,Math.PI*2);ctx.fill();ctx.restore()},
 effect(ctx,e){const alpha=Math.max(0,Math.min(1,e.life/(e.maxLife||1)));if(e.kind==='prime-pressure'){const c=Math.cos(e.angle),s=Math.sin(e.angle),endX=e.x+c*e.range,endY=e.y+s*e.range,gradient=ctx.createLinearGradient(e.x,e.y,endX,endY);gradient.addColorStop(0,'#fffbd8');gradient.addColorStop(.2,'#ffe65b');gradient.addColorStop(1,'#d6a90000');ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=gradient;ctx.shadowColor='#fff06a';ctx.shadowBlur=14;ctx.lineCap='round';ctx.lineWidth=e.width;ctx.beginPath();ctx.moveTo(e.x+c*18,e.y+s*18);ctx.quadraticCurveTo((e.x+endX)/2-s*10,(e.y+endY)/2+c*10,endX,endY);ctx.stroke();ctx.globalAlpha=alpha*.9;ctx.strokeStyle='#fff';ctx.lineWidth=Math.max(3,e.width*.16);ctx.stroke();for(let i=0;i<7;i++){const t=(i+1)/8,j=Math.sin((P.state.elapsed||0)*17+i*2.3)*e.width*.35;ctx.fillStyle='#ffe35c';ctx.beginPath();ctx.arc(e.x+c*e.range*t-s*j,e.y+s*e.range*t+c*j,2+i%3,0,Math.PI*2);ctx.fill()}ctx.restore();return}if(e.kind==='prime-spit-impact'||e.kind==='prime-black-hole-finale'){const t=1-alpha,r=e.r*(.25+.78*t);ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=e.kind==='prime-spit-impact'?'#c9ffff':'#f2a0ff';ctx.fillStyle=e.kind==='prime-spit-impact'?'#65dcd844':'#8b27d733';ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=18;ctx.lineWidth=5+8*alpha;ctx.beginPath();ctx.ellipse(e.x,e.y,r,r*(e.kind==='prime-spit-impact'?.52:1),0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore()}},
 foreground(ctx){const p=P.state.player;if(!P.ChamelinPrime?.eligible(p))return;const q=P.ChamelinPrime.state(p);for(const e of P.state.effects||[])if(e.kind==='prime-pressure'||e.kind==='prime-spit-impact'||e.kind==='prime-black-hole-finale')this.effect(ctx,e);for(const t of q.turrets)this.turret(ctx,t);for(const s of q.shots)this.shot(ctx,s);for(const o of q.spitOrbs)this.spitOrb(ctx,o);if(q.blackHole)this.blackHole(ctx,q.blackHole)},
 install(){
  this.load();const actor=P.Sprites.actor,draw=P.Sprites.draw,zones=P.DynamicZones?.draw,front=P.Minibosses.foreground;
  if(actor)P.Sprites.actor=function(ctx,p,...args){if(P.ChamelinPrime?.eligible(p))return P.ChamelinPrimeArt.player(ctx,p);return actor.call(this,ctx,p,...args)};
  if(draw)P.Sprites.draw=function(ctx,x,y,r,p,...args){if(P.ChamelinPrime?.eligible(p)){ctx.save();ctx.globalAlpha=0;draw.call(this,ctx,x,y,r,p,...args);ctx.restore();return P.ChamelinPrimeArt.player(ctx,{...p,x,y:y-18})}return draw.call(this,ctx,x,y,r,p,...args)};
  if(zones)P.DynamicZones.draw=function(ctx,...args){P.ChamelinPrimeArt.ground(ctx);return zones.call(this,ctx,...args)};
  if(front)P.Minibosses.foreground=function(ctx,...args){const value=front.call(this,ctx,...args);P.ChamelinPrimeArt.foreground(ctx);return value}
 }
};
P.ChamelinPrimeArt.install();
