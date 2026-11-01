'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');
const close=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const setup=()=>{const sim=new Simulation('campo',[0,1]);return {sim,P:sim.P,s:sim.P.state,p:sim.players[0]}};
// Implementación de referencia: el step original (Set + array combinado + normalize/Object.entries).
const reference=(P,state,dt,players)=>{const seen=new Set();for(const e of [...players,state?.player,...(state?.enemies||[])])if(e&&!seen.has(e)){seen.add(e);P.Attributes.init(e);const max=e.maxHp??e.max;if(e.hp>0&&Number.isFinite(max)){const amount=P.Stats.normalize(e.combatStats).healthRegen*dt;if(amount&&e.hp<max)e.hp=Math.min(max,e.hp+amount)}}};

test('Stats.step recoge mutaciones de stats posteriores al primer paso',()=>{
 const {P,s,p}=setup();p.hp=p.maxHp=100;p.hp=50;P.Stats.step(s,1,[p]);close(p.hp,50);
 p.combatStats.healthRegen=4;P.Stats.step(s,1,[p]);close(p.hp,54);
 p.combatStats.healthRegen=500;P.Stats.step(s,.1,[p]);close(p.hp,64);assert.equal(p.combatStats.healthRegen,100);
 p.combatStats.criticalChance=7;p.combatStats.criticalDamage=NaN;P.Stats.step(s,1,[p]);assert.equal(p.combatStats.criticalChance,1);assert.equal(p.combatStats.criticalDamage,1.5);
 const e=s.enemies[0]||P.Entities.enemy();if(!s.enemies.includes(e))s.enemies.push(e);e.hp=5;e.max=50;P.Stats.step(s,1);const hp=e.hp;e.combatStats.healthRegen=2;P.Stats.step(s,1);close(e.hp,hp+2);
});

test('Stats.step equivale al comportamiento anterior sobre el mismo estado',()=>{
 const a=setup(),b=setup();
 for(const w of [a,b]){const{P,s,p}=w;p.hp=30;for(let i=0;i<6;i++){const e=P.Entities.enemy(i%3===0);e.hp=e.max/2;if(i%2)e.combatStats.healthRegen=1.5+i;if(i===4)e.combatStats.criticalChance='x';s.enemies.push(e)}p.combatStats.healthRegen=2}
 const snap=w=>JSON.stringify([w.p,...w.s.enemies].map(e=>[e.hp,e.combatStats]));
 for(let i=0;i<5;i++){a.P.Stats.step(a.s,.5,[a.p]);reference(b.P,b.s,.5,[b.p])}
 assert.equal(snap(a),snap(b));
 // Un jugador repetido en la lista y como state.player solo regenera una vez.
 a.p.hp=10;a.p.combatStats.healthRegen=1;a.s.player=a.p;a.P.Stats.step(a.s,1,[a.p,a.p]);close(a.p.hp,11);
});
