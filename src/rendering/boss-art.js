'use strict';
// Arte de jefes y escenas del portal: nunca se dibuja el mapa de origen debajo.
P.BossArt={
image:null,frames:[],rowHeights:[],ready:false,images:{},
scenes:{
combi:{id:'terminal-combi',name:'Terminal del Último Viaje',asset:'combi',color:'#b68a52',bounds:{left:-900,right:900,top:-500,bottom:500}},
cabinet:{id:'salon-gabinete',name:'Salón del Gabinete Infinito',asset:'cabinet',color:'#9f5664',bounds:{left:-900,right:900,top:-500,bottom:500}},
stone:{id:'santuario-niebla',name:'Santuario de la Niebla',asset:'guardian',color:'#5e9b8e',bounds:{left:-900,right:900,top:-500,bottom:500}}
},
scene(kind){return this.scenes[kind]},
init(){if(typeof Image==='undefined')return;const image=new Image();this.image=image;image.onload=()=>{this.measure();this.ready=true};image.onerror=()=>console.warn('No se pudo cargar el atlas de jefes');image.src='assets/bosses/boss-atlas-v1.png';
for(const [kind,scene] of Object.entries(this.scenes)){const art=new Image();art.onload=()=>this.images[kind]=art;art.onerror=()=>console.warn('No se pudo cargar la arena '+scene.name);art.src='assets/arenas/'+scene.asset+'-v1.png'}
},
measure(){const image=this.image,cv=document.createElement('canvas');cv.width=image.width;cv.height=image.height;const ctx=cv.getContext('2d');ctx.drawImage(image,0,0);const data=ctx.getImageData(0,0,cv.width,cv.height).data,cw=image.width/6,ch=image.height/3;
for(let row=0;row<3;row++){const frames=[];for(let col=0;col<6;col++){const x0=Math.round(col*cw),y0=Math.round([0,286/887,579/887,1][row]*image.height),x1=Math.round((col+1)*cw),y1=Math.round([0,286/887,579/887,1][row+1]*image.height);let minX=x1,maxX=x0,minY=y1,maxY=y0;for(let y=y0+1;y<y1-1;y++)for(let x=x0+1;x<x1-1;x++){if(data[(y*cv.width+x)*4+3]>160){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y)}}frames.push(maxX>=minX?{x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1}:{x:x0,y:y0,w:cw,h:ch})}this.frames[row]=frames;this.rowHeights[row]=Math.max(...frames.map(f=>f.h))}
},
frame(e){if(e.phase==='warning')return 3;if(e.phase==='charge'||e.attackUntil>P.state.elapsed)return 4;if(e.phase==='recover')return 5;const distance=Math.hypot(e.x-P.state.player.x,e.y-P.state.player.y);return distance>150?1+Math.floor(P.state.elapsed*7)%2:0},
draw(ctx,e){if(!this.ready)return false;const row={combi:0,cabinet:1,stone:2}[e.kind],frame=this.frames[row][this.frame(e)],height=e.kind==='combi'?150:185,scale=height/this.rowHeights[row];ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(e.x),Math.round(e.y+e.r*.5));if(e.kind==='combi'&&P.state.player.x<e.x)ctx.scale(-1,1);if(e.phase==='warning')ctx.translate(Math.sin(P.state.elapsed*55)*2,0);ctx.fillStyle='#09152166';ctx.beginPath();ctx.ellipse(0,-3,e.r*1.2,16,0,0,7);ctx.fill();if(e.hit>0)ctx.globalAlpha=.75;ctx.drawImage(this.image,frame.x,frame.y,frame.w,frame.h,Math.round(-frame.w*scale/2),-Math.round(frame.h*scale),Math.round(frame.w*scale),Math.round(frame.h*scale));ctx.restore();return true},
background(ctx,cx,cy,w,h,time){const scene=P.state.encounter.scene,kind=P.state.encounter.definition.kind;ctx.fillStyle=scene.color;ctx.fillRect(cx-w,cy-h,w*2,h*2);const art=this.images[kind];if(art){ctx.imageSmoothingEnabled=false;ctx.drawImage(art,-1200,-800,2400,1600)}else{ctx.fillStyle=kind==='combi'?'#464851':kind==='cabinet'?'#584049':'#8ba49a';ctx.fillRect(-1200,-800,2400,1600);ctx.strokeStyle=kind==='combi'?'#e5bc67':'#c4b99c';ctx.lineWidth=5;for(let x=-1050;x<=1050;x+=300){ctx.beginPath();ctx.moveTo(x,-650);ctx.lineTo(x,650);ctx.stroke()}}
if(kind==='stone'){ctx.save();ctx.globalAlpha=.07;ctx.fillStyle='#cbe8da';for(let i=0;i<8;i++)ctx.fillRect(-1100+Math.sin(time/5000+i)*100,Math.sin(i*27)*700,2200,10);ctx.restore()}
},
sceneId(){return P.state.encounter?.scene?.id||P.Maps.current().id}
};