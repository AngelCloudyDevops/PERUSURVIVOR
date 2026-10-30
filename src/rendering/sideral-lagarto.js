'use strict';
// Figuras completas en pixel art: el paso mueve extremidades unidas al cuerpo.
P.SideralLagarto={
 ready:false,failed:false,image:null,cells:[],
 load(){if(this.ready||this.image||typeof Image==='undefined')return;const image=this.image=new Image();image.onload=()=>{try{const cv=document.createElement('canvas');cv.width=image.width;cv.height=image.height;const c=cv.getContext('2d');c.drawImage(image,0,0);const pixels=c.getImageData(0,0,cv.width,cv.height).data;this.cells=Array.from({length:8},(_,i)=>{const col=i%4,row=Math.floor(i/4),sx=Math.round(col*cv.width/4),sy=Math.round(row*cv.height/2),right=Math.round((col+1)*cv.width/4),bottom=Math.round((row+1)*cv.height/2);return P.Sprites.bounds(pixels,cv.width,sx,sy,right-sx,bottom-sy)});this.ready=true}catch{this.failed=true}};image.onerror=()=>{this.failed=true;this.image=null};image.src='assets/characters/sideral-lagarto-motion-v2.webp'},
 frame(p){return p.moving?Math.floor((p.walkPhase||0)*1.5)%6:0},
 artFrame(p,breath=false){const hurt=P.state.elapsed-(p.hurtAt??-100);if(hurt>=0&&hurt<P.PlayerFeedback.hitDuration)return 7;if(breath)return P.state.elapsed-(p.sideralCast?.start||0)<.1?5:6;if(!p.moving)return 0;return [1,2,3,2][Math.floor((p.walkPhase||0)*1.35)%4]},
 sprite(ctx,x,y,size,p,flip=false,frame=null,alpha=1){this.load();if(!this.ready)return false;const i=frame??this.artFrame(p,p.sideralCast?.kind==='breath'&&P.state.elapsed-p.sideralCast.start<.3),cell=this.cells[i];if(!cell)return false;const height=size*1.38,scale=height/cell.h,anchor=[.6,.6,.6,.6,.57,.6,.6,.6][i];ctx.save();ctx.globalAlpha*=alpha;ctx.translate(Math.round(x),Math.round(y));if(flip)ctx.scale(-1,1);ctx.imageSmoothingEnabled=true;ctx.drawImage(this.image,cell.sx,cell.sy,cell.w,cell.h,Math.round(-cell.w*scale*anchor),Math.round(-cell.h*scale),Math.round(cell.w*scale),Math.round(cell.h*scale));ctx.restore();return true},
 transformEgg(ctx,x,y,size,p,flip=false){const state=p.sideralTransform||{},now=P.state.elapsed||0,t=Math.max(0,Math.min(1,(now-state.start)/Math.max(.01,state.duration||.66))),reduced=P.Ambient?.reduced?.matches,roll=reduced?0:(state.roll||0)+(p.moving?0:Math.sin(t*Math.PI*5)*.1),burst=Math.max(0,(t-.68)/.32);if(burst>0&&this.sprite(ctx,x,y+size*.8,size*2.7,p,flip,4,Math.min(1,burst*2.2)))return true;ctx.save();ctx.translate(Math.round(x),Math.round(y-size*.2-Math.sin(t*Math.PI)*3));ctx.rotate((flip?-1:1)*roll);const w=size*(1.02+.06*Math.sin(t*Math.PI)),h=size*1.42;ctx.shadowColor='#aaff4d';ctx.shadowBlur=6+12*t;ctx.fillStyle='#243229';ctx.beginPath();ctx.ellipse(0,0,w,h,0,0,Math.PI*2);ctx.fill();const shell=ctx.createRadialGradient(-w*.3,-h*.45,2,0,0,h);shell.addColorStop(0,'#e8e0ae');shell.addColorStop(.55,'#a5b56c');shell.addColorStop(1,'#547044');ctx.shadowBlur=0;ctx.fillStyle=shell;ctx.beginPath();ctx.ellipse(0,0,w*.88,h*.9,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#46633c';for(let i=0;i<9;i++){const a=i*2.399+roll,r=(.18+(i%3)*.22)*h;ctx.beginPath();ctx.ellipse(Math.cos(a)*r*.5,Math.sin(a)*r*.7,3+(i%2)*2,2+(i%3),a,0,Math.PI*2);ctx.fill()}if(t>.2){ctx.strokeStyle='#dfff78';ctx.lineWidth=2.2;ctx.shadowColor='#b9ff55';ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(-w*.18,-h*.85);ctx.lineTo(w*.08,-h*.45);ctx.lineTo(-w*.12,-h*.12);if(t>.43){ctx.lineTo(w*.28,h*.15);ctx.lineTo(-w*.2,h*.48)}if(t>.6){ctx.moveTo(w*.08,-h*.45);ctx.lineTo(w*.55,-h*.22);ctx.moveTo(-w*.12,-h*.12);ctx.lineTo(-w*.62,h*.05)}ctx.stroke()}ctx.restore();if(!reduced){ctx.save();ctx.fillStyle='#d8c99588';for(let i=0;i<4;i++){const a=t*19+i*1.7,life=1-(t*2+i*.19)%1;ctx.fillRect(x-Math.cos(a)*size*(1.2+life),y+size*.95-Math.sin(a)*3,2+life*3,2+life*2)}ctx.restore()}return true},
 creature(ctx,x,y,size,frame=0,flip=false,breath=false){
  const steps=[0,1,2,0,-1,-2],step=steps[frame%6],scale=size/48;
  ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(flip?-scale:scale,scale);ctx.imageSmoothingEnabled=false;
  const poly=(points,color)=>{ctx.fillStyle=color;ctx.beginPath();points.forEach(([a,b],i)=>i?ctx.lineTo(a,b):ctx.moveTo(a,b));ctx.closePath();ctx.fill()},rect=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h)};
  // Cola, patas traseras y brazos permanecen conectados en los seis cuadros.
  poly([[-8,-16],[-18,-13],[-29,-19-step],[-23,-8],[-9,-7]],'#193f31');
  poly([[-9,-14],[-17,-11],[-25,-16-step],[-19,-7],[-8,-6]],'#43894b');
  rect(-8+step,-5,7,7,'#18382c');rect(-10+step,0,10,3,'#d7d594');
  rect(3-step,-5,7,7,'#18382c');rect(3-step,0,11,3,'#e8e0a1');
  poly([[-11,-31],[-5,-35],[9,-32],[14,-20],[10,-5],[-8,-5],[-13,-17]],'#18382c');
  poly([[-9,-29],[-4,-32],[7,-30],[11,-20],[8,-8],[-6,-8],[-10,-17]],'#4a9b54');
  poly([[0,-30],[7,-28],[9,-18],[6,-9],[-2,-9],[-4,-20]],'#b3c777');
  for(let i=0;i<4;i++)rect(-10-i%2,-29+i*5,4,3,'#8dbd62');
  // Auriculares y camiseta roja conservan la identidad de Sideral transformado.
  rect(-10,-29,10,8,'#aa3f59');rect(-9,-27,8,3,'#e16b77');
  poly([[-11,-38],[-6,-46],[9,-46],[15,-40],[22,-38],[22,breath?-27:-31],[10,-27],[-8,-29]],'#18382c');
  poly([[-8,-38],[-4,-43],[7,-43],[12,-37],[19,-36],[19,breath?-29:-33],[8,-30],[-6,-32]],'#67ad58');
  rect(4,-41,8,5,'#d5df86');rect(8,-41,2,5,'#1b2728');rect(10,-35,11,2,'#1a3529');
  if(breath){rect(12,-32,11,5,'#45283b');rect(14,-32,6,2,'#fff0b8');rect(18,-29,6,2,'#ef9267')}
  rect(-7,-44,4,13,'#1c2938');rect(-10,-39,4,8,'#b14c63');rect(-6,-46,12,3,'#263344');
  // Brazos completos: hombro, antebrazo y garra comparten la misma silueta.
  poly([[-8,-25],[-13,-21],[-12-step,-13],[-6-step,-12],[-5-step,-16],[-8,-18],[-4,-23]],'#244b36');
  rect(-12-step,-18,5,5,'#78b464');rect(-10-step,-13,7,2,'#e2dea0');
  poly([[8,-25],[13,-23],[15+step,-17],[11+step,-13],[6+step,-15],[10,-19],[6,-21]],'#43864a');
  rect(10+step,-16,8,2,'#e2dea0');
  ctx.restore()
 },
 tail(ctx,x,y,angle,t,range=110){const swing=angle-1.2+t*2.4;ctx.save();ctx.translate(x,y-12);ctx.strokeStyle='#173d32';ctx.lineCap='round';ctx.lineWidth=15;ctx.beginPath();ctx.moveTo(-4,0);ctx.quadraticCurveTo(Math.cos(swing-.25)*range*.5,Math.sin(swing-.25)*range*.5,Math.cos(swing)*range,Math.sin(swing)*range);ctx.stroke();ctx.strokeStyle='#71aa59';ctx.lineWidth=9;ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle='#d1da87';ctx.stroke();ctx.restore()},
 egg(ctx,x,y,size=12,crack=false){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.fillStyle='#243a32';ctx.fillRect(-size*.6,-size,size*1.2,size*1.5);ctx.fillStyle='#e3e5b6';ctx.fillRect(-size*.45,-size*.9,size*.9,size*1.3);ctx.fillStyle='#709e60';ctx.fillRect(-size*.3,-size*.55,size*.3,size*.28);ctx.fillRect(size*.08,-size*.12,size*.3,size*.3);if(crack){ctx.strokeStyle='#365844';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-size*.45,-size*.1);ctx.lineTo(-2,-size*.35);ctx.lineTo(2,0);ctx.lineTo(size*.45,-size*.2);ctx.stroke()}ctx.restore()},
 actor(ctx,x,y,r,p,attack,flip,preview,base){
  if(P.SideralKit.active(p)){const transform=p.sideralTransform,forming=transform&&P.state.elapsed<transform.start+transform.duration;if(forming)return this.transformEgg(ctx,x,y+r*.8,r,p,flip);if(this.sprite(ctx,x,y+r*.8,r*2.7,p,flip))return true;this.creature(ctx,x,y+r*.8,r*2.7,this.frame(p),flip,true);return true}
  if((p.sideralRevertUntil||0)>P.state.elapsed){const t=Math.max(0,Math.min(1,(P.state.elapsed-(p.sideralRevertStarted||P.state.elapsed))/.32));this.sprite(ctx,x,y+r*.8,r*2.7,p,flip,0,1-t);ctx.save();ctx.globalAlpha*=t;const result=base(ctx,x,y,r,p,attack,flip,preview);ctx.restore();return result||true}
  const pose=p.sideralCast,t=pose?(P.state.elapsed-pose.start)/pose.duration:2;
  if(pose?.kind==='tail'&&t>=0&&t<1)this.tail(ctx,x,y,pose.angle,P.Ambient?.reduced?.matches?.5:t,Math.min(95,(P.SideralArsenal.attack(p)?.range||125)*.65));
  const result=base(ctx,x,y,r,p,attack,flip,preview);
  if(pose?.kind==='egg'&&t>=0&&t<.5)this.egg(ctx,x+(flip?-1:1)*16,y-15-Math.sin(t*Math.PI)*8,7);
  return result
 },
 draw(ctx){const players=[P.state.player,...(P.Coop?.peers||[])];for(const p of players){if(!P.SideralKit.eligible(p)||p.hp<=0)continue;for(const n of p.sideralEggs||[]){if(!n.open){const flight=Math.min(1,n.age/.35),x=n.fromX+(n.x-n.fromX)*flight,y=n.fromY+(n.y-n.fromY)*flight-Math.sin(flight*Math.PI)*65;ctx.save();ctx.fillStyle='#152b2944';ctx.fillRect(n.x-10,n.y+4,20,4);ctx.restore();this.egg(ctx,x,y-4,11,n.age>.35+n.delay*.65)}else for(const runner of n.runners){if(runner.age>=.38)continue;ctx.save();ctx.translate(runner.x,runner.y);ctx.rotate(runner.angle);this.creature(ctx,0,0,19,Math.floor(runner.age*24)%6,false,false);ctx.restore()}}
   const passive=p.sideralPassive;if(passive?.stacks){ctx.save();ctx.fillStyle=passive.stacks===3?'#e6ffac':'#80b866';for(let i=0;i<passive.stacks;i++){const x=p.x-11+i*11,y=p.y+26;ctx.beginPath();ctx.moveTo(x,y-4);ctx.lineTo(x+4,y);ctx.lineTo(x,y+4);ctx.lineTo(x-4,y);ctx.closePath();ctx.fill()}ctx.restore()}
   if(!P.SideralKit.active(p)||p.sideralCast?.kind!=='breath'||P.state.elapsed-p.sideralCast.start>.3)continue;const forming=p.sideralTransform&&P.state.elapsed<p.sideralTransform.start+p.sideralTransform.duration,originX=p.x+(forming?0:(p.facing||1)*30),originY=p.y-(forming?18:29);ctx.save();ctx.translate(originX,originY);ctx.rotate(p.sideralBreathAim||0);const length=310*p.reach,reduced=P.Ambient?.reduced?.matches,phase=reduced?0:P.state.elapsed*18,gradient=ctx.createLinearGradient(0,0,length,0);gradient.addColorStop(0,'#f7ffb7');gradient.addColorStop(.32,'#caff54');gradient.addColorStop(.72,'#55d83f');gradient.addColorStop(1,'#7b36bd22');ctx.shadowColor='#b7ff48';ctx.shadowBlur=14;ctx.fillStyle=gradient;for(let layer=0;layer<3;layer++){const width=[.2,.125,.055][layer],reach=length*(1-layer*.08);ctx.globalAlpha=[.42,.7,.95][layer];ctx.beginPath();ctx.moveTo(0,-4);for(let i=1;i<=7;i++){const q=i/7,jitter=reduced?0:Math.sin(phase+i*2.17+layer)*length*.018;ctx.lineTo(reach*q,jitter-reach*width*Math.sin(q*Math.PI))}for(let i=7;i>=1;i--){const q=i/7,jitter=reduced?0:Math.sin(phase+i*2.17+layer+1.7)*length*.018;ctx.lineTo(reach*q,jitter+reach*width*Math.sin(q*Math.PI))}ctx.closePath();ctx.fill()}ctx.shadowBlur=0;if(!reduced){ctx.globalAlpha=.8;for(let i=0;i<9;i++){const q=((phase*.07+i*.123)%1),spread=Math.sin(q*Math.PI)*length*.16;ctx.fillStyle=i%2?'#eaff78':'#79e84d';ctx.fillRect(length*q,Math.sin(phase+i*4.1)*spread,3+i%3,2+i%2)}}ctx.restore()
  }}
};
{
 const draw=P.SideralArt.draw.bind(P.SideralArt),world=P.Ultimate.draw,projectile=P.FX.projectile,effect=P.FX.effect;
 P.SideralArt.draw=function(ctx,x,y,r,p,attack=false,flip=false,preview=0){return P.SideralLagarto.actor(ctx,x,y,r,p,attack,flip,preview,draw)};
 P.Ultimate.draw=function(ctx,...args){const result=world.call(this,ctx,...args);P.SideralLagarto.draw(ctx);return result};
 P.FX.projectile=function(ctx,shot,...args){if(shot.glyph!=='LAGARTO_WAVE')return projectile.call(this,ctx,shot,...args);ctx.save();ctx.translate(shot.x,shot.y);ctx.rotate(shot.angle);ctx.strokeStyle='#c6f18a';ctx.lineWidth=5;ctx.beginPath();ctx.arc(-12,0,22,-.8,.8);ctx.stroke();ctx.restore()};
 P.FX.effect=function(ctx,e,...args){if(e.kind==='sideral-breath-impact'){const t=Math.max(0,e.life/e.maxLife);ctx.save();ctx.translate(e.x,e.y);ctx.globalAlpha=t;ctx.strokeStyle='#dfff72';ctx.lineWidth=2+3*t;ctx.shadowColor='#91ff45';ctx.shadowBlur=9;for(let i=0;i<5;i++){const a=i*Math.PI*2/5+(1-t)*.8,r=(1-t)*24+5;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.35,Math.sin(a)*r*.35);ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);ctx.stroke()}ctx.restore();return}if(e.kind!=='sideral-sweep')return effect.call(this,ctx,e,...args);ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.angle);ctx.globalAlpha=Math.max(0,e.life/e.maxLife)*.42;ctx.fillStyle=e.tail?'#a1d77b':'#cf88ef';ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,e.r,-e.arc/2,e.arc/2);ctx.closePath();ctx.fill();ctx.restore()}
}
P.SideralLagarto.load();
