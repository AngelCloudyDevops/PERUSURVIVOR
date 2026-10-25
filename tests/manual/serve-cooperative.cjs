// SOLO LOCAL. No forma parte de dist/ ni agrega comandos al protocolo público.
'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),{createCoopServer}=require('../../backend/cooperative.cjs');
const root=path.resolve(__dirname,'../..'),dist=path.join(root,'dist');let app;
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/__qa/activities'){
  const action=url.searchParams.get('action'),room=[...app.rooms.values()].find(r=>r.sim),sim=room?.sim;
  if(sim&&action){const P=sim.P,s=P.state,alive=sim.players;
   if(action==='portal'){s.mapTime=180;P.Encounters.tick();for(const p of alive)Object.assign(p,{...P.Encounters.definition().portal,hp:p.maxHp,inv:9999});s.enemies=[]}
   if(action==='win'&&s.encounter){P.Entities.hurt(s.enemies.find(e=>e.mapBoss),999999)}
   if(action==='chest'){for(const p of alive)Object.assign(p,{x:200,y:300,hp:p.maxHp,inv:9999});P.Loot.chests.push({id:'qa:chest:'+Date.now(),x:200,y:300,progress:0,opened:false,gold:false,rarity:'common',map:P.Maps.selected});sim.activities.syncChests=()=>{}}
   if(action==='gold'){const gold=P.Loot.chests.find(c=>c.gold);if(gold)for(const p of alive)Object.assign(p,{x:gold.x,y:gold.y,inv:9999})}
   if(action==='event'&&P.Exploration.station){for(const p of alive)Object.assign(p,{x:P.Exploration.station.x,y:P.Exploration.station.y,hp:35,inv:9999});s.enemies=[]}
  }
  res.setHeader('Content-Type','text/html; charset=utf-8');res.end('<h1>QA local de cooperativo</h1><p>Crear sala en dos pestañas del juego y comenzar. Estos botones solo preparan el escenario local.</p>'+['portal','win','chest','gold','event'].map(a=>'<p><a href="?action='+a+'">'+a+'</a></p>').join('')+'<a href="/">Abrir juego</a>');return;
 }
 const file=path.resolve(dist,'.'+(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(dist+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return}
 res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.webp')?'image/webp':file.endsWith('.json')?'application/json':'text/html; charset=utf-8');fs.createReadStream(file).pipe(res);
});
app=createCoopServer({httpServer:server});server.listen(4191,'127.0.0.1',()=>console.log('QA cooperativo: http://127.0.0.1:4191/__qa/activities'));
