const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function engine(){
 const e={x:0,y:0,r:62,hp:100,max:100,hit:0},P={state:{elapsed:0,player:{x:100,y:100},danger:[],encounter:{scene:{bounds:{left:-500,right:500,top:-400,bottom:400}}}},Audio:{play(){}},Terrain:{hit(){return false}},VultureImpact:{},VultureUltimate:{boss(){return e}},VultureStrike:{},VultureScene:{init(){},pending(){return false},bird(){}},Vulture:{reduced(){return false},tickVisuals(){},move(){},warn(q,a){q.original=a},draw(){},ground(){}},FX:{projectile(){}}};
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
