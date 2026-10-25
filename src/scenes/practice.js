'use strict';
// Modo de práctica público solicitado: aislado del récord y la progresión.
P.Practice={
init(){P.$('#practice-start').onclick=()=>this.start();P.$('#practice-recharge').onclick=()=>this.recharge();P.$('#practice-targets').onclick=()=>this.targets();P.$('#practice-exit').onclick=()=>P.UI.menu()},
start(){P.UI.menu();P.UI.select(P.Data.characters.findIndex(c=>c.id==='kingteka'));P.Game.start();const s=P.state;s.practice=true;s.devRun=true;s.ultimate.charge=100;this.targets();P.Core.clear();P.Core.canvas.setAttribute('aria-label','Práctica de Kingteka: gallinazos y sonidos');P.UI.hud()},
recharge(){const s=P.state;if(!s.practice||s.mode!=='play')return;s.ultimate.charge=100;P.Ultimate.hud();P.$('#practice-info').textContent=s.ultimate.left>0?'Recarga preparada. Espera el sello y vuelve a pulsar Q.':'Ulti lista: pulsa Q o el botón de ulti.'},
targets(){const s=P.state;if(!s.practice)return;s.shots=[];s.fields=[];s.enemies=Array.from({length:8},(_,i)=>{const a=i*Math.PI/4,e=P.Entities.enemy();e.x=s.player.x+Math.cos(a)*140;e.y=s.player.y+Math.sin(a)*140;P.Terrain.resolve(e,{x:s.player.x,y:s.player.y},e.r);return Object.assign(e,{hp:999999,max:999999,speed:0,practiceX:e.x,practiceY:e.y})})},
update(dt){const s=P.state;if(s.mode!=='play')return;s.elapsed+=dt;s.player.inv=1;s.player.hp=s.player.maxHp;P.Ultimate.tick(dt);P.Chunks.sync();for(const e of s.enemies){e.x=e.practiceX;e.y=e.practiceY;e.hp=e.max}P.Systems.move(dt);P.Combat.tick(dt);for(const fx of s.effects)fx.life-=dt;s.effects=s.effects.filter(fx=>fx.life>0);s.gems=[];s.danger=[];P.UI.hud()},
hud(){const s=P.state;P.$('#practice-tools').hidden=!s.practice||s.mode!=='play';if(!s.practice)return;P.$('#lab-tools').hidden=true;P.$('#level').textContent='PRÁCTICA KINGTEKA · INVENCIBLE · SIN RÉCORDS';P.$('#time').textContent='PRÁCTICA';P.$('#portal-status').textContent='';P.$('#portal-enter').hidden=true;P.$('#hint').textContent='Q: ULTI · RECARGA GRATIS · WASD / FLECHAS PARA MOVERTE'},
hide(){P.state.practice=false;P.$('#practice-tools').hidden=true}
};
