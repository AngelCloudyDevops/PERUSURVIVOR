'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{once}=require('node:events'),{WebSocket}=require('ws'),{Simulation}=require('../backend/simulation.cjs'),{createCoopServer}=require('../backend/cooperative.cjs');
test('Cooperativo: tres mapas, 18 ataques, reanimación y mejoras compartidas',()=>{
 for(const map of ['campo','plaza','machu']){
  const sim=new Simulation(map,[0,6]);sim.tick(.04,[{x:1,y:0},{x:-1,y:0}]);assert.equal(sim.snapshot().map,map);assert.notEqual(sim.players[0].x,sim.players[1].x);
  const [a,b]=sim.players;b.hp=0;b.x=a.x;b.y=a.y;sim.P.Systems.spawn=()=>{};for(let i=0;i<101;i++)sim.tick(.04,[{},{}]);assert(b.hp>0,'Reanimar después de 4 segundos');
  sim.P.state.xp=sim.P.state.need;sim.tick(.04,[{},{}]);assert.equal(sim.P.state.level,2);assert(a.power>sim.P.Data.characters[0].power);assert(b.power>sim.P.Data.characters[6].power);
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
function mailbox(ws){const queue=[],waiters=[];ws.on('message',data=>{const msg=JSON.parse(data);const at=waiters.findIndex(w=>w.type===msg.type);if(at>=0)waiters.splice(at,1)[0].resolve(msg);else queue.push(msg)});return type=>{const at=queue.findIndex(m=>m.type===type);if(at>=0)return Promise.resolve(queue.splice(at,1)[0]);return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('No llegó '+type)),4000);waiters.push({type,resolve:m=>{clearTimeout(timer);resolve(m)}})})}}
test('Salas reales: código privado, máximo dos, autoridad, reconexión, limpieza y origen',{timeout:15000},async()=>{
 let now=0;const app=createCoopServer({autoTick:false,now:()=>now});await new Promise(r=>app.server.listen(0,'127.0.0.1',r));const port=app.server.address().port,origin='http://127.0.0.1:'+port,url='ws://127.0.0.1:'+port+'/coop',clients=[];
 async function connect(){const ws=new WebSocket(url,{origin});const receive=mailbox(ws);clients.push(ws);await once(ws,'open');return {ws,receive,send:obj=>ws.send(JSON.stringify(obj))}}
 try{
  const a=await connect();a.send({type:'create',protocol:1,map:'plaza',character:0});const joined=await a.receive('joined');assert.match(joined.code,/^[A-F0-9]{8}$/);
  const b=await connect();b.send({type:'join',protocol:1,code:joined.code,character:4});const bj=await b.receive('joined');assert.equal(bj.slot,1);
  const third=await connect();third.send({type:'join',protocol:1,code:joined.code,character:1});assert.match((await third.receive('error')).message,/completa/);
  b.send({type:'start'});assert.equal((await b.receive('error')).type,'error');a.send({type:'start'});const stateA=await a.receive('state'),stateB=await b.receive('state');assert.deepEqual(stateA.players,stateB.players);
  a.send({type:'input',x:999,y:0});assert.match((await a.receive('error')).message,/Movimiento/);const sim=app.rooms.get(joined.code).sim;const before=sim.players[0].x;a.send({type:'input',x:1,y:0,hp:9999});await new Promise(r=>setImmediate(r));app.tick();assert(sim.players[0].x<=before+9);assert.equal(sim.players[0].hp,95);
  const disconnected=once(app.rooms.get(joined.code).members[1].ws,'close');b.ws.close();await disconnected;const time=sim.P.state.elapsed;app.tick();assert.equal(sim.P.state.elapsed,time,'Pausar sala con compañero desconectado');
  const resumed=await connect();resumed.send({type:'resume',protocol:1,code:joined.code,token:bj.token});assert.equal((await resumed.receive('joined')).slot,1);app.tick();assert(sim.P.state.elapsed>time);
  const intruder=await connect();intruder.send({type:'resume',protocol:1,code:joined.code,token:'bad'});assert.equal((await intruder.receive('error')).type,'error');
  const disconnectedAgain=once(app.rooms.get(joined.code).members[1].ws,'close');resumed.ws.close();await disconnectedAgain;now=31000;app.tick();assert.equal(app.rooms.size,0);
  const bad=new WebSocket(url,{origin:'https://untrusted.example'});bad.on('error',()=>{});await new Promise(r=>bad.once('close',r));assert.notEqual(bad.readyState,1);
 }finally{for(const ws of clients)ws.terminate();await app.close()}
});
