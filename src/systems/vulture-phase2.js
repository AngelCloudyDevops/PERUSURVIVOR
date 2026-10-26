'use strict';
// Forma II: atlas propio; ataques y efectos dependen solo del reloj de simulación.
P.VulturePhase2 = {
  entryDuration:1.3,
  entering(e){return !!e&&e.phase==='vulture-ultimate'&&(e.ultimateEntryTime??this.entryDuration)<this.entryDuration},
  smooth(v){v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)},
  featherMotion(t,reduced=false){
    if(reduced)return {spread:0,ruffle:0};
    return {spread:this.smooth((t-.12)/.46)*(1-this.smooth((t-.85)/.4)),ruffle:Math.sin(t*17)*.012*this.smooth(t/.2)};
  },
  warp(x,y,m){
    // La cabeza, las patas y el centro del pecho permanecen anclados.
    const wing=this.smooth((.68-x)/.25)*(1-this.smooth((y-.64)/.25));
    return {x:x-wing*m.spread*.065,y:y-wing*m.spread*.16+wing*m.ruffle*Math.sin(x*26+y*12)};
  },
  mesh(c,art,pose,x,y,scale,m,anchor){
    const f=art.frames[pose],px=anchor?f.x+f.w/2-(anchor.x+anchor.w/2-anchor.pivotX):f.pivotX,py=anchor?f.y+f.h-(anchor.y+anchor.h-anchor.pivotY):f.pivotY;
    const point=(u,v)=>{const p=this.warp(u,v,m),head=this.smooth((u-.55)/.23)*(1-this.smooth((v-.5)/.35));return {x:x+(f.x-px+p.x*f.w+(m.headX||0)*head)*scale,y:y+(f.y-py+p.y*f.h+(m.headY||0)*head)*scale,u:f.x+u*f.w,v:f.y+v*f.h}};
    const triangle=(a,b,d)=>{
      const den=(b.u-a.u)*(d.v-a.v)-(d.u-a.u)*(b.v-a.v),aa=((b.x-a.x)*(d.v-a.v)-(d.x-a.x)*(b.v-a.v))/den,bb=((b.y-a.y)*(d.v-a.v)-(d.y-a.y)*(b.v-a.v))/den,cc=((d.x-a.x)*(b.u-a.u)-(b.x-a.x)*(d.u-a.u))/den,dd=((d.y-a.y)*(b.u-a.u)-(b.y-a.y)*(d.u-a.u))/den;
      c.save();c.beginPath();const mx=(a.x+b.x+d.x)/3,my=(a.y+b.y+d.y)/3;
      for(const [i,p] of [a,b,d].entries()){const dx=p.x-mx,dy=p.y-my,len=Math.hypot(dx,dy)||1,xx=p.x+dx/len*.35,yy=p.y+dy/len*.35;if(i)c.lineTo(xx,yy);else c.moveTo(xx,yy)}
      c.closePath();c.clip();c.transform(aa,bb,cc,dd,a.x-aa*a.u-cc*a.v,a.y-bb*a.u-dd*a.v);c.drawImage(art.surface,f.x,f.y,f.w,f.h,f.x,f.y,f.w,f.h);c.restore();
    };
    c.imageSmoothingEnabled=false;
    for(let row=0;row<8;row++)for(let col=0;col<12;col++){const a=point(col/12,row/8),b=point((col+1)/12,row/8),d=point(col/12,(row+1)/8),e=point((col+1)/12,(row+1)/8);triangle(a,b,d);triangle(b,e,d)}
  },
  transformation(t,reduced=false){
    return {reveal:this.smooth((t-1.95)/.92),spread:reduced?0:this.smooth((t-1.7)/.65)*.7,aura:this.smooth((t-1.75)/.8),bolts:this.smooth((t-2.15)/.65)};
  },
  transformBird(c,g,t,reduced){
    if(P.VultureRig?.ready)return P.VultureRig.draw(c,g.baseX,g.baseY,g.rigHeight||g.h,t,false,reduced);
    // Fallback de una sola figura: tampoco funde dos atlas si falla el rig.
    this.mesh(c,P.VultureStrike,0,g.baseX,g.baseY,g.scale,this.featherMotion(t,reduced));
  },
  ready:false, failed:false, frames:[],
  init(){
    if(this.started||typeof Image==='undefined')return;
    this.started=true;const image=new Image();
    image.onload=()=>{try{
      const cv=document.createElement('canvas');cv.width=image.width;cv.height=image.height;
      const c=cv.getContext('2d');c.drawImage(image,0,0);const raster=c.getImageData(0,0,cv.width,cv.height);
      for(let i=3;i<raster.data.length;i+=4)raster.data[i]=raster.data[i]<150?0:255;
      c.putImageData(raster,0,0);this.surface=cv;this.height=cv.height/2;
      for(let row=0;row<2;row++)for(let col=0;col<4;col++){
        const x0=Math.round(col*cv.width/4),x1=Math.round((col+1)*cv.width/4),y0=Math.round(row*cv.height/2),y1=Math.round((row+1)*cv.height/2);
        this.frames.push({...P.BossArt.mainBounds(raster.data,cv.width,x0,y0,x1,y1),pivotX:(x0+x1)/2,pivotY:y0+this.height*.94});
      }
      const f=this.frames[0];let sx=0,sy=0,n=0;
      for(let y=f.y;y<f.y+f.h*.5;y++)for(let x=Math.round(f.x+f.w*.65);x<f.x+f.w*.92;x++){const i=(y*cv.width+x)*4;if(raster.data[i]>190&&raster.data[i+1]>160&&raster.data[i+2]<65&&raster.data[i+3]>150){sx+=x;sy+=y;n++}}
      if(n)this.eye={x:sx/n,y:sy/n};
      this.ready=true;
    }catch{this.failed=true}};
    image.onerror=()=>{this.failed=true};image.src='assets/bosses/gallinazo-phase2-v1.webp';
  },
  paint(c,x,y,height,pose=0,flip=false,angle=0){
    if(!this.ready)return false;const f=this.frames[pose],scale=height/this.height;
    c.save();c.imageSmoothingEnabled=false;c.translate(x,y);if(flip)c.scale(-1,1);c.rotate(angle);
    c.drawImage(this.surface,f.x,f.y,f.w,f.h,(f.x-f.pivotX)*scale,(f.y-f.pivotY)*scale,f.w*scale,f.h*scale);c.restore();return true;
  },
  electricity(c,x,y,r,t,strength=1,reduced=false){
    c.save();c.translate(x,y);c.globalAlpha*=strength;
    for(let i=0;i<7;i++){
      const a=i*2.399+(reduced?0:t*.65),px=Math.cos(a)*r*.8,py=Math.sin(a)*r*.42;
      c.strokeStyle='#21102f';c.lineWidth=9;c.beginPath();c.moveTo(px,py);
      for(let j=1;j<6;j++)c.lineTo(px+Math.cos(a)*r*j*.12+Math.sin(j*3+i+(reduced?0:Math.floor(t*12)))*r*.09,py-j*r*.12);
      c.stroke();c.strokeStyle='#8254b9';c.lineWidth=4;c.stroke();c.strokeStyle='#dfc4ff';c.lineWidth=1;c.stroke();
    }
    c.restore();
  },
  aura(c,e){
    if(!e.chaosForm||e.hp<=0)return;const t=P.state.elapsed,reduced=P.Vulture.reduced();
    const g={x:e.x-115,y:e.y-195,w:230,h:215};
    P.VultureScene.ribbons(c,g,reduced?0:t,.6,false);
    this.electricity(c,e.x,e.y-75,90,t,reduced?.3:.6,reduced);
  },
  plan(e,attack){
    const s=P.state,p=s.player,angle=Math.atan2(p.y-e.y,p.x-e.x);
    e.phase='vulture-chaos-charge';e.chaosAttack=attack;e.chaosTime=0;e.chaosFired=0;e.aim=angle;e.dx=Math.cos(angle);e.dy=Math.sin(angle);
    e.chaosTargets=[];
    if(attack==='storm')for(let i=0;i<3;i++){
      const side=i===0?0:i===1?-1:1,x=p.x+Math.cos(angle+Math.PI/2)*side*115,y=p.y+Math.sin(angle+Math.PI/2)*side*115,b=s.encounter.scene.bounds;
      const q={x:Math.max(b.left+55,Math.min(b.right-55,x)),y:Math.max(b.top+55,Math.min(b.bottom-55,y))};
      if(!P.Terrain.hit(q.x,q.y,48))e.chaosTargets.push(q);
    }
    P.Audio.play('flap');
  },
  fire(e,index){
    const s=P.state;
    if(e.chaosAttack==='storm'){
      const q=e.chaosTargets[index];if(q&&s.danger.length<70)s.danger.push({...q,vx:0,vy:0,age:0,history:[],life:.22,kind:'stomp',glyph:'CHAOS_LIGHTNING',radius:46,damage:18,color:'#bc8df1'});
    }else{
      for(let i=0;i<9&&s.danger.length<70;i++){
        const a=e.aim+(i-4)*.18+(index? .12:-.12),speed=210;
        s.danger.push({x:e.x,y:e.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,age:0,life:3,history:[],kind:'zigzag',glyph:'FEATHER',chaosFeather:true,heavyFeather:false,damage:14,color:'#bc8df1'});
      }
    }
    P.Audio.play(index?'flap':'stamp');
  },
  step(e,dt){
    e.chaosTime+=dt;e.hit=Math.max(0,(e.hit||0)-dt);P.Vulture.tickVisuals(e,dt);
    const count=e.chaosAttack==='storm'?e.chaosTargets.length:2,spacing=e.chaosAttack==='storm'?.18:.42;
    while(e.chaosFired<count&&e.chaosTime>=1.1+e.chaosFired*spacing){this.fire(e,e.chaosFired);e.chaosFired++}
    if(e.chaosTime>=1.1+Math.max(0,count-1)*spacing+.75){e.phase='approach';e.attackT=1.4;e.chaosTargets=[]}
  },
  ground(c,e){
    if(e.phase!=='vulture-chaos-charge')return;const t=e.chaosTime;
    c.save();c.lineWidth=3;
    if(e.chaosAttack==='storm')for(let i=0;i<e.chaosTargets.length;i++){
      const q=e.chaosTargets[i],until=1.1+i*.18-t;
      if(until<-.3)continue;
      c.fillStyle=until>0?'#9760c833':'#dfbaff66';c.strokeStyle='#ddb3ff';c.beginPath();c.arc(q.x,q.y,46,0,Math.PI*2);c.fill();c.stroke();
      if(until>0){c.beginPath();c.arc(q.x,q.y,46*Math.max(0,until/1.46),0,Math.PI*2);c.stroke()}
      c.fillStyle='#f4d9ff';c.fillRect(q.x-2,q.y-10,4,20);c.fillRect(q.x-10,q.y-2,20,4);
    }
    else if(t<1.52){c.translate(e.x,e.y);c.rotate(e.aim);c.fillStyle='#9760c822';c.strokeStyle='#ddb3ff';c.beginPath();c.moveTo(0,0);c.arc(0,0,320,-.92,.92);c.closePath();c.fill();c.stroke()}
    c.restore();
    c.save();c.textAlign='center';c.fillStyle='#f0d5ff';c.font='bold 12px monospace';c.fillText(e.chaosAttack==='storm'?'¡TORMENTA DE AZOTEA! · SAL DE LOS CÍRCULOS':'¡PLUMAS SERPIENTE! · BUSCA COBERTURA',e.x,e.y+80);c.restore();
  },
  lightning(c,s){
    if(s.glyph!=='CHAOS_LIGHTNING')return false;
    c.save();c.globalAlpha=Math.max(0,s.life/.22);this.electricity(c,s.x,s.y,75,s.age,1,P.Vulture.reduced());
    c.strokeStyle='#e9d0ff';c.lineWidth=3;c.beginPath();c.ellipse(s.x,s.y,46,16,0,0,Math.PI*2);c.stroke();c.restore();return true;
  },
  card(c,w,h,t,reduced){
    if(t<0||t>=this.entryDuration)return;
    const box=P.UltimateComic?.layout(w,h)||{w:w*.4,h:h*.82,y:h*.08},pw=box.w,ph=box.h;
    const slide=reduced?0:t<.16?-pw*(1-this.smooth(t/.16)):t>1.02?-pw*this.smooth((t-1.02)/.28):0;
    c.save();c.translate(slide,box.y);c.beginPath();c.moveTo(0,0);c.lineTo(pw,0);c.lineTo(pw*.72,ph);c.lineTo(0,ph);c.closePath();c.clip();
    c.fillStyle='#100b1c';c.fillRect(0,0,pw,ph);
    for(let i=0;i<24;i++){const y=(i*31+(reduced?0:t*180))%ph;c.fillStyle=i%2?'#372345':'#5a386c';c.fillRect(0,y,pw,2)}
    const art=P.VultureStrike;if(art.ready){const f=art.frames[2],scale=Math.min(pw*.78/f.w,ph*.55/f.h);this.mesh(c,art,2,pw*.4,ph*.65,scale,this.featherMotion(t,reduced))}
    c.strokeStyle='#c99ae5';c.lineWidth=6;c.beginPath();c.moveTo(pw-3,0);c.lineTo(pw*.72-3,ph);c.stroke();
    c.textAlign='center';c.strokeStyle='#12091d';c.fillStyle='#f1d8ff';c.lineWidth=5;c.font='900 '+Math.max(17,Math.min(34,pw*.075))+'px monospace';
    for(const [word,y] of [['¡BAJO MIS',.76],['ALAS!',.84]]){c.strokeText(word,pw*.4,ph*y);c.fillText(word,pw*.4,ph*y)}
    c.font='bold '+Math.max(10,Math.min(14,pw*.03))+'px monospace';c.fillStyle='#b88ed5';c.fillText('GALLINAZO DEL CAOS',pw*.39,ph*.94);c.restore();
  }
};
{
  const F=P.VulturePhase2,I=P.VultureImpact,scene=P.VultureScene,init=scene.init,pending=scene.pending,bird=scene.bird,move=P.Vulture.move,warn=P.Vulture.warn,draw=P.Vulture.draw,ground=P.Vulture.ground,projectile=P.FX.projectile;
  scene.init=function(){F.init();return init.call(this)};
  scene.pending=()=>pending()||typeof Image!=='undefined'&&!F.ready&&!F.failed;
  // Reemplaza la tarjeta anterior, sin superponer dos paneles.
  I.card=()=>{};
  I.phaseAura=(c,e)=>F.aura(c,e);
  scene.bird=function(c,g,m,t,reduced){
    if(t<1.7||!F.ready)return bird.call(this,c,g,m,t,reduced);
    if(t<2.96)return F.transformBird(c,g,t,reduced);
    const root=P.VultureStrike.root(t,reduced),height=g.scale*F.height;
    F.paint(c,g.baseX,g.baseY+root.y*g.h,height,P.VultureStrike.pose(t,reduced),false,root.angle);
    F.electricity(c,g.baseX,g.baseY-g.h*.45,g.w*.3,t,reduced?.25:.75,reduced);
  };
  P.Vulture.warn=function(e,attack,delay){if(e.chaosForm&&(attack==='feathers'||attack==='summon'))return F.plan(e,attack==='summon'?'storm':'rake');return warn.call(this,e,attack,delay)};
  P.Vulture.move=function(e,dt){if(e.phase==='vulture-chaos-charge')return F.step(e,dt);return move.call(this,e,dt)};
  P.Vulture.draw=function(c,e){
    if(!e.chaosForm||!F.ready||e.phase==='vulture-defeat')return draw.call(this,c,e);
    if(e.phase==='vulture-ultimate')I.telegraph(c,e);
    let pose=e.phase==='vulture-chaos-charge'?(e.chaosTime<1.1?4:6):e.phase==='vulture-dive'?6:e.phase==='vulture-warning'?3:e.phase==='vulture-recover'?7:0;
    if(e.phase==='vulture-ultimate')pose=e.ultimateGrace>0?7:e.wavePulse>0?6:0;
    return F.paint(c,e.x,e.y+e.r*.5,235,pose,e.dx<0);
  };
  P.Vulture.ground=function(c){ground.call(this,c);const e=P.VultureUltimate.boss();if(e)F.ground(c,e)};
  P.FX.projectile=function(c,s){if(!F.lightning(c,s))return projectile.call(this,c,s)};
}
{
  const F=P.VulturePhase2,u=P.VultureUltimate,start=u.start,tick=u.introTick,overlay=u.overlay;
  u.start=function(e,...args){const ok=start.call(this,e,...args);if(ok)e.ultimateEntryTime=0;return ok};
  u.introTick=function(dt){const e=this.boss();if(F.entering(e)){if(P.state.mode!=='play')return false;e.ultimateEntryTime=Math.min(F.entryDuration,e.ultimateEntryTime+dt);return true}return tick.call(this,dt)};
  u.overlay=function(){const e=this.boss();if(F.entering(e)){document.body.classList.remove('vulture-cinematic');F.card(P.Core.ctx,P.Core.width,P.Core.height,e.ultimateEntryTime,P.Vulture.reduced());return}return overlay.call(this)};
}
