'use strict';
// Una VM por sala: reutiliza catálogos, ataques y terreno sin DOM ni autoridad del cliente.
const {Activities}=require('./activities.cjs');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function loadEngine(root){
 const elements=new Map(),drawing=new Proxy({createRadialGradient:()=>({addColorStop(){}})},{get:(t,k)=>t[k]||(()=>{})});
 function element(){return {children:[],style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(...c){this.children.push(...c)},replaceChildren(){this.children=[]},querySelector(){return this.children[0]},focus(){},addEventListener(){},getContext(){return drawing},setPointerCapture(){}}}
 const context={console,Math,innerWidth:1280,innerHeight:720,devicePixelRatio:1,requestAnimationFrame(){},addEventListener(){},localStorage:{getItem(){},setItem(){}},document:{body:element(),querySelector(s){if(!elements.has(s))elements.set(s,element());return elements.get(s)},querySelectorAll(){return []},createElement:element}};
 context.window=context;vm.createContext(context);
 const built=fs.existsSync(path.join(root,'js/data.js'));
 const modules=built?require(path.join(root,'backend/modules.json')).map(m=>typeof m==='string'?{output:m}:m):require('../scripts/modules.cjs');
 for(const m of modules)vm.runInContext(fs.readFileSync(path.join(root,built?m.output:m.source),'utf8'),context,{filename:m.source||m.output,timeout:1000});
 return context.P;
}
class Simulation{
 constructor(map,characters,root=path.resolve(__dirname,'..')){
  this.P=loadEngine(root);const P=this.P;P.Combat.server=true;P.Maps.selected=map;P.state.chosen=characters[0];P.Game.start();
  this.players=characters.map((id,i)=>{const p=P.Entities.player(P.Data.characters[id]);Object.assign(p,{x:P.state.player.x+i*45,y:P.state.player.y,slot:i,fire:0,shots:[],fields:[],revive:0});P.state.player=p;P.Ultimate.reset();p.ultimate=P.state.ultimate;return p});
  P.state.player=this.players[0];P.Minibosses.partySize=()=>this.players.length;P.Court.players=()=>this.players;this.result=null;
  P.Game.finish=win=>{if(win)this.result='win'};
  P.Systems.levelup=()=>{if(!this.activities.pending)this.activities.levelup()};
  this.activities=new Activities(this);this.team=new (require('./team-combo.cjs').TeamCombo)(this);
 }
 use(p){const s=this.P.state;s.player=p;s.fire=p.fire;s.shots=p.shots;s.fields=p.fields;s.ultimate=p.ultimate}
 save(p){const s=this.P.state;p.fire=s.fire;p.shots=s.shots;p.fields=s.fields;p.ultimate=s.ultimate}
 tick(dt,inputs){
  const P=this.P,s=P.state,alive=this.players.filter(p=>p.hp>0);if(this.result)return;
  if(!alive.length){this.result='lose';return}
  if(this.activities.pending){this.activities.advance(dt);return}
  if(s.encounter?.defeat){s.mode='play';this.use(alive[0]);const kind=s.encounter.definition.kind;if(kind==='combi')P.ChosicanoCombat.defeatTick(dt);else if(kind==='fujimori')P.FujimoriBoss.defeatTick(dt);else P.Vulture.defeatTick(dt);if(s.encounter?.defeat?.finished)this.activities.tick(0);return}
  if(s.domain){P.Domain.tick(dt,inputs);return}
  if(s.court){this.use(this.players[s.court.slot]);P.Court.tick(dt);return}if(P.DragonUltimate?.advanceScene(dt,this.players))return;P.Court.burstTick(dt);
  s.mode='play';s.elapsed+=dt;if(!s.encounter)s.mapTime+=dt;this.use(alive[0]);P.Chunks.sync();P.Encounters.tick();P.Systems.spawn(dt);
  for(const p of alive){this.use(p);const input=inputs[p.slot]||{},x=Number(input.x)||0,y=Number(input.y)||0,n=Math.max(1,Math.hypot(x,y)),old={x:p.x,y:p.y};p.inv=Math.max(0,p.inv-dt);p.moving=Math.hypot(x,y)>.05;if(x)p.facing=Math.sign(x);p.x+=x/n*p.speed*(P.DragonUltimate?.speed(p)??1)*dt;p.y+=y/n*p.speed*(P.DragonUltimate?.speed(p)??1)*dt;P.World.collide(p,old);
   p.aimView=P.Combat.sanitizeView(input.view)||p.aimView||null;const other=this.players[1-p.slot],distance=Math.hypot(p.x-other.x,p.y-other.y);if(distance>720&&other.hp>0){p.x=old.x;p.y=old.y}
   const travelled=Math.hypot(p.x-old.x,p.y-old.y);p.moving=travelled>.01;p.walkPhase=(p.walkPhase||0)+travelled/10;if(input.weapon&&p.arsenalInputWeapon!==input.weapon){P.KingtekaArsenal?.switch(p,input.weapon);p.arsenalInputWeapon=input.weapon}else if(!input.weapon)p.arsenalInputWeapon=0;if(input.ultimate)P.Ultimate.activate();if(s.court||s.domain){this.save(p);return}const ultimate=p.ultimate;delete p.ultimate;P.Ultimate.tick(dt);p.ultimate=ultimate;
  }
  // Cada enemigo persigue al jugador vivo más cercano; ambos reciben colisiones reales.
  for(const e of s.enemies){if(e.hp<=0)continue;const p=alive.reduce((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)<Math.hypot(b.x-e.x,b.y-e.y)?a:b);this.use(p);const old={x:e.x,y:e.y};if(e.miniboss){P.Minibosses.move(e,dt);P.Minibosses.contact(e,alive);continue}if(e.mapBoss){P.Encounters.bossMove(e,dt);for(const q of alive)if(Math.hypot(q.x-e.x,q.y-e.y)<e.r+16&&q.inv<=0){P.PlayerFeedback.hit(q,24,e);q.inv=.7}continue}const dir=P.Terrain.direction(e,p);if(e.charge){const step=Math.min(dt,e.charge.time);e.x+=e.charge.x*(e.charge.speed||300)*step*(P.DomainAftermath?.slow(e)??1);e.y+=e.charge.y*(e.charge.speed||300)*step*(P.DomainAftermath?.slow(e)??1);e.charge.time-=dt;const intended={x:e.x,y:e.y};P.Terrain.resolve(e,old,e.r);if(e.charge.time<=0||Math.hypot(e.x-intended.x,e.y-intended.y)>.1)e.charge=null}else{e.x+=dir.x*e.speed*dt*(P.DomainAftermath?.slow(e)??1)*(e.rangedAim||e.burst?0:1);e.y+=dir.y*e.speed*dt*(P.DomainAftermath?.slow(e)??1)*(e.rangedAim||e.burst?0:1);P.Terrain.resolve(e,old,e.r)}const travelled=Math.hypot(e.x-old.x,e.y-old.y);e.moving=travelled>.01;e.walkPhase=(e.walkPhase||0)+travelled/(e.heavy?10:8);if(Math.abs(e.x-old.x)>.01)e.facing=e.x<old.x?-1:1;e.hit=Math.max(0,e.hit-dt);if(P.Systems.ranged)P.Systems.ranged(e,dt);
   if(e.boss){e.attackT-=dt;if(e.attackT<=0){e.attackT=2.7;const a=Math.atan2(p.y-e.y,p.x-e.x);for(let i=-2;i<=2;i++)s.danger.push({...P.Attributes.source(e,'special'),x:e.x,y:e.y,vx:Math.cos(a+i*.18)*170,vy:Math.sin(a+i*.18)*170,age:0,life:6,kind:'spread',glyph:':(',color:'#c58ff6',history:[]})}}
   for(const q of alive)if(Math.hypot(q.x-e.x,q.y-e.y)<e.r+16&&q.inv<=0){P.PlayerFeedback.hit(q,P.MinionEvolution.contact(e),e);q.inv=.7}
  }
  // Avanza cada conjunto de proyectiles exactamente una vez, manteniendo al dueño del bumerán.
  const danger=s.danger;s.danger=[];
  for(const p of this.players){this.use(p);if(p.hp>0)P.Combat.tick(dt);else {p.shots=[];p.fields=[];s.shots=[];s.fields=[]}this.save(p);if(s.encounter?.defeat){for(const q of this.players){q.shots=[];q.fields=[]}return}}
  s.danger=danger;
  for(const shot of danger){if(shot.miniId&&!s.enemies.some(e=>e.hp>0&&e.miniId===shot.miniId)){shot.life=0;continue}shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;if(shot.kind==='zigzag'){const wave=(Math.sin((shot.age+dt)*9)-Math.sin(shot.age*9))*14,speed=Math.hypot(shot.vx,shot.vy)||1;shot.x-=shot.vy/speed*wave;shot.y+=shot.vx/speed*wave}shot.age+=dt;shot.life-=dt;if((shot.minion||s.encounter)&&shot.kind!=='stomp'&&(P.Terrain.hit(shot.x,shot.y,7)||P.Minibosses.coverBlocked(shot,dt))){shot.life=0;continue}shot.history.push({x:shot.x,y:shot.y});if(shot.history.length>8)shot.history.shift();for(const p of alive)if(p.hp>0&&p.inv<=0&&shot.life>0&&!shot.spent&&P.MinionEvolution.hits(shot,p)&&(shot.kind!=='stomp'||shot.groundWave||P.Terrain.clear(shot.x,shot.y,p.x,p.y))){P.PlayerFeedback.hit(p,shot.damage||14,shot);p.inv=.7;if(shot.kind==='stomp')shot.spent=true;else shot.life=0;break}}
  s.danger=danger.filter(q=>q.life>0);
  for(const p of alive){this.use(p);P.Systems.collect(dt/ alive.length);this.save(p)}
  for(const p of this.players)if(p.hp<=0){const friend=this.players[1-p.slot];p.revive=friend.hp>0&&Math.hypot(p.x-friend.x,p.y-friend.y)<85?p.revive+dt:0;if(p.revive>=4){p.hp=Math.ceil(p.maxHp*.5);p.inv=2;p.revive=0}}
  s.enemies=s.enemies.filter(e=>e.hp>0&&(e.miniboss||e.mimic||alive.some(p=>Math.hypot(p.x-e.x,p.y-e.y)<2400)));
  s.gems=s.gems.filter(g=>alive.some(p=>Math.hypot(p.x-g.x,p.y-g.y)<2200));
  if(!this.players.some(p=>p.hp>0))this.result='lose';
  if(!this.result)this.activities.tick(dt);
 }
 snapshot(){const P=this.P,s=P.state;return {...this.activities.snapshot(),team:this.team.snapshot(),domain:s.domain||null,domainAftermath:s.domainAftermath||null,court:s.court||null,courtBurst:s.courtBurst||null,map:P.Maps.selected,result:this.result,elapsed:s.elapsed,mapTime:s.mapTime,miniWarning:s.miniWarning,miniReport:s.miniReport,kills:s.kills,level:s.level,xp:s.xp,need:s.need,bossSpawned:s.bossSpawned,players:this.players.map(({shots,fields,ultimate,...p})=>({...p,ultimate:{...ultimate,seen:undefined,trails:ultimate.trails.map(({shots,fields,ultimate,...trail})=>trail)}})),shots:this.players.flatMap(p=>p.shots.map(({hits,...q})=>q)),fields:this.players.flatMap(p=>p.fields),enemies:s.enemies,gems:s.gems,danger:s.danger,effects:s.effects,coins:s.coins,broken:[...P.Chunks.broken,...P.Terrain.originProps.filter(p=>p.kind==='crate'&&!p.solid).map(p=>p.id)]}}
}
module.exports={Simulation};
