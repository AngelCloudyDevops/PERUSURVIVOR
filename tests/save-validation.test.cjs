'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),http=require('node:http'),{DatabaseSync}=require('node:sqlite'),{createAccounts}=require('../backend/accounts.cjs');
const {Simulation}=require('../backend/simulation.cjs'),P=new Simulation('campo',[0,1]).P,clone=x=>JSON.parse(JSON.stringify(x));
async function harness(t,names){
 const dir=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'ps-val-')),file=path.join(dir,'db.sqlite'),origin='https://val.test';let clock=1e12;const app=createAccounts({filename:file,origins:[origin],now:()=>clock}),db=new DatabaseSync(file),users={};db.exec('PRAGMA foreign_keys=ON');
 for(const name of ['reysuperior',...names]){const id=crypto.randomUUID(),token=crypto.randomBytes(32).toString('hex');users[name]={id,token};db.prepare('INSERT INTO users VALUES(?,?,?,?,?,?)').run(id,name,'0'.repeat(128),'salt','0'.repeat(64),1);db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(crypto.createHash('sha256').update(token).digest('hex'),id,clock+6e8);if(name==='reysuperior')db.prepare("INSERT INTO user_roles VALUES(?,'admin')").run(id)}
 const server=http.createServer((q,s)=>app.handle(q,s));await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(async()=>{app.closeStreams();await new Promise(r=>server.close(r));app.close();db.close();fs.rmSync(dir,{recursive:true,force:true})});const base='http://127.0.0.1:'+server.address().port+'/api/';
 const api=async(route,method='GET',body,name=names[0])=>{const u=users[name],r=await fetch(base+route,{method,headers:{Origin:origin,'Content-Type':'application/json',Cookie:'ps_session='+u.token,'X-Account-Id':u.id},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()}};
 return {api,users,db,tick:ms=>{clock+=ms},put:(revision,progress,best=0,extra={giftSync:1},name)=>api('save','PUT',{revision,data:{version:4,progress,best},...extra},name),stored:async name=>(await api('save','GET',null,name)).data};
}
// Lo que produce el juego: partida (ganancia + estadística), gacha (coste 60; fresco desbloquea, repetido reembolsa 15)
const play=(p,coins)=>{p.wallet+=coins;p.earned+=coins;const c=p.characters.cristorata||(p.characters.cristorata={upgrades:{},runs:0,wins:0,kills:0,bestTime:0,bestLevel:1});c.runs++;c.kills+=coins*5;p.receipts.push({id:crypto.randomUUID(),character:'cristorata',coins,win:false})};
const draw=(p,id,fresh)=>{p.wallet-=60;p.gacha.draws++;if(fresh)p.unlocked.push(id);else p.wallet+=15;p.gachaHistory.push({id:crypto.randomUUID(),character:id,tier:'common',fresh,refund:fresh?0:15,at:1,copies:0})};
test('Guardado servidor: normaliza lo almacenado y rechaza lo malformado',async t=>{
 const h=await harness(t,['uno']),blank=P.Meta.blank();
 const dirty=clone(blank);dirty.unlocked.push('personaje_inventado');dirty.extra='basura';
 assert.equal((await h.put(0,dirty)).status,200);const saved=(await h.stored()).data.progress;assert(!saved.unlocked.includes('personaje_inventado'));assert.equal(saved.extra,undefined);assert.deepEqual(saved,clone(P.Meta.normalize(saved)));
 for(const bad of [{...blank,wallet:-1},{...blank,wallet:1.5},{...blank,wallet:2e7},{...blank,unlocked:'x'},{...blank,version:99},{version:4,wallet:20},{...blank,inventory:{lunch:500}}])assert.equal((await h.put(1,bad)).status,400,JSON.stringify(bad).slice(0,60));
 assert.equal((await h.put(1,blank,2e8)).status,400);assert.equal((await h.api('save','PUT',{revision:1,data:{version:4,progress:null,best:0},giftSync:1})).status,400);
 assert.equal((await h.stored()).revision,1);
});
test('Guardado servidor: cliente antiguo sin giftSync también se valida y normaliza',async t=>{
 const h=await harness(t,['uno']),p=clone(P.Meta.blank());p.unlocked.push('inexistente');
 assert.equal((await h.put(0,p,0,{})).status,200);assert(!(await h.stored()).data.progress.unlocked.includes('inexistente'));
 assert.equal((await h.put(1,{...p,wallet:'mucho'},0,{})).status,400);assert.equal((await h.put(1,{...p,unlocked:null},0,{})).status,400);
});
test('Guardado servidor: acepta secuencias de juego normal (ganar, mejorar, gacha, desbloquear)',async t=>{
 const h=await harness(t,['uno']);let p=clone(P.Meta.blank()),rev=0;const send=async(ms=0)=>{h.tick(ms);const r=await h.put(rev,p);assert.equal(r.status,200,JSON.stringify(r.data));rev=r.data.revision};
 play(p,120);await send(60000);play(p,300);await send(90000);
 p.wallet-=35;p.characters.cristorata.upgrades.speed=1;await send(1000);p.wallet+=Math.floor(35*70/100);p.characters.cristorata.upgrades={};await send(1000);
 draw(p,'najasor',true);draw(p,'cristorata',false);draw(p,'fuzo',true);await send(5000);
 for(let i=0;i<20;i++)play(p,80);for(let i=0;i<3;i++)draw(p,['g5','sustento','charles'][i],true);await send(30*60000);
 const out=(await h.stored()).data.progress;assert.equal(out.wallet,p.wallet);assert(out.unlocked.includes('charles'));assert.equal(out.earned,p.earned);
 await send();await send();
});
test('Guardado servidor: acepta reembolso de mejoras superior al saldo anterior',async t=>{
 const h=await harness(t,['uno']);const full={vitality:5,power:5,rate:5,speed:5,magnet:5};let p=clone(P.Meta.blank());p.wallet=0;p.earned=3000;p.characters.cristorata={upgrades:{...full},runs:60,wins:1,kills:1,bestTime:1,bestLevel:1};assert.equal((await h.put(0,p)).status,200);
 p.characters.cristorata.upgrades={};p.wallet=P.Meta.refund('cristorata',{characters:{cristorata:{upgrades:full}}});assert(p.wallet>2000);assert.equal((await h.put(1,p)).status,200);
});
test('Guardado servidor: importación de invitado en la primera sincronización',async t=>{
 const h=await harness(t,['uno','dos']);const guest=clone(P.Meta.blank());for(let i=0;i<30;i++)play(guest,150);draw(guest,'najasor',true);draw(guest,'fuzo',true);
 assert.equal((await h.put(0,guest,57)).status,200);const s=(await h.stored()).data;assert.equal(s.progress.wallet,guest.wallet);assert(s.progress.unlocked.includes('fuzo'));assert.equal(s.best,57);
 const cheat=clone(guest);cheat.wallet=9999999;assert.equal((await h.put(0,cheat,0,undefined,'dos')).status,200);assert.equal((await h.stored('dos')).data.progress.wallet,cheat.earned);
 const skinned=clone(guest);skinned.skins={unlocked:['cerdito-vtuber'],equipped:{}};assert.equal((await h.put(1,skinned)).status,422);
});
test('Guardado servidor: rechaza saltos de monedas, earned a la baja y desbloqueos sin explicación',async t=>{
 const h=await harness(t,['uno']);let p=clone(P.Meta.blank());play(p,200);let r=await h.put(0,p);const rev=r.data.revision,base=clone(p);
 const rejects=async(mutate,why)=>{h.tick(60000);const q=clone(base);mutate(q);const res=await h.put(rev,q);assert.equal(res.status,422,why);assert.equal((await h.stored()).revision,rev,why);assert.equal((await h.stored()).data.progress.wallet,base.wallet)};
 await rejects(q=>{q.wallet=5000000},'monedas de la nada');
 await rejects(q=>{q.wallet+=100000;q.earned+=100000},'earned sin partidas');
 await rejects(q=>{q.wallet+=100000;q.earned+=100000;q.characters.cristorata.runs+=1},'earned por encima del máximo por partida');
 await rejects(q=>{q.earned-=10},'earned a la baja');
 await rejects(q=>{q.unlocked.push('alan')},'desbloqueo sin tirada');
 await rejects(q=>{q.unlocked.push('alan','ollanta');q.gacha.draws=1},'dos desbloqueos con una tirada');
 await rejects(q=>{q.skins.unlocked.push('cerdito-vtuber')},'skin sin concesión');
 const fast=clone(base);for(let i=0;i<100;i++)play(fast,1100);assert.equal((await h.put(rev,fast)).status,422,'muchas monedas sin tiempo transcurrido');
 assert.equal((await h.put(rev,base)).status,200);
});
test('Guardado servidor: entregas de admin (monedas, personaje, skin) conviven con el progreso de la cuenta',async t=>{
 const h=await harness(t,['uno']),admin=body=>h.api('admin/grants','POST',{requestId:crypto.randomUUID(),userId:h.users.uno.id,...body},'reysuperior');
 let p=clone(P.Meta.blank()),rev=0;play(p,100);rev=(await h.put(rev,p)).data.revision;
 assert.equal((await admin({revision:rev,kind:'coins',amount:5000})).status,200);assert.equal((await admin({revision:rev+1,kind:'character',characterId:'alberto'})).status,200);assert.equal((await admin({revision:rev+2,kind:'skin',skinId:'cerdito-vtuber'})).status,200);
 play(p,60);h.tick(120000);let r=await h.put(rev,p);assert.equal(r.status,200,JSON.stringify(r.data));rev=r.data.revision;const s=(await h.stored()).data.progress;assert.equal(s.wallet,160+5000);assert(s.unlocked.includes('alberto'));assert(s.skins.unlocked.includes('cerdito-vtuber'));
 p=clone(s);draw(p,'najasor',true);draw(p,'fuzo',true);h.tick(1000);r=await h.put(rev,p);assert.equal(r.status,200,JSON.stringify(r.data));rev=r.data.revision;
 const q=clone(p);q.unlocked.push('alan');assert.equal((await h.put(rev,q)).status,422);
});
test('Guardado servidor: admin conserva su colección completa y monedas locales',async t=>{
 const h=await harness(t,['uno']),p=clone(P.Meta.blank());p.unlocked=P.Data.characters.map(c=>c.id);p.wallet=1000000;
 assert.equal((await h.put(0,p,0,undefined,'reysuperior')).status,200);p.wallet=1500000;assert.equal((await h.put(1,p,0,undefined,'reysuperior')).status,200);
});
