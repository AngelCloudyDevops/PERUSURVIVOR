const http=require('http'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'dist');
http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end()}
 const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end('Not found')}
 res.setHeader('Content-Type',file.endsWith('.png')?'image/png':file.endsWith('.js')?'text/javascript; charset=utf-8':file.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8');
 fs.createReadStream(file).pipe(res)
}).listen(4173,'127.0.0.1',()=>console.log('http://127.0.0.1:4173'));