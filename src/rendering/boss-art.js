'use strict';
// Arte de jefes y escenas del portal: nunca se dibuja el mapa de origen debajo.
P.BossArt={
image:null,frames:[],rowHeights:[],ready:false,images:{},
scenes:{
vulture:{id:'techos-lima',name:'Techos de Lima',asset:null,color:'#9b9385',bounds:{left:-680,right:680,top:-360,bottom:360}},
combi:{id:'terminal-combi',name:'Terminal del Chosicano',asset:'combi',color:'#b68a52',bounds:{left:-680,right:680,top:-360,bottom:360}},
cabinet:{id:'salon-gabinete',name:'Salón del Gabinete Infinito',asset:'cabinet',color:'#9f5664',bounds:{left:-680,right:680,top:-360,bottom:360}},
stone:{id:'santuario-niebla',name:'Santuario de la Niebla',asset:'guardian',color:'#5e9b8e',bounds:{left:-680,right:680,top:-360,bottom:360}}
},
scene(kind){return this.scenes[kind]},
camera(p,w,h){const x=p.x*.9,y=p.y-70;return {x:Math.max(-960+w/2,Math.min(960-w/2,x)),y:Math.max(-640+h/2,Math.min(640-h/2,y))}},
init(){if(typeof Image==='undefined')return;const image=new Image();this.image=image;image.onload=()=>{this.measure();this.ready=true};image.onerror=()=>console.warn('No se pudo cargar el atlas de jefes');image.src='assets/bosses/boss-atlas-packed-v2.webp';
for(const [kind,scene] of Object.entries(this.scenes)){if(!scene.asset)continue;const art=new Image();art.onload=()=>this.images[kind]=art;art.onerror=()=>console.warn('No se pudo cargar la arena '+scene.name);art.src='assets/arenas/'+scene.asset+'-v1.webp'}
},
mainBounds(data,width,x0,y0,x1,y1){const w=x1-x0,h=y1-y0,seen=new Uint8Array(w*h);let best=null;for(let start=0;start<w*h;start++){if(seen[start])continue;seen[start]=1;const sx=start%w,sy=Math.floor(start/w);if(data[((y0+sy)*width+x0+sx)*4+3]<150)continue;const queue=[start];let count=0,left=w,right=0,top=h,bottom=0;for(let i=0;i<queue.length;i++){const index=queue[i],x=index%w,y=Math.floor(index/w);count++;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy,n=ny*w+nx;if(nx<0||nx>=w||ny<0||ny>=h||seen[n])continue;seen[n]=1;if(data[((y0+ny)*width+x0+nx)*4+3]>=150)queue.push(n)}}if(!best||count>best.count)best={count,x:x0+left,y:y0+top,w:right-left+1,h:bottom-top+1}}return best||{x:x0,y:y0,w,h}},
measure(){const image=this.image,cv=document.createElement('canvas');cv.width=image.width;cv.height=image.height;const ctx=cv.getContext('2d');ctx.drawImage(image,0,0);const data=ctx.getImageData(0,0,cv.width,cv.height).data,cw=image.width/6,ch=image.height/3;
for(let row=0;row<3;row++){const frames=[];for(let col=0;col<6;col++){const x0=Math.round(col*cw),y0=Math.round([0,286/887,579/887,1][row]*image.height),x1=Math.round((col+1)*cw),y1=Math.round([0,286/887,579/887,1][row+1]*image.height);frames.push(this.mainBounds(data,cv.width,x0,y0,x1,y1))}this.frames[row]=frames;this.rowHeights[row]=Math.max(...frames.map(f=>f.h))}
},
frame(e){if(e.phase==='warning')return 3;if(e.phase==='charge'||e.attackUntil>P.state.elapsed)return 4;if(e.phase==='recover')return 5;const distance=Math.hypot(e.x-P.state.player.x,e.y-P.state.player.y);return distance>150?1+Math.floor(P.state.elapsed*7)%2:0},
draw(ctx,e){if(e.kind==='combi')return P.ChosicanoArt.draw(ctx,e);if(e.kind==='fujimori')return P.FujimoriBoss.draw(ctx,e);if(e.kind==='vulture')return P.Vulture.draw(ctx,e);if(!this.ready)return false;const row={combi:0,cabinet:1,stone:2}[e.kind],frame=this.frames[row][this.frame(e)],height=e.kind==='combi'?150:185,scale=height/this.rowHeights[row];ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(e.x),Math.round(e.y+e.r*.5));if(e.kind==='combi'&&P.state.player.x<e.x)ctx.scale(-1,1);if(e.phase==='warning')ctx.translate(Math.sin(P.state.elapsed*55)*2,0);ctx.fillStyle='#09152166';ctx.beginPath();ctx.ellipse(0,-3,e.r*1.2,16,0,0,7);ctx.fill();if(e.hit>0)ctx.globalAlpha=.75;ctx.drawImage(this.image,frame.x,frame.y,frame.w,frame.h,Math.round(-frame.w*scale/2),-Math.round(frame.h*scale),Math.round(frame.w*scale),Math.round(frame.h*scale));ctx.restore();return true},
background(ctx,cx,cy,w,h,time){if(P.state.encounter.definition.kind==='vulture'){P.Vulture.background(ctx,cx,cy,w,h);return}const scene=P.state.encounter.scene,kind=P.state.encounter.definition.kind;ctx.fillStyle=scene.color;ctx.fillRect(cx-w,cy-h,w*2,h*2);const art=this.images[kind];if(art){ctx.imageSmoothingEnabled=false;ctx.drawImage(art,-960,-640,1920,1280)}else{ctx.fillStyle=kind==='combi'?'#464851':kind==='cabinet'?'#584049':'#8ba49a';ctx.fillRect(-1200,-800,2400,1600);ctx.strokeStyle=kind==='combi'?'#e5bc67':'#c4b99c';ctx.lineWidth=5;for(let x=-1050;x<=1050;x+=300){ctx.beginPath();ctx.moveTo(x,-650);ctx.lineTo(x,650);ctx.stroke()}}
if(kind==='stone'){ctx.save();ctx.globalAlpha=.07;ctx.fillStyle='#cbe8da';for(let i=0;i<8;i++)ctx.fillRect(-1100+Math.sin(time/5000+i)*100,Math.sin(i*27)*700,2200,10);ctx.restore()}
},
sceneId(){return P.state.encounter?.scene?.id||P.Maps.current().id}
};
