'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{once}=require('node:events'),{WebSocket}=require('ws'),{Simulation}=require('../backend/simulation.cjs'),{createCoopServer}=require('../backend/cooperative.cjs');
test('Cooperativo: tres mapas, 18 ataques, reanimación y mejoras compartidas',()=>{
 for(const map of ['campo','plaza','machu']){
  const sim=new Simulation(map,[0,6]);sim.tick(.04,[{x:1,y:0},{x:-1,y:0}]);assert.equal(sim.snapshot().map,map);assert.notEqual(sim.players[0].x,sim.players[1].x);
  const [a,b]=sim.players;b.hp=0;b.x=a.x;b.y=a.y;sim.P.Systems.spawn=()=>{};for(let i=0;i<101;i++)sim.tick(.04,[{},{}]);assert(b.hp>0,'Reanimar después de 4 segundos');
  sim.P.state.xp=sim.P.state.need;sim.tick(.04,[{},{}]);assert.equal(sim.P.state.level,2);const levelChoice=sim.activities.pending;assert.equal(levelChoice.kind,'level');sim.activities.choose(0,levelChoice.id,0);sim.activities.choose(1,levelChoice.id,0);assert(a.power>sim.P.Data.characters[0].power);assert(b.power>sim.P.Data.characters[6].power);
  a.hp=0;b.hp=0;sim.tick(.04,[{},{}]);assert.equal(sim.result,'lose');
 }
 for(let i=0;i<18;i++){
  const sim=new Simulation('campo',[i,(i+1)%18]),P=sim.P,p=sim.players[0];P.Systems.spawn=()=>{};const point=p.attack==='orbit'?P.Combat.orbitPoints(p,0)[0]:{x:p.x+90,y:p.y};const e={x:point.x,y:point.y,hp:2000,max:2000,r:13,speed:0,hit:0};P.state.enemies=[e];for(let t=0;t<10;t++)sim.tick(.04,[{},{}]);assert(e.hp<2000,'Ataque cooperativo '+p.name);
 }
});
test('Release compilada: simulación, ulti serializable y victoria del equipo',()=>{
 const sim=new Simulation('campo',[7,0],require('node:path').resolve(__dirname,'../dist'));
 sim.players[0].ultimate.charge=100;sim.tick(.04,[{x:1,y:0,ultimate:true},{}]);assert.doesNotThrow(()=>JSON.stringify(sim.snapshot()));
 sim.P.state.mapTime=300;sim.tick(.04,[{},{}]);const boss=sim.P.state.enemies.find(e=>e.boss);assert(boss);sim.P.Entities.hurt(boss,999999);assert.equal(sim.snapshot().result,'win');
});
test('Actividades cooperativas: portales de tres mapas, retorno de ambos y premios únicos',()=>{
 for(const map of ['campo','plaza','machu']){
  const sim=new Simulation(map,[0,6]),P=sim.P,s=P.state,a=sim.activities;const originalSpawn=P.Systems.spawn;P.Systems.spawn=()=>{};
  assert.equal(a.action(0,'portal'),false,'No entrar antes de desbloquear o estando lejos');
  s.mapTime=180;P.Encounters.tick();const pos=P.Encounters.definition().portal;
  for(const p of sim.players)Object.assign(p,{x:pos.x+p.slot*20,y:pos.y});
  const positions=sim.players.map(p=>({x:p.x,y:p.y})),worldEnemy={x:20,y:30,hp:50,max:50,r:13,speed:0};s.enemies=[worldEnemy];
  assert(a.action(0,'portal'));assert(!s.encounter,'No arrastrar al otro jugador sin confirmar');assert.equal(a.votes.size,1);
  sim.players[0].x+=300;sim.tick(.04,[{},{}]);assert.equal(a.votes.size,0,'Cancelar confirmación al alejarse');sim.players[0].x=positions[0].x;
  assert(a.action(0,'portal'));assert(a.action(1,'portal'));assert(s.encounter);const clock=s.mapTime;
  sim.tick(.04,[{},{}]);assert.equal(s.mapTime,clock,'El reloj del mapa no avanza en arena');assert.equal(s.enemies.filter(e=>e.mapBoss).length,1);
  const boss=s.enemies[0];boss.attackT=0;sim.tick(.04,[{},{}]);assert.equal(boss.phase,'warning');assert.doesNotThrow(()=>JSON.stringify(sim.snapshot()));
  P.Entities.hurt(boss,999999);sim.tick(.04,[{},{}]);assert(!s.encounter);assert(s.portal.cleared);assert.equal(s.enemies[0],worldEnemy);
  for(let i=0;i<2;i++){assert.equal(sim.players[i].x,positions[i].x);assert.equal(sim.players[i].y,positions[i].y)}
  const gold=P.Loot.chests.find(c=>c.gold);assert(gold);assert(a.open(gold));for(let i=0;i<17;i++)sim.tick(.04,[{},{}]);const id=a.pending.id,power=sim.players[0].power,max=sim.players[1].maxHp;
  assert(a.action(0,'choose',id,0));assert.equal(sim.players[0].power,power*1.3);assert(!a.action(0,'choose',id,0),'No duplicar recompensa');assert(a.pending);
  assert(a.action(1,'choose',id,1));assert.equal(sim.players[1].maxHp,max+40);assert(!a.pending);assert(!a.open(gold));
  P.Systems.spawn=originalSpawn;s.mapTime=300;sim.tick(.04,[{},{}]);assert(s.bossSpawned,'Conservar jefe final después del portal');
 }
});
test('Cofres cooperativos: llave compartida, apertura única, elecciones separadas y pausa segura',()=>{
 const sim=new Simulation('plaza',[0,6]),P=sim.P,s=P.state,a=sim.activities;P.Systems.spawn=()=>{};
 const chest={id:'test:rare',x:250,y:250,progress:0,opened:false,gold:false,rarity:'rare'};P.Loot.chests=[chest];
 assert(!a.open(chest));assert.equal(s.keys.rare,0);s.keys.rare=1;assert(a.open(chest));assert.equal(s.keys.rare,0);assert(!a.open(chest));
 const elapsed=s.elapsed,x=sim.players[0].x,id=a.pending.id;assert(!a.action(0,'choose',id,0),'No elegir antes de abrir');
 for(let i=0;i<17;i++)sim.tick(.04,[{x:1,y:0},{}]);assert.equal(s.elapsed,elapsed);assert.equal(sim.players[0].x,x);
 const item=a.pending.item;sim.players[0].hp=40;assert(!a.action(1,'choose',id+1,0));assert(!a.action(1,'choose',id,99));assert(a.action(0,'choose',id,0));
 assert(P.Loot.items[item].consumable?sim.players[0].hp>40:sim.players[0].equipment===item);
 assert(a.action(1,'choose',id,1));assert(!a.pending);assert.equal(sim.players[1].equipment,undefined);assert(!a.action(0,'choose',id,0));
 sim.tick(.04,[{},{}]);assert(s.elapsed>elapsed);assert.doesNotThrow(()=>JSON.stringify(sim.snapshot()));
});
test('Evento cooperativo: cualquiera inicia, defensa alternada, curación de ambos y premio irrepetible',()=>{
 const sim=new Simulation('campo',[0,6]),P=sim.P,s=P.state,a=sim.activities;P.Systems.spawn=()=>{};P.Loot.active=()=>[];P.Loot.chests=[];a.syncChests=()=>{};P.Loot.spawnKeepers=()=>{};P.Combat.tick=()=>{}; /* Aislar la defensa: combate/cofres aleatorios pueden abrir elecciones y pausar el reloj. */const station=P.Exploration.station;assert(station);
 assert(!a.action(0,'event'));for(const p of sim.players){p.x=station.x;p.y=station.y;p.hp=30;p.inv=99999}
 assert(a.action(1,'event'));assert.equal(station.phase,'active');assert(!a.action(0,'event'));
 for(let i=0;i<501;i++){s.enemies=[];s.danger=[];if(i===230){sim.players[0].x=station.x+250;sim.players[1].x=station.x}sim.tick(.04,[{},{}])}
 assert.equal(station.phase,'done');assert.equal(s.coins,25);assert(sim.players.every(p=>p.hp>30));assert(!a.action(1,'event'));
 for(let i=0;i<10;i++)sim.tick(.04,[{},{}]);assert.equal(s.coins,25);assert.equal(sim.snapshot().station.phase,'done');
});
function mailbox(ws){const queue=[],waiters=[];ws.on('message',data=>{const msg=JSON.parse(data);const at=waiters.findIndex(w=>w.type===msg.type);if(at>=0)waiters.splice(at,1)[0].resolve(msg);else queue.push(msg)});return type=>{const at=queue.findIndex(m=>m.type===type);if(at>=0)return Promise.resolve(queue.splice(at,1)[0]);return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('No llegó '+type)),4000);waiters.push({type,resolve:m=>{clearTimeout(timer);resolve(m)}})})}}
test('Salas reales: código privado, máximo dos, autoridad, reconexión, limpieza y origen',{timeout:15000},async()=>{
 let now=0;const app=createCoopServer({autoTick:false,now:()=>now});await new Promise(r=>app.server.listen(0,'127.0.0.1',r));const port=app.server.address().port,origin='http://127.0.0.1:'+port,url='ws://127.0.0.1:'+port+'/coop',clients=[];
 async function connect(){const ws=new WebSocket(url,{origin});const receive=mailbox(ws);clients.push(ws);await once(ws,'open');return {ws,receive,send:obj=>ws.send(JSON.stringify(obj))}}
 try{
  const a=await connect();a.send({type:'create',protocol:1,map:'plaza',character:0});const joined=await a.receive('joined');assert.match(joined.code,/^[A-F0-9]{8}$/);
  const b=await connect();b.send({type:'join',protocol:1,code:joined.code,character:4});const bj=await b.receive('joined');assert.equal(bj.slot,1);
  const third=await connect();third.send({type:'join',protocol:1,code:joined.code,character:1});assert.match((await third.receive('error')).message,/completa/);
  b.send({type:'start'});assert.equal((await b.receive('error')).type,'error');a.send({type:'start'});const stateA=await a.receive('state'),stateB=await b.receive('state');assert.deepEqual(stateA.players,stateB.players);
  const sim=app.rooms.get(joined.code).sim;
  async function stateUntil(client,predicate){for(let i=0;i<40;i++){const m=await client.receive('state');if(predicate(m))return m}assert.fail('No llegó el estado de actividad esperado')}
  const chest={id:'wire:chest',x:250,y:250,progress:0,opened:false,gold:false,rarity:'common'};sim.P.Loot.chests.push(chest);sim.activities.open(chest);for(let i=0;i<18;i++)app.tick();
  const rewardA=await stateUntil(a,m=>m.pending?.phase==='choice'),rewardB=await stateUntil(b,m=>m.pending?.phase==='choice');assert.deepEqual(rewardA.pending,rewardB.pending);
  a.send({type:'activity',action:'choose',id:rewardA.pending.id+1,choice:0});assert.equal((await a.receive('error')).type,'error');
  a.send({type:'activity',action:'choose',id:rewardA.pending.id,choice:0});await stateUntil(a,m=>m.pending?.applied[0]);assert(sim.activities.pending);
  b.send({type:'activity',action:'choose',id:rewardB.pending.id,choice:1});await stateUntil(b,m=>m.pending===null);assert(!sim.activities.pending);
  a.send({type:'activity',action:'choose',id:rewardA.pending.id,choice:0});assert.equal((await a.receive('error')).type,'error');
  a.send({type:'input',x:999,y:0});assert.match((await a.receive('error')).message,/Movimiento/);const before=sim.players[0].x;a.send({type:'input',x:1,y:0,hp:9999});await new Promise(r=>setImmediate(r));app.tick();assert(sim.players[0].x<=before+9);assert.equal(sim.players[0].hp,95);
  const disconnected=once(app.rooms.get(joined.code).members[1].ws,'close');b.ws.close();await disconnected;const time=sim.P.state.elapsed;app.tick();assert.equal(sim.P.state.elapsed,time,'Pausar sala con compañero desconectado');
  const resumed=await connect();resumed.send({type:'resume',protocol:1,code:joined.code,token:bj.token});assert.equal((await resumed.receive('joined')).slot,1);app.tick();assert(sim.P.state.elapsed>time);
  const intruder=await connect();intruder.send({type:'resume',protocol:1,code:joined.code,token:'bad'});assert.equal((await intruder.receive('error')).type,'error');
  const disconnectedAgain=once(app.rooms.get(joined.code).members[1].ws,'close');resumed.ws.close();await disconnectedAgain;now=31000;app.tick();assert.equal(app.rooms.size,0);
  const bad=new WebSocket(url,{origin:'https://untrusted.example'});bad.on('error',()=>{});await new Promise(r=>bad.once('close',r));assert.notEqual(bad.readyState,1);
 }finally{for(const ws of clients)ws.terminate();await app.close()}
});

test('Minijefes cooperativos: calendario del servidor, aviso compartido, ataques y botín únicos',()=>{
 for(const map of ['campo','plaza','machu']){
  const sim=new Simulation(map,[0,6]),P=sim.P,s=P.state,M=P.Minibosses;P.Terrain.hit=()=>null;P.Loot.safe=()=>true;s.mapTime=s.miniNext;sim.tick(.04,[{},{}]);assert(sim.snapshot().miniWarning);assert.equal(sim.snapshot().miniWarning.map,map);for(let i=0;i<52;i++)sim.tick(.04,[{},{}]);const e=s.enemies.find(e=>e.miniboss);assert(e&&e.miniMap===map);assert.equal(sim.snapshot().enemies.filter(e=>e.miniboss).length,1);s.enemies=[e];s.gems=[];s.danger=[];s.fields=[];P.Terrain.resolve=()=>{};/* Aislar contacto del botín y proyectiles de la preparación. */for(const p of sim.players){p.x=e.x;p.y=e.y;p.inv=0;p.fire=100}const hp=sim.players.map(p=>p.hp);e.phase='mini-recover';e.recovery=1;sim.tick(.04,[{},{}]);assert.deepEqual(sim.players.map(p=>p.hp),hp.map(n=>n-12));assert.doesNotThrow(()=>JSON.stringify(sim.snapshot()));M.warn(e,M.catalog[map].attacks[1]);M.move(e,1);if(e.phase==='mini-charge')M.move(e,1);const kills=s.kills;P.Entities.hurt(e,99999);P.Entities.hurt(e,99999);assert.equal(s.kills,kills+1);assert.equal(s.effects.filter(q=>q.kind==='miniboss-death').length,1);assert.equal(s.gems.filter(q=>q.kind==='coin'&&q.value===20).length,1);assert(!s.danger.some(q=>q.miniId===e.miniId));s.mapTime=300;s.miniWarning=null;sim.tick(.04,[{},{}]);assert(!s.miniWarning);assert(s.bossSpawned);
 }
});
