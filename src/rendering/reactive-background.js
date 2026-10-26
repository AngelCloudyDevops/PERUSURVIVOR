'use strict';
// Estado visual local: traduce el combate a movimiento ambiental sin tocar física ni simulación.
P.ReactiveBackground={
clamp(v){return Math.max(0,Math.min(1,v))},
smooth(v){v=this.clamp(v);return v*v*(3-2*v)},
active(){const s=P.state;return P.Maps.selected==='campo'&&s.mode!=='menu'&&!s.encounter&&!s.devRun},
reduced(){return !!P.Ambient?.reduced?.matches},
reset(map=P.Maps.selected,time=P.state.mapTime??0){this.map=map;this.lastTime=time;this.sampleKey='';this.ultimateWas=false;this.threatActor=null;this.burst=null;this.burstSerial=0;this.value={pressure:0,danger:0,progress:0,pulse:0,breeze:.18,burst:null}},
ultimate(){const s=P.state;return !!(s.ultimate?.left>0||s.court||s.domain||s.player?.ultimate?.left>0)},
startBurst(kind,x,y,power=1){this.burst={id:++this.burstSerial,kind,x:Number(x)||0,y:Number(y)||0,start:P.state.mapTime??0,power:this.clamp(power)}},
sample(){
 const s=P.state,t=Number(s.mapTime)||0,map=P.Maps.selected;
 if(this.map!==map||this.lastTime===undefined||t<this.lastTime)this.reset(map,t);
 this.lastTime=t;
 if(!this.active()){this.value={pressure:0,danger:0,progress:0,pulse:0,breeze:.18,burst:null};return this.value}
 const p=s.player||{x:0,y:0,hp:1,maxHp:1};let threat=0,scanned=0,actor=null;
 const ultimate=this.ultimate(),key=[map,s.mode,t,p.hp,(s.enemies||[]).length,ultimate].join(':');if(this.sampleKey===key)return this.value;this.sampleKey=key;
 for(const e of s.enemies||[]){if(!e||e.hp<=0||scanned++>=80)continue;const distance=Math.hypot((e.x||0)-p.x,(e.y||0)-p.y);if(distance>520)continue;const weight=e.boss?5:e.miniboss||e.mapBoss?3:e.heavy?1.5:1;threat+=weight*(1-distance/650);if(!actor&&(e.boss||e.miniboss||e.mapBoss))actor=e}
 if(ultimate&&!this.ultimateWas&&!this.reduced())this.startBurst('ultimate',p.x,p.y,1);
 this.ultimateWas=ultimate;
 if(actor&&actor!==this.threatActor&&!this.reduced())this.startBurst(actor.boss?'boss':'elite',actor.x,actor.y,actor.boss?1:.72);
 this.threatActor=actor;
 const age=this.burst?t-this.burst.start:99,pulse=this.reduced()||age<0||age>1.2?0:this.smooth(1-age/1.2)*this.burst.power;
 const pressure=this.clamp(threat/8),life=this.clamp((p.maxHp*.45-p.hp)/(p.maxHp*.35||1)),progress=this.clamp(t/Math.max(1,P.Data?.arena?.duration||300));
 this.value={pressure,danger:life,progress,pulse,breeze:.18+progress*.2+pressure*.38+pulse*.72,burst:pulse>0?this.burst:null};return this.value
},
sway(x,y){if(this.reduced())return 0;const m=this.sample(),t=P.state.mapTime||0,base=Math.sin(t*1.9+x*.011+y*.007)*(1.5+m.breeze*2.5);if(!m.burst)return Math.round(base);const d=Math.hypot(x-m.burst.x,y-m.burst.y),wave=Math.max(0,1-d/210)*m.pulse*7;return Math.round(base+Math.sin(t*24+d*.045)*wave)},
react(o){const m=this.sample();if(!m.burst||this.reduced())return null;const d=Math.hypot(o.x-m.burst.x,o.y-m.burst.y);return d<190?m.burst:null},
draw(ctx,cx,cy,w,h){if(!this.active()||this.reduced())return;const m=this.sample(),t=P.state.mapTime||0,count=Math.min(10,6+Math.round(m.pressure*4));ctx.save();ctx.imageSmoothingEnabled=false;
 // Ráfagas cortas y deterministas; solo existen dentro de la cámara.
 ctx.globalAlpha=.08+m.pressure*.07;ctx.fillStyle='#e1dda0';for(let i=0;i<count;i++){const span=w+180,x=Math.round(cx-w/2-90+((i*197+t*(18+m.breeze*28))%span+span)%span),y=Math.round(cy-h/2+40+(i*113%Math.max(80,h-80))+Math.sin(t*.8+i)*8),length=8+(i%3)*4;ctx.fillRect(x,y,length,2);ctx.fillRect(x+length-2,y-2,4,2)}
 if(m.burst){const age=t-m.burst.start,r=28+age*135;ctx.globalAlpha=m.pulse*.48;ctx.strokeStyle=m.burst.kind==='boss'?'#efc868':'#d8e8a0';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(Math.round(m.burst.x),Math.round(m.burst.y+12),r,r*.32,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#d0bd72';for(let i=0;i<12;i++){const a=i*Math.PI/6+(m.burst.id%7)*.13,rr=r*(.68+(i%3)*.12);ctx.fillRect(Math.round(m.burst.x+Math.cos(a)*rr),Math.round(m.burst.y+12+Math.sin(a)*rr*.32),4,2)}}
 ctx.restore()
}
};
