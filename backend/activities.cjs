'use strict';
// Actividades de sala. Solo acepta intenciones; posiciones, premios y consumo de llaves se validan aquí.
class Activities{
 constructor(sim){this.sim=sim;this.votes=new Set();this.serial=0;this.pending=null;this.returning=false;this.message='';this.messageTime=0;sim.P.Encounters.win=()=>{this.returning=true}}
 get P(){return this.sim.P}
 notice(text){this.message=text;this.messageTime=4}
 action(slot,action,id,choice){
  const sim=this.sim,P=this.P,s=P.state,p=sim.players[slot];if(!p||sim.result)return false;
  if(action==='choose')return this.choose(slot,id,choice);
  if(this.pending||p.hp<=0||s.mode!=='play')return false;
  sim.use(p);
  if(action==='market-buy')return P.Market.buy(id);
  if(action==='portal'){
   if(!P.Encounters.near())return false;
   if(this.votes.has(slot))this.votes.delete(slot);else this.votes.add(slot);
   this.tryPortal();return true;
  }
  if(action==='event'){
   if(!P.Exploration.near()||P.Exploration.station.phase!=='idle'||s.bossSpawned)return false;
   P.Exploration.start();this.notice('Defiendan el emoliente juntos: permanezcan cerca 20 s');return true;
  }
  return false;
 }
 tryPortal(){
  const sim=this.sim,P=this.P,s=P.state;
  for(const p of sim.players){sim.use(p);if(p.hp<=0||!P.Encounters.near())this.votes.delete(p.slot)}
  if(this.votes.size!==2)return;
  this.positions=sim.players.map(p=>({x:p.x,y:p.y}));sim.use(sim.players[0]);s.mode='portal';P.Encounters.enter();
  if(!s.encounter){s.mode='play';return}
  s.portal.open=false;
  for(const p of sim.players){p.x=p.slot?60:0;p.y=220;p.inv=1.5;p.moving=false;p.fire=.2;p.shots=[];p.fields=[]}
  this.votes.clear();this.notice('Entraron juntos a '+s.encounter.scene.name);
 }
 returnFromArena(){
  const sim=this.sim,P=this.P,s=P.state,arena=s.encounter;if(!arena)return;
  s.enemies=arena.enemies;s.gems=arena.gems;s.spawn=arena.spawn;s.encounter=null;s.danger=[];s.effects=[];s.portal.open=false;s.portal.cleared=true;s.mapBossWon=true;
  for(const p of sim.players){Object.assign(p,this.positions[p.slot]);p.inv=2;p.shots=[];p.fields=[];p.fire=.2}
  sim.use(sim.players[0]);P.Chunks.signature='';P.Chunks.sync();P.Terrain.flow=null;
  if(!P.Loot.bossDropped){P.Loot.bossDropped=true;const p=sim.players[0],pos=P.Loot.position(p.x+60,p.y)||{x:p.x,y:p.y};P.Loot.chests.push({id:'boss:'+P.Maps.selected,...pos,progress:0,opened:false,gold:true,rarity:'legendary',map:P.Maps.selected})}
  this.returning=false;this.notice('Jefe derrotado: abran el cofre dorado y elijan una mejora cada uno');
 }
 syncChests(){
  const sim=this.sim,P=this.P;if(P.state.encounter)return;
  const window=sim.players.map(p=>Math.floor(p.x/768)+','+Math.floor(p.y/768)).join('|');if(window===this.chestWindow)return;this.chestWindow=window;
  const previous=P.Loot.chests,union=new Map();for(const p of sim.players){P.Loot.chests=previous;sim.use(p);P.Loot.signature='';P.Loot.sync();for(const c of P.Loot.chests)union.set(c.id,c)}P.Loot.chests=[...union.values()];
 }
 open(chest){
  const P=this.P;if(this.pending||chest.opened||P.state.encounter||!P.Loot.canOpen(chest))return false;
  if(chest.impostor&&!chest.purified)return P.Market.wake(chest);
  const tier=P.Loot.keyType(chest);if(tier)P.state.keys[tier]--;
  chest.opened=true;chest.progress=1.8;chest.openAge=0;P.Loot.opened.add(chest.id);
  let item=null;if(!chest.gold){const ids=Object.keys(P.Loot.items).filter(id=>P.Loot.items[id].rarity===(chest.rarity||'common'));item=ids[Math.floor(P.Loot.roll(Math.floor(chest.x),Math.floor(chest.y),271)*ids.length)];chest.item=item}
  this.pending={id:++this.serial,kind:chest.gold?'portal-reward':'item',phase:'opening',age:0,item,rarity:chest.rarity||'common',applied:[false,false],chestId:chest.id};
  for(const p of this.sim.players)p.moving=false;
  return true;
 }
 choose(slot,id,choice){
  const pending=this.pending;if(!pending||pending.id!==id||pending.phase!=='choice'||pending.applied[slot]||!Number.isInteger(choice))return false;
  const P=this.P,p=this.sim.players[slot];this.sim.use(p);
  if(pending.kind==='portal-reward'){
   if(choice<0||choice>2)return false;
   if(choice===0)p.power*=1.3;
   if(choice===1){p.maxHp+=40;p.hp=p.maxHp}
   if(choice===2)p.rate=Math.max(.1,p.rate*.75);
  }else{
   if(choice<0||choice>1)return false;
   if(choice===0)P.Loot.use(pending.item);
  }
  pending.applied[slot]=true;
  if(pending.applied.every(Boolean)){this.pending=null;this.notice('Recompensas entregadas a los dos. ¡Sigan explorando!')}
  return true;
 }
 advance(dt){
  this.P.Loot.animate(dt);if(this.pending?.phase==='opening'){this.pending.age+=dt;if(this.pending.age>=.65)this.pending.phase='choice'}
 }
 tick(dt){
  const sim=this.sim,P=this.P,s=P.state;this.messageTime=Math.max(0,this.messageTime-dt);P.Loot.messageTime=Math.max(0,P.Loot.messageTime-dt);
  if(this.returning)this.returnFromArena();
  P.Encounters.tick();this.tryPortal();if(s.encounter)return;
  this.syncChests();P.Loot.animate(dt);sim.use(sim.players.find(p=>p.hp>0)||sim.players[0]);P.Loot.spawnKeepers();P.Market.tick();
  const o=P.Exploration.station;
  if(o&&o.phase==='active'){
   const defender=sim.players.find(p=>p.hp>0&&Math.hypot(p.x-o.x,p.y-o.y)<=200)||sim.players.find(p=>p.hp>0)||sim.players[0];sim.use(defender);
   const before=o.phase;P.Exploration.tick(dt);if(before!=='done'&&o.phase==='done'){
    for(const p of sim.players)if(p!==defender&&p.hp>0)p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.35);
    this.notice('¡Evento completado! +25 monedas de equipo y curación para ambos');
   }
  }
  for(const chest of P.Loot.chests){if(chest.opened)continue;if(chest.impostor){const victim=sim.players.find(p=>p.hp>0&&Math.hypot(p.x-chest.x,p.y-chest.y)<100);if(victim){sim.use(victim);P.Market.wake(chest)}continue}const opener=sim.players.find(p=>p.hp>0&&!p.moving&&Math.hypot(p.x-chest.x,p.y-chest.y)<75);
   if(!opener){chest.progress=0;continue}sim.use(opener);if(!P.Loot.canOpen(chest)){P.Loot.locked(chest);continue}chest.progress+=dt;if(chest.progress>=1.8){this.open(chest);break}
  }
 }
 snapshot(){const P=this.P,s=P.state;return {portal:{...s.portal,votes:[...this.votes]},encounter:s.encounter?{definition:s.encounter.definition,scene:s.encounter.scene,obstacles:s.encounter.obstacles}:null,mapBossWon:!!s.mapBossWon,merchant:P.Market.merchant,chests:P.Loot.chests.map(({onOpen,...c})=>c),debris:P.Loot.debris,station:P.Exploration.station,keys:s.keys,pending:this.pending,message:this.messageTime>0?this.message:P.Loot.messageTime>0?P.Loot.message:''}}
}
module.exports={Activities};
