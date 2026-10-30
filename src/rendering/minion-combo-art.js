'use strict';
// Authored full-body poses. Timing follows the authoritative event timeline, never a wall clock.
P.MinionComboArt={
 professionKeys:['chef','architect','elf'],
 ids:['punch','sweep',...['chef','architect','elf'].flatMap(id=>[id,id+'-veteran',id+'-elite'])].map(id=>'combo-'+id),
 key(e){const key=e.attackProfile?.tactic||P.MinionTactics?.key(e);if(key==='punch'||key==='sweep')return 'combo-'+key;if(!this.professionKeys.includes(key)||!P.MinionProfessions.definition(e))return null;return 'combo-'+key+(P.MinionEvolution.rank(e)===1?'-veteran':P.MinionEvolution.rank(e)===2?'-elite':'')},
 needed(){return this.ids.filter(id=>!id.startsWith('combo-elf')||P.Maps?.selected==='navidad')},
 frame(e){const t=e.tactic,key=e.attackProfile?.tactic;if(!t||!this.key(e))return null;const events=t.events,age=t.age;if(age<events[0].at)return 0;
  let index=0;for(let i=1;i<events.length;i++)if(age>=events[i].at)index=i;
  const event=events[index],local=age-event.at,next=events[index+1];
  if(next&&age>=next.at-.22){if(key==='punch'||key==='chef')return index===0?2:4;return 3;}
  if(key==='punch'||key==='chef'){if(local<.2)return index===0?1:index===1?3:5;return index===2?2:index===1?4:2;}
  if(key==='sweep'){if(index===1)return local<.25?4:5;return local<.25?1:2;}
  return local<.2?(index===0?1:4):(index===0?2:5);
 },
 sprite(e,dead){if(dead)return null;const index=this.frame(e),id=this.key(e),sheet=id&&P.WalkArt.sheets[id];if(id&&!sheet?.ready)P.WalkArt.load(id,true);if(index===null||!sheet?.ready)return null;const frame=sheet.frames[index];return frame?{sheet,frame,index,renderScale:e.profession?[.92,1,1.08][P.MinionEvolution.rank(e)]:1}:null}
};
