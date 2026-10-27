'use strict';
// Registro autoritativo de pasivas. El estado vive en el jugador y viaja en snapshots cooperativos.
P.Passives={
 definitions:{
  makanaky:{name:'Racha de la Realeza',short:'Encadena cuatro golpes GA. El cuarto es un Golpe Real.',trigger:'Ataque principal o evolución con impacto',reset:'Fallar o pasar 1,8 s sin conectar',max:4,duration:1.8,cadence:.05,reach:.03,royalDamage:1.35,royalPush:1.4}
 },
 definition(actor){return actor&&this.definitions[actor.id]||null},
 eligible(actor,attack){return !!(actor&&actor.id==='makanaky'&&!actor.miniboss&&actor.attack==='royalEcho'&&attack?.kind==='melee')},
 state(actor,create=true){if(!actor||actor.id!=='makanaky'||actor.miniboss)return null;if(!actor.passive&&create)actor.passive={id:'makanaky',stacks:0,expires:0,royalSerial:0};return actor.passive||null},
 now(){return Number(P.state?.elapsed)||0},
 expire(actor){const state=this.state(actor,false);if(state&&state.stacks>0&&this.now()>state.expires){state.stacks=0;state.expires=0}return state},
 tick(actor){this.expire(actor)},
 beforeCast(actor,attack){if(!this.eligible(actor,attack))return {};const state=this.expire(actor)||this.state(actor),def=this.definition(actor),royal=state.stacks===def.max-1;return {passive:'makanaky',royal,range:1+state.stacks*def.reach,damage:royal?def.royalDamage:1,push:royal?def.royalPush:1,stacks:state.stacks}},
 afterCast(actor,attack,hits,cast={}){if(!this.eligible(actor,attack))return;const state=this.state(actor),def=this.definition(actor);if(!hits){state.stacks=0;state.expires=0;return}if(cast.royal){state.stacks=0;state.expires=0;state.royalSerial=(state.royalSerial||0)+1;return}state.stacks=Math.min(def.max-1,state.stacks+1);state.expires=this.now()+def.duration},
 impact(actor,attack,target,cast={}){if(!cast.royal||!this.eligible(actor,attack)||!target)return;const effects=P.state.effects;if(effects?.length<300){effects.push({kind:'shout',text:'♛ GOLPE REAL',x:target.x,y:target.y-(target.r||18)-24,life:.7,maxLife:.7,color:'#f3a2ff'});for(let i=0;i<5;i++){const a=i*Math.PI*2/5;effects.push({kind:'spark',x:target.x,y:target.y,vx:Math.cos(a)*95,vy:Math.sin(a)*95,life:.35,maxLife:.35,color:i%2?'#ef92cf':'#ffe58f'})}}},
 cooldownMultiplier(actor){const state=this.expire(actor),def=this.definition(actor);return state&&def?1-state.stacks*def.cadence:1},
 rows(id){const def=this.definitions[id];if(!def)return [];return [['Nombre',def.name],['Activación',def.trigger],['Racha','GA ×'+def.max],['Por marca','−5 % intervalo · +3 % alcance'],['Remate','+35 % daño · +40 % empuje'],['Reinicio',def.reset]]},
 hud(){if(typeof document==='undefined')return;let node=P.$('#passive-hud');if(!node){node=document.createElement('section');node.id='passive-hud'}if(!node._passive){node.id='passive-hud';node.setAttribute('aria-live','polite');const label=document.createElement('small'),title=document.createElement('strong'),marks=document.createElement('div'),status=document.createElement('span');label.textContent='PASIVA ÚNICA';marks.setAttribute('aria-hidden','true');node.append(label,title,marks,status);node._passive={title,marks,status};if(!node.parentNode)document.body.append(node)}const p=P.state.player,def=this.definition(p),show=!!def&&P.state.mode==='play';node.hidden=!show;if(!show)return;const state=this.expire(p)||{stacks:0,expires:0},royal=state.stacks===def.max-1,{title,marks,status}=node._passive;title.textContent=def.name;marks.replaceChildren(...Array.from({length:def.max},(_,i)=>{const mark=document.createElement('i');mark.dataset.active=String(i<state.stacks);mark.dataset.royal=String(royal&&i===def.max-1);mark.textContent='GA';return mark}));status.textContent=royal?'SIGUIENTE IMPACTO · GOLPE REAL':state.stacks?'RACHA '+state.stacks+'/'+def.max+' · '+Math.max(0,state.expires-this.now()).toFixed(1)+' s':'CONECTA PARA INICIAR LA RACHA'},
 install(){const create=P.Entities.player;P.Entities.player=function(c){const actor=create.call(this,c);P.Passives.state(actor);return actor};const hud=P.UI?.hud;if(hud)P.UI.hud=function(...args){const value=hud.apply(this,args);P.Passives.hud();return value}}
};
P.Passives.install();
