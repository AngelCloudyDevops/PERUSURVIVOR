'use strict';
// Controlled mechanics, separate from full matches: empty terrain and durable targets, no enemy attacks.
const fs=require('node:fs'),path=require('node:path'),{Simulation}=require('../backend/simulation.cjs');
function measure({attack,rank,moving=false}){
 const P=new Simulation('campo',[18,18]).P,s=P.state,p=s.player;s.player=p;s.mode='play';s.elapsed=0;s.fire=0;p.x=p.y=0;p.aim=0;p.facing=1;P.Progression.init(p);s.level=14;
 for(const key of ['sideralTail','sideralEgg'])P.Progression.apply(p,'sideral-arsenal:unlock:'+key);
 const id=attack==='Q'?'sideralFear':attack;P.SideralArsenal.switch(p,P.SideralArsenal.order.indexOf(id)+1,true);for(let i=1;i<rank;i++)P.Progression.apply(p,'sideral-arsenal:rank:'+id);
 P.Terrain.active=()=>[];P.Terrain.hit=()=>null;P.Terrain.clear=()=>true;P.Muzzle.blocker=()=>null;
 const radius=id==='sideralTail'?100:200,e=P.Attributes.init({targetId:'duel',x:radius,y:0,hp:1e7,max:1e7,r:18,speed:0,design:0});s.enemies=[e];
 let damage=0,hits=0,eggs=0,missed=0;const hurt=P.Entities.hurt,cast=P.SideralKit.cast,tick=P.SideralKit.tick;P.Entities.hurt=function(target,...args){const before=target.hp,r=hurt.call(this,target,...args);damage+=Math.max(0,before-target.hp);if(before>target.hp)hits++;return r};P.SideralKit.cast=function(){const n=(p.sideralEggs||[]).length,r=cast.call(this);eggs+=Math.max(0,(p.sideralEggs||[]).length-n);return r};P.SideralKit.tick=function(player,dt){const old=[...(p.sideralEggs||[])],r=tick.call(this,player,dt);for(const n of old)if(!(p.sideralEggs||[]).includes(n)&&!Object.keys(n.hits).length)missed++;return r};
 if(attack==='Q'){s.ultimate.sideralCharge=100;P.SideralKit.activate()}
 const duration=attack==='Q'?6:20;for(let i=0;i<duration*30;i++){s.elapsed=i/30;if(moving){e.x=Math.cos(s.elapsed*.8)*radius;e.y=Math.sin(s.elapsed*.8)*radius}P.Combat.tick(1/30)}
 return{attack,rank,moving,duration,damage:+damage.toFixed(2),dps:+(damage/duration).toFixed(2),hits,eggs,missed}
}
if(require.main===module){const after=process.argv.includes('--after'),results=[];for(const attack of ['sideralFear','sideralTail','sideralEgg','Q'])for(const rank of [1,5])for(const moving of [false,true])results.push(measure({attack,rank,moving}));const file=path.resolve(__dirname,'../docs/balance/datos/sideral-duels-'+(after?'after':'before')+'.json');fs.writeFileSync(file,JSON.stringify({scope:'Controlled empty-terrain DPS, no enemy attacks; not full-run win rate. Attack rank obtained with real progression; Q precharged only in this controlled comparison.',results},null,2)+'\n');console.table(results)}
module.exports={measure};
