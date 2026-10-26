'use strict';
// Entrada de seis fotogramas generados con IA; el reloj pertenece a la simulación.
P.VultureUltimate={
duration:2,ready:false,frames:[],
init(){if(this.started||typeof Image==='undefined')return;this.started=true;const image=new Image();image.onload=()=>{const cv=document.createElement('canvas');cv.width=image.width;cv.height=image.height;const ctx=cv.getContext('2d');ctx.drawImage(image,0,0);const raster=ctx.getImageData(0,0,cv.width,cv.height);for(let i=3;i<raster.data.length;i+=4)raster.data[i]=raster.data[i]<150?0:255;ctx.putImageData(raster,0,0);this.surface=cv;for(let row=0;row<2;row++)for(let col=0;col<3;col++){const edges=row?[0,.38,.69,1]:[0,1/3,2/3,1];this.frames.push(P.BossArt.mainBounds(raster.data,cv.width,Math.round(edges[col]*cv.width),row*cv.height/2,Math.round(edges[col+1]*cv.width),(row+1)*cv.height/2))}this.height=Math.max(...this.frames.map(f=>f.h));this.ready=true};image.onerror=()=>{this.started=false};image.src='assets/bosses/gallinazo-ultimate-v1.png'},
boss(){return P.state.encounter?.definition.kind==='vulture'?P.state.enemies.find(e=>e.mapBoss&&e.kind==='vulture'&&e.hp>0):null},
start(e,force=false){if(!e||!this.ready||e.phase==='vulture-ultimate'||e.ultimateUsed&&!force)return false;e.ultimateUsed=true;e.ultimateTime=0;e.ultimateWave=0;e.phase='vulture-ultimate';e.attack='ultimate';e.diveRemaining=0;e.landing=false;const p=P.state.player;e.dx=p.x<e.x?-1:1;e.dy=0;e.aim=Math.atan2(p.y-e.y,p.x-e.x);P.state.danger=P.state.danger.filter(q=>q.glyph!=='FEATHER');P.Audio.play('flap');return true},
frame(e){return P.Vulture.reduced()?5:Math.min(5,Math.floor(e.ultimateTime/this.duration*6))},
step(e,dt){e.ultimateTime+=dt;e.hit=Math.max(0,(e.hit||0)-dt);P.Vulture.tickVisuals(e,dt);if(e.ultimateTime<this.duration){e.ultimateDust=(e.ultimateDust||0)-dt;if(e.ultimateDust<=0){P.Vulture.emit(e,'dust',2);e.ultimateDust=.15}return}if(!e.ultimateShout){e.ultimateShout=true;P.Audio.fx('boss')}
// Tres abanicos avisados y bloqueables por las coberturas; después, picada normal avisada.
const wave=Math.min(3,1+Math.floor((e.ultimateTime-this.duration)/.9));while(e.ultimateWave<wave){const p=P.state.player;e.aim=Math.atan2(p.y-e.y,p.x-e.x);e.dx=Math.cos(e.aim);e.dy=Math.sin(e.aim);P.Vulture.feathers(e);e.ultimateWave++}if(e.ultimateTime>=4.7){e.ultimateShout=false;e.diveRemaining=1;P.Vulture.warn(e,'dive',1.05)}},
draw(ctx,e){if(!this.ready||e.phase!=='vulture-ultimate')return false;const frame=this.frames[this.frame(e)],scale=215/this.height;ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(e.x),Math.round(e.y+e.r*.5));if(e.dx<0)ctx.scale(-1,1);ctx.drawImage(this.surface,frame.x,frame.y,frame.w,frame.h,Math.round(-frame.w*scale/2),-Math.round(frame.h*scale),Math.round(frame.w*scale),Math.round(frame.h*scale));ctx.restore();return true},
overlay(){const e=this.boss();if(!e||e.phase!=='vulture-ultimate')return;const {ctx,width:w,height:h}=P.Core;ctx.save();ctx.fillStyle='#10152230';ctx.fillRect(0,0,w,h);const size=Math.max(16,Math.min(30,w/25)),y=Math.max(150,h*.27);ctx.textAlign='center';ctx.font='bold '+size+'px monospace';ctx.fillStyle='#101522e8';ctx.fillRect(0,y-size-12,w,size*2+46);ctx.fillStyle='#f1cd73';ctx.fillText('¡EL CIELO ES MÍO!',w/2,y);ctx.font='bold '+Math.max(11,size*.46)+'px monospace';ctx.fillStyle='#fff0d2';ctx.fillText(e.ultimateTime<2?'BUSCA COBERTURA · PUEDES MOVERTE':'¡CÚBRETE DE LAS PLUMAS!',w/2,y+size);ctx.restore()}
};
{
const init=P.Vulture.init,move=P.Vulture.move,draw=P.Vulture.draw;
P.Vulture.init=function(...args){P.VultureUltimate.init();return init.apply(this,args)};
P.Vulture.move=function(e,dt){if(e.phase==='vulture-ultimate'){P.VultureUltimate.step(e,dt);return}if(e.phase==='approach'&&e.hp<=e.max*.3&&P.VultureUltimate.start(e))return;return move.call(this,e,dt)};
P.Vulture.draw=function(ctx,e){return P.VultureUltimate.draw(ctx,e)||draw.call(this,ctx,e)};
}
