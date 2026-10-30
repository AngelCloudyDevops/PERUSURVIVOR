'use strict';
// Estado por jugador, compartido por individual y VM autoritativa cooperativa.
P.SideralArsenal={
 order:['sideralFear','sideralTail','sideralEgg'],gates:[0,6,8,10,12],
 names:{sideralFear:'Mirada Sideral',sideralTail:'Colazo del Lagarto',sideralEgg:'Huevo sospechoso'},
 profiles:{
  sideralFear:{...P.Data.attacks.sideralFear,damageScale:1,damageType:'special'},
  sideralTail:{name:'Colazo del Lagarto',description:'Barrido físico de 135°: abre una salida, con recuperación larga.',kind:'melee',cooldown:1.65,range:125,arc:Math.PI*.75,damageScale:1.25,push:34,damageType:'physical',glyph:'COLA'},
  sideralEgg:{name:'Huevo sospechoso',description:'Lanza un huevo que abre tras 0,8 s y libera un lagartito de una embestida.',kind:'nest',cooldown:2.1,range:340,damageScale:1.65,delay:.8,damageType:'special',glyph:'HUEVO'}
 },
 evolutions:{
  sideralFear:{...P.Evolutions.profiles.sideral,damageScale:1.15,damageType:'special'},
  sideralTail:{name:'Latigazo ancestral',description:'El colazo libera una onda estrecha: +0,65× daño hasta 280 u; puede conectar junto al barrido.',range:145,damageScale:1.45,push:40,wave:true},
  sideralEgg:{name:'Nido prohibido',description:'Tres lagartitos salen en abanico; un rival recibe como máximo dos impactos por huevo.',damageScale:1.2,count:3,maxHits:2}
 },
 init(p){if(p?.id!=='sideral')return null;return p.sideralArsenal??={active:'sideralFear',unlocked:{sideralFear:true,sideralTail:false,sideralEgg:false},ranks:{sideralFear:1,sideralTail:0,sideralEgg:0},evolved:{},lastSwitch:-1}},
 active(p){return this.init(p)?.active||'sideralFear'},evolution(id){return this.evolutions[id]||null},
 attackFor(p,id){const state=this.init(p),base=this.profiles[id];if(!state||!base)return null;const rank=Math.max(1,state.ranks[id]||1),evolved=!!state.evolved[id]||(id==='sideralFear'&&!!p.evolved?.primary),e=evolved?this.evolutions[id]:{},reach=P.CharacterBalance?.attackReach?.(p,id)||1;return {...base,...e,arsenalId:id,evolution:evolved,range:(e.range||base.range)*(1+(rank-1)*.05)*reach,damageScale:(e.damageScale||base.damageScale)*(1+(rank-1)*.14),cooldown:base.cooldown*Math.pow(.96,rank-1)}},
 attack(p){return this.attackFor(p,this.active(p))},
 request(index){const p=P.state.player;if(p?.id!=='sideral'||P.state.mode!=='play')return false;if(P.Coop?.active){P.Coop.weapon=index;return true}return this.switch(p,index)},
 switch(p,index,force=false){const state=this.init(p),id=this.order[Number(index)-1],now=P.state.elapsed||0;if(!state||!id||!state.unlocked[id]||state.active===id||!force&&now-state.lastSwitch<.3)return false;const factor=p.rate/this.attack(p).cooldown;state.active=id;state.lastSwitch=now;p.rate=Math.max(.14,this.attack(p).cooldown*factor);P.state.fire=Math.min(P.state.fire,p.rate);return true},
 card(p){const state=this.init(p),level=P.state.level;if(!state)return null;let action,id;for(const [key,gate]of [['sideralTail',2],['sideralEgg',4]])if(!state.unlocked[key]&&level>=gate){action='unlock';id=key;break}id??=state.active;const rank=state.ranks[id]||0;if(!action&&rank<5&&level>=this.gates[rank])action='rank';if(!action&&rank===5&&!state.evolved[id]&&level>=14)action='evolve';if(!action)return null;const e=this.evolution(id);return{id:'sideral-arsenal:'+action+':'+id,title:action==='unlock'?'NUEVA TÉCNICA · '+this.names[id]:action==='evolve'?'EVOLUCIONAR · '+e.name:this.names[id]+' · Rango '+(rank+1)+'/5',description:action==='unlock'?this.profiles[id].description:action==='evolve'?e.description:'+14 % daño, +5 % alcance y −4 % intervalo de esta técnica.',badge:action==='evolve'?'EVOLUCIÓN':'LAGARTO',icon:id==='sideralEgg'?'orbit':'wave',rarity:action==='evolve'?'legendary':'rare'}},
 apply(p,id){const state=this.init(p),[,action,key]=id.split(':'),rank=state?.ranks[key]||0,level=P.state.level;if(!state||!this.profiles[key])return false;if(action==='unlock'&&!state.unlocked[key]&&level>=(key==='sideralTail'?2:4)){state.unlocked[key]=true;state.ranks[key]=1;this.switch(p,this.order.indexOf(key)+1,true);return true}if(!state.unlocked[key])return false;if(action==='rank'&&rank<5&&level>=this.gates[rank]){const factor=p.rate/this.attack(p).cooldown;state.ranks[key]++;p.rate=Math.max(.14,this.attack(p).cooldown*factor);return true}if(action==='evolve'&&rank===5&&level>=14&&!state.evolved[key]){state.evolved[key]=true;return true}return false},
 summary(p){const a=this.init(p);return a?this.order.map((id,i)=>(i+1)+' '+(a.unlocked[id]?(a.active===id?'▸ ':'')+this.names[id]+' R'+a.ranks[id]+(a.evolved[id]?' ★':''):'Bloqueada')).join(' · '):''}
};

P.SideralKit={serial:0,duration:6,breathInterval:.24,
 eligible(p){return p?.id==='sideral'&&!p.miniboss},
 active(p=P.state.player){return this.eligible(p)&&p.hp>0&&(p.sideralUltimateUntil||0)>(P.state.elapsed||0)},
 passive(p){return p.sideralPassive??={id:'sideral',stacks:0,progress:0,lastAt:P.state.elapsed||0}},
 key(e){return P.Combat.targetKey(e)||(e.sideralTargetId??='lagarto:'+ ++this.serial)},
 source(p,type){return {...P.Attributes.source(p,type),weaponAttack:true,comboBlocked:this.active(p)}},
 hit(p,e,scale,type,push=0,ultimate=false){if(e.hp<=0)return;const source=this.source(p,type);source.ultimate=ultimate;source.comboBlocked=ultimate;const damage=P.DotaItems?.criticalDamage(p.power*scale,source,e)??p.power*scale;P.Entities.hurt(e,damage,push,source)},
 pose(p,kind,duration=.45){const now=P.state.elapsed||0;p.sideralCast={kind,start:now,duration,angle:p.aim};p.castStarted=now;p.castUntil=now+duration;p.attackAim=p.aim;p.aimUntil=now+duration;p.castSerial=(p.castSerial||0)+1},
 fear(p,e,a){const s=P.state;if(s.elapsed<(e.fearResistUntil||0))return;const base=(e.boss||e.mapBoss)? .18:e.miniboss? .28:e.heavy? .55:(a.fearDuration||.9),duration=P.Stats.statusDuration(e,base);e.fearUntil=s.elapsed+duration;e.fearResistUntil=s.elapsed+(a.fearCooldown||2.5);e.rangedAim=null;e.burst=null;if(e.tactic)P.MinionTactics?.cancel?.(e);if(!e.boss&&!e.mapBoss&&!e.miniboss){const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy)||1;e.charge={x:dx/d,y:dy/d,time:duration,speed:e.heavy?150:230,damage:0}}},
 cast(){const s=P.state,p=s.player,a=P.SideralArsenal.attack(p);if(p.hp<=0||this.active(p))return false;const props=P.Terrain.active().filter(o=>o.solid&&Number.isFinite(o.hp)&&o.hp>0),target=P.Combat.target(p,s.enemies,a.range*p.reach)||P.Combat.target(p,props,a.range*p.reach);if(!target)return false;const passive=this.passive(p),primed=passive.stacks===3;p.aim=Math.atan2(target.y-p.y,target.x-p.x);p.facing=Math.cos(p.aim)<0?-1:1;this.pose(p,a.arsenalId==='sideralTail'?'tail':a.arsenalId==='sideralEgg'?'egg':'fear');P.Audio.fx('attack');
  if(a.arsenalId==='sideralEgg'){const nests=p.sideralEggs??=[];if(nests.length>=3){p.sideralCast=null;return false}const distance=Math.min(a.range*p.reach,Math.hypot(target.x-p.x,target.y-p.y));let x=p.x,y=p.y;for(let d=12;d<=distance;d+=12){const tx=p.x+Math.cos(p.aim)*d,ty=p.y+Math.sin(p.aim)*d;if(P.Terrain.hit(tx,ty,8))break;x=tx;y=ty}nests.push({id:++this.serial,x,y,fromX:p.x,fromY:p.y,age:0,delay:primed?.25:a.delay,count:a.count||1,maxHits:a.maxHits||1,angle:p.aim,targetKey:s.enemies.includes(target)?this.key(target):null,track:{x:target.x,y:target.y},power:p.power*a.damageScale,source:this.source(p,'special'),hits:{},runners:[]})}
  else {const range=a.range*p.reach,arc=a.arc*(primed&&a.arsenalId==='sideralTail'?1.3:1);for(const o of props)if(P.Combat.inArc(p,o,range,arc))P.Terrain.damage(o,p.power*a.damageScale);for(const e of [...s.enemies])if(e.hp>0&&P.Combat.inArc(p,e,range,arc)&&P.Terrain.clear(p.x,p.y,e.x,e.y,5)){this.hit(p,e,a.damageScale,a.damageType,a.push);if(a.fear)this.fear(p,e,a);if(s.mode!=='play')break}
   if(a.arsenalId==='sideralFear'&&primed){const extra=s.enemies.filter(e=>e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)>range+(e.r||0)&&P.Combat.inArc(p,e,range+70,arc)&&P.Terrain.clear(p.x,p.y,e.x,e.y,5)).sort((x,y)=>Math.hypot(x.x-p.x,x.y-p.y)-Math.hypot(y.x-p.x,y.y-p.y))[0];if(extra){this.hit(p,extra,a.damageScale,'special');this.fear(p,extra,a)}}
   if(a.wave){const speed=650,reach=280*p.reach;s.shots.push({...this.source(p,'physical'),x:p.x,y:p.y,vx:Math.cos(p.aim)*speed,vy:Math.sin(p.aim)*speed,angle:p.aim,life:reach/speed,age:0,history:[],kind:'spread',glyph:'LAGARTO_WAVE',color:'#b2ed6d',power:p.power*.65*(1+((p.sideralArsenal.ranks.sideralTail||1)-1)*.14),hits:new Set(),remaining:3})}
   s.effects.push({kind:'sideral-sweep',x:p.x,y:p.y,angle:p.aim,r:range,arc,life:.4,maxLife:.4,tail:a.arsenalId==='sideralTail'})
  }if(a.arsenalId==='sideralFear'&&a.evolution)P.Evolutions.afterCast(p,a,target);if(primed){passive.stacks=0;passive.progress=0}return true
 },
 eggs(p,dt){
  const s=P.state;
  for(const nest of p.sideralEggs||[]){
   const tracked=nest.targetKey&&s.enemies.find(e=>e.hp>0&&this.key(e)===nest.targetKey);
   if(!nest.open&&tracked){const old=nest.track||tracked,vx=(tracked.x-old.x)/Math.max(.001,dt),vy=(tracked.y-old.y)/Math.max(.001,dt),limit=Math.max(1,Math.hypot(vx,vy)/260);nest.track={x:tracked.x,y:tracked.y,vx:vx/limit,vy:vy/limit}}
   nest.age+=dt;if(nest.age<.35+nest.delay)continue;
   if(!nest.open){
    nest.open=true;
    const available=s.enemies.filter(e=>e.hp>0&&Math.hypot(e.x-nest.x,e.y-nest.y)<=240&&P.Terrain.clear(nest.x,nest.y,e.x,e.y,5)),target=available.includes(tracked)?tracked:available.sort((a,b)=>Math.hypot(a.x-nest.x,a.y-nest.y)-Math.hypot(b.x-nest.x,b.y-nest.y))[0];
    // One aim decision at hatch, with bounded lead. A runner never homes after launch.
    if(target){const lead=Math.min(.34,Math.hypot(target.x-nest.x,target.y-nest.y)/580),motion=target===tracked?nest.track:null;nest.angle=Math.atan2(target.y+(motion?.vy||0)*lead-nest.y,target.x+(motion?.vx||0)*lead-nest.x)}
    for(let i=0;i<nest.count;i++){const angle=nest.angle+(i-(nest.count-1)/2)*.32;nest.runners.push({x:nest.x,y:nest.y,angle,age:0,hits:[]})}
    P.Audio.tone?.(230,.08,.035,'triangle',0,410)
   }
   for(const runner of nest.runners){
    if(runner.age>=.38)continue;const old={x:runner.x,y:runner.y},step=Math.min(dt,.38-runner.age);runner.age+=dt;
    const x=runner.x+Math.cos(runner.angle)*580*step,y=runner.y+Math.sin(runner.angle)*580*step,block=P.Muzzle.blocker(old.x,old.y,x,y);runner.x=block?.x??x;runner.y=block?.y??y;
    for(const e of [...s.enemies]){const key=this.key(e);if(e.hp<=0||runner.hits.includes(key)||(nest.hits[key]||0)>=nest.maxHits||!P.Combat.segmentHit(runner,e,old.x,old.y)||!P.Terrain.clear(old.x,old.y,e.x,e.y,4))continue;runner.hits.push(key);nest.hits[key]=(nest.hits[key]||0)+1;const damage=P.DotaItems?.criticalDamage(nest.power,nest.source,e)??nest.power;P.Entities.hurt(e,damage,0,nest.source);if(s.mode!=='play')return}
    if(block){if(block.obstacle)P.Terrain.damage(block.obstacle,nest.power*.5);runner.age=.38}
   }
  }
  p.sideralEggs=(p.sideralEggs||[]).filter(n=>n.age<.35+n.delay+.5)
 },
 ultimateScale(p){const a=P.SideralArsenal.init(p);return (1+.14*(Math.max(1,...Object.values(a?.ranks||{}))-1))*(Object.values(a?.evolved||{}).some(Boolean)?1.15:1)},
 gain(p,e){const u=P.state.ultimate;if(!u||!this.eligible(p)||this.active(p))return;u.sideralCharge=Math.min(100,(u.sideralCharge||0)+(e?.boss||e?.mapBoss?35:e?.miniboss?20:e?.heavy?10:5))},
 activate(){const s=P.state,p=s.player,u=s.ultimate;if(!this.eligible(p)||s.mode!=='play'||p.hp<=0||!u||(u.sideralCharge||0)<100||this.active(p)||P.Progression.domainActive()||P.Progression.cinematicOnly())return false;u.sideralCharge=0;p.sideralUltimateUntil=s.elapsed+this.duration;p.sideralBreathNext=s.elapsed;p.sideralBreathPower=this.ultimateScale(p);const target=P.Combat.target(p,s.enemies,310*p.reach);p.sideralBreathAim=target?Math.atan2(target.y-p.y,target.x-p.x):p.aim||0;p.aim=p.sideralBreathAim;p.sideralUltimateStarted=s.elapsed;P.Audio.tone?.(90,.3,.07,'sawtooth',0,170);return true},
 tick(p,dt){if(!this.eligible(p)||p.hp<=0)return;const passive=this.passive(p),now=P.state.elapsed||0,domain=P.Progression.domainActive(),delta=Math.max(0,Math.min(.25,now-passive.lastAt));passive.lastAt=now;if(!this.active(p)&&!domain){const near=P.state.enemies.some(e=>e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<=300);passive.progress=near?passive.progress+delta:0;if(passive.progress>=2&&passive.stacks<3){passive.stacks++;passive.progress-=2}if(passive.stacks===3)passive.progress=0}this.eggs(p,dt);if(!this.active(p)||domain)return;
  const target=P.Combat.target(p,P.state.enemies,310*p.reach),mouth={x:p.x+(p.facing||1)*28,y:p.y-25,aim:p.aim};if(target){const desired=Math.atan2(target.y-mouth.y,target.x-mouth.x),diff=Math.atan2(Math.sin(desired-p.sideralBreathAim),Math.cos(desired-p.sideralBreathAim));p.sideralBreathAim+=Math.max(-2.4*dt,Math.min(2.4*dt,diff));p.aim=p.sideralBreathAim;p.attackAim=p.aim;p.aimUntil=now+.3;p.facing=Math.cos(p.aim)<0?-1:1}
  if(!target||now<(p.sideralBreathNext||0))return;p.sideralBreathNext=Math.max(now-this.breathInterval,p.sideralBreathNext??now)+this.breathInterval;this.pose(p,'breath',.28);for(const e of [...P.state.enemies])if(e.hp>0&&P.Combat.inArc({...mouth,aim:p.sideralBreathAim},e,310*p.reach,.48)&&P.Terrain.clear(mouth.x,mouth.y,e.x,e.y,5)){this.hit(p,e,.36*(p.sideralBreathPower||1),'special',0,true);if(P.state.mode!=='play')break}
 },
 hud(){const p=P.state.player;if(!this.eligible(p))return;const b=P.$('#ultimate'),u=P.state.ultimate,active=this.active(p),charge=Math.max(0,Math.min(100,u?.sideralCharge||0)),ready=charge>=100&&!active&&!P.Progression.domainActive();if(b){b.hidden=P.state.mode!=='play';P.AbilityCards.apply(b,'sideralUltimate','ultimate',charge,ready,active);b.setAttribute('aria-disabled',String(!ready));b.setAttribute('aria-label','Despertar del Lagarto · '+(active?'activo':Math.floor(charge)+' %'));P.UI.write(b,active?'Q · LAGARTO '+Math.max(0,p.sideralUltimateUntil-P.state.elapsed).toFixed(1)+'s':'Q · LAGARTO '+Math.floor(charge)+'%')}const node=P.$('#passive-hud'),parts=node?._passive;if(parts){const state=this.passive(p);parts.title.textContent='Sangre fría';parts.marks.replaceChildren(...[0,1,2].map(i=>{const mark=document.createElement('i');mark.textContent='◆';mark.dataset.royal=String(i<state.stacks);return mark}));parts.status.textContent=state.stacks===3?'SIGUIENTE TÉCNICA POTENCIADA':'ESCAMAS '+state.stacks+'/3 · CERCA SIN RECIBIR DAÑO'}}
};

// Registrar identidad y fichas sin convertir la transformación en otra especie base.
for(const id of ['sideralTail','sideralEgg'])P.Data.attacks[id]={...P.SideralArsenal.profiles[id]};
P.CharacterProfiles.weaponKits.sideral=P.SideralArsenal.order.map(id=>({id,name:P.SideralArsenal.names[id],damageType:P.SideralArsenal.profiles[id].damageType,status:'implemented'}));
Object.assign(P.CharacterProfiles.identities.sideral,{damage:'hybrid',tags:['arsenal','control','area','summon','risk']});
P.CharacterProfiles.roles.sideral=['Controlador del Lagarto','Separa hordas, prepara huevos y potencia una técnica con Sangre fría.','Colazo lento, daño retrasado y Q vulnerable; exige colocación.'];
P.CharacterContract.specialNames.sideral.ultimate='Despertar del Lagarto';
P.AbilityCards.entries.sideralUltimate={characterId:'sideral',kind:'ultimate',frame:'fire',title:'Despertar del Lagarto',description:'Sideral adopta su forma reptiliana y reemplaza temporalmente el ataque automático por un aliento especial en cono. Puede moverse y girar, pero no gana vida ni invulnerabilidad.',details:[['Tecla','Q'],['Duración','6 s'],['Alcance','Cono de 310 u'],['Ángulo','0.48 rad'],['Daño','Especial · 0.36× por pulso'],['Pulso','Cada 0.24 s'],['Giro máximo','2.4 rad/s']],chargeField:'sideralCharge',art:'assets/cards/sideral-lagarto-ultimate-fullart-v1.webp'};
P.Passives.definitions.sideral={name:'Sangre fría',short:'Cada 2 s cerca de rivales sin recibir daño gana una escama; tres potencian la siguiente técnica.',trigger:'Rival vivo a 300 u, fuera de Q y dominios',reset:'Daño recibido resta una escama y reinicia el progreso',max:3};
{
 const attack=P.Evolutions.attack,profile=P.Evolutions.profile,cast=P.Combat.cast,tick=P.Combat.tick,gain=P.Ultimate.gain,activate=P.Ultimate.activate,ultimateHud=P.Ultimate.hud,hud=P.UI.hud,hit=P.PlayerFeedback.hit,state=P.Passives.state,rows=P.Passives.rows;
 P.Evolutions.attack=function(p){return P.SideralArsenal.attack(p)||attack.call(this,p)};
 P.Evolutions.profile=function(p){return p?.id==='sideral'?P.SideralArsenal.evolution(p.sideralArsenal?.active||'sideralFear'):profile.call(this,p)};
 P.Combat.cast=function(...args){const d=P.state.sideralDomain,p=P.state.player;if(P.SideralKit.eligible(p)){if(d?.arena&&!P.SideralDomain.dynamic(d)){p.castUntil=0;p.castStarted=0;return false}return P.SideralKit.cast()}return cast.apply(this,args)};
 P.Combat.tick=function(dt){if(P.state.mode==='play'){P.SideralKit.tick(P.state.player,dt);if(P.state.mode!=='play')return}return tick.call(this,dt)};
 P.Ultimate.gain=function(source,e){const result=gain.call(this,source,e);if(source?.ownerSlot==null||source.ownerSlot===P.state.player?.slot)P.SideralKit.gain(P.state.player,e);return result};
 P.Ultimate.activate=function(...args){if(P.SideralKit.eligible(P.state.player)&&(!P.Coop?.active||P.Combat.server))return P.SideralKit.activate();return activate.apply(this,args)};
 P.Ultimate.hud=function(...args){if(P.SideralKit.eligible(P.state.player)){P.SideralDomain.hud();return P.SideralKit.hud()}return ultimateHud.apply(this,args)};
 P.PlayerFeedback.hit=function(p,...args){const before=p?.hp||0,result=hit.call(this,p,...args);if(P.SideralKit.eligible(p)&&p.hp<before){const passive=P.SideralKit.passive(p);passive.stacks=Math.max(0,passive.stacks-1);passive.progress=0;passive.lastAt=P.state.elapsed||0}return result};
 P.Passives.state=function(p,create=true){if(P.SideralKit.eligible(p))return create?P.SideralKit.passive(p):p.sideralPassive||null;return state.call(this,p,create)};
 P.Passives.rows=function(id){return id==='sideral'?[['Nombre','Sangre fría'],['Activación','Una escama cada 2 s con rivales a 300 u'],['Límite','3 escamas'],['Mirada preparada','Un rival adicional hasta 70 u más allá'],['Colazo preparado','Arco +30 %'],['Huevo preparado','Abre en 0,25 s en vez de 0,8 s'],['Reinicio','Consumir las tres; daño recibido resta una']]:rows.call(this,id)};
 P.UI.hud=function(...args){const result=hud.apply(this,args);P.SideralKit.hud();return result};
}
