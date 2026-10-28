'use strict';
window.P={Data:{
characters:[
{id:'zein',spriteRow:0,name:'ElZeein',category:'Streamer · parodia',look:'headset',color:'#a89bfa',skinTone:'#d9a17c',hp:100,speed:185,power:22,attack:'emotes'},
{id:'cristorata',spriteRow:1,name:'Cristorata',category:'Streamer · parodia',look:'cap',color:'#71c9cd',skinTone:'#c18c69',hp:95,speed:205,power:16,attack:'clip'},
{id:'cuy',spriteRow:2,name:'Cuy Supremo',category:'Meme original',look:'cuy',color:'#dcb17d',skinTone:'#e7bf8e',hp:150,speed:155,power:34,attack:'nova'},
{id:'paloma',spriteRow:3,name:'Paloma del Centro',category:'Meme original',look:'bird',color:'#a6bfce',skinTone:'#c3d0d8',hp:85,speed:225,power:17,attack:'feathers'},
{id:'alan',spriteRow:4,name:'Alan García',category:'Presidente · parodia',look:'alan',color:'#e58089',skinTone:'#dfb194',hp:130,speed:160,power:31,attack:'speech'},
{id:'alberto',spriteRow:5,name:'Alberto Fujimori',category:'Presidente · parodia',look:'alberto',color:'#f0ad65',skinTone:'#dbac88',hp:110,speed:175,power:24,attack:'orbit'},
{id:'keiko',spriteRow:6,name:'Keiko Fujimori',category:'Política · parodia',look:'keiko',color:'#f5a049',skinTone:'#e4b293',hp:110,speed:185,power:23,attack:'fan'},
{id:'ollanta',spriteRow:7,name:'Ollanta Humala',category:'Presidente · parodia',look:'ollanta',color:'#9fbb77',skinTone:'#bd906a',hp:135,speed:170,power:30,attack:'megaphone'}
],
attacks:{
emotes:{name:'Lluvia de emotes',description:'Tres emotes en abanico hacia el enemigo más cercano.',kind:'spread',cooldown:.7,range:700,glyph:':)'},
clip:{name:'Clip de ida y vuelta',description:'Un micrófono que sale, regresa y atraviesa enemigos.',kind:'boomerang',cooldown:.95,range:520,glyph:'MIC'},
nova:{name:'¡Habla, causa!',description:'Una onda de área que empuja a los enemigos cercanos.',kind:'nova',cooldown:1.1,range:145,glyph:'CAUSA'},
feathers:{name:'Ráfaga de la plaza',description:'Cinco plumas veloces en un abanico amplio.',kind:'spread',cooldown:.8,range:650,glyph:'PLUMA'},
speech:{name:'Discurso interminable',description:'Un cono de sonido que golpea a varios enemigos.',kind:'cone',cooldown:.85,range:230,glyph:'BLA'},
fan:{name:'Abanico naranja',description:'Un abanico giratorio que atraviesa enemigos y regresa.',kind:'boomerang',cooldown:1.05,range:540,glyph:'FAN'},
megaphone:{name:'Voz de mando',description:'Ondas de megáfono en un cono que golpea a varios enemigos.',kind:'cone',cooldown:.9,range:250,glyph:'VOZ'},
orbit:{name:'Banda presidencial',description:'Tres bandas orbitan a tu alrededor y dañan por contacto.',kind:'orbit',cooldown:.45,range:100,glyph:'BANDA'}
},
arena:{name:'Plaza del Causas',duration:300,enemyCap:80},
upgrades:[
{id:'power',title:'Más alcance mediático',description:'+25% de daño.',apply:p=>p.power*=1.25},
{id:'rate',title:'Internet de cabina',description:'Ataques un 18% más frecuentes.',apply:p=>p.rate=Math.max(.14,p.rate*.82)},
{id:'health',title:'Su buen emoliente',description:'+25 de vida máxima y recupera 40 de vida.',apply:p=>{p.maxHp+=25;p.hp=Math.min(p.maxHp,p.hp+40)}},
{id:'speed',title:'La combi ya se va',description:'+15% de velocidad.',apply:p=>p.speed*=1.15},
{id:'magnet',title:'Se hizo viral',description:'+50% de alcance para recoger fama.',apply:p=>p.magnet*=1.5},
{id:'range',title:'En cadena nacional',description:'+20% de alcance de tu habilidad.',apply:p=>p.reach*=1.2}
]}};
P.Data.boss={...P.Data.characters.shift(),name:"ElZeein",description:"Jefe final · parodia ficticia"};
P.Data.characters.push(...[{"id":"kingteka","spriteRow":0,"atlas":"streamers","name":"Kingteka","category":"Streamer · parodia","look":"headset","color":"#c8a6ff","skinTone":"#bc906f","hp":125,"speed":175,"power":28,"attack":"controller"},{"id":"shaka","spriteRow":1,"atlas":"streamers","name":"Shakadoto","category":"Streamer · parodia","look":"cap","color":"#b6d1f0","skinTone":"#ccaa86","hp":140,"speed":160,"power":35,"attack":"shout"},{"id":"najasor","spriteRow":2,"atlas":"streamers","name":"Najasor","category":"Streamer · parodia","look":"cap","color":"#83d5bd","skinTone":"#ccaa86","hp":95,"speed":215,"power":20,"attack":"phone"},{"id":"cirilo","spriteRow":3,"atlas":"streamers","name":"CiriloTV","category":"Streamer · parodia","look":"cap","color":"#65c2dc","skinTone":"#ccaa86","hp":120,"speed":175,"power":22,"attack":"micro"},{"id":"fuzo","spriteRow":4,"atlas":"streamers","name":"Fuzo","category":"Streamer · parodia","look":"headset","color":"#e4cf70","skinTone":"#ccaa86","hp":115,"speed":180,"power":24,"attack":"keyboard"},{"id":"charles","spriteRow":5,"atlas":"streamers","name":"Charles","category":"Streamer · parodia","look":"cap","color":"#7ea9f0","skinTone":"#ccaa86","hp":130,"speed":165,"power":33,"attack":"charlesVoice"},{"id":"axelbenba","spriteRow":6,"atlas":"streamers","name":"Axel Benba","category":"Streamer · parodia","look":"headset","color":"#ef8891","skinTone":"#ccaa86","hp":100,"speed":200,"power":21,"attack":"axelClip"}]);
Object.assign(P.Data.attacks,{
controller:{...P.Data.attacks.emotes,name:"Combo del rey",glyph:"PAD"},shout:{...P.Data.attacks.nova,name:"Grito de la party"},phone:{...P.Data.attacks.emotes,name:"Señal IRL",glyph:"PHONE"},micro:{...P.Data.attacks.clip,name:"Micro de la plaza"},keyboard:{...P.Data.attacks.clip,name:"Teclado giratorio",glyph:"KEY"},charlesVoice:{...P.Data.attacks.speech,name:"Megáfono azul"},axelClip:{...P.Data.attacks.emotes,name:"Clip relámpago"}
});
