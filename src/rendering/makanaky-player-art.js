'use strict';
// Reutiliza cuatro figuras completas; no descarga ni duplica otro atlas.
P.MakanakyPlayerArt={ready:false,promise:null,
 load(retry=false){
  if(this.ready){if(!P.WalkArt.sheets.makanaky?.ready||!P.WalkArt.sheets['attack-makanaky']?.ready)this.installSheets();return Promise.resolve(this)}
  if(typeof Image==='undefined')return Promise.resolve(null);
  if(this.promise&&!(retry&&this.failed))return this.promise;
  this.failed=false;this.promise=new Promise(resolve=>{const image=new Image();const fail=()=>{this.failed=true;resolve(null)};image.onerror=fail;image.onload=()=>{try{
   const cv=document.createElement('canvas');cv.width=image.width;cv.height=image.height;const ctx=cv.getContext('2d');ctx.drawImage(image,0,0);const pixels=ctx.getImageData(0,0,cv.width,cv.height);for(let i=3;i<pixels.data.length;i+=4)pixels.data[i]=pixels.data[i]<150?0:255;const cells=P.Minibosses.measure(pixels.data,cv.width,cv.height);if(cells.length!==4)throw Error('Atlas incompleto');
   const width=Math.max(...cells.map(f=>f.w)),height=Math.max(...cells.map(f=>f.h)),packed=document.createElement('canvas');packed.width=width*4;packed.height=height;const g=packed.getContext('2d');cells.forEach((f,i)=>{const data=g.createImageData(f.w,f.h);data.data.set(f.pixels);g.putImageData(data,i*width,0)});
   const frames=cells.map((f,i)=>({sx:i*width,sy:0,w:f.w,h:f.h,localX:0,localY:0,anchorX:f.w/2,headX:f.w/2,anchorY:f.h}));this.image=packed;this.frames=frames;this.height=Math.max(...cells.slice(0,3).map(f=>f.h));this.installSheets();this.ready=true;P.UI.lastArt=0;resolve(this)
  }catch{fail()}};image.src='assets/minibosses/makanaky-v1.webp'});return this.promise
 },
 installSheets(){const w=P.WalkArt;for(const [id,indices] of [['makanaky',[0,1,0,1,0,1]],['attack-makanaky',[0,2,2,2,0,0]]])w.sheets[id]={id,ready:true,failed:false,image:this.image,height:this.height,sourceHeight:1,frames:indices.map(i=>this.frames[i]),used:++w.clock,promise:Promise.resolve(this)}},
 draw(ctx,x,y,r,frame,flip,gait){if(!this.ready){this.load();return false}if(!P.WalkArt.sheets.makanaky?.ready)this.installSheets();const index=frame===3?2:gait?(Math.sin(gait.phase||0)>0?1:0):frame===2?1:Math.min(frame,2),f=this.frames[index],height=r*2.5,scale=height/this.height;ctx.save();ctx.translate(Math.round(x),Math.round(y+r*.8));if(flip)ctx.scale(-1,1);ctx.imageSmoothingEnabled=false;ctx.drawImage(this.image,f.sx,f.sy,f.w,f.h,Math.round(-f.w*scale/2),Math.round(-f.h*scale),Math.round(f.w*scale),Math.round(f.h*scale));ctx.restore();return true}
};
const makanakyDraw=P.Sprites.draw;P.Sprites.draw=function(ctx,x,y,r,c,frame=0,flip=false,gait=null){return c.id==='makanaky'&&!this.sheets.makanaky?P.MakanakyPlayerArt.draw(ctx,x,y,r,frame,flip,gait):makanakyDraw.call(this,ctx,x,y,r,c,frame,flip,gait)};
