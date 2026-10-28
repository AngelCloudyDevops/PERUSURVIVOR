'use strict';
// Piedra de Machu Picchu; conserva obstáculos, rutas y cantidades del mapa.
P.MachuArt={
ready:false,
cells:[{x:12,y:44,w:232,h:204},{x:268,y:50,w:232,h:198},{x:524,y:59,w:232,h:189},{x:12,y:428,w:232,h:76},{x:332,y:272,w:103,h:232},{x:524,y:399,w:232,h:105}],
stoneMap(){return P.Maps.selected==='machu'||P.Maps.current?.()?.surface==='mist'},
load(){if(this.image||typeof Image==='undefined')return;const image=new Image();this.image=image;image.onload=()=>{this.ready=true;if(this.stoneMap())for(const chunk of P.Chunks?.cache?.values()||[])chunk.canvas=null};image.onerror=()=>{this.ready=false};image.src='assets/environment/machu-stone-v1.webp'},
draw(ctx,o){if(!this.stoneMap()||P.state.encounter||(o.kind!=='rock'&&o.kind!=='wall'&&o.kind!=='landmark'))return false;this.load();if(!this.ready)return false;const rock=o.kind==='rock',terrace=o.kind==='landmark',vertical=!rock&&!terrace&&o.h>o.w,index=rock?Math.abs(Math.round(o.x/41+o.y/37))%3:terrace?5:vertical?4:3,c=this.cells[index],width=o.w+8,height=terrace?Math.min(175,width*c.h/c.w):vertical?o.h+28:Math.min(o.h+40,width*c.h/c.w),base=o.y+o.h/2+4,p=P.state.player,behind=p&&p.y<base-12&&p.y>base-height-20&&Math.abs(p.x-o.x)<width*.5;ctx.save();ctx.imageSmoothingEnabled=false;P.Ambient.leafMass(ctx,o.x+1,base-1,width*.43,6,'#203b3038');if(behind)ctx.globalAlpha=.58;ctx.drawImage(this.image,c.x,c.y,c.w,c.h,Math.round(o.x-width/2),Math.round(base-height),Math.round(width),Math.round(height));ctx.restore();return true},
// Solo se llama al construir el canvas de un sector, nunca por fotograma.
edge(ctx,x,y,w,h){if(!this.ready||!this.stoneMap())return false;const c=this.cells[3];ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalAlpha=.8;ctx.drawImage(this.image,c.x+2,c.y+Math.round(c.h*.23),c.w-4,Math.round(c.h*.52),x,y,w,h);ctx.restore();return true}
};
