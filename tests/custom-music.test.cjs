'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'src/systems/background-music.js'),'utf8');

function environment(initialChoice='alternate',initialRecord=null){
 const storage=new Map([['perusurvivor-music',initialChoice]]),elements=new Map(),urls=[],revoked=[];
 let record=initialRecord,syncs=0,urlId=0;
 const select={value:'',options:[],closest:()=>null,querySelector(selector){return selector==='option[value="custom"]'?this.options.find(option=>option.value==='custom')||null:null},append(option){this.options.push(option)}};
 const volume={value:'50'};
 const file={files:[],value:''};
 const status={textContent:''};
 elements.set('#background-music',select);elements.set('#music-volume',volume);elements.set('#custom-music-file',file);elements.set('#music-status',status);
 const P={$:id=>elements.get(id)||null,Audio:{unlock(){},sync(){syncs++}}};
 const database={objectStoreNames:{contains:()=>true},transaction(){const transaction={};transaction.objectStore=()=>({put(value){queueMicrotask(()=>{record=value;transaction.oncomplete?.()})},get(){const request={};queueMicrotask(()=>{request.result=record;request.onsuccess?.()});return request}});return transaction}};
 const indexedDB={open(){const request={};queueMicrotask(()=>{request.result=database;request.onsuccess?.()});return request}};
 const URL={createObjectURL(value){const url='blob:track-'+(++urlId);urls.push([url,value]);return url},revokeObjectURL:url=>revoked.push(url)};
 const document={hidden:false,addEventListener(){},createElement(){return {value:'',textContent:''}}};
 vm.runInNewContext(source,{P,Promise,Math,Number,Date,indexedDB,URL,document,localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)}});
 return {music:P.BackgroundMusic,select,volume,file,status,storage,urls,revoked,get record(){return record},get syncs(){return syncs}};
}

async function settle(){for(let index=0;index<5;index++)await Promise.resolve()}

test('La música propia se guarda hasta 50 MB y queda elegida para la próxima sesión',async()=>{
 const env=environment();env.music.init();await settle();
 const track={name:'tema-del-jugador.mp3',type:'audio/mpeg',size:50*1024*1024};
 env.file.files=[track];await env.file.onchange();
 assert.equal(env.record.blob,track);
 assert.equal(env.record.name,track.name);
 assert.equal(env.storage.get('perusurvivor-music'),'custom');
 assert.equal(env.music.choice,'custom');
 assert.match(env.status.textContent,/disponible al volver/);
 assert.equal(env.select.value,'custom');
});

test('Una pista propia guardada se restaura sin pedir el archivo otra vez',async()=>{
 const track={name:'tema-guardado.ogg',type:'audio/ogg',size:1024};
 const env=environment('custom',{blob:track,name:track.name,type:track.type,size:track.size});
 env.music.init();await settle();
 assert.equal(env.music.choice,'custom');
 assert.equal(env.music.customName,track.name);
 assert.equal(env.select.value,'custom');
 assert.match(env.music.customUrl,/^blob:track-/);
 assert.match(env.status.textContent,/Pista guardada/);
 assert(env.syncs>0);
});

test('Los archivos mayores de 50 MB se rechazan sin reemplazar la selección',async()=>{
 const env=environment();env.music.init();await settle();
 env.file.files=[{name:'demasiado-grande.wav',type:'audio/wav',size:50*1024*1024+1}];
 await env.file.onchange();
 assert.equal(env.record,null);
 assert.equal(env.storage.get('perusurvivor-music'),'alternate');
 assert.match(env.status.textContent,/supera 50 MB/);
});
