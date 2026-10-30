'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const test=require('node:test');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const gallerySource=fs.readFileSync(path.join(root,'src/ui/card-gallery.js'),'utf8');
const hudSource=fs.readFileSync(path.join(root,'src/ui/attack-hud.js'),'utf8');
const css=fs.readFileSync(path.join(root,'src/ui/styles.css'),'utf8');

function gallery(){
 const P={
  Data:{characters:[{id:'cirilo',name:'CiriloTV',color:'#f05d83'},{id:'kingteka',name:'Kingteka',color:'#dca63a'},{id:'makanaky',name:'Makanaky',color:'#e2a95c'}]},
  AbilityCards:{
   entries:{
    cirilo:{kind:'domain',frame:'domain-demon',art:'cirilo.webp',variants:[{id:'nocturna',edition:'Edición nocturna',art:'cirilo-night.webp'}]},
    kingteka:{kind:'ultimate',frame:'fire',title:'Título oficial',description:'Descripción técnica oficial.',art:'kingteka.webp'},
    makanaky:{kind:'domain',frame:'domain-royal',art:'makanaky.webp'}
   },
   frame(name){return name==='domain-demon'?{visual:'demon'}:name==='domain-royal'?{visual:'fire',futureVisual:'royal'}:{visual:'fire'}}
  },
  CharacterSkins:{
   catalog:{pig:{id:'pig',characterId:'kingteka',name:'Cerdito VTuber',description:'Apariencia coleccionable.',rarity:'legendary',ultimateArt:'pig.webp'}},
   rarities:{legendary:{name:'Legendaria',color:'#f4c84a'}}
  }
 };
 vm.runInNewContext(gallerySource,{P,console});
 return P.CardGallery;
}

test('la colección se genera desde el registro y expande variantes futuras',()=>{
 const cards=gallery().entries();
 assert.equal(cards.length,5);
 assert.deepEqual(Array.from(cards.map(card=>card.key)),['cirilo:base','cirilo:nocturna','kingteka:base','makanaky:base','skin:pig']);
 assert.equal(cards[0].visual,'demon');
 assert.equal(cards[1].edition,'Edición nocturna');
 assert.equal(cards[2].visual,'fire');
 assert.equal(cards[2].title,'Título oficial');
 assert.equal(cards[2].description,'Descripción técnica oficial.');
 assert.equal(cards[3].visual,'royal');
 assert.equal(cards[4].kind,'skin');
 assert.equal(cards[4].edition,'Legendaria · Skin');
});

test('todas las habilidades implementadas comparten descripción y ficha técnica',()=>{
 const source=fs.readFileSync(path.join(root,'src/systems/ability-cards.js'),'utf8'),P={UI:{hud(){}},state:{}};
 vm.runInNewContext(source,{P,console});
 for(const [id,entry] of Object.entries(P.AbilityCards.entries)){
  assert(entry.title,`${id}: falta título`);
  assert(entry.description?.length>30,`${id}: falta descripción funcional`);
  assert(entry.details?.length>=3,`${id}: falta ficha técnica`);
 }
 const reference=fs.readFileSync(path.join(root,'src/ui/reference-menus.js'),'utf8');
 assert.match(reference,/entry\?\.description/);
 assert.match(reference,/entry\?\.details/);
 assert.match(reference,/character-skill-detail-grid/);
});

test('la galería ofrece inclinación, giro y controles accesibles sin bucle permanente',()=>{
 for(const contract of ['onpointermove','ondblclick','onkeydown','requestAnimationFrame','aria-pressed','image.loading'])assert.match(gallerySource,new RegExp(contract.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
 assert.doesNotMatch(gallerySource,/setInterval|requestAnimationFrame\s*\([^)]*requestAnimationFrame/);
 for(const selector of ['.codex-section-card','.collectible-stage','.collectible-holo','.collectible-card-back','prefers-reduced-motion'])assert.match(css,new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
 assert.doesNotMatch(gallerySource,/id='codex-tabs'/);
});

test('el álbum abre un visor y recorre sólo las cartas visibles',()=>{
 const cards=gallery(),visible=cards.entries();
 cards.render=()=>{};
 cards.selected='cirilo:base';
 cards.navigate(1,visible);
 assert.equal(cards.selected,'cirilo:nocturna');
 cards.navigate(-1,visible);
 assert.equal(cards.selected,'cirilo:base');
 for(const contract of ['card-album-grid','card-viewer','aria-modal','card-viewer-arrow','ArrowLeft','ArrowRight','swipe'])assert.match(gallerySource,new RegExp(contract));
 for(const selector of ['.card-album-grid','.card-viewer-panel','.card-viewer-strip','.card-strip-thumb','.collection-card-frame'])assert.match(css,new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
});

test('el marco demoníaco termina de entrar antes de pasar al pulso de reposo',()=>{
 assert.match(hudSource,/ability-demon-horns-in/);
 assert.match(css,/ability-demon-base-in \.42s/);
 assert.match(css,/ability-demon-wings-in \.62s \.16s/);
 assert.match(css,/ability-demon-horns-in \.46s \.46s/);
 assert.doesNotMatch(css,/ability-demon-(?:base|wing|horns)-in[^}]*scale\((?:0|\.\d)/);
});

test('el archivo de amenazas deja de animarse mientras se observan coleccionables',()=>{
 const lobby=fs.readFileSync(path.join(root,'src/ui/lobby.js'),'utf8');
 assert.match(lobby,/this\.codexView!=='collectibles'/);
});
