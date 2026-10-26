const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function engine(){
 const e={x:0,y:0,r:62,hp:100,max:100,hit:0},P={state:{mode:'play',elapsed:0,player:{x:100,y:100},danger:[],encounter:{scene:{bounds:{left:-500,right:500,top:-400,bottom:400}}}},Audio:{play(){}},Terrain:{hit(){return false}},VultureImpact:{},VultureUltimate:{boss(){return e},start(){e.phase='vulture-ultimate';e.ultimateTime=0;return true},introTick(dt){e.ultimateTime+=dt;return true},overlay(){}},VultureStrike:{},VultureScene:{init(){},pending(){return false},bird(){}},Vulture:{reduced(){return false},tickVisuals(){},move(){},warn(q,a){q.original=a},draw(){},ground(){}},FX:{projectile(){}}};
 vm.runInNewContext(fs.readFileSync('src/systems/vulture-phase2.js','utf8'),{P});return {P,e,F:P.VulturePhase2};
}
test('Fase II: ataques nuevos solo tras transformarse; círculos fijados y 1,1 s de aviso',()=>{
 const {P,e,F}=engine();P.Vulture.warn(e,'summon');assert.equal(e.original,'summon');e.chaosForm=true;P.Vulture.warn(e,'summon');assert.equal(e.chaosAttack,'storm');assert.equal(e.chaosTargets.length,3);const q={...e.chaosTargets[0]};P.state.player.x=300;
 F.step(e,1.09);assert.equal(P.state.danger.length,0);F.step(e,.02);assert.equal(P.state.danger.length,1);assert.equal(P.state.danger[0].x,q.x);assert.equal(P.state.danger[0].glyph,'CHAOS_LIGHTNING');assert.equal(P.state.danger[0].kind,'stomp');assert.equal(P.state.danger[0].radius,46);
 F.step(e,.4);assert.equal(P.state.danger.length,3);F.step(e,1);assert.equal(e.phase,'approach');assert.equal(e.chaosTargets.length,0);assert.equal(e.chaosForm,true);
});
test('Plumas serpiente: dos abanicos bloqueables, cupo global y picada original conservada',()=>{
 const {P,e,F}=engine();e.chaosForm=true;P.Vulture.warn(e,'dive');assert.equal(e.original,'dive');P.Vulture.warn(e,'feathers');assert.equal(e.chaosAttack,'rake');F.step(e,1.1);assert.equal(P.state.danger.length,9);assert(P.state.danger.every(q=>q.kind==='zigzag'&&q.chaosFeather&&q.damage===14));F.step(e,.43);assert.equal(P.state.danger.length,18);P.state.danger=Array.from({length:69},()=>({}));F.fire(e,1);assert.equal(P.state.danger.length,70);
});
test('Tormenta respeta coberturas y bordes; sin objetivos cubiertos ni daño invisible',()=>{
 const {P,e,F}=engine();P.Terrain.hit=()=>true;F.plan(e,'storm');assert.equal(e.chaosTargets.length,0);F.step(e,1.5);assert.equal(P.state.danger.length,0);P.Terrain.hit=()=>false;P.state.player={x:999,y:999};F.plan(e,'storm');assert(e.chaosTargets.every(q=>q.x<=445&&q.y<=345));
});
test('Entrada separada: la tarjeta base termina antes de que avance el ojo; pausa congela ambos relojes',()=>{
 const {P,e,F}=engine(),u=P.VultureUltimate;assert(u.start(e));assert(F.entering(e));u.introTick(.4);assert.equal(e.ultimateEntryTime,.4);assert.equal(e.ultimateTime,0);P.state.mode='pause';assert.equal(u.introTick(.4),false);assert.equal(e.ultimateEntryTime,.4);P.state.mode='play';u.introTick(1);assert.equal(F.entering(e),false);assert.equal(e.ultimateTime,0);u.introTick(.1);assert.equal(e.ultimateTime,.1);
});
test('Plumas continuas: cuello y pies fijos, revelado gradual y movimiento reducido estable',()=>{
 const {F}=engine();let last=0;
 for(let t=0;t<4;t+=.003){const m=F.transformation(t);assert(m.reveal>=last);assert(m.reveal-last<.006);last=m.reveal;const motion=F.featherMotion(t),next=F.featherMotion(t+.001);for(const [x,y] of [[.85,.4],[.4,1]]){const q=F.warp(x,y,motion);assert.equal(q.x,x);assert.equal(q.y,y)}const p=F.warp(.2,.3,motion),q=F.warp(.2,.3,next);assert(Math.hypot(p.x-q.x,p.y-q.y)<.002)}
 assert.equal(F.transformation(1.8).reveal,0);assert.equal(F.transformation(3).reveal,1);assert.equal(JSON.stringify(F.featherMotion(0,true)),JSON.stringify(F.featherMotion(1,true)));
});

test('Electricidad: trazos pequeños y finos, sin siete columnas gruesas delante del jefe',()=>{
 const {F}=engine(),widths=[],points=[];let width=0;const c=new Proxy({globalAlpha:1,stroke(){widths.push(width)},lineTo(x,y){points.push([x,y])}},{get:(o,k)=>o[k]||(()=>{}),set(o,k,v){if(k==='lineWidth')width=v;o[k]=v;return true}});F.electricity(c,0,0,90,.4,.55,false);assert(widths.length>0&&widths.length<=8);assert(Math.max(...widths)<=3);assert(points.every(([x,y])=>Math.abs(x)<150&&Math.abs(y)<90));
});
