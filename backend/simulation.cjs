'use strict';
// Una VM por sala: reutiliza catálogos, ataques y terreno sin DOM ni autoridad del cliente.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function loadEngine(root){
 const elements=new Map(),drawing=new Proxy({createRadialGradient:()=>({addColorStop(){}})},{get:(t,k)=>t[k]||(()=>{})});
 function element(){return {children:[],style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(...c){this.children.push(...c)},replaceChildren(){this.children=[]},querySelector(){return this.children[0]},focus(){},addEventListener(){},getContext(){return drawing},setPointerCapture(){}}}
 const context={console,Math,innerWidth:1280,innerHeight:720,devicePixelRatio:1,requestAnimationFrame(){},addEventListener(){},localStorage:{getItem(){},setItem(){}},document:{body:element(),querySelector(s){if(!elements.has(s))elements.set(s,element());return elements.get(s)},querySelectorAll(){return []},createElement:element}};
 context.window=context;vm.createContext(context);
 const built=fs.existsSync(path.join(root,'js/data.js'));
 const modules=built?require(path.join(root,'backend/modules.json')):require('../scripts/modules.cjs');
 for(const m of modules)vm.runInContext(fs.readFileSync(path.join(root,built?m.output:m.source),'utf8'),context,{filename:m.source,timeout:1000});
 return context.P;
}
class Simulation{
 constructor(map,characters,root=path.resolve(__dirname,'..')){
  this.P=loadEngine(root);const P=this.P;P.Maps.selected=map;P.state.chosen=characters[0];P.Game.start();
  this.players=characters.map((id,i)=>{const p=P.Entities.player(P.Data.characters[id]);Object.assign(p,{x:P.state.player.x+i*45,y:P.state.player.y,slot:i,fire:0,shots:[],fields:[],revive:0});P.state.player=p;P.Ultimate.reset();p.ultimate=P.state.ultimate;return p});
  P.state.player=this.players[0];this.result=null;
  P.Game.finish=win=>{if(win)this.result='win'};
  // En cooperativo la fama y las mejoras son del equipo. No hay menús que congelen a un jugador.
  P.Systems.levelup=()=>{const s=P.state;s.xp-=s.need;s.level++;s.need=Math.round(s.need*1.3+2);for(const p of this.players){p.power*=1.12;p.hp=Math.min(p.maxHp,p.hp+15)}};
  P.Encounters.tick=()=>{};P.Encounters.hud=()=>{};
  P.Loot.chests=[];P.Exploration.reset();P.state.portal.open=false;
 }
 use(p){const s=this.P.state;s.player=p;s.fire=p.fire;s.shots=p.shots;s.fields=p.fields;s.ultimate=p.ultimate}
 save(p){const s=this.P.state;p.fire=s.fire;p.shots=s.shots;p.fields=s.fields;p.ultimate=s.ultimate}
 tick(dt,inputs){
  const P=this.P,s=P.state,alive=this.players.filter(p=>p.hp>0);if(this.result)return;
  if(!alive.length){this.result='lose';return}
  s.mode='play';s.elapsed+=dt;s.mapTime+=dt;this.use(alive[0]);P.Chunks.sync();P.Systems.spawn(dt);
  for(const p of alive){this.use(p);const input=inputs[p.slot]||{},x=Number(input.x)||0,y=Number(input.y)||0,n=Math.max(1,Math.hypot(x,y)),old={x:p.x,y:p.y};p.inv=Math.max(0,p.inv-dt);p.moving=Math.hypot(x,y)>.05;if(x)p.facing=Math.sign(x);p.x+=x/n*p.speed*dt;p.y+=y/n*p.speed*dt;P.World.collide(p,old);p.walkPhase=(p.walkPhase||0)+Math.hypot(p.x-old.x,p.y-old.y)/8;
   const other=this.players[1-p.slot],distance=Math.hypot(p.x-other.x,p.y-other.y);if(distance>720&&other.hp>0){p.x=old.x;p.y=old.y}
   if(input.ultimate)P.Ultimate.activate();const ultimate=p.ultimate;delete p.ultimate;P.Ultimate.tick(dt);p.ultimate=ultimate;
  }
  // Cada enemigo persigue al jugador vivo más cercano; ambos reciben colisiones reales.
  for(const e of s.enemies){if(e.hp<=0)continue;const p=alive.reduce((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)<Math.hypot(b.x-e.x,b.y-e.y)?a:b);this.use(p);const old={x:e.x,y:e.y},dir=P.Terrain.direction(e,p);e.x+=dir.x*e.speed*dt;e.y+=dir.y*e.speed*dt;P.Terrain.resolve(e,old,e.r);const travelled=Math.hypot(e.x-old.x,e.y-old.y);e.moving=travelled>.01;e.walkPhase=(e.walkPhase||0)+travelled/8;e.facing=e.x<old.x?-1:1;e.hit=Math.max(0,e.hit-dt);if(P.Systems.ranged)P.Systems.ranged(e,dt);
   if(e.boss){e.attackT-=dt;if(e.attackT<=0){e.attackT=2.7;const a=Math.atan2(p.y-e.y,p.x-e.x);for(let i=-2;i<=2;i++)s.danger.push({x:e.x,y:e.y,vx:Math.cos(a+i*.18)*170,vy:Math.sin(a+i*.18)*170,age:0,life:6,kind:'spread',glyph:':(',color:'#c58ff6',history:[]})}}
   for(const q of alive)if(Math.hypot(q.x-e.x,q.y-e.y)<e.r+16&&q.inv<=0){q.hp=Math.max(0,q.hp-(e.boss?25:10));q.inv=.7}
  }
  // Avanza cada conjunto de proyectiles exactamente una vez, manteniendo al dueño del bumerán.
  const danger=s.danger;s.danger=[];
  for(const p of this.players){this.use(p);if(p.hp>0)P.Combat.tick(dt);else {p.shots=[];p.fields=[];s.shots=[];s.fields=[]}this.save(p)}
  s.danger=danger;
  for(const shot of danger){shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.age+=dt;shot.life-=dt;shot.history.push({x:shot.x,y:shot.y});if(shot.history.length>8)shot.history.shift();for(const p of alive)if(p.hp>0&&p.inv<=0&&Math.hypot(p.x-shot.x,p.y-shot.y)<24){p.hp=Math.max(0,p.hp-(shot.damage||14));p.inv=.7;shot.life=0;break}}
  s.danger=danger.filter(q=>q.life>0);
  for(const p of alive){this.use(p);P.Systems.collect(dt/ alive.length);this.save(p)}
  for(const p of this.players)if(p.hp<=0){const friend=this.players[1-p.slot];p.revive=friend.hp>0&&Math.hypot(p.x-friend.x,p.y-friend.y)<85?p.revive+dt:0;if(p.revive>=4){p.hp=Math.ceil(p.maxHp*.5);p.inv=2;p.revive=0}}
  s.enemies=s.enemies.filter(e=>e.hp>0&&alive.some(p=>Math.hypot(p.x-e.x,p.y-e.y)<2400));
  s.gems=s.gems.filter(g=>alive.some(p=>Math.hypot(p.x-g.x,p.y-g.y)<2200));
  if(!this.players.some(p=>p.hp>0))this.result='lose';
 }
 snapshot(){const P=this.P,s=P.state;return {map:P.Maps.selected,result:this.result,elapsed:s.elapsed,mapTime:s.mapTime,kills:s.kills,level:s.level,xp:s.xp,need:s.need,bossSpawned:s.bossSpawned,players:this.players.map(({shots,fields,ultimate,...p})=>({...p,ultimate:{...ultimate,seen:undefined,trails:ultimate.trails.map(({shots,fields,ultimate,...trail})=>trail)}})),shots:this.players.flatMap(p=>p.shots.map(({hits,...q})=>q)),fields:this.players.flatMap(p=>p.fields),enemies:s.enemies,gems:s.gems,danger:s.danger,effects:s.effects,coins:s.coins,broken:[...P.Chunks.broken,...P.Terrain.originProps.filter(p=>p.kind==='crate'&&!p.solid).map(p=>p.id)]}}
}
module.exports={Simulation};
