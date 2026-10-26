'use strict';
const http=require('node:http'),crypto=require('node:crypto'),{WebSocketServer}=require('ws'),{Simulation}=require('./simulation.cjs');
const PROTOCOL=2;
function createCoopServer({root,maxRooms=6,autoTick=true,allowedOrigins=[],now=()=>Date.now(),httpServer}={}){
 const rooms=new Map(),attempts=new Map(),catalog=new Simulation('campo',[0],root).P.Data.characters,characterCount=catalog.length;
 const sharedAccounts=httpServer?.accounts;const accounts=sharedAccounts||(process.env.ACCOUNTS_DB?require('./accounts.cjs').createAccounts({filename:process.env.ACCOUNTS_DB,origins:allowedOrigins,secure:process.env.ACCOUNTS_INSECURE!=='true',now}):null);
 const server=httpServer||http.createServer(async(req,res)=>{if(accounts&&await accounts.handle(req,res))return;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.writeHead(req.url==='/coop/health'?200:404);res.end(JSON.stringify(req.url==='/coop/health'?{ok:true,protocol:PROTOCOL,rooms:rooms.size}:{error:'Not found'}))});
 const wss=new WebSocketServer({noServer:true,maxPayload:2048,perMessageDeflate:false});
 function send(ws,data){if(ws?.readyState===1&&ws.bufferedAmount<512*1024)ws.send(typeof data==='string'?data:JSON.stringify(data))}
 function lobby(room){return {type:'room',code:room.code,map:room.map,revision:room.revision,round:room.round||0,finished:!!room.sim?.result,started:!!room.sim,players:room.members.map((m,i)=>({slot:i,character:m.character,username:m.username||'Invitado '+(i+1),ready:!!m.ready,returning:!!m.returning,connected:!!m.ws,reconnectMs:m.ws?0:Math.max(0,30000-(now()-m.lastSeen))}))}}
 function reset(room){room.revision=(room.revision||0)+1;for(const m of room.members)m.ready=false}
 const userRoom=id=>[...rooms.values()].find(r=>r.members.some(m=>m.userId===id&&m.ws));
 accounts?.friends.setCoop({status:id=>{const r=userRoom(id);return r?(r.sim?'Jugando':'En sala'):null},inviteCode:id=>{const r=userRoom(id);return r&&!r.sim&&r.members.length===1&&r.members[0].userId===id?r.code:null},open:code=>{const r=rooms.get(code);return !!r&&!r.sim&&r.members.length<2&&!!r.members[0]?.ws}});
 function broadcast(room,data){const encoded=JSON.stringify(data);for(const m of room.members)send(m.ws,encoded)}
 function detach(ws){const room=ws.room,m=room?.members.find(m=>m.ws===ws);if(m){m.ws=null;m.lastSeen=now();m.input={x:0,y:0};room.sim?.team.votes.clear();if(!room.sim)reset(room);broadcast(room,lobby(room))}ws.room=null}
 function tick(){const time=now();for(const [code,room] of rooms){if(room.members.some(m=>!m.ws&&time-m.lastSeen>30000)||time-room.created>45*60*1000){broadcast(room,{type:'closed',message:'La sala terminó. Crea otra para volver a jugar.'});for(const m of room.members){if(m.ws){m.ws.room=null;m.ws.close(1000)}}rooms.delete(code);continue}
   if(room.sim&&room.members.every(m=>m.ws)&&!room.sim.result){const began=performance.now();room.sim.tick(.04,room.members.map(m=>m.input));room.tickMs=performance.now()-began;room.frame++;broadcast(room,{type:'state',...room.sim.snapshot()})}
  }
 }
 server.on('upgrade',(req,socket,head)=>{
  let parsed;try{parsed=new URL(req.url,'http://localhost')}catch{return socket.destroy()}
  const origin=req.headers.origin,expected=allowedOrigins.length?allowedOrigins:[`http://${req.headers.host}`,`https://${req.headers.host}`];
  if(parsed.pathname!=='/coop'||!expected.includes(origin)||wss.clients.size>=maxRooms*2+8)return socket.destroy();
  const ip=req.socket.remoteAddress||'',old=attempts.get(ip)||{time:now(),count:0};if(now()-old.time>60000){old.time=now();old.count=0}old.count++;attempts.set(ip,old);if(old.count>60)return socket.destroy();
  wss.handleUpgrade(req,socket,head,ws=>wss.emit('connection',ws,req));
 });
 wss.on('connection',(ws,req)=>{
  ws.user=accounts?.session(req)||null;
  ws.isAlive=true;ws.on('pong',()=>ws.isAlive=true);let count=0,windowAt=now();
  const authentication=setTimeout(()=>{if(!ws.room)ws.close(1008,'Join a room first')},5000);authentication.unref();ws.on('close',()=>clearTimeout(authentication));
  ws.on('message',raw=>{try{
   if(now()-windowAt>1000){count=0;windowAt=now()}if(++count>40)throw Error('Demasiados mensajes');
   if(ws.user&&accounts?.session(req)?.id!==ws.user.id){send(ws,{type:'closed',message:'La sesión de tu cuenta terminó. Vuelve a iniciar sesión.'});ws.close(1008);return}
   const msg=JSON.parse(raw);if(!msg||typeof msg!=='object')throw Error('Mensaje inválido');
   if(msg.type==='ping'){if(ws.room&&Number.isFinite(msg.sent))send(ws,{type:'pong',sent:msg.sent,tickMs:ws.room.tickMs||0,snapshotMs:40});return}
   if(msg.type==='input'){const m=ws.room?.members.find(m=>m.ws===ws);if(!m||!ws.room.sim)return;const x=msg.x,y=msg.y,weapon=Number(msg.weapon)||0;if(!Number.isFinite(x)||!Number.isFinite(y)||Math.abs(x)>1||Math.abs(y)>1)throw Error('Movimiento inválido');if(!Number.isInteger(weapon)||weapon<0||weapon>3)throw Error('Arma inválida');m.input={x,y,weapon,punch:msg.punch===true,ga:msg.ga===true,domainAim:Number.isFinite(msg.domainAim)?Math.max(-1,Math.min(1,msg.domainAim)):0,ultimate:msg.ultimate===true,view:ws.room.sim.P.Combat.sanitizeView(msg.view)||m.input?.view||null};return}
   if(msg.type==='team'){const r=ws.room,slot=r?.members.findIndex(m=>m.ws===ws);if(!r?.sim||slot<0||!r.members.every(m=>m.ws)||!r.sim.team.request(slot))throw Error('Combo no disponible: ambos vivos, cerca y con la barra llena');broadcast(r,{type:'state',...r.sim.snapshot()});return}
   if(msg.type==='activity'){const room=ws.room,slot=room?.members.findIndex(m=>m.ws===ws);if(!room?.sim||slot<0)return;if(!room.members.every(m=>m.ws))throw Error('Espera a que tu compañero vuelva a conectarse');if(!room.sim.activities.action(slot,msg.action,msg.id,msg.choice))throw Error('La acción ya no está disponible: acércate o espera a tu compañero');broadcast(room,{type:'state',...room.sim.snapshot()});return}
   if(msg.type==='leave'){const r=ws.room,slot=r?.members.findIndex(m=>m.ws===ws);if(r){if(r.sim||slot===0){broadcast(r,{type:'closed',message:'El grupo salió de la sala.'});rooms.delete(r.code);for(const m of r.members){if(m.ws){m.ws.room=null;m.ws.close(1000)}}}else if(slot>=0){r.members.splice(slot,1);ws.room=null;reset(r);broadcast(r,lobby(r))}}ws.close(1000);return}
   if(msg.type==='ready'||msg.type==='configure'){const r=ws.room,m=r?.members.find(m=>m.ws===ws);if(!r||!m||r.sim)throw Error('La sala ya no permite cambios');if(msg.type==='ready'){if(typeof msg.ready!=='boolean'||msg.revision!==r.revision)throw Error('La sala cambió. Revisa los personajes y confirma otra vez.');m.ready=msg.ready}else{if(msg.map!==undefined){if(r.members[0]!==m||!['campo','plaza','machu'].includes(msg.map))throw Error('Solo el anfitrión elige un mapa válido');r.map=msg.map}if(msg.character!==undefined){if(!Number.isInteger(msg.character)||!catalog[msg.character]||!accounts?.owns(ws.user,catalog[msg.character].id)&&ws.user)throw Error('Ese causa no está desbloqueado');m.character=msg.character}reset(r)}broadcast(r,lobby(r));return}
   if(msg.type==='return'){const r=ws.room,m=r?.members.find(m=>m.ws===ws);if(!r?.sim?.result||!m||msg.round!==r.round)throw Error('La partida todavía no terminó o el resultado ya cambió');if(!r.members.every(p=>p.ws))throw Error('Espera a que tu compañero vuelva a conectarse');m.returning=true;if(r.members.length===2&&r.members.every(p=>p.returning&&p.ws)){r.sim=null;r.frame=0;for(const p of r.members){p.returning=false;p.input={x:0,y:0}}reset(r)}broadcast(r,lobby(r));return}
   if(msg.type==='start'){const r=ws.room;if(r&&r.members.some(m=>!m.ready))throw Error('Ambos jugadores deben pulsar Estoy listo');if(!r||r.members[0].ws!==ws||r.members.length!==2||r.members.some(m=>!m.ws)||r.sim)throw Error('Se necesitan dos jugadores conectados y que el anfitrión inicie');r.sim=new Simulation(r.map,r.members.map(m=>m.character),root);r.frame=0;r.round=(r.round||0)+1;for(const m of r.members){m.returning=false;m.input={x:0,y:0}}broadcast(r,lobby(r));broadcast(r,{type:'state',...r.sim.snapshot()});return}
   if(ws.room)throw Error('Ya estás en una sala');
   if(msg.protocol!==PROTOCOL)throw Error('Actualiza la página para jugar con esta versión');
   if(msg.guest===true&&!ws.room)ws.user=null;
   if(msg.type==='resume'){const r=rooms.get(msg.code),m=r?.members.find(m=>m.token===msg.token);if(!m||m.ws||(m.userId&&m.userId!==ws.user?.id)||now()-m.lastSeen>30000)throw Error('No se pudo recuperar la sala');m.ws=ws;ws.room=r;send(ws,{type:'joined',slot:r.members.indexOf(m),token:m.token,...lobby(r),type:'joined'});broadcast(r,lobby(r));if(r.sim)send(ws,{type:'state',...r.sim.snapshot()});return}
   if(ws.user&&[...rooms.values()].some(r=>r.members.some(m=>m.userId===ws.user.id)))throw Error('Tu cuenta ya tiene una sala. Sal primero o recupera esa conexión.');
   if(!Number.isInteger(msg.character)||msg.character<0||msg.character>=characterCount)throw Error('Personaje inválido');
   if(ws.user&&!accounts.owns(ws.user,catalog[msg.character].id))throw Error('Ese causa no está desbloqueado');
   let r;
   if(msg.type==='create'){if(!['campo','plaza','machu'].includes(msg.map))throw Error('Mapa inválido');if(rooms.size>=maxRooms)throw Error('Servidor ocupado. Inténtalo en unos minutos');let code;do{code=crypto.randomBytes(4).toString('hex').toUpperCase()}while(rooms.has(code));r={code,map:msg.map,members:[],created:now(),revision:0};rooms.set(code,r)}
   else if(msg.type==='join'){r=rooms.get(String(msg.code).toUpperCase());if(!r)throw Error('Código de sala incorrecto');if(r.sim||r.members.length>=2)throw Error('La sala ya está completa o comenzó')}
   else throw Error('Acción desconocida');
   if(msg.inviteId&&!accounts?.friends.consume(ws.user,msg.inviteId,r.code))throw Error('La invitación venció o ya no está disponible');
   const m={userId:ws.user?.id||null,username:ws.user?.username||null,ready:false,character:msg.character,token:crypto.randomBytes(24).toString('hex'),ws,lastSeen:now(),input:{x:0,y:0}};r.members.push(m);reset(r);ws.room=r;send(ws,{...lobby(r),type:'joined',slot:r.members.length-1,token:m.token});broadcast(r,lobby(r));
  }catch(error){send(ws,{type:'error',message:error.message})}});
  ws.on('error',()=>{});ws.on('close',()=>detach(ws));
 });
 const timer=autoTick?setInterval(()=>{try{tick()}catch(error){console.error('Coop tick failed:',error);for(const r of rooms.values())broadcast(r,{type:'closed',message:'La partida se interrumpió. Vuelve al menú.'});for(const ws of wss.clients)ws.close(1011);rooms.clear()}},40):null;
 const heartbeat=setInterval(()=>{for(const ws of wss.clients){if(!ws.isAlive){ws.terminate();continue}ws.isAlive=false;ws.ping()}for(const [ip,a] of attempts)if(now()-a.time>60000)attempts.delete(ip)},15000);heartbeat.unref();
 server.on('close',()=>{clearInterval(timer);clearInterval(heartbeat);for(const ws of wss.clients)ws.terminate();wss.close();if(!sharedAccounts)accounts?.close()});
 return {server,rooms,tick,close(){accounts?.closeStreams();for(const ws of wss.clients)ws.terminate();return new Promise(resolve=>server.close(resolve))}};
}
if(require.main===module){const app=createCoopServer({root:require('node:path').resolve(__dirname,'..'),maxRooms:Number(process.env.MAX_ROOMS)||20,allowedOrigins:(process.env.COOP_ORIGINS||'https://perusurvivor.michitech.tech,https://srv2060131.hstgr.cloud').split(',')});app.server.listen(Number(process.env.PORT)||4180,'0.0.0.0',()=>console.log('Coop ready'));process.on('SIGTERM',()=>{app.close().then(()=>process.exit());setTimeout(()=>process.exit(0),3000).unref()})}
module.exports={createCoopServer,PROTOCOL};
