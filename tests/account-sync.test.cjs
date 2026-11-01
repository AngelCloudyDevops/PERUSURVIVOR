'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const KEY='causas-progress-account-u-pending';
function setup(){const store=new Map(),timers=[],P={state:{mode:'menu',chosen:0},Meta:{key:'causas-progress-v1',normalize:x=>JSON.parse(JSON.stringify(x)),data:{version:4,wallet:5}},Save:{best:0}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/network/account.js'),'utf8'),{P,fetch(){},setTimeout:(fn,ms)=>{timers.push({fn,ms});return timers.length},clearTimeout(){},localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)}});
 const a=P.Account;a.guestKey=P.Meta.key;a.render=()=>{};a.refresh=()=>{};a.user={id:'u',username:'u'};a.ready=true;P.Meta.key='causas-progress-account-u';return {P,a,store,timers}}
const fail=status=>{throw Object.assign(Error('fallo'),status?{status}:{})};
test('Sync: errores de red/500 no marcan conflicto, conservan pendiente y reintentan con backoff',async()=>{const {a,store,timers}=setup();
 for(const status of [undefined,500]){a.api=async()=>fail(status);await a.queue();assert.equal(a.conflict,false);assert.equal(store.get(KEY),'0')}
 assert.deepEqual(timers.map(t=>t.ms),[2000,5000]);assert.match(a.syncMsg,/reintentando/);
 let puts=0;a.api=async()=>{puts++;return {revision:1}};timers.at(-1).fn();await a.tail;assert.equal(puts,1);assert.equal(store.get(KEY),undefined);assert.equal(a.fails,0);assert.equal(a.syncMsg,'')});
test('Sync: el backoff se limita a 30 s',async()=>{const {a,timers}=setup();a.api=async()=>fail();for(let i=0;i<6;i++)await a.queue();assert.deepEqual(timers.map(t=>t.ms),[2000,5000,15000,30000,30000,30000])});
test('Sync: un 409 real marca conflicto y no reintenta',async()=>{const {a,store,timers}=setup();a.api=async(route,method)=>{if(method==='PUT')fail(409);return {revision:9,data:{other:1}}};await a.queue();assert.equal(a.conflict,true);assert.equal(timers.length,0);assert.equal(store.get(KEY),'0')});
test('Sync: un rechazo permanente (400/422) no reintenta ni marca conflicto y conserva la copia local',async()=>{for(const status of [400,422]){const {a,store,timers}=setup();a.api=async(route,method)=>{if(method==='PUT')fail(status);return {revision:0}};await a.queue();assert.equal(a.conflict,false);assert.equal(timers.length,0);assert.equal(store.get(KEY),'0');assert.equal(a.syncMsg,'Guardado rechazado por el servidor')}});
test('Sync: un 409 cuyo PUT ya había llegado se resuelve en silencio',async()=>{const {a,store}=setup();a.api=async(route,method)=>{if(method==='PUT')fail(409);return {revision:1,data:a.snapshot()}};await a.queue();assert.equal(a.conflict,false);assert.equal(a.revision,1);assert.equal(store.get(KEY),undefined)});
test('Conectar con pendiente: misma revisión reenvía; datos iguales se resuelven; divergencia pide diálogo',async()=>{
 {const {a,store}=setup();store.set(KEY,'3');const puts=[];a.api=async(route,method,body)=>method==='PUT'?(puts.push(body.revision),{revision:4}):{revision:3,data:null};await a.connect(a.user);assert.equal(a.conflict,false);await a.tail;assert.deepEqual(puts,[3]);assert.equal(store.get(KEY),undefined)}
 {const {a,store}=setup();store.set(KEY,'3');a.api=async(route,method)=>{assert.notEqual(method,'PUT');return {revision:4,data:a.snapshot()}};await a.connect(a.user);assert.equal(a.conflict,false);assert.equal(a.revision,4);assert.equal(store.get(KEY),undefined)}
 {const {a,store}=setup();store.set(KEY,'3');a.api=async()=>({revision:8,data:{progress:{x:1}}});await a.connect(a.user);assert.equal(a.conflict,true);assert.equal(store.get(KEY),'3')}});
