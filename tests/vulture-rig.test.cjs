const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function engine(){
 const e={phase:'approach',hp:100,x:0,y:0},P={state:{mode:'play'},Core:{clear(){}},VulturePhase2:{entryDuration:1.3},VultureUltimate:{boss:()=>e,start(){e.phase='vulture-ultimate';e.ultimateTime=0;return true},introTick(dt){e.ultimateTime+=dt;return true},overlay(){}},VultureScene:{init(){},pending(){return false},geometry(){},eye(){},bird(){}},Vulture:{move(){},draw(){},tickVisuals(){}}};vm.runInNewContext(fs.readFileSync('src/rendering/vulture-rig.js','utf8'),{P});return {P,e,R:P.VultureRig};
}
test('Tarjeta activa: no bloquea la simulación y termina antes del plano del ojo',()=>{
 const {P,e}=engine(),u=P.VultureUltimate;u.start(e);assert.equal(e.phase,'vulture-activation');assert.equal(u.introTick(.3),false);assert.equal(e.ultimateTime,0);assert.equal(e.ultimateEntryTime,.3);P.state.mode='pause';assert.equal(u.introTick(.3),false);assert.equal(e.ultimateEntryTime,.3);P.state.mode='play';assert.equal(u.introTick(1),true);assert.equal(e.phase,'vulture-ultimate');assert.equal(e.ultimateTime,0);u.introTick(.2);assert.equal(e.ultimateTime,.2);
});
test('Articulaciones: alas, mandíbula y primarias se mueven sin fundir ni trasladar el torso',()=>{
 const {R}=engine();let alphaWrites=0;const noop=()=>{},c=new Proxy({},{get:()=>noop,set(o,k,v){if(k==='globalAlpha')alphaWrites++;o[k]=v;return true}});R.ready=true;
 const bodies=[],parts=[];R.part=(c,id,x,y,w,px,py,a=0,sx=1,sy=1)=>{parts.push({id,a,sy});if(id===0)bodies.push([x,y,w,px,py])};
 for(let t=0;t<=4;t+=.04)R.draw(c,100,200,300,t,false,false);
 assert(bodies.every(b=>JSON.stringify(b)===JSON.stringify(bodies[0])));assert.equal(alphaWrites,0);assert(parts.some(p=>p.id===6&&p.sy<.9));assert(parts.some(p=>p.id===6&&p.sy>.99));assert(R.motion(.7,true).jaw>.3&&R.motion(.7,true).jaw<.4);assert(R.motion(2.6).near-R.motion(1).near>1);assert.equal(R.motion(1,true).phase,0);assert.equal(R.motion(3).phase,1);
 for(let t=0;t<4;t+=.003){const a=R.motion(t),b=R.motion(t+.001);for(const k of Object.keys(a))assert(Math.abs(a[k]-b[k])<.015)}
 assert.equal(JSON.stringify(R.motion(0,true,true)),JSON.stringify(R.motion(1,true,true)));assert.equal(R.title,'¡BAJO MIS ALAS!');
});
test('Continuidad de silueta: arena conserva el rig y la pose final durante la gracia',()=>{
 const {R}=engine();const end=R.motion(4),grace=R.arenaMotion({phase:'vulture-ultimate',ultimateTime:4,ultimateGrace:.7});assert.equal(JSON.stringify(grace),JSON.stringify(end));assert(end.far-end.near>.7);const idle=R.arenaMotion({phase:'approach'});assert.equal(idle.phase,1);const charge=R.arenaMotion({phase:'vulture-chaos-charge',chaosTime:1});assert(charge.near>idle.near);assert(charge.jaw>0);assert.equal(R.arenaMotion({phase:'vulture-chaos-charge',chaosTime:1},true).jaw,0);
});
