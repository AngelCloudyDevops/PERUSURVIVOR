const {test}=require('node:test');
const assert=require('node:assert');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

function engine(){
 const obstacle={x:0,y:0,w:150,h:48,solid:true},bounds={left:-680,right:680,top:-360,bottom:360};let P;
 const hit=(x,y,r=0)=>P.state.encounter.obstacles.find(o=>o.solid&&x>o.x-o.w/2-r&&x<o.x+o.w/2+r&&y>o.y-o.h/2-r&&y<o.y+o.h/2+r)||null;
 P={state:{mode:'play',elapsed:0,player:{x:260,y:0},encounter:{scene:{bounds},obstacles:[obstacle]}},Maps:{current:()=>({id:'campo'})},Terrain:{hit,clear(x,y,tx,ty,r=4){const d=Math.hypot(tx-x,ty-y),steps=Math.max(1,Math.ceil(d/12));for(let i=1;i<=steps;i++)if(hit(x+(tx-x)*i/steps,y+(ty-y)*i/steps,r))return false;return true},resolve(body,old,r){if(hit(body.x,body.y,r)){body.x=old.x;body.y=old.y}}},BossArt:{scene:()=>({bounds})},Attributes:{init(){},source:()=>({})},Audio:{play(){}},Ambient:{reduced:{matches:false}},Core:{},UI:{},$:()=>({}),Data:{arena:{duration:300}}};
 const context={P,Math,Map,Set,Infinity,console};vm.createContext(context);const root=path.resolve(__dirname,'..');
 vm.runInContext(fs.readFileSync(path.join(root,'src/systems/encounters.js'),'utf8'),context);
 vm.runInContext(fs.readFileSync(path.join(root,'src/systems/vulture-boss.js'),'utf8'),context);
 return {P,obstacle};
}

test('Jefes de arena rodean coberturas con una ruta persistente y sin oscilar',()=>{
 const {P}=engine(),e={x:-260,y:0,r:62,speed:62},p=P.state.player;let previous=null,reversals=0;
 for(let i=0;i<360&&Math.hypot(e.x-p.x,e.y-p.y)>145;i++){const dir=P.Encounters.navigate(e,p,.04),old={x:e.x,y:e.y};e.x+=dir.x*e.speed*.04;e.y+=dir.y*e.speed*.04;P.Terrain.resolve(e,old,e.r);assert(!P.Terrain.hit(e.x,e.y,e.r),'El cuerpo no debe penetrar la cobertura');if(previous&&previous.x*dir.x+previous.y*dir.y<-.2)reversals++;if(Math.hypot(dir.x,dir.y)>.1)previous=dir}
 assert(Math.hypot(e.x-p.x,e.y-p.y)<=150,'El jefe debe completar el rodeo');assert(reversals<=1,'La ruta no debe alternar de lado');assert((e.navExpanded||0)<=900);
});

test('El objetivo móvil invalida la ruta y los jefes no atacan a través de una cobertura',()=>{
 const {P}=engine(),p=P.state.player,e={x:-260,y:0,r:62,speed:62,hp:100,max:100,kind:'cabinet',phase:'approach',hit:0,attackT:0,attackIndex:0};
 P.Encounters.bossMove(e,.04);assert.equal(e.phase,'approach');assert(e.navPath.length>0);
 p.y=250;P.Encounters.navigate(e,p,.04);assert.equal(e.navGoal.y,250);
 const bird={...e,kind:'vulture',max:1000,hp:900,attackIndex:0,diveFx:[]};p.x=260;p.y=0;P.Vulture.move(bird,.04);assert.equal(bird.phase,'approach');assert(bird.navPath.length>0);
});

test('Los cuatro diseños de cobertura permiten rodear cada obstáculo por ambos lados',()=>{
 for(const kind of ['combi','cabinet','stone','vulture']){const {P}=engine(),r=kind==='combi'?74:kind==='cabinet'?64:kind==='stone'?70:62;for(const obstacle of P.Encounters.cover(kind)){P.state.encounter.obstacles=[obstacle];const p=P.state.player={x:obstacle.x+obstacle.w/2+r+80,y:obstacle.y},e={x:obstacle.x-obstacle.w/2-r-20,y:obstacle.y,r,speed:70};let steps=0;for(;steps<420&&!P.Terrain.clear(e.x,e.y,p.x,p.y,r+3);steps++){const dir=P.Encounters.navigate(e,p,.04),old={x:e.x,y:e.y};e.x+=dir.x*e.speed*.04;e.y+=dir.y*e.speed*.04;P.Terrain.resolve(e,old,e.r);assert(!P.Terrain.hit(e.x,e.y,e.r))}assert(steps<420,kind+' debe encontrar salida alrededor de '+obstacle.id+' desde '+e.x.toFixed(1)+','+e.y.toFixed(1)+' con '+(e.navPath?.length||0)+' nodos / '+e.navExpanded+' expandidos / siguiente '+JSON.stringify(e.navPath?.[0]))}}
});
