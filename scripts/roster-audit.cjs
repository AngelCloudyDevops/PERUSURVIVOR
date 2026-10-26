'use strict';
const fs=require('node:fs'),path=require('node:path'),{Simulation}=require('../backend/simulation.cjs'),baseline=require('../docs/roster-balance-baseline.json');
function measure(id,scene,evolved=false,previous=false,reference=null){
 const P=new Simulation('campo',[0,1]).P,s=P.state;
 if(previous||reference){const snapshot=previous?baseline:reference;P.Data.characters=structuredClone(snapshot.characters);P.Data.attacks=structuredClone(snapshot.attacks);P.Evolutions.profiles=structuredClone(snapshot.evolutions)}
 const c=P.Data.characters.find(c=>c.id===id),p=P.Entities.player(c);s.player=p;p.x=p.y=0;p.aimView={hw:490,hh:275,dx:0,dy:0};s.mode='play';s.elapsed=0;s.fire=0;s.shots=[];s.fields=[];s.effects=[];P.Progression.tick=()=>{};P.Terrain.active=()=>[];P.Terrain.hit=()=>null;P.Muzzle.blocker=()=>null;P.Ultimate.hit=()=>{};
 if(evolved){s.level=8;for(let i=0;i<4;i++)P.Progression.apply(p,'primary');P.Progression.apply(p,'evolve:primary')}
 const radius=scene==='boss'?40:18,count=scene==='line'||scene==='ring'?8:1;
 s.enemies=Array.from({length:count},(_,i)=>({x:scene==='ring'?Math.cos(i*Math.PI/4)*100:scene==='mid'?250:scene==='line'?85+i*40:100,y:scene==='ring'?Math.sin(i*Math.PI/4)*100:0,r:radius,hp:1e9,max:1e9,speed:0}));let total=0;
 P.Entities.hurt=(e,n)=>{e.hp-=n;total+=n};
 for(let i=0;i<600;i++){s.elapsed+=1/30;if(scene==='boss'){s.enemies[0].x=Math.cos(s.elapsed*.55)*100;s.enemies[0].y=Math.sin(s.elapsed*.55)*100}P.Combat.tick(1/30)}
 return Math.round(total/20*10)/10;
}
function audit(){const P=new Simulation('campo',[0,1]).P;return {method:'20 s a 30 Hz, cámara fija 980x550 u, sin ulti/apoyos/mejoras permanentes, terreno vacío, blancos con vida ilimitada. close: 100 u/r18; mid: 250 u/r18; boss: r40 orbitando a 100 u a 0,55 rad/s; line: ocho r18 a 85+40i; ring: ocho r18 alrededor a 100 u. evolved: cuatro rangos y evolución al nivel 8. Daño agregado por segundo, no supervivencia ni tasa de victoria. Escopetas conservan caída y descuento real; órbitas se miden durante todo el ciclo.',baseline:baseline.sha,characters:P.Data.characters.map(c=>({id:c.id,name:c.name,before:baseline.characters.find(v=>v.id===c.id),after:{hp:c.hp,speed:c.speed,power:c.power},base:Object.fromEntries(['close','mid','boss','line','ring'].map(k=>[k,{before:measure(c.id,k,false,true),after:measure(c.id,k)}])),evolved:Object.fromEntries(['close','boss','line','ring'].map(k=>[k,{before:measure(c.id,k,true,true),after:measure(c.id,k,true)}]))}))}}
module.exports={measure,audit};if(require.main===module){const r=audit();fs.writeFileSync(path.join(__dirname,'../docs/roster-audit.json'),JSON.stringify(r,null,2)+'\n');console.table(r.characters.map(c=>({id:c.id,close:c.base.close.after,mid:c.base.mid.after,boss:c.base.boss.after,line:c.base.line.after,ring:c.base.ring.after,evoBoss:c.evolved.boss.after,evoLine:c.evolved.line.after}))) }
