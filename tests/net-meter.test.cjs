'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const meter=(extra={})=>{const P={UI:{hud(){}},...extra};vm.runInNewContext(fs.readFileSync('src/ui/net-meter.js','utf8'),{P});return P};
const run=(gaps,start=0)=>{let e=start,t=start*1000;return gaps.map(g=>{e+=.04*g;t+=40*g;return {t,e}})};

test('Pérdida: 0 % con snapshots seguidos y % de los saltados en la ventana de 5 s',()=>{
 const {NetMeter}=meter();
 assert.equal(NetMeter.loss([],1000),null);
 assert.equal(NetMeter.loss(run([1]),100),null);
 const clean=run(Array(50).fill(1));assert.equal(NetMeter.loss(clean,2000),0);
 // 9 llegaron de 10 esperados (uno saltado): 10 %.
 const gap=run([1,1,1,1,2,1,1,1,1,1]);assert.equal(NetMeter.loss([{t:0,e:0},...gap],400),100*(1/11));
 // fuera de la ventana no cuenta
 assert.equal(NetMeter.loss([{t:0,e:0},{t:80,e:.08}],10000),null);
});

test('Umbrales de color: verde < 80 ms y ≤ 1 %, amarillo ≤ 150 ms y ≤ 5 %, rosa por encima',()=>{
 const {NetMeter}=meter();
 assert.equal(NetMeter.tone(42,0),'ok');assert.equal(NetMeter.tone(79,1),'ok');
 assert.equal(NetMeter.tone(80,0),'warn');assert.equal(NetMeter.tone(40,3),'warn');assert.equal(NetMeter.tone(150,5),'warn');
 assert.equal(NetMeter.tone(151,0),'bad');assert.equal(NetMeter.tone(20,6),'bad');
});

test('record ignora duplicados y reinicia con reconexión; status en solitario y cooperativo',()=>{
 const P=meter(),M=P.NetMeter;
 M.record(1,1000);M.record(1,1010);M.record(1.04,1040);assert.equal(M.samples.length,2);
 M.record(.5,1080);assert.equal(M.samples.length,1,'el reloj retrocede: partida nueva');
 assert.equal(M.status(0).text,'PING — · SOLITARIO');
 P.Coop={active:true,net:{rtt:42,at:1000}};M.samples.length=0;
 for(let i=0;i<10;i++)M.record(i*.04,1000+i*40);
 const ok=M.status(1400);assert.equal(ok.text,'PING 42 ms · PÉRDIDA 0 %');assert.equal(ok.tone,'ok');assert(ok.title.includes('no llegaron a tiempo'));
 P.Coop.net.rtt=120;assert.equal(M.status(1400).tone,'warn');
 P.Coop.net=null;assert.equal(M.status(1400).text,'PING — · PÉRDIDA 0 %');
 P.Coop.reconnecting=true;assert.equal(M.status(1400).short,'RECONECTANDO');
});

test('Avisos sobre el personaje: cola, un aviso a la vez y sin repetir el mismo texto',()=>{
 const P={state:{elapsed:0,player:{x:0,y:0}},Loot:{message:'',messageTime:0},Motion:{reduced:()=>false},Font:{title:px=>px+'px t',text:px=>px+'px s'}};
 vm.runInNewContext(fs.readFileSync('src/rendering/player-status.js','utf8'),{P,Math,WeakMap});
 const ctx={save(){},restore(){},measureText:t=>({width:t.length*7}),strokeText(){},fillText(){}},S=P.PlayerStatus;
 P.Loot.message='A';P.Loot.messageTime=3;S.drawNotices(ctx,{x:0,y:0},0);
 assert.equal(S.notices.cur.text,'A');
 P.Loot.message='B';P.Loot.messageTime=3;S.drawNotices(ctx,{x:0,y:0},0);
 assert.equal(S.notices.queue.join(),'B');
 S.drawNotices(ctx,{x:0,y:0},0);assert.equal(S.notices.queue.join(),'B','no se duplica');
 P.state.elapsed=2.7;S.drawNotices(ctx,{x:0,y:0},0);assert.equal(S.notices.cur.text,'B');
 const lines=S.noticeLines(ctx,'BARRIL DE DINAMITA · DISPÁRALE PARA CREAR UNA ZONA DE FUEGO',260);assert(lines.length>1&&lines.length<=3);
});
