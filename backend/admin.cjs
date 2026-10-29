'use strict';
const crypto=require('node:crypto');
function createAdmin({db,reply,body,now,notify=()=>{}}){
 let engine;
 function rules(){return engine||(engine=new(require('./simulation.cjs').Simulation)('campo',[0,1]).P)}
 function read(row){const P=rules();if(!row)return {version:4,progress:P.Meta.blank(),best:0};const data=JSON.parse(row.payload);data.progress=P.Meta.normalize(data.progress);if(!Number.isSafeInteger(data.best)||data.best<0)throw Error('Guardado no válido');return data}
 function receipt(row){return {...JSON.parse(row.result),id:row.id,kind:row.kind,amount:row.amount,characterId:row.character_id,createdAt:row.created_at}}
 function entitlements(id){return {laboratory:!!db.prepare("SELECT enabled FROM user_entitlements WHERE user_id=? AND entitlement='laboratory'").get(id)?.enabled}}
 async function handle(req,res,user,url,verify){
  // El rol procede de SQLite en cada petición. Ni el nombre solo ni el frontend conceden acceso.
  if(user.role!=='admin'||user.username!=='reysuperior'){reply(res,403,{error:'Solo ReySuperior puede administrar usuarios'});return}
  if(url.pathname==='/api/admin/users'&&req.method==='GET'){
   const q=(url.searchParams.get('q')||'').toLowerCase(),after=url.searchParams.get('after')||'';if(q.length>24||after.length>24){reply(res,400,{error:'Filtro inválido'});return}
   const rows=db.prepare("SELECT u.id,u.username,u.created_at,COALESCE(r.role,'player') AS role,s.payload,s.revision FROM users u LEFT JOIN user_roles r ON r.user_id=u.id LEFT JOIN saves s ON s.user_id=u.id WHERE instr(u.username,?)>0 AND u.username>? ORDER BY u.username LIMIT 21").all(q,after);
   const users=rows.slice(0,20).map(row=>{let data;try{data=row.payload?JSON.parse(row.payload):null}catch{}return {id:row.id,username:row.username,role:row.role,createdAt:row.created_at,revision:row.revision||0,coins:Number.isSafeInteger(data?.progress?.wallet)&&data.progress.wallet>=0&&data.progress.wallet<=10000000?data.progress.wallet:0,unlocked:Array.isArray(data?.progress?.unlocked)?rules().Data.characters.filter(c=>data.progress.unlocked.includes(c.id)).map(c=>c.id):rules().Meta.blank().unlocked,entitlements:entitlements(row.id)}});
   reply(res,200,{users,next:rows.length>20?users.at(-1).username:null,characters:rules().Data.characters.map(c=>({id:c.id,name:c.name}))});return;
  }
  if(url.pathname==='/api/admin/history'&&req.method==='GET'){
   const before=Number(url.searchParams.get('before')||Number.MAX_SAFE_INTEGER);if(!Number.isSafeInteger(before)||before<1){reply(res,400,{error:'Página inválida'});return}
   const rows=db.prepare('SELECT a.*,u.username AS target FROM admin_actions a JOIN users u ON u.id=a.target_id WHERE a.id<? ORDER BY a.id DESC LIMIT 21').all(before);
   reply(res,200,{actions:rows.slice(0,20).map(r=>({...receipt(r),target:r.target})),next:rows.length>20?rows[19].id:null});return;
  }
  if(url.pathname!=='/api/admin/grants'||req.method!=='POST'){reply(res,404,{error:'Ruta no encontrada'});return}
  const b=await body(req),validKind=['coins','character','access'].includes(b?.kind),validValue=b?.kind==='coins'?Number.isSafeInteger(b.amount)&&b.amount>=1&&b.amount<=100000:b?.kind==='character'?rules().Data.characters.some(c=>c.id===b.characterId):b?.kind==='access'?b.entitlement==='laboratory'&&typeof b.enabled==='boolean':false;if(!b||typeof b.requestId!=='string'||!/^[a-f0-9-]{36}$/i.test(b.requestId)||typeof b.userId!=='string'||!Number.isSafeInteger(b.revision)||b.revision<0||!validKind||!validValue){reply(res,400,{error:'Indica un usuario, revisión y concesión válidos'});return}
  const value=b.kind==='coins'?b.amount:b.kind==='character'?b.characterId:[b.entitlement,b.enabled];const fingerprint=crypto.createHash('sha256').update(JSON.stringify([b.userId,b.revision,b.kind,value])).digest('hex');
  db.exec('BEGIN IMMEDIATE');try{
   const current=verify();if(!current||current.id!==user.id||current.role!=='admin'||current.username!=='reysuperior'){db.exec('ROLLBACK');reply(res,403,{error:'La autorización ya no está activa'});return}
   const prior=db.prepare('SELECT * FROM admin_actions WHERE actor_id=? AND request_id=?').get(user.id,b.requestId);if(prior){db.exec('ROLLBACK');reply(res,prior.fingerprint===fingerprint?200:409,prior.fingerprint===fingerprint?receipt(prior):{error:'La solicitud ya fue utilizada con otros datos'});return}
   const target=db.prepare('SELECT id,username FROM users WHERE id=?').get(b.userId);if(!target){db.exec('ROLLBACK');reply(res,404,{error:'Usuario no encontrado'});return}
   const row=db.prepare('SELECT payload,revision FROM saves WHERE user_id=?').get(target.id),revision=row?.revision||0;if(revision!==b.revision){db.exec('ROLLBACK');reply(res,409,{error:'El progreso cambió. Actualiza los usuarios antes de entregar.'});return}
   let data;try{data=read(row)}catch{db.exec('ROLLBACK');reply(res,409,{error:'El guardado requiere revisión. No se ha reemplazado ni modificado.'});return}
   if(b.kind==='coins'){if(data.progress.wallet+b.amount>10000000){db.exec('ROLLBACK');reply(res,400,{error:'La entrega supera el máximo de 10.000.000 monedas'});return}data.progress.wallet+=b.amount}
   else if(b.kind==='character'){if(data.progress.unlocked.includes(b.characterId)){db.exec('ROLLBACK');reply(res,409,{error:'El personaje ya está desbloqueado'});return}data.progress.unlocked.push(b.characterId)}
   else db.prepare('INSERT INTO user_entitlements VALUES(?,?,?,?) ON CONFLICT(user_id,entitlement) DO UPDATE SET enabled=excluded.enabled,updated_at=excluded.updated_at').run(target.id,b.entitlement,b.enabled?1:0,now());
   const at=now(),result={target:target.username,revision:revision+1,coins:data.progress.wallet,unlocked:data.progress.unlocked,entitlements:entitlements(target.id),entitlement:b.kind==='access'?b.entitlement:null,enabled:b.kind==='access'?b.enabled:null};
   db.prepare('INSERT INTO saves VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET revision=excluded.revision,payload=excluded.payload,updated_at=excluded.updated_at').run(target.id,revision+1,JSON.stringify(data),at);
   const inserted=db.prepare('INSERT INTO admin_actions(actor_id,target_id,request_id,fingerprint,result,kind,amount,character_id,created_at) VALUES(?,?,?,?,?,?,?,?,?)').run(user.id,target.id,b.requestId,fingerprint,JSON.stringify(result),b.kind,b.kind==='coins'?b.amount:null,b.kind==='character'?b.characterId:null,at);data.progress.adminCursor=Number(inserted.lastInsertRowid);db.prepare('UPDATE saves SET payload=? WHERE user_id=?').run(JSON.stringify(data),target.id);db.exec('COMMIT');notify(target.id);reply(res,200,receipt(db.prepare('SELECT * FROM admin_actions WHERE id=?').get(inserted.lastInsertRowid)));
  }catch(e){db.exec('ROLLBACK');throw e}
 }
 return {handle};
}
module.exports={createAdmin};
