const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('Ulti Gallinazo: seis poses, aviso sin daño, tres abanicos, picada y uso único',()=>{
let fans=0,warnings=0,moves=0;const e={mapBoss:true,kind:'vulture',x:0,y:0,r:62,hp:300,max:1000,phase:'approach'};
const P={state:{player:{x:100,y:0},danger:[{glyph:'FEATHER'},{glyph:'OTHER'}],enemies:[e],encounter:{definition:{kind:'vulture'}}},Ambient:{},Audio:{play(){},fx(){}},Vulture:{init(){},move(){moves++},draw(){return true},reduced(){return false},tickVisuals(){},emit(){},feathers(){fans++},warn(b,a,t){warnings++;b.phase='vulture-warning';b.attack=a;b.windup=t}}};
vm.runInNewContext(fs.readFileSync('src/systems/vulture-ultimate.js','utf8'),{P});const u=P.VultureUltimate;u.ready=true;
P.Vulture.move(e,.01);assert.equal(e.phase,'vulture-ultimate');assert.equal(P.state.danger.length,1);assert.equal(moves,0);
for(let i=0;i<6;i++){e.ultimateTime=i/3;assert.equal(u.frame(e),i)}e.ultimateTime=0;
u.step(e,1.99);assert.equal(fans,0);u.step(e,.02);assert.equal(fans,1);u.step(e,.9);assert.equal(fans,2);u.step(e,.9);assert.equal(fans,3);u.step(e,.9);assert.equal(warnings,1);assert.equal(e.attack,'dive');assert.equal(e.windup,1.05);assert(!u.start(e));assert(u.start(e,true));
e.ultimateTime=2.35;assert(Math.abs(u.cameraScale()-1.08)<1e-8);P.Vulture.reduced=()=>true;assert.equal(u.cameraScale(),1);assert.equal(u.frame(e),5);assert.equal(u.boss(),e);e.hp=0;assert.equal(u.boss(),undefined);
});
