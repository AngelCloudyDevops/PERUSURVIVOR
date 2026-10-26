// Local-only QA controls; excluded from dist.
const http=require('http'),fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'../..'),base=require('../../server.cjs').createServer().listeners('request')[0];
const qa=`<div style="position:fixed;bottom:0;left:0;z-index:100;background:#172536;color:white;padding:6px">QA LOCAL <button id="qa-level">Subir nivel</button><button id="qa-evolve">Probar evolución</button></div><script>
function level(){P.state.mode='play';P.state.xp=P.state.need;P.Systems.levelup()}
function evolve(){P.state.player.powerRanks={primary:5,pulse:5,cards:3};P.state.level=7;level()}
window.addEventListener('load',()=>{P.state.chosen=P.Data.characters.findIndex(c=>c.id==='kingteka');P.Game.start();P.state.spawn=999;P.state.player.inv=999;P.state.enemies=[];level()});document.querySelector('#qa-level').onclick=level;document.querySelector('#qa-evolve').onclick=evolve;
</script>`;
http.createServer((req,res)=>{if(req.url.startsWith('/__qa/progression')){res.setHeader('Content-Type','text/html;charset=utf-8');return res.end(fs.readFileSync(path.join(root,'src/index.html'),'utf8').replace('<head>','<head><base href="/">').replace('</body>',qa+'</body>'))}base(req,res)}).listen(4208,'127.0.0.1',()=>console.log('QA http://127.0.0.1:4208/__qa/progression'));
