'use strict';
P.AbilityCards={
 frames:{
  none:{family:'empty',visual:'none'},
  fire:{family:'ultimate',visual:'fire'},
  'domain-demon':{family:'domain',visual:'demon'},
  'domain-royal':{family:'domain',visual:'fire',futureVisual:'royal'},
  'domain-cosmic':{family:'domain',visual:'fire',futureVisual:'cosmic'},
  'domain-steam':{family:'domain',visual:'fire',futureVisual:'steam'},
  'domain-nature':{family:'domain',visual:'fire',futureVisual:'nature'}
 },
 entries:{
  kingteka:{kind:'ultimate',frame:'fire',label:'GALLINAZOS',title:'Gallinazos',description:'Convierte a los rivales normales en gallinazos, cancela sus ataques y proyectiles y los arrastra hacia la ruta antes del impacto final. Jefes y minijefes resisten la transformación, pero reciben daño reducido.',details:[['Tecla','Q'],['Duración','8 s'],['Daño','Puro · daño fijo'],['Rivales normales','×2 de poder'],['Jefes y minijefes','×1.2 de poder'],['Control','Cancela ataques y proyectiles']],art:'assets/cards/kingteka-gallinazo-ultimate-fullart-v2.webp',variants:[{id:'cerdito-vtuber',edition:'Skin Cerdito VTuber',art:'assets/cards/cerdito-vtuber-ultimate-fullart-v1.webp'}]},
  kingtekaDomain:{characterId:'kingteka',kind:'domain',frame:'domain-nature',state:'kingtekaDomain',chargeField:'domainCharge',label:'SANTUARIO',title:'Santuario del Reino Animal',description:'Abre un santuario que lanza oleadas de daño especial y cura al equipo. Cada ataque adaptado de Instinto de expedición carga por separado esta expansión.',details:[['Tecla','R'],['Duración','9 s'],['Radio','520 u'],['Daño','Especial · fijo'],['Oleadas','Cada 1.25 s'],['Curación','2.2 % por oleada · 5.5 % final'],['Carga','+8 por ataque adaptado']],art:'assets/cards/kingteka-nature-domain-fullart-v1.webp'},
  alberto:{kind:'ultimate',frame:'fire',label:'TRIBUNAL',title:'Tribunal del Pueblo',description:'Condena a los rivales comunes dentro del tribunal. Los jefes sobreviven, pierden una parte limitada de su vida y quedan vulnerables; los aliados reciben protección temporal.',details:[['Tecla','Q'],['Duración','4.7 s'],['Radio','340 u'],['Rivales normales','Ejecución'],['Jefes y minijefes','8 % de vida · máximo 200'],['Vulnerabilidad','20 % durante 5 s'],['Equipo','Escudo durante 3 s']],art:'assets/cards/alberto-tribunal-ultimate-fullart-v1.webp'},
  cristorata:{kind:'ultimate',frame:'fire',label:'DRAGÓN',title:'Invocación de dragón',description:'Invoca durante ocho segundos un dragón de Jade, Brasa o Trueno que ataca con daño especial. Existe una posibilidad secreta de obtener al dragón Tricéfalo.',details:[['Tecla','Q'],['Duración','8 s'],['Daño','Especial'],['Cadencia','4 ataques/s'],['Variantes','Jade · Brasa · Trueno'],['Secreto','Tricéfalo · 5 %']],art:'assets/cards/cristorata-dragon-ultimate-fullart-v1.webp'},
  cuy:{kind:'ultimate',frame:'fire',label:'ESTAMPIDA',title:'Estampida Suprema',description:'Doce cuyes rodean el área y golpean por pulsos mientras Cuy Supremo recibe menos daño. Funciona como control cercano y ventana defensiva.',details:[['Tecla','Q'],['Duración','5 s'],['Invocaciones','12 cuyes'],['Radio','200 u'],['Pulso','Cada 0.5 s'],['Defensa propia','50 % menos daño']],art:'assets/cards/cuy-stampede-ultimate-fullart-v1.webp'},
  paloma:{kind:'ultimate',frame:'fire',label:'BANDADA',title:'Bandada del Centro',description:'Invoca doce palomas que sobrevuelan la zona y se lanzan sobre objetivos cercanos, combinando impactos dirigidos y daño de área.',details:[['Tecla','Q'],['Duración','6 s'],['Invocaciones','12 palomas'],['Radio','270 u'],['Pulso','Cada 0.6 s'],['Daño','Impacto dirigido y área']],art:'assets/cards/paloma-bandada-ultimate-fullart-v1.webp'},
  makanakyUltimate:{characterId:'makanaky',kind:'ultimate',frame:'fire',label:'LOS TRES',title:'Los Tres de la Realeza',description:'Encadena durante cuatro segundos las tres técnicas de Makanaky, cambiando de objetivo para repartir golpes, cabezazos y gritos Gaaaa sin consumir la carga del dominio.',details:[['Tecla','Q'],['Duración','4 s'],['Secuencia','Puño · Cabezazo · Gaaaa'],['Objetivos','Encadenados'],['Carga R','No se consume']],art:'assets/cards/makanaky-character-fullart-v1.webp'},
  makanaky:{kind:'domain',frame:'domain-royal',state:'domain',chargeField:'domainCharge',label:'DOMINIO',title:'La Realeza',description:'Makanaky entra en combate directo y remata rivales normales. Contra jefes y minijefes aplica golpes físicos limitados para conservar el equilibrio.',details:[['Tecla','R'],['Duración','9 s'],['Alcance de golpe','4.2 m'],['Cadencia','Cada 0.4 s'],['Rivales normales','Remate'],['Jefes y minijefes','Hasta ×4 · máximo 140']],art:'assets/cards/makanaky-domain-fullart-v1.webp'},
  sideral:{kind:'domain',frame:'domain-cosmic',state:'sideralDomain',label:'DOMINIO',title:'Vacío Sideral',description:'Desata ondas de miedo que obligan a los rivales comunes a huir. Chocar contra los límites les quita vida; jefes y minijefes resisten el miedo.',details:[['Tecla','R'],['Duración','8 s'],['Onda de miedo','Cada 1.15 s'],['Choque','8 % de vida'],['Límite','3 choques por rival'],['Jefes y minijefes','Inmunes al miedo']],art:'assets/cards/sideral-domain-fullart-v1.webp'},
  cirilo:{kind:'domain',frame:'domain-demon',state:'ciriloDomain',label:'AUDIENCIA',title:'Audiencia del Demonio',description:'Cirilo adopta su forma demoníaca y golpea el área con martillazos especiales. Gana movilidad durante la audiencia, pero conserva su debilidad de recibir más daño.',details:[['Tecla','R'],['Duración','9 s'],['Radio','260 u'],['Daño','Especial · 35 % de poder'],['Martillazo','Cada 3 s'],['Movilidad','×1.5 tras el primer golpe'],['Riesgo','Recibe 10 % más daño']],art:'assets/cards/cirilo-audiencia-domain-fullart-v1.webp'},
  chamelin:{kind:'domain',frame:'domain-steam',state:'chamelinDomain',label:'BAÑO DE TROVO',title:'Baño de Trovo',description:'Moja a los rivales con pulsos especiales que reducen sus defensas y velocidad. El mordisco final elimina rivales normales y causa daño escalado a amenazas mayores.',details:[['Tecla','R'],['Duración','8 s'],['Pulso','Cada 0.5 s'],['Daño de pulso','Especial · 30 % de poder'],['Debilitación','−20 % DEF física y especial'],['Ralentización','25 %'],['Mordisco final','Normal: ejecución · Mini: ×3 · Jefe: ×1.9']],art:'assets/cards/chamelin-domain-fullart-v1.webp'}
 },
 frame(name){return this.frames[name]||this.frames.none},
 definition(id,kind){const direct=this.entries[id],entry=kind==='ultimate'&&this.entries[id+'Ultimate']||kind==='domain'&&this.entries[id+'Domain']||direct;return entry&&(!kind||entry.kind===kind)?entry:null},
 charge(id,kind,ultimate=P.state.ultimate){const entry=this.definition(id,kind),field=entry?.chargeField||'charge';return Math.max(0,Math.min(100,ultimate?.[field]||0))},
 art(id,kind,character=P.state.player){const entry=this.definition(id,kind);if(!entry)return null;const skin=kind==='ultimate'&&P.CharacterSkins?.equipped?.(character);return skin?.ultimateArt||entry.art},
 syncReadyFx(){
  for(const [kind,id] of [['ultimate','ultimate'],['domain','domain-ability']]){const button=P.$('#'+id),slot=P.$('#'+kind+'-ability-slot');if(!slot)continue;const ready=!!button&&!button.hidden&&button.classList.contains('ability-ready'),wasReady=slot.classList.contains('is-ready'),theme=button?.dataset.frameTheme||'none',frame=this.frame(theme);slot.dataset.frameTheme=theme;slot.dataset.frameVisual=frame.visual;if(ready&&!wasReady){slot.classList.remove('is-extinguishing');slot.classList.add('is-ready','is-igniting')}else if(!ready&&wasReady){slot.classList.remove('is-ready','is-igniting');slot.classList.add('is-extinguishing')}}
 },
 apply(button,id,kind,charge,ready=false,active=false){
  if(!button)return;const entry=this.definition(id,kind),empty=id==='empty'||!entry,skin=!empty&&kind==='ultimate'&&P.CharacterSkins?.equipped?.(P.state.player),art=entry&&this.art(id,kind);
  const theme=empty?'none':entry.frame;button.dataset.cardArt=empty?'empty':skin?.id||id;button.dataset.abilityKind=kind;button.dataset.frameTheme=theme;button.dataset.frameVisual=this.frame(theme).visual;
  button.style?.setProperty?.('--charge-progress',Math.max(0,Math.min(100,charge||0))+'%');
  button.style?.setProperty?.('--ability-card-art',art?'url("/'+art+'")':'none');
  button.classList.toggle('ability-ready',!!ready);button.classList.toggle('ability-active',!!active);
  if(button.id==='ultimate'||button.id==='domain-ability')this.syncReadyFx();
 },
 hud(){
  const s=P.state,id=s.player?.id,ultimateCharge=this.charge(id,'ultimate');
  const ultimate=P.$('#ultimate');
  if(ultimate){const entry=this.definition(id,'ultimate'),active=(s.ultimate?.left||0)>0;ultimate.disabled=false;ultimate.setAttribute('aria-disabled',String(!entry||!s.ultimate||active||ultimateCharge<100))}
  const b=P.$('#domain-ability'),entry=this.definition(id,'domain');if(!b)return;
  const charge=this.charge(id,'domain'),active=!!(entry&&s[entry.state]);
  const waiting=!!entry&&(id==='makanaky'&&typeof Image!=='undefined'&&P.DomainIntro&&!P.DomainIntro.ready&&!P.DomainIntro.failed||id==='sideral'&&!P.SideralDomain?.artReady?.()&&!P.SideralDomain?.failed);
  b.hidden=s.mode!=='play';b.disabled=false;b.setAttribute('aria-disabled',String(!entry||active||charge<100||!!waiting));
  this.apply(b,entry?id:'empty','domain',charge,!!entry&&charge>=100&&!active&&!waiting,active);
  b.setAttribute('aria-label',entry?'Expansión de dominio · tecla R':'Espacio reservado para expansión de dominio · tecla R');
  P.UI.write(b,!entry?'R · EXPANSIÓN · PRÓXIMAMENTE':waiting?'R · CARGANDO ARTE':active?'R · '+entry.label+' EN CURSO':'R · '+entry.label+' '+Math.floor(charge)+'%');
 }
};
{const hud=P.UI.hud;P.UI.hud=function(...args){const result=hud.apply(this,args);P.AbilityCards.hud();return result}}
