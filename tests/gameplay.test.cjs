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
assert.equal(P.Data.characters.length,14);assert.equal(elements.get('#characters').children.length,14);
function target(x,y,hp=2000){return {x,y,hp,max:hp,r:13,speed:0,hit:0,boss:false,heavy:false}}
for(let i=0;i<14;i++){
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
 const old={x:s.player.x,y:s.player.y};s.player.x=99999;s.player.y=-99999;P.World.collide(s.player,old);assert(s.player.x<=map.bounds.right&&s.player.y>=map.bounds.top);
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


const recordBeforeLab=P.Save.best;
for(const bossId of ['campo','plaza','machu','final']){
 P.$('#lab-boss').value=bossId;P.$('#lab-invincible').checked=true;P.Lab.run();assert(s.devRun);assert.equal(s.enemies.length,1);assert(!elements.get('#lab-tools').hidden);
 if(bossId==='final'){assert(s.bossSpawned);assert(s.enemies[0].boss)}else{assert(s.encounter);assert(s.enemies[0].mapBoss);assert.equal(s.encounter.definition,P.Encounters.catalog[bossId])}
 const hp=s.player.hp;const boss=s.enemies[0];boss.x=s.player.x;boss.y=s.player.y;for(let i=0;i<10;i++)P.Game.update(.04);assert.equal(s.player.hp,hp,'Invencible durante prueba');assert.equal(s.enemies.length,1,'No añadir oleadas en laboratorio');
 P.Entities.hurt(boss,999999);assert.equal(s.mode,'end');assert.equal(P.Save.best,recordBeforeLab,'No guardar récords de desarrollo');P.Lab.run();assert(s.devRun);assert.equal(s.player.hp,s.player.maxHp);P.UI.menu();assert(!s.devRun);assert(elements.get('#lab-tools').hidden);
 console.log('OK laboratorio: '+bossId)
}
P.$('#lab-boss').value='campo';P.$('#lab-invincible').checked=false;P.Lab.run();s.player.inv=0;s.enemies[0].x=s.player.x;s.enemies[0].y=s.player.y;const vulnerableHp=s.player.hp;P.Game.update(.04);assert(s.player.hp<vulnerableHp);P.UI.menu();P.Game.start();assert(!s.devRun);assert(!s.encounter);assert.equal(s.mapTime,0);console.log('OK: invencibilidad opcional y retorno al modo normal');


const alphaFixture=new Uint8Array(10*10*4);for(let y=1;y<=3;y++)for(let x=1;x<=3;x++)alphaFixture[(y*10+x)*4+3]=255;alphaFixture[(9*10+9)*4+3]=255;
const cut=P.BossArt.mainBounds(alphaFixture,10,0,0,10,10);assert.equal(cut.x,1);assert.equal(cut.y,1);assert.equal(cut.w,3);assert.equal(cut.h,3);
P.$('#lab-boss').value='campo';P.Lab.run();const charger=s.enemies[0],arenaBounds=s.encounter.scene.bounds;charger.phase='charge';charger.dx=1;charger.dy=1;charger.windup=1;charger.x=arenaBounds.right-1;charger.y=arenaBounds.bottom-1;P.Encounters.bossMove(charger,.04);assert(charger.x<=arenaBounds.right-charger.r);assert(charger.y<=arenaBounds.bottom-charger.r);assert.equal(charger.phase,'recover');
P.World.render(800);assert(P.Terrain.zoom>=1.05);assert(arenaBounds.right<900&&arenaBounds.bottom<500);P.UI.menu();P.Game.start();P.World.render(900);assert(P.Terrain.zoom>=1.45);console.log('OK: cámara cercana, arena compacta, embestida dentro de límites y recorte sin vecinos');

});
