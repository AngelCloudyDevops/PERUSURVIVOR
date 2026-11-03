'use strict';
// Encuentro raro del cautivo. El aliado no entra en `enemies`: los minions no lo
// seleccionan, no tiene colision ni vida y desaparece cuando el jugador recibe daño.
P.CaptiveEvent={
 asset:'assets/events/captive-companion-v1.webp',image:null,ready:false,attemptAt:30,forced:null,testCycle:0,
 outcomes:['cyan','vortex','tickets','escape'],
 init(){
  if(typeof Image!=='undefined'){this.image=new Image();this.image.decoding='async';this.image.onload=()=>this.ready=true;this.image.src=this.asset}
  if(typeof document==='undefined')return;
  const free=document.createElement('button');free.id='captive-free';free.type='button';free.hidden=true;free.textContent='LIBERAR · E';free.setAttribute('aria-keyshortcuts','E');free.onclick=()=>this.free();document.body.append(free);
  addEventListener('keydown',event=>{if(event.key?.toLowerCase()!=='e'||event.repeat||['INPUT','TEXTAREA','SELECT'].includes(event.target?.tagName)||event.target?.isContentEditable||!this.near())return;event.preventDefault();event.stopImmediatePropagation();this.free()},true);
  const actions=P.$('#test-bench .bench-actions');if(actions?.insertBefore){const test=document.createElement('button');test.id='bench-captive';test.type='button';test.textContent='Probar cautivo';test.title='Solo administrador · alterna los cuatro resultados';test.onclick=()=>{if(!P.Profile?.admin?.())return;this.forced=this.outcomes[this.testCycle++%this.outcomes.length];this.spawn(true);P.UI.write(P.$('#bench-status'),'Cautivo creado · resultado preparado: '+this.label(this.forced)+'. Acércate y pulsa E.');P.UI.hud()};actions.insertBefore(test,P.$('#bench-exit'))}
 },
 state(){return P.state.captiveEvent},
 chance(time=P.state.mapTime){return .05+.15*Math.min(1,Math.max(0,time)/180)},
 reset(){P.state.captiveEvent=null;this.attemptAt=30;const b=P.$('#captive-free');if(b)b.hidden=true},
 spawn(force=false){const s=P.state,p=s.player;if(!p||s.mode!=='play'||s.encounter||P.Coop?.active&&!force)return false;const angle=(s.enemySerial*.91+1.3)%6.283,distance=force?120:360;s.captiveEvent={phase:'captive',x:p.x+Math.cos(angle)*distance,y:p.y+Math.sin(angle)*distance,age:0,frame:0,outcome:null,nextShot:0,vortices:[],rewarded:false,id:'captive-'+(P.Meta?.run?.id||Date.now())};return true},
 trySpawn(){const s=P.state;if(this.state()||s.mapTime<this.attemptAt||s.encounter||s.devRun||s.practice||P.Performance?.active||P.Coop?.active)return;const mark=Math.floor(this.attemptAt),roll=P.Loot?.roll?.(mark+s.enemySerial,881,991)??Math.random();this.attemptAt+=30;if(roll<this.chance(s.mapTime))this.spawn()},
 near(){const c=this.state(),p=P.state.player;return !!(c?.phase==='captive'&&p&&Math.hypot(c.x-p.x,c.y-p.y)<72)},
 choose(){if(this.forced){const value=this.forced;this.forced=null;return value}const r=Math.random();return r<.3?'cyan':r<.6?'vortex':r<.9?'tickets':'escape'},
 label(value){return{cyan:'Hadoken celeste',vortex:'Hadoken morado',tickets:'10 tickets dorados',escape:'Huida ninja'}[value]||value},
 free(){const c=this.state();if(!c||!this.near())return false;c.outcome=this.choose();c.age=0;c.phase='freeing';c.frame=1;const b=P.$('#captive-free');if(b)b.hidden=true;P.Audio?.fx?.('level');P.state.effects.push({kind:'nova',x:c.x,y:c.y,r:54,life:.35,maxLife:.35,color:'#ffd65c'});return true},
 target(c){return P.state.enemies.filter(e=>e.hp>0&&!e.mimic).reduce((best,e)=>!best||Math.hypot(e.x-c.x,e.y-c.y)<Math.hypot(best.x-c.x,best.y-c.y)?e:best,null)},
 fire(c,p){const target=this.target(c);if(!target)return;const purple=c.outcome==='vortex',angle=Math.atan2(target.y-c.y,target.x-c.x),speed=purple?380:470;P.state.shots.push({...P.Attributes.source(p,'special'),captiveWave:true,captiveVortex:purple,x:c.x,y:c.y-18,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,angle,life:1.25,age:0,history:[],kind:'spread',glyph:'ORB',color:purple?'#a853ff':'#48ddff',power:p.power*(purple?.35:.5),hits:new Set(),remaining:1,returning:false});P.state.effects.push({kind:'muzzle',x:c.x,y:c.y-18,angle,life:.16,maxLife:.16,color:purple?'#d29cff':'#bdf8ff'})},
 vortex(x,y,power){const c=this.state();if(!c)return;c.vortices.push({x,y,life:1.8,maxLife:1.8,r:92,power:power*.25,tick:0})},
 tickVortices(c,dt){for(const v of c.vortices){v.life-=dt;v.tick-=dt;for(const e of P.state.enemies){if(e.hp<=0)continue;const dx=v.x-e.x,dy=v.y-e.y,d=Math.hypot(dx,dy)||1;if(d<v.r+e.r&&!e.mapBoss&&!e.miniboss){const pull=Math.min(115*dt,d);e.x+=dx/d*pull;e.y+=dy/d*pull}if(v.tick<=0&&d<v.r*.55+e.r)P.Entities.hurt(e,v.power,0,{...P.Attributes.source(P.state.player,'special'),captiveVortex:true})}if(v.tick<=0)v.tick=.45}c.vortices=c.vortices.filter(v=>v.life>0)},
 ticketKey:'causas-golden-tickets-v1',
 tickets(){try{return Math.max(0,Math.min(100000,Math.floor(Number(localStorage.getItem(this.ticketKey))||0)))}catch{return 0}},
 saveTickets(value){try{localStorage.setItem(this.ticketKey,String(Math.max(0,Math.min(100000,Math.floor(value)))));return true}catch{return false}},
 spendTickets(count){const used=Math.min(Math.max(0,Math.floor(count)),this.tickets());return this.saveTickets(this.tickets()-used)?used:0},
 async award(c){if(c.rewarded)return;c.rewarded=true;const testing=P.state.devRun||P.state.practice,result=testing||this.saveTickets(this.tickets()+10);P.state.effects.push({kind:'damage',x:c.x,y:c.y-70,life:2,maxLife:2,color:'#ffd75e',text:result?(testing?'PRUEBA · 10 TICKETS':'¡10 TICKETS DORADOS!'):'NO SE PUDO GUARDAR'});P.Gacha?.render?.()},
 dismiss(reason='damage'){const c=this.state();if(!c||c.phase!=='companion')return;c.phase='smoke';c.age=0;c.frame=7;c.reason=reason;P.state.effects.push({kind:'nova',x:c.x,y:c.y,r:45,life:.35,maxLife:.35,color:'#8f79b8'})},
 onPlayerDamage(amount){if(amount>0)this.dismiss('damage')},
 update(dt){const s=P.state;if(s.mode!=='play')return;this.trySpawn();const c=this.state(),p=s.player,b=P.$('#captive-free');if(!c){if(b)b.hidden=true;return}c.age+=dt;if(b){b.hidden=!this.near();if(!b.hidden)b.textContent='LIBERAR · E'}
  this.tickVortices(c,dt);
  if(c.phase==='freeing'&&c.age>.45){c.age=0;if(c.outcome==='cyan'||c.outcome==='vortex'){c.phase='companion';c.frame=2;c.nextShot=s.elapsed+.35}else if(c.outcome==='tickets'){c.phase='tickets';c.frame=5;this.award(c)}else{c.phase='sneak';c.frame=6}}
  if(c.phase==='companion'){const desired={x:p.x-(p.facing||1)*54,y:p.y+24},dx=desired.x-c.x,dy=desired.y-c.y,d=Math.hypot(dx,dy)||1,step=Math.min(d,180*dt);c.x+=dx/d*step;c.y+=dy/d*step;if(s.elapsed>=c.nextShot){this.fire(c,p);c.frame=c.outcome==='vortex'?4:3;c.attackUntil=s.elapsed+.28;c.nextShot=s.elapsed+(c.outcome==='vortex'?6:4)}else if(s.elapsed>(c.attackUntil||0))c.frame=2}
  if(c.phase==='tickets'&&c.age>2.2){c.phase='smoke';c.age=0;c.frame=7}
  if(c.phase==='sneak'){c.x+=85*dt;c.y-=18*dt;if(c.age>1.5){c.phase='smoke';c.age=0;c.frame=7;P.state.effects.push({kind:'nova',x:c.x,y:c.y,r:52,life:.4,maxLife:.4,color:'#7a668d'})}}
  if(c.phase==='smoke'&&c.age>.55)this.reset()
 },
 interact(){return this.near()?this.free():false},
 drawFrame(ctx,c,frame=c.frame){if(!this.ready)return false;const sw=this.image.naturalWidth/4,sh=this.image.naturalHeight/2,col=frame%4,row=Math.floor(frame/4);ctx.drawImage(this.image,col*sw,row*sh,sw,sh,c.x-55,c.y-92,110,110);return true},
 draw(ctx){const c=this.state();if(!c)return;for(const v of c.vortices){ctx.save();ctx.translate(v.x,v.y);const t=1-v.life/v.maxLife;ctx.scale(1,.42);ctx.strokeStyle='#c481ff';ctx.fillStyle='#210b38bb';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,v.r*(.42+.12*Math.sin(t*20)),0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore()}ctx.save();if(c.phase==='smoke')ctx.globalAlpha=Math.max(0,1-c.age/.55);this.drawFrame(ctx,c);if(c.phase==='captive'){const pulse=(Math.sin(P.state.elapsed*7)+1)/2,color=`hsl(${8+45*pulse} 95% 62%)`;ctx.font='900 15px monospace';ctx.textAlign='center';ctx.lineWidth=5;ctx.strokeStyle='#111b2d';ctx.fillStyle='#172438dd';ctx.beginPath();ctx.roundRect(c.x-35,c.y-105,70,28,8);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle=color;ctx.fillText('HELP',c.x,c.y-86)}ctx.restore()}
};
P.CaptiveEvent.install=()=>{
 const start=P.Game.start.bind(P.Game);P.Game.start=options=>{P.CaptiveEvent.reset();return start(options)};
 const update=P.Game.update.bind(P.Game);P.Game.update=dt=>{update(dt);if(!P.Coop?.active)P.CaptiveEvent.update(dt)};
 const hit=P.PlayerFeedback.hit.bind(P.PlayerFeedback);P.PlayerFeedback.hit=(p,amount,source)=>{const dealt=hit(p,amount,source);if(dealt>0)P.CaptiveEvent.onPlayerDamage(dealt);return dealt};
 const impact=P.Combat.impact.bind(P.Combat);P.Combat.impact=shot=>{if(shot.captiveVortex&&!shot.vortexCreated){shot.vortexCreated=true;P.CaptiveEvent.vortex(shot.x,shot.y,shot.power)}return impact(shot)};
 const render=P.World.render.bind(P.World);P.World.render=time=>{render(time);if(P.state.mode==='menu'||!P.CaptiveEvent.state())return;const {ctx,width,height}=P.Core,zoom=P.Terrain.zoom||1;ctx.save();ctx.translate(width*.5,height*.5);ctx.scale(zoom,zoom);ctx.translate(-P.Terrain.cameraX,-P.Terrain.cameraY);P.CaptiveEvent.draw(ctx);ctx.restore()};
 const gachaRender=P.Gacha.render.bind(P.Gacha);P.Gacha.render=()=>{const result=gachaRender(),panel=P.$('#lobby-gacha'),buttons=panel?.querySelectorAll?.('.gacha-pull'),tickets=P.CaptiveEvent.tickets();if(buttons?.length){const blocked=P.Meta.busy||!!P.Meta.error||!P.Gacha.canPull(P.Meta.data)||!!(P.Gacha.animation&&!P.Gacha.animation.done),oneCoins=Math.max(0,1-tickets)*P.Gacha.cost,tenCoins=Math.max(0,10-tickets)*P.Gacha.cost;buttons[0].textContent=tickets?'Invocar · 1 ticket dorado':'Invocar · 60 monedas';buttons[0].disabled=blocked||P.Meta.data.wallet<oneCoins;if(buttons[1]){buttons[1].textContent=tickets>=10?'Invocar ×10 · 10 tickets dorados':'Invocar ×10 · '+Math.min(10,tickets)+' tickets + '+tenCoins+' monedas';buttons[1].disabled=blocked||P.Meta.data.wallet<tenCoins}let badge=panel.querySelector?.('.golden-ticket-balance');if(!badge&&panel.querySelector){badge=document.createElement('p');badge.className='golden-ticket-balance';panel.querySelector('h2')?.after(badge)}if(badge)badge.textContent='🎫 '+tickets+' tickets dorados · cada ticket reemplaza 60 monedas'}return result};
 P.CaptiveEvent.init();
};
P.CaptiveEvent.install();
