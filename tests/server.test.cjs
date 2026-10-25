const {test}=require('node:test'),assert=require('node:assert/strict'),http=require('node:http');
const {createServer}=require('../server.cjs');
test('El servidor entrega el juego y los sprites y rechaza rutas inexistentes',async()=>{
 const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const port=server.address().port;
 function get(route){return new Promise((resolve,reject)=>{http.get({host:'127.0.0.1',port,path:route},res=>{let chunks=[];res.on('data',c=>chunks.push(c));res.on('end',()=>resolve({status:res.statusCode,type:res.headers['content-type'],body:Buffer.concat(chunks)}))}).on('error',reject)})}
 try{let res=await get('/');assert.equal(res.status,200);assert.match(res.body.toString(),/CAUSAS/);
 res=await get('/js/game.js');assert.equal(res.status,200);assert.match(res.type,/javascript/);
 res=await get('/assets/enemies/rivales-atlas-v1.png');assert.equal(res.status,200);assert.equal(res.type,'image/png');
 assert.equal((await get('/missing-file.js')).status,404);
 assert.equal((await get('/%2e%2e/package.json')).status,404);
 }finally{await new Promise(resolve=>server.close(resolve))}
});
