'use strict';
// Laboratorio solicitado por el usuario. Las pruebas no guardan récords.
P.Lab={
boss:'campo',
init(){P.$('#lab-start').onclick=()=>this.run();P.$('#lab-repeat').onclick=()=>this.run();P.$('#lab-change').onclick=()=>this.open();P.$('#lab-heal').onclick=()=>{if(P.state.devRun)P.state.player.hp=P.state.player.maxHp};P.$('#lab-exit').onclick=()=>P.UI.menu();P.$('#lab-invincible').checked=true},
open(){P.UI.menu();P.$('#dev-lab').open=true;P.$('#lab-boss').focus()},
run(){this.boss=P.$('#lab-boss').value||this.boss;P.UI.menu();if(this.boss!=='final')P.Maps.select(this.boss);P.Game.start();const s=P.state;s.devRun=true;P.Core.canvas.setAttribute('aria-label','Prueba de jefe: '+(this.boss==='final'?'ElZeein':P.Encounters.definition().name));s.enemies=[];s.gems=[];s.shots=[];s.danger=[];
if(this.boss==='final'){s.mapTime=P.Data.arena.duration;s.bossSpawned=true;const boss=P.Entities.enemy(true);boss.x=s.player.x-180;boss.y=s.player.y-120;s.enemies=[boss]}
else{s.mapTime=P.Encounters.unlock;P.Encounters.tick();const point=P.Encounters.definition().portal;s.player.x=point.x;s.player.y=point.y;s.mode='portal';P.Encounters.enter()}
P.Core.clear();this.tick();P.UI.hud();P.$('#hint').textContent='DESARROLLO · PRUEBA AISLADA · SIN RÉCORDS'
},
tick(){if(P.state.devRun&&P.$('#lab-invincible').checked)P.state.player.inv=1},
hud(){const s=P.state;P.$('#lab-tools').hidden=!s.devRun||s.mode!=='play';if(s.devRun)P.$('#level').textContent='DESARROLLO · '+(this.boss==='final'?'ELZEEIN':P.Encounters.definition().name)+' · SIN RÉCORDS'},
hide(){P.state.devRun=false;P.$('#lab-tools').hidden=true},
finish(win){const s=P.state;s.mode='end';P.UI.hud();P.UI.show(win?'Prueba completada':'Fin de la prueba','Modo de desarrollo: esta partida no modifica tu récord.',[{title:'Repetir este jefe ↗',action:()=>this.run()},{title:'Elegir otro jefe',action:()=>this.open()},{title:'Volver al menú',action:()=>P.UI.menu()}])}
};