'use strict';
// Zonas ambientales pequeñas y acotadas. Una sola lista sirve a combate, render y red.
P.DynamicZones={
  serial:0,nextAt:28,lastKind:null,warning:1,duration:10,interval:[32,45],tickRate:.5,
  definitions:{
    heal:{name:'Zona de curación',icon:'+',color:'#69e39a',dark:'#246b4c'},
    poison:{name:'Charco venenoso',icon:'☠',color:'#a8e85b',dark:'#526d2d'},
    slow:{name:'Zona debilitante',icon:'▼',color:'#70cde8',dark:'#285d78'}
  },
  zones(){return P.state.dynamicZones||(P.state.dynamicZones=[])},
  reset(){this.serial=0;this.nextAt=28;this.lastKind=null;P.state.dynamicZones=[]},
  cap(){return typeof innerWidth==='number'&&innerWidth<=760?2:4},
  players(){return (P.Court?.players?.()||[P.state.player,...(P.Coop?.peers||[])]).filter(p=>p&&p.hp>0)},
  blocked(){const s=P.state;return s.mode!=='play'||s.devRun||s.encounter||s.bossSpawned||P.MapEvents?.active?.()||P.Progression?.domainActive?.()||P.Performance?.active},
  safe(x,y,r=78){if(P.Terrain.hit(x,y,r)||this.zones().some(zone=>Math.hypot(zone.x-x,zone.y-y)<zone.r+r+40))return false;for(let i=0;i<8;i++){const a=i*Math.PI/4;if(P.Terrain.hit(x+Math.cos(a)*r,y+Math.sin(a)*r,12))return false}return this.players().every(p=>Math.hypot(p.x-x,p.y-y)>170)},
  chooseKind(seed){const kinds=['heal','poison','slow'],start=Math.abs(seed)%kinds.length;for(let i=0;i<kinds.length;i++){const kind=kinds[(start+i)%kinds.length];if(kind!==this.lastKind)return kind}return kinds[start]},
  point(anchor,seed){for(let i=0;i<16;i++){const a=(seed%628)/100+i*2.399,d=260+(Math.abs(seed+i*97)%260),x=Math.round(anchor.x+Math.cos(a)*d),y=Math.round(anchor.y+Math.sin(a)*d*.72);if(this.safe(x,y))return{x,y}}return null},
  spawn(kind=null,anchor=null){const players=this.players();if(!players.length||this.zones().length>=this.cap())return null;const seed=P.Chunks?.hash?.(Math.floor(P.state.mapTime),this.serial+313,P.Maps.selected.length*97)??(Math.floor(P.state.mapTime)+this.serial*97),owner=anchor||players[Math.abs(seed)%players.length],point=this.point(owner,seed);if(!point)return null;kind=kind||this.chooseKind(seed);const now=P.state.mapTime,zone={id:'dynamic-zone:'+(++this.serial),kind,...point,r:kind==='heal'?78:kind==='poison'?88:96,warningUntil:now+this.warning,expiresAt:now+this.warning+this.duration,tickIn:0};this.lastKind=kind;this.zones().push(zone);P.Loot?.notify?.(this.definitions[kind].name.toUpperCase()+' · MIRA EL MINIMAPA');return zone},
  active(zone,now=P.state.mapTime){return now>=zone.warningUntil&&now<zone.expiresAt},
  contains(zone,actor){return actor&&actor.hp>0&&Math.hypot(actor.x-zone.x,actor.y-zone.y)<=zone.r+(actor.r||12)},
  heal(actor,fraction){const max=actor.maxHp||actor.max||1,before=actor.hp;actor.hp=Math.min(max,actor.hp+max*fraction);if(actor.hp>before)actor.dynamicZoneHealUntil=P.state.elapsed+.7},
  poison(actor,fraction){const max=actor.maxHp||actor.max||1,amount=Math.max(.5,max*fraction),party=this.players(),player=party.includes(actor);actor.poisonVisualUntil=Math.max(actor.poisonVisualUntil||0,P.state.elapsed+.7);actor.dynamicZonePoisonUntil=Math.max(actor.dynamicZonePoisonUntil||0,P.state.elapsed+.7);if(player){actor.hp=Math.max(0,actor.hp-amount);if(actor.hp<=0&&party.length===1)P.Game?.finish?.(false)}else P.Entities.hurt(actor,amount,0,{fixedDamage:true,dynamicZone:true,damageType:'special'})},
  affect(zone){const actors=[...this.players(),...P.state.enemies.filter(e=>e.hp>0)];for(const actor of actors){if(!this.contains(zone,actor))continue;if(zone.kind==='heal')this.heal(actor,.0075);else if(zone.kind==='poison')this.poison(actor,(actor.boss||actor.mapBoss||actor.miniboss)?.0025:.005);else{actor.dynamicZoneSlowUntil=Math.max(actor.dynamicZoneSlowUntil||0,P.state.elapsed+.65);actor.dynamicZoneDefenseUntil=Math.max(actor.dynamicZoneDefenseUntil||0,P.state.elapsed+.65)}}},
  tick(dt){const s=P.state;if(!s.dynamicZones)s.dynamicZones=[];const now=s.mapTime;for(const zone of s.dynamicZones){if(!this.active(zone,now))continue;zone.tickIn=(zone.tickIn||0)-dt;if(zone.tickIn<=0){zone.tickIn+=this.tickRate;this.affect(zone)}}s.dynamicZones=s.dynamicZones.filter(zone=>zone.expiresAt>now);if(!this.blocked()&&now>=this.nextAt&&s.dynamicZones.length<this.cap()){this.spawn();const span=this.interval[1]-this.interval[0],seed=Math.abs(P.Chunks?.hash?.(Math.floor(now),this.serial,541)??this.serial*31);this.nextAt=now+this.interval[0]+seed%(span+1)}},
  speed(actor){return (actor?.dynamicZoneSlowUntil||0)>P.state.elapsed ? .75 : 1},
  defense(actor){return (actor?.dynamicZoneDefenseUntil||0)>P.state.elapsed?1.12:1},
  label(kind){const map=P.Maps.selected,names={campo:{heal:'Emoliente reparador',poison:'Barro contaminado',slow:'Césped húmedo'},plaza:{heal:'Agua de la pileta',poison:'Aceite derramado',slow:'Adoquines mojados'},machu:{heal:'Hierbas medicinales',poison:'Niebla tóxica',slow:'Niebla debilitante'}};return names[map]?.[kind]||this.definitions[kind].name},
  draw(ctx){const now=P.state.mapTime,reduced=!!P.Ambient?.reduced?.matches;for(const zone of this.zones()){const d=this.definitions[zone.kind],active=this.active(zone,now),left=zone.expiresAt-now,pulse=reduced?0:Math.sin(P.state.elapsed*6+this.serial)*4;ctx.save();ctx.translate(zone.x,zone.y);ctx.globalAlpha=active?Math.min(.78,left*1.5):.42;ctx.fillStyle=d.dark;ctx.strokeStyle=d.color;ctx.lineWidth=active?3:2;ctx.beginPath();ctx.ellipse(0,0,zone.r,zone.r*.62,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.globalAlpha=active?.85:.65;ctx.setLineDash?.(active?[]:[7,7]);ctx.beginPath();ctx.ellipse(0,0,zone.r-8-pulse*.25,(zone.r-8-pulse*.25)*.62,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash?.([]);ctx.fillStyle=d.color;ctx.font='900 18px monospace';ctx.textAlign='center';ctx.fillText(active?d.icon:Math.max(1,Math.ceil(zone.warningUntil-now)),0,5);ctx.font='bold 9px monospace';ctx.fillText(this.label(zone.kind).toUpperCase(),0,zone.r*.62+16);ctx.restore()}},
  minimap(ctx,p,x,y,mw,mh,range){for(const zone of this.zones()){if(!Number.isFinite(zone.x)||Math.hypot(zone.x-p.x,zone.y-p.y)>range)continue;const d=this.definitions[zone.kind],mx=Math.round(x+mw/2+(zone.x-p.x)/range*mw/2),my=Math.round(y+mh/2+(zone.y-p.y)/range*mh/2);ctx.fillStyle='#10202a';ctx.fillRect(mx-4,my-4,9,9);ctx.fillStyle=d.color;ctx.fillRect(mx-2,my-2,5,5)}}
};

// El charco azul expone ambas defensas sin mutar permanentemente las estadísticas.
{
 const outgoing=P.Attributes.outgoing,incoming=P.Attributes.incoming;
 P.Attributes.outgoing=function(target,...args){return outgoing.call(this,target,...args)*P.DynamicZones.defense(target)};
 P.Attributes.incoming=function(target,...args){return incoming.call(this,target,...args)*P.DynamicZones.defense(target)};
}
