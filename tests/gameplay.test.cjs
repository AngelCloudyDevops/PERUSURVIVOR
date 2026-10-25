const {test}=require('node:test');
test('Regresión: combate, progresión, mapas, portales y terreno',()=>{
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert');
const path=require('node:path'),root=path.resolve(__dirname,'..'),modules=require('../scripts/modules.cjs');
const elements=new Map(),events={},storage={};
const drawing=new Proxy({createRadialGradient:()=>({addColorStop(){}})}, {get(t,k){return t[k]||(()=>{})}});
function element(tag='div'){return {tag,children:[],style:{},hidden:false,dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(...c){this.children.push(...c)},replaceChildren(){this.children=[]},querySelector(){return this.children.find(c=>c.tag==='button')},focus(){},addEventListener(n,f){this[n]=f},getContext(){return drawing},setPointerCapture(){}}}
const context={console,Math,innerWidth:1280,innerHeight:800,devicePixelRatio:1,requestAnimationFrame(){},addEventListener(n,f){events[n]=f},localStorage:{getItem(k){return storage[k]},setItem(k,v){storage[k]=v}},document:{body:element(),querySelector(s){if(!elements.has(s))elements.set(s,element());return elements.get(s)},querySelectorAll(){return elements.get('#characters')?.children||[]},createElement:element}};
context.window=context;vm.createContext(context);
for(const m of modules)vm.runInContext(fs.readFileSync(path.join(root,m.source),'utf8'),context,{filename:m.source});
const P=context.P,s=P.state;
assert.equal(P.Data.characters.length,18);assert.equal(elements.get('#characters').children.length,18);
function target(x,y,hp=2000){return {x,y,hp,max:hp,r:13,speed:0,hit:0,boss:false,heavy:false}}
for(let i=0;i<18;i++){
 P.UI.select(i);P.Game.start();const p=s.player;
 assert.equal(p.id,P.Data.characters[i].id);
 let point=p.attack==='orbit'?P.Combat.orbitPoints(p,0)[0]:{x:p.x+90,y:p.y};
 const e=target(point.x,point.y);s.enemies=[e];P.Combat.cast();
 if(s.shots.length)for(let t=0;t<8;t++)P.Combat.tick(.04);
 assert(e.hp<2000,'Ataque no daña: '+p.name);
 P.World.render(100);console.log('OK ataque: '+p.name);
}
P.Game.start();const old=s.player.x;P.Core.keys.d=true;P.Game.update(.04);assert(s.player.x>old);
P.UI.pause();assert.equal(s.mode,'pause');const elapsed=s.elapsed;P.Game.update(.04);assert.equal(s.elapsed,elapsed);P.UI.pause();assert.equal(s.mode,'play');
s.xp=s.need;P.Systems.collect(0);assert.equal(s.mode,'upgrade');assert.equal(s.level,2);const btn=elements.get('#overlay').children.find(c=>c.tag==='button');btn.onclick();assert.equal(s.mode,'play');
P.UI.menu();P.Maps.select("plaza");P.Game.start();const p=s.player;p.x=0;p.y=80;P.World.collide(p,{x:0,y:95});assert(Math.hypot(p.x,p.y)>=90);
P.UI.select(P.Data.characters.findIndex(c=>c.attack==="clip"));P.Game.start();s.enemies=[target(s.player.x+150,s.player.y)];P.Combat.cast();let shot=s.shots[0];for(let i=0;i<15;i++)P.Combat.tick(.04);assert(shot.returning,'El micrófono debe regresar');
P.Game.start();s.player.hp=s.player.maxHp=999999;for(let i=0;i<7600;i++){if(s.mode==='upgrade'){elements.get('#overlay').children.find(c=>c.tag==='button').onclick()}P.Game.update(.04)}assert(s.bossSpawned);const boss=s.enemies.find(e=>e.boss);assert(boss);P.Entities.hurt(boss,999999);assert.equal(s.mode,'end');assert(storage['causas-best']);
P.Game.start();s.player.hp=1;s.enemies=[target(s.player.x,s.player.y)];P.Game.update(.04);assert.equal(s.mode,'end');P.UI.menu();assert.equal(s.mode,'menu');P.World.render(100);
assert.equal(P.Data.boss.id,'zein');assert(!P.Data.characters.some(c=>c.id==='zein'));
P.Game.start();const bossAttack=P.Entities.enemy(true);bossAttack.x=s.player.x+250;bossAttack.y=s.player.y;bossAttack.attackT=0;s.enemies=[bossAttack];P.Systems.move(.01);assert.equal(s.danger.length,5,'El jefe debe disparar cinco proyectiles');const hpBefore=s.player.hp;s.danger=[{...s.danger[0],x:s.player.x,y:s.player.y}];P.Combat.tick(0);assert.equal(s.player.hp,hpBefore-14,'Los proyectiles del jefe deben hacer daño');
for(const name of ['causas-atlas-v1.png','streamers-atlas-v1.png']){const png=fs.readFileSync(root+'/public/assets/characters/'+name);assert.equal(png.toString('hex',0,8),'89504e470d0a1a0a')}
P.Game.start();const designs=new Set(Array.from({length:6},()=>P.Entities.enemy().design));assert.equal(designs.size,6,'Deben aparecer los cinco Backyardigans y la PNP');
P.Game.start();const walker=P.Entities.enemy();walker.x=s.player.x+200;walker.y=s.player.y;s.enemies=[walker];const startX=walker.x,startY=walker.y;P.Systems.move(.04);assert(walker.moving);assert(Math.abs(walker.walkPhase-Math.hypot(walker.x-startX,walker.y-startY)/(walker.heavy?10:8))<1e-9,'Pasos ligados al recorrido real');assert.equal(walker.facing,-1);const phase=walker.walkPhase;walker.speed=0;P.Systems.move(.04);assert(!walker.moving);assert.equal(walker.walkPhase,phase);assert.equal(P.EnemyArt.gait(walker).lift,0);assert.equal(P.EnemyArt.gait(walker).step,0);for(let design=0;design<6;design++){P.EnemyArt.ready=true;P.EnemyArt.image={};P.EnemyArt.cells[design]=[{sx:0,sy:0,w:80,h:120},{sx:80,sy:0,w:80,h:120}];for(const walkPhase of [0,Math.PI/2,Math.PI,Math.PI*1.5])assert(P.EnemyArt.draw(drawing,{...walker,design,moving:true,walkPhase}));}P.EnemyArt.ready=false;
console.log('OK: seis diseños de rivales, pasos por distancia y reposo.');
console.log('OK: ElZeein como jefe, ráfaga hostil y archivos PNG.');
console.log('OK: movimiento, pausa, mejora, colisión de fuente, bumerán, simulación de cinco minutos, jefe, victoria, derrota y retorno al menú.');
for(const map of P.Maps.catalog){
 P.UI.menu();P.Maps.select(map.id);P.Game.start();assert.equal(s.player.x,map.spawn.x);assert.equal(s.player.y,map.spawn.y);
 const old={x:s.player.x,y:s.player.y};s.player.x=99999;s.player.y=-99999;P.World.collide(s.player,old);assert.equal(s.player.x,99999);assert.equal(s.player.y,-99999);
 const selected=P.Maps.selected;P.Maps.select('invalid');assert.equal(P.Maps.selected,selected);P.World.render(100);
 const png=fs.readFileSync(root+'/public/assets/maps/'+map.id+'-v1.png');assert.equal(png.toString('hex',0,8),'89504e470d0a1a0a');
 console.log('OK mapa: '+map.name+' / aparición, límites, dibujo y PNG')
}
P.UI.menu();P.Maps.select('plaza');P.Game.start();const f=P.Maps.current().fountain;s.player.x=0;s.player.y=f.y+10;P.Maps.collide(s.player,{x:0,y:220});assert(Math.hypot((s.player.x-f.x)/f.rx,(s.player.y-f.y)/f.ry)>=.999);
P.UI.menu();P.Maps.select('campo');P.Game.start();s.player.x=0;s.player.y=0;P.Maps.collide(s.player,{x:0,y:10});assert.equal(s.player.y,0,'Campo de Marte no debe conservar la fuente');

for(const map of P.Maps.catalog){
 P.UI.menu();P.Maps.select(map.id);P.Game.start();
 s.mapTime=179.99;P.Encounters.tick();assert(!s.portal.open,'No abrir antes de 3:00');
 s.mapTime=180;P.Encounters.tick();assert(s.portal.open);const pos=P.Encounters.definition().portal;
 P.Encounters.offer();assert.equal(s.mode,'play','No ofrecer a distancia');
 s.player.x=pos.x;s.player.y=pos.y;const normal=target(600,300);s.enemies=[normal];s.gems=[{x:700,y:200,value:2}];
 P.Encounters.offer();assert.equal(s.mode,'portal');elements.get('#overlay').children.find(c=>c.tag==='button'&&c.textContent==='Seguir entrenando').onclick();assert.equal(s.mode,'play');assert(s.portal.open);
 P.Encounters.offer();elements.get('#overlay').children.find(c=>c.tag==='button').onclick();assert(s.encounter);assert(s.enemies[0].mapBoss);assert.equal(s.enemies.length,1);
 const clock=s.mapTime,normalX=normal.x;P.Game.update(.04);assert.equal(s.mapTime,clock);assert.equal(normal.x,normalX);assert(!s.bossSpawned);
 const localBoss=s.enemies[0];localBoss.attackT=0;P.Encounters.bossMove(localBoss,.01);assert.equal(localBoss.phase,'warning');P.Encounters.bossMove(localBoss,1.2);
 if(map.id==='campo')assert.equal(localBoss.phase,'charge');else assert(s.danger.length>0);
 s.player.x=9999;s.player.y=-9999;P.World.collide(s.player,{x:0,y:220});assert(s.player.x<=s.encounter.scene.bounds.right&&s.player.y>=s.encounter.scene.bounds.top);
 P.World.render(500);P.Entities.hurt(localBoss,99999);assert.equal(s.mode,'play');P.Loot.open(P.Loot.chests.find(c=>c.gold));P.Loot.advance(.7);assert.equal(s.mode,'reward');assert(!s.encounter);assert.equal(s.enemies[0],normal);assert.equal(s.player.x,pos.x);assert.equal(s.player.y,pos.y);assert(s.portal.cleared);assert(!s.bossSpawned);
 const power=s.player.power;elements.get('#overlay').children.find(c=>c.tag==='button').onclick();assert.equal(s.mode,'play');assert.equal(s.player.power,power*1.3);P.Encounters.reward(()=>s.player.power=0);assert(s.player.power>0,'No repetir recompensa');
 P.Game.update(.04);assert(s.mapTime>clock);assert(!s.portal.open);
 s.mapTime=300;P.Game.update(.01);assert(s.bossSpawned);assert.equal(s.enemies.filter(e=>e.boss).length,1);P.Game.update(.01);assert.equal(s.enemies.filter(e=>e.boss).length,1);assert(!s.portal.open);
 console.log('OK portal: '+map.name+' / 3:00, distancia, declinar, arena, aviso, recompensa única, retorno y ElZeein');
}
P.Game.start();s.mapTime=300;P.Game.update(.01);assert(s.bossSpawned);assert(!s.portal.open);assert(!s.portal.cleared);console.log('OK: ignorar portal mantiene el jefe final obligatorio');
P.Game.start();s.mapTime=180;P.Encounters.tick();const entrance=P.Encounters.definition().portal;s.player.x=entrance.x;s.player.y=entrance.y;P.Encounters.offer();P.Encounters.enter();s.player.hp=1;s.player.inv=0;s.enemies[0].x=s.player.x;s.enemies[0].y=s.player.y;P.Game.update(.01);assert.equal(s.mode,'end');P.Game.start();assert(!s.encounter);assert.equal(s.mapTime,0);assert(!s.portal.cleared);console.log('OK: derrota en arena y reinicio limpio');

for(const map of P.Maps.catalog){
 P.UI.menu();P.Maps.select(map.id);P.Game.start();assert(P.Terrain.props.length>=10);
 const obstacle=P.Terrain.props.find(o=>o.kind==='bench'||o.kind==='wall');const start={x:obstacle.x-obstacle.w/2-30,y:obstacle.y};const body={x:obstacle.x-obstacle.w/2+3,y:obstacle.y};P.Terrain.resolve(body,start,14);assert(body.x<=obstacle.x-obstacle.w/2-14,'No atravesar obstáculos');
 const box=P.Terrain.props.find(o=>o.kind==='crate');P.Terrain.damage(box,60);assert(!box.solid);assert(s.gems.some(g=>g.kind==='heal'));
 P.Game.start();assert(P.Terrain.props.filter(o=>o.kind==='crate').every(o=>o.solid&&o.hp===55));
 const wall=P.Terrain.props.find(o=>o.kind==='bench'||o.kind==='wall');s.player.x=wall.x;s.player.y=wall.y-150;s.enemies=[target(wall.x,wall.y+150)];const walker=s.enemies[0];walker.speed=110;const initial=Math.hypot(walker.x-s.player.x,walker.y-s.player.y);for(let i=0;i<300;i++)P.Systems.move(.04);assert(Math.hypot(walker.x-s.player.x,walker.y-s.player.y)<initial/2,'El enemigo debe rodear el obstáculo');
 console.log('OK terreno: '+map.name+' / colisión, cajas, reinicio y ruta enemiga');
}
P.UI.menu();P.Maps.select('campo');P.Game.start();const box=P.Terrain.props.find(o=>o.kind==='crate');s.player.x=box.x-100;s.player.y=box.y;s.player.power=100;s.player.attack='emotes';const covered=target(box.x+90,box.y);s.enemies=[covered];s.fire=999;P.Combat.cast();for(let i=0;i<6;i++)P.Combat.tick(.04);assert(!box.solid);assert.equal(covered.hp,2000,'Las cajas deben bloquear los proyectiles');
s.encounter={};assert.equal(P.Terrain.active().length,0,'Las arenas del portal no heredan obstáculos');
console.log('OK cobertura y compatibilidad con arenas de portales');
for(const map of P.Maps.catalog){
 P.UI.menu();P.Maps.select(map.id);P.Game.start();const far={x:12100,y:-13200};s.player.x=far.x;s.player.y=far.y;P.Chunks.sync();P.World.collide(s.player,far);assert.equal(s.player.x,far.x);assert.equal(s.player.y,far.y);const camera=P.Maps.camera(18000,-22000,1000,700);assert.equal(camera.x,18000);assert.equal(camera.y,-22000);
 const c=P.Chunks.get(20,-24),snapshot=JSON.stringify(c.props.map(o=>[o.id,o.kind,o.x,o.y]));P.Chunks.cache.delete(c.key);assert.equal(JSON.stringify(P.Chunks.get(20,-24).props.map(o=>[o.id,o.kind,o.x,o.y])),snapshot,'Generación determinista');
 let crate;for(let cy=20;cy<30&&!crate;cy++)for(let cx=20;cx<30&&!crate;cx++)crate=P.Chunks.get(cx,cy).props.find(o=>o.kind==='crate');assert(crate,'Hay cajas fuera de la zona inicial');P.Terrain.damage(crate,60);const key=crate.id.split(':')[1],coords=key.split(',').map(Number);P.Chunks.cache.delete(key);assert(!P.Chunks.get(...coords).props.find(o=>o.id===crate.id).solid,'No reaparece una caja destruida al volver');
 for(let i=0;i<80;i++){s.player.x=i*620;s.player.y=-i*580;P.Chunks.sync();assert(P.Chunks.cache.size<=81,'Caché de sectores acotada')}
 const origin=P.Terrain.props[0];s.player.x=0;s.player.y=0;P.Chunks.sync();assert(P.Terrain.props.some(o=>o===origin)||P.Terrain.originProps.includes(origin));
 console.log('OK infinito: '+map.name+' / coordenadas lejanas, cámara, determinismo, memoria y cajas persistentes')
}




for(const map of P.Maps.catalog){
 P.UI.menu();P.Maps.select(map.id);P.Game.start();s.mapTime=180;P.Encounters.tick();const point=P.Encounters.definition().portal;s.player.x=point.x;s.player.y=point.y;P.Encounters.offer();P.Encounters.enter();
 assert(s.encounter.scene);assert.notEqual(P.BossArt.sceneId(),map.id,'El portal debe seleccionar otra escena');
 const originalMapDraw=P.Maps.draw;let originDraws=0;P.Maps.draw=()=>originDraws++;P.World.render(700);P.Maps.draw=originalMapDraw;assert.equal(originDraws,0,'No se debe dibujar el mapa de origen detrás de la arena');
 assert.equal(P.Terrain.active().length,4);
 const local=s.enemies[0];local.phase='warning';assert.equal(P.BossArt.frame(local),3);local.phase='charge';assert.equal(P.BossArt.frame(local),4);local.phase='recover';local.attackUntil=0;assert.equal(P.BossArt.frame(local),5);
 local.phase='warning';local.windup=.01;P.Encounters.bossMove(local,.02);if(local.kind!=='combi'){assert.equal(local.phase,'recover');assert.equal(P.BossArt.frame(local),4);s.elapsed+=.3;assert.equal(P.BossArt.frame(local),5)}
 const png=fs.readFileSync(path.join(root,'public/assets/arenas/'+s.encounter.scene.asset+'-v1.png'));assert.equal(png.toString('hex',0,8),'89504e470d0a1a0a');
 P.Entities.hurt(local,99999);assert(!s.encounter);assert.equal(P.BossArt.sceneId(),map.id);P.Loot.open(P.Loot.chests.find(c=>c.gold));P.Loot.advance(.7);P.Encounters.reward(()=>{});console.log('OK arte y escena: '+map.name)
}
const bossPng=fs.readFileSync(path.join(root,'public/assets/bosses/boss-atlas-v1.png'));assert.equal(bossPng.toString('hex',0,8),'89504e470d0a1a0a');
P.Game.start();s.mapTime=180;P.Encounters.tick();const uiPoint=P.Encounters.definition().portal;s.player.x=uiPoint.x;s.player.y=uiPoint.y;elements.get('#portal-enter').hidden=true;P.UI.hud();assert.equal(elements.get('#portal-enter').hidden,false,'El HUD debe mostrar el botón cercano');s.player.x=-900;P.UI.hud();assert.equal(elements.get('#portal-enter').hidden,true,'El HUD oculta el botón lejano');console.log('OK: botón de portal conectado al HUD');

for(const map of P.Maps.catalog){
 P.UI.menu();P.Maps.select(map.id);P.Game.start();
 assert(P.Loot.chests.length>0&&P.Loot.chests.length<=9);assert(P.Loot.chests.every(c=>!P.Terrain.hit(c.x,c.y,28)));
 const crate=P.Terrain.props.find(o=>o.kind==='crate');P.Terrain.damage(crate,999);const drops=s.gems.length;assert(s.gems.some(g=>g.kind==='heal'));assert(s.gems.some(g=>!g.kind));P.Terrain.damage(crate,999);assert.equal(s.gems.length,drops,'No duplicar botín de una caja destruida');
 const chest=P.Loot.chests.find(c=>c.rarity==='common');s.player.x=chest.x;s.player.y=chest.y;s.player.moving=true;P.Loot.tick(1);assert.equal(chest.progress,0);
 s.player.moving=false;P.Loot.tick(.9);assert(!chest.opened);s.player.x+=150;P.Loot.tick(.1);assert.equal(chest.progress,0);
 s.player.x=chest.x;s.player.y=chest.y;P.Loot.tick(1.81);assert.equal(s.mode,'loot-opening');P.Loot.advance(.7);assert(chest.opened);assert.equal(s.mode,'item');elements.get('#overlay').children.filter(c=>c.tag==='button')[1].onclick();assert.equal(s.mode,'play');assert(!s.player.equipment);P.Loot.open(chest);assert.equal(s.mode,'play','Un cofre abierto no vuelve a dar objetos');
 P.Game.start();assert(P.Loot.chests.every(c=>!c.opened));assert.equal(s.coins,0);
 console.log('OK botín de mapa: '+map.name)
}
P.Game.start();const player=s.player,originalRate=player.rate,originalMagnet=player.magnet;
assert(P.Loot.equip('magnet'));assert.equal(player.magnet,originalMagnet*1.6);assert(!P.Loot.equip('magnet'));assert.equal(player.magnet,originalMagnet*1.6);
assert(P.Loot.equip('battery'));assert.equal(player.magnet,originalMagnet);assert.equal(player.rate,originalRate*.85);
player.rate*=.82;assert(P.Loot.equip('vest'));assert(Math.abs(player.rate-originalRate*.82)<1e-10,'Reemplazar equipo conserva mejoras de nivel');assert.equal(P.Loot.damage(player,25),20);
P.Loot.equip('magnet');assert.equal(P.Loot.damage(player,25),25);
P.Loot.equip('vest');player.hp=player.maxHp-1;P.Loot.use('emoliente');assert.equal(player.hp,player.maxHp);assert.equal(player.equipment,'vest','La bebida no reemplaza el accesorio');
const coin={x:player.x,y:player.y,kind:'coin',value:5};s.gems=[coin];const xp=s.xp;P.Systems.collect(0);assert.equal(s.coins,5);assert.equal(s.xp,xp,'Las monedas no son experiencia');
P.Game.start();s.mapTime=180;P.Encounters.tick();const portal=P.Encounters.definition().portal;s.player.x=portal.x;s.player.y=portal.y;P.Encounters.offer();P.Encounters.enter();const frozen=P.Loot.chests.map(c=>c.progress);P.Loot.tick(3);assert.equal(P.Loot.active().length,0);assert.deepEqual(P.Loot.chests.map(c=>c.progress),frozen);
P.Entities.hurt(s.enemies[0],99999);assert.equal(s.mode,'play');const gold=P.Loot.chests.find(c=>c.gold);assert(gold);P.Loot.bossChest(()=>{});assert.equal(P.Loot.chests.filter(c=>c.gold).length,1);
s.player.x=gold.x;s.player.y=gold.y;s.player.moving=false;P.Loot.tick(1.81);assert.equal(s.mode,'loot-opening');P.Loot.advance(.7);assert.equal(s.mode,'reward');const before=s.player.power;elements.get('#overlay').children.find(c=>c.tag==='button').onclick();assert.equal(s.player.power,before*1.3);P.Loot.open(gold);assert.equal(s.mode,'play');assert.equal(s.player.power,before*1.3);
P.Game.start();assert.equal(s.player.equipment,null);assert.equal(s.player.equipmentReduction,0);assert(!P.Loot.bossDropped);console.log('OK equipo, curación, monedas, cofre de jefe y reinicio');


P.Game.start();s.enemies=[];const singleBox=P.Terrain.props.find(o=>o.kind==='crate');s.player.x=singleBox.x-70;s.player.y=singleBox.y;s.player.power=100;P.Combat.cast();assert(s.shots.length>0,'Se debe poder atacar cajas sin enemigos');s.fire=999;for(let i=0;i<7;i++)P.Combat.tick(.04);assert(!singleBox.solid);
P.Game.start();s.enemies=[];s.player.attack='orbit';s.player.power=100;const orbitBox=P.Terrain.props.find(o=>o.kind==='crate');s.player.x=orbitBox.x-100;s.player.y=orbitBox.y;P.Combat.cast();assert(!orbitBox.solid,'Los ataques orbitales también rompen cajas');
P.Game.start();P.Loot.equip('vest');s.player.hp=100;s.player.inv=0;s.enemies=[target(s.player.x,s.player.y)];P.Systems.move(.01);assert.equal(s.player.hp,92,'El chaleco reduce daño real de contacto');console.log('OK: cajas sin enemigos, ataques orbitales y reducción real de daño');



function usePower(id){P.UI.menu();P.UI.select(P.Data.characters.findIndex(c=>c.id===id));P.Game.start();P.Terrain.props=[];s.player.x=0;s.player.y=0;s.fire=999;s.enemies=[];return s.player}
function enemyAtAngle(deg,distance=100){const a=deg*Math.PI/180;return target(Math.cos(a)*distance,Math.sin(a)*distance,2000)}
let fighter=usePower('g5');s.enemies=[target(45,0),enemyAtAngle(72),enemyAtAngle(73),target(-95,0),target(170,0)];const victims=[...s.enemies];P.Combat.cast();assert.equal(s.shots.length,0);assert(victims[0].hp<2000);assert(victims[1].hp<2000);assert.equal(victims[2].hp,2000);assert.equal(victims[3].hp,2000);assert.equal(victims[4].hp,2000);assert(Math.abs(s.effects.find(e=>e.kind==='kick').arc-145*Math.PI/180)<1e-9);
fighter=usePower('g5');s.enemies=[target(500,0)];assert.equal(P.Combat.cast(),false);assert.equal(s.effects.length,0);
for(const [id,count,glyph] of [['kingteka',5,'BULLET'],['cerdito',7,'BULLET'],['najasor',3,'FISH'],['cevichero',2,'ROACH'],['sustento',1,'ROACH'],['shaka',2,'BANANA']]){
 usePower(id);s.enemies=[target(400,0)];P.Combat.cast();assert.equal(s.shots.length,count);assert(s.shots.every(shot=>shot.glyph===glyph));if(id==='najasor'){assert.equal(s.effects.filter(e=>e.kind==='shout'&&e.text==='CPEZ').length,1);P.Combat.cast();assert.equal(s.effects.filter(e=>e.kind==='shout').length,2)}
 if(id==='cevichero'||id==='sustento'){const shot=s.shots[0],oldY=shot.y,vy=shot.vy;P.Combat.tick(.08);assert(Math.abs(shot.y-oldY-vy*.08)>1,'Las cucarachas deben zigzaguear')}
}
usePower('fuzo');s.enemies=[target(40,0)];P.Combat.cast();s.shots=[s.shots[0]];const card=s.shots[0];s.enemies=[40,80,120,160].map(d=>target(Math.cos(card.angle)*d,Math.sin(card.angle)*d));const line=[...s.enemies];P.Combat.tick(.3);assert(line.slice(0,3).every(e=>e.hp<2000));assert.equal(line[3].hp,2000);assert.equal(s.shots.length,0);
usePower('charles');s.enemies=[target(100,0)];P.Combat.cast();P.Combat.tick(.4);assert.equal(s.fields.length,1);const cloud=s.fields[0],inside=target(cloud.x,cloud.y),outside=target(cloud.x+150,cloud.y);s.enemies=[inside,outside];P.Combat.tick(.41);assert(inside.hp<2000);assert.equal(outside.hp,2000);
s.mapTime=180;P.Encounters.tick();const door=P.Encounters.definition().portal;s.player.x=door.x;s.player.y=door.y;P.Encounters.offer();P.Encounters.enter();assert.equal(s.fields.length,0,'No llevar nubes a la arena');P.Entities.hurt(s.enemies[0],99999);assert.equal(s.fields.length,0,'No traer nubes de vuelta');
usePower('cevichero');P.Data.upgrades.find(u=>u.id==='projectiles').apply(s.player);s.enemies=[target(400,0)];P.Combat.cast();assert.equal(s.shots.length,3);
usePower('g5');const previousPower=s.player.power;P.Data.upgrades.find(u=>u.id==='projectiles').apply(s.player);assert(s.player.power>previousPower);assert.equal(s.player.projectileBonus||0,0);
usePower('kingteka');s.enemies=[target(60,0)];s.enemies[0].r=3;const narrow=s.enemies[0];P.Combat.cast();P.Combat.tick(.1);assert(narrow.hp<2000,'Las balas rápidas deben usar colisión de segmento');
for(const c of P.Data.characters)assert(P.Data.attacks[c.attack],'Todos los personajes necesitan un ataque válido');
const powerPng=fs.readFileSync(path.join(root,'public/assets/characters/powers-atlas-v1.png'));assert.equal(powerPng.toString('hex',0,8),'89504e470d0a1a0a');
console.log('OK poderes: arco 145°, alcance melee, escopetas, CPEZ, zigzag, penetración, nubes, portales y mejoras');


const recordBeforeLab=P.Save.best;
for(const bossId of ['campo','plaza','machu','final']){
 P.$('#lab-boss').value=bossId;P.$('#lab-invincible').checked=true;P.Lab.run();assert(s.devRun);assert.equal(s.enemies.length,1);assert(!elements.get('#lab-tools').hidden);
 if(bossId==='final'){assert(s.bossSpawned);assert(s.enemies[0].boss)}else{assert(s.encounter);assert(s.enemies[0].mapBoss);assert.equal(s.encounter.definition,P.Encounters.catalog[bossId])}
 const hp=s.player.hp;const boss=s.enemies[0];boss.x=s.player.x;boss.y=s.player.y;for(let i=0;i<10;i++)P.Game.update(.04);assert.equal(s.player.hp,hp,'Invencible durante prueba');assert.equal(s.enemies.length,1,'No añadir oleadas en laboratorio');
 P.Entities.hurt(boss,999999);assert.equal(s.mode,'end');assert.equal(P.Save.best,recordBeforeLab,'No guardar récords de desarrollo');P.Lab.run();assert(s.devRun);assert.equal(s.player.hp,s.player.maxHp);P.UI.menu();assert(!s.devRun);assert(elements.get('#lab-tools').hidden);
 console.log('OK laboratorio: '+bossId)
}
P.$('#lab-boss').value='campo';P.$('#lab-invincible').checked=false;P.Lab.run();s.player.inv=0;s.enemies[0].x=s.player.x;s.enemies[0].y=s.player.y;const vulnerableHp=s.player.hp;P.Game.update(.04);assert(s.player.hp<vulnerableHp);P.UI.menu();P.Game.start();assert(!s.devRun);assert(!s.encounter);assert.equal(s.mapTime,0);console.log('OK: invencibilidad opcional y retorno al modo normal');




P.UI.select(P.Data.characters.findIndex(c=>c.id==='kingteka'));P.Game.start();
assert.equal(P.Ultimate.activate(),false);for(let i=0;i<20;i++)P.Ultimate.gain();assert.equal(s.ultimate.charge,100);
const baseSpeed=s.player.speed,baseRate=s.player.rate;assert(P.Ultimate.activate());assert.equal(P.Ultimate.activate(),false);assert(P.Ultimate.active());const weak=target(s.player.x+60,s.player.y,100),strong={...target(s.player.x+60,s.player.y,100),boss:true};P.Entities.hurt(weak,10);P.Entities.hurt(strong,10);assert.equal(weak.hp,80);assert.equal(strong.hp,90);P.Ultimate.tick(.01);P.Ultimate.draw(drawing);
s.enemies=[target(s.player.x+80,s.player.y)];s.fire=0;P.Combat.tick(0);assert.equal(s.fire,baseRate/2);
assert(P.Ultimate.bird(drawing,s.enemies[0]));assert.equal(P.Ultimate.bird(drawing,{boss:true}),false);assert.equal(P.Ultimate.bird(drawing,{mapBoss:true}),false);
P.UI.pause();const remaining=s.ultimate.left;P.Game.update(1);assert.equal(s.ultimate.left,remaining);P.UI.pause();P.Ultimate.tick(8);assert(!P.Ultimate.active());assert.equal(s.ultimate.paper,2.6);P.Ultimate.draw(drawing);assert.equal(s.player.speed,baseSpeed);assert.equal(s.player.rate,baseRate);
P.Ultimate.tick(1);assert(s.ultimate.stampHit);assert(s.ultimate.particles.some(p=>p.kind==='stamp'));P.Ultimate.draw(drawing);P.Ultimate.hit({ultimate:true},s.enemies[0]);assert(s.ultimate.impacts.length);assert.equal(s.enemies[0].ultiFlash,.12);P.Ultimate.tick(3);assert.equal(s.ultimate.impacts.length,0);assert.equal(s.ultimate.paper,0);P.Game.start();assert.equal(s.ultimate.left,0);assert.equal(s.ultimate.charge,0);
P.UI.select(P.Data.characters.findIndex(c=>c.id==='g5'));P.Game.start();s.ultimate.charge=100;assert.equal(P.Ultimate.activate(),false);
console.log('OK ulti: carga, activación única, cadencia, gallinazos, jefes, pausa, denuncia y reinicio');

P.UI.select(P.Data.characters.findIndex(c=>c.id==='kingteka'));P.Game.start();const sounds=[],playAudio=P.Audio.play;P.Audio.play=k=>sounds.push(k);s.ultimate.charge=100;P.Ultimate.activate();assert(sounds.includes('flap'));P.Ultimate.shot();assert(sounds.includes('shot'));s.enemies=[target(100,100)];P.Ultimate.tick(.01);const flapCount=sounds.filter(k=>k==='flap').length;P.Ultimate.tick(.01);assert.equal(sounds.filter(k=>k==='flap').length,flapCount);P.Ultimate.tick(8);P.Ultimate.tick(1);assert.equal(sounds.filter(k=>k==='stamp').length,1);P.Ultimate.tick(.1);assert.equal(sounds.filter(k=>k==='stamp').length,1);P.Audio.play=playAudio;P.Audio.unlock();P.Audio.play('shot');
console.log('OK audio: aleteo, escopeta, sello único y entorno sin AudioContext');

const alphaFixture=new Uint8Array(10*10*4);for(let y=1;y<=3;y++)for(let x=1;x<=3;x++)alphaFixture[(y*10+x)*4+3]=255;alphaFixture[(9*10+9)*4+3]=255;
const cut=P.BossArt.mainBounds(alphaFixture,10,0,0,10,10);assert.equal(cut.x,1);assert.equal(cut.y,1);assert.equal(cut.w,3);assert.equal(cut.h,3);
P.$('#lab-boss').value='campo';P.Lab.run();const charger=s.enemies[0],arenaBounds=s.encounter.scene.bounds;charger.phase='charge';charger.dx=1;charger.dy=1;charger.windup=1;charger.x=arenaBounds.right-1;charger.y=arenaBounds.bottom-1;P.Encounters.bossMove(charger,.04);assert(charger.x<=arenaBounds.right-charger.r);assert(charger.y<=arenaBounds.bottom-charger.r);assert.equal(charger.phase,'recover');
P.World.render(800);assert(P.Terrain.zoom>=1.05);assert(arenaBounds.right<900&&arenaBounds.bottom<500);P.UI.menu();P.Game.start();P.World.render(900);assert(P.Terrain.zoom>=1.3);console.log('OK: cámara amplia de exploración, arena compacta, embestida dentro de límites y recorte sin vecinos');


for(const map of ['campo','plaza','machu']){P.$('#lab-boss').value=map;P.Lab.run();const covers=P.Terrain.active();assert.equal(covers.length,4);assert(!P.Terrain.hit(s.player.x,s.player.y,14));assert(!P.Terrain.hit(s.enemies[0].x,s.enemies[0].y,s.enemies[0].r));const o=covers[0],body={x:o.x,y:o.y};P.Terrain.resolve(body,{x:o.x-200,y:o.y},14);assert(!P.Terrain.hit(body.x,body.y,13));assert(!P.Terrain.clear(o.x-200,o.y,o.x+200,o.y));s.fire=100;s.player.inv=0;s.player.x=o.x+20;s.player.y=o.y;s.danger=[{x:o.x-90,y:o.y,vx:1000,vy:0,age:0,life:5,history:[]}];const hp=s.player.hp;P.Combat.tick(.08);assert.equal(s.danger.length,0);assert.equal(s.player.hp,hp);if(map==='campo'){const e=s.enemies[0];e.x=o.x-o.w/2-e.r-2;e.y=o.y;e.dx=1;e.dy=0;e.phase='charge';e.windup=1;P.Encounters.bossMove(e,.04);assert.equal(e.phase,'recover');assert(!P.Terrain.hit(e.x,e.y,e.r-1))}P.World.render(1000)}
P.UI.menu();P.Game.start();assert(!P.Terrain.active().some(o=>String(o.id).startsWith('arena:')));console.log('OK cobertura: bloqueo de movimiento, proyectiles, embestida y retorno limpio');

P.UI.menu();P.Maps.select('campo');P.Game.start();
const animatedChest=P.Loot.chests.find(c=>c.rarity==='common'),clockBeforeOpen=s.mapTime,healthBeforeOpen=s.player.hp;
P.Loot.open(animatedChest);assert.equal(s.mode,'loot-opening');assert.equal(animatedChest.openAge,0);
P.Game.update(.16);assert.equal(s.mode,'loot-opening');assert(animatedChest.openAge>=.16);assert.equal(s.mapTime,clockBeforeOpen);assert.equal(s.player.hp,healthBeforeOpen);
P.UI.pause();assert.equal(s.mode,'loot-opening','La pausa no interrumpe la apertura');
P.Loot.open(animatedChest);P.Game.update(.49);assert.equal(s.mode,'item');assert.equal(P.Loot.pending,null);
const choices=elements.get('#overlay').children.length;P.Loot.advance(1);assert.equal(elements.get('#overlay').children.length,choices,'Revelar premio una sola vez');
P.Game.start();const animatedBox=P.Terrain.props.find(o=>o.kind==='crate');P.Terrain.damage(animatedBox,999);assert.equal(P.Loot.debris.length,1);P.Loot.tick(.9);assert.equal(P.Loot.debris.length,0);P.Game.start();assert.equal(P.Loot.pending,null);assert.equal(P.Loot.debris.length,0);
console.log('OK animación de botín: fases, reloj congelado, premio único, escombros y reinicio');

for(const map of P.Maps.catalog){P.UI.menu();P.Maps.select(map.id);P.Game.start();assert(P.Loot.chests.every(c=>c.rarity!=='legendary'||Math.hypot(c.x-P.Loot.spawn.x,c.y-P.Loot.spawn.y)>=1800));for(const tier of ['common','rare','legendary']){const c={...P.Loot.chests.find(c=>c.rarity==='common'),id:'test-'+tier,opened:false,rarity:tier};P.Loot.chests.push(c);if(tier!=='common')s.keys[tier]=1;assert(!P.Terrain.hit(c.x,c.y,28));P.Loot.open(c);assert.equal(s.mode,'loot-opening');P.Loot.advance(.7);assert.equal(s.mode,'item');assert.equal(P.Loot.items[c.item].rarity,tier,'El premio debe coincidir con la rareza');elements.get('#overlay').children.filter(c=>c.tag==='button')[1].onclick();assert.equal(s.mode,'play')}}
for(const base of ['magnet','vest','battery']){const common=P.Loot.items[base],rare=P.Loot.items[base+'_rare'],legend=P.Loot.items[base+'_legendary'];assert.equal(rare.base,base);assert.equal(legend.base,base);if(base==='battery')assert(legend.rate<rare.rate&&rare.rate<common.rate);else{const stat=base==='vest'?'reduction':'magnet';assert(legend[stat]>rare[stat]&&rare[stat]>common[stat])}}
P.Game.start();const rarityPlayer=s.player,rarityBaseMagnet=rarityPlayer.magnet,rarityBaseRate=rarityPlayer.rate;P.Loot.equip('magnet_rare');assert.equal(rarityPlayer.magnet,rarityBaseMagnet*2);P.Loot.equip('magnet_legendary');assert.equal(rarityPlayer.magnet,rarityBaseMagnet*2.6);P.Loot.equip('battery_legendary');assert(Math.abs(rarityPlayer.magnet-rarityBaseMagnet)<1e-9);rarityPlayer.rate*=.82;P.Loot.equip('vest_legendary');assert(Math.abs(rarityPlayer.rate-rarityBaseRate*.82)<1e-9);assert.equal(P.Loot.damage(rarityPlayer,100),60);assert(!P.Loot.equip('vest_legendary'));rarityPlayer.hp=1;P.Loot.use('emoliente_legendary');assert.equal(rarityPlayer.hp,rarityPlayer.maxHp);assert.equal(rarityPlayer.equipment,'vest_legendary');P.Game.start();assert.equal(s.player.equipment,null);
console.log('OK rarezas: cofres seguros por mapa, premios por nivel, balance creciente y reemplazo reversible');
assert.equal(P.World.zoomFor(1920,1080,true,true),2.25);assert.equal(P.World.zoomFor(1280,720,true,true),1.5);assert.equal(P.World.zoomFor(1920,1080,true,false),1.9500000000000002);assert.equal(P.World.zoomFor(1280,720,true,false),1.3);assert.equal(P.World.zoomFor(390,844,true,false),.95);for(const [w,h] of [[1920,1080],[1280,720],[390,844]]){const zoom=P.World.zoomFor(w,h,true,true);for(const x of [-680,680])for(const y of [-360,360]){const c=P.BossArt.camera({x,y},w/zoom,h/zoom);assert(Math.abs(x-c.x)<w/zoom/2-14);assert(Math.abs(y-c.y)<h/zoom/2-14)}}console.log('OK zoom responsivo y jugador visible en extremos de arena');
assert(P.BossArt.draw.toString().includes('ctx.drawImage(this.image'),'Los jefes deben usar sus sprites detallados');assert(P.BossArt.background.toString().includes('ctx.drawImage(art'),'Las arenas deben conservar sus fondos originales');

P.UI.menu();P.Maps.select('campo');P.Game.start();const lootSeed=P.Loot.seed,initialLoot=JSON.stringify(P.Loot.chests.map(c=>[c.id,c.x,c.y,c.rarity]));P.Loot.sync();assert.equal(JSON.stringify(P.Loot.chests.map(c=>[c.id,c.x,c.y,c.rarity])),initialLoot);
const remembered=P.Loot.chests.find(c=>c.rarity==='common');P.Loot.open(remembered);P.Loot.advance(.7);P.Loot.resume();const originalPos={x:s.player.x,y:s.player.y};s.player.x=7000;s.player.y=-7000;P.Chunks.sync();P.Loot.sync();assert(P.Loot.chests.length<=10);assert(P.Loot.chests.every(c=>P.Loot.safe(c.x,c.y)));s.player.x=originalPos.x;s.player.y=originalPos.y;P.Chunks.sync();P.Loot.sync();const returned=P.Loot.chests.find(c=>c.id===remembered.id);assert(returned&&returned.opened);assert.equal(returned.x,remembered.x);assert.equal(returned.y,remembered.y);P.Loot.open(returned);assert.equal(s.mode,'play','No regenerar el premio al volver');
let rarityCounts={common:0,rare:0,legendary:0};for(let i=0;i<10000;i++)rarityCounts[P.Loot.chooseRarity((i+.5)/10000,3000)]++;assert.deepEqual(rarityCounts,{common:7200,rare:2600,legendary:200});assert.notEqual(P.Loot.chooseRarity(.999,1000),'legendary');
const beforePause=JSON.stringify(P.Loot.chests);P.UI.pause();P.Loot.tick(100);assert.equal(JSON.stringify(P.Loot.chests),beforePause);P.UI.pause();s.encounter={};s.player.x=9000;const beforeArena=JSON.stringify(P.Loot.chests);P.Loot.sync();assert.equal(JSON.stringify(P.Loot.chests),beforeArena);s.encounter=null;P.Game.start();assert.equal(P.Loot.opened.size,0);assert.notEqual(P.Loot.seed,lootSeed);assert.notEqual(JSON.stringify(P.Loot.chests.map(c=>[c.id,c.x,c.y,c.rarity])),initialLoot);
console.log('OK cofres aleatorios: semilla por partida, mundo infinito, colisiones, rareza 72/26/2, distancia, caché acotada, pausa y premio persistente');

P.Game.start();P.Core.keys.d=true;const gaitX=s.player.x,gaitY=s.player.y;P.Systems.move(.04);P.Core.keys.d=false;assert(s.player.moving);assert(Math.abs(s.player.walkPhase-Math.hypot(s.player.x-gaitX,s.player.y-gaitY)/10)<1e-9);const playerPhase=s.player.walkPhase;P.Systems.move(.04);assert(!s.player.moving);assert.equal(s.player.walkPhase,playerPhase);
const clearBefore=P.Terrain.clear;P.Terrain.clear=()=>true;const shooter={x:s.player.x+220,y:s.player.y,design:5,rangedCooldown:0};s.danger=[];P.Systems.ranged(shooter,.01);assert(shooter.rangedAim);assert.equal(s.danger.length,0,'Avisar antes del disparo');const aimX=shooter.rangedAim.x,aimY=shooter.rangedAim.y;s.player.y+=60;P.Systems.ranged(shooter,.71);assert.equal(s.danger.length,1);assert(Math.abs(s.danger[0].vx-aimX*180)<1e-9);assert(Math.abs(s.danger[0].vy-aimY*180)<1e-9);assert.equal(s.danger[0].damage,8);P.Systems.ranged(shooter,.1);assert.equal(s.danger.length,1,'Respetar enfriamiento');const ordinary={...shooter,design:0,rangedCooldown:0};P.Systems.ranged(ordinary,1);assert(!ordinary.rangedAim);P.Terrain.clear=()=>false;shooter.rangedCooldown=0;P.Systems.ranged(shooter,1);assert(!shooter.rangedAim,'No disparar a través de cobertura');P.Terrain.clear=clearBefore;
const beforeHp=s.player.hp;s.player.inv=0;s.danger=[{...s.danger[0],x:s.player.x,y:s.player.y,history:[]}];P.Combat.tick(0);assert.equal(s.player.hp,beforeHp-P.Loot.damage(s.player,8));assert.equal(s.danger.length,0);console.log('OK marcha de jugador, aviso, dirección fijada, enfriamiento, cobertura y daño de minions');

P.Game.start();s.player.x=0;s.player.y=0;s.encounter=null;P.Loot.chests=[{x:100,y:100,rarity:'common'},{x:200,y:100,rarity:'rare'},{x:300,y:100,rarity:'legendary'},{x:-200,y:100,gold:true},{x:1100,y:0,rarity:'rare'},{x:-100,y:100,rarity:'legendary',opened:true}];
const miniDraws=[],miniCtx=new Proxy({fillRect(...args){miniDraws.push({color:this.fillStyle,args})},fillText(...args){miniDraws.push({text:args[0]})}},{get(t,k){return t[k]||(()=>{})}});
const terrainActiveBefore=P.Terrain.active;P.Terrain.active=()=>[];P.Terrain.minimap(miniCtx,1280,720);P.Terrain.active=terrainActiveBefore;
const chestMarks=miniDraws.filter(d=>d.args?.[2]===6&&d.args?.[3]===6&&d.color!=='#ff765a');assert.equal(chestMarks.length,4);assert.deepEqual(chestMarks.map(d=>d.color),['#d6bb91','#62c6ff','#e5adff','#ffe089']);assert.equal(chestMarks[0].args[0],Math.round(18+78+100/900*78)-3);assert.equal(chestMarks[0].args[1],Math.round(720-128+52+100/900*52)-3);assert(miniDraws.some(d=>d.text==='Leg.'));
s.encounter={};miniDraws.length=0;P.Terrain.minimap(miniCtx,1280,720);assert.equal(miniDraws.length,0);s.encounter=null;s.mode='menu';P.Terrain.minimap(miniCtx,1280,720);assert.equal(miniDraws.length,0);P.Game.start();console.log('OK minimapa: colores de cofres, coordenadas, distancia, abiertos, jefe, leyenda y arenas');


{
const clearBefore=P.Terrain.clear;P.Terrain.clear=()=>true;P.Game.start();const expected=[3,0,2,1,1,3];
for(let design=0;design<6;design++){
 const attack=P.Systems.minionAttacks[design],shooter={x:s.player.x+(design===3?70:200),y:s.player.y,design,rangedCooldown:0,hp:100,r:13,hit:0,heavy:false};s.danger=[];P.Systems.ranged(shooter,.01);assert(shooter.rangedAim,attack.name+' debe avisar');assert.equal(s.danger.length,0);const aim={...shooter.rangedAim};assert(P.EnemyArt.attackPose(shooter));P.EnemyArt.attackCue(drawing,shooter,P.EnemyArt.attackPose(shooter));
 s.player.y+=20;P.Systems.ranged(shooter,attack.windup+.01);assert(!shooter.rangedAim);assert(P.EnemyArt.attackPose(shooter),'Animacion de ejecucion');if(design===1){assert(shooter.charge);assert.equal(shooter.charge.x,aim.x)}else if(design===5){assert.equal(s.danger.length,1);P.Systems.ranged(shooter,.18);P.Systems.ranged(shooter,.18)}assert.equal(s.danger.length,expected[design]);
 if(s.danger.length){assert.equal(s.danger[0].damage,attack.damage);assert.equal(s.danger[0].color,attack.color);if(attack.speed)assert(Math.abs(s.danger[0].vx-aim.x*attack.speed)<.001||design===0||design===2);for(const shot of s.danger)P.FX.projectile(drawing,shot)}
 const count=s.danger.length;P.Systems.ranged(shooter,.1);assert.equal(s.danger.length,count,'Enfriamiento '+attack.name);
 P.EnemyArt.ready=true;P.EnemyArt.image={};P.EnemyArt.cells[design]=[{sx:0,sy:0,w:80,h:120},{sx:80,sy:0,w:80,h:120}];assert(P.EnemyArt.draw(drawing,shooter));P.EnemyArt.ready=false;
 const blocked={x:s.player.x+200,y:s.player.y,design,rangedCooldown:0};P.Terrain.clear=()=>false;P.Systems.ranged(blocked,1);assert(!blocked.rangedAim);P.Terrain.clear=()=>true;
}
P.Game.start();s.danger=[];const shooter={x:s.player.x+220,y:s.player.y,design:5,rangedCooldown:0};P.Systems.ranged(shooter,.01);const frozen=shooter.rangedWindup;s.enemies=[shooter];s.mode='pause';P.Game.update(.1);assert.equal(shooter.rangedWindup,frozen);s.mode='play';P.Systems.ranged(shooter,.71);const shot={...s.danger[0],x:s.player.x,y:s.player.y,history:[]};s.danger=[shot];const hp=s.player.hp;s.player.inv=0;P.Combat.tick(0);assert.equal(s.player.hp,hp-P.Loot.damage(s.player,8));assert.equal(s.danger.length,0);
const hitBefore=P.Terrain.hit;P.Terrain.hit=()=>true;s.danger=[{...shot,x:s.player.x+50,history:[]}];P.Combat.tick(.04);assert.equal(s.danger.length,0,'Cobertura bloquea proyectil');P.Terrain.hit=hitBefore;
P.Game.start();s.enemies=[];s.danger=[{...shot,kind:'stomp',radius:85,life:.35,x:s.player.x+50,y:s.player.y,vx:0,vy:0,history:[],spent:false,damage:12}];s.player.inv=0;const stompHp=s.player.hp;P.Combat.tick(.01);assert.equal(s.player.hp,stompHp-12);s.player.inv=0;P.Combat.tick(.01);assert.equal(s.player.hp,stompHp-12,'Una onda no golpea dos veces');
s.danger=[{...shot,kind:'zigzag',x:s.player.x+300,y:s.player.y,vx:165,vy:0,age:0,life:2.5,history:[]}];const zig=s.danger[0],zigY=zig.y;P.Combat.tick(.04);assert.notEqual(zig.y,zigY,'Austin zigzaguea');
s.danger=Array.from({length:40},()=>({...shot}));const capped={x:s.player.x+220,y:s.player.y,design:0,rangedCooldown:0};P.Systems.ranged(capped,1);assert(!capped.rangedAim);P.Terrain.clear=clearBefore;
P.Game.start();const charger=P.Entities.enemy();charger.design=1;charger.x=s.player.x+220;charger.y=s.player.y;charger.charge={x:-1,y:0,time:.42};s.enemies=[charger];const chargeX=charger.x;P.Systems.move(.04);assert(chargeX-charger.x>10,'Tyrone embiste');const resolveBefore=P.Terrain.resolve;P.Terrain.resolve=(e,previous)=>{e.x=previous.x;e.y=previous.y};charger.charge={x:-1,y:0,time:.42};P.Systems.move(.04);assert(!charger.charge,'Choque detiene embestida');P.Terrain.resolve=resolveBefore;
console.log('OK seis ataques de minions: aviso, ejecucion, animacion, rafaga, colisiones, pausa, dano y limites');

}

{P.$('#lab-boss').value='vulture';P.Lab.run();assert(s.devRun);assert.equal(s.encounter.scene.id,'techos-lima');assert.equal(s.enemies[0].name,'El Gallinazo del Caos');assert.equal(P.Terrain.active().length,4);const e=s.enemies[0],time=s.mapTime;P.Game.update(.04);assert.equal(s.mapTime,time);
e.phase='approach';e.attackT=0;e.attackIndex=0;P.Vulture.move(e,.01);assert.equal(e.phase,'vulture-warning');assert.equal(e.attack,'dive');const dx=e.dx,dy=e.dy;s.player.x+=100;P.Vulture.move(e,.2);assert.equal(e.dx,dx);assert.equal(e.dy,dy);e.windup=0;P.Vulture.move(e,.01);assert.equal(e.phase,'vulture-dive');
const cover=P.Terrain.active()[0];e.x=cover.x-cover.w/2-e.r-2;e.y=cover.y;e.dx=1;e.dy=0;e.windup=.8;P.Vulture.move(e,.04);assert.equal(e.phase,'vulture-recover');assert(!P.Terrain.hit(e.x,e.y,e.r-1));
e.x=-180;e.y=70;e.hp=800;e.phase='approach';e.attackT=0;e.attackIndex=0;P.Vulture.move(e,.01);assert.equal(e.diveRemaining,2);e.windup=0;P.Vulture.move(e,.01);for(let i=0;i<30&&e.phase==='vulture-dive';i++)P.Vulture.move(e,.04);assert.equal(e.diveRemaining,1);P.Vulture.move(e,.7);assert.equal(e.phase,'vulture-warning');assert.equal(e.attack,'dive');
s.danger=[];e.aim=0;P.Vulture.feathers(e);assert.equal(s.danger.length,11);assert(s.danger.every(q=>q.glyph==='FEATHER'));s.fire=100;s.player.x=cover.x+20;s.player.y=cover.y;s.player.inv=0;s.danger=[{x:cover.x-90,y:cover.y,vx:1000,vy:0,age:0,life:5,history:[],glyph:'FEATHER'}];const hp=s.player.hp;P.Combat.tick(.08);assert.equal(s.player.hp,hp);assert.equal(s.danger.length,0);
s.player.x=0;s.player.y=220;e.x=-180;e.y=70;for(let i=0;i<10;i++)P.Vulture.summon(e);assert(s.enemies.filter(q=>q.vultureMinion).length>0);assert(s.enemies.filter(q=>q.vultureMinion).length<=6);for(const q of s.enemies.filter(q=>q.vultureMinion))assert(!P.Terrain.hit(q.x,q.y,q.r));P.World.render(1800);P.Entities.hurt(e,99999);assert.equal(s.mode,'end');P.UI.menu();P.Game.start();assert(!s.encounter);assert(!s.enemies.some(q=>q.vultureMinion));
s.mapTime=180;P.Encounters.tick();const point=P.Encounters.definition().portal;s.player.x=point.x;s.player.y=point.y;P.Encounters.offer();const choice=elements.get('#overlay').children.find(c=>c.tag==='button'&&c.textContent.includes('Subir a los techos'));assert(choice);choice.onclick();assert.equal(s.encounter.definition.kind,'vulture');const returnX=s.encounter.returnX;P.Entities.hurt(s.enemies[0],99999);assert(!s.encounter);assert.equal(s.player.x,returnX);assert(s.portal.cleared);console.log('OK Gallinazo: laboratorio, portal, reloj, picada, cobertura, plumas, bandada, furia y retorno');}
P.UI.menu();P.Maps.select('campo');P.Game.start();assert.deepEqual(JSON.parse(JSON.stringify(s.keys)),{rare:0,legendary:0});s.mapTime=29.99;P.Loot.spawnKeepers();assert(!s.enemies.some(e=>e.keyTier));s.mapTime=30;P.Loot.spawnKeepers();const rareKeeper=s.enemies.find(e=>e.keyTier==='rare');assert(rareKeeper&&rareKeeper.heavy&&rareKeeper.max>=70);P.Loot.spawnKeepers();assert.equal(s.enemies.filter(e=>e.keyTier==='rare').length,1);s.mapTime=90;P.Loot.spawnKeepers();assert.equal(s.enemies.filter(e=>e.keyTier==='legendary').length,1);
P.Entities.hurt(rareKeeper,99999);const rareDrop=s.gems.find(g=>g.kind==='key');assert(rareDrop&&rareDrop.rarity==='rare');P.Entities.hurt(rareKeeper,99999);P.Loot.enemyDrop(rareKeeper);assert.equal(s.gems.filter(g=>g.kind==='key').length,1);const xpBeforeKey=s.xp;P.Loot.collect(rareDrop);P.Loot.collect(rareDrop);assert.equal(s.keys.rare,1);assert.equal(s.xp,xpBeforeKey);assert.equal(P.Loot.collect({kind:'key',rarity:'legendary'}),true);assert.equal(s.keys.legendary,1);
P.Game.start();const lockedRare={...P.Loot.chests.find(c=>c.rarity==='common'),id:'locked-rare',rarity:'rare',progress:1};P.Loot.chests.push(lockedRare);P.Loot.open(lockedRare);assert.equal(s.mode,'play');assert(!lockedRare.opened);assert.equal(lockedRare.progress,0);s.keys.legendary=1;P.Loot.open(lockedRare);assert(!lockedRare.opened,'No usar llave legendaria en cofre raro');assert.equal(s.keys.legendary,1);s.keys.rare=1;P.Loot.open(lockedRare);assert(lockedRare.opened);assert.equal(s.keys.rare,0);P.Loot.open(lockedRare);assert.equal(s.keys.rare,0);P.Loot.advance(.7);assert.equal(s.mode,'item');P.Loot.resume();const lockedLegendary={...lockedRare,id:'locked-legendary',rarity:'legendary',opened:false};P.Loot.chests.push(lockedLegendary);P.Loot.open(lockedLegendary);assert.equal(s.keys.legendary,0);assert.equal(s.mode,'loot-opening');P.Loot.advance(.7);P.Loot.resume();
P.Game.start();let goldReward=0;const freeGold={x:0,y:0,gold:true,opened:false,onOpen(){goldReward++}};P.Loot.chests.push(freeGold);P.Loot.open(freeGold);P.Loot.advance(.7);assert.equal(goldReward,1);assert.equal(s.keys.rare,0);assert.equal(s.keys.legendary,0);
P.Game.start();s.mapTime=90;s.encounter={};P.Loot.spawnKeepers();assert.equal(s.enemies.length,0);s.encounter=null;s.devRun=true;P.Loot.spawnKeepers();assert.equal(s.enemies.length,0);s.devRun=false;s.mode='pause';P.Loot.spawnKeepers();assert.equal(s.enemies.length,0);s.mode='play';s.enemies=Array.from({length:P.Data.arena.enemyCap},()=>({hp:1}));P.Loot.spawnKeepers();assert.equal(s.enemies.length,P.Data.arena.enemyCap);P.Game.start();assert.equal(s.keys.rare,0);assert.equal(s.keys.legendary,0);assert.equal(P.Loot.nextKeeper.rare,30);
console.log('OK llaves: portadores, caída y recogida únicas, rareza correcta, consumo único, jefe gratis, límites y reinicio');

P.Game.start();s.gems=[{x:s.player.x,y:s.player.y,kind:'key',rarity:'rare'}];const keyXp=s.xp;P.Systems.collect(0);assert.equal(s.keys.rare,1);assert.equal(s.xp,keyXp);assert.equal(s.gems.length,0);s.gems=[{x:s.player.x+5000,y:s.player.y,kind:'key',rarity:'legendary'}];P.Game.update(.01);assert(s.gems.some(g=>g.kind==='key'),'No perder una llave al alejarse');
{
 P.Game.start();const calls=[],wholeCtx=new Proxy({drawImage(...args){calls.push(args)}},{get:(target,key)=>target[key]||(()=>{})});
 const savedSheets=P.Sprites.sheets;P.Sprites.sheets={};
 for(const character of P.Data.characters){const id=character.atlas||'base';P.Sprites.sheets[id]??={ready:true,image:{},cells:[]};P.Sprites.sheets[id].cells[character.spriteRow]=Array.from({length:4},(_,frame)=>({sx:frame*80,sy:0,w:80,h:120}));}
 for(const character of P.Data.characters)for(const phase of [0,Math.PI/2,Math.PI,Math.PI*1.5]){calls.length=0;assert(P.Sprites.draw(wholeCtx,0,0,27,character,1,false,{phase}));assert.equal(calls.length,1,'Caminata debe dibujar un cuadro completo: '+character.name);assert.deepEqual(calls[0].slice(1,5),[80,0,80,120]);}
 P.Sprites.sheets=savedSheets;P.EnemyArt.ready=true;P.EnemyArt.image={};
 for(let design=0;design<6;design++){
  P.EnemyArt.cells[design]=[{sx:0,sy:0,w:80,h:120},{sx:80,sy:0,w:80,h:120}];const enemy={x:s.player.x+200,y:s.player.y,hp:50,max:50,r:13,design,heavy:false,speed:65,facing:1,moving:true,walkPhase:1,hit:0};
  for(const walkPhase of [0,Math.PI/2,Math.PI,Math.PI*1.5]){calls.length=0;P.EnemyArt.draw(wholeCtx,{...enemy,walkPhase});assert.equal(calls.length,1,'Minion no debe dividirse en bandas');assert.equal(calls[0][3],80);assert.equal(calls[0][4],120);}
  s.enemies=[enemy];s.effects=[];const kills=s.kills,gems=s.gems.length;P.Entities.hurt(enemy,5);assert.equal(enemy.hp,45);assert.equal(enemy.speed,65);assert.equal(enemy.hit,.22);const hitEffect=s.effects.find(e=>e.kind==='minion-hit');assert(hitEffect);assert.equal(hitEffect.design,design);const hitPose=P.EnemyArt.hitPose(enemy);assert(hitPose);calls.length=0;P.EnemyArt.draw(wholeCtx,enemy);assert.equal(calls.length,1);P.FX.effect(drawing,hitEffect);
  const life=hitEffect.life;s.mode='pause';P.Game.update(.04);assert.equal(hitEffect.life,life);assert.equal(enemy.hit,.22);s.mode='play';
  P.Entities.hurt(enemy,100);const death=s.effects.find(e=>e.kind==='minion-death');assert(death);assert.equal(s.kills,kills+1);assert.equal(s.gems.length,gems+1);assert.equal(death.design,design);P.Entities.hurt(enemy,100);assert.equal(s.effects.filter(e=>e.kind==='minion-death').length,1,'Muerte unica');assert.equal(s.kills,kills+1);
  for(const progress of [0,.25,.5,.9]){calls.length=0;P.EnemyArt.feedbackDraw(wholeCtx,death,progress);assert.equal(calls.length,1,'Muerte conserva la silueta completa');assert.equal(calls[0][3],80);assert.equal(calls[0][4],120);}
  P.Combat.tick(0);assert(!s.enemies.includes(enemy),'El enemigo muerto deja de combatir mientras su efecto continua');assert(s.effects.includes(death));P.Systems.collect(1.1);assert(!s.effects.includes(death),'La animacion de muerte se limpia');
 }
 assert.equal(new Set(P.EnemyArt.feedbackProfiles.map(p=>p.style)).size,6);s.effects=Array.from({length:300},()=>({kind:'spark',life:1}));const cap=s.effects.length;P.EnemyArt.feedback({design:0,x:0,y:0},true);assert.equal(s.effects.length,cap);P.EnemyArt.ready=false;P.Game.start();assert.equal(s.effects.length,0);
 console.log('OK sprites completos de 18 personajes y seis minions; dano, muerte unica, recompensas, pausa y limpieza de efectos');
}


P.Game.start();s.player.x=0;s.player.y=0;P.Loot.chests=[];s.enemies=[{x:100,y:200,hp:100,keyTier:'rare'},{x:-300,y:-200,hp:100,keyTier:'legendary'},{x:200,y:0,hp:0,keyTier:'rare'},{x:901,y:0,hp:100,keyTier:'rare'},{x:50,y:50,hp:100},{x:0,y:0,hp:100,keyTier:'invalid'}];s.gems=[{x:300,y:100,kind:'key',rarity:'rare'},{x:-200,y:100,kind:'key',rarity:'legendary'},{x:50,y:0,kind:'key',rarity:'rare',dead:true},{x:70,y:0,kind:'key',rarity:'legendary',keyCollected:true},{x:0,y:901,kind:'key',rarity:'rare'},{x:20,y:20,kind:'coin'},{x:NaN,y:0,kind:'key',rarity:'rare'}];
const signals=[],signalDrawBefore=P.Terrain.minimapSignal;P.Terrain.minimapSignal=function(ctx,kind,mx,my,color){signals.push({kind,mx,my,color});return signalDrawBefore.call(this,ctx,kind,mx,my,color)};P.Terrain.minimap(drawing,1280,720);const coloredSignals=signals.filter(o=>o.color!=='#f3e6bd');assert.equal(coloredSignals.length,4);assert.deepEqual(coloredSignals.map(o=>[o.kind,o.color]),[['keeper','#62c6ff'],['keeper','#e5adff'],['key','#62c6ff'],['key','#e5adff']]);assert.equal(coloredSignals[0].mx,Math.round(18+78+100/900*78));assert.equal(coloredSignals[0].my,Math.round(720-128+52+200/900*52));assert.equal(signals.filter(o=>o.color==='#f3e6bd').length,2);
s.enemies[0].hp=0;s.gems[0].keyCollected=true;signals.length=0;P.Terrain.minimap(drawing,390,844);assert.equal(signals.filter(o=>o.color!=='#f3e6bd').length,2);s.encounter={};signals.length=0;P.Terrain.minimap(drawing,1280,720);assert.equal(signals.length,0);s.encounter=null;s.mode='menu';P.Terrain.minimap(drawing,1280,720);assert.equal(signals.length,0);P.Terrain.minimapSignal=signalDrawBefore;P.Game.start();console.log('OK señales de minimapa: portadores y llaves, dos rarezas, rango, posición, recogida, muerte, móvil y leyenda');
});
