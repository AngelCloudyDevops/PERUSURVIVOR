'use strict';
P.World={
collide(p,old){const cx=Math.round(p.x/1400)*1400,cy=Math.round(p.y/1400)*1400,dx=p.x-cx,dy=p.y-cy,d=Math.hypot(dx,dy);if(d<91){if(d<.01){p.x=old.x;p.y=old.y}else{p.x=cx+dx/d*91;p.y=cy+dy/d*91}}},
draw(ctx,cx,cy,width,height,time){const C=P.Entities.circle,left=Math.floor((cx-width)/100)*100,top=Math.floor((cy-height)/100)*100;ctx.fillStyle='#7a7779';ctx.fillRect(cx-width,cy-height,width*2,height*2);
for(let x=left;x<cx+width+100;x+=100)for(let y=top;y<cy+height+100;y+=100){const road=Math.abs(x%700)<100;ctx.fillStyle=road?'#474c59':((Math.floor(x/100)+Math.floor(y/100))%2===0?'#8a8381':'#817c7c');ctx.fillRect(x+1,y+1,98,98);if(road){ctx.fillStyle='#c7b98a';ctx.fillRect(x+47,y+18,4,25)}else{ctx.fillStyle='#a39c9433';ctx.fillRect(x+7,y+7,38,38);ctx.fillRect(x+54,y+54,38,38)}}
const sx=Math.floor((cx-width)/1400)*1400,sy=Math.floor((cy-height)/1400)*1400;
for(let x=sx;x<cx+width+1400;x+=1400)for(let y=sy;y<cy+height+1400;y+=1400){C(ctx,x,y,88,'#393f50');C(ctx,x,y-5,79,'#b0a39b');C(ctx,x,y-7,65,'#487c8b');C(ctx,x,y-7,50,'#5d9aa4');ctx.strokeStyle='#b5d9d188';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y-8,35+Math.sin(time/600)*4,20,0,0,7);ctx.stroke();C(ctx,x,y-20,15,'#d2bca3');ctx.fillStyle='#365746';ctx.fillRect(x-240,y-240,135,95);ctx.fillRect(x+180,y+160,135,95);for(const [tx,ty] of [[x-220,y-210],[x+225,y+200]]){C(ctx,tx,ty,34,'#28483d');C(ctx,tx-10,ty-10,28,'#456854');C(ctx,tx+12,ty-16,21,'#53765c')}
this.stall(ctx,x+290,y-150,'EMOLIENTE','#e1b566');this.stall(ctx,x-350,y+150,'SU BUEN SÁNGUCHE','#ca696b');ctx.fillStyle='#d9c6b4';ctx.fillRect(x-390,y-340,235,85);ctx.fillStyle='#a64c50';ctx.fillRect(x-400,y-355,255,20);ctx.fillStyle='#4c5265';for(let i=0;i<5;i++)ctx.fillRect(x-375+i*44,y-325,24,40);ctx.fillStyle='#f1d6a0';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText('PLAZA DEL CAUSAS',x,y+125)}
},
stall(ctx,x,y,label,color){ctx.fillStyle='#30374877';ctx.fillRect(x-3,y+15,143,65);ctx.fillStyle='#c9a98c';ctx.fillRect(x,y,130,65);for(let i=0;i<8;i++){ctx.fillStyle=i%2?'#f2dfc2':color;ctx.fillRect(x-5+i*17,y-10,17,24)}ctx.fillStyle='#443a3a';ctx.fillRect(x+10,y+25,110,25);ctx.fillStyle='#f5ddac';ctx.font='bold 8px sans-serif';ctx.textAlign='center';ctx.fillText(label,x+65,y+41)},
render(time){const s=P.state,{ctx,width:w,height:h}=P.Core,playing=s.mode!=='menu',p=s.player,cx=playing?p.x:160,cy=playing?p.y:110;ctx.clearRect(0,0,w,h);ctx.save();ctx.translate(w*.5-cx,h*.55-cy);this.draw(ctx,cx,cy,w,h,time);
if(playing){
for(const g of s.gems){ctx.save();ctx.translate(g.x,g.y);ctx.rotate(Math.PI/4);ctx.fillStyle='#f6cc65';ctx.fillRect(-4,-4,8,8);ctx.restore()}
const actors=[...s.enemies,p].sort((a,b)=>a.y-b.y);
for(const actor of actors){if(actor===p){if(p.inv<=0||Math.floor(time/70)%2){if(!P.Sprites.actor(ctx,p))P.Entities.portrait(ctx,p.x,p.y,24,p)}ctx.fillStyle='#fbefdc';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText(p.name,p.x,p.y+37);continue}
const e=actor;if(e.boss){P.Sprites.draw(ctx,e.x,e.y,43,P.Data.boss,e.castUntil>s.elapsed?3:1+Math.floor(s.elapsed*6)%2,p.x<e.x)}else P.Entities.portrait(ctx,e.x,e.y,e.r,{look:e.boss?'headset':'cap',color:e.hit>0?'#fff':e.boss?'#bc66a0':e.heavy?'#8c7caa':'#667c97',skin:e.boss?'#a89bc3':'#9dabb7'});ctx.fillStyle='#182137';ctx.font='bold '+(e.boss?18:11)+'px monospace';ctx.textAlign='center';ctx.fillText(e.boss?'ELZEEIN':'@',e.x,e.y-e.r-10);if(e.boss){ctx.fillStyle='#303248';ctx.fillRect(e.x-50,e.y-65,100,6);ctx.fillStyle='#f0a75e';ctx.fillRect(e.x-50,e.y-65,100*Math.max(0,e.hp/e.max),6)}}
for(const shot of [...s.shots,...s.danger])P.FX.projectile(ctx,shot);
if(p.attack==='orbit')P.FX.orbit(ctx,p);
for(const effect of s.effects)P.FX.effect(ctx,effect)
}
ctx.restore();const g=ctx.createRadialGradient(w/2,h/2,150,w/2,h/2,Math.max(w,h)*.7);g.addColorStop(0,'#14203200');g.addColorStop(1,'#14203299');ctx.fillStyle=g;ctx.fillRect(0,0,w,h)}
};
