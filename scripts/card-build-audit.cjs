'use strict';
// Solo QA local: juega mediante los controles existentes; no se incluye en dist.
const fs=require('node:fs'),{performance}=require('node:perf_hooks'),{load,policy}=require('./full-run-audit.cjs');
function play(seed,runMode='chaos',strategy='fusion'){
 const P=load(seed),s=P.state;let choices=[],title='',direction={x:0,y:0},result=null;P.UI.show=(t,d,buttons)=>{title=t;choices=buttons;P.UI.upgradePicked=false};P.Core.direction=()=>direction;const finish=P.Game.finish;P.Game.finish=function(win){result=win?'win':'death';return finish.call(this,win)};P.Maps.selected='campo';P.RunMode.selected=runMode;s.chosen=P.Data.characters.findIndex(c=>c.id==='sideral');P.Game.start();const log=[],timings=[],limit=runMode==='chaos'?1800:300;let decision=0,steps=0;
 while(!result&&s.elapsed<limit&&steps++<limit*45){
  if(s.mode==='upgrade'){
   if(title==='VINCULAR APOYO'){const confirm=choices.find(o=>o.title==='Confirmar fusión');if(confirm&&!confirm.disabled)confirm.action();else choices.find(o=>/^Colazo|^Huevo/.test(o.title))?.action();continue}
   const cards=choices.filter(o=>o.card);const weight=o=>{const id=o.card.id;if(id.startsWith('fusion:'))return strategy==='fusion'?100:-10;if(id.startsWith('modify:'))return 80;if(id==='orbit'||id==='cards')return 90-(s.player.powerRanks[id]||0)*6;if(id.startsWith('sideral-arsenal:unlock:'))return 95;if(id.startsWith('sideral-arsenal:'))return 65;if(id==='stat:health')return 45;return 30};cards.sort((a,b)=>weight(b)-weight(a));const chosen=cards[0];if(!chosen)throw Error('Sin oferta válida');log.push({level:s.level,at:+s.elapsed.toFixed(1),id:chosen.card.id});chosen.action();continue;
  }
  if(s.mode==='item'){choices.find(o=>!o.disabled)?.action();continue}
  if(!['play','loot-opening'].includes(s.mode))throw Error('Modo inesperado '+s.mode);
  if(s.elapsed>=decision){direction=policy(P);decision=s.elapsed+.2;P.SideralArsenal.request(2);P.SideralArsenal.request(3);if(P.state.ultimate?.sideralCharge>=100)P.Ultimate.activate()}
  const began=performance.now();P.Game.update(1/30);timings.push(performance.now()-began);
 }
 if(steps>=limit*45)throw Error('La elección o el reloj quedaron bloqueados');timings.sort((a,b)=>a-b);return{seed,runMode,strategy,result:result||'limit',seconds:+s.elapsed.toFixed(1),level:s.level,kills:s.kills,hp:s.player.hp,build:s.player.cardBuild,choices:log,logicMs:{median:timings[Math.floor(timings.length*.5)],p95:timings[Math.floor(timings.length*.95)],max:timings.at(-1)}};
}
if(require.main===module){const results=[];for(const [seed,mode,strategy]of [[101,'chaos','auto'],[202,'chaos','fusion'],[303,'quick','fusion']]){const result=play(seed,mode,strategy);results.push(result);console.log(JSON.stringify({...result,choices:result.choices.length,build:{fusions:result.build.fusions,modification:result.build.modification}}))}fs.mkdirSync('output',{recursive:true});fs.writeFileSync('output/card-build-audit.json',JSON.stringify({note:'Simulación sin renderizado ni cambios de estadísticas; CPU no equivale a FPS del navegador.',results},null,2))}
module.exports={play};
