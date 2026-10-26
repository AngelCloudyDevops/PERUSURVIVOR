'use strict';
P.DayNight={
smooth(a,b,t){const x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*(3-2*x)},
sample(t){t=Math.max(0,Number(t)||0);const night=this.smooth(180,270,t),warm=this.smooth(90,150,t)*(1-this.smooth(165,240,t));return {night,warm,lamps:this.smooth(165,225,t),label:t<90?'DÍA':t<180?'ATARDECER':t<270?'ANOCHECER':'NOCHE'}},
current(){const s=P.state;return this.sample(s.mode==='menu'||s.encounter||s.devRun?0:s.mapTime)},
active(){const s=P.state;return s.mode!=='menu'&&!s.encounter&&!s.devRun},
ground(ctx,cx,cy,w,h){if(!this.active())return;const light=this.current();ctx.save();if(light.warm>0){ctx.fillStyle='#e99549';ctx.globalAlpha=light.warm*.16;ctx.fillRect(cx-w/2-8,cy-h/2-8,w+16,h+16)}if(light.night>0){ctx.fillStyle='#172c57';ctx.globalAlpha=light.night*.3;ctx.fillRect(cx-w/2-8,cy-h/2-8,w+16,h+16)}ctx.restore();if(light.lamps<=0)return;ctx.save();for(const o of P.Terrain.active()){if(o.kind!=='lamp'||Math.abs(o.x-cx)>w/2+100||Math.abs(o.y-cy)>h/2+100)continue;ctx.globalAlpha=light.lamps*.09;P.Ambient.leafMass(ctx,o.x,o.y+5,74,25,'#f1c778');ctx.globalAlpha=light.lamps*.11;P.Ambient.leafMass(ctx,o.x,o.y+4,45,16,'#f6d793')}ctx.restore()},
hud(){const el=P.$('#time-of-day');el.hidden=!this.active();if(!this.active())return;const label='◒ '+this.current().label+(P.Weather?.current().intensity>0?' · GARÚA':'');if(el.textContent!==label)el.textContent=label}
};
