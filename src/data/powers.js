'use strict';
// Poderes de parodia: los proyectiles y las armas son elementos de videojuego.
Object.assign(P.Data.attacks,{
shotgun:{name:'Escopeta arcade',description:'Cinco perdigones: fuerte cerca, impactos extra reducidos por enemigo.',kind:'spread',cooldown:.78,range:480,speed:820,count:5,spread:.13,powerScale:.6,falloff:{near:180,min:.35},glyph:'BULLET'},
pigShotgun:{name:'Escopeta VTuber',description:'Siete perdigones de corto alcance; impactos extra reducidos por enemigo.',kind:'spread',cooldown:.78,range:400,falloff:{near:140,min:.35},speed:780,count:7,spread:.16,powerScale:.5,glyph:'BULLET'},
fishgun:{name:'¡CPEZ!',description:'Una escopeta de tres pescados. Cada disparo anuncia CPEZ.',kind:'spread',cooldown:.85,range:650,speed:430,count:3,spread:.22,glyph:'FISH',shout:'CPEZ'},
roachRifle:{name:'Rifle de cucarachas',description:'Ráfaga rápida de cucarachas que zigzaguean.',kind:'spread',cooldown:.18,range:750,speed:580,count:1,motion:'zigzag',amplitude:18,frequency:17,glyph:'ROACH'},
diaper:{name:'Bebé de juguete lanzador',description:'Lanza pañales caricaturescos que dejan una nube de área.',kind:'spread',cooldown:1.2,range:600,speed:320,count:1,glyph:'DIAPER',cloud:true},
bananas:{name:'Plátanos de vuelta',description:'Dos plátanos giratorios que regresan como bumeranes.',kind:'boomerang',cooldown:.85,range:550,count:2,spread:.2,glyph:'BANANA'},
bankCards:{name:'Tarjetazo BCP',description:'Dos tarjetas que atraviesan hasta tres rivales cada una.',kind:'spread',cooldown:.75,range:850,speed:620,count:2,spread:.13,pierce:3,glyph:'BCP'},
roachCast:{name:'Enjambre azul',description:'Lanza pares de cucarachas marrones desde el disfraz azul.',kind:'spread',cooldown:.62,range:680,speed:420,count:2,spread:.22,motion:'zigzag',amplitude:10,frequency:12,glyph:'ROACH'},
g5Kick:{name:'Patada G5 · 145°',description:'Cuerpo a cuerpo: patada alta que golpea un arco de 145°.',kind:'melee',cooldown:.62,range:118,arc:145*Math.PI/180,push:32,glyph:'KICK'}
});
const changes={kingteka:{attack:'shotgun',spriteRow:0},najasor:{attack:'fishgun',spriteRow:2},charles:{attack:'diaper',spriteRow:4},shaka:{attack:'bananas',spriteRow:5},fuzo:{attack:'bankCards',spriteRow:6}};
for(const c of P.Data.characters)if(changes[c.id])Object.assign(c,changes[c.id],{atlas:'powers'});
P.Data.characters.push(
{id:'cerdito',name:'Cerdito VTuber',category:'VTuber · parodia',look:'cuy',atlas:'powers',spriteRow:1,color:'#f0a8c9',skin:'#edb49c',hp:130,speed:170,power:27,attack:'pigShotgun'},
{id:'sustento',name:'Sustento',category:'Streamer · parodia',look:'headset',atlas:'powers',spriteRow:3,color:'#a4c492',skin:'#caa07f',hp:105,speed:190,power:12,attack:'roachRifle'},
{id:'cevichero',name:'Cevichero',category:'Disfraz · parodia',look:'headset',atlas:'powers',spriteRow:7,color:'#6ea9f2',skin:'#d1a080',hp:115,speed:190,power:24,attack:'roachCast'},
{id:'g5',name:'La G5',category:'Luchadora · avatar',look:'cap',atlas:'powers',spriteRow:8,color:'#8bc6ed',skin:'#dbad8f',hp:145,speed:210,power:42,attack:'g5Kick'}
);
P.Data.upgrades.push({id:'projectiles',title:'Uno más para el combo',description:'+1 proyectil por ataque. En ataques de área, +12% de daño.',apply:p=>{if(['spread','boomerang'].includes(P.Data.attacks[p.attack].kind))p.projectileBonus=(p.projectileBonus||0)+1;else p.power*=1.12}});
