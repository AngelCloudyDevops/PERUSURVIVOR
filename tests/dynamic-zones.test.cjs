'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{Simulation}=require('../backend/simulation.cjs');

function scene(map='campo',characters=[0]){
 const sim=new Simulation(map,characters),P=sim.P,s=P.state;
 P.Systems.spawn=()=>{};P.MapEvents.event=null;s.mode='play';s.mapTime=40;s.elapsed=40;P.DynamicZones.reset();s.mapTime=40;s.elapsed=40;
 return{sim,P,s,Z:P.DynamicZones,p:sim.players[0]}
}

test('Zonas dinámicas: aparecen lejos del jugador, sobre terreno libre y con límite acotado',()=>{
 const {P,Z,p}=scene();P.Terrain.hit=()=>null;const zone=Z.spawn('heal',p);
 assert(zone);assert.equal(zone.kind,'heal');assert(Math.hypot(zone.x-p.x,zone.y-p.y)>170);assert.equal(Z.zones().length,1);assert.equal(Z.cap(),4);
 for(let i=0;i<8;i++)Z.spawn(null,p);assert(Z.zones().length<=4,'Nunca supera cuatro zonas en escritorio');
 assert.equal(Z.active(zone,zone.warningUntil-.01),false);assert.equal(Z.active(zone,zone.warningUntil),true);assert.equal(zone.expiresAt-zone.warningUntil,10);
});

test('Zonas dinámicas: curación, veneno y debilidad afectan a jugadores y enemigos',()=>{
 const {P,s,Z,p}=scene(),enemy=P.Attributes.init({x:p.x,y:p.y,hp:100,max:100,r:13,speed:70,design:0});s.enemies=[enemy];
 p.hp=50;p.maxHp=100;Z.affect({kind:'heal',x:p.x,y:p.y,r:80});assert(p.hp>50);assert.equal(enemy.hp,100,'La curación respeta el máximo');
 enemy.hp=80;Z.affect({kind:'heal',x:p.x,y:p.y,r:80});assert(enemy.hp>80);
 const playerHp=p.hp,enemyHp=enemy.hp;Z.affect({kind:'poison',x:p.x,y:p.y,r:80});assert(p.hp<playerHp);assert(enemy.hp<enemyHp);assert(p.poisonVisualUntil>s.elapsed);
 Z.affect({kind:'slow',x:p.x,y:p.y,r:80});assert.equal(Z.speed(p),.75);assert.equal(P.DomainAftermath.slow(enemy),.75);
 const source=P.Attributes.source(p,'physical'),exposed=P.Attributes.outgoing(enemy,20,source);enemy.dynamicZoneDefenseUntil=0;const base=P.Attributes.outgoing(enemy,20,source);assert(Math.abs(exposed-base*1.12)<1e-8,'La exposición aumenta 12 % ambos canales');
});

test('Zonas dinámicas: jefes resisten control, los nombres cambian por mapa y el minimapa es ligero',()=>{
 for(const [map,names] of Object.entries({campo:['Emoliente reparador','Barro contaminado','Césped húmedo'],plaza:['Agua de la pileta','Aceite derramado','Adoquines mojados'],machu:['Hierbas medicinales','Niebla tóxica','Niebla debilitante']})){
  const {P,Z,p}=scene(map),boss={x:p.x,y:p.y,hp:500,max:500,r:30,boss:true};P.state.enemies=[boss];Z.affect({kind:'slow',x:p.x,y:p.y,r:100});assert.equal(P.DomainAftermath.slow(boss),.9);assert.deepEqual(['heal','poison','slow'].map(kind=>Z.label(kind)),names);
 }
 const {Z,p}=scene(),calls=[];Z.zones().push({id:'test',kind:'heal',x:p.x+10,y:p.y+10,r:78,warningUntil:0,expiresAt:99});const ctx=new Proxy({fillRect(...args){calls.push(args)}},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)});Z.minimap(ctx,p,0,0,160,100,800);assert.equal(calls.length,2,'Cada zona usa solo dos rectángulos en el minimapa');
});

test('Zonas dinámicas cooperativas: autoridad, snapshot y movimiento comparten el mismo estado',()=>{
 const {sim,P,s,Z}=scene('plaza',[0,6]),[a,b]=sim.players;P.Terrain.hit=()=>null;P.Systems.spawn=()=>{};
 const zone={id:'coop',kind:'slow',x:a.x,y:a.y,r:100,warningUntil:0,expiresAt:99,tickIn:0};s.dynamicZones=[zone];Z.affect(zone);const before=a.x;sim.tick(.1,[{x:1,y:0},{}]);assert(Math.abs((a.x-before)-a.speed*.75*.1)<.01,'El servidor aplica 25 % de lentitud');
 const snapshot=JSON.parse(JSON.stringify(sim.snapshot()));assert.equal(snapshot.dynamicZones[0].id,'coop');assert.equal(snapshot.dynamicZones[0].kind,'slow');assert.doesNotThrow(()=>JSON.stringify(snapshot));
 b.hp=0;a.hp=1;Z.poison(a,.02);assert.equal(sim.result,null,'El daño ambiental no finaliza una sala mientras quede lógica cooperativa pendiente');
});
