'use strict';
P.Updates={version:null,pending:false,busy:false,reloading:false,
init(){this.version=P.$('meta[name="game-version"]')?.content;if(!this.version||typeof fetch==='undefined')return;this.button=document.createElement('button');this.button.id='game-update';this.button.textContent='Nueva versión disponible · Actualizar';this.button.hidden=true;this.button.onclick=()=>this.reload();document.body.append(this.button);this.check();setInterval(()=>this.check(),30000);addEventListener('focus',()=>this.check());document.addEventListener('visibilitychange',()=>{if(!document.hidden)this.check()})},
reload(){if(this.reloading)return;this.reloading=true;location.reload()},
async check(){if(this.reloading||this.busy||!this.version)return;if(this.pending){this.apply();return}this.busy=true;try{const response=await fetch('version.json?t='+Date.now(),{cache:'no-store'});if(!response.ok)return;const data=await response.json();if(typeof data.version==='string'&&/^[a-f0-9]{20}$/.test(data.version)&&data.version!==this.version){this.pending=true;this.apply()}}catch{}finally{this.busy=false}},
apply(){if(!this.pending)return;if(P.state.mode==='menu'||P.state.mode==='end')this.reload();else if(this.button)this.button.hidden=false}
};
