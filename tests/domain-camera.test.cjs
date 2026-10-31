const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');

function engine(reduced=false){
 const player={x:100,y:100,hp:100},ally={x:500,y:300,hp:100},domain={id:7,x:300,y:200};
 const P={state:{mode:'play',player,kingtekaDomain:domain},KingtekaDomain:{radius:520},Court:{players:()=>[player,ally]},Coop:{peers:[ally]}};
 vm.runInNewContext(fs.readFileSync('src/rendering/world.js','utf8'),{P,globalThis:{matchMedia:()=>({matches:reduced})}});
 return{P,player,ally,domain,world:P.World}
}

function advance(world,start,end,step,width,height,zoom,target){let frame;for(let t=start;t<=end;t+=step)frame=world.domainCameraFrame(t,width,height,zoom,target);return frame}

test('la cámara dinámica abre el plano y centra dominio y jugadores vivos',()=>{
 const {world}=engine(),base={x:100,y:100};world.domainCameraFrame(0,1280,720,1.3,base);
 const frame=advance(world,50,750,50,1280,720,1.3,base);
 assert(Math.abs(frame.zoom-1.3*.78)<1e-9);assert.equal(frame.target.x,300);assert.equal(frame.target.y,200);assert.equal(frame.amount,1)
});

test('móvil limita el alejamiento y la salida vuelve sin salto al encuadre normal',()=>{
 const {P,world}=engine(),base={x:100,y:100};world.domainCameraFrame(0,390,844,1.05,base);
 const active=advance(world,50,750,50,390,844,1.05,base);assert(Math.abs(active.zoom-1.05*.87)<1e-9);
 P.state.kingtekaDomain=null;const first=world.domainCameraFrame(800,390,844,1.05,base);assert(first.zoom>active.zoom&&first.zoom<1.05);
 const restored=advance(world,850,1650,50,390,844,1.05,base);assert.equal(restored.zoom,1.05);assert.deepEqual(restored.target,base);assert.equal(restored.amount,0)
});

test('movimiento reducido conserva la transición pero la completa rápidamente',()=>{
 const {world}=engine(true),base={x:0,y:0};world.domainCameraFrame(0,1280,720,1.3,base);
 const frame=advance(world,50,150,50,1280,720,1.3,base);assert.equal(frame.amount,1);assert(Math.abs(frame.zoom-1.3*.78)<1e-9)
});
