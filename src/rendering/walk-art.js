'use strict';
// Six authored, intact raster poses per actor. No body-part deformation.
P.WalkArt={
ids:['cristorata','cuy','paloma','alan','alberto','keiko','ollanta','kingteka','shaka','najasor','cirilo','fuzo','charles','axelbenba','cerdito','sustento','cevichero','g5','enemy-0','enemy-1','enemy-2','enemy-3','enemy-4','enemy-5','vulture','ulti-bird'],
sheets:{},queue:[],active:0,clock:0,waitToken:0,
frame(phase){return ((Math.floor((phase||0)*6/(Math.PI*3))%6)+6)%6},
load(id,priority=false,retry=false){
 if(typeof Image==='undefined'||!this.ids.includes(id))return Promise.resolve(null);
 let sheet=this.sheets[id];if(sheet&&!(retry&&sheet.failed)){sheet.used=++this.clock;return sheet.promise}
 sheet={id,ready:false,failed:false,used:++this.clock};sheet.promise=new Promise(resolve=>sheet.resolve=resolve);this.sheets[id]=sheet;
 priority?this.queue.unshift(sheet):this.queue.push(sheet);this.pump();return sheet.promise;
},
pump(){while(this.active<2&&this.queue.length){const sheet=this.queue.shift();this.active++;const image=new Image();sheet.image=image;
 const finish=ok=>{sheet.ready=ok;sheet.failed=!ok;sheet.resolve(ok?sheet:null);this.active--;this.trim();this.pump()};
 image.onload=()=>{try{this.measure(sheet);finish(true)}catch{finish(false)}};image.onerror=()=>finish(false);image.src='assets/walks/'+sheet.id+'-walk-v1.webp';
}},
needed(){return [P.Data.characters[P.state.chosen||0].id,...Array.from({length:6},(_,i)=>'enemy-'+i)]},
init(){for(const id of this.needed())this.load(id)},
readyForStart(){return typeof Image==='undefined'||this.needed().every(id=>this.sheets[id]?.ready)},
waitForStart(action,retry=false){const token=++this.waitToken;P.UI.show('Preparando las caminatas…','Cargando los pasos de tu personaje y los rivales.',[{title:'Volver al menú',action:()=>{this.waitToken++;P.UI.menu()}}]);
 Promise.all(this.needed().map(id=>this.load(id,true,retry))).then(()=>{if(token!==this.waitToken)return;if(this.readyForStart()){action();return}P.UI.show('No se pudieron cargar las caminatas.','Revisa la conexión e inténtalo de nuevo.',[{title:'Reintentar',action:()=>this.waitForStart(action,true)},{title:'Volver al menú',action:()=>{this.waitToken++;P.UI.menu()}}])});
},
trim(){const pinned=new Set([...this.needed(),'vulture','ulti-bird',P.state.player?.id,...(P.Coop?.peers||[]).map(p=>p.id)]),extra=Object.values(this.sheets).filter(s=>s.ready&&!pinned.has(s.id)).sort((a,b)=>b.used-a.used);for(const s of extra.slice(3))delete this.sheets[s.id]},
measure(sheet){
 const image=sheet.image,source=document.createElement('canvas');source.width=image.width;source.height=image.height;const input=source.getContext('2d');input.drawImage(image,0,0);const pixels=input.getImageData(0,0,source.width,source.height).data,w=source.width,h=source.height,n=w*h,labels=new Int32Array(n),stack=new Int32Array(n),groups=[];
 for(let seed=0;seed<n;seed++){if(labels[seed]||pixels[seed*4+3]<=160)continue;const id=groups.length+1,b={id,size:0,left:w,right:0,top:h,bottom:0,sumX:0,sumY:0};let tail=1;stack[0]=seed;labels[seed]=id;
  while(tail){const at=stack[--tail],x=at%w,y=Math.floor(at/w);b.size++;b.left=Math.min(b.left,x);b.right=Math.max(b.right,x);b.top=Math.min(b.top,y);b.bottom=Math.max(b.bottom,y);b.sumX+=x;b.sumY+=y;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx<0||nx>=w||ny<0||ny>=h)continue;const next=ny*w+nx;if(!labels[next]&&pixels[next*4+3]>160){labels[next]=id;stack[tail++]=next}}}groups.push(b);
 }
 const main=groups.slice().sort((a,b)=>b.size-a.size).slice(0,6);if(main.length!==6||main.some(b=>b.size<100))throw Error('Faltan cuadros completos');main.sort((a,b)=>a.sumY/a.size-b.sumY/b.size);const frames=[...main.slice(0,3).sort((a,b)=>a.sumX/a.size-b.sumX/b.size),...main.slice(3).sort((a,b)=>a.sumX/a.size-b.sumX/b.size)],owner=new Uint8Array(groups.length+1);
 frames.forEach((b,i)=>{owner[b.id]=i+1});for(const g of groups){if(owner[g.id])continue;let nearest=-1,best=Infinity;frames.forEach((b,i)=>{const dx=Math.max(b.left-g.right,g.left-b.right,0),dy=Math.max(b.top-g.bottom,g.top-b.bottom,0),distance=Math.hypot(dx,dy);if(distance<best){best=distance;nearest=i}});if(best<=Math.max(4,Math.min(w,h)*.012)&&g.size<frames[nearest].size*.08){owner[g.id]=nearest+1;const b=frames[nearest];b.left=Math.min(b.left,g.left);b.right=Math.max(b.right,g.right);b.top=Math.min(b.top,g.top);b.bottom=Math.max(b.bottom,g.bottom)}}
 const assigned=new Uint8Array(n);for(let i=0;i<n;i++)if(labels[i])assigned[i]=owner[labels[i]];
 // Retain the original antialias fringe without copying any neighbouring figure.
 for(let i=0;i<n;i++){if(labels[i]||pixels[i*4+3]===0)continue;const x=i%w,y=Math.floor(i/w);let found=0;for(let radius=1;radius<=2&&!found;radius++)for(let dy=-radius;dy<=radius&&!found;dy++)for(let dx=-radius;dx<=radius;dx++){const nx=x+dx,ny=y+dy;if(nx>=0&&nx<w&&ny>=0&&ny<h&&owner[labels[ny*w+nx]]){found=owner[labels[ny*w+nx]];break}}assigned[i]=found;}
 const flying=sheet.id==='vulture'||sheet.id==='ulti-bird';frames.forEach(b=>{b.left=Math.max(0,b.left-2);b.right=Math.min(w-1,b.right+2);b.top=Math.max(0,b.top-2);b.bottom=Math.min(h-1,b.bottom+2);b.w=b.right-b.left+1;b.h=b.bottom-b.top+1;b.headCount=0;b.headSumX=0;b.headSumY=0});
 for(let i=0;i<n;i++){const frame=assigned[i]-1;if(frame<0)continue;const b=frames[frame],x=i%w,y=Math.floor(i/w);if(y>b.top+b.h*(flying?.75:.42))continue;if(flying&&!(pixels[i*4]>120&&pixels[i*4+1]>100&&pixels[i*4+2]<pixels[i*4+1]*.9))continue;b.headCount++;b.headSumX+=x-b.left;b.headSumY+=y-b.top;}
 const median=values=>values.sort((a,b)=>a-b)[Math.floor(values.length/2)];frames.forEach(b=>{b.headX=b.headCount?b.headSumX/b.headCount:b.w/2;b.headY=b.headCount?b.headSumY/b.headCount:b.h*.35});const offsetX=median(frames.map(b=>b.headX-b.w/2)),offsetY=median(frames.map(b=>b.headY-b.h*.75)),cellW=Math.max(...frames.map(b=>b.w))+4,cellH=Math.max(...frames.map(b=>b.h))+4,packed=document.createElement('canvas');packed.width=cellW*3;packed.height=cellH*2;const output=packed.getContext('2d'),raster=output.createImageData(packed.width,packed.height);
 for(let i=0;i<n;i++){const frame=assigned[i]-1;if(frame<0)continue;const b=frames[frame],x=i%w-b.left,y=Math.floor(i/w)-b.top;if(x<0||x>=b.w||y<0||y>=b.h)continue;const dest=((Math.floor(frame/3)*cellH+2+y)*packed.width+(frame%3)*cellW+2+x)*4;for(let c=0;c<4;c++)raster.data[dest+c]=pixels[i*4+c]}
 output.putImageData(raster,0,0);sheet.height=Math.max(...frames.map(b=>b.h));sheet.frames=frames.map((b,i)=>({sx:i%3*cellW+2,sy:Math.floor(i/3)*cellH+2,w:b.w,h:b.h,localX:0,localY:0,anchorX:b.headX-offsetX,anchorY:flying?b.headY-offsetY:b.h}));sheet.image=packed;
},
paint(ctx,id,height,phase){const s=this.sheets[id];if(!s?.ready)return false;s.used=++this.clock;const f=s.frames[this.frame(phase)],scale=height/s.height;ctx.imageSmoothingEnabled=false;ctx.drawImage(s.image,f.sx,f.sy,f.w,f.h,(f.localX-f.anchorX)*scale,(f.localY-f.anchorY)*scale,f.w*scale,f.h*scale);return true},
draw(ctx,id,x,y,height,phase,flip=false){if(!this.sheets[id]?.ready)return false;ctx.save();ctx.translate(Math.round(x),Math.round(y));if(flip)ctx.scale(-1,1);const painted=this.paint(ctx,id,height,phase);ctx.restore();return painted},
flying(ctx,e,id){if(!this.sheets[id]?.ready){this.load(id);return false}ctx.save();ctx.fillStyle='#14203255';ctx.beginPath();ctx.ellipse(e.x,e.y+e.r*.6,e.r,4,0,0,Math.PI*2);ctx.fill();ctx.translate(Math.round(e.x),Math.round(e.y+e.r*.5));if(P.state.player.x<e.x)ctx.scale(-1,1);if(e.hit>0||e.ultiFlash>0)ctx.globalAlpha=.7;this.paint(ctx,id,id==='vulture'?48:54,P.state.elapsed*8*Math.PI/3);ctx.restore();return true}
};
