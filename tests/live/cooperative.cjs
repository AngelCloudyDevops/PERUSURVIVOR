'use strict';
// Prueba externa al juego: únicamente envía entradas y acciones del protocolo público.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const path=require('node:path');
const sourceRoot=process.env.COOP_SOURCE_ROOT||path.resolve(__dirname,'../..');
const {WebSocket}=require('ws'),{Simulation}=require(path.join(sourceRoot,'backend/simulation.cjs'));
const base=process.env.COOP_URL||'https://perusurvivor.michitech.tech',reportPath=process.env.COOP_REPORT_PATH||path.resolve('cooperative-live-report.json');
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
async function run(map){return new Promise(resolve=>{
 const nav=new Simulation(map,[7,7],sourceRoot).P,sockets=[],evidence={map,startedAt:new Date().toISOString(),milestones:[],sameSnapshots:0},samples=new Map(),packetCounts=[0,0];
 let ended=false,started=false,eventSent=0,eventDone=map!=='campo',eventBaseline=0,arenaClock=null,returnPoints=null,worldReturned=false,rewardBase=null,rewardDone=false,readyAt=null,lastMilestone=-1,completionAt=null;
 const claims=new Set(),voteAt=[0,0],portal=nav.Encounters.definition().portal;
 function note(step,data={}){evidence.milestones.push({step,...data});console.log(map+' '+step+' '+JSON.stringify(data))}
 function send(slot,message){if(sockets[slot]?.readyState===1)sockets[slot].send(JSON.stringify(message))}
 function finish(ok,error){if(ended)return;ended=true;clearTimeout(deadline);evidence.ok=ok;if(error)evidence.error=error;for(let i=0;i<2;i++){send(i,{type:'leave'});sockets[i]?.close()}note(ok?'PASS':'FAIL',{error});resolve(evidence)}
 const deadline=setTimeout(()=>finish(false,'Tiempo agotado sin completar la partida pública'),480000);
 function navigate(p,goal,m){
  nav.state.encounter=m.encounter;nav.state.player={...p,...goal};nav.Chunks.broken=new Set(m.broken.filter(x=>typeof x==='string'));nav.Chunks.sync();for(const prop of nav.Terrain.props)if(m.broken.includes(prop.id))prop.solid=false;
  const desired=distance(p,goal)>12?nav.Terrain.direction({...p,r:14},goal):{x:0,y:0};
  const candidates=[desired,{x:0,y:0},...Array.from({length:16},(_,i)=>({x:Math.cos(i*Math.PI/8),y:Math.sin(i*Math.PI/8)}))];let best=null;
  for(const v of candidates){const next={x:p.x+v.x*p.speed*.45,y:p.y+v.y*p.speed*.45};if(!nav.Terrain.clear(p.x,p.y,next.x,next.y,14))continue;
   if(m.encounter){const b=m.encounter.scene.bounds;if(next.x<b.left+20||next.x>b.right-20||next.y<b.top+20||next.y>b.bottom-20)continue}
   let score=distance(next,goal);const other=m.players[1-p.slot];if(other.hp>0)score+=Math.max(0,distance(next,other)-650)*12;
   for(const e of m.enemies){if(e.hp<=0)continue;const near=distance(next,e);score+=Math.max(0,e.r+75-near)*24;
    if(e.mapBoss&&e.kind==='combi'&&['warning','charge'].includes(e.phase)){const dx=next.x-e.x,dy=next.y-e.y,along=dx*e.dx+dy*e.dy,cross=Math.abs(dx*e.dy-dy*e.dx);if(along>0&&along<900&&cross<105)score+=(105-cross)*24}
   }
   for(const q of m.danger)for(const t of [.15,.4,.65]){const hit=Math.hypot(p.x+v.x*p.speed*t-q.x-q.vx*t,p.y+v.y*p.speed*t-q.y-q.vy*t);score+=Math.max(0,(q.kind==='stomp'?q.radius+20:42)-hit)*18}
   if(!best||score<best.score)best={v,score};
  }
  return best?.v||{x:0,y:0};
 }
 function control(m){
  try{
   assert(m.chests&&m.portal&&m.keys,'El servidor público no tiene las actividades');
   const minute=Math.floor(m.mapTime/30);if(minute!==lastMilestone){lastMilestone=minute;note('avance',{mapTime:+m.mapTime.toFixed(2),hp:m.players.map(p=>+p.hp.toFixed(1)),level:m.level})}
   if(m.result)return finish(false,'La partida terminó antes de completar la prueba: '+m.result);
   if(m.pending){for(let i=0;i<2;i++)send(i,{type:'input',x:0,y:0});
    if(m.pending.phase==='choice'){
     if(m.pending.kind==='portal-reward'&&!rewardBase){rewardBase=m.players.map(p=>({power:p.power,maxHp:p.maxHp}));note('cofre_dorado_elecciones',{rewardId:m.pending.id,base:rewardBase})}
     for(let slot=0;slot<2;slot++){const key=m.pending.id+':'+slot;if(!m.pending.applied[slot]&&!claims.has(key)){claims.add(key);send(slot,{type:'activity',action:'choose',id:m.pending.id,choice:m.pending.kind==='portal-reward'?slot:0})}}
    }return;
   }
   if(rewardBase&&!rewardDone){assert(Math.abs(m.players[0].power-rewardBase[0].power*1.3)<.001,'Daño del portal incorrecto');assert.equal(m.players[1].maxHp,rewardBase[1].maxHp+40,'Vida de recompensa incorrecta');rewardDone=true;completionAt=m.elapsed;note('recompensas_confirmadas',{power:m.players[0].power,maxHp:m.players[1].maxHp})}
   if(rewardDone&&m.elapsed-completionAt>2){assert(m.portal.cleared);assert(m.chests.filter(c=>c.gold).length===1);assert(m.mapTime>arenaClock);if(map==='campo')assert(m.station.phase==='done');return finish(true)}
   if(map==='campo'&&!eventDone){assert(m.station,'Falta el puesto del emoliente');
    if(m.station.phase==='done'){assert(m.coins>=eventBaseline+25);eventDone=true;note('emoliente_completado',{progress:m.station.progress,coins:m.coins,hp:m.players.map(p=>p.hp)})}
    else if(m.station.phase==='idle'&&distance(m.players[1],m.station)<140&&Date.now()-eventSent>1500){eventSent=Date.now();eventBaseline=m.coins;send(1,{type:'activity',action:'event'});note('emoliente_solicitado',{mapTime:m.mapTime})}
   }
   if(m.encounter){
    if(arenaClock===null){arenaClock=m.mapTime;note('arena_compartida',{scene:m.encounter.scene.id,mapTime:arenaClock,players:m.players.map(p=>({x:p.x,y:p.y}))})}
    assert(Math.abs(m.mapTime-arenaClock)<.000001,'El reloj del mapa avanza dentro del portal');
   }else if(arenaClock!==null&&!worldReturned){worldReturned=true;assert(m.portal.cleared);assert(m.mapBossWon);assert(m.chests.some(c=>c.gold));for(let i=0;i<2;i++)assert(distance(m.players[i],returnPoints[i])<45,'Posición de regreso incorrecta');note('regreso_ambos',{players:m.players.map(p=>({x:p.x,y:p.y})),gold:m.chests.find(c=>c.gold)})}
   let goals;
   if(m.encounter){const boss=m.enemies.find(e=>e.mapBoss);if(!boss)return;goals=m.players.map((p,i)=>{const a=Math.atan2(p.y-boss.y,p.x-boss.x)+.35;return {x:Math.max(-590,Math.min(590,boss.x+Math.cos(a)*230)),y:Math.max(-285,Math.min(285,boss.y+Math.sin(a)*230))}})}
   else if(worldReturned){const gold=m.chests.find(c=>c.gold&&!c.opened);goals=m.players.map(()=>gold||portal)}
   else if(!eventDone){goals=m.players.map((p,i)=>({x:m.station.x+(i?40:-40),y:m.station.y+65}))}
   else if(m.mapTime>=176){goals=m.players.map((p,i)=>({x:portal.x+(i?22:-22),y:portal.y+35}))}
   else {goals=m.players.map((p,i)=>{const heal=m.gems.filter(g=>g.kind==='heal'&&distance(p,g)<300).sort((a,b)=>distance(p,a)-distance(p,b))[0];if(p.hp<p.maxHp*.7&&heal)return heal;const gem=m.gems.filter(g=>distance(p,g)<220).sort((a,b)=>distance(p,a)-distance(p,b))[0];if(gem)return gem;return {x:portal.x+Math.cos(m.elapsed/6+i*.5)*220,y:portal.y+Math.sin(m.elapsed/6+i*.5)*160}})}
   for(let i=0;i<2;i++){
    const p=m.players[i],other=m.players[1-i];let direction={x:0,y:0};
    if(p.hp>0){const goal=other.hp<=0?other:goals[i];if(other.hp<=0&&distance(p,other)<65)direction={x:0,y:0};else if(worldReturned&&distance(p,goal)<60)direction={x:0,y:0};else direction=navigate(p,goal,m)}
    send(i,{type:'input',...direction,ultimate:p.ultimate.charge>=100&&p.ultimate.left<=0});
   }
   if(m.portal.open&&!m.encounter&&m.players.every(p=>p.hp>0&&distance(p,portal)<95)){
    if(readyAt===null)readyAt=m.mapTime;
    if(m.mapTime-readyAt>.25){for(let i=0;i<2;i++)send(i,{type:'input',x:0,y:0});if(!returnPoints)returnPoints=m.players.map(p=>({x:p.x,y:p.y}));for(let i=0;i<2;i++)if(!m.portal.votes.includes(i)&&Date.now()-voteAt[i]>1000){voteAt[i]=Date.now();send(i,{type:'activity',action:'portal'});note('portal_confirmacion',{slot:i,mapTime:m.mapTime})}}
   }else if(!m.encounter)readyAt=null;
  }catch(error){finish(false,error.message)}
 }
 function connect(slot,code){const ws=new WebSocket(base.replace('https:','wss:')+'/coop',{origin:base});sockets[slot]=ws;
  ws.on('open',()=>send(slot,{type:slot?'join':'create',protocol:1,character:7,map,code}));ws.on('error',e=>finish(false,e.message));
  ws.on('close',()=>{if(!ended)finish(false,'Conexión cerrada durante la prueba')});
  ws.on('message',raw=>{if(ended)return;const m=JSON.parse(raw);
   if(m.type==='joined'&&slot===0){evidence.room=m.code;note('sala',{code:m.code});connect(1,m.code)}
   if(m.type==='room'&&slot===0&&m.players.length===2&&!started){started=true;send(0,{type:'start'})}
   if(m.type==='closed')return finish(false,m.message);
   if(m.type==='error'){note('respuesta_rechazada',{slot,message:m.message});return}
   if(m.type==='state'){
    const key=packetCounts[slot]++;
    const digest=crypto.createHash('sha256').update(JSON.stringify(m)).digest('hex'),seen=samples.get(key);if(seen&&seen.slot!==slot){if(seen.digest!==digest)return finish(false,'Los clientes recibieron estados diferentes');evidence.sameSnapshots++}else samples.set(key,{slot,digest});if(samples.size>300)samples.delete(samples.keys().next().value);
    if(slot===0)control(m);
   }
  });
 }
 connect(0);
})}
(async()=>{const version=await fetch(base+'/__release.json?t='+Date.now()).then(r=>r.json());console.log('VERSION '+version.git_sha);if(process.env.COOP_EXPECTED_RELEASE)assert.equal(version.git_sha,process.env.COOP_EXPECTED_RELEASE,'La versión cambió antes de empezar');const maps=process.argv.slice(2);const cases=await Promise.all((maps.length?maps:['campo','plaza','machu']).map(run));fs.writeFileSync(reportPath,JSON.stringify({version:version.git_sha,createdAt:new Date().toISOString(),cases},null,2));console.log('REPORT '+reportPath);process.exitCode=cases.every(c=>c.ok)?0:1})().catch(e=>{console.error(e);process.exitCode=1});
