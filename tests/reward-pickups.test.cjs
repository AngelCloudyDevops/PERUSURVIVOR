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
 const art=fs.readFileSync(path.join(__dirname,'../public/assets/loot/sol-peruano-flip-v2.png'));
 assert.equal(art.subarray(1,4).toString(),'PNG');
 const source=fs.readFileSync(path.join(__dirname,'../src/rendering/loot-art.js'),'utf8');
 assert.match(source,/sol-peruano-flip-v2\.png/);
 assert.match(source,/Math\.cos\(age\*7\)/);
 assert.match(source,/Math\.max\(\.1,Math\.abs\(turn\)\)/);
});

test('Los minions normales pueden dejar una moneda al morir',()=>{
 const {P,s}=setup(),e=P.Entities.enemy();
 Object.assign(e,{x:30,y:40,hp:1,max:1});
 s.enemies=[e];
 P.Loot.roll=(x,y,salt)=>salt===703?.029:1;
 P.Entities.hurt(e,99);
 const coins=s.gems.filter(g=>g.minionCoin);
 assert.equal(coins.length,1);
 assert.equal(coins[0].kind,'coin');assert.equal(coins[0].value,1);
 assert.equal(coins[0].x,42);assert.equal(coins[0].y,48);
});

test('Las monedas de minion respetan el 3 %, el límite por minuto y las exclusiones',()=>{
 const {P,s}=setup(),enemy=i=>({x:i,y:0}),drop=(e,i)=>P.Loot.minionCoinDrop(e,i);
 s.mapTime=10;P.Loot.roll=()=>.03;
 assert.equal(drop(enemy(0),0),false,'3 % es el límite superior exclusivo');
 P.Loot.roll=()=>.029;
 for(let i=0;i<8;i++)assert.equal(drop(enemy(i),i),true);
 assert.equal(drop(enemy(9),9),false,'el noveno drop del minuto queda bloqueado');
 s.mapTime=61;
 assert.equal(drop(enemy(10),10),true,'el cupo se reinicia en el siguiente minuto');
 for(const flags of [{keyTier:'rare'},{summoned:true},{vultureMinion:true},{mimic:true}])assert.equal(drop({...enemy(20),...flags},20),false);
 s.practice=true;assert.equal(drop(enemy(30),30),false);
 s.practice=false;s.devRun=true;assert.equal(drop(enemy(31),31),false);
 assert.equal(s.gems.filter(g=>g.minionCoin).length,9);
});
