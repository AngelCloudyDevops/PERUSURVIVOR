'use strict';
// Birth-time ranks: keep the six intact animation frames and the original collision shape.
P.MinionEvolution={
profiles:[
 {hp:1,speed:1,contact:1,damage:1,shotSpeed:1,cooldown:1,color:null},
 {hp:1.35,speed:1.06,contact:1.15,damage:1.2,shotSpeed:1.06,cooldown:.92,color:'#e4b46b'},
 {hp:1.85,speed:1.12,contact:1.3,damage:1.45,shotSpeed:1.12,cooldown:.82,color:'#c99aff'}
],
eligible(e){return !e.boss&&!e.mapBoss&&!e.miniboss&&!e.mimic&&Number.isInteger(e.design)&&e.design>=0&&e.design<6},
rank(e){return this.eligible(e)?(Number.isInteger(e.evolution)?Math.max(0,Math.min(2,e.evolution)):0):0},
choose(time,roll=Math.random()){if(time<125)return 0;if(time<170)return roll<.35?1:0;if(time<215)return roll<.5?1:0;if(time<255)return roll<.2?2:roll<.65?1:0;return roll<.4?2:roll<.8?1:0},
apply(e){if(e.evolutionApplied||!this.eligible(e))return e;const s=P.state;e.evolution=s.devRun||s.encounter?0:this.choose(s.mapTime);e.evolutionApplied=true;const tier=this.rank(e),rank=this.profiles[tier];if(tier){e.hp=e.max=Math.round(e.max*rank.hp);e.speed*=rank.speed;}return e},
attack(e,base){const tier=this.rank(e);if(!base||!tier)return base;const rank=this.profiles[tier];return {...base,damage:base.damage*rank.damage,speed:base.speed?base.speed*rank.shotSpeed:undefined,cooldown:base.cooldown*rank.cooldown,fanCount:Math.min(5,(base.fanCount||3)+(tier===2?2:0)),twinCount:2+tier,burstCount:Math.min(4,(base.burstCount||3)+(tier===2?1:0)),zigCount:base.mode==='zigzag'&&tier===2?2:1,radius:base.radius?base.radius*(tier===2?1.16:1.08):undefined,chargeSpeed:tier===2?330:315,chargeTime:tier===2?.48:.45}},
contact(e){if(e.boss)return 25;if(e.charge)return e.charge.damage||12;return 10*this.profiles[this.rank(e)].contact},
offsets(count,spread){return count<=1?[0]:Array.from({length:count},(_,i)=>(i-(count-1)/2)*spread/(count-1))},
ground(ctx,e){const tier=this.rank(e);if(!tier)return;const r=e.r+5;ctx.save();ctx.strokeStyle=this.profiles[tier].color;ctx.lineWidth=tier===2?2:1.5;ctx.beginPath();ctx.ellipse(0,0,r,6,0,0,Math.PI*2);ctx.stroke();if(tier===2){ctx.beginPath();for(const x of [-r-4,r+4]){ctx.moveTo(x-3,0);ctx.lineTo(x,-3);ctx.lineTo(x+3,0);ctx.lineTo(x,3);ctx.closePath()}ctx.stroke()}ctx.restore()},
gear(ctx,e,height){const tier=this.rank(e);if(!tier)return;const c=this.profiles[tier].color,pad=Math.max(4,Math.round(height*.1)),y=Math.round(-height*.49);ctx.save();ctx.fillStyle=c;ctx.strokeStyle='#24303d';ctx.lineWidth=1;for(const side of [-1,1]){const x=Math.round(side*height*.2-pad/2);ctx.fillRect(x,y,pad,3+tier);ctx.strokeRect(x,y,pad,3+tier)}ctx.strokeStyle=c;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-height*.14,y+3);ctx.lineTo(0,y+height*.13);ctx.lineTo(height*.14,y+3);ctx.stroke();if(tier===2){ctx.fillRect(-2,y+height*.15,4,4);ctx.fillRect(-2,y+height*.23,4,3)}ctx.restore()}
};
