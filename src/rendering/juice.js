'use strict';
// Visual-only "juice": central screen-shake (trauma model) + boss defeat beat. Real-time based, so it works for solo, host and co-op client renders; never touches the simulation.
P.Juice={
trauma:0,scale:1,decay:1.3,max:14,clampTotal:18,clock:null,phase:0,seen:new Map(),flash:{start:-99,dur:.28,on:false},
now(){return (typeof performance!=='undefined'?performance.now():Date.now())/1000},
reduced(){return !!(P.Motion?P.Motion.reduced():globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)},
add(amount){if(!(amount>0))return;this.trauma=Math.min(1,this.trauma+amount)},
step(now=this.now()){const dt=this.clock===null?0:Math.max(0,Math.min(.25,now-this.clock));this.clock=now;this.phase+=dt;this.trauma=Math.max(0,this.trauma-this.decay*dt)},
// Smooth (not random) noise from a few incommensurate sines.
noise(seed){const t=this.phase;return (Math.sin(t*37+seed)+Math.sin(t*23.7+seed*2.1)*.6+Math.sin(t*61+seed*.7)*.3)/1.9},
// Screen-space offset in px (amplitude does not depend on zoom: divide by zoom when applying inside the scaled context).
own(){const k=this.reduced()?0:Math.max(0,this.scale||0),q=this.trauma*this.trauma;return {x:this.noise(1.3)*q*this.max*k,y:this.noise(7.9)*q*this.max*k}},
// Sums extra shake sources (screen px, already reduced-motion aware) with the trauma offset, clamps the total and returns world units for the zoomed context.
offset(zoom=1,extra=[],now){this.step(now);const o=this.own();let x=o.x,y=o.y;for(const v of extra){x+=v?.x||0;y+=v?.y||0}const c=this.clampTotal,z=zoom>0?zoom:1;return {x:Math.max(-c,Math.min(c,x))/z,y:Math.max(-c,Math.min(c,y))/z}},
defeatKind(e){return e.mapBoss?'mapBoss':e.miniboss?'miniboss':e.boss?'boss':null},
// Detects boss/miniboss/mapBoss deaths from render state (hp<=0 on a tracked actor), once per actor. Disappearing with hp>0 (map swap, arena reset) is ignored.
observe(){const s=P.state;if(!s||s.mode==='menu'||P.Combat?.server)return;const list=[...(s.enemies||[])];if(s.encounter?.defeat?.actor)list.push(s.encounter.defeat.actor);for(const e of list)if(e&&this.defeatKind(e)&&!this.seen.has(e))this.seen.set(e,{done:false});for(const [e,rec] of this.seen){if(e.hp<=0&&!rec.done){rec.done=true;this.defeat(e)}else if(rec.done&&!list.includes(e))this.seen.delete(e);else if(!rec.done&&!list.includes(e)&&!(e.hp<=0))this.seen.delete(e)}},
defeat(e){const kind=this.defeatKind(e);if(!kind)return;this.add(kind==='miniboss'?.45:.8);const fx=P.state.effects;if(fx&&!P.Combat?.server){const color=kind==='miniboss'?'#ffd98a':'#fff1bc';for(let i=0;i<30&&fx.length<300;i++){const a=i/30*Math.PI*2+Math.random()*.2,v=70+Math.random()*90;fx.push({kind:'spark',x:e.x,y:e.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.7,maxLife:.7,color})}}const f=this.flash;if(!f.on)f.start=this.now(),f.on=true,f.peak=kind==='miniboss'?.18:.32},
overlay(ctx,w,h){const f=this.flash;if(!f.on)return false;const reduced=this.reduced(),t=(this.now()-f.start)/(reduced?.45:f.dur);if(!(t>=0&&t<1)){f.on=false;return false}ctx.save();ctx.globalAlpha=f.peak*(reduced?.35:1)*(1-t)*(1-t);ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.restore();return true},
reset(){this.trauma=0;this.clock=null;this.seen.clear();this.flash.on=false}
};
{const render=P.World.render;P.World.render=function(...args){const value=render.apply(this,args);try{P.Juice.observe();if(P.Core?.ctx)P.Juice.overlay(P.Core.ctx,P.Core.width,P.Core.height)}catch{}return value}}
