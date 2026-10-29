'use strict';
// Consulta del catálogo: no modifica el combate ni depende del progreso guardado.
P.CharacterProfiles={
taxonomies:{
 roles:{vanguard:'Vanguardia',shooter:'Tirador',skirmisher:'Hostigador',controller:'Controlador',guardian:'Guardián',support:'Apoyo',specialist:'Especialista'},
 species:{human:'Humano',animal:'Animal',creature:'Criatura / meme',supernatural:'Sobrenatural',construct:'Constructo'},
 ranges:{melee:'Cuerpo a cuerpo',short:'Corto',medium:'Medio',long:'Largo',mixed:'Variable'},
 damage:{physical:'Físico',special:'Especial',hybrid:'Híbrido'},
 functions:{burst:'Ráfaga',sustained:'Daño sostenido',area:'Área',piercing:'Perforación',returning:'Retorno',control:'Control',mobility:'Movilidad',healing:'Curación',durability:'Resistencia',summon:'Invocación',evolution:'Evolución',risk:'Alto riesgo',fixed:'Daño fijo',arsenal:'Arsenal intercambiable',dot:'Daño continuo'},
 difficulties:{easy:'Fácil',intermediate:'Intermedia',advanced:'Avanzada'}
},
identities:{
 cristorata:{role:'skirmisher',secondaryRole:'shooter',species:'human',range:'medium',damage:'physical',tags:['mobility','returning','piercing'],difficulty:'intermediate'},
 cuy:{role:'guardian',secondaryRole:'controller',species:'animal',range:'short',damage:'special',tags:['area','control','durability'],difficulty:'easy'},
 paloma:{role:'shooter',secondaryRole:'skirmisher',species:'animal',range:'long',damage:'physical',tags:['mobility','area'],difficulty:'intermediate'},
 alan:{role:'controller',secondaryRole:'vanguard',species:'human',range:'short',damage:'special',tags:['area','control','burst'],difficulty:'intermediate'},
 alberto:{role:'guardian',secondaryRole:'controller',species:'human',range:'short',damage:'special',tags:['area','durability','control'],difficulty:'intermediate'},
 keiko:{role:'skirmisher',secondaryRole:'shooter',species:'human',range:'medium',damage:'physical',tags:['returning','piercing','burst'],difficulty:'intermediate'},
 ollanta:{role:'vanguard',secondaryRole:'guardian',species:'human',range:'short',damage:'special',tags:['area','durability','control'],difficulty:'easy'},
 kingteka:{role:'vanguard',secondaryRole:'controller',species:'human',range:'mixed',damage:'hybrid',tags:['arsenal','burst','control','mobility','healing','fixed'],difficulty:'intermediate'},
 shaka:{role:'controller',secondaryRole:'skirmisher',species:'human',range:'medium',damage:'physical',tags:['returning','area','control'],difficulty:'intermediate'},
 najasor:{role:'shooter',secondaryRole:'skirmisher',species:'human',range:'long',damage:'physical',tags:['mobility','burst'],difficulty:'easy'},
 cirilo:{role:'specialist',secondaryRole:'controller',species:'human',range:'medium',damage:'hybrid',tags:['dot','control','evolution','risk'],difficulty:'advanced'},
 fuzo:{role:'shooter',secondaryRole:'controller',species:'human',range:'long',damage:'special',tags:['piercing','sustained'],difficulty:'easy'},
 charles:{role:'controller',secondaryRole:'shooter',species:'human',range:'medium',damage:'special',tags:['area','dot','control'],difficulty:'intermediate'},
 axelbenba:{role:'shooter',secondaryRole:'skirmisher',species:'human',range:'long',damage:'special',tags:['mobility','burst'],difficulty:'easy'},
 sustento:{role:'shooter',secondaryRole:null,species:'human',range:'long',damage:'physical',tags:['sustained'],difficulty:'easy'},
 cevichero:{role:'skirmisher',secondaryRole:'controller',species:'human',range:'long',damage:'physical',tags:['mobility','area'],difficulty:'intermediate'},
 g5:{role:'vanguard',secondaryRole:'skirmisher',species:'human',range:'melee',damage:'physical',tags:['mobility','burst','area'],difficulty:'intermediate'},
 makanaky:{role:'vanguard',secondaryRole:'specialist',species:'human',range:'melee',damage:'physical',tags:['sustained','control','evolution'],difficulty:'advanced'},
 sideral:{role:'controller',secondaryRole:'specialist',species:'human',range:'medium',damage:'special',tags:['control','area','risk'],difficulty:'advanced'},
 chamelin:{role:'controller',secondaryRole:'specialist',species:'human',range:'medium',damage:'special',tags:['area','dot','control','fixed'],difficulty:'advanced'}
},
// Contrato del arsenal personal. `implemented` solo se usa cuando el ataque
// existe en combate; los conceptos planeados no habilitan teclas ni cartas.
weaponKits:{
 kingteka:[
  {id:'shotgun',name:'Escopeta causa',damageType:'physical',status:'implemented'},
  {id:'gallinazo',name:'Gallinazo',damageType:'special',status:'implemented'},
  {id:'golpe',name:'Golpe de cuerpo',damageType:'physical',status:'implemented'}
 ],
 makanaky:[
  {id:'royalEcho',name:'Puño de la realeza',damageType:'physical',status:'implemented'},
  {id:'makanakyHeadbutt',name:'Tú no tienes mano',damageType:'physical',status:'planned'},
  {id:'makanakyGaaaa',name:'Gaaaa',damageType:'special',status:'planned'}
 ]
},
roles:{cristorata:['Hostigador móvil','Ida y vuelta perforante.','Poca vida; depende del retorno.'],cuy:['Tanque de área','Mucha vida y empuje circular.','Lento y de corto alcance.'],paloma:['Exploradora','Gran movilidad y abanico amplio.','Muy poca vida; dispersa impactos.'],alan:['Control frontal','Cono contra grupos.','Lento y dependiente de la orientación.'],alberto:['Defensa orbital','Bandas que cubren el entorno.','Necesita acercarse; cobertura discontinua.'],keiko:['Hostigadora de retorno','Abanico que atraviesa y regresa.','Recarga larga; depende del retorno.'],ollanta:['Vanguardia','Buena vida y cono frontal.','Movilidad moderada y alcance corto.'],kingteka:['Escopetero cercano','Descarga contra grupos cercanos.','Pierde daño lejos y al concentrar perdigones.'],shaka:['Control de pasillos','Dos bumeranes y buena vida.','Lento; necesita alinear el retorno.'],najasor:['Tirador móvil','Tres pescados y alta velocidad.','Poca vida y disparos dispersos.'],cirilo:['UR de riesgo progresivo','Vómito tóxico, ralentización, resurrección y dominio.','Recibe 10% más daño y debe llegar a nivel 20.'],fuzo:['Perforador de filas','Dos tarjetas contra hasta tres rivales cada una.','Necesita alinear enemigos.'],charles:['Control de zonas','Nubes que castigan grupos.','Recarga larga; los rivales pueden salir de la nube.'],axelbenba:['Tirador de abanico','Tres proyectiles y buena movilidad.','Poca vida; dispersa impactos.'],sustento:['Tirador de cadencia','Recarga corta para mantener presión.','Poco daño por impacto y vida limitada.'],cevichero:['Hostigador de enjambre','Dos proyectiles zigzagueantes.','El zigzag dificulta concentrar impactos.'],g5:['Luchadora móvil','Golpe fuerte en arco amplio.','Debe entrar a distancia cuerpo a cuerpo.']},
label(group,key){return this.taxonomies[group]?.[key]||key||'—'},
weaponSlots(c){const explicit=this.weaponKits[c.id];if(explicit)return explicit.map(slot=>({...slot}));const attack=P.Data.attacks[c.attack]||{};return [{id:c.attack,name:attack.name||'Ataque principal',damageType:attack.damageType||c.combatStats?.damageType||'physical',status:'implemented'},{id:null,name:'Ataque 2 por definir',damageType:null,status:'reserved'},{id:null,name:'Ataque 3 por definir',damageType:null,status:'reserved'}]},
kitAudit(c){const attacks=this.weaponSlots(c),ultimate=P.AbilityCards?.definition?.(c.id,'ultimate')||null,domain=P.AbilityCards?.definition?.(c.id,'domain')||null,passive=P.Passives?.definition?.(c)||null;return {attacks,implementedAttacks:attacks.filter(slot=>slot.status==='implemented').length,plannedAttacks:attacks.filter(slot=>slot.status==='planned').length,ultimate,domain,passive,complete:attacks.every(slot=>slot.status==='implemented')}},
identity(c){const raw=this.identities[c.id]||{role:'specialist',secondaryRole:null,species:'human',range:'mixed',damage:c.combatStats?.damageType||'physical',tags:[],difficulty:'intermediate'};return {...raw,roleLabel:this.label('roles',raw.role),secondaryRoleLabel:raw.secondaryRole?this.label('roles',raw.secondaryRole):null,speciesLabel:this.label('species',raw.species),rangeLabel:this.label('ranges',raw.range),damageLabel:this.label('damage',raw.damage),difficultyLabel:this.label('difficulties',raw.difficulty),tagLabels:raw.tags.map(tag=>this.label('functions',tag))}},
identityRows(c){const identity=this.identity(c),stats=P.Attributes?.character?.(c)||c.combatStats||{},attribute=P.Attributes?.names?.[stats.attribute]||stats.attribute||'—',channel=stats.damageType==='special'?'Especial':'Físico';return [['Raza',identity.speciesLabel],['Atributo',attribute],['Canal principal',channel],['Rol',identity.roleLabel],['Rol secundario',identity.secondaryRoleLabel||'—'],['Alcance',identity.rangeLabel],['Daño del kit',identity.damageLabel],['Dificultad',identity.difficultyLabel],['Etiquetas',identity.tagLabels.join(' · ')||'—']]},
base(c){const a=P.Data.attacks[c.attack],projectile=['spread','boomerang'].includes(a.kind),identity=this.identity(c),copy=this.roles[c.id]||['Especialidad por definir','Ataque característico.','Sin analizar.'];return {hp:c.hp,speed:c.speed,damage:c.power*(a.powerScale||1)*(c.id==='chamelin'?(a.damageScale||1):1),cooldown:a.cooldown,range:a.range,count:a.kind==='orbit'?3:projectile?(a.count||(c.attack==='feathers'?5:a.kind==='spread'?3:1)):null,pierce:a.kind==='boomerang'?'Sin límite por trayecto':projectile?(a.pierce||1):null,role:identity.roleLabel,secondaryRole:identity.secondaryRoleLabel,roleDisplay:identity.roleLabel+(identity.secondaryRoleLabel?' / '+identity.secondaryRoleLabel:''),species:identity.speciesLabel,rangeClass:identity.rangeLabel,damageClass:identity.damageLabel,tags:identity.tagLabels,difficulty:identity.difficultyLabel,specialty:copy[0],strength:copy[1],weakness:copy[2]}},
rows(c){const v=this.base(c),a=P.Data.attacks[c.attack],n=x=>Number(x.toFixed(2));return [['Vida',v.hp],['Velocidad',v.speed+' u/s'],[a.kind==='orbit'?'Daño por contacto':'Daño por impacto',n(v.damage)],['Recarga',n(v.cooldown)+' s'],[a.kind==='orbit'?'Radio orbital':'Alcance nominal',v.range+' u'],...(v.count?[['Proyectiles / bandas',v.count]]:[]),...(v.pierce?[['Objetivos por proyectil',v.pierce]]:[]),...(P.Stats?.channelRows?.(c)||[]),...(P.Stats?.advancedRows?.(c)||[])]},
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
{id:'sustento',name:'Sustento',category:'Streamer · parodia',look:'headset',atlas:'powers',spriteRow:3,color:'#a4c492',skinTone:'#caa07f',hp:105,speed:190,power:12,attack:'roachRifle'},
{id:'cevichero',name:'Cevichero',category:'Disfraz · parodia',look:'headset',atlas:'powers',spriteRow:7,color:'#6ea9f2',skinTone:'#d1a080',hp:115,speed:190,power:24,attack:'roachCast'},
{id:'g5',name:'La G5',category:'Luchadora · avatar',look:'cap',atlas:'powers',spriteRow:8,color:'#8bc6ed',skinTone:'#dbad8f',hp:145,speed:210,power:42,attack:'g5Kick'}
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
P.Data.characters.push({id:'makanaky',name:'Makanaky · La Realeza',category:'Streamer · parodia',look:'headset',atlas:'makanaky',spriteRow:0,color:'#ef92cf',skinTone:'#cb976d',hp:125,speed:200,power:32,attack:'royalEcho'});
P.CharacterProfiles.roles.makanaky=['Luchador de presión','Puños rápidos contra grupos cercanos.','Necesita acercarse y aprovechar el agotamiento de los minijefes.'];
P.Data.attacks.sideralFear={name:'Mirada Sideral',description:'Una mueca exagerada aterra a los minions en un cono frontal.',kind:'cone',cooldown:1.35,range:270,arc:1.55,powerScale:.42,push:8,fear:true,fearDuration:.9,fearCooldown:2.5,glyph:'!'};
P.Data.characters.push({id:'sideral',name:'Sideral · Espantaminions',category:'Streamer · parodia',look:'headset',atlas:'sideral',spriteRow:0,color:'#ff465f',skinTone:'#d99368',hp:120,speed:195,power:27,attack:'sideralFear'});
P.CharacterProfiles.roles.sideral=['Control UR','Hace huir a los minions en un cono frontal.','El mismo rival resiste nuevos sustos durante 2,5 s.'];

Object.assign(P.Data.attacks.pigShotgun,{cooldown:.72,powerScale:.56,falloff:{near:165,min:.35}});
Object.assign(P.Data.attacks.g5Kick,{cooldown:.68});

P.Data.attacks.trovoShot={name:'Retaguardia de Trovo',description:'Impacto ligero (15 %); charcos de 4 s con daño especial continuo y ralentización 20 % (10 % a jefes), sin reducir defensas.',kind:'spread',cooldown:.8,range:420,count:1,speed:310,damageScale:.15,glyph:'POOP',color:'#a87543',damageType:'special'};
P.Data.characters.push({id:'chamelin',name:'Chamelín Trovo',category:'Streamer · parodia',look:'chullo',atlas:'chamelin',spriteRow:0,color:'#5097cf',skinTone:'#d49b70',hp:125,speed:185,power:28,attack:'trovoShot'});
P.CharacterProfiles.roles.chamelin=['Control de zonas UR','Poco impacto; charcos de daño continuo y ralentización.','Movilidad moderada y daño gradual.'];
