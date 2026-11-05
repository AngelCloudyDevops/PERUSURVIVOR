'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'src/systems/background-music.js'),'utf8');

function environment(policy,initialChoice='alternate'){
 const storage=new Map([['perusurvivor-music',initialChoice]]),elements=new Map(),created=[];
 const select={value:'',options:[],disabled:false,title:'',closest:()=>null,append(option){this.options.push(option)}};
 select.options=['original','tema1','tema2','alternate','none'].map(value=>({value,hidden:false,disabled:false,remove(){const index=select.options.indexOf(this);if(index>=0)select.options.splice(index,1)}}));
 const volume={value:'50'},status={textContent:''};
 elements.set('#background-music',select);elements.set('#music-volume',volume);elements.set('#music-status',status);
 const P={$:id=>elements.get(id)||null,Maps:{selected:'campo'},Audio:{unlock(){},sync(){}},state:{mode:'menu'}};
 const document={hidden:false,addEventListener(){},createElement(tag){created.push(tag);return {value:'',textContent:'',remove(){}}}};
 const response={ok:true,async json(){return {tracks:[],policies:policy?[policy]:[],canManage:false}}};
 vm.runInNewContext(source,{P,Promise,Math,Number,Date,document,fetch:async()=>response,localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)}});
 return {music:P.BackgroundMusic,select,status,storage,created,elements};
}

async function settle(){for(let index=0;index<8;index++)await Promise.resolve()}

test('El panel de partida no ofrece subir ni eliminar archivos',async()=>{
 const env=environment(null);env.music.init();await settle();
 assert.equal(env.elements.has('#custom-music-file'),false);
 assert.equal(env.elements.has('#server-music-file'),false);
 assert(!env.created.includes('input'));
});

test('Una política bloqueada fija la música elegida por administración',async()=>{
 const env=environment({mapId:'campo',defaultChoice:'tema2',allowedChoices:['tema2'],allowPlayerChoice:false});env.music.init();await settle();
 assert.equal(env.music.choice,'tema2');
 assert.equal(env.select.value,'tema2');
 assert.equal(env.select.disabled,true);
 assert.equal(env.select.options.find(option=>option.value==='tema1').hidden,true);
});

test('El jugador solo cambia entre temas permitidos y la elección se guarda por mapa',async()=>{
 const env=environment({mapId:'campo',defaultChoice:'tema1',allowedChoices:['tema1','tema2'],allowPlayerChoice:true});env.music.init();await settle();
 assert.equal(env.select.disabled,false);
 env.select.value='tema2';env.select.onchange();
 assert.equal(env.music.choice,'tema2');
 assert.equal(env.storage.get('perusurvivor-music:campo'),'tema2');
 env.select.value='none';env.select.onchange();
 assert.equal(env.music.choice,'tema2');
 assert.equal(env.select.value,'tema2');
});
