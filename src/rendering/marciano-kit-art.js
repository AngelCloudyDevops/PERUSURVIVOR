'use strict';
P.MarcianoKitArt={image:null,ready:false,
 load(){if(typeof Image==='undefined'||this.image)return;const image=this.image=new Image();image.onload=()=>this.ready=true;image.src='assets/characters/marciano-police-escort-v1.webp'},
 cell(ctx,column,row,x,y,height,flip=false){if(!this.ready)return false;const sw=this.image.width/6,sh=this.image.height/2,scale=height/sh;ctx.save();ctx.translate(Math.round(x),Math.round(y));if(flip)ctx.scale(-1,1);ctx.imageSmoothingEnabled=false;ctx.drawImage(this.image,column*sw,row*sh,sw,sh,-sw*scale/2,-sh*scale,sw*scale,sh*scale);ctx.restore();return true},
 escort(ctx,p){const state=P.MarcianoKit?.passive?.(p),now=P.state.elapsed||0;if(!state||state.escortUntil<=now)return;this.load();const frame=Math.floor(now*7)%6,row=Math.floor(frame/3),pair=frame%3*2,bob=Math.sin(now*12)*2;this.cell(ctx,pair,row,p.x-31,p.y+9+bob,65,false);this.cell(ctx,pair+1,row,p.x+31,p.y+9-bob,65,false)},
 police(ctx,e){this.load();const frame=Math.floor((P.state.elapsed||0)*6+(e.minionId||0))%12;return this.cell(ctx,frame%6,Math.floor(frame/6),e.x,e.y+(e.r||13),Math.max(48,(e.r||13)*4.2),(e.facing||1)<0)},
 ground(ctx){const d=P.state.marcianoDomain;if(!d)return;const t=Math.min(1,d.age/1.7),pulse=.68+Math.sin((P.state.elapsed||0)*4)*.08;ctx.save();ctx.globalAlpha=.18+.25*t;ctx.fillStyle='#14220f';ctx.strokeStyle='#9dff38';ctx.lineWidth=5;ctx.setLineDash?.([20,12]);ctx.lineDashOffset=-(P.state.elapsed||0)*30;ctx.beginPath();ctx.arc(d.x,d.y,d.radius*t,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.setLineDash?.([]);for(let i=0;i<10;i++){const a=i*Math.PI*2/10,r=d.radius*(.32+.62*t),x=d.x+Math.cos(a)*r,y=d.y+Math.sin(a)*r;ctx.globalAlpha=.22*t*pulse;ctx.fillStyle=i%2?'#f5ff7a':'#75ff52';ctx.beginPath();ctx.arc(x,y,18+8*pulse,0,Math.PI*2);ctx.fill()}ctx.restore()},
 overlay(ctx){const d=P.state.marcianoDomain;if(!d)return;const {width:w,height:h}=P.Core,fade=Math.max(0,Math.min(1,d.age/.18))*Math.max(0,Math.min(1,(2.2-d.age)/.4));if(!fade)return;ctx.save();ctx.globalAlpha=fade;ctx.textAlign='center';ctx.lineJoin='round';ctx.font='900 '+Math.min(48,w/19)+'px monospace';ctx.lineWidth=7;ctx.strokeStyle='#07100a';ctx.fillStyle='#baff68';ctx.strokeText('EXPANSIÓN DE DOMINIO',w/2,h*.18);ctx.fillText('EXPANSIÓN DE DOMINIO',w/2,h*.18);ctx.font='900 '+Math.min(58,w/15)+'px monospace';ctx.fillStyle='#fff0a5';ctx.strokeText('DISCO-BAR MANHATTAN',w/2,h*.82);ctx.fillText('DISCO-BAR MANHATTAN',w/2,h*.82);ctx.restore()}
};
P.MarcianoKitArt.load();
{
 const actor=P.Sprites.actor,enemy=P.EnemyArt.draw,ground=P.DomainAftermath.draw,world=P.World.render;
 P.Sprites.actor=function(ctx,p,...args){if(p?.id==='marciano')P.MarcianoKitArt.escort(ctx,p);return actor.call(this,ctx,p,...args)};
 P.EnemyArt.draw=function(ctx,e,...args){if(e?.marcianoPolice&&P.MarcianoKitArt.police(ctx,e))return;return enemy.call(this,ctx,e,...args)};
 P.DomainAftermath.draw=function(ctx,...args){const result=ground.call(this,ctx,...args);P.MarcianoKitArt.ground(ctx);return result};
 P.World.render=function(...args){const result=world.apply(this,args);if(P.state.marcianoDomain)P.MarcianoKitArt.overlay(P.Core.ctx);return result};
}
