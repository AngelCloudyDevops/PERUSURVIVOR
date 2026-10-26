'use strict';
// Map time advances only during exploration. Each new wave keeps its birth profile.
P.Difficulty={
stages:[
 {at:0,name:'Primeros pasos',types:1,heavy:0,interval:1.15,cap:16,danger:0,casts:0,tier:0,windup:1.35,cooldown:1.4},
 {at:20,name:'Primeras señales',types:1,heavy:0,interval:1.05,cap:24,danger:6,casts:2,tier:0,windup:1.35,cooldown:1.4},
 {at:45,name:'Embestidas',types:2,heavy:.06,interval:.95,cap:32,danger:10,casts:3,tier:0,windup:1.25,cooldown:1.3},
 {at:85,name:'Combos',types:3,heavy:.10,interval:.85,cap:40,danger:16,casts:3,tier:1,windup:1.15,cooldown:1.2},
 {at:125,name:'Control de área',types:4,heavy:.14,interval:.75,cap:48,danger:20,casts:4,tier:1,windup:1.1,cooldown:1.1},
 {at:170,name:'Trayectorias',types:5,heavy:.18,interval:.65,cap:60,danger:26,casts:5,tier:2,windup:1,cooldown:1.05},
 {at:215,name:'Fuego cruzado',types:6,heavy:.22,interval:.55,cap:72,danger:32,casts:6,tier:2,windup:1,cooldown:1},
 {at:255,name:'Caos total',types:6,heavy:.25,interval:.42,cap:80,danger:40,casts:8,tier:3,windup:1,cooldown:1}
],
index(time=P.state.mapTime){let i=0;while(i+1<this.stages.length&&time>=this.stages[i+1].at)i++;return i},
current(){return this.stages[P.state.devRun||P.state.encounter?7:this.index()]},
attack(e){const base=P.Systems.minionAttacks[e.design];if(!base||!e.progressive||P.state.devRun||P.state.encounter)return base;const stage=this.stages[e.threatStage];if(!stage||!stage.casts)return null;return {...base,windup:base.windup*stage.windup,cooldown:base.cooldown*stage.cooldown,fanCount:stage.tier?3:1,burstCount:stage.tier>=3?3:2}},
limits(e){return e.progressive&&!P.state.devRun&&!P.state.encounter?this.current():{danger:40,casts:8}},
hud(){const el=P.$('#difficulty-status');if(!el)return;const s=P.state;el.hidden=!!(s.devRun||s.encounter||s.bossSpawned);if(!el.hidden){const i=this.index(),stage=this.stages[i],names=['Pablo','Tyrone','Uniqua','Tasha','Austin','PNP'];P.UI.text('#difficulty-status','ETAPA '+(i+1)+' · '+stage.name+' · '+names.slice(0,stage.types).join(', '))}}
};
