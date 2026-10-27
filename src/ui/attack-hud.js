'use strict';
// Contrato visual común: tres slots de ataque para todo el roster, sin inventar habilidades.
P.AttackHud={
 slots(p){
  if(!p)return[];
  if(p.id==='kingteka'){
   const arsenal=P.KingtekaArsenal,state=arsenal.init(p);
   return arsenal.order.map((id,i)=>({id,name:arsenal.names[id],rank:state.ranks[id]||0,active:state.active===id,locked:!state.unlocked[id],switchable:true,key:i+1,evolved:!!state.evolved[id]}));
  }
  const character=P.Data.characters.find(c=>c.id===p.id)||p,profile=P.Data.attacks[p.attack||character.attack],evolved=!!p.evolved?.primary,name=evolved?(P.Evolutions?.profile?.(character)?.name||profile?.name):profile?.name;
  return [
   {id:'primary',name:name||'Ataque principal',rank:p.powerRanks?.primary||1,active:true,locked:false,switchable:false,key:1,evolved},
   {id:'reserve-2',name:'RESERVA',rank:0,active:false,locked:true,switchable:false,key:2,evolved:false},
   {id:'reserve-3',name:'RESERVA',rank:0,active:false,locked:true,switchable:false,key:3,evolved:false}
  ];
 },
 hud(p){let bar=P.$('#weapon-bar');if(!bar&&typeof document!=='undefined'){bar=document.createElement('div');bar.id='weapon-bar';bar.setAttribute('aria-label','Ataques del personaje');document.body.append(bar)}if(!bar)return;const show=!!p&&['play','pause','upgrade'].includes(P.state.mode);bar.hidden=!show;if(!show)return;const slots=this.slots(p),signature=p.id+'|'+slots.map(slot=>[slot.id,slot.name,slot.rank,slot.active,slot.locked,slot.evolved].join(':')).join('|');if(bar.dataset.signature===signature)return;bar.dataset.signature=signature;bar.replaceChildren();slots.forEach(slot=>{const button=document.createElement('button');button.type='button';button.disabled=slot.locked;button.dataset.active=String(slot.active);button.dataset.locked=String(slot.locked);button.dataset.slot=String(slot.key);button.setAttribute('aria-pressed',String(slot.active));const suffix=slot.locked?'':(' R'+slot.rank+(slot.evolved?' ★':''));button.textContent=slot.key+' · '+slot.name+suffix;button.title=slot.locked?'Slot '+slot.key+' reservado para una futura variante de ataque':slot.switchable?'Tecla '+slot.key+' para cambiar a '+slot.name:'Ataque principal activo';button.setAttribute('aria-label',slot.locked?'Ataque '+slot.key+': reserva sin variante disponible':'Ataque '+slot.key+': '+slot.name+', rango '+slot.rank+(slot.active?', activo':''));if(slot.switchable&&!slot.locked)button.onclick=()=>P.KingtekaArsenal.request(slot.key);bar.append(button)})}
};
