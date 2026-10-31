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
