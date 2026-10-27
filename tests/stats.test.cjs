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

test('Causas y Jefes presentan el contrato completo sin recortar los stats',()=>{
 const source=fs.readFileSync('src/ui/reference-menus.js','utf8');
 assert(source.includes("title:'CANALES DE ATAQUE Y DEFENSA'"));
 assert(source.includes("title:'STATS AVANZADOS'"));
 assert(source.includes("title:'CANALES DE COMBATE'"));
 assert(source.includes('this.bossStatGroups(selected,record)'));
 assert(!source.includes('stats.rows.slice(0,5)'));
});
