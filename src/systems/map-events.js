'use strict';
// Minieventos opcionales de Supervivencia. Estado pequeño y visuales acotados.
P.MapEvents={
  event:null,nextAt:165,serial:0,cadence:165,miniDue:720,miniPlayed:false,
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
  reset(){this.event=null;this.nextAt=165;this.serial=0;this.miniDue=720;this.miniPlayed=false},
  active(){return !!this.event},
  blocked(){const s=P.state;return s.mode!=='play'||s.encounter||s.bossSpawned||s.mapTime>=P.Data.arena.duration||s.portal?.open||P.RunMode.portalWarning(s.mapTime)>=0||P.Market?.shopping||P.Market?.available?.()||P.Exploration?.station?.phase==='active'||P.Performance?.active||P.Progression?.cinematicOnly?.()||s.enemies.some(e=>e.hp>0&&(e.miniboss||e.mapBoss||e.boss))},
  safePoint(x,y){return !P.Terrain.hit(x,y,44)&&Math.hypot(x-P.Encounters.definition().portal.x,y-P.Encounters.definition().portal.y)>180},
  start(miniGame=false){
    const s=P.state,map=P.Maps.current().id,options=this.catalog[map]||this.catalog.campo;
    let definition=options[this.serial%options.length];const angle=(this.serial*2.399+P.Chunks.hash(Math.floor(s.player.x/768),Math.floor(s.player.y/768),this.serial)*Math.PI*2);
    let point=null;
    for(let i=0;i<10;i++){const a=angle+i*2.399,d=260+(i%3)*48,x=Math.round(s.player.x+Math.cos(a)*d),y=Math.round(s.player.y+Math.sin(a)*d*.7);if(this.safePoint(x,y)){point={x,y};break}}
    if(!point){this.nextAt=s.mapTime+5;return false}
    this.serial++;
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
    if(!P.RunMode?.isChaos()||s.mode!=='play'||s.devRun||P.Performance?.active)return;
    let e=this.event;
    if(!e){if(this.blocked()||s.miniWarning)return;if(!this.miniPlayed&&s.mapTime>=this.miniDue){this.start(true);return}if(s.mapTime<this.nextAt)return;this.start();return}
    // Los portales pausan el reto; el jefe final cancela cualquier actividad pendiente.
    if(s.bossSpawned||s.mapTime>=P.Data.arena.duration){this.event=null;return}
    if(s.encounter||s.portal?.open||P.RunMode.portalWarning(s.mapTime)>=0||P.Market?.shopping||P.Market?.available?.()||P.Exploration?.station?.phase==='active')return;
    e.left=Math.max(0,e.left-dt);
    if(e.phase==='warning'&&e.left<=0){this.activate(e);return}
    if(e.phase!=='active')return;
    const p=s.player;
    for(const q of e.points){if(q.taken||Math.hypot(p.x-q.x,p.y-q.y)>46)continue;q.taken=true;e.collected++;s.coins+=5;P.Audio.fx('upgrade-pick');P.Loot.notify('Fragmento recuperado · +5 monedas')}
    if(e.collected>=e.points.length){const bonus=e.miniGame?25:10;P.Loot.notify((e.miniGame?'¡MINIJUEGO COMPLETADO!':'¡MINIEVENTO COMPLETADO!')+' · +'+bonus+' monedas extra');s.coins+=bonus;this.event=null;P.UI.hud();return}
    if(e.left<=0){P.Loot.notify(e.collected?'El minievento terminó · conservas las monedas':'El minievento terminó · puedes seguir con la partida');this.event=null}
  },
  draw(ctx){
    const e=this.event,s=P.state;if(!e||s.mode!=='play'||s.encounter||s.portal?.open||P.RunMode.portalWarning(s.mapTime)>=0||P.Market?.shopping||P.Market?.available?.()||P.Exploration?.station?.phase==='active'||s.bossSpawned)return;
    const reduced=P.Ambient.reduced?.matches,elapsed=s.elapsed;
    ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(e.x),Math.round(e.y));
    if(e.kind==='meteor'){
      ctx.fillStyle='#202b2c55';ctx.beginPath();ctx.ellipse(0,12,78,31,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=e.phase==='warning'?'#ffc66d':'#df7444';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,0,64,25,0,0,Math.PI*2);ctx.stroke();
      if(e.phase==='warning'&&!reduced){ctx.fillStyle='#ffe092';ctx.fillRect(Math.sin(elapsed*7)*40-2,-75,4,22)}
      if(e.phase==='active'){ctx.fillStyle='#5b392f';ctx.fillRect(-22,-4,44,16);ctx.fillStyle='#cf7650';ctx.fillRect(-12,-1,24,7)}
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
  hud(){
    const el=P.$('#event-status');if(!el)return;const e=this.event;if(!e)return;if(P.state.mode!=='play'||P.state.encounter||P.state.portal?.open||P.RunMode.portalWarning(P.state.mapTime)>=0||P.Market?.shopping||P.Market?.available?.()||P.Exploration?.station?.phase==='active'||P.state.bossSpawned){el.hidden=true;return}
    const progress=e.phase==='warning'?' · en '+Math.ceil(e.left)+' s':' · '+e.collected+'/'+e.points.length+' · '+Math.ceil(e.left)+' s';
    el.hidden=false;el.textContent=(e.miniGame?'MINIJUEGO · ':'')+e.name+progress+' · '+(e.phase==='warning'?'se aproxima':'recoge las señales');
  }
};
