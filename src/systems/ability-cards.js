'use strict';
// Registry for character-specific ability cards. Add a static art path here when
// a new character receives a Q ultimate or R domain; unknown skills keep a grey slot.
P.AbilityCards={
 entries:{
  kingteka:{kind:'ultimate',art:'assets/cards/kingteka-gallinazo-ultimate-fullart-v2.webp'},
  alberto:{kind:'ultimate',art:'assets/cards/alberto-tribunal-ultimate-fullart-v1.webp'},
  cristorata:{kind:'ultimate',art:'assets/cards/cristorata-dragon-ultimate-fullart-v1.webp'},
  cuy:{kind:'ultimate',art:'assets/cards/cuy-stampede-ultimate-fullart-v1.webp'},
  paloma:{kind:'ultimate',art:'assets/cards/paloma-bandada-ultimate-fullart-v1.webp'},
  makanaky:{kind:'domain',state:'domain',label:'DOMINIO',art:'assets/cards/makanaky-domain-fullart-v1.webp'},
  sideral:{kind:'domain',state:'sideralDomain',label:'DOMINIO',art:'assets/cards/sideral-domain-fullart-v1.webp'},
  chamelin:{kind:'domain',state:'chamelinDomain',label:'BAÑO DE TROVO',art:'assets/cards/chamelin-domain-fullart-v1.webp'}
 },
 definition(id,kind){const entry=this.entries[id];return entry&&(!kind||entry.kind===kind)?entry:null},
 apply(button,id,kind,charge,ready=false,active=false){
  if(!button)return;const entry=this.definition(id,kind),empty=id==='empty'||!entry;
  button.dataset.cardArt=empty?'empty':id;button.dataset.abilityKind=kind;
  button.style?.setProperty?.('--charge-progress',Math.max(0,Math.min(100,charge||0))+'%');
  button.style?.setProperty?.('--ability-card-art',entry?'url("/'+entry.art+'")':'none');
  button.classList.toggle('ability-ready',!!ready);button.classList.toggle('ability-active',!!active);
 },
 hud(){
  const b=P.$('#domain-ability'),s=P.state,id=s.player?.id,entry=this.definition(id,'domain');if(!b)return;
  const charge=Math.max(0,Math.min(100,s.ultimate?.charge||0)),active=!!(entry&&s[entry.state]);
  const waiting=!!entry&&(id==='makanaky'&&typeof Image!=='undefined'&&P.DomainIntro&&!P.DomainIntro.ready&&!P.DomainIntro.failed||id==='sideral'&&!P.SideralDomain?.artReady?.()&&!P.SideralDomain?.failed);
  b.hidden=s.mode!=='play';b.disabled=!entry||active||charge<100||!!waiting;
  this.apply(b,entry?id:'empty','domain',charge,!!entry&&charge>=100&&!active&&!waiting,active);
  b.setAttribute('aria-label',entry?'Expansión de dominio · tecla R':'Espacio reservado para expansión de dominio · tecla R');
  P.UI.write(b,!entry?'R · EXPANSIÓN · PRÓXIMAMENTE':waiting?'R · CARGANDO ARTE':active?'R · '+entry.label+' EN CURSO':'R · '+entry.label+' '+Math.floor(charge)+'%');
 }
};
{const hud=P.UI.hud;P.UI.hud=function(...args){const result=hud.apply(this,args);P.AbilityCards.hud();return result}}
