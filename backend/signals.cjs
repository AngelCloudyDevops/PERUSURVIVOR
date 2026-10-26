'use strict';
const kinds=['here','danger','help','chest'];
class Signals{
 constructor(sim){this.sim=sim;this.time=0;this.items=[];this.last=[-Infinity,-Infinity]}
 scene(){return this.sim.P.state.encounter?.definition?.id|| (this.sim.P.state.encounter?'arena':'world')}
 send(slot,kind){const p=this.sim.players[slot];if(!p||!kinds.includes(kind)||this.sim.result||this.sim.P.state.court||this.sim.P.state.domain||this.time-this.last[slot]<2)return false;this.last[slot]=this.time;this.items=this.items.filter(x=>x.slot!==slot);this.items.push({slot,kind,x:p.x,y:p.y,left:5,scene:this.scene()});return true}
 tick(dt){this.time+=dt;this.items=this.items.filter(x=>(x.left-=dt)>0&&x.scene===this.scene())}
 snapshot(){return this.items.filter(x=>x.scene===this.scene()).map(({scene,...x})=>({...x}))}
}
module.exports={Signals};
