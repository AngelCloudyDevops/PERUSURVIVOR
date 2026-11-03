const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'src/systems/taunts.js'),'utf8');

function runtime(){
 let now=1000,played=0;
 class AudioStub{constructor(src){this.src=src;this.volume=0;this.currentTime=0;this.preload='';this.paused=true}addEventListener(){}pause(){this.paused=true}play(){this.paused=false;played++;return Promise.resolve()}}
 const P={state:{mode:'play',player:{hp:100,r:24}},Audio:{muted:false,blurred:false,effectsVolume:.7,unlock(){},duckMusic(){this.ducked=true},tone(){}},Coop:{active:false}};
 const context={P,Audio:AudioStub,performance:{now:()=>now},setTimeout:()=>1,clearTimeout(){},Map,Number,Math,globalThis:{matchMedia:()=>({matches:false})}};
 vm.runInNewContext(source,context,{filename:'taunts.js'});
 return{P,played:()=>played,time:value=>{now=value}};
}

test('la rueda registra seis burlas y activa la principal sin tocar la simulación',()=>{
 const {P,played}=runtime(),taunts=P.Taunts;
 assert.equal(taunts.items.length,6);
 assert.equal(taunts.activate(0),true);
 assert.equal(played(),1);
 assert.equal(taunts.voice.src,'assets/audio/burla-voz-v1.mpeg');
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

test('el audio existe, se carga bajo demanda y el build publica el módulo',()=>{
 const audio=path.join(root,'public/assets/audio/burla-voz-v1.mpeg');
 assert.equal(fs.statSync(audio).size,3966132);
 assert.match(source,/preload='none'/);
 assert.match(source,/setTimeout\(\(\)=>this\.stopVoice\(\),5000\)/);
 const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
 assert.match(html,/js\/taunts\.js\?v=/);
 assert(fs.existsSync(path.join(root,'dist/js/taunts.js')));
});
