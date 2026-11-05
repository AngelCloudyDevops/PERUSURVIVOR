'use strict';
P.BossAttackArt={
 cells:{ticket:0,checkpoint:1,horn:2,skid:3,dossier:4,congressman:5,briefcase:6,ballot:7,shard:8,beacon:9,memory:10,echo:11,gift:12,coal:13,lantern:14,document:15},
 image:null,ready:false,failed:false,
 load(){if(this.image||this.failed||typeof Image==='undefined')return;const image=new Image();this.image=image;image.onload=()=>{this.ready=true};image.onerror=()=>{this.failed=true};image.src='assets/bosses/boss-attack-props-v1.webp'},
 draw(ctx,id,x,y,size=48,angle=0,alpha=1,flip=false){this.load();const index=this.cells[id];if(!this.ready||index===undefined)return false;const width=this.image.naturalWidth/4,height=this.image.naturalHeight/4,column=index%4,row=Math.floor(index/4);ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(angle);ctx.globalAlpha*=alpha;if(flip)ctx.scale(-1,1);ctx.imageSmoothingEnabled=false;ctx.drawImage(this.image,column*width,row*height,width,height,-size/2,-size/2,size,size);ctx.restore();return true}
};
P.BossAttackArt.load();
