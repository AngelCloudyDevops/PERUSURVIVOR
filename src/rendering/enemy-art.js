'use strict';
P.EnemyArt={
names:['Pablo','Tyrone','Uniqua','Tasha','Austin','PNP'],ready:false,cells:[],
init(){if(typeof Image==='undefined')return;this.image=new Image();this.image.onload=()=>{this.measure();this.ready=true};this.image.onerror=()=>console.warn('No se pudo cargar el atlas de rivales');this.image.src='assets/enemies/rivales-atlas-v1.png'},
measure(){const image=this.image,cv=document.createElement('canvas');cv.width=image.width;cv.height=image.height;const ctx=cv.getContext('2d');ctx.drawImage(image,0,0);const pixels=ctx.getImageData(0,0,cv.width,cv.height).data;
for(let row=0;row<6;row++){const frames=[];for(let col=0;col<2;col++){const sx=Math.round(col*image.width/2),sy=Math.round([0,246,491,738,976,1246,1536][row]/1536*image.height),rightEdge=Math.round((col+1)*image.width/2),bottomEdge=Math.round([0,246,491,738,976,1246,1536][row+1]/1536*image.height),cw=rightEdge-sx,ch=bottomEdge-sy;let left=cw,right=0,top=ch,bottom=0;for(let y=1;y<ch-1;y++)for(let x=1;x<cw-1;x++)if(pixels[((sy+y)*cv.width+sx+x)*4+3]>160){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}frames.push({sx:sx+left,sy:sy+top,w:Math.max(1,right-left+1),h:Math.max(1,bottom-top+1)})}this.cells.push(frames)}
},
gait(e){const phase=e.walkPhase||0,step=e.moving?Math.sin(phase):0;return {step,lift:e.moving?Math.abs(Math.cos(phase))*2:0,frame:e.moving&&step<0?1:0}},
draw(ctx,e){if(!this.ready)return false;const row=e.design||0,gait=this.gait(e),cell=this.cells[row][gait.frame],height=e.heavy?67:50,width=cell.w/cell.h*height;ctx.save();ctx.translate(Math.round(e.x),Math.round(e.y+e.r*.8));ctx.fillStyle='#14203255';ctx.beginPath();ctx.ellipse(0,0,e.r,5,0,0,7);ctx.fill();if((e.facing||1)<0)ctx.scale(-1,1);ctx.imageSmoothingEnabled=false;if(e.hit>0)ctx.globalAlpha=.6;
ctx.translate(0,-gait.lift);ctx.rotate(gait.step*.035);ctx.scale(1,1-Math.abs(gait.step)*.018);
// Blend alternating foot movement in below the hips, keeping the torso intact.
const hip=Math.floor(cell.h*.76);ctx.drawImage(this.image,cell.sx,cell.sy,cell.w,hip,-width/2,-height,width,hip/cell.h*height+.5);const bands=3;for(let band=0;band<bands;band++){const top=hip+Math.floor((cell.h-hip)*band/bands),bottom=hip+Math.floor((cell.h-hip)*(band+1)/bands),leg=(band+1)/bands,half=cell.w/2;for(let side=0;side<2;side++){const swing=gait.step*leg*(side?1:-1);ctx.drawImage(this.image,cell.sx+side*half,cell.sy+top,half,bottom-top,-width/2+side*width/2+swing*2,-height+top/cell.h*height-Math.max(0,swing)*2,width/2,(bottom-top)/cell.h*height+.5)}}ctx.restore();return true}
};
