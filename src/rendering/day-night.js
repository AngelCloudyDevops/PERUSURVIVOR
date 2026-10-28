'use strict';
P.DayNight={
smooth(a,b,t){const x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*(3-2*x)},
sample(t){t=Math.max(0,Number(t)||0);const night=this.smooth(180,270,t),warm=this.smooth(90,150,t)*(1-this.smooth(165,240,t));return {night,warm,lamps:this.smooth(165,225,t),label:t<90?'DÍA':t<180?'ATARDECER':t<270?'ANOCHECER':'NOCHE'}},
chaosPhases:[
 {label:'MAÑANA',icon:'🌤️',night:0,warm:.05,lamps:0,bright:.05},
 {label:'MEDIODÍA',icon:'☀️',night:0,warm:0,lamps:0,bright:.09},
 {label:'TARDE',icon:'🌥️',night:.04,warm:.28,lamps:0,bright:.03},
 {label:'ATARDECER',icon:'🌇',night:.2,warm:.78,lamps:.28,bright:0},
 {label:'NOCHE',icon:'🌙',night:.68,warm:.08,lamps:1,bright:0},
 {label:'TORMENTA FINAL',icon:'⛈️',night:.86,warm:0,lamps:1,bright:0}
],
mix(a,b,q){const value=k=>(a[k]||0)+((b[k]||0)-(a[k]||0))*q;return {...(q<.5?a:b),night:value('night'),warm:value('warm'),lamps:value('lamps'),bright:value('bright')}},
chaos(t){t=Math.max(0,Math.min(1799.999,Number(t)||0));const index=Math.min(5,Math.floor(t/300)),phase=this.chaosPhases[index],edge=(index+1)*300,q=index<5?this.smooth(edge-18,edge,t):0;return this.mix(phase,this.chaosPhases[Math.min(5,index+1)],q)},
current(){const s=P.state,time=s.mode==='menu'||s.encounter||s.devRun&&!s.balanceTest?0:s.mapTime,light=P.RunMode?.isChaos?.()?this.chaos(time):this.sample(time),map=P.Maps?.selected;if(map==='halloween')return {...light,night:Math.max(.58,light.night),warm:Math.min(.18,light.warm),lamps:1,label:'NOCHE DE BRUJAS',icon:'🎃'};if(map==='navidad')return {...light,label:light.night>.5?'NOCHE NEVADA':light.label,icon:light.night>.5?'🌨️':light.icon||'❄️'};return light},
active(){const s=P.state;return s.mode!=='menu'&&!s.encounter&&(!s.devRun||s.balanceTest)},
ground(ctx,cx,cy,w,h){if(!this.active())return;const light=this.current();ctx.save();if(light.bright>0){ctx.fillStyle='#fff1bd';ctx.globalAlpha=light.bright;ctx.fillRect(cx-w/2-8,cy-h/2-8,w+16,h+16)}if(light.warm>0){ctx.fillStyle='#e99549';ctx.globalAlpha=light.warm*.24;ctx.fillRect(cx-w/2-8,cy-h/2-8,w+16,h+16)}if(light.night>0){ctx.fillStyle='#142650';ctx.globalAlpha=light.night*.46;ctx.fillRect(cx-w/2-8,cy-h/2-8,w+16,h+16)}ctx.restore();if(light.lamps<=0)return;ctx.save();for(const o of P.Terrain.active()){if(o.kind!=='lamp'||Math.abs(o.x-cx)>w/2+100||Math.abs(o.y-cy)>h/2+100)continue;ctx.globalAlpha=light.lamps*.14;P.Ambient.leafMass(ctx,o.x,o.y+5,74,25,'#f1c778');ctx.globalAlpha=light.lamps*.18;P.Ambient.leafMass(ctx,o.x,o.y+4,45,16,'#f6d793')}ctx.restore()},
nextChange(){if(!P.RunMode?.isChaos?.())return null;const t=Math.max(0,P.state.mapTime||0),next=(Math.floor(t/300)+1)*300;return next<1800?Math.max(0,next-t):null},
hud(){const el=P.$('#time-of-day');el.hidden=!this.active();if(!this.active())return;const light=this.current(),weather=P.Weather?.label(),next=this.nextChange(),clock=next===null?'':` · CAMBIA ${P.Core?.clock?P.Core.clock(next):Math.ceil(next)+' s'}`,label=(light.icon||'◒')+' '+light.label+(weather?' · '+P.Weather.icon()+' '+weather:'')+clock;if(el.textContent!==label)el.textContent=label}
};
