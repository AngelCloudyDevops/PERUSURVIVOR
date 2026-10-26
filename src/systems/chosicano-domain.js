'use strict';
// Carrera lateral: posiciones del mapa intactas, física y obstáculos autoritativos.
P.ChosicanoDomain={entry:4.8,cycle:5,exit:1.2,serial:0,jumpQueued:false,slideDown:false,
 obstacles:[{id:0,at:1.9,kind:'cone',height:40},{id:1,at:3.65,kind:'sign',height:0},{id:2,at:6.9,kind:'barrier',height:65},{id:3,at:8.65,kind:'cone',height:40},{id:4,at:11.9,kind:'sign',height:0},{id:5,at:13.65,kind:'barrier',height:65}],
 players(){return P.Court.players()},boss(){return P.state.enemies.find(e=>e.kind==='combi'&&e.mapBoss&&e.hp>0)},
 runnerX(slot){return this.players().length>1?460+(slot%2)*110:500},
 obstacleX(o,t){return 500+(o.at-t)*270},
 input(){const dir=P.Core.direction();return {...dir,roadJump:this.jumpQueued||!!P.Core.keys[' ']||dir.y<-.35,roadSlide:this.slideDown||dir.y>.35}},
 consume(){this.jumpQueued=false},
 tryStart(force=false){const s=P.state,e=this.boss(),preview=force&&s.devRun&&!P.Coop?.active;if(force&&!preview)return false;if(s.mode!=='play'||!s.encounter||!e||(!preview&&(e.hp>e.max*.5||e.roadUsed))||s.roadDomain||s.domain||s.court||s.sideralDomain||s.encounter?.defeat||P.DragonUltimate?.cinematic?.(this.players()))return false;e.roadUsed=true;e.quickEvent=null;e.phaseEventDone=true;e.phase='road-domain';e.busMoving=false;s.roadDomain={id:++this.serial,age:0,pass:-1,runners:this.players().map((p,i)=>({slot:p.slot??i,height:0,vy:0,slide:0,slideCooldown:0,stumble:0,passed:[],jumpHeld:false,slideHeld:false})),finished:false};s.shots=[];s.fields=[];s.danger=[];s.effects=[];for(const p of this.players()){if(p.shots)p.shots=[];if(p.fields)p.fields=[];p.moving=false}this.consume();this.slideDown=false;P.Core.clear();P.ChosicanoRoad?.load();P.Audio.fx('chosicano-horn');return true},
 phase(d=P.state.roadDomain){if(!d)return null;const t=d.age-this.entry;if(t<0)return {kind:'entry',pass:0,age:d.age};if(t>=this.cycle*3)return {kind:'exit',pass:3,age:t-this.cycle*3};const age=t%this.cycle;return {kind:age<1.25?'warning':age<4.5?'charge':'rest',pass:Math.floor(t/this.cycle),age,t}},
 introPose(t){return t<1.5?{frame:0,stage:'speech',progress:t/1.5}:t<2.2?{frame:1,stage:'raise',progress:(t-1.5)/.7}:t<3.1?{frame:2,stage:'drink',progress:(t-2.2)/.9}:t<3.4?{frame:3,stage:'lower',progress:(t-3.1)/.3}:t<4.3?{frame:4,stage:'board',progress:(t-3.4)/.9}:{frame:5,stage:'drive',progress:Math.min(1,(t-4.3)/.5)}},
 tick(dt,inputs){const s=P.state,d=s.roadDomain;if(!d||s.mode!=='play'||d.finished)return;dt=Math.max(0,Math.min(.1,dt));const players=this.players(),e=this.boss();if(!e||!s.encounter){s.roadDomain=null;return}const old=d.age;d.age+=dt;s.elapsed+=dt;const phase=this.phase(d),active=phase.kind!=='entry'&&phase.kind!=='exit';if(active&&d.pass!==phase.pass){d.pass=phase.pass;P.Audio.fx('chosicano-ready')}
  for(const r of d.runners){const p=players.find(q=>(q.slot??0)===r.slot);if(!p||p.hp<=0)continue;const input=inputs?.[r.slot]||{},jump=input.roadJump===true||input.y<-.35,slide=input.roadSlide===true||input.y>.35;r.stumble=Math.max(0,r.stumble-dt);r.slide=Math.max(0,r.slide-dt);r.slideCooldown=Math.max(0,r.slideCooldown-dt);p.inv=Math.max(0,(p.inv||0)-dt);if(s.devRun&&P.$('#lab-invincible').checked)p.inv=1;
   if(active){if(jump&&!r.jumpHeld&&r.height===0&&r.slide===0&&r.stumble===0)r.vy=600;if(slide&&!r.slideHeld&&r.height===0&&r.slideCooldown===0&&r.stumble===0){r.slide=.85;r.slideCooldown=1.15}r.height=Math.max(0,r.height+r.vy*dt-750*dt*dt);r.vy-=1500*dt;if(r.height===0)r.vy=0;
    for(const o of this.obstacles){const crossing=this.entry+o.at+(500-this.runnerX(r.slot))/270;if(old>=crossing||d.age<crossing||r.passed.includes(o.id))continue;r.passed.push(o.id);const safe=o.kind==='sign'?r.slide>0&&r.height<5:r.height>o.height+8;if(!safe&&p.inv<=0){r.stumble=.65;r.slide=0;P.PlayerFeedback.hit(p,18,P.Attributes.source(e,'physical'));p.inv=1;P.Audio.fx('chosicano-brake')}}
   }r.jumpHeld=jump;r.slideHeld=slide;
  }
  if(!players.some(p=>p.hp>0)){s.roadDomain=null;P.Game.finish(false);return}
  if(d.age>=this.entry+this.cycle*3+this.exit){d.finished=true;s.roadDomain=null;e.phase='recover';e.attack='horn';e.recovery=2;e.attackT=1.8;for(const p of players)if(p.hp>0)p.inv=Math.max(p.inv||0,1);this.consume();this.slideDown=false;P.Core.clear()}P.UI.hud()
 }
};
// Mantiene los mismos controles de teclado/táctil y el mismo ciclo de escenas que Makanaky.
{const update=P.Game.update,start=P.Game.start,render=P.World.render;
 P.Game.update=function(dt){if(!P.Coop?.active&&P.state.mode==='play'){P.ChosicanoDomain.tryStart();if(P.state.roadDomain){P.ChosicanoDomain.tick(dt,{[P.state.player.slot??0]:P.ChosicanoDomain.input()});P.ChosicanoDomain.consume();return}}return update.call(this,dt)};
 P.Game.start=function(...args){P.state.roadDomain=null;P.ChosicanoDomain.consume();P.ChosicanoDomain.slideDown=false;P.ChosicanoRoad?.stopVoice();return start.apply(this,args)};
 P.World.render=function(...args){const active=!!P.state.roadDomain&&P.state.mode!=='menu';if(typeof document!=='undefined')document.body.classList.toggle('road-scene',active);P.ChosicanoRoad.controls(active);if(active){P.ChosicanoRoad.draw();return}P.ChosicanoRoad.stopVoice();return render.apply(this,args)};
}

for(const owner of [P.Ultimate,P.Domain,P.Court,P.SideralDomain,P.DragonUltimate]){if(!owner?.activate)continue;const activate=owner.activate;owner.activate=function(...args){if(P.state.roadDomain)return false;return activate.apply(this,args)}}
