'use strict';
// Authoritative, per-player state; artwork never chooses targets or applies damage.
P.DragonUltimate={entry:1.3,sceneDuration:4.2,intro:5.5,duration:8,serial:0,
variants:[{name:'JADE',hue:0,color:'#8be5a2'},{name:'BRASA',hue:220,color:'#ffad79'},{name:'TRUENO',hue:90,color:'#a9caff'}],
state(p=P.state.player){return (p?.ultimate||(p===P.state.player?P.state.ultimate:null))?.dragon},
active(p=P.state.player){const g=this.state(p);return p?.id==='cristorata'&&!!g&&g.age<this.intro+this.duration&&p.hp>0},
mounted(p=P.state.player){return this.active(p)&&this.state(p).age>=this.intro},
cinematic(players=P.Court.players()){return players.find(p=>this.active(p)&&this.state(p).age>=this.entry&&this.state(p).age<this.intro)||null},
advanceScene(dt,players=P.Court.players()){const p=this.cinematic(players);if(!p||P.state.mode!=='play')return false;const s=P.state,previous=s.player,ultimate=s.ultimate;s.player=p;s.ultimate=p.ultimate||ultimate;this.tick(dt);s.player=previous;s.ultimate=ultimate;return true},
speed(p=P.state.player){return this.mounted(p)?1.6:1},
activate(){const s=P.state,p=s.player,u=s.ultimate;if(p?.id!=='cristorata'||s.mode!=='play'||p.hp<=0||s.court||s.domain||!u||u.left>0||u.charge<100)return false;P.Audio.unlock();u.left=this.intro+this.duration;u.age=0;u.dragon={age:0,variant:Math.floor(Math.random()*3),next:0,lock:0,focus:0,angle:p.aim||0,safe:{x:p.x,y:p.y},origin:{x:p.x,y:p.y},scene:s.encounter?.id||null};P.CausaCombo.consume(u);P.Audio.tone?.(180,.3,.12,'triangle',0,70);return true},
tick(dt){const s=P.state,p=s.player,u=s.ultimate,g=u?.dragon;if(!g||u.left<=0)return;const before=g.age,step=Math.min(dt,u.left,before<this.entry?this.entry-before:before<this.intro?this.intro-before:Infinity);g.age+=step;u.age=g.age;u.left=Math.max(0,this.intro+this.duration-g.age);const flight=Math.max(0,g.age-this.intro)-Math.max(0,before-this.intro);if(before<this.entry+.75&&g.age>=this.entry+.75)P.Audio.play('stamp');if(before<this.entry+2.15&&g.age>=this.entry+2.15)P.Audio.tone?.(660,.3,.1,'triangle',0,990);if(flight>0){g.next+=flight;while(g.next+1e-9>=.25){g.next=Math.max(0,g.next-.25);this.breathe(p,g,.25);if(s.mode!=='play')break}}if(!u.left){this.land(p,g);g.fire=0}},
breathe(p,g,dt){const enemies=P.state.enemies.filter(e=>e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<=230+(e.r||0)),target=enemies.reduce((best,e)=>!best||Math.hypot(e.x-p.x,e.y-p.y)<Math.hypot(best.x-p.x,best.y-p.y)?e:best,null);if(!target){g.lock=0;g.focus=0;g.fire=0;return}for(const e of enemies)if(!e.dragonTargetId)e.dragonTargetId=++this.serial;if(g.lock!==target.dragonTargetId){g.lock=target.dragonTargetId;g.focus=0}g.focus=Math.min(3,g.focus+dt);g.angle=Math.atan2(target.y-p.y,target.x-p.x);g.fire=1;const source={...P.Attributes.source(p,'special'),ultimate:true,comboBlocked:true};for(const e of enemies){const dx=e.x-p.x,dy=e.y-p.y,length=Math.hypot(dx,dy)||1;if((dx*Math.cos(g.angle)+dy*Math.sin(g.angle))/length<.78)continue;P.Entities.hurt(e,p.power*.35*(e===target?1+g.focus/3:1),0,source);if(P.state.mode!=='play')break}},
land(p,g){const probe={...p};P.Maps.collide(probe,{x:p.x,y:p.y});if(Math.hypot(probe.x-p.x,probe.y-p.y)>.1){p.x=g.safe.x;p.y=g.safe.y;P.Maps.collide(p,g.origin)}},
protected(p){return this.active(p)&&this.state(p).age<this.intro},
hud(){const b=P.$('#ultimate'),u=P.state.ultimate;if(!b)return;b.hidden=P.state.mode!=='play';b.disabled=!u||u.left>0||u.charge<100;P.UI.write(b,u?.left>0?(u.dragon?.age<this.intro?'¿QUÉ DRAGÓN ES ESE?':'DRAGÓN · '+u.left.toFixed(1)+'s'):'Q · DRAGÓN '+Math.floor(u?.charge||0)+'%')}
};
{const update=P.Game.update,activate=P.Ultimate.activate,tick=P.Ultimate.tick,hud=P.Ultimate.hud,enabled=P.CausaCombo.enabled,hit=P.PlayerFeedback.hit,collide=P.World.collide;
P.Game.update=function(dt){if(!P.Coop?.active&&P.DragonUltimate.advanceScene(dt)){P.UI.hud();return}return update.call(this,dt)};
P.CausaCombo.enabled=function(p=P.state.player){return p?.id==='cristorata'||enabled.call(this,p)};
P.Ultimate.activate=function(...args){if(P.state.player?.id!=='cristorata'||P.Coop?.active&&!P.Combat.server)return activate.apply(this,args);return P.DragonUltimate.activate()};
P.Ultimate.tick=function(dt){if(P.state.player?.id==='cristorata'){P.CausaCombo.tick(dt);P.DragonUltimate.tick(dt);return}return tick.call(this,dt)};
P.Ultimate.hud=function(...args){const value=hud.apply(this,args);if(P.state.player?.id==='cristorata')P.DragonUltimate.hud();return value};
P.PlayerFeedback.hit=function(p,...args){if(P.DragonUltimate.protected(p))return 0;return hit.call(this,p,...args)};
P.World.collide=function(p,old){if(!P.DragonUltimate.mounted(p))return collide.call(this,p,old);const b=P.state.encounter?.scene?.bounds;if(b){p.x=Math.max(b.left,Math.min(b.right,p.x));p.y=Math.max(b.top,Math.min(b.bottom,p.y))}const probe={...p};collide.call(this,probe,old);if(Math.hypot(probe.x-p.x,probe.y-p.y)<.1)P.DragonUltimate.state(p).safe={x:p.x,y:p.y}};
}
