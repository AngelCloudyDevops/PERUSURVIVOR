'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');

test('Kingteka es UR y Cerdito VTuber comparte identidad de colección',()=>{
  const {P}=new Simulation('campo',[0,1]),G=P.Gacha,data=P.Meta.blank();
  assert.equal(G.tier('kingteka'),'ultra');
  assert.equal(G.tier('cerdito'),'ultra');
  assert.equal(G.canonical('cerdito'),'kingteka');
  assert(G.isVariant('cerdito'));
  assert(!Object.values(G.tiers).flatMap(t=>t.ids).includes('cerdito'));
  data.unlocked.push('kingteka');
  data.gachaStars.kingteka={rank:3,copies:4};
  assert(G.owns('cerdito',data));
  assert.deepEqual(G.star('cerdito',data),{rank:3,copies:4});
});

test('un guardado antiguo con Cerdito sigue desbloqueando ambas versiones',()=>{
  const {P}=new Simulation('campo',[0,1]),G=P.Gacha,data=P.Meta.blank();
  data.unlocked.push('cerdito');
  data.gachaStars.cerdito={rank:2,copies:1};
  assert(G.owns('kingteka',data));
  assert(G.owns('cerdito',data));
  assert.deepEqual(G.star('kingteka',data),{rank:2,copies:1});
  assert.deepEqual(G.star('cerdito',data),{rank:2,copies:1});
});
