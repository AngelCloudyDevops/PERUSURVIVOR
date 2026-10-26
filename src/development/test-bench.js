'use strict';
// Un único panel para cambiar de prueba sin navegar por el vestíbulo.
P.TestBench={
active:false,switching:false,kind:'targets',character:'kingteka',map:'campo',boss:'campo',attack:'1',
init(){
 if(typeof Image==='undefined')return;
 const settings=P.$('#lobby-settings')||P.$('.roster');this.home=settings;
 const panel=document.createElement('section');panel.id='test-bench';panel.setAttribute('aria-label','Laboratorio de pruebas');
 panel.innerHTML='<div class="bench-heading"><div><small>PRUEBA SIN ESPERAS</small><h3>Laboratorio de combate</h3></div><button id="bench-collapse" type="button" aria-expanded="true">Minimizar</button></div><p class="bench-intro">Cambia de causa, escenario o rival y vuelve a probar desde aquí. Sin gastar objetos ni modificar tu progreso.</p><div id="bench-options"><div class="bench-selects"><label>Causa<select id="bench-character"></select></label><label>Prueba<select id="bench-kind"><option value="targets">Ataques y ulti · Objetivos</option><option value="boss">Combate contra jefe</option></select></label><label id="bench-map-label">Escenario<select id="bench-map"></select></label><label id="bench-boss-label" hidden>Rival<select id="bench-boss"></select></label><label>Arma principal<select id="bench-attack"><option value="1">Base · Rango 1</option><option value="2">Mejorado · Rango 2</option><option value="3">Mejorado · Rango 3</option><option value="4">Mejorado · Rango 4</option><option value="5">Máximo · Rango 5</option><option value="evolved">★ Evolución</option></select></label></div><p id="bench-attack-info" aria-live="polite"></p><div class="bench-toggles"><label><input id="bench-invincible" type="checkbox" checked> Invencible</label><label><input id="bench-auto" type="checkbox" checked> Recarga automática de ulti</label></div><div class="bench-actions"><button id="bench-start" type="button">Entrar a la prueba ↗</button><button id="bench-cast" type="button">Lanzar ulti · Q</button><button id="bench-targets" type="button">Reponer objetivos</button><button id="bench-training-boss" type="button" hidden>Volver a invocar jefe</button><button id="bench-heal" type="button">Curar</button><button id="bench-boss-ulti" type="button">Ulti del Gallinazo</button><button id="bench-exit" type="button">Volver a ajustes</button></div></div><p id="bench-training-status" hidden></p><p id="bench-status" role="status" aria-live="polite">Elige una prueba para empezar.</p>';
 settings.append(panel);this.panel=panel;
 // Las flechas y letras de los selectores no deben mover al jugador ni abrir portales.
 for(const event of ['keydown','keyup'])panel.addEventListener(event,e=>{if(['SELECT','INPUT'].includes(e.target.tagName))e.stopPropagation()});
 const options=(id,items)=>{const select=P.$(id);for(const [value,name] of items){const o=document.createElement('option');o.value=value;o.textContent=name;select.append(o)}};
 options('#bench-character',P.Data.characters.map(c=>[c.id,c.name]));options('#bench-map',P.Maps.catalog.map(m=>[m.id,m.name]));options('#bench-boss',Array.from(P.$('#lab-boss').options).map(o=>[o.value,o.textContent]));
 for(const key of ['character','kind','map','boss','attack']){P.$('#bench-'+key).value=this[key];P.$('#bench-'+key).onchange=()=>{this[key]=P.$('#bench-'+key).value;this.controls();if(this.active)this.run()}};
 P.$('#bench-start').onclick=()=>this.run();P.$('#bench-cast').onclick=()=>{P.Audio.unlock();P.Ultimate.activate();this.hud()};P.$('#bench-targets').onclick=()=>P.Practice.targets();P.$('#bench-heal').onclick=()=>{P.state.player.hp=P.state.player.maxHp};P.$('#bench-boss-ulti').onclick=()=>P.$('#lab-ultimate').click();P.$('#bench-exit').onclick=()=>this.exit();
 P.$('#bench-training-boss').onclick=()=>P.Practice.summonBoss();
 P.$('#bench-invincible').onchange=()=>{P.$('#lab-invincible').checked=P.$('#bench-invincible').checked};
 P.$('#bench-collapse').onclick=()=>{const options=P.$('#bench-options');options.hidden=!options.hidden;P.$('#bench-collapse').textContent=options.hidden?'Expandir':'Minimizar';P.$('#bench-collapse').setAttribute('aria-expanded',String(!options.hidden))};
 // Mantener los controles originales para compatibilidad, con una sola entrada visible.
 P.$('#dev-lab').hidden=true;for(const entry of document.querySelectorAll('.practice-entry'))entry.hidden=true;
 const perf=document.createElement('details');perf.className='bench-performance';const summary=document.createElement('summary');summary.textContent='Rendimiento y FPS';perf.append(summary,P.$('.performance-settings'));settings.append(perf);
 this.controls();this.hud();
},
controls(){if(!this.panel)return;this.describeAttack();P.$('#bench-map-label').hidden=this.kind!=='targets';P.$('#bench-boss-label').hidden=this.kind!=='boss';P.$('#bench-invincible').disabled=this.kind==='targets';P.$('#bench-options').hidden=false;P.$('#bench-collapse').textContent='Minimizar';P.$('#bench-collapse').setAttribute('aria-expanded','true')},
run(){
 if(P.WalkArt&&!P.WalkArt.readyForStart()){P.WalkArt.waitForStart(()=>this.run());return}
 this.active=true;this.switching=true;
 try{P.$('#lab-invincible').checked=this.panel?P.$('#bench-invincible').checked:true;
  if(this.kind==='targets'){P.UI.menu();P.Maps.select(this.map);P.Practice.start(this.character)}
  else{P.UI.select(P.Data.characters.findIndex(c=>c.id===this.character));P.$('#lab-boss').value=this.boss;P.Lab.run()}
 }finally{this.switching=false}
 if(this.panel){document.body.append(this.panel);this.panel.classList.add('bench-live');document.body.classList.add('test-bench-live')}
 this.applyAttack();P.UI.hud();
},
attackFixture(){
 const c=P.Data.characters.find(c=>c.id===this.character),p=P.Entities.player(c);P.Progression.init(p);
 const rank=this.attack==='evolved'?5:Math.max(1,Math.min(5,Number(this.attack)||1));
 for(let i=1;i<rank;i++)P.Progression.apply(p,'primary');
 if(this.attack==='evolved')P.Progression.apply(p,'evolve:primary');
 return p;
},
describeAttack(){
 const p=this.attackFixture(),evolved=!!p.evolved.primary,v=P.Evolutions.profile(p),a=P.Data.attacks[p.attack];
 P.$('#bench-attack option[value="evolved"]').textContent='★ '+v.name+' · Evolución';
 P.UI.write(P.$('#bench-attack-info'),(evolved?v.name:a.name)+' · '+(evolved?'Evolución':('Rango '+p.powerRanks.primary+'/5'))+' · Daño '+Math.round(p.power*100)/100+' · Ataque cada '+p.rate.toFixed(2)+' s · Alcance ×'+p.reach.toFixed(2)+'\n'+(evolved?v.description:'Mejoras reales del arma. Cambia de rango para comparar; no necesitas subir de nivel.'));
},
applyAttack(){
 const s=P.state,p=s.player;
 if(!this.active||!s.devRun||P.Coop?.active||s.mode!=='play'||p?.id!==this.character)return;
 if(this.appliedPlayer===p&&this.appliedAttack===this.attack)return;
 const fixture=this.attackFixture();
 // Reconstruir desde la base evita acumular multiplicadores al volver de evolución a base.
 for(const key of ['power','reach','rate','projectileBonus','primaryPierce','evolutionBaseBonus']){if(fixture[key]===undefined)delete p[key];else p[key]=fixture[key]}
 P.Progression.init(p);p.powerRanks.primary=fixture.powerRanks.primary;p.evolved.primary=!!fixture.evolved.primary;
 this.appliedPlayer=p;this.appliedAttack=this.attack;
},
exit(){this.active=false;P.UI.menu();P.Lobby?.show('settings');this.hud()},
stop(){if(this.switching)return;this.active=false;if(this.panel){this.home.append(this.panel);this.panel.classList.remove('bench-live');document.body.classList.remove('test-bench-live')}this.hud()},
tick(){if(!this.active||!P.state.devRun||P.state.mode!=='play')return;this.applyAttack();const s=P.state;if((!this.panel||P.$('#bench-auto').checked)&&s.ultimate&&!s.ultimate.left&&!s.ultimate.paper&&!s.ultimate.animal?.finish&&!s.court)s.ultimate.charge=100},
hud(){if(!this.panel)return;const s=P.state,live=this.active&&s.devRun,supported=(['kingteka','alberto'].includes(s.player?.id)||!!P.AnimalUltimate?.definition()),busy=!!(s.ultimate?.left||s.ultimate?.paper||s.ultimate?.animal?.finish||s.court);
 if(live){P.$('#lab-tools').hidden=true;P.$('#practice-tools').hidden=true}
 this.panel.hidden=live&&s.mode==='pause';P.$('#bench-collapse').hidden=!live;
 P.$('#bench-start').textContent=live?'↻ Repetir prueba':'Entrar a la prueba ↗';
 for(const id of ['cast','targets','heal','boss-ulti','exit'])P.$('#bench-'+id).hidden=!live;
 P.$('#bench-cast').hidden=!live||!supported;P.$('#bench-cast').disabled=s.mode!=='play'||busy||(s.ultimate?.charge||0)<100;
 P.$('#bench-targets').hidden=!live||!s.practice;P.$('#bench-targets').disabled=s.mode!=='play'||busy;
 const training=live&&s.practice&&s.player?.id==='alberto';P.$('#bench-training-boss').hidden=!training;P.$('#bench-training-boss').disabled=s.mode!=='play'||!!s.court;P.$('#bench-training-status').hidden=!training;if(training)P.UI.write(P.$('#bench-training-status'),P.$('#practice-boss-status').textContent);
 P.$('#bench-heal').hidden=!live||!!s.practice;P.$('#bench-heal').disabled=s.mode!=='play';
 P.$('#bench-boss-ulti').hidden=!live||!P.VultureUltimate.boss();P.$('#bench-boss-ulti').disabled=s.mode!=='play'||P.$('#lab-ultimate').disabled;
 P.UI.write(P.$('#bench-status'),!live?'18 causas · Objetivos y jefes · Sin récords':s.mode==='end'?'Prueba terminada. Repite o cambia cualquier selector.':busy?'Ulti en curso · Puedes repetir o cambiar de prueba.':supported?'Ulti lista al recargarse · Q o Lanzar ulti · WASD para moverte':'Ataque automático · Cambia de causa o rival sin volver al menú.');
}
};
{const hud=P.UI.hud,menu=P.UI.menu,update=P.Game.update,start=P.Game.start,finish=P.Lab.finish;
P.Lab.open=function(){P.UI.menu();P.TestBench.kind='boss';if(P.TestBench.panel){P.$('#bench-kind').value='boss';P.TestBench.controls();P.Lobby?.show('settings');P.$('#bench-boss').focus()}};
P.Lab.finish=function(win){if(!P.TestBench.active)return finish.call(this,win);P.state.mode='end';P.UI.hud();P.UI.show(win?'Prueba completada':'Fin de la prueba','Repite o cambia de rival desde el laboratorio. Sin récords.',[{title:'Repetir prueba ↗',action:()=>P.TestBench.run()},{title:'Cambiar de rival',action:()=>{P.$('#overlay').hidden=true;P.TestBench.controls();P.$('#bench-boss').focus()}},{title:'Volver a ajustes',action:()=>P.TestBench.exit()}])};
P.UI.hud=function(...a){const result=hud.apply(this,a);P.TestBench.hud();return result};
P.UI.menu=function(...a){P.TestBench.stop();return menu.apply(this,a)};
P.Game.start=function(...a){if(!P.TestBench.switching)P.TestBench.stop();return start.apply(this,a)};
P.Game.update=function(dt){P.TestBench.tick();return update.call(this,dt)};
P.TestBench.init();}
