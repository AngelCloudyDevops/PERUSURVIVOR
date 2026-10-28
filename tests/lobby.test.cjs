'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');
test('Laboratorio: apoyos reales en los 18 causas, rangos, evoluciones y máximo dos distintos',()=>{
 const {P}=new Simulation('campo',[0,1]),bench=P.TestBench,s=P.state,meta=JSON.stringify(P.Meta.data);P.WalkArt.readyForStart=()=>true;P.Terrain.active=()=>[];
 for(const c of P.Data.characters){bench.character=c.id;bench.kind='targets';bench.attack='evolved';bench.run();
  for(const id of ['pulse','cards','orbit'])for(const stage of ['1','2','3','4','5','evolved']){
   bench.support1=id;bench.supportRank1=stage;bench.support2='none';bench.supportCombos=false;bench.applyAttack();const p=s.player;
   assert.equal(p.powerRanks[id],stage==='evolved'?5:Number(stage));assert.equal(!!p.evolved[id],stage==='evolved');assert(p.evolved.primary);assert.equal(s.level,1);assert.equal(s.xp,0);
   assert.equal(Object.keys(p.powerRanks).length,2);const e={x:p.x+30,y:p.y,r:12,hp:999999,max:999999,speed:0};s.enemies=[e];s.shots=[];s.fields=[];s.effects=[];
   P.Progression.tick(.01);if(id==='cards'){assert.equal(s.shots.filter(q=>q.glyph==='BCP').length,stage==='evolved'?3:1);for(let i=0;i<10;i++)P.Combat.tick(.04)}assert(e.hp<999999,c.id+' '+id+' '+stage+' daño real');
  }
  bench.support1='cards';bench.supportRank1='evolved';bench.support2='orbit';bench.supportRank2='3';bench.applyAttack();assert.equal(s.player.powerRanks.cards,5);assert.equal(s.player.powerRanks.orbit,3);assert.equal(Object.keys(s.player.powerRanks).length,3);
  bench.support2='cards';bench.applyAttack();assert.equal(Object.keys(s.player.powerRanks).length,2,'No duplicar apoyo ni sumar sus rangos');assert.equal(s.player.powerRanks.cards,5);
 }
 assert.equal(JSON.stringify(P.Meta.data),meta);
});
test('Laboratorio: combos opcionales, retirada limpia y conservación al cambiar de causa o jefe',()=>{
 const {P}=new Simulation('campo',[0,1]),bench=P.TestBench,s=P.state;P.WalkArt.readyForStart=()=>true;P.Terrain.active=()=>[];bench.kind='targets';bench.character='kingteka';bench.support1='pulse';bench.supportRank1='evolved';bench.support2='cards';bench.supportRank2='5';bench.run();
 assert(!s.player.combos.direct);bench.supportCombos=true;bench.applyAttack();assert(s.player.combos.direct);s.enemies=[{x:s.player.x+30,y:s.player.y,hp:999999,r:12}];s.shots=[];P.Progression.tick(.01);assert.equal(s.shots.filter(q=>q.glyph==='BULLET').length,4,'Directo viral dispara cuatro copias');
 bench.support1='orbit';bench.supportRank1='evolved';bench.support2='cards';bench.supportRank2='evolved';bench.applyAttack();assert(s.player.combos.press);assert(!s.player.combos.direct);s.shots=[];P.Progression.tick(.01);assert.equal(s.shots.filter(q=>q.glyph==='BCP').length,3);assert(s.shots.every(q=>q.remaining===5));
 bench.character='alberto';bench.kind='boss';bench.boss='campo';bench.run();assert(s.encounter);assert.equal(s.player.powerRanks.orbit,5);assert(s.player.evolved.cards);assert(s.player.combos.press);assert.equal(s.level,1);
 bench.support1='none';bench.support2='none';bench.run();assert.equal(Object.keys(s.player.powerRanks).length,1);assert.equal(Object.keys(s.player.combos).length,0);assert.equal(Object.keys(s.player.powerTimers).length,0);assert.equal(s.shots.length,0);assert.equal(s.fields.length,0);
 bench.exit();P.Game.start({preview:true});P.Progression.init(s.player);assert.equal(Object.keys(s.player.powerRanks).length,1);assert.equal(Object.keys(s.player.combos).length,0);assert(!s.devRun);
});
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
test('Laboratorio admin: permite inspeccionar los cinco escenarios secretos sin mostrarlos en el menú público',()=>{
 const {P}=new Simulation('campo',[0,1]),bench=P.TestBench;P.WalkArt.readyForStart=()=>true;P.Account.user={role:'admin'};bench.character='cristorata';bench.kind='survival';
 assert.deepEqual(Array.from(P.Maps.available(),map=>map.id),[...P.Maps.catalog,...P.Maps.biomes].map(map=>map.id));
 for(const map of P.Maps.biomes){bench.map=map.id;bench.run();assert.equal(P.Maps.selected,map.id);assert.equal(P.Maps.current(),map);assert(P.state.devRun);assert(P.state.balanceTest)}
 P.UI.menu();P.Account.user={role:'player'};P.Maps.ensureAllowed();assert.equal(P.Maps.selected,'campo');assert.equal(Array.from(P.Maps.available(),map=>map.id).join(','),Array.from(P.Maps.catalog,map=>map.id).join(','));P.Maps.select('azoteas-lima');assert.equal(P.Maps.selected,'campo');
});
test('Escenarios de jefe: la utilería inicial distingue terminal, distrito, santuario, azotea y archivo',()=>{
 const expected={
  'ruta-chosicano':['road-barrier','bus-stop','tire-stack','ticket-booth','traffic-cones','vendor-cart'],
  'distrito-gabinete':['office-planter','security-desk','filing-cabinet','queue-barrier','civic-bench','civic-lamp'],
  'santuario-niebla':['wall','rock'],
  'azoteas-lima':['parapet','antenna','roof-vent','water-tank','rebar-columns','roof-bridge'],
  'archivo-final':['archive-shelf','archive-cabinet','archive-boxes','warning-light','archive-ladder','evidence-cage']
 };
 for(const [map,kinds]of Object.entries(expected)){const {P}=new Simulation(map,[0]),present=new Set(P.Terrain.originProps.map(o=>o.kind));for(const kind of kinds)assert(present.has(kind),map+' · '+kind)}
});
test('Laboratorio: minions comunes pueden reaparecer o quedar inmortales sin proteger jefes',()=>{
 const {P}=new Simulation('campo',[0,1]),bench=P.TestBench,s=P.state;P.WalkArt.readyForStart=()=>true;P.Terrain.active=()=>[];bench.active=true;s.devRun=true;s.mode='play';
 const immortal=P.Entities.enemy();immortal.hp=immortal.max=20;s.enemies=[immortal];bench.minionMode='immortal';P.Entities.hurt(immortal,999);assert.equal(immortal.hp,1);assert.equal(s.kills,0);assert.equal(bench.respawns.length,0);
 const boss=P.Entities.enemy(true);boss.hp=boss.max=20;P.Entities.hurt(boss,999);assert(boss.hp<=0,'Los jefes no reciben inmortalidad');
 const returning=P.Entities.enemy();returning.hp=returning.max=24;s.enemies=[returning];bench.minionMode='respawn';P.Entities.hurt(returning,999);assert(returning.hp<=0);assert.equal(bench.respawns.length,1);s.enemies=s.enemies.filter(e=>e.hp>0);bench.tick(.79);assert.equal(s.enemies.length,0);bench.tick(.02);assert.equal(s.enemies.length,1);assert.equal(s.enemies[0],returning);assert.equal(returning.hp,24);
 bench.minionMode='normal';P.Entities.hurt(returning,999);assert(returning.hp<=0);assert.equal(bench.respawns.length,0);
});
test('Vestíbulo: rutas reales, regreso y consultas sin iniciar partida',()=>{const {P}=new Simulation('campo',[0,1]),s=P.state;s.mode='menu';P.Lobby.ready=true;const before=JSON.stringify(s);P.Lobby.renderCodex=()=>{};P.Lobby.refreshHub=()=>{};for(const route of ['play','characters','coop','settings','codex','gacha','home']){assert(P.Lobby.show(route,false));assert.equal(P.Lobby.route,route);for(const id of ['play','characters','coop','settings','codex','gacha'])assert.equal(P.$('#lobby-'+id).hidden,route!==id);assert.equal(s.mode,'menu')}assert.equal(JSON.stringify(s),before);assert.equal(P.Lobby.show('unknown-route'),false);s.mode='play';assert.equal(P.Lobby.show('characters'),false)});
test('Causapedia: reúne fichas jugables, ataques y accesos de laboratorio sin duplicar',()=>{const {P}=new Simulation('campo',[0,1]),entries=P.Lobby.codexEntries(),names=entries.map(entry=>entry.name),bus=entries.find(entry=>entry.kind==='combi'),fiscal=entries.find(entry=>entry.name==='El Fiscalizador'),season=entries.find(entry=>entry.id==='boss:halloween');assert.equal(bus.group,'JEFE DE PORTAL');assert.equal(bus.practice,'campo');assert(bus.attacks.includes('Bocinazo'));assert.equal(fiscal.group,'MINIJEFE');assert.equal(fiscal.practice,'mini:campo');assert(fiscal.attacks.includes('Embestida fiscal'));assert.equal(season.practice,null);assert.equal(new Set(names).size,names.length);assert(entries.every(entry=>(entry.type==='minion'||entry.hp>0&&entry.speed>0)&&entry.arena&&entry.attacks.length>0))});
test('Causapedia: probar una ficha delega en el selector real del laboratorio',()=>{const {P}=new Simulation('campo',[0,1]);let runs=0;P.Lab.run=()=>runs++;const entry=P.Lobby.codexEntries().find(item=>item.id==='mini:machu');assert(P.Lobby.startCodexPractice(entry));assert.equal(P.$('#lab-boss').value,'mini:machu');assert.equal(runs,1);assert.equal(P.Lobby.startCodexPractice(P.Lobby.codexEntries().find(item=>item.id==='boss:halloween')),false);assert.equal(runs,1)});
test('Fondo y retratos: nueve figuras cosméticas sin modificar combate, XP o inventario',()=>{const {P}=new Simulation('campo',[0,1]);P.Lobby.ready=true;const before=JSON.stringify(P.state),calls=[],ctx=new Proxy({},{get:(o,k)=>o[k]||((...a)=>{assert(a.every(v=>typeof v!=='number'||Number.isFinite(v)));calls.push(k)})}),canvas={width:480,height:280,getContext:()=>ctx};for(const t of [0,500,10000]){P.Lobby.background(ctx,0,0,1800,1000,t);P.Lobby.portrait(canvas,P.Data.characters[0],t)}assert(calls.includes('ellipse'));assert.equal(JSON.stringify(P.state),before);P.Ambient.reduced={matches:true};assert.doesNotThrow(()=>P.Lobby.background(ctx,0,0,1800,1000,1000))});
test('Portada: entrar solo habilita el vestíbulo y el audio por gesto',()=>{const {P}=new Simulation('campo',[0,1]);P.state.mode='menu';const before=JSON.stringify(P.state);let unlocks=0;P.Audio.unlock=()=>unlocks++;P.Lobby.enter();assert(P.Lobby.entered);assert(P.$('#lobby-splash').hidden);assert.equal(unlocks,1);assert.equal(JSON.stringify(P.state),before)});
test('Ficha de Kingteka: muestra Base equipada y Cerdito bloqueada hasta obtenerla',()=>{const {P}=new Simulation('campo',[0,1]),king=P.Data.characters.find(c=>c.id==='kingteka'),parent=P.$('#selected-info'),source=require('node:fs').readFileSync('src/ui/reference-menus.js','utf8');let section;P.Meta.data.unlocked.push('kingteka');parent.querySelector=()=>null;parent.append=node=>section=node;P.CharacterSkins.renderPicker(parent,king);const choices=section.children.filter(node=>node.className==='skin-choice'),text=node=>node.children.map(child=>child.textContent).join(' ');assert.equal(choices.length,2);assert(text(choices[0]).includes('BASE · Kingteka'));assert.equal(choices[0].dataset.selected,'true');assert(text(choices[1]).includes('Cerdito VTuber'));assert(text(choices[1]).includes('Gacha de skins'));assert.equal(choices[1].dataset.selected,'false');assert.equal(choices[1].disabled,true);assert(source.includes('P.CharacterSkins?.renderPicker?.(info,character)'));assert(source.includes('P.CharacterSkins?.visual(c)||c'))});

test('Vestíbulo: menú y secciones comparten paleta legible y acentos propios',()=>{const css=require('node:fs').readFileSync('src/ui/styles.css','utf8');for(const token of ['--lobby-ink:#071522','--lobby-gold:#edc55b','--lobby-coral:#ff745e','#reference-gacha-hub{--section-accent:#b58cff}','#reference-objects{--section-accent:#75c99a}','#reference-progress{--section-accent:var(--lobby-gold)}'])assert(css.includes(token),token);assert.match(css,/\.reference-head p\{[^}]*font-size:14px/);assert.match(css,/\.reference-detail p\{[^}]*font-size:13px/);assert.match(css,/\.mission-card p\{[^}]*font-size:12px/)});
test('Vestíbulo: la portada conserva el mapa visible y una sola llamada principal',()=>{const css=require('node:fs').readFileSync('src/ui/styles.css','utf8');assert.match(css,/#lobby-hub:before\{[^}]*linear-gradient\(90deg,[^}]*transparent 82%/);assert.doesNotMatch(css,/#lobby-hub:before\{[^}]*backdrop-filter/);assert.match(css,/body\[data-lobby-panel=home\] #menu \.home-banner \.home-play\{display:none!important\}/);assert.match(css,/body\[data-lobby-panel=home\] #menu \.home-feature h2\{[^}]*color:#fff0bd/)});
test('Causapedia: marcos de ultis y dominios se ajustan a la carta y tienen movimiento propio',()=>{const css=require('node:fs').readFileSync('src/ui/styles.css','utf8');assert.match(css,/\.collection-card-frame\{width:calc\(100% \+ 8px\)!important;height:calc\(100% \+ 8px\)!important/);assert.match(css,/@keyframes card-frame-flow\{/);assert.doesNotMatch(css,/@keyframes card-frame-orbit\{/);for(const visual of ['fire','demon','royal','cosmic','steam'])assert(css.includes('[data-frame-visual='+visual+'] .collection-card-frame'),visual);assert.match(css,/@media\(prefers-reduced-motion:reduce\)\{\.collection-card-frame:before/)});
test('Causapedia: cada dominio conserva un sello propio y no hereda el marco genérico de ulti',()=>{const css=require('node:fs').readFileSync('src/ui/styles.css','utf8');const procedural=css.slice(css.indexOf('/* Sellos procedurales:'));assert(procedural);for(const visual of ['demon','royal','cosmic','steam'])assert(procedural.includes('[data-frame-visual='+visual+'] .collection-card-frame:before'),visual);assert.match(css,/Prototipo Cirilo:[\s\S]+cirilo-domain-demon-frame-v1\.webp[\s\S]+@keyframes cirilo-frame-breathe/);for(const animation of ['domain-fire-flow','domain-fire-embers','domain-energy-flow','domain-steam-flow'])assert(css.includes('@keyframes '+animation+'{'),animation)});
test('Causapedia: los dominios no muestran diagonales ni un segundo borde base',()=>{const css=require('node:fs').readFileSync('src/ui/styles.css','utf8');assert.match(css,/\[data-frame-visual=royal\] \.collection-card-frame,[^{]+\{[^}]*background:none!important/);assert.match(css,/\.collectible-card-front\[data-frame-visual=demon\][^{]+\{border-color:transparent\}/)});

test('Laboratorio: HUD inicial no exige Domain antes de cargar su módulo',()=>{
 const {P}=new Simulation('campo',[0,1]),bench=P.TestBench;bench.panel={};P.Domain=undefined;assert.doesNotThrow(()=>bench.hud());
});

test('Laboratorio: transición sin jugador no rompe el HUD y el enlace directo se consume',()=>{
 const {P}=new Simulation('campo',[0,1]);P.state.player=null;P.state.mode='menu';assert.doesNotThrow(()=>P.UI.hud());assert(P.$('#hud').hidden);
 assert.equal(P.DomainArt.practiceLink('?practice=makanaky&v=vieja'),'?v=vieja');assert.equal(P.DomainArt.practiceLink('?practice=makanaky'),'');assert.equal(P.DomainArt.practiceLink('?v=normal'),null);
});


test('Causapedia de minions: trece fichas únicas y datos de ataque compartidos',()=>{const {P}=new Simulation('campo',[0,1]),before=JSON.stringify(P.state),entries=P.MinionCodex.entries();assert.equal(entries.length,13);assert.equal(new Set(entries.map(e=>e.id)).size,13);for(const e of entries){assert(e.description&&e.dodge&&e.ranks.length===3);assert.equal(e.practice,null);assert.equal(e.type,'minion');assert.equal(e.attack,P.MinionTactics.definitions[e.key]||P.Systems.minionAttacks[e.design]);for(let rank=0;rank<3;rank++)assert(P.WalkArt.isIntegrated(P.MinionCodex.sheet(e,rank)))}assert.equal(entries.find(e=>e.key==='mummy').arena,'Halloween');assert.equal(entries.find(e=>e.key==='elf').arena,'Navidad');assert.equal(entries.find(e=>e.key==='burst').at,215);assert.equal(JSON.stringify(P.state),before);assert.equal(P.Lobby.codexEntries().filter(e=>e.type==='minion').length,13)});

test('Causapedia de minions: los tres rangos se explican sin crear enemigos',()=>{const {P}=new Simulation('campo',[0,1]),entry=P.MinionCodex.entries().find(e=>e.key==='police'),before=JSON.stringify(P.state),make=(tag,text)=>({tag,text,children:[],append(...nodes){this.children.push(...nodes)},setAttribute(){}});P.MinionCodex.load=()=>{};for(let rank=0;rank<3;rank++){P.MinionCodex.rank=rank;const copy=make('div','');P.MinionCodex.detail(entry,copy,make);const content=copy.children.map(n=>n.text).join(' ');assert(content.includes(entry.ranks[rank]));assert(content.includes('CÓMO ESQUIVARLO'));assert(content.includes('Vida ×'+P.MinionEvolution.profiles[rank].hp));assert.equal(copy.children.find(n=>n.tag==='nav').children.length,3)}assert.equal(JSON.stringify(P.state),before)});
