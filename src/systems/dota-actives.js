'use strict';
// Intenciones manuales compartidas por cliente y servidor; nunca acepta destinos ni premios del cliente.
{
 const D=P.DotaItems,blink=D.activate;
 const definitions={
  phase:[15,'Acelerón y sin daño de contacto · 3 s','+12% velocidad. Activa: +20% velocidad y evita contacto durante 3 s. No atraviesa paredes. Recarga 15 s.'],
  travel:[60,'Viaja junto a tu compañero · canaliza 2 s','+14% velocidad y +20% recolección. Activa: viaja a un compañero vivo tras 2 s; recibir daño cancela. En solitario: marca un punto y vuelve a él. Recarga 60 s.'],
  stick:[8,'Gasta cargas: cura 2% por carga','Al recibir daño: +1 carga (máx. 5). Activa: gasta las cargas y cura 2% de vida máxima por carga. Recarga 8 s.'],
  wand:[8,'Gasta cargas: cura 2,5% por carga','Al recibir daño: +1 carga (máx. 10). Activa: gasta las cargas y cura 2,5% de vida máxima por carga. Recarga 8 s.'],
  'blade-mail':[25,'Devuelve 20% de daño físico · 4 s','−10% daño físico recibido. Activa: devuelve 20% del daño físico que pierdes durante 4 s (máx. una vez cada 2 s; limitado contra jefes). Recarga 25 s.'],
  satanic:[30,'Robo de vida 8% · 4 s','Robo de vida 3% (máx. 1% de vida/s). Activa: roba 8% durante 4 s (máx. 3% de vida/s). Recarga 30 s.'],
  'mask-madness':[20,'Ataca más rápido; recibes +10% daño · 4 s','Robo de vida 2% (máx. 0,5% de vida/s). Activa: −15% intervalo de ataque y +10% daño recibido durante 4 s. Recarga 20 s.'],
  'glimmer-cape':[20,'Escudo especial individual: 6% de vida · 3 s','−9% daño especial recibido. Activa: escudo solo contra daño especial de 6% de vida máxima durante 3 s. Apunta al compañero cercano para protegerlo; si no, te protege a ti. Recarga 20 s.'],
  'pipe-insight':[25,'Escudo especial de grupo: 6% de vida · 4 s','−12% daño especial recibido. Activa: escudo solo contra daño especial de 6% de vida máxima durante 4 s para aliados a 180 u. Escudos especiales de equipo no se suman. Recarga 25 s.'],
  'black-king-bar':[35,'Limpia lentitud; −20% daño especial · 4 s','−9% daño especial recibido. Activa: limpia ralentizaciones, reduce 50% su duración y 20% adicional de daño especial durante 4 s. No anula mecánicas de jefes. Recarga 35 s.'],
  'hand-midas':[45,'Convierte un enemigo normal en 8 monedas','+10% monedas sueltas. Activa: convierte un enemigo normal a 240 u en 8 monedas de partida. Excluye élites, jefes e invocaciones. Recarga 45 s.'],
  'abyssal-blade':[20,'Golpe físico + aturde 0,55 s','Activa: golpe físico de 25% de potencia y aturde 0,55 s a un enemigo a 180 u. Jefes: solo lentitud de 10% durante 0,5 s, fuera de sus transiciones. Recarga 20 s.'],
  mjollnir:[25,'Aura: rayos especiales al perder vida · 4 s','Cada 6 impactos: cadena de 4 blancos (25% de potencia). Activa: aura eléctrica durante 4 s; al perder vida lanza rayos especiales a hasta 3 enemigos cercanos, máx. una descarga/s. Recarga 25 s.']
 };
 for(const [family,definition] of Object.entries(D.families))for(const item of [definition.base,...definition.branches]){
  if(family==='blink'){item.active=true;item.activeText='Salto '+item.distance+' u'}
  const spec=definitions[item.id];if(spec){item.active=true;item.cooldown=spec[0];item.activeText=spec[1];item.description=spec[2]}
  if(item.active)item.behavior=family==='blink'?'Activo':'Activo + pasivo';
 }
 Object.assign(D,{
  activeItems(p=P.state.player){return(p?.dotaItems||[]).filter(id=>this.data(id)?.active)},
  hasActive(p=P.state.player){return this.activeItems(p).length>0},
  selected(p=P.state.player){const ids=this.activeItems(p);return ids.includes(this.selectedId)?this.selectedId:ids.find(id=>this.familyFor(id)==='blink')||ids[0]},
  cycle(){const ids=this.activeItems();if(!ids.length)return;this.selectedId=ids[(ids.indexOf(this.selected())+1)%ids.length];this.hud()},
  activeCooldown(p,id){return p?.dotaCooldowns?.[this.familyFor(id)]||0},
  allies(){return P.Court?.players?.()||[P.state.player]},
  arenaKey(){const s=P.state;return P.Maps.selected+':'+(s.encounter?s.encounter.definition.kind+':'+s.encounter.portalIndex:'surface')+':'+(s.portal?.clearedWindows||[]).join(',')},
  travelBlocked(){const s=P.state;return !!(s.domain||s.roadDomain||s.court||s.chamelinDomain||s.sideralDomain||s.kingtekaDomain||s.ciriloDomain||s.marcianoDomain||s.cristorataDomain||s.encounter?.defeat||P.MapEvents?.blocksSpawns?.())},
  target(p,aim,range,predicate=()=>true,pool=P.state.enemies){let target=null,best=-Infinity;for(const e of pool){if(e===p||!(e.hp>0)||!predicate(e))continue;const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy);if(d>range||!P.Terrain.clear(p.x,p.y,e.x,e.y,4))continue;const dot=(dx*aim.x+dy*aim.y)/(d||1);if(dot<.7)continue;const score=dot-d/(range*10);if(score>best){best=score;target=e}}return target},
  landing(p,center){const props=P.state.encounter?[]:Array.from({length:9},(_,i)=>P.Chunks.get(Math.floor(center.x/512)+i%3-1,Math.floor(center.y/512)+Math.floor(i/3)-1).props).flat();for(const radius of [40,64,88])for(let i=0;i<8;i++){const a=i*Math.PI/4,x=center.x+Math.cos(a)*radius,y=center.y+Math.sin(a)*radius;if(P.Terrain.hit(x,y,18)||props.some(o=>o.solid&&x>o.x-o.w/2-18&&x<o.x+o.w/2+18&&y>o.y-o.h/2-18&&y<o.y+o.h/2+18))continue;const test={x,y};P.World.collide(test,{x,y});if(Math.hypot(test.x-x,test.y-y)>.5)continue;if(P.state.enemies.some(e=>e.hp>0&&Math.hypot(e.x-x,e.y-y)<(e.r||12)+30))continue;return{x,y}}return null},
  activate(aimOverride=null,requested=null){
   const p=P.state.player,id=requested||this.selected(p),item=this.data(id);if(!p||p.hp<=0||P.state.mode!=='play'||!p.dotaItems?.includes(id)||!item?.active||this.activeCooldown(p,id)>0)return false;
   const raw=aimOverride||P.Core.aimDirection?.(p)||{x:Math.cos(p.aim||0),y:Math.sin(p.aim||0)},length=Math.hypot(raw.x,raw.y);if(!Number.isFinite(length)||length<.001)return false;const aim={x:raw.x/length,y:raw.y/length};
   if(P.Coop?.active){if(!P.Coop.canAct())return false;P.Coop.send({type:'activity',action:'dota-active',id:{...aim,item:id}});return true}
   if(P.Coop?.session||P.state.domain||this.runtime(p).travel)return false;
   if(this.familyFor(id)==='blink')return blink.call(this,aim);
   const now=this.now(),r=this.runtime(p),family=this.familyFor(id);let used=true;
   switch(id){
    case 'phase':p.dotaHaste=Math.max(p.dotaHaste||0,3);r.phaseUntil=now+3;break;
    case 'travel':{
     if(this.travelBlocked())return false;const ally=this.allies().find(q=>q!==p&&q.hp>0),key=this.arenaKey();
     if(!ally){if(this.allies().length>1)return false;if(!r.travelMark||r.travelMark.key!==key){r.travelMark={x:p.x,y:p.y,key};P.Loot.notify('Punto de regreso marcado');this.hud();return true}}
     r.travel={until:now+2,hp:p.hp,hurtAt:p.hurtAt,key,slot:ally?.slot??null,allyId:ally?.id??null,destination:ally?null:{x:r.travelMark.x,y:r.travelMark.y}};P.Loot.notify('Canalizando viaje…');this.hud();return true;
    }
    case 'stick':case 'wand':{const charges=p.dotaCharges?.stick||0;if(!charges||p.hp>=p.maxHp)return false;this.heal(p,p.maxHp*item.heal*charges);p.dotaCharges.stick=0;break}
    case 'blade-mail':r.reflectUntil=now+4;break;
    case 'satanic':r.satanicUntil=now+4;break;
    case 'mask-madness':r.madUntil=now+4;break;
    case 'glimmer-cape':{const ally=this.target(p,aim,180,()=>true,this.allies())||p;if(!this.specialShield(ally,.06,3))return false;break}
    case 'pipe-insight':{used=false;for(const q of this.allies())if(q.hp>0&&Math.hypot(q.x-p.x,q.y-p.y)<=180)used=this.specialShield(q,.06,4)||used;break}
    case 'black-king-bar':r.bkbUntil=now+4;r.controlSeen={};for(const k of this.slowFields)p[k]=now;break;
    case 'hand-midas':{const e=this.target(p,aim,240,e=>!e.boss&&!e.mapBoss&&!e.miniboss&&!e.heavy&&!e.elite&&!(e.evolution>0)&&!e.summoned&&!e.vultureMinion&&!e.mimic&&!e.practiceBoss);if(!e||P.state.practice||P.state.devRun)return false;this.secondary(p,e,Math.max(1,e.hp)*1000,'physical',true);if(e.hp>0)return false;P.state.coins=(P.state.coins||0)+8;P.Loot.notify('+8 monedas');break}
    case 'abyssal-blade':{const e=this.target(p,aim,180);if(!e)return false;if(e.boss||e.mapBoss||e.miniboss){if(P.BossHealth.transitioning(e)||['mini-entry','mini-fury','mini-shutdown'].includes(e.phase))return false;e.makanakySlow=.1;e.makanakySlowUntil=Math.max(e.makanakySlowUntil||0,now+.5)}else e.makanakyStunUntil=Math.max(e.makanakyStunUntil||0,now+P.Stats.statusDuration(e,.55));this.secondary(p,e,p.power*.25,'physical');break}
    case 'mjollnir':r.lightningUntil=now+4;break;
    default:return false;
   }
   if(!used)return false;p.dotaCooldowns||={};p.dotaCooldowns[family]=item.cooldown;P.Entities.burst(p.x,p.y,'#91dce9');this.hud();return true
  },
  specialShield(p,ratio,seconds){const now=this.now(),r=this.runtime(p);if(!(p.hp>0)||Object.values(r.shields).some(sh=>sh.type==='special'&&sh.until>now&&sh.amount>0))return false;this.shield(p,'special-equipment',ratio,seconds,'special');return true},
  slowFields:['tacticSlowUntil','extinctionSlowUntil','extinctionChargeSlowUntil','dynamicZoneSlowUntil','fiscalSlowUntil'],
  cancelTravel(p){const r=p?.dotaRuntime;if(!r?.travel)return;delete r.travel;p.dotaCooldowns||={};p.dotaCooldowns.boots=Math.max(p.dotaCooldowns.boots||0,5);P.Loot.notify('Viaje interrumpido')},
  travelStep(p){const r=p?.dotaRuntime,t=r?.travel;if(!t)return;if(p.hp<=0||p.hp<t.hp||p.hurtAt!==t.hurtAt||t.key!==this.arenaKey()||this.travelBlocked()){this.cancelTravel(p);return}if(this.now()<t.until)return;const ally=t.allyId?this.allies().find(q=>q!==p&&q.id===t.allyId&&(q.slot??null)===t.slot&&q.hp>0):null;if(t.allyId&&!ally){this.cancelTravel(p);return}const dest=this.landing(p,ally||t.destination);if(!dest){this.cancelTravel(p);return}p.x=dest.x;p.y=dest.y;p.inv=Math.max(p.inv||0,.7);p.dotaCooldowns||={};p.dotaCooldowns.boots=60;delete r.travel;P.Entities.burst(p.x,p.y,'#91dce9');P.Loot.notify('Viaje completado')}
 });
 const mitigate=D.mitigate;D.mitigate=function(p,amount,source){const type=source?.damageType||source?.combatStats?.damageType||'physical';if(amount>0)this.cancelTravel(p);if(type==='special'&&p.dotaRuntime?.bkbUntil>this.now())amount*=.8;return mitigate.call(this,p,amount,source)};
 const received=D.received;D.received=function(p,source,damage){received.call(this,p,source,damage);if(!(damage>0))return;this.cancelTravel(p);const r=this.runtime(p),now=this.now();if(p.hp>0&&r.lightningUntil>now&&this.equipped(p,'javelin')?.id==='mjollnir'&&(r.ready.lightning||0)<=now){r.ready.lightning=now+1;let count=0;for(const e of P.state.enemies){if(e.hp<=0||Math.hypot(e.x-p.x,e.y-p.y)>180||!P.Terrain.clear(p.x,p.y,e.x,e.y,4))continue;this.secondary(p,e,p.power*.25,'special');if(++count>=3)break}}};
 const hit=P.PlayerFeedback.hit;P.PlayerFeedback.hit=function(p,amount,source){if(p.dotaRuntime?.phaseUntil>D.now()&&P.state.enemies.includes(source)&&Math.hypot(p.x-source.x,p.y-source.y)<(source.r||12)+18)return 0;return hit.call(this,p,amount,source)};
 const tick=D.equipmentTick;D.equipmentTick=function(p){tick.call(this,p);this.travelStep(p)};
 const summary=P.LootChoices.effect;P.LootChoices.effect=function(item,family){if(!item.active)return summary.call(this,item,family);const mods=item.mods||{},bonuses=[];if(mods.speed)bonuses.push('+'+this.percent(mods.speed-1)+' velocidad');if(item.physical)bonuses.push('−'+this.percent(item.physical)+' daño físico');if(item.special)bonuses.push('−'+this.percent(item.special)+' daño especial');if(item.vamp)bonuses.push('robo '+this.percent(item.vamp));return [...bonuses,item.activeText+' · '+item.cooldown+' s'].join(' · ')};
 D.hud=function(){
  const node=P.$('#dota-inventory'),p=P.state.player;if(!node)return;node.hidden=!p||P.state.mode==='menu';if(!p)return;
  const ids=p.dotaItems||[],selected=this.selected(p),charges=p.dotaCharges?.stick||0,channel=Math.max(0,Math.ceil((p.dotaRuntime?.travel?.until||0)-this.now())),signature=[...ids,selected,charges,channel,p.dotaRuntime?.travelMark?.key,P.state.mode,...ids.map(id=>Math.ceil(this.activeCooldown(p,id)))].join('|');
  for(const slot of node.querySelectorAll?.('[data-active-id]')||[]){const id=slot.dataset.activeId,item=this.data(id);slot.style?.setProperty?.('--cooldown-percent',Math.min(100,this.activeCooldown(p,id)/item.cooldown*100)+'%')}
  if(node.dataset.signature===signature)return;node.dataset.signature=signature;node.replaceChildren();
  const make=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el},head=make('div',undefined,'dota-active-heading');head.append(make('strong',this.hasActive(p)?'OBJETOS · E USAR':'OBJETOS','dota-inventory-title'));
  if(this.activeItems(p).length>1){const cycle=make('button','F ↻','dota-active-cycle');cycle.type='button';cycle.title='Cambiar objeto de la tecla E';cycle.setAttribute('aria-label',cycle.title);cycle.onclick=()=>this.cycle();head.append(cycle)}node.append(head);
  const slots=make('div',undefined,'dota-inventory-slots');for(let i=0;i<this.capacity;i++){
   const id=ids[i],item=this.data(id),active=!!item?.active,remaining=Math.ceil(this.activeCooldown(p,id)),family=this.familyFor(id),slot=make(active?'button':'div',undefined,'dota-inventory-slot'+(item?' equipped':' empty')+(active?' active-item':'')+(id===selected?' selected-active':''));
   if(!item){slot.setAttribute('aria-label','Espacio vacío');slots.append(slot);continue}
   if(active){slot.type='button';slot.dataset.activeId=id;slot.disabled=P.state.mode!=='play';slot.onclick=()=>{this.selectedId=id;this.activate(null,id);this.hud()};slot.style?.setProperty?.('--cooldown-percent',Math.min(100,remaining/item.cooldown*100)+'%');if(id===selected)slot.append(make('kbd','E','dota-item-key'))}else slot.tabIndex=0;
   const img=make('img',undefined,'dota-inventory-icon');img.src=this.iconUrl(item.icon);img.alt='';img.width=38;img.height=38;img.decoding='async';img.onerror=()=>{const fallback=make('canvas',undefined,'dota-inventory-icon');fallback.width=32;fallback.height=32;P.UI.pixelIcon(fallback,item.icon);img.replaceWith(fallback)};
   let state=active?(remaining?remaining+' s':family==='stick'?charges+'/'+item.charges:channel&&id==='travel'?'VIAJE '+channel+' s':'LISTO'):'AUTO';if(id==='travel'&&!remaining&&!channel&&this.allies().length===1)state=p.dotaRuntime?.travelMark?.key===this.arenaKey()?'VOLVER':'MARCAR';
   slot.title=item.name+' · '+item.description;slot.setAttribute('aria-label',item.name+'. '+state+'. '+item.description);slot.append(img,make('span',item.name,'dota-inventory-name'),make('small',state,'dota-inventory-state'));slots.append(slot)
  }node.append(slots);node.setAttribute('aria-label','Objetos equipados. Pulsa un icono para usarlo. E usa el seleccionado; F cambia la selección.')
 };
 addEventListener('keydown',e=>{if(e.repeat||e.key?.toLowerCase()!=='f'||P.state.mode!=='play'||['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName)||e.target?.isContentEditable)return;if(D.activeItems().length>1){e.preventDefault();D.cycle()}});
 const states=P.PlayerStatus.states;P.PlayerStatus.states=function(p){const result=states.call(this,p),r=p?.dotaRuntime,now=D.now();if(!r)return result;for(const [key,label,detail]of [['reflectUntil','REFLEJO FÍSICO','Devuelve 20% del daño físico perdido'],['phaseUntil','FASE','Evita daño de contacto; las paredes siguen bloqueando'],['lightningUntil','RAYOS','Al perder vida: descarga especial, máximo una/s']])if(r[key]>now)result.push({id:'dota-'+key,icon:'◆',label,detail,until:r[key],kind:'buff',color:'#a5eaff'});if(r.travel)result.push({id:'dota-travel',icon:'↗',label:'VIAJE '+Math.max(0,Math.ceil(r.travel.until-now))+' s',detail:'Recibir daño cancela',until:r.travel.until,kind:'buff',color:'#a5eaff'});for(const state of result)if(state.id==='dota-bkb')state.detail='−20% daño especial y −50% duración de nuevas ralentizaciones';return result};
}
