'use strict';
// One authoritative encounter. Targets keep their real HP, loot and original world positions.
P.Domain={entry:3,combat:9,exit:1.35,serial:0,down:false,queued:false,aim:0,strafe:0,camera:1,waveSize:7,waveGap:1.35,
balance:{chargeKills:35,reach:4.2,punchCooldown:.4,bossScale:4,bossCap:140,enemyDamage:12},
players(){return P.Court.players()},
eligible(p){return p?.id==='makanaky'&&P.Gacha.tier(p.id)==='ultra'},
input(){return {x:this.strafe||P.Core.direction().x,punch:this.down||this.queued,domainAim:this.aim,ga:!!this.ga}},
lane(index){return [-.8,-.4,0,.4,.8,-.6,.6][index%this.waveSize]},
place(index,offset=0){const slot=index%this.waveSize,wave=Math.floor(index/this.waveSize),route=offset+2.5+wave*this.waveGap+slot*.04;return {slot,wave,lane:this.lane(slot),route,depth:route}},
special(e){return !!(e.boss||e.mapBoss||e.miniboss)},
activate(){if(P.Coop?.active)return P.Coop.requestDomain();const s=P.state,p=s.player,u=s.ultimate;if(typeof Image!=='undefined'&&P.DomainIntro&&!P.DomainIntro.ready){P.DomainIntro.load();return false}if(s.mode!=='play'||!this.eligible(p)||p.hp<=0||!u||u.charge<100||s.domain||s.court||s.encounter?.defeat||s.enemies.some(e=>e.phase==='vulture-ultimate'))return false;const id=++this.serial,targets=s.enemies.filter(e=>e.hp>0).sort((a,b)=>Number(this.special(a))-Number(this.special(b))||Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y)).map((e,i)=>{e.domainKey=id+':'+i;const place=this.place(i);return {key:e.domainKey,...place,attack:1.05+place.wave*.08+(place.slot%3)*.06,warning:0,hit:0,dead:0}});u.charge=0;s.domain={id,slot:p.slot??0,age:0,lane:0,lean:0,sideSteps:0,aim:0,cooldown:0,punch:0,hand:0,move:0,pending:null,lastStrike:0,combo:0,comboTimer:0,step:0,strike:0,impact:0,freeze:0,ga:0,cheer:0,gaCooldown:0,rush:0,waveFlash:0,companionShock:0,assistFlash:0,assistCount:0,defeated:0,peakCombo:0,damageTaken:0,respawnSerial:Math.ceil(targets.length/this.waveSize)*this.waveSize,respawnWaveRoute:0,targets,bolts:[],x:p.x,y:p.y};this.down=this.queued=false;this.aim=0;P.Audio.unlock();P.Audio.tone?.(85,.3,.15,'sawtooth',0,45);P.Core.clear();return true},
owner(d=P.state.domain){return this.players().find(p=>(p.slot??0)===d?.slot)},
offset(t,d){return (t.lane-d.lane)/Math.max(1,t.depth)},
aimTolerance(t){return .38+Math.min(.1,.2/Math.max(1,t.depth))},
damage(e,amount,d){const hp=e.hp,s=P.state,finish=P.Game.finish,mapWin=P.Encounters.win,vulture=P.Vulture.defeat;P.Game.finish=win=>{d.result=!!win};P.Encounters.win=()=>{d.mapWin={kind:'normal',key:e.domainKey}};P.Vulture.defeat=()=>{d.mapWin={kind:'vulture',key:e.domainKey}};try{P.Entities.hurt(e,amount,0,{...P.Attributes.source(s.player,'physical'),fixedDamage:!e.boss&&!e.mapBoss&&!e.miniboss})}finally{P.Game.finish=finish;P.Encounters.win=mapWin;P.Vulture.defeat=vulture}if(e.hp<=0&&hp>0)d.defeated=(d.defeated||0)+1;return e.hp<=0},
recycle(t,d,e){if(!P.state.practice||P.TestBench?.minionMode!=='respawn'||!e||e.boss||e.mapBoss||e.miniboss||t.dead>.001)return false;e.hp=e.max;e.hit=0;e.castUntil=0;delete e.rangedAim;delete e.burst;delete e.charge;const order=d.respawnSerial++,slot=order%this.waveSize;if(slot===0||!d.respawnWaveRoute||d.respawnWaveRoute<(d.move||0)+2.7)d.respawnWaveRoute=(d.move||0)+3.1;t.slot=slot;t.wave=Math.floor(order/this.waveSize);t.lane=this.lane(slot);t.route=d.respawnWaveRoute+slot*.04;t.depth=t.route-(d.move||0);if(slot===this.waveSize-1)d.respawnWaveRoute+=this.waveGap;t.attack=.95+(slot%3)*.06;t.warning=t.hit=t.dead=0;delete t.decap;delete t.deathSide;delete t.deathStrike;delete t.deathMax;delete t.deathCombo;delete t.finisher;if(P.TestBench?.respawns)P.TestBench.respawns=P.TestBench.respawns.filter(q=>q.enemy!==e);return true},
hit(t,d){const s=P.state,e=s.enemies.find(e=>e.domainKey===t.key);if(!e||e.hp<=0||t.dead)return false;const strike=d.strike||0,special=e.boss||e.mapBoss||e.miniboss,armor=P.Entities.chargingArmor(e)?P.Entities.chargeResistance:0,amount=special?Math.min(this.balance.bossCap,s.player.power*this.balance.bossScale):e.hp/(1-armor)+1;const hp=e.hp;this.damage(e,amount,d);if(e.hp<hp){t.hit=.36;t.hitSide=strike%2===0?1:-1;d.lastStrike=strike;d.impact=.24;d.freeze=[.035,.035,.05,.075][strike];d.combo=(d.combo||0)+1;d.peakCombo=Math.max(d.peakCombo||0,d.combo);d.comboTimer=1.25;if(d.combo%4===0){const assisted=d.cheer>0;d.rush=assisted?1.25:.8;d.waveFlash=.55;if(assisted){d.assistFlash=1;d.assistCount=(d.assistCount||0)+1;P.Audio.tone?.(420,.16,.11,'square',0,80)}}P.Audio.fx('hit');P.Audio.tone?.([150,135,90,60][strike],strike===3?.22:.12,.14,'triangle',0,30);if(e.hp<=0){t.decap=!special;t.deathSide=t.hitSide;t.deathStrike=strike;t.deathMax=t.decap?1.05:.42;t.dead=t.deathMax;t.deathCombo=d.combo;t.finisher=t.decap;d.ga=Math.min(10,d.ga+1)}return true}return false},
resolve(d){const pending=d.pending;if(!pending)return;d.pending=null;const t=d.targets.find(t=>t.key===pending.key&&!t.dead);if(t&&t.depth<=this.balance.reach+(d.strike===3?.65:0)&&this.hit(t,d))return;d.combo=0;d.comboTimer=0;d.miss=.35;P.Audio.tone?.(180,.07,.06,'triangle',0,70)},
tick(dt,inputs){
 const s=P.state,d=s.domain;if(!d||s.mode!=='play')return;dt=Math.min(.1,Math.max(0,dt));const p=this.owner(d);if(!p){s.domain=null;return}
 const previous=s.player,ultimate=s.ultimate;s.player=p;s.ultimate=p.ultimate||ultimate;
 d.age+=dt;if(d.age<this.entry)for(const q of this.players())if(q.hp>0)q.inv=Math.max(q.inv||0,dt+.1);d.impact=Math.max(0,(d.impact||0)-dt);d.miss=Math.max(0,(d.miss||0)-dt);d.rush=Math.max(0,(d.rush||0)-dt);d.waveFlash=Math.max(0,(d.waveFlash||0)-dt);d.companionShock=Math.max(0,(d.companionShock||0)-dt);d.assistFlash=Math.max(0,(d.assistFlash||0)-dt);d.comboTimer=Math.max(0,(d.comboTimer||0)-dt);if(!d.comboTimer&&!d.pending){d.combo=0;if(d.punch<=0&&d.cooldown<=0&&!inputs?.[d.slot]?.punch)d.step=0}
 const frozen=(d.freeze||0)>0,animDt=frozen?0:dt;d.freeze=Math.max(0,(d.freeze||0)-dt);d.punch=Math.max(0,d.punch-animDt);d.cooldown=Math.max(0,d.cooldown-animDt);d.cheer=Math.max(0,d.cheer-dt);d.gaCooldown=Math.max(0,d.gaCooldown-dt);p.inv=s.practice?1:Math.max(0,(p.inv||0)-dt);
 const input=inputs?.[d.slot]||{};
 if(d.age>=this.entry&&d.age<this.entry+this.combat){
  // Targets stay at a fixed route coordinate. Their projection changes because Makanaky advances.
  const oldMove=d.move||0;if(!frozen)d.move=oldMove+dt*2.05*(d.punch>0?.78:1)*(d.rush>0?1.38:1);
  const oldLane=d.lane;d.lane=Math.max(-1.1,Math.min(1.1,d.lane+(Number(input.x)||0)*dt*1.8));const sideSpeed=dt?(d.lane-oldLane)/dt:0;d.sideSteps=(d.sideSteps||0)+Math.abs(d.lane-oldLane);d.lean=(d.lean||0)+(sideSpeed*.03-(d.lean||0))*Math.min(1,dt*12);d.aim=Number.isFinite(input.domainAim)?Math.max(-1,Math.min(1,input.domainAim)):0;
  for(const [slot,i]of(inputs||[]).entries())if(slot!==d.slot&&i?.ga&&d.gaCooldown<=0){d.cheer=.7;d.gaCooldown=1.2}
  for(const t of d.targets){
   t.hit=Math.max(0,t.hit-dt);const e=s.enemies.find(e=>e.domainKey===t.key);if(t.dead){t.dead=Math.max(.001,t.dead-dt);this.recycle(t,d,e);continue}if(!e||e.hp<=0){t.dead=.001;continue}
   if(!Number.isFinite(t.route))t.route=t.depth+oldMove;t.depth=Math.max(1.25,t.route-(d.move||0));t.attack-=dt;
   if(t.warning>0){t.warning-=dt;if(t.warning<=0){d.bolts.push({...P.Attributes.source(e,'physical'),lane:t.lane,z:Math.min(7,t.depth),hit:false});t.attack=1.8}}else if(t.attack<=0&&t.depth<5)t.warning=.65;
  }
  if(d.pending){d.pending.left-=animDt;if(d.pending.left<=0&&p.hp>0)this.resolve(d)}
  if(input.punch&&d.cooldown<=0&&!d.pending&&d.punch<=0&&p.hp>0){
   d.strike=d.step||0;d.step=(d.strike+1)%4;d.punch=[.25,.25,.34,.46][d.strike];d.punchLength=d.punch;d.cooldown=d.punch;d.hand=d.strike%2;
   const target=d.targets.filter(t=>!t.dead&&t.depth<=this.balance.reach+(d.strike===3?.65:0)&&Math.abs(this.offset(t,d)-d.aim)<this.aimTolerance(t)).sort((a,b)=>Math.abs(this.offset(a,d)-d.aim)-Math.abs(this.offset(b,d)-d.aim)||a.depth-b.depth)[0];d.pending={key:target?.key||null,left:d.punchLength*.4};
  }
  for(const b of d.bolts){b.z-=dt*6;if(b.z<=.7&&!b.hit){b.hit=true;if(Math.abs(b.lane-d.lane)<.4&&p.inv<=0){P.PlayerFeedback.hit(p,this.balance.enemyDamage,{...b,x:p.x+1,y:p.y});p.inv=.7;d.companionShock=.7}}}d.bolts=d.bolts.filter(b=>b.z>.3);if(p.hp<=0){d.pending=null;d.age=this.entry+this.combat}
 }
 if(d.age>=this.entry+this.combat&&!d.remate){d.remate=true;d.pending=null;d.punch=0;d.bolts=[]}
 if(d.remate&&!d.remateImpact&&d.age>=this.entry+this.combat+.26){d.remateImpact=true;if(p.hp>0)for(const t of d.targets){if(t.dead)continue;const e=s.enemies.find(e=>e.domainKey===t.key);if(!e||e.hp<=0)continue;this.damage(e,Math.min(180,p.power*(2+d.ga*.2)),d);t.hit=.36;t.finalBlast=true;if(e.hp<=0)t.dead=.28}}

 s.player=previous;s.ultimate=ultimate;if(d.age>=this.entry+this.combat+this.exit)this.end();
},
end(){const s=P.state,d=s.domain;if(!d)return;P.DomainAftermath?.apply(d);const mapBoss=d.mapWin?s.enemies.find(e=>e.domainKey===d.mapWin.key):null;s.enemies=s.enemies.filter(e=>e.hp>0);for(const e of s.enemies)delete e.domainKey;for(const p of this.players())if(p.hp>0)p.inv=Math.max(p.inv||0,1);s.domain=null;P.Core.canvas?.setAttribute('aria-label','Arena: '+P.Maps.current().name);this.down=this.queued=this.ga=false;this.strafe=0;P.Core.clear();if(d.mapWin){if(d.mapWin.kind==='vulture'&&mapBoss)P.Vulture.defeat(mapBoss);else P.Encounters.win()}else if(d.result!==undefined)P.Game.finish(d.result);else if(this.owner(d)?.hp<=0)P.Game.finish(false)},
hud(){const b=P.$('#domain-ability'),s=P.state,u=s.ultimate;if(!b)return;const charge=Math.max(0,Math.min(100,u?.charge||0)),active=!!s.domain,ready=charge>=100&&!active&&!(typeof Image!=='undefined'&&P.DomainIntro&&!P.DomainIntro.ready&&!P.DomainIntro.failed);b.hidden=s.mode!=='play'||!this.eligible(s.player);b.disabled=active||charge<100||(typeof Image!=='undefined'&&P.DomainIntro&&!P.DomainIntro.ready&&!P.DomainIntro.failed);P.AbilityCards?.apply(b,'makanaky','domain',charge,ready,active);b.setAttribute('aria-label','Expansión de dominio · tecla R');P.UI.write(b,active?'R · DOMINIO EN CURSO':'R · DOMINIO '+Math.floor(charge)+'%')}
};
{const activate=P.Ultimate.activate,gain=P.Ultimate.gain,hud=P.Ultimate.hud,update=P.Game.update,start=P.Game.start,hit=P.PlayerFeedback.hit;
P.Ultimate.activate=function(...args){if(P.Coop?.active)return activate.apply(this,args);return activate.apply(this,args)};
P.Ultimate.gain=function(...args){if(P.state.domain)return;if(P.Domain.eligible(P.state.player)){const u=P.state.ultimate;if(u)u.charge=Math.min(100,u.charge+100/P.Domain.balance.chargeKills);return}return gain.apply(this,args)};
P.Ultimate.hud=function(){hud.call(this);P.Domain.hud()};
P.Game.update=function(dt){if(P.state.domain&&!P.Coop?.active){if(P.state.mode==='play'){const input=P.Domain.input();P.Domain.tick(dt,[input]);P.Domain.queued=false;P.UI.hud()}return}return update.call(this,dt)};
P.Game.start=function(...args){P.state.domainAftermath=null;P.state.domain=null;P.Domain.down=P.Domain.queued=false;return start.apply(this,args)};
P.PlayerFeedback.hit=function(p,...args){const d=P.state.domain;if(d&&((p.slot??0)!==d.slot||d.age<P.Domain.entry))return 0;const before=Math.max(0,p.hp||0),result=hit.call(this,p,...args);if(d&&(p.slot??0)===d.slot)d.damageTaken=(d.damageTaken||0)+Math.max(0,before-Math.max(0,p.hp||0));return result};
}

{const hud=P.UI.hud;P.UI.hud=function(...args){const result=hud.apply(this,args);if(P.Domain.eligible(P.state.player)&&P.state.practice){P.$('#practice-tools b').textContent='PRÁCTICA MAKANAKY';P.$('#level').textContent='DOMINIO · PROTOTIPO · SIN RÉCORDS'}return result}}
