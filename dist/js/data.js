'use strict';
window.P={Data:{
characters:[
{id:'causa',name:'La Causa Gamer',category:'Streamer original',look:'headset',color:'#a89bfa',skin:'#d9a17c',hp:100,speed:185,power:22,attack:'emotes'},
{id:'clip',name:'Don Clip',category:'Streamer original',look:'cap',color:'#71c9cd',skin:'#c18c69',hp:95,speed:205,power:16,attack:'clip'},
{id:'cuy',name:'Cuy Supremo',category:'Meme original',look:'cuy',color:'#dcb17d',skin:'#e7bf8e',hp:150,speed:155,power:34,attack:'nova'},
{id:'paloma',name:'Paloma del Centro',category:'Meme original',look:'bird',color:'#a6bfce',skin:'#c3d0d8',hp:85,speed:225,power:17,attack:'feathers'},
{id:'alan',name:'Alan García',category:'Presidente · parodia',look:'alan',color:'#e58089',skin:'#dfb194',hp:130,speed:160,power:31,attack:'speech'},
{id:'alberto',name:'Alberto Fujimori',category:'Presidente · parodia',look:'alberto',color:'#f0ad65',skin:'#dbac88',hp:110,speed:175,power:24,attack:'orbit'}
],
attacks:{
emotes:{name:'Lluvia de emotes',description:'Tres emotes en abanico hacia el enemigo más cercano.',kind:'spread',cooldown:.7,range:700,glyph:':)'},
clip:{name:'Clip de ida y vuelta',description:'Un micrófono que sale, regresa y atraviesa enemigos.',kind:'boomerang',cooldown:.95,range:520,glyph:'MIC'},
nova:{name:'¡Habla, causa!',description:'Una onda de área que empuja a los enemigos cercanos.',kind:'nova',cooldown:1.1,range:145,glyph:'CAUSA'},
feathers:{name:'Ráfaga de la plaza',description:'Cinco plumas veloces en un abanico amplio.',kind:'spread',cooldown:.8,range:650,glyph:'PLUMA'},
speech:{name:'Discurso interminable',description:'Un cono de sonido que golpea a varios enemigos.',kind:'cone',cooldown:.85,range:230,glyph:'BLA'},
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