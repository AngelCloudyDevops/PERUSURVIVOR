'use strict';
// Map time advances only during exploration. Each new wave keeps its birth profile.
P.Difficulty={
stages:[
 {at:0,name:'El barrio despierta',types:3,heavy:0,interval:.85,cap:16,danger:0,casts:0,tier:0,windup:1.4,cooldown:1.5},
 {at:8,name:'Primer empuje',types:3,heavy:0,interval:.78,cap:24,danger:6,casts:1,tier:0,windup:1.4,cooldown:1.5},
 {at:30,name:'Cierra filas',types:3,heavy:.06,interval:.7,cap:32,danger:10,casts:2,tier:0,windup:1.3,cooldown:1.35},
 {at:65,name:'Control de calles',types:4,heavy:.10,interval:.7,cap:40,danger:16,casts:3,tier:1,windup:1.2,cooldown:1.2},
 {at:110,name:'Presión sostenida',types:4,heavy:.14,interval:.68,cap:48,danger:20,casts:4,tier:1,windup:1.1,cooldown:1.1},
 {at:170,name:'Trayectorias',types:5,heavy:.18,interval:.6,cap:60,danger:26,casts:5,tier:2,windup:1,cooldown:1.05},
 {at:215,name:'Fuego cruzado',types:6,heavy:.22,interval:.5,cap:72,danger:32,casts:6,tier:2,windup:1,cooldown:1},
 {at:255,name:'Caos total',types:6,heavy:.25,interval:.42,cap:80,danger:40,casts:8,tier:3,windup:1,cooldown:1}
],
fame(e){return e.waveRole?(e.waveRole==='runner'?.5:e.heavy?2.25:.75):(e.heavy?3:1)},
phase(time=P.state.mapTime){const t=Math.max(0,time)%30,rush=t>=8&&t<20;return {rush,factor:rush?.72:1.05}},
pace(e,time){if(e.boss||P.state.devRun||P.state.encounter)return e;const runner=!e.heavy&&e.minionId%5===1;e.waveRole=e.heavy?'heavy':runner?'runner':'line';e.speed=e.heavy?Math.min(80,65+time*.05):runner?Math.min(150,134+time*.045):Math.min(110,90+time*.06);if(runner)e.hp=e.max=Math.round(e.max*.85);return e},
spawnPoint(p,angle,legacyRadius,boss){if(boss||P.state.devRun||P.state.encounter)return {x:p.x+Math.cos(angle)*legacyRadius,y:p.y+Math.sin(angle)*legacyRadius};const players=P.Combat.server&&P.Court?P.Court.players().filter(q=>q.hp>0):[p];let left=Infinity,right=-Infinity,top=Infinity,bottom=-Infinity;for(const q of players.length?players:[p]){const v=P.Combat.view(q);left=Math.min(left,q.x+v.dx-v.hw);right=Math.max(right,q.x+v.dx+v.hw);top=Math.min(top,q.y+v.dy-v.hh);bottom=Math.max(bottom,q.y+v.dy+v.hh)}const cx=(left+right)/2,cy=(top+bottom)/2,dx=Math.cos(angle),dy=Math.sin(angle),r=Math.max(...(players.length?players:[p]).map(q=>230+Math.hypot(q.x-cx,q.y-cy)),Math.min(((right-left)/2+90)/Math.max(.0001,Math.abs(dx)),((bottom-top)/2+90)/Math.max(.0001,Math.abs(dy))));return {x:cx+dx*r,y:cy+dy*r}},
index(time=P.state.mapTime){let i=0;while(i+1<this.stages.length&&time>=this.stages[i+1].at)i++;return i},
current(){return this.stages[P.state.devRun||P.state.encounter?7:this.index()]},
attack(e){const base=P.Systems.minionAttacks[e.design];if(!base||!e.progressive||P.state.devRun||P.state.encounter)return P.MinionEvolution.attack(e,base);const stage=this.stages[e.threatStage];if(!stage||!stage.casts)return null;return P.MinionEvolution.attack(e,{...base,windup:base.windup*stage.windup,cooldown:base.cooldown*stage.cooldown,fanCount:stage.tier?3:1,burstCount:stage.tier>=3?3:2})},
limits(e){return e.progressive&&!P.state.devRun&&!P.state.encounter?this.current():{danger:40,casts:8}},
hud(){const el=P.$('#difficulty-status');if(!el)return;const s=P.state;el.hidden=!!(s.devRun||s.encounter||s.bossSpawned);if(!el.hidden){const i=this.index(),stage=this.stages[i],names=['Pablo','Tyrone','Uniqua','Tasha','Austin','PNP'];P.UI.text('#difficulty-status','ETAPA '+(i+1)+' · '+stage.name+' · '+(this.phase().rush?'EMPUJE':'RESPIRO')+' · '+names.slice(0,stage.types).join(', '))}}
};
