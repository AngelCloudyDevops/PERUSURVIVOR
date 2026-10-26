const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function engine(){const e={x:0,y:0,r:62,hp:100},P={state:{mode:'play',elapsed:10,player:{x:100,y:120},danger:[],encounter:{scene:{bounds:{left:-600,right:600,top:-400,bottom:400}}}},Core:{clear(){}},Audio:{play(){},fx(){}},Terrain:{hit(){return false}},VultureRig:{arenaMotion(){return {near:.7,far:1.5}}},VulturePhase2:{entryDuration:1.3},VultureScene:{init(){},pending(){return false}},VultureUltimate:{duration:4,boss:()=>e,start(){e.phase='vulture-activation';e.ultimateEntryTime=0;return true},introTick(){return false},overlay(){},introSounds(){}},VultureImpact:{impactAge(){return 99},cameraTarget:p=>p,mark(q){q.impactDone=true;q.chaosForm=true;P.state.encounter.gallinazoScar={x:q.x,y:q.y,time:P.state.elapsed}}},Vulture:{move(){},draw(){},ground(){},effects(){},tickVisuals(){}},Entities:{hurt(q,n){q.hp-=n}},Combat:{inArc(){return true},segmentHit(){return true},onScreen(){return true}}};vm.runInNewContext(fs.readFileSync('src/systems/vulture-moon.js','utf8'),{P});return{P,e,M:P.VultureMoon,u:P.VultureUltimate}}

test('Panorama: una sola capa ajustada a pantalla, filtrado aislado y azotea intacta',()=>{
 const {P,M}=engine(),image={width:1536,height:1024},calls=[],stack=[];M.panorama=image;M.panoramaReady=true;M.panoramaHorizon=Infinity;M.roofLayers=()=>false;M.atmosphere=()=>{};const c={imageSmoothingEnabled:false,imageSmoothingQuality:'low',globalAlpha:1,save(){stack.push([this.imageSmoothingEnabled,this.imageSmoothingQuality,this.globalAlpha])},restore(){[this.imageSmoothingEnabled,this.imageSmoothingQuality,this.globalAlpha]=stack.pop()},beginPath(){},rect(){},clip(){},fillRect(){},drawImage(...args){calls.push({args,smoothing:this.imageSmoothingEnabled})}};
 P.VultureUltimate.boss=()=>({moonSequence:true,phase:'vulture-takeoff',moonStageTime:.65});
 for(const [w,h] of [[1280,720],[1920,1080],[390,844],[844,390]]){calls.length=0;const before=JSON.stringify(P.state);M.background(c,140,-70,w,h);assert.equal(calls.length,1,'No superponer una copia gigante');const [asset,sx,sy,sw,sh,x,y,dw,dh]=calls[0].args;assert.equal(asset,image);assert.equal(sx,0);assert.equal(sy,0);assert.equal(sw,image.width);assert.equal(sh,image.height*M.panoramaCrop);assert(dw>=w&&dh>=h);assert(x<=140-w/2&&x+dw>=140+w/2);assert(y<=-70-h/2+1e-7&&y+dh>=-70+h/2-1e-7);assert(dw<=Math.max(w,h/M.panoramaCrop*1.5)*1.31);assert(calls[0].smoothing);assert.equal(c.imageSmoothingEnabled,false);assert.equal(JSON.stringify(P.state),before)}
 calls.length=0;M.roofDay={};M.roofArenaDay={};M.roofNight={};M.roofLayers=()=>true;M.nightStrength=()=>.5;M.background(c,0,0,1280,720);assert.equal(calls.length,4);for(const call of calls.slice(1)){assert.deepEqual(call.args.slice(1),[-960,-640,1920,1280]);assert.equal(call.smoothing,false)}
 const crypto=require('node:crypto'),audit=JSON.parse(fs.readFileSync('docs/vulture-panorama-audit.json','utf8'));assert.equal(crypto.createHash('sha256').update(fs.readFileSync(audit.runtime)).digest('hex'),audit.runtimeSha256);assert.equal(audit.width,1536);assert.equal(audit.height,1024);assert(require('../scripts/build.cjs').archivedAsset('assets/arenas/gallinazo-lima-night-v2.webp'));assert(require('../scripts/build.cjs').archivedAsset('assets/arenas/gallinazo-lima-night-v1.webp'));
});
test('Fondo lunar: elimina pronto el horizonte diurno y conserva parallax cubriendo la cámara',()=>{
 const {M}=engine(),image={width:1536,height:1024};for(const q of [0,.15,.55,.75,1]){const mix=M.backdropMix(q);assert(mix.panorama>=0&&mix.panorama<=1);assert(mix.exterior>=0&&mix.exterior<=1);assert(Math.abs(mix.day+mix.night-1)<1e-9)}assert.equal(M.backdropMix(0).panorama,0);assert.equal(M.backdropMix(.75).panorama,1);assert.equal(M.backdropMix(.55).exterior,0);
 const a=M.panoramaFrame(0,0,1280,720,image),b=M.panoramaFrame(260,-220,1280,720,image);assert(b.x-a.x<260,'El panorama se mueve menos que la azotea');assert(b.y-a.y>-220,'El cielo acompaña la subida con parallax');for(const [f,cx,cy] of [[a,0,0],[b,260,-220]]){assert(f.x<=cx-640&&f.x+f.w>=cx+640);assert(f.y<=cy-360&&f.y+f.h>=cy+360)}
});
test('Profundidad del fondo: zoom amortiguado, nubes activas y cámara de subida más lenta',()=>{
 const {P,e,M,u}=engine(),image={width:1536,height:1024};P.Terrain.zoom=1.5;u.start(e);assert.equal(e.moonBackdropZoom,1.5);e.phase='vulture-takeoff';e.moonStageTime=.7;const near=M.panoramaFrame(0,-100,1280/1.5,720/1.5,image,e);P.Terrain.zoom=1;const far=M.panoramaFrame(0,-100,1280,720,image,e);assert(far.w/1280<near.w/(1280/1.5),'El paisaje responde menos que el suelo al zoom');assert(M.cameraLift(.7)<M.lift(.7));assert.equal(M.cameraLift(M.takeoffDuration),M.lift(M.takeoffDuration));
 const calls=[],c={save(){},restore(){},beginPath(){},rect(){},clip(){},drawImage(...a){calls.push(a)}};P.Vulture.reduced=()=>false;M.atmosphere(c,image,{x:0,y:-900,w:1280,h:720},e);assert.equal(calls.length,1);e.phase='vulture-activation';e.ultimateEntryTime=0;calls.length=0;M.atmosphere(c,image,{x:0,y:-900,w:1280,h:720},e);assert.equal(calls.length,0);
});
test('Horizonte coherente: el panorama excluye las azoteas cercanas que quedarían debajo del piso',()=>{
 const {M}=engine(),image={width:1536,height:1024},calls=[],clips=[],c={save(){},restore(){},beginPath(){},rect(...a){clips.push(a)},clip(){},drawImage(...a){calls.push(a)}};M.drawPanorama(c,image,{x:10,y:-800,w:900,h:900});assert.equal(calls.length,1);const [asset,sx,sy,sw,sh,dx,dy,dw,dh]=calls[0];assert.equal(asset,image);assert.deepEqual([sx,sy,sw],[0,0,image.width]);assert.equal(sh,image.height*.68);assert(sh<image.height*.7,'No incluir edificios y techos del primer plano');assert.deepEqual([dx,dy,dw,dh],[10,-800,900,900]);assert.equal(clips[0][1]+clips[0][3],M.panoramaHorizon,'El fondo termina sobre el parapeto, nunca bajo el piso');calls.length=0;M.drawPanorama(c,image,{x:0,y:-200,w:900,h:500});assert.equal(calls.length,0,'No dibujar ciudad si todo el encuadre queda bajo el horizonte físico');
});
test('Azotea nocturna coherente: reemplaza el panorama y limita el zoom a sus bordes físicos',()=>{
 const {P,e,M}=engine(),calls=[],stack=[];M.nightRoofReady=true;M.roofDay={day:true};M.roofNight={night:true};M.roofLayers=()=>true;M.nightStrength=()=>.8;const c={imageSmoothingEnabled:true,globalAlpha:1,save(){stack.push([this.imageSmoothingEnabled,this.globalAlpha])},restore(){[this.imageSmoothingEnabled,this.globalAlpha]=stack.pop()},fillRect(){},drawImage(...a){calls.push(a)}};M.background(c,0,0,1280,720);assert.equal(calls.length,2);assert.equal(calls[0][0],M.roofDay);assert.equal(calls[1][0],M.roofNight);assert.deepEqual(calls[0].slice(1),[-960,-640,1920,1280]);
 P.Vulture.reduced=()=>false;P.BossArt={camera:p=>p};e.moonSequence=true;e.phase='vulture-takeoff';e.moonStageTime=1.25;const frame=M.cameraFrame(P.state.player,1280,720,1.5);assert(frame.zoom>=1280/1920);const mobile=M.cameraFrame(P.state.player,390,844,1.05);assert(mobile.zoom>=844/1280);
});
test('Extensión superior: usa solo cielo lunar fuera de la lámina de azotea',()=>{
 const {M}=engine(),sky={width:1280,height:720},calls=[],c={drawImage(...a){calls.push(a)}};M.sky=sky;M.ready=true;M.drawSky(c,120,-300,960,540);assert.equal(calls.length,1);assert.equal(calls[0][0],sky);const [,x,y,w,h]=calls[0];assert(w>=960&&h>=540);assert(x<=120-480&&x+w>=120+480);assert(y<=-300-270&&y+h>=-300+270);
});
test('Secuencia: tarjeta y despegue activos, cielo congelado, caída avisada y único impacto',()=>{
 const {P,e,M,u}=engine();u.start(e);assert.equal(u.introTick(1.3),false);assert.equal(e.phase,'vulture-takeoff');assert.equal(u.introTick(.4),false);assert(e.moonAirborne);assert.equal(u.introTick(.85),true);assert.equal(e.phase,'vulture-moon');assert(!e.impactDone);assert.equal(u.introTick(4),true);assert.equal(e.phase,'vulture-landing');const target={...e.moonTarget};P.state.player.x=450;assert.equal(u.introTick(1.19),false);assert.equal(P.state.danger.length,0);assert.equal(e.x,target.x);assert.equal(e.y,target.y);u.introTick(.02);assert.equal(e.phase,'vulture-ultimate');assert.equal(e.ultimateGrace,.7);assert.equal(e.ultimateWave,0);assert.equal(P.state.danger.length,1);assert.equal(P.state.danger[0].damage,20);assert.equal(P.state.danger[0].radius,110);assert(e.chaosForm);M.impact(e);assert.equal(P.state.danger.length,1);assert(P.state.encounter.gallinazoScar.moon);assert.equal(P.VultureImpact.impactAge(e),0);P.state.elapsed+=.3;assert(Math.abs(P.VultureImpact.impactAge(e)-.3)<1e-8);
});
test('Pausa y vuelo: reloj detenido, sin contacto ni impactos sobre el fantasma del suelo',()=>{
 const {P,e,M,u}=engine();u.start(e);u.introTick(1.3);u.introTick(.5);const time=e.moonStageTime;P.state.mode='pause';u.introTick(.5);assert.equal(e.moonStageTime,time);P.Entities.hurt(e,10);assert.equal(e.hp,100);assert.equal(P.Combat.segmentHit({},e),false);assert.equal(P.Combat.inArc({},e),false);assert.equal(P.Combat.onScreen(e),false);assert(M.noContact(e));e.moonAirborne=false;e.phase='approach';P.Entities.hurt(e,10);assert.equal(e.hp,90);assert.equal(P.Combat.onScreen(e),true);assert.equal(M.noContact(e),false);
});
test('Objetivo seguro: dentro de límites y fuera de obstáculos; descenso y recuperación enlazados',()=>{
 const {P,e,M}=engine();P.state.player={x:999,y:999};const q=M.target(e);assert(q.x<=475&&q.y<=275);P.Terrain.hit=()=>true;assert.equal(JSON.stringify(M.target(e)),JSON.stringify({x:e.x,y:e.y}));assert.equal(M.lift(0),0);assert.equal(M.lift(M.takeoffDuration),700);const end=M.landingPose(M.landingDuration);assert(Math.abs(end.x)+Math.abs(end.y)+Math.abs(end.angle)<1e-8);for(let t=.59;t<1.2;t+=.01)assert(M.landingPose(t+.001).y>=M.landingPose(t).y);assert.equal(M.landingPose(1,true).angle,0);
});

test('Arena: cámara reserva HUD y encuadra jugador y Gallinazo reducido sin recortar alas',()=>{
 const {P,e,M}=engine();P.state.encounter.definition={kind:'vulture'};P.VultureRig.arenaHeight=221;P.Vulture.reduced=()=>false;M.nightRoofReady=true;e.phase='approach';e.chaosForm=true;e.x=420;e.y=-250;
 for(const [w,h,base] of [[1280,720,1.5],[844,390,1.5],[390,844,1.05]]){const f=M.cameraFrame(P.state.player,w,h,base),z=f.zoom,root=e.y+e.r*.5,top=(root-221*1.08-f.y)*z+h/2,left=(e.x-221*1.08-f.x)*z+w/2,right=(e.x+221*1.08-f.x)*z+w/2,px=(P.state.player.x-f.x)*z+w/2,py=(P.state.player.y-f.y)*z+h/2;assert(top>=-6);assert(left>=-6);assert(right<=w+6);assert(px>=-1&&px<=w+1);assert(py>=70&&py<=h-45)}
 e.moonSequence=true;e.phase='vulture-activation';assert.equal(P.Vulture.draw({},e),true,'La arena no dibuja una segunda copia detrás de la tarjeta');
});

test('Cámara del despegue: encuadre conjunto, jugador seguro y continuidad entre tarjeta y subida',()=>{
 const {P,e,M,u}=engine();P.Vulture.reduced=()=>false;P.BossArt={camera:p=>({x:p.x*.9,y:p.y-70})};u.start(e);
 for(const [w,h,base] of [[1280,720,1.5],[390,844,1.05],[844,390,1.5]]){
  for(const p of [{x:150,y:100},{x:610,y:310},{x:-610,y:-310}]){
   e.phase='vulture-activation';e.ultimateEntryTime=.35;const initial=M.cameraFrame(p,w,h,base);assert.equal(initial.zoom,base);assert.equal(initial.x,p.x*.9);
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

test('Flujo lunar: conserva XP y aplaza la mejora automática hasta acabar el aterrizaje',()=>{
 const {e,M}=engine();e.moonSequence=true;for(const phase of ['vulture-activation','vulture-takeoff','vulture-moon','vulture-landing']){e.phase=phase;assert(M.blocksUpgrade())}e.phase='vulture-ultimate';e.ultimateGrace=.4;assert(M.blocksUpgrade());e.ultimateGrace=0;assert.equal(M.blocksUpgrade(),false);e.phase='approach';assert.equal(M.blocksUpgrade(),false);
});

test('Mejora automática: XP intacta durante secuencia lunar y disponible al terminar',()=>{
 const {P}=new (require('../backend/simulation.cjs').Simulation)('campo',[0,1]),s=P.state;s.mode='play';s.xp=s.need+3;const xp=s.xp,level=s.level;P.VultureMoon.blocksUpgrade=()=>true;P.Progression.levelup();assert.equal(s.mode,'play');assert.equal(s.xp,xp);assert.equal(s.level,level);P.VultureMoon.blocksUpgrade=()=>false;P.Progression.levelup();assert.equal(s.mode,'upgrade');assert.equal(s.level,level+1);assert.equal(s.xp,3);
});
