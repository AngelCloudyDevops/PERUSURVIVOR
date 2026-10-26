'use strict';
// Monumento y picnic comparten textura; el terreno conserva toda su física.
P.CampoArt={
ready:false,
cells:[{x:12,y:90,w:232,h:158},{x:277,y:8,w:214,h:112},{x:296,y:136,w:176,h:112}],
load(){if(this.image||typeof Image==='undefined')return;const image=new Image();this.image=image;image.onload=()=>{this.ready=true};image.onerror=()=>{this.ready=false};image.src='assets/environment/campo-landmarks-v1.webp'},
draw(ctx,o){if(P.Maps.selected!=='campo'||P.state.encounter||(o.kind!=='landmark'&&o.kind!=='picnic'))return false;this.load();if(!this.ready)return false;const monument=o.kind==='landmark',variant=monument?0:1+Math.abs(Math.round(o.x/41+o.y/37))%2,c=this.cells[variant],width=monument?o.w:o.w+12,height=Math.min(monument?215:100,width*c.h/c.w),base=o.y+o.h/2+(monument?0:3),p=P.state.player,behind=monument&&p&&p.y<base-12&&p.y>base-height-25&&Math.abs(p.x-o.x)<width*.5;ctx.save();ctx.imageSmoothingEnabled=false;P.Ambient.leafMass(ctx,o.x+1,base-1,width*.43,monument?8:6,'#203b3038');if(behind)ctx.globalAlpha=.58;ctx.drawImage(this.image,c.x,c.y,c.w,c.h,Math.round(o.x-width/2),Math.round(base-height),Math.round(width),Math.round(height));ctx.restore();return true}
};
