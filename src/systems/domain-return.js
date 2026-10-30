'use strict';
P.DomainReturn={
 clamp(value){return Math.max(0,Math.min(1,value))},
 smooth(value){const q=this.clamp(value);return q*q*(3-2*q)},
 progress(domain){return domain?.exitTotal?this.clamp(1-domain.exit/domain.exitTotal):0},
 mix(domain,from,to,start=.14,end=.9){const q=this.smooth((this.progress(domain)-start)/(end-start));return from+(to-from)*q},
 frame(domain,from,to,start=.14,end=.9){return{x:this.mix(domain,from.x,to.x,start,end),y:this.mix(domain,from.y,to.y,start,end)}},
 number(domain,from,to,start=.14,end=.9){return this.mix(domain,from,to,start,end)},
 names(key){return{homeX:'_'+key+'ReturnX',homeY:'_'+key+'ReturnY',exitX:'_'+key+'ExitX',exitY:'_'+key+'ExitY'}},
 begin(objects,key){const n=this.names(key);for(const object of objects||[])if(object&&Number.isFinite(object[n.homeX])&&Number.isFinite(object[n.homeY])){if(!Number.isFinite(object[n.exitX]))object[n.exitX]=object.x;if(!Number.isFinite(object[n.exitY]))object[n.exitY]=object.y}},
 advance(domain,objects,key){this.begin(objects,key);const n=this.names(key),q=this.smooth((this.progress(domain)-.12)/.8);for(const object of objects||[])if(object&&Number.isFinite(object[n.homeX])&&Number.isFinite(object[n.homeY])&&Number.isFinite(object[n.exitX])&&Number.isFinite(object[n.exitY])){object.x=object[n.exitX]+(object[n.homeX]-object[n.exitX])*q;object.y=object[n.exitY]+(object[n.homeY]-object[n.exitY])*q}return q},
 clear(objects,key){const n=this.names(key);for(const object of objects||[])if(object){delete object[n.exitX];delete object[n.exitY]}}
};
