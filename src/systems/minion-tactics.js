'use strict';
// Shared deterministic attack timelines: solo and cooperative authority use these same rules.
P.MinionTactics={
 definitions:{
  punch:{name:'Combo de puños',color:'#ffb25e',range:66,damage:8,windup:1.05,recovery:1.05},
  shovel:{name:'Golpe y grieta',color:'#d3b38a',range:105,damage:11,windup:1.2,recovery:1.15},
  sweep:{name:'Barrido de bandera',color:'#f17882',range:96,damage:9,windup:1.15,recovery:1.05},
  police:{name:'Avance de escudo',color:'#a6d6ed',range:125,damage:11,windup:1.2,recovery:1.1},
  architect:{name:'Escuadra de retorno',color:'#edc06e',range:350,damage:8,windup:1.2,recovery:1,ranged:true},
  firefighter:{name:'Chorro sostenido',color:'#86def1',range:180,damage:9,windup:1.25,recovery:1.15,ranged:true},
  chef:{name:'Combo de sartén',color:'#efb572',range:78,damage:9,windup:1.1,recovery:1.2},
  astronaut:{name:'Salto lunar',color:'#91dfff',range:210,damage:10,windup:1.25,recovery:1.1},
  mummy:{name:'Látigo de vendas',color:'#d9cba5',range:260,damage:8,windup:1.25,recovery:1.2,ranged:true},
  elf:{name:'Regalo con mecha',color:'#f178a0',range:300,damage:10,windup:1.25,recovery:1.1,ranged:true}
 },
 key(e){if(P.MinionProfessions.definition(e))return e.profession;return ['shovel','punch','sweep'][e.design]||null},
 profile(e,base){const s=P.state,key=this.key(e),d=this.definitions[key];if(!base||!d||!P.MinionEvolution.eligible(e)||!e.progressive||s.devRun&&!s.balanceTest||s.encounter)return base;return {...base,...d,tactic:key,tactical:true,mode:'tactical',min:d.ranged?70:0,max:d.range,damage:d.damage*P.MinionEvolution.profiles[P.MinionEvolution.rank(e)].damage,windup:Math.max(d.windup,base.windup),cooldown:Math.max(5.5,base.cooldown),recovery:d.recovery}},
 breathing(time=P.state.mapTime){return time>=65&&time%30>=24},
 limits(stage){const i=P.Difficulty.index(),cap=this.breathing()?2:4;return {...stage,casts:Math.min(stage.casts,cap,[0,1,2,2,3,3,4,4][i]),danger:Math.min(stage.danger,[0,6,10,12,16,18,22,24][i])}},
 busy(e){return !!(e.tactic||e.rangedAim||e.burst||e.charge)},
 isRanged(a){return !!a&&(!!a.ranged||['fan','twin','zigzag','burst'].includes(a.mode))},
 started(e){const s=P.state;if(e.progressive&&(!s.devRun||s.balanceTest)&&!s.encounter)s.tacticGate={at:s.elapsed}},
 canStart(e,a){const s=P.state;if(!e.progressive||s.devRun&&!s.balanceTest||s.encounter)return true;const limits=P.Difficulty.limits(e),busy=s.enemies.filter(q=>q.hp>0&&this.busy(q));if(busy.length>=limits.casts||s.danger.length>=limits.danger)return false;
  const active=busy.filter(q=>q.tactic),ranged=busy.filter(q=>this.isRanged(q.attackProfile||P.Difficulty.attack(q))).length;
  if(this.isRanged(a)&&ranged>=Math.min(this.breathing()?1:2,limits.casts)||active.filter(q=>q.attackProfile?.tactic===a.tactic).length>=(P.Difficulty.index()<6?1:2))return false;
  const gate=s.tacticGate;if(gate&&s.elapsed>=gate.at&&s.elapsed<gate.at+(this.breathing()?.65:.38))return false;return true;
 },
 plan(e,a,aim){const tier=P.MinionEvolution.rank(e),angle=Math.atan2(aim.y,aim.x),at=a.windup,events=[],sector=(time,radius,arc,extra={})=>events.push({at:time,x:e.x,y:e.y,angle,radius,arc,shape:'sector',duration:.22,...extra});
  if(a.tactic==='punch'||a.tactic==='chef'){const count=tier+1;for(let i=0;i<count;i++)sector(at+i*.82,a.tactic==='chef'?66:55,i===2?1.65:1.15,{damageScale:i===2?1.35:1,reverse:i%2===1});}
  else if(a.tactic==='shovel'){const x=e.x+aim.x*40,y=e.y+aim.y*40;sector(at,42,Math.PI*2,{x,y});if(tier)events.push({at:at+.42,x,y,angle,shape:'line',length:tier===2?155:95,width:15,duration:.3,visual:'crack'});}
  else if(a.tactic==='sweep'){sector(at,85+tier*6,2.35+tier*.2);if(tier===2)sector(at+.95,97,2.75,{reverse:true});}
  else if(a.tactic==='police'){const step=tier===2?38:0;sector(at+(step?.28:0),65+tier*5,1.25,{x:e.x+aim.x*step,y:e.y+aim.y*step});}
  else if(a.tactic==='architect'){if(tier===1)for(const [i,off] of [-.12,.12].entries())events.push({at:at+i*.75,x:e.x,y:e.y,angle:angle+off,shape:'projectile',length:336,duration:1.6});else events.push({at,x:e.x,y:e.y,angle,shape:'projectile',length:tier===2?189:336,duration:tier===2?1.8:1.6,returning:tier===2});}
  else if(a.tactic==='firefighter'){sector(at,145+tier*12,.58,{duration:[.7,1,1.25][tier],sweep:tier===2?.5:0,visual:'water'});}
  else if(a.tactic==='astronaut'){const distance=Math.min(tier?150:115,aim.distance),x=e.x+aim.x*distance,y=e.y+aim.y*distance;sector(at+.55,53+tier*7,Math.PI*2,{x,y,visual:'lunar'});if(tier===2)sector(at+.8,110,Math.PI*2,{x,y,shape:'ring',duration:.65,visual:'lunar'});}
  else if(a.tactic==='mummy'){for(const off of tier===2?[-.3,.3]:[0])events.push({at,x:e.x,y:e.y,angle:angle+off,shape:'line',length:205+tier*22,width:12,duration:.3,slow:.7,visual:'bandage'});}
  else if(a.tactic==='elf'){const count=tier?2:1;for(let i=0;i<count;i++){const off=count===1?0:(i?1:-1)*(tier===2?60:48),distance=Math.min(aim.distance,230);events.push({at:at+i*.65,x:e.x+aim.x*distance-aim.y*off,y:e.y+aim.y*distance+aim.x*off,shape:'bomb',radius:34,arc:Math.PI*2,angle,duration:1.22,delay:.9,visual:'gift'});}}
  return {age:0,aim:{...aim},origin:{x:e.x,y:e.y},events,next:0,end:Math.max(...events.map(q=>q.at+q.duration))+a.recovery};
 },
 tick(e,dt,a){if(!a?.tactical&&!e.tactic)return false;const s=P.state;if((e.fearUntil||0)>s.elapsed){this.cancel(e);return true;}if(e.hp<=0){this.cancel(e);return true;}
  if(e.tactic){const t=e.tactic;t.age+=dt;while(t.next<t.events.length&&t.age>=t.events[t.next].at){const event=t.events[t.next++];this.emit(e,a,event);e.audioImpact=(e.audioImpact||0)+1;e.audioImpactAt=s.elapsed;e.attackUntil=s.elapsed+.3;}
   const next=t.events[t.next];e.rangedAim=next&&t.age<next.at?{...t.aim}:null;e.rangedWindup=next?Math.max(0,next.at-t.age):0;
   if(t.age>=t.end){e.tactic=null;e.rangedAim=null;e.rangedCooldown=a.cooldown;e.attackUntil=0;}return true;
  }
  e.rangedCooldown=(e.rangedCooldown??(2+e.design*.23))-dt;const p=s.player,dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy);
  if(e.rangedCooldown>0||d<a.min||d>=a.max||!P.Combat.onScreen(e,p)||!this.canStart(e,a)||!P.Terrain.clear(e.x,e.y,p.x,p.y))return true;
  e.attackProfile=a;e.tacticId??=e.minionId??(s.tacticSerial=(s.tacticSerial||0)+1);const aim={x:dx/(d||1),y:dy/(d||1),distance:d};e.tactic=this.plan(e,a,aim);e.rangedAim=aim;e.rangedWindup=a.windup;e.minionAim=Math.atan2(dy,dx);e.audioWarn=(e.audioWarn||0)+1;e.audioWarnAt=s.elapsed;if(Math.abs(dx)>.1)e.facing=Math.sign(dx);s.tacticGate={at:s.elapsed};return true;
 },
 emit(e,a,event){const s=P.state;if(s.danger.length>=P.Difficulty.limits(e).danger||!P.Terrain.clear(e.x,e.y,event.x,event.y))return;
  s.danger.push({...P.Attributes.source(e,['firefighter','astronaut','mummy','elf'].includes(a.tactic)?'special':'physical'),...event,tactical:true,tactic:a.tactic,tacticOwner:e.tacticId,minion:true,minionRank:P.MinionEvolution.rank(e),kind:event.shape==='projectile'?'spread':'stomp',glyph:a.tactic==='architect'?'SET_SQUARE':undefined,x:event.x,y:event.y,ox:event.x,oy:event.y,vx:event.shape==='projectile'?Math.cos(event.angle)*210:0,vy:event.shape==='projectile'?Math.sin(event.angle)*210:0,age:0,life:event.duration,damage:a.damage*(event.damageScale||1),color:a.color,hitSlots:[],history:[]});
 },
 cancel(e){for(const q of P.state.danger)if(q.tactical&&q.tacticOwner===e.tacticId)q.life=0;e.tactic=null;e.rangedAim=null;e.attackUntil=0;e.rangedCooldown=Math.max(e.rangedCooldown||0,1.2)},
 motion(e,dt){const t=e.tactic;if(!t)return false;const a=e.attackProfile;if(a.tactic==='astronaut'){const time=(t.age-a.windup)/.55;if(time>=0&&time<=1){const landing=t.events[0],old={x:e.x,y:e.y};e.x=t.origin.x+(landing.x-t.origin.x)*time;e.y=t.origin.y+(landing.y-t.origin.y)*time;P.Terrain.resolve(e,old,e.r);}}
  if(a.tactic==='police'&&P.MinionEvolution.rank(e)===2&&t.age>=a.windup&&t.age<=a.windup+.28){const time=Math.max(0,Math.min(1,(t.age-a.windup)/.28)),old={x:e.x,y:e.y};e.x=t.origin.x+t.aim.x*38*time;e.y=t.origin.y+t.aim.y*38*time;P.Terrain.resolve(e,old,e.r);}return true;
 },
 contactAllowed(e){return !e.tactic},
 playerSpeed(p){const tactic=(p.tacticSlowUntil||0)>P.state.elapsed?.75:1,fiscal=(p.fiscalSlowUntil||0)>P.state.elapsed?(p.fiscalSlowFactor||.82):1;return Math.min(tactic,fiscal)},
 shield(e,source){if(e.attackProfile?.tactic!=='police'||!e.tactic||e.tactic.age>=e.tactic.events[0].at+.25)return 1;const tier=P.MinionEvolution.rank(e);if(!tier)return 1;const p=source&&Number.isFinite(source.x)&&Number.isFinite(source.y)?source:P.state.player,dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1,aim=e.tactic.aim;return (dx*aim.x+dy*aim.y)/d>.35?(tier===2?.55:.7):1},
 advance(shot,dt){if(!shot.tactical)return true;const owner=P.state.enemies.find(e=>e.hp>0&&e.tacticId===shot.tacticOwner);if(!owner){shot.life=0;return false;}if(shot.returning&&shot.age+dt>=.9&&!shot.turned){shot.vx=-shot.vx;shot.vy=-shot.vy;shot.turned=true;}return true},
 angle(shot){return shot.angle+(shot.sweep||0)*Math.max(0,Math.min(1,shot.age/shot.duration))},
 hits(shot,p){if(shot.age<(shot.delay||0)||shot.hitSlots.includes(p.slot??-1))return false;const dx=p.x-shot.x,dy=p.y-shot.y,d=Math.hypot(dx,dy);
  if(shot.shape==='projectile')return d<17;
  if(shot.shape==='line'){const along=dx*Math.cos(shot.angle)+dy*Math.sin(shot.angle),side=Math.abs(-dx*Math.sin(shot.angle)+dy*Math.cos(shot.angle));return along>=0&&along<=shot.length&&side<=shot.width;}
  if(shot.shape==='ring'){const outer=shot.radius*Math.min(1,shot.age/shot.duration);return d<=outer+8&&d>=Math.max(0,outer-17);}
  if(d>shot.radius)return false;if(shot.shape==='bomb')return true;const delta=Math.atan2(dy,dx)-this.angle(shot);return Math.abs(Math.atan2(Math.sin(delta),Math.cos(delta)))<=shot.arc/2;
 },
 hit(shot,p,damage){if(P.Minibosses?.dangerHit?.(shot,p,damage))return false;if(shot.extinctionPoison){p.extinctionSlowUntil=Math.max(p.extinctionSlowUntil||0,P.state.elapsed+1.4);p.poisonVisualUntil=Math.max(p.poisonVisualUntil||0,P.state.elapsed+1.4);return false}if(!shot.tactical)return false;shot.hitSlots.push(p.slot??-1);if(damage>0&&shot.slow)p.tacticSlowUntil=Math.max(p.tacticSlowUntil||0,P.state.elapsed+shot.slow);return true},
 pose(e){const t=e.tactic;if(!t)return null;const next=t.events[t.next],active=t.events.some(q=>t.age>=q.at&&t.age<q.at+q.duration);if(!next&&!active)return null;const charging=!!next&&!active;const jump=e.attackProfile.tactic==='astronaut'?Math.sin(Math.max(0,Math.min(1,(t.age-e.attackProfile.windup)/.55))*Math.PI)*30:0;return {attack:e.attackProfile,charging,t:charging?Math.min(1,1-Math.max(0,next.at-t.age)/e.attackProfile.windup):.5,tilt:0,lift:jump,squash:1};
 },
 path(ctx,q){ctx.beginPath();if(q.shape==='line'){const c=Math.cos(q.angle),s=Math.sin(q.angle),w=q.width;ctx.moveTo(q.x-s*w,q.y+c*w);ctx.lineTo(q.x+c*q.length-s*w,q.y+s*q.length+c*w);ctx.lineTo(q.x+c*q.length+s*w,q.y+s*q.length-c*w);ctx.lineTo(q.x+s*w,q.y-c*w);ctx.closePath();}
  else if(q.shape==='projectile'){ctx.moveTo(q.x,q.y);ctx.lineTo(q.x+Math.cos(q.angle)*(q.length||330),q.y+Math.sin(q.angle)*(q.length||330));}
  else{ctx.moveTo(q.x,q.y);ctx.arc(q.x,q.y,q.radius,q.angle-(q.arc||Math.PI*2)/2,q.angle+(q.arc||Math.PI*2)/2);ctx.closePath();}
 },
 cue(ctx,e){if(!e.attackProfile?.tactical)return false;const t=e.tactic;if(!t)return true;const next=t.events[t.next];if(!next)return true;ctx.save();ctx.translate(-e.x,-e.y-e.r*.8);ctx.strokeStyle=e.attackProfile.color;ctx.fillStyle=e.attackProfile.color;ctx.lineWidth=2;ctx.setLineDash([5,4]);const previews=t.events.filter(q=>q.at===next.at||t.next===0&&['shovel','astronaut'].includes(e.attackProfile.tactic));for(const event of previews){this.path(ctx,event.sweep?{...event,angle:event.angle+event.sweep/2,arc:event.arc+Math.abs(event.sweep)}:event);ctx.globalAlpha=.1;ctx.fill();ctx.globalAlpha=.85;ctx.stroke();}if(next.returning){ctx.setLineDash([2,6]);ctx.beginPath();ctx.moveTo(next.x+Math.cos(next.angle)*180,next.y+Math.sin(next.angle)*180);ctx.lineTo(next.x,next.y);ctx.stroke();}ctx.restore();return true},
 draw(ctx,q){if(!q.tactical)return false;ctx.save();ctx.strokeStyle=q.color;ctx.fillStyle=q.color;ctx.lineWidth=q.visual==='bandage'?5:3;ctx.globalAlpha=.8;
  if(q.shape==='projectile'){ctx.translate(q.x,q.y);P.MinionProfessions.glyph(ctx,{glyph:'SET_SQUARE',age:q.age});ctx.restore();return true;}
  if(q.shape==='bomb'&&q.age<q.delay){this.path(ctx,q);ctx.setLineDash([4,4]);ctx.stroke();ctx.translate(q.x,q.y);P.MinionProfessions.glyph(ctx,{glyph:'GIFT',age:0});ctx.beginPath();ctx.arc(0,0,q.radius,0,Math.PI*2*Math.min(1,q.age/q.delay));ctx.stroke();ctx.restore();return true;}
  if(q.shape==='ring'){ctx.beginPath();ctx.arc(q.x,q.y,Math.max(1,q.radius*Math.min(1,q.age/q.duration)),0,Math.PI*2);ctx.stroke();}
  else if(q.shape==='line'){ctx.beginPath();ctx.moveTo(q.x,q.y);if(q.visual==='crack'){for(let i=1;i<=6;i++){const along=q.length*i/6,side=i%2?7:-7;ctx.lineTo(q.x+Math.cos(q.angle)*along-Math.sin(q.angle)*side,q.y+Math.sin(q.angle)*along+Math.cos(q.angle)*side);}}else ctx.lineTo(q.x+Math.cos(q.angle)*q.length,q.y+Math.sin(q.angle)*q.length);ctx.stroke();}
  else if(q.visual==='water'){const angle=this.angle(q);for(let i=-2;i<=2;i++){const a=angle+i*q.arc/5;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(q.x+Math.cos(a)*q.radius,q.y+Math.sin(a)*q.radius);ctx.stroke();}}
  else{this.path(ctx,q);ctx.globalAlpha=.15;ctx.fill();ctx.globalAlpha=.9;ctx.stroke();}ctx.restore();return true;
 }
};
