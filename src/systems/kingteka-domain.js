'use strict';
// Kingteka keeps his Gallinazo ultimate on Q. This domain shares the same
// charge and offers a protective, nature-themed alternative on R.
P.KingtekaDomain={
 entry:2.6,duration:9,exit:.85,serial:0,radius:620,waveGap:1.25,
 eligible(p){return p?.id==='kingteka'&&P.Gacha.tier(p.id)==='ultra'},
 owner(d=P.state.kingtekaDomain){return (P.Court?.players?.()||[P.state.player]).find(p=>(p.slot??0)===(d?.slot??0))||P.state.player},
 active(){return !!P.state.kingtekaDomain},
 activate(){
  if(P.Coop?.active)return P.Coop.requestDomain();
  const s=P.state,p=s.player,u=s.ultimate;
  if(s.mode!=='play'||!this.eligible(p)||p.hp<=0||!u||u.charge<100||u.left>0||u.paper>0||P.Progression?.domainActive?.()||s.encounter?.defeat)return false;
  u.charge=0;s.kingtekaDomain={id:++this.serial,slot:p.slot??0,age:0,x:p.x,y:p.y,wave:-1,flash:0,final:false,spirits:[],leaves:[],hits:0,healed:0,exit:0};
  p.inv=Math.max(p.inv||0,this.entry+.15);P.Audio.unlock();P.Audio.tone?.(92,.45,.14,'sine',0,40);P.Core.clear();return true
 },
 source(p){return {...P.Attributes.source(p,'special'),glyph:'FAUNA',fixedDamage:true}},
 wave(d,final=false){
  const s=P.state,p=this.owner(d);if(!p||p.hp<=0)return;
  const targets=s.enemies.filter(e=>e.hp>0&&Math.hypot(e.x-d.x,e.y-d.y)<=this.radius+120);
  const kinds=['condor','puma','bear','cuy'];d.flash=final?.7:.32;
  targets.forEach((e,i)=>{
   const special=!!(e.boss||e.mapBoss||e.miniboss),damage=final?(special?p.power*1.15:Math.max(p.power*.8,e.max*.14)):(special?p.power*.58:Math.max(p.power*.42,e.max*.075)),before=e.hp;
   P.Entities.hurt(e,damage,final?30:14,this.source(p));if(e.hp<before)d.hits++;
   const angle=Math.atan2(e.y-d.y,e.x-d.x)+(i%3-1)*.18;d.spirits.push({kind:kinds[(d.wave+i)%kinds.length],age:0,max:final?.9:.7,fromX:d.x+Math.cos(angle)*this.radius,fromY:d.y+Math.sin(angle)*this.radius,toX:e.x,toY:e.y,flip:Math.cos(angle)<0})
  });
  const allies=P.Court?.players?.()||[p];for(const ally of allies)if(ally?.hp>0){const amount=Math.max(1,ally.maxHp*(final?.055:.022));const before=ally.hp;ally.hp=Math.min(ally.maxHp,ally.hp+amount);d.healed+=ally.hp-before;ally.inv=Math.max(ally.inv||0,final?.4:.16)}
  for(let i=0;i<(final?28:12);i++){const a=(i+.35)*Math.PI*2/(final?28:12)+d.wave*.37,r=80+(i%5)*92;d.leaves.push({x:d.x+Math.cos(a)*r,y:d.y+Math.sin(a)*r,age:0,max:.75+(i%4)*.08,angle:a,spin:(i%2?1:-1)*(2+i%3),size:4+i%4})}
  d.spirits=d.spirits.slice(-48);d.leaves=d.leaves.slice(-90);P.Audio.tone?.(final?70:160,final?.5:.16,final?.16:.06,final?'sawtooth':'triangle',0,final?28:120)
 },
 tick(dt){
  const s=P.state,d=s.kingtekaDomain;if(!d)return;const p=this.owner(d);if(!p){s.kingtekaDomain=null;return}
  d.age+=dt;d.flash=Math.max(0,d.flash-dt);for(const q of d.spirits)q.age+=dt;for(const q of d.leaves)q.age+=dt;d.spirits=d.spirits.filter(q=>q.age<q.max);d.leaves=d.leaves.filter(q=>q.age<q.max);
  if(d.age<this.entry){p.inv=Math.max(p.inv||0,dt+.12);return}
  const active=d.age-this.entry,wave=Math.floor(active/this.waveGap);if(active<this.duration-.35&&wave>d.wave){d.wave=wave;this.wave(d,false)}
  if(active>=this.duration-.35&&!d.final){d.final=true;this.wave(d,true)}
  if(active>=this.duration&&!d.exit)d.exit=this.exit;
  if(d.exit>0){d.exit=Math.max(0,d.exit-dt);p.inv=Math.max(p.inv||0,dt+.08);if(!d.exit)this.end()}
 },
 end(){const s=P.state,d=s.kingtekaDomain;if(!d)return;for(const p of P.Court?.players?.()||[s.player])if(p?.hp>0)p.inv=Math.max(p.inv||0,.65);s.kingtekaDomain=null;P.Core.canvas?.setAttribute('aria-label','Arena: '+P.Maps.current().name);P.Core.clear()},
 hud(){
  if(!this.eligible(P.state.player))return false;const s=P.state,b=P.$('#domain-ability'),charge=Math.max(0,Math.min(100,s.ultimate?.charge||0)),d=s.kingtekaDomain,active=!!d;
  if(!b)return true;b.hidden=s.mode!=='play';b.disabled=active||charge<100||(s.ultimate?.left||0)>0;P.AbilityCards?.apply(b,'kingteka','domain',charge,charge>=100&&!active&&!s.ultimate?.left,active);b.setAttribute('aria-label','Expansión de dominio Santuario del Reino Animal · tecla R');
  const left=d?Math.max(0,this.duration-(d.age-this.entry)):0;P.UI.write(b,active?'R · SANTUARIO '+left.toFixed(1)+'s':'R · SANTUARIO '+Math.floor(charge)+'%');return true
 },
 animal(c,kind,x,y,size=40,flip=false,alpha=1){
  c.save();c.translate(x,y);if(flip)c.scale(-1,1);c.globalAlpha=alpha;c.lineWidth=Math.max(2,size*.07);c.strokeStyle='#e8ff9b';c.fillStyle='#2b7d4f';c.shadowColor='#b8ff72';c.shadowBlur=12;
  if(kind==='condor'){c.beginPath();c.moveTo(-size*.8,0);c.quadraticCurveTo(-size*.35,-size*.55,0,-size*.08);c.quadraticCurveTo(size*.38,-size*.55,size*.82,0);c.quadraticCurveTo(size*.35,-size*.2,0,size*.18);c.quadraticCurveTo(-size*.4,-size*.2,-size*.8,0);c.fill();c.stroke();c.beginPath();c.arc(size*.08,-size*.12,size*.13,0,Math.PI*2);c.fill()}
  else if(kind==='puma'){c.beginPath();c.ellipse(0,0,size*.5,size*.24,0,0,Math.PI*2);c.fill();c.stroke();c.beginPath();c.arc(size*.45,-size*.18,size*.2,0,Math.PI*2);c.fill();c.stroke();c.beginPath();c.moveTo(-size*.45,-size*.05);c.quadraticCurveTo(-size*.9,-size*.55,-size*.72,-size*.72);c.stroke();for(const q of [-.28,.18])c.fillRect(q*size,size*.12,size*.1,size*.38)}
  else if(kind==='bear'){c.beginPath();c.ellipse(0,0,size*.43,size*.52,0,0,Math.PI*2);c.fill();c.stroke();c.beginPath();c.arc(size*.04,-size*.48,size*.3,0,Math.PI*2);c.fill();c.stroke();for(const q of [-1,1]){c.beginPath();c.arc(size*(.04+q*.22),-size*.7,size*.11,0,Math.PI*2);c.fill();c.stroke()}}
  else {c.beginPath();c.ellipse(0,0,size*.5,size*.34,0,0,Math.PI*2);c.fill();c.stroke();c.beginPath();c.arc(size*.42,-size*.08,size*.25,0,Math.PI*2);c.fill();c.stroke();c.beginPath();c.arc(size*.49,-size*.31,size*.1,0,Math.PI*2);c.fill();c.stroke()}
  c.restore()
 },
 ground(c,d){
  const fade=d.exit?d.exit/this.exit:Math.min(1,Math.max(0,(d.age-this.entry+.6)/.6));if(fade<=0)return;c.save();c.globalAlpha=.7*fade;const g=c.createRadialGradient(d.x,d.y,30,d.x,d.y,this.radius);g.addColorStop(0,'#b9f56c55');g.addColorStop(.62,'#1d8b4b42');g.addColorStop(1,'#0a3a2600');c.fillStyle=g;c.beginPath();c.arc(d.x,d.y,this.radius,0,Math.PI*2);c.fill();c.strokeStyle='#c9ff76';c.lineWidth=5;c.setLineDash([18,14]);c.lineDashOffset=-d.age*35;c.beginPath();c.arc(d.x,d.y,this.radius*.78,0,Math.PI*2);c.stroke();c.setLineDash([]);
  for(let i=0;i<18;i++){const a=i*Math.PI*2/18+d.age*.025,r=this.radius*(.76+.12*Math.sin(i*2.7));c.fillStyle=i%2?'#54b95f':'#a6dd59';c.save();c.translate(d.x+Math.cos(a)*r,d.y+Math.sin(a)*r);c.rotate(a+.6);c.beginPath();c.ellipse(0,0,11,4,0,0,Math.PI*2);c.fill();c.restore()}
  for(const q of d.spirits){const t=Math.min(1,q.age/q.max),ease=1-Math.pow(1-t,3),x=q.fromX+(q.toX-q.fromX)*ease,y=q.fromY+(q.toY-q.fromY)*ease,alpha=Math.sin(t*Math.PI);this.animal(c,q.kind,x,y,38+(q.kind==='bear'?12:0),q.flip,alpha)}
  for(const q of d.leaves){const t=q.age/q.max;c.save();c.globalAlpha=(1-t)*.9;c.translate(q.x+Math.cos(q.angle)*t*55,q.y+Math.sin(q.angle)*t*55-t*28);c.rotate(q.angle+q.spin*t);c.fillStyle='#d9ff70';c.beginPath();c.ellipse(0,0,q.size*1.8,q.size*.7,0,0,Math.PI*2);c.fill();c.restore()}c.restore()
 },
 title(c,text,x,y,size,color){c.save();c.textAlign='center';c.textBaseline='middle';c.font='900 '+size+'px Georgia,serif';c.lineJoin='round';c.lineWidth=Math.max(7,size*.13);c.strokeStyle='#0b261b';c.shadowColor='#8dff61';c.shadowBlur=18;c.strokeText(text,x,y);const g=c.createLinearGradient(0,y-size/2,0,y+size/2);g.addColorStop(0,'#fff8ba');g.addColorStop(.55,color);g.addColorStop(1,'#4c8d38');c.fillStyle=g;c.fillText(text,x,y);c.restore()},
 overlay(c,w,h,d){
  const intro=Math.min(1,d.age/this.entry),active=d.age>=this.entry,exit=d.exit?1-d.exit/this.exit:1;c.save();c.globalAlpha=.18*exit;c.fillStyle='#0c492d';c.fillRect(0,0,w,h);const vignette=c.createRadialGradient(w/2,h/2,Math.min(w,h)*.18,w/2,h/2,Math.max(w,h)*.68);vignette.addColorStop(0,'#c9ff6000');vignette.addColorStop(1,'#062319bb');c.fillStyle=vignette;c.fillRect(0,0,w,h);
  if(!active){const pulse=Math.sin(Math.min(1,intro/.72)*Math.PI);c.globalAlpha=Math.min(1,intro*3);this.title(c,'EXPANSIÓN DE DOMINIO',w/2,h*.16,Math.min(54,w/18),'#bfff72');if(intro>.48){c.globalAlpha=Math.min(1,(intro-.48)*4);this.title(c,'SANTUARIO DEL',w/2,h*.73,Math.min(60,w/16),'#e8ff92');this.title(c,'REINO ANIMAL',w/2,h*.82,Math.min(68,w/14),'#ffd66e')}c.globalAlpha=pulse*.55;c.strokeStyle='#d9ff7a';c.lineWidth=5;c.beginPath();c.arc(w/2,h/2,Math.min(w,h)*(.12+intro*.42),0,Math.PI*2);c.stroke()}
  if(d.flash>0){c.globalAlpha=Math.min(.42,d.flash);c.fillStyle=d.final?'#fff6a6':'#b8ff72';c.fillRect(0,0,w,h)}c.restore();P.Core.canvas?.setAttribute('aria-label',active?'Santuario del Reino Animal activo: espíritus protectores atraviesan a los enemigos':'Kingteka abre el Santuario del Reino Animal')
 }
};

{const update=P.Game.update,start=P.Game.start,render=P.World.render,world=P.World.draw,hud=P.UI.hud,ultimate=P.Ultimate.activate;
 P.Game.update=function(dt){const result=update.call(this,dt);if(P.state.kingtekaDomain&&P.state.mode==='play'&&!P.Coop?.active)P.KingtekaDomain.tick(dt);return result};
 P.Game.start=function(...a){P.state.kingtekaDomain=null;return start.apply(this,a)};
 P.World.draw=function(c,...a){const result=world.call(this,c,...a),d=P.state.kingtekaDomain;if(d&&d.age>=P.KingtekaDomain.entry)P.KingtekaDomain.ground(c,d);return result};
 P.World.render=function(...a){const result=render.apply(this,a),d=P.state.kingtekaDomain;if(d&&P.state.mode!=='menu')P.KingtekaDomain.overlay(P.Core.ctx,P.Core.width,P.Core.height,d);return result};
 P.UI.hud=function(...a){const result=hud.apply(this,a);P.KingtekaDomain.hud();return result};
 P.Ultimate.activate=function(...a){if(P.state.kingtekaDomain)return false;return ultimate.apply(this,a)};
}
