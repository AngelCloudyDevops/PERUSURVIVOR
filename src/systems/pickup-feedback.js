'use strict';
// Sonido y pulso de la barra al recoger XP; envuelve Systems.collect sin tocar progression.js.
P.PickupFeedback={combo:0,at:-9,timer:0,
note(){const s=P.state;if(s.elapsed<this.at||s.elapsed-this.at>.5)this.combo=0;this.at=s.elapsed;P.Audio?.pickup?.(this.combo++);this.pulse()},
pulse(){if(this.timer||P.Ambient?.reduced?.matches||typeof document==='undefined'||typeof setTimeout!=='function')return;const el=P.$?.('#hud .xp');if(!el)return;el.classList.add('pulse');this.timer=setTimeout(()=>{this.timer=0;el.classList.remove('pulse')},170)}
};
{const collect=P.Systems.collect;P.Systems.collect=function(dt){const s=P.state,xp=s.xp,lv=s.level,r=collect.call(this,dt);if(s.xp>xp||s.level>lv)P.PickupFeedback.note();return r}}
