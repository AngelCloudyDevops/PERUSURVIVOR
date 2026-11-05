'use strict';
// Logo 3D de «KICK PERÚ: All Stars» (bienvenida y título del hub). Solo cliente: necesita window.THREE (public/vendor/three-r160.min.js),
// P.Logo3dGlyphs (src/data/logo-3d-glyphs.js) y WebGL. En el VM del servidor, sin three.js o sin WebGL no hace nada y el <img> sigue
// siendo el logo. Modelo: letras extruidas con bisel redondeado y contorno oscuro (segunda extrusión mayor detrás), estrellas extruidas
// y destellos. Movimiento y constantes salen de P.Wordmark.motion (mismo balanceo, seguimiento del puntero, rebote y entrada que el logo de imagen).
P.Logo3d={
 items:new Map(),model:null,raf:0,timer:0,last:0,started:false,webgl:undefined,
 // Medidas del modelo en em de fuente (1 = altura de la fuente): sx/sy escalan cada línea, gap separa ALL y STARS, D = profundidad, bs/bt = bisel, ol = grosor del contorno.
 REST:{ry:11,rx:-7},
 LAYOUT:{l2:{sy:1.45,gap:.5,D:.42,bs:.024,bt:.05,ol:.1},l1:{width:.74,sy:1.2,D:.3,bs:.02,bt:.04,ol:.08},stairs:.04,curve:4},
 COLORS:{
  kick:{face:['#e2ff3a','#1fd10f'],side:['#0c6a1c','#053d12'],edge:'#06210f'},
  all:{face:['#ffe600','#ff7a00'],side:['#c23a14','#6e1a0c'],edge:'#3a1507'},
  star:{face:['#fff77a','#ffb11a'],side:['#f0820f','#b04a08'],edge:'#4a1e08'}},
 supported(){
  if(typeof document==='undefined'||typeof window==='undefined'||!window.THREE||!P.Logo3dGlyphs||typeof requestAnimationFrame!=='function')return false;
  if(this.webgl===undefined){try{const c=document.createElement('canvas');this.webgl=!!(c.getContext&&(c.getContext('webgl2')||c.getContext('webgl')))}catch{this.webgl=false}}
  return this.webgl},
 // Camino de glifos «M x y L x y Q … C … Z» → ShapePath de three, con origen (ox,oy) y escala (sx,sy) en em.
 shapes(d,ox,oy,sx,sy){
  const T=window.THREE,path=new T.ShapePath(),re=/([MLQCZ])([^MLQCZ]*)/g,U=P.Logo3dGlyphs.units;let m;
  while((m=re.exec(d))){const n=m[2].trim()?m[2].trim().split(/\s+/).map(Number):[],X=i=>ox+n[i]*sx/U,Y=i=>oy+n[i]*sy/U;
   if(m[1]==='M')path.moveTo(X(0),Y(1));else if(m[1]==='L')path.lineTo(X(0),Y(1));
   else if(m[1]==='Q')path.quadraticCurveTo(X(0),Y(1),X(2),Y(3));else if(m[1]==='C')path.bezierCurveTo(X(0),Y(1),X(2),Y(3),X(4),Y(5))}
  return path.toShapes(false)},
 // Colorea por vértice: la tapa con degradado vertical «face», bisel y laterales con «side». Geometría sin índice: los grupos son rangos de vértices.
 paint(geo,colors,y0,y1){
  const T=window.THREE,pos=geo.attributes.position,col=new Float32Array(pos.count*3),c=new T.Color(),a=new T.Color(),b=new T.Color();
  for(const g of geo.groups){const pair=g.materialIndex===0?colors.face:colors.side;a.set(pair[0]);b.set(pair[1]);
   for(let i=g.start;i<g.start+g.count;i++){const t=Math.max(0,Math.min(1,(pos.getY(i)-y0)/((y1-y0)||1)));c.copy(b).lerp(a,t);col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b}}
  geo.setAttribute('color',new T.BufferAttribute(col,3));return geo},
 // Una línea de texto: letras (mesh con vértices coloreados) + contorno oscuro (misma forma, bisel mayor, un poco más atrás).
 text(group,list,colors,cfg,y0,y1){
  const T=window.THREE,L=this.LAYOUT,face=this.mats.face,edge=this.mats.edge(colors.edge),shapes=[];
  for(const s of list)shapes.push(...this.shapes(s.d,s.x,s.y,s.sx,s.sy));
  const main=this.paint(new T.ExtrudeGeometry(shapes,{depth:cfg.D,bevelEnabled:true,bevelThickness:cfg.bt,bevelSize:cfg.bs,bevelOffset:0,bevelSegments:2,curveSegments:L.curve}),colors,y0,y1);
  // El contorno queda detrás de la tapa frontal de las letras (z máx ≈ D-1.1·bt < D+bt) y solo asoma por los lados.
  const back=-cfg.ol*.9,outline=new T.ExtrudeGeometry(shapes,{depth:cfg.D-back-cfg.bt*1.6,bevelEnabled:true,bevelThickness:cfg.bt*.5,bevelSize:cfg.bs+cfg.ol,bevelOffset:0,bevelSegments:2,curveSegments:L.curve});
  const m=new T.Mesh(main,face),o=new T.Mesh(outline,edge);o.position.z=back;group.add(o,m);this.geos.push(main,outline)},
 star(R,colors){
  const T=window.THREE,s=new T.Shape(),r=R*.46;for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,k=i%2?r:R;i?s.lineTo(Math.cos(a)*k,Math.sin(a)*k):s.moveTo(Math.cos(a)*k,Math.sin(a)*k)}s.closePath();
  const D=R*.35,g=this.paint(new T.ExtrudeGeometry(s,{depth:D,bevelEnabled:true,bevelThickness:R*.1,bevelSize:R*.07,bevelSegments:3,curveSegments:4}),colors,-R,R),
   o=new T.ExtrudeGeometry(s,{depth:D*.8,bevelEnabled:true,bevelThickness:R*.05,bevelSize:R*.2,bevelSegments:2,curveSegments:4}),holder=new T.Group(),mesh=new T.Mesh(g,this.mats.face),out=new T.Mesh(o,this.mats.edge(colors.edge));
  out.position.z=-R*.12;holder.add(out,mesh);mesh.position.z=0;this.geos.push(g,o);return holder},
 flare(){
  const T=window.THREE,c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),h=64;
  const r=g.createRadialGradient(h,h,0,h,h,h);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.18,'rgba(255,240,170,.85)');r.addColorStop(1,'rgba(255,200,60,0)');g.fillStyle=r;g.fillRect(0,0,128,128);
  g.fillStyle='rgba(255,255,255,.9)';g.beginPath();g.moveTo(h,2);g.lineTo(h+6,h-6);g.lineTo(126,h);g.lineTo(h+6,h+6);g.lineTo(h,126);g.lineTo(h-6,h+6);g.lineTo(2,h);g.lineTo(h-6,h-6);g.closePath();g.fill();
  const tex=new T.CanvasTexture(c);this.tex.push(tex);return tex},
 // Construye (una vez) el grupo con todo el logo, centrado en el origen. Los renderers comparten geometrías y materiales; cada escena usa un clon.
 build(){
  if(this.model)return this.model;const T=window.THREE,G=P.Logo3dGlyphs,L=this.LAYOUT,C=this.COLORS,U=G.units;
  this.geos=[];this.tex=[];this.mats={face:new T.MeshPhongMaterial({vertexColors:true,shininess:80,specular:0x777766}),edges:{},edge(hex){return this.edges[hex]||(this.edges[hex]=new T.MeshPhongMaterial({color:hex,shininess:20,specular:0x222222}))}};
  const root=new T.Group(),inner=new T.Group(),l2=L.l2,l1=L.l1;
  const total=(G.all.w+G.stars.w)/U+l2.gap,x2=-total/2,sy2=l2.sy,top2=Math.max(G.all.y1,G.stars.y1)/U*sy2,bot2=Math.min(G.all.y0,G.stars.y0)/U*sy2;
  this.text(inner,[{d:G.all.d,x:x2,y:0,sx:1,sy:sy2},{d:G.stars.d,x:x2+G.all.w/U+l2.gap,y:0,sx:1,sy:sy2}],C.all,l2,bot2,top2);
  const sx1=l1.width*total/(G.kick.w/U),sy1=sx1*l1.sy,w1=G.kick.w/U*sx1,base1=top2+L.stairs;
  this.text(inner,[{d:G.kick.d,x:-w1/2,y:base1,sx:sx1,sy:sy1}],C.kick,l1,base1+G.kick.y0/U*sy1,base1+G.kick.y1/U*sy1);
  const mid=x2+G.all.w/U+l2.gap/2,stars=this.stars=[];
  for(const [R,x,y,z,spin,flare,rz] of [[.2,-w1/2-.2,base1+.42,l1.D/2,.5,true,.28],[.15,w1/2+.02,base1+.9,l1.D/2,.4,true,-.2],[.19,mid,.42*sy2,l2.D/2,.6,false,.1]]){
   const s=this.star(R,C.star);s.position.set(x,y,z);s.rotation.z=rz;s.userData={spin,x,y,z,rz};inner.add(s);stars.push(s);
   if(flare){const sp=new T.Sprite(new T.SpriteMaterial({map:this.flare(),blending:T.AdditiveBlending,depthWrite:false,transparent:true}));sp.scale.set(R*3,R*3,1);sp.position.set(x+R*.35,y+R*.4,z+R*.9);sp.userData={flare:R*3,phase:x};inner.add(sp)}}
  const box=new T.Box3().setFromObject(inner),size=box.getSize(new T.Vector3()),ctr=box.getCenter(new T.Vector3());inner.position.sub(ctr);root.add(inner);
  root.userData={w:size.x,h:size.y};this.model=root;return root},
 // Libera lo compartido cuando ya no queda ningún logo 3D.
 release(){
  if(!this.model)return;for(const g of this.geos||[])g.dispose();for(const t of this.tex||[])t.dispose();
  if(this.mats){this.mats.face.dispose();for(const k in this.mats.edges)this.mats.edges[k].dispose()}
  this.model.traverse(o=>o.isSprite&&o.material.dispose());this.model=null;this.mats=null;this.geos=[];this.tex=[]},
 // Sustituye visualmente el <img> de un envoltorio por un canvas WebGL transparente (el <img> sigue ahí como respaldo y texto alternativo).
 attach(wrap){
  if(!wrap||this.items.has(wrap)||!this.supported())return false;const T=window.THREE;let renderer;
  try{
   const canvas=document.createElement('canvas');canvas.className='wordmark-logo-3d';canvas.setAttribute('aria-hidden','true');
   renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setClearColor(0x000000,0);
   const scene=new T.Scene(),camera=new T.PerspectiveCamera(28,2,.1,100),model=this.build().clone(true),M=P.Wordmark.motion;
   scene.add(model);scene.add(new T.HemisphereLight(0xffffff,0xffc890,1.25));
   const key=new T.DirectionalLight(0xffffff,2.1);key.position.set(-2,3.5,5);scene.add(key);
   const rim=new T.DirectionalLight(0xffa24a,1.6);rim.position.set(4,-1,-3);scene.add(rim);
   const small=wrap.classList.contains('is-header'),hub=!small&&!!wrap.closest('.home-copy');
   const it={wrap,canvas,renderer,scene,camera,model,visible:true,ry:0,rx:0,rz:0,vy:0,vx:0,vz:0,s:1,vs:0,t0:performance.now(),amp:hub?.8:1,enter:!hub&&!!wrap.closest('#lobby-splash'),cw:0,ch:0,still:false,M};
   canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.detach(wrap)});
   wrap.addEventListener('click',it.click=()=>{it.s=.9;it.vs=3});
   if(typeof IntersectionObserver==='function'){it.io=new IntersectionObserver(es=>{for(const e of es)it.visible=e.isIntersecting;if(it.visible)this.wake()});it.io.observe(wrap)}
   wrap.append(canvas);wrap.classList.add('is-3d');this.items.set(wrap,it);this.start();return true
  }catch{try{renderer?.dispose()}catch{}wrap.classList.remove('is-3d');wrap.querySelector('.wordmark-logo-3d')?.remove();return false}},
 detach(wrap){
  const it=this.items.get(wrap);if(!it)return;this.items.delete(wrap);it.io?.disconnect();wrap.removeEventListener('click',it.click);
  it.canvas.remove();wrap.classList.remove('is-3d');try{it.renderer.dispose();it.renderer.forceContextLoss?.()}catch{}
  if(!this.items.size)this.release()},
 // Lobby.init (en game.js) crea los envoltorios antes de que este script se evalúe: se adoptan los existentes que no sean de cabecera.
 adopt(){if(typeof document==='undefined'||!this.supported())return;for(const w of [...(document.querySelectorAll?.('.wordmark-logo-wrap:not(.is-header)')||[])])this.attach(w)},
 start(){
  if(this.started||!this.supported())return;this.started=true;
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)this.wake()});this.wake()},
 wake(){if(this.raf)return;if(this.timer){clearTimeout(this.timer);this.timer=0}this.raf=requestAnimationFrame(now=>this.tick(now))},
 sleep(ms){this.raf=0;if(this.timer)clearTimeout(this.timer);this.timer=setTimeout(()=>{this.timer=0;this.wake()},ms)},
 // Ajusta el canvas (más grande que el logo para que el giro no se recorte) y la distancia de la cámara para que el modelo ocupe el ancho del envoltorio.
 fit(it,box){
  const T=window.THREE,cw=it.canvas.clientWidth,ch=it.canvas.clientHeight;if(!cw||!ch)return false;
  const pr=Math.min(2,window.devicePixelRatio||1);
  if(cw!==it.cw||ch!==it.ch||pr!==it.pr){it.cw=cw;it.ch=ch;it.pr=pr;it.renderer.setPixelRatio(pr);it.renderer.setSize(cw,ch,false);it.camera.aspect=cw/ch;
   const u=it.model.userData,t=2*Math.tan(it.camera.fov*Math.PI/360),dw=u.w/(box.width/cw*.98)/(t*it.camera.aspect),dh=u.h/.92/t,d=Math.max(dw,dh);
   it.camera.position.set(0,0,d);it.camera.far=d*4;it.camera.updateProjectionMatrix();it.still=false}
  return true},
 pose(it,t){
  for(const o of it.model.children[0].children){const d=o.userData;if(d.spin){o.rotation.y=d.spin*Math.sin(t*1.9+d.x*5);o.position.y=d.y+Math.sin(t*2.3+d.x*3)*.015}
   else if(d.flare){const k=.65+.35*Math.sin(t*3.1+d.phase*7);o.scale.set(d.flare*k,d.flare*k,1);o.material.rotation=t*.4}}},
 tick(now){
  this.raf=0;const awake=P.state?.mode==='menu'&&!document.hidden;const live=[];
  for(const it of [...this.items.values()]){if(!it.wrap.isConnected){this.detach(it.wrap);continue}if(it.visible)live.push(it)}
  if(!awake||!live.length){this.last=now;return this.sleep(awake?700:1000)}
  const reduced=!!P.Motion?.reduced?.();
  if(reduced){for(const it of live){const box=it.wrap.getBoundingClientRect();if(!box.width||!this.fit(it,box)||it.still)continue;
    it.model.rotation.set(-this.REST.rx*Math.PI/180,this.REST.ry*Math.PI/180,0);it.model.scale.set(1,1,1);it.canvas.style.opacity='';this.pose(it,0);it.renderer.render(it.scene,it.camera);it.still=true}
   return this.sleep(500)}
  if(now-this.last<14){this.raf=requestAnimationFrame(n=>this.tick(n));return}
  const dt=Math.min(.05,Math.max(.001,(now-this.last)/1000)),t=now/1000,tau=Math.PI*2;this.last=now;
  for(const it of live){
   const box=it.wrap.getBoundingClientRect();if(!box.width||!this.fit(it,box))continue;
   const M=it.M,S=M.SWAY,F=M.FOLLOW,ptr=M.ptr,a=it.amp,chase=now-ptr.t<F.idle,d=Math.PI/180;
   let ty=a*(this.REST.ry+S.ry*Math.sin(t*tau/S.py)),tx=a*(this.REST.rx+S.rx*Math.sin(t*tau/S.px)),tz=a*S.rz*Math.sin(t*tau/S.pz);
   if(chase){const nx=Math.max(-1,Math.min(1,(ptr.x-(box.left+box.width/2))/(innerWidth/2))),ny=Math.max(-1,Math.min(1,(ptr.y-(box.top+box.height/2))/(innerHeight/2)));ty=a*(this.REST.ry+F.ry*nx);tx=a*(this.REST.rx-F.rx*ny);tz=0}
   for(const [k,v,target] of [['ry','vy',ty],['rx','vx',tx],['rz','vz',tz]]){it[v]+=(M.K*(target-it[k])-M.C*it[v])*dt;it[k]+=it[v]*dt}
   it.vs+=(M.KS*(1-it.s)-M.CS*it.vs)*dt;it.s+=it.vs*dt;
   let ey=0,es=1,eo=1;if(it.enter){const e=Math.min(1,(now-it.t0)/M.ENTRY),b=1-Math.pow(1-e,3);ey=360*(1-b);es=.15+.85*b;eo=Math.min(1,e*3);if(e>=1)it.enter=false}
   it.canvas.style.opacity=eo<1?String(eo):'';
   it.model.rotation.set(-it.rx*d,(it.ry+ey)*d,-it.rz*d);it.model.scale.set(es*it.s,es*(2-it.s),es*it.s);
   this.pose(it,t);it.renderer.render(it.scene,it.camera)}
  this.raf=requestAnimationFrame(n=>this.tick(n))}
};
// P.Wordmark.image crea el envoltorio con el <img>; si el 3D arranca bien, el canvas lo tapa (el <img> queda de respaldo). La cabecera pequeña (still) no usa 3D.
if(P.Wordmark){const image=P.Wordmark.image;P.Wordmark.image=function(el,className,still){const ok=image.apply(this,arguments);if(ok&&!still)P.Logo3d.attach(el.querySelector('.wordmark-logo-wrap'));return ok}}
if(P.Logo3d.supported())P.Logo3d.adopt();
