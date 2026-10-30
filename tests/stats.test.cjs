'use strict';
const fs=require('node:fs'),{test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');
const close=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);
function setup(){const sim=new Simulation('campo',[0,1]);return {sim,P:sim.P,s:sim.P.state,p:sim.players[0]}}

test('Contrato universal: jugables, minions, minijefes y jefes comparten todos los stats',()=>{
 const {P}=setup(),entities=[...P.Data.characters.map(c=>P.Entities.player(c)),P.Entities.enemy(),P.Entities.enemy(true),P.Minibosses.create('campo',{x:0,y:0}),P.Attributes.init({design:4,heavy:true,hp:100,max:100}),P.Attributes.init({mapBoss:true,kind:'vulture',hp:100,max:100})];
 for(const entity of entities){assert(P.Stats.validate(entity),entity.id||entity.name||entity.kind||'entidad');for(const key of Object.keys(P.Stats.defaults))assert(Number.isFinite(entity.combatStats[key]),key)}
});

test('Perforación, resistencia de estado, crítico y defensa crítica usan una sola fórmula',()=>{
 const {P,p}=setup(),target=P.Attributes.init({design:0,hp:1000,max:1000});p.combatStats=P.Attributes.stats('force','physical');target.combatStats=P.Attributes.stats('force','physical',200,100);
 close(P.Attributes.multiplier(p.combatStats,target.combatStats,'physical'),2/3);p.combatStats.penetration=.5;close(P.Attributes.multiplier(p.combatStats,target.combatStats,'physical'),1);
 target.combatStats.statusResistance=.25;close(P.Stats.statusDuration(target,2),1.5);
 p.combatStats.criticalChance=1;p.combatStats.criticalDamage=2;target.combatStats.criticalDefense=.4;const crit=P.Stats.critical(p,target);assert(crit.critical);close(crit.multiplier,1.6);
});

test('Regeneración y recuperación son neutrales por defecto y funcionan al configurarse',()=>{
 const {P,p}=setup();p.hp=50;p.combatStats.healthRegen=3;close(P.Stats.regen(p,2),6);close(p.hp,56);
 p.dotaItems=['blink'];p.dotaCooldowns={blink:10};p.combatStats.recoveryRate=2;P.DotaItems.tick(1);close(p.dotaCooldowns.blink,8);
});

test('Robo de vida cura al dueño real del impacto sin exceder su vida máxima',()=>{
 const {P,s,p}=setup(),enemy=P.Entities.enemy();s.player=p;p.hp=50;p.maxHp=100;p.combatStats.lifeSteal=.2;enemy.hp=enemy.max=1000;const before=enemy.hp;P.Entities.hurt(enemy,100,0,P.Attributes.source(p));close(p.hp,50+(before-enemy.hp)*.2);p.hp=95;P.Entities.hurt(enemy,100,0,P.Attributes.source(p));close(p.hp,100);
});

test('Balance acepta snapshots antiguos y rellena los nuevos campos con valores neutrales',()=>{
 const {P}=setup(),defaults=P.CharacterBalance.defaults(),id=Object.keys(defaults)[0],legacy=Object.fromEntries(['hp','power','speed','cooldown','reach','physicalAttack','specialAttack','physicalDefense','specialDefense'].map(k=>[k,defaults[id][k]]));
 P.CharacterBalance.apply({revision:2,overrides:{[id]:legacy}});assert(P.CharacterBalance.overrides[id]);assert.equal(P.CharacterBalance.overrides[id].penetration,0);assert.equal(P.CharacterBalance.overrides[id].criticalDamage,1.5);assert(P.CharacterBalance.valid(P.CharacterBalance.overrides[id]));
});

test('Causas prioriza cinco stats y conserva el contrato completo desplegable',()=>{
 const source=fs.readFileSync('src/ui/reference-menus.js','utf8');
 assert(source.includes("title:'CANALES DE ATAQUE Y DEFENSA'"));
 assert(source.includes("title:'STATS AVANZADOS'"));
 assert(source.includes("title:'CANALES DE COMBATE'"));
 assert(source.includes('this.bossStatGroups(selected,record)'));
 assert(source.includes("this.statSection('STATS PRINCIPALES',stats.rows.slice(0,5),true)"));
 assert(source.includes('this.characterStatGroups(character,stats.rows)'));
 assert(source.includes("this.statSection('STATS PRINCIPALES',stats.rows.slice(0,5),true)"));
});

test('Makanaky encadena diez marcas y convierte el siguiente impacto en Golpe Real',()=>{
 const {P,s}=setup(),c=P.Data.characters.find(c=>c.id==='makanaky'),p=P.Entities.player(c),enemy=P.Attributes.init({x:60,y:0,r:12,hp:1000,max:1000,combatStats:P.Attributes.stats('force','physical')});s.player=p;s.mode='play';s.elapsed=0;s.effects=[];s.enemies=[enemy];p.x=0;p.y=0;p.aim=0;p.combatStats.criticalChance=0;
 const damage=[];for(let i=0;i<11;i++){enemy.x=60;enemy.y=0;const before=enemy.hp;assert(P.Combat.cast());damage.push(before-enemy.hp);s.elapsed+=.2}
 for(let i=1;i<10;i++)close(damage[i],damage[0]);close(damage[10],damage[0]*1.35);assert.equal(p.passive.stacks,0);assert.equal(p.passive.royalSerial,1);assert(s.effects.some(e=>e.text==='♛ GOLPE REAL'));
});

test('Racha de la Realeza pierde dos al fallar, decae gradualmente y excluye al minijefe',()=>{
 const {P,s}=setup(),c=P.Data.characters.find(c=>c.id==='makanaky'),p=P.Entities.player(c),attack={...P.Data.attacks.royalEcho,arsenalId:'royalEcho'};s.player=p;s.mode='play';s.elapsed=0;P.Passives.afterCast(p,attack,1,{});P.Passives.afterCast(p,attack,1,{});P.Passives.afterCast(p,attack,1,{});assert.equal(p.passive.stacks,3);close(P.Passives.cooldownMultiplier(p),1);P.Passives.afterCast(p,attack,0,{});assert.equal(p.passive.stacks,1);s.elapsed=2.51;P.Passives.tick(p);assert.equal(p.passive.stacks,0);
 const mini={...p,miniboss:true,passive:undefined};assert.equal(P.Passives.eligible(mini,attack),false);assert.equal(P.Passives.state(mini),null);assert.equal(Object.keys(P.Passives.beforeCast(mini,attack)).length,0);
});

test('Las fichas muestran las mismas pasivas que usa el combate',()=>{
 const {P}=setup(),makanaky=P.Passives.rows('makanaky'),kingteka=P.Passives.rows('kingteka'),source=fs.readFileSync('src/ui/reference-menus.js','utf8');assert.equal(makanaky[0][1],'Racha de la Realeza');assert(makanaky.some(row=>row[1].includes('+35 % daño')));assert.equal(kingteka[0][1],'Instinto de expedición');assert(kingteka.some(row=>row[1].includes('+12 % daño')));assert(source.includes("label:'PASIVA ÚNICA'"));assert(source.includes("c.id==='kingteka'?'↻':'◆'"));assert(source.includes('owner.idleFrame(time)'));
});

test('Todas las Q y R registradas por módulos tardíos conservan ficha técnica',()=>{
 const {P}=setup();
 for(const [id,entry] of Object.entries(P.AbilityCards.entries)){
  assert(entry.title,`${id}: falta título`);
  assert(entry.description?.length>30,`${id}: falta descripción funcional`);
  assert(entry.details?.length>=3,`${id}: falta ficha técnica`);
 }
});
