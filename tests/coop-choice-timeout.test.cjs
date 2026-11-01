'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{once}=require('node:events'),{WebSocket}=require('ws'),{Simulation}=require('../backend/simulation.cjs'),{createCoopServer}=require('../backend/cooperative.cjs');
function mailbox(ws){const queue=[],waiters=[];ws.on('message',data=>{const msg=JSON.parse(data);const at=waiters.findIndex(w=>w.type===msg.type);if(at>=0)waiters.splice(at,1)[0].resolve(msg);else queue.push(msg)});return type=>{const at=queue.findIndex(m=>m.type===type);if(at>=0)return Promise.resolve(queue.splice(at,1)[0]);return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('No llegó '+type)),4000);waiters.push({type,resolve:m=>{clearTimeout(timer);resolve(m)}})})}}
const idle=[{},{}];
function levelUp(timeout=2){
 const sim=new Simulation('campo',[0,6]),P=sim.P,s=P.state,a=sim.activities;P.Systems.spawn=()=>{};a.choiceTimeout=timeout;
 s.xp=s.need;sim.tick(.04,idle);assert.equal(a.pending?.kind,'level');return sim;
}
const run=(sim,seconds)=>{for(let i=0;i<Math.round(seconds/.04);i++)sim.tick(.04,idle)};
test('Elección de nivel: si el compañero no responde, el servidor elige y la partida sigue',()=>{
 const sim=levelUp(2),a=sim.activities,id=a.pending.id,s=sim.P.state;
 assert(a.action(0,'choose',id,1));assert(a.pending,'Falta el compañero');
 run(sim,1.5);assert(a.pending&&a.pending.id===id,'Aún dentro del plazo');
 run(sim,.7);assert.equal(a.pending,null,'El plazo vencido resuelve la elección');
 sim.tick(.04,idle);assert.equal(s.mode,'play');assert.equal(s.level,2);
 const elapsed=s.elapsed;sim.tick(.04,idle);assert(s.elapsed>elapsed,'La simulación se reanuda');
});
test('Elección de nivel: si nadie responde, eligen por los dos',()=>{
 const sim=levelUp(1),a=sim.activities;run(sim,1.2);assert.equal(a.pending,null);assert.equal(sim.P.state.mode,'play');
});
test('Elección de nivel: si ambos eligen a tiempo no hay elección automática',()=>{
 const sim=levelUp(2),a=sim.activities,id=a.pending.id,notices=[],notice=a.notice.bind(a);a.notice=m=>{notices.push(m);notice(m)};
 run(sim,.8);assert(a.action(0,'choose',id,0));assert(a.action(1,'choose',id,0));assert.equal(a.pending,null);
 run(sim,3);assert(!notices.some(m=>/solo/.test(m)),'Sin elección automática');assert.equal(sim.P.state.level,2);
});
test('Elección de nivel: el plazo no corre mientras un miembro está desconectado (sala real)',{timeout:15000},async()=>{
 let clock=1000;const app=createCoopServer({autoTick:false,now:()=>clock});await new Promise(r=>app.server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+app.server.address().port,clients=[];
 async function connect(){const ws=new WebSocket(origin.replace('http:','ws:')+'/coop',{origin}),receive=mailbox(ws);clients.push(ws);await once(ws,'open');return {ws,receive,send:m=>ws.send(JSON.stringify(m))}}
 const settle=()=>new Promise(r=>setTimeout(r,30));
 try{
  const a=await connect(),b=await connect();a.send({type:'create',protocol:3,map:'campo',character:0});const joined=await a.receive('joined');b.send({type:'join',protocol:3,code:joined.code,character:6});const bj=await b.receive('joined'),r=app.rooms.get(joined.code);
  a.send({type:'ready',ready:true,revision:r.revision});b.send({type:'ready',ready:true,revision:r.revision});for(let i=0;i<25&&!r.members.every(m=>m.ready);i++)await settle();
  a.send({type:'start'});await a.receive('state');r.sim.P.Systems.spawn=()=>{};r.sim.activities.choiceTimeout=1;r.sim.P.state.xp=r.sim.P.state.need;app.tick();
  const id=r.sim.activities.pending.id;assert.equal(r.sim.activities.pending.kind,'level');
  a.send({type:'activity',action:'choose',id,choice:0});await settle();app.tick();assert(r.sim.activities.pending.applied[0]);
  const closed=once(r.members[1].ws,'close');b.ws.close();await closed;
  const left=r.sim.activities.pending.left;for(let i=0;i<100;i++)app.tick();clock+=10000;for(let i=0;i<100;i++)app.tick();
  assert(r.sim.activities.pending,'Sin el compañero conectado no se elige solo');assert.equal(r.sim.activities.pending.left,left);
  const resumed=await connect();resumed.send({type:'resume',protocol:3,code:joined.code,token:bj.token});await resumed.receive('joined');
  for(let i=0;i<20;i++)app.tick();assert(r.sim.activities.pending,'Tras reconectar aún conserva su plazo');
  for(let i=0;i<10;i++)app.tick();assert.equal(r.sim.activities.pending,null,'Consumido el plazo restante se elige solo');assert.equal(r.sim.P.state.level,2);
 }finally{for(const ws of clients)ws.terminate();await app.close()}
});
test('Snapshot: el plazo restante viaja en pending.left',()=>{
 const sim=levelUp(15),snap=sim.snapshot();assert.equal(snap.pending.kind,'level');assert.equal(snap.pending.left,15);
 run(sim,1);const after=sim.snapshot().pending.left;assert(after<14.1&&after>13.8,'left='+after);assert.doesNotThrow(()=>JSON.stringify(sim.snapshot()));
});
