'use strict';
// Registro autoritativo de pasivas. El estado vive en el jugador y viaja en snapshots cooperativos.
P.Passives={
 definitions:{
  kingteka:{name:'Instinto de manada',short:'Cambiar de arma recupera vida y prepara el siguiente ataque.',trigger:'Cambio real entre dos armas desbloqueadas',reset:'La preparación dura 4 s y tiene 7 s de recuperación',heal:.025,damage:1.12,window:4,cooldown:7},
  makanaky:{name:'Racha de la Realeza',short:'Encadena cuatro golpes GA. El cuarto es un Golpe Real.',trigger:'Ataque principal o evolución con impacto',reset:'Fallar o pasar 1,8 s sin conectar',max:4,duration:1.8,cadence:.05,reach:.03,royalDamage:1.35,royalPush:1.4}
 },
 definition(actor){return actor&&this.definitions[actor.id]||null},
 eligible(actor,attack){return !!(actor&&actor.id==='makanaky'&&!actor.miniboss&&actor.attack==='royalEcho'&&attack?.kind==='melee')},
 state(actor,create=true){
  const def=this.definition(actor);if(!actor||!def||actor.miniboss)return null;
  if((!actor.passive||actor.passive.id!==actor.id)&&create)actor.passive=actor.id==='kingteka'?{id:'kingteka',weapon:actor.arsenal?.active||'shotgun',primed:false,readyUntil:0,cooldownUntil:0,adaptedSerial:0}:{id:'makanaky',stacks:0,expires:0,royalSerial:0};
  return actor.passive?.id===actor.id?actor.passive:null
 },
 now(){return Number(P.state?.elapsed)||0},
 expire(actor){
  const state=this.state(actor,false),now=this.now();if(!state)return state;
  if(actor.id==='makanaky'&&state.stacks>0&&now>state.expires){state.stacks=0;state.expires=0}
  if(actor.id==='kingteka'&&state.primed&&now>state.readyUntil){state.primed=false;state.readyUntil=0}
  return state
 },
 tick(actor){this.expire(actor)},
 weaponSwitch(actor,from,to){
  if(actor?.id!=='kingteka'||actor.miniboss||!from||from===to)return false;
  const state=this.expire(actor)||this.state(actor),def=this.definition(actor),now=this.now();state.weapon=to;
  if(now<state.cooldownUntil)return false;
  state.primed=true;state.readyUntil=now+def.window;state.cooldownUntil=now+def.cooldown;
  const amount=Math.max(1,actor.maxHp*def.heal),before=actor.hp;actor.hp=Math.min(actor.maxHp,actor.hp+amount);
  if(P.state.effects?.length<300)P.state.effects.push({kind:'shout',text:'INSTINTO · +'+Math.round(actor.hp-before)+' VIDA',x:actor.x,y:actor.y-58,life:.7,maxLife:.7,color:'#d9ff7a'});
  return true
 },
 beforeCast(actor,attack){
  if(actor?.id==='kingteka'){const state=this.expire(actor),def=this.definition(actor),adapted=!!state?.primed;return adapted?{passive:'kingteka',adapted,damage:def.damage}:{}}
  if(!this.eligible(actor,attack))return {};
  const state=this.expire(actor)||this.state(actor),def=this.definition(actor),royal=state.stacks===def.max-1;
  return {passive:'makanaky',royal,range:1+state.stacks*def.reach,damage:royal?def.royalDamage:1,push:royal?def.royalPush:1,stacks:state.stacks}
 },
 afterCast(actor,attack,hits,cast={}){
  if(actor?.id==='kingteka'&&cast.adapted){const state=this.state(actor);state.primed=false;state.readyUntil=0;state.adaptedSerial=(state.adaptedSerial||0)+1;return}
  if(!this.eligible(actor,attack))return;
  const state=this.state(actor),def=this.definition(actor);if(!hits){state.stacks=0;state.expires=0;return}
  if(cast.royal){state.stacks=0;state.expires=0;state.royalSerial=(state.royalSerial||0)+1;return}
  state.stacks=Math.min(def.max-1,state.stacks+1);state.expires=this.now()+def.duration
 },
 impact(actor,attack,target,cast={}){if(!cast.royal||!this.eligible(actor,attack)||!target)return;const effects=P.state.effects;if(effects?.length<300){effects.push({kind:'shout',text:'♛ GOLPE REAL',x:target.x,y:target.y-(target.r||18)-24,life:.7,maxLife:.7,color:'#f3a2ff'});for(let i=0;i<5;i++){const a=i*Math.PI*2/5;effects.push({kind:'spark',x:target.x,y:target.y,vx:Math.cos(a)*95,vy:Math.sin(a)*95,life:.35,maxLife:.35,color:i%2?'#ef92cf':'#ffe58f'})}}},
 cooldownMultiplier(actor){if(actor?.id!=='makanaky')return 1;const state=this.expire(actor),def=this.definition(actor);return state&&def?1-state.stacks*def.cadence:1},
 rows(id){
  const def=this.definitions[id];if(!def)return [];
  if(id==='kingteka')return [['Nombre',def.name],['Activación',def.trigger],['Preparación','Siguiente ataque: +12 % daño'],['Recuperación','+2,5 % de vida máxima'],['Ventana',def.window+' s'],['Reinicio',def.cooldown+' s']];
  return [['Nombre',def.name],['Activación',def.trigger],['Racha','GA ×'+def.max],['Por marca','−5 % intervalo · +3 % alcance'],['Remate','+35 % daño · +40 % empuje'],['Reinicio',def.reset]]
 },
 hud(){
  if(typeof document==='undefined')return;let node=P.$('#passive-hud');if(!node){node=document.createElement('section');node.id='passive-hud'}
  if(!node._passive){node.id='passive-hud';node.setAttribute('aria-live','polite');const label=document.createElement('small'),title=document.createElement('strong'),marks=document.createElement('div'),status=document.createElement('span');label.textContent='PASIVA ÚNICA';marks.setAttribute('aria-hidden','true');node.append(label,title,marks,status);node._passive={title,marks,status};if(!node.parentNode)document.body.append(node)}
  const p=P.state.player,def=this.definition(p),show=!!def&&P.state.mode==='play';node.hidden=!show;if(!show)return;
  const state=this.expire(p)||{},now=this.now(),{title,marks,status}=node._passive;title.textContent=def.name;
  if(p.id==='kingteka'){
   const order=P.KingtekaArsenal?.order||['shotgun','gallinazo','golpe'],icons={shotgun:'1',gallinazo:'2',golpe:'3'},active=p.arsenal?.active;node.style?.setProperty?.('--passive-columns',order.length);
   marks.replaceChildren(...order.map(id=>{const mark=document.createElement('i');mark.dataset.active=String(id===active);mark.dataset.royal=String(!!state.primed&&id===active);mark.textContent=icons[id];return mark}));
   status.textContent=state.primed?'SIGUIENTE ATAQUE · +12 % DAÑO · '+Math.max(0,state.readyUntil-now).toFixed(1)+' s':state.cooldownUntil>now?'INSTINTO EN '+Math.max(0,state.cooldownUntil-now).toFixed(1)+' s':'CAMBIA DE ARMA PARA ADAPTARTE';return
  }
  const royal=state.stacks===def.max-1;node.style?.setProperty?.('--passive-columns',def.max);marks.replaceChildren(...Array.from({length:def.max},(_,i)=>{const mark=document.createElement('i');mark.dataset.active=String(i<state.stacks);mark.dataset.royal=String(royal&&i===def.max-1);mark.textContent='GA';return mark}));status.textContent=royal?'SIGUIENTE IMPACTO · GOLPE REAL':state.stacks?'RACHA '+state.stacks+'/'+def.max+' · '+Math.max(0,state.expires-now).toFixed(1)+' s':'CONECTA PARA INICIAR LA RACHA'
 },
 install(){const create=P.Entities.player;P.Entities.player=function(c){const actor=create.call(this,c);P.Passives.state(actor);return actor};const hud=P.UI?.hud;if(hud)P.UI.hud=function(...args){const value=hud.apply(this,args);P.Passives.hud();return value}}
};
P.Passives.install();
