'use strict';
// Estado de partida por jugador. El catálogo y las consultas son puros; nunca guardan DOM.
P.CardBuilds={
 supports:['pulse','cards','orbit'],
 icons:{pulse:'wave',cards:'card',orbit:'band'},
 fusionText(support,target){return ({
  'pulse:sideralFear':'Explosión especial desde el primer afectado al terminar la Mirada.',
  'cards:sideralFear':'Cartas desde el primer afectado hacia otros rivales.',
  'orbit:sideralFear':'Zona de ralentización y pulsos pequeños. No repite miedo.',
  'pulse:sideralTail':'Explosión al final del barrido. PRESA amplía el radio.',
  'cards:sideralTail':'Abanico de cartas siguiendo la cola. PRESA añade una penetración.',
  'orbit:sideralTail':'Zona sísmica en el impacto. PRESA añade un pulso.',
  'pulse:sideralEgg':'Segunda explosión menor tras abrir. El marcado amplía el radio.',
  'cards:sideralEgg':'Cartas buscadoras desde el cascarón; priorizan al marcado.',
  'orbit:sideralEgg':'Zona pulsante. El marcado refuerza la vulnerabilidad sin sumar copias.'
 })[support+':'+target]||'Activa el apoyo al usar esta técnica.'},
 modifications:{
  wideTail:{character:'sideral',target:'sideralTail',name:'Colazo abierto',text:'Barrido más ancho; pierde 15% de alcance.',kind:'wide'},
  heavyTail:{character:'sideral',target:'sideralTail',name:'Colazo demoledor',text:'Golpea 30% más fuerte y empuja más; pierde 10% de alcance.',kind:'heavy'},
  quakeTail:{character:'sideral',target:'sideralTail',name:'Rebote sísmico',text:'Tras 0,28 s aparece una onda menor alrededor de Sideral.',kind:'rebound'},
  quickEgg:{character:'sideral',target:'sideralEgg',name:'Eclosión rápida',text:'El huevo abre en 0,2 s; pierde 20% de daño.',kind:'quick'},
  nestEgg:{character:'sideral',target:'sideralEgg',name:'Nido de presión',text:'Al abrir, deja una zona de daño especial y ralentización durante 2 s.',kind:'zone'},
  swarmEgg:{character:'sideral',target:'sideralEgg',name:'Cría cazadora',text:'Una cría corrige su rumbo una vez hacia el marcado; −15% de daño. Evolucionado: guía a la primera del nido.',kind:'hunter'},
  wideFear:{character:'sideral',target:'sideralFear',name:'Mirada panorámica',text:'Cono más ancho; pierde 15% de alcance.',kind:'wide'},
  focusedFear:{character:'sideral',target:'sideralFear',name:'Mirada perforante',text:'Cono estrecho, 35% más largo y 20% más potente.',kind:'focused'},
  echoFear:{character:'sideral',target:'sideralFear',name:'Pánico contagioso',text:'El primer rival asustado contagia a otro objetivo cercano.',kind:'fearEcho'},
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
  'pulse:sideralFear':{trigger:'release',channel:'special',scale:2.2},
  'cards:sideralFear':{trigger:'release',channel:'special',scale:2.2},
  'orbit:sideralFear':{trigger:'release',channel:'special',duration:2.4,pulses:3},
  'pulse:primary':{trigger:'basic',channel:'special',scale:1.5},
  'cards:primary':{trigger:'basic',channel:'special',scale:1.5},
  'orbit:primary':{trigger:'basic',channel:'special',duration:2.4,pulses:3}
 },
 generic(p){return !['kingteka','makanaky','sideral','cirilo','chamelin','cristorata','marciano'].includes(p.id)},
 init(p){const state=p.cardBuild??={version:2,fusions:{},mutations:[],modification:null,rerolls:1,rerollCap:1,mastery:0,zones:[]};state.mutations??=state.modification?[state.modification]:[];state.version=2;return state},
 // Una partida registrada = un grado de maestría, hasta 10. Reutiliza estadísticas validadas.
 mastery(stats){return Math.max(0,Math.min(10,Math.floor(Number(stats?.runs)||0)))},
 seed(p,stats){const state=this.init(p),mastery=this.mastery(stats);state.mastery=mastery;state.rerolls=state.rerollCap=mastery>=10?3:mastery>=5?2:1;return state},
 fused(p,id){return !!p.cardBuild?.fusions?.[id]},
 targets(p){if(p.id==='sideral')return P.SideralArsenal.order.filter(id=>p.sideralArsenal?.unlocked[id]).map(id=>({id,name:P.SideralArsenal.names[id]}));return this.generic(p)?[{id:'primary',name:P.Data.attacks[p.attack].name}]:[]},
 compatible(p,support){if(!this.supports.includes(support)||!p.powerRanks?.[support]||this.fused(p,support)||p.combos?.direct&&support==='pulse'||p.combos?.press&&['cards','orbit'].includes(support))return[];const used=Object.values(p.cardBuild?.fusions||{});return this.targets(p).filter(t=>!used.includes(t.id)&&!!this.recipes[support+':'+t.id])},
 canFuse(p,support,target){const gate=P.RunMode?.selected==='quick'?7:9;return P.state.level>=gate&&(p.powerRanks?.[support]||0)>=3&&this.compatible(p,support).some(t=>t.id===target)},
 liveAllowed(p){return !!p&&p.hp>0&&P.state.mode==='play'&&!P.Progression.domainActive()&&!P.MapEvents?.cinematic?.()},
 liveFuse(p,support,target){if(typeof support!=='string'||typeof target!=='string'||!this.liveAllowed(p))return false;return this.apply(p,'fusion:'+support,target)},
 mutationKeys(p){return this.init(p).mutations.filter(key=>!!this.modifications[key])},
 mutationFor(p,target){const key=this.mutationKeys(p).find(id=>this.modifications[id].target===target);return key?this.modifications[key]:null},
 mutationGate(p){return p?.id==='sideral'?([5,10,13][this.mutationKeys(p).length]??Infinity):4},
 canModify(p,key){const m=this.modifications[key],chosen=this.mutationKeys(p),limit=m?.character?3:1;return !!m&&!chosen.includes(key)&&chosen.length<limit&&!chosen.some(id=>this.modifications[id].target===m.target)&&P.state.level>=this.mutationGate(p)&&(m.character?m.character===p.id&&!!p.sideralArsenal?.unlocked[m.target]:this.generic(p))},
 mutationOptions(p,target=null){return Object.entries(this.modifications).filter(([key,m])=>(!target||m.target===target)&&this.canModify(p,key)).map(([key,m])=>({key,...m}))},
 canChangeInstinct(p,id){const state=P.SideralArsenal?.init(p);return p.id==='sideral'&&P.state.level>=8&&!state.instinctSwapped&&state.unlocked[id]&&state.instinct!==id},
 offers(p){const out=this.mutationOptions(p).map(m=>({id:'modify:'+m.key,title:m.name,description:m.text,badge:P.SideralArsenal?.names[m.target]||'ATAQUE PRINCIPAL',icon:m.target==='sideralEgg'?'orbit':m.target==='sideralTail'?'power':'wave',offerWeight:.34,comparison:''}));if(p.id==='sideral')for(const id of P.SideralArsenal.order)if(this.canChangeInstinct(p,id))out.push({id:'instinct:'+id,title:'CAMBIAR TÉCNICA INSTINTIVA · '+P.SideralArsenal.names[id],description:'Esta técnica pasa a AUTO; la anterior queda como técnica manual.',badge:'TÉCNICA INSTINTIVA · 1 CAMBIO',icon:id==='sideralEgg'?'orbit':id==='sideralTail'?'power':'wave',offerWeight:.18,comparison:'Reorganiza AUTO, 1 y 2 sin borrar progreso'});return out},
 apply(p,id,target){if(id.startsWith('fusion:')){const support=id.slice(7);if(!this.canFuse(p,support,target))return false;this.init(p).fusions[support]=target;delete p.powerTimers[support];return true}if(id==='mutation:choose'){const key=target;if(!this.canModify(p,key))return false;const state=this.init(p);state.mutations.push(key);state.modification=state.mutations[0]||null;return true}if(id.startsWith('modify:')){const key=id.slice(7);if(!this.canModify(p,key))return false;const state=this.init(p);state.mutations.push(key);state.modification=state.mutations[0]||null;return true}if(id.startsWith('instinct:'))return this.canChangeInstinct(p,id.slice(9))&&P.SideralArsenal.changeInstinct(p,id.slice(9));return false},
 reroll(p){const state=this.init(p);if(state.rerolls<=0)return false;state.rerolls--;return true},
 attack(p,a){const mod=this.mutationFor(p,a.arsenalId);if(!mod)return a;if(mod.kind==='wide')return {...a,arc:a.arc*1.45,range:a.range*.85};if(mod.kind==='quick')return {...a,quick:true,delay:.2,damageScale:a.damageScale*.8};if(mod.kind==='focused')return {...a,arc:a.arc*.7,range:a.range*1.35,damageScale:a.damageScale*1.2};if(mod.kind==='heavy')return {...a,range:a.range*.9,damageScale:a.damageScale*1.3,push:(a.push||0)*1.35};if(mod.kind==='hunter')return {...a,hunter:true,damageScale:a.damageScale*.85};if(mod.kind==='fearEcho')return {...a,fearEcho:true};return a},
 zone(p,x,y,{support=null,scale=.22,duration=2,radius=90,delay=0,pulses=3,slow=false,vulnerability=0,type='special',glyph='BANDA'}={}){const zones=this.init(p).zones;if(zones.length>=4)zones.shift();zones.push({x,y,support,scale,left:duration,next:delay,radius,pulses,slow,vulnerability,type,glyph,warning:delay})},
 source(p){return {...P.Attributes.source(p,'special'),cardBuild:true,comboBlocked:true}},
 emit(p,support,x,y,scale=1,options={}){const s=P.state,rank=p.powerRanks?.[support]||0;if(!rank)return;const evolved=!!p.evolved?.[support],power=p.power*(.25+rank*.1)*(evolved?2:1)*scale,range=options.radius??(90+rank*13)*(evolved?1.4:1)*(options.radiusScale||1),source=this.source(p);
  if(support==='cards'){const candidates=s.enemies.filter(e=>e.hp>0&&(!options.excludeKey||P.SideralKit.key(e)!==options.excludeKey)&&P.Terrain.clear(x,y,e.x,e.y,4)),target=options.priorityKey&&candidates.find(e=>P.SideralKit.key(e)===options.priorityKey)||P.Combat.target({x,y},candidates,650);if(!target&&options.angle===undefined)return;const angle=options.angle??Math.atan2(target.y-y,target.x-x),count=options.fan?3:evolved?3:1;for(let i=0;i<count&&s.shots.length<180;i++){const a=angle+(i-(count-1)/2)*(options.fan?.3:.16);s.shots.push({...source,x,y,vx:Math.cos(a)*540,vy:Math.sin(a)*540,angle:a,life:1.2,age:0,history:[],kind:'spread',glyph:'BCP',color:'#8edff2',power,hits:new Set(),remaining:2+Math.floor(rank/2)+(options.extraPierce||0),returning:false,homing:!!options.seek,cardBuildSeek:!!options.seek,preferredKey:options.priorityKey||null})}return}
  this.burst(p,x,y,range,power,support==='orbit'?'BANDA':'CAUSA');
 },
 burst(p,x,y,radius,power,glyph='CAUSA',type='special'){const s=P.state;if(s.effects.length<290)s.effects.push({kind:'nova',x,y,r:radius,life:.32,maxLife:.32,color:'#b9df91',glyph});for(const e of s.enemies)if(e.hp>0&&Math.hypot(e.x-x,e.y-y)<radius+(e.r||0)&&P.Terrain.clear(x,y,e.x,e.y,4))P.Entities.hurt(e,power,8,{...this.source(p),damageType:type});for(const o of P.Terrain.active())if(o.solid&&Number.isFinite(o.hp)&&Math.hypot(o.x-x,o.y-y)<radius)P.Terrain.damage(o,power)},
 cast(p,target,point){
  const state=p.cardBuild;if(!state||P.state.mode!=='play')return;
  if(p.id==='sideral'){
   const context={x:point?.x??p.x,y:point?.y??p.y,angle:point?.angle??p.aim,prey:!!point?.prey,marked:!!point?.marked,targetKey:point?.targetKey||null,radius:point?.radius||96};
   for(const [support,destination]of Object.entries(state.fusions))if(destination===target&&this.recipes[support+':'+target]){
    const delay=target==='sideralFear'?.4:target==='sideralEgg'&&support==='pulse'?.25:0;
    if(delay){const pending=state.pending??=[];pending.push({target,support,...context,left:delay});}else this.sideralFusion(p,target,support,context);
   }
   const mod=this.mutationFor(p,target);
   if(mod?.kind==='rebound')this.zone(p,p.x,p.y,{scale:.35,duration:.6,delay:.28,pulses:1,radius:100,type:'physical',glyph:'COLA'});
   if(mod?.kind==='zone')this.zone(p,context.x,context.y,{duration:2,scale:.22,radius:90,slow:target==='sideralEgg',glyph:'NIDO'});
   return;
  }
  const x=point?.x??p.x,y=point?.y??p.y;for(const [support,destination]of Object.entries(state.fusions))if(destination===target){const recipe=this.recipes[support+':'+target];if(!recipe)continue;if(support==='orbit')this.zone(p,x,y,{support,duration:recipe.duration,pulses:recipe.pulses,radius:110});else this.emit(p,support,x,y,recipe.scale)}const mod=this.mutationFor(p,target);if(mod){if(mod.kind==='echo')this.zone(p,x,y,{duration:.5,delay:.25,pulses:1,scale:.45,radius:85});if(mod.kind==='zone')this.zone(p,x,y,{duration:2,scale:.22,radius:90})}
 },
 sideralFusion(p,target,support,context){
  const recipe=this.recipes[support+':'+target];if(!recipe)return;const tracked=target==='sideralFear'&&P.state.enemies.find(e=>P.SideralKit.key(e)===context.targetKey&&e.hp>0),x=tracked?.x??context.x,y=tracked?.y??context.y,utility=target==='sideralTail'?context.prey:target==='sideralEgg'&&context.marked;
  if(support==='orbit'){this.zone(p,x,y,{scale:target==='sideralFear'?.18:target==='sideralTail'?.32:.22,duration:recipe.duration+(target==='sideralTail'&&utility?.8:0),pulses:recipe.pulses+(target==='sideralTail'&&utility?1:0),radius:110,slow:target==='sideralFear',vulnerability:target==='sideralEgg'?(utility?.22:.12):0,glyph:'BANDA'});return}
  this.emit(p,support,x,y,recipe.scale*(target==='sideralEgg'&&support==='pulse'?.55:1),{radius:target==='sideralEgg'&&support==='pulse'?context.radius*.65*(utility?1.25:1):undefined,radiusScale:utility?1.25:1,fan:support==='cards'&&target==='sideralTail',angle:target==='sideralTail'?context.angle:undefined,extraPierce:target==='sideralTail'&&utility?1:0,seek:support==='cards'&&target==='sideralEgg',priorityKey:target==='sideralEgg'&&context.marked?context.targetKey:null,excludeKey:target==='sideralFear'?context.targetKey:null});
 },
 tick(p,dt){const state=p.cardBuild;if(!state)return;if(p.hp<=0||P.Progression.domainActive()){this.resetTransient(p);return}if(P.state.mode!=='play'||!state.zones.length&&!state.pending?.length)return;
  const ready=[];for(const job of state.pending||[]){job.left-=dt;if(job.left<=0)ready.push(job)}state.pending=(state.pending||[]).filter(job=>job.left>0);for(const job of ready){this.sideralFusion(p,job.target,job.support,job);if(P.state.mode!=='play')return}
  for(const zone of state.zones){zone.left-=dt;zone.next-=dt;if(zone.left<0)continue;for(const e of P.state.enemies)if(e.hp>0&&Math.hypot(e.x-zone.x,e.y-zone.y)<zone.radius+(e.r||0)&&P.Terrain.clear(zone.x,zone.y,e.x,e.y,4)){if(zone.slow)e.dynamicZoneSlowUntil=Math.max(e.dynamicZoneSlowUntil||0,P.state.elapsed+.2);if(zone.vulnerability){P.SideralKit.weaken(e,zone.vulnerability,.2)}}if(zone.next<=0&&zone.pulses>0){zone.next=.8;zone.pulses--;if(zone.support)this.emit(p,zone.support,zone.x,zone.y,.8);else this.burst(p,zone.x,zone.y,zone.radius,p.power*zone.scale,zone.glyph,zone.type);if(P.state.mode!=='play')return}}state.zones=state.zones.filter(z=>z.left>0)
 },
 label(p,support){const target=p.cardBuild?.fusions?.[support];return target?'→ '+(P.SideralArsenal.names[target]||P.Data.attacks[p.attack].name):'Automático'},
 resetTransient(p){if(p.cardBuild){p.cardBuild.zones=[];p.cardBuild.pending=[]}delete p.sideralFearCast;delete p.sideralFearQueue;for(const nest of p.sideralEggs||[]){nest.cardBuildPending=false;nest.cardBuildCancelled=true}p.sideralEggs=[]}
};
{
 const player=P.Entities.player,options=P.Progression.options,apply=P.Progression.apply,tick=P.Progression.tick,attack=P.SideralArsenal.attackFor,cast=P.SideralKit.cast,eggs=P.SideralKit.eggs,combatCast=P.Combat.cast,applyRun=P.Meta.applyRun;
 P.Entities.player=function(c){const p=player.call(this,c);P.Progression.init(p);P.CardBuilds.init(p);return p};
 // Copia ligera: consultar ofertas no inicializa ni modifica el jugador real.
 P.Progression.options=function(p){const copy={...p,powerRanks:{...(p.powerRanks||{primary:1})},evolved:{...(p.evolved||{})},powerTimers:{...(p.powerTimers||{})},combos:{...(p.combos||{})}};return options.call(this,copy)};
 P.Progression.apply=function(p,id,target){if(id.startsWith('fusion:')||id.startsWith('modify:')||id.startsWith('mutation:')||id.startsWith('instinct:'))return P.CardBuilds.apply(p,id,target);if(['pulse','cards','orbit'].includes(id)&&!p.powerRanks?.[id]&&P.CardBuilds.supports.filter(k=>p.powerRanks?.[k]).length>=2)return false;return apply.call(this,p,id)};
 P.Progression.tick=function(dt){tick.call(this,dt);P.CardBuilds.tick(P.state.player,dt)};
 P.SideralArsenal.attackFor=function(p,id){const a=attack.call(this,p,id);return a?P.CardBuilds.attack(p,a):a};
 P.SideralKit.cast=function(id=P.SideralArsenal.active(P.state.player),automatic=false){const p=P.state.player,count=p.sideralEggs?.length||0,ok=cast.call(this,id,automatic);if(ok&&id==='sideralEgg'&&(p.sideralEggs?.length||0)>count){const nest=p.sideralEggs.at(-1);nest.cardBuildPending=true;if(P.CardBuilds.mutationKeys(p).includes('quickEgg')){nest.delay=.2;nest.hatchAt=.2;nest.flight=.2}}return ok};
 P.SideralKit.eggs=function(p,dt){eggs.call(this,p,dt);for(const nest of p.sideralEggs||[])if(nest.open&&nest.cardBuildPending&&!nest.buildTriggered&&!nest.cardBuildCancelled){nest.cardBuildPending=false;P.CardBuilds.cast(p,'sideralEgg',nest)}};
 P.Combat.cast=function(...args){const p=P.state.player,enabled=P.CardBuilds.generic(p)&&(p.cardBuild?.modification||Object.keys(p.cardBuild?.fusions||{}).length),target=enabled?P.Combat.target(p,P.state.enemies,650):null,ok=combatCast.apply(this,args);if(ok&&enabled)P.CardBuilds.cast(p,'primary',target);return ok};
 P.Meta.applyRun=function(){const p=P.state.player;if(p&&!P.Combat.server&&!P.Coop?.active&&!p.cardBuildSeeded){P.CardBuilds.seed(p,this.data?.characters?.[p.id]);p.cardBuildSeeded=true}return applyRun.call(this)};
}

// Las cinemáticas pueden saltar Combat.tick: limpiar al entrar, no esperar su siguiente tick.
{
 const clear=()=>{for(const p of new Set([...(P.Combat.party||[]),P.state.player]))if(p)P.CardBuilds.resetTransient(p)};
 for(const key of ['enter','leave']){const original=P.Encounters[key];P.Encounters[key]=function(...args){const before=P.state.encounter,result=original.apply(this,args);if(before!==P.state.encounter)clear();return result}};
 for(const [system,key]of [[P.SideralDomain,'activate'],[P.KingtekaDomain,'activate'],[P.Domain,'activate'],[P.ChosicanoDomain,'activate'],[P.ChosicanoDomain,'tryStart'],[P.Chamelin,'activate'],[P.CiriloUR,'activate'],[P.CristorataKit,'activateDomain'],[P.MarcianoDomain,'activate'],[P.Court,'activate']]){
  const original=system?.[key];if(typeof original!=='function')continue;system[key]=function(...args){const result=original.apply(this,args);if(P.Progression.domainActive())clear();return result};
 }
 const hit=P.PlayerFeedback.hit;P.PlayerFeedback.hit=function(p,...args){const result=hit.call(this,p,...args);if(p.hp<=0)P.CardBuilds.resetTransient(p);return result};
}
