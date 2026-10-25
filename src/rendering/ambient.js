'use strict';
// Decoración local sin colisiones ni estado persistente por sector.
P.Ambient={
reduced:typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):null,
active(){return P.Maps.selected==='campo'&&!P.state.encounter&&P.state.mode!=='menu'},
clock(){return this.reduced?.matches?0:P.state.elapsed},
sway(x,y){return Math.round(Math.sin(this.clock()*1.6+x*.013+y*.009)*2)},
items(cx,cy,w,h){if(!this.active())return [];const items=[];for(let gy=Math.floor((cy-h/2-80)/160);gy<=Math.ceil((cy+h/2+80)/160);gy++)for(let gx=Math.floor((cx-w/2-80)/160);gx<=Math.ceil((cx+w/2+80)/160);gx++){const seed=P.Chunks.hash(gx,gy,139),x=gx*160+32+seed%80,y=gy*160+32+(seed>>>8)%80;if(P.Chunks.roadDistance(x,y)<100||P.Chunks.ground(x,y).road||P.Terrain.hit(x,y,36))continue;items.push({x,y,seed,bush:seed%5===0})}return items},
ground(ctx,items,cx,cy,w,h){if(!this.active())return;const t=this.clock();ctx.save();for(const o of items){if(o.bush)continue;const d=this.sway(o.x,o.y);ctx.fillStyle='#a4b65d';for(let i=0;i<3;i++){const x=o.x+i*5,y=o.y+(i%2)*3;ctx.fillRect(x,y-7,2,8);ctx.fillRect(x+d,y-10,2,4)}}
// Pocas hojas, ancladas al mundo y siempre por debajo de los personajes.
if(!this.reduced?.matches){ctx.globalAlpha=.65;for(let i=0;i<7;i++){const ox=((i*173+t*24)% (w+100)+w+100)%(w+100),oy=((i*137+t*13)%(h+100)+h+100)%(h+100),x=Math.round(cx-w/2-50+ox),y=Math.round(cy-h/2-50+oy+Math.sin(t*1.5+i)*9);ctx.fillStyle=i%2?'#b0b86b':'#73944e';ctx.fillRect(x,y,5,2);ctx.fillRect(x+2,y-2,3,2)}}ctx.restore()},
bush(ctx,o){const d=this.sway(o.x,o.y);ctx.save();ctx.translate(Math.round(o.x),Math.round(o.y));ctx.fillStyle='#213c3655';ctx.fillRect(-23,-1,48,10);ctx.translate(d,0);ctx.fillStyle='#284f39';ctx.fillRect(-24,-22,48,24);ctx.fillRect(-17,-32,34,12);ctx.fillStyle='#47784a';ctx.fillRect(-21,-23,21,16);ctx.fillRect(-12,-31,28,15);ctx.fillRect(5,-24,17,18);ctx.fillStyle='#77964e';ctx.fillRect(-10,-29,13,5);ctx.fillRect(9,-21,9,4);if(o.seed%3===0){ctx.fillStyle='#e4c580';ctx.fillRect(-14,-16,3,3);ctx.fillRect(13,-12,3,3)}ctx.restore()}
};
