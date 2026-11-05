'use strict';
// Proyección visual: observa cambios ya resueltos por la simulación y nunca altera el combate.
P.PlayerStatus={
 records:new WeakMap(),
 now(){return Number(P.state?.elapsed)||0},
 remaining(state){return Math.max(0,Number.isFinite(state.left)?state.left:(state.until||0)-this.now())},
 cabinet(){return P.state?.enemies?.find(e=>P.CabinetBoss?.eligible?.(e))?.cabinetState||null},
 permanent(actor){
  const states=[],supplies=actor.preparedSupplies||[],ranks=actor.powerRanks||{},upgrades=Object.entries(ranks).filter(([id,n])=>id.startsWith('stat:')&&n>0),sacrifices=actor.runSacrifices||{};
  if(supplies.length){const names=supplies.map(id=>P.Supply?.items?.[id]?.name||id);states.push({id:'supplies',icon:'▣',label:'MOCHILA ×'+supplies.length,detail:names.join(' · '),persistent:true,body:false})}
  if(upgrades.length){const total=upgrades.reduce((n,[,rank])=>n+rank,0),names=upgrades.map(([id,rank])=>{const key=id.slice(5),name=P.Data?.upgrades?.find(q=>q.id===key)?.title||key;return name+' ×'+rank});states.push({id:'upgrades',icon:'▲',label:'MEJORAS ×'+total,detail:names.join(' · '),persistent:true,body:false})}
  if(sacrifices.power)states.push({id:'pact-power',icon:'◆',label:'RATING ×'+sacrifices.power,detail:'−15 vida máxima y +40 % daño por pacto',persistent:true,body:false,kind:'mixed'});
  if(sacrifices.tempo)states.push({id:'pact-tempo',icon:'»',label:'CABINA ×'+sacrifices.tempo,detail:'−20 % velocidad y 28 % menos intervalo por pacto',persistent:true,body:false,kind:'mixed'});
  return states
 },
 observe(actor){
  let record=this.records.get(actor),hp=Number(actor?.hp);
  if(!record){record={hp,healUntil:0,healAmount:0,hurtUntil:0};this.records.set(actor,record);return record}
  const now=this.now();
  if(Number.isFinite(hp)&&Number.isFinite(record.hp)&&hp>record.hp+.01){
   if(record.healUntil<=now)record.healAmount=0;
   record.healAmount=Math.max(record.healAmount,hp-record.hp);
   record.healUntil=now+1.05
  }
  if(Number.isFinite(hp)&&Number.isFinite(record.hp)&&hp<record.hp-.01)record.hurtUntil=now+.22;
  record.hp=hp;
  return record
 },
 states(actor){
  if(!actor)return [];
  const now=this.now(),record=this.observe(actor),slowUntil=Math.max(actor.tacticSlowUntil||0,actor.extinctionSlowUntil||0,actor.extinctionChargeSlowUntil||0,actor.dynamicZoneSlowUntil||0,actor.fiscalSlowUntil||0),states=[],cabinet=this.cabinet();
  if(record.healUntil>now)states.push({id:'heal',icon:'+',label:'CURACIÓN',detail:'Vida recuperada: '+Math.ceil(record.healAmount),color:'#8ff0a4',until:record.healUntil,amount:record.healAmount,kind:'buff'});
  if((actor.poisonVisualUntil||0)>now)states.push({id:'poison',icon:'☠',label:'VENENO',detail:(actor.dynamicZonePoisonUntil||0)>now?'Pierde vida mientras permanezca en el charco':'Daño recibido y movimiento reducido',color:'#a9ef52',until:actor.poisonVisualUntil,kind:'debuff'});
  if((actor.courtShieldUntil||0)>now)states.push({id:'shield',icon:'◆',label:'ESCUDO',detail:'Bloquea el daño mientras esté activo',color:'#ffe29b',until:actor.courtShieldUntil,kind:'buff'});
  else if((actor.animalGuardUntil||0)>now)states.push({id:'guard',icon:'◈',label:'CORAZA 50%',detail:'Recibe 50 % menos daño',color:'#f3cf76',until:actor.animalGuardUntil,kind:'buff'});
  if(slowUntil>now){const factor=Math.min((actor.tacticSlowUntil||0)>now?.75:1,(actor.extinctionSlowUntil||0)>now?.72:1,(actor.dynamicZoneSlowUntil||0)>now?.75:1,(actor.fiscalSlowUntil||0)>now?(actor.fiscalSlowFactor||.82):1,(actor.extinctionChargeSlowUntil||0)>now?.82:1);states.push({id:'slow',icon:'▼',label:'LENTITUD '+Math.round((1-factor)*100)+'%',detail:'Velocidad de movimiento reducida',color:'#7ddcff',until:slowUntil,kind:'debuff'})}
  if((actor.dynamicZoneDefenseUntil||0)>now)states.push({id:'exposed',icon:'◇',label:'DEFENSAS −12%',detail:'Daño físico y especial recibido aumentado',color:'#76d9ef',until:actor.dynamicZoneDefenseUntil,kind:'debuff'});
  if((actor.predatorUntil||0)>now)states.push({id:'power',icon:'↑',label:'DEPREDADOR',detail:'+25 % daño · +18 % velocidad',color:'#ffaf67',until:actor.predatorUntil,kind:'buff'});
  if(actor.id==='makanaky'&&P.Passives?.definition?.(actor)){
   const passive=P.Passives.expire(actor),maximum=P.Passives.definition(actor).max,stacks=passive?.stacks||0;
   if(stacks>=maximum)states.push({id:'royal-ready',icon:'♛',label:'GOLPE REAL',detail:'El siguiente puño o cabezazo consume la racha',color:'#ffe58f',until:passive.expires,kind:'buff',body:false});
   else if(stacks>0)states.push({id:'ga-chain',icon:'GA',label:'RACHA '+stacks+'/'+maximum,detail:'Conecta otro puño o cabezazo antes de que decaiga',color:'#ef92cf',until:passive.expires,kind:'buff',body:false})
  }
  if((actor.makanakyUltimateUntil||0)>now)states.push({id:'intocable',icon:'♛',label:'INTOCABLE',detail:'Los Tres de la Realeza activo',color:'#e7a6ff',until:actor.makanakyUltimateUntil,kind:'buff'});
  if((actor.dotaHaste||0)>0)states.push({id:'haste',icon:'»',label:'VELOCIDAD 20%',detail:'Swift Blink: +20 % velocidad',color:'#8fdcff',left:actor.dotaHaste,kind:'buff'});
  if(actor.extinctionDodge)states.push({id:'dodge',icon:'◇',label:'ESQUIVA',detail:'Desplazamiento protegido',color:'#baffff',left:Math.max(0,actor.extinctionDodge.duration-actor.extinctionDodge.age),kind:'buff'});
  if(actor.inv>.12&&!states.some(q=>['shield','guard','intocable','dodge'].includes(q.id)))states.push({id:'invulnerable',icon:'◎',label:'INVULNERABLE',detail:'Breve protección contra impactos',color:'#d5efff',left:actor.inv,kind:'buff'});
  if(cabinet?.domainSpeedUntil>now)states.push({id:'cabinet-speed',icon:'»',label:'MOVILIDAD 35%',detail:'Recurso del Gabinete: +35 % velocidad',color:'#69d5ef',until:cabinet.domainSpeedUntil,kind:'buff'});
  else if(cabinet?.lawUntil>now&&cabinet.law==='mobility')states.push({id:'cabinet-law-mobility',icon:'↯',label:'LEY MOVILIDAD',detail:'+30 % velocidad · el Gabinete recibe +25 % daño',color:'#69d5ef',until:cabinet.lawUntil,kind:'mixed'});
  else if(cabinet?.lawUntil>now&&cabinet.law==='force')states.push({id:'cabinet-law-force',icon:'▼',label:'LEY FUERZA',detail:'−18 % velocidad · el Gabinete causa +25 % daño',color:'#ff9b68',until:cabinet.lawUntil,kind:'debuff'});
  return states.concat(this.permanent(actor))
 },
 hud(actor){
  if(typeof document==='undefined')return;
  const node=P.$?.('#player-statuses'),track=P.$?.('#health-track');if(!node||!track)return;
  const states=this.states(actor),signature=states.map(state=>[state.id,state.label,state.persistent?'∞':Math.ceil(this.remaining(state)*10)].join(':')).join('|');
  if(node.dataset.signature!==signature){node.dataset.signature=signature;node.replaceChildren(...states.map(state=>{const chip=document.createElement('span'),icon=document.createElement('b'),label=document.createElement('span'),time=document.createElement('em');chip.className='player-status-chip';chip.dataset.status=state.id;chip.dataset.kind=state.kind||'buff';chip.title=state.label+(state.detail?' · '+state.detail:'');icon.textContent=state.icon;label.textContent=state.label;time.textContent=state.persistent?'∞':this.remaining(state).toFixed(1)+'s';chip.append(icon,label,time);return chip}))}
  const priority=['poison','heal','intocable','royal-ready','shield','guard','slow','power'].find(id=>states.some(state=>state.id===id))||'';
  track.dataset.status=priority;node.setAttribute('aria-label',states.length?'Estados activos: '+states.map(state=>state.label+(state.persistent?' permanente':' '+this.remaining(state).toFixed(1)+' segundos')).join(', '):'Sin estados activos')
 },
 cross(ctx,x,y,size,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x-size/3),Math.round(y-size),Math.round(size*2/3),Math.round(size*2));ctx.fillRect(Math.round(x-size),Math.round(y-size/3),Math.round(size*2),Math.round(size*2/3))},
 draw(ctx,actor){
  if(!actor||actor.hp<=0)return;
  const states=this.states(actor).filter(state=>state.body!==false&&!state.persistent),now=this.now(),reduced=!!P.Ambient?.reduced?.matches;if(!states.length)return;
  ctx.save();ctx.translate(actor.x,actor.y);
  for(const state of states){
   const left=this.remaining(state),pulse=reduced?0:Math.sin(now*7)*2;
   if(state.id==='heal'){
    ctx.globalAlpha=Math.min(1,left*1.8);for(let i=0;i<3;i++){const x=-18+i*18,y=-29-(reduced?i*5:(1.05-left)*18+i*4);this.cross(ctx,x,y,4,state.color)}
   }else if(state.id==='poison'){
    ctx.strokeStyle=state.color;ctx.fillStyle='#6fb63f';ctx.lineWidth=2;ctx.globalAlpha=.82;ctx.beginPath();ctx.ellipse(0,7,27,11,0,0,Math.PI*2);ctx.stroke();for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(-18+i*12,-22-i*4-(reduced?0:Math.sin(now*7+i)*3),3+i%2,0,Math.PI*2);ctx.fill()}
   }else if(state.id==='slow'||state.id==='cabinet-law-force'){
    ctx.strokeStyle=state.color;ctx.lineWidth=3;ctx.globalAlpha=.85;for(const x of [-11,11]){ctx.beginPath();ctx.moveTo(x-5,-34+pulse);ctx.lineTo(x,-27+pulse);ctx.lineTo(x+5,-34+pulse);ctx.stroke()}
   }else if(state.id==='exposed'){
    ctx.strokeStyle=state.color;ctx.lineWidth=2;ctx.globalAlpha=.9;ctx.beginPath();ctx.arc(0,-9,29+pulse*.3,-2.7,-.4);ctx.stroke();ctx.beginPath();ctx.moveTo(-20,-29);ctx.lineTo(-10,-17);ctx.lineTo(-16,-7);ctx.stroke();ctx.beginPath();ctx.moveTo(18,-30);ctx.lineTo(9,-18);ctx.lineTo(16,-9);ctx.stroke()
   }else if(state.id==='shield'||state.id==='guard'){
    ctx.strokeStyle=state.color;ctx.fillStyle=state.color+'22';ctx.lineWidth=2;ctx.globalAlpha=.8;ctx.beginPath();ctx.moveTo(0,-48-pulse);ctx.lineTo(27,-23);ctx.lineTo(23,14);ctx.lineTo(0,26);ctx.lineTo(-23,14);ctx.lineTo(-27,-23);ctx.closePath();ctx.fill();ctx.stroke()
   }else if(['power','haste','cabinet-speed','cabinet-law-mobility'].includes(state.id)){
    ctx.fillStyle=state.color;ctx.globalAlpha=.85;for(const x of [-8,8]){const y=-37-pulse;ctx.beginPath();ctx.moveTo(x,y-8);ctx.lineTo(x-6,y);ctx.lineTo(x-2,y);ctx.lineTo(x-2,y+8);ctx.lineTo(x+2,y+8);ctx.lineTo(x+2,y);ctx.lineTo(x+6,y);ctx.closePath();ctx.fill()}
   }else if(['intocable','invulnerable','dodge'].includes(state.id)){
    ctx.strokeStyle=state.color;ctx.fillStyle=state.color+'22';ctx.lineWidth=3;ctx.globalAlpha=.9;ctx.beginPath();ctx.ellipse(0,-7,34+pulse,43+pulse,0,0,Math.PI*2);ctx.fill();ctx.stroke();if(state.id==='intocable'){ctx.fillStyle=state.color;ctx.font='900 16px serif';ctx.textAlign='center';ctx.fillText('♛',0,-50-pulse)}
   }
  }
  ctx.restore()
 },
 // Barra compacta bajo los pies (jugador local y compañero): vida rosa, nivel en chapa amarilla.
 bar(ctx,actor,opts={}){
  if(!actor)return;const max=Math.max(1,Number(actor.maxHp)||Number(actor.max)||1),life=Math.max(0,Math.min(max,Number(actor.hp)||0)),ratio=life/max,record=this.observe(actor),now=this.now(),reduced=P.Motion?P.Motion.reduced():!!P.Ambient?.reduced?.matches,left=record.hurtUntil-now,hurt=left>0,flash=hurt&&left>.1&&!reduced,shake=hurt&&!reduced?Math.round(Math.sin(now*90)*left/.22*2):0,
   w=44,h=6,level=Math.floor(Number(opts.level))||0,text=String(level),badge=level?Math.max(14,text.length*7+6):0,total=w+(level?3+badge:0),x=Math.round(-total/2)+shake,y=31,fill=Math.round(w*ratio);
  ctx.save();ctx.translate(actor.x,actor.y);ctx.fillStyle='#0c0a10';ctx.fillRect(x-2,y-2,w+4,h+4);ctx.fillStyle='#2a2233';ctx.fillRect(x,y,w,h);
  ctx.fillStyle=flash?'#fff4dc':record.healUntil>now?'#8ff0a4':ratio>.35?'#ff2e88':'#ff7a1a';ctx.fillRect(x,y,fill,h);
  ctx.fillStyle='#0c0a10';for(let i=1;i<4;i++)ctx.fillRect(x+Math.round(w*i/4)-1,y,1,h);
  if(level){const bx=x+w+3,by=y-3;ctx.fillStyle='#0c0a10';ctx.fillRect(bx-2,by-2,badge+4,16);ctx.fillStyle='#ffe02e';ctx.fillRect(bx,by,badge,12);ctx.fillStyle='#0c0a10';ctx.font=P.Font.title(10);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,bx+badge/2,by+7)}
  if(life<=0&&opts.down){ctx.fillStyle='#ff9a90';ctx.font=P.Font.title(9);ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText('CAÍDO',0,47)}
  ctx.restore()
 },
 allyBar(ctx,actor){this.bar(ctx,actor,{level:P.state?.level,down:true})},
 // Estados temporales sobre la cabeza: iconos de 14 px con barra de tiempo restante; máximo 5 y «+N».
 // El tiempo total de cada estado es el mayor restante visto desde que apareció (la simulación solo guarda el final).
 buffRow(ctx,actor,y){
  const record=this.observe(actor),span=record.span||(record.span={}),states=this.states(actor).filter(q=>!q.persistent&&q.id!=='heal'&&q.id!=='invulnerable'),seen={};
  for(const q of states){const left=this.remaining(q);seen[q.id]=1;if(!(span[q.id]>=left))span[q.id]=left}
  for(const id of Object.keys(span))if(!seen[id])delete span[id];
  if(!states.length)return;
  const shown=states.slice(0,5),extra=states.length-shown.length,size=14,gap=3,count=shown.length+(extra?1:0),x0=Math.round(actor.x-(count*size+(count-1)*gap)/2);
  ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
  shown.forEach((q,i)=>{
   const x=x0+i*(size+gap),total=span[q.id]||0,ratio=total>0?Math.max(0,Math.min(1,this.remaining(q)/total)):1,color=q.color||'#fff4dc',icon=String(q.icon||'•');
   ctx.fillStyle='#0c0a10';ctx.fillRect(x-1,y-1,size+2,size+2);ctx.fillStyle=q.kind==='debuff'?'#3a1424':'#1b1622';ctx.fillRect(x,y,size,size);
   ctx.fillStyle=color;ctx.font=P.Font.title(icon.length>1?8:11);ctx.fillText(icon,x+size/2,y+size/2-1);
   ctx.fillRect(x,y+size-2,Math.max(1,Math.round(size*ratio)),2);
   if(q.kind==='debuff'){ctx.fillStyle='#ff2e88';ctx.fillRect(x,y,size,1)}
  });
  if(extra){const x=x0+shown.length*(size+gap);ctx.fillStyle='#0c0a10';ctx.fillRect(x-1,y-1,size+2,size+2);ctx.fillStyle='#fff4dc';ctx.font=P.Font.title(9);ctx.fillText('+'+extra,x+size/2,y+size/2)}
  ctx.restore()
 },
 // Avisos de evento y botín (P.Loot.message): salen flotando sobre el personaje, uno a uno.
 notices:{owner:null,queue:[],cur:null,start:0,last:'',lastT:0},
 watchNotices(){
  const s=P.state,n=this.notices,loot=P.Loot;
  if(n.owner!==s){n.owner=s;n.queue=[];n.cur=null;n.start=0;n.last='';n.lastT=0}
  const text=loot?.message||'',t=loot?.messageTime||0;
  if(text&&t>0&&(text!==n.last||t>n.lastT+.5)&&n.cur?.text!==text&&!n.queue.includes(text)){n.queue.push(text);if(n.queue.length>4)n.queue.shift()}
  n.last=t>0?text:'';n.lastT=t;return n
 },
 noticeLines(ctx,text,max){
  const lines=[];let line='';for(const word of String(text).split(/\s+/)){const next=line?line+' '+word:word;if(line&&ctx.measureText(next).width>max){lines.push(line);line=word}else line=next}
  if(line)lines.push(line);return lines.slice(0,3)
 },
 drawNotices(ctx,actor,y){
  const n=this.watchNotices(),now=this.now(),reduced=P.Motion?P.Motion.reduced():!!P.Ambient?.reduced?.matches;
  if(n.cur&&(now<n.start||now-n.start>=n.cur.life))n.cur=null;
  if(!n.cur&&n.queue.length){n.cur={text:n.queue.shift(),life:n.queue.length>1?1.6:2.6};n.start=now}
  const c=n.cur;if(!c)return;
  const age=now-n.start,rise=reduced?0:-14*Math.min(1,age/c.life),alpha=reduced?1:age<.15?age/.15:age>c.life-.5?Math.max(0,(c.life-age)/.5):1;
  ctx.save();ctx.font=P.Font.title(13);ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.lineJoin='round';ctx.lineWidth=4;ctx.globalAlpha=alpha;ctx.strokeStyle='#0c0a10';ctx.fillStyle='#fff4dc';
  const lines=c.lines||(c.lines=this.noticeLines(ctx,c.text,260)),x=Math.round(actor.x);
  lines.forEach((line,i)=>{const ly=Math.round(y+rise-(lines.length-1-i)*16);ctx.strokeText(line,x,ly);ctx.fillText(line,x,ly)});
  ctx.restore()
 },
 overhead(ctx,p){if(p.hp>0)this.buffRow(ctx,p,Math.round(p.y)-60);this.drawNotices(ctx,p,Math.round(p.y)-68)},
 // Última pasada del mundo: las barras quedan sobre enemigos y efectos y no se duplican.
 bars(ctx){const s=P.state,p=s?.player;if(!p)return;if(P.Coop?.active)for(const a of P.Coop.peers||[])if(a!==p&&a.coopPlayer)this.allyBar(ctx,a);if(p.hp>0)this.bar(ctx,p,{level:s.level});this.overhead(ctx,p)}
};
