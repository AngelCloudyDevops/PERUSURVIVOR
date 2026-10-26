'use strict';
// Atlas UR: ocho figuras completas; no se deforman ni se separan extremidades.
P.SideralArt={ready:false,failed:false,image:null,
load(){if(this.ready||this.image||typeof Image==='undefined')return;const image=this.image=new Image();image.onload=()=>this.ready=true;image.onerror=()=>{this.failed=true;this.image=null};image.src='assets/characters/sideral-ur-v1.webp'},
frame(p,attack=false,preview=0){if(attack){const t=P.PlayerAttackArt.progress(p);return t===null?3:Math.min(7,4+Math.floor(t*4))}if(p.moving||preview)return 1+(Math.floor((p.walkPhase||preview)*.65)&1);return 0},
draw(ctx,x,y,r,p,attack=false,flip=false,preview=0){this.load();if(!this.ready)return false;const i=this.frame(p,attack,preview),cw=this.image.width/4,ch=this.image.height/2,sx=i%4*cw,sy=Math.floor(i/4)*ch,height=r*3.15,scale=height/ch;ctx.save();ctx.translate(Math.round(x),Math.round(y+r*.82));if(flip)ctx.scale(-1,1);ctx.imageSmoothingEnabled=false;ctx.drawImage(this.image,sx,sy,cw,ch,-cw*scale/2,-ch*scale,cw*scale,ch*scale);ctx.restore();return true}}
;
const baseSprite=P.Sprites.draw;P.Sprites.draw=function(ctx,x,y,r,c,frame=0,flip=false,gait=null){if(c.id==='sideral')return P.SideralArt.draw(ctx,x,y,r,c,false,flip,frame)||baseSprite.call(this,ctx,x,y,r,c,frame,flip,gait);return baseSprite.call(this,ctx,x,y,r,c,frame,flip,gait)};
const baseAttack=P.PlayerAttackArt.draw;P.PlayerAttackArt.draw=function(ctx,p){if(p.id!=='sideral')return baseAttack.call(this,ctx,p);const progress=this.progress(p);if(progress===null)return false;return P.SideralArt.draw(ctx,p.x,p.y,27,p,true,this.heading(p)<0)};
P.SideralArt.load();
