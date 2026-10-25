const fs=require('fs'),vm=require('vm'),assert=require('assert');
const elements=new Map(),events={},storage={};
const drawing=new Proxy({createRadialGradient:()=>({addColorStop(){}})}, {get(t,k){return t[k]||(()=>{})}});
function element(tag='div'){return {tag,children:[],style:{},hidden:false,dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(...c){this.children.push(...c)},replaceChildren(){this.children=[]},querySelector(){return this.children.find(c=>c.tag==='button')},focus(){},addEventListener(n,f){this[n]=f},getContext(){return drawing},setPointerCapture(){}}}
const context={console,Math,innerWidth:1280,innerHeight:800,devicePixelRatio:1,requestAnimationFrame(){},addEventListener(n,f){events[n]=f},localStorage:{getItem(k){return storage[k]},setItem(k,v){storage[k]=v}},document:{body:element(),querySelector(s){if(!elements.has(s))elements.set(s,element());return elements.get(s)},querySelectorAll(){return elements.get('#characters')?.children||[]},createElement:element}};
context.window=context;vm.createContext(context);
for(const file of ['data','core','sprites','fx','entities','combat','systems','world','ui','game'])vm.runInContext(fs.readFileSync(__dirname+'/dist/js/'+file+'.js','utf8'),context,{filename:file});
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
const p=s.player;p.x=0;p.y=80;P.World.collide(p,{x:0,y:95});assert(Math.hypot(p.x,p.y)>=90);
P.UI.select(P.Data.characters.findIndex(c=>c.attack==="clip"));P.Game.start();s.enemies=[target(s.player.x+150,s.player.y)];P.Combat.cast();let shot=s.shots[0];for(let i=0;i<15;i++)P.Combat.tick(.04);assert(shot.returning,'El micrófono debe regresar');
P.Game.start();s.player.hp=s.player.maxHp=999999;for(let i=0;i<7600;i++){if(s.mode==='upgrade'){elements.get('#overlay').children.find(c=>c.tag==='button').onclick()}P.Game.update(.04)}assert(s.bossSpawned);const boss=s.enemies.find(e=>e.boss);assert(boss);P.Entities.hurt(boss,999999);assert.equal(s.mode,'end');assert(storage['causas-best']);
P.Game.start();s.player.hp=1;s.enemies=[target(s.player.x,s.player.y)];P.Game.update(.04);assert.equal(s.mode,'end');P.UI.menu();assert.equal(s.mode,'menu');P.World.render(100);
assert.equal(P.Data.boss.id,'zein');assert(!P.Data.characters.some(c=>c.id==='zein'));
P.Game.start();const bossAttack=P.Entities.enemy(true);bossAttack.x=s.player.x+250;bossAttack.y=s.player.y;bossAttack.attackT=0;s.enemies=[bossAttack];P.Systems.move(.01);assert.equal(s.danger.length,5,'El jefe debe disparar cinco proyectiles');const hpBefore=s.player.hp;s.danger=[{...s.danger[0],x:s.player.x,y:s.player.y}];P.Combat.tick(0);assert.equal(s.player.hp,hpBefore-14,'Los proyectiles del jefe deben hacer daño');
for(const name of ['causas-atlas-v1.png','streamers-atlas-v1.png']){const png=fs.readFileSync(__dirname+'/dist/assets/sprites/'+name);assert.equal(png.toString('hex',0,8),'89504e470d0a1a0a')}
console.log('OK: ElZeein como jefe, ráfaga hostil y archivos PNG.');
console.log('OK: movimiento, pausa, mejora, colisión de fuente, bumerán, simulación de cinco minutos, jefe, victoria, derrota y retorno al menú.');