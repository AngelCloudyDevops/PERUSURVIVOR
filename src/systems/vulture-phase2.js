'use strict';
// Forma II: atlas propio; ataques y efectos dependen solo del reloj de simulación.
P.VulturePhase2 = {
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
    if(t<0||t>1.22)return;
    const box=P.UltimateComic?.layout(w,h)||{w:w*.4,h:h*.82,y:h*.08},pw=box.w,ph=box.h;
    const slide=reduced?0:t<.16?-pw*(1-P.VultureImpact.smooth(t/.16)):t>.96?-pw*P.VultureImpact.smooth((t-.96)/.26):0;
    c.save();c.translate(slide,box.y);c.beginPath();c.moveTo(0,0);c.lineTo(pw,0);c.lineTo(pw*.72,ph);c.lineTo(0,ph);c.closePath();c.clip();
    c.fillStyle='#100b1c';c.fillRect(0,0,pw,ph);
    for(let i=0;i<24;i++){const y=(i*31+(reduced?0:t*180))%ph;c.fillStyle=i%2?'#372345':'#5a386c';c.fillRect(0,y,pw,2)}
    this.electricity(c,pw*.43,ph*.44,pw*.31,t,reduced?.25:.65,reduced);
    this.paint(c,pw*.43,ph*.64,ph*.61,t<.4?0:t<.7?2:4,false,reduced?0:-.035);
    c.strokeStyle='#c99ae5';c.lineWidth=6;c.beginPath();c.moveTo(pw-3,0);c.lineTo(pw*.72-3,ph);c.stroke();
    c.textAlign='center';c.strokeStyle='#12091d';c.fillStyle='#f1d8ff';c.lineWidth=5;c.font='900 '+Math.max(17,Math.min(34,pw*.075))+'px monospace';
    for(const [word,y] of [['¡BAJO MIS',.76],['ALAS!',.84]]){c.strokeText(word,pw*.4,ph*y);c.fillText(word,pw*.4,ph*y)}
    c.font='bold '+Math.max(10,Math.min(14,pw*.03))+'px monospace';c.fillStyle='#b88ed5';c.fillText('FASE II · GALLINAZO',pw*.39,ph*.94);c.restore();
  }
};
{
  const F=P.VulturePhase2,I=P.VultureImpact,scene=P.VultureScene,init=scene.init,pending=scene.pending,bird=scene.bird,move=P.Vulture.move,warn=P.Vulture.warn,draw=P.Vulture.draw,ground=P.Vulture.ground,projectile=P.FX.projectile;
  scene.init=function(){F.init();return init.call(this)};
  scene.pending=()=>pending()||typeof Image!=='undefined'&&!F.ready&&!F.failed;
  // Reemplaza la tarjeta anterior, sin superponer dos paneles.
  I.card=(...args)=>F.card(...args);
  I.phaseAura=(c,e)=>F.aura(c,e);
  scene.bird=function(c,g,m,t,reduced){
    if(t<2.65||!F.ready)return bird.call(this,c,g,m,t,reduced);
    const root=P.VultureStrike.root(t,reduced),height=g.h/g.f.h*P.VultureStrike.height;
    F.paint(c,g.baseX+root.x*g.w,g.baseY+root.y*g.h,height,P.VultureStrike.pose(t,reduced),false,root.angle);
    F.electricity(c,g.baseX,g.baseY-g.h*.45,g.w*.3,t,Math.min(1,(t-2.65)/.2),reduced);
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
