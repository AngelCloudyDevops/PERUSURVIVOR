'use strict';
// El reloj del modo largo siempre usa mapTime: pausa, portales y cinemáticas no
// adelantan el mundo. Sus eventos son escasos y acotados para cuidar los FPS.
P.RunMode={
 selected:'quick',
 modes:{quick:{id:'quick',name:'Partida rápida',duration:300,description:'5 minutos · un portal · ElZeein al final'},chaos:{id:'chaos',name:'Supervivencia del Caos',duration:1800,description:'30 minutos · seis etapas · tres portales · mundo reactivo'}},
 init(){const select=P.$('#run-mode');if(!select)return;select.value=this.selected;select.onchange=()=>{this.selected=this.modes[select.value]?select.value:'quick';this.describe()};this.describe()},
 describe(){const mode=this.modes[this.selected],text=P.$('#run-mode-description'),label=P.$('#run-length-label');if(text)text.textContent=mode.description;if(label)label.textContent=this.selected==='chaos'?'SUPERVIVENCIA · 30 MIN':'PARTIDA RÁPIDA · 5 MIN'},
 begin(options={}){const forced=options.preview||P.Coop?.active||P.Coop?.initializing?'quick':this.selected,id=this.modes[forced]?forced:'quick';P.state.runMode=id;P.Data.arena.duration=this.modes[id].duration;return this.modes[id]},
 current(){return this.modes[P.state.runMode]||this.modes.quick},
 isChaos(){return this.current().id==='chaos'},
 stages:[{name:'Calma sospechosa',tone:'#b9d986'},{name:'Primer desorden',tone:'#e2c36d'},{name:'El mapa responde',tone:'#e89b62'},{name:'Crisis nacional',tone:'#df6a62'},{name:'Caos desatado',tone:'#b6669b'},{name:'Preludio de ElZeein',tone:'#9a83d1'}],
 stageAt(time=P.state.mapTime){return this.isChaos()?Math.min(5,Math.max(0,Math.floor((Number(time)||0)/300))):0},
 stage(time=P.state.mapTime){return this.stages[this.stageAt(time)]},
 dayTime(time=P.state.mapTime){return this.isChaos()?(Number(time)||0)/6:Number(time)||0},
 portalWindows(map=P.Maps.selected){const shift={plaza:35,machu:70,halloween:105,navidad:140}[map]||0;return [[360+shift,540+shift],[780+shift,1020+shift],[1260+shift,1500+shift]]},
 portalWindow(time=P.state.mapTime){if(!this.isChaos())return time>=180&&time<this.current().duration?0:-1;return this.portalWindows().findIndex(([from,to])=>time>=from&&time<to)},
 portalWarning(time=P.state.mapTime){const windows=this.isChaos()?this.portalWindows():[[180,this.current().duration]];return windows.findIndex(([from])=>time>=from-10&&time<from)},
 nextPortal(time=P.state.mapTime){if(!this.isChaos())return time<180?180:null;for(const [from,to] of this.portalWindows())if(time<to)return time<from?from:time;return null}
};

P.ChaosDirector={
 lastStage:-1,props:[],transition:null,
 reset(){this.lastStage=-1;this.props=[];this.transition=null;if(P.RunMode.isChaos())this.tick(true)},
 propKind(){return P.Maps.selected==='campo'||P.Maps.selected==='navidad'?'chaos-branch':P.Maps.selected==='plaza'?'chaos-barricade':'chaos-rubble'},
 addProp(stage){const p=P.state.player,kind=this.propKind(),angles=[-.55,.72,2.35,-2.42,1.45,-1.5],distance=360+stage*35;for(let attempt=0;attempt<6;attempt++){const a=angles[(stage+attempt)%angles.length],x=Math.round(p.x+Math.cos(a)*distance),y=Math.round(p.y+Math.sin(a)*distance*.62),w=kind==='chaos-branch'?118:kind==='chaos-barricade'?104:92,h=kind==='chaos-rubble'?52:38;if(P.Terrain.hit(x,y,Math.max(w,h)/2+22)||Math.hypot(x-P.Encounters.definition().portal.x,y-P.Encounters.definition().portal.y)<150)continue;const prop={kind,x,y,w,h,solid:true,hp:90+stage*20,maxHp:90+stage*20,id:'chaos:'+stage,chaos:true};this.props.push(prop);P.Terrain.props.push(prop);P.Terrain.revision++;P.Terrain.flow=null;P.Terrain.indexProps();return prop}},
 tick(initial=false,dt=1/60){if(this.transition){this.transition.left=Math.max(0,this.transition.left-dt);if(!this.transition.left)this.transition=null}if(!P.RunMode.isChaos()||P.state.encounter)return;const stage=P.RunMode.stageAt();if(stage===this.lastStage)return;const previous=this.lastStage;this.lastStage=stage;if(stage>0&&!initial)this.addProp(stage);if(previous>=0&&stage>previous){const data=P.RunMode.stage();this.transition={left:2.2,total:2.2,tone:data.tone};P.Loot.notify('ETAPA '+(stage+1)+' · '+data.name);P.Audio.fx('boss');P.$('#hint').textContent='EL MAPA CAMBIA · '+data.name.toUpperCase()}},
 bossVictory(){if(!P.RunMode.isChaos())return;const tone=P.RunMode.stage().tone;this.transition={left:1.8,total:1.8,tone};P.Loot.notify('EL MAPA RESPONDE · nueva etapa de presión');P.Audio.fx('upgrade')},
 draw(ctx,cx,cy,w,h){if(!P.RunMode.isChaos()||P.state.encounter)return;const stage=P.RunMode.stageAt(),t=P.state.mapTime,reduced=P.Ambient.reduced?.matches;ctx.save();if(stage>=2){ctx.fillStyle=P.Maps.selected==='machu'?'#c6d3ca':stage>=4?'#3e3152':'#8b6744';ctx.globalAlpha=(stage-1)*.018;ctx.fillRect(cx-w/2-8,cy-h/2-8,w+16,h+16)}if(!reduced&&stage>=1){ctx.globalAlpha=.18+stage*.025;ctx.fillStyle=P.Maps.selected==='plaza'?'#d9c59a':P.Maps.selected==='machu'?'#d8d0b5':'#d3b36d';for(let i=0;i<Math.min(18,6+stage*2);i++){const seed=(i*97+stage*53)%997,x=cx-w/2+((seed*37+t*(18+stage*3))%(w+80))-40,y=cy-h/2+((seed*61+i*43)%(h+40))-20;ctx.fillRect(Math.round(x),Math.round(y),stage>=4?4:3,stage>=4?3:2)}}if(this.transition){const q=this.transition,p=1-q.left/q.total;ctx.globalAlpha=(q.left/q.total)*.11;ctx.fillStyle=q.tone;ctx.fillRect(cx-w/2-8,cy-h/2-8,w+16,h+16);if(!reduced&&P.state.player){ctx.globalAlpha=(q.left/q.total)*.45;ctx.strokeStyle=q.tone;ctx.lineWidth=4;ctx.beginPath();ctx.arc(P.state.player.x,P.state.player.y,80+p*360,0,Math.PI*2);ctx.stroke()}}ctx.restore()},
 hud(){const el=P.$('#run-stage');if(!el)return;el.hidden=!P.RunMode.isChaos()||P.state.mode==='menu'||!!P.state.encounter;if(el.hidden)return;const stage=P.RunMode.stageAt(),data=P.RunMode.stage();el.textContent='ETAPA '+(stage+1)+'/6 · '+data.name.toUpperCase();el.style.color=data.tone}
};
