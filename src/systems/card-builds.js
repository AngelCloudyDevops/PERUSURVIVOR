'use strict';
// Estado de partida por jugador. El catálogo y las consultas son puros; nunca guardan DOM.
P.CardBuilds={
 supports:['pulse','cards','orbit'],
 icons:{pulse:'wave',cards:'card',orbit:'band'},
 modifications:{
  wideTail:{character:'sideral',target:'sideralTail',name:'Colazo abierto',text:'Barrido más ancho; pierde 15% de alcance.',kind:'wide'},
  quickEgg:{character:'sideral',target:'sideralEgg',name:'Eclosión rápida',text:'El huevo abre en 0,2 s; pierde 20% de daño.',kind:'quick'},
  nestEgg:{character:'sideral',target:'sideralEgg',name:'Nido de presión',text:'Al abrir, deja una zona especial durante 2 s.',kind:'zone'},
  wideFear:{character:'sideral',target:'sideralFear',name:'Mirada panorámica',text:'Cono más ancho; pierde 15% de alcance.',kind:'wide'},
  echo:{target:'primary',name:'Eco de impacto',text:'Tras atacar, estalla una vez en el objetivo.',kind:'echo'},
  wake:{target:'primary',name:'Rastro de combate',text:'Al atacar, deja una zona especial de 2 s.',kind:'zone'}
 },
 // Solo estas parejas tienen receta; no se inventa una al combinar IDs arbitrarios.
 recipes:{
  'pulse:sideralTail':{trigger:'cast',channel:'special',scale:2.2},
  'pulse:sideralEgg':{trigger:'hatch',channel:'special',scale:2.2},
  'cards:sideralTail':{trigger:'cast',channel:'special',scale:2.2},
  'cards:sideralEgg':{trigger:'hatch',channel:'special',scale:2.2},
  'orbit:sideralTail':{trigger:'cast',channel:'special',duration:2.4,pulses:3},
  'orbit:sideralEgg':{trigger:'hatch',channel:'special',duration:2.4,pulses:3},
  'pulse:primary':{trigger:'basic',channel:'special',scale:1.5},
  'cards:primary':{trigger:'basic',channel:'special',scale:1.5},
  'orbit:primary':{trigger:'basic',channel:'special',duration:2.4,pulses:3}
 },
 generic(p){return !['kingteka','makanaky','sideral','cirilo','chamelin','cristorata','marciano'].includes(p.id)},
 init(p){return p.cardBuild??={version:1,fusions:{},modification:null,rerolls:1,rerollCap:1,mastery:0,zones:[]}},
 // Una partida registrada = un grado de maestría, hasta 10. Reutiliza estadísticas validadas.
 mastery(stats){return Math.max(0,Math.min(10,Math.floor(Number(stats?.runs)||0)))},
 seed(p,stats){const state=this.init(p),mastery=this.mastery(stats);state.mastery=mastery;state.rerolls=state.rerollCap=mastery>=10?3:mastery>=5?2:1;return state},
 fused(p,id){return !!p.cardBuild?.fusions?.[id]},
 targets(p){if(p.id==='sideral')return ['sideralTail','sideralEgg'].filter(id=>p.sideralArsenal?.unlocked[id]).map(id=>({id,name:P.SideralArsenal.names[id]}));return this.generic(p)?[{id:'primary',name:P.Data.attacks[p.attack].name}]:[]},
 compatible(p,support){if(!this.supports.includes(support)||!p.powerRanks?.[support]||this.fused(p,support)||p.combos?.direct&&support==='pulse'||p.combos?.press&&['cards','orbit'].includes(support))return[];const used=Object.values(p.cardBuild?.fusions||{});return this.targets(p).filter(t=>!used.includes(t.id)&&!!this.recipes[support+':'+t.id])},
 canFuse(p,support,target){const gate=P.RunMode?.selected==='quick'?6:8;return P.state.level>=gate&&(p.powerRanks?.[support]||0)>=3&&this.compatible(p,support).some(t=>t.id===target)},
 canModify(p,key){const m=this.modifications[key];return !!m&&!p.cardBuild?.modification&&P.state.level>=4&&(m.character?m.character===p.id&&!!p.sideralArsenal?.unlocked[m.target]:this.generic(p))},
 offers(p){const out=[];for(const id of this.supports)if(this.compatible(p,id).some(t=>this.canFuse(p,id,t.id)))out.push({id:'fusion:'+id,title:'Fusionar · '+P.Progression.names[id],description:'Pasa a una técnica. Deja de atacar solo.',badge:'FUSIÓN OPCIONAL',icon:this.icons[id],rarity:'legendary',comparison:'Conserva rango y espacio · elige destino'});for(const [key,m]of Object.entries(this.modifications))if(this.canModify(p,key))out.push({id:'modify:'+key,title:m.name,description:m.text,badge:'MODIFICACIÓN · 1 MÁX.',icon:'wave',rarity:'epic',comparison:'Cambia '+(P.SideralArsenal.names[m.target]||P.Data.attacks[p.attack].name)});return out},
 apply(p,id,target){if(id.startsWith('fusion:')){const support=id.slice(7);if(!this.canFuse(p,support,target))return false;this.init(p).fusions[support]=target;delete p.powerTimers[support];return true}if(id.startsWith('modify:')){const key=id.slice(7);if(!this.canModify(p,key))return false;this.init(p).modification=key;return true}return false},
 reroll(p){const state=this.init(p);if(state.rerolls<=0)return false;state.rerolls--;return true},
 attack(p,a){const mod=this.modifications[p.cardBuild?.modification];if(!mod||mod.target!==a.arsenalId)return a;if(mod.kind==='wide')return {...a,arc:a.arc*1.45,range:a.range*.85};if(mod.kind==='quick')return {...a,delay:.2,damageScale:a.damageScale*.8};return a},
 zone(p,x,y,{support=null,scale=.22,duration=2,radius=90,delay=0,pulses=3}={}){const zones=this.init(p).zones;if(zones.length>=4)zones.shift();zones.push({x,y,support,scale,left:duration,next:delay,radius,pulses})},
 source(p){return {...P.Attributes.source(p,'special'),cardBuild:true,comboBlocked:true}},
 emit(p,support,x,y,scale=1){const s=P.state,rank=p.powerRanks?.[support]||0;if(!rank)return;const evolved=!!p.evolved?.[support],power=p.power*(.25+rank*.1)*(evolved?2:1)*scale,range=(90+rank*13)*(evolved?1.4:1),source=this.source(p);
  if(support==='cards'){const target=P.Combat.target({x,y},s.enemies,650);if(!target)return;const angle=Math.atan2(target.y-y,target.x-x),count=evolved?3:1;for(let i=0;i<count&&s.shots.length<180;i++){const a=angle+(i-(count-1)/2)*.16;s.shots.push({...source,x,y,vx:Math.cos(a)*540,vy:Math.sin(a)*540,angle:a,life:1.2,age:0,history:[],kind:'spread',glyph:'BCP',color:'#8edff2',power,hits:new Set(),remaining:2+Math.floor(rank/2),returning:false})}return}
  this.burst(p,x,y,range,power,support==='orbit'?'BANDA':'CAUSA');
 },
 burst(p,x,y,radius,power,glyph='CAUSA'){const s=P.state;if(s.effects.length<290)s.effects.push({kind:'nova',x,y,r:radius,life:.32,maxLife:.32,color:'#b9df91',glyph});for(const e of s.enemies)if(e.hp>0&&Math.hypot(e.x-x,e.y-y)<radius+(e.r||0)&&P.Terrain.clear(x,y,e.x,e.y,4))P.Entities.hurt(e,power,8,this.source(p));for(const o of P.Terrain.active())if(o.solid&&Number.isFinite(o.hp)&&Math.hypot(o.x-x,o.y-y)<radius)P.Terrain.damage(o,power)},
 cast(p,target,point){const state=p.cardBuild;if(!state)return;const x=point?.x??p.x,y=point?.y??p.y;for(const [support,destination]of Object.entries(state.fusions))if(destination===target){const recipe=this.recipes[support+':'+target];if(!recipe)continue;if(support==='orbit')this.zone(p,x,y,{support,duration:recipe.duration,pulses:recipe.pulses,radius:110});else this.emit(p,support,x,y,recipe.scale)}const mod=this.modifications[state.modification];if(mod?.target===target){if(mod.kind==='echo')this.zone(p,x,y,{duration:.5,delay:.25,pulses:1,scale:.45,radius:85});if(mod.kind==='zone')this.zone(p,x,y,{duration:2,scale:.22,radius:90})}},
 tick(p,dt){const state=p.cardBuild;if(!state?.zones.length)return;if(p.hp<=0||P.Progression.domainActive()){state.zones=[];return}if(P.state.mode!=='play')return;for(const zone of state.zones){zone.left-=dt;zone.next-=dt;if(zone.left>=0&&zone.next<=0&&zone.pulses>0){zone.next=.8;zone.pulses--;if(zone.support)this.emit(p,zone.support,zone.x,zone.y,.8);else this.burst(p,zone.x,zone.y,zone.radius,p.power*zone.scale)}}state.zones=state.zones.filter(z=>z.left>0)},
 label(p,support){const target=p.cardBuild?.fusions?.[support];return target?'→ '+(P.SideralArsenal.names[target]||P.Data.attacks[p.attack].name):'Automático'},
 resetTransient(p){if(p.cardBuild)p.cardBuild.zones=[]}
};
{
 const player=P.Entities.player,options=P.Progression.options,apply=P.Progression.apply,tick=P.Progression.tick,attack=P.SideralArsenal.attackFor,cast=P.SideralKit.cast,eggs=P.SideralKit.eggs,combatCast=P.Combat.cast,applyRun=P.Meta.applyRun;
 P.Entities.player=function(c){const p=player.call(this,c);P.Progression.init(p);P.CardBuilds.init(p);return p};
 // Copia ligera: consultar ofertas no inicializa ni modifica el jugador real.
 P.Progression.options=function(p){const copy={...p,powerRanks:{...(p.powerRanks||{primary:1})},evolved:{...(p.evolved||{})},powerTimers:{...(p.powerTimers||{})},combos:{...(p.combos||{})}};return options.call(this,copy)};
 P.Progression.apply=function(p,id,target){if(id.startsWith('fusion:')||id.startsWith('modify:'))return P.CardBuilds.apply(p,id,target);if(['pulse','cards','orbit'].includes(id)&&!p.powerRanks?.[id]&&P.CardBuilds.supports.filter(k=>p.powerRanks?.[k]).length>=2)return false;return apply.call(this,p,id)};
 P.Progression.tick=function(dt){tick.call(this,dt);P.CardBuilds.tick(P.state.player,dt)};
 P.SideralArsenal.attackFor=function(p,id){const a=attack.call(this,p,id);return a?P.CardBuilds.attack(p,a):a};
 P.SideralKit.cast=function(id='sideralFear'){const p=P.state.player,count=p.sideralEggs?.length||0,ok=cast.call(this,id);if(ok&&id==='sideralTail')P.CardBuilds.cast(p,id);if(ok&&id==='sideralEgg'&&(p.sideralEggs?.length||0)>count)p.sideralEggs.at(-1).cardBuildPending=true;return ok};
 P.SideralKit.eggs=function(p,dt){eggs.call(this,p,dt);for(const nest of p.sideralEggs||[])if(nest.open&&nest.cardBuildPending){nest.cardBuildPending=false;P.CardBuilds.cast(p,'sideralEgg',nest)}};
 P.Combat.cast=function(...args){const p=P.state.player,enabled=P.CardBuilds.generic(p)&&(p.cardBuild?.modification||Object.keys(p.cardBuild?.fusions||{}).length),target=enabled?P.Combat.target(p,P.state.enemies,650):null,ok=combatCast.apply(this,args);if(ok&&enabled)P.CardBuilds.cast(p,'primary',target);return ok};
 P.Meta.applyRun=function(){const p=P.state.player;if(p&&!P.Combat.server&&!P.Coop?.active&&!p.cardBuildSeeded){P.CardBuilds.seed(p,this.data?.characters?.[p.id]);p.cardBuildSeeded=true}return applyRun.call(this)};
}

// Las cinemáticas pueden saltar Combat.tick: limpiar al entrar, no esperar su siguiente tick.
{
 const clear=()=>{for(const p of new Set([...(P.Combat.party||[]),P.state.player]))if(p)P.CardBuilds.resetTransient(p)};
 for(const [system,key]of [[P.SideralDomain,'activate'],[P.KingtekaDomain,'activate'],[P.Domain,'activate'],[P.ChosicanoDomain,'activate'],[P.ChosicanoDomain,'tryStart'],[P.Chamelin,'activate'],[P.CiriloUR,'activate'],[P.CristorataKit,'activateDomain'],[P.MarcianoDomain,'activate'],[P.Court,'activate']]){
  const original=system?.[key];if(typeof original!=='function')continue;system[key]=function(...args){const result=original.apply(this,args);if(P.Progression.domainActive())clear();return result};
 }
 const hit=P.PlayerFeedback.hit;P.PlayerFeedback.hit=function(p,...args){const result=hit.call(this,p,...args);if(p.hp<=0)P.CardBuilds.resetTransient(p);return result};
}
