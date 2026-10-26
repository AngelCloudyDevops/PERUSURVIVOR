'use strict';
// Mobiliario compartido de Campo y Plaza, sin entidades ni cambios de colisión.
P.StreetArt={
ready:false,
cells:[{x:39,y:8,w:177,h:112},{x:300,y:8,w:168,h:112},{x:50,y:132,w:28,h:120}],
// Paneles del vidrio en coordenadas locales del farol; metal y poste no se tiñen.
glass:[[[4,21],[8,23],[9,35],[6,32]],[[10,23],[19,23],[17,36],[11,36]],[[20,22],[24,20],[21,33],[19,35]]],
load(){if(this.image||typeof Image==='undefined')return;const image=new Image();this.image=image;image.onload=()=>{this.makeNight();this.ready=true};image.onerror=()=>{this.ready=false};image.src='assets/environment/street-furniture-v1.webp'},
makeNight(){const c=this.cells[2],canvas=document.createElement('canvas');canvas.width=c.w;canvas.height=c.h;const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(this.image,c.x,c.y,c.w,c.h,0,0,c.w,c.h);ctx.globalCompositeOperation='source-atop';for(let i=0;i<this.glass.length;i++){ctx.fillStyle=i===1?'#ffe4aa':'#e9b36b';ctx.beginPath();this.glass[i].forEach(([x,y],n)=>n?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill()}this.night=canvas},
draw(ctx,o){if(P.state.encounter||(P.Maps.selected!=='campo'&&P.Maps.selected!=='plaza')||(o.kind!=='bench'&&o.kind!=='lamp'))return false;this.load();if(!this.ready)return false;const bench=o.kind==='bench',c=this.cells[bench?(P.Maps.selected==='plaza'?1:0):2],height=bench?Math.min(72,o.w*c.h/c.w):122,width=bench?o.w:height*c.w/c.h,base=o.y+(bench?o.h/2+3:7),x=Math.round(o.x-width/2),y=Math.round(base-height),light=bench?0:Math.max(0,Math.min(1,P.DayNight.current().lamps));ctx.save();ctx.imageSmoothingEnabled=false;P.Ambient.leafMass(ctx,o.x+1,base-1,bench?o.w*.43:12,bench?5:4,'#203b3038');if(bench||light<1)ctx.drawImage(this.image,c.x,c.y,c.w,c.h,x,y,Math.round(width),Math.round(height));if(!bench&&light>0){ctx.globalAlpha=light;ctx.drawImage(this.night,0,0,c.w,c.h,x,y,Math.round(width),Math.round(height))}ctx.restore();return true}
};
