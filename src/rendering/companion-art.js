'use strict';
// Reacciones cooperativas exclusivas del dominio. Los atlas no sustituyen las poses normales.
P.CompanionArt={
 catalogs:{
  classic:{url:'assets/companions/companions-classic-v1.webp',rows:['cristorata','cuy','paloma','alan','alberto','keiko','ollanta']},
  streamers:{url:'assets/companions/companions-streamers-v1.webp',rows:['kingteka','shaka','najasor','cirilo','fuzo','charles','axelbenba']},
  extra:{url:'assets/companions/companions-extra-v1.webp',rows:['cerdito','sustento','cevichero','g5']}
 },
 sheets:{},lookup:{},
 init(){for(const [key,data]of Object.entries(this.catalogs)){data.rows.forEach((id,row)=>this.lookup[id]={key,row});if(typeof Image==='undefined')continue;const image=new Image(),sheet=this.sheets[key]={image,ready:false,rows:data.rows.length};image.onload=()=>sheet.ready=true;image.onerror=()=>sheet.failed=true;image.src=data.url}},
 warning(d){const threats=d.targets?.filter(q=>!q.dead&&q.warning>0)||[],bolt=d.bolts?.filter(b=>!b.hit).sort((a,b)=>a.z-b.z)[0],target=threats.sort((a,b)=>a.depth-b.depth)[0];return bolt&&bolt.z<3?Math.sign(bolt.lane-(d.lane||0))||1:target?Math.sign(target.lane-(d.lane||0))||1:0},
 pose(d){if(d.age-P.Domain.entry<.72)return 0;if((d.companionShock||0)>0||this.warning(d))return 1;if((d.assistFlash||0)>0||d.combo>=8)return 3;return 2},
 draw(ctx,actor,x,y,height,d,reduced=false){const found=this.lookup[actor?.id],sheet=found&&this.sheets[found.key];if(!found||!sheet?.ready)return false;const pose=this.pose(d),sw=sheet.image.width/4,sh=sheet.image.height/sheet.rows,bob=!reduced&&pose===2?Math.round(Math.sin(d.age*24)*2):0,scale=height/sh;ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalAlpha=.96;ctx.drawImage(sheet.image,Math.round(pose*sw),Math.round(found.row*sh),Math.round(sw),Math.round(sh),Math.round(x-sw*scale/2),Math.round(y-sh*scale+bob),Math.round(sw*scale),Math.round(sh*scale));ctx.restore();return true}
};
P.CompanionArt.init();
