const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'src/systems/taunts.js'),'utf8');

function runtime(){
 let now=1000,played=0;
 class MediaStub{constructor(src){this.src=src;this.volume=0;this.currentTime=0;this.preload='';this.paused=true;this.muted=false}getAttribute(name){return name==='src'?this.src:null}addEventListener(){}pause(){this.paused=true}play(){this.paused=false;played++;return Promise.resolve()}}
 const P={state:{mode:'play',player:{hp:100,r:24}},Audio:{muted:false,blurred:false,effectsVolume:.7,unlock(){},duckMusic(){this.ducked=true},tone(){}},Coop:{active:false}};
 const context={P,performance:{now:()=>now},setTimeout:()=>1,clearTimeout(){},Map,Number,Math,globalThis:{matchMedia:()=>({matches:false})}};
 vm.runInNewContext(source,context,{filename:'taunts.js'});
 P.Taunts.video=new MediaStub('assets/video/burla-entiendes-v1.mp4');P.Taunts.image=new MediaStub('');P.Taunts.image.hidden=true;P.Taunts.videoRoot={hidden:true,dataset:{}};
 return{P,played:()=>played,time:value=>{now=value}};
}

test('la rueda registra seis burlas y activa el video principal sin tocar la simulación',()=>{
 const {P,played}=runtime(),taunts=P.Taunts;
 assert.equal(taunts.items.length,6);
 assert.equal(taunts.activate(0),true);
 assert.equal(played(),1);
 assert.equal(taunts.video.src,'assets/video/burla-entiendes-v1.mp4');
 assert.equal(taunts.videoRoot.hidden,false);
 assert.equal(taunts.stateFor(P.state.player).label,'¿ME ENTIENDES?');
 assert.equal(P.Audio.ducked,true);
});

test('una burla cooperativa solo acepta slot e identificador conocidos',()=>{
 const {P}=runtime(),taunts=P.Taunts;P.Coop={active:true,session:{slot:0},send(){}};
 assert.equal(taunts.receive({slot:1,id:'gg'}),true);
 assert.equal(taunts.active.get('1').label,'GG, CAUSA');
 assert.equal(taunts.receive({slot:4,id:'gg'}),false);
 assert.equal(taunts.receive({slot:1,id:'desconocida'}),false);
});

test('dos jugadores conservan sus burlas multimedia al mismo tiempo',()=>{
 const {P}=runtime(),taunts=P.Taunts;P.Coop={active:true,session:{slot:0},send(){}};
 const channel=owner=>({owner,root:{hidden:true,dataset:{},style:{setProperty(){}}},video:new (taunts.video.constructor)(''),image:new (taunts.image.constructor)(''),audio:new (taunts.video.constructor)(''),videoStop:null,audioStop:null});
 taunts.mediaChannels.set('0',channel('0'));taunts.mediaChannels.set('1',channel('1'));
 assert.equal(taunts.activate(0),true);assert.equal(taunts.receive({slot:1,id:'entiendes'}),true);
 assert.equal(taunts.mediaChannels.get('0').root.hidden,false);assert.equal(taunts.mediaChannels.get('1').root.hidden,false);
 assert.equal(taunts.mediaChannels.get('0').video.paused,false);assert.equal(taunts.mediaChannels.get('1').video.paused,false);
 taunts.stopVideo('1');assert.equal(taunts.mediaChannels.get('0').video.paused,false);assert.equal(taunts.active.has('0'),true);
});

test('un meme visual se muestra sin borrar su estado activo',()=>{
 const {P}=runtime(),taunts=P.Taunts;taunts.items[1]={id:'meme',glyph:'MV',label:'MEME VISUAL',kind:'image',src:'/api/taunts/media/demo'};
 assert.equal(taunts.activate(1),true);assert.equal(taunts.image.src,'/api/taunts/media/demo');assert.equal(taunts.image.hidden,false);assert.equal(taunts.video.hidden,true);assert.equal(taunts.stateFor(P.state.player).label,'MEME VISUAL');
});

test('el video existe, se carga bajo demanda y el build lo publica',()=>{
 const video=path.join(root,'public/assets/video/burla-entiendes-v1.mp4');
 assert.equal(fs.statSync(video).size,1046984);
 assert.match(source,/preload='none'/);
 assert.match(source,/setTimeout\(\(\)=>this\.stopVideo\(owner\),10000\)/);
 const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
 assert.match(html,/js\/taunts\.js\?v=/);
 assert(fs.existsSync(path.join(root,'dist/js/taunts.js')));
 assert.equal(fs.statSync(path.join(root,'dist/assets/video/burla-entiendes-v1.mp4')).size,1046984);
});

test('la burbuja conserva tamaño cuadrado y el editor permite mover y acercar el encuadre',()=>{
 const css=fs.readFileSync(path.join(root,'src/ui/taunts.css'),'utf8'),admin=fs.readFileSync(path.join(root,'src/ui/admin.js'),'utf8');
 assert.match(css,/\.taunt-media\{[^}]*aspect-ratio:1/);
 assert.match(css,/--taunt-crop-x/);
 assert.match(admin,/4 · ENCUADRA LA BURBUJA/);
 assert.match(admin,/Acercamiento/);
 assert.match(admin,/cropStep/);
});
