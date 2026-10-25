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
console.log('OK: seis diseños de rivales.');
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
 P.Encounters.offer();assert.equal(s.mode,'portal');elements.get('#overlay').children.filter(c=>c.tag==='button')[1].onclick();assert.equal(s.mode,'play');assert(s.portal.open);
 P.Encounters.offer();elements.get('#overlay').children.find(c=>c.tag==='button').onclick();assert(s.encounter);assert(s.enemies[0].mapBoss);assert.equal(s.enemies.length,1);
 const clock=s.mapTime,normalX=normal.x;P.Game.update(.04);assert.equal(s.mapTime,clock);assert.equal(normal.x,normalX);assert(!s.bossSpawned);
 const localBoss=s.enemies[0];localBoss.attackT=0;P.Encounters.bossMove(localBoss,.01);assert.equal(localBoss.phase,'warning');P.Encounters.bossMove(localBoss,1.2);
 if(map.id==='campo')assert.equal(localBoss.phase,'charge');else assert(s.danger.length>0);
 s.player.x=9999;s.player.y=-9999;P.World.collide(s.player,{x:0,y:220});assert(s.player.x<=s.encounter.scene.bounds.right&&s.player.y>=s.encounter.scene.bounds.top);
 P.World.render(500);P.Entities.hurt(localBoss,99999);assert.equal(s.mode,'reward');assert(!s.encounter);assert.equal(s.enemies[0],normal);assert.equal(s.player.x,pos.x);assert.equal(s.player.y,pos.y);assert(s.portal.cleared);assert(!s.bossSpawned);
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
 assert.equal(P.Terrain.active().length,0);
 const local=s.enemies[0];local.phase='warning';assert.equal(P.BossArt.frame(local),3);local.phase='charge';assert.equal(P.BossArt.frame(local),4);local.phase='recover';local.attackUntil=0;assert.equal(P.BossArt.frame(local),5);
 local.phase='warning';local.windup=.01;P.Encounters.bossMove(local,.02);if(local.kind!=='combi'){assert.equal(local.phase,'recover');assert.equal(P.BossArt.frame(local),4);s.elapsed+=.3;assert.equal(P.BossArt.frame(local),5)}
 const png=fs.readFileSync(path.join(root,'public/assets/arenas/'+s.encounter.scene.asset+'-v1.png'));assert.equal(png.toString('hex',0,8),'89504e470d0a1a0a');
 P.Entities.hurt(local,99999);assert(!s.encounter);assert.equal(P.BossArt.sceneId(),map.id);P.Encounters.reward(()=>{});console.log('OK arte y escena: '+map.name)
}
const bossPng=fs.readFileSync(path.join(root,'public/assets/bosses/boss-atlas-v1.png'));assert.equal(bossPng.toString('hex',0,8),'89504e470d0a1a0a');
P.Game.start();s.mapTime=180;P.Encounters.tick();const uiPoint=P.Encounters.definition().portal;s.player.x=uiPoint.x;s.player.y=uiPoint.y;elements.get('#portal-enter').hidden=true;P.UI.hud();assert.equal(elements.get('#portal-enter').hidden,false,'El HUD debe mostrar el botón cercano');s.player.x=-900;P.UI.hud();assert.equal(elements.get('#portal-enter').hidden,true,'El HUD oculta el botón lejano');console.log('OK: botón de portal conectado al HUD');


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
});
