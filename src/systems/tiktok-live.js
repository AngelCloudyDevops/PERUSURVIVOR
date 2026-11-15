'use strict';
// Private, local simulator for designing a future TikTok LIVE integration.
// It never connects to TikTok and is deliberately unavailable outside admin accounts.
P.TikTokLive={
 enabled:false,queue:[],likes:0,serial:0,clock:0,nextEventAt:0,cooldowns:new Map,maxQueue:30,
 allowed(){return !!P.Profile?.admin?.()},
 sanitize(value){return String(value||'').normalize('NFKC').replace(/[^\p{L}\p{N}_. -]/gu,'').replace(/\s+/g,' ').trim().slice(0,20)||'Espectador'},
 node(tag,text,parent){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(parent)parent.append(el);return el},
 button(text,action,parent){const el=this.node('button',text,parent);el.type='button';el.onclick=action;return el},
 init(){
  if(typeof Image==='undefined'||!document.body||this.dialog)return;
  const toolMenu=P.$('#hub-tools-menu');
  this.buttonOpen=this.button(toolMenu?undefined:'◉ TikTok LIVE',()=>this.open(),toolMenu||P.$('#lobby-sidebar'));
  this.buttonOpen.id='tiktok-live-open';
  if(toolMenu){this.buttonOpen.append(this.node('span','◉'),this.node('strong','TikTok LIVE'))}
  const dialog=this.dialog=this.node('dialog',undefined,document.body);dialog.id='tiktok-live-dialog';dialog.setAttribute('aria-labelledby','tiktok-live-title');
  const badge=this.node('small','SOLO ADMIN · LABORATORIO LOCAL',dialog);badge.className='tiktok-live-badge';
  const title=this.node('h2','TikTok LIVE interactivo',dialog);title.id='tiktok-live-title';
  this.node('p','Prueba cómo entrarían los espectadores al juego antes de conectar una cuenta real de TikTok.',dialog);
  const notice=this.node('p','SIMULACIÓN SIN CONEXIÓN · No publica, no lee el chat y no usa datos reales.',dialog);notice.className='tiktok-live-notice';
  const label=this.node('label','Nombre del espectador de prueba',dialog);this.viewer=this.node('input',undefined,label);this.viewer.maxLength=20;this.viewer.value='CausaLive';this.viewer.autocomplete='off';
  const rules=this.node('div',undefined,dialog);rules.className='tiktok-live-rules';
  for(const [icon,name,desc]of[['♥','25 likes','Invoca un minion del público.'],['🌹','Rosa','Invoca un minion normal.'],['★','Regalo mediano','Invoca un minion veterano.'],['👑','Regalo grande','Invoca un minion élite.'],['💬','!horda','Invoca tres minions, uno por uno.'],['↗','Compartir','Cura 10 % de la vida del jugador.']]){const row=this.node('article',undefined,rules);this.node('b',icon+' '+name,row);this.node('small',desc,row)}
  const actions=this.node('div',undefined,dialog);actions.className='tiktok-live-dialog-actions';this.button('Iniciar partida de prueba ↗',()=>this.startTest(),actions).className='tiktok-live-primary';this.button('Cerrar',()=>dialog.close(),actions);
  const panel=this.panel=this.node('aside',undefined,document.body);panel.id='tiktok-live-panel';panel.hidden=true;panel.setAttribute('aria-label','Controles de TikTok LIVE simulado');
  const head=this.node('header',undefined,panel);this.node('b','● LIVE SIMULADO',head);this.status=this.node('small','0 eventos en cola',head);
  const identity=this.node('label','Espectador',panel);this.panelViewer=this.node('input',undefined,identity);this.panelViewer.maxLength=20;this.panelViewer.value=this.viewer.value;
  const like=this.node('div',undefined,panel);like.className='tiktok-like-meter';this.likeBar=this.node('i',undefined,like);this.likeText=this.node('span','0 / 25 likes',like);
  const controls=this.node('div',undefined,panel);controls.className='tiktok-live-controls';
  this.button('♥ Like',()=>this.like(),controls);this.button('🌹 Rosa',()=>this.emit('rose'),controls);this.button('★ Mediano',()=>this.emit('medium'),controls);this.button('👑 Grande',()=>this.emit('large'),controls);this.button('💬 !horda',()=>this.emit('horde'),controls);this.button('↗ Compartir',()=>this.emit('share'),controls);
  this.feed=this.node('ol',undefined,panel);this.feed.setAttribute('aria-live','polite');this.button('Terminar LIVE',()=>this.stop('Sesión de prueba terminada.'),panel).className='tiktok-live-stop';
  const access=P.Profile.access.bind(P.Profile);P.Profile.access=()=>{access();this.access()};
  this.wrapGame();this.wrapEnemyArt();this.access();
 },
 access(){const allowed=this.allowed();if(this.buttonOpen)this.buttonOpen.hidden=!allowed;if(!allowed){this.dialog?.close();this.stop()}},
 open(){if(!this.allowed()||P.state.mode!=='menu')return;this.dialog.showModal()},
 startTest(){
  if(!this.allowed()||P.state.mode!=='menu')return false;
  const viewer=this.sanitize(this.viewer.value);this.viewer.value=this.panelViewer.value=viewer;
  const started=P.Game.start({preview:true});if(started===false)return false;
  this.enabled=true;this.queue=[];this.likes=0;this.clock=0;this.nextEventAt=0;this.cooldowns.clear();this.feed.replaceChildren();this.panel.hidden=false;P.state.tiktokLive=true;P.state.adminBalanceRun=true;this.dialog.close();this.log('Laboratorio LIVE iniciado.');this.paint();return true
 },
 stop(message=''){if(!this.enabled&&!this.panel)return;this.enabled=false;this.queue=[];if(P.state)P.state.tiktokLive=false;if(this.panel)this.panel.hidden=true;if(message)this.log(message)},
 viewerName(){return this.sanitize(this.panelViewer?.value||this.viewer?.value)},
 queueEvent(type,viewer=this.viewerName(),force=false){
  if(!this.enabled||!this.allowed()||P.Coop?.active||this.queue.length>=this.maxQueue)return false;
  const now=Date.now(),name=this.sanitize(viewer),key=name.toLocaleLowerCase('es')+':'+type,wait={like:80,horde:1800,share:1500}[type]??300;
  if(!force&&(this.cooldowns.get(key)||0)>now)return false;this.cooldowns.set(key,now+wait);this.queue.push({type,viewer:name,id:++this.serial});this.paint();return true
 },
 emit(type){const accepted=this.queueEvent(type);if(accepted)this.log(this.viewerName()+' · '+this.label(type));return accepted},
 like(viewer=this.viewerName()){
  if(!this.enabled||!this.allowed())return false;this.likes++;if(this.likes%25===0){this.queueEvent('like-wave',viewer,true);this.log(this.sanitize(viewer)+' completó 25 likes.')}this.paint();return true
 },
 label(type){return({rose:'Rosa',medium:'Regalo mediano',large:'Regalo grande',horde:'!horda',share:'Compartió','like-wave':'Oleada de likes'})[type]||type},
 tick(dt){if(!this.enabled)return;if(!this.allowed()||P.Coop?.active||!P.state||P.state.mode==='menu'||P.state.mode==='end'){this.stop();return}if(P.state.mode!=='play')return;this.clock+=dt;if(this.clock<this.nextEventAt||!this.queue.length)return;const event=this.queue.shift();this.nextEventAt=this.clock+.35;this.apply(event);this.paint()},
 apply(event){
  if(event.type==='share'){const p=P.state.player,heal=Math.max(1,Math.round((p.maxHp||p.max||100)*.1));p.hp=Math.min(p.maxHp||p.max||p.hp,p.hp+heal);P.state.effects?.push({kind:'shout',text:'+'+heal+' VIDA · '+event.viewer,x:p.x,y:p.y-45,life:.9,maxLife:.9,color:'#70f5c7'});return}
  if(event.type==='horde'){for(let i=0;i<3;i++)this.queue.splice(Math.min(i,this.queue.length),0,{type:'rose',viewer:event.viewer,id:++this.serial});return}
  const tier=event.type==='large'?2:event.type==='medium'?1:0;this.spawn(event.viewer,tier,event.type)
 },
 spawn(viewer,tier=0,gift='rose'){
  const s=P.state,p=s?.player;if(!p||!P.Entities?.enemy)return null;const e=P.Entities.enemy(),current=P.MinionEvolution?.rank?.(e)||0,profiles=P.MinionEvolution?.profiles;
  if(profiles){const from=profiles[current]||profiles[0],to=profiles[tier]||profiles[0];e.hp=e.max=Math.max(1,Math.round(e.max/from.hp*to.hp));e.speed=e.speed/from.speed*to.speed}
  e.evolution=tier;e.evolutionApplied=true;e.tiktokViewer=this.sanitize(viewer);e.tiktokGift=gift;
  const angle=(this.serial*2.399963)% (Math.PI*2),distance=300+(this.serial%3)*38,old={x:p.x,y:p.y};e.x=p.x+Math.cos(angle)*distance;e.y=p.y+Math.sin(angle)*distance;P.Terrain?.resolve?.(e,old,e.r);s.enemies.push(e);P.Audio?.fx?.('spawn');return e
 },
 log(text){if(!this.feed)return;const item=this.node('li',text);this.feed.prepend(item);while(this.feed.children.length>5)this.feed.lastChild.remove()},
 paint(){if(!this.panel)return;const progress=this.likes%25;this.likeText.textContent=progress+' / 25 likes';this.likeBar.style.width=(progress/25*100)+'%';this.status.textContent=this.queue.length+' evento'+(this.queue.length===1?'':'s')+' en cola'},
 drawViewer(ctx,e){
  if(!e?.tiktokViewer||e.hp<=0)return;const y=(P.EnemyArt.labelTop?.(e)??e.y-e.r-38)-13,name=e.tiktokViewer,icon=e.tiktokGift==='large'?'👑':e.tiktokGift==='medium'?'★':'♥';ctx.save();ctx.font='700 9px monospace';ctx.textAlign='center';ctx.textBaseline='middle';const width=Math.min(132,Math.max(48,ctx.measureText(icon+' '+name).width+14));ctx.fillStyle='#0b1424df';ctx.strokeStyle=e.evolution===2?'#ffcf53':e.evolution===1?'#c79aff':'#ff5c8a';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(e.x-width/2,y-8,width,16,7);ctx.fill();ctx.stroke();ctx.fillStyle='#fff8df';ctx.fillText(icon+' '+name,e.x,y);ctx.restore()
 },
 wrapGame(){
  if(this.gameWrapped||!P.Game)return;this.gameWrapped=true;const start=P.Game.start;P.Game.start=function(...args){if(P.TikTokLive.enabled)P.TikTokLive.stop();return start.apply(this,args)};const update=P.Game.update;P.Game.update=function(dt){const result=update.call(this,dt);P.TikTokLive.tick(dt);return result};const finish=P.Game.finish;P.Game.finish=function(...args){P.TikTokLive.stop();return finish.apply(this,args)}
 },
 wrapEnemyArt(){if(this.artWrapped||!P.EnemyArt?.draw)return;this.artWrapped=true;const draw=P.EnemyArt.draw;P.EnemyArt.draw=function(ctx,e,...args){const result=draw.call(this,ctx,e,...args);P.TikTokLive.drawViewer(ctx,e);return result}}
};
if(typeof document!=='undefined')P.TikTokLive.init();
