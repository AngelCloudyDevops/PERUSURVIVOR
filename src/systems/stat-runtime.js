'use strict';
// Normaliza entidades creadas por sistemas especiales y aplica regeneración una vez por frame.
{
 const update=P.Game.update;
 P.Game.update=function(dt){
  if(P.state?.mode==='play')P.Stats.step(P.state,dt);
  return update.call(this,dt)
 };
 const hurt=P.Entities.hurt;
 P.Entities.hurt=function(entity,damage,push=0,source=null){
  const before=Math.max(0,Number(entity?.hp)||0),result=hurt.call(this,entity,damage,push,source);
  P.Stats.lifeSteal(source,Math.max(0,before-Math.max(0,Number(entity?.hp)||0)));
  return result
 };
 const codex=P.Lobby?.renderCodexDetail;
 if(codex)P.Lobby.renderCodexDetail=function(entry){
  const result=codex.call(this,entry),copy=typeof document!=='undefined'&&document.querySelector?.('#codex-detail-copy');
  if(!entry||!copy)return result;
  const actor={...entry,miniboss:entry.type==='mini',miniMap:entry.miniKey,mapBoss:entry.type==='boss',max:entry.hp};P.Attributes.init(actor);
  const details=document.createElement('details'),summary=document.createElement('summary'),grid=document.createElement('dl');details.className='codex-combat-stats';summary.textContent='ESTADÍSTICAS DE COMBATE';grid.className='codex-stats';
  for(const [label,value]of [...P.Stats.channelRows(actor),...P.Stats.advancedRows(actor)]){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label.toUpperCase();dd.textContent=String(value);grid.append(dt,dd)}details.append(summary,grid);copy.append(details);return result
 }
}
