'use strict';
P.Coop={active:false,session:null,ws:null,lastSend:0,peers:[],paused:false,reconnecting:false,
init(){
 const panel=document.createElement('section');panel.id='coop-panel';panel.innerHTML='<h3>JUEGA CON UN AMIGO · 2 CAUSAS</h3><p>Elige tu personaje. El anfitrión elige el mapa. Código privado, sin cuentas.</p><div class="coop-actions"><button id="coop-create">Crear sala privada</button><input id="coop-code" aria-label="Código de sala" maxlength="8" placeholder="CÓDIGO" autocomplete="off"><button id="coop-join">Unirme</button></div><p id="coop-status" role="status" aria-live="polite"></p><button id="coop-begin" hidden>Iniciar cooperativo ↗</button><button id="coop-leave" hidden>Salir de la sala</button><small>Fama y mejoras compartidas · Acércate 4 s para reanimar · Jefe final a los 5 min. Los portales, cofres de equipo y eventos opcionales siguen disponibles en individual.</small>';
 P.$('.roster').append(panel);P.$('#coop-create').onclick=()=>this.connect('create');P.$('#coop-join').onclick=()=>this.connect('join');P.$('#coop-begin').onclick=()=>this.send({type:'start'});P.$('#coop-leave').onclick=()=>this.leave();
 const activate=P.Ultimate.activate.bind(P.Ultimate);P.Ultimate.activate=()=>{if(this.active){this.ultimate=true;return true}return activate()};
 const available=P.Exploration.available.bind(P.Exploration);P.Exploration.available=()=>!this.active&&available();
 const offer=P.Encounters.offer.bind(P.Encounters);P.Encounters.offer=()=>{if(!this.active)return offer()};
},
status(text){P.$('#coop-status').textContent=text},
send(message){if(this.ws?.readyState===1)this.ws.send(JSON.stringify(message))},
connect(type){
 if(this.ws)this.leave(false);const code=P.$('#coop-code').value.trim().toUpperCase();if(type==='join'&&!/^[A-F0-9]{8}$/.test(code)){this.status('Escribe el código de 8 caracteres de tu amigo.');return}
 this.open({type,protocol:1,character:P.state.chosen,map:P.Maps.selected,code});
},
open(message){
 this.status(message.type==='resume'?'Reconectando…':'Conectando a la sala…');P.Audio.unlock();const url=new URL('/coop',location.href);url.protocol=location.protocol==='https:'?'wss:':'ws:';
 const ws=new WebSocket(url);this.ws=ws;let accepted=false;
 ws.onopen=()=>this.send(message);
 ws.onmessage=e=>{if(this.ws!==ws)return;const m=JSON.parse(e.data);
  if(m.type==='error'){this.status(m.message);if(this.active)P.$('#hint').textContent=m.message;if(!accepted){this.session=null;this.ws=null;ws.close()}return}
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
 const first=!this.active;this.active=true;this.reconnecting=false;
 if(first){P.Maps.selected=m.map;P.state.chosen=P.Data.characters.findIndex(c=>c.id===m.players[this.session.slot].id);this.initializing=true;P.Game.start();this.initializing=false;P.Loot.chests=[];P.Loot.debris=[];P.$('#pause').setAttribute('aria-label','Opciones cooperativas')}
 const s=P.state;for(const key of ['coins','elapsed','mapTime','kills','level','xp','need','bossSpawned','shots','fields','enemies','gems','danger','effects'])s[key]=m[key];
 s.mode='play';s.player=m.players[this.session.slot];s.ultimate=s.player.ultimate;this.peers=m.players.filter(p=>p.slot!==this.session.slot);P.Maps.selected=m.map;
 for(const p of m.players)p.coopPlayer=true;
 const broken=new Set(m.broken);P.Chunks.broken=new Set(m.broken.filter(id=>typeof id==='string'));for(const prop of P.Terrain.props)if(prop.kind==='crate'&&broken.has(prop.id)){prop.solid=false;prop.hp=0;if(prop.generated)P.Chunks.broken.add(prop.id)}
 P.Chunks.sync();P.UI.hud();P.$('#portal-enter').hidden=true;P.$('#event-start').hidden=true;P.$('#event-status').hidden=true;P.$('#portal-status').textContent='SALA '+this.session.code+' · '+m.players.map(p=>p.name+': '+Math.ceil(p.hp)+' ♥'+(p.hp<=0?' · Reanimación '+Math.floor(p.revive||0)+'/4 s':'')).join(' / ');
 P.$('#hint').textContent=s.player.hp<=0?'CAÍSTE · TU AMIGO PUEDE REANIMARTE ACERCÁNDOSE 4 S':'COOPERATIVO · MANTÉNGANSE CERCA · MEJORAS COMPARTIDAS';
 if(m.result){this.paused=true;P.UI.show(m.result==='win'?'¡Ganaron, causas!':'Cayó el equipo.',m.kills+' rivales · '+P.Core.clock(m.elapsed),[{title:'Volver al menú',action:()=>{this.leave();P.UI.menu()}}])}
},
tick(dt){
 if(!this.active)return;this.lastSend+=dt;if(this.lastSend>=.05){this.lastSend=0;const input=this.paused||this.reconnecting?{x:0,y:0}:P.Core.direction();this.send({type:'input',x:input.x,y:input.y,ultimate:!!this.ultimate});this.ultimate=false}
 // El servidor es la única autoridad: no se ejecuta Game.update en este cliente.
},
pause(){if(this.reconnecting)return;if(this.paused){this.paused=false;P.$('#overlay').hidden=true;return}this.paused=true;P.Core.clear();this.send({type:'input',x:0,y:0});P.UI.show('Cooperativo · Opciones','Tu amigo continúa jugando. Esta pantalla no pausa la sala.',[{title:'Seguir jugando',action:()=>this.pause()},{title:'Salir de la sala',action:()=>{this.leave();P.UI.menu()}}])},
leave(menu=true){this.session=null;this.active=false;this.peers=[];this.paused=false;this.reconnecting=false;if(this.ws){this.send({type:'leave'});const ws=this.ws;this.ws=null;ws.close()}P.$('#coop-begin').hidden=true;P.$('#coop-leave').hidden=true;P.$('#coop-create').disabled=false;P.$('#coop-join').disabled=false;this.status('');if(menu)P.UI.menu()}
};
