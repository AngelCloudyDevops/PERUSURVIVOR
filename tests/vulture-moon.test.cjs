const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function engine(){const e={x:0,y:0,r:62,hp:100},P={state:{mode:'play',elapsed:10,player:{x:100,y:120},danger:[],encounter:{scene:{bounds:{left:-600,right:600,top:-400,bottom:400}}}},Core:{clear(){}},Audio:{play(){},fx(){}},Terrain:{hit(){return false}},VultureRig:{arenaMotion(){return {near:.7,far:1.5}}},VulturePhase2:{entryDuration:1.3},VultureScene:{init(){},pending(){return false}},VultureUltimate:{duration:4,boss:()=>e,start(){e.phase='vulture-activation';e.ultimateEntryTime=0;return true},introTick(){return false},overlay(){},introSounds(){}},VultureImpact:{impactAge(){return 99},cameraTarget:p=>p,mark(q){q.impactDone=true;q.chaosForm=true;P.state.encounter.gallinazoScar={x:q.x,y:q.y,time:P.state.elapsed}}},Vulture:{move(){},draw(){},ground(){},effects(){},tickVisuals(){}},Entities:{hurt(q,n){q.hp-=n}},Combat:{inArc(){return true},segmentHit(){return true},onScreen(){return true}}};vm.runInNewContext(fs.readFileSync('src/systems/vulture-moon.js','utf8'),{P});return{P,e,M:P.VultureMoon,u:P.VultureUltimate}}
test('Secuencia: tarjeta y despegue activos, cielo congelado, caída avisada y único impacto',()=>{
 const {P,e,M,u}=engine();u.start(e);assert.equal(u.introTick(1.3),false);assert.equal(e.phase,'vulture-takeoff');assert.equal(u.introTick(.4),false);assert(e.moonAirborne);assert.equal(u.introTick(.85),true);assert.equal(e.phase,'vulture-moon');assert(!e.impactDone);assert.equal(u.introTick(4),true);assert.equal(e.phase,'vulture-landing');const target={...e.moonTarget};P.state.player.x=450;assert.equal(u.introTick(1.19),false);assert.equal(P.state.danger.length,0);assert.equal(e.x,target.x);assert.equal(e.y,target.y);u.introTick(.02);assert.equal(e.phase,'vulture-ultimate');assert.equal(e.ultimateGrace,.7);assert.equal(e.ultimateWave,0);assert.equal(P.state.danger.length,1);assert.equal(P.state.danger[0].damage,20);assert.equal(P.state.danger[0].radius,110);assert(e.chaosForm);M.impact(e);assert.equal(P.state.danger.length,1);assert(P.state.encounter.gallinazoScar.moon);assert.equal(P.VultureImpact.impactAge(e),0);P.state.elapsed+=.3;assert(Math.abs(P.VultureImpact.impactAge(e)-.3)<1e-8);
});
test('Pausa y vuelo: reloj detenido, sin contacto ni impactos sobre el fantasma del suelo',()=>{
 const {P,e,M,u}=engine();u.start(e);u.introTick(1.3);u.introTick(.5);const time=e.moonStageTime;P.state.mode='pause';u.introTick(.5);assert.equal(e.moonStageTime,time);P.Entities.hurt(e,10);assert.equal(e.hp,100);assert.equal(P.Combat.segmentHit({},e),false);assert.equal(P.Combat.inArc({},e),false);assert.equal(P.Combat.onScreen(e),false);assert(M.noContact(e));e.moonAirborne=false;e.phase='approach';P.Entities.hurt(e,10);assert.equal(e.hp,90);assert.equal(P.Combat.onScreen(e),true);assert.equal(M.noContact(e),false);
});
test('Objetivo seguro: dentro de límites y fuera de obstáculos; descenso y recuperación enlazados',()=>{
 const {P,e,M}=engine();P.state.player={x:999,y:999};const q=M.target(e);assert(q.x<=475&&q.y<=275);P.Terrain.hit=()=>true;assert.equal(JSON.stringify(M.target(e)),JSON.stringify({x:e.x,y:e.y}));assert.equal(M.lift(0),0);assert.equal(M.lift(M.takeoffDuration),700);const end=M.landingPose(M.landingDuration);assert(Math.abs(end.x)+Math.abs(end.y)+Math.abs(end.angle)<1e-8);for(let t=.59;t<1.2;t+=.01)assert(M.landingPose(t+.001).y>=M.landingPose(t).y);assert.equal(M.landingPose(1,true).angle,0);
});

test('Cámara del despegue: encuadre conjunto, jugador seguro y continuidad entre tarjeta y subida',()=>{
 const {P,e,M,u}=engine();P.Vulture.reduced=()=>false;P.BossArt={camera:p=>({x:p.x*.9,y:p.y-70})};u.start(e);
 for(const [w,h,base] of [[1280,720,1.5],[390,844,1.05],[844,390,1.5]]){
  for(const p of [{x:150,y:100},{x:610,y:310},{x:-610,y:-310}]){
   e.phase='vulture-activation';e.ultimateEntryTime=.55;const initial=M.cameraFrame(p,w,h,base);assert.equal(initial.zoom,base);assert.equal(initial.x,p.x*.9);
   e.ultimateEntryTime=1.3;const end=M.cameraFrame(p,w,h,base);e.phase='vulture-takeoff';e.moonStageTime=0;const start=M.cameraFrame(p,w,h,base);assert.deepEqual(start,end);
   let prev=start;for(let t=0;t<=1.25;t+=.01){e.moonStageTime=t;const f=M.cameraFrame(p,w,h,base);assert(f.zoom>0&&Number.isFinite(f.x)&&Number.isFinite(f.y));assert(Math.abs((p.x-f.x)*f.zoom)<=w/2-48+1e-7);assert(Math.abs((p.y-f.y)*f.zoom)<=h/2-80+1e-7);assert(Math.abs(f.zoom-prev.zoom)<.05);prev=f}
   e.moonStageTime=1.25;const final=M.cameraFrame(p,w,h,base);assert(final.y<start.y);assert(final.zoom<=start.zoom);
  }
 }
 P.Vulture.reduced=()=>true;const quiet=M.cameraFrame(P.state.player,1280,720,1.5);assert.equal(quiet.zoom,1.5);assert.equal(quiet.y,P.state.player.y-70);e.phase='approach';assert.equal(M.cameraFrame(P.state.player,1280,720,1.5),null);
});

test('Caída: cámara sigue al jefe, conserva jugador y enlaza el impacto sin salto de zoom',()=>{
 const {P,e,M,u}=engine();P.Vulture.reduced=()=>false;P.BossArt={camera:p=>({x:p.x*.9,y:p.y-70})};P.VultureUltimate.cameraScale=()=>e.phase==='vulture-ultimate'?1.06:1;u.start(e);M.beginLanding(e);const target={...e.moonTarget};
 for(const [w,h,base] of [[1280,720,1.5],[390,844,1.05],[844,390,1.5]]){
  e.phase='vulture-landing';let first,last;for(let t=0;t<=1.2;t+=.01){e.moonStageTime=t;const f=M.cameraFrame(P.state.player,w,h,base);first||=f;last=f;assert(Math.abs((P.state.player.x-f.x)*f.zoom)<=w/2-48+1e-7);assert(Math.abs((P.state.player.y-f.y)*f.zoom)<=h/2-80+1e-7)}assert(last.y>first.y);
  e.moonStageTime=1.2;const before=M.cameraFrame(P.state.player,w,h,base);e.phase='vulture-ultimate';e.moonLanded=true;P.state.encounter.gallinazoScar={...target,moon:true,time:P.state.elapsed};const after=M.cameraFrame(P.state.player,w,h,base*1.06);for(const k of ['x','y','zoom'])assert(Math.abs(before[k]-after[k])<1e-8);
  e.moonLanded=false;delete P.state.encounter.gallinazoScar;
 }
 P.state.player.x+=200;assert.deepEqual({...e.moonTarget},target);
});

test('Impacto: sacudida acotada, pausa estable, movimiento reducido y regreso completo de cámara',()=>{
 const {P,e,M,u}=engine();P.Vulture.reduced=()=>false;P.BossArt={camera:p=>({x:p.x,y:p.y})};u.start(e);M.impact(e);const initial=M.impactShake();assert(initial.y>0&&initial.y<=7);P.state.elapsed+=.12;const shake=M.impactShake();assert(Math.abs(shake.x)<=8&&Math.abs(shake.y)<=7);const before=JSON.stringify(shake);P.state.mode='pause';u.introTick(.2);assert.equal(JSON.stringify(M.impactShake()),before);P.Vulture.reduced=()=>true;assert.equal(JSON.stringify(M.impactShake()),JSON.stringify({x:0,y:0}));P.Vulture.reduced=()=>false;P.state.elapsed+=1;assert.equal(JSON.stringify(M.impactShake()),JSON.stringify({x:0,y:0}));assert.equal(M.cameraFrame(P.state.player,1280,720,1.5),null);
});

test('Noche lunar: oscurece durante tarjeta/despegue y conserva la misma luz al regresar',()=>{
 const {e,M}=engine();assert.equal(M.nightStrength(e),0);e.moonSequence=true;e.phase='vulture-activation';e.ultimateEntryTime=0;assert.equal(M.nightStrength(e),0);e.ultimateEntryTime=1.3;assert.equal(M.nightStrength(e),.75);e.phase='vulture-takeoff';e.moonStageTime=0;assert.equal(M.nightStrength(e),.75);e.moonStageTime=.65;assert.equal(M.nightStrength(e),1);for(const phase of ['vulture-moon','vulture-landing','vulture-ultimate','approach']){e.phase=phase;assert.equal(M.nightStrength(e),1)}
});
