const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'dist');
function createServer(){const accounts=process.env.ACCOUNTS_DB?require('./backend/accounts.cjs').createAccounts({filename:process.env.ACCOUNTS_DB,origins:(process.env.ACCOUNTS_ORIGINS||'http://127.0.0.1:4173').split(','),secure:process.env.ACCOUNTS_INSECURE!=='true'}):null;const server=http.createServer(async(req,res)=>{
 if(accounts&&await accounts.handle(req,res))return;
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end()}
 const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end('Not found')}
 res.setHeader('Cache-Control','no-cache');
 res.setHeader('Content-Type',file.endsWith('.png')?'image/png':file.endsWith('.webp')?'image/webp':file.endsWith('.js')?'text/javascript; charset=utf-8':file.endsWith('.css')?'text/css; charset=utf-8':file.endsWith('.json')?'application/json; charset=utf-8':'text/html; charset=utf-8');
 fs.createReadStream(file).pipe(res)
});server.on('close',()=>accounts?.close());return server}
module.exports={createServer};if(require.main===module){const local=createServer();require('./backend/cooperative.cjs').createCoopServer({httpServer:local});local.listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log('http://127.0.0.1:4173'))}
