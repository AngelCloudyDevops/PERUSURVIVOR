'use strict';
// Chamelín Prime is a separate playable version. Its primary attack builds a
// temporary base instead of requiring a target. Attack speed controls how often
// a turret is deployed; there is deliberately no hard turret-count cap.
P.ChamelinPrime={
 id:'chamelinPrime',territoryRadius:118,turretLife:22,turretHp:42,shotSpeed:520,shotLife:1.1,
 eligible(p=P.state.player){return p?.id===this.id},
 state(p=P.state.player){
  const s=P.state;
  if(!s.chamelinPrime||s.chamelinPrime.owner!==p)s.chamelinPrime={owner:p,serial:0,turrets:[],shots:[],puddles:[]};
  return s.chamelinPrime
 },
 source(p){return {...P.Attributes.source(p,'special'),weaponAttack:true,chamelinPrime:true}},
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
 turretDamage(t,amount){const absorbed=Math.min(t.shield||0,amount);t.shield-=absorbed;t.hp-=amount-absorbed;if(absorbed>0)t.shieldFlash=.22;t.hurtFlash=.16},
 fire(t,p,q){
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
  const now=P.state.elapsed;
  for(const e of P.state.enemies){if(e.hp<=0)continue;const inside=this.inside(e.x,e.y,q);if(!inside){e.primeInstability=Math.max(0,(e.primeInstability||0)-dt*.7);continue}
   e.primeSlowUntil=now+.12;e.primeInstability=(e.primeInstability||0)+dt;
   if(!e.boss&&!e.mapBoss&&!e.miniboss&&e.primeInstability>=2.25&&(e.primeSlipImmuneUntil||0)<=now){e.primeInstability=0;e.primeSlipUntil=now+.58;e.primeSlipImmuneUntil=now+3.8;P.state.effects.push({kind:'shout',text:'¡RESBALÓN!',x:e.x,y:e.y-32,life:.5,maxLife:.5,color:'#ffe080'})}
   const near=q.turrets.filter(t=>t.hp>0&&Math.hypot(e.x-t.x,e.y-t.y)<e.r+t.r+5).sort((a,b)=>Math.hypot(e.x-a.x,e.y-a.y)-Math.hypot(e.x-b.x,e.y-b.y))[0];
   if(near&&(e.primeTurretHitAt||0)<=now){this.turretDamage(near,e.heavy?10:6);e.primeTurretHitAt=now+(e.heavy?.55:.8)}
  }
 },
 tick(dt){
  const p=P.state.player;if(!this.eligible(p)||P.state.mode!=='play')return;const q=this.state(p),now=P.state.elapsed;
  this.rebuildNetwork(q);p.primeTerritory=this.inside(p.x,p.y,q);
  if(p.primeTerritory&&p.hp>0){p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.006*dt);p.primeTerritoryUntil=now+.12}
  for(const t of q.turrets){t.age+=dt;t.life-=dt;t.fire-=dt;t.recoil=Math.max(0,(t.recoil||0)-dt);t.shieldFlash=Math.max(0,(t.shieldFlash||0)-dt);t.hurtFlash=Math.max(0,(t.hurtFlash||0)-dt);if(t.fire<=0){t.fire+=Math.max(.38,.82*(p.rate/4.5));this.fire(t,p,q)}}
  this.tickShots(dt,q);this.affectEnemies(dt,q);
  q.puddles.forEach(v=>v.life-=dt);q.puddles=q.puddles.filter(v=>v.life>0);
  const dead=q.turrets.filter(t=>t.hp<=0||t.life<=0);dead.forEach(t=>this.burst(t,q));q.turrets=q.turrets.filter(t=>t.hp>0&&t.life>0)
 },
 enemySpeed(e){const now=P.state.elapsed;if((e.primeSlipUntil||0)>now)return 0;if((e.primeSlowUntil||0)>now)return (e.boss||e.mapBoss||e.miniboss)?.9:.72;return 1},
 install(){
  const cast=P.Combat.cast,tick=P.Combat.tick,move=P.Systems.move,step=P.Systems.stepBody;
  P.Combat.cast=function(...args){if(P.ChamelinPrime.eligible())return P.ChamelinPrime.deploy();return cast.apply(this,args)};
  P.Combat.tick=function(dt){const value=tick.call(this,dt);P.ChamelinPrime.tick(dt);return value};
  P.Systems.move=function(dt){const p=P.state.player,boost=P.ChamelinPrime.eligible(p)&&P.ChamelinPrime.inside(p.x,p.y,P.ChamelinPrime.state(p))?1.14:1;p.speed*=boost;try{return move.call(this,dt)}finally{p.speed/=boost}};
  P.Systems.stepBody=function(e,players,dt,use){const factor=P.ChamelinPrime.enemySpeed(e);if(factor===1)return step.call(this,e,players,dt,use);e.speed*=factor;try{return step.call(this,e,players,dt,use)}finally{e.speed/=factor}}
 }
};
P.ChamelinPrime.install();
