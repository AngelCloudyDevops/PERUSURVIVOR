'use strict';
P.PlayerStatsDrawer={
 openState:false,
 playing(){return P.state?.mode==='play'&&!!P.state.player},
 mount(){
  let drawer=P.$('#player-stats-drawer');if(drawer)return drawer;
  drawer=document.createElement('aside');drawer.id='player-stats-drawer';drawer.setAttribute('aria-label','Estadísticas del personaje');drawer.setAttribute('aria-hidden','true');
  drawer.innerHTML='<div class="player-stats-scroll"><div class="player-stats-heading"><span>FICHA EN COMBATE</span><kbd>MANTÉN TAB</kbd></div><div id="player-stats-weapon"></div><div id="player-stats-core" class="player-stats-grid"></div><section><h2>CANALES DE COMBATE</h2><dl id="player-stats-channels"></dl></section><section><h2>STATS AVANZADOS</h2><dl id="player-stats-advanced"></dl></section><section><h2>ESTADOS ACTIVOS</h2><p id="player-stats-effects">Sin efectos temporales</p></section></div>';
  const button=document.createElement('button');button.id='player-stats-toggle';button.type='button';button.hidden=true;button.textContent='FICHA · TAB';button.setAttribute('aria-controls',drawer.id);button.setAttribute('aria-expanded','false');button.addEventListener('click',()=>this.open(!this.openState));
  document.body.append(drawer,button);return drawer
 },
 open(value){
  value=!!value&&this.playing();this.openState=value;
  document.body.classList.toggle('stats-drawer-open',value);
  const drawer=P.$('#player-stats-drawer'),button=P.$('#player-stats-toggle');
  drawer?.setAttribute('aria-hidden',String(!value));button?.setAttribute('aria-expanded',String(value));
  if(value)this.render()
 },
 row(label,value,title=''){
  const item=document.createElement('div'),name=document.createElement('span'),number=document.createElement('strong');
  name.textContent=label;number.textContent=String(value);if(title)item.title=title;item.append(name,number);return item
 },
 list(node,rows){
  if(!node)return;node.replaceChildren(...rows.flatMap(([label,value])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=String(value);return[dt,dd]}))
 },
 render(){
  const p=P.state.player;if(!p)return;
  const attack=P.Evolutions?.attack?.(p)||P.Data.attacks[p.attack]||{},damage=p.power*(attack.damageScale||attack.powerScale||1),range=(attack.range||0)*(p.reach||1),core=P.$('#player-stats-core'),weapon=P.$('#player-stats-weapon');
  if(weapon){weapon.replaceChildren();const label=document.createElement('small'),name=document.createElement('strong'),detail=document.createElement('span');label.textContent='ARMA ACTIVA';name.textContent=attack.name||attack.arsenalId||'Ataque principal';detail.textContent=(attack.damageType==='special'?'DAÑO ESPECIAL':'DAÑO FÍSICO')+' · '+(attack.evolution?'EVOLUCIONADA':'BASE');weapon.append(label,name,detail)}
  if(core)core.replaceChildren(
   this.row('VIDA',Math.ceil(p.hp)+' / '+p.maxHp,'Vida actual y máxima'),
   this.row('DAÑO',Math.round(damage*10)/10,'Daño base estimado del arma activa antes de defensas'),
   this.row('RECARGA',(Number(p.rate)||0).toFixed(2)+' s','Tiempo efectivo entre ataques'),
   this.row('ALCANCE',Math.round(range)+' u','Alcance efectivo del arma activa'),
   this.row('VELOCIDAD',Math.round((Number(p.speed)||0)*10)/10+' u/s','Velocidad efectiva de movimiento'),
   this.row('NIVEL',P.state.level+' · '+Math.floor(P.state.xp)+'/'+P.state.need+' XP','Progreso de la partida actual')
  );
  this.list(P.$('#player-stats-channels'),P.Stats.channelRows(p));this.list(P.$('#player-stats-advanced'),P.Stats.advancedRows(p));
  const status=P.$('#player-statuses'),effects=P.$('#player-stats-effects'),active=status?[...status.children].map(node=>node.textContent.trim()).filter(Boolean):[];
  if(effects)effects.textContent=active.length?active.join(' · '):'Sin efectos temporales'
 },
 hud(){
  const active=this.playing(),button=P.$('#player-stats-toggle');if(button)button.hidden=!active;
  if(!active){this.open(false);return}if(this.openState)this.render()
 },
 init(){
  this.mount();
  addEventListener('keydown',event=>{if(event.code!=='Tab'||event.repeat||event.altKey||event.ctrlKey||event.metaKey||['INPUT','TEXTAREA','SELECT'].includes(event.target?.tagName)||event.target?.isContentEditable||!this.playing())return;event.preventDefault();this.open(true)});
  addEventListener('keyup',event=>{if(event.code==='Tab')this.open(false)});addEventListener('blur',()=>this.open(false));
  const hud=P.UI.hud;P.UI.hud=function(...args){const result=hud.apply(this,args);P.PlayerStatsDrawer.hud();return result};this.hud()
 }
};
P.PlayerStatsDrawer.init();
