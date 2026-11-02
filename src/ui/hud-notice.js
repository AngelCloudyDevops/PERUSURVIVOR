'use strict';
// Aviso temporal arriba al centro: etapa, hora y clima aparecen solo cuando cambian y se van solos.
// Solo cliente: en el VM del servidor no hay document y no hace nada.
P.HudNotice={
 duration:3,queue:[],current:null,until:0,seen:null,lastTime:0,
 node(){
  if(typeof document==='undefined')return null;
  const el=P.$?.('#hud-notice');if(!el)return null;
  if(!el._notice){const title=document.createElement('b'),detail=document.createElement('small');el.append(title,detail);el._notice={title,detail}}
  return el
 },
 clock(){return typeof performance!=='undefined'?performance.now()/1000:Date.now()/1000},
 enqueue(title,detail,tone){if(!this.queue.some(n=>n.title===title&&n.detail===detail))this.queue.push({title,detail,tone})},
 // Compara con lo último visto; la primera lectura de la partida no avisa del clima.
 observe(s){
  const time=Number(s.mapTime)||0,first=!this.seen||this.owner!==s||time<this.lastTime-1;this.lastTime=time;this.owner=s;
  if(first)this.seen={stage:null,light:null};
  const chaos=!!P.RunMode?.isChaos?.(),run=chaos?P.RunMode.stageAt():0,level=P.Difficulty?.index?.()??0,stage=run+'|'+level;
  if(this.seen.stage!==stage){
   this.seen.stage=stage;
   const data=P.Difficulty?.stages?.[level],names=['Pablo','Tyrone','Uniqua','Tasha','Austin','PNP'];
   this.enqueue(chaos?'ETAPA '+(run+1)+'/6 · '+P.RunMode.stage().name.toUpperCase():'ETAPA '+(level+1)+(data?' · '+data.name:''),data?'Rivales: '+names.slice(0,data.types).join(', '):'',chaos?P.RunMode.stage().tone:'')
  }
  if(P.DayNight?.active?.()){
   const light=P.DayNight.current(),weather=P.Weather?.label?.()||'',key=light.label+'|'+weather;
   if(this.seen.light!==key){const had=this.seen.light!==null;this.seen.light=key;if(had)this.enqueue(light.label+(weather?' · '+weather:''),'','')}
  }
 },
 tick(){
  const el=this.node();if(!el)return;
  const s=P.state,playing=s?.mode==='play'&&!s.encounter&&!s.bossSpawned&&!(s.devRun&&!s.balanceTest),now=this.clock();
  if(!playing){if(this.current){this.current=null;el.hidden=true}return}
  this.observe(s);
  if(this.current&&now>=this.until){this.current=null;el.hidden=true}
  if(!this.current&&this.queue.length){
   const n=this.queue.shift(),{title,detail}=el._notice;
   title.textContent=n.title;detail.textContent=n.detail;detail.hidden=!n.detail;
   if(n.tone)el.style.setProperty('--notice-tone',n.tone);else el.style.removeProperty('--notice-tone');
   el.hidden=false;this.current=n;this.until=now+this.duration;
   // Reinicia la entrada para que se vea cada vez (sin animación con movimiento reducido: lo decide el CSS).
   el.style.animation='none';void el.offsetWidth;el.style.animation=''
  }
 }
};
{const hud=P.UI.hud;P.UI.hud=function(...a){const result=hud.apply(this,a);if(typeof document!=='undefined'){try{P.HudNotice.tick()}catch(e){}}return result}}
