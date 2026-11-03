'use strict';
P.Supply={
items:{
lunch:{name:'Lonchera del causa',price:20,text:'+25 de vida máxima y vida inicial durante una partida.',color:'#eeae6b',apply:s=>{s.player.maxHp+=25;s.player.hp+=25}},
coffee:{name:'Café de cabina',price:25,text:'12% menos de recarga durante una partida.',color:'#cfae8b',apply:s=>s.player.rate*=.88},
shoes:{name:'Zapatillas de repuesto',price:25,text:'+10% de velocidad durante una partida.',color:'#8ccbf0',apply:s=>s.player.speed*=1.1},
magnet:{name:'Imán de bolsillo',price:20,text:'+25% de alcance de recogida durante una partida.',color:'#f19d9d',apply:s=>s.player.magnet*=1.25},
rare_key:{name:'Llave rara',price:30,text:'Empieza una partida con una llave rara.',color:'#83caff',apply:s=>s.keys.rare++},
legend_key:{name:'Llave legendaria',price:70,text:'Empieza una partida con una llave legendaria.',color:'#ce9aff',apply:s=>s.keys.legendary++},
pet_chick:{name:'Gallinita recolectora',price:0,text:'COMÚN · Recoge 4 cristales de EXP por viaje. Alcance 450.',color:'#f4eee2',pet:true,rarity:'common',apply:s=>s.player.collectorPet='pet_chick'},
pet_pack:{name:'Gallinita mochilera',price:180,text:'RARA · Recoge 8 cristales o monedas por viaje. Alcance 700.',color:'#62c6ff',pet:true,rarity:'rare',requires:'pet_chick',apply:s=>s.player.collectorPet='pet_pack'},
pet_rocket:{name:'Gallinita cohete',price:400,text:'LEGENDARIA · La más veloz: recoge 12 objetos, llaves y consumibles. Alcance 1000.',color:'#e5adff',pet:true,rarity:'legendary',requires:'pet_pack',apply:s=>s.player.collectorPet='pet_rocket'}
},
petIds(){return Object.keys(this.items).filter(id=>this.items[id].pet)},
preparedSupplies(data=P.Meta.data){return (data?.prepared||[]).filter(id=>!this.items[id]?.pet)},
equippedPet(data=P.Meta.data){return (data?.prepared||[]).find(id=>this.items[id]?.pet)||null},
ensureCollector(){
 if(P.CollectorPets)return Promise.resolve(true);
 if(this.collectorPromise)return this.collectorPromise;
 if(typeof document==='undefined'||!document.createElement||!document.head?.append)return Promise.resolve(false);
 this.collectorPromise=new Promise(resolve=>{
  const finish=()=>{this.collectorPromise=null;this.render();P.LobbyComplete?.renderHubPlayControls?.();resolve(!!P.CollectorPets)},existing=document.querySelector?.('script[src*="collector-pets.js"]');
  if(existing){existing.addEventListener?.('load',finish,{once:true});existing.addEventListener?.('error',finish,{once:true});return}
  const script=document.createElement('script');script.src='js/collector-pets.js?runtime='+Date.now();script.async=false;script.dataset.collectorRuntime='true';script.onload=finish;script.onerror=finish;document.head.append(script)
 });
 return this.collectorPromise
},
async change(id,prepare=false){const M=P.Meta,item=this.items[id];if(M.busy||P.state.mode!=='menu'||!item)return false;M.busy=true;const result=await M.transaction(data=>{if(P.state.mode!=='menu')return false;const quantity=data.inventory[id]||0;if(prepare){const index=data.prepared.indexOf(id);if(index>=0)data.prepared.splice(index,1);else{if(quantity<1)return false;if(item.pet)data.prepared=data.prepared.filter(value=>!this.items[value]?.pet);else if(this.preparedSupplies(data).length>=3)return false;data.prepared.push(id)}}else{const max=item.pet?1:99;if(quantity>=max||data.wallet<item.price||item.requires&&!(data.inventory[item.requires]>0))return false;data.wallet-=item.price;data.inventory[id]=quantity+1}return true});M.busy=false;this.render();return result},
async claim(run){return P.Meta.transaction(data=>{const previous=data.supplyClaims.find(c=>c.id===run.id);if(previous)return previous;const selected=[...data.prepared];if(selected.some(id=>!this.items[id]||(data.inventory[id]||0)<1))return false;for(const id of selected)if(!this.items[id].pet)data.inventory[id]--;data.prepared=selected.filter(id=>this.items[id].pet);const claim={id:run.id,items:selected};data.supplyClaims.push(claim);data.supplyClaims=data.supplyClaims.slice(-100);return claim})},
start(){const s=P.state,run=P.Meta.run;if(!run||run.suppliesDone||s.devRun||s.practice||P.Performance?.active||P.Coop?.active)return false;if(run.suppliesPending)return true;if(!(P.Meta.data?.prepared?.length)){run.suppliesDone=true;return false}run.suppliesPending=true;s.mode='supplies-loading';P.Core.clear();P.UI.show('Preparando mochila…','Confirmando los objetos y la mascota de esta partida.',[]);this.claim(run).then(claim=>{if(P.Meta.run!==run)return;run.suppliesPending=false;if(claim){for(const id of claim.items)this.items[id].apply(s);s.player.preparedSupplies=claim.items.filter(id=>!this.items[id].pet);run.suppliesDone=true;s.mode='play';P.$('#overlay').hidden=true;P.UI.hud()}else{s.mode='supplies-error';P.UI.show('La mochila sigue guardada',P.Meta.error||'No se pudo confirmar el inventario.',[{title:'Reintentar preparación',action:()=>{s.mode='play';P.$('#overlay').hidden=true}},{title:'Conservar objetos y jugar',action:()=>{run.suppliesDone=true;s.mode='play';P.$('#overlay').hidden=true}},{title:'Volver al menú',action:()=>P.UI.menu()}])}});return true},
icon(canvas,id){const ctx=canvas.getContext('2d'),item=this.items[id];if(!ctx)return;ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,48,48);if(item?.pet&&P.CollectorPets?.icon?.(ctx,id,24,39,43))return;if(id.endsWith('_key')){P.Loot.drawKey(ctx,22,23,id==='rare_key'?'rare':'legendary',1.5);return}const r=(color,x,y,w,h)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h)};r('#14293a',7,13,34,28);r(item.color,10,16,28,22);r('#ffe7aa',12,17,24,4);if(id==='lunch'){r('#14293a',18,8,12,9);r(item.color,21,11,6,6);r('#654c3a',22,25,5,7)}if(id==='coffee'){r('#eadbba',13,17,20,22);r('#654332',16,18,14,4);r('#eadbba',32,21,7,12);r('#14293a',33,23,4,8);r('#e9dcbe',18,7,2,6);r('#e9dcbe',25,5,2,7)}if(id==='shoes'){r('#14293a',7,11,34,30);r(item.color,12,13,11,20);r(item.color,20,24,16,11);r('#eff1cf',10,34,29,5);r('#eff1cf',16,20,10,2);r('#eff1cf',16,25,10,2)}if(id==='magnet'){r('#14293a',18,15,12,15);r('#14293a',10,13,5,11);r('#14293a',33,13,5,11);r('#e5eef1',10,13,8,8);r('#e5eef1',30,13,8,8)}},
init(){this.ensureCollector();if(typeof Image==='undefined')return;const menu=P.$('#menu'),side=P.$('#lobby-sidebar');for(const [route,name,description] of [['shop','▣ Tienda','Compra con monedas permanentes'],['bag','▣ Mochila','Prepara tu próxima partida']]){const panel=document.createElement('section');panel.id='lobby-'+route;panel.className='lobby-pane';panel.hidden=true;menu.append(panel);const button=document.createElement('button');button.id='lobby-nav-'+route;button.type='button';const title=document.createElement('strong'),small=document.createElement('small');title.textContent=name;small.textContent=description;button.append(title,small);button.onclick=()=>{P.Meta.load();P.Lobby.show(route,false);this.render();panel.querySelector('button')?.focus()};side.insertBefore(button,P.$('#lobby-nav-coop'))}},
render(){
 if(typeof Image==='undefined'||!P.Lobby?.ready||!['shop','bag'].includes(P.Lobby.route))return;
 const M=P.Meta,data=M.data,bag=P.Lobby.route==='bag',panel=P.$('#lobby-'+P.Lobby.route),preparedCount=this.preparedSupplies(data).length,petId=this.equippedPet(data);
 panel.replaceChildren();
 const add=(tag,text)=>{const node=document.createElement(tag);node.textContent=text;panel.append(node);return node};
 const back=add('button','← Volver');back.className='lobby-back';back.onclick=()=>P.Lobby.show('home');
 add('h2',bag?'Mochila y mascota · Próxima partida':'Tienda del ambulante');
 add('p','◉ '+data.wallet+' monedas permanentes · Suministros '+preparedCount+'/3 · Mascota '+(petId?this.items[petId].name:'sin equipar'));
 add('p',bag?'Prepara tres consumibles y una mascota permanente. Los consumibles se gastan; la mascota permanece en tu colección.':'Los suministros se acumulan. Las mascotas se compran una sola vez y progresan por rareza: común, rara y legendaria.');
 const switcher=add('button',bag?'Ir a la tienda':'Abrir mochila');switcher.className='supply-switch';switcher.onclick=()=>{P.Lobby.show(bag?'shop':'bag',false);this.render()};
 const grid=document.createElement('div');grid.className='supply-grid';
 for(const [id,item] of Object.entries(this.items)){
  const card=document.createElement('article'),canvas=document.createElement('canvas'),title=document.createElement('h3'),description=document.createElement('p'),stock=document.createElement('small'),button=document.createElement('button'),quantity=data.inventory[id]||0,prepared=data.prepared.includes(id);
  canvas.width=48;canvas.height=48;canvas.setAttribute('aria-hidden','true');title.textContent=item.name;description.textContent=item.text;
  stock.textContent=item.pet?(quantity?'OBTENIDA · '+(prepared?'EQUIPADA':item.rarity.toUpperCase()):'BLOQUEADA · '+item.rarity.toUpperCase()):'En mochila: '+quantity+(prepared?' · PREPARADO':'');
  button.textContent=bag?(item.pet?(prepared?'Quitar mascota':'Equipar mascota'):(prepared?'Quitar de preparados':'Preparar para la partida')):(item.pet&&quantity?'Mascota obtenida':item.price?'Comprar · '+item.price+' monedas':'Incluida');
  button.disabled=M.busy||!!M.error||(bag?(!prepared&&(quantity<1||!item.pet&&preparedCount>=3)):(item.pet&&quantity>0||data.wallet<item.price||item.requires&&!(data.inventory[item.requires]>0)||!item.pet&&quantity>=99));
  button.onclick=async()=>{button.disabled=true;await this.change(id,bag)};if(prepared)card.className='supply-prepared';if(item.pet)card.classList.add('supply-pet','rarity-'+item.rarity);card.append(canvas,title,description,stock,button);grid.append(card);this.icon(canvas,id)
 }
 panel.append(grid);
 if(bag){const play=add('button','Volver al menú principal');play.className='supply-play';play.onclick=()=>P.Lobby.show('home');add('p','Los consumibles no se gastan en cooperativo, laboratorio o práctica. La mascota nunca se consume.')}
 const status=add('p',M.error||'Mochila, mascotas y monedas guardadas en este navegador.');status.setAttribute('role','status');if(M.error){const retry=add('button','Revisar guardado');retry.onclick=()=>{M.load();M.hud();this.render()}}
}
};
