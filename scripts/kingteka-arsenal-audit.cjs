'use strict';
// Local headless full matches for the three real Kingteka weapons.
const fs=require('node:fs'),path=require('node:path'),{load,policy}=require('./full-run-audit.cjs');

function play({map,seed,strategy,baseline=false}){
 const P=load(seed),s=P.state;P.Maps.selected=map;s.chosen=7;
 if(baseline){Object.assign(P.KingtekaArsenal.profiles.shotgun,{cooldown:.95,powerScale:.62});Object.assign(P.KingtekaArsenal.profiles.gallinazo,{powerScale:.54,pierce:1});Object.assign(P.KingtekaArsenal.profiles.golpe,{cooldown:.72,damageScale:1.2})}
 let choices=[],result=null,currentCastWeapon=null;
 P.UI.show=(title,description,buttons)=>{choices=buttons};
 const finish=P.Game.finish.bind(P.Game);P.Game.finish=win=>{result=win?'win':'death';finish(win)};
 P.Game.start();const player=s.player;
 const weaponUse={shotgun:{casts:0,damage:0,miniDamage:0},gallinazo:{casts:0,damage:0,miniDamage:0},golpe:{casts:0,damage:0,miniDamage:0}},switches=[],unlocks=[],minis=[];
 const arsenal=P.KingtekaArsenal,apply=arsenal.apply.bind(arsenal),switchWeapon=arsenal.switch.bind(arsenal);
 arsenal.apply=function(p,id){const ok=apply(p,id);if(ok&&id.startsWith('arsenal:unlock:'))unlocks.push({time:Number(s.mapTime.toFixed(1)),weapon:id.split(':')[2]});return ok};
 arsenal.switch=function(p,index,force){const from=arsenal.active(p),ok=switchWeapon(p,index,force);if(ok&&from!==arsenal.active(p))switches.push({time:Number(s.mapTime.toFixed(1)),from,to:arsenal.active(p)});return ok};
 const cast=P.Combat.cast.bind(P.Combat);P.Combat.cast=function(...args){const weapon=arsenal.active(s.player),before=s.shots.length;currentCastWeapon=weapon;const ok=cast(...args);currentCastWeapon=null;if(ok)weaponUse[weapon].casts++;for(const shot of s.shots.slice(before))shot.arsenalWeapon=weapon;return ok};
 const hurt=P.Entities.hurt.bind(P.Entities);P.Entities.hurt=function(...args){const e=args[0],before=e?.hp,result=hurt(...args),weapon=args[3]?.arsenalWeapon||currentCastWeapon;if(weapon&&Number.isFinite(before)&&Number.isFinite(e.hp))weaponUse[weapon].damage+=Math.max(0,before-e.hp);return result};
 const create=P.Minibosses.create.bind(P.Minibosses),hurtMini=P.Minibosses.hurt.bind(P.Minibosses);
 P.Minibosses.create=(...args)=>{const e=create(...args);minis.push({id:e.miniId,name:e.name,spawn:Number(s.mapTime.toFixed(1)),kill:null});return e};
 P.Minibosses.hurt=(e,...args)=>{const alive=e.hp>0,before=e.hp,weapon=args[2]?.arsenalWeapon||currentCastWeapon;hurtMini(e,...args);if(weapon&&Number.isFinite(before))weaponUse[weapon].miniDamage+=Math.max(0,before-e.hp);if(alive&&e.hp<=0){const m=minis.find(q=>q.id===e.miniId);if(m)m.kill=Number(s.mapTime.toFixed(1))}};
 let direction={x:0,y:0},decision=0,steps=0;P.Core.direction=()=>direction;
 while(!result&&s.elapsed<360&&steps++<360*45){
  if(s.mode==='upgrade'){const rank=title=>title.startsWith('EVOLUCIONAR')?0:title.includes('Rango')?1:title.startsWith('NUEVA ARMA')?2:title.includes('DESBLOQUEAR')?3:4,picked=choices.map((o,i)=>({o,i,rank:rank(o.title)})).sort((a,b)=>a.rank-b.rank||a.i-b.i)[0];if(!picked)throw Error('Missing upgrade');picked.o.action();continue}
  if(s.mode==='item'){choices[0]?.action();continue}if(s.mode!=='play'&&s.mode!=='loot-opening')throw Error('Unexpected mode '+s.mode);
  if(s.elapsed>=decision){const seen=s.enemies.filter(e=>e.hp>0&&P.Combat.onScreen(e,player)).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));
   if(strategy==='adaptive'){const mini=seen.find(e=>e.miniboss||e.boss),target=mini||seen[0],d=target?Math.hypot(target.x-player.x,target.y-player.y):Infinity,index=!Number.isFinite(d)?1:d<=115?3:mini&&d<=520||d>=260?2:1;arsenal.switch(player,index)}
   else {const index={shotgun:1,gallinazo:2,golpe:3}[strategy];if(arsenal.init(player).unlocked[arsenal.order[index-1]])arsenal.switch(player,index)}
   direction=policy(P);decision=s.elapsed+.2;
   if(player.id==='kingteka'&&s.ultimate.charge>=100&&seen.some(e=>e.miniboss&&Math.hypot(e.x-player.x,e.y-player.y)<300))P.Ultimate.activate();
  }
  P.Game.update(1/30);
 }
 if(steps>=360*45)throw Error('Clock stalled '+map+' '+strategy);
 return {map,seed,strategy,result:result||'timeout',seconds:Number(s.elapsed.toFixed(1)),kills:s.kills,level:s.level,hp:Math.round(player.hp),maxHp:player.maxHp,weaponUse,switches,unlocks,minis};
}

if(require.main===module){const adaptive=process.argv.includes('--adaptive'),baseline=process.argv.includes('--baseline'),file=path.join(__dirname,baseline?'../docs/kingteka-arsenal-baseline.json':'../docs/kingteka-arsenal-audit.json'),runs=[];for(const strategyName of (adaptive?['adaptive']:['shotgun','gallinazo','golpe']))for(const seed of [101,202,303])for(const map of ['campo','plaza','machu']){const run=play({map,seed,strategy:strategyName,baseline});runs.push(run);console.log(JSON.stringify({strategy:strategyName,seed,map,result:run.result,seconds:run.seconds,level:run.level,kills:run.kills,weaponUse:run.weaponUse,mini:run.minis.map(m=>({name:m.name,spawn:m.spawn,kill:m.kill}))}))}const report=adaptive?JSON.parse(fs.readFileSync(file,'utf8')):null;if(adaptive)report.runs.push(...runs);const strategy={shotgun:'Keep Escopeta active throughout',gallinazo:'Switch to Gallinazo when unlocked, keep it active',golpe:'Switch to Golpe de cuerpo when unlocked, keep it active',adaptive:'Golpe a 115 u o menos; Gallinazo contra minijefe visible a 520 u o menos o rivales a 260 u o más'};fs.writeFileSync(file,JSON.stringify({version:1,sourceSha:require('node:child_process').execFileSync('git',['rev-parse','HEAD'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8'}).trim(),parameters:baseline?'Perfiles de antes del ajuste; el resto del código usa el checkout actual':'Perfiles ajustados; checkout actual',strategy,hz:30,secondsLimit:360,runs:adaptive?report.runs:runs},null,2)+'\n')}
module.exports={play};
