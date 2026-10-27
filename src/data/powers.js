'use strict';
// Consulta del catálogo: no modifica el combate ni depende del progreso guardado.
P.CharacterProfiles={
roles:{cristorata:['Hostigador móvil','Ida y vuelta perforante.','Poca vida; depende del retorno.'],cuy:['Tanque de área','Mucha vida y empuje circular.','Lento y de corto alcance.'],paloma:['Exploradora','Gran movilidad y abanico amplio.','Muy poca vida; dispersa impactos.'],alan:['Control frontal','Cono contra grupos.','Lento y dependiente de la orientación.'],alberto:['Defensa orbital','Bandas que cubren el entorno.','Necesita acercarse; cobertura discontinua.'],keiko:['Hostigadora de retorno','Abanico que atraviesa y regresa.','Recarga larga; depende del retorno.'],ollanta:['Vanguardia','Buena vida y cono frontal.','Movilidad moderada y alcance corto.'],kingteka:['Escopetero cercano','Descarga contra grupos cercanos.','Pierde daño lejos y al concentrar perdigones.'],shaka:['Control de pasillos','Dos bumeranes y buena vida.','Lento; necesita alinear el retorno.'],najasor:['Tirador móvil','Tres pescados y alta velocidad.','Poca vida y disparos dispersos.'],cirilo:['UR de riesgo progresivo','Vómito tóxico, ralentización, resurrección y dominio.','Recibe 10% más daño y debe llegar a nivel 20.'],fuzo:['Perforador de filas','Dos tarjetas contra hasta tres rivales cada una.','Necesita alinear enemigos.'],charles:['Control de zonas','Nubes que castigan grupos.','Recarga larga; los rivales pueden salir de la nube.'],axelbenba:['Tirador de abanico','Tres proyectiles y buena movilidad.','Poca vida; dispersa impactos.'],cerdito:['Escopetero de cobertura','Siete perdigones cubren un frente amplio.','Corto alcance; concentración de daño reducida.'],sustento:['Tirador de cadencia','Recarga corta para mantener presión.','Poco daño por impacto y vida limitada.'],cevichero:['Hostigador de enjambre','Dos proyectiles zigzagueantes.','El zigzag dificulta concentrar impactos.'],g5:['Luchadora móvil','Golpe fuerte en arco amplio.','Debe entrar a distancia cuerpo a cuerpo.']},
base(c){const a=P.Data.attacks[c.attack],projectile=['spread','boomerang'].includes(a.kind);return {hp:c.hp,speed:c.speed,damage:c.power*(a.powerScale||1)*(c.id==='chamelin'?(a.damageScale||1):1),cooldown:a.cooldown,range:a.range,count:a.kind==='orbit'?3:projectile?(a.count||(c.attack==='feathers'?5:a.kind==='spread'?3:1)):null,pierce:a.kind==='boomerang'?'Sin límite por trayecto':projectile?(a.pierce||1):null,role:this.roles[c.id][0],strength:this.roles[c.id][1],weakness:this.roles[c.id][2]}},
rows(c){const v=this.base(c),a=P.Data.attacks[c.attack],n=x=>Number(x.toFixed(2)),channel=P.Stats?.channelRows?.(c)||[],advanced=P.Stats?.advancedRows?.(c)||[];return [['Vida',v.hp],['Velocidad',v.speed+' u/s'],[a.kind==='orbit'?'Daño por contacto':'Daño por impacto',n(v.damage)],['Recarga',n(v.cooldown)+' s'],[a.kind==='orbit'?'Radio orbital':'Alcance nominal',v.range+' u'],...(v.count?[['Proyectiles / bandas',v.count]]:[]),...(v.pierce?[['Objetivos por proyectil',v.pierce]]:[]),...channel,...advanced]},
note(c){const a=P.Data.attacks[c.attack];return 'Fuerza > Técnica > Ingenio > Fuerza. Ventaja +15%; desventaja −10%. Los índices de ataque/defensa modifican el daño por impacto. '+(a.falloff?'Daño cercano del primer perdigón. Impactos extra: 35%, después 15%. A distancia baja hasta el 35%.':a.kind==='boomerang'?'El retorno puede volver a golpear. Alcance nominal: regresa tras 0,55 s; no garantiza recorrer toda esa distancia.':a.cloud?'La nube añade un 25% del daño por pulso cada 0,4 s durante 2,5 s.':a.kind==='orbit'?'Solo causa daño si una banda toca al enemigo.':'El daño depende de los impactos que conecten y los enemigos alcanzados.')}
};
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

// Balance del catálogo: presupuesto por rol, independiente de la rareza de colección.
for(const [id,patch] of Object.entries({cristorata:{power:18},alberto:{hp:120,power:28},g5:{hp:135,speed:195,power:36}}))Object.assign(P.Data.characters.find(c=>c.id===id),patch);
Object.assign(P.Data.attacks.clip,{cooldown:.9});
Object.assign(P.Data.attacks.nova,{cooldown:1});
Object.assign(P.Data.attacks.orbit,{cooldown:.42});
Object.assign(P.Data.attacks.bananas,{cooldown:.95,powerScale:.5});
Object.assign(P.Data.attacks.axelClip,{powerScale:.8});
Object.assign(P.Data.attacks.fishgun,{powerScale:.85});
Object.assign(P.Data.attacks.bankCards,{powerScale:.8});
Object.assign(P.Data.attacks.diaper,{powerScale:.8});
Object.assign(P.Data.attacks.roachRifle,{cooldown:.22});
Object.assign(P.Data.attacks.roachCast,{powerScale:.75});

// Makanaky comparte el atlas de su variante minijefe, no sus estadísticas.
P.Data.attacks.royalEcho={name:'Puño de la realeza',description:'Puñetazo cuerpo a cuerpo en arco de 120°, con empuje corto.',kind:'melee',cooldown:.56,range:100,arc:120*Math.PI/180,push:24,glyph:'FIST',color:'#ef92cf'};
P.Data.characters.push({id:'makanaky',name:'Makanaky · La Realeza',category:'Streamer · parodia',look:'headset',atlas:'makanaky',spriteRow:0,color:'#ef92cf',skin:'#cb976d',hp:125,speed:200,power:32,attack:'royalEcho'});
P.CharacterProfiles.roles.makanaky=['Luchador de presión','Puños rápidos contra grupos cercanos.','Necesita acercarse y aprovechar el agotamiento de los minijefes.'];
P.Data.attacks.sideralFear={name:'Mirada Sideral',description:'Una mueca exagerada aterra a los minions en un cono frontal.',kind:'cone',cooldown:1.35,range:270,arc:1.55,powerScale:.42,push:8,fear:true,fearDuration:.9,fearCooldown:2.5,glyph:'!'};
P.Data.characters.push({id:'sideral',name:'Sideral · Espantaminions',category:'Streamer · parodia',look:'headset',atlas:'sideral',spriteRow:0,color:'#ff465f',skin:'#d99368',hp:120,speed:195,power:27,attack:'sideralFear'});
P.CharacterProfiles.roles.sideral=['Control UR','Hace huir a los minions en un cono frontal.','El mismo rival resiste nuevos sustos durante 2,5 s.'];

Object.assign(P.Data.attacks.pigShotgun,{cooldown:.72,powerScale:.56,falloff:{near:165,min:.35}});
Object.assign(P.Data.attacks.g5Kick,{cooldown:.68});

P.Data.attacks.trovoShot={name:'Retaguardia de Trovo',description:'Impacto ligero (15 %); charcos de 4 s con daño especial continuo y ralentización 20 % (10 % a jefes), sin reducir defensas.',kind:'spread',cooldown:.8,range:420,count:1,speed:310,damageScale:.15,glyph:'POOP',color:'#a87543',damageType:'special'};
P.Data.characters.push({id:'chamelin',name:'Chamelín Trovo',category:'Streamer · parodia',look:'chullo',atlas:'chamelin',spriteRow:0,color:'#5097cf',skin:'#d49b70',hp:125,speed:185,power:28,attack:'trovoShot'});
P.CharacterProfiles.roles.chamelin=['Control de zonas UR','Poco impacto; charcos de daño continuo y ralentización.','Movilidad moderada y daño gradual.'];
