'use strict';
// Una persecución autoritativa; los carriles son coordenadas del dominio, no del mapa.
P.ChosicanoDomain={entry:3,cycle:3.5,exit:1.5,serial:0,
 players(){return P.Court.players()},
 boss(){return P.state.enemies.find(e=>e.kind==='combi'&&e.mapBoss&&e.hp>0)},
 tryStart(){const s=P.state,e=this.boss();if(s.mode!=='play'||!s.encounter||!e||e.hp>e.max*.5||e.roadUsed||s.roadDomain||s.domain||s.court||s.sideralDomain||s.encounter?.defeat||P.DragonUltimate?.cinematic?.(this.players()))return false;e.roadUsed=true;e.phase='road-domain';e.busMoving=false;s.roadDomain={id:++this.serial,age:0,pass:-1,lane:0,target:null,runners:this.players().map((p,i)=>({slot:p.slot??i,lane:this.players().length>1?(i?1:-1):0,hitPass:-1})),finished:false};s.shots=[];s.fields=[];s.danger=[];s.effects=[];for(const p of this.players()){if(p.shots)p.shots=[];if(p.fields)p.fields=[];p.moving=false}P.Core.clear();P.Audio.fx('chosicano-horn');return true},
 phase(d=P.state.roadDomain){if(!d)return null;const t=d.age-this.entry;if(t<0)return {kind:'entry',pass:0,age:d.age};if(t>=this.cycle*3)return {kind:'exit',pass:3,age:t-this.cycle*3};const age=t%this.cycle;return {kind:age<1.6?'warning':age<2.25?'charge':'rest',pass:Math.floor(t/this.cycle),age}},
 tick(dt,inputs){const s=P.state,d=s.roadDomain;if(!d||s.mode!=='play'||d.finished)return;dt=Math.max(0,Math.min(.1,dt));const players=this.players(),e=this.boss();if(!e||!s.encounter){s.roadDomain=null;return}const old=d.age;d.age+=dt;s.elapsed+=dt;const phase=this.phase(d);for(const r of d.runners){const p=players.find(q=>(q.slot??0)===r.slot);if(!p||p.hp<=0)continue;const axis=Math.max(-1,Math.min(1,Number(inputs?.[r.slot]?.x)||0));if(phase.kind!=='entry'&&phase.kind!=='exit')r.lane=Math.max(-1,Math.min(1,r.lane+axis*2.4*dt));p.inv=Math.max(0,(p.inv||0)-dt)}
  if(phase.pass<3&&phase.kind!=='entry'&&d.pass!==phase.pass){d.pass=phase.pass;const alive=d.runners.filter(r=>players.some(p=>(p.slot??0)===r.slot&&p.hp>0));const target=alive[phase.pass%Math.max(1,alive.length)];d.target=target?.slot??null;d.lane=Math.round(target?.lane||0);P.Audio.fx('chosicano-ready')}
  // Un único cruce por pasada, incluso si el paso de simulación salta el instante exacto.
  if(d.pass>=0&&d.pass<3){const crossing=this.entry+d.pass*this.cycle+2.08;if(old<crossing&&d.age>=crossing){for(const r of d.runners){const p=players.find(q=>(q.slot??0)===r.slot);if(!p||p.hp<=0||r.hitPass===d.pass||Math.abs(r.lane-d.lane)>.62||p.inv>0)continue;r.hitPass=d.pass;P.PlayerFeedback.hit(p,24,P.Attributes.source(e,'physical'));p.inv=.9;r.lane=Math.max(-1,Math.min(1,r.lane+(r.lane<=0?-.3:.3)))}P.Audio.fx('chosicano-brake')}}
  if(!players.some(p=>p.hp>0)){s.roadDomain=null;P.Game.finish(false);return}
  if(d.age>=this.entry+this.cycle*3+this.exit){d.finished=true;s.roadDomain=null;e.phase='recover';e.attack='horn';e.recovery=2;e.attackT=1.8;for(const p of players)if(p.hp>0)p.inv=Math.max(p.inv||0,1);P.Core.clear()}P.UI.hud()
 }
};
// Mantiene los mismos controles de teclado/táctil y el mismo ciclo de escenas que Makanaky.
{const update=P.Game.update,start=P.Game.start,render=P.World.render;
 P.Game.update=function(dt){if(!P.Coop?.active&&P.state.mode==='play'){P.ChosicanoDomain.tryStart();if(P.state.roadDomain){P.ChosicanoDomain.tick(dt,{[P.state.player.slot??0]:P.Core.direction()});return}}return update.call(this,dt)};
 P.Game.start=function(...args){P.state.roadDomain=null;return start.apply(this,args)};
 P.World.render=function(...args){const active=!!P.state.roadDomain&&P.state.mode!=='menu';if(typeof document!=='undefined')document.body.classList.toggle('road-scene',active);if(active){P.ChosicanoRoad.draw();return}return render.apply(this,args)};
}

for(const owner of [P.Ultimate,P.Domain,P.Court,P.SideralDomain,P.DragonUltimate]){if(!owner?.activate)continue;const activate=owner.activate;owner.activate=function(...args){if(P.state.roadDomain)return false;return activate.apply(this,args)}}
