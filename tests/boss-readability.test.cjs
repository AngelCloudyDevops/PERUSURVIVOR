'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{Simulation}=require('../backend/simulation.cjs');

function context(text){return new Proxy({fillText(value){text.push(String(value))},strokeText(value){text.push(String(value))}},{get:(target,key)=>key in target?target[key]:()=>{}})}

test('Aviso global de jefe: orden grande, objetivo y confirmación segura sin crear efectos',()=>{
 const sim=new Simulation('machu',[0]),P=sim.P,s=P.state,text=[],ctx=context(text),before={effects:s.effects.length,danger:s.danger.length,enemies:s.enemies.length};
 P.Encounters.actionPrompt(ctx,{hp:10},'ESCÓNDETE','ENTRA AL REFUGIO REAL',{target:{x:80,y:40,r:50},targetLabel:'REFUGIO',safe:false});
 P.Encounters.actionPrompt(ctx,{hp:10},'QUÉDATE AQUÍ','ENTRA AL REFUGIO REAL',{target:{x:80,y:40,r:50},targetLabel:'REFUGIO',safe:true});
 assert(text.some(value=>value.includes('ESCÓNDETE')));assert(text.some(value=>value.includes('REFUGIO')));assert(text.some(value=>value.includes('A SALVO')));
 assert.deepEqual({effects:s.effects.length,danger:s.danger.length,enemies:s.enemies.length},before);
});

test('Todos los jefes especiales registran una instrucción de respuesta concreta',()=>{
 const root=path.join(__dirname,'..','src','systems'),files=['guardian-boss.js','cabinet-boss.js','procession-boss.js','holiday-boss.js','fujimori-boss.js','vulture-boss.js','map-events.js'],source=files.map(file=>fs.readFileSync(path.join(root,file),'utf8')).join('\n');
 for(const instruction of ['ESCÓNDETE','USA COBERTURA','VE A LA FRANJA DORADA','TOCA EL FAROL','SAL DE LA OFRENDA','CORRE A LA NIEVE','SAL DEL SELLO','SAL DE LA SOMBRA','ENTRA AL SELLO ILUMINADO','FLANQUEA AL JEFE','HAZLO CHOCAR CON EL PILAR'])assert(source.includes(instruction),instruction);
});
