'use strict';
// Cada arena conserva el mismo combate; los límites protegen los bordes decorativos.
P.Maps={
selected:'campo',images:{},ready:{},
catalog:[
{id:'campo',name:'Campo de Marte',region:'Lima · Jesús María',description:'Parque sin bordes · Césped y senderos.',color:'#769b58',bounds:{left:-940,right:940,top:-430,bottom:620},spawn:{x:0,y:-60}},
{id:'plaza',name:'Plaza de Armas',region:'Lima · Centro histórico',description:'Ciudad sin bordes · Piedra y jardines.',color:'#ccaa65',bounds:{left:-880,right:880,top:-430,bottom:600},spawn:{x:0,y:210},fountain:{x:0,y:55,rx:176,ry:105}},
{id:'machu',name:'Machu Picchu',region:'Cusco · Andes',description:'Andes sin bordes · Muros y rocas.',color:'#82b7a4',bounds:{left:-780,right:780,top:-400,bottom:570},spawn:{x:0,y:-80}}
],
current(){return this.catalog.find(m=>m.id===this.selected)||this.catalog[0]},
init(){this.catalog.forEach(map=>{const button=document.createElement('button');button.className='map-card';button.dataset.map=map.id;button.setAttribute('aria-pressed',String(map.id===this.selected));const image=document.createElement('img');image.src='assets/maps/'+map.id+'-v1.png';image.alt='';const name=document.createElement('b');name.textContent=map.name;const region=document.createElement('small');region.textContent=map.region;button.append(image,name,region);button.onclick=()=>this.select(map.id);P.$('#maps').append(button);
if(typeof Image!=='undefined'){const art=new Image();art.onload=()=>{this.images[map.id]=art;this.ready[map.id]=true;if(P.Chunks&&this.selected===map.id)for(const chunk of P.Chunks.cache.values())chunk.canvas=null;this.status()};art.onerror=()=>{this.ready[map.id]=false;this.status()};art.src=image.src}});
this.select(this.selected)},
select(id){if(P.state.mode!=='menu'||!this.catalog.some(map=>map.id===id))return;this.selected=id;document.querySelectorAll('.map-card').forEach(b=>{const selected=b.dataset.map===id;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected))});const map=this.current();P.$('#map-name').textContent=map.name.toUpperCase();P.$('#map-description').textContent=map.description;P.Core.canvas.setAttribute('aria-label','Arena: '+map.name);this.status()},
status(){const label=P.$('#map-status');if(!label)return;label.textContent=typeof Image==='undefined'?'':this.ready[this.selected]?'ESCENARIO LISTO':'Cargando escenario…'},
reset(){const map=this.current();P.state.player.x=map.spawn.x;P.state.player.y=map.spawn.y},
collide(p,old){if(P.state.encounter){p.x=Math.max(-590,Math.min(590,p.x));p.y=Math.max(-370,Math.min(370,p.y));return}const map=this.current();if(map.fountain){const f=map.fountain,dx=(p.x-f.x)/f.rx,dy=(p.y-f.y)/f.ry,d=Math.hypot(dx,dy);if(d<1){if(d<.001){p.x=old.x;p.y=old.y}else{p.x=f.x+dx/d*f.rx;p.y=f.y+dy/d*f.ry}}}P.Terrain.resolve(p,old,14)},
camera(x,y,w,h){return P.state.encounter?{x:0,y:0}:{x,y}},
draw(ctx,cx,cy,w,h,time){if(P.state.mode!=='menu'&&!P.state.encounter){P.Chunks.draw(ctx,cx,cy,w,h);return}const map=this.current();ctx.fillStyle='#17232b';ctx.fillRect(cx-w,cy-h,w*2,h*2);ctx.fillStyle=map.color;ctx.fillRect(-1200,-800,2400,1600);const image=this.images[map.id];if(image){ctx.imageSmoothingEnabled=false;ctx.drawImage(image,-1200,-800,2400,1600)}else{ctx.fillStyle=map.id==='plaza'?'#ac9f8e':'#7e9e61';ctx.fillRect(-1200,-800,2400,1600);ctx.fillStyle=map.id==='plaza'?'#c5bbaa':'#d8c4a0';ctx.fillRect(-55,-800,110,1600);ctx.fillRect(-1200,-55,2400,110);if(map.fountain)P.Entities.circle(ctx,0,0,map.fountain.rx,'#608f99')}
// Ambiente ligero, sin tapar la lectura del combate.
ctx.save();for(let i=0;i<13;i++){const x=Math.sin(i*48.3)*1050+Math.sin(time/6000+i)*25,y=Math.cos(i*21.8)*600+Math.sin(time/2100+i)*9;ctx.globalAlpha=.12;ctx.fillStyle=map.id==='machu'?'#e3f3e8':map.id==='campo'?'#d8e7a8':'#f5dab4';ctx.fillRect(Math.round(x),Math.round(y),map.id==='machu'?22:3,map.id==='machu'?3:3)}ctx.restore()}
};