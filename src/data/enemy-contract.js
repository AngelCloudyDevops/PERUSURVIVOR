'use strict';
// Contrato único de diseño para amenazas. Describe capacidades; no crea ataques.
P.EnemyContract={
 version:1,
 limits:{
  minion:{label:'Minion',attacks:1,roleAbilities:0,passives:1,phases:1},
  dinosaur:{label:'Dinosaurio',attacks:1,roleAbilities:1,passives:1,phases:1},
  miniboss:{label:'Minijefe',attacks:3,roleAbilities:0,passives:1,phases:2},
  boss:{label:'Jefe',attacks:4,roleAbilities:0,passives:2,phases:2}
 },
 category(entry={}){if(entry.type==='minion'||entry.id?.startsWith('minion:'))return'minion';if(entry.type==='dinosaur'||entry.id?.startsWith('dinosaur:'))return'dinosaur';if(entry.type==='mini'||entry.id?.startsWith('mini:'))return'miniboss';return'boss'},
 stats(entry={},category=this.category(entry)){if(entry.stats||entry.combatStats)return P.Stats.normalize(entry.stats||entry.combatStats);if(category==='minion'&&Number.isInteger(entry.design)){const i=Math.max(0,entry.design)%6;return P.Attributes.stats(P.Attributes.types[i%3],i<3?'physical':'special',entry.heavy?110:100,entry.heavy?90:100)}if(category==='miniboss'&&entry.miniKey){const i={campo:0,plaza:1,machu:2,makanaky:0}[entry.miniKey];if(i!==undefined)return P.Attributes.stats(P.Attributes.types[i],i===2?'special':'physical',i===0?110:95,i===2?110:95)}return null},
 role(entry={},category=this.category(entry)){if(entry.role)return entry.role;if(category==='dinosaur'&&entry.group?.includes('·'))return entry.group.split('·').at(-1).trim().toLocaleLowerCase('es');return null},
 weakAgainst(attribute){return Object.keys(P.Attributes.beats).find(key=>P.Attributes.beats[key]===attribute)||null},
 slots(values=[],limit=0,label='Pieza'){return Array.from({length:limit},(_,index)=>{const value=values[index];return {slot:index+1,name:value||'Por definir',status:value?'implemented':'reserved',label:value?'Implementado':'Por definir',kind:label}})},
 describe(entry={}){
  const category=this.category(entry),limit=this.limits[category],stats=this.stats(entry,category),attribute=stats?.attribute||null,weak=this.weakAgainst(attribute),attacks=[...(entry.attacks||[])],passives=[...(entry.passives||entry.ranks?.slice(-1)||[])],roleAbilities=category==='dinosaur'?attacks.slice(1,2):[],role=this.role(entry,category),damageType=['physical','special'].includes(stats?.damageType)?stats.damageType:null;
  const attackValues=category==='dinosaur'?attacks.slice(0,1):attacks,passiveValues=category==='dinosaur'&&passives.length?[passives.join(' ')]:passives,phases=category==='miniboss'||category==='boss'?2:1,attackSlots=this.slots(attackValues,limit.attacks,'Ataque'),roleAbilitySlots=this.slots(roleAbilities,limit.roleAbilities,'Habilidad de rol'),passiveSlots=this.slots(passiveValues,limit.passives,'Pasiva'),phaseSlots=this.slots(Array.from({length:phases},(_,index)=>index?'Fase II':'Fase I'),limit.phases,'Fase'),allSlots=[...attackSlots,...roleAbilitySlots,...passiveSlots,...phaseSlots],implemented=allSlots.filter(slot=>slot.status==='implemented').length,total=allSlots.length;
  return {version:this.version,category,label:limit.label,role:role||'Por definir',roleDefined:!!role,attribute,attributeLabel:P.Attributes.names[attribute]||'Desconocido',damageType,damageTypeLabel:damageType==='special'?'Daño especial':damageType==='physical'?'Daño físico':'Canal desconocido',weakAgainst:weak,weakness:weak?'Recibe la desventaja de atributo frente a '+P.Attributes.names[weak]:attribute?'Debilidad de atributo por definir':'Desconocida · atributo por definir',attacks:attackValues,roleAbilities,passives:passiveValues,attackSlots,roleAbilitySlots,passiveSlots,phaseSlots,implemented,total,reserved:total-implemented,completion:total?Math.round(implemented/total*100):0,guide:entry.guide||entry.dodge||'',limits:{...limit},phases}
 },
 valid(contract){const limit=this.limits[contract?.category];return !!limit&&contract.version===this.version&&contract.attacks.length<=limit.attacks&&contract.roleAbilities.length<=limit.roleAbilities&&contract.passives.length<=limit.passives&&contract.phases<=limit.phases&&typeof contract.role==='string'&&!!contract.role}
};
