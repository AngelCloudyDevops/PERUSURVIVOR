'use strict';
// Expansión separada de la transformación/ulti: obliga a recorrer la azotea
// mientras la bandada viva acelera el siguiente ataque del Gallinazo.
P.VultureDomain={
 eligible(e){return !!e&&e.kind==='vulture'&&e.mapBoss},
 init(e){return e.vultureDomainState||(e.vultureDomainState={domainUsed:false,pressure:0,notice:'HAMBRE DE CARROÑA · LIMPIA LA BANDADA',noticeUntil:(P.state.elapsed||0)+3})},
 points(){return [{x:-255,y:-125,r:54},{x:245,y:-105,r:54},{x:0,y:190,r:54}]},
 start(e){const d=this.init(e);d.domainUsed=true;d.timer=7;d.nodes=this.points();d.sequence=[0,2,1];d.step=0;d.last=-1;d.wind=0;e.phase='vulture-domain';e.attack='domain';e.attackT=99;d.notice='TECHOS SIN SALIDA · ENCIENDE 1 · 3 · 2';d.noticeUntil=(P.state.elapsed||0)+7;P.state.danger=P.state.danger.filter(q=>q.glyph!=='FEATHER');P.Audio.play('vulture-wing');return true},
 finish(e,success){const d=this.init(e),p=P.state.player;if(success){e.hp=Math.max(1,e.hp-e.max*.04);e.hit=.35;d.notice='CIELO ABIERTO · GALLINAZO EXPUESTO'}else{P.Entities.hurt(p,20,0,P.Attributes?.source(e,'special'));d.notice='LA BANDADA CERRÓ EL TECHO'}d.noticeUntil=(P.state.elapsed||0)+2;e.phase='vulture-recover';e.recovery=.8;e.attackT=1.2;return success},
 tick(e,dt){const d=this.init(e),p=P.state.player;d.timer-=dt;d.wind+=dt*.8;const old={x:p.x,y:p.y},force=26*dt;p.x+=Math.cos(d.wind)*force;p.y+=Math.sin(d.wind)*force;P.Terrain.resolve?.(p,old,p.r||18);const node=d.nodes[d.sequence[d.step]];if(node&&d.last!==d.sequence[d.step]&&Math.hypot(p.x-node.x,p.y-node.y)<node.r){d.last=d.sequence[d.step];d.step++;P.Audio.play('vulture-impact')}if(d.step===d.sequence.length)return this.finish(e,true);if(d.timer<=0)return this.finish(e,false)},
 pressure(e,dt){const d=this.init(e),alive=P.state.enemies.filter(q=>q.vultureMinion&&q.hp>0).length;d.pressure=Math.min(3,alive);if(e.phase==='approach'&&Number.isFinite(e.attackT)&&d.pressure)e.attackT-=dt*d.pressure*.1;return d.pressure},
 draw(ctx,e){if(!this.eligible(e))return;const d=this.init(e);if(e.phase==='vulture-domain'){ctx.save();ctx.fillStyle='#08081666';ctx.fillRect(-700,-500,1400,1000);d.nodes.forEach((z,i)=>{const done=d.sequence.indexOf(i)<d.step,current=i===d.sequence[d.step];ctx.fillStyle=done?'#79d49a44':current?'#f0cf6d55':'#6a4d8550';ctx.strokeStyle=done?'#79d49a':current?'#ffe48a':'#9c7ab8';ctx.lineWidth=current?4:2;ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#fff0c6';ctx.textAlign='center';ctx.font='bold 12px monospace';ctx.fillText(String(d.sequence.indexOf(i)+1),z.x,z.y+4)});ctx.restore()}if(d.noticeUntil>(P.state.elapsed||0)){ctx.save();ctx.fillStyle='#100b20dd';ctx.fillRect(e.x-225,e.y-255,450,34);ctx.fillStyle='#f5dcff';ctx.textAlign='center';ctx.font='bold 12px monospace';ctx.fillText(d.notice,e.x,e.y-233);ctx.restore()}}
};
{
 const move=P.Vulture.move,draw=P.Vulture.draw;
 P.Vulture.move=function(e,dt){if(!P.VultureDomain.eligible(e))return move.call(this,e,dt);const d=P.VultureDomain.init(e);if(e.phase==='vulture-domain')return P.VultureDomain.tick(e,dt);if(e.phase==='approach'&&e.hp<=e.max*.5&&!d.domainUsed)return P.VultureDomain.start(e);P.VultureDomain.pressure(e,dt);return move.call(this,e,dt)};
 P.Vulture.draw=function(ctx,e){const result=draw.call(this,ctx,e);P.VultureDomain.draw(ctx,e);return result};
}
