'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');
test('Laboratorio: seis estados de las 18 armas, combate real, sin niveles ni acumulación',()=>{
 const {P}=new Simulation('campo',[0,1]),bench=P.TestBench,s=P.state,meta=JSON.stringify(P.Meta.data),catalog=JSON.stringify(P.Data.attacks);P.WalkArt.readyForStart=()=>true;P.Terrain.active=()=>[];
 for(const c of P.Data.characters){
  bench.character=c.id;bench.kind='targets';bench.attack='1';bench.run();
  for(const stage of ['1','2','3','4','5','evolved','1']){
   bench.attack=stage;bench.applyAttack();const p=s.player,expected=P.Entities.player(c);P.Progression.init(expected);const rank=stage==='evolved'?5:Number(stage);
   for(let i=1;i<rank;i++)P.Progression.apply(expected,'primary');if(stage==='evolved')P.Progression.apply(expected,'evolve:primary');
   for(const key of ['power','rate','reach','projectileBonus','primaryPierce','evolutionBaseBonus'])assert.equal(p[key],expected[key],c.id+' '+stage+' '+key);
   assert.equal(p.powerRanks.primary,rank);assert.equal(!!p.evolved.primary,stage==='evolved');assert.equal(s.level,1);assert.equal(s.xp,0);
   const a=P.Evolutions.attack(p),e={x:p.x+(a.kind==='orbit'?100:50),y:p.y,r:16,hp:99999,max:99999,speed:0};s.enemies=[e];s.shots=[];s.effects=[];s.fields=[];s.fire=0;assert(P.Combat.cast(),c.id+' '+stage+' ataque');
   if(stage==='evolved')assert(s.effects.some(e=>e.kind==='evolution'&&e.evolution===c.id));else assert(!s.effects.some(e=>e.kind==='evolution'));
   for(let i=0;i<20;i++)P.Combat.tick(.04);assert(e.hp<99999,c.id+' '+stage+' daño');
   const power=p.power;bench.applyAttack();assert.equal(p.power,power,'Aplicación idempotente');
  }
 }
 assert.equal(JSON.stringify(P.Data.attacks),catalog);assert.equal(JSON.stringify(P.Meta.data),meta);
 bench.attack='evolved';bench.kind='boss';bench.boss='campo';bench.run();assert(s.encounter);assert(s.player.evolved.primary);assert.equal(s.level,1);
 // Una carga asíncrona puede reemplazar al jugador después de run().
 s.player=P.Entities.player(P.Data.characters.find(c=>c.id===bench.character));bench.tick();assert(s.player.evolved.primary);
 bench.attack='1';bench.run();assert(!s.player.evolved.primary);assert.equal(s.fields.length,0);assert.equal(s.shots.length,0);
 bench.exit();P.Game.start({preview:true});assert(!s.player.evolved?.primary);assert.equal(s.player.power,P.Data.characters[s.chosen].power);assert(!s.devRun);
});
test('Laboratorio: cambiar causa, mapa y jefe, repetir y salir limpia ultis y no consume inventario',()=>{
 const {P}=new Simulation('campo',[0,1]),bench=P.TestBench;const before=JSON.stringify(P.Meta.data);P.WalkArt.readyForStart=()=>true;
 bench.character='kingteka';bench.kind='targets';bench.map='plaza';bench.run();assert(bench.active);assert(P.state.practice);assert.equal(P.Maps.selected,'plaza');assert.equal(P.state.player.id,'kingteka');assert(P.Ultimate.activate());
 bench.character='alberto';bench.run();assert.equal(P.state.player.id,'alberto');assert.equal(P.state.ultimate.left,0);assert.equal(P.state.ultimate.charge,100);assert(P.Ultimate.activate());assert(P.state.court);
 bench.character='cristorata';bench.map='machu';bench.run();assert.equal(P.state.player.id,'cristorata');assert.equal(P.state.court,null);assert.equal(P.Maps.selected,'machu');assert(P.state.enemies.every(e=>e.speed===0));
 bench.kind='boss';bench.boss='campo';bench.run();assert(P.state.devRun);assert(!P.state.practice);assert(P.state.encounter);const first=P.state.player;bench.run();assert.notEqual(P.state.player,first);assert(bench.active);
 bench.exit();assert(!bench.active);assert(!P.state.devRun);assert(!P.state.practice);assert.equal(P.state.mode,'menu');assert.equal(P.Lobby.route,'settings');assert.equal(JSON.stringify(P.Meta.data),before);
 P.Game.start({preview:true});assert(!bench.active);assert(!P.state.devRun);assert.equal(P.state.ultimate.charge,0);
});
test('Vestíbulo: rutas reales, regreso y consultas sin iniciar partida',()=>{const {P}=new Simulation('campo',[0,1]),s=P.state;s.mode='menu';P.Lobby.ready=true;const before=JSON.stringify(s);for(const route of ['play','characters','coop','settings','gacha','home']){assert(P.Lobby.show(route,false));assert.equal(P.Lobby.route,route);for(const id of ['play','characters','coop','settings','gacha'])assert.equal(P.$('#lobby-'+id).hidden,route!==id);assert.equal(s.mode,'menu')}assert.equal(JSON.stringify(s),before);assert.equal(P.Lobby.show('unknown-route'),false);s.mode='play';assert.equal(P.Lobby.show('characters'),false)});
test('Fondo y retratos: nueve figuras cosméticas sin modificar combate, XP o inventario',()=>{const {P}=new Simulation('campo',[0,1]);P.Lobby.ready=true;const before=JSON.stringify(P.state),calls=[],ctx=new Proxy({},{get:(o,k)=>o[k]||((...a)=>{assert(a.every(v=>typeof v!=='number'||Number.isFinite(v)));calls.push(k)})}),canvas={width:480,height:280,getContext:()=>ctx};for(const t of [0,500,10000]){P.Lobby.background(ctx,0,0,1800,1000,t);P.Lobby.portrait(canvas,P.Data.characters[0],t)}assert(calls.includes('ellipse'));assert.equal(JSON.stringify(P.state),before);P.Ambient.reduced={matches:true};assert.doesNotThrow(()=>P.Lobby.background(ctx,0,0,1800,1000,1000))});
test('Portada: entrar solo habilita el vestíbulo y el audio por gesto',()=>{const {P}=new Simulation('campo',[0,1]);P.state.mode='menu';const before=JSON.stringify(P.state);let unlocks=0;P.Audio.unlock=()=>unlocks++;P.Lobby.enter();assert(P.Lobby.entered);assert(P.$('#lobby-splash').hidden);assert.equal(unlocks,1);assert.equal(JSON.stringify(P.state),before)});
