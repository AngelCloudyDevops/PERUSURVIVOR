const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Simulation}=require('../backend/simulation.cjs');

function setup(){
 const sim=new Simulation('campo',[0]);
 sim.use(sim.players[0]);
 const P=sim.P,s=P.state;
 s.enemies=[];s.gems=[];s.effects=[];P.Loot.expClock=null;
 return {P,s,p:sim.players[0]};
}
function keeper(P,s,tier){
 s.mode='play';s.mapTime=200;P.Loot.nextKeeper={rare:0,legendary:0};s.bossSpawned=false;
 P.Loot.spawnKeepers();
 return s.enemies.find(e=>e.keyTier===tier);
}

test('Portadores: 45 s el raro y 60 s el legendario',()=>{
 const {P,s}=setup();
 const rare=keeper(P,s,'rare'),legendary=keeper(P,s,'legendary');
 assert.equal(rare.keyLeft,45);assert.equal(rare.keyLife,45);
 assert.equal(legendary.keyLeft,60);
});

test('Un portador que expira desaparece sin soltar llave y deja el evento',()=>{
 const {P,s}=setup();
 const e=keeper(P,s,'rare');
 P.Loot.expire(44);
 assert(s.enemies.includes(e),'sigue vivo antes de tiempo');
 assert(Math.abs(e.keyLeft-1)<1e-9);
 P.Loot.expire(1.5);
 assert(!s.enemies.includes(e));
 assert.equal(s.gems.filter(g=>g.kind==='key').length,0);
 const fx=s.effects.filter(f=>f.kind==='loot-expire');
 assert.equal(fx.length,1);
 assert.equal(fx[0].tier,'rare');assert.equal(fx[0].key,false);assert.equal(fx[0].x,e.x);
 P.Loot.enemyDrop(e);
 assert.equal(s.gems.filter(g=>g.kind==='key').length,0,'no suelta llave tras expirar');
});

test('La llave hereda el tiempo restante con un mínimo de 12 s',()=>{
 const {P,s}=setup();
 const a=keeper(P,s,'rare'),b=s.enemies.find(e=>e.keyTier==='legendary');
 P.Loot.expire(10);
 P.Entities.hurt(a,99999);
 let key=s.gems.find(g=>g.kind==='key');
 assert(key,'la llave se suelta al morir');
 assert(Math.abs(key.keyLeft-35)<1e-9);assert.equal(key.keyLife,45);
 s.gems=[];
 P.Loot.expire(45);
 P.Entities.hurt(b,99999);
 key=s.gems.find(g=>g.kind==='key'&&g.rarity==='legendary');
 assert.equal(key.keyLeft,12,'mínimo para poder recogerla');
});

test('Una llave en el suelo expira, se elimina y genera la explosión',()=>{
 const {P,s}=setup();
 s.gems=[{x:50,y:60,kind:'key',rarity:'legendary',value:1,keyLeft:5,keyLife:60}];
 P.Loot.expire(4);
 assert.equal(s.gems.length,1);
 P.Loot.expire(1.1);
 assert.equal(s.gems.length,0);
 const fx=s.effects.find(f=>f.kind==='loot-expire');
 assert(fx&&fx.key===true&&fx.tier==='legendary'&&fx.x===50&&fx.y===60&&fx.life>0);
 for(let i=0;i<30;i++)P.Systems.collect(.04);
 assert(!s.effects.some(f=>f.kind==='loot-expire'),'el evento se limpia solo');
});

test('Recoger la llave a tiempo no la expira y el reloj se congela en arenas',()=>{
 const {P,s,p}=setup();
 s.gems=[{x:p.x,y:p.y,kind:'key',rarity:'rare',value:1,keyLeft:3,keyLife:45}];
 P.Systems.collect(.01);
 assert.equal(s.keys.rare,1);
 P.Loot.expire(10);
 assert(!s.effects.some(f=>f.kind==='loot-expire'));
 s.gems=[{x:5000,y:5000,kind:'key',rarity:'rare',value:1,keyLeft:3,keyLife:45}];
 s.encounter={};P.Loot.expire(10);s.encounter=null;
 assert.equal(s.gems[0].keyLeft,3,'sin cuenta atrás durante un encuentro');
});

test('El reloj usa el tiempo de simulación y limita saltos grandes',()=>{
 const {P,s}=setup();
 s.elapsed=100;P.Loot.expire();
 const g={x:9000,y:9000,kind:'key',rarity:'rare',value:1,keyLeft:30,keyLife:45};s.gems=[g];
 s.elapsed=160;P.Loot.expire();
 assert.equal(g.keyLeft,29.75,'un salto de 60 s solo descuenta 0.25 s (pausa o arena)');
 s.elapsed=160.04;P.Loot.expire();
 assert(Math.abs(g.keyLeft-29.71)<1e-9);
});

test('Brújula: objetivo más urgente, color por tramo y dibujo sin errores',()=>{
 const {P,s,p}=setup();
 p.x=0;p.y=0;
 s.enemies=[{x:100,y:0,hp:10,keyTier:'rare',keyLeft:40,keyLife:45}];
 s.gems=[{x:900,y:0,kind:'key',rarity:'legendary',keyLeft:8,keyLife:60}];
 const info=P.Loot.urgentTarget();
 assert.equal(info.target.kind,'key');assert.equal(info.extra,1);
 assert.equal(P.Loot.timeColor(.9),'#2ee86a');assert.equal(P.Loot.timeColor(.5),'#ffe02e');
 assert.equal(P.Loot.timeColor(.2),'#ff7a1a');assert.equal(P.Loot.timeColor(.1),'#ff2e88');
 const ctx=new Proxy({},{get:(t,k)=>k in t?t[k]:()=>{},set:(t,k,v)=>{t[k]=v;return true}});
 s.mode='play';
 P.Loot.drawCompass(ctx);
 assert(P.Loot.compass);
 P.Loot.drawExpire(ctx,{x:0,y:0,tier:'rare',key:true,at:1,life:.5,maxLife:1.1},.5);
 s.mode='menu';P.Loot.drawCompass(ctx);assert.equal(P.Loot.compass,null);
});
