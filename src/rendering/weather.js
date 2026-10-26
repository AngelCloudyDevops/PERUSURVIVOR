'use strict';
// Episodios visuales deterministas: 25 s de garúa, 65 s despejados.
P.Weather={
sample(t){t=Math.max(0,Number(t)||0);if(t<60)return {intensity:0};const phase=(t-60)%90;if(phase>=25)return {intensity:0};const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};return {intensity:smooth(phase/3)*smooth((25-phase)/3)}},
active(){const s=P.state;return P.Maps.selected==='campo'&&s.mode!=='menu'&&!s.encounter&&!s.devRun&&!P.Ambient.reduced?.matches},
current(){return this.active()?this.sample(P.state.mapTime):{intensity:0}},
draw(ctx,cx,cy,w,h){const rain=this.current().intensity;if(rain<=0)return;const t=P.state.mapTime,cell=180;ctx.save();ctx.globalAlpha=rain*.28;ctx.fillStyle='#bed0cc';const left=Math.floor((cx-w/2-cell)/cell),right=Math.ceil((cx+w/2+cell)/cell),top=Math.floor((cy-h/2-cell)/cell),bottom=Math.ceil((cy+h/2+cell)/cell);let count=0;for(let gy=top;gy<=bottom;gy++)for(let gx=left;gx<=right;gx++){if(count++>=80)break;const seed=P.Chunks.hash(gx,gy,307),x=Math.round(gx*cell+(seed%cell+t*19)%cell),y=Math.round(gy*cell+((seed>>>8)%cell+t*125)%cell);ctx.fillRect(x,y,2,7);ctx.fillRect(x+2,y+6,2,4);if(seed%3===0){const age=(t*1.3+(seed%17)/17)%1;if(age<.3){const sx=Math.round(gx*cell+seed%150),sy=Math.round(gy*cell+(seed>>>10)%150),r=age<.15?3:5;ctx.fillRect(sx-r,sy,r*2,1);ctx.fillRect(sx,sy-2,2,2)}}}ctx.restore()}
};
