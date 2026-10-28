'use strict';
P.DayNight={
smooth(a,b,t){const x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*(3-2*x)},
sample(t){t=Math.max(0,Number(t)||0);const night=this.smooth(180,270,t),warm=this.smooth(90,150,t)*(1-this.smooth(165,240,t));return {night,warm,lamps:this.smooth(165,225,t),label:t<90?'DÍA':t<180?'ATARDECER':t<270?'ANOCHECER':'NOCHE'}},
chaosPhases:[
 {label:'MAÑANA',icon:'🌥️',night:.04,warm:0,lamps:0,bright:0,cool:.42,storm:0},
 {label:'MEDIODÍA',icon:'☀️',night:0,warm:.04,lamps:0,bright:.18,cool:0,storm:0},
 {label:'TARDE',icon:'🌤️',night:.04,warm:.58,lamps:0,bright:.05,cool:0,storm:0},
 {label:'ATARDECER',icon:'🌇',night:.28,warm:1,lamps:.38,bright:0,cool:0,storm:0},
 {label:'NOCHE',icon:'🌙',night:.76,warm:.05,lamps:1,bright:0,cool:.12,storm:0},
 {label:'TORMENTA FINAL',icon:'⛈️',night:.88,warm:0,lamps:1,bright:0,cool:.55,storm:1}
],
mix(a,b,q){const value=k=>(a[k]||0)+((b[k]||0)-(a[k]||0))*q;return {...a,night:value('night'),warm:value('warm'),lamps:value('lamps'),bright:value('bright'),cool:value('cool'),storm:value('storm')}},
chaos(t){t=Math.max(0,Math.min(1799.999,Number(t)||0));const index=Math.min(5,Math.floor(t/300)),phase=this.chaosPhases[index],edge=(index+1)*300,q=index<5?this.smooth(edge-18,edge,t):0;return this.mix(phase,this.chaosPhases[Math.min(5,index+1)],q)},
current(){const s=P.state,time=s.mode==='menu'||s.encounter||s.devRun&&!s.balanceTest?0:s.mapTime,light=P.RunMode?.isChaos?.()?this.chaos(time):this.sample(time),map=P.Maps?.selected;if(map==='halloween')return {...light,night:Math.max(.58,light.night),warm:Math.min(.18,light.warm),lamps:1,label:'NOCHE DE BRUJAS',icon:'🎃'};if(map==='navidad')return {...light,label:light.night>.5?'NOCHE NEVADA':light.label,icon:light.night>.5?'🌨️':light.icon||'❄️'};return light},
active(){const s=P.state;return s.mode!=='menu'&&!s.encounter&&(!s.devRun||s.balanceTest)},
ground(ctx,cx,cy,w,h){if(!this.active())return;const light=this.current();ctx.save();if(light.bright>0){ctx.fillStyle='#fff5cf';ctx.globalAlpha=light.bright;ctx.fillRect(cx-w/2-8,cy-h/2-8,w+16,h+16)}if(light.warm>0){ctx.fillStyle='#ee8235';ctx.globalAlpha=light.warm*.3;ctx.fillRect(cx-w/2-8,cy-h/2-8,w+16,h+16)}if(light.cool>0){ctx.fillStyle=light.storm>.2?'#607486':'#9aa9ad';ctx.globalAlpha=light.cool*(light.storm>.2?.24:.2);ctx.fillRect(cx-w/2-8,cy-h/2-8,w+16,h+16)}if(light.night>0){ctx.fillStyle=light.storm>.2?'#101c2c':'#10244a';ctx.globalAlpha=light.night*.48;ctx.fillRect(cx-w/2-8,cy-h/2-8,w+16,h+16)}ctx.restore();if(light.lamps<=0)return;ctx.save();for(const o of P.Terrain.active()){if(o.kind!=='lamp'||Math.abs(o.x-cx)>w/2+100||Math.abs(o.y-cy)>h/2+100)continue;ctx.globalAlpha=light.lamps*.16;P.Ambient.leafMass(ctx,o.x,o.y+5,78,27,'#f1c778');ctx.globalAlpha=light.lamps*.22;P.Ambient.leafMass(ctx,o.x,o.y+4,48,18,'#ffe0a0')}ctx.restore()},
nextChange(){if(!P.RunMode?.isChaos?.())return null;const t=Math.max(0,P.state.mapTime||0),next=(Math.floor(t/300)+1)*300;return next<1800?Math.max(0,next-t):null},
hud(){const el=P.$('#time-of-day');el.hidden=!this.active();if(!this.active())return;const light=this.current(),weather=P.Weather?.label(),next=this.nextChange(),clock=next===null?'':` · CAMBIA ${P.Core?.clock?P.Core.clock(next):Math.ceil(next)+' s'}`,label=(light.icon||'◒')+' '+light.label+(weather?' · '+P.Weather.icon()+' '+weather:'')+clock;if(el.textContent!==label)el.textContent=label}
};
