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
  if(!record){record={hp,healUntil:0,healAmount:0};this.records.set(actor,record);return record}
  const now=this.now();
  if(Number.isFinite(hp)&&Number.isFinite(record.hp)&&hp>record.hp+.01){
   if(record.healUntil<=now)record.healAmount=0;
   record.healAmount=Math.max(record.healAmount,hp-record.hp);
   record.healUntil=now+1.05
  }
  record.hp=hp;
  return record
 },
 states(actor){
  if(!actor)return [];
  const now=this.now(),record=this.observe(actor),slowUntil=Math.max(actor.tacticSlowUntil||0,actor.extinctionSlowUntil||0,actor.extinctionChargeSlowUntil||0),states=[],cabinet=this.cabinet();
  if(record.healUntil>now)states.push({id:'heal',icon:'+',label:'CURACIÓN',detail:'Vida recuperada: '+Math.ceil(record.healAmount),color:'#8ff0a4',until:record.healUntil,amount:record.healAmount,kind:'buff'});
  if((actor.poisonVisualUntil||0)>now)states.push({id:'poison',icon:'☠',label:'VENENO',detail:'Daño recibido y movimiento reducido',color:'#a9ef52',until:actor.poisonVisualUntil,kind:'debuff'});
  if((actor.courtShieldUntil||0)>now)states.push({id:'shield',icon:'◆',label:'ESCUDO',detail:'Bloquea el daño mientras esté activo',color:'#ffe29b',until:actor.courtShieldUntil,kind:'buff'});
  else if((actor.animalGuardUntil||0)>now)states.push({id:'guard',icon:'◈',label:'CORAZA 50%',detail:'Recibe 50 % menos daño',color:'#f3cf76',until:actor.animalGuardUntil,kind:'buff'});
  if(slowUntil>now){const factor=(actor.tacticSlowUntil||0)>now?.75:(actor.extinctionSlowUntil||0)>now?.72:.82;states.push({id:'slow',icon:'▼',label:'LENTITUD '+Math.round((1-factor)*100)+'%',detail:'Velocidad de movimiento reducida',color:'#7ddcff',until:slowUntil,kind:'debuff'})}
  if((actor.predatorUntil||0)>now)states.push({id:'power',icon:'↑',label:'DEPREDADOR',detail:'+25 % daño · +18 % velocidad',color:'#ffaf67',until:actor.predatorUntil,kind:'buff'});
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
  const priority=['poison','heal','intocable','shield','guard','slow','power'].find(id=>states.some(state=>state.id===id))||'';
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
 allyBar(ctx,actor){
  if(!actor)return;const max=Math.max(1,Number(actor.maxHp)||Number(actor.max)||1),life=Math.max(0,Math.min(max,Number(actor.hp)||0));
  ctx.save();ctx.translate(actor.x,actor.y);ctx.fillStyle='#101827dd';ctx.fillRect(-25,29,50,6);ctx.fillStyle=life/max>.35?'#66d8df':'#ff7d78';ctx.fillRect(-24,30,48*life/max,4);
  if(life<=0){ctx.fillStyle='#ff9a90';ctx.font='bold 9px monospace';ctx.textAlign='center';ctx.fillText('CAÍDO',0,47)}
  ctx.restore()
 }
};
