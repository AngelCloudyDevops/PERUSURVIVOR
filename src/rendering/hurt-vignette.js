'use strict';
// Visual-only hurt feedback: red edge vignette + hurt sound. Detects hp loss of the local player on the render side so solo and co-op (client never runs the hit path) behave the same.
P.HurtFx={
duration:.3,start:-99,power:0,last:null,who:null,grad:null,gw:0,gh:0,
now(){return (typeof performance!=='undefined'?performance.now():Date.now())/1000},
hurt(amount,max){this.start=this.now();this.power=Math.max(.25,Math.min(1,amount/Math.max(1,max||100)*3));P.Audio?.fx('hurt')},
observe(p){if(!p||P.state.mode==='menu'){this.who=null;return}if(p!==this.who){this.who=p;this.last=p.hp}if(p.hp<this.last-.01&&P.state.mode==='play')this.hurt(this.last-p.hp,p.maxHp);this.last=p.hp},
draw(ctx,w,h){const t=(this.now()-this.start)/this.duration;if(!(t>=0&&t<1))return false;const reduced=(P.Motion?P.Motion.reduced():globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches),k=1-t;if(this.gw!==w||this.gh!==h||!this.grad){this.gw=w;this.gh=h;this.grad=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.3,w/2,h/2,Math.hypot(w,h)/2);this.grad.addColorStop(0,'rgba(190,18,30,0)');this.grad.addColorStop(1,'rgba(190,18,30,1)')}ctx.save();ctx.globalAlpha=(reduced?.25:.6)*this.power*(reduced?k:k*k);ctx.fillStyle=this.grad;ctx.fillRect(0,0,w,h);ctx.restore();return true}
};
{const render=P.World.render;P.World.render=function(...args){const value=render.apply(this,args);try{P.HurtFx.observe(P.state.player);if(P.Core?.ctx)P.HurtFx.draw(P.Core.ctx,P.Core.width,P.Core.height)}catch{}return value}}
