'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');

function ready(duo=false,map='campo'){
 const sim=new Simulation(map,duo?[0,6]:[0]),P=sim.P,s=P.state;
 if(!duo){s.runMode='chaos';P.Data.arena.duration=1800}
 s.enemies=[];s.miniWarning=null;s.portal.open=false;P.Market.merchant=null;P.Exploration.station=null;
 P.MapEvents.worldPlanned=true;P.MapEvents.worldAt=duo?105:630;s.mapTime=P.MapEvents.worldDue();P.Terrain.hit=()=>null;
 return {sim,P,s};
}

test('Impacto del cielo: una cinemática garantizada congela combate y crea un cráter persistente',()=>{
 const {P,s}=ready(),M=P.MapEvents,p=s.player;const before={x:p.x,y:p.y,time:s.mapTime};
 assert(M.tick(.04));assert(M.cinematic());assert.equal(M.event.world,true);assert.equal(M.worldPlayed,true);assert(Math.hypot(M.event.x-p.x,M.event.y-p.y)>300,'El impacto queda lejos del jugador');assert.equal(M.impacts.length,0);
 const frame=M.camera(p,1280,720,1.3);assert(frame&&frame.zoom>0);
 for(let i=0;i<122;i++){s.mapTime+=.04;assert(M.tick(.04))}
 assert.equal(M.impacts.length,1);assert(M.impacts[0].radius>=300);assert(P.Terrain.props.filter(o=>o.meteorImpact).length>=10);assert(P.Terrain.props.some(o=>o.meteorImpact&&o.solid));
 while(M.cinematic()){s.mapTime+=.04;M.tick(.04)}assert.equal(M.event.phase,'invasion');assert.equal(M.event.invasionTarget,12);assert.equal(P.Loot.canOpen({rarity:'common'}),false,'Los cofres quedan sellados durante Extinción');assert.deepEqual({x:p.x,y:p.y},{x:before.x,y:before.y});assert(Math.abs(s.mapTime-before.time)<.08,'La cinemática no consume tiempo de supervivencia');
 for(let i=0;i<M.event.invasionTarget;i++)M.defeated({extinctionDino:true});assert.equal(M.event.phase,'fragments');assert.equal(s.enemies.filter(e=>e.extinctionFragment).length,3);
 for(const fragment of s.enemies.filter(e=>e.extinctionFragment))M.defeated(fragment);assert.equal(M.event.phase,'boss');const boss=s.enemies.find(e=>e.extinctionBoss);assert(boss&&boss.max>=1500);p.x=M.event.x+700;p.y=M.event.y;const hp=p.hp;M.tick(.5);assert(Math.hypot(p.x-M.event.x,p.y-M.event.y)>520,'La tormenta no teletransporta al jugador');assert(p.hp<hp,'Alejarse de la zona segura causa daño progresivo');M.defeated(boss);assert.equal(M.event.phase,'portal');assert(s.coins>=75);
 const impact=JSON.stringify(M.impacts);P.Chunks.signature='';P.Chunks.sync();M.ensureTerrain();assert.equal(JSON.stringify(M.impacts),impact);assert(P.Terrain.props.some(o=>o.meteorImpact));
});

test('Extinción: las oleadas usan roles, el tanque tiene armadura direccional y el anti-kite limita meteoritos',()=>{
 const {P,s}=ready(),M=P.MapEvents,p=s.player;M.startWorld();const e=M.event;M.activateWorld(e);for(let i=0;i<30;i++)M.tickWorld(.1);const first=s.enemies.filter(q=>q.extinctionDino);assert.deepEqual(first.map(q=>q.dinoKind).sort(),['ankylosaur','raptor','raptor']);assert(first.every(q=>q.dinoRole));
 const tank=first.find(q=>q.dinoKind==='ankylosaur');tank.facing=1;assert.equal(M.incomingMultiplier(tank,{owner:{x:tank.x+20}}),.48);assert.equal(M.incomingMultiplier(tank,{owner:{x:tank.x-20}}),1.3);
 p.x=e.x+700;p.y=e.y;for(let i=0;i<80;i++)M.tickWorld(.04);assert((e.fallingMeteors||[]).length>0);assert((e.fallingMeteors||[]).length<=3);
});

test('Extinción: cada dinosaurio tiene atributo, canal, defensas y resistencia propios',()=>{
 const {P}=ready(),M=P.MapEvents;M.startWorld();const e=M.event,kinds=['raptor','ankylosaur','pterosaur','dilophosaur','parasaur','triceratops'];for(const kind of kinds){const q=M.spawnDinosaur(e,true,kind);assert(P.Stats.validate(q),kind+' debe cumplir el contrato universal de stats');assert.equal(q.combatStats.attribute,M.dinosaurProfile(kind).attribute);assert.equal(q.damageType,M.dinosaurProfile(kind).damageType)}const tank=P.state.enemies.find(q=>q.dinoKind==='ankylosaur'),poison=P.state.enemies.find(q=>q.dinoKind==='dilophosaur');assert(tank.combatStats.physicalDefense>poison.combatStats.physicalDefense);assert(poison.combatStats.specialDefense>tank.combatStats.specialDefense);
});

test('Extinción: la manada se protege, aprovecha el veneno y rescata aliados heridos',()=>{
 const {P,s}=ready(),M=P.MapEvents,p=s.player;M.startWorld();const e=M.event;M.activateWorld(e);s.enemies=[];const tank=M.spawnDinosaur(e,false,'ankylosaur'),healer=M.spawnDinosaur(e,false,'parasaur'),raptor=M.spawnDinosaur(e,false,'raptor'),wing=M.spawnDinosaur(e,false,'pterosaur');healer.x=tank.x+60;healer.y=tank.y;healer.hp=healer.max*.5;tank.roleCooldown=0;M.roleAction(tank,p,p.x-tank.x,p.y-tank.y,Math.hypot(p.x-tank.x,p.y-tank.y)||1);assert.equal(tank.guardTargetId,healer.targetId);assert.equal(M.incomingMultiplier(healer,{owner:p}),.55,'La interposición protege al aliado elegido');
 p.extinctionSlowUntil=s.elapsed+2;raptor.roleCooldown=0;M.roleAction(raptor,p,p.x-raptor.x,p.y-raptor.y,Math.hypot(p.x-raptor.x,p.y-raptor.y)||1);assert.equal(raptor.synergyStrike,true,'El raptor aprovecha la ralentización del debilitador');
 raptor.x=wing.x+50;raptor.y=wing.y;raptor.hp=raptor.max*.2;wing.roleCooldown=0;M.roleAction(wing,p,p.x-wing.x,p.y-wing.y,Math.hypot(p.x-wing.x,p.y-wing.y)||1);assert.equal(wing.extinctionAttack.kind,'rescueWarning');for(let i=0;i<35;i++)M.moveEnemy(wing,.04);assert.equal(wing.rescueUsed,true);assert(raptor.inv>0,'El aliado viaja protegido durante el rescate');
});

test('Extinción: el veneno avisa una posición predictiva fija y solo ralentiza al acertar',()=>{
 const {P,s}=ready(),M=P.MapEvents,p=s.player;M.startWorld();const e=M.event;M.activateWorld(e);s.enemies=[];const dilo=M.spawnDinosaur(e,true,'dilophosaur');dilo.x=0;dilo.y=0;p.x=180;p.y=40;p.moving=true;p.extinctionMoveX=0;p.extinctionMoveY=1;M.roleAction(dilo,p,p.x-dilo.x,p.y-dilo.y,Math.hypot(p.x-dilo.x,p.y-dilo.y));const warning=dilo.extinctionAttack,locked={x:warning.targetX,y:warning.targetY};assert.equal(warning.kind,'poisonWarning');assert.equal(warning.left,.45);assert.equal(locked.x,p.x);assert.equal(locked.y,p.y+72);assert.equal(s.danger.length,0);assert.equal(M.slowed(p),false,'El aviso no aplica ralentización automática');p.x+=180;M.moveEnemy(dilo,.46);assert.equal(dilo.extinctionAttack,null);assert.equal(s.danger.length,3);const cloud=s.danger.find(q=>q.extinctionPoisonCloud),projectile=s.danger.find(q=>q.extinctionPoison);assert.deepEqual({x:cloud.x,y:cloud.y},locked,'La marca queda fijada aunque el jugador se mueva');M.tickPoisonClouds();assert.equal(M.slowed(p),false,'Salir de la marca evita la nube');p.x=cloud.x;p.y=cloud.y;p.inv=0;const hp=p.hp;M.tickPoisonClouds();assert(p.hp<hp);assert.equal(M.speedMultiplier(p),.72);p.x+=100;s.elapsed+=.2;M.tickPoisonClouds();assert.equal(M.speedMultiplier(p),1,'Salir de la nube recupera la velocidad');P.MinionTactics.hit(projectile,p,12);assert.equal(M.speedMultiplier(p),.72,'Un escupitajo acertado sí aplica el veneno durante 1,4 s');
});

test('Extinción: la embestida termina exactamente donde concluye su aviso',()=>{
 const {P,s}=ready(),M=P.MapEvents,p=s.player;M.startWorld();const e=M.event;M.activateWorld(e);s.enemies=[];const charger=M.spawnDinosaur(e,true,'triceratops'),spec=M.chargeSpec(charger);charger.x=0;charger.y=0;p.x=600;p.y=0;P.Terrain.resolve=()=>{};charger.extinctionAttack={kind:'warning',left:.01,x:1,y:0};M.moveEnemy(charger,.02);assert.equal(charger.extinctionAttack.kind,'charge');while(charger.extinctionAttack)M.moveEnemy(charger,.037);assert(Math.abs(charger.x-spec.distance)<.001,'El centro del sprite debe alcanzar el extremo anunciado');assert.equal(charger.y,0);
});

test('Extinción: el carril avisa sin castigar y sus púas ralentizan solo durante la carga',()=>{
 const {P,s}=ready(),M=P.MapEvents,p=s.player;M.startWorld();const e=M.event;M.activateWorld(e);s.enemies=[];const charger=M.spawnDinosaur(e,true,'triceratops');charger.x=0;charger.y=0;p.x=100;p.y=0;P.Terrain.resolve=()=>{};charger.extinctionAttack={kind:'warning',left:.01,x:1,y:0};M.moveEnemy(charger,.02);assert.equal(M.speedMultiplier(p),1,'El aviso rectangular no ralentiza');M.moveEnemy(charger,.04);assert.equal(M.speedMultiplier(p),.82,'Las púas activas ralentizan 18 % dentro del carril');p.extinctionChargeSlowUntil=0;p.y=120;M.moveEnemy(charger,.04);assert.equal(M.speedMultiplier(p),1,'Salir del ancho del carril elimina la penalización');p.extinctionSlowUntil=s.elapsed+1;assert.equal(M.speedMultiplier(p),.72,'El veneno conserva la ralentización más fuerte');
});

test('Extinción: Espacio esquiva una embestida pesada con dash lateral, protección y recarga',()=>{
 const {P,s}=ready(),M=P.MapEvents,p=s.player;M.startWorld();const e=M.event;M.activateWorld(e);s.enemies=[];const charger=M.spawnDinosaur(e,true,'triceratops');charger.x=0;charger.y=0;p.x=100;p.y=0;p.facing=1;charger.extinctionAttack={kind:'warning',left:.4,x:1,y:0};assert(M.dodgePrompt(p),'El evento rápido aparece dentro del carril durante los últimos 0,45 s');assert.equal(M.tryDodge(p),true);assert(p.extinctionDodge&&p.inv>=.26);const origin={x:p.x,y:p.y};for(let i=0;i<5;i++)M.dodgeStep(p,.04);assert.equal(p.extinctionDodge,undefined);assert(Math.hypot(p.x-origin.x,p.y-origin.y)>=75,'El jugador se desplaza realmente en vez de desaparecer');assert(Math.abs(p.y)>M.chargeLane(charger).width/2,'El dash termina fuera del carril');charger.extinctionAttack={kind:'warning',left:.4,x:1,y:0};p.y=0;assert.equal(M.tryDodge(p),false,'La recarga personal evita encadenar esquivas');
});

test('Extinción: la esquiva prueba el lado opuesto ante cobertura y no se ofrece contra raptores',()=>{
 const {P,s}=ready(),M=P.MapEvents,p=s.player;M.startWorld();const e=M.event;M.activateWorld(e);s.enemies=[];const charger=M.spawnDinosaur(e,true,'ankylosaur');charger.x=0;charger.y=0;p.x=100;p.y=0;p.facing=1;charger.extinctionAttack={kind:'warning',left:.4,x:1,y:0};P.Terrain.hit=(x,y)=>y>20;assert.equal(M.tryDodge(p),true);assert(p.extinctionDodge.targetY<0,'Si el primer costado está bloqueado usa el segundo');delete p.extinctionDodge;p.extinctionDodgeReadyAt=0;s.enemies=[];const raptor=M.spawnDinosaur(e,false,'raptor');raptor.x=0;raptor.y=0;raptor.extinctionAttack={kind:'warning',left:.4,x:1,y:0};assert.equal(M.dodgePrompt(p),null,'El ataque rápido del Velociraptor conserva su identidad sin quick event');
});

test('Extinción cooperativa: el servidor autoriza y mueve únicamente al jugador que pidió esquivar',()=>{
 const {sim,P,s}=ready(true,'plaza'),M=P.MapEvents,[a,b]=sim.players;M.startWorld();const e=M.event;M.activateWorld(e);s.enemies=[];const charger=M.spawnDinosaur(e,true,'triceratops');charger.x=0;charger.y=0;a.x=100;a.y=0;b.x=100;b.y=130;charger.extinctionAttack={kind:'warning',left:.4,x:1,y:0};sim.tick(.04,[{x:0,y:0,dodge:true},{x:0,y:0}]);assert(a.extinctionDodge,'La solicitud viaja al servidor autoritativo');assert.equal(b.extinctionDodge,undefined);assert.equal(b.extinctionDodgeReadyAt,undefined,'El compañero conserva su propia recarga');for(let i=0;i<5;i++)sim.tick(.04,[{x:0,y:0},{x:0,y:0}]);assert(Math.abs(a.y)>55);
});

test('Extinción cooperativa: el servidor ejecuta las habilidades de rol y no la IA genérica',()=>{
 const {sim,P,s}=ready(true),M=P.MapEvents,p=sim.players[0];M.startWorld();const e=M.event;M.activateWorld(e);s.enemies=[];const raptor=M.spawnDinosaur(e,false,'raptor');raptor.x=p.x+100;raptor.y=p.y;raptor.roleCooldown=0;sim.tick(.04,[{},{}]);assert.equal(raptor.extinctionAttack?.kind,'warning','La autoridad cooperativa debe preparar el salto del Velociraptor');assert.equal(raptor.roleCooldown,2.8);
});

test('Extinción: cada rol expone una señal visual reconocible sin modificar combate',()=>{
 const {P,s}=ready(),M=P.MapEvents,p=s.player;M.startWorld();const e=M.event;M.activateWorld(e);s.enemies=[];const tank=M.spawnDinosaur(e,false,'ankylosaur'),raptor=M.spawnDinosaur(e,false,'raptor'),wing=M.spawnDinosaur(e,false,'pterosaur'),poison=M.spawnDinosaur(e,false,'dilophosaur'),healer=M.spawnDinosaur(e,false,'parasaur'),ram=M.spawnDinosaur(e,true,'triceratops');raptor.bornAt=s.elapsed-60;tank.guardTargetId=healer.targetId;tank.guardUntil=s.elapsed+2;wing.hasteUntil=2;wing.hasteVisualUntil=s.elapsed+2;poison.poisonVisualUntil=s.elapsed+1;poison.extinctionAttack={kind:'poisonWarning',left:.3,total:.45,targetX:p.x,targetY:p.y};healer.healVisualUntil=s.elapsed+1;healer.healVisualAmount=12;ram.extinctionAttack={kind:'warning',left:.5,x:1,y:0};p.poisonVisualUntil=s.elapsed+1;p.extinctionChargeSlowUntil=s.elapsed+1;const before=JSON.stringify({enemies:s.enemies,player:p}),calls={fill:0,stroke:0,text:0},ctx=new Proxy({save(){},restore(){},beginPath(){},closePath(){},moveTo(){},lineTo(){},quadraticCurveTo(){},translate(){},rotate(){},scale(){},arc(){},ellipse(){},fill(){calls.fill++},stroke(){calls.stroke++},fillRect(){calls.fill++},strokeRect(){calls.stroke++},fillText(){calls.text++},drawImage(){}},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)});M.drawPoisonWarnings(ctx);M.drawChargeLanes(ctx);M.drawPlayerStates(ctx);for(const q of s.enemies)M.drawEnemy(ctx,q);assert.equal(M.rageLevel(raptor),3);assert(calls.fill>12&&calls.stroke>12&&calls.text>0,'Auras, escudos, viento, veneno, curación y carril deben dibujarse');assert.equal(JSON.stringify({enemies:s.enemies,player:p}),before,'Las señales visuales no alteran la simulación');
});

test('Extinción: la tormenta se cierra por fase y los meteoritos presionan incluso dentro de la zona',()=>{
 const {P,s}=ready(),M=P.MapEvents,p=s.player;M.startWorld();const e=M.event;M.activateWorld(e);p.x=e.x;p.y=e.y;e.meteorPressureIn=0;M.tickWorld(.04);assert.equal(e.stormRadius,650);assert(e.fallingMeteors.length>0,'La lluvia también cae dentro de la zona segura');e.phase='fragments';M.tickStorm(e,1);assert(e.stormRadius<650&&e.stormRadius>560);p.x=e.x+e.stormRadius+50;const hp=p.hp;M.tickStorm(e,1);assert(p.hp<hp);e.remaining=10;M.spawnBoss(e);assert.equal(e.remaining,90,'El T-Rex siempre conserva una ventana mínima de combate');
});

test('Balance de Extinción: relojes, tormenta, recuperación y escalado cooperativo quedan acotados',()=>{
 const solo=ready(),duo=ready(true),A=solo.P.MapEvents,B=duo.P.MapEvents,sa=solo.s,sb=duo.s;sa.mapTime=sb.mapTime=600;A.startWorld();B.startWorld();const ea=A.event,eb=B.event,ba=A.extinctionBalance;assert.equal(ea.remaining,240);assert.deepEqual(Object.values(ba.stormRadii),[650,560,480]);assert.deepEqual(Object.values(ba.meteorCadence),[3.2,2.4,1.5]);const da=A.spawnDinosaur(ea,false,'raptor'),db=B.spawnDinosaur(eb,false,'raptor');assert.equal(da.max,82);assert.equal(db.max,115,'Dos jugadores aumentan 40% la vida de la manada, no 100%');sa.player.hp=50;sa.player.maxHp=100;A.recoverParty(ba.waveRecovery);assert.equal(sa.player.hp,58);A.spawnFragments(ea);B.spawnFragments(eb);const fa=sa.enemies.find(q=>q.extinctionFragment),fb=sb.enemies.find(q=>q.extinctionFragment);assert(Math.abs(fb.max/fa.max-1.4)<.01);A.spawnBoss(ea);B.spawnBoss(eb);assert(Math.abs(eb.boss.max/ea.boss.max-1.6)<.01,'El Tirano gana 60% de vida en dúo');assert.equal(ea.remaining>=ba.bossMinimum,true);A.beginDungeon(ea);assert.equal(ea.remaining,ba.dungeonSeconds);A.spawnDungeonBoss(ea);B.beginDungeon(eb);B.spawnDungeonBoss(eb);assert(Math.abs(eb.dungeonBoss.max/ea.dungeonBoss.max-1.5)<.01,'El jefe de mazmorra gana 50% de vida en dúo');assert(ea.remaining>=ba.dungeonBossMinimum);
});

test('Extinción: el HUD táctil comparte la ventana de esquiva y las acciones cambian la postura visual',()=>{
 const {P,s}=ready(),M=P.MapEvents,p=s.player;M.startWorld();const e=M.event;M.activateWorld(e);s.enemies=[];const tank=M.spawnDinosaur(e,false,'ankylosaur'),wing=M.spawnDinosaur(e,false,'pterosaur'),dilo=M.spawnDinosaur(e,false,'dilophosaur');tank.x=0;tank.y=0;p.x=100;p.y=0;tank.extinctionAttack={kind:'warning',left:.4,x:1,y:0};M.hud();assert.equal(P.$('#extinction-dodge').hidden,false,'El botón aparece en la misma ventana que Espacio');p.y=200;M.hud();assert.equal(P.$('#extinction-dodge').hidden,true,'Salir del carril oculta el botón');tank.extinctionAttack={kind:'charge',left:.2,x:1,y:0};const charge=M.dinoPose(tank);assert(charge.sx>1.1&&charge.sy<.9,'La carga estira y baja al atacante');wing.extinctionAttack={kind:'rescue',left:.3,targetId:tank.targetId};assert(M.dinoPose(wing).y<0,'El rescate levanta al Pterosaurio');dilo.extinctionAttack={kind:'poisonWarning',left:.1,total:.45,targetX:p.x,targetY:p.y};const poison=M.dinoPose(dilo);assert(poison.sx>1&&poison.angle>0,'El Dilofosaurio carga visualmente el escupitajo');
});

test('Impacto cooperativo: el servidor elige un jugador vivo y sincroniza la invasión con ambos',()=>{
 const {sim,P,s}=ready(true,'plaza'),M=P.MapEvents,[a,b]=sim.players;a.x=-500;a.y=80;b.x=620;b.y=-40;const positions=sim.players.map(p=>[p.x,p.y]);
 sim.tick(.04,[{x:1},{x:-1}]);let snap=JSON.parse(JSON.stringify(sim.snapshot()));assert(snap.mapEvent?.world);assert([0,1].includes(snap.mapEvent.targetSlot));assert.deepEqual(sim.players.map(p=>[p.x,p.y]),positions,'El servidor congela a los dos durante la toma');
 for(let i=0;i<165;i++)sim.tick(.04,[{x:1},{x:-1}]);snap=JSON.parse(JSON.stringify(sim.snapshot()));assert.equal(snap.mapEvent.phase,'invasion');assert.equal(snap.meteorImpacts.length,1);assert(snap.enemies.some(e=>e.extinctionDino));assert.doesNotThrow(()=>JSON.stringify(snap));
});

test('Extinción cooperativa: ambos deciden el portal, completan la mazmorra y reciben la misma reliquia',()=>{
 const {sim,P,s}=ready(true,'plaza'),M=P.MapEvents,[a,b]=sim.players;M.startWorld();const e=M.event;e.phase='boss';e.impacted=true;e.boss={extinctionBoss:true};const origins=sim.players.map(p=>({x:p.x,y:p.y,maxHp:p.maxHp}));
 M.defeated(e.boss);assert.equal(e.phase,'portal');assert(s.coins>=75);assert.equal(M.event,e,'El evento no termina al derrotar al jefe en dúo');
 a.x=e.x;a.y=e.y;b.x=e.x+300;b.y=e.y;const returnPositions=sim.players.map(p=>({x:p.x,y:p.y}));sim.activities.tick(0);let pending=sim.activities.pending;assert.equal(pending.kind,'extinction-portal');assert(sim.activities.choose(0,pending.id,0));assert.equal(sim.activities.pending,pending);assert(sim.activities.choose(1,pending.id,0));assert.equal(sim.activities.pending,null);assert.equal(e.phase,'dungeon');assert.equal(s.mode,'play');assert.notDeepEqual(sim.players.map(p=>({x:p.x,y:p.y})),returnPositions);
 for(let room=1;room<=3;room++){for(let i=0;i<5;i++)M.defeated({extinctionDino:true,dungeonDino:true,revived:true});if(room<3){assert.equal(e.phase,'dungeonChoice');sim.activities.tick(0);pending=sim.activities.pending;assert.equal(pending.kind,'extinction-room');sim.activities.choose(0,pending.id,room===1?1:0);sim.activities.choose(1,pending.id,room===1?1:0);assert.equal(e.phase,'dungeon')}}assert.equal(e.phase,'dungeonBoss');assert(e.dungeonBoss?.extinctionDungeonBoss);M.defeated(e.dungeonBoss);assert.equal(e.phase,'reward');sim.activities.tick(0);pending=sim.activities.pending;assert.equal(pending.kind,'extinction-reward');assert(sim.activities.choose(0,pending.id,0));assert(sim.activities.choose(1,pending.id,2),'El voto diferente conserva la decisión del anfitrión');assert.equal(M.event,null);
 for(const [i,p] of sim.players.entries()){assert.equal(p.extinctionRelic,'fossil');assert.equal(p.maxHp,origins[i].maxHp+35);assert.deepEqual({x:p.x,y:p.y},returnPositions[i])}
 assert.doesNotThrow(()=>JSON.stringify(sim.snapshot()));
});

test('Extinción cooperativa: si uno rechaza el portal, el equipo continúa sin entrar',()=>{
 const {sim,P}=ready(true),M=P.MapEvents;M.startWorld();const e=M.event;e.phase='portal';e.impacted=true;for(const p of sim.players){p.x=e.x;p.y=e.y}sim.activities.tick(0);const pending=sim.activities.pending;assert.equal(pending.kind,'extinction-portal');sim.activities.choose(0,pending.id,0);sim.activities.choose(1,pending.id,1);assert.equal(M.event,null);assert.equal(P.state.mode,'play');assert.equal(sim.activities.pending,null);
});

test('Reliquias cooperativas: daño y velocidad se calculan por dueño',()=>{
 const {sim,P,s}=ready(true),M=P.MapEvents,[a,b]=sim.players;M.worldPlayed=true;a.extinctionRelic='predator';b.extinctionRelic='fossil';a.predatorUntil=s.elapsed+5;b.predatorUntil=0;
 assert.equal(M.damageMultiplier({owner:a}),1.25);assert.equal(M.damageMultiplier({owner:b}),1);assert.equal(M.speedMultiplier(a),1.18);assert.equal(M.speedMultiplier(b),1);
 const start=a.x;sim.tick(.1,[{x:1,y:0},{x:0,y:0}]);assert(a.x-start>a.speed*.1,'El servidor incluye el bono de velocidad de la reliquia');
});

test('Eventos: el impacto tiene 65 % de probabilidad, momento variable, arte propio y minieventos sin repetición',()=>{
 const {P,s}=ready(),M=P.MapEvents,fs=require('node:fs'),path=require('node:path');M.reset(.64,.5);assert.equal(M.worldPlanned,true);assert(M.worldAt>=420&&M.worldAt<=1080);M.reset(.65,.5);assert.equal(M.worldPlanned,false);assert.equal(M.worldDue(),Infinity);
 M.worldPlayed=true;s.mapTime=1;assert(M.start(false,null,.99));const first=M.event.kind;M.event=null;assert(M.start(false,null,.99));assert.notEqual(M.event.kind,first);const source=fs.readFileSync(path.resolve(__dirname,'../src/systems/map-events.js'),'utf8');for(const file of ['meteor-cinematic-far-v1.webp','meteor-cinematic-mid-v1.webp','meteor-cinematic-v1.webp']){const art=path.resolve(__dirname,'../public/assets/environment/'+file);assert(fs.existsSync(art));assert(fs.statSync(art).size>20000);assert(source.includes(file))}const dinosaurs=path.resolve(__dirname,'../public/assets/enemies/extinction-dinosaurs-v4.webp');assert(fs.existsSync(dinosaurs));assert(fs.statSync(dinosaurs).size>90000);assert(source.includes('extinction-dinosaurs-v4.webp'));assert(source.includes('ctx.drawImage(image'));assert(source.includes('Math.pow(q,1.7)'));
});

test('Extinción: la mazmorra entrega una reliquia real y devuelve al jugador al mundo',()=>{
 const {P,s}=ready(),M=P.MapEvents,p=s.player;M.startWorld();const e=M.event;e.phase='portal';e.impacted=true;const origin={x:p.x,y:p.y};M.beginDungeon(e);assert.equal(e.phase,'dungeon');assert.equal(s.mode,'play');assert.notDeepEqual({x:p.x,y:p.y},origin);
 for(let room=1;room<=3;room++){for(let i=0;i<5;i++)M.defeated({extinctionDino:true,dungeonDino:true,revived:true});if(room<3){assert.equal(e.phase,'dungeonChoice');M.applyRoomChoice(e,room===1?'power':'heal')}}assert.equal(e.phase,'dungeonBoss');assert(e.dungeonBoss?.extinctionDungeonBoss);M.defeated(e.dungeonBoss);assert.equal(e.phase,'reward');assert.equal(s.mode,'extinction-reward');M.applyRelic(e,'predator');assert.equal(M.event,null);assert.equal(p.extinctionRelic,'predator');assert.deepEqual({x:p.x,y:p.y},origin);
 p.predatorUntil=s.elapsed+1;assert.equal(M.damageMultiplier({}),1.25);assert.equal(M.speedMultiplier(p),1.18);p.predatorUntil=0;assert.equal(M.damageMultiplier({}),1);
});

test('Fijar objetivo: el clic lógico prioriza el mismo blanco y el servidor conserva uno por jugador',()=>{
 const {sim,P,s}=ready(true),[a,b]=sim.players,near={x:a.x+40,y:a.y,hp:20,r:10,minionId:10},locked={x:a.x+100,y:a.y,hp:20,r:10,minionId:11};s.enemies=[near,locked];a.lockedTarget='minion:11';b.lockedTarget='minion:10';
 assert.equal(P.Combat.target(a,s.enemies,300),locked);assert.equal(P.Combat.target(b,s.enemies,300),near);sim.tick(.04,[{x:0,y:0,lockTarget:'minion:11'},{x:0,y:0,lockTarget:'minion:10'}]);assert.equal(a.lockedTarget,'minion:11');assert.equal(b.lockedTarget,'minion:10');locked.hp=0;assert.equal(P.Combat.target(a,s.enemies,300),near);assert.equal(a.lockedTarget,null);
});

test('Extinción: el tiempo agotado falla con retorno seguro y el sanador reanima una sola vez',()=>{
 const {P,s}=ready(),M=P.MapEvents;M.startWorld();const e=M.event;M.activateWorld(e);const healer=M.spawnDinosaur(e,false,'parasaur'),victim=M.spawnDinosaur(e,false,'raptor');victim.x=healer.x+20;victim.y=healer.y;victim.hp=0;assert.equal(M.defeated(victim),true);assert(victim.hp>0);victim.hp=0;assert.notEqual(M.defeated(victim),true,'La reanimación del mismo sanador solo ocurre una vez');
 e.remaining=.01;M.tickWorld(.02);assert.equal(M.event,null);assert(M.safeReturn>0);assert.equal(M.blocksSpawns(),true);
});

test('Triceratops fósil: dos placas absorben daño antes de exponer el cristal',()=>{
 const {P}=ready(),M=P.MapEvents;M.startWorld();const e=M.event;M.beginDungeon(e);M.spawnDungeonBoss(e);const boss=e.dungeonBoss;for(let plate=0;plate<2;plate++){assert.equal(M.modifyDamage(boss,boss.plateHp+1),0)}assert.equal(boss.fossilPlates,0);assert.equal(boss.crystal,true);assert.equal(M.modifyDamage(boss,50),50);
});

test('Laboratorio de ambiente: permite forzar cada hora, clima y evento sin alterar el reloj',()=>{
 const {P,s}=ready(),bench=P.TestBench,M=P.MapEvents;bench.active=true;s.devRun=true;s.balanceTest=true;s.mode='play';s.mapTime=42;M.worldPlayed=true;P.Terrain.hit=()=>null;
 assert(P.$('#bench-environment'));assert.notEqual(P.$('#bench-environment').hidden,true);assert(P.$('#bench-climate'));assert(P.$('#bench-weather'));assert(P.$('#bench-event'));
 bench.climate='4';bench.weather='storm';assert.equal(P.DayNight.current().label,'NOCHE');assert.equal(P.Weather.current().storm,true);assert.equal(P.Weather.current().intensity,1);assert.equal(s.mapTime,42);
 bench.weather='clear';assert.equal(P.Weather.current().intensity,0);bench.eventChoice='garua';assert(bench.startEvent());assert.equal(M.event.kind,'garua');assert.equal(M.event.phase,'warning');
 for(let i=0;i<180;i++)M.tick(.04);assert.equal(M.event.phase,'active');bench.stopEvent();assert.equal(M.event,null);assert.equal(M.impacts.length,0);
 s.mode='upgrade';bench.eventChoice='world';bench.hud();assert.notEqual(P.$('#bench-event-start').disabled,true);assert(bench.startEvent());assert(M.cinematic(),'El evento queda preparado durante una mejora');s.mode='play';assert(M.tick(.04));bench.stopEvent();
 s.balanceTest=false;s.practice=true;bench.climate='5';bench.weather='auto';bench.eventChoice='kite';bench.hud();assert.notEqual(P.$('#bench-event-start').disabled,true,'El botón funciona también en Práctica');assert.equal(P.DayNight.current().label,'TORMENTA FINAL');assert.equal(P.Weather.current().storm,true);assert(bench.startEvent());assert.equal(M.event.kind,'kite');M.tick(.04);assert.equal(M.event.phase,'warning');bench.stopEvent();
 bench.climate='auto';bench.weather='auto';assert.equal(bench.climatePreview(),null);assert.equal(bench.weatherPreview(),null);
});
