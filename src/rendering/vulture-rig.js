'use strict';
P.VultureRig={
  ready:false,failed:false,parts:[],title:'ECLIPSE CARROÑERO',arenaHeight:221,
  init(){
    if(this.started||typeof Image==='undefined')return;this.started=true;
    const image=new Image();image.onload=()=>{try{
      const cv=document.createElement('canvas');cv.width=image.width;cv.height=image.height;const c=cv.getContext('2d');c.drawImage(image,0,0);
      const r=c.getImageData(0,0,cv.width,cv.height);for(let i=3;i<r.data.length;i+=4)r.data[i]=r.data[i]<150?0:255;c.putImageData(r,0,0);
      this.surface=cv;this.palettes=[cv];for(let step=1;step<=8;step++){const pc=document.createElement('canvas');pc.width=cv.width;pc.height=cv.height;const ctx=pc.getContext('2d'),pixels=ctx.createImageData(cv.width,cv.height);pixels.data.set(r.data);this.tintPlumage(pixels.data,step/8);ctx.putImageData(pixels,0,0);this.palettes.push(pc)}
      for(let row=0;row<2;row++)for(let col=0;col<4;col++)this.parts.push(P.BossArt.mainBounds(r.data,cv.width,col*cv.width/4,row*cv.height/2,(col+1)*cv.width/4,(row+1)*cv.height/2));this.ready=true;
    }catch{this.failed=true}};image.onerror=()=>{this.failed=true};image.src='assets/bosses/gallinazo-rig-v1.webp';
  },
  smooth(v){v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)},
  tintPlumage(data,q){
    for(let i=0;i<data.length;i+=4){const r=data[i],g=data[i+1],b=data[i+2],hi=Math.max(r,g,b),lo=Math.min(r,g,b);
      if(!data[i+3]||hi>185||hi-lo>65||b<r*.68)continue;
      const light=r*.2126+g*.7152+b*.0722,target=[light*.7+8,light*.42+3,light*.98+18];
      for(let k=0;k<3;k++)data[i+k]=Math.round(data[i+k]*(1-q)+target[k]*q);
    }
  },
  motion(t,card=false,reduced=false){
    if(reduced)return {near:-.45,far:-.2,jaw:0,head:0,phase:card?0:1,ruffle:0};
    const open=card?this.smooth((t-.08)/.4)*(1-this.smooth((t-.85)/.35)):this.smooth((t-1.25)/1.3),strike=card?0:this.smooth((t-2.95)/.2)*(1-this.smooth((t-3.35)/.4)),roar=card?this.smooth((t-.35)/.16)*(1-this.smooth((t-.88)/.2)):this.smooth((t-2.05)/.25)*(1-this.smooth((t-2.9)/.18));
    return {near:-.68+open*1.38-strike*1.25,far:-.25+open*1.75-strike*1.2,jaw:roar*.34,head:-roar*.08,phase:card?0:this.smooth((t-1.65)/1.05),ruffle:open*Math.sin(t*12)*.035};
  },
  part(c,id,x,y,w,px,py,angle=0,sx=1,sy=1){
    const f=this.parts[id],h=w*f.h/f.w;c.save();c.translate(x,y);c.rotate(angle);c.scale(sx,sy);c.drawImage(this.palettes?.[this.paletteStep||0]||this.surface,f.x,f.y,f.w,f.h,-w*px,-h*py,w,h);c.restore();
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
    const idle=this.idleMotion(e,reduced);
    if(e.phase==='vulture-ultimate'){
      const m=this.motion(Math.min(4,e.ultimateTime||0),false,reduced);
      if(e.ultimateTime>=4){m.near=.05;m.far=.65}
      if(e.ultimateTime>=4&&e.ultimateGrace<=0){m.near-=(e.wavePulse||0)*2.4;m.far-=(e.wavePulse||0)*1.8}
      if(e.ultimateTime>=4&&e.ultimateGrace<=0)for(const k of ['near','far','head','ruffle'])m[k]+=idle[k];
      return m;
    }
    // En reposo las alas quedan contenidas; vuelo, carga y disparo las abren
    // desde articulaciones distintas sin agrandar ni trasladar el torso.
    const m={near:-.04,far:.42,jaw:0,head:0,phase:1,ruffle:0};
    if(e.phase==='vulture-dive'){m.near=-.9;m.far=-.55}
    for(const k of ['near','far','head','ruffle'])m[k]+=idle[k];
    const flight=this.flightPose(e,reduced);m.near+=flight.near;m.far+=flight.far;m.tuck=flight.tuck;
    const attack=this.attackPose(e,reduced);if(attack)for(const k of ['near','far','head','jaw','ruffle','tuck'])m[k]=attack[k];
    if((e.rigFlight||0)>0&&!attack)m.far=Math.max(m.far,.18)
    return m;
  },
  attackPose(e,reduced=false){
    if(e.phase==='vulture-chaos-charge'){
      const t=e.chaosTime||0,storm=e.chaosAttack==='storm',load=this.smooth(t/.85)*(1-this.smooth((t-(storm?1.46:1.52)-.28)/.45));
      let stroke=0,brace=0;
      for(const hit of storm?[1.1,1.28,1.46]:[1.1,1.52]){
        stroke+=this.smooth((t-(hit-.13))/.13)*(1-this.smooth((t-hit)/.28));
        brace+=this.smooth((t-(hit-.32))/.16)*(1-this.smooth((t-(hit-.13))/.13));
      }
      const release= Math.min(1,stroke),power=reduced?0:release;
      return {near:-.04+load*1.08-power*1.72,far:.42+load*1.13-power*1.82,head:reduced?0:-load*.1+power*.17,jaw:reduced?0:power*.32,ruffle:reduced?0:(brace*.025+power*.07),tuck:0,bank:reduced?0:-load*.075+power*.18,lift:0,pulse:power};
    }
    if(e.phase==='vulture-warning'&&e.attack==='dive'){
      const p=Math.max(0,Math.min(1,1-e.windup/(e.warningTime||1.05))),open=this.smooth(p/.65),fold=this.smooth((p-.65)/.35);
      return {near:.05+open*1.2-fold*2.1,far:.65+open*1.1-fold*2.2,head:reduced?0:p*.12,jaw:0,ruffle:reduced?0:Math.sin(p*18)*.025*p,tuck:p*.95,bank:reduced?0:-p*.12,lift:36*this.smooth(p),pulse:0};
    }
    if(e.phase==='vulture-dive')return {near:-1.05,far:-.8,head:.13,jaw:0,ruffle:0,tuck:1,bank:reduced?0:.28,lift:40,pulse:0};
    return null;
  },
  flightPose(e,reduced=false){
    const dive=e.phase==='vulture-dive',q=Math.max(0,Math.min(1,e.rigFlight||0)),t=e.rigTime||0,beat=Math.sin(t*6.4),weight=reduced?0:q;
    const attack=this.attackPose(e,reduced);if(attack)return {lift:attack.lift+(e.phase==='vulture-dive'?0:q*32*(1-(attack.tuck||0))),tuck:attack.tuck,near:0,far:0,bank:attack.bank};
    return {lift:q*(reduced?32:36+Math.cos(t*6.4-.7)*5),tuck:q*.85,near:dive||reduced?0:weight*(.15+beat*.55),far:dive||reduced?0:weight*(.35+Math.sin(t*6.4-.18)*.62),bank:reduced?0:dive?.16:weight*Math.sin(t*6.4-.8)*.025};
  },
  tickFlight(e,dt){
    if(!(dt>0)||!Number.isFinite(e.x)||!Number.isFinite(e.y))return;
    const moved=Number.isFinite(e.rigLastX)?Math.hypot(e.x-e.rigLastX,e.y-e.rigLastY)/dt:0;
    if(Number.isFinite(e.rigLastX)&&Math.abs(e.x-e.rigLastX)>dt*12)e.rigFacing=Math.sign(e.x-e.rigLastX);
    const target=e.chaosForm&&(e.phase==='vulture-dive'||e.phase==='approach'&&moved>8)?1:0;
    const q=e.rigFlight||0,step=dt*(target?4:2.8);e.rigFlight=q+Math.max(-step,Math.min(step,target-q));e.rigLastX=e.x;e.rigLastY=e.y;
  },
  idleMotion(e,reduced=false){
    const t=reduced?0:(e.rigTime||0),active=!reduced;
    return {near:active?Math.sin(t*3.4)*.13:0,far:active?Math.sin(t*3.4-.6)*.16:0,head:active?Math.sin(t*2.3)*.045:0,ruffle:active?Math.sin(t*7.2)*.055:0};
  },
  attackFX(c,e,reduced=false){
    if(reduced||e.phase!=='vulture-chaos-charge')return;const a=this.attackPose(e);if(!a||a.pulse<.05)return;
    c.save();c.globalAlpha=a.pulse*.8;c.lineWidth=3;c.strokeStyle='#ead7ff';
    for(let i=0;i<3;i++){c.beginPath();c.arc(35,-120,85+i*15,-1.1+a.pulse*.6,.35+a.pulse*.4);c.stroke()}c.restore();
  },
  featherLoad(e){
    if(e?.phase!=='vulture-chaos-charge'||e.chaosAttack!=='rake')return 0;const t=e.chaosTime||0;
    return Math.max(...[1.1,1.52].map(hit=>this.smooth((t-hit+.3)/.2)*(1-this.smooth((t-hit)/.07))));
  },
  loadedFeathers(c,e,reduced=false){
    const load=this.featherLoad(e);if(!this.ready||load<=.01)return;const m=this.arenaMotion(e,reduced),h=260;
    c.save();c.translate(h*.035,-h*.46);c.rotate(m.near);
    for(let i=0;i<3;i++)this.part(c,6,-h*(.35+i*.055),h*(.09+i*.035),h*.24*(.75+load*.25),.97,.5,(i-1)*.14,1,1);
    c.restore();
  },
  draw(c,x,y,h,t,card=false,reduced=false,pose){
    if(!this.ready)return false;const m=pose||this.motion(t,card,reduced);this.paletteStep=Math.round(Math.max(0,Math.min(1,m.phase||0))*8);
    c.save();c.imageSmoothingEnabled=false;c.translate(x,y);
    // Torso y patas nunca reciben traslación, escala de pulso ni interpolación.
    this.wing(c,4,h*.12,-h*.5,h*.59,m.far,m,true);
    // La lámina del torso incluía un ala plegada: limitarla al pecho evita
    // que parezca una tercera ala al levantar las dos piezas articuladas.
    const torso=()=>{c.save();c.beginPath();c.moveTo(h*.32,-h*.55);c.lineTo(-h*.16,-h*.46);for(const [xx,yy] of [[-.2,-.4],[-.16,-.36],[-.2,-.3],[-.15,-.25],[-.19,-.19],[-.14,-.13],[-.18,-.09],[-.15,-.05],[-.16,.04]])c.lineTo(h*xx,h*yy);c.lineTo(h*.32,h*.04);c.closePath();c.clip();this.part(c,0,0,0,h*.62,.58,1);c.restore();};
    if(m.tuck>0){c.save();c.beginPath();c.rect(-h,-h,h*2,h*.84);c.clip();torso();c.restore();c.save();c.translate(0,-h*.08*m.tuck);c.beginPath();c.rect(-h,-h*.16,h*2,h*.2);c.clip();torso();c.restore()}else torso();
    this.part(c,7,h*.23,-h*.34,h*(.21+m.phase*.03),.55,.7,-.07*m.phase+(m.ruffle||0)*1.2,1,.65+m.phase*.35);
    if(m.phase>0)this.part(c,5,h*.23,-h*.48,h*.18,.5,1,-1.1*(1-m.phase)+(m.ruffle||0)*.9,1,.15+m.phase*.85);
    this.wing(c,3,h*.035,-h*.46,h*.72,m.near,m);
    c.save();c.translate(h*.23,-h*.4);c.rotate(m.head);
    this.part(c,1,0,0,h*.33,.27,.82);
    // La pieza ya tiene curvatura de pico abierto: un giro pequeño basta.
    if(m.jaw>0)this.part(c,2,h*.14,-h*.085,h*.102,.04,.25,-.12+m.jaw,1,.35+.65*m.jaw/.34);
    c.restore();c.restore();return true;
  },
  eye(g){const h=g.rigHeight;return {x:g.baseX+h*.23+h*.33*(.69-.27),y:g.baseY-h*.4-h*.33*(.82-.28)*254/347}},
  cardLayout(w,h){const base=P.UltimateComic?.layout(w,h)||{w:w*.4,h:h*.82,y:h*.08},cw=w<640?w*.62:base.w,ch=Math.min(base.h,cw*1.55),box={w:cw,h:ch,y:base.y};return {...box,px:cw*.47,py:ch*.59,birdHeight:Math.min(ch*.54,cw*.7),titleX:cw*.335}},
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
    // Identidad arriba; el nombre propio de la ulti ocupa la cuña dorada.
    c.textAlign='left';c.fillStyle='#e7bf70';c.font='800 '+Math.max(9,pw*.025)+'px "Barlow Condensed", sans-serif';c.fillText('ULTIMATE',pw*.055,ph*.075);
    c.fillStyle='#f8e8d0';c.font='900 '+Math.max(17,pw*.052)+'px "Barlow Condensed", Impact, sans-serif';c.fillText('GALLINAZO',pw*.055,ph*.12);
    c.fillStyle='#c2a1d7';c.font='800 '+Math.max(10,pw*.027)+'px "Barlow Condensed", sans-serif';c.fillText('DEL CAOS',pw*.055,ph*.15);
    c.save();c.translate(3,6);c.fillStyle='#02040cdc';c.beginPath();c.moveTo(0,ph*.69);c.lineTo(pw*.76,ph*.715);c.lineTo(pw*.67,ph*.925);c.lineTo(0,ph*.895);c.closePath();c.fill();c.restore();
    c.fillStyle='#b77d35';c.beginPath();c.moveTo(0,ph*.69);c.lineTo(pw*.76,ph*.715);c.lineTo(pw*.67,ph*.925);c.lineTo(0,ph*.895);c.closePath();c.fill();
    c.fillStyle='#f2ce78';c.beginPath();c.moveTo(0,ph*.7);c.lineTo(pw*.744,ph*.726);c.lineTo(pw*.659,ph*.905);c.lineTo(0,ph*.88);c.closePath();c.fill();
    const firstSize=Math.min(Math.max(18,pw*.082),ph*.075),secondSize=Math.min(Math.max(24,pw*.112),ph*.102),lineGap=secondSize*.98+Math.max(4,pw*.012);
    c.save();c.translate(box.titleX,ph*.72+firstSize*.85);c.scale(1+m.kick,1+m.kick);c.textAlign='center';c.lineJoin='round';
    const word=(text,y,size,q,color)=>{c.save();c.translate(-pw*.7*(1-q),y);c.font='900 '+size+'px "Barlow Condensed", Impact, sans-serif';c.fillStyle='#452541';c.fillText(text,3,5);c.lineWidth=5;c.strokeStyle='#201429';c.strokeText(text,0,0);c.fillStyle=color;c.fillText(text,0,0);c.restore()};
    word('ECLIPSE',0,firstSize,m.line1,'#fff3da');word('CARROÑERO',lineGap,secondSize,m.line2,'#4a244f');c.restore();
    c.font='800 '+Math.max(9,pw*.022)+'px "Barlow Condensed", sans-serif';c.textAlign='center';c.fillStyle='#d6bfdf';c.fillText('SEÑOR DE LAS AZOTEAS · ¡BAJO MIS ALAS!',pw*.33,ph*.96);
    c.restore();
    c.strokeStyle='#100c1c';c.lineWidth=9;c.beginPath();c.moveTo(pw-2,0);c.lineTo(pw*.68-2,ph);c.stroke();c.strokeStyle='#e5bc6a';c.lineWidth=3;c.stroke();
    if(!reduced&&t>.25&&t<1){const q=(t-.25)/.75,y=ph*q;c.strokeStyle='#fff0ca';c.lineWidth=4;c.beginPath();c.moveTo(pw*(1-.32*q)-2,y);c.lineTo(pw*(1-.32*Math.min(1,q+.12))-2,Math.min(ph,y+ph*.12));c.stroke()}
    // Plumas de primer plano cruzan el marco: la pose rompe el panel sin
    // mostrar una segunda copia del jefe en la arena.
    if(!reduced&&this.ready)for(let i=0;i<3;i++){const q=this.smooth((t-.28-i*.06)/.3),x=pw*(.74-.05*i)+q*pw*.13,y=ph*(.3+i*.16)-q*ph*.05;this.part(c,6,x,y,pw*(.055+i*.009),.5,.5,-.95+q*.75)}
    c.restore();
  }
};
{
  const R=P.VultureRig,F=P.VulturePhase2,u=P.VultureUltimate,scene=P.VultureScene,init=scene.init,pending=scene.pending,geometry=scene.geometry,eye=scene.eye,bird=scene.bird,start=u.start,tick=u.introTick,overlay=u.overlay,move=P.Vulture.move,draw=P.Vulture.draw,visuals=P.Vulture.tickVisuals;
  const aura=F.aura;F.aura=function(c,e){if(R.ready&&e?.chaosForm)return;return aura?.call(this,c,e)};
  P.Vulture.tickVisuals=function(e,dt){e.rigTime=(e.rigTime||0)+dt;R.tickFlight(e,dt);return visuals.call(this,e,dt)};
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
    const reduced=P.Vulture.reduced(),flight=R.flightPose(e,reduced);
    const facing=e.phase==='approach'?(e.rigFacing||(P.state.player?.x<e.x?-1:1)):(e.dx<0?-1:1);
    c.save();c.translate(e.x,e.y+e.r*.5-flight.lift);if(facing<0&&!(e.moonSequence&&e.ultimateGrace>0))c.scale(-1,1);c.rotate(flight.bank);
    // Aura exterior acompaña la altura del plumaje morado.
    const h=R.arenaHeight,g={x:-h*.44,y:-h*.78,w:h*.88,h:h*.82};P.VultureScene.ribbons?.(c,g,reduced?0:e.rigTime||0,reduced?.12:.24,false);
    const result=R.draw(c,0,0,h,0,false,reduced,R.arenaMotion(e,reduced));
    R.loadedFeathers(c,e,reduced);
    R.attackFX(c,e,reduced);
    const energy=e.phase==='vulture-chaos-charge'?.4+.4*(R.attackPose(e,reduced)?.pulse||0):e.phase==='vulture-ultimate'&&e.wavePulse>0?.65:.35;
    F.electricity?.(c,0,-h*.43,h*.34,reduced?0:e.rigTime||0,reduced?.12:energy,reduced);c.restore();return result;
  };
}
