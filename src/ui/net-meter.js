'use strict';
// Ping y «pérdida» del cooperativo, medidos solo en el cliente y sin cambiar el protocolo.
// WebSocket va sobre TCP: no hay pérdida de paquetes real. Cada snapshot trae el reloj de la simulación (`elapsed`, +0,04 s por tick);
// si ese reloj salta más de un paso entre dos snapshots recibidos, los intermedios no llegaron a tiempo (el servidor los descartó por saturación).
P.NetMeter={
 windowMs:5000,step:.04,samples:[],
 // Pura. samples=[{t:ms de llegada,e:elapsed}], ordenadas. Devuelve % de snapshots esperados que faltaron en la ventana, o null sin datos.
 loss(samples,now,windowMs=5000,step=.04){
  const list=samples.filter(q=>now-q.t<=windowMs);if(list.length<2)return null;
  let expected=0;for(let i=1;i<list.length;i++)expected+=Math.max(1,Math.round((list[i].e-list[i-1].e)/step));
  return Math.max(0,Math.min(100,(expected-(list.length-1))/expected*100))
 },
 // Pura. Verde < 80 ms y ≤ 1 %, amarillo hasta 150 ms y 5 %, rosa por encima. Sin dato cuenta como bueno.
 tone(ping,loss){
  const p=Number.isFinite(ping)?ping:0,l=Number.isFinite(loss)?loss:0;
  return p<80&&l<=1?'ok':p<=150&&l<=5?'warn':'bad'
 },
 // Se llama desde cooperative.js por cada snapshot recibido (los duplicados con el mismo reloj se ignoran).
 record(elapsed,now){
  if(!Number.isFinite(elapsed))return;
  const list=this.samples,last=list[list.length-1];
  if(last&&(now-last.t>10000||elapsed<last.e))list.length=0;
  else if(last&&elapsed<=last.e)return;
  list.push({t:now,e:elapsed});
  while(list.length&&now-list[0].t>this.windowMs*2)list.shift()
 },
 // Estado para pintar: {text,short,tone,title}.
 status(now){
  const coop=P.Coop,title='PÉRDIDA = snapshots que no llegaron a tiempo (últimos 5 s). No es pérdida TCP real.';
  if(!coop?.active)return {text:'PING — · SOLITARIO',short:'PING —',tone:'',title:'PING no aplica en solitario. '+title};
  if(coop.reconnecting)return {text:'PING — · RECONECTANDO',short:'RECONECTANDO',tone:'bad',title:'Reconectando con la sala. '+title};
  const net=coop.net,ping=net&&Number.isFinite(net.rtt)&&Number.isFinite(net.at)&&now-net.at<=6000?net.rtt:null,last=this.samples[this.samples.length-1],loss=last&&now-last.t<=3000?this.loss(this.samples,now,this.windowMs,this.step):null;
  const pingText=ping===null?'—':ping+' ms',lossText=loss===null?'—':Math.round(loss)+' %';
  return {text:'PING '+pingText+' · PÉRDIDA '+lossText,short:pingText+' · '+lossText,tone:ping===null&&loss===null?'':this.tone(ping,loss),title}
 },
 node(){
  if(typeof document==='undefined')return null;
  const el=P.$?.('#net-indicator');if(!el)return null;
  if(!el._net)el._net={long:el.querySelector('.net-long'),short:el.querySelector('.net-short')};
  return el
 },
 paint(){
  const el=this.node();if(!el||!document.body?.classList?.contains('ref-net-ping'))return;
  const now=typeof performance!=='undefined'?performance.now():Date.now();if(now-(this.paintedAt||-1e9)<500)return;this.paintedAt=now;
  const st=this.status(now),key=st.text+'|'+st.tone;if(el._net.key===key)return;el._net.key=key;
  el._net.long.textContent=st.text;el._net.short.textContent=st.short;el.dataset.tone=st.tone;el.title=st.title;el.setAttribute('aria-label',st.text+'. '+st.title)
 }
};
{const hud=P.UI.hud;P.UI.hud=function(...a){const result=hud.apply(this,a);if(typeof document!=='undefined'){try{P.NetMeter.paint()}catch(e){}}return result}}
