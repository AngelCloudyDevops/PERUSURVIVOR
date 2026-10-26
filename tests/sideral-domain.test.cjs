'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {Simulation}=require('../backend/simulation.cjs');

function setup(){
 const sim=new Simulation('campo',[0,1],path.resolve(__dirname,'..')),P=sim.P,s=P.state,c=P.Data.characters.find(c=>c.id==='sideral'),p=P.Entities.player(c);
 Object.assign(p,{slot:0,shots:[],fields:[],revive:0,x:120,y:90});s.player=p;P.Ultimate.reset();p.ultimate=s.ultimate;sim.players[0]=p;return {sim,P,s,p};
}

test('Sideral: reemplaza el mapa por una habitación física y la serializa en cooperativo',()=>{
 const {sim,P,s,p}=setup();p.ultimate.charge=100;sim.tick(.04,[{ultimate:true},{}]);for(let i=0;i<112;i++)sim.tick(.04,[{},{}]);
 assert.equal(s.sideralDomain.arena,true);assert.equal(P.Terrain.active().filter(o=>o.kind==='sideral-wall').length,4);
 assert(P.Terrain.active().some(o=>o.kind==='sideral-desk'));assert(P.Terrain.active().some(o=>o.kind==='sideral-library'));
 assert.equal(sim.snapshot().sideralDomain.arena,true);assert.equal(sim.snapshot().sideralDomain.roomProps,undefined);
 const d=s.sideralDomain,b=P.SideralDomain.bounds(d);assert(P.Terrain.hit(d.x-P.SideralDomain.roomWidth/2,b.top+100,12));
});

test('Sideral: choque daña, rebota y al terminar restaura coordenadas',()=>{
 const {sim,P,s,p}=setup(),e={x:640,y:90,hp:100,max:100,r:14,speed:0,boss:false,hit:0,attackT:9};P.Attributes.init(e);s.enemies=[e];p.ultimate.charge=100;sim.tick(.04,[{ultimate:true},{}]);for(let i=0;i<112;i++)sim.tick(.04,[{},{}]);
 const d=s.sideralDomain,b=P.SideralDomain.bounds(d);e.x=b.right-e.r-20;e.sideralFear=.9;P.SideralDomain.boundary(e,d,.04);
 assert.equal(e.hp,92);assert.equal(e.domainEdgeHits,1);assert(e.charge.x<0);assert.equal(e._sideralReturnX,640);
 P.SideralDomain.end();assert.equal(s.sideralDomain,null);assert.equal(e.x,640);assert.equal(e._sideralReturnX,undefined);assert.equal(p.x,120);assert.equal(p.y,90);
});
