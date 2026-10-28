'use strict';
// Minieventos opcionales de Supervivencia. Estado pequeño y visuales acotados.
P.MapEvents={
  event:null,impacts:[],nextAt:165,serial:0,cadence:165,miniDue:720,miniPlayed:false,worldPlayed:false,worldPlanned:false,worldAt:Infinity,worldChance:.65,lastKind:null,meteorFrames:null,meteorArtFailed:false,dinosaurAtlas:null,dinosaurArtFailed:false,relicMeteor:0,
  catalog:{
    campo:[
      {kind:'meteor',name:'Lluvia de meteoritos',verb:'Recoge los fragmentos del impacto',color:'#ffb85c'},
      {kind:'picnic',name:'Picnic desordenado',verb:'Recupera los víveres antes de que se pierdan',color:'#f27e64'},
      {kind:'kite',name:'Cometa a la deriva',verb:'Recoge las cintas que dejó el viento',color:'#77d9ed'}
    ],
    plaza:[
      {kind:'garua',name:'Garúa en la Plaza',verb:'Sigue los reflejos que aparecen en el suelo',color:'#91e5ee'},
      {kind:'palomas',name:'Bandada alborotada',verb:'Reúne las plumas que dejó la bandada',color:'#e7d9c5'},
      {kind:'faroles',name:'Faroles encendidos',verb:'Activa los tres destellos del jardín',color:'#ffd071'}
    ],
    machu:[
      {kind:'condor',name:'Sombra del cóndor',verb:'Sigue la ruta de plumas hasta las terrazas',color:'#d4c3a3'},
      {kind:'wind',name:'Ráfaga de altura',verb:'Recoge los ecos que dejó el viento',color:'#8ce2e3'},
      {kind:'terrazas',name:'Ecos de las terrazas',verb:'Reúne las piedras antiguas',color:'#e4b974'}
    ]
  },
  reset(worldRoll=Math.random(),timingRoll=Math.random()){this.event=null;this.impacts=[];this.nextAt=165;this.serial=0;this.miniDue=720;this.miniPlayed=false;this.worldPlayed=false;this.lastKind=null;this.relicMeteor=0;const chaos=P.RunMode?.isChaos?.(),duo=this.players().length>1;this.worldPlanned=chaos?worldRoll<this.worldChance:duo;this.worldAt=this.worldPlanned?(chaos?420+Math.floor(timingRoll*661):105):Infinity;this.loadArt()},
  active(){return !!this.event},
  players(){const party=P.Court?.players?.()||[P.state.player,...(P.Coop?.peers||[])];return party.filter(p=>p?.hp>0)},
  cinematic(){return !!this.event?.world&&this.event.phase==='cinematic'},
  worldDue(){return this.worldAt},
  loadArt(){if(typeof Image==='undefined')return;if(!this.meteorFrames&&!this.meteorArtFailed){const sources=['assets/environment/meteor-cinematic-far-v1.webp','assets/environment/meteor-cinematic-mid-v1.webp','assets/environment/meteor-cinematic-v1.webp'];this.meteorFrames=Array(sources.length).fill(null);let failed=0;sources.forEach((src,index)=>{const image=new Image();image.onload=()=>{this.meteorFrames[index]=image};image.onerror=()=>{if(++failed===sources.length)this.meteorArtFailed=true};image.src=src})}if(!this.dinosaurAtlas&&!this.dinosaurArtFailed){const image=new Image();image.onload=()=>{this.dinosaurAtlas=image};image.onerror=()=>{this.dinosaurArtFailed=true};image.src='assets/enemies/extinction-dinosaurs-v1.webp'}},
  blocked(){const s=P.state;return s.mode!=='play'||s.encounter||s.bossSpawned||s.mapTime>=P.Data.arena.duration||s.portal?.open||P.RunMode.portalWarning(s.mapTime)>=0||P.Market?.shopping||P.Market?.available?.()||P.Exploration?.station?.phase==='active'||P.Performance?.active||P.Progression?.cinematicOnly?.()||s.enemies.some(e=>e.hp>0&&(e.miniboss||e.mapBoss||e.boss))},
  safePoint(x,y){return !P.Terrain.hit(x,y,44)&&Math.hypot(x-P.Encounters.definition().portal.x,y-P.Encounters.definition().portal.y)>180},
  startWorld(){
    const s=P.state,players=this.players();if(!players.length)return false;const pick=Math.abs(P.Chunks.hash(Math.floor(s.mapTime),this.serial,911))%players.length,anchor=players[pick];let point=null;
    const turn=(P.Chunks.hash(Math.floor(anchor.x/256),Math.floor(anchor.y/256),this.serial+773)%628)/100;
    for(let i=0;i<14;i++){const a=turn+i*2.399,d=420+(i%4)*46,x=Math.round(anchor.x+Math.cos(a)*d),y=Math.round(anchor.y+Math.sin(a)*d*.7),portal=P.Encounters.definition().portal;if(!P.Terrain.hit(x,y,100)&&Math.hypot(x-portal.x,y-portal.y)>560){point={x,y};break}}
    if(!point)return false;this.worldPlayed=true;this.serial++;this.event={kind:'meteor',world:true,extinction:true,name:'Extinción',verb:'sobrevive a lo que trajo el meteorito',color:'#ff9d55',x:point.x,y:point.y,anchorX:anchor.x,anchorY:anchor.y,targetSlot:anchor.slot??0,phase:'cinematic',age:0,left:6.4,total:6.4,points:[],collected:0,serial:this.serial,impacted:false,invasionKills:0,invasionTarget:8,fragmentsDown:0,dungeonKills:0,dungeonTarget:15,spawnIn:.5};
    P.Loot.notify('EVENTO MUNDIAL · EXTINCIÓN · ALGO SE ACERCA DESDE EL CIELO');P.Audio.fx('boss');return true
  },
  impact(e){
    if(e.impacted)return;e.impacted=true;const destroyed=[];
    for(const o of P.Terrain.props){if(!o.solid||o.meteorImpact||Math.hypot(o.x-e.x,o.y-e.y)>310||String(o.id).startsWith('landmark')||String(o.id).startsWith('chaos:'))continue;if(!(o.generated||o.kind==='crate'||['tree','bench','lamp','planter','grass','rock','wall','fence','grave','pine','gift','snowman'].includes(o.kind)))continue;o.solid=false;destroyed.push(o.id);if(o.generated)P.Chunks.broken.add(o.id)}
    const removed=P.state.enemies.filter(q=>q.hp>0&&!q.boss&&!q.mapBoss&&!q.miniboss&&Math.hypot(q.x-e.x,q.y-e.y)<=320);for(const q of removed)P.Entities.burst(q.x,q.y,'#ffb56b');P.state.enemies=P.state.enemies.filter(q=>!removed.includes(q));
    const impact={id:'meteor:'+e.serial,x:e.x,y:e.y,radius:320,seed:e.serial*97,destroyed};this.impacts.push(impact);e.impactId=impact.id;P.Terrain.revision++;P.Terrain.flow=null;this.ensureTerrain();P.Entities.burst(e.x,e.y,'#ffb56b');P.Audio.fx('boss');P.Loot.notify('¡IMPACTO! · LA ONDA BORRÓ '+removed.length+' MINIONS')
  },
  rubble(impact){return Array.from({length:10},(_,i)=>{const a=i*Math.PI*2/10+.31,r=impact.radius*(.61+(i%2)*.13);return {id:impact.id+':rubble:'+i,kind:'chaos-rubble',x:Math.round(impact.x+Math.cos(a)*r),y:Math.round(impact.y+Math.sin(a)*r*.58),w:64+(i%3)*15,h:38+(i%2)*12,solid:i%3!==0,hp:Infinity,meteorImpact:true}})},
  ensureTerrain(){
    if(!this.impacts.length)return;const destroyed=new Set(this.impacts.flatMap(q=>q.destroyed||[])),ids=new Set(this.impacts.flatMap(q=>this.rubble(q).map(o=>o.id)));let changed=false;
    for(const o of P.Terrain.props)if(destroyed.has(o.id)&&o.solid){o.solid=false;if(o.generated)P.Chunks.broken.add(o.id);changed=true}
    const present=new Set(P.Terrain.props.filter(o=>o.meteorImpact).map(o=>o.id));for(const impact of this.impacts)for(const o of this.rubble(impact))if(!present.has(o.id)){P.Terrain.props.push(o);changed=true}
    if(changed||[...ids].some(id=>!present.has(id))){P.Terrain.revision++;P.Terrain.flow=null;P.Terrain.indexProps()}
  },
  activateWorld(e){e.phase='invasion';e.left=0;e.total=0;e.spawnIn=.1;P.Loot.notify('EXTINCIÓN · INVASIÓN PREHISTÓRICA · DERROTA 8 DINOSAURIOS');P.Audio.fx('upgrade')},
  spawnDinosaur(e,dungeon=false){
    const kinds=dungeon?['raptor','triceratops','pterosaur']:e.phase==='invasion'?['raptor','raptor','triceratops','pterosaur']:['raptor','pterosaur'],kind=kinds[Math.abs(P.Chunks.hash(e.serial,Math.floor(P.state.elapsed*10),P.state.enemies.length))%kinds.length],a=(P.state.elapsed*2.1+P.state.enemies.length*2.399)%(Math.PI*2),center=dungeon?(e.dungeonCenter||e):e,d=dungeon?330+(P.state.enemies.length%3)*38:235+(P.state.enemies.length%4)*34,q=P.Entities.enemy();
    Object.assign(q,{x:Math.round(center.x+Math.cos(a)*d),y:Math.round(center.y+Math.sin(a)*d*.68),hp:kind==='triceratops'?105:kind==='pterosaur'?58:72,max:kind==='triceratops'?105:kind==='pterosaur'?58:72,r:kind==='triceratops'?24:kind==='pterosaur'?19:18,speed:kind==='triceratops'?52:kind==='pterosaur'?92:82,design:null,heavy:kind==='triceratops',progressive:false,extinctionDino:true,dungeonDino:dungeon,dinoKind:kind,attackProfile:null,rangedCooldown:999});P.Terrain.resolve(q,{x:center.x,y:center.y},q.r);P.state.enemies.push(q);return q
  },
  spawnFragments(e){
    e.phase='fragments';e.spawnIn=1.8;e.fragmentsDown=0;const hp=190+Math.floor(P.state.mapTime/180)*20;e.points=Array.from({length:3},(_,i)=>{const a=e.serial*.4+i*Math.PI*2/3,q=P.Attributes.init({x:Math.round(e.x+Math.cos(a)*165),y:Math.round(e.y+Math.sin(a)*105),hp,max:hp,r:27,speed:0,design:null,progressive:false,extinctionFragment:true,fragmentIndex:i,hit:0});P.state.enemies.push(q);return {x:q.x,y:q.y,taken:false,index:i}});P.Loot.notify('TRES FRAGMENTOS ALIMENTAN LA INVASIÓN · DESTRÚYELOS');P.Audio.fx('boss')
  },
  spawnBoss(e){
    e.phase='boss';e.points=[];P.state.enemies=P.state.enemies.filter(q=>!q.extinctionDino&&q.hp>0);const hp=1500+Math.floor(P.state.mapTime/300)*180,b=P.Attributes.init({x:e.x,y:e.y-40,hp,max:hp,r:58,speed:76,design:null,progressive:false,extinctionBoss:true,hit:0,extinctionCooldown:1.3,extinctionAttack:null,facing:-1});P.state.enemies.push(b);e.bossId=e.serial;e.boss=b;P.Loot.notify('¡DESPERTÓ EL TIRANO DEL CRÁTER! · DERROTARLO ES OBLIGATORIO');P.Audio.fx('boss')
  },
  blocksSpawns(){return !!this.event?.extinction&&['cinematic','invasion','fragments','boss','portal','dungeon','reward'].includes(this.event.phase)},
  moveEnemy(q,dt){
    const e=this.event,s=P.state,p=s.player;if(!e?.extinction)return false;if(q.extinctionFragment){q.hit=Math.max(0,(q.hit||0)-dt);return true}if(!q.extinctionBoss)return false;q.hit=Math.max(0,(q.hit||0)-dt);const old={x:q.x,y:q.y},dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy)||1;q.facing=Math.sign(dx)||q.facing||1;
    if(q.extinctionAttack?.kind==='warning'){q.extinctionAttack.left-=dt;if(q.extinctionAttack.left<=0){q.extinctionAttack={kind:'charge',left:.62,x:q.extinctionAttack.x,y:q.extinctionAttack.y};P.Audio.fx('boss')}return true}
    if(q.extinctionAttack?.kind==='charge'){const attack=q.extinctionAttack;q.x+=attack.x*390*dt;q.y+=attack.y*390*dt;P.Terrain.resolve(q,old,q.r);attack.left-=dt;if(attack.left<=0||Math.hypot(q.x-old.x,q.y-old.y)<1){q.extinctionAttack=null;q.extinctionCooldown=1.4;q.recover=.75}return this.bossContact(q,p)}
    if((q.recover||0)>0){q.recover=Math.max(0,q.recover-dt);return this.bossContact(q,p)}q.extinctionCooldown-=dt;if(q.extinctionCooldown<=0){if(d>230&&s.danger.length<20){const a=Math.atan2(dy,dx);for(const off of [-.18,0,.18])s.danger.push({...P.Attributes.source(q,'special'),x:q.x,y:q.y-12,vx:Math.cos(a+off)*235,vy:Math.sin(a+off)*235,age:0,life:3,damage:13,kind:'spread',glyph:'FÓSIL',color:'#ff7a3d',history:[]});q.extinctionCooldown=2.4}else{q.extinctionAttack={kind:'warning',left:1.05,x:dx/d,y:dy/d};q.extinctionCooldown=3}return true}q.x+=dx/d*q.speed*dt;q.y+=dy/d*q.speed*dt;P.Terrain.resolve(q,old,q.r);return this.bossContact(q,p)
  },
  bossContact(q,p){if(Math.hypot(p.x-q.x,p.y-q.y)<q.r+18&&p.inv<=0){P.PlayerFeedback.hit(p,22,q);p.inv=.75;P.Entities.burst(p.x,p.y,'#ff8e5c');if(p.hp<=0)P.Game.finish(false)}return true},
  defeated(q){
    const e=this.event,s=P.state,p=s.player;if(p?.extinctionRelic==='predator')p.predatorUntil=s.elapsed+5;if(!e?.extinction)return;
    if(q.extinctionDino){if(q.dungeonDino&&e.phase==='dungeon'){e.dungeonKills++;if(e.dungeonKills>=e.dungeonTarget)this.chooseRelic(e)}else if(e.phase==='invasion'){e.invasionKills++;if(e.invasionKills>=e.invasionTarget)this.spawnFragments(e)}return}
    if(q.extinctionFragment&&e.phase==='fragments'){e.fragmentsDown++;const point=e.points.find(x=>x.index===q.fragmentIndex);if(point)point.taken=true;P.Loot.notify('FRAGMENTO DESTRUIDO · '+e.fragmentsDown+'/3');if(e.fragmentsDown>=3)this.spawnBoss(e);return}
    if(q.extinctionBoss&&e.phase==='boss'){e.boss=null;s.coins+=75;P.Audio.fx('win');if(this.players().length>1){P.Loot.notify('TIRANO DERROTADO · +75 MONEDAS · EXTINCIÓN SUPERADA EN EQUIPO');this.event=null}else{e.phase='portal';e.portalOffered=false;P.Loot.notify('TIRANO DERROTADO · +75 MONEDAS · EL PORTAL PREHISTÓRICO SE ABRIÓ')}}
  },
  damageMultiplier(source){const p=P.state.player;return p?.extinctionRelic==='predator'&&(p.predatorUntil||0)>P.state.elapsed?1.25:1},
  speedMultiplier(p){return p?.extinctionRelic==='predator'&&(p.predatorUntil||0)>P.state.elapsed?1.18:1},
  tickRelic(dt){const s=P.state,p=s.player;if(!p)return;if(p.extinctionRelic==='fossil')p.hp=Math.min(p.maxHp,p.hp+dt*.8);if(p.extinctionRelic!=='celestial'||s.mode!=='play')return;this.relicMeteor-=dt;if(this.relicMeteor>0)return;const target=P.Combat.target(p,s.enemies.filter(q=>q.hp>0),520);if(!target){this.relicMeteor=.5;return}this.relicMeteor=4.5;P.Entities.burst(target.x,target.y,'#ff9b55');for(const q of s.enemies)if(q.hp>0&&Math.hypot(q.x-target.x,q.y-target.y)<72+q.r)P.Entities.hurt(q,p.power*.7,10,{owner:p,damageType:'special',extinctionMeteor:true})},
  offerPortal(e){
    if(e.portalOffered||typeof document==='undefined')return;e.portalOffered=true;const s=P.state;s.mode='extinction-portal';P.Core.clear();P.UI.show('Portal prehistórico','El jefe cayó. Puedes entrar a una mazmorra corta de dinosaurios para conseguir una reliquia exclusiva o continuar la partida.',[{title:'Entrar a la era perdida ↗',description:'15 dinosaurios · una reliquia al terminar.',action:()=>this.beginDungeon(e)},{title:'Continuar la partida',description:'Conservas las 75 monedas del jefe.',action:()=>{s.mode='play';P.$('#overlay').hidden=true;this.event=null;P.UI.hud()}}])
  },
  beginDungeon(e){const s=P.state;e.returnPlayers=this.players().map(p=>({slot:p.slot??0,x:p.x,y:p.y}));e.phase='dungeon';e.dungeonCenter={x:e.x,y:e.y};e.dungeonKills=0;e.spawnIn=.1;e.dungeonProps=P.Terrain.props.filter(o=>o.solid&&Math.hypot(o.x-e.x,o.y-e.y)<720).map(o=>({id:o.id,solid:o.solid}));for(const saved of e.dungeonProps){const prop=P.Terrain.props.find(o=>o.id===saved.id);if(prop)prop.solid=false}P.Terrain.revision++;P.Terrain.flow=null;P.Terrain.indexProps();s.enemies=s.enemies.filter(q=>!q.extinctionDino&&!q.extinctionBoss&&!q.extinctionFragment);s.danger=[];for(const [i,p] of this.players().entries()){p.x=e.x+(i?95:-95);p.y=e.y+145;p.inv=2}s.mode='play';P.$('#overlay').hidden=true;P.Loot.notify('ERA PERDIDA · DERROTA 15 DINOSAURIOS');P.UI.hud()},
  chooseRelic(e){if(e.phase!=='dungeon'||typeof document==='undefined')return;e.phase='reward';P.state.mode='extinction-reward';P.Core.clear();const options=[['fossil','Corazón fósil','+35 vida máxima y regeneración constante.'],['predator','Colmillo del depredador','Tras cada derrota obtienes 5 s de +25% daño y +18% velocidad.'],['celestial','Fragmento celeste','Un meteorito pequeño golpea enemigos cercanos cada pocos segundos.']];P.UI.show('Reliquia de Extinción','La mazmorra quedó asegurada. Elige una reliquia para el resto de esta partida.',options.map(([id,title,description])=>({title,description,action:()=>this.applyRelic(e,id)})))},
  applyRelic(e,id){const s=P.state,p=s.player;for(const saved of e.dungeonProps||[]){const prop=P.Terrain.props.find(o=>o.id===saved.id);if(prop)prop.solid=saved.solid}P.Terrain.revision++;P.Terrain.flow=null;P.Terrain.indexProps();p.extinctionRelic=id;if(id==='fossil'){p.maxHp+=35;p.hp=Math.min(p.maxHp,p.hp+35)}for(const q of e.returnPlayers||[]){const target=this.players().find(p=>(p.slot??0)===q.slot);if(target){target.x=q.x;target.y=q.y;target.inv=2}}s.enemies=s.enemies.filter(q=>!q.extinctionDino&&!q.extinctionBoss&&!q.extinctionFragment);s.danger=[];s.mode='play';P.$('#overlay').hidden=true;P.Loot.notify('RELIQUIA OBTENIDA · '+({fossil:'CORAZÓN FÓSIL',predator:'COLMILLO DEL DEPREDADOR',celestial:'FRAGMENTO CELESTE'}[id]));this.event=null;P.UI.hud()},
  tickWorld(dt){
    const e=this.event,s=P.state;if(!e?.world)return false;if(this.impacts.length)this.ensureTerrain();s.mapTime=Math.max(0,s.mapTime-dt);if(e.phase==='cinematic'){e.age+=dt;e.left=Math.max(0,e.total-e.age);for(const p of this.players())p.inv=Math.max(p.inv||0,dt+.25);if(e.age>=4.75&&!e.impacted)this.impact(e);if(e.age>=e.total)this.activateWorld(e);return true}
    if(e.phase==='invasion'||e.phase==='fragments'||e.phase==='dungeon'){e.spawnIn-=dt;const alive=s.enemies.filter(q=>q.extinctionDino&&q.hp>0&&(e.phase==='dungeon'?q.dungeonDino:!q.dungeonDino)).length,limit=e.phase==='dungeon'?7:e.phase==='invasion'?6:3;if(e.spawnIn<=0&&alive<limit){this.spawnDinosaur(e,e.phase==='dungeon');e.spawnIn=e.phase==='dungeon'?.65:e.phase==='invasion'?.8:1.5}}
    if(e.phase==='portal'){const near=this.players().some(p=>Math.hypot(p.x-e.x,p.y-e.y)<125);if(near)this.offerPortal(e)}
    if(e.phase==='boss'){for(const p of this.players()){const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1;if(d>520){p.x=e.x+dx/d*520;p.y=e.y+dy/d*520;p.inv=Math.max(p.inv||0,.18)}}}
    if(e.phase==='dungeon'){for(const p of this.players()){const dx=p.x-e.x,dy=p.y-e.y;if(Math.abs(dx)>560)p.x=e.x+Math.sign(dx)*560;if(Math.abs(dy)>360)p.y=e.y+Math.sign(dy)*360}}
    return false
  },
  start(miniGame=false,forcedKind=null,roll=Math.random()){
    const s=P.state,map=P.Maps.current().eventBase||P.Maps.current().id,options=this.catalog[map]||this.catalog.campo;
    const available=options.filter(event=>event.kind!==this.lastKind),pool=available.length?available:options;let definition=forcedKind?Object.values(this.catalog).flat().find(event=>event.kind===forcedKind):pool[Math.min(pool.length-1,Math.floor(Math.max(0,Math.min(.999999,roll))*pool.length))];if(!definition)return false;const angle=(this.serial*2.399+P.Chunks.hash(Math.floor(s.player.x/768),Math.floor(s.player.y/768),this.serial)*Math.PI*2);
    let point=null;
    for(let i=0;i<10;i++){const a=angle+i*2.399,d=260+(i%3)*48,x=Math.round(s.player.x+Math.cos(a)*d),y=Math.round(s.player.y+Math.sin(a)*d*.7);if(this.safePoint(x,y)){point={x,y};break}}
    if(!point){this.nextAt=s.mapTime+5;return false}
    this.serial++;this.lastKind=definition.kind;
    if(miniGame){const signature={campo:{kind:'meteor',color:'#ffb85c'},plaza:{kind:'faroles',color:'#ffd071'},machu:{kind:'condor',color:'#d4c3a3'}}[map]||{};definition={...definition,...signature,miniGame:true,name:map==='campo'?'Reto del meteorito':map==='plaza'?'Circuito de faroles':'Ruta del cóndor',verb:'completa el recorrido recogiendo sus señales'};this.miniPlayed=true}
    this.event={...definition,...point,phase:'warning',left:7,total:7,points:[],collected:0,serial:this.serial,miniGame};
    this.nextAt=s.mapTime+this.cadence;
    P.Loot.notify((miniGame?'MINIJUEGO OPCIONAL · ':'MINIEVENTO · ')+definition.name+' · prepárate');P.Audio.fx('whistle');
    return true
  },
  activate(e){
    const offsets=e.miniGame?[[-90,-44],[0,-70],[92,-33],[-58,67],[55,75]]:[[-54,-35],[55,-24],[4,59]],turn=e.serial*.71;
    e.points=offsets.map(([x,y],i)=>{const a=turn+i*2.094;let q={x:Math.round(e.x+x*Math.cos(a)-y*Math.sin(a)),y:Math.round(e.y+x*Math.sin(a)+y*Math.cos(a)),taken:false};if(!this.safePoint(q.x,q.y))q={x:Math.round(e.x+Math.cos(a)*110),y:Math.round(e.y+Math.sin(a)*80),taken:false};return q});
    e.phase='active';e.left=e.miniGame?60:45;e.total=e.left;
    P.Loot.notify(e.name+' · '+e.verb+' · '+e.left+' s');P.Audio.fx('upgrade');
  },
  tick(dt){
    const s=P.state;
    this.tickRelic(dt);
    if(s.mode!=='play'||s.devRun&&!s.balanceTest&&!P.TestBench?.active||P.Performance?.active)return false;
    if(this.event?.world)return this.tickWorld(dt);
    if(!this.worldPlayed&&s.mapTime>=this.worldDue()&&!this.blocked()&&!s.miniWarning){if(this.startWorld())return true}
    if(!P.RunMode?.isChaos()&&!s.balanceTest&&!P.TestBench?.active)return false;
    let e=this.event;
    if(!e){if(this.blocked()||s.miniWarning)return;if(!this.miniPlayed&&s.mapTime>=this.miniDue){this.start(true);return}if(s.mapTime<this.nextAt)return;this.start();return}
    // Los portales pausan el reto; el jefe final cancela cualquier actividad pendiente.
    if(s.bossSpawned||s.mapTime>=P.Data.arena.duration){this.event=null;return false}
    if(s.encounter||s.portal?.open||P.RunMode.portalWarning(s.mapTime)>=0||P.Market?.shopping||P.Market?.available?.()||P.Exploration?.station?.phase==='active')return;
    e.left=Math.max(0,e.left-dt);
    if(e.phase==='warning'&&e.left<=0){this.activate(e);return}
    if(e.phase!=='active')return;
    const p=s.player;
    for(const q of e.points){if(q.taken||Math.hypot(p.x-q.x,p.y-q.y)>46)continue;q.taken=true;e.collected++;s.coins+=5;P.Audio.fx('upgrade-pick');P.Loot.notify('Fragmento recuperado · +5 monedas')}
    if(e.collected>=e.points.length){const bonus=e.miniGame?25:10;P.Loot.notify((e.miniGame?'¡MINIJUEGO COMPLETADO!':'¡MINIEVENTO COMPLETADO!')+' · +'+bonus+' monedas extra');s.coins+=bonus;this.event=null;P.UI.hud();return}
    if(e.left<=0){P.Loot.notify(e.collected?'El minievento terminó · conservas las monedas':'El minievento terminó · puedes seguir con la partida');this.event=null}return false
  },
  camera(player,w,h,zoom){
    const e=this.event;if(!e?.world||e.phase!=='cinematic'||P.Ambient.reduced?.matches)return null;const smooth=q=>{q=Math.max(0,Math.min(1,q));return q*q*(3-2*q)},age=e.age||0;
    if(age<1)return {x:player.x,y:player.y-55,zoom};if(age<3){const q=smooth((age-1)/2);return {x:e.anchorX+(e.x-e.anchorX)*q*.25,y:e.anchorY-55-q*430,zoom:zoom*(1-q*.15)}}if(age<4.75){const q=smooth((age-3)/1.75);return {x:e.anchorX+(e.x-e.anchorX)*q,y:e.anchorY-485+(e.y-e.anchorY+430)*q,zoom:zoom*.85}}const q=smooth((age-4.75)/1.25);return {x:e.x+(player.x-e.x)*q*.15,y:e.y-35+(player.y-e.y-20)*q*.15,zoom:zoom*(.85+q*.15)}
  },
  drawImpact(ctx,impact){
    const t=P.state.elapsed,rx=impact.radius,ry=impact.radius*.56;ctx.save();ctx.translate(impact.x,impact.y);ctx.fillStyle='#15232977';ctx.beginPath();ctx.ellipse(8,13,rx+22,ry+17,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3a302d';ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#171b20';ctx.beginPath();ctx.ellipse(0,2,rx*.72,ry*.67,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#e37a45';ctx.lineWidth=8;ctx.globalAlpha=.55+.12*Math.sin(t*2);ctx.beginPath();ctx.ellipse(0,0,rx*.76,ry*.7,0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;for(let i=0;i<18;i++){const a=i*.73+impact.seed,r=rx*(.72+(i%4)*.13),x=Math.cos(a)*r,y=Math.sin(a)*r*.56;ctx.strokeStyle=i%3?'#6d5142':'#bd6842';ctx.lineWidth=i%3?4:6;ctx.beginPath();ctx.moveTo(Math.cos(a)*rx*.65,Math.sin(a)*ry*.65);ctx.lineTo(x,y);ctx.lineTo(x+Math.cos(a+.7)*32,y+Math.sin(a+.7)*19);ctx.stroke()}ctx.restore()
  },
  drawDungeon(ctx,e){const t=P.state.elapsed,reduced=P.Ambient.reduced?.matches;ctx.save();ctx.translate(e.x,e.y);ctx.fillStyle='#172a20';ctx.beginPath();ctx.ellipse(0,0,640,430,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#6d9257';ctx.lineWidth=18;ctx.stroke();ctx.fillStyle='#2f5135';for(let i=0;i<34;i++){const a=i*2.399,r=210+(i%5)*78,x=Math.cos(a)*r,y=Math.sin(a)*r*.65;ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillRect(-7,-32,14,64);ctx.fillStyle=i%2?'#4c7a48':'#365f3c';ctx.beginPath();ctx.arc(0,-34,24+(i%3)*6,0,Math.PI*2);ctx.fill();ctx.restore()}ctx.fillStyle='#b9a56d';for(let i=0;i<16;i++){const a=i*1.77,r=60+(i%4)*105;ctx.save();ctx.translate(Math.cos(a)*r,Math.sin(a)*r*.62);ctx.rotate(a+t*(reduced?0:.2));ctx.beginPath();ctx.ellipse(0,0,12,6,0,0,Math.PI*2);ctx.fill();ctx.restore()}ctx.globalAlpha=.16;ctx.fillStyle='#9ce38c';for(let i=0;i<10;i++){const x=-500+i*111,y=-280+(i%3)*210;ctx.beginPath();ctx.arc(x,y,70,0,Math.PI*2);ctx.fill()}ctx.restore()},
  drawEnemy(ctx,e){
    if(!e?.extinctionDino&&!e?.extinctionBoss&&!e?.extinctionFragment)return false;const atlas=this.dinosaurAtlas,hit=e.hit>0;if(e.extinctionFragment){ctx.save();ctx.translate(e.x,e.y);ctx.rotate(P.state.elapsed*.35+e.fragmentIndex);ctx.shadowColor='#ff703c';ctx.shadowBlur=14;ctx.fillStyle=hit?'#fff3ce':'#552b37';ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(25,-5);ctx.lineTo(13,29);ctx.lineTo(-17,27);ctx.lineTo(-28,-6);ctx.closePath();ctx.fill();ctx.strokeStyle='#ff9859';ctx.lineWidth=5;ctx.stroke();ctx.fillStyle='#ffd16d';ctx.fillRect(-5,-14,10,28);ctx.fillRect(-14,-5,28,10);ctx.restore();this.drawEnemyBar(ctx,e,'FRAGMENTO '+(e.fragmentIndex+1));return true}
    const frame=e.extinctionBoss?3:e.dinoKind==='triceratops'?1:e.dinoKind==='pterosaur'?2:0,height=e.extinctionBoss?158:e.dinoKind==='pterosaur'?82:e.dinoKind==='triceratops'?74:80;if(atlas?.complete&&atlas.naturalWidth){const sw=atlas.naturalWidth/4,sh=atlas.naturalHeight,scale=height/sh,w=sw*scale;ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(e.x),Math.round(e.y+8));if(e.facing>0)ctx.scale(-1,1);ctx.globalAlpha=hit ? .65 : 1;ctx.drawImage(atlas,Math.floor(frame*sw),0,Math.ceil(sw),sh,-w/2,-height,w,height);ctx.restore()}else{ctx.save();ctx.translate(e.x,e.y);ctx.fillStyle=e.extinctionBoss?'#342329':e.dinoKind==='pterosaur'?'#329ea0':e.dinoKind==='triceratops'?'#dc8738':'#54943e';ctx.beginPath();ctx.ellipse(0,-22,e.extinctionBoss?55:30,e.extinctionBoss?42:22,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff0bd';ctx.fillRect(-7,-30,14,7);ctx.restore()}if(e.extinctionBoss){if(e.extinctionAttack?.kind==='warning'){ctx.save();ctx.strokeStyle='#ffb15f';ctx.lineWidth=5;ctx.globalAlpha=.75;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+e.extinctionAttack.x*290,e.y+e.extinctionAttack.y*290);ctx.stroke();ctx.restore()}this.drawEnemyBar(ctx,e,'TIRANO DEL CRÁTER')}return true
  },
  drawEnemyBar(ctx,e,label){ctx.save();const w=e.extinctionBoss?150:92,y=e.y-(e.extinctionBoss?172:58);ctx.fillStyle='#151b25';ctx.fillRect(e.x-w/2,y,w,8);ctx.fillStyle=e.extinctionBoss?'#ff6845':'#ffad57';ctx.fillRect(e.x-w/2,y,w*Math.max(0,e.hp/e.max),8);ctx.font='bold '+(e.extinctionBoss?12:9)+'px monospace';ctx.textAlign='center';ctx.fillStyle='#fff0c5';ctx.fillText(label,e.x,y-6);ctx.restore()},
  draw(ctx){
    const e=this.event,s=P.state;if(e?.extinction&&e.phase==='dungeon'&&s.mode==='play')this.drawDungeon(ctx,e);if(s.mode==='play'&&!s.encounter)for(const impact of this.impacts)this.drawImpact(ctx,impact);if(e?.extinction&&e.phase==='boss'&&s.mode==='play'){ctx.save();ctx.strokeStyle='#ff8a4e';ctx.lineWidth=9;ctx.globalAlpha=.38;ctx.beginPath();ctx.arc(e.x,e.y,520,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=.08;ctx.fillStyle='#ff5f3c';ctx.beginPath();ctx.arc(e.x,e.y,520,0,Math.PI*2);ctx.fill('evenodd');ctx.restore()}if(!e||s.mode!=='play'||s.encounter||s.portal?.open||P.RunMode.portalWarning(s.mapTime)>=0||P.Market?.shopping||P.Market?.available?.()||P.Exploration?.station?.phase==='active'||s.bossSpawned)return;
    const reduced=P.Ambient.reduced?.matches,elapsed=s.elapsed;
    ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(e.x),Math.round(e.y));
    if(e.kind==='meteor'){
      ctx.fillStyle='#202b2c55';ctx.beginPath();ctx.ellipse(0,12,78,31,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=e.phase==='warning'||e.phase==='cinematic'?'#ffc66d':'#df7444';ctx.lineWidth=e.world?7:4;ctx.beginPath();ctx.ellipse(0,0,e.world?112:64,e.world?49:25,0,0,Math.PI*2);ctx.stroke();
      if(e.phase==='warning'&&!reduced){ctx.fillStyle='#ffe092';ctx.fillRect(Math.sin(elapsed*7)*40-2,-75,4,22)}
      if(e.phase==='active'&&!e.world){ctx.fillStyle='#5b392f';ctx.fillRect(-22,-4,44,16);ctx.fillStyle='#cf7650';ctx.fillRect(-12,-1,24,7)}
      if(e.world&&e.phase==='portal'){const pulse=reduced?0:Math.sin(elapsed*3)*9;ctx.globalAlpha=.25;ctx.fillStyle='#8fe2b0';ctx.beginPath();ctx.ellipse(0,-38,72+pulse,96+pulse,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle='#d7ff9b';ctx.lineWidth=7;ctx.beginPath();ctx.ellipse(0,-38,48,76,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#fff0b8';ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.fillText('PORTAL PREHISTÓRICO',0,60)}
    }else if(e.kind==='garua'){
      ctx.strokeStyle=e.color;ctx.globalAlpha=.65;ctx.lineWidth=3;for(let i=0;i<3;i++){const radius=26+i*19+(reduced?0:Math.sin(elapsed*2+i)*2);ctx.beginPath();ctx.ellipse(0,3,radius,radius*.42,0,0,Math.PI*2);ctx.stroke()}
      ctx.globalAlpha=.55;ctx.fillStyle='#c9edf0';if(!reduced)for(let i=0;i<12;i++){const x=((i*37+Math.floor(elapsed*18))%150)-75,y=((i*53+Math.floor(elapsed*27))%72)-36;ctx.fillRect(x,y,2,7)}
    }else if(e.kind==='wind'){
      ctx.strokeStyle=e.color;ctx.globalAlpha=.7;ctx.lineWidth=3;for(let i=0;i<4;i++){const y=(i-1.5)*13,shift=reduced?0:Math.sin(elapsed*2+i)*12;ctx.beginPath();ctx.moveTo(-66+shift,y);ctx.lineTo(-18,y-4);ctx.lineTo(28+shift,y+3);ctx.lineTo(65,y-2);ctx.stroke()}
    }else if(e.kind==='condor'){
      ctx.fillStyle='#17232c55';ctx.beginPath();ctx.ellipse(0,4,65,20,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#1b2730';ctx.beginPath();ctx.moveTo(-60,-12);ctx.lineTo(-18,-5);ctx.lineTo(0,3);ctx.lineTo(18,-5);ctx.lineTo(60,-12);ctx.lineTo(35,5);ctx.lineTo(11,0);ctx.lineTo(0,15);ctx.lineTo(-11,0);ctx.lineTo(-35,5);ctx.closePath();ctx.fill();ctx.fillRect(-3,-16,6,18);ctx.fillRect(2,-16,9,4)
    }else if(e.kind==='picnic'){
      ctx.fillStyle='#26302d66';ctx.fillRect(-48,8,96,10);for(let x=-36;x<36;x+=18)for(let y=-20;y<16;y+=18){ctx.fillStyle=((x+y)/18)%2?'#d86455':'#f2dfb5';ctx.fillRect(x,y,18,18)}ctx.fillStyle='#51432f';ctx.fillRect(-7,-30,14,12);ctx.fillStyle='#dfad61';ctx.fillRect(-4,-27,8,7)
    }else if(e.kind==='kite'){
      ctx.strokeStyle='#e8d6ae';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-12,19);ctx.lineTo(13,36);ctx.stroke();ctx.fillStyle=e.color;ctx.beginPath();ctx.moveTo(0,-31);ctx.lineTo(24,-4);ctx.lineTo(0,20);ctx.lineTo(-24,-4);ctx.closePath();ctx.fill();ctx.fillStyle='#f5e7bb';ctx.fillRect(-3,-7,6,6)
    }else if(e.kind==='faroles'){
      for(let i=-1;i<=1;i++){const x=i*39;ctx.fillStyle='#263b35';ctx.fillRect(x-3,-20,6,46);ctx.fillRect(x-12,24,24,5);ctx.fillStyle='#d9b870';ctx.fillRect(x-9,-29,18,13);ctx.fillStyle='#fff0ae';ctx.fillRect(x-5,-25,10,6);ctx.globalAlpha=.16;ctx.fillStyle='#ffcf71';ctx.beginPath();ctx.arc(x,-22,25,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}
    }else if(e.kind==='palomas'){
      ctx.fillStyle='#17232c55';ctx.beginPath();ctx.ellipse(0,8,66,18,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=e.color;for(let i=0;i<4;i++){const x=(i-1.5)*28,flight=reduced?0:Math.round(Math.sin(elapsed*5+i)*5);ctx.fillRect(x-7,-5+flight,14,5);ctx.fillRect(x-17,-10+flight,11,3);ctx.fillRect(x+6,-11+flight,11,3);ctx.fillRect(x+7,-1+flight,3,7)}
    }else if(e.kind==='terrazas'){
      ctx.fillStyle='#332e2a55';ctx.fillRect(-60,12,120,11);ctx.fillStyle='#80644c';for(let i=0;i<3;i++){const w=110-i*25;ctx.fillRect(-w/2,7-i*14,w,7);ctx.fillStyle=i===2?'#e4b974':'#a38868'}ctx.fillStyle=e.color;ctx.fillRect(-7,-39,14,12);ctx.fillRect(-12,-27,24,7)
    }else{
      ctx.fillStyle='#15242155';ctx.fillRect(-48,7,96,12);ctx.strokeStyle=e.color;ctx.lineWidth=3;ctx.strokeRect(-44,-7,88,12);
    }
    if(e.phase==='warning'){
      ctx.fillStyle='#fff3c9';ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.fillText(Math.ceil(e.left)+' s',0,-47)
    }
    if(e.phase==='active')for(let i=0;i<e.points.length;i++){
      const q=e.points[i];if(q.taken)continue;const pulse=reduced?0:Math.sin(elapsed*4+i)*2;
      ctx.fillStyle=e.color;ctx.fillRect(Math.round(q.x-e.x)-7,Math.round(q.y-e.y)-7+pulse,14,14);
      ctx.fillStyle='#fff1c9';ctx.fillRect(Math.round(q.x-e.x)-2,Math.round(q.y-e.y)-2+pulse,4,4);
    }
    ctx.restore()
  },
  cinematicMeteor(ctx,mx,my,size,alpha,reduced,progress){this.loadArt();const frames=this.meteorFrames||[],position=Math.max(0,Math.min(2,progress*2)),index=Math.min(2,Math.floor(position)),blend=position-index,draw=(image,opacity,turn)=>{if(!image||opacity<=0)return;const width=size*3.45,height=width*(image.height/image.width);ctx.save();ctx.globalAlpha=alpha*opacity;ctx.shadowColor='#ff6a2d';ctx.shadowBlur=reduced?0:Math.max(10,size*.38);ctx.translate(mx,my);ctx.rotate(turn);ctx.drawImage(image,-width*.27,-height*.72,width,height);ctx.restore()};if(frames.some(Boolean)){draw(frames[index]||frames.find(Boolean),1-blend,-.045+progress*.025);if(index<2)draw(frames[index+1],blend,-.025+progress*.02)}else{ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle='#ff8f4f';ctx.lineWidth=Math.max(7,size*.28);ctx.beginPath();ctx.moveTo(mx+size*2.8,my-size*2.2);ctx.lineTo(mx,my);ctx.stroke();ctx.fillStyle='#fff0b0';ctx.beginPath();ctx.arc(mx,my,size*.54,0,Math.PI*2);ctx.fill();ctx.restore()}if(reduced)return;ctx.save();const count=7+Math.floor(progress*15);for(let i=0;i<count;i++){const drift=(P.state.elapsed*(75+progress*65)+i*41)%(size*(2.4+progress)),x=mx+size*.45+drift,y=my-size*.35-drift*.62+Math.sin(i*2.1+P.state.elapsed*4)*size*.2,rock=i%5===0;ctx.globalAlpha=alpha*(rock ? .72 : .86);ctx.fillStyle=rock?'#5b3028':i%3?'#ff6a2d':'#ffe39a';ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(i*.8+P.state.elapsed*(rock?3:1));const particle=Math.max(2,(rock?5:3)+progress*3);ctx.fillRect(-particle/2,-particle/2,particle,particle);ctx.restore()}ctx.restore()},
  overlay(ctx,w,h){
    const e=this.event;if(!e?.world||e.phase!=='cinematic'||P.state.mode==='menu')return;const t=e.age||0,reduced=P.Ambient.reduced?.matches,sky=Math.max(0,Math.min(1,(t-.65)/1.15)),impact=Math.max(0,Math.min(1,(t-4.75)/.8));ctx.save();ctx.fillStyle='#07111d';ctx.globalAlpha=sky*(1-impact*.75)*.72;ctx.fillRect(0,0,w,h);ctx.globalAlpha=sky*(1-impact*.6);for(let i=0;i<28;i++){const x=(i*137+e.serial*31)%w,y=(i*73+e.serial*17)%Math.max(1,h*.62);ctx.fillStyle=i%4?'#b9c7d0':'#ffe2a2';ctx.fillRect(x,y,i%5?2:3,i%5?2:3)}const raw=Math.max(0,Math.min(1,(t-1.05)/3.7)),q=raw*raw*(3-2*raw),mx=w*(.92-q*.42),my=-h*.28+q*(h*.78+Math.min(72,h*.08)),endSize=Math.max(80,Math.min(122,Math.min(w,h)*.18)),size=6+Math.pow(q,1.7)*(endSize-6);if(sky>0)this.cinematicMeteor(ctx,mx,my,size,sky*(1-impact),reduced,q);if(impact>0){ctx.globalAlpha=(1-impact)*.82;ctx.fillStyle='#fff4d0';ctx.fillRect(0,0,w,h)}ctx.globalAlpha=Math.min(1,t*2)*Math.max(0,1-(t-5.8)*2);ctx.textAlign='center';ctx.font='900 '+Math.max(18,Math.min(34,w/30))+'px monospace';ctx.fillStyle='#fff0c2';ctx.fillText(t<1.15?'ALGO SE ACERCA…':t<4.75?'IMPACTO INMINENTE':'EL TERRENO CAMBIÓ',w/2,h*.16);if(reduced){ctx.globalAlpha=.16;ctx.fillStyle='#ff9d55';ctx.fillRect(0,h*.47,w,4)}ctx.restore()
  },
  hud(){
    const el=P.$('#event-status');if(!el)return;const e=this.event;if(!e)return;if(P.state.mode!=='play'||P.state.encounter||P.state.portal?.open||P.RunMode.portalWarning(P.state.mapTime)>=0||P.Market?.shopping||P.Market?.available?.()||P.Exploration?.station?.phase==='active'||P.state.bossSpawned){el.hidden=true;return}
    if(e.world&&e.phase==='cinematic'){el.hidden=false;el.textContent='EVENTO MUNDIAL · '+e.name+' · impacto en '+Math.ceil(e.left)+' s · mira el cielo';return}
    if(e.extinction){const boss=P.state.enemies.find(q=>q.extinctionBoss&&q.hp>0),dx=e.x-P.state.player.x,dy=e.y-P.state.player.y,guide=P.Loot.keyDirection(dx,dy)+' '+Math.round(Math.hypot(dx,dy))+' m',labels={invasion:'INVASIÓN · '+e.invasionKills+'/'+e.invasionTarget+' DINOSAURIOS',fragments:'FRAGMENTOS · '+e.fragmentsDown+'/3 DESTRUIDOS · '+guide,boss:'JEFE · '+Math.max(0,Math.ceil(boss?.hp||0))+' / '+Math.ceil(boss?.max||0)+' PV · '+guide,portal:'PORTAL PREHISTÓRICO · '+guide,dungeon:'ERA PERDIDA · '+e.dungeonKills+'/'+e.dungeonTarget+' DINOSAURIOS',reward:'ELIGE TU RELIQUIA'};el.hidden=false;el.textContent='EXTINCIÓN · '+(labels[e.phase]||e.phase.toUpperCase());return}
    const progress=e.phase==='warning'?' · en '+Math.ceil(e.left)+' s':' · '+e.collected+'/'+e.points.length+' · '+Math.ceil(e.left)+' s';
    el.hidden=false;el.textContent=(e.world?'EVENTO MUNDIAL · ':e.miniGame?'MINIJUEGO · ':'')+e.name+progress+' · '+(e.phase==='warning'?'se aproxima':e.world?'recoge los núcleos':'recoge las señales');
  }
};
