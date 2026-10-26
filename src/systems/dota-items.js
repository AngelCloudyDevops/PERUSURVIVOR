'use strict';
// Adaptación propia de objetos de Dota 2; se limita a la partida actual.
P.DotaItems={
capacity:4,
families:{
 boots:{base:{id:'boots',name:'Boots of Speed',description:'+5% de velocidad de movimiento.',icon:'shoe',rarity:'common',mods:{speed:1.05}},branches:[
  {id:'phase',name:'Phase Boots',description:'+12% de velocidad para reposicionarte y escapar.',icon:'shoe',rarity:'rare',mods:{speed:1.12}},
  {id:'treads',name:'Power Treads',description:'+5% de velocidad y 10% más de cadencia.',icon:'shoe',rarity:'rare',mods:{speed:1.05,rate:.9}},
  {id:'tranquil',name:'Tranquil Boots',description:'+8% de velocidad; recupera vida tras 5 s sin recibir daño.',icon:'shoe',rarity:'rare',mods:{speed:1.08},heal:1.2},
  {id:'arcane',name:'Arcane Boots',description:'+6% de velocidad y 8% más de cadencia.',icon:'shoe',rarity:'epic',mods:{speed:1.06,rate:.92}},
  {id:'travel',name:'Boots of Travel',description:'+14% de velocidad y +20% de alcance para recoger fama y monedas.',icon:'shoe',rarity:'epic',mods:{speed:1.14,magnet:1.2}}
 ]},
 stick:{base:{id:'stick',name:'Magic Stick',description:'Acumula cargas al recibir daño; con 4 cargas y poca vida, restaura 8% de vida máxima.',icon:'bolt',rarity:'common',mods:{},charges:5,heal:.02,threshold:.3},branches:[
  {id:'wand',name:'Magic Wand',description:'Amplía a 10 cargas. Consume 4 o más con poca vida para recuperar 2.5% por carga.',icon:'bolt',rarity:'rare',mods:{},charges:10,heal:.025,threshold:.48}
 ]},
 blink:{base:{id:'blink',name:'Blink Dagger',description:'Al recibir un golpe fuerte con poca vida, te desplaza fuera del peligro. Recarga: 18 s.',icon:'range',rarity:'rare',mods:{},cooldown:18,distance:145},branches:[
  {id:'swift',name:'Swift Blink',description:'Mayor distancia de escape y velocidad breve. Recarga: 14 s.',icon:'range',rarity:'epic',mods:{},cooldown:14,distance:235,haste:1.2},
  {id:'arcane',name:'Arcane Blink',description:'El escape adelanta tu siguiente ataque. Recarga: 16 s.',icon:'range',rarity:'epic',mods:{},cooldown:16,distance:165,arcane:true},
  {id:'overwhelming',name:'Overwhelming Blink',description:'Al escapar, empuja y daña a rivales cercanos. Recarga: 18 s.',icon:'range',rarity:'epic',mods:{},cooldown:18,distance:165,blast:true}
 ]}
},
familyFor(id){for(const [family,definition] of Object.entries(this.families))if(id===family||definition.branches.some(branch=>branch.id===id))return family;return null},
current(p,family){return(p.dotaItems||[]).find(id=>this.familyFor(id)===family)||null},
options(p){const level=P.state.level;if(level<2||P.Coop?.active||P.Coop?.session)return[];const inventory=p.dotaItems||(p.dotaItems=[]),families=Object.entries(this.families),open=families.filter(([family])=>!this.current(p,family));let pool=[];
 if(inventory.length<this.capacity&&open.length){const [family,definition]=open[Math.floor(Math.random()*open.length)],item=definition.base;pool.push({id:'dota:base:'+family,title:item.name,description:item.description,icon:item.icon,rarity:item.rarity,badge:'DOTA 2 · OBJETO BASE',comparison:'Equipo '+(inventory.length+1)+' / '+this.capacity})}
 for(const [family,definition] of families){const owned=this.current(p,family);if(!owned||level<(family==='stick'?4:5)||owned!==family)continue;for(const item of definition.branches)if(!inventory.includes(item.id))pool.push({id:'dota:evolve:'+family+':'+item.id,title:item.name,description:item.description,icon:item.icon,rarity:item.rarity,evolve:true,badge:'DOTA 2 · EVOLUCIÓN',comparison:'Reemplaza '+definition.base.name+' en su espacio'})}
 return pool},
applyMods(p){p.dotaMods||={speed:1,rate:1,magnet:1};const old=p.dotaMods,next={speed:1,rate:1,magnet:1};for(const id of p.dotaItems||[]){const mods=this.data(id)?.mods||{};next.speed*=mods.speed||1;next.rate*=mods.rate||1;next.magnet*=mods.magnet||1}p.speed*=next.speed/old.speed;p.rate=Math.max(.14,p.rate*next.rate/old.rate);p.magnet*=next.magnet/old.magnet;p.dotaMods=next},
apply(p,id){p.dotaItems||=[];const parts=id.split(':');if(parts[1]==='base'){const family=parts[2],item=this.families[family]?.base;if(!item||p.dotaItems.length>=this.capacity||this.current(p,family))return false;p.dotaItems.push(family);this.applyMods(p);p.dotaCharges||={};p.dotaCooldowns||={};P.Loot.notify('Objeto adquirido · '+item.name);return true}
 if(parts[1]==='evolve'){const family=parts[2],branchId=parts[3],definition=this.families[family],branch=definition?.branches.find(item=>item.id===branchId);if(!branch||this.current(p,family)!==family)return false;const index=p.dotaItems.indexOf(family);p.dotaItems[index]=branchId;this.applyMods(p);P.Loot.notify('¡Evolucionó a '+branch.name+'!');return true}return false},
data(id){const family=this.familyFor(id),definition=this.families[family];return id===family?definition?.base:definition?.branches.find(item=>item.id===id)},
hit(p,source,damage){if(!p.dotaItems?.length)return;const stick=this.current(p,'stick'),item=stick&&this.data(stick);if(item?.charges){p.dotaCharges||={};p.dotaCharges.stick=Math.min(item.charges,(p.dotaCharges.stick||0)+1);if(p.hp>0&&p.hp<=p.maxHp*item.threshold&&p.dotaCharges.stick>=4){const amount=Math.min(p.maxHp-p.hp,p.maxHp*item.heal*p.dotaCharges.stick);p.hp+=amount;p.dotaCharges.stick=0;P.Loot.notify(item.name+' · +'+Math.ceil(amount)+' vida');P.Entities.burst(p.x,p.y,'#86dfcf')}}
 const blink=this.current(p,'blink'),data=blink&&this.data(blink);if(!data||p.hp<=0||p.hp>p.maxHp*.35||(p.dotaCooldowns?.blink||0)>0||damage<8)return;const dx=p.x-(source?.x??p.x-1),dy=p.y-(source?.y??p.y),length=Math.hypot(dx,dy)||1,distance=data.distance||145,old={x:p.x,y:p.y},tx=p.x+dx/length*distance,ty=p.y+dy/length*distance;if(!P.Terrain.clear(p.x,p.y,tx,ty,16))return;p.x=tx;p.y=ty;P.Terrain.resolve(p,old,16);p.inv=Math.max(p.inv||0,.95);p.dotaCooldowns||={};p.dotaCooldowns.blink=data.cooldown||18;p.dotaHaste=data.haste||0;P.Entities.burst(p.x,p.y,'#a8c8ff');if(data.arcane)P.state.fire=0;if(data.blast)for(const enemy of P.state.enemies)if(enemy.hp>0&&Math.hypot(enemy.x-p.x,enemy.y-p.y)<115)P.Entities.hurt(enemy,p.power*.8,32,P.Attributes.source(p,'physical'));P.Loot.notify('¡'+data.name+'!');P.UI.hud()},
tick(dt){const p=P.state.player;if(!p?.dotaItems?.length)return;p.dotaHaste=Math.max(0,(p.dotaHaste||0)-dt);for(const key of Object.keys(p.dotaCooldowns||{}))p.dotaCooldowns[key]=Math.max(0,p.dotaCooldowns[key]-dt);const boots=this.current(p,'boots'),item=boots&&this.data(boots);if(item?.heal&&P.state.elapsed-(p.hurtAt??-100)>5&&p.hp>0&&p.hp<p.maxHp)p.hp=Math.min(p.maxHp,p.hp+item.heal*dt)},
hud(){const node=P.$('#dota-inventory'),p=P.state.player;if(!node)return;const owned=(p?.dotaItems||[]).map(id=>this.data(id)).filter(Boolean);node.hidden=!owned.length;if(!owned.length){node.textContent='';return}const empty=this.capacity-owned.length;node.textContent='DOTA · '+owned.map(item=>item.name).join(' · ')+' · '+empty+' espacios libres';node.setAttribute('aria-label','Inventario Dota: '+owned.map(item=>item.name).join(', ')+'. '+empty+' espacios libres.')}
};
