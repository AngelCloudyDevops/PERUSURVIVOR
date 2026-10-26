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
test('Tarjeta: composición compacta en móvil, título escalonado y efectos locales sin tocar simulación',()=>{
 const {P,R}=engine();for(const [w,h] of [[390,800],[844,390],[1280,720]]){const b=R.cardLayout(w,h);assert(b.w<w*.65);assert(b.h<=b.w*1.55+1e-8);assert(b.y+b.h<h);assert(b.py<b.h*.69);assert(b.birdHeight<=b.h*.5)}
 const a=R.cardEnvelope(.3),b=R.cardEnvelope(.5);assert(a.line1>a.line2);assert.equal(b.line1,1);assert.equal(b.line2,1);assert(b.burst>0);assert.equal(R.cardEnvelope(.9).burst,0);assert.equal(R.cardEnvelope(.5,true).burst,0);assert.equal(R.cardEnvelope(.5,true).kick,0);
 const text=[],state=JSON.stringify(P.state),noop=()=>{},c=new Proxy({fillText(word){text.push(word)}},{get:(o,k)=>o[k]||noop});R.card(c,1280,720,.65,false);assert(text.includes('GALLINAZO'));assert(text.includes('¡BAJO MIS'));assert(text.includes('ALAS!'));assert.equal(JSON.stringify(P.state),state);
});

test('Segunda fase: alas, cabeza y plumas continúan animadas con reloj de simulación',()=>{
 const {P,R}=engine(),e={phase:'approach',chaosForm:true,rigTime:0};
 const a=R.arenaMotion(e);P.Vulture.tickVisuals(e,.3);const b=R.arenaMotion(e);
 for(const k of ['near','far','head','ruffle'])assert.notEqual(a[k],b[k]);
 const still=R.arenaMotion(e,true);e.rigTime=10;assert.deepEqual(R.arenaMotion(e,true),still);
 const before=JSON.stringify(e);R.arenaMotion(e);assert.equal(JSON.stringify(e),before);
});

test('Plumaje fase dos: paleta morada conserva alfa, luces y pico dorado',()=>{
 const {R}=engine(),p=new Uint8ClampedArray([60,60,65,255,180,110,20,255,240,240,240,255,0,0,0,0]);const original=[...p];R.tintPlumage(p,1);assert(p[2]>p[0]&&p[0]>p[1]);assert.equal(p[3],255);assert.deepEqual([...p.slice(4)],original.slice(4));
 const base=new Uint8ClampedArray(original);R.tintPlumage(base,0);assert.deepEqual([...base],original);
});

test('Vuelo fase dos: despega al desplazarse, recoge patas y aterriza suavemente al parar',()=>{
 const {P,R}=engine(),e={x:100,y:100,phase:'approach',chaosForm:true};P.Vulture.tickVisuals(e,.1);
 for(let i=0;i<8;i++){e.x+=6;P.Vulture.tickVisuals(e,.05)}assert.equal(e.rigFlight,1);
 const a=R.flightPose(e);assert(a.lift>25);assert(a.tuck>.8);const near=R.arenaMotion(e).near;e.rigTime+=.25;assert(Math.abs(R.arenaMotion(e).near-near)>.2);
 const quiet=R.flightPose(e,true);assert.equal(quiet.near,0);assert.equal(quiet.bank,0);assert.equal(quiet.lift,32);
 P.Vulture.tickVisuals(e,.05);assert(e.rigFlight>0&&e.rigFlight<1);
 for(let i=0;i<10;i++)P.Vulture.tickVisuals(e,.05);assert.equal(e.rigFlight,0);assert.equal(R.flightPose(e).lift,0);
 const before=JSON.stringify(e);R.flightPose(e);assert.equal(JSON.stringify(e),before);
});
