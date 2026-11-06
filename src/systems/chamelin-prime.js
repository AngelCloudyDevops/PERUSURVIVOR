'use strict';
P.ChamelinPrimeArsenal={
 order:['primeTurret','primePressure','primeSpit'],names:{primeTurret:'Base contaminada',primePressure:'Chorro a presión',primeSpit:'Escupitajo acumulado'},
 init(p=P.state.player){if(p?.id!=='chamelinPrime')return null;return p.chamelinPrimeArsenal??={active:'primeTurret',unlocked:{primeTurret:true,primePressure:true,primeSpit:true},ranks:{primeTurret:1,primePressure:1,primeSpit:1},lastSwitch:-1}},
 request(index){const p=P.state.player;if(P.state.mode!=='play'||!this.init(p))return false;return this.switch(p,index)},
 switch(p,index){const a=this.init(p),id=this.order[Number(index)-1],now=P.state.elapsed||0;if(!a||!id||a.active===id||now-a.lastSwitch<.25)return false;a.active=id;a.lastSwitch=now;p.primeTransitionUntil=now+.48;p.primeStyle=id;P.state.effects.push({kind:'shout',text:this.names[id].toUpperCase(),x:p.x,y:p.y-58,life:.55,maxLife:.55,color:id==='primePressure'?'#ffe36c':id==='primeSpit'?'#a9efff':'#e4a15b'});P.Audio?.tone?.(180+index*70,.12,.035,'triangle',0,120);return true},
 card(){return null},apply(){return false},summary(p){const a=this.init(p);return a?this.order.map((id,i)=>(i+1)+' '+(a.active===id?'▸ ':'')+this.names[id]).join(' · '):''}
};
// Chamelín Prime is a separate playable version. Its primary attack builds a
// temporary base instead of requiring a target. Attack speed controls how often
// a turret is deployed; there is deliberately no hard turret-count cap.
P.ChamelinPrime={
 id:'chamelinPrime',territoryRadius:118,turretLife:22,turretHp:42,shotSpeed:520,shotLife:1.1,
 eligible(p=P.state.player){return p?.id===this.id},
 state(p=P.state.player){
  const s=P.state;
  if(!s.chamelinPrime||s.chamelinPrime.owner!==p)s.chamelinPrime={owner:p,serial:0,turrets:[],shots:[],puddles:[],pressure:100,recharging:false,spitCharge:0,spitArmed:false,spitOrbs:[],spitZones:[],blackHole:null,ultimateCharge:0};
  return s.chamelinPrime
 },
 source(p){return {...P.Attributes.source(p,'special'),weaponAttack:true,chamelinPrime:true}},
 style(p=P.state.player){return P.ChamelinPrimeArsenal.init(p)?.active||'primeTurret'},
 deploy(p=P.state.player){
  if(!this.eligible(p)||p.hp<=0||P.state.mode!=='play')return false;
  const q=this.state(p),facing=p.facing||1,x=p.x-facing*17,y=p.y+12,reach=p.reach||1;
  q.turrets.push({primeTurret:true,id:++q.serial,x,y,r:18,hp:this.turretHp+p.power*.28,maxHp:this.turretHp+p.power*.28,shield:0,maxShield:0,radius:this.territoryRadius*reach,life:this.turretLife,fire:.35,age:0,owner:p});
  const immediate=P.state.enemies.filter(e=>e.hp>0&&Math.hypot(e.x-x,e.y-y)<=440*reach).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];if(immediate)P.Entities.hurt(immediate,p.power*.38,4,this.source(p));
  if(p.evolved?.primary)P.Evolutions?.afterCast?.(p,P.Evolutions.attack(p),immediate||null);
  p.primeDeployUntil=P.state.elapsed+.55;p.castUntil=Math.max(p.castUntil||0,P.state.elapsed+.38);
  P.state.effects.push({kind:'shout',text:'¡BASE PRIME!',x,y:y-42,life:.55,maxLife:.55,color:'#f1b454'});
  P.Audio?.tone?.(105,.12,.04,'square',0,55);return true
 },
 connected(a,b){return Math.hypot(a.x-b.x,a.y-b.y)<=Math.min(a.radius,b.radius)*1.55},
 rebuildNetwork(q){
  for(const t of q.turrets){let links=0;for(const other of q.turrets)if(other!==t&&this.connected(t,other))links++;t.links=links;t.maxShield=Math.min(30,links*10);t.shield=Math.min(t.maxShield,(t.shield??t.maxShield)+.04)}
 },
 inside(x,y,q=this.state()){return q.turrets.some(t=>t.hp>0&&Math.hypot(x-t.x,y-t.y)<=t.radius)||q.puddles.some(v=>Math.hypot(x-v.x,y-v.y)<=v.r)},
 burst(t,q){
  q.puddles.push({x:t.x,y:t.y,r:76,life:5,maxLife:5});
  P.state.effects.push({kind:'nova',x:t.x,y:t.y,r:82,life:.45,maxLife:.45,color:'#a86d35',glyph:'¡PLOP!'});
  P.Audio?.tone?.(72,.16,.05,'sawtooth',0,35)
 },
 pressure(p=P.state.player){
  const q=this.state(p),now=P.state.elapsed;if(q.recharging||q.pressure<12)return false;const target=P.Combat.target(p,P.state.enemies,560*(p.reach||1));if(!target)return false;
  const ratio=Math.max(.08,q.pressure/100),angle=Math.atan2(target.y-p.y,target.x-p.x),range=(210+350*ratio)*(p.reach||1),width=24+20*ratio,damage=p.power*(.26+.42*ratio);p.aim=p.attackAim=angle;p.facing=Math.cos(angle)<0?-1:1;p.primePressureUntil=now+.42;p.primePressureRatio=ratio;p.castUntil=now+.42;q.pressure=Math.max(0,q.pressure-22);if(q.pressure<12){q.recharging=true;p.primeExhaustedUntil=now+1.15}
  for(const e of [...P.state.enemies]){const dx=e.x-p.x,dy=e.y-p.y,along=dx*Math.cos(angle)+dy*Math.sin(angle),side=Math.abs(-dx*Math.sin(angle)+dy*Math.cos(angle));if(e.hp>0&&along>0&&along<range&&side<width+(e.r||0)&&P.Terrain.clear(p.x,p.y,e.x,e.y,4))P.Entities.hurt(e,damage,8+32*ratio,this.source(p))}
  P.state.effects.push({kind:'prime-pressure',x:p.x,y:p.y-14,angle,range,width,ratio,life:.34,maxLife:.34,color:'#f7da45'});P.Audio?.tone?.(170+ratio*150,.12,.035,'sawtooth',0,80);return true
 },
 armSpit(p=P.state.player){const q=this.state(p),now=P.state.elapsed;if(!q.spitArmed){q.spitArmed=true;q.spitCharge=0;p.primeSpitChargeUntil=Infinity;return true}if(q.spitCharge<35)return false;const target=P.Combat.target(p,P.state.enemies,620*(p.reach||1));if(!target)return false;const ratio=q.spitCharge/100,angle=Math.atan2(target.y-p.y,target.x-p.x),speed=360,origin={x:p.x+Math.cos(angle)*20,y:p.y-24};q.spitOrbs.push({x:origin.x,y:origin.y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,r:18+22*ratio,power:p.power*(.7+1.25*ratio),life:1.45,ratio,source:this.source(p)});p.aim=p.attackAim=angle;p.facing=Math.cos(angle)<0?-1:1;p.primeSpitReleaseUntil=now+.5;p.castUntil=now+.5;q.spitArmed=false;q.spitCharge=0;P.Audio?.tone?.(115,.16,.04,'triangle',0,190);return true},
 spitImpact(o,q){const now=P.state.elapsed,r=82+70*o.ratio;q.spitZones.push({x:o.x,y:o.y,r,life:5.5,maxLife:5.5,power:o.power*.16});for(const e of [...P.state.enemies])if(e.hp>0&&Math.hypot(e.x-o.x,e.y-o.y)<r+(e.r||0)){P.Entities.hurt(e,o.power,5,o.source);e.primeDefenseUntil=now+4;e.primeSpitSlowUntil=now+4}P.state.effects.push({kind:'prime-spit-impact',x:o.x,y:o.y,r,life:.6,maxLife:.6,color:'#aaf6ee'})},
 tickSpit(dt,q){for(const o of q.spitOrbs){o.x+=o.vx*dt;o.y+=o.vy*dt;o.life-=dt;const hit=P.state.enemies.some(e=>e.hp>0&&Math.hypot(e.x-o.x,e.y-o.y)<e.r+o.r);if(hit||o.life<=0){this.spitImpact(o,q);o.dead=true}}q.spitOrbs=q.spitOrbs.filter(o=>!o.dead);for(const z of q.spitZones){z.life-=dt;for(const e of P.state.enemies)if(e.hp>0&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+(e.r||0)){e.primeSpitSlowUntil=P.state.elapsed+.14;const turret=q.turrets.find(t=>Math.hypot(t.x-z.x,t.y-z.y)<t.radius+z.r);if(turret&&!e.boss&&!e.mapBoss){const dx=z.x-e.x,dy=z.y-e.y,d=Math.hypot(dx,dy)||1;e.x+=dx/d*18*dt;e.y+=dy/d*18*dt}}}q.spitZones=q.spitZones.filter(z=>z.life>0)},
 activateUltimate(p=P.state.player){const q=this.state(p),now=P.state.elapsed;if(!this.eligible(p)||q.ultimateCharge<100||q.blackHole)return false;const target=P.Combat.target(p,P.state.enemies,560),angle=target?Math.atan2(target.y-p.y,target.x-p.x):p.aim||0;q.ultimateCharge=0;q.blackHole={x:p.x+Math.cos(angle)*190,y:p.y+Math.sin(angle)*190,age:0,life:4.8,r:210,next:0};p.primeUltimateUntil=now+4.8;p.castUntil=now+.8;P.state.effects.push({kind:'shout',text:'¡AGUJERO PRIME!',x:p.x,y:p.y-68,life:.8,maxLife:.8,color:'#d990ff'});P.Audio?.tone?.(72,.5,.06,'sawtooth',0,70);return true},
 tickBlackHole(dt,p,q){const h=q.blackHole;if(!h)return;h.age+=dt;h.life-=dt;for(const e of P.state.enemies){if(e.hp<=0)continue;const dx=h.x-e.x,dy=h.y-e.y,d=Math.hypot(dx,dy)||1;if(d<h.r){const pull=(e.boss||e.mapBoss?35:105)*(1-d/h.r);e.x+=dx/d*pull*dt;e.y+=dy/d*pull*dt;if(h.age>=h.next){P.Entities.hurt(e,p.power*(.12+.42*(1-d/h.r)),0,{...this.source(p),ultimate:true});e.primeDefenseUntil=P.state.elapsed+.7}}}for(const shot of P.state.shots||[]){if(shot.chamelinPrime)continue;const dx=h.x-shot.x,dy=h.y-shot.y,d=Math.hypot(dx,dy)||1;if(d<h.r){shot.vx+=(dx/d*260-shot.vx*.12)*dt;shot.vy+=(dy/d*260-shot.vy*.12)*dt}}if(h.age>=h.next)h.next+=.25;if(h.life<=0){const combo=q.turrets.filter(t=>Math.hypot(t.x-h.x,t.y-h.y)<h.r+t.radius).length+q.puddles.filter(z=>Math.hypot(z.x-h.x,z.y-h.y)<h.r+z.r).length+q.spitZones.filter(z=>Math.hypot(z.x-h.x,z.y-h.y)<h.r+z.r).length;for(const e of [...P.state.enemies])if(e.hp>0&&Math.hypot(e.x-h.x,e.y-h.y)<h.r+(e.r||0))P.Entities.hurt(e,p.power*(1.8+combo*.18),24,{...this.source(p),ultimate:true});P.state.effects.push({kind:'prime-black-hole-finale',x:h.x,y:h.y,r:h.r,life:.7,maxLife:.7,color:'#d86cff'});q.blackHole=null;p.primeUltimateUntil=0;P.Audio?.tone?.(58,.35,.08,'square',0,45)}},
 turretDamage(t,amount){const absorbed=Math.min(t.shield||0,amount);t.shield-=absorbed;t.hp-=amount-absorbed;if(absorbed>0)t.shieldFlash=.22;t.hurtFlash=.16},
 fire(t,p,q){
  if(this.style(p)==='primePressure'){t.taunt=true;return false}
  const target=P.state.enemies.filter(e=>e.hp>0&&Math.hypot(e.x-t.x,e.y-t.y)<=440*(p.reach||1)).sort((a,b)=>Math.hypot(a.x-t.x,a.y-t.y)-Math.hypot(b.x-t.x,b.y-t.y))[0];
  if(!target)return false;const angle=Math.atan2(target.y-t.y,target.x-t.x),muzzle={x:t.x+Math.cos(angle)*24,y:t.y-18+Math.sin(angle)*9};
  q.shots.push({x:muzzle.x,y:muzzle.y,px:muzzle.x,py:muzzle.y,vx:Math.cos(angle)*this.shotSpeed,vy:Math.sin(angle)*this.shotSpeed,life:this.shotLife,power:p.power*.38,source:this.source(p)});
  t.aim=angle;t.shotAt=P.state.elapsed;t.recoil=.22;P.Audio?.tone?.(260,.05,.018,'square',0,80);return true
 },
 tickShots(dt,q){
  for(const shot of q.shots){shot.px=shot.x;shot.py=shot.y;shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.life-=dt;for(const e of P.state.enemies){if(e.hp<=0||Math.hypot(e.x-shot.x,e.y-shot.y)>e.r+9)continue;P.Entities.hurt(e,shot.power,4,shot.source);shot.life=0;break}}
  q.shots=q.shots.filter(s=>s.life>0)
 },
 affectEnemies(dt,q){
  const now=P.state.elapsed,pressureStyle=this.style()==='primePressure';
  for(const e of P.state.enemies){if(e.hp<=0)continue;const inside=this.inside(e.x,e.y,q);if(!inside){e.primeInstability=Math.max(0,(e.primeInstability||0)-dt*.7);continue}
   e.primeSlowUntil=now+.12;e.primeInstability=(e.primeInstability||0)+dt;
   if(pressureStyle&&!e.boss&&!e.mapBoss){const decoy=q.turrets.filter(t=>t.hp>0&&Math.hypot(e.x-t.x,e.y-t.y)<Math.max(230,t.radius*1.8)).sort((a,b)=>Math.hypot(e.x-a.x,e.y-a.y)-Math.hypot(e.x-b.x,e.y-b.y))[0];if(decoy){const dx=decoy.x-e.x,dy=decoy.y-e.y,d=Math.hypot(dx,dy)||1;e.x+=dx/d*34*dt;e.y+=dy/d*34*dt;e.primeDecoyUntil=now+.18}}
   if(!e.boss&&!e.mapBoss&&!e.miniboss&&e.primeInstability>=2.25&&(e.primeSlipImmuneUntil||0)<=now){e.primeInstability=0;e.primeSlipUntil=now+.58;e.primeSlipImmuneUntil=now+3.8;P.state.effects.push({kind:'shout',text:'¡RESBALÓN!',x:e.x,y:e.y-32,life:.5,maxLife:.5,color:'#ffe080'})}
   const near=q.turrets.filter(t=>t.hp>0&&Math.hypot(e.x-t.x,e.y-t.y)<e.r+t.r+5).sort((a,b)=>Math.hypot(e.x-a.x,e.y-a.y)-Math.hypot(e.x-b.x,e.y-b.y))[0];
   if(near&&(e.primeTurretHitAt||0)<=now){this.turretDamage(near,e.heavy?10:6);e.primeTurretHitAt=now+(e.heavy?.55:.8)}
  }
 },
 tick(dt){
  const p=P.state.player;if(!this.eligible(p)||P.state.mode!=='play')return;const q=this.state(p),now=P.state.elapsed;
  P.ChamelinPrimeArsenal.init(p);const style=this.style(p);
  if(style==='primePressure'){q.pressure=Math.min(100,q.pressure+(q.recharging?28:8)*dt);if(q.recharging&&q.pressure>=72){q.recharging=false;p.primeExhaustedUntil=0;P.state.effects.push({kind:'shout',text:'¡PRESIÓN LISTA!',x:p.x,y:p.y-52,life:.45,maxLife:.45,color:'#ffe36c'})}}
  else q.pressure=Math.min(100,q.pressure+18*dt);
  if(style==='primeSpit'&&q.spitArmed){q.spitCharge=Math.min(100,q.spitCharge+32*dt);p.primeSpitCharge=q.spitCharge}
  this.rebuildNetwork(q);p.primeTerritory=this.inside(p.x,p.y,q);
  if(p.primeTerritory&&p.hp>0){const before=p.hp;p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.006*dt);p.primeTerritoryUntil=now+.12;if(p.hp>before)p.primeHealUntil=now+.2}
  for(const t of q.turrets){t.age+=dt;t.life-=dt;t.fire-=dt;t.recoil=Math.max(0,(t.recoil||0)-dt);t.shieldFlash=Math.max(0,(t.shieldFlash||0)-dt);t.hurtFlash=Math.max(0,(t.hurtFlash||0)-dt);if(t.fire<=0){t.fire+=Math.max(.38,.82*(p.rate/4.5));this.fire(t,p,q)}}
  this.tickShots(dt,q);this.tickSpit(dt,q);this.affectEnemies(dt,q);this.tickBlackHole(dt,p,q);
  q.puddles.forEach(v=>v.life-=dt);q.puddles=q.puddles.filter(v=>v.life>0);
  const dead=q.turrets.filter(t=>t.hp<=0||t.life<=0);dead.forEach(t=>this.burst(t,q));q.turrets=q.turrets.filter(t=>t.hp>0&&t.life>0)
 },
 enemySpeed(e){const now=P.state.elapsed;if((e.primeSlipUntil||0)>now)return 0;if((e.primeSpitSlowUntil||0)>now)return (e.boss||e.mapBoss||e.miniboss)?.82:.52;if((e.primeSlowUntil||0)>now)return (e.boss||e.mapBoss||e.miniboss)?.9:.72;return 1},
 hud(){const p=P.state.player;if(!this.eligible(p))return;const q=this.state(p),button=P.$?.('#ultimate'),panel=P.$?.('#passive-hud'),parts=panel?._passive,style=this.style(p);if(button){button.hidden=P.state.mode!=='play';button.disabled=false;button.setAttribute('aria-disabled',String(q.ultimateCharge<100||!!q.blackHole));P.UI.write(button,q.blackHole?'Q · AGUJERO PRIME '+q.blackHole.life.toFixed(1)+'s':'Q · VACÍO '+Math.floor(q.ultimateCharge)+'%')}if(parts&&typeof document!=='undefined'){parts.title.textContent=P.ChamelinPrimeArsenal.names[style];parts.marks.replaceChildren(...(style==='primePressure'?[['PRESIÓN',Math.round(q.pressure)+'%'],['ESTADO',q.recharging?'RECARGA':'LISTO']]:style==='primeSpit'?[['CARGA',Math.round(q.spitCharge)+'%'],['FASE',q.spitArmed?'INFLANDO':'LISTO']]:[['BASE',q.turrets.length],['RED',q.turrets.filter(t=>t.links>0).length]]).map(([a,b])=>Object.assign(document.createElement('i'),{textContent:a+' · '+b})));parts.status.textContent='1 BASE · 2 PRESIÓN · 3 ESCUPITAJO';let meter=panel.querySelector?.('.prime-resource');if(!meter){meter=document.createElement('div');meter.className='prime-resource';meter._bar=document.createElement('b');meter._label=document.createElement('em');meter.append?.(meter._bar,meter._label);panel.append?.(meter)}const bar=meter._bar||meter.querySelector?.('b'),label=meter._label||meter.querySelector?.('em'),visible=style!=='primeTurret',value=style==='primePressure'?q.pressure:q.spitCharge;meter.hidden=!visible;meter.dataset??={};meter.dataset.kind=style;if(bar?.style)bar.style.width=Math.max(0,Math.min(100,value))+'%';if(label)label.textContent=style==='primePressure'?(q.recharging?'RECARGANDO PRESIÓN':'PRESIÓN DEL CHORRO'):(q.spitArmed?'ACUMULANDO ESCUPITAJO':'PULSA PARA INFLAR')}},
 install(){
  const cast=P.Combat.cast,tick=P.Combat.tick,move=P.Systems.move,step=P.Systems.stepBody,hurt=P.Entities.hurt,gain=P.Ultimate.gain,activate=P.Ultimate.activate,hit=P.PlayerFeedback.hit,ultimateHud=P.Ultimate.hud,uiHud=P.UI.hud;
  P.Combat.cast=function(...args){if(P.ChamelinPrime.eligible()){const style=P.ChamelinPrime.style();return style==='primePressure'?P.ChamelinPrime.pressure():style==='primeSpit'?P.ChamelinPrime.armSpit():P.ChamelinPrime.deploy()}return cast.apply(this,args)};
  P.Combat.tick=function(dt){const value=tick.call(this,dt);P.ChamelinPrime.tick(dt);return value};
  P.Systems.move=function(dt){const p=P.state.player,boost=P.ChamelinPrime.eligible(p)&&P.ChamelinPrime.inside(p.x,p.y,P.ChamelinPrime.state(p))?1.14:1;p.speed*=boost;try{return move.call(this,dt)}finally{p.speed/=boost}};
  P.Systems.stepBody=function(e,players,dt,use){const factor=P.ChamelinPrime.enemySpeed(e);if(factor===1)return step.call(this,e,players,dt,use);e.speed*=factor;try{return step.call(this,e,players,dt,use)}finally{e.speed/=factor}};
  P.Entities.hurt=function(e,damage,push,source){if((e?.primeDefenseUntil||0)>P.state.elapsed)damage*=1.22;const before=e?.hp,result=hurt.call(this,e,damage,push,source);if(before>0&&e?.hp<before&&source?.chamelinPrime)P.ChamelinPrime.state(source.owner||P.state.player).ultimateCharge=Math.min(100,P.ChamelinPrime.state().ultimateCharge+(e.boss||e.mapBoss?3:.65));return result};
  P.Ultimate.gain=function(source,e){const result=gain.call(this,source,e);if(source?.chamelinPrime)P.ChamelinPrime.state().ultimateCharge=Math.min(100,P.ChamelinPrime.state().ultimateCharge+(e?.boss||e?.mapBoss?10:2));return result};
  P.Ultimate.activate=function(...args){if(P.ChamelinPrime.eligible())return P.ChamelinPrime.activateUltimate();return activate.apply(this,args)};
  P.Ultimate.hud=function(...args){if(P.ChamelinPrime.eligible()){P.ChamelinPrime.hud();return}return ultimateHud.apply(this,args)};
  P.UI.hud=function(...args){const value=uiHud.apply(this,args);P.ChamelinPrime.hud();return value};
  P.PlayerFeedback.hit=function(p,damage,...args){const before=p?.hp||0,result=hit.call(this,p,damage,...args);if(P.ChamelinPrime.eligible(p)&&p.hp<before){p.primeHurtUntil=P.state.elapsed+.38;if(p.hp<=0)p.primeDefeatUntil=Infinity}return result}
  if(typeof addEventListener==='function')addEventListener('keydown',e=>{if(!e.repeat&&['1','2','3'].includes(e.key)&&P.ChamelinPrime.eligible()&&P.ChamelinPrimeArsenal.request(Number(e.key)))e.preventDefault()},true)
 }
};
P.ChamelinPrime.install();
