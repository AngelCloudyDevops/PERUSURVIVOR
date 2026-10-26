'use strict';
// One authoritative encounter. Targets keep their real HP, loot and original world positions.
P.Domain={entry:1.3,combat:7,exit:.4,serial:0,down:false,queued:false,aim:0,strafe:0,camera:1,
balance:{chargeKills:35,radius:650,reach:4.2,punchCooldown:.4,bossScale:4,bossCap:140,enemyDamage:12},
players(){return P.Court.players()},
eligible(p){return p?.id==='makanaky'&&P.Gacha.tier(p.id)==='ultra'},
input(){return {x:this.strafe||P.Core.direction().x,punch:this.down||this.queued,domainAim:this.aim,ga:!!this.ga}},
activate(){const s=P.state,p=s.player,u=s.ultimate;if(s.mode!=='play'||!this.eligible(p)||p.hp<=0||!u||u.charge<100||s.domain||s.court||s.encounter?.defeat||s.enemies.some(e=>e.phase==='vulture-ultimate'))return false;const id=++this.serial,targets=s.enemies.filter(e=>e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<=this.balance.radius).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y)).slice(0,24).map((e,i)=>{e.domainKey=id+':'+i;return {key:e.domainKey,lane:((i%3)-1)*.12,depth:2.5+i*.55,route:2.5+i*.55,attack:1.4+i*.13,warning:0,hit:0,dead:0}});u.charge=0;s.domain={id,slot:p.slot??0,age:0,lane:0,lean:0,sideSteps:0,aim:0,cooldown:0,punch:0,hand:0,move:0,pending:null,lastStrike:0,combo:0,comboTimer:0,step:0,strike:0,impact:0,freeze:0,ga:0,cheer:0,gaCooldown:0,targets,bolts:[],x:p.x,y:p.y};this.down=this.queued=false;this.aim=0;P.Audio.unlock();P.Audio.tone?.(85,.3,.15,'sawtooth',0,45);P.Core.clear();return true},
owner(d=P.state.domain){return this.players().find(p=>(p.slot??0)===d?.slot)},
offset(t,d){return (t.lane-d.lane)/Math.max(1,t.depth)},
damage(e,amount,d){const s=P.state,finish=P.Game.finish,mapWin=P.Encounters.win,vulture=P.Vulture.defeat;P.Game.finish=win=>{d.result=!!win};P.Encounters.win=()=>{d.mapWin={kind:'normal',key:e.domainKey}};P.Vulture.defeat=()=>{d.mapWin={kind:'vulture',key:e.domainKey}};try{P.Entities.hurt(e,amount,0,{...P.Attributes.source(s.player,'physical'),fixedDamage:!e.boss&&!e.mapBoss&&!e.miniboss})}finally{P.Game.finish=finish;P.Encounters.win=mapWin;P.Vulture.defeat=vulture}return e.hp<=0},
hit(t,d){const s=P.state,e=s.enemies.find(e=>e.domainKey===t.key);if(!e||e.hp<=0||t.dead)return false;const special=e.boss||e.mapBoss||e.miniboss,armor=P.Entities.chargingArmor(e)?P.Entities.chargeResistance:0,amount=special?Math.min(this.balance.bossCap,s.player.power*this.balance.bossScale):e.hp/(1-armor)+1;const hp=e.hp;this.damage(e,amount,d);if(e.hp<hp){t.hit=.3;d.lastStrike=d.strike||0;d.impact=.18;d.freeze=.045;d.combo=(d.combo||0)+1;d.comboTimer=1.1;P.Audio.fx('hit');P.Audio.tone?.([150,135,90,60][d.strike||0],d.strike===3?.19:.1,.12,'triangle',0,35);if(e.hp<=0){t.dead=.42;t.finisher=d.strike===3;d.ga=Math.min(10,d.ga+1)}return true}return false},
resolve(d){const pending=d.pending;if(!pending)return;d.pending=null;const t=d.targets.find(t=>t.key===pending.key&&!t.dead);if(t&&t.depth<=this.balance.reach+(d.strike===3?.65:0)&&Math.abs(this.offset(t,d)-d.aim)<.3&&this.hit(t,d))return;d.combo=0;d.comboTimer=0;P.Audio.tone?.(180,.07,.06,'triangle',0,70)},
tick(dt,inputs){
 const s=P.state,d=s.domain;if(!d||s.mode!=='play')return;dt=Math.min(.1,Math.max(0,dt));const p=this.owner(d);if(!p){s.domain=null;return}
 const previous=s.player,ultimate=s.ultimate;s.player=p;s.ultimate=p.ultimate||ultimate;
 d.age+=dt;d.impact=Math.max(0,(d.impact||0)-dt);d.comboTimer=Math.max(0,(d.comboTimer||0)-dt);if(!d.comboTimer&&!d.pending){d.combo=0;if(d.punch<=0&&d.cooldown<=0&&!inputs?.[d.slot]?.punch)d.step=0}
 const frozen=(d.freeze||0)>0,animDt=frozen?0:dt;d.freeze=Math.max(0,(d.freeze||0)-dt);d.punch=Math.max(0,d.punch-animDt);d.cooldown=Math.max(0,d.cooldown-animDt);d.cheer=Math.max(0,d.cheer-dt);d.gaCooldown=Math.max(0,d.gaCooldown-dt);p.inv=s.practice?1:Math.max(0,(p.inv||0)-dt);
 const input=inputs?.[d.slot]||{};
 if(d.age>=this.entry&&d.age<this.entry+this.combat){
  // Targets stay at a fixed route coordinate. Their projection changes because Makanaky advances.
  const oldMove=d.move||0;if(!frozen)d.move=oldMove+dt*1.45*(d.punch>0?.62:1);
  const oldLane=d.lane;d.lane=Math.max(-1.1,Math.min(1.1,d.lane+(Number(input.x)||0)*dt*1.8));const sideSpeed=dt?(d.lane-oldLane)/dt:0;d.sideSteps=(d.sideSteps||0)+Math.abs(d.lane-oldLane);d.lean=(d.lean||0)+(sideSpeed*.03-(d.lean||0))*Math.min(1,dt*12);d.aim=Number.isFinite(input.domainAim)?Math.max(-1,Math.min(1,input.domainAim)):0;
  for(const [slot,i]of(inputs||[]).entries())if(slot!==d.slot&&i?.ga&&d.gaCooldown<=0){d.cheer=.7;d.gaCooldown=1.2}
  for(const t of d.targets){
   t.hit=Math.max(0,t.hit-dt);if(t.dead){t.dead=Math.max(.001,t.dead-dt);continue}const e=s.enemies.find(e=>e.domainKey===t.key);if(!e||e.hp<=0){t.dead=.001;continue}
   if(!Number.isFinite(t.route))t.route=t.depth+oldMove;t.depth=Math.max(1.25,t.route-(d.move||0));t.attack-=dt;
   if(t.warning>0){t.warning-=dt;if(t.warning<=0){d.bolts.push({...P.Attributes.source(e,'physical'),lane:t.lane,z:Math.min(7,t.depth),hit:false});t.attack=1.8}}else if(t.attack<=0&&t.depth<5)t.warning=.65;
  }
  if(d.pending){d.pending.left-=animDt;if(d.pending.left<=0&&p.hp>0)this.resolve(d)}
  if(input.punch&&d.cooldown<=0&&!d.pending&&d.punch<=0&&p.hp>0){
   d.strike=d.step||0;d.step=(d.strike+1)%4;d.punch=[.34,.34,.46,.6][d.strike];d.punchLength=d.punch;d.cooldown=d.punch;d.hand=d.strike%2;
   const target=d.targets.filter(t=>!t.dead&&t.depth<=this.balance.reach+(d.strike===3?.65:0)&&Math.abs(this.offset(t,d)-d.aim)<.3).sort((a,b)=>a.depth-b.depth)[0];d.pending={key:target?.key||null,left:d.punchLength*.4};
  }
  for(const b of d.bolts){b.z-=dt*6;if(b.z<=.7&&!b.hit){b.hit=true;if(Math.abs(b.lane-d.lane)<.4&&p.inv<=0){P.PlayerFeedback.hit(p,this.balance.enemyDamage,{...b,x:p.x+1,y:p.y});p.inv=.7}}}d.bolts=d.bolts.filter(b=>b.z>.3);if(p.hp<=0){d.pending=null;d.age=this.entry+this.combat}
 }
 if(d.age>=this.entry+this.combat&&!d.remate){d.remate=true;d.pending=null;if(p.hp>0)for(const t of d.targets){if(t.dead)continue;const e=s.enemies.find(e=>e.domainKey===t.key);if(!e||e.hp<=0)continue;this.damage(e,Math.min(180,p.power*(2+d.ga*.2)),d);if(e.hp<=0)t.dead=.28}P.Audio.play('stamp')}
 s.player=previous;s.ultimate=ultimate;if(d.age>=this.entry+this.combat+this.exit)this.end();
},
end(){const s=P.state,d=s.domain;if(!d)return;const mapBoss=d.mapWin?s.enemies.find(e=>e.domainKey===d.mapWin.key):null;s.enemies=s.enemies.filter(e=>e.hp>0);for(const e of s.enemies)delete e.domainKey;for(const p of this.players())if(p.hp>0)p.inv=Math.max(p.inv||0,1);s.domain=null;P.Core.canvas?.setAttribute('aria-label','Arena: '+P.Maps.current().name);this.down=this.queued=this.ga=false;this.strafe=0;P.Core.clear();if(d.mapWin){if(d.mapWin.kind==='vulture'&&mapBoss)P.Vulture.defeat(mapBoss);else P.Encounters.win()}else if(d.result!==undefined)P.Game.finish(d.result);else if(this.owner(d)?.hp<=0)P.Game.finish(false)},
hud(){const b=P.$('#ultimate'),s=P.state;if(!this.eligible(s.player)||!b)return;b.hidden=s.mode!=='play';b.disabled=!!s.domain||(s.ultimate?.charge||0)<100;P.UI.write(b,s.domain?'DOMINIO · EN CURSO':'Q · EXPANSIÓN DE DOMINIO '+Math.floor(s.ultimate?.charge||0)+'%')}
};
{const activate=P.Ultimate.activate,gain=P.Ultimate.gain,hud=P.Ultimate.hud,update=P.Game.update,start=P.Game.start,hit=P.PlayerFeedback.hit;
P.Ultimate.activate=function(...args){if(P.Coop?.active)return activate.apply(this,args);if(P.state.domain)return false;return P.Domain.eligible(P.state.player)?P.Domain.activate():activate.apply(this,args)};
P.Ultimate.gain=function(...args){if(P.state.domain)return;if(P.Domain.eligible(P.state.player)){const u=P.state.ultimate;if(u)u.charge=Math.min(100,u.charge+100/P.Domain.balance.chargeKills);return}return gain.apply(this,args)};
P.Ultimate.hud=function(){return P.Domain.eligible(P.state.player)?P.Domain.hud():hud.call(this)};
P.Game.update=function(dt){if(P.state.domain&&!P.Coop?.active){if(P.state.mode==='play'){const input=P.Domain.input();P.Domain.tick(dt,[input]);P.Domain.queued=false;P.UI.hud()}return}return update.call(this,dt)};
P.Game.start=function(...args){P.state.domain=null;P.Domain.down=P.Domain.queued=false;return start.apply(this,args)};
P.PlayerFeedback.hit=function(p,...args){const d=P.state.domain;if(d&&((p.slot??0)!==d.slot||d.age<P.Domain.entry))return 0;return hit.call(this,p,...args)};
}

{const hud=P.UI.hud;P.UI.hud=function(...args){const result=hud.apply(this,args);if(P.Domain.eligible(P.state.player)&&P.state.practice){P.$('#practice-tools b').textContent='PRÁCTICA MAKANAKY';P.$('#level').textContent='DOMINIO · PROTOTIPO · SIN RÉCORDS'}return result}}
