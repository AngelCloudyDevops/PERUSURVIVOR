'use strict';
// Ocho acciones dibujadas, sin deformar la anatomía del Gallinazo.
P.VultureStrike={ready:false,failed:false,frames:[],
init(){if(this.started||typeof Image==='undefined')return;this.started=true;const image=new Image();image.onload=()=>{try{const cv=document.createElement('canvas');cv.width=image.width;cv.height=image.height;const c=cv.getContext('2d');c.drawImage(image,0,0);const raster=c.getImageData(0,0,cv.width,cv.height);for(let i=3;i<raster.data.length;i+=4)raster.data[i]=raster.data[i]<150?0:255;c.putImageData(raster,0,0);this.surface=cv;this.frames=[];const edges=[0,.254,.511,.749,1];for(let row=0;row<2;row++)for(let col=0;col<4;col++){const x0=Math.round(edges[col]*cv.width),x1=Math.round(edges[col+1]*cv.width),y0=Math.round(row*cv.height/2),y1=Math.round((row+1)*cv.height/2),f=P.BossArt.mainBounds(raster.data,cv.width,x0,y0,x1,y1);this.frames.push({...f,pivotX:(x0+x1)/2,pivotY:y0+(y1-y0)*.94})}this.height=cv.height/2;
// Localizar el amarillo del ojo en el primer cuadro; excluir pico claro y patas.
let sx=0,sy=0,n=0;const f=this.frames[0];for(let y=0;y<cv.height*.35;y++)for(let x=cv.width*.13|0;x<cv.width*.25;x++){const i=(y*cv.width+x)*4,r=raster.data[i],g=raster.data[i+1],b=raster.data[i+2];if(r>190&&g>160&&b<60&&raster.data[i+3]>150){sx+=x;sy+=y;n++}}this.eye=n?{x:sx/n,y:sy/n}:{x:f.x+f.w*.82,y:f.y+f.h*.3};this.ready=true}catch{this.failed=true}};image.onerror=()=>{this.failed=true};image.src='assets/bosses/gallinazo-strike-v1.webp'},
pose(t,reduced=false){if(reduced)return 0;return t<1.95?0:t<2.2?1:t<2.45?2:t<2.65?3:t<2.9?4:t<3.08?5:t<3.3?6:7},
root(t,reduced=false){if(reduced)return {x:0,y:0,angle:0};const s=P.VultureScene.smooth,launch=s((t-2.35)/.4),land=s((t-3.3)/.45),strike=s((t-2.88)/.2);return {x:launch*.035-strike*.015,y:-launch*.13+land*.13,angle:launch*.025-strike*.07+land*.045}},
geometry(w,h){const f=this.frames[0],scale=h*.76/this.height;return {f,x:w*.55-(f.pivotX-f.x)*scale,y:h*.87-(f.pivotY-f.y)*scale,w:f.w*scale,h:f.h*scale,scale,baseX:w*.55,baseY:h*.87}},
eyePosition(g){return {x:g.baseX+(this.eye.x-g.f.pivotX)*g.scale,y:g.baseY+(this.eye.y-g.f.pivotY)*g.scale}},
draw(c,g,t,reduced){const f=this.frames[this.pose(t,reduced)],m=this.root(t,reduced);c.save();c.translate(g.baseX+m.x*g.w,g.baseY+m.y*g.h);c.rotate(m.angle);c.drawImage(this.surface,f.x,f.y,f.w,f.h,(f.x-f.pivotX)*g.scale,(f.y-f.pivotY)*g.scale,f.w*g.scale,f.h*g.scale);c.restore()}
};
P.VultureBackdrop={ready:false,failed:false,
init(){if(this.started||typeof Image==='undefined')return;this.started=true;const image=new Image();image.onload=()=>{this.image=image;this.ready=true};image.onerror=()=>{this.failed=true};image.src='assets/arenas/lima-parallax-v1.webp'},
offsets(t,reduced=false){if(reduced)return {sky:0,city:0,roof:0,shake:0};const s=P.VultureScene.smooth,p=s((t-.4)/1.45),hit=s((t-2.9)/.1)*(1-s((t-3.2)/.25));return {sky:-t*.008,city:(p-.5)*.045,roof:(p-.5)*.12,shake:Math.sin(t*47)*hit*2}},
draw(c,w,h,t,reduced){const i=this.image,m=this.offsets(t,reduced),sx=i.width*.009,sw=i.width*.982;c.fillStyle='#554b67';c.fillRect(0,0,w,h);c.drawImage(i,sx,i.height*.045,sw,i.height*.258,-w*.08+m.sky*w,-h*.04,w*1.2,h*.52);c.drawImage(i,sx,i.height*.32,sw,i.height*.37,-w*.06+m.city*w,h*.24,w*1.12,h*.57);c.drawImage(i,sx,i.height*.697,sw,i.height*.303,-w*.1+m.roof*w,h*.49+m.shake,w*1.2,h*.52);
if(!reduced&&t>2.9){const age=t-2.9;for(let k=0;k<28;k++){const side=k%2?1:-1,q=Math.min(1,age*(.7+(k%4)*.15)),x=w*.55+side*q*w*(.2+(k%5)*.08),y=h*.87-Math.sin(q*Math.PI)*h*.07+(k%3)*2;c.save();c.globalAlpha=(1-q)*.75;c.fillStyle=k%3?'#b4a995':'#706c71';const size=2+q*9;c.fillRect(x,y,size*2,size);c.restore()}}}
};
{
const scene=P.VultureScene,init=scene.init,geometry=scene.geometry,bird=scene.bird;
scene.init=function(){init.call(this);P.VultureStrike.init();P.VultureBackdrop.init()};
scene.pending=()=>typeof Image!=='undefined'&&(!P.VultureStrike.ready&&!P.VultureStrike.failed||!P.VultureBackdrop.ready&&!P.VultureBackdrop.failed);
scene.geometry=function(w,h){return P.VultureStrike.ready?P.VultureStrike.geometry(w,h):geometry.call(this,w,h)};
scene.eye=function(g){return P.VultureStrike.ready?P.VultureStrike.eyePosition(g):{x:g.x+g.w*.775,y:g.y+g.h*.503}};
scene.bird=function(c,g,m,t,reduced){if(P.VultureStrike.ready)P.VultureStrike.draw(c,g,t,reduced);else bird.call(this,c,g,m)};
scene.backgroundDraw=function(c,w,h,t,reduced){if(P.VultureBackdrop.ready)P.VultureBackdrop.draw(c,w,h,t,reduced);else{const bg=this.background||P.Vulture.roof;if(bg)c.drawImage(bg,0,0,bg.width,bg.height,0,0,w,h)}};
}
