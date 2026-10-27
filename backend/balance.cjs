'use strict';
function createBalance({db,reply,body,now}){
 db.exec(`CREATE TABLE IF NOT EXISTS character_balance(id INTEGER PRIMARY KEY CHECK(id=1),revision INTEGER NOT NULL,payload TEXT NOT NULL);
 INSERT OR IGNORE INTO character_balance VALUES(1,0,'{}');
 CREATE TABLE IF NOT EXISTS balance_actions(id INTEGER PRIMARY KEY AUTOINCREMENT,actor_id TEXT NOT NULL REFERENCES users(id),character_id TEXT NOT NULL,revision INTEGER NOT NULL,previous TEXT,next TEXT,created_at INTEGER NOT NULL);`);
 let engine;const rules=()=>engine||(engine=new(require('./simulation.cjs').Simulation)('campo',[0]).P);
 function snapshot(){const r=db.prepare('SELECT * FROM character_balance WHERE id=1').get();return {revision:r.revision,overrides:JSON.parse(r.payload)}}
 async function handle(req,res,user,url,verify){
  if(url.pathname==='/api/balance'&&req.method==='GET'){reply(res,200,snapshot());return}
  if(!user||user.role!=='admin'){reply(res,403,{error:'Solo las cuentas admin pueden editar el balance'});return}
  if(req.method==='GET'){const P=rules();reply(res,200,{...snapshot(),fields:P.CharacterBalance.fields,characters:P.Data.characters.map(c=>({id:c.id,name:c.name,defaults:P.CharacterBalance.defaults()[c.id]})),history:db.prepare('SELECT a.character_id AS characterId,a.revision,a.created_at AS createdAt,u.username AS actor,a.previous,a.next FROM balance_actions a JOIN users u ON u.id=a.actor_id ORDER BY a.id DESC LIMIT 15').all().map(r=>({...r,previous:JSON.parse(r.previous),next:JSON.parse(r.next)}))});return}
  if(req.method!=='PUT'){reply(res,405,{error:'Método no permitido'});return}
  const b=await body(req),P=rules();if(!b||!Number.isSafeInteger(b.revision)||b.revision<0||typeof b.characterId!=='string'||!Object.hasOwn(P.CharacterBalance.defaults(),b.characterId)||!(b.stats===null||P.CharacterBalance.valid(b.stats))){reply(res,400,{error:'Personaje o estadísticas fuera de los límites permitidos'});return}
  db.exec('BEGIN IMMEDIATE');try{const current=verify();if(!current||current.id!==user.id||current.role!=='admin'){db.exec('ROLLBACK');reply(res,403,{error:'El permiso admin ya no está activo'});return}const data=snapshot();if(data.revision!==b.revision){db.exec('ROLLBACK');reply(res,409,{error:'Otro admin cambió el balance. Recarga los valores antes de guardar.'});return}const previous=data.overrides[b.characterId]||null;if(b.stats===null)delete data.overrides[b.characterId];else data.overrides[b.characterId]={...b.stats};data.revision++;db.prepare('UPDATE character_balance SET revision=?,payload=? WHERE id=1').run(data.revision,JSON.stringify(data.overrides));db.prepare('INSERT INTO balance_actions(actor_id,character_id,revision,previous,next,created_at) VALUES(?,?,?,?,?,?)').run(user.id,b.characterId,data.revision,JSON.stringify(previous),JSON.stringify(b.stats),now());db.exec('COMMIT');reply(res,200,data)}catch(e){db.exec('ROLLBACK');throw e}
 }
 return {snapshot,handle};
}
module.exports={createBalance};
