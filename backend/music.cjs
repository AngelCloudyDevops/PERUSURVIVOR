'use strict';
const crypto=require('node:crypto');
const MAX_TRACK_SIZE=50*1024*1024,MAX_TRACKS=20,MAX_LIBRARY_SIZE=500*1024*1024;
const TYPES=new Set(['audio/mpeg','audio/ogg','audio/wav','audio/webm','audio/mp4','audio/aac','audio/flac','audio/x-flac']);
function createMusic({db,reply,now=Date.now,bodyTimeout=60000}={}){
 db.exec(`CREATE TABLE IF NOT EXISTS music_tracks(
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL CHECK(size BETWEEN 1 AND ${MAX_TRACK_SIZE}),
  content BLOB NOT NULL,
  uploader_id TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL
 );`);
 const metadata=row=>({id:row.id,title:row.title,type:row.content_type,size:row.size,createdAt:row.created_at});
 const canManage=user=>!!user&&(user.role==='admin'||!!user.entitlements?.music);
 function json(res,status,data){reply(res,status,data)}
 function requireManager(req,res,user){if(!user){json(res,401,{error:'Inicia sesión para gestionar la música'});return false}if(req.headers['x-account-id']!==user.id){json(res,409,{error:'La sesión cambió en otra pestaña. Recarga antes de continuar.'});return false}if(!canManage(user)){json(res,403,{error:'Tu cuenta no tiene permiso para gestionar música'});return false}return true}
 async function readAudio(req){
  const declared=Number(req.headers['content-length']);if(Number.isFinite(declared)&&(declared<1||declared>MAX_TRACK_SIZE))throw Object.assign(Error('La pista debe pesar entre 1 byte y 50 MB'),{status:413});
  const chunks=[];let size=0;const timer=setTimeout(()=>req.destroy(Object.assign(Error('Tiempo de subida agotado'),{status:408})),bodyTimeout);
  try{for await(const chunk of req){size+=chunk.length;if(size>MAX_TRACK_SIZE)throw Object.assign(Error('La pista supera 50 MB'),{status:413});chunks.push(chunk)}}finally{clearTimeout(timer)}
  if(!size)throw Object.assign(Error('La pista está vacía'),{status:400});return Buffer.concat(chunks,size)
 }
 async function handle(req,res,user,url){
  const route=url.pathname;
  if(route==='/api/music'&&req.method==='GET'){
   const rows=db.prepare('SELECT id,title,content_type,size,created_at FROM music_tracks ORDER BY created_at DESC,id DESC').all();json(res,200,{tracks:rows.map(metadata),canManage:canManage(user),limit:MAX_TRACK_SIZE});return;
  }
  const match=route.match(/^\/api\/music\/([a-f0-9-]{36})(?:\/file)?$/i);
  if(match&&req.method==='GET'&&route.endsWith('/file')){
   const row=db.prepare('SELECT content_type,size,content FROM music_tracks WHERE id=?').get(match[1]);if(!row){json(res,404,{error:'Pista no encontrada'});return}
   const range=(req.headers.range||'').match(/^bytes=(\d*)-(\d*)$/),headers={'Content-Type':row.content_type,'Accept-Ranges':'bytes','Cache-Control':'public, max-age=3600','X-Content-Type-Options':'nosniff'};
   if(range){let start=range[1]?Number(range[1]):0,end=range[2]?Number(range[2]):row.size-1;if(!range[1]&&range[2]){const suffix=Number(range[2]);start=Math.max(0,row.size-suffix);end=row.size-1}if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||end<start||start>=row.size){res.writeHead(416,{...headers,'Content-Range':'bytes */'+row.size});res.end();return}end=Math.min(end,row.size-1);const body=row.content.subarray(start,end+1);res.writeHead(206,{...headers,'Content-Length':body.length,'Content-Range':`bytes ${start}-${end}/${row.size}`});res.end(body);return}
   res.writeHead(200,{...headers,'Content-Length':row.size});res.end(row.content);return;
  }
  if(route==='/api/music'&&req.method==='POST'){
   if(!requireManager(req,res,user))return;const type=(req.headers['content-type']||'').split(';')[0].trim().toLowerCase();if(!TYPES.has(type)){json(res,415,{error:'Formato de audio no permitido'});return}
   let title;try{title=decodeURIComponent(String(req.headers['x-music-name']||''))}catch{title=''}title=title.replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,120);if(!title){json(res,400,{error:'La pista necesita un nombre'});return}
   const count=db.prepare('SELECT COUNT(*) AS count,COALESCE(SUM(size),0) AS size FROM music_tracks').get();if(count.count>=MAX_TRACKS){json(res,409,{error:'La biblioteca alcanzó el máximo de 20 pistas'});return}
   const content=await readAudio(req);if(count.size+content.length>MAX_LIBRARY_SIZE){json(res,409,{error:'La biblioteca alcanzó su límite total de 500 MB'});return}
   const id=crypto.randomUUID(),createdAt=now();db.prepare('INSERT INTO music_tracks VALUES(?,?,?,?,?,?,?)').run(id,title,type,content.length,content,user.id,createdAt);json(res,201,{track:{id,title,type,size:content.length,createdAt},canManage:true,limit:MAX_TRACK_SIZE});return;
  }
  if(match&&req.method==='PATCH'&&!route.endsWith('/file')){
   if(!requireManager(req,res,user))return;let title;try{title=decodeURIComponent(String(req.headers['x-music-name']||''))}catch{title=''}title=title.replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,120);if(!title){json(res,400,{error:'La pista necesita un nombre'});return}
   const changed=db.prepare('UPDATE music_tracks SET title=? WHERE id=?').run(title,match[1]);if(!changed.changes){json(res,404,{error:'Pista no encontrada'});return}const row=db.prepare('SELECT id,title,content_type,size,created_at FROM music_tracks WHERE id=?').get(match[1]);json(res,200,{track:metadata(row)});return;
  }
  if(match&&req.method==='DELETE'&&!route.endsWith('/file')){
   if(!requireManager(req,res,user))return;const removed=db.prepare('DELETE FROM music_tracks WHERE id=?').run(match[1]);if(!removed.changes){json(res,404,{error:'Pista no encontrada'});return}json(res,200,{ok:true});return;
  }
  json(res,404,{error:'Ruta no encontrada'});
 }
 return {handle,canManage};
}
module.exports={createMusic,MAX_TRACK_SIZE};
