'use strict';
// Economía inicial del Gacha. Conserva `golden_ticket` como clave histórica para
// que los tickets rescatados del Divagante no se pierdan al migrar guardados.
P.GachaEconomy={
 maxTickets:100000,scope:'permanent',banner:'permanent-characters',
 permanent:[
  {id:'permanent-characters',name:'Personajes y versiones',detail:'Catálogo permanente',ready:true},
  {id:'permanent-skins',name:'Skins',detail:'Catálogo en preparación'},
  {id:'permanent-expressions',name:'Expresiones',detail:'Memes, burlas y efectos'},
  {id:'permanent-pets',name:'Mascotas',detail:'Compañeros permanentes'}
 ],
 seasonal:[
  {id:'season-sideral',name:'Sideral',detail:'Personaje destacado'},
  {id:'season-makanaky',name:'Makanaky',detail:'Personaje destacado'},
  {id:'season-skins',name:'Skins de temporada',detail:'Compatibilidad visible antes de tirar'},
  {id:'season-expressions',name:'Expresiones de temporada',detail:'Memes, burlas y efectos'},
  {id:'season-pets',name:'Mascotas de temporada',detail:'Compañeros del evento'}
 ],
 integer(value,max=this.maxTickets){if(!Number.isSafeInteger(value)||value<0||value>max)throw Error('Economía de Gacha no válida');return value},
 tickets(kind='permanent',data=P.Meta?.data){const key=kind==='season'?'season_ticket':'golden_ticket';return Math.max(0,Math.min(this.maxTickets,Math.floor(Number(data?.inventory?.[key])||0)))},
 seasonKey(){const map=P.Maps?.seasonMap||'none',revision=Number.isSafeInteger(P.Maps?.seasonRevision)?P.Maps.seasonRevision:0;return map+':'+revision},
 grantBoss(data,key=this.seasonKey()){
  const wins=this.integer(data.seasonBossWins?.[key]??0,1000000),tickets=wins===0?10:2;
  data.seasonBossWins??={};data.seasonBossWins[key]=wins+1;
  data.inventory.golden_ticket=Math.min(this.maxTickets,this.tickets('permanent',data)+tickets);
  return{tickets,first:wins===0,season:key,wins:wins+1};
 },
 seasonName(){const map=P.Maps?.catalog?.find?.(entry=>entry.id===P.Maps.seasonMap);return map?.name||'Sin temporada activa'},
 renderHub(panel,add,gacha,rerender=()=>gacha.render()){
  const wallet=document.createElement('section');wallet.className='gacha-wallets';
  for(const [icon,value,label] of [['🎫',this.tickets('permanent'),'Tickets permanentes'],['✦',this.tickets('season'),'Tickets de temporada']]){const item=document.createElement('article'),amount=document.createElement('strong'),name=document.createElement('small');amount.textContent=icon+' '+value;name.textContent=label;item.append(amount,name);wallet.append(item)}panel.append(wallet);
  const scopes=document.createElement('nav');scopes.className='gacha-scope-tabs';scopes.setAttribute('aria-label','Tipo de banner');
  for(const [id,label] of [['permanent','Permanentes'],['season','Temporada']]){const button=document.createElement('button');button.type='button';button.textContent=label;button.setAttribute('aria-pressed',String(this.scope===id));button.onclick=()=>{this.scope=id;this.banner=id==='permanent'?'permanent-characters':'season-sideral';gacha.animation=null;rerender()};scopes.append(button)}panel.append(scopes);
  add('h3',this.scope==='season'?'Temporada · '+this.seasonName():'Banners permanentes');const grid=document.createElement('section');grid.className='gacha-banner-grid';
  const catalog=this.scope==='season'?this.seasonal:this.permanent;
  for(const entry of catalog){const card=document.createElement('button'),name=document.createElement('strong'),detail=document.createElement('small'),state=document.createElement('span');card.type='button';card.dataset.selected=String(this.banner===entry.id);name.textContent=entry.name;detail.textContent=entry.detail;state.textContent=entry.ready?'DISPONIBLE':'PROTOTIPO';card.append(name,detail,state);card.onclick=()=>{this.banner=entry.id;gacha.animation=null;rerender()};grid.append(card)}panel.append(grid);
  const selected=catalog.find(entry=>entry.id===this.banner)||catalog[0];if(selected?.ready)return true;
  const preview=add('section','');preview.className='gacha-banner-preview';const heading=document.createElement('h3'),copy=document.createElement('p');heading.textContent=selected?.name||'';copy.textContent=this.scope==='season'?'Este banner ya tiene su lugar y usará tickets de temporada. Las probabilidades, pity y formas de obtener esos tickets se habilitarán cuando queden aprobados.':'Este catálogo queda separado del Gacha de personajes. Las recompensas se activarán al cargar su contenido definitivo.';preview.append(heading,copy);return false;
 },
 decoratePanel(gacha=P.Gacha){
  if(typeof document==='undefined'||P.Lobby?.route!=='gacha'||gacha.view!=='pull')return;
  const panel=P.$('#lobby-gacha'),tabs=panel?.querySelector('.gacha-tabs');if(!panel||!tabs)return;
  const catalog=this.scope==='season'?this.seasonal:this.permanent,selected=catalog.find(entry=>entry.id===this.banner)||catalog[0],ready=!!selected?.ready;
  if(!ready)while(tabs.nextSibling)tabs.nextSibling.remove();
  const anchor=ready?tabs.nextSibling:null,hub=document.createElement('section'),add=(tag,text)=>{const node=document.createElement(tag);node.textContent=text;hub.append(node);return node};hub.className='gacha-economy-hub';
  this.renderHub(hub,add,gacha);panel.querySelector('h2').textContent='Gacha';
  if(ready&&anchor)panel.insertBefore(hub,anchor);else panel.append(hub);
 },
 install(){
  const M=P.Meta,blank=M.blank.bind(M),normalize=M.normalize.bind(M);
  M.blank=()=>{const out=blank();out.inventory.season_ticket??=0;out.seasonBossWins??={};return out};
  M.normalize=raw=>{const out=normalize(raw),source=raw&&typeof raw==='object'?raw:{};out.inventory.season_ticket=this.integer(source.inventory?.season_ticket??0);const claims=source.seasonBossWins??{};if(!claims||typeof claims!=='object'||Array.isArray(claims)||Object.keys(claims).length>100)throw Error('Temporadas de Gacha no válidas');out.seasonBossWins={};for(const [key,wins] of Object.entries(claims)){if(typeof key!=='string'||!key||key.length>80)throw Error('Temporada de Gacha no válida');out.seasonBossWins[key]=this.integer(wins,1000000)}const extras=new Map((source.receipts||[]).map(receipt=>[receipt?.id,receipt]));for(const receipt of out.receipts){const extra=extras.get(receipt.id);receipt.ticketReward=this.integer(extra?.ticketReward??0,10);receipt.ticketSeason=extra?.ticketSeason==null?null:String(extra.ticketSeason);if(receipt.ticketSeason!==null&&(receipt.ticketSeason.length>80||!receipt.ticketSeason))throw Error('Recibo de temporada no válido')}return out};
  const finish=M.finish.bind(M);M.finish=(win,source=P.state)=>finish(win,source).then(async receipt=>{if(!receipt||!win||source.devRun||source.practice||P.Performance?.active)return receipt;const saved=await M.transaction(data=>{const row=data.receipts.find(item=>item.id===receipt.id);if(!row)return false;if(row.ticketReward)return row;const award=this.grantBoss(data);row.ticketReward=award.tickets;row.ticketSeason=award.season;return row});return saved||receipt});
  const decorate=M.decorate.bind(M);M.decorate=()=>{decorate();const receipt=M.run?.receipt,node=P.$?.('#meta-result');if(node&&receipt?.ticketReward)node.textContent+=' · 🎫 +'+receipt.ticketReward+' tickets permanentes'+(receipt.ticketReward===10?' · primera victoria de temporada':' · repetición')};
  const render=P.Gacha.render.bind(P.Gacha);P.Gacha.render=()=>{const result=render();this.decoratePanel(P.Gacha);return result};
 }
};
P.GachaEconomy.install();
