'use strict';
// Guardados crudos de cada versión del meta-progreso (v1..v5). Cada uno es una función de P.Meta para reutilizar blank().
const g=(id,character,fresh,extra={})=>({id,character,tier:'common',fresh,refund:fresh?0:15,at:null,copies:0,...extra});
const chars={cristorata:{upgrades:{power:2,speed:1},runs:4,wins:1,kills:90,bestTime:100,bestLevel:6},cuy:{upgrades:{},runs:0,wins:0,kills:0,bestTime:0,bestLevel:1},fuzo:{upgrades:{magnet:1},runs:2,wins:0,kills:12,bestTime:40,bestLevel:3},alan:{upgrades:{},runs:1,wins:0,kills:3,bestTime:20,bestLevel:2}};
const base=(version,M)=>({version,wallet:210,earned:480,characters:JSON.parse(JSON.stringify(chars)),receipts:[{id:'r1',character:'fuzo',coins:12,win:false},{id:'r2',character:'najasor',coins:30,win:true}]});
module.exports={
 v1:M=>base(1,M),
 v2:M=>({...base(2,M),inventory:{lunch:2,coffee:1},prepared:['lunch']}),
 // v1/v2 con campos que la versión nunca leyó: deben seguir ignorándose
 v2sucio:M=>({...base(2,M),unlocked:['cerdito'],gacha:{draws:9,epic:1,legend:2},gachaHistory:[g('h1','najasor',true)],gachaStars:{fuzo:{rank:3,copies:2}},gachaLast:g('h2','fuzo',true),gachaBatch:[g('h3','fuzo',false)]}),
 v2cerdito:M=>({...base(2,M),characters:{...base(2,M).characters,cerdito:{upgrades:{power:3},runs:5,wins:2,kills:40,bestTime:90,bestLevel:8}}}),
 v2sinrecibo:M=>({...base(2,M),receipts:[{id:'x',character:'cerdito',coins:3,win:false}]}),
 v3:M=>({...base(3,M),unlocked:['cristorata','cuy','paloma','najasor','fuzo'],gacha:{draws:7,epic:3,legend:5},gachaHistory:[g('a','najasor',true),g('b','fuzo',true),g('c','fuzo',false),g('d','cuy',false),g('e','cuy',false),g('f','fantasma',false)],gachaLast:g('f','fantasma',false),gachaBatch:[g('d','cuy',false)],gachaStars:{fuzo:{rank:5,copies:50}},skins:{unlocked:['cerdito-vtuber'],equipped:{'kingteka-animals':'cerdito-vtuber'}}}),
 v3cerdito:M=>({...base(3,M),unlocked:['cristorata','cuy','paloma'],gacha:{draws:2,epic:0,legend:0},gachaHistory:[g('a','cerdito',false),g('b','cuy',false)],gachaStars:{cerdito:{rank:2,copies:1}}}),
 v3estrellas:M=>({...base(3,M),unlocked:['cristorata','cuy','paloma','kingteka'],gacha:{draws:3,epic:0,legend:0},gachaHistory:[g('a','kingteka',false),g('b','cerdito',false),g('c','kingteka',false)],gachaStars:{}}),
 v4:M=>({...base(4,M),unlocked:['cristorata','cuy','paloma','makanaky','sideral','alan'],gacha:{draws:7,epic:3,legend:5},gachaHistory:[g('a','alan',true)],gachaStars:{alan:{rank:2,copies:4}},skins:{unlocked:['cerdito-vtuber'],equipped:{'kingteka-animals':'cerdito-vtuber'}}}),
 v4cerdito:M=>({...base(4,M),unlocked:['cristorata','cuy','paloma','cerdito'],gachaStars:{cerdito:{rank:3,copies:4}},characters:{...base(4,M).characters,kingteka:{upgrades:{power:1},runs:2,wins:1,kills:10,bestTime:60,bestLevel:4},cerdito:{upgrades:{power:3,speed:2},runs:5,wins:2,kills:40,bestTime:90,bestLevel:8}},skins:{unlocked:[],equipped:{}}}),
 v5:M=>{const d=M.blank();d.wallet=210;d.earned=480;d.unlocked.push('alan','fuzo');d.gacha={draws:4,epic:1,legend:2};d.gachaHistory=[g('a','alan',true)];d.gachaStars={alan:{rank:3,copies:5}};d.characters=JSON.parse(JSON.stringify(chars));d.skins={unlocked:['cerdito-vtuber'],equipped:{'kingteka-animals':'cerdito-vtuber'}};d.inventory={lunch:3};d.prepared=['lunch'];d.receipts=[{id:'r',character:'alan',coins:9,win:false}];return d}
};
