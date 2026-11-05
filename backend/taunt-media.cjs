'use strict';
const crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const LIMIT=12*1024*1024,TYPES={
 'video/mp4':{kind:'video',ext:'.mp4'},'video/webm':{kind:'video',ext:'.webm'},
 'audio/mpeg':{kind:'audio',ext:'.mp3'},'audio/wav':{kind:'audio',ext:'.wav'},'audio/webm':{kind:'audio',ext:'.webm'}
};
function createTauntMedia({db,reply,now=Date.now,mediaDir,bodyTimeout=15000}){
 const directory=mediaDir||path.join(os.tmpdir(),'perusurvivor-taunt-media');fs.mkdirSync(directory,{recursive:true,mode:0o700});
 db.exec(`CREATE TABLE IF NOT EXISTS taunt_media(
  slot INTEGER PRIMARY KEY CHECK(slot BETWEEN 0 AND 5),id TEXT NOT NULL UNIQUE,kind TEXT NOT NULL CHECK(kind IN ('audio','video')),
  mime TEXT NOT NULL,extension TEXT NOT NULL,label TEXT NOT NULL,glyph TEXT NOT NULL,bytes INTEGER NOT NULL,
  uploader_id TEXT REFERENCES users(id) ON DELETE SET NULL,created_at INTEGER NOT NULL
 );`);
 const publicRow=row=>row?{slot:row.slot,id:row.id,kind:row.kind,label:row.label,glyph:row.glyph,bytes:row.bytes,updatedAt:row.created_at,src:'/api/taunts/media/'+row.id}:null;
 function rows(admin=false){const sql=admin?'SELECT t.*,u.username AS uploader FROM taunt_media t LEFT JOIN users u ON u.id=t.uploader_id ORDER BY slot':'SELECT * FROM taunt_media ORDER BY slot';return db.prepare(sql).all().map(row=>({...publicRow(row),...(admin?{uploader:row.uploader||'cuenta eliminada',mime:row.mime}:{} )}))}
 function allowed(user){return !!user&&(user.role==='admin'||!!user.entitlements?.taunts)}
 function decode(value,max,fallback=''){try{const text=decodeURIComponent(String(value||''));return text.length<=max?text:fallback}catch{return fallback}}
 function signature(buffer,mime){if(mime==='video/mp4')return buffer.length>12&&buffer.subarray(4,8).toString()==='ftyp';if(mime.endsWith('webm'))return buffer.length>4&&buffer.subarray(0,4).equals(Buffer.from([0x1a,0x45,0xdf,0xa3]));if(mime==='audio/wav')return buffer.length>12&&buffer.subarray(0,4).toString()==='RIFF'&&buffer.subarray(8,12).toString()==='WAVE';if(mime==='audio/mpeg')return buffer.length>3&&(buffer.subarray(0,3).toString()==='ID3'||buffer[0]===0xff&&(buffer[1]&0xe0)===0xe0);return false}
 async function raw(req){const declared=Number(req.headers['content-length']||0);if(declared>LIMIT)throw Object.assign(Error('El archivo supera 12 MB'),{status:413});let size=0,chunks=[];const timer=setTimeout(()=>req.destroy(Object.assign(Error('Tiempo de carga agotado'),{status:408})),bodyTimeout);try{for await(const chunk of req){size+=chunk.length;if(size>LIMIT)throw Object.assign(Error('El archivo supera 12 MB'),{status:413});chunks.push(chunk)}}finally{clearTimeout(timer)}if(!size)throw Object.assign(Error('Selecciona un archivo'),{status:400});return Buffer.concat(chunks,size)}
 async function publicHandle(req,res,url){
  if(url.pathname==='/api/taunts'&&req.method==='GET'){reply(res,200,{slots:rows(false)});return true}
  const match=url.pathname.match(/^\/api\/taunts\/media\/([a-f0-9-]{36})$/i);if(!match||req.method!=='GET')return false;const row=db.prepare('SELECT * FROM taunt_media WHERE id=?').get(match[1]);if(!row){reply(res,404,{error:'Burla no encontrada'});return true}const file=path.join(directory,row.id+row.extension);let stat;try{stat=fs.statSync(file)}catch{}if(!stat?.isFile()||stat.size!==row.bytes){reply(res,404,{error:'Archivo no disponible'});return true}res.writeHead(200,{'Content-Type':row.mime,'Content-Length':stat.size,'Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff'});fs.createReadStream(file).pipe(res);return true
 }
 async function adminHandle(req,res,user,url){
  if(!allowed(user)){reply(res,403,{error:'No tienes permiso para gestionar burlas'});return true}
  if(url.pathname==='/api/admin/taunts'&&req.method==='GET'){reply(res,200,{slots:rows(true),limitBytes:LIMIT,types:Object.keys(TYPES)});return true}
  const match=url.pathname.match(/^\/api\/admin\/taunts\/([0-5])$/);if(!match){reply(res,404,{error:'Ruta no encontrada'});return true}const slot=Number(match[1]);
  if(req.method==='DELETE'){const old=db.prepare('SELECT * FROM taunt_media WHERE slot=?').get(slot);if(!old){reply(res,404,{error:'La posición ya usa la burla original'});return true}db.prepare('DELETE FROM taunt_media WHERE slot=?').run(slot);try{fs.unlinkSync(path.join(directory,old.id+old.extension))}catch{}reply(res,200,{ok:true,slot});return true}
  if(req.method!=='PUT'){reply(res,405,{error:'Método no permitido'});return true}const mime=String(req.headers['content-type']||'').split(';')[0].toLowerCase(),type=TYPES[mime];if(!type){reply(res,415,{error:'Usa MP3, WAV, MP4 o WebM'});return true}const label=decode(req.headers['x-taunt-label'],28),glyph=decode(req.headers['x-taunt-glyph'],3);if(!label||!glyph){reply(res,400,{error:'Indica nombre y símbolo de la burla'});return true}const buffer=await raw(req);if(!signature(buffer,mime)){reply(res,415,{error:'El contenido no coincide con el tipo de archivo'});return true}
  const id=crypto.randomUUID(),temp=path.join(directory,'.'+id+'.upload'),file=path.join(directory,id+type.ext),old=db.prepare('SELECT * FROM taunt_media WHERE slot=?').get(slot);fs.writeFileSync(temp,buffer,{flag:'wx',mode:0o600});fs.renameSync(temp,file);try{db.prepare(`INSERT INTO taunt_media(slot,id,kind,mime,extension,label,glyph,bytes,uploader_id,created_at) VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(slot) DO UPDATE SET id=excluded.id,kind=excluded.kind,mime=excluded.mime,extension=excluded.extension,label=excluded.label,glyph=excluded.glyph,bytes=excluded.bytes,uploader_id=excluded.uploader_id,created_at=excluded.created_at`).run(slot,id,type.kind,mime,type.ext,label,glyph,buffer.length,user.id,now())}catch(error){try{fs.unlinkSync(file)}catch{}throw error}if(old)try{fs.unlinkSync(path.join(directory,old.id+old.extension))}catch{}const saved=db.prepare('SELECT t.*,u.username AS uploader FROM taunt_media t LEFT JOIN users u ON u.id=t.uploader_id WHERE t.slot=?').get(slot);reply(res,200,{...publicRow(saved),uploader:saved.uploader,mime:saved.mime});return true
 }
 return {publicHandle,adminHandle,manifest:()=>rows(false),directory,LIMIT};
}
module.exports={createTauntMedia,LIMIT};
