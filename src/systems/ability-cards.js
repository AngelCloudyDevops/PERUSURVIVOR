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
  makanaky:{kind:'domain',art:'assets/cards/makanaky-domain-fullart-v1.webp'},
  sideral:{kind:'domain',art:'assets/cards/sideral-domain-fullart-v1.webp'},
  chamelin:{kind:'domain',art:'assets/cards/chamelin-domain-fullart-v1.webp'}
 },
 definition(id,kind){const entry=this.entries[id];return entry&&(!kind||entry.kind===kind)?entry:null},
 apply(button,id,kind,charge,ready=false,active=false){
  if(!button)return;const entry=this.definition(id,kind),empty=id==='empty'||!entry;
  button.dataset.cardArt=empty?'empty':id;button.dataset.abilityKind=kind;
  button.style?.setProperty?.('--charge-progress',Math.max(0,Math.min(100,charge||0))+'%');
  button.style?.setProperty?.('--ability-card-art',entry?'url("/'+entry.art+'")':'none');
  button.classList.toggle('ability-ready',!!ready);button.classList.toggle('ability-active',!!active);
 }
};
