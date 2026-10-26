'use strict';
// Una escena continua: el mismo cuerpo se articula sobre una azotea visible.
P.VultureScene={
init(){if(this.started||typeof Image==='undefined')return;this.started=true;const image=new Image();image.onload=()=>{this.background=image;this.ready=true};image.onerror=()=>{this.started=false};image.src='assets/arenas/gallinazo-lima-cinematic-v1.webp'},
smooth(v){v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)},
motion(t,reduced=false){if(reduced)return {spread:1,cry:1,crouch:0,wind:0,impact:0};return {spread:this.smooth((t-.75)/1.5),cry:this.smooth((t-.85)/.55),crouch:Math.sin(this.smooth(t/.9)*Math.PI)*.055,wind:this.smooth((t-1.35)/.8),impact:this.smooth((t-2.15)/.25)}},
warp(x,y,m){const wing=(1-this.smooth((y-.42)/.32)),side=x<.54?-1:1,fold=1-m.spread,head=this.smooth((x-.62)/.12)*(1-this.smooth((y-.65)/.12));return {x:x+(x-.54)*wing*fold*-.62+head*(1-m.cry)*-.025,y:y+wing*fold*.25+m.crouch*(1-y)+head*(1-m.cry)*-.045+(side<0?1:-1)*wing*Math.sin(m.spread*Math.PI)*.025}},
bird(c,w,h,t,reduced){const u=P.VultureUltimate,f=u.frames[5],m=this.motion(t,reduced),dh=h*.75,dw=dh*f.w/f.h,ox=w*.64-dw/2,oy=h*.84-dh,cols=10,rows=8,point=(x,y)=>{const p=this.warp(x,y,m);return {x:ox+p.x*dw,y:oy+p.y*dh,u:f.x+x*f.w,v:f.y+y*f.h}};
const triangle=(a,b,d)=>{const den=(b.u-a.u)*(d.v-a.v)-(d.u-a.u)*(b.v-a.v),aa=((b.x-a.x)*(d.v-a.v)-(d.x-a.x)*(b.v-a.v))/den,bb=((b.y-a.y)*(d.v-a.v)-(d.y-a.y)*(b.v-a.v))/den,cc=((d.x-a.x)*(b.u-a.u)-(b.x-a.x)*(d.u-a.u))/den,dd=((d.y-a.y)*(b.u-a.u)-(b.y-a.y)*(d.u-a.u))/den,mx=(a.x+b.x+d.x)/3,my=(a.y+b.y+d.y)/3;c.save();c.beginPath();for(const [i,p] of [a,b,d].entries()){const vx=p.x-mx,vy=p.y-my,len=Math.hypot(vx,vy)||1,x=p.x+vx/len*.35,y=p.y+vy/len*.35;if(i)c.lineTo(x,y);else c.moveTo(x,y)}c.closePath();c.clip();c.transform(aa,bb,cc,dd,a.x-aa*a.u-cc*a.v,a.y-bb*a.u-dd*a.v);c.drawImage(u.surface,f.x,f.y,f.w,f.h,f.x,f.y,f.w,f.h);c.restore()};
for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const a=point(x/cols,y/rows),b=point((x+1)/cols,y/rows),d=point(x/cols,(y+1)/rows),e=point((x+1)/cols,(y+1)/rows);triangle(a,b,d);triangle(b,e,d)}},
weather(c,w,h,t,m){c.save();c.strokeStyle='#d9dce555';c.lineWidth=1;for(let i=0;i<36;i++){const x=(i*71+t*17)%w,y=(i*43+t*35)%h;c.beginPath();c.moveTo(x,y);c.lineTo(x-2,y+5);c.stroke()}
// El grito levanta una bandada que sale del horizonte hacia el cielo.
if(t>1.1){const q=this.smooth((t-1.1)/1.6);c.globalAlpha=Math.min(1,(t-1.1)*4);const u=P.VultureUltimate,f=u.frames[1+Math.floor(t*6)%2];for(let i=0;i<10;i++){const x=w*(.15+i*.065)+Math.sin(i*2.1)*q*w*.18,y=h*(.38-(i%3)*.025)-q*h*(.2+(i%4)*.035),size=9+(i%3)*3;c.drawImage(u.surface,f.x,f.y,f.w,f.h,x,y,size*f.w/f.h,size)}}
c.globalAlpha=1;
// El polvo nace bajo las alas, en el suelo; las plumas siguen el mismo impulso.
if(m.wind>0)for(let i=0;i<24;i++){const side=i%2?1:-1,q=((t-1.35)*.65+i*.037)%1,x=w*.64+side*q*w*.44,y=h*.84-Math.sin(q*Math.PI)*h*.06+(i%3)*2;c.globalAlpha=(1-q)*m.wind*.55;c.fillStyle=i%3?'#cbbda8':'#958b7c';const size=2+q*8;c.fillRect(x,y,size*2,size)}
if(m.impact>0)for(let i=0;i<16;i++){const a=i*2.399,q=Math.max(0,t-2.15),x=w*.64+Math.cos(a)*q*w*.4,y=h*.42+Math.sin(a)*q*h*.35;c.save();c.globalAlpha=Math.min(1,q*6);c.translate(x,y);c.rotate(a+q);c.fillStyle='#202a3e';c.fillRect(-2,-7,4,14);c.fillStyle='#a4a8b2';c.fillRect(0,-6,1,12);c.restore()}
c.restore()},
impact(c,w,h,t,reduced){if(reduced||t<2.2)return;const q=this.smooth((t-2.2)/.35);c.save();c.globalAlpha=(1-this.smooth((t-2.65)/.3))*.8;c.strokeStyle='#f0ddaa';c.lineWidth=2;
// Grietas desde ambos puntos de contacto de las alas con el borde, no desde el centro.
for(const side of [-1,1]){const x=side<0?w*.12:w*.96,y=h*.2;c.beginPath();c.moveTo(x,y);c.lineTo(x-side*q*w*.08,y+q*h*.05);c.lineTo(x-side*q*w*.12,y-q*h*.09);c.lineTo(x-side*q*w*.19,y-q*h*.13);c.stroke();for(let i=0;i<5;i++){c.fillStyle=i%2?'#d3c3a2':'#526075';c.fillRect(x+side*q*(20+i*9),y+q*(i*15-30),3+i,2+i)}}c.restore()},
draw(ctx,width,height,e){const reduced=P.Vulture.reduced(),t=e.ultimateTime,cv=this.canvas||(this.canvas=document.createElement('canvas')),w=Math.ceil(width/2),h=Math.ceil(height/2);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h}const c=cv.getContext('2d'),m=this.motion(t,reduced),fade=reduced?1:1-this.smooth((t-2.75)/.25);c.clearRect(0,0,w,h);c.imageSmoothingEnabled=false;c.fillStyle='#858095';c.fillRect(0,0,w,h);
const bg=this.background||P.Vulture.roof;if(bg){const z=reduced?1:1+this.smooth(t/3)*.025;c.drawImage(bg,0,0,bg.width,bg.height,-w*(z-1)*.35,-h*(z-1)*.3,w*z,h*z)}
// Un primer plano breve del ojo se retira suavemente y deja ver la misma escena.
if(t<1.05&&P.VultureUltimate.comicReady){const image=P.VultureUltimate.comicImage,alpha=reduced?0:1-this.smooth((t-.45)/.6);c.save();c.globalAlpha=alpha*.94;const iw=image.width/2;c.drawImage(image,iw*.4,image.height*.26,iw*.38,image.height*.34,w*.035,h*.16,w*.34,h*.23);c.restore()}
c.fillStyle='#20263155';c.beginPath();c.ellipse(w*.64,h*.85,w*.13,h*.025,0,0,Math.PI*2);c.fill();if(!reduced)this.weather(c,w,h,t,m);this.bird(c,w,h,t,reduced);this.impact(c,w,h,t,reduced);
// Antenas cercanas responden a la ráfaga; quedan fuera de la silueta del jefe.
if(!reduced&&m.wind>0){c.strokeStyle='#242731';c.lineWidth=2;for(const x of [w*.025,w*.98]){const sway=Math.sin((t-1.35)*12)*m.wind*3;c.beginPath();c.moveTo(x,h*.75);c.lineTo(x+sway,h*.13);c.moveTo(x-8+sway,h*.18);c.lineTo(x+10+sway,h*.18);c.moveTo(x-9+sway,h*.23);c.lineTo(x+12+sway,h*.23);c.stroke()}}
c.fillStyle='#101827dd';c.fillRect(0,h*.9,w,h*.1);c.fillStyle='#ffe4a4';c.font='bold '+Math.max(9,Math.min(18,w*.032))+'px monospace';c.textAlign='left';c.fillText(t<1.4?'TE ESTOY VIENDO…':'¡LIMA BAJO MIS ALAS!',w*.04,h*.962);ctx.save();ctx.globalAlpha=fade;ctx.imageSmoothingEnabled=false;ctx.drawImage(cv,0,0,width,height);ctx.restore()}
};
{const init=P.VultureUltimate.initComic;P.VultureUltimate.initComic=function(){P.VultureScene.init();return init.call(this)};P.VultureUltimate.fullscreen=function(ctx,w,h,e){P.VultureScene.draw(ctx,w,h,e)}}
