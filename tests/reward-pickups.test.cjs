const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {Simulation}=require('../backend/simulation.cjs');

function setup(){
 const sim=new Simulation('campo',[0]);
 sim.use(sim.players[0]);
 return {P:sim.P,s:sim.P.state,p:sim.players[0]};
}

test('Panetón recupera 25% de vida máxima sin superar el máximo',()=>{
 const {P,p}=setup();
 p.maxHp=100;p.hp=60;
 assert(P.Loot.collect({kind:'paneton',heal:.25}));
 assert.equal(p.hp,85);
 p.hp=95;P.Loot.collect({kind:'paneton',heal:.25});
 assert.equal(p.hp,100);
});

test('Imán criollo triplica temporalmente el alcance base de recolección',()=>{
 const {P,s,p}=setup();
 p.magnet=80;s.elapsed=10;
 assert(P.Loot.collect({kind:'magnet-pulse',duration:8}));
 assert.equal(p.magnetBoostUntil,18);
 const gem={x:p.x+180,y:p.y,value:1};s.gems=[gem];
 P.Systems.collect(.1);
 assert(gem.x<p.x+180,'la experiencia entra en acción de imán fuera del alcance base');
 s.elapsed=19;const other={x:p.x+180,y:p.y,value:1};s.gems=[other];
 P.Systems.collect(.1);
 assert.equal(other.x,p.x+180,'el impulso termina y conserva el alcance normal');
});

test('Cristales de experiencia compactos, panetón e imán tienen dibujo propio',()=>{
 const {P}=setup(),calls=[],scales=[],ctx=new Proxy({save(){},restore(){},translate(){},scale(x,y){scales.push([x,y])},rotate(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){},fillRect(){},arc(){},stroke(){}},{set(target,key,value){target[key]=value;calls.push(key);return true}});
 assert(P.Loot.drawDrop(ctx,{x:0,y:0,value:1}));
 assert(P.Loot.drawDrop(ctx,{x:0,y:0,kind:'paneton'}));
 assert(P.Loot.drawDrop(ctx,{x:0,y:0,kind:'magnet-pulse'}));
 assert(calls.includes('fillStyle'));
 assert.deepEqual(scales[0],[.84,.84]);
 assert.equal(P.Loot.xpGemScale,.84);
});

test('La moneda del suelo usa el sprite animado de un sol peruano',()=>{
 const art=fs.readFileSync(path.join(__dirname,'../public/assets/loot/sol-peruano-spin-v1.png'));
 assert.equal(art.subarray(1,4).toString(),'PNG');
 const source=fs.readFileSync(path.join(__dirname,'../src/rendering/loot-art.js'),'utf8');
 assert.match(source,/sol-peruano-spin-v1\.png/);
 assert.match(source,/frame\*cell/);
});
