'use strict';
// Controlled mechanics only: no enemy attacks, empty terrain, durable targets.
const fs=require('node:fs'),path=require('node:path'),{Simulation}=require('../backend/simulation.cjs');
function measure({attack,rank,moving=false,evolved=false,sourceRoot=path.resolve(__dirname,'..')}){
 const sim=new Simulation('campo',[10,10],sourceRoot),P=sim.P,s=P.state,p=s.player;s.mode='play';s.elapsed=0;s.fire=0;p.x=p.y=0;p.aim=0;P.Progression.init(p);s.level=14;
 for(const key of ['ciriloTaxi','ciriloEcho'])P.Progression.apply(p,'cirilo-arsenal:unlock:'+key);
 const id=attack==='Q'?'ciriloVomit':attack;P.CiriloArsenal.switch(p,P.CiriloArsenal.order.indexOf(id)+1,true);for(let i=1;i<rank;i++)P.Progression.apply(p,'cirilo-arsenal:rank:'+id);if(evolved)P.Progression.apply(p,'cirilo-arsenal:evolve:'+id);
 P.CiriloUR.applyStage(p);P.Terrain.active=()=>[];P.Terrain.hit=()=>null;P.Terrain.clear=()=>true;P.Muzzle.blocker=()=>null;P.World.collide=()=>{};
 const e=P.Attributes.init({targetId:'duel',x:200,y:0,hp:1e7,max:1e7,r:18,speed:0,design:0});s.enemies=[e];
 let damage=0,hits=0,casts=0,damageQ=0;const hurt=P.Entities.hurt,cast=P.Combat.cast;P.Entities.hurt=function(target,...args){const before=target.hp,r=hurt.call(this,target,...args),d=Math.max(0,before-target.hp);damage+=d;if(d)hits++;if(args[2]?.ultimate)damageQ+=d;return r};P.Combat.cast=function(...args){if(attack==='Q')return false;const ok=cast.apply(this,args);if(ok)casts++;return ok};
 if(attack==='Q'){s.ultimate.ciriloCharge=100;P.CiriloKit.activateQ()}
 const duration=attack==='Q'?3:20;for(let i=0;i<duration*30;i++){s.elapsed=i/30;if(moving){e.x=Math.cos(s.elapsed*.8)*200;e.y=Math.sin(s.elapsed*.8)*200}P.CiriloKit.taxiStep(p,1/30);P.Combat.tick(1/30)}
 return{attack,rank,evolved,moving,duration,damage:+damage.toFixed(2),dps:+(damage/duration).toFixed(2),qWindowDps:attack==='Q'?+(damageQ/P.CiriloKit.qDuration).toFixed(2):null,hits,casts}
}
if(require.main===module){const arg=process.argv.indexOf('--source-root'),sourceRoot=arg<0?path.resolve(__dirname,'..'):path.resolve(process.argv[arg+1]),results=[];for(const attack of ['ciriloVomit','ciriloTaxi','ciriloEcho','Q'])for(const rank of [1,5])for(const moving of [false,true])results.push(measure({attack,rank,moving,sourceRoot}));for(const attack of ['ciriloTaxi','ciriloEcho'])for(const moving of [false,true])results.push(measure({attack,rank:5,moving,evolved:true,sourceRoot}));fs.writeFileSync(path.resolve(__dirname,'../docs/cirilo-duels-'+(process.argv.includes('--after')?'after':'before')+'.json'),JSON.stringify({fingerprint:require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(sourceRoot,'src/systems/cirilo-kit.js'),'utf8').replace(/\r\n/g,'\n')).digest('hex'),scope:'Controlled durable target at 200 units orbiting at 0.8 rad/s if moving, empty terrain, no enemy attacks. Rango obtained with real cards, level 14. Q precharged in this controlled comparison only; qWindowDps divides its total by 1.95s, whereas dps uses full 3s for projectile flight. Early shots can miss before velocity is sampled.',results},null,2)+'\n');console.table(results)}
module.exports={measure};
