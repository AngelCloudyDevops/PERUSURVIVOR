// QA local only: disposable localhost progress. Never distributed.
const http=require('http'),fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'../..'),base=require('../../server.cjs').createServer().listeners('request')[0];
const qa=`<div style="position:fixed;bottom:0;left:0;z-index:100;background:#172536;color:white;padding:6px">QA LOCAL <button id="qa-finish">Completar partida QA</button></div><script>
window.addEventListener('load',()=>{document.querySelector('#qa-finish').onclick=()=>{if(!P.Lobby.entered)P.Lobby.enter();P.Game.start();P.state.elapsed=120;P.state.kills=100;P.state.level=7;P.Game.finish(true)}});
</script>`;
http.createServer((req,res)=>{if(req.url.startsWith('/__qa/meta')){res.setHeader('Content-Type','text/html;charset=utf-8');return res.end(fs.readFileSync(path.join(root,'src/index.html'),'utf8').replace('<head>','<head><base href="/">').replace('</body>',qa+'</body>'))}base(req,res)}).listen(4278,'127.0.0.1',()=>console.log('http://127.0.0.1:4278/__qa/meta'));
