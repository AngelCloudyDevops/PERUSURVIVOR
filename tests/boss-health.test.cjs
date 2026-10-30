'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');

function setup(){const P={state:{elapsed:10,danger:[],effects:[],encounter:{}},Audio:{fx(){}}};vm.runInNewContext(fs.readFileSync('src/entities/actors.js','utf8'),{P});return P}
function hit(P,e,amount,source={player:true}){const damage=P.BossHealth.damage(e,amount,source);e.hp-=damage;return damage}

test('las categorías usan dos, tres y cuatro barras sin multiplicar la vida',()=>{const P=setup();assert.equal(P.BossHealth.bars({miniboss:true}),2);assert.equal(P.BossHealth.bars({mapBoss:true}),3);assert.equal(P.BossHealth.bars({boss:true}),4);assert.equal(P.BossHealth.bars({}),1);assert.equal(P.BossHealth.phase({miniboss:true,hp:100,max:100}),1);assert.equal(P.BossHealth.phase({miniboss:true,hp:50,max:100}),2)});

test('un golpe fuerte rompe solo una fase y arrastra como máximo 25 % de la siguiente',()=>{const P=setup(),e={mapBoss:true,x:0,y:0,r:50,hp:1200,max:1200,color:'#fff'};hit(P,e,9999);assert.equal(e.healthStage,2);assert.equal(e.hp,700);assert.equal(P.BossHealth.phase(e),2);assert.equal(e.healthGuardUntil,10.6);assert.equal(P.state.effects.at(-1).text,'FASE 2 / 3')});

test('la transición reduce daño y no permite romper otra barra durante 0,6 s',()=>{const P=setup(),e={boss:true,x:0,y:0,r:40,hp:1000,max:1000};hit(P,e,9999);assert.equal(e.hp,687.5);assert.equal(e.healthStage,2);hit(P,e,9999);assert(e.hp>500);assert.equal(e.healthStage,2);P.state.elapsed=10.61;hit(P,e,9999);assert.equal(e.healthStage,3);assert.equal(e.hp,437.5)});

test('el daño interno sin fuente conserva resolución directa',()=>{const P=setup(),e={miniboss:true,hp:100,max:100};assert.equal(P.BossHealth.damage(e,999,null),999);assert.equal(e.healthStage,undefined)});
