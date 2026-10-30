'use strict';
P.Muzzle={
 supports(p,a){return !!P.Data.muzzleAnchors[p.id]&&['BULLET','FISH','ROACH','DIAPER','CONTRA_ORB'].includes(a.glyph)},
 recoil(p){const u=p.ultimate||(p===P.state.player?P.state.ultimate:null),d=u?.recoil?7*u.recoil/.13:0,angle=p.attackAim??p.aim??0;return {x:-Math.cos(angle)*d,y:-Math.sin(angle)*d}},
 point(p){const anchors=P.Data.muzzleAnchors[p.id];if(!anchors)return null;const direction=P.PlayerAttackArt.direction(p),frame=p.moving?P.WalkArt.frame(p.walkPhase):0,anchor=anchors[direction.row*6+frame],dx=anchor[0]*(direction.flip?-1:1),dy=anchor[1],r=this.recoil(p),hurt=P.PlayerFeedback?.pose(p);if(hurt&&!hurt.dead){const c=Math.cos(hurt.angle),s=Math.sin(hurt.angle);return {x:p.x+hurt.x+dx*c-dy*s+r.x,y:p.y+21.6+hurt.y+dx*s+dy*c+r.y,row:direction.row,frame}}return {x:Math.round(p.x)+dx+r.x,y:Math.round(p.y+21.6)+dy+r.y,row:direction.row,frame}},
 flash(e){const actors=[P.state.player,...(P.Coop?.peers||[])],p=actors.find(p=>p&&p.id===e.ownerId&&(p.slot??null)===(e.ownerSlot??null));return p?.hp>0&&p.castSerial===e.castSerial&&P.PlayerAttackArt.progress(p)!==null?this.point(p)||e:e},
 blocker(x,y,tx,ty){const steps=Math.max(1,Math.ceil(Math.hypot(tx-x,ty-y)/2));for(let i=0;i<=steps;i++){const px=x+(tx-x)*i/steps,py=y+(ty-y)*i/steps,obstacle=P.Terrain.hit(px,py,5);if(obstacle)return {x:px,y:py,obstacle}}return null},
 range(p,origin,angle,r){const dx=origin.x-p.x,dy=origin.y-p.y,b=dx*Math.cos(angle)+dy*Math.sin(angle);return Math.max(0,-b+Math.sqrt(Math.max(0,b*b+r*r-dx*dx-dy*dy)))}
};
