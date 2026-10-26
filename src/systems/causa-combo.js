'use strict';
// Three serializable cards per player. Charge stays compatible with existing ultimates.
P.CausaCombo={
names:{caos:'Caos',aguante:'Aguante',hazana:'Hazaña'},
enabled(p=P.state.player){return ['kingteka','alberto'].includes(p?.id)||!!P.AnimalUltimate?.definition(p)},
fresh(){return {caos:0,aguante:0,hazana:0,combat:0,credits:0,pressure:0,bossPressure:0}},
ensure(u=P.state.ultimate){return u?(u.combo??=this.fresh()):null},
training(){return !!(P.state.practice||P.state.devRun)},
blocked(source,u=P.state.ultimate){return !!(source?.comboBlocked||source?.ultimate||u?.left>0||P.state.court)},
sync(u){const c=this.ensure(u);if(!c)return;const full=['caos','aguante','hazana'].every(k=>c[k]>=100-1e-7);u.charge=full?100:Math.min(99,Math.floor((c.caos+c.aguante+c.hazana)/3))},
gain(source){const u=P.state.ultimate,c=this.ensure(u);if(!c||!this.enabled()||this.training()||P.state.mode!=='play'||this.blocked(source,u))return;c.credits=Math.min(1,c.credits+.75)},
hit(e,source){const c=this.ensure();if(!c||!this.enabled()||this.training()||this.blocked(source)||P.state.mode!=='play')return;c.pressure=2;if(e.boss||e.mapBoss||e.miniboss||e.heavy)c.bossPressure=2},
tick(dt){const s=P.state,p=s.player,u=s.ultimate;if(!u||!this.enabled(p)||this.training()||s.mode!=='play'||p.hp<=0||!Number.isFinite(dt)||dt<=0||P.Coop?.active&&!P.Combat.server)return;dt=Math.min(dt,1);const c=this.ensure(u);if(this.blocked(null,u)){c.credits=c.pressure=c.bossPressure=0;return}const view=P.Combat.view(p),combat=c.pressure>0||s.enemies.some(e=>e.hp>0&&P.Combat.onScreen(e,p,view));if(combat){const bonus=Math.min(c.credits,.5*dt);c.credits-=bonus;c.combat+=dt;c.caos=Math.min(100,c.caos+100/52*dt+bonus);c.aguante=Math.min(100,c.aguante+100/45*dt);c.hazana=Math.min(100,c.hazana+(100/52+(c.bossPressure>0?.6:c.pressure>0?.35:0))*dt)}c.pressure=Math.max(0,c.pressure-dt);c.bossPressure=Math.max(0,c.bossPressure-dt);if(!combat)c.credits=0;this.sync(u)},
consume(u=P.state.ultimate){if(!u)return;u.combo=this.fresh();u.charge=0},
init(){if(typeof Image==='undefined')return;const panel=document.createElement('div');panel.id='causa-combo';panel.hidden=true;panel.setAttribute('role','group');panel.setAttribute('aria-label','Combo del Causa: tres cartas para la ulti');this.rows={};const title=document.createElement('strong');title.textContent='COMBO DEL CAUSA';panel.append(title);for(const [id,name] of Object.entries(this.names)){const card=document.createElement('div');card.className='causa-card';card.dataset.card=id;const label=document.createElement('span');label.textContent=name;const value=document.createElement('b'),bar=document.createElement('i');bar.setAttribute('role','progressbar');bar.setAttribute('aria-label',name);bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax','100');card.append(label,value,bar);panel.append(card);this.rows[id]={card,value,bar,last:-1}}const status=document.createElement('small');status.setAttribute('role','status');status.setAttribute('aria-live','polite');panel.append(status);this.status=status;this.panel=panel;document.body.append(panel)},
hud(){if(!this.panel)return;const s=P.state,u=s.ultimate;this.panel.hidden=!this.enabled()||s.mode!=='play'||!!s.court;if(this.panel.hidden||!u)return;const c=this.ensure(u),ready=u.charge>=100;for(const [id,row] of Object.entries(this.rows)){const n=ready?100:Math.min(100,Math.floor(c[id]+1e-7));if(n===row.last)continue;row.last=n;row.value.textContent=n>=100?'✓':n+'%';row.bar.style.width=n+'%';row.bar.setAttribute('aria-valuenow',String(n));row.card.classList.toggle('complete',n>=100)}const text=ready?'Tres cartas listas · Pulsa Q':u.left>0?'Ulti en curso · Carga detenida':'Combate para reunir las tres cartas';if(this.status.textContent!==text)this.status.textContent=text}
};
{const reset=P.Ultimate.reset,tick=P.Ultimate.tick,activate=P.Ultimate.activate,hud=P.Ultimate.hud,hurt=P.Entities.hurt;
P.Ultimate.reset=function(...args){const value=reset.apply(this,args);P.CausaCombo.ensure();return value};
P.Ultimate.gain=function(source){P.CausaCombo.gain(source)};
P.Ultimate.tick=function(dt){P.CausaCombo.tick(dt);return tick.call(this,dt)};
P.Ultimate.activate=function(...args){const combo=P.state.ultimate?.combo,value=activate.apply(this,args);if(value&&P.state.ultimate?.combo===combo&&!(P.Coop?.active&&!P.Combat.server))P.CausaCombo.consume();return value};
for(const ability of [P.Court,P.AnimalUltimate]){const cast=ability.activate;ability.activate=function(...args){const value=cast.apply(this,args);if(value)P.CausaCombo.consume();return value}};
P.Ultimate.hud=function(...args){const value=hud.apply(this,args);P.CausaCombo.hud();return value};
P.Entities.hurt=function(e,damage,...args){const hp=e.hp,source=args[1],blocked=P.CausaCombo.blocked(source),value=hurt.call(this,e,damage,...args);if(!blocked&&hp>0&&e.hp<hp)P.CausaCombo.hit(e,source);return value};
}P.CausaCombo.init();
