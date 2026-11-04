'use strict';
// Estado de combate serializable: la misma máquina corre en solitario y en el servidor.
P.SantaBoss={
 definition:{name:'Papá Noel del Caos',kind:'santa',color:'#d95762',hp:1650,healthBars:2,bossSpawn:{x:-200,y:170},r:58,speed:46,role:'Controlador / Invocador',damageProfile:'Especial · trineo físico',combatStats:{attribute:'wit',damageType:'special',physicalAttack:100,specialAttack:110,physicalDefense:100,specialDefense:100,penetration:0,statusResistance:0,healthRegen:0,criticalChance:0,criticalDamage:1.5,criticalResistance:0,criticalDefense:0,recoveryRate:1,lifeSteal:0},ultimate:'Reparto de medianoche',domain:'Taller de Nochebuena',passives:['Abrigo del taller: recibe 25 % menos daño mientras viva alguno de sus duendes.','Saco abierto: recibe 20 % más daño durante la recuperación.'],guide:'Sal de los regalos y del carril rojo; busca el centro o el exterior del anillo. Elimina a los duendes y ataca durante la recuperación.',portal:{x:420,y:220}},
 attacks:['Regalos explosivos','Trineo rasante','Ventisca circular','Turno de duendes'],
 party(){return (P.Combat.party||[P.state.player]).filter(p=>p&&p.hp>0)},
 init(e){return e.santaState||(e.santaState={phase:'idle',timer:1.5,attack:0,phaseTwo:false,domainUsed:false,ultimateUsed:false,nodes:[],wave:0,safe:0})},
 set(e,phase,time){const c=this.init(e);c.phase=phase;c.timer=time;e.phase='santa-'+phase;e.attackT=time},
 recover(e){this.set(e,'recover',1.6)},
 marks(e){const c=this.init(e);c.nodes=this.party().flatMap(p=>[-1,0,1].map(i=>({x:Math.max(-590,Math.min(590,p.x+i*105)),y:Math.max(-280,Math.min(280,p.y+(i===0?0:-65))),r:58}))).slice(0,6)},
 start(e){const c=this.init(e),slot=c.attack++%4;if(slot===0){this.marks(e);this.set(e,'gifts',1.4)}else if(slot===1){c.lane=Math.max(-235,Math.min(235,this.party()[0]?.y||0));e.x=-400;e.y=c.lane;this.set(e,'sleigh-warning',1.5)}else if(slot===2)this.set(e,'snow',1.5);else this.set(e,'elves',1.4)},
 hit(e,damage,type,p){P.PlayerFeedback.hit(p,damage,{...P.Attributes.source(e,type),x:e.x,y:e.y})},
 damageScale(e){return (P.state.enemies.some(a=>a.santaElf&&a.hp>0)?.75:1)*(e.santaState?.phase==='recover'?1.2:1)},
 summon(e){const count=P.state.enemies.filter(a=>a.santaElf&&a.hp>0).length;for(let i=0;i<Math.min(3,4-count);i++){const elf=P.Entities.enemy();Object.assign(elf,{x:-210+i*210,y:-190,hp:90,max:90,r:15,speed:65,design:4,profession:'elf',santaElf:true,progressive:false});P.Attributes.init(elf);P.state.enemies.push(elf)}},
 domain(e){const c=this.init(e);c.domainUsed=true;c.wave=0;c.safe=0;this.set(e,'domain',4.2)},
 ultimate(e){const c=this.init(e);c.ultimateUsed=true;c.wave=0;this.marks(e);this.set(e,'ultimate',1.4)},
 quadrant(p){return (p.y>=0?2:0)+(p.x>=0?1:0)},
 move(e,dt){const c=this.init(e);e.hit=Math.max(0,(e.hit||0)-dt);c.phaseTwo=e.hp<=e.max*.5;
  if(c.phase==='idle'){if(c.phaseTwo&&!c.domainUsed){this.domain(e);return}if(e.hp<=e.max*.25&&!c.ultimateUsed){this.ultimate(e);return}const p=this.party()[0];if(p){const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy);if(d>155){const step=Math.min(d-155,e.speed*dt);e.x+=dx/d*step;e.y+=dy/d*step}}c.timer-=dt;if(c.timer<=0)this.start(e);return}
  if(c.phase==='sleigh'){const previous=e.x;e.x=Math.min(400,e.x+720*dt);for(const p of this.party())if(p.x>=previous-25&&p.x<=e.x+25&&Math.abs(p.y-c.lane)<48+(p.r||12))this.hit(e,22,'physical',p);if(e.x>=400)this.recover(e);return}
  c.timer-=dt;if(c.timer>0)return;
  if(c.phase==='recover'){this.set(e,'idle',c.phaseTwo?1.1:1.7);return}
  if(c.phase==='sleigh-warning'){this.set(e,'sleigh',2);return}
  if(c.phase==='gifts'||c.phase==='ultimate'){for(const z of c.nodes)if(P.state.effects.length<240)P.Entities.burst(z.x,z.y,'#ffc96a');for(const p of this.party())if(c.nodes.some(z=>Math.hypot(p.x-z.x,p.y-z.y)<z.r+(p.r||12)))this.hit(e,c.phase==='ultimate'?24:22,'special',p);if(c.phase==='ultimate'&&++c.wave<3){this.marks(e);this.set(e,'ultimate',1.4);return}}
  else if(c.phase==='snow'){for(const p of this.party()){const d=Math.hypot(p.x-e.x,p.y-e.y);if(d>130-(p.r||12)&&d<280+(p.r||12))this.hit(e,20,'special',p)}}
  else if(c.phase==='elves')this.summon(e);
  else if(c.phase==='domain'){for(const p of this.party())if(this.quadrant(p)!==c.safe)this.hit(e,18,'special',p);if(++c.wave<4){c.safe=(c.safe+1)%4;this.set(e,'domain',2.4);return}}
  this.recover(e)
 },
 load(){if(this.image||this.loading||Date.now()<(this.retryAt||0)||typeof Image==='undefined')return;const image=new Image();image.onload=()=>{this.image=image};image.onerror=()=>{this.loading=false;this.retryAt=Date.now()+10000};image.src='assets/bosses/santa-claus-v1.webp';this.loading=true},
 background(ctx,cx,cy,w,h,time){ctx.fillStyle='#1c3540';ctx.fillRect(cx-w,cy-h,w*2,h*2);ctx.strokeStyle='#ffffff0c';ctx.lineWidth=2;for(let x=-960;x<=960;x+=80){ctx.beginPath();ctx.moveTo(x,-640);ctx.lineTo(x,640);ctx.stroke()}for(let y=-640;y<=640;y+=80){ctx.beginPath();ctx.moveTo(-960,y);ctx.lineTo(960,y);ctx.stroke()}ctx.fillStyle='#c4dfdd';ctx.fillRect(-720,-400,1440,22);ctx.fillRect(-720,378,1440,22);for(let i=0;i<16;i++){ctx.fillStyle=i%2?'#efbd63':'#db6278';ctx.fillRect(-650+i*85,-386,12,16)}ctx.fillStyle='#f2ddae';ctx.font='bold 28px monospace';ctx.textAlign='center';ctx.fillText('TALLER DE NOCHEBUENA',0,-420)},
 drawActor(ctx,e){this.load();const c=e.santaState,frame=c?.phase==='recover'?5:c?.phase==='sleigh'?1+Math.floor((P.state.elapsed||0)*8)%2:c&&c.phase!=='idle'?3:0;ctx.save();ctx.fillStyle='#071a2370';ctx.beginPath();ctx.ellipse(e.x,e.y+28,54,17,0,0,Math.PI*2);ctx.fill();if(c?.phase.startsWith('sleigh')){ctx.fillStyle='#9b4d38';ctx.fillRect(e.x-65,e.y+12,130,17);ctx.strokeStyle='#efce7c';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(e.x-70,e.y+38);ctx.lineTo(e.x+65,e.y+38);ctx.quadraticCurveTo(e.x+85,e.y+38,e.x+85,e.y+12);ctx.stroke()}if(this.image){ctx.imageSmoothingEnabled=false;ctx.drawImage(this.image,(frame%3)*256,Math.floor(frame/3)*256,256,256,e.x-95,e.y-145,190,190)}else{ctx.fillStyle='#cb334b';ctx.fillRect(e.x-40,e.y-95,80,115);ctx.fillStyle='#fff0da';ctx.beginPath();ctx.arc(e.x,e.y-105,32,0,Math.PI*2);ctx.fill()}if(this.damageScale(e)<1){ctx.strokeStyle='#87e1dd';ctx.lineWidth=3;ctx.beginPath();ctx.arc(e.x,e.y-40,76,0,Math.PI*2);ctx.stroke()}ctx.restore();return true},
 draw(ctx,e){const c=e.santaState;if(!c)return;ctx.save();let label='';ctx.fillStyle='#f25c703b';ctx.strokeStyle='#ff9b88';ctx.lineWidth=3;
  if(c.phase==='gifts'||c.phase==='ultimate'){label=c.phase==='ultimate'?'REPARTO DE MEDIANOCHE · SAL DE LOS REGALOS':'REGALOS · SAL DEL CÍRCULO';for(const z of c.nodes){ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#edbf62';ctx.fillRect(z.x-10,z.y-10,20,20);ctx.fillStyle='#f25c703b'}}
  else if(c.phase.startsWith('sleigh')){label='TRINEO · SAL DEL CARRIL';ctx.fillRect(-620,c.lane-60,1240,120);ctx.strokeRect(-620,c.lane-60,1240,120)}
  else if(c.phase==='snow'){label='VENTISCA · CENTRO O EXTERIOR';ctx.beginPath();ctx.arc(e.x,e.y,280,0,Math.PI*2);ctx.arc(e.x,e.y,130,0,Math.PI*2,true);ctx.fill();ctx.stroke()}
  else if(c.phase==='domain'){label='TALLER · BUSCA EL VERDE';for(let i=0;i<4;i++){ctx.fillStyle=i===c.safe?'#69e3b54d':'#e858674d';ctx.fillRect(i%2?0:-680,i<2?-360:0,680,360)}ctx.fillStyle='#ddffe8';ctx.font='bold 22px monospace';ctx.textAlign='center';ctx.fillText('SEGURO',c.safe%2?240:-240,c.safe<2?-140:160)}
  else if(c.phase==='elves')label='DUENDES · ROMPE SU ABRIGO';else if(c.phase==='recover')label='SACO ABIERTO · ATACA';
  ctx.restore();if(label){const parts=label.split(' · '),target=c.phase==='domain'?{x:c.safe%2?150:-150,y:c.safe<2?-100:100,r:35}:null;P.Encounters.actionPrompt(ctx,e,parts[1],parts[0],{target,targetLabel:'SEGURO',safe:c.phase==='recover'||c.phase==='domain'&&this.quadrant(P.state.player)===c.safe,color:'#ffb38d'})}
 }
};
(()=>{const B=P.SantaBoss,E=P.Encounters,A=P.BossArt;
 E.catalog.santa=B.definition;A.scenes.santa={id:'taller-nochebuena',name:'Taller de Nochebuena',asset:null,color:'#243f47',bounds:{left:-680,right:680,top:-360,bottom:360}};
 const pool=E.portalPool;E.portalPool=function(){const list=pool.call(this);return P.Maps.current().id==='navidad'?[...list,B.definition]:list};
 const cover=E.cover;E.cover=function(kind){return kind==='santa'?[]:cover.call(this,kind)};
 const move=E.bossMove;E.bossMove=function(e,dt){if(e.kind==='santa')return B.move(e,dt);return move.call(this,e,dt)};
 const draw=E.drawBoss;E.drawBoss=function(ctx,e){if(e.kind==='santa'){B.draw(ctx,e);B.drawActor(ctx,e);return}return draw.call(this,ctx,e)};
 const hurt=P.Entities.hurt;P.Entities.hurt=function(e,damage,push=0,source=null){return hurt.call(this,e,e.kind==='santa'?damage*B.damageScale(e):damage,push,source)};
 const entries=P.Lobby.codexEntries;P.Lobby.codexEntries=function(){return entries.call(this).map(e=>e.kind==='santa'?{...e,attacks:B.attacks,practice:'santa',arena:A.scenes.santa.name}:e)};
 const portrait=P.Lobby.codexBossPortrait;P.Lobby.codexBossPortrait=function(ctx,e){return e.kind==='santa'?B.drawActor(ctx,e):portrait.call(this,ctx,e)};

})();
