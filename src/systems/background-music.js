'use strict';
// Un reproductor por pista individual; dos reutilizados solo al alternar.
P.BackgroundMusic={
choice:'original',volume:.35,player:null,wanted:false,failed:null,generation:0,fadeSeconds:3,prepareSeconds:12,
tracks:{tema1:'assets/music/tema-1-v1.webm',tema2:'assets/music/tema-2-v1.webm'},
gesture(){this.blocked=false;this.nextBlocked=false},
init(){
 try{const choice=localStorage.getItem('perusurvivor-music');if(choice==='original'||choice==='none'||choice==='alternate'||this.tracks[choice])this.choice=choice;const volume=localStorage.getItem('perusurvivor-music-volume');if(volume!==null&&Number.isFinite(Number(volume)))this.volume=Math.max(0,Math.min(1,Number(volume)))}catch{}
 const select=P.$('#background-music'),volume=P.$('#music-volume');
 if(select){select.value=this.choice;select.onchange=()=>{this.pause();this.generation++;this.cancelNext();this.choice=select.value;this.failed=null;this.nextBlocked=false;if(this.player)this.release(this.player);this.loaded=null;try{localStorage.setItem('perusurvivor-music',this.choice)}catch{}this.status(this.choice==='alternate'?'Tema 1 y Tema 2 · transición de 3 s.':'');P.Audio.unlock();P.Audio.sync()}}
 if(volume){volume.value=Math.round(this.volume*100);volume.oninput=()=>{this.volume=Number(volume.value)/100;this.applyVolumes();try{localStorage.setItem('perusurvivor-music-volume',String(this.volume))}catch{}P.Audio.sync()}}
 if(typeof document!=='undefined')document.addEventListener?.('visibilitychange',()=>{if(document.hidden)this.pause();else P.Audio.sync()});
},
status(text){const label=P.$('#music-status');if(label)label.textContent=text},
useSynth(){return this.choice==='original'||this.failed===this.choice},
release(player){player.pause();player.removeAttribute('src');player.load()},
cancelNext(){if(this.nextPlayer){this.release(this.nextPlayer);this.spare=this.nextPlayer}this.nextPlayer=null;this.nextTrack=null;this.fading=false},
pause(){this.wanted=false;for(const player of [this.player,this.nextPlayer])if(player&&!player.paused)player.pause()},
create(){if(typeof Audio==='undefined')return null;const player=new Audio();player.preload='none';player.loop=true;player.addEventListener('error',()=>{if(player===this.nextPlayer){this.nextBlocked=true;this.cancelNext();this.applyVolumes();this.status('No se pudo cargar la siguiente pista. Se mantiene la actual.')}else if(player===this.player){this.failed=this.choice;this.pause();this.status('No se pudo cargar la pista. Sonará la música original.')}});return player},
play(player){
 if(!player||!player.paused||player.musicPending||this.blocked)return;
 player.musicPending=true;const generation=this.generation;
 const denied=()=>{player.musicPending=false;if(generation!==this.generation||player!==this.player&&player!==this.nextPlayer)return;if(player===this.nextPlayer){this.nextBlocked=true;this.cancelNext();this.applyVolumes()}else this.blocked=true;this.status('Pulsa la pantalla para permitir la música.')};
 try{Promise.resolve(player.play()).then(()=>{player.musicPending=false;if(!this.wanted||player!==this.player&&(!this.fading||player!==this.nextPlayer))player.pause()}).catch(denied)}catch{denied()}
},
applyVolumes(){let progress=0;if(this.fading&&this.nextPlayer)progress=Math.max(0,Math.min(1,this.nextPlayer.currentTime/this.fadeSeconds));const from=this.volume*(this.fading?Math.cos(progress*Math.PI/2):1),to=this.volume*Math.sin(progress*Math.PI/2);if(this.player&&this.player.volume!==from)this.player.volume=from;if(this.nextPlayer&&this.nextPlayer.volume!==to)this.nextPlayer.volume=to},
alternate(){
 const player=this.player;if(!Number.isFinite(player.duration)||player.duration<=0||this.nextBlocked)return;
 const remaining=player.duration-player.currentTime;
 if(!this.nextPlayer&&remaining<=this.prepareSeconds){this.nextTrack=this.loaded==='tema1'?'tema2':'tema1';this.nextPlayer=this.spare||this.create();this.spare=null;if(!this.nextPlayer)return;this.nextPlayer.preload='auto';this.nextPlayer.loop=true;this.nextPlayer.volume=0;this.nextPlayer.src=this.tracks[this.nextTrack];this.nextPlayer.load()}
 if(!this.nextPlayer)return;
 if(!this.fading&&remaining<=this.fadeSeconds&&this.nextPlayer.readyState>=3){this.fading=true;this.status((this.loaded==='tema1'?'Tema 1 → Tema 2':'Tema 2 → Tema 1')+' · transición suave')}
 if(!this.fading)return;
 this.play(this.nextPlayer);this.applyVolumes();
 if(this.nextPlayer.currentTime>=this.fadeSeconds){const old=this.player;this.player=this.nextPlayer;this.loaded=this.nextTrack;this.nextPlayer=null;this.nextTrack=null;this.fading=false;this.release(old);this.spare=old;this.applyVolumes();this.status('Sonando: '+(this.loaded==='tema1'?'Tema 1':'Tema 2')+' · alternancia automática')}
},
sync(live){
 const alternating=this.choice==='alternate',track=alternating?(this.loaded||'tema1'):this.choice,source=this.tracks[track];
 if(!live||!source||this.failed===this.choice){this.pause();return}this.wanted=true;if(this.blocked)return;
 if(!this.player)this.player=this.create();if(!this.player)return;
 if(this.loaded!==track){this.loaded=track;this.player.preload='none';this.player.src=source;this.status(alternating?'Sonando: Tema 1 · alternancia automática':'')}
 this.applyVolumes();this.play(this.player);if(alternating)this.alternate();
}
};
