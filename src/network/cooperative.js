'use strict';
P.Coop={active:false,session:null,ws:null,lastSend:0,peers:[],paused:false,reconnecting:false,
init(){
 const panel=document.createElement('section');panel.id='coop-panel';panel.innerHTML='<h3>JUEGA CON UN AMIGO · 2 CAUSAS</h3><p>Elige tu personaje. El anfitrión elige el mapa. Código privado, sin cuentas.</p><div class="coop-actions"><button id="coop-create">Crear sala privada</button><input id="coop-code" aria-label="Código de sala" maxlength="8" placeholder="CÓDIGO" autocomplete="off"><button id="coop-join">Unirme</button></div><p id="coop-status" role="status" aria-live="polite"></p><button id="coop-begin" hidden>Iniciar cooperativo ↗</button><button id="coop-leave" hidden>Salir de la sala</button><small>Fama compartida · Poderes a elección por jugador · Acércate 4 s para reanimar · Portales con confirmación de ambos · Cofres con una recompensa por jugador · Eventos compartidos.</small>';
 P.$('.roster').append(panel);P.$('#coop-create').onclick=()=>this.connect('create');P.$('#coop-join').onclick=()=>this.connect('join');P.$('#coop-begin').onclick=()=>this.send({type:'start'});P.$('#coop-leave').onclick=()=>this.leave();
 const activate=P.Ultimate.activate.bind(P.Ultimate);P.Ultimate.activate=()=>{if(this.active){this.ultimate=true;return true}return activate()};
 const event=P.Exploration.start.bind(P.Exploration);P.Exploration.start=()=>{if(this.active)this.send({type:'activity',action:'event'});else return event()};
 const offer=P.Encounters.offer.bind(P.Encounters);P.Encounters.offer=()=>{if(this.active)this.send({type:'activity',action:'portal'});else return offer()};
 const roomHud=document.createElement('div');roomHud.id='coop-hud';P.$('#hud').append(roomHud);
},
status(text){P.$('#coop-status').textContent=text},
send(message){if(this.ws?.readyState===1)this.ws.send(JSON.stringify(message))},
connect(type){if(P.Gacha?.ready&&!P.Gacha.owns(P.Data.characters[P.state.chosen]?.id)){this.status('Desbloquea este causa en Gacha antes de crear o unirte a una sala.');P.Gacha.open();return}
 if(this.ws)this.leave(false);const code=P.$('#coop-code').value.trim().toUpperCase();if(type==='join'&&!/^[A-F0-9]{8}$/.test(code)){this.status('Escribe el código de 8 caracteres de tu amigo.');return}
 this.open({type,protocol:1,character:P.state.chosen,map:P.Maps.selected,code});
},
open(message){
 this.status(message.type==='resume'?'Reconectando…':'Conectando a la sala…');P.Audio.unlock();const url=new URL('/coop',location.href);url.protocol=location.protocol==='https:'?'wss:':'ws:';
 const ws=new WebSocket(url);this.ws=ws;let accepted=false;
 ws.onopen=()=>this.send(message);
 ws.onmessage=e=>{if(this.ws!==ws)return;const m=JSON.parse(e.data);
  if(m.type==='error'){this.status(m.message);if(this.active)P.$('#hint').textContent=m.message;if(!accepted){this.leave();this.status(m.message)}return}
  if(m.type==='joined'){if(this.reconnecting)this.paused=false;accepted=true;this.session={code:m.code,token:m.token,slot:m.slot};this.reconnecting=false}
  if(m.type==='joined'||m.type==='room'){const names=m.players.map(p=>P.Data.characters[p.character].name+(p.connected?' ✓':' (desconectado)'));this.status('SALA '+m.code+' · '+names.join(' + ')+(m.players.length<2?' · Comparte el código con tu amigo.':''));P.$('#coop-begin').hidden=m.started||m.players.length!==2||!m.players.every(p=>p.connected)||this.session?.slot!==0;P.$('#coop-leave').hidden=false;P.$('#coop-create').disabled=true;P.$('#coop-join').disabled=true;
   if(this.active&&!m.players.every(p=>p.connected))P.$('#hint').textContent='Tu compañero se desconectó. Partida detenida durante 30 s.';
  }
  if(m.type==='state')this.receive(m);
  if(m.type==='closed'){this.leave();this.status(m.message)}
 };
 ws.onerror=()=>this.status('No se pudo conectar al servidor cooperativo. El modo individual sigue disponible.');
 ws.onclose=()=>{if(this.ws!==ws)return;this.ws=null;if(this.session){this.reconnecting=true;this.paused=true;P.Core.clear();P.$('#hint').textContent='Conexión perdida. Intentando volver a la sala…';const session=this.session;setTimeout(()=>{if(this.session===session)this.open({type:'resume',protocol:1,...session})},1500)}else this.status('No se pudo conectar. Prueba de nuevo o juega individual.')};
},
receive(m){
 const first=!this.active;if(first)this.resultShown=false;this.active=true;this.reconnecting=false;
 if(first){P.Maps.select(m.map);P.state.chosen=P.Data.characters.findIndex(c=>c.id===m.players[this.session.slot].id);this.initializing=true;P.Game.start();this.initializing=false;P.Loot.chests=[];P.Loot.debris=[];P.$('#pause').setAttribute('aria-label','Opciones cooperativas')}
 const s=P.state,previousScene=s.encounter?.scene?.id;for(const key of ['miniReport','court','courtBurst','miniWarning','keys','portal','encounter','mapBossWon','coins','elapsed','mapTime','kills','level','xp','need','bossSpawned','shots','fields','enemies','gems','danger','effects'])s[key]=m[key];
 s.mode='play';s.player=m.players[this.session.slot];s.ultimate=s.player.ultimate;this.peers=m.players.filter(p=>p.slot!==this.session.slot);P.Maps.selected=m.map;
 for(const p of m.players)p.coopPlayer=true;
 const broken=new Set(m.broken);P.Chunks.broken=new Set(m.broken.filter(id=>typeof id==='string'));for(const prop of P.Terrain.props)if(prop.kind==='crate'&&broken.has(prop.id)){prop.solid=false;prop.hp=0;if(prop.generated)P.Chunks.broken.add(prop.id)}
 P.Market.merchant=m.merchant||null;P.Loot.chests=m.chests||[];P.Loot.debris=m.debris||[];P.Loot.message=m.message||'';P.Loot.messageTime=m.message?1:0;P.Exploration.station=m.station;
 if(previousScene!==s.encounter?.scene?.id){P.Terrain.cameraX=s.player.x;P.Terrain.cameraY=s.player.y;P.Core.clear();P.Core.canvas.setAttribute('aria-label','Arena: '+(s.encounter?.scene?.name||P.Maps.current().name))}
 P.Chunks.sync();P.UI.hud();P.$('#coop-hud').textContent='SALA '+this.session.code+' · '+m.players.map(p=>p.name+': '+Math.ceil(p.hp)+' ♥'+(p.hp<=0?' · Reanimación '+Math.floor(p.revive||0)+'/4 s':'')).join(' / ');
 const votes=m.portal?.votes||[];if(m.portal?.open)P.$('#portal-status').textContent+=' · Listos '+votes.length+'/2 · Ambos cerca y E';P.$('#portal-enter').textContent=votes.includes(this.session.slot)?'Listo · E para cancelar':'Entrar juntos al portal · E';
 P.$('#hint').textContent=m.message||(s.player.hp<=0?'CAÍSTE · TU AMIGO PUEDE REANIMARTE ACERCÁNDOSE 4 S':'COOPERATIVO · EXPLORA COFRES, PORTALES Y EVENTOS CON TU AMIGO');
 this.showReward(m.pending);
 if(m.result&&!this.resultShown){this.resultShown=true;this.paused=true;const show=()=>{P.UI.show(m.result==='win'?'¡Ganaron, causas!':'Cayó el equipo.',m.kills+' rivales · '+P.Core.clock(m.elapsed),[{title:'Volver al menú',action:()=>{this.leave();P.UI.menu()}}],P.DamageStats.report(s.player));P.Meta.decorate()};P.Meta.result(m.result==='win',m);if(m.result==='lose')P.PlayerFeedback.finish(show);else show()}
},
showReward(pending){
 this.activityPending=!!pending;const key=pending?pending.id+':'+pending.phase+':'+pending.applied[this.session.slot]:'';if(key===this.activityKey)return;this.activityKey=key;
 if(pending){P.Evolutions.close();P.Market.close(false);this.paused=false;P.Core.clear()}
 if(!pending){if(!this.paused)P.$('#overlay').hidden=true;return}
 const leave={title:'Salir de la sala',action:()=>this.leave()};
 if(pending.phase==='opening'){P.UI.show('Abriendo cofre…','La sala está en pausa para los dos.',[leave]);return}
 if(pending.applied[this.session.slot]){P.UI.show('Recompensa elegida','Esperando la elección de tu compañero…',[leave]);return}
 const choose=choice=>this.send({type:'activity',action:'choose',id:pending.id,choice});let buttons,title,description;
 if(pending.kind==='level'){const options=pending.options[this.session.slot];title='¡SUBIERON DE NIVEL!';description='NIVEL '+P.state.level+' · Cada jugador elige 1 de '+options.length+' poderes. La sala está en pausa.';buttons=options.map((o,i)=>({title:o.title,description:o.description,card:P.UI.upgradeCard(o),action:()=>choose(i)}))}
 else if(pending.kind==='portal-reward'){title='¡Vencieron al jefe del portal!';description='Cada uno elige una mejora. El juego continúa cuando ambos terminen.';buttons=[{title:'Poder del portal · +30% de daño',action:()=>choose(0)},{title:'Corazón de la arena · +40 vida máxima y curación',action:()=>choose(1)},{title:'Ritmo del campeón · Ataques 25% más frecuentes',action:()=>choose(2)}]}
 else if(pending.kind==='mini-reward'){const item=P.Loot.items[pending.item];title='Recompensa exclusiva · '+item.name;description=item.description+' · Reemplaza tu accesorio. Cada jugador elige; las monedas van al equipo.';buttons=[{title:(P.state.player.equipment===pending.item?'Ya equipado: ':'Equipar ')+item.name,disabled:P.state.player.equipment===pending.item,action:()=>choose(0)},{title:'Cobrar '+P.Relics.coins+' monedas',action:()=>choose(1)}]}
 else {const item=P.Loot.items[pending.item];title=P.Loot.rarity(pending.rarity).name+' · '+item.name;description=item.description+' · Cada jugador recibe su propia recompensa.';buttons=[{title:(item.consumable?'Beber ':'Equipar ')+item.name,action:()=>choose(0)},{title:'Conservar mi equipo',action:()=>choose(1)}]}
 P.UI.show(title,description,[...buttons,leave]);if(pending.item)P.LootArt.reveal(pending.item);
},
tick(dt){
 if(!this.active)return;this.lastSend+=dt;if(this.lastSend>=.05){this.lastSend=0;const input=this.paused||this.reconnecting||this.activityPending?{x:0,y:0}:P.Core.direction();this.send({type:'input',x:input.x,y:input.y,ultimate:!!this.ultimate,view:P.Combat.sanitizeView(P.Combat.view(P.state.player))});this.ultimate=false}
 // El servidor es la única autoridad: no se ejecuta Game.update en este cliente.
},
pause(){if(this.reconnecting||this.activityPending)return;if(this.paused){this.paused=false;P.$('#overlay').hidden=true;return}this.paused=true;P.Core.clear();this.send({type:'input',x:0,y:0});P.UI.show('Cooperativo · Opciones','Tu amigo continúa jugando. Esta pantalla no pausa la sala.',[{title:'Seguir jugando',action:()=>this.pause()},{title:'Salir de la sala',action:()=>{this.leave();P.UI.menu()}}])},
leave(menu=true){P.Evolutions.close();this.session=null;this.active=false;this.activityPending=false;this.activityKey="";P.$("#coop-hud").textContent="";this.peers=[];this.paused=false;this.reconnecting=false;if(this.ws){this.send({type:'leave'});const ws=this.ws;this.ws=null;ws.close()}P.$('#coop-begin').hidden=true;P.$('#coop-leave').hidden=true;P.$('#coop-create').disabled=false;P.$('#coop-join').disabled=false;this.status('');P.$('#pause').setAttribute('aria-label','Pausar partida');if(menu)P.UI.menu()}
};
