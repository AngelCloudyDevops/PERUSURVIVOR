'use strict';
// Contrato universal de combate. Los valores neutrales preservan el balance anterior.
P.Stats={
 version:1,
 defaults:{penetration:0,statusResistance:0,healthRegen:0,criticalChance:0,criticalDamage:1.5,criticalResistance:0,criticalDefense:0,recoveryRate:1,lifeSteal:0},
 limits:{penetration:[0,.75],statusResistance:[0,.75],healthRegen:[0,100],criticalChance:[0,1],criticalDamage:[1,5],criticalResistance:[0,.9],criticalDefense:[0,.9],recoveryRate:[.25,4],lifeSteal:[0,.5]},
 labels:{penetration:'Perforación',statusResistance:'Resistencia de estado',healthRegen:'Regeneración',criticalChance:'Prob. crítica',criticalDamage:'Daño crítico',criticalResistance:'Resistencia crítica',criticalDefense:'Defensa crítica',recoveryRate:'Recuperación',lifeSteal:'Robo de vida'},
 clamp(value,min,max,fallback){value=Number(value);return Number.isFinite(value)?Math.max(min,Math.min(max,value)):fallback},
 normalize(stats={}){const next={...stats};this.clampInto(next);return next},
 clampInto(o){const d=this.defaults,l=this.limits;for(const key in d){const k=l[key];o[key]=this.clamp(o[key],k[0],k[1],d[key])}return o},
 init(entity){if(!entity||typeof entity!=='object')return entity;const current=entity.combatStats||{};this.clampInto(current);entity.combatStats=current;return entity},
 percent(value){return Math.round((Number(value)||0)*10000)/100+' %'},
 defense(stats){stats=this.normalize(stats);return Math.round((Number(stats.physicalDefense||100)+Number(stats.specialDefense||100))/2)},
 advancedRows(entity){const s=this.normalize(entity?.combatStats||entity||{});return [['Perforación',this.percent(s.penetration)],['Resistencia de estado',this.percent(s.statusResistance)],['Regeneración',Math.round(s.healthRegen*100)/100+' PV/s'],['Prob. crítica',this.percent(s.criticalChance)],['Daño crítico',this.percent(s.criticalDamage)],['Resistencia crítica',this.percent(s.criticalResistance)],['Defensa crítica',this.percent(s.criticalDefense)],['Recuperación',this.percent(s.recoveryRate)],['Robo de vida',this.percent(s.lifeSteal)]]},
 channelRows(entity){const s=this.normalize(entity?.combatStats||entity||{});return [['Atributo',P.Attributes?.names?.[s.attribute]||'Sin atributo'],['Tipo de daño',s.damageType==='special'?'Especial':'Físico'],['ATQ físico',s.physicalAttack??100],['ATQ especial',s.specialAttack??100],['DEF física',s.physicalDefense??100],['DEF especial',s.specialDefense??100],['Defensa general',this.defense(s)]]},
 effectiveDefense(stats,type){stats=this.normalize(stats);return Math.max(1,Number(stats[(type==='special'?'special':'physical')+'Defense'])||100)},
 penetration(stats){return this.normalize(stats).penetration},
 statusDuration(entity,duration){return Math.max(0,Number(duration)||0)*(1-this.normalize(entity?.combatStats||entity||{}).statusResistance)},
 recovery(entity){return this.normalize(entity?.combatStats||entity||{}).recoveryRate},
 critical(attacker,target,bonusChance=0,bonusMultiplier=1){const a=this.normalize(attacker?.combatStats||attacker||{}),t=this.normalize(target?.combatStats||target||{}),chance=1-(1-a.criticalChance)*(1-Math.max(0,Math.min(1,bonusChance)));if(Math.random()>=chance*(1-t.criticalResistance))return {critical:false,multiplier:1};const raw=Math.max(a.criticalDamage,bonusMultiplier),multiplier=1+(raw-1)*(1-t.criticalDefense);return {critical:true,multiplier}},
 regen(entity,dt){if(!entity||!(entity.hp>0)||!Number.isFinite(entity.maxHp??entity.max))return 0;const max=entity.maxHp??entity.max,k=this.limits.healthRegen,amount=this.clamp(entity.combatStats?.healthRegen,k[0],k[1],this.defaults.healthRegen)*Math.max(0,Number(dt)||0);if(!amount||entity.hp>=max)return 0;const before=entity.hp;entity.hp=Math.min(max,entity.hp+amount);return entity.hp-before},
 lifeSteal(source,damage){const p=P.state?.player,ratio=this.normalize(source?.combatStats||{}).lifeSteal;if(!p||!ratio||source?.fixedDamage||source?.ownerId!==p.id||(source.ownerSlot??null)!==(p.slot??null)||!(p.hp>0)||p.hp>=p.maxHp)return 0;const amount=Math.min(p.maxHp-p.hp,Math.max(0,Number(damage)||0)*ratio);p.hp+=amount;return amount},
 step(state,dt,players=[]){const one=entity=>{if(entity.combatStats?.attribute)this.init(entity);else P.Attributes?.init?.(entity);this.regen(entity,dt)},p=state?.player,list=state?.enemies;for(let i=0;i<players.length;i++){const e=players[i];if(e&&players.indexOf(e)===i)one(e)}if(p&&!players.includes(p))one(p);if(list)for(let i=0;i<list.length;i++){const e=list[i];if(e&&e!==p&&!players.includes(e))one(e)}},
 validate(entity){const s=entity?.combatStats;if(!s)return false;return ['attribute','damageType','physicalAttack','specialAttack','physicalDefense','specialDefense',...Object.keys(this.defaults)].every(key=>key in s&&(typeof s[key]==='string'||Number.isFinite(s[key])))}
};
for(const character of P.Data.characters)P.Stats.init(character);
if(P.Data.boss)P.Attributes.init(P.Data.boss);
