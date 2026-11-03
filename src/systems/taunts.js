'use strict';
P.Taunts={
 items:[
  {id:'entiendes',glyph:'?!',label:'¿ME ENTIENDES?',audio:true},
  {id:'quefue',glyph:'QF',label:'¡QUÉ FUE!'},
  {id:'piola',glyph:'P',label:'PIOLA'},
  {id:'gg',glyph:'GG',label:'GG, CAUSA'},
  {id:'prendio',glyph:'F',label:'¡SE PRENDIÓ!'},
  {id:'buena',glyph:'+',label:'¡BUENA!'}
 ],
 active:new Map(),open:false,selected:0,lastUse:0,voice:null,voiceStop:null,
 install(){if(this.installed||!P.World||!P.Game)return;this.installed=true;this.init();const render=P.World.render,start=P.Game.start;P.World.render=function(...args){const result=render.apply(this,args);P.Taunts.drawScreen();return result};P.Game.start=function(...args){P.Taunts.reset();return start.apply(this,args)}},
 init(){
  if(typeof document==='undefined'||this.root)return;
  const root=document.createElement('section');root.id='taunt-wheel';root.hidden=true;root.setAttribute('role','dialog');root.setAttribute('aria-modal','false');root.setAttribute('aria-label','Rueda de burlas');
  const title=document.createElement('strong');title.className='taunt-wheel-title';title.textContent='BURLAS';
  const help=document.createElement('small');help.className='taunt-wheel-help';help.textContent='APUNTA Y SUELTA B';
  const center=document.createElement('span');center.className='taunt-wheel-center';center.innerHTML='<kbd>B</kbd><b>SUELTA</b>';
  root.append(title,help,center);
  this.items.forEach((item,index)=>{const button=document.createElement('button'),angle=index/this.items.length*Math.PI*2-Math.PI/2;button.type='button';button.className='taunt-option';button.dataset.index=index;button.style.setProperty('--x',Math.cos(angle)*118+'px');button.style.setProperty('--y',Math.sin(angle)*118+'px');button.setAttribute('aria-label',item.label+(item.audio?' · con voz':''));button.innerHTML='<span>'+item.glyph+'</span><small>'+item.label+'</small>';button.onpointerenter=()=>this.select(index);button.onclick=e=>{e.preventDefault();this.select(index);this.activate(index)};root.append(button)});
  const trigger=document.createElement('button');trigger.id='taunt-trigger';trigger.type='button';trigger.innerHTML='<kbd>B</kbd><span>BURLAS</span>';trigger.setAttribute('aria-label','Abrir rueda de burlas');trigger.onclick=()=>this.open?this.cancel():this.show();
  document.body.append(root,trigger);this.root=root;this.trigger=trigger;this.select(0);
  addEventListener('keydown',e=>{if(e.key?.toLowerCase()!=='b'||e.repeat||this.typing(e)||P.state.mode!=='play')return;e.preventDefault();e.stopPropagation();this.show()});
  addEventListener('keyup',e=>{if(e.key?.toLowerCase()!=='b'||!this.open)return;e.preventDefault();this.activate(this.selected)});
  addEventListener('pointermove',e=>{if(!this.open||e.pointerType==='touch')return;const dx=e.clientX-innerWidth/2,dy=e.clientY-innerHeight/2;if(Math.hypot(dx,dy)<48)return;const step=Math.PI*2/this.items.length,index=Math.round((Math.atan2(dy,dx)+Math.PI/2)/step);this.select((index%this.items.length+this.items.length)%this.items.length)});
  addEventListener('blur',()=>this.cancel());addEventListener('keydown',e=>{if(e.key==='Escape'&&this.open){e.preventDefault();e.stopImmediatePropagation();this.cancel()}},true)
 },
 typing(e){return ['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName)||e.target?.isContentEditable},
 show(){if(P.state.mode!=='play'||!P.state.player?.hp)return false;this.open=true;this.root.hidden=false;this.root.dataset.open='true';this.trigger?.setAttribute('aria-expanded','true');this.select(this.selected||0);return true},
 cancel(){if(!this.root)return;this.open=false;this.root.hidden=true;delete this.root.dataset.open;this.trigger?.setAttribute('aria-expanded','false')},
 select(index){this.selected=Math.max(0,Math.min(this.items.length-1,index|0));this.root?.querySelectorAll('.taunt-option').forEach((button,i)=>{button.dataset.selected=String(i===this.selected);button.setAttribute('aria-pressed',String(i===this.selected))});const item=this.items[this.selected];if(this.root)this.root.setAttribute('aria-label','Rueda de burlas · '+item.label)},
 key(slot){return Number.isInteger(slot)?String(slot):'local'},
 activate(index=this.selected,remote=false,slot=null){
  const item=this.items[index];if(!item||!remote&&P.state.mode!=='play'){this.cancel();return false}const now=performance.now();if(!remote&&now-this.lastUse<900){this.cancel();return false}if(!remote)this.lastUse=now;
  const ownSlot=P.Coop?.active?P.Coop.session?.slot:null,key=this.key(slot??ownSlot);this.active.set(key,{id:item.id,glyph:item.glyph,label:item.label,start:now,until:now+3000});this.cancel();
  if(item.audio)this.playVoice();else if(!remote){P.Audio.unlock();P.Audio.tone?.(520,.08,.055,'triangle',0,760);P.Audio.tone?.(760,.1,.045,'sine',.07,900)}
  if(!remote&&P.Coop?.active)P.Coop.send?.({type:'taunt',id:item.id});return true
 },
 receive(message){const index=this.items.findIndex(item=>item.id===message?.id);if(index<0||!Number.isInteger(message.slot)||message.slot<0||message.slot>1)return false;const own=P.Coop?.session?.slot;if(message.slot===own)return true;return this.activate(index,true,message.slot)},
 playVoice(){
  if(P.Audio.muted||P.Audio.effectsVolume<=0||typeof Audio==='undefined')return;P.Audio.unlock();P.Audio.duckMusic?.(3.4,.22);
  if(!this.voice){this.voice=new Audio('assets/audio/burla-voz-v1.mpeg');this.voice.preload='none';this.voice.addEventListener('error',()=>this.stopVoice())}
  clearTimeout(this.voiceStop);try{this.voice.pause();this.voice.currentTime=0;this.syncAudio();const promise=this.voice.play();promise?.catch?.(()=>{})}catch{}
  this.voiceStop=setTimeout(()=>this.stopVoice(),5000)
 },
 syncAudio(){if(!this.voice)return;const audible=!P.Audio.muted&&!P.Audio.blurred&&P.Audio.effectsVolume>0&&['play','upgrade','loot-opening','item'].includes(P.state.mode);this.voice.volume=audible?Math.min(1,P.Audio.effectsVolume*.9):0;if(!audible&&P.state.mode==='menu')this.stopVoice()},
 stopVoice(){if(this.voice){this.voice.pause();try{this.voice.currentTime=0}catch{}}clearTimeout(this.voiceStop);this.voiceStop=null},
 reset(){this.cancel();this.active.clear();this.stopVoice()},
 stateFor(actor){const slot=actor?.slot,key=this.key(P.Coop?.active&&Number.isInteger(slot)?slot:null),value=this.active.get(key);if(!value)return null;if(performance.now()>=value.until){this.active.delete(key);return null}return value},
 draw(ctx,actor){
  const value=this.stateFor(actor);if(!value||actor?.hp<=0)return;this.syncAudio();const now=performance.now(),age=(now-value.start)/1000,left=(value.until-now)/1000,reduced=!!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches,pop=reduced?1:Math.min(1,age/.16),fade=Math.min(1,left/.35),lift=reduced?0:Math.sin(Math.min(1,age/.28)*Math.PI)*5,y=actor.y-(actor.r||24)-82-lift,w=Math.max(94,Math.min(156,value.label.length*7+28)),h=46;
  ctx.save();ctx.globalAlpha=fade;ctx.translate(Math.round(actor.x),Math.round(y));ctx.scale(.84+.16*pop,.84+.16*pop);ctx.fillStyle='#101b2aee';ctx.strokeStyle='#f3c755';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,10);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-7,h/2);ctx.lineTo(0,h/2+10);ctx.lineTo(9,h/2);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#ff765a';ctx.font='900 16px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(value.glyph,0,-7);ctx.fillStyle='#fff2cf';ctx.font='900 9px monospace';ctx.fillText(value.label,0,11);ctx.restore()
 },
 drawScreen(){if(P.state.mode!=='play'||!P.state.player){if(this.open)this.cancel();return}const {ctx,width,height}=P.Core,zoom=P.Terrain?.zoom||1,cx=P.Terrain?.cameraX??P.state.player.x,cy=P.Terrain?.cameraY??P.state.player.y,players=[P.state.player,...(P.Coop?.active?P.Coop.peers||[]:[])];for(const actor of players){const x=(actor.x-cx)*zoom+width/2,y=(actor.y-cy)*zoom+height/2;this.draw(ctx,{...actor,x,y,r:(actor.r||24)*zoom})}}
};
if(typeof addEventListener==='function')addEventListener('DOMContentLoaded',()=>P.Taunts.install(),{once:true});
