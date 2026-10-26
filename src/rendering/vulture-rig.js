'use strict';
P.VultureRig={
  ready:false,failed:false,parts:[],title:'¡BAJO MIS ALAS!',
  init(){
    if(this.started||typeof Image==='undefined')return;this.started=true;
    const image=new Image();image.onload=()=>{try{
      const cv=document.createElement('canvas');cv.width=image.width;cv.height=image.height;const c=cv.getContext('2d');c.drawImage(image,0,0);
      const r=c.getImageData(0,0,cv.width,cv.height);for(let i=3;i<r.data.length;i+=4)r.data[i]=r.data[i]<150?0:255;c.putImageData(r,0,0);
      this.surface=cv;for(let row=0;row<2;row++)for(let col=0;col<4;col++)this.parts.push(P.BossArt.mainBounds(r.data,cv.width,col*cv.width/4,row*cv.height/2,(col+1)*cv.width/4,(row+1)*cv.height/2));this.ready=true;
    }catch{this.failed=true}};image.onerror=()=>{this.failed=true};image.src='assets/bosses/gallinazo-rig-v1.webp';
  },
  smooth(v){v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)},
  motion(t,card=false,reduced=false){
    if(reduced)return {near:-.45,far:-.2,jaw:0,head:0,phase:card?0:1,ruffle:0};
    const open=card?this.smooth((t-.08)/.4)*(1-this.smooth((t-.85)/.35)):this.smooth((t-1.25)/1.3),strike=card?0:this.smooth((t-2.95)/.2)*(1-this.smooth((t-3.35)/.4)),roar=card?this.smooth((t-.35)/.16)*(1-this.smooth((t-.88)/.2)):this.smooth((t-2.05)/.25)*(1-this.smooth((t-2.9)/.18));
    return {near:-.68+open*1.38-strike*1.25,far:-.25+open*1.75-strike*1.2,jaw:roar*.34,head:-roar*.08,phase:card?0:this.smooth((t-1.65)/1.05),ruffle:open*Math.sin(t*12)*.035};
  },
  part(c,id,x,y,w,px,py,angle=0,sx=1,sy=1){
    const f=this.parts[id],h=w*f.h/f.w;c.save();c.translate(x,y);c.rotate(angle);c.scale(sx,sy);c.drawImage(this.surface,f.x,f.y,f.w,f.h,-w*px,-h*py,w,h);c.restore();
  },
  wing(c,id,x,y,w,angle,m,far=false){
    c.save();c.translate(x,y);c.rotate(angle);
    // Las primarias se abren desde sus propios cañones; siempre opacas.
    if(m.phase>0)for(let i=0;i<6;i++){
      const fold=(1-m.phase)*.65,fan=(i-2.5)*(.05+m.phase*.12)+m.ruffle*Math.sin(i*1.4);
      this.part(c,6,-w*(.42+i*.045),w*(.08+i*.027),w*.28,.97,.5,fan+fold,1,.35+m.phase*.65);
    }
    this.part(c,id,0,0,w,.91,.35,0,1,far?.86:1);
    c.restore();
  },
  arenaMotion(e,reduced=false){
    if(e.phase==='vulture-ultimate'){
      const m=this.motion(Math.min(4,e.ultimateTime||0),false,reduced);
      if(e.ultimateTime>=4&&e.ultimateGrace<=0){m.near-=(e.wavePulse||0)*2.4;m.far-=(e.wavePulse||0)*1.8}
      return m;
    }
    const m={near:-.6,far:-.25,jaw:0,head:0,phase:1,ruffle:0};
    if(!reduced&&e.phase==='vulture-chaos-charge'){
      const open=this.smooth((e.chaosTime||0)/1.1),strike=this.smooth(((e.chaosTime||0)-1.1)/.28);
      m.near+=open*1.3-strike*.85;m.far+=open*1.7-strike*.8;m.jaw=(1-strike)*open*.3;
    }
    if(e.phase==='vulture-dive'){m.near=-.9;m.far=-.55}
    return m;
  },
  draw(c,x,y,h,t,card=false,reduced=false,pose){
    if(!this.ready)return false;const m=pose||this.motion(t,card,reduced);
    c.save();c.imageSmoothingEnabled=false;c.translate(x,y);
    // Torso y patas nunca reciben traslación, escala de pulso ni interpolación.
    this.wing(c,4,h*.12,-h*.5,h*.59,m.far,m,true);
    // La lámina del torso incluía un ala plegada: limitarla al pecho evita
    // que parezca una tercera ala al levantar las dos piezas articuladas.
    const torso=()=>{c.save();c.beginPath();c.moveTo(h*.32,-h*.55);c.lineTo(-h*.16,-h*.46);for(const [xx,yy] of [[-.2,-.4],[-.16,-.36],[-.2,-.3],[-.15,-.25],[-.19,-.19],[-.14,-.13],[-.18,-.09],[-.15,-.05],[-.16,.04]])c.lineTo(h*xx,h*yy);c.lineTo(h*.32,h*.04);c.closePath();c.clip();this.part(c,0,0,0,h*.62,.58,1);c.restore();};
    if(m.tuck>0){c.save();c.beginPath();c.rect(-h,-h,h*2,h*.84);c.clip();torso();c.restore();c.save();c.translate(0,-h*.08*m.tuck);c.beginPath();c.rect(-h,-h*.16,h*2,h*.2);c.clip();torso();c.restore()}else torso();
    this.part(c,7,h*.23,-h*.34,h*(.21+m.phase*.03),.55,.7,-.07*m.phase,1,.65+m.phase*.35);
    if(m.phase>0)this.part(c,5,h*.23,-h*.48,h*.18,.5,1,-1.1*(1-m.phase),1,.15+m.phase*.85);
    this.wing(c,3,h*.035,-h*.46,h*.72,m.near,m);
    c.save();c.translate(h*.23,-h*.4);c.rotate(m.head);
    this.part(c,1,0,0,h*.33,.27,.82);
    // La pieza ya tiene curvatura de pico abierto: un giro pequeño basta.
    if(m.jaw>0)this.part(c,2,h*.14,-h*.085,h*.102,.04,.25,-.12+m.jaw,1,.35+.65*m.jaw/.34);
    c.restore();c.restore();return true;
  },
  eye(g){const h=g.rigHeight;return {x:g.baseX+h*.23+h*.33*(.69-.27),y:g.baseY-h*.4-h*.33*(.82-.28)*254/347}},
  cardLayout(w,h){const base=P.UltimateComic?.layout(w,h)||{w:w*.4,h:h*.82,y:h*.08},cw=w<640?w*.58:base.w,ch=Math.min(base.h,cw*1.55),box={w:cw,h:ch,y:base.y};return {...box,px:cw*.46,py:ch*.62,birdHeight:Math.min(ch*.5,cw*.66),titleX:cw*.34}},
  cardEnvelope(t,reduced=false){return {slide:reduced?0:t<.14?-(1-this.smooth(t/.14)):t>1.04?-this.smooth((t-1.04)/.26):0,kick:reduced?0:Math.sin(Math.min(1,Math.max(0,(t-.32)/.19))*Math.PI)*.065,burst:reduced?0:this.smooth((t-.35)/.09)*(1-this.smooth((t-.58)/.18)),line1:reduced?1:this.smooth((t-.14)/.18),line2:reduced?1:this.smooth((t-.25)/.2)}},
  cardPath(c,w,h){c.beginPath();c.moveTo(0,0);c.lineTo(w,0);c.lineTo(w*.68,h);c.lineTo(0,h);c.closePath()},
  card(c,w,h,t,reduced){
    if(t<0||t>=P.VulturePhase2.entryDuration)return;
    const box=this.cardLayout(w,h),pw=box.w,ph=box.h,m=this.cardEnvelope(t,reduced),fx=pw*.47,fy=ph*.37;
    c.save();c.translate(m.slide*pw,box.y);
    c.save();c.translate(8,9);this.cardPath(c,pw,ph);c.fillStyle='#060812aa';c.fill();c.restore();
    c.save();this.cardPath(c,pw,ph);c.clip();c.fillStyle='#100f20';c.fillRect(0,0,pw,ph);
    const glow=c.createRadialGradient?.(fx,fy,10,fx,fy,pw*.67);if(glow?.addColorStop){glow.addColorStop(0,'#9363b6');glow.addColorStop(.58,'#382445');glow.addColorStop(1,'#121021');c.fillStyle=glow;c.fillRect(0,0,pw,ph)}
    // Rayos de composición, trama y planos de sombra convergen detrás del pecho.
    c.save();c.globalAlpha=.14+m.burst*.15;
    for(let i=0;i<16;i++){const a=i*Math.PI/8+(reduced?0:t*.09),r=Math.max(pw,ph)*1.4;c.fillStyle=i%3?'#b68dd0':'#f1cc7b';c.beginPath();c.moveTo(fx,fy);c.lineTo(fx+Math.cos(a)*r,fy+Math.sin(a)*r);c.lineTo(fx+Math.cos(a+.035)*r,fy+Math.sin(a+.035)*r);c.closePath();c.fill()}c.restore();
    c.save();c.globalAlpha=.14;c.fillStyle='#e0c0eb';for(let y=12;y<ph;y+=13)for(let x=(y%26?4:10);x<pw;x+=13)c.fillRect(x,y,2,2);c.restore();
    c.fillStyle='#090b19aa';c.beginPath();c.moveTo(0,ph*.59);c.lineTo(pw,ph*.5);c.lineTo(pw,ph);c.lineTo(0,ph);c.closePath();c.fill();
    c.save();c.globalAlpha=.6;c.fillStyle='#050712';c.beginPath();c.ellipse(box.px,box.py+6,pw*.22,ph*.027,0,0,Math.PI*2);c.fill();c.restore();
    if(typeof document!=='undefined'){
      const cv=this.cardPortrait||(this.cardPortrait=document.createElement('canvas'));if(cv.width!==Math.ceil(pw)||cv.height!==Math.ceil(ph)){cv.width=Math.ceil(pw);cv.height=Math.ceil(ph)}const pc=cv.getContext('2d');pc.clearRect(0,0,cv.width,cv.height);this.draw(pc,box.px,box.py,box.birdHeight,t,true,reduced);
      c.save();c.shadowColor='#050611';c.shadowBlur=0;c.shadowOffsetX=7;c.shadowOffsetY=9;c.imageSmoothingEnabled=false;c.drawImage(cv,0,0);c.restore();
    }else this.draw(c,box.px,box.py,box.birdHeight,t,true,reduced);
    // El grito expande arcos desde el pico, no un destello de pantalla completa.
    if(m.burst>0){const mouthX=box.px+box.birdHeight*.44,mouthY=box.py-box.birdHeight*.47;c.save();c.globalAlpha=m.burst*.8;c.strokeStyle='#ffebbf';c.lineWidth=2;for(let i=0;i<3;i++){const r=pw*(.04+i*.035)+(t-.35)*pw*.18;c.beginPath();c.arc(mouthX,mouthY,r,-.5,.45);c.stroke()}c.restore()}
    if(!reduced&&this.ready)for(let i=0;i<4;i++){const q=(i*.23+t*.3)%1;this.part(c,6,pw*(.05+q*.68),ph*(.62-q*.5),pw*(.025+(i%3)*.009),.5,.5,-.8+q*.7)}
    // Identidad arriba; nombre del ataque abajo, dentro de la cuña de la tarjeta.
    c.textAlign='left';c.fillStyle='#e7bf70';c.font='800 '+Math.max(9,pw*.025)+'px "Barlow Condensed", sans-serif';c.fillText('ULTIMATE',pw*.055,ph*.075);
    c.fillStyle='#f8e8d0';c.font='900 '+Math.max(17,pw*.052)+'px "Barlow Condensed", Impact, sans-serif';c.fillText('GALLINAZO',pw*.055,ph*.12);
    c.fillStyle='#c2a1d7';c.font='800 '+Math.max(10,pw*.027)+'px "Barlow Condensed", sans-serif';c.fillText('DEL CAOS',pw*.055,ph*.15);
    c.save();c.translate(3,6);c.fillStyle='#02040cdc';c.beginPath();c.moveTo(0,ph*.69);c.lineTo(pw*.76,ph*.715);c.lineTo(pw*.67,ph*.925);c.lineTo(0,ph*.895);c.closePath();c.fill();c.restore();
    c.fillStyle='#b77d35';c.beginPath();c.moveTo(0,ph*.69);c.lineTo(pw*.76,ph*.715);c.lineTo(pw*.67,ph*.925);c.lineTo(0,ph*.895);c.closePath();c.fill();
    c.fillStyle='#f2ce78';c.beginPath();c.moveTo(0,ph*.7);c.lineTo(pw*.744,ph*.726);c.lineTo(pw*.659,ph*.905);c.lineTo(0,ph*.88);c.closePath();c.fill();
    const firstSize=Math.min(Math.max(18,pw*.09),ph*.082),secondSize=Math.min(Math.max(27,pw*.145),ph*.13),lineGap=secondSize*.94+Math.max(4,pw*.012);
    c.save();c.translate(box.titleX,ph*.72+firstSize*.85);c.scale(1+m.kick,1+m.kick);c.textAlign='center';c.lineJoin='round';
    const word=(text,y,size,q,color)=>{c.save();c.translate(-pw*.7*(1-q),y);c.font='900 '+size+'px "Barlow Condensed", Impact, sans-serif';c.fillStyle='#452541';c.fillText(text,3,5);c.lineWidth=5;c.strokeStyle='#201429';c.strokeText(text,0,0);c.fillStyle=color;c.fillText(text,0,0);c.restore()};
    word('¡BAJO MIS',0,firstSize,m.line1,'#fff3da');word('ALAS!',lineGap,secondSize,m.line2,'#bda0ec');c.restore();
    c.font='800 '+Math.max(9,pw*.022)+'px "Barlow Condensed", sans-serif';c.textAlign='center';c.fillStyle='#d6bfdf';c.fillText('SEÑOR DE LAS AZOTEAS',pw*.33,ph*.96);
    c.restore();
    c.strokeStyle='#100c1c';c.lineWidth=9;c.beginPath();c.moveTo(pw-2,0);c.lineTo(pw*.68-2,ph);c.stroke();c.strokeStyle='#e5bc6a';c.lineWidth=3;c.stroke();
    if(!reduced&&t>.25&&t<1){const q=(t-.25)/.75,y=ph*q;c.strokeStyle='#fff0ca';c.lineWidth=4;c.beginPath();c.moveTo(pw*(1-.32*q)-2,y);c.lineTo(pw*(1-.32*Math.min(1,q+.12))-2,Math.min(ph,y+ph*.12));c.stroke()}
    c.restore();
  }
};
{
  const R=P.VultureRig,F=P.VulturePhase2,u=P.VultureUltimate,scene=P.VultureScene,init=scene.init,pending=scene.pending,geometry=scene.geometry,eye=scene.eye,bird=scene.bird,start=u.start,tick=u.introTick,overlay=u.overlay,move=P.Vulture.move,draw=P.Vulture.draw;
  scene.init=function(){R.init();return init.call(this)};
  scene.pending=()=>pending()||typeof Image!=='undefined'&&!R.ready&&!R.failed;
  scene.geometry=function(w,h){const g=geometry.call(this,w,h);g.rigHeight=h*.74;return g};
  scene.eye=function(g){return R.ready?R.eye(g):eye.call(this,g)};
  scene.bird=function(c,g,m,t,reduced){
    if(!R.ready)return bird.call(this,c,g,m,t,reduced);
    R.draw(c,g.baseX,g.baseY,g.rigHeight,t,false,reduced);
    const phase=R.motion(t,false,reduced).phase;F.electricity(c,g.baseX,g.baseY-g.rigHeight*.5,g.rigHeight*.3,t,phase*(reduced?.2:.7),reduced);
  };
  F.entering=e=>!!e&&e.phase==='vulture-activation';
  F.card=(...args)=>R.card(...args);
  u.start=function(e,...args){const ok=start.call(this,e,...args);if(ok){e.phase='vulture-activation';e.ultimateEntryTime=0}return ok};
  u.introTick=function(dt){
    const e=this.boss();if(F.entering(e)){
      if(P.state.mode!=='play')return false;
      e.ultimateEntryTime=Math.min(F.entryDuration,e.ultimateEntryTime+dt);
      if(e.ultimateEntryTime>=F.entryDuration){e.phase='vulture-ultimate';P.Core.clear();return true}
      // La tarjeta es un overlay; jugador, proyectiles y resto del mundo avanzan.
      return false;
    }
    return tick.call(this,dt);
  };
  u.overlay=function(){const e=this.boss();if(F.entering(e)){document.body.classList.remove('vulture-cinematic');R.card(P.Core.ctx,P.Core.width,P.Core.height,e.ultimateEntryTime,P.Vulture.reduced());return}return overlay.call(this)};
  P.Vulture.move=function(e,dt){if(F.entering(e)){e.hit=Math.max(0,(e.hit||0)-dt);P.Vulture.tickVisuals(e,dt);return}return move.call(this,e,dt)};
  P.Vulture.draw=function(c,e){
    if(!R.ready||!e.chaosForm||F.entering(e)||e.phase==='vulture-defeat')return draw.call(this,c,e);
    if(e.phase==='vulture-ultimate')P.VultureImpact.telegraph(c,e);
    c.save();c.translate(e.x,e.y+e.r*.5);if(e.dx<0&&!(e.moonSequence&&e.ultimateGrace>0))c.scale(-1,1);
    const result=R.draw(c,0,0,260,0,false,P.Vulture.reduced(),R.arenaMotion(e,P.Vulture.reduced()));c.restore();return result;
  };
}
