const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'dist');
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.webm':'audio/webm','.wav':'audio/wav'};
function createServer({dir=root}={}){const accounts=process.env.ACCOUNTS_DB?require('./backend/accounts.cjs').createAccounts({filename:process.env.ACCOUNTS_DB,origins:(process.env.ACCOUNTS_ORIGINS||'http://127.0.0.1:4173').split(','),secure:process.env.ACCOUNTS_INSECURE!=='true'}):null;const server=http.createServer(async(req,res)=>{
 if(accounts&&await accounts.handle(req,res))return;
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end()}
 const file=path.resolve(dir,'.'+(pathname==='/'?'/index.html':pathname));
 let stat;try{stat=fs.statSync(file)}catch{}
 if(/^\/backend(\/|$)/i.test(pathname)||!file.startsWith(dir+path.sep)||!stat?.isFile()){res.writeHead(404);return res.end('Not found')}
 res.setHeader('Cache-Control','no-cache');res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Content-Type',TYPES[path.extname(file).toLowerCase()]||'application/octet-stream');
 const stream=fs.createReadStream(file);stream.on('error',()=>{if(res.headersSent)return res.destroy();res.writeHead(404);res.end('Not found')});stream.pipe(res)
});server.accounts=accounts;server.on('close',()=>accounts?.close());return server}
module.exports={createServer};if(require.main===module){const local=createServer();require('./backend/cooperative.cjs').createCoopServer({httpServer:local});local.listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log('http://127.0.0.1:'+local.address().port))}
