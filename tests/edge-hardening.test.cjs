'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),http=require('node:http'),{once}=require('node:events'),{WebSocket}=require('ws');
const {clientIp}=require('../backend/client-ip.cjs'),{createAccounts}=require('../backend/accounts.cjs'),{createCoopServer}=require('../backend/cooperative.cjs');
const req=(peer,real)=>({socket:{remoteAddress:peer},headers:real?{'x-real-ip':real}:{}});
test('IP real: X-Real-IP solo se acepta desde proxies de confianza',()=>{
 assert.equal(clientIp(req('172.18.0.5','203.0.113.9')),'203.0.113.9');
 assert.equal(clientIp(req('::ffff:127.0.0.1','203.0.113.9')),'203.0.113.9');
 assert.equal(clientIp(req('8.8.8.8','203.0.113.9')),'8.8.8.8','conexión directa: no se puede falsear');
 assert.equal(clientIp(req('172.18.0.5','no-es-ip')),'172.18.0.5');
 assert.equal(clientIp(req('172.18.0.5')),'172.18.0.5');
 assert.equal(clientIp(req('172.18.0.5','203.0.113.9'),'10.0.0.0/8'),'172.18.0.5','TRUSTED_PROXIES configurable');
 assert.equal(clientIp(req('10.1.2.3','203.0.113.9'),'10.0.0.0/8'),'203.0.113.9');
});
test('Cuentas: el límite de intentos es por IP real, no por la del proxy',async t=>{
 const origin='https://x.test',app=createAccounts({filename:':memory:',origins:[origin]}),server=http.createServer((q,s)=>app.handle(q,s));await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(async()=>{await new Promise(r=>server.close(r));app.close()});
 const login=ip=>fetch('http://127.0.0.1:'+server.address().port+'/api/login',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','X-Real-IP':ip},body:JSON.stringify({username:'nadie_x',password:'una-clave-incorrecta'})}).then(r=>r.status);
 for(let i=0;i<30;i++)assert.equal(await login('203.0.113.1'),401);
 assert.equal(await login('203.0.113.1'),429);
 assert.equal(await login('203.0.113.2'),401,'otro cliente real no queda bloqueado');
});
test('Cooperativo: límite de conexiones por IP real',async t=>{
 const app=createCoopServer({autoTick:false,maxRooms:40});await new Promise(r=>app.server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+app.server.address().port,sockets=[];t.after(async()=>{for(const w of sockets)w.terminate();await app.close()});
 const open=ip=>new Promise(resolve=>{const ws=new WebSocket(origin.replace('http:','ws:')+'/coop',{origin,headers:{'X-Real-IP':ip}});sockets.push(ws);ws.on('open',()=>resolve(true));ws.on('error',()=>resolve(false))});
 for(let i=0;i<60;i++)assert(await open('203.0.113.1'));
 assert.equal(await open('203.0.113.1'),false);assert.equal(await open('203.0.113.2'),true);
});
test('Login: un cuerpo que nunca termina se corta por tiempo y no ocupa ranuras de scrypt',async t=>{
 const origin='https://x.test',app=createAccounts({filename:':memory:',origins:[origin],bodyTimeout:150}),server=http.createServer((q,s)=>app.handle(q,s));await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(async()=>{await new Promise(r=>server.close(r));app.close()});
 const port=server.address().port,stalled=[];
 for(let i=0;i<6;i++){const q=http.request({host:'127.0.0.1',port,path:'/api/login',method:'POST',headers:{Origin:origin,'Content-Type':'application/json','Content-Length':100,'X-Real-IP':'198.51.100.'+i}});q.on('error',()=>{});q.write('{"user');stalled.push(new Promise(r=>{q.on('close',r);q.on('response',x=>x.resume())}))}
 const login=await fetch('http://127.0.0.1:'+port+'/api/login',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','X-Real-IP':'198.51.100.99'},body:JSON.stringify({username:'nadie_x',password:'una-clave-incorrecta'})});
 assert.equal(login.status,401,'los cuerpos lentos no consumen ranuras');
 await Promise.race([Promise.all(stalled),new Promise((_,j)=>setTimeout(()=>j(Error('no se cortó')),3000))]);
});
async function coop(t,options={},clock){
 const app=createCoopServer({autoTick:false,...options,...(clock?{now:()=>clock.t}:{})});await new Promise(r=>app.server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+app.server.address().port,sockets=[];t.after(async()=>{for(const w of sockets)w.terminate();await app.close()});
 const connect=async(ip='203.0.113.7',headers={})=>{const ws=new WebSocket(origin.replace('http:','ws:')+'/coop',{origin,headers:{'X-Real-IP':ip,...headers}}),log=[];ws.on('message',d=>log.push(JSON.parse(d)));sockets.push(ws);await once(ws,'open');const c={ws,log,send:o=>ws.send(JSON.stringify(o)),next:async type=>{for(let i=0;i<200;i++){const m=log.find(m=>m.type===type);if(m){log.splice(log.indexOf(m),1);return m}await sleep(10)}assert.fail('sin '+type)}};return c};
 return {app,connect,origin};
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
test('Cooperativo: una inundación sostenida de mensajes cierra el socket',async t=>{
 const clock={t:1000},{connect}=await coop(t,{},clock),c=await connect(),closed=once(c.ws,'close');
 for(let second=0;second<3;second++){for(let i=0;i<60;i++)c.send({type:'ping',sent:i});await sleep(80);if(second<2)assert.equal(c.ws.readyState,1);clock.t+=1001}
 const [code]=await closed;assert.equal(code,1008);
});
test('Cooperativo: ráfagas aisladas no cierran el socket',async t=>{
 const clock={t:1000},{connect}=await coop(t,{},clock),c=await connect();
 for(const n of [60,10,60,60]){for(let i=0;i<n;i++)c.send({type:'ping',sent:i});await sleep(80);clock.t+=1001}
 c.send({type:'ping',sent:1});await sleep(50);assert.equal(c.ws.readyState,1);
});
async function start(connect,app){
 const a=await connect(),b=await connect('203.0.113.8');a.send({type:'create',protocol:2,map:'campo',character:0});const joined=await a.next('joined');b.send({type:'join',protocol:2,code:joined.code,character:6});await b.next('joined');
 const room=app.rooms.get(joined.code);for(const c of [a,b])c.send({type:'ready',ready:true,revision:room.revision});await sleep(50);a.send({type:'start'});await a.next('state');await b.next('state');return {a,b,room};
}
test('Cooperativo: activity y team se agrupan en el siguiente tick en vez de emitir snapshot inmediato',async t=>{
 const {app,connect}=await coop(t),{a,b,room}=await start(connect,app);let calls=0;room.sim.activities.action=()=>{calls++;return true};
 a.log.length=0;b.log.length=0;for(let i=0;i<5;i++)a.send({type:'activity',action:'choose',id:1,choice:0});await sleep(100);
 assert.equal(calls,5);assert.equal(a.log.filter(m=>m.type==='state').length,0,'sin snapshot fuera del tick');assert(room.dirty);
 app.tick();assert(!room.dirty);await sleep(80);assert.equal(a.log.filter(m=>m.type==='state').length,1);assert.equal(b.log.filter(m=>m.type==='state').length,1);
 room.sim.result='lose';a.send({type:'activity',action:'choose',id:1,choice:0});await sleep(60);app.tick();await sleep(60);assert(a.log.filter(m=>m.type==='state').length>=2,'sala sin simulación activa también publica al siguiente tick');
});
test('Cooperativo: tope de salas por IP y lobbies sin iniciar caducan pronto',async t=>{
 const clock={t:1000},{app,connect}=await coop(t,{maxRoomsPerIp:2,maxRooms:10},clock);
 const make=async c=>{c.send({type:'create',protocol:2,map:'campo',character:0});return Promise.race([c.next('joined').then(()=>'ok'),c.next('error').then(m=>m.message)])};
 const ip='198.51.100.5',c=[await connect(ip),await connect(ip),await connect(ip),await connect('198.51.100.6')];
 assert.equal(await make(c[0]),'ok');assert.equal(await make(c[1]),'ok');assert.match(await make(c[2]),/demasiadas salas/);assert.equal(await make(c[3]),'ok');assert.equal(app.rooms.size,3);
 clock.t+=60000;app.tick();assert.equal(app.rooms.size,3,'30 s de gracia y 5 min de lobby no han vencido');
 clock.t+=5*60000;for(const x of c)x.ws.terminate();await sleep(50);clock.t+=31000;app.tick();assert.equal(app.rooms.size,0);
 const d=await connect(ip);assert.equal(await make(d),'ok');clock.t+=5*60000+1;app.tick();assert.equal(app.rooms.size,0,'lobby sin iniciar cierra a los 5 min');
});
test('Cooperativo: con sesión válida guest:true no evita la propiedad de la cuenta',async t=>{
 const origins=[],accounts=createAccounts({filename:':memory:',origins}),server=http.createServer((q,s)=>accounts.handle(q,s));server.accounts=accounts;
 const app=createCoopServer({httpServer:server,autoTick:false});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;origins.push(origin);
 const sockets=[];t.after(async()=>{for(const w of sockets)w.terminate();await app.close();accounts.close()});
 const reg=await fetch(origin+'/api/register',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({username:'jugador_x',password:'una-clave-larga-y-unica'})}),cookie=reg.headers.get('set-cookie').split(';')[0];
 const connect=async headers=>{const ws=new WebSocket(origin.replace('http:','ws:')+'/coop',{origin,headers}),log=[];ws.on('message',d=>log.push(JSON.parse(d)));sockets.push(ws);await once(ws,'open');return {ws,send:o=>ws.send(JSON.stringify(o)),next:async()=>{for(let i=0;i<200;i++){if(log.length)return log.shift();await sleep(10)}assert.fail('sin respuesta')}}};
 const user=await connect({Cookie:cookie});user.send({type:'create',protocol:2,map:'campo',guest:true,character:7});let m=await user.next();assert.equal(m.type,'error');assert.match(m.message,/desbloqueado/);
 user.send({type:'create',protocol:2,map:'campo',guest:true,character:0});m=await user.next();assert.equal(m.type,'joined');assert.match(m.players[0].username,/Invitado/,'no revela la cuenta, pero tampoco la hace dueña de todo');
 const guest=await connect({});guest.send({type:'create',protocol:2,map:'plaza',guest:true,character:7});assert.equal((await guest.next()).type,'joined','el invitado sin sesión sigue jugando');
});
