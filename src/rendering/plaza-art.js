'use strict';
// Arquitectura compartida de la Plaza; ningún cambio en física ni estado de partida.
P.PlazaArt={
ready:false,
cells:[{x:16,y:39,w:480,h:457},{x:528,y:167,w:480,h:329}],
load(){if(this.image||typeof Image==='undefined')return;const image=new Image();this.image=image;image.onload=()=>{this.ready=true};image.onerror=()=>{this.ready=false};image.src='assets/environment/plaza-landmarks-v1.webp'},
draw(ctx,index,x,base,width,maxHeight){this.load();if(!this.ready)return false;const c=this.cells[index],height=Math.min(maxHeight,width*c.h/c.w),p=P.state.player,behind=p&&p.y<base-12&&p.y>base-height-35&&Math.abs(p.x-x)<width*.5;ctx.save();ctx.imageSmoothingEnabled=false;if(behind)ctx.globalAlpha=.58;ctx.drawImage(this.image,c.x,c.y,c.w,c.h,Math.round(x-width/2),Math.round(base-height),Math.round(width),Math.round(height));ctx.restore();return true},
landmark(ctx,o){if(P.Maps.selected!=='plaza'||P.state.encounter||o.kind!=='landmark')return false;this.load();if(!this.ready)return false;P.Ambient.leafMass(ctx,o.x+2,o.y+o.h/2,o.w*.45,7,'#203b3038');return this.draw(ctx,1,o.x,o.y+o.h/2,o.w,190)},
fountain(ctx,f){this.load();if(!this.ready)return false;P.Ambient.leafMass(ctx,f.x+2,f.y+f.ry-2,f.rx*.84,8,'#203b3038');this.draw(ctx,0,f.x,f.y+f.ry,f.rx*2,340);this.water(ctx,f);return true},
water(ctx,f){if(P.Ambient.reduced?.matches)return;const t=P.Ambient.clock();ctx.save();ctx.globalAlpha=.42;ctx.fillStyle='#d5f0db';for(let i=0;i<8;i++){const a=i*Math.PI/4+t*.16,x=f.x+Math.cos(a)*f.rx*.59,y=f.y+25+Math.sin(a)*11;ctx.fillRect(Math.round(x),Math.round(y),4+i%2*2,1)}ctx.restore()}
};
