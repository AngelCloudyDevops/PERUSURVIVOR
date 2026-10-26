'use strict';
P.$=s=>document.querySelector(s);
P.state={mode:'menu',chosen:0,player:null,enemies:[],shots:[],fields:[],danger:[],gems:[],effects:[],elapsed:0,spawn:0,fire:0,kills:0,level:1,xp:0,need:6,bossSpawned:false,enemySerial:0};
P.Core=(()=>{
const canvas=P.$('#game'),ctx=canvas.getContext('2d'),keys={};let width,height,touch=null;
function resize(){width=innerWidth;height=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=width*d;canvas.height=height*d;ctx.setTransform(d,0,0,d,0,0);ctx.imageSmoothingEnabled=false}
function release(){touch=null;P.$('#stick').hidden=true}
function direction(){if(touch)return {x:touch.dx,y:touch.dy};return {x:(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),y:(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)}}
function clear(){Object.keys(keys).forEach(k=>delete keys[k]);release()}
addEventListener('resize',resize);resize();
addEventListener('keydown',e=>{if(!e.repeat&&['1','2','3'].includes(e.key)&&!['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName)&&!e.target?.isContentEditable&&P.UI?.chooseUpgrade(Number(e.key)-1)){e.preventDefault();return}if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys[e.key.toLowerCase()]=true;if(e.key==='Escape'&&!e.repeat)P.UI.pause();if(e.key.toLowerCase()==='e'&&!e.repeat)P.Encounters.offer()});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
addEventListener('blur',()=>{clear();if(P.state.mode==='play')P.UI.pause()});
canvas.addEventListener('pointerdown',e=>{if(P.state.mode!=='play'||touch)return;touch={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,dy:0};canvas.setPointerCapture(e.pointerId);const stick=P.$('#stick');stick.hidden=false;stick.style.left=(e.clientX-50)+'px';stick.style.top=(e.clientY-50)+'px';P.$('#stick i').style.transform='translate(0,0)'});
canvas.addEventListener('pointermove',e=>{if(!touch||touch.id!==e.pointerId)return;let x=e.clientX-touch.x,y=e.clientY-touch.y,d=Math.max(40,Math.hypot(x,y));touch.dx=x/d;touch.dy=y/d;P.$('#stick i').style.transform='translate('+(touch.dx*30)+'px,'+(touch.dy*30)+'px)'});
for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,e=>{if(touch&&e.pointerId===touch.id)release()});
return {canvas,ctx,keys,direction,clear,release,get width(){return width},get height(){return height},clock:s=>Math.floor(s/60).toString().padStart(2,'0')+':'+Math.floor(s%60).toString().padStart(2,'0')};
})();
P.Save={best:0,read(){try{this.best=Number(localStorage.getItem('causas-best'))||0}catch{}},write(kills){this.best=Math.max(this.best,kills);try{localStorage.setItem('causas-best',this.best)}catch{}}};P.Save.read();