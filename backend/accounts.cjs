'use strict';
const crypto=require('node:crypto'),{promisify}=require('node:util'),fs=require('node:fs'),path=require('node:path');
const scrypt=promisify(crypto.scrypt),hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const COOKIE='ps_session',TTL=7*86400000;
function createAccounts({filename,origins=[],secure=true,now=Date.now}={}){
 const {DatabaseSync}=require('node:sqlite');
 if(filename!==':memory:')fs.mkdirSync(path.dirname(filename),{recursive:true,mode:0o700});
 const db=new DatabaseSync(filename);if(filename!==':memory:')fs.chmodSync(filename,0o600);db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
 CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, salt TEXT NOT NULL, recovery_hash TEXT NOT NULL, created_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS saves(user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, revision INTEGER NOT NULL DEFAULT 0, payload TEXT NOT NULL, updated_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS user_roles(user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, role TEXT NOT NULL CHECK(role='admin'));
 CREATE TABLE IF NOT EXISTS user_entitlements(user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, entitlement TEXT NOT NULL CHECK(entitlement IN ('laboratory')),enabled INTEGER NOT NULL CHECK(enabled IN (0,1)),updated_at INTEGER NOT NULL,PRIMARY KEY(user_id,entitlement));
 CREATE TABLE IF NOT EXISTS admin_actions(id INTEGER PRIMARY KEY AUTOINCREMENT,actor_id TEXT NOT NULL REFERENCES users(id),target_id TEXT NOT NULL REFERENCES users(id),request_id TEXT NOT NULL,fingerprint TEXT NOT NULL,result TEXT NOT NULL,kind TEXT NOT NULL,amount INTEGER,character_id TEXT,created_at INTEGER NOT NULL,UNIQUE(actor_id,request_id));
 CREATE TABLE IF NOT EXISTS inbox_state(user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,last_read_id INTEGER NOT NULL DEFAULT 0);
 UPDATE saves SET payload=json_set(payload,'$.progress.adminCursor',COALESCE((SELECT MAX(id) FROM admin_actions WHERE target_id=saves.user_id),0)) WHERE json_valid(payload) AND json_type(payload,'$.progress.adminCursor') IS NULL;
 PRAGMA user_version=4;`);
 const attempts=new Map();let running=0;
 function reply(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data))}
 function cookie(res,token,age=TTL/1000){res.setHeader('Set-Cookie',`${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${secure?'; Secure':''}`)}
 const sessionStatement=db.prepare("SELECT u.id,u.username,COALESCE((SELECT role FROM user_roles WHERE user_id=u.id),'player') AS role,COALESCE((SELECT enabled FROM user_entitlements WHERE user_id=u.id AND entitlement='laboratory'),0) AS laboratory FROM sessions s JOIN users u ON u.id=s.user_id WHERE token_hash=? AND expires_at>?");
 function decorateUser(row){return row?{id:row.id,username:row.username,role:row.role||'player',entitlements:{laboratory:row.role==='admin'||!!row.laboratory}}:null}
 function session(req){const token=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);if(!token||!/^[a-f0-9]{64}$/.test(token))return null;return decorateUser(sessionStatement.get(hash(token),now()))}
 function publicUser(id,username){const role=db.prepare('SELECT role FROM user_roles WHERE user_id=?').get(id)?.role||'player',laboratory=!!db.prepare("SELECT enabled FROM user_entitlements WHERE user_id=? AND entitlement='laboratory'").get(id)?.enabled;return {id,username,role,entitlements:{laboratory:role==='admin'||laboratory}}}
 function issue(res,id){db.prepare('DELETE FROM sessions WHERE expires_at<=?').run(now());const token=crypto.randomBytes(32).toString('hex');db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(hash(token),id,now()+TTL);cookie(res,token)}
 async function body(req){let text='',size=0;if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||''))throw Object.assign(Error('Se requiere JSON'),{status:415});for await(const chunk of req){size+=Buffer.byteLength(chunk);if(size>131072)throw Object.assign(Error('Guardado demasiado grande'),{status:413});text+=chunk}try{return JSON.parse(text)}catch{throw Object.assign(Error('JSON inválido'),{status:400})}}
 function limit(req){const key=req.socket.remoteAddress||'local',time=now();for(const [ip,a]of attempts)if(time-a.at>900000)attempts.delete(ip);if(attempts.size>10000&&!attempts.has(key))return false;const a=attempts.get(key)||{at:time,count:0};attempts.set(key,a);return ++a.count<=30}
 function credentials(b){if(typeof b.username!=='string'||!/^[a-zA-Z0-9_]{3,24}$/.test(b.username)||typeof b.password!=='string'||b.password.length<12||b.password.length>128)throw Object.assign(Error('Usuario: 3–24 letras, números o _. Contraseña: 12–128 caracteres.'),{status:400});return b.username.toLowerCase()}
 const friends=require('./friends.cjs').createFriends({db,reply,body,now});
 const gifts=require('./gifts.cjs').createGifts({db,session,reply});
 const admin=require('./admin.cjs').createAdmin({db,reply,body,now,notify:gifts.notify});
 const balance=require('./balance.cjs').createBalance({db,reply,body,now});
 async function handle(req,res){try{
  const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith('/api/'))return false;
  if(req.method!=='GET'&&!origins.includes(req.headers.origin)){reply(res,403,{error:'Origen no permitido'});return true}
  const route=url.pathname,user=session(req);
  if(route==='/api/balance'&&req.method==='GET'){await balance.handle(req,res,user,url,()=>session(req));return true}
  if(route==='/api/account'&&req.method==='GET'){reply(res,200,{user:user||null});return true}
  if(['/api/register','/api/login','/api/recover'].includes(route)&&req.method==='POST'){
   if(!limit(req)||running>=4){reply(res,429,{error:'Demasiados intentos. Vuelve a intentarlo más tarde.'});return true}
   running++;try{const b=await body(req),username=credentials(b),row=db.prepare('SELECT * FROM users WHERE username=?').get(username);
    if(route==='/api/register'){
     const salt=crypto.randomBytes(16).toString('hex'),password=await scrypt(b.password,salt,64),recovery=crypto.randomBytes(24).toString('hex'),id=crypto.randomUUID();
     if(row){reply(res,409,{error:'Ese usuario no está disponible'});return true}
     try{db.prepare('INSERT INTO users VALUES(?,?,?,?,?,?)').run(id,username,password.toString('hex'),salt,hash(recovery),now())}catch(e){if(String(e.code).includes('CONSTRAINT')){reply(res,409,{error:'Ese usuario no está disponible'});return true}throw e}
     issue(res,id);reply(res,201,{user:publicUser(id,username),recovery});return true;
    }
    if(route==='/api/recover'){
     const recovery=typeof b.recovery==='string'?b.recovery:'';if(!row||!crypto.timingSafeEqual(Buffer.from(hash(recovery),'hex'),Buffer.from(row.recovery_hash,'hex'))){reply(res,401,{error:'Datos de recuperación incorrectos'});return true}
     const salt=crypto.randomBytes(16).toString('hex'),password=await scrypt(b.password,salt,64),next=crypto.randomBytes(24).toString('hex');db.exec('BEGIN IMMEDIATE');try{const changed=db.prepare('UPDATE users SET password_hash=?,salt=?,recovery_hash=? WHERE id=? AND recovery_hash=?').run(password.toString('hex'),salt,hash(next),row.id,row.recovery_hash);if(changed.changes!==1){db.exec('ROLLBACK');reply(res,401,{error:'Código de recuperación ya utilizado'});return true}db.prepare('DELETE FROM sessions WHERE user_id=?').run(row.id);db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}issue(res,row.id);reply(res,200,{user:publicUser(row.id,username),recovery:next});return true;
    }
    const digest=await scrypt(b.password,row?.salt||'unavailable-account-salt',64);if(!row||!crypto.timingSafeEqual(digest,Buffer.from(row.password_hash,'hex'))){reply(res,401,{error:'Usuario o contraseña incorrectos'});return true}
    issue(res,row.id);reply(res,200,{user:publicUser(row.id,username)});return true;
   }finally{running--}
  }
  if(!user){reply(res,401,{error:'Inicia sesión'});return true}
  if(route==='/api/events'&&req.method==='GET'){gifts.open(req,res,user,url);return true}
  if(req.headers['x-account-id']!==user.id){reply(res,409,{error:'La sesión cambió en otra pestaña. Recarga la página antes de guardar.'});return true}
  if(route==='/api/friends'||route.startsWith('/api/friends/')){await friends.handle(req,res,user,url);return true}
  if(route==='/api/gifts'&&req.method==='GET'){gifts.sync(req,res,user,url);return true}
  if(route==='/api/inbox'&&req.method==='GET'){gifts.inbox(req,res,user,url);return true}
  if(route==='/api/inbox/read'&&req.method==='POST'){gifts.readInbox(req,res,user,url);return true}
  if(route==='/api/admin/balance'){await balance.handle(req,res,user,url,()=>session(req));return true}
  if(route.startsWith('/api/admin/')){await admin.handle(req,res,user,url,()=>session(req));return true}
  if(route==='/api/logout'&&req.method==='POST'){db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);cookie(res,'',0);reply(res,200,{ok:true});return true}
  if(route==='/api/save'&&req.method==='GET'){const row=db.prepare('SELECT * FROM saves WHERE user_id=?').get(user.id);reply(res,200,row?{revision:row.revision,data:JSON.parse(row.payload),updatedAt:row.updated_at}:{revision:0,data:null});return true}
  if(route==='/api/save'&&req.method==='PUT'){
   const b=await body(req);if(!Number.isSafeInteger(b.revision)||b.revision<0||!b.data||b.data.version!==4||typeof b.data.progress!=='object'||!b.data.progress||!Number.isSafeInteger(b.data.best)||b.data.best<0||b.data.best>100000000){reply(res,400,{error:'Guardado inválido'});return true}
   db.exec('BEGIN IMMEDIATE');try{const previous=db.prepare('SELECT revision,payload FROM saves WHERE user_id=?').get(user.id),revision=previous?.revision||0,merged=gifts.merge(user,b,previous);if(!merged){db.exec('ROLLBACK');reply(res,409,{error:'El progreso cambió en otra sesión. Tu copia local se conserva.'});return true}db.prepare('INSERT INTO saves VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET revision=excluded.revision,payload=excluded.payload,updated_at=excluded.updated_at').run(user.id,revision+1,JSON.stringify(merged.data),now());db.exec('COMMIT');reply(res,200,{revision:revision+1,grants:merged.grants});return true}catch(e){db.exec('ROLLBACK');throw e}
  }
  reply(res,404,{error:'Ruta no encontrada'});return true;
 }catch(e){if(!res.headersSent)reply(res,e.status||500,{error:e.status?e.message:'No se pudo completar la operación'});else res.end();return true}}
 function owns(user,id){if(!user)return true;if(user.role==='admin'||['cristorata','cuy','paloma','makanaky'].includes(id))return true;const save=db.prepare('SELECT payload FROM saves WHERE user_id=?').get(user.id);let unlocked=[];try{unlocked=JSON.parse(save?.payload||'{}').progress?.unlocked||[]}catch{}return unlocked.includes(id)||!!db.prepare('SELECT id FROM admin_actions WHERE target_id=? AND character_id=? LIMIT 1').get(user.id,id)}
 return {handle,session,owns,friends,balance,closeStreams:gifts.closeStreams,close:()=>{gifts.closeStreams();db.close()}};
}
module.exports={createAccounts};
